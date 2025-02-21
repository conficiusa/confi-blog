import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import Comment from "@/models/comment";
import { auth } from "@/auth";

export async function DELETE(req: NextRequest, props: { params: Promise<{ commentId: string }> }) {
  const params = await props.params;
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { commentId } = params;
    await connectToDatabase();
    
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // Check if user is the comment author
    if (comment.user?.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized to delete this comment" }, { status: 403 });
    }

    // If this is a parent comment, delete all replies
    if (!comment.parentId) {
      await Comment.deleteMany({ parentId: commentId });
    } else {
      // If this is a reply, remove it from parent's replies array
      await Comment.updateOne(
        { _id: comment.parentId },
        { $pull: { replies: commentId } }
      );
    }

    await comment.deleteOne();
    return NextResponse.json({ message: "Comment deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ commentId: string }> }
) {
  const params = await props.params;
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { commentId } = params;
    const { content } = await req.json();

    if (!content?.trim()) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    await connectToDatabase();
    
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // Check if user is the comment author
    if (comment.user?.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized to edit this comment" }, { status: 403 });
    }

    comment.content = content;
    await comment.save();

    return NextResponse.json(comment);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update comment" }, { status: 500 });
  }
}