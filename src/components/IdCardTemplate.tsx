/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Worker } from "../types";
import { 
  ShieldCheck, 
  Printer, 
  ArrowLeft, 
  User, 
  Barcode, 
  MapPin, 
  Compass, 
  Phone, 
  Bookmark, 
  Sparkles,
  Calendar,
  AlertTriangle,
  FileCheck
} from "lucide-react";

interface IdCardTemplateProps {
  worker: Worker;
  onClose: () => void;
}

export default function IdCardTemplate({ worker, onClose }: IdCardTemplateProps) {
  const [cardColor, setCardColor] = useState<"amber" | "emerald" | "slate" | "indigo">("amber");
  
  const handlePrint = () => {
    window.print();
  };

  // Helper dates (Issue date: current; expiry date: 2 years from now)
  const issueDate = "28 May 2026";
  const expiryDate = "27 May 2028";

  // Color theme classes mapping
  const themes = {
    amber: {
      border: "border-amber-500",
      accent: "bg-amber-500",
      accentText: "text-amber-600",
      gradient: "from-amber-500/10 via-amber-500/5 to-white",
      pill: "bg-amber-100 text-amber-800 border-amber-300",
      textBadge: "bg-amber-500 text-slate-950"
    },
    emerald: {
      border: "border-emerald-500",
      accent: "bg-emerald-500",
      accentText: "text-emerald-600",
      gradient: "from-emerald-500/10 via-emerald-500/5 to-white",
      pill: "bg-emerald-100 text-emerald-800 border-emerald-300",
      textBadge: "bg-emerald-500 text-slate-950"
    },
    slate: {
      border: "border-slate-800",
      accent: "bg-slate-900",
      accentText: "text-slate-900",
      gradient: "from-slate-500/10 via-slate-500/5 to-white",
      pill: "bg-slate-100 text-slate-800 border-slate-300",
      textBadge: "bg-slate-900 text-amber-400"
    },
    indigo: {
      border: "border-indigo-500",
      accent: "bg-indigo-600",
      accentText: "text-indigo-600",
      gradient: "from-indigo-500/10 via-indigo-500/5 to-white",
      pill: "bg-indigo-100 text-indigo-800 border-indigo-300",
      textBadge: "bg-indigo-600 text-white"
    }
  };

  const selectedTheme = themes[cardColor];

  // Derive unique placeholder photo based on worker name for a highly custom visual touch
  const getWorkerInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm overflow-y-auto p-4 md:p-8 flex items-start justify-center" id="id-card-generator-overlay">
      
      {/* Dynamic Print Styles specific for matching standard ID badge dimensions perfectly on standard A4 or Letter sheets */}
      <style>{`
        @media print {
          /* General page setup overlay overrides */
          body {
            background-color: white !important;
            color: black !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          #id-card-generator-overlay {
            position: absolute !important;
            inset: 0 !important;
            background: white !important;
            backdrop-filter: none !important;
            overflow: visible !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          .print-container {
            width: 100% !important;
            max-width: none !important;
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 2cm !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
          }
          .print-id-pair {
            display: flex !important;
            flex-direction: row !important;
            gap: 2cm !important;
            justify-content: center !important;
          }
          .id-card-outer {
            box-shadow: none !important;
            background-color: white !important;
            print-color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
          }
        }
      `}</style>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:my-4 print-container">
        
        {/* Actions header (Hidden on print) */}
        <div className="bg-slate-900 p-4 border-b border-slate-800 text-white flex flex-wrap gap-4 justify-between items-center no-print">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 transition-all text-sm font-bold cursor-pointer"
            id="close-card-generator"
          >
            <ArrowLeft className="h-4 w-4 text-slate-400" />
            Back to Registry
          </button>

          {/* Color Preset Selector */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400">Card Color Tier:</span>
            <div className="flex gap-1.5">
              {(Object.keys(themes) as Array<keyof typeof themes>).map((color) => (
                <button
                  key={color}
                  onClick={() => setCardColor(color)}
                  className={`w-5 h-5 rounded-full border-2 transition-all ${
                    color === "amber" ? "bg-amber-500" :
                    color === "emerald" ? "bg-emerald-500" :
                    color === "slate" ? "bg-slate-800" : "bg-indigo-600"
                  } ${cardColor === color ? "border-white scale-110 shadow-lg" : "border-transparent opacity-60 hover:opacity-100"}`}
                  title={`${color.toUpperCase()} Theme`}
                />
              ))}
            </div>
          </div>
          
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-black transition-all text-sm cursor-pointer shadow-md"
            id="print-worker-badge"
          >
            <Printer className="h-4 w-4" />
            Print ID Card / Save PDF
          </button>
        </div>

        {/* Workspace Display Area */}
        <div className="p-8 md:p-12 flex-1 bg-slate-100/70 flex flex-col justify-center items-center select-none print:p-0">
          
          {/* Header instructions */}
          <div className="text-center max-w-lg mb-8 no-print">
            <span className="text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200 px-3 py-1 rounded-full uppercase tracking-wider">
              🛡️ Official HSE ID Card Generator
            </span>
            <h2 className="text-xl font-bold text-slate-950 mt-2">Printable Site Security Badge</h2>
            <p className="text-xs text-slate-500 mt-1">
              Generates a certified 54mm x 86mm high resolution physical access card. Print, fold back-to-front, and laminate. Will scan instantly in Daily TBT minutes tracker.
            </p>
          </div>

          {/* Cards Pair Container */}
          <div className="print-id-pair flex flex-col md:flex-row gap-8 justify-center items-center w-full">
            
            {/* ====== BADGE FRONT SIDE ====== */}
            <div className={`id-card-outer w-[250px] h-[380px] rounded-2.5xl bg-white border-2 ${selectedTheme.border} flex flex-col overflow-hidden relative shadow-lg`}>
              
              {/* Card top banner style */}
              <div className={`${selectedTheme.accent} px-3 py-2 text-white text-center flex items-center justify-center gap-1.5`}>
                <ShieldCheck className="h-4 w-4 shrink-0 text-slate-950" />
                <span className="text-[10px] uppercase font-black tracking-widest text-slate-950">SITE ACCESS PERMIT</span>
              </div>

              {/* Lanyard representational Punch Hole Slot */}
              <div className="w-12 h-3 bg-slate-250 border border-slate-300 rounded-full mx-auto mt-2.5 flex items-center justify-center bg-slate-100 italic shrink-0" />

              {/* Security badge profile frame */}
              <div className="flex-1 flex flex-col items-center justify-center px-4 py-3 relative z-10">
                {/* Logo & Corporate Branding */}
                <div className="text-center mb-3">
                  <h4 className="text-[11px] font-black tracking-tight text-slate-950">EASY SAFETY SOLUTIONS</h4>
                  <p className="text-[7px] text-slate-400 font-bold uppercase tracking-widest -mt-0.5">MOHRE ACCREDITED PROVIDER</p>
                </div>

                {/* Worker Avatar Container */}
                <div className="relative mb-3.5">
                  <div className={`w-20 h-20 rounded-2xl border-2 ${selectedTheme.border} ${selectedTheme.gradient} flex items-center justify-center overflow-hidden shadow-inner`}>
                    {worker.signature ? (
                      /* If signature was loaded, we can use it as a decorative lock or show initials */
                      <div className="text-center p-2 text-slate-800 flex flex-col items-center">
                        <span className="text-2xl font-black font-sans leading-none">{getWorkerInitials(worker.name)}</span>
                        <span className="text-[8px] uppercase tracking-wider font-extrabold text-slate-400 mt-1">SECURED SIGN</span>
                      </div>
                    ) : (
                      <div className="text-center p-2 text-slate-800 flex flex-col items-center">
                        <span className="text-2xl font-black font-sans leading-none">{getWorkerInitials(worker.name)}</span>
                        <User className={`h-4 w-4 mt-1 ${selectedTheme.accentText}`} />
                      </div>
                    )}
                  </div>
                  {/* Floating certified badge */}
                  <span className={`absolute -bottom-1 -right-1 p-0.5 rounded-full border border-white text-white ${selectedTheme.accent}`} title="Verified Employee">
                    <FileCheck className="h-3.5 w-3.5" />
                  </span>
                </div>

                {/* Worker Identity Details */}
                <div className="text-center space-y-0.5 w-full">
                  <span className={`inline-block text-[8px] font-extrabold ${selectedTheme.pill} px-2.5 py-0.5 rounded uppercase tracking-wider border`}>
                    {worker.id}
                  </span>
                  <p className="font-extrabold text-sm text-slate-950 uppercase tracking-tight leading-tight pt-1 truncate max-w-full" title={worker.name}>
                    {worker.name}
                  </p>
                  <p className="text-[10px] text-slate-600 font-extrabold tracking-tight uppercase">
                    {worker.designation}
                  </p>
                </div>

                {/* Fake security microline and signature representation */}
                <div className="w-full border-t border-slate-100 mt-4 pt-2.5 flex justify-between items-center text-[7px] text-slate-400 font-bold">
                  <div className="text-left">
                    <span className="block text-[6px] tracking-wide text-slate-350">CARD SECURED BY</span>
                    <span className="font-mono text-slate-700">NAZEER-HSE-4.2</span>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <div className="w-[60px] h-3 border-b border-dashed border-slate-300 flex items-center justify-center font-mono">
                      {worker.signature ? (
                        <p className="text-[5px] text-slate-400 scale-90">Digital Sign Locked</p>
                      ) : (
                        <p className="text-[5px] text-slate-300">Auth Signature</p>
                      )}
                    </div>
                    <span className="text-[6px] text-slate-350 mt-0.5">AUTHORIZED OFFICER</span>
                  </div>
                </div>
              </div>

              {/* Barcode line representing standard terminal entry scans */}
              <div className="bg-slate-950 h-8 flex items-center justify-center px-6 gap-0.5 opacity-90 border-t border-slate-200">
                <Barcode className="h-4 w-4 text-white shrink-0 opacity-40 mr-1" />
                <div className="flex-1 flex justify-between items-center bg-slate-900 px-2 py-0.5 rounded text-[8px] text-slate-400 font-mono">
                  <span>REG ID: {worker.id}</span>
                  <span className="text-[7px] text-yellow-500 font-semibold uppercase tracking-wider">HSE VERIFIED</span>
                </div>
              </div>

            </div>

            {/* ====== BADGE BACK SIDE ====== */}
            <div className={`id-card-outer w-[250px] h-[380px] rounded-2.5xl bg-white border-2 ${selectedTheme.border} flex flex-col justify-between overflow-hidden relative shadow-lg`}>
              
              {/* Top Warning Banner */}
              <div className="bg-slate-900 px-3 py-2 text-center text-[10px] text-amber-500 font-extrabold tracking-wider flex items-center justify-center gap-1.5 border-b border-slate-800">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                <span>OFFICIAL COMPLIANCE RETURN</span>
              </div>

              {/* Punch Hole representation */}
              <div className="w-12 h-3 bg-slate-250 border border-slate-300 rounded-full mx-auto mt-2.5 flex items-center justify-center bg-slate-100 shrink-0" />

              {/* Security back credentials information */}
              <div className="px-4 flex-1 flex flex-col items-center justify-center text-center space-y-3 py-2">
                
                {/* Embedded QR Code */}
                <div className="space-y-1">
                  <div className="w-24 h-24 bg-white border border-slate-200 rounded-xl p-1.5 shadow-inner flex items-center justify-center relative mx-auto">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(worker.id)}`} 
                      alt="Compliance QR Scan" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-[7px] font-mono font-extrabold uppercase text-slate-400 tracking-wider">
                    SCAN TO ATTEND TBT MINUTES
                  </span>
                </div>

                {/* Important usage text instructions */}
                <div className="space-y-1 px-1">
                  <h5 className="text-[8px] font-black text-slate-950 uppercase tracking-tight">CARD RETURN REGULATORY</h5>
                  <p className="text-[7px] text-slate-500 leading-tight font-medium">
                    This card is the property of Easy Safety Solutions UAE. If found, please return immediately to Dubai Silicon Oasis HQ office.
                  </p>
                </div>

                {/* Contact phone hotline */}
                <div className="bg-slate-50 border border-slate-200/60 rounded-lg p-1.5 w-full text-[7px] font-mono text-slate-600 flex flex-col items-center justify-center gap-0.5">
                  <span className="font-extrabold text-[8px] text-slate-800 tracking-wide uppercase">DUBAI REGIONAL HOTLINE</span>
                  <span>TEL: 00971 56 239 5526 | UAE COMPLIANCE</span>
                </div>

                {/* Dates mapping */}
                <div className="grid grid-cols-2 gap-3 w-full border-t border-slate-100 pt-3 text-[7px] font-bold text-slate-400">
                  <div className="text-left pl-1">
                    <span className="block text-[6px] text-slate-350 uppercase">Issue Date</span>
                    <span className="text-slate-800 font-mono">{issueDate}</span>
                  </div>
                  <div className="text-right pr-1">
                    <span className="block text-[6px] text-slate-350 uppercase">Expiry Date</span>
                    <span className="text-slate-800 font-mono">{expiryDate}</span>
                  </div>
                </div>

              </div>

              {/* Bottom footer bar with certification logo */}
              <div className="bg-slate-900 border-t border-slate-800 px-3 py-2 text-center flex items-center justify-between text-[7px] text-slate-400 tracking-wider font-mono">
                <span className="text-[6px] text-slate-500">ESS © 2026 PAT: 2395526</span>
                <span className="text-amber-500 font-black uppercase tracking-widest text-[6px] flex items-center gap-0.5">
                  <Compass className="h-2.5 w-2.5 shrink-0" /> SECURITY APPROVED
                </span>
              </div>

            </div>

          </div>

          {/* Quick printer margins instructions (Hidden on print) */}
          <div className="mt-8 text-center bg-white p-4 border border-dashed border-slate-300 rounded-xl max-w-md no-print">
            <h5 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-950 mb-1">
              🖨️ Professional Print Setup Tip
            </h5>
            <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
              When the browser print dialog launches, set <strong>Margins</strong> to <strong>"Default"</strong> or <strong>"None"</strong>, and make sure <strong>"Background Graphics"</strong> is enabled under "More Settings" to preserve colors correctly.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
