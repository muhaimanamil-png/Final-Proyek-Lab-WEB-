import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ ok:true });
  response.cookies.delete("rs_role");
  response.cookies.delete("rs_user_id");
  return response;
}