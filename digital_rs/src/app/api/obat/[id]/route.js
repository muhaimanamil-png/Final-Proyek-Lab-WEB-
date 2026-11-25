import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import pool from "@/lib/db";

async function isAdmin(){
  const store=await cookies();
  return store.get("rs_role")?.value==="Admin";
}

export async function PATCH(request,{params}){
  if(!await isAdmin()) return NextResponse.json({error:"Akses ditolak."},{status:403});
  await pool.query("ALTER TABLE obat ADD COLUMN IF NOT EXISTS image_url TEXT");
  const {id}=await params;
  const body=await request.json();
  if(!body.nama_obat||!body.description||!["keras","biasa"].includes(body.jenis_obat)||body.stock===undefined||!body.expired_date||Number(body.stock)<0){
    return NextResponse.json({error:"Data obat tidak valid."},{status:400});
  }
  await pool.query(
    "UPDATE obat SET nama_obat=$1,description=$2,jenis_obat=$3,stock=$4,expired_date=$5,image_url=$6 WHERE id=$7",
    [body.nama_obat,body.description,body.jenis_obat,Number(body.stock),body.expired_date,body.image_url||null,id],
  );
  return NextResponse.json({ok:true});
}

export async function DELETE(request,{params}){
  if(!await isAdmin()) return NextResponse.json({error:"Akses ditolak."},{status:403});
  const {id}=await params;
  const used=await pool.query("SELECT 1 FROM prescription_items WHERE id_obat=$1 LIMIT 1",[id]);
  if(used.rows.length) return NextResponse.json({error:"Obat tidak dapat dihapus karena memiliki riwayat resep."},{status:409});
  await pool.query("DELETE FROM obat WHERE id=$1",[id]);
  return NextResponse.json({ok:true});
}
