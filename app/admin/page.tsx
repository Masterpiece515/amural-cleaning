import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";
import { getOrders, getStats } from "@/lib/orders";
import AdminDashboard from "./AdminDashboard";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!verifyToken(token)) {
    redirect("/admin/login");
  }

  const orders = await getOrders();
  const stats = await getStats();

  return <AdminDashboard initialOrders={orders} initialStats={stats} />;
}
