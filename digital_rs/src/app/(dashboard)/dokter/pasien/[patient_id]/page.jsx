import { PageHeader, Badge } from "@/components/ui";
import pool from "@/lib/db";
import { getSession } from "@/lib/auth";

export default async function PatientDetail({params}) {
  const {patient_id}=await params;
  const session=await getSession();
  const [patient,records]=await Promise.all([
    pool.query("SELECT full_name,email,phone FROM users WHERE id=$1 AND role='Pasien'",[patient_id]),
    pool.query(`SELECT rm.id,rm.created_at,rm.diagnosis,rm.medical_action,rm.notes
      FROM rekam_medis rm WHERE rm.patient_id=$1 AND rm.doctor_id=$2 ORDER BY rm.created_at DESC`,[patient_id,session?.id]),
  ]);
  return <>
    <PageHeader title="Riwayat Pasien" subtitle={`${patient.rows[0]?.full_name||"Pasien"} · ${patient.rows[0]?.email||"-"} · ${patient.rows[0]?.phone||"-"}`} />
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div>{records.rows.map(r=><div key={r.id} className="grid gap-4 border-b border-slate-100 py-3 last:border-b-0 md:grid-cols-[140px_1fr_1fr]"><b>{new Date(r.created_at).toLocaleDateString("id-ID")}</b><span>{r.diagnosis}<br/><Badge tone="approved">Selesai</Badge></span><span className="text-slate-500">{r.medical_action}</span></div>)}</div></article>
  </>;
}