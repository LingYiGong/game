(() => {
  'use strict';

  // 7 Rainbow Colors matching daughter's original hand drawing (2026-11-01)
  const COLOR_COLUMNS = [
    { id: 'red',     name: '草莓红',   hex: '#cf2027', lightHex: '#ff6b72', darkHex: '#9e1318', noteFreq: 261.63, unlockLvl: 1 },
    { id: 'pink',    name: '蜜桃粉',   hex: '#f39bc3', lightHex: '#ffd0e6', darkHex: '#d46b9b', noteFreq: 293.66, unlockLvl: 3 },
    { id: 'green',   name: '苹果绿',   hex: '#1d8f24', lightHex: '#5cd664', darkHex: '#116316', noteFreq: 329.63, unlockLvl: 2 },
    { id: 'purple',  name: '葡萄紫',   hex: '#5d4b86', lightHex: '#9b86cc', darkHex: '#3f3161', noteFreq: 349.23, unlockLvl: 4 },
    { id: 'blue',    name: '蓝莓蓝',   hex: '#4650b0', lightHex: '#828cf2', darkHex: '#2b3380', noteFreq: 392.00, unlockLvl: 3 },
    { id: 'orange',  name: '甜橙橘',   hex: '#e36517', lightHex: '#ffa063', darkHex: '#ab4507', noteFreq: 440.00, unlockLvl: 5 },
    { id: 'skyblue', name: '苏打天蓝', hex: '#298cd4', lightHex: '#73c6ff', darkHex: '#186299', noteFreq: 493.88, unlockLvl: 1 }
  ];

  const TOTAL_TUBES = COLOR_COLUMNS.length; // 7
  const CANDY_SHAPES = ['wrapped', 'heart', 'berry', 'star', 'round'];

  // 8 Progressive Stages (Difficulty & Mechanics gradually introduced)
  const LEVELS = [
    {
      id: 1,
      title: '初识彩虹',
      subtitle: '基础操作与色彩对应教学',
      tip: '滑动云朵对齐同色跑道，轻点屏幕或按空格放下糖果！',
      tags: ['新手教学', '双色体验', '无倒计时压力'],
      activeCols: [0, 6], // Strawberry Red (0) and Soda Sky Blue (6)
      targetPerTube: 3,   // 3 candies per column (total 6)
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
      candyTimer: 999999, // Relaxed/infinite drop timer for beginners
      starConditions: { star3Combo: 1, star3Time: 40, star2Time: 75 }
    },
    {
      id: 2,
      title: '连击练习',
      subtitle: '红绿蓝三色与连击节奏',
      tip: '连续投准同色跑道可累积连击（Combo 🔥），连击越高得分成倍翻倍！',
      tags: ['连击进阶', '三色跑道', '节奏掌握'],
      activeCols: [0, 2, 6], // Red, Green, Sky Blue
      targetPerTube: 4,      // 4 candies per column (total 12)
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
      candyTimer: 5.2,
      starConditions: { star3Combo: 3, star3Time: 55, star2Time: 95 }
    },
    {
      id: 3,
      title: '五彩斑斓',
      subtitle: '五色跑道与百搭彩虹糖',
      tip: '遇到闪闪发光的【彩虹百搭星糖 🌟】，投进任意一根跑道都算正确匹配！',
      tags: ['五色彩虹', '百搭彩虹糖', '眼手协调'],
      activeCols: [0, 1, 2, 4, 6], // Red, Pink, Green, Blue, Sky Blue
      targetPerTube: 4,            // 4 candies per column (total 20)
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
      candyTimer: 4.5,
      starConditions: { star3Combo: 4, star3Time: 70, star2Time: 110 }
    },
    {
      id: 4,
      title: '空中奇迹',
      subtitle: '倍增泡泡分裂与三连爆射',
      tip: '算好提前量！让糖果穿过漂浮的【×2 / ×3 泡泡门 🫧】，糖果会瞬间分裂翻倍！',
      tags: ['倍增泡泡门', '三连糖', '分裂狂欢'],
      activeCols: [0, 1, 2, 3, 4, 6], // 6 columns
      targetPerTube: 5,               // 5 candies per column (total 30)
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
      candyTimer: 3.8,
      starConditions: { star3Combo: 6, star3Time: 85, star2Time: 130 }
    },
    {
      id: 5,
      title: '画纸苏醒',
      subtitle: '释放顶部 6 大手绘魔法技能',
      tip: '投进糖果给顶部手绘图标充能，满 100% 后直接点击图标释放全屏魔法大招！',
      tags: ['全部7色彩虹', '手绘大招', '盲盒惊喜'],
      activeCols: [0, 1, 2, 3, 4, 5, 6], // All 7 columns
      targetPerTube: 5,                  // 5 candies per column (total 35)
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
      candyTimer: 3.5,
      starConditions: { star3Combo: 7, star3Time: 95, star2Time: 145 }
    },
    {
      id: 6,
      title: '调皮捣蛋鬼',
      subtitle: '除虫破冰与跑道保卫战',
      tip: '跑道被【冰霜 ❄️】封住或出现【贪吃虫 🐛】？直接点击跑道除虫破冰拿大奖！',
      tags: ['除虫破冰', '快速互动', '七彩甘霖'],
      activeCols: [0, 1, 2, 3, 4, 5, 6],
      targetPerTube: 6,                  // 6 candies per column (total 42)
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
      title: '拆弹大师',
      subtitle: '空中拦截炸弹与微风挑战',
      tip: '注意黑色【坏坏炸弹 💣】！千万别让它落进柱子，在空中直接点击它拆弹！',
      tags: ['空中拆弹', '调皮微风', '暴走积蓄'],
      activeCols: [0, 1, 2, 3, 4, 5, 6],
      targetPerTube: 7,                  // 7 candies per column (total 49)
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
      candyTimer: 3.0,
      starConditions: { star3Combo: 9, star3Time: 125, star2Time: 185 }
    },
    {
      id: 8,
      title: '彩虹大圆满',
      subtitle: '终极盛宴！7 柱各 10 颗集满 70 颗糖果',
      tip: '全要素全机制盛大狂欢！连击攒满 100% 触发彩虹暴走喷泉，赢取大魔法师金杯！',
      tags: ['终极考验', '彩虹暴走喷泉', '70颗大圆满'],
      activeCols: [0, 1, 2, 3, 4, 5, 6],
      targetPerTube: 10,                 // 10 candies per column (total 70)
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
    { id: 'grand_champion', icon: '👑', title: '彩虹大满贯', desc: '通关全部 8 个关卡完成彩虹大圆满！' }
  ];

  // Web Audio Synthesizer + Music Box BGM
  class SoundFX {
    constructor() {
      this.enabled = true;
      this.bgmEnabled = false;
      this.ctx = null;
      this.bgmNoteIdx = 0;
      this.bgmTimer = 0;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playTone(freq, duration = 0.22, type = 'triangle', volume = 0.18, delay = 0) {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime + delay;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.02);
    }

    updateBGM(dt, isFever) {
      if (!this.bgmEnabled || !this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const tempo = isFever ? 0.16 : 0.26;
      this.bgmTimer -= dt;
      if (this.bgmTimer <= 0) {
        this.bgmTimer = tempo;
        const melody = [
          523.25, 659.25, 783.99, 659.25, 880.00, 783.99, 659.25, 587.33,
          523.25, 587.33, 659.25, 783.99, 1046.5, 880.00, 783.99, 659.25
        ];
        const f = melody[this.bgmNoteIdx % melody.length] * (isFever ? 1.122 : 1);
        this.bgmNoteIdx++;
        this.playTone(f, tempo * 0.9, 'sine', 0.045, 0);
      }
    }

    playDrop() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.14);
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.16);
    }

    playMatch(colIndex, combo) {
      const baseFreq = COLOR_COLUMNS[colIndex]?.noteFreq || 330;
      const pitchBoost = Math.min(combo * 0.03, 0.35);
      const f = baseFreq * (1 + pitchBoost);
      this.playTone(f, 0.25, 'triangle', 0.22, 0);
      this.playTone(f * 1.25, 0.25, 'sine', 0.16, 0.06);
      this.playTone(f * 1.5, 0.32, 'triangle', 0.18, 0.12);
      if (combo >= 3) {
        this.playTone(f * 2, 0.35, 'sine', 0.15, 0.18);
      }
    }

    playGateMultiply() {
      this.playTone(587.33, 0.14, 'sine', 0.2, 0);
      this.playTone(880.00, 0.22, 'triangle', 0.22, 0.06);
      this.playTone(1174.66, 0.26, 'sine', 0.18, 0.12);
    }

    playMagicSkill() {
      const chord = [523.25, 659.25, 783.99, 1046.5, 1318.5];
      chord.forEach((n, i) => this.playTone(n, 0.35, 'sine', 0.2, i * 0.055));
    }

    playSwat() {
      this.playTone(300, 0.1, 'sawtooth', 0.18, 0);
      this.playTone(740, 0.2, 'triangle', 0.22, 0.05);
      this.playTone(987, 0.25, 'sine', 0.18, 0.11);
    }

    playFeverStart() {
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98];
      notes.forEach((n, i) => this.playTone(n, 0.28, 'triangle', 0.24, i * 0.06));
    }

    playMismatch() {
      this.playTone(210, 0.18, 'sawtooth', 0.09, 0);
      this.playTone(165, 0.25, 'triangle', 0.11, 0.12);
    }

    playTubeComplete() {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((n, idx) => {
        this.playTone(n, 0.3, 'triangle', 0.24, idx * 0.08);
      });
    }

    playLevelClear() {
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
      notes.forEach((n, idx) => {
        this.playTone(n, 0.28, 'triangle', 0.25, idx * 0.08);
        this.playTone(n * 1.5, 0.24, 'sine', 0.15, idx * 0.08 + 0.02);
      });
    }

    playStarChime(starIdx) {
      const freqs = [659.25, 783.99, 1046.5];
      const f = freqs[starIdx % freqs.length] || 1046.5;
      this.playTone(f, 0.3, 'sine', 0.24, 0);
      this.playTone(f * 2, 0.35, 'triangle', 0.18, 0.04);
    }

    playVictory() {
      const fanfare = [
        { f: 523.25, d: 0.18, t: 0 },
        { f: 659.25, d: 0.18, t: 0.12 },
        { f: 783.99, d: 0.24, t: 0.24 },
        { f: 1046.5, d: 0.55, t: 0.40 },
        { f: 880.00, d: 0.20, t: 0.75 },
        { f: 987.77, d: 0.20, t: 0.90 },
        { f: 1046.5, d: 0.70, t: 1.05 }
      ];
      fanfare.forEach(item => {
        this.playTone(item.f, item.d, 'triangle', 0.28, item.t);
        this.playTone(item.f * 1.5, item.d * 0.8, 'sine', 0.16, item.t + 0.02);
      });
    }
  }

  const sfx = new SoundFX();
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
    levelCollected: 0,
    totalCollectedAllLevels: 0,
    levelStartTime: Date.now(),
    isLevelCleared: false,
    isGrandFinale: false,
    screenShake: 0,
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
      bounceY: 0
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

  function getLevelConfig(lvl = state.currentLevel) {
    return LEVELS[Math.max(0, Math.min(LEVELS.length - 1, lvl - 1))] || LEVELS[0];
  }

  function getLevelTotalTarget(lvlConfig = getLevelConfig()) {
    return lvlConfig.activeCols.length * lvlConfig.targetPerTube;
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

    // 7 columns: contiguous, equal width for visual harmony and fairness
    const numCols = COLOR_COLUMNS.length; // 7
    const sideMargin = Math.max(4, W * 0.012);
    const usableW = W - sideMargin * 2;
    const colW = usableW / numCols;

    let curX = sideMargin;
    state.layout.columns = COLOR_COLUMNS.map((col, idx) => {
      const topWave = Math.sin(idx * 1.7) * 3;
      const colRect = {
        index: idx,
        x: curX,
        width: colW,
        centerX: curX + colW / 2,
        topY: state.layout.columnsTopY + topWave
      };
      curX += colW;
      return colRect;
    });

    // Candy vertical stacking area:
    state.layout.storageTopY = state.layout.columnsTopY + 54;
    state.layout.storageBottomY = H - 18;
    const storageH = state.layout.storageBottomY - state.layout.storageTopY;

    // Support up to 10 slots stacked vertically
    state.layout.slotHeight = (storageH - 6) / 10;
    state.layout.candyRadius = Math.max(15, Math.min(colW * 0.38, state.layout.slotHeight * 0.44, 26));

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
        levelHighScores: state.levelHighScores
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
      addFloatingText(state.width / 2, state.cloud.y - 28, `🏅 解锁新贴纸：【${def.icon} ${def.title}】!`, '#d97706', 1.25);
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

      const tagHtml = lvl.tags.map(t => `<span class="level-tag">${t}</span>`).join('');
      const cardClass = isUnlocked ? (stars > 0 ? 'completed' : 'unlocked') : 'locked';
      const curClass = isCurrent ? 'current' : '';

      return `
        <div class="level-card ${cardClass} ${curClass}" data-level="${lvl.id}">
          <div class="level-card-top">
            <span class="level-badge-num">第 ${lvl.id} 关</span>
            <span class="level-stars-display">${isUnlocked ? starStr : '🔒'}</span>
          </div>
          <div class="level-card-title">${lvl.title}</div>
          <div class="level-card-desc">${lvl.subtitle}</div>
          <div class="level-card-tags">${tagHtml}</div>
        </div>
      `;
    }).join('');

    // Attach click handlers
    container.querySelectorAll('.level-card').forEach(card => {
      card.addEventListener('click', () => {
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
    if (needed.length > 0) {
      return needed[Math.floor(Math.random() * needed.length)];
    }
    // If all full (rare before trigger), pick random active column
    return activeCols[Math.floor(Math.random() * activeCols.length)] || 0;
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
      rotation: (Math.random() - 0.5) * 0.3,
      vRot: (Math.random() - 0.5) * 2.5
    });
  }

  function dropActiveCandy() {
    if (!state.activeCandy || state.isLevelCleared || state.fallingCandies.length >= 16) return;
    const c = state.activeCandy;
    const dropX = state.cloud.x;
    const dropY = state.cloud.y + state.cloud.height * 0.48;

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
          homing: state.magnetTimer > 0
        });
      }
      addFloatingText(dropX, dropY + 10, '⚡ 三连爆射糖!', COLOR_COLUMNS[c.colorIdx].hex, 1.15);
    } else {
      spawnFallingCandyObj({
        x: dropX,
        y: dropY,
        vx: state.cloud.vx * 0.08,
        vy: 145,
        colorIdx: c.colorIdx,
        shape: c.shape,
        specialType: c.specialType,
        isRainbow: c.isRainbow,
        homing: state.magnetTimer > 0 && c.specialType !== 'bomb'
      });
    }

    state.cloud.bounceY = -6;
    sfx.playDrop();
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
    addFloatingText(state.width / 2, state.layout.cloudY + 45, '🌈 彩虹暴走开启！全自动糖果狂欢！', '#ec4899', 1.4);
  }

  function activateTopIcon(iconIdx) {
    const lvlConfig = getLevelConfig();
    if (!lvlConfig.features.topMagic) {
      addFloatingText(state.topIconPos[iconIdx]?.x || state.width / 2, state.layout.topIconsY + 24, '🌟 第 5 关解锁画作魔法大招哦！', '#4f5d75', 1.05);
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
      addFloatingText(pos.x, pos.y + 24, '🌠 绿星魔法：流星糖果雨！', '#1d8f24', 1.3);
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
      addFloatingText(pos.x, pos.y + 24, '🧲 爱心魔法：7秒彩虹磁力制导！', '#e36517', 1.3);
    } else {
      // Berry Heart: Purify all hazards + instant +1 candy in 2 most-needed columns!
      state.columnFrozen = [0, 0, 0, 0, 0, 0, 0];
      state.columnBugs = [null, null, null, null, null, null, null];
      state.fallingCandies = state.fallingCandies.filter(fc => fc.specialType !== 'bomb');
      if (state.activeCandy && state.activeCandy.specialType === 'bomb') {
        state.activeCandy.specialType = 'rainbow';
        state.activeCandy.isRainbow = true;
      }
      addFloatingText(pos.x, pos.y + 24, '🍇 紫莓甘霖：净化全场 + 糖果补给！', '#7e3f8f', 1.3);

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
      const slotY = getSlotCenterY(state.columnCounts[colIdx] - 1);
      spawnBurstParticles(col.centerX, slotY, COLOR_COLUMNS[colIdx].lightHex, 14, isRainbow);

      // Check column fill
      if (state.columnCounts[colIdx] === target) {
        sfx.playTubeComplete();
        unlockSticker('first_tube');
        spawnBurstParticles(col.centerX, col.topY + 30, '#ffd700', 26, true);
        addFloatingText(col.centerX, col.topY - 14, `🎉 ${COLOR_COLUMNS[colIdx].name}收集达成!`, '#1d8f24', 1.35);

        // Check if level clear condition reached
        checkLevelClearCondition();
      }
    } else {
      state.score += 5;
    }
  }

  function checkLevelClearCondition() {
    if (state.isLevelCleared) return;
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

  function updateHUD() {
    const lvlConfig = getLevelConfig();
    const totalTarget = getLevelTotalTarget(lvlConfig);

    document.getElementById('level-val').textContent = `${state.currentLevel}/${LEVELS.length}`;
    document.getElementById('target-progress-val').textContent = `${state.levelCollected}/${totalTarget}`;
    document.getElementById('combo-val').textContent = state.combo;
    document.getElementById('score-val').textContent = state.score;

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

  function showLevelIntroToast(lvl = state.currentLevel) {
    const lvlConfig = getLevelConfig(lvl);
    const toast = document.getElementById('level-intro-toast');
    const tagEl = document.getElementById('toast-level-num');
    const titleEl = document.getElementById('toast-level-title');
    const tipEl = document.getElementById('toast-level-tip');

    if (toast && tagEl && titleEl && tipEl) {
      tagEl.textContent = `第 ${lvlConfig.id} 关`;
      titleEl.textContent = `${lvlConfig.title} · ${lvlConfig.subtitle}`;
      tipEl.textContent = lvlConfig.tip;
      toast.classList.add('show');
    }
  }

  function hideLevelIntroToast() {
    const toast = document.getElementById('level-intro-toast');
    if (toast) toast.classList.remove('show');
  }

  function triggerLevelClear() {
    if (state.isLevelCleared) return;
    state.isLevelCleared = true;
    sfx.playLevelClear();

    const elapsed = (Date.now() - state.levelStartTime) / 1000;
    const lvlConfig = getLevelConfig();
    const cond = lvlConfig.starConditions;

    // Calculate Stars
    let starsCount = 1;
    if (elapsed <= cond.star3Time && state.maxCombo >= cond.star3Combo) {
      starsCount = 3;
    } else if (elapsed <= cond.star2Time || state.maxCombo >= Math.max(1, cond.star3Combo - 1)) {
      starsCount = 2;
    }

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
    document.getElementById('level-clear-desc').textContent = `恭喜完成【${lvlConfig.title}】全部目标！`;
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

  function triggerGrandFinale() {
    if (state.isLevelCleared) return;
    state.isLevelCleared = true;
    state.isGrandFinale = true;
    sfx.playVictory();

    const elapsed = (Date.now() - state.levelStartTime) / 1000;
    unlockSticker('grand_champion');
    unlockSticker('speed_star');

    // 3 Stars for Level 8
    state.levelStars[8] = 3;
    saveProgress();

    document.getElementById('win-stars').textContent = '⭐⭐⭐';
    document.getElementById('win-rank').textContent = '👑 传奇彩虹大魔法师';
    document.getElementById('win-candies').textContent = '70 / 70';
    document.getElementById('win-time').textContent = formatTime(elapsed);
    document.getElementById('win-combo').textContent = state.maxCombo;
    document.getElementById('win-score').textContent = state.score;

    const unlockMsgEl = document.getElementById('win-unlock-msg');
    if (unlockMsgEl) {
      unlockMsgEl.textContent = '小画师画作里的 7 根彩虹柱全部装满 10 颗糖果！大圆满达成！';
    }

    spawnVictoryConfetti();

    setTimeout(() => {
      document.getElementById('victory-modal').classList.add('open');
    }, 700);
  }

  function startLevel(lvlIndex, autoIntro = true) {
    state.currentLevel = Math.max(1, Math.min(LEVELS.length, lvlIndex));
    state.isLevelCleared = false;
    state.isGrandFinale = false;
    state.score = 0;
    state.combo = 0;
    state.maxCombo = 0;
    state.levelCollected = 0;
    state.levelStartTime = Date.now();
    state.screenShake = 0;
    state.feverGauge = 0;
    state.feverTimer = 0;
    state.magnetTimer = 0;
    state.windForce = 0;
    state.windTimer = 0;

    // Reset columns
    state.columnCounts = [0, 0, 0, 0, 0, 0, 0];
    state.columnStacks = [[], [], [], [], [], [], []];
    state.columnFullGlow = [0, 0, 0, 0, 0, 0, 0];
    state.columnFrozen = [0, 0, 0, 0, 0, 0, 0];
    state.columnBugs = [null, null, null, null, null, null, null];

    const lvlConfig = getLevelConfig();
    // Top icon charges
    state.topIconCharge = lvlConfig.features.topMagic ? [40, 40, 40, 40, 40, 40] : [0, 0, 0, 0, 0, 0];

    state.fallingCandies = [];
    state.multiplierGates = [];
    state.gateSpawnTimer = lvlConfig.features.multiplierGates ? 1.5 : 99999;
    state.hazardSpawnTimer = lvlConfig.features.hazards ? 8.0 : 99999;
    state.confetti = [];
    state.activeCandy = null;

    // Reset tutorial in Level 1
    if (state.currentLevel === 1) {
      state.tutorialStep = 0;
      state.tutorialTimer = 0;
    } else {
      state.tutorialStep = 4;
    }

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
    document.getElementById('victory-modal').classList.remove('open');
    document.getElementById('level-select-modal').classList.remove('open');

    if (autoIntro) {
      showLevelIntroToast();
    }

    saveProgress();
  }

  function update(dt) {
    const cols = state.layout.columns;
    if (!cols.length) return;
    const lvlConfig = getLevelConfig();

    sfx.updateBGM(dt, state.feverTimer > 0);

    if (state.screenShake > 0) {
      state.screenShake = Math.max(0, state.screenShake - dt * 20);
    }

    if (state.magnetTimer > 0) {
      state.magnetTimer = Math.max(0, state.magnetTimer - dt);
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
          sfx.playDrop();
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
            addFloatingText(cols[cIdx].centerX, cols[cIdx].topY - 22, '🐛 贪吃虫来了! 快点击赶跑!', '#d97706', 1.1);
          } else if (lvlConfig.features.hazardTypes?.includes('ice') && roll < 0.80 && state.columnFrozen[cIdx] <= 0) {
            state.columnFrozen[cIdx] = 8.0;
            addFloatingText(cols[cIdx].centerX, cols[cIdx].topY - 22, '❄️ 冰晶封住! 点击或投糖破冰!', '#298cd4', 1.1);
          } else if (lvlConfig.features.hazardTypes?.includes('wind')) {
            state.windTimer = 5.0;
            state.windForce = (Math.random() < 0.5 ? -1 : 1) * 50;
            addFloatingText(state.width / 2, state.layout.cloudY + 55, state.windForce > 0 ? '🌬️ 调皮东风吹来啦 ➔' : '🌬️ ⬅ 调皮西风吹来啦', '#0284c7', 1.15);
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
            addFloatingText(cols[i].centerX, cols[i].topY - 16, '🐛 哎呀被偷吃1颗! 快点虫子!', '#cf2027', 1.1);
            updateHUD();
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

    const currentHoverCol = getColumnIndexAtX(state.cloud.x);
    for (let i = 0; i < cols.length; i++) {
      const isColActive = lvlConfig.activeCols.includes(i);
      const targetGlow = (i === currentHoverCol && isColActive) ? 1 : 0;
      state.columnHighlight[i] += (targetGlow - state.columnHighlight[i]) * Math.min(1, 10 * dt);
      if (state.columnCounts[i] >= lvlConfig.targetPerTube) {
        state.columnFullGlow[i] = Math.min(1, state.columnFullGlow[i] + dt * 2);
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

        // Auto drop only if timer isn't infinite
        if (ac.timer < 1000) {
          ac.timer -= dt;
          if (ac.timer <= 0) dropActiveCandy();
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
        addFloatingText(fc.x, fc.y - 12, '🎁 盲盒大爆发 ×3!', '#d97706', 1.25);
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
            addFloatingText(gate.x, gate.y - 14, `🫧 穿过${gate.label}！分裂×${gate.mult}!`, gate.color, 1.25);

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
          sfx.playMismatch();
          state.screenShake = 7;
          spawnBurstParticles(fc.x, col.topY + 20, '#333333', 20, false);
          if (state.columnCounts[colIdx] > 0 && isColActive) {
            state.columnCounts[colIdx] -= 1;
            state.levelCollected = Math.max(0, state.levelCollected - 1);
            state.columnStacks[colIdx].pop();
            addFloatingText(col.centerX, col.topY - 12, '💣 炸飞1颗！下次空中直接点炸弹拆弹！', '#cf2027', 1.1);
          } else {
            addFloatingText(col.centerX, col.topY - 12, '💣 炸弹落空！半空中点击可拆弹哦~', '#555', 1.05);
          }
          state.combo = 0;
          updateHUD();
          state.fallingCandies.splice(i, 1);
          continue;
        }

        // 2. Swatting hazards if landed on them
        if (state.columnBugs[colIdx]) {
          state.columnBugs[colIdx] = null;
          state.score += 12;
          sfx.playSwat();
          unlockSticker('bomb_hero');
          spawnBurstParticles(col.centerX, col.topY, '#5cd664', 18, true);
          addFloatingText(col.centerX, col.topY - 24, '🐛 砸跑贪吃虫 +12分!', '#1d8f24', 1.2);
        }
        if (state.columnFrozen[colIdx] > 0) {
          state.columnFrozen[colIdx] = 0;
          state.score += 10;
          sfx.playSwat();
          spawnBurstParticles(col.centerX, col.topY, '#73c6ff', 18, false);
          addFloatingText(col.centerX, col.topY - 24, '❄️ 破冰成功 +10分!', '#298cd4', 1.2);
        }

        // 3. Match checking
        const matched = isColActive && (fc.isRainbow || fc.specialType === 'shower' || colIdx === fc.colorIdx);

        if (matched) {
          if (lvlConfig.features.combo) {
            state.combo += 1;
            if (state.combo > state.maxCombo) state.maxCombo = state.combo;
            if (state.combo >= 10) unlockSticker('combo_master');
          } else {
            state.combo = 1;
          }

          const points = fc.isRainbow ? 5 : (1 + Math.min(state.combo - 1, 6));
          state.score += points;

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
            sfx.playMagicSkill();
            addFloatingText(state.width / 2, state.layout.columnsTopY - 24, '🌧️ 七彩甘霖糖！活跃跑道各加1！', '#298cd4', 1.35);
            lvlConfig.activeCols.forEach(c => addCandyToColumn(c, 'star', false));
          } else if (currentCount < lvlConfig.targetPerTube) {
            addCandyToColumn(colIdx, fc.shape, fc.isRainbow);
            state.cloud.mood = 'joy';
            state.cloud.moodTimer = 0.7;
            state.cloud.bounceY = -10;
            state.topIconBounce[colIdx % 6] = 10;

            sfx.playMatch(colIdx, state.combo);
            const progressStr = `${state.columnCounts[colIdx]}/${lvlConfig.targetPerTube}`;
            addFloatingText(
              col.centerX,
              landingY - 18,
              state.combo > 1 ? `+${points} (${progressStr}) 🔥x${state.combo}!` : `+${points} (${progressStr})`,
              '#fff',
              1.15
            );

            // Tutorial feedback in Level 1
            if (state.currentLevel === 1) {
              if (state.levelCollected === 1) {
                addFloatingText(state.width / 2, state.cloud.y - 20, '🎉 成功放入！连续放对还能提升连击得分！', '#1d8f24', 1.25);
              } else if (state.levelCollected >= 2 && state.tutorialStep < 4) {
                state.tutorialStep = 4;
                addFloatingText(state.width / 2, state.cloud.y - 20, '🌟 太棒了！把红蓝两柱集满即可过关！', '#298cd4', 1.2);
              }
            }
          } else {
            // Already full
            sfx.playMatch(colIdx, 1);
            state.score += 5;
            spawnBurstParticles(fc.x, landingY, '#ffd700', 12, true);
            addFloatingText(col.centerX, landingY - 18, '已达标额外奖励 +5! ⭐', '#ffd700', 1.15);
          }

          updateHUD();
        } else {
          // Mismatch or dropped into inactive column
          state.combo = 0;
          state.cloud.mood = 'oops';
          state.cloud.moodTimer = 0.75;
          sfx.playMismatch();

          const targetName = COLOR_COLUMNS[fc.colorIdx].name;
          spawnBurstParticles(fc.x, fc.y, '#cccccc', 10, false);
          if (!isColActive) {
            addFloatingText(fc.x, Math.min(fc.y - 10, state.layout.columnsTopY + 50), `该跑道未开启哦！我是${targetName}~`, COLOR_COLUMNS[fc.colorIdx].hex, 1.05);
          } else {
            addFloatingText(fc.x, Math.min(fc.y - 10, state.layout.columnsTopY + 50), `哎呀！我是${targetName}哦~`, COLOR_COLUMNS[fc.colorIdx].hex, 1.05);
          }
          state.columnHighlight[fc.colorIdx] = 1.8;
          updateHUD();
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
  }

  /* ---------------- Drawing functions ---------------- */

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
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#b45309';
        ctx.fillText('✨点击放大招', ix, iy + iconSize * 1.52);
      }
      ctx.restore();
    }
  }

  function drawCandy(ctx, x, y, radius, colorIdx, shape, isRainbow = false, rotation = 0, squish = 1, specialType = 'normal') {
    const col = COLOR_COLUMNS[colorIdx] || COLOR_COLUMNS[0];
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
    ctx.translate(0, c.bounceY);

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

    // Next Candy Preview Bubble on Cloud's Right (Bigger & Clearer)
    if (state.nextCandy) {
      const nc = state.nextCandy;
      const bx = x + halfW - 22;
      const by = y - halfH - 14;
      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      ctx.strokeStyle = '#282a24';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(bx - 42, by - 13, 68, 27, 13);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#444';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('下颗', bx - 36, by + 4);
      drawCandy(ctx, bx + 12, by, 8.5, nc.colorIdx, nc.shape, nc.isRainbow, 0, 1, nc.specialType);
    }

    ctx.restore();

    // Active Candy Under Cloud
    if (state.activeCandy) {
      const ac = state.activeCandy;
      const candyR = state.layout.candyRadius * ac.scale;
      const candyX = x;
      const candyY = y + halfH + candyR * 0.95 + 6;
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
        ctx.strokeStyle = ac.specialType === 'bomb' ? '#ef4444' : (isMatch ? '#1d8f24' : colInfo.hex);
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.restore();
      }

      drawCandy(ctx, candyX, candyY, candyR, ac.colorIdx, ac.shape, ac.isRainbow, Math.sin(performance.now() * 0.005) * 0.12, 1, ac.specialType);

      // Prominent In-Game Hint Slogan Bubble (Large, Bold & High Contrast)
      let badgeText = '';
      let badgeBg = 'rgba(255, 255, 255, 0.96)';
      let badgeBorder = '#282a24';
      let badgeTextColor = '#1f2937';

      if (ac.specialType === 'bomb') {
        badgeText = '💣 坏坏炸弹！空中点击直接拆弹！';
        badgeBg = '#fee2e2';
        badgeBorder = '#ef4444';
        badgeTextColor = '#b91c1c';
      } else if (ac.specialType === 'mystery') {
        badgeText = '🎁 惊喜盲盒糖（半空分裂3颗）';
        badgeBg = '#fef3c7';
        badgeBorder = '#f59e0b';
        badgeTextColor = '#b45309';
      } else if (ac.specialType === 'shower') {
        badgeText = '🌧️ 七彩甘霖糖（活跃跑道齐加1）';
        badgeBg = '#e0f2fe';
        badgeBorder = '#0284c7';
        badgeTextColor = '#0369a1';
      } else if (isMatch) {
        const colFull = state.columnCounts[hoverIdx] >= curLevelConfig.targetPerTube;
        if (colFull) {
          badgeText = '⭐ 该跑道已装满目标！';
          badgeBg = '#fef9c3';
          badgeBorder = '#eab308';
          badgeTextColor = '#854d0e';
        } else if (ac.isRainbow) {
          badgeText = '✨ 百搭彩虹星糖！任意跑道可放';
          badgeBg = '#fdf4ff';
          badgeBorder = '#c084fc';
          badgeTextColor = '#7e22ce';
        } else {
          badgeText = `✓ 对准${colInfo.name}！轻点屏幕放下`;
          badgeBg = '#ecfdf5';
          badgeBorder = '#10b981';
          badgeTextColor = '#047857';
        }
      } else if (!isTargetActive) {
        badgeText = `🔒 该跑道未开启，请移到【${colInfo.name}】`;
        badgeBg = '#f3f4f6';
        badgeBorder = '#9ca3af';
        badgeTextColor = '#4b5563';
      } else {
        badgeText = `👉 移到【${colInfo.name}】跑道上方`;
        badgeBg = '#fffbeb';
        badgeBorder = '#f59e0b';
        badgeTextColor = '#b45309';
      }

      ctx.save();
      ctx.font = 'bold 15px "PingFang SC", "Microsoft YaHei", sans-serif';
      const textW = ctx.measureText(badgeText).width;
      const pillW = textW + 24;
      const pillH = 28;
      const badgeY = candyY + candyR + 20;

      ctx.shadowColor = 'rgba(0, 0, 0, 0.18)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetY = 2;
      ctx.fillStyle = badgeBg;
      ctx.beginPath();
      ctx.roundRect(candyX - pillW / 2, badgeY - pillH / 2, pillW, pillH, 14);
      ctx.fill();

      ctx.shadowColor = 'transparent';
      ctx.strokeStyle = badgeBorder;
      ctx.lineWidth = 2.2;
      ctx.stroke();

      ctx.fillStyle = badgeTextColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(badgeText, candyX, badgeY);
      ctx.restore();
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
      const isFull = state.columnCounts[i] >= curLevelConfig.targetPerTube;
      const topY = colRect.topY - (isActive ? glow * 6 : 0);
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
        ctx.font = 'bold 15px "PingFang SC", "Microsoft YaHei", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(0,0,0,0.55)';
        ctx.shadowBlur = 4;
        ctx.fillText(colDef.name, colRect.centerX, topY + 22);

        // Progress Badge
        const pillY = topY + 43;
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
        // Dormant column tag
        ctx.font = 'bold 13px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#6b7280';
        ctx.fillText(colDef.name, colRect.centerX, topY + 20);

        const pillY = topY + 41;
        const pillW = Math.min(colRect.width * 0.92, 58);
        ctx.beginPath();
        ctx.roundRect(colRect.centerX - pillW / 2, pillY - 10, pillW, 20, 10);
        ctx.fillStyle = '#f3f4f6';
        ctx.fill();
        ctx.strokeStyle = '#9ca3af';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        ctx.font = 'bold 11.5px sans-serif';
        ctx.fillStyle = '#6b7280';
        ctx.textBaseline = 'middle';
        ctx.fillText(`🔒第${colDef.unlockLvl}关`, colRect.centerX, pillY);
      }
      ctx.restore();

      // Candies inside the column
      const stack = state.columnStacks[i];
      for (let sIdx = 0; sIdx < stack.length; sIdx++) {
        const sc = stack[sIdx];
        const sy = getSlotCenterY(sIdx);
        drawCandy(ctx, colRect.centerX, sy, sc.radius || state.layout.candyRadius, sc.colorIdx, sc.shape, sc.isRainbow, sc.rotation, sc.squish || 1);
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

  // Draw Interactive Tutorial Helpers on Canvas for Level 1 (Prominent Badges & Slogans)
  function drawTutorialOverlay(ctx) {
    if (state.currentLevel !== 1 || state.tutorialStep >= 4 || !state.activeCandy) return;

    const targetColIdx = state.activeCandy.colorIdx;
    const colObj = state.layout.columns[targetColIdx];
    if (!colObj) return;

    const candyX = state.cloud.x;
    const currentHover = getColumnIndexAtX(candyX);
    const isAligned = currentHover === targetColIdx;

    ctx.save();

    // 1. Highlight target column with pulsing golden border
    const pulse = Math.sin(performance.now() * 0.008) * 3;
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4 + pulse;
    ctx.beginPath();
    ctx.roundRect(colObj.x - 2, colObj.topY - 4, colObj.width + 4, state.height - colObj.topY + 4, 8);
    ctx.stroke();

    // 2. Animated guidance with large prominent badges
    if (!isAligned) {
      const dir = colObj.centerX > candyX ? 1 : -1;
      const arrowX = candyX + dir * 75 + Math.sin(performance.now() * 0.01) * 8;
      const arrowY = state.cloud.y + state.cloud.height * 0.5 + 24;

      const guideText = dir > 0 ? '👉 向右滑动' : '👈 向左滑动';
      ctx.font = 'bold 16px "PingFang SC", "Microsoft YaHei", sans-serif';
      const gw = ctx.measureText(guideText).width + 22;

      ctx.shadowColor = 'rgba(0, 0, 0, 0.18)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetY = 2;
      ctx.fillStyle = '#fffbeb';
      ctx.beginPath();
      ctx.roundRect(arrowX + (dir > 0 ? 8 : -gw - 8), arrowY - 15, gw, 30, 15);
      ctx.fill();

      ctx.shadowColor = 'transparent';
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2.2;
      ctx.stroke();

      ctx.fillStyle = '#b45309';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(guideText, arrowX + (dir > 0 ? 8 + gw / 2 : -gw / 2 - 8), arrowY);

      ctx.fillStyle = '#f59e0b';
      ctx.strokeStyle = '#282a24';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(arrowX, arrowY, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#282a24';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText(dir > 0 ? '➔' : '⬅', arrowX, arrowY);
    } else {
      const tapY = state.cloud.y + state.cloud.height + 56;
      ctx.fillStyle = '#10b981';
      ctx.strokeStyle = '#282a24';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(candyX, tapY - 6, 18 + pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('👇', candyX, tapY - 6);

      const dropTip = '轻点屏幕放下糖果！';
      ctx.font = 'bold 16px "PingFang SC", "Microsoft YaHei", sans-serif';
      const dtw = ctx.measureText(dropTip).width + 24;

      ctx.shadowColor = 'rgba(0, 0, 0, 0.18)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetY = 2;
      ctx.fillStyle = '#ecfdf5';
      ctx.beginPath();
      ctx.roundRect(candyX - dtw / 2, tapY + 18, dtw, 32, 16);
      ctx.fill();

      ctx.shadowColor = 'transparent';
      ctx.strokeStyle = '#059669';
      ctx.lineWidth = 2.2;
      ctx.stroke();

      ctx.fillStyle = '#065f46';
      ctx.fillText(dropTip, candyX, tapY + 34);
    }

    ctx.restore();
  }

  function render() {
    ctx.save();
    ctx.scale(state.dpr, state.dpr);

    if (state.screenShake > 0.2) {
      const sx = (Math.random() - 0.5) * state.screenShake;
      const sy = (Math.random() - 0.5) * state.screenShake;
      ctx.translate(sx, sy);
    }

    // Drawing paper background
    ctx.fillStyle = state.feverTimer > 0 ? '#fff9fb' : '#fbf9f4';
    ctx.fillRect(0, 0, state.width, state.height);

    drawTopHeaderDecorations(ctx);
    drawRainbowColumns(ctx);
    drawMultiplierGates(ctx);

    // Falling Candies
    for (let i = 0; i < state.fallingCandies.length; i++) {
      const fc = state.fallingCandies[i];
      drawCandy(ctx, fc.x, fc.y, fc.radius, fc.colorIdx, fc.shape, fc.isRainbow, fc.rotation, 1, fc.specialType);
    }

    drawCloudBar(ctx);
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

    // 1. Check click on Top 6 Hand-drawn Magic Icons
    for (let i = 0; i < state.topIconPos.length; i++) {
      const pos = state.topIconPos[i];
      if (Math.hypot(px - pos.x, py - pos.y) <= pos.r + 10) {
        if (!lvlConfig.features.topMagic) {
          sfx.playTone(330, 0.12);
          addFloatingText(pos.x, pos.y + 20, '🌟 第 5 关解锁画作魔法大招哦！', '#4f5d75', 0.95);
          return true;
        }
        if (state.topIconCharge[i] >= 100) {
          activateTopIcon(i);
          return true;
        } else {
          state.topIconBounce[i] = 8;
          sfx.playTone(440 + i * 50, 0.12);
          addFloatingText(pos.x, pos.y + 20, `⚡ 能量 ${Math.floor(state.topIconCharge[i])}% (投糖充能满100%放大招)`, '#4f5d75', 0.95);
          return true;
        }
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
        addFloatingText(fc.x, fc.y - 12, '💥 空中拆弹成功 +15分!', '#1d8f24', 1.3);
        state.fallingCandies.splice(i, 1);
        updateHUD();
        return true;
      }
    }

    // 3. Swatting an active Bomb held under the cloud
    if (state.activeCandy && state.activeCandy.specialType === 'bomb') {
      const candyX = state.cloud.x;
      const candyY = state.cloud.y + state.cloud.height * 0.5 + state.layout.candyRadius + 6;
      if (Math.hypot(px - candyX, py - candyY) <= state.layout.candyRadius * 2.2) {
        sfx.playSwat();
        unlockSticker('bomb_hero');
        state.score += 15;
        state.screenShake = 5;
        spawnBurstParticles(candyX, candyY, '#fde047', 22, true);
        addFloatingText(candyX, candyY - 10, '💥 拍飞坏炸弹 +15分！变彩虹糖！', '#1d8f24', 1.25);
        state.activeCandy.specialType = 'rainbow';
        state.activeCandy.isRainbow = true;
        state.activeCandy.shape = 'star';
        updateHUD();
        return true;
      }
    }

    // 4. Clicking on a Caterpillar Bug or Frozen Column Rim
    const cols = state.layout.columns;
    for (let i = 0; i < cols.length; i++) {
      const col = cols[i];
      if (Math.abs(px - col.centerX) <= col.width * 0.65 && Math.abs(py - col.topY) <= 46) {
        if (state.columnBugs[i]) {
          state.columnBugs[i] = null;
          state.score += 12;
          sfx.playSwat();
          unlockSticker('bomb_hero');
          spawnBurstParticles(col.centerX, col.topY, '#84cc16', 20, true);
          addFloatingText(col.centerX, col.topY - 18, '🐛 赶走贪吃虫 +12分！送1颗糖！', '#1d8f24', 1.2);
          addCandyToColumn(i, 'heart', false);
          updateHUD();
          return true;
        }
        if (state.columnFrozen[i] > 0) {
          state.columnFrozen[i] = 0;
          state.score += 10;
          sfx.playSwat();
          spawnBurstParticles(col.centerX, col.topY, '#38bdf8', 18, false);
          addFloatingText(col.centerX, col.topY - 18, '❄️ 咔嚓破冰 +10分！', '#0284c7', 1.2);
          updateHUD();
          return true;
        }
      }
    }

    return false;
  }

  canvas.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    sfx.init();

    const px = getCanvasX(e.clientX);
    const py = getCanvasY(e.clientY);

    if (trySwatInteractiveTargets(px, py)) {
      return;
    }

    state.isDragging = true;
    state.TapStartTime = performance.now();
    state.TapStartX = px;
    state.TapStartY = py;

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

  window.addEventListener('pointerup', (e) => {
    if (!state.isDragging) return;
    state.isDragging = false;
    const px = getCanvasX(e.clientX);
    const py = getCanvasY(e.clientY);
    const elapsed = performance.now() - (state.TapStartTime || 0);
    const moved = Math.hypot(px - (state.TapStartX || px), py - (state.TapStartY || py));

    // Quick tap: drop candy or align
    if (elapsed < 320 && moved < 18) {
      const tappedCol = getColumnIndexAtX(px);
      const currentCol = getColumnIndexAtX(state.cloud.x);

      if (tappedCol === currentCol || Math.abs(px - state.cloud.x) < state.cloud.width * 0.45) {
        dropActiveCandy();
      } else if (state.layout.columns[tappedCol]) {
        state.cloud.targetX = state.layout.columns[tappedCol].centerX;
        clampCloudX();
      }
    }
  });

  // Keyboard controls for desktop
  window.addEventListener('keydown', (e) => {
    sfx.init();

    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      e.preventDefault();
      state.keys.left = true;
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      e.preventDefault();
      state.keys.right = true;
    } else if (e.key === ' ' || e.key === 'ArrowDown' || e.key === 'Enter' || e.key === 's' || e.key === 'S') {
      e.preventDefault();
      if (state.activeCandy && state.activeCandy.specialType === 'bomb') {
        const candyX = state.cloud.x;
        const candyY = state.cloud.y + state.cloud.height * 0.5 + state.layout.candyRadius + 6;
        trySwatInteractiveTargets(candyX, candyY);
      } else {
        dropActiveCandy();
      }
    } else if (e.key === 'q' || e.key === 'Q') {
      if (!activateTopIcon(0)) activateTopIcon(3);
    } else if (e.key === 'w' || e.key === 'W') {
      if (!activateTopIcon(1)) activateTopIcon(4);
    } else if (e.key === 'e' || e.key === 'E') {
      if (!activateTopIcon(2)) activateTopIcon(5);
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

  // Reset levels
  document.getElementById('btn-reset-levels').addEventListener('click', () => {
    if (confirm('确定要重置关卡闯关进度吗？重置后将从第 1 关重新开始。')) {
      state.unlockedLevel = 1;
      state.levelStars = {};
      saveProgress();
      startLevel(1);
    }
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

  // Quick reset in HUD
  document.getElementById('btn-quick-reset').addEventListener('click', () => {
    startLevel(state.currentLevel, false);
    addFloatingText(state.width / 2, state.cloud.y - 20, `🔄 已重新开始第 ${state.currentLevel} 关`, '#4f5d75', 1.1);
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

  // Intro Toast Close
  document.getElementById('close-intro-toast').addEventListener('click', () => {
    hideLevelIntroToast();
  });

  // Victory modal buttons
  document.getElementById('btn-win-replay').addEventListener('click', () => {
    victoryModal.classList.remove('open');
    startLevel(8);
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
      addFloatingText(state.width / 2, state.layout.cloudY - 15, `🌈 连续接准糖果攒满100%即可触发彩虹暴走！`, '#7c3aed', 1.0);
    }
  });

  // Music Box BGM toggle
  const btnBgm = document.getElementById('btn-bgm');
  btnBgm.addEventListener('click', () => {
    sfx.init();
    sfx.bgmEnabled = !sfx.bgmEnabled;
    btnBgm.classList.toggle('active-mode', sfx.bgmEnabled);
    btnBgm.innerHTML = sfx.bgmEnabled ? '🎵 <span class="mode-long">音乐开</span>' : '🎵 <span class="mode-long">音乐</span>';
  });

  // Sound FX toggle
  const btnSound = document.getElementById('btn-sound');
  btnSound.addEventListener('click', () => {
    sfx.enabled = !sfx.enabled;
    btnSound.textContent = sfx.enabled ? '🔊' : '🔇';
    if (sfx.enabled) sfx.playTone(440, 0.15);
  });

  // Initialization
  loadSavedProgress();
  window.addEventListener('resize', computeLayout);
  computeLayout();

  startLevel(state.currentLevel, true);

  let lastTime = performance.now();
  function loop(now) {
    const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
    lastTime = now;
    update(dt);
    render();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
