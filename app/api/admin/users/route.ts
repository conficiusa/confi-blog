import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectToDatabase from "@/lib/mongoose";
import User from "@/models/user";

export async function GET() {
  try {
    // Check if user is authenticated and is admin
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const users = await User.find({}, "-__v").sort({ createdAt: -1 });
    
    return NextResponse.json(
      users.map((user) => {
        // Explicitly format the date fields to ensure they're included
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          createdAt: user.createdAt || new Date(user._id.getTimestamp()),
          updatedAt: user.updatedAt,
          interests: user.interests,
        };
      })
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}