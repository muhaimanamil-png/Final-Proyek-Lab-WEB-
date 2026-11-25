import Link from "next/link";
import PublicNavbar from "@/components/layout/PublicNavbar";
import { Badge } from "@/components/ui";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <PublicNavbar />
      <main>
        <section className="border-b border-teal-100 bg-linear-to-br from-teal-50 to-sky-50">
          <div className="mx-auto grid min-h-115 w-[calc(100%-40px)] max-w-295 items-center gap-14 md:grid-cols-[1.1fr_.9fr]">
            <div>
              <Badge tone="approved">Pelayanan 24 Jam</Badge>
              <h1 className="mt-5 max-w-xl text-4xl font-bold leading-tight tracking-tight text-slate-900 md:text-5xl">
                Perawatan kesehatan yang lebih mudah dan terpercaya.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-7 text-slate-600">
                Temukan dokter, lihat jadwal praktik, dan kelola janji temu Anda dalam satu platform digital.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/poli" className="inline-flex min-h-11 items-center rounded-xl bg-teal-600 px-5 py-3 font-bold text-white transition hover:bg-teal-700">
                  Lihat Layanan
                </Link>
                <Link href="/dokter" className="inline-flex min-h-11 items-center rounded-xl bg-slate-100 px-5 py-3 font-bold text-slate-800 transition hover:bg-slate-200">
                  Cari Dokter
                </Link>
              </div>
            </div>
            <div className="relative hidden h-82.5 overflow-hidden rounded-2xl border border-white/80 bg-white/80 shadow-sm md:block">
              <div className="relative -bottom-14 left-38 size-48 rounded-full bg-teal-100" />
              <div className="relative -top-27 left-44 size-36 rounded-full bg-teal-500" />
              <div className="relative -top-59 left-48 grid size-28 place-items-center rounded-full bg-slate-800 text-4xl text-white">+</div>
            </div>
          </div>
        </section>
        <section className="mx-auto w-[calc(100%-40px)] max-w-295 py-14">
          <h2 className="mb-6 text-3xl font-bold text-slate-900">Layanan Unggulan</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Pemeriksaan Umum", "Konsultasi kesehatan dan perawatan dasar."],
              ["Poli Spesialis", "Pilihan dokter spesialis untuk kebutuhan Anda."],
              ["Layanan Obat", "Pemrosesan resep yang cepat dan transparan."],
            ].map(([title, text]) => (
              <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-2 text-lg font-bold text-slate-900">{title}</h3>
                <p className="leading-6 text-slate-500">{text}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
