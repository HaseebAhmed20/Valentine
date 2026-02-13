const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const state = {
  started: false,
  typingStarted: false,
  reduceMotion: window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
};

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function setupReveal() {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) e.target.classList.add('is-in');
      }
    },
    { threshold: 0.18 }
  );

  $$('.reveal').forEach((el) => io.observe(el));
}

function setupDotsNav() {
  const dots = $$('.dot');
  const sections = dots.map((d) => $('#' + d.dataset.to));

  dots.forEach((d) => {
    d.addEventListener('click', () => {
      const target = $('#' + d.dataset.to);
      if (!target) return;
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        .slice(0, 1)
        .forEach((entry) => {
          const idx = sections.indexOf(entry.target);
          if (idx >= 0) {
            dots.forEach((x) => x.classList.remove('is-active'));
            dots[idx].classList.add('is-active');
          }
        });
    },
    { threshold: [0.35, 0.55, 0.7] }
  );

  sections.forEach((s) => s && io.observe(s));
}

async function typeLetter() {
  const target = $('#typed');
  if (!target || state.typingStarted) return;
  state.typingStarted = true;

  const text =
    "Meri Ladli or sbb se Paari Naib💕,\n\n" +
    "There are days when words feel small,\n" +
    "and then there are days like this \n" +
    "when my heart refuses to stay quiet.\n\n" +
    "This Valentine's Day, I don't want to celebrate love the way the world does.\n" +
    "I want to celebrate it the way I feel it — slowly, deeply, honestly… with you My Love 😃💖.\n\n" +
    "You are not just someone I love.\n" +
    "You are the calm after noise, You are the Sakoon of my life ❤️the thought that stays every time every second 🙃.\n" +
    "Tum woh ehsaas ho jo bina awaaz ke bhi dil tak pohanch jata hai or kabhii bhii nikalta nae🥺.\n\n" +
    "Everyone says love is vanished and slowly fadesout with the passage of time but I promise you that I will never do it The love of mine for you never be that way 🥺 ,\n" +
    "It will always increasing day by day second by second 🙃❤️ if you ever feel my love is not the way it is before You can do anything like Maar sktii Gussa krr sktii Murghaa bnaa sktiii Lekinnn Chornay kaa Door janay ka option nhi ho ga kabhi bhiiiiiiiiiii Huhhhhhh. Kuch le day ke maamla settle krr liyaa krein gy 😁😁\n\n" +
    "\"Kisi ko chahna asaan hota hai,\n" +
    "magar kisi ka ho jana  woh naseeb hota hai.\"\n" +
    "And if I believe in fate at all, it's because you exist.\n\n" +
    "\"Orr kissi ko chahnaa bbht asaan hota hai lekin chahtay rehnaa bhtt mushqil😏 Hrr koi paglu to nhii hota naa 👀👀\"\n\n" +
    "I won't promise a perfect life.\n" +
    "But I promise a real one.\n" +
    "A life where I choose you \n" +
    "on easy days, and especially on the hard ones. My Princess❤️ My Shehzadi💙 Meri Ikloti Dill ki Malikan 💞\n" +
    "Where distance doesn't weaken love,\n" +
    "and time only teaches us how to hold it better and increasing Infatuation .\n\n" +
    "So today, with nothing but honesty and all my heart,\n" +
    "I ask you this \n" +
    "not as a moment, but as a future:\n\n" +
    "Will you be mine My Paroo 🥺?\n" +
    "Not just for Valentine's Day,\n" +
    "but for every ordinary day that becomes beautiful because we share it and for the rest of my life 🫠.\n\n" +
    "\"Tum mere paas raho \n" +
    "bas itna sa khawab kaafi hai orr yhii merii sbb se brii khushi haii .\"\n\n" +
    "Happy Valentine's Day, My Infatutaion💞 My Beautiful Endless Love Meri orr sirf Merii Naib🥺❤️.\n" +
    "Always you. Always us.";

  const baseDelay = state.reduceMotion ? 0 : 22;
  const pause = (ms) => new Promise((r) => setTimeout(r, ms));

  target.textContent = '';

  for (let i = 0; i < text.length; i++) {
    target.textContent += text[i];

    const ch = text[i];
    if (state.reduceMotion) continue;

    if (ch === '\n') {
      await pause(160);
      continue;
    }

    const jitter = Math.random() * 22;
    const slow = ch === '.' || ch === ',' ? 120 : ch === '—' ? 160 : 0;
    await pause(baseDelay + jitter + slow);
  }
}

function setupLetterTrigger() {
  const letterScene = $('#scene-letter');
  if (!letterScene) return;

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) typeLetter();
      }
    },
    { threshold: 0.35 }
  );

  io.observe(letterScene);
}

function setupButtons() {
  const begin = $('#begin');
  begin?.addEventListener('click', () => {
    $('#scene-letter')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  const replay = $('#replay');
  replay?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    state.typingStarted = false;
    const typed = $('#typed');
    if (typed) typed.textContent = '';

    if (!state.reduceMotion) {
      const hp = $('#heartPath');
      if (hp) {
        hp.style.animation = 'none';
        hp.getBoundingClientRect();
        hp.style.animation = '';
      }

      const fill = document.querySelector('.sigil__fill');
      if (fill) {
        fill.style.animation = 'none';
        fill.getBoundingClientRect();
        fill.style.animation = '';
      }
    }
  });
}

function setupAudio() {
  const btn = $('#audioToggle');
  const audio = $('#music');
  if (!btn || !audio) return;

  const setPressed = (on) => {
    btn.setAttribute('aria-pressed', String(!!on));
  };

  audio.volume = 0.65;
  audio.muted = true;

  const tryStartMuted = () => {
    if (state.reduceMotion) return;
    audio.muted = true;
    const p = audio.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  };

  tryStartMuted();

  btn.addEventListener('click', async () => {
    const on = btn.getAttribute('aria-pressed') === 'true';

    if (on) {
      audio.muted = true;
      audio.pause();
      setPressed(false);
      return;
    }

    try {
      audio.muted = false;
      await audio.play();
      setPressed(true);
    } catch {
      audio.muted = true;
      setPressed(false);
    }
  });
}

function setupCanvasCinema() {
  const canvas = $('#cinema');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });

  const DPR = Math.min(2, window.devicePixelRatio || 1);
  let w = 0;
  let h = 0;

  const resize = () => {
    w = Math.max(1, Math.floor(window.innerWidth));
    h = Math.max(1, Math.floor(window.innerHeight));
    canvas.width = Math.floor(w * DPR);
    canvas.height = Math.floor(h * DPR);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  };

  resize();
  window.addEventListener('resize', resize, { passive: true });

  const rnd = (a, b) => a + Math.random() * (b - a);

  const hearts = [];
  const balloons = [];
  const bokeh = [];
  const motes = [];

  const heartCount = clamp(Math.floor((w * h) / 55000), 14, 42);
  const balloonCount = clamp(Math.floor((w * h) / 70000), 8, 18);
  const bokehCount = clamp(Math.floor((w * h) / 80000), 10, 26);
  const moteCount = clamp(Math.floor((w * h) / 45000), 18, 55);

  for (let i = 0; i < balloonCount; i++) {
    const depth = rnd(0.4, 1.0);
    balloons.push({
      x: rnd(0, w),
      y: rnd(h, h + 400),
      r: rnd(22, 38) * depth,
      vy: rnd(0.4, 1.2) * (1.05 - depth),
      vx: rnd(-0.15, 0.15) * (1.05 - depth),
      wobble: rnd(0, Math.PI * 2),
      wobbleSpeed: rnd(0.001, 0.003),
      depth,
      alpha: rnd(0.12, 0.28) * (1.1 - depth),
      hue: rnd(350, 365),
    });
  }

  for (let i = 0; i < heartCount; i++) {
    const depth = rnd(0.35, 1.0);
    hearts.push({
      x: rnd(0, w),
      y: rnd(0, h),
      s: rnd(10, 34) * depth,
      vy: rnd(0.18, 0.65) * (1.1 - depth),
      vx: rnd(-0.08, 0.08) * (1.05 - depth),
      rot: rnd(-0.6, 0.6),
      drot: rnd(-0.0022, 0.0022),
      depth,
      alpha: rnd(0.05, 0.18) * (1.08 - depth),
      hue: rnd(335, 355),
    });
  }

  for (let i = 0; i < bokehCount; i++) {
    const depth = rnd(0.25, 1);
    bokeh.push({
      x: rnd(0, w),
      y: rnd(0, h),
      r: rnd(40, 140) * depth,
      vy: rnd(-0.02, 0.06) * (1.05 - depth),
      vx: rnd(-0.03, 0.03) * (1.05 - depth),
      depth,
      alpha: rnd(0.02, 0.06) * (1.05 - depth),
    });
  }

  for (let i = 0; i < moteCount; i++) {
    const depth = rnd(0.25, 1);
    motes.push({
      x: rnd(0, w),
      y: rnd(0, h),
      r: rnd(0.6, 1.9) * depth,
      vy: rnd(-0.12, -0.02) * (1.15 - depth),
      vx: rnd(-0.05, 0.05) * (1.15 - depth),
      depth,
      alpha: rnd(0.05, 0.16) * (1.05 - depth),
    });
  }

  const drawHeart = (x, y, size, rot, fillStyle, alpha) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = fillStyle;

    const s = size;
    ctx.beginPath();
    ctx.moveTo(0, -0.18 * s);
    ctx.bezierCurveTo(0.5 * s, -0.75 * s, 1.2 * s, -0.06 * s, 0, 0.95 * s);
    ctx.bezierCurveTo(-1.2 * s, -0.06 * s, -0.5 * s, -0.75 * s, 0, -0.18 * s);
    ctx.closePath();

    ctx.shadowColor = 'rgba(193,27,74,0.18)';
    ctx.shadowBlur = 28;
    ctx.fill();
    ctx.restore();
  };

  const drawBalloon = (x, y, r, hue, alpha) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = alpha;

    const g = ctx.createRadialGradient(-r * 0.25, -r * 0.25, 0, 0, 0, r);
    g.addColorStop(0, `hsla(${hue}, 70%, 58%, 0.95)`);
    g.addColorStop(0.35, `hsla(${hue}, 76%, 42%, 0.92)`);
    g.addColorStop(0.75, `hsla(${hue}, 80%, 30%, 0.88)`);
    g.addColorStop(1, `hsla(${hue}, 85%, 22%, 0.75)`);

    ctx.beginPath();
    ctx.ellipse(0, 0, r, r * 1.12, 0, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.shadowColor = `hsla(${hue}, 70%, 40%, 0.35)`;
    ctx.shadowBlur = 20;
    ctx.fill();

    ctx.fillStyle = 'rgba(255,255,255,0.28)';
    ctx.beginPath();
    ctx.ellipse(-r * 0.35, -r * 0.25, r * 0.12, r * 0.2, -0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, r * 1.12);
    ctx.quadraticCurveTo(r * 0.15, r * 1.3, 0, r * 1.45);
    ctx.stroke();

    ctx.strokeStyle = `hsla(${hue}, 50%, 75%, 0.4)`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, r * 1.12);
    ctx.quadraticCurveTo(r * 0.12, r * 1.28, r * 0.02, r * 1.42);
    ctx.stroke();

    ctx.restore();
  };

  let t0 = performance.now();

  const tick = (t) => {
    const dt = Math.min(0.032, (t - t0) / 1000);
    t0 = t;

    ctx.clearRect(0, 0, w, h);

    const scrollY = window.scrollY || 0;
    const scrollFactor = clamp(scrollY / Math.max(1, document.body.scrollHeight - h), 0, 1);

    for (const b of bokeh) {
      b.x += b.vx * (1 + scrollFactor * 0.25);
      b.y += b.vy * (1 + scrollFactor * 0.25);
      if (b.x < -b.r) b.x = w + b.r;
      if (b.x > w + b.r) b.x = -b.r;
      if (b.y < -b.r) b.y = h + b.r;
      if (b.y > h + b.r) b.y = -b.r;

      ctx.save();
      ctx.globalAlpha = b.alpha;
      const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
      g.addColorStop(0, 'rgba(255, 212, 227, 0.38)');
      g.addColorStop(0.45, 'rgba(243, 215, 163, 0.16)');
      g.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    for (const m of motes) {
      m.x += m.vx;
      m.y += m.vy;
      if (m.y < -10) {
        m.y = h + 10;
        m.x = rnd(0, w);
      }
      if (m.x < -10) m.x = w + 10;
      if (m.x > w + 10) m.x = -10;

      ctx.save();
      ctx.globalAlpha = m.alpha;
      ctx.fillStyle = 'rgba(255,244,236,0.65)';
      ctx.shadowColor = 'rgba(243,215,163,0.22)';
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    const breath = state.reduceMotion ? 0 : (Math.sin(t * 0.00065) * 0.5 + 0.5);

    for (const hrt of hearts) {
      const parallax = (1 - hrt.depth) * 18;
      const px = hrt.x + parallax * Math.sin((t * 0.00015) + hrt.y * 0.002);
      const py = hrt.y + parallax * Math.cos((t * 0.00012) + hrt.x * 0.002);

      hrt.y -= hrt.vy * (1 + scrollFactor * 0.35);
      hrt.x += hrt.vx;
      hrt.rot += hrt.drot * (1 + dt * 12);

      if (hrt.y < -80) {
        hrt.y = h + 80;
        hrt.x = rnd(0, w);
    }
    if (hrt.x < -80) hrt.x = w + 80;
    if (hrt.x > w + 80) hrt.x = -80;

    const a = hrt.alpha * (0.75 + breath * 0.25);
    const c0 = `hsla(${hrt.hue}, 76%, 62%, ${0.85})`;
    drawHeart(px, py, hrt.s, hrt.rot, c0, a);
  }

  for (const b of balloons) {
    b.wobble += b.wobbleSpeed;
    b.y -= b.vy * (1 + scrollFactor * 0.25);
    b.x += b.vx + Math.sin(b.wobble) * 0.3;

    if (b.y < -b.r - 80) {
      b.y = h + b.r + 80;
      b.x = rnd(0, w);
    }
    if (b.x < -b.r - 40) b.x = w + b.r + 40;
    if (b.x > w + b.r + 40) b.x = -b.r - 40;

    const balloonAlpha = b.alpha * (0.85 + Math.sin(t * 0.001 + b.wobble) * 0.15);
    drawBalloon(b.x, b.y, b.r, b.hue, balloonAlpha);
  }

  requestAnimationFrame(tick);
};

if (!state.reduceMotion) requestAnimationFrame(tick);
}

function setupRoseBloom() {
  const finalScene = $('#scene-final');
  const roseContainer = document.querySelector('.rose-container');
  if (!finalScene || !roseContainer) return;

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting && e.intersectionRatio > 0.4) {
          setTimeout(() => {
            roseContainer.classList.add('is-visible');
          }, 400);
        }
      }
    },
    { threshold: [0, 0.25, 0.5, 0.75] }
  );

  io.observe(finalScene);
}

function setupImageLoading() {
  const images = $$('.frame__inner img');
  images.forEach((img) => {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', () => img.classList.add('loaded'));
      img.addEventListener('error', () => {
        img.style.display = 'none';
        img.parentElement.style.background = 'rgba(255,255,255,0.1)';
      });
    }
  });
}

function boot() {
  setupReveal();
  setupDotsNav();
  setupLetterTrigger();
  setupButtons();
  setupAudio();
  setupCanvasCinema();
  setupRoseBloom();
  setupImageLoading();

  if (state.reduceMotion) {
    $$('.reveal').forEach((el) => el.classList.add('is-in'));
    document.querySelector('.rose-container')?.classList.add('is-visible');
  }
}

boot();
