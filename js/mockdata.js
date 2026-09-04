/**
 * eRTMAC-NWIS | Route Nexus - Mock Data Engine
 * Smart India Hackathon 2026 - Problem Statement SIH26121
 * Realistic Dataset for Oil India Limited (OIL), ONGC & Global Drilling Ops
 */

(function() {
  const FORMATIONS = [
    { name: "Barail Sandstone", type: "Reservoir Sandstone", avgPorePressure: 11.2, fractureGradient: 15.8, commonHazards: ["Differential Sticking", "Loss of Circulation"] },
    { name: "Tipam Group", type: "Coarse Sandstone / Silt", avgPorePressure: 9.8, fractureGradient: 14.2, commonHazards: ["Lost Circulation", "Bit Balling"] },
    { name: "Surma Series", type: "Interbedded Shale / Sand", avgPorePressure: 10.4, fractureGradient: 14.9, commonHazards: ["Tight Hole", "Sloughing Shale"] },
    { name: "Kopili Shale", type: "Reactive Marine Shale", avgPorePressure: 12.8, fractureGradient: 16.5, commonHazards: ["Swelling Shale", "Wellbore Instability", "Stuck Pipe"] },
    { name: "Sylhet Limestone", type: "Hard Fractured Carbonate", avgPorePressure: 11.0, fractureGradient: 16.2, commonHazards: ["Severe Loss of Circulation", "Vibration / Bit Damage"] },
    { name: "Girujan Clay", type: "High Plasticity Claystone", avgPorePressure: 9.5, fractureGradient: 13.8, commonHazards: ["Washouts", "Mud Contamination"] },
    { name: "Jaintia Group", type: "Deep Carbonate / Sand", avgPorePressure: 13.6, fractureGradient: 17.4, commonHazards: ["High Pressure Gas Kick", "Thermal Degradation"] }
  ];

  const BASINS = [
    { name: "Assam-Arakan Basin", block: "AA-ONHP-2018/1 (Upper Assam Shelf)", baseLat: 27.28, baseLng: 95.32, operator: "Oil India Limited (OIL)" },
    { name: "Cambay Basin", block: "CB-ONHP-2017/2 (Gujarat)", baseLat: 21.65, baseLng: 72.98, operator: "ONGC" },
    { name: "Krishna-Godavari Basin", block: "KG-DWN-98/2 (Offshore/Onshore)", baseLat: 16.48, baseLng: 82.15, operator: "ONGC / eRTMAC Joint" },
    { name: "Rajasthan Basin", block: "RJ-ON-90/1 (Barmer)", baseLat: 25.75, baseLng: 71.40, operator: "Oil India / Joint Venture" }
  ];

  const FIELD_NAMES = [
    "Naharkatiya", "Moran", "Jorajan", "Baghjan Deep", "Dikom", "Kusijan",
    "Shalmari", "Chandmari", "Tengakhat", "Makum", "Hapjan", "Borbil",
    "Ankleshwar", "Gandhar", "Mehsana", "KG-East", "Duliajan Hub", "Digboi"
  ];

  const RISK_TYPES = [
    { name: "Differential Sticking", severity: "High", color: "#f43f5e" },
    { name: "Loss of Circulation", severity: "High", color: "#f43f5e" },
    { name: "Gas Kick Warning", severity: "Critical", color: "#ef4444" },
    { name: "Tight Hole / Swelling Shale", severity: "Medium", color: "#f59e0b" },
    { name: "Bit Balling & Premature Wear", severity: "Medium", color: "#f59e0b" },
    { name: "Abnormal Pore Pressure Ramp", severity: "High", color: "#f43f5e" },
    { name: "Optimal Drilling Zone", severity: "Low", color: "#10b981" }
  ];

  const STATUSES = ["Drilling", "Drilling", "Drilling", "Tripping", "Casing", "Logging", "Cementing", "Standby"];

  // 1. Generate 20 Real Engineers
  const ENGINEERS = [
    { id: "ENG-01", name: "Dr. Vikramaditya Barua", role: "Chief Drilling Superintendent", exp: "22 yrs", org: "Oil India Limited (OIL)", contact: "v.barua@oilindia.in", avatar: "VB" },
    { id: "ENG-02", name: "Smt. Priyanka Sen", role: "Lead MWD/LWD Specialist", exp: "14 yrs", org: "Oil India Limited (OIL)", contact: "p.sen@oilindia.in", avatar: "PS" },
    { id: "ENG-03", name: "Rajesh K. Saikia", role: "eRTMAC Remote Operations Head", exp: "18 yrs", org: "Oil India eRTMAC Centre", contact: "rk.saikia@ertmac.in", avatar: "RS" },
    { id: "ENG-04", name: "Ananya Deshmukh", role: "Senior Geomechanics Engineer", exp: "11 yrs", org: "ONGC Petrotech", contact: "a.deshmukh@ongc.co.in", avatar: "AD" },
    { id: "ENG-05", name: "Farhan A. Qureshi", role: "Directional Drilling Specialist", exp: "16 yrs", org: "Halliburton Landmark", contact: "farhan.q@halliburton.com", avatar: "FQ" },
    { id: "ENG-06", name: "Tapan Jyoti Gogoi", role: "Senior Mud / Fluids Engineer", exp: "15 yrs", org: "Oil India Limited (OIL)", contact: "tj.gogoi@oilindia.in", avatar: "TG" },
    { id: "ENG-07", name: "Kavita R. Nair", role: "AI Decision Intelligence Lead", exp: "9 yrs", org: "Route Nexus AI", contact: "kavita@routenexus.ai", avatar: "KN" },
    { id: "ENG-08", name: "Amitabh Banerjee", role: "Well Planning Specialist", exp: "17 yrs", org: "Schlumberger (SLB)", contact: "abanerjee@slb.com", avatar: "AB" },
    { id: "ENG-09", name: "Debojit Hazarika", role: "Formation Evaluation Lead", exp: "13 yrs", org: "Oil India Limited (OIL)", contact: "d.hazarika@oilindia.in", avatar: "DH" },
    { id: "ENG-10", name: "Meera Krishnan", role: "Rig Safety & HSE Director", exp: "19 yrs", org: "Directorate General of Hydrocarbons", contact: "meera.k@dgh.gov.in", avatar: "MK" },
    { id: "ENG-11", name: "Bikash Phukan", role: "Drilling Automation Engineer", exp: "8 yrs", org: "Oil India eRTMAC Centre", contact: "b.phukan@ertmac.in", avatar: "BP" },
    { id: "ENG-12", name: "Sunil V. Pillai", role: "Rig Superintendent (Offshore)", exp: "24 yrs", org: "ONGC Offshore", contact: "sv.pillai@ongc.co.in", avatar: "SP" },
    { id: "ENG-13", name: "Tridip Borah", role: "Senior Petrophysicist", exp: "12 yrs", org: "Oil India Limited (OIL)", contact: "t.borah@oilindia.in", avatar: "TB" },
    { id: "ENG-14", name: "Smriti Rao", role: "Data Scientist - Subsurface NLP", exp: "7 yrs", org: "Route Nexus Labs", contact: "smriti@routenexus.ai", avatar: "SR" },
    { id: "ENG-15", name: "Manash Pratim Sarma", role: "Mud Logging Unit Coordinator", exp: "10 yrs", org: "Oil India Limited (OIL)", contact: "mp.sarma@oilindia.in", avatar: "MS" },
    { id: "ENG-16", name: "Gurpreet Singh", role: "Drillstring Mechanics Specialist", exp: "15 yrs", org: "Baker Hughes Inteq", contact: "g.singh@bakerhughes.com", avatar: "GS" },
    { id: "ENG-17", name: "Nabanita Das", role: "Pore Pressure Prediction Lead", exp: "11 yrs", org: "Oil India Limited (OIL)", contact: "n.das@oilindia.in", avatar: "ND" },
    { id: "ENG-18", name: "Arunav Chaliha", role: "Field Drilling Technologist", exp: "14 yrs", org: "eRTMAC Duliajan", contact: "a.chaliha@ertmac.in", avatar: "AC" },
    { id: "ENG-19", name: "Pooja Reddy", role: "Geospatial GIS Analyst", exp: "8 yrs", org: "Route Nexus Spatial", contact: "pooja.r@routenexus.ai", avatar: "PR" },
    { id: "ENG-20", name: "Jatin Baruah", role: "Rig Operations Control Engineer", exp: "16 yrs", org: "Oil India Limited (OIL)", contact: "j.baruah@oilindia.in", avatar: "JB" }
  ];

  // 2. Generate 100 Realistic Wells
  const WELLS = [];
  for (let i = 1; i <= 100; i++) {
    const basin = BASINS[i % BASINS.length];
    const field = FIELD_NAMES[(i * 7) % FIELD_NAMES.length];
    const formObj = FORMATIONS[(i * 3) % FORMATIONS.length];
    const status = STATUSES[i % STATUSES.length];
    const targetDepth = 3200 + ((i * 37) % 2400); // 3200 to 5600m
    const currentDepth = status === "Standby" 
      ? targetDepth 
      : Math.floor(targetDepth * (0.35 + ((i * 13) % 60) / 100)); // realistic drilled depth

    const rop = Number((8.5 + ((i * 17) % 220) / 10).toFixed(1)); // 8.5 to 30.5 m/hr
    const mudWeight = Number((9.2 + ((i * 7) % 45) / 10).toFixed(1)); // 9.2 to 13.7 PPG
    const riskType = RISK_TYPES[(i * 5) % RISK_TYPES.length];
    const riskScore = riskType.severity === "Critical" ? 85 + (i % 14) : (riskType.severity === "High" ? 68 + (i % 16) : (riskType.severity === "Medium" ? 42 + (i % 22) : 12 + (i % 25)));
    const aiConfidence = 89 + ((i * 11) % 10);

    // Realistic coordinates distributed around basin center
    const latOffset = ((Math.sin(i * 12.5) * 0.15)).toFixed(4);
    const lngOffset = ((Math.cos(i * 14.8) * 0.18)).toFixed(4);
    const lat = Number((basin.baseLat + parseFloat(latOffset)).toFixed(4));
    const lng = Number((basin.baseLng + parseFloat(lngOffset)).toFixed(4));

    // ID styling like PPT: NST6001, NST6002, OIL-BG-12, etc.
    const id = i <= 25 
      ? `NST60${String(i).padStart(2, '0')}`
      : (i <= 60 ? `OIL-${field.substring(0, 3).toUpperCase()}-${String(i).padStart(2, '0')}` : `ONG-${field.substring(0, 3).toUpperCase()}-${String(i).padStart(2, '0')}`);

    const engineer = ENGINEERS[i % ENGINEERS.length];

    // Correlated offset wells
    const offsetCandidates = [
      `NST60${String((i % 25) + 1).padStart(2, '0')}`,
      `OIL-${FIELD_NAMES[(i + 1) % FIELD_NAMES.length].substring(0, 3).toUpperCase()}-0${(i % 9) + 1}`,
      `OIL-${FIELD_NAMES[(i + 2) % FIELD_NAMES.length].substring(0, 3).toUpperCase()}-1${(i % 9) + 1}`
    ];

    WELLS.push({
      id,
      name: `${field}-${i + 10}`,
      operator: basin.operator,
      basin: basin.name,
      block: basin.block,
      field,
      currentDepth,
      targetDepth,
      formation: formObj.name,
      formationType: formObj.type,
      status,
      rop,
      mudWeight,
      wob: 14 + (i % 16), // Weight on Bit (k-lbs)
      rpm: 95 + ((i * 3) % 75), // Rotational speed
      torque: 8.5 + ((i * 2) % 12), // kft-lbs
      standpipePressure: 2800 + ((i * 45) % 1400), // psi
      flowRate: 550 + ((i * 15) % 350), // gpm
      riskScore,
      riskLevel: riskType.severity,
      primaryRisk: riskType.name,
      riskColor: riskType.color,
      aiConfidence,
      engineer: engineer.name,
      engineerRole: engineer.role,
      rigName: `Rig eRTMAC-${(i % 8) + 1} (2000 HP)`,
      lat,
      lng,
      offsetWells: offsetCandidates,
      spudDate: `2025-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
      lastLogUpdate: `${(i % 48) + 1} mins ago`,
      lithologyLog: [
        { depth: 0, formation: "Alluvium & Dhekiajuli Sand", litho: "Sand / Gravel" },
        { depth: 950, formation: "Girujan Clay", litho: "Plastic Claystone" },
        { depth: 1850, formation: "Tipam Group", litho: "Sandstone / Silty Sand" },
        { depth: 2750, formation: "Surma Series", litho: "Shale Interbeds" },
        { depth: 3400, formation: "Barail Sandstone", litho: "Pay Zone Quartzite" },
        { depth: 4200, formation: "Kopili Shale", litho: "Hard Overpressured Shale" }
      ]
    });
  }

  // 3. Generate 50 Rich Alerts
  const ALERTS = [];
  const ALERT_TEMPLATES = [
    { title: "Offset Differential Sticking Imminent", type: "Critical", icon: "alert-triangle", action: "Increase pipe rotation to 120 RPM, spot lubricant pill, limit static time to <3 mins." },
    { title: "Kopili Shale Swelling & Sloughing Detected", type: "High", icon: "activity", action: "Raise mud weight by 0.4 PPG (to 12.6 PPG) and condition drilling fluid with KCl-glycol." },
    { title: "Pore Pressure Transition Ramp (+1.2 PPG EMW)", type: "Critical", icon: "zap", action: "Flow check immediately. Calibrate mud logging gas sensors and stage casing seat." },
    { title: "Severe Mud Loss Alert in Fractured Sylhet", type: "High", icon: "droplet", action: "Prepare 40 bbl LCM (Lost Circulation Material) pill with coarse calcium carbonate." },
    { title: "Bit Vibration (Stick-Slip Index > 70%)", type: "Warning", icon: "cpu", action: "Decrease Weight on Bit (WOB) by 4 klbs, increase rotary speed to 110 RPM." },
    { title: "BHA Magnetic Interference at Deviation 14°", type: "Info", icon: "compass", action: "Perform multi-station survey correction utilizing offset trajectory profile." },
    { title: "Abnormal Gas Influx from Surma Transition", type: "Critical", icon: "flame", action: "Execute Soft Shut-In protocol. Monitor drill pipe and annular shut-in pressures." },
    { title: "Washout Signature Detected on Standpipe Pressure", type: "Warning", icon: "disc", action: "Inspect drill pipe tool joints and mud pump liner seals on next connection." }
  ];

  for (let i = 1; i <= 50; i++) {
    const tmpl = ALERT_TEMPLATES[i % ALERT_TEMPLATES.length];
    const well = WELLS[(i * 3) % WELLS.length];
    ALERTS.push({
      id: `ALT-2026-${String(i).padStart(3, '0')}`,
      title: `${tmpl.title} (${well.id})`,
      severity: tmpl.type,
      wellId: well.id,
      wellName: well.name,
      formation: well.formation,
      depth: `${well.currentDepth} m`,
      timestamp: `${(i * 14) % 180}m ago`,
      details: `ML offset correlation model detected 94% pattern match with offset incidents in ${well.field} field during ${well.formation} penetration.`,
      recommendedAction: tmpl.action,
      status: i <= 5 ? "Unacknowledged" : (i <= 18 ? "Active / In-Mitigation" : "Resolved"),
      engineer: well.engineer
    });
  }

  // 4. Generate 30 Historical Drilling Reports
  const REPORTS = [];
  const REPORT_TYPES = [
    "DDR (Daily Drilling Report)",
    "EOWR (End of Well Report)",
    "Mud Logging Geochemical Summary",
    "BHA Vibration & Bit Wear Audit",
    "Pore Pressure & Fracture Gradient (PPFG) Study"
  ];

  for (let i = 1; i <= 30; i++) {
    const well = WELLS[i % WELLS.length];
    const type = REPORT_TYPES[i % REPORT_TYPES.length];
    REPORTS.push({
      id: `DOC-OIL-${2020 + (i % 6)}-${String(i).padStart(3, '0')}`,
      title: `${type} - ${well.name} (${well.id})`,
      type,
      wellId: well.id,
      wellName: well.name,
      field: well.field,
      basin: well.basin,
      spudYear: 2020 + (i % 6),
      totalDepth: well.targetDepth,
      pageCount: 14 + ((i * 7) % 65),
      author: well.engineer,
      extractedKeyInsights: [
        `Optimal ROP achieved: ${well.rop + 4.2} m/hr with PDC 5-blade cutter bit in ${well.formation}.`,
        `Observed fracture gradient limit at ${well.currentDepth + 240} m: 15.4 PPG equivalent.`,
        `Differential sticking incident mitigated in 2.5 hours using weighted oil-based soaking pill.`,
        `Lithology boundary transition matched 3D seismic horizon with < 4.5m vertical variance.`
      ],
      ocrConfidence: `${94 + (i % 5)}%`,
      keyFormations: [well.formation, "Tipam Sandstone", "Barail Main Pay"],
      hazardsEncountered: i % 3 === 0 ? "Severe Lost Circulation (320 bbls)" : (i % 2 === 0 ? "Gas Kick 12 bbl gain (Killed by Driller Method)" : "Tight Hole & High Drag"),
      fileSize: `${(2.4 + (i * 0.6)).toFixed(1)} MB`,
      downloadUrl: `#doc-preview-${i}`
    });
  }

  // 5. Generate 100 AI Recommendations
  const RECOMMENDATIONS = [];
  const REC_CATEGORIES = ["Drill Bit & BHA", "Mud Hydraulics", "Pore Pressure & Casing", "Stuck Pipe Prevention", "Rate of Penetration (ROP)"];
  
  for (let i = 1; i <= 100; i++) {
    const well = WELLS[i % WELLS.length];
    const cat = REC_CATEGORIES[i % REC_CATEGORIES.length];
    let actionText = "";
    let impactText = "";

    if (cat === "Drill Bit & BHA") {
      actionText = `Deploy Matrix-body PDC Bit (16mm cutters) with conical diamond inserts for abrasive ${well.formation}.`;
      impactText = `Projected +28% ROP boost and prevents premature ring-out wear seen in offset ${well.offsetWells[0]}.`;
    } else if (cat === "Mud Hydraulics") {
      actionText = `Adjust Mud Weight to ${well.mudWeight + 0.3} PPG with 35% low-gravity solids threshold before reaching ${well.formation}.`;
      impactText = `Maintains 220 psi overbalance, mitigating kick risk while preserving formation permeability.`;
    } else if (cat === "Pore Pressure & Casing") {
      actionText = `Set 9-5/8" casing shoe 15 meters inside the upper impervious ${well.formation} cap.`;
      impactText = `Prevents shoe leakage during 13.8 PPG pore pressure ramp in underlying Barail formation.`;
    } else if (cat === "Stuck Pipe Prevention") {
      actionText = `Restrict static drillstring downtime to 180 seconds during wiper trips in reactive shale zones.`;
      impactText = `Reduces probability of differential sticking from 62% to < 4% based on 14 offset runs.`;
    } else {
      actionText = `Increase rotary RPM from ${well.rpm} to ${well.rpm + 20} while moderating WOB to 16 klbs.`;
      impactText = `Dampens dangerous stick-slip torsional vibrations and lifts average ROP by 5.4 m/hr.`;
    }

    RECOMMENDATIONS.push({
      id: `REC-AI-${String(i).padStart(3, '0')}`,
      category: cat,
      wellId: well.id,
      wellName: well.name,
      formation: well.formation,
      depthWindow: `${well.currentDepth - 80}m - ${well.currentDepth + 320}m`,
      recommendation: actionText,
      expectedImpact: impactText,
      confidence: `${88 + (i % 11)}%`,
      priority: i % 4 === 0 ? "Urgent / Safety Critical" : (i % 2 === 0 ? "High Efficiency" : "Standard Operational"),
      verifiedBy: well.engineer,
      offsetBasis: `Derived from machine learning synthesis of ${well.offsetWells.join(", ")} historical runs.`
    });
  }

  // Expose on global window object
  window.NexusData = {
    formations: FORMATIONS,
    basins: BASINS,
    engineers: ENGINEERS,
    wells: WELLS,
    alerts: ALERTS,
    reports: REPORTS,
    recommendations: RECOMMENDATIONS,
    
    // Quick helper query methods
    getWellById(id) {
      return this.wells.find(w => w.id.toLowerCase() === (id || '').toLowerCase()) || this.wells[0];
    },
    getAlertsByWell(wellId) {
      return this.alerts.filter(a => a.wellId === wellId);
    },
    getRecommendationsByWell(wellId) {
      return this.recommendations.filter(r => r.wellId === wellId);
    },
    getActiveWellsCount() {
      return this.wells.filter(w => w.status === "Drilling").length;
    },
    getCriticalAlertsCount() {
      return this.alerts.filter(a => a.severity === "Critical" && a.status !== "Resolved").length;
    }
  };

  console.log("NexusData initialized successfully with 100 wells, 50 alerts, 30 reports, 100 recommendations, 20 engineers.");
})();
