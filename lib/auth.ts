import jwt from "jsonwebtoken";

const JWT_SECRET = "student_management_secret";

export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}
