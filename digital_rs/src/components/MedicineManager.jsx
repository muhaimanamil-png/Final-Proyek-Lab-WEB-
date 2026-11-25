"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge, PageHeader } from "@/components/ui";

const fieldClass = "min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 outline-none focus:border-teal-500 focus:ring-3 focus:ring-teal-100";

export default function MedicineManager({ medicines }) {
  const router = useRouter();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nama_obat: "", description: "", jenis_obat: "biasa", stock: "", expired_date: "", image_url: "" });
  const [message, setMessage] = useState("");

  function field(name, value) { setForm((current) => ({ ...current, [name]: value })); }

  function edit(medicine) {
    setEditing(medicine);
    setForm({ nama_obat: medicine.nama_obat, description: medicine.description || "", jenis_obat: medicine.jenis_obat, stock: String(medicine.stock), expired_date: medicine.expired_date?.slice(0, 10) || "", image_url: medicine.image_url || "" });
  }

  async function save(event) {
    event.preventDefault();
    setMessage("");
    const response = await fetch(editing ? `/api/obat/${editing.id}` : "/api/obat", {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, stock: Number(form.stock) }),
    });
    const data = await response.json();
    if (!response.ok) { setMessage(data.error || "Gagal menyimpan obat."); return; }
    setMessage(editing ? "Obat berhasil diperbarui." : "Obat berhasil ditambahkan.");
    setEditing(null);
    setForm({ nama_obat: "", description: "", jenis_obat: "biasa", stock: "", expired_date: "", image_url: "" });
    router.refresh();
  }

  async function remove(medicine) {
    if (!confirm(`Hapus obat ${medicine.nama_obat}?`)) return;
    const response = await fetch(`/api/obat/${medicine.id}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) { setMessage(data.error || "Gagal menghapus obat."); return; }
    setMessage("Obat berhasil dihapus.");
    router.refresh();
  }

  return (
    <>
      <PageHeader title="Daftar Obat" subtitle="Kelola stok dan masa kadaluarsa" />
      <article className="mb-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <form onSubmit={save} className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {[
            ["Nama Obat", "nama_obat", "text"],
            ["Deskripsi", "description", "text"],
            ["Stok", "stock", "number"],
            ["Tanggal Kadaluwarsa", "expired_date", "date"],
            ["Gambar (URL)", "image_url", "text"],
          ].map(([label, name, type]) => (
            <div key={name}>
              <label className="mb-2 block text-sm font-bold text-slate-600">{label}</label>
              <input className={fieldClass} type={type} min={name === "stock" ? "0" : undefined} value={form[name]} onChange={(event) => field(name, event.target.value)} required={name !== "image_url"} />
            </div>
          ))}
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-600">Tipe Obat</label>
            <select className={fieldClass} value={form.jenis_obat} onChange={(event) => field("jenis_obat", event.target.value)}>
              <option value="biasa">Biasa</option><option value="keras">Keras</option>
            </select>
          </div>
          <div className="flex gap-2 md:col-span-2 lg:col-span-3">
            <button className="min-h-11 rounded-xl bg-teal-600 px-4 font-bold text-white">{editing ? "Simpan" : "Tambah Obat"}</button>
            {editing && <button type="button" className="min-h-11 rounded-xl bg-slate-100 px-4 font-bold text-slate-700" onClick={() => setEditing(null)}>Batal</button>}
          </div>
        </form>
        {message && <p className="mt-3 text-sm text-emerald-700">{message}</p>}
      </article>
      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="text-left text-xs uppercase tracking-wide text-slate-500"><th className="border-b border-slate-100 px-4 py-3">Nama Obat</th><th className="border-b border-slate-100 px-4 py-3">Jenis</th><th className="border-b border-slate-100 px-4 py-3">Stok</th><th className="border-b border-slate-100 px-4 py-3">Expired</th><th className="border-b border-slate-100 px-4 py-3">Status</th><th className="border-b border-slate-100 px-4 py-3">Aksi</th></tr></thead>
            <tbody>{medicines.map((medicine) => {
              const expired = new Date(medicine.expired_date) < new Date();
              const tone = expired ? "expired" : medicine.stock > 0 ? "approved" : "rejected";
              const label = expired ? "Kadaluarsa" : medicine.stock > 0 ? "Tersedia" : "Tidak Tersedia";
              return (
                <tr key={medicine.id} className="border-b border-slate-100 text-sm last:border-b-0">
                  <td className="px-4 py-3 font-bold">{medicine.nama_obat}</td><td className="px-4 py-3">{medicine.jenis_obat}</td><td className="px-4 py-3">{medicine.stock}</td>
                  <td className="px-4 py-3">{new Date(medicine.expired_date).toLocaleDateString("id-ID")}</td><td className="px-4 py-3"><Badge tone={tone}>{label}</Badge></td>
                  <td className="px-4 py-3"><button className="mr-2 min-h-9 rounded-lg bg-slate-100 px-3 font-bold text-slate-700" onClick={() => edit(medicine)}>Edit</button><button className="min-h-9 rounded-lg bg-red-50 px-3 font-bold text-red-700" onClick={() => remove(medicine)}>Hapus</button></td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      </article>
    </>
  );
}
