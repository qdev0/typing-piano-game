// game.js
(function () {
  /**********************************************************
   * 1. AUDIO
   **********************************************************/
  let audioCtx = null;

  function ensureAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
  }

  function playNote(noteName, durationSeconds = 0.35) {
    ensureAudioContext();
    const freq = NOTE_FREQUENCIES[noteName] || 440;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.value = freq;

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    const now = audioCtx.currentTime;
    gainNode.gain.setValueAtTime(0.18, now);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + durationSeconds);

    osc.start(now);
    osc.stop(now + durationSeconds + 0.05);
  }

  /**********************************************************
   * 2. DOM + STATE
   **********************************************************/
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  const scoreDisplay = document.getElementById("scoreDisplay");
  const missDisplay = document.getElementById("missDisplay");
  const speedDisplay = document.getElementById("speedDisplay");
  const maxComboDisplay = document.getElementById("maxComboDisplay");
  const typingTextEl = document.getElementById("typingText");
  const levelSelect = document.getElementById("levelSelect");
  const startBtn = document.getElementById("startBtn");
  const pauseBtn = document.getElementById("pauseBtn");
  const judgementLabel = document.getElementById("judgementLabel");
  const comboLabel = document.getElementById("comboLabel");

  const tileWidth = 150;
  const tileHeight = 40;
  const bottomLineY = canvas.height - 40;
  const laneCount = 4;
  const MAX_STACK_HEIGHT = 6;

  // Game state
  let currentLevel = LEVELS[0];
  let startTime = null;
  let paused = false;
  let pauseOffset = 0;
  let pauseStartTime = null;

  let activeTiles = [];
  let remainingTiles = [];
  let score = 0;
  let misses = 0;
  let combo = 0;
  let maxCombo = 0;
  let lastGameTime = 0;

  let laneMissStacks = new Array(laneCount).fill(0);

  let gameOver = false;
  let gameOverTime = 0;

  let confettiPieces = [];
  let currentInput = "";

  let animationFrameId = null;

  /**********************************************************
   * 3. INITIALIZATION
   **********************************************************/
  function populateLevelSelect() {
    LEVELS.forEach((level, index) => {
      const opt = document.createElement("option");
      opt.value = level.id;
      opt.textContent = level.name;
      if (index === 0) opt.selected = true;
      levelSelect.appendChild(opt);
    });
  }

  function setJudgement(text, color) {
    judgementLabel.textContent = text;
    judgementLabel.style.color = color || "#e5e7eb";
  }

  function updateTypingDisplay() {
    typingTextEl.textContent = currentInput;
  }

  function updateStatusDisplays() {
    scoreDisplay.textContent = score;
    missDisplay.textContent = misses;
    comboLabel.textContent = `Combo: ${combo}x`;
    maxComboDisplay.textContent = `${maxCombo}x`;
  }

  function resetGame(level) {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }

    currentLevel = level || currentLevel;
    startTime = null;
    paused = false;
    pauseOffset = 0;
    pauseStartTime = null;
    lastGameTime = 0;

    activeTiles = [];
    remainingTiles = currentLevel.tiles
      .map((t) => ({ ...t, spawned: false }))
      .sort((a, b) => a.time - b.time);

    score = 0;
    misses = 0;
    combo = 0;
    maxCombo = 0;
    laneMissStacks = new Array(laneCount).fill(0);
    gameOver = false;
    gameOverTime = 0;
    confettiPieces = [];
    currentInput = "";

    speedDisplay.textContent =
      currentLevel.fallDuration <= 3
        ? "Fast"
        : currentLevel.fallDuration >= 4.5
        ? "Slow"
        : "Normal";

    updateTypingDisplay();
    updateStatusDisplays();
    setJudgement("Ready", "#e5e7eb");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFrame(0);
  }

  populateLevelSelect();
  resetGame(LEVELS[0]);

  /**********************************************************
   * 4. GAME LOOP / TILES
   **********************************************************/
  function getGameTimeSeconds(timestamp) {
    if (startTime === null) return 0;
    return (timestamp - startTime - pauseOffset) / 1000;
  }

  function spawnTiles(gameTime) {
    while (
      !gameOver &&
      remainingTiles.length > 0 &&
      remainingTiles[0].time <= gameTime
    ) {
      const base = remainingTiles.shift();
      const laneIndex = activeTiles.length % laneCount;
      const laneWidth = canvas.width / laneCount;
      const x = laneIndex * laneWidth + (laneWidth - tileWidth) / 2;

      activeTiles.push({
        word: base.word,
        note: base.note,
        spawnTime: gameTime,
        x,
        y: -tileHeight,
        laneIndex,
        hit: false,
        missed: false,
        state: "falling", // "falling" | "hitPopping" | "missedStatic" | "done"
        effectProgress: 0,
      });
    }
  }

  function triggerGameOver() {
    if (gameOver) return;
    gameOver = true;
    gameOverTime = lastGameTime;
    combo = 0;
    setJudgement("Game Over", "#f97373");
    updateStatusDisplays();
  }

  function handleMiss(tile) {
    if (tile.missed) return;

    tile.missed = true;
    tile.state = "missedStatic";

    const laneIndex = tile.laneIndex;
    const stackIndex = laneMissStacks[laneIndex];
    laneMissStacks[laneIndex] = stackIndex + 1;

    tile.y = bottomLineY - tileHeight * (stackIndex + 1);

    misses += 1;
    combo = 0;
    setJudgement("Miss", "#f97373");
    updateStatusDisplays();
    
    if (misses >= 5) {
        triggerGameOver();
    }

  }

  function updateTiles(gameTime, delta) {
  const duration = currentLevel.fallDuration;

  activeTiles.forEach((tile) => {
    if (tile.state === "falling") {
      const t = Math.max(
        0,
        Math.min(1, (gameTime - tile.spawnTime) / duration)
      );

      // Move from top to just touching the bottom line
      tile.y = t * (bottomLineY - tileHeight);

      // MISS: as soon as the tile's bottom reaches the line
      if (!tile.hit && !tile.missed && tile.y + tileHeight >= bottomLineY) {
        handleMiss(tile);
      }
    } else if (tile.state === "hitPopping") {
      tile.effectProgress += delta;
      const p = Math.min(tile.effectProgress / 0.4, 1);
      tile.y -= delta * 40; // small pop upwards
      if (p >= 1) {
        tile.state = "done";
      }
    }
    // "missedStatic" tiles stay in place as stacked red blocks
  });

  // Remove tiles whose pop animation is finished
  activeTiles = activeTiles.filter((tile) => tile.state !== "done");
}


  /**********************************************************
   * 5. CONFETTI
   **********************************************************/
  function spawnConfetti(x, y, count = 22) {
    const colors = [
      [244, 63, 94],
      [59, 130, 246],
      [234, 179, 8],
      [16, 185, 129],
    ];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 160 + Math.random() * 140;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed - 60;
      const size = 4 + Math.random() * 4;
      const ttl = 0.6 + Math.random() * 0.4;
      const color = colors[Math.floor(Math.random() * colors.length)];

      confettiPieces.push({
        x,
        y,
        vx,
        vy,
        size,
        ttl,
        life: 0,
        color,
        rotation: Math.random() * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 8,
      });
    }
  }

  function updateConfetti(delta) {
    const gravity = 400;
    confettiPieces.forEach((p) => {
      p.life += delta;
      p.x += p.vx * delta;
      p.y += p.vy * delta;
      p.vy += gravity * delta;
      p.rotation += p.rotationSpeed * delta;
    });
    confettiPieces = confettiPieces.filter((p) => p.life < p.ttl);
  }

  /**********************************************************
   * 6. RENDER
   **********************************************************/
  function drawFrame(gameTime) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();

    // Screen shake when game over
    if (gameOver) {
      const t = Math.max(0, lastGameTime - gameOverTime);
      const shakeDuration = 0.5;
      if (t < shakeDuration) {
        const intensity = (1 - t / shakeDuration) * 8;
        const shakeX = (Math.random() * 2 - 1) * intensity;
        const shakeY = (Math.random() * 2 - 1) * intensity;
        ctx.translate(shakeX, shakeY);
      }
    }

    // Background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#020617");
    gradient.addColorStop(1, "#020617");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Bottom line
    ctx.strokeStyle = "#4b5563";
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(0, bottomLineY);
    ctx.lineTo(canvas.width, bottomLineY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Tiles
    activeTiles.forEach((tile) => {
      let baseColor = [34, 197, 94]; // green
      let fillAlpha = 0.2;
      let borderAlpha = 0.7;

      if (tile.missed && !tile.hit) {
        baseColor = [239, 68, 68]; // red
        fillAlpha = 0.45;
        borderAlpha = 0.95;
      } else if (tile.hit) {
        baseColor = [34, 197, 94];
        fillAlpha = 0.4;
        borderAlpha = 0.95;
      }

      let scale = 1;
      let fadeAlpha = 1;

      if (tile.state === "hitPopping") {
        const p = Math.min(tile.effectProgress / 0.4, 1);
        scale = 1 + 0.4 * p;
        fadeAlpha = 1 - p;
      }

      const x = tile.x;
      const y = tile.y;
      const w = tileWidth;
      const h = tileHeight;
      const centerX = x + w / 2;
      const centerY = y + h / 2;
      const radius = 10;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(scale, scale);
      ctx.translate(-centerX, -centerY);

      ctx.fillStyle = `rgba(${baseColor[0]}, ${baseColor[1]}, ${
        baseColor[2]
      }, ${fillAlpha * fadeAlpha})`;
      ctx.strokeStyle = `rgba(${baseColor[0]}, ${baseColor[1]}, ${
        baseColor[2]
      }, ${borderAlpha * fadeAlpha})`;
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + w - radius, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
      ctx.lineTo(x + w, y + h - radius);
      ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
      ctx.lineTo(x + radius, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#e5e7eb";
      ctx.font = "bold 16px system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(tile.word, x + w / 2, y + h / 2);

      ctx.restore();
    });

    // Confetti
    confettiPieces.forEach((p) => {
      const alpha = 1 - p.life / p.ttl;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = `rgba(${p.color[0]}, ${p.color[1]}, ${
        p.color[2]
      }, ${alpha})`;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    });

    // Game over overlay
    if (gameOver) {
      const t = Math.max(0, lastGameTime - gameOverTime);
      const maxAlpha = 0.65;
      const alpha = Math.min(maxAlpha, 0.3 + t * 0.5);
      ctx.fillStyle = `rgba(239,68,68,${alpha})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "rgba(15,23,42,0.9)";
      ctx.font = "bold 36px system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 10);

      ctx.font = "16px system-ui";
      ctx.fillStyle = "rgba(249,250,251,0.9)";
      ctx.fillText(
        "Press Start to try again",
        canvas.width / 2,
        canvas.height / 2 + 22
      );
    }

    ctx.restore();
  }

  function gameLoop(timestamp) {
    if (paused) {
      animationFrameId = requestAnimationFrame(gameLoop);
      return;
    }

    if (startTime === null) {
      startTime = timestamp;
      lastGameTime = 0;
    }

    const gameTime = getGameTimeSeconds(timestamp);
    const delta = Math.max(0, gameTime - lastGameTime);
    lastGameTime = gameTime;

    if (!gameOver) {
      spawnTiles(gameTime);
      updateTiles(gameTime, delta);
    }

    updateConfetti(delta);
    drawFrame(gameTime);

    animationFrameId = requestAnimationFrame(gameLoop);
  }

  /**********************************************************
   * 7. INPUT & SCORING
   **********************************************************/
  function submitInput() {
    if (gameOver) {
      setJudgement("Game Over", "#f97373");
      return;
    }

    const word = currentInput.trim().toLowerCase();
    if (!word) return;
    currentInput = "";
    updateTypingDisplay();

    let bestTile = null;
    let bestDist = Infinity;

    activeTiles.forEach((tile) => {
      if (tile.hit || tile.missed || tile.state !== "falling") return;
      if (tile.word.toLowerCase() !== word) return;
      const dist = Math.abs(tile.y + tileHeight - bottomLineY);
      if (dist < bestDist) {
        bestDist = dist;
        bestTile = tile;
      }
    });

    if (bestTile) {
      // Judgement windows
      let judgement = "Good";
      let basePoints = 50;
      let color = "#fde68a";

      if (bestDist <= 10) {
        judgement = "Perfect";
        basePoints = 100;
        color = "#4ade80";
      } else if (bestDist <= 25) {
        judgement = "Great";
        basePoints = 70;
        color = "#a5b4fc";
      } else if (bestDist > 45) {
        judgement = "Late";
        basePoints = 30;
        color = "#fbbf24";
      }

      bestTile.hit = true;
      bestTile.state = "hitPopping";
      bestTile.effectProgress = 0;

      combo += 1;
      if (combo > maxCombo) maxCombo = combo;

      const multiplier = 1 + (combo - 1) * 0.1;
      const gained = Math.round(basePoints * multiplier);
      score += gained;

      setJudgement(`${judgement} (+${gained})`, color);
      playNote(bestTile.note);
      spawnConfetti(
        bestTile.x + tileWidth / 2,
        bestTile.y + tileHeight / 2,
        22
      );
      updateStatusDisplays();
    } else {
      setJudgement("No match", "#9ca3af");
    }
  }

  window.addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    if (e.key === "Backspace") {
      e.preventDefault();
      currentInput = currentInput.slice(0, -1);
      updateTypingDisplay();
      return;
    }

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      submitInput();
      return;
    }

    if (e.key.length === 1) {
      currentInput += e.key;
      updateTypingDisplay();
    }
  });

  /**********************************************************
   * 8. BUTTONS
   **********************************************************/
  startBtn.addEventListener("click", () => {
    ensureAudioContext();
    resetGame(currentLevel);
    animationFrameId = requestAnimationFrame(gameLoop);
  });

  pauseBtn.addEventListener("click", () => {
    if (!startTime) return;

    if (!paused) {
      paused = true;
      pauseStartTime = performance.now();
      pauseBtn.textContent = "Resume";
    } else {
      paused = false;
      if (pauseStartTime !== null) {
        const now = performance.now();
        pauseOffset += now - pauseStartTime;
      }
      pauseStartTime = null;
      pauseBtn.textContent = "Pause";
    }
  });

  levelSelect.addEventListener("change", (e) => {
    const id = e.target.value;
    const level = LEVELS.find((l) => l.id === id);
    if (level) {
      resetGame(level);
    }
  });
})();
