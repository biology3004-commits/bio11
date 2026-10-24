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

// ═══════════════════════════════════════════════════════════════════════
// محاكيات الدروس ٣-٤ … ٣-٧ (أدوات: يغيِّر الطالب متغيِّراً ويقرأ النتيجة)
// g11_enzyme_factors : العوامل المؤثِّرة — الأشكال ٣-٧ و٣-٨ و٣-٩ و٣-١٠ (كتاب الطالب ص ١١١–١١٣)
// g11_vmax_km        : Vmax وKm (نشاط ٣-٢، كتاب الأنشطة ص ٨٨–٨٩) والألفة (الشكل ٣-١٢، سؤال ٥)
//                      والمثبِّطات (ص ١١٥–١١٦ + سؤال نهاية الوحدة ٩ ص ١٢٣ وإجابته في الدليل ج2 ص ١٦٣)
// g11_immobilised    : اللاكتيز المثبَّت (ص ١١٧–١١٨ + سؤال نهاية الوحدة ٨ ص ١٢٢) واستقرار البكتينيز
//                      المثبَّت أثناء التخزين (كتاب الأنشطة ص ١١٣، أسئلة نهاية الوحدة ٣)
// منحنيات الأشكال رُقمِنت من صور صفحات الكتاب (قراءة تقريبيَّة)؛ ما وُسم «توضيحي» ليس في الكتاب بأرقامه.
// لا تكرِّر الديوراما enzyme_action / enzyme_inhibitors / immobilised_enzymes (عروض خطوات ثلاثيَّة الأبعاد).
// ═══════════════════════════════════════════════════════════════════════
(function () {
  const G = window.G11_DATA = window.G11_DATA || {};

  // ───────── أدوات رسم (نسخة محلِّيَّة؛ أدوات الكتلة السابقة داخل نطاقها) ─────────
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
  const SEL = 'font-family:Tajawal,sans-serif;font-size:16px;padding:4px 8px;border-radius:8px;border:2px solid #00695c;';
  const RANGE = 'width:240px;max-width:60vw;accent-color:#00695c;vertical-align:middle;';
  const INP = 'font-family:Tajawal,sans-serif;font-size:16px;width:80px;padding:3px 6px;border-radius:8px;border:2px solid #00695c;direction:ltr;text-align:center;';
  const TAG = '<span style="background:#fff3e0;color:#e65100;border:1px solid #ffb74d;border-radius:6px;padding:0 6px;font-size:16px;">توضيحي</span>';
  const L = s => `<span dir="ltr" style="unicode-bidi:isolate;white-space:nowrap">${s}</span>`;
  const VMX = L('V<sub>max</sub>'), KM = L('K<sub>m</sub>'), HVM = L('½V<sub>max</sub>');
  const $ = id => document.getElementById(id);
  const WRAP = h => `<div style="width:100%;max-width:720px;margin:0 auto;">${h}</div>`;
  const ok = t => `<span style="color:#009A44;font-weight:bold;">✓ ${t}</span>`;
  const no = t => `<span style="color:#C8102E;font-weight:bold;">✗ ${t}</span>`;
  const cross = (x, y, c, r = 5) => `<line x1="${x - r}" y1="${y - r}" x2="${x + r}" y2="${y + r}" stroke="${c}" stroke-width="2.4"/><line x1="${x - r}" y1="${y + r}" x2="${x + r}" y2="${y - r}" stroke="${c}" stroke-width="2.4"/>`;
  // مسار دالَّة (stroke عبر style حتى لا يضيف زرُّ الأنيميشن نقاطاً جارية عليه)
  const fpath = (f, t0, t1, X, Y, c, w, dash, op) => {
    let d = '';
    for (let k = 0; k <= 120; k++) { const t = t0 + (t1 - t0) * k / 120; d += (k ? 'L' : 'M') + X(t).toFixed(1) + ' ' + Y(f(t)).toFixed(1); }
    return `<path d="${d}" fill="none" style="stroke:${c};stroke-width:${w || 2.5};${dash ? 'stroke-dasharray:' + dash + ';' : ''}${op != null ? 'opacity:' + op + ';' : ''}"/>`;
  };
  const dline = (x1, y1, x2, y2, c, w, dash) => `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${c}" stroke-width="${w || 2}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
  // استيفاء تكعيبي رتيب (Fritsch–Carlson): يمرُّ بالنقاط تماماً ولا يتجاوزها (قمَّة المنحنى تبقى في مكانها)
  function mono(xs, ys) {
    const n = xs.length, d = [], m = [];
    for (let i = 0; i < n - 1; i++) d.push((ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]));
    m[0] = d[0]; m[n - 1] = d[n - 2];
    for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
    for (let i = 0; i < n - 1; i++) {
      if (d[i] === 0) { m[i] = 0; m[i + 1] = 0; continue; }
      const a = m[i] / d[i], b = m[i + 1] / d[i], s = a * a + b * b;
      if (s > 9) { const t = 3 / Math.sqrt(s); m[i] = t * a * d[i]; m[i + 1] = t * b * d[i]; }
    }
    return x => {
      if (x <= xs[0]) return ys[0]; if (x >= xs[n - 1]) return ys[n - 1];
      let i = 0; while (x > xs[i + 1]) i++;
      const h = xs[i + 1] - xs[i], t = (x - xs[i]) / h, t2 = t * t, t3 = t2 * t;
      return (2 * t3 - 3 * t2 + 1) * ys[i] + (t3 - 2 * t2 + t) * h * m[i] + (-2 * t3 + 3 * t2) * ys[i + 1] + (t3 - t2) * h * m[i + 1];
    };
  }
  // إطار تمثيل بياني: o = {id,x0,y0,w,h,xmin,xmax,ymin,ymax,gx,gy,xl:[[v,label]],yl:[[v,label]],xt,yt,ytx,bg}
  function frame(o) {
    const ymin = o.ymin || 0;
    const X = v => o.x0 + (v - o.xmin) / (o.xmax - o.xmin) * o.w, Y = v => o.y0 - (v - ymin) / (o.ymax - ymin) * o.h;
    let s = '';
    if (o.bg === 'blue') s += `<defs><linearGradient id="${o.id}_g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bcd5ee"/><stop offset="1" stop-color="#e3edf5"/></linearGradient></defs><rect x="${o.x0}" y="${o.y0 - o.h}" width="${o.w}" height="${o.h}" fill="url(#${o.id}_g)"/>`;
    else s += `<rect x="${o.x0}" y="${o.y0 - o.h}" width="${o.w}" height="${o.h}" fill="#fff"/>`;
    const gc = o.bg === 'blue' ? '#cfe0f0' : '#e0eeec';
    (o.gx || []).forEach(v => s += `<line x1="${X(v)}" y1="${o.y0}" x2="${X(v)}" y2="${o.y0 - o.h}" stroke="${gc}" stroke-width="1"/>`);
    (o.gy || []).forEach(v => s += `<line x1="${o.x0}" y1="${Y(v)}" x2="${o.x0 + o.w}" y2="${Y(v)}" stroke="${gc}" stroke-width="1"/>`);
    s += `<line x1="${o.x0}" y1="${o.y0}" x2="${o.x0 + o.w + 6}" y2="${o.y0}" stroke="#37474f" stroke-width="2.2"/><line x1="${o.x0}" y1="${o.y0}" x2="${o.x0}" y2="${o.y0 - o.h - 6}" stroke="#37474f" stroke-width="2.2"/>`;
    s += `<path d="M${o.x0 + o.w + 12} ${o.y0} l-8 -5 v10 z" fill="#37474f"/><path d="M${o.x0} ${o.y0 - o.h - 12} l-5 8 h10 z" fill="#37474f"/>`;
    (o.xl || []).forEach(([v, l]) => s += `<line x1="${X(v)}" y1="${o.y0}" x2="${X(v)}" y2="${o.y0 + 5}" stroke="#37474f" stroke-width="1.6"/>` + TL(X(v), o.y0 + 21, l));
    (o.yl || []).forEach(([v, l]) => s += `<line x1="${o.x0 - 5}" y1="${Y(v)}" x2="${o.x0}" y2="${Y(v)}" stroke="#37474f" stroke-width="1.6"/>` + TL(o.x0 - 8, Y(v) + 5, l, { a: 'end' }));
    if (o.xt) s += T(o.x0 + o.w / 2, o.xty || (o.y0 + (o.xl && o.xl.length ? 44 : 26)), o.xt, { c: '#003d33', b: 1 });
    if (o.yt) { const yx = o.ytx || (o.x0 - 40), yy = o.y0 - o.h / 2; s += T(yx, yy, o.yt, { c: '#003d33', b: 1, tr: `rotate(-90 ${yx} ${yy})` }); }
    return { s, X, Y, o };
  }
  const range = (a, b, st) => { const r = []; for (let v = a; v <= b + 1e-9; v += st) r.push(+v.toFixed(6)); return r; };

  // ═══════════════════════════════════════════════════════════════════════
  // ١) g11_enzyme_factors — العوامل المؤثِّرة في عمل الإنزيم (الدرس ٣-٤)
  // ═══════════════════════════════════════════════════════════════════════
  // الشكل ٣-٧ (ص ١١١): رُقمِن من صورة الصفحة — القمَّة عند 40 °C، والمنحنى يبلغ الصفر عند ≈ 55 °C (معدل نسبي 0–1)
  const TEMP_X = [0, 5, 10, 15, 20, 25, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 55.5, 60];
  const TEMP_Y = [0.017, 0.044, 0.093, 0.167, 0.27, 0.42, 0.614, 0.714, 0.831, 0.946, 0.991, 1, 0.983, 0.923, 0.811, 0.682, 0.534, 0.366, 0.169, 0, 0];
  // الشكل ٣-٨ (ص ١١١): القمَّة عند pH 7، والمنحنى بين ≈ 3 و≈ 11
  const PH_X = [1, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 13];
  const PH_Y = [0, 0, 0.011, 0.043, 0.117, 0.272, 0.605, 0.85, 0.969, 1, 0.969, 0.85, 0.605, 0.272, 0.117, 0.043, 0.011, 0, 0];
  // الشكل ٣-١٠ (ص ١١٣): المعدل الأوَّلي ÷ Vmax مقابل تركيز المادة المتفاعلة (المحور بلا أرقام في الكتاب: 0–1)
  const SUB_X = range(0, 1, 0.05);
  const SUB_Y = [0, 0.119, 0.218, 0.308, 0.397, 0.479, 0.553, 0.621, 0.68, 0.734, 0.783, 0.824, 0.86, 0.89, 0.915, 0.937, 0.954, 0.968, 0.978, 0.985, 0.989];
  // الشكل ٣-٩أ (ص ١١٢): حجم الأكسجين (mL) كلَّ 30 s لكلِّ حجم من مستخلص الكرفس — قراءة من الشكل؛
  // نقطة 30 s مأخوذة بحيث تطابق المعدلات المرسومة في الشكل ٣-٩ب: 1.1، 1.8، 3.4، 5.4، 7.0 mL O2 min⁻¹
  const EC_T = [0, 30, 60, 90, 120, 150, 180, 210, 240];
  const EC_V = [0.5, 1, 2, 3, 4];
  const EC_D = {
    0.5: [0, 0.55, 0.9, 1.15, 1.7, 1.9, 2.17, 2.4, 2.55],
    1: [0, 0.9, 1.73, 2.43, 3.0, 3.67, 4.2, 4.7, 5.1],
    2: [0, 1.7, 2.92, 4.0, 4.9, 5.7, 6.5, 7.1, 7.6],
    3: [0, 2.7, 4.4, 5.7, 6.68, 7.5, 8.18, 8.7, 9.0],
    4: [0, 3.5, 5.37, 6.8, 7.85, 8.7, 9.3, 9.65, 9.9]
  };
  const EC_COL = { 0.5: '#e0589b', 1: '#7468b0', 2: '#e31e24', 3: '#f5a623', 4: '#78909c' };
  const fTemp = mono(TEMP_X, TEMP_Y), fPH = mono(PH_X, PH_Y), fSub = mono(SUB_X, SUB_Y);
  const fEC = {}; EC_V.forEach(v => fEC[v] = mono(EC_T, EC_D[v]));
  const ecRate = v => +(EC_D[v][1] / 30 * 60).toFixed(2);          // المعدل في أوَّل 30 s بوحدة mL O2 min⁻¹
  const ecSlope = () => { let a = 0, b = 0; EC_V.forEach(v => { a += v * ecRate(v); b += v * v; }); return a / b; }; // خطٌّ مستقيم يمرُّ بنقطة الأصل

  const fmtT = x => `${x} °C`, fmtPH = x => `pH ${(+x).toFixed(1)}`;
  const CURVE_CFG = [
    { // درجة الحرارة
      f: fTemp, xmin: 0, xmax: 60, step: 1, def: 25, fmt: fmtT, lab: 'درجة الحرارة',
      title: `الشكل ٣-٧ تأثير درجة الحرارة على تفاعل يتحكم به الإنزيم`,
      xl: range(0, 60, 10).map(v => [v, String(v)]), gx: range(0, 60, 10), xt: `درجة الحرارة (${N('°C')})`,
      marks(F) {
        const X = F.X, Y = F.Y;
        let s = dline(X(40), F.o.y0, X(40), Y(1), '#37474f', 1.6, '6 5');
        s += dline(X(43.5), Y(fTemp(43.5)), 508, 92, '#37474f', 1.3) + T(512, 98, 'مسخ الإنزيم', { a: 'end', fs: 16 });
        s += dline(X(40), F.o.y0 - 2, 508, 250, '#37474f', 1.3) + T(512, 246, 'درجة الحرارة', { a: 'end', fs: 16 }) + T(512, 266, 'المثلى', { a: 'end', fs: 16 });
        s += dline(X(55.4), F.o.y0 - 2, 508, 300, '#37474f', 1.3) + T(512, 304, 'مسخ الإنزيم', { a: 'end', fs: 16 }) + T(512, 324, 'كليًا', { a: 'end', fs: 16 });
        return s;
      },
      state(x, v) {
        if (x >= 55.5) return `⛔ <b>مسخ الإنزيم كليًا</b> (الشكل ٣-٧): معدل التفاعل صفر عند هذه الدرجة.`;
        if (x > 42) return `⚠️ <b>مسخ الإنزيم</b> (الشكل ٣-٧): بعد درجة الحرارة المثلى ينخفض معدل التفاعل بسرعة. «ويتضمن تأثير ارتفاع درجة الحرارة على تغيير طبيعة الإنزيم (مسخ)» (كتاب الطالب ص ١١١).`;
        if (x >= 38) return `★ <b>درجة الحرارة المثلى</b> (الشكل ٣-٧): أعلى معدل للتفاعل — عند ${L('40 °C')} لهذا الإنزيم النموذجي.`;
        return `↗ قبل درجة الحرارة المثلى: يزداد معدل التفاعل كلَّما ارتفعت درجة الحرارة (قراءة الشكل ٣-٧).`;
      }
    },
    { // الرقم الهيدروجيني
      f: fPH, xmin: 0, xmax: 14, step: 0.5, def: 5, fmt: fmtPH, lab: 'الرقم الهيدروجيني',
      title: `الشكل ٣-٨ تأثير الرقم الهيدروجيني ${N('pH')} على تفاعل يتحكم به الإنزيم`,
      xl: [1, 3, 5, 7, 9, 11, 13].map(v => [v, String(v)]), gx: [1, 3, 5, 7, 9, 11, 13], xt: N('pH'),
      marks(F) {
        const X = F.X, Y = F.Y;
        let s = dline(X(7), F.o.y0, X(7), Y(1), '#37474f', 1.6, '6 5');
        s += dline(X(7), F.o.y0 - 2, 508, 200, '#37474f', 1.3) + T(512, 196, 'الرقم الهيدروجيني', { a: 'end', fs: 16 }) + T(512, 216, `${N('pH')} الأمثل`, { a: 'end', fs: 16 });
        return s;
      },
      state(x, v) {
        const base = ` «يعتمد الرقم الهيدروجيني ${L('pH')} الأمثل على الإنزيم: في هذه الحالة، الرقم الهيدروجيني ${L('pH')} الأمثل هو ${L('7')}.» (كتاب الطالب ص ١١١)`;
        if (Math.abs(x - 7) < 0.26) return `★ <b>الرقم الهيدروجيني ${L('pH')} الأمثل</b> (الشكل ٣-٨): أعلى معدل للتفاعل.` + base;
        if (v < 0.02) return `⛔ معدل التفاعل يكاد يكون صفراً عند هذا الرقم الهيدروجيني (قراءة الشكل ٣-٨).` + base;
        return `↘ كلَّما ابتعد الرقم الهيدروجيني عن قيمته المثلى (أعلى منها أو أقلَّ) انخفض معدل التفاعل (قراءة الشكل ٣-٨).` + base;
      }
    }
  ];

  const EF = window.G11SIM_enzfac = {
    // ── دوال حساب خالصة (يختبرها سكربت التحقُّق) ──
    fTemp, fPH, fSub, fEC, ecRate, ecSlope, EC_D, EC_V,
    s: { 0: 25, 1: 5, ec: { sel: 2, seen: [2], q3: false }, sub: 0.3 },
    _F: {},

    // ───────── المرحلتان 0 و1: منحنى + منزلق ─────────
    buildCurve(i) {
      const c = CURVE_CFG[i];
      this.s[i] = c.def;
      const F = this._F[i] = frame({ id: 'g11ef_f' + i, x0: 90, y0: 330, w: 400, h: 262, xmin: c.xmin, xmax: c.xmax, ymax: 1.08, gx: c.gx, xl: c.xl, xt: c.xt, yt: 'معدل التفاعل', ytx: 58, bg: 'blue' });
      let g = F.s + T(350, 34, c.title, { b: 1, c: '#003d33', fs: 17 });
      g += fpath(c.f, c.xmin + (i === 1 ? 1 : 0), c.xmax - (i === 1 ? 1 : 0), F.X, F.Y, '#e31e24', 3.4);
      g += c.marks(F);
      // مقياس المعدل (عمود)
      g += `<rect x="636" y="74" width="50" height="256" rx="6" fill="#fff" stroke="#90a4ae" stroke-width="1.6"/>` + T(661, 352, 'معدل', { fs: 16, b: 1, c: '#003d33' }) + T(661, 372, 'التفاعل', { fs: 16, b: 1, c: '#003d33' });
      g += `<g id="g11ef_dyn">${this.dynCurve(i)}</g>`;
      return SVG('g11ef_svg', 392, g) + `
<div style="${CTRL}"><label>${c.lab}: <input type="range" min="${c.xmin + (i === 1 ? 1 : 0)}" max="${c.xmax - (i === 1 ? 1 : 0)}" step="${c.step}" value="${c.def}" style="${RANGE}" oninput="G11SIM_enzfac.setCurve(${i},this.value)"></label>
<b id="g11ef_val" style="font-size:18px;color:#003d33;">${L(c.fmt(c.def))}</b></div>
<div id="g11ef_read" style="${CTRL}font-size:17px;color:#003d33;">${this.readCurve(i)}</div>
<div id="g11ef_state" style="${NOTE}">${c.state(c.def, c.f(c.def))}</div>
<div style="${NOTE}font-size:15px;">حرِّك المنزلق على المحور الأفقي، وراقب موضع النقطة على المنحنى وطول عمود «معدل التفاعل». المنحنى منقول عن شكل الكتاب، والنسبة المئويَّة قراءة تقريبيَّة من ارتفاع المنحنى (المحور الرأسي في الكتاب بلا أرقام).</div>`;
    },
    dynCurve(i) {
      const c = CURVE_CFG[i], F = this._F[i], x = this.s[i], v = Math.max(0, c.f(x));
      const px = F.X(x), py = F.Y(v), bh = 250 * v;
      return dline(px, F.o.y0, px, py, '#00695c', 2, '5 4') + dline(F.o.x0, py, px, py, '#00695c', 2, '5 4') +
        `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="8" fill="#009A44" stroke="#fff" stroke-width="2.5"/>` +
        `<rect x="640" y="${(327 - bh).toFixed(1)}" width="42" height="${bh.toFixed(1)}" fill="${v > 0.95 ? '#009A44' : v < 0.05 ? '#C8102E' : '#26a69a'}"/>` +
        TL(661, Math.max(96, 320 - bh), `${Math.round(v * 100)}%`, { b: 1, c: '#003d33', fs: 17 });
    },
    readCurve(i) {
      const c = CURVE_CFG[i], x = this.s[i], v = Math.max(0, c.f(x));
      return `معدل التفاعل ≈ <b>${L(Math.round(v * 100) + '%')}</b> من أعلى قيمة في المنحنى`;
    },
    setCurve(i, val) {
      this.s[i] = +val; const c = CURVE_CFG[i], v = Math.max(0, c.f(+val));
      if ($('g11ef_dyn')) $('g11ef_dyn').innerHTML = this.dynCurve(i);
      if ($('g11ef_val')) $('g11ef_val').innerHTML = L(c.fmt(+val));
      if ($('g11ef_read')) $('g11ef_read').innerHTML = this.readCurve(i);
      if ($('g11ef_state')) $('g11ef_state').innerHTML = c.state(+val, v);
    },

    // ───────── المرحلة 2: تركيز الإنزيم (الشكل ٣-٩ أ/ب) ─────────
    buildEC() {
      this.s.ec = { sel: 2, seen: [2], q3: false };
      const A = this._A = frame({ id: 'g11ef_a', x0: 400, y0: 330, w: 236, h: 250, xmin: 0, xmax: 240, ymax: 10, gx: range(0, 240, 30), gy: range(0, 10, 1), xl: [0, 60, 120, 180, 240].map(v => [v, String(v)]), yl: range(0, 10, 2).map(v => [v, String(v)]), xt: `الزمن (${N('s')})`, yt: `حجم الأكسجين المتجمِّع (${N('mL')})`, ytx: 360 });
      const B = this._B = frame({ id: 'g11ef_b', x0: 78, y0: 330, w: 236, h: 250, xmin: 0, xmax: 4, ymax: 8, gx: range(0, 4, 0.5), gy: range(0, 8, 1), xl: [0, 1, 2, 3, 4].map(v => [v, v.toFixed(1)]), yl: range(0, 8, 1).map(v => [v, String(v)]), xt: `تركيز الإنزيم (${N('mL')} من مستخلص الكرفس)`, yt: `المعدل الأولي (${N('mL O<tspan font-size="12" baseline-shift="sub">2</tspan> min<tspan font-size="12" baseline-shift="super">−1</tspan>')})`, ytx: 36 });
      let g = A.s + B.s + T(518, 44, '(أ)', { b: 1, fs: 18 }) + T(196, 44, '(ب)', { b: 1, fs: 18 });
      g += `<g id="g11ef_dyn">${this.dynEC()}</g>`;
      return SVG('g11ef_svg', 392, g) + `
<div style="${CTRL}"><span>حجم مستخلص الكرفس (الإنزيم):</span>${EC_V.map(v => `<button id="g11ef_b${String(v).replace('.', '_')}" style="${btnStyle(v === 2, EC_COL[v] === '#f5a623' ? '#e65100' : EC_COL[v])}" onclick="G11SIM_enzfac.pickEC(${v})">${L(v.toFixed(1) + ' mL')}</button>`).join('')}
<button style="${btnStyle(false)}" onclick="G11SIM_enzfac.allEC()">⏭ التجارب الخمس</button></div>
<div id="g11ef_read" style="${NOTE}">${this.readEC()}</div>
<div style="${CTRL}"><label style="cursor:pointer;"><input type="checkbox" onchange="G11SIM_enzfac.q3(this.checked)" style="width:18px;height:18px;vertical-align:middle;"> السؤال ٣: لو لم يتوافر فائض من بيروكسيد الهيدروجين؟</label></div>
<div id="g11ef_q3" style="${WARN}display:none;">«ارسم رسمًا يبيّن التمثيل البياني في الشكل ٣-٩ب فيما لو لم يتوافر فائض من بيروكسيد الهيدروجين.» (كتاب الطالب ص ١١٣)<br><b>إجابة الدليل:</b> «إذا أصبح تركيز المادة المتفاعلة (بيروكسيد الهيدروجين) محدودًا، فإن إضافة المزيد من الإنزيم لن تزيد من معدل التفاعل.» (دليل المعلِّم ج2 ص ١٦١) — المنحنى المتقطِّع ${TAG}: موضع استوائه ليس من الكتاب.</div>`;
    },
    dynEC() {
      const A = this._A, B = this._B, s = this.s.ec;
      let g = '';
      // (أ) المنحنيات الخمسة: المختار عريض، والباقي باهت
      EC_V.forEach(v => {
        const on = v === s.sel;
        g += fpath(fEC[v], 0, 240, A.X, A.Y, EC_COL[v], on ? 4 : 2.2, null, on ? 1 : 0.35);
        g += TL(A.X(240) + 4, A.Y(EC_D[v][8]) + 5, v.toFixed(1), { a: 'start', fs: 16, c: on ? '#003d33' : '#90a4ae', b: on });
        if (on) EC_T.slice(1).forEach((t, k) => g += cross(A.X(t), A.Y(EC_D[v][k + 1]), '#212121', 4));
      });
      const v30 = EC_D[s.sel][1];
      g += dline(A.X(0), A.Y(0), A.X(30), A.Y(v30), '#003d33', 3.2) + `<circle cx="${A.X(30)}" cy="${A.Y(v30)}" r="6" fill="none" stroke="#003d33" stroke-width="2.4"/>`;
      g += T(A.X(30) + 6, A.Y(v30) - 12, `أوَّل ${N('30 s')}`, { a: 'end', fs: 16, b: 1, c: '#003d33' });
      // (ب) نقاط المعدل الأوَّلي
      if (s.seen.length === EC_V.length) {
        const k = ecSlope();
        g += dline(B.X(0), B.Y(0), B.X(4), B.Y(4 * k), '#6d7a32', 3.2);
      }
      if (s.q3) g += fpath(x => 4.3 * Math.tanh(ecSlope() * x / 4.3), 0, 4, B.X, B.Y, '#C8102E', 2.6, '8 6');
      s.seen.forEach(v => { g += cross(B.X(v), B.Y(ecRate(v)), EC_COL[v], 6); });
      g += `<circle cx="${B.X(s.sel)}" cy="${B.Y(ecRate(s.sel))}" r="10" fill="none" stroke="#003d33" stroke-width="2.2"/>`;
      return g;
    },
    readEC() {
      const s = this.s.ec, v30 = EC_D[s.sel][1], r = ecRate(s.sel);
      let h = `<b>${L(s.sel.toFixed(1) + ' mL')}</b> من مستخلص الكرفس: حجم الأكسجين بعد ${L('30 s')} = <b>${L(v30 + ' mL')}</b> ← المعدل الأولي = ${L(`${v30} ÷ 30 × 60 = ${r.toFixed(1)}`)} ${L('mL O<sub>2</sub> min<sup>−1</sup>')}`;
      h += `<br><span style="font-size:15px;">«بإمكاننا حساب ميل المنحنى بعد 30 ثانية من بدء التفاعل لحساب المعدل الأولي للتفاعل لتركيز كل إنزيم.» (كتاب الطالب ص ١١٢) — القراءات من الشكل ٣-٩ تقريبيَّة.</span>`;
      if (s.seen.length === EC_V.length) h += `<div style="margin-top:6px;">${ok('اكتملت النقاط الخمس')} «يبيّن هذا التمثيل البياني أن المعدل الأولي للتفاعل يزداد خطيًا. وفي هذه الظروف، يتناسب معدل التفاعل طرديًا مع تركيز الإنزيم.» (كتاب الطالب ص ١١٣)</div>`;
      else h += `<div style="margin-top:6px;font-size:15px;">جرِّب الأحجام الخمسة لتكتمل نقاط الشكل (ب) (${L(s.seen.length + '/5')}).</div>`;
      return h;
    },
    pickEC(v) {
      const s = this.s.ec; s.sel = v; if (s.seen.indexOf(v) < 0) s.seen.push(v);
      EC_V.forEach(w => { const b = $('g11ef_b' + String(w).replace('.', '_')); if (b) b.setAttribute('style', btnStyle(w === v, EC_COL[w] === '#f5a623' ? '#e65100' : EC_COL[w])); });
      this.refreshEC();
    },
    allEC() { this.s.ec.seen = EC_V.slice(); this.refreshEC(); },
    q3(on) { this.s.ec.q3 = !!on; if ($('g11ef_q3')) $('g11ef_q3').style.display = on ? 'block' : 'none'; this.refreshEC(); },
    refreshEC() { if ($('g11ef_dyn')) $('g11ef_dyn').innerHTML = this.dynEC(); if ($('g11ef_read')) $('g11ef_read').innerHTML = this.readEC(); },

    // ───────── المرحلة 3: تركيز المادة المتفاعلة (الشكل ٣-١٠) ─────────
    buildSub() {
      this.s.sub = 0.3;
      const F = this._S = frame({ id: 'g11ef_s', x0: 90, y0: 330, w: 380, h: 262, xmin: 0, xmax: 1, ymax: 1.08, xt: 'تركيز المادة المتفاعلة', yt: 'المعدل الأولي للتفاعل', ytx: 58, bg: 'blue' });
      let g = F.s + T(280, 34, 'الشكل ٣-١٠ تأثير تركيز المادة المتفاعلة على معدل تفاعل محفز بالإنزيم', { b: 1, c: '#003d33', fs: 16 });
      g += dline(F.X(0), F.Y(1), F.X(1), F.Y(1), '#212121', 2.2, '9 6') + TL(F.o.x0 - 8, F.Y(1) + 5, 'V<tspan font-size="12" baseline-shift="sub">max</tspan>', { a: 'end', b: 1 });
      g += fpath(fSub, 0, 1, F.X, F.Y, '#e31e24', 3.4);
      g += `<rect x="492" y="52" width="196" height="306" rx="14" fill="#fff" stroke="#b2dfdb" stroke-width="1.6"/>` + T(590, 76, 'المواقع النشطة', { b: 1, c: '#003d33' }) + T(590, 96, '(توضيحي)', { c: '#e65100', fs: 16 });
      g += `<g id="g11ef_dyn">${this.dynSub()}</g>`;
      return SVG('g11ef_svg', 392, g) + `
<div style="${CTRL}"><label>تركيز المادة المتفاعلة: <input type="range" min="0" max="1" step="0.02" value="0.3" style="${RANGE}" oninput="G11SIM_enzfac.setSub(this.value)"></label></div>
<div id="g11ef_read" style="${CTRL}font-size:17px;color:#003d33;">${this.readSub()}</div>
<div id="g11ef_state" style="${NOTE}">${this.stateSub()}</div>
<div style="${NOTE}font-size:15px;">تركيز الإنزيم ثابت. محور التركيز في الشكل ٣-١٠ بلا أرقام؛ والنسبة من ${VMX} قراءة تقريبيَّة من ارتفاع المنحنى. لوحة «المواقع النشطة» ${TAG}: ستَّة جزيئات إنزيم، وعدد المواقع المشغولة يتناسب مع المعدل.</div>`;
    },
    dynSub() {
      const F = this._S, x = this.s.sub, v = fSub(x), px = F.X(x), py = F.Y(v);
      let g = dline(px, F.o.y0, px, py, '#00695c', 2, '5 4') + dline(F.o.x0, py, px, py, '#00695c', 2, '5 4') + `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="8" fill="#009A44" stroke="#fff" stroke-width="2.5"/>`;
      // لوحة المواقع النشطة: 6 إنزيمات؛ المشغول = round(6·v)
      const occ = Math.round(6 * v), tot = Math.round(x * 14), wait = Math.max(0, tot - occ);
      const pos = [[545, 140], [635, 140], [545, 210], [635, 210], [545, 280], [635, 280]];
      pos.forEach(([cx, cy], k) => {
        g += `<path d="M${cx - 30} ${cy - 18} h18 l12 16 l12 -16 h18 v40 q0 8 -8 8 h-44 q-8 0 -8 -8 z" fill="#4a7fc1" stroke="#2c5d99" stroke-width="1.6"/>`;
        if (k < occ) g += `<path d="M${cx - 11} ${cy - 22} h22 l-11 16 z" fill="#f7a35c" stroke="#d9822b" stroke-width="1.4"/>`;
      });
      for (let k = 0; k < Math.min(wait, 8); k++) { const wx = 520 + k * 21; g += `<path d="M${wx - 8} 322 h16 l-8 12 z" fill="#f7a35c" stroke="#d9822b" stroke-width="1.2"/>`; }
      if (wait > 0 && occ === 6) g += T(590, 352, '«تنتظر»', { fs: 16, b: 1, c: '#C8102E' });
      return g;
    },
    readSub() {
      const v = fSub(this.s.sub), occ = Math.round(6 * v);
      return `المعدل الأولي ≈ <b>${L(Math.round(v * 100) + '%')}</b> من ${VMX} · المواقع النشطة المشغولة: <b>${L(occ + ' / 6')}</b>`;
    },
    stateSub() {
      const v = fSub(this.s.sub);
      if (v >= 0.95) return `★ <b>${VMX}</b>: «مع استمرار زيادة تركيز المادة المتفاعلة، والحفاظ على تركيز الإنزيم ثابتًا، ستمتلئ جميع المواقع النشطة للإنزيم. وإذا أضيف المزيد من المادة المتفاعلة، لا يستطيع الإنزيم ببساطة أن يعمل بسرعة، حيث إن جزيئات المادة المتفاعلة سوف «تنتظر» لترتبط بالموقع النشط. يعمل الإنزيم بالسرعة القصوى الممكنة له، والمسماة ${VMX}» (كتاب الطالب ص ١١٣)`;
      if (v < 0.01) return `لا توجد مادة متفاعلة: معدل التفاعل صفر.`;
      return `↗ «يزداد المعدل الأولي للتفاعل أيضًا بازدياد تركيز المادة المتفاعلة، وهو أمر متوقع؛ فكلما ازداد عدد جزيئات المادة المتفاعلة ازداد عدد مرات دخولها إلى المواقع النشطة.» (كتاب الطالب ص ١١٣)`;
    },
    setSub(val) {
      this.s.sub = +val;
      if ($('g11ef_dyn')) $('g11ef_dyn').innerHTML = this.dynSub();
      if ($('g11ef_read')) $('g11ef_read').innerHTML = this.readSub();
      if ($('g11ef_state')) $('g11ef_state').innerHTML = this.stateSub();
    }
  };

  // ═══════════════════════════════════════════════════════════════════════
  // ٢) g11_vmax_km — Vmax وKm والألفة والمثبِّطات (الدرسان ٣-٥ و٣-٦)
  // ═══════════════════════════════════════════════════════════════════════
  // نشاط ٣-٢ (كتاب الأنشطة ص ٨٨، الجدول ٣-١): الليبيز من Burkholderia cepacia
  const LIP_S = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
  const LIP_V = [0, 8, 16, 22, 26, 29, 31, 32, 33, 33, 33];
  const fLip = mono(LIP_S, LIP_V);
  const LIP_VMAX = 33;                       // دليل المعلِّم ج2 ص ١٦٤: Vmax = 33 µmol
  const invLip = y => { let a = 0, b = 50; for (let k = 0; k < 60; k++) { const m = (a + b) / 2; if (fLip(m) < y) a = m; else b = m; } return (a + b) / 2; };
  // الشكل ٣-١٢: منحنيان بلا أرقام — (أ) يرتفع بحدَّة ويستقرُّ أدنى، (ب) يرتفع أبطأ ويستقرُّ أعلى (إجابات الدليل ج2 ص ١٦١)
  const AFF = { A: { vm: 0.57, tau: 0.108 }, B: { vm: 1, tau: 0.44 } };
  const fAff = (e, x) => AFF[e].vm * Math.tanh(x / AFF[e].tau);
  const kmAff = e => AFF[e].tau * Math.atanh(0.5);
  // المثبِّطات (سؤال ٩ ص ١٢٣ + الدليل ص ١٦٣): التنافسي لا يغيِّر Vmax ويزيد Km؛ غير التنافسي يخفض Vmax ولا يغيِّر Km.
  // مقدار الأثر بحسب «تركيز المثبِّط» توضيحي: i = 0.5 / 1 / 2 (القيمة 1 تعيد شكل الكتاب: Vmax غير التنافسي ≈ نصف Vmax).
  const INH_TAU = 0.3, INH_I = { low: 0.5, mid: 1, high: 2 };
  const vNone = x => Math.tanh(x / INH_TAU);
  const vInh = (type, i, x) => type === 'comp' ? Math.tanh(x / (INH_TAU * (1 + i))) : type === 'non' ? Math.tanh(x / INH_TAU) / (1 + i) : vNone(x);
  const kmInh = (type, i) => (type === 'comp' ? INH_TAU * (1 + i) : INH_TAU) * Math.atanh(0.5);
  const vmInh = (type, i) => type === 'non' ? 1 / (1 + i) : 1;

  const VK = window.G11SIM_vmaxkm = {
    fLip, invLip, LIP_S, LIP_V, LIP_VMAX, fAff, kmAff, vNone, vInh, kmInh, vmInh,
    kmCurve: () => invLip(LIP_VMAX / 2),
    checkVmax: v => Math.abs(+v - LIP_VMAX) <= 0.5,
    checkHalf: v => Math.abs(+v - LIP_VMAX / 2) <= 0.1,
    checkKm: v => +v >= 10 && +v <= 11,          // «عليك إيجاد Km أعلى بقليل من 10%» (الدليل ج2 ص ١٦٤)
    s: {},

    // ───────── المرحلة 0: قراءة Vmax وKm (نشاط ٣-٢ + الشكل ٣-١١) ─────────
    build0() {
      this.s = { vm: 25, vOK: false, hOK: false, kx: 5, kOK: false };
      const F = this._F = frame({ id: 'g11vk_f', x0: 92, y0: 330, w: 420, h: 262, xmin: 0, xmax: 50, ymax: 40, gx: range(0, 50, 2.5), gy: range(0, 40, 2), xl: range(0, 50, 10).map(v => [v, String(v)]), yl: range(0, 40, 10).map(v => [v, String(v)]), xt: `تركيز المادة المتفاعلة (${N('%')})`, yt: `المعدل الأولي (${N('µmol min<tspan font-size="12" baseline-shift="super">−1</tspan>')})`, ytx: 50 });
      let g = F.s + T(300, 34, 'الليبيز: المعدل الأولي مقابل تركيز المادة المتفاعلة (نشاط ٣-٢)', { b: 1, c: '#003d33', fs: 17 });
      g += fpath(fLip, 0, 50, F.X, F.Y, '#263238', 2.6);
      LIP_S.forEach((x, k) => g += cross(F.X(x), F.Y(LIP_V[k]), '#C8102E', 5));
      g += `<rect x="540" y="62" width="148" height="190" rx="14" fill="#fff" stroke="#b2dfdb" stroke-width="1.6"/>` + T(614, 88, 'قراءاتك', { b: 1, c: '#003d33' });
      g += `<g id="g11vk_dyn">${this.dyn0()}</g>`;
      return SVG('g11vk_svg', 392, g) + `
<div style="${NOTE}font-size:15px;">«مهم: ارسم بدقّة خطًّا أفقيًّا من أعلى موضع في الخط على التمثيل البياني وصولًا إلى المحور ص لتجد قيمة ${VMX}. اقرأ قيمة V من مقياس المحور ص.» (كتاب الأنشطة ص ٨٩)</div>
<div style="${CTRL}"><label>① الخط الأفقي (${VMX}): <input type="range" min="20" max="40" step="0.5" value="25" style="${RANGE}" oninput="G11SIM_vmaxkm.setVm(this.value)"></label><b id="g11vk_vmv" dir="ltr">25</b><button style="${btnStyle(false)}" onclick="G11SIM_vmaxkm.chkV()">تحقَّق</button><span id="g11vk_o1"></span></div>
<div style="${CTRL}"><label>② «حدّد على المحور (ص) من التمثيل البياني القيمة التي تساوي بالضبط نصف قيمة ${VMX}»: ${HVM} = <input id="g11vk_half" type="number" step="0.1" style="${INP}"></label><button style="${btnStyle(false)}" onclick="G11SIM_vmaxkm.chkH()">تحقَّق</button><span id="g11vk_o2"></span></div>
<div style="${CTRL}"><label>③ «ارسم خطًّا عموديًّا من هذه النقطة على المنحنى وصولًا إلى المحور (س)»: <input type="range" min="0" max="50" step="0.5" value="5" style="${RANGE}" oninput="G11SIM_vmaxkm.setK(this.value)"></label><b id="g11vk_kxv" dir="ltr">5</b></div>
<div style="${CTRL}"><label>④ «اقرأ القيمة على المحور (س) عند هذه النقطة. هذا هو ${KM}»: ${KM} = <input id="g11vk_km" type="number" step="0.1" style="${INP}"> ${L('%')}</label><button style="${btnStyle(false)}" onclick="G11SIM_vmaxkm.chkK()">تحقَّق</button><span id="g11vk_o3"></span></div>
<div style="${NOTE}font-size:15px;">البيانات: الجدول ٣-١ «تأثير تركيز المادة المتفاعلة على المعدّل الأولي للتفاعل، V، لإنزيم الليبيز» (كتاب الأنشطة ص ٨٨)، وخطوات القراءة من ص ٨٩. الخط المرسوم عبر النقاط هو «خطّ مناسب» تمرُّ به النقاط.</div>`;
    },
    dyn0() {
      const F = this._F, s = this.s;
      let g = dline(F.o.x0, F.Y(s.vm), F.o.x0 + F.o.w, F.Y(s.vm), s.vOK ? '#009A44' : '#C8102E', 2.4, '9 6');
      g += TL(F.X(3), F.Y(s.vm) - 7, 'V<tspan font-size="12" baseline-shift="sub">max</tspan>' + (s.vOK ? '' : '?'), { a: 'start', b: 1, c: s.vOK ? '#009A44' : '#C8102E' });
      if (s.hOK) {
        const km = this.kmCurve();
        g += dline(F.o.x0, F.Y(LIP_VMAX / 2), F.X(km), F.Y(LIP_VMAX / 2), '#00695c', 2.2, '6 5');
        g += TL(F.o.x0 + 6, F.Y(LIP_VMAX / 2) - 7, '½V<tspan font-size="12" baseline-shift="sub">max</tspan>', { a: 'start', b: 1, c: '#00695c' });
      }
      const ky = fLip(s.kx);
      g += dline(F.X(s.kx), F.o.y0, F.X(s.kx), F.Y(ky), '#6a1b9a', 2.4, '4 4') + `<circle cx="${F.X(s.kx).toFixed(1)}" cy="${F.Y(ky).toFixed(1)}" r="6" fill="#6a1b9a"/>`;
      if (s.kOK) g += TL(F.X(this.kmCurve()), F.o.y0 - 8, 'K<tspan font-size="12" baseline-shift="sub">m</tspan>', { b: 1, c: '#6a1b9a' });
      // لوحة القراءات
      g += TL(614, 120, `Vmax = ${s.vOK ? LIP_VMAX : '?'}`, { b: 1, c: s.vOK ? '#009A44' : '#546e7a' });
      g += TL(614, 152, `½Vmax = ${s.hOK ? LIP_VMAX / 2 : '?'}`, { b: 1, c: s.hOK ? '#009A44' : '#546e7a' });
      g += TL(614, 184, s.kOK ? 'Km ≈ 10.4 %' : 'Km = ?', { b: 1, c: s.kOK ? '#009A44' : '#546e7a' });
      g += TL(614, 226, `V(${s.kx}) = ${ky.toFixed(1)}`, { c: '#6a1b9a' });
      return g;
    },
    redraw0() { if ($('g11vk_dyn')) $('g11vk_dyn').innerHTML = this.dyn0(); },
    setVm(v) { this.s.vm = +v; if ($('g11vk_vmv')) $('g11vk_vmv').textContent = v; this.redraw0(); },
    setK(v) { this.s.kx = +v; if ($('g11vk_kxv')) $('g11vk_kxv').textContent = v; this.redraw0(); },
    chkV() {
      const o = $('g11vk_o1'); this.s.vOK = this.checkVmax(this.s.vm);
      if (this.s.vOK) this.s.vm = LIP_VMAX;
      if (o) o.innerHTML = this.s.vOK ? ok(`${VMX} = ${L('33 µmol')} من الأحماض الدهنيَّة في الدقيقة — «هذه هي القيمة التي تستقر عندها مستويات التمثيل البياني» (دليل المعلِّم ج2 ص ١٦٤)`) : no('ضع الخط عند أعلى موضع يستقرُّ عنده المنحنى (حيث تتساوى القراءات الأخيرة).');
      this.redraw0();
    },
    chkH() {
      const o = $('g11vk_o2'), v = ($('g11vk_half') || {}).value;
      if (!this.s.vOK) { if (o) o.innerHTML = no(`حدِّد ${VMX} أوَّلاً (الخطوة ①).`); return; }
      this.s.hOK = this.checkHalf(v);
      if (o) o.innerHTML = this.s.hOK ? ok(`${HVM} = ${L('33 ÷ 2 = 16.5')} — «ارسم خطًّا أفقيًّا من هذه النقطة على المحور (ص) إلى أن تصل المنحنى.»`) : no(`نصف ${L('33')} = ؟`);
      this.redraw0();
    },
    chkK() {
      const o = $('g11vk_o3'), v = ($('g11vk_km') || {}).value;
      if (!this.s.hOK) { if (o) o.innerHTML = no(`أكمل الخطوة ② أوَّلاً.`); return; }
      this.s.kOK = this.checkKm(v);
      if (this.s.kOK) { this.s.kx = Math.round(this.kmCurve() * 2) / 2; }
      if (o) o.innerHTML = this.s.kOK ? ok(`«عليك إيجاد ${KM} أعلى بقليل من 10% من تركيز المادة المتفاعلة» (دليل المعلِّم ج2 ص ١٦٤) — من الخطِّ المرسوم هنا ≈ ${L(this.kmCurve().toFixed(1) + ' %')}`) : no(`حرِّك الخط العمودي حتى يمرَّ بتقاطع خط ${HVM} مع المنحنى، ثمَّ اقرأ المحور (س).`);
      this.redraw0();
    },

    // ───────── المرحلة 1: مقارنة الألفة (الشكل ٣-١٢، السؤال ٥) ─────────
    build1() {
      this.s = { x: 0.15, lab: false, km: false };
      const F = this._F = frame({ id: 'g11vk_f', x0: 92, y0: 330, w: 410, h: 262, xmin: 0, xmax: 1, ymax: 1.1, xty: 380, xt: 'تركيز المادة المتفاعلة', yt: 'معدل التفاعل', ytx: 58 });
      let g = F.s + T(300, 34, 'الشكل ٣-١٢ مقارنة بين ألفة إنزيمَين مختلفَين لمادتيهما المتفاعلتَين', { b: 1, c: '#003d33', fs: 17 });
      g += fpath(x => fAff('A', x), 0, 1, F.X, F.Y, '#1565c0', 3) + fpath(x => fAff('B', x), 0, 1, F.X, F.Y, '#e65100', 3);
      g += `<rect x="530" y="62" width="158" height="290" rx="14" fill="#fff" stroke="#b2dfdb" stroke-width="1.6"/>` + T(609, 88, 'المعدل الآن', { b: 1, c: '#003d33' });
      g += `<g id="g11vk_dyn">${this.dyn1()}</g>`;
      const qs = [['١', `أيّ من الإنزيمَين له ثابت ميكاليس-مينتين ${KM} أعلى من الآخر؟`], ['٢', `أيّ من الإنزيمَين له ${VMX} أعلى من الآخر؟`], ['٣', `أيّ من الإنزيمَين احتاج إلى تركيز أعلى من المادة المتفاعلة ليصل إلى ${VMX}؟`], ['٤', 'أيّ من الإنزيمَين احتاج إلى تركيز أعلى من المادة المتفاعلة ليشبع مواقعه النشطة؟']];
      return SVG('g11vk_svg', 392, g) + `
<div style="${CTRL}"><label>تركيز المادة المتفاعلة: <input type="range" min="0" max="1" step="0.01" value="0.15" style="${RANGE}" oninput="G11SIM_vmaxkm.setX(this.value)"></label>
<button style="${btnStyle(false)}" onclick="G11SIM_vmaxkm.toggleKm()">📏 ${VMX} · ${HVM} · ${KM}</button></div>
<div style="${NOTE}"><b>سؤال ٥</b> «يبين الشكل ٣-١٢ نتائج تجربتين. كان الهدف من التجربتَين مقارنة ألفة إنزيمَين مختلفَين للمادتَين المتفاعلتَين. الإنزيم (أ) له ألفة أعلى للمادة المتفاعلة من الإنزيم (ب). المنحنيان يمثلان نتائج الإنزيم (أ) والإنزيم (ب).» (كتاب الطالب ص ١١٥)
<div style="margin-top:6px;">أ-٢. «اكتب تسمية المنحنى الخاص بالإنزيم (أ)، والمنحنى الخاص بالإنزيم (ب).» — المنحنى الأزرق هو:
<button style="${btnStyle(false, '#1565c0')}" onclick="G11SIM_vmaxkm.label('A')">الإنزيم (أ)</button> <button style="${btnStyle(false, '#1565c0')}" onclick="G11SIM_vmaxkm.label('B')">الإنزيم (ب)</button> <span id="g11vk_ol"></span></div>
${qs.map(([n, q], k) => `<div style="margin-top:6px;">ب-${n}. «${q}» <button style="${btnStyle(false)}" onclick="G11SIM_vmaxkm.ans(${k},'A')">(أ)</button> <button style="${btnStyle(false)}" onclick="G11SIM_vmaxkm.ans(${k},'B')">(ب)</button> <span id="g11vk_q${k}"></span></div>`).join('')}
</div>
<div style="${NOTE}font-size:15px;">المحوران في الشكل ٣-١٢ بلا أرقام؛ والمنحنيان هنا منقولان عن شكلهما في الكتاب. الإجابات من دليل المعلِّم ج2 ص ١٦١.</div>`;
    },
    dyn1() {
      const F = this._F, s = this.s, a = fAff('A', s.x), b = fAff('B', s.x), px = F.X(s.x);
      let g = '';
      if (s.km) ['A', 'B'].forEach(e => {
        const c = e === 'A' ? '#1565c0' : '#e65100', vm = AFF[e].vm, km = kmAff(e);
        g += dline(F.o.x0, F.Y(vm), F.o.x0 + F.o.w, F.Y(vm), c, 1.6, '8 6') + dline(F.o.x0, F.Y(vm / 2), F.X(km), F.Y(vm / 2), c, 1.6, '4 4') + dline(F.X(km), F.Y(vm / 2), F.X(km), F.o.y0, c, 1.6, '4 4');
        g += TL(F.X(km), F.o.y0 + 20, `K<tspan font-size="12" baseline-shift="sub">m</tspan>${e === 'A' ? '(أ)' : '(ب)'}`, { c, b: 1, fs: 16 });
        g += TL(F.o.x0 + 6, F.Y(vm) - 6, `V<tspan font-size="12" baseline-shift="sub">max</tspan>${e === 'A' ? '(أ)' : '(ب)'}`, { a: 'start', c, b: 1, fs: 16 });
      });
      g += dline(px, F.o.y0, px, F.Y(Math.max(a, b)), '#37474f', 1.6, '5 4');
      g += `<circle cx="${px.toFixed(1)}" cy="${F.Y(a).toFixed(1)}" r="7" fill="#1565c0" stroke="#fff" stroke-width="2"/><circle cx="${px.toFixed(1)}" cy="${F.Y(b).toFixed(1)}" r="7" fill="#e65100" stroke="#fff" stroke-width="2"/>`;
      if (s.lab) {
        g += T(F.X(0.06) + 70, F.Y(0.57) - 12, 'الإنزيم (أ)', { b: 1, c: '#1565c0' }) + T(F.X(0.62), F.Y(fAff('B', 0.62)) + 28, 'الإنزيم (ب)', { b: 1, c: '#e65100' });
      }
      // عمودان للمعدل الحالي
      const H = 200, base = 320;
      g += `<rect x="556" y="${(base - H * a).toFixed(1)}" width="40" height="${(H * a).toFixed(1)}" fill="#1565c0"/><rect x="622" y="${(base - H * b).toFixed(1)}" width="40" height="${(H * b).toFixed(1)}" fill="#e65100"/>`;
      g += dline(546, base, 672, base, '#37474f', 1.6);
      g += T(576, base + 22, s.lab ? '(أ)' : 'الأزرق', { fs: 16, b: 1, c: '#1565c0' }) + T(642, base + 22, s.lab ? '(ب)' : 'البرتقالي', { fs: 16, b: 1, c: '#e65100' });
      return g;
    },
    redraw1() { if ($('g11vk_dyn')) $('g11vk_dyn').innerHTML = this.dyn1(); },
    setX(v) { this.s.x = +v; this.redraw1(); },
    toggleKm() { this.s.km = !this.s.km; this.redraw1(); },
    label(e) {
      const o = $('g11vk_ol');
      if (e === 'A') { this.s.lab = true; if (o) o.innerHTML = ok(`الإنزيم (أ) ألفته أعلى، فيصل إلى ${HVM} عند تركيز أقلَّ من المادة المتفاعلة (${KM} أقل).`); }
      else if (o) o.innerHTML = no(`«فكلما كانت ألفة الإنزيم أعلى، كان تركيز مادته المتفاعلة اللازم للوصول إلى ${HVM} أقل» — أيُّ المنحنيين يصل إلى نصف قيمته القصوى أسرع؟`);
      this.redraw1();
    },
    ans(k, e) {
      const o = $('g11vk_q' + k); if (!o) return;
      o.innerHTML = e === 'B' ? ok('إنزيم ب (دليل المعلِّم ج2 ص ١٦١)') : no('راجع الخطوط المتقطِّعة (اضغط زرَّ 📏).');
    },

    // ───────── المرحلة 2: المثبِّطات (ص ١١٥–١١٦ + سؤال ٩ ص ١٢٣) ─────────
    build2() {
      this.s = { type: 'comp', lvl: 'mid', x: 0.15, km: false };
      const F = this._F = frame({ id: 'g11vk_f', x0: 92, y0: 330, w: 380, h: 262, xmin: 0, xmax: 1, ymax: 1.1, xty: 380, xt: `[${N('S')}] = تركيز المادة المتفاعلة`, yt: `${N('V')} = المعدل (السرعة)`, ytx: 58 });
      const I = this._I = frame({ id: 'g11vk_i', x0: 548, y0: 300, w: 132, h: 150, xmin: 0, xmax: 1, ymax: 1.05, gy: [0.5, 1], yl: [[0, '0'], [0.5, '50%'], [1, '100%']], xt: `[${N('S')}]` });
      let g = F.s + I.s + T(282, 34, 'المعدل مع المثبِّط وبدونه (الشكل في سؤال ٩)', { b: 1, c: '#003d33', fs: 17 });
      g += T(608, 112, 'المعدل مع المثبِّط', { fs: 16, b: 1, c: '#003d33' }) + T(608, 132, '÷ المعدل بدونه', { fs: 16, b: 1, c: '#003d33' }) + T(608, 380, '(توضيحي)', { fs: 16, c: '#e65100' });
      g += fpath(vNone, 0, 1, F.X, F.Y, '#212121', 3);
      g += `<g id="g11vk_dyn">${this.dyn2()}</g>`;
      return SVG('g11vk_svg', 392, g) + `
<div style="${CTRL}"><span>المثبِّط:</span>
<button id="g11vk_tcomp" style="${btnStyle(true, '#1565c0')}" onclick="G11SIM_vmaxkm.setType('comp')">تنافسي (المثبِّط أ)</button>
<button id="g11vk_tnon" style="${btnStyle(false, '#6a1b9a')}" onclick="G11SIM_vmaxkm.setType('non')">غير تنافسي (المثبِّط ب)</button>
<label>تركيز المثبِّط ${TAG}: <select style="${SEL}" onchange="G11SIM_vmaxkm.setLvl(this.value)"><option value="low">منخفض</option><option value="mid" selected>متوسِّط (كشكل الكتاب)</option><option value="high">مرتفع</option></select></label></div>
<div style="${CTRL}"><label>زِد تركيز المادة المتفاعلة [${L('S')}]: <input type="range" min="0.02" max="1" step="0.01" value="0.15" style="${RANGE}" oninput="G11SIM_vmaxkm.setS(this.value)"></label>
<button style="${btnStyle(false)}" onclick="G11SIM_vmaxkm.toggleKm2()">📏 ${VMX} · ${KM}</button></div>
<div id="g11vk_read" style="${CTRL}font-size:17px;color:#003d33;">${this.read2()}</div>
<div id="g11vk_state" style="${NOTE}">${this.state2()}</div>
<div style="${NOTE}font-size:15px;">المنحنيات على هيئة الشكل في سؤال نهاية الوحدة ٩ (كتاب الطالب ص ١٢٣)، وتأثير كلِّ مثبِّط على ${VMX} و${KM} من إجابة دليل المعلِّم ج2 ص ١٦٣: «ليس للمثبط (أ) تأثير على ${VMX} وهو يزيد من ${KM}»، و«يخفض المثبط (ب) ${VMX}، وليس له تأثير على ${KM}». مقدار التثبيط ونسبته المئويَّة وأثر «تركيز المثبِّط» ${TAG}.</div>`;
    },
    dyn2() {
      const F = this._F, I = this._I, s = this.s, i = INH_I[s.lvl], c = s.type === 'comp' ? '#1565c0' : '#6a1b9a';
      const f = x => vInh(s.type, i, x);
      let g = fpath(f, 0, 1, F.X, F.Y, c, 3, s.type === 'comp' ? '10 6' : '3 5');
      g += T(F.X(0.15), F.Y(0.86), 'بدون مثبِّط', { b: 1, fs: 16 });
      g += T(F.X(0.8), F.Y(f(0.8)) + (s.type === 'comp' ? 26 : -12), s.type === 'comp' ? 'المثبِّط (أ)' : 'المثبِّط (ب)', { b: 1, fs: 16, c });
      if (s.km) {
        const k0 = kmInh('none', i), k1 = kmInh(s.type, i), vm = vmInh(s.type, i), sub = t => `<tspan font-size="12" baseline-shift="sub">${t}</tspan>`;
        g += dline(F.o.x0, F.Y(1), F.o.x0 + F.o.w, F.Y(1), '#212121', 1.4, '8 6') + TL(F.o.x0 + F.o.w - 4, F.Y(1) - 6, 'V' + sub('max'), { a: 'end', fs: 16, b: 1 });
        g += dline(F.o.x0, F.Y(0.5), F.X(k0), F.Y(0.5), '#212121', 1.4, '4 4') + dline(F.X(k0), F.Y(0.5), F.X(k0), F.o.y0, '#212121', 1.4, '4 4') + TL(F.X(k0), F.o.y0 + 20, 'K' + sub('m'), { fs: 16, b: 1 });
        if (s.type === 'non') {
          g += dline(F.o.x0, F.Y(vm), F.o.x0 + F.o.w, F.Y(vm), c, 1.4, '8 6') + TL(F.o.x0 + F.o.w - 4, F.Y(vm) - 6, "V" + sub('max') + "'", { a: 'end', fs: 16, b: 1, c });
          g += dline(F.o.x0, F.Y(vm / 2), F.X(k0), F.Y(vm / 2), c, 1.4, '4 4') + `<circle cx="${F.X(k0).toFixed(1)}" cy="${F.Y(vm / 2).toFixed(1)}" r="5" fill="${c}"/>`;
        } else {
          g += dline(F.X(k1), F.Y(0.5), F.X(k1), F.o.y0, c, 1.4, '4 4') + dline(F.X(k0), F.Y(0.5), F.X(k1), F.Y(0.5), c, 1.4, '4 4') + TL(F.X(k1), F.o.y0 + 20, 'K' + sub('m') + "'", { fs: 16, b: 1, c });
        }
      }
      const px = F.X(s.x), a = vNone(s.x), b = f(s.x);
      g += dline(px, F.o.y0, px, F.Y(a), '#37474f', 1.6, '5 4');
      g += `<circle cx="${px.toFixed(1)}" cy="${F.Y(a).toFixed(1)}" r="7" fill="#212121" stroke="#fff" stroke-width="2"/><circle cx="${px.toFixed(1)}" cy="${F.Y(b).toFixed(1)}" r="7" fill="${c}" stroke="#fff" stroke-width="2"/>`;
      // الرسم الصغير: النسبة مقابل [S]
      g += fpath(x => f(x) / vNone(x), 0.01, 1, I.X, I.Y, c, 2.6);
      g += `<circle cx="${I.X(s.x).toFixed(1)}" cy="${I.Y(b / a).toFixed(1)}" r="6" fill="${c}" stroke="#fff" stroke-width="2"/>`;
      return g;
    },
    ratio() { const s = this.s; return vInh(s.type, INH_I[s.lvl], s.x) / vNone(s.x); },
    read2() { return `المعدل مع المثبِّط ≈ <b>${L(Math.round(this.ratio() * 100) + '%')}</b> من المعدل بدونه عند هذا التركيز ${TAG}`; },
    state2() {
      const s = this.s;
      if (s.type === 'comp') return `<b>التثبيط التنافسي:</b> «وإذا كانت جزيئات المادة المتفاعلة أكثر من الجزيئات المثبّطة، فستفوز جزيئات المادة المتفاعلة بسهولة في التنافس، وبالتالي لن تتأثر وظيفة الإنزيم كثيرًا.» (كتاب الطالب ص ١١٥)<br>«يخفض ارتفاع تركيز المادة المتفاعلة من درجة التثبيط، وبالمقابل يزيد ارتفاع تركيز الجزيئات المثبطة من درجة التثبيط.» (مصطلحات علمية، ص ١١٥)` + (this.ratio() > 0.85 ? `<br>${ok('عند هذا التركيز المرتفع من المادة المتفاعلة يقترب المعدل من المعدل بدون مثبِّط.')}` : '');
      return `<b>التثبيط غير التنافسي:</b> «يرتبط الجزيء المثبّط بجزء آخر من الإنزيم غير الموقع النشط.» … «ولن يكون لزيادة تركيز المادة المتفاعلة أيّ تأثير على التثبيط، بخلاف التثبيط التنافسي.» (كتاب الطالب ص ١١٦)<br>لاحظ: النسبة في الرسم الصغير ثابتة مهما زاد [${L('S')}].`;
    },
    refresh2() { if ($('g11vk_dyn')) $('g11vk_dyn').innerHTML = this.dyn2(); if ($('g11vk_read')) $('g11vk_read').innerHTML = this.read2(); if ($('g11vk_state')) $('g11vk_state').innerHTML = this.state2(); },
    setType(t) {
      this.s.type = t;
      const a = $('g11vk_tcomp'), b = $('g11vk_tnon');
      if (a) a.setAttribute('style', btnStyle(t === 'comp', '#1565c0')); if (b) b.setAttribute('style', btnStyle(t === 'non', '#6a1b9a'));
      this.refresh2();
    },
    setLvl(l) { this.s.lvl = l; this.refresh2(); },
    setS(v) { this.s.x = +v; this.refresh2(); },
    toggleKm2() { this.s.km = !this.s.km; this.refresh2(); }
  };

  // ═══════════════════════════════════════════════════════════════════════
  // ٣) g11_immobilised — الإنزيمات المثبَّتة (الدرس ٣-٧)
  // ═══════════════════════════════════════════════════════════════════════
  // سؤال نهاية الوحدة ٨ (كتاب الطالب ص ١٢٢): الجلوكوز في الحليب (mg/L) بعد كلِّ مرَّة تمرير عبر المحقنة
  const LAC = { imm: [0, 148, 302, 400], free: [0, 246, 342, 400] };
  const LAC_MAX = 400;   // «تم الوصول إلى الحد الأقصى نفسه … حيث تم تحلل كل المادة المتفاعلة (اللاكتوز) إلى نواتج» (الدليل ج2 ص ١٦٢)
  // كتاب الأنشطة ص ١١٣ (أسئلة نهاية الوحدة ٣): النشاط النسبي % للبكتينيز بعد التخزين عند 4 °C — قراءة من الشكل
  const PEC_D = [5, 10, 15, 20, 25, 30];
  const PEC = { imm: [99, 74, 73, 72, 63, 51], free: [99, 64, 64, 47, 45, 9] };
  const pctLactose = g => Math.round(g / LAC_MAX * 100);

  const IM = window.G11SIM_immob = {
    LAC, LAC_MAX, PEC, PEC_D, pctLactose,
    s: { type: 'imm', n: { imm: 0, free: 0 }, run: false },

    // ───────── المرحلة 0: تمرير الحليب عبر الأسطوانة ─────────
    build0() {
      this.s = { type: 'imm', n: { imm: 0, free: 0 }, run: false };
      const F = this._F = frame({ id: 'g11im_f', x0: 78, y0: 330, w: 250, h: 250, xmin: 0, xmax: 3, ymax: 500, gx: [0, 1, 2, 3], gy: range(0, 500, 50), xl: [0, 1, 2, 3].map(v => [v, String(v)]), yl: range(0, 500, 100).map(v => [v, String(v)]), xt: 'عدد مرَّات تمرير الحليب عبر المحقنة', yt: `الجلوكوز في الحليب (${N('mg/L')})`, ytx: 26 });
      let g = F.s + T(200, 36, 'الجلوكوز في الحليب المتجمِّع', { b: 1, c: '#003d33', fs: 17 });
      g += T(300, 70, '× لاكتيز مثبت', { a: 'start', fs: 16, c: '#00695c', b: 1 });
      g += T(170, 70, '× لاكتيز حر', { a: 'start', fs: 16, c: '#C8102E', b: 1 });
      g += `<g id="g11im_dyn">${this.dyn0()}</g>`;
      return SVG('g11im_svg', 400, g) + `
<div style="${CTRL}"><span>المحقنة:</span>
<button id="g11im_timm" style="${btnStyle(true)}" onclick="G11SIM_immob.setType('imm')">(أ) لاكتيز مثبت في حبيبات الألجينات</button>
<button id="g11im_tfree" style="${btnStyle(false, '#C8102E')}" onclick="G11SIM_immob.setType('free')">(ب) لاكتيز حر في الحليب</button></div>
<div style="${CTRL}"><button style="${btnStyle(true, '#009A44')}" onclick="G11SIM_immob.pass()">⬇ مرِّر الحليب عبر المحقنة</button>
<button style="${btnStyle(false)}" onclick="G11SIM_immob.reset0()">↺ ابدأ من جديد</button>
<button style="${btnStyle(false)}" onclick="G11SIM_immob.all0()">⏭ النتائج كلُّها</button></div>
<div id="g11im_read" style="${NOTE}">${this.read0()}</div>
<div id="g11im_expl" style="${NOTE}display:none;"></div>
<div style="${NOTE}font-size:15px;">النتائج من جدول سؤال نهاية الوحدة ٨ (كتاب الطالب ص ١٢٢): «تم تمرير عينتَي الحليب عبر أسطوانة كل من المحقنتين (أ) و(ب) لثلاث مرات، وتم قياس مستويات الجلوكوز في الحليب المتجمع بعد كل مرَّة من تمريره عبر كل محقنة.» نسبة اللاكتوز المتحلِّل = الجلوكوز ÷ ${L('400 mg/L')} (الحدُّ الأقصى الذي يعني تحلُّل كلِّ اللاكتوز، الدليل ج2 ص ١٦٢). <b>ملاحظة المنصَّة:</b> لا يعطي الكتابان علاقة كمِّيَّة بين سرعة تدفُّق الحليب ونسبة التحويل، لذا المتغيِّر هنا عدد مرَّات التمرير كما في السؤال.</div>`;
    },
    dyn0() {
      const F = this._F, s = this.s, imm = s.type === 'imm';
      let g = '';
      // المنحنيان (النقاط المنجزة فقط)
      ['imm', 'free'].forEach(t => {
        const n = s.n[t], c = t === 'imm' ? '#00695c' : '#C8102E';
        if (n > 0) { let d = ''; for (let k = 0; k <= n; k++) d += (k ? 'L' : 'M') + F.X(k) + ' ' + F.Y(LAC[t][k]); g += `<path d="${d}" fill="none" style="stroke:${c};stroke-width:${t === s.type ? 3.4 : 2};opacity:${t === s.type ? 1 : 0.55};"/>`; }
        for (let k = 0; k <= n; k++) g += cross(F.X(k), F.Y(LAC[t][k]), c, 5);
      });
      // ── الجهاز (على هيئة شكل السؤال ٨ والشكل ٣-١٦) ──
      const bx = 420, bw = 64, top = 70, beadTop = 168, beadBot = 270, n = s.n[s.type];
      g += T(bx + bw / 2, 52, imm ? 'أسطوانة المحقنة (أ)' : 'أسطوانة المحقنة (ب)', { b: 1, c: '#003d33' });
      // الحليب فوق الحبيبات (أثناء التمرير)
      if (s.run) {
        g += `<rect x="${bx + 3}" y="${top + 34}" width="${bw - 6}" height="${beadTop - top - 34}" fill="#fffde7"/>`;
        if (!imm) for (let k = 0; k < 7; k++) g += `<circle cx="${bx + 10 + (k * 13) % (bw - 18)}" cy="${top + 44 + (k * 17) % 50}" r="3" fill="#1565c0"/>`;
      }
      // الحبيبات
      for (let r = 0; r < 6; r++) for (let q = 0; q < 4; q++) {
        const cx = bx + 11 + q * 14 + (r % 2 ? 7 : 0), cy = beadTop + 8 + r * 17;
        if (cx > bx + bw - 8) continue;
        g += `<circle cx="${cx}" cy="${cy}" r="7.5" fill="${s.run ? '#fff8e1' : '#fff'}" stroke="#546e7a" stroke-width="1.3"/>`;
        if (imm) g += `<circle cx="${cx - 2}" cy="${cy - 1}" r="2" fill="#1565c0"/><circle cx="${cx + 2.5}" cy="${cy + 2}" r="1.6" fill="#1565c0"/>`;
      }
      // جسم المحقنة ورأسها
      g += `<path d="M${bx} ${top} V${beadBot + 6} L${bx + bw / 2 - 6} ${beadBot + 26} V${beadBot + 40} M${bx + bw} ${top} V${beadBot + 6} L${bx + bw / 2 + 6} ${beadBot + 26} V${beadBot + 40}" fill="none" stroke="#37474f" stroke-width="2.4"/>`;
      g += `<line x1="${bx - 8}" y1="${top}" x2="${bx}" y2="${top}" stroke="#37474f" stroke-width="2.4"/><line x1="${bx + bw}" y1="${top}" x2="${bx + bw + 8}" y2="${top}" stroke="#37474f" stroke-width="2.4"/>`;
      // قطرات أثناء التمرير
      const dx = bx + bw / 2;
      if (s.run) for (let k = 0; k < 3; k++) g += `<ellipse cx="${dx}" cy="${beadBot + 46}" rx="4" ry="6" fill="#fff59d" stroke="#bdb76b" stroke-width="1"><animate attributeName="cy" values="${beadBot + 44};${beadBot + 92}" dur="0.6s" begin="${k * 0.2}s" repeatCount="indefinite"/></ellipse>`;
      // الكأس والحليب المتجمِّع
      const by0 = 320, by1 = 388, lvl = n > 0 || s.run ? 30 : 0;
      if (lvl) {
        g += `<rect x="${dx - 54}" y="${by1 - lvl}" width="108" height="${lvl}" fill="#fffde7"/>`;
        if (!imm) for (let k = 0; k < 8; k++) g += `<circle cx="${dx - 44 + k * 12}" cy="${by1 - 8 - (k % 3) * 7}" r="3" fill="#1565c0"/>`;
      }
      g += `<path d="M${dx - 58} ${by0} V${by1} H${dx + 58} V${by0}" fill="none" stroke="#37474f" stroke-width="2.2"/>`;
      // تسميات (على هيئة شكل الكتاب)
      const lab = (y1, y2, t1, t2, c) => dline(bx + bw + 2, y1, 500, y2, '#455a64', 1.2) + T(504, y2 + 5, t1, { a: 'end', fs: 16, c: c || '#263238' }) + (t2 ? T(504, y2 + 25, t2, { a: 'end', fs: 16, c: c || '#263238' }) : '');
      g += lab(top + 60, 110, imm ? 'حليب' : 'حليب مع محلول', imm ? '' : 'اللاكتيز (لاكتيز حر)');
      g += lab(beadTop + 40, 190, imm ? 'كريات ألجينات مع' : 'كريات بدون لاكتيز', imm ? 'إنزيم اللاكتيز (لاكتيز مثبت)' : '');
      g += lab(by1 - 14, 300, 'حليب', '');
      // نتيجة الحليب المتجمِّع
      g += T(524, 350, imm ? 'الإنزيم يبقى في' : 'الحليب يحمل', { a: 'end', fs: 16, b: 1, c: imm ? '#009A44' : '#C8102E' }) + T(524, 370, imm ? 'الحبيبات' : 'اللاكتيز معه', { a: 'end', fs: 16, b: 1, c: imm ? '#009A44' : '#C8102E' });
      return g;
    },
    read0() {
      const s = this.s, t = s.type, n = s.n[t], gl = LAC[t][n];
      let h = `${t === 'imm' ? 'المحقنة (أ) — <b>لاكتيز مثبت</b>' : 'المحقنة (ب) — <b>لاكتيز حر</b>'} · عدد مرَّات التمرير: <b>${L(String(n))}</b> · الجلوكوز في الحليب: <b>${L(gl + ' mg/L')}</b> · اللاكتوز المتحلِّل ≈ <b>${L(pctLactose(gl) + '%')}</b>`;
      h += `<div style="height:14px;background:#eceff1;border-radius:7px;margin:6px 0;overflow:hidden;direction:ltr;"><div style="height:100%;width:${pctLactose(gl)}%;background:${t === 'imm' ? '#00695c' : '#C8102E'};"></div></div>`;
      h += t === 'imm' ? `<span style="font-size:15px;">«يؤمّن استخدام الإنزيمات المثبتة الحفاظ على الإنزيمات وإعادة استخدامها، والحصول على منتج خالٍ من الإنزيمات (غير ملوّث بها).» (كتاب الطالب ص ١١٨)</span>` : `<span style="font-size:15px;">«فعند مزج اللاكتيز (غير المثبت) مع الحليب، سيصعب الحصول على اللاكتيز مرة أخرى (لغرض استخدامه)، وسيكون الحليب ملوثًا بالإنزيمات» (كتاب الطالب ص ١١٧)</span>`;
      return h;
    },
    refresh0() {
      if ($('g11im_dyn')) $('g11im_dyn').innerHTML = this.dyn0();
      if ($('g11im_read')) $('g11im_read').innerHTML = this.read0();
      const e = $('g11im_expl');
      if (e) {
        const done = this.s.n.imm === 3 && this.s.n.free === 3;
        e.style.display = done ? 'block' : 'none';
        if (done) e.innerHTML = `<b>د. «صف النمط المبين في التمثيل البياني، واشرحه.»</b> (كتاب الطالب ص ١٢٣)<br><b>إجابة الدليل:</b> «معدل التفاعل الأولي للاكتيز الحر أعلى من معدل التفاعل الأولي للاكتيز المثبت إلّا أن كلًّا من اللاكتيز الحر واللاكتيز المثبت (المثبت هو المصطلح الأهم في حبيبات الألجينات) أنتجا الكمية القصوى نفسها من الجلوكوز الموجود في الحليب (${L('400 mg/L')}).» «يكون المعدل الأولي للتفاعل مع اللاكتيز المثبت في حبيبات الألجينات أقل مما هو مع اللاكتيز الحر لأن المادة المتفاعلة لا يمكنها أن تختلط بحرية مع الإنزيم أو اللاكتيز.» (دليل المعلِّم ج2 ص ١٦٢)`;
      }
    },
    setType(t) {
      if (this.s.run) return;
      this.s.type = t;
      const a = $('g11im_timm'), b = $('g11im_tfree');
      if (a) a.setAttribute('style', btnStyle(t === 'imm')); if (b) b.setAttribute('style', btnStyle(t === 'free', '#C8102E'));
      this.refresh0();
    },
    pass() {
      const s = this.s; if (s.run || s.n[s.type] >= 3) { if (s.n[s.type] >= 3 && $('g11im_read')) $('g11im_read').innerHTML = this.read0() + `<div style="margin-top:4px;">${ok('مُرِّر الحليب ثلاث مرَّات كما في السؤال — جرِّب المحقنة الأخرى أو ابدأ من جديد.')}</div>`; return; }
      s.run = true; this.refresh0();
      setTimeout(() => { s.run = false; s.n[s.type]++; this.refresh0(); }, 1500);
    },
    reset0() { if (this.s.run) return; this.s.n = { imm: 0, free: 0 }; this.refresh0(); },
    all0() { if (this.s.run) return; this.s.n = { imm: 3, free: 3 }; this.refresh0(); },

    // ───────── المرحلة 1: الاستقرار أثناء التخزين (البكتينيز) ─────────
    build1() {
      this.s = { day: 5 };
      const F = this._F = frame({ id: 'g11im_f', x0: 92, y0: 330, w: 400, h: 262, xmin: 0, xmax: 32.5, ymax: 120, gx: range(0, 30, 5), gy: range(0, 120, 10), xl: PEC_D.map(v => [v, String(v)]), yl: range(0, 120, 20).map(v => [v, String(v)]), xt: 'زمن التخزين (أيام)', yt: `النشاط النسبي ${N('%')}`, ytx: 50 });
      let g = F.s + T(300, 34, `نشاط البكتينيز الحر والمثبت بعد التخزين عند ${N('4 °C')}`, { b: 1, c: '#003d33', fs: 17 });
      g += `<line x1="520" y1="160" x2="550" y2="160" stroke="#37474f" stroke-width="3.4"/>` + T(556, 166, 'بكتينيز مثبت', { a: 'end', b: 1 });
      g += `<line x1="520" y1="192" x2="550" y2="192" stroke="#9e9e9e" stroke-width="3.4"/>` + T(556, 198, 'بكتينيز حر', { a: 'end', b: 1 });
      g += `<g id="g11im_dyn">${this.dyn1()}</g>`;
      return SVG('g11im_svg', 392, g) + `
<div style="${CTRL}"><label>زمن التخزين: <input type="range" min="5" max="30" step="5" value="5" style="${RANGE}" oninput="G11SIM_immob.setDay(this.value)"></label><b id="g11im_dv">${L('5')}</b> يومًا</div>
<div id="g11im_read" style="${NOTE}">${this.read1()}</div>
<div style="${NOTE}font-size:15px;">«أجريت تجربة لمقارنة تأثير وقت التخزين على استقرار (أو ثبات) البكتينيز الحر والبكتينيز المثبت. حيث تم تخزين البكتينيز عند درجة حرارة ${L('4 °C')} لمدة 30 يومًا. تم سحب عينة كل 5 أيام لقياس نشاط الإنزيم وتسجيله كنسبة مئوية من نشاطه قبل التخزين.» (كتاب الأنشطة ص ١١٣، أسئلة نهاية الوحدة ٣) — القيم قراءة تقريبيَّة من الشكل.</div>`;
    },
    dyn1() {
      const F = this._F, d = this.s.day, k = PEC_D.indexOf(d);
      let g = '';
      [['imm', '#37474f'], ['free', '#9e9e9e']].forEach(([t, c]) => {
        let p = ''; for (let j = 0; j <= k; j++) p += (j ? 'L' : 'M') + F.X(PEC_D[j]) + ' ' + F.Y(PEC[t][j]);
        if (k > 0) g += `<path d="${p}" fill="none" style="stroke:${c};stroke-width:3.4;"/>`;
        for (let j = 0; j <= k; j++) g += cross(F.X(PEC_D[j]), F.Y(PEC[t][j]), c, 7);
      });
      g += dline(F.X(d), F.o.y0, F.X(d), F.Y(110), '#00695c', 1.6, '5 4');
      g += `<rect x="512" y="232" width="176" height="96" rx="12" fill="#fff" stroke="#b2dfdb" stroke-width="1.6"/>`;
      g += T(600, 256, `بعد ${N(String(d))} يومًا`, { b: 1, c: '#003d33' });
      g += T(676, 284, 'المثبت:', { a: 'start', c: '#37474f' }) + TL(530, 284, `${PEC.imm[k]}%`, { a: 'start', b: 1, c: '#37474f' });
      g += T(676, 312, 'الحر:', { a: 'start', c: '#757575' }) + TL(530, 312, `${PEC.free[k]}%`, { a: 'start', b: 1, c: '#757575' });
      return g;
    },
    read1() {
      const d = this.s.day, k = PEC_D.indexOf(d);
      let h = `بعد ${L(String(d))} يومًا: البكتينيز المثبت ≈ <b>${L(PEC.imm[k] + '%')}</b> من نشاطه قبل التخزين، والبكتينيز الحر ≈ <b>${L(PEC.free[k] + '%')}</b>.`;
      if (d === 30) h += `<div style="margin-top:6px;"><b>أ. «قارن بين تأثير تخزين عينة البكتينيز الحر والمثبت.»</b><br><b>إجابة الدليل:</b> «إن نشاط البكتينيز المثبت هو أعلى من نشاط البكتينيز الحر في جميع الحالات، إذ ينخفض نشاط الإنزيم المثبت إلى ${L('50%')} تقريبًا من نشاطه الأولي بعد 30 يومًا، فيما يهبط نشاط البكتينيز الحر إلى ${L('10%')}» (دليل المعلِّم ج2 ص ١٨٥)</div>`;
      else h += `<div style="font-size:15px;margin-top:4px;">حرِّك المنزلق حتى اليوم ${L('30')} لترى المقارنة كاملة.</div>`;
      return h;
    },
    setDay(v) {
      this.s.day = +v;
      if ($('g11im_dv')) $('g11im_dv').innerHTML = L(String(v));
      if ($('g11im_dyn')) $('g11im_dyn').innerHTML = this.dyn1();
      if ($('g11im_read')) $('g11im_read').innerHTML = this.read1();
    }
  };

  // ═══════════════════════════════════════════════════════════════════════
  // التسجيل
  // ═══════════════════════════════════════════════════════════════════════
  G.simulations = Object.assign(G.simulations || {}, {
    g11_enzyme_factors: {
      sem: 'S1',
      title: '🌡 العوامل المؤثرة في عمل الإنزيم (٣-٤)',
      stages: ['درجة الحرارة (الشكل ٣-٧)', 'الرقم الهيدروجيني pH (الشكل ٣-٨)', 'تركيز الإنزيم (الشكل ٣-٩)', 'تركيز المادة المتفاعلة (الشكل ٣-١٠)'],
      info: [
        'سبق أن درست في الصف التاسع، تأثير درجة الحرارة والرقم الهيدروجيني pH على الإنزيمات. يبيّن الشكل ٣-٧ تأثير درجة الحرارة على إنزيم نموذجي، ويتضمن تأثير ارتفاع درجة الحرارة على تغيير طبيعة الإنزيم (مسخ). (كتاب الطالب ص ١١١)',
        'يبيّن الشكل ٣-٨ تأثير الرقم الهيدروجيني pH على إنزيم نموذجي. توجد أيضًا عوامل أخرى يمكن أن تؤثر على معدل تفاعل الإنزيمات، نعرضها تاليًا بمزيد من التفصيل. (كتاب الطالب ص ١١١) — «يعتمد الرقم الهيدروجيني pH الأمثل على الإنزيم: في هذه الحالة، الرقم الهيدروجيني pH الأمثل هو 7.» (الشكل ٣-٨، ص ١١١)',
        'يمكن مقارنة معدلات هذه التفاعلات الخمسة لمعرفة تأثير تركيز الإنزيم على معدل التفاعل. من الأفضل ملاحظة المعدل في بداية التفاعل مباشرة، لأنه مع بدء التفاعل تتفاوت كميّة المادة المتفاعلة في كل تفاعل، وذلك لأن المادة المتفاعلة تتحوّل إلى ناتج بمعدلات مختلفة في كل من التفاعلات الخمسة. (كتاب الطالب ص ١١٢) فكلما زادت كمية الإنزيم زادت المواقع النشطة المتاحة لارتباط المادة المتفاعلة. ومع وفرة المادة المتفاعلة، يزداد المعدل الأولي للتفاعل خطيًا مع تركيز الإنزيم. (كتاب الطالب ص ١١٣)',
        'يبيّن الشكل ٣-١٠ نتائج استقصاء يتضمّن استخدام إنزيم الكتاليز وبيروكسيد الهيدروجين كمادة متفاعلة. إذ يظهر تباين حجم بيروكسيد الهيدروجين، بينما يبقى حجم الكتاليز ثابتًا. (كتاب الطالب ص ١١٣) السرعة القصوى V<sub>max</sub>: السرعة النظرية القصوى لتفاعل يتحكم به الإنزيم، وتتحقق عندما تكون جميع المواقع النشطة للإنزيم ممتلئة. (مصطلحات علمية، كتاب الطالب ص ١١٣)'
      ],
      build(i) {
        return WRAP(i === 0 || i === 1 ? EF.buildCurve(i) : i === 2 ? EF.buildEC() : EF.buildSub());
      }
    },
    g11_vmax_km: {
      sem: 'S1',
      title: '📈 Vmax وKm والألفة والمثبِّطات (٣-٥ و٣-٦)',
      stages: ['قراءة Vmax وKm (نشاط ٣-٢)', 'مقارنة ألفة إنزيمين (الشكل ٣-١٢)', 'المثبِّطات التنافسيَّة وغير التنافسيَّة'],
      info: [
        'لإيجاد قيمة V<sub>max</sub> يتم قياس معدل التفاعل الأولي لتراكيز المادة المتفاعلة المختلفة، ينتج منه منحنى كما هو مبيّن في الشكلَين ٣-١٠ و٣-١١. يعرف تركيز المادة المتفاعلة عند قيمة ½V<sub>max</sub> باسم ثابت ميكاليس-مينتين Michaelis-Menten Constant (K<sub>m</sub>)، وهو يعبّر عن تركيز المادة المتفاعلة التي يعمل عندها الإنزيم بنصف معدله الأقصى، ويمثل مقياسًا لألفة الإنزيم لمادته المتفاعلة. (كتاب الطالب ص ١١٤)',
        'وألفة الإنزيم هي مقياس قوة الجذب بين الإنزيم والمادة المتفاعلة. فكلما زادت ألفة الإنزيم للمادة المتفاعلة، زاد احتمال بقاء المادة المتفاعلة في الموقع النشط لفترة كافية لاستكمال التفاعل، وعمومًا كلما زادت الألفة زاد عمل الإنزيم. (كتاب الطالب ص ١١٤) فكلما كانت ألفة الإنزيم أعلى، كان تركيز مادته المتفاعلة اللازم للوصول إلى ½V<sub>max</sub> أقل، وكانت قيمة K<sub>m</sub> أقل. (كتاب الطالب ص ١١٤)',
        'لكن إذا ارتفع تركيز المادة المثبّطة أو انخفض تركيز المادة المتفاعلة، ينخفض احتمال ارتباط المادة المتفاعلة بموقع نشط فارغ، الأمر الذي يؤدي إلى تثبيط وظيفة الإنزيم، فيما يسمّى التثبيط التنافسي Competitive inhibition (الشكل ٣-١٣أ). وهو عكسي أي قابل للعكس أحيانًا عبر زيادة تركيز المادة المتفاعلة. (كتاب الطالب ص ١١٥) وهكذا، فإن جُزيء المادة المتفاعلة والجزيء المثبّط غير متنافسَين على الموقع النشط، فيما يُعدّ مثالًا على التثبيط غير التنافسي Non-competitive inhibition كما هو مبين في الشكل ٣-١٣ب، ولن يكون لزيادة تركيز المادة المتفاعلة أيّ تأثير على التثبيط، بخلاف التثبيط التنافسي. (كتاب الطالب ص ١١٦)'
      ],
      build(i) { return WRAP(i === 0 ? VK.build0() : i === 1 ? VK.build1() : VK.build2()); }
    },
    g11_immobilised: {
      sem: 'S1',
      title: '🥛 الإنزيمات المثبتة: عمود اللاكتيز (٣-٧)',
      stages: ['تمرير الحليب: لاكتيز مثبت أم حر؟', 'الاستقرار أثناء التخزين (البكتينيز)'],
      info: [
        'يمكن تثبيت اللاكتيز باستخدام كريات (حبيبات) الألجينات كما في الشكل ٣-١٥. فالمادة المتفاعلة للاكتيز هي السكّر الثنائي اللاكتوز. يمرر الحليب داخل عمود (أسطوانة) يحتوي على كريات (حبيبات) محتوية على اللاكتيز كما في الشكل ٣-١٦. فيقوم اللاكتيز بتحليل اللاكتوز في الحليب إلى الجلوكوز والجالاكتوز، فيصبح الحليب خاليًا من اللاكتوز، حيث يستخدم في صنع ألبان مخصّصة للأشخاص الذين لا يستطيعون هضم اللاكتوز. للإنزيمات المثبتة ميزات عديدة وواضحة مقارنة بالإنزيمات غير المثبتة. فعند مزج اللاكتيز (غير المثبت) مع الحليب، سيصعب الحصول على اللاكتيز مرة أخرى (لغرض استخدامه)، وسيكون الحليب ملوثًا بالإنزيمات؛ بينما يؤمّن استخدام الإنزيمات المثبتة الحفاظ على الإنزيمات وإعادة استخدامها، والحصول على منتج خالٍ من الإنزيمات (غير ملوّث بها). (كتاب الطالب ص ١١٧–١١٨)',
        'ميزة أخرى للإنزيمات المثبتة تتمثّل في أنها أكثر تحمّلًا لتقلّب درجات الحرارة، ولتغيّر الرقم الهيدروجيني pH مقارنة بالإنزيمات في محاليل (غير المثبتة). وربّما يعود هذا إلى أن جزيئاتها مترسّخة بقوة عبر الألجينات المثبتة فيها، وبالتالي فإن طبيعتها لا تتغير بسهولة. وقد يكون السبب أيضًا أنّ الجزيئات الموجودة في الكريات (الحبيبات) ليست مكشوفة بالكامل لتقلّبات الحرارة والرقم الهيدروجيني pH. (كتاب الطالب ص ١١٨)'
      ],
      build(i) { return WRAP(i === 1 ? IM.build1() : IM.build0()); }
    }
  });
})();
