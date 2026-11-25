import PublicNavbar from "@/components/layout/PublicNavbar";
import { PageHeader, Badge } from "@/components/ui";
import pool from "@/lib/db";

export default async function PublicDoctorsPage() {
  const { rows: doctors } = await pool.query(
    `SELECT u.id, u.full_name, p.nama_poli,
      COALESCE(
        json_agg(json_build_object('day', j.day_of_week, 'start_time', j.start_time, 'duration', j.duration_minutes) ORDER BY j.id)
          FILTER (WHERE j.id IS NOT NULL),
        '[]'
      ) AS schedules
     FROM users u
     LEFT JOIN poli p ON p.id = u.poli_id
     LEFT JOIN jadwal j ON j.doctor_id = u.id
     WHERE u.role = 'Dokter'
     GROUP BY u.id, u.full_name, p.nama_poli
     ORDER BY u.full_name`,
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <PublicNavbar />
      <main className="mx-auto w-[calc(100%-40px)] max-w-295 py-11">
        <PageHeader title="Dokter Kami" subtitle="Profil dan jadwal praktik dokter" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doctor) => (
            <article key={doctor.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="grid size-18 place-items-center rounded-full bg-sky-50 text-xl font-black text-teal-600">DR</div>
              <h3 className="mt-4 mb-2 text-lg font-bold text-slate-900">{doctor.full_name}</h3>
              <Badge tone="info">{doctor.nama_poli || "Dokter"}</Badge>
              <div className="mt-4 text-sm leading-6 text-slate-500">
                <b className="text-slate-800">Jadwal</b>
                {doctor.schedules?.length ? (
                  doctor.schedules.map((item, index) => (
                    <div key={index}>{item.day}: {String(item.start_time).slice(0, 5)} · {item.duration} menit</div>
                  ))
                ) : (
                  <div>Belum ada jadwal praktik</div>
                )}
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
