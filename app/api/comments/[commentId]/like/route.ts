import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import Comment from "@/models/comment";
import { auth } from "@/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { commentId: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { commentId } = params;
    await connectToDatabase();
    
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    const userId = session.user.id;
    const userLikeIndex = comment.likes.indexOf(userId);
    
    if (userLikeIndex > -1) {
      // Unlike
      comment.likes.splice(userLikeIndex, 1);
    } else {
      // Like
      comment.likes.push(userId);
    }

    await comment.save();
    return NextResponse.json(comment);
  } catch (error) {
    return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 });
  }
}