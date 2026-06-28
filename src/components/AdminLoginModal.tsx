import React, { useState } from "react";
import { X, Lock, ShieldCheck, Mail, Key, UserCheck, AlertCircle, Info, Eye, EyeOff } from "lucide-react";
import { ClientAccount, UserSession } from "../types";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: ClientAccount[];
  onLoginSuccess: (session: UserSession) => void;
  triggerSyncToast: (msg: string) => void;
}

// Helper to convert email login to localized administrator name
const getAdminNameFromEmail = (email: string): string => {
  if (!email) return "Admin";
  const namePart = email.split("@")[0].toLowerCase();
  if (namePart === "punithkundapur") {
    return "Punith Kundapur";
  }
  return namePart
    .split(/[\._\-]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function AdminLoginModal({
  isOpen,
  onClose,
  clients,
  onLoginSuccess,
  triggerSyncToast
}: AdminLoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showDemoLogins, setShowDemoLogins] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill in both fields.");
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Check Developer Credentials (Supremacy Tier)
    if (
      cleanEmail === "nazeersafetysolutions@gmail.com" &&
      (cleanPassword === "shafnaMOL@1980" || cleanPassword === "nazeerpassword")
    ) {
      const devSession: UserSession = {
        role: "Admin",
        name: "Developer Node (Nazeer)",
        avatarUrl: undefined,
        isDeveloper: true,
        hasSavedProfile: false
      };
      onLoginSuccess(devSession);
      triggerSyncToast("🔑 Developer Supremacy access granted. AI Heuristic Terminal open.");
      onClose();
      return;
    }

    // Check Clients Registry Credentials
    const matchedClient = clients.find(
      (c) =>
        c.adminLoginId.toLowerCase() === cleanEmail &&
        c.adminPassword === cleanPassword
    );

    if (matchedClient) {
      if (matchedClient.subscriptionStatus === "Expired") {
        setError("⚠️ This client's license has expired. Please contact Easy Safety Solutions by Nazeer.");
        return;
      }

      let calculatedName = matchedClient.adminName || "";
      const companyPlaceholder = `${matchedClient.companyName} Admin`;
      const fallbackPlaceholder = matchedClient.companyName;

      if (!calculatedName || 
          calculatedName === companyPlaceholder || 
          calculatedName === fallbackPlaceholder ||
          calculatedName.trim() === fallbackPlaceholder + " Admin" ||
          calculatedName.toLowerCase().includes(matchedClient.companyName.toLowerCase())
      ) {
        calculatedName = getAdminNameFromEmail(matchedClient.adminLoginId);
      }

      const clientSession: UserSession = {
        role: "Admin",
        name: calculatedName,
        avatarUrl: undefined,
        clientId: matchedClient.id,
        clientName: matchedClient.companyName,
        isDeveloper: false,
        companyId: matchedClient.adminCompanyId || "",
        position: matchedClient.adminPosition || "Corporate Administrator",
        safetyRating: 1,
        passcode: matchedClient.passcode,
        hasSavedProfile: calculatedName !== getAdminNameFromEmail(matchedClient.adminLoginId),
        loginId: matchedClient.adminLoginId
      };
      
      onLoginSuccess(clientSession);
      triggerSyncToast(`🔓 Welcome Admin from ${matchedClient.companyName}. Session authorized.`);
      onClose();
      return;
    }

    setError("Incorrect professional email or safety gateway password.");
  };

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 select-none animate-fade-in" id="admin-login-modal">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <Lock className="h-4.5 w-4.5 text-amber-500 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-tight">Admin Gate Authorization</h3>
              <p className="text-[10px] text-slate-400">Client Tenant Sign-In & Developer Portal</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            id="close-login-modal-btn"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <p className="text-xs text-slate-500 leading-relaxed font-normal">
            To view client reports, toggle premium parameters, or access the autonomic AI debugging terminal, authenticate below. Choose client admin profiles or Developer modes.
          </p>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl flex items-start gap-2.5 text-xs font-semibold animate-shake">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                Credentials Email / Login ID
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. admin@emaar-safety.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:bg-white focus:ring-1 focus:ring-amber-500 focus:outline-hidden font-semibold transition-all text-slate-800"
                id="login-email-input"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1.5">
                <Key className="h-3.5 w-3.5 text-slate-400" />
                Gateway Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 pr-10 text-xs focus:bg-white focus:ring-1 focus:ring-amber-500 focus:outline-hidden font-semibold transition-all text-slate-800"
                  id="login-password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer flex items-center justify-center p-1 rounded-sm"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 text-amber-500 hover:bg-slate-850 hover:text-amber-400 font-extrabold px-5 py-3 rounded-xl text-xs transition-all tracking-wide shadow-md cursor-pointer mt-2"
              id="submit-login-gateway-btn"
            >
              <ShieldCheck className="h-4.5 w-4.5 shrink-0 text-amber-500" />
              <span>Verify & Authorize Workspace</span>
            </button>
          </form>

          {/* Demonstration Credentials Assist */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowDemoLogins(!showDemoLogins)}
              className="w-full flex items-center justify-between text-[10px] uppercase font-bold text-slate-400 hover:text-slate-700 transition-colors font-mono focus:outline-hidden"
            >
              <span>{showDemoLogins ? "[-] Hide" : "[+] Show"} Referential Demonstration Accounts</span>
              <Info className="h-3.5 w-3.5" />
            </button>

            {showDemoLogins && (
              <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3.5 space-y-3">
                <p className="text-[10px] text-slate-500 leading-normal flex items-center gap-1.5">
                  <UserCheck className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  <span>Click any button below to pre-populate credentials automatically:</span>
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin("nazeersafetysolutions@gmail.com", "shafnaMOL@1980")}
                    className="p-2 border border-cyan-200 bg-cyan-50/40 hover:bg-cyan-50 text-left rounded-lg transition-all"
                  >
                    <p className="text-[8px] font-black tracking-wider text-cyan-700 uppercase">SYS DEVELOPER / SUPER-ADMIN</p>
                    <p className="text-[10px] font-bold text-slate-700 truncate mt-0.5">nazeersafetysolutions@gmail.com</p>
                    <p className="text-[9px] font-mono text-slate-500 mt-0.5">Pass: shafnaMOL@1980 / PIN: 1980</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin("admin@emaar-safety.com", "emaarpassword")}
                    className="p-2 border border-amber-200 bg-amber-50/40 hover:bg-amber-50 text-left rounded-lg transition-all"
                  >
                    <p className="text-[8px] font-black tracking-wider text-amber-700 uppercase">EMAAR ADMIN (PAID)</p>
                    <p className="text-[10px] font-bold text-slate-700 truncate mt-0.5">admin@emaar-safety.com</p>
                    <p className="text-[9px] font-mono text-slate-500 mt-0.5">Pass: emaarpassword</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin("admin@nakheel-safety.com", "nakheelpassword")}
                    className="p-2 border border-slate-200 hover:bg-slate-100 text-left rounded-lg transition-all"
                  >
                    <p className="text-[8px] font-black tracking-wider text-slate-600 uppercase">NAKHEEL ADMIN (PAID)</p>
                    <p className="text-[10px] font-bold text-slate-700 truncate mt-0.5">admin@nakheel-safety.com</p>
                    <p className="text-[9px] font-mono text-slate-500 mt-0.5">Pass: nakheelpassword</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin("admin@damac-safety.com", "damacpassword")}
                    className="p-2 border border-orange-200 bg-orange-50/40 hover:bg-orange-50 text-left rounded-lg transition-all"
                  >
                    <p className="text-[8px] font-black tracking-wider text-orange-700 uppercase">DAMAC ADMIN (TRIAL)</p>
                    <p className="text-[10px] font-bold text-slate-700 truncate mt-0.5">admin@damac-safety.com</p>
                    <p className="text-[9px] font-mono text-slate-500 mt-0.5">Pass: damacpassword</p>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>SECURE CERT Compliance AES Scrambled Registry</span>
          <span>ESS v4.2</span>
        </div>
      </div>
    </div>
  );
}
