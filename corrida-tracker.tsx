import { useState, useEffect, useCallback } from "react";

const C = {
  plum:"#3B1F3A", plumMid:"#5C3059", plumLight:"#7A4578",
  rose:"#C4899A", roseLight:"#DEB8C3", rosePale:"#F5E8ED",
  cream:"#FAF4F0", ink:"#1E1220", muted:"#8A6B84",
  success:"#6BAA8E", warn:"#D4956A", danger:"#C4606A",
  border:"#E8D5DF", card:"#FFFFFF",
};

const PLANO = [
  { semana:1, fase:"Adaptação — construindo a base", treinos:[
    {dia:"Ter",tipo:"Base leve",desc:"5 min caminhada → correr 7 km/h por 12 min → 5 min caminhada",pace:"~8'34\"/km",dur:22,km:2.0,incl:"1%"},
    {dia:"Qui",tipo:"Base leve",desc:"5 min caminhada → correr 7,5 km/h por 12 min → 5 min caminhada",pace:"~8'00\"/km",dur:22,km:2.1,incl:"1%"},
    {dia:"Sáb",tipo:"Longa leve",desc:"5 min caminhada → correr 7 km/h por 18 min → 5 min caminhada",pace:"~8'34\"/km",dur:28,km:2.5,incl:"1%"},
    {dia:"Dom",tipo:"Recuperação ativa",desc:"Caminhada 15 min + trote levíssimo 7 km/h por 8 min",pace:"~9'00\"/km",dur:23,km:1.7,incl:"0%"},
  ]},
  { semana:2, fase:"Adaptação — aumentando o tempo", treinos:[
    {dia:"Ter",tipo:"Progressivo leve",desc:"5 min caminhada → 7 km/h por 8 min → 8 km/h por 8 min → 5 min caminhada",pace:"~7'30\"/km",dur:26,km:2.5,incl:"1%"},
    {dia:"Qui",tipo:"Base",desc:"5 min caminhada → 7,5 km/h por 16 min → 5 min caminhada",pace:"~8'00\"/km",dur:26,km:2.7,incl:"1%"},
    {dia:"Sáb",tipo:"Longa leve",desc:"5 min caminhada → 7 km/h por 22 min → 5 min caminhada",pace:"~8'34\"/km",dur:32,km:3.0,incl:"1%"},
    {dia:"Dom",tipo:"Recuperação ativa",desc:"Caminhada 15 min + trote 6,5 km/h por 10 min",pace:"~9'14\"/km",dur:25,km:1.8,incl:"0%"},
  ]},
  { semana:3, fase:"Construção — primeiros 3km contínuos", treinos:[
    {dia:"Ter",tipo:"Progressivo",desc:"5 min caminhada → 7,5 km/h por 10 min → 8,5 km/h por 6 min → 5 min caminhada",pace:"~7'45\"/km",dur:26,km:2.7,incl:"1%"},
    {dia:"Qui",tipo:"Base",desc:"5 min caminhada → 7,5 km/h por 20 min → 5 min caminhada",pace:"~8'00\"/km",dur:30,km:3.0,incl:"1%"},
    {dia:"Sáb",tipo:"Longa — 3km contínuos",desc:"5 min caminhada → correr 7,5 km/h por 24 min sem parar → 5 min caminhada",pace:"~8'00\"/km",dur:34,km:3.3,incl:"1%"},
    {dia:"Dom",tipo:"Recuperação ativa",desc:"Caminhada 10 min + trote 6,5 km/h por 12 min",pace:"~9'14\"/km",dur:22,km:1.9,incl:"0%"},
  ]},
  { semana:4, fase:"Construção — consolidando 3km", treinos:[
    {dia:"Ter",tipo:"Progressivo",desc:"5 min caminhada → 8 km/h por 10 min → 9 km/h por 6 min → 5 min caminhada",pace:"~7'15\"/km",dur:26,km:2.8,incl:"1%"},
    {dia:"Qui",tipo:"Base",desc:"5 min caminhada → 8 km/h por 20 min → 5 min caminhada",pace:"~7'30\"/km",dur:30,km:3.2,incl:"1%"},
    {dia:"Sáb",tipo:"Longa — 3,5km",desc:"5 min caminhada → correr 7,5 km/h por 28 min → 5 min caminhada",pace:"~8'00\"/km",dur:38,km:3.7,incl:"1%"},
    {dia:"Dom",tipo:"Recuperação ativa",desc:"Caminhada 10 min + trote 7 km/h por 12 min",pace:"~8'34\"/km",dur:22,km:2.0,incl:"0%"},
  ]},
  { semana:5, fase:"Intensificação — chegando nos 4km", treinos:[
    {dia:"Ter",tipo:"Progressivo",desc:"5 min caminhada → 8 km/h por 10 min → 9,5 km/h por 6 min → 5 min caminhada",pace:"~7'00\"/km",dur:26,km:3.0,incl:"1%"},
    {dia:"Qui",tipo:"Base contínua",desc:"5 min caminhada → 8,5 km/h por 22 min → 5 min caminhada",pace:"~7'04\"/km",dur:32,km:3.6,incl:"1%"},
    {dia:"Sáb",tipo:"Longa — 4km",desc:"5 min caminhada → correr 8 km/h por 30 min → 5 min caminhada",pace:"~7'30\"/km",dur:40,km:4.2,incl:"1%"},
    {dia:"Dom",tipo:"Recuperação ativa",desc:"Caminhada 10 min + trote 7 km/h por 15 min",pace:"~8'34\"/km",dur:25,km:2.2,incl:"0%"},
  ]},
  { semana:6, fase:"Intensificação — acelerando o pace", treinos:[
    {dia:"Ter",tipo:"Progressivo",desc:"5 min caminhada → 8,5 km/h por 10 min → 10 km/h por 6 min → 5 min caminhada",pace:"~6'45\"/km",dur:26,km:3.1,incl:"1%"},
    {dia:"Qui",tipo:"Base contínua",desc:"5 min caminhada → 9 km/h por 22 min → 5 min caminhada",pace:"~6'40\"/km",dur:32,km:3.8,incl:"1%"},
    {dia:"Sáb",tipo:"Longa — 4,5km",desc:"5 min caminhada → correr 8,5 km/h por 32 min → 5 min caminhada",pace:"~7'04\"/km",dur:42,km:4.7,incl:"1%"},
    {dia:"Dom",tipo:"Recuperação ativa",desc:"Caminhada 10 min + trote 7,5 km/h por 15 min",pace:"~8'00\"/km",dur:25,km:2.4,incl:"0%"},
  ]},
  { semana:7, fase:"Aproximação — 5km quase lá", treinos:[
    {dia:"Ter",tipo:"Progressivo forte",desc:"5 min caminhada → 9 km/h por 10 min → 10 km/h por 8 min → 5 min caminhada",pace:"~6'30\"/km",dur:28,km:3.3,incl:"1%"},
    {dia:"Qui",tipo:"Base contínua",desc:"5 min caminhada → 9,5 km/h por 24 min → 5 min caminhada",pace:"~6'19\"/km",dur:34,km:4.2,incl:"1%"},
    {dia:"Sáb",tipo:"Longa — 5km leve",desc:"5 min caminhada → correr 9 km/h por 33 min → 5 min caminhada (= 5km!)",pace:"~6'40\"/km",dur:43,km:5.1,incl:"1%"},
    {dia:"Dom",tipo:"Recuperação ativa",desc:"Caminhada 10 min + trote 7,5 km/h por 18 min",pace:"~8'00\"/km",dur:28,km:2.6,incl:"0%"},
  ]},
  { semana:8, fase:"Aproximação — consolidando os 5km", treinos:[
    {dia:"Ter",tipo:"Progressivo forte",desc:"5 min caminhada → 9,5 km/h por 10 min → 10 km/h por 8 min → 5 min caminhada",pace:"~6'15\"/km",dur:28,km:3.5,incl:"1%"},
    {dia:"Qui",tipo:"Base contínua",desc:"5 min caminhada → 9,5 km/h por 28 min → 5 min caminhada",pace:"~6'19\"/km",dur:38,km:4.9,incl:"1%"},
    {dia:"Sáb",tipo:"Longa — 5km",desc:"5 min caminhada → correr 9 km/h por 33 min → 5 min caminhada",pace:"~6'40\"/km",dur:43,km:5.2,incl:"1%"},
    {dia:"Dom",tipo:"Recuperação ativa",desc:"Caminhada 10 min + trote 8 km/h por 18 min",pace:"~7'30\"/km",dur:28,km:2.7,incl:"0%"},
  ]},
  { semana:9, fase:"Finalização — chegando no pace 6", treinos:[
    {dia:"Ter",tipo:"Progressivo meta",desc:"5 min caminhada → 10 km/h por 12 min → 10,5 km/h por 6 min → 5 min caminhada",pace:"~6'05\"/km",dur:28,km:3.8,incl:"1%"},
    {dia:"Qui",tipo:"5km em pace 6'20\"",desc:"5 min caminhada → correr 9,5 km/h por 31 min (= 5km) → 5 min caminhada",pace:"~6'20\"/km",dur:41,km:5.0,incl:"1%"},
    {dia:"Sáb",tipo:"Longa — 5km em pace 6'10\"",desc:"5 min caminhada → correr 9,7 km/h por 31 min → 5 min caminhada",pace:"~6'10\"/km",dur:41,km:5.1,incl:"1%"},
    {dia:"Dom",tipo:"Recuperação ativa",desc:"Caminhada 10 min + trote 8 km/h por 20 min",pace:"~7'30\"/km",dur:30,km:2.8,incl:"0%"},
  ]},
  { semana:10, fase:"🏆 Semana da conquista — 5km pace 6!", treinos:[
    {dia:"Ter",tipo:"Afine leve",desc:"5 min caminhada → 9 km/h por 20 min → 5 min caminhada",pace:"~6'40\"/km",dur:30,km:3.3,incl:"1%"},
    {dia:"Qui",tipo:"Afine moderado",desc:"5 min caminhada → 10 km/h por 20 min → 5 min caminhada",pace:"~6'00\"/km",dur:30,km:3.7,incl:"1%"},
    {dia:"Sáb",tipo:"🏆 5km pace 6'00\" — DIA DA META!",desc:"5 min caminhada → correr 10 km/h por 30 min exatos → 5 min caminhada",pace:"6'00\"/km",dur:40,km:5.0,incl:"1%"},
    {dia:"Dom",tipo:"Celebração ativa 🎉",desc:"Caminhada livre ou trote bem leve. Você merece!",pace:"livre",dur:20,km:1.5,incl:"0%"},
  ]},
];

const DEFAULT = { semanaAtual:1, concluidos:{}, historico:[] };

async function loadState() {
  try { const r = await window.storage.get("corrida_v1"); return r ? JSON.parse(r.value) : {...DEFAULT}; }
  catch { return {...DEFAULT}; }
}
async function saveState(s) {
  try { await window.storage.set("corrida_v1", JSON.stringify(s)); } catch {}
}

function paceStr(minKm) {
  const m = Math.floor(minKm), s = Math.round((minKm-m)*60);
  return `${m}'${String(s).padStart(2,"0")}"`;
}

export default function App() {
  const [state, setStateRaw] = useState(null);
  const [tab, setTab] = useState("plano");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  // registro form
  const [form, setForm] = useState({ data:"", treino:"", dist:"", dur:"", fc:"", fcmax:"", esforco:"", obs:"" });

  useEffect(() => {
    loadState().then(s => {
      setStateRaw(s);
      setForm(f => ({ ...f, data: new Date().toISOString().split("T")[0] }));
    });
  }, []);

  const setState = useCallback((fn) => {
    setStateRaw(prev => {
      const next = typeof fn === "function" ? fn(prev) : fn;
      setSaving(true);
      saveState(next).finally(() => setSaving(false));
      return next;
    });
  }, []);

  function showToast(msg) { setToast(msg); setTimeout(()=>setToast(""), 2600); }

  if (!state) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:C.cream,flexDirection:"column",gap:12}}>
      <div style={{width:36,height:36,borderRadius:"50%",border:`3px solid ${C.rose}`,borderTopColor:"transparent",animation:"spin 0.8s linear infinite"}}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <p style={{color:C.muted,fontSize:"0.82rem"}}>Carregando seus dados...</p>
    </div>
  );

  const isSemanaCompleta = (n) => PLANO[n-1].treinos.every((_,i) => state.concluidos[`S${n}-${i}`]);

  // ── helpers UI ─────────────────────────────────────────
  const Card = ({children,style={}}) => <div style={{background:C.card,borderRadius:16,border:`1px solid ${C.border}`,padding:18,marginBottom:14,...style}}>{children}</div>;
  const CardTitle = ({children}) => <div style={{fontSize:"0.67rem",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.09em",color:C.muted,marginBottom:14}}>{children}</div>;
  const ProgBar = ({label,val,max,text}) => (
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
      <span style={{fontSize:"0.74rem",color:C.muted,minWidth:80}}>{label}</span>
      <div style={{flex:1,height:7,background:C.rosePale,borderRadius:10,overflow:"hidden"}}>
        <div style={{height:"100%",borderRadius:10,background:`linear-gradient(90deg,${C.plumLight},${C.rose})`,width:`${Math.min(100,val/max*100)}%`,transition:"width 0.5s"}}/>
      </div>
      <span style={{fontFamily:"DM Mono,monospace",fontSize:"0.71rem",color:C.plum,minWidth:36,textAlign:"right"}}>{text}</span>
    </div>
  );

  // ── HEADER ─────────────────────────────────────────────
  const Header = () => (
    <header style={{background:`linear-gradient(135deg,${C.plum} 0%,${C.plumMid} 100%)`,padding:"26px 20px 22px",textAlign:"center",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",width:200,height:200,borderRadius:"50%",background:"rgba(196,137,154,0.12)",top:-60,right:-40}}/>
      <div style={{position:"absolute",width:110,height:110,borderRadius:"50%",background:"rgba(196,137,154,0.08)",bottom:-30,left:20}}/>
      <h1 style={{fontFamily:"DM Serif Display,serif",fontSize:"1.85rem",color:"white",letterSpacing:"-0.02em",position:"relative",zIndex:1}}>🏃‍♀️ Plano de Corrida</h1>
      <p style={{fontSize:"0.82rem",color:C.roseLight,marginTop:4,fontWeight:300,position:"relative",zIndex:1}}>Sara · Esteira · 10 semanas</p>
      <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"rgba(196,137,154,0.25)",border:"1px solid rgba(196,137,154,0.4)",borderRadius:20,padding:"5px 14px",fontSize:"0.77rem",fontWeight:500,color:C.roseLight,marginTop:12,position:"relative",zIndex:1}}>
        🎯 Meta: 5km em pace 6'00"/km
      </div>
      {saving && <div style={{position:"absolute",top:10,right:14,fontSize:"0.65rem",color:"rgba(255,255,255,0.45)"}}>salvando…</div>}
    </header>
  );

  const Nav = () => (
    <nav style={{display:"flex",background:"white",borderBottom:`1px solid ${C.border}`,overflowX:"auto",position:"sticky",top:0,zIndex:100}}>
      {[["plano","Plano"],["registrar","Registrar"],["historico","Histórico"],["evolucao","Evolução"],["guia","Guia FC"]].map(([id,label])=>(
        <button key={id} onClick={()=>setTab(id)} style={{flex:1,minWidth:72,padding:"13px 6px",border:"none",background:"none",cursor:"pointer",fontFamily:"DM Sans,sans-serif",fontSize:"0.74rem",fontWeight:500,color:tab===id?C.plum:C.muted,borderBottom:`2px solid ${tab===id?C.rose:"transparent"}`,whiteSpace:"nowrap"}}>{label}</button>
      ))}
    </nav>
  );

  // ── TAB PLANO ──────────────────────────────────────────
  const TabPlano = () => {
    const total = Object.values(state.concluidos).filter(Boolean).length;
    const semsCompletas = PLANO.filter((_,i)=>isSemanaCompleta(i+1)).length;
    const kmTotais = state.historico.reduce((a,h)=>a+(parseFloat(h.dist)||0),0);
    const paces = state.historico.filter(h=>h.dist>0&&h.dur>0).map(h=>h.dur/h.dist);
    const melhor = paces.length>0 ? paceStr(Math.min(...paces)) : "—";
    const s = PLANO[state.semanaAtual-1];

    return (
      <div>
        <Card>
          <CardTitle>Progresso geral</CardTitle>
          <ProgBar label="Semanas" val={semsCompletas} max={10} text={`${semsCompletas}/10`}/>
          <ProgBar label="Treinos" val={total} max={40} text={`${total}/40`}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginTop:14}}>
            {[[kmTotais.toFixed(1),"km totais"],[total,"treinos feitos"],[melhor,"melhor pace"]].map(([v,l])=>(
              <div key={l} style={{background:C.rosePale,borderRadius:12,padding:"13px 10px",textAlign:"center"}}>
                <div style={{fontFamily:"DM Mono,monospace",fontSize:"1.2rem",fontWeight:500,color:C.plum}}>{v}</div>
                <div style={{fontSize:"0.66rem",color:C.muted,marginTop:2}}>{l}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* week selector */}
        <div style={{display:"flex",gap:6,marginBottom:14,overflowX:"auto",paddingBottom:4}}>
          {PLANO.map((p,i)=>{
            const isActive = state.semanaAtual===i+1;
            const comp = isSemanaCompleta(i+1);
            return <button key={i} onClick={()=>setState(s=>({...s,semanaAtual:i+1}))}
              style={{flexShrink:0,padding:"6px 14px",borderRadius:20,border:`1px solid ${isActive?C.plum:comp?C.rose:C.border}`,background:isActive?C.plum:comp?C.rosePale:"white",fontSize:"0.74rem",fontWeight:500,color:isActive?"white":comp?C.plum:C.muted,cursor:"pointer",whiteSpace:"nowrap"}}>
              Sem. {p.semana}
            </button>;
          })}
        </div>

        {/* week treinos */}
        <Card>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
            <span style={{background:C.plum,color:"white",borderRadius:20,padding:"3px 12px",fontSize:"0.71rem",fontWeight:600}}>Semana {s.semana}</span>
            <span style={{fontSize:"0.71rem",color:C.muted,fontStyle:"italic"}}>{s.fase}</span>
          </div>
          {s.treinos.map((t,i)=>{
            const key=`S${state.semanaAtual}-${i}`;
            const done=!!state.concluidos[key];
            return (
              <div key={i} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"12px 0",borderBottom:i<s.treinos.length-1?`1px solid ${C.border}`:"none"}}>
                <div style={{width:38,height:38,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.69rem",fontWeight:700,background:done?C.plum:C.rosePale,color:done?"white":C.plum,flexShrink:0,boxShadow:done?`0 0 0 3px rgba(59,31,58,0.15)`:"none"}}>{t.dia}</div>
                <div style={{flex:1}}>
                  <strong style={{fontSize:"0.84rem",color:C.ink,display:"block"}}>{t.tipo}</strong>
                  <span style={{fontSize:"0.74rem",color:C.muted,display:"block",marginTop:2}}>{t.desc}</span>
                  <span style={{display:"inline-block",background:C.rosePale,borderRadius:8,padding:"2px 8px",fontFamily:"DM Mono,monospace",fontSize:"0.69rem",color:C.plumMid,marginTop:4}}>
                    {t.pace} · ~{t.km}km · {t.dur}min · incl. {t.incl}
                  </span>
                </div>
                <button onClick={()=>setState(s=>({...s,concluidos:{...s.concluidos,[key]:!s.concluidos[key]}}))}
                  style={{width:32,height:32,borderRadius:"50%",border:`2px solid ${done?C.success:C.border}`,background:done?C.success:"none",color:done?"white":"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem",flexShrink:0}}>
                  {done?"✓":""}
                </button>
              </div>
            );
          })}
        </Card>
      </div>
    );
  };

  // ── TAB REGISTRAR ──────────────────────────────────────
  const TabRegistrar = () => {
    function salvar() {
      if (!form.data||!form.treino||!form.dist||!form.dur) { showToast("Preencha data, treino, distância e duração!"); return; }
      const [sw,ti] = form.treino.split("-");
      const sn=parseInt(sw.replace("S","")), tn=parseInt(ti);
      const treinoObj = PLANO[sn-1].treinos[tn];
      setState(s=>({...s,
        concluidos:{...s.concluidos,[form.treino]:true},
        historico:[...s.historico,{
          data:form.data, treino:form.treino, treinoNome:treinoObj.tipo,
          semana:sn, dist:parseFloat(form.dist), dur:parseFloat(form.dur),
          fc:parseInt(form.fc)||null, fcmax:parseInt(form.fcmax)||null,
          esforco:parseInt(form.esforco)||null, obs:form.obs
        }]
      }));
      setForm(f=>({...f,dist:"",dur:"",fc:"",fcmax:"",esforco:"",obs:""}));
      showToast("Treino salvo! 🎉");
    }
    const Lbl=({children})=><label style={{display:"block",fontSize:"0.71rem",fontWeight:600,color:C.muted,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.06em"}}>{children}</label>;
    const Inp=(props)=><input {...props} style={{width:"100%",padding:"10px 13px",border:`1px solid ${C.border}`,borderRadius:10,fontFamily:"DM Sans,sans-serif",fontSize:"0.84rem",color:C.ink,outline:"none"}}/>;
    const Sel=({value,onChange,children})=><select value={value} onChange={onChange} style={{width:"100%",padding:"10px 13px",border:`1px solid ${C.border}`,borderRadius:10,fontFamily:"DM Sans,sans-serif",fontSize:"0.84rem",color:C.ink,outline:"none",background:"white"}}>{children}</select>;
    return (
      <Card>
        <CardTitle>Registrar treino</CardTitle>
        <div style={{marginBottom:12}}><Lbl>Data</Lbl><Inp type="date" value={form.data} onChange={e=>setForm(f=>({...f,data:e.target.value}))}/></div>
        <div style={{marginBottom:12}}>
          <Lbl>Treino da semana</Lbl>
          <Sel value={form.treino} onChange={e=>setForm(f=>({...f,treino:e.target.value}))}>
            <option value="">Selecione...</option>
            {PLANO.map(p=>p.treinos.map((t,i)=>(
              <option key={`S${p.semana}-${i}`} value={`S${p.semana}-${i}`}>Sem. {p.semana} · {t.dia} — {t.tipo}</option>
            )))}
          </Sel>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
          <div><Lbl>Distância (km)</Lbl><Inp type="number" step="0.01" placeholder="ex: 2.5" value={form.dist} onChange={e=>setForm(f=>({...f,dist:e.target.value}))}/></div>
          <div><Lbl>Duração (min)</Lbl><Inp type="number" placeholder="ex: 20" value={form.dur} onChange={e=>setForm(f=>({...f,dur:e.target.value}))}/></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
          <div><Lbl>FC média (bpm)</Lbl><Inp type="number" placeholder="ex: 155" value={form.fc} onChange={e=>setForm(f=>({...f,fc:e.target.value}))}/></div>
          <div><Lbl>FC máxima (bpm)</Lbl><Inp type="number" placeholder="ex: 180" value={form.fcmax} onChange={e=>setForm(f=>({...f,fcmax:e.target.value}))}/></div>
        </div>
        <div style={{marginBottom:12}}>
          <Lbl>Como foi? (1–5 ⭐)</Lbl>
          <Sel value={form.esforco} onChange={e=>setForm(f=>({...f,esforco:e.target.value}))}>
            <option value="">Selecione...</option>
            {["Muito fácil","Fácil","Moderado","Difícil","Exaustão"].map((l,i)=><option key={i} value={i+1}>{i+1} — {l}</option>)}
          </Sel>
        </div>
        <div style={{marginBottom:14}}>
          <Lbl>Observações</Lbl>
          <textarea value={form.obs} onChange={e=>setForm(f=>({...f,obs:e.target.value}))} placeholder="Como estava a respiração? Algum desconforto? Conseguiu terminar?" style={{width:"100%",padding:"10px 13px",border:`1px solid ${C.border}`,borderRadius:10,fontFamily:"DM Sans,sans-serif",fontSize:"0.84rem",color:C.ink,outline:"none",resize:"vertical",minHeight:70}}/>
        </div>
        <button onClick={salvar} style={{width:"100%",padding:13,background:`linear-gradient(135deg,${C.plum},${C.plumMid})`,color:"white",border:"none",borderRadius:12,fontFamily:"DM Sans,sans-serif",fontSize:"0.9rem",fontWeight:600,cursor:"pointer"}}>
          Salvar treino ✓
        </button>
      </Card>
    );
  };

  // ── TAB HISTÓRICO ──────────────────────────────────────
  const TabHistorico = () => {
    const sorted = [...state.historico].sort((a,b)=>b.data.localeCompare(a.data));
    return (
      <Card>
        <CardTitle>Treinos registrados</CardTitle>
        {sorted.length===0
          ? <div style={{textAlign:"center",padding:"28px 16px",color:C.muted,fontSize:"0.84rem"}}><span style={{fontSize:"2rem",display:"block",marginBottom:8}}>📋</span>Nenhum treino registrado ainda.</div>
          : sorted.map((h,i)=>{
              const pace = h.dist>0&&h.dur>0 ? paceStr(h.dur/h.dist) : null;
              const df = new Date(h.data+"T12:00:00").toLocaleDateString("pt-BR",{weekday:"short",day:"2-digit",month:"short"});
              const estrelas = h.esforco ? "⭐".repeat(h.esforco) : "";
              return <div key={i} style={{padding:"12px 0",borderBottom:i<sorted.length-1?`1px solid ${C.border}`:"none"}}>
                <div style={{fontSize:"0.69rem",color:C.muted}}>Sem. {h.semana} · {df} {estrelas}</div>
                <div style={{fontSize:"0.86rem",fontWeight:600,color:C.ink,margin:"2px 0"}}>{h.treinoNome}</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:6}}>
                  {[`${h.dist}km`,`${h.dur}min`,pace,h.fc?`FC ${h.fc}bpm`:null].filter(Boolean).map(t=>(
                    <span key={t} style={{fontFamily:"DM Mono,monospace",fontSize:"0.69rem",color:C.plumMid,background:C.rosePale,padding:"2px 8px",borderRadius:6}}>{t}</span>
                  ))}
                </div>
                {h.obs && <div style={{fontSize:"0.74rem",color:C.muted,marginTop:5,fontStyle:"italic"}}>"{h.obs}"</div>}
              </div>;
            })}
      </Card>
    );
  };

  // ── TAB EVOLUÇÃO ──────────────────────────────────────
  const TabEvolucao = () => {
    const hist = state.historico.filter(h=>h.dist>0&&h.dur>0);
    const EvoBar=({label,right,pct,color})=>(
      <div style={{marginBottom:8}}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.71rem",color:C.muted,marginBottom:4}}><span>{label}</span><span>{right}</span></div>
        <div style={{height:8,background:C.rosePale,borderRadius:10,overflow:"hidden"}}>
          <div style={{height:"100%",borderRadius:10,background:color||`linear-gradient(90deg,${C.plumLight},${C.rose})`,width:`${Math.min(100,pct)}%`}}/>
        </div>
      </div>
    );

    // pace bars (lower is better → invert)
    const paceHist = hist.slice(-8);
    const maxPace=12, metaPace=6;

    // fc bars
    const fcHist = hist.filter(h=>h.fc).slice(-8);

    // km por semana
    const kmSem={};
    hist.forEach(h=>{ kmSem[h.semana]=(kmSem[h.semana]||0)+h.dist; });
    const semKeys=Object.keys(kmSem).sort();
    const maxKm=Math.max(1,...semKeys.map(k=>kmSem[k]));

    return (
      <div>
        <Card>
          <CardTitle>Evolução de pace</CardTitle>
          {paceHist.length===0
            ? <div style={{textAlign:"center",padding:"20px",color:C.muted,fontSize:"0.83rem"}}><span style={{fontSize:"1.8rem",display:"block",marginBottom:6}}>📈</span>Registre treinos para ver.</div>
            : paceHist.map((h,i)=>{
                const p=h.dur/h.dist;
                const pct=Math.max(0,((maxPace-p)/(maxPace-metaPace))*100);
                const df=new Date(h.data+"T12:00:00").toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"});
                return <EvoBar key={i} label={`${df} · ${h.treinoNome}`} right={paceStr(p)} pct={pct}/>;
              })}
          {paceHist.length>0 && <div style={{fontSize:"0.69rem",color:C.muted,marginTop:6,textAlign:"right"}}>Meta: 6'00"/km = 100%</div>}
        </Card>
        <Card>
          <CardTitle>Evolução de FC média</CardTitle>
          {fcHist.length===0
            ? <div style={{textAlign:"center",padding:"20px",color:C.muted,fontSize:"0.83rem"}}><span style={{fontSize:"1.8rem",display:"block",marginBottom:6}}>❤️</span>Registre FC nos treinos.</div>
            : fcHist.map((h,i)=>{
                const pct=(h.fc/190)*100;
                const color=h.fc>170?C.danger:h.fc>152?C.rose:C.success;
                const df=new Date(h.data+"T12:00:00").toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"});
                return <EvoBar key={i} label={df} right={`${h.fc} bpm`} pct={pct} color={color}/>;
              })}
          {fcHist.length>0 && <div style={{fontSize:"0.69rem",color:C.muted,marginTop:6}}>🟢 &lt;152 aeróbico · 🔴 &gt;170 zona máxima</div>}
        </Card>
        <Card>
          <CardTitle>Km por semana</CardTitle>
          {semKeys.length===0
            ? <div style={{textAlign:"center",padding:"20px",color:C.muted,fontSize:"0.83rem"}}><span style={{fontSize:"1.8rem",display:"block",marginBottom:6}}>🗺️</span>Km por semana aparecerão aqui.</div>
            : semKeys.map((k,i)=><EvoBar key={k} label={`Semana ${i+1}`} right={`${kmSem[k].toFixed(1)} km`} pct={(kmSem[k]/maxKm)*100}/>)}
        </Card>
      </div>
    );
  };

  // ── TAB GUIA FC ────────────────────────────────────────
  const TabGuia = () => {
    const TipBox=({title,children})=>(
      <div style={{background:"linear-gradient(135deg,rgba(59,31,58,0.06),rgba(196,137,154,0.1))",borderLeft:`3px solid ${C.rose}`,borderRadius:"0 10px 10px 0",padding:"12px 14px",marginBottom:12,fontSize:"0.79rem",color:C.ink,lineHeight:1.55}}>
        <strong style={{color:C.plum,display:"block",marginBottom:3,fontSize:"0.7rem",textTransform:"uppercase",letterSpacing:"0.06em"}}>{title}</strong>
        {children}
      </div>
    );
    const zones=[
      {color:C.success,name:"Zona 1 — Recuperação",bpm:"< 114 bpm",hint:"Caminhada leve. Aquecimento e desaquecimento."},
      {color:"#89C4A0",name:"Zona 2 — Base aeróbica",bpm:"114–133 bpm",hint:"Conversa possível. Ideal para treinos longos. 🎯 Foco das primeiras 4 semanas."},
      {color:C.warn,name:"Zona 3 — Aeróbico moderado",bpm:"133–152 bpm",hint:"Respiração mais pesada. Frases curtas. Onde você vai maior parte do tempo."},
      {color:C.rose,name:"Zona 4 — Limiar anaeróbico",bpm:"152–171 bpm",hint:"Difícil falar. Use com moderação nos treinos de esforço."},
      {color:C.danger,name:"Zona 5 — Máxima",bpm:"> 171 bpm",hint:"Insustentável por mais de 1–2 min. Evitar nas primeiras semanas."},
    ];
    return (
      <div>
        <TipBox title="Seu perfil cardíaco (teste)">
          FC média no esforço: 164 bpm · FC máxima registrada: 190 bpm. Use as zonas abaixo para guiar cada treino.
        </TipBox>
        <Card>
          <CardTitle>Zonas de frequência cardíaca</CardTitle>
          {zones.map((z,i)=>(
            <div key={i}>
              <div style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<zones.length-1?`1px solid ${C.border}`:"none"}}>
                <div style={{width:10,height:10,borderRadius:"50%",background:z.color,flexShrink:0}}/>
                <div style={{flex:1,fontSize:"0.79rem",color:C.ink}}><strong>{z.name}</strong></div>
                <div style={{fontFamily:"DM Mono,monospace",fontSize:"0.73rem",color:C.muted,whiteSpace:"nowrap"}}>{z.bpm}</div>
              </div>
              {i<zones.length-1&&<div style={{fontSize:"0.69rem",color:C.muted,fontStyle:"italic",padding:"0 0 6px 20px"}}>{z.hint}</div>}
            </div>
          ))}
          <div style={{fontSize:"0.69rem",color:C.muted,fontStyle:"italic",padding:"6px 0 0 20px"}}>{zones[4].hint}</div>
        </Card>
        <Card>
          <CardTitle>Dicas por tipo de treino</CardTitle>
          <TipBox title="Treinos de base (Sáb · Dom)">Mantenha FC em zona 2–3. Se passar de 155 bpm, reduza a velocidade. O objetivo é durar, não ir rápido.</TipBox>
          <TipBox title="Treinos de progressão (Ter · Qui)">Comece em zona 2, suba gradualmente até zona 3–4 no bloco principal. Desacelere antes de 180+ bpm.</TipBox>
          <TipBox title="Sinal de alerta">FC acima de 185 bpm por mais de 2 min seguidos → reduza a velocidade imediatamente. Não force.</TipBox>
        </Card>
      </div>
    );
  };

  // ── TOAST ──────────────────────────────────────────────
  const Toast = () => (
    <div style={{position:"fixed",bottom:24,left:"50%",transform:`translateX(-50%) translateY(${toast?"0":"80px"})`,background:C.plum,color:"white",padding:"12px 22px",borderRadius:30,fontSize:"0.83rem",fontWeight:500,transition:"transform 0.35s cubic-bezier(0.34,1.56,0.64,1)",zIndex:9999,whiteSpace:"nowrap",boxShadow:`0 4px 20px rgba(59,31,58,0.35)`,pointerEvents:"none"}}>
      {toast}
    </div>
  );

  return (
    <div style={{fontFamily:"DM Sans,sans-serif",background:C.cream,color:C.ink,minHeight:"100vh"}}>
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet"/>
      <Header/>
      <Nav/>
      <div style={{padding:16,maxWidth:500,margin:"0 auto"}}>
        {tab==="plano"     && <TabPlano/>}
        {tab==="registrar" && <TabRegistrar/>}
        {tab==="historico" && <TabHistorico/>}
        {tab==="evolucao"  && <TabEvolucao/>}
        {tab==="guia"      && <TabGuia/>}
      </div>
      <Toast/>
    </div>
  );
}
