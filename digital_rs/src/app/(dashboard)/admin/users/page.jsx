import pool from "@/lib/db";
import UserManager from "@/components/UserManager";

export default async function UsersPage({ searchParams }) {
  const params = await searchParams;
  const role = params?.role || "";
  const date = params?.date || "";
  const query = params?.q || "";
  const conditions = [];
  const values = [];
  if (role) { values.push(role); conditions.push(`role = $${values.length}`); }
  if (date) { values.push(date); conditions.push(`created_at::date = $${values.length}::date`); }
  if (query) { values.push(`%${query}%`); conditions.push(`(full_name ILIKE $${values.length} OR username ILIKE $${values.length} OR email ILIKE $${values.length})`); }
  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const [{ rows: users },{rows:polis}] = await Promise.all([
    pool.query(
    `SELECT id, username, email, full_name, phone, role, poli_id, created_at FROM users ${where} ORDER BY created_at DESC`,
    values,
    ),
    pool.query("SELECT id,nama_poli FROM poli ORDER BY nama_poli"),
  ]);
  return <UserManager users={users} polis={polis} />;
}