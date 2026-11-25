import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import pool from "@/lib/db";

export async function PATCH(request) {
  const store = await cookies();
  const id = Number(store.get("rs_user_id")?.value);
  if (!Number.isInteger(id)) return NextResponse.json({ error:"Belum masuk." },{status:401});
  const body = await request.json();
  await pool.query(
    "UPDATE users SET full_name=$1,email=$2,phone=$3,username=$4 WHERE id=$5",
    [body.full_name,body.email,body.phone,body.username,id],
  );
  return NextResponse.json({ ok:true });
}
