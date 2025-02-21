"use client";
import { Comment } from "@/lib/definitions";
import {
  useReplies,
  useToggleLike,
  useAddComment,
  useDeleteComment,
  useEditComment,
} from "@/lib/hooks/useComments";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { format } from "date-fns";
import {
  Heart,
  Loader2,
  MessageCircle,
  MoreVertical,
  Pencil,
  Trash,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface CommentItemProps {
  comment: Comment;
  postId: string;
}

export function CommentItem({ comment, postId }: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [editContent, setEditContent] = useState(comment.content);
  const [showReplies, setShowReplies] = useState(false);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { data: replies } = useReplies(comment.id);
  const toggleLike = useToggleLike();
  const addComment = useAddComment();
  const deleteComment = useDeleteComment();
  const editComment = useEditComment();

  const hasLiked = userId ? comment.likes.includes(userId) : false;
  const isAuthor = userId === comment.user?.userId;

  const handleLike = () => {
    if (!session?.user?.id) return;
    toggleLike.mutate({
      commentId: comment.id,
      parentId: comment.parentId,
    });
  };

  const handleDelete = async () => {
    if (!isAuthor) return;
    try {
      await deleteComment.mutateAsync({
        commentId: comment.id,
        parentId: comment.parentId,
      });
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const handleEdit = async () => {
    if (!isAuthor || !editContent.trim()) return;
    try {
      await editComment.mutateAsync({
        commentId: comment.id,
        content: editContent,
        parentId: comment.parentId,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to edit comment:", error);
    }
  };

  const handleReply = async () => {
    if (!session?.user?.id || !replyContent.trim()) return;

    try {
      await addComment.mutateAsync({
        postId,
        content: replyContent,
        parentId: comment.id,
        userId: session.user.id,
      });

      setReplyContent("");
      setIsReplying(false);
      setShowReplies(true);
    } catch (error) {
      console.error("Failed to add reply:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <Avatar>
          <AvatarImage src={comment.user?.image} />
          <AvatarFallback>{comment.user?.name?.[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{comment.user?.name}</span>
              <span className="text-sm text-muted-foreground">
                {format(new Date(comment.createdAt), "dd/MM/yyyy")}
              </span>
            </div>
            {isAuthor && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleDelete}>
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={3}
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(comment.content);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleEdit}
                  className="min-w-[5rem]"
                  disabled={!editContent.trim() || editComment.isPending}
                >
                  {editComment.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin duration-1000" />
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-xs">{comment.content}</p>
          )}
          <div className="flex items-center gap-4">
            <div className="flex gap-4 items-center">
              <span className="flex items-center text-xs text-primary">
                <Heart
                  onClick={handleLike}
                  className={`h-4 w-4 mr-2 ${hasLiked ? "fill-primary hover:fill-primary" : ""}`}
                />
                {comment.likes.length > 0 ? comment.likes.length : ""}
              </span>

              <MessageCircle
                className="h-4 w-4"
                onClick={() => setIsReplying(!isReplying)}
              />
            </div>
            {replies && replies.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplies(!showReplies)}
                className="text-xs"
              >
                {showReplies ? "Hide Replies" : "Show Replies"} (
                {replies.length})
              </Button>
            )}
          </div>
        </div>
      </div>

      {isReplying && (
        <div className="ml-12 space-y-2">
          <Textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
            rows={3}
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsReplying(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleReply}
              disabled={!replyContent.trim() || addComment.isPending}
            >
              {addComment.isPending ? "Posting..." : "Reply"}
            </Button>
          </div>
        </div>
      )}

      {showReplies && replies && (
        <div className="ml-12 space-y-4">
          {replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} postId={postId} />
          ))}
        </div>
      )}
    </div>
  );
}
