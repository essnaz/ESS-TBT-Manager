/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TbtTopic, Worker, TbtSession } from "./types";

export const DEFAULT_TOPICS: TbtTopic[] = [
  { id: "top_1", title: "Heat Stress and Summer Hydration", category: "Climate Compliance" },
  { id: "top_2", title: "Safe Working at Heights", category: "Fall Prevention" },
  { id: "top_3", title: "Dropped Objects Risk & Exclusion Zones", category: "Dropped Objects" },
  { id: "top_4", title: "Excavation and Shoring Safety Inspection", category: "Civil Works" },
  { id: "top_5", title: "Personal Protective Equipment (PPE) Compliance", category: "General Safety" },
  { id: "top_6", title: "Manual Handling and Heavy Lift Ergonomics", category: "Ergonomics" },
  { id: "top_7", title: "Crane Operations and Rigger Radio Coordination", category: "Lifting Safety" },
  { id: "top_8", title: "Electrical Power Tools & Wet-Zone Safety", category: "Electrical Safety" }
];

export const DEFAULT_WORKERS: Worker[] = [];

export const UAE_CLIENTS = [
  "Emaar Properties PJSC",
  "Nakheel Properties",
  "DAMAC PJSC",
  "Dubai Municipality HSE Dept",
  "Aldar Developers PJSC",
  "Al Naboodah Construction Group"
];

export const UAE_PROJECTS: Record<string, { number: string; projects: string[]; sites: string[] }> = {
  "Emaar Properties PJSC": {
    number: "EMP-DXB-2026",
    projects: ["Downtown Beachfront Residences", "Emaar South District Phase 3"],
    sites: ["Beachfront Sector 1", "Emaar South Block G", "Downtown Marina Area D"]
  },
  "Nakheel Properties": {
    number: "NKH-PLM-2026",
    projects: ["Palm Jebel Ali infrastructure", "Palm Heights Luxury Condos"],
    sites: ["Crescent Sector West 3", "Palm Heights Tower A", "Palm Spine Marina Area"]
  },
  "DAMAC PJSC": {
    number: "DMC-LAG-2026",
    projects: ["DAMAC Lagoons Morocco Sector", "DAMAC Cavalli Towers Marina"],
    sites: ["Morocco Water District B", "Cavalli High-Rise Zone 2", "Lagoons Central Spine"]
  },
  "Dubai Municipality HSE Dept": {
    number: "DM-INF-2026",
    projects: ["Deira Coastal Road Alignment", "Al Khawaneej Storm Network"],
    sites: ["Deira Coastal Sector A4", "Al Khawaneej Excavation Zone C"]
  },
  "Aldar Developers PJSC": {
    number: "ALD-AD-2026",
    projects: ["Saadiyat Grove Cultural Center", "Aldar Yas South Mansions"],
    sites: ["Saadiyat Foundation Zone 1", "Yas Island North Access B"]
  },
  "Al Naboodah Construction Group": {
    number: "ANC-DXB-2026",
    projects: ["Shoring Works District 2", "Industrial Logistics Sheds"],
    sites: ["District 2 Civil Pit", "Logistics Park Sector F"]
  }
};

export const SAMPLE_TBT_HISTORY: TbtSession[] = [];
