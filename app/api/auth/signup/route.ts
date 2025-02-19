// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import connectToDatabase from "@/lib/mongoose";
import { SignUpSchema } from "@/lib/schema";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { email, password, name, confirmPassword } = await req.json();

    const validatedFields = SignUpSchema.safeParse({
      email,
      password,
      name,
      confirmPassword,
    });

    if (!validatedFields.success) {
      return NextResponse.json(
        { message: "Invalid Data", errors: validatedFields.error.errors },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "This email is already in use" },
        { status: 400 }
      );
    }

    const newUser = await User.create({
      email,
      password,
      name,
      confirmPassword,
    });

    // 6. Respond with success
    return NextResponse.json(
      {
        status: "success",
        message: "User created and signed in successfully",
        data: {
          user: {
            id: newUser._id,
            email: newUser.email,
          },
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
