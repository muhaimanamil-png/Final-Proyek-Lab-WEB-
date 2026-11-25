import pool from "@/lib/db";
import PoliManager from "@/components/PoliManager";

export default async function PoliManagementPage() {
  await pool.query("ALTER TABLE poli ADD COLUMN IF NOT EXISTS image_url TEXT");
  const { rows: poli } = await pool.query(
    "SELECT id, nama_poli, description FROM poli ORDER BY nama_poli",
  );
  return <PoliManager initialPoli={poli} />;
}