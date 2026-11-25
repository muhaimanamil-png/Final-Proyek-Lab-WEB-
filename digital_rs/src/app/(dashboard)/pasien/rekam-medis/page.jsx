import { PageHeader, Badge } from "@/components/ui";
import pool from "@/lib/db";
import { getSession } from "@/lib/auth";

export default async function MedicalRecords() {
  const session=await getSession();
  const {rows}=await pool.query(`SELECT rm.id,rm.created_at,d.full_name,p.nama_poli,rm.diagnosis,rm.medical_action,rm.notes,
    COALESCE(json_agg(json_build_object('nama_obat',o.nama_obat,'quantity',pi.quantity)) FILTER (WHERE o.id IS NOT NULL),'[]') AS items
    FROM rekam_medis rm JOIN users d ON d.id=rm.doctor_id LEFT JOIN poli p ON p.id=d.poli_id
    LEFT JOIN prescriptions pr ON pr.id_rekam_medis=rm.id
    LEFT JOIN prescription_items pi ON pi.prescription_id=pr.id
    LEFT JOIN obat o ON o.id=pi.id_obat
    WHERE rm.patient_id=$1 GROUP BY rm.id,d.full_name,p.nama_poli ORDER BY rm.created_at DESC`,[session?.id]);
  return <>
    <PageHeader title="Rekam Medis Saya" subtitle="Riwayat pemeriksaan dan resep obat" />
    {rows.map(r=><article className="mb-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" key={r.id}>
      <div className="flex items-start justify-between"><div><h3 className="mb-1 font-bold text-slate-900">{r.full_name}</h3><span className="text-sm text-slate-500">{new Date(r.created_at).toLocaleDateString("id-ID")} · {r.nama_poli||"Poli"}</span></div><Badge tone="approved">Selesai</Badge></div>
      <div className="mt-5 grid gap-4 border-t border-slate-100 pt-4 md:grid-cols-2"><div><small className="text-slate-500">Diagnosis</small><br/><b>{r.diagnosis}</b></div><div><small className="text-slate-500">Resep Obat</small><br/><b>{r.items?.length?r.items.map(i=>`${i.nama_obat} (${i.quantity})`).join(", "):"Tidak ada resep"}</b></div></div>
    </article>)}
  </>;
}