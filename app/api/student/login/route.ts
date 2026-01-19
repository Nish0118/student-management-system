import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import StudentUser from "@/models/StudentUser";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    const student = await StudentUser.findOne({ email });
    if (!student) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { id: student._id },
      "secretkey",
      { expiresIn: "1h" }
    );

    return NextResponse.json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Login failed" },
      { status: 500 }
    );
  }
}
