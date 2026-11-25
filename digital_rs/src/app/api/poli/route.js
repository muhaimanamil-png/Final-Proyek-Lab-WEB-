import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(request) {
  const body = await request.json();
  await pool.query("ALTER TABLE poli ADD COLUMN IF NOT EXISTS image_url TEXT");
  if (!body.nama_poli) return NextResponse.json({error:"Nama poli wajib diisi."},{status:400});
  try {
    await pool.query("INSERT INTO poli (nama_poli,description,image_url) VALUES ($1,$2,$3)",
      [body.nama_poli,body.description||null,body.image_url||null]);
    return NextResponse.json({ok:true},{status:201});
  } catch (error) {
    if (error.code==="23505") return NextResponse.json({error:"Nama poli sudah ada."},{status:409});
    throw error;
  }
}

export async function DELETE(request) {
  const { searchParams }=new URL(request.url);
  const id=Number(searchParams.get("id"));
  if (!id) return NextResponse.json({error:"ID tidak valid."},{status:400});
  try {
    await pool.query("DELETE FROM poli WHERE id=$1",[id]);
  } catch (error) {
    if(error.code==="23503") return NextResponse.json({error:"Poli tidak dapat dihapus karena masih digunakan."},{status:409});
    throw error;
  }
  return NextResponse.json({ok:true});
}

export async function PATCH(request) {
  const body = await request.json();
  await pool.query("ALTER TABLE poli ADD COLUMN IF NOT EXISTS image_url TEXT");
  if (!body.id || !body.nama_poli) return NextResponse.json({error:"Data poli belum lengkap."},{status:400});
  try {
    await pool.query("UPDATE poli SET nama_poli=$1,description=$2,image_url=$3 WHERE id=$4",
      [body.nama_poli,body.description||null,body.image_url||null,body.id]);
    return NextResponse.json({ok:true});
  } catch (error) {
    if (error.code==="23505") return NextResponse.json({error:"Nama poli sudah ada."},{status:409});
    throw error;
  }
}
