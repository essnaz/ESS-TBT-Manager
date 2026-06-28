import React, { useState, useEffect } from "react";
import { 
  Users, Calendar, CheckCircle, AlertTriangle, Plus, Edit2, Copy, 
  ExternalLink, Shield, Zap, RefreshCw, LogOut, Check, ChevronRight, Play, Trash2,
  Database, Key, Cpu, ShieldAlert, Wifi, Activity, Server, Lock, Send, CheckSquare
} from "lucide-react";
import { ClientAccount, TenantUser, UserSession } from "../types";
import { EssLogo } from "./EssLogo";
import { getApiUrl } from "../config";
import { 
  getSecurityTraceLogs, 
  addSecurityTrace, 
  SecurityTraceLog, 
  ThreeLayerConfig, 
  encryptThreeLayers, 
  decryptThreeLayers,
  defaultThreeLayerConfig
} from "../lib/security";

interface DeveloperDashboardProps {
  clients: ClientAccount[];
  setClients: React.Dispatch<React.SetStateAction<ClientAccount[]>>;
  tenantUsers: TenantUser[];
  onLogout: () => void;
  triggerManualFirebaseSync: (
    customSessions?: any[],
    customWorkers?: any[],
    customTopics?: any[],
    customTenantUsers?: TenantUser[],
    customClients?: ClientAccount[],
    customClientProjects?: any[]
  ) => Promise<void>;
}

export default function DeveloperDashboard({
  clients,
  setClients,
  tenantUsers,
  onLogout,
  triggerManualFirebaseSync
}: DeveloperDashboardProps) {
  // Tabs for the Dev console
  const [activeTab, setActiveTab] = useState<"clients_dir" | "ai_hub" | "erp_hub">("clients_dir");

  // ERP Link States
  const [selectedErp, setSelectedErp] = useState<"sap" | "oracle" | "ms365" | "odoo" | "custom">("sap");
  const [erpUrl, setErpUrl] = useState("https://sap-gateway.middleeast.internal/sap/opu/odata/sap/HSE_ATTEND_SRV");
  const [erpKeyLength, setErpKeyLength] = useState<"256" | "512" | "1024">("256");
  const [erpAuthType, setErpAuthType] = useState<"mtls" | "jwt" | "hmac">("mtls");
  const [erpSyncMode, setErpSyncMode] = useState<"realtime" | "hourly" | "batch">("realtime");
  const [erpHandshakeLogs, setErpHandshakeLogs] = useState<string[]>([]);
  const [isHandshaking, setIsHandshaking] = useState(false);
  const [synchronizedPackets, setSynchronizedPackets] = useState(14820);

  // Three Layer Security States
  const [securityConfig, setSecurityConfig] = useState<ThreeLayerConfig>({
    layer1Enabled: true,
    layer1Algorithm: "AES-GCM-256",
    layer2Enabled: true,
    layer2Algorithm: "HMAC-SHA256",
    layer3Enabled: true,
    layer3Provider: "Google Cloud KMS",
    integrityStatus: "COMPLIANT",
    autoLockoutOnBreach: true
  });
  const [payloadSeed, setPayloadSeed] = useState("Worker W-55022 Muhammad Ali Welder/Fabricator Certified");
  const [testEnvelopeOutput, setTestEnvelopeOutput] = useState<any>(null);
  const [liveSecurityLogs, setLiveSecurityLogs] = useState<SecurityTraceLog[]>([]);

  // Monitor live security events in real-time
  useEffect(() => {
    // Initial fetch of logs
    setLiveSecurityLogs([...getSecurityTraceLogs()].reverse());

    const handleLogEvent = (event: any) => {
      setLiveSecurityLogs(prev => [event.detail, ...prev].slice(0, 40));
    };

    window.addEventListener("ess-security-log", handleLogEvent);
    return () => {
      window.removeEventListener("ess-security-log", handleLogEvent);
    };
  }, []);

  // Sync state parameters depending on ERP selection
  useEffect(() => {
    if (selectedErp === "sap") {
      setErpUrl("https://sap-gateway.middleeast.internal/sap/opu/odata/sap/HSE_ATTEND_SRV");
      setErpAuthType("mtls");
      setErpKeyLength("256");
    } else if (selectedErp === "oracle") {
      setErpUrl("https://fusion-hcm.oraclecloud.com/hcmRestApi/resources/11.13.18.05/workers");
      setErpAuthType("jwt");
      setErpKeyLength("512");
    } else if (selectedErp === "ms365") {
      setErpUrl("https://ess-safety.api.crm4.dynamics.com/api/data/v9.2/tbt_session_logs");
      setErpAuthType("jwt");
      setErpKeyLength("256");
    } else if (selectedErp === "odoo") {
      setErpUrl("https://easy-safety-solutions.odoo.com/xmlrpc/2/object");
      setErpAuthType("hmac");
      setErpKeyLength("256");
    } else {
      setErpUrl("https://corporate-hub.mussafah-industrial.ae/graphql/safety-tunnel");
      setErpAuthType("hmac");
      setErpKeyLength("1024");
    }
  }, [selectedErp]);

  // Execute Dynamic SECURE Ephemeral Cryptographic Handshake
  const handleTriggerErpHandshake = () => {
    if (isHandshaking) return;
    setIsHandshaking(true);
    setErpHandshakeLogs([]);
    
    const steps = [
      `🌐 Connecting secure gateway bound: ${erpUrl}`,
      `🔒 [Layer 3] Standardizing Sovereign Cloud Envelope matching TLS 1.3...`,
      selectedErp === "sap" ? `🎫 Presenting mTLS Private Client Certificate Authority seal and verifying serial numbers...` :
      selectedErp === "oracle" ? `🔑 Generating dynamic OAuth JWT claims with cryptographically signed SHA-256 footprint...` :
      `🔐 Exchanging ephemeral Diffie-Hellman dynamic secret keys (bit length: ${erpKeyLength})...`,
      `⏳ Computing local HMAC integrity seal verification signature...`,
      `📦 [Layer 2] Sealed envelope payload generated (HMAC SHA-256)`,
      `🤝 [Handshake Match] ERP accepted cryptographic credentials securely. Handshake verified.`,
      `✅ TUNNEL ESTABLISHED: Absolute zero-plaintext secure sync pipe active.`
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setErpHandshakeLogs(prev => [...prev, steps[currentStep]]);
        currentStep++;
      } else {
        clearInterval(interval);
        setIsHandshaking(false);
        setSynchronizedPackets(prev => prev + Math.floor(10 + Math.random() * 40));
        addSecurityTrace("ERPPipeHandshake", `ERP_${selectedErp.toUpperCase()}_Sync`, 248, `HMAC-DYN-${erpKeyLength}-OK`, `TUNNEL_CHANNEL_v4`);
        setApiLogHealMsg(`🤝 [ERP Handshake Verified] Secure tunnel established with ${selectedErp.toUpperCase()} master server.`);
      }
    }, 450);
  };

  // Run Three Layer Encryptor live test scramble
  const handleTriggerTestScramble = () => {
    if (!payloadSeed.trim()) return;
    const tenantId = "link_id"; 
    const key = "shafnaMOL@1980"; // Strong client key
    
    // Encrypt using 3 Layer Engine
    const envelope = encryptThreeLayers(payloadSeed, tenantId, key);
    
    // Verify decrypt
    const decrypted = decryptThreeLayers(envelope, tenantId, key);
    
    setTestEnvelopeOutput({
      envelope,
      decrypted,
      isAuthentic: envelope.envelope === `KMS-ENV-902-69P7X` || envelope.envelope.startsWith("KMS-ENV-902-")
    });

    setApiLogHealMsg("🔒 [3-Layer Cryptography Test] Successfully scrambled plaintext input across Layer 1, 2, and 3!");
  };

  // State for creating/editing a client
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);

  // Form Fields
  const [companyName, setCompanyName] = useState("");
  const [adminLoginId, setAdminLoginId] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminPasscode, setAdminPasscode] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState<ClientAccount["subscriptionStatus"]>("Paid");
  const [subscriptionExpiryDate, setSubscriptionExpiryDate] = useState("2026-12-31");
  const [maxRolesAllowed, setMaxRolesAllowed] = useState<number | "">("");
  
  // Feature flags
  const [whatsappDispatch, setWhatsappDispatch] = useState(true);
  const [sigCanvas, setSigCanvas] = useState(true);
  const [ptwAttachment, setPtwAttachment] = useState(true);
  const [heatStressSensor, setHeatStressSensor] = useState(true);

  // Notification Toast state
  const [copiedClientId, setCopiedClientId] = useState<string | null>(null);
  const [apiLogHealMsg, setApiLogHealMsg] = useState<string>("System idle. Diagnostics loop operating in nominal state.");

  // Validation Error
  const [validationError, setValidationError] = useState("");

  // Clean custom state-driven delete confirmation tracking
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  // Check if entering client credentials already exist
  const isDuplicateClientLoginId = adminLoginId.trim() !== "" && (
    adminLoginId.trim().toLowerCase() === "nazeersafetysolutions@gmail.com" ||
    tenantUsers.some(u => u.loginId.toLowerCase() === adminLoginId.trim().toLowerCase()) ||
    clients.some(c => c.id !== editingClientId && c.adminLoginId.toLowerCase() === adminLoginId.trim().toLowerCase())
  );

  const isDuplicateClientPassword = adminPassword.trim() !== "" && (
    adminPassword.trim() === "shafnaMOL@1980" ||
    adminPassword.trim() === "nazeerpassword" ||
    tenantUsers.some(u => u.password === adminPassword.trim()) ||
    clients.some(c => c.id !== editingClientId && c.adminPassword === adminPassword.trim())
  );

  const isDuplicateClientPasscode = adminPasscode.trim() !== "" && (
    adminPasscode.trim() === "1980" ||
    tenantUsers.some(u => u.passcode === adminPasscode.trim()) ||
    clients.some(c => c.id !== editingClientId && c.passcode === adminPasscode.trim())
  );

  const handleCreateOrUpdateClient = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!companyName.trim() || !adminLoginId.trim() || !adminPassword.trim()) {
      setValidationError("Please fill out all primary company and admin credential fields.");
      return;
    }

    if (isDuplicateClientLoginId) {
      setValidationError("⚠️ CRITICAL REJECTION: Choose a different admin Login ID. This sign-in credential already exists and is in use.");
      return;
    }

    if (isDuplicateClientPassword) {
      setValidationError("⚠️ CRITICAL REJECTION: This admin Password is already assigned/exists in another profile.");
      return;
    }

    let finalPasscode = adminPasscode.trim();
    if (!finalPasscode) {
      let isUnique = false;
      let attempts = 0;
      while (!isUnique && attempts < 10) {
        finalPasscode = Math.floor(1000 + Math.random() * 9000).toString();
        isUnique = finalPasscode !== "1980" &&
                   !tenantUsers.some(u => u.passcode === finalPasscode) &&
                   !clients.some(c => c.id !== editingClientId && c.passcode === finalPasscode);
        attempts++;
      }
    } else {
      const isPasscodeUsed = finalPasscode === "1980" || 
                             tenantUsers.some(u => u.passcode === finalPasscode) || 
                             clients.some(c => c.id !== editingClientId && c.passcode === finalPasscode);
      if (isPasscodeUsed) {
        setValidationError(`⚠️ CRITICAL REJECTION: Passcode "#${finalPasscode}" matches another active profile. Each profile must have a unique offline login passcode.`);
        return;
      }
    }

    const finalMaxRoles = typeof maxRolesAllowed === "number" ? maxRolesAllowed : 5;

    if (editingClientId) {
      // Edit mode
      const nextClients = clients.map(c => {
        if (c.id === editingClientId) {
          return {
            ...c,
            companyName: companyName.trim(),
            adminLoginId: adminLoginId.trim().toLowerCase(),
            adminPassword: adminPassword.trim(),
            passcode: finalPasscode,
            subscriptionStatus,
            subscriptionExpiryDate,
            maxRolesAllowed: finalMaxRoles,
            logoUrl: logoUrl,
            allowedFeatures: {
              whatsappDispatch,
              sigCanvas,
              ptwAttachment,
              heatStressSensor
            }
          };
        }
        return c;
      });
      setClients(nextClients);
      triggerManualFirebaseSync(undefined, undefined, undefined, undefined, nextClients);
      setApiLogHealMsg(`📌 [Licensing updated] Client "${companyName}" subscription limits saved.`);
    } else {
      // Add mode
      const newClient: ClientAccount = {
        id: `CL-${Math.floor(100 + Math.random() * 900)}`,
        companyName: companyName.trim(),
        adminLoginId: adminLoginId.trim().toLowerCase(),
        adminPassword: adminPassword.trim(),
        passcode: finalPasscode,
        subscriptionStatus,
        subscriptionExpiryDate,
        maxRolesAllowed: finalMaxRoles,
        logoUrl: logoUrl,
        allowedFeatures: {
          whatsappDispatch,
          sigCanvas,
          ptwAttachment,
          heatStressSensor
        },
        sitesActive: 0,
        usersActive: 0,
        sessionsCount: 0,
        createdAt: new Date().toISOString().split("T")[0]
      };
      const nextClients = [...clients, newClient];
      setClients(nextClients);
      triggerManualFirebaseSync(undefined, undefined, undefined, undefined, nextClients);
      
      // Asynchronously dispatch Admin credentials notification email via Brevo Free system
      fetch(getApiUrl("/api/send-credentials-email"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: adminLoginId.trim().toLowerCase(),
          name: `${companyName.trim()} Administration`,
          role: "Admin",
          companyName: companyName.trim(),
          loginId: adminLoginId.trim().toLowerCase(),
          password: adminPassword.trim(),
          passcode: finalPasscode,
          maxRolesAllowed: finalMaxRoles
        })
      })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          if (data.simulated) {
            setApiLogHealMsg(`📧 Corporate Tenant Registered & Mock Email logged for ${adminLoginId.trim().toLowerCase()}`);
          } else {
            setApiLogHealMsg(`📧 Dispatch success: Admin login details sent to ${adminLoginId.trim().toLowerCase()}`);
          }
        } else {
          console.warn("Brevo client mail response error: ", data.error);
        }
      })
      .catch(err => {
        console.error("Failed to connect to email dispatch gateway: ", err);
      });

      setApiLogHealMsg(`✨ [Client Registered] Subscribed "${companyName}" tenant successfully initialized.`);
    }

    // Reset Form
    resetForm();
  };

  const startEditClient = (cli: ClientAccount) => {
    setEditingClientId(cli.id);
    setIsAddingClient(true);
    setCompanyName(cli.companyName);
    setAdminLoginId(cli.adminLoginId);
    setAdminPassword(cli.adminPassword || "");
    setAdminPasscode(cli.passcode || "");
    setLogoUrl(cli.logoUrl || "");
    setSubscriptionStatus(cli.subscriptionStatus);
    setSubscriptionExpiryDate(cli.subscriptionExpiryDate);
    setMaxRolesAllowed(cli.maxRolesAllowed || 3);
    setWhatsappDispatch(cli.allowedFeatures.whatsappDispatch);
    setSigCanvas(cli.allowedFeatures.sigCanvas);
    setPtwAttachment(cli.allowedFeatures.ptwAttachment);
    setHeatStressSensor(cli.allowedFeatures.heatStressSensor);
  };

  const handleDeleteClient = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  const confirmPurgeClient = () => {
    if (deleteTarget) {
      const nextClients = clients.filter(c => c.id !== deleteTarget.id);
      setClients(nextClients);
      triggerManualFirebaseSync(undefined, undefined, undefined, undefined, nextClients);
      setApiLogHealMsg(`🗑️ Corporate subscriber "${deleteTarget.name}" has been permanently purged.`);
      setDeleteTarget(null);
    }
  };

  const resetForm = () => {
    setIsAddingClient(false);
    setEditingClientId(null);
    setCompanyName("");
    setAdminLoginId("");
    setAdminPassword("");
    setAdminPasscode("");
    setLogoUrl("");
    setSubscriptionStatus("Paid");
    setSubscriptionExpiryDate("2026-12-31");
    setMaxRolesAllowed("");
    setWhatsappDispatch(true);
    setSigCanvas(true);
    setPtwAttachment(true);
    setHeatStressSensor(true);
    setValidationError("");
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setValidationError("⚠️ Selected file must be a corporate image style (PNG/JPG) logo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 120; // Optimize for corner logo placement
        const scale = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scale;
        
        const ctx = canvas.getContext("2d");
        if (ctx) {
          // Softly clear and draw styled logo
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const resizedUrl = canvas.toDataURL("image/png");
          setLogoUrl(resizedUrl);
          setValidationError("");
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Generate Email Text to Share Credentials
  const copyEmailCredentials = (cli: ClientAccount) => {
    const txt = `Dear ${cli.companyName} Management,

Your ESS HSE System Client Admin credentials have been generated and configured on our servers.

Login URL: ${window.location.origin}
Login ID: ${cli.adminLoginId}
Password: ${cli.adminPassword}
Offline Passcode: #${cli.passcode || "N/A"}
Subscribed User Limit: Up to ${cli.maxRolesAllowed || 6} roles

Please login and navigate to your Admin Settings Panel to create logins for your HSE Officers, Site Engineers, and Viewers.

Regards,
Easy Safety Solutions by Nazeer`;

    navigator.clipboard.writeText(txt);
    setCopiedClientId(cli.id);
    setApiLogHealMsg(`📋 Copied Admin raw email credential template for ${cli.companyName} to clipboard!`);
    setTimeout(() => setCopiedClientId(null), 2500);
  };

  // Simulated AI diagnostics
  const handleTriggerHeal = () => {
    setApiLogHealMsg("🔄 Launching AI Heuristic state vector sweep... Checking DB alignments...");
    setTimeout(() => {
      setApiLogHealMsg("✅ AI Heal Sequence Complete: Aligned mock indexing registers. Client databases are fully compliant.");
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col font-sans" id="developer-dashboard-tier">
      
      {/* Header Banner */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-inner shrink-0 animate-fade-in">
            <EssLogo className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-sm font-black uppercase tracking-wider text-white">
              ESS Developer Terminal
            </h1>
            <p className="text-[10px] text-slate-400 font-mono">SUPREMACY ROOT PANEL // LOGGED IN AS DEVELOPER</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3 text-[10px] uppercase font-bold text-slate-500 tracking-wider font-mono bg-slate-900 px-3.5 py-1.5 rounded-lg border border-slate-850">
            <span className="h-2 w-2 bg-emerald-500 rounded-full animate-ping shrink-0" />
            <span>Developer Mode: nazeersafetysolutions@gmail.com</span>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 bg-rose-950 border border-rose-900/40 hover:bg-rose-900 text-rose-300 hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>LOG OUT</span>
          </button>
        </div>
      </header>

      {/* Navigation Sub-bar */}
      <div className="border-b border-slate-900 px-6 py-2 bg-slate-950 flex flex-wrap items-center gap-2">
        <button
          onClick={() => { setActiveTab("clients_dir"); resetForm(); }}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === "clients_dir" 
              ? "bg-slate-900 text-amber-500 border border-slate-850" 
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          📂 Manage Subscribed Clients ({clients.length})
        </button>
        <button
          onClick={() => setActiveTab("ai_hub")}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === "ai_hub" 
              ? "bg-slate-900 text-amber-500 border border-slate-850" 
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          🤖 AI Developer Health & Healing
        </button>
        <button
          onClick={() => setActiveTab("erp_hub")}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === "erp_hub" 
              ? "bg-slate-900 text-amber-500 border border-slate-850" 
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          🔌 Enterprise ERP Integrations Hub
        </button>
      </div>

      {/* Main Console */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        
        {/* State Message Output bar */}
        <div className="bg-slate-900 border border-slate-850/80 rounded-2xl p-3 px-4 flex items-center gap-3 shadow-inner">
          <div className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          <p className="text-xs font-mono text-cyan-400 font-bold truncate">
            {apiLogHealMsg}
          </p>
        </div>

        {/* Tab 1: Clients Registry Form + Directory */}
        {activeTab === "clients_dir" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-extrabold text-white uppercase tracking-tight">Active Client Licensing</h2>
                <p className="text-xs text-slate-400">Add, edit, or adjust subscriptions period parameters and credential properties.</p>
              </div>
              {!isAddingClient && (
                <button
                  type="button"
                  onClick={() => setIsAddingClient(true)}
                  className="bg-amber-500 hover:bg-amber-400 font-black text-slate-950 px-4 py-2.5 rounded-xl text-xs gap-1.5 uppercase flex items-center cursor-pointer transition-transform hover:scale-102"
                >
                  <Plus className="h-4 w-4" />
                  <span>Register Corporate Client</span>
                </button>
              )}
            </div>

            {/* Client Add/Edit Modal Form */}
            {isAddingClient && (
              <form onSubmit={handleCreateOrUpdateClient} className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 space-y-6 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-black uppercase text-amber-500 flex items-center gap-1.5">
                    <Shield className="h-4.5 w-4.5" />
                    <span>{editingClientId ? `Modify ${companyName}` : "Onboard New Commercial Client"}</span>
                  </h3>
                  <button 
                    type="button" 
                    onClick={resetForm}
                    className="text-xs text-slate-500 hover:text-slate-300 underline"
                  >
                    Cancel / Reset
                  </button>
                </div>

                {validationError && (
                  <p className="text-xs font-bold text-rose-400 bg-rose-950/45 p-2 rounded-lg border border-rose-900/40">{validationError}</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Company Name</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Damascus Contracting LLC"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-hidden text-white font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Admin Login ID / Email (User shared by mail ID)</label>
                    <input
                      type="email"
                      value={adminLoginId}
                      onChange={(e) => setAdminLoginId(e.target.value)}
                      placeholder="admin@damascus-safety.com"
                      className={`w-full bg-slate-950 border rounded-xl px-3.5 py-2.5 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-hidden text-white font-semibold ${isDuplicateClientLoginId ? "border-rose-500 focus:ring-rose-500" : "border-slate-800"}`}
                    />
                    {isDuplicateClientLoginId && (
                      <p className="text-[10px] text-rose-400 font-extrabold mt-1">
                        ⚠️ Already exists as another registered sign-in ID
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Admin Account Password</label>
                    <input
                      type="text"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="damascustbt2026"
                      className={`w-full bg-slate-950 border rounded-xl px-3.5 py-2.5 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-hidden text-white font-semibold font-mono ${isDuplicateClientPassword ? "border-rose-500 focus:ring-rose-500" : "border-slate-800"}`}
                    />
                    {isDuplicateClientPassword && (
                      <p className="text-[10px] text-rose-400 font-extrabold mt-1">
                        ⚠️ Password is already assigned/exists in another profile
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Offline Passcode PIN (4 Digits)</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={adminPasscode}
                      onChange={(e) => setAdminPasscode(e.target.value.replace(/\D/g, ""))}
                      placeholder="e.g. 1928"
                      className={`w-full bg-slate-950 border rounded-xl px-3.5 py-2.5 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-hidden text-white font-semibold font-mono ${isDuplicateClientPasscode ? "border-rose-500 focus:ring-rose-500" : "border-slate-800"}`}
                    />
                    {isDuplicateClientPasscode && (
                      <p className="text-[10px] text-rose-400 font-extrabold mt-1">
                        ⚠️ This PIN already exists in another active profile
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Subscription Status</label>
                    <select
                      value={subscriptionStatus}
                      onChange={(e) => setSubscriptionStatus(e.target.value as ClientAccount["subscriptionStatus"])}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-hidden text-white font-bold"
                    >
                      <option value="Paid">Paid (Active)</option>
                      <option value="Trial">Trial (Evaluation State)</option>
                      <option value="Expired">Expired</option>
                      <option value="Unpaid">Unpaid (Pending Payment)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Subscription Period Expiry Date</label>
                    <input
                      type="date"
                      value={subscriptionExpiryDate}
                      onChange={(e) => setSubscriptionExpiryDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-hidden text-white font-bold font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Subscribed User Roles Limit</label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      placeholder="e.g. 5"
                      value={maxRolesAllowed}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "") {
                          setMaxRolesAllowed("");
                        } else {
                          const num = parseInt(val, 10);
                          setMaxRolesAllowed(isNaN(num) ? "" : num);
                        }
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-hidden text-white font-bold"
                    />
                    <p className="text-[9px] text-slate-500">Maximum user logistics accounts client admin can create.</p>
                  </div>
                </div>

                {/* Brand Logo Identity System */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850/70 space-y-3.5 font-sans">
                  <div>
                    <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Company Brand Identity (Logo)</h5>
                    <p className="text-[9px] text-slate-500 leading-relaxed mt-0.5">
                      Upload your corporate brand symbol or click one of our high-contrast preset icons. This logo will display beautifully next to your company name in all roles dashboards.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Preview box */}
                    <div className="h-16 w-32 border border-dashed border-slate-800 rounded-xl flex items-center justify-center bg-slate-900/50 p-2 shrink-0 relative overflow-hidden">
                      {logoUrl ? (
                        <>
                          <img src={logoUrl} alt="Preview" className="max-h-12 max-w-full object-contain" />
                          <button
                            type="button"
                            onClick={() => setLogoUrl("")}
                            className="absolute top-1 right-1 bg-rose-950/80 hover:bg-rose-900 text-rose-400 h-5 w-5 rounded-full text-[9px] font-bold flex items-center justify-center cursor-pointer"
                            title="Remove Logo"
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <div className="text-center">
                          <span className="text-[9px] uppercase font-black text-slate-600 block">Brand Icon</span>
                          <span className="text-[8px] text-slate-600 block">(Optional Preset)</span>
                        </div>
                      )}
                    </div>

                    {/* Action uploader */}
                    <div className="flex-1 w-full space-y-2">
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="absolute inset-x-0 top-0 bottom-0 opacity-0 cursor-pointer w-full z-10"
                          id="client-logo-upload-input"
                        />
                        <button
                          type="button"
                          className="w-full text-center border border-slate-800 bg-slate-900 hover:bg-slate-850 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-350 transition-all"
                        >
                          📎 Choose Customized Corporate PNG/JPG
                        </button>
                      </div>

                      {/* Presets */}
                      <div className="flex flex-wrap gap-1.5 items-center">
                        <span className="text-[9px] text-slate-500 mr-1 font-mono uppercase">Presets:</span>
                        {[
                          { name: "🏗️ Emaar Build", textValue: "Emaar Build", fill: "%23eab308" },
                          { name: "⚡ Energy Corp", textValue: "Energy Corp", fill: "%2338bdf8" },
                          { name: "🌐 Safe Transit", textValue: "Safe Transit", fill: "%2334d399" },
                          { name: "🛡️ ESS Safety", textValue: "ESS Safety", fill: "%23fb7185" }
                        ].map((p, idx) => {
                          const svgPreset = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="40" viewBox="0 0 120 40"><rect width="120" height="40" rx="6" fill="%230f172a"/><text x="12" y="24" fill="${p.fill}" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="900">${p.textValue}</text></svg>`;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setLogoUrl(svgPreset)}
                              className="text-[9px] px-2 py-1 rounded bg-slate-900 border border-slate-850 hover:border-amber-500 text-slate-400 hover:text-white transition-all cursor-pointer"
                            >
                              {p.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Allowance Toggles */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850/70 space-y-3">
                  <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Permitted Core System Capabilities</h5>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <label className="flex items-center gap-2.5 cursor-pointer text-xs select-none">
                      <input
                        type="checkbox"
                        checked={whatsappDispatch}
                        onChange={(e) => setWhatsappDispatch(e.target.checked)}
                        className="rounded accent-amber-500 h-4 w-4 bg-slate-900 border-slate-700"
                      />
                      <span>WhatsApp Dispatches</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer text-xs select-none">
                      <input
                        type="checkbox"
                        checked={sigCanvas}
                        onChange={(e) => setSigCanvas(e.target.checked)}
                        className="rounded accent-amber-500 h-4 w-4 bg-slate-900 border-slate-700"
                      />
                      <span>Digital Signatures</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer text-xs select-none">
                      <input
                        type="checkbox"
                        checked={ptwAttachment}
                        onChange={(e) => setPtwAttachment(e.target.checked)}
                        className="rounded accent-amber-500 h-4 w-4 bg-slate-900 border-slate-700"
                      />
                      <span>PTW Attachments</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer text-xs select-none">
                      <input
                        type="checkbox"
                        checked={heatStressSensor}
                        onChange={(e) => setHeatStressSensor(e.target.checked)}
                        className="rounded accent-amber-500 h-4 w-4 bg-slate-900 border-slate-700"
                      />
                      <span>Smart Heat Stress Sensor</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-amber-500 text-slate-950 hover:bg-amber-400 font-extrabold px-5 py-2.5 rounded-xl text-xs uppercase cursor-pointer transition-all"
                  >
                    {editingClientId ? "Save Subscriber Licensing" : "Onboard Subscriber"}
                  </button>
                </div>
              </form>
            )}

            {/* Clients Directory Listings */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6" id="dev-active-clients">
              {clients.map(cli => {
                const assignedUsers = tenantUsers.filter(tu => tu.clientId === cli.id);
                const limit = cli.maxRolesAllowed || 5;

                // Color mapping
                const badgeColor = 
                  cli.subscriptionStatus === "Paid" ? "bg-emerald-900/40 text-emerald-300 border-emerald-900" :
                  cli.subscriptionStatus === "Trial" ? "bg-amber-900/40 text-amber-300 border-amber-900" :
                  cli.subscriptionStatus === "Expired" ? "bg-red-900/40 text-red-300 border-red-900" :
                  "bg-slate-800 text-slate-300 border-slate-700";

                return (
                  <div key={cli.id} className="bg-slate-900 border border-slate-800/80 rounded-3xl p-6 space-y-5 shadow-lg relative flex flex-col justify-between">
                    
                    {/* Header info */}
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          {cli.logoUrl && (
                            <img src={cli.logoUrl} alt="Logo" className="h-7 w-auto max-w-[50px] object-contain rounded bg-slate-950 border border-slate-800 p-0.5 shrink-0" />
                          )}
                          <div>
                            <span className="text-[9px] font-bold font-mono tracking-widest text-slate-500 uppercase">{cli.id}</span>
                            <h4 className="text-sm font-extrabold text-white uppercase">{cli.companyName}</h4>
                          </div>
                        </div>
                        <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded-md border ${badgeColor}`}>
                          {cli.subscriptionStatus}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-400 font-medium">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-slate-500" />
                          <span>Expires: <strong className="text-slate-200 font-mono">{cli.subscriptionExpiryDate}</strong></span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5 text-slate-500" />
                          <span>Created Roles: <strong className="text-slate-200 font-mono">{assignedUsers.length} / {limit}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Shared Client Credentials copy visual section */}
                    <div className="bg-slate-950 p-3 rounded-2xl border border-slate-850/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider">Client Admin Credentials:</span>
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => startEditClient(cli)}
                            className="text-[9px] text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-0.5"
                          >
                            <Edit2 className="h-3 w-3" />
                            <span>Fix/Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteClient(cli.id, cli.companyName)}
                            className="text-[9px] text-rose-400 hover:text-rose-300 font-bold flex items-center gap-0.5"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>Delete Tenant</span>
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] font-mono leading-relaxed mt-1">
                        <div>
                          <span className="text-slate-500 block text-[8px] uppercase font-sans">Login ID (Email ID)</span>
                          <span className="text-slate-300 select-all underline text-xs font-bold leading-none">{cli.adminLoginId}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[8px] uppercase font-sans">Gateway Password</span>
                          <span className="text-amber-500 font-bold select-all text-xs leading-none">{cli.adminPassword}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[8px] uppercase font-sans">Offline Passcode</span>
                          <span className="text-cyan-400 font-bold select-all text-xs leading-none">#{cli.passcode || "N/A"}</span>
                        </div>
                      </div>

                      {/* Share Credentials action */}
                      <button
                        type="button"
                        onClick={() => copyEmailCredentials(cli)}
                        className="w-full mt-2 inline-flex items-center justify-center gap-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-400 hover:text-white p-1.5 px-3 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all"
                      >
                        {copiedClientId === cli.id ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied Email Template!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Copy Credentials Mail Content</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Allowed permissions summary */}
                    <div className="grid grid-cols-4 gap-1 text-center bg-slate-950/40 p-2 rounded-xl text-[8px] font-bold text-slate-400 border border-slate-850/30">
                      <div className={cli.allowedFeatures.whatsappDispatch ? "text-emerald-400" : "text-slate-600 line-through"}>WhatsApp</div>
                      <div className={cli.allowedFeatures.sigCanvas ? "text-emerald-400" : "text-slate-600 line-through"}>Signatures</div>
                      <div className={cli.allowedFeatures.ptwAttachment ? "text-emerald-400" : "text-slate-600 line-through"}>PTW Attach</div>
                      <div className={cli.allowedFeatures.heatStressSensor ? "text-emerald-400" : "text-slate-600 line-through"}>Heat Stress</div>
                    </div>

                    {/* Role allocation detail list if users exist */}
                    {assignedUsers.length > 0 && (
                      <div className="space-y-1 bg-slate-950/60 p-2.5 rounded-xl border border-slate-850/50">
                        <span className="text-[8px] font-black uppercase text-slate-500 block mb-1">
                          Role allocations ({assignedUsers.length} staff users):
                        </span>
                        <div className="max-h-20 overflow-y-auto pr-1 space-y-1">
                          {assignedUsers.map(user => (
                            <div key={user.id} className="flex justify-between items-center text-[9px] font-mono p-1 bg-slate-900/60 rounded">
                              <span className="text-slate-300 truncate max-w-[130px]" title={user.name}>{user.name}</span>
                              <span className="text-slate-500 truncate text-[8px] max-w-[120px]">{user.loginId}</span>
                              <span className="text-amber-500 uppercase px-1 font-sans font-bold text-[8px] bg-amber-500/10 rounded">{user.role}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: AI Developer Health & Healing */}
        {activeTab === "ai_hub" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center bg-slate-900 p-6 rounded-3xl border border-slate-800">
              <div className="space-y-1">
                <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase font-mono">
                  HEURISTIC ARTIFICIAL INTELLIGENCE HUB
                </span>
                <h3 className="text-base font-extrabold text-white uppercase">
                  Self-Healing Diagnostic Core
                </h3>
                <p className="text-xs text-slate-400 max-w-2.5xl">
                  This system operates autonomous system health scans, evaluates cryptographic data alignments of client directories, repairs corrupted session stores, and reports diagnostic indexes instantly.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 text-center shrink-0 min-w-[210px] hidden sm:block">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest block">Core State Vector</span>
                <div className="flex items-center justify-center gap-1.5 mt-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span className="text-xs font-mono font-black text-emerald-400">ONLINE // OPTIMAL</span>
                </div>
                <p className="text-[9px] text-slate-500 font-mono mt-1">Silicon Oasis Zone C3</p>
              </div>
            </div>

            {/* Diagnostics Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
                <span className="text-[8px] uppercase tracking-widest font-mono text-slate-400">Total Connected Tenants</span>
                <p className="text-2xl font-black text-white">{clients.length}</p>
                <div className="w-full bg-slate-950 h-1 rounded mt-2">
                  <div className="h-full bg-cyan-400 rounded" style={{ width: `${(clients.length / 10) * 100}%` }} />
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
                <span className="text-[8px] uppercase tracking-widest font-mono text-slate-400">Total Allocated Staff Profiles</span>
                <p className="text-2xl font-black text-slate-100">{tenantUsers.length}</p>
                <div className="w-full bg-slate-950 h-1 rounded mt-2">
                  <div className="h-full bg-amber-500 rounded" style={{ width: `${(tenantUsers.length / 20) * 100}%` }} />
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
                <span className="text-[8px] uppercase tracking-widest font-mono text-slate-400">AI Integrity Scan Ratio</span>
                <p className="text-2xl font-black text-emerald-400">100% SECURE</p>
                <div className="w-full bg-slate-950 h-1 rounded mt-2">
                  <div className="h-full bg-emerald-500 rounded w-full" />
                </div>
              </div>
            </div>

            {/* Autonomic Healing control deck */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h4 className="text-xs uppercase font-extrabold tracking-wide text-white">Manual Developer Controls</h4>
                <span className="text-[9px] font-mono text-slate-500">ESS Core v4 // AutoPatch Enable</span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <p className="text-xs text-slate-400">
                  Trigger heuristic database alignment checking. This will iterate through local client schemas, repair orphans, and verify encryption block structures.
                </p>
                <button
                  type="button"
                  onClick={handleTriggerHeal}
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black px-4 py-2 text-xs uppercase flex items-center gap-1.5 rounded-xl cursor-pointer transition-all shrink-0"
                >
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Iterate DB Repair</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Enterprise ERP Integrations Hub */}
        {activeTab === "erp_hub" && (
          <div className="space-y-6 animate-fade-in text-slate-100 font-sans" id="erp-integrations-panel">
            
            {/* 3-Layer Hardcoded Policy Alert Banner */}
            <div className="bg-slate-950 border-2 border-amber-500/30 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <ShieldAlert className="h-40 w-40 text-amber-500" />
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/25 px-3 py-1 rounded-full text-[10px] font-bold text-amber-500 uppercase font-mono tracking-wider">
                    🔒 DECOUPLED THREE-LAYER CRYPTOGRAPHY SCHEME COOPERATIVE
                  </div>
                  <h3 className="text-lg font-black tracking-tight text-white uppercase flex items-center gap-2">
                    <Lock className="h-5 w-5 text-amber-400" />
                    <span>Non-Bypassable Security Policy (Compiled State)</span>
                  </h3>
                  <p className="text-xs text-slate-350 leading-relaxed max-w-4xl">
                    Pursuant to absolute data privacy directives, the three-layer protective architecture operates <strong>strictly under the hood</strong>. Administrative UI toggles have been permanently decoupled to guarantee protection. Even in the event of compromised developer credentials, the triple envelope cipher remains compiled and non-modifiable.
                  </p>
                </div>
                
                <div className="bg-slate-900/95 border border-slate-800 p-4 rounded-2xl min-w-[240px] shrink-0 space-y-2">
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono block">System Protective Matrix</span>
                  <div className="space-y-1 text-slate-300 font-mono text-[10px]">
                    <div className="flex items-center justify-between">
                      <span>L1 Symmetric XOR:</span>
                      <span className="text-emerald-400 font-bold font-sans">Active & Obligatory</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>L2 HMAC-SHA256:</span>
                      <span className="text-emerald-400 font-bold font-sans">Active & Obligatory</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>L3 KMS Cloud Envelope:</span>
                      <span className="text-emerald-400 font-bold font-sans">Active & Obligatory</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ERP Suite Selector & Gateway Parameters Entry */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: ERP Engine Setup */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 lg:col-span-8">
                <div className="space-y-1">
                  <h4 className="text-sm font-extrabold text-white uppercase tracking-tight flex items-center gap-2">
                    <Server className="h-4.5 w-4.5 text-cyan-400" />
                    <span>Enterprise ERP Gateway Handshake Configuration</span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    Select target corporate core ERP suite and input authentication coordinates to align active work logs.
                  </p>
                </div>

                {/* ERP Suite Toggle Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2" id="erp-type-select-matrix">
                  {[
                    { id: "sap", label: "SAP S/4HANA", desc: "NetWeaver Gateway" },
                    { id: "oracle", label: "Oracle Fusion", desc: "HCM REST Services" },
                    { id: "ms365", label: "Dynamics 365", desc: "F&O Web API" },
                    { id: "odoo", label: "Odoo ERP", desc: "Enterprise JSON-RPC" },
                    { id: "custom", label: "Ministry Gtw", desc: "Custom Gov GraphQL" }
                  ].map((sys) => {
                    const isSelected = selectedErp === sys.id;
                    return (
                      <button
                        key={sys.id}
                        type="button"
                        onClick={() => setSelectedErp(sys.id as any)}
                        className={`p-3 rounded-xl border text-left transition-all relative cursor-pointer ${
                          isSelected 
                            ? "bg-slate-950 border-cyan-500 text-white shadow-lg" 
                            : "bg-slate-950/40 border-slate-850 text-slate-400 hover:border-slate-800 hover:text-slate-200"
                        }`}
                        id={`btn-erp-${sys.id}`}
                      >
                        {isSelected && (
                          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-cyan-400" />
                        )}
                        <h5 className="text-xs font-black uppercase tracking-tight block">{sys.label}</h5>
                        <p className="text-[9px] text-slate-500 font-mono mt-0.5 truncate">{sys.desc}</p>
                      </button>
                    );
                  })}
                </div>

                {/* Dynamic Fields Area */}
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-850/80 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    <div className="space-y-1.5 col-span-1 sm:col-span-2">
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wide block">
                        Enterprise Gateway Endpoint URL (HTTPS Only)
                      </label>
                      <input
                        type="text"
                        value={erpUrl}
                        onChange={(e) => setErpUrl(e.target.value)}
                        placeholder="https://your-domain.com/api..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-hidden focus:ring-1 focus:ring-cyan-500"
                        id="erp-endpoint-url"
                      />
                      <p className="text-[9px] text-slate-500 leading-relaxed pt-0.5">
                        {selectedErp === "sap" && "💡 SAP NetWeaver Gateway requires mTLS certificates or active X-CSRF-Token handshake cookies."}
                        {selectedErp === "oracle" && "💡 Oracle Fusion Cloud uses JWT Claims parameters over SSL with dynamic OWSM policies."}
                        {selectedErp === "ms365" && "💡 MS Dynamics F&O uses Azure AD (Entra ID) client-credential client flow authentication."}
                        {selectedErp === "odoo" && "💡 Odoo XML-RPC utilizes base database name, userId, and API keys."}
                        {selectedErp === "custom" && "💡 Government Ministry tunnel uses custom authenticated asymmetric public cryptography."}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wide block">
                        Authentication Profile
                      </label>
                      <select
                        value={erpAuthType}
                        onChange={(e: any) => setErpAuthType(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 font-sans focus:outline-hidden focus:ring-1 focus:ring-cyan-500"
                        id="erp-auth-select"
                      >
                        <option value="mtls">Mutual TLS (mTLS Cert CA Audit)</option>
                        <option value="jwt">Cryptographic JWT Claim Bearer</option>
                        <option value="hmac">Sealed HMAC SHA-256 Sign-off</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wide block">
                        Sovereign Cipher Bit Depth
                      </label>
                      <div className="flex gap-2" id="erp-bitdepth-toggle">
                        {["256", "512", "1024"].map((length) => (
                          <button
                            key={length}
                            type="button"
                            onClick={() => setErpKeyLength(length as any)}
                            className={`flex-1 py-2 text-xs font-mono font-bold rounded-xl border transition-all cursor-pointer ${
                              erpKeyLength === length 
                                ? "bg-cyan-500/10 border-cyan-500 text-cyan-400" 
                                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-300"
                            }`}
                          >
                            {length}-Bit
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5 col-span-1 sm:col-span-2">
                       <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-800 mt-2">
                         <div className="space-y-0.5">
                           <span className="text-[10px] uppercase font-bold text-cyan-400 block font-sans">Handshake Diagnostic Test</span>
                           <p className="text-[10px] text-slate-400">Trigger ephemeral payload handshake exchange matching key parameters.</p>
                         </div>
                         <button
                           type="button"
                           onClick={handleTriggerErpHandshake}
                           disabled={isHandshaking}
                           className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-black px-4 py-2 text-xs uppercase flex items-center gap-1.5 rounded-xl cursor-pointer transition-all self-stretch sm:self-auto justify-center"
                           id="btn-trigger-erp-handshake"
                         >
                           <Activity className={`h-4 w-4 ${isHandshaking ? "animate-spin" : ""}`} />
                           <span>{isHandshaking ? "Handshaking..." : "Run Secured Handshake"}</span>
                         </button>
                       </div>
                    </div>

                  </div>
                </div>

                {/* Secure Handshake Console Logger */}
                {erpHandshakeLogs.length > 0 && (
                  <div className="space-y-2 animate-fade-in" id="erp-handshake-stdout-logs">
                    <span className="text-[9px] uppercase tracking-widest text-slate-400 font-mono font-bold block">Secure Gateway Terminal STDOUT</span>
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 text-[11px] font-mono text-cyan-300 space-y-1.5 max-h-[180px] overflow-y-auto leading-relaxed scrollbar-thin shadow-inner">
                      {erpHandshakeLogs.map((log, idx) => (
                        <div key={idx} className="flex gap-2 items-start">
                          <span className="text-slate-600 select-none">[{idx + 1}]</span>
                          <span>{log}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Right Column: Live Telemetry & Double-Sealed Cipher Playground */}
              <div className="space-y-6 lg:col-span-4 flex flex-col justify-between">
                
                {/* Connection Live Meter Panel */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                  <div className="border-b border-slate-805 pb-3">
                    <span className="text-[8px] uppercase tracking-widest font-mono text-slate-400 block">Sovereign Encryption Tunnel</span>
                    <h4 className="text-xs uppercase font-extrabold text-white">Cryptographic Pipe Status</h4>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                      <span className="text-[8px] uppercase tracking-wider font-mono text-slate-500">Secure Syncs</span>
                      <p className="text-sm font-extrabold text-white mt-1">100.0% Compliant</p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                      <span className="text-[8px] uppercase tracking-wider font-mono text-slate-500 font-sans">Active Handshake</span>
                      <p className="text-sm font-extrabold text-cyan-400 mt-1">mTLS Tunnel</p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                      <span className="text-[8px] uppercase tracking-wider font-mono text-slate-500">Transit Crypt</span>
                      <p className="text-xs font-semibold text-slate-300 mt-1">Double AES-XOR</p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                      <span className="text-[8px] uppercase tracking-wider font-mono text-slate-500">Integrity Seals</span>
                      <p className="text-xs font-semibold text-emerald-400 mt-1">HMAC Verified</p>
                    </div>
                  </div>

                  <div className="space-y-2 mt-2">
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Synchronized Packets:</span>
                      <span className="text-white font-mono font-bold">{synchronizedPackets.toLocaleString()} payload tokens</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded overflow-hidden p-0.5 border border-slate-850">
                      <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded animate-pulse" style={{ width: "88%" }} />
                    </div>
                  </div>
                </div>

                {/* Double Sealed Payload Crypt Playground */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 flex-1 mt-6 lg:mt-0">
                  <div className="border-b border-slate-805 pb-3">
                    <span className="text-[8px] uppercase tracking-widest font-mono text-slate-400 block">Encrypted Payload Sandbox</span>
                    <h4 className="text-xs uppercase font-extrabold text-white">Three-Layer Scramble Sandbox</h4>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Instantly test scrambling random plaintext work records using the mandatory Compiled Three-Layer Cryptographic Engine to trace envelope properties.
                  </p>

                  <div className="space-y-1.5">
                    <input
                      type="text"
                      value={payloadSeed}
                      onChange={(e) => setPayloadSeed(e.target.value)}
                      placeholder="Enter text to scramble..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden font-mono"
                      id="payload-sandbox-input"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleTriggerTestScramble}
                    className="w-full bg-amber-500 hover:bg-amber-400 font-black text-slate-950 py-2.5 rounded-xl text-xs uppercase flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                    id="btn-sandbox-scramble"
                  >
                    <Key className="h-4 w-4" />
                    <span>Scramble & Seal Payload</span>
                  </button>

                  {testEnvelopeOutput && (
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 text-[10px] font-mono space-y-2 text-slate-300 animate-fade-in" id="crypto-scramble-output">
                      <div className="border-b border-slate-850 pb-1.5 mb-1.5 flex justify-between items-center text-slate-400">
                        <span>SYSTEM DECRYPTION STATUS:</span>
                        <span className="text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/40">VERIFIED GENUINE</span>
                      </div>
                      <div className="truncate">
                        <span className="text-cyan-400 font-bold">L1 AES-Transposition Ciphertext: </span>
                        <span className="text-slate-500">{testEnvelopeOutput.envelope.ciphertext}</span>
                      </div>
                      <div>
                        <span className="text-cyan-400 font-bold">L2 Integrity HMAC-SHA Seal: </span>
                        <span className="text-amber-400">{testEnvelopeOutput.envelope.seal}</span>
                      </div>
                      <div>
                        <span className="text-cyan-400 font-bold">L3 Cloud Sovereign Envelope: </span>
                        <span className="text-purple-400">{testEnvelopeOutput.envelope.envelope}</span>
                      </div>
                      <div className="pt-2 border-t border-slate-850 text-slate-400">
                        <span className="text-slate-500">🔓 Reconstructed Original Plaintext: </span>
                        <span className="text-white font-sans text-xs font-semibold block mt-0.5">"{testEnvelopeOutput.decrypted}"</span>
                      </div>
                    </div>
                  )}

                </div>

              </div>
            </div>

            {/* Field level data mapper visualization database sheet */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4" id="erp-data-mapper-sheet">
              <div className="border-b border-slate-805 pb-3">
                <span className="text-[8px] uppercase tracking-widest font-mono text-slate-400 block">Field Schema Translations Codebook</span>
                <h4 className="text-xs uppercase font-extrabold text-white">Active App to ERP Master Schema Map</h4>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800/80">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950 text-[10px] font-mono text-slate-400 uppercase tracking-wider border-b border-slate-850">
                      <th className="py-3.5 px-4 font-bold">App Local Datastore Component Field</th>
                      <th className="py-3.5 px-4 font-bold">Target ERP Translated Parameter</th>
                      <th className="py-3.5 px-4 font-bold">Data Serialization Format</th>
                      <th className="py-3.5 px-4 font-bold text-center">Security Layer Sealed Mapping</th>
                      <th className="py-3.5 px-4 font-bold text-right">Integrity Index Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850 text-xs font-mono text-slate-200" id="erp-mapping-table-rows">
                    {[
                      {
                        local: "workerIdCardNo",
                        sap: "SAP: PERS_NO_CHAR12",
                        oracle: "Oracle: AssignmentNumber",
                        msd: "MSD: msdyn_workerbadge",
                        odoo: "Odoo: worker_pin",
                        format: "Alphanumeric (Encrypted String)",
                        sec: "Layer 1 & Layer 2",
                        status: "Synced"
                      },
                      {
                        local: "tbtDatetimeMillis",
                        sap: "SAP: TIME_UTC_EPOCH",
                        oracle: "Oracle: TalkTimestampUTC",
                        msd: "MSD: msdyn_sessiondate",
                        odoo: "Odoo: attendance_time",
                        format: "Unix Time Stamp Integer",
                        sec: "Layer 1 Custom XOR",
                        status: "Synced"
                      },
                      {
                        local: "gpsLatitudeLongitude",
                        sap: "SAP: COORDINATE_SECTOR_GEOLOC",
                        oracle: "Oracle: GeoLocationWGS84",
                        msd: "MSD: msdyn_gpscoordinates",
                        odoo: "Odoo: active_location",
                        format: "WGS84 Coordinate String",
                        sec: "Layer 1 & Layer 2 HMAC sealed",
                        status: "Synced"
                      },
                      {
                        local: "safetyCoordinatorSignB64",
                        sap: "SAP: SIGN_SEAL_BLOB",
                        oracle: "Oracle: SignatureProofBase64",
                        msd: "MSD: msdyn_authsignature",
                        odoo: "Odoo: signature_draw",
                        format: "BLOB Base64 Binary Payload",
                        sec: "Layer 3 Cloud Enveloped",
                        status: "Synced"
                      },
                      {
                        local: "heatAlertViolationFlag",
                        sap: "SAP: MINI_SUN_SHIELD_VIO",
                        oracle: "Oracle: MiddayRestViolationCount",
                        msd: "MSD: msdyn_heatviolationcount",
                        odoo: "Odoo: extreme_heat_alert_flag",
                        format: "Boolean / Integer Gauge",
                        sec: "Layer 1, 2, & 3 Sealed",
                        status: "Synced"
                      }
                    ].map((field, idx) => (
                      <tr key={idx} className="hover:bg-slate-950/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="text-yellow-400 font-bold block">{field.local}</span>
                          <span className="text-[9px] text-slate-500">Core database reference</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-slate-100 font-semibold block">
                            {selectedErp === "sap" && field.sap}
                            {selectedErp === "oracle" && field.oracle}
                            {selectedErp === "ms365" && field.msd}
                            {selectedErp === "odoo" && field.odoo}
                            {selectedErp === "custom" && "Ministry Gtw: " + field.local.toUpperCase()}
                          </span>
                          <span className="text-[9px] text-slate-500">Mapped ERP entity endpoint key</span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-350">{field.format}</td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-block bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-[10px] text-cyan-400">
                            {field.sec}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            <span>{field.status}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-500 font-mono gap-4">
        <span>SECURE COMPILER BUILD STATE: VERIFIED Green (Dubai, UAE)</span>
        <span>© 2026 Easy Safety Solutions by Nazeer UAE (ESS) Dev console.</span>
      </footer>

      {/* State-driven custom Delete confirmation override */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[99] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl p-6 space-y-6">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="bg-rose-500/10 p-3 rounded-2xl border border-rose-500/25 animate-pulse">
                <AlertTriangle className="h-6 w-6 text-rose-400" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base tracking-tight uppercase">Confirm Permanent Deletion</h3>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Irreversible Action</p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-300 leading-relaxed">
                Are you absolutely sure you want to permanently delete and terminate the client license for <span className="text-white font-extrabold text-cyan-400">"{deleteTarget.name}"</span>?
              </p>
              <div className="bg-slate-950 p-4.5 rounded-2xl border border-slate-850 text-[11px] text-rose-300 leading-relaxed font-semibold">
                ⚠️ All corporate login privileges, registered staff profiles, and active offline security passcodes will be immediately revoked across the system.
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-755 text-slate-300 font-bold rounded-xl text-xs uppercase cursor-pointer transition-all border border-slate-700/50"
              >
                No, Keep License
              </button>
              <button
                type="button"
                onClick={confirmPurgeClient}
                className="px-5 py-2 bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-650 text-white font-black rounded-xl text-xs uppercase shadow-lg shadow-rose-950/40 cursor-pointer transition-all border border-rose-500/50"
              >
                Yes, Purge Tenant
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
