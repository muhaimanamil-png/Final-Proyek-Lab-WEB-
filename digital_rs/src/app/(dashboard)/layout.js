import { cookies } from "next/headers";
import Sidebar from "@/components/layout/Sidebar";

export default async function DashboardLayout({ children }) {
  const cookieStore = await cookies();
  const role = cookieStore.get("rs_role")?.value || "Pasien";
  return (
    <div>
      <Sidebar role={["Admin","Dokter","Pasien"].includes(role) ? role : "Pasien"} />
      <main className="ml-60 min-h-screen p-7 max-lg:ml-0">{children}</main>
    </div>
  );
}