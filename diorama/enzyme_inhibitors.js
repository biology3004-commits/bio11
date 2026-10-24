/* ديوراما: مثبِّطات الإنزيم — التثبيط التنافسي وغير التنافسي وتثبيط الناتج النهائي — الدرس ٣-٦ (كتاب الطالب أحياء ١١ ف١ ص ١١٥–١١٧، الشكلان ٣-١٣ و٣-١٤) */
(function () {
  const { V, sm, M, CSS } = DioramaCore;
  const { BLU, RED, GLD, TEAL, PNK, GRY, GRN, ORG, PUR } = CSS;
  const L = s => `<span class="ltr">${s}</span>`;
  const cl = x => Math.min(1, Math.max(0, x));
  const arc = (a, b, u, h) => a.clone().lerp(b, u).add(V(0, h * Math.sin(Math.PI * u), 0));
  const rnd = (i, k) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
  // ── أبعاد المشهد: ثلاثة جزيئات إنزيم في صفٍّ (الشكل ٣-١٣ مجسَّماً) ─────────────
  const EX = [-4.6, 0, 4.6], EY = 1.6, T = 1.25, AW = 0.62, DP = 0.85, DZ = 1.3, ALY = -0.15, AR = 0.36;
  const site = e => V(EX[e], EY + T, 0);                     // فم الموقع النشط
  const tipB = e => V(EX[e], EY + T - DP + 0.03, 0);         // رأس المادة المتفاعلة حين ترتبط بالموقع النشط
  const ballB = e => V(EX[e], EY + T - DP + 0.58, 0);        // ناتج كروي داخل الموقع النشط (في السلسلة)
  const allo = e => V(EX[e] + 1.6 - 0.04, EY + ALY, 0);      // الجزء الآخر من الإنزيم (غير الموقع النشط) — في الجانب المواجه للكاميرا
  const body = e => V(EX[e] + 0.55, EY - 0.5, DZ / 2 + 0.1);
  const traySlot = (e, n) => V(EX[e] + (n - 1) * 0.72, 0.08, 2.55);
  // ── سحابة الجزيئات الحرَّة خلف الإنزيمات: خلايا متداخلة لا تتصادم ───────────────
  // 33 خليَّة (11 عموداً × 3 صفوف)، تُوزَّع بتبديل ثابت: 16 للمادة المتفاعلة و16 للمثبِّط
  const cell = k => { const c = k % 11, r = Math.floor(k / 11); return V(-6.5 + c * 1.3 + 0.3 * (rnd(k, 1) - 0.5) + (r % 2) * 0.45, 3.0 + r * 0.65 + 0.2 * rnd(k, 2), -2.0 - r * 0.65 - 0.3 * rnd(k, 3)); };
  const PERM = Array.from({ length: 33 }, (_, k) => (k * 13) % 33);
  const CS = Array.from({ length: 16 }, (_, i) => cell(PERM[i]));          // المادة المتفاعلة
  const CI = Array.from({ length: 16 }, (_, i) => cell(PERM[16 + i]));     // المثبِّط (التنافسي ثم غير التنافسي)
  // ── السلسلة (الشكل ٣-١٤): إنزيم 1 = يمين (e2)، إنزيم 2 = وسط (e1)، إنزيم 3 = يسار (e0) ──
  const SRC = j => V(7.6 + 1.1 * (j % 2), 2.5, -3.5 + 1.1 * Math.floor(j / 2));
  const POOL = j => V(-8.0 + 0.98 * (j % 2), 0.08, -2.7 + 1.05 * Math.floor(j / 2));
  const DASH = u => arc(V(-7.5, 0.9, -1.6), allo(2).add(V(0.4, 0.25, 0)), u, 3.8);
  // ── موادُّ (ألوان الشكل ٣-١٣) ─────────────────────────────────────
  const matE = M(0x3E74C7, { roughness: 0.45 }), matS = M(0xF39A4C, { roughness: 0.5 }), matCI = M(0x8DB547, { roughness: 0.5 }), matNC = M(0xC0392B, { roughness: 0.4 });
  const matP = M(0xE8B923, { roughness: 0.35 }), matP2 = M(0x8E5BD9, { roughness: 0.4 }), matP3 = M(0xD63384, { roughness: 0.4 }), matTray = M(0xDCE3EA, { roughness: 0.7 }), matDash = M(0x44546A);
  let S, C;
  const O = {};
  // ── الأشكال ───────────────────────────────────────────────────────
  // الإنزيم: كتلة مستديرة في أعلاها الموقع النشط (شقٌّ على هيئة V) وفي جانبها الأيمن موضع آخر مقعَّر؛ d = تغيُّر شكل الموقع النشط (0..1)
  function enzShape(d) {
    const aw = AW * (1 - 0.55 * d), dp = DP * (1 - 0.35 * d), tx = 0.3 * d, lip = 0.22 * d, s = new THREE.Shape();
    s.moveTo(aw + 0.1 * d, T + lip); s.lineTo(1.0, T); s.quadraticCurveTo(1.6, T, 1.6, 0.6); s.lineTo(1.6, ALY + AR); s.absarc(1.6, ALY, AR, Math.PI / 2, 3 * Math.PI / 2, false); s.lineTo(1.6, -0.6);
    s.quadraticCurveTo(1.6, -1.25, 1.0, -1.25); s.lineTo(-1.0, -1.25); s.quadraticCurveTo(-1.6, -1.25, -1.6, -0.6);
    s.lineTo(-1.6, 0.6); s.quadraticCurveTo(-1.6, T, -1.0, T); s.lineTo(-aw + 0.1 * d, T + lip); s.lineTo(tx, T - dp); s.lineTo(aw + 0.1 * d, T + lip);
    return s;
  }
  const EXT = (depth) => ({ depth, bevelEnabled: true, bevelThickness: 0.09, bevelSize: 0.07, bevelSegments: 2, curveSegments: 14 });
  const ENZ = new Map();
  const enzGeom = d => { const k = Math.round(d * 30); if (!ENZ.has(k)) { const g = new THREE.ExtrudeGeometry(enzShape(k / 30), EXT(DZ)); g.translate(0, 0, -DZ / 2); ENZ.set(k, g); } return ENZ.get(k); };
  // المادة المتفاعلة: رأس على هيئة V يطابق الموقع النشط وفوقه كتلة أعرض (الرأس عند نقطة الأصل)
  const subShape = () => { const s = new THREE.Shape(); s.moveTo(0, 0); s.lineTo(AW, DP); s.lineTo(0.95, DP); s.lineTo(0.95, DP + 0.6); s.lineTo(-0.95, DP + 0.6); s.lineTo(-0.95, DP); s.lineTo(-AW, DP); s.lineTo(0, 0); return s; };
  // المثبِّط التنافسي: الرأس نفسه (شكل شبيه بالمادة المتفاعلة) وفوقه قبَّة
  const ciShape = () => { const s = new THREE.Shape(); s.moveTo(0, 0); s.lineTo(AW, DP); s.lineTo(0.78, DP); s.absarc(0, DP, 0.78, 0, Math.PI, false); s.lineTo(-AW, DP); s.lineTo(0, 0); return s; };
  let gSub, gCI, gBall;
  function put(g, m, p, s, rz) { const o = new THREE.Mesh(g, m); o.position.copy(p); o.scale.setScalar(Math.max(0.001, s)); if (rz) o.rotation.z = rz; o.castShadow = true; C.dyn.add(o); return o; }
  const ell = (m, p, s) => { const o = put(gBall, m, p, 1); o.scale.set(0.44 * s + 0.001, 0.36 * s + 0.001, 0.55 * s + 0.001); return o; };
  // ── الأحداث: لكل مرحلة (مفتاح في الحالة يعدُّ الدورات) قائمة [الإنزيم، الإزاحة، عدد الدورات، تفاعل r | محاولة فاشلة b] ──
  const EV = {
    a: [[1, 0, 3, 'r'], [0, 0.5, 3, 'r'], [2, 0.25, 3, 'r']],     // بلا مثبِّط
    b: [[1, 0, 3, 'r'], [0, 0.4, 1, 'b'], [2, 1.6, 1, 'b']],       // مثبِّط تنافسي، مادة متفاعلة قليلة
    c: [[1, 0, 3, 'r'], [0, 0.3, 3, 'r'], [2, 1.3, 2, 'r']],       // مثبِّط تنافسي + مادة متفاعلة أكثر
    e: [[1, 0, 3, 'r'], [0, 0.5, 1, 'b'], [2, 1.2, 1, 'b']],       // مثبِّط غير تنافسي
    f: [[1, 0, 3, 'r'], [0, 0.2, 2, 'b'], [2, 0.6, 2, 'b']],       // مثبِّط غير تنافسي + مادة متفاعلة أكثر
  };
  const CLR = { a: 'ci', b: 'c', c: 'x', e: 'f', f: 'nr' };       // المفتاح الذي يُفرِغ أطباق نواتج المرحلة
  const ROWS = [['a', 'بلا مثبّط'], ['b', 'مثبّط تنافسي'], ['c', 'مثبّط تنافسي + مادة متفاعلة أكثر'], ['e', 'مثبّط غير تنافسي'], ['f', 'مثبّط غير تنافسي + مادة متفاعلة أكثر']];
  const made = k => EV[k].reduce((s, [e, o, n, kind]) => s + (kind === 'r' ? Math.max(0, Math.min(n, Math.floor((S[k] || 0) - o - 0.6 + 1e-6) + 1)) : 0), 0);
  // ── الإشغال والتشوُّه ─────────────────────────────────────────────
  const occ = e => { const rel = e === 0 ? 1 - sm(S.c / 0.25) : e === 2 ? 1 - sm((S.c - 0.8) / 0.45) : 0; return cl(sm(S.ci) * rel + sm(S.x)) * (1 - sm(S.xo)); };
  const ncb = e => e === 1 ? 0 : cl(S.nb * 1.4 - (e === 2 ? 0.4 : 0)) * (1 - sm(S.nr));
  const p3b = () => sm(S.fb) * (1 - sm(S.rl));
  const deform = e => Math.max(sm(ncb(e)), e === 2 ? p3b() : 0);
  const Q0 = e => V(EX[e] - 1.1, 4.4, -2.2);                 // من أين يأتي المثبِّط التنافسي
  const N0 = e => V(EX[e] + 2.9, EY + 2.4, -1.6);            // من أين يأتي المثبِّط غير التنافسي
  // ── رموز الحركة لكل دورة ─────────────────────────────────────────
  function events(k) {
    const v = S[k] || 0; if (v <= 0) return;
    for (const [e, o, n, kind] of EV[k]) {
      const t = v - o; if (t <= 1e-6 || t >= n - 1e-6) continue;
      const c = Math.floor(t), u = t - c, side = (c + e) % 2 ? 0.9 : -0.9, P0 = V(EX[e] + side, 4.2, -2.0);
      if (kind === 'r') {
        if (u < 0.62) { const w = sm(u / 0.38); put(gSub, matS, P0.clone().lerp(tipB(e), w), u < 0.55 ? 1 : 1 - sm((u - 0.55) / 0.07), (1 - w) * 0.5 * side); }
        if (u > 0.55) { const g = sm((u - 0.55) / 0.08), w = sm((u - 0.65) / 0.35); put(gBall, matP, arc(ballB(e), traySlot(e, c), w, 1.3), 0.3 * g); }
      } else {
        const hov = site(e).add(V(0, occ(e) > 0.5 ? 0.97 : 0.18, 0));
        let p, sc = 1;
        if (u < 0.4) p = P0.clone().lerp(hov, sm(u / 0.4));
        else if (u < 0.62) p = hov.clone().add(V(0.13 * Math.sin((u - 0.4) * 57), 0.06 * Math.abs(Math.sin((u - 0.4) * 40)), 0));
        else { p = hov.clone().lerp(P0, sm((u - 0.62) / 0.38)); sc = 1 - sm((u - 0.86) / 0.14); }
        put(gSub, matS, p, sc, 0);
      }
    }
  }
  function trays(k) {
    const v = S[k] || 0; if (v <= 0) return;
    const f = 1 - sm((S[CLR[k]] || 0) * 3); if (f < 0.02) return;
    for (const [e, o, n, kind] of EV[k]) if (kind === 'r') for (let c = 0; c < n; c++) if (v - o >= c + 1 - 1e-6) put(gBall, matP, traySlot(e, c), 0.3 * f);
  }
  // ── السلسلة: موضع الجزيء j ونوعه ─────────────────────────────────
  function chainTok(j) {
    const tau = (S.g || 0) - 0.6 * j, sp = sm(S.sp);
    if (j >= 6 || tau <= 0) {
      if (j === 6 && S.h > 0) {                                // محاولة الارتباط بإنزيم 1 وهو مثبَّط
        const P0 = SRC(6), hov = site(2).add(V(0, 0.18, 0)), u = S.h; let p;
        if (u < 0.4) p = arc(P0, hov, sm(u / 0.4), 1.0); else if (u < 0.65) p = hov.clone().add(V(0.13 * Math.sin((u - 0.4) * 50), 0, 0)); else p = arc(hov, P0, sm((u - 0.65) / 0.35), 1.0);
        return { k: 'w', p, s: u < 0.4 ? 0.6 + 0.4 * sm(u / 0.4) : u < 0.65 ? 1 : 1 - 0.4 * sm((u - 0.65) / 0.35) };
      }
      return { k: 'w', p: SRC(j), s: 0.6 * sp };
    }
    if (tau < 0.5) return { k: 'w', p: arc(SRC(j), tipB(2), sm(tau / 0.5), 1.0), s: 0.6 + 0.4 * sm(tau / 0.5) };
    if (tau < 0.6) return { k: 'w', p: tipB(2), s: 1 };
    if (tau < 0.7) return { k: 'b1', p: ballB(2), s: 0.6 + 0.4 * sm((tau - 0.6) / 0.1) };
    if (tau < 1.2) return { k: 'b1', p: arc(ballB(2), ballB(1), sm((tau - 0.7) / 0.5), 1.6), s: 1 };
    if (tau < 1.3) return { k: 'b1', p: ballB(1), s: 1 };
    if (tau < 1.4) return { k: 'b2', p: ballB(1), s: 0.6 + 0.4 * sm((tau - 1.3) / 0.1) };
    if (tau < 1.9) return { k: 'b2', p: arc(ballB(1), ballB(0), sm((tau - 1.4) / 0.5), 1.6), s: 1 };
    if (tau < 2.0) return { k: 'b2', p: ballB(0), s: 1 };
    if (tau < 2.1) return { k: 'p3', p: ballB(0), s: 0.6 + 0.4 * sm((tau - 2.0) / 0.1) };
    if (tau < 2.6) return { k: 'p3', p: arc(ballB(0), POOL(j), sm((tau - 2.1) / 0.5), 1.4), s: 1 };
    if (j === 5 && S.fb > 0) {                                  // الناتج النهائي يعود فيرتبط بالجزء الآخر من إنزيم 1 ثم ينفصل
      const p = S.rl > 0 ? arc(allo(2), POOL(5), sm(S.rl), 3.4) : arc(POOL(5), allo(2), sm(S.fb), 3.4);
      return { k: 'p3', p, s: 1 };
    }
    return { k: 'p3', p: POOL(j), s: 1 };
  }
  const nP3 = () => { let n = 0; for (let j = 0; j < 6; j++) if ((S.g || 0) - 0.6 * j >= 2.05) n++; return n; };
  // ── العدَّاد (توضيحي) ────────────────────────────────────────────
  let CNT = null, lastH = '';
  function counter() {
    if (!CNT) return;
    let h;
    if ((S.cm || 0) < 0.5) {
      let cur = -1; ROWS.forEach(([k], i) => { if ((S[k] || 0) > 0.001) cur = i; });
      h = '<div class="ch">عدد النواتج المتكوِّنة <b>(توضيحي)</b></div>' + ROWS.map(([k, lab], i) => {
        const on = (S[k] || 0) > 0.001, v = on ? made(k) : 0;
        return `<div class="cr${i === cur ? ' cur' : ''}${on ? '' : ' off'}"><span class="cl">${lab}</span><span class="cn">${on ? v : '–'}</span><i style="width:${(v / 9 * 100).toFixed(1)}%"></i></div>`;
      }).join('');
    } else {
      const v = nP3();
      h = '<div class="ch">سلسلة التفاعلات <b>(توضيحي)</b></div>' +
          `<div class="cr cur"><span class="cl">الناتج 3 (الناتج النهائي)</span><span class="cn">${v}</span><i style="width:${(v / 6 * 100).toFixed(1)}%;background:#D63384"></i></div>`;
    }
    if (h !== lastH) { CNT.innerHTML = h; lastH = h; }
  }

  window.DIORAMA = {
    id: 'enzyme_inhibitors', title: 'مثبّطات الإنزيم', subtitle: 'الأحياء — الصف الحادي عشر — الوحدة الثالثة: الإنزيمات',
    source: 'النص من كتاب الطالب: ٣-٦ مثبّطات الإنزيم (ص ١١٥–١١٧) والشكلان ٣-١٣ و٣-١٤',
    legend: [['#3E74C7', 'الإنزيم'], ['#F39A4C', 'المادّة المتفاعلة'], ['#8DB547', 'مثبط تنافسي'], ['#C0392B', 'مثبط غير تنافسي', 'dot'], null,
             ['#E8B923', 'ناتج (الناتج 1)', 'dot'], ['#8E5BD9', 'الناتج 2', 'dot'], ['#D63384', 'الناتج 3 (الناتج النهائي)', 'dot']],
    camera: { VH: 15.4, center: [-4.4, 1.8, 0.9], elevation: 25, azimuth: 38 },
    base: { L: 18.6, W: 8.4, x: 0 },
    BASE: { fo: 0, cm: 0, ns: 6, ni: 0, nn: 0, ex: 0, a: 0, b: 0, c: 0, e: 0, f: 0, ci: 0, x: 0, xo: 0, nb: 0, nr: 0, sp: 0, g: 0, fb: 0, h: 0, rl: 0 },
    noGeom: ['fo', 'cm', 'ns', 'ni', 'nn', 'ex'],
    // نقطة التركيز: 0 المشهد، 1 الإنزيم الأوسط، 2 الإنزيم الأيسر، 3 الإنزيم الأيمن، 4 إنزيم 1 في السلسلة (جزؤه الآخر)
    focus(s) { S = s; const k = Math.round(S.fo || 0); if (!k) return V(-4.4, 1.8, 0.9);
      return [null, site(1), site(0).add(V(0.4, -0.2, 0)), site(2), V(EX[2] + 0.6, EY + 0.6, 0)][k].add(V(-1.7, -0.4, 1.3)); },   // الإزاحة تُبقي الهدف يمين لوحة النص
    STEPS: [
      { t: 'الإنزيم ومادته المتفاعلة: الموقع النشط شكلٌ متمِّم',
        p: 'لقد درست سابقًا أن للموقع النشط للإنزيم شكلًا متممًا مع مادته المتفاعلة.',
        n: 'للتوضيح: ثلاثة جزيئات إنزيم تحوّل المادة المتفاعلة إلى ناتج، والعدَّاد يحصي النواتج المتكوِّنة في المدَّة نفسها (أرقامه توضيحيَّة لا قياسيَّة). الأشكال رمزيَّة كما في الشكل ٣-١٣.',
        seq: [[{ '!fo': 1, zoom: 1.9 }, 900], [{ a: 1 }, 2000], [{ zoom: 1 }, 800], [{ a: 3.5 }, 2600]],
        pills: [['الإنزيم', BLU, () => body(1), 150, 40], ['الموقع النشط', RED, () => site(0), -40, -90], ['المادّة المتفاعلة', ORG, () => CS[1].clone(), 0, -60], ['ناتج', GLD, () => traySlot(2, 2), 90, 40]] },
      { t: 'المثبِّط التنافسي: شكل شبيه بالمادة المتفاعلة يدخل الموقع النشط',
        p: `لكن، قد يكون لجزيء ما شكل شبيه بالمادة المتفاعلة يدخل الموقع النشط للإنزيم، الأمر الذي يؤدي إلى تثبيط عمل الإنزيم. إذا ارتبط الجزيء المثبّط في الموقع النشط لمدّة وجيزة، فسيحدث تنافس بينه وبين المادة المتفاعلة على الموقع. لكن إذا ارتفع تركيز المادة المثبّطة أو انخفض تركيز المادة المتفاعلة، ينخفض احتمال ارتباط المادة المتفاعلة بموقع نشط فارغ، الأمر الذي يؤدي إلى تثبيط وظيفة الإنزيم، فيما يسمّى التثبيط التنافسي ${L('Competitive inhibition')} الشكل ٣-١٣أ.`,
        n: 'للتوضيح: المثبِّط (الأخضر) أكثر من المادة المتفاعلة، فيشغل الموقعين النشطين في جزيئَين من الثلاثة؛ والعدَّاد توضيحي.',
        seq: [[{ ni: 10, ns: 4 }, 1100], [{ '!fo': 2, zoom: 1.8 }, 700], [{ ci: 1 }, 1600], [{ zoom: 1 }, 700], [{ b: 3.4 }, 3000]],
        pills: [['مثبط تنافسي', GRN, () => tipB(0).add(V(0, 1.2, 0)), -150, -50], ['يرتبط المثبط التنافسي بالموقع النشط للإنزيم', GRN, () => tipB(2).add(V(0, 1.2, 0)), -60, -110],
                ['مانعًا/ معترضًا ارتباط المادة المتفاعلة به', GRN, () => site(2).add(V(0.4, 0.4, 0)), -40, -68], ['المادّة المتفاعلة', ORG, () => CS[1].clone(), 0, -60], ['ناتج', GLD, () => traySlot(1, 2), 80, 40]] },
      { t: 'زيادة تركيز المادة المتفاعلة تقلِّل أثر التثبيط التنافسي',
        p: 'وإذا كانت جزيئات المادة المتفاعلة أكثر من الجزيئات المثبّطة، فستفوز جزيئات المادة المتفاعلة بسهولة في التنافس، وبالتالي لن تتأثر وظيفة الإنزيم كثيرًا. … وهو عكسي أي قابل للعكس أحيانًا عبر زيادة تركيز المادة المتفاعلة.',
        n: 'التثبيط التنافسي: يخفض ارتفاع تركيز المادة المتفاعلة من درجة التثبيط، وبالمقابل يزيد ارتفاع تركيز الجزيئات المثبطة من درجة التثبيط. (مصطلحات علمية ص١١٥)',
        seq: [[{ ns: 16 }, 1300], [{ c: 3.3 }, 3600]],
        pills: [['المادّة المتفاعلة', ORG, () => CS[3].clone(), 0, -60], ['مثبط تنافسي', GRN, () => CI[6].clone(), 0, -60], ['ناتج', GLD, () => traySlot(0, 0), -90, 40]] },
      { t: 'مثال: الإيثانول مثبِّط تنافسي في علاج التسمُّم بإيثيلين جلايكول',
        p: `من الأمثلة على التثبيط التنافسي ما يحدث في علاج شخص شرب إيثيلين جلايكول ${L('Ethylene glycol')} عن طريق الخطأ. يُستخدم هذا المركّب كمضاد للتجمّد، وهو يتحوّل بسرعة في الجسم إلى حمض أوكساليك ${L('Oxalic acid')}، الذي يمكن أن يسبب تلفًا كلويًا مُستدامًا. إلّا أن الموقع النشط للإنزيم الذي يحوّل إيثيلين جلايكول إلى حمض أوكساليك يستقبل أيضًا الإيثانول. فإذا تمّ إعطاء الشخص المصاب بالتسمّم جرعة كبيرة من الإيثانول، يعمل الإيثانول كمثبّط تنافسي، يبطئ تأثير الإنزيم على إيثيلين جلايكول لمدة تكفي لإفراز إيثيلين جلايكول من الجسم.`,
        n: 'للتوضيح فقط: البرتقالي هنا = إيثيلين جلايكول، والأخضر = الإيثانول؛ الأشكال رمزيَّة لا تمثِّل تركيب الجزيئات الحقيقي.',
        seq: [[{ ni: 16 }, 1000], [{ x: 1 }, 1500], [{ ex: 1 }, 2200]],
        pills: [['الإيثانول', GRN, () => tipB(1).add(V(0, 1.2, 0)), 110, -60], ['الموقع النشط للإنزيم الذي يحوّل إيثيلين جلايكول إلى حمض أوكساليك', BLU, () => body(1), 40, 90],
                ['إفراز إيثيلين جلايكول من الجسم', ORG, () => V(-9.0, 4.0, -2.6), 110, -40]] },
      { t: 'المثبِّط غير التنافسي يرتبط بجزء آخر فيتغيَّر شكل الموقع النشط',
        p: 'التثبيط غير التنافسي هو نوع آخر من التثبيط القابل للعكس. في هذا النوع من التثبيط، يرتبط الجزيء المثبّط بجزء آخر من الإنزيم غير الموقع النشط. ويمكن أن يؤثر، بشكل خطر، على الترتيب الطبيعي للروابط الهيدروجينيّة والتفاعلات الكارهة للماء التي تحافظ على الشكل ثلاثي الأبعاد لجُزيء الإنزيم، ما يسبب تغييرًا في شكل الموقع النشط للإنزيم، فيثبّط بالتالي قدرة الإنزيم على استقبال المادة المتفاعلة داخل الموقع النشط.',
        n: 'للتوضيح: يرتبط المثبّط غير التنافسي بجزيئَين من الثلاثة ويبقى الأوسط دونه للمقارنة؛ والعدَّاد توضيحي.',
        seq: [[{ xo: 1, ni: 0, '!ns': 0, '!ex': 0, nn: 6 }, 1200], [{ ns: 4, '!fo': 2, zoom: 1.9 }, 800], [{ nb: 1 }, 1900], [{ zoom: 1 }, 700], [{ e: 3.2 }, 2800]],
        pills: [['مثبط غير تنافسي', RED, () => allo(0), -40, 110], ['التغير في شكل الموقع النشط', RED, () => site(0).add(V(0.1, 0.1, 0)), -10, -95],
                ['يرتبط المثبط غير التنافسي بجزء آخر من الإنزيم', RED, () => allo(2), -60, 130], ['الإنزيم', BLU, () => body(1), 120, 60]] },
      { t: 'زيادة تركيز المادة المتفاعلة لا تزيل أثر التثبيط غير التنافسي',
        p: `ومع ارتباط الجزيء المثبّط بالإنزيم تتوقف وظيفة الأخير. وهكذا، فإن جُزيء المادة المتفاعلة والجزيء المثبّط غير متنافسَين على الموقع النشط، فيما يُعدّ مثالًا على التثبيط غير التنافسي ${L('Non-competitive inhibition')} كما هو مبين في الشكل ٣-١٣ب، ولن يكون لزيادة تركيز المادة المتفاعلة أيّ تأثير على التثبيط، بخلاف التثبيط التنافسي.`,
        n: 'التثبيط غير التنافسي: عندما تُخفض الجزيئات المثبطة من معدل نشاط الإنزيم، لكن الزيادة في تركيز المادة المتفاعلة لا تخفض من درجة التثبيط. (مصطلحات علمية ص١١٦)',
        seq: [[{ ns: 16 }, 1200], [{ f: 3.4 }, 3400]],
        pills: [['التغير في شكل الموقع النشط', RED, () => site(2).add(V(0.1, 0.1, 0)), 0, -95], ['يعني بأنه لن يتمكن من الارتباط بالمادة المتفاعلة', RED, () => site(0).add(V(0.1, 0.1, 0)), 40, -95],
                ['المادّة المتفاعلة', ORG, () => CS[3].clone(), 0, -60], ['ناتج', GLD, () => traySlot(1, 2), 80, 40]] },
      { t: 'سلسلة تفاعلات أيض: إنزيم 1 ثم إنزيم 2 ثم إنزيم 3',
        p: 'يمكن أن يكون تثبيط الإنزيم ضارًا، أو حتى مميتًا، ولكن في كثير من الأحيان يكون التثبيط ضروريًا. على سبيل المثال، يجب التحكم بتفاعلات الأيض بحيث لا يتاح لأيّ إنزيم العمل من دون أن يتوقف عند نقطة ما، وإلّا فإن المزيد من النواتج ستتكوّن باستمرار.',
        n: 'للتوضيح: يُعاد ترتيب المشهد كسلسلة الشكل ٣-١٤ (المادة المتفاعلة ثم الناتج 1 ثم الناتج 2 ثم الناتج 3)؛ الأشكال والألوان رمزيَّة، والعدَّاد توضيحي.',
        seq: [[{ nr: 1, nn: 0, ns: 0, '!cm': 1 }, 1300], [{ sp: 1 }, 700], [{ g: 5.8 }, 5000]],
        pills: [['المادّة المتفاعلة', ORG, () => SRC(7), 0, -70], ['إنزيم 1', BLU, () => body(2), 60, 70], ['إنزيم 2', BLU, () => body(1), 60, 70], ['إنزيم 3', BLU, () => body(0), 60, 70],
                ['الناتج 3 (الناتج النهائي)', PNK, () => POOL(4), 60, -80]] },
      { t: 'تثبيط الناتج النهائي: الناتج 3 يثبِّط إنزيم 1 تثبيطاً قابلاً للعكس',
        p: 'يمثّل استخدام الناتج النهائي في سلسلة التفاعلات، كمثبّط غير تنافسي قابل للعكس، طريقة في التحكم بتفاعلات الأيض، كما هو مبين في الشكل ٣-١٤. ويثبّط الناتج النهائي الإنزيم في بداية سلسلة التفاعلات (الإنزيم 1 في الشكل ٣-١٤). ومع زيادة كمية الناتج النهائي يبدأ نشاط الإنزيم بالتباطؤ تدريجيًا؛ ولكن قد يفقد الناتج النهائي ارتباطه بالإنزيم (تفاعل عكسي)، ولذلك، إذا استخدم الإنزيم في مكان آخر فإنه يعود إلى حالته النشطة، ويكوّن المزيد من النواتج النهائيّة. تسمّى هذه الطريقة لتنظيم كمية الناتج النهائي المتكوّن، تثبيط الناتج النهائي.',
        n: 'للتوضيح: يرتبط جزيء واحد من الناتج 3 بإنزيم 1 فيتغيَّر شكل موقعه النشط وتُرَدُّ المادة المتفاعلة، ثمَّ ينفصل فيعود الإنزيم نشطاً. وهو مثال على آليّة التغذية الراجعة (الشكل ٣-١٤).',
        seq: [[{ fb: 1 }, 1800], [{ '!fo': 4, zoom: 2.1 }, 800], [{ h: 1 }, 1900], [{ zoom: 1 }, 800], [{ rl: 1 }, 1500]],
        pills: [['التثبيط', GRY, () => DASH(0.5), 0, -45], ['إنزيم 1', BLU, () => body(2), 60, 70], ['يعود إلى حالته النشطة', GRN, () => site(2).add(V(0.1, 0.1, 0)), 40, -95],
                ['تفاعل عكسي', PNK, () => POOL(5), 70, -70]] },
    ],
    setup(ctx) {
      C = ctx;
      gSub = new THREE.ExtrudeGeometry(subShape(), EXT(0.95)); gSub.translate(0, 0, -0.475);
      gCI = new THREE.ExtrudeGeometry(ciShape(), EXT(0.95)); gCI.translate(0, 0, -0.475);
      gBall = new THREE.SphereGeometry(1, 24, 16);
      for (let e = 0; e < 3; e++) { const tr = ctx.mesh(new THREE.CylinderGeometry(1.35, 1.25, 0.12, 36), matTray, V(EX[e], -0.24, 2.55)); tr.castShadow = false; }
      // سحابة الجزيئات الحرَّة (كائنات دائمة تُضبط في place)
      const mk = (g, m, p, i) => { const o = ctx.mesh(g, m, p); o.rotation.set(0, (rnd(i, 3) - 0.5) * 0.9, (rnd(i, 4) - 0.5) * 0.8); o.userData.base = p.clone(); return o; };
      O.cs = CS.map((p, i) => mk(gSub, matS, p, i)); O.ci = CI.map((p, i) => mk(gCI, matCI, p, i + 20));
      O.nc = CI.slice(0, 6).map((p, i) => { const o = ctx.mesh(gBall, matNC, p); o.userData.base = p.clone(); return o; });
      // العدَّاد (عنصر صفحة فوق المشهد)
      const st = document.getElementById('stage');
      if (st) {
        const css = document.createElement('style');
        css.textContent = '#eiCnt{position:absolute;left:26px;top:74px;width:380px;background:rgba(255,255,255,.96);border-radius:14px;padding:10px 16px 12px;box-shadow:0 4px 14px rgba(30,45,70,.16);border-top:6px solid #0A7A3D;direction:rtl;pointer-events:none}' +
          '#eiCnt .ch{font-size:18px;font-weight:800;color:#0A4D2E;margin-bottom:4px}#eiCnt .ch b{font-size:14px;color:#6b7785}' +
          '#eiCnt .cr{position:relative;display:flex;justify-content:space-between;align-items:center;font-size:16px;font-weight:700;color:#1F2937;padding:3px 0 7px}' +
          '#eiCnt .cr.off{opacity:.38}#eiCnt .cr.cur .cl{color:#C8102E}#eiCnt .cn{font-size:22px;font-weight:800;color:#1F2937;min-width:26px;text-align:left}' +
          '#eiCnt .cr i{position:absolute;right:0;bottom:2px;height:5px;border-radius:3px;background:#E8B923}' +
          'body.phone #eiCnt{top:auto;bottom:16px;left:16px;transform:scale(1.25);transform-origin:bottom left}';
        document.head.appendChild(css);
        CNT = document.createElement('div'); CNT.id = 'eiCnt'; st.appendChild(CNT);
      }
    },
    rebuild(s, ctx) {
      S = s; C = ctx;
      for (let e = 0; e < 3; e++) { const o = new THREE.Mesh(enzGeom(deform(e)), matE); o.position.set(EX[e], EY, 0); o.castShadow = o.receiveShadow = true; ctx.dyn.add(o); }
      // المثبِّط التنافسي في الموقع النشط
      for (let e = 0; e < 3; e++) { const w = occ(e); if (w > 0.005) put(gCI, matCI, Q0(e).lerp(tipB(e), w), 0.7 + 0.3 * w, (1 - w) * 0.6); }
      // المثبِّط غير التنافسي في الجزء الآخر
      for (const e of [0, 2]) { const b = cl(S.nb * 1.4 - (e === 2 ? 0.4 : 0)); if (b > 0.005) { const r = sm(S.nr); const p = r > 0 ? allo(e).lerp(N0(e).add(V(0, 1.5, -1)), r) : N0(e).lerp(allo(e), sm(b)); ell(matNC, p, 1 - sm((S.nr - 0.6) / 0.4)); } }
      for (const k of ['a', 'b', 'c', 'e', 'f']) { events(k); trays(k); }
      // السلسلة
      if (S.sp > 0.001) {
        for (let j = 0; j < 8; j++) { const t = chainTok(j); if (t.s < 0.005) continue; if (t.k === 'w') put(gSub, matS, t.p, t.s); else if (t.k === 'p3') ell(matP3, t.p, t.s); else put(gBall, t.k === 'b1' ? matP : matP2, t.p, 0.3 * t.s); }
      }
      // خطُّ «التثبيط» المتقطِّع من الناتج النهائي إلى إنزيم 1 (كما في الشكل ٣-١٤)
      const dv = sm(S.fb * 2); if (dv > 0.01) for (let k = 0; k < 20; k++) { const u0 = k / 20, u1 = (k + 0.55) / 20; if (u1 > dv) break; ctx.rod(DASH(u0), DASH(u1), 0.05, matDash); }
    },
    place(s) {
      S = s;
      O.cs.forEach((o, i) => { const v = cl(S.ns - i), xe = sm(cl(S.ex * 1.6 - (15 - i) * 0.04)); const p = o.userData.base.clone(); p.x += (-10.2 - p.x) * xe; o.position.copy(p); o.userData.cur = p; o.scale.setScalar(Math.max(0.001, 0.68 * v * (1 - sm((xe - 0.7) / 0.3)))); o.visible = v > 0.002; });
      O.ci.forEach((o, i) => { const v = cl(S.ni - i); o.position.copy(o.userData.base); o.userData.cur = o.userData.base; o.scale.setScalar(Math.max(0.001, 0.68 * v)); o.visible = v > 0.002; });
      O.nc.forEach((o, i) => { const v = cl(S.nn - i); o.position.copy(o.userData.base); o.userData.cur = o.userData.base; o.scale.set(0.44 * v + 0.001, 0.36 * v + 0.001, 0.55 * v + 0.001); o.visible = v > 0.002; });
      counter();
    },
    idle(t, s, ctx, tweening) {
      if (tweening) return;
      const bob = (o, i) => { if (o.visible && o.userData.cur) o.position.set(o.userData.cur.x, o.userData.cur.y + 0.1 * Math.sin(t * 1.3 + i * 1.7), o.userData.cur.z); };
      O.cs.forEach(bob); O.ci.forEach((o, i) => bob(o, i + 5)); O.nc.forEach((o, i) => bob(o, i + 9));
    },
  };
})();
