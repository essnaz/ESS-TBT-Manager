import React, { useState } from "react";
import { 
  Users, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  ShieldCheck, 
  MessageSquare, 
  Lock, 
  Clock, 
  Award, 
  ChevronRight,
  TrendingUp,
  MapPin,
  RefreshCw,
  Zap,
  Sparkles,
  ToggleLeft,
  AlertTriangle
} from "lucide-react";
import { ClientAccount } from "../types";

interface ClientLicensingManagerProps {
  clients: ClientAccount[];
  setClients: React.Dispatch<React.SetStateAction<ClientAccount[]>>;
  sessions: any[];
  workers: any[];
}

export default function ClientLicensingManager({
  clients,
  setClients,
  sessions,
  workers
}: ClientLicensingManagerProps) {
  // New Client Form States
  const [companyName, setCompanyName] = useState("");
  const [adminLoginId, setAdminLoginId] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminPasscode, setAdminPasscode] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState<ClientAccount["subscriptionStatus"]>("Paid");
  const [expiryDate, setExpiryDate] = useState("2026-12-31");
  const [whatsappDispatch, setWhatsappDispatch] = useState(true);
  const [sigCanvas, setSigCanvas] = useState(true);
  const [ptwAttachment, setPtwAttachment] = useState(true);
  const [heatStressSensor, setHeatStressSensor] = useState(true);

  const [isAdding, setIsAdding] = useState(false);
  const [showActiveSection, setShowActiveSection] = useState<"list" | "create">("list");

  const [simulationEffect, setSimulationEffect] = useState<string | null>(null);

  // Auto-calculated stats based on sessions/workers
  const getCalculatedClientStats = (clientName: string) => {
    const clientSessions = sessions.filter(s => s.clientName === clientName);
    const sitesCount = Array.from(new Set(clientSessions.map(s => s.siteLocation))).filter(Boolean).length;
    // For workers, we compute based on unique worker interactions or a simple representation
    return {
      sessionsCount: clientSessions.length,
      sitesCount: sitesCount || 1,
    };
  };

  // Add Dynamic Client
  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyName.trim() || !adminLoginId.trim() || !adminPassword.trim()) {
      alert("Please enter Company Name, Administrator Email, and Gateway Password.");
      return;
    }

    const finalPasscode = adminPasscode.trim() || Math.floor(1000 + Math.random() * 9000).toString();
    const uniqueId = `CL-${Math.floor(Math.random() * 900 + 100)}`;
    const newClient: ClientAccount = {
      id: uniqueId,
      companyName: companyName.trim(),
      adminLoginId: adminLoginId.trim().toLowerCase(),
      adminPassword: adminPassword.trim(),
      passcode: finalPasscode,
      subscriptionStatus,
      subscriptionExpiryDate: expiryDate,
      allowedFeatures: {
        whatsappDispatch,
        sigCanvas,
        ptwAttachment,
        heatStressSensor
      },
      sitesActive: 0,
      usersActive: 0,
      sessionsCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setClients(prev => [newClient, ...prev]);

    // Reset Form
    setCompanyName("");
    setAdminLoginId("");
    setAdminPassword("");
    setAdminPasscode("");
    setSubscriptionStatus("Paid");
    setExpiryDate("2026-12-31");
    setWhatsappDispatch(true);
    setSigCanvas(true);
    setPtwAttachment(true);
    setHeatStressSensor(true);
    
    setShowActiveSection("list");
    triggerSimEffect(`Successfully deployed client tenant: ${newClient.companyName}`);
  };

  const handleDeleteClient = (id: string, name: string) => {
    if (confirm(`Are you absolutely sure you want to terminate the subscription tenant for: ${name}?\nAll active admin privileges will be revoked.`)) {
      setClients(prev => prev.filter(c => c.id !== id));
      triggerSimEffect(`Terminated client tenant license: ${name}`);
    }
  };

  // Simulate usage increments
  const simulateCreditIncrement = (clientId: string, type: "sessions" | "users" | "sites") => {
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        if (type === "sessions") {
          triggerSimEffect(`[Simulated telemetry] Added TBT Session log for ${c.companyName}`);
          return { ...c, sessionsCount: c.sessionsCount + 1 };
        } else if (type === "users") {
          triggerSimEffect(`[Simulated telemetry] Active HSE Team roster incremented for ${c.companyName}`);
          return { ...c, usersActive: c.usersActive + 1 };
        } else if (type === "sites") {
          triggerSimEffect(`[Simulated telemetry] Plotted new active project site for ${c.companyName}`);
          return { ...c, sitesActive: c.sitesActive + 1 };
        }
      }
      return c;
    }));
  };

  const toggleSubscriptionStatus = (clientId: string) => {
    const statuses: ClientAccount["subscriptionStatus"][] = ["Paid", "Trial", "Expired", "Unpaid"];
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        const currentIndex = statuses.indexOf(c.subscriptionStatus);
        const nextStatus = statuses[(currentIndex + 1) % statuses.length];
        triggerSimEffect(`Rotated subscription tier state of ${c.companyName} to: ${nextStatus}`);
        return { ...c, subscriptionStatus: nextStatus };
      }
      return c;
    }));
  };

  const triggerSimEffect = (msg: string) => {
    setSimulationEffect(msg);
    setTimeout(() => {
      setSimulationEffect(null);
    }, 4000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden" id="client-license-deck">
      
      {/* Tab Navigation header */}
      <div className="px-5 py-4 bg-slate-50 border-b border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-black tracking-widest text-cyan-700 uppercase font-mono block">CLIENT REGISTRY & BILLING MATRIX</span>
          <h4 className="text-sm font-extrabold text-slate-900 uppercase">Tenant & License Controller Dashboard</h4>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowActiveSection("list")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              showActiveSection === "list" 
                ? "bg-slate-900 text-white" 
                : "border border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            Active Client Tenants ({clients.length})
          </button>
          <button
            type="button"
            onClick={() => setShowActiveSection("create")}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              showActiveSection === "create" 
                ? "bg-cyan-600 text-white" 
                : "border border-slate-200 text-cyan-600 hover:bg-slate-100"
            }`}
            id="add-new-tenant-tab-btn"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Onboard New Tenant</span>
          </button>
        </div>
      </div>

      {simulationEffect && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-2.5 text-[11px] font-semibold text-emerald-800 flex items-center gap-2 animate-fade-in font-mono">
          <Sparkles className="h-4 w-4 text-emerald-500 animate-spin" />
          <span>{simulationEffect}</span>
        </div>
      )}

      {/* Grid Content */}
      <div className="p-6">
        
        {/* ==================== SUB-SECTION: CREATE / ONBOARD NEW TENANT ==================== */}
        {showActiveSection === "create" && (
          <form onSubmit={handleCreateClient} className="space-y-6 animate-fade-in" id="create-tenant-form">
            <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-5">
              <h5 className="text-xs font-black text-slate-900 uppercase tracking-tight mb-4 border-b border-slate-200 pb-2 flex items-center gap-2">
                <Users className="h-4 w-4 text-cyan-600" />
                Company Corporate Onboarding Specifications
              </h5>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-500">Corporate Company Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Al Habtoor Contractors LLC"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:ring-1 focus:ring-cyan-500 focus:outline-hidden text-slate-800"
                    id="tenant-form-company"
                  />
                  <p className="text-[9px] text-slate-400">Must match registered UAE business license trading designation.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-500">Client Admin Login ID (Email)</label>
                  <input
                    type="email"
                    value={adminLoginId}
                    onChange={(e) => setAdminLoginId(e.target.value)}
                    placeholder="e.g. admin@alhabtoor-safety.com"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:ring-1 focus:ring-cyan-500 focus:outline-hidden text-slate-800"
                    id="tenant-form-email"
                  />
                  <p className="text-[9px] text-slate-400">Unique credentials utilized by HSE Supervisor to access workspace.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-500">Secure Password Gateway</label>
                  <input
                    type="text"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Enter customized safety password"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:ring-1 focus:ring-cyan-500 focus:outline-hidden text-slate-800"
                    id="tenant-form-password"
                  />
                  <p className="text-[9px] text-slate-400">Minimum 6 characters recommended for safety audit locks.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-500">Offline Passcode PIN (4 Digits)</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={adminPasscode}
                    onChange={(e) => setAdminPasscode(e.target.value.replace(/\D/g, ""))}
                    placeholder="e.g. 5566"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:ring-1 focus:ring-cyan-500 focus:outline-hidden text-slate-800"
                    id="tenant-form-passcode"
                  />
                  <p className="text-[9px] text-slate-400">4-6 digit numeric pin used for instant off-line log-ins.</p>
                </div>
              </div>
            </div>

            <div className="border border-slate-150 rounded-2xl p-5 space-y-4">
              <h5 className="text-xs font-black text-slate-900 uppercase tracking-tight border-b border-slate-200 pb-2 flex items-center gap-2">
                <Zap className="h-4 w-4 text-cyan-600" />
                Subscription Status & Telemetry Allowances
              </h5>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-500">License Billing Tier</label>
                  <select
                    value={subscriptionStatus}
                    onChange={(e) => setSubscriptionStatus(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:ring-1 focus:ring-cyan-500 focus:outline-hidden text-slate-800"
                  >
                    <option value="Paid">Paid Account (Active Certificate)</option>
                    <option value="Trial">Standard 7-Day Trial Mode</option>
                    <option value="Expired">Expired Subscription Blocked</option>
                    <option value="Unpaid">Unpaid Grace Status</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-500">Subscription Expiration Date</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:ring-1 focus:ring-cyan-500 focus:outline-hidden text-slate-800"
                  />
                </div>
              </div>

              {/* Toggle allowances */}
              <div className="space-y-3 pt-2">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Earmarked Permitted Systems</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  
                  <label className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/50 cursor-pointer transition-all">
                    <input
                      type="checkbox"
                      checked={whatsappDispatch}
                      onChange={() => setWhatsappDispatch(!whatsappDispatch)}
                      className="rounded text-cyan-600 focus:ring-cyan-500"
                    />
                    <div>
                      <span className="text-[11px] font-bold text-slate-900 block leading-tight">WhatsApp Gateway</span>
                      <span className="text-[9px] text-slate-400">Twilio business alerts</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/50 cursor-pointer transition-all">
                    <input
                      type="checkbox"
                      checked={sigCanvas}
                      onChange={() => setSigCanvas(!sigCanvas)}
                      className="rounded text-cyan-600 focus:ring-cyan-500"
                    />
                    <div>
                      <span className="text-[11px] font-bold text-slate-900 block leading-tight">MOHRE Sig Canvas</span>
                      <span className="text-[9px] text-slate-400">Drawn legal signatures</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/50 cursor-pointer transition-all">
                    <input
                      type="checkbox"
                      checked={ptwAttachment}
                      onChange={() => setPtwAttachment(!ptwAttachment)}
                      className="rounded text-cyan-600 focus:ring-cyan-500"
                    />
                    <div>
                      <span className="text-[11px] font-bold text-slate-900 block leading-tight">PTW Attachments</span>
                      <span className="text-[9px] text-slate-400">Hot/Height Permits uploads</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/50 cursor-pointer transition-all">
                    <input
                      type="checkbox"
                      checked={heatStressSensor}
                      onChange={() => setHeatStressSensor(!heatStressSensor)}
                      className="rounded text-cyan-600 focus:ring-cyan-500"
                    />
                    <div>
                      <span className="text-[11px] font-bold text-slate-900 block leading-tight">Thermal Sense API</span>
                      <span className="text-[9px] text-slate-400">Heat Index calculations</span>
                    </div>
                  </label>

                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowActiveSection("list")}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-slate-900 text-amber-500 font-extrabold rounded-xl text-xs hover:bg-slate-850 cursor-pointer flex items-center gap-1.5 shadow-md"
                id="submit-onboard-form-btn"
              >
                <ShieldCheck className="h-4 w-4" />
                Deploy Corporate Tenant Node
              </button>
            </div>
          </form>
        )}

        {/* ==================== SUB-SECTION: ACTIVE INSTANCES TABLE LIST ==================== */}
        {showActiveSection === "list" && (
          <div className="space-y-6 animate-fade-in" id="active-tenant-instances-container">
            <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
              The following isolated databases represent activated corporate tenants. You can manage their subscription durations and toggle functional feature permissions instantly.
            </p>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {clients.map((cli) => {
                const dynamicStats = getCalculatedClientStats(cli.companyName);
                const hasExpired = cli.subscriptionStatus === "Expired";

                // Determine badge style
                const badgeColor = 
                  cli.subscriptionStatus === "Paid" ? "bg-emerald-100 text-emerald-800 border-emerald-200" :
                  cli.subscriptionStatus === "Trial" ? "bg-cyan-100 text-cyan-800 border-cyan-200" :
                  cli.subscriptionStatus === "Expired" ? "bg-rose-100 text-rose-800 border-rose-200" :
                  "bg-amber-105 text-amber-800 border-amber-200";

                return (
                  <div 
                    key={cli.id} 
                    className={`bg-white rounded-2xl border transition-all relative overflow-hidden ${
                      hasExpired ? "border-red-200 shadow-xs opacity-90 hover:opacity-100" : "border-slate-200 hover:border-slate-350 shadow-xs"
                    }`}
                  >
                    
                    {/* Top Company Title Block */}
                    <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold bg-slate-900 text-cyan-400 px-2 py-0.5 rounded uppercase">
                            {cli.id}
                          </span>
                          <h5 className="text-xs font-black text-slate-900 uppercase tracking-tight">{cli.companyName}</h5>
                        </div>
                        <p className="text-[9px] text-slate-400 flex items-center gap-1 font-mono">
                          <span>Admin node created: {cli.createdAt}</span>
                        </p>
                      </div>

                      <div className="flex gap-2 items-center">
                        {/* Status Batch */}
                        <button
                           type="button"
                          onClick={() => toggleSubscriptionStatus(cli.id)}
                          className={`text-[9px] font-black uppercase font-mono px-2 py-1 rounded-md border text-center transition-transform hover:scale-105 cursor-pointer ${badgeColor}`}
                          title="Click to rotate subscription status"
                        >
                          {cli.subscriptionStatus}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteClient(cli.id, cli.companyName)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer rounded hover:bg-slate-100"
                          title="Terminate Client"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="p-5 space-y-4">
                      
                      {/* Sub Expiration details & Login Credentials Info */}
                      <div className="grid grid-cols-2 gap-4 bg-slate-900 border border-slate-950 p-3 rounded-xl text-[10px] text-slate-400 tracking-wide font-mono">
                        <div className="space-y-1.5">
                          <span className="block text-slate-500 uppercase text-[8px] font-black">Authorized Login ID</span>
                          <span className="text-slate-150 block truncate font-bold text-[9px]" title={cli.adminLoginId}>
                            {cli.adminLoginId}
                          </span>
                          <span className="block text-slate-500 uppercase text-[8px] font-black pt-1">Credentials Password</span>
                          <span className="text-amber-400 font-black block text-[10px]">
                            {cli.adminPassword || "no-pass"}
                          </span>
                          <span className="block text-slate-500 uppercase text-[8px] font-black pt-1">Offline Passcode</span>
                          <span className="text-cyan-400 font-black block text-[10px]">
                            #{cli.passcode || "N/A"}
                          </span>
                        </div>
                        <div className="space-y-1 border-l border-slate-800 pl-4">
                          <span className="block text-slate-500 uppercase text-[8px] font-black">Licensing Deadline</span>
                          <span className="text-slate-150 flex items-center gap-1 font-bold mt-1">
                            <Clock className="h-3.5 w-3.5 text-amber-500" />
                            {cli.subscriptionExpiryDate}
                          </span>
                          
                          {/* Active counts */}
                          <div className="flex flex-col gap-1 pt-1.5">
                            <span className="text-[10px] text-slate-300">
                              Active Sites: <strong className="text-white">{cli.sitesActive}</strong>
                            </span>
                            <span className="text-[10px] text-slate-300">
                              Users/Rosters: <strong className="text-white">{cli.usersActive}</strong>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Allowed features permissions indicators */}
                      <div className="border border-slate-100 p-2.5 rounded-xl space-y-1.5 bg-slate-50">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                          Tenant Functional Gatekeeper Locks
                        </span>
                        
                        <div className="flex flex-wrap gap-1.5">
                          {/* WHATSAPP */}
                          <div className={`px-2 py-0.5 rounded-md text-[9px] font-bold flex items-center gap-1 cursor-pointer transition-all hover:scale-103 ${
                            cli.allowedFeatures.whatsappDispatch 
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-150" 
                              : "bg-slate-100 text-slate-400 line-through border border-slate-150"
                          }`}
                          onClick={() => {
                            setClients(prev => prev.map(c => {
                              if (c.id === cli.id) {
                                return { 
                                  ...c, 
                                  allowedFeatures: { 
                                    ...c.allowedFeatures, 
                                    whatsappDispatch: !c.allowedFeatures.whatsappDispatch 
                                  } 
                                };
                              }
                              return c;
                            }));
                            triggerSimEffect(`Toggled WhatsApp dispatch feature for ${cli.companyName}`);
                          }}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                            <span>WhatsApp Dispatches</span>
                          </div>

                          {/* SIGNATURES */}
                          <div className={`px-2 py-0.5 rounded-md text-[9px] font-bold flex items-center gap-1 cursor-pointer transition-all hover:scale-103 ${
                            cli.allowedFeatures.sigCanvas 
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-150" 
                              : "bg-slate-100 text-slate-400 line-through border border-slate-150"
                          }`}
                          onClick={() => {
                            setClients(prev => prev.map(c => {
                              if (c.id === cli.id) {
                                return { 
                                  ...c, 
                                  allowedFeatures: { 
                                    ...c.allowedFeatures, 
                                    sigCanvas: !c.allowedFeatures.sigCanvas 
                                  } 
                                };
                              }
                              return c;
                            }));
                            triggerSimEffect(`Toggled Signature Canvas feature for ${cli.companyName}`);
                          }}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                            <span>MOHRE Signature Canvas</span>
                          </div>

                          {/* PTW ATTACHMENTS */}
                          <div className={`px-2 py-0.5 rounded-md text-[9px] font-bold flex items-center gap-1 cursor-pointer transition-all hover:scale-103 ${
                            cli.allowedFeatures.ptwAttachment 
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-150" 
                              : "bg-slate-100 text-slate-400 line-through border border-slate-150"
                          }`}
                          onClick={() => {
                            setClients(prev => prev.map(c => {
                              if (c.id === cli.id) {
                                return { 
                                  ...c, 
                                  allowedFeatures: { 
                                    ...c.allowedFeatures, 
                                    ptwAttachment: !c.allowedFeatures.ptwAttachment 
                                  } 
                                };
                              }
                              return c;
                            }));
                            triggerSimEffect(`Toggled PTW files upload for ${cli.companyName}`);
                          }}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                            <span>Permits Uploads</span>
                          </div>

                          {/* HEAT INDICES */}
                          <div className={`px-2 py-0.5 rounded-md text-[9px] font-bold flex items-center gap-1 cursor-pointer transition-all hover:scale-103 ${
                            cli.allowedFeatures.heatStressSensor 
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-150" 
                              : "bg-slate-100 text-slate-400 line-through border border-slate-150"
                          }`}
                          onClick={() => {
                            setClients(prev => prev.map(c => {
                              if (c.id === cli.id) {
                                return { 
                                  ...c, 
                                  allowedFeatures: { 
                                    ...c.allowedFeatures, 
                                    heatStressSensor: !c.allowedFeatures.heatStressSensor 
                                  } 
                                };
                              }
                              return c;
                            }));
                            triggerSimEffect(`Toggled Heat Index monitoring API for ${cli.companyName}`);
                          }}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                            <span>Heat Stress API Sensor</span>
                          </div>

                        </div>
                      </div>

                      {/* Mock Simulated activity triggers */}
                      <div className="border border-slate-150 p-2.5 rounded-xl space-y-2 bg-slate-50/40">
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">
                          developer telemetry simulator triggers (modify usage stats)
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                          <button
                            type="button"
                            onClick={() => simulateCreditIncrement(cli.id, "sites")}
                            className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-[9px] font-black p-1.5 text-white rounded-lg transition-transform hover:scale-102 flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <MapPin className="h-3 w-3 shrink-0 text-amber-500" />
                            <span>+1 Site Location</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => simulateCreditIncrement(cli.id, "users")}
                            className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-[9px] font-black p-1.5 text-white rounded-lg transition-transform hover:scale-102 flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Users className="h-3 w-3 shrink-0 text-cyan-400" />
                            <span>+1 Team Member</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => simulateCreditIncrement(cli.id, "sessions")}
                            className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-[9px] font-black p-1.5 text-white rounded-lg transition-transform hover:scale-102 flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Award className="h-3 w-3 shrink-0 text-amber-500 animate-pulse" />
                            <span>+1 Session ({dynamicStats.sessionsCount} Logs)</span>
                          </button>
                        </div>
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
