import Link from "next/link";
import { PageHeader, Badge } from "@/components/ui";
import pool from "@/lib/db";
import { getSession } from "@/lib/auth";

export default async function ConsultQueue() {
  const session=await getSession();
  const {rows}=await pool.query(`SELECT k.id,p.full_name,k.complaint,j.start_time
    FROM konsultasi k JOIN users p ON p.id=k.patient_id JOIN jadwal j ON j.id=k.schedule_id
    WHERE k.doctor_id=$1 AND k.status='Approved' AND k.booking_date=CURRENT_DATE
    ORDER BY j.start_time`,[session?.id]);
  return <>
    <PageHeader title="Antrean Konsultasi" subtitle="Pasien dengan janji temu yang telah disetujui" />
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full"><thead><tr className="text-left text-xs uppercase tracking-wide text-slate-500"><th className="border-b border-slate-100 px-4 py-3">ID</th><th className="border-b border-slate-100 px-4 py-3">Pasien</th><th className="border-b border-slate-100 px-4 py-3">Waktu</th><th className="border-b border-slate-100 px-4 py-3">Keluhan</th><th className="border-b border-slate-100 px-4 py-3">Status</th><th className="border-b border-slate-100 px-4 py-3">Aksi</th></tr></thead><tbody>{rows.map(r=><tr key={r.id} className="border-b border-slate-100 text-sm last:border-b-0"><td className="px-4 py-3">K-{String(r.id).padStart(3,"0")}</td><td className="px-4 py-3 font-bold">{r.full_name}</td><td className="px-4 py-3">{String(r.start_time).slice(0,5)}</td><td className="px-4 py-3">{r.complaint}</td><td className="px-4 py-3"><Badge tone="approved">Approved</Badge></td><td className="px-4 py-3"><Link href={`/dokter/konsultasi/${r.id}`} className="inline-flex min-h-9 items-center rounded-lg bg-teal-600 px-3 font-bold text-white">Proses</Link></td></tr>)}</tbody></table></div></article>
  </>;
}