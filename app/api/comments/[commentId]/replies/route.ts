import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import Comment from "@/models/comment";
import { auth } from "@/auth";

export async function GET(req: NextRequest, props: { params: Promise<{ commentId: string }> }) {
  const params = await props.params;
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { commentId } = params;
    if (!commentId) {
      return NextResponse.json(
        { error: "Comment ID is required" },
        {
          status: 400,
        }
      );
    }
    await connectToDatabase();
    const replies = await Comment.find({ parentId: params.commentId }).sort({
      createdAt: -1,
    });

    if (!replies) {
      return NextResponse.json(
        { error: "Failed to fetch replies" },
        { status: 404 }
      );
    }
    return NextResponse.json(replies, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch replies" },
      { status: 500 }
    );
  }
}
