(() => {
  'use strict';

  // 7 Rainbow Colors matching daughter's original hand drawing (2026-11-01)
  // Pitch mapping: Helmholtz 小字1组 (Scientific Pitch Notation C4..B4 / 1 2 3 4 5 6 7)
  const COLOR_COLUMNS = [
    { id: 'red', shape: 'heart',     name: '草莓红',   solfege: '1 Do',  pitch: 'C4', hex: '#cf2027', lightHex: '#ff6b72', darkHex: '#9e1318', noteFreq: 261.63, unlockLvl: 1 },
    { id: 'pink', shape: 'round',    name: '蜜桃粉',   solfege: '2 Re',  pitch: 'D4', hex: '#f39bc3', lightHex: '#ffd0e6', darkHex: '#d46b9b', noteFreq: 293.66, unlockLvl: 3 },
    { id: 'green', shape: 'berry',   name: '苹果绿',   solfege: '3 Mi',  pitch: 'E4', hex: '#1d8f24', lightHex: '#5cd664', darkHex: '#116316', noteFreq: 329.63, unlockLvl: 2 },
    { id: 'purple', shape: 'grape',  name: '葡萄紫',   solfege: '4 Fa',  pitch: 'F4', hex: '#5d4b86', lightHex: '#9b86cc', darkHex: '#3f3161', noteFreq: 349.23, unlockLvl: 4 },
    { id: 'blue', shape: 'wrapped',    name: '蓝莓蓝',   solfege: '5 Sol', pitch: 'G4', hex: '#4650b0', lightHex: '#828cf2', darkHex: '#2b3380', noteFreq: 392.00, unlockLvl: 3 },
    { id: 'orange', shape: 'diamond',  name: '甜橙橘',   solfege: '6 La',  pitch: 'A4', hex: '#e36517', lightHex: '#ffa063', darkHex: '#ab4507', noteFreq: 440.00, unlockLvl: 5 },
    { id: 'skyblue', shape: 'drop', name: '苏打天蓝', solfege: '7 Ti',  pitch: 'B4', hex: '#298cd4', lightHex: '#73c6ff', darkHex: '#186299', noteFreq: 493.88, unlockLvl: 1 }
  ];

  const TOTAL_TUBES = COLOR_COLUMNS.length; // 7
  const CANDY_SHAPES = ['wrapped', 'heart', 'berry', 'star', 'round'];

  // 8 Progressive Stages (Difficulty & Mechanics gradually introduced)
  const LEVELS = [
    {
      id: 1,
      starScore: [45, 75],
      title: '初识彩虹',
      subtitle: '基础操作与色彩对应教学',
      tip: '注意：放错跑道会扣除 1 颗生命红心！对准同色跑道再轻点放下！',
      tags: ['新手教学', '双色体验', '生命红心机制'],
      activeCols: [0, 6], // Strawberry Red (0) and Soda Sky Blue (6)
      targetPerTube: 3,   // 3 candies per column (total 6)
      maxHearts: 5,       // 5 Hearts for beginner learning
      features: {
        tutorial: true,
        combo: false,
        rainbowCandy: false,
        multiplierGates: false,
        topMagic: false,
        hazards: false,
        bombs: false,
        fever: false
      },
      allowedSpecials: ['normal'],
      candyTimer: 7.5,    // Clear drop timer
      starConditions: { star3Combo: 1, star3Time: 40, star2Time: 75 }
    },
    {
      id: 2,
      starScore: [220, 500],
      title: '连击练习',
      subtitle: '红绿蓝三色与连击节奏',
      tip: '失误放错会扣除红心！连续放对 5 次可恢复 1 颗红心（Combo 救命）！',
      tags: ['连击进阶', '三色跑道', '连击回血'],
      activeCols: [0, 2, 6], // Red, Green, Sky Blue
      targetPerTube: 4,      // 4 candies per column (total 12)
      maxHearts: 4,
      features: {
        tutorial: false,
        combo: true,
        rainbowCandy: false,
        multiplierGates: false,
        topMagic: false,
        hazards: false,
        bombs: false,
        fever: false
      },
      allowedSpecials: ['normal'],
      candyTimer: 5.5,
      starConditions: { star3Combo: 3, star3Time: 55, star2Time: 95 }
    },
    {
      id: 3,
      starScore: [300, 650],
      title: '五彩斑斓',
      subtitle: '五色跑道与百搭彩虹糖',
      tip: '五色跑道开始守护 3 颗心！遇到百搭彩虹糖投进任意跑道都安全！',
      tags: ['五色彩虹', '3心挑战', '百搭彩虹糖'],
      activeCols: [0, 1, 2, 4, 6], // Red, Pink, Green, Blue, Sky Blue
      targetPerTube: 4,            // 4 candies per column (total 20)
      maxHearts: 3,
      features: {
        tutorial: false,
        combo: true,
        rainbowCandy: true,
        multiplierGates: false,
        topMagic: false,
        hazards: false,
        bombs: false,
        fever: false
      },
      allowedSpecials: ['normal', 'rainbow'],
      candyTimer: 4.8,
      starConditions: { star3Combo: 4, star3Time: 70, star2Time: 110 }
    },
    {
      id: 4,
      starScore: [600, 1300],
      title: '空中奇迹',
      subtitle: '倍增泡泡分裂与三连爆射',
      tip: '空中倍增门分裂糖果！注意：未对准跑道掉落依然会扣除红心！',
      tags: ['倍增泡泡门', '分裂翻倍', '轨迹预判'],
      activeCols: [0, 1, 2, 3, 4, 6], // 6 columns
      targetPerTube: 5,               // 5 candies per column (total 30)
      maxHearts: 3,
      features: {
        tutorial: false,
        combo: true,
        rainbowCandy: true,
        multiplierGates: true,
        topMagic: false,
        hazards: false,
        bombs: false,
        fever: false
      },
      allowedSpecials: ['normal', 'rainbow', 'triple'],
      candyTimer: 4.0,
      starConditions: { star3Combo: 6, star3Time: 85, star2Time: 130 }
    },
    {
      id: 5,
      starScore: [800, 1800],
      title: '画纸苏醒',
      subtitle: '释放顶部 6 大手绘魔法技能',
      tip: '顶部 6 大魔法觉醒！紫莓甘霖大招可救急补充糖果并净化全场！',
      tags: ['7色全开', '手绘大招', '盲盒惊喜'],
      activeCols: [0, 1, 2, 3, 4, 5, 6], // All 7 columns
      targetPerTube: 5,                  // 5 candies per column (total 35)
      maxHearts: 3,
      features: {
        tutorial: false,
        combo: true,
        rainbowCandy: true,
        multiplierGates: true,
        topMagic: true,
        hazards: false,
        bombs: false,
        fever: false
      },
      allowedSpecials: ['normal', 'rainbow', 'triple', 'mystery'],
      candyTimer: 3.6,
      starConditions: { star3Combo: 7, star3Time: 95, star2Time: 145 }
    },
    {
      id: 6,
      starScore: [1000, 2300],
      title: '调皮捣蛋鬼',
      subtitle: '除虫破冰与跑道保卫战',
      tip: '调皮捣蛋鬼来袭！8 秒内点击赶跑贪吃虫（否则咬碎红心）并轻点破冰！',
      tags: ['除虫防偷心', '破冰保卫', '互动障碍'],
      activeCols: [0, 1, 2, 3, 4, 5, 6],
      targetPerTube: 6,                  // 6 candies per column (total 42)
      maxHearts: 3,
      features: {
        tutorial: false,
        combo: true,
        rainbowCandy: true,
        multiplierGates: true,
        topMagic: true,
        hazards: true,
        hazardTypes: ['ice', 'bug'],
        bombs: false,
        fever: false
      },
      allowedSpecials: ['normal', 'rainbow', 'triple', 'mystery', 'shower'],
      candyTimer: 3.2,
      starConditions: { star3Combo: 8, star3Time: 110, star2Time: 165 }
    },
    {
      id: 7,
      starScore: [1300, 3000],
      title: '拆弹大师',
      subtitle: '空中拦截炸弹与微风挑战',
      tip: '坏坏炸弹掉入跑道会引爆并直接扣 1 心！空中点击炸弹进行拆弹！',
      tags: ['炸弹扣心', '空中拆弹', '调皮微风'],
      activeCols: [0, 1, 2, 3, 4, 5, 6],
      targetPerTube: 7,                  // 7 candies per column (total 49)
      maxHearts: 3,
      features: {
        tutorial: false,
        combo: true,
        rainbowCandy: true,
        multiplierGates: true,
        topMagic: true,
        hazards: true,
        hazardTypes: ['ice', 'bug', 'wind'],
        bombs: true,
        fever: true
      },
      allowedSpecials: ['normal', 'rainbow', 'triple', 'mystery', 'shower', 'bomb'],
      candyTimer: 2.8,
      starConditions: { star3Combo: 9, star3Time: 125, star2Time: 185 }
    },
    {
      id: 8,
      starScore: [2200, 5000],
      title: '彩虹大圆满',
      subtitle: '终极盛宴！7 柱各 10 颗集满 70 颗糖果',
      tip: '终极大决战！微风、炸弹、快速糖果全开，守护 3 颗心冲刺 70 颗大圆满！',
      tags: ['终极大考验', '守护3心', '70颗大圆满'],
      activeCols: [0, 1, 2, 3, 4, 5, 6],
      targetPerTube: 10,                 // 10 candies per column (total 70)
      maxHearts: 3,
      features: {
        tutorial: false,
        combo: true,
        rainbowCandy: true,
        multiplierGates: true,
        topMagic: true,
        hazards: true,
        hazardTypes: ['ice', 'bug', 'wind'],
        bombs: true,
        fever: true
      },
      allowedSpecials: ['normal', 'rainbow', 'triple', 'mystery', 'shower', 'bomb'],
      candyTimer: 2.5,
      starConditions: { star3Combo: 10, star3Time: 160, star2Time: 240 }
    }
  ];

  // 8 Collectible Hand-drawn Stickers
  const STICKER_DEFS = [
    { id: 'first_tube', icon: '🌈', title: '初遇彩虹柱', desc: '首次将任意1根彩虹柱装满规定数量糖果' },
    { id: 'combo_master', icon: '🔥', title: '十连神射手', desc: '单局达成 10 次以上连续精准投进' },
    { id: 'bubble_split', icon: '🫧', title: '泡泡分裂师', desc: '让落下的糖果穿过空中倍增门实现翻倍' },
    { id: 'magic_star', icon: '🌟', title: '画作唤醒者', desc: '激活并释放画纸顶部的手绘魔法标志' },
    { id: 'fever_party', icon: '😎', title: '彩虹暴走王', desc: '集满暴走能量，触发云朵彩虹喷泉狂欢' },
    { id: 'bomb_hero', icon: '💥', title: '拆弹小卫士', desc: '在半空中点击拍飞坏坏炸弹或赶走贪吃虫' },
    { id: 'speed_star', icon: '⚡', title: '闪电满星王', desc: '在任意挑战中斩获 ⭐⭐⭐ 评价' },
    { id: 'grand_champion', icon: '👑', title: '彩虹大满贯', desc: '通关全部 8 个关卡完成彩虹大圆满！' },
    { id: 'lucky_catcher', icon: '🍀', title: '幸运接星手', desc: '用云朵接住 3 颗从天而降的幸运金星' },
    { id: 'rainbow_row', icon: '🎹', title: '彩虹音阶师', desc: '让所有跑道齐平，奏响一排彩虹音阶' }
  ];

  // Combo tiers: score multiplier + big celebratory banner when reached
  const COMBO_TIERS = [
    { min: 3,  mult: 2, label: '好棒！ ×2',        color: '#1d8f24' },
    { min: 6,  mult: 3, label: '超厉害！ ×3',      color: '#298cd4' },
    { min: 10, mult: 4, label: '彩虹神手！ ×4',    color: '#e36517' },
    { min: 15, mult: 5, label: '无敌糖果王！ ×5',  color: '#ec4899' }
  ];

  // Endless mode (unlocked after clearing level 8): full rows disappear, the candy timer keeps speeding up
  const ENDLESS_BASE_TIMER = 3.6;
  const ENDLESS_CONFIG = {
    id: 'endless',
    title: '无尽糖果雨',
    subtitle: '排满一排就消除，看你能坚持多久！',
    tip: '让 7 根柱子一样高就能消掉一排，糖果会越来越快！',
    tags: ['无尽挑战', '消除横排', '最高分'],
    activeCols: [0, 1, 2, 3, 4, 5, 6],
    targetPerTube: 10,
    maxHearts: 3,
    features: {
      tutorial: false, combo: true, rainbowCandy: true, multiplierGates: true, topMagic: true,
      hazards: true, hazardTypes: ['ice', 'bug', 'wind'], bombs: true, fever: true
    },
    allowedSpecials: ['normal', 'rainbow', 'triple', 'mystery', 'shower', 'bomb'],
    candyTimer: ENDLESS_BASE_TIMER,
    starScore: [0, 0]
  };

  // Levels whose long runs get a checkpoint every 2 rainbow rows
  const CHECKPOINT_MIN_PER_TUBE = 7;

  // Lucky Candy Rain (from level 2): golden stars & rare hearts drift down from the sky; catch them with the cloud!
  const LUCKY_START_LEVEL = 2;

  // Real Acoustic Grand Piano Sample Engine (Yamaha Disklavier Pro Studio Samples)
  // Dual-mode audio engine: Web Audio AudioBuffer (polyphonic, low-latency) + HTML5 Audio pool fallback (for file:// protocol)
  const PIANO_NOTE_FREQS = [
    { note: 'B2',  freq: 123.47 },
    { note: 'C3',  freq: 130.81 },
    { note: 'D3',  freq: 146.83 },
    { note: 'Eb3', freq: 155.56 },
    { note: 'E3',  freq: 164.81 },
    { note: 'F3',  freq: 174.61 },
    { note: 'Gb3', freq: 185.00 },
    { note: 'G3',  freq: 196.00 },
    { note: 'A3',  freq: 220.00 },
    { note: 'B3',  freq: 246.94 },
    { note: 'C4',  freq: 261.63 },
    { note: 'D4',  freq: 293.66 },
    { note: 'E4',  freq: 329.63 },
    { note: 'F4',  freq: 349.23 },
    { note: 'G4',  freq: 392.00 },
    { note: 'A4',  freq: 440.00 },
    { note: 'B4',  freq: 493.88 },
    { note: 'C5',  freq: 523.25 },
    { note: 'D5',  freq: 587.33 },
    { note: 'Eb5', freq: 622.25 },
    { note: 'E5',  freq: 659.25 },
    { note: 'F5',  freq: 698.46 },
    { note: 'G5',  freq: 783.99 },
    { note: 'A5',  freq: 880.00 },
    { note: 'B5',  freq: 987.77 },
    { note: 'C6',  freq: 1046.50 },
    { note: 'D6',  freq: 1174.66 },
    { note: 'E6',  freq: 1318.51 },
    { note: 'G6',  freq: 1567.98 },
    { note: 'A6',  freq: 1760.00 },
    { note: 'C7',  freq: 2093.00 }
  ];

  function getClosestPianoNote(freq) {
    if (typeof freq === 'string') return freq;
    if (!freq || typeof freq !== 'number') return 'C4';
    let closest = PIANO_NOTE_FREQS[0];
    let minDiff = Math.abs(freq - closest.freq);
    for (let i = 1; i < PIANO_NOTE_FREQS.length; i++) {
      const diff = Math.abs(freq - PIANO_NOTE_FREQS[i].freq);
      if (diff < minDiff) {
        minDiff = diff;
        closest = PIANO_NOTE_FREQS[i];
      }
    }
    return closest.note;
  }

  class SoundFX {
    constructor() {
      this.enabled = true;
      this.bgmEnabled = false;
      this.ctx = null;
      this.masterGain = null;
      this.compressor = null;
      this.bgmNoteIdx = 0;
      this.bgmTimer = 0;

      // Real piano sample caches
      this.audioBuffers = {}; // Decoded Web Audio AudioBuffers
      this.rawBuffers = {};   // Fetched (not yet decoded) MP3 ArrayBuffers
      this.decoding = {};     // Notes currently being decoded
      this.fetchFailed = {};  // Notes that could not be fetched (e.g. file:// protocol)
      this.htmlAudio = {};    // Lazily created HTML5 Audio fallback (only when Web Audio can't be used)
      this.voices = [];       // Active Web Audio voices, capped to keep mobile CPUs happy
      this.maxVoices = 20;
      this.isPreloaded = false;
      this.unlocked = false;
      this.resuming = false;
    }

    // Cheap to call on every gesture / note: creates the context once, then only resumes when needed.
    init() {
      if (!this.ctx && (typeof window !== 'undefined')) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          try {
            this.ctx = new AudioCtx();
          } catch (_) {}
        }
        if (this.ctx) {
          this.setupChain();
          this.decodeEmbedded();
          this.decodeAllFetched();
        }
      }
      if (this.ctx) {
        // iOS/iPadOS can leave the context 'interrupted' (e.g. after switching apps), not just 'suspended'
        if (this.ctx.state !== 'running' && !this.resuming) {
          this.resuming = true;
          const done = () => { this.resuming = false; };
          try {
            const p = this.ctx.resume();
            if (p && typeof p.then === 'function') p.then(done, done); else done();
          } catch (_) { done(); }
        }
        // iOS unlock: start a silent buffer inside the first user gesture
        if (!this.unlocked) {
          try {
            const silent = this.ctx.createBuffer(1, 1, 22050);
            const src = this.ctx.createBufferSource();
            src.buffer = silent;
            src.connect(this.ctx.destination);
            src.start(0);
            this.unlocked = true;
          } catch (_) {}
        }
      }
      this.preload();
    }

    setupChain() {
      try {
        // Master gain with default 2.4x volume boost (~+7.6 dB)
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(2.4, this.ctx.currentTime);

        // Dynamics compressor to avoid digital clipping while keeping the piano loud
        this.compressor = this.ctx.createDynamicsCompressor();
        this.compressor.threshold.setValueAtTime(-12, this.ctx.currentTime);
        this.compressor.knee.setValueAtTime(8, this.ctx.currentTime);
        this.compressor.ratio.setValueAtTime(3.5, this.ctx.currentTime);
        this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
        this.compressor.release.setValueAtTime(0.22, this.ctx.currentTime);

        // Signal chain: noteGain -> masterGain -> compressor -> destination
        this.masterGain.connect(this.compressor);
        this.compressor.connect(this.ctx.destination);
      } catch (_) {
        this.masterGain = null;
        this.compressor = null;
      }
    }

    // Decode with the callback form: older iOS Safari does not return a Promise from decodeAudioData
    decode(name, arrayBuffer) {
      if (!this.ctx || !arrayBuffer || this.audioBuffers[name] || this.decoding[name]) return;
      this.decoding[name] = true;
      const ok = (decoded) => {
        this.decoding[name] = false;
        if (decoded) this.audioBuffers[name] = decoded;
      };
      const fail = () => { this.decoding[name] = false; };
      try {
        const p = this.ctx.decodeAudioData(arrayBuffer, ok, fail);
        if (p && typeof p.catch === 'function') p.catch(fail);
      } catch (_) { fail(); }
    }

    decodeAllFetched() {
      Object.keys(this.rawBuffers).forEach(name => {
        const ab = this.rawBuffers[name];
        delete this.rawBuffers[name];
        this.decode(name, ab);
      });
    }

    // Embedded base64 landing notes: works offline under file:///
    decodeEmbedded() {
      if (typeof window === 'undefined' || !window.EMBEDDED_LANDING_NOTES || typeof window.atob !== 'function') return;
      Object.keys(window.EMBEDDED_LANDING_NOTES).forEach(name => {
        if (this.audioBuffers[name] || this.decoding[name]) return;
        try {
          const binary = window.atob(window.EMBEDDED_LANDING_NOTES[name]);
          const bytes = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
          this.decode(name, bytes.buffer);
        } catch (_) {}
      });
    }

    // Fetch all real piano MP3 samples up front (no AudioContext needed); decode once a context exists
    preload() {
      if (this.isPreloaded) return;
      this.isPreloaded = true;

      const noteList = [
        'B2', 'C3', 'D3', 'Eb3', 'E3', 'F3', 'Gb3', 'G3', 'A3', 'B3',
        'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4',
        'C5', 'D5', 'Eb5', 'E5', 'F5', 'G5', 'A5', 'B5',
        'C6', 'D6', 'E6', 'G6', 'A6', 'C7'
      ];

      if (typeof fetch !== 'function') {
        noteList.forEach(name => { this.fetchFailed[name] = true; });
        return;
      }
      noteList.forEach(name => {
        fetch(`sounds/${name}.mp3`)
          .then(res => {
            if (!res.ok) throw new Error('Fetch failed');
            return res.arrayBuffer();
          })
          .then(buf => {
            if (this.ctx) this.decode(name, buf);
            else this.rawBuffers[name] = buf;
          })
          .catch(() => { this.fetchFailed[name] = true; });
      });
    }

    // HTML5 Audio fallback, one reusable element per note (never cloned per play: that stalls iOS)
    playHtmlAudio(noteName) {
      if (typeof Audio === 'undefined') return false;
      try {
        let a = this.htmlAudio[noteName];
        if (!a) {
          a = new Audio(`sounds/${noteName}.mp3`);
          a.preload = 'auto';
          this.htmlAudio[noteName] = a;
        }
        a.volume = 1.0;
        try { a.currentTime = 0; } catch (_) {}
        const p = a.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
        return true;
      } catch (_) {
        return false;
      }
    }

    // Play real acoustic grand piano note by name (e.g. 'C4', 'D4', 'E4')
    playRealPianoNote(noteName, volume = 1.0, delay = 0) {
      if (!this.enabled) return;
      this.init();

      // Option 1: Web Audio decoded AudioBuffer, scheduled on the audio clock (no timers, no DOM elements)
      if (this.ctx && this.audioBuffers[noteName]) {
        try {
          const when = this.ctx.currentTime + Math.max(0, delay || 0);
          const src = this.ctx.createBufferSource();
          src.buffer = this.audioBuffers[noteName];
          const gainNode = this.ctx.createGain();
          gainNode.gain.setValueAtTime(Math.max(0.01, Math.min(3.0, volume * 1.5)), when);
          src.connect(gainNode);
          gainNode.connect(this.masterGain || this.ctx.destination);

          // Voice cap: quickly fade out and stop the oldest voice
          if (this.voices.length >= this.maxVoices) {
            const old = this.voices.shift();
            try {
              const t = this.ctx.currentTime;
              old.gain.gain.cancelScheduledValues(t);
              old.gain.gain.setValueAtTime(old.gain.gain.value, t);
              old.gain.gain.linearRampToValueAtTime(0, t + 0.04);
              old.src.stop(t + 0.05);
            } catch (_) {}
          }
          const voice = { src, gain: gainNode };
          this.voices.push(voice);
          src.onended = () => {
            const i = this.voices.indexOf(voice);
            if (i >= 0) this.voices.splice(i, 1);
            try { gainNode.disconnect(); } catch (_) {}
          };
          src.start(when);
          return;
        } catch (_) {}
      }

      // Sample still loading under Web Audio: use the cheap synth instead of spawning media elements
      if (this.ctx && !this.fetchFailed[noteName]) {
        this.playPianoToneSynth(noteName, volume, delay);
        return;
      }

      // Option 2: HTML5 Audio (no Web Audio, or sample could not be fetched e.g. file://)
      const playExec = () => {
        if (!this.playHtmlAudio(noteName)) this.playPianoToneSynth(noteName, volume);
      };
      if (delay > 0) {
        setTimeout(playExec, Math.round(delay * 1000));
      } else {
        playExec();
      }
    }

    // Fallback synthesizer if sample cannot be loaded
    playPianoToneSynth(freqOrNote, volume = 0.5, delay = 0) {
      if (!this.enabled) return;
      if (!this.ctx) return;
      const freq = typeof freqOrNote === 'number'
        ? freqOrNote
        : (PIANO_NOTE_FREQS.find(p => p.note === freqOrNote)?.freq || 261.63);
      try {
        const now = this.ctx.currentTime + Math.max(0, delay || 0);
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(Math.min(1.0, volume * 0.75), now + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);
        osc.connect(gain);
        if (this.masterGain) {
          gain.connect(this.masterGain);
        } else {
          gain.connect(this.ctx.destination);
        }
        osc.start(now);
        osc.stop(now + 0.7);
      } catch (_) {}
    }

    // Play piano tone by frequency or note name
    playPianoTone(freq, duration = 0.85, volume = 0.45, delay = 0, velocity = 1) {
      const noteName = typeof freq === 'string' ? freq : getClosestPianoNote(freq);
      const vol = Math.max(0.1, Math.min(1.5, (volume || 0.45) * (velocity || 1) * 3.2));
      this.playRealPianoNote(noteName, vol, delay);
    }

    playTone(freq, duration = 0.25, type = 'triangle', volume = 0.35, delay = 0) {
      this.playPianoTone(freq, duration, volume, delay);
    }

    // Warm Real Piano Music Box BGM
    updateBGM(dt, isFever) {
      if (!this.bgmEnabled || !this.enabled) return;
      this.init();

      const tempo = isFever ? 0.16 : 0.28;
      this.bgmTimer -= dt;
      if (this.bgmTimer <= 0) {
        this.bgmTimer = tempo;
        const melody = [
          'C5', 'E5', 'G5', 'E5', 'A5', 'G5', 'E5', 'D5',
          'C5', 'D5', 'E5', 'G5', 'C6', 'A5', 'G5', 'E5'
        ];
        const note = melody[this.bgmNoteIdx % melody.length];
        this.bgmNoteIdx++;
        this.playRealPianoNote(note, 0.55, 0);
      }
    }

    // 1. Candy Release: Silent as user requested
    playDrop() {
      // Kept silent so only landing tones are heard
    }

    // 2. Candy Landing in Column: Strictly Helmholtz 小字1组 (1 2 3 4 5 6 7 -> C4..B4)
    // Pure single acoustic Grand Piano note for ear training (听音/练耳). No chords, no harmony layers!
    playMatch(colIndex) {
      const col = COLOR_COLUMNS[colIndex] || COLOR_COLUMNS[0];
      const rootNote = col.pitch || 'C4'; // 'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'

      // Strictly ONE single acoustic Grand Piano note!
      this.playRealPianoNote(rootNote, 1.4, 0);
    }

    // 3. Multiplier Gate: Silent during drop so it doesn't interfere with landing note ear training
    playGateMultiply() {
      // Kept silent for pure ear-training experience
    }

    // 4. Magic Skill: Classical rolling real piano broken chord
    playMagicSkill() {
      const chord = ['C4', 'G4', 'C5', 'E5', 'G5', 'C6'];
      chord.forEach((n, i) => this.playRealPianoNote(n, 1.25, i * 0.055));
    }

    // 5. Swat Caterpillar / Crack Ice: Energetic real piano staccato octave strike
    playSwat() {
      this.playRealPianoNote('A4', 1.25, 0);
      this.playRealPianoNote('A5', 1.10, 0.015);
    }

    // 6. Fever Rainbow Mode: Brilliant upward real piano glissando
    playFeverStart() {
      const gliss = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'G5', 'C6'];
      gliss.forEach((n, i) => this.playRealPianoNote(n, 1.10, i * 0.038));
    }

    // 6b. Rainbow Row: ascending scale of the active columns' own pitches (Do-Re-Mi... ear-training friendly)
    // Starts after a short pause so the landing note is still heard cleanly on its own.
    playRowScale(colIdxList, startDelay = 0.45, step = 0.11) {
      colIdxList.forEach((cIdx, i) => {
        const col = COLOR_COLUMNS[cIdx];
        if (col) this.playRealPianoNote(col.pitch, 1.15, startDelay + i * step);
      });
      this.playRealPianoNote('C5', 1.2, startDelay + colIdxList.length * step);
    }

    // 6c. Lucky catch: soft high sparkle note
    playLuckyCatch(isHeart = false) {
      this.playRealPianoNote(isHeart ? 'E6' : 'C6', 0.85, 0);
      if (isHeart) this.playRealPianoNote('G6', 0.75, 0.07);
    }

    // 7. Mismatch / Misplacement: Single low acoustic piano note (clean, no chord cluster)
    playMismatch() {
      this.playRealPianoNote('D3', 1.20, 0);
    }

    // 8. Heart Lost / Danger: Single low acoustic piano warning note (clean, no chord cluster)
    playHeartLost() {
      this.playRealPianoNote('B2', 1.35, 0);
    }

    // 9. Defeat: Melancholy descending real piano chords
    playDefeat() {
      const chords = [
        { notes: ['A3', 'C4', 'E4'], t: 0 },
        { notes: ['G3', 'B3', 'D4'], t: 0.38 },
        { notes: ['F3', 'A3', 'C4'], t: 0.76 },
        { notes: ['E3', 'G3', 'B3'], t: 1.18 }
      ];
      chords.forEach(c => {
        c.notes.forEach(n => this.playRealPianoNote(n, 1.20, c.t));
      });
    }

    // 10. Tube Completed: Kept silent during drop so it doesn't mask the column landing pitch
    playTubeComplete(colIndex = 0) {
      // Kept silent for pure ear-training experience
    }

    // 11. Level Clear: Grand piano celebratory arpeggio
    playLevelClear() {
      const notes = ['C4', 'G4', 'C5', 'E5', 'G5', 'C6'];
      notes.forEach((n, idx) => {
        this.playRealPianoNote(n, 1.30, idx * 0.065);
      });
    }

    // 12. Star Chime: Crystalline real piano chimes
    playStarChime(starIdx) {
      const chimes = ['E6', 'G6', 'C7'];
      const note = chimes[starIdx % 3] || 'C7';
      this.playRealPianoNote(note, 1.25, 0);
    }

    // 13. Victory Fanfare: Grand piano triumphant fanfare
    playVictory() {
      const steps = [
        { notes: ['C4', 'E4', 'G4'], t: 0 },
        { notes: ['F4', 'A4', 'C5'], t: 0.22 },
        { notes: ['G4', 'B4', 'D5'], t: 0.44 },
        { notes: ['C3', 'G3', 'C4', 'E4', 'G4', 'C5', 'E5', 'G5', 'C6'], t: 0.68 }
      ];
      steps.forEach(st => {
        st.notes.forEach(n => this.playRealPianoNote(n, 1.25, st.t));
      });
    }
  }

  const sfx = new SoundFX();
  sfx.preload();
  // iOS only lets audio start inside a user gesture: unlock/resume on any touch, click or key press
  ['touchend', 'pointerdown', 'click', 'keydown'].forEach(evt => {
    document.addEventListener(evt, () => { if (sfx.enabled) sfx.init(); }, { capture: true, passive: true });
  });
  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');

  // Game Progression State
  const state = {
    width: 600,
    height: 800,
    dpr: 1,
    currentLevel: 1,     // 1..8
    unlockedLevel: 1,    // 1..8
    levelStars: {},      // { 1: 3, 2: 2, ... }
    levelHighScores: {}, // { 1: 350, ... }
    isEndlessMode: false,
    score: 0,
    combo: 0,
    maxCombo: 0,
    hearts: 5,
    maxHearts: 5,
    levelCollected: 0,
    totalCollectedAllLevels: 0,
    levelStartTime: Date.now(),
    isLevelCleared: false,
    isLevelFailed: false,
    isGrandFinale: false,
    screenShake: 0,
    errorFlashTimer: 0,
    errorShockwaves: [],
    errorHeartPrompt: null,
    heartLossFlash: 0,
    playTime: 0,
    introVisible: false,
    reduceMotion: false,
    audioMode: 'sfx', // 'sfx' | 'all' | 'mute'
    colWeights: [1, 1, 1, 1, 1, 1, 1],
    tapStartOnCloud: false,
    tapStartCloudCol: -1,
    driftingCandies: [],
    blockedMsgCd: 0,
    checkpoint: null,
    usedCheckpoint: false,
    endlessRows: 0,
    endlessBest: 0,
    // Fever Rainbow Mode
    feverGauge: 0,
    feverTimer: 0,
    feverSpawnCd: 0,
    // Active Magic Buffs
    magnetTimer: 0,
    windForce: 0,
    windTimer: 0,
    // Columns & tubes
    columnCounts: [0, 0, 0, 0, 0, 0, 0],
    columnStacks: [[], [], [], [], [], [], []],
    columnHighlight: [0, 0, 0, 0, 0, 0, 0],
    columnFullGlow: [0, 0, 0, 0, 0, 0, 0],
    columnFrozen: [0, 0, 0, 0, 0, 0, 0],
    columnPunchY: [0, 0, 0, 0, 0, 0, 0],
    columnBugs: [null, null, null, null, null, null, null],
    // Tutorial state (active in Level 1)
    tutorialStep: 0, // 0: guide drag, 1: guide align, 2: guide drop, 3: accomplished first, 4: done
    tutorialTimer: 0,
    tutorialPraiseTimer: 0,
    cloud: {
      x: 300,
      targetX: 300,
      y: 165,
      width: 240,
      height: 58,
      vx: 0,
      eyeOffsetX: 0,
      mood: 'happy',
      moodTimer: 0,
      bounceY: 0,
      angle: 0,
      scaleX: 1,
      scaleY: 1
    },
    activeCandy: null,
    nextCandy: null,
    fallingCandies: [],
    multiplierGates: [],
    gateSpawnTimer: 2.5,
    hazardSpawnTimer: 9.0,
    particles: [],
    confetti: [],
    floatingTexts: [],
    // Fun layer: combo banner, rainbow rows, lucky candy rain
    banner: null,
    rowsCompleted: 0,
    rowSweeps: [],
    luckyCandies: [],
    luckySpawnTimer: 4.0,
    luckyCount: 0,
    topIconBounce: [0, 0, 0, 0, 0, 0],
    topIconCharge: [0, 0, 0, 0, 0, 0],
    topIconPos: [],
    unlockedStickers: {},
    newlyUnlockedThisRun: [],
    keys: { left: false, right: false },
    isDragging: false,
    dragOffsetX: 0,
    layout: {
      topIconsY: 46,
      cloudY: 128,
      columnsTopY: 225,
      slotHeight: 40,
      candyRadius: 19,
      storageTopY: 285,
      storageBottomY: 780,
      columns: []
    }
  };

  // Marker strokes texture for authentic hand-drawn feel
  const markerStrokes = COLOR_COLUMNS.map(() => {
    const strokes = [];
    for (let i = 0; i < 22; i++) {
      strokes.push({
        rx: Math.random(),
        ry: Math.random(),
        rw: 0.08 + Math.random() * 0.18,
        rh: 0.12 + Math.random() * 0.40,
        alpha: 0.05 + Math.random() * 0.08,
        light: Math.random() > 0.45
      });
    }
    return strokes;
  });

  function getLevelConfig(lvl) {
    if (lvl === undefined) {
      if (state.isEndlessMode) return ENDLESS_CONFIG;
      lvl = state.currentLevel;
    }
    return LEVELS[Math.max(0, Math.min(LEVELS.length - 1, lvl - 1))] || LEVELS[0];
  }

  function getStarScores(lvlConfig = getLevelConfig()) {
    return lvlConfig.starScore || [0, 0];
  }

  // Stars come from score (combo, speed and rainbow rows all count); a no-heart-lost run earns +1 star
  function computeStars() {
    const [s2, s3] = getStarScores();
    let stars = state.score >= s3 ? 3 : (state.score >= s2 ? 2 : 1);
    const flawless = state.hearts >= state.maxHearts && !state.usedCheckpoint;
    if (flawless) stars = Math.min(3, stars + 1);
    return { stars, flawless, s2, s3 };
  }

  function getLevelTotalTarget(lvlConfig = getLevelConfig()) {
    return lvlConfig.activeCols.length * lvlConfig.targetPerTube;
  }

  // Tactile Haptic Vibration Feedback (Vibration API for Touch/Mobile Devices)
  function triggerHaptic(type = 'drop') {
    const nav = (typeof window !== 'undefined' && window.navigator) || (typeof navigator !== 'undefined' ? navigator : null);
    if (nav && typeof nav.vibrate === 'function') {
      try {
        if (type === 'drop') {
          nav.vibrate(12);
        } else if (type === 'match') {
          nav.vibrate(22);
        } else if (type === 'combo') {
          nav.vibrate([15, 30, 25]);
        } else if (type === 'error') {
          nav.vibrate([40, 50, 60]);
        } else if (type === 'clear') {
          nav.vibrate([30, 40, 50, 40, 60]);
        } else if (type === 'swat') {
          nav.vibrate(18);
        }
      } catch (_) {}
    }
  }

  function computeLayout() {
    const rect = canvas.parentElement.getBoundingClientRect();
    state.dpr = Math.min(window.devicePixelRatio || 1, 2);
    state.width = Math.round(rect.width) || 600;
    state.height = Math.round(rect.height) || 600;

    canvas.width = Math.round(state.width * state.dpr);
    canvas.height = Math.round(state.height * state.dpr);

    const W = state.width;
    const H = state.height;

    state.layout.topIconsY = Math.max(34, H * 0.065);
    state.cloud.width = Math.min(Math.max(W * 0.38, 160), 280);
    state.cloud.height = Math.min(Math.max(H * 0.075, 42), 56);
    state.layout.cloudY = state.layout.topIconsY + state.cloud.height * 0.85 + 24;
    state.cloud.y = state.layout.cloudY;
    state.layout.columnsTopY = state.layout.cloudY + state.cloud.height * 0.5 + Math.max(38, H * 0.062);

    // 7 columns: open lanes share the width, locked lanes shrink (animated in update)
    state.layout.sideMargin = Math.max(4, W * 0.012);
    layoutColumns();

    // Candy vertical stacking area:
    state.layout.storageTopY = state.layout.columnsTopY + 54;
    state.layout.storageBottomY = H - 18;
    const storageH = state.layout.storageBottomY - state.layout.storageTopY;

    // Support up to 10 slots stacked vertically
    state.layout.slotHeight = (storageH - 6) / 10;
    const tw = getTargetColWeights();
    const colW = (W - state.layout.sideMargin * 2) / tw.reduce((a, b) => a + b, 0);
    state.layout.candyRadius = Math.max(15, Math.min(colW * 0.38, state.layout.slotHeight * 0.44, 26));

    clampCloudX();
  }

  const LOCKED_COL_WEIGHT = 0.38;

  function getTargetColWeights() {
    const active = getLevelConfig().activeCols;
    return COLOR_COLUMNS.map((_, i) => (active.includes(i) ? 1 : LOCKED_COL_WEIGHT));
  }

  function layoutColumns() {
    const side = state.layout.sideMargin || 4;
    const usableW = state.width - side * 2;
    const w = state.colWeights;
    const total = w.reduce((a, b) => a + b, 0);
    let curX = side;
    state.layout.columns = COLOR_COLUMNS.map((col, idx) => {
      const width = (usableW * w[idx]) / total;
      const rect = {
        index: idx,
        x: curX,
        width,
        centerX: curX + width / 2,
        topY: state.layout.columnsTopY + Math.sin(idx * 1.7) * 3
      };
      curX += width;
      return rect;
    });
  }

  // Keep an x position at the same relative spot inside its column across a relayout
  function remapXAcrossLayout(x, oldCols) {
    let idx = oldCols.findIndex(c => x >= c.x && x <= c.x + c.width);
    if (idx < 0) idx = x < oldCols[0].x ? 0 : oldCols.length - 1;
    const o = oldCols[idx];
    const n = state.layout.columns[idx];
    const f = o.width > 0 ? (x - o.x) / o.width : 0.5;
    return n.x + Math.max(0, Math.min(1, f)) * n.width;
  }

  function updateColumnWidths(dt) {
    const target = getTargetColWeights();
    let changed = false;
    for (let i = 0; i < target.length; i++) {
      const d = target[i] - state.colWeights[i];
      if (Math.abs(d) > 0.002) {
        state.colWeights[i] += d * Math.min(1, dt * 5);
        changed = true;
      } else if (d !== 0) {
        state.colWeights[i] = target[i];
        changed = true;
      }
    }
    if (!changed || !state.layout.columns.length) return;
    const oldCols = state.layout.columns.map(c => ({ x: c.x, width: c.width }));
    layoutColumns();
    state.cloud.x = remapXAcrossLayout(state.cloud.x, oldCols);
    state.cloud.targetX = remapXAcrossLayout(state.cloud.targetX, oldCols);
    clampCloudX();
  }

  function clampCloudX() {
    if (!state.layout.columns.length) return;
    const minX = state.layout.columns[0].centerX;
    const maxX = state.layout.columns[state.layout.columns.length - 1].centerX;
    state.cloud.x = Math.max(minX, Math.min(maxX, state.cloud.x));
    state.cloud.targetX = Math.max(minX, Math.min(maxX, state.cloud.targetX));
  }

  function getColumnIndexAtX(x) {
    const cols = state.layout.columns;
    for (let i = 0; i < cols.length; i++) {
      if (x >= cols[i].x && x <= cols[i].x + cols[i].width) return i;
    }
    if (cols.length && x < cols[0].x) return 0;
    return cols.length - 1;
  }

  function getSlotCenterY(slotIndex) {
    const base = state.layout.storageBottomY - state.layout.candyRadius;
    return base - slotIndex * state.layout.slotHeight;
  }

  // Save / Load Level Progress & Stickers
  function loadSavedProgress() {
    try {
      const raw = localStorage.getItem('rainbow_candy_levels_v2');
      if (raw) {
        const data = JSON.parse(raw);
        state.unlockedLevel = Math.max(1, Math.min(LEVELS.length, data.unlockedLevel || 1));
        state.currentLevel = Math.max(1, Math.min(state.unlockedLevel, data.currentLevel || 1));
        state.levelStars = data.levelStars || {};
        state.levelHighScores = data.levelHighScores || {};
        state.endlessBest = data.endlessBest || 0;
      }
    } catch (e) {
      state.unlockedLevel = 1;
      state.currentLevel = 1;
      state.levelStars = {};
    }

    try {
      const rawStickers = localStorage.getItem('rainbow_candy_stickers_v2');
      if (rawStickers) state.unlockedStickers = JSON.parse(rawStickers) || {};
    } catch (e) {
      state.unlockedStickers = {};
    }
  }

  function saveProgress() {
    try {
      const data = {
        unlockedLevel: state.unlockedLevel,
        currentLevel: state.currentLevel,
        levelStars: state.levelStars,
        levelHighScores: state.levelHighScores,
        endlessBest: state.endlessBest
      };
      localStorage.setItem('rainbow_candy_levels_v2', JSON.stringify(data));
      localStorage.setItem('rainbow_candy_stickers_v2', JSON.stringify(state.unlockedStickers));
    } catch (e) {}
  }

  function unlockSticker(id) {
    if (state.unlockedStickers[id]) return;
    state.unlockedStickers[id] = true;
    state.newlyUnlockedThisRun.push(id);
    saveProgress();
    const def = STICKER_DEFS.find(s => s.id === id);
    if (def) {
      addFloatingText(state.width / 2, state.cloud.y - 28, `🏅 新贴纸 ${def.icon} ${def.title}`, '#d97706', 1.25);
    }
  }

  function renderStickerModal() {
    const container = document.getElementById('sticker-grid-container');
    const countEl = document.getElementById('sticker-count-label');
    if (!container) return;
    let unlockedCount = 0;
    container.innerHTML = STICKER_DEFS.map(st => {
      const isUnlocked = !!state.unlockedStickers[st.id];
      if (isUnlocked) unlockedCount++;
      return `
        <div class="sticker-card ${isUnlocked ? 'unlocked' : 'locked'}">
          <div class="sticker-icon">${isUnlocked ? st.icon : '🔒'}</div>
          <div class="sticker-info">
            <h4>${st.title}</h4>
            <p>${st.desc}</p>
          </div>
        </div>
      `;
    }).join('');
    if (countEl) countEl.textContent = `${unlockedCount}/${STICKER_DEFS.length}`;
  }

  function renderLevelSelectModal() {
    const container = document.getElementById('levels-grid-container');
    const unlockedEl = document.getElementById('unlocked-level-text');
    const starsEl = document.getElementById('total-stars-text');
    if (!container) return;

    let totalStars = 0;
    LEVELS.forEach(lvl => {
      totalStars += (state.levelStars[lvl.id] || 0);
    });

    if (unlockedEl) unlockedEl.textContent = `第 ${state.unlockedLevel} 关 / 共 ${LEVELS.length} 关`;
    if (starsEl) starsEl.textContent = `⭐ ${totalStars} / ${LEVELS.length * 3}`;

    container.innerHTML = LEVELS.map(lvl => {
      const isUnlocked = lvl.id <= state.unlockedLevel;
      const isCurrent = lvl.id === state.currentLevel;
      const stars = state.levelStars[lvl.id] || 0;
      let starStr = '☆☆☆';
      if (stars === 3) starStr = '⭐⭐⭐';
      else if (stars === 2) starStr = '⭐⭐☆';
      else if (stars === 1) starStr = '⭐☆☆';

      const cardClass = isUnlocked ? (stars > 0 ? 'completed' : 'unlocked') : 'locked';
      const curClass = isCurrent ? 'current' : '';

      return `
        <div class="level-card ${cardClass} ${curClass}" data-level="${lvl.id}">
          <div class="level-card-top">
            <span class="level-badge-num">第 ${lvl.id} 关</span>
            <span class="level-stars-display">${isUnlocked ? starStr : '🔒'}</span>
          </div>
          <div class="level-card-title">${lvl.title}</div>
          <div class="level-card-desc">🏆 ${state.levelHighScores[lvl.id] || 0} · ⭐⭐⭐ ${lvl.starScore[1]}</div>
        </div>
      `;
    }).join('') + (() => {
      const unlocked = (state.levelStars[LEVELS.length] || 0) > 0;
      return `
        <div class="level-card ${unlocked ? 'unlocked' : 'locked'} ${state.isEndlessMode ? 'current' : ''}" data-endless="1">
          <div class="level-card-top">
            <span class="level-badge-num">♾️ 无尽</span>
            <span class="level-stars-display">${unlocked ? '🏆 ' + state.endlessBest : '🔒'}</span>
          </div>
          <div class="level-card-title">${ENDLESS_CONFIG.title}</div>
          <div class="level-card-desc">${unlocked ? '排满一排就消除' : '通关第 8 关后解锁'}</div>
        </div>
      `;
    })();

    // Attach click handlers
    container.querySelectorAll('.level-card').forEach(card => {
      card.addEventListener('click', () => {
        if (card.dataset.endless) {
          if ((state.levelStars[LEVELS.length] || 0) > 0) {
            startLevel(LEVELS.length, true, true);
            document.getElementById('level-select-modal').classList.remove('open');
          } else {
            sfx.playMismatch();
            addFloatingText(state.width / 2, state.height / 2, '🔒 通关第 8 关解锁', '#d97706', 1.15);
          }
          return;
        }
        const lvlId = parseInt(card.dataset.level, 10);
        if (lvlId <= state.unlockedLevel) {
          startLevel(lvlId);
          document.getElementById('level-select-modal').classList.remove('open');
        } else {
          sfx.playMismatch();
          addFloatingText(state.width / 2, state.height / 2, `🔒 请先通关第 ${lvlId - 1} 关后解锁！`, '#d97706', 1.15);
        }
      });
    });
  }

  function pickNeededColorIndex() {
    const lvlConfig = getLevelConfig();
    const activeCols = lvlConfig.activeCols;
    const target = lvlConfig.targetPerTube;

    // Pick only from active columns that need candies
    const needed = activeCols.filter(cIdx => state.columnCounts[cIdx] < target);
    if (state.isEndlessMode && needed.length && Math.random() < 0.5) {
      const minC = Math.min(...needed.map(i => state.columnCounts[i]));
      const lowest = needed.filter(i => state.columnCounts[i] === minC);
      return lowest[Math.floor(Math.random() * lowest.length)];
    }
    if (needed.length > 0) {
      return needed[Math.floor(Math.random() * needed.length)];
    }
    // If all full (rare before trigger), pick random active column
    return activeCols[Math.floor(Math.random() * activeCols.length)] || 0;
  }

  function discardHeldBomb() {
    const candyX = state.cloud.x;
    const candyY = state.cloud.y + state.cloud.height * 0.5 + state.layout.candyRadius + 6;
    sfx.playSwat();
    state.screenShake = Math.max(state.screenShake, 3);
    spawnBurstParticles(candyX, candyY, '#9ca3af', 14, false);
    addFloatingText(candyX, candyY - 10, '💨 扔掉炸弹', '#4b5563', 1.05);
    spawnNextCandyOnCloud();
  }

  function getLowestNeededColumn() {
    const lvlConfig = getLevelConfig();
    const needed = lvlConfig.activeCols.filter(i => state.columnCounts[i] < lvlConfig.targetPerTube);
    if (!needed.length) return null;
    return needed.sort((a, b) => state.columnCounts[a] - state.columnCounts[b])[0];
  }

  function createRandomCandy() {
    const lvlConfig = getLevelConfig();
    const colorIdx = pickNeededColorIndex();

    // Check special candy permissions for current level
    const roll = Math.random();
    let specialType = 'normal';
    let isRainbow = false;

    if (lvlConfig.features.bombs && roll < 0.09) {
      specialType = 'bomb';
    } else if (lvlConfig.features.rainbowCandy && roll < 0.18) {
      specialType = 'rainbow';
      isRainbow = true;
    } else if (lvlConfig.allowedSpecials.includes('triple') && roll < 0.28) {
      specialType = 'triple';
    } else if (lvlConfig.allowedSpecials.includes('mystery') && roll < 0.35) {
      specialType = 'mystery';
    } else if (lvlConfig.allowedSpecials.includes('shower') && roll < 0.40) {
      specialType = 'shower';
    }

    const shape = isRainbow
      ? 'star'
      : CANDY_SHAPES[Math.floor(Math.random() * CANDY_SHAPES.length)];

    const maxTimer = lvlConfig.candyTimer;

    return {
      colorIdx,
      shape,
      specialType,
      timer: maxTimer,
      maxTimer,
      age: 0,
      alignTime: 0,
      isRainbow,
      scale: 0.1
    };
  }

  function spawnNextCandyOnCloud() {
    if (!state.nextCandy) state.nextCandy = createRandomCandy();
    state.activeCandy = state.nextCandy;
    state.nextCandy = createRandomCandy();
  }

  function spawnFallingCandyObj(opts) {
    state.fallingCandies.push({
      x: opts.x,
      y: opts.y,
      vx: opts.vx || 0,
      vy: opts.vy || 145,
      gravity: opts.gravity || 660,
      radius: state.layout.candyRadius,
      colorIdx: opts.colorIdx,
      shape: opts.shape || 'round',
      specialType: opts.specialType || 'normal',
      isRainbow: !!opts.isRainbow,
      homing: !!opts.homing,
      splitDone: !!opts.splitDone,
      quick: !!opts.quick,
      rotation: (Math.random() - 0.5) * 0.3,
      vRot: (Math.random() - 0.5) * 2.5
    });
  }

  function dropActiveCandy() {
    if (!state.activeCandy || state.isLevelCleared) return;
    if (state.fallingCandies.length >= 16) {
      if (state.blockedMsgCd <= 0) {
        state.blockedMsgCd = 0.8;
        addFloatingText(state.cloud.x, state.cloud.y - 30, '⏳ 等一下~', '#64748b', 1.0);
      }
      state.cloud.scaleX = 0.94;
      state.cloud.scaleY = 1.06;
      return;
    }
    hideLevelIntroToast();
    const c = state.activeCandy;
    const dropX = state.cloud.x;
    const dropY = state.cloud.y + state.cloud.height * 0.48;
    // Lightning-fast drop (before the countdown ring is ~1/3 used) earns a speed bonus if it lands right
    const quick = c.timer > 0 && c.age <= Math.max(0.9, c.maxTimer * 0.32);
    // Rainbow wildcard aimed at a full column: steer it to the lowest column instead
    let steerTo = null;
    if (c.isRainbow) {
      const lvlCfg = getLevelConfig();
      const under = getColumnIndexAtX(dropX);
      if (lvlCfg.activeCols.includes(under) && state.columnCounts[under] >= lvlCfg.targetPerTube) {
        steerTo = getLowestNeededColumn();
      }
    }

    // Advance tutorial step in Level 1
    if (state.currentLevel === 1) {
      if (state.tutorialStep === 1 || state.tutorialStep === 2) {
        state.tutorialStep = 3;
      }
    }

    if (c.specialType === 'triple') {
      for (let k = -1; k <= 1; k++) {
        spawnFallingCandyObj({
          x: dropX + k * 14,
          y: dropY - Math.abs(k) * 10,
          vx: state.cloud.vx * 0.06 + k * 28,
          vy: 130 + k * 15,
          colorIdx: c.colorIdx,
          shape: c.shape,
          specialType: 'normal',
          isRainbow: false,
          homing: state.magnetTimer > 0,
          quick
        });
      }
      addFloatingText(dropX, dropY + 10, '⚡ ×3', COLOR_COLUMNS[c.colorIdx].hex, 1.15);
    } else {
      spawnFallingCandyObj({
        x: dropX,
        y: dropY,
        vx: state.cloud.vx * 0.08,
        vy: 145,
        colorIdx: steerTo !== null ? steerTo : c.colorIdx,
        shape: c.shape,
        specialType: c.specialType,
        isRainbow: c.isRainbow,
        homing: steerTo !== null || (state.magnetTimer > 0 && c.specialType !== 'bomb'),
        quick
      });
      if (steerTo !== null) addFloatingText(dropX, dropY + 20, '🌈 飞去最矮的柱子', '#7c3aed', 1.0);
    }

    // Dynamic squash-and-stretch recoil on cloud release
    state.cloud.bounceY = -14;
    state.cloud.scaleX = 1.15;
    state.cloud.scaleY = 0.86;
    triggerHaptic('drop');
    spawnNextCandyOnCloud();
  }

  // Countdown ran out: the candy floats away like a balloon. Breaks the combo, but costs no heart.
  function candyFloatAway() {
    const ac = state.activeCandy;
    if (!ac) return;
    const x = state.cloud.x;
    const y = state.cloud.y + state.cloud.height * 0.5 + state.layout.candyRadius + 6;
    state.driftingCandies.push({
      x, y,
      vx: (Math.random() - 0.5) * 70,
      vy: -40,
      rot: 0,
      vRot: (Math.random() - 0.5) * 3,
      life: 1.3,
      colorIdx: ac.colorIdx,
      shape: ac.shape,
      isRainbow: ac.isRainbow,
      specialType: ac.specialType
    });
    const hadCombo = getLevelConfig().features.combo && state.combo > 0;
    state.combo = 0;
    state.cloud.mood = 'oops';
    state.cloud.moodTimer = 0.6;
    addFloatingText(x, y - 30, hadCombo ? '💨 飘走了 · 连击断了' : '💨 飘走了', '#64748b', 1.1);
    updateHUD();
    spawnNextCandyOnCloud();
  }

  function spawnMultiplierGate() {
    const lvlConfig = getLevelConfig();
    if (!lvlConfig.features.multiplierGates || state.multiplierGates.length >= 2) return;
    const minY = state.layout.cloudY + state.cloud.height * 0.5 + 32;
    const maxY = state.layout.columnsTopY - 34;
    if (maxY <= minY + 10) return;

    const gateTypes = [
      { mult: 2, label: '×2 泡泡', color: '#298cd4', bg: 'rgba(115, 198, 255, 0.28)' },
      { mult: 2, label: '×2 泡泡', color: '#1d8f24', bg: 'rgba(92, 214, 100, 0.28)' },
      { mult: 3, label: '×3 奇迹圈', color: '#d97706', bg: 'rgba(255, 215, 0, 0.34)' }
    ];
    const chosen = gateTypes[Math.floor(Math.random() * gateTypes.length)];
    const fromLeft = Math.random() < 0.5;
    state.multiplierGates.push({
      x: fromLeft ? 40 : state.width - 40,
      y: minY + Math.random() * (maxY - minY),
      vx: (fromLeft ? 1 : -1) * (45 + Math.random() * 35),
      r: 23,
      mult: chosen.mult,
      label: chosen.label,
      color: chosen.color,
      bg: chosen.bg,
      phase: Math.random() * Math.PI * 2
    });
  }

  function triggerFeverMode() {
    const lvlConfig = getLevelConfig();
    if (!lvlConfig.features.fever || state.feverTimer > 0 || state.isLevelCleared) return;
    state.feverGauge = 100;
    state.feverTimer = 5.5;
    state.feverSpawnCd = 0.12;
    state.screenShake = 8;
    sfx.playFeverStart();
    unlockSticker('fever_party');
    addFloatingText(state.width / 2, state.layout.cloudY + 45, '🌈 彩虹暴走！', '#ec4899', 1.4);
  }

  function activateTopIcon(iconIdx) {
    const lvlConfig = getLevelConfig();
    if (!lvlConfig.features.topMagic) {
      addFloatingText(state.topIconPos[iconIdx]?.x || state.width / 2, state.layout.topIconsY + 24, '🔒 第5关解锁', '#4f5d75', 1.05);
      return false;
    }
    if (state.isLevelCleared || state.topIconCharge[iconIdx] < 100) return false;
    state.topIconCharge[iconIdx] = 0;
    state.topIconBounce[iconIdx] = 16;
    state.screenShake = 6;
    sfx.playMagicSkill();
    unlockSticker('magic_star');

    const cols = state.layout.columns;
    const pos = state.topIconPos[iconIdx] || { x: state.width / 2, y: state.layout.topIconsY };
    spawnBurstParticles(pos.x, pos.y, '#ffd700', 24, true);

    if (iconIdx === 0 || iconIdx === 3) {
      // Green Star: Meteor Shower (homing candies targeting needed columns)
      addFloatingText(pos.x, pos.y + 24, '🌠 流星雨！', '#1d8f24', 1.3);
      for (let m = 0; m < 5; m++) {
        const targetCol = pickNeededColorIndex();
        const targetX = cols[targetCol] ? cols[targetCol].centerX : state.width / 2;
        spawnFallingCandyObj({
          x: targetX + (Math.random() - 0.5) * 30,
          y: state.layout.topIconsY + 10 - m * 18,
          vx: 0,
          vy: 180 + m * 20,
          colorIdx: targetCol,
          shape: 'star',
          specialType: 'normal',
          isRainbow: false,
          homing: true,
          splitDone: false
        });
      }
    } else if (iconIdx === 1 || iconIdx === 4) {
      // Split Heart: Rainbow Magnet Homing for 7 seconds
      state.magnetTimer = 7.0;
      state.fallingCandies.forEach(fc => {
        if (fc.specialType !== 'bomb') fc.homing = true;
      });
      addFloatingText(pos.x, pos.y + 24, '🧲 磁铁 7秒！', '#e36517', 1.3);
    } else {
      // Berry Heart: Purify all hazards + instant +1 candy in 2 most-needed columns!
      state.columnFrozen = [0, 0, 0, 0, 0, 0, 0];
      state.columnBugs = [null, null, null, null, null, null, null];
      state.fallingCandies = state.fallingCandies.filter(fc => fc.specialType !== 'bomb');
      if (state.activeCandy && state.activeCandy.specialType === 'bomb') {
        state.activeCandy.specialType = 'rainbow';
        state.activeCandy.isRainbow = true;
      }
      addFloatingText(pos.x, pos.y + 24, '🍇 净化 + 补糖！', '#7e3f8f', 1.3);

      const neededCols = lvlConfig.activeCols
        .filter(i => state.columnCounts[i] < lvlConfig.targetPerTube)
        .sort((a, b) => state.columnCounts[a] - state.columnCounts[b])
        .slice(0, 2);

      neededCols.forEach(cIdx => {
        addCandyToColumn(cIdx, 'berry', false);
      });
    }
    updateHUD();
    return true;
  }

  function addCandyToColumn(colIdx, shape = 'round', isRainbow = false) {
    const col = state.layout.columns[colIdx];
    const lvlConfig = getLevelConfig();
    const target = lvlConfig.targetPerTube;
    if (!col) return;

    if (state.columnCounts[colIdx] < target) {
      state.levelCollected += 1;
      state.totalCollectedAllLevels += 1;
      state.columnCounts[colIdx] += 1;
      state.columnStacks[colIdx].push({
        radius: state.layout.candyRadius,
        colorIdx: colIdx,
        shape,
        isRainbow,
        rotation: (Math.random() - 0.5) * 0.18,
        squish: 1.35
      });

      // Tactile Feel: Physical landing recoil punch on this column
      state.columnPunchY[colIdx] = 8.5;

      // Ripple squish through the existing stack below (jelly bounce feel)
      const stack = state.columnStacks[colIdx];
      for (let s = 0; s < stack.length; s++) {
        const distFromTop = stack.length - 1 - s;
        stack[s].squish = 1 + 0.32 * Math.pow(0.72, distFromTop);
      }

      // Haptic pulse for physical confirmation
      triggerHaptic(state.combo >= 4 ? 'combo' : 'match');

      const slotY = getSlotCenterY(state.columnCounts[colIdx] - 1);
      spawnBurstParticles(col.centerX, slotY, COLOR_COLUMNS[colIdx].lightHex, 14, isRainbow);

      // Check column fill
      if (state.columnCounts[colIdx] === target && !state.isEndlessMode) {
        unlockSticker('first_tube');
        spawnBurstParticles(col.centerX, col.topY + 30, '#ffd700', 26, true);
        addFloatingText(col.centerX, col.topY - 14, `🎉 满啦！`, '#1d8f24', 1.35);

        // Check if level clear condition reached
        checkLevelClearCondition();
      }
      checkRainbowRow();
    } else {
      state.score += 5;
    }
  }

  function checkLevelClearCondition() {
    if (state.isLevelCleared || state.isEndlessMode) return;
    const lvlConfig = getLevelConfig();
    const activeCols = lvlConfig.activeCols;
    const target = lvlConfig.targetPerTube;

    const allFull = activeCols.every(cIdx => state.columnCounts[cIdx] >= target);
    if (allFull) {
      if (state.currentLevel === 8) {
        triggerGrandFinale();
      } else {
        triggerLevelClear();
      }
    }
  }

  function spawnBurstParticles(x, y, hexColor, count = 18, isRainbow = false) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const speed = 60 + Math.random() * 190;
      const pColor = isRainbow ? COLOR_COLUMNS[i % COLOR_COLUMNS.length].hex : hexColor;
      state.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 60,
        radius: 4 + Math.random() * 5,
        color: pColor,
        alpha: 1,
        life: 0.55 + Math.random() * 0.35,
        maxLife: 0.9
      });
    }
  }

  function spawnVictoryConfetti() {
    const colors = COLOR_COLUMNS.map(c => c.hex).concat(['#ffd700', '#ff69b4', '#00ffff']);
    for (let i = 0; i < 40; i++) {
      state.confetti.push({
        x: Math.random() * state.width,
        y: -10 - Math.random() * 80,
        vx: (Math.random() - 0.5) * 120,
        vy: 100 + Math.random() * 220,
        w: 8 + Math.random() * 8,
        h: 5 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI,
        vRot: (Math.random() - 0.5) * 8,
        alpha: 1
      });
    }
  }

  function addFloatingText(x, y, text, color = '#282a24', scale = 1) {
    state.floatingTexts.push({ x, y, text, color, scale, alpha: 1, vy: -55, life: 1.15 });
  }

  /* ---------------- Heart loss (shared by mismatch / bomb / bug) ---------------- */

  // Gentle feedback while hearts remain; the full-screen alarm only fires when you're down to the last heart.
  // Returns true if the level failed.
  function loseHeart(x, y, shortText, alarmTitle, alarmSub, reason, resetCombo = true) {
    state.hearts = Math.max(0, state.hearts - 1);
    if (resetCombo) state.combo = 0;
    state.cloud.mood = 'oops';
    state.cloud.moodTimer = 0.95;
    triggerHaptic('error');
    sfx.playHeartLost();
    if (state.hearts <= 1) {
      triggerFullScreenError(x, y, alarmTitle, alarmSub);
    } else {
      state.screenShake = Math.max(state.screenShake, 5);
      state.heartLossFlash = 0.5;
    }
    addFloatingText(x, y, shortText, '#e11d48', 1.25);
    updateHUD();
    if (state.hearts <= 0) {
      triggerLevelFail(reason);
      return true;
    }
    return false;
  }

  /* ---------------- Fun Layer: Combo Tiers, Rainbow Rows, Lucky Rain, Swap ---------------- */

  function getComboTier(combo = state.combo) {
    let tier = null;
    for (const t of COMBO_TIERS) {
      if (combo >= t.min) tier = t;
    }
    return tier;
  }

  function getComboMult() {
    const tier = getComboTier();
    return tier ? tier.mult : 1;
  }

  function showBanner(text, color = '#ec4899', sub = '') {
    state.banner = { text, sub, color, life: 1.35, maxLife: 1.35 };
  }

  // Called right after combo increments: celebrate when a new tier is reached
  function onComboIncreased() {
    const tier = COMBO_TIERS.find(t => t.min === state.combo);
    if (!tier) return;
    showBanner(`🔥 ${state.combo} 连击 ${tier.label}`, tier.color, '连击越高，每颗糖得分越多！');
    state.screenShake = Math.max(state.screenShake, 4);
    spawnBurstParticles(state.cloud.x, state.cloud.y, tier.color, 22, true);
  }

  // A "Rainbow Row" = every active column has reached the same new height.
  function checkRainbowRow() {
    if (state.isLevelCleared || state.isLevelFailed) return;
    const lvlConfig = getLevelConfig();
    const active = lvlConfig.activeCols;
    if (active.length < 2) return;
    const minCount = Math.min(...active.map(i => state.columnCounts[i]));
    if (state.isEndlessMode) {
      if (minCount >= 1) clearEndlessRow(active);
      return;
    }
    if (minCount <= state.rowsCompleted) return;

    state.rowsCompleted = minCount;
    const sorted = active.slice().sort((a, b) => a - b);
    const bonus = 8 * active.length * getComboMult();
    state.score += bonus;
    unlockSticker('rainbow_row');

    let rewardText = `+${bonus} 分`;
    if (lvlConfig.features.fever && state.feverTimer <= 0) {
      state.feverGauge = Math.min(100, state.feverGauge + 30);
      rewardText += ' · 🌈暴走 +30%';
    }
    if (lvlConfig.features.topMagic) {
      for (let k = 0; k < state.topIconCharge.length; k++) {
        state.topIconCharge[k] = Math.min(100, state.topIconCharge[k] + 15);
      }
      rewardText += ' · 魔法充能';
    }

    // Checkpoint every 2 rows on the long levels
    if (lvlConfig.targetPerTube >= CHECKPOINT_MIN_PER_TUBE && minCount % 2 === 0 && minCount < lvlConfig.targetPerTube) {
      state.checkpoint = { rows: minCount, score: state.score };
      rewardText += ' · 📍存档';
    }

    state.rowSweeps.push({ slot: minCount - 1, t: 0, dur: 1.5, order: sorted, hit: 0 });
    sfx.playRowScale(sorted);
    showBanner('🌈 彩虹横排！', '#7c3aed', rewardText);
    triggerHaptic('combo');
    updateHUD();
    if (state.feverGauge >= 100) triggerFeverMode();
  }

  // Endless: a full bottom row pops away and everything drops down by one
  function clearEndlessRow(active) {
    const sorted = active.slice().sort((a, b) => a - b);
    sorted.forEach(cIdx => {
      const col = state.layout.columns[cIdx];
      if (col) spawnBurstParticles(col.centerX, getSlotCenterY(0), COLOR_COLUMNS[cIdx].lightHex, 10, true);
      state.columnCounts[cIdx] -= 1;
      state.columnStacks[cIdx].shift();
      state.columnPunchY[cIdx] = 9;
    });
    state.endlessRows += 1;
    ENDLESS_CONFIG.candyTimer = Math.max(1.5, ENDLESS_BASE_TIMER - state.endlessRows * 0.1);
    const bonus = 10 * sorted.length * getComboMult();
    state.score += bonus;
    unlockSticker('rainbow_row');
    if (state.feverTimer <= 0) state.feverGauge = Math.min(100, state.feverGauge + 25);
    state.rowSweeps.push({ slot: 0, t: 0, dur: 1.5, order: sorted, hit: 0 });
    sfx.playRowScale(sorted);
    showBanner(`🌈 消除第 ${state.endlessRows} 排！`, '#7c3aed', `+${bonus} 分 · 糖果变快啦`);
    triggerHaptic('combo');
    updateHUD();
    if (state.feverGauge >= 100) triggerFeverMode();
  }

  function spawnLuckyCandy() {
    const lvlConfig = getLevelConfig();
    const canHeal = state.hearts < state.maxHearts;
    const isHeart = canHeal && Math.random() < 0.18;
    const cols = state.layout.columns;
    const active = lvlConfig.activeCols;
    // Prefer spawning somewhere reachable over the playfield of active columns
    const minX = cols[Math.min(...active)]?.centerX || 40;
    const maxX = cols[Math.max(...active)]?.centerX || state.width - 40;
    state.luckyCandies.push({
      baseX: minX + Math.random() * Math.max(1, maxX - minX),
      x: 0,
      y: -18,
      vy: 42 + Math.random() * 18,
      phase: Math.random() * Math.PI * 2,
      sway: 18 + Math.random() * 22,
      kind: isHeart ? 'heart' : 'gold',
      spin: 0,
      life: 1
    });
  }

  function collectLuckyCandy(lc) {
    const lvlConfig = getLevelConfig();
    spawnBurstParticles(lc.x, lc.y, lc.kind === 'heart' ? '#ff4d6d' : '#ffd700', 16, true);
    sfx.playLuckyCatch(lc.kind === 'heart');
    triggerHaptic('match');
    state.cloud.mood = 'joy';
    state.cloud.moodTimer = 0.6;
    state.cloud.scaleX = 1.12;
    state.cloud.scaleY = 0.9;

    if (lc.kind === 'heart') {
      state.hearts = Math.min(state.maxHearts, state.hearts + 1);
      addFloatingText(lc.x, lc.y - 16, '💖 +1❤️', '#ff2e63', 1.25);
    } else {
      state.luckyCount += 1;
      const pts = 4 * getComboMult();
      state.score += pts;
      if (lvlConfig.features.fever && state.feverTimer <= 0) {
        state.feverGauge = Math.min(100, state.feverGauge + 10);
      }
      if (lvlConfig.features.topMagic) {
        for (let k = 0; k < state.topIconCharge.length; k++) {
          state.topIconCharge[k] = Math.min(100, state.topIconCharge[k] + 8);
        }
      }
      const step = ((state.luckyCount - 1) % 3) + 1;
      if (step === 3) {
        unlockSticker('lucky_catcher');
        // Reward: the candy currently held becomes a rainbow wildcard (or the next one if holding a bomb)
        const target = state.activeCandy && state.activeCandy.specialType !== 'bomb' ? state.activeCandy : state.nextCandy;
        if (target) {
          target.specialType = 'rainbow';
          target.isRainbow = true;
          target.shape = 'star';
        }
        showBanner('🍀 集齐 3 颗幸运星！', '#d97706', '云朵的糖果变成了彩虹百搭糖！');
      } else {
        addFloatingText(lc.x, lc.y - 16, `⭐ ${step}/3`, '#d97706', 1.15);
      }
      if (state.feverGauge >= 100) triggerFeverMode();
    }
    updateHUD();
  }

  function updateLuckyCandies(dt) {
    const lvlConfig = getLevelConfig();
    if (!state.isLevelCleared && state.currentLevel >= LUCKY_START_LEVEL && lvlConfig.activeCols.length) {
      state.luckySpawnTimer -= dt;
      if (state.luckySpawnTimer <= 0) {
        state.luckySpawnTimer = 5.5 + Math.random() * 3.5;
        spawnLuckyCandy();
      }
    }
    const c = state.cloud;
    for (let i = state.luckyCandies.length - 1; i >= 0; i--) {
      const lc = state.luckyCandies[i];
      lc.phase += dt * 2.2;
      lc.spin += dt * 3;
      lc.y += lc.vy * dt;
      lc.x = Math.max(16, Math.min(state.width - 16, lc.baseX + Math.sin(lc.phase) * lc.sway));

      // Caught by the cloud body?
      if (!state.isLevelCleared && Math.abs(lc.x - c.x) <= c.width * 0.5 && Math.abs(lc.y - c.y) <= c.height * 0.55) {
        collectLuckyCandy(lc);
        state.luckyCandies.splice(i, 1);
        continue;
      }
      // Missed: fades out as it passes the columns (no penalty)
      if (lc.y > state.layout.columnsTopY) {
        lc.life -= dt * 2.5;
        if (lc.life <= 0) state.luckyCandies.splice(i, 1);
      }
    }
  }

  // Swap the held candy with the "next" preview (keeps the countdown, so no stalling)
  function swapCandies() {
    if (!state.activeCandy || !state.nextCandy || state.isLevelCleared || state.isLevelFailed) return false;
    const a = state.activeCandy;
    const n = state.nextCandy;
    const props = ['colorIdx', 'shape', 'specialType', 'isRainbow'];
    props.forEach(p => {
      const tmp = a[p];
      a[p] = n[p];
      n[p] = tmp;
    });
    a.scale = 0.55;
    state.cloud.scaleX = 0.9;
    state.cloud.scaleY = 1.1;
    sfx.playRealPianoNote('G5', 0.6, 0);
    triggerHaptic('drop');
    return true;
  }

  const IS_TOUCH = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

  function getNextBubbleRect(withBounce = true) {
    const c = state.cloud;
    const big = IS_TOUCH || state.width < 700;
    const w = big ? 86 : 70;
    const h = big ? 36 : 28;
    const right = c.x + c.width / 2 + 6;
    const cy = c.y + (withBounce ? c.bounceY : 0) - c.height / 2 - (big ? 18 : 14);
    return { x: right - w, y: cy - h / 2, w, h, big };
  }

  function updateHUD() {
    const lvlConfig = getLevelConfig();
    const totalTarget = getLevelTotalTarget(lvlConfig);

    if (state.isEndlessMode) {
      document.getElementById('level-val').textContent = '♾️ 无尽';
      document.getElementById('target-progress-val').textContent = `消 ${state.endlessRows} 排`;
    } else {
      document.getElementById('level-val').textContent = `${state.currentLevel}/${LEVELS.length}`;
      document.getElementById('target-progress-val').textContent = `${state.levelCollected}/${totalTarget}`;
    }

    // Score pill shows the next star goal
    const [s2, s3] = getStarScores(lvlConfig);
    let scoreText = `${state.score}`;
    if (state.isEndlessMode) {
      scoreText = `${state.score} 🏆${Math.max(state.endlessBest, state.score)}`;
    } else if (state.score >= s3) {
      scoreText = `${state.score} ⭐⭐⭐`;
    } else {
      scoreText = `${state.score}/${state.score >= s2 ? s3 : s2}`;
    }
    document.getElementById('score-val').textContent = scoreText;

    // Hearts Pill
    const heartsEl = document.getElementById('hearts-val');
    if (heartsEl) {
      let heartStr = '';
      for (let h = 0; h < state.maxHearts; h++) {
        heartStr += (h < state.hearts ? '❤️' : '🖤');
      }
      heartsEl.textContent = heartStr;
      const heartsPill = document.getElementById('hud-hearts-pill');
      if (heartsPill) heartsPill.classList.toggle('critical', state.hearts === 1 && state.maxHearts > 1);
    }

    const feverEl = document.getElementById('fever-val');
    const feverPill = document.getElementById('fever-pill');
    if (feverEl && feverPill) {
      if (lvlConfig.features.fever) {
        feverPill.style.display = 'flex';
        if (state.feverTimer > 0) {
          feverEl.textContent = `${state.feverTimer.toFixed(1)}s`;
          feverPill.classList.add('fever-ready');
        } else {
          const pct = Math.min(100, Math.floor(state.feverGauge));
          feverEl.textContent = `${pct}%`;
          feverPill.classList.toggle('fever-ready', pct >= 100);
        }
      } else {
        feverPill.style.display = 'none';
      }
    }
  }

  function formatTime(totalSeconds) {
    const m = Math.floor(totalSeconds / 60);
    const s = Math.floor(totalSeconds % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  let introToastTimer = null;

  function isAnyModalOpen() {
    return !!document.querySelector('.modal-backdrop.open');
  }

  // The game world freezes while any dialog is open or the level intro card is being read
  function isGamePaused() {
    return state.introVisible || isAnyModalOpen();
  }

  function openPauseMenu() {
    if (isAnyModalOpen()) return;
    hideLevelIntroToast();
    const nameEl = document.getElementById('pause-level-name');
    if (nameEl) {
      nameEl.textContent = state.isEndlessMode
        ? `♾️ 无尽模式 · 已消 ${state.endlessRows} 排`
        : `第 ${state.currentLevel} 关 · ${getLevelConfig().title}`;
    }
    document.getElementById('pause-modal').classList.add('open');
  }

  function togglePauseMenu() {
    const pm = document.getElementById('pause-modal');
    if (pm.classList.contains('open')) {
      pm.classList.remove('open');
    } else if (!isAnyModalOpen() && !state.isLevelCleared && !state.isLevelFailed) {
      openPauseMenu();
    }
  }

  // In-game confirm dialog (replaces the browser's confirm())
  let confirmHandler = null;
  function askConfirm(title, desc, onOk) {
    document.getElementById('confirm-title').textContent = title;
    document.getElementById('confirm-desc').textContent = desc;
    confirmHandler = onOk;
    document.getElementById('confirm-modal').classList.add('open');
  }

  function showLevelIntroToast(lvl = state.currentLevel) {
    if (introToastTimer) {
      clearTimeout(introToastTimer);
      introToastTimer = null;
    }
    const lvlConfig = state.isEndlessMode ? ENDLESS_CONFIG : getLevelConfig(lvl);
    const toast = document.getElementById('level-intro-toast');
    const tagEl = document.getElementById('toast-level-num');
    const titleEl = document.getElementById('toast-level-title');
    const tipEl = document.getElementById('toast-level-tip');

    if (toast && tagEl && titleEl && tipEl) {
      tagEl.textContent = state.isEndlessMode ? '♾️ 无尽' : `第 ${lvlConfig.id} 关`;
      titleEl.textContent = `${lvlConfig.title} · ${lvlConfig.subtitle}`;
      tipEl.textContent = lvlConfig.tip;
      toast.classList.add('show');
      state.introVisible = true;

      // 关卡弹窗作为提示，开始游戏后自动消失（无需手动点击开始挑战）
      introToastTimer = setTimeout(() => {
        hideLevelIntroToast();
      }, 3200);
    }
  }

  function hideLevelIntroToast() {
    if (introToastTimer) {
      clearTimeout(introToastTimer);
      introToastTimer = null;
    }
    const toast = document.getElementById('level-intro-toast');
    if (toast) toast.classList.remove('show');
    state.introVisible = false;
  }

  function triggerLevelClear() {
    if (state.isLevelCleared || state.isLevelFailed) return;
    state.isLevelCleared = true;
    triggerHaptic('clear');
    // Delay victory fanfare so the final landing piano note resonates purely for ear training
    setTimeout(() => {
      if (state.isLevelCleared && !state.isLevelFailed) {
        sfx.playLevelClear();
      }
    }, 850);

    const elapsed = state.playTime;
    const lvlConfig = getLevelConfig();

    // Stars from score, +1 for not losing any heart
    const starInfo = computeStars();
    const starsCount = starInfo.stars;
    const flawlessHearts = starInfo.flawless;

    if (starsCount === 3) unlockSticker('speed_star');

    // Save Stars & Unlocked Level
    const prevStars = state.levelStars[state.currentLevel] || 0;
    if (starsCount > prevStars) {
      state.levelStars[state.currentLevel] = starsCount;
    }
    const prevHigh = state.levelHighScores[state.currentLevel] || 0;
    if (state.score > prevHigh) {
      state.levelHighScores[state.currentLevel] = state.score;
    }

    // Unlock next level
    if (state.currentLevel >= state.unlockedLevel && state.currentLevel < LEVELS.length) {
      state.unlockedLevel = state.currentLevel + 1;
    }
    saveProgress();

    // Populate Level Clear Modal
    let starStr = '⭐☆☆';
    if (starsCount === 3) starStr = '⭐⭐⭐';
    else if (starsCount === 2) starStr = '⭐⭐☆';

    document.getElementById('level-clear-title').textContent = `🎉 第 ${state.currentLevel} 关 通关成功！`;
    document.getElementById('level-clear-stars').textContent = starStr;
    const heartBadge = flawlessHearts ? '❤️ 一颗心没丢，奖励 +1⭐！' : `❤️ 剩余 ${state.hearts} 心`;
    let nextStarTip = '';
    if (starsCount < 3) {
      const need = (state.score >= starInfo.s2 ? starInfo.s3 : starInfo.s2) - state.score;
      if (need > 0) nextStarTip = ` 再多 ${need} 分就能多 1 颗星！`;
    }
    document.getElementById('level-clear-desc').textContent = `【${lvlConfig.title}】完成！${heartBadge}${nextStarTip}`;
    document.getElementById('lc-candies').textContent = `${state.levelCollected} / ${getLevelTotalTarget(lvlConfig)}`;
    document.getElementById('lc-time').textContent = formatTime(elapsed);
    document.getElementById('lc-combo').textContent = state.maxCombo;
    document.getElementById('lc-score').textContent = state.score;

    const nextLvl = state.currentLevel + 1;
    const nextTipEl = document.getElementById('level-unlock-next-tip');
    if (nextTipEl) {
      if (nextLvl <= LEVELS.length) {
        nextTipEl.textContent = `✨ 新关卡已解锁：【第 ${nextLvl} 关 ${LEVELS[nextLvl - 1].title}】！`;
        nextTipEl.style.display = 'inline-block';
      } else {
        nextTipEl.textContent = '🎉 全关卡已通关！彩虹大圆满！';
      }
    }

    spawnVictoryConfetti();

    setTimeout(() => {
      sfx.playStarChime(starsCount - 1);
      document.getElementById('level-clear-modal').classList.add('open');
    }, 600);
  }

  function triggerFullScreenError(x, y, title, subtitle = '') {
    if (state.reduceMotion) {
      // Calm version: just the message card, no flashing / shockwaves / shaking
      state.errorHeartPrompt = { title, subtitle, timer: 1.25, maxTimer: 1.25 };
      state.heartLossFlash = 0.5;
      return;
    }
    state.errorFlashTimer = 0.9;
    state.screenShake = 18;
    state.errorHeartPrompt = {
      title,
      subtitle,
      timer: 1.25,
      maxTimer: 1.25
    };
    state.errorShockwaves.push({
      x: x || state.width / 2,
      y: y || state.height / 2,
      r: 10,
      maxR: Math.hypot(state.width, state.height) * 0.95,
      speed: 850,
      alpha: 1
    });

    const stage = document.getElementById('paper-stage');
    if (stage) {
      stage.classList.remove('screen-error-flash');
      void stage.offsetWidth;
      stage.classList.add('screen-error-flash');
      setTimeout(() => stage.classList.remove('screen-error-flash'), 550);
    }
  }

  function triggerLevelFail(reason = 'mismatch') {
    if (state.isLevelCleared || state.isLevelFailed) return;
    state.isLevelFailed = true;
    sfx.playDefeat();
    state.cloud.mood = 'oops';
    state.screenShake = 12;

    const elapsed = state.playTime;
    const lvlConfig = getLevelConfig();

    document.getElementById('level-fail-title').textContent = `第 ${state.currentLevel} 关 挑战遗憾失败`;
    let reasonDesc = '红心用完啦！';
    let tipDesc = '💡 看清形状再放下，5 连击能回 1 颗心！';

    if (reason === 'bomb') {
      reasonDesc = '被炸弹炸到啦！';
      tipDesc = '💡 炸弹挂在云朵上时点它扔掉，掉下来时点它拆掉！';
    } else if (reason === 'bug') {
      reasonDesc = '贪吃虫偷走了红心！';
      tipDesc = '💡 看到虫子马上点它！';
    } else if (reason === 'timeout') {
      reasonDesc = '红心用完啦！';
      tipDesc = '💡 注意糖果外圈的倒计时！';
    }

    const cpBtn = document.getElementById('btn-checkpoint-level');
    if (state.isEndlessMode) {
      const isNewBest = state.score > state.endlessBest;
      if (isNewBest) state.endlessBest = state.score;
      saveProgress();
      document.getElementById('level-fail-title').textContent = isNewBest ? '♾️ 新纪录！🏆' : '♾️ 无尽模式结束';
      reasonDesc = `消除了 ${state.endlessRows} 排，得分 ${state.score}（最高 ${state.endlessBest}）`;
      tipDesc = '💡 彩虹糖放进最矮的柱子！';
    }
    if (cpBtn) {
      const cp = !state.isEndlessMode && state.checkpoint;
      cpBtn.style.display = cp ? '' : 'none';
      if (cp) cpBtn.textContent = `📍 从第 ${cp.rows} 排继续`;
    }

    document.getElementById('level-fail-desc').textContent = reasonDesc;
    document.getElementById('level-fail-tip').innerHTML = tipDesc;
    document.getElementById('lf-candies').textContent = state.isEndlessMode ? `${state.levelCollected}` : `${state.levelCollected} / ${getLevelTotalTarget(lvlConfig)}`;
    document.getElementById('lf-time').textContent = formatTime(elapsed);
    document.getElementById('lf-combo').textContent = state.maxCombo;
    document.getElementById('lf-score').textContent = state.score;

    setTimeout(() => {
      document.getElementById('level-fail-modal').classList.add('open');
    }, 500);
  }

  function triggerGrandFinale() {
    if (state.isLevelCleared) return;
    state.isLevelCleared = true;
    state.isGrandFinale = true;
    triggerHaptic('clear');
    sfx.playVictory();

    const elapsed = state.playTime;
    unlockSticker('grand_champion');

    const finaleStars = computeStars().stars;
    if (finaleStars === 3) unlockSticker('speed_star');
    state.levelStars[8] = Math.max(state.levelStars[8] || 0, finaleStars);
    const prevHigh8 = state.levelHighScores[8] || 0;
    if (state.score > prevHigh8) state.levelHighScores[8] = state.score;
    saveProgress();

    document.getElementById('win-stars').textContent = '⭐'.repeat(finaleStars) + '☆'.repeat(3 - finaleStars);
    document.getElementById('win-rank').textContent = '👑 传奇彩虹大魔法师';
    document.getElementById('win-candies').textContent = '70 / 70';
    document.getElementById('win-time').textContent = formatTime(elapsed);
    document.getElementById('win-combo').textContent = state.maxCombo;
    document.getElementById('win-score').textContent = state.score;

    const unlockMsgEl = document.getElementById('win-unlock-msg');
    if (unlockMsgEl) {
      unlockMsgEl.textContent = '7 根彩虹柱全部装满！♾️ 无尽模式已解锁，来挑战最高分吧！';
    }

    spawnVictoryConfetti();

    setTimeout(() => {
      document.getElementById('victory-modal').classList.add('open');
    }, 700);
  }

  function startLevel(lvlIndex, autoIntro = true, endless = false) {
    state.currentLevel = Math.max(1, Math.min(LEVELS.length, lvlIndex));
    state.isEndlessMode = !!endless;
    ENDLESS_CONFIG.candyTimer = ENDLESS_BASE_TIMER;
    state.endlessRows = 0;
    state.checkpoint = null;
    state.usedCheckpoint = false;
    state.heartLossFlash = 0;
    state.driftingCandies = [];
    state.playTime = 0;
    state.isLevelCleared = false;
    state.isLevelFailed = false;
    state.isGrandFinale = false;
    state.score = 0;
    state.combo = 0;
    state.maxCombo = 0;
    state.levelCollected = 0;
    state.levelStartTime = Date.now();
    state.screenShake = 0;
    state.errorFlashTimer = 0;
    state.errorShockwaves = [];
    state.errorHeartPrompt = null;
    state.feverGauge = 0;
    state.feverTimer = 0;
    state.magnetTimer = 0;
    state.windForce = 0;
    state.windTimer = 0;

    // Reset columns & physical feel states
    state.columnCounts = [0, 0, 0, 0, 0, 0, 0];
    state.columnStacks = [[], [], [], [], [], [], []];
    state.columnFullGlow = [0, 0, 0, 0, 0, 0, 0];
    state.columnFrozen = [0, 0, 0, 0, 0, 0, 0];
    state.columnPunchY = [0, 0, 0, 0, 0, 0, 0];
    state.columnBugs = [null, null, null, null, null, null, null];
    state.cloud.angle = 0;
    state.cloud.scaleX = 1;
    state.cloud.scaleY = 1;
    state.cloud.bounceY = 0;

    const lvlConfig = getLevelConfig();

    // Hearts init
    state.maxHearts = lvlConfig.maxHearts || 3;
    state.hearts = state.maxHearts;

    // Top icon charges
    state.topIconCharge = lvlConfig.features.topMagic ? [40, 40, 40, 40, 40, 40] : [0, 0, 0, 0, 0, 0];

    state.fallingCandies = [];
    state.multiplierGates = [];
    state.gateSpawnTimer = lvlConfig.features.multiplierGates ? 1.5 : 99999;
    state.hazardSpawnTimer = lvlConfig.features.hazards ? 8.0 : 99999;
    state.confetti = [];
    state.activeCandy = null;
    state.nextCandy = null;
    state.banner = null;
    state.rowsCompleted = 0;
    state.rowSweeps = [];
    state.luckyCandies = [];
    state.luckySpawnTimer = 3.5;
    state.luckyCount = 0;

    // Reset tutorial in Level 1
    if (state.currentLevel === 1) {
      state.tutorialStep = 0;
      state.tutorialTimer = 0;
    } else {
      state.tutorialStep = 4;
    }

    computeLayout();

    // Align cloud over first active column
    const firstActive = lvlConfig.activeCols[0] || 0;
    if (state.layout.columns[firstActive]) {
      state.cloud.x = state.layout.columns[firstActive].centerX;
      state.cloud.targetX = state.cloud.x;
    }

    spawnNextCandyOnCloud();
    if (lvlConfig.features.multiplierGates) {
      spawnMultiplierGate();
    }

    updateHUD();

    // Close any open modals
    document.getElementById('level-clear-modal').classList.remove('open');
    document.getElementById('level-fail-modal').classList.remove('open');
    document.getElementById('victory-modal').classList.remove('open');
    document.getElementById('level-select-modal').classList.remove('open');

    if (autoIntro) {
      showLevelIntroToast();
    }

    saveProgress();
  }

  // Restart a long level from its last checkpoint (rows rebuilt, hearts refilled, score restored)
  function resumeFromCheckpoint() {
    const cp = state.checkpoint;
    if (!cp) return;
    startLevel(state.currentLevel, false);
    const lvlConfig = getLevelConfig();
    lvlConfig.activeCols.forEach(cIdx => {
      for (let r = 0; r < cp.rows; r++) {
        state.columnStacks[cIdx].push({
          radius: state.layout.candyRadius,
          colorIdx: cIdx,
          shape: COLOR_COLUMNS[cIdx].shape,
          isRainbow: false,
          rotation: (Math.random() - 0.5) * 0.18,
          squish: 1
        });
      }
      state.columnCounts[cIdx] = cp.rows;
    });
    state.levelCollected = cp.rows * lvlConfig.activeCols.length;
    state.rowsCompleted = cp.rows;
    state.score = cp.score;
    state.checkpoint = cp;
    state.usedCheckpoint = true;
    updateHUD();
    showBanner(`📍 从第 ${cp.rows} 排继续！`, '#0284c7', '红心已经补满，加油！');
  }

  function update(dt) {
    updateColumnWidths(dt);
    const cols = state.layout.columns;
    if (!cols.length) return;
    if (!state.isLevelCleared && !state.isLevelFailed) state.playTime += dt;
    const lvlConfig = getLevelConfig();

    sfx.updateBGM(dt, state.feverTimer > 0);

    if (state.screenShake > 0) {
      state.screenShake = Math.max(0, state.screenShake - dt * 20);
    }

    if (state.errorFlashTimer > 0) {
      state.errorFlashTimer = Math.max(0, state.errorFlashTimer - dt);
    }
    if (state.heartLossFlash > 0) {
      state.heartLossFlash = Math.max(0, state.heartLossFlash - dt);
    }
    if (state.blockedMsgCd > 0) state.blockedMsgCd -= dt;
    for (let i = state.driftingCandies.length - 1; i >= 0; i--) {
      const d = state.driftingCandies[i];
      d.vy -= 40 * dt;
      d.x += d.vx * dt;
      d.y += d.vy * dt;
      d.rot += d.vRot * dt;
      d.life -= dt;
      if (d.life <= 0) state.driftingCandies.splice(i, 1);
    }

    if (state.errorHeartPrompt) {
      state.errorHeartPrompt.timer -= dt;
      if (state.errorHeartPrompt.timer <= 0) {
        state.errorHeartPrompt = null;
      }
    }

    for (let i = state.errorShockwaves.length - 1; i >= 0; i--) {
      const sw = state.errorShockwaves[i];
      sw.r += sw.speed * dt;
      sw.alpha = Math.max(0, 1 - sw.r / sw.maxR);
      if (sw.alpha <= 0) {
        state.errorShockwaves.splice(i, 1);
      }
    }

    if (state.magnetTimer > 0) {
      state.magnetTimer = Math.max(0, state.magnetTimer - dt);
    }

    if (state.isLevelFailed) {
      // Keep animating floating texts and particles when level failed
      for (let i = state.particles.length - 1; i >= 0; i--) {
        const p = state.particles[i];
        p.vy += 320 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt;
        p.alpha = Math.max(0, p.life / p.maxLife);
        if (p.life <= 0) state.particles.splice(i, 1);
      }
      for (let i = state.floatingTexts.length - 1; i >= 0; i--) {
        const ft = state.floatingTexts[i];
        ft.y += ft.vy * dt;
        ft.life -= dt;
        ft.alpha = Math.max(0, Math.min(1, ft.life * 1.5));
        if (ft.life <= 0) state.floatingTexts.splice(i, 1);
      }
      return;
    }

    // Victory celebration state updates
    if (state.isLevelCleared) {
      if (Math.random() < 0.15) spawnVictoryConfetti();
      state.cloud.bounceY = Math.sin(performance.now() * 0.008) * 6;
      state.cloud.mood = 'joy';
    }

    // Fever Mode Fountain update
    if (!state.isLevelCleared && lvlConfig.features.fever && state.feverTimer > 0) {
      state.feverTimer -= dt;
      state.cloud.mood = 'joy';
      state.feverSpawnCd -= dt;
      if (state.feverSpawnCd <= 0) {
        state.feverSpawnCd = 0.24;
        const targetCol = pickNeededColorIndex();
        const cObj = cols[targetCol];
        if (cObj) {
          spawnFallingCandyObj({
            x: state.cloud.x + (Math.random() - 0.5) * 40,
            y: state.cloud.y + 20,
            vx: (cObj.centerX - state.cloud.x) * 0.9,
            vy: 190,
            colorIdx: targetCol,
            shape: 'star',
            specialType: 'normal',
            isRainbow: Math.random() < 0.35,
            homing: true
          });
        }
      }
      if (state.feverTimer <= 0) {
        state.feverTimer = 0;
        state.feverGauge = 0;
      }
      updateHUD();
    }

    // Multiplier Gates update & spawn
    if (!state.isLevelCleared && lvlConfig.features.multiplierGates) {
      state.gateSpawnTimer -= dt;
      if (state.gateSpawnTimer <= 0) {
        state.gateSpawnTimer = 4.5 + Math.random() * 2.5;
        spawnMultiplierGate();
      }
    }
    for (let g = state.multiplierGates.length - 1; g >= 0; g--) {
      const gate = state.multiplierGates[g];
      gate.x += gate.vx * dt;
      gate.phase += dt * 3;
      if (gate.x < 32) {
        gate.x = 32;
        gate.vx = Math.abs(gate.vx);
      } else if (gate.x > state.width - 32) {
        gate.x = state.width - 32;
        gate.vx = -Math.abs(gate.vx);
      }
    }

    // Troublemaker Hazards (Caterpillar bugs, Frost, Gentle Wind)
    if (!state.isLevelCleared && lvlConfig.features.hazards) {
      state.hazardSpawnTimer -= dt;
      if (state.hazardSpawnTimer <= 0) {
        state.hazardSpawnTimer = 9.0 + Math.random() * 3.0;
        const candidateCols = lvlConfig.activeCols.filter(i => state.columnCounts[i] < lvlConfig.targetPerTube);
        if (candidateCols.length > 0) {
          const cIdx = candidateCols[Math.floor(Math.random() * candidateCols.length)];
          const roll = Math.random();
          if (lvlConfig.features.hazardTypes?.includes('bug') && roll < 0.45 && !state.columnBugs[cIdx]) {
            state.columnBugs[cIdx] = { hp: 1, timer: 9.0, phase: 0 };
            addFloatingText(cols[cIdx].centerX, cols[cIdx].topY - 22, '🐛 点我！', '#d97706', 1.1);
          } else if (lvlConfig.features.hazardTypes?.includes('ice') && roll < 0.80 && state.columnFrozen[cIdx] <= 0) {
            state.columnFrozen[cIdx] = 8.0;
            addFloatingText(cols[cIdx].centerX, cols[cIdx].topY - 22, '❄️ 点我破冰', '#298cd4', 1.1);
          } else if (lvlConfig.features.hazardTypes?.includes('wind')) {
            state.windTimer = 5.0;
            state.windForce = (Math.random() < 0.5 ? -1 : 1) * 50;
            addFloatingText(state.width / 2, state.layout.cloudY + 55, state.windForce > 0 ? '🌬️ 刮风 ➔' : '⬅ 刮风 🌬️', '#0284c7', 1.15);
          }
        }
      }
    }

    if (state.windTimer > 0) {
      state.windTimer = Math.max(0, state.windTimer - dt);
      if (state.windTimer <= 0) state.windForce = 0;
    }

    // Column bugs & frozen timers
    for (let i = 0; i < cols.length; i++) {
      if (state.columnFrozen[i] > 0) {
        state.columnFrozen[i] = Math.max(0, state.columnFrozen[i] - dt);
      }
      const bug = state.columnBugs[i];
      if (bug) {
        bug.phase += dt * 6;
        bug.timer -= dt;
        if (bug.timer <= 0) {
          if (state.columnCounts[i] > 0 && state.columnCounts[i] < lvlConfig.targetPerTube) {
            state.columnCounts[i] -= 1;
            state.levelCollected = Math.max(0, state.levelCollected - 1);
            state.columnStacks[i].pop();
            state.columnBugs[i] = null;
            if (loseHeart(cols[i].centerX, cols[i].topY - 16, '🐛 偷吃 -1❤️', '🐛 贪吃虫得逞！', '虫子出现时点它赶跑！', 'bug', false)) return;
          }
          state.columnBugs[i] = null;
        }
      }
    }

    // Horizontal cloud motion
    const moveSpeed = state.width * 0.78;
    if (state.keys.left) state.cloud.targetX -= moveSpeed * dt;
    if (state.keys.right) state.cloud.targetX += moveSpeed * dt;
    clampCloudX();

    const prevX = state.cloud.x;
    const lerpFactor = state.isDragging ? 18 : 14;
    state.cloud.x += (state.cloud.targetX - state.cloud.x) * Math.min(1, lerpFactor * dt);
    state.cloud.vx = (state.cloud.x - prevX) / Math.max(dt, 0.001);

    const targetEyeOffset = Math.max(-5, Math.min(5, state.cloud.vx * 0.015));
    state.cloud.eyeOffsetX += (targetEyeOffset - state.cloud.eyeOffsetX) * Math.min(1, 10 * dt);

    // Dynamic cloud tilt from horizontal motion
    const targetAngle = Math.max(-0.13, Math.min(0.13, state.cloud.vx * 0.00038));
    state.cloud.angle += (targetAngle - state.cloud.angle) * Math.min(1, 14 * dt);

    // Dynamic squash-and-stretch recovery
    state.cloud.scaleX += (1 - state.cloud.scaleX) * Math.min(1, 15 * dt);
    state.cloud.scaleY += (1 - state.cloud.scaleY) * Math.min(1, 15 * dt);

    if (!state.isLevelCleared) {
      state.cloud.bounceY *= Math.pow(0.08, dt);
    }
    if (state.cloud.moodTimer > 0) {
      state.cloud.moodTimer -= dt;
      if (state.cloud.moodTimer <= 0 && !state.isLevelCleared) state.cloud.mood = 'happy';
    }

    for (let i = 0; i < state.topIconBounce.length; i++) {
      state.topIconBounce[i] *= Math.pow(0.05, dt);
    }

    // Damped spring recovery for column landing punch recoil
    for (let i = 0; i < state.columnPunchY.length; i++) {
      if (state.columnPunchY[i] > 0.02) {
        state.columnPunchY[i] *= Math.pow(0.008, dt);
      } else {
        state.columnPunchY[i] = 0;
      }
    }

    const currentHoverCol = getColumnIndexAtX(state.cloud.x);
    for (let i = 0; i < cols.length; i++) {
      const isColActive = lvlConfig.activeCols.includes(i);
      const targetGlow = (i === currentHoverCol && isColActive) ? 1 : 0;
      state.columnHighlight[i] += (targetGlow - state.columnHighlight[i]) * Math.min(1, 10 * dt);
      if (state.columnCounts[i] >= lvlConfig.targetPerTube) {
        state.columnFullGlow[i] = Math.min(1, state.columnFullGlow[i] + dt * 2);
      } else {
        state.columnFullGlow[i] = Math.max(0, state.columnFullGlow[i] - dt * 2);
      }
    }

    // Tutorial step progression in Level 1
    if (state.currentLevel === 1 && state.activeCandy) {
      const targetCol = state.activeCandy.colorIdx;
      const isAligned = currentHoverCol === targetCol;
      if (state.tutorialStep === 0 && Math.abs(state.cloud.vx) > 30) {
        state.tutorialStep = 1;
      }
      if (state.tutorialStep === 1 && isAligned) {
        state.tutorialStep = 2;
      } else if (state.tutorialStep === 2 && !isAligned) {
        state.tutorialStep = 1;
      }
    }

    // Active Candy Countdown
    if (!state.isLevelCleared) {
      if (!state.activeCandy) {
        spawnNextCandyOnCloud();
      } else {
        const ac = state.activeCandy;
        ac.scale = Math.min(1, ac.scale + dt * 5);
        ac.age = (ac.age || 0) + dt;

        // Auto drop only if timer isn't infinite
        if (ac.timer < 1000) {
          ac.timer -= dt;
          if (ac.timer <= 0) candyFloatAway();
        }
      }
    }

    // Update Squish Animation
    for (let c = 0; c < state.columnStacks.length; c++) {
      const stack = state.columnStacks[c];
      for (let s = 0; s < stack.length; s++) {
        if (stack[s].squish && stack[s].squish !== 1) {
          stack[s].squish += (1 - stack[s].squish) * Math.min(1, 12 * dt);
        }
      }
    }

    // Falling Candies physics, gate collisions & landing
    for (let i = state.fallingCandies.length - 1; i >= 0; i--) {
      const fc = state.fallingCandies[i];
      fc.vy += fc.gravity * dt;

      if (fc.homing && fc.specialType !== 'bomb') {
        const targetColObj = cols[fc.colorIdx] || cols[0];
        const dx = targetColObj.centerX - fc.x;
        fc.vx += dx * 9.5 * dt;
        fc.vx *= 0.92;
      } else if (state.windForce !== 0 && !fc.homing) {
        fc.vx += state.windForce * dt;
      }

      fc.x = Math.max(16, Math.min(state.width - 16, fc.x + fc.vx * dt));
      fc.y += fc.vy * dt;
      fc.rotation += fc.vRot * dt;

      // Mystery Box mid-air burst
      const midAirY = (state.layout.cloudY + state.layout.columnsTopY) * 0.54;
      if (fc.specialType === 'mystery' && fc.y >= midAirY) {
        sfx.playGateMultiply();
        spawnBurstParticles(fc.x, fc.y, '#ffd700', 22, true);
        addFloatingText(fc.x, fc.y - 12, '🎁 ×3！', '#d97706', 1.25);
        for (let m = -1; m <= 1; m++) {
          const cIdx = pickNeededColorIndex();
          spawnFallingCandyObj({
            x: fc.x + m * 18,
            y: fc.y,
            vx: m * 55,
            vy: 120,
            colorIdx: cIdx,
            shape: CANDY_SHAPES[Math.floor(Math.random() * CANDY_SHAPES.length)],
            specialType: 'normal',
            isRainbow: m === 0,
            homing: true,
            splitDone: true
          });
        }
        state.fallingCandies.splice(i, 1);
        continue;
      }

      // Floating Multiplier Gates collision
      if (!fc.splitDone && fc.specialType !== 'bomb' && lvlConfig.features.multiplierGates) {
        for (let g = state.multiplierGates.length - 1; g >= 0; g--) {
          const gate = state.multiplierGates[g];
          if (Math.hypot(fc.x - gate.x, fc.y - gate.y) <= gate.r + fc.radius * 0.85) {
            fc.splitDone = true;
            sfx.playGateMultiply();
            unlockSticker('bubble_split');
            spawnBurstParticles(gate.x, gate.y, gate.color, 18, true);
            addFloatingText(gate.x, gate.y - 14, `🫧 ×${gate.mult}！`, gate.color, 1.25);

            const extraCount = gate.mult - 1;
            for (let k = 0; k < extraCount; k++) {
              const spread = (k === 0 ? -1 : 1) * 38;
              spawnFallingCandyObj({
                x: fc.x + (k === 0 ? -10 : 10),
                y: fc.y,
                vx: fc.vx + spread,
                vy: fc.vy * 0.9,
                colorIdx: fc.colorIdx,
                shape: fc.shape,
                specialType: 'normal',
                isRainbow: fc.isRainbow,
                homing: true,
                splitDone: true
              });
            }
            state.multiplierGates.splice(g, 1);
            break;
          }
        }
      }

      const colIdx = getColumnIndexAtX(fc.x);
      const col = cols[colIdx];
      const isColActive = lvlConfig.activeCols.includes(colIdx);
      const currentCount = state.columnCounts[colIdx];
      const targetSlot = Math.min(lvlConfig.targetPerTube - 1, currentCount);
      const landingY = getSlotCenterY(targetSlot);

      if (fc.y >= Math.max(col.topY + 20, landingY)) {
        // 1. Bomb landing
        if (fc.specialType === 'bomb') {
          spawnBurstParticles(fc.x, col.topY + 20, '#ef4444', 28, false);
          if (state.columnCounts[colIdx] > 0 && isColActive) {
            state.columnCounts[colIdx] -= 1;
            state.levelCollected = Math.max(0, state.levelCollected - 1);
            state.columnStacks[colIdx].pop();
          }
          state.fallingCandies.splice(i, 1);
          if (loseHeart(col.centerX, col.topY - 12, '💣 -1❤️', '💣 炸弹爆炸！', '下次在空中点它拆弹！', 'bomb')) return;
          continue;
        }

        // 2. Swatting hazards if landed on them
        if (state.columnBugs[colIdx]) {
          state.columnBugs[colIdx] = null;
          state.score += 12;
          triggerHaptic('swat');
          unlockSticker('bomb_hero');
          spawnBurstParticles(col.centerX, col.topY, '#5cd664', 18, true);
          addFloatingText(col.centerX, col.topY - 24, '🐛 +12', '#1d8f24', 1.2);
        }
        if (state.columnFrozen[colIdx] > 0) {
          state.columnFrozen[colIdx] = 0;
          state.score += 10;
          triggerHaptic('swat');
          spawnBurstParticles(col.centerX, col.topY, '#73c6ff', 18, false);
          addFloatingText(col.centerX, col.topY - 24, '❄️ +10', '#298cd4', 1.2);
        }

        // 3. Match checking
        const matched = isColActive && (fc.isRainbow || fc.specialType === 'shower' || colIdx === fc.colorIdx);

        if (matched) {
          if (lvlConfig.features.combo) {
            state.combo += 1;
            if (state.combo > state.maxCombo) state.maxCombo = state.combo;
            if (state.combo >= 10) unlockSticker('combo_master');
            onComboIncreased();

            // 5-Combo Heart Recovery Bonus!
            if (state.combo % 5 === 0 && state.hearts < state.maxHearts) {
              state.hearts = Math.min(state.maxHearts, state.hearts + 1);
              spawnBurstParticles(state.cloud.x, state.cloud.y - 18, '#ff4d6d', 20, true);
              addFloatingText(state.cloud.x, state.cloud.y - 28, '💖 5连击 +1❤️', '#ff2e63', 1.35);
            }
          } else {
            state.combo = 1;
          }

          const basePoints = fc.isRainbow ? 5 : (1 + Math.min(state.combo - 1, 6));
          const mult = getComboMult();
          const quickBonus = fc.quick ? 3 : 0;
          const points = (basePoints + quickBonus) * mult;
          state.score += points;
          if (fc.quick) {
            addFloatingText(col.centerX, landingY - 44, '⚡ 神速', '#f59e0b', 1.0);
            if (lvlConfig.features.fever && state.feverTimer <= 0) {
              state.feverGauge = Math.min(100, state.feverGauge + 5);
            }
          }

          // Charge top magic icons if feature is enabled
          if (lvlConfig.features.topMagic) {
            const iconSlot = colIdx % 6;
            state.topIconCharge[iconSlot] = Math.min(100, state.topIconCharge[iconSlot] + 34);
            state.topIconCharge[(iconSlot + 3) % 6] = Math.min(100, state.topIconCharge[(iconSlot + 3) % 6] + 18);
          }

          // Fever gauge
          if (lvlConfig.features.fever && state.feverTimer <= 0) {
            state.feverGauge = Math.min(100, state.feverGauge + (fc.isRainbow ? 24 : 15));
            if (state.feverGauge >= 100) {
              triggerFeverMode();
            }
          }

          // Shower special candy
          if (fc.specialType === 'shower') {
            sfx.playMatch(colIdx);
            addFloatingText(state.width / 2, state.layout.columnsTopY - 24, '🌧️ 每柱 +1！', '#298cd4', 1.35);
            lvlConfig.activeCols.forEach(c => addCandyToColumn(c, 'star', false));
          } else if (currentCount < lvlConfig.targetPerTube) {
            addCandyToColumn(colIdx, fc.shape, fc.isRainbow);
            state.cloud.mood = 'joy';
            state.cloud.moodTimer = 0.7;
            state.cloud.bounceY = -10;
            state.topIconBounce[colIdx % 6] = 10;

            // Pure single piano note for ear-training
            sfx.playMatch(colIdx);
            const progressStr = `${state.columnCounts[colIdx]}/${lvlConfig.targetPerTube}`;
            addFloatingText(
              col.centerX,
              landingY - 18,
              `+${points}`,
              '#fff',
              1.15
            );

            // Tutorial feedback in Level 1
            if (state.currentLevel === 1) {
              if (state.levelCollected === 1) {
                addFloatingText(state.width / 2, state.cloud.y - 20, '🎉 放对啦！', '#1d8f24', 1.25);
              } else if (state.levelCollected >= 2 && state.tutorialStep < 4) {
                state.tutorialStep = 4;
                addFloatingText(state.width / 2, state.cloud.y - 20, '🌟 装满两柱就过关！', '#298cd4', 1.2);
              }
            }
          } else if (fc.isRainbow && getLowestNeededColumn() !== null) {
            // Rainbow landed on a full column: hop over to the lowest one
            const to = getLowestNeededColumn();
            spawnBurstParticles(fc.x, landingY, '#ffd700', 12, true);
            addCandyToColumn(to, 'star', true);
            sfx.playMatch(to);
            addFloatingText(cols[to].centerX, cols[to].topY - 14, '🌈 跳过来啦', '#7c3aed', 1.1);
          } else {
            // Already full
            state.columnPunchY[colIdx] = 6.0;
            triggerHaptic('match');
            sfx.playMatch(colIdx);
            state.score += 5;
            spawnBurstParticles(fc.x, landingY, '#ffd700', 12, true);
            addFloatingText(col.centerX, landingY - 18, '⭐ +5', '#ffd700', 1.15);
          }

          updateHUD();
        } else {
          // Mismatch or dropped into inactive column
          const targetName = COLOR_COLUMNS[fc.colorIdx].name;
          spawnBurstParticles(fc.x, fc.y, '#e11d48', 26, false);
          state.columnHighlight[fc.colorIdx] = 1.8;
          state.fallingCandies.splice(i, 1);
          const failed = loseHeart(
            fc.x,
            Math.min(fc.y - 10, state.layout.columnsTopY + 50),
            `💔 → ${targetName}`,
            !isColActive ? '💔 这条跑道还没开' : '💔 放错颜色啦',
            `它要去【${targetName}】`,
            'mismatch'
          );
          if (failed) return;
          continue;
        }

        state.fallingCandies.splice(i, 1);
      }
    }

    // Particles
    for (let i = state.particles.length - 1; i >= 0; i--) {
      const p = state.particles[i];
      p.vy += 320 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      p.alpha = Math.max(0, p.life / p.maxLife);
      if (p.life <= 0) state.particles.splice(i, 1);
    }

    // Victory Confetti
    for (let i = state.confetti.length - 1; i >= 0; i--) {
      const cf = state.confetti[i];
      cf.y += cf.vy * dt;
      cf.x += cf.vx * dt + Math.sin(cf.y * 0.05) * 30 * dt;
      cf.rotation += cf.vRot * dt;
      if (cf.y > state.height + 40) {
        state.confetti.splice(i, 1);
      }
    }

    // Floating texts
    for (let i = state.floatingTexts.length - 1; i >= 0; i--) {
      const ft = state.floatingTexts[i];
      ft.y += ft.vy * dt;
      ft.life -= dt;
      ft.alpha = Math.max(0, Math.min(1, ft.life * 1.5));
      if (ft.life <= 0) state.floatingTexts.splice(i, 1);
    }

    // Big center banner
    if (state.banner) {
      state.banner.life -= dt;
      if (state.banner.life <= 0) state.banner = null;
    }

    // Rainbow row sweeps: each column pops in time with its scale note
    for (let i = state.rowSweeps.length - 1; i >= 0; i--) {
      const sw = state.rowSweeps[i];
      sw.t += dt;
      while (sw.hit < sw.order.length && sw.t >= 0.45 + sw.hit * 0.11) {
        const cIdx = sw.order[sw.hit];
        const col = cols[cIdx];
        if (col) {
          state.columnPunchY[cIdx] = 9;
          state.columnHighlight[cIdx] = 1.6;
          spawnBurstParticles(col.centerX, getSlotCenterY(sw.slot), COLOR_COLUMNS[cIdx].lightHex, 8, false);
        }
        sw.hit++;
      }
      if (sw.t >= sw.dur) state.rowSweeps.splice(i, 1);
    }

    updateLuckyCandies(dt);

    // Hot-streak sparkle trail under the cloud at high combo
    if (!state.isLevelCleared && state.combo >= 6 && Math.random() < dt * 22) {
      const side = (Math.random() - 0.5) * state.cloud.width * 0.9;
      state.particles.push({
        x: state.cloud.x + side,
        y: state.cloud.y + state.cloud.height * 0.4,
        vx: -state.cloud.vx * 0.15 + (Math.random() - 0.5) * 30,
        vy: 20 + Math.random() * 40,
        radius: 2.5 + Math.random() * 3,
        color: COLOR_COLUMNS[Math.floor(Math.random() * COLOR_COLUMNS.length)].lightHex,
        alpha: 1,
        life: 0.5 + Math.random() * 0.3,
        maxLife: 0.8
      });
    }
  }

  /* ---------------- Drawing functions ---------------- */

  function drawRowSweeps(ctx) {
    if (!state.rowSweeps.length) return;
    const cols = state.layout.columns;
    for (const sw of state.rowSweeps) {
      const first = cols[sw.order[0]];
      const last = cols[sw.order[sw.order.length - 1]];
      if (!first || !last) continue;
      const x0 = first.x + 2;
      const x1 = last.x + last.width - 2;
      const y = getSlotCenterY(sw.slot);
      const h = Math.max(14, state.layout.slotHeight * 0.92);
      const headT = Math.min(1, Math.max(0, (sw.t - 0.35) / (sw.order.length * 0.11 + 0.15)));
      const fade = sw.t < sw.dur - 0.5 ? 1 : Math.max(0, (sw.dur - sw.t) / 0.5);
      const headX = x0 + (x1 - x0) * headT;
      if (headX - x0 < 2) continue;

      ctx.save();
      const grad = ctx.createLinearGradient(x0, 0, x1, 0);
      COLOR_COLUMNS.forEach((c, i) => grad.addColorStop(i / (COLOR_COLUMNS.length - 1), c.lightHex));
      ctx.globalAlpha = 0.5 * fade;
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x0, y - h / 2, headX - x0, h, Math.min(h / 2, (headX - x0) / 2));
      ctx.fill();
      ctx.globalAlpha = 0.9 * fade;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Shining head star
      ctx.globalAlpha = fade;
      ctx.translate(headX, y);
      ctx.rotate(sw.t * 6);
      ctx.fillStyle = '#ffd700';
      ctx.strokeStyle = '#282a24';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let k = 0; k < 10; k++) {
        const r = k % 2 === 0 ? h * 0.6 : h * 0.26;
        const a = (Math.PI * k) / 5 - Math.PI / 2;
        ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  }

  function drawLuckyCandies(ctx) {
    const cloudY = state.cloud.y;
    for (const lc of state.luckyCandies) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, lc.life);

      // Landing hint: soft shadow on the cloud's line so kids can see where to catch it
      if (lc.y < cloudY) {
        const near = 1 - Math.min(1, (cloudY - lc.y) / 140);
        ctx.fillStyle = `rgba(245, 158, 11, ${0.12 + near * 0.25})`;
        ctx.beginPath();
        ctx.ellipse(lc.x, cloudY - state.cloud.height * 0.5 - 2, 10 + near * 8, 3.5, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Glow
      const glow = ctx.createRadialGradient(lc.x, lc.y, 2, lc.x, lc.y, 26);
      glow.addColorStop(0, lc.kind === 'heart' ? 'rgba(255, 77, 109, 0.55)' : 'rgba(255, 215, 0, 0.6)');
      glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(lc.x, lc.y, 26, 0, Math.PI * 2);
      ctx.fill();

      ctx.translate(lc.x, lc.y);
      ctx.strokeStyle = '#282a24';
      ctx.lineWidth = 2;
      if (lc.kind === 'heart') {
        const s = 1.25 + Math.sin(lc.spin * 2) * 0.08;
        ctx.scale(s * 2, s * 2);
        ctx.beginPath();
        ctx.moveTo(0, 4.5);
        ctx.bezierCurveTo(-5.5, 0.8, -6.5, -5.5, 0, -2);
        ctx.bezierCurveTo(6.5, -5.5, 5.5, 0.8, 0, 4.5);
        ctx.closePath();
        ctx.fillStyle = '#ef4444';
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.stroke();
      } else {
        ctx.rotate(Math.sin(lc.spin) * 0.4);
        ctx.fillStyle = '#ffd43b';
        ctx.beginPath();
        for (let k = 0; k < 10; k++) {
          const r = k % 2 === 0 ? 13 : 6;
          const a = (Math.PI * k) / 5 - Math.PI / 2;
          ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.beginPath();
        ctx.arc(-3, -3, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function drawBanner(ctx) {
    const b = state.banner;
    if (!b) return;
    const t = 1 - b.life / b.maxLife; // 0 -> 1
    const pop = t < 0.15 ? 0.6 + (t / 0.15) * 0.55 : (t < 0.25 ? 1.15 - ((t - 0.15) / 0.1) * 0.15 : 1);
    const alpha = b.life < 0.35 ? b.life / 0.35 : 1;
    const cx = state.width / 2;
    const cy = state.layout.columnsTopY + (state.height - state.layout.columnsTopY) * 0.32;
    const fontSize = Math.round(Math.min(40, Math.max(24, state.width * 0.06)));

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(cx, cy - t * 18);
    ctx.scale(pop, pop);
    ctx.rotate(-0.03);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `900 ${fontSize}px "PingFang SC", "Microsoft YaHei", sans-serif`;
    ctx.lineJoin = 'round';
    ctx.lineWidth = 9;
    ctx.strokeStyle = '#ffffff';
    ctx.strokeText(b.text, 0, 0);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#282a24';
    ctx.strokeText(b.text, 0, 0);
    ctx.fillStyle = b.color;
    ctx.fillText(b.text, 0, 0);
    if (b.sub) {
      ctx.font = `800 ${Math.round(fontSize * 0.42)}px "PingFang SC", "Microsoft YaHei", sans-serif`;
      ctx.lineWidth = 5;
      ctx.strokeStyle = '#ffffff';
      ctx.strokeText(b.sub, 0, fontSize * 0.85);
      ctx.fillStyle = '#282a24';
      ctx.fillText(b.sub, 0, fontSize * 0.85);
    }
    ctx.restore();
  }

  function drawGreenStarIcon(ctx, cx, cy, size) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.strokeStyle = '#2d6e32';
    ctx.fillStyle = '#3b8c40';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(-size * 0.2, -size * 0.85);
    ctx.lineTo(0, -size * 0.15);
    ctx.lineTo(size * 0.28, -size * 0.65);
    ctx.lineTo(size * 0.15, -size * 0.05);
    ctx.lineTo(size * 0.85, 0);
    ctx.lineTo(size * 0.12, size * 0.16);
    ctx.lineTo(size * 0.18, size * 0.82);
    ctx.lineTo(-size * 0.12, size * 0.18);
    ctx.lineTo(-size * 0.78, size * 0.05);
    ctx.lineTo(-size * 0.18, -size * 0.12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  function drawSplitHeartIcon(ctx, cx, cy, size, swapColors = false) {
    ctx.save();
    ctx.translate(cx, cy);
    const leftColor = swapColors ? '#edd0b7' : '#96c96a';
    const rightColor = swapColors ? '#96c96a' : '#edd0b7';

    ctx.beginPath();
    ctx.moveTo(0, -size * 0.25);
    ctx.bezierCurveTo(-size * 0.45, -size * 0.9, -size * 1.05, -size * 0.2, 0, size * 0.78);
    ctx.closePath();
    ctx.fillStyle = leftColor;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, -size * 0.25);
    ctx.bezierCurveTo(size * 0.45, -size * 0.9, size * 1.05, -size * 0.2, 0, size * 0.78);
    ctx.closePath();
    ctx.fillStyle = rightColor;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, -size * 0.25);
    ctx.bezierCurveTo(-size * 0.45, -size * 0.9, -size * 1.05, -size * 0.2, 0, size * 0.78);
    ctx.bezierCurveTo(size * 1.05, -size * 0.2, size * 0.45, -size * 0.9, 0, -size * 0.25);
    ctx.strokeStyle = '#5c5346';
    ctx.lineWidth = 2.2;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, -size * 0.25);
    ctx.lineTo(0, size * 0.76);
    ctx.strokeStyle = 'rgba(92,83,70,0.45)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }

  function drawBerryHeartIcon(ctx, cx, cy, size) {
    ctx.save();
    ctx.translate(cx, cy);

    ctx.beginPath();
    ctx.moveTo(-size * 0.68, -size * 0.1);
    ctx.quadraticCurveTo(-size * 0.45, size * 0.45, 0, size * 0.82);
    ctx.quadraticCurveTo(size * 0.45, size * 0.45, size * 0.68, -size * 0.1);
    ctx.closePath();
    ctx.fillStyle = '#7e3f8f';
    ctx.fill();
    ctx.strokeStyle = '#4e2759';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(-size * 0.4, -size * 0.18, size * 0.28, Math.PI * 0.85, Math.PI * 2.15);
    ctx.arc(0, -size * 0.26, size * 0.3, Math.PI * 0.95, Math.PI * 2.05);
    ctx.arc(size * 0.4, -size * 0.18, size * 0.28, Math.PI * 0.85, Math.PI * 2.15);
    ctx.closePath();
    ctx.fillStyle = '#52b8b5';
    ctx.fill();
    ctx.strokeStyle = '#387d7a';
    ctx.lineWidth = 1.8;
    ctx.stroke();
    ctx.restore();
  }

  function drawTopHeaderDecorations(ctx) {
    const W = state.width;
    const y = state.layout.topIconsY;
    const iconSize = Math.min(Math.max(W * 0.034, 15), 24);
    const lvlConfig = getLevelConfig();

    ctx.save();
    ctx.font = `bold ${Math.max(13, Math.min(16, W * 0.026))}px "Comic Sans MS", "KaiTi", cursive, sans-serif`;
    ctx.fillStyle = '#4f5d75';
    ctx.textAlign = 'right';
    ctx.translate(W - 12, 20);
    ctx.rotate(0.02);
    ctx.fillText('2026年11月1日', 0, 0);
    ctx.restore();

    const startX = W * 0.14;
    const endX = W * 0.86;
    const step = (endX - startX) / 5;
    state.topIconPos = [];

    for (let i = 0; i < 6; i++) {
      const ix = startX + step * i;
      const charge = state.topIconCharge[i] || 0;
      const isReady = lvlConfig.features.topMagic && charge >= 100;
      const pulse = isReady ? Math.sin(performance.now() * 0.008 + i) * 3 : 0;
      const iy = y - state.topIconBounce[i] + pulse;
      state.topIconPos.push({ x: ix, y: iy, r: iconSize * 1.45 });

      ctx.save();
      if (!lvlConfig.features.topMagic) {
        ctx.globalAlpha = 0.42;
      }

      // Charge progress ring
      ctx.beginPath();
      ctx.arc(ix, iy, iconSize * 1.25, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * Math.min(100, charge)) / 100);
      ctx.strokeStyle = isReady ? '#f59e0b' : 'rgba(70, 80, 176, 0.28)';
      ctx.lineWidth = isReady ? 3.5 : 2;
      if (isReady) {
        ctx.fillStyle = 'rgba(255, 235, 130, 0.55)';
        ctx.fill();
      }
      ctx.stroke();

      if (i === 0 || i === 3) {
        drawGreenStarIcon(ctx, ix, iy, iconSize * 1.15);
      } else if (i === 1) {
        drawSplitHeartIcon(ctx, ix, iy, iconSize, false);
      } else if (i === 4) {
        drawSplitHeartIcon(ctx, ix, iy, iconSize, true);
      } else {
        drawBerryHeartIcon(ctx, ix, iy, iconSize * 0.95);
      }

      if (isReady) {
        // Button base + glow so a charged icon clearly looks pressable
        ctx.save();
        ctx.globalAlpha = 0.35 + Math.sin(performance.now() * 0.01 + i) * 0.15;
        ctx.fillStyle = '#ffd43b';
        ctx.beginPath();
        ctx.arc(ix, iy, iconSize * 1.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#b45309';
        const keyHint = IS_TOUCH ? '' : ` ${['Q', 'E', 'R'][i % 3]}`;
        ctx.fillText(`✨点我${keyHint}`, ix, iy + iconSize * 1.52);
      }
      ctx.restore();
    }
  }

  function drawCandy(ctx, x, y, radius, colorIdx, shape, isRainbow = false, rotation = 0, squish = 1, specialType = 'normal') {
    const col = COLOR_COLUMNS[colorIdx] || COLOR_COLUMNS[0];
    // Every color always has its own shape (easier for little kids & color-blind players)
    if (!isRainbow && col.shape) shape = col.shape;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    if (squish && squish !== 1) {
      ctx.scale(squish, 1 / squish);
    }

    ctx.shadowColor = 'rgba(0, 0, 0, 0.28)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetY = 2.5;

    // 1. Mischievous Bomb Candy
    if (specialType === 'bomb') {
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.95, 0, Math.PI * 2);
      ctx.fillStyle = '#2b2d2f';
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#ff4d4f';
      ctx.stroke();

      // Fuse & spark
      ctx.beginPath();
      ctx.moveTo(0, -radius * 0.9);
      ctx.quadraticCurveTo(radius * 0.4, -radius * 1.35, radius * 0.65, -radius * 1.15);
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      const sparkR = 3.5 + Math.sin(performance.now() * 0.025) * 2;
      ctx.beginPath();
      ctx.arc(radius * 0.65, -radius * 1.15, sparkR, 0, Math.PI * 2);
      ctx.fillStyle = '#fde047';
      ctx.fill();

      ctx.shadowColor = 'transparent';
      ctx.fillStyle = '#fff';
      ctx.font = `bold ${Math.round(radius * 0.85)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('💣', 0, 1);
      ctx.restore();
      return;
    }

    // 2. Mystery Gift Box Candy
    if (specialType === 'mystery') {
      const s = radius * 0.92;
      ctx.fillStyle = '#f59e0b';
      ctx.strokeStyle = '#282a24';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(-s, -s, s * 2, s * 2, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-s * 0.24, -s, s * 0.48, s * 2);
      ctx.fillRect(-s, -s * 0.24, s * 2, s * 0.48);

      ctx.shadowColor = 'transparent';
      ctx.fillStyle = '#fff';
      ctx.font = `bold ${Math.round(radius * 0.95)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('?', 0, 1);
      ctx.restore();
      return;
    }

    // 3. Rainbow Shower Candy
    if (specialType === 'shower') {
      const grad = ctx.createLinearGradient(-radius, -radius, radius, radius);
      grad.addColorStop(0, '#38bdf8');
      grad.addColorStop(0.5, '#c084fc');
      grad.addColorStop(1, '#f472b6');
      ctx.fillStyle = grad;
      ctx.strokeStyle = '#282a24';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.shadowColor = 'transparent';
      ctx.fillStyle = '#fff';
      ctx.font = `bold ${Math.round(radius * 0.9)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🌧️', 0, 1);
      ctx.restore();
      return;
    }

    // 4. Wildcard Rainbow Star Candy
    if (isRainbow) {
      const pulse = 1 + Math.sin(performance.now() * 0.008) * 0.06;
      ctx.scale(pulse, pulse);
      const grad = ctx.createLinearGradient(-radius, -radius, radius, radius);
      grad.addColorStop(0, '#ff4b4b');
      grad.addColorStop(0.2, '#ffa040');
      grad.addColorStop(0.4, '#ffd700');
      grad.addColorStop(0.6, '#4ade80');
      grad.addColorStop(0.8, '#38bdf8');
      grad.addColorStop(1, '#c084fc');

      ctx.fillStyle = grad;
      ctx.strokeStyle = '#282a24';
      ctx.lineWidth = 2.6;

      ctx.beginPath();
      const spikes = 5;
      const rot = Math.PI / 2 * 3;
      const step = Math.PI / spikes;
      let cx = 0, cy = 0;
      for (let i = 0; i < spikes; i++) {
        cx = Math.cos(rot + i * step * 2) * radius * 1.05;
        cy = Math.sin(rot + i * step * 2) * radius * 1.05;
        ctx.lineTo(cx, cy);
        cx = Math.cos(rot + (i * 2 + 1) * step) * radius * 0.52;
        cy = Math.sin(rot + (i * 2 + 1) * step) * radius * 0.52;
        ctx.lineTo(cx, cy);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Golden sparkle
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(-radius * 0.25, -radius * 0.25, radius * 0.22, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return;
    }

    // 5. Standard Plump Hand-Drawn Candy Shapes
    ctx.fillStyle = col.hex;
    ctx.strokeStyle = '#282a24';
    ctx.lineWidth = 2.4;

    if (shape === 'wrapped') {
      // Candy wrapper ends
      ctx.fillStyle = col.lightHex;
      ctx.beginPath();
      ctx.moveTo(-radius * 1.45, -radius * 0.55);
      ctx.lineTo(-radius * 0.7, 0);
      ctx.lineTo(-radius * 1.45, radius * 0.55);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(radius * 1.45, -radius * 0.55);
      ctx.lineTo(radius * 0.7, 0);
      ctx.lineTo(radius * 1.45, radius * 0.55);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Center sweet pill
      ctx.fillStyle = col.hex;
      ctx.beginPath();
      ctx.ellipse(0, 0, radius * 0.88, radius * 0.68, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else if (shape === 'heart') {
      ctx.beginPath();
      ctx.moveTo(0, radius * 0.75);
      ctx.bezierCurveTo(-radius * 1.25, 0, -radius * 1.1, -radius * 0.9, 0, -radius * 0.35);
      ctx.bezierCurveTo(radius * 1.1, -radius * 0.9, radius * 1.25, 0, 0, radius * 0.75);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (shape === 'berry') {
      ctx.beginPath();
      ctx.arc(0, radius * 0.1, radius * 0.85, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Little leaves on top
      ctx.fillStyle = '#1d8f24';
      ctx.beginPath();
      ctx.ellipse(-radius * 0.3, -radius * 0.75, radius * 0.35, radius * 0.16, -0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(radius * 0.3, -radius * 0.75, radius * 0.35, radius * 0.16, 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else if (shape === 'star') {
      ctx.beginPath();
      const spikes = 5;
      const rot = Math.PI / 2 * 3;
      const step = Math.PI / spikes;
      for (let i = 0; i < spikes; i++) {
        const cx = Math.cos(rot + i * step * 2) * radius * 0.98;
        const cy = Math.sin(rot + i * step * 2) * radius * 0.98;
        ctx.lineTo(cx, cy);
        const inX = Math.cos(rot + (i * 2 + 1) * step) * radius * 0.5;
        const inY = Math.sin(rot + (i * 2 + 1) * step) * radius * 0.5;
        ctx.lineTo(inX, inY);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (shape === 'grape') {
      // Grape bunch: 6 little berries + stem
      const g = radius * 0.36;
      const pts = [[-g, -g * 1.1], [g, -g * 1.1], [-g * 1.9, -g * 0.1], [0, -g * 0.1], [g * 1.9, -g * 0.1], [-g, g * 0.95], [g, g * 0.95], [0, g * 1.95]];
      pts.forEach(([gx, gy]) => {
        ctx.beginPath();
        ctx.arc(gx, gy, g * 1.02, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });
      ctx.strokeStyle = '#1d8f24';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, -g * 1.9);
      ctx.lineTo(g * 0.6, -g * 2.7);
      ctx.stroke();
    } else if (shape === 'diamond') {
      ctx.beginPath();
      ctx.moveTo(0, -radius * 0.95);
      ctx.lineTo(radius * 0.85, -radius * 0.2);
      ctx.lineTo(0, radius * 0.95);
      ctx.lineTo(-radius * 0.85, -radius * 0.2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-radius * 0.85, -radius * 0.2);
      ctx.lineTo(radius * 0.85, -radius * 0.2);
      ctx.lineWidth = 1.6;
      ctx.stroke();
    } else if (shape === 'drop') {
      ctx.beginPath();
      ctx.moveTo(0, -radius * 1.0);
      ctx.bezierCurveTo(radius * 0.25, -radius * 0.55, radius * 0.88, -radius * 0.05, radius * 0.88, radius * 0.3);
      ctx.arc(0, radius * 0.3, radius * 0.88, 0, Math.PI);
      ctx.bezierCurveTo(-radius * 0.88, -radius * 0.05, -radius * 0.25, -radius * 0.55, 0, -radius * 1.0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else {
      // Classic round ball candy
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.9, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // Glossy highlight shine
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.beginPath();
    ctx.arc(-radius * 0.3, -radius * 0.3, radius * 0.24, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function drawMultiplierGates(ctx) {
    for (let i = 0; i < state.multiplierGates.length; i++) {
      const g = state.multiplierGates[i];
      ctx.save();
      ctx.translate(g.x, g.y);

      // Bubbling float
      const bob = Math.sin(g.phase) * 3;
      ctx.translate(0, bob);

      // Outer bubble glow
      ctx.fillStyle = g.bg;
      ctx.beginPath();
      ctx.arc(0, 0, g.r + 5, 0, Math.PI * 2);
      ctx.fill();

      // Main ring
      ctx.beginPath();
      ctx.arc(0, 0, g.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
      ctx.fill();
      ctx.strokeStyle = g.color;
      ctx.lineWidth = 3.5;
      ctx.stroke();

      // Badge text
      ctx.fillStyle = g.color;
      ctx.font = '900 15px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`×${g.mult}`, 0, 1);

      ctx.restore();
    }
  }

  function drawCloudBar(ctx) {
    const c = state.cloud;
    const x = c.x;
    const y = c.y;
    const halfW = c.width / 2;
    const halfH = c.height / 2;
    const curLevelConfig = getLevelConfig();

    ctx.save();
    ctx.translate(x, y + c.bounceY);
    ctx.rotate(c.angle || 0);
    ctx.scale(c.scaleX || 1, c.scaleY || 1);
    ctx.translate(-x, -y);

    // Thick Hand-Drawn Yellow-Green Frame
    ctx.beginPath();
    ctx.roundRect(x - halfW, y - halfH, c.width, c.height, 22);
    ctx.fillStyle = '#dbe32b';
    ctx.fill();
    ctx.strokeStyle = '#282a24';
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Inner White Cloud Body
    const innerW = c.width - 16;
    const innerH = c.height - 14;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(x - innerW / 2, y - innerH / 2, innerW, innerH, 16);
    ctx.fill();

    // Cute Cheerful Face
    const eyeSpacing = Math.min(innerW * 0.22, 28);
    const eyeY = y - 2;
    const eyeR = 3.5;

    // Pink Cheeks
    ctx.fillStyle = 'rgba(244, 114, 182, 0.65)';
    ctx.beginPath();
    ctx.arc(x - eyeSpacing - 12, eyeY + 4, 6.5, 0, Math.PI * 2);
    ctx.arc(x + eyeSpacing + 12, eyeY + 4, 6.5, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#282a24';
    if (c.mood === 'joy') {
      ctx.lineWidth = 2.4;
      ctx.strokeStyle = '#282a24';
      ctx.beginPath();
      ctx.arc(x - eyeSpacing, eyeY, 4, Math.PI, 0);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x + eyeSpacing, eyeY, 4, Math.PI, 0);
      ctx.stroke();
    } else if (c.mood === 'oops') {
      ctx.beginPath();
      ctx.arc(x - eyeSpacing, eyeY, 4.5, 0, Math.PI * 2);
      ctx.arc(x + eyeSpacing, eyeY, 4.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const ex = c.eyeOffsetX;
      ctx.beginPath();
      ctx.arc(x - eyeSpacing + ex, eyeY, eyeR, 0, Math.PI * 2);
      ctx.arc(x + eyeSpacing + ex, eyeY, eyeR, 0, Math.PI * 2);
      ctx.fill();
    }

    // Mouth
    ctx.beginPath();
    if (c.mood === 'joy') {
      ctx.arc(x, eyeY + 5, 6, 0, Math.PI);
      ctx.fillStyle = '#ef4444';
      ctx.fill();
      ctx.strokeStyle = '#282a24';
      ctx.lineWidth = 2;
      ctx.stroke();
    } else if (c.mood === 'oops') {
      ctx.arc(x, eyeY + 7, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#282a24';
      ctx.fill();
    } else {
      ctx.arc(x, eyeY + 4, 5, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.strokeStyle = '#282a24';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Combo multiplier badge on the cloud's left
    const comboTier = getComboTier();
    if (comboTier) {
      const bx = x - halfW + 4;
      const by = y - halfH - 14;
      const wob = Math.sin(performance.now() * 0.012) * 0.08;
      ctx.save();
      ctx.translate(bx + 22, by);
      ctx.rotate(wob);
      ctx.fillStyle = comboTier.color;
      ctx.strokeStyle = '#282a24';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-24, -13, 74, 26, 13);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.font = '900 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`🔥${state.combo} ×${comboTier.mult}`, 13, 5);
      ctx.restore();
    }

    // Next Candy Preview Bubble on Cloud's Right (Bigger & Clearer)
    if (state.nextCandy) {
      const nc = state.nextCandy;
      const r = getNextBubbleRect(false);
      ctx.fillStyle = 'rgba(255,255,255,0.97)';
      ctx.strokeStyle = '#282a24';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.roundRect(r.x, r.y, r.w, r.h, r.h / 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#444';
      ctx.font = `bold ${r.big ? 15 : 13}px sans-serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText('⇄换', r.x + 8, r.y + r.h / 2 + 1);
      ctx.textBaseline = 'alphabetic';
      drawCandy(ctx, r.x + r.w - r.h / 2 - 2, r.y + r.h / 2, r.big ? 11 : 9, nc.colorIdx, nc.shape, nc.isRainbow, 0, 1, nc.specialType);
    }

    ctx.restore();

    // Active Candy Under Cloud
    if (state.activeCandy) {
      const ac = state.activeCandy;
      const candyR = state.layout.candyRadius * ac.scale;
      const urgent = ac.timer < 1.0 && ac.timer < 1000;
      const blink = urgent && Math.floor(performance.now() / 120) % 2 === 0;
      const candyX = x + (urgent ? Math.sin(performance.now() * 0.06) * 2.5 : 0);
      const candyY = y + c.bounceY + halfH + candyR * 0.95 + 6;
      const colInfo = COLOR_COLUMNS[ac.colorIdx];
      const hoverIdx = getColumnIndexAtX(candyX);
      const isTargetActive = curLevelConfig.activeCols.includes(hoverIdx);
      const isMatch = isTargetActive && ac.specialType !== 'bomb' && (ac.isRainbow || ac.specialType === 'mystery' || ac.specialType === 'shower' || hoverIdx === ac.colorIdx);

      // Alignment laser / guide line
      ctx.save();
      ctx.beginPath();
      ctx.setLineDash([6, 6]);
      ctx.moveTo(candyX, candyY + candyR);
      ctx.lineTo(candyX, state.layout.columnsTopY);
      ctx.strokeStyle = ac.specialType === 'bomb' ? '#ef4444' : (isMatch ? colInfo.hex : 'rgba(80, 80, 80, 0.35)');
      ctx.lineWidth = isMatch ? 3.5 : 2;
      ctx.stroke();
      ctx.restore();

      // Progress Ring around active candy (if not infinite)
      if (ac.timer < 1000) {
        ctx.save();
        ctx.beginPath();
        const progress = Math.max(0, ac.timer / ac.maxTimer);
        ctx.arc(candyX, candyY, candyR + 6, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
        ctx.strokeStyle = blink ? '#ef4444' : (ac.specialType === 'bomb' ? '#ef4444' : (isMatch ? '#1d8f24' : colInfo.hex));
        ctx.lineWidth = urgent ? 5 : 3.5;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.restore();
      }

      drawCandy(ctx, candyX, candyY, candyR, ac.colorIdx, ac.shape, ac.isRainbow, Math.sin(performance.now() * 0.005) * 0.12, 1, ac.specialType);
    }
  }

  function drawRainbowColumns(ctx) {
    const cols = state.layout.columns;
    const H = state.height;
    const curLevelConfig = getLevelConfig();

    for (let i = 0; i < cols.length; i++) {
      const colRect = cols[i];
      const colDef = COLOR_COLUMNS[i];
      const isActive = curLevelConfig.activeCols.includes(i);
      const glow = state.columnHighlight[i];
      const punchY = state.columnPunchY[i] || 0;
      const isFull = state.columnCounts[i] >= curLevelConfig.targetPerTube;
      const topY = colRect.topY - (isActive ? glow * 6 : 0) + punchY;
      const colH = H - topY;

      ctx.save();

      // Column path
      ctx.beginPath();
      ctx.moveTo(colRect.x, H);
      ctx.lineTo(colRect.x, topY + 3);
      const segs = 4;
      for (let s = 1; s <= segs; s++) {
        const sx = colRect.x + (colRect.width * s) / segs;
        const sy = topY + Math.sin(i * 2.3 + s * 1.9) * 3;
        ctx.lineTo(sx, sy);
      }
      ctx.lineTo(colRect.x + colRect.width, H);
      ctx.closePath();

      // If column is inactive in this level, draw semi-translucent
      if (!isActive) {
        ctx.fillStyle = colDef.hex;
        ctx.globalAlpha = 0.28;
        ctx.fill();

        // Shaded diagonal stripes
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = 0.08;
        for (let y = topY; y < H; y += 14) {
          ctx.fillRect(colRect.x, y, colRect.width, 6);
        }
      } else {
        // Active column: full authentic marker color!
        ctx.fillStyle = colDef.hex;
        ctx.fill();

        // Marker strokes texture
        ctx.save();
        ctx.clip();
        const strokes = markerStrokes[i];
        for (let k = 0; k < strokes.length; k++) {
          const st = strokes[k];
          ctx.fillStyle = st.light ? '#ffffff' : '#000000';
          ctx.globalAlpha = st.alpha;
          ctx.fillRect(colRect.x + st.rx * colRect.width, topY + st.ry * colH, st.rw * colRect.width, st.rh * colH);
        }
        ctx.restore();

        // Subtle target measurement notches
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 1.6;
        for (let s = 0; s < curLevelConfig.targetPerTube; s++) {
          const tickY = getSlotCenterY(s);
          ctx.beginPath();
          ctx.moveTo(colRect.x + 1, tickY);
          ctx.lineTo(colRect.x + 5, tickY);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(colRect.x + colRect.width - 1, tickY);
          ctx.lineTo(colRect.x + colRect.width - 5, tickY);
          ctx.stroke();
        }
      }

      // Hover glow on active column
      if (isActive && glow > 0.05) {
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(0.28, glow * 0.22)})`;
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#282a24';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(colRect.centerX, topY - 14, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = colDef.hex;
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('▼', colRect.centerX, topY - 13);
      }

      // Column dividing vertical lines
      ctx.strokeStyle = 'rgba(40, 42, 36, 0.65)';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(colRect.x, topY);
      ctx.lineTo(colRect.x, H);
      ctx.stroke();

      // Top edge line
      ctx.strokeStyle = isFull ? '#ffd700' : (isActive ? colDef.darkHex : '#888');
      ctx.lineWidth = isFull ? 4 : 3;
      ctx.beginPath();
      ctx.moveTo(colRect.x, topY + 2);
      ctx.lineTo(colRect.x + colRect.width, topY + 2);
      ctx.stroke();

      // Column Header: Name & Progress Badge
      const count = state.columnCounts[i];
      ctx.save();

      if (isActive) {
        ctx.textAlign = 'center';

        // Progress Badge (the lane's color & shape already say which lane it is)
        const pillY = topY + 24;
        const pillW = Math.min(colRect.width * 0.9, 56);
        const pillH = 22;

        ctx.shadowColor = 'rgba(0,0,0,0.2)';
        ctx.shadowBlur = 3;
        ctx.beginPath();
        ctx.roundRect(colRect.centerX - pillW / 2, pillY - pillH / 2, pillW, pillH, 11);
        ctx.fillStyle = isFull ? '#fff8d6' : 'rgba(255, 255, 255, 0.96)';
        ctx.fill();
        ctx.strokeStyle = isFull ? '#b8860b' : '#282a24';
        ctx.lineWidth = 1.8;
        ctx.stroke();

        ctx.shadowColor = 'transparent';
        ctx.font = `bold ${isFull ? 12.5 : 13.5}px "PingFang SC", monospace`;
        ctx.fillStyle = isFull ? '#b8860b' : '#282a24';
        ctx.textBaseline = 'middle';
        ctx.fillText(isFull ? '⭐达成' : `${count}/${curLevelConfig.targetPerTube}`, colRect.centerX, pillY);
      } else {
        // Locked lane: just a lock
        ctx.font = `${Math.min(18, colRect.width * 0.55)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.globalAlpha = 0.7;
        ctx.fillText('🔒', colRect.centerX, topY + 24);
      }
      ctx.restore();

      // Candies inside the column
      const stack = state.columnStacks[i];
      for (let sIdx = 0; sIdx < stack.length; sIdx++) {
        const sc = stack[sIdx];
        const sy = getSlotCenterY(sIdx) + punchY;
        drawCandy(ctx, colRect.centerX, sy, sc.radius || state.layout.candyRadius, sc.colorIdx, sc.shape, sc.isRainbow, sc.rotation, sc.squish || 1);
      }

      // Ghost hint: shows which candy shape belongs here
      if (isActive && stack.length < curLevelConfig.targetPerTube) {
        ctx.save();
        ctx.globalAlpha = 0.2 + Math.sin(performance.now() * 0.004 + i) * 0.06;
        drawCandy(ctx, colRect.centerX, getSlotCenterY(stack.length) + punchY, state.layout.candyRadius * 0.9, i, 'round', false, 0, 1);
        ctx.restore();
      }

      // Frost overlay
      if (state.columnFrozen[i] > 0) {
        ctx.save();
        ctx.fillStyle = 'rgba(186, 230, 253, 0.65)';
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.roundRect(colRect.x + 3, topY + 2, colRect.width - 6, 48, 8);
        ctx.fill();
        ctx.stroke();
        ctx.font = 'bold 13px sans-serif';
        ctx.fillStyle = '#0369a1';
        ctx.textAlign = 'center';
        ctx.fillText('❄️点我破冰', colRect.centerX, topY + 28);
        ctx.restore();
      }

      // Mischievous Caterpillar Bug
      const bug = state.columnBugs[i];
      if (bug) {
        const bx = colRect.centerX + Math.sin(bug.phase) * 5;
        const by = topY - 4;
        ctx.save();
        ctx.translate(bx, by);
        const segColors = ['#a3e635', '#65a30d', '#84cc16'];
        for (let b = -1; b <= 1; b++) {
          ctx.beginPath();
          ctx.arc(b * 9, Math.abs(b) * 2, 8, 0, Math.PI * 2);
          ctx.fillStyle = segColors[b + 1];
          ctx.fill();
          ctx.strokeStyle = '#282a24';
          ctx.lineWidth = 1.8;
          ctx.stroke();
        }
        ctx.font = 'bold 12.5px sans-serif';
        ctx.fillStyle = '#b91c1c';
        ctx.textAlign = 'center';
        ctx.fillText('🐛点我!', 0, -14);
        ctx.restore();
      }

      // Piano Key Base Plate with Solfège & Pitch Indicator (Helmholtz 小字1组 1 2 3 4 5 6 7)
      const keyH = 28;
      const keyY = H - keyH + Math.min(punchY * 0.65, 6);
      ctx.save();
      // Key body (ivory white when idle, warm glow & colored stroke when pressed)
      ctx.fillStyle = punchY > 1 ? '#fff7ed' : (isActive ? '#ffffff' : 'rgba(235, 235, 235, 0.65)');
      ctx.beginPath();
      ctx.roundRect(colRect.x + 2, keyY, colRect.width - 4, keyH + 4, [6, 6, 0, 0]);
      ctx.fill();
      ctx.strokeStyle = punchY > 1 ? colDef.hex : (isActive ? '#282a24' : '#9ca3af');
      ctx.lineWidth = punchY > 1 ? 2.6 : 1.8;
      ctx.stroke();

      // Solfège pitch label (1 Do, 2 Re, 3 Mi, etc.)
      ctx.fillStyle = punchY > 1 ? colDef.darkHex : (isActive ? '#111827' : '#9ca3af');
      ctx.font = `bold ${colRect.width < 75 ? 12 : 13.5}px "PingFang SC", "Microsoft YaHei", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const narrowKey = colRect.width < 52;
      ctx.fillText(narrowKey ? `${i + 1}` : (colDef.solfege || `${i + 1}`), colRect.centerX, keyY + 11);

      // Pitch notation (C4, D4, E4...)
      ctx.fillStyle = punchY > 1 ? colDef.hex : (isActive ? colDef.hex : '#9ca3af');
      ctx.font = 'bold 9.5px monospace';
      if (!narrowKey) ctx.fillText(colDef.pitch || '', colRect.centerX, keyY + 21);
      ctx.restore();

      ctx.restore();
    }

    // Rightmost boundary line
    if (cols.length) {
      const lastCol = cols[cols.length - 1];
      ctx.strokeStyle = 'rgba(40, 42, 36, 0.65)';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(lastCol.x + lastCol.width, lastCol.topY);
      ctx.lineTo(lastCol.x + lastCol.width, H);
      ctx.stroke();
    }
  }

  // Draw Interactive Tutorial Helpers on Canvas for Level 1 (Highlights Target Column without Obstructing Candies)
  function drawTutorialOverlay(ctx) {
    if (state.currentLevel !== 1 || state.tutorialStep >= 4 || !state.activeCandy) return;

    const targetColIdx = state.activeCandy.colorIdx;
    const colObj = state.layout.columns[targetColIdx];
    if (!colObj) return;

    ctx.save();
    // Highlight target column with pulsing golden border on the column itself (clean view, no obstructing badges)
    const pulse = Math.sin(performance.now() * 0.008) * 3;
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3.5 + pulse;
    ctx.beginPath();
    ctx.roundRect(colObj.x - 2, colObj.topY - 4, colObj.width + 4, state.height - colObj.topY + 4, 8);
    ctx.stroke();
    ctx.restore();
  }

  // Full-screen Penalty Effect (Red Danger Vignette, Expanding Shockwaves & Central Warning Card)
  function drawFullScreenErrorEffect(ctx) {
    const W = state.width;
    const H = state.height;

    // 1. Shockwaves expanding across the entire screen
    for (let i = 0; i < state.errorShockwaves.length; i++) {
      const sw = state.errorShockwaves[i];
      ctx.save();
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(239, 68, 68, ${sw.alpha * 0.9})`;
      ctx.lineWidth = 8 * sw.alpha + 2;
      ctx.stroke();
      ctx.restore();
    }

    // 2. Full-screen Red Danger Vignette & Pulsing Border
    if (state.errorFlashTimer > 0) {
      const p = state.errorFlashTimer / 0.9;
      const alpha = Math.min(1, p * 1.3);

      ctx.save();
      const maxD = Math.hypot(W / 2, H / 2);
      const vig = ctx.createRadialGradient(W / 2, H / 2, maxD * 0.28, W / 2, H / 2, maxD);
      vig.addColorStop(0, 'rgba(239, 68, 68, 0)');
      vig.addColorStop(0.5, `rgba(239, 68, 68, ${alpha * 0.3})`);
      vig.addColorStop(1, `rgba(220, 38, 38, ${alpha * 0.82})`);
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      // Full-screen Pulsing Warning Border
      ctx.strokeStyle = `rgba(225, 29, 72, ${alpha * 0.95})`;
      ctx.lineWidth = 10 + Math.sin(p * 18) * 4;
      ctx.strokeRect(0, 0, W, H);
      ctx.restore();
    }

    // 3. Full-screen Central Warning Slogan Card
    if (state.errorHeartPrompt) {
      const eh = state.errorHeartPrompt;
      const p = eh.timer / eh.maxTimer;
      const alpha = Math.min(1, p * 2);
      const scale = p > 0.8 ? (1.25 - (p - 0.8) * 1.25) : 1;

      ctx.save();
      ctx.translate(W / 2, H * 0.44);
      ctx.scale(scale, scale);
      ctx.globalAlpha = alpha;

      const boxW = Math.min(W * 0.88, 380);
      const boxH = eh.subtitle ? 74 : 52;

      ctx.shadowColor = 'rgba(220, 38, 38, 0.45)';
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 4;

      ctx.fillStyle = '#fff1f2';
      ctx.beginPath();
      ctx.roundRect(-boxW / 2, -boxH / 2, boxW, boxH, 20);
      ctx.fill();

      ctx.shadowColor = 'transparent';
      ctx.strokeStyle = '#e11d48';
      ctx.lineWidth = 3.5;
      ctx.stroke();

      ctx.font = '900 21px "PingFang SC", "Microsoft YaHei", sans-serif';
      ctx.fillStyle = '#be123c';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(eh.title, 0, eh.subtitle ? -14 : 0);

      if (eh.subtitle) {
        ctx.font = 'bold 14px "PingFang SC", "Microsoft YaHei", sans-serif';
        ctx.fillStyle = '#e11d48';
        ctx.fillText(eh.subtitle, 0, 16);
      }

      ctx.restore();
    }
  }

  function render() {
    ctx.save();
    ctx.scale(state.dpr, state.dpr);

    if (state.screenShake > 0.2 && !state.reduceMotion) {
      const sx = (Math.random() - 0.5) * state.screenShake;
      const sy = (Math.random() - 0.5) * state.screenShake;
      ctx.translate(sx, sy);
    }

    // Drawing paper background
    ctx.fillStyle = state.feverTimer > 0 ? '#fff9fb' : '#fbf9f4';
    ctx.fillRect(0, 0, state.width, state.height);

    drawTopHeaderDecorations(ctx);
    drawRainbowColumns(ctx);
    drawRowSweeps(ctx);
    drawMultiplierGates(ctx);

    // Falling Candies with dynamic aerodynamic fall stretch
    for (let i = 0; i < state.fallingCandies.length; i++) {
      const fc = state.fallingCandies[i];
      const stretchSquish = Math.max(0.86, 1 - Math.min(Math.abs(fc.vy) * 0.00022, 0.14));
      drawCandy(ctx, fc.x, fc.y, fc.radius, fc.colorIdx, fc.shape, fc.isRainbow, fc.rotation, stretchSquish, fc.specialType);
    }

    for (const d of state.driftingCandies) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, d.life / 0.8));
      drawCandy(ctx, d.x, d.y, state.layout.candyRadius * 0.9, d.colorIdx, d.shape, d.isRainbow, d.rot, 1, d.specialType);
      ctx.restore();
    }

    drawCloudBar(ctx);
    drawLuckyCandies(ctx);
    drawTutorialOverlay(ctx);

    // Particles
    for (let i = 0; i < state.particles.length; i++) {
      const p = state.particles[i];
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.strokeStyle = '#282a24';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    // Victory Confetti
    for (let i = 0; i < state.confetti.length; i++) {
      const cf = state.confetti[i];
      ctx.save();
      ctx.translate(cf.x, cf.y);
      ctx.rotate(cf.rotation);
      ctx.fillStyle = cf.color;
      ctx.strokeStyle = 'rgba(0,0,0,0.3)';
      ctx.lineWidth = 1;
      ctx.fillRect(-cf.w / 2, -cf.h / 2, cf.w, cf.h);
      ctx.strokeRect(-cf.w / 2, -cf.h / 2, cf.w, cf.h);
      ctx.restore();
    }

    // Floating Scores and Texts (Big, Bold & Punchy)
    for (let i = 0; i < state.floatingTexts.length; i++) {
      const ft = state.floatingTexts[i];
      ctx.save();
      ctx.globalAlpha = ft.alpha;
      ctx.font = `900 ${Math.round(19 * ft.scale)}px "PingFang SC", "Microsoft YaHei", sans-serif`;
      ctx.textAlign = 'center';
      ctx.lineWidth = 5;
      ctx.strokeStyle = '#282a24';
      ctx.strokeText(ft.text, ft.x, ft.y);
      ctx.fillStyle = ft.color;
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    }

    drawBanner(ctx);

    // Gentle heart-loss flash (red edge glow only)
    if (state.heartLossFlash > 0) {
      ctx.save();
      ctx.globalAlpha = state.heartLossFlash / 0.5;
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.75)';
      ctx.lineWidth = 14;
      ctx.strokeRect(7, 7, state.width - 14, state.height - 14);
      ctx.restore();
    }

    // Full-screen Penalty Effect (Red Danger Vignette, Expanding Shockwaves & Central Warning Card)
    drawFullScreenErrorEffect(ctx);

    ctx.restore();
  }

  /* ---------------- Direct Touch, Click & Keyboard Controls ---------------- */

  function getCanvasX(clientX) {
    return clientX - canvas.getBoundingClientRect().left;
  }

  function getCanvasY(clientY) {
    return clientY - canvas.getBoundingClientRect().top;
  }

  function trySwatInteractiveTargets(px, py) {
    const lvlConfig = getLevelConfig();

    // 0. Tap the "next candy" bubble to swap candies
    const nb = getNextBubbleRect();
    const pad = nb.big ? 14 : 8;
    if (px >= nb.x - pad && px <= nb.x + nb.w + pad && py >= nb.y - pad && py <= nb.y + nb.h + pad) {
      if (swapCandies()) return true;
    }

    // 1. Check click on Top 6 Hand-drawn Magic Icons
    for (let i = 0; i < state.topIconPos.length; i++) {
      const pos = state.topIconPos[i];
      if (Math.hypot(px - pos.x, py - pos.y) <= pos.r + 10) {
        // Icons are only "buttons" when fully charged; otherwise a tap just gives a tiny wiggle
        if (lvlConfig.features.topMagic && state.topIconCharge[i] >= 100) {
          activateTopIcon(i);
        } else {
          state.topIconBounce[i] = 5;
        }
        return true;
      }
    }

    // 2. Swatting a falling Bomb in mid-air
    for (let i = state.fallingCandies.length - 1; i >= 0; i--) {
      const fc = state.fallingCandies[i];
      if (fc.specialType === 'bomb' && Math.hypot(px - fc.x, py - fc.y) <= fc.radius * 2.1) {
        sfx.playSwat();
        unlockSticker('bomb_hero');
        state.score += 15;
        state.screenShake = 6;
        spawnBurstParticles(fc.x, fc.y, '#fde047', 24, true);
        addFloatingText(fc.x, fc.y - 12, '💥 拆弹 +15', '#1d8f24', 1.3);
        state.fallingCandies.splice(i, 1);
        updateHUD();
        return true;
      }
    }

    // 3. A bomb hanging under the cloud: tap to throw it away (no reward, just safe)
    if (state.activeCandy && state.activeCandy.specialType === 'bomb') {
      const candyX = state.cloud.x;
      const candyY = state.cloud.y + state.cloud.height * 0.5 + state.layout.candyRadius + 6;
      if (Math.hypot(px - candyX, py - candyY) <= state.layout.candyRadius * 2.2) {
        discardHeldBomb();
        return true;
      }
    }

    // 4. Clicking on a Caterpillar Bug or Frozen Column Rim
    const cols = state.layout.columns;
    for (let i = 0; i < cols.length; i++) {
      const col = cols[i];
      const onBug = state.columnBugs[i] && Math.hypot(px - col.centerX, py - (col.topY - 6)) <= 30;
      const onIce = state.columnFrozen[i] > 0 && px >= col.x && px <= col.x + col.width && py >= col.topY - 6 && py <= col.topY + 54;
      if (onBug || onIce) {
        if (onBug) {
          state.columnBugs[i] = null;
          state.score += 12;
          sfx.playSwat();
          unlockSticker('bomb_hero');
          spawnBurstParticles(col.centerX, col.topY, '#84cc16', 20, true);
          addFloatingText(col.centerX, col.topY - 18, '🐛 +12 送1颗', '#1d8f24', 1.2);
          addCandyToColumn(i, 'heart', false);
          updateHUD();
          return true;
        }
        if (state.columnFrozen[i] > 0) {
          state.columnFrozen[i] = 0;
          state.score += 10;
          sfx.playSwat();
          spawnBurstParticles(col.centerX, col.topY, '#38bdf8', 18, false);
          addFloatingText(col.centerX, col.topY - 18, '❄️ +10', '#0284c7', 1.2);
          updateHUD();
          return true;
        }
      }
    }

    return false;
  }

  function isPointOnCloud(px, py) {
    const c = state.cloud;
    const top = c.y - c.height / 2 - 6;
    const bottom = c.y + c.height / 2 + state.layout.candyRadius * 2 + 12;
    return Math.abs(px - c.x) <= c.width / 2 + 4 && py >= top && py <= bottom;
  }

  canvas.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    sfx.init();
    hideLevelIntroToast();

    const px = getCanvasX(e.clientX);
    const py = getCanvasY(e.clientY);

    if (trySwatInteractiveTargets(px, py)) {
      return;
    }

    state.isDragging = true;
    state.TapStartTime = performance.now();
    state.TapStartX = px;
    state.TapStartY = py;
    state.tapStartOnCloud = isPointOnCloud(px, py);
    state.tapStartCloudCol = getColumnIndexAtX(state.cloud.x);

    if (Math.abs(px - state.cloud.x) < state.cloud.width * 0.6 && py < state.layout.columnsTopY + 40) {
      state.dragOffsetX = state.cloud.x - px;
    } else {
      state.dragOffsetX = 0;
      state.cloud.targetX = px;
      clampCloudX();
    }
  });

  window.addEventListener('pointermove', (e) => {
    if (!state.isDragging) return;
    const px = getCanvasX(e.clientX);
    state.cloud.targetX = px + state.dragOffsetX;
    clampCloudX();
  });

  // iPadOS system gestures (dock swipe, multitasking) cancel the pointer: just stop dragging
  window.addEventListener('pointercancel', () => {
    state.isDragging = false;
  });

  window.addEventListener('pointerup', (e) => {
    if (!state.isDragging) return;
    state.isDragging = false;
    const px = getCanvasX(e.clientX);
    const py = getCanvasY(e.clientY);
    const elapsed = performance.now() - (state.TapStartTime || 0);
    const moved = Math.hypot(px - (state.TapStartX || px), py - (state.TapStartY || py));

    // Quick tap:
    //  - on the cloud (or its candy)          -> drop
    //  - on the lane the cloud was already over -> drop
    //  - on any other lane                     -> only move there (never drops by accident)
    if (elapsed < 320 && moved < 18) {
      const tappedCol = getColumnIndexAtX(px);
      const col = state.layout.columns[tappedCol];
      if (state.tapStartOnCloud) {
        dropActiveCandy();
      } else if (tappedCol === state.tapStartCloudCol && col) {
        state.cloud.targetX = col.centerX;
        clampCloudX();
        dropActiveCandy();
      } else if (col) {
        state.cloud.targetX = col.centerX;
        clampCloudX();
      }
    }
  });

  // Keyboard controls for desktop
  window.addEventListener('keydown', (e) => {
    sfx.init();
    if (!isAnyModalOpen()) hideLevelIntroToast();

    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      e.preventDefault();
      state.keys.left = true;
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      e.preventDefault();
      state.keys.right = true;
    } else if (e.key === ' ' || e.key === 'ArrowDown' || e.key === 'Enter' || e.key === 's' || e.key === 'S') {
      e.preventDefault();
      if (isGamePaused()) return;
      if (state.activeCandy && state.activeCandy.specialType === 'bomb') {
        discardHeldBomb();
      } else {
        dropActiveCandy();
      }
    } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === 'x' || e.key === 'X' || e.key === 'Shift') {
      e.preventDefault();
      if (!isGamePaused()) swapCandies();
    } else if (e.key === 'q' || e.key === 'Q') {
      if (!isGamePaused() && !activateTopIcon(0)) activateTopIcon(3);
    } else if (e.key === 'e' || e.key === 'E') {
      if (!isGamePaused() && !activateTopIcon(1)) activateTopIcon(4);
    } else if (e.key === 'r' || e.key === 'R') {
      if (!isGamePaused() && !activateTopIcon(2)) activateTopIcon(5);
    } else if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
      e.preventDefault();
      togglePauseMenu();
    } else if (e.key >= '1' && e.key <= '7') {
      const idx = parseInt(e.key, 10) - 1;
      if (state.layout.columns[idx]) {
        state.cloud.targetX = state.layout.columns[idx].centerX;
        clampCloudX();
      }
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      state.keys.left = false;
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      state.keys.right = false;
    }
  });

  // UI Modals & Buttons
  const levelSelectModal = document.getElementById('level-select-modal');
  const levelClearModal = document.getElementById('level-clear-modal');
  const levelFailModal = document.getElementById('level-fail-modal');
  const victoryModal = document.getElementById('victory-modal');
  const tutorialModal = document.getElementById('tutorial-modal');
  const stickerModal = document.getElementById('sticker-modal');
  const artModal = document.getElementById('art-modal');

  // Open Level Select
  const openLevelMap = () => {
    renderLevelSelectModal();
    levelSelectModal.classList.add('open');
  };
  document.getElementById('btn-level-map').addEventListener('click', openLevelMap);
  document.getElementById('hud-level-pill').addEventListener('click', openLevelMap);
  document.getElementById('close-level-select').addEventListener('click', () => levelSelectModal.classList.remove('open'));
  document.getElementById('btn-continue-level').addEventListener('click', () => levelSelectModal.classList.remove('open'));

  // Hearts Pill info click
  const hudHeartsPill = document.getElementById('hud-hearts-pill');
  if (hudHeartsPill) {
    hudHeartsPill.addEventListener('click', () => {
      addFloatingText(state.width / 2, state.cloud.y - 18, `❤️ ${state.hearts}/${state.maxHearts} · 5连击回1心`, '#ff2e63', 1.15);
    });
  }

  // Reset levels
  document.getElementById('btn-reset-levels').addEventListener('click', () => {
    levelSelectModal.classList.remove('open');
    askConfirm('清空所有进度？', '所有关卡的星星和解锁都会清空，从第 1 关重新开始。这一步不能撤销。', () => {
      state.unlockedLevel = 1;
      state.levelStars = {};
      state.levelHighScores = {};
      saveProgress();
      startLevel(1);
    });
  });

  // Level Clear buttons
  document.getElementById('btn-next-level').addEventListener('click', () => {
    levelClearModal.classList.remove('open');
    if (state.currentLevel < LEVELS.length) {
      startLevel(state.currentLevel + 1);
    } else {
      startLevel(1);
    }
  });
  document.getElementById('btn-replay-level').addEventListener('click', () => {
    levelClearModal.classList.remove('open');
    startLevel(state.currentLevel);
  });
  document.getElementById('btn-open-map').addEventListener('click', () => {
    levelClearModal.classList.remove('open');
    openLevelMap();
  });

  // Level Fail buttons
  const btnRetryLevel = document.getElementById('btn-retry-level');
  if (btnRetryLevel) {
    btnRetryLevel.addEventListener('click', () => {
      levelFailModal.classList.remove('open');
      startLevel(state.currentLevel, true, state.isEndlessMode);
    });
  }
  const btnCheckpoint = document.getElementById('btn-checkpoint-level');
  if (btnCheckpoint) {
    btnCheckpoint.addEventListener('click', () => {
      levelFailModal.classList.remove('open');
      resumeFromCheckpoint();
    });
  }
  const btnFailOpenMap = document.getElementById('btn-fail-open-map');
  if (btnFailOpenMap) {
    btnFailOpenMap.addEventListener('click', () => {
      levelFailModal.classList.remove('open');
      openLevelMap();
    });
  }

  // Quick reset in HUD
  document.getElementById('btn-quick-reset').addEventListener('click', () => {
    document.getElementById('pause-modal').classList.remove('open');
    askConfirm('重新开始这一关？', '这一关现在的进度会清零。', () => {
      startLevel(state.currentLevel, false, state.isEndlessMode);
      addFloatingText(state.width / 2, state.cloud.y - 20, '🔄 重新开始', '#4f5d75', 1.1);
    });
  });

  // Tutorial / Guidance Modal
  document.getElementById('btn-tutorial-hint').addEventListener('click', () => {
    tutorialModal.classList.add('open');
  });
  document.getElementById('close-tutorial-modal').addEventListener('click', () => {
    tutorialModal.classList.remove('open');
  });
  document.getElementById('btn-start-tutorial-play').addEventListener('click', () => {
    tutorialModal.classList.remove('open');
  });

  // Level Intro Toast (Click-to-dismiss early if tapped)
  const introToastEl = document.getElementById('level-intro-toast');
  if (introToastEl) {
    introToastEl.addEventListener('click', () => {
      hideLevelIntroToast();
    });
  }
  const closeIntroBtn = document.getElementById('close-intro-toast');
  if (closeIntroBtn) {
    closeIntroBtn.addEventListener('click', () => {
      hideLevelIntroToast();
    });
  }

  // Victory modal buttons
  document.getElementById('btn-win-replay').addEventListener('click', () => {
    victoryModal.classList.remove('open');
    startLevel(LEVELS.length, true, true);
  });
  document.getElementById('btn-win-map').addEventListener('click', () => {
    victoryModal.classList.remove('open');
    openLevelMap();
  });
  document.getElementById('btn-win-art').addEventListener('click', () => {
    victoryModal.classList.remove('open');
    artModal.classList.add('open');
  });
  document.getElementById('btn-win-stickers').addEventListener('click', () => {
    victoryModal.classList.remove('open');
    renderStickerModal();
    stickerModal.classList.add('open');
  });

  // Artwork Modal
  document.getElementById('btn-art').addEventListener('click', () => artModal.classList.add('open'));
  document.getElementById('close-art-modal').addEventListener('click', () => artModal.classList.remove('open'));

  // Stickers Modal
  document.getElementById('btn-stickers').addEventListener('click', () => {
    renderStickerModal();
    stickerModal.classList.add('open');
  });
  document.getElementById('close-sticker-modal').addEventListener('click', () => {
    stickerModal.classList.remove('open');
  });

  // Fever Pill click
  document.getElementById('fever-pill').addEventListener('click', () => {
    if (state.feverGauge >= 100 && state.feverTimer <= 0) {
      triggerFeverMode();
    } else {
      addFloatingText(state.width / 2, state.layout.cloudY - 15, '🌈 投对糖攒满100%', '#7c3aed', 1.0);
    }
  });

  // Pause menu wiring
  document.getElementById('btn-pause').addEventListener('click', () => openPauseMenu());
  document.getElementById('btn-resume').addEventListener('click', () => {
    document.getElementById('pause-modal').classList.remove('open');
  });
  // Any menu entry closes the pause card first (the opened dialog keeps the game paused)
  ['btn-level-map', 'btn-tutorial-hint', 'btn-stickers', 'btn-art'].forEach(id => {
    document.getElementById(id).addEventListener('click', () => {
      document.getElementById('pause-modal').classList.remove('open');
    }, true);
  });

  document.getElementById('confirm-ok').addEventListener('click', () => {
    document.getElementById('confirm-modal').classList.remove('open');
    const fn = confirmHandler;
    confirmHandler = null;
    if (fn) fn();
  });
  document.getElementById('confirm-cancel').addEventListener('click', () => {
    document.getElementById('confirm-modal').classList.remove('open');
    confirmHandler = null;
  });

  // Auto-pause when switching apps / tabs
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && !state.isLevelCleared && !state.isLevelFailed) openPauseMenu();
  });

  // One sound button: sound effects only -> music + effects -> mute
  const AUDIO_MODES = {
    sfx:  { label: '🔊 只开音效', next: 'all',  enabled: true,  bgm: false },
    all:  { label: '🎵 音乐+音效', next: 'mute', enabled: true,  bgm: true },
    mute: { label: '🔇 静音',     next: 'sfx',  enabled: false, bgm: false }
  };
  const btnAudio = document.getElementById('btn-audio');
  function applyAudioMode(mode) {
    const m = AUDIO_MODES[mode] || AUDIO_MODES.sfx;
    state.audioMode = AUDIO_MODES[mode] ? mode : 'sfx';
    sfx.enabled = m.enabled;
    sfx.bgmEnabled = m.bgm;
    btnAudio.textContent = m.label;
    try { localStorage.setItem('rainbow_candy_audio_mode', state.audioMode); } catch (_) {}
  }
  btnAudio.addEventListener('click', () => {
    sfx.init();
    applyAudioMode(AUDIO_MODES[state.audioMode].next);
    if (sfx.enabled) sfx.playRealPianoNote('C5', 0.8, 0);
  });

  // Reduce motion: follows the system setting by default, can be switched in the pause menu
  const btnMotion = document.getElementById('btn-motion');
  function applyReduceMotion(on) {
    state.reduceMotion = !!on;
    document.body.classList.toggle('reduce-motion', state.reduceMotion);
    btnMotion.textContent = state.reduceMotion ? '🌀 晃动特效：关' : '🌀 晃动特效：开';
  }
  btnMotion.addEventListener('click', () => {
    applyReduceMotion(!state.reduceMotion);
    try { localStorage.setItem('rainbow_candy_reduce_motion', state.reduceMotion ? '1' : '0'); } catch (_) {}
  });

  (() => {
    let savedAudio = null;
    let savedMotion = null;
    try {
      savedAudio = localStorage.getItem('rainbow_candy_audio_mode');
      savedMotion = localStorage.getItem('rainbow_candy_reduce_motion');
    } catch (_) {}
    applyAudioMode(savedAudio || 'sfx');
    const systemReduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    applyReduceMotion(savedMotion === null ? systemReduce : savedMotion === '1');
  })();

  // Initialization
  loadSavedProgress();
  window.addEventListener('resize', computeLayout);
  computeLayout();

  startLevel(state.currentLevel, true);

  let lastTime = performance.now();
  function loop(now) {
    const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
    lastTime = now;
    if (!isGamePaused()) update(dt);
    render();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
