import PublicNavbar from "@/components/layout/PublicNavbar";
import { PageHeader, Badge } from "@/components/ui";
import pool from "@/lib/db";

export default async function PoliPage() {
  await pool.query("ALTER TABLE poli ADD COLUMN IF NOT EXISTS image_url TEXT");
  const { rows: polis } = await pool.query(
    "SELECT id, nama_poli, description, image_url FROM poli ORDER BY nama_poli",
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <PublicNavbar />
      <main className="mx-auto w-[calc(100%-40px)] max-w-[1180px] py-11">
        <PageHeader title="Daftar Poli" subtitle="Pilih layanan yang sesuai dengan kebutuhan Anda" />
        <div className="grid gap-4 md:grid-cols-2">
          {polis.map((poli, index) => (
            <article key={poli.id} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-teal-50 text-lg font-black text-teal-600">
                +{index + 1}
              </div>
              <div>
                <h3 className="mb-1.5 text-lg font-bold text-slate-900">{poli.nama_poli}</h3>
                <p className="mb-3 text-slate-500">{poli.description || "Layanan poli tersedia."}</p>
                <Badge tone="approved">Layanan aktif</Badge>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
