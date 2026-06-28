import React, { useState } from "react";
import { Lock, Mail, Key, ShieldCheck, Play, ArrowRight, HelpCircle, Wifi, WifiOff, Sparkles, Eye, EyeOff } from "lucide-react";
import { ClientAccount, TenantUser, UserSession } from "../types";
import { EssLogo } from "./EssLogo";
import { getApiUrl } from "../config";

// Custom Envelope icon mapping back to Mail for strict Lucide references
const EmailIcon = Mail;

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

interface CompulsoryLoginProps {
  clients: ClientAccount[];
  tenantUsers: TenantUser[];
  onLoginSuccess: (session: UserSession) => void;
  onDemoLogin: () => void;
}

export default function CompulsoryLogin({
  clients,
  tenantUsers,
  onLoginSuccess,
  onDemoLogin
}: CompulsoryLoginProps) {
  const [loginMode, setLoginMode] = useState<"online" | "offline" | "auditor">("online");
  // Auditor flow states
  const [selectedClientId, setSelectedClientId] = useState("");
  const [auditorLicense, setAuditorLicense] = useState("");
  const [auditorFirm, setAuditorFirm] = useState("");
  const [approvalLetterRef, setApprovalLetterRef] = useState("");
  const [approvalLetterFileName, setApprovalLetterFileName] = useState("");
  const [emailOrId, setEmailOrId] = useState("");
  const [password, setPassword] = useState("");
  const [passcodeInput, setPasscodeInput] = useState("");
  const [error, setError] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [showDemoCues, setShowDemoCues] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasscode, setShowPasscode] = useState(false);

  // Forgot password system states
  const [forgotPasswordStep, setForgotPasswordStep] = useState<"idle" | "requestCode" | "enterCode">("idle");
  const [resetEmail, setResetEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isResetPending, setIsResetPending] = useState(false);

  const handleRequestResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfoMsg("");
    setIsResetPending(true);

    if (!resetEmail.trim()) {
      setError("Please enter your registered email account address.");
      setIsResetPending(false);
      return;
    }

    try {
      const resp = await fetch(getApiUrl("/api/forgot-password"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail.trim() })
      });
      const data = await resp.json();
      if (data.success) {
        setForgotPasswordStep("enterCode");
        setInfoMsg(data.message || "📧 Secure verification PIN dispatched to your email! Please check inbox.");
      } else {
        setError(data.error || "Failed to request code.");
      }
    } catch (err) {
      setError("Unable to connect with the easy safety support system gateway.");
    } finally {
      setIsResetPending(false);
    }
  };

  const handleCompletePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfoMsg("");
    setIsResetPending(true);

    if (!otpCode.trim() || !newPassword.trim()) {
      setError("Please input the 6-digit security PIN and choose a new password.");
      setIsResetPending(false);
      return;
    }

    if (newPassword.trim().length < 4) {
      setError("Security guideline: gateway passwords must be at least 4 characters.");
      setIsResetPending(false);
      return;
    }

    try {
      const resp = await fetch(getApiUrl("/api/reset-password"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: resetEmail.trim(),
          resetCode: otpCode.trim(),
          newPassword: newPassword.trim()
        })
      });
      const data = await resp.json();
      if (data.success) {
        setForgotPasswordStep("idle");
        setEmailOrId(resetEmail);
        setPassword(newPassword.trim());
        setResetEmail("");
        setOtpCode("");
        setNewPassword("");
        setInfoMsg("✨ SUCCESS: Gateway password updated! Admin holds receipt of safety update. Login below.");
      } else {
        setError(data.error || "Failed to update password.");
      }
    } catch (err) {
      setError("Connection failure while setting new password on safety server.");
    } finally {
      setIsResetPending(false);
    }
  };

  const handleSendDeveloperEmail = async () => {
    setError("");
    setInfoMsg("Initiating secure dispatch of Developer credentials...");
    try {
      const response = await fetch(getApiUrl("/api/send-credentials-email"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: "nazeersafetysolutions@gmail.com",
          name: "Developer Node (Nazeer)",
          role: "Developer / Super-Admin",
          companyName: "EASY SAFETY SOLUTIONS Developer Team",
          loginId: "nazeersafetysolutions@gmail.com",
          password: "shafnaMOL@1980",
          passcode: "1980"
        })
      });
      const data = await response.json();
      if (data.success) {
        setInfoMsg("📧 SUCCESS: Developer credentials & offline passcode (#1980) dispatched to nazeersafetysolutions@gmail.com!");
      } else {
        setError("Error dispatching credentials: " + (data.error || "unknown error"));
      }
    } catch (err) {
      setError("Failed to connect to email dispatch gateway.");
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!emailOrId.trim() || !password.trim()) {
      setError("Please enter your login ID and password.");
      return;
    }

    const cleanInput = emailOrId.trim().toLowerCase();
    const cleanPassword = password.trim();

    // 1. Developer Login (Pre-existing credentials)
    if (
      cleanInput === "nazeersafetysolutions@gmail.com" &&
      (cleanPassword === "shafnaMOL@1980" || cleanPassword === "nazeerpassword")
    ) {
      const devSession: UserSession = {
        role: "Admin",
        name: "Developer Node (Nazeer)",
        avatarUrl: undefined,
        isDeveloper: true,
        companyId: "DEV-777",
        position: "Lead Solutions Developer",
        safetyRating: 1,
        passcode: "1980",
        hasSavedProfile: false
      };
      onLoginSuccess(devSession);
      return;
    }

    // 2. Client Admin Login (Matches administrative accounts generated by Developer)
    const matchedClient = clients.find(
      (c) =>
        c.adminLoginId.toLowerCase() === cleanInput &&
        c.adminPassword === cleanPassword
    );

    if (matchedClient) {
      if (matchedClient.subscriptionStatus === "Expired") {
        setError("⚠️ Your license has expired. Please contact the developer to renew.");
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
        clientName: matchedClient.companyName || (matchedClient.id === "CL-264" ? "DOLPHIN ENERGY" : ""),
        isDeveloper: false,
        companyId: matchedClient.adminCompanyId || "",
        position: matchedClient.adminPosition || "Corporate Administrator",
        safetyRating: 1,
        passcode: matchedClient.passcode,
        hasSavedProfile: calculatedName !== getAdminNameFromEmail(matchedClient.adminLoginId)
      };
      onLoginSuccess(clientSession);
      return;
    }

    // 3. Client Admin created staff logins (HSE Officers, Site Engineers, Viewers)
    const matchedTenantUser = tenantUsers.find(
      (u) =>
        u.loginId.toLowerCase() === cleanInput &&
        u.password === cleanPassword
    );

    if (matchedTenantUser) {
      // Find parent client to check if subscription is valid
      const parentClient = clients.find(c => c.id === matchedTenantUser.clientId);
      if (parentClient && parentClient.subscriptionStatus === "Expired") {
        setError("⚠️ Your license has expired.");
        return;
      }

      const hasSaved = matchedTenantUser.hasSavedProfile || false;
      const userSession: UserSession = {
        role: matchedTenantUser.role,
        name: matchedTenantUser.name,
        avatarUrl: hasSaved ? matchedTenantUser.photoUrl : undefined,
        clientId: matchedTenantUser.clientId,
        clientName: parentClient?.companyName || (matchedTenantUser.clientId === "CL-264" ? "DOLPHIN ENERGY" : "Corporate Workspace"),
        isDeveloper: false,
        passcode: matchedTenantUser.passcode,
        companyId: hasSaved ? (matchedTenantUser.companyId || "") : "",
        position: hasSaved ? (matchedTenantUser.position || "") : "",
        safetyRating: matchedTenantUser.safetyRating || 1,
        photoUrl: hasSaved ? matchedTenantUser.photoUrl : undefined,
        loginId: matchedTenantUser.loginId,
        id: matchedTenantUser.id,
        hasSavedProfile: hasSaved,
        certificates: matchedTenantUser.certificates || []
      };
      onLoginSuccess(userSession);
      return;
    }

    setError("Incorrect Login ID or Password.");
  };

  const handlePasscodeLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!passcodeInput.trim()) {
      setError("Please enter your personal offline passcode.");
      return;
    }

    // Standardize input by removing symbol prefix '#' and stripping trailing spaces so both #1980 and 1980 work
    const pin = passcodeInput.trim().replace("#", "").trim();

    // 1. Developer Offline Passcode Login PIN support
    if (pin === "1980") {
      const devSession: UserSession = {
        role: "Admin",
        name: "Developer Node (Nazeer)",
        avatarUrl: undefined,
        isDeveloper: true,
        companyId: "DEV-777",
        position: "Lead Solutions Developer",
        safetyRating: 1,
        passcode: "1980",
        hasSavedProfile: false
      };
      onLoginSuccess(devSession);
      return;
    }

    // 2. Client Admin account offline passcode login support
    const matchedClient = clients.find(
      (c) => c.passcode === pin
    );

    if (matchedClient) {
      if (matchedClient.subscriptionStatus === "Expired") {
        setError("⚠️ Your license has expired.");
        return;
      }

      let calculatedPinName = matchedClient.adminName || "";
      const pinCompanyPlaceholder = `${matchedClient.companyName} Admin`;
      const pinFallbackPlaceholder = matchedClient.companyName;

      if (!calculatedPinName || 
          calculatedPinName === pinCompanyPlaceholder || 
          calculatedPinName === pinFallbackPlaceholder ||
          calculatedPinName.trim() === pinFallbackPlaceholder + " Admin" ||
          calculatedPinName.toLowerCase().includes(matchedClient.companyName.toLowerCase())
      ) {
        calculatedPinName = getAdminNameFromEmail(matchedClient.adminLoginId);
      }

      const clientSession: UserSession = {
        role: "Admin",
        name: calculatedPinName,
        avatarUrl: undefined,
        clientId: matchedClient.id,
        clientName: matchedClient.companyName,
        isDeveloper: false,
        companyId: matchedClient.adminCompanyId || "",
        position: matchedClient.adminPosition || "Corporate Administrator",
        safetyRating: 1,
        passcode: matchedClient.passcode,
        hasSavedProfile: calculatedPinName !== getAdminNameFromEmail(matchedClient.adminLoginId)
      };
      onLoginSuccess(clientSession);
      return;
    }

    // 3. Client Admin created staff logins (HSE Officers, Site Engineers, Viewers)
    const matchedTenantUser = tenantUsers.find(
      (u) => u.passcode === pin
    );

    if (matchedTenantUser) {
      // Find parent client to check if subscription is valid
      const parentClient = clients.find(c => c.id === matchedTenantUser.clientId);
      if (parentClient && parentClient.subscriptionStatus === "Expired") {
        setError("⚠️ Your license has expired.");
        return;
      }

      const hasSaved = matchedTenantUser.hasSavedProfile || false;
      const userSession: UserSession = {
        role: matchedTenantUser.role,
        name: matchedTenantUser.name,
        avatarUrl: hasSaved ? matchedTenantUser.photoUrl : undefined,
        clientId: matchedTenantUser.clientId,
        clientName: parentClient?.companyName || (matchedTenantUser.clientId === "CL-264" ? "DOLPHIN ENERGY" : "Corporate Workspace"),
        isDeveloper: false,
        passcode: matchedTenantUser.passcode,
        companyId: hasSaved ? (matchedTenantUser.companyId || "") : "",
        position: hasSaved ? (matchedTenantUser.position || "") : "",
        safetyRating: matchedTenantUser.safetyRating || 1,
        photoUrl: hasSaved ? matchedTenantUser.photoUrl : undefined,
        loginId: matchedTenantUser.loginId,
        id: matchedTenantUser.id,
        hasSavedProfile: hasSaved,
        certificates: matchedTenantUser.certificates || []
      };
      onLoginSuccess(userSession);
      return;
    }

    setError("No profile matches this passcode. Ensure your admin has created this passcode on your online login profile.");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setApprovalLetterFileName(file.name);
      if (!approvalLetterRef) {
        setApprovalLetterRef(`Attachment Ref: ${file.name}`);
      }
    }
  };

  const handleAuditorLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedClientId) {
      setError("Please select the registered Client Workspace you are going to audit.");
      return;
    }
    if (!auditorLicense.trim()) {
      setError("Qualified audit guideline: Please enter your Registered Auditor License Number.");
      return;
    }
    if (!auditorFirm.trim()) {
      setError("Please enter the name of the Auditing Firm / Authority you work for.");
      return;
    }
    if (!approvalLetterRef.trim()) {
      setError("Please enter the Approval/Authorization reference text or note.");
      return;
    }

    const matchedClient = clients.find(c => c.id === selectedClientId);
    if (!matchedClient) {
      setError("Selected client workspace could not be identified.");
      return;
    }

    if (matchedClient.subscriptionStatus === "Expired") {
      setError("⚠️ Selected client's license has expired. Compliance auditing is deactivated.");
      return;
    }

    // Build Auditor Session
    const auditorSession: UserSession = {
      role: "Auditor",
      name: `Auditor: ${auditorFirm.trim()}`,
      clientId: matchedClient.id,
      clientName: matchedClient.companyName,
      auditorLicenseNo: auditorLicense.trim(),
      auditorCompany: auditorFirm.trim(),
      auditorApprovalLetterRef: approvalLetterRef.trim(),
      isDeveloper: false,
      safetyRating: 5
    };

    onLoginSuccess(auditorSession);
  };

  const handleQuickLogin = (email: string, pass: string) => {
    setEmailOrId(email);
    setPassword(pass);
    setError("");
  };

  // Helper mail link trigger
  const handleRequestMail = () => {
    const subject = encodeURIComponent("Request for ESS HSE App Trial Version");
    const body = encodeURIComponent(
      "Hello Easy Safety Solutions by Nazeer Team,\n\nI would like to request a trial version account for our organization.\n\nCompany Name:\nContact Number:\nDesired Number of Users:\nCountry/Location:\n\nThank you."
    );
    window.location.href = `mailto:nazeersafetysolutions@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-radial from-slate-900 via-slate-950 to-black px-4 py-8 select-none font-sans" id="compulsory-login-screen">
      <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-md rounded-3xl border border-slate-800/80 shadow-2xl overflow-hidden flex flex-col p-6 sm:p-8 space-y-6">
        
        {/* Aesthetic Modern Header */}
        <div className="text-center space-y-3">
          {/* Custom Hexagon logo matching the Easy Safety Solutions monogram */}
          <div className="mx-auto w-14 h-14 select-none shrink-0 relative flex items-center justify-center p-1.5 bg-slate-950/40 rounded-2xl border border-slate-800/60 shadow-inner">
            <EssLogo className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-black tracking-wider text-white uppercase font-sans">
              TBT MANAGER
            </h2>
            <div className="flex items-center justify-center gap-1.5 text-slate-200">
              <EssLogo className="h-3.5 w-3.5 shrink-0" />
              <p className="text-[10px] uppercase font-extrabold tracking-wider">
                A Product of EASY SAFETY SOLUTIONS By Nazeer
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Mode Switcher for Online/Offline/Auditor */}
        <div className="bg-slate-950 p-1 rounded-xl border border-slate-800/80 flex gap-1">
          <button
            type="button"
            onClick={() => { setLoginMode("online"); setError(""); }}
            className={`flex-1 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
              loginMode === "online"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10 font-black"
                : "text-slate-400 hover:text-slate-205 font-bold"
            }`}
          >
            <Wifi className="h-3 w-3 shrink-0" />
            <span>Online</span>
          </button>
          <button
            type="button"
            onClick={() => { setLoginMode("offline"); setError(""); }}
            className={`flex-1 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
              loginMode === "offline"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10 font-black"
                : "text-slate-400 hover:text-slate-205 font-bold"
            }`}
          >
            <WifiOff className="h-3 w-3 shrink-0" />
            <span>Offline</span>
          </button>
          <button
            type="button"
            onClick={() => { setLoginMode("auditor"); setError(""); }}
            className={`flex-1 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
              loginMode === "auditor"
                ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/10 font-black"
                : "text-slate-400 hover:text-slate-205 font-bold"
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
            <span>Auditor</span>
          </button>
        </div>

        {error && (
          <div className="bg-rose-950/40 border border-rose-900/60 text-rose-300 p-3 rounded-2xl text-xs font-medium flex items-start gap-2.5 leading-relaxed">
            <div className="h-1.5 w-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0 animate-ping" />
            <span>{error}</span>
          </div>
        )}

        {infoMsg && (
          <div className="bg-cyan-950/50 border border-cyan-850 text-cyan-300 p-3 rounded-2xl text-xs font-medium flex items-start gap-2.5 leading-relaxed">
            <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0 animate-pulse" />
            <span>{infoMsg}</span>
          </div>
        )}

        {/* Dynamic Forms based on mode selection */}
        {loginMode === "online" ? (
          forgotPasswordStep === "requestCode" ? (
            <form onSubmit={handleRequestResetCode} className="space-y-4 animate-fade-in animate-duration-300">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5 font-mono">
                  <Mail className="h-3.5 w-3.5 text-slate-500" />
                  Registered Account Email
                </label>
                <p className="text-[9px] text-slate-400 leading-normal">
                  Enter your registered electronic mail address. A 6-digit verification PIN code will be sent to reset your portal password.
                </p>
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="e.g. supervisor@company.com"
                  className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-3.5 py-3 text-xs font-semibold focus:border-amber-500 focus:outline-hidden text-white placeholder-slate-600 transition-all font-sans"
                />
              </div>

              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setForgotPasswordStep("idle");
                    setError("");
                    setInfoMsg("");
                  }}
                  className="w-1/3 py-3 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-bold uppercase transition-all duration-300 cursor-pointer text-center hover:bg-slate-900"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isResetPending}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-black px-4 py-3 rounded-xl text-xs uppercase tracking-wide transition-all duration-300 cursor-pointer disabled:opacity-50"
                >
                  {isResetPending ? "Dispatched..." : "Send Reset Code"}
                </button>
              </div>
            </form>
          ) : forgotPasswordStep === "enterCode" ? (
            <form onSubmit={handleCompletePasswordReset} className="space-y-4 animate-fade-in animate-duration-300">
              <div className="space-y-3">
                <div className="p-2 bg-slate-950 rounded-xl border border-slate-850/80 text-center text-[10px] text-slate-400">
                  Code sent to: <strong className="text-white select-all font-mono">{resetEmail}</strong>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1.5 font-mono">
                    <ShieldCheck className="h-3.5 w-3.5 text-amber-500" />
                    6-Digit Verification PIN Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="e.g. 841920"
                    className="w-full tracking-[0.3em] text-center bg-slate-950/80 border border-amber-500/40 rounded-xl px-3.5 py-2.5 text-base font-black font-mono focus:border-amber-500 focus:outline-hidden text-white placeholder-slate-705 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5 font-mono">
                    <Key className="h-3.5 w-3.5 text-slate-500" />
                    Create New Gateway Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min 4 characters e.g. safeCrew1"
                      className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-3.5 py-3 pr-10 text-xs font-semibold focus:border-amber-500 focus:outline-hidden text-white placeholder-slate-600 transition-all font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-350 cursor-pointer flex items-center justify-center p-1 rounded-sm"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setForgotPasswordStep("requestCode");
                    setError("");
                    setInfoMsg("");
                  }}
                  className="w-1/3 py-3 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-bold uppercase transition-all duration-300 cursor-pointer text-center hover:bg-slate-900"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isResetPending}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-450 text-slate-950 font-black px-4 py-3 rounded-xl text-xs uppercase tracking-wide transition-all duration-300 cursor-pointer disabled:opacity-50"
                >
                  {isResetPending ? "Saving..." : "Register Password"}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5 font-mono">
                  <Mail className="h-3.5 w-3.5 text-slate-500" />
                  Credentials Email / Login ID
                </label>
                <input
                  type="text"
                  value={emailOrId}
                  onChange={(e) => setEmailOrId(e.target.value)}
                  placeholder="e.g. admin@emaar-safety.com"
                  className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-3.5 py-3 text-xs font-semibold focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-hidden text-white placeholder-slate-600 transition-all font-sans"
                  id="login-field-input"
                />
              </div>

              <div className="space-y-1.5 font-sans">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5 font-mono">
                    <Key className="h-3.5 w-3.5 text-slate-500" />
                    Gateway Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotPasswordStep("requestCode");
                      setResetEmail(emailOrId);
                      setError("");
                      setInfoMsg("");
                    }}
                    className="text-[10px] font-black text-amber-500 hover:text-amber-400 cursor-pointer select-none underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-3.5 py-3 pr-10 text-xs font-semibold focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-hidden text-white placeholder-slate-600 transition-all font-mono"
                    id="password-field-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-350 cursor-pointer flex items-center justify-center p-1 rounded-sm"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-black px-5 py-3 rounded-xl text-xs uppercase tracking-wide transition-all duration-300 shadow-md shadow-amber-500/10 cursor-pointer text-center ring-offset-slate-950 hover:scale-[1.02]"
                id="login-verify-btn"
              >
                <ShieldCheck className="h-4.5 w-4.5 shrink-0" />
                <span>Verify & Authorize</span>
              </button>
            </form>
          )
        ) : loginMode === "offline" ? (
          <form onSubmit={handlePasscodeLoginSubmit} className="space-y-4 animate-fade-in animate-duration-300">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-emerald-400 flex items-center gap-1.5 font-mono tracking-wider">
                <Key className="h-3.5 w-3.5 text-emerald-500" />
                Personal Offline Passcode
              </label>
              <p className="text-[9px] text-slate-400 leading-normal">
                Enter the personal passcode created for you by your Admin. This allows instant entry without an active internet connection.
              </p>
              <div className="relative">
                <input
                  type={showPasscode ? "text" : "password"}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  placeholder="e.g. 4569"
                  className="w-full tracking-[0.5em] text-center bg-slate-950/90 border border-slate-800/85 rounded-xl px-4 py-3.5 pr-10 text-lg font-mono font-black focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-hidden text-white placeholder-slate-800 transition-all font-sans"
                  id="passcode-field-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer flex items-center justify-center p-1 rounded-sm"
                  title={showPasscode ? "Hide passcode" : "Show passcode"}
                >
                  {showPasscode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-405 text-slate-950 font-black px-5 py-3 rounded-xl text-xs uppercase tracking-wide transition-all duration-300 shadow-md shadow-emerald-500/10 cursor-pointer text-center ring-offset-slate-950 hover:scale-[1.02]"
              id="passcode-verify-btn"
            >
              <ShieldCheck className="h-4.5 w-4.5 shrink-0" />
              <span>Access Offline Mode</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleAuditorLoginSubmit} className="space-y-4 animate-fade-in animate-duration-300">
            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-3 flex items-center justify-between gap-2 text-sans select-none">
              <div className="space-y-0.5">
                <p className="text-[10px] font-black text-cyan-400 font-mono">DEVELOPER AUTO-BYPASS</p>
                <p className="text-[9px] text-slate-400 leading-none">Instantly pre-fill and verify credentials</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const activeClient = clients.find(c => c.subscriptionStatus !== "Expired") || clients[0];
                  if (activeClient) {
                    setSelectedClientId(activeClient.id);
                  }
                  setAuditorLicense("DEV-BYPASS-AUDIT-2026");
                  setAuditorFirm("Internal QA Developer Agency");
                  setApprovalLetterRef("DEV-BYPASS-REF-999");
                  setApprovalLetterFileName("simulation_dev_bypass.pdf");
                }}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[9px] font-black uppercase px-2.5 py-1.5 rounded-lg transition-all cursor-pointer font-mono shrink-0"
              >
                QUICK FILL
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5 font-mono">
                <ShieldCheck className="h-3.5 w-3.5 text-cyan-500" />
                Target Client Workspace
              </label>
              <p className="text-[9px] text-slate-400 leading-normal">
                An auditor can audit multiple active client databases. Please select the specific registry context to examine.
              </p>
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-3 py-3 text-xs font-semibold text-white focus:border-cyan-500 focus:outline-hidden"
              >
                <option value="">-- Choose Corporate Client to Audit --</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.companyName} ({c.subscriptionStatus === "Expired" ? "Expired License" : "Active Contract"})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5 font-mono">
                <Key className="h-3.5 w-3.5 text-cyan-500" />
                Registered Auditor License ID No.
              </label>
              <input
                type="text"
                value={auditorLicense}
                onChange={(e) => setAuditorLicense(e.target.value)}
                placeholder="e.g. MOHRE-AUDIT-902-2026"
                className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-3.5 py-3 text-xs font-semibold focus:border-cyan-500 focus:outline-hidden text-white placeholder-slate-700 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5 font-mono">
                <Eye className="h-3.5 w-3.5 text-cyan-500" />
                Auditing Firm Name / Authority
              </label>
              <input
                type="text"
                value={auditorFirm}
                onChange={(e) => setAuditorFirm(e.target.value)}
                placeholder="e.g. Dubai Municipality HSE Unit"
                className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-3.5 py-3 text-xs font-semibold focus:border-cyan-500 focus:outline-hidden text-white placeholder-slate-700"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5 font-mono">
                <Mail className="h-3.5 w-3.5 text-cyan-500" />
                Approval Letter Reference Text
              </label>
              <input
                type="text"
                value={approvalLetterRef}
                onChange={(e) => setApprovalLetterRef(e.target.value)}
                placeholder="e.g. DM-AUTH-LTR-8419-X2"
                className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-3.5 py-3 text-xs font-semibold focus:border-cyan-500 focus:outline-hidden text-white placeholder-slate-700 font-mono mb-2"
              />
              <div className="relative border border-dashed border-slate-800 hover:border-cyan-500/80 bg-slate-950/40 p-3 rounded-xl text-center select-none cursor-pointer">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="application/pdf,image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 font-bold">
                    {approvalLetterFileName ? `✅ Attached: ${approvalLetterFileName}` : "📁 Upload Official DM/MOHRE Approval Letter"}
                  </p>
                  <p className="text-[8px] text-slate-500">PDF or image file up to 5MB (Simulation)</p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-405 text-slate-950 font-black px-5 py-3 rounded-xl text-xs uppercase tracking-wide transition-all duration-300 shadow-md shadow-cyan-500/10 cursor-pointer text-center ring-offset-slate-950 hover:scale-[1.02]"
              id="auditor-verify-btn"
            >
              <ShieldCheck className="h-4.5 w-4.5 shrink-0" />
              <span>Initiate Verified Audit</span>
            </button>
          </form>
        )}

        {/* Separator */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-800/65"></div>
          <span className="flex-shrink mx-3 text-[9px] uppercase font-bold text-slate-500 tracking-widest font-mono">Alternative Access</span>
          <div className="flex-grow border-t border-slate-800/65"></div>
        </div>

        {/* Demo Version Button */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={onDemoLogin}
            className="w-full inline-flex items-center justify-center gap-2 bg-slate-950 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-slate-300 hover:text-white font-extrabold px-5 py-3 rounded-xl text-xs uppercase tracking-wide transition-all cursor-pointer hover:scale-[1.02]"
            id="demo-version-gate-btn"
          >
            <Play className="h-4 w-4 shrink-0 text-amber-500" />
            <span>Use Demo Version</span>
          </button>
          <p className="text-[9px] text-slate-500 leading-normal text-center max-w-sm mx-auto">
            Demo mode operates in-memory; no persistent local or cloud state will be saved.
          </p>
        </div>





        {/* Official Ecosystem Claim footnotes */}
        <div className="mt-4 pt-3.5 border-t border-slate-900 text-center animate-fade-in" id="compulsory-login-claim-footnote">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-[9.5px] font-black uppercase tracking-wider mb-2.5">
            <Sparkles className="h-3 w-3 text-emerald-400 shrink-0" />
            <span>World's First Dual-Mode HSE App</span>
          </div>
          <p className="text-[8.5px] text-slate-400/80 font-mono leading-relaxed px-1">
            *Claim refers to the first field-deployable Toolbox Talk and safety tracking system featuring automated offline cryptographic caching, native vector touch-signature drawing, and remote GCC municipality-compliant sync engines without active satellite or network cellular requirements on site.
          </p>
        </div>
      </div>
    </div>
  );
}
