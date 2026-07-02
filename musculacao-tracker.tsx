import { useState, useEffect, useCallback } from "react";

// ── palette ──────────────────────────────────────────────
const C = {
  plum:"#3B1F3A", plumMid:"#5C3059", plumLight:"#7A4578",
  rose:"#C4899A", roseLight:"#DEB8C3", rosePale:"#F5E8ED",
  gold:"#C9A96E", goldPale:"#F5ECD8", cream:"#FAF4F0",
  ink:"#1E1220", muted:"#8A6B84", success:"#6BAA8E",
  border:"#E8D5DF", card:"#FFFFFF",
};

// ── plano ─────────────────────────────────────────────────
const TREINOS = {
  seg:{nome:"Glúteo & Posterior",foco:"🍑 Glúteo + Posterior",dur:"60–70 min",exercicios:[
    {nome:"Cadeira Flexora (sentada)",series:4,reps:"12–15",maquina:"Cadeira Flexora",dica:"Concentre a contração no final. Desça devagar em 3 segundos — a fase excêntrica é onde o músculo mais cresce.",musculos:["Bíceps femoral","Semitendíneo","Glúteo"]},
    {nome:"Mesa Flexora (deitada)",series:3,reps:"12–15",maquina:"Mesa Flexora",dica:"Quadril colado na mesa. Se levantar o quadril, está usando carga demais. Reduza e foque na contração.",musculos:["Bíceps femoral","Semitendíneo","Gastrocnêmio"]},
    {nome:"Abdutora (sentada)",series:4,reps:"15–20",maquina:"Cadeira Abdutora",dica:"Coluna ereta, pés paralelos. Abra devagar (2s) e feche controlado (3s). Sinta o glúteo médio na lateral.",musculos:["Glúteo médio","Glúteo mínimo","TFL"]},
    {nome:"Glúteo no cabo (extensão)",series:3,reps:"15 cada",maquina:"Cabo / Polia baixa",dica:"Incline levemente o tronco. Perna de apoio levemente flexionada. Contração no topo por 1 segundo.",musculos:["Glúteo máximo","Isquiotibiais"]},
    {nome:"Hiperextensão (lombar)",series:3,reps:"15",maquina:"Banco de hiperextensão",dica:"Suba até o alinhamento do tronco, não além. Forçar lombar em excesso causa lesão. Glúteo contraído no topo.",musculos:["Eretores da espinha","Glúteo máximo","Isquiotibiais"]},
  ]},
  ter:{nome:"Cintura & Core",foco:"⌛ Cintura + Core",dur:"55–65 min",exercicios:[
    {nome:"Crunch Abdominal (máquina)",series:4,reps:"15–20",maquina:"Máquina de crunch",dica:"Expire ao contrair, inspire ao soltar. Não puxe com o pescoço. Sinta o abdômen superior.",musculos:["Reto abdominal","Oblíquos"]},
    {nome:"Rotação Torácica no cabo",series:3,reps:"15 cada lado",maquina:"Cabo / Polia",dica:"Pivote pelos oblíquos, não pelos quadris. Quadris de frente, tronco que gira. Lento e controlado.",musculos:["Oblíquo externo","Oblíquo interno","Transverso"]},
    {nome:"Flexão lateral no cabo",series:3,reps:"15 cada lado",maquina:"Cabo / Polia baixa",dica:"Puxe de um lado com o oblíquo. Amplitude pequena e controlada é mais eficiente.",musculos:["Oblíquo externo","Quadrado lombar"]},
    {nome:"Hiperextensão (lombar)",series:3,reps:"15",maquina:"Banco de hiperextensão",dica:"Costas fortes sustentam a postura que afina a cintura. Suba devagar, contraia glúteo e lombar no topo.",musculos:["Eretores da espinha","Glúteo máximo","Isquiotibiais"]},
    {nome:"Abdominal infra (máquina)",series:3,reps:"15–20",maquina:"Máquina abdominal",dica:"Quadril que sobe, não as pernas. Se sentir o flexor do quadril trabalhando mais, ajuste a posição.",musculos:["Reto abdominal inferior","Flexores do quadril"]},
  ]},
  qua:{nome:"Glúteo & Quadríceps",foco:"🍑 Glúteo + Quad",dur:"65–75 min",exercicios:[
    {nome:"Leg Press (pés altos)",series:4,reps:"10–12",maquina:"Leg Press 45°",dica:"Pés altos e afastados = mais glúteo. Desça até 90° ou além. Empurre pelos calcanhares.",musculos:["Glúteo máximo","Quadríceps","Isquiotibiais"]},
    {nome:"Extensora de quadril (máquina)",series:4,reps:"12–15",maquina:"Máquina extensão de quadril",dica:"Quadril neutro, não arqueie a lombar. Contração no topo por 1 segundo.",musculos:["Glúteo máximo","Glúteo médio"]},
    {nome:"Adutora (sentada)",series:3,reps:"15–20",maquina:"Cadeira Adutora",dica:"Feche devagar (2s) e abra controlado (3s). Coluna reta, não curve para frente.",musculos:["Adutores","Grácil","Pectíneo"]},
    {nome:"Abdutora em pé no cabo",series:3,reps:"15 cada",maquina:"Cabo / Polia baixa",dica:"Glúteo médio trabalhando. Não balance o tronco para compensar.",musculos:["Glúteo médio","Glúteo mínimo","TFL"]},
    {nome:"Extensora (quadríceps)",series:3,reps:"12–15",maquina:"Cadeira Extensora",dica:"Toque no topo e desça devagar. Quadríceps forte melhora a execução de tudo.",musculos:["Quadríceps","Reto femoral","Vasto lateral"]},
  ]},
  qui:{nome:"Costas & Ombros",foco:"🔼 Costas + Ombros",dur:"60–70 min",exercicios:[
    {nome:"Puxada Alta (pegada fechada)",series:4,reps:"10–12",maquina:"Puxada Alta",dica:"Puxe pelos cotovelos, não pelas mãos. Peito para cima. Costas largas = cintura mais fina.",musculos:["Grande dorsal","Bíceps","Romboides"]},
    {nome:"Remada Sentada (cabo)",series:4,reps:"10–12",maquina:"Remada no cabo",dica:"Costas retas, cotovelos rentes ao corpo. Retraia as escápulas ao puxar. Não balance o tronco.",musculos:["Grande dorsal","Trapézio médio","Romboides"]},
    {nome:"Elevação Lateral (máquina)",series:3,reps:"12–15",maquina:"Máquina elevação lateral",dica:"Ombros arredondados completam a ampulheta. Cotovelo levemente flexionado. Suba até a altura do ombro.",musculos:["Deltoide médio","Trapézio superior"]},
    {nome:"Voador Inverso (máquina)",series:3,reps:"12–15",maquina:"Pec deck invertido",dica:"Postura ereta. Abra os braços controlado. Não deixe os ombros subir.",musculos:["Deltoide posterior","Trapézio médio","Romboides"]},
    {nome:"Puxada Frente (pegada larga)",series:3,reps:"12",maquina:"Puxada Alta",dica:"Puxe a barra até o queixo, peito aberto. Dorsal em ângulo diferente.",musculos:["Grande dorsal","Infraespinhal","Bíceps"]},
  ]},
  sex:{nome:"Glúteo Isolado",foco:"🍑 Glúteo puro",dur:"55–65 min",exercicios:[
    {nome:"Glúteo máquina (kickback)",series:4,reps:"15 cada",maquina:"Máquina de glúteo",dica:"Perna que empurra, não o quadril que gira. Concentre cada repetição.",musculos:["Glúteo máximo","Isquiotibiais"]},
    {nome:"Abdutora em pé (cabo)",series:4,reps:"20 cada",maquina:"Cabo / Polia baixa",dica:"Volume alto e leve para glúteo médio. Estabilize o tronco.",musculos:["Glúteo médio","Glúteo mínimo"]},
    {nome:"Cadeira Abdutora (sentada)",series:3,reps:"20–25",maquina:"Cadeira Abdutora",dica:"Sente fundo no banco, abra máximo possível sem perder a postura.",musculos:["Glúteo médio","Glúteo mínimo","TFL"]},
    {nome:"Crunch Abdominal (máquina)",series:3,reps:"20",maquina:"Máquina de crunch",dica:"Abdômen forte sustenta a cintura. Expire ao contrair.",musculos:["Reto abdominal","Oblíquos"]},
    {nome:"Hiperextensão (lombar)",series:3,reps:"15",maquina:"Banco de hiperextensão",dica:"Finalização da semana. Lombar forte é base de tudo.",musculos:["Eretores da espinha","Glúteo máximo","Isquiotibiais"]},
  ]},
};

const DIAS = ["seg","ter","qua","qui","sex"];
const DIAS_LABEL = {seg:"Seg",ter:"Ter",qua:"Qua",qui:"Qui",sex:"Sex"};

// ── SVG ilustrações ───────────────────────────────────────
const SVGS = {
  "Cadeira Flexora (sentada)":`<svg viewBox="0 0 220 170" xmlns="http://www.w3.org/2000/svg"><rect x="30" y="108" width="160" height="11" rx="5" fill="#DEB8C3"/><rect x="30" y="119" width="11" height="45" rx="5" fill="#DEB8C3"/><rect x="179" y="119" width="11" height="45" rx="5" fill="#DEB8C3"/><ellipse cx="90" cy="84" rx="17" ry="23" fill="#C4899A"/><circle cx="90" cy="54" r="13" fill="#C4899A"/><rect x="88" y="103" width="58" height="13" rx="6" fill="#7A4578"/><path d="M143 109 Q168 128 153 156" stroke="#3B1F3A" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M153 156 Q170 143 168 126" stroke="#C9A96E" stroke-width="2.5" fill="none" stroke-dasharray="4 3" stroke-linecap="round"/><polygon points="168,126 162,134 174,132" fill="#C9A96E"/><text x="110" y="168" text-anchor="middle" font-size="9" fill="#8A6B84" font-family="sans-serif">Cadeira Flexora</text></svg>`,
  "Mesa Flexora (deitada)":`<svg viewBox="0 0 220 170" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="90" width="200" height="11" rx="5" fill="#DEB8C3"/><rect x="10" y="101" width="10" height="45" rx="5" fill="#DEB8C3"/><rect x="200" y="101" width="10" height="45" rx="5" fill="#DEB8C3"/><ellipse cx="80" cy="82" rx="50" ry="11" fill="#C4899A"/><circle cx="28" cy="78" r="13" fill="#C4899A"/><rect x="100" y="76" width="68" height="11" rx="5" fill="#7A4578"/><path d="M166 81 Q188 70 183 54" stroke="#3B1F3A" stroke-width="11" fill="none" stroke-linecap="round"/><path d="M183 54 Q198 44 194 57" stroke="#C9A96E" stroke-width="2.5" fill="none" stroke-dasharray="4 3" stroke-linecap="round"/><polygon points="194,57 186,51 190,61" fill="#C9A96E"/><text x="110" y="156" text-anchor="middle" font-size="9" fill="#8A6B84" font-family="sans-serif">Mesa Flexora</text></svg>`,
  "Abdutora (sentada)":`<svg viewBox="0 0 220 180" xmlns="http://www.w3.org/2000/svg"><rect x="40" y="103" width="140" height="11" rx="5" fill="#DEB8C3"/><rect x="40" y="114" width="10" height="50" rx="5" fill="#DEB8C3"/><rect x="170" y="114" width="10" height="50" rx="5" fill="#DEB8C3"/><ellipse cx="110" cy="76" rx="17" ry="25" fill="#C4899A"/><circle cx="110" cy="45" r="13" fill="#C4899A"/><path d="M98 102 Q75 116 58 113" stroke="#7A4578" stroke-width="13" fill="none" stroke-linecap="round"/><path d="M122 102 Q145 116 162 113" stroke="#7A4578" stroke-width="13" fill="none" stroke-linecap="round"/><path d="M58 113 Q42 106 50 96" stroke="#C9A96E" stroke-width="2.5" fill="none" stroke-dasharray="4 3"/><polygon points="50,96 44,104 54,105" fill="#C9A96E"/><path d="M162 113 Q178 106 170 96" stroke="#C9A96E" stroke-width="2.5" fill="none" stroke-dasharray="4 3"/><polygon points="170,96 164,104 174,105" fill="#C9A96E"/><text x="110" y="174" text-anchor="middle" font-size="9" fill="#8A6B84" font-family="sans-serif">Cadeira Abdutora</text></svg>`,
  "Glúteo no cabo (extensão)":`<svg viewBox="0 0 220 180" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="40" width="10" height="135" rx="5" fill="#DEB8C3"/><circle cx="13" cy="152" r="7" fill="#C4899A"/><line x1="13" y1="152" x2="74" y2="152" stroke="#C9A96E" stroke-width="2.5" stroke-dasharray="5 3"/><path d="M99 93 Q106 76 112 63" stroke="#C4899A" stroke-width="15" fill="none" stroke-linecap="round"/><circle cx="116" cy="54" r="13" fill="#C4899A"/><path d="M92 108 Q80 128 72 148" stroke="#3B1F3A" stroke-width="8" fill="none" stroke-linecap="round"/><rect x="94" y="118" width="11" height="52" rx="5" fill="#7A4578"/><path d="M107 126 Q130 138 152 126" stroke="#3B1F3A" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M152 126 Q170 116 163 103" stroke="#C9A96E" stroke-width="2.5" fill="none" stroke-dasharray="4 3"/><polygon points="163,103 156,111 166,112" fill="#C9A96E"/><text x="110" y="176" text-anchor="middle" font-size="9" fill="#8A6B84" font-family="sans-serif">Extensão no Cabo</text></svg>`,
  "Hiperextensão (lombar)":`<svg viewBox="0 0 220 170" xmlns="http://www.w3.org/2000/svg"><rect x="20" y="103" width="180" height="11" rx="5" fill="#DEB8C3"/><rect x="20" y="114" width="10" height="45" rx="5" fill="#DEB8C3"/><rect x="190" y="114" width="10" height="45" rx="5" fill="#DEB8C3"/><rect x="80" y="103" width="78" height="12" rx="6" fill="#7A4578"/><path d="M80 108 Q60 128 48 146" stroke="#DEB8C3" stroke-width="10" fill="none" stroke-linecap="round" opacity="0.5"/><path d="M80 108 Q60 88 45 74" stroke="#C4899A" stroke-width="13" fill="none" stroke-linecap="round"/><circle cx="38" cy="64" r="13" fill="#C4899A"/><path d="M48 146 Q32 118 38 88" stroke="#C9A96E" stroke-width="2.5" fill="none" stroke-dasharray="4 3"/><polygon points="38,88 32,96 42,97" fill="#C9A96E"/><text x="110" y="166" text-anchor="middle" font-size="9" fill="#8A6B84" font-family="sans-serif">Hiperextensão Lombar</text></svg>`,
  "Crunch Abdominal (máquina)":`<svg viewBox="0 0 220 175" xmlns="http://www.w3.org/2000/svg"><rect x="30" y="118" width="160" height="11" rx="5" fill="#DEB8C3"/><rect x="30" y="129" width="10" height="40" rx="5" fill="#DEB8C3"/><rect x="180" y="129" width="10" height="40" rx="5" fill="#DEB8C3"/><path d="M110 116 Q110 83 110 68" stroke="#DEB8C3" stroke-width="14" fill="none" stroke-linecap="round" opacity="0.45"/><path d="M110 116 Q110 98 100 88" stroke="#C4899A" stroke-width="14" fill="none" stroke-linecap="round"/><circle cx="95" cy="76" r="13" fill="#C4899A"/><rect x="88" y="110" width="54" height="11" rx="5" fill="#7A4578"/><rect x="140" y="110" width="11" height="28" rx="5" fill="#7A4578"/><path d="M110 68 Q95 78 95 90" stroke="#C9A96E" stroke-width="2.5" fill="none" stroke-dasharray="4 3"/><polygon points="95,90 89,82 99,82" fill="#C9A96E"/><text x="110" y="172" text-anchor="middle" font-size="9" fill="#8A6B84" font-family="sans-serif">Crunch na Máquina</text></svg>`,
  "Rotação Torácica no cabo":`<svg viewBox="0 0 220 180" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="40" width="10" height="128" rx="5" fill="#DEB8C3"/><ellipse cx="120" cy="108" rx="15" ry="27" fill="#C4899A"/><circle cx="120" cy="74" r="13" fill="#C4899A"/><rect x="108" y="133" width="10" height="40" rx="5" fill="#7A4578"/><rect x="122" y="133" width="10" height="40" rx="5" fill="#7A4578"/><path d="M105 98 Q63 93 28 98" stroke="#3B1F3A" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M135 98 Q158 86 173 78" stroke="#3B1F3A" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M173 78 Q188 93 176 110" stroke="#C9A96E" stroke-width="2.5" fill="none" stroke-dasharray="4 3"/><polygon points="176,110 168,103 178,101" fill="#C9A96E"/><text x="110" y="176" text-anchor="middle" font-size="9" fill="#8A6B84" font-family="sans-serif">Rotação no Cabo</text></svg>`,
  "Flexão lateral no cabo":`<svg viewBox="0 0 220 180" xmlns="http://www.w3.org/2000/svg"><rect x="190" y="40" width="10" height="128" rx="5" fill="#DEB8C3"/><path d="M110 138 Q100 108 90 83" stroke="#C4899A" stroke-width="16" fill="none" stroke-linecap="round"/><circle cx="86" cy="71" r="13" fill="#C4899A"/><rect x="104" y="136" width="10" height="40" rx="5" fill="#7A4578"/><rect x="118" y="136" width="10" height="40" rx="5" fill="#7A4578"/><line x1="90" y1="98" x2="190" y2="116" stroke="#3B1F3A" stroke-width="7" stroke-linecap="round"/><path d="M90 98 Q80 116 92 130" stroke="#C9A96E" stroke-width="2.5" fill="none" stroke-dasharray="4 3"/><polygon points="92,130 84,124 94,120" fill="#C9A96E"/><text x="100" y="176" text-anchor="middle" font-size="9" fill="#8A6B84" font-family="sans-serif">Flexão Lateral no Cabo</text></svg>`,
  "Abdominal infra (máquina)":`<svg viewBox="0 0 220 175" xmlns="http://www.w3.org/2000/svg"><rect x="20" y="80" width="180" height="11" rx="5" fill="#DEB8C3"/><ellipse cx="90" cy="72" rx="54" ry="11" fill="#C4899A"/><circle cx="32" cy="67" r="13" fill="#C4899A"/><path d="M140 74 Q170 88 183 103" stroke="#DEB8C3" stroke-width="11" fill="none" stroke-linecap="round" opacity="0.45"/><path d="M140 74 Q160 53 164 36" stroke="#7A4578" stroke-width="11" fill="none" stroke-linecap="round"/><path d="M164 36 Q180 24 183 36" stroke="#C9A96E" stroke-width="2.5" fill="none" stroke-dasharray="4 3"/><polygon points="183,36 175,31 178,41" fill="#C9A96E"/><text x="110" y="170" text-anchor="middle" font-size="9" fill="#8A6B84" font-family="sans-serif">Abdominal Infra</text></svg>`,
  "Leg Press (pés altos)":`<svg viewBox="0 0 220 178" xmlns="http://www.w3.org/2000/svg"><rect x="145" y="28" width="11" height="118" rx="5" fill="#DEB8C3"/><rect x="130" y="28" width="40" height="13" rx="6" fill="#C4899A"/><ellipse cx="65" cy="106" rx="42" ry="12" fill="#C4899A" transform="rotate(-35 65 106)"/><circle cx="30" cy="128" r="13" fill="#C4899A"/><path d="M88 80 Q118 56 140 42" stroke="#7A4578" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M140 42 Q157 32 154 48" stroke="#C9A96E" stroke-width="2.5" fill="none" stroke-dasharray="4 3"/><polygon points="154,48 147,40 157,40" fill="#C9A96E"/><text x="110" y="174" text-anchor="middle" font-size="9" fill="#8A6B84" font-family="sans-serif">Leg Press (pés altos)</text></svg>`,
  "Extensora de quadril (máquina)":`<svg viewBox="0 0 220 172" xmlns="http://www.w3.org/2000/svg"><rect x="30" y="106" width="160" height="11" rx="5" fill="#DEB8C3"/><rect x="30" y="117" width="10" height="46" rx="5" fill="#DEB8C3"/><rect x="180" y="117" width="10" height="46" rx="5" fill="#DEB8C3"/><ellipse cx="90" cy="80" rx="16" ry="27" fill="#C4899A"/><circle cx="90" cy="46" r="13" fill="#C4899A"/><rect x="88" y="104" width="54" height="12" rx="6" fill="#7A4578"/><path d="M140 110 Q164 103 174 86" stroke="#3B1F3A" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M174 86 Q184 70 174 60" stroke="#C9A96E" stroke-width="2.5" fill="none" stroke-dasharray="4 3"/><polygon points="174,60 167,68 177,69" fill="#C9A96E"/><text x="110" y="170" text-anchor="middle" font-size="9" fill="#8A6B84" font-family="sans-serif">Extensão de Quadril</text></svg>`,
  "Adutora (sentada)":`<svg viewBox="0 0 220 172" xmlns="http://www.w3.org/2000/svg"><rect x="40" y="106" width="140" height="11" rx="5" fill="#DEB8C3"/><rect x="40" y="117" width="10" height="46" rx="5" fill="#DEB8C3"/><rect x="170" y="117" width="10" height="46" rx="5" fill="#DEB8C3"/><ellipse cx="110" cy="78" rx="17" ry="27" fill="#C4899A"/><circle cx="110" cy="44" r="13" fill="#C4899A"/><path d="M98 104 Q75 118 58 116" stroke="#DEB8C3" stroke-width="12" fill="none" stroke-linecap="round" opacity="0.4"/><path d="M122 104 Q145 118 162 116" stroke="#DEB8C3" stroke-width="12" fill="none" stroke-linecap="round" opacity="0.4"/><path d="M98 104 Q90 114 88 118" stroke="#7A4578" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M122 104 Q130 114 132 118" stroke="#7A4578" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M58 116 Q72 110 85 116" stroke="#C9A96E" stroke-width="2.5" fill="none" stroke-dasharray="4 3"/><polygon points="85,116 77,110 77,120" fill="#C9A96E"/><path d="M162 116 Q148 110 135 116" stroke="#C9A96E" stroke-width="2.5" fill="none" stroke-dasharray="4 3"/><polygon points="135,116 143,110 143,120" fill="#C9A96E"/><text x="110" y="170" text-anchor="middle" font-size="9" fill="#8A6B84" font-family="sans-serif">Cadeira Adutora</text></svg>`,
  "Abdutora em pé no cabo":`<svg viewBox="0 0 220 178" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="40" width="10" height="132" rx="5" fill="#DEB8C3"/><circle cx="13" cy="160" r="7" fill="#C4899A"/><line x1="13" y1="160" x2="86" y2="158" stroke="#C9A96E" stroke-width="2.5" stroke-dasharray="5 3"/><rect x="104" y="88" width="13" height="48" rx="6" fill="#C4899A"/><circle cx="110" cy="74" r="13" fill="#C4899A"/><rect x="107" y="134" width="10" height="40" rx="5" fill="#7A4578"/><path d="M104 142 Q80 142 60 135" stroke="#3B1F3A" stroke-width="11" fill="none" stroke-linecap="round"/><path d="M60 135 Q42 127 48 116" stroke="#C9A96E" stroke-width="2.5" fill="none" stroke-dasharray="4 3"/><polygon points="48,116 42,124 52,126" fill="#C9A96E"/><text x="110" y="176" text-anchor="middle" font-size="9" fill="#8A6B84" font-family="sans-serif">Abdutora em Pé</text></svg>`,
  "Extensora (quadríceps)":`<svg viewBox="0 0 220 172" xmlns="http://www.w3.org/2000/svg"><rect x="30" y="106" width="160" height="11" rx="5" fill="#DEB8C3"/><rect x="30" y="117" width="10" height="46" rx="5" fill="#DEB8C3"/><rect x="180" y="117" width="10" height="46" rx="5" fill="#DEB8C3"/><ellipse cx="90" cy="78" rx="16" ry="27" fill="#C4899A"/><circle cx="90" cy="44" r="13" fill="#C4899A"/><rect x="88" y="102" width="58" height="12" rx="6" fill="#7A4578"/><path d="M144 108 Q164 126 160 146" stroke="#DEB8C3" stroke-width="11" fill="none" stroke-linecap="round" opacity="0.4"/><path d="M144 108 Q174 100 186 93" stroke="#3B1F3A" stroke-width="11" fill="none" stroke-linecap="round"/><path d="M186 93 Q198 86 193 98" stroke="#C9A96E" stroke-width="2.5" fill="none" stroke-dasharray="4 3"/><polygon points="193,98 186,91 196,89" fill="#C9A96E"/><text x="110" y="170" text-anchor="middle" font-size="9" fill="#8A6B84" font-family="sans-serif">Cadeira Extensora</text></svg>`,
  "Puxada Alta (pegada fechada)":`<svg viewBox="0 0 220 175" xmlns="http://www.w3.org/2000/svg"><rect x="50" y="20" width="120" height="10" rx="5" fill="#DEB8C3"/><rect x="108" y="10" width="10" height="78" rx="5" fill="#C9A96E" opacity="0.7"/><ellipse cx="110" cy="116" rx="17" ry="27" fill="#C4899A"/><circle cx="110" cy="82" r="13" fill="#C4899A"/><rect x="80" y="141" width="60" height="11" rx="5" fill="#7A4578"/><path d="M96 93 Q78 56 90 30" stroke="#3B1F3A" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M124 93 Q142 56 130 30" stroke="#3B1F3A" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M110 82 Q105 96 110 106" stroke="#C9A96E" stroke-width="2.5" fill="none" stroke-dasharray="4 3"/><polygon points="110,106 104,98 116,98" fill="#C9A96E"/><text x="110" y="172" text-anchor="middle" font-size="9" fill="#8A6B84" font-family="sans-serif">Puxada Alta</text></svg>`,
  "Remada Sentada (cabo)":`<svg viewBox="0 0 220 170" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="106" width="10" height="58" rx="5" fill="#DEB8C3"/><circle cx="13" cy="116" r="7" fill="#C4899A"/><line x1="22" y1="116" x2="88" y2="116" stroke="#C9A96E" stroke-width="2.5" stroke-dasharray="5 3"/><path d="M110 143 Q108 116 104 93" stroke="#C4899A" stroke-width="16" fill="none" stroke-linecap="round"/><circle cx="100" cy="80" r="13" fill="#C4899A"/><rect x="100" y="141" width="68" height="11" rx="5" fill="#7A4578"/><path d="M108 108 Q85 113 22 116" stroke="#3B1F3A" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M70 114 Q60 103 72 96" stroke="#C9A96E" stroke-width="2.5" fill="none" stroke-dasharray="4 3"/><polygon points="72,96 65,104 75,104" fill="#C9A96E"/><text x="110" y="166" text-anchor="middle" font-size="9" fill="#8A6B84" font-family="sans-serif">Remada Sentada</text></svg>`,
  "Elevação Lateral (máquina)":`<svg viewBox="0 0 220 172" xmlns="http://www.w3.org/2000/svg"><rect x="80" y="106" width="60" height="11" rx="5" fill="#DEB8C3"/><rect x="80" y="117" width="10" height="46" rx="5" fill="#DEB8C3"/><rect x="130" y="117" width="10" height="46" rx="5" fill="#DEB8C3"/><ellipse cx="110" cy="80" rx="15" ry="27" fill="#C4899A"/><circle cx="110" cy="46" r="13" fill="#C4899A"/><path d="M96 80 Q65 73 42 76" stroke="#3B1F3A" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M124 80 Q155 73 178 76" stroke="#3B1F3A" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M96 80 Q75 90 60 98" stroke="#DEB8C3" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.4"/><path d="M124 80 Q145 90 160 98" stroke="#DEB8C3" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.4"/><path d="M42 76 Q38 63 50 56" stroke="#C9A96E" stroke-width="2.5" fill="none" stroke-dasharray="4 3"/><polygon points="50,56 43,64 53,64" fill="#C9A96E"/><text x="110" y="170" text-anchor="middle" font-size="9" fill="#8A6B84" font-family="sans-serif">Elevação Lateral</text></svg>`,
  "Voador Inverso (máquina)":`<svg viewBox="0 0 220 174" xmlns="http://www.w3.org/2000/svg"><rect x="80" y="108" width="60" height="11" rx="5" fill="#DEB8C3"/><rect x="80" y="119" width="10" height="46" rx="5" fill="#DEB8C3"/><rect x="130" y="119" width="10" height="46" rx="5" fill="#DEB8C3"/><path d="M110 134 Q108 110 100 88" stroke="#C4899A" stroke-width="16" fill="none" stroke-linecap="round"/><circle cx="96" cy="76" r="13" fill="#C4899A"/><path d="M102 103 Q72 93 48 90" stroke="#3B1F3A" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M118 103 Q148 93 172 90" stroke="#3B1F3A" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M48 90 Q40 78 52 70" stroke="#C9A96E" stroke-width="2.5" fill="none" stroke-dasharray="4 3"/><polygon points="52,70 45,78 55,78" fill="#C9A96E"/><text x="110" y="172" text-anchor="middle" font-size="9" fill="#8A6B84" font-family="sans-serif">Voador Inverso</text></svg>`,
  "Puxada Frente (pegada larga)":`<svg viewBox="0 0 220 172" xmlns="http://www.w3.org/2000/svg"><rect x="30" y="20" width="160" height="10" rx="5" fill="#DEB8C3"/><rect x="108" y="10" width="10" height="78" rx="5" fill="#C9A96E" opacity="0.7"/><ellipse cx="110" cy="118" rx="17" ry="27" fill="#C4899A"/><circle cx="110" cy="84" r="13" fill="#C4899A"/><rect x="80" y="143" width="60" height="11" rx="5" fill="#7A4578"/><path d="M92 94 Q62 50 30 30" stroke="#3B1F3A" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M128 94 Q158 50 190 30" stroke="#3B1F3A" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M110 84 Q108 98 110 110" stroke="#C9A96E" stroke-width="2.5" fill="none" stroke-dasharray="4 3"/><polygon points="110,110 104,102 116,102" fill="#C9A96E"/><text x="110" y="170" text-anchor="middle" font-size="9" fill="#8A6B84" font-family="sans-serif">Puxada Larga</text></svg>`,
  "Glúteo máquina (kickback)":`<svg viewBox="0 0 220 174" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="78" width="78" height="11" rx="5" fill="#DEB8C3"/><rect x="8" y="58" width="10" height="78" rx="5" fill="#DEB8C3"/><path d="M88 84 Q105 76 114 63" stroke="#C4899A" stroke-width="16" fill="none" stroke-linecap="round"/><circle cx="118" cy="55" r="13" fill="#C4899A"/><path d="M92 80 Q55 80 18 84" stroke="#3B1F3A" stroke-width="8" fill="none" stroke-linecap="round"/><rect x="90" y="93" width="10" height="53" rx="5" fill="#7A4578"/><path d="M100 98 Q124 103 148 86" stroke="#3B1F3A" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M148 86 Q166 73 160 58" stroke="#C9A96E" stroke-width="2.5" fill="none" stroke-dasharray="4 3"/><polygon points="160,58 153,66 163,68" fill="#C9A96E"/><text x="110" y="172" text-anchor="middle" font-size="9" fill="#8A6B84" font-family="sans-serif">Kickback Glúteo</text></svg>`,
  "Abdutora em pé (cabo)":`<svg viewBox="0 0 220 178" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="40" width="10" height="132" rx="5" fill="#DEB8C3"/><circle cx="13" cy="160" r="7" fill="#C4899A"/><line x1="13" y1="160" x2="86" y2="158" stroke="#C9A96E" stroke-width="2.5" stroke-dasharray="5 3"/><rect x="104" y="88" width="13" height="48" rx="6" fill="#C4899A"/><circle cx="110" cy="74" r="13" fill="#C4899A"/><rect x="107" y="134" width="10" height="40" rx="5" fill="#7A4578"/><path d="M104 142 Q80 142 60 135" stroke="#3B1F3A" stroke-width="11" fill="none" stroke-linecap="round"/><path d="M60 135 Q42 127 48 116" stroke="#C9A96E" stroke-width="2.5" fill="none" stroke-dasharray="4 3"/><polygon points="48,116 42,124 52,126" fill="#C9A96E"/><text x="110" y="176" text-anchor="middle" font-size="9" fill="#8A6B84" font-family="sans-serif">Abdutora em Pé</text></svg>`,
  "Cadeira Abdutora (sentada)":`<svg viewBox="0 0 220 180" xmlns="http://www.w3.org/2000/svg"><rect x="40" y="103" width="140" height="11" rx="5" fill="#DEB8C3"/><rect x="40" y="114" width="10" height="50" rx="5" fill="#DEB8C3"/><rect x="170" y="114" width="10" height="50" rx="5" fill="#DEB8C3"/><ellipse cx="110" cy="76" rx="17" ry="25" fill="#C4899A"/><circle cx="110" cy="45" r="13" fill="#C4899A"/><path d="M98 102 Q75 116 58 113" stroke="#7A4578" stroke-width="13" fill="none" stroke-linecap="round"/><path d="M122 102 Q145 116 162 113" stroke="#7A4578" stroke-width="13" fill="none" stroke-linecap="round"/><path d="M58 113 Q42 106 50 96" stroke="#C9A96E" stroke-width="2.5" fill="none" stroke-dasharray="4 3"/><polygon points="50,96 44,104 54,105" fill="#C9A96E"/><path d="M162 113 Q178 106 170 96" stroke="#C9A96E" stroke-width="2.5" fill="none" stroke-dasharray="4 3"/><polygon points="170,96 164,104 174,105" fill="#C9A96E"/><text x="110" y="176" text-anchor="middle" font-size="9" fill="#8A6B84" font-family="sans-serif">Cadeira Abdutora</text></svg>`,
};

function getSVG(nome) { return SVGS[nome] || `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg"><circle cx="80" cy="60" r="48" fill="none" stroke="#DEB8C3" stroke-width="2"/><text x="80" y="65" text-anchor="middle" font-size="28" fill="#C4899A">💪</text></svg>`; }

// ── helpers ───────────────────────────────────────────────
function today() { return new Date().toISOString().split("T")[0]; }
function getWeek(d = new Date()) {
  const dt = new Date(d); dt.setHours(0,0,0,0);
  dt.setDate(dt.getDate() + 3 - (dt.getDay()+6)%7);
  const w1 = new Date(dt.getFullYear(),0,4);
  return dt.getFullYear()+"-W"+String(1+Math.round(((dt-w1)/86400000-3+(w1.getDay()+6)%7)/7)).padStart(2,"0");
}
const DEFAULT_STATE = { diaAtivo:"seg", concluidos:{}, series:{}, historico:[] };

// ── storage ───────────────────────────────────────────────
async function loadState() {
  try {
    const r = await window.storage.get("musculo_v1");
    return r ? JSON.parse(r.value) : { ...DEFAULT_STATE };
  } catch { return { ...DEFAULT_STATE }; }
}
async function saveState(s) {
  try { await window.storage.set("musculo_v1", JSON.stringify(s)); } catch {}
}

// ── main app ──────────────────────────────────────────────
export default function App() {
  const [state, setStateRaw] = useState(null);
  const [tab, setTab] = useState("treino");
  const [modal, setModal] = useState(null); // {nome, maquina, musculos}
  const [openEx, setOpenEx] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => { loadState().then(setStateRaw); }, []);

  const setState = useCallback(async (fn) => {
    setStateRaw(prev => {
      const next = typeof fn === "function" ? fn(prev) : fn;
      setSaving(true);
      saveState(next).finally(() => setSaving(false));
      return next;
    });
  }, []);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2600);
  }

  if (!state) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:C.cream,flexDirection:"column",gap:12}}>
      <div style={{width:36,height:36,borderRadius:"50%",border:`3px solid ${C.rose}`,borderTopColor:"transparent",animation:"spin 0.8s linear infinite"}}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <p style={{color:C.muted,fontSize:"0.82rem"}}>Carregando seus dados...</p>
    </div>
  );

  const treinoKey = (dia) => `${today()}-${dia}`;
  const serieKey = (dia, ei, si) => `${today()}-${dia}-${ei}-${si}`;

  // ── HEADER ───────────────────────────────────────────────
  const Header = () => (
    <header style={{background:`linear-gradient(150deg,${C.plum} 0%,${C.plumMid} 60%,#7A3060 100%)`,padding:"24px 20px 20px",textAlign:"center",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",width:170,height:170,borderRadius:"50%",background:"rgba(201,169,110,0.12)",top:-50,right:-30}}/>
      <div style={{position:"absolute",width:85,height:85,borderRadius:"50%",background:"rgba(196,137,154,0.15)",bottom:-20,left:30}}/>
      <h1 style={{fontFamily:"DM Serif Display,serif",fontSize:"1.8rem",color:"white",letterSpacing:"-0.02em",position:"relative",zIndex:1}}>💪 Musculação</h1>
      <p style={{fontSize:"0.8rem",color:C.roseLight,marginTop:4,fontWeight:300,position:"relative",zIndex:1}}>Sara · Academia · Seg–Sex</p>
      <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",marginTop:12,position:"relative",zIndex:1}}>
        {["⌛ Cintura fina","🍑 Glúteos","🏋️ Máquinas"].map(t=>(
          <span key={t} style={{display:"inline-flex",alignItems:"center",gap:5,background:"rgba(201,169,110,0.2)",border:"1px solid rgba(201,169,110,0.4)",borderRadius:20,padding:"4px 12px",fontSize:"0.73rem",fontWeight:500,color:"#EDD9A3"}}>{t}</span>
        ))}
      </div>
      {saving && <div style={{position:"absolute",top:10,right:14,fontSize:"0.65rem",color:"rgba(255,255,255,0.5)"}}>salvando…</div>}
    </header>
  );

  // ── NAV ──────────────────────────────────────────────────
  const Nav = () => (
    <nav style={{display:"flex",background:"white",borderBottom:`1px solid ${C.border}`,overflowX:"auto",position:"sticky",top:0,zIndex:100}}>
      {[["treino","Treino"],["semana","Semana"],["historico","Histórico"],["evolucao","Evolução"],["guia","Guia"]].map(([id,label])=>(
        <button key={id} onClick={()=>setTab(id)} style={{flex:1,minWidth:70,padding:"13px 6px",border:"none",background:"none",cursor:"pointer",fontFamily:"DM Sans,sans-serif",fontSize:"0.74rem",fontWeight:500,color:tab===id?C.plum:C.muted,borderBottom:`2px solid ${tab===id?C.gold:"transparent"}`,transition:"all 0.2s",whiteSpace:"nowrap"}}>{label}</button>
      ))}
    </nav>
  );

  // ── CARD ─────────────────────────────────────────────────
  const Card = ({children,style={}}) => <div style={{background:C.card,borderRadius:16,border:`1px solid ${C.border}`,padding:18,marginBottom:14,...style}}>{children}</div>;
  const CardTitle = ({children}) => <div style={{fontSize:"0.67rem",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.09em",color:C.muted,marginBottom:14}}>{children}</div>;

  // ── TAB TREINO ───────────────────────────────────────────
  const TabTreino = () => {
    const t = TREINOS[state.diaAtivo];
    const done = !!state.concluidos[treinoKey(state.diaAtivo)];

    function toggleSerie(dia, ei, si) {
      const k = serieKey(dia, ei, si);
      setState(s => ({ ...s, series: { ...s.series, [k]: { ...s.series[k], done: !s.series[k]?.done } } }));
    }
    function saveSerie(dia, ei, si, field, val) {
      const k = serieKey(dia, ei, si);
      setState(s => ({ ...s, series: { ...s.series, [k]: { ...s.series[k], [field]: val } } }));
    }
    function concluirEx(ei) {
      const dia = state.diaAtivo;
      const ex = TREINOS[dia].exercicios[ei];
      setState(s => {
        const ns = { ...s.series };
        for (let si = 0; si < ex.series; si++) ns[serieKey(dia,ei,si)] = { ...ns[serieKey(dia,ei,si)], done: true };
        return { ...s, series: ns };
      });
      showToast("Exercício concluído! 💪");
    }
    function concluirTreino() {
      const dia = state.diaAtivo;
      const t2 = TREINOS[dia];
      let cargaTotal = 0;
      t2.exercicios.forEach((ex, ei) => {
        for (let si = 0; si < ex.series; si++) {
          const sd = state.series[serieKey(dia,ei,si)] || {};
          cargaTotal += (parseInt(sd.reps)||0) * (parseFloat(sd.carga)||0);
        }
      });
      setState(s => ({
        ...s,
        concluidos: { ...s.concluidos, [treinoKey(dia)]: true },
        historico: [...s.historico, { data: today(), dia, nome: t2.nome, cargaTotal, semana: getWeek() }]
      }));
      showToast("Treino concluído! 🎉");
    }

    return (
      <div>
        {/* day tabs */}
        <div style={{display:"flex",gap:6,marginBottom:14,overflowX:"auto",paddingBottom:4}}>
          {DIAS.map(d => {
            const isDone = !!state.concluidos[treinoKey(d)];
            const isActive = state.diaAtivo === d;
            return <button key={d} onClick={()=>{ setState(s=>({...s,diaAtivo:d})); setOpenEx(null); }}
              style={{flexShrink:0,padding:"7px 14px",borderRadius:20,border:`1px solid ${isActive?C.plum:isDone?C.gold:C.border}`,background:isActive?C.plum:isDone?C.goldPale:"white",fontSize:"0.74rem",fontWeight:600,color:isActive?"white":isDone?C.plum:C.muted,cursor:"pointer"}}>{DIAS_LABEL[d]}</button>;
          })}
        </div>

        <Card>
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:16}}>
            <div>
              <div style={{fontFamily:"DM Serif Display,serif",fontSize:"1.25rem",color:C.plum}}>{t.nome}</div>
              <div style={{fontSize:"0.73rem",color:C.muted,marginTop:2}}>{t.dur} · {t.exercicios.length} exercícios</div>
            </div>
            <span style={{display:"flex",alignItems:"center",gap:5,background:C.goldPale,border:`1px solid ${C.gold}`,borderRadius:20,padding:"4px 10px",fontSize:"0.69rem",fontWeight:600,color:"#7A5C2A",whiteSpace:"nowrap"}}>{t.foco}</span>
          </div>

          {done && <div style={{background:"rgba(107,170,142,0.1)",borderLeft:`3px solid ${C.success}`,borderRadius:"0 10px 10px 0",padding:"10px 13px",marginBottom:14,fontSize:"0.78rem",color:C.plum}}>
            <strong style={{display:"block",fontSize:"0.68rem",textTransform:"uppercase",letterSpacing:"0.07em",color:C.success,marginBottom:2}}>✅ Treino concluído hoje!</strong>
            Ótimo trabalho. Volte amanhã mais forte.
          </div>}

          {t.exercicios.map((ex, ei) => {
            const allDone = Array.from({length:ex.series},(_,si)=>state.series[serieKey(state.diaAtivo,ei,si)]?.done).every(Boolean);
            const isOpen = openEx === ei;
            return (
              <div key={ei} style={{border:`1px solid ${allDone?C.success:C.border}`,borderRadius:12,marginBottom:10,overflow:"hidden",transition:"border-color 0.2s"}}>
                <div onClick={()=>setOpenEx(isOpen?null:ei)} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",cursor:"pointer"}}>
                  <div style={{width:28,height:28,borderRadius:"50%",background:allDone?C.success:C.rosePale,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.7rem",fontWeight:500,color:allDone?"white":C.plumMid,flexShrink:0}}>
                    {allDone?"✓":ei+1}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:"0.86rem",fontWeight:600,color:C.ink}}>{ex.nome}</div>
                    <div style={{fontSize:"0.71rem",color:C.muted,marginTop:2}}>{ex.maquina}</div>
                  </div>
                  <span style={{fontFamily:"DM Mono,monospace",fontSize:"0.7rem",background:C.rosePale,color:C.plumMid,padding:"3px 8px",borderRadius:8,whiteSpace:"nowrap"}}>{ex.series}×{ex.reps}</span>
                  <span style={{color:C.muted,fontSize:"0.78rem",transform:isOpen?"rotate(180deg)":"none",transition:"transform 0.2s"}}>▾</span>
                </div>

                {isOpen && (
                  <div style={{padding:"0 14px 14px",borderTop:`1px solid ${C.border}`}}>
                    {/* SVG ilustração */}
                    <div style={{display:"flex",alignItems:"center",gap:12,margin:"12px 0"}}>
                      <div style={{background:C.rosePale,borderRadius:12,padding:"10px 14px",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}
                        onClick={()=>setModal({nome:ex.nome,maquina:ex.maquina,musculos:ex.musculos})}
                        dangerouslySetInnerHTML={{__html:getSVG(ex.nome)}}
                        title="Ver em tela cheia"
                      />
                      <div style={{flex:1}}>
                        <div style={{background:C.rosePale,borderLeft:`3px solid ${C.rose}`,borderRadius:"0 8px 8px 0",padding:"8px 11px",fontSize:"0.73rem",color:C.plum,lineHeight:1.5}}>
                          <strong style={{display:"block",fontSize:"0.66rem",textTransform:"uppercase",letterSpacing:"0.07em",color:C.muted,marginBottom:3}}>Execução</strong>
                          {ex.dica}
                        </div>
                        <div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:7}}>
                          {ex.musculos.map(m=><span key={m} style={{fontSize:"0.66rem",background:C.goldPale,border:`1px solid ${C.gold}`,color:"#7A5C2A",padding:"2px 7px",borderRadius:7}}>{m}</span>)}
                        </div>
                      </div>
                    </div>

                    {/* Series grid */}
                    <div style={{display:"grid",gridTemplateColumns:"auto 1fr 1fr auto",gap:"6px 8px",alignItems:"center",marginBottom:10}}>
                      {["Série","Reps","Carga (kg)","✓"].map(h=><div key={h} style={{fontSize:"0.63rem",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.07em",color:C.muted,textAlign:"center"}}>{h}</div>)}
                      {Array.from({length:ex.series},(_,si)=>{
                        const k = serieKey(state.diaAtivo,ei,si);
                        const sd = state.series[k]||{};
                        return [
                          <div key={`n${si}`} style={{fontFamily:"DM Mono,monospace",fontSize:"0.76rem",color:C.muted,textAlign:"center"}}>{si+1}</div>,
                          <input key={`r${si}`} type="number" placeholder={ex.reps.split("–")[0]} defaultValue={sd.reps||""} onBlur={e=>saveSerie(state.diaAtivo,ei,si,"reps",e.target.value)} style={{padding:"7px 8px",border:`1px solid ${C.border}`,borderRadius:8,fontFamily:"DM Mono,monospace",fontSize:"0.8rem",color:C.ink,textAlign:"center",outline:"none",width:"100%"}}/>,
                          <input key={`c${si}`} type="number" placeholder="kg" defaultValue={sd.carga||""} onBlur={e=>saveSerie(state.diaAtivo,ei,si,"carga",e.target.value)} style={{padding:"7px 8px",border:`1px solid ${C.border}`,borderRadius:8,fontFamily:"DM Mono,monospace",fontSize:"0.8rem",color:C.ink,textAlign:"center",outline:"none",width:"100%"}}/>,
                          <button key={`d${si}`} onClick={()=>toggleSerie(state.diaAtivo,ei,si)} style={{width:30,height:30,borderRadius:"50%",border:`2px solid ${sd.done?C.success:C.border}`,background:sd.done?C.success:"none",color:sd.done?"white":"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.88rem"}}>{sd.done?"✓":""}</button>
                        ];
                      })}
                    </div>

                    <button onClick={()=>concluirEx(ei)} style={{width:"100%",padding:10,background:`linear-gradient(135deg,${C.plum},${C.plumMid})`,color:"white",border:"none",borderRadius:10,fontFamily:"DM Sans,sans-serif",fontSize:"0.8rem",fontWeight:600,cursor:"pointer"}}>
                      Marcar exercício como feito
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          <button onClick={concluirTreino} style={{width:"100%",padding:13,background:done?C.rosePale:`linear-gradient(135deg,${C.plum},${C.plumMid})`,color:done?C.muted:"white",border:`1px solid ${done?C.border:"transparent"}`,borderRadius:12,fontFamily:"DM Sans,sans-serif",fontSize:"0.88rem",fontWeight:600,cursor:"pointer",marginTop:6}}>
            {done?"✅ Treino já concluído hoje":"🏁 Concluir treino do dia"}
          </button>
        </Card>
      </div>
    );
  };

  // ── TAB SEMANA ───────────────────────────────────────────
  const TabSemana = () => {
    const total = state.historico.length;
    const semAtual = getWeek();
    const estaSemana = state.historico.filter(h=>h.semana===semAtual).length;
    const cargaTotal = state.historico.reduce((a,h)=>a+(h.cargaTotal||0),0);
    const semanas = new Set(state.historico.map(h=>h.semana)).size;
    return (
      <div>
        <Card>
          <CardTitle>Esta semana</CardTitle>
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8}}>
            {DIAS.map(d=>{
              const f = !!state.concluidos[treinoKey(d)];
              return <div key={d} style={{borderRadius:10,padding:"10px 6px",textAlign:"center",border:`1px solid ${f?C.plum:C.border}`,background:f?C.plum:"white"}}>
                <div style={{fontSize:"0.63rem",fontWeight:600,color:f?C.roseLight:C.muted}}>{DIAS_LABEL[d]}</div>
                <span style={{fontSize:"1.1rem",marginTop:4,display:"block"}}>{f?"✅":"○"}</span>
              </div>;
            })}
          </div>
        </Card>
        <Card>
          <CardTitle>Progresso acumulado</CardTitle>
          {[["Treinos feitos",total,40],["Esta semana",estaSemana,5]].map(([l,v,max])=>(
            <div key={l} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
              <span style={{fontSize:"0.74rem",color:C.muted,minWidth:110}}>{l}</span>
              <div style={{flex:1,height:7,background:C.rosePale,borderRadius:10,overflow:"hidden"}}>
                <div style={{height:"100%",borderRadius:10,background:`linear-gradient(90deg,${C.plumLight},${C.gold})`,width:`${Math.min(100,v/max*100)}%`,transition:"width 0.5s"}}/>
              </div>
              <span style={{fontFamily:"DM Mono,monospace",fontSize:"0.71rem",color:C.plum,minWidth:34,textAlign:"right"}}>{v}/{max}</span>
            </div>
          ))}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginTop:14}}>
            {[[total,"treinos totais"],[semanas||0,"semanas ativas"],[cargaTotal>0?(cargaTotal/1000).toFixed(1)+"t":"—","carga total"]].map(([v,l])=>(
              <div key={l} style={{background:C.rosePale,borderRadius:12,padding:"13px 10px",textAlign:"center"}}>
                <div style={{fontFamily:"DM Mono,monospace",fontSize:"1.25rem",fontWeight:500,color:C.plum}}>{v}</div>
                <div style={{fontSize:"0.66rem",color:C.muted,marginTop:2}}>{l}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  };

  // ── TAB HISTÓRICO ─────────────────────────────────────────
  const TabHistorico = () => {
    const sorted = [...state.historico].sort((a,b)=>b.data.localeCompare(a.data));
    return (
      <Card>
        <CardTitle>Treinos registrados</CardTitle>
        {sorted.length===0
          ? <div style={{textAlign:"center",padding:"28px 16px",color:C.muted,fontSize:"0.84rem"}}><span style={{fontSize:"2rem",display:"block",marginBottom:8}}>📋</span>Nenhum treino concluído ainda.</div>
          : sorted.map((h,i)=>{
              const df = new Date(h.data+"T12:00:00").toLocaleDateString("pt-BR",{weekday:"short",day:"2-digit",month:"short"});
              return <div key={i} style={{padding:"12px 0",borderBottom:i<sorted.length-1?`1px solid ${C.border}`:"none"}}>
                <div style={{fontSize:"0.69rem",color:C.muted}}>{df}</div>
                <div style={{fontSize:"0.86rem",fontWeight:600,color:C.ink,margin:"2px 0"}}>{h.nome}</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:6}}>
                  {[DIAS_LABEL[h.dia], h.cargaTotal>0?`${h.cargaTotal.toFixed(0)} kg levantados`:null].filter(Boolean).map(t=>(
                    <span key={t} style={{fontFamily:"DM Mono,monospace",fontSize:"0.69rem",color:C.plumMid,background:C.rosePale,padding:"2px 8px",borderRadius:6}}>{t}</span>
                  ))}
                </div>
              </div>;
            })}
      </Card>
    );
  };

  // ── TAB EVOLUÇÃO ─────────────────────────────────────────
  const TabEvolucao = () => {
    const porSemana={}, cargaSem={};
    state.historico.forEach(h=>{ porSemana[h.semana]=(porSemana[h.semana]||0)+1; cargaSem[h.semana]=(cargaSem[h.semana]||0)+(h.cargaTotal||0); });
    const semKeys = Object.keys(porSemana).sort();
    const maxC = Math.max(1,...semKeys.map(k=>cargaSem[k]));
    const EvoBar=({label,val,max,right,color})=>(
      <div style={{marginBottom:8}}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.71rem",color:C.muted,marginBottom:4}}><span>{label}</span><span>{right}</span></div>
        <div style={{height:8,background:C.rosePale,borderRadius:10,overflow:"hidden"}}>
          <div style={{height:"100%",borderRadius:10,background:color||`linear-gradient(90deg,${C.plumLight},${C.gold})`,width:`${Math.min(100,val/max*100)}%`}}/>
        </div>
      </div>
    );
    return (
      <div>
        <Card>
          <CardTitle>Frequência semanal</CardTitle>
          {semKeys.length===0
            ? <div style={{textAlign:"center",padding:"20px 16px",color:C.muted,fontSize:"0.83rem"}}><span style={{fontSize:"1.8rem",display:"block",marginBottom:6}}>📊</span>Conclua treinos para ver.</div>
            : semKeys.map((k,i)=><EvoBar key={k} label={`Semana ${i+1}`} val={porSemana[k]} max={5} right={`${porSemana[k]}/5 dias`}/>)}
        </Card>
        <Card>
          <CardTitle>Carga total por semana (kg)</CardTitle>
          {semKeys.length===0||semKeys.every(k=>!cargaSem[k])
            ? <div style={{textAlign:"center",padding:"20px 16px",color:C.muted,fontSize:"0.83rem"}}><span style={{fontSize:"1.8rem",display:"block",marginBottom:6}}>🏋️</span>Registre cargas nos exercícios.</div>
            : semKeys.map((k,i)=><EvoBar key={k} label={`Semana ${i+1}`} val={cargaSem[k]} max={maxC} right={`${cargaSem[k].toFixed(0)} kg`}/>)}
        </Card>
      </div>
    );
  };

  // ── TAB GUIA ──────────────────────────────────────────────
  const TabGuia = () => (
    <div>
      <div style={{background:`linear-gradient(135deg,rgba(59,31,58,0.05),rgba(201,169,110,0.08))`,borderLeft:`3px solid ${C.gold}`,borderRadius:"0 10px 10px 0",padding:"12px 14px",marginBottom:12,fontSize:"0.78rem",color:C.ink,lineHeight:1.55}}>
        <strong style={{color:C.plum,display:"block",marginBottom:3,fontSize:"0.69rem",textTransform:"uppercase",letterSpacing:"0.06em"}}>A lógica do seu plano</strong>
        Cintura fina vem de glúteos e costas fortes que criam contraste — não de abdominais sozinhos. Glúteos bonitos exigem isolamento + carga progressiva.
      </div>
      <Card>
        <CardTitle>Estrutura semanal</CardTitle>
        {[
          {d:"Segunda",desc:"Glúteo & Posterior — cadeira flexora, mesa flexora, abdutora.",tags:["Cadeira flexora","Mesa flexora","Abdutora","Glúteo cabo"]},
          {d:"Terça",desc:"Cintura & Core — oblíquos, transverso e lombar. O espartilho natural.",tags:["Crunch abdominal","Rotação torácica","Hiperextensão","Cabo lateral"]},
          {d:"Quarta",desc:"Glúteo & Quadríceps — leg press, extensora e adutora.",tags:["Leg press","Extensora","Adutora","Abdutora"]},
          {d:"Quinta",desc:"Costas & Ombros — costas largas criam o V que afina a cintura.",tags:["Puxada alta","Remada","Elevação lateral","Voador inverso"]},
          {d:"Sexta",desc:"Glúteo Isolado — isolamento puro + abdômen de sustentação.",tags:["Kickback","Abdutora em pé","Crunch","Hiperextensão"]},
        ].map(({d,desc,tags})=>(
          <div key={d} style={{background:"white",border:`1px solid ${C.border}`,borderRadius:12,padding:14,marginBottom:10}}>
            <h3 style={{fontSize:"0.84rem",fontWeight:600,color:C.plum,marginBottom:6}}>{d}</h3>
            <p style={{fontSize:"0.77rem",color:C.muted,lineHeight:1.55,marginBottom:8}}>{desc}</p>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {tags.map(t=><span key={t} style={{fontSize:"0.67rem",background:C.goldPale,border:`1px solid ${C.gold}`,color:"#7A5C2A",padding:"2px 8px",borderRadius:8,fontWeight:500}}>{t}</span>)}
            </div>
          </div>
        ))}
      </Card>
    </div>
  );

  // ── MODAL ─────────────────────────────────────────────────
  const Modal = () => !modal ? null : (
    <div onClick={e=>{ if(e.target===e.currentTarget) setModal(null); }}
      style={{position:"fixed",inset:0,background:"rgba(30,18,32,0.75)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:24,backdropFilter:"blur(4px)"}}>
      <div style={{background:"white",borderRadius:20,width:"100%",maxWidth:360,overflow:"hidden",boxShadow:`0 20px 60px rgba(59,31,58,0.3)`,animation:"modalIn 0.25s ease"}}>
        <style>{`@keyframes modalIn{from{transform:scale(0.88);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
        <div style={{background:C.rosePale,padding:"28px 24px 20px",display:"flex",alignItems:"center",justifyContent:"center",minHeight:200}}
          dangerouslySetInnerHTML={{__html:getSVG(modal.nome).replace('style="width:','style="width:260px;max-width:100%;height:auto;') }}
        />
        <div style={{padding:"16px 18px 20px"}}>
          <div style={{fontFamily:"DM Serif Display,serif",fontSize:"1.08rem",color:C.plum,marginBottom:4}}>{modal.nome}</div>
          <div style={{fontSize:"0.72rem",color:C.muted,marginBottom:10}}>🏋️ {modal.maquina}</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
            {modal.musculos.map(m=><span key={m} style={{fontSize:"0.67rem",background:C.rosePale,border:`1px solid ${C.roseLight}`,color:C.plumMid,padding:"2px 8px",borderRadius:8}}>{m}</span>)}
          </div>
          <button onClick={()=>setModal(null)} style={{width:"100%",padding:11,background:C.rosePale,border:"none",borderRadius:10,fontFamily:"DM Sans,sans-serif",fontSize:"0.83rem",fontWeight:600,color:C.plum,cursor:"pointer"}}>Fechar</button>
        </div>
      </div>
    </div>
  );

  // ── TOAST ─────────────────────────────────────────────────
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
        {tab==="treino"   && <TabTreino/>}
        {tab==="semana"   && <TabSemana/>}
        {tab==="historico"&& <TabHistorico/>}
        {tab==="evolucao" && <TabEvolucao/>}
        {tab==="guia"     && <TabGuia/>}
      </div>
      <Modal/>
      <Toast/>
    </div>
  );
}
