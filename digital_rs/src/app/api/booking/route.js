import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import pool from "@/lib/db";

export async function GET() {
  const [polys,doctors] = await Promise.all([
    pool.query("SELECT id,nama_poli,description FROM poli ORDER BY nama_poli"),
    pool.query(`SELECT u.id,u.full_name,u.poli_id,p.nama_poli,
      COALESCE(json_agg(json_build_object('id',j.id,'day',j.day_of_week,'start_time',j.start_time,'duration',j.duration_minutes)) FILTER (WHERE j.id IS NOT NULL),'[]') schedules
      FROM users u LEFT JOIN poli p ON p.id=u.poli_id LEFT JOIN jadwal j ON j.doctor_id=u.id
      WHERE u.role='Dokter' GROUP BY u.id,p.nama_poli ORDER BY u.full_name`),
  ]);
  return NextResponse.json({poli:polys.rows,doctors:doctors.rows});
}

export async function POST(request) {
  const store=await cookies();
  const patientId=Number(store.get("rs_user_id")?.value);
  const body=await request.json();
  if (!patientId) return NextResponse.json({error:"Belum masuk."},{status:401});
  if (!body.doctor_id||!body.schedule_id||!body.booking_date||!body.complaint) {
    return NextResponse.json({error:"Data janji temu belum lengkap."},{status:400});
  }
  try {
    const result=await pool.query(
      `INSERT INTO konsultasi (patient_id,doctor_id,schedule_id,booking_date,complaint,status)
       VALUES ($1,$2,$3,$4,$5,'Pending') RETURNING id`,
      [patientId,body.doctor_id,body.schedule_id,body.booking_date,body.complaint],
    );
    return NextResponse.json({ok:true,id:result.rows[0].id},{status:201});
  } catch (error) {
    if(error.code==="23505") return NextResponse.json({error:"Slot jadwal sudah dibooking."},{status:409});
    throw error;
  }
}
