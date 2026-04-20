import { useState, useEffect, useCallback, useMemo } from "react";

// ── Fallback data (parsed from SharePoint Apr 20 2026) ─────────────────────────
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

// ── Config ──────────────────────────────────────────────────────────────────────
const PHASES = ["Data Gathering","BRD Cycle","Configuration","Early Access Testing","UAT","Hypercare","Go-Live"];
const PHASE_META = {
  "Data Gathering":       { color:"#64748b", bg:"#64748b18", order:1 },
  "BRD Cycle":            { color:"#3b82f6", bg:"#3b82f618", order:2 },
  "Configuration":        { color:"#8b5cf6", bg:"#8b5cf618", order:3 },
  "Early Access Testing": { color:"#06b6d4", bg:"#06b6d418", order:4 },
  "UAT":                  { color:"#f59e0b", bg:"#f59e0b18", order:5 },
  "Hypercare":            { color:"#f97316", bg:"#f9731618", order:6 },
  "Go-Live":              { color:"#22c55e", bg:"#22c55e18", order:7 },
};
const RAG_META = {
  Green: { color:"#22c55e", bg:"#22c55e15", label:"On Track" },
  Amber: { color:"#f59e0b", bg:"#f59e0b15", label:"At Risk" },
  Red:   { color:"#ef4444", bg:"#ef444415", label:"Critical" },
};
const VERT_COLORS = { CRE:"#60a5fa", IFM:"#34d399", Hospital:"#f472b6", Retail:"#fb923c", Edu:"#a78bfa" };
const CACHE_KEY = "cmms-projects-v2";
const CACHE_TS  = "cmms-ts-v2";
const TWELVE_HRS = 12 * 60 * 60 * 1000;

// ── Helpers ─────────────────────────────────────────────────────────────────────
const fmtTime = (ts) => {
  if (!ts) return "Never";
  const d = new Date(ts);
  return d.toLocaleDateString("en-US", { month:"short", day:"numeric" }) + " " +
         d.toLocaleTimeString("en-US", { hour:"2-digit", minute:"2-digit" });
};

const RAGDot = ({ rag, size = 8 }) => (
  <span style={{ display:"inline-block", width:size, height:size, borderRadius:"50%",
    background: RAG_META[rag]?.color || "#888", flexShrink:0 }} />
);

const PhasePill = ({ phase }) => {
  const m = PHASE_META[phase] || { color:"#888", bg:"#88888818" };
  return (
    <span style={{ fontSize:11, fontWeight:500, padding:"2px 7px", borderRadius:4,
      color:m.color, background:m.bg, whiteSpace:"nowrap" }}>
      {phase}
    </span>
  );
};

const VertPill = ({ v }) => (
  <span style={{ fontSize:10, fontWeight:600, padding:"1px 6px", borderRadius:3,
    color: VERT_COLORS[v] || "#94a3b8", background:(VERT_COLORS[v]||"#94a3b8")+"18",
    letterSpacing:"0.03em" }}>
    {v}
  </span>
);

// ── Main ────────────────────────────────────────────────────────────────────────
export default function App() {
  const [projects, setProjects]     = useState(FALLBACK);
  const [syncing, setSyncing]       = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [syncMsg, setSyncMsg]       = useState(null);
  const [tab, setTab]               = useState("active");
  const [filters, setFilters]       = useState({ rag:"all", phase:"all", region:"all", search:"" });
  const [expanded, setExpanded]     = useState(null);
  const [sortKey, setSortKey]       = useState("account");
  const [sortDir, setSortDir]       = useState(1);
  const [debugLog, setDebugLog]     = useState(null);
  const [showDebug, setShowDebug]   = useState(false);

  // ── JSON extraction: multiple strategies ─────────────────────────────────────
  const extractJSON = (text) => {
    if (!text) return null;
    const clean = text.replace(/```json\s*/gi,"").replace(/```\s*/g,"").trim();
    // Strategy 1: direct parse
    try { const p=JSON.parse(clean); if(Array.isArray(p)&&p.length>0) return p; } catch {}
    // Strategy 2: greedy array-of-objects match
    const m2 = clean.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (m2) { try { const p=JSON.parse(m2[0]); if(Array.isArray(p)&&p.length>0) return p; } catch {} }
    // Strategy 3: any greedy [ ... ]
    const m3 = clean.match(/\[[\s\S]*\]/);
    if (m3) {
      try { const p=JSON.parse(m3[0]); if(Array.isArray(p)&&p.length>0) return p; } catch {
        // Strategy 4: repair truncated JSON
        const s = m3[0]; const repaired = s.replace(/,\s*\{[^}]*$/, "").replace(/,\s*$/, "") + "]";
        try { const p=JSON.parse(repaired); if(Array.isArray(p)&&p.length>0) return p; } catch {}
      }
    }
    return null;
  };

  // ── Live sync from SharePoint via Anthropic API + M365 MCP ──────────────────

  const sync = useCallback(async (force = false) => {
    setSyncing(true); setSyncMsg(null); setDebugLog(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          system:`You have SharePoint access via M365 tools.
Step 1: Call M365:read_resource with the URI: https://facilio958-my.sharepoint.com/:x:/g/personal/shivaraj_facilio_com/IQB6lxWOZaPkSLrCt_VqoDbNAf2PxvaWO5scW1KuVOAxTbg?e=ICNWZP
Step 2: Examine the Excel spreadsheet structure and identify column headers.
Step 3: Extract all rows where Status is "Active" or "Hypercare".
Step 4: Map the columns to our format. Look for these equivalent column names:
   - Account/Project Name: "Account", "Project", "Client", "Customer", etc.
   - Vertical: "Vertical", "Business Unit", "BU", "Type", etc.
   - Region: "Region", "Location", "Area", etc.
   - Phase: "Phase", "Stage", "Status", etc.
   - RAG: "RAG", "Status", "Risk", etc.
   - Status: "Status", "State", etc.
   - Lead/Manager: "Lead", "Manager", "Owner", "PM", etc.
   - Consultant: "Consultant", "Developer", "Engineer", etc.
   - Comments: "Comments", "Notes", "Description", etc.
Step 5: Respond with ONLY a JSON array. Your entire response must be NOTHING but the array starting with [ and ending with ].

Array format — each element: {"n":"account name","v":"vertical","r":"region","p":"phase","g":"Green|Amber|Red","s":"Active|Hypercare","l":"lead/manager name","co":"consultant name","c":"comments"}`,
          messages:[{ role:"user", content:"Read the Connected CMMS Project Status Excel file and extract project data. Map the actual column headers to our required format. Focus on projects with Active or Hypercare status. Return ONLY the JSON array with the mapped data." }],
          mcp_servers:[{ type:"url", url:"https://microsoft365.mcp.claude.com/mcp", name:"M365" }]
        })
      });
      const data = await res.json();
      const allBlocks = data.content || [];
      let parsed = null;
      let log = [];

      // Try text blocks (reverse = last text first)
      const textBlocks = allBlocks.filter(b=>b.type==="text");
      log.push(`Text blocks: ${textBlocks.length}`);
      for (const b of [...textBlocks].reverse()) {
        log.push(`Text[${b.text.length}]: ${b.text.substring(0,120)}...`);
        parsed = extractJSON(b.text);
        if (parsed) { log.push(`✓ Parsed ${parsed.length} projects from text block`); break; }
      }

      // Fallback: try mcp_tool_result blocks
      if (!parsed) {
        const toolResults = allBlocks.filter(b=>b.type==="mcp_tool_result");
        log.push(`Tool result blocks: ${toolResults.length}`);
        for (const tr of [...toolResults].reverse()) {
          const txt = (tr.content||[]).map(c=>c.text||"").join("\n");
          if (txt.length > 50) {
            log.push(`ToolResult[${txt.length}]: ${txt.substring(0,100)}...`);
            parsed = extractJSON(txt);
            if (parsed) { log.push(`✓ Parsed ${parsed.length} projects from tool result`); break; }
          }
        }
      }

      setDebugLog(log.join("\n"));

      if (Array.isArray(parsed) && parsed.length > 0) {
        const mapped = parsed.map(p => ({
          account: p.n||p.account||"Unknown", vertical: p.v||p.vertical||"",
          region: p.r||p.region||"", phase: p.p||p.phase||"",
          rag: p.g||p.rag||"Green", status: p.s||p.status||"Active",
          lead: p.l||p.lead||"", consultant: p.co||p.consultant||"",
          comments: p.c||p.comments||""
        }));
        setProjects(mapped);
        const ts = Date.now(); setLastUpdated(ts);
        try { await window.storage.set(CACHE_KEY, JSON.stringify(mapped)); await window.storage.set(CACHE_TS, String(ts)); } catch {}
        setSyncMsg({ ok:true, text:`Synced ${mapped.length} projects from SharePoint` });
      } else {
        setSyncMsg({ ok:false, text:"Parse failed — showing debug info", showDbg:true });
        setShowDebug(true);
      }
    } catch (e) {
      setSyncMsg({ ok:false, text:`Sync error: ${e.message}` });
      setDebugLog(`Exception: ${e.message}`);
      setShowDebug(true);
    } finally { setSyncing(false); }
  }, []);

  // ── Init: load cache or fetch ─────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const [c, t] = await Promise.all([window.storage.get(CACHE_KEY), window.storage.get(CACHE_TS)]);
        if (c && t && Date.now() - Number(t.value) < TWELVE_HRS) {
          setProjects(JSON.parse(c.value)); setLastUpdated(Number(t.value));
          setSyncMsg({ ok:true, text:"Loaded from cache — auto-sync in " + Math.round((TWELVE_HRS - (Date.now()-Number(t.value)))/3600000) + "h" });
          return;
        }
      } catch {}
      sync();
    })();
    const iv = setInterval(() => sync(), TWELVE_HRS);
    return () => clearInterval(iv);
  }, [sync]);

  // ── Computed ──────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const live = projects.filter(p => p.status !== "Transitioned");
    const active = projects.filter(p => p.status === "Active");
    const hyp = projects.filter(p => p.status === "Hypercare");
    return {
      active: active.length, hypercare: hyp.length,
      green:  live.filter(p=>p.rag==="Green").length,
      amber:  live.filter(p=>p.rag==="Amber").length,
      red:    live.filter(p=>p.rag==="Red").length,
      phase: Object.fromEntries(PHASES.map(ph=>[ph, live.filter(p=>p.phase===ph).length])),
      regions: [...new Set(live.map(p=>p.region))].sort()
    };
  }, [projects]);

  const filtered = useMemo(() => {
    const statusMap = { active:["Active"], hypercare:["Hypercare"] };
    return projects.filter(p => {
      if (!(statusMap[tab]||[]).includes(p.status)) return false;
      if (filters.rag!=="all" && p.rag!==filters.rag) return false;
      if (filters.phase!=="all" && p.phase!==filters.phase) return false;
      if (filters.region!=="all" && p.region!==filters.region) return false;
      if (filters.search) {
        const q=filters.search.toLowerCase();
        return [p.account,p.region,p.lead,p.consultant,p.comments].some(v=>(v||"").toLowerCase().includes(q));
      }
      return true;
    }).sort((a,b) => {
      const av=a[sortKey]||"", bv=b[sortKey]||"";
      return av.localeCompare(bv)*sortDir;
    });
  }, [projects, filters, tab, sortKey, sortDir]);

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
          { num:stats.active,     label:"Active Projects",   color:"#60a5fa" },
          { num:stats.green,      label:"On Track (Green)",  color:"#22c55e" },
          { num:stats.amber,      label:"At Risk (Amber)",   color:"#f59e0b" },
          { num:stats.red,        label:"Critical (Red)",    color:"#ef4444" },
          { num:stats.hypercare,  label:"In Hypercare",      color:"#f97316" },
        ].map(({num,label,color})=>(
          <div key={label} style={S.kpi}>
            <div style={{...S.kpiNum, color}}>{num}</div>
            <div style={S.kpiLbl}>{label}</div>
          </div>
        ))}
      </div>

      {/* ── Phase Pipeline ── */}
      <div style={S.section}>
        <div style={S.sectionTitle}>Implementation pipeline</div>
        <div style={S.pipeline}>
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
      </div>

      {/* ── Tabs + Filters ── */}
      <div style={{ ...S.section, paddingTop:20 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12, flexWrap:"wrap", gap:10 }}>
          <div style={S.tabs}>
            {[["active","Active","in Implementation"],["hypercare","Hypercare","post Go-Live"]].map(([k,l,s])=>(
              <button key={k} style={S.tab(tab===k)} onClick={()=>setTab(k)}>
                {l} <span style={S.count}>
                  {k==="active"?stats.active:stats.hypercare}
                </span>
              </button>
            ))}
          </div>
          <div style={S.filters}>
            <select style={S.sel} value={filters.rag} onChange={e=>setFilter("rag",e.target.value)}>
              <option value="all">All RAG</option>
              <option value="Green">🟢 On Track</option>
              <option value="Amber">🟡 At Risk</option>
              <option value="Red">🔴 Critical</option>
            </select>
            <select style={S.sel} value={filters.phase} onChange={e=>setFilter("phase",e.target.value)}>
              <option value="all">All Phases</option>
              {PHASES.map(p=><option key={p} value={p}>{p}</option>)}
            </select>
            <select style={S.sel} value={filters.region} onChange={e=>setFilter("region",e.target.value)}>
              <option value="all">All Regions</option>
              {stats.regions.map(r=><option key={r} value={r}>{r}</option>)}
            </select>
            <input style={S.search} placeholder="Search projects, leads, regions…"
              value={filters.search} onChange={e=>setFilter("search",e.target.value)} />
            {(filters.rag!=="all"||filters.phase!=="all"||filters.region!=="all"||filters.search) &&
              <button style={{...S.sel,cursor:"pointer",color:"#ef4444"}}
                onClick={()=>setFilters({rag:"all",phase:"all",region:"all",search:""})}>
                Clear ×
              </button>}
          </div>
        </div>

        {/* ── Table ── */}
        <div style={{ border:"1px solid #1a2540", borderRadius:10, overflow:"hidden" }}>
          <table style={S.table}>
            <thead>
              <tr>
                <TH k="account"    label="Account" />
                <TH k="vertical"   label="Vertical" />
                <TH k="region"     label="Region" />
                <TH k="phase"      label="Phase" />
                <TH k="rag"        label="RAG" />
                <TH k="lead"       label="Lead" />
                <TH k="consultant" label="Consultant" />
                <th style={S.th(false)}>Latest Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} style={S.empty}>No projects match the current filters.</td></tr>
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
                    <td style={S.td}><VertPill v={p.vertical} /></td>
                    <td style={{...S.td, color:"#94a3b8"}}>{p.region}</td>
                    <td style={S.td}><PhasePill phase={p.phase} /></td>
                    <td style={S.td}>
                      <span style={S.badge(rag.color, rag.bg)}>
                        <RAGDot rag={p.rag} /> {p.rag}
                      </span>
                    </td>
                    <td style={{...S.td, color:"#94a3b8"}}>{p.lead||"—"}</td>
                    <td style={{...S.td, color:"#64748b", fontSize:12}}>{p.consultant||"—"}</td>
                    <td style={{...S.td, color:"#64748b", fontSize:12, maxWidth:220}}>
                      <span style={{display:"block",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                        {p.comments||"—"}
                      </span>
                    </td>
                  </tr>,
                  isExp && (
                    <tr key={p.account+"-exp"} style={S.expRow}>
                      <td colSpan={8} style={{ padding:"14px 24px" }}>
                        <div style={{ display:"flex", gap:32, flexWrap:"wrap" }}>
                          <div>
                            <div style={{ fontSize:10, color:"#475569", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:4 }}>Full Status</div>
                            <div style={{ fontSize:13, color:"#94a3b8", maxWidth:480, lineHeight:1.6 }}>{p.comments||"No comments."}</div>
                          </div>
                          <div style={{ display:"flex", gap:24 }}>
                            {[["Phase",p.phase],["Vertical",p.vertical],["Region",p.region],["Lead",p.lead],["Consultant",p.consultant]].map(([k,v])=>(
                              <div key={k}>
                                <div style={{ fontSize:10, color:"#475569", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:3 }}>{k}</div>
                                <div style={{ fontSize:13, color:"#e2e8f0", fontWeight:500 }}>{v||"—"}</div>
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
            <span>Showing {filtered.length} of {projects.filter(p=>["Active","Hypercare"][tab]==="Active"?p.status==="Active":p.status==="Hypercare").length} {tab} projects</span>
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
