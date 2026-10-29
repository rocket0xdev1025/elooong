/* ELOOONG — edit CONFIG to go live. Paste the real CA (0x + 40 hex) and everything updates. */
const CONFIG = {
  CA: '0xfeb0b2ef4e3b530d7ac7d9527be2e007b98b604e',
  X: 'https://x.com',
  TG: '', // Telegram: empty = "Soon"
  CHAIN: 'robinhood'
};
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const valid = /^0x[a-fA-F0-9]{40}$/.test(CONFIG.CA);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch = matchMedia('(hover: none), (pointer: coarse)').matches || innerWidth < 768;

  /* ---------- links ---------- */
  const LINKS = {
    buy: 'https://app.uniswap.org/swap?chain=robinhood&inputCurrency=NATIVE' + (valid ? '&outputCurrency=' + CONFIG.CA : ''),
    chart: 'https://dexscreener.com/' + CONFIG.CHAIN + (valid ? '/' + CONFIG.CA : ''),
    x: CONFIG.X, tg: CONFIG.TG
  };
  $$('[data-link]').forEach(a => {
    const url = LINKS[a.dataset.link];
    if (url) { a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer'; }
    else { a.setAttribute('aria-disabled', 'true'); a.removeAttribute('href'); const t = [...a.childNodes].find(n => n.nodeType === 3 && n.textContent.trim()); if (t) t.textContent = ' Soon'; }
  });
  $$('[data-ca]').forEach(el => el.textContent = valid ? CONFIG.CA : '0xfeb0b2ef4e3b530d7ac7d9527be2e007b98b604e');

  /* ---------- copy ---------- */
  const toast = $('#toast'); let tt;
  const say = m => { toast.textContent = m; toast.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove('show'), 2200); };
  const fallbackCopy = t => { const ta = document.createElement('textarea'); ta.value = t; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;opacity:0;left:-9999px'; document.body.appendChild(ta); ta.select(); let ok = false; try { ok = document.execCommand('copy'); } catch (e) {} ta.remove(); return ok; };
  $$('[data-copy]').forEach(b => b.addEventListener('click', async () => {
    if (!valid) { say('CA is 0xfeb0b2ef4e3b530d7ac7d9527be2e007b98b604e — launching soon. Beware of fake CAs!'); return; }
    let ok = false;
    try { if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(CONFIG.CA); ok = true; } } catch (e) {}
    if (!ok) ok = fallbackCopy(CONFIG.CA);
    say(ok ? 'CA copied. Stay long in the hood.' : 'Copy failed — select the CA manually.');
  }));
  window.__ELOOONG_copyTest = fallbackCopy;

  /* ---------- embed ---------- */
  if (valid) {
    const f = document.createElement('iframe');
    f.src = 'https://dexscreener.com/' + CONFIG.CHAIN + '/' + CONFIG.CA + '?embed=1&theme=dark&trades=0&info=0';
    f.title = '$ELOOONG chart on DexScreener, Robinhood Chain'; f.loading = 'lazy';
    $('[data-embed]').appendChild(f); $('[data-embed-overlay]').remove();
  }

  /* ---------- nav hide on scroll ---------- */
  const nav = $('#nav'); let lastY = 0;
  addEventListener('scroll', () => { const y = scrollY; nav.classList.toggle('scrolled', y > 20); nav.classList.toggle('hide', y > 300 && y > lastY); lastY = y; }, { passive: true });

  /* ---------- pause offscreen loops ---------- */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('paused', !e.isIntersecting)));
    $$('.tape').forEach(t => io.observe(t));
    const h = $('.hero-title'); new IntersectionObserver(([e]) => $$('.o', h).forEach(o => o.style.animationPlayState = e.isIntersecting ? 'running' : 'paused')).observe(h);
  }

  /* ---------- cursor ---------- */
  if (!touch && !reduce) {
    const c = $('#cursor'); c.classList.add('on');
    addEventListener('mousemove', e => { c.style.transform = `translate(${e.clientX - 14}px,${e.clientY - 14}px)`; }, { passive: true });
    $$('a,button').forEach(el => { el.addEventListener('mouseenter', () => c.classList.add('big')); el.addEventListener('mouseleave', () => c.classList.remove('big')); });
  }

  /* ---------- neck rig ---------- */
  const neck = $('[data-neck]'), rig = $('[data-rig]');
  const mult = $('[data-mult]'), meter = $('[data-meter]'), vert = $('[data-vert]'), alt = $('[data-alt]'), phases = $$('[data-phase]');
  const arrow = $('.arrow-path'), head = $('.arrow-head');
  const aLen = arrow.getTotalLength(), hLen = head.getTotalLength();
  arrow.style.strokeDasharray = aLen; head.style.strokeDasharray = hLen;
  const maxNeck = () => { const w = rig.clientWidth, base = w * 136 / 430, rest = w * (263 + 281) / 430; return { base, max: Math.max(base * 1.5, innerHeight - rest - (innerWidth < 768 ? 250 : 110)) }; };
  function setNeck(p) {
    const { base, max } = maxNeck();
    neck.style.setProperty('--nh', (base + (max - base) * p).toFixed(1) + 'px');
    const m = Math.pow(1000, p);
    mult.textContent = m < 10 ? m.toFixed(1) : Math.round(m).toLocaleString('en-US');
    meter.style.setProperty('--m', (p * 100).toFixed(1) + '%');
    vert.textContent = Math.round(7 + p * 993); alt.textContent = (0.4 + p * 41).toFixed(1);
    phases.forEach((el, i) => el.classList.toggle('on', p >= i / 3.2));
    arrow.style.strokeDashoffset = aLen * (1 - Math.min(1, p * 1.15));
    head.style.strokeDashoffset = hLen * (1 - Math.max(0, Math.min(1, (p - .8) * 5)));
  }
  window.__setNeck = setNeck;

  /* ---------- fan gallery ---------- */
  const figs = $$('[data-fan] figure'), n = figs.length;
  const fanOut = (open) => figs.forEach((f, i) => { const k = i - (n - 1) / 2, sp = innerWidth < 640 ? 9 : 14; f.style.transform = `rotate(${open ? k * sp : k * 2}deg) translateY(${open ? Math.abs(k) * 12 : 0}px)`; f.style.zIndex = 10 - Math.abs(Math.round(k)); });

  /* ---------- preloader ---------- */
  const pl = $('#preloader'), plc = $('#pl-count'), plb = $('#pl-bar');
  function runPreloader(done) {
    if (reduce) { pl.classList.add('done'); return done(); }
    const t0 = performance.now(), D = 1100;
    (function tick(t) { const p = Math.min(1, (t - t0) / D); const v = Math.round(p * 100); plc.textContent = String(v).padStart(3, '0'); plb.style.width = v + '%'; if (p < 1) requestAnimationFrame(tick); else { pl.classList.add('done'); done(); } })(t0);
  }

  /* ---------- static fallback ---------- */
  function staticMode() { setNeck(reduce ? 0.6 : 0.5); fanOut(true); document.documentElement.classList.add('static'); }

  function init() {
    const G = window.gsap, ST = window.ScrollTrigger;
    if (!G || !ST || reduce) { staticMode(); runPreloader(() => {}); return; }
    G.registerPlugin(ST);
    const damp = touch ? 0.5 : 1;
    if (!touch && window.Lenis) {
      const lenis = new Lenis({ lerp: 0.1 }); document.documentElement.classList.add('lenis');
      lenis.on('scroll', ST.update); G.ticker.add(t => lenis.raf(t * 1000)); G.ticker.lagSmoothing(0);
      $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); lenis.scrollTo(a.getAttribute('href'), { offset: -60 }); }));
    }
    setNeck(0); fanOut(false);
    G.set('.hero-title .l', { yPercent: 110, rotateX: -90, opacity: 0 });
    G.set('.hero-media', { opacity: 0, y: 40 * damp });
    runPreloader(() => {
      G.to('.hero-title .l', { yPercent: 0, rotateX: 0, opacity: 1, duration: 1, stagger: .06, ease: 'back.out(1.6)' });
      G.fromTo('.hero-title .o', { scaleY: 2.2 }, { scaleY: 1, duration: 1.4, stagger: .1, delay: .3, ease: 'elastic.out(1,.4)', clearProps: 'transform' });
      G.to('.hero-media', { opacity: 1, y: 0, duration: 1, delay: .4, ease: 'power3.out' });
    });
    // Neck Extension Protocol
    ST.create({ trigger: '[data-scene]', start: 'top top', end: () => '+=' + innerHeight * 2.5, pin: true, scrub: true, onUpdate: s => setNeck(s.progress), invalidateOnRefresh: true });
    // lore crossfade
    const lp = $('[data-lore]'), cards = $$('[data-lore-card]'); lp.classList.add('pinned');
    G.set(cards, { opacity: 0, y: 40 * damp }); G.set(cards[0], { opacity: 1, y: 0 });
    const tl = G.timeline({ scrollTrigger: { trigger: lp, start: 'top top', end: () => '+=' + innerHeight * 2, pin: true, scrub: true } });
    cards.slice(1).forEach((c, i) => tl.to(cards[i], { opacity: 0, y: -40 * damp, duration: 1 }).to(c, { opacity: 1, y: 0, duration: 1 }, '<.3'));
    tl.to('.bg-word--b', { scale: 1.3, duration: tl.duration() }, 0);
    // fan
    ST.create({ trigger: '[data-fan]', start: 'top 80%', onEnter: () => fanOut(true), onLeaveBack: () => fanOut(false) });
    // reveals + bg word drift
    $$('.step, .pill').forEach(el => G.from(el, { opacity: 0, y: 30 * damp, duration: .6, scrollTrigger: { trigger: el, start: 'top 92%' } }));
    $$('#hero .bg-word, #tokenomics .bg-word').forEach(el => G.to(el, { xPercent: -10 * damp, scrollTrigger: { trigger: el.parentElement, scrub: true } }));
    addEventListener('resize', () => fanOut(true));
  }
  // vendor scripts are deferred before this file; guard anyway
  try { init(); } catch (e) { console.warn('Animation fallback:', e); staticMode(); pl.classList.add('done'); }
})();
