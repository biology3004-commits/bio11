/* ديوراما: من الحمض الأميني إلى البروتين — مستويات تركيب البروتين — الدرس ٢-٤ (كتاب الطالب ص ٨٠–٨٥) */
(function () {
  const { V, sm, M, CSS } = DioramaCore;
  const { BLU, RED, GLD, TEAL, PNK, GRY, GRN, ORG, PUR } = CSS;
  const L = s => `<span class="ltr">${s}</span>`;
  const cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  // ── السلسلة: 26 حمضاً أمينيّاً (تبسيط؛ الكتاب: عدة مئات) ─────────────────────────────
  // ألفا اللولبي 0–10، وصلة 11–13، شريط بيتا (أ) 14–18، منعطف 19–20، شريط بيتا (ب) 21–25
  const NRES = 26, HX1 = 10, LP0 = 11, SA0 = 14, SA1 = 18, TN0 = 19, TN1 = 20, SB0 = 21, SB1 = 25;
  // أنواع المجموعات R: h غير قطبيّة (كارهة للماء)، p قطبيّة، + متأيّنة موجبة، - متأيّنة سالبة، c سيستين
  const TYPE = '+ph+ppchppp' + 'php' + 'h-cph' + 'pp' + 'hp-pp';
  const RCOL = { h: 0xF08C2E, p: 0xB39DDB, '+': 0xC2327A, '-': 0x12A5A0, c: 0xF2C94C };
  // أزواج روابط التركيب الثالثي (تُضبط بعد حساب المواضع): [i, j]
  const SS = [6, 16], ION = [3, 23], HBR = [10, 25];   // ثنائي الكبريتيد (سيستين–سيستين)، أيونيّة (+ / −)، هيدروجينيّة بين مجموعتَي R قطبيّتَين
  // ── المواد ────────────────────────────────────────────────────────────────
  const matCa = M(0x374151), matN = M(0x2FA866), matC = M(0x2C7BE5), matO = M(0xE4472E), matH = M(0xF5F5F5, { roughness: 0.35 });
  const matBond = M(0x1F2937), matPep = M(0x111827), matSS = M(0xF2C94C, { roughness: 0.3 }), matIon = M(0xC2327A), matIon2 = M(0x12A5A0), matHb = M(0xffffff, { roughness: 0.3 });
  const matR = {}; for (const k in RCOL) matR[k] = M(RCOL[k], { roughness: 0.4 });
  const matCh2 = M(0xB07AA1, { roughness: 0.45 });
  let S, FR = null, hydroBlob;
  // ── التركيب الممتدُّ (الأوّلي): موجة على اللوح، تباعد 1.0 على طول المنحنى ────────────────
  const E = [];
  (function () {
    const x0 = -9.8, zf = x => 1.2 * Math.cos(2 * Math.PI * (x - x0) / 8.5), dz = x => -1.2 * Math.sin(2 * Math.PI * (x - x0) / 8.5) * 2 * Math.PI / 8.5;
    let x = x0, acc = 0, next = 0;
    while (E.length < NRES) {
      if (acc >= next - 1e-9) { const T = V(1, 0, dz(x)).normalize(); E.push({ B: V(x, 1.0, zf(x)), U: V(0, 1, 0), A: V(0, 0, 1).cross(T).negate().normalize() }); next += 1.0; }
      const h = 0.002; acc += Math.hypot(h, zf(x + h) - zf(x)); x += h;
    }
  })();
  // ── التركيب الثانوي والثالثي ─────────────────────────────────────────────
  const HX = { x0: -8.5, rise: 0.45, r: 0.62, yc: 1.55, zc: -0.3 }, PV = V(-6.25, 1.55, -0.3), DEL = V(8.2, 1.45, 0.3);   // محور الحلزون في (S) ومركزه وإزاحته في (T)
  const BULGE_S = V(0, 0.35, -0.5), BULGE_T = V(-1.35, 0.25, 0.35);
  const pleat = k => 1.0 + 0.12 * (k % 2 ? -1 : 1);
  function helixS(i) { const th = -Math.PI / 2 + i * 100 * Math.PI / 180; return { B: V(HX.x0 + HX.rise * i, HX.yc + HX.r * Math.cos(th), HX.zc + HX.r * Math.sin(th)), U: V(0, Math.cos(th), Math.sin(th)), A: V(1, 0, 0) }; }
  function sheetS(i) {
    if (i <= SA1) { const k = i - SA0; return { B: V(k, pleat(k), -0.7), U: V(0, k % 2 ? -1 : 1, 0), A: V(0, 0, k % 2 ? -1 : 1) }; }
    if (i <= TN1) return { B: V(4.9, 1.05, i === TN0 ? -0.35 : 0.35), U: V(0, 1, 0), A: V(1, 0, 0) };
    const k = SB1 - i; return { B: V(k, pleat(k), 0.7), U: V(0, k % 2 ? -1 : 1, 0), A: V(0, 0, k % 2 ? -1 : 1) };
  }
  // الشكل الثانوي عند تقدُّم الطيِّ الثالثي tau: الحلزون يدور حول y ويُزاح فوق الصفيحة، والوصلة تُعاد قوساً، والصفيحة ثابتة
  function conf(i, tau) {
    const ang = Math.PI * tau, ca = Math.cos(ang), sa = Math.sin(ang);
    const rotP = p => V(PV.x + (p.x - PV.x) * ca + (p.z - PV.z) * sa, p.y, PV.z - (p.x - PV.x) * sa + (p.z - PV.z) * ca).addScaledVector(DEL, tau);
    const rotV = v => V(v.x * ca + v.z * sa, v.y, -v.x * sa + v.z * ca);
    if (i <= HX1) { const h = helixS(i); return { B: rotP(h.B), U: rotV(h.U), A: rotV(h.A) }; }
    if (i < SA0) {
      const a = rotP(helixS(HX1).B), b = sheetS(SA0).B, u = (i - HX1) / (SA0 - HX1);
      const bulge = BULGE_S.clone().lerp(BULGE_T, tau);
      return { B: a.clone().lerp(b, u).addScaledVector(bulge, Math.sin(Math.PI * u)), U: V(0, 1, 0), A: V(0, 0, 1) };
    }
    return sheetS(i);
  }
  const arrive = i => cl(S.n - i);                                      // تقدُّم وصول الحمض i (0..1)
  const OFF = V(1.3, 3.4, 2.4);                                          // اتجاه الدخول (من أعلى الأمام)
  // ── حساب إطارات الأحماض الأمينيّة من الحالة ─────────────────────────────────
  function frames(s) {
    S = s;
    const tau = sm(S.t), out = [];
    for (let i = 0; i < NRES; i++) {
      const prog = i < SA0 ? sm(cl((S.a * 17 - i) / 3)) : sm(cl((S.b * 15 - (i - SA0)) / 3));
      const c = conf(i, tau), e = E[i];
      out.push({ B: e.B.clone().lerp(c.B, prog), U: e.U.clone().lerp(c.U, prog).normalize(), A: e.A.clone().lerp(c.A, prog).normalize(), ar: arrive(i) });
    }
    // الوصلة 11–13 قوسٌ بين موضع نهاية الحلزون الحالي وموضع الحمض 14 الحالي (حتى لا تتمطَّط الروابط قبل تكوُّن الصفيحة)
    for (let i = LP0; i < SA0; i++) {
      const a = out[HX1].B, b = out[SA0].B, u = (i - HX1) / (SA0 - HX1), bulge = BULGE_S.clone().lerp(BULGE_T, tau);
      const arc = a.clone().lerp(b, u).addScaledVector(bulge, Math.sin(Math.PI * u));
      out[i].B = E[i].B.clone().lerp(arc, sm(cl((S.a * 17 - i) / 3)));
    }
    for (let i = 0; i < NRES; i++) {
      const f = out[i], p = out[Math.max(0, i - 1)].B, q = out[Math.min(NRES - 1, i + 1)].B;
      f.T = q.clone().sub(p).normalize();
      const W = f.T.clone().cross(f.U).normalize(); f.U = W.clone().cross(f.T).normalize();
    }
    // الحمض الثاني قبل تكوُّن الرابطة: مُزاح على طول السلسلة؛ والقادمون ينزلقون من نقطة الدخول
    out[1].B.addScaledVector(out[1].T, 0.9 * S.gap);
    for (let i = 0; i < NRES; i++) {
      const f = out[i]; f.B.addScaledVector(OFF, 1 - sm(f.ar)); f.k = Math.max(0.001, f.ar);
      f.N = f.B.clone().addScaledVector(f.T, -0.3); f.C = f.B.clone().addScaledVector(f.T, 0.3);
      f.R = f.B.clone().addScaledVector(f.U, 0.45); f.Ha = f.B.clone().addScaledVector(f.U, -0.27);
      f.O = f.C.clone().addScaledVector(f.A, 0.24); f.HN = f.N.clone().addScaledVector(f.A, -0.22);
      f.H2 = f.N.clone().addScaledVector(f.T, -0.24).addScaledVector(f.U, 0.08);                 // الهيدروجين الثاني لمجموعة الأمين الطرفيّة
      f.O2 = f.C.clone().addScaledVector(f.T, 0.27); f.HO = f.O2.clone().addScaledVector(f.T, 0.18);  // OH مجموعة الكربوكسيل الطرفيّة
    }
    FR = out; return out;
  }
  const lastIdx = () => Math.min(NRES - 1, Math.ceil(S.n - 1e-6) - 1);
  // جزيء الماء الناتج عن التكثيف: O و H من كربوكسيل الحمض الأوّل، و H من أمين الحمض الثاني
  function water() {
    const w = S.w; if (w <= 0 || w >= 2 || !FR) return null;
    const a = FR[0], b = FR[1], meet = a.C.clone().lerp(b.N, 0.5).add(V(0, 0.75, 0.4));
    const u1 = sm(cl(w / 0.5)), rise = sm(cl((w - 0.5) / 0.5)) * 0.9 + Math.max(0, w - 1) * 0.8, k = w > 1 ? Math.max(0.001, 2 - w) : 1;
    const Mo = meet.clone().add(V(0, rise, 0));
    return { k, O: a.O2.clone().lerp(Mo, u1), H1: a.HO.clone().lerp(Mo.clone().add(V(-0.17, 0.14, 0.08)), u1), H2: b.H2.clone().lerp(Mo.clone().add(V(0.17, 0.14, 0.08)), u1) };
  }
  const helixProg = i => sm(cl((S.a * 17 - i) / 3)), sheetProg = i => sm(cl((S.b * 15 - (i - SA0)) / 3));
  // روابط هيدروجينيّة: في الحلزون O(i)···H(i+4)؛ في الصفيحة بين الشريطَين المتقابلَين
  function hbonds() {
    const out = [];
    for (let i = 0; i + 4 <= HX1; i++) { const f = cl((Math.min(helixProg(i), helixProg(i + 4)) - 0.85) / 0.15); if (f > 0) out.push([FR[i].O, FR[i + 4].HN, f]); }
    for (let k = 0; k <= 4; k++) {
      const ia = SA0 + k, ib = SB1 - k, f = cl((Math.min(sheetProg(ia), sheetProg(ib)) - 0.85) / 0.15); if (f <= 0) continue;
      out.push(k % 2 ? [FR[ib].O, FR[ia].HN, f] : [FR[ia].O, FR[ib].HN, f]);
    }
    return out;
  }
  const dots = (a, b, r, mat, n = 4, f = 1) => { for (let q = 0; q < n; q++) ctx_.ball(a.clone().lerp(b, (q + 0.5) / n), r * f, mat); };
  let ctx_;
  // مسار السلسلة الثانية (التركيب الرابعي): نسخة مُدارة من الشكل الثالثي تدخل من الأمام
  const CC = V(2.0, 2.1, 0);
  function chain2() {
    const slide = (1 - sm(S.q)) * 7.5, pts = [];
    for (let i = 0; i < NRES; i++) { const p = conf(i, 1).B; pts.push(V(CC.x - (p.x - CC.x), p.y, CC.z - (p.z - CC.z) + 3.4 + slide)); }
    return pts;
  }
  const mid = (a, b) => a.clone().lerp(b, 0.5);

  window.DIORAMA = {
    id: 'protein_levels', title: 'من الحمض الأميني إلى البروتين: مستويات التركيب', subtitle: 'الأحياء — الصف الحادي عشر — الوحدة الثانية: الجُزيئات الحيويَّة',
    source: 'النص من كتاب الطالب: ٢-٤ البروتينات (ص ٨٠–٨٥) والأشكال ٢-١٤ إلى ٢-٢١',
    legend: [['#374151', 'ذرّة كربون مركزيّة', 'dot'], ['#2FA866', 'مجموعة أمين', 'dot'], ['#2C7BE5', 'مجموعة كربوكسيل', 'dot'], ['#E4472E', 'أكسجين', 'dot'], ['#F5F5F5;border:2px solid #9aa7b4', 'هيدروجين', 'dot'], null,
             ['#F08C2E', 'مجموعة R غير قطبيّة (كارهة للماء)', 'dot'], ['#B39DDB', 'مجموعة R قطبيّة', 'dot'], ['#C2327A', 'مجموعة R متأيّنة (+)', 'dot'], ['#12A5A0', 'مجموعة R متأيّنة (−)', 'dot'], ['#F2C94C', 'مجموعة R للسيستين (كبريت)', 'dot'], null,
             ['#fff;border:2px solid #9aa7b4', 'رابطة هيدروجينيّة', 'dot'], ['#F2C94C', 'رابطة ثنائي الكبريتيد', 'tube'], ['#B07AA1', 'سلسلة عديد ببتيد ثانية', 'tube']],
    camera: { VH: 22.5, center: [-0.6, 1.4, 0] },
    base: { L: 21.5, W: 11.5, x: -0.6 },
    BASE: { fo: 1, zoom: 3.4, n: 0, gap: 1, w: 0, bond: 0, a: 0, b: 0, t: 0, bs: 0, q: 0 },
    noGeom: ['fo'],
    // نقطة التركيز: 0 المشهد، 1 الحمض الأوّل، 2 الرابطة الببتيديّة الأولى، 3 طرف السلسلة النامية، 4 الحلزون، 5 الصفيحة، 6 البروتين المطوي، 7 رابطة ثنائي الكبريتيد، 8 السلسلتان
    focus(s) {
      S = s; const k = Math.round(S.fo || 0); if (!FR) frames(S);
      if (k === 1) return FR[0].B.clone().add(V(0.1, 0.1, 0));
      if (k === 2) return mid(FR[0].C, FR[1].N);
      if (k === 3) { const u = cl(S.n - 1, 0, NRES - 1), i = Math.floor(u); return FR[i].B.clone().lerp(FR[Math.min(NRES - 1, i + 1)].B, u - i).add(V(0, 0.3, 0)); }
      if (k === 4) return V(HX.x0 + 2.25, HX.yc, HX.zc);
      if (k === 5) return V(2.45, 1.1, 0);
      if (k === 6) return V(1.9, 2.0, 0);
      if (k === 7) return mid(FR[SS[0]].R, FR[SS[1]].R);
      if (k === 8) return V(2.0, 2.0, 1.7);
      return V(-0.6, 1.4, 0);
    },
    STEPS: [
      { t: 'التركيب العام للحمض الأميني',
        p: `لجميع الأحماض الأمينيّة ذرّة كربون مركزيّة ترتبط بمجموعة أمين ${L('–NH<sub>2</sub>')} ومجموعة الكربوكسيل الحمضية ${L('(–COOH)')}، واللتَين تعطيان للأحماض الأمينيّة اسمها. المكوّن الثالث الذي يرتبط دائمًا بذرّة الكربون هو ذرّة الهيدروجين. تختلف الأحماض الأمينيّة عن بعضها بالمجموعة الرابعة من الذرّات المرتبطة بالكربون المركزي، وتسمّى المجموعة ${L('R')}.`,
        seq: [[{ n: 1 }, 1500]],
        pills: [['ذرّة كربون مركزيّة', GRY, () => FR[0].B, 0, -95], ['مجموعة أمين', GRN, () => FR[0].N, -130, 70], ['مجموعة كربوكسيل', BLU, () => FR[0].C, 140, 70], ['ذرّة الهيدروجين', GRY, () => FR[0].Ha, 40, 110], ['المجموعة R', ORG, () => FR[0].R, 150, -60]] },
      { t: 'الرابطة الببتيديّة: تكثيف بفقدان جُزيء ماء',
        p: `يبيّن الشكل ٢-١٥ كيف يرتبط حمضان أمينيان أحدهما بالآخر، حيث يفقد أحدهما مجموعة هيدروكسيل ${L('(–OH)')} من مجموعة الكربوكسيل، ويفقد الآخر ذرّة هيدروجين من مجموعة الأمين. وينتج عن ذلك وجود ذرّة كربون من الحمض الأميني الأول حرّة يمكّنها الارتباط مع ذرّة نيتروجين من الحمض الثاني في رابطة ببتيديّة. وتكوّن ذرّة الأكسجين وذرّتا الهيدروجين المزالتان من الحمضَين الأمينيَّين جُزيء ماء.`,
        seq: [[{ '!fo': 2, n: 2, zoom: 2.6 }, 1500], [{ w: 1 }, 2400], [{ gap: 0, bond: 1 }, 1300]],
        pills: [['حمض أميني', GRY, () => FR[0].R, -150, 50], ['حمض أميني', GRY, () => FR[1].R, 130, -60], ['رابطة ببتيديّة', GLD, () => mid(FR[0].C, FR[1].N), 20, 105], [`جُزيء ماء ${L('H<sub>2</sub>O')}`, BLU, () => { const w = water(); return w ? w.O : mid(FR[0].C, FR[1].N).add(V(0, 1.65, 0.4)); }, -150, -30]] },
      { t: 'الببتيد الثنائي ثمَّ عديد الببتيد',
        p: `الجُزيء الجديد المتكوّن من حمضَين أمينيَّين مرتبطَين يسمّى الببتيد الثنائي ${L('Dipeptide')}. ويسمّى الجُزيء المكوّن من عدة أحماض أمينيّة ترتبط معًا بروابط ببتيديّة عديد الببتيد ${L('Polypeptide')}. عديد الببتيد مثال آخر على البوليمر والجُزيء الكبير مثل عديد التسكر.`,
        seq: [[{ w: 2 }, 700], [{ '!fo': 3, zoom: 1.8 }, 900], [{ n: NRES }, 5600], [{ '!fo': 0, zoom: 1 }, 1100]],
        pills: [['الببتيد الثنائي (حمضان أمينيّان)', GLD, () => mid(FR[0].R, FR[1].R), -40, -80], ['روابط ببتيديّة', GRY, () => mid(FR[12].C, FR[13].N), 0, 90], ['عديد الببتيد', PNK, () => FR[20].R, 60, -80]] },
      { t: 'التركيب الأوّلي: تسلسل الأحماض الأمينيّة',
        p: `قد يحتوي جُزيء عديد الببتيد أو البروتين على عدة مئات من الأحماض الأمينيّة المرتبطة في سلسلة طويلة. وتسمّى أنواع الأحماض الأمينيّة في السلسلة والتسلسل الذي توجد فيه التركيب الأولي ${L('Primary structure')} (الشكل ٢-١٦).`,
        n: 'للتوضيح تُعرض سلسلة من 26 حمضاً أمينيّاً فقط. لاحظ وجود مجموعة أمين في أحد طرفي سلسلة الحمض الأميني، ووجود مجموعة كربوكسيل في الطرف الآخر. وتُعرف هاتان المجموعتان بطرفي الأمين والكربوكسيل أو بالنهايتين N و C على التوالي.',
        seq: [[{ zoom: 0.95 }, 1000]],
        pills: [['التركيب الأوّلي: أنواع الأحماض الأمينيّة وتسلسلها', GLD, () => FR[11].R, 0, -80], ['طرف الأمين (النهاية N)', GRN, () => FR[0].N, -60, 80], ['طرف الكربوكسيل (النهاية C)', BLU, () => FR[NRES - 1].C, 80, 80], ['المجموعات R المختلفة', ORG, () => FR[19].R, 120, -60]] },
      { t: 'التركيب الثانوي: ألفا (α)- اللولبي',
        p: `قد تؤثر الأحماض الأمينية في سلسلة عديد الببتيد بعضها على بعض عندما تنطوي السلسلة. يوضح الشكل ٢-١٧أ كيف يمكن أن تنطوي سلسلة عديد الببتيد على شكل حلزوني يسمى ألفا ${L('(α)')}- اللولبي ${L('α-helix')}. يتم تثبيت هذا الشكل في مكانه بواسطة روابط هيدروجينية بين أكسجين مجموعة ${L('(C=O)')} لأحد الأحماض الأمينية والهيدروجين في مجموعة ${L('(–NH)')} للحمض الأميني المتقدم أربعة مراتب عنه، أي أنه يسبقه بثلاثة أحماض أمينية كما هو موضح في الشكل ٢-١٧أ، حيث الأرقام من 1 إلى 9 تشير إلى وحدات الأحماض الأمينية.`,
        seq: [[{ '!fo': 4, zoom: 1.9 }, 900], [{ a: 1 }, 4000], [{ zoom: 1.4 }, 900]],
        pills: [['ألفا (α)- اللولبي', GLD, () => V(HX.x0 + 2.0, HX.yc + 0.7, HX.zc), 0, -90], ['الحمض الأميني 1', GRY, () => FR[0].R, -120, 60], ['الحمض الأميني 5', GRY, () => FR[4].R, -60, 100], ['رابطة هيدروجينية بين C=O و N–H', TEAL, () => mid(FR[0].O, FR[4].HN), 170, 60]] },
      { t: 'التركيب الثانوي: صفيحة بيتا (β)- المطوية',
        p: `يمكن أن تؤدي الرابطة الهيدروجينية في بعض الأحيان، إلى أن قطعتَين أو أكثر من سلسلة عديد الببتيد تصطفان إحداهما بجانب الأخرى وتكوّنان تركيبًا مستويًا (مسطح) يسمى صفيحة بيتا ${L('(β)')}- المطوية (المثناة) ${L('β-pleated sheet')} (الشكل ٢-١٧ب). يسمى الشكل الذي تنطوي به سلسلة عديد الببتيد بالتركيب الثانوي ${L('Secondary structure')} للبروتين.`,
        seq: [[{ '!fo': 5, zoom: 1.9 }, 900], [{ b: 1 }, 3400], [{ zoom: 1.3 }, 900]],
        pills: [['صفيحة بيتا (β)- المطوية', GLD, () => mid(FR[16].B, FR[23].B).add(V(0, 0.5, 0)), 0, -95], ['قطعتان من السلسلة تصطفّان إحداهما بجانب الأخرى', PNK, () => mid(FR[TN0].B, FR[TN1].B), 150, 70], ['رابطة هيدروجينية', TEAL, () => mid(FR[14].O, FR[25].HN), -170, 60], ['ألفا (α)- اللولبي', GRY, () => V(HX.x0 + 2.0, HX.yc + 0.7, HX.zc), -40, -70]] },
      { t: 'التركيب الثالثي: تركيب ثلاثي الأبعاد',
        p: `في العديد من البروتينات، يكون التركيب الثانوي نفسه ملتفًا أو مثبتًا في مكانه بواسطة التفاعلات المختلفة بين الأحماض الأمينية في أجزاء مختلفة من سلسلة عديد الببتيد، لتكوين تركيب ثلاثي الأبعاد. يوضح الشكلان ٢-١٨ و٢-١٩ أمثلة على التركيب الثالثي ${L('Tertiary structure')} للبروتين.`,
        seq: [[{ '!fo': 6, zoom: 1.3 }, 900], [{ t: 1 }, 3600], [{ zoom: 1.7 }, 900]],
        pills: [['التركيب الثالثي: تركيب ثلاثي الأبعاد', GLD, () => V(1.9, 3.9, 0), 0, -70], ['ألفا (α)- اللولبي', GRY, () => FR[5].B, -170, -40], ['صفيحة بيتا (β)- المطوية', GRY, () => FR[24].B, 60, 100]] },
      { t: 'الروابط الأربعة التي تثبِّت التركيب الثالثي',
        p: `يبيّن الشكل ٢-٢٠ الأنواع الأربعة للروابط أو التفاعلات التي تساعد في استقرار والحفاظ على البروتينات المطوية بأشكالها المحددة: الروابط الهيدروجينيّة ضعيفة بمفردها، لكن وجود مجموعة منها معًا يمكن أن يشكّل تركيبًا قويًا. روابط ثنائي الكبريتيد تتكوّن بين مونمرَين من الحمض الأميني السيستين ${L('Cysteine')}؛ وكلاهما يحتويان على ذرّات الكبريت. الروابط الأيونيّة بين مجموعات ${L('R')} تحتوي على مجموعات أمين وكربوكسيل. تحدث تفاعلات كارهة للماء بين مجموعات ${L('R')} غير القطبيّة.`,
        n: 'تكون مجموعات R الكاره للماء متجهة عادة باتجاه مركز البروتينات بعيدة عن مواجهة البيئة المائيّة الخارجيّة، وتكون مجموعات R المحبّة للماء محيطة بها، ومتجهة إلى الخارج وعلى اتصال مع البيئة المائيّة.',
        seq: [[{ '!fo': 7, zoom: 2.6 }, 1000], [{ bs: 1 }, 1600], [{ '!fo': 6, zoom: 1.9 }, 1100]],
        pills: [['رابطة ثنائي الكبريتيد بين جزيئَي سيستين', GLD, () => mid(FR[SS[0]].R, FR[SS[1]].R), -150, -60], ['رابطة أيونيّة', PNK, () => mid(FR[ION[0]].R, FR[ION[1]].R), 150, -70], ['رابطة هيدروجينية بين مجموعتَي R', TEAL, () => mid(FR[HBR[0]].R, FR[HBR[1]].R), -170, 60], ['تفاعلات كارهة للماء بين مجموعات R غير القطبيّة باتجاه مركز البروتين', ORG, () => V(2.0, 2.15, 0), 120, 110]] },
      { t: 'التركيب الرابعي: أكثر من سلسلة عديد ببتيد',
        p: `تتكوّن العديد من جزيئات البروتين من سلسلتي عديد ببتيد أو أكثر. ويسمّى التركيب العام المتكوّن من سلاسل عديدة الببتيد المختلفة التركيب الرابعي ${L('Quaternary structure')} للبروتين، ومثاله الهيموجلوبين ${L('Haemoglobin')}. يحتوي جُزيء الهيموجلوبين على أربع سلاسل عديدة الببتيد (الشكل ٢-٢١). ترتبط التراكيب الرابعية معًا بالأنواع الأربعة نفسها من الروابط كما في التراكيب الثالثية.`,
        n: 'للتوضيح تُعرض هنا سلسلتان فقط؛ الهيموجلوبين يحتوي على أربع سلاسل عديدة الببتيد.',
        seq: [[{ '!fo': 8, zoom: 1.1 }, 900], [{ q: 1 }, 2800], [{ zoom: 1.35 }, 900]],
        pills: [['سلسلة عديد ببتيد (١)', GLD, () => V(1.9, 3.9, 0), -60, -70], ['سلسلة عديد ببتيد (٢)', PUR, () => { const p = chain2(); return mid(p[3], p[7]).add(V(0, 0.7, 0)); }, -150, 90], ['التركيب الرابعي: سلسلتا عديد ببتيد أو أكثر', GRY, () => V(4.2, 1.2, 1.7), 200, 70]] },
    ],
    setup(ctx) {
      ctx_ = ctx;
      hydroBlob = ctx.blob(0xF08C2E, 0.2); hydroBlob.position.set(2.0, 2.2, 0); hydroBlob.scale.set(2.6, 0.75, 1.3); hydroBlob.visible = false;
    },
    rebuild(s, ctx) {
      ctx_ = ctx; const F = frames(s); const last = lastIdx();
      for (let i = 0; i < NRES; i++) {
        const f = F[i]; if (f.ar <= 0) continue; const k = f.k;
        ctx.ball(f.B, 0.21 * k, matCa); ctx.ball(f.N, 0.19 * k, matN); ctx.ball(f.C, 0.19 * k, matC);
        ctx.ball(f.R, 0.26 * k, matR[TYPE[i]]); ctx.ball(f.O, 0.11 * k, matO); ctx.ball(f.HN, 0.085 * k, matH); ctx.ball(f.Ha, 0.085 * k, matH);
        ctx.rod(f.N, f.C, 0.06 * k, matBond); ctx.rod(f.B, f.R, 0.055 * k, matBond); ctx.rod(f.C, f.O, 0.045 * k, matBond);
        if (i === 0 || (i === 1 && S.w <= 0)) ctx.ball(f.H2, 0.085 * k, matH);                         // الهيدروجين الثاني لأمين الطرف
        if ((i === last && i > 0) || (i === 0 && S.w <= 0)) { ctx.ball(f.O2, 0.11 * k, matO); ctx.ball(f.HO, 0.085 * k, matH); ctx.rod(f.C, f.O2, 0.045 * k, matBond); }   // OH كربوكسيل الطرف
        // الرابطة الببتيديّة مع الحمض التالي
        if (i < NRES - 1 && F[i + 1].ar > 0) {
          const u = i === 0 ? S.bond : sm(F[i + 1].ar); if (u > 0.02) ctx.rod(f.C, f.C.clone().lerp(F[i + 1].N, u), 0.075, matPep);
        }
      }
      const w = water(); if (w) { ctx.ball(w.O, 0.13 * w.k, matO); ctx.ball(w.H1, 0.09 * w.k, matH); ctx.ball(w.H2, 0.09 * w.k, matH); }
      for (const [a, b, f] of hbonds()) dots(a, b, 0.055, matHb, 4, f);
      if (S.bs > 0.02) {
        const u = sm(S.bs);
        const a = F[SS[0]].R, b = F[SS[1]].R; ctx.rod(a, a.clone().lerp(b, u), 0.1, matSS);
        const c = F[ION[0]].R, d = F[ION[1]].R; for (let q = 0; q < 4; q++) ctx.ball(c.clone().lerp(d, (q + 0.5) / 4), 0.07 * u, q % 2 ? matIon2 : matIon);
        dots(F[HBR[0]].R, F[HBR[1]].R, 0.055, matHb, 4, u);
      }
      if (S.q > 0.01) { const pts = chain2(); ctx.tubePts(pts, 0.3, matCh2); ctx.ball(pts[0], 0.36, matCh2); ctx.ball(pts[NRES - 1], 0.36, matCh2); }
    },
    _fr: () => FR,
    place(s) { S = s; hydroBlob.visible = S.bs > 0.02; hydroBlob.material.opacity = 0.2 * sm(S.bs); },
    ends(s) {
      S = s; if (!FR || S.n < NRES - 0.01) return [];
      const a = FR[0], b = FR[NRES - 1];
      return [[a.N.clone().addScaledVector(a.T, -0.45), 'N'], [b.C.clone().addScaledVector(b.T, 0.6), 'C']];
    },
    idle(t, s) { if (hydroBlob.visible) { const k = 1 + Math.sin(t * 2) * 0.03; hydroBlob.scale.set(2.6 * k, 0.75 * k, 1.3 * k); } },
  };
})();
