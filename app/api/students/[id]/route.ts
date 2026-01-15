import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Student from "@/models/Student";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await context.params;

    await Student.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Student deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to delete student" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const body = await req.json();

    const { id } = await context.params;

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      body,
      { new: true }
    );

    return NextResponse.json(updatedStudent, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update student" },
      { status: 500 }
    );
  }
}
