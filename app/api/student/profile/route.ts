import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import Student from "@/models/Student";

export async function GET(req: Request) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  const decoded: any = jwt.verify(token!, process.env.JWT_SECRET!);

  await dbConnect();
  const student = await Student.findOne({ email: decoded.email });

  return NextResponse.json(student);
}

export async function PUT(req: Request) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  const decoded: any = jwt.verify(token!, process.env.JWT_SECRET!);

  const body = await req.json();

  await dbConnect();
  const updated = await Student.findOneAndUpdate(
    { email: decoded.email },
    body,
    { new: true }
  );

  return NextResponse.json(updated);
}
