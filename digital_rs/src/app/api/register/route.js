import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const { username, email, password, full_name, phone } = body;
  if (!username || !email || !password || !full_name) {
    return NextResponse.json({ error: "Data pendaftaran belum lengkap." }, { status: 400 });
  }
  try {
    const result = await pool.query(
      `INSERT INTO users (username, email, password, full_name, phone, role)
       VALUES ($1,$2,$3,$4,$5,'Pasien')
       RETURNING id, username, email, full_name, role`,
      [username.trim(), email.trim(), password, full_name.trim(), phone?.trim() || null],
    );
    const user = result.rows[0];
    const response = NextResponse.json({ ok: true, role: "Pasien", user });
    response.cookies.set("rs_role", "Pasien", { path: "/", maxAge: 86400 });
    response.cookies.set("rs_user_id", String(user.id), { path: "/", maxAge: 86400 });
    return response;
  } catch (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Username atau email sudah digunakan." }, { status: 409 });
    }
    throw error;
  }
}