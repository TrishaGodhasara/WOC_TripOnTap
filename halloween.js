/* =========================================================
   HALLOWEEN THEME ENGINE — TripOnTap "Haunted Travels"
   Vanilla JS, no dependencies.
   Features:
     1. requestAnimationFrame particle system (bats + ghosts)
     2. Canvas-based glowing cursor trail (desktop only)
     3. IntersectionObserver scroll-reveal
     4. Procedural ambient audio (Web Audio API oscillators)
        toggled by a floating "Spooky Mode" button
     5. SVG spiderweb corner decorations injected at runtime
     6. Random flicker class applied to section headings
   ========================================================= */
(function () {
  "use strict";

  /* ---------------- helpers ---------------- */
  const rand = (min, max) => Math.random() * (max - min) + min;
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------------- inject decorative DOM ---------------- */
  function injectDecor() {
    const bgCanvas = document.createElement("canvas");
    bgCanvas.id = "hw-canvas";
    document.body.appendChild(bgCanvas);

    let cursorCanvas = null;
    if (window.matchMedia("(pointer: fine)").matches) {
      cursorCanvas = document.createElement("canvas");
      cursorCanvas.id = "hw-cursor-canvas";
      document.body.appendChild(cursorCanvas);
    }

    const webSVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g stroke="rgba(236,227,255,0.55)" stroke-width="1" fill="none">
        <path d="M0,0 L100,100 M0,0 L60,0 M0,0 L0,60 M0,0 L100,30 M0,0 L30,100"/>
        <path d="M0,0 Q15,15 8,30"/>
        <path d="M0,0 Q25,20 22,45"/>
        <path d="M0,0 Q40,28 40,60"/>
        <path d="M0,0 Q15,45 35,55"/>
        <path d="M8,30 Q20,35 22,45"/>
        <path d="M22,45 Q32,50 40,60"/>
      </g>
    </svg>`;
    const webTL = document.createElement("div");
    webTL.className = "hw-web tl";
    webTL.innerHTML = webSVG;
    const webTR = document.createElement("div");
    webTR.className = "hw-web tr";
    webTR.innerHTML = webSVG;
    document.body.appendChild(webTL);
    document.body.appendChild(webTR);

    return { bgCanvas, cursorCanvas };
  }

  /* ---------------- background particles ---------------- */
  function startParticles(canvas) {
    const ctx = canvas.getContext("2d");
    let w, h, dpr;

    function resize() {
      dpr = window.devicePixelRatio || 1;
      w = canvas.width = innerWidth * dpr;
      h = canvas.height = innerHeight * dpr;
      canvas.style.width = innerWidth + "px";
      canvas.style.height = innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    const COUNT = prefersReducedMotion ? 0 : innerWidth < 700 ? 8 : 16;
    const kinds = ["bat", "ghost", "leaf"];

    function makeParticle() {
      const kind = kinds[Math.floor(rand(0, kinds.length))];
      return {
        kind,
        x: rand(0, innerWidth),
        y: rand(0, innerHeight),
        size: kind === "ghost" ? rand(18, 30) : rand(10, 20),
        speedX: rand(-0.3, 0.3) * (kind === "leaf" ? 1.4 : 1),
        speedY: kind === "ghost" ? rand(-0.15, 0.15) : rand(0.15, 0.5),
        wobble: rand(0, Math.PI * 2),
        wobbleSpeed: rand(0.01, 0.03),
        opacity: rand(0.35, 0.85),
      };
    }

    const particles = Array.from({ length: COUNT }, makeParticle);

    function drawBat(p) {
      const flap = Math.sin(p.wobble) * 6;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.globalAlpha = p.opacity;
      ctx.font = `${p.size}px serif`;
      ctx.fillText("🦇", -p.size / 2, flap);
      ctx.restore();
    }
    function drawGhost(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.globalAlpha = p.opacity * (0.6 + 0.4 * Math.sin(p.wobble));
      ctx.font = `${p.size}px serif`;
      ctx.fillText("👻", -p.size / 2, 0);
      ctx.restore();
    }
    function drawLeaf(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.globalAlpha = p.opacity;
      ctx.font = `${p.size}px serif`;
      ctx.fillText("🍂", -p.size / 2, 0);
      ctx.restore();
    }

    function tick() {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      particles.forEach((p) => {
        p.wobble += p.wobbleSpeed;
        p.x += p.speedX + Math.sin(p.wobble) * 0.4;
        p.y += p.speedY;

        if (p.y > innerHeight + 30) {
          p.y = -30;
          p.x = rand(0, innerWidth);
        }
        if (p.x > innerWidth + 30) p.x = -30;
        if (p.x < -30) p.x = innerWidth + 30;

        if (p.kind === "bat") drawBat(p);
        else if (p.kind === "ghost") drawGhost(p);
        else drawLeaf(p);
      });
      requestAnimationFrame(tick);
    }
    if (!prefersReducedMotion) requestAnimationFrame(tick);
  }

  /* ---------------- cursor trail ---------------- */
  function startCursorTrail(canvas) {
    if (!canvas || prefersReducedMotion) return;
    const ctx = canvas.getContext("2d");

    function resize() {
      canvas.width = innerWidth;
      canvas.height = innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const trail = [];
    const MAX = 18;

    window.addEventListener("mousemove", (e) => {
      trail.push({ x: e.clientX, y: e.clientY, life: 1 });
      if (trail.length > MAX) trail.shift();
    });

    function tick() {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      for (let i = 0; i < trail.length; i++) {
        const p = trail[i];
        const t = i / trail.length;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6 * t + 1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,${117 + 80 * t},24,${0.35 * t})`;
        ctx.shadowColor = "rgba(57,255,20,0.6)";
        ctx.shadowBlur = 8 * t;
        ctx.fill();
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---------------- scroll reveal ---------------- */
  function startScrollReveal() {
    const targets = document.querySelectorAll(
      ".card, .package-card, .review-card, .trip-card, .highlight-card, .info-section, .highlight-box"
    );
    if (!targets.length) return;

    targets.forEach((el) => el.classList.add("hw-reveal"));

    if (!("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("hw-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, idx) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("hw-visible");
            }, idx * 60);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    targets.forEach((el) => io.observe(el));
  }

  /* ---------------- random flicker on headings ---------------- */
  function startFlicker() {
    const headings = document.querySelectorAll("h1, .section-title");
    headings.forEach((h) => {
      if (Math.random() < 0.6) h.classList.add("hw-flicker");
    });
  }

  /* ---------------- procedural ambient audio ---------------- */
  let audioCtx, droneNodes, masterGain, running = false;

  function startAmbience() {
    if (running) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.0;
    masterGain.connect(audioCtx.destination);
    masterGain.gain.linearRampToValueAtTime(
      0.05,
      audioCtx.currentTime + 1.5
    );

    droneNodes = [];
    [55, 110, 56.5].forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      osc.type = i === 2 ? "sawtooth" : "sine";
      osc.frequency.value = freq;
      const gain = audioCtx.createGain();
      gain.gain.value = i === 0 ? 0.6 : 0.2;
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start();
      droneNodes.push(osc);
    });

    scheduleCreak();
    running = true;
  }

  function scheduleCreak() {
    const delay = rand(4000, 9000);
    setTimeout(() => {
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(rand(180, 260), audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(
        rand(60, 100),
        audioCtx.currentTime + 0.8
      );
      gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.06, audioCtx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        audioCtx.currentTime + 0.9
      );
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start();
      osc.stop(audioCtx.currentTime + 1);
      if (running) scheduleCreak();
    }, delay);
  }

  function stopAmbience() {
    if (!audioCtx) return;
    const ctx = audioCtx;
    const g = masterGain;
    running = false;
    g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
    setTimeout(() => {
      droneNodes && droneNodes.forEach((o) => o.stop());
      ctx.close();
      audioCtx = undefined;
    }, 900);
  }

  /* ---------------- dark / light theme ---------------- */
  function initTheme() {
    const root = document.documentElement;
    const saved = localStorage.getItem("hw-theme");
    const theme = saved === "light" ? "light" : "dark";
    if (theme === "light") root.setAttribute("data-hw-theme", "light");
    return theme;
  }

  function injectThemeToggle(initialTheme) {
    const btn = document.createElement("button");
    btn.id = "hw-theme-toggle";
    btn.type = "button";
    let theme = initialTheme;
    const setIcon = () => {
      btn.textContent = theme === "light" ? "🌙" : "☀️";
      btn.setAttribute(
        "aria-label",
        theme === "light" ? "Switch to dark theme" : "Switch to light theme"
      );
    };
    setIcon();

    btn.addEventListener("click", () => {
      theme = theme === "light" ? "dark" : "light";
      if (theme === "light") {
        document.documentElement.setAttribute("data-hw-theme", "light");
      } else {
        document.documentElement.removeAttribute("data-hw-theme");
      }
      localStorage.setItem("hw-theme", theme);
      setIcon();
    });

    return btn;
  }

  /* ---------------- spooky mode toggle ---------------- */
  function injectToggle() {
    const btn = document.createElement("button");
    btn.id = "hw-toggle";
    btn.type = "button";
    btn.setAttribute("aria-label", "Toggle spooky mode");
    btn.textContent = "🎃";

    let active = false;
    btn.addEventListener("click", () => {
      active = !active;
      document.body.classList.toggle("hw-spooky", active);
      btn.textContent = active ? "👻" : "🎃";
      if (active) {
        startAmbience();
      } else {
        stopAmbience();
      }
    });
    return btn;
  }

  /* ---------------- init ---------------- */
  document.addEventListener("DOMContentLoaded", function () {
    const theme = initTheme();
    const { bgCanvas, cursorCanvas } = injectDecor();
    startParticles(bgCanvas);
    startCursorTrail(cursorCanvas);
    startScrollReveal();
    startFlicker();

    const panel = document.createElement("div");
    panel.id = "hw-controls";
    panel.appendChild(injectThemeToggle(theme));
    panel.appendChild(injectToggle());
    document.body.appendChild(panel);

    if (typeof window.initDestinationsToolbar === "function") {
      window.initDestinationsToolbar();
    }
  });
})();
