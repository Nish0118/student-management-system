import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import StudentUser from "@/models/StudentUser";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, email, password } = await req.json();

    const existing = await StudentUser.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { message: "Student already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await StudentUser.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: "Student registered successfully" },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Registration failed" },
      { status: 500 }
    );
  }
}
