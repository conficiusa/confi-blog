import { auth } from "@/auth";
import connectToDatabase from "@/lib/mongoose";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    connectToDatabase();
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const body = await req.json();
    const { interests } = body;

    if (!interests || !Array.isArray(interests)) {
      return NextResponse.json(
        { error: "Invalid interests data" },
        { status: 400 }
      );
    }

    const addedInterests = await User.findOneAndUpdate(
      { email: session.user.email },
      { interests }
    );
    if (!addedInterests) {
      return NextResponse.json(
        { error: "Failed to save interests" },
        { status: 500 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[INTERESTS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
