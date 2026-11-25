import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { cookies } from "next/headers";

export async function PATCH(request,{params}) {
  const { id }=await params;
  const body=await request.json();
  if (!["Approved","Rejected","Selesai","Cancelled"].includes(body.status)) {
    return NextResponse.json({error:"Status tidak valid."},{status:400});
  }
  if(body.status==="Rejected"&&!String(body.rejection_reason||"").trim()){
    return NextResponse.json({error:"Alasan penolakan wajib diisi."},{status:400});
  }
  const store=await cookies();
  const sessionId=Number(store.get("rs_user_id")?.value);
  const role=store.get("rs_role")?.value;
  if(role==="Pasien"){
    const current=await pool.query("SELECT status FROM konsultasi WHERE id=$1 AND patient_id=$2",[id,sessionId]);
    if(!current.rows.length||current.rows[0].status!=="Pending"){
      return NextResponse.json({error:"Janji temu hanya dapat dibatalkan saat masih Pending."},{status:409});
    }
  }
  let query="UPDATE konsultasi SET status=$1,rejection_reason=$2 WHERE id=$3";
  let values=[body.status,body.rejection_reason||null,id];
  if(role==="Dokter"){
    query+=" AND doctor_id=$4";
    values.push(sessionId);
  }else if(role==="Pasien"){
    query+=" AND patient_id=$4";
    values.push(sessionId);
  }
  const result=await pool.query(query+" RETURNING id",values);
  if(result.rowCount!==1) return NextResponse.json({error:"Janji temu tidak dapat diperbarui."},{status:403});
  return NextResponse.json({ok:true});
}
