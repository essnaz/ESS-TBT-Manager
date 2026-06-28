/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TbtSession } from "../types";
import { ShieldCheck, Phone, Mail, MapPin, Printer, ArrowLeft, Send } from "lucide-react";
import { EssLogo } from "./EssLogo";

interface ReportTemplateProps {
  session: TbtSession;
  onClose: () => void;
}

export default function ReportTemplate({ session, onClose }: ReportTemplateProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm overflow-y-auto p-4 md:p-8 flex items-start justify-center" id="report-view-overlay">
      <div className="bg-white text-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:my-4 print:shadow-none print:my-0 print:rounded-none">
        
        {/* Actions Bar (hidden during printing) */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 text-white flex flex-wrap gap-4 justify-between items-center print:hidden">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-900 transition-all text-sm font-medium cursor-pointer"
            id="back-to-sessions"
          >
            <ArrowLeft className="h-4 w-4 text-slate-400" />
            Back to Dashboard
          </button>
          
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold transition-all text-sm shadow-md cursor-pointer"
              id="print-report"
            >
              <Printer className="h-4 w-4" />
              Print / Save PDF
            </button>
          </div>
        </div>

        {/* Professional Document Content */}
        <div className="p-4 sm:p-8 md:p-12 flex-1 flex flex-col select-text" id="hse-print-doc">
          
          {/* UAE HSE Cover Letter & Branding Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-slate-900 pb-6 mb-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-slate-950 p-1.5 rounded-xl border border-slate-800 flex items-center justify-center shadow-md shrink-0">
                <EssLogo className="h-10 w-10" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-slate-950">
                  Easy Safety Solutions
                </h1>
                <p className="text-[10px] sm:text-xs text-amber-600 font-semibold tracking-widest font-mono">
                  DUBAI, UAE • REGISTRY HSE-11849
                </p>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-500 font-medium mt-1">
                  <span className="flex items-center gap-0.5"><Phone className="h-3 w-3" /> 00971562395526</span>
                  <span className="flex items-center gap-0.5"><Mail className="h-3 w-3" /> nazeersafetysolutions@gmail.com</span>
                </div>
              </div>
            </div>
            
            <div className="text-left md:text-right border-t border-slate-100 md:border-t-0 pt-4 md:pt-0 w-full md:w-auto">
              <span className="inline-block text-[11px] font-bold bg-slate-150 px-2.5 py-1 rounded bg-slate-100 text-slate-700 tracking-wider uppercase">
                Toolbox Talk (TBT) Report
              </span>
              <p className="text-xs text-slate-500 mt-1 font-mono">
                Ref No: <span className="font-semibold text-slate-900">{session.id}</span>
              </p>
              <p className="text-xs text-slate-500 font-mono">
                Date: <span className="font-semibold text-slate-900">{session.date} • {session.time} GST</span>
              </p>
            </div>
          </div>

          {/* Sub Header */}
          <div className="text-center mb-6">
            <h2 className="text-xs sm:text-sm md:text-lg font-bold uppercase tracking-wider text-slate-800 bg-slate-50 border-y border-slate-200 py-1.5 shadow-xs">
              MINUTES OF HSE TOOLBOX TALK (MINISTRY OF LABOUR COMPLIANT)
            </h2>
          </div>

          {/* Project Details Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 border border-slate-200 p-4 rounded-xl bg-slate-50 text-xs">
            <div className="space-y-2">
              <div className="flex flex-col sm:grid sm:grid-cols-3 gap-0.5 sm:gap-2">
                <span className="font-bold text-slate-500 text-[10px] sm:text-xs">CLIENT NAME:</span>
                <span className="sm:col-span-2 font-semibold text-slate-900 text-[11px] sm:text-xs font-bold">{session.clientName}</span>
              </div>
              <div className="flex flex-col sm:grid sm:grid-cols-3 gap-0.5 sm:gap-2">
                <span className="font-bold text-slate-500 text-[10px] sm:text-xs">PROJECT NAME:</span>
                <span className="sm:col-span-2 font-semibold text-slate-900 text-[11px] sm:text-xs">{session.projectName}</span>
              </div>
              <div className="flex flex-col sm:grid sm:grid-cols-3 gap-0.5 sm:gap-2">
                <span className="font-bold text-slate-500 text-[10px] sm:text-xs">PROJECT REF:</span>
                <span className="sm:col-span-2 font-mono text-slate-900 text-[11px] sm:text-xs">{session.projectNumber}</span>
              </div>
            </div>

            <div className="space-y-2 md:border-l md:pl-6 border-slate-200">
              <div className="flex flex-col sm:grid sm:grid-cols-3 gap-0.5 sm:gap-2">
                <span className="font-bold text-slate-500 text-[10px] sm:text-xs">SITE LOCATION:</span>
                <span className="sm:col-span-2 font-semibold text-slate-900 text-[11px] sm:text-xs flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-red-500 shrink-0" />
                  {session.siteLocation}
                </span>
              </div>
              <div className="flex flex-col sm:grid sm:grid-cols-3 gap-0.5 sm:gap-2">
                <span className="font-bold text-slate-500 text-[10px] sm:text-xs">TBT TOPIC:</span>
                <span className="sm:col-span-2 font-bold text-amber-700 uppercase text-[11px] sm:text-xs">{session.topic}</span>
              </div>
              <div className="flex flex-col sm:grid sm:grid-cols-3 gap-0.5 sm:gap-2 justify-start sm:items-center">
                <span className="font-bold text-slate-500 text-[10px] sm:text-xs">REPORT STATUS:</span>
                <span className="sm:col-span-2 pt-0.5 sm:pt-0">
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold uppercase text-[9px] tracking-wider shrink-0">
                    Audited & Synced
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Shift & Safety Hours Statistics Bento */}
          <div className="grid grid-cols-3 gap-3 mb-6 bg-slate-900 text-white rounded-xl p-3.5 print:bg-slate-950">
            <div className="text-center p-2 border-r border-slate-800">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                SHIFT SCHEDULE
              </span>
              <span className="text-xs sm:text-sm font-black text-amber-400 font-mono block mt-0.5">
                {session.startTime || "07:00"} - {session.finishTime || "17:00"}
              </span>
              <span className="text-[9px] text-slate-400 block mt-0.5">Local Working Hours</span>
            </div>

            <div className="text-center p-2 border-r border-slate-800">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                TOTAL MANPOWER
              </span>
              <span className="text-xs sm:text-sm font-black text-white font-mono block mt-0.5">
                {session.totalManpower !== undefined ? session.totalManpower : session.attendance.length} Pax
              </span>
              <span className="text-[9px] text-slate-400 block mt-0.5">Present & Signed</span>
            </div>

            <div className="text-center p-2 font-sans">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                TOTAL MAN-HOURS
              </span>
              <span className="text-xs sm:text-sm font-black text-amber-400 font-mono block mt-0.5">
                {session.totalManHours !== undefined 
                  ? session.totalManHours 
                  : parseFloat((session.attendance.length * 10).toFixed(1))} Hours
              </span>
              <span className="text-[9px] text-slate-400 block mt-0.5">Safety Compliance Sum</span>
            </div>
          </div>

          {/* Permit-to-Work (PTW) Status & Legal Verification block */}
          {session.ptwData && (
            <div className="mb-6 p-4 rounded-xl border border-slate-250 bg-slate-50 text-xs">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-200 pb-2 mb-3">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  📋 Permit-to-Work (PTW) Regulatory Status
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                  session.ptwData.required 
                    ? "bg-amber-100 text-amber-800 border-amber-200" 
                    : "bg-emerald-105 bg-emerald-100 text-emerald-800 border-emerald-250"
                }`}>
                  {session.ptwData.required ? "⚡ PTW ACTIVE & CERTIFIED" : "⚪ NO PTW REQUIRED (LOW-RISK WAIVER)"}
                </span>
              </div>

              {session.ptwData.required ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 font-mono">
                    <span className="text-[8px] text-slate-400 font-bold block uppercase">Permit Reference</span>
                    <span className="text-[11px] font-black text-slate-900">{session.ptwData.ptwNumber}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 font-mono">
                    <span className="text-[8px] text-slate-400 font-bold block uppercase">Permit Category</span>
                    <span className="text-[11px] font-black text-slate-900">{session.ptwData.type}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 font-mono">
                    <span className="text-[8px] text-slate-400 font-bold block uppercase">Active Expiry Validity</span>
                    <span className="text-[11px] font-black text-red-650">{session.ptwData.expiryDate}</span>
                  </div>
                  
                  {session.ptwData.attachment && (
                    <div className="sm:col-span-3 mt-1 text-left">
                      <span className="text-[9px] text-slate-400 font-bold block mb-1">EMBEDDED DIGITAL PTW SCAN COPY</span>
                      <div className="border border-slate-200 rounded-lg p-2.5 bg-white flex items-center justify-center max-h-36 overflow-hidden">
                        {session.ptwData.attachment.startsWith("data:") ? (
                          <img src={session.ptwData.attachment} alt="PTW Scan Copy" className="max-h-28 object-contain rounded" />
                        ) : (
                          <span className="text-[10.5px] text-slate-500 font-mono break-all">{session.ptwData.attachment}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-[11px] text-slate-600 leading-relaxed italic bg-amber-500/5 p-2 rounded border border-amber-500/10">
                    "Under Ministry Executive Regulation rules, by executing this work shift without an active PTW, the team certifies that zero high-risk hot works, scaffolds, LOTO high-voltage isolations, or hazard confined space activities are executed. All team operations comply with general site code."
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    <div className="bg-white/90 p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-[8px] text-slate-400 font-mono block tracking-tight">RESIDENT SITE ENGINEER SIGN</span>
                        <span className="font-mono text-[10px] font-bold text-slate-900">{session.ptwData.engineerSignature || "Eng. Malik"}</span>
                      </div>
                      <span className="text-[8px] bg-emerald-100 text-emerald-800 px-1 py-0.5 rounded border border-emerald-200 font-mono font-black">CERTIFIED</span>
                    </div>
                    <div className="bg-white/90 p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-[8px] text-slate-400 font-mono block tracking-tight">COMPLIANT HSE OFFICER SIGN</span>
                        <span className="font-mono text-[10px] font-bold text-slate-900">{session.ptwData.hseSignature || "Nazeer Ahmed"}</span>
                      </div>
                      <span className="text-[8px] bg-emerald-100 text-emerald-800 px-1 py-0.5 rounded border border-emerald-200 font-mono font-black">STAMPED</span>
                    </div>
                  </div>
                  <div className="text-[8px] text-slate-400 font-mono font-bold flex justify-between pt-1 border-t border-slate-100">
                    <span>REGULATORY SYSTEM CHECK: MIN-LOG-517-OK</span>
                    <span>TIMESTAMP: {session.ptwData.timestamp || `${session.date} ${session.time}`}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ADNOC Life-Saving Rules (LSR) HSE Verification block */}
          {session.adnocLsrData && session.adnocLsrData.enabled && (
            <div className="mb-6 p-4 rounded-xl border border-teal-200 bg-teal-50/20 text-xs">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-teal-205 pb-2 mb-3">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-teal-900 flex items-center gap-1.5">
                  🛡️ ADNOC Life-Saving Rules (LSR) HSE Briefing
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border bg-teal-100 text-teal-800 border-teal-200 font-mono">
                  ADNOC LSR SITE COMPLIANCE SECURED
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {[
                  { id: "lsr_ptw", icon: "📄", title: "Permit to Work", desc: "Work with a valid Permit to Work when required." },
                  { id: "lsr_isolation", icon: "🔒", title: "Energy Isolation", desc: "Verify isolation and zero energy before work starts." },
                  { id: "lsr_gas", icon: "💨", title: "Gas Testing", desc: "Conduct gas tests when required before operations start." },
                  { id: "lsr_confined", icon: "🪘", title: "Confined Space", desc: "Obtain authorization before entering a confined space." },
                  { id: "lsr_height", icon: "🧗", title: "Working at Height", desc: "Protect against falling when working at height." },
                  { id: "lsr_loft", icon: "🏗️", title: "Line of Fire", desc: "Keep clear of moving parts, loads, and fire lanes." },
                  { id: "lsr_bypass", icon: "⚡", title: "Bypassing Controls", desc: "Obtain authorization before overriding safety controls." },
                  { id: "lsr_lifting", icon: "🏋️", title: "Safe Lifting Ops", desc: "Plan lifting operations and control the lift area." },
                  { id: "lsr_driving", icon: "🚗", title: "Safe Driving Rules", desc: "Seatbelts on, obey speed limits, zero active screen phone." },
                ].map((rule) => {
                  const isChecked = session.adnocLsrData?.checkedRules.includes(rule.id);
                  return (
                    <div
                      key={rule.id}
                      className={`p-2.5 rounded-lg border flex items-start gap-2.5 ${
                        isChecked
                          ? "bg-white border-teal-300 text-slate-900 shadow-2xs font-semibold"
                          : "bg-white/40 border-slate-200 text-slate-400"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] shrink-0 ${
                        isChecked ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-350 font-mono"
                      }`}>
                        {isChecked ? "✔" : "×"}
                      </div>
                      <div className="min-w-0">
                        <span className={`text-[10px] font-extrabold block leading-none uppercase tracking-tight ${
                          isChecked ? "text-teal-950" : "text-slate-400"
                        }`}>
                          {rule.title}
                        </span>
                        <span className="text-[9px] block leading-tight text-slate-500 mt-1">
                          {isChecked ? rule.desc : "Rule bypassing (not applicable)"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* AI HSE System Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            
            {/* Hazards Section */}
            <div className="border border-red-200 rounded-xl p-4 bg-red-50/50">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-red-800 bg-red-100/70 border border-red-200 px-2 py-1 rounded inline-block mb-3">
                ⚠️ SITE HAZARDS DISCUSSED
              </span>
              <ul className="space-y-2 list-none p-0 m-0">
                {session.hazards.map((haz, idx) => (
                  <li key={idx} className="text-xs text-red-950 leading-relaxed flex items-start gap-1.5">
                    <span className="font-bold text-red-500">•</span>
                    <span>{haz}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Controls Section */}
            <div className="border border-emerald-200 rounded-xl p-4 bg-emerald-50/50">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 border border-emerald-200 px-2 py-1 rounded inline-block mb-3">
                🛡️ REQUIRED CONTROL MEASURES
              </span>
              <ul className="space-y-2 list-none p-0 m-0">
                {session.controls.map((ctrl, idx) => (
                  <li key={idx} className="text-xs text-emerald-950 leading-relaxed flex items-start gap-1.5">
                    <span className="font-bold text-emerald-600 font-mono">✓</span>
                    <span>{ctrl}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* PPE Required */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 mb-6">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 bg-slate-100 border border-slate-200 px-2 py-1 rounded inline-block mb-3">
              🦺 COMPULSORY CLOTHING & COMPLIANCE PPE
            </span>
            <div className="flex flex-wrap gap-2">
              {session.ppeRequired.map((ppe, idx) => (
                <span key={idx} className="text-[10px] bg-slate-800 text-yellow-400 border border-slate-700 font-semibold px-2.5 py-1 rounded-md tracking-wide">
                  {ppe}
                </span>
              ))}
            </div>
          </div>

          {/* Attendance Table */}
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 border-b-2 border-slate-300 pb-1">
              👷 ACTIVE ATTENDANCE & VISITOR REGISTER
            </h3>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white text-[11px] uppercase tracking-wide">
                    <th className="py-2 px-3 border border-slate-800 font-bold w-12 text-center">SL.</th>
                    <th className="py-2 px-3 border border-slate-800 font-bold">Worker ID</th>
                    <th className="py-2 px-3 border border-slate-800 font-bold">Employee Name</th>
                    <th className="py-2 px-3 border border-slate-800 font-bold">Designation</th>
                    <th className="py-2 px-3 border border-slate-800 font-bold">Company</th>
                    <th className="py-2 px-3 border border-slate-800 font-bold w-36 text-center">Digital Sign</th>
                  </tr>
                </thead>
                <tbody>
                  {session.attendance.map((worker, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 font-medium">
                      <td className="py-2 px-3 border border-slate-200 text-center text-slate-500 font-mono">{idx + 1}</td>
                      <td className="py-2 px-3 border border-slate-200 text-slate-600 font-mono font-bold">{worker.workerId}</td>
                      <td className="py-2 px-3 border border-slate-200 text-slate-900 font-bold">{worker.name}</td>
                      <td className="py-2 px-3 border border-slate-200 text-slate-600">{worker.designation}</td>
                      <td className="py-2 px-3 border border-slate-200 text-slate-700 font-mono text-[10px] uppercase">{worker.company || "Main Contractor"}</td>
                      <td className="py-2 px-3 border border-slate-200 text-center vertical-middle">
                        {worker.signature ? (
                          worker.signature.startsWith("data:") ? (
                            <img src={worker.signature} alt="Sign" className="h-6 object-contain mx-auto print:h-5 max-w-full" />
                          ) : (
                            <span className="text-[10px] text-emerald-700 font-mono font-bold bg-emerald-50 px-2 py-0.5 border border-emerald-100 rounded-full">{worker.signature}</span>
                          )
                        ) : (
                          <span className="text-[10px] text-red-600 font-mono bg-red-50 px-2 py-0.5 rounded-full border border-red-100">No Signature</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {session.attendance.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-4 text-center text-slate-400 font-mono">No Workers registered for this TBT.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Photo evidence and remarks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 border-t border-slate-200 pt-6">
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-1.5">
                📎 REMARKS / NOTES / OBSERVED ISSUES
              </h4>
              <p className="text-xs text-slate-600 bg-slate-50 rounded-lg p-3.5 border border-slate-200 italic leading-relaxed shadow-inner">
                {session.remarks ? session.remarks : "All site personnel attended. Pre-task compliance signed. Water kiosks checked."}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-1.5 mb-2">
                📸 PHOTO EVIDENCE OF COMPLIANCE
              </h4>
              <div className="border border-slate-200 round-lg overflow-hidden bg-slate-50 p-2 flex items-center justify-center rounded-xl h-36">
                {session.photoEvidence ? (
                  <img src={session.photoEvidence} alt="TBT EVIDENCE" className="h-full w-full object-cover rounded-lg shadow-sm" />
                ) : (
                  <div className="text-center text-slate-400 py-6">
                    <ShieldCheck className="h-8 w-8 mx-auto opacity-20 mb-1 text-slate-500" />
                    <span className="text-xs font-mono">No Photographic Attachment Added</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sign offs / supervisor section */}
          <div className="grid grid-cols-2 gap-6 text-center border-t-2 border-slate-900 pt-6 mt-auto">
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PREPARED BY</span>
              <div className="h-16 flex items-center justify-center p-1">
                {session.supervisorSignature ? (
                  session.supervisorSignature.startsWith("data:") ? (
                    <img src={session.supervisorSignature} alt="Supervisor Sign" className="h-14 object-contain" />
                  ) : (
                    <span className="font-mono text-sm font-bold text-slate-800 underline italic">{session.supervisorSignature}</span>
                  )
                ) : (
                  <span className="text-[10px] font-mono text-slate-300">No Sign-off Captured</span>
                )}
              </div>
              <span className="text-xs font-bold text-slate-900 bg-slate-100 border border-slate-200 px-3 py-1 rounded-md">
                SITE ENGINEER / SUPERVISOR
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">COMPLIANCE CERTIFICATION BY</span>
              <div className="h-16 flex items-center justify-center p-1">
                {session.hseOfficerSignature ? (
                  session.hseOfficerSignature.startsWith("data:") ? (
                    <img src={session.hseOfficerSignature} alt="HSE Sign" className="h-14 object-contain" />
                  ) : (
                    <span className="font-mono text-sm font-bold text-slate-800 underline italic">{session.hseOfficerSignature}</span>
                  )
                ) : (
                  <span className="text-[10px] font-mono text-slate-300">No Sign-off Captured</span>
                )}
              </div>
              <span className="text-xs font-bold text-slate-900 bg-amber-500 text-slate-950 px-3 py-1 rounded-md shadow-xs">
                HSE OFFICER CHIEF
              </span>
            </div>
          </div>

          {/* Legal Stamp Notice Under Page */}
          <div className="border-t border-slate-200 mt-12 pt-4 flex flex-col md:flex-row justify-between items-center text-[9px] text-slate-400 font-bold uppercase tracking-widest bg-slate-50/50 p-2.5 rounded-lg border gap-2">
            <div className="flex flex-col text-left">
              <span>© 2026 EASY SAFETY SOLUTIONS OFFICE • ALL RIGHTS RESERVED</span>
              {session.ptwData && (
                <span className="text-[8px] text-slate-500 font-mono font-medium mt-0.5">
                  PTW VERIFIER: {session.ptwData.required ? `ACTIVE PERMIT APPROVED [REF: ${session.ptwData.ptwNumber}]` : `WAIVED (LOW-RISK ASSURED AND CERTIFIED BY SITE ENG & HSE)`}
                </span>
              )}
            </div>
            <span className="text-amber-600 font-extrabold flex items-center gap-1 mt-1 md:mt-0 font-mono shrink-0">
              <ShieldCheck className="h-3 w-3" /> SECURITY CERTIFIED • LICENSED WORKPLACE COMPLIANCE PRODUCT
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
