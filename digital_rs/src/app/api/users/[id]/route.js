import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import pool from "@/lib/db";

async function requireAdmin() {
  const store=await cookies();
  return store.get("rs_role")?.value==="Admin";
}

export async function PATCH(request,{params}) {
  if(!await requireAdmin()) return NextResponse.json({error:"Akses ditolak."},{status:403});
  const {id}=await params;
  const body=await request.json();
  if(!body.username||!body.email||!body.password||!["Admin","Dokter","Pasien"].includes(body.role)){
    return NextResponse.json({error:"Semua field wajib diisi dan peran tidak valid."},{status:400});
  }
  if(body.role==="Dokter"&&!body.poli_id){
    return NextResponse.json({error:"Poli wajib dipilih untuk Dokter."},{status:400});
  }
  try{
    await pool.query(
      "UPDATE users SET username=$1,email=$2,password=$3,role=$4,poli_id=$5,full_name=COALESCE(NULLIF(full_name,''),$6) WHERE id=$7",
      [body.username,body.email,body.password,body.role,body.role==="Dokter"?body.poli_id:null,body.full_name||body.username,id],
    );
    return NextResponse.json({ok:true});
  }catch(error){
    if(error.code==="23505") return NextResponse.json({error:"Username atau email sudah digunakan."},{status:409});
    throw error;
  }
}

export async function DELETE(request,{params}) {
  if(!await requireAdmin()) return NextResponse.json({error:"Akses ditolak."},{status:403});
  const {id}=await params;
  const store=await cookies();
  if(String(store.get("rs_user_id")?.value)===String(id)){
    return NextResponse.json({error:"Akunk sedang digunakan tidak dapat dihapus."},{status:409});
  }
  await pool.query("DELETE FROM users WHERE id=$1",[id]);
  return NextResponse.json({ok:true});
}
