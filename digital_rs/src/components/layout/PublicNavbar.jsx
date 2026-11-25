import Link from "next/link";

export default function PublicNavbar() {
  return (
    <header className="sticky top-0 z-20 flex h-18 items-center border-b border-slate-200 bg-white/95">
      <nav className="mx-auto flex w-[calc(100%-40px)] max-w-295 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 font-black text-slate-800">
          <span className="grid size-10 place-items-center rounded-xl bg-teal-500 text-xl text-white">+</span>
          RS Digital
        </Link>
        <div className="flex items-center gap-7">
          <Link href="/">Beranda</Link><Link href="/poli">Poli</Link><Link href="/dokter">Dokter</Link>
          <Link href="/login" className="inline-flex min-h-11 items-center rounded-xl bg-teal-600 px-4 font-bold text-white transition hover:bg-teal-700">Masuk</Link>
        </div>
      </nav>
    </header>
  );
}