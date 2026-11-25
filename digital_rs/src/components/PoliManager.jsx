"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PageHeader } from "@/components/ui";

const fieldClass = "min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 outline-none focus:border-teal-500 focus:ring-3 focus:ring-teal-100";

export default function PoliManager({ initialPoli }) {
  const router = useRouter();
  const [editing, setEditing] = useState(null);
  const [nama, setNama] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState("");

  async function save(event) {
    event.preventDefault();
    setMessage("");
    const response = await fetch("/api/poli", {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing ? { id: editing.id, nama_poli: nama, description, image_url: imageUrl } : { nama_poli: nama, description, image_url: imageUrl }),
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error || "Gagal menyimpan.");
      return;
    }
    setEditing(null);
    setNama("");
    setDescription("");
    setImageUrl("");
    setMessage("Perubahan berhasil disimpan.");
    router.refresh();
  }

  async function remove(id) {
    if (!confirm("Hapus poli ini?")) return;
    const response = await fetch(`/api/poli?id=${id}`, { method: "DELETE" });
    if (response.ok) {
      setMessage("Poli berhasil dihapus.");
      router.refresh();
    } else {
      setMessage("Poli gagal dihapus.");
    }
  }

  function edit(poli) {
    setEditing(poli);
    setNama(poli.nama_poli);
    setDescription(poli.description || "");
    setImageUrl(poli.image_url || "");
  }

  return (
    <>
      <PageHeader title="Manajemen Poli" subtitle="Tambah dan kelola data poli" />
      <article className="mb-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <form onSubmit={save} className="grid items-end gap-3 lg:grid-cols-[1fr_2fr_1fr_auto]">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-600">Nama Poli</label>
            <input className={fieldClass} value={nama} onChange={(event) => setNama(event.target.value)} required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-600">Deskripsi</label>
            <input className={fieldClass} value={description} onChange={(event) => setDescription(event.target.value)} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-600">Ikon/Gambar (URL)</label>
            <input className={fieldClass} value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} />
          </div>
          <button className="min-h-11 rounded-xl bg-teal-600 px-4 font-bold text-white transition hover:bg-teal-700">
            {editing ? "Simpan" : "Tambah Poli"}
          </button>
        </form>
        {editing && (
          <button type="button" className="mt-3 min-h-10 rounded-lg bg-slate-100 px-3 font-bold text-slate-700" onClick={() => { setEditing(null); setNama(""); setDescription(""); setImageUrl(""); }}>
            Batal
          </button>
        )}
        {message && <p className="mt-3 text-sm text-emerald-700">{message}</p>}
      </article>
      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="text-left text-xs uppercase tracking-wide text-slate-500"><th className="border-b border-slate-100 px-4 py-3">Nama Poli</th><th className="border-b border-slate-100 px-4 py-3">Deskripsi</th><th className="border-b border-slate-100 px-4 py-3">Aksi</th></tr></thead>
            <tbody>
              {initialPoli.map((poli) => (
                <tr key={poli.id} className="border-b border-slate-100 text-sm last:border-b-0">
                  <td className="px-4 py-3 font-bold">{poli.nama_poli}</td>
                  <td className="px-4 py-3">{poli.description || "-"}</td>
                  <td className="px-4 py-3">
                    <button className="mr-2 min-h-9 rounded-lg bg-slate-100 px-3 font-bold text-slate-700" onClick={() => edit(poli)}>Edit</button>
                    <button className="min-h-9 rounded-lg bg-red-50 px-3 font-bold text-red-700" onClick={() => remove(poli.id)}>Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </>
  );
}
