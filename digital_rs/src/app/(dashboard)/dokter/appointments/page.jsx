import { PageHeader, Badge } from "@/components/ui";
import pool from "@/lib/db";
import { getSession } from "@/lib/auth";
import AppointmentActions from "@/components/AppointmentActions";

export default async function DoctorAppointments() {
  const session=await getSession();
  const {rows}=await pool.query(`SELECT k.id,p.full_name,k.booking_date,j.start_time,k.complaint,k.status
    FROM konsultasi k JOIN users p ON p.id=k.patient_id JOIN jadwal j ON j.id=k.schedule_id
    WHERE k.doctor_id=$1 AND k.status='Pending' ORDER BY k.booking_date,j.start_time`,[session?.id]);
  return <>
    <PageHeader title="Verifikasi Janji Temu" subtitle="Janji temu yang menunggu validasi untuk Anda" />
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><AppointmentActions rows={rows} showDoctor={false} patientNameKey="full_name" /></article>
  </>;
}