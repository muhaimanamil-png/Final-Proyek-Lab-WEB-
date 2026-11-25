import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import pool from "@/lib/db";

export async function POST(request) {
  const store=await cookies();
  const doctorId=Number(store.get("rs_user_id")?.value);
  const body=await request.json();
  if(!doctorId) return NextResponse.json({error:"Belum masuk."},{status:401});
  if(!body.consultation_id||!body.patient_id||!body.diagnosis||!body.medical_action) {
    return NextResponse.json({error:"Data rekam medis belum lengkap."},{status:400});
  }
  const client=await pool.connect();
  try {
    await client.query("BEGIN");
    const record=await client.query(
      `INSERT INTO rekam_medis (id_konsultasi,patient_id,doctor_id,diagnosis,medical_action,notes)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
      [body.consultation_id,body.patient_id,doctorId,body.diagnosis,body.medical_action,body.notes||null],
    );
    let prescriptionId=null;
    if(Array.isArray(body.items)&&body.items.length){
      const prescription=await client.query(
        "INSERT INTO prescriptions (id_rekam_medis,status) VALUES ($1,'Menunggu Diproses') RETURNING id",
        [record.rows[0].id],
      );
      prescriptionId=prescription.rows[0].id;
      for(const item of body.items){
        await client.query("INSERT INTO prescription_items (prescription_id,id_obat,quantity) VALUES ($1,$2,$3)",
          [prescriptionId,item.id_obat,item.quantity]);
      }
    }
    await client.query("UPDATE konsultasi SET status='Selesai' WHERE id=$1",[body.consultation_id]);
    await client.query("COMMIT");
    return NextResponse.json({ok:true,record_id:record.rows[0].id});
  } catch(error){
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
