"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState("Pasien");
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role,
        username: form.get("username"),
        password: form.get("password"),
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Gagal masuk.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="grid min-h-screen bg-white md:grid-cols-2">
      <section className="hidden flex-col justify-center bg-linear-to-br from-slate-800 to-slate-700 p-16 text-white md:flex">
        <div className="grid size-14 place-items-center rounded-2xl bg-teal-500 text-3xl">+</div>
        <h1 className="mt-7 max-w-md text-5xl font-bold leading-tight">Selamat datang di RS Digital</h1>
        <p className="mt-4 max-w-md leading-7 text-slate-300">
          Akses layanan kesehatan, jadwal dokter, dan riwayat perawatan Anda dalam satu tempat.
        </p>
      </section>
      <section className="grid place-items-center p-8">
        <form onSubmit={submit} className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-slate-900">Masuk ke akun</h2>
          <p className="mt-2 mb-6 text-slate-500">Masukkan kredensial untuk melanjutkan</p>
          <label className="mb-2 block text-sm font-bold text-slate-600">Peran</label>
          <select
            className="mb-4 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 outline-none focus:border-teal-500 focus:ring-3 focus:ring-teal-100"
            value={role}
            onChange={(event) => setRole(event.target.value)}
          >
            <option>Admin</option>
            <option>Dokter</option>
            <option>Pasien</option>
          </select>
          <label className="mb-2 block text-sm font-bold text-slate-600">Username atau Email</label>
          <input
            className="mb-4 min-h-11 w-full rounded-lg border border-slate-300 px-3 outline-none focus:border-teal-500 focus:ring-3 focus:ring-teal-100"
            name="username"
            placeholder="nama@rsdigital.id"
            required
          />
          <label className="mb-2 block text-sm font-bold text-slate-600">Password</label>
          <input
            className="mb-5 min-h-11 w-full rounded-lg border border-slate-300 px-3 outline-none focus:border-teal-500 focus:ring-3 focus:ring-teal-100"
            name="password"
            type="password"
            placeholder="Masukkan password"
            required
          />
          {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
          <button className="min-h-11 w-full rounded-xl bg-teal-600 px-5 py-3 font-bold text-white transition hover:bg-teal-700">
            Masuk
          </button>
          <div className="mt-5 text-center text-slate-500">
            Belum punya akun?{" "}
            <Link href="/register" className="font-bold text-teal-600">Daftar sebagai Pasien</Link>
          </div>
          <div className="mt-3 text-center">
            <Link href="/" className="font-bold text-slate-600">Lanjutkan sebagai Tamu</Link>
          </div>
        </form>
      </section>
    </main>
  );
}
