import { auth } from "@/auth";
import { redirect } from "next/navigation";
import UserList from "@/components/admin/UserList";

export default async function AdminPage() {
  const session = await auth();
  
  // Check if user is authenticated and is admin
  if (!session?.user || session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">User Management</h2>
        <UserList />
      </div>
    </div>
  );
}