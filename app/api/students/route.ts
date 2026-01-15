import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Student from "@/models/Student";
export async function GET() {
  try {
    await dbConnect();
    const students = await Student.find().sort({ createdAt: -1 });

    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch students" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const student = await Student.create({
      name: body.name,
      rollNo: body.rollNo,
      email: body.email,
      className: body.className,
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to add student" },
      { status: 500 }
    );
  }
}
