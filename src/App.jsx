import { useState, useEffect } from "react";

const fmt = (n) => new Intl.NumberFormat("es-UY", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
const timeNow = () => new Date().toLocaleDateString("es-UY", { day: "2-digit", month: "2-digit" });

// ── PALETTE ──────────────────────────────────────────────────────────────────
const C = {
  bg:       "#f0f2f8",
  surface:  "#ffffff",
  surface2: "#f7f8fc",
  primary:  "#4f46e5",  // indigo
  primary2: "#6366f1",
  primaryBg:"#eef2ff",
  success:  "#059669",
  successBg:"#ecfdf5",
  danger:   "#dc2626",
  dangerBg: "#fef2f2",
  warning:  "#d97706",
  warningBg:"#fffbeb",
  purple:   "#7c3aed",
  purpleBg: "#f5f3ff",
  text:     "#111827",
  text2:    "#6b7280",
  text3:    "#9ca3af",
  border:   "#e5e7eb",
  border2:  "#d1d5db",
  shadow:   "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
  shadow2:  "0 4px 16px rgba(79,70,229,0.10), 0 1px 4px rgba(0,0,0,0.06)",
  shadow3:  "0 8px 32px rgba(79,70,229,0.14), 0 2px 8px rgba(0,0,0,0.08)",
};

// ── DATA ─────────────────────────────────────────────────────────────────────
const PLAN_DEFAULT = [
  { id: "mesada",       fecha: "1/04",        concepto: "Mesada Guillermina",  monto: 7500,  tipo: "fijo" },
  { id: "scotia",       fecha: "6/04",        concepto: "Scotiabank",          monto: 9906,  tipo: "tarjeta", urgente: true, usd: 0.33 },
  { id: "alquiler",     fecha: "10/04",       concepto: "Alquiler",            monto: 32000, tipo: "fijo",    urgente: true },
  { id: "bbva",         fecha: "13/04",       concepto: "BBVA",                monto: 4153,  tipo: "tarjeta" },
  { id: "tributos",     fecha: "14/04",       concepto: "Tributos",            monto: 650,   tipo: "fijo" },
  { id: "santander",    fecha: "20/04",       concepto: "Santander",           monto: 7312,  tipo: "tarjeta", usd: 54.42 },
  { id: "gascom",       fecha: "20/04",       concepto: "Gastos comunes",      monto: 4500,  tipo: "fijo" },
  { id: "telfijo",      fecha: "20/04",       concepto: "Teléfono fijo",       monto: 1700,  tipo: "fijo",    variable: true },
  { id: "celguille",    fecha: "20/04",       concepto: "Cel Guillermina",     monto: 620,   tipo: "fijo" },
  { id: "calistenia",   fecha: "24/04",       concepto: "Calistenia",          monto: 1990,  tipo: "fijo" },
  { id: "ute",          fecha: "29/04",       concepto: "UTE (luz)",           monto: 4500,  tipo: "fijo",    variable: true },
  { id: "debsantander", fecha: "31/04",       concepto: "Débito Santander",    monto: 875,   tipo: "fijo" },
  { id: "comida",       fecha: "Todo el mes", concepto: "Comida + Transporte", monto: 28000, tipo: "variable", expandible: true },
];

const CUOTAS = [
  { mes: "Abril", nicolas: 23616, usdNic: 54.75, angelina: 45211, nota: "3 tarjetas · solo cuotas comprometidas",
    detalle: [
      { tarjeta: "BBVA",       color: "#004B9E", monto: 4153,  usd: 0,     vto: "13/04" },
      { tarjeta: "Scotiabank", color: "#EC111A", monto: 9906,  usd: 0.33,  vto: "06/04" },
      { tarjeta: "Santander",  color: "#CC0000", monto: 7312,  usd: 54.42, vto: "20/04" },
    ]
  },
  { mes: "Mayo", nicolas: 36083, usdNic: 107.11, angelina: 26338, nota: "4 tarjetas · datos reales Itaú + estimados resto",
    detalle: [
      { tarjeta: "Itaú",       color: "#FF6200", monto: 25145, usd: 52.02, vto: "04/05" },
      { tarjeta: "Santander",  color: "#CC0000", monto: 4309,  usd: 81.90, vto: "~20/05" },
      { tarjeta: "BBVA",       color: "#004B9E", monto: 3315,  usd: 0,     vto: "~15/05" },
      { tarjeta: "Scotiabank", color: "#EC111A", monto: 3461,  usd: 0,     vto: "~07/05" },
    ]
  },
  { mes: "Junio", nicolas: 25744, usdNic: 81.90, angelina: 16077, nota: "4 tarjetas · solo cuotas comprometidas",
    detalle: [
      { tarjeta: "Itaú",       color: "#FF6200", monto: 16587, usd: 0,     vto: "~04/06" },
      { tarjeta: "Santander",  color: "#CC0000", monto: 4309,  usd: 81.90, vto: "~20/06" },
      { tarjeta: "BBVA",       color: "#004B9E", monto: 1387,  usd: 0,     vto: "~15/06" },
      { tarjeta: "Scotiabank", color: "#EC111A", monto: 3461,  usd: 0,     vto: "~07/06" },
    ]
  },
  { mes: "Julio", nicolas: 22789, usdNic: 81.90, angelina: 10750, nota: "4 tarjetas · solo cuotas comprometidas",
    detalle: [
      { tarjeta: "Itaú",       color: "#FF6200", monto: 13632, usd: 0,     vto: "~04/07" },
      { tarjeta: "Santander",  color: "#CC0000", monto: 4309,  usd: 81.90, vto: "~20/07" },
      { tarjeta: "BBVA",       color: "#004B9E", monto: 1387,  usd: 0,     vto: "~15/07" },
      { tarjeta: "Scotiabank", color: "#EC111A", monto: 3461,  usd: 0,     vto: "~07/07" },
    ]
  },
  { mes: "Agosto", nicolas: 22789, usdNic: 81.90, angelina: 7575, nota: "4 tarjetas · solo cuotas comprometidas",
    detalle: [
      { tarjeta: "Itaú",       color: "#FF6200", monto: 13632, usd: 0,     vto: "~04/08" },
      { tarjeta: "Santander",  color: "#CC0000", monto: 4309,  usd: 81.90, vto: "~20/08" },
      { tarjeta: "BBVA",       color: "#004B9E", monto: 1387,  usd: 0,     vto: "~15/08" },
      { tarjeta: "Scotiabank", color: "#EC111A", monto: 3461,  usd: 0,     vto: "~07/08" },
    ]
  },
  { mes: "Septiembre", nicolas: 18715, usdNic: 81.90, angelina: 0, nota: "4 tarjetas · solo cuotas comprometidas",
    detalle: [
      { tarjeta: "Itaú",       color: "#FF6200", monto: 11632, usd: 0,     vto: "~04/09" },
      { tarjeta: "Santander",  color: "#CC0000", monto: 3927,  usd: 81.90, vto: "~20/09" },
      { tarjeta: "BBVA",       color: "#004B9E", monto: 795,   usd: 0,     vto: "~15/09" },
      { tarjeta: "Scotiabank", color: "#EC111A", monto: 2361,  usd: 0,     vto: "~07/09" },
    ]
  },
  { mes: "Octubre", nicolas: 13550, usdNic: 81.90, angelina: 0, nota: "4 tarjetas · solo cuotas comprometidas",
    detalle: [
      { tarjeta: "Itaú",       color: "#FF6200", monto: 9299,  usd: 0,     vto: "~04/10" },
      { tarjeta: "Santander",  color: "#CC0000", monto: 3927,  usd: 81.90, vto: "~20/10" },
      { tarjeta: "BBVA",       color: "#004B9E", monto: 795,   usd: 0,     vto: "~15/10" },
      { tarjeta: "Scotiabank", color: "#EC111A", monto: 656,   usd: 0,     vto: "~07/10" },
    ]
  },
  { mes: "Noviembre", nicolas: 10021, usdNic: 81.90, angelina: 0, nota: "3 tarjetas · solo cuotas comprometidas",
    detalle: [
      { tarjeta: "Itaú",       color: "#FF6200", monto: 5299,  usd: 0,     vto: "~04/11" },
      { tarjeta: "Santander",  color: "#CC0000", monto: 3927,  usd: 81.90, vto: "~20/11" },
      { tarjeta: "BBVA",       color: "#004B9E", monto: 795,   usd: 0,     vto: "~15/11" },
    ]
  },
  { mes: "Diciembre", nicolas: 3094, usdNic: 53.21, angelina: 0, nota: "2 tarjetas · solo cuotas comprometidas",
    detalle: [
      { tarjeta: "Itaú",       color: "#FF6200", monto: 2299,  usd: 0,     vto: "~04/12" },
      { tarjeta: "Santander",  color: "#CC0000", monto: 795,   usd: 53.21, vto: "~20/12" },
    ]
  },
  { mes: "Enero 27", nicolas: 1594, usdNic: 0, angelina: 0, nota: "1 tarjeta · solo cuotas comprometidas",
    detalle: [
      { tarjeta: "Santander",  color: "#CC0000", monto: 795,   usd: 0,     vto: "~20/01" },
    ]
  },
];

const GASTOS_FIJOS = [
  { concepto: "Alquiler",           monto: 32000, vto: 10 },
  { concepto: "Mesada Guillermina", monto: 7500,  vto: 1  },
  { concepto: "Comida + Transporte",monto: 28000, vto: 0  },
  { concepto: "Gastos comunes",     monto: 4500,  vto: 20 },
  { concepto: "UTE",                monto: 4500,  vto: 29 },

  { concepto: "Teléfono fijo",      monto: 1700,  vto: 20 },
  { concepto: "Cel Guillermina",    monto: 620,   vto: 20 },
  { concepto: "Tributos",           monto: 650,   vto: 14 },
  { concepto: "Débito Santander",   monto: 875,   vto: 31 },
];

const SUSCRIPCIONES = [
  { concepto: "YouTube Premium",       tarjeta: "Santander", color: "#CC0000", monto: 410,  usd: 9.99, icono: "🎬", nota: "U$S 9.99 × $41" },
  { concepto: "Antel Móvil",           tarjeta: "Santander", color: "#CC0000", monto: 635,  usd: 0,    icono: "📱", nota: "Celular Nicolás" },
  { concepto: "Google One",            tarjeta: "Santander", color: "#CC0000", monto: 126,  usd: 3.08, icono: "☁️", nota: "Google Drive storage" },
  { concepto: "Claude (Anthropic)", tarjeta: "Itaú",      color: "#FF6200", monto: 205,  usd: 5.00, icono: "🤖", nota: "Suscripción Claude AI" },
  { concepto: "Apple U$S 2.99",          tarjeta: "Itaú",      color: "#FF6200", monto: 123,  usd: 2.99, icono: "🍎", nota: "a revisar qué es" },
  { concepto: "Apple U$S 4.99",          tarjeta: "Itaú",      color: "#FF6200", monto: 205,  usd: 4.99, icono: "🍎", nota: "a revisar qué es" },
  { concepto: "Apple U$S 20.00",         tarjeta: "Itaú",      color: "#FF6200", monto: 820,  usd: 20.00, icono: "🍎", nota: "iCloud+ o Apple One — a revisar" },
  { concepto: "Seguro SURA",           tarjeta: "Santander", color: "#CC0000", monto: 2435, usd: 0,    icono: "🔒", nota: "Seguro alquiler" },
  { concepto: "Calistenia (Evolucion)", tarjeta: "Santander", color: "#CC0000", monto: 1900, usd: 0,   icono: "🏋️", nota: "Merpago Evolucion — Santander" },
];
const TC = 41;

const TARJETAS_DATA = [
  { nombre: "BBVA",       color: "#004B9E", bg: "#e8f0fb", abril: 0,  usd: 0,  vto: "~15/05", nota: "Pendiente — subir estado" },
  { nombre: "Scotiabank", color: "#EC111A", bg: "#fef2f2", abril: 4893, usd: 22.35, vto: "07/05", nota: "Vence 07/05" },
  { nombre: "Itaú",       color: "#FF6200", bg: "#fff4ee", abril: 25145, usd: 52.02, vto: "04/05", nota: "Vence 04/05" },
  { nombre: "Santander",  color: "#CC0000", bg: "#fdf2f2", abril: 40698, usd: 170.0, vto: "20/05", nota: "Vence 20/05" },
];


const ICONOS = {
  mesada:       '👧',
  scotia:       '💳',
  alquiler:     '🏠',
  bbva:         '💳',
  tributos:     '🏛️',
  santander:    '💳',
  gascom:       '🏢',
  telfijo:      '📞',
  celguille:    '📱',
  calistenia:   '🏋️',
  ute:          '💡',
  debsantander: '💳',
  comida:       '🍔',
};
const TARJETA_COLORS = {
  itau:         "#FF6200",
  scotia:       "#EC111A",
  bbva:         "#004B9E",
  santander:    "#CC0000",
  itau:         "#FF6200",
  debsantander: "#CC0000",
};
const DISPONIBLE_INICIAL = 0;

// ── DONUT CHART ───────────────────────────────────────────────────────────────
function DonutChart({ pct, disponible, porPagar }) {
  const r = 52, cx = 70, cy = 70, stroke = 10;
  const circ = 2 * Math.PI * r;
  const dash = (circ * pct) / 100;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.border} strokeWidth={stroke}/>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.primary} strokeWidth={stroke}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`} style={{ transition: "stroke-dasharray 1s ease" }}/>
        <text x={cx} y={cy - 8} textAnchor="middle" fill={C.text} fontSize="20" fontWeight="700" fontFamily="Inter, sans-serif">{pct}%</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill={C.text2} fontSize="10" fontFamily="Inter, sans-serif">pagado</text>
      </svg>
      <div style={{ flex: 1 }}>
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: C.text2 }}>Disponible</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: disponible < 0 ? C.danger : C.success }}>{disponible < 0 ? "-$" + fmt(Math.abs(disponible)) : "$" + fmt(disponible)}</span>
          </div>
          <div style={{ height: 4, background: C.border, borderRadius: 99 }}>
            <div style={{ height: "100%", width: `${Math.min(100, (disponible / (disponible + porPagar)) * 100)}%`, background: C.success, borderRadius: 99, transition: "width 0.8s ease" }}/>
          </div>
        </div>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: C.text2 }}>Por pagar</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: C.danger }}>${fmt(porPagar)}</span>
          </div>
          <div style={{ height: 4, background: C.border, borderRadius: 99 }}>
            <div style={{ height: "100%", width: `${Math.min(100, (porPagar / (disponible + porPagar)) * 100)}%`, background: "#fca5a5", borderRadius: 99, transition: "width 0.8s ease" }}/>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── PILL BADGE ────────────────────────────────────────────────────────────────
function Badge({ label, color, bg }) {
  return <span style={{ fontSize: 9, fontWeight: 600, color, background: bg, borderRadius: 99, padding: "2px 8px", letterSpacing: 0.3, textTransform: "uppercase" }}>{label}</span>;
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [ready, setReady]           = useState(false);
  const [tab, setTab]               = useState("abril");
  const [plan, setPlan]             = useState(null);
  const [pagados, setPagados]       = useState(null);
  const [expandido, setExpandido]   = useState(null);
  const [subGastos, setSubGastos]   = useState(null);
  const [ingresos, setIngresos]     = useState(null);
  const [inputSub, setInputSub]     = useState({ desc: "", monto: "" });
  const [inputFactura, setInputFactura]         = useState("");
  const [inputLabel, setInputLabel]             = useState("");
  const [showFacturaInput, setShowFacturaInput] = useState(false);
  const [showHistorial, setShowHistorial]       = useState(false);
  const [editandoIngreso, setEditandoIngreso]   = useState(null);
  const [uteInput, setUteInput]                 = useState("");
  const [editandoItem, setEditandoItem]         = useState(null);
  const [showNuevoItem, setShowNuevoItem]       = useState(false);
  const [nuevoItem, setNuevoItem] = useState({ concepto: "", monto: "", fecha: "" });
  const [savedMsg, setSavedMsg]   = useState(false);
  const [unsaved, setUnsaved]     = useState(false);
  const [expandedMes, setExpandedMes] = useState(null);
  const [editMonto, setEditMonto] = useState("");

  useEffect(() => {
    (async () => {
      try {
        let data = null;
        try { const r = await window.storage.get("finanzas_mayo26"); if (r?.value) data = JSON.parse(r.value); } catch(e) {}
        if (!data) { try { const l = localStorage.getItem("finanzas_mayo26"); if (l) data = JSON.parse(l); } catch(e) {} }
        if (data) {
          // Storage-first: user data always wins over defaults
          if (data.plan) {
            // Merge: keep stored monto/pagado state, update structure from PLAN_DEFAULT
            const merged = PLAN_DEFAULT.map(def => {
              const stored = data.plan.find(i => i.id === def.id);
              // stored monto takes priority, usd always from def (structural)
              return stored ? { ...def, monto: stored.monto, variable: def.variable, expandible: def.expandible } : def;
            });
            const extras = data.plan.filter(i => !PLAN_DEFAULT.find(d => d.id === i.id));
            setPlan([...merged, ...extras]);
          } else {
            setPlan(PLAN_DEFAULT);
          }
          setPagados(data.pagados   ?? []);
          setSubGastos(data.subGastos ?? {});
          setIngresos(data.ingresos  ?? []);
        } else {
          // No storage at all - use true defaults only once
          setPlan(PLAN_DEFAULT);
          setPagados(["mesada"]);
          setSubGastos({});
          setIngresos([]);
        }
      } catch(e) {
        // On error, use defaults
        setPlan(PLAN_DEFAULT);
        setPagados(["mesada"]);
        setSubGastos({});
        setIngresos([]);
      }
      setReady(true);
    })();
  }, []);

  // Auto-save on every change
  useEffect(() => {
    if (!ready) return;
    setUnsaved(true);
    const timer = setTimeout(async () => {
      const data = JSON.stringify({ plan: safePlan, pagados: safePagados, subGastos: safeSubGastos, ingresos: safeIngresos });
      try { await window.storage.set("finanzas_mayo26", data); } catch(e) {}
      try { localStorage.setItem("finanzas_mayo26", data); } catch(e) {}
      setUnsaved(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [plan, pagados, subGastos, ingresos]);

  const guardarTodo = async () => {
    const data = JSON.stringify({ plan: safePlan, pagados: safePagados, subGastos: safeSubGastos, ingresos: safeIngresos });
    setSavedMsg("saving");
    try {
      try { await window.storage.set("finanzas_mayo26", data); } catch(e) {}
      try { localStorage.setItem("finanzas_mayo26", data); } catch(e) {}
      setSavedMsg("ok"); setUnsaved(false);
      setTimeout(() => setSavedMsg(false), 2000);
    } catch(e) { setSavedMsg("error"); setTimeout(() => setSavedMsg(false), 3000); }
  };

  // ── EXPORT / IMPORT ─────────────────────────────────────────────────────
  const [showExport, setShowExport] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState("");
  const [importMsg, setImportMsg]   = useState("");

  const getBackupText = () => JSON.stringify({
    version: 1,
    fecha: new Date().toLocaleDateString("es-UY"),
    plan: safePlan,
    pagados: safePagados,
    subGastos: safeSubGastos,
    ingresos: safeIngresos,
  });

  const importarDatos = () => {
    try {
      const data = JSON.parse(importText);
      if (data.plan)      setPlan(data.plan);
      if (data.pagados)   setPagados(data.pagados);
      if (data.subGastos) setSubGastos(data.subGastos);
      if (data.ingresos)  setIngresos(data.ingresos);
      setImportMsg("✓ Datos restaurados correctamente");
      setImportText("");
      setTimeout(() => { setImportMsg(""); setShowImport(false); }, 2000);
    } catch(e) {
      setImportMsg("✗ Texto inválido, verificá que esté completo");
    }
  };

  const togglePago = (id) => {
    const item = plan.find(i => i.id === id);
    if (item?.expandible) return;
    setPagados(prev => (prev || []).includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const agregarSubGasto = (itemId) => {
    const val = parseFloat(inputSub.monto.replace(/\./g, "").replace(",", "."));
    if (isNaN(val) || val <= 0) return;
    setSubGastos(prev => ({ ...prev, [itemId]: [...(prev[itemId] || []), { id: Date.now(), desc: inputSub.desc || "Gasto", monto: val, fecha: timeNow() }] }));
    setInputSub({ desc: "", monto: "" });
  };

  const borrarSubGasto = (itemId, subId) => setSubGastos(prev => ({ ...prev, [itemId]: prev[itemId].filter(s => s.id !== subId) }));

  const agregarIngreso = () => {
    const val = parseFloat(inputFactura.replace(/\./g, "").replace(",", "."));
    if (isNaN(val) || val <= 0) return;
    setIngresos(prev => [...(prev || []), { id: Date.now(), monto: val, label: inputLabel || "Facturado", fecha: timeNow() }]);
    setInputFactura(""); setInputLabel(""); setShowFacturaInput(false);
  };

  const borrarIngreso = (id) => setIngresos(prev => (prev || []).filter(i => i.id !== id));

  const guardarEdicionIngreso = (id) => {
    const val = parseFloat(editMonto.replace(/\./g, "").replace(",", "."));
    if (!isNaN(val) && val > 0) setIngresos(prev => (prev || []).map(i => i.id === id ? { ...i, monto: val } : i));
    setEditandoIngreso(null); setEditMonto("");
  };

  const agregarItem = () => {
    const val = parseFloat(nuevoItem.monto.replace(/\./g, "").replace(",", "."));
    if (!nuevoItem.concepto || isNaN(val) || val <= 0) return;
    const id = "extra_" + Date.now();
    setPlan(prev => [...(prev || PLAN_DEFAULT), { id, fecha: nuevoItem.fecha || "Abril", concepto: nuevoItem.concepto, monto: val, tipo: "extra" }]);
    setNuevoItem({ concepto: "", monto: "", fecha: "" }); setShowNuevoItem(false);
  };

  const borrarItem = (id) => { setPlan(prev => (prev || PLAN_DEFAULT).filter(i => i.id !== id)); setPagados(prev => prev.filter(p => p !== id)); };

  const getMontoEfectivo = (item) => {
    if (!item.expandible) return item.monto;
    return Math.max(0, item.monto - ((safeSubGastos)[item.id] || []).reduce((a, b) => a + b.monto, 0));
  };

  const safePlan      = plan      || PLAN_DEFAULT;
  const safePagados   = pagados   || ["mesada"];
  const safeSubGastos = subGastos || {};
  const safeIngresos  = ingresos  || [];
  const facturadoTotal = safeIngresos.reduce((a, b) => a + b.monto, 0);
  const totalSubGastos = Object.values(safeSubGastos).flat().reduce((a, b) => a + b.monto, 0);
  const pagadosNuevos  = safePlan.filter(i => safePagados.includes(i.id) && i.id !== "mesada").reduce((a, b) => a + b.monto, 0);
  const porPagar       = safePlan.filter(i => !safePagados.includes(i.id)).reduce((a, b) => a + getMontoEfectivo(b), 0);
  const disponible     = DISPONIBLE_INICIAL + facturadoTotal - pagadosNuevos - totalSubGastos;
  const necesitasGanar = Math.max(0, porPagar - disponible);
  const totalPagado    = safePlan.filter(i => safePagados.includes(i.id)).reduce((a, b) => a + b.monto, 0);
  const totalMes       = safePlan.reduce((a, b) => a + b.monto, 0);
  const pct            = Math.min(100, Math.round(((totalPagado + totalSubGastos) / totalMes) * 100));
  const maxCuota       = Math.max(...CUOTAS.map(c => c.nicolas));



  const iStyle = (extra = {}) => ({
    background: C.surface2, border: `1.5px solid ${C.border}`, borderRadius: 10,
    color: C.text, padding: "9px 12px", fontSize: 13, fontFamily: "Inter, sans-serif",
    outline: "none", width: "100%", ...extra
  });

  const Btn = ({ children, onClick, style }) => (
    <button onClick={onClick} style={{ border: "none", cursor: "pointer", fontFamily: "Inter, sans-serif", borderRadius: 10, ...style }}>{children}</button>
  );

  const itemAccent = (item, esPagado) => {
    if (esPagado)               return { color: C.success, bg: C.successBg };
    if (item.urgente)           return { color: C.danger,  bg: C.dangerBg  };
    if (item.expandible)        return { color: C.primary, bg: C.primaryBg };
    if (item.tipo === "tarjeta") return { color: C.purple,  bg: C.purpleBg  };
    if (item.tipo === "extra")  return { color: C.warning, bg: C.warningBg };
    return { color: C.text2, bg: C.surface2 };
  };

  if (!ready) return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: C.primary, fontSize: 13, fontFamily: "Inter, sans-serif" }}>Cargando...</div>
    </div>
  );

  const TABS = [
    { id: "abril",    label: "Abril" },
    { id: "cuotas",   label: "Cuotas" },
    { id: "tarjetas", label: "Tarjetas" },
    { id: "fijos",    label: "Fijos" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "Inter, sans-serif", maxWidth: 430, margin: "0 auto", paddingBottom: 30 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        input::placeholder { color: ${C.text3}; }
        input:focus { border-color: ${C.primary} !important; outline: none; box-shadow: 0 0 0 3px ${C.primary}18; }
      `}</style>

      {/* ── HEADER HERO ── */}
      <div style={{ background: `linear-gradient(135deg, ${C.primary} 0%, #7c3aed 100%)`, padding: "32px 20px 24px", borderRadius: "0 0 28px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Mayo 2026</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: "#fff" }}>Mis Finanzas</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "6px 12px", fontSize: 11, color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>
            Nicolás
          </div>
        </div>

        {/* KPI row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 16, padding: 14, backdropFilter: "blur(10px)" }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.65)", marginBottom: 4, fontWeight: 500 }}>DISPONIBLE</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: disponible < 0 ? "#fca5a5" : "#fff" }}>{disponible < 0 ? "-$" + fmt(Math.abs(disponible)) : "$" + fmt(disponible)}</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>${fmt(DISPONIBLE_INICIAL)} + ${fmt(facturadoTotal)}</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 16, padding: 14, backdropFilter: "blur(10px)" }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.65)", marginBottom: 4, fontWeight: 500 }}>POR PAGAR</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: porPagar === 0 ? "#6ee7b7" : "#fca5a5" }}>
              {porPagar === 0 ? "✓ OK" : `$${fmt(porPagar)}`}
            </div>
            <div style={{ fontSize: 9, color: necesitasGanar > 0 ? "#fca5a5" : "#6ee7b7", marginTop: 2 }}>
              {necesitasGanar > 0 ? `faltan $${fmt(necesitasGanar)}` : porPagar > 0 ? "cubierto ✓" : "todo pago ✓"}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 16px 0" }}>

        {/* ── DONUT + PROGRESS ── */}
        <div style={{ background: C.surface, borderRadius: 20, padding: 20, boxShadow: C.shadow2, marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 16 }}>Resumen del mes</div>
          <DonutChart pct={pct} disponible={disponible} porPagar={porPagar} />
        </div>

        {/* ── FACTURADO ── */}
        <div style={{ background: C.surface, borderRadius: 20, padding: 18, boxShadow: C.shadow2, marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: showFacturaInput || showHistorial ? 14 : 0 }}>
            <div>
              <div style={{ fontSize: 10, color: C.text2, fontWeight: 500, marginBottom: 2, textTransform: "uppercase", letterSpacing: 1 }}>Facturado</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: C.primary }}>${fmt(facturadoTotal)}</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn onClick={() => setShowHistorial(v => !v)} style={{ background: showHistorial ? C.primaryBg : C.surface2, width: 38, height: 38, color: showHistorial ? C.primary : C.text2, fontSize: 14, border: `1.5px solid ${showHistorial ? C.primary : C.border}` }}>{showHistorial ? "▲" : "▼"}</Btn>
              <Btn onClick={() => setShowFacturaInput(v => !v)} style={{ background: showFacturaInput ? C.surface2 : C.primary, width: 38, height: 38, color: showFacturaInput ? C.text2 : "#fff", fontSize: 22, fontWeight: 700, border: "none", boxShadow: showFacturaInput ? "none" : C.shadow2 }}>
                {showFacturaInput ? "×" : "+"}
              </Btn>
            </div>
          </div>

          {showFacturaInput && (
            <div>
              <input type="text" value={inputLabel} onChange={e => setInputLabel(e.target.value)} placeholder="Descripción (opcional)" style={{ ...iStyle(), marginBottom: 8 }} />
              <div style={{ display: "flex", gap: 8 }}>
                <input type="number" value={inputFactura} onChange={e => setInputFactura(e.target.value)} onKeyDown={e => e.key === "Enter" && agregarIngreso()} placeholder="Monto $" autoFocus style={iStyle({ flex: 1, border: `1.5px solid ${C.primary}` })} />
                <Btn onClick={agregarIngreso} style={{ background: C.success, padding: "0 18px", color: "#fff", fontWeight: 600, fontSize: 15, height: 42, boxShadow: C.shadow }}>✓</Btn>
              </div>
            </div>
          )}

          {showHistorial && (
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
              <div style={{ fontSize: 10, color: C.text3, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>Historial</div>
              {safeIngresos.map(ing => (
                <div key={ing.id} style={{ marginBottom: 8 }}>
                  {editandoIngreso === ing.id ? (
                    <div style={{ display: "flex", gap: 8 }}>
                      <input type="number" value={editMonto} onChange={e => setEditMonto(e.target.value)} onKeyDown={e => e.key === "Enter" && guardarEdicionIngreso(ing.id)} autoFocus style={iStyle({ flex: 1, border: `1.5px solid ${C.primary}` })} />
                      <Btn onClick={() => guardarEdicionIngreso(ing.id)} style={{ background: C.success, padding: "0 12px", color: "#fff", fontWeight: 700, height: 42 }}>✓</Btn>
                      <Btn onClick={() => { setEditandoIngreso(null); setEditMonto(""); }} style={{ background: C.surface2, padding: "0 12px", color: C.text2, height: 42, border: `1.5px solid ${C.border}` }}>×</Btn>
                    </div>
                  ) : (
                    <div style={{ display: "flex", gap: 8 }}>
                      <div onClick={() => { setEditandoIngreso(ing.id); setEditMonto(String(ing.monto)); }} style={{ flex: 1, background: C.surface2, borderRadius: 10, padding: "10px 12px", cursor: "pointer", border: `1.5px solid ${C.border}` }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontSize: 12, color: C.text2 }}>{ing.label}</span>
                          <span style={{ fontSize: 13, fontWeight: 600, color: C.success }}>${fmt(ing.monto)}</span>
                        </div>
                        <div style={{ fontSize: 10, color: C.text3, marginTop: 2 }}>{ing.fecha} · tocá para editar</div>
                      </div>
                      <Btn onClick={() => borrarIngreso(ing.id)} style={{ background: C.dangerBg, border: `1.5px solid #fca5a5`, padding: "0 10px", color: C.danger, height: 42, fontWeight: 700 }}>✕</Btn>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── TABS ── */}
        <div style={{ background: C.surface, borderRadius: 14, padding: 4, display: "flex", gap: 2, marginBottom: 14, boxShadow: C.shadow }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: "9px 4px", borderRadius: 10, border: "none", cursor: "pointer",
              fontSize: 10, fontFamily: "Inter, sans-serif", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5,
              background: tab === t.id ? C.primary : "transparent",
              color: tab === t.id ? "#fff" : C.text2,
              boxShadow: tab === t.id ? C.shadow2 : "none",
              transition: "all 0.2s"
            }}>{t.label}</button>
          ))}
        </div>

        {/* ── TAB ABRIL ── */}
        {tab === "abril" && (
          <div style={{ animation: "fadeUp 0.3s ease" }}>
            <div style={{ fontSize: 10, color: C.text3, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>Tocá para marcar como pagado</div>

            {safePlan.map(item => {
              const esPagado  = pagados.includes(item.id);
              const isOpen    = expandido === item.id;
              const subs      = subGastos[item.id] || [];
              const gastado   = subs.reduce((a, b) => a + b.monto, 0);
              const restante  = item.expandible ? Math.max(0, item.monto - gastado) : item.monto;
              const pctComida = item.expandible ? Math.min(100, Math.round((gastado / item.monto) * 100)) : 0;
              const acc       = itemAccent(item, esPagado);
              const showUte   = item.variable && !esPagado && editandoItem === item.id;

              return (
                <div key={item.id} style={{ marginBottom: 8 }}>
                  <div
                    onClick={() => { if (item.expandible) setExpandido(isOpen ? null : item.id); else togglePago(item.id); }}
                  onDoubleClick={() => { if (item.variable && !esPagado) setEditandoItem(editandoItem === item.id ? null : item.id); }}
                    style={{
                      background: esPagado ? '#f0fdf4' : C.surface, borderRadius: isOpen || showUte ? "14px 14px 0 0" : 14,
                      padding: "14px 14px", boxShadow: C.shadow,
                      border: `1.5px solid ${esPagado ? "#a7f3d0" : item.urgente ? "#fca5a5" : C.border}`,
                      borderBottom: isOpen || showUte ? "none" : undefined,
                      display: "flex", alignItems: "center", gap: 12, cursor: "pointer", transition: "all 0.15s"
                    }}
                  >
                    {/* Icon bubble */}
                    <div style={{
                      width: 36, height: 36, borderRadius: 12, flexShrink: 0,
                      background: esPagado ? C.success : item.tipo === "tarjeta" ? (TARJETA_COLORS[item.id] || C.primary) + "28" : acc.bg,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: esPagado ? 16 : 18,
                      color: esPagado ? "#fff" : item.tipo === "tarjeta" ? (TARJETA_COLORS[item.id] || C.primary) : "inherit",
                      fontWeight: 700,
                      boxShadow: esPagado ? "0 2px 8px rgba(5,150,105,0.35)" : item.tipo === "tarjeta" ? `0 2px 8px ${(TARJETA_COLORS[item.id] || C.primary)}55` : "none"
                    }}>
                      {esPagado ? "✓" : ({
                        mesada: "👧", scotia: "💳", alquiler: "🏠", bbva: "💳", itau: "💳",
                        tributos: "🏛️", santander: "💳", gascom: "🏢", telfijo: "📞",
                        celguille: "📱", calistenia: "🏋️", ute: "💡", debsantander: "💳", comida: "🍔",
                        cosem: "🏥", lentes: "👓"
                      })[item.id] || (item.tipo === "extra" ? "⭐" : "📋")}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: esPagado ? C.text3 : C.text, textDecoration: esPagado ? "line-through" : "none", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {item.concepto}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: C.text2 }}>{item.fecha}</span>
                        {item.variable && !esPagado && <span style={{ fontSize: 9, color: C.text3 }}>doble toque para editar</span>}
                        {item.urgente && !esPagado && <Badge label="urgente" color={C.danger} bg={C.dangerBg} />}
                        {item.expandible && gastado > 0 && <Badge label={`${fmt(gastado)} gastado`} color={C.primary} bg={C.primaryBg} />}
                        
                      </div>
                      {item.expandible && gastado > 0 && (
                        <div style={{ height: 3, background: C.border, borderRadius: 99, marginTop: 6 }}>
                          <div style={{ height: "100%", width: `${pctComida}%`, background: pctComida > 80 ? C.danger : C.primary, borderRadius: 99, transition: "width 0.5s" }}/>
                        </div>
                      )}
                    </div>

                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: esPagado ? C.success : acc.color }}>
                        ${fmt(item.expandible ? restante : item.monto)}
                      </div>
                      {item.expandible && <div style={{ fontSize: 9, color: C.text3 }}>de ${fmt(item.monto)}</div>}
                      {item.usd > 0 && <div style={{ fontSize: 9, color: C.purple }}>+ U$S {item.usd.toFixed(2)}</div>}
                    </div>

                    {item.tipo === "extra" && !esPagado && (
                      <div onClick={e => { e.stopPropagation(); borrarItem(item.id); }} style={{ color: C.text3, fontSize: 12, padding: "4px 6px", cursor: "pointer" }}>✕</div>
                    )}
                    {item.expandible && <div style={{ fontSize: 11, color: C.text3 }}>{isOpen ? "▲" : "▼"}</div>}
                  </div>

                  {/* UTE panel */}
                  {showUte && (
                    <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderTop: "none", borderRadius: "0 0 14px 14px", padding: "10px 14px", display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 11, color: C.text3, flexShrink: 0 }}>Ajustar monto:</span>
                      <input type="number" value={uteInput} onChange={e => setUteInput(e.target.value)}
                        onKeyDown={e => { if(e.key==="Enter"){ const v=parseFloat(uteInput); if(!isNaN(v)&&v>0){setPlan(prev=>prev.map(i=>i.id===item.id?{...i,monto:v}:i));setUteInput("");}}}}
                        placeholder={fmt(item.monto)}
                        style={{ ...iStyle({ flex: 1, fontSize: 13, padding: "6px 10px" }), width: "auto" }} />
                      <Btn onClick={() => { const v = parseFloat(uteInput); if (!isNaN(v) && v > 0) { setPlan(prev => (prev || PLAN_DEFAULT).map(i => i.id === item.id ? {...i, monto: v} : i)); setUteInput(""); setEditandoItem(null); } }}
                        style={{ background: C.primary, padding: "0 12px", color: "#fff", fontWeight: 600, height: 34, fontSize: 13, borderRadius: 8 }}>✓</Btn>
                    </div>
                  )}

                  {/* Comida panel */}
                  {isOpen && (
                    <div style={{ background: C.primaryBg, border: `1.5px solid #c7d2fe`, borderTop: "none", borderRadius: "0 0 14px 14px", padding: "12px 14px" }}>
                      {subs.length > 0 && (
                        <div style={{ marginBottom: 12 }}>
                          {subs.map(s => (
                            <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: `1px solid #e0e7ff` }}>
                              <div>
                                <span style={{ fontSize: 12, color: C.text }}>{s.desc}</span>
                                <span style={{ fontSize: 10, color: C.text3, marginLeft: 8 }}>{s.fecha}</span>
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <span style={{ fontSize: 12, fontWeight: 600, color: C.danger }}>-${fmt(s.monto)}</span>
                                <Btn onClick={() => borrarSubGasto(item.id, s.id)} style={{ background: "none", color: C.text3, fontSize: 11, padding: "2px 4px" }}>✕</Btn>
                              </div>
                            </div>
                          ))}
                          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
                            <span style={{ fontSize: 11, color: C.text2, fontWeight: 500 }}>Restante</span>
                            <span style={{ fontSize: 14, fontWeight: 700, color: restante < 5000 ? C.danger : C.success }}>${fmt(restante)}</span>
                          </div>
                        </div>
                      )}
                      <div style={{ display: "flex", gap: 8 }}>
                        <input type="text" value={inputSub.desc} onChange={e => setInputSub(p => ({ ...p, desc: e.target.value }))} placeholder="¿Qué fue?" style={{ ...iStyle({ border: `1.5px solid #c7d2fe`, background: "#fff" }), flex: 1, width: "auto" }} />
                        <input type="number" value={inputSub.monto} onChange={e => setInputSub(p => ({ ...p, monto: e.target.value }))} onKeyDown={e => e.key === "Enter" && agregarSubGasto(item.id)} placeholder="$" style={{ ...iStyle({ border: `1.5px solid #c7d2fe`, background: "#fff", width: 75 }), width: 75 }} />
                        <Btn onClick={() => agregarSubGasto(item.id)} style={{ background: C.primary, padding: "0 12px", color: "#fff", fontWeight: 700, height: 42, boxShadow: C.shadow2 }}>✓</Btn>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Add extra */}
            {!showNuevoItem ? (
              <Btn onClick={() => setShowNuevoItem(true)} style={{ width: "100%", background: C.surface, border: `1.5px dashed ${C.border2}`, padding: "13px", color: C.text2, fontSize: 12, fontWeight: 500, boxShadow: C.shadow, marginTop: 4, textAlign: "center" }}>
                + Agregar gasto extra
              </Btn>
            ) : (
              <div style={{ background: C.surface, borderRadius: 14, padding: 16, boxShadow: C.shadow2, marginTop: 4, border: `1.5px solid ${C.border}` }}>
                <div style={{ fontSize: 11, color: C.text2, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Nuevo gasto</div>
                <input type="text" value={nuevoItem.concepto} onChange={e => setNuevoItem(p => ({ ...p, concepto: e.target.value }))} placeholder="Descripción" style={{ ...iStyle(), marginBottom: 8 }} />
                <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                  <input type="text" value={nuevoItem.fecha} onChange={e => setNuevoItem(p => ({ ...p, fecha: e.target.value }))} placeholder="Fecha" style={{ ...iStyle(), flex: 1, width: "auto" }} />
                  <input type="number" value={nuevoItem.monto} onChange={e => setNuevoItem(p => ({ ...p, monto: e.target.value }))} onKeyDown={e => e.key === "Enter" && agregarItem()} placeholder="Monto $" style={{ ...iStyle(), flex: 1, width: "auto" }} />
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Btn onClick={() => setShowNuevoItem(false)} style={{ flex: 1, background: C.surface2, padding: "11px", color: C.text2, fontWeight: 500, fontSize: 12, border: `1.5px solid ${C.border}` }}>Cancelar</Btn>
                  <Btn onClick={agregarItem} style={{ flex: 2, background: C.primary, padding: "11px", color: "#fff", fontWeight: 600, fontSize: 12, boxShadow: C.shadow2 }}>Agregar</Btn>
                </div>
              </div>
            )}

            <div style={{ background: C.warningBg, borderRadius: 12, padding: "11px 14px", marginTop: 12, border: `1.5px solid #fde68a`, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>⚠️</span>
              <span style={{ fontSize: 11, color: C.warning, fontWeight: 500 }}>No trabajás 1–6 ni 12–19. Máximo finde: <strong>${fmt(2300)}</strong></span>
            </div>
          </div>
        )}

        {/* ── TAB CUOTAS ── */}
        {tab === "cuotas" && (
          <div style={{ animation: "fadeUp 0.3s ease" }}>
            <div style={{ fontSize: 10, color: C.text3, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>Cuotas comprometidas — Nicolás</div>
            {CUOTAS.map(c => {
              const totalConUSD = c.nicolas + Math.round((c.usdNic || 0) * TC);
              const maxTotal = Math.max(...CUOTAS.map(x => x.nicolas + Math.round((x.usdNic || 0) * TC)));
              const color = totalConUSD > 20000 ? C.danger : totalConUSD > 10000 ? C.warning : totalConUSD > 0 ? C.success : C.text3;
              const isOpen = expandedMes === c.mes;
              const hasDetail = c.detalle && c.detalle.length > 0;
              return (
                <div key={c.mes} style={{ marginBottom: 8 }}>
                  <div
                    onClick={() => hasDetail && setExpandedMes(isOpen ? null : c.mes)}
                    style={{
                      background: C.surface,
                      borderRadius: isOpen ? "14px 14px 0 0" : 14,
                      padding: "14px",
                      boxShadow: C.shadow,
                      border: `1.5px solid ${totalConUSD === 0 ? C.border : color + "44"}`,
                      borderBottom: isOpen ? "none" : undefined,
                      cursor: hasDetail ? "pointer" : "default",
                      transition: "all 0.2s"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: totalConUSD > 0 ? 10 : 0 }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{c.mes}</div>
                        {c.nota && <div style={{ fontSize: 10, color: C.text3, marginTop: 2 }}>{c.nota} {hasDetail ? (isOpen ? "▲" : "▼") : ""}</div>}
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 16, fontWeight: 700, color: totalConUSD === 0 ? C.text3 : color }}>
                          {totalConUSD === 0 ? "—" : "$" + fmt(totalConUSD)}
                        </div>
                        {c.usdNic > 0 && <div style={{ fontSize: 10, color: C.purple }}>incl. U$S {c.usdNic} (~${fmt(Math.round(c.usdNic * TC))})</div>}
                      </div>
                    </div>
                    {totalConUSD > 0 && (
                      <div style={{ height: 5, background: C.border, borderRadius: 99 }}>
                        <div style={{ height: "100%", width: `${(totalConUSD / maxTotal) * 100}%`, background: color, borderRadius: 99, transition: "width 0.8s ease" }}/>
                      </div>
                    )}
                    {c.angelina > 0 && <div style={{ fontSize: 10, color: C.text3, marginTop: 8 }}>Angelina aparte: ${fmt(c.angelina)}</div>}
                  </div>

                  {isOpen && hasDetail && (
                    <div style={{ background: C.surface2, border: `1.5px solid ${color}33`, borderTop: "none", borderRadius: "0 0 14px 14px", padding: "10px 14px" }}>
                      {c.detalle.map((d, i) => (
                        <div key={d.tarjeta} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < c.detalle.length - 1 ? `1px solid ${C.border}` : "none" }}>
                          <div style={{ width: 10, height: 10, borderRadius: "50%", background: d.color, flexShrink: 0, boxShadow: `0 0 6px ${d.color}88` }}/>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{d.tarjeta}</div>
                            <div style={{ fontSize: 10, color: C.text3, marginTop: 1 }}>Vto: {d.vto}</div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: d.color }}>${fmt(d.monto)}</div>
                            {d.usd > 0 && <div style={{ fontSize: 9, color: C.purple }}>+ U$S {d.usd.toFixed(2)}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <div style={{ background: C.successBg, borderRadius: 12, padding: "12px 14px", border: `1.5px solid #a7f3d0` }}>
              <span style={{ fontSize: 11, color: C.success, fontWeight: 500 }}>✓ Desde febrero 2027 desaparecen casi todas las cuotas</span>
            </div>
          </div>
        )}

        {/* ── TAB TARJETAS ── */}
        {tab === "tarjetas" && (
          <div style={{ animation: "fadeUp 0.3s ease" }}>
            <div style={{ fontSize: 10, color: C.text3, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>Vencimientos Abril</div>
            {TARJETAS_DATA.map(t => (
              <div key={t.nombre} onClick={() => { const id = {"BBVA":"bbva","Scotiabank":"scotia","Santander":"santander"}[t.nombre]; if (id) togglePago(id); }} style={{ background: ({"BBVA":"bbva","Scotiabank":"scotia","Santander":"santander","Itaú":"itau"}[t.nombre] ? pagados.includes({"BBVA":"bbva","Scotiabank":"scotia","Santander":"santander","Itaú":"itau"}[t.nombre]) : false) ? "#f0fdf4" : C.surface, borderRadius: 16, padding: 16, marginBottom: 10, boxShadow: ({"BBVA":"bbva","Scotiabank":"scotia","Santander":"santander","Itaú":"itau"}[t.nombre] ? pagados.includes({"BBVA":"bbva","Scotiabank":"scotia","Santander":"santander","Itaú":"itau"}[t.nombre]) : false) ? "0 2px 12px rgba(5,150,105,0.18)" : C.shadow2, border: `1.5px solid ${({"BBVA":"bbva","Scotiabank":"scotia","Santander":"santander","Itaú":"itau"}[t.nombre] ? pagados.includes({"BBVA":"bbva","Scotiabank":"scotia","Santander":"santander","Itaú":"itau"}[t.nombre]) : false) ? "#059669" : t.vto === "04/05" ? "#a7f3d0" : C.border}`, cursor: t.vto !== "04/05" ? "pointer" : "default", transition: "all 0.2s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 14, height: 14, borderRadius: "50%", background: t.color, boxShadow: `0 0 8px ${t.color}66`, flexShrink: 0, marginTop: 3 }}/>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: ({"BBVA":"bbva","Scotiabank":"scotia","Santander":"santander","Itaú":"itau"}[t.nombre] ? pagados.includes({"BBVA":"bbva","Scotiabank":"scotia","Santander":"santander","Itaú":"itau"}[t.nombre]) : false) ? C.text3 : C.text, textDecoration: ({"BBVA":"bbva","Scotiabank":"scotia","Santander":"santander","Itaú":"itau"}[t.nombre] ? pagados.includes({"BBVA":"bbva","Scotiabank":"scotia","Santander":"santander","Itaú":"itau"}[t.nombre]) : false) ? "line-through" : "none" }}>{t.nombre} {({"BBVA":"bbva","Scotiabank":"scotia","Santander":"santander","Itaú":"itau"}[t.nombre] ? pagados.includes({"BBVA":"bbva","Scotiabank":"scotia","Santander":"santander","Itaú":"itau"}[t.nombre]) : false) ? "✓" : ""}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: t.vto === "04/05" ? C.warning : C.warning }}>{t.vto === "04/05" ? `Próx. vto: ${t.vto}` : `Vto: ${t.vto}`}</span>
                        {t.vto === "04/05" && <span style={{ fontSize: 10, background: "#fffbeb", color: C.warning, borderRadius: 99, padding: "2px 8px", fontWeight: 600 }}>Pagado 30/03</span>}
                        {t.vto === "06/04" && <span style={{ fontSize: 10, background: C.dangerBg, color: C.danger, borderRadius: 99, padding: "2px 8px", fontWeight: 600 }}>URGENTE</span>}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: ({"BBVA":"bbva","Scotiabank":"scotia","Santander":"santander","Itaú":"itau"}[t.nombre] ? pagados.includes({"BBVA":"bbva","Scotiabank":"scotia","Santander":"santander","Itaú":"itau"}[t.nombre]) : false) ? C.success : t.vto === "04/05" ? C.text3 : t.color, textDecoration: ({"BBVA":"bbva","Scotiabank":"scotia","Santander":"santander","Itaú":"itau"}[t.nombre] ? pagados.includes({"BBVA":"bbva","Scotiabank":"scotia","Santander":"santander","Itaú":"itau"}[t.nombre]) : false) || t.vto === "04/05" ? "line-through" : "none" }}>${fmt(t.abril)}</div>
                    {t.usd > 0 && <div style={{ fontSize: 10, color: C.purple, marginTop: 2 }}>+ U$S {t.usd.toFixed(2)} (~${fmt(Math.round(t.usd * TC))})</div>}
                  </div>
                </div>
                <div style={{ height: 5, background: C.border, borderRadius: 99 }}>
                  <div style={{ height: "100%", width: `${(t.abril / 30000) * 100}%`, background: t.color, borderRadius: 99, transition: "width 0.8s" }}/>
                </div>
              </div>
            ))}
            <div style={{ background: C.surface, borderRadius: 16, padding: 16, boxShadow: C.shadow2, border: `1.5px solid ${C.primary}44` }}>
              {(() => {
                const soloAbril = TARJETAS_DATA.filter(t => t.vto !== "04/05" && !({"BBVA":"bbva","Scotiabank":"scotia","Santander":"santander","Itaú":"itau"}[t.nombre] ? pagados.includes({"BBVA":"bbva","Scotiabank":"scotia","Santander":"santander","Itaú":"itau"}[t.nombre]) : false));
                const totalP = soloAbril.reduce((a, b) => a + b.abril, 0);
                const totalU = soloAbril.reduce((a, b) => a + b.usd, 0);
                const totalC = soloAbril.reduce((a, b) => a + b.abril + Math.round(b.usd * TC), 0);
                return (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 12, color: C.text2 }}>Total pesos abril</span>
                      <span style={{ fontSize: 15, fontWeight: 700, color: C.primary }}>${fmt(totalP)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                      <span style={{ fontSize: 12, color: C.text2 }}>Total dólares abril</span>
                      <span style={{ fontSize: 12, color: C.purple }}>U$S {totalU.toFixed(2)} (~${fmt(Math.round(totalU * TC))})</span>
                    </div>
                    <div style={{ height: 1, background: C.border, margin: "4px 0 10px" }}/>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Total combinado abril</span>
                      <span style={{ fontSize: 18, fontWeight: 700, color: C.primary }}>${fmt(totalC)}</span>
                    </div>
                    <div style={{ fontSize: 10, color: C.text3, marginTop: 8 }}>* Itaú excluido — vence 04/05</div>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {/* ── TAB FIJOS ── */}
        {tab === "fijos" && (
          <div style={{ animation: "fadeUp 0.3s ease" }}>
            <div style={{ fontSize: 10, color: C.text3, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>Gastos fijos mensuales</div>
            {[...GASTOS_FIJOS].sort((a, b) => a.vto - b.vto).map(g => (
              <div key={g.concepto} style={{ background: C.surface, borderRadius: 14, padding: "13px 14px", marginBottom: 8, boxShadow: C.shadow, border: `1.5px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: C.primaryBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                  {({"Alquiler":"🏠","Mesada Guillermina":"👧","Comida + Transporte":"🍔","Gastos comunes":"🏢","UTE":"💡","Calistenia":"🏋️","Teléfono fijo":"📞","Cel Guillermina":"📱","Tributos":"🏛️","Débito Santander":"💳"})[g.concepto] || "📋"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{g.concepto}</div>
                  <div style={{ fontSize: 10, color: C.text3, marginTop: 2 }}>{g.vto > 0 ? `Vence día ${g.vto}` : "Variable"}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text2 }}>${fmt(g.monto)}</div>
              </div>
            ))}
            <div style={{ background: C.surface, borderRadius: 14, padding: 16, boxShadow: C.shadow2, border: `1.5px solid ${C.primary}44` }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, color: C.text2 }}>Total fijos/mes</span>
                <span style={{ fontSize: 18, fontWeight: 700, color: C.primary }}>${fmt(GASTOS_FIJOS.reduce((a, b) => a + b.monto, 0))}</span>
              </div>
              <div style={{ fontSize: 10, color: C.text3, marginTop: 4 }}>70% de tus compromisos mensuales</div>
            </div>

            {/* SUSCRIPCIONES */}
            <div style={{ fontSize: 10, color: C.text3, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", margin: "20px 0 10px" }}>Suscripciones y seguros en tarjeta</div>
            <div style={{ fontSize: 10, color: "#92400e", background: "#fffbeb", borderRadius: 8, padding: "6px 10px", border: "1px solid #fde68a", marginBottom: 10 }}>
              ⚠️ Ya incluidos en el estado de cada tarjeta — no se suman a los fijos
            </div>
            {SUSCRIPCIONES.map(s => (
              <div key={s.concepto} style={{ background: C.surface, borderRadius: 12, padding: "12px 14px", marginBottom: 8, boxShadow: C.shadow, border: `1.5px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: s.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{s.icono}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{s.concepto}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color }}/>
                    <span style={{ fontSize: 10, color: C.text3 }}>{s.tarjeta} · {s.nota}</span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.text2 }}>${fmt(s.monto)}</div>
                  {s.usd > 0 && <div style={{ fontSize: 9, color: C.purple }}>U$S {s.usd}</div>}
                </div>
              </div>
            ))}
            <div style={{ background: C.surface, borderRadius: 14, padding: 14, border: `1.5px solid ${C.border}`, boxShadow: C.shadow }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 12, color: C.text2, fontWeight: 500 }}>Total suscripciones</div>
                  <div style={{ fontSize: 10, color: C.text3, marginTop: 2 }}>Ya incluido en estados de tarjeta</div>
                </div>
                <span style={{ fontSize: 16, fontWeight: 700, color: C.text2 }}>${fmt(SUSCRIPCIONES.reduce((a, b) => a + b.monto, 0))}</span>
              </div>
            </div>
          </div>
        )}

        {/* ── EXPORT / IMPORT ── */}
        <div style={{ marginTop: 20, display: "flex", gap: 8 }}>
          <button onClick={() => { setShowExport(v => !v); setShowImport(false); }} style={{
            flex: 1, padding: "12px", borderRadius: 12, cursor: "pointer",
            fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 600,
            background: showExport ? C.primaryBg : C.surface, color: C.primary,
            border: `1.5px solid ${C.primary}`, boxShadow: C.shadow,
          }}>📤 Backup</button>
          <button onClick={() => { setShowImport(v => !v); setShowExport(false); }} style={{
            flex: 1, padding: "12px", borderRadius: 12, cursor: "pointer",
            fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 600,
            background: showImport ? C.surface2 : C.surface, color: C.text2,
            border: `1.5px solid ${C.border}`, boxShadow: C.shadow,
          }}>📥 Restaurar</button>
        </div>

        {/* EXPORT panel */}
        {showExport && (
          <div style={{ background: C.surface, borderRadius: 14, padding: 16, marginTop: 10, border: `1.5px solid ${C.primary}44`, boxShadow: C.shadow }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 4 }}>📤 Tu backup</div>
            <div style={{ fontSize: 11, color: C.text2, marginBottom: 10 }}>Mantené presionado el texto de abajo → Seleccionar todo → Copiar → Guardalo en Notes</div>
            <textarea
              readOnly
              value={getBackupText()}
              rows={5}
              onClick={e => e.target.select()}
              onFocus={e => e.target.select()}
              style={{ width: "100%", background: C.surface2, border: `1.5px solid ${C.border}`, borderRadius: 8, color: C.text, padding: "8px 10px", fontSize: 10, fontFamily: "monospace", resize: "none", outline: "none", cursor: "pointer" }}
            />
            <div style={{ fontSize: 10, color: C.text3, marginTop: 6 }}>👆 Tocá el texto → ya queda seleccionado todo → Copiar → Pegalo en WhatsApp</div>
          </div>
        )}

        {/* IMPORT panel */}
        {showImport && (
          <div style={{ background: C.surface, borderRadius: 14, padding: 16, marginTop: 10, border: `1.5px solid ${C.border}`, boxShadow: C.shadow }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 4 }}>📥 Restaurar backup</div>
            <div style={{ fontSize: 11, color: C.text2, marginBottom: 10 }}>Pegá acá el texto que copiaste del backup</div>
            <textarea
              value={importText}
              onChange={e => setImportText(e.target.value)}
              placeholder='Pegá el texto del backup acá...'
              rows={5}
              style={{ width: "100%", background: C.surface2, border: `1.5px solid ${C.border}`, borderRadius: 8, color: C.text, padding: "8px 10px", fontSize: 10, fontFamily: "monospace", resize: "none", outline: "none" }}
            />
            {importMsg && <div style={{ fontSize: 11, color: importMsg.startsWith("✓") ? C.success : C.danger, marginTop: 6, fontWeight: 600 }}>{importMsg}</div>}
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button onClick={() => { setShowImport(false); setImportText(""); }} style={{ flex: 1, padding: "10px", borderRadius: 10, border: `1.5px solid ${C.border}`, background: C.surface2, color: C.text2, cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: 12 }}>Cancelar</button>
              <button onClick={importarDatos} disabled={!importText} style={{ flex: 2, padding: "10px", borderRadius: 10, border: "none", background: importText ? C.primary : C.border, color: importText ? "#fff" : C.text3, cursor: importText ? "pointer" : "not-allowed", fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 600 }}>Restaurar</button>
            </div>
          </div>
        )}

        {/* ── SAVE BUTTON ── */}
        <div style={{ marginTop: 10 }}>
          <button onClick={guardarTodo} style={{
            width: "100%", padding: "15px", borderRadius: 14, cursor: "pointer",
            fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600,
            background: savedMsg === "ok" ? C.success : unsaved ? C.primary : C.surface2,
            color: savedMsg === "ok" ? "#fff" : unsaved ? "#fff" : C.text3,
            border: `1.5px solid ${savedMsg === "ok" ? C.success : unsaved ? C.primary : C.border}`,
            boxShadow: savedMsg === "ok" ? C.shadow2 : unsaved ? C.shadow3 : C.shadow,
            transition: "all 0.3s",
          }}>
            {savedMsg === "saving" ? "⏳ Guardando..." : savedMsg === "ok" ? "✓ Guardado" : savedMsg === "error" ? "✗ Error" : unsaved ? "⏳ Guardando automáticamente..." : "✓ Todo guardado"}
          </button>
        </div>

      </div>
    </div>
  );
}
