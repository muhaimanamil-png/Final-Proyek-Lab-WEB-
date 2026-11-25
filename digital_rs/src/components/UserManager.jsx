"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge, PageHeader } from "@/components/ui";

const fieldClass = "min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 outline-none focus:border-teal-500 focus:ring-3 focus:ring-teal-100";

export default function UserManager({ users, polis }) {
  const router = useRouter();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ username: "", email: "", password: "", full_name: "", phone: "", role: "Pasien", poli_id: "" });
  const [message, setMessage] = useState("");

  function edit(user) {
    setEditing(user);
    setForm({ username: user.username, email: user.email, password: "", full_name: user.full_name || "", phone: user.phone || "", role: user.role, poli_id: user.poli_id || "" });
  }

  async function save(event) {
    event.preventDefault();
    setMessage("");
    const response = await fetch(editing ? `/api/users/${editing.id}` : "/api/users", {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, poli_id: form.poli_id ? Number(form.poli_id) : null }),
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error || "Gagal menyimpan pengguna.");
      return;
    }
    setMessage(editing ? "Pengguna berhasil diperbarui." : "Pengguna berhasil ditambahkan.");
    setEditing(null);
    setForm({ username: "", email: "", password: "", full_name: "", phone: "", role: "Pasien", poli_id: "" });
    router.refresh();
  }

  async function remove(user) {
    if (!confirm(`Hapus pengguna ${user.full_name || user.username}?`)) return;
    const response = await fetch(`/api/users/${user.id}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error || "Gagal menghapus pengguna.");
      return;
    }
    setMessage("Pengguna berhasil dihapus.");
    router.refresh();
  }

  function field(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  return (
    <>
      <PageHeader title="Daftar Pengguna" subtitle="Kelola seluruh pengguna sistem" />
      <article className="mb-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <form onSubmit={save} className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {[
            ["Nama Lengkap", "full_name", "text"],
            ["Username", "username", "text"],
            ["Email", "email", "email"],
            ["Password", "password", "password"],
          ].map(([label, name, type]) => (
            <div key={name}>
              <label className="mb-2 block text-sm font-bold text-slate-600">{label}</label>
              <input className={fieldClass} type={type} value={form[name]} onChange={(event) => field(name, event.target.value)} required />
            </div>
          ))}
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-600">Peran</label>
            <select className={fieldClass} value={form.role} onChange={(event) => field("role", event.target.value)}>
              <option>Admin</option><option>Dokter</option><option>Pasien</option>
            </select>
          </div>
          {form.role === "Dokter" && (
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-600">Poli</label>
              <select className={fieldClass} value={form.poli_id} onChange={(event) => field("poli_id", event.target.value)} required>
                <option value="">Pilih poli</option>
                {polis.map((poli) => <option key={poli.id} value={poli.id}>{poli.nama_poli}</option>)}
              </select>
            </div>
          )}
          <div className="flex gap-2 md:col-span-2 lg:col-span-3">
            <button className="min-h-11 rounded-xl bg-teal-600 px-4 font-bold text-white">{editing ? "Simpan Perubahan" : "Tambah Pengguna"}</button>
            {editing && <button type="button" className="min-h-11 rounded-xl bg-slate-100 px-4 font-bold text-slate-700" onClick={() => setEditing(null)}>Batal</button>}
          </div>
        </form>
        {message && <p className="mt-3 text-sm text-emerald-700">{message}</p>}
      </article>
      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="text-left text-xs uppercase tracking-wide text-slate-500"><th className="border-b border-slate-100 px-4 py-3">Nama</th><th className="border-b border-slate-100 px-4 py-3">Username</th><th className="border-b border-slate-100 px-4 py-3">Email</th><th className="border-b border-slate-100 px-4 py-3">Peran</th><th className="border-b border-slate-100 px-4 py-3">Tanggal Daftar</th><th className="border-b border-slate-100 px-4 py-3">Aksi</th></tr></thead>
            <tbody>{users.map((user) => (
              <tr key={user.id} className="border-b border-slate-100 text-sm last:border-b-0">
                <td className="px-4 py-3 font-bold">{user.full_name || "-"}</td><td className="px-4 py-3">{user.username}</td><td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3"><Badge tone="info">{user.role}</Badge></td><td className="px-4 py-3">{new Date(user.created_at).toLocaleDateString("id-ID")}</td>
                <td className="px-4 py-3"><button className="mr-2 min-h-9 rounded-lg bg-slate-100 px-3 font-bold text-slate-700" onClick={() => edit(user)}>Edit</button><button className="min-h-9 rounded-lg bg-red-50 px-3 font-bold text-red-700" onClick={() => remove(user)}>Hapus</button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </article>
    </>
  );
}
