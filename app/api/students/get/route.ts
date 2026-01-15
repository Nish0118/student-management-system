import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
import Student from "../../../../models/Student";
import { verifyToken } from "../../../../lib/auth";

export async function GET(req: Request) {
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
    const students = await Student.find();

    return NextResponse.json({ students });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}
