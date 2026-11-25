"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui";

export default function Sidebar({ role = "Pasien" }) {
  const router=useRouter();
  async function logout(){
    await fetch("/api/logout",{method:"POST"});
    router.push("/login");
    router.refresh();
  }
  const menus = {
    Admin: [["Beranda","/dashboard","home"],["Pengguna","/admin/users","users"],["Poli","/admin/poli","medical"],["Janji Temu","/admin/appointments","calendar"],["Obat","/admin/obat","pill"],["Farmasi","/admin/farmasi","pill"],["Profil","/profile","profile"]],
    Dokter: [["Beranda","/dashboard","home"],["Pasien","/dokter/pasien","users"],["Konsultasi","/dokter/konsultasi","medical"],["Janji Temu","/dokter/appointments","calendar"],["Jadwal Praktik","/dokter/jadwal","clock"],["Profil","/profile","profile"]],
    Pasien: [["Beranda","/dashboard","home"],["Janji Temu","/pasien/appointments","calendar"],["Rekam Medis","/pasien/rekam-medis","medical"],["Profil","/profile","profile"]],
  };
  return (
    <aside className="fixed left-0 top-0 z-30 flex min-h-screen w-60 flex-col bg-slate-800 p-5 text-slate-200">
      <Link href="/dashboard" className="mb-8 flex items-center gap-2.5 font-black text-white">
        <span className="grid size-10 place-items-center rounded-xl bg-teal-500 text-xl">+</span>
        RSDigital
      </Link>
      <nav className="grid gap-1.5">
        {menus[role].map(([label, href, icon]) => (
          <Link key={href} href={href} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-200 transition hover:bg-white/10 hover:text-white">
            <Icon name={icon} size={18} /> {label}
          </Link>
        ))}
      </nav>
      <button onClick={logout} className="mt-auto flex cursor-pointer items-center gap-3 px-3 py-2.5 text-left text-slate-300">
        <Icon name="logout" size={18} /> Keluar
      </button>
    </aside>
  );
}