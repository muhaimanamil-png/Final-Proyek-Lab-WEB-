import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import pool from "@/lib/db";

export async function POST(request){
  const store=await cookies();
  if(store.get("rs_role")?.value!=="Admin") return NextResponse.json({error:"Akses ditolak."},{status:403});
  const body=await request.json();
  if(!body.username||!body.email||!body.password||!["Admin","Dokter","Pasien"].includes(body.role)){
    return NextResponse.json({error:"Semua field wajib diisi dan peran tidak valid."},{status:400});
  }
  if(body.role==="Dokter"&&!body.poli_id) return NextResponse.json({error:"Poli wajib dipilih untuk Dokter."},{status:400});
  try{
    await pool.query(
      `INSERT INTO users (username,email,password,full_name,phone,role,poli_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [body.username,body.email,body.password,body.full_name||body.username,body.phone||null,body.role,body.role==="Dokter"?body.poli_id:null],
    );
    return NextResponse.json({ok:true},{status:201});
  }catch(error){
    if(error.code==="23505") return NextResponse.json({error:"Username atau email sudah digunakan."},{status:409});
    throw error;
  }
}
