"use client";

import { useState } from "react";

const fieldClass = "min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 outline-none focus:border-teal-500 focus:ring-3 focus:ring-teal-100";

export default function ProfileForm({ user, role }) {
  const [message, setMessage] = useState("");

  async function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form.entries())),
    });
    setMessage(response.ok ? "Perubahan berhasil disimpan." : "Perubahan gagal disimpan.");
  }

  return (
    <article className="max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-4 border-b border-slate-100 pb-5">
        <div className="grid size-18 shrink-0 place-items-center rounded-full bg-teal-100 text-2xl font-black text-teal-700">
          {(user.full_name || "U").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h3 className="font-bold text-slate-900">{user.full_name || "Pengguna"}</h3>
          <span className="text-sm text-slate-500">{role}</span>
        </div>
      </div>
      <form onSubmit={submit}>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            ["Nama Lengkap", "full_name", user.full_name || ""],
            ["Username", "username", user.username || ""],
            ["Email", "email", user.email || ""],
            ["No. Telepon", "phone", user.phone || ""],
          ].map(([label, name, value]) => (
            <div key={name}>
              <label className="mb-2 block text-sm font-bold text-slate-600">{label}</label>
              <input className={fieldClass} name={name} defaultValue={value} />
            </div>
          ))}
        </div>
        {(role === "Dokter" || role === "Pasien") && (
          <button className="mt-5 min-h-11 rounded-xl bg-teal-600 px-4 font-bold text-white transition hover:bg-teal-700">
            Simpan Perubahan
          </button>
        )}
        {message && <p className="mt-3 text-sm text-emerald-700">{message}</p>}
      </form>
    </article>
  );
}
