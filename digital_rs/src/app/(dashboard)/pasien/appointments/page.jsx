import Link from "next/link";
import { PageHeader } from "@/components/ui";
import pool from "@/lib/db";
import { getSession } from "@/lib/auth";
import PatientAppointmentActions from "@/components/PatientAppointmentActions";

export default async function PatientAppointments() {
  const session=await getSession();
  const {rows}=await pool.query(`SELECT k.id,k.booking_date,k.status,j.start_time,d.full_name,p.nama_poli
    FROM konsultasi k JOIN users d ON d.id=k.doctor_id LEFT JOIN poli p ON p.id=d.poli_id JOIN jadwal j ON j.id=k.schedule_id
    WHERE k.patient_id=$1 ORDER BY k.booking_date DESC,k.created_at DESC`,[session?.id]);
  return <>
    <PageHeader title="Janji Temu Saya" subtitle="Lihat dan kelola janji temu kesehatan" action={<Link href="/pasien/appointments/booking" className="inline-flex min-h-11 items-center rounded-xl bg-teal-600 px-4 font-bold text-white transition hover:bg-teal-700">+ Buat Janji Temu</Link>} />
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><PatientAppointmentActions rows={rows} /></article>
  </>;
}