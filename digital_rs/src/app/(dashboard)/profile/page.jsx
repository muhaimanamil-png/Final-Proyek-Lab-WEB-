import { cookies } from "next/headers";
import { PageHeader } from "@/components/ui";
import pool from "@/lib/db";
import { getSession } from "@/lib/auth";
import ProfileForm from "@/components/ProfileForm";

export default async function ProfilePage() {
  const session=await getSession();
  const {rows}=await pool.query("SELECT id,username,email,full_name,phone,role,poli_id FROM users WHERE id=$1",[session?.id]);
  const user=rows[0]||{};
  const role=user.role||"Pasien";
  return <>
    <PageHeader title="Profil Saya" subtitle={`Informasi akun ${role}`} />
    <ProfileForm user={user} role={role} />
  </>;
}