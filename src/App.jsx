import { useState, useEffect, useCallback, useMemo } from "react";
import * as XLSX from "xlsx";

const FACILIO_LOGO = "data:image/png;base64,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";

const FALLBACK = [
  { account:"Trinity Health", vertical:"Hospital", region:"US", phase:"Early Access Testing", rag:"Green", status:"Active", lead:"Sangavi", consultant:"Jhimlee Datta", comments:"UAT initiated Mar 24. Go-live for first 2 sites June 2, 2025." },
  { account:"Limbach", vertical:"IFM", region:"US", phase:"UAT", rag:"Amber", status:"Active", lead:"Sangavi", consultant:"Jhimlee Datta", comments:"UAT extended to mid-June. Client adapting from older CMMS." },
  { account:"ICD BP Phase-2", vertical:"CRE", region:"UAE", phase:"UAT", rag:"Red", status:"Active", lead:"Ashwin", consultant:"Harish/Robin/Dinesh", comments:"Integration blocked by API dependency from client. On hold." },
  { account:"Al Mujama Wave 2", vertical:"CRE", region:"UAE", phase:"Configuration", rag:"Amber", status:"Active", lead:"Ashwin", consultant:"Harish M", comments:"Integration with Anacity delayed. Timeline TBD." },
  { account:"IEM", vertical:"IFM", region:"UK", phase:"Hypercare", rag:"Red", status:"Active", lead:"Inbaraj", consultant:"Deepika/Krishna", comments:"M1 partially live. M2 yet to start. Functional testing in progress." },
  { account:"Al-bawani CAFM", vertical:"IFM", region:"UAE", phase:"UAT", rag:"Amber", status:"Active", lead:"Ashwin", consultant:"Robin/Riya", comments:"Phase 3 UAT in progress." },
  { account:"JSY-PAHAYTC", vertical:"IFM", region:"APAC", phase:"UAT", rag:"Green", status:"Active", lead:"Inbaraj", consultant:"Nivetha", comments:"Go-live agreed. Awaiting confirmation from DARe." },
  { account:"Saudi Tabreed Phase 1", vertical:"CRE", region:"UAE", phase:"UAT", rag:"Green", status:"Active", lead:"Inbaraj", consultant:"Nivetha", comments:"UAT in progress. Go-live planned May 9, 2025." },
  { account:"Saudi Tabreed Phase 2", vertical:"CRE", region:"UAE", phase:"UAT", rag:"Green", status:"Active", lead:"Inbaraj", consultant:"Nivetha", comments:"UAT in progress." },
  { account:"Al Kholi", vertical:"IFM", region:"ME", phase:"UAT", rag:"Green", status:"Active", lead:"Inbaraj", consultant:"Anantha Sai", comments:"Early UAT completed Apr 14. Functional testing ongoing." },
  { account:"MAF Al Zahia", vertical:"CRE", region:"UAE", phase:"UAT", rag:"Green", status:"Active", lead:"Inbaraj", consultant:"Nivetha", comments:"Module demos complete. Internal testing in progress." },
  { account:"Roberto Cavalli", vertical:"CRE", region:"UAE", phase:"UAT", rag:"Green", status:"Active", lead:"Ashwin", consultant:"Riyavarshini", comments:"UAT started May 8. BRD steering committee approval pending." },
  { account:"MHA", vertical:"CRE", region:"UK", phase:"BRD Cycle", rag:"Red", status:"Active", lead:"Ashwin", consultant:"Dinesh", comments:"BRD under internal review. Sign-off expected soon." },
  { account:"QSP Site & Power", vertical:"CRE", region:"UAE", phase:"BRD Cycle", rag:"Red", status:"Active", lead:"Ashwin", consultant:"Harish M", comments:"BRD under management review. Sign-off expected May 7." },
  { account:"Avar Phase 2", vertical:"IFM", region:"ME", phase:"Configuration", rag:"Green", status:"Active", lead:"Inbaraj", consultant:"Ananth/Livin/Nivetha", comments:"BRD approved. Implementation started." },
  { account:"Dalkia Misk City", vertical:"IFM", region:"ME", phase:"UAT", rag:"Green", status:"Active", lead:"Ashwin", consultant:"Harish", comments:"UAT in progress. Go-live planned July 8." },
  { account:"Cognita", vertical:"CRE", region:"UAE", phase:"Configuration", rag:"Green", status:"Active", lead:"Ashwin", consultant:"Nivetha/Krishna", comments:"Data gathering complete for 3 campuses. Configuration in progress." },
  { account:"Ace Hardware", vertical:"Retail", region:"US", phase:"Data Gathering", rag:"Green", status:"Active", lead:"Mithun", consultant:"Manoj", comments:"Data gathering in progress." },
  { account:"Silal", vertical:"CRE", region:"UAE", phase:"Configuration", rag:"Amber", status:"Active", lead:"Ashwin", consultant:"William Stordeur", comments:"BRD under review. Implementation pending sign-off." },
  { account:"Metro Maintenance Phase 2", vertical:"IFM", region:"US", phase:"UAT", rag:"Red", status:"Active", lead:"Ashwin", consultant:"Vasanth V", comments:"Phase 2 yet to start." },
  { account:"Unilodge Phase 2", vertical:"CRE", region:"AUS", phase:"UAT", rag:"Green", status:"Active", lead:"Ashwin", consultant:"Dinesh", comments:"UAT in progress. Wave 1 go-live June 19." },
  { account:"Skeens Phase 2", vertical:"IFM", region:"US", phase:"UAT", rag:"Amber", status:"Active", lead:"Ashwin", consultant:"Robin", comments:"UAT in progress." },
  { account:"MAF Tilal Al Ghaf", vertical:"CRE", region:"UAE", phase:"UAT", rag:"Green", status:"Active", lead:"Inbaraj", consultant:"Nivetha", comments:"All use case BRDs signed off. Portfolio demo done." },
  { account:"Cushman & Wakefield", vertical:"IFM", region:"US", phase:"UAT", rag:"Green", status:"Active", lead:"Vaibhav", consultant:"Bala Kiruthika", comments:"UAT in progress." },
  { account:"ICD BP Phase-1", vertical:"CRE", region:"UAE", phase:"Go-Live", rag:"Green", status:"Hypercare", lead:"Ashwin", consultant:"Sandhiya/Harish/Robin", comments:"Phase-1 live. Phase-02 adoption in progress." },
  { account:"Al Mujama Wave 1", vertical:"CRE", region:"UAE", phase:"Go-Live", rag:"Green", status:"Hypercare", lead:"Ashwin", consultant:"Harish M", comments:"Live since Mar 4. Using for maintenance and PPM activities." },
  { account:"Kingsmede", vertical:"CRE", region:"AUS", phase:"Hypercare", rag:"Green", status:"Hypercare", lead:"Inbaraj", consultant:"Anantha Sai", comments:"Live since March 3. Hypercare support ongoing." },
  { account:"Deyaar DCM", vertical:"CRE", region:"UAE", phase:"Hypercare", rag:"Green", status:"Hypercare", lead:"Inbaraj", consultant:"Nivetha", comments:"Live. Phase 2 implementation started April 10." },
  { account:"Deyaar DPM", vertical:"CRE", region:"UAE", phase:"Hypercare", rag:"Green", status:"Hypercare", lead:"Inbaraj", consultant:"Nivetha", comments:"Ready to go-live but on hold due to internal vendor disputes." },
  { account:"Charter Hall", vertical:"CRE", region:"AUS", phase:"Go-Live", rag:"Green", status:"Hypercare", lead:"Inbaraj", consultant:"Riyavarshini", comments:"Go-live complete. Support transition in progress." },
  { account:"Mansions", vertical:"CRE", region:"UAE", phase:"Hypercare", rag:"Green", status:"Hypercare", lead:"Ashwin", consultant:"Riyavarshini", comments:"Live April 7. Support transition in progress." },
  { account:"Metro Maintenance Phase 1", vertical:"IFM", region:"US", phase:"Go-Live", rag:"Green", status:"Hypercare", lead:"Ashwin", consultant:"Vasanth V", comments:"All regions live. KT for support handover planned." },
  { account:"Chicago Maintenance", vertical:"IFM", region:"UAE", phase:"Hypercare", rag:"Green", status:"Hypercare", lead:"Ashwin", consultant:"Robin", comments:"All modules configured. Go-live confirmation pending from CMC." },
  { account:"The Tile Shop", vertical:"Retail", region:"US", phase:"Hypercare", rag:"Green", status:"Hypercare", lead:"Sangavi", consultant:"Bala Kiruthika", comments:"Live. Overall stores (117) went live Sept 20 2024." },
  { account:"Acorn Early Years", vertical:"Edu", region:"UK", phase:"Hypercare", rag:"Amber", status:"Hypercare", lead:"Inbaraj", consultant:"Anantha Sai", comments:"In hypercare. Working on PPM data with customer." },
  { account:"RA International Phase 1", vertical:"IFM", region:"UAE", phase:"Hypercare", rag:"Green", status:"Hypercare", lead:"Ashwin", consultant:"Vasanth", comments:"Live. Hypercare in progress." },
  { account:"PAL Cooling Phase I", vertical:"CRE", region:"UAE", phase:"Hypercare", rag:"Green", status:"Hypercare", lead:"Ashwin", consultant:"Nivetha", comments:"UAT complete. Go-live Feb 11." },
];

const PHASES = ["Requirement Gathering", "Configuration", "UAT", "Hypercare", "Transitioned to support"];

const PHASE_META = {
  "Requirement Gathering": { color:"#64748b", bg:"#64748b18" },
  "Configuration":         { color:"#d97706", bg:"#f59e0b18" },
  "UAT":                   { color:"#059669", bg:"#22c55e18" },
  "Hypercare":             { color:"#ea580c", bg:"#f9731618" },
  "Transitioned to support": { color:"#7c3aed", bg:"#8b5cf618" }
};

const RAG_META = {
  "Green": { color:"#059669", bg:"#22c55e18" },
  "Amber": { color:"#d97706", bg:"#f59e0b18" },
  "Red":   { color:"#dc2626", bg:"#ef444418" }
};

const TWELVE_HRS = 12 * 60 * 60 * 1000;

const VertPill = ({ v }) => {
  const meta = { "CMMS": { color:"#0d9488", bg:"#0d948818" }, "EAM": { color:"#2563eb", bg:"#2563eb18" }, "Other": { color:"#64748b", bg:"#64748b18" } };
  const m = meta[v] || meta.Other;
  return <span style={{ fontSize:11, fontWeight:600, padding:"2px 8px", borderRadius:10, color:m.color, background:m.bg }}>{v||"—"}</span>;
};

const PhasePill = ({ phase }) => {
  const m = PHASE_META[phase] || { color:"#64748b", bg:"#64748b18" };
  return <span style={{ fontSize:11, fontWeight:600, padding:"2px 8px", borderRadius:10, color:m.color, background:m.bg }}>{phase||"—"}</span>;
};

const RAGDot = ({ rag }) => {
  const m = RAG_META[rag] || RAG_META.Green;
  return <span style={{ width:7, height:7, borderRadius:4, background:m.color, display:"inline-block" }}></span>;
};

const fmtTime = (ts) => {
  const d = new Date(ts);
  return d.toLocaleString();
};

export default function App() {
  const [projects, setProjects]       = useState(FALLBACK);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [syncing, setSyncing]         = useState(false);
  const [syncMsg, setSyncMsg]         = useState(null);
  const [filters, setFilters]         = useState({rag:"all",phase:"all",region:"all",lead:"all",vertical:"all",search:""});
  const [sortKey, setSortKey]         = useState("account");
  const [sortDir, setSortDir]         = useState(1);
  const [expanded, setExpanded]       = useState(null);
  const [debugLog, setDebugLog]       = useState(null);
  const [showDebug, setShowDebug]     = useState(false);

  const sync = useCallback(async (force = false) => {
    setSyncing(true); setSyncMsg(null); setDebugLog(null);
    try {
      const url = "https://facilio958-my.sharepoint.com/personal/shivaraj_facilio_com/_layouts/15/download.aspx?share=IQB6lxWOZaPkSLrCt_VqoDbNAYl6eoglJtu89lPV8LB3rAg";
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const data = await res.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = "In Progress";
      if (!workbook.Sheets[sheetName]) throw new Error(`Sheet "${sheetName}" not found`);
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false });
      if (json.length < 2) throw new Error("No data in sheet");

      const headers = json[0].map(h => (h || "").toLowerCase().trim());
      const rows = json.slice(1);

      const colMap = {};
      const possibleCols = {
        account: ["account", "project", "client", "customer", "name"],
        vertical: ["vertical", "business unit", "bu", "type"],
        region: ["region", "location", "area"],
        phase: ["phase", "stage", "status"],
        rag: ["rag", "risk", "priority", "timeline"],
        status: ["status", "state"],
        lead: ["lead", "manager", "owner", "pm"],
        consultant: ["consultant", "developer", "engineer", "consultant/s"],
        comments: ["comments", "notes", "description", "latest status", "summary"],
        plannedGoLive: ["planned go-live date", "planned golive", "planned go live"],
        actualGoLive: ["actual go-live date", "actual golive", "actual go live"],
        clientPOC: ["client poc", "client contact"],
        sowPlanStart: ["sow - plan start date", "sow plan start"],
        sowPlanEnd: ["sow - plan end date", "sow plan end"],
        plannedStart: ["planned start date"],
        actualStart: ["actual start date"],
        plannedBRDSub: ["planned brd submission date"],
        actualBRDSub: ["actual brd submission date"],
        plannedBRDSignoff: ["planned brd signoff"],
        actualBRDSignoff: ["actual brd signoff"],
        plannedUATStart: ["planned uat start"],
        actualUATStart: ["actual uat start"],
        plannedUATSignoff: ["planned uat sign off"],
        actualUATSignoff: ["actual uat sign off"],
        projectPlan: ["project plan"],
        msa: ["msa"],
        governanceFolder: ["link to project governance folder"],
        brd: ["brd"],
        wsr: ["wsr"],
        functionalTestReport: ["functional test report"]
      };
      for (const [key, possibles] of Object.entries(possibleCols)) {
        for (const h of headers) {
          if (possibles.some(p => h.includes(p))) {
            colMap[key] = headers.indexOf(h);
            break;
          }
        }
      }

      const mapped = rows.map(row => ({
        account: row[colMap.account] || "Unknown",
        vertical: row[colMap.vertical] || "",
        region: row[colMap.region] || "",
        phase: row[colMap.phase] || "",
        rag: row[colMap.rag] || "Green",
        status: row[colMap.status] || "Active",
        lead: row[colMap.lead] || "",
        consultant: row[colMap.consultant] || "",
        comments: row[colMap.comments] || "",
        plannedGoLive: row[colMap.plannedGoLive] || "",
        actualGoLive: row[colMap.actualGoLive] || "",
        clientPOC: row[colMap.clientPOC] || "",
        sowPlanStart: row[colMap.sowPlanStart] || "",
        sowPlanEnd: row[colMap.sowPlanEnd] || "",
        plannedStart: row[colMap.plannedStart] || "",
        actualStart: row[colMap.actualStart] || "",
        plannedBRDSub: row[colMap.plannedBRDSub] || "",
        actualBRDSub: row[colMap.actualBRDSub] || "",
        plannedBRDSignoff: row[colMap.plannedBRDSignoff] || "",
        actualBRDSignoff: row[colMap.actualBRDSignoff] || "",
        plannedUATStart: row[colMap.plannedUATStart] || "",
        actualUATStart: row[colMap.actualUATStart] || "",
        plannedUATSignoff: row[colMap.plannedUATSignoff] || "",
        actualUATSignoff: row[colMap.actualUATSignoff] || "",
        projectPlan: row[colMap.projectPlan] || "",
        msa: row[colMap.msa] || "",
        governanceFolder: row[colMap.governanceFolder] || "",
        brd: row[colMap.brd] || "",
        wsr: row[colMap.wsr] || "",
        functionalTestReport: row[colMap.functionalTestReport] || ""
      })).filter(p => p.account && p.account !== "Unknown");

      setProjects(mapped);
      const ts = Date.now(); setLastUpdated(ts);
      setSyncMsg({ ok: true, text: `Synced ${mapped.length} projects from SharePoint` });
    } catch (e) {
      setSyncMsg({ ok: false, text: `Sync error: ${e.message}` });
      setDebugLog(`Exception: ${e.message}`);
      setShowDebug(true);
    } finally { setSyncing(false); }
  }, []);

  useEffect(() => {
    sync();
    const iv = setInterval(() => sync(), TWELVE_HRS);
    return () => clearInterval(iv);
  }, [sync]);

  const stats = useMemo(() => {
    const live = projects.filter(p => p.status !== "Transitioned");
    const active = projects.filter(p => p.status === "Active");
    const hyp = projects.filter(p => p.status === "Hypercare");
    return {
      total: projects.length,
      active: active.length, hypercare: hyp.length,
      green:  live.filter(p=>p.rag==="Green").length,
      amber:  live.filter(p=>p.rag==="Amber").length,
      red:    live.filter(p=>p.rag==="Red").length,
      phase: PHASES.reduce((acc,ph) => (acc[ph] = live.filter(p=>p.phase.toLowerCase() === ph.toLowerCase()).length, acc), {}),
      regions: [...new Set(live.map(p=>p.region).filter(r=>r))].sort(),
      regionCounts: live.reduce((acc,p) => (acc[p.region] = (acc[p.region]||0)+1, acc), {}),
      leads: [...new Set(live.map(p=>p.lead).filter(l=>l))].sort(),
      leadCounts: live.reduce((acc,p) => (acc[p.lead] = (acc[p.lead]||0)+1, acc), {}),
      verticals: [...new Set(live.map(p=>p.vertical).filter(v=>v))].sort(),
      verticalCounts: live.reduce((acc,p) => (acc[p.vertical] = (acc[p.vertical]||0)+1, acc), {})
    };
  }, [projects]);

  const filtered = useMemo(() => {
    return projects.filter(p => {
      if (filters.rag!=="all" && p.rag!==filters.rag) return false;
      if (filters.phase!=="all" && p.phase.toLowerCase()!==filters.phase.toLowerCase()) return false;
      if (filters.region!=="all" && p.region!==filters.region) return false;
      if (filters.lead!=="all" && p.lead!==filters.lead) return false;
      if (filters.vertical!=="all" && p.vertical!==filters.vertical) return false;
      if (filters.search) {
        const q=filters.search.toLowerCase();
        return [p.account,p.region,p.lead,p.consultant,p.comments].some(v=>(v||"").toLowerCase().includes(q));
      }
      return true;
    }).sort((a,b) => {
      const av=a[sortKey]||"", bv=b[sortKey]||"";
      return av.localeCompare(bv)*sortDir;
    });
  }, [projects, filters, sortKey, sortDir]);

  const toggleSort = (key) => {
    if (sortKey===key) setSortDir(d=>-d); else { setSortKey(key); setSortDir(1); }
  };

  const setFilter = (k,v) => setFilters(f=>({...f,[k]:v}));

  // ── Styles ────────────────────────────────────────────────────────────────────
  const S = {
    wrap:  { fontFamily:"'Manrope', system-ui, sans-serif", minHeight:"100vh", color:"#1e293b", background:"#f0f4f8" },

    // Ribbon — exact match to reference page
    ribbon: {
      background:"#1B0E51",
      borderBottom:"3px solid #301894",
      padding:"0 32px", height:56,
      display:"flex", alignItems:"center", justifyContent:"space-between",
      position:"sticky", top:0, zIndex:50
    },
    ribbonLeft:  { display:"flex", alignItems:"center", gap:10 },
    ribbonRight: { fontSize:12, color:"rgba(255,255,255,0.6)" },

    shell: { maxWidth:1440, margin:"0 auto", padding:"24px 20px 48px" },
    heroPanel:{ display:"grid", gridTemplateColumns:"1fr", gap:14, alignItems:"stretch" },

    header: {
      background:"#ffffff", border:"1px solid #e2e8f0", padding:"12px 24px",
      display:"flex", alignItems:"center", justifyContent:"space-between", gap:20,
      borderRadius:20, boxShadow:"0 1px 3px rgba(15,23,42,0.06), 0 8px 24px rgba(15,23,42,0.06)"
    },
    headerMain:{ position:"relative", overflow:"hidden" },
    headerGlow:{ display:"none" },

    brand:     { display:"flex", alignItems:"center", gap:12 },
    logo:      { width:38, height:38, borderRadius:12, background:"linear-gradient(135deg,#14b8a6,#2563eb)", boxShadow:"0 4px 12px rgba(37,99,235,0.22)", display:"flex", alignItems:"center", justifyContent:"center", color:"#ffffff", flexShrink:0 },
    brandText: { display:"flex", flexDirection:"column", gap:3 },
    wordmark:  { fontSize:17, fontWeight:800, color:"#0f172a", letterSpacing:"-0.04em", lineHeight:1 },
    heroText:  { display:"flex", flexDirection:"column", alignItems:"flex-start", gap:8, marginTop:0 },
    eyebrow:   { fontSize:11, fontWeight:700, color:"#0d9488", letterSpacing:"0.16em", textTransform:"uppercase" },
    title:     { fontSize:24, fontWeight:800, color:"#0f172a", letterSpacing:"-0.04em", lineHeight:1, whiteSpace:"nowrap" },
    sub:       { fontSize:13, color:"#64748b", lineHeight:1.55, maxWidth:760 },
    statLine:  { display:"flex", gap:8, flexWrap:"wrap", marginTop:4 },
    statChip:  { fontSize:11, color:"#64748b", background:"#f1f5f9", border:"1px solid #e2e8f0", borderRadius:999, padding:"5px 10px" },
    syncRow:   { display:"flex", gap:10, flexWrap:"wrap", alignItems:"center", marginTop:2 },
    syncBtn:   {
      background: syncing?"#f1f5f9":"linear-gradient(135deg,#14b8a6,#2563eb)",
      border:"1px solid " + (syncing?"#e2e8f0":"transparent"),
      color: syncing?"#94a3b8":"#ffffff",
      borderRadius:10, padding:"8px 14px", fontSize:12, fontWeight:600,
      cursor: syncing?"not-allowed":"pointer", display:"flex", alignItems:"center", gap:6,
      boxShadow: syncing?"none":"0 2px 8px rgba(37,99,235,0.22)"
    },

    spotlightCard:  { background:"#1B0E51", border:"1px solid rgba(48,24,148,0.6)", borderRadius:18, padding:"16px 18px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:20, minWidth:380, maxWidth:560, width:"100%", boxShadow:"0 4px 20px rgba(15,23,42,0.12)" },
    spotlightLabel: { fontSize:10, color:"#67e8f9", fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase" },
    spotlightValue: { fontSize:38, fontWeight:800, lineHeight:0.95, letterSpacing:"-0.05em", color:"#ffffff", marginTop:8 },
    spotlightText:  { fontSize:11, color:"rgba(255,255,255,0.50)", lineHeight:1.5, marginTop:8, maxWidth:200 },
    spotlightStack: { display:"grid", gridTemplateColumns:"repeat(3,minmax(100px,1fr))", gap:8, flex:1 },
    spotlightRow:   { display:"flex", flexDirection:"column", alignItems:"flex-start", justifyContent:"space-between", gap:6, padding:"10px 12px", borderRadius:12, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.08)", minHeight:80 },
    spotlightName:  { fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.60)", lineHeight:1.35 },
    spotlightMeta:  { fontSize:20, fontWeight:800, lineHeight:1, marginTop:"auto" },

    kpiRow: { display:"grid", gridTemplateColumns:"repeat(4,minmax(0,1fr))", gap:14, padding:"16px 0 0" },
    kpi:    { background:"#ffffff", border:"1px solid #e2e8f0", borderRadius:18, padding:"18px 18px 16px", boxShadow:"0 1px 3px rgba(15,23,42,0.05), 0 4px 16px rgba(15,23,42,0.05)" },
    kpiNum: { fontSize:28, fontWeight:800, lineHeight:1, letterSpacing:"-0.03em" },
    kpiLbl: { fontSize:11, color:"#94a3b8", marginTop:8, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase" },

    section:     { padding:"16px 0 0" },
    sectionCard: { background:"#ffffff", border:"1px solid #e2e8f0", borderRadius:20, padding:"18px 20px", boxShadow:"0 1px 3px rgba(15,23,42,0.04), 0 4px 16px rgba(15,23,42,0.04)" },
    sectionTitle:{ fontSize:11, color:"#94a3b8", fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:12 },

    pipeline: { display:"flex", gap:8, alignItems:"stretch", overflowX:"auto" },
    pipeItem: { flex:"1 1 0", minWidth:96, background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:14, padding:"12px 14px", cursor:"pointer", transition:"transform 0.18s, border-color 0.18s, box-shadow 0.18s" },
    pipeCount:{ fontSize:22, fontWeight:700, letterSpacing:"-0.02em" },
    pipeLabel:{ fontSize:10, color:"#94a3b8", fontWeight:700, marginTop:4, lineHeight:1.35, letterSpacing:"0.05em", textTransform:"uppercase" },

    tabs: { display:"flex", gap:3, background:"#f1f5f9", borderRadius:12, padding:3, border:"1px solid #e2e8f0" },
    tab:  (active) => ({ padding:"7px 14px", borderRadius:9, fontSize:13, fontWeight:600, cursor:"pointer", transition:"all 0.15s", background:active?"#ffffff":"transparent", color:active?"#0f172a":"#64748b", border:"none", boxShadow:active?"0 1px 3px rgba(15,23,42,0.08)":"none" }),

    filters: { display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" },
    sel:     { background:"#f8fafc", border:"1px solid #e2e8f0", color:"#1e293b", borderRadius:10, padding:"9px 12px", fontSize:12, outline:"none" },
    search:  { background:"#f8fafc", border:"1px solid #e2e8f0", color:"#1e293b", borderRadius:10, padding:"9px 14px", fontSize:13, outline:"none", flex:1, minWidth:180 },

    table: { width:"100%", borderCollapse:"collapse", fontSize:13 },
    th:    (active) => ({ padding:"9px 12px", textAlign:"left", fontSize:11, fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", color:active?"#0d9488":"#94a3b8", background:"#f8fafc", borderBottom:"1px solid #e2e8f0", cursor:"pointer", whiteSpace:"nowrap" }),
    tr:    (i,exp) => ({ background: exp?"#eff6ff":(i%2===0?"#ffffff":"#f8fafc"), borderBottom:"1px solid #f1f5f9", cursor:"pointer", transition:"background 0.12s" }),
    td:    { padding:"10px 12px", verticalAlign:"middle" },
    expRow:{ background:"#f0f9ff", borderBottom:"1px solid #e0f2fe" },

    badge: (color,bg) => ({ fontSize:11, fontWeight:600, padding:"2px 8px", borderRadius:10, color, background:bg, display:"inline-flex", alignItems:"center", gap:4 }),
    count: { fontSize:11, color:"inherit", marginLeft:4, opacity:0.65 },
    msg:   (ok) => ({ fontSize:12, color:ok?"#166534":"#92400e", background:ok?"#f0fdf4":"#fffbeb", border:"1px solid "+(ok?"#bbf7d0":"#fde68a"), padding:"7px 10px", borderRadius:999, display:"flex", alignItems:"center", gap:4 }),
    empty: { textAlign:"center", padding:"40px 20px", color:"#94a3b8" },
    footer:{ padding:"10px 14px", background:"#f8fafc", borderTop:"1px solid #e2e8f0", fontSize:11, color:"#94a3b8", display:"flex", justifyContent:"space-between", gap:10, flexWrap:"wrap" },
    regionCard: { background:"#ffffff", border:"1px solid #e2e8f0", borderRadius:14, padding:"12px 16px", minWidth:132, boxShadow:"0 1px 4px rgba(15,23,42,0.05)" },
  };

  const TH = ({ k, label }) => (
    <th style={S.th(sortKey===k)} onClick={()=>toggleSort(k)}>
      {label} {sortKey===k ? (sortDir===1?"↑":"↓") : ""}
    </th>
  );

  return (
    <div style={S.wrap}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box}
        input::placeholder{color:#94a3b8}
        select option{background:#ffffff;color:#1e293b}
        tr:hover td{background:#e8f4fe!important}
        .pipe-item:hover{transform:translateY(-2px);border-color:#14b8a6!important;box-shadow:0 8px 20px rgba(15,23,42,0.10)!important}
        a{color:inherit}
        .dashboard-grid{display:grid;gap:14px}
        .dashboard-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
        .hero-panel{display:grid;grid-template-columns:1fr;gap:14px;align-items:stretch}
        .hero-header-grid{display:flex;align-items:flex-start;justify-content:space-between;gap:18px}
        @media (max-width: 1100px){.dashboard-grid{grid-template-columns:1fr 1fr}}
        @media (max-width: 1100px){.hero-card-title{font-size:34px}}
        @media (max-width: 860px){.hero-header-grid{flex-direction:column}.hero-spotlight{max-width:none!important;width:100%}}
        @media (max-width: 780px){.dashboard-grid{grid-template-columns:1fr}.dashboard-header{padding:18px}.dashboard-section{padding:18px}}
        @media (max-width: 680px){.dashboard-footer{flex-direction:column}.dashboard-toolbar{justify-content:flex-start}}
        @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
      `}</style>

      {/* ── Ribbon ── */}
      <div style={S.ribbon}>
        <div style={S.ribbonLeft}>
          <img src={FACILIO_LOGO} alt="Facilio" style={{ height:36, width:"auto", objectFit:"contain", display:"block", borderRadius:8 }} />
        </div>
        <div style={S.ribbonRight}>
          {lastUpdated ? `Last synced ${fmtTime(lastUpdated)}` : "Syncing…"}
        </div>
      </div>

      <div style={S.shell}>
        {/* ── Header ── */}
        <div className="hero-panel" style={S.heroPanel}>
          <div className="dashboard-header" style={{...S.header, ...S.headerMain}}>
            <div style={S.headerGlow} />
            <div className="hero-header-grid" style={{ position:"relative", zIndex:1, width:"100%" }}>
              <div style={{ flex:1, minWidth:0, display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
                <div className="hero-card-title" style={S.title}>Connected CMMS — Implementation Dashboard</div>
                <div style={S.heroText}>
                  <span style={S.statChip}>{lastUpdated ? `Last synced ${fmtTime(lastUpdated)}` : "Sync in progress"}</span>
                  <div style={S.syncRow}>
                    {syncMsg && <div style={S.msg(syncMsg.ok)}>{syncMsg.ok?"✓":"⚠"} {syncMsg.text}</div>}
                    <button style={S.syncBtn} onClick={()=>sync(true)} disabled={syncing}>
                      {syncing ? <span style={{ display:"inline-block", animation:"spin 1s linear infinite" }}>↻</span> : "↻"}
                      {syncing ? "Syncing…" : "Sync Now"}
                    </button>
                  </div>
                </div>
              </div>
              <div className="hero-spotlight" style={S.spotlightCard}>
                <div style={{ minWidth:120 }}>
                  <div style={S.spotlightLabel}>Portfolio Snapshot</div>
                  <div style={S.spotlightValue}>{stats.total}</div>
                  <div style={S.spotlightText}>
                    Projects
                  </div>
                </div>
                <div style={S.spotlightStack}>
                  {[["Healthy", stats.green, "#22c55e"], ["Watchlist", stats.amber, "#f59e0b"], ["Needs attention", stats.red, "#ef4444"]].map(([label, value, color]) => (
                    <div key={label} style={S.spotlightRow}>
                      <div style={S.spotlightName}>{label}</div>
                      <div style={{ ...S.spotlightMeta, color }}>{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── KPI Cards ── */}
        <div className="dashboard-grid" style={S.kpiRow}>
          {[
            { num:stats.total,  label:"Total Projects", color:"#2563eb", ragKey:null,    onClick: () => setFilters({rag:"all",phase:"all",region:"all",lead:"all",vertical:"all",search:""}) },
            { num:stats.green,  label:"On Track",       color:"#059669", ragKey:"Green", onClick: () => setFilter("rag", filters.rag === "Green" ? "all" : "Green") },
            { num:stats.amber,  label:"At Risk",        color:"#d97706", ragKey:"Amber", onClick: () => setFilter("rag", filters.rag === "Amber" ? "all" : "Amber") },
            { num:stats.red,    label:"Critical",       color:"#dc2626", ragKey:"Red",   onClick: () => setFilter("rag", filters.rag === "Red" ? "all" : "Red") },
          ].map(({num,label,color,ragKey,onClick})=>{
            const active = ragKey ? filters.rag === ragKey : (filters.rag==="all" && !filters.phase && !filters.region && !filters.lead && !filters.vertical && !filters.search);
            return (
              <div key={label} style={{
                ...S.kpi,
                cursor:"pointer",
                borderTop:`3px solid ${color}`,
                background: active ? `${color}12` : "#ffffff",
                boxShadow: active ? `0 0 0 2px ${color}40, 0 4px 16px ${color}20` : S.kpi.boxShadow,
                transform: active ? "translateY(-1px)" : "none",
                transition:"all 0.15s"
              }} onClick={onClick}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div style={{...S.kpiNum, color}}>{num}</div>
                </div>
                <div style={S.kpiLbl}>{label}</div>
              </div>
            );
          })}
        </div>

        {/* ── Phase Pipeline ── */}
        <div style={S.section}>
          <div className="dashboard-section" style={S.sectionCard}>
            <div style={S.sectionTitle}>Implementation pipeline</div>
            <div style={{...S.pipeline, display:"flex", flexDirection:"column", gap:18 }}>
              <div style={{display:"flex", gap:8, alignItems:"center", overflowX:"auto"}}>
                {PHASES.map(ph => {
                  const m = PHASE_META[ph]; const count = stats.phase[ph]||0;
                  const active = filters.phase===ph;
                  return (
                    <div key={ph} className="pipe-item" style={{
                      ...S.pipeItem,
                      borderColor: active ? m.color : "#e2e8f0",
                      background: active ? m.bg : "#f8fafc",
                      borderTopWidth: active ? 2 : 1
                    }} onClick={()=>setFilter("phase", active?"all":ph)}>
                      <div style={{...S.pipeCount, color:m.color}}>{count}</div>
                      <div style={S.pipeLabel}>{ph}</div>
                    </div>
                  );
                })}
              </div>
              <div className="dashboard-toolbar">
                <div style={S.filters}>
                  <select style={S.sel} value={filters.region} onChange={e=>setFilter("region",e.target.value)}>
                    <option value="all">All Regions</option>
                    {stats.regions.map(r=><option key={r} value={r}>{r} ({stats.regionCounts[r]||0})</option>)}
                  </select>
                  <select style={S.sel} value={filters.lead} onChange={e=>setFilter("lead",e.target.value)}>
                    <option value="all">All Managers</option>
                    {stats.leads.map(l=><option key={l} value={l}>{l} ({stats.leadCounts[l]||0})</option>)}
                  </select>
                  <select style={S.sel} value={filters.vertical} onChange={e=>setFilter("vertical",e.target.value)}>
                    <option value="all">All Verticals</option>
                    {stats.verticals.map(v=><option key={v} value={v}>{v} ({stats.verticalCounts[v]||0})</option>)}
                  </select>
                  <input style={S.search} placeholder="Search projects, accounts…"
                    value={filters.search} onChange={e=>setFilter("search",e.target.value)} />
                  {(filters.region!=="all"||filters.lead!=="all"||filters.vertical!=="all"||filters.search) &&
                    <button style={{...S.sel,cursor:"pointer",color:"#dc2626",borderColor:"#fecaca",background:"#fff5f5"}}
                      onClick={()=>setFilters({rag:"all",phase:"all",region:"all",lead:"all",vertical:"all",search:""})}>
                      Clear ×
                    </button>}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={S.section}>
          <div className="dashboard-section" style={S.sectionCard}>
            <div style={{ border:"1px solid #e2e8f0", borderRadius:16, overflow:"hidden" }}>
              <table style={S.table}>
                <thead>
                  <tr>
                    <TH k="account"       label="Account" />
                    <TH k="phase"         label="Phase" />
                    <TH k="lead"          label="Manager" />
                    <TH k="vertical"      label="Vertical" />
                    <TH k="region"        label="Region" />
                    <TH k="plannedGoLive" label="Planned Go-Live" />
                    <TH k="actualGoLive"  label="Actual Go-Live" />
                    <TH k="consultant"    label="Consultant/S" />
                    <TH k="rag"           label="RAG" />
                    <TH k="comments"      label="Latest Status" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={10} style={S.empty}>No projects match the current filters.</td></tr>
                  ) : filtered.map((p,i) => {
                    const isExp = expanded === p.account;
                    const rag = RAG_META[p.rag]||RAG_META.Green;
                    return [
                      <tr key={p.account} style={S.tr(i,isExp)} onClick={()=>setExpanded(isExp?null:p.account)}>
                        <td style={{...S.td, fontWeight:600, color:"#0f172a"}}>
                          <div style={{display:"flex",alignItems:"center",gap:6}}>
                            <span style={{color:"#94a3b8",fontSize:10}}>{isExp?"▼":"▶"}</span>
                            {p.account}
                          </div>
                        </td>
                        <td style={S.td}><PhasePill phase={p.phase} /></td>
                        <td style={{...S.td, color:"#475569"}}>{p.lead||"—"}</td>
                        <td style={S.td}><VertPill v={p.vertical} /></td>
                        <td style={{...S.td, color:"#475569"}}>{p.region}</td>
                        <td style={{...S.td, color:"#475569"}}>{p.plannedGoLive||"—"}</td>
                        <td style={{...S.td, color:"#475569"}}>{p.actualGoLive||"—"}</td>
                        <td style={{...S.td, color:"#64748b", fontSize:12}}>{p.consultant||"—"}</td>
                        <td style={S.td}>
                          <span style={S.badge(rag.color, rag.bg)}>
                            <RAGDot rag={p.rag} /> {p.rag}
                          </span>
                        </td>
                        <td style={{...S.td, color:"#64748b", fontSize:12, maxWidth:220}}>
                          <span style={{display:"block",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                            {p.comments||"—"}
                          </span>
                        </td>
                      </tr>,
                      isExp && (
                        <tr key={p.account+"-exp"} style={S.expRow}>
                          <td colSpan={10} style={{ padding:"14px 24px" }}>
                            <div style={{ display:"flex", gap:32, flexWrap:"wrap" }}>
                              <div>
                                <div style={{ fontSize:10, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:4 }}>Full Status</div>
                                <div style={{ fontSize:13, color:"#334155", maxWidth:480, lineHeight:1.6 }}>{p.comments||"No comments."}</div>
                              </div>
                              <div style={{ display:"flex", gap:24, flexWrap:"wrap" }}>
                                {[
                                  ["Client POC", p.clientPOC],
                                  ["SOW Plan Start", p.sowPlanStart],
                                  ["SOW Plan End", p.sowPlanEnd],
                                  ["Planned Start", p.plannedStart],
                                  ["Actual Start", p.actualStart],
                                  ["Planned BRD Submission", p.plannedBRDSub],
                                  ["Actual BRD Submission", p.actualBRDSub],
                                  ["Planned BRD Signoff", p.plannedBRDSignoff],
                                  ["Actual BRD Signoff", p.actualBRDSignoff],
                                  ["Planned UAT Start", p.plannedUATStart],
                                  ["Actual UAT Start", p.actualUATStart],
                                  ["Planned UAT Signoff", p.plannedUATSignoff],
                                  ["Actual UAT Signoff", p.actualUATSignoff]
                                ].map(([k,v])=>(
                                  <div key={k}>
                                    <div style={{ fontSize:10, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:3 }}>{k}</div>
                                    <div style={{ fontSize:13, color:"#1e293b", fontWeight:500 }}>{v||"—"}</div>
                                  </div>
                                ))}
                              </div>
                              <div style={{ display:"flex", gap:24, flexWrap:"wrap" }}>
                                {[
                                  ["Project Plan", p.projectPlan],
                                  ["MSA", p.msa],
                                  ["Governance Folder", p.governanceFolder],
                                  ["BRD", p.brd],
                                  ["WSR", p.wsr],
                                  ["Functional Test Report", p.functionalTestReport]
                                ].map(([k,v])=>(
                                  <div key={k}>
                                    <div style={{ fontSize:10, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:3 }}>{k}</div>
                                    <div style={{ fontSize:13, color:"#1e293b", fontWeight:500 }}>
                                      {v ? <a href={v} target="_blank" rel="noopener noreferrer" style={{color:"#0d9488"}}>Link</a> : "—"}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )
                    ];
                  })}
                </tbody>
              </table>
              <div className="dashboard-footer" style={S.footer}>
                <span>Showing {filtered.length} of {projects.length} projects</span>
                <span>Source: Connected CMMS Project Status.xlsx · SharePoint · {lastUpdated?fmtTime(lastUpdated):"pending"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Debug Panel ── */}
        {debugLog && (
          <div style={{ ...S.section, paddingTop:16 }}>
            <button onClick={()=>setShowDebug(v=>!v)}
              style={{ fontSize:11, color:"#64748b", background:"#f1f5f9", border:"1px solid #e2e8f0",
                borderRadius:10, padding:"8px 12px", cursor:"pointer" }}>
              {showDebug?"▲ Hide":"▼ Show"} sync debug log
            </button>
            {showDebug && (
              <pre style={{ fontSize:11, color:"#1e293b", background:"#f8fafc", border:"1px solid #e2e8f0",
                borderRadius:16, padding:"14px 16px", marginTop:10, overflowX:"auto", lineHeight:1.6,
                whiteSpace:"pre-wrap", wordBreak:"break-word" }}>
                {debugLog}
              </pre>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
