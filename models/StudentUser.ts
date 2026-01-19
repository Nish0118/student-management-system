import mongoose from "mongoose";

const StudentUserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
  },
  { timestamps: true }
);

export default mongoose.models.StudentUser ||
  mongoose.model("StudentUser", StudentUserSchema);
