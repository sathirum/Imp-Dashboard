import { useState, useEffect, useCallback, useMemo } from "react";
import * as XLSX from "xlsx";

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
  "Requirement Gathering": { color:"#64748b", bg:"#64748b15" },
  "Configuration":         { color:"#f59e0b", bg:"#f59e0b15" },
  "UAT":                   { color:"#22c55e", bg:"#22c55e15" },
  "Hypercare":             { color:"#f97316", bg:"#f9731615" },
  "Transitioned to support": { color:"#8b5cf6", bg:"#8b5cf615" }
};

const RAG_META = {
  "Green": { color:"#22c55e", bg:"#22c55e15" },
  "Amber": { color:"#f59e0b", bg:"#f59e0b15" },
  "Red": { color:"#ef4444", bg:"#ef444415" }
};

const TWELVE_HRS = 12 * 60 * 60 * 1000;

const VertPill = ({ v }) => {
  const meta = { "CMMS": { color:"#00c49f", bg:"#00c49f15" }, "EAM": { color:"#0088cc", bg:"#0088cc15" }, "Other": { color:"#64748b", bg:"#64748b15" } };
  const m = meta[v] || meta.Other;
  return <span style={{ fontSize:11, fontWeight:500, padding:"2px 8px", borderRadius:12, color:m.color, background:m.bg }}>{v||"—"}</span>;
};

const PhasePill = ({ phase }) => {
  const m = PHASE_META[phase] || { color:"#64748b", bg:"#64748b15" };
  return <span style={{ fontSize:11, fontWeight:500, padding:"2px 8px", borderRadius:12, color:m.color, background:m.bg }}>{phase||"—"}</span>;
};

const RAGDot = ({ rag }) => {
  const m = RAG_META[rag] || RAG_META.Green;
  return <span style={{ width:8, height:8, borderRadius:4, background:m.color, display:"inline-block" }}></span>;
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
  const [debugLog, setDebugLog]     = useState(null);
  const [showDebug, setShowDebug]   = useState(false);

  // ── Live sync from SharePoint Excel ──────────────────

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

      // Assume first row is headers
      const headers = json[0].map(h => (h || "").toLowerCase().trim());
      const rows = json.slice(1);

      // Map columns (flexible matching)
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

  // ── Init: always fetch fresh data ─────────────────────────────────────────────
  useEffect(() => {
    sync();
    const iv = setInterval(() => sync(), TWELVE_HRS);
    return () => clearInterval(iv);
  }, [sync]);

  // ── Computed ──────────────────────────────────────────────────────────────────
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
    wrap:  { fontFamily:"'DM Sans', system-ui, sans-serif", background:"#040916", minHeight:"100vh",
             color:"#e2e8f0", padding:"0 0 40px" },
    header:{ background:"#070d1f", borderBottom:"1px solid #1a2540", padding:"16px 24px",
             display:"flex", alignItems:"center", justifyContent:"space-between" },
    brand: { display:"flex", alignItems:"center", gap:10 },
    logo:  { width:32, height:32, borderRadius:8, background:"linear-gradient(135deg,#00c49f,#0088cc)",
             display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700 },
    title: { fontSize:16, fontWeight:600, color:"#f1f5f9", letterSpacing:"-0.01em" },
    sub:   { fontSize:12, color:"#64748b", marginTop:1 },
    syncBtn:{ background: syncing?"#1e293b":"#00c49f15", border:"1px solid " + (syncing?"#334155":"#00c49f40"),
              color: syncing?"#64748b":"#00c49f", borderRadius:7, padding:"7px 14px", fontSize:12,
              fontWeight:500, cursor: syncing?"not-allowed":"pointer", display:"flex", alignItems:"center", gap:6 },
    kpiRow:{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12, padding:"20px 24px 0" },
    kpi:   { background:"#070d1f", border:"1px solid #1a2540", borderRadius:10, padding:"14px 16px" },
    kpiNum:{ fontSize:28, fontWeight:700, lineHeight:1, letterSpacing:"-0.02em" },
    kpiLbl:{ fontSize:11, color:"#64748b", marginTop:4, fontWeight:500, letterSpacing:"0.03em", textTransform:"uppercase" },
    section:{ padding:"20px 24px 0" },
    sectionTitle:{ fontSize:11, color:"#64748b", fontWeight:600, letterSpacing:"0.06em",
                   textTransform:"uppercase", marginBottom:10 },
    pipeline:{ display:"flex", gap:8, alignItems:"stretch", overflowX:"auto" },
    pipeItem:{ flex:"1 1 0", minWidth:80, background:"#070d1f", border:"1px solid #1a2540",
               borderRadius:8, padding:"10px 12px", cursor:"pointer", transition:"border-color 0.15s" },
    pipeCount:{ fontSize:22, fontWeight:700, letterSpacing:"-0.02em" },
    pipeLabel:{ fontSize:10, color:"#64748b", fontWeight:500, marginTop:2, lineHeight:1.3 },
    tabs:  { display:"flex", gap:2, background:"#070d1f", borderRadius:8, padding:3,
             border:"1px solid #1a2540" },
    tab:   (active) => ({ padding:"7px 16px", borderRadius:6, fontSize:13, fontWeight:500,
             cursor:"pointer", transition:"all 0.15s",
             background: active?"#1e293b":"transparent",
             color: active?"#f1f5f9":"#64748b", border:"none" }),
    filters:{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" },
    sel:   { background:"#070d1f", border:"1px solid #1a2540", color:"#94a3b8", borderRadius:7,
             padding:"7px 10px", fontSize:12, outline:"none" },
    search:{ background:"#070d1f", border:"1px solid #1a2540", color:"#e2e8f0", borderRadius:7,
             padding:"7px 12px", fontSize:13, outline:"none", flex:1, minWidth:160 },
    table: { width:"100%", borderCollapse:"collapse", fontSize:13 },
    th:    (active) => ({ padding:"9px 12px", textAlign:"left", fontSize:11, fontWeight:600,
             letterSpacing:"0.04em", textTransform:"uppercase", color: active?"#00c49f":"#475569",
             background:"#070d1f", borderBottom:"1px solid #1a2540", cursor:"pointer", whiteSpace:"nowrap" }),
    tr:    (i,exp) => ({ background: exp?"#0d1830":(i%2===0?"#040916":"#070d1f"),
             borderBottom:"1px solid #0d1829", cursor:"pointer", transition:"background 0.1s" }),
    td:    { padding:"10px 12px", verticalAlign:"middle" },
    expRow:{ background:"#0a1428", borderBottom:"1px solid #1a2540" },
    badge: (color,bg) => ({ fontSize:11, fontWeight:500, padding:"2px 8px", borderRadius:12,
             color, background:bg, display:"inline-flex", alignItems:"center", gap:4 }),
    count: { fontSize:11, color:"#475569", marginLeft:4 },
    msg:   (ok) => ({ fontSize:12, color: ok?"#22c55e":"#f59e0b", display:"flex", alignItems:"center", gap:4 }),
    empty: { textAlign:"center", padding:"40px 20px", color:"#475569" },
  };

  const TH = ({ k, label }) => (
    <th style={S.th(sortKey===k)} onClick={()=>toggleSort(k)}>
      {label} {sortKey===k ? (sortDir===1?"↑":"↓") : ""}
    </th>
  );

  return (
    <div style={S.wrap}>
      {/* ── Load DM Sans ── */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *{box-sizing:border-box} input::placeholder{color:#334155}
        select option{background:#0d1829;color:#e2e8f0}
        tr:hover td{background:#0a1428!important}
        .pipe-item:hover{border-color:#00c49f40!important}`}
      </style>

      {/* ── Header ── */}
      <div style={S.header}>
        <div style={S.brand}>
          <div style={S.logo}>F</div>
          <div>
            <div style={S.title}>Connected CMMS · Implementation Dashboard</div>
            <div style={S.sub}>
              {lastUpdated ? `Last synced: ${fmtTime(lastUpdated)}` : "Syncing…"} · Auto-refreshes every 12 hrs
            </div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          {syncMsg && <div style={S.msg(syncMsg.ok)}>{syncMsg.ok?"✓":"⚠"} {syncMsg.text}</div>}
          <button style={S.syncBtn} onClick={()=>sync(true)} disabled={syncing}>
            {syncing ? <span style={{ display:"inline-block", animation:"spin 1s linear infinite" }}>↻</span> : "↻"}
            {syncing ? "Syncing…" : "Sync Now"}
          </button>
        </div>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>

      {/* ── KPI Cards ── */}
      <div style={S.kpiRow}>
        {[
          { num:stats.total,      label:"Total Projects",    color:"#60a5fa", onClick: () => setFilters({rag:"all",phase:"all",region:"all",lead:"all",vertical:"all",search:""}) },
          { num:stats.green,      label:"On Track (Green)",  color:"#22c55e", onClick: () => setFilter("rag", filters.rag === "Green" ? "all" : "Green") },
          { num:stats.amber,      label:"At Risk (Amber)",   color:"#f59e0b", onClick: () => setFilter("rag", filters.rag === "Amber" ? "all" : "Amber") },
          { num:stats.red,        label:"Critical (Red)",    color:"#ef4444", onClick: () => setFilter("rag", filters.rag === "Red" ? "all" : "Red") },
        ].map(({num,label,color,onClick})=>(
          <div key={label} style={{...S.kpi, cursor: onClick ? "pointer" : "default"}} onClick={onClick}>
            <div style={{...S.kpiNum, color}}>{num}</div>
            <div style={S.kpiLbl}>{label}</div>
          </div>
        ))}
      </div>

      {/* ── Phase Pipeline ── */}
      <div style={S.section}>
        <div style={S.sectionTitle}>Implementation pipeline</div>
<div style={{...S.pipeline, display:"flex", flexDirection:"column", gap:16 }}>
          {/* Phase cards */}
          <div style={{display:"flex", gap:8, alignItems:"center", overflowX:"auto"}}>
            {PHASES.map(ph => {
              const m = PHASE_META[ph]; const count = stats.phase[ph]||0;
              const active = filters.phase===ph;
              return (
                <div key={ph} className="pipe-item" style={{
                  ...S.pipeItem,
                  borderColor: active ? m.color : "#1a2540",
                  background: active ? m.bg : "#070d1f"
                }} onClick={()=>setFilter("phase", active?"all":ph)}>
                  <div style={{...S.pipeCount, color:m.color}}>{count}</div>
                  <div style={S.pipeLabel}>{ph}</div>
                </div>
              );
            })}
          </div>
          {/* Filters positioned below the cards */}
          <div style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
            flexWrap: "wrap"
          }}>
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
              <button style={{...S.sel,cursor:"pointer",color:"#ef4444"}}
                onClick={()=>setFilters({rag:"all",phase:"all",region:"all",lead:"all",vertical:"all",search:""})}>
                Clear ×
              </button>}
          </div>
      </div>


        <div style={{ border:"1px solid #1a2540", borderRadius:10, overflow:"hidden" }}>
          <table style={S.table}>
            <thead>
              <tr>
                <TH k="account"    label="Account" />
                <TH k="phase"      label="Phase" />
                <TH k="lead"       label="Manager" />
                <TH k="vertical"   label="Vertical" />
                <TH k="region"     label="Region" />
                <TH k="plannedGoLive" label="Planned Go-Live" />
                <TH k="actualGoLive"  label="Actual Go-Live" />
                <TH k="consultant" label="Consultant/S" />
                <TH k="rag"        label="RAG" />
                <TH k="comments"   label="Latest Status" />
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
                    <td style={{...S.td, fontWeight:500, color:"#f1f5f9"}}>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <span style={{color:"#334155",fontSize:10}}>{isExp?"▼":"▶"}</span>
                        {p.account}
                      </div>
                    </td>
                    <td style={S.td}><PhasePill phase={p.phase} /></td>
                    <td style={{...S.td, color:"#94a3b8"}}>{p.lead||"—"}</td>
                    <td style={S.td}><VertPill v={p.vertical} /></td>
                    <td style={{...S.td, color:"#94a3b8"}}>{p.region}</td>
                    <td style={{...S.td, color:"#94a3b8"}}>{p.plannedGoLive||"—"}</td>
                    <td style={{...S.td, color:"#94a3b8"}}>{p.actualGoLive||"—"}</td>
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
                            <div style={{ fontSize:10, color:"#475569", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:4 }}>Full Status</div>
                            <div style={{ fontSize:13, color:"#94a3b8", maxWidth:480, lineHeight:1.6 }}>{p.comments||"No comments."}</div>
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
                                <div style={{ fontSize:10, color:"#475569", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:3 }}>{k}</div>
                                <div style={{ fontSize:13, color:"#e2e8f0", fontWeight:500 }}>{v||"—"}</div>
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
                                <div style={{ fontSize:10, color:"#475569", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:3 }}>{k}</div>
                                <div style={{ fontSize:13, color:"#e2e8f0", fontWeight:500 }}>
                                  {v ? <a href={v} target="_blank" rel="noopener noreferrer" style={{color:"#00c49f"}}>Link</a> : "—"}
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
          <div style={{ padding:"10px 16px", background:"#070d1f", borderTop:"1px solid #1a2540",
            fontSize:11, color:"#334155", display:"flex", justifyContent:"space-between" }}>
            <span>Showing {filtered.length} of {projects.length} projects</span>
            <span>Source: Connected CMMS Project Status.xlsx · SharePoint · {lastUpdated?fmtTime(lastUpdated):"pending"}</span>
          </div>
        </div>
      </div>

      {/* ── Debug Panel ── */}
      {debugLog && (
        <div style={{ ...S.section, paddingTop:16 }}>
          <button onClick={()=>setShowDebug(v=>!v)}
            style={{ fontSize:11, color:"#475569", background:"none", border:"1px solid #1a2540",
              borderRadius:5, padding:"4px 10px", cursor:"pointer" }}>
            {showDebug?"▲ Hide":"▼ Show"} sync debug log
          </button>
          {showDebug && (
            <pre style={{ fontSize:11, color:"#64748b", background:"#070d1f", border:"1px solid #1a2540",
              borderRadius:8, padding:"12px 14px", marginTop:8, overflowX:"auto", lineHeight:1.6,
              whiteSpace:"pre-wrap", wordBreak:"break-word" }}>
              {debugLog}
            </pre>
          )}
        </div>
      )}

      {/* ── Regional Summary ── */}
      <div style={S.section}>
        <div style={S.sectionTitle}>Projects by region</div>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          {Object.entries(
            projects.filter(p=>p.status!=="Transitioned").reduce((acc,p)=>{
              acc[p.region] = (acc[p.region]||{G:0,A:0,R:0});
              acc[p.region][p.rag[0]]++; return acc;
            }, {})
          ).sort((a,b)=>Object.values(b[1]).reduce((s,v)=>s+v,0)-Object.values(a[1]).reduce((s,v)=>s+v,0))
          .map(([reg,counts]) => (
            <div key={reg} style={{ background:"#070d1f", border:"1px solid #1a2540", borderRadius:8,
              padding:"10px 14px", minWidth:100 }}>
              <div style={{ fontSize:11, color:"#64748b", marginBottom:6, fontWeight:600 }}>{reg}</div>
              <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                {counts.G>0 && <span style={S.badge("#22c55e","#22c55e15")}><RAGDot rag="Green"/>{counts.G}</span>}
                {counts.A>0 && <span style={S.badge("#f59e0b","#f59e0b15")}><RAGDot rag="Amber"/>{counts.A}</span>}
                {counts.R>0 && <span style={S.badge("#ef4444","#ef444415")}><RAGDot rag="Red"/>{counts.R}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
