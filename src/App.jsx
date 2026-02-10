import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  Plus, Trash2, RotateCcw, Settings, Edit3, Check, X, Download, Share2, 
  Undo2, BookOpen, Dices, Eye, ArrowLeft, Trophy, Medal, Activity, Lock, 
  History as HistoryIcon, Timer, EyeOff, Palette, Sun, Monitor, 
  Zap, Scale, Swords, ThumbsDown, ThumbsUp, Crown, 
  ScrollText, Award, Flame, Coffee, Ghost, Moon, Wand2,
  TrendingUp, AlertTriangle, Gift, Camera, Calendar, PenLine, Info, Save,
  Play, Pause, Skull, Sparkles, Image, BarChart3, HelpCircle, LockKeyhole, Star, Gavel, Frown
} from "lucide-react";

// --- CONFIGURATION ---
const categories = [
  { id:"upperHeader", upperHeader:true },
  // 'max' ajouté pour calculer les Yams Cachés
  { id:"ones", name:"As", values:[0,1,2,3,4,5], upper:true, icon:"⚀", color:"#3b82f6", max:5 },
  { id:"twos", name:"Deux", values:[0,2,4,6,8,10], upper:true, icon:"⚁", color:"#8b5cf6", max:10 },
  { id:"threes", name:"Trois", values:[0,3,6,9,12,15], upper:true, icon:"⚂", color:"#ec4899", max:15 },
  { id:"fours", name:"Quatre", values:[0,4,8,12,16,20], upper:true, icon:"⚃", color:"#f97316", max:20 },
  { id:"fives", name:"Cinq", values:[0,5,10,15,20,25], upper:true, icon:"⚄", color:"#10b981", max:25 },
  { id:"sixes", name:"Six", values:[0,6,12,18,24,30], upper:true, icon:"⚅", color:"#06b6d4", max:30 },
  { id:"upperSectionDivider", upperDivider:true },
  { id:"upperTotal", name:"Sous-total", upperTotal:true, icon:"📊", color:"#a855f7" },
  { id:"bonus", name:"Bonus", bonus:true, icon:"🎁", color:"#fbbf24" },
  { id:"upperGrandTotal", name:"Total Sup.", upperGrandTotal:true, icon:"🔼", color:"#a855f7" },
  { id:"sectionDivider", divider:true },
  { id:"threeOfKind", name:"Brelan", values:Array.from({length:31},(_,i)=>i), lower:true, icon:"⚂⚂⚂", color:"#10b981", desc:"3 dés identiques", max:30 },
  { id:"fourOfKind", name:"Carré", values:Array.from({length:31},(_,i)=>i), lower:true, icon:"⚃⚃⚃⚃", color:"#06b6d4", desc:"4 dés identiques", max:30 },
  { id:"fullHouse", name:"Full", values:[0,25], lower:true, icon:"⚄⚄⚄⚂⚂", color:"#ec4899", desc:"3+2 identiques", max:25 },
  { id:"smallStraight", name:"P. Suite", values:[0,30], lower:true, icon:"⚀⚁⚂⚃", color:"#8b5cf6", desc:"4 suivis", max:30 },
  { id:"largeStraight", name:"G. Suite", values:[0,40], lower:true, icon:"⚀⚁⚂⚃⚄", color:"#3b82f6", desc:"5 suivis", max:40 },
  { id:"yams", name:"Yams", values:[0,50], lower:true, icon:"⚅⚅⚅⚅⚅", color:"#fbbf24", desc:"5 identiques", max:50 },
  { id:"chance", name:"Chance", values:Array.from({length:31},(_,i)=>i), lower:true, icon:"🍀", color:"#10b981", desc:"Total", max:30 },
  { id:"lowerTotal", name:"Total Inf.", lowerTotal:true, icon:"🔽", color:"#ec4899" }
];

const THEMES_CONFIG = {
  modern: { name: "Modern Dark", primary: "#6366f1", secondary: "#8b5cf6", bg: "from-slate-950 via-indigo-950 to-slate-950", card: "from-slate-900/90 to-slate-800/90", glow: "shadow-indigo-500/20", icon: <Monitor size={16}/>, part: "✨" },
  ocean: { name: "Deep Ocean", primary: "#06b6d4", secondary: "#0891b2", bg: "from-slate-950 via-cyan-950 to-slate-950", card: "from-slate-900/90 to-cyan-900/90", glow: "shadow-cyan-500/20", icon: <Share2 size={16}/>, part: "🫧" },
  sunset: { name: "Sunset Burn", primary: "#f97316", secondary: "#ea580c", bg: "from-slate-950 via-orange-950 to-slate-950", card: "from-slate-900/90 to-orange-900/90", glow: "shadow-orange-500/20", icon: <Sun size={16}/>, part: "🔥" },
  forest: { name: "Emerald Forest", primary: "#10b981", secondary: "#059669", bg: "from-slate-950 via-emerald-950 to-slate-950", card: "from-slate-900/90 to-emerald-900/90", glow: "shadow-emerald-500/20", icon: <BookOpen size={16}/>, part: "🍃" },
  cyber: { name: "Cyberpunk", primary: "#d946ef", secondary: "#8b5cf6", bg: "from-black via-fuchsia-950 to-black", card: "from-black/90 to-purple-900/90", glow: "shadow-fuchsia-500/40", icon: <Zap size={16}/>, part: "⚡" },
  coffee: { name: "Coffee Break", primary: "#d97706", secondary: "#92400e", bg: "from-stone-950 via-stone-900 to-stone-800", card: "from-stone-900/95 to-stone-800/95", glow: "shadow-amber-700/20", icon: <Coffee size={16}/>, part: "☕" },
  lavender: { name: "Lavender", primary: "#a78bfa", secondary: "#7c3aed", bg: "from-violet-950 via-slate-900 to-violet-900", card: "from-violet-900/80 to-slate-900/80", glow: "shadow-violet-400/20", icon: <Ghost size={16}/>, part: "🌸" },
  mono: { name: "Monochrome", primary: "#94a3b8", secondary: "#475569", bg: "from-gray-950 via-gray-900 to-black", card: "from-gray-900 to-black", glow: "shadow-white/10", icon: <Moon size={16}/>, part: "⚪" }
};

const DICE_SKINS = {
    classic: { name: "Classique", bg: "bg-white", text: "text-black", border: "border-slate-200" },
    casino: { name: "Casino", bg: "bg-red-600", text: "text-white", border: "border-red-800" },
    neon: { name: "Néon", bg: "bg-black", text: "text-green-400", border: "border-green-500 shadow-[0_0_10px_#4ade80]" },
    gold: { name: "Luxe", bg: "bg-yellow-400", text: "text-yellow-900", border: "border-yellow-600" }
};

const CHAOS_EVENTS = [
    { title: "Mains de Beurre", desc: "Vous n'avez droit qu'à 2 lancers ce tour-ci.", icon: "🧈" },
    { title: "Braquage", desc: "Volez 5 points imaginaires au joueur précédent.", icon: "💰" },
    { title: "Chance Double", desc: "Si vous jouez Chance, comptez double !", icon: "🍀" },
    { title: "Silence !", desc: "Interdiction de parler jusqu'au prochain tour.", icon: "🤫" },
    { title: "Cadeau", desc: "Offrez un dé (virtuel) à votre voisin.", icon: "🎁" },
    { title: "Miroir", desc: "Copiez le score d'une case d'un adversaire.", icon: "🪞" },
    { title: "Lancer Aveugle", desc: "Lancez les dés les yeux fermés.", icon: "🙈" },
    { title: "Rien ne va plus", desc: "Aucun effet, ouf !", icon: "😌" }
];

const ACHIEVEMENTS = [
    { id: "first_win", name: "Première Victoire", desc: "Gagner une partie", xp: 100, icon: "🥇" },
    { id: "score_300", name: "Légende", desc: "Faire un score > 300", xp: 500, icon: "🔥" },
    { id: "score_350", name: "Dieu du Yams", desc: "Faire un score > 350", xp: 1000, icon: "⚡" },
    { id: "yams_king", name: "Yams Master", desc: "Faire 10 Yams au total", xp: 300, icon: "🎲" },
    { id: "veteran", name: "Vétéran", desc: "Jouer 50 parties", xp: 500, icon: "👴" },
    { id: "bonus_hunter", name: "Chasseur de Bonus", desc: "Obtenir 20 fois le bonus", xp: 400, icon: "🎁" },
    { id: "perfect_lose", name: "Lanterne Rouge", desc: "Faire moins de 150 points", xp: 150, icon: "🐌" },
    { id: "chaos_survivor", name: "Chaos Survivor", desc: "Gagner en mode Chaos", xp: 250, icon: "🌪️" },
];

const AVATAR_LIST = [
    { icon: "👤", req: "none" }, { icon: "🙂", req: "none" }, { icon: "😎", req: "none" }, { icon: "🤠", req: "none" },
    { icon: "🤖", req: "games:1" }, { icon: "🦊", req: "games:5" }, { icon: "🦁", req: "wins:1" }, { icon: "👑", req: "wins:5" },
    { icon: "🎯", req: "yams:1" }, { icon: "🎲", req: "yams:5" }, { icon: "🔥", req: "score:300" }, { icon: "🦄", req: "score:350" },
    { icon: "💀", req: "lose:1" }, { icon: "💩", req: "lose:5" }, { icon: "👽", req: "bonus:1" }, { icon: "💎", req: "bonus:10" }
];

const playableCats = categories.filter(c=>!c.upperTotal&&!c.bonus&&!c.divider&&!c.upperGrandTotal&&!c.lowerTotal&&!c.upperDivider&&!c.upperHeader);
const upperCats = categories.filter(c => c.upper && !c.upperHeader && !c.upperDivider && !c.upperTotal && !c.upperGrandTotal);
const DEFAULT_GAGES = ["Ranger le jeu tout seul 🧹", "Servir à boire à tout le monde 🥤", "Ne plus dire 'non' pendant 10 min 🤐", "Choisir la musique pour 1h 🎵", "Imiter une poule à chaque phrase 🐔", "Faire 10 pompes (ou squats) 💪", "Appeler le gagnant 'Mon Seigneur' 👑", "Jouer la prochaine partie les yeux fermés au lancer 🙈"];

// --- UTILS & COMPONENTS ---
const calculateSimulatedScores = (dice) => {
  const counts = {}; let sum = 0; dice.forEach(d => { counts[d] = (counts[d] || 0) + 1; sum += d; });
  const countValues = Object.values(counts); const uniqueDice = Object.keys(counts).map(Number).sort((a,b)=>a-b);
  let consecutive = 0, maxConsecutive = 0;
  for(let i=0; i<uniqueDice.length-1; i++) {
      if(uniqueDice[i+1] === uniqueDice[i]+1) consecutive++; else consecutive = 0;
      if(consecutive > maxConsecutive) maxConsecutive = consecutive;
  }
  return {
    scores: {
        ones:(counts[1]||0)*1, twos:(counts[2]||0)*2, threes:(counts[3]||0)*3, fours:(counts[4]||0)*4, fives:(counts[5]||0)*5, sixes:(counts[6]||0)*6,
        threeOfKind:countValues.some(c=>c>=3)?sum:0, fourOfKind:countValues.some(c=>c>=4)?sum:0,
        fullHouse:(countValues.includes(3)&&countValues.includes(2))?25:0,
        smallStraight:maxConsecutive>=3?30:0, largeStraight:maxConsecutive>=4?40:0, yams:countValues.includes(5)?50:0, chance:sum
    },
    difficulty: { 
        yams: countValues.includes(5) ? 'extreme' : 'hard', largeStraight: maxConsecutive >= 4 ? 'hard' : 'medium', smallStraight: maxConsecutive >= 3 ? 'medium' : 'low',
        fullHouse: (countValues.includes(3)&&countValues.includes(2)) ? 'medium' : 'hard', fourOfKind: countValues.some(c=>c>=4) ? 'medium' : 'hard', threeOfKind: countValues.some(c=>c>=3) ? 'low' : 'medium'
    }
  };
};

const ScoreInput = ({ value, onChange, category, isHighlighted, isLocked, isImposedDisabled, isFoggy }) => {
  if(isFoggy && isLocked) return <div className="w-full py-3 text-center text-gray-500 font-black animate-pulse text-xs sm:text-lg">???</div>;
  if(isImposedDisabled) return <div className="w-full py-3 text-center text-gray-700 font-bold bg-black/20 rounded-xl opacity-30 cursor-not-allowed text-xs sm:text-lg">🔒</div>;
  const cat = categories.find(c=>c.id===category); const vals = cat?.values || Array.from({length:31},(_,i)=>i);
  return (
    <select value={value??''} onChange={e=>onChange(e.target.value, e)} disabled={isLocked}
      className={`w-full py-3 px-2 rounded-xl font-bold text-sm sm:text-lg text-center transition-all duration-300 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50 ${isLocked?'cursor-not-allowed opacity-60 bg-white/5 text-gray-400 border border-white/10':isHighlighted?'cursor-pointer bg-gradient-to-r from-green-500/30 to-emerald-500/30 border-2 border-green-400 text-white shadow-lg shadow-green-500/50 ring-pulse':'cursor-pointer bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 hover:shadow-lg hover:shadow-white/5'}`}
      style={isLocked||isHighlighted?{}:{background:'linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.1))',color:'white'}}>
      <option value="" style={{backgroundColor:'#1e293b',color:'white'}}>-</option>
      {vals.map(v=><option key={v} value={v} style={{backgroundColor:'#1e293b',color:'white'}}>{v}</option>)}
    </select>
  );
};

const PlayerCard = ({ player, index, onRemove, onNameChange, canRemove, gameStarted, avatar, onAvatarClick }) => {
  const [editing, setEditing] = useState(false); const [name, setName] = useState(player); const save = () => { if(name.trim()){onNameChange(index,name.trim());setEditing(false);} };
  return (
    <div className="glass-strong rounded-2xl p-3 sm:p-4 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group" style={{animationDelay:`${index*80}ms`,animation:'fade-in-scale 0.4s ease-out backwards'}}>
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        <button onClick={() => onAvatarClick(index)} className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-xl hover:bg-white/20 transition-all duration-300 shadow-inner overflow-hidden cursor-pointer hover:scale-110 hover:shadow-lg group-hover:ring-2 group-hover:ring-white/20">
            {avatar && avatar.startsWith('data:image') ? <img src={avatar} alt="Avatar" className="w-full h-full object-cover" /> : (avatar || "👤")}
        </button>
        {editing ? <input type="text" value={name} onChange={e=>setName(e.target.value)} onKeyPress={e=>e.key==='Enter'&&save()} className="flex-1 bg-white/10 border border-white/20 rounded-xl px-2 py-1 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-white/50 text-sm" autoFocus/>
          : <span className="flex-1 text-white font-bold text-sm sm:text-lg truncate">{player}</span>}
        <div className="flex gap-1">
          {editing ? <button onClick={save} className="p-1.5 sm:p-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-xl"><Check size={16}/></button>
            : <button onClick={()=>setEditing(true)} className="p-1.5 sm:p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl"><Edit3 size={16}/></button>}
          {canRemove&&!gameStarted&&<button onClick={()=>onRemove(index)} className="p-1.5 sm:p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl"><Trash2 size={16}/></button>}
        </div>
      </div>
    </div>
  );
};

const VisualDie = ({ value, onClick, skin }) => {
    const [rolling, setRolling] = useState(false); const s = DICE_SKINS[skin] || DICE_SKINS.classic; const handleClick = () => { setRolling(true); setTimeout(() => setRolling(false), 500); onClick(); };
    return (
        <button onClick={handleClick} className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl active:scale-90 transition-all duration-200 ${s.bg} ${s.text} ${s.border} border-2 shadow-lg hover:shadow-xl ${rolling ? '' : 'hover:-translate-y-1'}`} style={rolling ? {animation: 'dice-roll 0.6s ease-in-out'} : {}}>
            {['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'][value]}
        </button>
    );
};

const FloatingScore = ({ x, y, value }) => { return <div className="fixed pointer-events-none text-green-400 font-black text-2xl z-[100]" style={{ left: x, top: y, animation: 'floatUp 1s ease-out forwards', fontFamily: 'JetBrains Mono, monospace' }}>+{value}</div>; };

const GameFlowChart = ({ moveLog, players }) => {
    if (!moveLog || moveLog.length === 0) return <div className="text-center text-gray-500 text-xs py-8">Pas de données pour cette partie</div>;
    const history = []; const currentScores = {}; players.forEach(p => currentScores[p] = 0); history.push({ index: -1, ...currentScores });
    moveLog.forEach((move, index) => {
        if(currentScores[move.player] !== undefined) { currentScores[move.player] += parseInt(move.value); history.push({ index, ...currentScores }); }
    });
    if(history.length < 2) return <div className="text-center text-gray-500 text-xs py-8">Pas assez de coups joués</div>;
    const maxScore = Math.max(...history.map(h => Math.max(...Object.values(h).filter(v => typeof v === 'number' && v !== h.index))));
    const width = 1000; const height = 300; const paddingX = 40; const paddingY = 40; const colors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];
    return (
        <div className="relative w-full h-64 overflow-hidden bg-black/20 rounded-xl p-2">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
                {[0, 0.25, 0.5, 0.75, 1].map(p => { const y = paddingY + p * (height - 2*paddingY); return <line key={p} x1={paddingX} y1={y} x2={width-paddingX} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />; })}
                {players.map((player, pIdx) => {
                    const color = colors[pIdx % colors.length];
                    const points = history.map((step, i) => { const x = paddingX + (i / (history.length - 1)) * (width - 2 * paddingX); const y = (height - paddingY) - ((step[player] / (maxScore || 1)) * (height - 2 * paddingY)); return `${x},${y}`; }).join(' ');
                    return ( <g key={player}> <polyline points={points} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/> {history.map((step, i) => { const x = paddingX + (i / (history.length - 1)) * (width - 2 * paddingX); const y = (height - paddingY) - ((step[player] / (maxScore || 1)) * (height - 2 * paddingY)); if(history.length > 20 && i % 4 !== 0 && i !== history.length - 1) return null; return ( <g key={i}> <circle cx={x} cy={y} r="5" fill="#fff" stroke={color} strokeWidth="2" /> <text x={x} y={y - 15} fontSize="16" fill="#fff" textAnchor="middle" fontWeight="bold" style={{textShadow: '0 2px 4px rgba(0,0,0,0.8)'}}>{step[player]}</text> </g> ); })} </g> );
                })}
            </svg>
            <div className="flex justify-center gap-4 mt-2 flex-wrap absolute bottom-2 w-full">
                {players.map((p, i) => ( <div key={p} className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded-full"> <div className="w-3 h-3 rounded-full" style={{backgroundColor: colors[i % colors.length]}}></div> <span className="text-xs text-white font-bold">{p}</span> </div> ))}
            </div>
        </div>
    );
};

const DiceLuckChart = ({ stats }) => {
    if(!stats || stats.totalGames === 0) return <div className="text-center text-gray-500 text-xs py-8 bg-black/20 rounded-xl">Pas assez de données pour ce joueur</div>;
    const upperStats = [ { label: "1", val: stats.totalOnes || 0, max: (stats.totalGames || 1) * 5, desc: "As" }, { label: "2", val: stats.totalTwos || 0, max: (stats.totalGames || 1) * 10, desc: "Deux" }, { label: "3", val: stats.totalThrees || 0, max: (stats.totalGames || 1) * 15, desc: "Trois" }, { label: "4", val: stats.totalFours || 0, max: (stats.totalGames || 1) * 20, desc: "Quatre" }, { label: "5", val: stats.totalFives || 0, max: (stats.totalGames || 1) * 25, desc: "Cinq" }, { label: "6", val: stats.totalSixes || 0, max: (stats.totalGames || 1) * 30, desc: "Six" }, ];
    const data = upperStats.map(s => ({ ...s, pct: s.max > 0 ? Math.min(100, Math.round((s.val / s.max) * 100)) : 0 }));
    return (
        <div className="space-y-4 mt-4 bg-black/20 p-4 rounded-xl">
             {data.map((d, i) => ( <div key={i} className="flex items-center gap-4"> <div className="w-12 text-center"> <div className="font-black text-2xl text-white">{d.label}</div> <div className="text-[10px] text-gray-400 uppercase">{d.desc}</div> </div> <div className="flex-1 bg-white/5 rounded-full h-6 relative overflow-hidden border border-white/10"> <div className={`h-full transition-all duration-1000 ${d.pct > 75 ? 'bg-gradient-to-r from-green-500 to-emerald-400' : d.pct > 40 ? 'bg-gradient-to-r from-blue-500 to-cyan-400' : 'bg-gradient-to-r from-orange-500 to-red-400'}`} style={{ width: `${d.pct}%` }}></div> <div className="absolute inset-0 flex items-center justify-end pr-2 text-xs font-black text-white drop-shadow-md">{d.pct}%</div> </div> </div> ))}
        </div>
    );
};

const GameFlowChartMini = ({ moveLog, gamePlayers }) => {
    if (!moveLog || moveLog.length === 0) return null;
    const pNames = gamePlayers.map(p => p.name || p); const history = []; const currentScores = {}; pNames.forEach(p => currentScores[p] = 0); history.push({ ...currentScores });
    moveLog.forEach((move) => { if(currentScores[move.player] !== undefined) { currentScores[move.player] += parseInt(move.value) || 0; history.push({ ...currentScores }); } });
    if(history.length < 2) return null; const maxScore = Math.min(375, Math.max(...history.map(h => Math.max(...pNames.map(p => h[p] || 0))))); if(maxScore <= 0) return null; const w = 600, h = 160, px = 30, py = 20; const colors = ["#6366f1","#ef4444","#10b981","#f59e0b","#8b5cf6","#ec4899"];
    return (
        <div className="w-full mt-3 bg-black/30 rounded-xl p-2 border border-white/5" style={{animation:'fade-in-scale 0.4s ease-out'}}>
            <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{height:'120px'}} preserveAspectRatio="none">
                {[0,0.5,1].map(p=>{const y=py+p*(h-2*py);return <line key={p} x1={px} y1={y} x2={w-px} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>;})}
                {pNames.map((player, pIdx) => {
                    const color = colors[pIdx % colors.length]; const pts = history.map((step, i) => { const x = px + (i / (history.length - 1)) * (w - 2 * px); const y = (h - py) - ((Math.min(step[player]||0, 375) / maxScore) * (h - 2 * py)); return `${x},${y}`; }).join(' '); const lastStep = history[history.length - 1]; const lastX = px + ((history.length - 1) / (history.length - 1)) * (w - 2 * px); const lastY = (h - py) - ((Math.min(lastStep[player]||0, 375) / maxScore) * (h - 2 * py));
                    return ( <g key={player}> <polyline points={pts} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{filter:`drop-shadow(0 0 4px ${color}40)`}}/> <circle cx={lastX} cy={lastY} r="4" fill={color} stroke="#fff" strokeWidth="1.5"/> <text x={lastX+8} y={lastY+4} fontSize="11" fill={color} fontWeight="bold">{lastStep[player]||0}</text> </g> );
                })}
            </svg>
        </div>
    );
};

// --- COMPOSANT PRINCIPAL ---
export default function YamsUltimateLegacy() {
  const [players,setPlayers]=useState(['Joueur 1','Joueur 2']);
  const [scores,setScores]=useState({});
  const [theme,setTheme]=useState('modern');
  const [showSettings,setShowSettings]=useState(false);
  const [gameHistory,setGameHistory]=useState([]);
  const [currentTab,setCurrentTab]=useState('game');
  const [showEndGameModal,setShowEndGameModal]=useState(false);
  const [lastPlayerToPlay,setLastPlayerToPlay]=useState(null);
  const [showTurnWarning,setShowTurnWarning]=useState(null);
  const [lastModifiedCell,setLastModifiedCell]=useState(null);
  const [editMode,setEditMode]=useState(false);
  const [scoresBeforeEdit,setScoresBeforeEdit]=useState(null);
  const [lastPlayerBeforeEdit,setLastPlayerBeforeEdit]=useState(null);
  const [showVictoryAnimation,setShowVictoryAnimation]=useState(false);
  const [showAchievementNotif,setShowAchievementNotif]=useState(null);
  const [confetti,setConfetti]=useState(null);
  const [shakeAnimation,setShakeAnimation]=useState(null);
  const [hideTotals,setHideTotals]=useState(false);
  const [currentGage, setCurrentGage] = useState(null);
  const [undoData, setUndoData] = useState(null);
  const [starterName, setStarterName] = useState(null);
  const [simDice, setSimDice] = useState([1,1,1,1,1]);
  const [simPlayer, setSimPlayer] = useState(null);
  const [replayGame, setReplayGame] = useState(null);
  const [playerAvatars, setPlayerAvatars] = useState({});
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [avatarSelectorIndex, setAvatarSelectorIndex] = useState(null);
  const [imposedOrder, setImposedOrder] = useState(false);
  const [fogMode, setFogMode] = useState(false);
  const [speedMode, setSpeedMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [jokersEnabled, setJokersEnabled] = useState(false); 
  const [jokerMax, setJokerMax] = useState(2);
  const [jokers, setJokers] = useState({});
  const [diceSkin, setDiceSkin] = useState('classic');
  const [moveLog, setMoveLog] = useState([]);
  const [showLog, setShowLog] = useState(false);
  const [isReplaying, setIsReplaying] = useState(false);
  const [floatingScores, setFloatingScores] = useState([]);
  const [versus, setVersus] = useState({p1: '', p2: '', failPlayer: 'GLOBAL', yamsFilter: 'GLOBAL'});
  const [globalXP, setGlobalXP] = useState(0);
  const [chaosMode, setChaosMode] = useState(false);
  const [activeChaosCard, setActiveChaosCard] = useState(null);
  const [showStudioModal, setShowStudioModal] = useState(false);
  const [wakeLockEnabled, setWakeLockEnabled] = useState(true);
  
  // NEW FEATURES STATES
  const [showBonusMissedModal, setShowBonusMissedModal] = useState(null);
  const [showBonusWonModal, setShowBonusWonModal] = useState(null);
  const [showSuddenDeathModal, setShowSuddenDeathModal] = useState(false);
  const [suddenDeathScores, setSuddenDeathScores] = useState({});
  const [seasons, setSeasons] = useState([]); 
  const [activeSeason, setActiveSeason] = useState('Aucune');
  const [seasonDescriptions, setSeasonDescriptions] = useState({});
  const [newSeasonName, setNewSeasonName] = useState('');
  const [statsFilterSeason, setStatsFilterSeason] = useState('Toutes');
  const [historyFilterSeason, setHistoryFilterSeason] = useState('Toutes');
  const [renamingSeason, setRenamingSeason] = useState(null);
  const [tempSeasonName, setTempSeasonName] = useState('');
  const [editingHistoryId, setEditingHistoryId] = useState(null);
  
  const [pendingYamsDetail, setPendingYamsDetail] = useState(null);
  const [customGages, setCustomGages] = useState([]);
  const [enableDefaultGages, setEnableDefaultGages] = useState(true);
  const [newGageInput, setNewGageInput] = useState("");
  
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const replayIntervalRef = useRef(null);
  const T = THEMES_CONFIG[theme];

  const minSwipeDistance = 50;
  const onTouchStart = (e) => { setTouchEnd(null); setTouchStart(e.targetTouches[0].clientX); };
  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEndHandler = () => {
      if (!touchStart || !touchEnd) return;
      const distance = touchStart - touchEnd;
      const isLeftSwipe = distance > minSwipeDistance;
      const isRightSwipe = distance < -minSwipeDistance;
      const tabs = ['game', 'stats', 'history', 'trophies', 'gages', 'rules'];
      const currentIndex = tabs.indexOf(currentTab);
      if (isLeftSwipe && currentIndex < tabs.length - 1) setCurrentTab(tabs[currentIndex + 1]);
      if (isRightSwipe && currentIndex > 0) setCurrentTab(tabs[currentIndex - 1]);
  };

  useEffect(() => {
    let wakeLock = null;
    const requestWakeLock = async () => { if ('wakeLock' in navigator && wakeLockEnabled) { try { wakeLock = await navigator.wakeLock.request('screen'); } catch (err) { console.log(err); } } };
    if (wakeLockEnabled) requestWakeLock();
    const handleVisibilityChange = () => { if (wakeLock !== null && document.visibilityState === 'visible' && wakeLockEnabled) requestWakeLock(); };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => { if (wakeLock !== null) wakeLock.release(); document.removeEventListener('visibilitychange', handleVisibilityChange); };
  }, [wakeLockEnabled]);

  useEffect(()=>{loadHistory();loadCurrentGame();loadSavedPlayers();loadGlobalStats();loadSeasons();loadGages();},[]);
  const loadHistory=()=>{try{const r=localStorage.getItem('yamsHistory');if(r){const p=JSON.parse(r);setGameHistory(Array.isArray(p)?p:[]);}}catch(e){setGameHistory([])}};
  const saveHistory=(h)=>{try{localStorage.setItem('yamsHistory',JSON.stringify(h));}catch(e){}};
  const loadGlobalStats=()=>{try{const xp=localStorage.getItem('yamsGlobalXP');if(xp)setGlobalXP(parseInt(xp));}catch(e){}};
  const loadSeasons=()=>{try{const s=localStorage.getItem('yamsSeasons');const a=localStorage.getItem('yamsActiveSeason');const d=localStorage.getItem('yamsSeasonDesc');if(s)setSeasons(JSON.parse(s));if(a)setActiveSeason(a);if(d)setSeasonDescriptions(JSON.parse(d));}catch(e){}};
  const loadGages=()=>{try{const cg=localStorage.getItem('yamsCustomGages');const edg=localStorage.getItem('yamsEnableDefaultGages');if(cg)setCustomGages(JSON.parse(cg));if(edg)setEnableDefaultGages(JSON.parse(edg));}catch(e){}};

  useEffect(() => { localStorage.setItem('yamsCustomGages', JSON.stringify(customGages)); localStorage.setItem('yamsEnableDefaultGages', JSON.stringify(enableDefaultGages)); }, [customGages, enableDefaultGages]);
  const saveCurrentGame=(sc)=>{try{localStorage.setItem('yamsCurrentGame',JSON.stringify({players,scores:sc,lastPlayerToPlay,lastModifiedCell,starterName,timestamp:Date.now(), imposedOrder, fogMode, speedMode, jokers, jokerMax, jokersEnabled, diceSkin, moveLog, chaosMode, activeChaosCard, wakeLockEnabled, activeSeason}));}catch(e){}};
  const loadCurrentGame=()=>{try{const r=localStorage.getItem('yamsCurrentGame');if(r){const d=JSON.parse(r);if(d.players&&d.scores){setPlayers(d.players);setScores(d.scores);setLastPlayerToPlay(d.lastPlayerToPlay||null);setLastModifiedCell(d.lastModifiedCell||null);setStarterName(d.starterName || d.players[0]); setImposedOrder(d.imposedOrder||false); setFogMode(d.fogMode||false); setSpeedMode(d.speedMode||false); setJokers(d.jokers||{}); setJokerMax(d.jokerMax!==undefined?d.jokerMax:2); setJokersEnabled(d.jokersEnabled!==undefined?d.jokersEnabled:false); setDiceSkin(d.diceSkin||'classic'); setMoveLog(d.moveLog||[]); setChaosMode(d.chaosMode||false); setActiveChaosCard(d.activeChaosCard||null);
  setWakeLockEnabled(d.wakeLockEnabled !== undefined ? d.wakeLockEnabled : true);}}}catch(e){}};
  const loadSavedPlayers=()=>{try{const r=localStorage.getItem('yamsSavedPlayers');const av=localStorage.getItem('yamsPlayerAvatars');if(r)setPlayers(JSON.parse(r));if(av)setPlayerAvatars(JSON.parse(av));}catch(e){}};
  
  useEffect(() => { if(!isGameStarted()) { const newJokers = {}; players.forEach(p => newJokers[p] = jokerMax); setJokers(newJokers); } }, [jokerMax, players]);
  useEffect(() => { if(players.length > 0) { localStorage.setItem('yamsSavedPlayers', JSON.stringify(players)); if (!starterName) setStarterName(players[0]); if(!simPlayer) setSimPlayer(players[0]); const newJokers = {...jokers}; let changed = false; players.forEach(p => { if(newJokers[p] === undefined) { newJokers[p] = jokerMax; changed=true; } }); if(changed) setJokers(newJokers); } }, [players, jokerMax]);
  useEffect(() => { localStorage.setItem('yamsPlayerAvatars', JSON.stringify(playerAvatars)); }, [playerAvatars]);
  useEffect(() => { localStorage.setItem('yamsGlobalXP', globalXP.toString()); }, [globalXP]);
  useEffect(() => { localStorage.setItem('yamsSeasons', JSON.stringify(seasons)); localStorage.setItem('yamsActiveSeason', activeSeason); localStorage.setItem('yamsSeasonDesc', JSON.stringify(seasonDescriptions)); }, [seasons, activeSeason, seasonDescriptions]);
  useEffect(() => { let interval; if(speedMode && isGameStarted() && !isGameComplete() && !editMode) { if(timeLeft > 0) { interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000); } } return () => clearInterval(interval); }, [speedMode, timeLeft, scores, editMode]);
  useEffect(() => { setTimeLeft(30); }, [lastPlayerToPlay]);

  const createSeason = () => { if(newSeasonName && !seasons.includes(newSeasonName)) { setSeasons([...seasons, newSeasonName]); setActiveSeason(newSeasonName); setNewSeasonName(''); } };
  const updateSeasonDescription = (season, desc) => { setSeasonDescriptions(prev => ({...prev, [season]: desc})); };

  const isGameStarted=()=>Object.keys(scores).some(p=>scores[p]&&Object.keys(scores[p]).length>0);
  const addPlayer=()=>{if(players.length<6&&!isGameStarted())setPlayers([...players,`Joueur ${players.length+1}`]);};
  const removePlayer=i=>{if(players.length>1&&!isGameStarted()){const rem=players[i];const np=[...players];np.splice(i,1);setPlayers(np);const ns={...scores};delete ns[rem];setScores(ns);}};
  const updatePlayerName=(i,name)=>{const old=players[i];const np=[...players];np[i]=name;setPlayers(np);if(scores[old]){const ns={...scores};ns[name]=ns[old];delete ns[old];setScores(ns);}};
  const openAvatarSelector = (index) => { setAvatarSelectorIndex(index); setShowAvatarModal(true); };
  const selectAvatar = (icon) => { const p = players[avatarSelectorIndex]; setPlayerAvatars({...playerAvatars, [p]: icon}); setShowAvatarModal(false); };

  const addCustomGage = () => { if (newGageInput.trim()) { setCustomGages([...customGages, { id: Date.now(), text: newGageInput.trim(), active: true }]); setNewGageInput(""); } };
  const toggleCustomGage = (id) => { setCustomGages(customGages.map(g => g.id === id ? { ...g, active: !g.active } : g)); };
  const deleteCustomGage = (id) => { setCustomGages(customGages.filter(g => g.id !== id)); };

  const calcUpper= (p, sc=scores) => { if (!p || !sc[p]) return 0; return categories.filter(c=>c.upper).reduce((s,c)=>s+(sc[p]?.[c.id]||0),0); };
  const getBonus= (p, sc=scores) => calcUpper(p, sc)>=63?35:0;
  const calcUpperGrand= (p, sc=scores) => calcUpper(p, sc)+getBonus(p, sc);
  const calcLower= (p, sc=scores) => { if (!p || !sc[p]) return 0; return categories.filter(c=>c.lower).reduce((s,c)=>s+(sc[p]?.[c.id]||0),0); };
  const calcTotal= (p, sc=scores) => { if (!p) return 0; let total = calcUpperGrand(p, sc)+calcLower(p, sc); if(jokersEnabled) { const usedJokers = jokerMax - (jokers[p] !== undefined ? jokers[p] : jokerMax); if(usedJokers > 0) total -= (usedJokers * 10); } return total; };
  const getPlayerTotals = (p, sc=scores) => ({ upper: calcUpper(p, sc), bonus: getBonus(p, sc), lower: calcLower(p, sc), total: calcTotal(p, sc) });
  
  // GESTION TIE BREAKER (MORT SUBITE)
  const getWinner=(tieBreakerScores = {})=>{
      if(!players.length)return[];
      const totals = players.map(p => ({name: p, score: calcTotal(p), tieScore: tieBreakerScores[p] || 0}));
      const maxScore = Math.max(...totals.map(t => t.score));
      const tiedPlayers = totals.filter(t => t.score === maxScore);
      
      if(tiedPlayers.length > 1 && Object.keys(tieBreakerScores).length > 0) {
          const maxTie = Math.max(...tiedPlayers.map(t => t.tieScore));
          return tiedPlayers.filter(t => t.tieScore === maxTie).map(t => t.name);
      }
      return tiedPlayers.map(t => t.name);
  };
  
  const getLoser=()=>{if(!players.length)return null;const totals=players.map(p=>({name:p,score:calcTotal(p)}));const min=Math.min(...totals.map(t=>t.score));return totals.find(t=>t.score===min);};
  const isGameComplete=()=>{if(!players.length)return false;const ids=playableCats.map(c=>c.id);return players.every(p=>ids.every(id=>scores[p]?.[id]!==undefined));};
  const getNextPlayer=()=>{if(!lastPlayerToPlay) {return players.includes(starterName) ? starterName : players[0];} return players[(players.indexOf(lastPlayerToPlay)+1)%players.length];};
  const isAvatarLocked = (req, stats) => { if(req === "none") return false; const [cond, val] = req.split(':'); const v = parseInt(val); if(!stats) return true; if(cond === 'games') return stats.games < v; if(cond === 'wins') return stats.wins < v; if(cond === 'yams') return stats.yamsCount < v; if(cond === 'score') return stats.maxScore < v; if(cond === 'lose') return (stats.games - stats.wins) < v; if(cond === 'bonus') return stats.bonusCount < v; return true; };

  const useJoker = (player) => { if(jokers[player] > 0) { if(window.confirm(`Utiliser un Joker pour ${player} ? Cela coûtera 10 points à la fin !`)) { setJokers({...jokers, [player]: jokers[player] - 1}); } } };
  const handleUndo = () => { if (!undoData) return; const { player, category, previousLastPlayer, previousLastCell } = undoData; const newScores = { ...scores }; if (newScores[player]) { delete newScores[player][category]; } setScores(newScores); setLastPlayerToPlay(previousLastPlayer); setLastModifiedCell(previousLastCell); setUndoData(null); setMoveLog(moveLog.slice(0, -1)); saveCurrentGame(newScores); };

  const updateScore=(player,category,value, event)=>{
    const cellKey=`${player}-${category}`;
    if(imposedOrder && !editMode) { const pScores = scores[player] || {}; const firstEmptyIndex = playableCats.findIndex(c => pScores[c.id] === undefined); const targetIndex = playableCats.findIndex(c => c.id === category); if(targetIndex !== firstEmptyIndex) { setShowTurnWarning("Mode Ordre Imposé ! Tu dois remplir la première case vide."); setTimeout(()=>setShowTurnWarning(null),3000); return; } }
    if(!editMode) { const expectedPlayer = getNextPlayer(); if(player !== expectedPlayer) { setShowTurnWarning(`Hé non ! C'est à ${expectedPlayer} de commencer !`); setTimeout(()=>setShowTurnWarning(null),3000); return; } if(lastPlayerToPlay === player && lastModifiedCell !== null) { setShowTurnWarning(`Doucement ${player}, tu as déjà joué !`); setTimeout(()=>setShowTurnWarning(null),3000); return; } }
    if (!editMode) { setUndoData({ player, category, previousLastPlayer: lastPlayerToPlay, previousLastCell: lastModifiedCell }); setTimeout(() => setUndoData(null), 5000); }
    const ns={...scores,[player]:{...scores[player],[category]:value===''?undefined:parseInt(value)||0}};
    const valInt = value === '' ? 0 : parseInt(value);
    
    if(value !== '') {
        const catName = categories.find(c=>c.id===category)?.name || category;
        setMoveLog([...moveLog, { player, category: catName, value: valInt, time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }]);
        setGlobalXP(prev => prev + valInt);
    }
    if(value !== '' && value !== '0' && event) { const rect = event.target.getBoundingClientRect(); const id = Date.now(); setFloatingScores([...floatingScores, { id, x: rect.left + rect.width/2, y: rect.top, value: valInt }]); setTimeout(() => setFloatingScores(prev => prev.filter(f => f.id !== id)), 1000); }
    
    // LOGIQUE BONUS ET ANIMATIONS
    const upperCatsList = categories.filter(c => c.upper && !c.upperHeader && !c.upperDivider && !c.upperTotal && !c.upperGrandTotal);
    if(value !== '' && upperCatsList.some(c => c.id === category)) {
        const isUpperFull = upperCatsList.every(c => ns[player][c.id] !== undefined);
        const currentUpper = upperCatsList.reduce((acc, c) => acc + (ns[player][c.id] || 0), 0);
        const oldUp = calcUpper(player);
        
        // BONUS GAGNÉ
        if (oldUp < 63 && currentUpper >= 63) {
             setShowBonusWonModal({ player, score: currentUpper }); 
             setConfetti('bonus'); 
             setTimeout(() => { setShowBonusWonModal(null); setConfetti(null); }, 4000);
        }
        // BONUS RATÉ (Seulement si tout est plein et < 63)
        else if(isUpperFull && currentUpper < 63) {
             setShowBonusMissedModal({ player, score: currentUpper });
             setConfetti('sad');
             setTimeout(() => { setShowBonusMissedModal(null); setConfetti(null); }, 4000);
        }
    }

    if(category==='yams' && value==='50'){
        setPendingYamsDetail({ player });
        setConfetti('gold');
        setShakeAnimation('yams');
        setShowAchievementNotif({icon:'🎲',title:'YAMS !',description:player+' a réalisé un YAMS !'}); 
        setTimeout(()=>{setShowAchievementNotif(null);setConfetti(null);setShakeAnimation(null);},4000);
    } else if(value==='0') {
        setConfetti('sad'); 
        setTimeout(()=>setConfetti(null), 4000); 
    } else { 
        setConfetti(null); 
    }

    const newTotal=calcTotal(player, ns);
    if(newTotal>=300&&calcTotal(player)<300){setConfetti('gold');setShowAchievementNotif({icon:'🌟',title:'Score Légendaire !',description:player+' a dépassé les 300 points !'});setTimeout(()=>{setShowAchievementNotif(null);setConfetti(null);},5000);}
    
    setScores(ns);saveCurrentGame(ns);
    if(editMode){ } else { 
        if(value!==''){
            setLastPlayerToPlay(player);
            setLastModifiedCell(cellKey);
            if(chaosMode) { setActiveChaosCard(CHAOS_EVENTS[Math.floor(Math.random() * CHAOS_EVENTS.length)]); }
        } else {
            setLastPlayerToPlay(null);
            setLastModifiedCell(null);
        } 
    }
  };

  const saveYamsDetail = (val) => {
      if(!pendingYamsDetail) return;
      const { player } = pendingYamsDetail;
      const newScores = { ...scores };
      if(newScores[player]) {
          if(!newScores[player].yamsHistory) newScores[player].yamsHistory = [];
          newScores[player].yamsHistory.push(val);
      }
      setScores(newScores);
      saveCurrentGame(newScores);
      setPendingYamsDetail(null);
  };

  const toggleEditMode=()=>{if(!editMode){setScoresBeforeEdit(JSON.parse(JSON.stringify(scores)));setLastPlayerBeforeEdit(lastPlayerToPlay);setEditMode(true);}else{setEditMode(false);setScoresBeforeEdit(null);setLastPlayerBeforeEdit(null);}};
  const cancelEdit=()=>{if(scoresBeforeEdit!==null){setScores(scoresBeforeEdit);setLastPlayerToPlay(lastPlayerBeforeEdit);}setEditMode(false);setScoresBeforeEdit(null);setLastPlayerBeforeEdit(null);};
  const resetGame = (forcedLoserName = null) => { 
      if(!forcedLoserName && !window.confirm("Commencer une nouvelle partie ?")) return; 
      setScores({}); setLastPlayerToPlay(null); setLastModifiedCell(null); setShowEndGameModal(false); setMoveLog([]); setActiveChaosCard(null); setShowStudioModal(false);
      setSuddenDeathScores({}); setShowSuddenDeathModal(false); 
      const newJokers = {}; players.forEach(p => newJokers[p] = jokerMax); setJokers(newJokers); 
      if(forcedLoserName && players.includes(forcedLoserName)) { setStarterName(forcedLoserName); } 
      else { const currentStarterIdx = players.indexOf(starterName); const nextStarter = players[(currentStarterIdx + 1) % players.length]; setStarterName(nextStarter); }
      if(chaosMode) { setActiveChaosCard(CHAOS_EVENTS[Math.floor(Math.random() * CHAOS_EVENTS.length)]); }
      saveCurrentGame({});
  };

  const updateGameSeason = (id, newSeason) => {
     const updatedHistory = gameHistory.map(g => {
         if (g.id !== id) return g;
         const currentSeasons = Array.isArray(g.seasons) ? g.seasons : (g.season && g.season !== 'Aucune' ? [g.season] : []);
         let newSeasons;
         if (currentSeasons.includes(newSeason)) {
             newSeasons = currentSeasons.filter(s => s !== newSeason);
         } else {
             newSeasons = [...currentSeasons, newSeason];
         }
         return { ...g, seasons: newSeasons, season: null }; 
     });
     setGameHistory(updatedHistory);
     saveHistory(updatedHistory);
  };

  useEffect(()=>{
      if(isGameComplete() && !showEndGameModal && !showSuddenDeathModal){
          const winners = getWinner();
          if (winners.length > 1) {
              setShowSuddenDeathModal(true);
          } else {
              setShowVictoryAnimation(true);
              setConfetti('gold');
              setTimeout(()=>{setShowVictoryAnimation(false);setShowEndGameModal(true);setConfetti(null);},2000);
          }
      }
  },[scores,showEndGameModal, showSuddenDeathModal]);
  
  useEffect(() => { 
    if (showEndGameModal && !currentGage) {
        let pool = [];
        if (enableDefaultGages) pool = [...pool, ...DEFAULT_GAGES];
        if (customGages && customGages.length > 0) pool = [...pool, ...customGages.filter(g => g.active).map(g => g.text)];
        if (pool.length > 0) setCurrentGage(pool[Math.floor(Math.random() * pool.length)]); else setCurrentGage("Aucun gage sélectionné !");
    } else if (!showEndGameModal) { setCurrentGage(null); } 
  }, [showEndGameModal, customGages, enableDefaultGages]);

  const saveGameFromModal=()=>{ 
      const w=getWinner(suddenDeathScores); 
      const currentSeasons = activeSeason && activeSeason !== 'Aucune' ? [activeSeason] : [];
      const game={
          id:Date.now(),
          seasons:currentSeasons,
          date:new Date().toLocaleDateString('fr-FR'),
          time:new Date().toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}),
          players:players.map(p=>({
              name:p,
              score:calcTotal(p),
              isWinner:w.includes(p),
              yamsCount:scores[p]?.yams===50?1:0,
              tieBreaker: suddenDeathScores[p] 
          })), 
          grid: JSON.parse(JSON.stringify(scores)), 
          moveLog: JSON.parse(JSON.stringify(moveLog))
      }; 
      const nh=[game,...gameHistory]; setGameHistory(nh); saveHistory(nh); 
      setGlobalXP(prev => prev + 100);
      let loserName = null;
      if (players.length > 0) {
          const sortedPlayers = [...players].sort((a,b) => {
              const scoreA = calcTotal(a);
              const scoreB = calcTotal(b);
              if (scoreA !== scoreB) return scoreA - scoreB;
              return (suddenDeathScores[a]||0) - (suddenDeathScores[b]||0);
          });
          loserName = sortedPlayers[0];
      }
      resetGame(loserName); 
  };
  const deleteGame= id=>{const nh=gameHistory.filter(g=>g.id!==id);setGameHistory(nh);saveHistory(nh);};
  const exportData=()=>{const b=new Blob([JSON.stringify({gameHistory,exportDate:new Date().toISOString(),version:'1.0'},null,2)],{type:'application/json'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='yams-backup-'+new Date().toISOString().split('T')[0]+'.json';document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(u);};
  const importData=e=>{const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=ev=>{try{const d=JSON.parse(ev.target.result);if(d.gameHistory&&Array.isArray(d.gameHistory)){setGameHistory(d.gameHistory);saveHistory(d.gameHistory);alert('Parties importées avec succès!');}else alert('Fichier invalide');}catch(err){alert('Erreur lors de l\'import');}};reader.readAsText(file);};

  const filteredHistory = useMemo(() => {
      if(!gameHistory || !Array.isArray(gameHistory)) return [];
      if(!statsFilterSeason || statsFilterSeason === 'Toutes') return gameHistory;
      return gameHistory.filter(g => {
          const gSeasons = Array.isArray(g.seasons) ? g.seasons : (g.season ? [g.season] : []);
          if(statsFilterSeason === 'Aucune') return gSeasons.length === 0;
          return gSeasons.includes(statsFilterSeason);
      }); 
  }, [gameHistory, statsFilterSeason]);
  
  const filteredGameHistory = useMemo(() => {
      if(!gameHistory || !Array.isArray(gameHistory)) return [];
      if(!historyFilterSeason || historyFilterSeason === 'Toutes') return gameHistory;
      return gameHistory.filter(g => {
          const gSeasons = Array.isArray(g.seasons) ? g.seasons : (g.season ? [g.season] : []);
          if(historyFilterSeason === 'Aucune') return gSeasons.length === 0;
          return gSeasons.includes(historyFilterSeason);
      });
  }, [gameHistory, historyFilterSeason]);

  const playerStats = useMemo(() => { if (!filteredHistory || !Array.isArray(filteredHistory)) return []; 
      const stats = {}; const streaks = {}; const isStreaking = {}; const allPlayerNames = new Set(); 
      filteredHistory.forEach(g => g.players.forEach(p => allPlayerNames.add(p.name))); 
      allPlayerNames.forEach(name => { 
          stats[name] = { wins:0, games:0, maxScore:0, totalScore:0, yamsCount:0, maxConsecutiveWins:0, bonusCount:0, upperSum:0, lowerSum:0, historyGames:0,
          totalOnes:0, totalTwos:0, totalThrees:0, totalFours:0, totalFives:0, totalSixes:0, hiddenYamsCount:0 }; 
          streaks[name] = 0; isStreaking[name] = true; 
      }); 
      filteredHistory.forEach((game) => { 
          const participants = game.players || game.results || []; 
          const gameGrid = game.grid || {}; 
          participants.forEach(p => { 
              if(!stats[p.name]) return; 
              const s = stats[p.name]; 
              s.games++; 
              if(p.isWinner) s.wins++; 
              if(p.score > s.maxScore) s.maxScore = p.score; 
              s.totalScore += p.score; 
              s.yamsCount += p.yamsCount || 0; 
              if(gameGrid[p.name]) { 
                  s.historyGames++; 
                  let currentUpperSum = 0;
                  categories.filter(c => c.upper && c.max).forEach(cat => {
                      const val = gameGrid[p.name][cat.id];
                      if(val !== undefined && val !== "" && parseInt(val) === cat.max) {
                          s.hiddenYamsCount++;
                      }
                      if (val !== undefined && val !== "") { currentUpperSum += parseInt(val); }
                  });
                  if (currentUpperSum >= 63) { s.bonusCount++; }
                  const totals = getPlayerTotals(p.name, gameGrid); s.upperSum += totals.upper; s.lowerSum += totals.lower; 
                  s.totalOnes += parseInt(gameGrid[p.name]['ones']||0);
                  s.totalTwos += parseInt(gameGrid[p.name]['twos']||0);
                  s.totalThrees += parseInt(gameGrid[p.name]['threes']||0);
                  s.totalFours += parseInt(gameGrid[p.name]['fours']||0);
                  s.totalFives += parseInt(gameGrid[p.name]['fives']||0);
                  s.totalSixes += parseInt(gameGrid[p.name]['sixes']||0);
              } 
              if (isStreaking[p.name]) { if (p.isWinner) streaks[p.name]++; else isStreaking[p.name] = false; } 
          }); 
      }); 
      const tempStreaks = {}; allPlayerNames.forEach(n => tempStreaks[n] = 0); for(let i=filteredHistory.length-1; i>=0; i--){ const game = filteredHistory[i]; const participants = game.players || []; participants.forEach(p => { if(p.isWinner) { tempStreaks[p.name] = (tempStreaks[p.name] || 0) + 1; if(tempStreaks[p.name] > stats[p.name].maxConsecutiveWins) stats[p.name].maxConsecutiveWins = tempStreaks[p.name]; } else { tempStreaks[p.name] = 0; } }); } return Object.entries(stats).map(([name,d])=>({ name, ...d, avgScore: Math.round(d.totalScore/d.games), currentStreak: streaks[name], bonusRate: d.historyGames > 0 ? Math.round((d.bonusCount/d.historyGames)*100) : 0, avgUpper: d.historyGames > 0 ? Math.round(d.upperSum/d.historyGames) : 0, avgLower: d.historyGames > 0 ? Math.round(d.lowerSum/d.historyGames) : 0 })).sort((a,b)=>b.wins-a.wins); }, [filteredHistory]);
  
  const hallOfFame = useMemo(() => { if(filteredHistory.length < 2) return null; let biggestWin = { gap: -1 }; let tightestWin = { gap: 9999 }; let lowestWinner = { score: 9999 }; let highestLoser = { score: -1 }; filteredHistory.forEach(g => { const parts = (g.players || g.results).sort((a,b) => b.score - a.score); if(parts.length < 2) return; const winner = parts[0]; const second = parts[1]; const gap = winner.score - second.score; if(gap > biggestWin.gap) biggestWin = { gap, winner: winner.name, second: second.name, date: g.date }; if(gap < tightestWin.gap) tightestWin = { gap, winner: winner.name, second: second.name, date: g.date }; if(winner.score < lowestWinner.score) lowestWinner = { score: winner.score, name: winner.name, date: g.date }; if(second.score > highestLoser.score) highestLoser = { score: second.score, name: second.name, date: g.date }; }); return { biggestWin, tightestWin, lowestWinner, highestLoser }; }, [filteredHistory]);
  const getPieData = () => playerStats.filter(s=>s.wins>0).map(s=>({name:s.name,value:s.wins}));
  const isFoggy = (p) => fogMode && !isGameComplete() && getNextPlayer() !== p;
  const getLeader = () => { if(isGameComplete() || hideTotals || fogMode) return null; const totals = players.map(p => ({name: p, score: calcTotal(p)})); const max = Math.max(...totals.map(t => t.score)); if(max === 0) return null; const leaders = totals.filter(t => t.score === max); if (leaders.length > 1) return null; return leaders[0].name; };
  const getTensionColor = () => { if(players.length < 2) return 'bg-gray-800'; const totals = players.map(p => calcTotal(p)).sort((a,b)=>b-a); const diff = totals[0] - totals[1]; if(diff < 20) return 'bg-gradient-to-r from-red-600 via-red-500 to-red-600 animate-pulse'; if(diff < 50) return 'bg-gradient-to-r from-yellow-500 to-orange-500'; return 'bg-gradient-to-r from-blue-500 to-cyan-500'; };
  const quickEdit = () => { setShowEndGameModal(false); setEditMode(true); setScoresBeforeEdit(JSON.parse(JSON.stringify(scores))); setLastPlayerBeforeEdit(lastPlayerToPlay); };
  
  const getSafeReplayScore = (player, grid) => {
    if (!grid || !grid[player]) return 0;
    let upperSum = 0; let lowerSum = 0;
    categories.forEach(cat => {
        const val = grid[player][cat.id];
        const num = (val !== undefined && val !== "" && !isNaN(val)) ? parseInt(val) : 0;
        if (cat.upper && !cat.upperHeader && !cat.upperTotal && !cat.upperGrandTotal && !cat.upperDivider) { upperSum += num; }
        if (cat.lower && !cat.lowerTotal && !cat.divider) { lowerSum += num; }
    });
    const bonus = upperSum >= 63 ? 35 : 0;
    return upperSum + bonus + lowerSum;
  };
  
  const stopPlayback = () => { if (replayIntervalRef.current) clearInterval(replayIntervalRef.current); setIsReplaying(false); setReplayGame(null); };
  const playTimelapse = () => { if(!replayGame || !replayGame.moveLog) return; setIsReplaying(true); const log = replayGame.moveLog; const tempScores = {}; players.forEach(p => tempScores[p] = {}); let step = 0; replayIntervalRef.current = setInterval(() => { if(step >= log.length) { clearInterval(replayIntervalRef.current); setIsReplaying(false); return; } const move = log[step]; tempScores[move.player] = { ...tempScores[move.player], [categories.find(c=>c.name===move.category)?.id || move.category.toLowerCase()]: parseInt(move.value) }; setReplayGame(prev => ({...prev, grid: JSON.parse(JSON.stringify(tempScores))})); step++; }, 500); };

  if(replayGame) { const replayPlayers = Object.keys(replayGame.grid || {}); return ( <div className={'min-h-screen bg-gradient-to-br '+T.bg+' p-2 sm:p-4 md:p-6'}> <div className="max-w-7xl mx-auto space-y-4"> <div className={'bg-gradient-to-br '+T.card+' backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-6 flex justify-between items-center'}> <div className="flex items-center gap-4"> <button onClick={stopPlayback} className="p-2 bg-white/10 rounded-full hover:bg-white/20"><ArrowLeft /></button> <div><h2 className="text-xl font-bold text-white">Replay du {replayGame.date}</h2><p className="text-sm text-gray-400">Lecture seule</p></div> </div> {replayGame.moveLog && <button onClick={playTimelapse} disabled={isReplaying} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2">{isReplaying ? <Pause size={18}/> : <Play size={18}/>} Timelapse</button>} </div> <div className={'bg-gradient-to-br '+T.card+' backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-4 overflow-x-auto'}> <table className="w-full table-fixed"> <thead><tr className="border-b border-white/20"><th className="text-left p-3 text-white">Catégorie</th>{replayPlayers.map(p=><th key={p} className="p-3 text-center text-white">{p}</th>)}</tr></thead> <tbody>{categories.map(cat => {if(cat.upperHeader || cat.upperDivider || cat.divider) return null;if(cat.upperTotal || cat.bonus || cat.upperGrandTotal || cat.lowerTotal) return null;return (<tr key={cat.id} className="border-b border-white/10 hover:bg-white/5"><td className="p-3 text-gray-300 font-bold">{cat.name}</td>{replayPlayers.map(p => (<td key={p} className="p-2 text-center font-bold text-white">{(replayGame.grid && replayGame.grid[p] && replayGame.grid[p][cat.id] !== undefined) ? replayGame.grid[p][cat.id] : '-'}</td>))}</tr>);})}<tr className="bg-white/10 font-black"><td className="p-4 text-white">TOTAL</td>{replayPlayers.map(p=><td key={p} className="p-4 text-center text-white text-xl">{getSafeReplayScore(p, replayGame.grid)}</td>)}</tr></tbody> </table> </div> </div> </div> ); }

  const getRank = (playerName) => {
    const scoresList = players.map(p => ({ name: p, score: calcTotal(p) }));
    scoresList.sort((a, b) => b.score - a.score);
    const myScore = scoresList.find(s => s.name === playerName)?.score || 0;
    const rank = scoresList.filter(s => s.score > myScore).length + 1;
    return rank;
  };

  const calculateGlobalFailures = (target) => {
    const failures = {}; playableCats.forEach(cat => failures[cat.id] = 0); let totalGames = 0;
    const historyToUse = statsFilterSeason === 'Toutes' ? (gameHistory || []) : (gameHistory || []).filter(g => { const gSeasons = Array.isArray(g.seasons) ? g.seasons : (g.season ? [g.season] : []); if(statsFilterSeason === 'Aucune') return gSeasons.length === 0; return gSeasons.includes(statsFilterSeason); });
    if (!historyToUse || historyToUse.length === 0) return { failures: [], totalGames: 0 };
    historyToUse.forEach(game => { const participants = game.players || game.results || []; const grid = game.grid || {}; participants.forEach(p => { if (target === 'GLOBAL' || p.name === target) { const playerGrid = grid[p.name]; if (playerGrid) { totalGames++; Object.keys(failures).forEach(catId => { if (playerGrid[catId] === 0) failures[catId]++; }); } } }); });
    const sortedFailures = Object.entries(failures).sort(([,a], [,b]) => b - a).map(([key, value]) => ({ id: key, name: categories.find(c => c.id === key)?.name || key, count: value, rate: totalGames > 0 ? Math.round((value / totalGames) * 100) : 0 }));
    return { failures: sortedFailures, totalGames: Math.max(1, totalGames) };
  };

  return (
    <div onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEndHandler} className={'min-h-screen bg-gradient-to-br '+T.bg+' p-2 sm:p-4 md:p-6 transition-all duration-500 overflow-x-hidden'}>
      {/* MODAL YAMS DETAIL */}
      {pendingYamsDetail && (
        <div className="fixed inset-0 bg-black/90 z-[200] flex items-center justify-center p-4 modal-backdrop">
            <div className="modal-content bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-yellow-500/50 rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl shadow-yellow-500/20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
                <div className="text-5xl mb-3" style={{animation:'trophy-float 3s ease-in-out infinite'}}>🎲</div>
                <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-wide winner-glow">YAMS !</h3>
                <p className="text-gray-400 text-sm mb-6 font-medium">Quel chiffre as-tu obtenu ?</p>
                <div className="grid grid-cols-3 gap-3 mb-4">
                    {[1, 2, 3, 4, 5, 6].map(val => (
                        <button key={val} onClick={() => saveYamsDetail(val)} className="aspect-square bg-white/5 hover:bg-yellow-500/20 border border-white/10 hover:border-yellow-500/50 rounded-2xl flex items-center justify-center text-3xl transition-all duration-300 hover:scale-110 active:scale-95 group hover:shadow-lg hover:shadow-yellow-500/20">{['','⚀','⚁','⚂','⚃','⚄','⚅'][val]}</button>
                    ))}
                </div>
            </div>
        </div>
      )}

      {/* MODAL BONUS MISSED */}
      {showBonusMissedModal && (
          <div className="fixed inset-0 bg-black/90 z-[200] flex items-center justify-center p-4 modal-backdrop">
              <div className="modal-content bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-red-500/50 rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl shadow-red-500/20 relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
                   <div className="text-5xl mb-3 animate-bounce">😭</div>
                   <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-wide text-red-500">Oh non !</h3>
                   <div className="text-white text-lg font-bold mb-4">{showBonusMissedModal.player} a raté le bonus...</div>
                   <div className="bg-red-500/20 border border-red-500/30 p-4 rounded-2xl mb-4">
                       <div className="text-gray-400 text-xs uppercase font-bold">Total Partie Supérieure</div>
                       <div className="text-4xl font-black text-white">{showBonusMissedModal.score} <span className="text-sm text-gray-500">/ 63</span></div>
                   </div>
                   <button onClick={() => setShowBonusMissedModal(null)} className="bg-white/10 hover:bg-white/20 text-white w-full py-3 rounded-xl font-bold">Tant pis...</button>
              </div>
          </div>
      )}

      {/* MODAL BONUS WON */}
      {showBonusWonModal && (
          <div className="fixed inset-0 bg-black/90 z-[200] flex items-center justify-center p-4 modal-backdrop">
              <div className="modal-content bg-gradient-to-br from-green-600 to-green-900 rounded-[40px] p-1 shadow-[0_0_60px_rgba(34,197,94,0.4)] relative overflow-hidden">
                   <div className="bg-slate-950 rounded-[38px] overflow-hidden p-8 text-center relative">
                       <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-green-500/20 to-transparent"></div>
                       <div className="text-6xl mb-4 relative z-10" style={{animation:'trophy-float 3s ease-in-out infinite'}}>🎁</div>
                       <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-wide text-green-400 relative z-10">Félicitations !</h3>
                       <div className="text-white text-lg font-bold mb-4 relative z-10">{showBonusWonModal.player} débloque le bonus !</div>
                       <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-2xl mb-4 relative z-10">
                           <div className="text-gray-400 text-xs uppercase font-bold">Total Partie Supérieure</div>
                           <div className="text-4xl font-black text-white">{showBonusWonModal.score} <span className="text-sm text-gray-500">/ 63</span></div>
                           <div className="mt-2 text-green-400 font-bold text-xl">+35 POINTS</div>
                       </div>
                       <button onClick={() => setShowBonusWonModal(null)} className="bg-green-600 hover:bg-green-500 text-white w-full py-3 rounded-xl font-bold relative z-10">Génial !</button>
                   </div>
              </div>
          </div>
      )}

      {/* MODAL SUDDEN DEATH */}
      {showSuddenDeathModal && (
          <div className="fixed inset-0 bg-black/95 z-[210] flex items-center justify-center p-4 modal-backdrop">
              <div className="modal-content bg-gradient-to-b from-gray-900 to-black border-4 border-red-600 rounded-3xl p-6 w-full max-w-sm text-center shadow-[0_0_50px_rgba(220,38,38,0.5)] relative overflow-hidden">
                  <div className="text-6xl mb-4 animate-pulse">☠️</div>
                  <h2 className="text-3xl font-black text-red-500 uppercase tracking-widest mb-2">MORT SUBITE</h2>
                  <p className="text-gray-300 text-sm mb-6">Égalité parfaite ! Lancez les dés et faites le plus gros score possible.</p>
                  
                  <div className="space-y-4 mb-6">
                      {getWinner().map(p => (
                          <div key={p} className="bg-white/10 p-4 rounded-2xl border border-white/10">
                              <div className="text-white font-bold text-lg mb-2">{p}</div>
                              <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-400">Total Dés :</span>
                                  <select 
                                      className="flex-1 bg-black text-white p-2 rounded-lg font-bold border border-white/20 outline-none text-center"
                                      value={suddenDeathScores[p] || ''}
                                      onChange={(e) => setSuddenDeathScores({...suddenDeathScores, [p]: parseInt(e.target.value)})}
                                  >
                                      <option value="">-</option>
                                      {Array.from({length:30}, (_,i) => i+1).reverse().map(n => (
                                          <option key={n} value={n}>{n}</option>
                                      ))}
                                  </select>
                              </div>
                          </div>
                      ))}
                  </div>
                  
                  <button 
                      onClick={() => {
                          const tiedPlayers = getWinner();
                          if(tiedPlayers.every(p => suddenDeathScores[p] !== undefined)) {
                              const sdScores = tiedPlayers.map(p => suddenDeathScores[p]);
                              const maxSd = Math.max(...sdScores);
                              const stillTied = sdScores.filter(s => s === maxSd).length > 1;
                              
                              if(stillTied) {
                                  alert("Encore égalité ! Relancez !");
                                  setSuddenDeathScores({});
                              } else {
                                  setShowSuddenDeathModal(false);
                                  setShowVictoryAnimation(true);
                                  setConfetti('gold');
                                  setTimeout(()=>{setShowVictoryAnimation(false);setShowEndGameModal(true);setConfetti(null);},2000);
                              }
                          } else {
                              alert("Entrez tous les scores !");
                          }
                      }}
                      className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl shadow-lg shadow-red-600/30 transition-all uppercase tracking-widest"
                  >
                      Valider le Duel
                  </button>
              </div>
          </div>
      )}

      {floatingScores.map(fs => <FloatingScore key={fs.id} x={fs.x} y={fs.y} value={fs.value} />)}
      {confetti&&confetti!=='sad'&&<div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">{[...Array(60)].map((_,i)=><div key={i} className="confetti-piece" style={{left:Math.random()*100+'%',top:'-30px',fontSize:(18+Math.random()*16)+'px',animation:`confetti-fall ${2.5+Math.random()*3}s linear ${Math.random()*2.5}s both`}}>{confetti==='gold'?['🎉','🎊','⭐','✨','🎯','🏆','👑','🥇'][Math.floor(Math.random()*8)]:confetti==='bonus'?['🎁','💰','✨','⭐','💎','🎊'][Math.floor(Math.random()*6)]:['💸','💵','💰','🤑'][Math.floor(Math.random()*4)]}</div>)}</div>}
      {confetti==='sad'&&<div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"><div className="text-9xl" style={{animation:'sad-pulse 1.5s ease-in-out infinite'}}>❌</div></div>}
      <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@700&display=swap');
  * { font-family: 'Outfit', sans-serif; }
  @keyframes fall{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(110vh) rotate(720deg);opacity:0}}
  @keyframes shake{0%,100%{transform:translateX(0)}10%,30%,50%,70%,90%{transform:translateX(-8px)}20%,40%,60%,80%{transform:translateX(8px)}}
  .shake-animation{animation:shake 0.5s ease-in-out;}
  @keyframes notif-enter{0%{transform:translateX(120%) scale(0.8);opacity:0}60%{transform:translateX(-8px) scale(1.02)}100%{transform:translateX(0) scale(1);opacity:1}}
  .slide-in-right{animation:notif-enter 0.6s cubic-bezier(0.34,1.56,0.64,1);}
  @keyframes tab-slide{from{transform:translateY(10px);opacity:0}to{transform:translateY(0);opacity:1}}
  .tab-enter{animation:tab-slide 0.35s ease-out;}
  @keyframes floatUp{0%{transform:translateY(0) scale(1);opacity:1}100%{transform:translateY(-80px) scale(1.5);opacity:0}}
  @keyframes bounce-in{0%{transform:scale(0)}40%{transform:scale(1.15)}70%{transform:scale(0.95)}100%{transform:scale(1)}}
  @keyframes modal-backdrop{from{backdrop-filter:blur(0px);opacity:0}to{backdrop-filter:blur(16px);opacity:1}}
  @keyframes modal-content{0%{transform:scale(0.7) translateY(40px);opacity:0}100%{transform:scale(1) translateY(0);opacity:1}}
  .modal-backdrop{animation:modal-backdrop 0.3s ease-out forwards;}
  .modal-content{animation:modal-content 0.45s cubic-bezier(0.34,1.56,0.64,1);}
  @keyframes trophy-float{0%,100%{transform:translateY(0) rotateY(0deg)}25%{transform:translateY(-15px) rotateY(90deg)}50%{transform:translateY(0) rotateY(180deg)}75%{transform:translateY(-10px) rotateY(270deg)}}
  @keyframes winner-glow{0%,100%{text-shadow:0 0 20px rgba(250,204,21,0.5)}50%{text-shadow:0 0 40px rgba(250,204,21,0.8),0 0 80px rgba(250,204,21,0.3)}}
  .winner-glow{animation:winner-glow 2s ease-in-out infinite;}
  @keyframes dice-roll{0%{transform:rotate(0deg) scale(1)}25%{transform:rotate(90deg) scale(0.8)}50%{transform:rotate(180deg) scale(1.1)}75%{transform:rotate(270deg) scale(0.9)}100%{transform:rotate(360deg) scale(1)}}
  @keyframes ring-pulse{0%{box-shadow:0 0 0 0 rgba(74,222,128,0.6)}100%{box-shadow:0 0 0 14px rgba(74,222,128,0)}}
  .ring-pulse{animation:ring-pulse 1.5s infinite;}
  @keyframes glow{0%,100%{box-shadow:0 0 20px rgba(255,215,0,0.3)}50%{box-shadow:0 0 40px rgba(255,215,0,0.6),0 0 80px rgba(255,215,0,0.2)}}
  .glow-anim{animation:glow 2s ease-in-out infinite;}
  @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  .float-anim{animation:float 3s ease-in-out infinite;}
  @keyframes fade-in-scale{from{transform:scale(0.92);opacity:0}to{transform:scale(1);opacity:1}}
  @keyframes chaos-gradient{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
  .chaos-bg{background-size:400% 400%;animation:chaos-gradient 3s ease infinite;}
  @keyframes badge-unlock{0%{transform:scale(0) rotate(-180deg)}60%{transform:scale(1.2) rotate(10deg)}100%{transform:scale(1) rotate(0deg)}}
  @keyframes victory-text{0%{transform:scale(0) rotate(-10deg);opacity:0}50%{transform:scale(1.1) rotate(2deg)}100%{transform:scale(1) rotate(0deg);opacity:1}}
  @keyframes gradient-x{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
  .gradient-animate{background-size:200% 200%;animation:gradient-x 3s ease infinite;}
  @keyframes confetti-fall{0%{transform:translateY(-10vh) rotate(0deg);opacity:1}100%{transform:translateY(110vh) rotate(1080deg);opacity:0}}
  @keyframes sad-pulse{0%,100%{transform:scale(1);opacity:0.5}50%{transform:scale(1.2);opacity:0.8}}
  .glass{background:rgba(255,255,255,0.03);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.08)}
  .glass-strong{background:rgba(255,255,255,0.06);backdrop-filter:blur(30px);border:1px solid rgba(255,255,255,0.12)}
  ::-webkit-scrollbar{width:6px;height:6px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.15);border-radius:10px}::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,0.25)}
  select{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23999' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:30px}
  .confetti-piece{position:fixed;z-index:9999;pointer-events:none}
`}</style>
      {showAchievementNotif&&<div className="fixed top-20 right-4 z-50 slide-in-right"><div className={'relative overflow-hidden px-6 py-5 rounded-2xl shadow-2xl backdrop-blur-xl border-2 max-w-sm '+(shakeAnimation?'shake-animation ':'')+(showAchievementNotif.icon==='🎲'?'bg-gradient-to-r from-yellow-600 to-orange-600 border-yellow-400':showAchievementNotif.icon==='🎁'?'bg-gradient-to-r from-green-600 to-emerald-600 border-green-400':'bg-gradient-to-r from-purple-600 to-pink-600 border-purple-400')}><div className="absolute inset-0" style={{animation:'shimmer 2s infinite',backgroundSize:'200% 100%',backgroundImage:'linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)'}}></div><div className="flex items-center gap-4 relative z-10"><span className="text-5xl" style={{animation:'bounce-in 0.5s cubic-bezier(0.34,1.56,0.64,1)'}}>{showAchievementNotif.icon}</span><div className="text-white"><div className="text-xs font-bold uppercase tracking-widest opacity-80">🎉 {showAchievementNotif.icon==='🎲'?'Exploit !':showAchievementNotif.icon==='🎁'?'Succès !':'Incroyable !'}</div><div className="font-black text-xl">{showAchievementNotif.title}</div><div className="text-sm opacity-90">{showAchievementNotif.description}</div></div></div></div></div>}
      {showVictoryAnimation&&<div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop bg-black/80"><div className="text-center"><div className="text-9xl mb-8" style={{animation:'trophy-float 2s ease-in-out infinite'}}>🏆</div><div className="text-6xl font-black text-white mb-4" style={{animation:'victory-text 0.8s cubic-bezier(0.34,1.56,0.64,1)'}}>PARTIE TERMINÉE !</div><div className="text-3xl font-bold winner-glow" style={{color:T.primary,animation:'fade-in-scale 0.6s ease-out 0.4s backwards'}}>{getWinner(suddenDeathScores).join(' & ')}</div></div></div>}
      {showTurnWarning&&<div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50" style={{animation:'bounce-in 0.4s cubic-bezier(0.34,1.56,0.64,1)'}}><div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-2xl shadow-2xl shadow-red-500/30 backdrop-blur-xl border border-white/20 flex items-center gap-3"><span className="text-2xl" style={{animation:'shake 0.5s ease-in-out infinite'}}>🚫</span><span className="font-semibold">{showTurnWarning}</span></div></div>}

      {showStudioModal && (
          <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[120] p-4 modal-backdrop">
              <div className="modal-content bg-gradient-to-b from-gray-900 to-black p-8 rounded-3xl text-center max-w-sm w-full border-4 border-white/10 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 gradient-animate" style={{backgroundSize:'200% 200%'}}></div>
                  <div className="flex justify-center mb-4"><div className="p-4 bg-white/5 rounded-full border border-white/10"><Crown size={48} className="text-yellow-400"/></div></div>
                  <h2 className="text-3xl font-black text-white mb-1 uppercase tracking-widest">Vainqueur</h2>
                  <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-6">{getWinner(suddenDeathScores)[0] || "..."}</div>
                  
                  <div className="space-y-3 mb-8">
                    {players.map(p => (
                        <div key={p} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                            <span className="font-bold text-gray-300">{p}</span>
                            <span className="font-black text-white text-xl">{calcTotal(p)} pts</span>
                        </div>
                    ))}
                  </div>
                  <button onClick={()=>setShowStudioModal(false)} className="bg-white text-black w-full py-4 rounded-xl font-black hover:scale-105 transition-transform">FERMER LE STUDIO</button>
              </div>
          </div>
      )}

      {showAvatarModal && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] p-4 modal-backdrop">
              <div className={'modal-content bg-gradient-to-br '+T.card+' border border-white/10 rounded-3xl p-6 max-w-md w-full relative'}>
                  <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-black text-white">Choisir un Avatar</h3><button onClick={()=>setShowAvatarModal(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X/></button></div>
                  <div className="grid grid-cols-4 gap-3">
                      {AVATAR_LIST.map((av, i) => {
                          const player = players[avatarSelectorIndex];
                          const stats = playerStats.find(s => s.name === player);
                          const locked = isAvatarLocked(av.req, stats);
                          return (
                              <button key={i} onClick={() => !locked && selectAvatar(av.icon)} disabled={locked} className={`relative aspect-square rounded-2xl flex items-center justify-center text-3xl transition-all duration-300 ${locked ? 'bg-white/5 opacity-50 cursor-not-allowed' : 'bg-white/10 hover:bg-white/20 hover:scale-110 cursor-pointer hover:shadow-lg'}`} style={{animation:`bounce-in 0.3s cubic-bezier(0.34,1.56,0.64,1) ${i*0.03}s backwards`}}>
                                  {av.icon}
                                  {locked && <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center"><Lock size={16} className="text-white"/></div>}
                              </button>
                          );
                      })}
                  </div>
                  <div className="mt-4 text-xs text-gray-400 text-center">Jouez pour débloquer de nouveaux avatars !</div>
              </div>
          </div>
      )}

      {undoData && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[100]" style={{animation:'bounce-in 0.5s cubic-bezier(0.34,1.56,0.64,1)'}}>
            <button onClick={handleUndo} className="bg-white text-red-500 px-6 py-3 rounded-full font-black shadow-2xl shadow-red-500/30 border-4 border-red-500 flex items-center gap-2 hover:scale-105 transition-all duration-200 active:scale-95">
                <Undo2 size={24} strokeWidth={3} /> OUPS ! ANNULER
            </button>
        </div>
      )}

      {showEndGameModal&&(
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 modal-backdrop">
          <div className="modal-content w-full max-w-sm">
            <div className="bg-gradient-to-b from-yellow-600 to-yellow-900 rounded-[40px] p-1 shadow-[0_0_60px_rgba(234,179,8,0.4)] glow-anim">
              <div className="bg-slate-900 rounded-[38px] overflow-hidden p-8 text-center relative">
                  <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-yellow-400/20 to-transparent"></div>
                  <div className="absolute -top-10 -left-10 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl"></div>
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl"></div>
                  <div className="relative z-10" style={{animation:'trophy-float 3s ease-in-out infinite'}}><Trophy className="mx-auto text-yellow-400 mb-4 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]" size={64}/></div>
                  <h2 className="text-sm font-black tracking-widest text-yellow-500 mb-2 relative z-10" style={{animation:'fade-in-scale 0.5s ease-out 0.2s backwards'}}>THE WINNER IS</h2>
                  <div className="text-4xl font-black uppercase mb-6 relative z-10 text-white winner-glow" style={{animation:'victory-text 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.3s backwards'}}>{getWinner(suddenDeathScores)[0]}</div>
                  <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
                      <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-sm border border-white/5 hover:bg-white/15 transition-all" style={{animation:'fade-in-scale 0.4s ease-out 0.4s backwards'}}>
                          <div className="text-2xl font-black text-white" style={{fontFamily:'JetBrains Mono, monospace'}}>{calcTotal(getWinner(suddenDeathScores)[0])}</div>
                          {suddenDeathScores[getWinner(suddenDeathScores)[0]] && <div className="text-xs text-yellow-400 font-bold">Mort Subite: {suddenDeathScores[getWinner(suddenDeathScores)[0]]}</div>}
                          <div className="text-[10px] opacity-100 uppercase text-yellow-100 font-bold">Points</div>
                      </div>
                      <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-sm border border-white/5 hover:bg-white/15 transition-all" style={{animation:'fade-in-scale 0.4s ease-out 0.5s backwards'}}><div className="text-2xl font-black text-white">{scores[getWinner(suddenDeathScores)[0]]?.yams ? "1" : "0"}</div><div className="text-[10px] opacity-100 uppercase text-yellow-100 font-bold">Yams</div></div>
                  </div>
                  {players.length > 1 && getLoser() && (<div className="bg-red-500/20 p-4 rounded-2xl mb-4 relative z-10 border border-red-500/20" style={{animation:'fade-in-scale 0.4s ease-out 0.6s backwards'}}><p className="text-[10px] uppercase font-bold text-red-300 tracking-wider">⚡ Gage pour {getLoser().name}</p><p className="text-sm italic text-white font-bold mt-1">"{currentGage}"</p></div>)}
                  <div className="space-y-2 relative z-10" style={{animation:'fade-in-scale 0.4s ease-out 0.7s backwards'}}>
                      <button onClick={saveGameFromModal} className="w-full py-4 bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-black rounded-2xl shadow-xl hover:scale-[1.03] transition-all duration-200 hover:shadow-yellow-500/40 hover:shadow-2xl active:scale-[0.98]">✨ ENREGISTRER</button>
                      <div className="grid grid-cols-2 gap-2">
                          <button onClick={quickEdit} className="py-4 bg-white/20 text-white font-bold rounded-2xl hover:bg-white/30 flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"><Edit3 size={16}/> MODIFIER</button>
                          <button onClick={()=>setShowEndGameModal(false)} className="py-4 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">FERMER</button>
                      </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-4">
        {/* HEADER + TABS */}
        <div className={'bg-gradient-to-br '+T.card+' backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl '+T.glow+' p-4 sm:p-6'}>
          {isGameStarted() && !isGameComplete() && !hideTotals && !fogMode && <div className={`h-1 w-full rounded-t-3xl ${getTensionColor()}`}></div>}
          <div className="flex items-center justify-between flex-wrap gap-4 mb-4 mt-2">
            <div className="flex items-center gap-4"><div className="text-5xl float-anim">🎲</div><div><h1 className="text-3xl sm:text-4xl font-black text-white bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent" style={{letterSpacing:'-0.02em'}}>YAMS</h1>
            <p className="text-sm text-gray-400 font-medium tracking-wider">Score keeper premium</p>
            </div></div>
            <div className="flex gap-2">
                <button onClick={()=>setShowLog(!showLog)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"><ScrollText size={22} className="text-white"/></button>
                <button onClick={()=>setShowSettings(!showSettings)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all backdrop-blur-sm border border-white/10 group"><Settings size={22} className="text-white group-hover:rotate-90 transition-transform duration-300"/></button>
            </div>
          </div>
          
          {showSettings&&<div className="mt-6 pt-6 border-t border-white/10"><h3 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-2"><Palette size={14}/> Thème</h3><div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{Object.keys(THEMES_CONFIG).map(k=>{const td=THEMES_CONFIG[k];return <button key={k} onClick={()=>setTheme(k)} className={'relative overflow-hidden px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 '+(theme===k?'ring-2 ring-white scale-105':'hover:scale-105')} style={{background:'linear-gradient(135deg,'+td.primary+','+td.secondary+')',color:'#fff'}}>{theme===k? <Check size={16}/> : td.icon}<span>{td.name}</span></button>;})}</div>
              <div className="mt-6"><h3 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-2"><Dices size={14}/> Skin de Dés</h3><div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{Object.keys(DICE_SKINS).map(k=>{const s=DICE_SKINS[k];return <button key={k} onClick={()=>setDiceSkin(k)} className={`px-4 py-3 rounded-xl font-bold transition-all border-2 ${diceSkin===k?'border-white bg-white/20 text-white':'border-transparent bg-white/5 text-gray-400 hover:bg-white/10'}`}>{s.name}</button>;})}</div></div>
              <div className="mt-6"><h3 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-2"><Settings size={14}/> Options de jeu</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400"><Sun size={20}/></div><div><div className="text-white font-bold">Anti-Veille</div><div className="text-gray-400 text-xs">Écran toujours allumé</div></div></div><button onClick={()=>setWakeLockEnabled(!wakeLockEnabled)} className={'relative w-12 h-6 rounded-full transition-all '+(wakeLockEnabled?'bg-blue-500':'bg-gray-600')}><div className={'absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all '+(wakeLockEnabled?'translate-x-6':'')}></div></button></div>
              <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400"><EyeOff size={20}/></div><div><div className="text-white font-bold">Brouillard de Guerre</div><div className="text-gray-400 text-xs">Scores adverses cachés</div></div></div><button onClick={()=>setFogMode(!fogMode)} className={'relative w-12 h-6 rounded-full transition-all '+(fogMode?'bg-purple-500':'bg-gray-600')}><div className={'absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all '+(fogMode?'translate-x-6':'')}></div></button></div>
              <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400"><Timer size={20}/></div><div><div className="text-white font-bold">Speed Run</div><div className="text-gray-400 text-xs">Chrono 30s par tour</div></div></div><button onClick={()=>setSpeedMode(!speedMode)} className={'relative w-12 h-6 rounded-full transition-all '+(speedMode?'bg-red-500':'bg-gray-600')}><div className={'absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all '+(speedMode?'translate-x-6':'')}></div></button></div>
              <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400"><Eye size={20}/></div><div><div className="text-white font-bold">Masquer les totaux</div><div className="text-gray-400 text-xs">Suspense garanti</div></div></div><button onClick={()=>setHideTotals(!hideTotals)} className={'relative w-12 h-6 rounded-full transition-all '+(hideTotals?'bg-green-500':'bg-gray-600')}><div className={'absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all '+(hideTotals?'translate-x-6':'')}></div></button></div>
              <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400"><Lock size={20}/></div><div><div className="text-white font-bold">Ordre Imposé</div><div className="text-gray-400 text-xs">Haut vers le bas obligatoire</div></div></div><button onClick={()=>setImposedOrder(!imposedOrder)} className={'relative w-12 h-6 rounded-full transition-all '+(imposedOrder?'bg-blue-500':'bg-gray-600')}><div className={'absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all '+(imposedOrder?'translate-x-6':'')}></div></button></div>
              <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400"><Flame size={20}/></div><div><div className="text-white font-bold">Mode Chaos</div><div className="text-gray-400 text-xs">Événements aléatoires</div></div></div><button onClick={()=>setChaosMode(!chaosMode)} className={'relative w-12 h-6 rounded-full transition-all '+(chaosMode?'bg-pink-500':'bg-gray-600')}><div className={'absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all '+(chaosMode?'translate-x-6':'')}></div></button></div>
              <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all col-span-1 md:col-span-2"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center text-yellow-400"><Wand2 size={20}/></div><div><div className="text-white font-bold">Activer Jokers</div><div className="text-gray-400 text-xs">Malus -10 pts / usage</div></div></div><div className="flex items-center gap-4"><button onClick={()=>setJokersEnabled(!jokersEnabled)} className={'relative w-12 h-6 rounded-full transition-all mr-4 '+(jokersEnabled?'bg-yellow-500':'bg-gray-600')}><div className={'absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all '+(jokersEnabled?'translate-x-6':'')}></div></button>{jokersEnabled && <div className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-xl"><span className="text-xs text-gray-400 font-bold uppercase">Qté:</span><select value={jokerMax} onChange={e=>setJokerMax(parseInt(e.target.value))} disabled={isGameStarted()} className={`bg-transparent text-white font-bold text-center outline-none cursor-pointer ${isGameStarted()?'opacity-50 cursor-not-allowed':''}`}><option value="1" className="bg-slate-800">1</option><option value="2" className="bg-slate-800">2</option><option value="3" className="bg-slate-800">3</option><option value="4" className="bg-slate-800">4</option><option value="5" className="bg-slate-800">5</option></select></div>}</div></div>
              
              <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all col-span-1 md:col-span-2 flex-wrap gap-2">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400"><Calendar size={20}/></div>
                   <div>
                       <div className="text-white font-bold">Gérer les Saisons</div>
                       <div className="text-gray-400 text-xs">Saison active: <span className="text-cyan-400 font-bold">{activeSeason}</span></div>
                   </div>
                 </div>
                 <div className="flex flex-col gap-2 w-full sm:w-auto">
                    <div className="flex gap-2">
                        {renamingSeason ? (
                            <div className="flex gap-2 items-center">
                                <input type="text" value={tempSeasonName} onChange={e=>setTempSeasonName(e.target.value)} className="bg-black/40 text-white px-2 py-1 rounded-lg text-sm border border-cyan-500/50" autoFocus />
                                <button onClick={() => { if(tempSeasonName && !seasons.includes(tempSeasonName)) { const newSeasons = seasons.map(s => s === activeSeason ? tempSeasonName : s); setSeasons(newSeasons); setActiveSeason(tempSeasonName); setRenamingSeason(null); }}} className="p-1 bg-green-500/20 text-green-400 rounded"><Check size={14}/></button>
                                <button onClick={()=>setRenamingSeason(null)} className="p-1 bg-red-500/20 text-red-400 rounded"><X size={14}/></button>
                            </div>
                        ) : (
                            <select value={activeSeason} onChange={e=>setActiveSeason(e.target.value)} className="bg-black/30 text-white px-3 py-2 rounded-xl text-sm font-bold border border-white/10 outline-none w-full sm:w-40">
                                <option value="Aucune">Aucune (Hors Saison)</option>
                                {seasons.map(s=><option key={s} value={s}>{s}</option>)}
                            </select>
                        )}
                        {activeSeason !== 'Aucune' && !renamingSeason && (
                            <>
                                <button onClick={()=>{setTempSeasonName(activeSeason); setRenamingSeason(true);}} className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl"><Edit3 size={16}/></button>
                                <button onClick={()=>{ if(window.confirm(`Supprimer la saison "${activeSeason}" ?`)) { setSeasons(seasons.filter(s=>s!==activeSeason)); setActiveSeason('Aucune'); }}} className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl"><Trash2 size={16}/></button>
                            </>
                        )}
                    </div>
                    {activeSeason !== 'Aucune' && (
                        <div className="flex gap-2 items-center w-full">
                            <PenLine size={14} className="text-gray-500"/>
                            <input type="text" placeholder="Ajouter une description..." value={seasonDescriptions[activeSeason] || ''} onChange={e => updateSeasonDescription(activeSeason, e.target.value)} className="bg-transparent text-gray-300 text-xs outline-none border-b border-white/10 focus:border-cyan-400 w-full"/>
                        </div>
                    )}
                    <div className="flex gap-2 mt-1">
                         <input type="text" placeholder="Nouvelle saison..." value={newSeasonName} onChange={e=>setNewSeasonName(e.target.value)} className="flex-1 bg-black/20 text-white px-3 py-2 rounded-xl text-xs outline-none border border-white/10 focus:border-white/30"/>
                         <button onClick={() => { if(newSeasonName && !seasons.includes(newSeasonName)) { setSeasons([...seasons, newSeasonName]); setActiveSeason(newSeasonName); setNewSeasonName(''); }}} className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 p-2 rounded-xl"><Plus size={16}/></button>
                    </div>
                 </div>
              </div>
              
              </div></div></div>}
          
          <div className="flex gap-2 mt-4 flex-wrap">
            <button onClick={()=>setCurrentTab('game')} className={'flex-1 min-w-[80px] py-3 rounded-xl font-bold transition-all '+(currentTab==='game'?'text-white shadow-xl '+T.glow:'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10')} style={currentTab==='game'?{background:'linear-gradient(135deg,'+T.primary+','+T.secondary+')'}:{}}>🎮 Partie</button>
            <button onClick={()=>setCurrentTab('rules')} className={'flex-1 min-w-[80px] py-3 rounded-xl font-bold transition-all '+(currentTab==='rules'?'text-white shadow-xl '+T.glow:'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10')} style={currentTab==='rules'?{background:'linear-gradient(135deg,'+T.primary+','+T.secondary+')'}:{}}>🎲 Règles & Aide</button>
            <button onClick={()=>setCurrentTab('trophies')} className={'flex-1 min-w-[80px] py-3 rounded-xl font-bold transition-all '+(currentTab==='trophies'?'text-white shadow-xl '+T.glow:'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10')} style={currentTab==='trophies'?{background:'linear-gradient(135deg,'+T.primary+','+T.secondary+')'}:{}}>🏆 Carrière</button>
            <button onClick={()=>setCurrentTab('history')} className={'flex-1 min-w-[80px] py-3 rounded-xl font-bold transition-all '+(currentTab==='history'?'text-white shadow-xl '+T.glow:'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10')} style={currentTab==='history'?{background:'linear-gradient(135deg,'+T.primary+','+T.secondary+')'}:{}}>📜 Historique</button>
            <button onClick={()=>setCurrentTab('stats')} className={'flex-1 min-w-[80px] py-3 rounded-xl font-bold transition-all '+(currentTab==='stats'?'text-white shadow-xl '+T.glow:'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10')} style={currentTab==='stats'?{background:'linear-gradient(135deg,'+T.primary+','+T.secondary+')'}:{}}>📊 Stats</button>
            <button onClick={()=>setCurrentTab('gages')} className={'flex-1 min-w-[80px] py-3 rounded-xl font-bold transition-all '+(currentTab==='gages'?'text-white shadow-xl '+T.glow:'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10')} style={currentTab==='gages'?{background:'linear-gradient(135deg,'+T.primary+','+T.secondary+')'}:{}}>😈 Gages</button>
          </div>
        </div>

        {/* LOG JOURNAL */}
        {showLog && (
            <div className={`bg-black/80 backdrop-blur-xl p-6 rounded-3xl border border-white/20 animate-in slide-in-from-top-4`}>
                <h2 className="font-black text-white mb-4 flex items-center gap-2 underline">📓 Journal de bord</h2>
                <div className="max-h-60 overflow-y-auto space-y-2">
                    {moveLog.map((m,i) => (
                        <div key={i} className="text-sm flex justify-between bg-white/20 p-3 rounded-xl border border-white/10 items-center">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-white text-lg">{m.player}</span>
                                <span className="text-gray-300 text-xs">➔</span>
                                <span className="text-yellow-400 font-bold">{m.category}</span>
                            </div>
                            <span className="font-black text-green-400 text-xl">+{m.value} pts</span>
                        </div>
                    ))}
                    {moveLog.length === 0 && <p className="opacity-60 text-white italic text-center py-4">Aucune action enregistrée...</p>}
                </div>
            </div>
        )}

        {/* TAB: HISTORY */}
        {currentTab==='history'&&(
          <div className="space-y-4 tab-enter"><div className={'bg-gradient-to-br '+T.card+' backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl '+T.glow+' p-6'}>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4"><h2 className="text-3xl font-black text-white flex items-center gap-3"><span className="text-4xl">📜</span>Historique</h2>
            
            {/* NOUVEAU FILTRE SAISONS */}
            <select value={historyFilterSeason} onChange={e=>setHistoryFilterSeason(e.target.value)} className="bg-black/30 text-white p-2 rounded-xl text-sm font-bold border border-white/10 outline-none">
                <option value="Toutes">Toutes les Saisons</option>
                <option value="Aucune">Hors Saison</option>
                {seasons.map(s=><option key={s} value={s}>{s}</option>)}
            </select>

            <div className="flex gap-2"><button onClick={exportData} className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-bold transition-all hover:scale-105 flex items-center gap-2"><Download size={18}/>Exporter</button><label className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-bold transition-all hover:scale-105 flex items-center gap-2 cursor-pointer"><Plus size={18}/>Importer<input type="file" accept=".json" onChange={importData} className="hidden"/></label></div></div>
            {gameHistory.length>0&&<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"><div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-400/30 rounded-2xl p-5 text-center"><div className="text-4xl mb-2">🎮</div><div className="text-blue-300 text-xs font-bold uppercase">Total Parties</div><div className="text-4xl font-black text-white">{filteredGameHistory.length}</div></div><div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-2xl p-5 text-center"><div className="text-4xl mb-2">📅</div><div className="text-purple-300 text-xs font-bold uppercase">Première Partie</div><div className="text-lg font-black text-white">{filteredGameHistory[filteredGameHistory.length-1]?.date || '-'}</div></div><div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-2xl p-5 text-center"><div className="text-4xl mb-2">⏱️</div><div className="text-green-300 text-xs font-bold uppercase">Dernière Partie</div><div className="text-lg font-black text-white">{filteredGameHistory[0]?.date || '-'}</div></div></div>}
            {filteredGameHistory.length===0?<div className="text-center py-20"><div className="text-8xl mb-6 opacity-20">📋</div><p className="text-gray-500 text-lg">Aucune partie enregistrée pour cette sélection</p></div>:<div className="space-y-3">{filteredGameHistory.map(g=><div key={g.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <span className="text-gray-300 font-semibold">📅 {g.date} à {g.time}</span>
                        {editingHistoryId === g.id ? (
                            <div className="flex gap-2 animate-in slide-in-from-left-2 items-center bg-black/40 p-2 rounded-xl">
                                <span className="text-xs text-gray-400 mr-1">Saison(s):</span>
                                <div className="flex flex-wrap gap-1">
                                    {seasons.map(s => {
                                        const gSeasons = Array.isArray(g.seasons) ? g.seasons : (g.season ? [g.season] : []);
                                        const isSelected = gSeasons.includes(s);
                                        return (
                                            <button key={s} onClick={() => updateGameSeason(g.id, s)} className={`text-[10px] px-2 py-0.5 rounded-lg border ${isSelected ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-white/5 border-white/10 text-gray-500'}`}>{s}</button>
                                        );
                                    })}
                                </div>
                                <button onClick={() => setEditingHistoryId(null)} className="ml-2 p-1 bg-white/10 text-white rounded hover:bg-white/20"><Check size={14}/></button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <div className="flex flex-wrap gap-1">
                                    {Array.isArray(g.seasons) && g.seasons.map(s => <span key={s} className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded-lg text-xs font-bold border border-cyan-500/30">{s}</span>)}
                                    {(!g.seasons && g.season && g.season !== 'Aucune') && <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded-lg text-xs font-bold border border-cyan-500/30">{g.season}</span>}
                                </div>
                                <button onClick={() => setEditingHistoryId(g.id)} className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"><Edit3 size={12}/></button>
                            </div>
                        )}
                        {g.grid && <button onClick={() => setReplayGame(g)} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-blue-500/30"><Eye size={14}/> Voir la grille</button>}
                    </div>
                    <button onClick={()=>deleteGame(g.id)} className="p-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-all hover:scale-110"><Trash2 size={18}/></button>
                </div>
                {g.moveLog && g.moveLog.length > 1 && <GameFlowChartMini moveLog={g.moveLog} gamePlayers={g.players||g.results}/>}
                <div className="space-y-2">{(g.players||g.results).sort((a,b)=> {
                    // TRI PAR SCORE, PUIS TIEBREAKER
                    if(a.score !== b.score) return b.score - a.score;
                    return (b.tieBreaker||0) - (a.tieBreaker||0);
                }).map((pl,i)=>{
                    const isTrueWinner = i === 0;
                    return (
                        <div key={i} className="flex items-center justify-between bg-black/30 rounded-xl p-4 backdrop-blur-sm">
                            <span className="text-white font-bold flex items-center gap-3">
                                {isTrueWinner ? <span className="text-2xl animate-pulse">👑</span> : (i===1?<span className="text-xl">🥈</span>:i===2?<span className="text-xl">🥉</span>:null)}
                                <span className="text-lg">{pl.name}</span>
                                {pl.yamsCount>0&&<span className="text-yellow-400 text-sm bg-yellow-500/20 px-2 py-0.5 rounded ml-2">🎲 YAMS!</span>}
                            </span>
                            <div className="flex items-baseline gap-2">
                                <span className="font-black text-2xl" style={{color:isTrueWinner?T.primary:'#9ca3af'}}>{pl.score}</span>
                                {pl.tieBreaker && <span className="text-sm font-bold text-gray-500">({pl.tieBreaker})</span>}
                            </div>
                        </div>
                    );
                })}</div></div>)}</div>}
          </div></div>
        )}

        {/* TAB: STATS & TROPHIES */}
        {currentTab==='stats'&&(
            <div className="space-y-6 tab-enter">
                
                <div className="flex justify-between items-center bg-white/5 p-4 rounded-3xl border border-white/10">
                    <div>
                        <h2 className="text-3xl font-black text-white flex items-center gap-3"><Activity className="text-blue-400"/> Statistiques</h2>
                        {statsFilterSeason !== 'Toutes' && seasonDescriptions[statsFilterSeason] && (
                            <p className="text-gray-400 text-xs mt-1 italic pl-10">{seasonDescriptions[statsFilterSeason]}</p>
                        )}
                    </div>
                    <select value={statsFilterSeason} onChange={e=>setStatsFilterSeason(e.target.value)} className="bg-black/30 text-white p-2 rounded-xl text-sm font-bold border border-white/10 outline-none">
                        <option value="Toutes">Toutes les Saisons</option>
                        <option value="Aucune">Hors Saison</option>
                        {seasons.map(s=><option key={s} value={s}>{s}</option>)}
                    </select>
                </div>

                {/* 1. SCORE MAXI ATTEINT */}
                <div className={'bg-gradient-to-br '+T.card+' backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl '+T.glow+' p-6'}>
                  {(()=>{
                      if(!playerStats || !playerStats.length) return <div className="text-center text-gray-500 py-8">Pas encore de statistiques. Jouez une partie !</div>;
                      const bestScore = Math.max(...playerStats.map(s=>s.maxScore));
                      const bestPlayers = playerStats.filter(s=>s.maxScore===bestScore);
                      const maxPossible = 375;
                      const pctOfMax = ((bestScore/maxPossible)*100).toFixed(1);
                      if (bestScore === 0) return <div className="text-center text-gray-500 py-8">Jouez pour débloquer les stats !</div>;
                      return (
                      <div className="mb-2 p-6 bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 border-2 border-yellow-400/50 rounded-2xl backdrop-blur-sm shadow-xl shadow-yellow-500/20">
                          <div className="flex items-center justify-between flex-wrap gap-4">
                              <div className="flex items-center gap-4"><span className="text-6xl animate-pulse">🌟</span><div><div className="text-yellow-400 text-sm font-bold uppercase tracking-wider">Record Absolu</div><div className="text-white text-3xl font-black">{bestScore} <span className="text-sm font-normal text-gray-400">/ {maxPossible}</span></div><div className="text-white font-bold text-lg mt-1">{bestPlayers.map(p=>p.name).join(' & ')}</div></div></div>
                              <div className="text-right"><div className="text-yellow-400 text-sm font-bold uppercase tracking-wider">Performance</div><div className="text-white text-5xl font-black">{pctOfMax}%</div><div className="text-gray-300 text-xs">du maximum théorique</div></div>
                          </div>
                      </div>
                      );
                  })()}
                </div>

                {/* NOUVELLE VERSION GRAPHIQUE YAMS & YAMS CACHÉS (CARTES) */}
                <div className={'bg-gradient-to-br '+T.card+' backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl '+T.glow+' p-6'}>
                    <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3"><Dices className="text-purple-400"/> Chasse aux Yams</h2>
                    
                    {playerStats.length === 0 ? (
                        <div className="text-gray-500 italic text-center">Aucune donnée disponible.</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {playerStats.map(p => (
                                <div key={p.name} className="relative bg-black/40 border border-white/10 rounded-2xl p-4 overflow-hidden group hover:border-purple-500/30 transition-colors">
                                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <Dices size={80} className="text-purple-500"/>
                                    </div>
                                    <div className="relative z-10 flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center text-2xl border border-white/10 shadow-lg">
                                                {playerAvatars[p.name] || '👤'}
                                            </div>
                                            <div>
                                                <div className="font-black text-white text-lg leading-none">{p.name}</div>
                                                <div className="text-xs text-gray-400 font-bold uppercase tracking-wide mt-1">Total: {p.yamsCount + p.hiddenYamsCount}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-3xl font-black text-white">{p.yamsCount + p.hiddenYamsCount}</div>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 flex flex-col items-center justify-center">
                                            <span className="text-2xl mb-1">🎲</span>
                                            <span className="text-yellow-400 font-black text-2xl">{p.yamsCount}</span>
                                            <span className="text-[9px] uppercase font-bold text-yellow-500/70 tracking-widest">Vrais Yams</span>
                                        </div>
                                        <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 flex flex-col items-center justify-center">
                                            <span className="text-2xl mb-1">👻</span>
                                            <span className="text-purple-400 font-black text-2xl">{p.hiddenYamsCount}</span>
                                            <span className="text-[9px] uppercase font-bold text-purple-500/70 tracking-widest">Yams Cachés</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="mt-4 text-center text-xs text-gray-500 italic">* Yams Caché = Score maximum réalisé dans une catégorie supérieure (ex: 5 au As, 30 au Six)</div>
                </div>

                {/* 3. RECORDS & STATS (GRILLE DE 4) */}
                <div className={'bg-gradient-to-br '+T.card+' backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl '+T.glow+' p-6'}>
                  <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3"><Activity className="text-blue-400"/> Records & Stats</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(()=>{
                        if(!playerStats || playerStats.length === 0) return <div className="text-gray-500 italic">Pas assez de données...</div>;
                        const bestAvg = Math.max(...playerStats.map(s=>s.avgScore));
                        const bestAvgP = playerStats.filter(s=>s.avgScore===bestAvg);
                        const mostG = Math.max(...playerStats.map(s=>s.games));
                        const mostGP = playerStats.filter(s=>s.games===mostG);
                        const totY = playerStats.reduce((sum,s)=>sum+s.yamsCount,0);
                        const maxY = Math.max(...playerStats.map(s=>s.yamsCount));
                        const mostYP = playerStats.filter(s=>s.yamsCount===maxY);
                        return (
                            <>
                                <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-400/30 rounded-2xl p-5"><div className="flex items-center gap-3 mb-3"><span className="text-4xl">🎯</span><div><div className="text-blue-300 text-xs font-bold uppercase">Meilleure Moyenne</div><div className="text-white text-xl font-black">{bestAvgP.map(p=>p.name).join(' & ')}</div></div></div><div className="text-4xl font-black text-blue-300">{bestAvg} pts</div></div>
                                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-2xl p-5"><div className="flex items-center gap-3 mb-3"><span className="text-4xl">🎮</span><div><div className="text-purple-300 text-xs font-bold uppercase">Plus Actif</div><div className="text-white text-xl font-black">{mostGP.map(p=>p.name).join(' & ')}</div></div></div><div className="text-4xl font-black text-purple-300">{mostG} parties</div></div>
                                <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-2xl p-5"><div className="flex items-center gap-3 mb-3"><span className="text-4xl">🎲</span><div><div className="text-yellow-300 text-xs font-bold uppercase">Total Yams</div><div className="text-white text-xl font-black">Tous joueurs</div></div></div><div className="text-4xl font-black text-yellow-300">{totY} 🎲</div></div>
                                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-2xl p-5"><div className="flex items-center gap-3 mb-3"><span className="text-4xl">👑</span><div><div className="text-green-300 text-xs font-bold uppercase">Roi du Yams</div><div className="text-white text-xl font-black">{mostYP.map(p=>p.name).join(' & ')}</div></div></div><div className="text-4xl font-black text-green-300">{maxY} Yams</div></div>
                            </>
                        );
                    })()}
                  </div>
                </div>

                {/* 5. FACE A FACE V2 */}
                <div className={'bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border border-blue-500/30 backdrop-blur-xl rounded-3xl shadow-2xl '+T.glow+' p-6'}>
                    <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3"><Swords className="text-blue-400"/> Duel : Face-à-Face V2</h2>
                    <div className="flex gap-4 items-center justify-center mb-8">
                        <select onChange={e=>setVersus({...versus, p1: e.target.value})} className="bg-white/5 p-4 rounded-2xl outline-none text-white font-bold border border-white/10 focus:border-white/30 w-1/3 text-center">
                            <option value="" disabled selected>Sélectionner...</option>
                            {Object.keys(playerStats.reduce((acc,s)=>{acc[s.name]=s; return acc},{})).map(n=><option key={n} value={n} className="bg-slate-900">{n}</option>)}
                        </select>
                        <div className="text-2xl font-black italic text-gray-500">VS</div>
                        <select onChange={e=>setVersus({...versus, p2: e.target.value})} className="bg-white/5 p-4 rounded-2xl outline-none text-white font-bold border border-white/10 focus:border-white/30 w-1/3 text-center">
                            <option value="" disabled selected>Sélectionner...</option>
                            {Object.keys(playerStats.reduce((acc,s)=>{acc[s.name]=s; return acc},{})).map(n=><option key={n} value={n} className="bg-slate-900">{n}</option>)}
                        </select>
                    </div>
                    {versus.p1 && versus.p2 && playerStats.find(s=>s.name===versus.p1) && playerStats.find(s=>s.name===versus.p2) && (
                        <div className="space-y-6">
                            {(() => {
                                const p1 = playerStats.find(s=>s.name===versus.p1);
                                const p2 = playerStats.find(s=>s.name===versus.p2);
                                if (!p1 || !p2) return null;
                                const p1Wins = filteredHistory.filter(g => {
                                    const pp1 = (g.players||g.results).find(p=>p.name===versus.p1);
                                    const pp2 = (g.players||g.results).find(p=>p.name===versus.p2);
                                    return pp1 && pp2 && pp1.score > pp2.score;
                                }).length;
                                const p2Wins = filteredHistory.filter(g => {
                                    const pp1 = (g.players||g.results).find(p=>p.name===versus.p1);
                                    const pp2 = (g.players||g.results).find(p=>p.name===versus.p2);
                                    return pp1 && pp2 && pp2.score > pp1.score;
                                }).length;
                                return (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border border-blue-500/30 p-6 rounded-2xl relative overflow-hidden text-center group hover:scale-[1.02] transition-transform">
                                                <div className="absolute top-2 right-2 opacity-20"><Swords size={60} className="text-blue-400"/></div>
                                                <div className="text-blue-400 font-bold text-sm uppercase mb-2 tracking-widest">{versus.p1}</div>
                                                <div className="text-white font-black text-6xl mb-1">{p1Wins}</div>
                                            </div>
                                            <div className="bg-gradient-to-br from-red-900/40 to-rose-900/40 border border-red-500/30 p-6 rounded-2xl text-center relative overflow-hidden group hover:scale-[1.02] transition-transform">
                                                <div className="absolute top-2 right-2 opacity-20"><Swords size={60} className="text-red-400"/></div>
                                                <div className="text-red-400 font-bold text-sm uppercase mb-2 tracking-widest">{versus.p2}</div>
                                                <div className="text-white font-black text-6xl mb-1">{p2Wins}</div>
                                            </div>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    )}
                </div>

                {/* 7. LE FIL DU MATCH (GAME FLOW) */}
                <div className={'bg-gradient-to-br '+T.card+' backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl '+T.glow+' p-6'}>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-black text-white flex items-center gap-3"><TrendingUp/> Le Fil du Match</h2>
                        <div className="text-xs text-gray-400 font-bold bg-white/10 px-3 py-1 rounded-full">Dernière Partie</div>
                    </div>
                    <div className="h-64 w-full bg-black/20 rounded-xl p-4 relative">
                        {(!moveLog || moveLog.length < 2) && (!gameHistory[0]?.moveLog || gameHistory[0]?.moveLog.length < 2) ? 
                            <div className="flex items-center justify-center h-full text-gray-400 text-xs italic">Pas assez de données pour le moment</div> :
                            <GameFlowChart moveLog={moveLog.length > 0 ? moveLog : gameHistory[0]?.moveLog} players={players} />
                        }
                    </div>
                </div>

            </div>
        )}

        {/* TAB: GAME */}
        {currentTab==='game'&&(
          <div className="space-y-4 tab-enter">
            {speedMode && timeLeft > 0 && <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden"><div className={`h-full transition-all duration-1000 ${timeLeft<10?'bg-red-500':'bg-green-500'}`} style={{width: `${(timeLeft/30)*100}%`}}></div></div>}
            
            <div className={'bg-gradient-to-br '+T.card+' backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl '+T.glow+' p-6'}>
              <div className="flex items-center justify-between mb-6"><h2 className="text-2xl font-black text-white flex items-center gap-3"><span className="text-3xl">👥</span>Joueurs</h2><button onClick={addPlayer} disabled={players.length>=6||isGameStarted()} className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-bold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"><Plus size={20}/>Ajouter</button></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">{players.map((player,i)=><PlayerCard key={i} player={player} index={i} onRemove={removePlayer} onNameChange={updatePlayerName} canRemove={players.length>1} gameStarted={isGameStarted()} avatar={playerAvatars[player]} onAvatarClick={openAvatarSelector}/>)}</div>
            </div>

            <div className={'bg-gradient-to-br '+T.card+' backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl '+T.glow+' p-4 sm:p-6'}>
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <h2 className="text-2xl font-black text-white flex items-center gap-3"><span className="text-3xl">📝</span>Feuille de score</h2>
                <div className="flex gap-2 flex-wrap items-center">
                  {editMode?(<><button onClick={toggleEditMode} className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-xl font-bold transition-all flex items-center gap-2"><Check size={18}/>Valider</button><button onClick={cancelEdit} className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl font-bold transition-all flex items-center gap-2"><X size={18}/>Annuler</button></>):(<button onClick={toggleEditMode} className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl font-bold transition-all flex items-center gap-2"><Edit3 size={18}/>Éditer</button>)}
                  <button onClick={()=>resetGame(null)} className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl font-bold transition-all flex items-center gap-2"><RotateCcw size={18}/>Reset</button>
                </div>
              </div>
              {!editMode && !isGameComplete() && (
                  <div className="mb-4 p-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-2 border-green-400 rounded-2xl shadow-xl shadow-green-500/20">
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                          <div className="flex items-center gap-3">
                              <span className="text-2xl">🎯</span>
                              <div>
                                  <div className="text-white font-bold">Prochain joueur: <span className="text-green-400 text-xl font-black">{getNextPlayer()}</span></div>
                              </div>
                          </div>
                      </div>
                  </div>
              )}

              <div className="overflow-x-auto"><table className="w-full table-fixed"><colgroup><col className="w-48"/>{players.map((_,i)=><col key={i} className="w-32"/>)}</colgroup><thead><tr className="border-b border-white/20">
                <th className="text-left p-3 text-white font-bold sticky left-0 bg-gradient-to-r from-slate-900 to-slate-800 z-10">Catégorie</th>
                {players.map((p,i)=><th key={i} className={`p-0 transition-all ${getNextPlayer()===p&&!editMode?'bg-white/10 ring-2 ring-inset ring-yellow-400/50':''}`}>
                    <div className="p-3 text-white font-bold text-lg flex flex-col items-center justify-center gap-1 relative">
                        <div className="flex items-center justify-center gap-2">
                             {isGameStarted() && !isGameComplete() && (
                                <div className="z-20">
                                    {getRank(p) === 1 ? <Crown size={32} className="text-yellow-400 drop-shadow-lg animate-bounce" fill="currentColor" /> : null}
                                </div>
                            )}
                            <div className="text-3xl cursor-pointer hover:scale-110 transition-transform" onClick={() => openAvatarSelector(i)}>{playerAvatars[p] || "👤"}</div>
                        </div>
                        <div className="text-sm mt-1">{p}</div>
                        {!lastPlayerToPlay && p === starterName && <span className="text-xs bg-yellow-500 text-black px-2 py-0.5 rounded-full animate-bounce">1️⃣</span>}
                        {jokersEnabled && jokers[p] > 0 && <button onClick={()=>useJoker(p)} className="text-xs bg-purple-500/30 text-purple-200 px-2 py-0.5 rounded border border-purple-500/50 flex items-center gap-1 hover:bg-purple-500 hover:text-white"><Wand2 size={10}/> {jokers[p]}</button>}
                    </div>
                </th>)}</tr></thead><tbody>
                {categories.map(cat=>{
                  if(cat.upperHeader)return <tr key={cat.id}><td colSpan={players.length+1} className="p-0"><div className="relative py-4"><div className="absolute inset-0 flex items-center"><div className="w-full border-t-2" style={{background:'linear-gradient(90deg,transparent,'+T.primary+'50,transparent)',height:'2px'}}/></div><div className="relative flex justify-center"><span className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-2 text-white font-black text-sm uppercase tracking-wider rounded-full border border-white/20">⬇️ Partie Supérieure ⬆️</span></div></div></td></tr>;
                  if(cat.upperDivider)return <tr key={cat.id}><td colSpan={players.length+1} className="p-0"><div className="relative py-2"><div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div></div></td></tr>;
                  if(cat.divider)return <tr key={cat.id}><td colSpan={players.length+1} className="p-0"><div className="relative py-4"><div className="absolute inset-0 flex items-center"><div className="w-full border-t-2" style={{background:'linear-gradient(90deg,transparent,'+T.primary+'50,transparent)',height:'2px'}}/></div><div className="relative flex justify-center"><span className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-2 text-white font-black text-sm uppercase tracking-wider rounded-full border border-white/20">⬇️ Partie Inférieure ⬇️</span></div></div></td></tr>;
                  return <tr key={cat.id} className={'border-b border-white/10 hover:bg-white/10 transition-colors duration-150 '+(cat.upperTotal||cat.bonus?'bg-white/5':'')+(cat.upper?' bg-blue-500/5':cat.lower?' bg-purple-500/5':'')}><td className="p-3 sticky left-0 bg-gradient-to-r from-slate-900 to-slate-800 z-10"><div className="flex items-center gap-3"><span className="text-2xl" style={{color:cat.color||'#fff'}}>{cat.icon}</span><div><span className="text-white font-bold block">{cat.name}</span>{cat.desc&&<span className="text-xs text-gray-400 block mt-0.5">{cat.desc}</span>}</div></div></td>{players.map((p,pi)=><td key={pi} className={`p-2 transition-all ${getNextPlayer()===p&&!editMode?'bg-white/10 ring-2 ring-inset ring-yellow-400/50':''}`}>
                  {cat.upperTotal?<div className="text-center py-3 px-2 rounded-xl font-black text-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400">{isFoggy(p)?"???":calcUpper(p)}</div>
                  :cat.bonus?<div className="space-y-1"><div className="text-center py-3 px-2 rounded-xl font-black text-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400">{isFoggy(p)?"???":getBonus(p)}</div>{isFoggy(p)?<div className="text-center text-xs font-bold text-gray-600">Masqué</div>:(calcUpper(p)>=63?<div className="text-center text-xs font-semibold text-green-400">✅ Bonus acquis!</div>:<div className="flex items-center justify-center gap-2 text-xs font-bold"><span className="text-orange-400">Reste: {63-calcUpper(p)}</span><span className="text-gray-600">|</span></div>)}</div>
                  :cat.upperGrandTotal?<div className="text-center py-3 px-2 rounded-xl font-black text-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-400 border border-indigo-400/30">{isFoggy(p)?"???":calcUpperGrand(p)}</div>
                  :cat.lowerTotal?<div className="text-center py-3 px-2 rounded-xl font-black text-xl bg-gradient-to-r from-pink-500/20 to-rose-500/20 text-pink-400 border border-pink-400/30">{isFoggy(p)?"???":calcLower(p)}</div>
                  :<ScoreInput value={scores[p]?.[cat.id]} onChange={(v, e)=>updateScore(p,cat.id,v, e)} category={cat.id} isHighlighted={lastModifiedCell===(p+'-'+cat.id)} isLocked={!editMode&&scores[p]?.[cat.id]!==undefined} isImposedDisabled={imposedOrder && !editMode && scores[p]?.[cat.id] === undefined && playableCats.findIndex(c => scores[p]?.[c.id] === undefined) !== playableCats.findIndex(c => c.id === cat.id)} isFoggy={isFoggy(p)}/>}
                  </td>)}</tr>;
                })}
                <tr className="border-t-2 border-white/30 bg-gradient-to-r from-white/10 to-white/5"><td className="p-4 sticky left-0 bg-gradient-to-r from-slate-800 to-slate-700 z-10"><div className="flex items-center gap-3"><span className="text-3xl">🏆</span><span className="text-white font-black text-xl">TOTAL</span></div></td>{players.map((p,i)=><td key={i} className="p-4 text-center">{hideTotals&&!isGameComplete()?<div className="text-2xl font-black py-4 px-2 rounded-2xl text-gray-500">???</div>:<div className="text-4xl font-black py-4 px-2 rounded-2xl" style={{color:getWinner().includes(p)?T.primary:'#fff',textShadow:getWinner().includes(p)?'0 0 20px '+T.primary:'none'}}>{isFoggy(p)?"???":calcTotal(p)}</div>}</td>)}</tr>
              </tbody></table></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}