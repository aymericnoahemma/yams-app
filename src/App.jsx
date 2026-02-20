import React, { useState, useEffect, useMemo, useRef } from "react";
import { Plus, Trash2, RotateCcw, Settings, Edit3, Check, X, Download, Share2, Undo2, BookOpen, Dices, Eye, ArrowLeft, Trophy, Medal, Activity, Lock, History as HistoryIcon, Timer, EyeOff, Palette, Sun, Monitor, Zap, Scale, Swords, ThumbsDown, ThumbsUp, Crown, ScrollText, Award, Flame, Coffee, Ghost, Moon, Wand2, TrendingUp, AlertTriangle, Gift, Camera, Calendar, PenLine, Info, Save, Play, Pause, Skull, Sparkles, Image, BarChart3, HelpCircle, LockKeyhole, Star, Gavel, Heart, Terminal, Snowflake, FileText, Users, CloudRain, CloudLightning, Droplets, ChevronUp, Target } from "lucide-react";

// --- CONFIGURATION ---
const categories = [{
        id: "upperHeader",
        upperHeader: true
    }, {
        id: "ones",
        name: "As",
        values: [0, 1, 2, 3, 4, 5],
        upper: true,
        icon: "⚀",
        color: "#3b82f6",
        max: 5
    }, {
        id: "twos",
        name: "Deux",
        values: [0, 2, 4, 6, 8, 10],
        upper: true,
        icon: "⚁",
        color: "#8b5cf6",
        max: 10
    }, {
        id: "threes",
        name: "Trois",
        values: [0, 3, 6, 9, 12, 15],
        upper: true,
        icon: "⚂",
        color: "#ec4899",
        max: 15
    }, {
        id: "fours",
        name: "Quatre",
        values: [0, 4, 8, 12, 16, 20],
        upper: true,
        icon: "⚃",
        color: "#f97316",
        max: 20
    }, {
        id: "fives",
        name: "Cinq",
        values: [0, 5, 10, 15, 20, 25],
        upper: true,
        icon: "⚄",
        color: "#10b981",
        max: 25
    }, {
        id: "sixes",
        name: "Six",
        values: [0, 6, 12, 18, 24, 30],
        upper: true,
        icon: "⚅",
        color: "#06b6d4",
        max: 30
    }, {
        id: "upperSectionDivider",
        upperDivider: true
    }, {
        id: "upperTotal",
        name: "Sous-total",
        upperTotal: true,
        icon: "📊",
        color: "#a855f7"
    }, {
        id: "bonus",
        name: "Bonus",
        bonus: true,
        icon: "🎁",
        color: "#fbbf24"
    }, {
        id: "upperGrandTotal",
        name: "Total Sup.",
        upperGrandTotal: true,
        icon: "🔼",
        color: "#a855f7"
    }, {
        id: "sectionDivider",
        divider: true
    }, {
        id: "threeOfKind",
        name: "Brelan",
        values: Array.from({
            length: 31
        }, (_, i) => i),
        lower: true,
        icon: "⚂⚂⚂",
        color: "#10b981",
        desc: "3 dés identiques",
        max: 30
    }, {
        id: "fourOfKind",
        name: "Carré",
        values: Array.from({
            length: 31
        }, (_, i) => i),
        lower: true,
        icon: "⚃⚃⚃⚃",
        color: "#06b6d4",
        desc: "4 dés identiques",
        max: 30
    }, {
        id: "fullHouse",
        name: "Full",
        values: [0, 25],
        lower: true,
        icon: "⚄⚄⚄⚂⚂",
        color: "#ec4899",
        desc: "3+2 identiques",
        max: 25
    }, {
        id: "smallStraight",
        name: "P. Suite",
        values: [0, 30],
        lower: true,
        icon: "⚀⚁⚂⚃",
        color: "#8b5cf6",
        desc: "4 suivis",
        max: 30
    }, {
        id: "largeStraight",
        name: "G. Suite",
        values: [0, 40],
        lower: true,
        icon: "⚀⚁⚂⚃⚄",
        color: "#3b82f6",
        desc: "5 suivis",
        max: 40
    }, {
        id: "yams",
        name: "Yams",
        values: [0, 50],
        lower: true,
        icon: "⚅⚅⚅⚅⚅",
        color: "#fbbf24",
        desc: "5 identiques",
        max: 50
    }, {
        id: "chance",
        name: "Chance",
        values: Array.from({
            length: 31
        }, (_, i) => i),
        lower: true,
        icon: "🍀",
        color: "#10b981",
        desc: "Total",
        max: 30
    }, {
        id: "lowerTotal",
        name: "Total Inf.",
        lowerTotal: true,
        icon: "🔽",
        color: "#ec4899"
    }
];

const PARTY_CHALLENGES = [{
        id: 'bonus',
        desc: 'Obtenir le bonus (+35)',
        icon: '🎁',
        check: (grid) => {
            const up = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'].reduce((s, k) => s + (parseInt(grid[k]) || 0), 0);
            return up >= 63;
        }
    }, {
        id: 'yams',
        desc: 'Faire un YAMS',
        icon: '🎲',
        check: (grid) => parseInt(grid.yams) === 50
    }, {
        id: 'full',
        desc: 'Faire un Full',
        icon: '🃏',
        check: (grid) => parseInt(grid.fullHouse) === 25
    }, {
        id: 'grand',
        desc: 'Grande Suite',
        icon: '🎯',
        check: (grid) => parseInt(grid.largeStraight) === 40
    }, {
        id: 'no_zero',
        desc: 'Aucun zéro !',
        icon: '💪',
        check: (grid) => {
            const cats = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes', 'threeOfKind', 'fourOfKind', 'fullHouse', 'smallStraight', 'largeStraight', 'yams', 'chance'];
            return cats.every(k => grid[k] !== undefined && parseInt(grid[k]) > 0);
        }
    }, {
        id: 'over250',
        desc: 'Dépasser 250 pts',
        icon: '📈',
        check: (g, t) => t >= 250
    }, {
        id: 'over300',
        desc: 'Dépasser 300 pts',
        icon: '🔥',
        check: (g, t) => t >= 300
    }, {
        id: 'top_upper',
        desc: 'Score sup. > 70',
        icon: '⬆️',
        check: (grid) => {
            const up = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'].reduce((s, k) => s + (parseInt(grid[k]) || 0), 0);
            return up >= 70;
        }
    },
];

const getPlayerTitle = (stat) => {
    if (!stat || !stat.games)
        return {
            title: "Nouveau",
            icon: "🆕"
        };
    const wr = stat.games > 0 ? stat.wins / stat.games : 0;
    const br = stat.bonusRate || 0;
    const mcw = stat.maxConsecutiveWins || 0;
    if (stat.maxScore >= 350)
        return {
            title: "Dieu du Yams",
            icon: "⚡"
        };
    if ((stat.yamsCount || 0) >= 20)
        return {
            title: "Machine à Yams",
            icon: "🎰"
        };
    if (wr >= 0.8 && stat.games >= 10)
        return {
            title: "Inarrêtable",
            icon: "💀"
        };
    if (br >= 70 && stat.games >= 5)
        return {
            title: "Mr Bonus",
            icon: "🎁"
        };
    if (mcw >= 5)
        return {
            title: "Série Noire",
            icon: "🔥"
        };
    if ((stat.currentStreak || 0) >= 3)
        return {
            title: "En Feu",
            icon: "🔥"
        };
    if (stat.games >= 50 && wr >= 0.5)
        return {
            title: "Vétéran d'Élite",
            icon: "🎖️"
        };
    if (stat.games >= 50)
        return {
            title: "Vétéran",
            icon: "🧙"
        };
    if (wr >= 0.6 && stat.games >= 10)
        return {
            title: "Le Chanceux",
            icon: "🍀"
        };
    if ((stat.avgScore || 0) >= 250)
        return {
            title: "Score Machine",
            icon: "📈"
        };
    if (wr < 0.2 && stat.games >= 5)
        return {
            title: "Le Barreur Fou",
            icon: "🧱"
        };
    if (stat.games >= 10 && wr < 0.35)
        return {
            title: "Éternel Second",
            icon: "🥈"
        };
    if (stat.games >= 5)
        return {
            title: "Joueur Régulier",
            icon: "🎯"
        };
    if (stat.games >= 1)
        return {
            title: "Apprenti",
            icon: "📖"
        };
    return {
        title: "Débutant",
        icon: "🐣"
    };
};

const THEME_CONFETTI = {
    modern: ['✨', '⭐', '💜', '🔮', '🎆', '💎'],
    ocean: ['🫧', '🐠', '🌊', '💎', '🐬', '✨'],
    sunset: ['🔥', '🌅', '☀️', '🧡', '✨', '🎇'],
    forest: ['🍃', '🌿', '🌱', '🍀', '🌳', '✨'],
    cyber: ['⚡', '💜', '🔮', '🎆', '💫', '🌟'],
    coffee: ['☕', '🍪', '🧇', '🍩', '✨', '🤎'],
    lavender: ['🌸', '💜', '🦋', '✨', '💫', '🪻'],
    mono: ['⚪', '⚫', '🔲', '✨', '💫', '🌟'],
    blood: ['🩸', '🔴', '❤️‍🔥', '🌹', '💀', '✨'],
    arctic: ['❄️', '🧊', '⛄', '💎', '🌨️', '✨'],
    gold: ['👑', '🏆', '💰', '⭐', '🥇', '✨'],
    cherry: ['🌸', '🎀', '💖', '🦋', '✨', '💕'],
    matrix: ['🟢', '💚', '🖥️', '⚡', '✨', '🔋'],
    aurora: ['🌌', '💜', '🌠', '✨', '🔮', '💫'],
    midnight: ['🌙', '⭐', '🌟', '💙', '✨', '🌃'],
    neon: ['💡', '🌈', '⚡', '✨', '💫', '🔆'],
    jade: ['🪨', '💚', '🍵', '🏮', '✨', '🐉'],
    autumn: ['🍂', '🍁', '🎃', '🍄', '✨', '🌰'],
    galaxy: ['🌌', '🪐', '🚀', '⭐', '💫', '🌠'],
    retro: ['🕹️', '👾', '🎮', '🟣', '✨', '🔴'],
    spring: ['🌷', '🌼', '🐝', '🌈', '✨', '🦋'],
    christmas: ['🎄', '🎅', '🎁', '⭐', '❄️', '✨'],
    halloween: ['🎃', '👻', '🦇', '🕸️', '💀', '🧙']
};

const THEMES_CONFIG = {
    modern: {
        name: "Modern Dark",
        primary: "#6366f1",
        secondary: "#8b5cf6",
        bg: "from-slate-950 via-indigo-950 to-slate-950",
        card: "from-slate-900/90 to-slate-800/90",
        glow: "shadow-indigo-500/20",
        icon:  < Monitor size = {
            16
        }
        />, part: "✨" },
          ocean: { name: "Deep Ocean", primary: "#06b6d4", secondary: "#0891b2", bg: "from-slate-950 via-cyan-950 to-slate-950", card: "from-slate-900/90to - cyan - 900 / 90 ", glow: " shadow - cyan - 500 / 20 ", icon: <Share2 size={16}/>, part: " 🫧 " },
          sunset: { name: " Sunset Burn ", primary: " #f97316 ", secondary: " #ea580c ", bg: " from - slate - 950 via - orange - 950 to - slate - 950 ", card: " from - slate - 900 / 90 to - orange - 900 / 90 ", glow: " shadow - orange - 500 / 20 ", icon: <Sun size={16}/>, part: " 🔥 " },
          forest: { name: " Emerald Forest ", primary: " #10b981 ", secondary: " #059669 ", bg: " from - slate - 950 via - emerald - 950 to - slate - 950 ", card: " from - slate - 900 / 90 to - emerald - 900 / 90 ", glow: " shadow - emerald - 500 / 20 ", icon: <BookOpen size={16}/>, part: " 🍃 " },
          cyber: { name: " Cyberpunk ", primary: " #d946ef ", secondary: " #8b5cf6 ", bg: " from - black via - fuchsia - 950 to - black ", card: " from - black / 90 to - purple - 900 / 90 ", glow: " shadow - fuchsia - 500 / 40 ", icon: <Zap size={16}/>, part: " ⚡ " },
          coffee: { name: " Coffee Break ", primary: " #d97706 ", secondary: " #92400e ", bg: " from - stone - 950 via - stone - 900 to - stone - 800 ", card: " from - stone - 900 / 95 to - stone - 800 / 95 ", glow: " shadow - amber - 700 / 20 ", icon: <Coffee size={16}/>, part: " ☕ " },
          lavender: { name: " Lavender ", primary: " #a78bfa ", secondary: " #7c3aed ", bg: " from - violet - 950 via - slate - 900 to - violet - 900 ", card: " from - violet - 900 / 80 to - slate - 900 / 80 ", glow: " shadow - violet - 400 / 20 ", icon: <Ghost size={16}/>, part: " 🌸 " },
          mono: { name: " Monochrome ", primary: " #94a3b8 ", secondary: " #475569 ", bg: " from - gray - 950 via - gray - 900 to - black ", card: " from - gray - 900 to - black ", glow: " shadow - white / 10 ", icon: <Moon size={16}/>, part: " ⚪ " },
          blood: { name: " Blood Moon ", primary: " #dc2626 ", secondary: " #991b1b ", bg: " from - black via - red - 950 to - black ", card: " from - red - 950 / 80 to - black / 90 ", glow: " shadow - red - 500 / 30 ", icon: <Flame size={16}/>, part: " 🩸 " },
          arctic: { name: " Arctic ", primary: " #38bdf8 ", secondary: " #0284c7 ", bg: " from - sky - 950 via - cyan - 950 to - slate - 950 ", card: " from - sky - 900 / 80 to - slate - 900 / 90 ", glow: " shadow - sky - 400 / 20 ", icon: <Snowflake size={16}/>, part: " ❄️ " },
          gold: { name: " Royal Gold ", primary: " #eab308 ", secondary: " #ca8a04 ", bg: " from - yellow - 950 via - amber - 950 to - stone - 950 ", card: " from - amber - 900 / 80 to - stone - 900 / 90 ", glow: " shadow - yellow - 500 / 30 ", icon: <Crown size={16}/>, part: " 👑 " },
          cherry: { name: " Cherry Blossom ", primary: " #f472b6 ", secondary: " #db2777 ", bg: " from - pink - 950 via - rose - 950 to - slate - 950 ", card: " from - pink - 900 / 80 to - slate - 900 / 90 ", glow: " shadow - pink - 400 / 20 ", icon: <Heart size={16}/>, part: " 🌸 " },
          matrix: { name: " Matrix ", primary: " #22c55e ", secondary: " #15803d ", bg: " from - black via - green - 950 to - black ", card: " from - green - 950 / 70 to - black / 95 ", glow: " shadow - green - 500 / 30 ", icon: <Terminal size={16}/>, part: " 🟢 " },
          aurora: { name: " Aurora ", primary: " #a855f7 ", secondary: " #06b6d4 ", bg: " from - violet - 950 via - indigo - 950 to - cyan - 950 ", card: " from - violet - 900 / 70 to - cyan - 900 / 70 ", glow: " shadow - violet - 400 / 25 ", icon: <Sparkles size={16}/>, part: " 🌌 " },
          midnight: { name: " Midnight Blue ", primary: " #1d4ed8 ", secondary: " #1e40af ", bg: " from - blue - 950 via - slate - 950 to - blue - 950 ", card: " from - blue - 950 / 90 to - slate - 900 / 90 ", glow: " shadow - blue - 600 / 25 ", icon: <Moon size={16}/>, part: " 🌙 " },
          toxic: { name: " Toxic ", primary: " #84cc16 ", secondary: " #65a30d ", bg: " from - black via - lime - 950 to - black ", card: " from - lime - 950 / 70 to - black / 90 ", glow: " shadow - lime - 500 / 30 ", icon: <Zap size={16}/>, part: " ☢️ " },
          rose: { name: " Rosé ", primary: " #fb7185 ", secondary: " #e11d48 ", bg: " from - rose - 950 via - pink - 950 to - slate - 950 ", card: " from - rose - 900 / 70 to - slate - 900 / 80 ", glow: " shadow - rose - 400 / 25 ", icon: <Heart size={16}/>, part: " 🌹 " },
          neon: { name: " Neon City ", primary: " #06b6d4 ", secondary: " #d946ef ", bg: " from - black via - cyan - 950 to - fuchsia - 950 ", card: " from - cyan - 950 / 60 to - fuchsia - 950 / 60 ", glow: " shadow - cyan - 400 / 30 ", icon: <Zap size={16}/>, part: " 💜 " },
          earth: { name: " Terre ", primary: " #a16207 ", secondary: " #854d0e ", bg: " from - amber - 950 via - yellow - 950 to - stone - 950 ", card: " from - amber - 950 / 80 to - stone - 900 / 80 ", glow: " shadow - amber - 600 / 20 ", icon: <Sun size={16}/>, part: " 🌍 " },
          ice: { name: " Glacial ", primary: " #67e8f9 ", secondary: " #22d3ee ", bg: " from - cyan - 950 via - sky - 950 to - slate - 950 ", card: " from - cyan - 900 / 60 to - sky - 900 / 60 ", glow: " shadow - cyan - 300 / 25 ", icon: <Snowflake size={16}/>, part: " 🧊 " },
          volcano: { name: " Volcan ", primary: " #f97316 ", secondary: " #dc2626 ", bg: " from - red - 950 via - orange - 950 to - black ", card: " from - red - 950 / 80 to - orange - 950 / 70 ", glow: " shadow - orange - 500 / 30 ", icon: <Flame size={16}/>, part: " 🌋 " }
        };

        const DICE_SKINS = {
            classic: { name: " Classique ", bg: " bg - white ", text: " text - black ", border: " border - slate - 200 " },
            casino: { name: " Casino ", bg: " bg - red - 600 ", text: " text - white ", border: " border - red - 800 " },
            neon: { name: " Néon ", bg: " bg - black ", text: " text - green - 400 ", border: " border - green - 500 shadow - [0_0_10px_ #4ade80]" },
            gold: { name: " Luxe ", bg: " bg - yellow - 400 ", text: " text - yellow - 900 ", border: " border - yellow - 600 " }
        };

        const GRID_SKINS = {
            default: { name: " Défaut ", headerBg: " from - slate - 900 to - slate - 800 ", rowBg: " ", cellBg: " ", border: " border - white / 10 ", text: " text - white ", accent: " " },
            neon: { name: " Néon ", headerBg: " from - black to - gray - 950 ", rowBg: " bg - black / 40 ", cellBg: " shadow - [inset_0_0_8px_rgba(0, 255, 128, 0.05)]", border: " border - green - 500 / 20 ", text: " text - green - 300 ", accent: " shadow - [0_0_20px_rgba(0, 255, 128, 0.05)]" },
            vintage: { name: " Papier Vintage ", headerBg: " from - amber - 950 to - yellow - 950 ", rowBg: " bg - amber - 900 / 10 ", cellBg: " ", border: " border - amber - 700 / 20 ", text: " text - amber - 100 ", accent: " sepia - [0.2]" },
            chalk: { name: " Tableau Craie ", headerBg: " from - green - 950 to - emerald - 950 ", rowBg: " bg - green - 950 / 20 ", cellBg: " ", border: " border - green - 800 / 20 ", text: " text - green - 100 ", accent: " " },
            pixel: { name: " Pixel Art ", headerBg: " from - purple - 950 to - fuchsia - 950 ", rowBg: " bg - purple - 950 / 10 ", cellBg: " ", border: " border - purple - 500 / 20 ", text: " text - purple - 200 ", accent: " " }
        };

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

        const AVATAR_PACKS = {
            classic: { name: " Classique ", icons: [" 👤 "," 🙂 "," 😎 "," 🤠 "," 🤖 "," 🦊 "," 🦁 "," 👑 "," 🎯 "," 🎲 "," 🔥 "," 🦄 "," 💀 "," 💩 "," 👽 "," 💎 "] },
            animals: { name: " 🐾 Animaux ", icons: [" 🐶 "," 🐱 "," 🐻 "," 🐼 "," 🦁 "," 🐸 "," 🐧 "," 🦋 "," 🐙 "," 🦈 "," 🐺 "," 🦅 "," 🐲 "," 🦊 "," 🐮 "," 🐷 "], req: " games: 3 " },
            fantasy: { name: " 🧙 Fantasy ", icons: [" 🧙 "," 🧝 "," 🧛 "," 🧜 "," 🧚 "," 🦸 "," 🦹 "," 🤴 "," 👸 "," 🧟 "," 🧞 "," 🧑‍🚀 "," 🥷 "," 🗡️ "," 🏰 "," 🔮 "], req: " wins: 5 " },
            scifi: { name: " 🚀 Sci - Fi ", icons: [" 🤖 "," 👾 "," 🛸 "," 🚀 "," 🌌 "," 👨‍🚀 "," 🧬 "," ⚡ "," 🔬 "," 🛰️ "," 💫 "," 🌠 "," 🧑‍💻 "," 🎮 "," 🕹️ "," 🔋 "], req: " games: 10 " },
            food: { name: " 🍕 Food ", icons: [" 🍕 "," 🍔 "," 🌮 "," 🍣 "," 🍩 "," 🧁 "," 🍪 "," 🍦 "," 🥑 "," 🍒 "," 🧀 "," 🌶️ "," 🍿 "," 🥨 "," 🍗 "," 🥝 "], req: " games: 1 " },
            sports: { name: " ⚽ Sports ", icons: [" ⚽ "," 🏀 "," 🏈 "," 🎾 "," 🏐 "," 🏓 "," 🥊 "," 🏆 "," 🥇 "," 🏋️ "," 🤸 "," ⛷️ "," 🏄 "," 🚴 "," 🎳 "," 🥅 "], req: " wins: 3 " },
            seasonal: { name: " 🌸 Saisonnier ", icons: [" 🎄 "," 🎃 "," 🌸 "," ☀️ "," ❄️ "," 🌈 "," 🍂 "," 🌊 "," 🌺 "," ⛄ "," 🎆 "," 🌻 "," 🍁 "," 🌙 "," ⭐ "," 🌴 "], req: " games: 5 " }
        };

        const XP_LEVELS = [
            { level: 1, xp: 0, name: " Débutant ", icon: " 🐣 ", reward: null },
            { level: 2, xp: 200, name: " Apprenti ", icon: " 📖 ", reward: " Thème Coffee débloqué " },
            { level: 3, xp: 500, name: " Joueur ", icon: " 🎮 ", reward: " Skin dés Casino " },
            { level: 4, xp: 1000, name: " Compétiteur ", icon: " ⚔️ ", reward: " Pack Avatars Animaux " },
            { level: 5, xp: 2000, name: " Stratège ", icon: " 🧠 ", reward: " Grille Néon " },
            { level: 6, xp: 3500, name: " Expert ", icon: " 🎯 ", reward: " Pack Avatars Fantasy " },
            { level: 7, xp: 5000, name: " Maître ", icon: " 🏅 ", reward: " Thème Cyber " },
            { level: 8, xp: 7500, name: " Champion ", icon: " 🏆 ", reward: " Pack Avatars Sci - Fi " },
            { level: 9, xp: 10000, name: " Légende ", icon: " ⭐ ", reward: " Grille Pixel Art " },
            { level: 10, xp: 15000, name: " Dieu du Yams ", icon: " ⚡ ", reward: " Tout débloqué!" }
        ];

        const getXPLevel = (xp) => {
            let current = XP_LEVELS[0];
            for (const lvl of XP_LEVELS) { if (xp >= lvl.xp) current = lvl; }
            const nextIdx = XP_LEVELS.indexOf(current) + 1;
            const next = nextIdx < XP_LEVELS.length ? XP_LEVELS[nextIdx] : null;
            const progress = next ? ((xp - current.xp) / (next.xp - current.xp)) * 100 : 100;
            return { ...current, next, progress: Math.min(100, progress), totalXP: xp };
        };

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
            return funStats.length > 0 ? funStats[Math.floor(Math.random() * funStats.length)] : " Bienvenue dans YAMS!🎲 ";
        };

        const FUN_QUOTES = [
            " La chance sourit aux audacieux!🍀 "," C 'est pas fini tant que c' est pas fini 💪 "," Les dés sont jetés!🎲 ",
            " Quel coup de maître!🎯 "," On n 'arrête pas un joueur en forme 🔥","La roue tourne toujours ⚡",
            "Stratégie ou chance ? Un peu des deux 🧠","Le suspense est à son comble ! 😱",
            "Un grand pouvoir implique une grande responsabilité 🦸","Impossible n' est pas YAMS 💎 ",
            " La pression,
        c 'est pour les pneus 😎","Qui ne risque rien n' a rien 🎰 ",
            " Les légendes ne meurent jamais ⭐ "," C 'est dans les moments difficiles qu' on voit les champions 🏆 ",
            " Le comeback est en marche!🔄 "," Ça sent la victoire!👑 "," Aïe,
        ça fait mal 💀 ",
            " La tension est palpable ⚡ "," Masterclass en cours 📚 "," Coup dur...mais rien n 'est perdu ! 💪"
        ];

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
                            if(v === 0 && !k.includes(' History ') && !k.includes(' Score ')) { s.zeros++; consec++; if(consec > s.maxConsecutiveZeros) s.maxConsecutiveZeros = consec; }
                            else consec = 0;
                        });
                    }
                });
            });
            return Object.entries(shameStats).map(([name,d]) => ({name, ...d, avgScore: Math.round((history.reduce((s,g) => {const p=(g.players||g.results||[]).find(p=>p.name===name);return s+(p?p.score:0);},0))/Math.max(1,d.totalGames))})).sort((a,b) => b.zeros - a.zeros);
        };

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

        const getDynamicTitle = (player, players, scores, calcTotal, lastPlayerToPlay, moveLog) => {
            if (!players || players.length < 2) return null;
            const totals = players.map(p => ({ name: p, total: calcTotal(p) })).sort((a,b) => b.total - a.total);
            const rank = totals.findIndex(t => t.name === player) + 1;
            const gap = totals[0].total - totals[totals.length - 1].total;
            const isLeader = rank === 1;
            const isLast = rank === totals.length;
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

        const safeGetLS = (key, fallback = null) => {
            try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
            catch(e) { console.warn(' localStorage error: ', key); return fallback; }
        };

        const vibrate = (ms = 10) => { try { navigator?.vibrate?.(ms); } catch(e) {} };

        const FONT_OPTIONS = {
            default: { name: "Par défaut", family: "system-ui, -apple-system, sans-serif" },
            outfit: { name: "Outfit", family: "' Outfit ', sans-serif", url: "https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap" },
            jetbrains: { name: "JetBrains", family: "' JetBrains Mono ', monospace", url: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap" },
            poppins: { name: "Poppins", family: "' Poppins ', sans-serif", url: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;700;900&display=swap" },
            space: { name: "Space Grotesk", family: "' Space Grotesk ', sans-serif", url: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap" }
        };

        const CHAOS_EVENTS = [
            { title: "Mains de Beurre", desc: "Vous n' avez droit qu 'à 2 lancers ce tour-ci.", icon: "🧈" },
            { title: "Braquage", desc: "Volez 5 points imaginaires au joueur précédent.", icon: "💰" },
            { title: "Chance Double", desc: "Si vous jouez Chance, comptez double !", icon: "🍀" },
            { title: "Silence !", desc: "Interdiction de parler jusqu' au prochain tour.", icon: " 🤫 " },
            { title: " Cadeau ", desc: " Offrez un dé(virtuel)à votre voisin.", icon: " 🎁 " },
            { title: " Miroir ", desc: " Copiez le score d 'une case d' un adversaire.", icon: " 🪞 " },
            { title: " Lancer Aveugle ", desc: " Lancez les dés les yeux fermés.", icon: " 🙈 " },
            { title: " Rien ne va plus ", desc: " Aucun effet,
        ouf!", icon: " 😌 " }
        ];

        const ACHIEVEMENTS = [
            { id: " first_win ", name: " Première Victoire ", desc: " Gagner une partie ", xp: 100, icon: " 🥇 " },
            { id: " score_300 ", name: " Légende ", desc: " Faire un score > 300 ", xp: 500, icon: " 🔥 " },
            { id: " score_350 ", name: " Dieu du Yams ", desc: " Faire un score > 350 ", xp: 1000, icon: " ⚡ " },
            { id: " yams_king ", name: " Yams Master ", desc: " Faire 10 Yams au total ", xp: 300, icon: " 🎲 " },
            { id: " veteran ", name: " Vétéran ", desc: " Jouer 50 parties ", xp: 500, icon: " 👴 " },
            { id: " bonus_hunter ", name: " Chasseur de Bonus ", desc: " Obtenir 20 fois le bonus ", xp: 400, icon: " 🎁 " },
            { id: " perfect_lose ", name: " Lanterne Rouge ", desc: " Faire moins de 150 points ", xp: 150, icon: " 🐌 " },
            { id: " chaos_survivor ", name: " Chaos Survivor ", desc: " Gagner en mode Chaos ", xp: 250, icon: " 🌪️ " },
        ];

        const AVATAR_LIST = [
            { icon: " 👤 ", req: " none " }, { icon: " 🙂 ", req: " none " }, { icon: " 😎 ", req: " none " }, { icon: " 🤠 ", req: " none " },
            { icon: " 🤖 ", req: " games: 1 " }, { icon: " 🦊 ", req: " games: 5 " }, { icon: " 🦁 ", req: " wins: 1 " }, { icon: " 👑 ", req: " wins: 5 " },
            { icon: " 🎯 ", req: " yams: 1 " }, { icon: " 🎲 ", req: " yams: 5 " }, { icon: " 🔥 ", req: " score: 300 " }, { icon: " 🦄 ", req: " score: 350 " },
            { icon: " 💀 ", req: " lose: 1 " }, { icon: " 💩 ", req: " lose: 5 " }, { icon: " 👽 ", req: " bonus: 1 " }, { icon: " 💎 ", req: " bonus: 10 " }
        ];

        const playableCats = categories.filter(c=>!c.upperTotal&&!c.bonus&&!c.divider&&!c.upperGrandTotal&&!c.lowerTotal&&!c.upperDivider&&!c.upperHeader);
        const DEFAULT_GAGES = [" Ranger le jeu tout seul 🧹 ", " Servir à boire à tout le monde 🥤 ", " Ne plus dire 'non' pendant 10 min 🤐 ", " Choisir la musique pour 1h 🎵 ", " Imiter une poule à chaque phrase 🐔 ", " Faire 10 pompes(ou squats)💪 ", " Appeler le gagnant 'Mon Seigneur' 👑 ", " Jouer la prochaine partie les yeux fermés au lancer 🙈 "];

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
          if(isFoggy && isLocked) return <div className=" w - full py - 3 text - center text - gray - 500 font - black animate - pulse text - xs sm: text - lg ">???</div>;
          if(isImposedDisabled) return <div className=" w - full py - 3 text - center text - gray - 700 font - bold bg - black / 20 rounded - xl opacity - 30 cursor - not - allowed text - xs sm: text - lg ">🔒</div>;
          const cat = categories.find(c=>c.id===category);
          const vals = cat?.values || Array.from({length:31},(_,i)=>i);
          const hasValue = value !== undefined && value !== '' && value !== null;
          const isZero = hasValue && parseInt(value) === 0;
          return (
            <select value={value??''} onChange={e=>onChange(e.target.value, e)} disabled={isLocked}
              className={`w-full py-3 px-2 rounded-xl font-bold text-sm sm:text-lg text-center transition-all duration-300 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/40 focus:shadow-lg focus:shadow-white/10 focus:scale-[1.03] ${isLocked?(isZero?'cursor-not-allowed opacity-50 bg-red-500/10 text-red-400/60 border border-red-500/20 cell-cracked':'cursor-not-allowed opacity-60 bg-white/5 text-gray-400 border border-white/10 cell-alive'):isHighlighted?'cursor-pointer bg-gradient-to-r from-green-500/30 to-emerald-500/30 border-2 border-green-400 text-white shadow-lg shadow-green-500/50 ring-pulse':'cursor-pointer bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 hover:shadow-lg hover:shadow-white/5 cell-empty-wave'}`}
              style={isLocked||isHighlighted?{}:{background:'linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.1))',color:'white'}}>
              <option value=" " style={{backgroundColor:'#1e293b',color:'white'}}>-</option>
              {vals.map(v=><option key={v} value={v} style={{backgroundColor:'#1e293b',color:'white'}}>{v}</option>)}
            </select>
          );
        };

        const PlayerCard = ({ player, index, onRemove, onNameChange, canRemove, gameStarted, avatar, onAvatarClick }) => {
          const [editing, setEditing] = useState(false);
          const [name, setName] = useState(player);
          const save = () => { if(name.trim()){onNameChange(index,name.trim());setEditing(false);} };
          return (
            <div className=" glass - strong rounded - 2xl p - 3 sm: p - 4 hover: bg - white / 10 transition - all duration - 300 hover: scale - [1.02]hover: shadow - xl group " style={{animationDelay:`${index*80}ms`,animation:'fade-in-scale 0.4s ease-out backwards'}}>
              <div className=" flex items - center justify - between gap - 2 sm: gap - 3 ">
                <button onClick={() => onAvatarClick(index)} className=" w - 11 h - 11 rounded - full bg - white / 10 flex items - center justify - center text - xl hover: bg - white / 20 transition - all duration - 300 shadow - inner overflow - hidden cursor - pointer hover: scale - 110 hover: shadow - lg group - hover: ring - 2 group - hover: ring - white / 20 " title=" Changer l 'avatar">
                    {avatar && avatar.startsWith(' data: image ') ? <img src={avatar} alt="Avatar" className="w-full h-full object-cover" /> : (avatar || "👤")}
                </button>
                {editing ? <input type="text" value={name} onChange={e=>setName(e.target.value)} onKeyPress={e=>e.key===' Enter '&&save()} className="flex-1 bg-white/10 border border-white/20 rounded-xl px-2 py-1 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-white/50 text-sm" autoFocus/>
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
                <button onClick={handleClick} className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl active:scale-90 transition-all duration-200 ${s.bg} ${s.text} ${s.border} border-2 shadow-lg hover:shadow-xl ${rolling ? ' ' : ' hover: -translate - y - 1 '}`}
                  style={rolling ? {animation: ' dice - roll 0.6s ease - in - out '} : {}}>
                    {[' ', ' ⚀ ', ' ⚁ ', ' ⚂ ', ' ⚃ ', ' ⚄ ', ' ⚅ '][value]}
                </button>
            );
        };

        const FloatingScore = ({ x, y, value, color }) => {
            const c = color || ' #4ade80 ';
            return (
              <div className="fixed pointer-events-none z-[9999]" style={{ left: x, top: y, transform: ' translateX(-50 % )' }}>
                <div className="font-black text-2xl" style={{ animation: ' floatUp 1s ease - out forwards ', fontFamily: ' JetBrains Mono,
        monospace ', color: c, textShadow: `0 0 12px ${c}, 0 0 24px ${c}40` }}>+{value}</div>
                <div className="absolute inset-0 font-black text-2xl score-trail" style={{ fontFamily: ' JetBrains Mono,
        monospace ', color: c, filter:' blur(6px)', opacity:0.5 }}>+{value}</div>
              </div>
            );
        };

        const FlipCounter = ({value, color}) => {
          const [prev, setPrev] = React.useState(value);
          const [flipping, setFlipping] = React.useState(false);
          React.useEffect(()=>{
            if(value !== prev){setFlipping(true);const t=setTimeout(()=>{setPrev(value);setFlipping(false);},500);return()=>clearTimeout(t);}
          },[value]);
          const digits = String(value).split(' ');
          const prevDigits = String(prev).split(' ');
          while(prevDigits.length < digits.length) prevDigits.unshift(' 0 ');
          return (
            <span style={{color,perspective:' 200px '}} className="inline-flex">
              {digits.map((d,i)=>{
                const changed = d !== (prevDigits[i]||' 0 ');
        return <span key={i+' - '+d} className={changed&&flipping?' flip - digit ':' '} style={{display:' inline - block ',minWidth:' 0.6em ',textAlign:' center '}}>{flipping&&changed?prevDigits[i]||' 0 ':d}</span>;
              })}
            </span>
          );
        };

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
              style={{pointerEvents:' none '}}>
              <div className="absolute inset-0" style={{pointerEvents:' all '}}
                onMouseMove={e=>{mouseRef.current={x:e.clientX,y:e.clientY};}}
                onTouchMove={e=>{if(e.touches[0])mouseRef.current={x:e.touches[0].clientX,y:e.touches[0].clientY};}}>
              </div>
              {particlesRef.current.map((p,i)=>(
                <div key={i} className="absolute opacity-[0.05] transition-none" style={{
                  left:`${p.x}%`,top:`${p.y}%`,fontSize:`${p.size}px`,
                  transform:' rotate('+(p.y*3.6)+' deg)',
                  willChange:' left,
        top '
                }}>{TC.part}</div>
              ))}
            </div>
          );
        };
        export default function YamsUltimateLegacy() {
          const [players,setPlayers]=useState([' Joueur 1 ',' Joueur 2 ']);
          const [scores,setScores]=useState({});
          const [theme,setTheme]=useState(' modern ');
          const [showSettings,setShowSettings]=useState(false);
          const [gameHistory,setGameHistory]=useState([]);
          const [currentTab,setCurrentTab]=useState(' game ');
          const [showEndGameModal,setShowEndGameModal]=useState(false);
          const [lastPlayerToPlay,setLastPlayerToPlay]=useState(null);
          const [showTurnWarning,setShowTurnWarning]=useState(null);
          const [lastModifiedCell,setLastModifiedCell]=useState(null);
          const [editMode,setEditMode]=useState(false);
          const [scoresBeforeEdit,setScoresBeforeEdit]=useState(null);
          const [lastPlayerBeforeEdit,setLastPlayerBeforeEdit]=useState(null);
          const [showVictoryAnimation,setShowVictoryAnimation]=useState(false);
          const [notifQueue, setNotifQueue] = useState([]);
          const pushNotif = (notif, duration=4500) => {
            const id = Date.now() + Math.random();
            setNotifQueue(prev => [...prev.slice(-2), {...notif, id}]);
            setTimeout(() => setNotifQueue(prev => prev.filter(n => n.id !== id)), duration);
          };
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
          const [diceSkin, setDiceSkin] = useState(' classic ');
          const [moveLog, setMoveLog] = useState([]);
          const [showLog, setShowLog] = useState(false);
          const [isReplaying, setIsReplaying] = useState(false);
          const [floatingScores, setFloatingScores] = useState([]);
          const [versus, setVersus] = useState({p1: ' ', p2: ' ', failPlayer: ' GLOBAL ', yamsFilter: ' GLOBAL '});
          const [globalXP, setGlobalXP] = useState(0);
          const [chaosMode, setChaosMode] = useState(false);
          const [activeChaosCard, setActiveChaosCard] = useState(null);
          const [showStudioModal, setShowStudioModal] = useState(false);
          const [wakeLockEnabled, setWakeLockEnabled] = useState(true);

          const [seasons, setSeasons] = useState([]);
          const [activeSeason, setActiveSeason] = useState(' Aucune ');
          const [seasonDescriptions, setSeasonDescriptions] = useState({});
          const [newSeasonName, setNewSeasonName] = useState(' ');
          const [statsFilterSeason, setStatsFilterSeason] = useState(' Toutes ');
          const [historyFilterSeason, setHistoryFilterSeason] = useState(' Toutes ');
          const [renamingSeason, setRenamingSeason] = useState(null);
          const [tempSeasonName, setTempSeasonName] = useState(' ');
          const [editingHistoryId, setEditingHistoryId] = useState(null);

          const [pendingYamsDetail, setPendingYamsDetail] = useState(null);

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
          const [glassCrack, setGlassCrack] = useState(null);
          const [tensionMode, setTensionMode] = useState(false);
          const [quickStatsPlayer, setQuickStatsPlayer] = useState(null);
          const [shockwavePos, setShockwavePos] = useState(null);
          const [emojiRain, setEmojiRain] = useState(null);
          const [showDiceAnim, setShowDiceAnim] = useState(false);
          const [streaks, setStreaks] = useState({});
          const [lastCellKey, setLastCellKey] = useState(null);
          const [tabDirection, setTabDirection] = useState(' l ');
          const [prevTab, setPrevTab] = useState(' game ');
          const [showSplash, setShowSplash] = useState(true);
          const [showPlayerCard, setShowPlayerCard] = useState(null);
          const [gridSkin, setGridSkin] = useState(' default ');
          const [playerColors, setPlayerColors] = useState({});
          const [showVSScreen, setShowVSScreen] = useState(false);
          const [weatherEffects, setWeatherEffects] = useState(true);
          const [hotSeatPlayer, setHotSeatPlayer] = useState(null);
          const [massacreScreen, setMassacreScreen] = useState(null);
          const [scoreParticles, setScoreParticles] = useState([]);
          const [consecutiveZeros, setConsecutiveZeros] = useState({});
          const [gameNote, setGameNote] = useState(' ');
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
          const [rouletteMode, setRouletteMode] = useState(false);
          const [rouletteResult, setRouletteResult] = useState(null);
          const [compactMode, setCompactMode] = useState(typeof window!==' undefined '&&window.innerWidth<400);
          const [idleAvatars, setIdleAvatars] = useState(false);
          const [playerEntrance, setPlayerEntrance] = useState(false);
          const [funQuote, setFunQuote] = useState(null);
          const [customFont, setCustomFont] = useState(' default ');
          const replayIntervalRef = useRef(null);
          const T = THEMES_CONFIG[theme];
          const tabOrder = [' game ',' rules ',' trophies ',' history ',' stats ',' gages '];
          const switchTab = (newTab) => {
            if(newTab === currentTab) return;
            window.scrollTo({top:0,behavior:' instant '});
            const oldIdx = tabOrder.indexOf(currentTab);
            const newIdx = tabOrder.indexOf(newTab);
            setTabDirection(newIdx > oldIdx ? ' r ' : ' l ');
            setPrevTab(currentTab);
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
              const tabs = [' game ', ' stats ', ' history ', ' trophies ', ' gages ', ' rules '];
              const currentIndex = tabs.indexOf(currentTab);
              if (isLeftSwipe && currentIndex < tabs.length - 1) switchTab(tabs[currentIndex + 1]);
              if (isRightSwipe && currentIndex > 0) switchTab(tabs[currentIndex - 1]);
          };

          useEffect(() => {
            let wakeLock = null;
            const requestWakeLock = async () => { if (' wakeLock ' in navigator && wakeLockEnabled) { try { wakeLock = await navigator.wakeLock.request(' screen '); } catch (err) { } } };
            if (wakeLockEnabled) requestWakeLock();
            const handleVisibilityChange = () => { if (wakeLock !== null && document.visibilityState === ' visible ' && wakeLockEnabled) requestWakeLock(); };
            document.addEventListener(' visibilitychange ', handleVisibilityChange);
            return () => { if (wakeLock !== null) wakeLock.release(); document.removeEventListener(' visibilitychange ', handleVisibilityChange); };
          }, [wakeLockEnabled]);

          useEffect(()=>{loadHistory();loadCurrentGame();loadSavedPlayers();loadGlobalStats();loadSeasons();loadGages();loadNewSettings();},[]);
          const loadNewSettings=()=>{try{const gs=localStorage.getItem(' yamsGridSkin ');if(gs)setGridSkin(gs);const pc=localStorage.getItem(' yamsPlayerColors ');if(pc)setPlayerColors(JSON.parse(pc));const cf=localStorage.getItem(' yamsCustomFont ');if(cf)setCustomFont(cf);const sgs=localStorage.getItem(' yamsShowGhost ');if(sgs)setShowGhostScores(JSON.parse(sgs));}catch(e){}};
          useEffect(()=>{localStorage.setItem(' yamsGridSkin ',gridSkin);},[gridSkin]);
          useEffect(()=>{localStorage.setItem(' yamsPlayerColors ',JSON.stringify(playerColors));},[playerColors]);
          useEffect(()=>{localStorage.setItem(' yamsShowGhost ',JSON.stringify(showGhostScores));},[showGhostScores]);
          useEffect(()=>{localStorage.setItem(' yamsCustomFont ',customFont);const f=FONT_OPTIONS[customFont];if(f&&f.url){const existing=document.getElementById(' yams - font - link ');if(existing)existing.remove();const link=document.createElement(' link ');link.id=' yams - font - link ';link.rel=' stylesheet ';link.href=f.url;document.head.appendChild(link);}document.documentElement.style.setProperty('--app - font ',f?.family||' system - ui, sans - serif ');},[customFont]);
          const loadHistory=()=>{try{const r=localStorage.getItem(' yamsHistory ');if(r){const p=JSON.parse(r);setGameHistory(Array.isArray(p)?p:[]);}}catch(e){setGameHistory([])}};
          const saveHistory=(h)=>{try{localStorage.setItem(' yamsHistory ',JSON.stringify(h));}catch(e){}};
          const loadGlobalStats=()=>{try{const xp=localStorage.getItem(' yamsGlobalXP ');if(xp)setGlobalXP(parseInt(xp));}catch(e){}};
          const loadSeasons=()=>{try{const s=localStorage.getItem(' yamsSeasons ');const a=localStorage.getItem(' yamsActiveSeason ');const d=localStorage.getItem(' yamsSeasonDesc ');if(s)setSeasons(JSON.parse(s));if(a)setActiveSeason(a);if(d)setSeasonDescriptions(JSON.parse(d));}catch(e){}};
          const loadGages=()=>{try{const cg=localStorage.getItem(' yamsCustomGages ');const edg=localStorage.getItem(' yamsEnableDefaultGages ');if(cg)setCustomGages(JSON.parse(cg));if(edg)setEnableDefaultGages(JSON.parse(edg));}catch(e){}};

          const isGameStarted=()=>Object.keys(scores).some(p=>scores[p]&&Object.keys(scores[p]).length>0);
          const isGameComplete=()=>{if(!players.length)return false;const ids=playableCats.map(c=>c.id);return players.every(p=>ids.every(id=>scores[p]?.[id]!==undefined));};

          useEffect(() => {
            const h = () => setCompactMode(window.innerWidth < 400);
            window.addEventListener(' resize ', h);
            return () => window.removeEventListener(' resize ', h);
          }, []);

          useEffect(() => {
            if(!isGameStarted() || isGameComplete()) { setIdleAvatars(false); return; }
            const timer = setTimeout(() => setIdleAvatars(true), 30000);
            setIdleAvatars(false);
            return () => clearTimeout(timer);
          }, [scores, lastPlayerToPlay]);

          useEffect(() => { localStorage.setItem(' yamsCustomGages ', JSON.stringify(customGages)); localStorage.setItem(' yamsEnableDefaultGages ', JSON.stringify(enableDefaultGages)); }, [customGages, enableDefaultGages]);

          const saveCurrentGame=(sc)=>{try{localStorage.setItem(' yamsCurrentGame ',JSON.stringify({players,scores:sc,lastPlayerToPlay,lastModifiedCell,starterName,timestamp:Date.now(), imposedOrder, fogMode, speedMode, jokers, jokerMax, jokersEnabled, diceSkin, moveLog, chaosMode, activeChaosCard, wakeLockEnabled, activeSeason}));}catch(e){}};
          const loadCurrentGame=()=>{try{const r=localStorage.getItem(' yamsCurrentGame ');if(r){const d=JSON.parse(r);if(d.players&&d.scores){setPlayers(d.players);setScores(d.scores);setLastPlayerToPlay(d.lastPlayerToPlay||null);setLastModifiedCell(d.lastModifiedCell||null);setStarterName(d.starterName || d.players[0]); setImposedOrder(d.imposedOrder||false); setFogMode(d.fogMode||false); setSpeedMode(d.speedMode||false); setJokers(d.jokers||{}); setJokerMax(d.jokerMax!==undefined?d.jokerMax:2); setJokersEnabled(d.jokersEnabled!==undefined?d.jokersEnabled:false); setDiceSkin(d.diceSkin||' classic '); setMoveLog(d.moveLog||[]); setChaosMode(d.chaosMode||false); setActiveChaosCard(d.activeChaosCard||null);
          setWakeLockEnabled(d.wakeLockEnabled !== undefined ? d.wakeLockEnabled : true);}}}catch(e){}};
          const loadSavedPlayers=()=>{try{const r=localStorage.getItem(' yamsSavedPlayers ');const av=localStorage.getItem(' yamsPlayerAvatars ');if(r)setPlayers(JSON.parse(r));if(av)setPlayerAvatars(JSON.parse(av));}catch(e){}};

          useEffect(() => { if(!isGameStarted()) { const newJokers = {}; players.forEach(p => newJokers[p] = jokerMax); setJokers(newJokers); } }, [jokerMax, players]);
          useEffect(() => { if(players.length > 0) { localStorage.setItem(' yamsSavedPlayers ', JSON.stringify(players)); if (!starterName) setStarterName(players[0]); if(!simPlayer) setSimPlayer(players[0]); const newJokers = {...jokers}; let changed = false; players.forEach(p => { if(newJokers[p] === undefined) { newJokers[p] = jokerMax; changed=true; } }); if(changed) setJokers(newJokers); } }, [players, jokerMax]);
          useEffect(() => { localStorage.setItem(' yamsPlayerAvatars ', JSON.stringify(playerAvatars)); }, [playerAvatars]);
          useEffect(() => { localStorage.setItem(' yamsGlobalXP ', globalXP.toString()); }, [globalXP]);
          useEffect(() => { localStorage.setItem(' yamsSeasons ', JSON.stringify(seasons)); localStorage.setItem(' yamsActiveSeason ', activeSeason); localStorage.setItem(' yamsSeasonDesc ', JSON.stringify(seasonDescriptions)); }, [seasons, activeSeason, seasonDescriptions]);
          useEffect(() => { let interval; if(speedMode && isGameStarted() && !isGameComplete() && !editMode) { if(timeLeft > 0) { interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000); } } return () => clearInterval(interval); }, [speedMode, timeLeft, scores, editMode]);
          useEffect(() => { setTimeLeft(30); }, [lastPlayerToPlay]);

          const updateSeasonDescription = (season, desc) => { setSeasonDescriptions(prev => ({...prev, [season]: desc})); };
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
          const getBonusProgress=p=>{ const filled=categories.filter(c=>c.upper&&scores[p]?.[c.id]!==undefined).length; if(!filled)return{status:' neutral ',message:' '}; const targets=[{id:' ones ',t:3},{id:' twos ',t:6},{id:' threes ',t:9},{id:' fours ',t:12},{id:' fives ',t:15},{id:' sixes ',t:18}]; let exp=0;targets.forEach(c=>{if(scores[p]?.[c.id]!==undefined)exp+=c.t;}); const diff=calcUpper(p)-exp; if(diff>0)return{status:' ahead ',message:`Avance: +${diff}`,color:' text - green - 400 '}; if(diff<0)return{status:' behind ',message:`Retard: ${diff}`,color:' text - red - 400 '}; return{status:' ontrack ',message:' Sur la cible ',color:' text - blue - 400 '}; };
          const getEmptyCells=p=>{if(!p)return[];return playableCats.map(c=>c.id).filter(id=>scores[p]?.[id]===undefined);};
          const playerTotals = useMemo(() => { const t = {}; players.forEach(p => { t[p] = calcTotal(p); }); return t; }, [players, scores]);
          const getWinner=()=>{if(!players.length)return[];const max=Math.max(...players.map(p=>playerTotals[p]??calcTotal(p)));const tied=players.filter(p=>calcTotal(p)===max);if(suddenDeathWinner&&tied.includes(suddenDeathWinner))return[suddenDeathWinner];return tied;};
          const getLoser=()=>{if(!players.length)return null;const winners=getWinner();const nonWinners=players.filter(p=>!winners.includes(p));if(nonWinners.length===0){const totals=players.map(p=>({name:p,score:calcTotal(p)}));const min=Math.min(...totals.map(t=>t.score));return totals.find(t=>t.score===min);}const totals=nonWinners.map(p=>({name:p,score:calcTotal(p)}));const min=Math.min(...totals.map(t=>t.score));return totals.find(t=>t.score===min);};

          const handleSuddenDeathWin=(winner,sdScores=null)=>{setSuddenDeathWinner(winner);if(sdScores){const ns={...scores};Object.entries(sdScores).forEach(([p,v])=>{if(!ns[p])ns[p]={};ns[p].suddenDeathScore=v;});setScores(ns);}setShowSuddenDeath(false);
              const sortedPlayers = players.map(p=>({name:p,score:calcTotal(p)})).sort((a,b)=>b.score-a.score);
              if(sortedPlayers.length >= 2 && sortedPlayers[0].score - sortedPlayers[1].score <= 5) {
                  setShowPhotoFinish(true);
                  setTimeout(() => { setShowPhotoFinish(false); setShowVictoryAnimation(true);setConfetti(' winner ');setTimeout(()=>{setShowVictoryAnimation(false);setShowEndGameModal(true);setConfetti(null);},3500); }, 3000);
              } else { setShowVictoryAnimation(true);setConfetti(' winner ');setTimeout(()=>{setShowVictoryAnimation(false);setShowEndGameModal(true);setConfetti(null);},3500); }
        };

        const getNextPlayer=()=>{if(!lastPlayerToPlay) {return players.includes(starterName) ? starterName : players[0];} return players[(players.indexOf(lastPlayerToPlay)+1)%players.length];};
        const isAvatarLocked = (req, stats) => { if(req === "none") return false; const [cond, val] = req.split(':
        '); const v = parseInt(val); if(!stats) return true; if(cond === ' games ') return stats.games < v; if(cond === ' wins ') return stats.wins < v; if(cond === ' yams ') return stats.yamsCount < v; if(cond === ' score ') return stats.maxScore < v; if(cond === ' lose ') return (stats.games - stats.wins) < v; if(cond === ' bonus ') return stats.bonusCount < v; return true; };

          const spinRoulette = () => {
            const nextP = getNextPlayer();
            if(!nextP) return;
            const emptyCats = playableCats.filter(c => scores[nextP]?.[c.id] === undefined);
            if(emptyCats.length === 0) return;
            let spins = 0;
            const spin = () => { setRouletteResult(emptyCats[Math.floor(Math.random()*emptyCats.length)]); spins++; if(spins < 15) setTimeout(spin, 80 + spins * 25); else vibrate(30); };
            spin();
          };
          const useJoker = (player) => { if(jokers[player] > 0) { showConfirm(`Utiliser un Joker pour ${player} ? (-10 pts)`, () => { setConfirmModal(null); setJokers({...jokers, [player]: jokers[player] - 1}); }); } };
          const handleUndo = () => { if (!undoData) return; const { player, category, previousLastPlayer, previousLastCell } = undoData; const newScores = { ...scores }; if (newScores[player]) { delete newScores[player][category]; } setScores(newScores); setLastPlayerToPlay(previousLastPlayer); setLastModifiedCell(previousLastCell); setUndoData(null); setMoveLog(moveLog.slice(0, -1)); saveCurrentGame(newScores); };

          const updateScore=(player,category,value, event)=>{
            const cellKey=`${player}-${category}`;
            if(imposedOrder && !editMode) { const pScores = scores[player] || {}; const firstEmptyIndex = playableCats.findIndex(c => pScores[c.id] === undefined); const targetIndex = playableCats.findIndex(c => c.id === category); if(targetIndex !== firstEmptyIndex) { setShowTurnWarning("Mode Ordre Imposé ! Tu dois remplir la première case vide."); setTimeout(()=>setShowTurnWarning(null),3500); return; } }
            if(!editMode) { const expectedPlayer = getNextPlayer(); if(player !== expectedPlayer) { setShowTurnWarning(`Hé non ! C' est à $ {
            expectedPlayer
        }
        de commencer!`); setTimeout(()=>setShowTurnWarning(null),3500); return; } if(lastPlayerToPlay === player && lastModifiedCell !== null) { setShowTurnWarning(` Doucement $ {
            player
        }, tu as déjà joué!`); setTimeout(()=>setShowTurnWarning(null),3500); return; } }
            if (!editMode) { setUndoData({ player, category, previousLastPlayer: lastPlayerToPlay, previousLastCell: lastModifiedCell }); setTimeout(() => setUndoData(null), 5000); }

            if(!editMode && value !== '') {
              const afterScores = {...scores,[player]:{...scores[player],[category]:parseInt(value)||0}};
              const filledAfter = players.reduce((s,p)=>s+playableCats.filter(c=>afterScores[p]?.[c.id]!==undefined).length,0);
              const totalCells = players.length * playableCats.length;
              const remaining = totalCells - filledAfter;
              if(remaining <= 3 && remaining > 0) { setShowCountdown(remaining); setTimeout(() => setShowCountdown(null), 1500); }
              if(remaining <= players.length && remaining > 0) { setTimeout(()=>{pushNotif({icon:'🏁',title:'DERNIER TOUR !',description:'Plus qu\'une case chacun !'});},800); }
            }
            const ns={...scores,[player]:{...scores[player],[category]:value===''?undefined:parseInt(value)||0}};
            const valInt = value === '' ? 0 : parseInt(value);

            if(!editMode && value !== '') { setLastCellKey(player+'-'+category); setTimeout(()=>setLastCellKey(null),2000); }

            if(value !== '') {
                const catName = categories.find(c=>c.id===category)?.name || category;
                setMoveLog([...moveLog, { player, category: catName, value: valInt, time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }]);
                setGlobalXP(prev => prev + valInt);
                if(!editMode&&valInt>=15){setStreaks(prev=>{const n=(prev[player]||0)+1;return{...prev,[player]:n};});}
                else if(!editMode){setStreaks(prev=>({...prev,[player]:0}));}
                if(moveLog.length === 0 && !editMode) { pushNotif({icon:'🩸',title:'FIRST BLOOD !',description:player+' ouvre le score avec '+valInt+' pts'}); }
                if(!editMode && valInt > 0) {
                    let prevBest = 0;
                    (gameHistory||[]).forEach(g=>{const grid=g.grid||{};if(grid[player]&&grid[player][category]!==undefined){const v=parseInt(grid[player][category])||0;if(v>prevBest)prevBest=v;}});
                    if(valInt>prevBest&&prevBest>0) pushNotif({icon:'🏅',title:'RECORD PERSO !',description:player+' bat son record sur '+catName+' ('+prevBest+' → '+valInt+')'},4500);
                }
                const catObj = categories.find(c=>c.id===category);
                if(catObj && catObj.max && valInt === catObj.max && !editMode && !showBonusFullscreen) {
                    pushNotif({icon:'💯',title:'PARFAIT !',description:player+' fait le score max sur '+catName+' !'});
                    if(event){const r=event.target.getBoundingClientRect();setShockwavePos({x:r.left+r.width/2,y:r.top+r.height/2});setTimeout(()=>setShockwavePos(null),800);}
                }
            }
            if(value !== '' && value !== '0' && event) { const td = event.target.closest ? event.target.closest('td') : event.target.parentElement; const rect = (td || event.target).getBoundingClientRect(); const id = Date.now(); const pc = getPlayerColor(player, players.indexOf(player)); setFloatingScores([...floatingScores, { id, x: rect.right - 20, y: rect.top - 10, value: valInt, color: pc.hex }]); setTimeout(() => setFloatingScores(prev => prev.filter(f => f.id !== id)), 1000); }
            if(value !== '' && event && !editMode) {
                const rect = event.target.getBoundingClientRect();
                const pc = getPlayerColor(player, players.indexOf(player));
                const newParticles = Array.from({length: valInt > 20 ? 12 : 6}, (_, i) => ({
                    id: Date.now() + i, x: rect.left + rect.width/2, y: rect.top + rect.height/2,
                    color: pc.hex, dx: (Math.random()-0.5)*120, dy: -30 - Math.random()*80
                }));
                setScoreParticles(prev => [...prev, ...newParticles]);
                setTimeout(() => setScoreParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id))), 1200);
            }
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
            } else if(value !== '' && !editMode) { setConsecutiveZeros(prev => ({...prev, [player]: 0})); }
            if(!editMode && value !== '' && (valInt >= 25 || valInt === 0 || valInt === 50)) { const q = FUN_QUOTES[Math.floor(Math.random() * FUN_QUOTES.length)]; setFunQuote(q); setTimeout(() => setFunQuote(null), 3000); }

            if(category==='yams' && value==='50'){
                setPendingYamsDetail({ player });
                setConfetti('gold'); setShakeAnimation('yams'); setShowDiceAnim(true); setEmojiRain('🎲');
                if(event){const r=event.target.getBoundingClientRect();setShockwavePos({x:r.left+r.width/2,y:r.top+r.height/2});}
                pushNotif({icon:'🎲',title:'YAMS !',description:player+' a réalisé un YAMS !'});
                setTimeout(()=>{setConfetti(null);setShakeAnimation(null);setShowDiceAnim(false);setEmojiRain(null);setShockwavePos(null);},4500);
            } else if(value==='0') {
                setConfetti('sad'); pushNotif({icon:'❌',title:'BARRÉ !',description:player+' barre '+categories.find(c=>c.id===category)?.name});
                setShakeScreen(true); setTimeout(()=>setShakeScreen(false),500);
                setGlassCrack(player+'-'+category); setTimeout(()=>setGlassCrack(null),1500);
                setEmojiRain('💀'); setTimeout(()=>setEmojiRain(null),3000);
                setTimeout(()=>setConfetti(null),4000);
            } else { setConfetti(null); }

            const oldUp=calcUpper(player);const newUp=categories.filter(c=>c.upper).reduce((s,c)=>s+(ns[player]?.[c.id]||0),0);
            if(oldUp<63&&newUp>=63){setConfetti('gold');setShowBonusFullscreen({player,type:'obtained'});setTimeout(()=>{setShowBonusFullscreen(null);setConfetti(null);},5500);}

            if(categories.find(c=>c.id===category)?.upper && value !== '') {
              const upperCats = categories.filter(c=>c.upper);
              const filledUpper = upperCats.filter(c=>ns[player]?.[c.id]!==undefined);
              const emptyUpper = upperCats.filter(c=>ns[player]?.[c.id]===undefined);
              const currentUpperSum = filledUpper.reduce((s,c)=>s+(ns[player]?.[c.id]||0),0);
              const allUpperFilled = emptyUpper.length === 0;
              if(allUpperFilled && currentUpperSum < 63) {
                setShowBonusFullscreen({player,type:'lost'}); setConfetti('sad'); setTimeout(()=>{setShowBonusFullscreen(null);setConfetti(null);},5500);
              } else if(!allUpperFilled && currentUpperSum < 63) {
                const maxPossibleRemaining = emptyUpper.reduce((s,c)=>s+(c.max||0),0);
                if(currentUpperSum + maxPossibleRemaining < 63) { setShowBonusFullscreen({player,type:'lost'}); setConfetti('sad'); setTimeout(()=>{setShowBonusFullscreen(null);setConfetti(null);},5500); }
              }
            }

            const newTotal=newUp + categories.filter(c=>c.lower).reduce((s,c)=>s+(ns[player]?.[c.id]||0),0)+(newUp>=63?35:0);
            if(newTotal>=300&&calcTotal(player)<300){setConfetti('gold');pushNotif({icon:'🌟',title:'Score Légendaire !',description:player+' a dépassé les 300 points !'});setTimeout(()=>setConfetti(null),4500);}
            if(!editMode && value !== '') {
                const playerCats = playableCats.filter(c=>ns[player]?.[c.id]!==undefined);
                if(playerCats.length === playableCats.length) {
                    const finalTotal = newTotal;
                    if(!showBonusFullscreen) { pushNotif({icon:'✅',title:'TERMINÉ !',description:player+' a rempli toute sa grille ! ('+finalTotal+' pts)'}); }
                    if(players.length >= 2) {
                        const oldLeaderScore = Math.max(...players.filter(p2=>p2!==player).map(p2=>calcTotal(p2)));
                        const wasLosing = calcTotal(player) <= oldLeaderScore;
                        if(wasLosing && finalTotal > oldLeaderScore) { setShowClutch(player); setTimeout(() => setShowClutch(null), 3000); }
                    }
                }
            }
            if(players.length>=2 && value !== '' && !editMode) {
              const oldLeader = players.reduce((best,p)=>calcTotal(p)>calcTotal(best)?p:best,players[0]);
              const newTotals = players.map(p => ({ name:p, total: categories.filter(c=>c.upper).reduce((s,c)=>s+(ns[p]?.[c.id]||0),0) + categories.filter(c=>c.lower).reduce((s,c)=>s+(ns[p]?.[c.id]||0),0) + (categories.filter(c=>c.upper).reduce((s,c)=>s+(ns[p]?.[c.id]||0),0)>=63?35:0) }));
              const newLeader = newTotals.reduce((best,p)=>p.total>best.total?p:best,newTotals[0]);
              if(newLeader.name === player && oldLeader !== player && newTotals.length > 1) {
                const wasLeading = newTotals.filter(p=>p.name!==player).some(p=>p.total<newLeader.total);
                if(wasLeading && !showBonusFullscreen) { pushNotif({icon:'🔄',title:'COMEBACK !',description:player+' prend la tête !'}); }
              }
            }
            vibrate(15); setScores(ns);saveCurrentGame(ns);
            if(!editMode) {
                if(value!==''){
                    setLastPlayerToPlay(player); setLastModifiedCell(cellKey);
                    if(chaosMode) { setActiveChaosCard(CHAOS_EVENTS[Math.floor(Math.random() * CHAOS_EVENTS.length)]); }
                    const nextP = players[(players.indexOf(player)+1)%players.length];
                    if(players.length >= 2 && !isGameComplete()) {
                        const hasYams = category==='yams' && value==='50';
                        const hasBonus = (oldUp<63&&newUp>=63) || showBonusFullscreen;
                        const hasBonusLost = categories.find(c=>c.id===category)?.upper && (() => { const uCats = categories.filter(c=>c.upper); const filled = uCats.filter(c=>ns[player]?.[c.id]!==undefined); const empty = uCats.filter(c=>ns[player]?.[c.id]===undefined); const sum = filled.reduce((s,c)=>s+(ns[player]?.[c.id]||0),0); if(empty.length===0 && sum<63) return true; if(empty.length>0) { const maxR = empty.reduce((s,c)=>s+(c.max||0),0); if(sum+maxR<63) return true; } return false; })();
                        const delay = (hasYams || hasBonus || hasBonusLost) ? 6000 : 600;
                        setTimeout(() => { if(!showBonusFullscreen && !pendingYamsDetail) { setHotSeatPlayer(nextP); setTimeout(() => setHotSeatPlayer(null), 1800); } }, delay);
                    }
                } else { setLastPlayerToPlay(null); setLastModifiedCell(null); }
            }
          };

          const saveYamsDetail = (val) => {
              if(!pendingYamsDetail) return;
              setShowDiceAnim(false); setEmojiRain(null); setShockwavePos(null);
              const { player } = pendingYamsDetail;
              const newScores = { ...scores };
              if(newScores[player]) { if(!newScores[player].yamsHistory) newScores[player].yamsHistory = []; newScores[player].yamsHistory.push(val); }
              setScores(newScores); saveCurrentGame(newScores); setPendingYamsDetail(null);
          };

          const toggleEditMode=()=>{if(!editMode){setScoresBeforeEdit(JSON.parse(JSON.stringify(scores)));setLastPlayerBeforeEdit(lastPlayerToPlay);setEditMode(true);}else{setEditMode(false);setScoresBeforeEdit(null);setLastPlayerBeforeEdit(null);}};
          const cancelEdit=()=>{if(scoresBeforeEdit!==null){setScores(scoresBeforeEdit);setLastPlayerToPlay(lastPlayerBeforeEdit);}setEditMode(false);setScoresBeforeEdit(null);setLastPlayerBeforeEdit(null);};
          const resetGame = (forcedLoserName = null) => { setPlayerEntrance(true); setTimeout(() => setPlayerEntrance(false), 2000);
              if(!forcedLoserName) { showConfirm("Commencer une nouvelle partie ?", () => { setConfirmModal(null); resetGame(forcedLoserName); }); return; }
              setScores({}); setLastPlayerToPlay(null); setLastModifiedCell(null); setShowEndGameModal(false); setMoveLog([]); setActiveChaosCard(null); setShowStudioModal(false); setSuddenDeathWinner(null); setSuddenDeathPlayers([]); setShowSuddenDeath(false); setGameEndShown(false);
              const newJokers = {}; players.forEach(p => newJokers[p] = jokerMax); setJokers(newJokers);
              if(forcedLoserName && players.includes(forcedLoserName)) { setStarterName(forcedLoserName); } else { const currentStarterIdx = players.indexOf(starterName); const nextStarter = players[(currentStarterIdx + 1) % players.length]; setStarterName(nextStarter); }
              if(chaosMode) { setActiveChaosCard(CHAOS_EVENTS[Math.floor(Math.random() * CHAOS_EVENTS.length)]); }
              saveCurrentGame({}); const ch = PARTY_CHALLENGES[Math.floor(Math.random()*PARTY_CHALLENGES.length)]; setActiveChallenge(ch);
              pushNotif({icon:ch.icon,title:'DÉFI DE LA PARTIE',description:ch.desc},5500);
              if (players.length >= 2) { setShowVSScreen(true); setTimeout(() => setShowVSScreen(false), 3000); }
          };

          const updateGameSeason = (id, newSeason) => {
             const updatedHistory = gameHistory.map(g => {
                 if (g.id !== id) return g;
                 const currentSeasons = Array.isArray(g.seasons) ? g.seasons : (g.season && g.season !== 'Aucune' ? [g.season] : []);
                 let newSeasons = currentSeasons.includes(newSeason) ? currentSeasons.filter(s => s !== newSeason) : [...currentSeasons, newSeason];
                 return { ...g, seasons: newSeasons, season: null };
             });
             setGameHistory(updatedHistory); saveHistory(updatedHistory);
          };

          useEffect(()=>{
            if(!isGameStarted()||isGameComplete()||players.length<2) return;
            const totalCells=players.length*playableCats.length;
            const filledCells=players.reduce((s,p)=>s+playableCats.filter(c=>scores[p]?.[c.id]!==undefined).length,0);
            const pct=filledCells/totalCells;
            if(pct>=0.5&&pct<0.55&&!showBonusFullscreen){
              const leader=players.reduce((best,p)=>calcTotal(p)>calcTotal(best)?p:best,players[0]);
              pushNotif({icon:'⏱️',title:'MI-TEMPS !',description:leader+' mène avec '+calcTotal(leader)+' pts'});
            }
            if(pct>=0.75&&players.length>=2){
              const sorted=players.map(p=>calcTotal(p)).sort((a,b)=>b-a);
              if(sorted[0]-sorted[1]<=20) setTensionMode(true); else setTensionMode(false);
            } else { setTensionMode(false); }
          },[scores]);

          useEffect(()=>{if(isGameComplete()&&!showEndGameModal&&!showSuddenDeath&&!gameEndShown&&!showVictoryAnimation){
            setGameEndShown(true);
            if(activeChallenge){players.forEach(p=>{try{const grid=scores[p]||{};const total=calcTotal(p);if(activeChallenge.check(grid,total))pushNotif({icon:'🏆',title:'DÉFI RÉUSSI !',description:p+' : '+activeChallenge.desc},5500);}catch(e){}});}
            const winners = getWinner();
            if(winners.length > 1 && players.length > 1) {
              setSuddenDeathPlayers(winners); setSuddenDeathWinner(null); setShowSuddenDeath(true); setConfetti('gold'); setTimeout(()=>setConfetti(null),3000);
            } else { setShowVictoryAnimation(true);setConfetti('winner');setTimeout(()=>{setShowVictoryAnimation(false);setShowEndGameModal(true);setConfetti(null);},3500); }
          }},[scores,showEndGameModal,showSuddenDeath]);

          useEffect(() => {
            if (showEndGameModal && !currentGage) {
                let pool = [];
                if (enableDefaultGages) pool = [...pool, ...DEFAULT_GAGES];
                if (customGages && customGages.length > 0) { const activeCustoms = customGages.filter(g => g.active).map(g => g.text); pool = [...pool, ...activeCustoms]; }
                if (pool.length > 0) { setCurrentGage(pool[Math.floor(Math.random() * pool.length)]); } else { setCurrentGage("Aucun gage sélectionné !"); }
            } else if (!showEndGameModal) { setCurrentGage(null); }
          }, [showEndGameModal, customGages, enableDefaultGages]);

          const saveGameFromModal=()=>{
              const w=getWinner(); const l=getLoser();
              const currentSeasons = activeSeason && activeSeason !== 'Aucune' ? [activeSeason] : [];
              const game={id:Date.now(),seasons:currentSeasons,date:new Date().toLocaleDateString('fr-FR'),time:new Date().toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}),players:players.map(p=>({name:p,score:calcTotal(p),isWinner:w.includes(p),yamsCount:scores[p]?.yams===50?1:0,suddenDeathWin:suddenDeathWinner===p,suddenDeathScore:scores[p]?.suddenDeathScore||null})), grid: JSON.parse(JSON.stringify(scores)), moveLog: JSON.parse(JSON.stringify(moveLog)), suddenDeath: suddenDeathWinner ? true : false, suddenDeathWinner: suddenDeathWinner || null, note: gameNote || null};
              const nh=[game,...gameHistory]; setGameHistory(nh); saveHistory(nh);
              setGlobalXP(prev => prev + 100); setGameNote(''); resetGame(l ? l.name : null);
          };
          const deleteGame= id=>{const nh=gameHistory.filter(g=>g.id!==id);setGameHistory(nh);saveHistory(nh);};
          const exportData=()=>{const b=new Blob([JSON.stringify({gameHistory,exportDate:new Date().toISOString(),version:'1.0'},null,2)],{type:'application/json'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='yams-backup-'+new Date().toISOString().split('T')[0]+'.json';document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(u);};
          const importData=e=>{const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=ev=>{try{const d=JSON.parse(ev.target.result);if(d.gameHistory&&Array.isArray(d.gameHistory)){setGameHistory(d.gameHistory);saveHistory(d.gameHistory);alert('Parties importées avec succès!');}else alert('Fichier invalide');}catch(err){alert('Erreur lors de l\'import');}};reader.readAsText(file);};

          const dynamicBgStyle = useMemo(()=>{
            if(!isGameStarted()||isGameComplete()) return {};
            const totalCells=players.length*playableCats.length;
            if(totalCells===0) return {};
            const filled=players.reduce((s,p)=>s+playableCats.filter(c=>scores[p]?.[c.id]!==undefined).length,0);
            const pct=filled/totalCells;
            const maxScore=Math.max(...players.map(p=>calcTotal(p)),1);
            const breathIntensity = Math.round(pct * 8);
            if(maxScore>=300) return {boxShadow:'inset 0 0 200px rgba(250,204,21,0.04)',animation:` bg - breathe $ {
            3 - pct
        }
        s ease - in - out infinite `};
            if(tensionMode) return {boxShadow:'inset 0 0 200px rgba(239,68,68,0.06)',animation:'bg-breathe 1.5s ease-in-out infinite'};
            if(pct>0.75) return {boxShadow:'inset 0 0 200px rgba(249,115,22,0.04)',animation:'bg-breathe 2s ease-in-out infinite'};
            if(pct>0.25) return {animation:` bg - breathe $ {
            4 - pct * 2
        }
        s ease - in - out infinite `};
            return {};
          },[scores,tensionMode,players]);

          const allSeasons = useMemo(() => {
              const set = new Set(seasons);
              (gameHistory||[]).forEach(g => {
                  const gs = Array.isArray(g.seasons) ? g.seasons : (g.season ? [g.season] : []);
                  gs.forEach(s => { if(s && s !== 'Aucune') set.add(s); });
              });
              return [...set];
          }, [seasons, gameHistory]);

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

          const playerStats = useMemo(() => {
              if (!filteredHistory || !Array.isArray(filteredHistory)) return [];
              const stats = {}; const streaks = {}; const isStreaking = {}; const allPlayerNames = new Set();
              filteredHistory.forEach(g => (g.players||g.results||[]).forEach(p => allPlayerNames.add(p.name)));
              allPlayerNames.forEach(name => {
                  stats[name] = { wins:0, games:0, maxScore:0, totalScore:0, yamsCount:0, maxConsecutiveWins:0, bonusCount:0, upperSum:0, lowerSum:0, historyGames:0, totalOnes:0, totalTwos:0, totalThrees:0, totalFours:0, totalFives:0, totalSixes:0 };
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
                          s.totalOnes += parseInt(gameGrid[p.name]['ones']||0); s.totalTwos += parseInt(gameGrid[p.name]['twos']||0); s.totalThrees += parseInt(gameGrid[p.name]['threes']||0); s.totalFours += parseInt(gameGrid[p.name]['fours']||0); s.totalFives += parseInt(gameGrid[p.name]['fives']||0); s.totalSixes += parseInt(gameGrid[p.name]['sixes']||0);
                      }
                      if (isStreaking[p.name]) { if (p.isWinner) streaks[p.name]++; else isStreaking[p.name] = false; }
                  });
              });
              const tempStreaks = {}; allPlayerNames.forEach(n => tempStreaks[n] = 0); for(let i=filteredHistory.length-1; i>=0; i--){ const game = filteredHistory[i]; const participants = game.players || game.results || []; participants.forEach(p => { if(!stats[p.name]) return; if(p.isWinner) { tempStreaks[p.name] = (tempStreaks[p.name] || 0) + 1; if(tempStreaks[p.name] > stats[p.name].maxConsecutiveWins) stats[p.name].maxConsecutiveWins = tempStreaks[p.name]; } else { tempStreaks[p.name] = 0; } }); } return Object.entries(stats).map(([name,d])=>({ name, ...d, avgScore: d.games > 0 ? Math.round(d.totalScore/d.games) : 0, currentStreak: streaks[name], bonusRate: d.historyGames > 0 ? Math.round((d.bonusCount/d.historyGames)*100) : 0, avgUpper: d.historyGames > 0 ? Math.round(d.upperSum/d.historyGames) : 0, avgLower: d.historyGames > 0 ? Math.round(d.lowerSum/d.historyGames) : 0 })).sort((a,b)=>b.wins-a.wins);
          }, [filteredHistory]);

          const hallOfFame = useMemo(() => { if(!filteredHistory || filteredHistory.length < 2) return null; let biggestWin = { gap: -1 }; let tightestWin = { gap: 9999 }; let lowestWinner = { score: 9999 }; let highestLoser = { score: -1 }; filteredHistory.forEach(g => { const parts = [...(g.players || g.results || [])].sort((a,b) => b.score - a.score); if(parts.length < 2) return; const winner = parts[0]; const second = parts[1]; const gap = winner.score - second.score; if(gap > biggestWin.gap) biggestWin = { gap, winner: winner.name, second: second.name, date: g.date }; if(gap < tightestWin.gap) tightestWin = { gap, winner: winner.name, second: second.name, date: g.date }; if(winner.score < lowestWinner.score) lowestWinner = { score: winner.score, name: winner.name, date: g.date }; if(second.score > highestLoser.score) highestLoser = { score: second.score, name: second.name, date: g.date }; }); return { biggestWin, tightestWin, lowestWinner, highestLoser }; }, [filteredHistory]);
          const getPieData = () => playerStats.filter(s=>s.wins>0).map(s=>({name:s.name,value:s.wins}));
          const isFoggy = (p) => fogMode && !isGameComplete() && getNextPlayer() !== p;
          const getLeader = () => { if(isGameComplete() || hideTotals || fogMode) return null; const totals = players.map(p => ({name: p, score: calcTotal(p)})); const max = Math.max(...totals.map(t => t.score)); if(max === 0) return null; const leaders = totals.filter(t => t.score === max); if (leaders.length > 1) return null; return leaders[0].name; };
          const leader = getLeader();
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

          const getRank = (playerName) => {
            const scoresList = players.map(p => ({ name: p, score: calcTotal(p) }));
            scoresList.sort((a, b) => b.score - a.score);
            const myScore = scoresList.find(s => s.name === playerName)?.score || 0;
            const rank = scoresList.filter(s => s.score > myScore).length + 1;
            return rank;
          };

          const calculateGlobalFailures = (target) => {
            const failures = {};
            playableCats.forEach(cat => failures[cat.id] = 0);
            let totalGames = 0;

            if (!filteredHistory || filteredHistory.length === 0) return { failures: [], totalGames: 0 };

            filteredHistory.forEach(game => {
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

          const predictFinalScore = (player) => {
              const pStat = playerStats.find(s => s.name === player);
              const filledCats = playableCats.filter(c => scores[player]?.[c.id] !== undefined);
              const emptyCats = playableCats.filter(c => scores[player]?.[c.id] === undefined);
              if (filledCats.length === 0) return pStat ? pStat.avgScore : null;
              if (emptyCats.length === 0) return calcTotal(player);
              const currentScore = filledCats.reduce((s, c) => s + (scores[player]?.[c.id] || 0), 0);
              const avgPerCat = currentScore / filledCats.length;
              let predictedRemaining = 0;
              emptyCats.forEach(cat => {
                  let catAvg = 0; let catCount = 0;
                  (gameHistory || []).forEach(g => { const grid = g.grid || {}; if (grid[player] && grid[player][cat.id] !== undefined) { catAvg += parseInt(grid[player][cat.id]) || 0; catCount++; } });
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

          const getPlayerColor = (player, idx) => {
              if (playerColors[player]) return PLAYER_COLORS.find(c => c.id === playerColors[player]) || PLAYER_COLORS[idx % PLAYER_COLORS.length];
              return PLAYER_COLORS[idx % PLAYER_COLORS.length];
          };

          const getPlayerWeather = (player) => {
              if (!weatherEffects || !isGameStarted() || isGameComplete() || players.length < 2) return 'neutral';
              const rank = getRank(player);
              const totalPlayers = players.length;
              const totals = players.map(p => calcTotal(p)).sort((a, b) => b - a);
              const gap = totals[0] - totals[totals.length - 1];
              if (tensionMode) return 'storm';
              if (rank === 1 && gap > 30) return 'sunny';
              if (rank === 1) return 'clear';
              if (rank === totalPlayers && gap > 30) return 'rain';
              if (rank === totalPlayers) return 'cloudy';
              return 'neutral';
          };
          if(replayGame) { const replayPlayers = Object.keys(replayGame.grid || {}); return ( <div className={'min-h-screen bg-gradient-to-br '+T.bg+' p-2 sm:p-4 md:p-6'} style={{fontFamily: FONT_OPTIONS[customFont]?.family || 'system-ui, sans-serif'}}> <div className="max-w-7xl mx-auto space-y-4"> <div className={'bg-gradient-to-br '+T.card+' backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-6 flex justify-between items-center'}> <div className="flex items-center gap-4"> <button onClick={stopPlayback} className="p-2 bg-white/10 rounded-full hover:bg-white/20"><ArrowLeft /></button> <div><h2 className="text-xl font-bold text-white">Replay du {replayGame.date}</h2><p className="text-sm text-gray-400">Lecture seule</p></div> </div> {replayGame.moveLog && <button onClick={playTimelapse} disabled={isReplaying} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2">{isReplaying ? <Pause size={18}/> : <Play size={18}/>} Timelapse</button>} </div> <div className={'bg-gradient-to-br '+T.card+' backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-4 overflow-x-auto'}> <table className="w-full table-fixed"> <thead><tr className="border-b border-white/20"><th className="text-left p-3 text-white">Catégorie</th>{replayPlayers.map(p=><th key={p} className="p-3 text-center text-white">{p}</th>)}</tr></thead> <tbody>{categories.map(cat => {if(cat.upperHeader || cat.upperDivider || cat.divider) return null;if(cat.upperTotal || cat.bonus || cat.upperGrandTotal || cat.lowerTotal) return null;return (<tr key={cat.id} className="border-b border-white/10 hover:bg-white/5"><td className="p-3 text-gray-300 font-bold">{cat.name}</td>{replayPlayers.map(p => (<td key={p} className="p-2 text-center font-bold text-white">{(replayGame.grid && replayGame.grid[p] && replayGame.grid[p][cat.id] !== undefined) ? replayGame.grid[p][cat.id] : '-'}</td>))}</tr>);})}<tr className="bg-white/10 font-black"><td className="p-4 text-white">TOTAL</td>{replayPlayers.map(p=><td key={p} className="p-4 text-center text-white text-xl">{getSafeReplayScore(p, replayGame.grid)}</td>)}</tr></tbody> </table> </div> </div> </div> ); }

          if(showSplash) {
            const totalGames = gameHistory.length;
            const leader = playerStats.length > 0 ? playerStats.reduce((a,b)=>a.wins>b.wins?a:b) : null;
            const lastGame = gameHistory.length > 0 ? gameHistory[gameHistory.length-1] : null;
            const funStat = getSplashFunStat(gameHistory, playerStats);
            const xpLevel = getXPLevel(globalXP);
            return (
              <div className={'min-h-screen bg-gradient-to-br '+T.bg+' flex flex-col items-center justify-center p-6 relative overflow-hidden'}>
                <div className="absolute inset-0 overflow-hidden pointer-events-none">{Array.from({length:20},(_,i)=>i).map(i=><div key={i} className="absolute text-4xl opacity-[0.04]" style={{left:Math.random()*100+'%',top:Math.random()*100+'%',animation:` splash - dice 1.5s ease - out $ {
            i * 0.15
        }
        s backwards `,transform:` rotate($ {
            i * 45
        }
            deg)`}}>🎲</div>)}</div>
                <div className="relative z-10 text-center">
                  <div className="text-8xl sm:text-9xl mb-4" style={{animation:'splash-logo 0.8s cubic-bezier(0.34,1.56,0.64,1)'}}>🎲</div>
                  <h1 className="text-5xl sm:text-7xl font-black text-white mb-2" style={{animation:'splash-text 0.6s ease-out 0.3s backwards'}}>YAMS</h1>
                  <p className="text-lg font-bold mb-4 opacity-60" style={{color:T.primary,animation:'splash-text 0.5s ease-out 0.5s backwards'}}>Ultimate Scorekeeper</p>
                  {globalXP > 0 && <div className="mb-6 max-w-xs mx-auto" style={{animation:'splash-stat 0.4s ease-out 0.6s backwards'}}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-400 font-bold">{xpLevel.icon} Niv.{xpLevel.level} {xpLevel.name}</span>
                      <span className="font-bold" style={{color:T.primary}}>{globalXP} XP</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full rounded-full xp-bar-fill" style={{width:xpLevel.progress+'%',background:` linear - gradient(90deg, $ {
            T.primary
        }, $ {
            T.secondary
        })`,['--xp-width']:xpLevel.progress+'%'}}/>
                    </div>
                    {xpLevel.next && <div className="text-[9px] text-gray-500 mt-1 text-right">{xpLevel.next.xp - globalXP} XP → Niv.{xpLevel.next.level}</div>}
                  </div>}
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
                  <button onClick={()=>setShowSplash(false)} className="px-10 py-4 rounded-2xl font-black text-xl text-white transition-all hover:scale-105 active:scale-95 shadow-2xl" style={{background:` linear - gradient(135deg, $ {
            T.primary
        }, $ {
            T.secondary
        })`,animation:'splash-btn 0.5s cubic-bezier(0.34,1.56,0.64,1) 1.1s backwards',boxShadow:` 0 10px 40px $ {
            T.primary
        }
        40 `}}>🎮 Jouer</button>
                  <div className="mt-6 flex justify-center gap-3 flex-wrap" style={{animation:'splash-btn 0.3s ease-out 1.4s backwards'}}>
                    {Object.entries(THEMES_CONFIG).map(([k,v])=><button key={k} onClick={()=>setTheme(k)} className={'w-8 h-8 rounded-full border-2 transition-all hover:scale-110 '+(theme===k?'border-white scale-110':'border-white/20')} style={{background:v.primary}} title={v.name}/>)}
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEndHandler} className={'min-h-screen bg-gradient-to-br '+T.bg+' p-2 sm:p-4 md:p-6 overflow-x-hidden transition-opacity duration-500 ease-in-out '+(themeTransition?'opacity-0':'opacity-100')+(tensionMode?' tension-pulse':'')} style={{...dynamicBgStyle, fontFamily: FONT_OPTIONS[customFont]?.family || 'system-ui, sans-serif'}}>
              <InteractiveParticles themeKey={theme}/>
              {/* VS FIGHTING SCREEN */}
              {showVSScreen&&players.length>=2&&<div className="fixed inset-0 z-[300] bg-black flex items-center justify-center overflow-hidden" style={{animation:'cinema-darken 0.3s ease-out'}}>
                <div className="absolute inset-0" style={{background:` linear - gradient(135deg, $ {
            getPlayerColor(players[0], 0).hex
        }
            20, black, $ {
            getPlayerColor(players[1], 1).hex
        }
            20)`}}/>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><div className="text-9xl font-black text-white opacity-10" style={{animation:'vs-flash 0.5s ease-out 0.3s backwards'}}>⚡</div></div>
                <div className="relative z-10 flex items-center justify-center gap-4 sm:gap-8 w-full px-4">
                  <div className="flex-1 text-center" style={{animation:'vs-slide-left 0.5s cubic-bezier(0.34,1.56,0.64,1)'}}>
                    <div className="text-6xl sm:text-8xl mb-3" style={{filter:` drop - shadow(0 0 20px $ {
            getPlayerColor(players[0], 0).hex
        })`}}>{playerAvatars[players[0]]||'👤'}</div>
                    <div className="text-white font-black text-lg sm:text-2xl truncate">{players[0]}</div>
                    <div className="text-xs font-bold mt-1" style={{color:getPlayerColor(players[0],0).hex}}>{(()=>{const t=getPlayerTitle(playerStats.find(s=>s.name===players[0]));return t?t.icon+' '+t.title:'🆕 Nouveau';})()}</div>
                  </div>
                  <div className="flex flex-col items-center" style={{animation:'vs-text 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.2s backwards'}}>
                    <div className="text-4xl sm:text-6xl font-black text-white" style={{textShadow:'0 0 40px rgba(255,255,255,0.5)',letterSpacing:'0.1em'}}>VS</div>
                    {players.length>2&&<div className="text-gray-500 text-xs mt-2 font-bold">+{players.length-2} joueur{players.length>3?'s':''}</div>}
                  </div>
                  <div className="flex-1 text-center" style={{animation:'vs-slide-right 0.5s cubic-bezier(0.34,1.56,0.64,1)'}}>
                    <div className="text-6xl sm:text-8xl mb-3" style={{filter:` drop - shadow(0 0 20px $ {
            getPlayerColor(players[1], 1).hex
        })`}}>{playerAvatars[players[1]]||'👤'}</div>
                    <div className="text-white font-black text-lg sm:text-2xl truncate">{players[1]}</div>
                    <div className="text-xs font-bold mt-1" style={{color:getPlayerColor(players[1],1).hex}}>{(()=>{const t=getPlayerTitle(playerStats.find(s=>s.name===players[1]));return t?t.icon+' '+t.title:'🆕 Nouveau';})()}</div>
                  </div>
                </div>
                <div className="absolute bottom-12 left-0 right-0 text-center" style={{animation:'vs-fight 0.3s cubic-bezier(0.34,1.56,0.64,1) 0.6s backwards'}}>
                  <span className="text-2xl font-black tracking-[0.3em] uppercase" style={{background:` linear - gradient(90deg, $ {
            getPlayerColor(players[0], 0).hex
        }, #fff, $ {
            getPlayerColor(players[1], 1).hex
        })`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>C'est parti !</span>
                </div>
              </div>}

              {/* MODAL YAMS DETAIL */}
              {pendingYamsDetail && (
                <div className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4 modal-backdrop">
                    <div className="modal-content bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-yellow-500/50 rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl shadow-yellow-500/20 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl"></div>
                        <div className="text-5xl mb-3" style={{animation:'trophy-float 3s ease-in-out infinite'}}>{({modern:'🎲',sunset:'🌅',ocean:'🌊',forest:'🌲',galaxy:'🌌',candy:'🍬',fire:'🔥',ice:'❄️',neon:'💜',vintage:'🎰'})[theme]||'🎲'}</div>
                        <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-wide winner-glow">YAMS !</h3>
                        <p className="text-gray-400 text-sm mb-6 font-medium">Quel chiffre as-tu obtenu ?</p>
                        <div className="grid grid-cols-3 gap-3 mb-4">
                            {[1, 2, 3, 4, 5, 6].map(val => (
                                <button key={val} onClick={() => saveYamsDetail(val)} className="aspect-square bg-white/5 hover:bg-yellow-500/20 border border-white/10 hover:border-yellow-500/50 rounded-2xl flex items-center justify-center text-3xl transition-all duration-300 hover:scale-110 active:scale-95 group hover:shadow-lg hover:shadow-yellow-500/20" style={{animation:` bounce - in 0.4s cubic - bezier(0.34, 1.56, 0.64, 1)$ {
            val * 0.06
        }
        s backwards `}}>
                                    <span className="group-hover:scale-125 transition-transform duration-300">{['','⚀','⚁','⚂','⚃','⚄','⚅'][val]}</span>
                                </button>
                            ))}
                        </div>
                        <div className="text-[10px] text-gray-500 italic">Cela servira pour tes statistiques futures !</div>
                    </div>
                </div>
              )}

              {floatingScores.map(fs => <FloatingScore key={fs.id} x={fs.x} y={fs.y} value={fs.value} color={fs.color} />)}
              {confetti&&confetti!=='sad'&&<div className="fixed inset-0 pointer-events-none z-[9998] overflow-hidden" style={confetti==='winner'?{filter:` hue - rotate($ {
            (() => {
                const w = getWinner()[0];
                const pc = getPlayerColor(w, players.indexOf(w));
                return pc?.hue || 0;
            })()
        }
            deg)`}:{}}>{[...Array(60)].map((_,i)=>{const tc=THEME_CONFETTI[theme]||THEME_CONFETTI.modern;const pool=(confetti==='gold'||confetti==='winner')?[...tc,'🎉','🎊','🏆']:confetti==='bonus'?[...tc,'🎁','💰']:tc;return <div key={i} className="confetti-piece" style={{left:Math.random()*100+'%',top:'-30px',fontSize:(18+Math.random()*16)+'px',animation:` confetti - fall $ {
            2.5 + Math.random() * 3
        }
        s linear $ {
            Math.random() * 2.5
        }
        s both `}}>{pool[Math.floor(Math.random()*pool.length)]}</div>;})}</div>}
              {confetti==='sad'&&<div className="fixed inset-0 pointer-events-none z-[9998] flex items-center justify-center"><div className="text-9xl" style={{animation:'sad-pulse 1.5s ease-in-out infinite'}}>❌</div></div>}

              {showCountdown&&<div className="fixed inset-0 z-[280] flex items-center justify-center pointer-events-none">
                <div className="text-center" style={{animation:'countdown-pop 1.2s cubic-bezier(0.34,1.56,0.64,1)'}}>
                  <div className="text-[12rem] font-black text-white leading-none" style={{textShadow:'0 0 80px rgba(250,204,21,0.5), 0 0 120px rgba(250,204,21,0.3)',animation:'countdown-pulse 0.4s ease-in-out'}}>{showCountdown}</div>
                  <div className="text-xl font-black text-yellow-400 uppercase tracking-[0.5em] mt-4" style={{animation:'fade-in-scale 0.3s ease-out 0.2s backwards'}}>{showCountdown===1?'DERNIÈRE CASE':'CASES RESTANTES'}</div>
                </div>
              </div>}

              {showClutch&&<div className="fixed inset-0 z-[270] flex items-center justify-center pointer-events-none" style={{animation:'clutch-flash 3s ease-out forwards'}}>
                <div className="text-center">
                  <div className="text-8xl mb-4" style={{animation:'clutch-icon 0.6s cubic-bezier(0.34,1.56,0.64,1)'}}>⚡</div>
                  <div className="text-5xl sm:text-6xl font-black text-yellow-400 tracking-wider" style={{textShadow:'0 0 40px rgba(250,204,21,0.6)',animation:'clutch-text 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.2s backwards'}}>CLUTCH !</div>
                  <div className="text-xl font-bold text-white mt-2" style={{animation:'fade-in-scale 0.4s ease-out 0.4s backwards'}}>{showClutch} renverse la table !</div>
                </div>
              </div>}

              {showPhotoFinish&&<div className="fixed inset-0 z-[270] flex items-center justify-center bg-black/90 pointer-events-none" style={{animation:'photo-flash 3s ease-out forwards'}}>
                <div className="text-center">
                  <div className="text-8xl mb-4" style={{animation:'photo-camera 1s ease-in-out infinite'}}>📸</div>
                  <div className="text-5xl sm:text-6xl font-black text-white tracking-widest" style={{animation:'photo-text 0.6s cubic-bezier(0.34,1.56,0.64,1)'}}>PHOTO FINISH</div>
                  <div className="text-xl font-bold text-yellow-400 mt-3" style={{animation:'fade-in-scale 0.4s ease-out 0.3s backwards'}}>Écart ≤ 5 pts !</div>
                  <div className="flex justify-center gap-6 mt-6">{players.map(p=>({name:p,score:calcTotal(p)})).sort((a,b)=>b.score-a.score).slice(0,2).map((p,i)=>
                    <div key={p.name} className="text-center" style={{animation:` fade - in - scale 0.4s ease - out $ {
            0.5 + i * 0.2
        }
        s backwards `}}>
                      <div className="text-4xl mb-1">{playerAvatars[p.name]||'👤'}</div>
                      <div className="text-white font-black text-lg">{p.name}</div>
                      <div className="text-3xl font-black" style={{color:i===0?'#fbbf24':'#94a3b8'}}>{p.score}</div>
                    </div>
                  )}</div>
                </div>
              </div>}

              {hotSeatPlayer&&<div className="fixed inset-0 z-[250] flex items-center justify-center pointer-events-none" style={{animation:'hotseat-in 0.3s ease-out'}}>
                <div className="text-center" style={{animation:'hotseat-pulse 1.5s ease-in-out'}}>
                  <div className="text-6xl mb-2" style={{animation:'hotseat-bell 0.4s ease-in-out 0.2s both'}}>🔔</div>
                  <div className="text-xl font-black text-white/80 mb-1 tracking-widest uppercase">À ton tour</div>
                  <div className="text-5xl sm:text-7xl font-black text-white" style={{textShadow:` 0 0 40px $ {
            getPlayerColor(hotSeatPlayer, players.indexOf(hotSeatPlayer)).hex
        }
        `,animation:'hotseat-name 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.1s backwards'}}>{playerAvatars[hotSeatPlayer]||'👤'} {hotSeatPlayer}</div>
                </div>
              </div>}

              {massacreScreen&&<div className="fixed inset-0 z-[260] flex items-center justify-center bg-black/80 pointer-events-none" style={{animation:'massacre-in 0.3s ease-out'}}>
                <div className="text-center" style={{animation:'massacre-shake 0.5s ease-in-out'}}>
                  <div className="text-9xl mb-4" style={{animation:'massacre-skull 0.6s cubic-bezier(0.34,1.56,0.64,1)',filter:` drop - shadow(0 0 30px $ {
            massacreScreen.variant === 'legendary' ? 'rgba(168,85,247,0.8)' : massacreScreen.variant === 'apocalypse' ? 'rgba(249,115,22,0.8)' : 'rgba(239,68,68,0.8)'
        })`}}>{massacreScreen.variant==='legendary'?'☠️':massacreScreen.variant==='apocalypse'?'🌋':'💀'}</div>
                  <div className={` text - 4xl sm:
        text - 5xl font - black tracking - widest $ {
            massacreScreen.variant === 'legendary' ? 'text-purple-400' : massacreScreen.variant === 'apocalypse' ? 'text-orange-400' : 'text-red-500'
        }
        `} style={{textShadow:'0 0 20px currentColor',animation:'massacre-text 0.4s ease-out 0.2s backwards'}}>{massacreScreen.variant==='legendary'?'LÉGENDAIRE...MENT NUL':massacreScreen.variant==='apocalypse'?'APOCALYPSE':'MASSACRE'}</div>
                  <div className="text-lg text-red-300 font-bold mt-2">{massacreScreen.player} enchaîne les zéros !</div>
                </div>
              </div>}

              {scoreParticles.length>0&&<div className="fixed inset-0 pointer-events-none z-[80]">{scoreParticles.map(p=><div key={p.id} className="absolute w-2 h-2 rounded-full" style={{left:p.x,top:p.y,backgroundColor:p.color,animation:'score-particle 1s ease-out forwards',['--dx']:p.dx+'px',['--dy']:p.dy+'px',boxShadow:` 0 0 6px $ {
            p.color
        }
        `}}/>)}</div>}

              {funQuote&&<div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[90] pointer-events-none" style={{animation:'funquote-in 0.4s cubic-bezier(0.34,1.56,0.64,1)'}}>
                <div className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-3 max-w-sm text-center"><span className="text-white text-sm font-bold italic">{funQuote}</span></div>
              </div>}

              {weatherEffects&&isGameStarted()&&!isGameComplete()&&(()=>{
                const hasRain = players.some(p=>getPlayerWeather(p)==='rain');
                const hasStorm = players.some(p=>getPlayerWeather(p)==='storm');
                const hasSunny = players.some(p=>getPlayerWeather(p)==='sunny');
                return <>
                  {(hasRain||hasStorm)&&<div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden opacity-30">{Array.from({length:hasStorm?40:20},(_,i)=>i).map(i=><div key={i} className="absolute bg-blue-400/60 rounded-full" style={{left:Math.random()*100+'%',top:'-10px',width:'1px',height:'15px',animation:` weather - rain $ {
            0.5 + Math.random() * 0.5
        }
        s linear $ {
            Math.random() * 2
        }
        s infinite `}}/>)}</div>}
          {hasStorm&&<div className="fixed inset-0 pointer-events-none z-[5]" style={{animation:'weather-lightning 4s ease-in-out infinite'}}/>}
          {hasSunny&&<div className="fixed top-0 right-0 w-40 h-40 pointer-events-none z-[5] opacity-20" style={{background:'radial-gradient(circle,rgba(250,204,21,0.4),transparent 70%)',animation:'weather-sun 3s ease-in-out infinite'}}/>}
        </>;
      })()}
      <style>{`
         @ import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@700&display=swap');
         * {
            font - family: 'Outfit',
            sans - serif;
        }
         @ keyframes fall {
            0 % {
                transform: translateY(0)rotate(0);
                opacity: 1
            }
            100 % {
                transform: translateY(110vh)rotate(720deg);
                opacity: 0
            }
        }
         @ keyframes shake {
            0 % ,
            100 % {
                transform: translateX(0)
            }
            10 % ,
            30 % ,
            50 % ,
            70 % ,
            90 % {
                transform: translateX(-8px)
            }
            20 % ,
            40 % ,
            60 % ,
            80 % {
                transform: translateX(8px)
            }
        }
        .shake - animation {
            animation: shake 0.5s ease - in - out;
        }
         @ keyframes notif - enter {
            0 % {
                transform: translateX(120 % )scale(0.8);
                opacity: 0
            }
            60 % {
                transform: translateX(-8px)scale(1.02)
            }
            100 % {
                transform: translateX(0)scale(1);
                opacity: 1
            }
        }
        .slide - in - right {
            animation: notif - enter 0.6s cubic - bezier(0.34, 1.56, 0.64, 1);
        }
         @ keyframes tab - slide {
            from {
                transform: translateY(10px);
                opacity: 0
            }
            to {
                transform: translateY(0);
                opacity: 1
            }
        }
         @ keyframes stagger - in {
            from {
                transform: translateY(12px)scale(0.97);
                opacity: 0
            }
            to {
                transform: translateY(0)scale(1);
                opacity: 1
            }
        }
         @ keyframes score - pop {
            0 % {
                transform: scale(1)
            }
            50 % {
                transform: scale(1.15)
            }
            100 % {
                transform: scale(1)
            }
        }
        .score - pop {
            animation: score - pop 0.3s cubic - bezier(0.34, 1.56, 0.64, 1)
        }
         @ keyframes slide - down {
            from {
                transform: translateY(-20px);
                opacity: 0
            }
            to {
                transform: translateY(0);
                opacity: 1
            }
        }
        .slide - down {
            animation: slide - down 0.4s ease - out
        }
         @ keyframes subtle - pulse {
            0 % ,
            100 % {
                opacity: 0.7
            }
            50 % {
                opacity: 1
            }
        }
        .subtle - pulse {
            animation: subtle - pulse 2s ease - in - out infinite
        }
         @ keyframes scale - in {
            from {
                transform: scale(0.85);
                opacity: 0
            }
            to {
                transform: scale(1);
                opacity: 1
            }
        }
         @ keyframes rotate - in {
            from {
                transform: rotate(-5deg)scale(0.9);
                opacity: 0
            }
            to {
                transform: rotate(0)scale(1);
                opacity: 1
            }
        }
         @ keyframes elastic - in {
            0 % {
                transform: scale(0)
            }
            43 % {
                transform: scale(1.1)
            }
            65 % {
                transform: scale(0.97)
            }
            82 % {
                transform: scale(1.01)
            }
            100 % {
                transform: scale(1)
            }
        }
         @ keyframes ripple {
            0 % {
                box - shadow: 0 0 0 0 rgba(255, 255, 255, 0.15)
            }
            100 % {
                box - shadow: 0 0 0 15px rgba(255, 255, 255, 0)
            }
        }
         @ keyframes count - up {
            from {
                transform: translateY(10px);
                opacity: 0
            }
            to {
                transform: translateY(0);
                opacity: 1
            }
        }
         @ keyframes flip - in {
            0 % {
                transform: perspective(400px)rotateX(30deg);
                opacity: 0
            }
            100 % {
                transform: perspective(400px)rotateX(0);
                opacity: 1
            }
        }
         @ keyframes hover - float {
            0 % ,
            100 % {
                transform: translateY(0)
            }
            50 % {
                transform: translateY(-4px)
            }
        }
        .hover - float: hover {
            animation: hover - float 1s ease - in - out infinite
        }
        .animate - ripple: active {
            animation: ripple 0.6s ease - out
        }
        .flip - in {
            animation: flip - in 0.5s cubic - bezier(0.25, 0.46, 0.45, 0.94)
        }
        .elastic - in {
            animation: elastic - in 0.6s ease - out
        }
        .rotate - in {
            animation: rotate - in 0.4s ease - out
        }
        .scale - in {
            animation: scale - in 0.35s ease - out
        }
         @ keyframes card - appear {
            0 % {
                transform: translateY(20px)scale(0.95);
                opacity: 0;
                filter: blur(4px)
            }
            100 % {
                transform: translateY(0)scale(1);
                opacity: 1;
                filter: blur(0)
            }
        }
        .card - appear {
            animation: card - appear 0.5s cubic - bezier(0.22, 1, 0.36, 1)backwards
        }
         @ keyframes gradient - x {
            0 % {
                background - position: 0 % 50 %
            }
            50 % {
                background - position: 100 % 50 %
            }
            100 % {
                background - position: 0 % 50 %
            }
        }
        .gradient - x {
            background - size: 200 % 200 % ;
            animation: gradient - x 3s ease infinite
        }
         @ keyframes reveal - up {
            from {
                clip - path: inset(100 % 0 0 0)
            }
            to {
                clip - path: inset(0 0 0 0)
            }
        }
        .reveal - up {
            animation: reveal - up 0.6s cubic - bezier(0.22, 1, 0.36, 1)
        }
         @ keyframes bar - grow {
            from {
                transform: scaleX(0)
            }
            to {
                transform: scaleX(1)
            }
        }
        .bar - grow {
            animation: bar - grow 0.8s cubic - bezier(0.22, 1, 0.36, 1);
            transform - origin: left
        }
         @ keyframes counter - roll {
            0 % {
                transform: translateY(100 % );
                opacity: 0
            }
            60 % {
                transform: translateY(-5 % )
            }
            100 % {
                transform: translateY(0);
                opacity: 1
            }
        }
        .counter - roll {
            animation: counter - roll 0.5s cubic - bezier(0.22, 1, 0.36, 1)
        }
        .hover - lift {
            transition: all 0.3s cubic - bezier(0.22, 1, 0.36, 1)
        }
        .hover - lift: hover {
            transform: translateY(-4px)scale(1.02);
            box - shadow: 0 20px 40px rgba(0, 0, 0, 0.3)
        }
         @ keyframes text - reveal {
            from {
                clip - path: inset(0 100 % 0 0)
            }
            to {
                clip - path: inset(0 0 0 0)
            }
        }
        .text - reveal {
            animation: text - reveal 0.8s cubic - bezier(0.22, 1, 0.36, 1)
        }
        .tab - enter {
            animation: stagger - in 0.45s cubic - bezier(0.22, 1, 0.36, 1);
        }
         @ keyframes floatUp {
            0 % {
                transform: translateY(0)scale(1);
                opacity: 1
            }
            100 % {
                transform: translateY(-80px)scale(1.5);
                opacity: 0
            }
        }
         @ keyframes bounce - in {
            0 % {
                transform: scale(0)
            }
            40 % {
                transform: scale(1.15)
            }
            70 % {
                transform: scale(0.95)
            }
            100 % {
                transform: scale(1)
            }
        }
         @ keyframes modal - backdrop {
            from {
                backdrop - filter: blur(0px);
                opacity: 0
            }
            to {
                backdrop - filter: blur(16px);
                opacity: 1
            }
        }
         @ keyframes modal - content {
            0 % {
                transform: scale(0.7)translateY(40px);
                opacity: 0
            }
            100 % {
                transform: scale(1)translateY(0);
                opacity: 1
            }
        }
        .modal - backdrop {
            animation: modal - backdrop 0.3s ease - out forwards;
        }
        .modal - content {
            animation: modal - content 0.45s cubic - bezier(0.34, 1.56, 0.64, 1);
        }
         @ keyframes trophy - float {
            0 % ,
            100 % {
                transform: translateY(0)rotateY(0deg)
            }
            25 % {
                transform: translateY(-15px)rotateY(90deg)
            }
            50 % {
                transform: translateY(0)rotateY(180deg)
            }
            75 % {
                transform: translateY(-10px)rotateY(270deg)
            }
        }
         @ keyframes winner - glow {
            0 % ,
            100 % {
                text - shadow: 0 0 20px rgba(250, 204, 21, 0.5)
            }
            50 % {
                text - shadow: 0 0 40px rgba(250, 204, 21, 0.8),
                0 0 80px rgba(250, 204, 21, 0.3)
            }
        }
        .winner - glow {
            animation: winner - glow 2s ease - in - out infinite;
        }
         @ keyframes dice - roll {
            0 % {
                transform: rotate(0deg)scale(1)
            }
            25 % {
                transform: rotate(90deg)scale(0.8)
            }
            50 % {
                transform: rotate(180deg)scale(1.1)
            }
            75 % {
                transform: rotate(270deg)scale(0.9)
            }
            100 % {
                transform: rotate(360deg)scale(1)
            }
        }
         @ keyframes ring - pulse {
            0 % {
                box - shadow: 0 0 0 0 rgba(74, 222, 128, 0.6)
            }
            100 % {
                box - shadow: 0 0 0 14px rgba(74, 222, 128, 0)
            }
        }
        .ring - pulse {
            animation: ring - pulse 1.5s infinite;
        }
         @ keyframes glow {
            0 % ,
            100 % {
                box - shadow: 0 0 20px rgba(255, 215, 0, 0.3)
            }
            50 % {
                box - shadow: 0 0 40px rgba(255, 215, 0, 0.6),
                0 0 80px rgba(255, 215, 0, 0.2)
            }
        }
        .glow - anim {
            animation: glow 2s ease - in - out infinite;
        }
         @ keyframes shimmer {
            0 % {
                background - position: -200 % 0
            }
            100 % {
                background - position: 200 % 0
            }
        }
         @ keyframes float {
            0 % ,
            100 % {
                transform: translateY(0)
            }
            50 % {
                transform: translateY(-8px)
            }
        }
        .float - anim {
            animation: float 3s ease - in - out infinite;
        }
         @ keyframes fade - in - scale {
            from {
                transform: scale(0.92);
                opacity: 0
            }
            to {
                transform: scale(1);
                opacity: 1
            }
        }
         @ keyframes chaos - gradient {
            0 % {
                background - position: 0 % 50 %
            }
            50 % {
                background - position: 100 % 50 %
            }
            100 % {
                background - position: 0 % 50 %
            }
        }
        .chaos - bg {
            background - size: 400 % 400 % ;
            animation: chaos - gradient 3s ease infinite;
        }
         @ keyframes victory - text {
            0 % {
                transform: scale(0)rotate(-10deg);
                opacity: 0
            }
            50 % {
                transform: scale(1.1)rotate(2deg)
            }
            100 % {
                transform: scale(1)rotate(0deg);
                opacity: 1
            }
        }
         @ keyframes gradient - x {
            0 % ,
            100 % {
                background - position: 0 % 50 %
            }
            50 % {
                background - position: 100 % 50 %
            }
        }
        .gradient - animate {
            background - size: 200 % 200 % ;
            animation: gradient - x 3s ease infinite;
        }
         @ keyframes theme - particle - fall {
            0 % {
                transform: translateY(0)rotate(0deg);
                opacity: 0.04
            }
            50 % {
                transform: translateY(50vh)rotate(180deg)translateX(30px);
                opacity: 0.05
            }
            100 % {
                transform: translateY(110vh)rotate(360deg)translateX(-20px);
                opacity: 0
            }
        }
         @ keyframes splash - logo {
            0 % {
                transform: scale(0)rotate(-20deg);
                opacity: 0
            }
            60 % {
                transform: scale(1.15)rotate(3deg);
                opacity: 1
            }
            100 % {
                transform: scale(1)rotate(0deg);
                opacity: 1
            }
        }
         @ keyframes splash - dice {
            0 % {
                transform: translateY(30px)rotate(0deg);
                opacity: 0
            }
            100 % {
                transform: translateY(0)rotate(360deg);
                opacity: 1
            }
        }
         @ keyframes splash - text {
            0 % {
                letter - spacing: 15px;
                opacity: 0;
                transform: translateY(20px)
            }
            100 % {
                letter - spacing: 4px;
                opacity: 1;
                transform: translateY(0)
            }
        }
         @ keyframes splash - stat {
            0 % {
                transform: translateX(-20px);
                opacity: 0
            }
            100 % {
                transform: translateX(0);
                opacity: 1
            }
        }
         @ keyframes splash - btn {
            0 % {
                transform: scale(0.8);
                opacity: 0
            }
            100 % {
                transform: scale(1);
                opacity: 1
            }
        }
         @ keyframes badge - float {
            0 % ,
            100 % {
                transform: translateY(0)
            }
            50 % {
                transform: translateY(-6px)
            }
        }
         @ keyframes flipdigit {
            0 % {
                transform: rotateX(0)
            }
            40 % {
                transform: rotateX(-90deg)
            }
            60 % {
                transform: rotateX(90deg)
            }
            100 % {
                transform: rotateX(0)
            }
        }
        .flip - digit {
            display: inline - block;
            animation: flipdigit 0.5s ease - in - out;
            transform - style: preserve - 3d
        }
         @ keyframes last - cell - glow {
            0 % ,
            100 % {
                box - shadow: 0 0 0 0 rgba(250, 204, 21, 0)
            }
            50 % {
                box - shadow: 0 0 18px 4px rgba(250, 204, 21, 0.35)
            }
        }
        .last - cell - pulse {
            animation: last - cell - glow 0.8s ease - in - out 2;
            border - color: rgba(250, 204, 21, 0.6)!important;
            background: rgba(250, 204, 21, 0.08)!important
        }
         @ keyframes tab - slide - in - r {
            0 % {
                transform: translateX(30px)scale(0.98);
                opacity: 0;
                filter: blur(2px)
            }
            100 % {
                transform: translateX(0)scale(1);
                opacity: 1;
                filter: blur(0)
            }
        }
         @ keyframes tab - slide - in - l {
            0 % {
                transform: translateX(-30px)scale(0.98);
                opacity: 0;
                filter: blur(2px)
            }
            100 % {
                transform: translateX(0)scale(1);
                opacity: 1;
                filter: blur(0)
            }
        }
        .tab - slide - r {
            animation: tab - slide - in - r 0.35s cubic - bezier(0.22, 1, 0.36, 1)
        }
        .tab - slide - l {
            animation: tab - slide - in - l 0.35s cubic - bezier(0.22, 1, 0.36, 1)
        }
         @ keyframes row - cascade {
            0 % {
                transform: translateY(10px);
                opacity: 0
            }
            100 % {
                transform: translateY(0);
                opacity: 1
            }
        }
         @ keyframes cinema - darken {
            0 % {
                opacity: 0
            }
            100 % {
                opacity: 1
            }
        }
         @ keyframes cinema - rise {
            0 % {
                transform: translateY(50px);
                opacity: 0
            }
            100 % {
                transform: translateY(0);
                opacity: 1
            }
        }
         @ keyframes cinema - text {
            0 % {
                letter - spacing: 20px;
                opacity: 0
            }
            100 % {
                letter - spacing: 2px;
                opacity: 1
            }
        }
         @ keyframes shake - screen {
            0 % ,
            100 % {
                transform: translateX(0)
            }
            10 % ,
            30 % ,
            50 % ,
            70 % ,
            90 % {
                transform: translateX(-3px)
            }
            20 % ,
            40 % ,
            60 % ,
            80 % {
                transform: translateX(3px)
            }
        }
        : root {
            --app - font: system - ui,
            sans - serif
        }
         * : not(select): not(option): not(input) {
            font - family: var(--app - font)!important
        }
        .scrollbar - none::-webkit - scrollbar {
            display: none
        }
        .scrollbar - none {
            -ms - overflow - style: none;
            scrollbar - width: none
        }
        .shake - active {
            animation: shake - screen 0.4s ease - in - out
        }
         @ keyframes score - counter {
            0 % {
                transform: translateY(100 % );
                opacity: 0
            }
            50 % {
                transform: translateY(-10 % );
                opacity: 1
            }
            100 % {
                transform: translateY(0);
                opacity: 1
            }
        }
        .score - counter - anim {
            animation: score - counter 0.4s cubic - bezier(0.34, 1.56, 0.64, 1)
        }
         @ keyframes cell - pulse {
            0 % ,
            100 % {
                box - shadow: 0 0 0 0 rgba(255, 255, 255, 0)
            }
            50 % {
                box - shadow: 0 0 8px 2px rgba(255, 255, 255, 0.06)
            }
        }
        .cell - alive {
            animation: cell - pulse 3s ease - in - out infinite
        }
         @ keyframes cell - idle {
            0 % ,
            100 % {
                opacity: 0.4
            }
            50 % {
                opacity: 0.6
            }
        }
        .cell - empty - wave {
            animation: cell - idle 4s ease - in - out infinite
        }
         @ keyframes trail - up {
            0 % {
                transform: translateY(0)scale(1);
                opacity: 1;
                filter: blur(0)
            }
            100 % {
                transform: translateY(-60px)scale(0.5);
                opacity: 0;
                filter: blur(4px)
            }
        }
        .score - trail {
            animation: trail - up 1s ease - out forwards
        }
         @ keyframes shockwave {
            0 % {
                transform: scale(0.5);
                opacity: 0.6;
                border - width: 3px
            }
            100 % {
                transform: scale(4);
                opacity: 0;
                border - width: 0px
            }
        }
        .shockwave {
            animation: shockwave 0.7s ease - out forwards
        }
         @ keyframes dice - roll {
            0 % {
                transform: rotateX(0)rotateY(0)scale(0.3);
                opacity: 0
            }
            50 % {
                transform: rotateX(720deg)rotateY(360deg)scale(1.2);
                opacity: 1
            }
            100 % {
                transform: rotateX(1080deg)rotateY(720deg)scale(1);
                opacity: 1
            }
        }
        .dice - roll - anim {
            animation: dice - roll 0.8s cubic - bezier(0.34, 1.56, 0.64, 1)
        }
         @ keyframes streak - fire {
            0 % ,
            100 % {
                transform: scaleY(1);
                opacity: 0.8
            }
            50 % {
                transform: scaleY(1.3);
                opacity: 1
            }
        }
        .streak - fire {
            animation: streak - fire 0.5s ease - in - out infinite
        }
         @ keyframes bg - pulse - tension {
            0 % ,
            100 % {
                background - color: transparent
            }
            50 % {
                background - color: rgba(239, 68, 68, 0.05)
            }
        }
        .tension - pulse {
            animation: bg - pulse - tension 2s ease - in - out infinite
        }
         @ keyframes emoji - rain {
            0 % {
                transform: translateY(-100 % )rotate(0deg);
                opacity: 1
            }
            100 % {
                transform: translateY(100vh)rotate(720deg);
                opacity: 0
            }
        }
         @ keyframes avatar - dance {
            0 % ,
            100 % {
                transform: rotate(0deg)scale(1)
            }
            25 % {
                transform: rotate(-8deg)scale(1.1)
            }
            75 % {
                transform: rotate(8deg)scale(1.1)
            }
        }
         @ keyframes avatar - cry {
            0 % ,
            100 % {
                transform: translateY(0)
            }
            50 % {
                transform: translateY(3px)
            }
        }
         @ keyframes avatar - idle {
            0 % ,
            100 % {
                transform: scale(1)
            }
            50 % {
                transform: scale(0.95)
            }
        }
        .avatar - dance {
            animation: avatar - dance 0.6s ease - in - out infinite
        }
        .avatar - cry {
            animation: avatar - cry 0.3s ease - in - out 3
        }
        .avatar - idle {
            animation: avatar - idle 4s ease - in - out infinite
        }
         @ keyframes podium - rise {
            0 % {
                transform: translateY(40px)scaleY(0.3);
                opacity: 0
            }
            100 % {
                transform: translateY(0)scaleY(1);
                opacity: 1
            }
        }
         @ keyframes podium - crown {
            0 % {
                transform: scale(0)rotate(-20deg)
            }
            100 % {
                transform: scale(1)rotate(0deg)
            }
        }
         @ keyframes lightning {
            0 % {
                opacity: 0;
                transform: translateX(-50 % )scaleY(0)
            }
            10 % {
                opacity: 1;
                transform: translateX(-50 % )scaleY(1)
            }
            30 % {
                opacity: 1
            }
            100 % {
                opacity: 0
            }
        }
         @ keyframes total - breathe {
            0 % ,
            100 % {
                text - shadow: 0 0 10px rgba(255, 255, 255, 0.1)
            }
            50 % {
                text - shadow: 0 0 20px rgba(255, 255, 255, 0.3)
            }
        }
        .total - breathe {
            animation: total - breathe 3s ease - in - out infinite
        }
         @ keyframes confetti - fall {
            0 % {
                transform: translateY(-10vh)rotate(0deg);
                opacity: 1
            }
            100 % {
                transform: translateY(110vh)rotate(1080deg);
                opacity: 0
            }
        }
         @ keyframes sad - pulse {
            0 % ,
            100 % {
                transform: scale(1);
                opacity: 0.5
            }
            50 % {
                transform: scale(1.2);
                opacity: 0.8
            }
        }
        .glass {
            background: rgba(255, 255, 255, 0.03);
            backdrop - filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.08)
        }
        .glass - strong {
            background: rgba(255, 255, 255, 0.06);
            backdrop - filter: blur(30px);
            border: 1px solid rgba(255, 255, 255, 0.12)
        }
        ::-webkit - scrollbar {
            width: 6px;
            height: 6px
        }
        ::-webkit - scrollbar - track {
            background: transparent
        }
        ::-webkit - scrollbar - thumb {
            background: rgba(255, 255, 255, 0.15);
            border - radius: 10px
        }
        ::-webkit - scrollbar - thumb: hover {
            background: rgba(255, 255, 255, 0.25)
        }
        select {
            appearance: none;
            background - image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23999' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E");
            background - repeat: no - repeat;
            background - position: right 12px center;
            padding - right: 30px
        }
        .confetti - piece {
            position: fixed;
            z - index: 9998;
            pointer - events: none
        }
         @ keyframes podium - 3d - rise {
            0 % {
                transform: translateY(80px)scaleY(0);
                opacity: 0
            }
            60 % {
                transform: translateY(-10px)scaleY(1.05)
            }
            100 % {
                transform: translateY(0)scaleY(1);
                opacity: 1
            }
        }
         @ keyframes podium - glow {
            0 % ,
            100 % {
                opacity: 0.3
            }
            50 % {
                opacity: 0.7
            }
        }
         @ keyframes spotlight - sweep {
            0 % ,
            100 % {
                transform: rotate(-15deg);
                opacity: 0.05
            }
            50 % {
                transform: rotate(15deg);
                opacity: 0.15
            }
        }
         @ keyframes vs - slide - left {
            0 % {
                transform: translateX(-200px)scale(0.5);
                opacity: 0
            }
            100 % {
                transform: translateX(0)scale(1);
                opacity: 1
            }
        }
         @ keyframes vs - slide - right {
            0 % {
                transform: translateX(200px)scale(0.5);
                opacity: 0
            }
            100 % {
                transform: translateX(0)scale(1);
                opacity: 1
            }
        }
         @ keyframes vs - text {
            0 % {
                transform: scale(0)rotate(-20deg);
                opacity: 0
            }
            100 % {
                transform: scale(1)rotate(0deg);
                opacity: 1
            }
        }
         @ keyframes vs - flash {
            0 % {
                transform: scale(0);
                opacity: 0
            }
            50 % {
                transform: scale(1.5);
                opacity: 0.3
            }
            100 % {
                transform: scale(1);
                opacity: 0.1
            }
        }
         @ keyframes vs - fight {
            0 % {
                transform: scale(0)translateY(20px);
                opacity: 0
            }
            100 % {
                transform: scale(1)translateY(0);
                opacity: 1
            }
        }
         @ keyframes tab - page - enter {
            0 % {
                transform: translateY(12px);
                opacity: 0;
                filter: blur(2px)
            }
            100 % {
                transform: translateY(0);
                opacity: 1;
                filter: blur(0)
            }
        }
        .tab - page - enter {
            animation: tab - page - enter 0.35s cubic - bezier(0.22, 1, 0.36, 1)
        }
         @ keyframes weather - rain {
            0 % {
                transform: translateY(-10px)
            }
            100 % {
                transform: translateY(100vh)
            }
        }
         @ keyframes weather - lightning {
            0 % ,
            95 % ,
            100 % {
                background: transparent
            }
            96 % {
                background: rgba(255, 255, 255, 0.03)
            }
            97 % {
                background: transparent
            }
            98 % {
                background: rgba(255, 255, 255, 0.05)
            }
        }
         @ keyframes weather - sun {
            0 % ,
            100 % {
                transform: scale(1);
                opacity: 0.15
            }
            50 % {
                transform: scale(1.2);
                opacity: 0.25
            }
        }
         @ keyframes flame - flicker {
            0 % ,
            100 % {
                text - shadow: 0 - 2px 6px rgba(255, 100, 0, 0.5),
                0 - 4px 12px rgba(255, 50, 0, 0.3)
            }
            33 % {
                text - shadow: 0 - 3px 8px rgba(255, 130, 0, 0.6),
                0 - 6px 16px rgba(255, 70, 0, 0.4)
            }
            66 % {
                text - shadow: 0 - 1px 5px rgba(255, 80, 0, 0.4),
                0 - 3px 10px rgba(255, 40, 0, 0.2)
            }
        }
        .flame - effect {
            animation: flame - flicker 0.5s ease - in - out infinite;
            position: relative
        }
        .flame - effect::before {
            content: '🔥';
            position: absolute;
            top: -16px;
            left: 50 % ;
            transform: translateX(-50 % );
            font - size: 14px;
            animation: flame - flicker 0.3s ease - in - out infinite
        }
         @ keyframes flame - column {
            0 % ,
            100 % {
                box - shadow: inset 0 0 10px rgba(255, 100, 0, 0.05)
            }
            50 % {
                box - shadow: inset 0 0 20px rgba(255, 100, 0, 0.1)
            }
        }
        .flame - column {
            animation: flame - column 1s ease - in - out infinite
        }
         @ keyframes xp - fill {
            from {
                width: 0
            }
            to {
                width: var(--xp - width)
            }
        }
        .xp - bar - fill {
            animation: xp - fill 1s cubic - bezier(0.22, 1, 0.36, 1)
        }
         @ keyframes card - export - shine {
            0 % {
                background - position: -200 % 0
            }
            100 % {
                background - position: 200 % 0
            }
        }
        .grid - neon td {
            border - color: rgba(0, 255, 128, 0.1)!important
        }
        .grid - neon tr: hover td {
            background: rgba(0, 255, 128, 0.03)!important
        }
        .grid - vintage td {
            border - color: rgba(180, 130, 60, 0.15)!important
        }
        .grid - vintage {
            filter: sepia(0.08)
        }
        .grid - chalk td {
            border - color: rgba(34, 197, 94, 0.1)!important;
            font - family: 'Courier New',
            monospace
        }
        .grid - pixel td {
            border - color: rgba(168, 85, 247, 0.1)!important;
            image - rendering: pixelated
        }
         @ keyframes bg - breathe {
            0 % ,
            100 % {
                filter: brightness(1)
            }
            50 % {
                filter: brightness(1.02)
            }
        }
         @ keyframes hotseat - in {
            0 % {
                opacity: 0;
                backdrop - filter: blur(0)
            }
            100 % {
                opacity: 1;
                backdrop - filter: blur(8px)
            }
        }
         @ keyframes hotseat - pulse {
            0 % {
                opacity: 0
            }
            10 % {
                opacity: 1
            }
            80 % {
                opacity: 1
            }
            100 % {
                opacity: 0
            }
        }
         @ keyframes hotseat - bell {
            0 % {
                transform: rotate(0)scale(0)
            }
            30 % {
                transform: rotate(15deg)scale(1.3)
            }
            60 % {
                transform: rotate(-15deg)scale(1.1)
            }
            100 % {
                transform: rotate(0)scale(1)
            }
        }
         @ keyframes hotseat - name {
            0 % {
                transform: scale(0.3)translateY(30px);
                opacity: 0
            }
            100 % {
                transform: scale(1)translateY(0);
                opacity: 1
            }
        }
         @ keyframes massacre - in {
            0 % {
                opacity: 0
            }
            100 % {
                opacity: 1
            }
        }
         @ keyframes massacre - skull {
            0 % {
                transform: scale(0)rotate(-30deg)
            }
            60 % {
                transform: scale(1.3)rotate(5deg)
            }
            100 % {
                transform: scale(1)rotate(0)
            }
        }
         @ keyframes massacre - text {
            0 % {
                transform: scaleX(0);
                letter - spacing: 30px;
                opacity: 0
            }
            100 % {
                transform: scaleX(1);
                letter - spacing: 6px;
                opacity: 1
            }
        }
         @ keyframes massacre - shake {
            0 % ,
            100 % {
                transform: translateX(0)
            }
            10 % ,
            30 % ,
            50 % ,
            70 % ,
            90 % {
                transform: translateX(-4px)
            }
            20 % ,
            40 % ,
            60 % ,
            80 % {
                transform: translateX(4px)
            }
        }
         @ keyframes score - particle {
            0 % {
                transform: translate(0, 0)scale(1);
                opacity: 1
            }
            100 % {
                transform: translate(var(--dx), var(--dy))scale(0);
                opacity: 0
            }
        }
         @ keyframes funquote - in {
            0 % {
                transform: translateX(-50 % )translateY(20px)scale(0.8);
                opacity: 0
            }
            100 % {
                transform: translateX(-50 % )translateY(0)scale(1);
                opacity: 1
            }
        }
         @ keyframes countdown - pop {
            0 % {
                transform: scale(3);
                opacity: 0
            }
            30 % {
                transform: scale(0.9);
                opacity: 1
            }
            50 % {
                transform: scale(1.1)
            }
            100 % {
                transform: scale(1);
                opacity: 0
            }
        }
         @ keyframes countdown - pulse {
            0 % ,
            100 % {
                text - shadow: 0 0 80px rgba(250, 204, 21, 0.5)
            }
            50 % {
                text - shadow: 0 0 120px rgba(250, 204, 21, 0.8)
            }
        }
         @ keyframes clutch - flash {
            0 % {
                background: rgba(250, 204, 21, 0.2)
            }
            20 % {
                background: transparent
            }
            40 % {
                background: rgba(250, 204, 21, 0.1)
            }
            100 % {
                opacity: 0
            }
        }
         @ keyframes clutch - icon {
            0 % {
                transform: scale(0)rotate(-180deg)
            }
            100 % {
                transform: scale(1)rotate(0)
            }
        }
         @ keyframes clutch - text {
            0 % {
                transform: scale(0.3);
                opacity: 0;
                letter - spacing: 30px
            }
            100 % {
                transform: scale(1);
                opacity: 1;
                letter - spacing: 3px
            }
        }
         @ keyframes photo - flash {
            0 % {
                background: white
            }
            10 % {
                background: rgba(0, 0, 0, 0.9)
            }
            95 % {
                opacity: 1
            }
            100 % {
                opacity: 0
            }
        }
         @ keyframes photo - camera {
            0 % ,
            100 % {
                transform: scale(1)
            }
            50 % {
                transform: scale(1.15)
            }
        }
         @ keyframes photo - text {
            0 % {
                transform: scaleX(0);
                letter - spacing: 40px
            }
            100 % {
                transform: scaleX(1);
                letter - spacing: 6px
            }
        }
         @ keyframes player - entrance {
            0 % {
                transform: scale(0);
                opacity: 0
            }
            60 % {
                transform: scale(1.3);
                opacity: 0.6
            }
            100 % {
                transform: scale(1);
                opacity: 0
            }
        }
         @ keyframes stats - intro {
            0 % {
                transform: translateY(30px)scale(0.95);
                opacity: 0;
                filter: blur(4px)
            }
            100 % {
                transform: translateY(0)scale(1);
                opacity: 1;
                filter: blur(0)
            }
        }
         @ keyframes wall - shame - entry {
            0 % {
                transform: translateX(-20px);
                opacity: 0
            }
            100 % {
                transform: translateX(0);
                opacity: 1
            }
        }
         @ keyframes glass - crack {
            0 % {
                opacity: 0;
                transform: scale(0.5)
            }
            30 % {
                opacity: 1;
                transform: scale(1.1)
            }
            100 % {
                opacity: 0;
                transform: scale(1.3)
            }
        }
        .cell - cracked {
            background - image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Cpath d='M20 2L18 15L5 12L17 20L8 35L20 24L30 38L23 20L38 15L22 14Z' fill='none' stroke='%23ef4444' stroke-width='0.5' opacity='0.3'/%3E%3C/svg%3E");
            background - size: 80 % ;
            background - repeat: no - repeat;
            background - position: center
        }
         @ keyframes scroll - hint {
            0 % ,
            100 % {
                transform: translateX(0)translateY(-50 % );
                opacity: 0.3
            }
            50 % {
                transform: translateX(8px)translateY(-50 % );
                opacity: 0.7
            }
        }
         @ keyframes score - trail {
            0 % {
                box - shadow: 0 0 0 transparent
            }
            30 % {
                box - shadow: 0 0 15px var(--trail - color, rgba(255, 255, 255, 0.3))
            }
            100 % {
                box - shadow: 0 0 0 transparent
            }
        }
        .score - trail - effect {
            animation: score - trail 1s ease - out
        }
         @ keyframes badge - shelf - 3d {
            0 % {
                transform: perspective(600px)rotateY(-8deg)translateZ(-20px);
                opacity: 0
            }
            100 % {
                transform: perspective(600px)rotateY(0)translateZ(0);
                opacity: 1
            }
        }
         @ keyframes history - cascade {
            0 % {
                transform: translateY(20px);
                opacity: 0
            }
            100 % {
                transform: translateY(0);
                opacity: 1
            }
        }
        `}</style>

              {notifQueue.length>0&&<div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-xs">{notifQueue.map((notif,ni)=>{const colors=notif.icon==='🎲'?'from-yellow-600 to-orange-600 border-yellow-400':notif.icon==='🎁'?'from-green-600 to-emerald-600 border-green-400':notif.icon==='🩸'?'from-red-700 to-rose-700 border-red-400':notif.icon==='💯'?'from-emerald-600 to-teal-600 border-emerald-400':notif.icon==='🏁'?'from-orange-600 to-red-600 border-orange-400':notif.icon==='⏱️'?'from-blue-600 to-indigo-600 border-blue-400':notif.icon==='🔄'?'from-cyan-600 to-blue-600 border-cyan-400':notif.icon==='❌'?'from-red-800 to-rose-800 border-red-500':notif.icon==='✅'?'from-green-600 to-emerald-600 border-green-400':notif.icon==='🏅'?'from-amber-600 to-yellow-600 border-amber-400':notif.icon==='🏆'?'from-yellow-600 to-amber-600 border-yellow-400':'from-purple-600 to-pink-600 border-purple-400';return(<div key={notif.id} className="slide-in-right" style={{animation:` notif - enter 0.6s cubic - bezier(0.34, 1.56, 0.64, 1)$ {
            ni * 0.1
        }
        s backwards `}}><div className={'relative overflow-hidden px-6 py-5 rounded-2xl shadow-2xl backdrop-blur-xl border-2 max-w-sm bg-gradient-to-r '+colors}><div className="absolute inset-0" style={{animation:'shimmer 2s infinite',backgroundSize:'200% 100%',backgroundImage:'linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)'}}></div><div className="flex items-center gap-4 relative z-10"><span className="text-5xl" style={{animation:'bounce-in 0.5s cubic-bezier(0.34,1.56,0.64,1)'}}>{notif.icon}</span><div className="text-white"><div className="text-xs font-bold uppercase tracking-widest opacity-80">{notif.icon==='🎲'?'🎉 Exploit !':notif.icon==='🎁'?'🎉 Succès !':notif.icon==='🩸'?'⚔️ Premier Sang !':notif.icon==='💯'?'🎯 Perfection !':notif.icon==='🏁'?'🚨 Attention !':notif.icon==='⏱️'?'📊 Mi-Temps':notif.icon==='🔄'?'🔥 Renversement !':notif.icon==='❌'?'😬 Aïe !':notif.icon==='✅'?'🎮 Fini !':notif.icon==='🏅'?'🏅 Record !':notif.icon==='🏆'?'🏆 Défi !':'🎉 Incroyable !'}</div><div className="font-black text-xl">{notif.title}</div><div className="text-sm opacity-90">{notif.description}</div></div></div></div></div>);})}</div>}

              {shockwavePos&&<div className="fixed z-[9999] pointer-events-none" style={{left:shockwavePos.x-50,top:shockwavePos.y-50}}><div className="w-[100px] h-[100px] rounded-full border-4 border-white/40 shockwave"></div></div>}

              {emojiRain&&<div className="fixed inset-0 pointer-events-none z-[9997] overflow-hidden">{Array.from({length:30},(_,i)=>i).map(i=><div key={i} className="absolute text-2xl" style={{left:Math.random()*100+'%',top:'-30px',animation:` emoji - rain $ {
            2 + Math.random() * 3
        }
        s linear $ {
            Math.random() * 2
        }
        s both `}}>{emojiRain==='🎲'?['🎲','🎲','🎲','⭐','✨','🎯'][i%6]:['💀','😱','🧱','💔','😬','❌'][i%6]}</div>)}</div>}

              {showDiceAnim&&<div className="fixed inset-0 pointer-events-none z-[9999] flex items-center justify-center gap-4">{[1,2,3,4,5].map(d=><div key={d} className="text-6xl dice-roll-anim" style={{animationDelay:d*0.12+'s'}}>🎲</div>)}</div>}

              {tensionMode&&isGameStarted()&&!isGameComplete()&&<div className="fixed top-4 left-1/2 -translate-x-1/2 z-40 pointer-events-none"><div className="px-4 py-1.5 bg-red-500/20 border border-red-400/40 rounded-full backdrop-blur-sm" style={{animation:'bg-pulse-tension 1.5s ease-in-out infinite'}}><span className="text-red-400 font-black text-sm tracking-widest">⚡ TENSION ⚡</span></div></div>}

              {quickStatsPlayer&&<div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60" onClick={()=>setQuickStatsPlayer(null)}><div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-white/20 rounded-3xl p-6 w-80 max-w-[90vw] modal-content" onClick={e=>e.stopPropagation()}>{(()=>{const ps=playerStats.find(s=>s.name===quickStatsPlayer);if(!ps)return <div className="text-gray-400 text-center">Pas de stats</div>;const t=getPlayerTitle(ps);return(<div className="text-center"><div className="text-5xl mb-2">{playerAvatars[quickStatsPlayer]||'👤'}</div><div className="text-xl font-black text-white mb-1">{quickStatsPlayer}</div><div className="text-sm font-bold mb-4" style={{color:T.primary}}>{t.icon} {t.title}</div><div className="grid grid-cols-2 gap-2 text-sm">{[['🎮 Parties',ps.games],['🏆 Victoires',ps.wins],['📊 Moyenne',ps.avgScore||0],['🔝 Max',ps.maxScore],['🎲 Yams',ps.yamsCount||0],['🎁 Bonus %',(ps.bonusRate||0)+'%']].map(([l,v],i)=><div key={i} className="bg-white/5 rounded-xl p-2"><div className="text-gray-500 text-xs">{l}</div><div className="text-white font-bold">{v}</div></div>)}</div><button onClick={()=>{setQuickStatsPlayer(null);setShowPlayerCard(quickStatsPlayer);}} className="mt-4 w-full py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white font-bold text-sm transition-all">📇 Carte d'identité</button></div>);})()}</div></div>}

              {showPlayerCard&&(()=>{
                const ps=playerStats.find(s=>s.name===showPlayerCard);
                if(!ps) return null;
                const t=getPlayerTitle(ps);
                const winRate=ps.games>0?Math.round(ps.wins/ps.games*100):0;
                const pc=getPlayerColor(showPlayerCard, 0);
                const xpLevel=getXPLevel(globalXP);
                const shareText=` 🎲 YAMS - $ {
            showPlayerCard
        }
         \ n$ {
            t.icon
        }
        $ {
            t.title
        }
         \ n🎮 $ {
            ps.games
        }
        parties | 🏆 $ {
            ps.wins
        }
        victoires($ {
            winRate
        }
             % ) \ n📊 Moy: $ {
            ps.avgScore
        }
         | 🔝 Max: $ {
            ps.maxScore
        }
         \ n🎲 $ {
            ps.yamsCount || 0
        }
        Yams | 🎁 Bonus: $ {
            ps.bonusRate || 0
        }
         %  \ n🔥 Série: $ {
            ps.currentStreak
        }
        `;
                return (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4" onClick={()=>setShowPlayerCard(null)}>
                  <div className="w-80 max-w-[90vw] modal-content" onClick={e=>e.stopPropagation()}>
                    <div id="player-card-export" className="relative overflow-hidden rounded-3xl border-2 p-0" style={{borderColor:pc.hex+'60',background:'#0f172a'}}>
                      <div className="relative h-28 overflow-hidden" style={{background:` linear - gradient(135deg, $ {
            pc.hex
        }
            40, $ {
            T.primary
        }
            20, $ {
            pc.hex
        }
            20)`}}>
                        <div className="absolute inset-0" style={{background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.05),transparent)',backgroundSize:'200% 100%',animation:'card-export-shine 3s linear infinite'}}/>
                        <div className="absolute top-3 left-4 flex items-center gap-2">
                          <div className="text-xs font-black px-2 py-0.5 rounded-full" style={{background:pc.hex,color:'#000'}}>{xpLevel.icon} Niv.{xpLevel.level}</div>
                          <div className="text-[10px] font-bold text-white/60">{t.icon} {t.title}</div>
                        </div>
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border-4 flex items-center justify-center text-4xl" style={{borderColor:pc.hex,background:'#1e293b'}}>{playerAvatars[showPlayerCard]||'👤'}</div>
                      </div>
                      <div className="relative z-10 pt-12 pb-6 px-6 text-center">
                        <h3 className="text-xl font-black text-white mb-0.5">{showPlayerCard}</h3>
                        <div className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{color:pc.hex}}>{t.title}</div>
                        <div className="grid grid-cols-3 gap-1 mb-4">
                          <div className="bg-white/5 rounded-xl py-2 border border-white/5"><div className="text-xl font-black" style={{color:pc.hex}}>{ps.wins}</div><div className="text-[8px] text-gray-500 font-bold uppercase">Victoires</div></div>
                          <div className="bg-white/5 rounded-xl py-2 border border-white/5"><div className="text-xl font-black text-white">{ps.avgScore}</div><div className="text-[8px] text-gray-500 font-bold uppercase">Moyenne</div></div>
                          <div className="bg-white/5 rounded-xl py-2 border border-white/5"><div className="text-xl font-black text-white">{ps.maxScore}</div><div className="text-[8px] text-gray-500 font-bold uppercase">Record</div></div>
                        </div>
                        <div className="space-y-2 mb-4">
                          {[
                            {label:'Parties',val:ps.games,max:50,icon:'🎮'},
                            {label:'Win Rate',val:winRate,max:100,icon:'🏆',suffix:'%'},
                            {label:'Yams',val:ps.yamsCount||0,max:20,icon:'🎲'},
                            {label:'Bonus Rate',val:ps.bonusRate||0,max:100,icon:'🎁',suffix:'%'},
                            {label:'Série Max',val:ps.maxConsecutiveWins||0,max:10,icon:'🔥'}
                          ].map((stat,i)=><div key={i} className="flex items-center gap-2">
                            <span className="text-xs w-16 text-left text-gray-400 font-bold">{stat.icon} {stat.label}</span>
                            <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{width:Math.min(100,(stat.val/stat.max)*100)+'%',background:` linear - gradient(90deg, $ {
            pc.hex
        }, $ {
            pc.light
        })`}}/></div>
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

              {showVictoryAnimation&&<div className="fixed inset-0 z-50 flex items-center justify-center bg-black" style={{animation:'cinema-darken 0.8s ease-out'}}>
                <div className="absolute inset-0 overflow-hidden">{[...Array(60)].map((_,i)=>{const tc=THEME_CONFETTI[theme]||THEME_CONFETTI.modern;const pool=[...tc,'🎉','🏆','👑'];return <div key={i} className="confetti-piece absolute" style={{left:Math.random()*100+'%',top:'-20px',fontSize:(16+Math.random()*14)+'px',animation:` confetti - fall $ {
            2.5 + Math.random() * 3
        }
        s linear $ {
            1.5 + Math.random() * 2
        }
        s both `}}>{pool[Math.floor(Math.random()*pool.length)]}</div>;})}</div>
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute top-0 left-1/4 w-1 h-full opacity-10" style={{background:` linear - gradient(180deg, $ {
            T.primary
        }, transparent)`,animation:'spotlight-sweep 3s ease-in-out infinite',transformOrigin:'top',transform:'rotate(-15deg)'}}/>
                  <div className="absolute top-0 right-1/4 w-1 h-full opacity-10" style={{background:` linear - gradient(180deg, $ {
            T.secondary || T.primary
        }, transparent)`,animation:'spotlight-sweep 3s ease-in-out 1s infinite',transformOrigin:'top',transform:'rotate(15deg)'}}/>
                </div>
                <div className="relative text-center z-10 w-full max-w-lg mx-auto px-4">
                  <div className="text-3xl sm:text-5xl font-black text-white mb-4 tracking-wider" style={{animation:'cinema-text 0.6s ease-out 0.3s backwards'}}>🏆 PARTIE TERMINÉE</div>
                  <div className="text-2xl sm:text-4xl font-black mb-2" style={{color:T.primary,animation:'cinema-rise 0.5s ease-out 0.6s backwards',textShadow:'0 0 30px '+T.primary}}>{getWinner().join(' & ')}</div>
                  {getWinner().length===1&&<div className="text-gray-400 text-sm mb-6" style={{animation:'cinema-rise 0.4s ease-out 0.9s backwards'}}>{(()=>{const t=getPlayerTitle(playerStats.find(s=>s.name===getWinner()[0]));return t.icon+' '+t.title;})()}</div>}
                  {players.length>=2&&<div className="flex items-end justify-center gap-2 sm:gap-4 mt-4" style={{perspective:'1200px',animation:'cinema-rise 0.5s ease-out 1.2s backwards'}}>
                    {players.map(p=>calcTotal(p)).map((t,i)=>({name:players[i],score:t})).sort((a,b)=>b.score-a.score).slice(0,3).map((p,idx)=>{
                      const podiumH = idx===0?130:idx===1?90:60;
                      const medals = ['🥇','🥈','🥉'];
                      const delay = idx===0?1.4:idx===1?1.6:1.8;
                      const pc = getPlayerColor(p.name, players.indexOf(p.name));
                      return <div key={p.name} className="flex flex-col items-center" style={{animation:` podium - 3d - rise 0.8s cubic - bezier(0.34, 1.56, 0.64, 1)$ {
            delay
        }
        s backwards `}}>
                        <div className={'text-3xl sm:text-5xl mb-2 '+(idx===0?'avatar-dance':'')}>{playerAvatars[p.name]||'👤'}</div>
                        <div className="text-white text-xs sm:text-sm font-black mb-1 truncate max-w-[80px]">{p.name}</div>
                        <div className="text-xs font-black mb-2" style={{color:pc.hex}}>{p.score} pts</div>
                        <div className="relative" style={{width:'80px',height:podiumH+'px',transformStyle:'preserve-3d',transform:'rotateX(5deg) rotateY(-5deg)'}}>
                          <div className="absolute inset-0 rounded-t-lg" style={{background:` linear - gradient(180deg, $ {
            pc.hex
        }
            80, $ {
            pc.hex
        }
            30)`,borderTop:` 3px solid $ {
            pc.hex
        }
        `,boxShadow:` 0 0 30px $ {
            pc.hex
        }
        20 `}}>
                            <div className="absolute top-3 left-1/2 -translate-x-1/2 text-2xl sm:text-3xl">{medals[idx]}</div>
                          </div>
                          <div className="absolute top-0 right-0 w-3 h-full rounded-tr-lg" style={{background:` linear - gradient(180deg, $ {
            pc.hex
        }
            40, $ {
            pc.hex
        }
            10)`,transform:'translateX(100%) skewY(-10deg)',transformOrigin:'left'}}/>
                          {idx===0&&<div className="absolute -inset-2 rounded-lg" style={{boxShadow:` 0 0 40px $ {
            pc.hex
        }
        40 `,animation:'podium-glow 2s ease-in-out infinite'}}/>}
                        </div>
                      </div>;
                    })}
                  </div>}
                </div>
              </div>}

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
                            <div key={p} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all" style={{animation:` fade - in - scale 0.4s ease - out $ {
            0.6 + idx * 0.1
        }
        s backwards `}}>
                              <span className="text-2xl">{playerAvatars[p] || '👤'}</span>
                              <span className="text-white font-black text-lg flex-1">{p}</span>
                              <select id={` sd - score - $ {
            idx
        }
        `} className="bg-black/50 text-white font-black text-xl text-center py-3 px-4 rounded-xl border border-white/20 focus:border-red-400 outline-none w-24 transition-all hover:bg-black/70" defaultValue="">
                                <option value="" style={{backgroundColor:'#0f172a'}}>-</option>
                                {Array.from({length:26},(_,i)=>i+5).map(v=><option key={v} value={v} style={{backgroundColor:'#0f172a'}}>{v}</option>)}
                              </select>
                            </div>
                          ))}
                        </div>
                        <button onClick={() => {
                          const sdScores = {};
                          suddenDeathPlayers.forEach((p, idx) => {
                            const el = document.getElementById(` sd - score - $ {
            idx
        }
        `);
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

              {showBonusFullscreen&&(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center modal-backdrop" style={{backgroundColor:showBonusFullscreen.type==='obtained'?'rgba(0,0,0,0.85)':'rgba(0,0,0,0.85)'}} onClick={()=>{setShowBonusFullscreen(null);setConfetti(null);}}>
                  <div className="text-center modal-content" onClick={e=>e.stopPropagation()}>
                    {showBonusFullscreen.type==='obtained' ? (
                      <>
                        <div className="text-9xl mb-6" style={{animation:'trophy-float 2s ease-in-out infinite'}}>🎁</div>
                        <div className="text-xs font-black tracking-[0.3em] text-green-400 uppercase mb-2" style={{animation:'fade-in-scale 0.5s ease-out 0.2s backwards'}}>FÉLICITATIONS</div>
                        <div className="text-5xl sm:text-6xl font-black text-white mb-3" style={{animation:'victory-text 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.3s backwards'}}>BONUS +35 !</div>
                        <div className="text-2xl font-bold mb-2" style={{color:'#4ade80',animation:'fade-in-scale 0.4s ease-out 0.5s backwards',textShadow:'0 0 30px rgba(74,222,128,0.5)'}}>{showBonusFullscreen.player}</div>
                        <div className="text-gray-400 text-sm" style={{animation:'fade-in-scale 0.4s ease-out 0.6s backwards'}}>a débloqué le bonus de la partie supérieure !</div>
                        <div className="mt-6 flex justify-center gap-2" style={{animation:'fade-in-scale 0.4s ease-out 0.8s backwards'}}>{[...'✨🎁💎🎊✨'].map((e,i)=><span key={i} className="text-3xl" style={{animation:` float $ {
            1.5 + i * 0.3
        }
        s ease - in - out infinite $ {
            i * 0.2
        }
        s `}}>{e}</span>)}</div>
                      </>
                    ) : (
                      <>
                        <div className="text-9xl mb-6" style={{animation:'sad-pulse 2s ease-in-out infinite'}}>💔</div>
                        <div className="text-xs font-black tracking-[0.3em] text-red-400 uppercase mb-2" style={{animation:'fade-in-scale 0.5s ease-out 0.2s backwards'}}>DOMMAGE</div>
                        <div className="text-5xl sm:text-6xl font-black text-white mb-3" style={{animation:'victory-text 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.3s backwards'}}>BONUS RATÉ</div>
                        <div className="text-2xl font-bold mb-2" style={{color:'#f87171',animation:'fade-in-scale 0.4s ease-out 0.5s backwards',textShadow:'0 0 30px rgba(248,113,113,0.5)'}}>{showBonusFullscreen.player}</div>
                        <div className="text-gray-400 text-sm" style={{animation:'fade-in-scale 0.4s ease-out 0.6s backwards'}}>ne peut plus obtenir le bonus de 35 points</div>
                        <div className="mt-6 flex justify-center gap-2" style={{animation:'fade-in-scale 0.4s ease-out 0.8s backwards'}}>{[...'😢💔😤😭😢'].map((e,i)=><span key={i} className="text-3xl" style={{animation:` float $ {
            1.5 + i * 0.3
        }
        s ease - in - out infinite $ {
            i * 0.2
        }
        s `}}>{e}</span>)}</div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {rouletteMode&&rouletteResult&&<div className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] pointer-events-none" style={{animation:'fade-in-scale 0.3s ease-out'}}>
                <div className="bg-black/80 backdrop-blur-sm px-8 py-4 rounded-3xl border-2 border-amber-500/50 text-center shadow-2xl shadow-amber-500/20">
                  <div className="text-[10px] text-amber-400 font-black uppercase tracking-widest mb-1">🎰 Roulette</div>
                  <div className="text-2xl font-black text-white">{rouletteResult.name}</div>
                </div>
              </div>}

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
              {showTurnWarning&&<div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999]" style={{animation:'bounce-in 0.4s cubic-bezier(0.34,1.56,0.64,1)'}}><div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-2xl shadow-2xl shadow-red-500/30 backdrop-blur-xl border border-white/20 flex items-center gap-3"><span className="text-2xl" style={{animation:'shake 0.5s ease-in-out infinite'}}>🚫</span><span className="font-semibold">{showTurnWarning}</span></div></div>}

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
                  <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] p-4 modal-backdrop">
                      <div className={'modal-content bg-gradient-to-br '+T.card+' border border-white/10 rounded-3xl p-6 max-w-md w-full relative max-h-[90vh] flex flex-col'}>
                          <div className="flex justify-between items-center mb-4 shrink-0"><h3 className="text-xl font-black text-white">Choisir un Avatar</h3><button onClick={()=>setShowAvatarModal(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X/></button></div>
                          <div className="overflow-y-auto flex-1 pr-2 space-y-4 scrollbar-none">
                            <div>
                              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">👤 Classique</div>
                              <div className="grid grid-cols-4 gap-3">
                                {AVATAR_LIST.map((av, i) => {
                                    const player = players[avatarSelectorIndex];
                                    const stats = playerStats.find(s => s.name === player);
                                    const locked = isAvatarLocked(av.req, stats);
                                    return (
                                        <button key={i} onClick={() => !locked && selectAvatar(av.icon)} disabled={locked} className={` relative aspect - square rounded - 2xl flex items - center justify - center text - 3xl transition - all duration - 300 $ {
            locked ? 'bg-white/5 opacity-50 cursor-not-allowed' : 'bg-white/10 hover:bg-white/20 hover:scale-110 cursor-pointer hover:shadow-lg'
        }
        `} style={{animation:` bounce - in 0.3s cubic - bezier(0.34, 1.56, 0.64, 1)$ {
            i * 0.03
        }
        s backwards `}}>
                                            {av.icon}
                                            {locked && <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center"><Lock size={16} className="text-white"/></div>}
                                        </button>
                                    );
                                })}
                              </div>
                            </div>
                            {Object.entries(AVATAR_PACKS).filter(([k])=>k!=='classic').map(([packKey, pack]) => {
                                const player = players[avatarSelectorIndex];
                                const stats = playerStats.find(s => s.name === player);
                                const packLocked = pack.req ? isAvatarLocked(pack.req, stats) : false;
                                return (
                                    <div key={packKey}>
                                      <div className="flex items-center justify-between mb-2">
                                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">{pack.name}</div>
                                        {packLocked && <span className="text-[9px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-bold flex items-center gap-1"><Lock size={8}/> {pack.req.replace(':',': ')}</span>}
                                      </div>
                                      <div className={` grid grid - cols - 4 gap - 3 $ {
            packLocked ? 'opacity-30 pointer-events-none' : ''
        }
        `}>
                                        {pack.icons.map((icon, i) => (
                                            <button key={i} onClick={() => !packLocked && selectAvatar(icon)} disabled={packLocked} className="aspect-square rounded-2xl flex items-center justify-center text-3xl transition-all duration-300 bg-white/10 hover:bg-white/20 hover:scale-110 cursor-pointer hover:shadow-lg" style={{animation:` bounce - in 0.3s cubic - bezier(0.34, 1.56, 0.64, 1)$ {
            i * 0.02
        }
        s backwards `}}>
                                                {icon}
                                            </button>
                                        ))}
                                      </div>
                                    </div>
                                );
                            })}
                            <div className="mt-4 text-xs text-gray-400 text-center pb-4">Jouez pour débloquer de nouveaux avatars !</div>
                          </div>
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
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999] p-4 modal-backdrop">
                  <div className="modal-content w-full max-w-sm">
                    <div className="bg-gradient-to-b from-yellow-600 to-yellow-900 rounded-[40px] p-1 shadow-[0_0_60px_rgba(234,179,8,0.4)] glow-anim">
                      <div className="bg-slate-900 rounded-[38px] overflow-hidden p-8 text-center relative">
                          <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-yellow-400/20 to-transparent"></div>
                          <div className="absolute -top-10 -left-10 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl"></div>
                          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl"></div>
                          <div className="relative z-10" style={{animation:'trophy-float 3s ease-in-out infinite'}}>{(()=>{const w=getWinner()[0];const t=getPlayerTitle(playerStats.find(s=>s.name===w));return t?.icon?<span className="text-7xl mx-auto block text-center mb-4" style={{filter:'drop-shadow(0 0 20px rgba(250,204,21,0.5))'}}>{t.icon}</span>:<Trophy className="mx-auto text-yellow-400 mb-4 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]" size={64}/>;})()}</div>
                          <h2 className="text-sm font-black tracking-widest text-yellow-500 mb-2 relative z-10" style={{animation:'fade-in-scale 0.5s ease-out 0.2s backwards'}}>{suddenDeathWinner ? '⚔️ MORT SUBITE - WINNER' : 'THE WINNER IS'}</h2>
                          <div className="text-4xl font-black uppercase mb-6 relative z-10 text-white winner-glow" style={{animation:'victory-text 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.3s backwards'}}>{getWinner()[0]}</div>
                          <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
                              <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-sm border border-white/5 hover:bg-white/15 transition-all" style={{animation:'fade-in-scale 0.4s ease-out 0.4s backwards'}}><div className="text-2xl font-black text-white" style={{fontFamily:'JetBrains Mono, monospace'}}>{calcTotal(getWinner()[0])}</div><div className="text-[10px] opacity-100 uppercase text-yellow-100 font-bold">Points</div></div>
                              <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-sm border border-white/5 hover:bg-white/15 transition-all" style={{animation:'fade-in-scale 0.4s ease-out 0.5s backwards'}}><div className="text-2xl font-black text-white">{scores[getWinner()[0]]?.yams ? "1" : "0"}</div><div className="text-[10px] opacity-100 uppercase text-yellow-100 font-bold">Yams</div></div>
                          </div>
                          {players.length > 1 && getLoser() && (<div className="bg-red-500/20 p-4 rounded-2xl mb-4 relative z-10 border border-red-500/20" style={{animation:'fade-in-scale 0.4s ease-out 0.6s backwards'}}><p className="text-[10px] uppercase font-bold text-red-300 tracking-wider">⚡ Gage pour {getLoser().name}</p><p className="text-sm italic text-white font-bold mt-1">"{currentGage}"</p></div>)}
                          <div className="space-y-2 relative z-10" style={{animation:'fade-in-scale 0.4s ease-out 0.7s backwards'}}>
                              <input type="text" value={gameNote} onChange={e=>setGameNote(e.target.value)} placeholder="📝 Ajouter une note... (optionnel)" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 outline-none focus:border-yellow-400/50 transition-colors mb-1" maxLength={100}/>
                              <button onClick={saveGameFromModal} className="w-full py-4 bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-black rounded-2xl shadow-xl hover:scale-[1.03] transition-all duration-200 hover:shadow-yellow-500/40 hover:shadow-2xl active:scale-[0.98]">✨ ENREGISTRER</button>
                              <button onClick={()=>{
                                const lines = ['🎲 YAMS - Récapitulatif de partie','═'.repeat(40),'📅 '+new Date().toLocaleDateString('fr-FR',{day:'2-digit',month:'long',year:'numeric'}),'','🏆 CLASSEMENT:'];
                                players.map(p=>({name:p,score:calcTotal(p)})).sort((a,b)=>b.score-a.score).forEach((p,i)=>{lines.push(` $ {
            ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣'][i]
        }
        $ {
            p.name
        }
        : $ {
            p.score
        }
        pts `);});
                                lines.push('','📊 DÉTAIL:');
                                playableCats.forEach(cat=>{lines.push(` $ {
            cat.name
        }
        : $ {
            players.map(p => `${p}=${scores[p]?.[cat.id] ?? '-'}`).join(' | ')
        }
        `);});
                                lines.push('','📈 STATS:');
                                players.forEach(p=>{const up=calcUpper(p);lines.push(` $ {
            p
        }
        : Sup = $ {
            up
        }
        /63 ${up>=63?'✅ BONUS':'❌'} | Total=${calcTotal(p)}`);});
                                if(activeChallenge)lines.push('','🎯 Défi: '+activeChallenge.desc);
                                const blob=new Blob([lines.join('\n')],{type:'text/plain'});
                                const url=URL.createObjectURL(blob);const a=document.createElement(' a ');a.href=url;a.download=' yams - recap - '+new Date().toISOString().slice(0,10)+'.txt ';a.click();URL.revokeObjectURL(url);
                                pushNotif({icon:' 📄 ',title:' Récap exporté!',description:' Fichier texte téléchargé '});
                              }} className="w-full py-3 bg-white/5 text-white font-bold rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-sm"><FileText size={16}/> 📄 Exporter le récap</button>
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
                <div className={' bg - gradient - to - br '+T.card+' backdrop - blur - xl border border - white / 10 rounded - 3xl shadow - 2xl '+T.glow+' p - 4 sm: p - 6 '}>{isGameStarted() && !isGameComplete() && !hideTotals && !fogMode && <div className={`h-1 w-full rounded-t-3xl ${getTensionColor()}`}></div>}{globalXP > 0 && <div className="mb-2 mt-1">{(()=>{const xl=getXPLevel(globalXP);return <div className="flex items-center gap-2">
        <span className="text-xs font-black" style={{color:T.primary}}>{xl.icon} Niv.{xl.level}</span>
        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden"><div className="h-full rounded-full transition-all duration-1000" style={{width:xl.progress+' % ',background:`linear-gradient(90deg,${T.primary},${T.secondary})`}}/></div>
        <span className="text-[9px] text-gray-500 font-bold">{globalXP} XP</span>
        </div>;})()}
        </div>}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-4 mt-2">
        <div className="flex items-center gap-4"><div className="text-5xl float-anim">🎲</div><div><h1 className="text-3xl sm:text-4xl font-black text-white bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent" style={{letterSpacing:' - 0.02em '}}>YAMS</h1>
                    <p className="text-sm text-gray-400 font-medium tracking-wider">Score keeper premium</p>
                    </div></div>
                    <div className="flex gap-2">
                        <button onClick={()=>setShowLog(!showLog)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-lg"><ScrollText size={22} className="text-white"/></button>
                        <button onClick={()=>setShowSettings(!showSettings)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all duration-300 backdrop-blur-sm border border-white/10 group hover:scale-110 active:scale-95 hover:shadow-lg"><Settings size={22} className="text-white group-hover:rotate-90 transition-transform duration-300"/></button>
                    </div>
                  </div>

                  {showSettings&&<div className="mt-6 pt-6 border-t border-white/10 slide-down"><h3 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-2"><Palette size={14}/> Thème</h3><div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">{Object.keys(THEMES_CONFIG).map(k=>{const td=THEMES_CONFIG[k];return <button key={k} onClick={()=>{if(k!==theme){setThemeTransition(true);setTimeout(()=>{setTheme(k);setTimeout(()=>setThemeTransition(false),400);},200);}}} className={' relative overflow - hidden px - 4 py - 3 rounded - xl font - semibold transition - all flex items - center justify - center gap - 2 '+(theme===k?' ring - 2 ring - white scale - 105 ':' hover: scale - 105 ')} style={{background:' linear - gradient(135deg, '+td.primary+', '+td.secondary+')',color:' #fff '}}>{theme===k? <Check size={16}/> : td.icon}<span>{td.name}</span></button>;})}</div>
                      <div className="mt-6"><h3 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-2"><Dices size={14}/> Skin de Dés</h3><div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{Object.keys(DICE_SKINS).map(k=>{const s=DICE_SKINS[k];return <button key={k} onClick={()=>setDiceSkin(k)} className={`px-4 py-3 rounded-xl font-bold transition-all border-2 ${diceSkin===k?' border - white bg - white / 20 text - white ':' border - transparent bg - white / 5 text - gray - 400 hover: bg - white / 10 '}`}>{s.name}</button>;})}</div></div>
                      <div className="mt-6"><h3 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-2"><Image size={14}/> Skin de Grille</h3><div className="grid grid-cols-2 sm:grid-cols-5 gap-3">{Object.keys(GRID_SKINS).map(k=>{const s=GRID_SKINS[k];return <button key={k} onClick={()=>setGridSkin(k)} className={`px-4 py-3 rounded-xl font-bold transition-all border-2 ${gridSkin===k?' border - white bg - white / 20 text - white ':' border - transparent bg - white / 5 text - gray - 400 hover: bg - white / 10 '}`}>{s.name}</button>;})}</div></div>
                      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">👻</div><div><div className="text-white font-bold text-sm">Score Fantôme</div><div className="text-gray-400 text-[10px]">Affiche ta meilleure partie en filigrane</div></div></div><button onClick={()=>setShowGhostScores(!showGhostScores)} className={' relative w - 12 h - 6 rounded - full transition - all '+(showGhostScores?' bg - indigo - 500 ':' bg - gray - 600 ')}><div className={' absolute top - 1 left - 1 w - 4 h - 4 bg - white rounded - full transition - all '+(showGhostScores?' translate - x - 6 ':' ')}></div></button></div>
                      </div>
                      <div className="mt-6"><h3 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-2"><Terminal size={14}/> Police d' écriture <  / h3 >  < div className = "grid grid-cols-2 sm:grid-cols-5 gap-3" > {
            Object.entries(FONT_OPTIONS).map(([k, f]) =>  < button key = {
                    k
                }
                onClick = {
                    () => setCustomFont(k)
                }
                className = {
`px-4 py-3 rounded-xl font-bold transition-all border-2 ${customFont === k ? 'border-white bg-white/20 text-white' : 'border-transparent bg-white/5 text-gray-400 hover:bg-white/10'}`
                }
                style = { {
                        fontFamily: f.family
                    }
                }
                 > {
                f.name
            }
                 <  / button > )
        }
         <  / div >  <  / div >
         < div className = "mt-6" >  < h3 className = "text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-2" >  < Palette size = {
            14
        }
        /> Couleur par Joueur</h3 >  < div className = "space-y-2" > {
            players.map((p, pi) => {
                const current = playerColors[p] || PLAYER_COLORS[pi % PLAYER_COLORS.length].id;
                return  < div key = {
                    p
                }
                className = "flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10" >  < span className = "text-white font-bold flex-1 text-sm" > {
                    playerAvatars[p] || '👤'
                } {
                    p
                }
                 <  / span >  < div className = "flex gap-1.5" > {
                    PLAYER_COLORS.map(c =>  < button key = {
                            c.id
                        }
                        onClick = {
                            () => setPlayerColors({
                                ...playerColors,
                                [p]: c.id
                            })
                        }
                        className = {
                            'w-7 h-7 rounded-full border-2 transition-all hover:scale-110 ' + (current === c.id ? 'border-white scale-110' : 'border-transparent')
                        }
                        style = { {
                                background: c.hex
                            }
                        }
                        title = {
                            c.name
                        }
                        />)}</div >  <  / div > ;
                    })
                }
                     <  / div >  <  / div >
                     < div className = "mt-6" >  < h3 className = "text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-2" >  < Settings size = {
                        14
                    }
                    /> Options de jeu</h3 >  < div className = "grid grid-cols-1 md:grid-cols-2 gap-2" >
                         < div className = "flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all" >  < div className = "flex items-center gap-3" >  < div className = "w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400" >  < Sun size = {
                        20
                    }
                    /></div >  < div >  < div className = "text-white font-bold" > Anti - Veille <  / div >  < div className = "text-gray-400 text-xs" > Écran toujours allumé <  / div >  <  / div >  <  / div >  < button onClick = {
                        () => setWakeLockEnabled(!wakeLockEnabled)
                    }
                    className = {
                        'relative w-12 h-6 rounded-full transition-all ' + (wakeLockEnabled ? 'bg-blue-500' : 'bg-gray-600')
                    }
                     >  < div className = {
                        'absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all ' + (wakeLockEnabled ? 'translate-x-6' : '')
                    }
                     >  <  / div >  <  / button >  <  / div >
                     < div className = "flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all" >  < div className = "flex items-center gap-3" >  < div className = "w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400" >  < EyeOff size = {
                        20
                    }
                    /></div >  < div >  < div className = "text-white font-bold" > Brouillard de Guerre <  / div >  < div className = "text-gray-400 text-xs" > Scores adverses cachés <  / div >  <  / div >  <  / div >  < button onClick = {
                        () => setFogMode(!fogMode)
                    }
                    className = {
                        'relative w-12 h-6 rounded-full transition-all ' + (fogMode ? 'bg-purple-500' : 'bg-gray-600')
                    }
                     >  < div className = {
                        'absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all ' + (fogMode ? 'translate-x-6' : '')
                    }
                     >  <  / div >  <  / button >  <  / div >
                     < div className = "flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all" >  < div className = "flex items-center gap-3" >  < div className = "w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400" >  < Timer size = {
                        20
                    }
                    /></div >  < div >  < div className = "text-white font-bold" > Speed Run <  / div >  < div className = "text-gray-400 text-xs" > Chrono 30s par tour <  / div >  <  / div >  <  / div >  < button onClick = {
                        () => setSpeedMode(!speedMode)
                    }
                    className = {
                        'relative w-12 h-6 rounded-full transition-all ' + (speedMode ? 'bg-red-500' : 'bg-gray-600')
                    }
                     >  < div className = {
                        'absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all ' + (speedMode ? 'translate-x-6' : '')
                    }
                     >  <  / div >  <  / button >  <  / div >
                     < div className = "flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all" >  < div className = "flex items-center gap-3" >  < div className = "w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400" >  < Eye size = {
                        20
                    }
                    /></div >  < div >  < div className = "text-white font-bold" > Masquer les totaux <  / div >  < div className = "text-gray-400 text-xs" > Suspense garanti <  / div >  <  / div >  <  / div >  < button onClick = {
                        () => setHideTotals(!hideTotals)
                    }
                    className = {
                        'relative w-12 h-6 rounded-full transition-all ' + (hideTotals ? 'bg-green-500' : 'bg-gray-600')
                    }
                     >  < div className = {
                        'absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all ' + (hideTotals ? 'translate-x-6' : '')
                    }
                     >  <  / div >  <  / button >  <  / div >
                     < div className = "flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all" >  < div className = "flex items-center gap-3" >  < div className = "w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400" >  < Lock size = {
                        20
                    }
                    /></div >  < div >  < div className = "text-white font-bold" > Ordre Imposé <  / div >  < div className = "text-gray-400 text-xs" > Haut vers le bas obligatoire <  / div >  <  / div >  <  / div >  < button onClick = {
                        () => setImposedOrder(!imposedOrder)
                    }
                    className = {
                        'relative w-12 h-6 rounded-full transition-all ' + (imposedOrder ? 'bg-blue-500' : 'bg-gray-600')
                    }
                     >  < div className = {
                        'absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all ' + (imposedOrder ? 'translate-x-6' : '')
                    }
                     >  <  / div >  <  / button >  <  / div >
                     < div className = "flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all" >  < div className = "flex items-center gap-3" >  < div className = "w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400" >  < Flame size = {
                        20
                    }
                    /></div >  < div >  < div className = "text-white font-bold" > Mode Chaos <  / div >  < div className = "text-gray-400 text-xs" > Événements aléatoires <  / div >  <  / div >  <  / div >  < button onClick = {
                        () => setChaosMode(!chaosMode)
                    }
                    className = {
                        'relative w-12 h-6 rounded-full transition-all ' + (chaosMode ? 'bg-pink-500' : 'bg-gray-600')
                    }
                     >  < div className = {
                        'absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all ' + (chaosMode ? 'translate-x-6' : '')
                    }
                     >  <  / div >  <  / button >  <  / div >
                     < div className = "flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all" >  < div className = "flex items-center gap-3" >  < div className = "w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400" > 🎰 <  / div >  < div >  < div className = "text-white font-bold" > Mode Roulette <  / div >  < div className = "text-gray-400 text-xs" > Catégorie aléatoire à chaque tour <  / div >  <  / div >  <  / div >  < button onClick = {
                        () => setRouletteMode(!rouletteMode)
                    }
                    className = {
                        'relative w-12 h-6 rounded-full transition-all ' + (rouletteMode ? 'bg-amber-500' : 'bg-gray-600')
                    }
                     >  < div className = {
                        'absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all ' + (rouletteMode ? 'translate-x-6' : '')
                    }
                     >  <  / div >  <  / button >  <  / div >
                     < div className = "flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all col-span-1 md:col-span-2" >  < div className = "flex items-center gap-3" >  < div className = "w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center text-yellow-400" >  < Wand2 size = {
                        20
                    }
                    /></div >  < div >  < div className = "text-white font-bold" > Activer Jokers <  / div >  < div className = "text-gray-400 text-xs" > Malus - 10 pts / usage <  / div >  <  / div >  <  / div >  < div className = "flex items-center gap-4" >  < button onClick = {
                        () => setJokersEnabled(!jokersEnabled)
                    }
                    className = {
                        'relative w-12 h-6 rounded-full transition-all mr-4 ' + (jokersEnabled ? 'bg-yellow-500' : 'bg-gray-600')
                    }
                     >  < div className = {
                        'absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all ' + (jokersEnabled ? 'translate-x-6' : '')
                    }
                     >  <  / div >  <  / button > {
                    jokersEnabled &&  < div className = "flex items-center gap-2 bg-black/20 px-3 py-1 rounded-xl" >  < span className = "text-xs text-gray-400 font-bold uppercase" > Qté:  <  / span >  < select value = {
                        jokerMax
                    }
                    onChange = {
                        e => setJokerMax(parseInt(e.target.value))
                    }
                    disabled = {
                        isGameStarted()
                    }
                    className = {
`bg-transparent text-white font-bold text-center outline-none cursor-pointer ${isGameStarted() ? 'opacity-50 cursor-not-allowed' : ''}`
                    }
                     >  < option value = "1" className = "bg-slate-800" > 1 <  / option >  < option value = "2" className = "bg-slate-800" > 2 <  / option >  < option value = "3" className = "bg-slate-800" > 3 <  / option >  < option value = "4" className = "bg-slate-800" > 4 <  / option >  < option value = "5" className = "bg-slate-800" > 5 <  / option >  <  / select >  <  / div >
                }
                     <  / div >  <  / div >

                     < div className = "flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all col-span-1 md:col-span-2 flex-wrap gap-2" >
                         < div className = "flex items-center gap-3" >
                         < div className = "w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400" >  < Calendar size = {
                        20
                    }
                    /></div >
                     < div >
                     < div className = "text-white font-bold" > Gérer les Saisons <  / div >
                         < div className = "text-gray-400 text-xs" > Saison active:  < span className = "text-cyan-400 font-bold" > {
                        activeSeason
                    }
                     <  / span >  <  / div >
                     < p className = "text-[10px] text-gray-400 mt-1 flex items-center gap-1" >  < Info size = {
                        10
                    }
                    />Sert à regrouper vos parties par période ou événement.</p >
                     <  / div >
                     <  / div >
                     < div className = "flex flex-col gap-2 w-full sm:w-auto" >
                         < div className = "flex gap-2" > {
                        renamingSeason ? (
                             < div className = "flex gap-2 items-center" >
                                 < input type = "text" value = {
                                tempSeasonName
                            }
                            onChange = {
                                e => setTempSeasonName(e.target.value)
                            }
                            className = "bg-black/40 text-white px-2 py-1 rounded-lg text-sm border border-cyan-500/50" autoFocus /  >
                                 < button onClick = {
                                () => {
                                    if (tempSeasonName && !seasons.includes(tempSeasonName)) {
                                        const newSeasons = seasons.map(s => s === activeSeason ? tempSeasonName : s);
                                        setSeasons(newSeasons);
                                        setActiveSeason(tempSeasonName);
                                        setRenamingSeason(null);
                                    }
                                }
                            }
                            className = "p-1 bg-green-500/20 text-green-400 rounded" >  < Check size = {
                                14
                            }
                            /></button >
                             < button onClick = {
                                () => setRenamingSeason(null)
                            }
                            className = "p-1 bg-red-500/20 text-red-400 rounded" >  < X size = {
                                14
                            }
                            /></button >
                             <  / div > ) : (
                             < select value = {
                                activeSeason
                            }
                            onChange = {
                                e => setActiveSeason(e.target.value)
                            }
                            className = "bg-black/30 text-white px-3 py-2 rounded-xl text-sm font-bold border border-white/10 outline-none w-full sm:w-40" >
                                 < option value = "Aucune" > Aucune(Hors Saison) <  / option > {
                                seasons.map(s =>  < option key = {
                                        s
                                    }
                                    value = {
                                        s
                                    }
                                     > {
                                    s
                                }
                                     <  / option > )
                            }
                             <  / select > )
                    }{
                    activeSeason !== 'Aucune' && !renamingSeason && (
                         <  >
                         < button onClick = {
                            () => {
                                setTempSeasonName(activeSeason);
                                setRenamingSeason(true);
                            }
                        }
                        className = "p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl" title = "Renommer" >  < Edit3 size = {
                            16
                        }
                        /></button >
                         < button onClick = {
                            () => {
                                showConfirm(`Supprimer la saison "${activeSeason}" ?`, () => {
                                    setConfirmModal(null);
                                    setSeasons(seasons.filter(s => s !== activeSeason));
                                    setActiveSeason('Aucune');
                                });
                            }
                        }
                        className = "p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl" title = "Supprimer" >  < Trash2 size = {
                            16
                        }
                        /></button >
                         <  /  > )
                }
                     <  / div > {
                    activeSeason !== 'Aucune' && (
                         < div className = "flex gap-2 items-center w-full" >
                             < PenLine size = {
                            14
                        }
                        className = "text-gray-500" /  >
                             < input type = "text" placeholder = "Ajouter une description..." value = {
                            seasonDescriptions[activeSeason] || ''
                        }
                        onChange = {
                            e => updateSeasonDescription(activeSeason, e.target.value)
                        }
                        className = "bg-transparent text-gray-300 text-xs outline-none border-b border-white/10 focus:border-cyan-400 w-full" /  >
                             <  / div > )
                }
                     < div className = "flex gap-2 mt-1" >
                         < input type = "text" placeholder = "Nouvelle saison..." value = {
                        newSeasonName
                    }
                    onChange = {
                        e => setNewSeasonName(e.target.value)
                    }
                    className = "flex-1 bg-black/20 text-white px-3 py-2 rounded-xl text-xs outline-none border border-white/10 focus:border-white/30" /  >
                         < button onClick = {
                        () => {
                            if (newSeasonName && !seasons.includes(newSeasonName)) {
                                setSeasons([...seasons, newSeasonName]);
                                setActiveSeason(newSeasonName);
                                setNewSeasonName('');
                            }
                        }
                    }
                    className = "bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 p-2 rounded-xl" >  < Plus size = {
                        16
                    }
                    /></button >
                     <  / div >
                     <  / div >
                     <  / div >

                     <  / div >  <  / div >  <  / div >
                }

                 < div className = "flex gap-2 mt-4 flex-wrap" >
                     < button onClick = {
                    () => switchTab('game')
                }
                className = {
                    'flex-1 min-w-[80px] py-3 rounded-xl font-bold transition-all duration-300 hover-float active:scale-95 ' + (currentTab === 'game' ? 'text-white shadow