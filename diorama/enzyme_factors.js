/* ديوراما: العوامل المؤثرة في عمل الإنزيم — المنظور الجزيئي — الدرس ٣-٤
   (كتاب الطالب أحياء ١١ ف١: ص ١١١–١١٣ والأشكال ٣-٧ إلى ٣-١٠؛ ومعها ص ٨٣–٨٦ للروابط في البروتين، وص ١٠٩–١١٠)
   ستَّة جزيئات إنزيم في صفٍّ (شكلها وألوانها كديوراما «مثبّطات الإنزيم»)، على وجه كلٍّ منها سلسلة عديد الببتيد الملتفَّة
   بروابطها الهيدروجينيَّة (نقاط بيضاء) والأيونيَّة؛ وجزيئات المادة المتفاعلة تدخل المواقع النشطة وتخرج نواتج.
   الحركة المستمرَّة (دورات الارتباط) في idle؛ وفي التصوير الثابت (shot) تُعرض لقطة محسوبة من الحالة. */
(function () {
  const { V, sm, M, CSS } = DioramaCore;
  const { BLU, RED, TEAL, PNK, GRY, GRN, ORG, PUR } = CSS;
  const L = s => `<span class="ltr">${s}</span>`;
  const cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const rnd = (i, k) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
  const arc = (a, b, u, h) => a.clone().lerp(b, u).add(V(0, h * Math.sin(Math.PI * u), 0));
  // ── الإنزيم (إحداثيَّات محلِّيَّة كما في enzyme_inhibitors) ثمَّ يُصغَّر بـ SC ─────────────────
  const T = 1.25, AW = 0.62, DP = 0.85, DZ = 1.3, BEV = 0.09, SC = 0.8, FZ = DZ / 2 + BEV;
  const EX = [-8.1, -4.86, -1.62, 1.62, 4.86, 8.1], EY = -0.3 + (1.25 + BEV) * SC;
  const ORDER = [2, 3, 1, 4, 0, 5], RANK = []; ORDER.forEach((e, k) => { RANK[e] = k; });   // ترتيب ظهور الإنزيمات
  const THEAT = [51, 51, 42, 46.5, 51, 51];   // الإنزيم 2 أوَّلاً (هو المقرَّب في الخطوة 3)                // درجة بدء المسخ لكل إنزيم (توضيحي؛ يكتمل خلال 3 درجات)
  const W = (e, x, y, z = 0) => V(EX[e] + x * SC, EY + y * SC, z * SC);
  const tipW = e => W(e, 0, T - DP + 0.03);                 // رأس المادة المتفاعلة حين ترتبط بالموقع النشط
  const ballW = e => W(e, 0, T - DP + 0.62);                 // الناتج داخل الموقع النشط
  const hoverW = e => W(e, 0.12, T + 0.55, 0);                // أقرب ما تصل إليه المادة المتفاعلة من موقع نشط تغيَّر شكله
  const queueW = (e, j) => W(e, j ? 0.82 : -0.82, T + 0.95 + 0.22 * j, 0.25);
  const srcW = (e, side) => V(EX[e] + (side ? 1.0 : -1.0), 3.6, -1.55);
  // ── سحابة جزيئات المادة المتفاعلة الحرَّة خلف الإنزيمات (30 خليَّة) ─────────────────────
  const NC = 30;
  const CELL = Array.from({ length: NC }, (_, k) => { const c = k % 10, r = Math.floor(k / 10);
    return V(-9.0 + c * 2.0 + (r % 2) * 1.0 + 0.4 * (rnd(k, 1) - 0.5), 3.25 + r * 0.72 + 0.25 * rnd(k, 2), -1.75 - r * 0.62 - 0.3 * rnd(k, 3)); });
  const CRANK = []; for (let j = 0; j < NC; j++) CRANK[(j * 7 + 3) % NC] = j;   // ترتيب ظهور الخلايا (متفرِّقة)
  // ── الموادُّ (ألوان سلسلة ديورامات الإنزيمات) ────────────────────────────────────────
  const matE = M(0x3E74C7, { roughness: 0.45 }), matS = M(0xF39A4C, { roughness: 0.5 }), matP = M(0xE8B923, { roughness: 0.35 });
  const matCh = M(0x1E3F78, { roughness: 0.45 }), matHB = M(0xFFFFFF, { roughness: 0.3, emissive: 0x333333 });
  const matPos = M(0xC2327A, { roughness: 0.4 }), matNeg = M(0x12A5A0, { roughness: 0.4 }), matLk = M(0xBFE0FF, { roughness: 0.3, emissive: 0x223344 });
  // ── المخطَّط الخارجي للإنزيم: مستطيل مستدير الأركان في أعلاه الموقع النشط (شقٌّ على هيئة V) ──
  const OUT0 = (() => {
    const P = [], seg = (a, b) => { const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.13)); for (let k = 0; k < n; k++) P.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]); };
    const qa = (cx, cy, a0, a1) => { for (let k = 0; k < 7; k++) { const a = a0 + (a1 - a0) * k / 7; P.push([cx + 0.6 * Math.cos(a), cy + 0.6 * Math.sin(a)]); } };
    const H = Math.PI / 2;
    seg([AW, T], [1.0, T]); qa(1.0, 0.65, H, 0); seg([1.6, 0.65], [1.6, -0.65]); qa(1.0, -0.65, 0, -H); seg([1.0, -1.25], [-1.0, -1.25]);
    qa(-1.0, -0.65, -H, -2 * H); seg([-1.6, -0.65], [-1.6, 0.65]); qa(-1.0, 0.65, 2 * H, H); seg([-1.0, T], [-AW, T]); seg([-AW, T], [0, T - DP]); seg([0, T - DP], [AW, T]);
    return P;
  })();
  // تشوُّه الشكل: h = تفكُّك الروابط الهيدروجينيَّة بالحرارة (الموقع النشط يضيق وينحرف ويتجعَّد)، p = تغيُّر pH (الحافَّتان تنفرجان ويرتفع القاع)
  function warp(x, y, e, h, p) {
    const s = 1.7 * e + 0.5, wt = cl(1 - Math.abs(x) / 1.45) * sm((y + 0.2) / 0.6);
    let X = x, Y = y;
    if (p > 0) { X += p * 0.42 * Math.sign(x) * wt; Y += p * 0.45 * wt * cl(1 - Math.abs(x) / 0.9) + p * 0.04 * Math.sin(3 * x + s); }
    if (h > 0) { X += h * (-0.45 * x * wt + 0.3 * wt) + h * 0.12 * Math.sin(2.3 * y + s); Y += h * (0.1 * Math.sin(2.9 * x + 1.3 * s) - 0.12 * wt); }
    return [X, Y];
  }
  const EXT = { depth: DZ, bevelEnabled: true, bevelThickness: BEV, bevelSize: 0.07, bevelSegments: 2, curveSegments: 4 };
  const GE = new Map(), GT = new Map();
  const qk = v => Math.round(cl(v) * 16);
  function enzGeom(e, h, p) {
    const kh = qk(h), kp = qk(p), key = (kh || kp) ? e * 1000 + kh * 20 + kp : -1;
    if (!GE.has(key)) {
      const pts = OUT0.map(([x, y]) => warp(x, y, e, kh / 16, kp / 16)), s = new THREE.Shape();
      s.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) s.lineTo(pts[i][0], pts[i][1]);
      const g = new THREE.ExtrudeGeometry(s, EXT); g.translate(0, 0, -DZ / 2); GE.set(key, g);
    }
    return GE.get(key);
  }
  // ── سلسلة عديد الببتيد على الوجه الأمامي: ستَّة مقاطع متوازية (ملتفَّة ذهاباً وإياباً) ──────────
  const SX = [-1.3, -1.02, -0.74], YT = 1.0, YB = -0.9;
  const CH0 = (() => {
    const P = [], col = (x, y0, y1) => { for (let k = 0; k <= 4; k++) P.push([x, y0 + (y1 - y0) * k / 4]); };
    col(SX[0], YT, YB); P.push([-1.16, YB - 0.13]); col(SX[1], YB, YT); P.push([-0.88, YT + 0.13]); col(SX[2], YT, YB);
    P.push([-0.4, -1.02], [0, -1.04], [0.4, -1.02]);
    col(-SX[2], YB, YT); P.push([0.88, YT + 0.13]); col(-SX[1], YT, YB); P.push([1.16, YB - 0.13]); col(-SX[0], YB, YT);
    return P;
  })();
  function chainGeom(e, h, p) {
    const kh = qk(h), kp = qk(p), key = (kh || kp) ? e * 1000 + kh * 20 + kp : -1;
    if (!GT.has(key)) {
      const hh = kh / 16, pp = kp / 16, s = 1.7 * e;
      const pts = CH0.map(([x, y], k) => { const [X, Y] = warp(x, y, e, hh, pp); return V(X + hh * 0.17 * Math.sin(k * 1.9 + s), Y + hh * 0.17 * Math.cos(k * 1.3 + 2 * s), FZ + 0.02); });
      GT.set(key, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 160, 0.055, 7, false));
    }
    return GT.get(key);
  }
  // الروابط الهيدروجينيَّة بين المقاطع المتجاورة، والروابط الأيونيَّة قرب أعلى الذراعين
  const HBS = []; for (const sg of [-1, 1]) for (const [a, b] of [[0, 1], [1, 2]]) for (const y of [-0.55, 0.0, 0.5]) HBS.push([sg * SX[a], sg * SX[b], y]);
  const IBS = [[-1.3, -1.02, 0.86], [1.3, 1.02, 0.86]];                 // [موجب NH3+، سالب COO−، y]
  const HTH = HBS.map((_, r) => 0.06 + 0.55 * rnd(r, 9));                // عتبة تفكُّك كل رابطة هيدروجينيَّة (من h)
  // ── المعدلات (توضيحيَّة) ─────────────────────────────────────────────────────────
  const RT = t => t <= 40 ? 0.07 + 0.93 * (Math.max(0, t) / 40) ** 2 : t >= 55 ? 0 : Math.pow(Math.cos((t - 40) / 15 * Math.PI / 2), 1.2);   // شكل الشكل ٣-٧
  const kin = t => t <= 40 ? 0.07 + 0.93 * (Math.max(0, t) / 40) ** 2 : 1 + 0.02 * (t - 40);
  const RpH = v => cl((Math.exp(-(((v - 7) / 2.0) ** 2)) - 0.02) / 0.98);                                                      // شكل الشكل ٣-٨
  const Lw = n => n < 0.5 ? 50 : Math.max(0, 6 / n - 0.2), occ = n => 1 / (1 + Lw(n));                                         // انتظار وصول المادة المتفاعلة
  let S, C, live = false, lastT = null, TAU = 0, GA = null, lastH = '';
  const heat = e => sm((S.T - THEAT[e]) / 3), phB = () => 1 - RpH(S.pH);
  const fit = e => (1 - heat(e)) * RpH(S.pH);
  const pres = e => cl(S.ne - RANK[e]);
  const ST = EX.map((_, e) => ({ m: 'a', pos: 0, Lw: 0, side: e % 2, b: false }));
  function rateDisp() {
    let n = 0; for (let e = 0; e < 6; e++) n += pres(e);
    const sw = sm(S.sw), g = Math.round(S.gm);
    if (g === 0) return RT(S.T) * RpH(S.pH) * sw * Math.min(1, n / 3);
    let r = 0; for (let e = 0; e < 6; e++) r += pres(e) * fit(e);
    return r * occ(S.ns) * sw / (g === 1 ? 6 * occ(14) : 6);
  }
  // ── الكائنات ───────────────────────────────────────────────────────────────────
  const wp = o => o.getWorldPosition(V(0, 0, 0));
  const O = { enz: [], body: [], chain: [], hb: [], ion: [], cloud: [], dock: [], prod: [], q: [] };
  let gSub, gBall;
  function staticPose() {                                    // للتصوير الثابت: مرحلة كل إنزيم محسوبة من الحالة لا من الزمن
    const lw = Lw(S.ns);
    for (let e = 0; e < 6; e++) {
      const st = ST[e], c = ((0.37 * RANK[e] + 0.55) % 1) * (1 + lw);
      st.side = e % 2; st.b = fit(e) < 0.15;
      if (c < lw) { st.m = 'w'; st.pos = c; st.Lw = lw; } else { st.m = 'a'; st.pos = st.b ? 0.47 : c - lw; }
    }
  }
  function placeCycle(e) {
    const st = ST[e], D = O.dock[e], P = O.prod[e], pr = pres(e) * sm(S.sw), sgn = st.side ? 1 : -1;
    D.visible = P.visible = false;
    if (pr < 0.02 || st.m !== 'a') return;
    const qd = sm(S.q), src = srcW(e, st.side).lerp(queueW(e, 0), qd), u = st.pos;
    let p, sc = SC, rz = 0;
    if (!st.b && qd > 0.5) {                               // السرعة القصوى: الموقع النشط مشغول دائماً، والجزيء المنتظِر يدخل فور خروج الناتج
      if (u < 0.62) p = tipW(e); else if (u < 0.72) { p = tipW(e); sc = SC * (1 - sm((u - 0.62) / 0.1)); } else sc = 0;
      const Q = O.q[e][0], w = sm((u - 0.72) / 0.28);
      Q.userData.ov = true; Q.position.copy(u < 0.72 ? queueW(e, 0) : arc(queueW(e, 0), tipW(e), w, 0.12)); Q.rotation.set(0, 0, 0.22 * (1 - w));
      Q.scale.setScalar(SC * (u < 0.72 ? 0.75 * sm(u / 0.15) : 0.75 + 0.25 * w) * Math.max(0.001, qd * pr)); Q.visible = true;
    } else if (!st.b) {
      if (u < 0.4) { const w = sm(u / 0.4); p = arc(src, tipW(e), w, qd > 0.5 ? 0.3 : 0.9); sc = SC * (0.7 + 0.3 * w) * sm(u / 0.05); rz = (1 - w) * 0.6 * sgn; }
      else if (u < 0.62) p = tipW(e);
      else if (u < 0.72) { p = tipW(e); sc = SC * (1 - sm((u - 0.62) / 0.1)); }
      else sc = 0;
    } else {                                                 // الموقع النشط تغيَّر شكله: تقترب المادة المتفاعلة ثم ترتدُّ
      const H = hoverW(e);
      if (u < 0.4) { const w = sm(u / 0.4); p = arc(src, H, w, 0.8); sc = SC * (0.7 + 0.3 * w) * sm(u / 0.05); rz = (1 - w) * 0.6 * sgn; }
      else if (u < 0.58) { const v = (u - 0.4) / 0.18; p = H.clone().add(V(0.05 * Math.sin(v * 9), -0.14 * Math.sin(Math.PI * v), 0)); rz = 0.28 * Math.sin(v * 7); }
      else { const w = sm((u - 0.58) / 0.42); p = arc(H, src, w, 0.7); sc = SC * (1 - 0.3 * w) * (1 - sm((u - 0.93) / 0.07)); rz = -w * 0.5 * sgn; }
    }
    if (!st.b && u > 0.62) {                                // الناتج يتكوَّن في الموقع النشط ثم يخرج
      const g = sm((u - 0.62) / 0.08), w = sm((u - 0.72) / 0.28);
      P.visible = true; P.position.copy(arc(ballW(e), ballW(e).add(V(0.7 * sgn, 1.6, 2.2)), w, 0.5));
      P.scale.setScalar(Math.max(0.001, 0.3 * SC * g * (1 - sm((u - 0.85) / 0.15)) * pr));
    }
    if (p && sc > 0.002) { D.visible = true; D.position.copy(p); D.scale.setScalar(sc * Math.max(0.001, pr)); D.rotation.set(0, 0, rz); }
  }
  function gauge() {
    if (!GA) return;
    const R = cl(rateDisp(), 0, 1.05), fx = Math.round(S.fx), g = Math.round(S.gm);
    let ne = 0; for (let e = 0; e < 6; e++) ne += Math.round(pres(e));
    const tC = Math.round(S.T), ph = Math.round(S.pH * 2) / 2;
    let tag = '';
    if (fx === 0) tag = Math.abs(S.T - 40) < 0.6 ? 'درجة الحرارة المثلى' : S.T >= 55 ? 'مسخ الإنزيم كليًا' : S.T > 41 ? 'مسخ الإنزيم' : '';
    else if (fx === 1 && Math.abs(S.pH - 7) < 0.1) tag = 'الرقم الهيدروجيني pH الأمثل';
    else if (g === 2 && S.vm > 0.5) tag = `السرعة القصوى ${L('V<sub>max</sub>')}`;
    const chip = (k, lab, v) => `<span class="${k === fx ? 'on' : ''}">${lab} <bdi dir="ltr">${v}</bdi></span>`;
    const h = `<div class="gh">معدل التفاعل <b>(توضيحي)</b></div>` +
      `<div class="gb"><i style="width:${(R * 100 / 1.05).toFixed(1)}%"></i>${S.vm > 0.02 ? `<u style="opacity:${sm(S.vm).toFixed(2)}"><em>${L('V<sub>max</sub>')}</em></u>` : ''}</div>` +
      `<div class="gt">${tag || '&nbsp;'}</div>` +
      `<div class="gc">${chip(0, 'درجة الحرارة', tC + ' °C')}${chip(1, 'pH', ph % 1 ? ph.toFixed(1) : ph)}${chip(2, 'جزيئات الإنزيم', ne)}${chip(3, 'جزيئات المادة المتفاعلة', Math.round(S.ns))}</div>`;
    if (h !== lastH) { GA.innerHTML = h; lastH = h; }
    GA.style.opacity = sm(S.gv).toFixed(2);
  }

  window.DIORAMA = {
    id: 'enzyme_factors', title: 'العوامل المؤثرة في عمل الإنزيم', subtitle: 'الأحياء — الصف الحادي عشر — الوحدة الثالثة: الإنزيمات',
    source: 'النص من كتاب الطالب: ٣-٤ العوامل المؤثرة في عمل الإنزيم (ص ١١١–١١٣) والأشكال ٣-٧ إلى ٣-١٠، وص ٨٣–٨٦ و١٠٩–١١٠',
    legend: [['#3E74C7', 'الإنزيم'], ['#F39A4C', 'المادّة المتفاعلة'], ['#E8B923', 'ناتج', 'dot'], ['#1E3F78', 'سلسلة عديد الببتيد', 'tube'], null,
             ['#fff;border:2px solid #9aa7b4', 'رابطة هيدروجينيّة', 'dot'], ['#C2327A', `مجموعة أمين متأينة ${L('NH<sub>3</sub><sup>+</sup>')}`, 'dot'], ['#12A5A0', `مجموعة كربوكسيل متأينة ${L('COO<sup>−</sup>')}`, 'dot']],
    camera: { VH: 15.2, center: [-3.6, 2.2, 0.4], elevation: 24, azimuth: 32 },
    base: { L: 21.6, W: 7.6, x: 0, z: -0.7 },
    BASE: { fo: 0, T: 40, pH: 7, ne: 0, ns: 0, sw: 1, gm: 0, fx: 0, q: 0, vm: 0, gv: 0 },
    noGeom: ['fo', 'T', 'pH', 'ne', 'ns', 'sw', 'gm', 'fx', 'q', 'vm', 'gv'],
    focus(s) { S = s; return Math.round(S.fo || 0) === 1 ? W(2, 0, 0.5, 0).add(V(-1.75, -0.2, 1.3)) : V(-3.6, 2.2, 0.4); },
    STEPS: [
      { t: 'ما الذي يحدّد معدل التفاعل؟',
        p: 'ويعتمد المعدل الذي يحدث به التفاعل على:<br>• عدد جزيئات الإنزيم المتوافرة.<br>• السرعة التي يستطيع بها الإنزيم تحويل المادة المتفاعلة إلى ناتج، وإطلاقه، ثم الارتباط بجزيء آخر من المادة المتفاعلة.',
        n: 'كتاب الطالب ص ١٠٩. مقياس «معدل التفاعل» في الأعلى توضيحي يقارن الخطوات، وليس قياسًا حقيقيًّا.',
        seq: [[{ ne: 3, ns: 14, gv: 1 }, 2600]],
        pills: [['الإنزيم', BLU, () => W(3, 1.2, -0.5, 0.75), 120, 70], ['الموقع النشط', TEAL, () => W(2, 0, T - 0.25, 0.4), 60, 105],
                ['المادة المتفاعلة', ORG, () => CELL[CRANK[1]].clone(), -40, -75], ['سلسلة عديد الببتيد الملتفة', PUR, () => W(1, -1.3, -0.3, 0.8), -130, -70]] },
      { t: 'ارتفاع درجة الحرارة حتى المثلى',
        p: `سبق أن درست في الصف التاسع، تأثير درجة الحرارة والرقم الهيدروجيني ${L('pH')} على الإنزيمات. يبيّن الشكل ٣-٧ تأثير درجة الحرارة على إنزيم نموذجي، ويتضمن تأثير ارتفاع درجة الحرارة على تغيير طبيعة الإنزيم (مسخ).`,
        n: 'الشكل ٣-٧: يزداد معدل التفاعل حتى درجة الحرارة المثلى (\u200E40 °C\u200E في هذا الإنزيم). تسارُع حركة الجزيئات هنا تمثيل توضيحي؛ والكتاب لا يشرح سبب بطء التفاعل في درجات الحرارة المنخفضة.',
        seq: [[{ '!fx': 0, T: 10 }, 2000], [{ T: 10 }, 900], [{ T: 40 }, 4200]],
        pills: [['الإنزيم', BLU, () => W(3, 1.2, -0.5, 0.75), 120, 70], ['المادة المتفاعلة', ORG, () => CELL[CRANK[1]].clone(), -40, -75]] },
      { t: 'فوق المثلى: تتفكّك الروابط الهيدروجينية',
        p: `يسمى الشكل الذي تنطوي به سلسلة عديد الببتيد بالتركيب الثانوي ${L('Secondary structure')} للبروتين. يمكن أن يتأثر التركيب الثانوي بالتغيرات في درجة الحرارة والرقم الهيدروجيني ${L('pH')}، حيث يسهل تفكيك الروابط الهيدروجينية. ويترتب على ذلك عواقب كبيرة على الكائنات الحية.`,
        n: 'من الوحدة الثانية (ص ٨٣). الشكل ٣-٧: بعد درجة الحرارة المثلى يبدأ مسخ الإنزيم فينخفض المعدل. النقاط البيضاء روابط هيدروجينية بين أجزاء السلسلة الملتفة.',
        seq: [[{ '!fo': 1, zoom: 2.0 }, 1200], [{ T: 50 }, 4600]],
        pills: [['الروابط الهيدروجينية تتفكك', GRY, () => wp(O.hb[2][1][0]), -170, -40], ['يتغير شكل الموقع النشط', TEAL, () => W(2, 0.25, T - 0.3, 0.5), 150, -80],
                ['مسخ الإنزيم', RED, () => W(2, 1.1, -0.7, 0.75), 140, 70]] },
      { t: 'مسخ الإنزيم كليًا',
        p: 'للعديد من البروتينات الكرويّة دور في تفاعلات الأيض، فشكلها المحدّد مفتاح عملها. الإنزيمات، هي أحد البروتينات الكرويّة.',
        n: 'من الوحدة الثانية (ص ٨٦). الشكل ٣-٧: عند مسخ الإنزيم كليًا يصبح معدل التفاعل صفرًا — تقترب المادة المتفاعلة من الموقع النشط الذي تغيّر شكله ثم ترتدّ.',
        seq: [[{ zoom: 1 }, 1100], [{ '!fo': 0, T: 56 }, 3000]],
        pills: [['مسخ الإنزيم كليًا', RED, () => W(3, 1.2, -0.5, 0.75), 120, 70], ['الموقع النشط تغيّر شكله', TEAL, () => W(2, 0.2, T - 0.2, 0.4), 40, 115]] },
      { t: 'الرقم الهيدروجيني pH',
        p: `يبيّن الشكل ٣-٨ تأثير الرقم الهيدروجيني ${L('pH')} على إنزيم نموذجي. يعتمد الرقم الهيدروجيني ${L('pH')} الأمثل على الإنزيم: في هذه الحالة، الرقم الهيدروجيني ${L('pH')} الأمثل هو ${L('7')}.<br>الروابط الأيونيّة: تتكوّن بين مجموعات أمين متأينة (${L('NH<sub>3</sub><sup>+</sup>')}) ومجموعات حمض الكربوكسيل المتأينة (${L('COO<sup>−</sup>')})، يمكن كسرها بتغيير الرقم الهيدروجيني ${L('pH')}.`,
        n: 'إنزيمات جديدة عند درجة الحرارة المثلى، ثم ينخفض الرقم الهيدروجيني pH من 7 إلى 3. الجملة الأخيرة من الشكل ٢-٢٠ج (ص ٨٤).',
        seq: [[{ sw: 0 }, 700], [{ '!T': 40, '!fx': 1, sw: 1 }, 900], [{ '!fo': 1, zoom: 1.85 }, 1100], [{ pH: 3 }, 4200]],
        pills: [['رابطة أيونيّة', BLU, () => wp(O.ion[2][0].lk[1]), -170, -60], [`مجموعة أمين متأينة ${L('NH<sub>3</sub><sup>+</sup>')}`, PNK, () => wp(O.ion[2][1].a), 190, -70],
                [`مجموعة حمض الكربوكسيل المتأينة ${L('COO<sup>−</sup>')}`, TEAL, () => wp(O.ion[2][1].c), 200, 40], ['يتغير شكل الموقع النشط', GRN, () => W(2, 0, T - 0.3, 0.5), 40, -120]] },
      { t: 'تركيز الإنزيم',
        p: 'يبيّن هذا التمثيل البياني أن المعدل الأولي للتفاعل يزداد خطيًا. وفي هذه الظروف، يتناسب معدل التفاعل طرديًا مع تركيز الإنزيم. وهو ما يُفترض حدوثه؛ فكلما زادت كمية الإنزيم زادت المواقع النشطة المتاحة لارتباط المادة المتفاعلة. ومع وفرة المادة المتفاعلة، يزداد المعدل الأولي للتفاعل خطيًا مع تركيز الإنزيم.',
        n: '«هذا التمثيل البياني» هو الشكل ٣-٩ب (ص ١١٢): المعدل الأولي للتفاعل مقابل تركيز الإنزيم.',
        seq: [[{ sw: 0, zoom: 1 }, 800], [{ '!pH': 7, '!ne': 2, '!fx': 2, '!gm': 1, '!fo': 0, sw: 1 }, 900], [{ ne: 2 }, 700], [{ ne: 6 }, 3800]],
        pills: [['مواقع نشطة متاحة أكثر', TEAL, () => W(0, 0, T - 0.25, 0.4), -60, -95], ['جزيئات الإنزيم', BLU, () => W(5, 1.2, -0.5, 0.75), 100, 60]] },
      { t: 'تركيز المادة المتفاعلة',
        p: 'يزداد المعدل الأولي للتفاعل أيضًا بازدياد تركيز المادة المتفاعلة، وهو أمر متوقع؛ فكلما ازداد عدد جزيئات المادة المتفاعلة ازداد عدد مرات دخولها إلى المواقع النشطة.',
        n: 'ص ١١٠: «وقد تكون جزيئات الإنزيمات في «انتظار» وصول جزيئات المادة المتفاعلة لترتبط في مواقعها النشطة.» — تركيز الإنزيم هنا ثابت (6 جزيئات).',
        seq: [[{ ns: 3, '!fx': 3, '!gm': 2 }, 1500], [{ ns: 3 }, 1400], [{ ns: 9 }, 3600]],
        pills: [['جزيئات المادة المتفاعلة', ORG, () => CELL[CRANK[2]].clone(), -40, -75], ['تركيز الإنزيم ثابت', BLU, () => W(5, 1.2, -0.5, 0.75), 100, 60]] },
      { t: 'امتلاء جميع المواقع النشطة: Vmax',
        p: `إلّا أنه مع استمرار زيادة تركيز المادة المتفاعلة، والحفاظ على تركيز الإنزيم ثابتًا، ستمتلئ جميع المواقع النشطة للإنزيم. وإذا أضيف المزيد من المادة المتفاعلة، لا يستطيع الإنزيم ببساطة أن يعمل بسرعة، حيث إن جزيئات المادة المتفاعلة سوف «تنتظر» لترتبط بالموقع النشط. يعمل الإنزيم بالسرعة القصوى الممكنة له، والمسماة ${L('V<sub>max</sub>')}، حيث ${L('V')} تعني السرعة، و ${L('max')} تعني القصوى.`,
        n: 'السرعة القصوى Vmax: السرعة النظرية القصوى لتفاعل يتحكم به الإنزيم، وتتحقق عندما تكون جميع المواقع النشطة للإنزيم ممتلئة. (مصطلحات علمية ص ١١٣)',
        seq: [[{ ns: 30, q: 1 }, 4200], [{ vm: 1 }, 900]],
        pills: [['جزيئات المادة المتفاعلة «تنتظر»', ORG, () => queueW(3, 1), 120, -95], ['جميع المواقع النشطة ممتلئة', TEAL, () => W(0, 0, T - 0.3, 0.4), -40, -160]] },
    ],
    setup(ctx) {
      C = ctx;
      const subShape = () => { const s = new THREE.Shape(); s.moveTo(0, 0); s.lineTo(AW, DP); s.lineTo(0.95, DP); s.lineTo(0.95, DP + 0.6); s.lineTo(-0.95, DP + 0.6); s.lineTo(-0.95, DP); s.lineTo(-AW, DP); s.lineTo(0, 0); return s; };
      gSub = new THREE.ExtrudeGeometry(subShape(), { depth: 0.95, bevelEnabled: true, bevelThickness: 0.09, bevelSize: 0.07, bevelSegments: 2 }); gSub.translate(0, 0, -0.475);
      gBall = new THREE.SphereGeometry(1, 20, 14);
      const gDot = new THREE.SphereGeometry(1, 10, 8);
      for (let e = 0; e < 6; e++) {
        const G = new THREE.Group(); G.position.set(EX[e], EY, 0); ctx.scene.add(G); O.enz.push(G);
        const b = new THREE.Mesh(enzGeom(e, 0, 0), matE); b.castShadow = b.receiveShadow = true; G.add(b); O.body.push(b);
        const ch = new THREE.Mesh(chainGeom(e, 0, 0), matCh); ch.castShadow = true; G.add(ch); O.chain.push(ch);
        O.hb.push(HBS.map(() => [0, 1, 2].map(() => { const d = new THREE.Mesh(gDot, matHB); G.add(d); return d; })));
        O.ion.push(IBS.map(() => { const a = new THREE.Mesh(gDot, matPos), c = new THREE.Mesh(gDot, matNeg); G.add(a); G.add(c); const lk = [0, 1, 2].map(() => { const d = new THREE.Mesh(gDot, matLk); G.add(d); return d; }); return { a, c, lk }; }));
        const D = ctx.mesh(gSub, matS); D.visible = false; O.dock.push(D);
        const P = ctx.mesh(gBall, matP); P.visible = false; O.prod.push(P);
        O.q.push([0, 1].map(() => ctx.mesh(gSub, matS)));
      }
      for (let j = 0; j < NC; j++) { const o = ctx.mesh(gSub, matS, CELL[j]); o.userData.r = [(rnd(j, 4) - 0.5) * 0.8, (rnd(j, 5) - 0.5) * 1.2, (rnd(j, 6) - 0.5) * 0.9]; O.cloud.push(o); }
      // مقياس المعدل (عنصر صفحة فوق المشهد)
      const st = document.getElementById('stage');
      if (st) {
        const css = document.createElement('style');
        css.textContent = '#efG{position:absolute;left:26px;top:74px;width:430px;background:rgba(255,255,255,.96);border-radius:14px;padding:10px 16px 12px;box-shadow:0 4px 14px rgba(30,45,70,.16);border-top:6px solid #0A7A3D;direction:rtl;pointer-events:none;transition:opacity .3s}' +
          '#efG .gh{font-size:19px;font-weight:800;color:#0A4D2E;margin-bottom:6px}#efG .gh b{font-size:14px;color:#6b7785}' +
          '#efG .gb{position:relative;height:22px;border-radius:11px;background:#E7ECF2;overflow:visible;direction:ltr}#efG .gb i{position:absolute;left:0;top:0;bottom:0;border-radius:11px;background:linear-gradient(90deg,#E8B923,#D9641E)}' +
          '#efG .gb u{position:absolute;left:95.2%;top:-7px;bottom:-7px;border-left:3px dashed #1F2937}#efG .gb em{position:absolute;left:-58px;top:-2px;font-style:normal;font-size:15px;font-weight:800;color:#1F2937;background:#fff;padding:0 3px}' +
          '#efG .gt{font-size:17px;font-weight:800;color:#C8102E;margin:5px 0 4px;min-height:24px}' +
          '#efG .gc{display:flex;flex-wrap:wrap;gap:6px}#efG .gc span{font-size:14.5px;font-weight:700;color:#51606f;background:#F1F4F8;border-radius:9px;padding:3px 9px}' +
          '#efG .gc span.on{background:#C8102E;color:#fff}#efG .ltr{direction:ltr;unicode-bidi:isolate}' +
          'body.phone #efG{top:auto;bottom:16px;left:16px;transform:scale(1.25);transform-origin:bottom left}';
        document.head.appendChild(css);
        GA = document.createElement('div'); GA.id = 'efG'; st.appendChild(GA);
      }
    },
    rebuild(s, ctx) { S = s; C = ctx; },
    place(s) {
      S = s;
      if (!live) staticPose();
      const pb = phB();
      for (let e = 0; e < 6; e++) {
        const G = O.enz[e], pr = pres(e) * sm(S.sw), h = heat(e);
        G.visible = pr > 0.002; G.scale.setScalar(Math.max(0.001, SC * sm(pr))); G.position.y = EY - (1 - sm(pr)) * 0.4;
        if (!G.visible) continue;
        O.body[e].geometry = enzGeom(e, h, pb); O.chain[e].geometry = chainGeom(e, h, pb);
        HBS.forEach(([xa, xb, y], r) => {
          const br = cl((h - HTH[r]) / 0.14), [ax, ay] = warp(xa, y, e, h, pb), [bx, by] = warp(xb, y, e, h, pb);
          O.hb[e][r].forEach((d, j) => { const u = [0.25, 0.5, 0.75][j], u2 = u + (u < 0.5 ? -0.2 : u > 0.5 ? 0.2 : 0) * br;
            d.position.set(ax + (bx - ax) * u2, ay + (by - ay) * u2 + 0.1 * br * (j - 1), FZ + 0.06); d.scale.setScalar(Math.max(0.001, 0.05 * (1 - br * (j === 1 ? 1 : 0.85)))); });
        });
        IBS.forEach(([xa, xb, y], r) => {
          const I = O.ion[e][r], br = sm((pb - 0.2) / 0.5), [ax, ay] = warp(xa, y, e, h, pb), [bx, by] = warp(xb, y, e, h, pb), dx = (bx - ax), dy = (by - ay);
          I.a.position.set(ax - dx * 0.25 * br, ay - dy * 0.25 * br + 0.12 * br, FZ + 0.08); I.c.position.set(bx + dx * 0.25 * br, by + dy * 0.25 * br - 0.12 * br, FZ + 0.08);
          I.a.scale.setScalar(0.085); I.c.scale.setScalar(0.085);
          I.lk.forEach((d, j) => { const u = 0.3 + 0.2 * j; d.position.set(ax + dx * u, ay + dy * u, FZ + 0.07); d.scale.setScalar(Math.max(0.001, 0.035 * (1 - br))); });
        });
      }
      // السحابة الحرَّة
      O.cloud.forEach((o, j) => {
        const v = cl(S.ns - CRANK[j]); o.visible = v > 0.002;
        if (!o.visible) return;
        const k = j * 1.3, A = 0.45;
        o.position.copy(CELL[j]).add(V(A * Math.sin(TAU * 1.1 + 2 * k), 0.6 * A * Math.sin(TAU * 1.3 + 3 * k), 0.5 * A * Math.cos(TAU * 0.9 + k)));
        const r = o.userData.r; o.rotation.set(r[0] + 0.3 * Math.sin(TAU * 0.7 + k), r[1] + 0.4 * Math.sin(TAU * 0.5 + k), r[2] + 0.3 * Math.cos(TAU * 0.6 + k));
        o.scale.setScalar(Math.max(0.001, 0.7 * SC * v));
      });
      for (let e = 0; e < 6; e++) {
        placeCycle(e);
        const qv = sm(S.q) * pres(e) * sm(S.sw);
        O.q[e].forEach((o, j) => { if (o.userData.ov) { o.userData.ov = false; return; } o.visible = qv > 0.01; if (!o.visible) return; o.position.copy(queueW(e, j)).add(V(0, 0.08 * Math.sin(TAU * 1.6 + e + 2 * j), 0)); o.rotation.set(0, 0, (j ? -1 : 1) * 0.22); o.scale.setScalar(0.75 * SC * qv); });
      }
      gauge();
    },
    idle(t, s, ctx, tweening) {
      S = s;
      if (lastT === null || !live) { staticPose(); live = true; lastT = t; }
      const dt = Math.min(0.1, Math.max(0, t - lastT)); lastT = t;
      const k = kin(S.T); TAU += dt * k * 0.9;
      for (let e = 0; e < 6; e++) {
        const st = ST[e];
        if (pres(e) < 0.5 || S.sw < 0.5) { st.m = 'w'; st.pos = 0; st.Lw = 0.4 * rnd(e, 7); continue; }
        const f = fit(e);
        if (st.m === 'a' && !st.b && f < 0.15 && st.pos < 0.62) { st.b = true; st.pos = Math.max(st.pos, 0.58); }   // تغيَّر شكل الموقع النشط أثناء الدورة
        st.pos += dt * 0.42 * k * (st.b ? 0.8 : Math.max(0.2, f));
        if (st.m === 'w') { if (st.pos >= st.Lw) { st.pos -= st.Lw; st.m = 'a'; st.b = f < 0.15; } }
        else if (st.pos >= 1) { st.m = 'w'; st.pos = 0; st.Lw = Lw(S.ns) * (0.5 + Math.random()); st.side ^= 1; }
      }
      this.place(s);
    },
  };
})();
