import { useState, useEffect } from "react";

const fmt = (n) => new Intl.NumberFormat("es-UY", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.abs(n));
const timeNow = () => new Date().toLocaleDateString("es-UY", { day: "2-digit", month: "2-digit" });
const STORAGE_KEY = "finanzas_jun26";
const TC = 41;

const C = {
  bg:"#f0f2f8",surface:"#ffffff",surface2:"#f7f8fc",
  primary:"#4f46e5",primaryBg:"#eef2ff",
  success:"#059669",successBg:"#ecfdf5",
  danger:"#dc2626",dangerBg:"#fef2f2",
  warning:"#d97706",warningBg:"#fffbeb",
  purple:"#7c3aed",
  text:"#111827",text2:"#6b7280",text3:"#9ca3af",
  border:"#e5e7eb",
  shadow:"0 1px 3px rgba(0,0,0,0.08)",
  shadow2:"0 4px 16px rgba(79,70,229,0.10)",
};

const BANK = { itau:"#FF6200", scotia:"#EC111A", bbva:"#004B9E", santander:"#CC0000", debsantander:"#CC0000" };

const PLAN_BASE = [
  { id:"mesada",      fecha:"1/06",   concepto:"Mesada Guillermina",  monto:7500,  tipo:"fijo",    expandible:true },
  { id:"itau",        fecha:"~4/06",  concepto:"Itaú",                monto:0,     tipo:"tarjeta", editable:true },
  { id:"scotia",      fecha:"~7/06",  concepto:"Scotiabank",          monto:0,     tipo:"tarjeta", editable:true },
  { id:"alquiler",    fecha:"10/06",  concepto:"Alquiler",            monto:32000, tipo:"fijo",    urgente:true },
  { id:"tributos",    fecha:"14/06",  concepto:"Tributos",            monto:650,   tipo:"fijo" },
  { id:"bbva",        fecha:"~15/06", concepto:"BBVA",                monto:0,     tipo:"tarjeta", editable:true },
  { id:"santander",   fecha:"~20/06", concepto:"Santander",           monto:0,     tipo:"tarjeta", editable:true },
  { id:"gascom",      fecha:"20/06",  concepto:"Gastos comunes",      monto:4500,  tipo:"fijo" },
  { id:"telfijo",     fecha:"20/06",  concepto:"Teléfono fijo",       monto:1700,  tipo:"fijo",    variable:true },
  { id:"celguille",   fecha:"20/06",  concepto:"Cel Guillermina",     monto:620,   tipo:"fijo" },
  { id:"cosem",       fecha:"~20/06", concepto:"Médica Uruguaya",      monto:3800,  tipo:"fijo" },
  { id:"lentes",      fecha:"~20/06", concepto:"Lentes (2/10)",       monto:2080,  tipo:"fijo" },
  { id:"ute",         fecha:"29/06",  concepto:"UTE (luz)",           monto:4500,  tipo:"fijo",    variable:true },
  { id:"debsantander",fecha:"30/06",  concepto:"Débito Santander",    monto:875,   tipo:"fijo" },
  { id:"comida",      fecha:"Todo el mes", concepto:"Comida + Transporte", monto:28000, tipo:"variable", expandible:true },
];

const TARJETAS = [
  { id:"bbva",      nombre:"BBVA",       color:"#004B9E", vto:"~15/06" },
  { id:"scotia",    nombre:"Scotiabank", color:"#EC111A", vto:"~07/06" },
  { id:"itau",      nombre:"Itaú",       color:"#FF6200", vto:"~04/06" },
  { id:"santander", nombre:"Santander",  color:"#CC0000", vto:"~20/06" },
];

const FIJOS = [
  { concepto:"Alquiler",           monto:32000, vto:10, icono:"🏠" },
  { concepto:"Mesada Guillermina", monto:7500,  vto:1,  icono:"👧" },
  { concepto:"Comida+Transporte",  monto:28000, vto:0,  icono:"🍔" },
  { concepto:"Gastos comunes",     monto:4500,  vto:20, icono:"🏢" },
  { concepto:"UTE",                monto:4500,  vto:29, icono:"💡" },
  { concepto:"Teléfono fijo",      monto:1700,  vto:20, icono:"📞" },
  { concepto:"Cel Guillermina",    monto:620,   vto:20, icono:"📱" },
  { concepto:"Tributos",           monto:650,   vto:14, icono:"🏛️" },
  { concepto:"Débito Santander",   monto:875,   vto:30, icono:"💳" },
  { concepto:"Médica Uruguaya",    monto:3800,  vto:20, icono:"🏥" },
  { concepto:"Lentes",             monto:2080,  vto:20, icono:"👓" },
];

const SUSCS = [
  { concepto:"YouTube Premium",    tarjeta:"Santander", color:"#CC0000", monto:410,  usd:9.99,  icono:"🎬" },
  { concepto:"Antel Móvil",        tarjeta:"Santander", color:"#CC0000", monto:635,  usd:0,     icono:"📱" },
  { concepto:"Claude (Anthropic)", tarjeta:"Itaú",      color:"#FF6200", monto:205,  usd:5.00,  icono:"🤖" },
  { concepto:"Apple U$S 2.99",     tarjeta:"Itaú",      color:"#FF6200", monto:123,  usd:2.99,  icono:"🍎" },
  { concepto:"Apple U$S 4.99",     tarjeta:"Itaú",      color:"#FF6200", monto:205,  usd:4.99,  icono:"🍎" },
  { concepto:"Google One",         tarjeta:"Santander", color:"#CC0000", monto:126,  usd:3.08,  icono:"☁️" },
  { concepto:"Seguro SURA",        tarjeta:"Santander", color:"#CC0000", monto:2435, usd:0,     icono:"🔒" },
  { concepto:"Calistenia",         tarjeta:"Santander", color:"#CC0000", monto:1900, usd:0,     icono:"🏋️" },
];

const ICONOS = { mesada:"👧",itau:"💳",scotia:"💳",alquiler:"🏠",tributos:"🏛️",bbva:"💳",santander:"💳",gascom:"🏢",telfijo:"📞",celguille:"📱",cosem:"🏥",lentes:"👓",ute:"💡",debsantander:"💳",comida:"🍔" };

export default function App() {
  const [ready, setReady]     = useState(false);
  const [tab, setTab]         = useState("junio");
  const [pagados, setPagados] = useState([]);
  const [subs, setSubs]       = useState({});
  const [ingresos, setIngresos] = useState([]);
  const [tMontos, setTMontos] = useState({});
  const [extras, setExtras]   = useState([]);
  const [varM, setVarM]       = useState({});
  const [expando, setExpando] = useState(null);
  const [editT, setEditT]     = useState(null);
  const [editV, setEditV]     = useState(null);
  const [inT, setInT]         = useState({ p:"", u:"" });
  const [inV, setInV]         = useState("");
  const [inSub, setInSub]     = useState({ d:"", m:"" });
  const [inF, setInF]         = useState("");
  const [inFL, setInFL]       = useState("");
  const [showF, setShowF]     = useState(false);
  const [showH, setShowH]     = useState(false);
  const [editI, setEditI]     = useState(null);
  const [editIM, setEditIM]   = useState("");
  const [showN, setShowN]     = useState(false);
  const [nItem, setNItem]     = useState({ c:"", m:"", f:"" });
  const [saved, setSaved]     = useState("");
  const [dirty, setDirty]     = useState(false);
  const [showEx, setShowEx]   = useState(false);
  const [showIm, setShowIm]   = useState(false);
  const [imTxt, setImTxt]     = useState("");
  const [imMsg, setImMsg]     = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (d.pagados)  setPagados(d.pagados);
        if (d.subs)     setSubs(d.subs);
        if (d.ingresos) setIngresos(d.ingresos);
        if (d.tMontos)  setTMontos(d.tMontos);
        if (d.extras)   setExtras(d.extras);
        if (d.varM)     setVarM(d.varM);
      }
    } catch(e) {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    setDirty(true);
    const t = setTimeout(() => {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ pagados,subs,ingresos,tMontos,extras,varM })); setDirty(false); } catch(e) {}
    }, 800);
    return () => clearTimeout(t);
  }, [pagados, subs, ingresos, tMontos, extras, varM, ready]);

  const save = () => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ pagados,subs,ingresos,tMontos,extras,varM })); setSaved("ok"); setDirty(false); setTimeout(()=>setSaved(""),2000); } catch(e) { setSaved("err"); setTimeout(()=>setSaved(""),3000); }
  };

  const plan = [...PLAN_BASE, ...extras];

  const gM = (item) => {
    if (item.editable)   return tMontos[item.id]?.p || 0;
    if (item.variable)   return varM[item.id] || item.monto;
    if (item.expandible) return Math.max(0, item.monto - (subs[item.id]||[]).reduce((a,b)=>a+b.m,0));
    return item.monto;
  };

  const facturado  = ingresos.reduce((a,b)=>a+b.m,0);
  const subTotal   = Object.values(subs).flat().reduce((a,b)=>a+b.m,0);
  const pagadoSum  = plan.filter(i=>pagados.includes(i.id)&&i.id!=="mesada").reduce((a,b)=>a+gM(b)+(b.editable?(tMontos[b.id]?.u||0)*TC:0),0);
  const disponible = facturado - pagadoSum - subTotal;
  const porPagar   = plan.filter(i=>!pagados.includes(i.id)).reduce((a,b)=>a+gM(b)+(b.editable&&!pagados.includes(b.id)?(tMontos[b.id]?.u||0)*TC:0),0);
  const totalPago  = plan.filter(i=>pagados.includes(i.id)).reduce((a,b)=>a+gM(b)+(b.editable?(tMontos[b.id]?.u||0)*TC:0),0);
  const totalMes   = plan.reduce((a,b)=>a+gM(b)+(b.editable?(tMontos[b.id]?.u||0)*TC:0),0);
  const pct        = totalMes>0 ? Math.min(100,Math.round(((totalPago+subTotal)/totalMes)*100)) : 0;
  const necesita   = Math.max(0, porPagar - disponible);

  if (!ready) return <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Inter,sans-serif",color:C.primary}}>Cargando...</div>;

  const iS = (x={}) => ({background:C.surface2,border:`1.5px solid ${C.border}`,borderRadius:10,color:C.text,padding:"9px 12px",fontSize:13,fontFamily:"Inter,sans-serif",outline:"none",...x});

  const backup = () => JSON.stringify({pagados,subs,ingresos,tMontos,extras,varM});

  const importar = () => {
    try {
      const d = JSON.parse(imTxt);
      if(d.pagados)  setPagados(d.pagados);
      if(d.subs)     setSubs(d.subs);
      if(d.ingresos) setIngresos(d.ingresos);
      if(d.tMontos)  setTMontos(d.tMontos);
      if(d.extras)   setExtras(d.extras);
      if(d.varM)     setVarM(d.varM);
      setImMsg("✓ Restaurado"); setImTxt("");
      setTimeout(()=>{setImMsg("");setShowIm(false);},2000);
    } catch { setImMsg("✗ Texto inválido"); }
  };

  const r = 52; const cx=70; const cy=70;
  const circ = 2*Math.PI*r;
  const dash = circ*pct/100;
  const tot = Math.abs(disponible)+Math.abs(porPagar)||1;
  const dp = Math.min(100,(Math.max(0,disponible)/tot)*100);

  return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"Inter,sans-serif",maxWidth:430,margin:"0 auto",paddingBottom:30}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');*{box-sizing:border-box;margin:0;padding:0}@keyframes fu{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}input::placeholder{color:${C.text3}}input:focus{border-color:${C.primary}!important;outline:none}`}</style>

      {/* HEADER */}
      <div style={{background:"linear-gradient(135deg,#4f46e5,#7c3aed)",padding:"28px 20px 22px",borderRadius:"0 0 28px 28px"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:20}}>
          <div>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.6)",letterSpacing:2,textTransform:"uppercase"}}>Junio 2026</div>
            <div style={{fontSize:24,fontWeight:700,color:"#fff",marginTop:3}}>Mis Finanzas</div>
          </div>
          <div style={{background:"rgba(255,255,255,0.15)",borderRadius:12,padding:"6px 12px",fontSize:11,color:"rgba(255,255,255,0.85)"}}>Nicolás</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <div style={{background:"rgba(255,255,255,0.12)",borderRadius:16,padding:14}}>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.6)",marginBottom:4}}>DISPONIBLE</div>
            <div style={{fontSize:22,fontWeight:700,color:disponible<0?"#fca5a5":"#fff"}}>{disponible<0?"-$":"$"}{fmt(disponible)}</div>
            <div style={{fontSize:9,color:"rgba(255,255,255,0.5)",marginTop:2}}>${fmt(facturado)} facturado</div>
          </div>
          <div style={{background:"rgba(255,255,255,0.12)",borderRadius:16,padding:14}}>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.6)",marginBottom:4}}>POR PAGAR</div>
            <div style={{fontSize:22,fontWeight:700,color:porPagar===0?"#6ee7b7":"#fca5a5"}}>{porPagar===0?"✓ OK":"$"+fmt(porPagar)}</div>
            <div style={{fontSize:9,color:necesita>0?"#fca5a5":"#6ee7b7",marginTop:2}}>{necesita>0?`faltan $${fmt(necesita)}`:porPagar>0?"cubierto ✓":"todo pago ✓"}</div>
          </div>
        </div>
      </div>

      <div style={{padding:"16px 16px 0"}}>

        {/* DONUT */}
        <div style={{background:C.surface,borderRadius:20,padding:20,boxShadow:C.shadow2,marginBottom:14}}>
          <div style={{fontSize:12,fontWeight:600,marginBottom:14}}>Resumen del mes · {pct}% pagado</div>
          <div style={{display:"flex",alignItems:"center",gap:20}}>
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.border} strokeWidth="10"/>
              <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.primary} strokeWidth="10" strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" transform={`rotate(-90 ${cx} ${cy})`} style={{transition:"stroke-dasharray 1s"}}/>
              <text x={cx} y={cy-7} textAnchor="middle" fill={C.text} fontSize="20" fontWeight="700" fontFamily="Inter,sans-serif">{pct}%</text>
              <text x={cx} y={cy+10} textAnchor="middle" fill={C.text2} fontSize="10" fontFamily="Inter,sans-serif">pagado</text>
            </svg>
            <div style={{flex:1}}>
              <div style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:11,color:C.text2}}>Disponible</span>
                  <span style={{fontSize:16,fontWeight:700,color:disponible<0?C.danger:C.success}}>{disponible<0?"-$":"$"}{fmt(disponible)}</span>
                </div>
                <div style={{height:4,background:C.border,borderRadius:99}}><div style={{height:"100%",width:`${dp}%`,background:C.success,borderRadius:99,transition:"width 0.8s"}}/></div>
              </div>
              <div>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:11,color:C.text2}}>Por pagar</span>
                  <span style={{fontSize:16,fontWeight:700,color:porPagar===0?C.success:C.danger}}>{porPagar===0?"✓ OK":"$"+fmt(porPagar)}</span>
                </div>
                <div style={{height:4,background:C.border,borderRadius:99}}><div style={{height:"100%",width:`${Math.min(100,(porPagar/tot)*100)}%`,background:"#fca5a5",borderRadius:99,transition:"width 0.8s"}}/></div>
              </div>
            </div>
          </div>
        </div>

        {/* FACTURADO */}
        <div style={{background:C.surface,borderRadius:20,padding:18,boxShadow:C.shadow2,marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:10,color:C.text2,textTransform:"uppercase",letterSpacing:1}}>Facturado</div>
              <div style={{fontSize:22,fontWeight:700,color:C.primary,marginTop:2}}>${fmt(facturado)}</div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>setShowH(v=>!v)} style={{background:C.surface2,width:38,height:38,color:C.text2,fontSize:14,border:`1.5px solid ${C.border}`,borderRadius:10,cursor:"pointer"}}>{showH?"▲":"▼"}</button>
              <button onClick={()=>setShowF(v=>!v)} style={{background:showF?C.surface2:C.primary,width:38,height:38,color:showF?C.text2:"#fff",fontSize:22,fontWeight:700,border:"none",borderRadius:10,cursor:"pointer",boxShadow:showF?"none":C.shadow2}}>{showF?"×":"+"}</button>
            </div>
          </div>
          {showF && <div style={{marginTop:12}}>
            <input type="text" value={inFL} onChange={e=>setInFL(e.target.value)} placeholder="Descripción (opcional)" style={{...iS(),width:"100%",marginBottom:8}}/>
            <div style={{display:"flex",gap:8}}>
              <input type="number" value={inF} onChange={e=>setInF(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){const v=parseFloat(inF);if(!isNaN(v)&&v>0){setIngresos(p=>[...p,{id:Date.now(),m:v,l:inFL||"Facturado",f:timeNow()}]);setInF("");setInFL("");setShowF(false);}}}} placeholder="Monto $" autoFocus style={{...iS({border:`1.5px solid ${C.primary}`}),flex:1}}/>
              <button onClick={()=>{const v=parseFloat(inF);if(!isNaN(v)&&v>0){setIngresos(p=>[...p,{id:Date.now(),m:v,l:inFL||"Facturado",f:timeNow()}]);setInF("");setInFL("");setShowF(false);}}} style={{background:C.success,padding:"0 16px",color:"#fff",fontWeight:600,height:42,borderRadius:10,border:"none",cursor:"pointer"}}>✓</button>
            </div>
          </div>}
          {showH && <div style={{marginTop:12,borderTop:`1px solid ${C.border}`,paddingTop:12}}>
            {ingresos.length===0&&<div style={{fontSize:12,color:C.text3,textAlign:"center",padding:8}}>Sin ingresos cargados</div>}
            {ingresos.map(ing=>(
              <div key={ing.id} style={{marginBottom:8}}>
                {editI===ing.id
                  ? <div style={{display:"flex",gap:8}}><input type="number" value={editIM} onChange={e=>setEditIM(e.target.value)} autoFocus style={{...iS(),flex:1}}/><button onClick={()=>{const v=parseFloat(editIM);if(!isNaN(v)&&v>0)setIngresos(p=>p.map(i=>i.id===ing.id?{...i,m:v}:i));setEditI(null);}} style={{background:C.success,padding:"0 12px",color:"#fff",fontWeight:700,height:42,borderRadius:10,border:"none",cursor:"pointer"}}>✓</button><button onClick={()=>setEditI(null)} style={{background:C.surface2,padding:"0 10px",color:C.text2,height:42,border:`1.5px solid ${C.border}`,borderRadius:10,cursor:"pointer"}}>×</button></div>
                  : <div style={{display:"flex",gap:8}}><div onClick={()=>{setEditI(ing.id);setEditIM(String(ing.m));}} style={{flex:1,background:C.surface2,borderRadius:10,padding:"9px 12px",cursor:"pointer",border:`1.5px solid ${C.border}`}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:12,color:C.text2}}>{ing.l}</span><span style={{fontSize:13,fontWeight:600,color:C.success}}>${fmt(ing.m)}</span></div><div style={{fontSize:10,color:C.text3}}>{ing.f}</div></div><button onClick={()=>setIngresos(p=>p.filter(i=>i.id!==ing.id))} style={{background:C.dangerBg,border:`1.5px solid #fca5a5`,padding:"0 10px",color:C.danger,height:42,fontWeight:700,borderRadius:10,cursor:"pointer"}}>✕</button></div>
                }
              </div>
            ))}
          </div>}
        </div>

        {/* TABS */}
        <div style={{background:C.surface,borderRadius:14,padding:4,display:"flex",gap:2,marginBottom:14,boxShadow:C.shadow}}>
          {[["junio","Junio"],["tarjetas","Tarjetas"],["fijos","Fijos"]].map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)} style={{flex:1,padding:"9px 4px",borderRadius:10,border:"none",cursor:"pointer",fontSize:10,fontFamily:"Inter,sans-serif",fontWeight:600,textTransform:"uppercase",letterSpacing:0.5,background:tab===id?C.primary:"transparent",color:tab===id?"#fff":C.text2,boxShadow:tab===id?C.shadow2:"none",transition:"all 0.2s"}}>{label}</button>
          ))}
        </div>

        {/* TAB JUNIO */}
        {tab==="junio"&&<div style={{animation:"fu 0.3s"}}>
          <div style={{fontSize:10,color:C.text3,fontWeight:600,letterSpacing:1,textTransform:"uppercase",marginBottom:10}}>Tocá = pagado · Doble toque en tarjetas = cargar monto</div>
          {plan.map(item=>{
            const paid=pagados.includes(item.id);
            const isOpen=expando===item.id;
            const monto=gM(item);
            const gastado=(subs[item.id]||[]).reduce((a,b)=>a+b.m,0);
            const restante=Math.max(0,item.monto-gastado);
            const showET=item.editable&&editT===item.id&&!paid;
            const showEV=item.variable&&editV===item.id&&!paid;
            const panelOpen=isOpen||showET||showEV;
            const bColor=paid?C.success:item.urgente?"#fca5a5":C.border;
            const bLeft=item.editable&&!paid?`4px solid ${BANK[item.id]||C.primary}`:undefined;
            const iBg=paid?C.success:item.editable?(BANK[item.id]||C.primary)+"22":item.urgente?C.dangerBg:item.expandible?C.primaryBg:C.surface2;
            const iColor=paid?"#fff":item.editable?(BANK[item.id]||C.primary):"inherit";
            return (
              <div key={item.id} style={{marginBottom:8}}>
                <div onClick={()=>{if(item.expandible)setExpando(isOpen?null:item.id);else togglePago(item.id);}} onDoubleClick={()=>{if(item.editable&&!paid){setEditT(editT===item.id?null:item.id);setInT({p:String(tMontos[item.id]?.p||""),u:String(tMontos[item.id]?.u||"")});}else if(item.variable&&!paid){setEditV(editV===item.id?null:item.id);setInV(String(varM[item.id]||item.monto));}}} style={{background:paid?"#f0fdf4":C.surface,borderRadius:panelOpen?"14px 14px 0 0":14,padding:"13px 14px",boxShadow:paid?"0 2px 12px rgba(5,150,105,0.18)":C.shadow,border:`2px solid ${bColor}`,borderLeft:bLeft,borderBottom:panelOpen?"none":undefined,display:"flex",alignItems:"center",gap:12,cursor:"pointer",transition:"all 0.15s"}}>
                  <div style={{width:36,height:36,borderRadius:12,flexShrink:0,background:iBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:paid?16:18,color:iColor,fontWeight:paid?700:400,boxShadow:paid?"0 2px 8px rgba(5,150,105,0.3)":"none"}}>{paid?"✓":ICONOS[item.id]||(item.tipo==="extra"?"⭐":"📋")}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:600,color:paid?C.text3:C.text,textDecoration:paid?"line-through":"none",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{item.concepto}</div>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginTop:3,flexWrap:"wrap"}}>
                      <span style={{fontSize:11,fontWeight:600,color:C.text2}}>{item.fecha}</span>
                      {item.urgente&&!paid&&<span style={{fontSize:9,fontWeight:600,color:C.danger,background:C.dangerBg,borderRadius:99,padding:"2px 7px"}}>urgente</span>}
                      {item.editable&&!paid&&monto===0&&<span style={{fontSize:9,fontWeight:600,color:C.warning,background:C.warningBg,borderRadius:99,padding:"2px 7px"}}>doble toque para cargar</span>}
                      {item.variable&&!paid&&<span style={{fontSize:9,color:C.text3}}>doble toque para editar</span>}
                      {item.expandible&&gastado>0&&<span style={{fontSize:9,fontWeight:600,color:C.primary,background:C.primaryBg,borderRadius:99,padding:"2px 7px"}}>${fmt(gastado)} usado</span>}
                    </div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{fontSize:14,fontWeight:700,color:paid?C.success:item.editable?(BANK[item.id]||C.primary):item.urgente?C.danger:C.text2}}>
                      {item.editable?(monto>0?"$"+fmt(monto):<span style={{fontSize:11,color:C.text3}}>—</span>):"$"+fmt(item.expandible?restante:monto)}
                    </div>
                    {item.expandible&&<div style={{fontSize:9,color:C.text3}}>de ${fmt(item.monto)}</div>}
                    {item.editable&&tMontos[item.id]?.u>0&&<div style={{fontSize:9,color:C.purple}}>+ U$S {tMontos[item.id].u.toFixed(2)}</div>}
                  </div>
                  {item.tipo==="extra"&&!paid&&<div onClick={e=>{e.stopPropagation();setExtras(p=>p.filter(i=>i.id!==item.id));}} style={{color:C.text3,fontSize:12,padding:"4px 6px",cursor:"pointer"}}>✕</div>}
                  {item.expandible&&<div style={{fontSize:11,color:C.text3}}>{isOpen?"▲":"▼"}</div>}
                </div>
                {showET&&<div style={{background:C.primaryBg,border:`1.5px solid ${BANK[item.id]||C.primary}44`,borderTop:"none",borderRadius:"0 0 14px 14px",padding:12}}>
                  <div style={{fontSize:10,color:C.primary,fontWeight:600,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Monto del estado de cuenta</div>
                  <div style={{display:"flex",gap:8,marginBottom:8}}>
                    <input type="number" value={inT.p} onChange={e=>setInT(v=>({...v,p:e.target.value}))} placeholder="Monto $" autoFocus style={{...iS({border:`1.5px solid ${C.primary}`}),flex:1}}/>
                    <input type="number" value={inT.u} onChange={e=>setInT(v=>({...v,u:e.target.value}))} placeholder="U$S" style={{...iS(),width:80}}/>
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={()=>setEditT(null)} style={{flex:1,padding:"9px",borderRadius:10,border:`1.5px solid ${C.border}`,background:C.surface2,color:C.text2,cursor:"pointer",fontFamily:"Inter,sans-serif",fontSize:12}}>Cancelar</button>
                    <button onClick={()=>{const p2=parseFloat(inT.p)||0;const u=parseFloat(inT.u)||0;setTMontos(v=>({...v,[item.id]:{p:p2,u}}));setEditT(null);}} style={{flex:2,padding:"9px",borderRadius:10,border:"none",background:C.primary,color:"#fff",cursor:"pointer",fontFamily:"Inter,sans-serif",fontSize:12,fontWeight:600}}>Guardar</button>
                  </div>
                </div>}
                {showEV&&<div style={{background:C.warningBg,border:"1.5px solid #fde68a",borderTop:"none",borderRadius:"0 0 14px 14px",padding:12,display:"flex",gap:8}}>
                  <input type="number" value={inV} onChange={e=>setInV(e.target.value)} placeholder={`Actual: $${fmt(item.monto)}`} style={{...iS({flex:1,border:`1.5px solid ${C.warning}`}),flex:1}}/>
                  <button onClick={()=>{const v=parseFloat(inV);if(!isNaN(v)&&v>0){setVarM(m=>({...m,[item.id]:v}));setEditV(null);}}} style={{padding:"0 14px",height:42,borderRadius:10,border:"none",background:C.warning,color:"#fff",fontWeight:700,cursor:"pointer",fontFamily:"Inter,sans-serif"}}>✓</button>
                </div>}
                {isOpen&&<div style={{background:C.primaryBg,border:"1.5px solid #c7d2fe",borderTop:"none",borderRadius:"0 0 14px 14px",padding:12}}>
                  {(subs[item.id]||[]).length>0&&<div style={{marginBottom:10}}>
                    {(subs[item.id]||[]).map((s,i)=>(
                      <div key={s.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:i<(subs[item.id]||[]).length-1?"1px solid #e0e7ff":"none"}}>
                        <div><span style={{fontSize:12,color:C.text}}>{s.d}</span><span style={{fontSize:10,color:C.text3,marginLeft:8}}>{s.f}</span></div>
                        <div style={{display:"flex",gap:8,alignItems:"center"}}><span style={{fontSize:12,fontWeight:600,color:C.danger}}>-${fmt(s.m)}</span><button onClick={()=>setSubs(p=>({...p,[item.id]:p[item.id].filter(x=>x.id!==s.id)}))} style={{background:"none",border:"none",color:C.text3,cursor:"pointer",fontSize:11}}>✕</button></div>
                      </div>
                    ))}
                    <div style={{display:"flex",justifyContent:"space-between",marginTop:8}}><span style={{fontSize:11,color:C.text2}}>Restante</span><span style={{fontSize:14,fontWeight:700,color:restante<3000?C.danger:C.success}}>${fmt(restante)}</span></div>
                  </div>}
                  <div style={{display:"flex",gap:8}}>
                    <input type="text" value={inSub.d} onChange={e=>setInSub(p=>({...p,d:e.target.value}))} placeholder="¿Qué fue?" style={{...iS({border:"1.5px solid #c7d2fe"}),flex:1}}/>
                    <input type="number" value={inSub.m} onChange={e=>setInSub(p=>({...p,m:e.target.value}))} onKeyDown={e=>{if(e.key==="Enter"){const v=parseFloat(inSub.m);if(!isNaN(v)&&v>0){setSubs(p=>({...p,[item.id]:[...(p[item.id]||[]),{id:Date.now(),d:inSub.d||"Gasto",m:v,f:timeNow()}]}));setInSub({d:"",m:""});};}}} placeholder="$" style={{...iS({border:"1.5px solid #c7d2fe"}),width:75}}/>
                    <button onClick={()=>{const v=parseFloat(inSub.m);if(!isNaN(v)&&v>0){setSubs(p=>({...p,[item.id]:[...(p[item.id]||[]),{id:Date.now(),d:inSub.d||"Gasto",m:v,f:timeNow()}]}));setInSub({d:"",m:""});}}} style={{background:C.primary,padding:"0 12px",color:"#fff",fontWeight:700,height:42,borderRadius:10,border:"none",cursor:"pointer"}}>✓</button>
                  </div>
                </div>}
              </div>
            );
          })}
          {!showN
            ? <button onClick={()=>setShowN(true)} style={{width:"100%",background:C.surface,border:`1.5px dashed ${C.border}`,borderRadius:14,padding:"12px",color:C.text2,fontSize:12,fontFamily:"Inter,sans-serif",cursor:"pointer",marginTop:4}}>+ Agregar gasto extra</button>
            : <div style={{background:C.surface,borderRadius:14,padding:16,boxShadow:C.shadow2,marginTop:4,border:`1.5px solid ${C.border}`}}>
                <div style={{fontSize:11,color:C.text2,fontWeight:600,textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>Nuevo gasto</div>
                <input type="text" value={nItem.c} onChange={e=>setNItem(p=>({...p,c:e.target.value}))} placeholder="Descripción" style={{...iS(),width:"100%",marginBottom:8}}/>
                <div style={{display:"flex",gap:8,marginBottom:10}}>
                  <input type="text" value={nItem.f} onChange={e=>setNItem(p=>({...p,f:e.target.value}))} placeholder="Fecha" style={{...iS(),flex:1}}/>
                  <input type="number" value={nItem.m} onChange={e=>setNItem(p=>({...p,m:e.target.value}))} placeholder="Monto $" style={{...iS(),flex:1}}/>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>setShowN(false)} style={{flex:1,padding:"11px",borderRadius:10,border:`1.5px solid ${C.border}`,background:C.surface2,color:C.text2,cursor:"pointer",fontFamily:"Inter,sans-serif",fontSize:12}}>Cancelar</button>
                  <button onClick={()=>{const v=parseFloat(nItem.m);if(!nItem.c||isNaN(v)||v<=0)return;setExtras(p=>[...p,{id:"x"+Date.now(),fecha:nItem.f||"Junio",concepto:nItem.c,monto:v,tipo:"extra"}]);setNItem({c:"",m:"",f:""});setShowN(false);}} style={{flex:2,padding:"11px",borderRadius:10,border:"none",background:C.primary,color:"#fff",fontFamily:"Inter,sans-serif",fontSize:12,fontWeight:600,cursor:"pointer"}}>Agregar</button>
                </div>
              </div>
          }
        </div>}

        {/* TAB TARJETAS */}
        {tab==="tarjetas"&&<div style={{animation:"fu 0.3s"}}>
          <div style={{fontSize:10,color:C.text3,fontWeight:600,letterSpacing:1,textTransform:"uppercase",marginBottom:10}}>Vencimientos junio · Tocá para cargar monto</div>
          {TARJETAS.map(t=>{
            const tm=tMontos[t.id];
            const isPaid=pagados.includes(t.id);
            const isEditing=editT===t.id;
            return (
              <div key={t.id}>
                <div onClick={()=>{setEditT(isEditing?null:t.id);setInT({p:String(tm?.p||""),u:String(tm?.u||"")});}} style={{background:isPaid?"#f0fdf4":C.surface,borderRadius:isEditing?"16px 16px 0 0":16,padding:16,marginBottom:isEditing?0:10,boxShadow:C.shadow2,border:`1.5px solid ${isPaid?C.success:C.border}`,cursor:"pointer",transition:"all 0.2s"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:14,height:14,borderRadius:"50%",background:t.color,flexShrink:0}}/>
                      <div>
                        <div style={{fontSize:15,fontWeight:700,color:isPaid?C.text3:C.text,textDecoration:isPaid?"line-through":"none"}}>{t.nombre}</div>
                        <div style={{fontSize:12,fontWeight:600,color:C.warning,marginTop:2}}>Vto: {t.vto}</div>
                      </div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:18,fontWeight:700,color:isPaid?C.success:tm?.p?t.color:C.text3}}>{tm?.p?"$"+fmt(tm.p):<span style={{fontSize:13}}>Tocá para cargar</span>}</div>
                      {tm?.u>0&&<div style={{fontSize:10,color:C.purple}}>+ U$S {tm.u.toFixed(2)} (~${fmt(Math.round(tm.u*TC))})</div>}
                    </div>
                  </div>
                  <div style={{height:4,background:C.border,borderRadius:99}}><div style={{height:"100%",width:tm?.p?`${Math.min(100,(tm.p/35000)*100)}%`:"0%",background:t.color,borderRadius:99,transition:"width 0.8s"}}/></div>
                </div>
                {isEditing&&<div style={{background:C.primaryBg,border:`1.5px solid ${C.primary}44`,borderTop:"none",borderRadius:"0 0 16px 16px",padding:14,marginBottom:10}}>
                  <div style={{fontSize:10,color:C.primary,fontWeight:600,textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>Monto del estado de cuenta</div>
                  <div style={{display:"flex",gap:8,marginBottom:10}}>
                    <input type="number" value={inT.p} onChange={e=>setInT(v=>({...v,p:e.target.value}))} placeholder="Monto $" autoFocus style={{...iS({flex:1,border:`1.5px solid ${C.primary}`}),flex:1}}/>
                    <input type="number" value={inT.u} onChange={e=>setInT(v=>({...v,u:e.target.value}))} placeholder="U$S (opcional)" style={{...iS(),flex:1}}/>
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={()=>setEditT(null)} style={{flex:1,padding:"10px",borderRadius:10,border:`1.5px solid ${C.border}`,background:C.surface2,color:C.text2,cursor:"pointer",fontFamily:"Inter,sans-serif",fontSize:12}}>Cancelar</button>
                    <button onClick={()=>{const p2=parseFloat(inT.p)||0;const u=parseFloat(inT.u)||0;setTMontos(v=>({...v,[t.id]:{p:p2,u}}));setEditT(null);}} style={{flex:2,padding:"10px",borderRadius:10,border:"none",background:C.primary,color:"#fff",cursor:"pointer",fontFamily:"Inter,sans-serif",fontSize:12,fontWeight:600}}>Guardar</button>
                  </div>
                </div>}
              </div>
            );
          })}
          <div style={{background:C.surface,borderRadius:16,padding:16,boxShadow:C.shadow2,border:`1.5px solid ${C.primary}44`}}>
            {(()=>{
              const act=TARJETAS.filter(t=>!pagados.includes(t.id)&&tMontos[t.id]?.p);
              const tP=act.reduce((a,t)=>a+(tMontos[t.id]?.p||0),0);
              const tU=act.reduce((a,t)=>a+(tMontos[t.id]?.u||0),0);
              return <>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:12,color:C.text2}}>Total pesos pendiente</span><span style={{fontSize:15,fontWeight:700,color:C.primary}}>${fmt(tP)}</span></div>
                {tU>0&&<div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:12,color:C.text2}}>Total dólares</span><span style={{fontSize:12,color:C.purple}}>U$S {tU.toFixed(2)} (~${fmt(Math.round(tU*TC))})</span></div>}
                <div style={{height:1,background:C.border,margin:"4px 0 10px"}}/>
                <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:13,fontWeight:600,color:C.text}}>Total combinado</span><span style={{fontSize:18,fontWeight:700,color:C.primary}}>${fmt(tP+Math.round(tU*TC))}</span></div>
              </>;
            })()}
          </div>
        </div>}

        {/* TAB FIJOS */}
        {tab==="fijos"&&<div style={{animation:"fu 0.3s"}}>
          <div style={{fontSize:10,color:C.text3,fontWeight:600,letterSpacing:1,textTransform:"uppercase",marginBottom:10}}>Gastos fijos mensuales</div>
          {[...FIJOS].sort((a,b)=>a.vto-b.vto).map(g=>(
            <div key={g.concepto} style={{background:C.surface,borderRadius:12,padding:"12px 14px",marginBottom:8,boxShadow:C.shadow,border:`1.5px solid ${C.border}`,display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:36,height:36,borderRadius:10,background:C.primaryBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{g.icono}</div>
              <div style={{flex:1}}><div style={{fontSize:13,fontWeight:500,color:C.text}}>{g.concepto}</div><div style={{fontSize:10,color:C.text3,marginTop:2}}>{g.vto>0?`Vence día ${g.vto}`:"Variable"}</div></div>
              <div style={{fontSize:13,fontWeight:600,color:C.text2}}>${fmt(g.monto)}</div>
            </div>
          ))}
          <div style={{background:C.surface,borderRadius:14,padding:16,marginTop:4,boxShadow:C.shadow2,border:`1.5px solid ${C.primary}44`,marginBottom:20}}>
            <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:13,color:C.text2}}>Total fijos/mes</span><span style={{fontSize:18,fontWeight:700,color:C.primary}}>${fmt(FIJOS.reduce((a,b)=>a+b.monto,0))}</span></div>
          </div>
          <div style={{fontSize:10,color:C.text3,fontWeight:600,letterSpacing:1,textTransform:"uppercase",marginBottom:10}}>Suscripciones en tarjeta</div>
          <div style={{fontSize:10,color:"#92400e",background:"#fffbeb",borderRadius:8,padding:"6px 10px",border:"1px solid #fde68a",marginBottom:10}}>⚠️ Ya incluidas en el estado de cada tarjeta</div>
          {SUSCS.map(s=>(
            <div key={s.concepto} style={{background:C.surface,borderRadius:12,padding:"12px 14px",marginBottom:8,boxShadow:C.shadow,border:`1.5px solid ${C.border}`,display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:36,height:36,borderRadius:10,background:s.color+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{s.icono}</div>
              <div style={{flex:1}}><div style={{fontSize:13,fontWeight:500,color:C.text}}>{s.concepto}</div><div style={{display:"flex",alignItems:"center",gap:6,marginTop:2}}><div style={{width:8,height:8,borderRadius:"50%",background:s.color}}/><span style={{fontSize:10,color:C.text3}}>{s.tarjeta}</span>{s.usd>0&&<span style={{fontSize:10,color:C.purple}}>U$S {s.usd}</span>}</div></div>
              <div style={{fontSize:13,fontWeight:600,color:C.text2}}>${fmt(s.monto)}</div>
            </div>
          ))}
          <div style={{background:C.surface,borderRadius:14,padding:14,border:`1.5px solid ${C.border}`,boxShadow:C.shadow}}>
            <div style={{display:"flex",justifyContent:"space-between"}}><div><div style={{fontSize:12,color:C.text2,fontWeight:500}}>Total suscripciones</div><div style={{fontSize:10,color:C.text3}}>Ya en estados de tarjeta</div></div><span style={{fontSize:16,fontWeight:700,color:C.text2}}>${fmt(SUSCS.reduce((a,b)=>a+b.monto,0))}</span></div>
          </div>
        </div>}

        {/* BACKUP */}
        <div style={{marginTop:20,display:"flex",gap:8}}>
          <button onClick={()=>{setShowEx(v=>!v);setShowIm(false);}} style={{flex:1,padding:"12px",borderRadius:12,cursor:"pointer",fontFamily:"Inter,sans-serif",fontSize:12,fontWeight:600,background:showEx?C.primaryBg:C.surface,color:C.primary,border:`1.5px solid ${C.primary}`,boxShadow:C.shadow}}>📤 Backup</button>
          <button onClick={()=>{setShowIm(v=>!v);setShowEx(false);}} style={{flex:1,padding:"12px",borderRadius:12,cursor:"pointer",fontFamily:"Inter,sans-serif",fontSize:12,fontWeight:600,background:C.surface,color:C.text2,border:`1.5px solid ${C.border}`,boxShadow:C.shadow}}>📥 Restaurar</button>
        </div>
        {showEx&&<div style={{background:C.surface,borderRadius:14,padding:16,marginTop:10,border:`1.5px solid ${C.primary}44`,boxShadow:C.shadow}}>
          <div style={{fontSize:12,fontWeight:600,color:C.text,marginBottom:8}}>Tocá el texto → seleccionar todo → copiar → guardar en WhatsApp</div>
          <textarea readOnly value={backup()} rows={4} onClick={e=>e.target.select()} onFocus={e=>e.target.select()} style={{width:"100%",background:C.surface2,border:`1.5px solid ${C.border}`,borderRadius:8,color:C.text,padding:"8px 10px",fontSize:10,fontFamily:"monospace",resize:"none",outline:"none",cursor:"pointer"}}/>
        </div>}
        {showIm&&<div style={{background:C.surface,borderRadius:14,padding:16,marginTop:10,border:`1.5px solid ${C.border}`,boxShadow:C.shadow}}>
          <div style={{fontSize:12,fontWeight:600,color:C.text,marginBottom:10}}>Pegá el texto del backup</div>
          <textarea value={imTxt} onChange={e=>setImTxt(e.target.value)} placeholder="Pegá el texto acá..." rows={4} style={{width:"100%",background:C.surface2,border:`1.5px solid ${C.border}`,borderRadius:8,color:C.text,padding:"8px 10px",fontSize:10,fontFamily:"monospace",resize:"none",outline:"none"}}/>
          {imMsg&&<div style={{fontSize:11,color:imMsg.startsWith("✓")?C.success:C.danger,marginTop:6,fontWeight:600}}>{imMsg}</div>}
          <div style={{display:"flex",gap:8,marginTop:10}}>
            <button onClick={()=>{setShowIm(false);setImTxt("");}} style={{flex:1,padding:"10px",borderRadius:10,border:`1.5px solid ${C.border}`,background:C.surface2,color:C.text2,cursor:"pointer",fontFamily:"Inter,sans-serif",fontSize:12}}>Cancelar</button>
            <button onClick={importar} style={{flex:2,padding:"10px",borderRadius:10,border:"none",background:imTxt?C.primary:C.border,color:imTxt?"#fff":C.text3,cursor:imTxt?"pointer":"not-allowed",fontFamily:"Inter,sans-serif",fontSize:12,fontWeight:600}}>Restaurar</button>
          </div>
        </div>}

        {/* GUARDAR */}
        <div style={{marginTop:10}}>
          <button onClick={save} style={{width:"100%",padding:"15px",borderRadius:14,cursor:"pointer",fontFamily:"Inter,sans-serif",fontSize:13,fontWeight:600,background:saved==="ok"?C.success:dirty?C.primary:C.surface2,color:saved==="ok"?"#fff":dirty?"#fff":C.text3,border:`1.5px solid ${saved==="ok"?C.success:dirty?C.primary:C.border}`,transition:"all 0.3s"}}>
            {saved==="ok"?"✓ Guardado":saved==="err"?"✗ Error":dirty?"💾 Guardar cambios":"✓ Todo guardado"}
          </button>
        </div>

      </div>
    </div>
  );

  function togglePago(id) {
    if (plan.find(i=>i.id===id)?.expandible) return;
    setPagados(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  }
}
