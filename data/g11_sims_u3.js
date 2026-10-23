// محاكيات تفاعليَّة — الوحدة 3: الإنزيمات (استقصاءات المختبر)
// g11_catalase : الكتاليز ومحقن الغاز — المرحلة 0 = الاستقصاء ٣-١ (الدورة الزمنيَّة)، المرحلة 1 = الاستقصاء ٣-٢ (تركيز المادة المتفاعلة)
// g11_amylase  : تركيز الأميليز واختبار اليود — الاستقصاء ٣-٣
// الأرقام كلُّها من دليل المعلِّم ج2: الجدول ٣-١ (ص ١٧١)، الشكل ٣-٣ والمعدل 19/240 = 0.079 (ص ١٧٣)،
// الجدول ٣-٢ (ص ١٧٦)، الجدول ٣-٣ (ص ١٧٧)، الجدول ٣-٥ (ص ١٨٢). الأسئلة وإجاباتها تُقرأ وقت التشغيل من
// G11_DATA.virtualLabs (g11_labs.js) فلا تُكرَّر هنا.
(function () {
  const G = window.G11_DATA = window.G11_DATA || {};

  // ───────── أدوات رسم مشتركة ─────────
  const FONT = 'font-family="Tajawal, sans-serif"';
  const N = s => `<tspan direction="ltr" unicode-bidi="embed">${s}</tspan>`;
  const T = (x, y, t, o = {}) => `<text x="${x}" y="${y}" text-anchor="${o.a || 'middle'}" font-size="${o.fs || 16}" fill="${o.c || '#263238'}" font-weight="${o.b ? 'bold' : 'normal'}" direction="rtl" ${FONT}${o.id ? ` id="${o.id}"` : ''}${o.tr ? ` transform="${o.tr}"` : ''}>${t}</text>`;
  const TL = (x, y, t, o = {}) => `<text x="${x}" y="${y}" text-anchor="${o.a || 'middle'}" font-size="${o.fs || 16}" fill="${o.c || '#263238'}" font-weight="${o.b ? 'bold' : 'normal'}" direction="ltr" ${FONT}${o.id ? ` id="${o.id}"` : ''}>${t}</text>`;
  const SVG = (id, h, inner) => `<svg id="${id}" viewBox="0 0 700 ${h}" style="width:100%;display:block;" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="692" height="${h - 8}" rx="16" fill="#f7fbfa" stroke="#b2dfdb" stroke-width="2"/>${inner}</svg>`;
  const CTRL = 'direction:rtl;font-family:Tajawal,sans-serif;font-size:16px;display:flex;flex-wrap:wrap;gap:8px 10px;align-items:center;justify-content:center;padding:8px 6px;';
  const BTN = 'font-family:Tajawal,sans-serif;font-size:16px;padding:6px 12px;border-radius:10px;border:2px solid #00695c;cursor:pointer;';
  const btnStyle = (on, col) => BTN + (on ? `background:${col || '#00695c'};color:#fff;border-color:${col || '#00695c'};` : `background:#fff;color:${col || '#00695c'};border-color:${col || '#00695c'};`);
  const NOTE = 'direction:rtl;font-family:Tajawal,sans-serif;font-size:16px;line-height:1.8;background:#e0f2f1;border-right:5px solid #00695c;border-radius:10px;padding:8px 12px;margin:6px 8px;color:#003d33;';
  const WARN = 'direction:rtl;font-family:Tajawal,sans-serif;font-size:16px;line-height:1.8;background:#fff8e1;border-right:5px solid #C8102E;border-radius:10px;padding:8px 12px;margin:6px 8px;color:#4e342e;';
  const TABLE = 'border-collapse:collapse;margin:6px auto;font-size:16px;direction:rtl;font-family:Tajawal,sans-serif;background:#fff;';
  const TD = 'border:1px solid #b2dfdb;padding:3px 7px;text-align:center;min-width:40px;';
  const TH = TD + 'background:#e0f2f1;color:#003d33;font-weight:bold;';
  const SEL = 'font-family:Tajawal,sans-serif;font-size:16px;padding:4px 8px;border-radius:8px;border:2px solid #00695c;';
  const L = s => `<span dir="ltr" style="unicode-bidi:isolate">${s}</span>`;
  const $ = id => document.getElementById(id);
  const WRAP = h => `<div style="width:100%;max-width:720px;margin:0 auto;">${h}</div>`;
  const cross = (x, y, c, r = 5) => `<line x1="${x - r}" y1="${y - r}" x2="${x + r}" y2="${y + r}" stroke="${c}" stroke-width="2.2"/><line x1="${x - r}" y1="${y + r}" x2="${x + r}" y2="${y - r}" stroke="${c}" stroke-width="2.2"/>`;
  const fpath = (f, t0, t1, X, Y, c, w, dash) => {
    let d = '';
    for (let k = 0; k <= 80; k++) { const t = t0 + (t1 - t0) * k / 80; d += (k ? 'L' : 'M') + X(t).toFixed(1) + ' ' + Y(f(t)).toFixed(1); }
    return `<path d="${d}" fill="none" style="stroke:${c};stroke-width:${w || 2.5};${dash ? 'stroke-dasharray:' + dash + ';' : ''}"/>`;
  };
  // محاور وشبكة تمثيل بياني
  function axes(o) {
    const X = v => o.x0 + v / o.xmax * o.w, Y = v => o.y0 - v / o.ymax * o.h;
    let s = `<rect x="${o.x0}" y="${o.y0 - o.h}" width="${o.w}" height="${o.h}" fill="#fff"/>`;
    for (let v = 0; v <= o.xmax + 1e-9; v += o.xg) s += `<line x1="${X(v)}" y1="${o.y0}" x2="${X(v)}" y2="${o.y0 - o.h}" stroke="#e0eeec" stroke-width="1"/>`;
    for (let v = 0; v <= o.ymax + 1e-9; v += o.yg) s += `<line x1="${o.x0}" y1="${Y(v)}" x2="${o.x0 + o.w}" y2="${Y(v)}" stroke="#e0eeec" stroke-width="1"/>`;
    s += `<line x1="${o.x0}" y1="${o.y0}" x2="${o.x0 + o.w}" y2="${o.y0}" stroke="#37474f" stroke-width="2"/><line x1="${o.x0}" y1="${o.y0}" x2="${o.x0}" y2="${o.y0 - o.h}" stroke="#37474f" stroke-width="2"/>`;
    for (let v = 0; v <= o.xmax + 1e-9; v += o.xl) s += TL(X(v), o.y0 + 19, o.fx ? o.fx(v) : String(+v.toFixed(3)));
    for (let v = 0; v <= o.ymax + 1e-9; v += o.yl) s += TL(o.x0 - 5, Y(v) + 5, o.fy ? o.fy(v) : String(+v.toFixed(3)), { a: 'end' });
    s += T(o.x0 + o.w / 2, o.y0 + 42, o.xt, { c: '#003d33', b: 1 });
    const yx = o.ytx || (o.x0 - 42), yy = o.y0 - o.h / 2;
    s += T(yx, yy, o.yt, { c: '#003d33', b: 1, tr: `rotate(-90 ${yx} ${yy})` });
    return { s, X, Y };
  }
  // ملاءمة V = a(1 − e^(−kt)) بأقلِّ مربَّعات (خطُّ المنحنى المناسب — توضيحي)
  const _fitMemo = {};
  function fitExp(key, ts, vs) {
    if (_fitMemo[key]) return _fitMemo[key];
    let best = null;
    for (let k = 0.00005; k < 0.03; k += 0.00005) {
      let num = 0, den = 0;
      ts.forEach((t, i) => { const f = 1 - Math.exp(-k * t); num += f * vs[i]; den += f * f; });
      const a = num / den; let e = 0;
      ts.forEach((t, i) => { const r = a * (1 - Math.exp(-k * t)) - vs[i]; e += r * r; });
      if (!best || e < best.e) best = { a, k, e };
    }
    best.f = t => best.a * (1 - Math.exp(-best.k * t));
    return (_fitMemo[key] = best);
  }
  // أسئلة الاستقصاء وإجاباتها من بروتوكول المختبر (g11_labs.js)
  function questionsHtml(labKey, title) {
    const lab = (window.G11_DATA && G.virtualLabs && G.virtualLabs[labKey]) || null;
    if (!lab || !lab.questions) return '';
    return `<div style="${NOTE}"><b>📝 ${title}</b>` + lab.questions.map(q =>
      `<details style="margin:6px 0;background:#fff;border-radius:8px;padding:4px 10px;border:1px solid #b2dfdb;"><summary style="cursor:pointer;font-weight:bold;color:#003d33;">${q.q.length > 110 ? q.q.slice(0, 110) + '…' : q.q}</summary>${q.q.length > 110 ? `<div style="margin-top:4px;">${q.q}</div>` : ''}<div style="margin-top:6px;color:#00695c;"><b>إجابة الدليل:</b> ${q.a}</div></details>`
    ).join('') + `</div>`;
  }

  // ═══════════════════════════════════════════════════
  // البيانات — دليل المعلِّم ج2
  // ═══════════════════════════════════════════════════
  const TT = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360, 390, 420, 450, 480, 510];
  // الجدول ٣-٢ (ص ١٧٦): حجم غاز الأكسجين / mL — عمود 100% مطابق للجدول ٣-١ (ص ١٧١)
  const SUB = {
    100: [0, 2.0, 5.5, 7.5, 9.5, 11.5, 13.0, 14.5, 16.0, 17.0, 18.5, 19.5, 20.5, 21.0, 21.0, 21.5, 22.0, 22.5],
    80: [0, 3.0, 4.5, 6.5, 8.0, 10.0, 11.0, 12.5, 13.5, 15.0, 16.0, 16.5, 17.0, 17.5, 18.0, 18.5, 18.5, 19.0],
    60: [0, 2.0, 4.0, 6.0, 8.0, 9.5, 11.0, 12.0, 13.0, 13.5, 14.0, 14.5, 15.0, 15.0, 15.5, 15.5, 16.0, 16.0],
    40: [0, 1.0, 2.0, 3.5, 5.0, 6.0, 7.0, 8.0, 8.5, 9.0, 10.0, 10.5, 10.5, 11.0, 11.0, 11.5, 11.5, 12.0],
    20: [0, 0, 0.5, 0.5, 1.0, 1.0, 1.5, 2.0, 2.0, 2.5, 3.0, 3.0, 3.5, 3.5, 4.0, 4.0, 4.5, 4.5]
  };
  // الجدول ٣-٣ (ص ١٧٧): المعدل الأولي / mL من غاز الأكسجين s⁻¹ (نصّاً كما ورد)
  const SUB_RATE = { 100: '0.42', 80: '0.41', 60: '0.34', 40: '0.15', 20: '0.02' };
  const CONCS = [100, 80, 60, 40, 20];
  const CCOL = { 100: '#003d33', 80: '#1e88e5', 60: '#C8102E', 40: '#009A44', 20: '#ef6c00' };
  // الشكل ٣-٣ (ص ١٧٣): x1 = 240 s، y1 = 19 mL ← 19/240 = 0.079
  const GUIDE_X1 = 240, GUIDE_Y1 = 19, GUIDE_RATE = '0.079';
  const vAt = (arr, t) => { if (t <= 0) return 0; if (t >= 510) return arr[17]; const i = Math.floor(t / 30), f = (t - 30 * i) / 30; return arr[i] + (arr[i + 1] - arr[i]) * f; };

  // ═══════════════════════════════════════════════════
  // g11_catalase
  // ═══════════════════════════════════════════════════
  const SY0 = 300, SPX = 3.6;            // المحقن: الصفر عند y=300، و 1 mL = 3.6 px
  const C0 = { x0: 70, y0: 350, w: 320, h: 290, xmax: 540, ymax: 25, xg: 30, yg: 1, xl: 120, yl: 5, xt: 'الزمن (s)', yt: 'حجم غاز الأكسجين (mL)', ytx: 24 };
  const C1A = { x0: 62, y0: 330, w: 320, h: 270, xmax: 540, ymax: 25, xg: 30, yg: 1, xl: 120, yl: 5, xt: 'الزمن (s)', yt: 'حجم غاز الأكسجين (mL)', ytx: 20 };
  const C1B = { x0: 478, y0: 330, w: 190, h: 270, xmax: 100, ymax: 0.45, xg: 10, yg: 0.05, xl: 20, yl: 0.1, xt: 'تركيز المادة المتفاعلة (%)', yt: 'المعدل الأولي (mL s⁻¹)', ytx: 418, fy: v => v.toFixed(1) };

  const CAT = window.G11SIM_catalase = {
    // ── دوال حساب خالصة (يختبرها سكربت التحقُّق) ──
    readings: () => SUB[100].slice(1),
    times: () => TT.slice(1),
    rate: (y1, x1) => y1 / x1,
    fmt3: v => v.toFixed(3),
    guide: { x1: GUIDE_X1, y1: GUIDE_Y1, rate: GUIDE_RATE },
    sub: () => SUB, subRate: () => SUB_RATE,
    vAt,
    s: { t: 0, run: false, timer: null, speed: 10, n: 0, done: false, y1: 12 },

    // ───────────── المرحلة 0 ─────────────
    build0() {
      this.stop(); this.s = { t: 0, run: false, timer: null, speed: 10, n: 0, done: false, y1: 12 };
      const A = axes(C0);
      let g = A.s + T(C0.x0 + C0.w / 2, 30, 'حجم غاز الأكسجين مقابل الزمن', { b: 1, c: '#003d33' });
      g += `<g id="g11cat_curve"></g><g id="g11cat_pts"></g><g id="g11cat_tan"></g>`;
      // ── الجهاز ──
      let a = T(555, 30, 'الجهاز (الشكل ٣-١، كتاب الأنشطة)', { b: 1, c: '#003d33' });
      a += `<rect x="560" y="378" width="130" height="10" rx="3" fill="#78909c"/><rect x="668" y="44" width="7" height="336" fill="#90a4ae"/>`;
      a += `<rect x="622" y="150" width="48" height="6" fill="#78909c"/><rect x="622" y="262" width="48" height="6" fill="#78909c"/>`;
      // المحقن (عمودي، الصفر في الأسفل)
      a += `<rect x="590" y="100" width="32" height="205" rx="3" fill="rgba(255,255,255,.7)" stroke="#455a64" stroke-width="2.2"/>`;
      a += `<rect id="g11cat_gas" x="592" y="${SY0}" width="28" height="0" fill="#bbdefb"/>`;
      for (let v = 0; v <= 50; v += 5) a += `<line x1="590" y1="${SY0 - v * SPX}" x2="${v % 10 ? 597 : 601}" y2="${SY0 - v * SPX}" stroke="#455a64" stroke-width="1.4"/>` + (v % 10 ? '' : TL(586, SY0 - v * SPX + 5, v, { a: 'end', fs: 16 }));
      a += `<g id="g11cat_plunger"><rect x="592" y="${SY0 - 6}" width="28" height="6" fill="#37474f"/><rect x="603" y="${SY0 - 196}" width="6" height="190" fill="#607d8b"/><rect x="595" y="${SY0 - 202}" width="22" height="6" rx="2" fill="#37474f"/></g>`;
      a += `<rect x="602" y="305" width="8" height="12" fill="#455a64"/>`;
      a += T(528, 158, 'محقن غاز', { a: 'middle', b: 1 }) + `<line x1="528" y1="165" x2="566" y2="190" stroke="#37474f" stroke-width="1.6"/>`;
      // الأنبوب الواصل
      a += `<path d="M530 214 C 566 214 560 352 606 352 L606 317" fill="none" style="stroke:#795548;stroke-width:5;"/>`;
      // أنبوبة الاختبار بذراع جانبيَّة في الحامل
      a += `<rect x="438" y="300" width="110" height="10" rx="3" fill="#a1887f"/><rect x="442" y="310" width="6" height="68" fill="#a1887f"/><rect x="538" y="310" width="6" height="68" fill="#a1887f"/><rect x="438" y="372" width="110" height="8" rx="3" fill="#a1887f"/>`;
      a += `<path d="M473 300 L473 352 A12 12 0 0 0 497 352 L497 300 Z" fill="#dcedc8"/><rect x="473" y="292" width="24" height="8" fill="#dcedc8"/>`;
      a += `<g id="g11cat_bub" opacity="0">` + [0, 1, 2, 3, 4, 5].map(k => `<circle cx="${478 + (k * 7) % 16}" cy="360" r="${2 + k % 2}" fill="none" stroke="#558b2f" stroke-width="1.4"><animate attributeName="cy" values="360;296" dur="${0.9 + k * 0.23}s" repeatCount="indefinite" begin="${k * 0.17}s"/></circle>`).join('') + `</g>`;
      a += `<path d="M470 200 L470 352 A15 15 0 0 0 500 352 L500 200" fill="none" stroke="#455a64" stroke-width="2.4"/><line x1="500" y1="224" x2="530" y2="214" stroke="#455a64" stroke-width="5"/>`;
      a += `<rect x="465" y="190" width="40" height="16" rx="3" fill="#4e342e"/>`;
      a += T(535, 410, 'بيروكسيد الهيدروجين + مستخلص الكرفس', { fs: 16, c: '#33691e', b: 1 });
      const svg = SVG('g11cat_svg', 420, g + a);
      // جدول القراءات (صفَّان × 9 أعمدة)
      const tbl = (from, to) => `<table style="${TABLE}"><tr><th style="${TH}">الزمن (s)</th>${TT.slice(from, to).map(t => `<td style="${TD}">${t}</td>`).join('')}</tr><tr><th style="${TH}">الحجم (mL)</th>${TT.slice(from, to).map((t, i) => `<td style="${TD}font-weight:bold;color:#00695c;" id="g11cat_c${from + i}"></td>`).join('')}</tr></table>`;
      return `${svg}
<div style="${CTRL}">
  <button style="${btnStyle(true)}" onclick="G11SIM_catalase.start()">▶ ابدأ</button>
  <button style="${btnStyle(false)}" onclick="G11SIM_catalase.pause()">⏸ إيقاف مؤقَّت</button>
  <button style="${btnStyle(false)}" onclick="G11SIM_catalase.reset()">↺ إعادة</button>
  <button style="${btnStyle(false)}" onclick="G11SIM_catalase.showAll()">⏭ اعرض القراءات كلَّها</button>
  <label>السرعة: <select style="${SEL}" onchange="G11SIM_catalase.s.speed=+this.value"><option value="1">×1 (الزمن الحقيقي)</option><option value="5">×5</option><option value="10" selected>×10</option><option value="30">×30</option></select></label>
</div>
<div style="${CTRL}font-size:18px;color:#003d33;" id="g11cat_status">⏱ الزمن: ${L('0 s')} · قراءة المحقن: ${L('0.0 mL')} — أضف <b>5 mL</b> من مستخلص الكرفس إلى <b>20 mL</b> من بيروكسيد الهيدروجين، ثمَّ اضغط «ابدأ».</div>
<div style="overflow-x:auto;">${tbl(1, 10)}${tbl(10, 18)}</div>
<div style="${NOTE}font-size:15px;">قراءات العيِّنة من <b>دليل المعلِّم ج2 ص ١٧١ (الجدول ٣-١)</b> تُسجَّل كلَّ ${L('30 s')}. «يمكنك قراءة المقياس على المحقن إلى أقرب ${L('0.5 mL')}» (كتاب الأنشطة ص ٩٧).</div>
<div id="g11cat_tanpanel" style="${NOTE}"><b>📐 المعدل الأولي بالمماس:</b> أكمل التجربة (أو اضغط «اعرض القراءات كلَّها») ثمَّ ارسم مماساً للمنحنى عند الأصل.</div>
<div id="g11cat_q" style="display:none;">${questionsHtml('inv_3_1_catalase', 'أسئلة الاستقصاء ٣-١ (كتاب الأنشطة ص ٩٨–١٠٠) وإجابات الدليل (ص ١٧١–١٧٣)')}</div>`;
    },
    stop() { if (this.s && this.s.timer) { clearInterval(this.s.timer); this.s.timer = null; } if (this.s) this.s.run = false; },
    start() {
      if (this.s.done || this.s.run) return;
      this.s.run = true;
      this.s.timer = setInterval(() => this.tick(), 100);
    },
    pause() { this.stop(); this.draw0(); },
    reset() { this.stop(); const st = $('simStage'); if (st && $('g11cat_svg')) { st.innerHTML = WRAP(this.build0()); } },
    showAll() { this.stop(); this.s.t = 510; this.s.n = 17; this.finish0(); },
    tick() {
      if (!$('g11cat_svg')) return this.stop();
      this.s.t = Math.min(510, this.s.t + this.s.speed * 0.1);
      while (this.s.n < 17 && TT[this.s.n + 1] <= this.s.t + 1e-9) this.s.n++;
      if (this.s.t >= 510) { this.stop(); this.finish0(); return; }
      this.draw0();
    },
    draw0() {
      const s = this.s, V = vAt(SUB[100], s.t);
      const hy = SY0 - V * SPX;
      const pl = $('g11cat_plunger'); if (pl) pl.setAttribute('transform', `translate(0 ${(hy - SY0).toFixed(1)})`);
      const gas = $('g11cat_gas'); if (gas) { gas.setAttribute('y', hy.toFixed(1)); gas.setAttribute('height', (SY0 - hy).toFixed(1)); }
      const i = Math.min(16, Math.floor(s.t / 30)), slope = s.t >= 510 ? 0 : (SUB[100][i + 1] - SUB[100][i]) / 30;
      const bub = $('g11cat_bub'); if (bub) bub.setAttribute('opacity', s.run ? Math.min(1, 0.15 + slope / 0.12).toFixed(2) : '0');
      const A = axes(C0);
      let p = '';
      for (let k = 1; k <= s.n; k++) p += cross(A.X(TT[k]), A.Y(SUB[100][k]), '#003d33');
      const pts = $('g11cat_pts'); if (pts) pts.innerHTML = p;
      for (let k = 1; k <= 17; k++) { const c = $('g11cat_c' + k); if (c) c.textContent = k <= s.n ? SUB[100][k].toFixed(1) : ''; }
      const st = $('g11cat_status');
      if (st) st.innerHTML = `⏱ الزمن: ${L(Math.floor(s.t) + ' s')} · قراءة المحقن: ${L((Math.round(V * 2) / 2).toFixed(1) + ' mL')}` + (s.done ? ' — <b>انتهت التجربة.</b>' : s.run ? ' — يتصاعد غاز الأكسجين…' : '');
    },
    finish0() {
      this.s.done = true; this.draw0();
      const A = axes(C0), F = fitExp('100', TT, SUB[100]);
      const cv = $('g11cat_curve'); if (cv) cv.innerHTML = fpath(F.f, 0, 510, A.X, A.Y, '#80cbc4', 3);
      const tp = $('g11cat_tanpanel');
      if (tp) tp.innerHTML = `<b>📐 المعدل الأولي بالمماس:</b> حرِّك المنزلق حتى يمسَّ الخطُّ الأحمر بداية المنحنى عند الأصل. المثلَّث قائم الزاوية ضلعه الأفقي ${L('x1 = 240 s')} (كما في الشكل ٣-٣ في الدليل)، فتقرأ ${L('y1')} وتحسب الميل ${L('y1 ÷ x1')}.
<div style="${CTRL}"><label>${L('y1')} = <input type="range" min="10" max="30" step="0.5" value="${this.s.y1}" style="width:260px;vertical-align:middle;" oninput="G11SIM_catalase.setY1(+this.value)"></label>
<button style="${btnStyle(false, '#C8102E')}" onclick="G11SIM_catalase.setY1(${GUIDE_Y1})">مماس الدليل</button></div>
<div id="g11cat_tanres" style="font-size:18px;text-align:center;"></div>`;
      this.setY1(this.s.y1);
      const q = $('g11cat_q'); if (q) q.style.display = 'block';
    },
    setY1(v) {
      this.s.y1 = v;
      const A = axes(C0), sl = v / GUIDE_X1, tEnd = Math.min(540, 25 / sl);
      const inp = document.querySelector('#g11cat_tanpanel input[type=range]'); if (inp && +inp.value !== v) inp.value = v;
      let s = `<line x1="${A.X(0)}" y1="${A.Y(0)}" x2="${A.X(tEnd).toFixed(1)}" y2="${A.Y(sl * tEnd).toFixed(1)}" stroke="#C8102E" stroke-width="2.6"/>`;
      const yTop = Math.min(25, v);
      s += `<line x1="${A.X(0)}" y1="${A.Y(0) - 2}" x2="${A.X(240)}" y2="${A.Y(0) - 2}" stroke="#C8102E" stroke-width="2" stroke-dasharray="6 4"/>`;
      s += `<line x1="${A.X(240)}" y1="${A.Y(0)}" x2="${A.X(240)}" y2="${A.Y(yTop)}" stroke="#C8102E" stroke-width="2" stroke-dasharray="6 4"/>`;
      s += TL(A.X(120), A.Y(0) - 8, 'x1 = 240 s', { c: '#C8102E', b: 1 });
      s += TL(A.X(240) + 6, A.Y(Math.min(yTop, 20) / 2 + 2), 'y1 = ' + v.toFixed(1) + ' mL' + (v > 25 ? ' ↑' : ''), { c: '#C8102E', b: 1, a: 'start' });
      const tg = $('g11cat_tan'); if (tg) tg.innerHTML = s;
      const r = this.rate(v, GUIDE_X1);
      let fb;
      if (v < 17) fb = `<span style="color:#C8102E">المماس أقلُّ انحداراً من بداية المنحنى ← المعدل المحسوب منخفض جدّاً «إذا رسم المماس مائلًا جدًا إلى اليمين» (الدليل ص ١٧٣).</span>`;
      else if (v > 24.5) fb = `<span style="color:#C8102E">المماس أشدُّ انحداراً من بداية المنحنى ← المعدل المحسوب مرتفع جدّاً «إذا رسم المماس عموديًا عند زاوية رأسيّة جدًا» (الدليل ص ١٧٣).</span>`;
      else fb = `<span style="color:#009A44">✓ المماس يمسُّ بداية المنحنى تقريباً.</span>` + (v === GUIDE_Y1 ? ` هذا مماس الدليل (الشكل ٣-٣).` : ` قارن بمماس الدليل: ${L('19/240 = 0.079 mL/s')}. «رسم المماس في المكان الخطأ أو الزاوية الخطأ: خطأ عشوائي، وله تأثير كبير على القيمة المحسوبة للمعدل الأولي».`);
      const out = $('g11cat_tanres');
      if (out) out.innerHTML = `المعدل الأولي = ${L(`y1 ÷ x1 = ${v.toFixed(1)} ÷ 240 = <b>${this.fmt3(r)}</b> mL/s`)} من غاز الأكسجين<br><span style="font-size:16px;">${fb}</span>`;
    },

    // ───────────── المرحلة 1 ─────────────
    s1: { done: { 100: 17 }, run: null, t: 0, n: 0, timer: null, speed: 30 },
    build1() {
      this.stop1(); this.s1 = { done: { 100: 17 }, run: null, t: 0, n: 0, timer: null, speed: 30 };
      const A = axes(C1A), B = axes(C1B);
      let g = A.s + T(C1A.x0 + C1A.w / 2, 28, 'حجم غاز الأكسجين مقابل الزمن', { b: 1, c: '#003d33' });
      g += B.s + T(C1B.x0 + C1B.w / 2, 28, 'المعدل الأولي مقابل التركيز', { b: 1, c: '#003d33' });
      g += `<g id="g11sub_curves"></g><g id="g11sub_rates"></g>`;
      const svg = SVG('g11sub_svg', 400, g);
      const btns = CONCS.map(c => `<button id="g11sub_b${c}" style="${btnStyle(c === 100, CCOL[c])}" onclick="G11SIM_catalase.run1(${c})">${L(c + '%')}</button>`).join('');
      const rows = TT.map((t, i) => `<tr><td style="${TD}">${t}</td>${CONCS.map(c => `<td style="${TD}" id="g11sub_v${c}_${i}"></td>`).join('')}</tr>`).join('');
      return `${svg}
<div style="${CTRL}"><b>شغِّل التجربة بتركيز بيروكسيد الهيدروجين:</b> ${btns}</div>
<div style="${CTRL}">
  <button style="${btnStyle(false)}" onclick="G11SIM_catalase.all1()">⏭ اعرض التراكيز كلَّها</button>
  <button style="${btnStyle(false)}" onclick="G11SIM_catalase.reset1()">↺ إعادة</button>
  <label>السرعة: <select style="${SEL}" onchange="G11SIM_catalase.s1.speed=+this.value"><option value="10">×10</option><option value="30" selected>×30</option><option value="60">×60</option></select></label>
</div>
<div style="${CTRL}font-size:18px;color:#003d33;" id="g11sub_status">منحنى ${L('100%')} من الاستقصاء ٣-١ مرسوم. اختر تركيزاً آخر من التخفيف التسلسلي (${L('80%، 60%، 40%، 20%')}).</div>
<div style="overflow-x:auto;"><table style="${TABLE}" id="g11sub_rt"><tr><th style="${TH}">تركيز المادة المتفاعلة (%) للمحلول الأصلي</th><th style="${TH}">المعدل الأولي للتفاعل / ${L('mL')} من غاز الأكسجين ${L('s⁻¹')}</th></tr>${CONCS.map(c => `<tr><td style="${TD}">${c}</td><td style="${TD}font-weight:bold;color:#00695c;" id="g11sub_r${c}"></td></tr>`).join('')}</table></div>
<div style="${NOTE}font-size:15px;">المنحنيات من قراءات <b>الجدول ٣-٢ في دليل المعلِّم (ص ١٧٦)</b>، والمعدلات الأوَّليَّة من <b>الجدول ٣-٣ (ص ١٧٧)</b>: «النتائج الواردة في الجدول ٣-٣ تقريبيّة. وتعتمد كثيرًا على مدى دقة مكان المماس على المنحنى وكيفيّة رسمه». الخطوط المنحنية خطوط مناسبة محسوبة من القراءات (توضيحيَّة).</div>
<div style="${WARN}font-size:15px;"><b>ملاحظة المنصَّة:</b> قيم الجدول ٣-٣ في الدليل لا تُستخرج عدديّاً من منحنيات الجدول ٣-٢ (فمنحنى ${L('100%')} نفسه أعطى ${L('0.079 mL/s')} في الاستقصاء ٣-١)؛ فقارن <b>شكل العلاقة</b> بين التركيز والمعدل الأوَّلي لا القيم المطلقة.</div>
<details style="${NOTE}"><summary style="cursor:pointer;font-weight:bold;">📋 جدول القراءات (الجدول ٣-٢ في الدليل) — يمتلئ مع كلِّ تجربة</summary><div style="overflow-x:auto;"><table style="${TABLE}"><tr><th style="${TH}">الزمن (s)</th>${CONCS.map(c => `<th style="${TH}color:${CCOL[c]}">${L(c + '%')}</th>`).join('')}</tr>${rows}</table></div><div id="g11sub_anom"></div></details>
<div id="g11sub_q" style="display:none;">${questionsHtml('inv_3_2_substrate', 'أسئلة الاستقصاء ٣-٢ (كتاب الأنشطة ص ١٠٣–١٠٥) وإجابات الدليل (ص ١٧٦–١٧٩)')}</div>`;
    },
    stop1() { if (this.s1 && this.s1.timer) { clearInterval(this.s1.timer); this.s1.timer = null; } },
    reset1() { this.stop1(); const st = $('simStage'); if (st && $('g11sub_svg')) { st.innerHTML = WRAP(this.build1()); this.draw1(); } },
    run1(c) {
      const s = this.s1; if (s.run != null) return;
      if (s.done[c] === 17) { this.draw1(); return; }
      s.run = c; s.t = 0; s.n = 0;
      s.timer = setInterval(() => this.tick1(), 100);
    },
    all1() { this.stop1(); const s = this.s1; s.run = null; CONCS.forEach(c => { s.done[c] = 17; }); this.draw1(); },
    tick1() {
      const s = this.s1;
      if (!$('g11sub_svg')) return this.stop1();
      s.t = Math.min(510, s.t + s.speed * 0.1);
      while (s.n < 17 && TT[s.n + 1] <= s.t + 1e-9) s.n++;
      s.done[s.run] = s.n;
      if (s.t >= 510) { s.done[s.run] = 17; s.run = null; this.stop1(); }
      this.draw1();
    },
    draw1() {
      const s = this.s1, A = axes(C1A), B = axes(C1B);
      let cv = '';
      CONCS.forEach(c => {
        const n = s.done[c]; if (n == null) return;
        if (n === 17) cv += fpath(fitExp('s' + c, TT, SUB[c]).f, 0, 510, A.X, A.Y, CCOL[c], 2.4);
        for (let k = 0; k <= n; k++) cv += cross(A.X(TT[k]), A.Y(SUB[c][k]), CCOL[c], 4);
        if (n === 17) cv += TL(A.X(510) + 3, A.Y(SUB[c][17]) + 5, c + '%', { a: 'start', c: CCOL[c], b: 1, fs: 16 });
        for (let k = 0; k < 18; k++) { const el = $(`g11sub_v${c}_${k}`); if (el) el.textContent = k <= n ? SUB[c][k].toFixed(1) : ''; }
      });
      if (s.run != null) { const V = vAt(SUB[s.run], s.t); cv += `<circle cx="${A.X(s.t).toFixed(1)}" cy="${A.Y(V).toFixed(1)}" r="5" fill="${CCOL[s.run]}"/>`; }
      const g1 = $('g11sub_curves'); if (g1) g1.innerHTML = cv;
      // المعدلات الأوَّليَّة (الجدول ٣-٣) للتجارب المكتملة، تُوصل بخطوط مستقيمة كما في الشكل ٣-٦
      const fin = CONCS.filter(c => s.done[c] === 17).sort((a, b) => a - b);
      let rs = '';
      if (fin.length > 1) rs += `<polyline points="${fin.map(c => B.X(c).toFixed(1) + ',' + B.Y(+SUB_RATE[c]).toFixed(1)).join(' ')}" fill="none" style="stroke:#37474f;stroke-width:2;"/>`;
      fin.forEach(c => { rs += cross(B.X(c), B.Y(+SUB_RATE[c]), CCOL[c], 5); });
      const g2 = $('g11sub_rates'); if (g2) g2.innerHTML = rs;
      CONCS.forEach(c => { const el = $('g11sub_r' + c); if (el) el.textContent = s.done[c] === 17 ? SUB_RATE[c] : ''; const b = $('g11sub_b' + c); if (b) b.setAttribute('style', btnStyle(s.done[c] != null, CCOL[c])); });
      const st = $('g11sub_status');
      if (st) st.innerHTML = s.run != null ? `⏱ التركيز ${L(s.run + '%')} — الزمن: ${L(Math.floor(s.t) + ' s')} · قراءة المحقن: ${L((Math.round(vAt(SUB[s.run], s.t) * 2) / 2).toFixed(1) + ' mL')}`
        : fin.length === 5 ? `اكتملت التراكيز الخمسة: كلَّما زاد تركيز المادة المتفاعلة زاد المعدل الأوَّلي، ويقترب من الاستقرار عند التراكيز العالية.` : `اكتمل ${L(fin.length + ' / 5')}. اختر تركيزاً آخر.`;
      const an = $('g11sub_anom');
      if (an) an.innerHTML = (s.done[100] != null && s.done[80] != null && s.done[80] >= 1) ? `<div style="${WARN}font-size:15px;">«بيّنت النتائج الأولية في الجدول ٣-٢ أن حجم غاز الأكسجين الناتج بعد 30 ثانية مع تركيز المادة المتفاعلة ${L('80% (3 mL)')} أكبر من حجمه مع تركيز المادة المتفاعلة ${L('100% (2 mL)')}» — قيمة متناقضة (الدليل ص ١٧٧).</div>` : '';
      [['g11sub_v80_1', 1], ['g11sub_v100_1', 1]].forEach(([id]) => { const el = $(id); if (el) el.style.outline = (s.done[100] >= 1 && s.done[80] >= 1) ? '2px solid #C8102E' : ''; });
      const q = $('g11sub_q'); if (q) q.style.display = fin.length === 5 ? 'block' : 'none';
    }
  };

  // ═══════════════════════════════════════════════════
  // g11_amylase — الجدول ٣-٥ (دليل المعلِّم ج2 ص ١٨٢)
  // ═══════════════════════════════════════════════════
  // T = زمن اختفاء النشا (s): 0 = «بداية الاختبار الأول»، Infinity = لا يختفي (الأنبوبة الضابطة)
  const AMY = [
    { c: '1.0', lab: '1%', T: 0, gTime: 'بداية الاختبار الأول', gRate: 'غير قابل للقياس' },
    { c: '0.8', lab: '0.8%', T: 60, gTime: '60', gRate: '16.7' },
    { c: '0.6', lab: '0.6%', T: 120, gTime: '120', gRate: '8.3' },
    { c: '0.4', lab: '0.4%', T: 120, gTime: '120', gRate: '8.3' },
    { c: '0.2', lab: '0.2%', T: 180, gTime: '180', gRate: '5.6' },
    { c: '0', lab: '0 (ضابط)', T: Infinity, gTime: '0', gRate: '0.0' }
  ];
  const SAMPLES = [0, 60, 120, 180, 240, 300];       // عيِّنة كلَّ دقيقة
  const BLUE = '#141a3f', BROWN = '#8d5a2b', IOD = '#e0913a';
  const hex = h => [1, 3, 5].map(k => parseInt(h.substr(k, 2), 16));
  const lerp = (a, b, f) => '#' + hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * f).toString(16).padStart(2, '0')).join('');
  const COLX = [160, 240, 320, 400, 480, 560], ROWY = [128, 178, 228, 278, 328, 378];
  const AX = { x0: 90, y0: 340, w: 540, h: 290, xmax: 1.0, ymax: 20, xg: 0.05, yg: 1, xl: 0.2, yl: 5, xt: 'تركيز محلول الإنزيم (%)', yt: 'معدل التفاعل (1/الزمن × 1000)', ytx: 34, fx: v => v.toFixed(1) };

  const AMYS = window.G11SIM_amylase = {
    data: AMY, samples: SAMPLES,
    // المعدل = 1 ÷ الزمن × 1000 مقرَّباً لأقرب منزلة عشريَّة (كتاب الأنشطة ص ١٠٩، س١)
    rate(T) { if (T === 0) return null; if (!isFinite(T)) return 0; return Math.round(10000 / T) / 10; },
    // لون قطرة اليود بعد إضافة عيِّنة أُخذت عند الزمن t
    color(T, t) { if (!isFinite(T)) return BLUE; if (t >= T) return IOD; return lerp(BLUE, BROWN, t / T); },
    // الزمن الذي يُرصد فيه الاختفاء بأخذ عيِّنة كلَّ دقيقة
    observed(T) { const t = SAMPLES.find(x => x >= T); return t == null ? Infinity : t; },
    s: { done: {}, sel: 1, run: false, t: 0, r: -1, timer: null, speed: 20, queue: [] },

    build0() {
      this.stop(); this.s = { done: {}, sel: 1, run: false, t: 0, r: -1, timer: null, speed: 20, queue: [] };
      let g = T(350, 30, 'بلاطة بيضاء ذات تجاويف — في كلِّ تجويف قطرة من محلول اليود', { b: 1, c: '#003d33' });
      // بقعتان مرجعيَّتان (الدليل ص ١٨١)
      g += `<rect x="16" y="88" width="104" height="250" rx="12" fill="#fff" stroke="#b0bec5" stroke-width="2"/>`;
      g += T(68, 112, 'بقعتان', { fs: 16, b: 1 }) + T(68, 132, 'مرجعيَّتان', { fs: 16, b: 1 });
      g += `<circle cx="68" cy="180" r="18" fill="#eceff1" stroke="#90a4ae"/><circle cx="68" cy="180" r="13" fill="${BLUE}"/>` + T(68, 222, 'يود + نشا', { fs: 16 });
      g += `<circle cx="68" cy="268" r="18" fill="#eceff1" stroke="#90a4ae"/><circle cx="68" cy="268" r="13" fill="${IOD}"/>` + T(68, 310, 'يود + ماء', { fs: 16 });
      // البلاطة
      g += `<rect x="128" y="62" width="466" height="346" rx="14" fill="#fff" stroke="#b0bec5" stroke-width="2.5"/>`;
      AMY.forEach((a, j) => { g += TL(COLX[j], 88, a.c === '0' ? '0' : a.c === '1.0' ? '1%' : a.lab, { b: 1, c: '#003d33' }); });
      g += T(COLX[5], 104, '(ضابط)', { fs: 16, c: '#78909c' });
      SAMPLES.forEach((t, r) => { g += TL(642, ROWY[r] + 6, t + ' s', { b: 1, c: '#455a64' }); });
      g += T(648, 72, 'زمن العيِّنة', { fs: 16, b: 1, c: '#455a64' });
      AMY.forEach((a, j) => SAMPLES.forEach((t, r) => {
        g += `<circle cx="${COLX[j]}" cy="${ROWY[r]}" r="19" fill="#eceff1" stroke="#b0bec5" stroke-width="1.5"/><circle id="g11amy_d${j}_${r}" cx="${COLX[j]}" cy="${ROWY[r]}" r="13" fill="${IOD}" opacity="0.4"/>`;
      }));
      g += `<rect id="g11amy_col" x="${COLX[1] - 32}" y="110" width="64" height="292" rx="10" fill="none" stroke="#C8102E" stroke-width="2.5" stroke-dasharray="7 5"/>`;
      g += T(360, 434, 'القطرات الباهتة: يود لم تُضف إليه عيِّنة بعد', { fs: 16, c: '#78909c' });
      g += `<circle id="g11amy_ring" cx="-50" cy="-50" r="22" fill="none" stroke="#C8102E" stroke-width="3"/>`;
      const svg = SVG('g11amy_svg', 450, g);
      const btns = AMY.map((a, j) => `<button id="g11amy_b${j}" style="${btnStyle(j === 1)}" onclick="G11SIM_amylase.pick(${j})">${a.c === '0' ? L('0') + ' ضابط' : L(a.c === '1.0' ? '1%' : a.lab)}</button>`).join('');
      return `${svg}
<div style="${CTRL}"><b>تركيز الأميليز:</b> ${btns}</div>
<div style="${CTRL}">
  <button style="${btnStyle(true)}" onclick="G11SIM_amylase.start()">▶ اسكب النشا وابدأ</button>
  <button style="${btnStyle(false)}" onclick="G11SIM_amylase.runAll()">⏭ شغِّل التراكيز كلَّها</button>
  <button style="${btnStyle(false)}" onclick="G11SIM_amylase.reset()">↺ إعادة</button>
  <label>السرعة: <select style="${SEL}" onchange="G11SIM_amylase.s.speed=+this.value"><option value="1">×1</option><option value="10">×10</option><option value="20" selected>×20</option><option value="60">×60</option></select></label>
</div>
<div style="${CTRL}font-size:18px;color:#003d33;" id="g11amy_status">الأنابيب في الحمَّام المائي على ${L('40 ˚C')}. اختر تركيزاً ثمَّ اضغط «ابدأ»: تُنقل عيِّنة من الخليط إلى قطرة يود جديدة كلَّ دقيقة.</div>
<table style="${TABLE}"><tr><th style="${TH}">تركيز محلول الإنزيم (%)</th><th style="${TH}">الزمن الذي استغرقه النشا لكي يختفي (s)</th></tr>${AMY.map((a, j) => `<tr><td style="${TD}">${L(a.c)}</td><td style="${TD}font-weight:bold;color:#00695c;" id="g11amy_r${j}"></td></tr>`).join('')}</table>
<div id="g11amy_note"></div>`;
    },
    stop() { if (this.s && this.s.timer) { clearInterval(this.s.timer); this.s.timer = null; } if (this.s) this.s.run = false; },
    reset() { this.stop(); const st = $('simStage'); if (st && $('g11amy_svg')) st.innerHTML = WRAP(this.build0()); },
    pick(j) { if (this.s.run) return; this.s.sel = j; this.draw0(); },
    start() {
      const s = this.s; if (s.run) return;
      if (s.done[s.sel] !== undefined) this.clearCol(s.sel);
      s.run = true; s.t = 0; s.r = -1; this.draw0();
      s.timer = setInterval(() => this.tick(), 100);
      this.tick(true);
    },
    runAll() {
      const s = this.s; if (s.run) return;
      s.queue = AMY.map((a, j) => j).filter(j => s.done[j] === undefined);
      if (!s.queue.length) return;
      s.sel = s.queue.shift(); this.start();
    },
    clearCol(j) { delete this.s.done[j]; SAMPLES.forEach((t, r) => { const d = $(`g11amy_d${j}_${r}`); if (d) { d.setAttribute('fill', IOD); d.setAttribute('opacity', '0.4'); } }); const c = $('g11amy_r' + j); if (c) c.textContent = ''; },
    tick(first) {
      const s = this.s, a = AMY[s.sel];
      if (!$('g11amy_svg')) return this.stop();
      if (!first) s.t += s.speed * 0.1;
      while (s.r + 1 < SAMPLES.length && SAMPLES[s.r + 1] <= s.t + 1e-9) {
        s.r++;
        const ts = SAMPLES[s.r], col = this.color(a.T, ts);
        const d = $(`g11amy_d${s.sel}_${s.r}`); if (d) { d.setAttribute('fill', col); d.setAttribute('opacity', '1'); }
        const ring = $('g11amy_ring'); if (ring) { ring.setAttribute('cx', COLX[s.sel]); ring.setAttribute('cy', ROWY[s.r]); }
        if (col === IOD) { s.done[s.sel] = ts; return this.endRun(); }
        if (s.r === SAMPLES.length - 1) { s.done[s.sel] = Infinity; return this.endRun(); }
      }
      this.draw0();
    },
    endRun() {
      this.stop(); this.draw0();
      const s = this.s;
      if (s.queue && s.queue.length) { s.sel = s.queue.shift(); setTimeout(() => this.start(), 500); }
    },
    timeText(j) { const v = this.s.done[j]; if (v === undefined) return ''; if (v === 0) return AMY[j].gTime; if (!isFinite(v)) return 'لا يختفي'; return String(v); },
    draw0() {
      const s = this.s;
      AMY.forEach((a, j) => { const b = $('g11amy_b' + j); if (b) b.setAttribute('style', btnStyle(j === s.sel)); const c = $('g11amy_r' + j); if (c) c.textContent = this.timeText(j); });
      const col = $('g11amy_col'); if (col) col.setAttribute('x', COLX[s.sel] - 32);
      if (!s.run) { const ring = $('g11amy_ring'); if (ring) ring.setAttribute('cx', -50); }
      const a = AMY[s.sel], st = $('g11amy_status');
      if (st) {
        if (s.run) st.innerHTML = `⏱ التركيز ${L(a.c + '%')} — الزمن: ${L(Math.floor(s.t) + ' s')}` + (s.r >= 0 ? ` · آخر عيِّنة عند ${L(SAMPLES[s.r] + ' s')}: ${this.color(a.T, SAMPLES[s.r]) === BLUE ? 'أزرق قاتم (يوجد نشا)' : 'بنِّي (ما زال بعض النشا)'}` : '');
        else if (s.done[s.sel] !== undefined) {
          const v = s.done[s.sel];
          st.innerHTML = v === 0 ? `تركيز ${L('1%')}: لم يتغيَّر لون اليود منذ <b>بداية الاختبار الأول</b> — اختفى النشا بأسرع ممَّا تقيسه العيِّنات، فالمعدل «غير قابل للقياس».`
            : !isFinite(v) ? `الأنبوبة الضابطة (ماء مقطَّر بدل الإنزيم): بقي اللون أزرق قاتماً في كلِّ العيِّنات — <b>لا يختفي النشا</b>.`
              : `تركيز ${L(a.c + '%')}: لم يعد لون اليود يتغيَّر عند ${L(v + ' s')} ← اختفى النشا.`;
        }
      }
      const all = AMY.every((x, j) => s.done[j] !== undefined), note = $('g11amy_note');
      if (note) note.innerHTML = all ? `<div style="${WARN}">«أخذت العيّنات على فترات متباعدة من دقيقة واحدة، لذا لا يمكننا الحكم على وقت اختفاء النشا إلّا إلى أقرب دقيقة (يمكن أن يفسر ذلك الوقت الذي يسجل في نتائج العيّنة لمحلولَين مختلفَين من الأميليز)» — لاحظ أنَّ ${L('0.6%')} و${L('0.4%')} سُجِّل لكليهما ${L('120 s')} (دليل المعلِّم ص ١٨٣). انتقل إلى المرحلة ٢ لحساب المعدل.</div>` : '';
    },

    build1() {
      this.stop();
      const A = axes(AX);
      let g = A.s + T(360, 30, 'معدل التفاعل مقابل تركيز الإنزيم (الشكل ٣-٧ في الدليل)', { b: 1, c: '#003d33' });
      const pts = AMY.filter(a => a.T !== 0).map(a => ({ x: +a.c, y: this.rate(a.T) })).sort((p, q) => p.x - q.x);
      g += `<polyline points="${pts.map(p => A.X(p.x).toFixed(1) + ',' + A.Y(p.y).toFixed(1)).join(' ')}" fill="none" style="stroke:#00695c;stroke-width:2.4;"/>`;
      pts.forEach(p => { g += cross(A.X(p.x), A.Y(p.y), '#003d33', 6) + (p.x > 0 ? TL(A.X(p.x), A.Y(p.y) - 12, p.y.toFixed(1), { b: 1, c: '#00695c' }) : ''); });
      g += `<line x1="${A.X(1)}" y1="${A.Y(0)}" x2="${A.X(1)}" y2="${A.Y(19)}" stroke="#C8102E" stroke-width="2" stroke-dasharray="6 5"/>`;
      g += T(A.X(1) - 6, A.Y(18.6), 'غير قابل', { a: 'start', c: '#C8102E', b: 1 }) + T(A.X(1) - 6, A.Y(17.2), 'للقياس', { a: 'start', c: '#C8102E', b: 1 });
      const svg = SVG('g11amy_svg1', 400, g);
      const rows = AMY.map((a, j) => {
        const r = this.rate(a.T);
        const calc = a.T === 0 ? 'غير قابل للقياس' : !isFinite(a.T) ? '0.0' : `${L(`1 ÷ ${a.T} × 1000 = <b>${r.toFixed(1)}</b>`)}`;
        return `<tr><td style="${TD}">${L(a.c)}</td><td style="${TD}">${a.T === 0 ? a.gTime : !isFinite(a.T) ? 'لا يختفي<sup>*</sup>' : a.T}</td><td style="${TD}color:#00695c;">${calc}</td></tr>`;
      }).join('');
      const opts = AMY.filter(a => a.T > 0 && isFinite(a.T)).map(a => `<option value="${a.T}">${a.c}% (${a.T} s)</option>`).join('');
      return `${svg}
<table style="${TABLE}"><tr><th style="${TH}">تركيز محلول الإنزيم (%)</th><th style="${TH}">الزمن الذي استغرقه النشا لكي يختفي (s)</th><th style="${TH}">معدل التفاعل (${L('1/الزمن × 1000')})</th></tr>${rows}</table>
<div style="${NOTE}font-size:15px;">نتائج العيِّنة من <b>دليل المعلِّم ج2 ص ١٨٢ (الجدول ٣-٥)</b>. <sup>*</sup>في الجدول كُتب للتركيز ${L('0')} زمن «${L('0')}» ومعدل «${L('0.0')}»، والمقصود أنَّ النشا لم يختفِ في الأنبوبة الضابطة. «صِل النقاط بخطوط مستقيمة باستخدام المسطرة» (كتاب الأنشطة ص ١٠٩).</div>
<div style="${CTRL}"><b>احسب بنفسك:</b> <select id="g11amy_qs" style="${SEL}">${opts}</select> المعدل = <input id="g11amy_qi" type="number" step="0.1" style="${SEL}width:90px;" placeholder="؟"> <button style="${btnStyle(true)}" onclick="G11SIM_amylase.check()">تحقَّق</button><span id="g11amy_qr" style="font-weight:bold;"></span></div>
<div style="${WARN}"><b>⚠ ما يقوله الدليل عن دقَّة هذه التجربة:</b><br>• «توصف هذه التجربة بأنها غير دقيقة، فقد يفشل الأميليز أحيانًا في هضم النشا بشكل كامل، أو قد يهضمه بسرعة كبيرة بحيث لا يمكن قياس أيّة اختلافات في المعدل بين التراكيز المختلفة» (ص ١٨٠).<br>• «من الصعب جدًا، إن لم يكن مستحيلًا، تحديد وقت توقّف محلول اليود عن إعطاء نتيجة إيجابيّة مع النشا» (ص ١٨١).<br>• «أخذت العيّنات على فترات متباعدة من دقيقة واحدة، لذا لا يمكننا الحكم على وقت اختفاء النشا إلّا إلى أقرب دقيقة» (ص ١٨٣) — ولذلك تساوى ${L('0.6%')} و${L('0.4%')} عند ${L('120 s')} فصار الخطُّ أفقيّاً بينهما، وليس خطّاً مستقيماً كما في الشكل ٣-٩ب في كتاب الطالب.</div>
${questionsHtml('inv_3_3_enzyme_conc', 'أسئلة الاستقصاء ٣-٣ (كتاب الأنشطة ص ١٠٨–١١٠) وإجابات الدليل (ص ١٨٢–١٨٣)')}`;
    },
    check() {
      const T0 = +$('g11amy_qs').value, v = parseFloat($('g11amy_qi').value), r = this.rate(T0), out = $('g11amy_qr');
      if (!out) return;
      if (isNaN(v)) { out.innerHTML = ' اكتب قيمة.'; return; }
      out.innerHTML = Math.abs(v - r) < 0.051 ? ` <span style="color:#009A44">✓ صحيح: ${L(`1 ÷ ${T0} × 1000 = ${r.toFixed(1)}`)}</span>` : ` <span style="color:#C8102E">✗ أعد الحساب: المعدل = 1 ÷ الزمن، ثمَّ اضرب في ${L('1000')} وقرِّب لأقرب منزلة عشريَّة.</span>`;
    }
  };

  // ═══════════════════════════════════════════════════
  // التسجيل
  // ═══════════════════════════════════════════════════
  G.simulations = Object.assign(G.simulations || {}, {
    g11_catalase: {
      sem: 'S1',
      title: '⏱ الكتاليز ومحقن الغاز (الاستقصاءان ٣-١ و٣-٢)',
      stages: ['الدورة الزمنيَّة للتفاعل والمعدل الأوَّلي (٣-١)', 'تأثير تركيز المادة المتفاعلة (٣-٢)'],
      info: [
        'يمكن إجراء استقصاء عن سير التفاعل الذي يتحكم فيه الإنزيم بقياس معدل تكوّن الناتج من المادة المتفاعلة. … حالما يمتزج الإنزيم بالمادة المتفاعلة، تتحرر فقاعات غاز الأكسجين O<sub>2</sub> الذي يمكن جمعه بكميات كبيرة، وقياسه في الدقيقة الأولى من التفاعل. ومع استمرار التفاعل، ينخفض معدل تحرير غاز O<sub>2</sub> تدريجيًا، ويتباطأ التفاعل إلى أن يتوقف كليًا. (كتاب الطالب ص ١٠٩) يكون منحنى التمثيل البياني، كما هو مبيّن في الشكل ٣-٥ أعلى ميلًا في بداية التفاعل. ويكون معدل التفاعل الذي يتحكم به الإنزيم سريعًا دائمًا في بدايته، ويسمّى هذا المعدّل بالمعدّل الأولي للتفاعل. (كتاب الطالب ص ١١٠)',
        'يزداد المعدل الأولي للتفاعل أيضًا بازدياد تركيز المادة المتفاعلة، وهو أمر متوقع؛ فكلما ازداد عدد جزيئات المادة المتفاعلة ازداد عدد مرات دخولها إلى المواقع النشطة. إلّا أنه مع استمرار زيادة تركيز المادة المتفاعلة، والحفاظ على تركيز الإنزيم ثابتًا، ستمتلئ جميع المواقع النشطة للإنزيم. (كتاب الطالب ص ١١٣)'
      ],
      build(i) { return WRAP(i === 1 ? (setTimeout(() => CAT.draw1(), 0), CAT.build1()) : CAT.build0()); }
    },
    g11_amylase: {
      sem: 'S1',
      title: '🧪 تركيز الأميليز واختبار اليود (الاستقصاء ٣-٣)',
      stages: ['التجربة على بلاطة اليود', 'حساب المعدل والتمثيل البياني'],
      info: [
        'يسهل علينا في بعض الأحيان قياس معدل اختفاء المادة المتفاعلة بدل معدل ظهور الناتج. ومن الأمثلة الجيدة على ذلك، استخدام الأميليز. يفكك هذا الإنزيم النشا إلى السكّر المختزل المالتوز بعمليّة التحلل المائي، فيتفاعل النشا مع محلول اليود لينتج لونًا أزرق قاتمًا، ويمكن أخذ عيّنات صغيرة في أوقات معروفة أثناء التفاعل للكشف عن النشا باستخدام محلول اليود. ومع تحوّل النشا إلى مالتوز، ينخفض تركيز النشا في المزيج المتفاعل. وبالتالي، يتغيّر لون العيّنات قيد الاختبار من الأزرق القاتم إلى البنّي، ثم البنّي الباهت، وصولًا في النهاية إلى زوال اللون. (كتاب الطالب ص ١١١ — مهارات عملية ٣-١)',
        'فكلما زادت كمية الإنزيم زادت المواقع النشطة المتاحة لارتباط المادة المتفاعلة. ومع وفرة المادة المتفاعلة، يزداد المعدل الأولي للتفاعل خطيًا مع تركيز الإنزيم. (كتاب الطالب ص ١١٣)'
      ],
      build(i) { return WRAP(i === 1 ? AMYS.build1() : AMYS.build0()); }
    }
  });
})();
