import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  Plus, Trash2, RotateCcw, Settings, Edit3, Check, X, Download, Share2, 
  Undo2, BookOpen, Dices, Eye, ArrowLeft, Trophy, Medal, Activity, Lock, 
  History as HistoryIcon, Timer, EyeOff, Palette, Sun, Monitor, 
  Zap, Scale, Swords, ThumbsDown, ThumbsUp, Crown, 
  ScrollText, Award, Flame, Coffee, Ghost, Moon, Wand2,
  TrendingUp, AlertTriangle, Gift, Camera, Calendar, PenLine, Info, Save,
  Play, Pause, Skull, Sparkles, Image, BarChart3, HelpCircle, LockKeyhole, Star, Gavel, Frown,
  ShoppingBag, Target, Radar
} from "lucide-react";

// --- CONFIGURATION ---
const categories = [
  { id:"upperHeader", upperHeader:true },
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
  modern: { name: "Modern Dark", price: 0, primary: "#6366f1", secondary: "#8b5cf6", bg: "from-slate-950 via-indigo-950 to-slate-950", card: "from-slate-900/90 to-slate-800/90", glow: "shadow-indigo-500/20", icon: <Monitor size={16}/>, part: "✨" },
  ocean: { name: "Deep Ocean", price: 0, primary: "#06b6d4", secondary: "#0891b2", bg: "from-slate-950 via-cyan-950 to-slate-950", card: "from-slate-900/90 to-cyan-900/90", glow: "shadow-cyan-500/20", icon: <Share2 size={16}/>, part: "🫧" },
  sunset: { name: "Sunset Burn", price: 0, primary: "#f97316", secondary: "#ea580c", bg: "from-slate-950 via-orange-950 to-slate-950", card: "from-slate-900/90 to-orange-900/90", glow: "shadow-orange-500/20", icon: <Sun size={16}/>, part: "🔥" },
  forest: { name: "Emerald Forest", price: 0, primary: "#10b981", secondary: "#059669", bg: "from-slate-950 via-emerald-950 to-slate-950", card: "from-slate-900/90 to-emerald-900/90", glow: "shadow-emerald-500/20", icon: <BookOpen size={16}/>, part: "🍃" },
  cyber: { name: "Cyberpunk", price: 500, primary: "#d946ef", secondary: "#8b5cf6", bg: "from-black via-fuchsia-950 to-black", card: "from-black/90 to-purple-900/90", glow: "shadow-fuchsia-500/40", icon: <Zap size={16}/>, part: "⚡" },
  gold: { name: "Midas Touch", price: 2000, primary: "#eab308", secondary: "#ca8a04", bg: "from-yellow-950 via-yellow-900 to-black", card: "from-yellow-900/40 to-black", glow: "shadow-yellow-500/40", icon: <Crown size={16}/>, part: "👑" },
  matrix: { name: "The Matrix", price: 1000, primary: "#22c55e", secondary: "#15803d", bg: "from-black via-green-950 to-black", card: "from-black to-green-900/20", glow: "shadow-green-500/40", icon: <Terminal size={16}/>, part: "01" },
  lavender: { name: "Lavender", price: 300, primary: "#a78bfa", secondary: "#7c3aed", bg: "from-violet-950 via-slate-900 to-violet-900", card: "from-violet-900/80 to-slate-900/80", glow: "shadow-violet-400/20", icon: <Ghost size={16}/>, part: "🌸" },
};

const SHOP_ITEMS = [
    { id: 'joker_pack', name: 'Pack de Jokers', type: 'consumable', cost: 300, icon: '🃏', desc: '+1 Joker par partie (Permanent)' },
    { id: 'theme_cyber', name: 'Thème Cyberpunk', type: 'theme', cost: 500, icon: '⚡', themeId: 'cyber', desc: 'Débloque le thème Cyberpunk' },
    { id: 'theme_matrix', name: 'Thème Matrix', type: 'theme', cost: 1000, icon: '💻', themeId: 'matrix', desc: 'Débloque le thème Matrix' },
    { id: 'theme_gold', name: 'Thème Midas', type: 'theme', cost: 2000, icon: '👑', themeId: 'gold', desc: 'Débloque le thème Or' },
    { id: 'double_xp', name: 'Double XP', type: 'boost', cost: 1500, icon: '💎', desc: 'Double vos gains d\'XP' },
];

const MISSIONS_POOL = [
    { id: 1, text: "Faire un Yams", xp: 300 },
    { id: 2, text: "Score > 250 pts", xp: 150 },
    { id: 3, text: "Réussir le Bonus", xp: 100 },
    { id: 4, text: "Faire un Carré de 6", xp: 200 },
    { id: 5, text: "Aucun score à 0", xp: 300 },
    { id: 6, text: "Grande Suite du 1er coup", xp: 400 },
];

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
  const counts = {}; let sum = 0;
  dice.forEach(d => { counts[d] = (counts[d] || 0) + 1; sum += d; });
  const countValues = Object.values(counts);
  const uniqueDice = Object.keys(counts).map(Number).sort((a,b)=>a-b);
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
  const cat = categories.find(c=>c.id===category);
  const vals = cat?.values || Array.from({length:31},(_,i)=>i);
  return (
    <select value={value??''} onChange={e=>onChange(e.target.value, e)} disabled={isLocked}
      className={`w-full py-3 px-2 rounded-xl font-bold text-sm sm:text-lg text-center transition-all duration-300 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50 ${isLocked?'cursor-not-allowed opacity-60 bg-white/5 text-gray-400 border border-white/10':isHighlighted?'cursor-pointer bg-gradient-to-r from-green-500/30 to-emerald-500/30 border-2 border-green-400 text-white shadow-lg shadow-green-500/50 ring-pulse':'cursor-pointer bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 hover:shadow-lg hover:shadow-white/5'}`}
      style={isLocked||isHighlighted?{}:{background:'linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.1))',color:'white'}}>
      <option value="" style={{backgroundColor:'#1e293b',color:'white'}}>-</option>
      {vals.map(v=><option key={v} value={v} style={{backgroundColor:'#1e293b',color:'white'}}>{v}</option>)}
    </select>
  );
};

// PlayerCard avec Animation "On Fire"
const PlayerCard = ({ player, index, onRemove, onNameChange, canRemove, gameStarted, avatar, onAvatarClick, streak }) => {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(player);
  const save = () => { if(name.trim()){onNameChange(index,name.trim());setEditing(false);} };
  
  return (
    <div className={`glass-strong rounded-2xl p-3 sm:p-4 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group relative ${streak >= 2 ? 'border-orange-500/50 shadow-orange-500/20' : ''}`} style={{animationDelay:`${index*80}ms`,animation:'fade-in-scale 0.4s ease-out backwards'}}>
      {streak >= 2 && <div className="absolute -top-3 -right-2 text-2xl animate-bounce filter drop-shadow-lg z-20">🔥</div>}
      {streak >= 5 && <div className="absolute -top-3 -left-2 text-2xl animate-pulse filter drop-shadow-lg z-20">⚡</div>}
      
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        <button onClick={() => onAvatarClick(index)} className={`w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-xl hover:bg-white/20 transition-all duration-300 shadow-inner overflow-hidden cursor-pointer hover:scale-110 hover:shadow-lg group-hover:ring-2 group-hover:ring-white/20 ${streak >= 2 ? 'ring-2 ring-orange-500 animate-pulse' : ''}`}>
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
    const [rolling, setRolling] = useState(false);
    const s = DICE_SKINS[skin] || DICE_SKINS.classic;
    const handleClick = () => { setRolling(true); setTimeout(() => setRolling(false), 500); onClick(); };
    return (
        <button onClick={handleClick} className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl active:scale-90 transition-all duration-200 ${s.bg} ${s.text} ${s.border} border-2 shadow-lg hover:shadow-xl ${rolling ? '' : 'hover:-translate-y-1'}`}
          style={rolling ? {animation: 'dice-roll 0.6s ease-in-out'} : {}}>
            {['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'][value]}
        </button>
    );
};

const FloatingScore = ({ x, y, value }) => {
    return <div className="fixed pointer-events-none text-green-400 font-black text-2xl z-[100]" style={{ left: x, top: y, animation: 'floatUp 1s ease-out forwards', fontFamily: 'JetBrains Mono, monospace' }}>+{value}</div>;
};

// --- NOUVEAU COMPOSANT RADAR CHART (SPIDER) ---
const RadarChart = ({ stats }) => {
    if(!stats) return null;
    const size = 180;
    const center = size / 2;
    const radius = size * 0.4;
    
    // Normalisation des stats (0 à 100) pour l'affichage
    const metrics = [
        { label: "Score", val: Math.min(100, (stats.avgScore / 350) * 100) },
        { label: "Chance", val: Math.min(100, (stats.yamsCount * 25)) },
        { label: "Bonus", val: stats.bonusRate || 0 },
        { label: "Victoire", val: Math.min(100, ((stats.wins / (stats.games||1)) * 100)) },
        { label: "Exp.", val: Math.min(100, (stats.historyGames * 2)) }
    ];

    const getPoint = (val, i, total) => {
        const angle = (Math.PI * 2 * i) / total - Math.PI / 2;
        const dist = (val / 100) * radius;
        return [center + Math.cos(angle) * dist, center + Math.sin(angle) * dist];
    };

    const points = metrics.map((m, i) => getPoint(m.val, i, metrics.length)).map(p => p.join(',')).join(' ');
    const bgPoints = metrics.map((_, i) => getPoint(100, i, metrics.length)).map(p => p.join(',')).join(' ');

    return (
        <div className="relative w-full flex justify-center py-4">
            <svg width={size} height={size} className="overflow-visible filter drop-shadow-lg">
                {/* Background Web */}
                <polygon points={bgPoints} fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                {[0.25, 0.5, 0.75].map(r => (
                    <polygon key={r} points={metrics.map((_, i) => getPoint(100*r, i, metrics.length)).map(p => p.join(',')).join(' ')} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                ))}
                {/* Data Shape */}
                <polygon points={points} fill="rgba(168, 85, 247, 0.4)" stroke="#a855f7" strokeWidth="2" />
                {/* Labels */}
                {metrics.map((m, i) => {
                    const [x, y] = getPoint(125, i, metrics.length);
                    return (
                        <text key={i} x={x} y={y} fill="rgba(255,255,255,0.7)" fontSize="10" textAnchor="middle" alignmentBaseline="middle" className="uppercase font-bold tracking-wider">
                            {m.label}
                        </text>
                    );
                })}
            </svg>
        </div>
    );
};

const GameFlowChart = ({ moveLog, players }) => {
    if (!moveLog || moveLog.length === 0) return <div className="text-center text-gray-500 text-xs py-8">Pas de données pour cette partie</div>;
    const history = []; const currentScores = {}; players.forEach(p => currentScores[p] = 0);
    history.push({ index: -1, ...currentScores });
    moveLog.forEach((move, index) => {
        if(currentScores[move.player] !== undefined) {
             currentScores[move.player] += parseInt(move.value);
             history.push({ index, ...currentScores });
        }
    });
    if(history.length < 2) return <div className="text-center text-gray-500 text-xs py-8">Pas assez de coups joués</div>;
    const maxScore = Math.max(...history.map(h => Math.max(...Object.values(h).filter(v => typeof v === 'number' && v !== h.index))));
    const width = 1000; const height = 300; const paddingX = 40; const paddingY = 40;
    const colors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];
    return (
        <div className="relative w-full h-64 overflow-hidden bg-black/20 rounded-xl p-2">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
                {[0, 0.25, 0.5, 0.75, 1].map(p => { const y = paddingY + p * (height - 2*paddingY); return <line key={p} x1={paddingX} y1={y} x2={width-paddingX} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />; })}
                {players.map((player, pIdx) => {
                    const color = colors[pIdx % colors.length];
                    const points = history.map((step, i) => { const x = paddingX + (i / (history.length - 1)) * (width - 2 * paddingX); const y = (height - paddingY) - ((step[player] / (maxScore || 1)) * (height - 2 * paddingY)); return `${x},${y}`; }).join(' ');
                    return ( <g key={player}> <polyline points={points} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/> </g> );
                })}
            </svg>
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
                {pNames.map((player, pIdx) => { const color = colors[pIdx % colors.length]; const pts = history.map((step, i) => { const x = px + (i / (history.length - 1)) * (w - 2 * px); const y = (h - py) - ((Math.min(step[player]||0, 375) / maxScore) * (h - 2 * py)); return `${x},${y}`; }).join(' '); return ( <g key={player}> <polyline points={pts} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{filter:`drop-shadow(0 0 4px ${color}40)`}}/> </g> ); })}
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
  const [versus, setVersus] = useState({p1: '', p2: '', failPlayer: 'GLOBAL', luckPlayer: ''});
  const [globalXP, setGlobalXP] = useState(0);
  const [chaosMode, setChaosMode] = useState(false);
  const [activeChaosCard, setActiveChaosCard] = useState(null);
  const [showStudioModal, setShowStudioModal] = useState(false);
  const [wakeLockEnabled, setWakeLockEnabled] = useState(true);
  
  // NOUVEAUX ÉTATS (V3)
  const [showBonusMissedModal, setShowBonusMissedModal] = useState(null);
  const [showBonusWonModal, setShowBonusWonModal] = useState(null);
  const [showSuddenDeathModal, setShowSuddenDeathModal] = useState(false);
  const [suddenDeathScores, setSuddenDeathScores] = useState({});
  const [inventory, setInventory] = useState([]);
  const [activeMissions, setActiveMissions] = useState([]);
  
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
  const onTouchEndHandler = () => { if (!touchStart || !touchEnd) return; const distance = touchStart - touchEnd; const isLeftSwipe = distance > minSwipeDistance; const isRightSwipe = distance < -minSwipeDistance; const tabs = ['game', 'shop', 'stats', 'history', 'trophies', 'gages', 'rules']; const currentIndex = tabs.indexOf(currentTab); if (isLeftSwipe && currentIndex < tabs.length - 1) setCurrentTab(tabs[currentIndex + 1]); if (isRightSwipe && currentIndex > 0) setCurrentTab(tabs[currentIndex - 1]); };

  useEffect(() => { let wakeLock = null; const requestWakeLock = async () => { if ('wakeLock' in navigator && wakeLockEnabled) { try { wakeLock = await navigator.wakeLock.request('screen'); } catch (err) { console.log(err); } } }; if (wakeLockEnabled) requestWakeLock(); const handleVisibilityChange = () => { if (wakeLock !== null && document.visibilityState === 'visible' && wakeLockEnabled) requestWakeLock(); }; document.addEventListener('visibilitychange', handleVisibilityChange); return () => { if (wakeLock !== null) wakeLock.release(); document.removeEventListener('visibilitychange', handleVisibilityChange); }; }, [wakeLockEnabled]);
  
  useEffect(()=>{
      loadHistory(); loadCurrentGame(); loadSavedPlayers(); loadGlobalStats(); loadSeasons(); loadGages(); loadShop();
      // Missions System
      const savedMissions = localStorage.getItem('yamsMissions');
      const savedDate = localStorage.getItem('yamsMissionsDate');
      const today = new Date().toLocaleDateString();
      if (savedDate !== today || !savedMissions) {
          const newMissions = [...MISSIONS_POOL].sort(() => 0.5 - Math.random()).slice(0, 3);
          setActiveMissions(newMissions);
          localStorage.setItem('yamsMissions', JSON.stringify(newMissions));
          localStorage.setItem('yamsMissionsDate', today);
      } else {
          setActiveMissions(JSON.parse(savedMissions));
      }
  },[]);

  const loadHistory=()=>{try{const r=localStorage.getItem('yamsHistory');if(r){const p=JSON.parse(r);setGameHistory(Array.isArray(p)?p:[]);}}catch(e){setGameHistory([])}};
  const saveHistory=(h)=>{try{localStorage.setItem('yamsHistory',JSON.stringify(h));}catch(e){}};
  const loadGlobalStats=()=>{try{const xp=localStorage.getItem('yamsGlobalXP');if(xp)setGlobalXP(parseInt(xp));}catch(e){}};
  const loadSeasons=()=>{try{const s=localStorage.getItem('yamsSeasons');const a=localStorage.getItem('yamsActiveSeason');const d=localStorage.getItem('yamsSeasonDesc');if(s)setSeasons(JSON.parse(s));if(a)setActiveSeason(a);if(d)setSeasonDescriptions(JSON.parse(d));}catch(e){}};
  const loadGages=()=>{try{const cg=localStorage.getItem('yamsCustomGages');const edg=localStorage.getItem('yamsEnableDefaultGages');if(cg)setCustomGages(JSON.parse(cg));if(edg)setEnableDefaultGages(JSON.parse(edg));}catch(e){}};
  const loadShop=()=>{try{const inv=localStorage.getItem('yamsInventory');if(inv)setInventory(JSON.parse(inv));}catch(e){}};

  useEffect(() => { localStorage.setItem('yamsCustomGages', JSON.stringify(customGages)); localStorage.setItem('yamsEnableDefaultGages', JSON.stringify(enableDefaultGages)); }, [customGages, enableDefaultGages]);
  useEffect(() => { localStorage.setItem('yamsInventory', JSON.stringify(inventory)); }, [inventory]);

  const saveCurrentGame=(sc)=>{try{localStorage.setItem('yamsCurrentGame',JSON.stringify({players,scores:sc,lastPlayerToPlay,lastModifiedCell,starterName,timestamp:Date.now(), imposedOrder, fogMode, speedMode, jokers, jokerMax, jokersEnabled, diceSkin, moveLog, chaosMode, activeChaosCard, wakeLockEnabled, activeSeason}));}catch(e){}};
  const loadCurrentGame=()=>{try{const r=localStorage.getItem('yamsCurrentGame');if(r){const d=JSON.parse(r);if(d.players&&d.scores){setPlayers(d.players);setScores(d.scores);setLastPlayerToPlay(d.lastPlayerToPlay||null);setLastModifiedCell(d.lastModifiedCell||null);setStarterName(d.starterName || d.players[0]); setImposedOrder(d.imposedOrder||false); setFogMode(d.fogMode||false); setSpeedMode(d.speedMode||false); setJokers(d.jokers||{}); setJokerMax(d.jokerMax!==undefined?d.jokerMax:2); setJokersEnabled(d.jokersEnabled!==undefined?d.jokersEnabled:false); setDiceSkin(d.diceSkin||'classic'); setMoveLog(d.moveLog||[]); setChaosMode(d.chaosMode||false); setActiveChaosCard(d.activeChaosCard||null); setWakeLockEnabled(d.wakeLockEnabled !== undefined ? d.wakeLockEnabled : true);}}}catch(e){}};
  const loadSavedPlayers=()=>{try{const r=localStorage.getItem('yamsSavedPlayers');const av=localStorage.getItem('yamsPlayerAvatars');if(r)setPlayers(JSON.parse(r));if(av)setPlayerAvatars(JSON.parse(av));}catch(e){}};
  
  useEffect(() => { if(!isGameStarted()) { const newJokers = {}; players.forEach(p => newJokers[p] = jokerMax); setJokers(newJokers); } }, [jokerMax, players]);
  useEffect(() => { if(players.length > 0) { localStorage.setItem('yamsSavedPlayers', JSON.stringify(players)); if (!starterName) setStarterName(players[0]); if(!simPlayer) setSimPlayer(players[0]); const newJokers = {...jokers}; let changed = false; players.forEach(p => { if(newJokers[p] === undefined) { newJokers[p] = jokerMax; changed=true; } }); if(changed) setJokers(newJokers); } }, [players, jokerMax]);
  useEffect(() => { localStorage.setItem('yamsPlayerAvatars', JSON.stringify(playerAvatars)); }, [playerAvatars]);
  useEffect(() => { localStorage.setItem('yamsGlobalXP', globalXP.toString()); }, [globalXP]);
  useEffect(() => { localStorage.setItem('yamsSeasons', JSON.stringify(seasons)); localStorage.setItem('yamsActiveSeason', activeSeason); localStorage.setItem('yamsSeasonDesc', JSON.stringify(seasonDescriptions)); }, [seasons, activeSeason, seasonDescriptions]);
  useEffect(() => { let interval; if(speedMode && isGameStarted() && !isGameComplete() && !editMode) { if(timeLeft > 0) { interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000); } } return () => clearInterval(interval); }, [speedMode, timeLeft, scores, editMode]);
  useEffect(() => { setTimeLeft(30); }, [lastPlayerToPlay]);

  const createSeason = () => { if(newSeasonName && !seasons.includes(newSeasonName)) { setSeasons([...seasons, newSeasonName]); setActiveSeason(newSeasonName); setNewSeasonName(''); } }; const updateSeasonDescription = (season, desc) => { setSeasonDescriptions(prev => ({...prev, [season]: desc})); };
  const isGameStarted=()=>Object.keys(scores).some(p=>scores[p]&&Object.keys(scores[p]).length>0); const addPlayer=()=>{if(players.length<6&&!isGameStarted())setPlayers([...players,`Joueur ${players.length+1}`]);}; const removePlayer=i=>{if(players.length>1&&!isGameStarted()){const rem=players[i];const np=[...players];np.splice(i,1);setPlayers(np);const ns={...scores};delete ns[rem];setScores(ns);}}; const updatePlayerName=(i,name)=>{const old=players[i];const np=[...players];np[i]=name;setPlayers(np);if(scores[old]){const ns={...scores};ns[name]=ns[old];delete ns[old];setScores(ns);}};
  const openAvatarSelector = (index) => { setAvatarSelectorIndex(index); setShowAvatarModal(true); }; const selectAvatar = (icon) => { const p = players[avatarSelectorIndex]; setPlayerAvatars({...playerAvatars, [p]: icon}); setShowAvatarModal(false); };
  const addCustomGage = () => { if (newGageInput.trim()) { setCustomGages([...customGages, { id: Date.now(), text: newGageInput.trim(), active: true }]); setNewGageInput(""); } }; const toggleCustomGage = (id) => { setCustomGages(customGages.map(g => g.id === id ? { ...g, active: !g.active } : g)); }; const deleteCustomGage = (id) => { setCustomGages(customGages.filter(g => g.id !== id)); };

  const calcUpper= (p, sc=scores) => { if (!p || !sc[p]) return 0; return categories.filter(c=>c.upper).reduce((s,c)=>s+(sc[p]?.[c.id]||0),0); }; const getBonus= (p, sc=scores) => calcUpper(p, sc)>=63?35:0; const calcUpperGrand= (p, sc=scores) => calcUpper(p, sc)+getBonus(p, sc); const calcLower= (p, sc=scores) => { if (!p || !sc[p]) return 0; return categories.filter(c=>c.lower).reduce((s,c)=>s+(sc[p]?.[c.id]||0),0); };
  const calcTotal= (p, sc=scores) => { if (!p) return 0; let total = calcUpperGrand(p, sc)+calcLower(p, sc); if(jokersEnabled) { const usedJokers = jokerMax - (jokers[p] !== undefined ? jokers[p] : jokerMax); if(usedJokers > 0) total -= (usedJokers * 10); } return total; };
  const getPlayerTotals = (p, sc=scores) => ({ upper: calcUpper(p, sc), bonus: getBonus(p, sc), lower: calcLower(p, sc), total: calcTotal(p, sc) });
  
  const getWinner=(tieBreakerScores = {})=>{ if(!players.length)return[]; const totals = players.map(p => ({name: p, score: calcTotal(p), tieScore: tieBreakerScores[p] || 0})); const maxScore = Math.max(...totals.map(t => t.score)); const tiedPlayers = totals.filter(t => t.score === maxScore); if(tiedPlayers.length > 1 && Object.keys(tieBreakerScores).length > 0) { const maxTie = Math.max(...tiedPlayers.map(t => t.tieScore)); return tiedPlayers.filter(t => t.tieScore === maxTie).map(t => t.name); } return tiedPlayers.map(t => t.name); };
  const getLoser=()=>{if(!players.length)return null;const totals=players.map(p=>({name:p,score:calcTotal(p)}));const min=Math.min(...totals.map(t=>t.score));return totals.find(t=>t.score===min);};
  const isGameComplete=()=>{if(!players.length)return false;const ids=playableCats.map(c=>c.id);return players.every(p=>ids.every(id=>scores[p]?.[id]!==undefined));};
  const getNextPlayer=()=>{if(!lastPlayerToPlay) {return players.includes(starterName) ? starterName : players[0];} return players[(players.indexOf(lastPlayerToPlay)+1)%players.length];};
  const isAvatarLocked = (req, stats) => { if(req === "none") return false; const [cond, val] = req.split(':'); const v = parseInt(val); if(!stats) return true; if(cond === 'games') return stats.games < v; if(cond === 'wins') return stats.wins < v; if(cond === 'yams') return stats.yamsCount < v; if(cond === 'score') return stats.maxScore < v; if(cond === 'lose') return (stats.games - stats.wins) < v; if(cond === 'bonus') return stats.bonusCount < v; return true; };
  const useJoker = (player) => { if(jokers[player] > 0) { if(window.confirm(`Utiliser un Joker pour ${player} ? Cela coûtera 10 points à la fin !`)) { setJokers({...jokers, [player]: jokers[player] - 1}); } } };
  const handleUndo = () => { if (!undoData) return; const { player, category, previousLastPlayer, previousLastCell } = undoData; const newScores = { ...scores }; if (newScores[player]) { delete newScores[player][category]; } setScores(newScores); setLastPlayerToPlay(previousLastPlayer); setLastModifiedCell(previousLastCell); setUndoData(null); setMoveLog(moveLog.slice(0, -1)); saveCurrentGame(newScores); };

  // SHOP LOGIC
  const buyItem = (item) => {
      if(globalXP >= item.cost) {
          if(window.confirm(`Acheter ${item.name} pour ${item.cost} XP ?`)) {
              setGlobalXP(prev => prev - item.cost);
              setInventory([...inventory, item.id]);
              setConfetti('gold');
              setTimeout(() => setConfetti(null), 2000);
          }
      } else {
          alert("Pas assez d'XP !");
      }
  };

  const updateScore=(player,category,value, event)=>{
    const cellKey=`${player}-${category}`;
    if(imposedOrder && !editMode) { const pScores = scores[player] || {}; const firstEmptyIndex = playableCats.findIndex(c => pScores[c.id] === undefined); const targetIndex = playableCats.findIndex(c => c.id === category); if(targetIndex !== firstEmptyIndex) { setShowTurnWarning("Mode Ordre Imposé !"); setTimeout(()=>setShowTurnWarning(null),3000); return; } }
    if(!editMode) { const exp = getNextPlayer(); if(player !== exp) { setShowTurnWarning(`Hé non ! C'est à ${exp} !`); setTimeout(()=>setShowTurnWarning(null),3000); return; } }
    
    const ns={...scores,[player]:{...scores[player],[category]:value===''?undefined:parseInt(value)||0}};
    const valInt = value === '' ? 0 : parseInt(value);
    
    if(value !== '') {
        const catName = categories.find(c=>c.id===category)?.name || category;
        setMoveLog([...moveLog, { player, category: catName, value: valInt, time: new Date().toLocaleTimeString('fr-FR') }]);
        setGlobalXP(prev => prev + valInt);
    }
    
    // Bonus Animations
    const upperCatsList = categories.filter(c => c.upper && !c.upperHeader && !c.upperDivider && !c.upperTotal && !c.upperGrandTotal);
    if(value !== '' && upperCatsList.some(c => c.id === category)) {
        const isUpperFull = upperCatsList.every(c => ns[player][c.id] !== undefined);
        const currentUpper = upperCatsList.reduce((acc, c) => acc + (ns[player][c.id] || 0), 0);
        const oldUp = calcUpper(player);
        if (oldUp < 63 && currentUpper >= 63) {
             setShowBonusWonModal({ player, score: currentUpper }); setConfetti('bonus'); setTimeout(() => { setShowBonusWonModal(null); setConfetti(null); }, 4000);
        } else if(isUpperFull && currentUpper < 63) {
             setShowBonusMissedModal({ player, score: currentUpper }); setConfetti('sad'); setTimeout(() => { setShowBonusMissedModal(null); setConfetti(null); }, 4000);
        }
    }

    if(category==='yams' && value==='50'){
        setPendingYamsDetail({ player }); setConfetti('gold'); setShakeAnimation('yams');
        setShowAchievementNotif({icon:'🎲',title:'YAMS !',description:player+' a un YAMS !'}); 
        setTimeout(()=>{setShowAchievementNotif(null);setConfetti(null);setShakeAnimation(null);},4000);
    }
    setScores(ns); saveCurrentGame(ns);
    if(!editMode) { if(value!==''){ setLastPlayerToPlay(player); setLastModifiedCell(cellKey); } else { setLastPlayerToPlay(null); setLastModifiedCell(null); } }
  };

  const filteredHistory = useMemo(() => {
      if(!gameHistory) return [];
      if(historyFilterSeason === 'Toutes') return gameHistory;
      return gameHistory.filter(g => {
          const gS = Array.isArray(g.seasons) ? g.seasons : (g.season ? [g.season] : []);
          return historyFilterSeason === 'Aucune' ? gS.length === 0 : gS.includes(historyFilterSeason);
      });
  }, [gameHistory, historyFilterSeason]);

  const playerStats = useMemo(() => {
      if (!gameHistory) return [];
      // CORRECT SEASON FILTER FOR STATS
      const historyToUse = statsFilterSeason === 'Toutes' ? gameHistory : gameHistory.filter(g => {
          const gS = Array.isArray(g.seasons) ? g.seasons : (g.season ? [g.season] : []);
          return statsFilterSeason === 'Aucune' ? gS.length === 0 : gS.includes(statsFilterSeason);
      });

      const stats = {};
      const allPlayerNames = new Set();
      historyToUse.forEach(g => g.players.forEach(p => allPlayerNames.add(p.name)));
      
      allPlayerNames.forEach(name => {
          stats[name] = { wins:0, games:0, maxScore:0, totalScore:0, yamsCount:0, bonusCount:0, historyGames:0, currentStreak: 0, hiddenYamsCount: 0 };
      });

      // Calc Streaks from full history (for On Fire logic)
      const streakStats = {};
      [...gameHistory].reverse().forEach(game => {
          game.players.forEach(p => {
              if (p.isWinner) streakStats[p.name] = (streakStats[p.name] || 0) + 1;
              else streakStats[p.name] = 0;
          });
      });

      historyToUse.forEach((game) => {
          game.players.forEach(p => {
              if(!stats[p.name]) return;
              const s = stats[p.name];
              s.games++;
              if(p.isWinner) s.wins++;
              s.maxScore = Math.max(s.maxScore, p.score);
              s.totalScore += p.score;
              s.yamsCount += p.yamsCount || 0;
              s.currentStreak = streakStats[p.name] || 0;
              
              if(game.grid && game.grid[p.name]) {
                  s.historyGames++;
                  let upSum = 0;
                  categories.filter(c => c.upper && c.max).forEach(cat => {
                      const val = game.grid[p.name][cat.id];
                      if (parseInt(val) === cat.max) s.hiddenYamsCount++;
                      upSum += (parseInt(val) || 0);
                  });
                  if (upSum >= 63) s.bonusCount++;
              }
          });
      });

      return Object.entries(stats).map(([name, d]) => ({
          name, ...d,
          avgScore: Math.round(d.totalScore / (d.games || 1)),
          bonusRate: Math.round((d.bonusCount / (d.historyGames || 1)) * 100)
      })).sort((a,b) => b.wins - a.wins);
  }, [gameHistory, statsFilterSeason]);

  const saveYamsDetail = (val) => { if(!pendingYamsDetail) return; const { player } = pendingYamsDetail; const newScores = { ...scores }; if(newScores[player]) { if(!newScores[player].yamsHistory) newScores[player].yamsHistory = []; newScores[player].yamsHistory.push(val); } setScores(newScores); saveCurrentGame(newScores); setPendingYamsDetail(null); };
  const updateGameSeason = (id, newSeason) => { const updatedHistory = gameHistory.map(g => { if (g.id !== id) return g; const currentSeasons = Array.isArray(g.seasons) ? g.seasons : (g.season && g.season !== 'Aucune' ? [g.season] : []); let newSeasons; if (currentSeasons.includes(newSeason)) { newSeasons = currentSeasons.filter(s => s !== newSeason); } else { newSeasons = [...currentSeasons, newSeason]; } return { ...g, seasons: newSeasons, season: null }; }); setGameHistory(updatedHistory); saveHistory(updatedHistory); };
  const getRank = (playerName) => { const scoresList = players.map(p => ({ name: p, score: calcTotal(p) })); scoresList.sort((a, b) => b.score - a.score); return scoresList.filter(s => s.score > (scoresList.find(x => x.name === playerName)?.score || 0)).length + 1; };
  
  return (
    <div onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEndHandler} className={'min-h-screen bg-gradient-to-br '+T.bg+' p-2 sm:p-4 md:p-6 transition-all duration-500 overflow-x-hidden'}>
      {/* MODALS */}
      {showBonusMissedModal && (
        <div className="fixed inset-0 bg-black/90 z-[210] flex items-center justify-center p-4 modal-backdrop">
            <div className="modal-content bg-gradient-to-b from-slate-900 to-slate-950 rounded-[40px] p-1 shadow-[0_0_60px_rgba(239,68,68,0.4)] relative overflow-hidden">
                <div className="bg-slate-950 rounded-[38px] p-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-red-500/20 to-transparent"></div>
                    <div className="text-6xl mb-4 animate-bounce">😭</div>
                    <h3 className="text-2xl font-black text-white uppercase text-red-500 mb-2">Oh non !</h3>
                    <p className="text-white text-lg font-bold mb-4">{showBonusMissedModal.player} a raté le bonus...</p>
                    <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl mb-6">
                        <div className="text-4xl font-black text-white">{showBonusMissedModal.score} <span className="text-sm text-gray-500">/ 63</span></div>
                    </div>
                    <button onClick={() => setShowBonusMissedModal(null)} className="bg-white/10 hover:bg-white/20 text-white w-full py-3 rounded-xl font-bold">Tant pis...</button>
                </div>
            </div>
        </div>
      )}
      {showBonusWonModal && (
        <div className="fixed inset-0 bg-black/90 z-[210] flex items-center justify-center p-4 modal-backdrop">
            <div className="modal-content bg-gradient-to-b from-green-600 to-green-900 rounded-[40px] p-1 shadow-[0_0_60px_rgba(34,197,94,0.4)] relative overflow-hidden">
                <div className="bg-slate-950 rounded-[38px] p-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-green-500/20 to-transparent"></div>
                    <div className="text-6xl mb-4" style={{animation:'trophy-float 3s ease-in-out infinite'}}>🎁</div>
                    <h3 className="text-2xl font-black text-green-400 uppercase mb-2">Félicitations !</h3>
                    <p className="text-white text-lg font-bold mb-4">{showBonusWonModal.player} débloque le bonus !</p>
                    <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-2xl mb-6">
                        <div className="text-4xl font-black text-white">{showBonusWonModal.score} <span className="text-sm text-gray-500">/ 63</span></div>
                        <div className="mt-2 text-green-400 font-bold">+35 POINTS</div>
                    </div>
                    <button onClick={() => setShowBonusWonModal(null)} className="bg-green-600 hover:bg-green-500 text-white w-full py-3 rounded-xl font-bold">Génial !</button>
                </div>
            </div>
        </div>
      )}
      
      {/* HEADER & TABS */}
      <div className="max-w-7xl mx-auto space-y-4">
        <div className={'bg-gradient-to-br '+T.card+' backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-4 sm:p-6'}>
          <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-4"><div className="text-5xl">🎲</div><div><h1 className="text-3xl font-black text-white">YAMS</h1><p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Ultimate Legacy</p></div></div>
            <div className="flex items-center gap-2">
                <div className="bg-black/30 px-3 py-1.5 rounded-xl border border-yellow-500/30 text-yellow-500 font-black text-sm flex items-center gap-2"><Star size={14} fill="currentColor"/> {globalXP} XP</div>
                <button onClick={()=>setShowSettings(!showSettings)} className="p-3 bg-white/10 rounded-2xl text-white"><Settings size={22}/></button>
            </div>
          </div>
          <div className="flex gap-2 mt-4 flex-wrap">
            <button onClick={()=>setCurrentTab('game')} className={`flex-1 min-w-[80px] py-3 rounded-xl font-bold transition-all ${currentTab==='game' ? 'text-white bg-indigo-600 shadow-lg shadow-indigo-500/20' : 'bg-white/5 text-gray-400 border border-white/10'}`}>🎮 Partie</button>
            <button onClick={()=>setCurrentTab('shop')} className={`flex-1 min-w-[80px] py-3 rounded-xl font-bold transition-all ${currentTab==='shop' ? 'text-white bg-yellow-600 shadow-lg shadow-yellow-500/20' : 'bg-white/5 text-gray-400 border border-white/10'}`}>🛍️ Boutique</button>
            <button onClick={()=>setCurrentTab('stats')} className={`flex-1 min-w-[80px] py-3 rounded-xl font-bold transition-all ${currentTab==='stats' ? 'text-white bg-indigo-600' : 'bg-white/5 text-gray-400'}`}>📊 Stats</button>
            <button onClick={()=>setCurrentTab('history')} className={`flex-1 min-w-[80px] py-3 rounded-xl font-bold transition-all ${currentTab==='history' ? 'text-white bg-indigo-600' : 'bg-white/5 text-gray-400'}`}>📜 Historique</button>
          </div>
        </div>

        {/* TAB: SHOP */}
        {currentTab==='shop' && (
            <div className="space-y-6 tab-enter">
                <div className={'bg-gradient-to-br '+T.card+' backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl '+T.glow+' p-6'}>
                    <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3"><ShoppingBag/> Boutique Exclusive</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {SHOP_ITEMS.map(item => {
                            const owned = inventory.includes(item.id) || (item.price === 0);
                            return (
                                <div key={item.id} className={`p-4 rounded-2xl border transition-all ${owned ? 'bg-green-900/20 border-green-500/30' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="text-4xl bg-white/5 p-3 rounded-2xl">{item.icon}</div>
                                            <div>
                                                <div className="text-white font-black">{item.name}</div>
                                                <div className="text-xs text-gray-400">{item.desc}</div>
                                            </div>
                                        </div>
                                        <div className="relative z-10">
                                            {owned ? (
                                                <div className="flex items-center gap-1 text-green-400 font-bold bg-green-500/10 px-3 py-1 rounded-lg border border-green-500/20"><Check size={16}/> Acquis</div>
                                            ) : (
                                                <button onClick={() => buyItem(item)} className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-4 py-2 rounded-xl shadow-lg shadow-yellow-500/20 transition-transform active:scale-95 flex items-center gap-1">
                                                    {item.cost} XP
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        )}

        {/* TAB: STATS */}
        {currentTab==='stats' && (
            <div className="space-y-6 tab-enter">
                <div className="flex justify-between items-center bg-white/5 p-4 rounded-3xl border border-white/10">
                    <h2 className="text-2xl font-black text-white">Performances</h2>
                    <select value={statsFilterSeason} onChange={e=>setStatsFilterSeason(e.target.value)} className="bg-black/30 text-white p-2 rounded-xl text-sm border border-white/10 outline-none">
                        <option value="Toutes">Toutes les Saisons</option>
                        <option value="Aucune">Hors Saison</option>
                        {seasons.map(s=><option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                {/* RADAR CHART */}
                <div className={'bg-gradient-to-br '+T.card+' backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-6'}>
                    <h3 className="text-white font-black mb-6 flex items-center gap-2"><RadarIcon size={18}/> Analyse Comparative</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {playerStats.map(p => (
                            <div key={p.name} className="flex flex-col items-center gap-4">
                                <span className="font-black text-white text-sm uppercase tracking-widest">{p.name}</span>
                                <RadarPerformance stats={p} />
                            </div>
                        ))}
                    </div>
                </div>
                {/* NOUVELLES CARTES YAMS */}
                <div className={'bg-gradient-to-br '+T.card+' backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-6'}>
                    <h3 className="text-white font-black mb-6 flex items-center gap-2"><Dices size={18}/> Chasse aux Yams</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {playerStats.map(p => (
                            <div key={p.name} className="relative bg-black/40 border border-white/10 rounded-3xl p-5 overflow-hidden group">
                                <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity"><Dices size={100}/></div>
                                <div className="flex items-center gap-4 mb-4 relative z-10">
                                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-3xl border border-white/10">{playerAvatars[p.name] || '👤'}</div>
                                    <div><div className="font-black text-white text-xl">{p.name}</div><div className="text-xs text-gray-400 font-bold uppercase tracking-widest">Total Yams: {p.yamsCount + p.hiddenYamsCount}</div></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 relative z-10">
                                    <div className="bg-yellow-500/10 p-3 rounded-2xl border border-yellow-500/20 text-center">
                                        <div className="text-yellow-500 font-black text-2xl">{p.yamsCount}</div>
                                        <div className="text-[10px] text-yellow-500/70 font-black uppercase tracking-tighter">Vrais Yams</div>
                                    </div>
                                    <div className="bg-purple-500/10 p-3 rounded-2xl border border-purple-500/20 text-center">
                                        <div className="text-purple-400 font-black text-2xl">{p.hiddenYamsCount}</div>
                                        <div className="text-[10px] text-purple-400/70 font-black uppercase tracking-tighter">Yams Cachés</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}
		
		{/* TAB: HISTORY */}
        {currentTab==='history'&&(
          <div className="space-y-4 tab-enter"><div className={'bg-gradient-to-br '+T.card+' backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl '+T.glow+' p-6'}>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4"><h2 className="text-3xl font-black text-white flex items-center gap-3"><span className="text-4xl">📜</span>Historique</h2>
            <select value={historyFilterSeason} onChange={e=>setHistoryFilterSeason(e.target.value)} className="bg-black/30 text-white p-2 rounded-xl text-sm font-bold border border-white/10 outline-none">
                <option value="Toutes">Toutes les Saisons</option>
                <option value="Aucune">Hors Saison</option>
                {seasons.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
            </div>
            <div className="space-y-3">{filteredGameHistory.map(g=><div key={g.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all backdrop-blur-sm">
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
                                </div>
                                <button onClick={() => setEditingHistoryId(g.id)} className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"><Edit3 size={12}/></button>
                            </div>
                        )}
                    </div>
                    <button onClick={()=>deleteGame(g.id)} className="p-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-all hover:scale-110"><Trash2 size={18}/></button>
                </div>
                {g.moveLog && g.moveLog.length > 1 && <GameFlowChartMini moveLog={g.moveLog} gamePlayers={g.players||g.results}/>}
                <div className="space-y-2">{(g.players||g.results).sort((a,b)=> {
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
                })}</div></div>)}</div></div>)}

        {/* TAB: GAME */}
        {currentTab==='game'&&(
          <div className="space-y-4 tab-enter">
            {speedMode && timeLeft > 0 && <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden"><div className={`h-full transition-all duration-1000 ${timeLeft<10?'bg-red-500':'bg-green-500'}`} style={{width: `${(timeLeft/30)*100}%`}}></div></div>}
            
            <div className={'bg-gradient-to-br '+T.card+' backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl '+T.glow+' p-6'}>
              <div className="flex items-center justify-between mb-6"><h2 className="text-2xl font-black text-white flex items-center gap-3"><span className="text-3xl">👥</span>Joueurs</h2><button onClick={addPlayer} disabled={players.length>=6||isGameStarted()} className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-bold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"><Plus size={20}/>Ajouter</button></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">{players.map((player,i)=>{
                  const pStats = playerStats.find(s => s.name === player);
                  return <PlayerCard key={i} player={player} index={i} onRemove={removePlayer} onNameChange={updatePlayerName} canRemove={players.length>1} gameStarted={isGameStarted()} avatar={playerAvatars[player]} onAvatarClick={openAvatarSelector} streak={pStats?.currentStreak || 0}/>
              })}</div>
              
              <div className="mt-4 p-4 bg-black/20 rounded-xl border border-white/5">
                  <h4 className="text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-2"><Target size={14}/> Missions du Jour</h4>
                  <div className="grid grid-cols-3 gap-2">
                      {activeMissions.map((m, i) => (
                          <div key={i} className="bg-white/5 p-2 rounded-lg text-center">
                              <div className="text-[10px] text-gray-300">{m.text}</div>
                              <div className="text-yellow-400 font-bold text-xs">+{m.xp} XP</div>
                          </div>
                      ))}
                  </div>
              </div>
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
      <style>{`
        @keyframes trophy-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        .modal-backdrop { animation: fadeIn 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .tab-enter { animation: slideUp 0.4s ease-out; }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
}