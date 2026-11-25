"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form.entries())),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Pendaftaran gagal.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 p-8">
      <form
        onSubmit={submit}
        className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-lg"
      >
        <Link href="/" className="font-black text-teal-600">RSDigital</Link>
        <h1 className="mt-4 text-3xl font-bold text-slate-900">Daftar Akun Pasien</h1>
        <p className="mt-1 mb-6 text-slate-500">Lengkapi data untuk membuat akun baru</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ["Nama Lengkap", "full_name", "text", "Nama lengkap"],
            ["Username", "username", "text", "username"],
            ["Email", "email", "email", "email@contoh.id"],
            ["No. Telepon", "phone", "tel", "08..."],
          ].map(([label, name, type, placeholder]) => (
            <div key={name}>
              <label className="mb-2 block text-sm font-bold text-slate-600">{label}</label>
              <input
                className="min-h-11 w-full rounded-lg border border-slate-300 px-3 outline-none focus:border-teal-500 focus:ring-3 focus:ring-teal-100"
                name={name}
                type={type}
                placeholder={placeholder}
                required={name !== "phone"}
              />
            </div>
          ))}
        </div>
        <label className="mt-4 mb-2 block text-sm font-bold text-slate-600">Password</label>
        <input
          className="min-h-11 w-full rounded-lg border border-slate-300 px-3 outline-none focus:border-teal-500 focus:ring-3 focus:ring-teal-100"
          name="password"
          type="password"
          placeholder="Minimal 8 karakter"
          required
        />
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <button className="mt-5 min-h-11 w-full rounded-xl bg-teal-600 px-5 py-3 font-bold text-white transition hover:bg-teal-700">
          Daftar
        </button>
        <p className="mt-4 text-center text-slate-500">
          Sudah punya akun? <Link href="/login" className="font-bold text-teal-600">Masuk</Link>
        </p>
      </form>
    </main>
  );
}
