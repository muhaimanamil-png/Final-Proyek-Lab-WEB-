import Link from "next/link";
import { Badge, PageHeader, StatCard } from "@/components/ui";
import pool from "@/lib/db";
import { getSession } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) return null;
  if (session.role === "Admin") return <Admin />;
  if (session.role === "Dokter") return <Doctor session={session} />;
  return <Patient session={session} />;
}

async function Admin() {
  const [pending, pharmacy, doctors, users] = await Promise.all([
    pool.query("SELECT COUNT(*)::int AS count FROM konsultasi WHERE status = 'Pending'"),
    pool.query("SELECT COUNT(*)::int AS count FROM prescriptions WHERE status IN ('Menunggu Diproses','Siap Diambil')"),
    pool.query("SELECT u.id,u.full_name,p.nama_poli FROM users u LEFT JOIN poli p ON p.id=u.poli_id WHERE u.role='Dokter' ORDER BY u.full_name LIMIT 8"),
    pool.query("SELECT role, COUNT(*)::int AS count FROM users GROUP BY role"),
  ]);
  const totals = Object.fromEntries(users.rows.map((row) => [row.role, row.count]));
  const totalUsers = users.rows.reduce((sum, row) => sum + row.count, 0);

  return (
    <>
      <PageHeader title="Dashboard Admin" subtitle="Ringkasan operasional rumah sakit hari ini" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Janji Pending" value={pending.rows[0].count} detail="Perlu approval" icon="calendar" tone="amber" />
        <StatCard title="Antrean Farmasi" value={pharmacy.rows[0].count} detail="Diproses & siap ambil" icon="pill" tone="teal" />
        <StatCard title="Dokter Terdaftar" value={totals.Dokter || 0} detail="Di seluruh poli" icon="users" tone="sky" />
        <StatCard title="Total Pengguna" value={totalUsers} detail={`Admin ${totals.Admin || 0} · Dokter ${totals.Dokter || 0} · Pasien ${totals.Pasien || 0}`} icon="profile" tone="violet" />
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4 font-bold text-slate-900">Dokter Bertugas Hari Ini</div>
          <div className="p-2">
            {doctors.rows.map((doctor) => (
              <div key={doctor.id} className="flex items-center justify-between border-b border-slate-100 px-3 py-3 last:border-b-0">
                <div>
                  <b>{doctor.full_name}</b>
                  <div className="text-xs text-slate-500">{doctor.nama_poli || "Dokter"}</div>
                </div>
                <Badge tone="approved">Terdaftar</Badge>
              </div>
            ))}
          </div>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 font-bold text-slate-900">Status Resep</h3>
          {[["Menunggu Diproses", "pending"], ["Siap Diambil", "approved"]].map(([label, tone]) => (
            <div key={label} className="flex items-center justify-between border-b border-slate-100 py-3 last:border-b-0">
              <span>{label}</span>
              <Badge tone={tone}>{pharmacy.rows[0].count}</Badge>
            </div>
          ))}
        </article>
      </div>
    </>
  );
}

async function Doctor({ session }) {
  const [pending, approved, patients, appointments] = await Promise.all([
    pool.query("SELECT COUNT(*)::int AS count FROM konsultasi WHERE doctor_id=$1 AND status='Pending'", [session.id]),
    pool.query("SELECT COUNT(*)::int AS count FROM konsultasi WHERE doctor_id=$1 AND status='Approved' AND booking_date=CURRENT_DATE", [session.id]),
    pool.query("SELECT COUNT(*)::int AS count FROM (SELECT DISTINCT patient_id FROM rekam_medis WHERE doctor_id=$1) p", [session.id]),
    pool.query(`SELECT k.booking_date,k.status,u.full_name,k.complaint,j.start_time
      FROM konsultasi k JOIN users u ON u.id=k.patient_id JOIN jadwal j ON j.id=k.schedule_id
      WHERE k.doctor_id=$1 AND k.status='Approved' AND k.booking_date=CURRENT_DATE
      ORDER BY j.start_time LIMIT 5`, [session.id]),
  ]);

  return (
    <>
      <PageHeader
        title="Dashboard Dokter"
        subtitle="Aktivitas konsultasi Anda hari ini"
        action={
          <Link href="/dokter/jadwal" className="inline-flex min-h-11 items-center rounded-xl bg-teal-600 px-4 font-bold text-white transition hover:bg-teal-700">
            Atur Jadwal
          </Link>
        }
      />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Menunggu Validasi" value={pending.rows[0].count} detail="Janji temu baru" icon="calendar" tone="amber" />
        <StatCard title="Disetujui Hari Ini" value={approved.rows[0].count} detail="Siap dikonsultasikan" icon="clock" tone="teal" />
        <StatCard title="Pasien Diperiksa" value={patients.rows[0].count} detail="Jumlah unik" icon="users" tone="sky" />
      </div>
      <article className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4 font-bold text-slate-900">Janji Temu Hari Ini</div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="border-b border-slate-100 px-4 py-3">Waktu</th>
                <th className="border-b border-slate-100 px-4 py-3">Pasien</th>
                <th className="border-b border-slate-100 px-4 py-3">Keluhan</th>
                <th className="border-b border-slate-100 px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.rows.map((appointment) => (
                <tr key={`${appointment.full_name}-${appointment.start_time}`} className="border-b border-slate-100 text-sm last:border-b-0">
                  <td className="px-4 py-3">{String(appointment.start_time).slice(0, 5)}</td>
                  <td className="px-4 py-3 font-bold">{appointment.full_name}</td>
                  <td className="px-4 py-3">{appointment.complaint}</td>
                  <td className="px-4 py-3"><Badge tone="approved">Approved</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </>
  );
}

async function Patient({ session }) {
  const [latest, prescriptions, user] = await Promise.all([
    pool.query(`SELECT k.status,k.booking_date,j.start_time,u.full_name,p.nama_poli
      FROM konsultasi k JOIN users u ON u.id=k.doctor_id LEFT JOIN users du ON du.id=k.doctor_id LEFT JOIN poli p ON p.id=du.poli_id JOIN jadwal j ON j.id=k.schedule_id
      WHERE k.patient_id=$1 ORDER BY k.created_at DESC LIMIT 1`, [session.id]),
    pool.query(`SELECT pr.status FROM prescriptions pr JOIN rekam_medis rm ON rm.id=pr.id_rekam_medis
      WHERE rm.patient_id=$1 AND pr.status IN ('Siap Diambil','Sudah Diambil') ORDER BY pr.created_at DESC LIMIT 1`, [session.id]),
    pool.query("SELECT full_name FROM users WHERE id=$1", [session.id]),
  ]);
  const record = latest.rows[0];

  return (
    <>
      <PageHeader
        title={`Selamat datang, ${user.rows[0]?.full_name || "Pasien"}`}
        subtitle="Berikut ringkasan layanan kesehatan Anda"
        action={
          <Link href="/pasien/appointments/booking" className="inline-flex min-h-11 items-center rounded-xl bg-teal-600 px-4 font-bold text-white transition hover:bg-teal-700">
            Buat Janji Temu
          </Link>
        }
      />
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 font-bold text-slate-900">Janji Temu Terakhir</h3>
          <div className="flex items-center justify-between rounded-xl bg-teal-50 p-4">
            {record ? (
              <div>
                <b>{record.full_name}</b>
                <div className="text-sm text-slate-500">
                  {record.nama_poli || "Poli"} · {new Date(record.booking_date).toLocaleDateString("id-ID")} · {String(record.start_time).slice(0, 5)}
                </div>
              </div>
            ) : (
              <div className="text-slate-500">Belum ada janji temu</div>
            )}
            {record && (
              <Badge tone={record.status === "Approved" ? "approved" : record.status === "Pending" ? "pending" : "info"}>
                {record.status}
              </Badge>
            )}
          </div>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 font-bold text-slate-900">Notifikasi</h3>
          {prescriptions.rows[0] ? (
            <>
              <Badge tone={prescriptions.rows[0].status === "Siap Diambil" ? "ready" : "approved"}>
                {prescriptions.rows[0].status}
              </Badge>
              <p className="mt-2 text-sm text-slate-500">Status resep obat Anda diperbarui dari loket farmasi.</p>
            </>
          ) : (
            <p className="text-sm text-slate-500">Belum ada resep yang perlu diperhatikan.</p>
          )}
        </article>
      </div>
    </>
  );
}
