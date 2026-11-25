"use client";

import { useState } from "react";

const fieldClass = "min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 outline-none focus:border-teal-500 focus:ring-3 focus:ring-teal-100";

export default function MedicalRecordForm({ consultation, medicines }) {
  const [diagnosis, setDiagnosis] = useState("");
  const [action, setAction] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");

  function addItem() {
    setItems((current) => [...current, { id_obat: "", quantity: 1 }]);
  }

  async function submit(event) {
    event.preventDefault();
    setMessage("");
    const response = await fetch("/api/rekam-medis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        consultation_id: consultation?.id,
        patient_id: consultation?.patient_id,
        diagnosis,
        medical_action: action,
        notes,
        items: items
          .filter((item) => item.id_obat)
          .map((item) => ({ ...item, id_obat: Number(item.id_obat), quantity: Number(item.quantity) })),
      }),
    });
    const data = await response.json();
    setMessage(response.ok ? "Rekam medis dan resep berhasil disimpan." : data.error || "Gagal menyimpan.");
  }

  return (
    <form onSubmit={submit} className="grid gap-4 lg:grid-cols-2">
      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 font-bold text-slate-900">Hasil Pemeriksaan</h3>
        <label className="mb-2 block text-sm font-bold text-slate-600">Diagnosis</label>
        <textarea className={`${fieldClass} mb-4 min-h-24 py-3`} value={diagnosis} onChange={(event) => setDiagnosis(event.target.value)} placeholder="Masukkan diagnosis" required />
        <label className="mb-2 block text-sm font-bold text-slate-600">Tindakan Medis</label>
        <textarea className={`${fieldClass} mb-4 min-h-24 py-3`} value={action} onChange={(event) => setAction(event.target.value)} placeholder="Masukkan tindakan" required />
        <label className="mb-2 block text-sm font-bold text-slate-600">Catatan</label>
        <textarea className={`${fieldClass} min-h-24 py-3`} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Catatan tambahan" />
      </article>
      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 font-bold text-slate-900">Resep Obat</h3>
        {items.map((item, index) => (
          <div key={index} className="mb-2 grid grid-cols-[1fr_100px] gap-2">
            <select className={fieldClass} value={item.id_obat} onChange={(event) => setItems((current) => current.map((row, rowIndex) => rowIndex === index ? { ...row, id_obat: event.target.value } : row))}>
              <option value="">Pilih obat</option>
              {medicines.map((medicine) => <option key={medicine.id} value={medicine.id}>{medicine.nama_obat} (stok {medicine.stock})</option>)}
            </select>
            <input className={fieldClass} type="number" min="1" value={item.quantity} onChange={(event) => setItems((current) => current.map((row, rowIndex) => rowIndex === index ? { ...row, quantity: event.target.value } : row))} />
          </div>
        ))}
        <button type="button" className="min-h-10 rounded-lg bg-slate-100 px-3 font-bold text-slate-700" onClick={addItem}>+ Tambah Obat</button>
        <button className="mt-5 min-h-11 w-full rounded-xl bg-teal-600 px-4 font-bold text-white">Simpan Rekam Medis &amp; Resep</button>
        {message && <p className="mt-3 text-sm text-emerald-700">{message}</p>}
      </article>
    </form>
  );
}
