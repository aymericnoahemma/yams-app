import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  Plus, Trash2, RotateCcw, Settings, Edit3, Check, X, Download, Share2, 
  Undo2, BookOpen, Dices, Eye, ArrowLeft, Trophy, Medal, Activity, Lock, 
  History as HistoryIcon, Timer, EyeOff, Palette, Sun, Monitor, 
  Zap, Scale, Swords, ThumbsDown, ThumbsUp, Crown, 
  ScrollText, Award, Flame, Coffee, Ghost, Moon,
  TrendingUp, AlertTriangle, Gift, Camera, Calendar, PenLine, Info, Save,
  Play, Pause, Skull, Sparkles, Image, BarChart3, HelpCircle, LockKeyhole, Star, Gavel,
  Heart, Terminal, Snowflake, FileText, Users, CloudRain, CloudLightning, Droplets, ChevronUp, ChevronDown, Target
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

// DÉFIS DE PARTIE
const PARTY_CHALLENGES = [
  { id:'bonus', desc:'Obtenir le bonus (+35)', icon:'🎁', check:(grid)=>{const up=['ones','twos','threes','fours','fives','sixes'].reduce((s,k)=>s+(parseInt(grid[k])||0),0);return up>=63;}},
  { id:'yams', desc:'Faire un YAMS', icon:'🎲', check:(grid)=>parseInt(grid.yams)===50},
  { id:'full', desc:'Faire un Full', icon:'🃏', check:(grid)=>parseInt(grid.fullHouse)===25},
  { id:'grand', desc:'Grande Suite', icon:'🎯', check:(grid)=>parseInt(grid.largeStraight)===40},
  { id:'no_zero', desc:'Aucun zéro !', icon:'💪', check:(grid)=>{const cats=['ones','twos','threes','fours','fives','sixes','threeOfKind','fourOfKind','fullHouse','smallStraight','largeStraight','yams','chance'];return cats.every(k=>grid[k]!==undefined&&parseInt(grid[k])>0);}},
  { id:'over250', desc:'Dépasser 250 pts', icon:'📈', check:(g,t)=>t>=250},
  { id:'over300', desc:'Dépasser 300 pts', icon:'🔥', check:(g,t)=>t>=300},
  { id:'top_upper', desc:'Score sup. > 70', icon:'⬆️', check:(grid)=>{const up=['ones','twos','threes','fours','fives','sixes'].reduce((s,k)=>s+(parseInt(grid[k])||0),0);return up>=70;}},
];

// TITRES DYNAMIQUES
const getPlayerTitle = (stat) => {
  if(!stat || !stat.games) return {title:"Nouveau",icon:"🆕"};
  const wr = stat.games>0 ? stat.wins/stat.games : 0;
  const br = stat.bonusRate||0;
  const mcw = stat.maxConsecutiveWins||0;
  if(stat.maxScore>=350) return {title:"Dieu du Yams",icon:"⚡"};
  if((stat.yamsCount||0)>=20) return {title:"Machine à Yams",icon:"🎰"};
  if(wr>=0.8&&stat.games>=10) return {title:"Inarrêtable",icon:"💀"};
  if(br>=70&&stat.games>=5) return {title:"Mr Bonus",icon:"🎁"};
  if(mcw>=5) return {title:"Série Noire",icon:"🔥"};
  if((stat.currentStreak||0)>=3) return {title:"En Feu",icon:"🔥"};
  if(stat.games>=50&&wr>=0.5) return {title:"Vétéran d'Élite",icon:"🎖️"};
  if(stat.games>=50) return {title:"Vétéran",icon:"🧙"};
  if(wr>=0.6&&stat.games>=10) return {title:"Le Chanceux",icon:"🍀"};
  if((stat.avgScore||0)>=250) return {title:"Score Machine",icon:"📈"};
  if(wr<0.2&&stat.games>=5) return {title:"Le Barreur Fou",icon:"🧱"};
  if(stat.games>=10&&wr<0.35) return {title:"Éternel Second",icon:"🥈"};
  if(stat.games>=5) return {title:"Joueur Régulier",icon:"🎯"};
  if(stat.games>=1) return {title:"Apprenti",icon:"📖"};
  return {title:"Débutant",icon:"🐣"};
};

const THEME_CONFETTI = {
  modern:['✨','⭐','💜','🔮','🎆','💎'], ocean:['🫧','🐠','🌊','💎','🐬','✨'], sunset:['🔥','🌅','☀️','🧡','✨','🎇'],
  forest:['🍃','🌿','🌱','🍀','🌳','✨'], cyber:['⚡','💜','🔮','🎆','💫','🌟'], coffee:['☕','🍪','🧇','🍩','✨','🤎'],
  lavender:['🌸','💜','🦋','✨','💫','🪻'], mono:['⚪','⚫','🔲','✨','💫','🌟'], blood:['🩸','🔴','❤️‍🔥','🌹','💀','✨'],
  arctic:['❄️','🧊','⛄','💎','🌨️','✨'], gold:['👑','🏆','💰','⭐','🥇','✨'], cherry:['🌸','🎀','💖','🦋','✨','💕'],
  matrix:['🟢','💚','🖥️','⚡','✨','🔋'], aurora:['🌌','💜','🌠','✨','🔮','💫'], midnight:['🌙','⭐','🌟','💙','✨','🌃'],
  neon:['💡','🌈','⚡','✨','💫','🔆'], jade:['🪨','💚','🍵','🏮','✨','🐉'], autumn:['🍂','🍁','🎃','🍄','✨','🌰'],
  galaxy:['🌌','🪐','🚀','⭐','💫','🌠'], retro:['🕹️','👾','🎮','🟣','✨','🔴'], spring:['🌷','🌼','🐝','🌈','✨','🦋'],
  christmas:['🎄','🎅','🎁','⭐','❄️','✨'], halloween:['🎃','👻','🦇','🕸️','💀','🧙'],
  glass:['💎','✦','○','◇','⊹','✧']
};
const THEME_CONFETTI_STYLE = {
  modern:{anim:'confetti-fall'},ocean:{anim:'confetti-rise'},sunset:{anim:'confetti-ember'},
  fire:{anim:'confetti-ember'},neon:{anim:'confetti-laser'},forest:{anim:'confetti-leaf'},
  nature:{anim:'confetti-leaf'},autumn:{anim:'confetti-leaf'},galaxy:{anim:'confetti-fall'},
  arctic:{anim:'confetti-fall'},cherry:{anim:'confetti-fall'},spring:{anim:'confetti-leaf'},
};

const THEME_BG_PARTICLES = {
  modern: {particles:['✦','·','⊹'],count:15,speed:20,opacity:0.04},
  sunset: {particles:['◐','·','☀'],count:12,speed:25,opacity:0.05},
  ocean: {particles:['~','≋','○'],count:18,speed:30,opacity:0.04},
  fire: {particles:['⊹','·','⁕'],count:14,speed:15,opacity:0.06},
  neon: {particles:['◆','▪','●'],count:16,speed:22,opacity:0.05},
  nature: {particles:['🍃','·','⊹'],count:12,speed:35,opacity:0.04},
  galaxy: {particles:['✦','·','⊹','✧'],count:20,speed:40,opacity:0.05},
  royal: {particles:['⚜','·','✦'],count:10,speed:30,opacity:0.04},
  stealth: {particles:['·','·','○'],count:8,speed:40,opacity:0.03},
  candy: {particles:['●','○','◆'],count:14,speed:20,opacity:0.05},
  glass: {particles:['◇','○','✦','·'],count:12,speed:35,opacity:0.03},
};
const THEMES_CONFIG = {
  modern: { name: "Modern Dark", primary: "#6366f1", secondary: "#8b5cf6", bg: "from-slate-950 via-indigo-950 to-slate-950", card: "from-slate-900/90 to-slate-800/90", glow: "shadow-indigo-500/20", icon: <Monitor size={16}/>, part: "✨" },
  ocean: { name: "Deep Ocean", primary: "#06b6d4", secondary: "#0891b2", bg: "from-slate-950 via-cyan-950 to-slate-950", card: "from-slate-900/90 to-cyan-900/90", glow: "shadow-cyan-500/20", icon: <Share2 size={16}/>, part: "🫧" },
  sunset: { name: "Sunset Burn", primary: "#f97316", secondary: "#ea580c", bg: "from-slate-950 via-orange-950 to-slate-950", card: "from-slate-900/90 to-orange-900/90", glow: "shadow-orange-500/20", icon: <Sun size={16}/>, part: "🔥" },
  forest: { name: "Emerald Forest", primary: "#10b981", secondary: "#059669", bg: "from-slate-950 via-emerald-950 to-slate-950", card: "from-slate-900/90 to-emerald-900/90", glow: "shadow-emerald-500/20", icon: <BookOpen size={16}/>, part: "🍃" },
  cyber: { name: "Cyberpunk", primary: "#d946ef", secondary: "#8b5cf6", bg: "from-black via-fuchsia-950 to-black", card: "from-black/90 to-purple-900/90", glow: "shadow-fuchsia-500/40", icon: <Zap size={16}/>, part: "⚡" },
  coffee: { name: "Coffee Break", primary: "#d97706", secondary: "#92400e", bg: "from-stone-950 via-stone-900 to-stone-800", card: "from-stone-900/95 to-stone-800/95", glow: "shadow-amber-700/20", icon: <Coffee size={16}/>, part: "☕" },
  lavender: { name: "Lavender", primary: "#a78bfa", secondary: "#7c3aed", bg: "from-violet-950 via-slate-900 to-violet-900", card: "from-violet-900/80 to-slate-900/80", glow: "shadow-violet-400/20", icon: <Ghost size={16}/>, part: "🌸" },
  mono: { name: "Monochrome", primary: "#94a3b8", secondary: "#475569", bg: "from-gray-950 via-gray-900 to-black", card: "from-gray-900 to-black", glow: "shadow-white/10", icon: <Moon size={16}/>, part: "⚪" },
  blood: { name: "Blood Moon", primary: "#dc2626", secondary: "#991b1b", bg: "from-black via-red-950 to-black", card: "from-red-950/80 to-black/90", glow: "shadow-red-500/30", icon: <Flame size={16}/>, part: "🩸" },
  arctic: { name: "Arctic", primary: "#38bdf8", secondary: "#0284c7", bg: "from-sky-950 via-cyan-950 to-slate-950", card: "from-sky-900/80 to-slate-900/90", glow: "shadow-sky-400/20", icon: <Snowflake size={16}/>, part: "❄️" },
  gold: { name: "Royal Gold", primary: "#eab308", secondary: "#ca8a04", bg: "from-yellow-950 via-amber-950 to-stone-950", card: "from-amber-900/80 to-stone-900/90", glow: "shadow-yellow-500/30", icon: <Crown size={16}/>, part: "👑" },
  cherry: { name: "Cherry Blossom", primary: "#f472b6", secondary: "#db2777", bg: "from-pink-950 via-rose-950 to-slate-950", card: "from-pink-900/80 to-slate-900/90", glow: "shadow-pink-400/20", icon: <Heart size={16}/>, part: "🌸" },
  matrix: { name: "Matrix", primary: "#22c55e", secondary: "#15803d", bg: "from-black via-green-950 to-black", card: "from-green-950/70 to-black/95", glow: "shadow-green-500/30", icon: <Terminal size={16}/>, part: "🟢" },
  aurora: { name: "Aurora", primary: "#a855f7", secondary: "#06b6d4", bg: "from-violet-950 via-indigo-950 to-cyan-950", card: "from-violet-900/70 to-cyan-900/70", glow: "shadow-violet-400/25", icon: <Sparkles size={16}/>, part: "🌌" },
  midnight: { name: "Midnight Blue", primary: "#1d4ed8", secondary: "#1e40af", bg: "from-blue-950 via-slate-950 to-blue-950", card: "from-blue-950/90 to-slate-900/90", glow: "shadow-blue-600/25", icon: <Moon size={16}/>, part: "🌙" },
  toxic: { name: "Toxic", primary: "#84cc16", secondary: "#65a30d", bg: "from-black via-lime-950 to-black", card: "from-lime-950/70 to-black/90", glow: "shadow-lime-500/30", icon: <Zap size={16}/>, part: "☢️" },
  rose: { name: "Rosé", primary: "#fb7185", secondary: "#e11d48", bg: "from-rose-950 via-pink-950 to-slate-950", card: "from-rose-900/70 to-slate-900/80", glow: "shadow-rose-400/25", icon: <Heart size={16}/>, part: "🌹" },
  neon: { name: "Neon City", primary: "#06b6d4", secondary: "#d946ef", bg: "from-black via-cyan-950 to-fuchsia-950", card: "from-cyan-950/60 to-fuchsia-950/60", glow: "shadow-cyan-400/30", icon: <Zap size={16}/>, part: "💜" },
  earth: { name: "Terre", primary: "#a16207", secondary: "#854d0e", bg: "from-amber-950 via-yellow-950 to-stone-950", card: "from-amber-950/80 to-stone-900/80", glow: "shadow-amber-600/20", icon: <Sun size={16}/>, part: "🌍" },
  ice: { name: "Glacial", primary: "#67e8f9", secondary: "#22d3ee", bg: "from-cyan-950 via-sky-950 to-slate-950", card: "from-cyan-900/60 to-sky-900/60", glow: "shadow-cyan-300/25", icon: <Snowflake size={16}/>, part: "🧊" },
  volcano: { name: "Volcan", primary: "#f97316", secondary: "#dc2626", bg: "from-red-950 via-orange-950 to-black", card: "from-red-950/80 to-orange-950/70", glow: "shadow-orange-500/30", icon: <Flame size={16}/>, part: "🌋" },
  glass: { name: "Liquid Glass", primary: "#88a4c8", secondary: "#5b8fb9", bg: "from-slate-950 via-gray-900 to-slate-950", card: "from-white/[0.06] to-white/[0.03]", glow: "shadow-white/10", icon: <Sparkles size={16}/>, part: "💎" }
};

const DICE_SKINS = {
    classic: { name: "Classique", bg: "bg-white", text: "text-black", border: "border-slate-200" },
    casino: { name: "Casino", bg: "bg-red-600", text: "text-white", border: "border-red-800" },
    neon: { name: "Néon", bg: "bg-black", text: "text-green-400", border: "border-green-500 shadow-[0_0_10px_#4ade80]" },
    gold: { name: "Luxe", bg: "bg-yellow-400", text: "text-yellow-900", border: "border-yellow-600" }
};

// GRID SKINS
const GRID_SKINS = {
    default: { name: "Défaut", headerBg: "from-slate-900 to-slate-800", rowBg: "", cellBg: "", border: "border-white/10", text: "text-white", accent: "" },
    neon: { name: "Néon", headerBg: "from-black to-gray-950", rowBg: "bg-black/40", cellBg: "shadow-[inset_0_0_8px_rgba(0,255,128,0.05)]", border: "border-green-500/20", text: "text-green-300", accent: "shadow-[0_0_20px_rgba(0,255,128,0.05)]" },
    vintage: { name: "Papier Vintage", headerBg: "from-amber-950 to-yellow-950", rowBg: "bg-amber-900/10", cellBg: "", border: "border-amber-700/20", text: "text-amber-100", accent: "sepia-[0.2]" },
    chalk: { name: "Tableau Craie", headerBg: "from-green-950 to-emerald-950", rowBg: "bg-green-950/20", cellBg: "", border: "border-green-800/20", text: "text-green-100", accent: "" },
    pixel: { name: "Pixel Art", headerBg: "from-purple-950 to-fuchsia-950", rowBg: "bg-purple-950/10", cellBg: "", border: "border-purple-500/20", text: "text-purple-200", accent: "" }
};

// PLAYER COLOR PALETTE
const PLAYER_COLORS = [
    { id: 'blue', name: 'Bleu', hex: '#3b82f6', light: '#93c5fd' },
    { id: 'red', name: 'Rouge', hex: '#ef4444', light: '#fca5a5' },
    { id: 'green', name: 'Vert', hex: '#10b981', light: '#6ee7b7' },
    { id: 'yellow', name: 'Jaune', hex: '#eab308', light: '#fde047' },
    { id: 'purple', name: 'Violet', hex: '#8b5cf6', light: '#c4b5fd' },
    { id: 'pink', name: 'Rose', hex: '#ec4899', light: '#f9a8d4' },
    { id: 'cyan', name: 'Cyan', hex: '#06b6d4', light: '#67e8f9' },
    { id: 'orange', name: 'Orange', hex: '#f97316', light: '#fdba74' },
];

// AVATAR PACKS THÉMATIQUES
const AVATAR_PACKS = {
    classic: { name: "Classique", icons: ["👤","🙂","😎","🤠","🤖","🦊","🦁","👑","🎯","🎲","🔥","🦄","💀","💩","👽","💎"] },
    animals: { name: "🐾 Animaux", icons: ["🐶","🐱","🐻","🐼","🦁","🐸","🐧","🦋","🐙","🦈","🐺","🦅","🐲","🦊","🐮","🐷"], req: "games:3" },
    fantasy: { name: "🧙 Fantasy", icons: ["🧙","🧝","🧛","🧜","🧚","🦸","🦹","🤴","👸","🧟","🧞","🧑‍🚀","🥷","🗡️","🏰","🔮"], req: "wins:5" },
    scifi: { name: "🚀 Sci-Fi", icons: ["🤖","👾","🛸","🚀","🌌","👨‍🚀","🧬","⚡","🔬","🛰️","💫","🌠","🧑‍💻","🎮","🕹️","🔋"], req: "games:10" },
    food: { name: "🍕 Food", icons: ["🍕","🍔","🌮","🍣","🍩","🧁","🍪","🍦","🥑","🍒","🧀","🌶️","🍿","🥨","🍗","🥝"], req: "games:1" },
    sports: { name: "⚽ Sports", icons: ["⚽","🏀","🏈","🎾","🏐","🏓","🥊","🏆","🥇","🏋️","🤸","⛷️","🏄","🚴","🎳","🥅"], req: "wins:3" },
    seasonal: { name: "🌸 Saisonnier", icons: ["🎄","🎃","🌸","☀️","❄️","🌈","🍂","🌊","🌺","⛄","🎆","🌻","🍁","🌙","⭐","🌴"], req: "games:5" }
};

// XP LEVELS SYSTEM
const XP_LEVELS = [
    { level: 1, xp: 0, name: "Débutant", icon: "🐣", reward: null },
    { level: 2, xp: 200, name: "Apprenti", icon: "📖", reward: "Thème Coffee débloqué" },
    { level: 3, xp: 500, name: "Joueur", icon: "🎮", reward: "Skin dés Casino" },
    { level: 4, xp: 1000, name: "Compétiteur", icon: "⚔️", reward: "Pack Avatars Animaux" },
    { level: 5, xp: 2000, name: "Stratège", icon: "🧠", reward: "Grille Néon" },
    { level: 6, xp: 3500, name: "Expert", icon: "🎯", reward: "Pack Avatars Fantasy" },
    { level: 7, xp: 5000, name: "Maître", icon: "🏅", reward: "Thème Cyber" },
    { level: 8, xp: 7500, name: "Champion", icon: "🏆", reward: "Pack Avatars Sci-Fi" },
    { level: 9, xp: 10000, name: "Légende", icon: "⭐", reward: "Grille Pixel Art" },
    { level: 10, xp: 15000, name: "Dieu du Yams", icon: "⚡", reward: "Tout débloqué !" }
];

const getXPLevel = (xp) => {
    let current = XP_LEVELS[0];
    for (const lvl of XP_LEVELS) { if (xp >= lvl.xp) current = lvl; }
    const nextIdx = XP_LEVELS.indexOf(current) + 1;
    const next = nextIdx < XP_LEVELS.length ? XP_LEVELS[nextIdx] : null;
    const progress = next ? ((xp - current.xp) / (next.xp - current.xp)) * 100 : 100;
    return { ...current, next, progress: Math.min(100, progress), totalXP: xp };
};

// FUN SPLASH STATS
const getSplashFunStat = (history, stats) => {
    const funStats = [];
    const totalGames = history.length;
    if (totalGames > 0) {
        const totalDice = totalGames * 13 * 5;
        funStats.push(`Tu as lancé environ ${totalDice.toLocaleString()} dés au total ! 🎲`);
        const totalPoints = stats.reduce((s, p) => s + p.totalScore, 0);
        funStats.push(`${totalPoints.toLocaleString()} points marqués en tout par tous les joueurs ! 📈`);
        const totalYams = stats.reduce((s, p) => s + p.yamsCount, 0);
        if (totalYams > 0) funStats.push(`${totalYams} YAMS réussis ! La chance est avec vous 🍀`);
        const totalZeros = history.reduce((s, g) => {
            const grid = g.grid || {};
            Object.values(grid).forEach(pGrid => { Object.entries(pGrid).forEach(([k, v]) => { if (v === 0 && !k.includes('History')) s++; }); });
            return s;
        }, 0);
        if (totalZeros > 0) funStats.push(`${totalZeros} cases barrées à 0... Aïe ! 💀`);
        funStats.push(`Temps estimé de jeu: ~${Math.round(totalGames * 20)} minutes ⏱️`);
        const bestEver = Math.max(0, ...stats.map(s => s.maxScore));
        if (bestEver > 0) funStats.push(`Record absolu: ${bestEver} points ! Qui le battra ? 🔥`);
        funStats.push(`${totalGames} parties jouées ! Encore une ? 😏`);
    }
    return funStats.length > 0 ? funStats[Math.floor(Math.random() * funStats.length)] : "Bienvenue dans YAMS ! 🎲";
};

// FUN QUOTES

// WALL OF SHAME CALCULATION
const getWallOfShame = (history) => {
    if(!history || history.length < 2) return null;
    const shameStats = {};
    history.forEach(g => {
        const parts = g.players || g.results || [];
        const grid = g.grid || {};
        parts.forEach(p => {
            if(!shameStats[p.name]) shameStats[p.name] = { zeros: 0, worstScore: 999, consecutiveZeros: 0, maxConsecutiveZeros: 0, totalGames: 0, lastPlace: 0 };
            const s = shameStats[p.name];
            s.totalGames++;
            if(p.score < s.worstScore) s.worstScore = p.score;
            const sorted = [...parts].sort((a,b) => b.score - a.score);
            if(sorted[sorted.length-1]?.name === p.name && parts.length > 1) s.lastPlace++;
            if(grid[p.name]) {
                let consec = 0;
                Object.entries(grid[p.name]).forEach(([k,v]) => {
                    if(v === 0 && !k.includes('History') && !k.includes('Score')) { s.zeros++; consec++; if(consec > s.maxConsecutiveZeros) s.maxConsecutiveZeros = consec; }
                    else consec = 0;
                });
            }
        });
    });
    return Object.entries(shameStats).map(([name,d]) => ({name, ...d, avgScore: Math.round((history.reduce((s,g) => {const p=(g.players||g.results||[]).find(p=>p.name===name);return s+(p?p.score:0);},0))/Math.max(1,d.totalGames))})).sort((a,b) => b.zeros - a.zeros);
};



// GHOST SCORE CALCULATION
const getGhostScore = (player, category, history) => {
    if(!history || history.length === 0) return null;
    let bestGame = null; let bestScore = 0;
    history.forEach(g => {
        const p = (g.players||g.results||[]).find(pp => pp.name === player);
        if(p && p.score > bestScore) { bestScore = p.score; bestGame = g; }
    });
    if(!bestGame || !bestGame.grid || !bestGame.grid[player]) return null;
    return bestGame.grid[player][category];
};

// DYNAMIC IN-GAME TITLES
const getDynamicTitle = (player, players, scores, calcTotal, lastPlayerToPlay, moveLog) => {
    if (!players || players.length < 2) return null;
    const totals = players.map(p => ({ name: p, total: calcTotal(p) })).sort((a,b) => b.total - a.total);
    const rank = totals.findIndex(t => t.name === player) + 1;
    const gap = totals[0].total - totals[totals.length - 1].total;
    const isLeader = rank === 1;
    const isLast = rank === totals.length;
    // Was this player previously not leading but now is?
    const recentMoves = moveLog.filter(m => m.player === player).length;
    if (isLeader && gap > 40) return { text: "Intouchable", icon: "👑", color: "#fbbf24" };
    if (isLeader && gap > 20) return { text: "Roi provisoire", icon: "👑", color: "#fbbf24" };
    if (isLeader && gap <= 10) return { text: "Leader fragile", icon: "😰", color: "#fb923c" };
    if (isLeader) return { text: "En tête", icon: "🏅", color: "#fbbf24" };
    if (rank === 2 && totals[0].total - totals[1].total <= 15) return { text: "Challenger", icon: "⚔️", color: "#60a5fa" };
    if (isLast && gap > 50) return { text: "En galère", icon: "😬", color: "#ef4444" };
    if (isLast && recentMoves > 5) return { text: "Comeback Kid", icon: "🔄", color: "#a78bfa" };
    if (isLast) return { text: "Roi déchu", icon: "📉", color: "#f87171" };
    return { text: "En course", icon: "🏃", color: "#94a3b8" };
};

// FONT OPTIONS
// Safe localStorage with fallback
// CATEGORY CELEBRATIONS
const CATEGORY_CELEBRATIONS = {
    brelan: { emoji: '🎯', text: 'x3 !' },
    carre: { emoji: '🔥', text: 'x4 !!' },
    full: { emoji: '🃏', text: 'FULL HOUSE !' },
    petiteSuite: { emoji: '📈', text: 'SUITE !' },
    grandeSuite: { emoji: '🎰', text: 'GRANDE SUITE !' },
    yams: { emoji: '💥', text: 'YAMS !!!' },
    chance: { emoji: '🍀', text: 'CHANCE !' },
};

// NARRATOR PHRASES
const NARRATOR_PHRASES = {
    bigScore: ["Un coup magistral !", "Impressionnant !", "Quel talent !", "La foule est en délire !", "Stratégie payante !"],
    zero: ["Aïe... ça pique.", "Le sort s'acharne...", "Même les dés ont détourné le regard.", "Un moment de silence...", "C'est la vie..."],
    overtake: ["Renversement spectaculaire !", "Le chasseur devient le chassé !", "Coup de théâtre !", "On n'y croyait plus !"],
    clutch: ["Le sang-froid d'un champion !", "Sous pression, il délivre !", "Nerfs d'acier !"],
    streak: ["En feu !", "Inarrêtable !", "Machine de guerre !", "Sur un nuage !"],
    start: ["Que le spectacle commence !", "Les dés sont jetés !", "Premier coup, premières émotions."],
    midgame: ["La partie s'intensifie...", "Chaque point compte désormais.", "Qui craquera le premier ?"],
    endgame: ["Les dernières cases approchent...", "Fin de partie imminente !", "Tout se joue maintenant !"],
};

// Haptic feedback for mobile
const vibrate = (ms = 10) => { try { navigator?.vibrate?.(ms); } catch(e) {} };

const FONT_OPTIONS = {
    default: { name: "Par défaut", family: "system-ui, -apple-system, sans-serif" },
    outfit: { name: "Outfit", family: "'Outfit', sans-serif", url: "https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap" },
    jetbrains: { name: "JetBrains", family: "'JetBrains Mono', monospace", url: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap" },
    poppins: { name: "Poppins", family: "'Poppins', sans-serif", url: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;700;900&display=swap" },
    space: { name: "Space Grotesk", family: "'Space Grotesk', sans-serif", url: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap" }
};



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
const DEFAULT_GAGES = ["Ranger le jeu tout seul 🧹", "Servir à boire à tout le monde 🥤", "Ne plus dire 'non' pendant 10 min 🤐", "Choisir la musique pour 1h 🎵", "Imiter une poule à chaque phrase 🐔", "Faire 10 pompes (ou squats) 💪", "Appeler le gagnant 'Mon Seigneur' 👑", "Jouer la prochaine partie les yeux fermés au lancer 🙈"];

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
const ScoreInput = ({ value, onChange, category, isHighlighted, isLocked, isImposedDisabled, isFoggy, isJustFilled, heatColor }) => {
  if(isFoggy && isLocked) return <div className="w-full py-3 text-center text-gray-500 font-black animate-pulse text-xs sm:text-lg">???</div>;
  if(isImposedDisabled) return <div className="w-full py-3 text-center text-gray-700 font-bold bg-black/20 rounded-xl opacity-30 cursor-not-allowed text-xs sm:text-lg">🔒</div>;
  const cat = categories.find(c=>c.id===category);
  const vals = cat?.values || Array.from({length:31},(_,i)=>i);
  const hasValue = value !== undefined && value !== '' && value !== null;
  const isZero = hasValue && parseInt(value) === 0;
  return (
    <select value={value??''} onChange={e=>onChange(e.target.value, e)} disabled={isLocked}
      className={`w-full py-3 px-2 rounded-xl font-bold text-sm sm:text-lg text-center transition-all duration-300 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/40 focus:shadow-lg focus:shadow-white/10 focus:scale-[1.03] ${isJustFilled?'cell-flip':''} ${isLocked?(isZero?'cursor-not-allowed opacity-50 bg-red-500/10 text-red-400/60 border border-red-500/20 cell-cracked':'cursor-not-allowed opacity-70 text-gray-300 border border-white/8 cell-alive backdrop-blur-sm'):isHighlighted?'cursor-pointer bg-gradient-to-r from-green-500/30 to-emerald-500/30 border-2 border-green-400 text-white shadow-lg shadow-green-500/50 ring-pulse':'cursor-cell bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 hover:shadow-lg hover:shadow-white/5 cell-empty-wave'}`}
      style={isLocked?(heatColor?{background:heatColor}:{}):(isHighlighted?{}:{background:'linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.1))',color:'white'})}>
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
    <div className="glass-strong rounded-2xl p-3 sm:p-4 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group" style={{animationDelay:`${index*80}ms`,animation:'fade-in-scale 0.4s ease-out backwards'}}>
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        <button onClick={() => onAvatarClick(index)} className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-xl hover:bg-white/20 transition-all duration-300 shadow-inner overflow-hidden cursor-pointer hover:scale-110 hover:shadow-lg group-hover:ring-2 group-hover:ring-white/20" title="Changer l'avatar">
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

const FloatingScore = ({ x, y, value, color }) => {
    const c = color || '#4ade80';
    return (
      <div className="fixed pointer-events-none z-[100]" style={{ left: x, top: y, transform: 'translateX(-50%)' }}>
        <div className="font-black text-2xl" style={{ animation: 'floatUp 1s ease-out forwards', fontFamily: 'JetBrains Mono, monospace', color: c, textShadow: `0 0 12px ${c}, 0 0 24px ${c}40` }}>+{value}</div>
        <div className="absolute inset-0 font-black text-2xl score-trail" style={{ fontFamily: 'JetBrains Mono, monospace', color: c, filter:'blur(6px)', opacity:0.5 }}>+{value}</div>
      </div>
    );
};

// --- NOUVEAUX COMPOSANTS STATS ---

// --- COMPOSANT PRINCIPAL ---

// ═══ INLINE GAME FLOW CHART FOR HISTORY ═══
// FLIP COUNTER - compteur à rouleaux
const FlipCounter = ({value, color}) => {
  const [prev, setPrev] = React.useState(value);
  const [flipping, setFlipping] = React.useState(false);
  const [direction, setDirection] = React.useState(null);
  React.useEffect(()=>{
    if(value !== prev){
      setDirection(value > prev ? 'up' : 'down');
      setFlipping(true);
      const t=setTimeout(()=>{setPrev(value);setFlipping(false);setDirection(null);},600);
      return()=>clearTimeout(t);
    }
  },[value]);
  const digits = String(value).split('');
  const prevDigits = String(prev).split('');
  while(prevDigits.length < digits.length) prevDigits.unshift('0');
  return (
    <span style={{color,perspective:'200px',filter:flipping?(direction==='up'?'drop-shadow(0 0 8px rgba(16,185,129,0.5))':'drop-shadow(0 0 8px rgba(239,68,68,0.4))'):'none',transition:'filter 0.3s'}} className={"inline-flex "+(flipping?(direction==='up'?'total-bounce-up':'total-bounce-down'):'')}>
      {digits.map((d,i)=>{
        const changed = d !== (prevDigits[i]||'0');
        return <span key={i+'-'+d} className={changed&&flipping?'flip-digit':''} style={{display:'inline-block',minWidth:'0.6em',textAlign:'center'}}>{flipping&&changed?prevDigits[i]||'0':d}</span>;
      })}
    </span>
  );
};

// PARTICULES INTERACTIVES
const InteractiveParticles = ({themeKey}) => {
  const TC = THEMES_CONFIG[themeKey];
  const containerRef = React.useRef(null);
  const mouseRef = React.useRef({x:-1000,y:-1000});
  const particlesRef = React.useRef(Array.from({length:14},(_,i)=>({
    x:(i*7.1+5)%100, y:Math.random()*100, baseX:(i*7.1+5)%100, baseY:Math.random()*100,
    speed:0.15+Math.random()*0.2, size:14+i%3*8, delay:i*0.8
  })));
  const [, forceUpdate] = React.useState(0);
  React.useEffect(()=>{
    let raf;
    const animate=()=>{
      const mx=mouseRef.current.x, my=mouseRef.current.y;
      particlesRef.current.forEach(p=>{
        const dx=p.x-mx/window.innerWidth*100, dy=p.y-my/window.innerHeight*100;
        const dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<15&&mx>0){p.x+=dx/dist*2;p.y+=dy/dist*2;}
        else{p.x+=(p.baseX-p.x)*0.02;p.y+=(p.baseY-p.y)*0.02;}
        p.baseY-=p.speed*0.3;
        if(p.baseY<-5){p.baseY=105;p.y=105;}
      });
      forceUpdate(n=>n+1);
      raf=requestAnimationFrame(animate);
    };
    raf=requestAnimationFrame(animate);
    return()=>cancelAnimationFrame(raf);
  },[]);
  if(!TC) return null;
  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      onMouseMove={e=>{mouseRef.current={x:e.clientX,y:e.clientY};}}
      onTouchMove={e=>{if(e.touches[0])mouseRef.current={x:e.touches[0].clientX,y:e.touches[0].clientY};}}
      style={{pointerEvents:'none'}}>
      <div className="absolute inset-0" style={{pointerEvents:'all'}}
        onMouseMove={e=>{mouseRef.current={x:e.clientX,y:e.clientY};}}
        onTouchMove={e=>{if(e.touches[0])mouseRef.current={x:e.touches[0].clientX,y:e.touches[0].clientY};}}>
      </div>
      {particlesRef.current.map((p,i)=>(
        <div key={i} className="absolute opacity-[0.05] transition-none" style={{
          left:`${p.x}%`,top:`${p.y}%`,fontSize:`${p.size}px`,
          transform:'rotate('+(p.y*3.6)+'deg)',
          willChange:'left,top'
        }}>{TC.part}</div>
      ))}
    </div>
  );
};


export default function YamsUltimateLegacy() {
  const [players,setPlayers]=useState(['Joueur 1','Joueur 2']);
  const [scores,setScores]=useState({});
  const [theme,setTheme]=useState('modern');
  const [showSettings,setShowSettings]=useState(false);
  const [openSettingsSection, setOpenSettingsSection] = useState(null);
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
  const [showPodiumAnim, setShowPodiumAnim] = useState(false);
  const [notifQueue, setNotifQueue] = useState([]);
  const pushNotif = (notif, duration=4500) => {
    const id = Date.now() + Math.random();
    setNotifQueue(prev => [...prev.slice(-2), {...notif, id}]);
    setTimeout(() => setNotifQueue(prev => prev.filter(n => n.id !== id)), duration);
  };
  const [confetti,setConfetti]=useState(null);

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
  const [diceSkin, setDiceSkin] = useState('classic');
  const [moveLog, setMoveLog] = useState([]);
  const [showLog, setShowLog] = useState(false);
  const [isReplaying, setIsReplaying] = useState(false);
  const [floatingScores, setFloatingScores] = useState([]);
  const [versus, setVersus] = useState({p1: '', p2: '', failPlayer: 'GLOBAL', yamsFilter: 'GLOBAL'});
  const [globalXP, setGlobalXP] = useState(0);
  const [showStudioModal, setShowStudioModal] = useState(false);
  const [wakeLockEnabled, setWakeLockEnabled] = useState(true);
  
  // NOUVELLES FONCTIONNALITES V30 (Yams Detail)
  const [seasons, setSeasons] = useState([]); 
  const [activeSeason, setActiveSeason] = useState('Aucune');
  const [seasonDescriptions, setSeasonDescriptions] = useState({});
  const [newSeasonName, setNewSeasonName] = useState('');
  const [statsFilterSeason, setStatsFilterSeason] = useState('Toutes');
  const [historyFilterSeason, setHistoryFilterSeason] = useState('Toutes');
  const [renamingSeason, setRenamingSeason] = useState(null);
  const [tempSeasonName, setTempSeasonName] = useState('');
  const [editingHistoryId, setEditingHistoryId] = useState(null);
  
  // Yams Detail Logic
  const [pendingYamsDetail, setPendingYamsDetail] = useState(null); // { player: 'Name' }

  // GAGES STATES
  const [customGages, setCustomGages] = useState([]);
  const [enableDefaultGages, setEnableDefaultGages] = useState(true);
  const [newGageInput, setNewGageInput] = useState("");
  
  const [showSuddenDeath, setShowSuddenDeath] = useState(false);
  const [suddenDeathPlayers, setSuddenDeathPlayers] = useState([]);
  const [suddenDeathWinner, setSuddenDeathWinner] = useState(null);
  const [showBonusFullscreen, setShowBonusFullscreen] = useState(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [gameEndShown, setGameEndShown] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [themeTransition, setThemeTransition] = useState(false);
  const [shakeScreen, setShakeScreen] = useState(false);
  const [avatarReaction, setAvatarReaction] = useState({});

  const [quickStatsPlayer, setQuickStatsPlayer] = useState(null);
  const [shockwavePos, setShockwavePos] = useState(null);
  const [emojiRain, setEmojiRain] = useState(null);
  const [showDiceAnim, setShowDiceAnim] = useState(false);
  const [streaks, setStreaks] = useState({});
  const [playerCombos, setPlayerCombos] = useState({});
  const [inGameStreak, setInGameStreak] = useState({});
  const [showPerfect, setShowPerfect] = useState(null);
  const [avatarAnim, setAvatarAnim] = useState({});
  const [headerAnim, setHeaderAnim] = useState({});
  const [showCinematic, setShowCinematic] = useState(false);
  const [lastCellKey, setLastCellKey] = useState(null);
  const [tabDirection, setTabDirection] = useState('l');
  const [showSplash, setShowSplash] = useState(true);
  const [onboardStep, setOnboardStep] = useState(()=>{try{return localStorage.getItem('yamsOnboardDone')?0:1;}catch(e){return 1;}});
  const [showPlayerCard, setShowPlayerCard] = useState(null);
  const [gridSkin, setGridSkin] = useState('default');
  const [playerColors, setPlayerColors] = useState({});
  const [victorySigs, setVictorySigs] = useState({});
  const [showVSScreen, setShowVSScreen] = useState(false);
  const [hotSeatPlayer, setHotSeatPlayer] = useState(null);
  const [massacreScreen, setMassacreScreen] = useState(null);
  const [scoreParticles, setScoreParticles] = useState([]);
  const [consecutiveZeros, setConsecutiveZeros] = useState({});
  const [gameNote, setGameNote] = useState('');
  const [showCountdown, setShowCountdown] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);
  const showConfirm = (message, onYes) => setConfirmModal({ message, onYes });
  const [showClutch, setShowClutch] = useState(null);
  const [showPhotoFinish, setShowPhotoFinish] = useState(false);
  const [showGhostScores, setShowGhostScores] = useState(false);
  const gridAge = useMemo(() => {
    if(!players.length) return 0;
    const total = players.length * playableCats.length;
    const filled = players.reduce((s,p) => s + playableCats.filter(c=>scores[p]?.[c.id]!==undefined).length, 0);
    return total > 0 ? filled / total : 0;
  }, [players, scores]);

  const [idleAvatars, setIdleAvatars] = useState(false);
  const [playerEntrance, setPlayerEntrance] = useState(false);
  const [funQuote, setFunQuote] = useState(null);
  const [customFont, setCustomFont] = useState('default');
  const [animSpeed, setAnimSpeed] = useState(1);
  const [effectsIntensity, setEffectsIntensity] = useState(1);
  const [fontScale, setFontScale] = useState(1);
  const replayIntervalRef = useRef(null);
  const T = THEMES_CONFIG[theme];
  useEffect(()=>{try{const cv=document.createElement('canvas');cv.width=32;cv.height=32;const cx=cv.getContext('2d');const gr=cx.createLinearGradient(0,0,32,32);gr.addColorStop(0,T.primary);gr.addColorStop(1,T.secondary);cx.beginPath();cx.arc(16,16,14,0,Math.PI*2);cx.fillStyle=gr;cx.fill();cx.font='18px serif';cx.textAlign='center';cx.textBaseline='middle';cx.fillText('🎲',16,17);let lk=document.querySelector("link[rel*='icon']");if(!lk){lk=document.createElement('link');lk.rel='shortcut icon';document.head.appendChild(lk);}lk.type='image/png';lk.href=cv.toDataURL();}catch(e){}},[theme]);
  const tabOrder = ['game','rules','trophies','history','stats','gages','records'];
  const switchTab = (newTab) => {
    if(newTab === currentTab) return;
    window.scrollTo({top:0,behavior:'instant'});
    const oldIdx = tabOrder.indexOf(currentTab);
    const newIdx = tabOrder.indexOf(newTab);
    setTabDirection(newIdx > oldIdx ? 'r' : 'l');
    
    setCurrentTab(newTab);
  };

  const minSwipeDistance = 50;
  const onTouchStart = (e) => { setTouchEnd(null); setTouchStart(e.targetTouches[0].clientX); };
  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEndHandler = () => {
      if (!touchStart || !touchEnd) return;
      const distance = touchStart - touchEnd;
      const isLeftSwipe = distance > minSwipeDistance;
      const isRightSwipe = distance < -minSwipeDistance;
      const tabs = ['game', 'stats', 'history', 'trophies', 'gages', 'records', 'rules'];
      const currentIndex = tabs.indexOf(currentTab);
      if (isLeftSwipe && currentIndex < tabs.length - 1) switchTab(tabs[currentIndex + 1]);
      if (isRightSwipe && currentIndex > 0) switchTab(tabs[currentIndex - 1]);
  };

  useEffect(() => {
    let wakeLock = null;
    const requestWakeLock = async () => {
        if ('wakeLock' in navigator && wakeLockEnabled) {
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

  useEffect(()=>{loadHistory();loadCurrentGame();loadSavedPlayers();loadGlobalStats();loadSeasons();loadGages();loadNewSettings();},[]);
  const loadNewSettings=()=>{try{const gs=localStorage.getItem('yamsGridSkin');if(gs)setGridSkin(gs);const pc=localStorage.getItem('yamsPlayerColors');if(pc)setPlayerColors(JSON.parse(pc));const cf=localStorage.getItem('yamsCustomFont');if(cf)setCustomFont(cf);const sgs=localStorage.getItem('yamsShowGhost');if(sgs)setShowGhostScores(JSON.parse(sgs));const vs=localStorage.getItem('yamsVictorySigs');if(vs)setVictorySigs(JSON.parse(vs));}catch(e){}};
  useEffect(()=>{localStorage.setItem('yamsGridSkin',gridSkin);},[gridSkin]);
  useEffect(()=>{localStorage.setItem('yamsPlayerColors',JSON.stringify(playerColors));},[playerColors]);
  useEffect(()=>{localStorage.setItem('yamsVictorySigs',JSON.stringify(victorySigs));},[victorySigs]);
  useEffect(()=>{localStorage.setItem('yamsShowGhost',JSON.stringify(showGhostScores));},[showGhostScores]);
  useEffect(()=>{localStorage.setItem('yamsCustomFont',customFont);const f=FONT_OPTIONS[customFont];if(f&&f.url){const existing=document.getElementById('yams-font-link');if(existing)existing.remove();const link=document.createElement('link');link.id='yams-font-link';link.rel='stylesheet';link.href=f.url;document.head.appendChild(link);}document.documentElement.style.setProperty('--app-font',f?.family||'system-ui, sans-serif');},[customFont]);
  const loadHistory=()=>{try{const r=localStorage.getItem('yamsHistory');if(r){const p=JSON.parse(r);setGameHistory(Array.isArray(p)?p:[]);}}catch(e){setGameHistory([])}};
  const saveHistory=(h)=>{try{localStorage.setItem('yamsHistory',JSON.stringify(h));}catch(e){}};
  const loadGlobalStats=()=>{try{const xp=localStorage.getItem('yamsGlobalXP');if(xp)setGlobalXP(parseInt(xp));}catch(e){}};
  const loadSeasons=()=>{try{const s=localStorage.getItem('yamsSeasons');const a=localStorage.getItem('yamsActiveSeason');const d=localStorage.getItem('yamsSeasonDesc');if(s)setSeasons(JSON.parse(s));if(a)setActiveSeason(a);if(d)setSeasonDescriptions(JSON.parse(d));}catch(e){}};
  const loadGages=()=>{try{const cg=localStorage.getItem('yamsCustomGages');const edg=localStorage.getItem('yamsEnableDefaultGages');if(cg)setCustomGages(JSON.parse(cg));if(edg)setEnableDefaultGages(JSON.parse(edg));}catch(e){}};

  // AUTO COMPACT MODE
  useEffect(() => {
    const h = () => setCompactMode(window.innerWidth < 400);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // IDLE DETECTION
  useEffect(() => {
    if(!isGameStarted() || isGameComplete()) { setIdleAvatars(false); return; }
    const timer = setTimeout(() => setIdleAvatars(true), 30000);
    setIdleAvatars(false);
    return () => clearTimeout(timer);
  }, [scores, lastPlayerToPlay]);

  useEffect(() => { localStorage.setItem('yamsCustomGages', JSON.stringify(customGages)); localStorage.setItem('yamsEnableDefaultGages', JSON.stringify(enableDefaultGages)); }, [customGages, enableDefaultGages]);

  const saveCurrentGame=(sc)=>{try{localStorage.setItem('yamsCurrentGame',JSON.stringify({players,scores:sc,lastPlayerToPlay,lastModifiedCell,starterName,timestamp:Date.now(), imposedOrder, fogMode, speedMode, diceSkin, moveLog, wakeLockEnabled, activeSeason}));}catch(e){}};
  const loadCurrentGame=()=>{try{const r=localStorage.getItem('yamsCurrentGame');if(r){const d=JSON.parse(r);if(d.players&&d.scores){setPlayers(d.players);setScores(d.scores);setLastPlayerToPlay(d.lastPlayerToPlay||null);setLastModifiedCell(d.lastModifiedCell||null);setStarterName(d.starterName || d.players[0]); setImposedOrder(d.imposedOrder||false); setFogMode(d.fogMode||false); setSpeedMode(d.speedMode||false); setDiceSkin(d.diceSkin||'classic'); setMoveLog(d.moveLog||[]);
  setWakeLockEnabled(d.wakeLockEnabled !== undefined ? d.wakeLockEnabled : true);}}}catch(e){}};
  const loadSavedPlayers=()=>{try{const r=localStorage.getItem('yamsSavedPlayers');const av=localStorage.getItem('yamsPlayerAvatars');if(r)setPlayers(JSON.parse(r));if(av)setPlayerAvatars(JSON.parse(av));}catch(e){}};
  
  useEffect(() => { if(players.length > 0) { localStorage.setItem('yamsSavedPlayers', JSON.stringify(players)); if (!starterName) setStarterName(players[0]); if(!simPlayer) setSimPlayer(players[0]); } }, [players]);
  useEffect(() => { localStorage.setItem('yamsPlayerAvatars', JSON.stringify(playerAvatars)); }, [playerAvatars]);
  useEffect(() => { localStorage.setItem('yamsGlobalXP', globalXP.toString()); }, [globalXP]);
  useEffect(() => { localStorage.setItem('yamsSeasons', JSON.stringify(seasons)); localStorage.setItem('yamsActiveSeason', activeSeason); localStorage.setItem('yamsSeasonDesc', JSON.stringify(seasonDescriptions)); }, [seasons, activeSeason, seasonDescriptions]);
  useEffect(() => { let interval; if(speedMode && isGameStarted() && !isGameComplete() && !editMode) { if(timeLeft > 0) { interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000); } } return () => clearInterval(interval); }, [speedMode, timeLeft, scores, editMode]);
  useEffect(() => { setTimeLeft(30); }, [lastPlayerToPlay]);

  const updateSeasonDescription = (season, desc) => { setSeasonDescriptions(prev => ({...prev, [season]: desc})); };

  const isGameStarted=()=>Object.keys(scores).some(p=>scores[p]&&Object.keys(scores[p]).length>0);
  const addPlayer=()=>{if(players.length<6&&!isGameStarted())setPlayers([...players,`Joueur ${players.length+1}`]);};
  const removePlayer=i=>{if(players.length>1&&!isGameStarted()){const rem=players[i];const np=[...players];np.splice(i,1);setPlayers(np);const ns={...scores};delete ns[rem];setScores(ns);}};
  const updatePlayerName=(i,name)=>{const old=players[i];const np=[...players];np[i]=name;setPlayers(np);if(scores[old]){const ns={...scores};ns[name]=ns[old];delete ns[old];setScores(ns);}};
  // FIX AVATAR: Simply set index and show modal
  const openAvatarSelector = (index) => { setAvatarSelectorIndex(index); setShowAvatarModal(true); };
  const selectAvatar = (icon) => { const p = players[avatarSelectorIndex]; setPlayerAvatars({...playerAvatars, [p]: icon}); setShowAvatarModal(false); };

  // GAGES FUNCTIONS
  const addCustomGage = () => { if (newGageInput.trim()) { setCustomGages([...customGages, { id: Date.now(), text: newGageInput.trim(), active: true }]); setNewGageInput(""); } };
  const toggleCustomGage = (id) => { setCustomGages(customGages.map(g => g.id === id ? { ...g, active: !g.active } : g)); };
  const deleteCustomGage = (id) => { setCustomGages(customGages.filter(g => g.id !== id)); };

  const calcUpper= (p, sc=scores) => { if (!p || !sc[p]) return 0; return categories.filter(c=>c.upper).reduce((s,c)=>s+(sc[p]?.[c.id]||0),0); };
  const getBonus= (p, sc=scores) => calcUpper(p, sc)>=63?35:0;
  const calcUpperGrand= (p, sc=scores) => calcUpper(p, sc)+getBonus(p, sc);
  const calcLower= (p, sc=scores) => { if (!p || !sc[p]) return 0; return categories.filter(c=>c.lower).reduce((s,c)=>s+(sc[p]?.[c.id]||0),0); };
  const calcTotal= (p, sc=scores) => { if (!p) return 0; let total = calcUpperGrand(p, sc)+calcLower(p, sc); return total; };
  const getPlayerTotals = (p, sc=scores) => ({ upper: calcUpper(p, sc), bonus: getBonus(p, sc), lower: calcLower(p, sc), total: calcTotal(p, sc) });
  const getAutoTitle=(game)=>{
    const pls=(game.players||game.results||[]);if(!pls.length)return '🎲 Partie';
    const winner=pls.find(p=>p.isWinner);const scores2=pls.map(p=>p.score).sort((a,b)=>b-a);
    const gap=scores2.length>=2?scores2[0]-scores2[1]:0;
    const hasZeros=game.grid?Object.values(game.grid).some(g=>Object.values(g).filter(v=>parseInt(v)===0).length===0):false;
    if(gap===0&&pls.length>1)return '⚔️ Égalité parfaite';
    if(gap<=5&&pls.length>1)return '📸 Photo Finish';
    if(gap>=80)return '💀 Le Massacre';
    if(hasZeros)return '✨ Sans Faute';
    if(scores2[0]>=280)return '🚀 Score Galactique';
    if(scores2[0]<=150)return '🌧️ Jour de pluie';
    return winner?'🎲 Victoire de '+winner.name:'🎲 Partie';
  };
  const getBonusProgress=p=>{ const filled=categories.filter(c=>c.upper&&scores[p]?.[c.id]!==undefined).length; if(!filled)return{status:'neutral',message:''}; const targets=[{id:'ones',t:3},{id:'twos',t:6},{id:'threes',t:9},{id:'fours',t:12},{id:'fives',t:15},{id:'sixes',t:18}]; let exp=0;targets.forEach(c=>{if(scores[p]?.[c.id]!==undefined)exp+=c.t;}); const diff=calcUpper(p)-exp; if(diff>0)return{status:'ahead',message:`Avance: +${diff}`,color:'text-green-400'}; if(diff<0)return{status:'behind',message:`Retard: ${diff}`,color:'text-red-400'}; return{status:'ontrack',message:'Sur la cible',color:'text-blue-400'}; };
  const getEmptyCells=p=>{if(!p)return[];return playableCats.map(c=>c.id).filter(id=>scores[p]?.[id]===undefined);};
  // Memoized totals
  const playerTotals = useMemo(() => {
      const t = {}; players.forEach(p => { t[p] = calcTotal(p); }); return t;
  }, [players, scores]);
  const getWinner=()=>{if(!players.length)return[];const max=Math.max(...players.map(p=>playerTotals[p]??calcTotal(p)));const tied=players.filter(p=>calcTotal(p)===max);if(suddenDeathWinner&&tied.includes(suddenDeathWinner))return[suddenDeathWinner];return tied;};
  const getLoser=()=>{if(!players.length)return null;const winners=getWinner();const nonWinners=players.filter(p=>!winners.includes(p));if(nonWinners.length===0){const totals=players.map(p=>({name:p,score:calcTotal(p)}));const min=Math.min(...totals.map(t=>t.score));return totals.find(t=>t.score===min);}const totals=nonWinners.map(p=>({name:p,score:calcTotal(p)}));const min=Math.min(...totals.map(t=>t.score));return totals.find(t=>t.score===min);};
  const handleSuddenDeathWin=(winner,sdScores=null)=>{setSuddenDeathWinner(winner);if(sdScores){const ns={...scores};Object.entries(sdScores).forEach(([p,v])=>{if(!ns[p])ns[p]={};ns[p].suddenDeathScore=v;});setScores(ns);}setShowSuddenDeath(false);// CHECK PHOTO FINISH
      const sortedPlayers = players.map(p=>({name:p,score:calcTotal(p)})).sort((a,b)=>b.score-a.score);
      if(sortedPlayers.length >= 2 && sortedPlayers[0].score - sortedPlayers[1].score <= 5) {
          setShowPhotoFinish(true);
          setTimeout(() => { setShowPhotoFinish(false); setShowVictoryAnimation(true);setConfetti('winner');setTimeout(()=>{setShowVictoryAnimation(false);setShowEndGameModal(true);setConfetti(null);},3500); }, 3000);
      } else {
      }};
  const isGameComplete=()=>{if(!players.length)return false;const ids=playableCats.map(c=>c.id);return players.every(p=>ids.every(id=>scores[p]?.[id]!==undefined));};
  const getNextPlayer=()=>{if(!lastPlayerToPlay) {return players.includes(starterName) ? starterName : players[0];} return players[(players.indexOf(lastPlayerToPlay)+1)%players.length];};
  const isAvatarLocked = (req, stats) => { if(req === "none") return false; const [cond, val] = req.split(':'); const v = parseInt(val); if(!stats) return true; if(cond === 'games') return stats.games < v; if(cond === 'wins') return stats.wins < v; if(cond === 'yams') return stats.yamsCount < v; if(cond === 'score') return stats.maxScore < v; if(cond === 'lose') return (stats.games - stats.wins) < v; if(cond === 'bonus') return stats.bonusCount < v; return true; };


  const handleUndo = () => { if (!undoData) return; const { player, category, previousLastPlayer, previousLastCell } = undoData; const newScores = { ...scores }; if (newScores[player]) { delete newScores[player][category]; } setScores(newScores); setLastPlayerToPlay(previousLastPlayer); setLastModifiedCell(previousLastCell); setUndoData(null); setMoveLog(moveLog.slice(0, -1)); saveCurrentGame(newScores); };

  const updateScore=(player,category,value, event)=>{
    const cellKey=`${player}-${category}`;
    if(imposedOrder && !editMode) { const pScores = scores[player] || {}; const firstEmptyIndex = playableCats.findIndex(c => pScores[c.id] === undefined); const targetIndex = playableCats.findIndex(c => c.id === category); if(targetIndex !== firstEmptyIndex) { setShowTurnWarning("Mode Ordre Imposé ! Tu dois remplir la première case vide."); setTimeout(()=>setShowTurnWarning(null),3500); return; } }
    if(!editMode) { const expectedPlayer = getNextPlayer(); if(player !== expectedPlayer) { setShowTurnWarning(`Hé non ! C'est à ${expectedPlayer} de commencer !`); setTimeout(()=>setShowTurnWarning(null),3500); return; } if(lastPlayerToPlay === player && lastModifiedCell !== null) { setShowTurnWarning(`Doucement ${player}, tu as déjà joué !`); setTimeout(()=>setShowTurnWarning(null),3500); return; } }
    if (!editMode) { setUndoData({ player, category, previousLastPlayer: lastPlayerToPlay, previousLastCell: lastModifiedCell }); setTimeout(() => setUndoData(null), 5000); }
    // LAST ROUND DETECTION
    if(!editMode && value !== '') {
      const afterScores = {...scores,[player]:{...scores[player],[category]:parseInt(value)||0}};
      const filledAfter = players.reduce((s,p)=>s+playableCats.filter(c=>afterScores[p]?.[c.id]!==undefined).length,0);
      const totalCells = players.length * playableCats.length;
      const remaining = totalCells - filledAfter;
      if(remaining <= 3 && remaining > 0) {
        const countdownDelay = (value === '0' || value === '50') ? 2500 : 400;
        setTimeout(() => { setShowCountdown(remaining); setTimeout(() => setShowCountdown(null), 1500); }, countdownDelay);
      }
      if(remaining <= players.length && remaining > 0) {
        setTimeout(()=>{pushNotif({icon:'🏁',title:'DERNIER TOUR !',description:'Plus qu\'une case chacun !'});},800);
      }
    }
    const ns={...scores,[player]:{...scores[player],[category]:value===''?undefined:parseInt(value)||0}};
    const valInt = value === '' ? 0 : parseInt(value);
    // HIGHLIGHT LAST CELL
    if(!editMode && value !== '') { setLastCellKey(player+'-'+category); setTimeout(()=>setLastCellKey(null),2000); }
    
    if(value !== '') {
        const catName = categories.find(c=>c.id===category)?.name || category;
        setMoveLog([...moveLog, { player, category: catName, value: valInt, time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }]);
        setGlobalXP(prev => prev + valInt);
        // STREAK TRACKING
        if(!editMode&&valInt>=15){setStreaks(prev=>{const n=(prev[player]||0)+1;return{...prev,[player]:n};});}
        else if(!editMode){setStreaks(prev=>({...prev,[player]:0}));}
        // FIRST BLOOD
        if(moveLog.length === 0 && !editMode) {
            pushNotif({icon:'🩸',title:'FIRST BLOOD !',description:player+' ouvre le score avec '+valInt+' pts'});
            
        }
        // PERSONAL RECORD per category
        if(!editMode && valInt > 0) {
            let prevBest = 0;
            (gameHistory||[]).forEach(g=>{const grid=g.grid||{};if(grid[player]&&grid[player][category]!==undefined){const v=parseInt(grid[player][category])||0;if(v>prevBest)prevBest=v;}});
            if(valInt>prevBest&&prevBest>0) pushNotif({icon:'🏅',title:'RECORD PERSO !',description:player+' bat son record sur '+catName+' ('+prevBest+' → '+valInt+')'},4500);
        }
        // PERFECT SCORE on a category (max possible)
        const catObj = categories.find(c=>c.id===category);
        if(catObj && catObj.max && valInt === catObj.max && !editMode && !showBonusFullscreen) {
            pushNotif({icon:'💯',title:'PARFAIT !',description:player+' fait le score max sur '+catName+' !'});
            if(event){const r=event.target.getBoundingClientRect();setShockwavePos({x:r.left+r.width/2,y:r.top+r.height/2});setTimeout(()=>setShockwavePos(null),800);}
            
        }
    }
    if(value !== '' && value !== '0' && event) { const td = event.target.closest ? event.target.closest('td') : event.target.parentElement; const rect = (td || event.target).getBoundingClientRect(); const id = Date.now(); const pc = getPlayerColor(player, players.indexOf(player)); setFloatingScores([...floatingScores, { id, x: rect.left + rect.width/2, y: rect.top, value: valInt, color: pc.hex }]); setTimeout(() => setFloatingScores(prev => prev.filter(f => f.id !== id)), 1000);
        // 13. SCORE PULSE - shockwave for high scores
        if(valInt >= 25 && !editMode) {
            setShockwavePos({x:rect.left+rect.width/2,y:rect.top+rect.height/2});
            setTimeout(()=>setShockwavePos(null), valInt>=40?1200:800);
            if(valInt >= 40) { setTimeout(()=>{setShockwavePos({x:rect.left+rect.width/2,y:rect.top+rect.height/2});setTimeout(()=>setShockwavePos(null),800);},400); }
        }
    }
    // SCORE PARTICLES
    if(value !== '' && event && !editMode) {
        const rect = event.target.getBoundingClientRect();
        const pc = getPlayerColor(player, players.indexOf(player));
        const catMax = categories.find(c=>c.id===category)?.max||30;
        const isPerfect = valInt === catMax;
        const isGreat = valInt >= catMax * 0.75;
        const isZeroScore = valInt === 0;
        const pColor = isZeroScore ? '#ef4444' : isPerfect ? '#fbbf24' : isGreat ? '#10b981' : pc.hex;
        const pCount = isPerfect ? 18 : isGreat ? 12 : isZeroScore ? 4 : 6;
        const pSpread = isPerfect ? 160 : isGreat ? 130 : 80;
        const newParticles = Array.from({length: pCount}, (_, i) => ({
            id: Date.now() + i, x: rect.left + rect.width/2, y: rect.top + rect.height/2,
            color: isPerfect ? ['#fbbf24','#f59e0b','#fcd34d','#fff'][i%4] : pColor,
            dx: (Math.random()-0.5)*pSpread, dy: isZeroScore ? 20+Math.random()*40 : -30 - Math.random()*80
        }));
        setScoreParticles(prev => [...prev, ...newParticles]);
        setTimeout(() => setScoreParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id))), 1200);
    }
    // CONSECUTIVE ZEROS → MASSACRE
    if(value === '0' && !editMode) {
        const newZeros = {...consecutiveZeros, [player]: (consecutiveZeros[player]||0)+1};
        setConsecutiveZeros(newZeros);
        if(newZeros[player] >= 3) {
            const level = newZeros[player];
            const variant = level >= 5 ? 'legendary' : level >= 4 ? 'apocalypse' : 'massacre';
            setMassacreScreen({player, variant});
            setTimeout(() => setMassacreScreen(null), 2800);
            if(level >= 5) setConsecutiveZeros({...newZeros, [player]: 0});
        }
    } else if(value !== '' && !editMode) {
        setConsecutiveZeros(prev => ({...prev, [player]: 0}));
    }
    // 11. CATEGORY CELEBRATION - emoji rain per category
    if(!editMode && value !== '' && valInt > 0 && category !== 'yams') {
        const celeb = CATEGORY_CELEBRATIONS[category];
        const catMax = categories.find(c=>c.id===category)?.max||99;
        if(celeb && valInt >= catMax * 0.7) {
            setEmojiRain(celeb.emoji);
            setTimeout(() => setEmojiRain(null), 2500);
            setFunQuote(celeb.text);
            setTimeout(() => setFunQuote(null), 2500);
        }
        // 14. NARRATOR
        if(valInt >= 25) {
            const pool = NARRATOR_PHRASES.bigScore;
            setFunQuote(pool[Math.floor(Math.random() * pool.length)]);
            setTimeout(() => setFunQuote(null), 3000);
        }
    }
    if(!editMode && value === '0') {
        const pool = NARRATOR_PHRASES.zero;
        setFunQuote(pool[Math.floor(Math.random() * pool.length)]);
        setTimeout(() => setFunQuote(null), 3000);
    }
    
    // NEW: DETECT YAMS 50
    if(category==='yams' && value==='50'){
        setTimeout(() => setPendingYamsDetail({ player }), 2800);
        setConfetti('gold');
        
        pushNotif({icon:'🎲',title:'YAMS !',description:player+' a réalisé un YAMS !'}); 
        setTimeout(()=>{setConfetti(null);setEmojiRain(null);setShockwavePos(null);},4500);
    } else if(value==='0') {
        setConfetti('sad');
        pushNotif({icon:'❌',title:'BARRÉ !',description:player+' barre '+categories.find(c=>c.id===category)?.name});
        setShakeScreen(true); setTimeout(()=>setShakeScreen(false),500);
        setTimeout(()=>setGlassCrack(null),1500);
        setEmojiRain('💀'); setTimeout(()=>setEmojiRain(null),3000);
        setTimeout(()=>setConfetti(null),4000);
    } else { 
        setConfetti(null); 
    }

    const oldUp=calcUpper(player);const newUp=categories.filter(c=>c.upper).reduce((s,c)=>s+(ns[player]?.[c.id]||0),0);
    if(oldUp<63&&newUp>=63){const bonusDelay=showPerfect?2800:0;setTimeout(()=>{setConfetti('gold');setShowBonusFullscreen({player,type:'obtained'});setTimeout(()=>{setShowBonusFullscreen(null);setConfetti(null);},5500);},bonusDelay);}
    
    // BONUS LOST DETECTION
    if(categories.find(c=>c.id===category)?.upper && value !== '') {
      const upperCats = categories.filter(c=>c.upper);
      const filledUpper = upperCats.filter(c=>ns[player]?.[c.id]!==undefined);
      const emptyUpper = upperCats.filter(c=>ns[player]?.[c.id]===undefined);
      const currentUpperSum = filledUpper.reduce((s,c)=>s+(ns[player]?.[c.id]||0),0);
      const allUpperFilled = emptyUpper.length === 0;
      if(allUpperFilled && currentUpperSum < 63) {
        const lostDelay=showPerfect?2800:0;
        setTimeout(()=>{setShowBonusFullscreen({player,type:'lost'});setConfetti('sad');setTimeout(()=>{setShowBonusFullscreen(null);setConfetti(null);},5500);},lostDelay);
      } else if(!allUpperFilled && currentUpperSum < 63) {
        const maxPossibleRemaining = emptyUpper.reduce((s,c)=>s+(c.max||0),0);
        if(currentUpperSum + maxPossibleRemaining < 63) {
          const lostDelay2=showPerfect?2800:0;
          setTimeout(()=>{setShowBonusFullscreen({player,type:'lost'});setConfetti('sad');setTimeout(()=>{setShowBonusFullscreen(null);setConfetti(null);},5500);},lostDelay2);
        }
      }
    }
    
    const newTotal=newUp + categories.filter(c=>c.lower).reduce((s,c)=>s+(ns[player]?.[c.id]||0),0)+(newUp>=63?35:0);
    if(newTotal>=300&&calcTotal(player)<300){setConfetti('gold');pushNotif({icon:'🌟',title:'Score Légendaire !',description:player+' a dépassé les 300 points !'});setTimeout(()=>setConfetti(null),4500);}
    // FINISHING MOVE (player fills last cell) + CLUTCH DETECTION
    if(!editMode && value !== '') {
        const playerCats = playableCats.filter(c=>ns[player]?.[c.id]!==undefined);
        if(playerCats.length === playableCats.length) {
            const finalTotal = newTotal;
            if(!showBonusFullscreen) {
                pushNotif({icon:'✅',title:'TERMINÉ !',description:player+' a rempli toute sa grille ! ('+finalTotal+' pts)'});
            }
            // CLUTCH: Was behind, finishes grid and overtakes leader
            if(players.length >= 2) {
                const oldLeaderScore = Math.max(...players.filter(p2=>p2!==player).map(p2=>calcTotal(p2)));
                const wasLosing = calcTotal(player) <= oldLeaderScore;
                if(wasLosing && finalTotal > oldLeaderScore) {
                    setShowClutch(player);
                    setTimeout(() => setShowClutch(null), 3000);
                }
            }
        }
    }
    // COMEBACK DETECTION
    if(players.length>=2 && value !== '' && !editMode) {
      const oldLeader = players.reduce((best,p)=>calcTotal(p)>calcTotal(best)?p:best,players[0]);
      const newTotals = players.map(p => ({ name:p, total: categories.filter(c=>c.upper).reduce((s,c)=>s+(ns[p]?.[c.id]||0),0) + categories.filter(c=>c.lower).reduce((s,c)=>s+(ns[p]?.[c.id]||0),0) + (categories.filter(c=>c.upper).reduce((s,c)=>s+(ns[p]?.[c.id]||0),0)>=63?35:0) }));
      const newLeader = newTotals.reduce((best,p)=>p.total>best.total?p:best,newTotals[0]);
      if(newLeader.name === player && oldLeader !== player && newTotals.length > 1) {
        const wasLeading = newTotals.filter(p=>p.name!==player).some(p=>p.total<newLeader.total);
        if(wasLeading && !showBonusFullscreen) {
          pushNotif({icon:'🔄',title:'COMEBACK !',description:player+' prend la tête !'});
          
        }
      }
    }
    vibrate(15); setScores(ns);saveCurrentGame(ns);
    // PERFECT SCORE DETECTION
    if(!editMode && value !== '') {
      const valInt3 = parseInt(value) || 0;
      const catDef = categories.find(c=>c.id===category);
      if(catDef && catDef.max && valInt3 === catDef.max) {
        setShowPerfect({player, category: catDef.name, icon: catDef.icon, value: valInt3});
        setTimeout(() => setShowPerfect(null), 2500);
      }
    }
    // IN-GAME STREAK (no-zero streak)
    if(!editMode && value !== '') {
      const valStrk = parseInt(value) || 0;
      setInGameStreak(prev => ({...prev, [player]: valStrk > 0 ? (prev[player]||0) + 1 : 0}));
    }
    // COMBO SYSTEM
    if(!editMode && value !== '') {
      const valInt2 = parseInt(value) || 0;
      setPlayerCombos(prev => {
        const cur = prev[player] || 0;
        if(valInt2 >= 20) return {...prev, [player]: cur + 1};
        return {...prev, [player]: 0};
      });
    }
    // HEADER ANIM ON SCORE
    if(!editMode && value !== '') {
      const hdrA = parseInt(value)===0?'header-zero-shake 0.4s ease-in-out':((categories.find(c=>c.id===category)?.max||999)===parseInt(value)?'header-perfect-bounce 0.5s ease-out':'');
      if(hdrA){setHeaderAnim(prev=>({...prev,[player]:hdrA}));setTimeout(()=>setHeaderAnim(prev=>({...prev,[player]:''})),600);}
    }
    // 12b. AVATAR ANIMATIONS
    if(!editMode && value !== '') {
      const valInt4 = parseInt(value) || 0;
      if(valInt4 === 0) setAvatarAnim(prev=>({...prev,[player]:'avatar-shake'}));
      else if(valInt4 >= 40) setAvatarAnim(prev=>({...prev,[player]:'avatar-spin'}));
      else if(valInt4 >= 25) setAvatarAnim(prev=>({...prev,[player]:'avatar-bounce-big'}));
      setTimeout(() => setAvatarAnim(prev=>{const n={...prev};delete n[player];return n;}), 1500);
    }
    // 12. AVATAR REACTIONS
    if(!editMode && value !== '') {
        const reactions = {};
        if(valInt === 0) reactions[player] = '😤';
        else if(valInt >= 40) reactions[player] = '🤩';
        else if(valInt >= 25) reactions[player] = '😎';
        else reactions[player] = '😊';
        // Others react too
        const leaderBefore = players.reduce((best,p2)=>calcTotal(p2,scores)>calcTotal(best,scores)?p2:best,players[0]);
        const leaderAfter = players.reduce((best,p2)=>(p2===player?calcTotal(p2,ns):calcTotal(p2))>(player===best?calcTotal(best,ns):calcTotal(best))?p2:best,players[0]);
        if(leaderBefore !== leaderAfter && leaderBefore !== player) reactions[leaderBefore] = '😱';
        players.filter(p2=>p2!==player).forEach(p2=>{if(!reactions[p2]) reactions[p2]='🤔';});
        setAvatarReaction(reactions);
        setTimeout(() => setAvatarReaction({}), 2500);
    }
    if(editMode){ } else { 
        if(value!==''){
            setLastPlayerToPlay(player);
            setLastModifiedCell(cellKey);
            // HOT SEAT: flash next player (delayed if any animation is playing)
            const nextP = players[(players.indexOf(player)+1)%players.length];
            const gameWillBeComplete = players.every(p2=>playableCats.every(c=>ns[p2]?.[c.id]!==undefined));
            if(players.length >= 2 && !gameWillBeComplete) {
                const hasYams = category==='yams' && value==='50';
                const hasBonus = (oldUp<63&&newUp>=63) || showBonusFullscreen;
                const hasBonusLost = categories.find(c=>c.id===category)?.upper && (() => {
                    const uCats = categories.filter(c=>c.upper);
                    const filled = uCats.filter(c=>ns[player]?.[c.id]!==undefined);
                    const empty = uCats.filter(c=>ns[player]?.[c.id]===undefined);
                    const sum = filled.reduce((s,c)=>s+(ns[player]?.[c.id]||0),0);
                    if(empty.length===0 && sum<63) return true;
                    if(empty.length>0) { const maxR = empty.reduce((s,c)=>s+(c.max||0),0); if(sum+maxR<63) return true; }
                    return false;
                })();
                const hasPerfect = categories.find(c=>c.id===category)?.max === parseInt(value);
                const hasCelebration = parseInt(value) >= 25;
                const isZero = parseInt(value) === 0;
                const hasMassacre = isZero && (consecutiveZeros[player]||0) >= 2;
                const delay = (hasYams || hasBonus || hasBonusLost) ? 6500 : hasPerfect ? 3200 : hasMassacre ? 3500 : isZero ? 2000 : hasCelebration ? 2200 : 800;
                setTimeout(() => {
                    if(!showBonusFullscreen && !pendingYamsDetail && !showPerfect) {
                        setHotSeatPlayer(nextP);
                        setTimeout(() => setHotSeatPlayer(null), 1800);
                    }
                }, delay);
            }
        } else {
            setLastPlayerToPlay(null);
            setLastModifiedCell(null);
        } 
    }
  };

  // NEW FUNCTION: Save detail of Yams
  const saveYamsDetail = (val) => {
      if(!pendingYamsDetail) return;
      // Stop dice animation immediately when user selects
      setShowDiceAnim(false);
      setEmojiRain(null);
      setShockwavePos(null);
      const { player } = pendingYamsDetail;
      const newScores = { ...scores };
      if(newScores[player]) {
          // Initialize array if doesn't exist
          if(!newScores[player].yamsHistory) newScores[player].yamsHistory = [];
          newScores[player].yamsHistory.push(val);
      }
      setScores(newScores);
      saveCurrentGame(newScores);
      setPendingYamsDetail(null);
      // Trigger hot seat after Yams detail is selected
      const nextP2 = players[(players.indexOf(pendingYamsDetail.player)+1)%players.length];
      if(players.length >= 2 && !isGameComplete()) {
        setTimeout(() => { setHotSeatPlayer(nextP2); setTimeout(() => setHotSeatPlayer(null), 2000); }, 500);
      }
  };

  const toggleEditMode=()=>{if(!editMode){setScoresBeforeEdit(JSON.parse(JSON.stringify(scores)));setLastPlayerBeforeEdit(lastPlayerToPlay);setEditMode(true);}else{setEditMode(false);setScoresBeforeEdit(null);setLastPlayerBeforeEdit(null);}};
  const cancelEdit=()=>{if(scoresBeforeEdit!==null){setScores(scoresBeforeEdit);setLastPlayerToPlay(lastPlayerBeforeEdit);}setEditMode(false);setScoresBeforeEdit(null);setLastPlayerBeforeEdit(null);};
  const resetGame = (forcedLoserName = null, skipConfirm = false) => { setPlayerEntrance(true); setTimeout(() => setPlayerEntrance(false), 2000); 
      if(!forcedLoserName && !skipConfirm) { showConfirm("Commencer une nouvelle partie ?", () => { setConfirmModal(null); resetGame(null, true); }); return; } 
      setScores({}); setLastPlayerToPlay(null); setLastModifiedCell(null); setShowEndGameModal(false); setMoveLog([]); setPlayerCombos({}); setInGameStreak({});  setShowStudioModal(false); setSuddenDeathWinner(null); setSuddenDeathPlayers([]); setShowSuddenDeath(false); setGameEndShown(false);
      if(forcedLoserName && players.includes(forcedLoserName)) { setStarterName(forcedLoserName); } 
      else { const currentStarterIdx = players.indexOf(starterName); const nextStarter = players[(currentStarterIdx + 1) % players.length]; setStarterName(nextStarter); }
      // CHAOS MODE START ACTION FOR 1ST PLAYER
      saveCurrentGame({});
      const ch = PARTY_CHALLENGES[Math.floor(Math.random()*PARTY_CHALLENGES.length)];
      setActiveChallenge(ch);
      pushNotif({icon:ch.icon,title:'DÉFI DE LA PARTIE',description:ch.desc},5500);
      // VS SCREEN
      if (players.length >= 2) { setShowVSScreen(true); setTimeout(() => setShowVSScreen(false), 3000); }
  };

  const updateGameSeason = (id, newSeason) => {
     // Multi-season logic: toggle season in array
     const updatedHistory = gameHistory.map(g => {
         if (g.id !== id) return g;
         const currentSeasons = Array.isArray(g.seasons) ? g.seasons : (g.season && g.season !== 'Aucune' ? [g.season] : []);
         let newSeasons;
         if (currentSeasons.includes(newSeason)) {
             newSeasons = currentSeasons.filter(s => s !== newSeason);
         } else {
             newSeasons = [...currentSeasons, newSeason];
         }
         return { ...g, seasons: newSeasons, season: null }; // remove legacy string
     });
     setGameHistory(updatedHistory);
     saveHistory(updatedHistory);
     // Don't close modal, allow multiple selections
  };

  // HALF-TIME POPUP
  useEffect(()=>{
    if(!isGameStarted()||isGameComplete()||players.length<2) return;
    const totalCells=players.length*playableCats.length;
    const filledCells=players.reduce((s,p)=>s+playableCats.filter(c=>scores[p]?.[c.id]!==undefined).length,0);
    const pct=filledCells/totalCells;
    if(pct>=0.5&&pct<0.55&&!showBonusFullscreen){
      const leader=players.reduce((best,p)=>calcTotal(p)>calcTotal(best)?p:best,players[0]);
      pushNotif({icon:'⏱️',title:'MI-TEMPS !',description:leader+' mène avec '+calcTotal(leader)+' pts'});
      
    }
  },[scores]);

  useEffect(()=>{if(isGameComplete()&&!showEndGameModal&&!showSuddenDeath&&!gameEndShown&&!showVictoryAnimation){
    setGameEndShown(true);
    // Check challenges
    if(activeChallenge){players.forEach(p=>{try{const grid=scores[p]||{};const total=calcTotal(p);if(activeChallenge.check(grid,total))pushNotif({icon:'🏆',title:'DÉFI RÉUSSI !',description:p+' : '+activeChallenge.desc},5500);}catch(e){}});}
    const winners = getWinner();
    if(winners.length > 1 && players.length > 1) {
      // TIE! SUDDEN DEATH
      setSuddenDeathPlayers(winners);
      setSuddenDeathWinner(null);
      setShowSuddenDeath(true);
      setConfetti('gold');
      setTimeout(()=>setConfetti(null),3000);
    } else {
      setShowCinematic(true);
      setTimeout(()=>{
        setShowCinematic(false);
        if(players.length>=3){setShowPodiumAnim(true);setConfetti('winner');setTimeout(()=>{setShowPodiumAnim(false);setShowVictoryAnimation(true);setTimeout(()=>{setShowVictoryAnimation(false);setShowEndGameModal(true);setConfetti(null);},3500);},4500);}
        else{setShowVictoryAnimation(true);setConfetti('winner');setTimeout(()=>{setShowVictoryAnimation(false);setShowEndGameModal(true);setConfetti(null);},3500);}
      },3000);
    }
  }},[scores,showEndGameModal,showSuddenDeath]);
  
  // LOGIQUE GAGES MIXTES
  useEffect(() => { 
    if (showEndGameModal && !currentGage) {
        let pool = [];
        if (enableDefaultGages) pool = [...pool, ...DEFAULT_GAGES];
        if (customGages && customGages.length > 0) {
            const activeCustoms = customGages.filter(g => g.active).map(g => g.text);
            pool = [...pool, ...activeCustoms];
        }
        
        if (pool.length > 0) {
            setCurrentGage(pool[Math.floor(Math.random() * pool.length)]);
        } else {
            setCurrentGage("Aucun gage sélectionné !");
        }
    } else if (!showEndGameModal) { 
        setCurrentGage(null); 
    } 
  }, [showEndGameModal, customGages, enableDefaultGages]);

  const saveGameFromModal=()=>{ 
      const w=getWinner(); const l=getLoser(); 
      const currentSeasons = activeSeason && activeSeason !== 'Aucune' ? [activeSeason] : [];
      const game={id:Date.now(),seasons:currentSeasons,date:new Date().toLocaleDateString('fr-FR'),time:new Date().toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}),players:players.map(p=>({name:p,score:calcTotal(p),isWinner:w.includes(p),yamsCount:scores[p]?.yams===50?1:0,suddenDeathWin:suddenDeathWinner===p,suddenDeathScore:scores[p]?.suddenDeathScore||null})), grid: JSON.parse(JSON.stringify(scores)), moveLog: JSON.parse(JSON.stringify(moveLog)), suddenDeath: suddenDeathWinner ? true : false, suddenDeathWinner: suddenDeathWinner || null, note: gameNote || null}; 
      const nh=[game,...gameHistory]; setGameHistory(nh); saveHistory(nh); 
      setGlobalXP(prev => prev + 100);
      setGameNote('');
      resetGame(l ? l.name : null); 
  };
  const deleteGame= id=>{const nh=gameHistory.filter(g=>g.id!==id);setGameHistory(nh);saveHistory(nh);};
  const shareScore=async()=>{const w=getWinner();const t='Partie YAMS terminée ! Gagnant: '+w[0]+' avec '+calcTotal(w[0])+' points';if(navigator.share){try{await navigator.share({text:t});}catch(e){navigator.clipboard.writeText(t);alert('Score copié!');}}else{navigator.clipboard.writeText(t);alert('Score copié!');}};
  const exportData=()=>{const b=new Blob([JSON.stringify({gameHistory,exportDate:new Date().toISOString(),version:'1.0'},null,2)],{type:'application/json'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='yams-backup-'+new Date().toISOString().split('T')[0]+'.json';document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(u);};
  const importData=e=>{const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=ev=>{try{const d=JSON.parse(ev.target.result);if(d.gameHistory&&Array.isArray(d.gameHistory)){setGameHistory(d.gameHistory);saveHistory(d.gameHistory);alert('Parties importées avec succès!');}else alert('Fichier invalide');}catch(err){alert('Erreur lors de l\'import');}};reader.readAsText(file);};

  // DYNAMIC BACKGROUND based on game state
  const dynamicBgStyle = {};

  // Compute all known seasons from state + history
  const allSeasons = useMemo(() => {
      const set = new Set(seasons);
      (gameHistory||[]).forEach(g => {
          const gs = Array.isArray(g.seasons) ? g.seasons : (g.season ? [g.season] : []);
          gs.forEach(s => { if(s && s !== 'Aucune') set.add(s); });
      });
      return [...set];
  }, [seasons, gameHistory]);

  // 14. NARRATOR - progress-based quotes
  useEffect(() => {
    if(!isGameStarted() || isGameComplete() || editMode) return;
    const totalCells = players.length * playableCats.length;
    const filled = players.reduce((s,p) => s + playableCats.filter(c=>scores[p]?.[c.id]!==undefined).length, 0);
    const pct = totalCells > 0 ? filled / totalCells : 0;
    if(filled === players.length && pct < 0.15) {
        const q = NARRATOR_PHRASES.start[Math.floor(Math.random()*NARRATOR_PHRASES.start.length)];
        setFunQuote(q); setTimeout(()=>setFunQuote(null),3000);
    }
  }, [players.length > 0 && playableCats.filter(c=>scores[players[0]]?.[c.id]!==undefined).length]);

  // Filtrer l'historique par saison active (POUR STATS)
  const filteredHistory = useMemo(() => {
      if(!gameHistory || !Array.isArray(gameHistory)) return [];
      if(!statsFilterSeason || statsFilterSeason === 'Toutes') return gameHistory;
      return gameHistory.filter(g => {
          const gSeasons = Array.isArray(g.seasons) ? g.seasons : (g.season ? [g.season] : []);
          if(statsFilterSeason === 'Aucune') return gSeasons.length === 0;
          return gSeasons.includes(statsFilterSeason);
      }); 
  }, [gameHistory, statsFilterSeason]);
  
  // Filtrer historique pour l'onglet historique
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
      filteredHistory.forEach(g => (g.players||g.results||[]).forEach(p => allPlayerNames.add(p.name))); 
      allPlayerNames.forEach(name => { 
          stats[name] = { wins:0, games:0, maxScore:0, totalScore:0, yamsCount:0, maxConsecutiveWins:0, bonusCount:0, upperSum:0, lowerSum:0, historyGames:0,
          // Stats pour la chance aux dés
          totalOnes:0, totalTwos:0, totalThrees:0, totalFours:0, totalFives:0, totalSixes:0 }; 
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
                  categories.filter(c => c.upper).forEach(cat => { const val = gameGrid[p.name][cat.id]; if (val !== undefined && val !== "") { currentUpperSum += parseInt(val); } });
                  if (currentUpperSum >= 63) { s.bonusCount++; }
                  const totals = getPlayerTotals(p.name, gameGrid); s.upperSum += totals.upper; s.lowerSum += totals.lower; 
                  // Accumulate dice luck (FIX: Ensure parsing works)
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
      const tempStreaks = {}; allPlayerNames.forEach(n => tempStreaks[n] = 0); for(let i=filteredHistory.length-1; i>=0; i--){ const game = filteredHistory[i]; const participants = game.players || game.results || []; participants.forEach(p => { if(!stats[p.name]) return; if(p.isWinner) { tempStreaks[p.name] = (tempStreaks[p.name] || 0) + 1; if(tempStreaks[p.name] > stats[p.name].maxConsecutiveWins) stats[p.name].maxConsecutiveWins = tempStreaks[p.name]; } else { tempStreaks[p.name] = 0; } }); } return Object.entries(stats).map(([name,d])=>({ name, ...d, avgScore: d.games > 0 ? Math.round(d.totalScore/d.games) : 0, currentStreak: streaks[name], bonusRate: d.historyGames > 0 ? Math.round((d.bonusCount/d.historyGames)*100) : 0, avgUpper: d.historyGames > 0 ? Math.round(d.upperSum/d.historyGames) : 0, avgLower: d.historyGames > 0 ? Math.round(d.lowerSum/d.historyGames) : 0 })).sort((a,b)=>b.wins-a.wins); }, [filteredHistory]);
  
  const hallOfFame = useMemo(() => { if(!filteredHistory || filteredHistory.length < 2) return null; let biggestWin = { gap: -1 }; let tightestWin = { gap: 9999 }; let lowestWinner = { score: 9999 }; let highestLoser = { score: -1 }; filteredHistory.forEach(g => { const parts = [...(g.players || g.results || [])].sort((a,b) => b.score - a.score); if(parts.length < 2) return; const winner = parts[0]; const second = parts[1]; const gap = winner.score - second.score; if(gap > biggestWin.gap) biggestWin = { gap, winner: winner.name, second: second.name, date: g.date }; if(gap < tightestWin.gap) tightestWin = { gap, winner: winner.name, second: second.name, date: g.date }; if(winner.score < lowestWinner.score) lowestWinner = { score: winner.score, name: winner.name, date: g.date }; if(second.score > highestLoser.score) highestLoser = { score: second.score, name: second.name, date: g.date }; }); return { biggestWin, tightestWin, lowestWinner, highestLoser }; }, [filteredHistory]);
  const getPieData = () => playerStats.filter(s=>s.wins>0).map(s=>({name:s.name,value:s.wins}));
  const isFoggy = (p) => fogMode && !isGameComplete() && getNextPlayer() !== p;
  const getLeader = () => { if(isGameComplete() || hideTotals || fogMode) return null; const totals = players.map(p => ({name: p, score: calcTotal(p)})); const max = Math.max(...totals.map(t => t.score)); if(max === 0) return null; const leaders = totals.filter(t => t.score === max); if (leaders.length > 1) return null; return leaders[0].name; };
  const leader = getLeader();

  const quickEdit = () => {
      setShowEndGameModal(false);
      setEditMode(true);
      setScoresBeforeEdit(JSON.parse(JSON.stringify(scores)));
      setLastPlayerBeforeEdit(lastPlayerToPlay);
  };
  
  // FIX REPLAY: Simple safe display function
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
  
  // TIMELAPSE
  const stopPlayback = () => { if (replayIntervalRef.current) clearInterval(replayIntervalRef.current); setIsReplaying(false); setReplayGame(null); };
  const playTimelapse = () => { if(!replayGame || !replayGame.moveLog) return; setIsReplaying(true); const log = replayGame.moveLog; const tempScores = {}; players.forEach(p => tempScores[p] = {}); let step = 0; replayIntervalRef.current = setInterval(() => { if(step >= log.length) { clearInterval(replayIntervalRef.current); setIsReplaying(false); return; } const move = log[step]; tempScores[move.player] = { ...tempScores[move.player], [categories.find(c=>c.name===move.category)?.id || move.category.toLowerCase()]: parseInt(move.value) }; setReplayGame(prev => ({...prev, grid: JSON.parse(JSON.stringify(tempScores))})); step++; }, 500); };

  // REPLAY RENDERER
  if(replayGame) { const replayPlayers = Object.keys(replayGame.grid || {}); return ( <div className={'min-h-screen bg-gradient-to-br '+T.bg+' p-2 sm:p-4 md:p-6'} style={{fontFamily: FONT_OPTIONS[customFont]?.family || 'system-ui, sans-serif', '--anim-speed': animSpeed, fontSize: `${fontScale}rem`}}> <div className="max-w-7xl mx-auto space-y-4"> <div className={'bg-gradient-to-br '+T.card+' backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-6 flex justify-between items-center'}> <div className="flex items-center gap-4"> <button onClick={stopPlayback} className="p-2 bg-white/10 rounded-full hover:bg-white/20"><ArrowLeft /></button> <div><h2 className="text-xl font-bold text-white">Replay du {replayGame.date}</h2><p className="text-sm text-gray-400">Lecture seule</p></div> </div> {replayGame.moveLog && <button onClick={playTimelapse} disabled={isReplaying} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2">{isReplaying ? <Pause size={18}/> : <Play size={18}/>} Timelapse</button>} </div> <div className={'bg-gradient-to-br '+T.card+' backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-4 overflow-x-auto'}> <table className="w-full table-fixed"> <thead><tr className="border-b border-white/20"><th className="text-left p-3 text-white">Catégorie</th>{replayPlayers.map(p=><th key={p} className="p-3 text-center text-white">{p}</th>)}</tr></thead> <tbody>{categories.map(cat => {if(cat.upperHeader || cat.upperDivider || cat.divider) return null;if(cat.upperTotal || cat.bonus || cat.upperGrandTotal || cat.lowerTotal) return null;return (<tr key={cat.id} className="border-b border-white/10 hover:bg-white/5"><td className="p-3 text-gray-300 font-bold">{cat.name}</td>{replayPlayers.map(p => (<td key={p} className="p-2 text-center font-bold text-white">{(replayGame.grid && replayGame.grid[p] && replayGame.grid[p][cat.id] !== undefined) ? replayGame.grid[p][cat.id] : '-'}</td>))}</tr>);})}<tr className="bg-white/10 font-black"><td className="p-4 text-white">TOTAL</td>{replayPlayers.map(p=><td key={p} className="p-4 text-center text-white text-xl">{getSafeReplayScore(p, replayGame.grid)}</td>)}</tr></tbody> </table> </div> </div> </div> ); }

  // CALCULER LE CLASSEMENT TEMPS RÉEL (Pour les médailles) - GESTION ÉGALITÉ
  const getRank = (playerName) => {
    // Calcul des totaux pour tous les joueurs
    const scoresList = players.map(p => ({ name: p, score: calcTotal(p) }));
    
    // Tri décroissant
    scoresList.sort((a, b) => b.score - a.score);

    // Trouver le score du joueur actuel
    const myScore = scoresList.find(s => s.name === playerName)?.score || 0;

    // Le rang est 1 + le nombre de joueurs qui ont strictement plus
    const rank = scoresList.filter(s => s.score > myScore).length + 1;
    
    return rank;
  };

  // CALCUL VRAIES STATS D'ECHEC (CORRECTION CRASH & DOUBLON) - DEFINE HERE
  const calculateGlobalFailures = (target) => {
    const failures = {};
    playableCats.forEach(cat => failures[cat.id] = 0);
    let totalGames = 0;
    
    // SAFE ACCESS: on vérifie que gameHistory existe
    const historyToUse = statsFilterSeason === 'Toutes' ? (gameHistory || []) : (gameHistory || []).filter(g => {
        const gSeasons = Array.isArray(g.seasons) ? g.seasons : (g.season ? [g.season] : []);
        if(statsFilterSeason === 'Aucune') return gSeasons.length === 0;
        return gSeasons.includes(statsFilterSeason);
    });

    if (!historyToUse || historyToUse.length === 0) return { failures: [], totalGames: 0 };

    historyToUse.forEach(game => {
        const participants = game.players || game.results || [];
        const grid = game.grid || {};
        participants.forEach(p => {
            if (target === 'GLOBAL' || p.name === target) {
                const playerGrid = grid[p.name];
                if (playerGrid) {
                    totalGames++;
                    Object.keys(failures).forEach(catId => { if (playerGrid[catId] === 0) failures[catId]++; });
                }
            }
        });
    });
    const sortedFailures = Object.entries(failures)
        .sort(([,a], [,b]) => b - a)
        .map(([key, value]) => ({ 
            id: key, name: categories.find(c => c.id === key)?.name || key, count: value,
            rate: totalGames > 0 ? Math.round((value / totalGames) * 100) : 0
        }));
    return { failures: sortedFailures, totalGames: Math.max(1, totalGames) };
  };

  // Yams Distribution Calc

  // AI SCORE PREDICTION
  const predictFinalScore = (player) => {
      const pStat = playerStats.find(s => s.name === player);
      const filledCats = playableCats.filter(c => scores[player]?.[c.id] !== undefined);
      const emptyCats = playableCats.filter(c => scores[player]?.[c.id] === undefined);
      if (filledCats.length === 0) return pStat ? pStat.avgScore : null;
      if (emptyCats.length === 0) return calcTotal(player);
      const currentScore = filledCats.reduce((s, c) => s + (scores[player]?.[c.id] || 0), 0);
      const avgPerCat = currentScore / filledCats.length;
      // Use historical average per remaining category if available
      let predictedRemaining = 0;
      emptyCats.forEach(cat => {
          let catAvg = 0; let catCount = 0;
          (gameHistory || []).forEach(g => {
              const grid = g.grid || {};
              if (grid[player] && grid[player][cat.id] !== undefined) {
                  catAvg += parseInt(grid[player][cat.id]) || 0;
                  catCount++;
              }
          });
          predictedRemaining += catCount > 0 ? catAvg / catCount : avgPerCat;
      });
      const upperNow = categories.filter(c => c.upper).reduce((s, c) => s + (scores[player]?.[c.id] || 0), 0);
      const upperEmpty = categories.filter(c => c.upper && scores[player]?.[c.id] === undefined);
      let predictedUpper = upperNow;
      upperEmpty.forEach(cat => {
          let catAvg = 0; let catCount = 0;
          (gameHistory || []).forEach(g => { const grid = g.grid || {}; if (grid[player] && grid[player][cat.id] !== undefined) { catAvg += parseInt(grid[player][cat.id]) || 0; catCount++; } });
          predictedUpper += catCount > 0 ? catAvg / catCount : (cat.max || 0) * 0.5;
      });
      const predictedBonus = predictedUpper >= 63 ? 35 : 0;
      return Math.round(currentScore + predictedRemaining + predictedBonus);
  };

  // GET PLAYER COLOR
  const getPlayerColor = (player, idx) => {
      if (playerColors[player]) return PLAYER_COLORS.find(c => c.id === playerColors[player]) || PLAYER_COLORS[idx % PLAYER_COLORS.length];
      return PLAYER_COLORS[idx % PLAYER_COLORS.length];
  };

  // GET PLAYER WEATHER STATE
  const getPlayerWeather = (player) => {
      const rank = getRank(player);
      const totalPlayers = players.length;
      const totals = players.map(p => calcTotal(p)).sort((a, b) => b - a);
      const gap = totals[0] - totals[totals.length - 1];

      if (rank === 1 && gap > 30) return 'sunny';
      if (rank === 1) return 'clear';
      if (rank === totalPlayers && gap > 30) return 'rain';
      if (rank === totalPlayers) return 'cloudy';
      return 'neutral';
  };

  // SPLASH SCREEN
  if(showSplash) {
    const totalGames = gameHistory.length;
    const leader = playerStats.length > 0 ? playerStats.reduce((a,b)=>a.wins>b.wins?a:b) : null;
    const lastGame = gameHistory.length > 0 ? gameHistory[gameHistory.length-1] : null;
    const funStat = getSplashFunStat(gameHistory, playerStats);
    const xpLevel = getXPLevel(globalXP);
    return (
      <div className={'min-h-screen bg-gradient-to-br '+T.bg+' flex flex-col items-center justify-center p-6 relative overflow-hidden'}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">{Array.from({length:20},(_,i)=>i).map(i=><div key={i} className="absolute text-4xl opacity-[0.04]" style={{left:Math.random()*100+'%',top:Math.random()*100+'%',animation:`splash-dice 1.5s ease-out ${i*0.15}s backwards`,transform:`rotate(${i*45}deg)`}}>🎲</div>)}</div>
        <div className="relative z-10 text-center">
          <div className="flex gap-3 mb-6 justify-center">{['⚀','⚁','⚂','⚃','⚄','⚅'].map((d,i)=><span key={i} className="text-4xl sm:text-5xl" style={{animation:`splash-dice-roll 0.6s cubic-bezier(0.34,1.56,0.64,1) ${0.1+i*0.12}s backwards`,display:'inline-block',filter:`drop-shadow(0 0 8px ${T.primary}60)`}}>{d}</span>)}</div>
          <h1 className="text-5xl sm:text-7xl font-black text-white mb-2 overflow-hidden">{'YAMS'.split('').map((c,i)=><span key={i} className="inline-block" style={{animation:`splash-letter 0.5s cubic-bezier(0.34,1.56,0.64,1) ${0.5+i*0.1}s backwards`}}>{c}</span>)}</h1>
          <div className="h-1 w-32 mx-auto rounded-full mb-4" style={{background:`linear-gradient(90deg,transparent,${T.primary},transparent)`,animation:'splash-line 1s ease-out 1s backwards'}}></div>
          <p className="text-lg font-bold mb-4 opacity-60" style={{color:T.primary,animation:'splash-text 0.5s ease-out 1.1s backwards'}}>Ultimate Scorekeeper</p>
          {/* XP LEVEL DISPLAY */}
          {globalXP > 0 && <div className="mb-6 max-w-xs mx-auto" style={{animation:'splash-stat 0.4s ease-out 0.6s backwards'}}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-400 font-bold">{xpLevel.icon} Niv.{xpLevel.level} {xpLevel.name}</span>
              <span className="font-bold" style={{color:T.primary}}>{globalXP} XP</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full rounded-full xp-bar-fill" style={{width:xpLevel.progress+'%',background:`linear-gradient(90deg,${T.primary},${T.secondary})`,['--xp-width']:xpLevel.progress+'%'}}/>
            </div>
            {xpLevel.next && <div className="text-[9px] text-gray-500 mt-1 text-right">{xpLevel.next.xp - globalXP} XP → Niv.{xpLevel.next.level}</div>}
          </div>}
          {/* FUN STAT */}
          {totalGames > 0 && <div className="mb-6 max-w-sm mx-auto" style={{animation:'splash-stat 0.4s ease-out 0.65s backwards'}}>
            <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 backdrop-blur-sm">
              <div className="text-sm text-gray-300 font-medium">{funStat}</div>
            </div>
          </div>}
          {totalGames>0&&<div className="flex flex-wrap justify-center gap-3 mb-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 backdrop-blur-sm" style={{animation:'splash-stat 0.4s ease-out 0.7s backwards'}}><div className="text-2xl font-black text-white">{totalGames}</div><div className="text-[10px] text-gray-400 font-bold uppercase">Parties</div></div>
            {leader&&<div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 backdrop-blur-sm" style={{animation:'splash-stat 0.4s ease-out 0.8s backwards'}}><div className="text-2xl font-black text-white">{leader.name}</div><div className="text-[10px] text-gray-400 font-bold uppercase">👑 Leader ({leader.wins}W)</div></div>}
            {lastGame&&<div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 backdrop-blur-sm" style={{animation:'splash-stat 0.4s ease-out 0.9s backwards'}}><div className="text-2xl font-black text-white">{lastGame.date||'?'}</div><div className="text-[10px] text-gray-400 font-bold uppercase">Dernière partie</div></div>}
          </div>}
          <button onClick={()=>setShowSplash(false)} className="px-10 py-4 rounded-2xl font-black text-xl text-white transition-all hover:scale-105 active:scale-95 shadow-2xl" style={{background:`linear-gradient(135deg,${T.primary},${T.secondary})`,animation:'splash-btn 0.5s cubic-bezier(0.34,1.56,0.64,1) 1.1s backwards',boxShadow:`0 10px 40px ${T.primary}40`}}>🎮 Jouer</button>
          <div className="mt-6 flex justify-center gap-3 flex-wrap" style={{animation:'splash-btn 0.3s ease-out 1.4s backwards'}}>
            {Object.entries(THEMES_CONFIG).map(([k,v])=><button key={k} onClick={()=>setTheme(k)} className={'w-8 h-8 rounded-full border-2 transition-all hover:scale-110 '+(theme===k?'border-white scale-110':'border-white/20')} style={{background:v.primary}} title={v.name}/>)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEndHandler} className={'min-h-screen bg-gradient-to-br '+T.bg+' p-2 sm:p-4 md:p-6 overflow-x-hidden transition-all duration-[1500ms] ease-in-out '+(themeTransition?'opacity-95':'opacity-100')} style={{...dynamicBgStyle, fontFamily: FONT_OPTIONS[customFont]?.family || 'system-ui, sans-serif'}}>
      <InteractiveParticles themeKey={theme}/>
      {(()=>{const bp=THEME_BG_PARTICLES[theme];if(!bp)return null;return <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">{Array.from({length:bp.count},(_,i)=>i).map(i=><div key={i} className="absolute" style={{left:`${(i*7.3+3)%100}%`,top:`${(i*13.7+5)%100}%`,opacity:bp.opacity,fontSize:`${10+i%3*6}px`,animation:`bg-float ${bp.speed+i*3}s ease-in-out ${i*2}s infinite alternate`,color:'white'}}>{bp.particles[i%bp.particles.length]}</div>)}</div>;})()}
      {/* GAME PROGRESS BAR */}
      {currentTab==='game'&&players.length>0&&isGameStarted()&&!isGameComplete()&&(()=>{
        const t2=players.length*playableCats.length;const f2=players.reduce((s,p)=>s+playableCats.filter(c=>scores[p]?.[c.id]!==undefined).length,0);const pct2=t2>0?Math.round((f2/t2)*100):0;
        return <div className="fixed top-0 left-0 right-0 z-[90] h-1" style={{background:'rgba(0,0,0,0.3)'}}>
          <div className="h-full rounded-r-full transition-all duration-700 ease-out" style={{width:pct2+'%',background:`linear-gradient(90deg,${T.primary},${T.secondary})`,boxShadow:`0 0 10px ${T.primary}60`}}></div>
        </div>;
      })()}
      {/* VS FIGHTING SCREEN */}
      {showVSScreen&&players.length>=2&&<div className="fixed inset-0 z-[300] bg-black flex items-center justify-center overflow-hidden" style={{animation:'cinema-darken 0.3s ease-out'}}>
        <div className="absolute inset-0" style={{background:`linear-gradient(135deg,${getPlayerColor(players[0],0).hex}20,black,${getPlayerColor(players[1],1).hex}20)`}}/>
        {/* Lightning bolt in center */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><div className="text-9xl font-black text-white opacity-10" style={{animation:'vs-flash 0.5s ease-out 0.3s backwards'}}>⚡</div></div>
        <div className="relative z-10 flex items-center justify-center gap-4 sm:gap-8 w-full px-4">
          {/* LEFT PLAYER */}
          <div className="flex-1 text-center" style={{animation:'vs-slide-left 0.5s cubic-bezier(0.34,1.56,0.64,1)'}}>
            <div className="text-6xl sm:text-8xl mb-3" style={{filter:`drop-shadow(0 0 20px ${getPlayerColor(players[0],0).hex})`}}>{playerAvatars[players[0]]||'👤'}</div>
            <div className="text-white font-black text-lg sm:text-2xl truncate">{players[0]}</div>
            <div className="text-xs font-bold mt-1" style={{color:getPlayerColor(players[0],0).hex}}>{(()=>{const t=getPlayerTitle(playerStats.find(s=>s.name===players[0]));return t?t.icon+' '+t.title:'🆕 Nouveau';})()}</div>
          </div>
          {/* VS */}
          <div className="flex flex-col items-center" style={{animation:'vs-text 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.2s backwards'}}>
            <div className="text-4xl sm:text-6xl font-black text-white" style={{textShadow:'0 0 40px rgba(255,255,255,0.5)',letterSpacing:'0.1em'}}>VS</div>
            {players.length>2&&<div className="text-gray-500 text-xs mt-2 font-bold">+{players.length-2} joueur{players.length>3?'s':''}</div>}
          </div>
          {/* RIGHT PLAYER */}
          <div className="flex-1 text-center" style={{animation:'vs-slide-right 0.5s cubic-bezier(0.34,1.56,0.64,1)'}}>
            <div className="text-6xl sm:text-8xl mb-3" style={{filter:`drop-shadow(0 0 20px ${getPlayerColor(players[1],1).hex})`}}>{playerAvatars[players[1]]||'👤'}</div>
            <div className="text-white font-black text-lg sm:text-2xl truncate">{players[1]}</div>
            <div className="text-xs font-bold mt-1" style={{color:getPlayerColor(players[1],1).hex}}>{(()=>{const t=getPlayerTitle(playerStats.find(s=>s.name===players[1]));return t?t.icon+' '+t.title:'🆕 Nouveau';})()}</div>
          </div>
        </div>
        {/* FIGHT TEXT */}
        <div className="absolute bottom-12 left-0 right-0 text-center" style={{animation:'vs-fight 0.3s cubic-bezier(0.34,1.56,0.64,1) 0.6s backwards'}}>
          <span className="text-2xl font-black tracking-[0.3em] uppercase" style={{background:`linear-gradient(90deg,${getPlayerColor(players[0],0).hex},#fff,${getPlayerColor(players[1],1).hex})`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>C'est parti !</span>
        </div>
      </div>}
      {/* MODAL YAMS DETAIL */}
      {pendingYamsDetail && (
        <div className="fixed inset-0 bg-black/90 z-[200] flex items-center justify-center p-4 modal-backdrop">
            <div className="modal-content bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-yellow-500/50 rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl shadow-yellow-500/20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl"></div>
                <div className="text-5xl mb-3" style={{animation:'trophy-float 3s ease-in-out infinite'}}>{({modern:'🎲',sunset:'🌅',ocean:'🌊',forest:'🌲',galaxy:'🌌',candy:'🍬',fire:'🔥',ice:'❄️',neon:'💜',vintage:'🎰'})[theme]||'🎲'}</div>
                <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-wide winner-glow">YAMS !</h3>
                <p className="text-gray-400 text-sm mb-6 font-medium">Quel chiffre as-tu obtenu ?</p>
                <div className="grid grid-cols-3 gap-3 mb-4">
                    {[1, 2, 3, 4, 5, 6].map(val => (
                        <button 
                            key={val}
                            onClick={() => saveYamsDetail(val)}
                            className="aspect-square bg-white/5 hover:bg-yellow-500/20 border border-white/10 hover:border-yellow-500/50 rounded-2xl flex items-center justify-center text-3xl transition-all duration-300 hover:scale-110 active:scale-95 group hover:shadow-lg hover:shadow-yellow-500/20"
                            style={{animation:`bounce-in 0.4s cubic-bezier(0.34,1.56,0.64,1) ${val*0.06}s backwards`}}
                        >
                            <span className="group-hover:scale-125 transition-transform duration-300">
                                {['','⚀','⚁','⚂','⚃','⚄','⚅'][val]}
                            </span>
                        </button>
                    ))}
                </div>
                <div className="text-[10px] text-gray-500 italic">Cela servira pour tes statistiques futures !</div>
            </div>
        </div>
      )}

      {floatingScores.map(fs => <FloatingScore key={fs.id} x={fs.x} y={fs.y} value={fs.value} color={fs.color} />)}
      {confetti&&confetti!=='sad'&&(()=>{const tcs=THEME_CONFETTI_STYLE[theme]||THEME_CONFETTI_STYLE.modern;const animName=tcs.anim;const isUp=tcs.dir==='up';return <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" style={confetti==='winner'?{filter:`hue-rotate(${(()=>{const w=getWinner()[0];const pc=getPlayerColor(w,players.indexOf(w));return pc?.hue||0;})()}deg)`}:{}}>{[...Array(60)].map((_,i)=>{const tc=THEME_CONFETTI[theme]||THEME_CONFETTI.modern;const pool=(confetti==='gold'||confetti==='winner')?[...tc,'🎉','🎊','🏆']:confetti==='bonus'?[...tc,'🎁','💰']:tc;return <div key={i} className="confetti-piece" style={{left:Math.random()*100+'%',[isUp?'bottom':'top']:isUp?'-30px':'-30px',fontSize:(18+Math.random()*16)+'px',animation:`${animName} ${2.5+Math.random()*3}s linear ${Math.random()*2.5}s both`}}>{pool[Math.floor(Math.random()*pool.length)]}</div>;})}</div>;})()}
      {confetti==='sad'&&<div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"><div className="text-9xl" style={{animation:'sad-pulse 1.5s ease-in-out infinite'}}>❌</div></div>}
      {/* COUNTDOWN CINEMATIC */}
      {showCountdown&&<div className="fixed inset-0 z-[280] flex items-center justify-center pointer-events-none">
        <div className="text-center" style={{animation:'countdown-pop 1.2s cubic-bezier(0.34,1.56,0.64,1)'}}>
          <div className="text-[12rem] font-black text-white leading-none" style={{textShadow:'0 0 80px rgba(250,204,21,0.5), 0 0 120px rgba(250,204,21,0.3)',animation:'countdown-pulse 0.4s ease-in-out'}}>{showCountdown}</div>
          <div className="text-xl font-black text-yellow-400 uppercase tracking-[0.5em] mt-4" style={{animation:'fade-in-scale 0.3s ease-out 0.2s backwards'}}>{showCountdown===1?'DERNIÈRE CASE':'CASES RESTANTES'}</div>
        </div>
      </div>}
      {/* CLUTCH ANIMATION */}
      {showClutch&&<div className="fixed inset-0 z-[270] flex items-center justify-center pointer-events-none" style={{animation:'clutch-flash 3s ease-out forwards'}}>
        <div className="text-center">
          <div className="text-8xl mb-4" style={{animation:'clutch-icon 0.6s cubic-bezier(0.34,1.56,0.64,1)'}}>⚡</div>
          <div className="text-5xl sm:text-6xl font-black text-yellow-400 tracking-wider" style={{textShadow:'0 0 40px rgba(250,204,21,0.6)',animation:'clutch-text 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.2s backwards'}}>CLUTCH !</div>
          <div className="text-xl font-bold text-white mt-2" style={{animation:'fade-in-scale 0.4s ease-out 0.4s backwards'}}>{showClutch} renverse la table !</div>
        </div>
      </div>}
      {/* PHOTO FINISH */}
      {showPhotoFinish&&<div className="fixed inset-0 z-[270] flex items-center justify-center bg-black/90 pointer-events-none" style={{animation:'photo-flash 3s ease-out forwards'}}>
        <div className="text-center">
          <div className="text-8xl mb-4" style={{animation:'photo-camera 1s ease-in-out infinite'}}>📸</div>
          <div className="text-5xl sm:text-6xl font-black text-white tracking-widest" style={{animation:'photo-text 0.6s cubic-bezier(0.34,1.56,0.64,1)'}}>PHOTO FINISH</div>
          <div className="text-xl font-bold text-yellow-400 mt-3" style={{animation:'fade-in-scale 0.4s ease-out 0.3s backwards'}}>Écart ≤ 5 pts !</div>
          <div className="flex justify-center gap-6 mt-6">{players.map(p=>({name:p,score:calcTotal(p)})).sort((a,b)=>b.score-a.score).slice(0,2).map((p,i)=>
            <div key={p.name} className="text-center" style={{animation:`fade-in-scale 0.4s ease-out ${0.5+i*0.2}s backwards`}}>
              <div className="text-4xl mb-1">{playerAvatars[p.name]||'👤'}</div>
              <div className="text-white font-black text-lg">{p.name}</div>
              <div className="text-3xl font-black" style={{color:i===0?'#fbbf24':'#94a3b8'}}>{p.score}</div>
            </div>
          )}</div>
        </div>
      </div>}
      {/* HOT SEAT OVERLAY */}
      {hotSeatPlayer&&(()=>{const hspc=getPlayerColor(hotSeatPlayer,players.indexOf(hotSeatPlayer));const remCats=playableCats.filter(c=>scores[hotSeatPlayer]?.[c.id]===undefined);return <div className="fixed inset-0 z-[250] flex items-center justify-center pointer-events-none" style={{animation:'hotseat-in 0.3s ease-out'}}>
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-40 sm:h-52" style={{background:`linear-gradient(90deg,transparent,${hspc.hex}25,${hspc.hex}40,${hspc.hex}25,transparent)`,borderTop:`3px solid ${hspc.hex}80`,borderBottom:`3px solid ${hspc.hex}80`,animation:'sf-bar 0.4s cubic-bezier(0.22,1,0.36,1)'}}></div>
        <div className="relative text-center z-10">
          <div className="text-8xl sm:text-9xl mb-3" style={{animation:'sf-avatar 0.5s cubic-bezier(0.34,1.56,0.64,1)',filter:`drop-shadow(0 0 40px ${hspc.hex})`}}>{playerAvatars[hotSeatPlayer]||'👤'}</div>
          <div className="text-5xl sm:text-7xl font-black uppercase" style={{color:hspc.hex,textShadow:`0 0 60px ${hspc.hex}, 0 0 120px ${hspc.hex}60, 0 4px 0 rgba(0,0,0,0.8)`,WebkitTextStroke:'1.5px rgba(255,255,255,0.15)',animation:'sf-name 0.4s cubic-bezier(0.22,1,0.36,1) 0.15s backwards',letterSpacing:'0.12em'}}>{hotSeatPlayer}</div>
          <div className="text-base font-black text-white uppercase tracking-[0.5em] mt-3" style={{animation:'sf-subtitle 0.3s ease-out 0.3s backwards',textShadow:'0 0 20px rgba(255,255,255,0.5)'}}>À TON TOUR</div>
        </div>
        {remCats.length>0&&<div className="absolute left-0 right-0 z-10" style={{top:'calc(50% + 120px)',animation:'sf-subtitle 0.4s ease-out 0.5s backwards'}}>
          <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest text-center mb-2">Il reste</div>
          <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto px-4">{remCats.map(c=><span key={c.id} className="px-3 py-1.5 rounded-lg text-sm font-bold border backdrop-blur-sm" style={{borderColor:`${hspc.hex}50`,color:'#fff',background:`${hspc.hex}20`,textShadow:`0 0 8px ${hspc.hex}60`}}>{c.icon} {c.name}</span>)}</div>
        </div>}
      </div>;})()}
      {/* MASSACRE SCREEN */}
      {massacreScreen&&<div className="fixed inset-0 z-[260] flex items-center justify-center bg-black/80 pointer-events-none" style={{animation:'massacre-in 0.3s ease-out'}}>
        <div className="text-center" style={{animation:'massacre-shake 0.5s ease-in-out'}}>
          <div className="text-9xl mb-4" style={{animation:'massacre-skull 0.6s cubic-bezier(0.34,1.56,0.64,1)',filter:`drop-shadow(0 0 30px ${massacreScreen.variant==='legendary'?'rgba(168,85,247,0.8)':massacreScreen.variant==='apocalypse'?'rgba(249,115,22,0.8)':'rgba(239,68,68,0.8)'})`}}>{massacreScreen.variant==='legendary'?'☠️':massacreScreen.variant==='apocalypse'?'🌋':'💀'}</div>
          <div className={`text-4xl sm:text-5xl font-black tracking-widest ${massacreScreen.variant==='legendary'?'text-purple-400':massacreScreen.variant==='apocalypse'?'text-orange-400':'text-red-500'}`} style={{textShadow:'0 0 20px currentColor',animation:'massacre-text 0.4s ease-out 0.2s backwards'}}>{massacreScreen.variant==='legendary'?'LÉGENDAIRE...MENT NUL':massacreScreen.variant==='apocalypse'?'APOCALYPSE':'MASSACRE'}</div>
          <div className="text-lg text-red-300 font-bold mt-2">{massacreScreen.player} enchaîne les zéros !</div>
        </div>
      </div>}
      {/* SCORE PARTICLES */}
      {scoreParticles.length>0&&<div className="fixed inset-0 pointer-events-none z-[80]">{scoreParticles.map(p=><div key={p.id} className="absolute w-2 h-2 rounded-full" style={{left:p.x,top:p.y,backgroundColor:p.color,animation:'score-particle 1s ease-out forwards',['--dx']:p.dx+'px',['--dy']:p.dy+'px',boxShadow:`0 0 6px ${p.color}`}}/>)}</div>}
      {/* FUN QUOTE */}
      {funQuote&&<div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[90] pointer-events-none" style={{animation:'funquote-in 0.4s cubic-bezier(0.34,1.56,0.64,1)'}}>
        <div className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-3 max-w-sm text-center"><span className="text-white text-sm font-bold italic">{funQuote}</span></div>
      </div>}
      {/* WEATHER EFFECTS */}
      
      <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@700&display=swap');
  * { font-family: 'Outfit', sans-serif; }
  @keyframes fall{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(110vh) rotate(720deg);opacity:0}}
  @keyframes shake{0%,100%{transform:translateX(0)}10%,30%,50%,70%,90%{transform:translateX(-8px)}20%,40%,60%,80%{transform:translateX(8px)}}
  .shake-animation{animation:shake 0.5s ease-in-out;}
  @keyframes notif-enter{0%{transform:translateX(120%) scale(0.8);opacity:0}60%{transform:translateX(-8px) scale(1.02)}100%{transform:translateX(0) scale(1);opacity:1}}
  .slide-in-right{animation:notif-enter 0.6s cubic-bezier(0.34,1.56,0.64,1);}
  @keyframes tab-slide{from{transform:translateY(10px);opacity:0}to{transform:translateY(0);opacity:1}}
  @keyframes stagger-in{from{transform:translateY(12px) scale(0.97);opacity:0}to{transform:translateY(0) scale(1);opacity:1}}
  @keyframes score-pop{0%{transform:scale(1)}50%{transform:scale(1.15)}100%{transform:scale(1)}}
  .score-pop{animation:score-pop 0.3s cubic-bezier(0.34,1.56,0.64,1)}
  @keyframes slide-down{from{transform:translateY(-20px);opacity:0}to{transform:translateY(0);opacity:1}}
  .slide-down{animation:slide-down 0.4s ease-out}
  @keyframes subtle-pulse{0%,100%{opacity:0.7}50%{opacity:1}}
  .subtle-pulse{animation:subtle-pulse 2s ease-in-out infinite}
  @keyframes scale-in{from{transform:scale(0.85);opacity:0}to{transform:scale(1);opacity:1}}
  @keyframes rotate-in{from{transform:rotate(-5deg) scale(0.9);opacity:0}to{transform:rotate(0) scale(1);opacity:1}}
  @keyframes elastic-in{0%{transform:scale(0)}43%{transform:scale(1.1)}65%{transform:scale(0.97)}82%{transform:scale(1.01)}100%{transform:scale(1)}}
  @keyframes ripple{0%{box-shadow:0 0 0 0 rgba(255,255,255,0.15)}100%{box-shadow:0 0 0 15px rgba(255,255,255,0)}}
  @keyframes count-up{from{transform:translateY(10px);opacity:0}to{transform:translateY(0);opacity:1}}
  @keyframes flip-in{0%{transform:perspective(400px) rotateX(30deg);opacity:0}100%{transform:perspective(400px) rotateX(0);opacity:1}}
  @keyframes hover-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
  .hover-float:hover{animation:hover-float 1s ease-in-out infinite}
  .animate-ripple:active{animation:ripple 0.6s ease-out}
  .flip-in{animation:flip-in 0.5s cubic-bezier(0.25,0.46,0.45,0.94)}
  .elastic-in{animation:elastic-in 0.6s ease-out}
  .rotate-in{animation:rotate-in 0.4s ease-out}
  .scale-in{animation:scale-in 0.35s ease-out}
  @keyframes card-appear{0%{transform:translateY(20px) scale(0.95);opacity:0;filter:blur(4px)}100%{transform:translateY(0) scale(1);opacity:1;filter:blur(0)}}
  .card-appear{animation:card-appear 0.5s cubic-bezier(0.22,1,0.36,1) backwards}
  @keyframes gradient-x{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
  .gradient-x{background-size:200% 200%;animation:gradient-x 3s ease infinite}
  @keyframes reveal-up{from{clip-path:inset(100% 0 0 0)}to{clip-path:inset(0 0 0 0)}}
  .reveal-up{animation:reveal-up 0.6s cubic-bezier(0.22,1,0.36,1)}
  @keyframes bar-grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
  .bar-grow{animation:bar-grow 0.8s cubic-bezier(0.22,1,0.36,1);transform-origin:left}
  @keyframes counter-roll{0%{transform:translateY(100%);opacity:0}60%{transform:translateY(-5%)}100%{transform:translateY(0);opacity:1}}
  .counter-roll{animation:counter-roll 0.5s cubic-bezier(0.22,1,0.36,1)}
  .hover-lift{transition:all 0.3s cubic-bezier(0.22,1,0.36,1)}.hover-lift:hover{transform:translateY(-3px) scale(1.01);box-shadow:0 16px 32px rgba(0,0,0,0.3),0 0 15px var(--glow-color,rgba(99,102,241,0.08))}
  .shadow-card{box-shadow:0 4px 16px rgba(0,0,0,0.2),0 0 0 1px rgba(255,255,255,0.05)}
  .shadow-modal{box-shadow:0 25px 50px rgba(0,0,0,0.5),0 0 0 1px rgba(255,255,255,0.08)}
  @keyframes text-reveal{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}
  .text-reveal{animation:text-reveal 0.8s cubic-bezier(0.22,1,0.36,1)}
  .tab-enter{animation:stagger-in 0.45s cubic-bezier(0.22,1,0.36,1);}
  @keyframes floatUp{0%{transform:translateY(0) scale(1);opacity:1}100%{transform:translateY(-80px) scale(1.5);opacity:0}}
  input[type=range]{-webkit-appearance:none;background:transparent}
  input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:white;box-shadow:0 2px 6px rgba(0,0,0,0.3);cursor:pointer;margin-top:-7px}
  input[type=range]::-webkit-slider-runnable-track{height:6px;border-radius:3px;background:linear-gradient(90deg,rgba(255,255,255,0.1),rgba(255,255,255,0.2))}
  .btn-ripple{position:relative;overflow:hidden}
  .btn-ripple::after{content:'';position:absolute;inset:0;background:radial-gradient(circle at var(--ripple-x,50%) var(--ripple-y,50%),rgba(255,255,255,0.3) 0%,transparent 60%);transform:scale(0);opacity:0;border-radius:inherit;pointer-events:none}
  .btn-ripple:active::after{animation:ripple-expand 0.5s ease-out forwards}
  @keyframes empty-bounce{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-10px) scale(1.05)}}
  @keyframes empty-pulse{0%,100%{opacity:0.4}50%{opacity:0.8}}
  @keyframes ripple-expand{0%{transform:scale(0);opacity:1}100%{transform:scale(4);opacity:0}}
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
  @keyframes scroll-reveal{0%{opacity:0;transform:translateY(12px)}100%{opacity:1;transform:translateY(0)}}
  .scroll-reveal{animation:scroll-reveal 0.4s ease-out backwards}
  @keyframes fade-in-scale{from{transform:scale(0.92);opacity:0}to{transform:scale(1);opacity:1}}
  @keyframes chaos-gradient{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
  .chaos-bg{background-size:400% 400%;animation:chaos-gradient 3s ease infinite;}
  @keyframes victory-text{0%{transform:scale(0) rotate(-10deg);opacity:0}50%{transform:scale(1.1) rotate(2deg)}100%{transform:scale(1) rotate(0deg);opacity:1}}
  @keyframes gradient-x{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
  .gradient-animate{background-size:200% 200%;animation:gradient-x 3s ease infinite;}
  @keyframes theme-particle-fall{0%{transform:translateY(0) rotate(0deg);opacity:0.04}50%{transform:translateY(50vh) rotate(180deg) translateX(30px);opacity:0.05}100%{transform:translateY(110vh) rotate(360deg) translateX(-20px);opacity:0}}
  @keyframes splash-logo{0%{transform:scale(0) rotate(-20deg);opacity:0}60%{transform:scale(1.15) rotate(3deg);opacity:1}100%{transform:scale(1) rotate(0deg);opacity:1}}
  @keyframes splash-dice{0%{transform:translateY(30px) rotate(0deg);opacity:0}100%{transform:translateY(0) rotate(360deg);opacity:1}}
  @keyframes splash-text{0%{letter-spacing:15px;opacity:0;transform:translateY(20px)}100%{letter-spacing:4px;opacity:1;transform:translateY(0)}}
  @keyframes splash-stat{0%{transform:translateX(-20px);opacity:0}100%{transform:translateX(0);opacity:1}}
  @keyframes splash-btn{0%{transform:scale(0.8);opacity:0}100%{transform:scale(1);opacity:1}}
  @keyframes badge-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
  @keyframes flipdigit{0%{transform:rotateX(0)}40%{transform:rotateX(-90deg)}60%{transform:rotateX(90deg)}100%{transform:rotateX(0)}}
  .flip-digit{display:inline-block;animation:flipdigit 0.5s ease-in-out;transform-style:preserve-3d}
  @keyframes last-cell-glow{0%,100%{box-shadow:0 0 0 0 rgba(250,204,21,0)}50%{box-shadow:0 0 18px 4px rgba(250,204,21,0.35)}}
  .last-cell-pulse{animation:last-cell-glow 0.8s ease-in-out 2;border-color:rgba(250,204,21,0.6)!important;background:rgba(250,204,21,0.08)!important}
  @keyframes tab-slide-in-r{0%{transform:translateX(60px);opacity:0}100%{transform:translateX(0);opacity:1}}
  @keyframes tab-slide-in-l{0%{transform:translateX(-60px);opacity:0}100%{transform:translateX(0);opacity:1}}
  .tab-slide-r{animation:tab-slide-in-r 0.35s cubic-bezier(0.22,1,0.36,1)}
  .tab-slide-l{animation:tab-slide-in-l 0.35s cubic-bezier(0.22,1,0.36,1)}
  @keyframes row-cascade{0%{transform:translateX(-20px) translateY(5px);opacity:0}100%{transform:translateX(0) translateY(0);opacity:1}}
  @keyframes cinema-darken{0%{opacity:0}100%{opacity:1}}
  @keyframes cinema-rise{0%{transform:translateY(50px);opacity:0}100%{transform:translateY(0);opacity:1}}
  @keyframes cinema-text{0%{letter-spacing:20px;opacity:0}100%{letter-spacing:2px;opacity:1}}
  @keyframes shake-screen{0%,100%{transform:translateX(0)}10%,30%,50%,70%,90%{transform:translateX(-3px)}20%,40%,60%,80%{transform:translateX(3px)}}
  :root{--app-font:system-ui, sans-serif}
  *:not(select):not(option):not(input){font-family:var(--app-font)!important}
  .scrollbar-none::-webkit-scrollbar{display:none}
  .scrollbar-none{-ms-overflow-style:none;scrollbar-width:none}
  .shake-active{animation:shake-screen 0.4s ease-in-out}
  @keyframes score-counter{0%{transform:translateY(100%);opacity:0}50%{transform:translateY(-10%);opacity:1}100%{transform:translateY(0);opacity:1}}
  .score-counter-anim{animation:score-counter 0.4s cubic-bezier(0.34,1.56,0.64,1)}
  @keyframes cell-pulse{0%,100%{box-shadow:0 0 0 0 rgba(255,255,255,0)}50%{box-shadow:0 0 8px 2px rgba(255,255,255,0.06)}}
  .cell-alive{animation:cell-pulse 3s ease-in-out infinite}
  @keyframes cell-idle{0%,100%{opacity:0.4}50%{opacity:0.6}}
  .cell-empty-wave{animation:cell-idle 4s ease-in-out infinite}
  @keyframes trail-up{0%{transform:translateY(0) scale(1);opacity:1;filter:blur(0)}100%{transform:translateY(-60px) scale(0.5);opacity:0;filter:blur(4px)}}
  .score-trail{animation:trail-up 1s ease-out forwards}
  @keyframes shockwave{0%{transform:scale(0.5);opacity:0.6;border-width:3px}100%{transform:scale(4);opacity:0;border-width:0px}}
  .shockwave{animation:shockwave 0.7s ease-out forwards}
  .shockwave-gold .shockwave{border-color:rgba(250,204,21,0.6)!important}
  @keyframes dice-roll{0%{transform:rotateX(0) rotateY(0) scale(0.3);opacity:0}50%{transform:rotateX(720deg) rotateY(360deg) scale(1.2);opacity:1}100%{transform:rotateX(1080deg) rotateY(720deg) scale(1);opacity:1}}
  .dice-roll-anim{animation:dice-roll 0.8s cubic-bezier(0.34,1.56,0.64,1)}
  @keyframes streak-fire{0%,100%{transform:scaleY(1);opacity:0.8}50%{transform:scaleY(1.3);opacity:1}}
  .streak-fire{animation:streak-fire 0.5s ease-in-out infinite}

  @keyframes emoji-rain{0%{transform:translateY(-100%) rotate(0deg);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
  @keyframes avatar-dance{0%,100%{transform:rotate(0deg) scale(1)}25%{transform:rotate(-8deg) scale(1.1)}75%{transform:rotate(8deg) scale(1.1)}}
  @keyframes avatar-cry{0%,100%{transform:translateY(0)}50%{transform:translateY(3px)}}
  @keyframes avatar-idle{0%,100%{transform:scale(1)}50%{transform:scale(0.95)}}
  .avatar-dance{animation:avatar-dance 0.6s ease-in-out infinite}
  .avatar-cry{animation:avatar-cry 0.3s ease-in-out 3}
  .avatar-idle{animation:avatar-idle 4s ease-in-out infinite}
  @keyframes podium-rise{0%{transform:translateY(40px) scaleY(0.3);opacity:0}100%{transform:translateY(0) scaleY(1);opacity:1}}
  @keyframes podium-crown{0%{transform:scale(0) rotate(-20deg)}100%{transform:scale(1) rotate(0deg)}}
  @keyframes lightning{0%{opacity:0;transform:translateX(-50%) scaleY(0)}10%{opacity:1;transform:translateX(-50%) scaleY(1)}30%{opacity:1}100%{opacity:0}}
  @keyframes total-breathe{0%,100%{text-shadow:0 0 10px rgba(255,255,255,0.1)}50%{text-shadow:0 0 20px rgba(255,255,255,0.3)}}
  .total-breathe{animation:total-breathe 3s ease-in-out infinite}
  @keyframes perfect-entrance{0%{transform:scale(0) rotate(-20deg);opacity:0}50%{transform:scale(1.3) rotate(5deg);opacity:1}100%{transform:scale(1) rotate(0);opacity:1}}
  @keyframes perfect-star-spin{0%{transform:rotate(0deg) scale(1)}50%{transform:rotate(180deg) scale(1.2)}100%{transform:rotate(360deg) scale(1)}}
  @keyframes perfect-sparkle{0%{transform:scale(0);opacity:1}100%{transform:scale(2) translateY(-20px);opacity:0}}
  @keyframes header-zero-shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-3px)}40%,80%{transform:translateX(3px)}}
  @keyframes header-perfect-bounce{0%{transform:scale(1)}50%{transform:scale(1.08)}100%{transform:scale(1)}}
  @keyframes avatar-shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-4px) rotate(-5deg)}40%{transform:translateX(4px) rotate(5deg)}60%{transform:translateX(-3px)}80%{transform:translateX(3px)}}
  .avatar-shake{animation:avatar-shake 0.4s ease-in-out}
  @keyframes avatar-spin{0%{transform:rotate(0) scale(1)}50%{transform:rotate(180deg) scale(1.2)}100%{transform:rotate(360deg) scale(1)}}
  .avatar-spin{animation:avatar-spin 0.6s cubic-bezier(0.34,1.56,0.64,1)}
  @keyframes avatar-bounce-big{0%,100%{transform:scale(1)}30%{transform:scale(1.3)}60%{transform:scale(0.9)}}
  .avatar-bounce-big{animation:avatar-bounce-big 0.5s cubic-bezier(0.34,1.56,0.64,1)}
  @keyframes avatar-bounce-idle{0%,100%{transform:scale(1) translateY(0)}50%{transform:scale(1.05) translateY(-3px)}}
  .avatar-bounce-idle{animation:avatar-bounce-idle 1.5s ease-in-out infinite}
  @keyframes cinematic-zoom{0%{backdrop-filter:blur(0);transform:scale(1)}100%{backdrop-filter:blur(8px);transform:scale(1.02)}}
  @keyframes cinematic-fade{0%{opacity:0}100%{opacity:1}}
  @keyframes cinematic-trophy{0%{transform:scale(0) rotate(-30deg);opacity:0}100%{transform:scale(1) rotate(0);opacity:1}}
  @keyframes cinematic-reveal{0%{letter-spacing:2em;opacity:0}100%{letter-spacing:0.3em;opacity:1}}
  @keyframes cinematic-text{0%{opacity:0;transform:translateY(20px)}30%{opacity:1;transform:translateY(0)}80%{opacity:1}100%{opacity:0}}
  @keyframes splash-dice-roll{0%{transform:scale(0) rotate(-180deg);opacity:0}100%{transform:scale(1) rotate(0);opacity:1}}
  @keyframes splash-letter{0%{transform:translateY(40px) scale(0.5);opacity:0}100%{transform:translateY(0) scale(1);opacity:1}}
  @keyframes splash-line{0%{width:0;opacity:0}100%{width:8rem;opacity:1}}
  .total-bounce-up{animation:total-up 0.4s cubic-bezier(0.34,1.56,0.64,1)}
  .total-bounce-down{animation:total-down 0.4s ease-out}
  @keyframes total-up{0%{transform:scale(1)}40%{transform:scale(1.15) translateY(-3px)}100%{transform:scale(1) translateY(0)}}
  @keyframes total-down{0%{transform:scale(1)}40%{transform:scale(0.92) translateY(2px)}100%{transform:scale(1) translateY(0)}}
  .streak-col-glow{box-shadow:inset 0 0 15px rgba(251,146,60,0.06);animation:streak-glow 2s ease-in-out infinite}
  .streak-col-intense{box-shadow:inset 0 0 25px rgba(251,146,60,0.1);animation:streak-glow-intense 1.5s ease-in-out infinite}
  @keyframes streak-glow{0%,100%{box-shadow:inset 0 0 10px rgba(251,146,60,0.04)}50%{box-shadow:inset 0 0 20px rgba(251,146,60,0.08)}}
  @keyframes streak-glow-intense{0%,100%{box-shadow:inset 0 0 15px rgba(251,146,60,0.08)}50%{box-shadow:inset 0 0 30px rgba(251,146,60,0.15)}}
  .liquid-glass-card{background:linear-gradient(135deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))!important;backdrop-filter:blur(20px) saturate(1.2);border:1px solid rgba(255,255,255,0.12)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,0.1),inset 0 -1px 0 rgba(255,255,255,0.05),0 8px 32px rgba(0,0,0,0.3),0 0 0 1px rgba(255,255,255,0.05)}
  .liquid-glass-card::before{content:'';position:absolute;inset:0;border-radius:inherit;background:linear-gradient(135deg,rgba(255,255,255,0.08) 0%,transparent 50%,rgba(255,255,255,0.03) 100%);pointer-events:none}
  @keyframes trophy-glow{0%,100%{filter:drop-shadow(0 0 20px rgba(250,204,21,0.4))}50%{filter:drop-shadow(0 0 40px rgba(250,204,21,0.7))}}
  @keyframes trophy-float{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-8px) rotate(2deg)}}
  @keyframes leader-pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.03);opacity:0.95}}
  @keyframes duel-shimmer{0%,100%{opacity:0.1}50%{opacity:0.3}}
  @keyframes cell-glow-spread{0%{box-shadow:inset 0 0 20px rgba(255,255,255,0.15)}100%{box-shadow:inset 0 0 0 transparent}}
  .cell-alive{animation:cell-glow-spread 1.5s ease-out}
  @keyframes cell-flip{0%{transform:perspective(400px) rotateY(0)}40%{transform:perspective(400px) rotateY(90deg)}60%{transform:perspective(400px) rotateY(90deg)}100%{transform:perspective(400px) rotateY(0)}}
  .cell-flip{animation:cell-flip 0.5s cubic-bezier(0.22,1,0.36,1)}
  @keyframes combo-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}}
  @keyframes confetti-rise{0%{transform:translateY(110vh) rotate(0deg);opacity:1}100%{transform:translateY(-10vh) rotate(720deg);opacity:0}}
  @keyframes confetti-ember{0%{transform:translateY(-10vh) rotate(0deg) scale(1);opacity:1}60%{opacity:0.8}100%{transform:translateY(110vh) rotate(360deg) scale(0.3);opacity:0;filter:brightness(2)}}
  @keyframes confetti-leaf{0%{transform:translateY(-10vh) rotate(0deg) translateX(0);opacity:1}100%{transform:translateY(110vh) rotate(720deg) translateX(100px);opacity:0}}
  @keyframes confetti-laser{0%{transform:translateY(-10vh) scaleX(3) scaleY(0.3);opacity:1}100%{transform:translateY(110vh) scaleX(1) scaleY(1);opacity:0}}
  @keyframes podium-step{0%{transform:translateY(100px);opacity:0}100%{transform:translateY(0);opacity:1}}
  @keyframes bg-float{0%{transform:translateY(0) translateX(0) scale(1)}50%{transform:translateY(-30px) translateX(15px) scale(1.1)}100%{transform:translateY(0) translateX(0) scale(1)}}
  @keyframes confetti-fall{0%{transform:translateY(-10vh) rotate(0deg);opacity:1}100%{transform:translateY(110vh) rotate(1080deg);opacity:0}}
  @keyframes sad-pulse{0%,100%{transform:scale(1);opacity:0.5}50%{transform:scale(1.2);opacity:0.8}}
  .glass{background:rgba(255,255,255,0.03);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.08)}
  .glass-strong{background:rgba(255,255,255,0.06);backdrop-filter:blur(30px);border:1px solid rgba(255,255,255,0.12)}
  ::-webkit-scrollbar{width:6px;height:6px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.15);border-radius:10px}::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,0.25)}
  select{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23999' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:30px}
  .confetti-piece{position:fixed;z-index:9999;pointer-events:none}
  @keyframes spotlight-sweep{0%,100%{transform:rotate(-15deg);opacity:0.05}50%{transform:rotate(15deg);opacity:0.15}}
  @keyframes vs-slide-left{0%{transform:translateX(-200px) scale(0.5);opacity:0}100%{transform:translateX(0) scale(1);opacity:1}}
  @keyframes vs-slide-right{0%{transform:translateX(200px) scale(0.5);opacity:0}100%{transform:translateX(0) scale(1);opacity:1}}
  @keyframes vs-text{0%{transform:scale(0) rotate(-20deg);opacity:0}100%{transform:scale(1) rotate(0deg);opacity:1}}
  @keyframes vs-flash{0%{transform:scale(0);opacity:0}50%{transform:scale(1.5);opacity:0.3}100%{transform:scale(1);opacity:0.1}}
  @keyframes vs-fight{0%{transform:scale(0) translateY(20px);opacity:0}100%{transform:scale(1) translateY(0);opacity:1}}
  @keyframes tab-page-enter{0%{transform:translateY(12px);opacity:0;filter:blur(2px)}100%{transform:translateY(0);opacity:1;filter:blur(0)}}
  .tab-page-enter{animation:tab-page-enter 0.35s cubic-bezier(0.22,1,0.36,1)}
  @keyframes flame-flicker{0%,100%{text-shadow:0 -2px 6px rgba(255,100,0,0.5),0 -4px 12px rgba(255,50,0,0.3)}33%{text-shadow:0 -3px 8px rgba(255,130,0,0.6),0 -6px 16px rgba(255,70,0,0.4)}66%{text-shadow:0 -1px 5px rgba(255,80,0,0.4),0 -3px 10px rgba(255,40,0,0.2)}}
  .flame-effect{animation:flame-flicker 0.5s ease-in-out infinite;position:relative}
  .flame-effect::before{content:'🔥';position:absolute;top:-16px;left:50%;transform:translateX(-50%);font-size:14px;animation:flame-flicker 0.3s ease-in-out infinite}
  @keyframes flame-column{0%,100%{box-shadow:inset 0 0 10px rgba(255,100,0,0.05)}50%{box-shadow:inset 0 0 20px rgba(255,100,0,0.1)}}
  .flame-column{animation:flame-column 1s ease-in-out infinite}
  @keyframes xp-fill{from{width:0}to{width:var(--xp-width)}}
  .xp-bar-fill{animation:xp-fill 1s cubic-bezier(0.22,1,0.36,1)}
  @keyframes card-export-shine{0%{background-position:-200% 0}100%{background-position:200% 0}}
  .grid-neon td{border-color:rgba(0,255,128,0.1)!important}
  .grid-neon tr:hover td{background:rgba(0,255,128,0.03)!important}
  .grid-vintage td{border-color:rgba(180,130,60,0.15)!important}
  .grid-vintage{filter:sepia(0.08)}
  .grid-chalk td{border-color:rgba(34,197,94,0.1)!important;font-family:'Courier New',monospace}
  .grid-pixel td{border-color:rgba(168,85,247,0.1)!important;image-rendering:pixelated}

  .next-col-pulse{animation:next-col-glow 2s ease-in-out infinite}
  @keyframes next-col-glow{0%,100%{opacity:0.85}50%{opacity:1}}
  @keyframes next-turn-badge{0%,100%{opacity:0.8;transform:scale(0.95)}50%{opacity:1;transform:scale(1.05)}}
  @keyframes sf-bar{0%{transform:translateY(-50%) scaleX(0)}100%{transform:translateY(-50%) scaleX(1)}}
  @keyframes sf-avatar{0%{transform:scale(0) rotate(-20deg);opacity:0}60%{transform:scale(1.2) rotate(5deg)}100%{transform:scale(1) rotate(0);opacity:1}}
  @keyframes sf-name{0%{transform:translateX(-100px);opacity:0;letter-spacing:0.8em}100%{transform:translateX(0);opacity:1;letter-spacing:0.15em}}
  @keyframes sf-subtitle{0%{opacity:0;transform:translateY(10px)}100%{opacity:1;transform:translateY(0)}}
  @keyframes hotseat-in{0%{opacity:0;backdrop-filter:blur(0)}100%{opacity:1;backdrop-filter:blur(8px)}}
  @keyframes hotseat-pulse{0%{opacity:0}10%{opacity:1}80%{opacity:1}100%{opacity:0}}
  @keyframes hotseat-bell{0%{transform:rotate(0) scale(0)}30%{transform:rotate(15deg) scale(1.3)}60%{transform:rotate(-15deg) scale(1.1)}100%{transform:rotate(0) scale(1)}}
  @keyframes hotseat-name{0%{transform:scale(0.3) translateY(30px);opacity:0}100%{transform:scale(1) translateY(0);opacity:1}}
  @keyframes massacre-in{0%{opacity:0}100%{opacity:1}}
  @keyframes massacre-skull{0%{transform:scale(0) rotate(-30deg)}60%{transform:scale(1.3) rotate(5deg)}100%{transform:scale(1) rotate(0)}}
  @keyframes massacre-text{0%{transform:scaleX(0);letter-spacing:30px;opacity:0}100%{transform:scaleX(1);letter-spacing:6px;opacity:1}}
  @keyframes massacre-shake{0%,100%{transform:translateX(0)}10%,30%,50%,70%,90%{transform:translateX(-4px)}20%,40%,60%,80%{transform:translateX(4px)}}
  @keyframes score-particle{0%{transform:translate(0,0) scale(1);opacity:1}100%{transform:translate(var(--dx),var(--dy)) scale(0);opacity:0}}
  @keyframes funquote-in{0%{transform:translateX(-50%) translateY(20px) scale(0.8);opacity:0}100%{transform:translateX(-50%) translateY(0) scale(1);opacity:1}}
  @keyframes countdown-pop{0%{transform:scale(3);opacity:0}30%{transform:scale(0.9);opacity:1}50%{transform:scale(1.1)}100%{transform:scale(1);opacity:0}}
  @keyframes countdown-pulse{0%,100%{text-shadow:0 0 80px rgba(250,204,21,0.5)}50%{text-shadow:0 0 120px rgba(250,204,21,0.8)}}
  @keyframes clutch-flash{0%{background:rgba(250,204,21,0.2)}20%{background:transparent}40%{background:rgba(250,204,21,0.1)}100%{opacity:0}}
  @keyframes clutch-icon{0%{transform:scale(0) rotate(-180deg)}100%{transform:scale(1) rotate(0)}}
  @keyframes clutch-text{0%{transform:scale(0.3);opacity:0;letter-spacing:30px}100%{transform:scale(1);opacity:1;letter-spacing:3px}}
  @keyframes photo-flash{0%{background:white}10%{background:rgba(0,0,0,0.9)}95%{opacity:1}100%{opacity:0}}
  @keyframes photo-camera{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}}
  @keyframes photo-text{0%{transform:scaleX(0);letter-spacing:40px}100%{transform:scaleX(1);letter-spacing:6px}}
  @keyframes player-entrance{0%{transform:scale(0);opacity:0}60%{transform:scale(1.3);opacity:0.6}100%{transform:scale(1);opacity:0}}
  @keyframes wall-shame-entry{0%{transform:translateX(-20px);opacity:0}100%{transform:translateX(0);opacity:1}}
  .cell-cracked{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Cpath d='M20 2L18 15L5 12L17 20L8 35L20 24L30 38L23 20L38 15L22 14Z' fill='none' stroke='%23ef4444' stroke-width='0.5' opacity='0.3'/%3E%3C/svg%3E");background-size:80%;background-repeat:no-repeat;background-position:center}
  @keyframes scroll-hint{0%,100%{transform:translateX(0) translateY(-50%);opacity:0.3}50%{transform:translateX(8px) translateY(-50%);opacity:0.7}}
  @keyframes score-trail{0%{box-shadow:0 0 0 transparent}30%{box-shadow:0 0 15px var(--trail-color,rgba(255,255,255,0.3))}100%{box-shadow:0 0 0 transparent}}
  .score-trail-effect{animation:score-trail 1s ease-out}
  @keyframes badge-shelf-3d{0%{transform:perspective(600px) rotateY(-8deg) translateZ(-20px);opacity:0}100%{transform:perspective(600px) rotateY(0) translateZ(0);opacity:1}}
`}</style>
      {notifQueue.length>0&&<div className="fixed top-4 right-4 z-[300] flex flex-col gap-3 max-w-xs">{notifQueue.map((notif,ni)=>{const colors=notif.icon==='🎲'?'from-yellow-600 to-orange-600 border-yellow-400':notif.icon==='🎁'?'from-green-600 to-emerald-600 border-green-400':notif.icon==='🩸'?'from-red-700 to-rose-700 border-red-400':notif.icon==='💯'?'from-emerald-600 to-teal-600 border-emerald-400':notif.icon==='🏁'?'from-orange-600 to-red-600 border-orange-400':notif.icon==='⏱️'?'from-blue-600 to-indigo-600 border-blue-400':notif.icon==='🔄'?'from-cyan-600 to-blue-600 border-cyan-400':notif.icon==='❌'?'from-red-800 to-rose-800 border-red-500':notif.icon==='✅'?'from-green-600 to-emerald-600 border-green-400':notif.icon==='🏅'?'from-amber-600 to-yellow-600 border-amber-400':notif.icon==='🏆'?'from-yellow-600 to-amber-600 border-yellow-400':'from-purple-600 to-pink-600 border-purple-400';return(<div key={notif.id} className="slide-in-right" style={{animation:`notif-enter 0.6s cubic-bezier(0.34,1.56,0.64,1) ${ni*0.1}s backwards`}}><div className={'relative overflow-hidden px-6 py-5 rounded-2xl shadow-2xl backdrop-blur-xl border-2 max-w-sm bg-gradient-to-r '+colors}><div className="absolute inset-0" style={{animation:'shimmer 2s infinite',backgroundSize:'200% 100%',backgroundImage:'linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)'}}></div><div className="flex items-center gap-4 relative z-10"><span className="text-5xl" style={{animation:'bounce-in 0.5s cubic-bezier(0.34,1.56,0.64,1)'}}>{notif.icon}</span><div className="text-white"><div className="text-xs font-bold uppercase tracking-widest opacity-80">{notif.icon==='🎲'?'🎉 Exploit !':notif.icon==='🎁'?'🎉 Succès !':notif.icon==='🩸'?'⚔️ Premier Sang !':notif.icon==='💯'?'🎯 Perfection !':notif.icon==='🏁'?'🚨 Attention !':notif.icon==='⏱️'?'📊 Mi-Temps':notif.icon==='🔄'?'🔥 Renversement !':notif.icon==='❌'?'😬 Aïe !':notif.icon==='✅'?'🎮 Fini !':notif.icon==='🏅'?'🏅 Record !':notif.icon==='🏆'?'🏆 Défi !':'🎉 Incroyable !'}</div><div className="font-black text-xl">{notif.title}</div><div className="text-sm opacity-90">{notif.description}</div></div></div></div></div>);})}</div>}
      {/* SHOCKWAVE EFFECT */}
      {shockwavePos&&<div className="fixed z-[100] pointer-events-none" style={{left:shockwavePos.x-50,top:shockwavePos.y-50}}><div className="w-[100px] h-[100px] rounded-full border-4 border-white/40 shockwave"></div></div>}
      {/* EMOJI RAIN */}
      {emojiRain&&<div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">{Array.from({length:30},(_,i)=>i).map(i=><div key={i} className="absolute text-2xl" style={{left:Math.random()*100+'%',top:'-30px',animation:`emoji-rain ${2+Math.random()*3}s linear ${Math.random()*2}s both`}}>{emojiRain==='🎲'?['🎲','🎲','🎲','⭐','✨','🎯'][i%6]:emojiRain==='💀'?['💀','😱','🧱','💔','😬','❌'][i%6]:emojiRain==='🃏'?['🃏','🂡','♠️','♥️','♦️','♣️'][i%6]:emojiRain==='🎰'?['🎰','💎','⭐','7️⃣','🌟','✨'][i%6]:emojiRain==='🔥'?['🔥','🔥','💥','⚡','🔥','💫'][i%6]:emojiRain==='🎯'?['🎯','🎯','✨','⭐','💫','🎯'][i%6]:emojiRain==='📈'?['📈','⬆️','✨','🔢','📊','⭐'][i%6]:emojiRain==='🍀'?['🍀','🍀','✨','⭐','🌟','💚'][i%6]:[emojiRain,emojiRain,'✨','⭐','🌟','💫'][i%6]}</div>)}</div>}
      {/* DICE 3D ANIMATION */}
      {showDiceAnim&&<div className="fixed inset-0 pointer-events-none z-[70] flex items-center justify-center gap-4">{[1,2,3,4,5].map(d=><div key={d} className="text-6xl dice-roll-anim" style={{animationDelay:d*0.12+'s'}}>🎲</div>)}</div>}
      {/* QUICK STATS POPUP */}
      {quickStatsPlayer&&<div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60" onClick={()=>setQuickStatsPlayer(null)}><div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-white/20 rounded-3xl p-6 w-80 max-w-[90vw] modal-content" onClick={e=>e.stopPropagation()}>{(()=>{const ps=playerStats.find(s=>s.name===quickStatsPlayer);if(!ps)return <div className="text-gray-400 text-center">Pas de stats</div>;const t=getPlayerTitle(ps);return(<div className="text-center"><div className="text-5xl mb-2">{playerAvatars[quickStatsPlayer]||'👤'}</div><div className="text-xl font-black text-white mb-1">{quickStatsPlayer}</div><div className="text-sm font-bold mb-4" style={{color:T.primary}}>{t.icon} {t.title}</div><div className="grid grid-cols-2 gap-2 text-sm">{[['🎮 Parties',ps.games],['🏆 Victoires',ps.wins],['📊 Moyenne',ps.avgScore||0],['🔝 Max',ps.maxScore],['🎲 Yams',ps.yamsCount||0],['🎁 Bonus %',(ps.bonusRate||0)+'%']].map(([l,v],i)=><div key={i} className="bg-white/5 rounded-xl p-2"><div className="text-gray-500 text-xs">{l}</div><div className="text-white font-bold">{v}</div></div>)}</div><button onClick={()=>{setQuickStatsPlayer(null);setShowPlayerCard(quickStatsPlayer);}} className="mt-4 w-full py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white font-bold text-sm transition-all">📇 Carte d'identité</button></div>);})()}</div></div>}
      {/* PLAYER CARD MODAL - POKEMON/FIFA STYLE */}
      {showPlayerCard&&(()=>{
        const ps=playerStats.find(s=>s.name===showPlayerCard);
        if(!ps) return null;
        const t=getPlayerTitle(ps);
        const winRate=ps.games>0?Math.round(ps.wins/ps.games*100):0;
        const pc=getPlayerColor(showPlayerCard, 0);
        const xpLevel=getXPLevel(globalXP);
        const shareText=`🎲 YAMS - ${showPlayerCard}\n${t.icon} ${t.title}\n🎮 ${ps.games} parties | 🏆 ${ps.wins} victoires (${winRate}%)\n📊 Moy: ${ps.avgScore} | 🔝 Max: ${ps.maxScore}\n🎲 ${ps.yamsCount||0} Yams | 🎁 Bonus: ${ps.bonusRate||0}%\n🔥 Série: ${ps.currentStreak}`;
        return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4" onClick={()=>setShowPlayerCard(null)}>
          <div className="w-80 max-w-[90vw] modal-content" onClick={e=>e.stopPropagation()}>
            <div id="player-card-export" className="relative overflow-hidden rounded-3xl border-2 p-0" style={{borderColor:pc.hex+'60',background:'#0f172a'}}>
              {/* CARD HEADER WITH GRADIENT */}
              <div className="relative h-28 overflow-hidden" style={{background:`linear-gradient(135deg,${pc.hex}40,${T.primary}20,${pc.hex}20)`}}>
                <div className="absolute inset-0" style={{background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.05),transparent)',backgroundSize:'200% 100%',animation:'card-export-shine 3s linear infinite'}}/>
                <div className="absolute top-3 left-4 flex items-center gap-2">
                  <div className="text-xs font-black px-2 py-0.5 rounded-full" style={{background:pc.hex,color:'#000'}}>{xpLevel.icon} Niv.{xpLevel.level}</div>
                  <div className="text-[10px] font-bold text-white/60">{t.icon} {t.title}</div>
                </div>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border-4 flex items-center justify-center text-4xl" style={{borderColor:pc.hex,background:'#1e293b'}}>{playerAvatars[showPlayerCard]||'👤'}</div>
              </div>
              {/* CARD BODY */}
              <div className="relative z-10 pt-12 pb-6 px-6 text-center">
                <h3 className="text-xl font-black text-white mb-0.5">{showPlayerCard}</h3>
                <div className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{color:pc.hex}}>{t.title}</div>
                {/* MAIN STATS ROW */}
                <div className="grid grid-cols-3 gap-1 mb-4">
                  <div className="bg-white/5 rounded-xl py-2 border border-white/5"><div className="text-xl font-black" style={{color:pc.hex}}>{ps.wins}</div><div className="text-[8px] text-gray-500 font-bold uppercase">Victoires</div></div>
                  <div className="bg-white/5 rounded-xl py-2 border border-white/5"><div className="text-xl font-black text-white">{ps.avgScore}</div><div className="text-[8px] text-gray-500 font-bold uppercase">Moyenne</div></div>
                  <div className="bg-white/5 rounded-xl py-2 border border-white/5"><div className="text-xl font-black text-white">{ps.maxScore}</div><div className="text-[8px] text-gray-500 font-bold uppercase">Record</div></div>
                </div>
                {/* DETAILED STATS */}
                <div className="space-y-2 mb-4">
                  {[
                    {label:'Parties',val:ps.games,max:50,icon:'🎮'},
                    {label:'Win Rate',val:winRate,max:100,icon:'🏆',suffix:'%'},
                    {label:'Yams',val:ps.yamsCount||0,max:20,icon:'🎲'},
                    {label:'Bonus Rate',val:ps.bonusRate||0,max:100,icon:'🎁',suffix:'%'},
                    {label:'Série Max',val:ps.maxConsecutiveWins||0,max:10,icon:'🔥'}
                  ].map((stat,i)=><div key={i} className="flex items-center gap-2">
                    <span className="text-xs w-16 text-left text-gray-400 font-bold">{stat.icon} {stat.label}</span>
                    <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{width:Math.min(100,(stat.val/stat.max)*100)+'%',background:`linear-gradient(90deg,${pc.hex},${pc.light})`}}/></div>
                    <span className="text-xs text-white font-bold w-8 text-right">{stat.val}{stat.suffix||''}</span>
                  </div>)}
                </div>
                <div className="text-[8px] text-gray-600 font-bold">🎲 YAMS Ultimate Scorekeeper</div>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={async()=>{try{if(navigator.share)await navigator.share({text:shareText});else{await navigator.clipboard.writeText(shareText);pushNotif({icon:'📋',title:'Copié !',description:'Carte copiée'});}}catch(e){}}} className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-bold text-sm transition-all flex items-center justify-center gap-2"><Share2 size={16}/>Partager</button>
              <button onClick={()=>setShowPlayerCard(null)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 font-bold text-sm transition-all">Fermer</button>
            </div>
          </div>
        </div>);
      })()}
      {/* CINEMATIC END WITH 3D PODIUM */}
      {showCinematic&&<div className="fixed inset-0 z-[52] pointer-events-none" style={{animation:'cinematic-zoom 3s ease-in-out forwards'}}>
        <div className="absolute inset-0 bg-black/60" style={{animation:'cinematic-fade 3s ease-in forwards'}}></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center" style={{animation:'cinematic-text 3s ease-in-out'}}>
            <div className="text-6xl mb-4" style={{animation:'cinematic-trophy 2s ease-out 0.5s backwards'}}>🎬</div>
            <div className="text-white text-3xl font-black uppercase tracking-[0.3em]" style={{animation:'cinematic-reveal 1.5s ease-out 0.8s backwards'}}>Fin de partie</div>
          </div>
        </div>
      </div>}
      {showPodiumAnim&&(()=>{
        const ranked=players.map(p=>({name:p,score:calcTotal(p),avatar:playerAvatars[p]||'👤'})).sort((a,b)=>b.score-a.score);
        const podiumOrder=[ranked[1],ranked[0],ranked[2]||{name:'',score:0,avatar:''}];
        const heights=['55%','80%','40%'];
        const delays=['0.6s','1.2s','0.2s'];
        const medals=['🥈','🥇','🥉'];
        const colors=['from-gray-400/30 to-gray-500/20','from-yellow-400/30 to-amber-500/20','from-amber-700/30 to-amber-800/20'];
        return <div className="fixed inset-0 z-[55] flex items-end justify-center bg-black/95 p-4" style={{animation:'cinema-darken 0.5s ease-out'}}>
          <div className="text-center absolute top-8 left-0 right-0" style={{animation:'fade-in-scale 0.5s ease-out 0.3s backwards'}}><div className="text-4xl mb-2">🏆</div><div className="text-white text-2xl font-black uppercase tracking-widest">Podium</div></div>
          <div className="flex items-end justify-center gap-3 w-full max-w-md mb-8">
            {podiumOrder.map((p,i)=>p.name?<div key={i} className="flex flex-col items-center flex-1" style={{animation:`podium-step 0.8s cubic-bezier(0.34,1.56,0.64,1) ${delays[i]} backwards`}}>
              <div className="text-3xl mb-1" style={{animation:`bounce-in 0.5s cubic-bezier(0.34,1.56,0.64,1) ${parseFloat(delays[i])+0.4}s backwards`}}>{p.avatar}</div>
              <div className="text-white font-black text-sm mb-1 truncate max-w-[80px]">{p.name}</div>
              <div className="text-white/80 font-bold text-xs mb-2" style={{fontFamily:'JetBrains Mono'}}>{p.score} pts</div>
              <div className={"w-full rounded-t-2xl bg-gradient-to-t "+colors[i]+" border border-white/20 flex items-start justify-center pt-3"} style={{height:heights[i],minHeight:'60px'}}>
                <span className="text-3xl">{medals[i]}</span>
              </div>
            </div>:<div key={i} className="flex-1"/>)}
          </div>
        </div>;
      })()}
      {showPerfect&&<div className="fixed inset-0 z-[250] pointer-events-none flex items-center justify-center">
        <div className="text-center" style={{animation:'perfect-entrance 0.6s cubic-bezier(0.34,1.56,0.64,1)'}}>
          <div className="text-6xl mb-2" style={{animation:'perfect-star-spin 1s linear infinite'}}>{showPerfect.icon}</div>
          <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300 uppercase tracking-widest" style={{textShadow:'0 0 40px rgba(250,204,21,0.5)',WebkitTextStroke:'1px rgba(250,204,21,0.3)'}}>PERFECT</div>
          <div className="text-xl font-black text-white mt-1">{showPerfect.value} pts</div>
          <div className="text-sm text-yellow-300/70 font-bold">{playerAvatars[showPerfect.player]||'👤'} {showPerfect.player}</div>
        </div>
        <div className="absolute inset-0 overflow-hidden">{Array.from({length:20},(_,i)=><div key={i} className="absolute text-yellow-400" style={{left:Math.random()*100+'%',top:Math.random()*100+'%',fontSize:(12+Math.random()*20)+'px',animation:`perfect-sparkle ${0.5+Math.random()*1.5}s ease-out ${Math.random()*0.5}s both`}}>✦</div>)}</div>
      </div>}
      {showVictoryAnimation&&<div className="fixed inset-0 z-50 flex items-center justify-center bg-black" style={{animation:'cinema-darken 0.8s ease-out'}}>
        <div className="absolute inset-0 overflow-hidden">{[...Array(60)].map((_,i)=>{const tc=THEME_CONFETTI[theme]||THEME_CONFETTI.modern;const pool=[...tc,'🎉','🏆','👑'];return <div key={i} className="confetti-piece absolute" style={{left:Math.random()*100+'%',top:'-20px',fontSize:(16+Math.random()*14)+'px',animation:`confetti-fall ${2.5+Math.random()*3}s linear ${1.5+Math.random()*2}s both`}}>{pool[Math.floor(Math.random()*pool.length)]}</div>;})}</div>
        {/* SPOTLIGHT BEAMS */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-1 h-full opacity-10" style={{background:`linear-gradient(180deg,${T.primary},transparent)`,animation:'spotlight-sweep 3s ease-in-out infinite',transformOrigin:'top',transform:'rotate(-15deg)'}}/>
          <div className="absolute top-0 right-1/4 w-1 h-full opacity-10" style={{background:`linear-gradient(180deg,${T.secondary||T.primary},transparent)`,animation:'spotlight-sweep 3s ease-in-out 1s infinite',transformOrigin:'top',transform:'rotate(15deg)'}}/>
        </div>
        <div className="relative text-center z-10 w-full max-w-lg mx-auto px-4">
          <div className="text-3xl sm:text-5xl font-black text-white mb-4 tracking-wider" style={{animation:'cinema-text 0.6s ease-out 0.3s backwards'}}>🏆 PARTIE TERMINÉE</div>
          <div className="text-2xl sm:text-4xl font-black mb-2" style={{color:T.primary,animation:'cinema-rise 0.5s ease-out 0.6s backwards',textShadow:'0 0 30px '+T.primary}}>{getWinner().join(' & ')}</div>
          {getWinner().length===1&&<div className="text-gray-400 text-sm mb-6" style={{animation:'cinema-rise 0.4s ease-out 0.9s backwards'}}>{(()=>{const t=getPlayerTitle(playerStats.find(s=>s.name===getWinner()[0]));return t.icon+' '+t.title;})()}</div>}
          {/* 3D PODIUM */}
          {players.length>=2&&<div className="flex items-end justify-center gap-2 sm:gap-4 mt-4" style={{perspective:'1200px',animation:'cinema-rise 0.5s ease-out 1.2s backwards'}}>
            {players.map(p=>calcTotal(p)).map((t,i)=>({name:players[i],score:t})).sort((a,b)=>b.score-a.score).slice(0,3).map((p,idx)=>{
              const podiumH = idx===0?130:idx===1?90:60;
              const medals = ['🥇','🥈','🥉'];
              const delay = idx===0?1.4:idx===1?1.6:1.8;
              const pc = getPlayerColor(p.name, players.indexOf(p.name));
              return <div key={p.name} className="flex flex-col items-center" style={{animation:`podium-3d-rise 0.8s cubic-bezier(0.34,1.56,0.64,1) ${delay}s backwards`}}>
                <div className={'text-3xl sm:text-5xl mb-2 '+(idx===0?'avatar-dance':'')}>{playerAvatars[p.name]||'👤'}</div>
                <div className="text-white text-xs sm:text-sm font-black mb-1 truncate max-w-[80px]">{p.name}</div>
                <div className="text-xs font-black mb-2" style={{color:pc.hex}}>{p.score} pts</div>
                {/* PODIUM BAR 3D */}
                <div className="relative" style={{width:'80px',height:podiumH+'px',transformStyle:'preserve-3d',transform:'rotateX(5deg) rotateY(-5deg)'}}>
                  {/* FRONT FACE */}
                  <div className="absolute inset-0 rounded-t-lg" style={{background:`linear-gradient(180deg,${pc.hex}80,${pc.hex}30)`,borderTop:`3px solid ${pc.hex}`,boxShadow:`0 0 30px ${pc.hex}20`}}>
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 text-2xl sm:text-3xl">{medals[idx]}</div>
                  </div>
                  {/* RIGHT FACE (3D effect) */}
                  <div className="absolute top-0 right-0 w-3 h-full rounded-tr-lg" style={{background:`linear-gradient(180deg,${pc.hex}40,${pc.hex}10)`,transform:'translateX(100%) skewY(-10deg)',transformOrigin:'left'}}/>
                  {/* GLOW */}
                  {idx===0&&<div className="absolute -inset-2 rounded-lg" style={{boxShadow:`0 0 40px ${pc.hex}40`,animation:'podium-glow 2s ease-in-out infinite'}}/>}
                </div>
              </div>;
            })}
          </div>}
        </div>
      </div>}

      {/* ═══ SUDDEN DEATH MODAL ═══ */}
      {showSuddenDeath&&(
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[200] p-4 modal-backdrop">
          <div className="modal-content w-full max-w-md">
            <div className="bg-gradient-to-b from-red-600 to-red-900 rounded-[40px] p-1 shadow-[0_0_80px_rgba(239,68,68,0.5)]" style={{animation:'glow 2s ease-in-out infinite'}}>
              <div className="bg-slate-950 rounded-[38px] overflow-hidden p-8 text-center relative">
                <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-red-500/30 to-transparent"></div>
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-red-500/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-red-500/20 rounded-full blur-3xl"></div>
                <div className="text-8xl mb-4 relative z-10" style={{animation:'trophy-float 2s ease-in-out infinite'}}>⚔️</div>
                <h2 className="text-xs font-black tracking-[0.3em] text-red-400 mb-2 relative z-10 uppercase" style={{animation:'fade-in-scale 0.5s ease-out 0.2s backwards'}}>Égalité parfaite</h2>
                <div className="text-5xl font-black uppercase mb-2 relative z-10 text-white" style={{animation:'victory-text 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.3s backwards',textShadow:'0 0 30px rgba(239,68,68,0.5)'}}>MORT SUBITE</div>
                <p className="text-gray-400 text-sm mb-4 relative z-10 font-medium" style={{animation:'fade-in-scale 0.4s ease-out 0.5s backwards'}}>Égalité à <span className="text-white font-black">{calcTotal(suddenDeathPlayers[0])} points</span> !</p>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 relative z-10" style={{animation:'fade-in-scale 0.4s ease-out 0.55s backwards'}}>
                  <div className="text-center mb-3"><span className="text-yellow-400 text-xs font-black uppercase tracking-widest">🎲 Chaque joueur lance les 5 dés</span></div>
                  <p className="text-gray-400 text-xs text-center">Additionnez vos dés et saisissez votre total ci-dessous.</p>
                </div>
                <div className="space-y-3 relative z-10">
                  {suddenDeathPlayers.map((p, idx) => (
                    <div key={p} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all" style={{animation:`fade-in-scale 0.4s ease-out ${0.6+idx*0.1}s backwards`}}>
                      <span className="text-2xl">{playerAvatars[p] || '👤'}</span>
                      <span className="text-white font-black text-lg flex-1">{p}</span>
                      <select id={`sd-score-${idx}`} className="bg-black/50 text-white font-black text-xl text-center py-3 px-4 rounded-xl border border-white/20 focus:border-red-400 outline-none w-24 transition-all hover:bg-black/70" defaultValue="">
                        <option value="" style={{backgroundColor:'#0f172a'}}>-</option>
                        {Array.from({length:26},(_,i)=>i+5).map(v=><option key={v} value={v} style={{backgroundColor:'#0f172a'}}>{v}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
                <button onClick={() => {
                  const sdScores = {};
                  suddenDeathPlayers.forEach((p, idx) => {
                    const el = document.getElementById(`sd-score-${idx}`);
                    sdScores[p] = el ? parseInt(el.value) || 0 : 0;
                  });
                  const maxSD = Math.max(...Object.values(sdScores));
                  const sdWinners = Object.entries(sdScores).filter(([,v]) => v === maxSD && v > 0);
                  if(sdWinners.length === 0) { alert('Saisissez les scores de chaque joueur !'); return; }
                  if(sdWinners.length > 1) { alert('Encore une égalité ! Relancez les dés.'); return; }
                  handleSuddenDeathWin(sdWinners[0][0], sdScores);
                }} className="w-full mt-4 py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-black text-lg rounded-2xl shadow-xl hover:scale-[1.02] transition-all duration-200 active:scale-[0.98] border border-red-400/30 relative z-10" style={{animation:'fade-in-scale 0.4s ease-out 0.9s backwards'}}>⚔️ VALIDER LA MORT SUBITE</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ BONUS LOST NOTIFICATION ═══ */}
      {/* ═══ BONUS FULLSCREEN POPUP ═══ */}
      {showBonusFullscreen&&(
        <div className="fixed inset-0 z-[150] flex items-center justify-center modal-backdrop" style={{backgroundColor:showBonusFullscreen.type==='obtained'?'rgba(0,0,0,0.85)':'rgba(0,0,0,0.85)'}} onClick={()=>{setShowBonusFullscreen(null);setConfetti(null);}}>
          <div className="text-center modal-content" onClick={e=>e.stopPropagation()}>
            {showBonusFullscreen.type==='obtained' ? (
              <>
                <div className="text-9xl mb-6" style={{animation:'trophy-float 2s ease-in-out infinite'}}>🎁</div>
                <div className="text-xs font-black tracking-[0.3em] text-green-400 uppercase mb-2" style={{animation:'fade-in-scale 0.5s ease-out 0.2s backwards'}}>FÉLICITATIONS</div>
                <div className="text-5xl sm:text-6xl font-black text-white mb-3" style={{animation:'victory-text 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.3s backwards'}}>BONUS +35 !</div>
                <div className="text-2xl font-bold mb-2" style={{color:'#4ade80',animation:'fade-in-scale 0.4s ease-out 0.5s backwards',textShadow:'0 0 30px rgba(74,222,128,0.5)'}}>{showBonusFullscreen.player}</div>
                <div className="text-gray-400 text-sm" style={{animation:'fade-in-scale 0.4s ease-out 0.6s backwards'}}>a débloqué le bonus de la partie supérieure !</div>
                <div className="mt-6 flex justify-center gap-2" style={{animation:'fade-in-scale 0.4s ease-out 0.8s backwards'}}>{[...'✨🎁💎🎊✨'].map((e,i)=><span key={i} className="text-3xl" style={{animation:`float ${1.5+i*0.3}s ease-in-out infinite ${i*0.2}s`}}>{e}</span>)}</div>
              </>
            ) : (
              <>
                <div className="text-9xl mb-6" style={{animation:'sad-pulse 2s ease-in-out infinite'}}>💔</div>
                <div className="text-xs font-black tracking-[0.3em] text-red-400 uppercase mb-2" style={{animation:'fade-in-scale 0.5s ease-out 0.2s backwards'}}>DOMMAGE</div>
                <div className="text-5xl sm:text-6xl font-black text-white mb-3" style={{animation:'victory-text 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.3s backwards'}}>BONUS RATÉ</div>
                <div className="text-2xl font-bold mb-2" style={{color:'#f87171',animation:'fade-in-scale 0.4s ease-out 0.5s backwards',textShadow:'0 0 30px rgba(248,113,113,0.5)'}}>{showBonusFullscreen.player}</div>
                <div className="text-gray-400 text-sm" style={{animation:'fade-in-scale 0.4s ease-out 0.6s backwards'}}>ne peut plus obtenir le bonus de 35 points</div>
                <div className="mt-6 flex justify-center gap-2" style={{animation:'fade-in-scale 0.4s ease-out 0.8s backwards'}}>{[...'😢💔😤😭😢'].map((e,i)=><span key={i} className="text-3xl" style={{animation:`float ${1.5+i*0.3}s ease-in-out infinite ${i*0.2}s`}}>{e}</span>)}</div>
              </>
            )}
          </div>
        </div>
      )}
      {/* ROULETTE OVERLAY */}

      {/* STYLED CONFIRM MODAL */}
      {confirmModal&&(
        <div className="fixed inset-0 z-[350] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm" onClick={()=>setConfirmModal(null)}>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/20 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl" onClick={e=>e.stopPropagation()} style={{animation:'fade-in-scale 0.3s cubic-bezier(0.34,1.56,0.64,1)'}}>
            <div className="text-4xl mb-4">🤔</div>
            <div className="text-white font-bold text-lg mb-6">{confirmModal.message}</div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={()=>setConfirmModal(null)} className="py-3 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 transition-all active:scale-95">Annuler</button>
              <button onClick={confirmModal.onYes} className="py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-black rounded-2xl hover:from-blue-400 hover:to-indigo-400 transition-all active:scale-95 shadow-lg shadow-blue-500/30">Confirmer</button>
            </div>
          </div>
        </div>
      )}
      {showTurnWarning&&<div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50" style={{animation:'bounce-in 0.4s cubic-bezier(0.34,1.56,0.64,1)'}}><div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-2xl shadow-2xl shadow-red-500/30 backdrop-blur-xl border border-white/20 flex items-center gap-3"><span className="text-2xl" style={{animation:'shake 0.5s ease-in-out infinite'}}>🚫</span><span className="font-semibold">{showTurnWarning}</span></div></div>}

      {/* STUDIO PHOTO MODAL */}
      {showStudioModal && (
          <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[120] p-4 modal-backdrop">
              <div className="modal-content bg-gradient-to-b from-gray-900 to-black p-8 rounded-3xl text-center max-w-sm w-full border-4 border-white/10 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 gradient-animate" style={{backgroundSize:'200% 200%'}}></div>
                  <div className="flex justify-center mb-4"><div className="p-4 bg-white/5 rounded-full border border-white/10"><Crown size={48} className="text-yellow-400"/></div></div>
                  <h2 className="text-3xl font-black text-white mb-1 uppercase tracking-widest">Vainqueur</h2>
                  <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-2">{getWinner()[0] || "..."}</div>
                  {(()=>{const w=getWinner()[0];const t=getPlayerTitle(playerStats.find(s=>s.name===w));return <div className="text-sm font-bold text-yellow-300/70 mb-4 flex items-center justify-center gap-1"><span>{t.icon}</span>{t.title}</div>;})()}
                  
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
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[400] p-4 modal-backdrop">
              <div className={'modal-content bg-gradient-to-br '+T.card+' border border-white/10 rounded-3xl p-6 max-w-md w-full relative max-h-[80vh] overflow-y-auto'}>
                  <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-black text-white">Choisir un Avatar</h3><button onClick={()=>setShowAvatarModal(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X/></button></div>
                  {/* CLASSIC AVATARS */}
                  <div className="mb-4">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">👤 Classique</div>
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
                  </div>
                  {/* THEMED PACKS */}
                  {Object.entries(AVATAR_PACKS).filter(([k])=>k!=='classic').map(([packKey, pack]) => {
                      const player = players[avatarSelectorIndex];
                      const stats = playerStats.find(s => s.name === player);
                      const packLocked = pack.req ? isAvatarLocked(pack.req, stats) : false;
                      return (
                          <div key={packKey} className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">{pack.name}</div>
                              {packLocked && <span className="text-[9px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-bold flex items-center gap-1"><Lock size={8}/> {pack.req.replace(':',': ')}</span>}
                            </div>
                            <div className={`grid grid-cols-4 gap-3 ${packLocked?'opacity-30 pointer-events-none':''}`}>
                              {pack.icons.map((icon, i) => (
                                  <button key={i} onClick={() => !packLocked && selectAvatar(icon)} disabled={packLocked} className="aspect-square rounded-2xl flex items-center justify-center text-3xl transition-all duration-300 bg-white/10 hover:bg-white/20 hover:scale-110 cursor-pointer hover:shadow-lg" style={{animation:`bounce-in 0.3s cubic-bezier(0.34,1.56,0.64,1) ${i*0.02}s backwards`}}>
                                      {icon}
                                  </button>
                              ))}
                            </div>
                          </div>
                      );
                  })}
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
                  <div className="relative z-10" style={{animation:'trophy-float 3s ease-in-out infinite'}}>{(()=>{const w=getWinner()[0];const t=getPlayerTitle(playerStats.find(s=>s.name===w));return t?.icon?<span className="text-7xl mx-auto block text-center mb-4" style={{filter:'drop-shadow(0 0 30px rgba(250,204,21,0.6))',animation:'trophy-glow 2s ease-in-out infinite'}}>{t.icon}</span>:<Trophy className="mx-auto text-yellow-400 mb-4" style={{filter:'drop-shadow(0 0 30px rgba(250,204,21,0.6))',animation:'trophy-glow 2s ease-in-out infinite'}} size={64}/>;})()}</div>
                  <h2 className="text-sm font-black tracking-widest text-yellow-500 mb-2 relative z-10" style={{animation:'fade-in-scale 0.5s ease-out 0.2s backwards'}}>{suddenDeathWinner ? '⚔️ MORT SUBITE - WINNER' : 'THE WINNER IS'}</h2>
                  <div className="text-6xl mb-2 relative z-10" style={{animation:'fade-in-scale 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.25s backwards'}}>{playerAvatars[getWinner()[0]]||'👤'}</div>
                  <div className="text-4xl font-black uppercase mb-6 relative z-10 text-white winner-glow" style={{animation:'victory-text 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.3s backwards'}}>{getWinner()[0]}</div>
                  {victorySigs[getWinner()[0]]&&<div className="text-sm italic text-yellow-300/80 -mt-4 mb-4 relative z-10" style={{animation:'fade-in-scale 0.4s ease-out 0.5s backwards'}}>"{victorySigs[getWinner()[0]]}"</div>}
                  {(()=>{
                      const w = getWinner()[0];
                      const wScores = scores[w]||{};
                      const total = calcTotal(w);
                      const upper = calcUpper(w);
                      const hasBonus = upper >= 63;
                      const zeros = playableCats.filter(c=>wScores[c.id]==='0'||wScores[c.id]===0).length;
                      const bestCat = playableCats.reduce((best,c)=>(parseInt(wScores[c.id])||0)>(parseInt(wScores[best.id])||0)?c:best, playableCats[0]);
                      const bestScore = parseInt(wScores[bestCat.id])||0;
                      const gap = players.length>1 ? total - Math.max(...players.filter(p2=>p2!==w).map(p2=>calcTotal(p2))) : 0;
                      return (
                      <div className="grid grid-cols-2 gap-3 mb-6 relative z-10">
                          <div className="bg-white/10 p-3 rounded-2xl border border-white/5" style={{animation:'fade-in-scale 0.4s ease-out 0.4s backwards'}}><div className="text-2xl font-black text-white" style={{fontFamily:'JetBrains Mono'}}>{total}</div><div className="text-[9px] uppercase text-yellow-100 font-bold">Points</div></div>
                          <div className="bg-white/10 p-3 rounded-2xl border border-white/5" style={{animation:'fade-in-scale 0.4s ease-out 0.45s backwards'}}><div className="text-2xl font-black text-white">{gap>0?'+'+gap:'='}</div><div className="text-[9px] uppercase text-yellow-100 font-bold">Écart</div></div>
                          <div className="bg-white/10 p-3 rounded-2xl border border-white/5" style={{animation:'fade-in-scale 0.4s ease-out 0.5s backwards'}}><div className="text-lg font-black text-white">{hasBonus?'✅ OUI':'❌ NON'}</div><div className="text-[9px] uppercase text-yellow-100 font-bold">Bonus</div></div>
                          <div className="bg-white/10 p-3 rounded-2xl border border-white/5" style={{animation:'fade-in-scale 0.4s ease-out 0.55s backwards'}}><div className="text-lg font-black text-white">{zeros}</div><div className="text-[9px] uppercase text-yellow-100 font-bold">Zéros</div></div>
                          <div className="col-span-2 bg-white/10 p-3 rounded-2xl border border-white/5" style={{animation:'fade-in-scale 0.4s ease-out 0.6s backwards'}}><div className="text-sm font-black text-white">{bestCat.icon} {bestCat.name} — {bestScore} pts</div><div className="text-[9px] uppercase text-yellow-100 font-bold">Meilleur coup</div></div>
                      </div>);
                  })()}
                  {players.length > 1 && (
                      <div className="mb-4 relative z-10 space-y-2" style={{animation:'fade-in-scale 0.4s ease-out 0.65s backwards'}}>
                          <div className="text-[9px] uppercase font-bold text-gray-400 tracking-wider mb-1">Classement</div>
                          {players.map(p=>({name:p,score:calcTotal(p)})).sort((a,b)=>b.score-a.score).map((p,i)=>(
                              <div key={p.name} className={"flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm "+(i===0?"bg-yellow-500/20 text-yellow-300":"bg-white/5 text-gray-300")}>
                                  <span>{['🥇','🥈','🥉','4️⃣','5️⃣','6️⃣'][i]}</span>
                                  <span className="font-bold flex-1">{playerAvatars[p.name]||'👤'} {p.name}</span>
                                  <span className="font-black">{p.score}</span>
                              </div>
                          ))}
                      </div>
                  )}
                  {players.length > 1 && getLoser() && (<div className="bg-red-500/20 p-4 rounded-2xl mb-4 relative z-10 border border-red-500/20" style={{animation:'fade-in-scale 0.4s ease-out 0.75s backwards'}}><p className="text-[10px] uppercase font-bold text-red-300 tracking-wider">⚡ Gage pour {getLoser().name}</p><p className="text-sm italic text-white font-bold mt-1">"{currentGage}"</p></div>)}
                  <div className="space-y-2 relative z-10" style={{animation:'fade-in-scale 0.4s ease-out 0.7s backwards'}}>
                      <input type="text" value={gameNote} onChange={e=>setGameNote(e.target.value)} placeholder="📝 Ajouter une note... (optionnel)" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 outline-none focus:border-yellow-400/50 transition-colors mb-1" maxLength={100}/>
                      <button onClick={saveGameFromModal} className="w-full py-4 bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-black rounded-2xl shadow-xl hover:scale-[1.03] transition-all duration-200 hover:shadow-yellow-500/40 hover:shadow-2xl active:scale-[0.98]">✨ ENREGISTRER</button>
                      <button onClick={()=>{
                        const lines = ['🎲 YAMS - Récapitulatif de partie','═'.repeat(40),'📅 '+new Date().toLocaleDateString('fr-FR',{day:'2-digit',month:'long',year:'numeric'}),'','🏆 CLASSEMENT:'];
                        players.map(p=>({name:p,score:calcTotal(p)})).sort((a,b)=>b.score-a.score).forEach((p,i)=>{lines.push(`  ${['🥇','🥈','🥉','4️⃣','5️⃣','6️⃣'][i]} ${p.name}: ${p.score} pts`);});
                        lines.push('','📊 DÉTAIL:');
                        playableCats.forEach(cat=>{lines.push(`  ${cat.name}: ${players.map(p=>`${p}=${scores[p]?.[cat.id]??'-'}`).join(' | ')}`);});
                        lines.push('','📈 STATS:');
                        players.forEach(p=>{const up=calcUpper(p);lines.push(`  ${p}: Sup=${up}/63 ${up>=63?'✅ BONUS':'❌'} | Total=${calcTotal(p)}`);});
                        if(activeChallenge)lines.push('','🎯 Défi: '+activeChallenge.desc);
                        const blob=new Blob([lines.join('\n')],{type:'text/plain'});
                        const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='yams-recap-'+new Date().toISOString().slice(0,10)+'.txt';a.click();URL.revokeObjectURL(url);
                        pushNotif({icon:'📄',title:'Récap exporté !',description:'Fichier texte téléchargé'});
                      }} className="w-full py-3 bg-white/5 text-white font-bold rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-sm"><FileText size={16}/> 📄 Exporter le récap</button>
                      <button onClick={()=>{
                        const canvas=document.createElement('canvas');canvas.width=600;canvas.height=400;
                        const ctx=canvas.getContext('2d');
                        ctx.fillStyle='#0f172a';ctx.fillRect(0,0,600,400);
                        const grd=ctx.createLinearGradient(0,0,600,400);grd.addColorStop(0,T.primary+'40');grd.addColorStop(1,T.secondary+'40');ctx.fillStyle=grd;ctx.fillRect(0,0,600,400);
                        ctx.fillStyle='#fff';ctx.font='bold 28px system-ui';ctx.textAlign='center';
                        ctx.fillText('🎲 YAMS - Résultats',300,45);
                        ctx.font='12px system-ui';ctx.fillStyle='#94a3b8';
                        ctx.fillText(new Date().toLocaleDateString('fr-FR',{day:'2-digit',month:'long',year:'numeric'}),300,70);
                        const ranked=players.map(p=>({name:p,score:calcTotal(p)})).sort((a,b)=>b.score-a.score);
                        ranked.forEach((p,i)=>{
                          const y=110+i*55;
                          ctx.fillStyle=i===0?'rgba(250,204,21,0.15)':'rgba(255,255,255,0.05)';
                          ctx.beginPath();ctx.roundRect(40,y-15,520,45,12);ctx.fill();
                          ctx.fillStyle=i===0?'#fbbf24':'#fff';ctx.font='bold 22px system-ui';ctx.textAlign='left';
                          ctx.fillText(['🥇','🥈','🥉','4️⃣','5️⃣','6️⃣'][i]+' '+p.name,60,y+12);
                          ctx.textAlign='right';ctx.font='bold 24px JetBrains Mono, monospace';
                          ctx.fillText(p.score+' pts',540,y+12);
                        });
                        ctx.fillStyle='#475569';ctx.font='10px system-ui';ctx.textAlign='center';
                        ctx.fillText('yams-scorekeeper',300,385);
                        canvas.toBlob(blob=>{if(blob){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='yams-recap-'+new Date().toISOString().slice(0,10)+'.png';a.click();URL.revokeObjectURL(url);}});
                        pushNotif({icon:'🖼️',title:'Image exportée !',description:'PNG téléchargé'});
                      }} className="w-full py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 font-bold rounded-2xl hover:from-purple-500/30 hover:to-pink-500/30 transition-all flex items-center justify-center gap-2 text-sm border border-purple-500/20">🖼️ Exporter en image</button>
                      <div className="grid grid-cols-2 gap-2">
                          <button onClick={()=>{setShowEndGameModal(false);setGameEndShown(false);resetGame(getLoser()?.name||null);}} className="py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-black rounded-2xl hover:from-green-400 hover:to-emerald-400 flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-green-500/30">🔄 REVANCHE</button>
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

          {/* XP LEVEL BAR */}
          {globalXP > 0 && <div className="mb-2 mt-1">
            {(()=>{const xl=getXPLevel(globalXP);return <div className="flex items-center gap-2">
              <span className="text-xs font-black" style={{color:T.primary}}>{xl.icon} Niv.{xl.level}</span>
              <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden"><div className="h-full rounded-full transition-all duration-1000" style={{width:xl.progress+'%',background:`linear-gradient(90deg,${T.primary},${T.secondary})`}}/></div>
              <span className="text-[9px] text-gray-500 font-bold">{globalXP} XP</span>
            </div>;})()}
          </div>}
          <div className="flex items-center justify-between flex-wrap gap-4 mb-4 mt-2">
            <div className="flex items-center gap-4"><div className="text-5xl float-anim">🎲</div><div><h1 className="text-3xl sm:text-4xl font-black text-white bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent" style={{letterSpacing:'-0.02em'}}>YAMS</h1>
            <p className="text-sm text-gray-400 font-medium tracking-wider">Score keeper premium</p>
            </div></div>
            <div className="flex gap-2">
                <button onClick={()=>setShowLog(!showLog)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-lg"><ScrollText size={22} className="text-white"/></button>
                <button onClick={()=>setShowSettings(!showSettings)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all duration-300 backdrop-blur-sm border border-white/10 group hover:scale-110 active:scale-95 hover:shadow-lg"><Settings size={22} className="text-white group-hover:rotate-90 transition-transform duration-300"/></button>
            </div>
          </div>
          
          {showSettings&&<div className="mt-4 pt-4 border-t border-white/10 slide-down space-y-2">

              {/* ═══════════ SECTION 1: APPARENCE ═══════════ */}
              <div>
                <button onClick={()=>setOpenSettingsSection(openSettingsSection==='apparence'?null:'apparence')} className="flex items-center gap-2 mb-3 w-full group"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm">🎨</div><h3 className="text-white font-black text-sm uppercase tracking-wider flex-1 text-left">Apparence</h3><ChevronDown size={16} className={"text-gray-500 transition-transform duration-300 "+(openSettingsSection==='apparence'?'rotate-180':'')}/></button>
                {openSettingsSection==='apparence'&&
                
                <div className="space-y-5">
                  <div><div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1"><Palette size={10}/> Thème</div><div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2">{Object.keys(THEMES_CONFIG).map(k=>{const td=THEMES_CONFIG[k];return <button key={k} onClick={()=>{if(k!==theme){setThemeTransition(true);setTheme(k);setTimeout(()=>setThemeTransition(false),50);}}} className={'relative overflow-hidden px-3 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-1.5 '+(theme===k?'ring-2 ring-white scale-105':'hover:scale-105 opacity-80 hover:opacity-100')} style={{background:'linear-gradient(135deg,'+td.primary+','+td.secondary+')',color:'#fff'}}>{theme===k?<Check size={14}/>:td.icon}<span>{td.name}</span></button>;})}</div></div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1"><Dices size={10}/> Dés</div><div className="grid grid-cols-2 gap-2">{Object.keys(DICE_SKINS).map(k=>{const s=DICE_SKINS[k];return <button key={k} onClick={()=>setDiceSkin(k)} className={`px-3 py-2 rounded-xl font-bold text-sm transition-all border ${diceSkin===k?'border-white/60 bg-white/15 text-white':'border-white/5 bg-white/5 text-gray-500 hover:bg-white/10 hover:text-gray-300'}`}>{s.name}</button>;})}</div></div>
                    <div><div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1"><Image size={10}/> Grille</div><div className="grid grid-cols-2 gap-2">{Object.keys(GRID_SKINS).map(k=>{const s=GRID_SKINS[k];return <button key={k} onClick={()=>setGridSkin(k)} className={`px-3 py-2 rounded-xl font-bold text-sm transition-all border ${gridSkin===k?'border-white/60 bg-white/15 text-white':'border-white/5 bg-white/5 text-gray-500 hover:bg-white/10 hover:text-gray-300'}`}>{s.name}</button>;})}</div></div>
                  </div>

                  <div><div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">🔄 Vitesse animations</div><div className="flex items-center gap-3"><input type="range" min="0.5" max="2" step="0.25" value={animSpeed} onChange={e=>setAnimSpeed(parseFloat(e.target.value))} className="flex-1 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500"/><span className="text-white font-bold text-sm min-w-[40px] text-right">{animSpeed}x</span></div></div>
                  <div><div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">✨ Intensité effets</div><div className="flex items-center gap-3"><input type="range" min="0" max="1.5" step="0.25" value={effectsIntensity} onChange={e=>setEffectsIntensity(parseFloat(e.target.value))} className="flex-1 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-purple-500"/><span className="text-white font-bold text-sm min-w-[40px] text-right">{effectsIntensity===0?'Off':effectsIntensity<=0.5?'Min':effectsIntensity<=1?'Std':'Max'}</span></div></div>
                  <div><div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">🔤 Taille texte</div><div className="flex items-center gap-3"><input type="range" min="0.85" max="1.2" step="0.05" value={fontScale} onChange={e=>setFontScale(parseFloat(e.target.value))} className="flex-1 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-cyan-500"/><span className="text-white font-bold text-sm min-w-[40px] text-right">{fontScale<=0.9?'S':fontScale<=1.05?'M':'L'}</span></div></div>
                  <div><div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1"><Terminal size={10}/> Police</div><div className="grid grid-cols-2 sm:grid-cols-4 gap-2">{Object.entries(FONT_OPTIONS).map(([k,f])=><button key={k} onClick={()=>setCustomFont(k)} className={`px-3 py-2 rounded-xl font-bold text-sm transition-all border ${customFont===k?'border-white/60 bg-white/15 text-white':'border-white/5 bg-white/5 text-gray-500 hover:bg-white/10 hover:text-gray-300'}`} style={{fontFamily:f.family}}>{f.name}</button>)}</div></div>
                </div>}
              </div>
              {/* ═══════════ SECTION 2: JOUEURS ═══════════ */}
              <div>
                <button onClick={()=>setOpenSettingsSection(openSettingsSection==='joueurs'?null:'joueurs')} className="flex items-center gap-2 mb-3 w-full group"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm">👥</div><h3 className="text-white font-black text-sm uppercase tracking-wider flex-1 text-left">Joueurs</h3><ChevronDown size={16} className={"text-gray-500 transition-transform duration-300 "+(openSettingsSection==='joueurs'?'rotate-180':'')}/></button>
                {openSettingsSection==='joueurs'&&

                <div className="space-y-4">
                  <div><div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">🎨 Couleur</div><div className="space-y-2">{players.map((p,pi)=>{const current=playerColors[p]||PLAYER_COLORS[pi%PLAYER_COLORS.length].id;return <div key={p} className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10"><span className="text-white font-bold flex-1 text-sm">{playerAvatars[p]||'👤'} {p}</span><div className="flex gap-1.5">{PLAYER_COLORS.map(c=><button key={c.id} onClick={()=>setPlayerColors({...playerColors,[p]:c.id})} className={'w-6 h-6 rounded-full border-2 transition-all hover:scale-110 '+(current===c.id?'border-white scale-110':'border-transparent')} style={{background:c.hex}} title={c.name}/>)}</div></div>;})}</div></div>

                  <div><div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">✍️ Signature de victoire</div><div className="space-y-2">{players.map((p,pi)=><div key={p} className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10"><span className="text-white font-bold text-sm shrink-0">{playerAvatars[p]||'👤'} {p}</span><input type="text" value={victorySigs[p]||''} onChange={e=>setVictorySigs({...victorySigs,[p]:e.target.value})} placeholder='"GG EZ 😎"' className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs placeholder-gray-600 outline-none focus:border-white/30" maxLength={40}/></div>)}</div></div>
                </div>}
              </div>
              {/* ═══════════ SECTION 3: MODES DE JEU ═══════════ */}
              <div>
                <button onClick={()=>setOpenSettingsSection(openSettingsSection==='modes'?null:'modes')} className="flex items-center gap-2 mb-3 w-full group"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-sm">⚡</div><h3 className="text-white font-black text-sm uppercase tracking-wider flex-1 text-left">Modes de jeu</h3><ChevronDown size={16} className={"text-gray-500 transition-transform duration-300 "+(openSettingsSection==='modes'?'rotate-180':'')}/></button>
                {openSettingsSection==='modes'&&

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    {label:'Score Fantôme',desc:'Meilleur score en filigrane',icon:'👻',color:'indigo',val:showGhostScores,set:()=>setShowGhostScores(!showGhostScores)},
                    {label:'Anti-Veille',desc:'Écran toujours allumé',icon:'☀️',color:'blue',val:wakeLockEnabled,set:()=>setWakeLockEnabled(!wakeLockEnabled)},
                    {label:'Brouillard',desc:'Scores adverses cachés',icon:'🌫️',color:'purple',val:fogMode,set:()=>setFogMode(!fogMode)},
                    {label:'Speed Run',desc:'Chrono 30s par tour',icon:'⏱️',color:'red',val:speedMode,set:()=>setSpeedMode(!speedMode)},
                    {label:'Totaux Cachés',desc:'Suspense garanti',icon:'🙈',color:'green',val:hideTotals,set:()=>setHideTotals(!hideTotals)},
                    {label:'Ordre Imposé',desc:'Remplir de haut en bas',icon:'🔒',color:'sky',val:imposedOrder,set:()=>setImposedOrder(!imposedOrder)},
                  ].map(opt=>(
                    <div key={opt.label} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-3 hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{opt.icon}</span>
                        <div><div className="text-white font-bold text-sm">{opt.label}</div><div className="text-gray-500 text-[10px]">{opt.desc}</div></div>
                      </div>
                      <button onClick={opt.set} className={'relative w-12 h-7 rounded-full transition-all duration-300 '+(opt.val?'shadow-lg':'bg-gray-700/80 shadow-inner')} style={opt.val?{background:({indigo:'#6366f1',blue:'#3b82f6',purple:'#8b5cf6',red:'#ef4444',green:'#22c55e',sky:'#0ea5e9'})[opt.color],boxShadow:`0 0 12px ${({indigo:'#6366f1',blue:'#3b82f6',purple:'#8b5cf6',red:'#ef4444',green:'#22c55e',sky:'#0ea5e9'})[opt.color]}40`}:{}}><div className={'absolute top-0.5 w-6 h-6 bg-white rounded-full transition-all duration-300 shadow-md flex items-center justify-center text-[8px] font-black '+(opt.val?'left-[22px]':'left-0.5')} style={{transform:opt.val?'scale(1)':'scale(0.9)'}}><span style={{color:opt.val?({indigo:'#6366f1',blue:'#3b82f6',purple:'#8b5cf6',red:'#ef4444',green:'#22c55e',sky:'#0ea5e9'})[opt.color]:'transparent'}}>{opt.val?'✓':''}</span></div></button>
                    </div>
                  ))}
                </div>}
              </div>
              {/* ═══════════ SECTION 4: SAISONS ═══════════ */}
              <div>
                <button onClick={()=>setOpenSettingsSection(openSettingsSection==='saisons'?null:'saisons')} className="flex items-center gap-2 mb-3 w-full group"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-white text-sm">📅</div><h3 className="text-white font-black text-sm uppercase tracking-wider flex-1 text-left">Saisons</h3><ChevronDown size={16} className={"text-gray-500 transition-transform duration-300 "+(openSettingsSection==='saisons'?'rotate-180':'')}/></button>
                {openSettingsSection==='saisons'&&

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                  <div className="text-gray-400 text-xs">Saison active : <span className="text-cyan-400 font-bold">{activeSeason}</span></div>
                  
                  <div className="flex gap-2 items-center">
                    {renamingSeason ? (
                      <div className="flex gap-2 items-center flex-1">
                        <input type="text" value={tempSeasonName} onChange={e=>setTempSeasonName(e.target.value)} className="flex-1 bg-black/40 text-white px-3 py-2 rounded-lg text-sm border border-cyan-500/50 outline-none" autoFocus />
                        <button onClick={() => { if(tempSeasonName && !seasons.includes(tempSeasonName)) { const newSeasons = seasons.map(s => s === activeSeason ? tempSeasonName : s); setSeasons(newSeasons); setActiveSeason(tempSeasonName); setRenamingSeason(null); }}} className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30"><Check size={14}/></button>
                        <button onClick={()=>setRenamingSeason(null)} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"><X size={14}/></button>
                      </div>
                    ) : (
                      <>
                        <select value={activeSeason} onChange={e=>setActiveSeason(e.target.value)} className="flex-1 bg-black/30 text-white px-3 py-2 rounded-xl text-sm font-bold border border-white/10 outline-none">
                          <option value="Aucune">Hors Saison</option>
                          {seasons.map(s=><option key={s} value={s}>{s}</option>)}
                        </select>
                        {activeSeason !== 'Aucune' && <>
                          <button onClick={()=>{setTempSeasonName(activeSeason); setRenamingSeason(true);}} className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl" title="Renommer"><Edit3 size={14}/></button>
                          <button onClick={()=>{showConfirm(`Supprimer "${activeSeason}" ?`, () => { setConfirmModal(null); setSeasons(seasons.filter(s=>s!==activeSeason)); setActiveSeason('Aucune'); });}} className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl" title="Supprimer"><Trash2 size={14}/></button>
                        </>}
                      </>
                    )}
                  </div>

                  {activeSeason !== 'Aucune' && (
                    <div className="flex gap-2 items-center">
                      <PenLine size={12} className="text-gray-500 shrink-0"/>
                      <input type="text" placeholder="Description..." value={seasonDescriptions[activeSeason] || ''} onChange={e => updateSeasonDescription(activeSeason, e.target.value)} className="flex-1 bg-transparent text-gray-300 text-xs outline-none border-b border-white/10 focus:border-cyan-400 py-1"/>
                    </div>
                  )}

                  <div className="flex gap-2 pt-1">
                    <input type="text" placeholder="Nouvelle saison..." value={newSeasonName} onChange={e=>setNewSeasonName(e.target.value)} className="flex-1 bg-black/20 text-white px-3 py-2 rounded-xl text-xs outline-none border border-white/10 focus:border-white/30"/>
                    <button onClick={() => { if(newSeasonName && !seasons.includes(newSeasonName)) { setSeasons([...seasons, newSeasonName]); setActiveSeason(newSeasonName); setNewSeasonName(''); }}} className="px-3 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-xl font-bold text-sm transition-all"><Plus size={14}/></button>
                  </div>
                </div>}
              </div>

          </div>}
          
          <div className="flex gap-2 mt-4 flex-wrap sticky bottom-0 z-30 py-3 -mx-4 sm:-mx-6 px-4 sm:px-6 -mb-4 sm:-mb-6 rounded-b-3xl" style={{background:'linear-gradient(to top, rgba(0,0,0,0.85) 60%, transparent)',backdropFilter:'blur(16px)'}}>
            <button onClick={()=>switchTab('game')} className={'flex-1 min-w-[80px] py-3 rounded-xl font-bold transition-all duration-300 hover-float active:scale-95 btn-ripple '+(currentTab==='game'?'text-white shadow-xl scale-[1.02] '+T.glow:'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10 hover:text-white')} style={currentTab==='game'?{background:'linear-gradient(135deg,'+T.primary+','+T.secondary+')'}:{}}>🎮 Partie</button>
            <button onClick={()=>switchTab('rules')} className={'flex-1 min-w-[80px] py-3 rounded-xl font-bold transition-all duration-300 hover-float active:scale-95 btn-ripple '+(currentTab==='rules'?'text-white shadow-xl scale-[1.02] '+T.glow:'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10 hover:text-white')} style={currentTab==='rules'?{background:'linear-gradient(135deg,'+T.primary+','+T.secondary+')'}:{}}>🎲 Règles & Aide</button>
            <button onClick={()=>switchTab('trophies')} className={'flex-1 min-w-[80px] py-3 rounded-xl font-bold transition-all duration-300 hover-float active:scale-95 btn-ripple '+(currentTab==='trophies'?'text-white shadow-xl scale-[1.02] '+T.glow:'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10 hover:text-white')} style={currentTab==='trophies'?{background:'linear-gradient(135deg,'+T.primary+','+T.secondary+')'}:{}}>🏆 Carrière</button>
            <button onClick={()=>switchTab('history')} className={'flex-1 min-w-[80px] py-3 rounded-xl font-bold transition-all duration-300 hover-float active:scale-95 btn-ripple '+(currentTab==='history'?'text-white shadow-xl scale-[1.02] '+T.glow:'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10 hover:text-white')} style={currentTab==='history'?{background:'linear-gradient(135deg,'+T.primary+','+T.secondary+')'}:{}}>📜 Historique</button>
            <button onClick={()=>switchTab('stats')} className={'flex-1 min-w-[80px] py-3 rounded-xl font-bold transition-all duration-300 hover-float active:scale-95 btn-ripple '+(currentTab==='stats'?'text-white shadow-xl scale-[1.02] '+T.glow:'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10 hover:text-white')} style={currentTab==='stats'?{background:'linear-gradient(135deg,'+T.primary+','+T.secondary+')'}:{}}>📊 Stats</button>
            <button onClick={()=>switchTab('gages')} className={'flex-1 min-w-[80px] py-3 rounded-xl font-bold transition-all duration-300 hover-float active:scale-95 btn-ripple '+(currentTab==='gages'?'text-white shadow-xl scale-[1.02] '+T.glow:'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10 hover:text-white')} style={currentTab==='gages'?{background:'linear-gradient(135deg,'+T.primary+','+T.secondary+')'}:{}}>😈 Gages</button>
            <button onClick={()=>switchTab('records')} className={'flex-1 min-w-[80px] py-3 rounded-xl font-bold transition-all duration-300 hover-float active:scale-95 btn-ripple '+(currentTab==='records'?'text-white shadow-xl scale-[1.02] '+T.glow:'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10 hover:text-white')} style={currentTab==='records'?{background:'linear-gradient(135deg,'+T.primary+','+T.secondary+')'}:{}}>🏅 Records</button>
          </div>
        </div>

        {/* LOG JOURNAL */}
        {showLog && (
            <div className={"bg-black/80 backdrop-blur-xl p-6 rounded-3xl border border-white/20 card-appear"}>
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
        

        {/* TAB: GAGES */}
        {/* ONBOARDING OVERLAY */}
        {onboardStep>0&&players.length===0&&gameHistory.length===0&&currentTab==='game'&&(
          <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={()=>{setOnboardStep(0);try{localStorage.setItem('yamsOnboardDone','1');}catch(e){}}}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-white/20 rounded-3xl p-8 max-w-sm mx-4 text-center modal-content" onClick={e=>e.stopPropagation()}>
              {onboardStep===1&&<>
                <div className="text-7xl mb-4" style={{animation:'empty-bounce 2s ease-in-out infinite'}}>👋</div>
                <h3 className="text-2xl font-black text-white mb-2">Bienvenue sur YAMS !</h3>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">L'app ultime pour compter les points au Yams entre amis. Voici comment ça marche en 3 étapes :</p>
                <div className="space-y-3 text-left mb-6">
                  <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3"><span className="text-2xl">1️⃣</span><div><span className="text-white font-bold text-sm">Ajoutez des joueurs</span><span className="text-gray-500 text-xs block">Entrez les prénoms en haut de l'écran</span></div></div>
                  <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3"><span className="text-2xl">2️⃣</span><div><span className="text-white font-bold text-sm">Remplissez les scores</span><span className="text-gray-500 text-xs block">Tapez sur les cellules de la grille pour saisir</span></div></div>
                  <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3"><span className="text-2xl">3️⃣</span><div><span className="text-white font-bold text-sm">Sauvegardez la partie</span><span className="text-gray-500 text-xs block">En fin de partie, tout est enregistré automatiquement</span></div></div>
                </div>
                <button onClick={()=>{setOnboardStep(0);try{localStorage.setItem('yamsOnboardDone','1');}catch(e){}}} className="w-full py-3 rounded-2xl font-black text-lg text-white btn-ripple" style={{background:`linear-gradient(135deg,${T.primary},${T.secondary})`}}>C'est parti ! 🎲</button>
              </>}
            </div>
          </div>
        )}

        {currentTab === 'gages' && (
            <div className={"space-y-4 tab-slide-"+tabDirection}>
                <div className={'bg-gradient-to-br '+T.card+' backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl '+T.glow+' p-6'}>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-black text-white flex items-center gap-3"><Gavel className="text-orange-500"/> Gages & Punitions</h2>
                        <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-xl border border-white/10">
                            <span className="text-sm font-bold text-white">Gages par défaut</span>
                            <button 
                                onClick={() => setEnableDefaultGages(!enableDefaultGages)}
                                className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${enableDefaultGages ? 'bg-green-500' : 'bg-gray-600'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-300 ${enableDefaultGages ? 'left-7' : 'left-1'}`}></div>
                            </button>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Gages Classiques ({DEFAULT_GAGES.length})</h3>
                        <div className={`grid grid-cols-1 md:grid-cols-2 gap-2 transition-opacity duration-300 ${enableDefaultGages ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                            {DEFAULT_GAGES.map((g, i) => (
                                <div key={i} className="bg-white/5 p-3 rounded-xl border border-white/10 text-gray-300 text-sm flex items-center gap-2 hover:bg-white/10 hover:border-white/20 transition-all duration-200 hover:scale-[1.01]">
                                    <span className="text-lg">📜</span> {g}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Vos Gages Personnalisés</h3>
                            <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded text-xs font-bold">{customGages.length} créés</span>
                        </div>

                        <div className="flex gap-2 mb-4">
                            <input 
                                type="text" 
                                value={newGageInput}
                                onChange={(e) => setNewGageInput(e.target.value)}
                                placeholder="Inventez une punition..." 
                                className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none"
                                onKeyPress={(e) => e.key === 'Enter' && addCustomGage()}
                            />
                            <button onClick={addCustomGage} className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-xl transition-colors"><Plus/></button>
                        </div>

                        <div className="space-y-2">
                            {customGages.length === 0 ? (
                                <div className="text-center py-8 text-gray-500 italic">Aucun gage personnalisé. Soyez créatifs !</div>
                            ) : (
                                customGages.map(g => (
                                    <div key={g.id} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${g.active ? 'bg-blue-500/10 border-blue-500/30' : 'bg-black/20 border-white/5 opacity-60'}`}>
                                        <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => toggleCustomGage(g.id)}>
                                            {/* SWITCH VISUEL */}
                                            <button 
                                                className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${g.active ? 'bg-green-500' : 'bg-gray-600'}`}
                                            >
                                                <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-transform duration-300 ${g.active ? 'left-6' : 'left-1'}`}></div>
                                            </button>
                                            <span className="text-white font-medium">{g.text}</span>
                                        </div>
                                        <button onClick={() => deleteCustomGage(g.id)} className="p-2 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition-colors">
                                            <Trash2 size={16}/>
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )}

        
        {/* TAB: TROPHIES & CAREER */}
        {currentTab==='trophies'&&(
            <div className={"space-y-4 tab-slide-"+tabDirection}>
                <div className={'bg-gradient-to-br '+T.card+' p-6 rounded-3xl border border-white/10'}>
                    <h2 className="text-3xl font-black text-white mb-2 flex items-center gap-3"><Award className="text-yellow-400"/> Galerie des Trophées</h2>
                    <p className="text-gray-400 text-sm mb-4">{ACHIEVEMENTS.filter(ach=>{let w=false;playerStats.forEach(p=>{if(ach.id==='first_win'&&p.wins>0)w=true;if(ach.id==='score_300'&&p.maxScore>=300)w=true;if(ach.id==='score_350'&&p.maxScore>=350)w=true;if(ach.id==='yams_king'&&p.yamsCount>=10)w=true;if(ach.id==='veteran'&&p.games>=50)w=true;if(ach.id==='bonus_hunter'&&p.bonusCount>=20)w=true;});return w;}).length} / {ACHIEVEMENTS.length} débloqués</p>
                    {/* 3D SHELF BADGE WALL */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" style={{perspective:'1200px'}}>
                        {ACHIEVEMENTS.map((ach,achIdx) => {
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
                                <div key={ach.id} className={`relative group p-5 rounded-2xl border flex flex-col items-center text-center transition-all duration-500 cursor-pointer ${unlocked ? 'bg-gradient-to-br from-yellow-500/10 via-amber-500/5 to-orange-500/10 border-yellow-500/40 shadow-lg shadow-yellow-500/10 hover:shadow-yellow-500/30 hover:scale-105 hover:-translate-y-2' : 'bg-black/30 border-white/5 hover:bg-black/40 hover:border-white/10'}`} style={{animation:`badge-shelf-3d 0.5s cubic-bezier(0.22,1,0.36,1) ${achIdx*0.08}s backwards`,transformStyle:'preserve-3d'}}>
                                    {unlocked&&<div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-[10px] shadow-lg">✓</div>}
                                    {/* 3D SHELF BOTTOM */}
                                    {unlocked&&<div className="absolute -bottom-1 left-2 right-2 h-2 rounded-b-lg" style={{background:'linear-gradient(180deg,transparent,rgba(250,204,21,0.15))',transform:'perspective(200px) rotateX(60deg)',transformOrigin:'top'}}/>}
                                    <div className={`text-5xl mb-3 transition-transform duration-500 ${unlocked?'group-hover:scale-125 drop-shadow-lg':'grayscale opacity-30'}`} style={unlocked?{animation:`badge-float 3s ease-in-out ${achIdx*0.4}s infinite`,filter:'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'}:{}}>{unlocked ? ach.icon : '🔒'}</div>
                                    <div className={'font-bold text-sm mb-1 '+(unlocked?'text-white':'text-gray-600')}>{ach.name}</div>
                                    <div className={'text-[10px] leading-tight mb-2 '+(unlocked?'text-gray-400':'text-gray-700')}>{ach.desc}</div>
                                    {unlocked ? (
                                        <div className="text-[9px] font-black text-yellow-400 border-t border-yellow-500/20 pt-2 mt-auto w-full truncate uppercase tracking-wider">{winners.join(', ')}</div>
                                    ) : (
                                        <div className="text-[9px] font-bold text-gray-700 border-t border-white/5 pt-2 mt-auto w-full uppercase tracking-wider flex items-center justify-center gap-1"><Lock size={8}/> Verrouillé</div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* CAREER BADGES */}
                {playerStats.length > 0 && (
                <div className={'bg-gradient-to-br '+T.card+' p-6 rounded-3xl border border-white/10'}>
                    <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3"><Star className="text-purple-400"/> Badges de Carrière</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {playerStats.map((pStat, idx) => {
                            const badges = [];
                            if(pStat.games >= 1) badges.push({icon:'🎮',name:'Initié',desc:`${pStat.games} parties jouées`});
                            if(pStat.games >= 10) badges.push({icon:'⚔️',name:'Guerrier',desc:'10+ parties'});
                            if(pStat.games >= 25) badges.push({icon:'🛡️',name:'Gladiateur',desc:'25+ parties'});
                            if(pStat.games >= 50) badges.push({icon:'👴',name:'Vétéran',desc:'50+ parties'});
                            if(pStat.wins >= 1) badges.push({icon:'🥇',name:'Vainqueur',desc:'1ère victoire'});
                            if(pStat.wins >= 10) badges.push({icon:'🏅',name:'Champion',desc:'10+ victoires'});
                            if(pStat.maxScore >= 200) badges.push({icon:'📈',name:'Scorer',desc:'200+ pts'});
                            if(pStat.maxScore >= 300) badges.push({icon:'🔥',name:'Légende',desc:'300+ pts'});
                            if(pStat.maxScore >= 350) badges.push({icon:'⚡',name:'Divin',desc:'350+ pts'});
                            if(pStat.yamsCount >= 1) badges.push({icon:'🎲',name:'Lucky',desc:'1er Yams'});
                            if(pStat.yamsCount >= 5) badges.push({icon:'🎯',name:'Sniper',desc:'5+ Yams'});
                            if(pStat.bonusCount >= 1) badges.push({icon:'🎁',name:'Bonus!',desc:'1er bonus'});
                            if(pStat.bonusCount >= 10) badges.push({icon:'💎',name:'Collectionneur',desc:'10+ bonus'});
                            if(pStat.currentStreak >= 3) badges.push({icon:'🔥',name:'En feu!',desc:`Série de ${pStat.currentStreak}`});
                            if(pStat.maxConsecutiveWins >= 5) badges.push({icon:'💪',name:'Inarrêtable',desc:`Série max ${pStat.maxConsecutiveWins}`});
                            const COLORS=['#6366f1','#ec4899','#10b981','#f59e0b','#8b5cf6','#06b6d4'];
                            const color = COLORS[idx%COLORS.length];
                            return (
                                <div key={pStat.name} className="glass-strong rounded-2xl p-5 hover:bg-white/10 transition-all duration-300 hover-lift" style={{animation:`fade-in-scale 0.4s ease-out ${idx*0.1}s backwards`}}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-black shadow-lg" style={{backgroundColor:color,color:'#000'}}>{playerAvatars[pStat.name]||'👤'}</div>
                                        <div>
                                            <div className="text-white font-black text-lg">{pStat.name}</div>
                                            <div className="text-gray-400 text-xs font-bold">{badges.length} badge{badges.length>1?'s':''} débloqué{badges.length>1?'s':''}</div>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {badges.length === 0 ? (
                                            <div className="text-gray-500 text-xs italic">Jouez pour débloquer des badges !</div>
                                        ) : badges.map((b,bi) => (
                                            <div key={bi} className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-1.5 hover:bg-white/20 transition-all duration-200 hover:scale-105 cursor-default group" title={b.desc} style={{animation:`bounce-in 0.3s cubic-bezier(0.34,1.56,0.64,1) ${bi*0.04}s backwards`}}>
                                                <span className="text-lg group-hover:scale-110 transition-transform">{b.icon}</span>
                                                <span className="text-[10px] font-bold text-white uppercase tracking-wide">{b.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                )}
                {/* WALL OF SHAME */}
                {gameHistory.length >= 3 && (()=>{
                    const shame = getWallOfShame(gameHistory);
                    if(!shame || shame.length === 0) return null;
                    return <div className={'bg-gradient-to-br from-red-950/30 to-rose-950/30 backdrop-blur-xl border border-red-500/20 rounded-3xl shadow-2xl p-6 mt-4'}>
                        <h2 className="text-2xl font-black text-red-400 mb-4 flex items-center gap-3">💀 Mur de la Honte</h2>
                        <div className="space-y-3">
                            {shame.slice(0,5).map((s,i) => (
                                <div key={s.name} className="flex items-center gap-4 bg-black/30 rounded-2xl p-4 border border-red-500/10 hover:bg-black/40 transition-all" style={{animation:`wall-shame-entry 0.4s ease-out ${i*0.1}s backwards`}}>
                                    <div className="text-3xl">{i===0?'💩':i===1?'🤡':'😵'}</div>
                                    <div className="flex-1">
                                        <div className="text-white font-black">{playerAvatars[s.name]||'👤'} {s.name}</div>
                                        <div className="flex flex-wrap gap-3 mt-1 text-[10px]">
                                            <span className="text-red-400 font-bold">🚫 {s.zeros} zéros</span>
                                            <span className="text-orange-400 font-bold">📉 Pire: {s.worstScore}pts</span>
                                            <span className="text-pink-400 font-bold">🏳️ {s.lastPlace}× dernier</span>
                                            {s.maxConsecutiveZeros>=3&&<span className="text-purple-400 font-bold">💀 {s.maxConsecutiveZeros} zéros d'affilée</span>}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-gray-500">Moy.</div>
                                        <div className="text-lg font-black text-red-400">{s.avgScore}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>;
                })()}
            </div>
        )}

        {/* TAB: RULES & HELP */}
        {currentTab === 'rules' && (
            <div className={"space-y-4 tab-slide-"+tabDirection}>
                <div className={'bg-gradient-to-br '+T.card+' backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl '+T.glow+' p-6'}>
                    <h2 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-wider mb-6"><BookOpen/> Règles Officielles</h2>
                    <div className="space-y-4 text-gray-300 text-sm">
                        <div className="bg-white/5 p-4 rounded-2xl hover:bg-white/10 transition-all duration-300 hover-lift" style={{animation:"card-appear 0.4s ease-out 0.1s backwards"}}><h3 className="font-bold text-white mb-1">🎯 Objectif</h3><p>Marquer le plus de points en réalisant des combinaisons. Le perdant de la partie précédente commence la suivante !</p></div>
                        <div className="bg-white/5 p-4 rounded-2xl hover:bg-white/10 transition-all duration-300 hover-lift" style={{animation:"card-appear 0.4s ease-out 0.2s backwards"}}><h3 className="font-bold text-white mb-1">🎁 Bonus 35 points</h3><p>Si la somme de la partie supérieure (As à Six) fait <strong>63 points ou plus</strong>.</p></div>
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
          <div className={'space-y-4 tab-slide-'+tabDirection+(shakeScreen?' shake-active':'')}>
            {speedMode && timeLeft > 0 && <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden"><div className={`h-full transition-all duration-1000 ${timeLeft<10?'bg-red-500':'bg-green-500'}`} style={{width: `${(timeLeft/30)*100}%`}}></div></div>}
            
            <div className={'bg-gradient-to-br '+T.card+' backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl '+T.glow+' p-6'}>
              <div className="flex items-center justify-between mb-6"><h2 className="text-2xl font-black text-white flex items-center gap-3" style={{animation:"fade-in-scale 0.4s ease-out"}}><span className="text-3xl">👥</span>Joueurs</h2><button onClick={addPlayer} disabled={players.length>=6||isGameStarted()} className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-bold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"><Plus size={20}/>Ajouter</button></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">{players.map((player,i)=><PlayerCard key={i} player={player} index={i} onRemove={removePlayer} onNameChange={updatePlayerName} canRemove={players.length>1} gameStarted={isGameStarted()} avatar={playerAvatars[player]} onAvatarClick={openAvatarSelector}/>)}</div>
            </div>

            <div className={'bg-gradient-to-br '+T.card+' backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl '+T.glow+' p-4 sm:p-6'}>
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <h2 className="text-2xl font-black text-white flex items-center gap-3" style={{animation:"fade-in-scale 0.4s ease-out 0.1s backwards"}}><span className="text-3xl">📝</span>Feuille de score</h2>
                <div className="flex gap-2 flex-wrap items-center">
                  {editMode?(<><button onClick={toggleEditMode} className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-xl font-bold transition-all flex items-center gap-2"><Check size={18}/>Valider</button><button onClick={cancelEdit} className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl font-bold transition-all flex items-center gap-2"><X size={18}/>Annuler</button></>):(<button onClick={toggleEditMode} className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl font-bold transition-all flex items-center gap-2"><Edit3 size={18}/>Éditer</button>)}

                  <button onClick={()=>resetGame(null)} className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl font-bold transition-all flex items-center gap-2"><RotateCcw size={18}/>Reset</button>
                </div>
              </div>
              {activeChallenge&&isGameStarted()&&!isGameComplete()&&(
                <div className="mb-3 p-3 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-400/30 rounded-2xl backdrop-blur-sm" style={{animation:'card-appear 0.5s ease-out'}}>
                  <div className="flex items-center gap-3"><span className="text-xl">{activeChallenge.icon}</span><div><span className="text-amber-300 font-bold text-xs uppercase tracking-wider">Défi en cours</span><span className="text-white font-semibold text-sm ml-2">{activeChallenge.desc}</span></div></div>
                </div>
              )}
              {!editMode&&players.length>0&&<div className="mb-4 p-4 bg-blue-500/10 border border-blue-400/30 rounded-2xl backdrop-blur-sm"><div className="flex items-center gap-3"><span className="text-2xl">🔒</span><span className="text-blue-300 font-semibold text-sm">Les valeurs saisies sont verrouillées. Cliquez sur "Éditer" pour les modifier.</span></div></div>}
              {players.length===0&&<div className="text-center py-16"><div className="text-8xl mb-4" style={{animation:'empty-bounce 3s ease-in-out infinite'}}>🎲</div><h3 className="text-2xl font-black text-white/70 mb-2">Prêt à jouer ?</h3><p className="text-gray-500 text-sm max-w-xs mx-auto mb-6">Ajoutez des joueurs ci-dessous pour commencer une partie de Yams !</p><div className="text-4xl" style={{animation:'empty-pulse 2s ease-in-out infinite'}}>👇</div></div>}
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

              {/* DUEL BAR - 1v1 mode */}
              {players.length===2&&isGameStarted()&&!editMode&&(()=>{
                const t1=calcTotal(players[0]),t2=calcTotal(players[1]);
                const total=t1+t2||1;
                const pct1=Math.max(8,Math.min(92,Math.round((t1/total)*100)));
                const pc1=getPlayerColor(players[0],0),pc2=getPlayerColor(players[1],1);
                const gap=Math.abs(t1-t2);
                const leader=t1>t2?0:t2>t1?1:-1;
                const isClose=gap<=10&&gap>0;
                return <div className="mb-4 px-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className={"text-2xl "+(leader===0?"scale-110":"")} style={{transition:'transform 0.5s'}}>{playerAvatars[players[0]]||'👤'}</span>
                      <div className="text-left">
                        <div className={"font-black text-sm "+(leader===0?"text-white":"text-gray-500")}>{players[0]}</div>
                        <div className={"font-black transition-all duration-500 "+(leader===0?"text-3xl":"text-2xl text-gray-400")} style={{color:leader===0?pc1.hex:'',fontFamily:'JetBrains Mono',textShadow:leader===0?`0 0 20px ${pc1.hex}60`:''}}>{t1}</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className={"text-xs font-black px-4 py-1.5 rounded-full border transition-all duration-500 "+(leader===-1?"bg-white/10 text-gray-400 border-white/10":isClose?"bg-red-500/20 text-red-400 border-red-500/30 animate-pulse":"bg-yellow-500/20 text-yellow-400 border-yellow-500/30")}>{t1===t2?'⚔️ ÉGALITÉ':gap>0?`${gap} PTS`:''}</div>
                      {gap>0&&<div className="text-[9px] text-gray-500 mt-0.5 font-bold">{leader===0?'◀ mène':'mène ▶'}</div>}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className={"font-black text-sm "+(leader===1?"text-white":"text-gray-500")}>{players[1]}</div>
                        <div className={"font-black transition-all duration-500 "+(leader===1?"text-3xl":"text-2xl text-gray-400")} style={{color:leader===1?pc2.hex:'',fontFamily:'JetBrains Mono',textShadow:leader===1?`0 0 20px ${pc2.hex}60`:''}}>{t2}</div>
                      </div>
                      <span className={"text-2xl "+(leader===1?"scale-110":"")} style={{transition:'transform 0.5s'}}>{playerAvatars[players[1]]||'👤'}</span>
                    </div>
                  </div>
                  <div className={"h-4 rounded-full overflow-hidden flex border "+(isClose?"border-red-500/40":"border-white/10")} style={{background:'rgba(255,255,255,0.05)'}}>
                    <div className="h-full rounded-l-full transition-all duration-700 ease-out relative overflow-hidden" style={{width:pct1+'%',background:`linear-gradient(90deg,${pc1.hex},${pc1.hex}bb)`}}>
                      <div className="absolute inset-0" style={{background:'linear-gradient(90deg,rgba(255,255,255,0.2),transparent)',animation:'duel-shimmer 2s ease-in-out infinite'}}></div>
                    </div>
                    <div className="w-1 bg-white/40 shrink-0" style={{boxShadow:'0 0 8px rgba(255,255,255,0.3)'}}></div>
                    <div className="h-full rounded-r-full transition-all duration-700 ease-out relative overflow-hidden flex-1" style={{background:`linear-gradient(90deg,${pc2.hex}bb,${pc2.hex})`}}>
                      <div className="absolute inset-0" style={{background:'linear-gradient(270deg,rgba(255,255,255,0.2),transparent)',animation:'duel-shimmer 2s ease-in-out infinite'}}></div>
                    </div>
                  </div>
                </div>;
              })()}
              <div className={`overflow-x-auto relative group ${GRID_SKINS[gridSkin]?.accent||''} ${gridSkin!=='default'?'grid-'+gridSkin:''}`} style={{filter:`sepia(${gridAge*0.15}) contrast(${1+gridAge*0.08})`,transition:'filter 2s ease'}}>{players.length>=3&&<div className="absolute top-1/2 -translate-y-1/2 right-2 z-20 pointer-events-none text-white/40 sm:hidden" style={{animation:'scroll-hint 2s ease-in-out infinite'}}>👉</div>}<table className={`w-full table-fixed ${GRID_SKINS[gridSkin]?.border||''}`} role="grid" aria-label="Grille de scores YAMS"><colgroup><col className="w-48"/>{players.map((_,i)=><col key={i} className="w-32"/>)}</colgroup><thead><tr className={`border-b ${gridSkin==='neon'?'border-green-500/30':gridSkin==='vintage'?'border-amber-700/30':gridSkin==='chalk'?'border-green-800/30':gridSkin==='pixel'?'border-purple-500/30':'border-white/20'}`}>
                <th className={`text-left p-3 font-bold sticky left-0 z-10 ${GRID_SKINS[gridSkin]?.text||'text-white'} bg-gradient-to-r ${GRID_SKINS[gridSkin]?.headerBg||'from-slate-900 to-slate-800'}`}>Catégorie</th>
                {players.map((p,i)=>{const pc=getPlayerColor(p,i);const hasFlame=streaks[p]>=3;const isNext=getNextPlayer()===p&&!editMode;const isLeaderCol=leader===p;return <th key={i} className={`p-0 transition-all duration-500 ${isNext?'ring-2 ring-inset shadow-2xl next-col-pulse':''} ${hasFlame?'flame-column':''}`} style={{...(headerAnim[p]?{animation:headerAnim[p]}:{}),...(playerColors[p]?{borderTop:`3px solid ${pc.hex}`}:{}),  ...(isNext?{background:`linear-gradient(180deg,${pc.hex}35,${pc.hex}15,${pc.hex}08)`,boxShadow:`inset 0 0 40px ${pc.hex}20, 0 0 30px ${pc.hex}25`,ringColor:pc.hex}:isLeaderCol&&!editMode?{boxShadow:'inset 0 0 20px rgba(250,204,21,0.06)',background:'rgba(250,204,21,0.03)'}:{})}}>
                    <div className="p-3 text-white font-bold text-lg flex flex-col items-center justify-center gap-1 relative">
                        {/* NEXT PLAYER INDICATOR */}
                        {isNext && <div className="absolute top-1 right-1 px-2 py-0.5 rounded-lg text-[8px] font-black tracking-wider uppercase z-10" style={{background:pc.hex,color:'#000',boxShadow:`0 0 12px ${pc.hex}80`,animation:'next-turn-badge 1.5s ease-in-out infinite'}}>▶ JOUE</div>}
                        {/* REAL-TIME RANKING BADGE - LEFT OF AVATAR */}
                        <div className="flex items-center justify-center gap-2">
                             {isGameStarted() && !isGameComplete() && (
                                <div className="z-20">
                                    {getRank(p) === 1 ? (
                                        <Crown size={32} className="text-yellow-400 drop-shadow-lg animate-bounce" fill="currentColor" />
                                    ) : (
                                        getRank(p) === 2 ? <span className="text-3xl drop-shadow-md filter grayscale-[0.2]">🥈</span> :
                                        getRank(p) === 3 ? <span className="text-3xl drop-shadow-md filter sepia-[0.4]">🥉</span> : null
                                    )}
                                </div>
                            )}
                            <div className={'text-3xl cursor-pointer hover:scale-110 transition-transform relative '+(avatarAnim[p]||'')+(lastPlayerToPlay===p&&!avatarAnim[p]?' avatar-dance':getNextPlayer()===p&&!avatarAnim[p]?' avatar-bounce-idle':'')+(hasFlame?' flame-effect':'')} onClick={()=>openAvatarSelector(i)} onContextMenu={(e)=>{e.preventDefault();setQuickStatsPlayer(p);}}>{playerAvatars[p] || "👤"}{avatarReaction[p]&&<span className="absolute -top-2 -right-2 text-lg" style={{animation:'bounce-in 0.3s cubic-bezier(0.34,1.56,0.64,1)'}}>{avatarReaction[p]}</span>}</div>
                        </div>
                        {isGameStarted()&&!hideTotals&&<div className="text-[10px] font-mono font-bold" style={{color:pc.hex,opacity:0.7}}>{isFoggy(p)?'???':calcTotal(p)+' pts'}</div>}
                        {streaks[p]>=3&&<div className="flex items-center gap-0.5 streak-fire"><span className="text-xs">🔥</span><span className="text-orange-400 text-xs font-black">x{streaks[p]}</span></div>}
                        {playerCombos[p]>=2&&<div className="flex items-center gap-0.5" style={{animation:'combo-pulse 0.6s ease-in-out infinite'}}><span className="text-xs">💥</span><span className={"text-xs font-black "+(playerCombos[p]>=5?"text-red-400":playerCombos[p]>=3?"text-orange-400":"text-yellow-400")}>x{playerCombos[p]}</span></div>}
                        <div className="text-sm mt-1" style={playerColors[p]?{color:pc.light}:{}}>{p}{idleAvatars&&isNext?' 😤':idleAvatars&&!isNext?' 💤':''}</div>
                        {/* DYNAMIC IN-GAME TITLE */}
                        {isGameStarted()&&!isGameComplete()&&players.length>=2&&(()=>{
                            const dt=getDynamicTitle(p,players,scores,calcTotal,lastPlayerToPlay,moveLog);
                            return dt?<div className="text-[9px] font-bold mt-0.5" style={{color:dt.color}}>{dt.icon} {dt.text}</div>:null;
                        })()}
                        {!lastPlayerToPlay && p === starterName && <span className="text-xs bg-yellow-500 text-black px-2 py-0.5 rounded-full animate-bounce">1️⃣</span>}
                        {playerEntrance && <div className="absolute inset-0 rounded-full" style={{animation:`player-entrance 0.6s cubic-bezier(0.34,1.56,0.64,1) ${i*0.15}s backwards`,background:`radial-gradient(circle,${pc.hex}20,transparent)`}}/>}
                        {/* AI PREDICTION */}
                        {isGameStarted()&&!isGameComplete()&&!hideTotals&&!fogMode&&gameHistory.length>=1&&(()=>{
                            const pred=predictFinalScore(p);
                            return pred?<div className="mt-1 px-2 py-0.5 rounded-lg flex items-center justify-center gap-1" style={{background:pc.hex+'15',border:`1px solid ${pc.hex}30`}}><Target size={11} style={{color:pc.hex}}/><span className="text-sm font-black" style={{color:pc.hex}}>~{pred} pts</span></div>:null;
                        })()}
                        
                    </div>
                </th>})}</tr></thead><tbody>
                {categories.map(cat=>{
                  if(cat.upperHeader)return <tr key={cat.id}><td colSpan={players.length+1} className="p-0"><div className="relative py-4"><div className="absolute inset-0 flex items-center"><div className="w-full border-t-2" style={{background:'linear-gradient(90deg,transparent,'+T.primary+'50,transparent)',height:'2px'}}/></div><div className="relative flex justify-center"><span className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-2 text-white font-black text-sm uppercase tracking-wider rounded-full border border-white/20">⬆️ Partie Supérieure ⬆️</span></div></div></td></tr>;
                  if(cat.upperDivider)return <tr key={cat.id}><td colSpan={players.length+1} className="p-0"><div className="relative py-2"><div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div></div></td></tr>;
                  if(cat.divider)return <tr key={cat.id}><td colSpan={players.length+1} className="p-0"><div className="relative py-4"><div className="absolute inset-0 flex items-center"><div className="w-full border-t-2" style={{background:'linear-gradient(90deg,transparent,'+T.primary+'50,transparent)',height:'2px'}}/></div><div className="relative flex justify-center"><span className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-2 text-white font-black text-sm uppercase tracking-wider rounded-full border border-white/20">⬇️ Partie Inférieure ⬇️</span></div></div></td></tr>;
                  return <tr key={cat.id} className={'border-b border-white/10 transition-colors duration-150 '+(cat.upperTotal||cat.bonus?'bg-white/5':'')+(cat.upper?' bg-blue-500/5':cat.lower?' bg-purple-500/5':'')+' '+(GRID_SKINS[gridSkin]?.rowBg||'')} style={{animation:`row-cascade 0.3s ease-out ${(categories.indexOf(cat)||0)*0.04}s backwards`}}><td className={`p-3 sticky left-0 z-10 bg-gradient-to-r ${GRID_SKINS[gridSkin]?.headerBg||'from-slate-900 to-slate-800'}`}><div className="flex items-center gap-3"><span className="text-2xl" style={{color:cat.color||'#fff'}}>{cat.icon}</span><div><span className={`font-bold block ${GRID_SKINS[gridSkin]?.text||'text-white'}`}>{cat.name}</span>{cat.desc&&<span className="text-xs text-gray-400 block mt-0.5">{cat.desc}</span>}</div></div></td>{players.map((p,pi)=>{const isNextCol=getNextPlayer()===p&&!editMode;const pc2=getPlayerColor(p,pi);const igs=inGameStreak[p]||0;return <td key={pi} className={`p-2 transition-all relative ${lastCellKey===(p+'-'+cat.id)?'last-cell-pulse':''} ${GRID_SKINS[gridSkin]?.cellBg||''} ${igs>=5?'streak-col-intense':igs>=3?'streak-col-glow':''}`} style={{...(isNextCol?{background:`${pc2.hex}18`,boxShadow:`inset 3px 0 0 ${pc2.hex}90, inset -3px 0 0 ${pc2.hex}90, inset 0 0 20px ${pc2.hex}10`}:{}),['--hover-glow']:T.primary}} onMouseEnter={e=>{if(!cat.upperTotal&&!cat.bonus&&!cat.upperGrandTotal&&!cat.lowerTotal)e.currentTarget.style.boxShadow=(isNextCol?`inset 2px 0 0 ${pc2.hex}80, inset -2px 0 0 ${pc2.hex}80, `:'')+'inset 0 0 12px '+T.primary+'20';}} onMouseLeave={e=>{e.currentTarget.style.boxShadow=isNextCol?`inset 2px 0 0 ${pc2.hex}80, inset -2px 0 0 ${pc2.hex}80`:'none';}}>
                  {cat.upperTotal?<div className="text-center py-3 px-2 rounded-xl font-black text-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400">{isFoggy(p)?"???":calcUpper(p)}</div>
                  :cat.bonus?(()=>{
                    const upperCats2=categories.filter(c=>c.upper);
                    const filledUp=upperCats2.filter(c=>scores[p]?.[c.id]!==undefined);
                    const emptyUp=upperCats2.filter(c=>scores[p]?.[c.id]===undefined);
                    const upSum=calcUpper(p);
                    const allFilled=emptyUp.length===0;
                    const maxRemaining=emptyUp.reduce((s,c)=>s+(c.max||0),0);
                    const bonusImpossible=allFilled?upSum<63:(upSum+maxRemaining<63);
                    return <div className="space-y-1"><div className={"text-center py-3 px-2 rounded-xl font-black text-xl bg-gradient-to-r "+(isFoggy(p)?"from-gray-500/20 to-gray-500/20 text-gray-500":getBonus(p)>0?"from-yellow-500/20 to-orange-500/20 text-yellow-400":"from-yellow-500/20 to-orange-500/20 text-yellow-400")}>{isFoggy(p)?"???":getBonus(p)}</div>{isFoggy(p)?null:(getBonus(p)>0?<div className="text-center text-xs font-semibold text-green-400">✅ Bonus acquis!</div>:bonusImpossible?<div className="text-center text-xs font-semibold text-red-400">❌ Bonus impossible</div>:<div className="flex items-center justify-center gap-2 text-xs font-bold"><span className="text-orange-400">Reste: {63-upSum}</span><span className="text-gray-600">|</span>{(()=>{const prog=getBonusProgress(p);return prog.message?<span className={prog.color}>{prog.message}</span>:null;})()}</div>)}</div>;})()
                  :cat.upperGrandTotal?<div className="text-center py-3 px-2 rounded-xl font-black text-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-400 border border-indigo-400/30">{isFoggy(p)?"???":calcUpperGrand(p)}</div>
                  :cat.lowerTotal?<div className="text-center py-3 px-2 rounded-xl font-black text-xl bg-gradient-to-r from-pink-500/20 to-rose-500/20 text-pink-400 border border-pink-400/30">{isFoggy(p)?"???":calcLower(p)}</div>
                  :<>{showGhostScores&&scores[p]?.[cat.id]===undefined&&(()=>{const g=getGhostScore(p,cat.id,gameHistory);return g!==undefined&&g!==null?<div className="absolute top-0.5 right-1 text-[8px] text-gray-600 font-mono opacity-40">👻{g}</div>:null;})()}<ScoreInput value={scores[p]?.[cat.id]} onChange={(v, e)=>updateScore(p,cat.id,v, e)} category={cat.id} isHighlighted={lastModifiedCell===(p+'-'+cat.id)} isLocked={!editMode&&scores[p]?.[cat.id]!==undefined} isImposedDisabled={imposedOrder && !editMode && scores[p]?.[cat.id] === undefined && playableCats.findIndex(c => scores[p]?.[c.id] === undefined) !== playableCats.findIndex(c => c.id === cat.id)} isFoggy={isFoggy(p)} isJustFilled={lastModifiedCell===(p+'-'+cat.id)} heatColor={scores[p]?.[cat.id]!==undefined&&!editMode?(()=>{const v2=parseInt(scores[p][cat.id])||0;const mx=cat.max||30;if(v2===0)return 'rgba(239,68,68,0.08)';const ratio=v2/mx;if(ratio>=0.75)return 'rgba(16,185,129,0.08)';if(ratio>=0.5)return 'rgba(245,158,11,0.06)';return 'rgba(255,255,255,0.03)';})():null}/></>}
                  </td>})}</tr>;
                })}
                <tr><td colSpan={players.length+1} className="p-0 h-[2px]" style={{background:`linear-gradient(90deg,transparent,${T.primary}80,${T.secondary}80,transparent)`}}></td></tr><tr className="bg-gradient-to-r from-white/10 to-white/5"><td className={`p-4 sticky left-0 z-10 bg-gradient-to-r ${GRID_SKINS[gridSkin]?.headerBg||'from-slate-800 to-slate-700'}`}><div className="flex items-center gap-3"><span className="text-3xl">🏆</span><span className={`font-black text-xl ${GRID_SKINS[gridSkin]?.text||'text-white'}`}>TOTAL</span></div></td>{players.map((p,i)=><td key={i} className="p-4 text-center">{hideTotals&&!isGameComplete()?<div className="text-2xl font-black py-4 px-2 rounded-2xl text-gray-500">???</div>:<div className="text-4xl font-black py-4 px-2 rounded-2xl" style={{textShadow:getWinner().includes(p)?'0 0 20px '+T.primary:'none',animation:getWinner().includes(p)?'leader-pulse 2.5s ease-in-out infinite':'total-breathe 3s ease-in-out infinite'}}>{isFoggy(p)?"???":(<FlipCounter value={calcTotal(p)} color={getWinner().includes(p)?T.primary:'#fff'}/>)}</div>}</td>)}</tr>
              </tbody></table></div>
            </div>
          </div>
        )}

        {/* TAB: HISTORY */}
        {currentTab==='history'&&(
          <div>
          {filteredGameHistory.length>=2&&<div className="mb-6">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">⚡ Récap Express</h3>
            <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory" style={{scrollbarWidth:'none'}}>
              {filteredGameHistory.slice(0,5).map((g,gi)=>{
                const pls=(g.players||g.results||[]).sort((a,b)=>b.score-a.score);
                const title=getAutoTitle(g);
                return <div key={g.id||gi} className="snap-start shrink-0 w-[220px] bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl p-4 hover:border-white/20 transition-all" style={{animation:`fade-in-scale 0.3s ease-out ${gi*0.08}s backwards`}}>
                  <div className="text-xs text-gray-500 mb-1">{g.date}</div>
                  <div className="font-black text-white text-sm mb-2 truncate">{title}</div>
                  <div className="space-y-1">{pls.slice(0,3).map((p,i)=>(
                    <div key={p.name} className="flex items-center gap-2 text-xs">
                      <span>{['🥇','🥈','🥉'][i]}</span>
                      <span className="text-white font-bold truncate flex-1">{playerAvatars[p.name]||''} {p.name}</span>
                      <span className="text-gray-400 font-mono">{p.score}</span>
                    </div>
                  ))}</div>
                </div>;
              })}
            </div>
          </div>}
          <div className={"space-y-4 tab-slide-"+tabDirection} ><div className={'bg-gradient-to-br '+T.card+' backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl '+T.glow+' p-6'}>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4"><h2 className="text-3xl font-black text-white flex items-center gap-3"><span className="text-4xl">📜</span>Historique</h2><div className="flex gap-2 items-center"><select value={historyFilterSeason} onChange={e=>setHistoryFilterSeason(e.target.value)} className="bg-black/40 text-white px-3 py-2 rounded-xl text-sm font-bold border border-white/10 outline-none hover:bg-black/60 transition-colors"><option value="Toutes">🌍 Toutes Saisons</option><option value="Aucune">Hors Saison</option>{seasons.map(s=><option key={s} value={s}>{s}</option>)}</select><button onClick={exportData} className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-bold transition-all hover:scale-105 flex items-center gap-2"><Download size={18}/>Exporter</button><label className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-bold transition-all hover:scale-105 flex items-center gap-2 cursor-pointer"><Plus size={18}/>Importer<input type="file" accept=".json" onChange={importData} className="hidden"/></label></div></div>
            {filteredGameHistory.length>0&&<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"><div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-400/30 rounded-2xl p-5 text-center relative overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"><div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div><div className="text-4xl mb-2 relative">🎮</div><div className="text-blue-300 text-xs font-bold uppercase relative">Total Parties</div><div className="text-4xl font-black text-white relative" style={{animation:'count-up 0.6s ease-out 0.2s backwards'}}>{filteredGameHistory.length}</div></div><div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-2xl p-5 text-center relative overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300"><div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div><div className="text-4xl mb-2 relative">📅</div><div className="text-purple-300 text-xs font-bold uppercase">Première Partie</div><div className="text-lg font-black text-white">{filteredGameHistory[filteredGameHistory.length-1]?.date}</div></div><div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-2xl p-5 text-center relative overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300"><div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div><div className="text-4xl mb-2 relative">⏱️</div><div className="text-green-300 text-xs font-bold uppercase">Dernière Partie</div><div className="text-lg font-black text-white">{filteredGameHistory[0]?.date}</div></div></div>}
            {filteredGameHistory.length===0?<div className="text-center py-20"><div className="text-8xl mb-4" style={{animation:'empty-bounce 3s ease-in-out infinite'}}>📋</div><p className="text-white/60 text-xl font-bold mb-2">Aucune partie enregistrée</p><p className="text-gray-500 text-sm max-w-xs mx-auto">Jouez votre première partie dans l'onglet 🎮 Partie puis sauvegardez-la pour la voir ici !</p><button onClick={()=>switchTab('game')} className="mt-4 px-6 py-2 rounded-xl font-bold text-sm btn-ripple" style={{background:`linear-gradient(135deg,${T.primary},${T.secondary})`,color:'#fff'}}>🎮 Aller jouer</button></div>:<div className="space-y-3">{filteredGameHistory.map(g=><div key={g.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm hover-lift" style={{transition:'box-shadow 0.3s'}}>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <span className="text-gray-300 font-semibold">📅 {g.date} à {g.time}</span>
                        {/* MULTI SEASON EDIT BUTTON */}
                        {editingHistoryId === g.id ? (
                            <div className="flex gap-2 animate-in slide-in-from-left-2 items-center bg-black/40 p-2 rounded-xl">
                                <span className="text-xs text-gray-400 mr-1">Saison(s):</span>
                                <div className="flex flex-wrap gap-1">
                                    {seasons.map(s => {
                                        const gSeasons = Array.isArray(g.seasons) ? g.seasons : (g.season ? [g.season] : []);
                                        const isSelected = gSeasons.includes(s);
                                        return (
                                            <button 
                                                key={s}
                                                onClick={() => updateGameSeason(g.id, s)}
                                                className={`text-[10px] px-2 py-0.5 rounded-lg border ${isSelected ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-white/5 border-white/10 text-gray-500'}`}
                                            >
                                                {s}
                                            </button>
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
                                <button onClick={() => setEditingHistoryId(g.id)} className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors" title="Modifier les saisons"><Edit3 size={12}/></button>
                            </div>
                        )}
                        {g.grid && <button onClick={() => setReplayGame(g)} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-blue-500/30"><Eye size={14}/> Voir la grille</button>}
                    </div>
                    <button onClick={()=>deleteGame(g.id)} className="p-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-all hover:scale-110"><Trash2 size={18}/></button>
                </div>
                {g.note && <div className="mb-3 px-3 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-sm text-yellow-200 italic flex items-center gap-2">📝 {g.note}</div>}
                <div className="space-y-2">{(g.players||g.results).sort((a,b)=>b.score-a.score).map((pl,i)=>{const isSuddenDeathGame=g.suddenDeath;const isSuddenDeathWinner=pl.suddenDeathWin;return <div key={i} className="flex items-center justify-between bg-black/30 rounded-xl p-4 backdrop-blur-sm"><span className="text-white font-bold flex items-center gap-3">{pl.isWinner&&<span className="text-2xl animate-pulse">👑</span>}{!pl.isWinner&&i===0&&<span className="text-xl">🥇</span>}{!pl.isWinner&&i===1&&<span className="text-xl">🥈</span>}{!pl.isWinner&&i===2&&<span className="text-xl">🥉</span>}<span className="text-lg">{pl.name}</span>{isSuddenDeathWinner&&<span className="text-red-400 text-xs bg-red-500/20 px-2 py-0.5 rounded ml-1 font-black">⚔️ Mort Subite</span>}{pl.yamsCount>0&&<span className="text-yellow-400 text-sm bg-yellow-500/20 px-2 py-0.5 rounded ml-2">🎲 YAMS!</span>}{pl.score>=300&&<span className="text-purple-400 text-sm bg-purple-500/20 px-2 py-0.5 rounded ml-1">⭐ 300+</span>}</span><span className="flex items-baseline gap-1.5"><span className="font-black text-2xl" style={{color:pl.isWinner?T.primary:'#9ca3af'}}>{pl.score}</span>{pl.suddenDeathScore&&<span className="text-sm font-bold text-red-400">({pl.suddenDeathScore})</span>}</span></div>})}</div></div>)}</div>}
          </div></div>
          </div>
        )}

        {/* TAB: STATS & TROPHIES - CORRECTIF ÉCRAN BLEU */}
        {currentTab==='records'&&(()=>{
            const allGames = filteredHistory;
            if(!allGames.length) return <div className="text-center py-20"><div className="text-7xl mb-4" style={{animation:'empty-bounce 3s ease-in-out infinite'}}>🏅</div><div className="text-xl font-bold text-white/60 mb-2">Pas encore de records</div><div className="text-sm text-gray-500 max-w-xs mx-auto">Jouez des parties et vos meilleurs scores apparaîtront ici automatiquement !</div></div>;
            
            const records = [];
            // Best total score
            let bestScore={val:0,who:[],date:''};
            allGames.forEach(g=>{(g.players||g.results||[]).forEach(p=>{if(p.score>bestScore.val)bestScore={val:p.score,who:[p.name],date:g.date};else if(p.score===bestScore.val&&bestScore.val>0&&!bestScore.who.includes(p.name))bestScore.who.push(p.name);});});
            records.push({icon:'👑',title:'Meilleur Score',value:bestScore.val+' pts',holder:bestScore.who.join(' & '),date:bestScore.date,color:'from-yellow-500/20 to-amber-500/20',border:'border-yellow-500/30'});
            
            // Best per category
            playableCats.forEach(cat=>{
              let best={val:0,who:[],date:''};
              allGames.forEach(g=>{if(g.grid){Object.entries(g.grid).forEach(([name,grid])=>{const v=parseInt(grid[cat.id])||0;if(v>best.val)best={val:v,who:[name],date:g.date};else if(v===best.val&&best.val>0&&!best.who.includes(name))best.who.push(name);});}});
              if(best.val>0)records.push({icon:cat.icon,title:'Record '+cat.name,value:best.val+'/'+cat.max,holder:best.who.join(' & '),date:best.date,color:'from-blue-500/10 to-indigo-500/10',border:'border-blue-500/20',small:true});
            });
            
            // Longest win streak
            const streakMap={};
            allGames.slice().reverse().forEach(g=>{(g.players||g.results||[]).forEach(p=>{if(!streakMap[p.name])streakMap[p.name]={cur:0,max:0};if(p.isWinner){streakMap[p.name].cur++;if(streakMap[p.name].cur>streakMap[p.name].max)streakMap[p.name].max=streakMap[p.name].cur;}else streakMap[p.name].cur=0;});});
            const bestStreak=Object.entries(streakMap).reduce((a,[n,s])=>s.max>a.val?{val:s.max,who:n}:a,{val:0,who:''});
            if(bestStreak.val>0)records.push({icon:'🔥',title:'Plus longue série',value:bestStreak.val+' victoires',holder:bestStreak.who,date:'',color:'from-orange-500/20 to-red-500/20',border:'border-orange-500/30'});
            
            // Closest game (smallest gap between 1st and 2nd)
            let closest={val:999,who:'',date:''};
            allGames.forEach(g=>{const pls=(g.players||g.results||[]).map(p=>p.score).sort((a,b)=>b-a);if(pls.length>=2){const gap=pls[0]-pls[1];if(gap<closest.val&&gap>0)closest={val:gap,who:(g.players||g.results).find(p=>p.isWinner)?.name||'',date:g.date};}});
            if(closest.val<999)records.push({icon:'📏',title:'Partie la plus serrée',value:closest.val+' pts d\'écart',holder:closest.who,date:closest.date,color:'from-purple-500/20 to-pink-500/20',border:'border-purple-500/30'});
            
            // Most zeros in a game
            let mostZeros={val:0,who:[],date:''};
            allGames.forEach(g=>{if(g.grid){Object.entries(g.grid).forEach(([name,grid])=>{const z=Object.values(grid).filter(v=>parseInt(v)===0).length;if(z>mostZeros.val)mostZeros={val:z,who:[name],date:g.date};else if(z===mostZeros.val&&mostZeros.val>0&&!mostZeros.who.includes(name))mostZeros.who.push(name);});}});
            if(mostZeros.val>0)records.push({icon:'💀',title:'Record de zéros',value:mostZeros.val+' zéros',holder:mostZeros.who.join(' & '),date:mostZeros.date,color:'from-red-500/20 to-rose-500/20',border:'border-red-500/30'});
            
            // Biggest comeback (was last at halftime, won)
            let bigComeback={val:0,who:'',date:''};
            allGames.forEach(g=>{if(g.grid&&g.moveLog){const pNames=Object.keys(g.grid);const halfMoves=Math.floor(g.moveLog.length/2);const halfScores={};pNames.forEach(n=>{halfScores[n]=0;g.moveLog.slice(0,halfMoves).filter(m=>m.player===n).forEach(m=>{halfScores[n]+=(parseInt(m.value)||0);});});const finalScores={};pNames.forEach(n=>{finalScores[n]=Object.values(g.grid[n]||{}).reduce((s,v)=>s+(parseInt(v)||0),0);});const halfRanked=pNames.sort((a,b)=>halfScores[b]-halfScores[a]);const winner=(g.players||g.results||[]).find(p=>p.isWinner)?.name;if(winner&&halfRanked.indexOf(winner)===pNames.length-1){const diff=finalScores[winner]-(halfScores[winner]||0);if(diff>bigComeback.val)bigComeback={val:diff,who:winner,date:g.date};}}});
            if(bigComeback.val>0)records.push({icon:'⚡',title:'Plus gros comeback',value:'+'+bigComeback.val+' pts en 2e mi-temps',holder:bigComeback.who,date:bigComeback.date,color:'from-emerald-500/20 to-green-500/20',border:'border-emerald-500/30'});
            
            const mainRecords=records.filter(r=>!r.small);
            const catRecords=records.filter(r=>r.small);
            
            return <div className="space-y-6">
              <div className="text-center mb-2"><div className="text-5xl mb-2" style={{animation:'trophy-float 3s ease-in-out infinite'}}>🏅</div><h2 className="text-2xl font-black text-white uppercase tracking-wider">Hall of Records</h2><p className="text-gray-400 text-sm mt-1">{allGames.length} parties analysées</p></div>
              
              <div className="space-y-3">{mainRecords.map((r,i)=>(
                <div key={i} className={"bg-gradient-to-r "+r.color+" border "+r.border+" rounded-2xl p-4 flex items-center gap-4"} style={{animation:`fade-in-scale 0.4s ease-out ${i*0.1}s backwards`}}>
                  <div className="text-4xl">{r.icon}</div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">{r.title}</div>
                    <div className="text-2xl font-black text-white">{r.value}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold text-sm">{playerAvatars[r.holder]||'👤'} {r.holder}</div>
                    {r.date&&<div className="text-[10px] text-gray-500">{r.date}</div>}
                  </div>
                </div>
              ))}</div>
              
              {catRecords.length>0&&<div>
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-wider mb-3">Records par catégorie</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">{catRecords.map((r,i)=>(
                  <div key={i} className={"bg-gradient-to-br "+r.color+" border "+r.border+" rounded-xl p-3 text-center"} style={{animation:`fade-in-scale 0.3s ease-out ${i*0.05}s backwards`}}>
                    <div className="text-xl mb-1">{r.icon}</div>
                    <div className="text-white font-black text-lg">{r.value}</div>
                    <div className="text-[10px] text-gray-400 font-bold">{playerAvatars[r.holder]||''} {r.holder}</div>
                  </div>
                ))}</div>
              </div>}
            </div>;
        })()}

        {currentTab==='stats'&&(
            <div className={"space-y-6 tab-slide-"+tabDirection} >
                
                {/* 0. FILTRE SAISONS */}
                <div className="bg-white/5 p-4 rounded-3xl border border-white/10">
                    <div className="flex justify-between items-center flex-wrap gap-3 mb-3">
                        <h2 className="text-3xl font-black text-white flex items-center gap-3"><Activity className="text-blue-400"/> Statistiques</h2>
                    </div>
                    {/* SEASON FILTER - SELECT DROPDOWN */}
                    <div className="flex items-center gap-3">
                        <Calendar size={16} className="text-blue-400 shrink-0"/>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider shrink-0">Saison :</span>
                        <select 
                            value={statsFilterSeason} 
                            onChange={e => { console.log('Season changed to:', e.target.value); setStatsFilterSeason(e.target.value); }}
                            className="flex-1 bg-black/40 text-white px-4 py-2.5 rounded-xl text-sm font-bold border border-white/20 outline-none cursor-pointer appearance-none hover:border-white/40 focus:border-blue-400 transition-all relative z-30"
                            style={{backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23999' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E\")",backgroundRepeat:'no-repeat',backgroundPosition:'right 12px center',paddingRight:'36px'}}
                        >
                            <option value="Toutes" style={{backgroundColor:'#1e293b'}}>🌍 Toutes les Saisons ({gameHistory.length} parties)</option>
                            <option value="Aucune" style={{backgroundColor:'#1e293b'}}>📦 Hors Saison</option>
                            {allSeasons.map(s => <option key={s} value={s} style={{backgroundColor:'#1e293b'}}>📅 {s}</option>)}
                        </select>
                    </div>
                    {statsFilterSeason !== 'Toutes' && <div className="mt-2 text-xs text-gray-500 bg-black/20 px-3 py-2 rounded-xl">Filtre actif : <span className="font-bold" style={{color:T.primary}}>{statsFilterSeason}</span> — <span className="font-bold text-white">{filteredHistory.length}</span> partie{filteredHistory.length>1?'s':''} sur {gameHistory.length}</div>}
                    {allSeasons.length === 0 && <div className="mt-2 text-xs text-amber-400/70 bg-amber-500/5 px-3 py-2 rounded-xl border border-amber-500/10 flex items-center gap-2">⚠️ Aucune saison trouvée. Crée une saison dans ⚙️ Réglages et joue une partie avec pour la voir ici.</div>}
                    {statsFilterSeason !== 'Toutes' && seasonDescriptions[statsFilterSeason] && (
                        <p className="text-gray-400 text-xs mt-1 italic">💬 {seasonDescriptions[statsFilterSeason]}</p>
                    )}
                </div>

                {(!filteredHistory || filteredHistory.length === 0) ? (
                    <div className={'bg-gradient-to-br '+T.card+' backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 text-center'}>
                        <div className="text-5xl mb-4">📊</div>
                        <div className="text-center"><div className="text-7xl mb-4" style={{animation:'empty-bounce 3s ease-in-out infinite'}}>📊</div><div className="text-xl font-bold text-white/60 mb-2">Pas encore de statistiques</div><div className="text-sm text-gray-500 max-w-xs mx-auto">Sauvegardez des parties pour voir vos stats détaillées ici !</div></div>
                        <div className="text-gray-500 text-sm mt-2">Jouez une partie !</div>
                    </div>
                ) : (<>
                {/* CALENDRIER DE PARTIES */}
                <div className={'bg-gradient-to-br '+T.card+' backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-6'}>
                    <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">📅 Calendrier de Parties</h3>
                    <div className="overflow-x-auto">
                        {(()=>{
                            const today = new Date();
                            const days = 90;
                            const counts = {};
                            (filteredHistory||[]).forEach(g => {
                                const d = g.date;
                                if(d) counts[d] = (counts[d]||0) + 1;
                            });
                            const cells = [];
                            for(let i=days-1;i>=0;i--) {
                                const d = new Date(today); d.setDate(d.getDate()-i);
                                const key = d.toLocaleDateString('fr-FR');
                                const c = counts[key]||0;
                                const bg = c===0?'bg-white/5':c===1?'bg-green-500/30':c===2?'bg-green-500/50':c>=3?'bg-green-500/80':'bg-green-500';
                                cells.push(<div key={i} className={`w-3 h-3 rounded-sm ${bg} transition-all hover:scale-150`} title={`${key}: ${c} partie${c>1?'s':''}`}/>);
                            }
                            const totalGames = Object.values(counts).reduce((s,v)=>s+v,0);
                            return (<div><div className="flex flex-wrap gap-1">{cells}</div><div className="flex justify-between mt-3 text-xs text-gray-500"><span>90 derniers jours</span><span className="font-bold text-white">{totalGames} partie{totalGames>1?'s':''}</span></div></div>);
                        })()}
                    </div>
                </div>

                {/* 1. SCORE MAXI ATTEINT (BANNER) - SAFE MODE */}
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
                              <div className="flex items-center gap-4">
                                  <span className="text-6xl" style={{animation:"float 3s ease-in-out infinite"}}>🌟</span>
                                  <div>
                                      <div className="text-yellow-400 text-sm font-bold uppercase tracking-wider">Record Absolu</div>
                                      <div className="text-white text-3xl font-black">{bestScore} <span className="text-sm font-normal text-gray-400">/ {maxPossible}</span></div>
                                      <div className="text-white font-bold text-lg mt-1">{bestPlayers.map(p=>p.name).join(' & ')}</div>
                                  </div>
                              </div>
                              <div className="text-right">
                                  <div className="text-yellow-400 text-sm font-bold uppercase tracking-wider">Performance</div>
                                  <div className="text-white text-5xl font-black">{pctOfMax}%</div>
                                  <div className="text-gray-300 text-xs">du maximum théorique</div>
                              </div>
                          </div>
                      </div>
                      );
                  })()}
                </div>

                {/* 2. PODIUM 3D */}
                {getPieData().length > 0 && (
                <div id="podium-capture" className={'bg-gradient-to-br '+T.card+' backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl '+T.glow+' p-6'}>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-3xl font-black text-white flex items-center gap-3"><Medal className="text-yellow-400"/>Palmarès</h2>
                      <button onClick={async()=>{try{const el=document.getElementById('podium-capture');if(!el)return;const range=document.createRange();range.selectNode(el);const sel=window.getSelection();sel.removeAllRanges();sel.addRange(range);try{document.execCommand('copy');}catch(e){}sel.removeAllRanges();if(navigator.share){await navigator.share({text:'🏆 Podium YAMS ! '+getPieData().sort((a,b)=>b.value-a.value).map((e,i)=>['🥇','🥈','🥉','4️⃣','5️⃣','6️⃣'][i]+' '+e.name+': '+e.value+'W').join(' | ')});}else{await navigator.clipboard.writeText('🏆 Podium YAMS ! '+getPieData().sort((a,b)=>b.value-a.value).map((e,i)=>['🥇','🥈','🥉','4️⃣','5️⃣','6️⃣'][i]+' '+e.name+': '+e.value+'W').join(' | '));pushNotif({icon:'📋',title:'Copié !',description:'Podium copié dans le presse-papier'});}}catch(e){pushNotif({icon:'❌',title:'Erreur',description:'Partage non disponible'});}}} className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white text-sm font-bold transition-all"><Share2 size={16}/>📤 Partager</button>
                    </div>
                    {/* 3D PODIUM VIEW */}
                    {(()=>{
                      const sorted = getPieData().sort((a,b)=>b.value-a.value);
                      const podiumOrder = sorted.length >= 3 ? [sorted[1],sorted[0],sorted[2]] : sorted.length === 2 ? [sorted[1],sorted[0]] : [sorted[0]];
                      const heights = sorted.length >= 3 ? [100,140,70] : sorted.length === 2 ? [100,140] : [140];
                      const medals = sorted.length >= 3 ? ['🥈','🥇','🥉'] : sorted.length === 2 ? ['🥈','🥇'] : ['🥇'];
                      const COLORS = ['#6366f1','#8b5cf6','#ec4899','#f97316','#10b981','#06b6d4'];
                      return (
                      <div className="flex items-end justify-center gap-2 sm:gap-4 mb-6" style={{perspective:'800px'}}>
                        {podiumOrder.map((entry,pi)=>{
                          if(!entry) return null;
                          const realIdx = sorted.indexOf(entry);
                          const isFirst = realIdx === 0;
                          const color = isFirst ? '#fbbf24' : COLORS[(realIdx)%COLORS.length];
                          const pStat = playerStats.find(s=>s.name===entry.name);
                          const title = getPlayerTitle(pStat);
                          return (
                          <div key={entry.name} className="flex flex-col items-center" style={{animation:`podium-rise 0.6s cubic-bezier(0.34,1.56,0.64,1) ${pi*0.2}s backwards`}}>
                            <div className={'text-4xl sm:text-5xl mb-2 '+(isFirst?'avatar-dance':'')} style={isFirst?{animation:'podium-crown 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.8s backwards'}:{}}>{playerAvatars[entry.name]||'👤'}</div>
                            <div className="text-white font-black text-sm sm:text-base mb-0.5 text-center max-w-[80px] sm:max-w-[100px] truncate">{entry.name}</div>
                            <div className="text-[10px] font-bold mb-1 opacity-70" style={{color}}>{title.icon} {title.title}</div>
                            <div className="text-lg font-black mb-2" style={{color}}>{entry.value}W</div>
                            <div className="w-20 sm:w-28 rounded-t-xl relative overflow-hidden" style={{height:heights[pi]+'px',background:`linear-gradient(180deg, ${color}40, ${color}15)`,borderTop:`3px solid ${color}`,transform:'rotateX(2deg)',transformOrigin:'bottom'}}>
                              <div className="absolute inset-0" style={{background:`linear-gradient(180deg, rgba(255,255,255,0.1), transparent)`}}></div>
                              <div className="absolute top-3 left-1/2 -translate-x-1/2 text-3xl">{medals[pi]}</div>
                              {pStat&&<div className="absolute bottom-2 left-0 right-0 text-center"><div className="text-[9px] text-white/60 font-bold">Moy: {pStat.avgScore}</div><div className="text-[9px] text-white/60 font-bold">Max: {pStat.maxScore}</div></div>}
                            </div>
                          </div>);
                        })}
                      </div>);
                    })()}
                    {/* DETAILED CARDS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {getPieData().sort((a,b)=>b.value-a.value).map((entry,idx)=>{
                            const pStat = playerStats.find(s => s.name === entry.name);
                            if (!pStat) return null;
                            const total = getPieData().reduce((s,item)=>s+item.value,0); 
                            const pct = total > 0 ? ((entry.value/total)*100).toFixed(0) : 0; 
                            const isTop = idx === 0; 
                            const COLORS = ['#6366f1','#8b5cf6','#ec4899','#f97316','#10b981','#06b6d4'];
                            
                            return (
                                <div key={idx} className={'relative overflow-hidden rounded-2xl p-6 transition-all duration-500 cursor-pointer group hover-lift '+(isTop?'bg-gradient-to-br from-yellow-500/30 via-orange-500/20 to-red-500/30 border-2 border-yellow-400/50 shadow-2xl shadow-yellow-500/20':'bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:border-white/30')} style={{animation:`card-appear 0.5s cubic-bezier(0.22,1,0.36,1) ${idx*0.12}s backwards`}}>
                                    <div className="absolute top-0 right-0 w-32 h-32 opacity-10 group-hover:opacity-20 transition-opacity"><div className="w-full h-full rounded-full blur-3xl" style={{backgroundColor:isTop?'#fbbf24':COLORS[idx%COLORS.length]}}></div></div>
                                    {isTop && <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-black ">⭐ TOP 1</div>}
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black shadow-xl" style={{backgroundColor:isTop?'#fbbf24':COLORS[idx%COLORS.length],color:'#000'}}>{idx+1}</div>
                                            {isTop && <div className="text-5xl" style={{animation:"trophy-float 3s ease-in-out infinite"}}>👑</div>}
                                        </div>
                                        <div className="mb-4">
                                            <h3 className="text-2xl font-black text-white mb-1">{entry.name}</h3>
                                            {(()=>{const t=getPlayerTitle(playerStats.find(s=>s.name===entry.name));return <div className="text-xs font-bold opacity-70" style={{color:isTop?'#fbbf24':'#94a3b8'}}>{t.icon} {t.title}</div>;})()}
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-4xl font-black counter-roll" style={{color:isTop?'#fbbf24':COLORS[idx%COLORS.length]}}>{entry.value}</span>
                                                <span className="text-gray-400 text-sm font-semibold">victoires</span>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between text-sm"><span className="text-gray-400 font-semibold">Taux de victoire</span><span className="text-white font-black text-lg">{pct}%</span></div>
                                            <div className="w-full bg-black/30 rounded-full h-2 overflow-hidden"><div className="h-full rounded-full bar-grow" style={{backgroundColor:isTop?'#fbbf24':COLORS[idx%COLORS.length],width:pct+'%',filter:'drop-shadow(0 0 6px '+( isTop?'#fbbf24':COLORS[idx%COLORS.length])+'40)'}}></div></div>
                                            
                                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 mt-2">
                                                <div className="col-span-2 grid grid-cols-3 gap-1 mb-2">
                                                    <div className="text-center"><div className="text-gray-400 text-[10px] uppercase">Yams</div><div className="font-bold text-white">{pStat.yamsCount}</div></div>
                                                    <div className="text-center"><div className="text-gray-400 text-[10px] uppercase">Moy.</div><div className="font-bold text-white">{pStat.avgScore}</div></div>
                                                    <div className="text-center"><div className="text-gray-400 text-[10px] uppercase">Record</div><div className="font-bold text-green-400">{pStat.maxScore}</div></div>
                                                </div>
                                                <div className="text-center bg-white/5 p-2 rounded-lg"><div className="text-gray-400 text-xs">Série Actuelle 🔥</div><div className="font-bold text-orange-400 text-lg">{pStat.currentStreak}</div></div>
                                                <div className="text-center bg-white/5 p-2 rounded-lg"><div className="text-gray-400 text-xs">Série Max ⚡</div><div className="font-bold text-yellow-400 text-lg">{pStat.maxConsecutiveWins}</div></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                )}

                {/* 3. RECORDS & STATS (GRILLE DE 4) - SAFE MODE */}
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
                                <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-400/30 rounded-2xl p-5 hover:scale-[1.02] transition-all duration-300" style={{animation:"card-appear 0.4s cubic-bezier(0.22,1,0.36,1) 0.1s backwards"}}><div className="flex items-center gap-3 mb-3"><span className="text-4xl">🎯</span><div><div className="text-blue-300 text-xs font-bold uppercase">Meilleure Moyenne</div><div className="text-white text-xl font-black">{bestAvgP.map(p=>p.name).join(' & ')}</div></div></div><div className="text-4xl font-black text-blue-300">{bestAvg} pts</div></div>
                                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-2xl p-5 hover:scale-[1.02] transition-all duration-300" style={{animation:"card-appear 0.4s cubic-bezier(0.22,1,0.36,1) 0.2s backwards"}}><div className="flex items-center gap-3 mb-3"><span className="text-4xl">🎮</span><div><div className="text-purple-300 text-xs font-bold uppercase">Plus Actif</div><div className="text-white text-xl font-black">{mostGP.map(p=>p.name).join(' & ')}</div></div></div><div className="text-4xl font-black text-purple-300">{mostG} parties</div></div>
                                <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-2xl p-5 hover:scale-[1.02] transition-all duration-300" style={{animation:"card-appear 0.4s cubic-bezier(0.22,1,0.36,1) 0.3s backwards"}}><div className="flex items-center gap-3 mb-3"><span className="text-4xl">🎲</span><div><div className="text-yellow-300 text-xs font-bold uppercase">Total Yams</div><div className="text-white text-xl font-black">Tous joueurs</div></div></div><div className="text-4xl font-black text-yellow-300">{totY} 🎲</div></div>
                                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-2xl p-5 hover:scale-[1.02] transition-all duration-300" style={{animation:"card-appear 0.4s cubic-bezier(0.22,1,0.36,1) 0.4s backwards"}}><div className="flex items-center gap-3 mb-3"><span className="text-4xl">👑</span><div><div className="text-green-300 text-xs font-bold uppercase">Roi du Yams</div><div className="text-white text-xl font-black">{mostYP.map(p=>p.name).join(' & ')}</div></div></div><div className="text-4xl font-black text-green-300">{maxY} Yams</div></div>
                            </>
                        );
                    })()}
                  </div>
                </div>

                {/* 4. YAMS STATS & YAMS CACHÉS */}
                <div className={'bg-gradient-to-br '+T.card+' backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl '+T.glow+' p-6'}>
                    <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                        <h2 className="text-3xl font-black text-white flex items-center gap-3"><Dices className="text-yellow-400"/> Yams & Yams Cachés</h2>
                        <select onChange={e=>setVersus({...versus, yamsFilter: e.target.value})} className="bg-black/50 text-white px-4 py-2 rounded-xl font-bold border border-white/20 outline-none cursor-pointer hover:bg-black/60 transition-all text-sm hover:scale-105">
                            <option value="GLOBAL" className="bg-slate-900">🌍 Global</option>
                            {Object.keys(playerStats.reduce((acc,s)=>{acc[s.name]=s; return acc},{})).map(n=><option key={n} value={n} className="bg-slate-900">{n}</option>)}
                        </select>
                    </div>
                    
                    {(()=>{
                        const target = versus.yamsFilter || 'GLOBAL';
                        const dist = {1:0,2:0,3:0,4:0,5:0,6:0};
                        const upperCatConfig = [{id:'ones',name:'As',max:5,icon:'⚀',mult:1},{id:'twos',name:'Deux',max:10,icon:'⚁',mult:2},{id:'threes',name:'Trois',max:15,icon:'⚂',mult:3},{id:'fours',name:'Quatre',max:20,icon:'⚃',mult:4},{id:'fives',name:'Cinq',max:25,icon:'⚄',mult:5},{id:'sixes',name:'Six',max:30,icon:'⚅',mult:6}];
                        const hiddenByPlayer = {};
                        let totalHidden = 0;
                        (filteredHistory||[]).forEach(g => {
                            const grid = g.grid || {};
                            (g.players||g.results||[]).forEach(p => {
                                if(target !== 'GLOBAL' && p.name !== target) return;
                                const pGrid = grid[p.name];
                                if(pGrid) {
                                    if(pGrid.yamsHistory && Array.isArray(pGrid.yamsHistory)) pGrid.yamsHistory.forEach(val => dist[val] = (dist[val]||0)+1);
                                    if(!hiddenByPlayer[p.name]) hiddenByPlayer[p.name] = {total:0, details:{}};
                                    upperCatConfig.forEach(cat => {
                                        const val = grid[p.name]?.[cat.id];
                                        if(val !== undefined && parseInt(val) === cat.max) {
                                            hiddenByPlayer[p.name].total++;
                                            hiddenByPlayer[p.name].details[cat.id] = (hiddenByPlayer[p.name].details[cat.id]||0) + 1;
                                            totalHidden++;
                                        }
                                    });
                                }
                            });
                        });
                        const totalYams = Object.values(dist).reduce((s,v)=>s+v,0);
                        const maxDist = Math.max(1,...Object.values(dist));
                        const globalHidden = {};
                        upperCatConfig.forEach(cat => { globalHidden[cat.id] = Object.values(hiddenByPlayer).reduce((s,p)=>s+(p.details[cat.id]||0),0); });
                        const maxHidden = Math.max(1,...Object.values(globalHidden));
                        const sortedPlayers = Object.entries(hiddenByPlayer).sort((a,b) => b[1].total - a[1].total);

                        return (
                        <>
                        {/* YAMS RÉALISÉS */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-lg font-black text-white flex items-center gap-2">🎲 Yams Réalisés</h3>
                                <div className="bg-yellow-500/20 text-yellow-400 px-4 py-1.5 rounded-xl font-black text-sm border border-yellow-500/30">{totalYams} au total</div>
                            </div>
                            <div className="grid grid-cols-6 gap-3">
                                {[1,2,3,4,5,6].map(val => {
                                    const count = dist[val]||0;
                                    const pct = Math.round((count/maxDist)*100);
                                    return (
                                    <div key={val} className="relative group" style={{animation:`card-appear 0.4s cubic-bezier(0.22,1,0.36,1) ${val*0.06}s backwards`}}>
                                        <div className="bg-gradient-to-b from-white/8 to-white/3 border border-white/10 rounded-2xl p-3 text-center hover:border-yellow-500/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/10 relative overflow-hidden">
                                            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-yellow-500/20 to-transparent transition-all duration-700 rounded-b-2xl" style={{height:pct+'%'}}></div>
                                            <div className="relative z-10">
                                                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{['','⚀','⚁','⚂','⚃','⚄','⚅'][val]}</div>
                                                <div className="text-white font-black text-2xl">{count}</div>
                                                <div className="text-[9px] text-gray-500 uppercase font-bold mt-1">yams</div>
                                            </div>
                                        </div>
                                    </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* YAMS CACHÉS */}
                        <div>
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <h3 className="text-lg font-black text-white flex items-center gap-2">🫣 Yams Cachés</h3>
                                    <p className="text-[10px] text-gray-500 mt-0.5">Score maximum obtenu sur un chiffre (5 au As, 10 au Deux… 30 au Six)</p>
                                </div>
                                <div className="bg-purple-500/20 text-purple-400 px-4 py-1.5 rounded-xl font-black text-sm border border-purple-500/30">{totalHidden} au total</div>
                            </div>

                            {/* Barres horizontales */}
                            <div className="space-y-3 mb-6">
                                {upperCatConfig.map((cat,ci) => {
                                    const count = globalHidden[cat.id]||0;
                                    const pct = Math.round((count/maxHidden)*100);
                                    return (
                                    <div key={cat.id} className="flex items-center gap-3 group" style={{animation:`card-appear 0.35s cubic-bezier(0.22,1,0.36,1) ${ci*0.06}s backwards`}}>
                                        <div className="w-14 flex items-center gap-2 shrink-0"><span className="text-2xl group-hover:scale-110 transition-transform">{cat.icon}</span><span className="text-xs text-gray-500 font-bold">{cat.max}</span></div>
                                        <div className="flex-1 h-8 bg-black/30 rounded-xl overflow-hidden border border-white/5 relative">
                                            <div className="h-full bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl transition-all duration-1000 flex items-center justify-end pr-3" style={{width:count>0?Math.max(pct,12)+'%':'0%'}}>
                                                {count>0&&<span className="text-white font-black text-sm drop-shadow-md">{count}</span>}
                                            </div>
                                            {count===0&&<span className="absolute inset-0 flex items-center justify-center text-gray-600 text-xs font-bold">0</span>}
                                        </div>
                                    </div>
                                    );
                                })}
                            </div>
                        </div>
                        </>
                        );
                    })()}
                </div>

                {/* 4b. HALL OF FAME - SAFE MODE */}
                {hallOfFame && hallOfFame.biggestWin.gap > -1 && (
                    <div className={'bg-gradient-to-br '+T.card+' backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl '+T.glow+' p-6'}>
                        <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3"><Trophy className="text-yellow-500"/> Hall of Fame</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border border-green-500/30 p-4 rounded-2xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 hover:shadow-lg" style={{animation:"card-appear 0.4s cubic-bezier(0.22,1,0.36,1) 0.1s backwards"}}>
                                <div className="absolute top-2 right-2 opacity-20"><Swords size={40} className="text-green-400"/></div>
                                <div className="text-green-400 font-bold text-xs uppercase mb-1 flex items-center gap-2"><Swords size={14}/> Plus large victoire</div>
                                <div className="text-white font-black text-3xl">+{hallOfFame.biggestWin.gap} pts</div>
                                <div className="text-gray-300 text-sm mt-1 font-bold">{hallOfFame.biggestWin.winner} <span className="text-gray-500 font-normal">vs</span> {hallOfFame.biggestWin.second}</div>
                            </div>
                            <div className="bg-gradient-to-br from-orange-900/40 to-amber-900/40 border border-orange-500/30 p-4 rounded-2xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 hover:shadow-lg" style={{animation:"card-appear 0.4s cubic-bezier(0.22,1,0.36,1) 0.2s backwards"}}>
                                <div className="absolute top-2 right-2 opacity-20"><Scale size={40} className="text-orange-400"/></div>
                                <div className="text-orange-400 font-bold text-xs uppercase mb-1 flex items-center gap-2"><Scale size={14}/> Plus serré</div>
                                <div className="text-white font-black text-3xl">+{hallOfFame.tightestWin.gap} pts</div>
                                <div className="text-gray-300 text-sm mt-1 font-bold">{hallOfFame.tightestWin.winner} <span className="text-gray-500 font-normal">vs</span> {hallOfFame.tightestWin.second}</div>
                            </div>
                            <div className="bg-gradient-to-br from-purple-900/40 to-fuchsia-900/40 border border-purple-500/30 p-4 rounded-2xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 hover:shadow-lg" style={{animation:"card-appear 0.4s cubic-bezier(0.22,1,0.36,1) 0.3s backwards"}}>
                                <div className="absolute top-2 right-2 opacity-20"><ThumbsDown size={40} className="text-purple-400"/></div>
                                <div className="text-purple-400 font-bold text-xs uppercase mb-1 flex items-center gap-2"><ThumbsDown size={14}/> Vainqueur petit bras</div>
                                <div className="text-white font-black text-3xl">{hallOfFame.lowestWinner.score} pts</div>
                                <div className="text-gray-300 text-sm mt-1 font-bold">{hallOfFame.lowestWinner.name}</div>
                            </div>
                            <div className="bg-gradient-to-br from-red-900/40 to-rose-900/40 border border-red-500/30 p-4 rounded-2xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 hover:shadow-lg" style={{animation:"card-appear 0.4s cubic-bezier(0.22,1,0.36,1) 0.4s backwards"}}>
                                <div className="absolute top-2 right-2 opacity-20"><ThumbsUp size={40} className="text-red-400"/></div>
                                <div className="text-red-400 font-bold text-xs uppercase mb-1 flex items-center gap-2"><ThumbsUp size={14}/> Perdant Magnifique</div>
                                <div className="text-white font-black text-3xl">{hallOfFame.highestLoser.score} pts</div>
                                <div className="text-gray-300 text-sm mt-1 font-bold">{hallOfFame.highestLoser.name}</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 5. FACE A FACE V2 (SAFE MODE) */}
                <div className={'bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border border-blue-500/30 backdrop-blur-xl rounded-3xl shadow-2xl '+T.glow+' p-6'}>
                    <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3"><Swords className="text-blue-400"/> Duel : Face-à-Face V2</h2>
                    
                    <div className="flex gap-4 items-center justify-center mb-8">
                        <select onChange={e=>setVersus({...versus, p1: e.target.value})} className="bg-white/5 p-4 rounded-2xl outline-none text-white font-bold border border-white/10 focus:border-white/30 w-1/3 text-center">
                            <option value="" disabled selected>Sélectionner...</option>
                            {Object.keys(playerStats.reduce((acc,s)=>{acc[s.name]=s; return acc},{})).map(n=><option key={n} value={n} className="bg-slate-900">{n}</option>)}
                        </select>
                        <div className="text-2xl font-black italic text-gray-500" style={{animation:"float 2s ease-in-out infinite",textShadow:"0 0 20px rgba(255,255,255,0.1)"}}>VS</div>
                        <select onChange={e=>setVersus({...versus, p2: e.target.value})} className="bg-white/5 p-4 rounded-2xl outline-none text-white font-bold border border-white/10 focus:border-white/30 w-1/3 text-center">
                            <option value="" disabled selected>Sélectionner...</option>
                            {Object.keys(playerStats.reduce((acc,s)=>{acc[s.name]=s; return acc},{})).map(n=><option key={n} value={n} className="bg-slate-900">{n}</option>)}
                        </select>
                    </div>
                    
                    {versus.p1 && versus.p2 && playerStats.find(s=>s.name===versus.p1) && playerStats.find(s=>s.name===versus.p2) && (
                        <div className="space-y-6">
                            {/* SCORECARD */}
                            {(() => {
                                const p1 = playerStats.find(s=>s.name===versus.p1);
                                const p2 = playerStats.find(s=>s.name===versus.p2);
                                if (!p1 || !p2) return null;

                                const p1Wins = filteredHistory.filter(g => {
                                    const pp1 = (g.players||g.results).find(p=>p.name===versus.p1);
                                    const pp2 = (g.players||g.results).find(p=>p.name===versus.p2);
                                    return pp1 && pp2 && pp1.isWinner;
                                }).length;
                                const p2Wins = filteredHistory.filter(g => {
                                    const pp1 = (g.players||g.results).find(p=>p.name===versus.p1);
                                    const pp2 = (g.players||g.results).find(p=>p.name===versus.p2);
                                    return pp1 && pp2 && pp2.isWinner;
                                }).length;

                                let p1Total = 0, p2Total = 0, gapSum = 0, streak = 0, currentWinner = null;
                                const mutualGames = filteredHistory.filter(g => {
                                     const pp1 = (g.players||g.results).find(p=>p.name===versus.p1);
                                     const pp2 = (g.players||g.results).find(p=>p.name===versus.p2);
                                     if(pp1 && pp2) { p1Total += pp1.score; p2Total += pp2.score; gapSum += Math.abs(pp1.score - pp2.score); return true; }
                                     return false;
                                });
                                for(let i=0; i<mutualGames.length; i++) {
                                     const g = mutualGames[i];
                                     const pp1 = (g.players||g.results).find(p=>p.name===versus.p1);
                                     const pp2 = (g.players||g.results).find(p=>p.name===versus.p2);
                                     const winner = pp1.isWinner ? versus.p1 : pp2.isWinner ? versus.p2 : null;
                                     if(!winner) continue;
                                     if(currentWinner === null) { currentWinner = winner; streak = 1; }
                                     else if(currentWinner === winner) streak++;
                                     else break;
                                }
                                const avgGap = mutualGames.length > 0 ? Math.round(gapSum / mutualGames.length) : 0;

                                return (
                                    <>
                                        <div className="text-center mb-4"><span className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-gray-300">Total des rencontres : {mutualGames.length}</span></div>

                                        <div className="grid grid-cols-2 gap-4">
                                            {/* P1 CARD STYLE HoF */}
                                            <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border border-blue-500/30 p-6 rounded-2xl relative overflow-hidden text-center group hover:scale-[1.02] transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10" style={{animation:"card-appear 0.5s cubic-bezier(0.22,1,0.36,1) 0.1s backwards"}}>
                                                <div className="absolute top-2 right-2 opacity-20"><Swords size={60} className="text-blue-400"/></div>
                                                <div className="text-blue-400 font-bold text-sm uppercase mb-2 tracking-widest">{versus.p1}</div>
                                                <div className="text-white font-black text-6xl mb-1" style={{animation:"count-up 0.6s ease-out 0.3s backwards"}}>{p1Wins}</div>
                                                <div className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">Victoires</div>
                                            </div>
                                            {/* P2 CARD STYLE HoF */}
                                            <div className="bg-gradient-to-br from-red-900/40 to-rose-900/40 border border-red-500/30 p-6 rounded-2xl text-center relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 hover:shadow-xl hover:shadow-red-500/10" style={{animation:"card-appear 0.5s cubic-bezier(0.22,1,0.36,1) 0.2s backwards"}}>
                                                <div className="absolute top-2 right-2 opacity-20"><Swords size={60} className="text-red-400"/></div>
                                                <div className="text-red-400 font-bold text-sm uppercase mb-2 tracking-widest">{versus.p2}</div>
                                                <div className="text-white font-black text-6xl mb-1" style={{animation:"count-up 0.6s ease-out 0.4s backwards"}}>{p2Wins}</div>
                                                <div className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">Victoires</div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-3">
                                            <div className="bg-white/5 p-3 rounded-xl text-center border border-white/10 hover:bg-white/10 transition-all duration-200 hover:scale-[1.03]">
                                                <div className="text-[9px] uppercase text-gray-400 font-bold mb-1">Écart Moyen</div>
                                                <div className="text-white font-black text-lg">{avgGap} pts</div>
                                            </div>
                                            <div className="bg-white/5 p-3 rounded-xl text-center border border-white/10 hover:bg-white/10 transition-all duration-200 hover:scale-[1.03]">
                                                <div className="text-[9px] uppercase text-gray-400 font-bold mb-1">Série en cours</div>
                                                <div className="text-white font-black text-sm">{currentWinner || "-"} <span className="text-yellow-400">x{streak}</span></div>
                                            </div>
                                            <div className="bg-white/5 p-3 rounded-xl text-center border border-white/10 hover:bg-white/10 transition-all duration-200 hover:scale-[1.03]">
                                                <div className="text-[9px] uppercase text-gray-400 font-bold mb-1">Cumul Points</div>
                                                <div className="text-xs font-bold"><span className="text-blue-400">{p1Total}</span> / <span className="text-red-400">{p2Total}</span></div>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            {[
                                                { label: "Moyenne", v1: p1.avgScore, v2: p2.avgScore },
                                                { label: "Record", v1: p1.maxScore, v2: p2.maxScore },
                                                { label: "Total Yams", v1: p1.yamsCount, v2: p2.yamsCount },
                                                { label: "Bonus", v1: p1.bonusCount, v2: p2.bonusCount }
                                            ].map((stat, i) => (
                                                <div key={i} className="flex items-center justify-between bg-black/20 px-4 py-3 rounded-xl border border-white/5 hover:bg-black/30 transition-all duration-200">
                                                    <span className={`font-black w-12 text-center text-lg ${stat.v1 > stat.v2 ? "text-green-400" : "text-white"}`}>{stat.v1}</span>
                                                    <span className="text-[10px] uppercase text-gray-500 font-bold flex-1 text-center tracking-widest">{stat.label}</span>
                                                    <span className={`font-black w-12 text-center text-lg ${stat.v2 > stat.v1 ? "text-green-400" : "text-white"}`}>{stat.v2}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    )}
                </div>

                
                
                {/* 9. STATISTIQUES DE RAYAGE (FAILURES) - DESIGN HALL OF FAME BLEU */}
                <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border border-blue-500/30 p-6 rounded-3xl backdrop-blur-xl relative overflow-hidden group card-appear">
                     <div className="mb-6 relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                             <AlertTriangle className="text-blue-400" size={32}/>
                             <h2 className="text-3xl font-black text-white">Zone de Danger</h2>
                        </div>
                        
                        <select onChange={e=>setVersus({...versus, failPlayer: e.target.value})} className="w-full bg-black/50 text-white p-3 rounded-xl font-bold border border-white/20 outline-none cursor-pointer hover:bg-black/60 transition-colors text-center text-lg shadow-lg">
                            <option value="GLOBAL" className="bg-slate-900">🌍 GLOBAL (Tous les joueurs)</option>
                            {Object.keys(playerStats.reduce((acc,s)=>{acc[s.name]=s; return acc},{})).map(n=><option key={n} value={n} className="bg-slate-900">{n}</option>)}
                        </select>
                     </div>
                     
                     <div className="overflow-x-auto max-h-96 overflow-y-auto relative z-10 pr-2">
                         {(() => {
                             const pName = versus.failPlayer || 'GLOBAL';
                             const { failures, totalGames } = calculateGlobalFailures(pName);
                             
                             if (totalGames === 0) return <div className="text-center text-gray-300 font-bold text-sm py-8 bg-black/20 rounded-xl">Aucune donnée disponible pour l'instant.</div>;

                             return (
                                 <table className="w-full text-sm text-left border-collapse">
                                    <thead>
                                        <tr className="text-blue-200 border-b-2 border-blue-500/30"><th className="py-3 pl-4 uppercase text-[10px] tracking-widest text-left">Catégorie</th><th className="py-3 text-center uppercase text-[10px] tracking-widest">Échecs (0 pts)</th><th className="py-3 pr-4 text-center uppercase text-[10px] tracking-widest w-24">Taux</th></tr>
                                    </thead>
                                    <tbody className="text-white">
                                        {failures.map(f => (
                                            <tr key={f.id} className="border-b border-blue-500/10 hover:bg-blue-500/10 transition-colors">
                                                <td className="py-3 pl-4 font-bold flex items-center justify-start gap-3 text-lg">
                                                    <span className="text-2xl">{categories.find(c=>c.id===f.id)?.icon}</span> 
                                                    {f.name}
                                                </td>
                                                <td className={`py-3 text-center font-black text-lg ${f.count > 0 ? 'text-blue-300' : 'text-gray-500'}`}>{f.count} <span className="text-xs text-gray-500 font-normal">/ {totalGames}</span></td>
                                                <td className="py-3 pr-4 text-center">
                                                    <div className="flex items-center justify-center gap-3">
                                                        <span className="font-bold">{f.rate}%</span>
                                                        <div className="w-16 h-2 bg-black/40 rounded-full overflow-hidden shadow-inner border border-white/5">
                                                            <div className={`h-full transition-all duration-500 ${f.rate > 50 ? 'bg-blue-500' : f.rate > 20 ? 'bg-cyan-400' : 'bg-green-400'}`} style={{width: `${f.rate}%`}}></div>
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

            </>)}
            </div>
        )}

      </div>
    </div>
  );
}