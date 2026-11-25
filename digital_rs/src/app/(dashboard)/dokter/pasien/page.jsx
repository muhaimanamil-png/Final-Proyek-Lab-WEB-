import { PageHeader, Badge } from "@/components/ui";
import Link from "next/link";
import pool from "@/lib/db";
import { getSession } from "@/lib/auth";

export default async function DoctorPatients({searchParams}) {
  const session=await getSession();
  const params=await searchParams;
  const query=params?.q||"";
  const values=[session?.id];
  const filter=query?` AND (p.full_name ILIKE $2 OR rm.diagnosis ILIKE $2)`:[];
  if(query)values.push(`%${query}%`);
  const {rows}=await pool.query(`SELECT DISTINCT ON (p.id) p.id,p.full_name,rm.created_at,rm.diagnosis
    FROM rekam_medis rm JOIN users p ON p.id=rm.patient_id
    WHERE rm.doctor_id=$1${filter} ORDER BY p.id,rm.created_at DESC`,values);
  return <>
    <PageHeader title="Daftar Pasien" subtitle="Pasien yang pernah Anda tangani" />
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="p-4"><input className="min-h-11 max-w-sm w-full rounded-lg border border-slate-300 px-3 outline-none focus:border-teal-500" placeholder="Cari nama atau diagnosis pasien..." /></div><div className="overflow-x-auto"><table className="w-full"><thead><tr className="text-left text-xs uppercase tracking-wide text-slate-500"><th className="border-b border-slate-100 px-4 py-3">Nama Pasien</th><th className="border-b border-slate-100 px-4 py-3">Terakhir Diperiksa</th><th className="border-b border-slate-100 px-4 py-3">Diagnosis</th><th className="border-b border-slate-100 px-4 py-3">Status</th><th className="border-b border-slate-100 px-4 py-3">Aksi</th></tr></thead><tbody>{rows.map(r=><tr key={r.id} className="border-b border-slate-100 text-sm last:border-b-0"><td className="px-4 py-3 font-bold">{r.full_name}</td><td className="px-4 py-3">{new Date(r.created_at).toLocaleDateString("id-ID")}</td><td className="px-4 py-3">{r.diagnosis}</td><td className="px-4 py-3"><Badge tone="approved">Selesai</Badge></td><td className="px-4 py-3"><Link href={`/dokter/pasien/${r.id}`} className="inline-flex min-h-9 items-center rounded-lg bg-slate-100 px-3 font-bold text-slate-700">Detail</Link></td></tr>)}</tbody></table></div></article>
  </>;
}