// محاكيات تفاعليَّة — الوحدة 2: الجزيئات الحيويَّة
// g11_benedict  : اختبار بندكت شبه الكمِّي (الاستقصاء ٢-١ + مهارات عمليَّة ٢-١ في كتاب الطالب ص ٧١–٧٢)
// g11_biotests  : منضدة الاختبارات الكيميائيَّة الحيويَّة (الاستقصاء ٢-٢، كتاب التجارب العمليَّة والأنشطة ص ٧٤–٧٩)
// الألوان والنتائج: دليل المعلِّم ص ١٢٥ (الجدول ٢-٢) وص ١٣٠ (نتائج المحاليل المجهولة)؛ الخانات المطلوبة: جدول الكتاب ص ٧٨.
(function () {
  const G = window.G11_DATA = window.G11_DATA || {};

  // ───────── أدوات رسم مشتركة ─────────
  const FONT = 'font-family="Tajawal, sans-serif"';
  const N = s => `<tspan direction="ltr" unicode-bidi="embed">${s}</tspan>`;
  const T = (x, y, t, o = {}) => `<text x="${x}" y="${y}" text-anchor="${o.a || 'middle'}" font-size="${o.fs || 16}" fill="${o.c || '#263238'}" font-weight="${o.b ? 'bold' : 'normal'}" direction="rtl" ${FONT}>${t}</text>`;
  const SVG = (h, inner) => `<svg viewBox="0 0 700 ${h}" style="width:100%;display:block;" xmlns="http://www.w3.org/2000/svg"><defs>
    <marker id="g11u2a" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><polygon points="0 0,9 4.5,0 9" fill="#37474f"/></marker>
  </defs><rect x="4" y="4" width="692" height="${h - 8}" rx="16" fill="#f7fbfa" stroke="#b2dfdb" stroke-width="2"/>${inner}</svg>`;
  const ARR = (x1, y1, x2, y2, c = '#37474f') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="2.5" marker-end="url(#g11u2a)"/>`;
  const CTRL = 'direction:rtl;font-family:Tajawal,sans-serif;font-size:16px;display:flex;flex-wrap:wrap;gap:8px 12px;align-items:center;justify-content:center;padding:8px 6px;';
  const BTN = 'font-family:Tajawal,sans-serif;font-size:16px;padding:6px 12px;border-radius:10px;border:2px solid #00695c;cursor:pointer;';
  const btnStyle = on => BTN + (on ? 'background:#00695c;color:#fff;' : 'background:#fff;color:#00695c;');
  const NOTE = 'direction:rtl;font-family:Tajawal,sans-serif;font-size:16px;line-height:1.8;background:#e0f2f1;border-right:5px solid #00695c;border-radius:10px;padding:8px 12px;margin:6px 8px;color:#003d33;';
  const $ = id => document.getElementById(id);
  const pct = v => parseFloat(v.toPrecision(6)) + '%';

  // أنبوبة اختبار: cx مركزها، top أعلاها، w عرضها، h طولها
  function tube(cx, top, w, h, o = {}) {
    const x0 = cx - w / 2, r = w / 2, bot = top + h - r;
    let s = '';
    if (o.fill) {
      const lv = o.level == null ? 0.5 : o.level, ly = top + h * (1 - lv), i = 3;
      s += `<path d="M${x0 + i} ${ly} L${x0 + i} ${bot} A${r - i} ${r - i} 0 0 0 ${x0 + w - i} ${bot} L${x0 + w - i} ${ly} Z" fill="${o.fill}" opacity="${o.op || 0.95}"/>`;
      if (o.layer) s += `<rect x="${x0 + i}" y="${ly}" width="${w - 2 * i}" height="${Math.min(18, h * lv / 4)}" fill="${o.layer}"/>`;
      if (o.cloudy) {
        const H = bot + r - ly - 14;
        for (let k = 0; k < 14; k++) s += `<circle cx="${x0 + 6 + ((k * 37) % Math.max(1, w - 12))}" cy="${ly + 7 + ((k * 53) % Math.max(1, H))}" r="${1.6 + (k % 3)}" fill="${o.cloudy}" opacity="0.75"/>`;
      }
      if (o.ppt) s += `<path d="M${x0 + i} ${bot - (o.heavy ? 14 : 4)} L${x0 + i} ${bot} A${r - i} ${r - i} 0 0 0 ${x0 + w - i} ${bot} L${x0 + w - i} ${bot - (o.heavy ? 14 : 4)} Z" fill="${o.ppt}"/>`;
      if (o.bubbles) for (let k = 0; k < 7; k++) s += `<circle cx="${x0 + 7 + ((k * 29) % Math.max(1, w - 14))}" cy="${ly - 6 - (k * 11) % 40}" r="${2 + k % 3}" fill="none" stroke="#607d8b" stroke-width="1.4"/>`;
    }
    s += `<path d="M${x0} ${top} L${x0} ${bot} A${r} ${r} 0 0 0 ${x0 + w} ${bot} L${x0 + w} ${top}" fill="${o.fill ? 'none' : 'rgba(255,255,255,.55)'}" stroke="${o.stroke || '#455a64'}" stroke-width="${o.sw || 2.5}"${o.dash ? ' stroke-dasharray="6 5"' : ''}/>`;
    s += `<line x1="${x0 - 4}" y1="${top}" x2="${x0 + w + 4}" y2="${top}" stroke="${o.stroke || '#455a64'}" stroke-width="${o.sw || 2.5}" stroke-linecap="round"/>`;
    if (o.q) s += T(cx, top + h * 0.62, '؟', { fs: o.qfs || 30, b: 1, c: '#C8102E' });
    return s;
  }
  const flame = (cx, y) => `<path d="M${cx} ${y - 30} C${cx + 14} ${y - 10} ${cx + 12} ${y} ${cx} ${y} C${cx - 12} ${y} ${cx - 14} ${y - 10} ${cx} ${y - 30} Z" fill="#ff9800"/><path d="M${cx} ${y - 16} C${cx + 6} ${y - 6} ${cx + 5} ${y} ${cx} ${y} C${cx - 5} ${y} ${cx - 6} ${y - 6} ${cx} ${y - 16} Z" fill="#ffeb3b"/>`;
  const mix = (a, b) => '#' + [1, 3, 5].map(k => Math.round((parseInt(a.substr(k, 2), 16) + parseInt(b.substr(k, 2), 16)) / 2).toString(16).padStart(2, '0')).join('');

  // ═════════════════════════════════════════════════════════════
  // 1) اختبار بندكت شبه الكمِّي
  // ═════════════════════════════════════════════════════════════
  // نتائج العيِّنة: دليل المعلِّم ص ١٢٥ (الجدول ٢-٢)
  const STD = {
    conc: [10, 1, 0.1, 0.01, 0.001, 0.0001],
    name: ['أحمر بنّي', 'برتقالي', 'أصفر', 'أخضر', 'أخضر فاتح', 'أزرق'],
    col: ['#8e2b17', '#ec7a12', '#f2c414', '#4e9a3c', '#a2cf63', '#2b9fd8']
  };
  const BLUE = '#2b9fd8';
  const UNK = [5, 2, 3, 8, 1, 7]; // مواقع العيِّنات المجهولة على سلَّم من 0 إلى 10: زوجي = معيار، فردي = بين معيارين
  const STEPS = [
    { btn: 'نفِّذ اختبار بندكت على المحلول (محلول بندكت + حمّام مائي يغلي).', L: ['اختبار بندكت'], r1: 'أزرق', r2: 'سلبي', fill: BLUE,
      ok: '✔ النتيجة سلبيَّة (يبقى أزرق): «بعض السكريات الثنائية مثل السكروز غير مختزلة، لذلك ستحصل على نتيجة سلبية عند إجراء اختبار كاشف بندكت.» (كتاب الطالب ص ٧١)' },
    { btn: 'ضع قطرتَين من حمض الهيدروكلوريك المخفّف في عيِّنة جديدة، وضعها في الحمّام المائي الذي يغلي لمدّة دقيقتَين.', L: ['حمض', 'الهيدروكلوريك', 'وتسخين دقيقتين'], r1: 'تحلُّل مائي:', r2: 'جلوكوز + فركتوز', fill: '#e9f5fb',
      ok: '✔ «والتفاعل الكيميائي هو تحلّل مائي، يمكن تحقيقه بإضافة حمض الهيدروكلوريك.» (كتاب الطالب ص ٧١) — يتفكَّك السكروز إلى جلوكوز وفركتوز، وكلاهما سكّران مختزلان (دليل المعلِّم ص ١٣١).' },
    { btn: 'ضع كمّيات صغيرة من بيكربونات الصوديوم الصلبة في المحلول إلى أن تتوقّف عن الفوران.', L: ['بيكربونات', 'الصوديوم حتى', 'يتوقَّف الفوران'], r1: 'معادلة', r2: 'الحمض', fill: '#e9f5fb', bubbles: true,
      ok: '✔ بيكربونات الصوديوم «تعمل على معادلة الحمض» (كتاب التجارب العمليَّة والأنشطة ص ٧٨). «يحتاج كاشف بندكت إلى بيئة قلويّة ليعمل، لذا يجب معادلة المحلول بإضافة مادة قلويّة مثل هيدروكسيد الصوديوم.» (كتاب الطالب ص ٧٢)' },
    { btn: 'أضف (5 mL) من محلول بندكت إلى المحلول المعادَل، وضع الأنبوبة في الحمّام المائي الذي يغلي لمدّة 5 دقائق.', L: ['محلول بندكت', 'وتسخين 5 دقائق'], r1: 'أحمر/برتقالي وعكر', r2: 'إيجابي', fill: '#d4561c', cloudy: '#f5c08a', ppt: '#8e2b17',
      ok: '✔ «إذا تغيّر المحلول إلى الأحمر، يكون السكّر غير المختزل موجودًا.» (كتاب الطالب ص ٧٢) — نتيجة العيِّنة: أحمر/برتقالي وعكر (دليل المعلِّم ص ١٣٠).' }
  ];
  const STEP_ORDER = [2, 0, 3, 1]; // ترتيب عرض البطاقات (مخلوط)
  const LIMITS = '<b>حدود الطريقة:</b> «مقارنة الألوان مسألة ذاتية، تجب مناقشتها كمصدر للخطأ.» (دليل المعلِّم ص ١٢٤) — والاختبار شبه الكمّي «الاختبار الذي يعطي نتيجة تقترب من قيمة ما، لكنه لا يعطي القيمة نفسها» (كتاب التجارب العمليَّة والأنشطة ص ٧٠).';
  const LIMIT_Q3 = '«لا يوجد معيار لوني للتركيز <span dir="ltr">0.05%</span> وبالتالي لا يمكن التأكد من صحة التركيز إلّا بين <span dir="ltr">0.1%</span> و<span dir="ltr">0.01%</span>، كما يوجد اختلاف بسيط جدًا في اللون بين التراكيز المعياريّة التي تمّ تحضيرها بين <span dir="ltr">0.01%</span> و<span dir="ltr">0.1%</span>، ولا يمكن الاعتماد على العين المجرّدة لتمييز الفرق.» (دليل المعلِّم ص ١٢٦)';

  const B = window.G11SIM_benedict = {
    sel: 1, heated: true, dil: 1, unk: 0, ans: null, done: 0, fb: '',
    // التخفيف التسلسلي: C(n+1) = C(n) × V(منقول) ÷ (V(منقول) + V(ماء)) — الشكل ٢-٢ والسؤال ٨
    series(c0, vT, vW, n) { const out = [c0]; for (let k = 1; k < n; k++) out.push(parseFloat((out[k - 1] * vT / (vT + vW)).toPrecision(6))); return out; },
    colorOf(p) { return p % 2 === 0 ? STD.col[p / 2] : mix(STD.col[(p - 1) / 2], STD.col[(p + 1) / 2]); },
    labelOf(p) { return p % 2 === 0 ? `<span dir="ltr">${pct(STD.conc[p / 2])}</span>` : `بين <span dir="ltr">${pct(STD.conc[(p - 1) / 2])}</span> و<span dir="ltr">${pct(STD.conc[(p + 1) / 2])}</span>`; },
    isCorrect(p, a) { return p === a; },

    // ── المرحلة 1: سلسلة التراكيز المعياريَّة ──
    svg0() {
      const h = this.heated, sel = this.sel, step = 482 / 6;
      const cx = i => 506 - step * (i + 0.5);
      let s = T(350, 34, h ? 'سلسلة التراكيز المعياريَّة بعد التسخين' : 'سلسلة التراكيز المعياريَّة قبل التسخين', { fs: 18, b: 1, c: '#00695c' });
      s += T(265, 62, `التخفيف التسلسلي (الشكل ٢-٢): «نقل ${N('1 mL')}» ثمَّ «إضافة ${N('9 mL')} ماء»`, { c: '#37474f' });
      s += `<rect x="24" y="160" width="482" height="150" rx="6" fill="#d6ecf7" stroke="#90a4ae" stroke-width="2"/>`;
      if (h) for (let k = 0; k < 16; k++) s += `<circle cx="${36 + k * 29}" cy="${262 - (k * 17) % 60}" r="${2 + k % 3}" fill="none" stroke="#5c9cc0" stroke-width="1.5"/>`;
      for (let i = 0; i < 6; i++) {
        const on = i === sel, x = cx(i);
        s += T(x, 90, N(pct(STD.conc[i])), { b: on, c: on ? '#C8102E' : '#263238' });
        s += tube(x, 100, 34, 190, { fill: h ? STD.col[i] : BLUE, level: 0.48, ppt: h && i === 0 ? '#5d1a0c' : null, stroke: on ? '#C8102E' : '#455a64', sw: on ? 4 : 2.5 });
        if (i < 5) s += ARR(x - 20, 128, cx(i + 1) + 22, 128);
      }
      s += T(265, 304, h ? `حمّام مائي يغلي — ${N('5')} دقائق بالضبط` : 'حمّام مائي (لم يُسخَّن بعد)', { c: '#01579b', b: 1 });
      // اللوحة الجانبيَّة: الأنبوبة المختارة مكبَّرة
      s += `<rect x="528" y="46" width="152" height="270" rx="14" fill="#ffffff" stroke="#b2dfdb" stroke-width="2"/>`;
      s += T(604, 72, `الجلوكوز ${N(pct(STD.conc[sel]))}`, { b: 1, c: '#C8102E' });
      s += tube(604, 84, 62, 176, { fill: h ? STD.col[sel] : BLUE, level: 0.6, ppt: h && sel === 0 ? '#5d1a0c' : null, stroke: '#C8102E', sw: 3 });
      s += T(604, 282, h ? `اللون: ${STD.name[sel]}` : 'اللون: أزرق', { b: 1 });
      s += T(604, 304, h ? 'بعد التسخين' : 'قبل التسخين', { c: '#546e7a' });
      // ترتيب تغيُّر اللون (كتاب الطالب ص ٧١)
      s += T(350, 340, 'ترتيب تغيُّر اللون عند وجود السكَّر المختزل (كتاب الطالب ص ٧١)', { b: 1, c: '#00695c' });
      const sw = [['أزرق', BLUE, '#fff'], ['أخضر', '#4e9a3c', '#fff'], ['أصفر', '#f2c414', '#263238'], ['برتقالي', '#ec7a12', '#fff'], ['بنّي محمر', '#8e2b17', '#fff']];
      sw.forEach((c, k) => {
        const x = 572 - k * 136;
        s += `<rect x="${x}" y="352" width="104" height="34" rx="17" fill="${c[1]}"/>` + T(x + 52, 375, c[0], { b: 1, c: c[2] });
        if (k < 4) s += ARR(x - 4, 369, x - 28, 369);
      });
      return SVG(400, s);
    },
    ctrl0() {
      const ser = this.series(10, this.dil, this.dil === 1 ? 9 : 5, 6).map(v => v + '%').join(' ← ');
      return `<div style="${CTRL}">
        <label for="g11bnRange"><b>تركيز الجلوكوز:</b></label>
        <input id="g11bnRange" type="range" min="0" max="5" step="1" value="${this.sel}" oninput="G11SIM_benedict.setConc(this.value)" style="width:240px;accent-color:#00695c;">
        <b id="g11bnConc" style="color:#C8102E;min-width:70px;"><span dir="ltr">${pct(STD.conc[this.sel])}</span></b>
        <button id="g11bnHeat" style="${btnStyle(!this.heated)}" onclick="G11SIM_benedict.toggleHeat()">${this.heated ? '↺ أنابيب جديدة قبل التسخين' : '🔥 سخِّن في الحمّام المائي 5 دقائق'}</button>
      </div>
      <div style="${CTRL}">
        <label for="g11bnDil"><b>احسب سلسلة التخفيف:</b></label>
        <select id="g11bnDil" onchange="G11SIM_benedict.setDil(this.value)" style="font-family:Tajawal,sans-serif;font-size:16px;padding:4px 8px;border-radius:8px;">
          <option value="1"${this.dil === 1 ? ' selected' : ''}>نقل \u20661 mL\u2069 من المحلول + \u20669 mL\u2069 ماء (الشكل ٢-٢)</option>
          <option value="5"${this.dil === 5 ? ' selected' : ''}>نقل \u20665 mL\u2069 من المحلول + \u20665 mL\u2069 ماء (السؤال ٨)</option>
        </select>
        <span id="g11bnSeries" style="font-weight:bold;color:#003d33;direction:rtl;">${ser.replace(/([0-9.]+%)/g, '<span dir="ltr">$1</span>')}</span>
      </div>
      <div style="${NOTE}">⏱ <b>الزمن حتى أوَّل تغيُّر في اللون:</b> طريقة أخرى لمعايرة الاختبار — «يمكن أيضًا قياس الزمن المستغرق لحدوث أول تغيير في اللون.» (كتاب الطالب ص ٧١)</div>`;
    },
    redraw0() { const e = $('g11bnSvg0'); if (e) e.innerHTML = this.svg0(); },
    setConc(v) { this.sel = +v; this.redraw0(); const c = $('g11bnConc'); if (c) c.innerHTML = `<span dir="ltr">${pct(STD.conc[this.sel])}</span>`; },
    toggleHeat() {
      this.heated = !this.heated; this.redraw0();
      const b = $('g11bnHeat'); if (b) { b.textContent = this.heated ? '↺ أنابيب جديدة قبل التسخين' : '🔥 سخِّن في الحمّام المائي 5 دقائق'; b.setAttribute('style', btnStyle(!this.heated)); }
    },
    setDil(v) {
      this.dil = +v;
      const ser = this.series(10, this.dil, this.dil === 1 ? 9 : 5, 6).map(x => `<span dir="ltr">${x}%</span>`).join(' ← ');
      const e = $('g11bnSeries'); if (e) e.innerHTML = ser;
    },

    // ── المرحلة 2: عيِّنة مجهولة ──
    svg1() {
      const p = UNK[this.unk], a = this.ans, xs = i => 640 - 86 * i;
      let s = T(350, 34, 'قارن لون المحلول المجهول بالألوان المعياريَّة (الشكل ٢-١)', { fs: 18, b: 1, c: '#00695c' });
      for (let i = 0; i < 6; i++) {
        let st = '#455a64', sw = 2.5;
        if (a !== null && a % 2 === 0 && a / 2 === i) { st = a === p ? '#009A44' : '#C8102E'; sw = 4; }
        s += tube(xs(i), 80, 38, 190, { fill: STD.col[i], level: 0.5, ppt: i === 0 ? '#5d1a0c' : null, stroke: st, sw });
        s += T(xs(i), 296, N(pct(STD.conc[i])), { b: 1 });
      }
      if (a !== null && a % 2 === 1) {
        const i = (a - 1) / 2, c = a === p ? '#009A44' : '#C8102E', x1 = xs(i), x2 = xs(i + 1);
        s += `<path d="M${x1} 70 L${x1} 58 L${x2} 58 L${x2} 70" fill="none" stroke="${c}" stroke-width="3.5"/>` + T((x1 + x2) / 2, 52, 'النطاق المقترح', { b: 1, c });
      }
      s += `<rect x="36" y="56" width="108" height="252" rx="14" fill="#fff" stroke="#C8102E" stroke-width="2" stroke-dasharray="7 5"/>`;
      s += tube(90, 80, 46, 190, { fill: this.colorOf(p), level: 0.5 });
      s += T(90, 296, `مجهول ${N(this.unk + 1)}`, { b: 1, c: '#C8102E' });
      s += T(350, 336, 'إذا لم يكن اللون مطابقًا تمامًا للّون المعياري، فابحث عن ألوان المحاليل ذات التركيز', { c: '#37474f' });
      s += T(350, 360, 'الأعلى والأدنى (كتاب التجارب العمليَّة والأنشطة ص ٧١)', { c: '#37474f' });
      return SVG(380, s);
    },
    ctrl1() {
      const opts = UNK.map((_, k) => `<option value="${k}"${k === this.unk ? ' selected' : ''}>المحلول المجهول ${k + 1}</option>`).join('');
      let std = '', rng = '';
      for (let i = 0; i < 6; i++) std += `<button style="${btnStyle(this.ans === 2 * i)}" onclick="G11SIM_benedict.answer(${2 * i})"><span dir="ltr">${pct(STD.conc[i])}</span></button>`;
      for (let i = 0; i < 5; i++) rng += `<button style="${btnStyle(this.ans === 2 * i + 1)}" onclick="G11SIM_benedict.answer(${2 * i + 1})">${this.labelOf(2 * i + 1)}</button>`;
      return `<div style="${CTRL}">
        <label for="g11bnUnk"><b>العيِّنة:</b></label>
        <select id="g11bnUnk" onchange="G11SIM_benedict.setUnk(this.value)" style="font-family:Tajawal,sans-serif;font-size:16px;padding:4px 8px;border-radius:8px;">${opts}</select>
        <button style="${btnStyle(false)}" onclick="G11SIM_benedict.randomUnk()">🎲 عيِّنة عشوائيَّة</button>
      </div>
      <div style="${CTRL}"><b>يطابق معيارًا:</b> ${std}</div>
      <div style="${CTRL}"><b>يقع بين معيارين:</b> ${rng}</div>
      <div id="g11bnFb" style="${NOTE}">${this.fb1()}</div>`;
    },
    fb1() {
      const p = UNK[this.unk], a = this.ans;
      if (a === null) return 'اختر التركيز الذي تقدِّره للمحلول المجهول: «قارن لون المحلول المجهول بألوان معياريّة معروفة، محدّدًا تركيز اللون المعياري الأكثر تشابهًا مع لون المحلول.» (كتاب التجارب العمليَّة والأنشطة ص ٧١)';
      if (a === p) {
        const head = p % 2 === 0 ? `✔ صحيح: لون المحلول المجهول يطابق اللون المعياري للتركيز ${this.labelOf(p)} (${STD.name[p / 2]}).` : `✔ صحيح: التركيز التقريبي ${this.labelOf(p)}.`;
        return `<b style="color:#009A44;">${head}</b><br>${p === 5 ? LIMIT_Q3 + '<br>' : ''}${LIMITS}`;
      }
      let hint;
      if (p % 2 === 1 && a % 2 === 0) hint = 'لون المجهول لا يطابق أيَّ معيار تمامًا؛ «فابحث عن ألوان المحاليل ذات التركيز الأعلى والأدنى، الأمر الذي يساعد على اقتراح النطاق الذي يقع فيه التركيز.»';
      else if (p % 2 === 0 && a % 2 === 1) hint = 'لون المجهول يطابق أحد الألوان المعياريَّة تمامًا؛ ابحث عن «تركيز اللون المعياري الأكثر تشابهًا مع لون المحلول».';
      else hint = 'قارن مرَّة أخرى: أيُّ الألوان المعياريَّة أقرب إلى لون المجهول؟';
      return `<b style="color:#C8102E;">✘ ليس بعد.</b> ${hint}`;
    },
    redraw1() { const e = $('g11bnSvg1'); if (e) e.innerHTML = this.svg1(); const c = $('g11bnCtl1'); if (c) c.innerHTML = this.ctrl1(); },
    answer(a) { this.ans = +a; this.redraw1(); },
    setUnk(v) { this.unk = +v; this.ans = null; this.redraw1(); },
    randomUnk() { let k = this.unk; while (k === this.unk) k = Math.floor(Math.random() * UNK.length); this.setUnk(k); },

    // ── المرحلة 3: السكَّر غير المختزل ──
    svg2() {
      const xs = k => 610 - 164 * k;
      let s = T(350, 32, 'اختبار السكَّر غير المختزل على محلول السكروز — رتِّب الخطوات', { fs: 18, b: 1, c: '#00695c' });
      STEPS.forEach((st, k) => {
        const d = k < this.done, x = xs(k);
        s += T(x, 60, `الخطوة ${['١', '٢', '٣', '٤'][k]}`, { b: 1, c: d ? '#00695c' : '#78909c' });
        s += `<rect x="${x - 74}" y="68" width="148" height="72" rx="14" fill="${d ? '#00695c' : '#eceff1'}" stroke="${d ? '#003d33' : '#b0bec5'}" stroke-width="2"/>`;
        if (d) { const y0 = 104 - (st.L.length - 1) * 10; st.L.forEach((ln, j) => { s += T(x, y0 + j * 20 + 6, ln.replace(/(\d+)/, N('$1')), { b: j === 0, c: '#fff' }); }); }
        else s += T(x, 112, '؟', { fs: 22, b: 1, c: '#90a4ae' });
        s += d ? tube(x, 152, 42, 136, { fill: st.fill, level: 0.45, cloudy: st.cloudy, ppt: st.ppt, bubbles: st.bubbles })
               : tube(x, 152, 42, 136, { stroke: '#b0bec5', dash: true });
        if (k < 3) s += ARR(x - 40, 225, xs(k + 1) + 38, 225);
        if (d) { s += T(x, 310, st.r1, { b: 1, c: k === 3 ? '#C8102E' : '#263238' }); s += T(x, 332, st.r2, { b: k === 0 || k === 3, c: k === 0 ? '#1565c0' : (k === 3 ? '#009A44' : '#37474f') }); }
      });
      s += T(350, 362, this.done === 4 ? 'اكتمل الاختبار: السكروز سكّر غير مختزل' : 'انقر بطاقات الخطوات أسفل الشكل بالترتيب الصحيح', { b: 1, c: this.done === 4 ? '#009A44' : '#546e7a' });
      return SVG(380, s);
    },
    ctrl2() {
      const cards = STEP_ORDER.map(k => {
        const d = k < this.done;
        return `<button ${d ? 'disabled ' : ''}style="${BTN}text-align:right;max-width:330px;line-height:1.6;${d ? 'background:#e0f2f1;color:#78909c;border-color:#b2dfdb;' : 'background:#fff;color:#003d33;'}" onclick="G11SIM_benedict.step(${k})">${d ? '✔ ' : ''}${STEPS[k].btn.replace(/(\d+ mL|\d+)/g, '<span dir="ltr">$1</span>')}</button>`;
      }).join('');
      return `<div style="${CTRL}align-items:stretch;">${cards}</div>
      <div style="${CTRL}"><button style="${btnStyle(false)}" onclick="G11SIM_benedict.reset2()">↺ أعد الاختبار</button></div>
      <div id="g11bnFb2" style="${NOTE}">${this.fb || 'انقر الخطوة الأولى. «تذكّر أنه عند الكشف عن السكّريات غير المختزلة، يجب أولاً إجراء اختبار بندكت للكشف عن احتمال وجود سكّريات مختزلة.» (كتاب التجارب العمليَّة والأنشطة ص ٧٧)'}</div>`;
    },
    // رسالة الخطأ حسب الخطوة المنتظَرة n والمنقورة k
    wrongMsg(n, k) {
      if (n === 0 && k === 1) return '«تذكّر أنه عند الكشف عن السكّريات غير المختزلة، يجب أولاً إجراء اختبار بندكت للكشف عن احتمال وجود سكّريات مختزلة.» (كتاب التجارب العمليَّة والأنشطة ص ٧٧)';
      if (k === 2 && n < 2) return 'لم يُضَف الحمض بعد: تُضاف بيكربونات الصوديوم بعد التحلُّل المائي «فهي تعمل على معادلة الحمض» (كتاب التجارب العمليَّة والأنشطة ص ٧٨).';
      if (k === 3 && n === 0) return 'لا يوجد محلول معادَل بعد. ابدأ باختبار بندكت على المحلول نفسه: «نفّذ اختبار بندكت على المحلول، فإذا كانت النتيجة سلبيّة، يمكن البدء مرّة أخرى بعيّنة جديدة من المحلول.» (كتاب الطالب ص ٧٢)';
      if (k === 3 && n === 1) return 'السكروز لم يتفكَّك بعد: «في اختبار السكّريات غير المختزلة، يتم تفكيك السكّر الثنائي أولًا إلى جُزَيئي السكّر الأحادي المكوّنَين.» (كتاب الطالب ص ٧١)';
      if (k === 3 && n === 2) return '«يحتاج كاشف بندكت إلى بيئة قلويّة ليعمل، لذا يجب معادلة المحلول بإضافة مادة قلويّة مثل هيدروكسيد الصوديوم.» (كتاب الطالب ص ٧٢)';
      return 'ليست هذه الخطوة التالية.';
    },
    step(k) {
      k = +k; if (k < this.done) return;
      if (k === this.done) { this.fb = STEPS[k].ok; this.done++; }
      else this.fb = '<b style="color:#C8102E;">✘ ليست الخطوة التالية.</b> ' + this.wrongMsg(this.done, k);
      const e = $('g11bnSvg2'); if (e) e.innerHTML = this.svg2();
      const c = $('g11bnCtl2'); if (c) c.innerHTML = this.ctrl2();
    },
    reset2() { this.done = 0; this.fb = ''; this.step(-1); }
  };

  // ═════════════════════════════════════════════════════════════
  // 2) منضدة الاختبارات الكيميائيَّة الحيويَّة (الاستقصاء ٢-٢)
  // ═════════════════════════════════════════════════════════════
  const COMP_NAME = { starch: 'نشا', protein: 'بروتين', lipid: 'دهون', red: 'سكّر مختزل', nonred: 'سكّر غير مختزل (سكروز)' };
  const TESTS = [
    { k: 'iod', n: 'اختبار اليود', chip: 'اليود', short: 'محلول اليود', heat: 'التسخين: لا يلزم.', p: 'ص ٧٥',
      proc: 'ضع خمس قطرات من محلول اليود في كل أنبوبة اختبار، ورُجَّ الأنابيب جيدًا لتمتزج المحتويات.',
      margin: 'اختبار اليود: اختبار للكشف عن النشا. يتحوّل اليود إلى اللون الأزرق القاتم عند وجود النشا.',
      safety: 'ينبغي ألّا تتخلّص من محلول اليود برميه في ماء يمكن أن يتسرّب إلى جوف الأرض.' },
    { k: 'biu', n: 'اختبار بيوريت', chip: 'بيوريت', short: 'محلول بيوريت', heat: 'التسخين: لا يلزم.', p: 'ص ٧٦',
      proc: 'ضع (5 mL) من محلول بيوريت في كل أنبوبة اختبار، ورُجَّ المحتويات في كل أنبوبة.',
      margin: 'اختبار بيوريت: اختبار يكشف عن مجموعات الأمين، وبالتالي عن البروتينات. يضاف كاشف بيوريت إلى المادة المجهولة، والتغيّر في اللون من الأزرق الباهت إلى البنفسجي يشير إلى وجود البروتينات.',
      safety: 'محلول بيوريت مهيّج، ويجب التعامل معه بحذر.' },
    { k: 'emu', n: 'اختبار المستحلب', chip: 'المستحلب', short: 'إيثانول ثمَّ ماء', heat: 'التسخين: لا — بعيدًا عن اللهب المكشوف.', p: 'ص ٧٦',
      proc: 'ضع (5 mL) من الإيثانول في كل أنبوبة اختبار. أضف (5 mL) من الماء إلى كل أنبوبة، ورُجَّ المحتويات لتمتزج بشكل جيد.',
      margin: 'اختبار المستحلب للكشف عن الدهون؛ تكوّن المستحلب يشير إلى الدهون (دليل المعلِّم ص ١٣٢).',
      safety: 'الإيثانول شديد القابليّة للاشتعال، لذا يجب إجراء اختبار الدهون بعيدًا عن اللهب المكشوف.' },
    { k: 'red', n: 'اختبار السكّر المختزل', chip: 'السكّر المختزل', short: 'محلول بندكت', heat: 'التسخين: نعم — في حمّام مائي يغلي 5 دقائق.', hot: true, p: 'ص ٧٦–٧٧',
      proc: 'أضف محلول بندكت إلى كل أنبوبة اختبار. عندما يغلي الماء في الحمّام المائي، ضع بحرص أنابيب الاختبار فيه. بعد 5 دقائق، أطفئ موقد اللهب، وأخرج بحرص أنابيب الاختبار باستخدام ماسك أنبوبة الاختبار.',
      margin: 'يعتمد اختبار السكّر المختزل على وجود أيونات Cu²⁺ ذائبة ذات لون أزرق. تستطيع بعض جزيئات السكّر إعطاء إلكترونات إلى أيونات Cu²⁺، فتصبح هذه أيونات Cu⁺ غير ذائبة، وهذا يعني تكوّن راسب أحمر.',
      safety: 'إن تسخين أنابيب الاختبار على لهب مكشوف (مباشرة) خطر جدّاً. لذلك يجب استخدام الحمّام المائي هنا.' },
    { k: 'non', n: 'اختبار السكّر غير المختزل', chip: 'غير المختزل', short: 'حمض ← معادلة ← بندكت', heat: 'التسخين: نعم — حمّام مائي يغلي دقيقتين مع الحمض، ثمَّ 5 دقائق مع بندكت.', hot: true, p: 'ص ٧٧–٧٨',
      proc: 'ضع قطرتَين من حمض الهيدروكلوريك المخفّف في كل أنبوبة اختبار، وضعها في الحمّام المائي الذي يغلي لمدّة دقيقتَين. ضع كمّيات صغيرة من بيكربونات الصوديوم الصلبة في المحلول إلى أن تتوقّف عن الفوران (فهي تعمل على معادلة الحمض). أضف (5 mL) من محلول بندكت إلى كل أنبوبة، وضع الأنابيب في الحمّام المائي الذي يغلي لمدّة 5 دقائق.',
      margin: 'تذكّر أنه عند الكشف عن السكّريات غير المختزلة، يجب أولاً إجراء اختبار بندكت للكشف عن احتمال وجود سكّريات مختزلة.',
      safety: 'بيكربونات الصوديوم ملح قاعدي، ومن الضروري ارتداء نظّارة واقية.' }
  ];
  // العيِّنات: جدول النتائج في كتاب التجارب ص ٧٨ (need = الخانات غير المظلَّلة) + المحاليل المجهولة (دليل المعلِّم ص ١٢٨ للتحضير، ص ١٣٠ للنتائج)
  const ALL = ['iod', 'biu', 'emu', 'red', 'non'];
  const SAMPLES = [
    { n: '1% نشا', c: ['starch'], need: ['iod'] },
    { n: '1% بروتين', c: ['protein'], need: ['biu'] },
    { n: '10% جلوكوز', c: ['red'], need: ['red'] },
    { n: '10% فركتوز', c: ['red'], need: ['red'] },
    { n: '10% مالتوز', c: ['red'], need: ['red'] },
    { n: '10% لاكتوز', c: ['red'], need: ['red'] },
    { n: '10% سكروز', c: ['nonred'], need: ['red', 'non'] },
    { n: 'زيت نباتي', c: ['lipid'], need: ['emu'] },
    { n: 'مياه', c: [], need: ['iod', 'biu', 'red', 'non'] },
    { n: 'إيثانول', c: [], need: ['emu'] },
    { n: 'المحلول (أ)', c: ['red', 'protein'], need: ALL },
    { n: 'المحلول (ب)', c: ['nonred'], need: ALL },
    { n: 'المحلول (ج)', c: ['red', 'starch'], need: ALL }
  ];
  const MYST = [['red', 'protein'], ['nonred'], ['red', 'starch'], ['lipid', 'protein'], ['nonred', 'protein'], ['starch', 'nonred'], ['red', 'lipid'], ['red', 'nonred'], ['protein'], ['lipid', 'nonred']];
  const CLR = { clear: '#e9f5fb', iodPos: '#1d2150', iodNeg: '#e7a43a', biuPos: '#7d3c98', biuNeg: '#5b8fd9', emul: '#f3f3ee', redOr: '#d4561c', blue: '#2b9fd8' };
  const fmtNum = t => t.replace(/(\d+%|\d+ mL|Cu²⁺|Cu⁺|\d+)/g, '<span dir="ltr">$1</span>');
  const fmtSvg = t => t.replace(/(\d+%|\d+ mL|\d+)/g, m => N(m));

  const BT = window.G11SIM_biotests = {
    s: 0, t: 0, ran: {}, m: 0, mran: {}, chk: {}, mfb: '',
    // النتيجة المتوقَّعة لمكوِّنات comp في الاختبار t — الألوان من دليل المعلِّم ص ١٣٠
    result(comp, t) {
      const has = x => comp.indexOf(x) >= 0;
      switch (t) {
        case 'iod': return has('starch') ? { pos: true, name: 'أزرق/أسود', fill: CLR.iodPos, concl: 'يوجد نشا' } : { pos: false, name: 'أصفر/برتقالي', fill: CLR.iodNeg, concl: 'لا يوجد نشا' };
        case 'biu': return has('protein') ? { pos: true, name: 'بنفسجي', fill: CLR.biuPos, concl: 'يوجد بروتين' } : { pos: false, name: 'أزرق', fill: CLR.biuNeg, concl: 'لا يوجد بروتين' };
        case 'emu': return has('lipid') ? { pos: true, name: 'يتكوَّن مستحلب', fill: CLR.emul, cloudy: '#d7d7cf', concl: 'توجد دهون' } : { pos: false, name: 'عديم اللون', fill: CLR.clear, concl: 'لا توجد دهون' };
        case 'red': return has('red') ? { pos: true, name: 'أحمر/برتقالي وعكر', fill: CLR.redOr, cloudy: '#f5c08a', ppt: '#8e2b17', concl: 'يوجد سكّر مختزل' } : { pos: false, name: 'أزرق', fill: CLR.blue, concl: 'لا يوجد سكّر مختزل' };
        case 'non':
          if (has('red') && has('nonred')) return { pos: true, heavy: true, name: 'أحمر/برتقالي وعكر', extra: 'راسب أثقل', fill: CLR.redOr, cloudy: '#f5c08a', ppt: '#8e2b17', concl: 'سكّر مختزل وغير مختزل' };
          if (has('red') || has('nonred')) return { pos: true, name: 'أحمر/برتقالي وعكر', fill: CLR.redOr, cloudy: '#f5c08a', ppt: '#8e2b17', concl: 'قارن بنتيجة اختبار السكّر المختزل' };
          if (has('starch')) return null; // لا يحدِّد الكتاب نتيجة هذا الاختبار للنشا وحده
          return { pos: false, name: 'أزرق', fill: CLR.blue, concl: 'لا يوجد أيُّ نوع من السكّر' };
      }
      return null;
    },
    // التصحيح: السكروز لا يُحكم عليه إذا وُجد سكّر مختزل (دليل المعلِّم ص ١٣١: «لماذا لا يمكنك التأكّد…»)
    grade(comp, chk) {
      const wrong = []; let sucroseOpen = false;
      Object.keys(COMP_NAME).forEach(k => {
        const has = comp.indexOf(k) >= 0, said = !!chk[k];
        if (k === 'nonred' && comp.indexOf('red') >= 0) { sucroseOpen = true; return; }
        if (has !== said) wrong.push(k);
      });
      return { ok: wrong.length === 0, wrong, sucroseOpen };
    },
    sampleLook(c) { return c.indexOf('lipid') >= 0 ? { fill: CLR.clear, layer: '#f3e08a' } : { fill: CLR.clear }; },

    // ── المرحلة 1: المنضدة ──
    svg0() {
      const S = SAMPLES[this.s], Tt = TESTS[this.t], needed = S.need.indexOf(Tt.k) >= 0, R = needed ? this.result(S.c, Tt.k) : null;
      let s = T(350, 32, `${fmtSvg(S.n)} — ${Tt.n}`, { fs: 18, b: 1, c: '#00695c' });
      const look = this.sampleLook(S.c);
      s += tube(590, 64, 48, 190, Object.assign({ level: 0.4 }, look));
      s += T(590, 282, 'قبل', { b: 1 }) + T(590, 304, fmtSvg(S.n), { c: '#546e7a' });
      s += T(445, 132, Tt.short, { b: 1, c: '#00695c' }) + ARR(535, 150, 355, 150);
      if (Tt.hot) s += flame(430, 214) + flame(460, 214) + T(445, 240, 'حمّام مائي يغلي', { c: '#e65100', b: 1 });
      else s += T(445, 178, 'دون تسخين', { c: '#546e7a' });
      if (R) {
        s += tube(300, 64, 48, 190, { fill: R.fill, level: 0.58, cloudy: R.cloudy, ppt: R.ppt, heavy: R.heavy, layer: look.layer && Tt.k !== 'emu' ? look.layer : null });
        s += T(300, 282, 'بعد', { b: 1 }) + T(300, 304, R.name, { b: 1, c: '#37474f' });
      } else {
        s += tube(300, 64, 48, 190, { stroke: '#b0bec5', dash: true }) + T(300, 282, 'بعد', { b: 1, c: '#90a4ae' }) + T(300, 304, '—', { c: '#90a4ae' });
      }
      const cf = !R ? '#eceff1' : (R.pos ? '#e8f5e9' : '#ffebee'), cs = !R ? '#b0bec5' : (R.pos ? '#009A44' : '#C8102E');
      s += `<rect x="24" y="60" width="196" height="232" rx="14" fill="${cf}" stroke="${cs}" stroke-width="2.5"/>`;
      s += T(122, 92, 'النتيجة', { b: 1, c: '#37474f' });
      if (R) {
        s += T(122, 134, R.pos ? 'إيجابيَّة ✔' : 'سلبيَّة ✘', { fs: 22, b: 1, c: cs });
        s += T(122, 176, 'الاستنتاج:', { c: '#546e7a' });
        const words = R.concl.split(' '), half = Math.ceil(words.length / 2);
        s += words.length > 3 ? T(122, 202, words.slice(0, half).join(' '), { b: 1 }) + T(122, 226, words.slice(half).join(' '), { b: 1 }) : T(122, 204, R.concl, { b: 1 });
        if (R.extra) s += T(122, 262, R.extra, { b: 1, c: '#8e2b17' });
      } else {
        s += T(122, 140, 'خانة مظلَّلة', { b: 1, c: '#546e7a' }) + T(122, 166, 'في جدول النتائج', { c: '#546e7a' }) + T(122, 192, 'غير مطلوبة لهذه', { c: '#546e7a' }) + T(122, 216, 'العيِّنة', { c: '#546e7a' }) + T(122, 254, '(كتاب التجارب ص ٧٨)', { c: '#78909c' });
      }
      // صفُّ جدول النتائج لهذه العيِّنة
      s += T(676, 336, 'صفُّ هذه العيِّنة في جدول النتائج:', { a: 'start', b: 1, c: '#00695c' });
      TESTS.forEach((tt, k) => {
        const x = 552 - k * 133, need = S.need.indexOf(tt.k) >= 0, run = this.ran[this.s + ':' + tt.k], r = need ? this.result(S.c, tt.k) : null;
        const fill = !need ? '#cfd8dc' : (k === this.t ? '#e0f2f1' : '#fff');
        s += `<rect x="${x}" y="348" width="124" height="50" rx="9" fill="${fill}" stroke="${k === this.t ? '#00695c' : '#b0bec5'}" stroke-width="${k === this.t ? 2.5 : 1.5}"/>`;
        s += T(x + 62, 368, tt.chip, { b: 1, c: '#37474f' });
        let res = !need ? '— مظلَّلة' : (!run ? 'لم يُجرَ' : (r && r.pos ? '✔ إيجابي' : '✘ سلبي'));
        s += T(x + 70, 390, res, { c: !need || !run ? '#78909c' : (r.pos ? '#009A44' : '#C8102E'), b: need && run });
        if (need && run && r) s += `<circle cx="${x + 15}" cy="384" r="7" fill="${r.fill}" stroke="#455a64" stroke-width="1"/>`;
      });
      return SVG(410, s);
    },
    ctrl0() {
      const known = SAMPLES.slice(0, 10).map((x, k) => `<option value="${k}"${k === this.s ? ' selected' : ''}>${x.n}</option>`).join('');
      const unk = SAMPLES.slice(10).map((x, k) => `<option value="${k + 10}"${k + 10 === this.s ? ' selected' : ''}>${x.n}</option>`).join('');
      const tb = TESTS.map((tt, k) => `<button style="${btnStyle(k === this.t)}" onclick="G11SIM_biotests.setTest(${k})">${tt.n}</button>`).join('');
      const Tt = TESTS[this.t];
      return `<div style="${CTRL}">
        <label for="g11btS"><b>العيِّنة:</b></label>
        <select id="g11btS" onchange="G11SIM_biotests.setSample(this.value)" style="font-family:Tajawal,sans-serif;font-size:16px;padding:4px 8px;border-radius:8px;">
          <optgroup label="موادّ معروفة (جدول ص ٧٨)">${known}</optgroup><optgroup label="المحاليل المجهولة">${unk}</optgroup>
        </select>
      </div>
      <div style="${CTRL}"><b>الكاشف / الاختبار:</b> ${tb}</div>
      <div style="${NOTE}"><b>${Tt.n} — الطريقة (كتاب التجارب العمليَّة والأنشطة ${Tt.p}):</b> ${fmtNum(Tt.proc)}<br>
        <b>${Tt.hot ? '🔥 ' : '❄ '}${fmtNum(Tt.heat)}</b><br>
        📘 ${fmtNum(Tt.margin)}<br>⚠ ${Tt.safety}</div>`;
    },
    redraw0() { const e = $('g11btSvg0'); if (e) e.innerHTML = this.svg0(); const c = $('g11btCtl0'); if (c) c.innerHTML = this.ctrl0(); },
    mark() { this.ran[this.s + ':' + TESTS[this.t].k] = true; },
    setSample(v) { this.s = +v; this.mark(); this.redraw0(); },
    setTest(k) { this.t = +k; this.mark(); this.redraw0(); },

    // ── المرحلة 2: اكشف المجهول ──
    svg1() {
      const comp = MYST[this.m], xs = k => 492 - 104 * k;
      let s = T(350, 32, `عيِّنة مجهولة رقم ${N(this.m + 1)} — أجرِ الاختبارات ثمَّ استنتج محتواها`, { fs: 18, b: 1, c: '#00695c' });
      s += `<rect x="550" y="50" width="140" height="276" rx="14" fill="#fff" stroke="#C8102E" stroke-width="2" stroke-dasharray="7 5"/>`;
      s += tube(620, 70, 60, 210, Object.assign({ level: 0.55, q: true, qfs: 40 }, this.sampleLook(comp)));
      s += T(620, 308, 'عيِّنة مجهولة', { b: 1, c: '#C8102E' });
      TESTS.forEach((tt, k) => {
        const x = xs(k), run = this.mran[tt.k], r = run ? this.result(comp, tt.k) : null;
        if (r) s += tube(x, 90, 40, 180, { fill: r.fill, level: 0.55, cloudy: r.cloudy, ppt: r.ppt, heavy: r.heavy });
        else s += tube(x, 90, 40, 180, { stroke: '#b0bec5', dash: true });
        if (tt.hot && r) s += flame(x, 86);
        s += T(x, 296, tt.chip, { b: 1, c: '#37474f' });
        if (!r) s += T(x, 318, 'لم يُجرَ', { c: '#90a4ae' });
        else {
          s += T(x, 318, r.pos ? '✔ إيجابي' : '✘ سلبي', { b: 1, c: r.pos ? '#009A44' : '#C8102E' });
          const lines = r.extra ? [r.name.split(' ')[0], r.extra] : (r.name.length > 12 ? [r.name.split(' ')[0], r.name.split(' ').slice(1).join(' ')] : [r.name]);
          lines.forEach((ln, j) => { s += T(x, 340 + j * 20, ln, { c: '#37474f' }); });
        }
      });
      return SVG(380, s);
    },
    ctrl1() {
      const tb = TESTS.map(tt => `<button style="${btnStyle(!!this.mran[tt.k])}" onclick="G11SIM_biotests.runM('${tt.k}')">${this.mran[tt.k] ? '✔ ' : '▶ '}${tt.n}</button>`).join('');
      const cb = Object.keys(COMP_NAME).map(k => `<label style="white-space:nowrap;cursor:pointer;"><input type="checkbox" ${this.chk[k] ? 'checked ' : ''}onchange="G11SIM_biotests.setChk('${k}',this.checked)" style="width:18px;height:18px;vertical-align:middle;accent-color:#00695c;"> ${COMP_NAME[k]}</label>`).join('');
      return `<div style="${CTRL}"><b>أجرِ:</b> ${tb}</div>
      <div style="${CTRL}"><b>تحتوي العيِّنة على:</b> ${cb}</div>
      <div style="${CTRL}"><button style="${btnStyle(true)}" onclick="G11SIM_biotests.check()">✓ تحقَّق من استنتاجي</button>
        <button style="${btnStyle(false)}" onclick="G11SIM_biotests.newM()">🎲 عيِّنة مجهولة جديدة</button></div>
      <div id="g11btFb" style="${NOTE}">${this.mfb || 'أجرِ الاختبارات الخمسة على عيِّنات جديدة من المحلول المجهول، ثمَّ اختر المكوِّنات التي تستنتجها واضغط «تحقَّق». «وهي اختبارات نوعيّة، تعطي فكرة فقط عن وجود الجُزيئات أو عدم وجودها، من دون التطرّق إلى مقدارها.» (كتاب التجارب العمليَّة والأنشطة ص ٧٤)'}</div>`;
    },
    redraw1() { const e = $('g11btSvg1'); if (e) e.innerHTML = this.svg1(); const c = $('g11btCtl1'); if (c) c.innerHTML = this.ctrl1(); },
    runM(k) { this.mran[k] = true; this.mfb = ''; this.redraw1(); },
    setChk(k, v) { this.chk[k] = !!v; },
    newM() { let k = this.m; while (k === this.m) k = Math.floor(Math.random() * MYST.length); this.m = k; this.mran = {}; this.chk = {}; this.mfb = ''; this.redraw1(); },
    check() {
      const comp = MYST[this.m], g = this.grade(comp, this.chk), nRun = Object.keys(this.mran).length;
      const HINT = {
        starch: 'النشا: «يتحوّل اليود إلى اللون الأزرق القاتم عند وجود النشا».',
        protein: 'البروتين: «التغيّر في اللون من الأزرق الباهت إلى البنفسجي يشير إلى وجود البروتينات».',
        lipid: 'الدهون: تكوّن المستحلب في اختبار المستحلب يشير إلى الدهون.',
        red: 'السكّر المختزل: راسب أحمر/برتقالي في اختبار السكّر المختزل (بندكت).',
        nonred: 'السكّر غير المختزل: «إذا تغيّر المحلول إلى الأحمر، يكون السكّر غير المختزل موجودًا» بعد سلبيَّة اختبار السكّر المختزل (كتاب الطالب ص ٧٢).'
      };
      let msg = nRun < 5 ? `<span style="color:#e65100;">أجريت ${nRun} من 5 اختبارات.</span> ` : '';
      const truth = comp.map(k => COMP_NAME[k]).join(' + ');
      if (g.ok) msg += `<b style="color:#009A44;">✔ استنتاج صحيح.</b> محتوى العيِّنة: ${truth}.`;
      else msg += `<b style="color:#C8102E;">✘ راجع:</b> ` + g.wrong.map(k => HINT[k]).join(' ');
      if (g.sucroseOpen) msg += '<br>📌 السكروز هنا لا يُحكم عليه: «يحتوي كلا المحلولَين (أ) و(ج) على سكر مختزل يعطي نتيجة إيجابيّة في كل من اختبارات السكر المختزل والسكر غير المختزل. وحيث إن الاختبارات نوعيّة، فمن الصعب تحديد ما إذا كان هناك المزيد من الترسّبات أم لا.» (دليل المعلِّم ص ١٣١) — ويذكر كتاب الطالب: «وإذا وجد كل من السكّر غير المختزل والسكّر المختزل، فسيكون الراسب أثقل من الذي تكوّن في اختبار بندكت.» (ص ٧٢)';
      this.mfb = msg;
      const f = $('g11btFb'); if (f) f.innerHTML = msg;
    }
  };
  BT.ran['0:iod'] = true; // الحالة الافتراضيَّة: نشا + اختبار اليود معروضة

  G.simulations = Object.assign(G.simulations || {}, {
    g11_benedict: {
      sem: 'S1', title: 'اختبار بندكت شبه الكمِّي',
      stages: ['سلسلة التراكيز المعياريَّة', 'عيِّنة مجهولة', 'السكَّر غير المختزل'],
      info: [
        'أضف كاشف بندكت إلى المحلول الذي تختبره، وسخّنه في حمام مائي. إذا وجد السكّر المختزل، فسيتحوّل لون المحلول تدريجيًا إلى الأخضر فالأصفر فالبرتقالي وصولًا إلى بنّي محمر عند تشكل أكسيد النحاس الأحادي غير الذائب وترسبه. وعند استخدام كميّة زائدة من كاشف بندكت للتفاعل مع كل السكّر الموجود، فإن شدّة اللون الأحمر الناتج ترتبط بتركيز السكّر المختزل، لذا يمكن أن يفيد الاختبار كاختبار شبه كمّي. (كتاب الطالب ص ٧١)',
        'يمكن تقدير تركيز محلول السكّر المختزل باستخدام معايير اللون القياسيّة المعدّة بمقارنة اللون مع الألوان الناتجة من الاختبارات على محاليل مختزلة بتراكيز معروفة. (كتاب الطالب ص ٧١) — قارن لون المحلول المجهول بألوان معياريّة معروفة، محدّدًا تركيز اللون المعياري الأكثر تشابهًا مع لون المحلول. إذا لم يكن اللون مطابقًا تمامًا للّون المعياري، فابحث عن ألوان المحاليل ذات التركيز الأعلى والأدنى، الأمر الذي يساعد على اقتراح النطاق الذي يقع فيه التركيز. (كتاب التجارب العمليَّة والأنشطة ص ٧١)',
        'بعض السكريات الثنائية مثل السكروز غير مختزلة، لذلك ستحصل على نتيجة سلبية عند إجراء اختبار كاشف بندكت. وفي هذه الحالة يجب إجراء اختبار للكشف عن السكّر غير المختزل. في اختبار السكّريات غير المختزلة، يتم تفكيك السكّر الثنائي أولًا إلى جُزَيئَي السكّر الأحادي المكوّنَين. والتفاعل الكيميائي هو تحلّل مائي، يمكن تحقيقه بإضافة حمض الهيدروكلوريك. وستكون السكّريات المكوّنة سكّريات مختزلة يكشف عنها باختبار بندكت بعد معادلة الحمض. (كتاب الطالب ص ٧١)'
      ],
      build(i) {
        const S = window.G11SIM_benedict;
        if (i === 0) return `<div style="width:100%;"><div id="g11bnSvg0">${S.svg0()}</div>${S.ctrl0()}</div>`;
        if (i === 1) return `<div style="width:100%;"><div id="g11bnSvg1">${S.svg1()}</div><div id="g11bnCtl1">${S.ctrl1()}</div></div>`;
        return `<div style="width:100%;"><div id="g11bnSvg2">${S.svg2()}</div><div id="g11bnCtl2">${S.ctrl2()}</div></div>`;
      }
    },
    g11_biotests: {
      sem: 'S1', title: 'منضدة الاختبارات الكيميائيَّة الحيويَّة',
      stages: ['المنضدة', 'اكشف المجهول'],
      info: [
        'من المهمّ أن تكون قادرًا على تحديد الجزيئات العضويّة الشائعة. لذلك، تحتاج إلى معرفة الاختبارات الكيميائيّة الحيويّة للكشف عن النشا، والسكّريات المختزلة وغير المختزلة، والبروتينات، والدهون. وهي اختبارات نوعيّة، تعطي فكرة فقط عن وجود الجُزيئات أو عدم وجودها، من دون التطرّق إلى مقدارها. (كتاب التجارب العمليَّة والأنشطة ص ٧٤)',
        'تحتوي ثلاثة محاليل (أ)، (ب)، (ج) على تركيبات مختلفة من النشا والبروتينات والسكّروز والجلوكوز. قم بإجراء الاختبارات الكيميائية الحيوية (البيوكيميائية) لتحديد محتويات كل محلول. (كتاب التجارب العمليَّة والأنشطة ص ٧٥)'
      ],
      build(i) {
        const S = window.G11SIM_biotests;
        if (i === 0) return `<div style="width:100%;"><div id="g11btSvg0">${S.svg0()}</div><div id="g11btCtl0">${S.ctrl0()}</div></div>`;
        return `<div style="width:100%;"><div id="g11btSvg1">${S.svg1()}</div><div id="g11btCtl1">${S.ctrl1()}</div></div>`;
      }
    }
  });
})();
