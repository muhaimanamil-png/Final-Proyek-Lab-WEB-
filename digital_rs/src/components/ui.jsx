export function Icon({ name, size = 20 }) {
  const paths = {
    home: "M3 11.5 12 4l9 7.5M5 10v10h14V10M9 20v-6h6v6",
    users: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 10v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
    calendar: "M3 5h18v16H3zM16 3v4M8 3v4M3 9h18",
    clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 6v6l4 2",
    medical: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10ZM12 8v8M8 12h8",
    pill: "M10.5 20.5a6 6 0 0 1-8.5-8.5l8-8a6 6 0 0 1 8.5 8.5l-8 8ZM7 10l7 7",
    profile: "M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z",
    logout: "M10 17l5-5-5-5M15 12H3M21 3v18",
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[name] || paths.home} />
    </svg>
  );
}

export function Badge({ children, tone = "info" }) {
  const tones = {
    pending: "bg-amber-100 text-amber-800",
    approved: "bg-emerald-100 text-emerald-800",
    ready: "bg-emerald-100 text-emerald-800",
    rejected: "bg-red-100 text-red-700",
    expired: "bg-red-100 text-red-700",
    info: "bg-sky-100 text-sky-800",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${tones[tone] || tones.info}`}>
      {children}
    </span>
  );
}

export function StatCard({ title, value, detail, tone = "teal", icon }) {
  const toneStyles = {
    amber: "bg-amber-100 text-amber-700",
    teal: "bg-teal-100 text-teal-700",
    sky: "bg-sky-100 text-sky-700",
    violet: "bg-violet-100 text-violet-700",
  };
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3.5">
        <div className={`grid size-12 shrink-0 place-items-center rounded-xl ${toneStyles[tone] || toneStyles.teal}`}>
          <Icon name={icon} size={23} />
        </div>
        <div>
          <div className="text-xs font-medium text-slate-500">{title}</div>
          <strong className="mt-1 block text-2xl font-bold text-slate-900">{value}</strong>
          {detail && <div className="mt-1 text-xs text-slate-400">{detail}</div>}
        </div>
      </div>
    </article>
  );
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <header className="mb-5 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}
