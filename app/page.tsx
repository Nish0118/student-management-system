import { redirect } from "next/navigation";
<div className="flex gap-4">
  <a href="/login" className="btn">Admin Login</a>
  <a href="/student/login" className="btn">Student Login</a>
</div>
export default function Home() {
  redirect("/login");
}
