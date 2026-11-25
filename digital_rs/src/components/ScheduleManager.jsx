"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge, PageHeader } from "@/components/ui";

const fieldClass = "min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 outline-none focus:border-teal-500 focus:ring-3 focus:ring-teal-100";

export default function ScheduleManager({ initialSchedules }) {
  const router = useRouter();
  const [day, setDay] = useState("Senin");
  const [time, setTime] = useState("08:00");
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState("");

  async function save(event) {
    event.preventDefault();
    setMessage("");
    const method = editing ? "PATCH" : "POST";
    const body = editing ? { id: editing.id, day_of_week: day, start_time: time, duration_minutes: 30 } : { day_of_week: day, start_time: time, duration_minutes: 30 };
    const response = await fetch("/api/jadwal", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await response.json();
    if (!response.ok) { setMessage(data.error || "Gagal menyimpan jadwal."); return; }
    setEditing(null);
    setMessage(editing ? "Jadwal berhasil diubah." : "Jadwal berhasil ditambahkan.");
    router.refresh();
  }

  async function remove(id) {
    if (!confirm("Hapus jadwal ini?")) return;
    const response = await fetch(`/api/jadwal?id=${id}`, { method: "DELETE" });
    if (response.ok) { setMessage("Jadwal berhasil dihapus."); router.refresh(); }
  }

  function edit(schedule) {
    setEditing(schedule);
    setDay(schedule.day_of_week);
    setTime(String(schedule.start_time).slice(0, 5));
  }

  return (
    <>
      <PageHeader title="Jadwal Praktik" subtitle="Kelola jadwal praktik pribadi Anda" />
      <article className="mb-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <form onSubmit={save} className="grid items-end gap-3 md:grid-cols-4">
          <div><label className="mb-2 block text-sm font-bold text-slate-600">Hari</label><select className={fieldClass} value={day} onChange={(event) => setDay(event.target.value)}>{["Senin","Selasa","Rabu","Kamis","Jumat","Sabtu","Minggu"].map((item) => <option key={item}>{item}</option>)}</select></div>
          <div><label className="mb-2 block text-sm font-bold text-slate-600">Jam Mulai</label><input className={fieldClass} type="time" value={time} onChange={(event) => setTime(event.target.value)} required /></div>
          <div><label className="mb-2 block text-sm font-bold text-slate-600">Durasi</label><input className={`${fieldClass} bg-slate-50`} type="number" value={30} readOnly /></div>
          <button className="min-h-11 rounded-xl bg-teal-600 px-4 font-bold text-white">{editing ? "Simpan Jadwal" : "Tambah Jadwal"}</button>
        </form>
        {message && <p className="mt-3 text-sm text-emerald-700">{message}</p>}
      </article>
      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="text-left text-xs uppercase tracking-wide text-slate-500"><th className="border-b border-slate-100 px-4 py-3">Hari</th><th className="border-b border-slate-100 px-4 py-3">Jam Mulai</th><th className="border-b border-slate-100 px-4 py-3">Durasi</th><th className="border-b border-slate-100 px-4 py-3">Status</th><th className="border-b border-slate-100 px-4 py-3">Aksi</th></tr></thead>
            <tbody>{initialSchedules.map((schedule) => (
              <tr key={schedule.id} className="border-b border-slate-100 text-sm last:border-b-0">
                <td className="px-4 py-3 font-bold">{schedule.day_of_week}</td><td className="px-4 py-3">{String(schedule.start_time).slice(0,5)}</td><td className="px-4 py-3">{schedule.duration_minutes} menit</td>
                <td className="px-4 py-3"><Badge tone="approved">Aktif</Badge></td>
                <td className="px-4 py-3"><button className="mr-2 min-h-9 rounded-lg bg-slate-100 px-3 font-bold text-slate-700" onClick={() => edit(schedule)}>Edit</button><button className="min-h-9 rounded-lg bg-red-50 px-3 font-bold text-red-700" onClick={() => remove(schedule.id)}>Hapus</button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </article>
    </>
  );
}
