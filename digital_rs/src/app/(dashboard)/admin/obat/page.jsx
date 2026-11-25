import pool from "@/lib/db";
import MedicineManager from "@/components/MedicineManager";

export default async function MedicinePage({ searchParams }) {
  const params = await searchParams;
  const status = params?.status || "";
  const query = params?.q || "";
  const conditions = [];
  const values = [];
  if (query) { values.push(`%${query}%`); conditions.push(`nama_obat ILIKE $${values.length}`); }
  if (status === "available") conditions.push("stock > 0 AND expired_date >= CURRENT_DATE");
  if (status === "unavailable") conditions.push("stock = 0");
  if (status === "expired") conditions.push("expired_date < CURRENT_DATE");
  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  await pool.query("ALTER TABLE obat ADD COLUMN IF NOT EXISTS image_url TEXT");
  const { rows: meds } = await pool.query(
    `SELECT id, nama_obat, description, jenis_obat, stock, expired_date, image_url
     FROM obat ${where} ORDER BY nama_obat`,
    values,
  );
  return <MedicineManager medicines={meds} />;
}