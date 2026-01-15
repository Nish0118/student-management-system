import mongoose, { Schema, models } from "mongoose";

const StudentSchema = new Schema(
  {
    name: { type: String, required: true },
    rollNo: { type: String, required: true },
    email: { type: String, required: true },
    className: { type: String, required: true },
  },
  { timestamps: true }
);

const Student = models.Student || mongoose.model("Student", StudentSchema);

export default Student;
