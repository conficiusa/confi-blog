'use client'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Comment, CommentInput } from '../definitions';
import { useSession } from 'next-auth/react';

export const useComments = (postId: string) => {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const res = await fetch(`/api/comments?postId=${postId}`);
      if (!res.ok) throw new Error('Failed to fetch comments');
      return res.json() as Promise<Comment[]>;
    },
    placeholderData:keepPreviousData,
  });
};

export const useReplies = (commentId: string) => {
  return useQuery({
    queryKey: ['replies', commentId],
    queryFn: async () => {
      const res = await fetch(`/api/comments/${commentId}/replies`);
      if (!res.ok) throw new Error('Failed to fetch replies');
      return res.json() as Promise<Comment[]>;
    },
    placeholderData:keepPreviousData
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CommentInput) => {
      const res = await fetch('/api/comments', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to add comment');
      return res.json() as Promise<Comment>;
    },
    onSuccess: (newComment) => {
      // Update main comments list if it's a top-level comment
      if (!newComment.parentId) {
        queryClient.setQueryData<Comment[]>(['comments', newComment.postId], (old = []) => {
          return [newComment, ...old];
        });
      }
      // Update replies list if it's a reply
      else {
        queryClient.setQueryData<Comment[]>(['replies', newComment.parentId], (old = []) => {
          return [newComment, ...old];
        });
      }
    },
  });
};

export const useToggleLike = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  type Context = {
    previousComments?: Comment[];
    previousReplies?: Comment[];
    commentId: string;
    parentId?: string | null;
  };

  return useMutation<Comment, Error, { commentId: string; parentId?: string | null }, Context>({
    mutationFn: async ({ commentId }) => {
      const res = await fetch(`/api/comments/${commentId}/like`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to toggle like');
      return res.json() as Promise<Comment>;
    },
    onMutate: async ({ commentId, parentId }) => {
      if (!session?.user?.id) throw new Error('User not authenticated');

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['comments'] });
      await queryClient.cancelQueries({ queryKey: ['replies'] });

      // Store previous state
      const previousComments = parentId ? undefined : queryClient.getQueryData<Comment[]>(['comments']) || [];
      const previousReplies = parentId ? queryClient.getQueryData<Comment[]>(['replies', parentId]) : undefined;

      // Helper function to update likes in a comment
      const updateLikes = (comment: Comment) => {
        if (comment.id === commentId) {
          const likes = [...comment.likes];
          const likeIndex = likes.indexOf(session.user.id);
          if (likeIndex > -1) {
            likes.splice(likeIndex, 1);
          } else {
            likes.push(session.user.id);
          }
          return { ...comment, likes };
        }
        return comment;
      };

      // Optimistically update
      if (parentId) {
        // Update replies
        queryClient.setQueryData<Comment[]>(['replies', parentId], (old = []) => {
          return old.map(updateLikes);
        });
      } else {
        // Update main comments
        queryClient.setQueryData<Comment[]>(['comments'], (old = []) => {
          return old.map(updateLikes);
        });
      }

      return { previousComments, previousReplies, commentId, parentId };
    },
    onError: (_error, _variables, context) => {
      if (context) {
        // Restore previous state based on whether it was a reply or main comment
        if (context.parentId && context.previousReplies) {
          queryClient.setQueryData(['replies', context.parentId], context.previousReplies);
        } else if (context.previousComments) {
          queryClient.setQueryData(['comments'], context.previousComments);
        }
      }
    },
    onSettled: (_data, _error, variables) => {
      // Invalidate relevant queries
      if (variables.parentId) {
        queryClient.invalidateQueries({ queryKey: ['replies', variables.parentId] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['comments'] });
      }
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ commentId, parentId }: { commentId: string; parentId?: string | null }) => {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete comment');
      return { commentId, parentId };
    },
    onSuccess: ({ commentId, parentId }) => {
      if (parentId) {
        // Update replies list if it's a reply
        queryClient.setQueryData<Comment[]>(['replies', parentId], (old = []) => {
          return old.filter(comment => comment.id !== commentId);
        });
        queryClient.invalidateQueries({queryKey:["replies",parentId]})
      } else {
        // Update main comments list if it's a top-level comment
        queryClient.setQueryData<Comment[]>(['comments'], (old = []) => {
          return old.filter(comment => comment.id !== commentId);
        });
        queryClient.invalidateQueries({queryKey:["comments"]})
      }
    },
  });
};

export const useEditComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ commentId, content, parentId }: { commentId: string; content: string; parentId?: string | null }) => {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: 'PATCH',
        body: JSON.stringify({ content }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to edit comment');
      return res.json() as Promise<Comment>;
    },
    onSuccess: (updatedComment, { parentId }) => {
      const updateComment = (old: Comment[]) => {
        return old.map(comment => 
          comment.id === updatedComment.id ? updatedComment : comment
        );
      };

      if (parentId) {
        // Update replies list if it's a reply
        queryClient.setQueryData<Comment[]>(['replies', parentId], (old = []) => updateComment(old));
      } else {
        // Update main comments list if it's a top-level comment
        queryClient.setQueryData<Comment[]>(['comments'], (old = []) => updateComment(old));
      }
    },
  });
};