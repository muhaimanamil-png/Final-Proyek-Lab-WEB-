import { PageHeader, Badge } from "@/components/ui";
import pool from "@/lib/db";
import PharmacyActions from "@/components/PharmacyActions";

export default async function PharmacyQueue() {
  const {rows}= await pool.query(`SELECT pr.id,p.full_name AS patient_name,d.full_name AS doctor_name,pr.status
    FROM prescriptions pr JOIN rekam_medis rm ON rm.id=pr.id_rekam_medis
    JOIN users p ON p.id=rm.patient_id JOIN users d ON d.id=rm.doctor_id
    ORDER BY pr.created_at DESC`);
  return <>
    <PageHeader title="Antrean Farmasi" subtitle="Proses dan serahkan resep kepada pasien" />
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <PharmacyActions rows={rows} />
    </article>
  </>;
}