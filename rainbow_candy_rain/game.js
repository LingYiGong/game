(() => {
      // 7 Rainbow Colors exactly matching original hand drawing
      const COLOR_COLUMNS = [
        { id: 'red',     name: '草莓红',   hex: '#cf2027', lightHex: '#ff6b72', darkHex: '#9e1318', noteFreq: 261.63 },
        { id: 'pink',    name: '蜜桃粉',   hex: '#f39bc3', lightHex: '#ffd0e6', darkHex: '#d46b9b', noteFreq: 293.66 },
        { id: 'green',   name: '苹果绿',   hex: '#1d8f24', lightHex: '#5cd664', darkHex: '#116316', noteFreq: 329.63 },
        { id: 'purple',  name: '葡萄紫',   hex: '#5d4b86', lightHex: '#9b86cc', darkHex: '#3f3161', noteFreq: 349.23 },
        { id: 'blue',    name: '蓝莓蓝',   hex: '#4650b0', lightHex: '#828cf2', darkHex: '#2b3380', noteFreq: 392.00 },
        { id: 'orange',  name: '甜橙橘',   hex: '#e36517', lightHex: '#ffa063', darkHex: '#ab4507', noteFreq: 440.00 },
        { id: 'skyblue', name: '苏打天蓝', hex: '#298cd4', lightHex: '#73c6ff', darkHex: '#186299', noteFreq: 493.88 }
      ];

      const TARGET_PER_TUBE = 10;
      const TOTAL_TUBES = COLOR_COLUMNS.length; // 7
      const TOTAL_TARGET = TOTAL_TUBES * TARGET_PER_TUBE; // 70
      const CANDY_SHAPES = ['wrapped', 'heart', 'berry', 'star', 'round'];

      // 8 Collectible Hand-drawn Stickers
      const STICKER_DEFS = [
        { id: 'first_tube', icon: '🌈', title: '初遇彩虹柱', desc: '首次将任意1根彩虹柱装满10颗糖果' },
        { id: 'combo_master', icon: '🔥', title: '十连神射手', desc: '单局达成 10 次以上连续精准投进' },
        { id: 'bubble_split', icon: '🫧', title: '泡泡分裂师', desc: '让落下的糖果穿过空中倍增门实现翻倍' },
        { id: 'magic_star', icon: '🌟', title: '画作唤醒者', desc: '激活并释放画纸顶部的手绘魔法标志' },
        { id: 'fever_party', icon: '😎', title: '彩虹暴走王', desc: '集满暴走能量，触发云朵彩虹喷泉狂欢' },
        { id: 'bomb_hero', icon: '💥', title: '拆弹小卫士', desc: '在半空中点击拍飞坏坏炸弹或赶走贪吃虫' },
        { id: 'speed_star', icon: '⚡', title: '闪电满星王', desc: '在 75 秒内急速通关并斩获 ⭐⭐⭐ 评价' },
        { id: 'grand_champion', icon: '👑', title: '彩虹大满贯', desc: '成功集满全部 7 根彩虹柱通关游戏' }
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
            // Cheerful pentatonic / music-box melody
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
          const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
          notes.forEach((n, idx) => {
            this.playTone(n, 0.3, 'triangle', 0.24, idx * 0.08);
          });
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

      const state = {
        width: 600,
        height: 800,
        dpr: 1,
        mode: 'classic',
        score: 0,
        combo: 0,
        maxCombo: 0,
        totalCollected: 0,
        gameStartTime: Date.now(),
        isWon: false,
        screenShake: 0,
        // Fever Rainbow Mode
        feverGauge: 0,      // 0..100
        feverTimer: 0,      // active seconds remaining
        feverSpawnCd: 0,
        // Active Magic Buffs from Top 6 Hand-drawn Icons
        magnetTimer: 0,     // Split-Heart Magic: auto-homing candies!
        windForce: 0,       // Gentle breeze force in challenge/classic
        windTimer: 0,
        columnCounts: [0, 0, 0, 0, 0, 0, 0],
        columnStacks: [[], [], [], [], [], [], []],
        columnHighlight: [0, 0, 0, 0, 0, 0, 0],
        columnFullGlow: [0, 0, 0, 0, 0, 0, 0],
        columnFrozen: [0, 0, 0, 0, 0, 0, 0], // Ice shield on columns (tap or hit to shatter for bonus!)
        columnBugs: [null, null, null, null, null, null, null], // Mischievous caterpillars sitting on column rim
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
        multiplierGates: [], // Floating x2 / x3 / +2 magic bubbles between cloud and columns
        gateSpawnTimer: 1.5,
        hazardSpawnTimer: 8.0,
        particles: [],
        confetti: [],
        floatingTexts: [],
        topIconBounce: [0, 0, 0, 0, 0, 0],
        topIconCharge: [40, 40, 40, 40, 40, 40], // 0..100 charge for each of the 6 top hand-drawn icons
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

        // Exactly 10 slots fit the vertical height from bottom to top header
        state.layout.slotHeight = (storageH - 6) / TARGET_PER_TUBE;

        // Big, clear, and plump candy radius
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

      // Slot 0 is at the bottom base, Slot 9 is right under the column header
      function getSlotCenterY(slotIndex) {
        const base = state.layout.storageBottomY - state.layout.candyRadius;
        return base - slotIndex * state.layout.slotHeight;
      }

      function countFullTubes() {
        return state.columnCounts.filter(c => c >= TARGET_PER_TUBE).length;
      }

      // Sticker persistence helpers
      function loadStickers() {
        try {
          const raw = localStorage.getItem('rainbow_candy_stickers_v2');
          if (raw) state.unlockedStickers = JSON.parse(raw) || {};
        } catch (e) {
          state.unlockedStickers = {};
        }
      }

      function unlockSticker(id) {
        if (state.unlockedStickers[id]) return;
        state.unlockedStickers[id] = true;
        state.newlyUnlockedThisRun.push(id);
        try {
          localStorage.setItem('rainbow_candy_stickers_v2', JSON.stringify(state.unlockedStickers));
        } catch (e) {}
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

      function pickNeededColorIndex() {
        const neededColors = [];
        for (let i = 0; i < COLOR_COLUMNS.length; i++) {
          if (state.columnCounts[i] < TARGET_PER_TUBE) {
            neededColors.push(i);
          }
        }
        if (neededColors.length > 0 && Math.random() < 0.95) {
          return neededColors[Math.floor(Math.random() * neededColors.length)];
        }
        return Math.floor(Math.random() * COLOR_COLUMNS.length);
      }

      function createRandomCandy() {
        const colorIdx = pickNeededColorIndex();

        // Roll special candy / troublemaker type
        const roll = Math.random();
        let specialType = 'normal'; // 'normal' | 'rainbow' | 'triple' | 'mystery' | 'shower' | 'bomb'
        let isRainbow = false;

        if (state.mode !== 'kids' && roll < (state.mode === 'rain' ? 0.13 : 0.085)) {
          specialType = 'bomb';
        } else if (roll < 0.17) {
          specialType = 'rainbow';
          isRainbow = true;
        } else if (roll < 0.27) {
          specialType = 'triple';
        } else if (roll < 0.34) {
          specialType = 'mystery';
        } else if (roll < 0.40) {
          specialType = 'shower';
        }

        const shape = isRainbow
          ? 'star'
          : CANDY_SHAPES[Math.floor(Math.random() * CANDY_SHAPES.length)];

        let maxTimer = 3.2;
        if (state.mode === 'classic') {
          maxTimer = Math.max(1.8, 3.2 - Math.min(state.score * 0.01, 1.0));
        } else if (state.mode === 'rain') {
          maxTimer = Math.max(1.15, 1.85 - Math.min(state.score * 0.01, 0.55));
        } else if (state.mode === 'kids') {
          maxTimer = 999999;
        }

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
        if (!state.activeCandy || state.isWon || state.fallingCandies.length >= 16) return;
        const c = state.activeCandy;
        const dropX = state.cloud.x;
        const dropY = state.cloud.y + state.cloud.height * 0.48;

        if (c.specialType === 'triple') {
          // Triple burst: drops 3 candies of this color in a tight cheerful fan!
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
        if (state.multiplierGates.length >= 2) return;
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
        if (state.feverTimer > 0 || state.isWon) return;
        state.feverGauge = 100;
        state.feverTimer = 6.0;
        state.feverSpawnCd = 0.1;
        state.screenShake = 8;
        sfx.playFeverStart();
        unlockSticker('fever_party');
        addFloatingText(state.width / 2, state.layout.cloudY + 45, '🌈 彩虹暴走开启！全自动糖果狂欢！', '#ec4899', 1.4);
      }

      function activateTopIcon(iconIdx) {
        if (state.isWon || state.topIconCharge[iconIdx] < 100) return false;
        state.topIconCharge[iconIdx] = 0;
        state.topIconBounce[iconIdx] = 16;
        state.screenShake = 6;
        sfx.playMagicSkill();
        unlockSticker('magic_star');

        const cols = state.layout.columns;
        const pos = state.topIconPos[iconIdx] || { x: state.width / 2, y: state.layout.topIconsY };
        spawnBurstParticles(pos.x, pos.y, '#ffd700', 24, true);

        if (iconIdx === 0 || iconIdx === 3) {
          // Green Star: Meteor Candy Shower (6 homing candies targeting needed columns!)
          addFloatingText(pos.x, pos.y + 24, '🌠 绿星魔法：流星糖果雨！', '#1d8f24', 1.3);
          for (let m = 0; m < 6; m++) {
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
          // Split Heart: Rainbow Magnet Homing for 8 seconds!
          state.magnetTimer = 8.0;
          state.fallingCandies.forEach(fc => {
            if (fc.specialType !== 'bomb') fc.homing = true;
          });
          addFloatingText(pos.x, pos.y + 24, '🧲 爱心魔法：8秒彩虹磁力制导！', '#e36517', 1.3);
        } else {
          // Berry Heart: Purify all hazards + instant +2 candies in 3 most-needed columns!
          state.columnFrozen = [0, 0, 0, 0, 0, 0, 0];
          state.columnBugs = [null, null, null, null, null, null, null];
          state.fallingCandies = state.fallingCandies.filter(fc => fc.specialType !== 'bomb');
          if (state.activeCandy && state.activeCandy.specialType === 'bomb') {
            state.activeCandy.specialType = 'rainbow';
            state.activeCandy.isRainbow = true;
          }
          addFloatingText(pos.x, pos.y + 24, '🍇 紫莓甘霖：净化全场 + 糖果暴涨！', '#7e3f8f', 1.3);

          // Find up to 3 columns that need candies
          const indices = [0, 1, 2, 3, 4, 5, 6]
            .filter(i => state.columnCounts[i] < TARGET_PER_TUBE)
            .sort((a, b) => state.columnCounts[a] - state.columnCounts[b])
            .slice(0, 3);
          indices.forEach(cIdx => {
            for (let n = 0; n < 2; n++) {
              addCandyToColumn(cIdx, 'berry', false);
            }
          });
        }
        updateHUD();
        return true;
      }

      function addCandyToColumn(colIdx, shape = 'round', isRainbow = false) {
        const col = state.layout.columns[colIdx];
        if (!col) return;
        if (state.columnCounts[colIdx] < TARGET_PER_TUBE) {
          state.totalCollected += 1;
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

          if (state.columnCounts[colIdx] === TARGET_PER_TUBE) {
            sfx.playTubeComplete();
            unlockSticker('first_tube');
            spawnBurstParticles(col.centerX, col.topY + 30, '#ffd700', 26, true);
            addFloatingText(col.centerX, col.topY - 14, `🎉 ${COLOR_COLUMNS[colIdx].name}柱集满10颗!`, '#1d8f24', 1.35);
            if (countFullTubes() >= TOTAL_TUBES) {
              triggerVictory();
            }
          }
        } else {
          state.score += 5;
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
        state.floatingTexts.push({ x, y, text, color, scale, alpha: 1, vy: -55, life: 1.1 });
      }

      function updateHUD() {
        const fullCount = countFullTubes();
        document.getElementById('full-tubes-val').textContent = `${fullCount}/${TOTAL_TUBES}`;
        document.getElementById('total-val').textContent = `${state.totalCollected}/${TOTAL_TARGET}`;
        document.getElementById('combo-val').textContent = state.combo;
        document.getElementById('score-val').textContent = state.score;

        const feverEl = document.getElementById('fever-val');
        const feverPill = document.getElementById('fever-pill');
        if (feverEl && feverPill) {
          if (state.feverTimer > 0) {
            feverEl.textContent = `${state.feverTimer.toFixed(1)}s`;
            feverPill.classList.add('fever-ready');
          } else {
            const pct = Math.min(100, Math.floor(state.feverGauge));
            feverEl.textContent = `${pct}%`;
            feverPill.classList.toggle('fever-ready', pct >= 100);
          }
        }
      }

      function formatTime(totalSeconds) {
        const m = Math.floor(totalSeconds / 60);
        const s = Math.floor(totalSeconds % 60);
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      }

      function triggerVictory() {
        if (state.isWon) return;
        state.isWon = true;
        sfx.playVictory();

        const elapsed = (Date.now() - state.gameStartTime) / 1000;
        unlockSticker('grand_champion');
        if (elapsed <= 75) {
          unlockSticker('speed_star');
        }

        // Compute 1~3 Star Rating & Title
        let stars = '⭐⭐⭐';
        let rankTitle = '👑 彩虹糖果大魔法师';
        if (elapsed <= 80 || state.score >= 260) {
          stars = '⭐⭐⭐';
          rankTitle = '👑 传奇彩虹大魔法师';
        } else if (elapsed <= 130 || state.score >= 180) {
          stars = '⭐⭐';
          rankTitle = '🌟 彩虹甜心神射手';
        } else {
          stars = '⭐';
          rankTitle = '🍬 快乐糖果收集家';
        }

        document.getElementById('win-stars').textContent = stars;
        document.getElementById('win-rank').textContent = rankTitle;
        document.getElementById('win-candies').textContent = `${state.totalCollected} / ${TOTAL_TARGET}`;
        document.getElementById('win-time').textContent = formatTime(elapsed);
        document.getElementById('win-combo').textContent = state.maxCombo;
        document.getElementById('win-score').textContent = state.score;

        const unlockMsgEl = document.getElementById('win-unlock-msg');
        if (unlockMsgEl) {
          if (state.newlyUnlockedThisRun.length > 0) {
            const names = state.newlyUnlockedThisRun
              .map(id => STICKER_DEFS.find(s => s.id === id))
              .filter(Boolean)
              .map(s => `${s.icon}${s.title}`)
              .join('、');
            unlockMsgEl.textContent = `🏅 本局新解锁贴纸：${names}！`;
          } else {
            unlockMsgEl.textContent = '所有 7 个彩虹柱子都完美装满了 10 颗糖果！太棒了！';
          }
        }

        spawnVictoryConfetti();

        setTimeout(() => {
          document.getElementById('victory-modal').classList.add('open');
        }, 650);
      }

      function resetGame() {
        state.score = 0;
        state.combo = 0;
        state.maxCombo = 0;
        state.totalCollected = 0;
        state.isWon = false;
        state.screenShake = 0;
        state.feverGauge = 0;
        state.feverTimer = 0;
        state.magnetTimer = 0;
        state.windForce = 0;
        state.windTimer = 0;
        state.newlyUnlockedThisRun = [];
        state.gameStartTime = Date.now();
        state.columnCounts = [0, 0, 0, 0, 0, 0, 0];
        state.columnStacks = [[], [], [], [], [], [], []];
        state.columnFullGlow = [0, 0, 0, 0, 0, 0, 0];
        state.columnFrozen = [0, 0, 0, 0, 0, 0, 0];
        state.columnBugs = [null, null, null, null, null, null, null];
        state.topIconCharge = [40, 40, 40, 40, 40, 40];
        state.fallingCandies = [];
        state.multiplierGates = [];
        state.gateSpawnTimer = 1.2;
        state.hazardSpawnTimer = 7.0;
        state.confetti = [];
        state.activeCandy = null;
        spawnNextCandyOnCloud();
        spawnMultiplierGate();
        updateHUD();
        document.getElementById('victory-modal').classList.remove('open');
      }

      function update(dt) {
        const cols = state.layout.columns;
        if (!cols.length) return;

        // Update Music Box BGM
        sfx.updateBGM(dt, state.feverTimer > 0);

        if (state.screenShake > 0) {
          state.screenShake = Math.max(0, state.screenShake - dt * 20);
        }

        if (state.magnetTimer > 0) {
          state.magnetTimer = Math.max(0, state.magnetTimer - dt);
        }

        // Victory celebration state updates
        if (state.isWon) {
          if (Math.random() < 0.15) spawnVictoryConfetti();
          state.cloud.bounceY = Math.sin(performance.now() * 0.008) * 6;
          state.cloud.mood = 'joy';
        }

        // Fever Mode Fountain update
        if (!state.isWon && state.feverTimer > 0) {
          state.feverTimer -= dt;
          state.cloud.mood = 'joy';
          state.feverSpawnCd -= dt;
          if (state.feverSpawnCd <= 0) {
            state.feverSpawnCd = 0.26;
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

        // Floating Multiplier Gates update & spawn
        if (!state.isWon) {
          state.gateSpawnTimer -= dt;
          if (state.gateSpawnTimer <= 0) {
            state.gateSpawnTimer = 4.2 + Math.random() * 2.5;
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

        // Troublemaker Events (Caterpillar bugs, Frost, Gentle Wind) in classic & rain modes
        if (!state.isWon && state.mode !== 'kids') {
          state.hazardSpawnTimer -= dt;
          if (state.hazardSpawnTimer <= 0) {
            state.hazardSpawnTimer = state.mode === 'rain' ? 6.5 : 10.5;
            const eventRoll = Math.random();
            const candidateCols = [0, 1, 2, 3, 4, 5, 6].filter(i => state.columnCounts[i] < TARGET_PER_TUBE);
            if (candidateCols.length > 0) {
              const cIdx = candidateCols[Math.floor(Math.random() * candidateCols.length)];
              if (eventRoll < 0.45 && !state.columnBugs[cIdx]) {
                // Spawn a cute greedy caterpillar on column rim
                state.columnBugs[cIdx] = { hp: 1, timer: 9.0, phase: 0 };
                addFloatingText(cols[cIdx].centerX, cols[cIdx].topY - 22, '🐛 贪吃虫来了! 快点它赶跑!', '#d97706', 1.1);
              } else if (eventRoll < 0.78 && state.columnFrozen[cIdx] <= 0) {
                state.columnFrozen[cIdx] = 8.0;
                addFloatingText(cols[cIdx].centerX, cols[cIdx].topY - 22, '❄️ 冰晶护罩! 点击或投糖破冰!', '#298cd4', 1.1);
              } else {
                state.windTimer = 5.0;
                state.windForce = (Math.random() < 0.5 ? -1 : 1) * (state.mode === 'rain' ? 75 : 48);
                addFloatingText(state.width / 2, state.layout.cloudY + 55, state.windForce > 0 ? '🌬️ 调皮东风吹来啦 ➔' : '🌬️ ⬅ 调皮西风吹来啦', '#0284c7', 1.15);
              }
            }
          }
        }

        if (state.windTimer > 0) {
          state.windTimer = Math.max(0, state.windTimer - dt);
          if (state.windTimer <= 0) state.windForce = 0;
        }

        // Update column bugs & frozen timers
        for (let i = 0; i < cols.length; i++) {
          if (state.columnFrozen[i] > 0) {
            state.columnFrozen[i] = Math.max(0, state.columnFrozen[i] - dt);
          }
          const bug = state.columnBugs[i];
          if (bug) {
            bug.phase += dt * 6;
            bug.timer -= dt;
            if (bug.timer <= 0) {
              // Caterpillar nibbles 1 candy if left completely ignored for 9s!
              if (state.columnCounts[i] > 0 && state.columnCounts[i] < TARGET_PER_TUBE) {
                state.columnCounts[i] -= 1;
                state.totalCollected = Math.max(0, state.totalCollected - 1);
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

        if (!state.isWon) {
          state.cloud.bounceY *= Math.pow(0.08, dt);
        }
        if (state.cloud.moodTimer > 0) {
          state.cloud.moodTimer -= dt;
          if (state.cloud.moodTimer <= 0 && !state.isWon) state.cloud.mood = 'happy';
        }

        for (let i = 0; i < state.topIconBounce.length; i++) {
          state.topIconBounce[i] *= Math.pow(0.05, dt);
        }

        const currentHoverCol = getColumnIndexAtX(state.cloud.x);
        for (let i = 0; i < cols.length; i++) {
          const targetGlow = i === currentHoverCol ? 1 : 0;
          state.columnHighlight[i] += (targetGlow - state.columnHighlight[i]) * Math.min(1, 10 * dt);
          if (state.columnCounts[i] >= TARGET_PER_TUBE) {
            state.columnFullGlow[i] = Math.min(1, state.columnFullGlow[i] + dt * 2);
          }
        }

        // Active Candy Countdown or Align
        if (!state.isWon) {
          if (!state.activeCandy) {
            spawnNextCandyOnCloud();
          } else {
            const ac = state.activeCandy;
            ac.scale = Math.min(1, ac.scale + dt * 5);

            const isOverMatchingCol = ac.isRainbow || ac.specialType === 'mystery' || ac.specialType === 'shower' || currentHoverCol === ac.colorIdx;
            const isCloudSteady = Math.abs(state.cloud.vx) < 35;

            if (state.mode === 'kids') {
              if (isOverMatchingCol && isCloudSteady) {
                ac.alignTime += dt;
                if (ac.alignTime >= 0.45) dropActiveCandy();
              } else {
                ac.alignTime = Math.max(0, ac.alignTime - dt * 2);
              }
            } else {
              ac.timer -= dt;
              if (ac.timer <= 0) dropActiveCandy();
            }
          }
        }

        // Update Squish Animation in stacked candies
        for (let c = 0; c < state.columnStacks.length; c++) {
          const stack = state.columnStacks[c];
          for (let s = 0; s < stack.length; s++) {
            if (stack[s].squish && stack[s].squish !== 1) {
              stack[s].squish += (1 - stack[s].squish) * Math.min(1, 12 * dt);
            }
          }
        }

        // Falling Candies physics, gate collisions, mystery bursts & landing
        for (let i = state.fallingCandies.length - 1; i >= 0; i--) {
          const fc = state.fallingCandies[i];
          fc.vy += fc.gravity * dt;

          // Magnetic homing or gentle wind
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

          // Mystery Gift Box Candy bursts mid-air into 3 needed candies!
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

          // Check collision with Floating Multiplier Gates!
          if (!fc.splitDone && fc.specialType !== 'bomb') {
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
                    homing: true, // Split candies auto-home to their matching column for maximum satisfaction!
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

          const currentCount = state.columnCounts[colIdx];
          const targetSlot = Math.min(TARGET_PER_TUBE - 1, currentCount);
          const landingY = getSlotCenterY(targetSlot);

          if (fc.y >= Math.max(col.topY + 20, landingY)) {
            // 1. Handle Bomb Landing
            if (fc.specialType === 'bomb') {
              sfx.playMismatch();
              state.screenShake = 7;
              spawnBurstParticles(fc.x, col.topY + 20, '#333333', 20, false);
              if (state.columnCounts[colIdx] > 0 && state.columnCounts[colIdx] < TARGET_PER_TUBE) {
                state.columnCounts[colIdx] -= 1;
                state.totalCollected = Math.max(0, state.totalCollected - 1);
                state.columnStacks[colIdx].pop();
                addFloatingText(col.centerX, col.topY - 12, '💣 哎呀炸飞1颗！下次直接点炸弹拍碎它！', '#cf2027', 1.1);
              } else {
                addFloatingText(col.centerX, col.topY - 12, '💣 炸弹落空啦！点击炸弹可拆弹拿奖哦~', '#555', 1.05);
              }
              state.combo = 0;
              updateHUD();
              state.fallingCandies.splice(i, 1);
              continue;
            }

            // 2. If column has a greedy bug or ice shield, hitting it clears the hazard & gives bonus!
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

            const matched = fc.isRainbow || fc.specialType === 'shower' || colIdx === fc.colorIdx;

            if (matched) {
              state.combo += 1;
              if (state.combo > state.maxCombo) state.maxCombo = state.combo;
              if (state.combo >= 10) unlockSticker('combo_master');

              const points = fc.isRainbow ? 5 : (1 + Math.min(state.combo - 1, 6));
              state.score += points;

              // Charge top 6 hand-drawn icons & Fever gauge!
              const iconSlot = colIdx % 6;
              state.topIconCharge[iconSlot] = Math.min(100, state.topIconCharge[iconSlot] + 34);
              // Also slightly charge a neighbor icon so all 6 light up frequently
              state.topIconCharge[(iconSlot + 3) % 6] = Math.min(100, state.topIconCharge[(iconSlot + 3) % 6] + 18);

              if (state.feverTimer <= 0) {
                state.feverGauge = Math.min(100, state.feverGauge + (fc.isRainbow ? 24 : 15));
                if (state.feverGauge >= 100) {
                  triggerFeverMode();
                }
              }

              // Special Shower Candy: rains 1 matching candy into all 7 columns!
              if (fc.specialType === 'shower') {
                sfx.playMagicSkill();
                addFloatingText(state.width / 2, state.layout.columnsTopY - 24, '🌧️ 七彩甘霖糖！全排7柱齐降糖果！', '#298cd4', 1.35);
                for (let c = 0; c < TOTAL_TUBES; c++) {
                  addCandyToColumn(c, 'star', false);
                }
              } else if (currentCount < TARGET_PER_TUBE) {
                addCandyToColumn(colIdx, fc.shape, fc.isRainbow);
                state.cloud.mood = 'joy';
                state.cloud.moodTimer = 0.7;
                state.cloud.bounceY = -10;
                state.topIconBounce[colIdx % 6] = 10;

                if (state.columnCounts[colIdx] < TARGET_PER_TUBE) {
                  sfx.playMatch(colIdx, state.combo);
                  const progressStr = `${state.columnCounts[colIdx]}/${TARGET_PER_TUBE}`;
                  addFloatingText(
                    col.centerX,
                    landingY - 18,
                    state.combo > 1 ? `+${points} (${progressStr}) 🔥x${state.combo}!` : `+${points} (${progressStr})`,
                    '#fff',
                    1.15
                  );
                }
              } else {
                // Column is already at 10: bonus points + redirect a homing candy to a needed column!
                sfx.playMatch(colIdx, 1);
                state.score += 5;
                spawnBurstParticles(fc.x, landingY, '#ffd700', 12, true);
                addFloatingText(col.centerX, landingY - 18, `满柱弹射支援 +5! ⭐`, '#ffd700', 1.15);
              }

              updateHUD();
            } else {
              // Mismatch
              state.combo = 0;
              state.cloud.mood = 'oops';
              state.cloud.moodTimer = 0.75;
              sfx.playMismatch();

              const targetName = COLOR_COLUMNS[fc.colorIdx].name;
              spawnBurstParticles(fc.x, fc.y, '#cccccc', 10, false);
              addFloatingText(fc.x, Math.min(fc.y - 10, state.layout.columnsTopY + 50), `哎呀！我是${targetName}哦~`, COLOR_COLUMNS[fc.colorIdx].hex, 1.05);
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

        ctx.save();
        ctx.font = `600 ${Math.max(12, Math.min(14, W * 0.024))}px "Comic Sans MS", "KaiTi", cursive, sans-serif`;
        ctx.fillStyle = '#4f5d75';
        ctx.textAlign = 'right';
        ctx.translate(W - 12, 18);
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
          const isReady = charge >= 100;
          const pulse = isReady ? Math.sin(performance.now() * 0.008 + i) * 3 : 0;
          const iy = y - state.topIconBounce[i] + pulse;
          state.topIconPos.push({ x: ix, y: iy, r: iconSize * 1.45 });

          // Charge progress ring or golden ready halo
          ctx.save();
          ctx.beginPath();
          ctx.arc(ix, iy, iconSize * 1.25, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * Math.min(100, charge)) / 100);
          ctx.strokeStyle = isReady ? '#f59e0b' : 'rgba(70, 80, 176, 0.28)';
          ctx.lineWidth = isReady ? 3.5 : 2;
          if (isReady) {
            ctx.fillStyle = 'rgba(255, 235, 130, 0.55)';
            ctx.fill();
          }
          ctx.stroke();
          ctx.restore();

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
            ctx.save();
            ctx.font = 'bold 10px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#b45309';
            ctx.fillText('✨点击放大招', ix, iy + iconSize * 1.48);
            ctx.restore();
          }
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

          // Ribbon cross
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

        // 3. Rainbow Shower Candy (rains into all 7 columns)
        if (specialType === 'shower') {
          const grad = ctx.createLinearGradient(-radius, -radius, radius, radius);
          grad.addColorStop(0, '#38bdf8');
          grad.addColorStop(0.5, '#a855f7');
          grad.addColorStop(1, '#f43f5e');
          ctx.beginPath();
          ctx.arc(0, 0, radius * 1.04, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
          ctx.lineWidth = 2.6;
          ctx.strokeStyle = '#fff';
          ctx.stroke();

          ctx.shadowColor = 'transparent';
          ctx.font = `bold ${Math.round(radius * 0.95)}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('🌧️', 0, 1);
          ctx.restore();
          return;
        }

        let fillStyle = col.hex;
        if (isRainbow) {
          const grad = ctx.createLinearGradient(-radius, -radius, radius, radius);
          grad.addColorStop(0, '#ce2026');
          grad.addColorStop(0.2, '#e36517');
          grad.addColorStop(0.4, '#cfd428');
          grad.addColorStop(0.6, '#1d8f24');
          grad.addColorStop(0.8, '#298cd4');
          grad.addColorStop(1, '#5d4b86');
          fillStyle = grad;
        }

        ctx.strokeStyle = '#282a24';
        ctx.lineWidth = 2.6;
        ctx.lineJoin = 'round';

        if (shape === 'wrapped') {
          ctx.fillStyle = fillStyle;
          ctx.beginPath();
          ctx.moveTo(-radius * 0.65, 0);
          ctx.lineTo(-radius * 1.35, -radius * 0.55);
          ctx.lineTo(-radius * 1.2, 0);
          ctx.lineTo(-radius * 1.35, radius * 0.55);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(radius * 0.65, 0);
          ctx.lineTo(radius * 1.35, -radius * 0.55);
          ctx.lineTo(radius * 1.2, 0);
          ctx.lineTo(radius * 1.35, radius * 0.55);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(0, 0, radius * 0.86, 0, Math.PI * 2);
          ctx.fillStyle = fillStyle;
          ctx.fill();
          ctx.stroke();

          ctx.shadowColor = 'transparent';
          ctx.beginPath();
          ctx.arc(-radius * 0.24, -radius * 0.24, radius * 0.28, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255,255,255,0.75)';
          ctx.fill();
        } else if (shape === 'heart') {
          const s = radius * 1.05;
          ctx.beginPath();
          ctx.moveTo(0, -s * 0.3);
          ctx.bezierCurveTo(-s * 0.55, -s * 0.95, -s * 1.2, -s * 0.15, 0, s * 0.85);
          ctx.bezierCurveTo(s * 1.2, -s * 0.15, s * 0.55, -s * 0.95, 0, -s * 0.3);
          ctx.closePath();
          ctx.fillStyle = fillStyle;
          ctx.fill();
          ctx.stroke();

          ctx.shadowColor = 'transparent';
          ctx.beginPath();
          ctx.arc(-s * 0.35, -s * 0.2, s * 0.22, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255,255,255,0.65)';
          ctx.fill();
        } else if (shape === 'star') {
          const spikes = 5;
          const outerR = radius * 1.1;
          const innerR = radius * 0.52;
          ctx.beginPath();
          for (let i = 0; i < spikes * 2; i++) {
            const r = i % 2 === 0 ? outerR : innerR;
            const angle = (i * Math.PI) / spikes - Math.PI / 2;
            const px = Math.cos(angle) * r;
            const py = Math.sin(angle) * r;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fillStyle = fillStyle;
          ctx.fill();
          ctx.stroke();

          ctx.shadowColor = 'transparent';
          ctx.beginPath();
          ctx.arc(-outerR * 0.2, -outerR * 0.2, innerR * 0.38, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255,255,255,0.78)';
          ctx.fill();
        } else if (shape === 'berry') {
          const s = radius * 1.0;
          ctx.beginPath();
          ctx.moveTo(-s * 0.78, -s * 0.1);
          ctx.quadraticCurveTo(-s * 0.55, s * 0.65, 0, s * 0.92);
          ctx.quadraticCurveTo(s * 0.55, s * 0.65, s * 0.78, -s * 0.1);
          ctx.closePath();
          ctx.fillStyle = fillStyle;
          ctx.fill();
          ctx.stroke();

          ctx.shadowColor = 'transparent';
          ctx.beginPath();
          ctx.arc(-s * 0.38, -s * 0.22, s * 0.28, Math.PI * 0.8, Math.PI * 2.2);
          ctx.arc(0, -s * 0.3, s * 0.32, Math.PI * 0.9, Math.PI * 2.1);
          ctx.arc(s * 0.38, -s * 0.22, s * 0.28, Math.PI * 0.8, Math.PI * 2.2);
          ctx.closePath();
          ctx.fillStyle = '#52b8b5';
          ctx.fill();
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, radius * 0.94, 0, Math.PI * 2);
          ctx.fillStyle = fillStyle;
          ctx.fill();
          ctx.stroke();

          ctx.shadowColor = 'transparent';
          ctx.beginPath();
          ctx.arc(0, 0, radius * 0.58, 0, Math.PI * 1.35);
          ctx.strokeStyle = 'rgba(255,255,255,0.82)';
          ctx.lineWidth = 3.2;
          ctx.stroke();
        }

        // Triple candy badge overlay
        if (specialType === 'triple') {
          ctx.shadowColor = 'transparent';
          ctx.fillStyle = '#fff8d6';
          ctx.strokeStyle = '#282a24';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.roundRect(-13, -radius - 8, 26, 15, 7);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = '#d97706';
          ctx.font = 'bold 10px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('×3连', 0, -radius - 0.5);
        }

        ctx.restore();
      }

      function drawMultiplierGates(ctx) {
        for (let i = 0; i < state.multiplierGates.length; i++) {
          const g = state.multiplierGates[i];
          const bobY = g.y + Math.sin(g.phase) * 4;
          ctx.save();
          ctx.translate(g.x, bobY);

          // Outer bubble ring
          ctx.beginPath();
          ctx.arc(0, 0, g.r, 0, Math.PI * 2);
          ctx.fillStyle = g.bg;
          ctx.fill();
          ctx.lineWidth = 2.8;
          ctx.strokeStyle = g.color;
          ctx.setLineDash([5, 3]);
          ctx.stroke();
          ctx.setLineDash([]);

          // Glossy bubble shine
          ctx.beginPath();
          ctx.arc(-g.r * 0.35, -g.r * 0.35, g.r * 0.22, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255,255,255,0.75)';
          ctx.fill();

          // Multiplier text
          ctx.font = '900 15px "PingFang SC", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 3.5;
          ctx.strokeText(`×${g.mult}`, 0, 1);
          ctx.fillStyle = g.color;
          ctx.fillText(`×${g.mult}`, 0, 1);

          ctx.restore();
        }
      }

      function drawCloudBar(ctx) {
        const { x, y, width, height, bounceY, eyeOffsetX, mood } = state.cloud;
        const cy = y + bounceY;
        const halfW = width / 2;
        const halfH = height / 2;
        const isFever = state.feverTimer > 0;

        ctx.save();
        ctx.translate(x, cy);

        // Fever Rainbow Aura or Magnet Halo around cloud
        if (isFever || state.magnetTimer > 0) {
          ctx.save();
          ctx.beginPath();
          ctx.roundRect(-halfW - 6, -halfH - 6, width + 12, height + 12, 12);
          ctx.strokeStyle = isFever ? '#ec4899' : '#38bdf8';
          ctx.lineWidth = 4;
          ctx.setLineDash([8, 5]);
          ctx.stroke();
          ctx.restore();
        }

        // Shadow
        ctx.fillStyle = 'rgba(40, 42, 36, 0.14)';
        ctx.beginPath();
        ctx.roundRect(-halfW + 3, -halfH + 5, width, height, 8);
        ctx.fill();

        // Yellow-green outer border (from artwork)
        ctx.fillStyle = isFever ? '#fde047' : '#cfd428';
        ctx.strokeStyle = '#282a24';
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.roundRect(-halfW, -halfH, width, height, 6);
        ctx.fill();
        ctx.stroke();

        // White cloud body
        const cloudW = width - 16;
        const cloudH = height - 14;
        const cLeft = -cloudW / 2;
        const cRight = cloudW / 2;
        const cTop = -cloudH / 2;
        const cBot = cloudH / 2;

        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#282a24';
        ctx.lineWidth = 2.8;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        ctx.beginPath();
        const topBumps = 7;
        ctx.moveTo(cLeft + 6, 0);
        ctx.quadraticCurveTo(cLeft - 4, cTop * 0.6, cLeft + 8, cTop + 3);

        for (let i = 0; i < topBumps; i++) {
          const bx1 = cLeft + 8 + i * ((cloudW - 16) / topBumps);
          const bx2 = cLeft + 8 + (i + 1) * ((cloudW - 16) / topBumps);
          const midX = (bx1 + bx2) / 2;
          const peakY = cTop - (i % 2 === 0 ? 4 : 2);
          ctx.quadraticCurveTo(midX, peakY, bx2, cTop + 3);
        }

        ctx.quadraticCurveTo(cRight + 4, cTop * 0.6, cRight - 4, 0);
        ctx.quadraticCurveTo(cRight + 4, cBot * 0.6, cRight - 8, cBot - 3);

        for (let i = topBumps - 1; i >= 0; i--) {
          const bx1 = cLeft + 8 + i * ((cloudW - 16) / topBumps);
          const bx2 = cLeft + 8 + (i + 1) * ((cloudW - 16) / topBumps);
          const midX = (bx1 + bx2) / 2;
          const peakY = cBot + (i % 2 === 0 ? 4 : 2);
          ctx.quadraticCurveTo(midX, peakY, bx1, cBot - 3);
        }

        ctx.quadraticCurveTo(cLeft - 4, cBot * 0.6, cLeft + 6, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Cheeks
        const eyeX = cloudW * 0.25;
        const cheekX = cloudW * 0.35;

        ctx.fillStyle = '#f79ec6';
        ctx.beginPath();
        ctx.ellipse(-cheekX, 3, 9, 4.5, 0, 0, Math.PI * 2);
        ctx.ellipse(cheekX, 3, 9, 4.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Eyes (or cool sunglasses during Fever Mode!)
        ctx.strokeStyle = '#282a24';
        ctx.fillStyle = '#282a24';
        ctx.lineWidth = 3;
        if (isFever) {
          // Cool Star Sunglasses
          ctx.fillStyle = '#1e1b4b';
          ctx.fillRect(-eyeX - 10, -7, 18, 10);
          ctx.fillRect(eyeX - 8, -7, 18, 10);
          ctx.beginPath();
          ctx.moveTo(-eyeX + 8, -3);
          ctx.lineTo(eyeX - 8, -3);
          ctx.stroke();
        } else if (mood === 'joy') {
          ctx.beginPath();
          ctx.arc(-eyeX + eyeOffsetX, 0, 5.5, Math.PI * 1.1, Math.PI * 1.9);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(eyeX + eyeOffsetX, 0, 5.5, Math.PI * 1.1, Math.PI * 1.9);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.roundRect(-eyeX + eyeOffsetX - 2, -6, 4, 11, 2);
          ctx.roundRect(eyeX + eyeOffsetX - 2, -6, 4, 11, 2);
          ctx.fill();
        }

        // Mouth
        ctx.beginPath();
        if (mood === 'oops') {
          ctx.arc(0, 4, 4, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          ctx.arc(0, 1, 5.5, 0.15 * Math.PI, 0.85 * Math.PI);
          ctx.lineWidth = 2.6;
          ctx.stroke();
        }

        // Active Buff Indicator on Left of Cloud
        if (state.magnetTimer > 0 || state.windTimer > 0) {
          ctx.fillStyle = 'rgba(255,255,255,0.94)';
          ctx.strokeStyle = '#282a24';
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.roundRect(-halfW - 4, -halfH - 12, 82, 22, 11);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = state.magnetTimer > 0 ? '#d97706' : '#0284c7';
          ctx.font = 'bold 10.5px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(
            state.magnetTimer > 0 ? `🧲磁力 ${state.magnetTimer.toFixed(0)}s` : (state.windForce > 0 ? '🌬️东风吹➔' : '🌬️⬅西风吹'),
            -halfW + 37,
            -halfH + 2
          );
        }

        // Preview next candy
        if (state.nextCandy) {
          const nc = state.nextCandy;
          const bx = halfW - 20;
          const by = -halfH - 12;
          ctx.fillStyle = 'rgba(255,255,255,0.92)';
          ctx.strokeStyle = '#282a24';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.roundRect(bx - 36, by - 12, 58, 24, 12);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#555';
          ctx.font = 'bold 11px sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText('下颗', bx - 30, by + 4);
          drawCandy(ctx, bx + 10, by, 7.5, nc.colorIdx, nc.shape, nc.isRainbow, 0, 1, nc.specialType);
        }

        ctx.restore();

        // Active Candy Under Cloud
        if (state.activeCandy) {
          const ac = state.activeCandy;
          const candyR = state.layout.candyRadius * ac.scale;
          const candyX = x;
          const candyY = cy + halfH + candyR * 0.95 + 6;
          const colInfo = COLOR_COLUMNS[ac.colorIdx];

          const hoverIdx = getColumnIndexAtX(candyX);
          const isMatch = ac.specialType !== 'bomb' && (ac.isRainbow || ac.specialType === 'mystery' || ac.specialType === 'shower' || hoverIdx === ac.colorIdx);

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

          // Progress Ring around active candy
          ctx.save();
          ctx.beginPath();
          let progress = 1;
          if (state.mode === 'kids') {
            progress = Math.min(1, ac.alignTime / 0.45);
          } else {
            progress = Math.max(0, ac.timer / ac.maxTimer);
          }
          ctx.arc(candyX, candyY, candyR + 6, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
          ctx.strokeStyle = ac.specialType === 'bomb' ? '#ef4444' : (isMatch ? '#1d8f24' : colInfo.hex);
          ctx.lineWidth = 3.5;
          ctx.lineCap = 'round';
          ctx.stroke();
          ctx.restore();

          drawCandy(ctx, candyX, candyY, candyR, ac.colorIdx, ac.shape, ac.isRainbow, Math.sin(performance.now() * 0.005) * 0.12, 1, ac.specialType);

          // Indicator badge
          ctx.save();
          ctx.font = 'bold 12px sans-serif';
          ctx.textAlign = 'center';
          if (ac.specialType === 'bomb') {
            ctx.fillStyle = '#dc2626';
            ctx.fillText('💣 坏坏炸弹！快点我直接拍飞拆弹！', candyX, candyY + candyR + 18);
          } else if (ac.specialType === 'mystery') {
            ctx.fillStyle = '#d97706';
            ctx.fillText('🎁 惊喜盲盒糖（半空分裂3颗）', candyX, candyY + candyR + 18);
          } else if (ac.specialType === 'shower') {
            ctx.fillStyle = '#0284c7';
            ctx.fillText('🌧️ 七彩甘霖糖（全排7柱齐加1）', candyX, candyY + candyR + 18);
          } else if (isMatch) {
            ctx.fillStyle = '#1d8f24';
            const colFull = state.columnCounts[hoverIdx] >= TARGET_PER_TUBE;
            ctx.fillText(colFull ? '⭐ 该柱已满10颗!' : (ac.isRainbow ? '✨ 彩虹百搭糖!' : `✓ 对准${colInfo.name}`), candyX, candyY + candyR + 18);
          }
          ctx.restore();
        }
      }

      /* Draw the 7 Solid Colored Rainbow Columns (100% preserving original vibrant colors) */
      function drawRainbowColumns(ctx) {
        const cols = state.layout.columns;
        const H = state.height;

        for (let i = 0; i < cols.length; i++) {
          const colRect = cols[i];
          const colDef = COLOR_COLUMNS[i];
          const glow = state.columnHighlight[i];
          const isFull = state.columnCounts[i] >= TARGET_PER_TUBE;
          const topY = colRect.topY - glow * 6;
          const colH = H - topY;

          ctx.save();

          // 1. Column path: wavy hand-drawn top line and solid body down to H
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

          // 2. Solid Authentic Marker Color Fill!
          ctx.fillStyle = colDef.hex;
          ctx.fill();

          // 3. Hand-drawn marker stroke texture!
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

          // 4. Subtle 10-level measurement notches along inner edges of the column
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
          ctx.lineWidth = 1.6;
          for (let s = 0; s < TARGET_PER_TUBE; s++) {
            const tickY = getSlotCenterY(s);
            // Left tick
            ctx.beginPath();
            ctx.moveTo(colRect.x + 1, tickY);
            ctx.lineTo(colRect.x + ((s === 4 || s === 9) ? 7 : 4), tickY);
            ctx.stroke();
            // Right tick
            ctx.beginPath();
            ctx.moveTo(colRect.x + colRect.width - 1, tickY);
            ctx.lineTo(colRect.x + colRect.width - ((s === 4 || s === 9) ? 7 : 4), tickY);
            ctx.stroke();
          }

          // 5. Glow when cloud is hovering over this column
          if (glow > 0.05) {
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

          // 6. Dividing vertical lines between columns
          ctx.strokeStyle = 'rgba(40, 42, 36, 0.65)';
          ctx.lineWidth = 2.4;
          ctx.beginPath();
          ctx.moveTo(colRect.x, topY);
          ctx.lineTo(colRect.x, H);
          ctx.stroke();

          // Top edge line
          ctx.strokeStyle = isFull ? '#ffd700' : colDef.darkHex;
          ctx.lineWidth = isFull ? 4 : 3;
          ctx.beginPath();
          ctx.moveTo(colRect.x, topY + 2);
          ctx.lineTo(colRect.x + colRect.width, topY + 2);
          ctx.stroke();

          // 7. Column Header: Name & Progress Badge (0/10 ~ 10/10)
          const count = state.columnCounts[i];
          ctx.save();

          // Column index / Name
          ctx.font = 'bold 12px "PingFang SC", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = 'rgba(0,0,0,0.45)';
          ctx.shadowBlur = 3;
          ctx.fillText(colDef.name, colRect.centerX, topY + 20);

          // Progress Badge Pill
          const pillY = topY + 38;
          const pillW = Math.min(colRect.width * 0.85, 48);
          const pillH = 18;

          ctx.shadowColor = 'rgba(0,0,0,0.2)';
          ctx.shadowBlur = 3;
          ctx.beginPath();
          ctx.roundRect(colRect.centerX - pillW / 2, pillY - pillH / 2, pillW, pillH, 9);
          ctx.fillStyle = isFull ? '#fff8d6' : 'rgba(255, 255, 255, 0.95)';
          ctx.fill();
          ctx.strokeStyle = isFull ? '#b8860b' : '#282a24';
          ctx.lineWidth = 1.6;
          ctx.stroke();

          ctx.shadowColor = 'transparent';
          ctx.font = `bold ${isFull ? 11 : 10.5}px monospace`;
          ctx.fillStyle = isFull ? '#b8860b' : '#282a24';
          ctx.textBaseline = 'middle';
          ctx.fillText(isFull ? '10 满⭐' : `${count}/10`, colRect.centerX, pillY);
          ctx.restore();

          // 8. Candies inside the column: exactly 10 slots stacked from bottom to top!
          const stack = state.columnStacks[i];
          for (let sIdx = 0; sIdx < stack.length; sIdx++) {
            const sc = stack[sIdx];
            const sy = getSlotCenterY(sIdx);
            drawCandy(ctx, colRect.centerX, sy, sc.radius || state.layout.candyRadius, sc.colorIdx, sc.shape, sc.isRainbow, sc.rotation, sc.squish || 1);
          }

          // 9. Frost overlay if column is frozen
          if (state.columnFrozen[i] > 0) {
            ctx.save();
            ctx.fillStyle = 'rgba(186, 230, 253, 0.58)';
            ctx.strokeStyle = '#0284c7';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.roundRect(colRect.x + 3, topY + 2, colRect.width - 6, 48, 8);
            ctx.fill();
            ctx.stroke();
            ctx.font = 'bold 12px sans-serif';
            ctx.fillStyle = '#0369a1';
            ctx.textAlign = 'center';
            ctx.fillText('❄️点我破冰', colRect.centerX, topY + 28);
            ctx.restore();
          }

          // 10. Mischievous Caterpillar Bug on column rim
          const bug = state.columnBugs[i];
          if (bug) {
            const bx = colRect.centerX + Math.sin(bug.phase) * 5;
            const by = topY - 4;
            ctx.save();
            ctx.translate(bx, by);
            // Caterpillar segments
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
            ctx.font = 'bold 10px sans-serif';
            ctx.fillStyle = '#b91c1c';
            ctx.textAlign = 'center';
            ctx.fillText('🐛点我!', 0, -13);
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

        // Floating Scores and Texts
        for (let i = 0; i < state.floatingTexts.length; i++) {
          const ft = state.floatingTexts[i];
          ctx.save();
          ctx.globalAlpha = ft.alpha;
          ctx.font = `900 ${Math.round(15 * ft.scale)}px "PingFang SC", "Microsoft YaHei", sans-serif`;
          ctx.textAlign = 'center';
          ctx.lineWidth = 4;
          ctx.strokeStyle = '#282a24';
          ctx.strokeText(ft.text, ft.x, ft.y);
          ctx.fillStyle = ft.color;
          ctx.fillText(ft.text, ft.x, ft.y);
          ctx.restore();
        }

        ctx.restore();
      }

      /* ---------------- Direct Intuitive Touch, Click & Keyboard Controls ---------------- */

      function getCanvasX(clientX) {
        return clientX - canvas.getBoundingClientRect().left;
      }

      function getCanvasY(clientY) {
        return clientY - canvas.getBoundingClientRect().top;
      }

      function trySwatInteractiveTargets(px, py) {
        // 1. Check click on Top 6 Hand-drawn Magic Icons
        for (let i = 0; i < state.topIconPos.length; i++) {
          const pos = state.topIconPos[i];
          if (Math.hypot(px - pos.x, py - pos.y) <= pos.r + 10) {
            if (state.topIconCharge[i] >= 100) {
              activateTopIcon(i);
              return true;
            } else {
              state.topIconBounce[i] = 8;
              sfx.playTone(440 + i * 50, 0.12);
              addFloatingText(pos.x, pos.y + 20, `⚡ 能量 ${Math.floor(state.topIconCharge[i])}% (满100%可放大招)`, '#4f5d75', 0.95);
              return true;
            }
          }
        }

        // 2. Check swatting a falling Bomb in mid-air!
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

        // 3. Check swatting an active Bomb held under the cloud!
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

        // 4. Check clicking on a Caterpillar Bug or Frozen Column Rim
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

        // Quick tap: intuitive drop or column alignment
        if (elapsed < 300 && moved < 16) {
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

      // Keyboard support for desktop players
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
          // If holding a bomb, Space/Enter swats it into a Rainbow Star!
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

      // UI Modals
      const modeModal = document.getElementById('mode-modal');
      const artModal = document.getElementById('art-modal');
      const victoryModal = document.getElementById('victory-modal');
      const stickerModal = document.getElementById('sticker-modal');

      const MODE_NAMES = {
        classic: '奇幻魔法版',
        rain: '刺激挑战版',
        kids: '轻松宝宝玩'
      };
      const MODE_SHORT_NAMES = {
        classic: '奇幻',
        rain: '挑战',
        kids: '宝宝'
      };

      function setGameMode(newMode) {
        state.mode = newMode;
        const longEl = document.getElementById('mode-label-long');
        const shortEl = document.getElementById('mode-label-short');
        if (longEl) longEl.textContent = MODE_NAMES[newMode] || '奇幻魔法版';
        if (shortEl) shortEl.textContent = MODE_SHORT_NAMES[newMode] || '奇幻';
        document.querySelectorAll('.mode-item').forEach((el) => {
          el.classList.toggle('selected', el.dataset.mode === newMode);
        });
        if (newMode === 'kids') {
          state.columnBugs = [null, null, null, null, null, null, null];
          state.columnFrozen = [0, 0, 0, 0, 0, 0, 0];
          state.windForce = 0;
        }
        state.activeCandy = null;
        spawnNextCandyOnCloud();
      }

      document.getElementById('btn-mode').addEventListener('click', () => modeModal.classList.add('open'));
      document.getElementById('close-mode-modal').addEventListener('click', () => modeModal.classList.remove('open'));
      document.getElementById('btn-start-play').addEventListener('click', () => modeModal.classList.remove('open'));

      document.querySelectorAll('.mode-item').forEach((item) => {
        item.addEventListener('click', () => setGameMode(item.dataset.mode));
      });

      document.getElementById('btn-reset-game').addEventListener('click', () => {
        resetGame();
        modeModal.classList.remove('open');
      });

      document.getElementById('btn-quick-reset').addEventListener('click', () => {
        resetGame();
      });

      document.getElementById('btn-win-replay').addEventListener('click', () => {
        resetGame();
      });

      document.getElementById('btn-art').addEventListener('click', () => artModal.classList.add('open'));
      document.getElementById('btn-win-art').addEventListener('click', () => {
        victoryModal.classList.remove('open');
        artModal.classList.add('open');
      });
      document.getElementById('close-art-modal').addEventListener('click', () => artModal.classList.remove('open'));

      // Sticker Book Modal events
      document.getElementById('btn-stickers').addEventListener('click', () => {
        renderStickerModal();
        stickerModal.classList.add('open');
      });
      document.getElementById('btn-win-stickers').addEventListener('click', () => {
        victoryModal.classList.remove('open');
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

      const btnSound = document.getElementById('btn-sound');
      btnSound.addEventListener('click', () => {
        sfx.enabled = !sfx.enabled;
        btnSound.textContent = sfx.enabled ? '🔊' : '🔇';
        if (sfx.enabled) sfx.playTone(440, 0.15);
      });

      loadStickers();
      window.addEventListener('resize', computeLayout);
      computeLayout();
      if (state.layout.columns[2]) {
        state.cloud.x = state.layout.columns[2].centerX;
        state.cloud.targetX = state.cloud.x;
      }
      spawnNextCandyOnCloud();
      spawnMultiplierGate();
      updateHUD();

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
