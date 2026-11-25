"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui";

export default function PharmacyActions({ rows }) {
  const router=useRouter();
  const [message,setMessage]=useState("");
  async function update(id,status){
    setMessage("");
    const response=await fetch(`/api/farmasi/${id}`,{method:"PATCH",headers:{ "Content-Type":"application/json"},body:JSON.stringify({status})});
    const data=await response.json();
    if(!response.ok){setMessage(data.error||"Gagal memperbarui.");return;}
    setMessage("Status resep berhasil diperbarui.");router.refresh();
  }
  return <>
    {message && <p className="px-4 py-2 text-sm text-emerald-700">{message}</p>}
    <div className="overflow-x-auto"><table className="w-full"><thead><tr className="text-left text-xs uppercase tracking-wide text-slate-500"><th className="border-b border-slate-100 px-4 py-3">Resep</th><th className="border-b border-slate-100 px-4 py-3">Pasien</th><th className="border-b border-slate-100 px-4 py-3">Dokter</th><th className="border-b border-slate-100 px-4 py-3">Status</th><th className="border-b border-slate-100 px-4 py-3">Aksi</th></tr></thead><tbody>{rows.map(r=><tr key={r.id} className="border-b border-slate-100 text-sm last:border-b-0">
      <td className="px-4 py-3 font-bold">RX-{String(r.id).padStart(3,"0")}</td><td className="px-4 py-3">{r.patient_name}</td><td className="px-4 py-3">{r.doctor_name}</td>
      <td className="px-4 py-3"><Badge tone={r.status==="Siap Diambil"?"ready":r.status==="Sudah Diambil"?"approved":"pending"}>{r.status}</Badge></td>
      <td className="px-4 py-3">{r.status==="Menunggu Diproses"?<button className="min-h-9 rounded-lg bg-slate-100 px-3 font-bold text-slate-700" onClick={()=>update(r.id,"Siap Diambil")}>Tandai Siap</button>:r.status==="Siap Diambil"?<button className="min-h-9 rounded-lg bg-teal-600 px-3 font-bold text-white" onClick={()=>update(r.id,"Sudah Diambil")}>Serahkan</button>:<Badge tone="approved">Selesai</Badge>}</td>
    </tr>)}</tbody></table></div>
  </>;
}
