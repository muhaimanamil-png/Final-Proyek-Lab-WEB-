"use client";

import { useEffect, useState } from "react";
import { Badge, PageHeader } from "@/components/ui";

const fieldClass = "min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 outline-none focus:border-teal-500 focus:ring-3 focus:ring-teal-100";

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [doctors, setDoctors] = useState([]);
  const [polys, setPolys] = useState([]);
  const [selectedPoli, setSelectedPoli] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [scheduleId, setScheduleId] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [complaint, setComplaint] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/booking")
      .then((response) => response.json())
      .then((data) => {
        setDoctors(data.doctors || []);
        setPolys(data.poli || []);
      })
      .catch(() => {
        setDoctors([]);
        setPolys([]);
      });
  }, []);

  async function submit() {
    setMessage("");
    const response = await fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        doctor_id: Number(selectedDoctor),
        schedule_id: Number(scheduleId),
        booking_date: bookingDate,
        complaint,
      }),
    });
    const data = await response.json();
    setMessage(response.ok ? "Janji temu berhasil dikirim." : data.error || "Gagal membuat janji temu.");
  }

  return (
    <>
      <PageHeader title="Buat Janji Temu" subtitle="Ikuti tiga langkah sederhana untuk membuat janji" />
      <div className="mb-5 flex items-center gap-2">
        {[1, 2, 3].map((number) => (
          <div key={number} className="flex items-center gap-2">
            <Badge tone={step >= number ? "approved" : "info"}>Langkah {number}</Badge>
            {number < 3 && <span className="text-slate-300">—</span>}
          </div>
        ))}
      </div>
      <article className="max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {step === 1 && (
          <>
            <h3 className="mb-4 text-lg font-bold text-slate-900">Pilih Poli</h3>
            <div className="grid gap-3 md:grid-cols-2">
              {polys.map((poli) => (
                <button
                  key={poli.id}
                  onClick={() => { setSelectedPoli(poli.id); setSelectedDoctor(""); setScheduleId(""); setStep(2); }}
                  className="min-h-20 cursor-pointer rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-teal-300 hover:bg-teal-50"
                >
                  <b>{poli.nama_poli}</b>
                  <br />
                  <small className="text-slate-500">{poli.description || "Lihat dokter dan jadwal tersedia"}</small>
                </button>
              ))}
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <h3 className="mb-4 text-lg font-bold text-slate-900">Pilih Dokter dan Jadwal</h3>
            <label className="mb-2 block text-sm font-bold text-slate-600">Dokter</label>
            <select className={`${fieldClass} mb-4`} value={selectedDoctor} onChange={(event) => { setSelectedDoctor(event.target.value); setScheduleId(""); }}>
              <option value="">Pilih dokter</option>
              {doctors.filter((doctor) => String(doctor.poli_id) === String(selectedPoli)).map((doctor) => (
                <option key={doctor.id} value={doctor.id}>{doctor.full_name} — {doctor.nama_poli || "Dokter"}</option>
              ))}
            </select>
            <label className="mb-2 block text-sm font-bold text-slate-600">Jadwal</label>
            <select className={`${fieldClass} mb-4`} value={scheduleId} onChange={(event) => setScheduleId(event.target.value)}>
              <option value="">Pilih jadwal</option>
              {doctors.find((doctor) => String(doctor.id) === selectedDoctor)?.schedules?.map((schedule) => (
                <option key={schedule.id} value={schedule.id}>{schedule.day} · {String(schedule.start_time).slice(0, 5)}</option>
              ))}
            </select>
            <label className="mb-2 block text-sm font-bold text-slate-600">Tanggal</label>
            <input className={`${fieldClass} mb-4`} type="date" value={bookingDate} onChange={(event) => setBookingDate(event.target.value)} />
            <label className="mb-2 block text-sm font-bold text-slate-600">Keluhan</label>
            <textarea className={`${fieldClass} min-h-24 py-3`} value={complaint} onChange={(event) => setComplaint(event.target.value)} />
          </>
        )}
        {step === 3 && (
          <div>
            <h3 className="mb-4 text-lg font-bold text-slate-900">Konfirmasi Janji Temu</h3>
            <div className="rounded-xl bg-teal-50 p-5 leading-7">
              <b>Dokter:</b> {doctors.find((doctor) => String(doctor.id) === selectedDoctor)?.full_name || "-"}<br />
              <b>Tanggal:</b> {bookingDate || "-"}<br />
              <b>Keluhan:</b> {complaint || "-"}
            </div>
            <button className="mt-4 min-h-11 rounded-xl bg-teal-600 px-4 font-bold text-white" onClick={submit}>Kirim Permintaan</button>
            {message && <p className="mt-3 text-sm text-emerald-700">{message}</p>}
          </div>
        )}
        {step > 1 && (
          <button className="mr-2 mt-5 min-h-11 rounded-xl bg-slate-100 px-4 font-bold text-slate-700" onClick={() => setStep(step - 1)}>Kembali</button>
        )}
        {step === 2 && (
          <button className="mt-5 min-h-11 rounded-xl bg-teal-600 px-4 font-bold text-white" onClick={() => setStep(3)}>Lanjutkan</button>
        )}
      </article>
    </>
  );
}
