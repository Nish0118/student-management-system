import mongoose from "mongoose";

const MONGODB_URI =
  "mongodb://127.0.0.1:27017/student_management_system";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// @ts-ignore
let cached: MongooseCache = global.mongoose || {
  conn: null,
  promise: null,
};

// @ts-ignore
if (!global.mongoose) {
  // @ts-ignore
  global.mongoose = cached;
}

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;

