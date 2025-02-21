'use client';

import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { useSession } from 'next-auth/react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Avatar } from './ui/avatar';
import { ThumbsUp } from 'lucide-react';
import { type Comment } from '@/lib/definitions';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface CommentSectionProps {
  postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const { data: session } = useSession();
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  
  const { data: comments, error } = useSWR<Comment[]>(
    `/api/comments?postId=${postId}`,
    fetcher
  );

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !newComment.trim()) return;

    // Optimistic update
    const optimisticComment = {
      id: Date.now().toString(),
      content: newComment,
      user: {
        name: session.user.name!,
        userId: session.user.id,
        image: session.user.image!,
      },
      likes: [],
      replies: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      postId,
    };

    mutate(
      `/api/comments?postId=${postId}`,
      [...(comments || []), optimisticComment],
      false
    );

    setNewComment('');

    try {
      await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, content: newComment }),
      });
      
      mutate(`/api/comments?postId=${postId}`);
    } catch (error) {
      // Revert optimistic update on error
      mutate(`/api/comments?postId=${postId}`);
    }
  };

  const handleLike = async (commentId: string) => {
    if (!session) return;

    // Optimistic update
    const updatedComments = comments?.map(comment => {
      if (comment.id === commentId) {
        const hasLiked = comment.likes.includes(session.user.id);
        return {
          ...comment,
          likes: hasLiked
            ? comment.likes.filter(id => id !== session.user.id)
            : [...comment.likes, session.user.id],
        };
      }
      return comment;
    });

    mutate(`/api/comments?postId=${postId}`, updatedComments, false);

    try {
      await fetch(`/api/comments/${commentId}/like`, {
        method: 'POST',
      });
    } catch (error) {
      // Revert optimistic update on error
      mutate(`/api/comments?postId=${postId}`);
    }
  };

  const handleReply = async (parentId: string) => {
    if (!session || !replyContent.trim()) return;

    const optimisticReply = {
      id: Date.now().toString(),
      content: replyContent,
      user: {
        name: session.user.name!,
        userId: session.user.id,
        image: session.user.image!,
      },
      likes: [],
      replies: [],
      parentId,
      createdAt: new Date(),
      updatedAt: new Date(),
      postId,
    };

    // Update UI optimistically
    const updatedComments = comments?.map(comment => {
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: [...comment.replies, optimisticReply.id],
        };
      }
      return comment;
    });

    mutate(`/api/comments?postId=${postId}`, updatedComments, false);
    setReplyContent('');
    setReplyingTo(null);

    try {
      await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          content: replyContent,
          parentId,
        }),
      });
      
      mutate(`/api/comments?postId=${postId}`);
    } catch (error) {
      mutate(`/api/comments?postId=${postId}`);
    }
  };

  if (error) return <div>Failed to load comments</div>;
  if (!comments) return <div>Loading comments...</div>;

  return (
    <div className="space-y-6">
      {session && (
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="min-h-[100px]"
          />
          <Button type="submit" disabled={!newComment.trim()}>
            Post Comment
          </Button>
        </form>
      )}

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="space-y-2">
            <div className="flex items-start space-x-3">
              <Avatar>
                <img
                  src={comment.user?.image}
                  alt={comment.user?.name}
                  className="h-10 w-10 rounded-full"
                />
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{comment.user?.name}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-1">{comment.content}</p>
                <div className="mt-2 flex items-center space-x-4">
                  <button
                    onClick={() => handleLike(comment.id)}
                    className={`flex items-center space-x-1 text-sm ${
                      session && comment.likes.includes(session.user.id)
                        ? 'text-blue-600'
                        : 'text-gray-500'
                    }`}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>{comment.likes.length}</span>
                  </button>
                  {session && (
                    <button
                      onClick={() => setReplyingTo(comment.id)}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Reply
                    </button>
                  )}
                </div>

                {replyingTo === comment.id && (
                  <div className="mt-4 space-y-2">
                    <Textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Write a reply..."
                      className="min-h-[80px]"
                    />
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleReply(comment.id)}
                        disabled={!replyContent.trim()}
                      >
                        Reply
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setReplyingTo(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}