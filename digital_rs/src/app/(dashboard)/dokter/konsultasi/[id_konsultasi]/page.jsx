import { PageHeader } from "@/components/ui";
import pool from "@/lib/db";
import MedicalRecordForm from "@/components/MedicalRecordForm";

export default async function RecordConsultation({params}) {
  const {id_konsultasi}=await params;
  const [consultation,meds]=await Promise.all([
    pool.query(`SELECT k.id,k.patient_id,p.full_name,k.complaint,k.booking_date,j.start_time
      FROM konsultasi k JOIN users p ON p.id=k.patient_id JOIN jadwal j ON j.id=k.schedule_id WHERE k.id=$1`,[id_konsultasi]),
    pool.query("SELECT id,nama_obat,stock FROM obat WHERE stock>0 AND expired_date>=CURRENT_DATE ORDER BY nama_obat"),
  ]);
  const consultationData=consultation.rows[0];
  return <>
    <PageHeader title="Rekam Konsultasi" subtitle={`${consultationData?.full_name||"Pasien"} · ${consultationData?.booking_date?new Date(consultationData.booking_date).toLocaleDateString("id-ID"):""} · ${String(consultationData?.start_time||"").slice(0,5)}`} />
    <MedicalRecordForm consultation={consultationData} medicines={meds.rows} />
  </>;
}