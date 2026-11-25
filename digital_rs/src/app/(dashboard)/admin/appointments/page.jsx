import { PageHeader, Badge } from "@/components/ui";
import pool from "@/lib/db";
import AppointmentActions from "@/components/AppointmentActions";

export default async function AdminAppointments() {
  const { rows }= await pool.query(`SELECT k.id,p.full_name AS patient_name,d.full_name AS doctor_name,k.booking_date,j.start_time,k.complaint,k.status
    FROM konsultasi k JOIN users p ON p.id=k.patient_id JOIN users d ON d.id=k.doctor_id JOIN jadwal j ON j.id=k.schedule_id
    WHERE k.status='Pending' ORDER BY k.booking_date,j.start_time`);
  return <>
    <PageHeader title="Verifikasi Janji Temu" subtitle="Daftar seluruh janji temu berstatus Pending" />
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><AppointmentActions rows={rows} showDoctor /></article>
  </>;
}