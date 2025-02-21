"use client";
import { useComments, useAddComment } from "@/lib/hooks/useComments";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { CommentItem } from "./CommentItem";
import { Label } from "./ui/label";

interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const [content, setContent] = useState("");
  const { data: session } = useSession();
  const { data: comments, isLoading } = useComments(postId);
  const addComment = useAddComment();

  const handleSubmit = async () => {
    if (!session || !content.trim()) return;

    await addComment.mutateAsync({
      postId,
      content,
      userId: session.user.id,
    });

    setContent("");
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading comments...</div>;
  }

  return (
    <div className="sm:bg-muted md:px-8  md:py-10 px-2 mt-4 py-3">
      <div className="max-w-3xl mx-auto ">
        <h2 className="text-4xl font-semibold mb-4">Comments</h2>

        {session ? (
          <div className="space-y-2">
            <Label htmlFor="comment" className="font-semibold text-lg">
              Leave a comment
            </Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write a comment..."
              rows={3}
              id="comment"
            />
            <div className="flex justify-end">
              <Button onClick={handleSubmit} disabled={!content.trim()}>
                Post Comment
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Please sign in to comment.</p>
        )}

        <div className="space-y-6 mt-3">
          {comments?.map((comment) => (
            <div
              className="border-b-[0.5px] border-b-muted-foreground/50 pb-2"
              key={comment.id}
            >
              <CommentItem comment={comment} postId={postId} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
