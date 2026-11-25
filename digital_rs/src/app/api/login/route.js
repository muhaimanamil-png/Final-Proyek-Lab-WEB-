import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const identifier = String(body.username || "").trim();
  const password = String(body.password || "");
  if (!identifier || !password) {
    return NextResponse.json({ error: "Username/email dan password wajib diisi." }, { status: 400 });
  }

  const result = await pool.query(
    "SELECT id, username, email, password, full_name, role FROM users WHERE (username = $1 OR email = $1) AND role = $2 LIMIT 1",
    [identifier, body.role],
  );
  const user = result.rows[0];
  if (!user || user.password !== password) {
    return NextResponse.json({ error: "Username, peran, atau password tidak valid." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true, role: user.role, user: { id: user.id, name: user.full_name } });
  response.cookies.set("rs_role", user.role, { httpOnly: false, path: "/", maxAge: 86400 });
  response.cookies.set("rs_user_id", String(user.id), { httpOnly: false, path: "/", maxAge: 86400 });
  return response;
}