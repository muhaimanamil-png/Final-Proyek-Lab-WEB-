import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import pool from "@/lib/db";

async function isAdmin(){
  const store=await cookies();
  return store.get("rs_role")?.value==="Admin";
}

export async function POST(request){
  if(!await isAdmin()) return NextResponse.json({error:"Akses ditolak."},{status:403});
  await pool.query("ALTER TABLE obat ADD COLUMN IF NOT EXISTS image_url TEXT");
  const body=await request.json();
  if(!body.nama_obat||!body.description||!["keras","biasa"].includes(body.jenis_obat)||body.stock===undefined||!body.expired_date){
    return NextResponse.json({error:"Semua field obat wajib diisi dengan benar."},{status:400});
  }
  if(Number(body.stock)<0) return NextResponse.json({error:"Stok tidak boleh negatif."},{status:400});
  await pool.query(
    "INSERT INTO obat (nama_obat,description,jenis_obat,stock,expired_date,image_url) VALUES ($1,$2,$3,$4,$5,$6)",
    [body.nama_obat,body.description,body.jenis_obat,Number(body.stock),body.expired_date,body.image_url||null],
  );
  return NextResponse.json({ok:true},{status:201});
}
