import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
import Student from "../../../../models/Student";
import { verifyToken } from "../../../../lib/auth";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();
    const { name, rollNo, email, className } = await req.json();

    const student = await Student.create({
      name,
      rollNo,
      email,
      className,
    });

    return NextResponse.json({
      message: "Student added successfully",
      student,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add student" },
      { status: 500 }
    );
  }
}
