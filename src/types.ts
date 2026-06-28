/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = "Admin" | "HSE Officer" | "Site Engineer" | "Viewer" | "Auditor";

export interface ClientAccount {
  id: string;
  companyName: string;
  adminLoginId: string;
  adminPassword?: string;
  passcode?: string; // Offline login passcode PIN
  subscriptionStatus: "Paid" | "Unpaid" | "Expired" | "Trial";
  subscriptionExpiryDate: string;
  allowedFeatures: {
    whatsappDispatch: boolean;
    sigCanvas: boolean;
    ptwAttachment: boolean;
    heatStressSensor: boolean;
  };
  sitesActive: number;
  usersActive: number;
  sessionsCount: number;
  createdAt: string;
  maxRolesAllowed?: number; // Subscribed number of roles / user logins
  logoUrl?: string; // Company logo Base64 or URL
  resetCode?: string; // Verification code for password reset
  resetCodeExpires?: number; // Code expiry timestamp
  adminName?: string;
  adminPosition?: string;
  adminCompanyId?: string;
}

export interface UserCertificate {
  certificateType: string;
  certificateNumber: string;
  validityDate: string; // YYYY-MM-DD
  fileUrl?: string; // base64 or custom string
}

export interface TenantUser {
  id: string;
  clientId: string; // Belongs to which ClientAccount
  loginId: string;   // Credentials Login ID / Email
  password?: string; // Gateway password
  name: string;
  role: "HSE Officer" | "Site Engineer" | "Viewer";
  createdAt: string;
  passcode?: string; // 4-6 digit passcode for offline login
  companyId?: string; // Company / Employee ID No
  position?: string; // Designation e.g. "Senior Safety Inspector"
  safetyRating?: number; // 1-5 safety adherence score
  photoUrl?: string; // custom avatar or photo evidence
  resetCode?: string; // Verification code for password reset
  resetCodeExpires?: number; // Code expiry timestamp
  certificates?: UserCertificate[]; // Worker & Role Certificates
  hasSavedProfile?: boolean; // track if customized
  bloodGroup?: string; // Blood Group (A+, A-, B+, B-, AB+, AB-, O+, O-)
}

export interface UserSession {
  role: UserRole;
  name: string;
  avatarUrl?: string;
  clientId?: string;
  clientName?: string;
  isDeveloper?: boolean;
  isDemo?: boolean;
  passcode?: string;
  companyId?: string;
  position?: string;
  safetyRating?: number;
  photoUrl?: string;
  loginId?: string;
  id?: string;
  certificates?: UserCertificate[];
  hasSavedProfile?: boolean;
  auditorLicenseNo?: string;
  auditorCompany?: string;
  auditorApprovalLetterRef?: string;
  bloodGroup?: string;
}

export interface Worker {
  id: string; // HSE ID CARD
  name: string;
  designation: string;
  company?: string; // Subcontractor or Third Party firm label
  signature?: string; // Cache base64 or drawn
  certificates?: UserCertificate[]; // Worker & Role Certificates
  photoUrl?: string; // Cache base64 or photo URL
  clientId?: string; // Security-critical multi-tenant isolation key
  clientName?: string; // Auxiliary name key
  bloodGroup?: string; // Blood Group (A+, A-, B+, B-, AB+, AB-, O+, O-)
}

export interface TbtWorkerAttendance {
  slNo: number;
  workerId: string;
  name: string;
  designation: string;
  company?: string;
  signature: string; // base64 PNG or "Signed [drawn]" / "Signed [uploaded]" or empty
  present: boolean;
  selectedCertificates?: string[]; // The list of certificate numbers or types chosen for this TBT
}

export interface TbtTopic {
  id: string;
  title: string;
  category: string;
}

export interface PtwData {
  required: boolean;
  ptwNumber?: string;
  type?: "Hot Work" | "Height Work" | "Confined Space" | "Electrical" | "General" | string;
  expiryDate?: string;
  attachment?: string | null; // base64 PDF or image
  legalAcknowledged?: boolean;
  timestamp?: string;
  engineerSignature?: string; // auto-signature placeholder or drawing
  hseSignature?: string;      // auto-signature placeholder or drawing
}

export interface TbtSession {
  id: string; // Report Ref e.g. NSS-TBT-1002
  date: string;
  time: string;
  clientName: string;
  projectName: string;
  projectNumber: string;
  siteLocation: string;
  topic: string;
  hazards: string[];
  controls: string[];
  ppeRequired: string[];
  remarks: string;
  attendance: TbtWorkerAttendance[];
  photoEvidence: string | null; // base64 image
  supervisorSignature: string; // base64 drawing
  hseOfficerSignature: string; // base64 drawing
  ptwData?: PtwData;
  adnocLsrData?: {
    enabled: boolean;
    checkedRules: string[];
  };
  auditTrail: {
    createdBy: string;
    createdAt: string;
    editedBy?: string;
    editedAt?: string;
  };
  synced: boolean;
  startTime?: string;
  finishTime?: string;
  totalManpower?: number;
  totalManHours?: number;
  // Live Ground-Level Site Verification data
  submittedLatitude?: number;
  submittedLongitude?: number;
  submittedDistanceMeters?: number;
  verificationMethod?: "GPS" | "QR-Shield" | "Bypass-Key";
  verificationProofCode?: string;
}

export interface HeatStressGrading {
  avgTemperature: number;
  relativeHumidity: number;
  heatIndex: number;
  threatLevel: string;
  color: string;
  alertMinstry: string;
  uaeTime: string;
  locationLabel?: string;
}

export interface PpeCheckItem {
  id: string;
  text: string;
  category: string;
  checked: boolean;
}

export interface ClientProject {
  id: string;
  clientNameAddress: string;
  projectName: string;
  projectNo: string;
  location: string;
  validityDate: string; // YYYY-MM-DD
  originalValidityDate?: string;
  clientId?: string; // Security-critical multi-tenant isolation key
  // Geofence & GL-GFP Real-Site Integrity Fields
  latitude?: number;
  longitude?: number;
  geofenceRadius?: number; // Allowed submission radius in meters
  qrShieldCode?: string;   // Secondary physical QR signpost bypass code
  masterBypassKey?: string; // Project-specific master bypass key
}

