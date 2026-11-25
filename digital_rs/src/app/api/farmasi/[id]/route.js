import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PATCH(request,{params}) {
  const {id}=await params;
  const body=await request.json();
  if(!["Menunggu Diproses","Siap Diambil","Sudah Diambil"].includes(body.status)) {
    return NextResponse.json({error:"Status resep tidak valid."},{status:400});
  }
  const client=await pool.connect();
  try{
    await client.query("BEGIN");
    const current=await client.query("SELECT status FROM prescriptions WHERE id=$1",[id]);
    if(!current.rows.length) return NextResponse.json({error:"Resep tidak ditemukan."},{status:404});
    if(body.status==="Siap Diambil"&&current.rows[0].status==="Menunggu Diproses"){
      const items=await client.query(
        `SELECT pi.id_obat,pi.quantity,o.nama_obat,o.stock
         FROM prescription_items pi JOIN obat o ON o.id=pi.id_obat
         WHERE pi.prescription_id=$1`,
        [id],
      );
      for(const item of items.rows){
        if(item.stock<item.quantity){
          await client.query("ROLLBACK");
          return NextResponse.json({error:`Stok ${item.nama_obat} tidak mencukupi.`},{status:409});
        }
      }
      for(const item of items.rows){
        await client.query("UPDATE obat SET stock=stock-$1 WHERE id=$2",[item.quantity,item.id_obat]);
      }
    }
    await client.query("UPDATE prescriptions SET status=$1 WHERE id=$2",[body.status,id]);
    await client.query("COMMIT");
  }catch(error){
    await client.query("ROLLBACK");
    throw error;
  }finally{
    client.release();
  }
  return NextResponse.json({ok:true});
}
