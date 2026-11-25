"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui";

export default function PatientAppointmentActions({ rows }) {
  const router=useRouter();
  const [message,setMessage]=useState("");
  async function cancel(id){
    if(!confirm("Batalkan janji temu ini?"))return;
    setMessage("");
    const response=await fetch(`/api/appointments/${id}`,{method:"PATCH",headers:{ "Content-Type":"application/json"},body:JSON.stringify({status:"Cancelled"})});
    if(!response.ok){setMessage("Janji temu gagal dibatalkan.");return;}
    setMessage("Janji temu berhasil dibatalkan.");router.refresh();
  }
  return <>
    {message&&<p className="px-4 py-2 text-sm text-emerald-700">{message}</p>}
    <div className="overflow-x-auto"><table className="w-full"><thead><tr className="text-left text-xs uppercase tracking-wide text-slate-500"><th className="border-b border-slate-100 px-4 py-3">Tanggal</th><th className="border-b border-slate-100 px-4 py-3">Jam</th><th className="border-b border-slate-100 px-4 py-3">Dokter</th><th className="border-b border-slate-100 px-4 py-3">Poli</th><th className="border-b border-slate-100 px-4 py-3">Status</th><th className="border-b border-slate-100 px-4 py-3">Aksi</th></tr></thead><tbody>{rows.map(r=><tr key={r.id} className="border-b border-slate-100 text-sm last:border-b-0">
      <td className="px-4 py-3">{new Date(r.booking_date).toLocaleDateString("id-ID")}</td><td className="px-4 py-3">{String(r.start_time).slice(0,5)}</td><td className="px-4 py-3 font-bold">{r.full_name}</td><td className="px-4 py-3">{r.nama_poli||"-"}</td>
      <td className="px-4 py-3"><Badge tone={r.status==="Approved"?"approved":r.status==="Pending"?"pending":"info"}>{r.status}</Badge></td>
      <td className="px-4 py-3">{r.status==="Pending"?<button className="min-h-9 rounded-lg bg-red-50 px-3 font-bold text-red-700" onClick={()=>cancel(r.id)}>Batalkan</button>:<span className="text-slate-400">-</span>}</td>
    </tr>)}</tbody></table></div>
  </>;
}
