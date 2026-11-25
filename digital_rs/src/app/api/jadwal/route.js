import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import pool from "@/lib/db";

export async function POST(request) {
  const store=await cookies();
  const id=Number(store.get("rs_user_id")?.value);
  const body=await request.json();
  if (!id) return NextResponse.json({error:"Belum masuk."},{status:401});
  if(body.duration_minutes!==30) return NextResponse.json({error:"Durasi konsultasi harus 30 menit."},{status:400});
  const overlap=await pool.query(
    `SELECT id FROM jadwal
     WHERE doctor_id=$1 AND day_of_week=$2
       AND start_time < (($3::time)+INTERVAL '30 minutes')
       AND (($3::time)+INTERVAL '30 minutes') > start_time
     LIMIT 1`,
    [id,body.day_of_week,body.start_time],
  );
  if(overlap.rows.length) return NextResponse.json({error:"Jadwal bertabrakan dengan jadwal lain."},{status:409});
  await pool.query(
    "INSERT INTO jadwal (doctor_id,day_of_week,start_time,duration_minutes) VALUES ($1,$2,$3,$4)",
    [id,body.day_of_week,body.start_time,body.duration_minutes||30],
  );
  return NextResponse.json({ok:true},{status:201});
}

export async function DELETE(request) {
  const {searchParams}=new URL(request.url);
  const id=Number(searchParams.get("id"));
  if (!id) return NextResponse.json({error:"ID tidak valid."},{status:400});
  await pool.query("DELETE FROM jadwal WHERE id=$1",[id]);
  return NextResponse.json({ok:true});
}

export async function PATCH(request) {
  const store=await cookies();
  const doctorId=Number(store.get("rs_user_id")?.value);
  const body=await request.json();
  if(!doctorId||!body.id) return NextResponse.json({error:"Data jadwal tidak valid."},{status:400});
  if(body.duration_minutes!==30) return NextResponse.json({error:"Durasi konsultasi harus 30 menit."},{status:400});
  const overlap=await pool.query(
    `SELECT id FROM jadwal
     WHERE doctor_id=$1 AND day_of_week=$2 AND id<>$3
       AND start_time < (($4::time)+INTERVAL '30 minutes')
       AND (($4::time)+INTERVAL '30 minutes') > start_time
     LIMIT 1`,
    [doctorId,body.day_of_week,body.id,body.start_time],
  );
  if(overlap.rows.length) return NextResponse.json({error:"Jadwal bertabrakan dengan jadwal lain."},{status:409});
  await pool.query(
    "UPDATE jadwal SET day_of_week=$1,start_time=$2,duration_minutes=30 WHERE id=$3 AND doctor_id=$4",
    [body.day_of_week,body.start_time,body.id,doctorId],
  );
  return NextResponse.json({ok:true});
}
