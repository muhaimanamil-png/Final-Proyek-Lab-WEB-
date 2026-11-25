"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui";

export default function AppointmentActions({ rows, patientNameKey="patient_name", showDoctor=true }) {
  const router=useRouter();
  const [message,setMessage]=useState("");
  async function update(id,status){
    setMessage("");
    let rejection_reason="";
    if(status==="Rejected"){
      rejection_reason=prompt("Masukkan alasan penolakan:");
      if(!rejection_reason?.trim()) {setMessage("Alasan penolakan wajib diisi.");return;}
    }
    const response=await fetch(`/api/appointments/${id}`,{method:"PATCH",headers:{ "Content-Type":"application/json"},body:JSON.stringify({status,rejection_reason})});
    const data=await response.json();
    if(!response.ok){setMessage(data.error||"Gagal memperbarui.");return;}
    setMessage(status==="Approved"?"Janji temu disetujui.":"Janji temu ditolak.");
    router.refresh();
  }
  return <>
    {message && <p className="px-4 py-2 text-sm text-emerald-700">{message}</p>}
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
            <th className="border-b border-slate-100 px-4 py-3">Pasien</th>{showDoctor && <th className="border-b border-slate-100 px-4 py-3">Dokter</th>}
            <th className="border-b border-slate-100 px-4 py-3">Tanggal</th><th className="border-b border-slate-100 px-4 py-3">Jam</th><th className="border-b border-slate-100 px-4 py-3">Keluhan</th><th className="border-b border-slate-100 px-4 py-3">Status</th><th className="border-b border-slate-100 px-4 py-3">Aksi</th>
          </tr>
        </thead>
        <tbody>{rows.map((row) => (
          <tr key={row.id} className="border-b border-slate-100 text-sm last:border-b-0">
            <td className="px-4 py-3 font-bold">{row[patientNameKey] || row.full_name}</td>{showDoctor && <td className="px-4 py-3">{row.doctor_name}</td>}
            <td className="px-4 py-3">{new Date(row.booking_date).toLocaleDateString("id-ID")}</td><td className="px-4 py-3">{String(row.start_time).slice(0, 5)}</td><td className="px-4 py-3">{row.complaint}</td><td className="px-4 py-3"><Badge tone="pending">Pending</Badge></td>
            <td className="px-4 py-3">
              <button className="mr-2 min-h-9 rounded-lg bg-teal-600 px-3 font-bold text-white" onClick={() => update(row.id, "Approved")}>Approve</button>
              <button className="min-h-9 rounded-lg bg-red-50 px-3 font-bold text-red-700" onClick={() => update(row.id, "Rejected")}>Reject</button>
            </td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  </>;
}
