import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  Plus, Trash2, RotateCcw, Settings, Edit3, Check, X, Download, Share2, 
  Undo2, BookOpen, Dices, Eye, ArrowLeft, Trophy, Medal, Activity, Lock, 
  History as HistoryIcon, Timer, EyeOff, Palette, Sun, Monitor, 
  Zap, Scale, Swords, ThumbsDown, ThumbsUp, Crown, 
  ScrollText, Award, Sparkles, Flame, Coffee, Ghost, Moon, Wand2,
  TrendingUp, BarChart3, HelpCircle, AlertTriangle, Crosshair, Gift, Camera
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
const gages = ["Ranger le jeu tout seul 🧹", "Servir à boire à tout le monde 🥤", "Ne plus dire 'non' pendant 10 min 🤐", "Choisir la musique pour 1h 🎵", "Imiter une poule à chaque phrase 🐔", "Faire 10 pompes (ou squats) 💪", "Appeler le gagnant 'Mon Seigneur' 👑", "Jouer la prochaine partie les yeux fermés au lancer 🙈"];

// --- UTILS ---
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
        yams: countValues.includes(5) ? 'extreme' : 'hard', 
        largeStraight: maxConsecutive >= 4 ? 'hard' : 'medium',
        smallStraight: maxConsecutive >= 3 ? 'medium' : 'low',
        fullHouse: (countValues.includes(3)&&countValues.includes(2)) ? 'medium' : 'hard',
        fourOfKind: countValues.some(c=>c>=4) ? 'medium' : 'hard',
        threeOfKind: countValues.some(c=>c>=3) ? 'low' : 'medium'
    }
  };
};

// --- COMPOSANTS INTERNES ---
const ScoreInput = ({ value, onChange, category, isHighlighted, isLocked, isImposedDisabled, isFoggy }) => {
  if(isFoggy && isLocked) return <div className="w-full py-1 sm:py-3 text-center text-gray-500 font-black animate-pulse text-xs sm:text-lg">???</div>;
  if(isImposedDisabled) return <div className="w-full py-1 sm:py-3 text-center text-gray-700 font-bold bg-black/20 rounded-xl opacity-30 cursor-not-allowed text-xs sm:text-lg">🔒</div>;
  const cat = categories.find(c=>c.id===category);
  const vals = cat?.values || Array.from({length:31},(_,i)=>i);
  return (
    <select value={value??''} onChange={e=>onChange(e.target.value, e)} disabled={isLocked}
      className={`w-full py-1 sm:py-3 px-1 rounded-lg sm:rounded-xl font-bold text-sm sm:text-lg text-center transition-all backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50 ${isLocked?'cursor-not-allowed opacity-60 bg-white/5 text-gray-400 border border-white/10':isHighlighted?'cursor-pointer bg-gradient-to-r from-green-500/30 to-emerald-500/30 border-2 border-green-400 text-white shadow-lg shadow-green-500/50':'cursor-pointer bg-white/10 hover:bg-white/20 text-white border border-white/20'}`}
      style={isLocked||isHighlighted?{}:{background:'linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.1))',color:'white'}}>
      <option value="" style={{backgroundColor:'#1e293b',color:'white'}}>-</option>
      {vals.map(v=><option key={v} value={v} style={{backgroundColor:'#1e293b',color:'white'}}>{v}</option>)}
    </select>
  );
};

const PlayerCard = ({ player, index, onRemove, onNameChange, canRemove, gameStarted, avatar, onAvatarClick }) => {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(player);
  const save = () => { if(name.trim()){onNameChange(index,name.trim());setEditing(false);} };
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-3 sm:p-4 backdrop-blur-sm hover:bg-white/10 transition-all relative">
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        <button onClick={() => onAvatarClick(index)} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center text-lg sm:text-xl hover:bg-white/20 transition-colors shadow-inner overflow-hidden" title="Changer l'avatar">
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
        <button onClick={handleClick} className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-xl sm:text-3xl hover:translate-y-1 active:scale-95 transition-all ${s.bg} ${s.text} ${s.border} border-2 shadow-lg ${rolling ? 'animate-spin' : ''}`}>
            {['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'][value]}
        </button>
    );
};

const FloatingScore = ({ x, y, value }) => {
    return <div className="fixed pointer-events-none text-green-400 font-black text-2xl z-[100] animate-[floatUp_1s_ease-out_forwards]" style={{ left: x, top: y }}>+{value}</div>;
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
  const [floatingScores, setFloatingScores] = useState([]);
  const [versus, setVersus] = useState({p1: '', p2: '', failPlayer: 'GLOBAL'});
  const [globalXP, setGlobalXP] = useState(0);
  const [chaosMode, setChaosMode] = useState(false);
  const [activeChaosCard, setActiveChaosCard] = useState(null);
  const [showStudioModal, setShowStudioModal] = useState(false);
  const [wakeLockEnabled, setWakeLockEnabled] = useState(true);
  
  // FIX CRASH FIN DE PARTIE: Stocker les données de fin dans un état séparé (SNAPSHOT)
  const [endGameData, setEndGameData] = useState(null);

  // SWIPE
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const replayIntervalRef = useRef(null);
  const T = THEMES_CONFIG[theme];

  // SWIPE LOGIC
  const minSwipeDistance = 50;
  const onTouchStart = (e) => { setTouchEnd(null); setTouchStart(e.targetTouches[0].clientX); };
  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEndHandler = () => {
      if (!touchStart || !touchEnd) return;
      const distance = touchStart - touchEnd;
      const isLeftSwipe = distance > minSwipeDistance;
      const isRightSwipe = distance < -minSwipeDistance;
      const tabs = ['game', 'stats', 'history', 'trophies', 'rules'];
      const currentIndex = tabs.indexOf(currentTab);
      if (isLeftSwipe && currentIndex < tabs.length - 1) setCurrentTab(tabs[currentIndex + 1]);
      if (isRightSwipe && currentIndex > 0) setCurrentTab(tabs[currentIndex - 1]);
  };

  // WAKE LOCK LOGIC
  useEffect(() => {
    let wakeLock = null;
    const requestWakeLock = async () => {
        if (typeof navigator !== 'undefined' && 'wakeLock' in navigator && wakeLockEnabled) {
            try {
                wakeLock = await navigator.wakeLock.request('screen');
            } catch (err) { console.log(err); }
        }
    };
    if (wakeLockEnabled) requestWakeLock();
    const handleVisibilityChange = () => { if (wakeLock !== null && document.visibilityState === 'visible' && wakeLockEnabled) requestWakeLock(); };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => { if (wakeLock !== null) wakeLock.release(); document.removeEventListener('visibilitychange', handleVisibilityChange); };
  }, [wakeLockEnabled]);

  useEffect(()=>{loadHistory();loadCurrentGame();loadSavedPlayers();loadGlobalStats();},[]);
  const loadHistory=()=>{try{const r=localStorage.getItem('yamsHistory');if(r)setGameHistory(JSON.parse(r));}catch(e){}};
  const saveHistory=(h)=>{try{localStorage.setItem('yamsHistory',JSON.stringify(h));}catch(e){}};
  const loadGlobalStats=()=>{try{const xp=localStorage.getItem('yamsGlobalXP');if(xp)setGlobalXP(parseInt(xp));}catch(e){}};
  const saveCurrentGame=(sc)=>{try{localStorage.setItem('yamsCurrentGame',JSON.stringify({players,scores:sc,lastPlayerToPlay,lastModifiedCell,starterName,timestamp:Date.now(), imposedOrder, fogMode, speedMode, jokers, jokerMax, jokersEnabled, diceSkin, moveLog, chaosMode, activeChaosCard, wakeLockEnabled}));}catch(e){}};
  const loadCurrentGame=()=>{try{const r=localStorage.getItem('yamsCurrentGame');if(r){const d=JSON.parse(r);if(d.players&&d.scores){setPlayers(d.players);setScores(d.scores);setLastPlayerToPlay(d.lastPlayerToPlay||null);setLastModifiedCell(d.lastModifiedCell||null);setStarterName(d.starterName || d.players[0]); setImposedOrder(d.imposedOrder||false); setFogMode(d.fogMode||false); setSpeedMode(d.speedMode||false); setJokers(d.jokers||{}); setJokerMax(d.jokerMax!==undefined?d.jokerMax:2); setJokersEnabled(d.jokersEnabled!==undefined?d.jokersEnabled:false); setDiceSkin(d.diceSkin||'classic'); setMoveLog(d.moveLog||[]); setChaosMode(d.chaosMode||false); setActiveChaosCard(d.activeChaosCard||null);
  setWakeLockEnabled(d.wakeLockEnabled !== undefined ? d.wakeLockEnabled : true);}}}catch(e){}};
  const loadSavedPlayers=()=>{try{const r=localStorage.getItem('yamsSavedPlayers');const av=localStorage.getItem('yamsPlayerAvatars');if(r)setPlayers(JSON.parse(r));if(av)setPlayerAvatars(JSON.parse(av));}catch(e){}};
  
  useEffect(() => { if(!isGameStarted()) { const newJokers = {}; players.forEach(p => newJokers[p] = jokerMax); setJokers(newJokers); } }, [jokerMax, players]);
  useEffect(() => { if(players.length > 0) { localStorage.setItem('yamsSavedPlayers', JSON.stringify(players)); if (!starterName) setStarterName(players[0]); if(!simPlayer) setSimPlayer(players[0]); const newJokers = {...jokers}; let changed = false; players.forEach(p => { if(newJokers[p] === undefined) { newJokers[p] = jokerMax; changed=true; } }); if(changed) setJokers(newJokers); } }, [players, jokerMax]);
  useEffect(() => { localStorage.setItem('yamsPlayerAvatars', JSON.stringify(playerAvatars)); }, [playerAvatars]);
  useEffect(() => { localStorage.setItem('yamsGlobalXP', globalXP.toString()); }, [globalXP]);
  useEffect(() => { let interval; if(speedMode && isGameStarted() && !isGameComplete() && !editMode) { if(timeLeft > 0) { interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000); } } return () => clearInterval(interval); }, [speedMode, timeLeft, scores, editMode]);
  useEffect(() => { setTimeLeft(30); }, [lastPlayerToPlay]);

  const isGameStarted=()=>Object.keys(scores).some(p=>scores[p]&&Object.keys(scores[p]).length>0);
  const addPlayer=()=>{if(players.length<6&&!isGameStarted())setPlayers([...players,`Joueur ${players.length+1}`]);};
  const removePlayer=i=>{if(players.length>1&&!isGameStarted()){const rem=players[i];const np=[...players];np.splice(i,1);setPlayers(np);const ns={...scores};delete ns[rem];setScores(ns);}};
  const updatePlayerName=(i,name)=>{const old=players[i];const np=[...players];np[i]=name;setPlayers(np);if(scores[old]){const ns={...scores};ns[name]=ns[old];delete ns[old];setScores(ns);}};
  const openAvatarSelector = (index) => { setAvatarSelectorIndex(index); setShowAvatarModal(true); };
  const selectAvatar = (icon) => { const p = players[avatarSelectorIndex]; setPlayerAvatars({...playerAvatars, [p]: icon}); setShowAvatarModal(false); };

  const calcUpper= (p, sc=scores) => { if (!p || !sc[p]) return 0; return categories.filter(c=>c.upper).reduce((s,c)=>s+(sc[p]?.[c.id]||0),0); };
  const getBonus= (p, sc=scores) => calcUpper(p, sc)>=63?35:0;
  const calcUpperGrand= (p, sc=scores) => calcUpper(p, sc)+getBonus(p, sc);
  const calcLower= (p, sc=scores) => { if (!p || !sc[p]) return 0; return categories.filter(c=>c.lower).reduce((s,c)=>s+(sc[p]?.[c.id]||0),0); };
  const calcTotal= (p, sc=scores) => { if (!p) return 0; let total = calcUpperGrand(p, sc)+calcLower(p, sc); if(jokersEnabled) { const usedJokers = jokerMax - (jokers[p] !== undefined ? jokers[p] : jokerMax); if(usedJokers > 0) total -= (usedJokers * 10); } return total; };
  const getPlayerTotals = (p, sc=scores) => ({ upper: calcUpper(p, sc), bonus: getBonus(p, sc), lower: calcLower(p, sc), total: calcTotal(p, sc) });
  
  // NOUVELLE FONCTION CALCUL BONUS DIFF
  const calculateBonusDiff = (p) => {
    const targets = { ones: 3, twos: 6, threes: 9, fours: 12, fives: 15, sixes: 18 };
    let current = 0;
    let expected = 0;
    ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'].forEach(id => {
        if(scores[p]?.[id] !== undefined) {
            current += scores[p][id];
            expected += targets[id];
        }
    });
    return current - expected;
  };

  // CALCUL VRAIES STATS D'ECHEC
  const calculateGlobalFailures = (target) => {
    const failures = {};
    playableCats.forEach(cat => failures[cat.id] = 0);
    let totalGames = 0;

    if (!gameHistory || gameHistory.length === 0) return { failures: [], totalGames: 0 };

    gameHistory.forEach(game => {
        const participants = game.players || game.results || [];
        const grid = game.grid || {};
        
        participants.forEach(p => {
            // Si GLOBAL, on prend tout le monde, sinon on filtre par nom
            if (target === 'GLOBAL' || p.name === target) {
                const playerGrid = grid[p.name];
                if (playerGrid) {
                    totalGames++;
                    Object.keys(failures).forEach(catId => {
                        if (playerGrid[catId] === 0) {
                            failures[catId]++;
                        }
                    });
                }
            }
        });
    });

    const sortedFailures = Object.entries(failures)
        .sort(([,a], [,b]) => b - a) // Tri décroissant
        .map(([key, value]) => ({ 
            id: key, 
            name: categories.find(c => c.id === key)?.name || key, 
            count: value,
            rate: totalGames > 0 ? Math.round((value / totalGames) * 100) : 0
        }));

    return { failures: sortedFailures, totalGames: Math.max(1, totalGames) };
  };

  const getEmptyCells=p=>{if(!p)return[];return playableCats.map(c=>c.id).filter(id=>scores[p]?.[id]===undefined);};
  const getWinner=()=>{if(!players.length)return[];const max=Math.max(...players.map(p=>calcTotal(p)));return players.filter(p=>calcTotal(p)===max);};
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
    if(category==='yams'&&value==='50'){setConfetti('gold');setShakeAnimation('yams');setShowAchievementNotif({icon:'🎲',title:'YAMS !',description:player+' a réalisé un YAMS !'}); setTimeout(()=>{setShowAchievementNotif(null);setConfetti(null);setShakeAnimation(null);},4000);} else if(value==='0') {setConfetti('sad'); setTimeout(()=>setConfetti(null), 4000); } else { setConfetti(null); }
    const oldUp=calcUpper(player);const newUp=categories.filter(c=>c.upper).reduce((s,c)=>s+(ns[player]?.[c.id]||0),0);
    if(oldUp<63&&newUp>=63){setConfetti('bonus');setShowAchievementNotif({icon:'🎁',title:'Bonus Obtenu !',description:player+' a débloqué le bonus de 35 points !'}); setTimeout(()=>{setShowAchievementNotif(null);setConfetti(null);},4000);}
    const newTotal=newUp + categories.filter(c=>c.lower).reduce((s,c)=>s+(ns[player]?.[c.id]||0),0)+(newUp>=63?35:0);
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

  const toggleEditMode=()=>{if(!editMode){setScoresBeforeEdit(JSON.parse(JSON.stringify(scores)));setLastPlayerBeforeEdit(lastPlayerToPlay);setEditMode(true);}else{setEditMode(false);setScoresBeforeEdit(null);setLastPlayerBeforeEdit(null);}};
  const cancelEdit=()=>{if(scoresBeforeEdit!==null){setScores(scoresBeforeEdit);setLastPlayerToPlay(lastPlayerBeforeEdit);}setEditMode(false);setScoresBeforeEdit(null);setLastPlayerBeforeEdit(null);};
  const resetGame = (forcedLoserName = null) => { 
      if(!forcedLoserName && !window.confirm("Commencer une nouvelle partie ?")) return; 
      setScores({}); setLastPlayerToPlay(null); setLastModifiedCell(null); setShowEndGameModal(false); setMoveLog([]); setActiveChaosCard(null); setShowStudioModal(false); setEndGameData(null);
      const newJokers = {}; players.forEach(p => newJokers[p] = jokerMax); setJokers(newJokers); 
      if(forcedLoserName && players.includes(forcedLoserName)) { setStarterName(forcedLoserName); } 
      else { const currentStarterIdx = players.indexOf(starterName); const nextStarter = players[(currentStarterIdx + 1) % players.length]; setStarterName(nextStarter); }
      // CHAOS MODE START ACTION FOR 1ST PLAYER
      if(chaosMode) { setActiveChaosCard(CHAOS_EVENTS[Math.floor(Math.random() * CHAOS_EVENTS.length)]); }
      saveCurrentGame({});
  };

  // EFFET DE FIN DE PARTIE - SAFE SNAPSHOT
  useEffect(()=>{
      if(isGameComplete() && !showEndGameModal && !endGameData) {
          const winners = getWinner();
          const loser = getLoser();
          if (winners && winners.length > 0) {
             const winnerName = winners[0];
             // ON SAUVEGARDE UN SNAPSHOT (IMAGE) DES DONNEES
             setEndGameData({
                 winner: winnerName,
                 score: calcTotal(winnerName),
                 hasYams: scores[winnerName]?.yams === 50,
                 loser: loser ? loser.name : null
             });
             setShowVictoryAnimation(true);
             setConfetti('gold');
             setTimeout(()=>{
                 setShowVictoryAnimation(false);
                 setShowEndGameModal(true);
                 setConfetti(null);
             }, 2000);
          }
      }
  }, [scores, showEndGameModal, endGameData]);

  useEffect(() => { if (showEndGameModal && !currentGage) { setCurrentGage(gages[Math.floor(Math.random() * gages.length)]); } else if (!showEndGameModal) { setCurrentGage(null); } }, [showEndGameModal]);
  
  const saveGameFromModal=()=>{ 
      if (!endGameData) return;
      const game={id:Date.now(),date:new Date().toLocaleDateString('fr-FR'),time:new Date().toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}),players:players.map(p=>({name:p,score:calcTotal(p),isWinner:p===endGameData.winner,yamsCount:scores[p]?.yams===50?1:0})), grid: JSON.parse(JSON.stringify(scores)), moveLog: JSON.parse(JSON.stringify(moveLog))}; 
      const nh=[game,...gameHistory]; setGameHistory(nh); saveHistory(nh); 
      setGlobalXP(prev => prev + 100);
      resetGame(endGameData.loser); 
  };
  const deleteGame= id=>{const nh=gameHistory.filter(g=>g.id!==id);setGameHistory(nh);saveHistory(nh);};
  const shareScore=async()=>{const t='Partie YAMS terminée ! Gagnant: '+(endGameData?.winner || "?")+' avec '+(endGameData?.score || "?")+' points';if(typeof navigator!=='undefined'&&navigator.share){try{await navigator.share({text:t});}catch(e){if(typeof navigator!=='undefined')navigator.clipboard.writeText(t);alert('Score copié!');}}else{if(typeof navigator!=='undefined')navigator.clipboard.writeText(t);alert('Score copié!');}};
  const exportData=()=>{const b=new Blob([JSON.stringify({gameHistory,exportDate:new Date().toISOString(),version:'1.0'},null,2)],{type:'application/json'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='yams-backup-'+new Date().toISOString().split('T')[0]+'.json';document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(u);};
  const importData=e=>{const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=ev=>{try{const d=JSON.parse(ev.target.result);if(d.gameHistory&&Array.isArray(d.gameHistory)){setGameHistory(d.gameHistory);saveHistory(d.gameHistory);alert('Parties importées avec succès!');}else alert('Fichier invalide');}catch(err){alert('Erreur lors de l\'import');}};reader.readAsText(file);};

  const playerStats = useMemo(() => { if (!gameHistory || !Array.isArray(gameHistory)) return []; const stats = {}; const streaks = {}; const isStreaking = {}; const allPlayerNames = new Set(); gameHistory.forEach(g => g.players.forEach(p => allPlayerNames.add(p.name))); allPlayerNames.forEach(name => { stats[name] = { wins:0, games:0, maxScore:0, totalScore:0, yamsCount:0, maxConsecutiveWins:0, bonusCount:0, upperSum:0, lowerSum:0, historyGames:0 }; streaks[name] = 0; isStreaking[name] = true; }); gameHistory.forEach((game) => { const participants = game.players || game.results || []; const gameGrid = game.grid || {}; participants.forEach(p => { if(!stats[p.name]) return; const s = stats[p.name]; s.games++; if(p.isWinner) s.wins++; if(p.score > s.maxScore) s.maxScore = p.score; s.totalScore += p.score; s.yamsCount += p.yamsCount || 0; if(gameGrid[p.name]) { s.historyGames++; 
    let currentUpperSum = 0;
    categories.filter(c => c.upper).forEach(cat => { const val = gameGrid[p.name][cat.id]; if (val !== undefined && val !== "") { currentUpperSum += parseInt(val); } });
    if (currentUpperSum >= 63) { s.bonusCount++; }
    const totals = getPlayerTotals(p.name, gameGrid); s.upperSum += totals.upper; s.lowerSum += totals.lower; } if (isStreaking[p.name]) { if (p.isWinner) streaks[p.name]++; else isStreaking[p.name] = false; } }); }); const tempStreaks = {}; allPlayerNames.forEach(n => tempStreaks[n] = 0); for(let i=gameHistory.length-1; i>=0; i--){ const game = gameHistory[i]; const participants = game.players || []; participants.forEach(p => { if(p.isWinner) { tempStreaks[p.name] = (tempStreaks[p.name] || 0) + 1; if(tempStreaks[p.name] > stats[p.name].maxConsecutiveWins) stats[p.name].maxConsecutiveWins = tempStreaks[p.name]; } else { tempStreaks[p.name] = 0; } }); } return Object.entries(stats).map(([name,d])=>({ name, ...d, avgScore: Math.round(d.totalScore/d.games), currentStreak: streaks[name], bonusRate: d.historyGames > 0 ? Math.round((d.bonusCount/d.historyGames)*100) : 0, avgUpper: d.historyGames > 0 ? Math.round(d.upperSum/d.historyGames) : 0, avgLower: d.historyGames > 0 ? Math.round(d.lowerSum/d.historyGames) : 0 })).sort((a,b)=>b.wins-a.wins); }, [gameHistory]);
  const hallOfFame = useMemo(() => { if(gameHistory.length < 2) return null; let biggestWin = { gap: -1 }; let tightestWin = { gap: 9999 }; let lowestWinner = { score: 9999 }; let highestLoser = { score: -1 }; gameHistory.forEach(g => { const parts = (g.players || g.results).sort((a,b) => b.score - a.score); if(parts.length < 2) return; const winner = parts[0]; const second = parts[1]; const gap = winner.score - second.score; if(gap > biggestWin.gap) biggestWin = { gap, winner: winner.name, second: second.name, date: g.date }; if(gap < tightestWin.gap) tightestWin = { gap, winner: winner.name, second: second.name, date: g.date }; if(winner.score < lowestWinner.score) lowestWinner = { score: winner.score, name: winner.name, date: g.date }; if(second.score > highestLoser.score) highestLoser = { score: second.score, name: second.name, date: g.date }; }); return { biggestWin, tightestWin, lowestWinner, highestLoser }; }, [gameHistory]);
  const getPieData = () => playerStats.filter(s=>s.wins>0).map(s=>({name:s.name,value:s.wins}));
  const isFoggy = (p) => fogMode && !isGameComplete() && getNextPlayer() !== p;
  const getLeader = () => { if(isGameComplete() || hideTotals || fogMode) return null; const totals = players.map(p => ({name: p, score: calcTotal(p)})); const max = Math.max(...totals.map(t => t.score)); if(max === 0) return null; const leaders = totals.filter(t => t.score === max); if (leaders.length > 1) return null; return leaders[0].name; };
  const leader = getLeader();
  const getTensionColor = () => { if(players.length < 2) return 'bg-gray-800'; const totals = players.map(p => calcTotal(p)).sort((a,b)=>b-a); const diff = totals[0] - totals[1]; if(diff < 20) return 'bg-gradient-to-r from-red-600 via-red-500 to-red-600 animate-pulse'; if(diff < 50) return 'bg-gradient-to-r from-yellow-500 to-orange-500'; return 'bg-gradient-to-r from-blue-500 to-cyan-500'; };
  
  // TIMELAPSE
  const stopPlayback = () => { if (replayIntervalRef.current) clearInterval(replayIntervalRef.current); setIsReplaying(false); setReplayGame(null); };
  const playTimelapse = () => { if(!replayGame || !replayGame.moveLog) return; setIsReplaying(true); const log = replayGame.moveLog; const tempScores = {}; players.forEach(p => tempScores[p] = {}); let step = 0; replayIntervalRef.current = setInterval(() => { if(step >= log.length) { clearInterval(replayIntervalRef.current); setIsReplaying(false); return; } const move = log[step]; tempScores[move.player] = { ...tempScores[move.player], [categories.find(c=>c.name===move.category)?.id || move.category.toLowerCase()]: parseInt(move.value) }; setReplayGame(prev => ({...prev, grid: JSON.parse(JSON.stringify(tempScores))})); step++; }, 500); };
  
  // QUICK EDIT (Fin de partie)
  const quickEdit = () => { setShowEndGameModal(false); setEditMode(true); setScoresBeforeEdit(JSON.parse(JSON.stringify(scores))); setLastPlayerBeforeEdit(lastPlayerToPlay); };

  if(replayGame) { const replayPlayers = Object.keys(replayGame.grid || {}); return ( <div className={'min-h-screen bg-gradient-to-br '+T.bg+' p-2 sm:p-4 md:p-6'}> <div className="max-w-7xl mx-auto space-y-4"> <div className={'bg-gradient-to-br '+T.card+' backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-6 flex justify-between items-center'}> <div className="flex items-center gap-4"> <button onClick={stopPlayback} className="p-2 bg-white/10 rounded-full hover:bg-white/20"><ArrowLeft /></button> <div><h2 className="text-xl font-bold text-white">Replay du {replayGame.date}</h2><p className="text-sm text-gray-400">Lecture seule</p></div> </div> {replayGame.moveLog && <button onClick={playTimelapse} disabled={isReplaying} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2">{isReplaying ? <Pause size={18}/> : <Play size={18}/>} Timelapse</button>} </div> <div className={'bg-gradient-to-br '+T.card+' backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-4 overflow-x-auto'}> <table className="w-full table-fixed"> <thead><tr className="border-b border-white/20"><th className="text-left p-3 text-white">Catégorie</th>{replayPlayers.map(p=><th key={p} className="p-3 text-center text-white">{p}</th>)}</tr></thead> <tbody>{categories.map(cat => {if(cat.upperHeader || cat.upperDivider || cat.divider) return null;if(cat.upperTotal || cat.bonus || cat.upperGrandTotal || cat.lowerTotal) return null;return (<tr key={cat.id} className="border-b border-white/10 hover:bg-white/5"><td className="p-3 text-gray-300 font-bold">{cat.name}</td>{replayPlayers.map(p => (<td key={p} className="p-2 text-center font-bold text-white">{replayGame.grid[p]?.[cat.id] !== undefined ? replayGame.grid[p][cat.id] : '-'}</td>))}</tr>);})}<tr className="bg-white/10 font-black"><td className="p-4 text-white">TOTAL</td>{replayPlayers.map(p=><td key={p} className="p-4 text-center text-white text-xl">{getPlayerTotals(p, replayGame.grid).total}</td>)}</tr></tbody> </table> </div> </div> </div> ); }

  return (
    <div onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEndHandler} className={'min-h-screen bg-gradient-to-br '+T.bg+' p-2 sm:p-4 md:p-6 transition-all duration-500 overflow-x-hidden'}>
      {floatingScores.map(fs => <FloatingScore key={fs.id} x={fs.x} y={fs.y} value={fs.value} />)}
      {confetti&&<div className="fixed inset-0 pointer-events-none z-50">{[...Array(50)].map((_,i)=><div key={i} className="absolute" style={{left:Math.random()*100+'%',top:'-20px',animation:`fall ${2+Math.random()*3}s linear infinite`,animationDelay:Math.random()*2+'s',fontSize:'24px',opacity:0.8}}>{confetti==='gold'?['🎉','🎊','⭐','✨','🎯','🏆'][Math.floor(Math.random()*6)]:[ '💸','💵','💰','🤑'][Math.floor(Math.random()*4)]}</div>)}</div>}
      {confetti==='sad'&&<div className="fixed inset-0 pointer-events-none z-50">{[...Array(30)].map((_,i)=><div key={i} className="absolute text-2xl" style={{left:Math.random()*100+'%',top:'-20px',animation:`fall ${2+Math.random()*3}s linear infinite`,animationDelay:Math.random()*2+'s',opacity:0.5}}>🌧️</div>)}</div>}
      <style>{`@keyframes fall{to{transform:translateY(100vh) rotate(360deg);opacity:0;}}@keyframes shake{0%,100%{transform:translateX(0)}10%,30%,50%,70%,90%{transform:translateX(-10px)}20%,40%,60%,80%{transform:translateX(10px)}}.shake-animation{animation:shake 0.5s ease-in-out;}@keyframes slideInRight{from{transform:translateX(400px);opacity:0}to{transform:translateX(0);opacity:1}}.slide-in-right{animation:slideInRight 0.5s ease-out;}@keyframes slideIn{from{transform:translateX(30px);opacity:0}to{transform:translateX(0);opacity:1}}.tab-enter{animation:slideIn 0.4s ease-out;} @keyframes floatUp { 0% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(-50px); opacity: 0; } }`}</style>
      {showAchievementNotif&&<div className="fixed top-20 right-4 z-50 slide-in-right"><div className={'bg-gradient-to-r px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border-2 max-w-sm '+(shakeAnimation?'shake-animation ':'')+( showAchievementNotif.icon==='🎲'?'from-yellow-500 to-orange-500 border-yellow-300':showAchievementNotif.icon==='🎁'?'from-green-500 to-emerald-500 border-green-300':'from-purple-500 to-pink-500 border-purple-300')}><div className="flex items-center gap-3"><span className="text-5xl animate-bounce">{showAchievementNotif.icon}</span><div className="text-white"><div className="text-xs font-bold uppercase">🎉 {showAchievementNotif.icon==='🎲'?'Exploit !':showAchievementNotif.icon==='🎁'?'Succès !':'Incroyable !'}</div><div className="font-black text-xl">{showAchievementNotif.title}</div><div className="text-sm opacity-90">{showAchievementNotif.description}</div></div></div></div></div>}
      {showVictoryAnimation&&<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-pulse"><div className="text-center"><div className="text-9xl mb-8 animate-bounce">🏆</div><div className="text-6xl font-black text-white mb-4 animate-pulse">PARTIE TERMINÉE !</div><div className="text-3xl font-bold" style={{color:T.primary}}>{endGameData?.winner || "?"}</div></div></div>}
      {showTurnWarning&&<div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-bounce"><div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-2xl shadow-2xl backdrop-blur-xl border border-white/20 flex items-center gap-3"><span className="text-2xl">🚫</span><span className="font-semibold">{showTurnWarning}</span></div></div>}

      {/* STUDIO PHOTO MODAL */}
      {showStudioModal && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-[120] p-4">
              <div className="bg-gradient-to-b from-gray-900 to-black p-8 rounded-3xl text-center max-w-sm w-full border-4 border-white/10 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                  <div className="flex justify-center mb-4"><div className="p-4 bg-white/5 rounded-full border border-white/10"><Crown size={48} className="text-yellow-400"/></div></div>
                  <h2 className="text-3xl font-black text-white mb-1 uppercase tracking-widest">Vainqueur</h2>
                  <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-6">{getWinner()[0] || "..."}</div>
                  
                  <div className="space-y-3 mb-8">
                    {players.map(p => (
                        <div key={p} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                            <span className="font-bold text-gray-300">{p}</span>
                            <span className="font-black text-white text-xl">{calcTotal(p)} pts</span>
                        </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 mb-6 opacity-50">
                      <Dices size={16} className="text-white"/>
                      <span className="text-white font-bold tracking-widest text-xs">YAMS ULTIMATE LEGACY</span>
                  </div>
                  
                  <button onClick={()=>setShowStudioModal(false)} className="bg-white text-black w-full py-4 rounded-xl font-black hover:scale-105 transition-transform">FERMER LE STUDIO</button>
              </div>
          </div>
      )}

      {showAvatarModal && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[60] p-4">
              <div className={'bg-gradient-to-br '+T.card+' border border-white/10 rounded-3xl p-6 max-w-md w-full'}>
                  <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-black text-white">Choisir un Avatar</h3><button onClick={()=>setShowAvatarModal(false)}><X/></button></div>
                  <div className="grid grid-cols-4 gap-3">
                      {AVATAR_LIST.map((av, i) => {
                          const player = players[avatarSelectorIndex];
                          const stats = playerStats.find(s => s.name === player);
                          const locked = isAvatarLocked(av.req, stats);
                          return (
                              <button key={i} onClick={() => !locked && selectAvatar(av.icon)} disabled={locked} className={`relative aspect-square rounded-2xl flex items-center justify-center text-3xl transition-all ${locked ? 'bg-white/10 opacity-50 cursor-not-allowed' : 'bg-white/10 hover:bg-white/20 hover:scale-110 cursor-pointer'}`}>
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
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-4">
            <button onClick={handleUndo} className="bg-white text-red-500 px-6 py-3 rounded-full font-black shadow-2xl border-4 border-red-500 flex items-center gap-2 hover:scale-105 transition-transform">
                <Undo2 size={24} strokeWidth={3} /> OUPS ! ANNULER
            </button>
        </div>
      )}

      {/* END GAME MODAL - SAFE MODE - UTILISE endGameData FIGÉ */}
      {showEndGameModal && endGameData && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-sm relative group">
            {/* EFFET GLOW DORE */}
            <div className="absolute -inset-0.5 bg-yellow-500 rounded-[30px] opacity-75 blur-lg group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
            
            <div className="relative bg-slate-900 rounded-[30px] border-2 border-yellow-500 overflow-hidden shadow-2xl">
                {/* HEAD */}
                <div className="bg-gradient-to-b from-yellow-500/20 to-transparent p-6 text-center">
                    <Trophy className="mx-auto text-yellow-500 mb-4 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" size={64} strokeWidth={1.5} />
                    <h2 className="text-yellow-500 font-bold tracking-[0.2em] text-xs uppercase mb-2">THE WINNER IS</h2>
                    <div className="text-4xl font-black text-white uppercase tracking-tight drop-shadow-md">{endGameData.winner}</div>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-2 gap-3 px-6 mb-6">
                    <div className="bg-slate-800 p-4 rounded-2xl text-center border border-white/5">
                        <div className="text-3xl font-black text-white mb-1">{endGameData.score}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">POINTS</div>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-2xl text-center border border-white/5">
                        <div className="text-3xl font-black text-white mb-1">{endGameData.hasYams ? "1" : "0"}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">YAMS</div>
                    </div>
                </div>

                {/* GAGE */}
                {players.length > 1 && endGameData.loser && (
                    <div className="px-6 mb-6">
                        <div className="bg-red-900/30 border border-red-500/30 p-4 rounded-2xl text-center">
                            <p className="text-[10px] uppercase font-bold text-red-400 mb-2">Gage pour {endGameData.loser}</p>
                            <p className="text-sm italic text-white font-medium">"{currentGage}"</p>
                        </div>
                    </div>
                )}

                {/* ACTIONS */}
                <div className="px-6 pb-6 space-y-3">
                    <button onClick={saveGameFromModal} className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-black text-sm uppercase tracking-widest rounded-2xl shadow-lg transform transition active:scale-95">ENREGISTRER</button>
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={shareScore} className="py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase rounded-xl flex items-center justify-center gap-2 border border-white/10"><Share2 size={16}/> PARTAGER</button>
                        <button onClick={()=>setShowStudioModal(true)} className="py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase rounded-xl flex items-center justify-center gap-2 border border-white/10"><Camera size={16}/> STUDIO</button>
                    </div>
                    <button onClick={quickEdit} className="w-full py-2 text-gray-500 font-bold text-[10px] uppercase tracking-widest hover:text-white transition-colors">Modifier la grille</button>
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
            <div className="flex items-center gap-4"><div className="text-5xl">🎲</div><div><h1 className="text-3xl sm:text-4xl font-black text-white bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">YAMS</h1>
            <p className="text-sm text-gray-400">Score keeper premium</p>
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
              </div></div></div>}
          
          <div className="flex gap-2 mt-4 flex-wrap">
            <button onClick={()=>setCurrentTab('game')} className={'flex-1 min-w-[80px] py-3 rounded-xl font-bold transition-all '+(currentTab==='game'?'text-white shadow-xl '+T.glow:'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10')} style={currentTab==='game'?{background:'linear-gradient(135deg,'+T.primary+','+T.secondary+')'}:{}}>🎮 Partie</button>
            <button onClick={()=>setCurrentTab('rules')} className={'flex-1 min-w-[80px] py-3 rounded-xl font-bold transition-all '+(currentTab==='rules'?'text-white shadow-xl '+T.glow:'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10')} style={currentTab==='rules'?{background:'linear-gradient(135deg,'+T.primary+','+T.secondary+')'}:{}}>🎲 Règles & Aide</button>
            <button onClick={()=>setCurrentTab('trophies')} className={'flex-1 min-w-[80px] py-3 rounded-xl font-bold transition-all '+(currentTab==='trophies'?'text-white shadow-xl '+T.glow:'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10')} style={currentTab==='trophies'?{background:'linear-gradient(135deg,'+T.primary+','+T.secondary+')'}:{}}>🏆 Carrière</button>
            <button onClick={()=>setCurrentTab('history')} className={'flex-1 min-w-[80px] py-3 rounded-xl font-bold transition-all '+(currentTab==='history'?'text-white shadow-xl '+T.glow:'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10')} style={currentTab==='history'?{background:'linear-gradient(135deg,'+T.primary+','+T.secondary+')'}:{}}>📜 Historique</button>
            <button onClick={()=>setCurrentTab('stats')} className={'flex-1 min-w-[80px] py-3 rounded-xl font-bold transition-all '+(currentTab==='stats'?'text-white shadow-xl '+T.glow:'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10')} style={currentTab==='stats'?{background:'linear-gradient(135deg,'+T.primary+','+T.secondary+')'}:{}}>📊 Stats</button>
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

        {/* CHAOS CARD DISPLAY */}
        {chaosMode && activeChaosCard && !isGameComplete() && (
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 p-4 rounded-3xl shadow-lg border-2 border-pink-400 animate-in slide-in-from-top-2">
                <div className="flex items-center gap-4">
                    <div className="text-4xl bg-white/20 p-2 rounded-xl">{activeChaosCard.icon}</div>
                    <div>
                        <div className="text-xs font-bold text-pink-200 uppercase tracking-widest">ÉVÉNEMENT CHAOS</div>
                        <div className="text-xl font-black text-white">{activeChaosCard.title}</div>
                        <div className="text-sm text-white/90">{activeChaosCard.desc}</div>
                    </div>
                </div>
            </div>
        )}

        {/* TAB: RULES & HELP */}
        {currentTab === 'rules' && (
            <div className="space-y-4 tab-enter">
                <div className={'bg-gradient-to-br '+T.card+' backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl '+T.glow+' p-6'}>
                    <h2 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-wider mb-6"><BookOpen/> Règles Officielles</h2>
                    <div className="space-y-4 text-gray-300 text-sm">
                        <div className="bg-white/5 p-4 rounded-2xl"><h3 className="font-bold text-white mb-1">🎯 Objectif</h3><p>Marquer le plus de points en réalisant des combinaisons. Le perdant de la partie précédente commence la suivante !</p></div>
                        <div className="bg-white/5 p-4 rounded-2xl"><h3 className="font-bold text-white mb-1">🎁 Bonus 35 points</h3><p>Si la somme de la partie supérieure (As à Six) fait <strong>63 points ou plus</strong>.</p></div>
                    </div>
                </div>

                <div className={'bg-gradient-to-br '+T.card+' backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl '+T.glow+' p-6'}>
                    <h2 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-wider mb-6"><Dices/> Simulateur Intelligent</h2>
                    <div className="mb-4">
                        <label className="text-gray-400 text-xs font-bold uppercase block mb-2">Simuler pour :</label>
                        <select value={simPlayer || ''} onChange={(e) => setSimPlayer(e.target.value)} className="w-full bg-[#1e293b] text-white p-3 rounded-xl font-bold border border-white/20">
                            {players.map(p => <option key={p} value={p} className="bg-[#1e293b] text-white">{p}</option>)}
                        </select>
                    </div>
                    <div className="flex justify-center gap-3 mb-6">
                        {simDice.map((val, i) => (
                            <VisualDie key={i} value={val} onClick={() => { const newD = [...simDice]; newD[i] = newD[i] === 6 ? 1 : newD[i] + 1; setSimDice(newD); }} skin={diceSkin} />
                        ))}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        {Object.entries(calculateSimulatedScores(simDice).scores).map(([key, score]) => {
                            const cat = categories.find(c => c.id === key);
                            const difficulty = calculateSimulatedScores(simDice).difficulty[key];
                            if (!cat) return null;
                            const isTaken = scores[simPlayer]?.[cat.id] !== undefined;
                            const existingScore = scores[simPlayer]?.[cat.id];
                            if(isTaken) return <div key={key} className="p-2 rounded-xl border border-white/5 bg-black/20 opacity-50 flex flex-col items-center justify-center text-center"><div className="font-bold text-gray-500">{cat.name}</div><div className="text-gray-600 font-bold">Déjà fait ({existingScore})</div></div>;
                            const isGood = score > 0;
                            return <div key={key} className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center ${isGood ? 'bg-green-500/20 border-green-500/50' : 'bg-white/5 border-white/10'}`}>
                                <div className="font-bold text-white">{cat.name}</div>
                                <div className={`text-lg font-black ${isGood ? 'text-green-400' : 'text-gray-500'}`}>{score}</div>
                                {isGood && difficulty && <div className={`w-full h-1 mt-1 rounded-full ${difficulty==='low'?'bg-green-500':difficulty==='medium'?'bg-yellow-500':difficulty==='hard'?'bg-orange-500':'bg-red-500'}`}></div>}
                            </div>;
                        })}
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
              {!editMode&&<div className="mb-4 p-4 bg-blue-500/10 border border-blue-400/30 rounded-2xl backdrop-blur-sm"><div className="flex items-center gap-3"><span className="text-2xl">🔒</span><span className="text-blue-300 font-semibold text-sm">Les valeurs saisies sont verrouillées. Cliquez sur "Éditer" pour les modifier.</span></div></div>}
              {/* PANNEAU INFORMATION JOUEUR */}
              {!editMode && !isGameComplete() && (
                  <div className="mb-4 p-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-2 border-green-400 rounded-2xl shadow-xl shadow-green-500/20">
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                          <div className="flex items-center gap-3">
                              <span className="text-2xl">🎯</span>
                              <div>
                                  <div className="text-white font-bold">Prochain joueur: <span className="text-green-400 text-xl font-black">{getNextPlayer()}</span></div>
                                  {getEmptyCells(getNextPlayer()).length>0 && (
                                      <div className="text-gray-400 text-sm mt-1">Il reste: <span className="text-orange-400 font-semibold">{getEmptyCells(getNextPlayer()).map(id=>{const cat=categories.find(c=>c.id===id);return cat?.name;}).filter(Boolean).join(', ')}</span></div>
                                  )}
                              </div>
                          </div>
                          {lastModifiedCell && (
                              (()=>{const catId=lastModifiedCell.split('-')[1];const cat=categories.find(c=>c.id===catId);return <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-5 py-2.5 rounded-xl shadow-lg border-2 border-yellow-300"><div className="flex items-center gap-3"><div><div className="text-white text-xs font-bold uppercase tracking-wide">Dernier coup</div><div className="text-slate-900 font-black text-sm">{lastPlayerToPlay}</div><div className="text-slate-900 font-bold text-xs mt-0.5">{cat?.name||''}</div></div><div className="text-slate-900 font-black text-3xl">{scores[lastPlayerToPlay]?.[catId]||0}</div></div></div>;})()
                          )}
                      </div>
                  </div>
              )}

              <div className="overflow-x-auto"><table className="w-full table-fixed"><colgroup><col className="w-24 sm:w-48"/>{players.map((_,i)=><col key={i} className="w-20 sm:w-32"/>)}</colgroup><thead><tr className="border-b border-white/20">
                <th className="text-left p-1 sm:p-3 text-white font-bold sticky left-0 bg-gradient-to-r from-slate-900 to-slate-800 z-10 text-xs sm:text-base">Catégorie</th>
                {players.map((p,i)=><th key={i} className={`p-0 transition-all ${getNextPlayer()===p&&!editMode?'bg-white/10 ring-2 ring-inset ring-yellow-400/50':''}`}>
                    <div className="p-1 sm:p-3 text-white font-bold text-xs sm:text-lg flex flex-col items-center justify-center gap-1">
                        {leader === p && <div className="mb-1 text-yellow-400 animate-bounce"><Crown size={16} fill="currentColor" /></div>}
                        <div className="flex items-center gap-1 sm:gap-2 truncate w-full justify-center">{playerAvatars[p] || "👤"} {p}</div>
                        {!lastPlayerToPlay && p === starterName && <span className="text-[10px] sm:text-xs bg-yellow-500 text-black px-1 sm:px-2 py-0.5 rounded-full animate-bounce">1️⃣</span>}
                        {jokersEnabled && jokers[p] > 0 && <button onClick={()=>useJoker(p)} className="text-[10px] sm:text-xs bg-purple-500/30 text-purple-200 px-1 sm:px-2 py-0.5 rounded border border-purple-500/50 flex items-center gap-1 hover:bg-purple-500 hover:text-white"><Wand2 size={10}/> {jokers[p]}</button>}
                    </div>
                </th>)}</tr></thead><tbody>
                {categories.map(cat=>{
                  if(cat.upperHeader)return <tr key={cat.id}><td colSpan={players.length+1} className="p-0"><div className="relative py-4"><div className="absolute inset-0 flex items-center"><div className="w-full border-t-2" style={{background:'linear-gradient(90deg,transparent,'+T.primary+'50,transparent)',height:'2px'}}/></div><div className="relative flex justify-center"><span className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-2 text-white font-black text-sm uppercase tracking-wider rounded-full border border-white/20">⬆️ Partie Supérieure ⬆️</span></div></div></td></tr>;
                  if(cat.upperDivider)return <tr key={cat.id}><td colSpan={players.length+1} className="p-0"><div className="relative py-2"><div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div></div></td></tr>;
                  if(cat.divider)return <tr key={cat.id}><td colSpan={players.length+1} className="p-0"><div className="relative py-4"><div className="absolute inset-0 flex items-center"><div className="w-full border-t-2" style={{background:'linear-gradient(90deg,transparent,'+T.primary+'50,transparent)',height:'2px'}}/></div><div className="relative flex justify-center"><span className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-2 text-white font-black text-sm uppercase tracking-wider rounded-full border border-white/20">⬇️ Partie Inférieure ⬇️</span></div></div></td></tr>;
                  return <tr key={cat.id} className={'border-b border-white/10 hover:bg-white/10 transition-colors duration-150 '+(cat.upperTotal||cat.bonus?'bg-white/5':'')+(cat.upper?' bg-blue-500/5':cat.lower?' bg-purple-500/5':'')}><td className="p-1 sm:p-3 sticky left-0 bg-gradient-to-r from-slate-900 to-slate-800 z-10"><div className="flex items-center gap-1 sm:gap-3"><span className="text-lg sm:text-2xl" style={{color:cat.color||'#fff'}}>{cat.icon}</span><div><span className="text-white font-bold block text-xs sm:text-base">{cat.name}</span>{cat.desc&&<span className="text-[10px] sm:text-xs text-gray-400 block mt-0.5 hidden sm:block">{cat.desc}</span>}</div></div></td>{players.map((p,pi)=><td key={pi} className={`p-1 sm:p-2 transition-all ${getNextPlayer()===p&&!editMode?'bg-white/10 ring-2 ring-inset ring-yellow-400/50':''}`}>
                  {cat.upperTotal?<div className="text-center py-1 sm:py-3 px-1 rounded-lg sm:rounded-xl font-black text-sm sm:text-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400">{isFoggy(p)?"???":calcUpper(p)}</div>
                  :cat.bonus?<div className="flex flex-col items-center justify-center w-full"><div className="text-center py-1 sm:py-3 px-1 rounded-lg sm:rounded-xl font-black text-sm sm:text-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 w-full mb-1">{isFoggy(p)?"???":getBonus(p)}</div>
                    {(() => {
                        const diff = calculateBonusDiff(p);
                        if (calcUpper(p) >= 63) return <div className="text-[10px] font-bold text-green-400 text-center w-full">Bonus acquis!</div>;
                        if (diff > 0) return <div className="text-[10px] font-bold text-green-400 text-center w-full">Avance: +{diff}</div>;
                        if (diff < 0) return <div className="text-[10px] font-bold text-red-400 text-center w-full">Retard: {diff}</div>;
                        if (diff === 0 && scores[p] && Object.keys(scores[p]).some(k => ['ones','twos','threes','fours','fives','sixes'].includes(k))) return <div className="text-[10px] font-bold text-gray-400 text-center w-full">Sur la cible</div>;
                        return null;
                    })()}
                  </div>
                  :cat.upperGrandTotal?<div className="text-center py-1 sm:py-3 px-1 rounded-lg sm:rounded-xl font-black text-sm sm:text-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-400 border border-indigo-400/30">{isFoggy(p)?"???":calcUpperGrand(p)}</div>
                  :cat.lowerTotal?<div className="text-center py-1 sm:py-3 px-1 rounded-lg sm:rounded-xl font-black text-sm sm:text-xl bg-gradient-to-r from-pink-500/20 to-rose-500/20 text-pink-400 border border-pink-400/30">{isFoggy(p)?"???":calcLower(p)}</div>
                  :<ScoreInput value={scores[p]?.[cat.id]} onChange={(v, e)=>updateScore(p,cat.id,v, e)} category={cat.id} isHighlighted={lastModifiedCell===(p+'-'+cat.id)} isLocked={!editMode&&scores[p]?.[cat.id]!==undefined} isImposedDisabled={imposedOrder && !editMode && scores[p]?.[cat.id] === undefined && playableCats.findIndex(c => scores[p]?.[c.id] === undefined) !== playableCats.findIndex(c => c.id === cat.id)} isFoggy={isFoggy(p)}/>}
                  </td>)}</tr>;
                })}
                <tr className="border-t-2 border-white/30 bg-gradient-to-r from-white/10 to-white/5"><td className="p-2 sm:p-4 sticky left-0 bg-gradient-to-r from-slate-800 to-slate-700 z-10"><div className="flex items-center gap-1 sm:gap-3"><span className="text-xl sm:text-3xl">🏆</span><span className="text-white font-black text-sm sm:text-xl">TOTAL</span></div></td>{players.map((p,i)=><td key={i} className="p-2 sm:p-4 text-center">{hideTotals&&!isGameComplete()?<div className="text-lg sm:text-2xl font-black py-2 sm:py-4 px-1 sm:px-2 rounded-xl text-gray-500">???</div>:<div className="text-lg sm:text-4xl font-black py-2 sm:py-4 px-1 sm:px-2 rounded-xl" style={{color:getWinner().includes(p)?T.primary:'#fff',textShadow:getWinner().includes(p)?'0 0 20px '+T.primary:'none'}}>{isFoggy(p)?"???":calcTotal(p)}</div>}</td>)}</tr>
              </tbody></table></div>
            </div>
          </div>
        )}

        {/* TAB: HISTORY */}
        {currentTab==='history'&&(
          <div className="space-y-4 tab-enter"><div className={'bg-gradient-to-br '+T.card+' backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl '+T.glow+' p-6'}>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4"><h2 className="text-3xl font-black text-white flex items-center gap-3"><span className="text-4xl">📜</span>Historique</h2><div className="flex gap-2"><button onClick={exportData} className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-bold transition-all hover:scale-105 flex items-center gap-2"><Download size={18}/>Exporter</button><label className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-bold transition-all hover:scale-105 flex items-center gap-2 cursor-pointer"><Plus size={18}/>Importer<input type="file" accept=".json" onChange={importData} className="hidden"/></label></div></div>
            {gameHistory.length>0&&<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"><div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-400/30 rounded-2xl p-5 text-center"><div className="text-4xl mb-2">🎮</div><div className="text-blue-300 text-xs font-bold uppercase">Total Parties</div><div className="text-4xl font-black text-white">{gameHistory.length}</div></div><div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-2xl p-5 text-center"><div className="text-4xl mb-2">📅</div><div className="text-purple-300 text-xs font-bold uppercase">Première Partie</div><div className="text-lg font-black text-white">{gameHistory[gameHistory.length-1]?.date}</div></div><div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-2xl p-5 text-center"><div className="text-4xl mb-2">⏱️</div><div className="text-green-300 text-xs font-bold uppercase">Dernière Partie</div><div className="text-lg font-black text-white">{gameHistory[0]?.date}</div></div></div>}
            {gameHistory.length===0?<div className="text-center py-20"><div className="text-8xl mb-6 opacity-20">📋</div><p className="text-gray-500 text-lg">Aucune partie enregistrée</p></div>:<div className="space-y-3">{gameHistory.map(g=><div key={g.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3"><span className="text-gray-300 font-semibold">📅 {g.date} à {g.time}</span>{g.grid && <button onClick={() => setReplayGame(g)} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-blue-500/30"><Eye size={14}/> Voir la grille</button>}</div>
                    <button onClick={()=>deleteGame(g.id)} className="p-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-all hover:scale-110"><Trash2 size={18}/></button>
                </div>
                <div className="space-y-2">{(g.players||g.results).sort((a,b)=>b.score-a.score).map((pl,i)=>{
                    const grid = g.grid || {};
                    let hasBonus = false;
                    if(grid[pl.name]) {
                        const upper = categories.filter(c=>c.upper).reduce((s,c)=>s+(grid[pl.name]?.[c.id]||0),0);
                        if(upper >= 63) hasBonus = true;
                    }
                    return (
                    <div key={i} className="flex items-center justify-between bg-black/30 rounded-xl p-4 backdrop-blur-sm">
                        <span className="text-white font-bold flex items-center gap-3">
                            {pl.isWinner&&<span className="text-2xl animate-pulse">👑</span>}
                            {!pl.isWinner&&i===0&&<span className="text-xl">🥇</span>}{!pl.isWinner&&i===1&&<span className="text-xl">🥈</span>}{!pl.isWinner&&i===2&&<span className="text-xl">🥉</span>}
                            <span className="text-lg">{pl.name}</span>
                            {pl.yamsCount>0&&<span className="text-yellow-400 text-xs bg-yellow-500/20 px-2 py-0.5 rounded border border-yellow-500/50 flex items-center gap-1">🎲 Yams</span>}
                            {hasBonus&&<span className="text-blue-400 text-xs bg-blue-500/20 px-2 py-0.5 rounded border border-blue-500/50 flex items-center gap-1"><Gift size={12}/> Bonus</span>}
                            {pl.score>=300&&<span className="text-purple-400 text-xs bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/50 flex items-center gap-1">⭐ 300+</span>}
                        </span>
                        <span className="font-black text-2xl" style={{color:pl.isWinner?T.primary:'#9ca3af'}}>{pl.score}</span>
                    </div>
                );})}</div></div>)}</div>}
          </div></div>
        )}

        {/* TAB: STATS & TROPHIES - NOUVEAU DESIGN ANALYST EDITION */}
        {currentTab==='stats'&&(
            <div className="space-y-6 tab-enter">
                
                {/* 1. ANCIEN CONTENU (Haut de page) */}
                <div className={'bg-gradient-to-br '+T.card+' backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl '+T.glow+' p-6'}>
                  {(()=>{const stats=playerStats;if(!stats.length)return null;const bestScore=Math.max(...stats.map(s=>s.maxScore));const bestPlayers=stats.filter(s=>s.maxScore===bestScore);const maxPossible=375;const pctOfMax=((bestScore/maxPossible)*100).toFixed(1);return <div className="mb-2 p-6 bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 border-2 border-yellow-400/50 rounded-2xl backdrop-blur-sm shadow-xl shadow-yellow-500/20"><div className="flex items-center justify-between flex-wrap gap-4"><div className="flex items-center gap-4"><span className="text-6xl animate-pulse">🌟</span><div><div className="text-yellow-400 text-sm font-bold uppercase tracking-wider">Record Absolu</div><div className="text-white text-3xl font-black">{bestScore} <span className="text-sm font-normal text-gray-400">/ {maxPossible}</span></div><div className="text-white font-bold text-lg mt-1">{bestPlayers.map(p=>p.name).join(' & ')}</div></div></div><div className="text-right"><div className="text-yellow-400 text-sm font-bold uppercase tracking-wider">Performance</div><div className="text-white text-5xl font-black">{pctOfMax}%</div><div className="text-gray-300 text-xs">du maximum théorique</div></div></div></div>;})()}
                </div>

                {getPieData().length>0&&<div className={'bg-gradient-to-br '+T.card+' backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl '+T.glow+' p-6'}><h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3"><Medal className="text-yellow-400"/>Palmarès</h2><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{getPieData().sort((a,b)=>b.value-a.value).map((entry,idx)=>{
                    const allStats = playerStats; const pStat = allStats.find(s => s.name === entry.name);
                    const total = getPieData().reduce((s,item)=>s+item.value,0); const pct = ((entry.value/total)*100).toFixed(0); const isTop=idx===0; const COLORS=['#6366f1','#8b5cf6','#ec4899','#f97316','#10b981','#06b6d4'];
                    return <div key={idx} className={'relative overflow-hidden rounded-2xl p-6 transition-all hover:scale-105 cursor-pointer group '+(isTop?'bg-gradient-to-br from-yellow-500/30 via-orange-500/20 to-red-500/30 border-2 border-yellow-400/50 shadow-2xl shadow-yellow-500/30 animate-pulse':'bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:border-white/30')}><div className="absolute top-0 right-0 w-32 h-32 opacity-10 group-hover:opacity-20 transition-opacity"><div className="w-full h-full rounded-full blur-3xl" style={{backgroundColor:isTop?'#fbbf24':COLORS[idx%COLORS.length]}}></div></div>{isTop&&<div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-black animate-bounce">⭐ TOP 1</div>}<div className="relative z-10"><div className="flex items-center justify-between mb-4"><div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black shadow-xl" style={{backgroundColor:isTop?'#fbbf24':COLORS[idx%COLORS.length],color:'#000'}}>{idx+1}</div>{isTop&&<div className="text-5xl animate-bounce">👑</div>}</div><div className="mb-4"><h3 className="text-2xl font-black text-white mb-1">{entry.name}</h3><div className="flex items-baseline gap-2"><span className="text-4xl font-black" style={{color:isTop?'#fbbf24':COLORS[idx%COLORS.length]}}>{entry.value}</span><span className="text-gray-400 text-sm font-semibold">victoires</span></div></div><div className="space-y-3"><div className="flex items-center justify-between text-sm"><span className="text-gray-400 font-semibold">Taux de victoire</span><span className="text-white font-black text-lg">{pct}%</span></div><div className="w-full bg-black/30 rounded-full h-2 overflow-hidden"><div className="h-full rounded-full transition-all duration-1000" style={{backgroundColor:isTop?'#fbbf24':COLORS[idx%COLORS.length],width:pct+'%'}}></div></div>
                    {pStat && <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 mt-2">
                        <div className="col-span-2 grid grid-cols-3 gap-1 mb-2">
                            <div className="text-center"><div className="text-gray-400 text-[10px] uppercase">Yams</div><div className="font-bold text-white">{pStat.yamsCount}</div></div>
                            <div className="text-center"><div className="text-gray-400 text-[10px] uppercase">Moy.</div><div className="font-bold text-white">{pStat.avgScore}</div></div>
                            <div className="text-center"><div className="text-gray-400 text-[10px] uppercase">Record</div><div className="font-bold text-green-400">{pStat.maxScore}</div></div>
                        </div>
                        <div className="text-center bg-white/5 p-2 rounded-lg"><div className="text-gray-400 text-xs">Série Actuelle 🔥</div><div className="font-bold text-orange-400 text-lg">{pStat.currentStreak}</div></div>
                        <div className="text-center bg-white/5 p-2 rounded-lg"><div className="text-gray-400 text-xs">Série Max ⚡</div><div className="font-bold text-yellow-400 text-lg">{pStat.maxConsecutiveWins}</div></div>
                    </div>}
                    </div></div></div>;})}</div></div>}

                <div className={'bg-gradient-to-br '+T.card+' backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl '+T.glow+' p-6'}>
                  <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3"><Activity className="text-blue-400"/> Records & Stats</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(()=>{const stats=playerStats;const bestAvg=Math.max(...stats.map(s=>s.avgScore));const bestAvgP=stats.filter(s=>s.avgScore===bestAvg);const mostG=Math.max(...stats.map(s=>s.games));const mostGP=stats.filter(s=>s.games===mostG);const totY=stats.reduce((sum,s)=>sum+s.yamsCount,0);const maxY=Math.max(...stats.map(s=>s.yamsCount));const mostYP=stats.filter(s=>s.yamsCount===maxY);return <><div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-400/30 rounded-2xl p-5"><div className="flex items-center gap-3 mb-3"><span className="text-4xl">🎯</span><div><div className="text-blue-300 text-xs font-bold uppercase">Meilleure Moyenne</div><div className="text-white text-xl font-black">{bestAvgP.map(p=>p.name).join(' & ')}</div></div></div><div className="text-4xl font-black text-blue-300">{bestAvg} pts</div></div><div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-2xl p-5"><div className="flex items-center gap-3 mb-3"><span className="text-4xl">🎮</span><div><div className="text-purple-300 text-xs font-bold uppercase">Plus Actif</div><div className="text-white text-xl font-black">{mostGP.map(p=>p.name).join(' & ')}</div></div></div><div className="text-4xl font-black text-purple-300">{mostG} parties</div></div><div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-2xl p-5"><div className="flex items-center gap-3 mb-3"><span className="text-4xl">🎲</span><div><div className="text-yellow-300 text-xs font-bold uppercase">Total Yams</div><div className="text-white text-xl font-black">Tous joueurs</div></div></div><div className="text-4xl font-black text-yellow-300">{totY} 🎲</div></div><div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-2xl p-5"><div className="flex items-center gap-3 mb-3"><span className="text-4xl">👑</span><div><div className="text-green-300 text-xs font-bold uppercase">Roi du Yams</div><div className="text-white text-xl font-black">{mostYP.map(p=>p.name).join(' & ')}</div></div></div><div className="text-4xl font-black text-green-300">{maxY} Yams</div></div></>;})()}
                  </div>
                </div>

                {hallOfFame && hallOfFame.biggestWin.gap > -1 && (
                    <div className={'bg-gradient-to-br '+T.card+' backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl '+T.glow+' p-6'}>
                        <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3"><Trophy className="text-yellow-500"/> Hall of Fame</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border border-green-500/30 p-4 rounded-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
                                <div className="absolute top-2 right-2 opacity-20"><Swords size={40} className="text-green-400"/></div>
                                <div className="text-green-400 font-bold text-xs uppercase mb-1 flex items-center gap-2"><Swords size={14}/> Plus large victoire</div>
                                <div className="text-white font-black text-3xl">+{hallOfFame.biggestWin.gap} pts</div>
                                <div className="text-gray-300 text-sm mt-1 font-bold">{hallOfFame.biggestWin.winner} <span className="text-gray-500 font-normal">vs</span> {hallOfFame.biggestWin.second}</div>
                            </div>
                            <div className="bg-gradient-to-br from-orange-900/40 to-amber-900/40 border border-orange-500/30 p-4 rounded-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
                                <div className="absolute top-2 right-2 opacity-20"><Scale size={40} className="text-orange-400"/></div>
                                <div className="text-orange-400 font-bold text-xs uppercase mb-1 flex items-center gap-2"><Scale size={14}/> Plus serré</div>
                                <div className="text-white font-black text-3xl">+{hallOfFame.tightestWin.gap} pts</div>
                                <div className="text-gray-300 text-sm mt-1 font-bold">{hallOfFame.tightestWin.winner} <span className="text-gray-500 font-normal">vs</span> {hallOfFame.tightestWin.second}</div>
                            </div>
                            <div className="bg-gradient-to-br from-purple-900/40 to-fuchsia-900/40 border border-purple-500/30 p-4 rounded-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
                                <div className="absolute top-2 right-2 opacity-20"><ThumbsDown size={40} className="text-purple-400"/></div>
                                <div className="text-purple-400 font-bold text-xs uppercase mb-1 flex items-center gap-2"><ThumbsDown size={14}/> Vainqueur petit bras</div>
                                <div className="text-white font-black text-3xl">{hallOfFame.lowestWinner.score} pts</div>
                                <div className="text-gray-300 text-sm mt-1 font-bold">{hallOfFame.lowestWinner.name}</div>
                            </div>
                            <div className="bg-gradient-to-br from-red-900/40 to-rose-900/40 border border-red-500/30 p-4 rounded-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
                                <div className="absolute top-2 right-2 opacity-20"><ThumbsUp size={40} className="text-red-400"/></div>
                                <div className="text-red-400 font-bold text-xs uppercase mb-1 flex items-center gap-2"><ThumbsUp size={14}/> Perdant Magnifique</div>
                                <div className="text-white font-black text-3xl">{hallOfFame.highestLoser.score} pts</div>
                                <div className="text-gray-300 text-sm mt-1 font-bold">{hallOfFame.highestLoser.name}</div>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* 2. FACE A FACE V2 (COMPARATEUR) */}
                <div className={'bg-gradient-to-br '+T.card+' backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl '+T.glow+' p-6'}>
                    <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3"><Swords className="text-blue-400"/> Duel : Face-à-Face V2</h2>
                    <div className="flex gap-4 items-center justify-center mb-8">
                        <select onChange={e=>setVersus({...versus, p1: e.target.value})} className="bg-white/10 p-2 rounded-xl text-white font-bold border border-white/20 outline-none w-1/3">
                            <option value="" disabled selected>Sélectionner...</option>
                            {Object.keys(playerStats.reduce((acc,s)=>{acc[s.name]=s; return acc},{})).map(n=><option key={n} value={n} className="bg-slate-900">{n}</option>)}
                        </select>
                        <div className="text-xl font-black text-white">VS</div>
                        <select onChange={e=>setVersus({...versus, p2: e.target.value})} className="bg-white/10 p-2 rounded-xl text-white font-bold border border-white/20 outline-none w-1/3">
                            <option value="" disabled selected>Sélectionner...</option>
                            {Object.keys(playerStats.reduce((acc,s)=>{acc[s.name]=s; return acc},{})).map(n=><option key={n} value={n} className="bg-slate-900">{n}</option>)}
                        </select>
                    </div>

                    {versus.p1 && versus.p2 && playerStats.find(s=>s.name===versus.p1) && playerStats.find(s=>s.name===versus.p2) && (
                        <div className="space-y-4">
                            {/* Comparison Row Helper */}
                            {(() => {
                                const p1 = playerStats.find(s=>s.name===versus.p1);
                                const p2 = playerStats.find(s=>s.name===versus.p2);
                                
                                const p1Wins = gameHistory.filter(g => {
                                    const pp1 = (g.players||g.results).find(p=>p.name===versus.p1);
                                    const pp2 = (g.players||g.results).find(p=>p.name===versus.p2);
                                    return pp1 && pp2 && pp1.score > pp2.score;
                                }).length;
                                const p2Wins = gameHistory.filter(g => {
                                    const pp1 = (g.players||g.results).find(p=>p.name===versus.p1);
                                    const pp2 = (g.players||g.results).find(p=>p.name===versus.p2);
                                    return pp1 && pp2 && pp2.score > pp1.score;
                                }).length;
                                
                                const totalMatches = p1Wins + p2Wins;
                                const p1Pct = totalMatches ? (p1Wins/totalMatches)*100 : 50;

                                // Advanced Stats
                                let p1Total = 0;
                                let p2Total = 0;
                                let gapSum = 0;
                                let streak = 0;
                                let currentWinner = null;
                                
                                const mutualGames = gameHistory.filter(g => {
                                     const pp1 = (g.players||g.results).find(p=>p.name===versus.p1);
                                     const pp2 = (g.players||g.results).find(p=>p.name===versus.p2);
                                     if(pp1 && pp2) {
                                         p1Total += pp1.score;
                                         p2Total += pp2.score;
                                         gapSum += Math.abs(pp1.score - pp2.score);
                                         return true;
                                     }
                                     return false;
                                });

                                // Streak calc (simple version based on history order)
                                for(let i=0; i<mutualGames.length; i++) {
                                     const g = mutualGames[i];
                                     const pp1 = (g.players||g.results).find(p=>p.name===versus.p1);
                                     const pp2 = (g.players||g.results).find(p=>p.name===versus.p2);
                                     const winner = pp1.score > pp2.score ? versus.p1 : versus.p2;
                                     if(currentWinner === null) { currentWinner = winner; streak = 1; }
                                     else if(currentWinner === winner) streak++;
                                     else break;
                                }

                                const avgGap = totalMatches > 0 ? Math.round(gapSum / totalMatches) : 0;

                                return (
                                    <>
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border border-blue-500/30 p-4 rounded-2xl text-center relative overflow-hidden">
                                                <div className="text-blue-400 font-bold text-xs uppercase mb-1">{versus.p1}</div>
                                                <div className="text-white font-black text-4xl">{p1Wins}</div>
                                                <div className="text-gray-400 text-[10px] uppercase">Victoires</div>
                                            </div>
                                            <div className="bg-gradient-to-br from-red-900/40 to-rose-900/40 border border-red-500/30 p-4 rounded-2xl text-center relative overflow-hidden">
                                                <div className="text-red-400 font-bold text-xs uppercase mb-1">{versus.p2}</div>
                                                <div className="text-white font-black text-4xl">{p2Wins}</div>
                                                <div className="text-gray-400 text-[10px] uppercase">Victoires</div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-2 mb-4">
                                            <div className="bg-white/5 p-3 rounded-xl text-center border border-white/10">
                                                <div className="text-[10px] uppercase text-gray-400 font-bold mb-1">Écart Moyen</div>
                                                <div className="text-white font-black text-lg">{avgGap} pts</div>
                                            </div>
                                            <div className="bg-white/5 p-3 rounded-xl text-center border border-white/10">
                                                <div className="text-[10px] uppercase text-gray-400 font-bold mb-1">Série en cours</div>
                                                <div className="text-white font-black text-lg">{currentWinner || "-"} <span className="text-yellow-400">x{streak}</span></div>
                                            </div>
                                            <div className="bg-white/5 p-3 rounded-xl text-center border border-white/10">
                                                <div className="text-[10px] uppercase text-gray-400 font-bold mb-1">Cumul Points</div>
                                                <div className="text-xs font-bold"><span className="text-blue-400">{p1Total}</span> / <span className="text-red-400">{p2Total}</span></div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            {[
                                                { label: "Moyenne", v1: p1.avgScore, v2: p2.avgScore },
                                                { label: "Record", v1: p1.maxScore, v2: p2.maxScore },
                                                { label: "Total Yams", v1: p1.yamsCount, v2: p2.yamsCount },
                                                { label: "Bonus", v1: p1.bonusCount, v2: p2.bonusCount }
                                            ].map((stat, i) => (
                                                <div key={i} className="flex items-center justify-between bg-black/20 p-2 rounded-lg border border-white/5">
                                                    <span className={`font-bold w-12 text-center ${stat.v1 > stat.v2 ? "text-green-400" : "text-white"}`}>{stat.v1}</span>
                                                    <span className="text-[10px] uppercase text-gray-500 font-bold flex-1 text-center">{stat.label}</span>
                                                    <span className={`font-bold w-12 text-center ${stat.v2 > stat.v1 ? "text-green-400" : "text-white"}`}>{stat.v2}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    )}
                </div>

                {/* 5. STATISTIQUES DE RAYAGE (FAILURES) */}
                <div className={'bg-gradient-to-br '+T.card+' backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl '+T.glow+' p-6'}>
                     <h2 className="text-xl font-black text-white mb-6 flex items-center gap-3"><AlertTriangle className="text-red-400"/> Zone de Danger</h2>
                     <div className="mb-4">
                        <select onChange={e=>setVersus({...versus, failPlayer: e.target.value})} className="w-full bg-white/10 text-white p-3 rounded-xl font-bold border border-white/20 outline-none">
                            <option value="GLOBAL" className="bg-slate-900">🌍 Global (Tous les joueurs)</option>
                            {Object.keys(playerStats.reduce((acc,s)=>{acc[s.name]=s; return acc},{})).map(n=><option key={n} value={n} className="bg-slate-900">{n}</option>)}
                        </select>
                     </div>
                     <div className="overflow-x-auto max-h-64 overflow-y-auto">
                         {(() => {
                             const pName = versus.failPlayer || 'GLOBAL';
                             const { failures, totalGames } = calculateGlobalFailures(pName);
                             
                             if (totalGames === 0) return <div className="text-center text-gray-400 text-xs py-4">Aucune donnée pour ce joueur.</div>;

                             return (
                                 <table className="w-full text-sm text-left">
                                    <thead>
                                        <tr className="text-gray-400 border-b border-white/10"><th className="p-2">Catégorie</th><th className="p-2 text-right">Échecs (0 pts)</th><th className="p-2 text-right">Taux</th></tr>
                                    </thead>
                                    <tbody className="text-white">
                                        {failures.map(f => (
                                            <tr key={f.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="p-2 font-bold flex items-center gap-2">
                                                    {categories.find(c=>c.id===f.id)?.icon} {f.name}
                                                </td>
                                                <td className={`p-2 text-right font-bold ${f.count > 0 ? 'text-red-400' : 'text-gray-500'}`}>{f.count}</td>
                                                <td className="p-2 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <span className="text-xs">{f.rate}%</span>
                                                        <div className="w-12 h-1 bg-gray-700 rounded-full overflow-hidden">
                                                            <div className={`h-full ${f.rate > 50 ? 'bg-red-500' : f.rate > 20 ? 'bg-orange-400' : 'bg-green-400'}`} style={{width: `${f.rate}%`}}></div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                             );
                         })()}
                     </div>
                </div>

            </div>
        )}

        {/* TAB: TROPHIES (ANCIENNE VERSION GARDÉE POUR COMPATIBILITÉ) */}
        {currentTab==='trophies'&&(
            <div className="space-y-4 tab-enter">
                <div className={'bg-gradient-to-br '+T.card+' p-6 rounded-3xl border border-white/10'}>
                    <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3"><Award className="text-yellow-400"/> Trophées & Succès</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {ACHIEVEMENTS.map(ach => {
                            let winners = [];
                            playerStats.forEach(p => {
                                if (ach.id === 'first_win' && p.wins > 0) winners.push(p.name);
                                if (ach.id === 'score_300' && p.maxScore >= 300) winners.push(p.name);
                                if (ach.id === 'score_350' && p.maxScore >= 350) winners.push(p.name);
                                if (ach.id === 'yams_king' && p.yamsCount >= 10) winners.push(p.name);
                                if (ach.id === 'veteran' && p.games >= 50) winners.push(p.name);
                                if (ach.id === 'bonus_hunter' && p.bonusCount >= 20) winners.push(p.name);
                            });
                            const unlocked = winners.length > 0;
                            return (
                                <div key={ach.id} className={`p-4 rounded-2xl border flex flex-col items-center text-center transition-all ${unlocked ? 'bg-yellow-500/20 border-yellow-500/50 scale-105' : 'bg-black/20 border-white/5 opacity-50 grayscale'}`}>
                                    <div className="text-4xl mb-2">{ach.icon}</div>
                                    <div className="font-bold text-white text-sm">{ach.name}</div>
                                    <div className="text-[10px] text-gray-400 mb-2">{ach.desc}</div>
                                    {unlocked && (
                                        <div className="text-[9px] font-black text-yellow-400 border-t border-yellow-500/30 pt-1 w-full truncate">
                                            {winners.join(', ')}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}