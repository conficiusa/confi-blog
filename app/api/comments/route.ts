import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import Comment from "@/models/comment";
import connectToDatabase from "@/lib/mongoose";

export async function GET(req: NextRequest) {
  try {
    const postId = req.nextUrl.searchParams.get("postId");
    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const comments = await Comment.find({
      postId,
      parentId: null,
    }).sort({ createdAt: -1 });

    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

export const POST = auth(async (req) => {
  try {
    if (!req.auth) {
      return NextResponse.json(
        { error: "You are not authenticated" },
        { status: 401 }
      );
    }
    const session = req.auth;
    const { postId, content, parentId } = await req.json();

    if (!postId || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    await connectToDatabase();
    const comment = await Comment.create({
      postId,
      user: {
        name: session.user.name,
        userId: session.user.id,
        image: session.user.image,
      },
      content,
      parentId: parentId || null,
      likes: [],
      replies: [],
    });

    console.log("Comment created", comment);
    if (parentId) {
      const parentComment = await Comment.findById(parentId);
      if (parentComment) {
        parentComment.replies.push(comment._id);
        await parentComment.save();
      }
    }

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
});
