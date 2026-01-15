import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
import Student from "../../../../models/Student";
import { verifyToken } from "../../../../lib/auth";

export async function DELETE(req: Request) {
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

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 }
      );
    }

    await Student.findByIdAndDelete(id);

    return NextResponse.json({
      message: "Student deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete student" },
      { status: 500 }
    );
  }
}
