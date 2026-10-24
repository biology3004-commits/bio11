/* ديوراما: دور الخلايا الجذعيَّة (شجرة التمايز) — الدرس ٤-٥ (كتاب الطالب ص ١٣٨) */
(function () {
  const { V, sm, M, CSS } = DioramaCore;
  const { BLU, RED, GLD, TEAL, PNK, GRY, GRN, ORG, PUR } = CSS;
  const L = s => `<span class="ltr">${s}</span>`;
  const cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  let S;
  const O = {};
  let flT = 0;                                                          // إزاحة الجريان المستمرِّ (أثناء العرض فقط، لا في اللقطات)

  // ── الألوان ──
  const C_STEM = 0x22A7A0, C_TOTI = 0xF2C14E, C_PLURI = 0x7BC043, C_MULTI = 0x3A86D9, C_PLAC = 0xD99AA6, C_EGG = 0xF7E8CC;
  const C_MUSC = 0xD86A6A, C_RBC = 0xC8283A, C_WBC = 0xEFEBF4, C_WNUC = 0x6A4A9A, C_DMG = 0x8C8C8C, C_LAB = 0xE79A9A;
  const col = c => { const m = M(c); return m.color.clone(); };
  const K = { stem: col(C_STEM), toti: col(C_TOTI), pluri: col(C_PLURI), multi: col(C_MULTI), plac: col(C_PLAC), egg: col(C_EGG), musc: col(C_MUSC), dmg: col(C_DMG), lab: col(C_LAB) };
  const trans = (c, op, o = {}) => { const m = new THREE.MeshStandardMaterial(Object.assign({ color: c, transparent: true, opacity: op, roughness: 0.35, depthWrite: false }, o)); m.color.convertSRGBToLinear(); return m; };

  // ── هندسة المشهد ──
  const Y0 = -0.3;                                                      // سطح اللوح
  const PH = 0.1;                                                       // سُمك قاعدة النسيج
  const DM = V(0.4, Y0 + 0.75, 0.4);                                    // خليَّة المثال (الخطوة 1) وطبق المختبر (الخطوة 9)
  const E = V(6.7, 1.95, 0.0);                                          // الزيجوت ثمَّ الجنين
  const EC = E.clone().add(V(-0.5, -0.05, 0));                          // مركز الخلايا الجذعيَّة الجنينيَّة
  const SP0 = E.clone().add(V(2.9, 0.9, 1.9));                          // نقطة انطلاق الحيوان المنوي
  const SPC = E.clone().add(V(0.95, 0.25, 0.6).normalize().multiplyScalar(0.98));   // نقطة التماسِّ بالبويضة

  // ── التفلُّج 1→16: مواضع نهائيَّة بتقسيم ثنائي متتالٍ (x ثم z ثم y ثم مماسِّيّاً) ──
  const F16 = [];
  for (let i = 0; i < 16; i++) {
    const b = [(i >> 3) & 1, (i >> 2) & 1, (i >> 1) & 1, i & 1].map(v => v ? 1 : -1);
    const n = V(b[0], b[2] * 0.85, b[1]).normalize();
    const t = V(0, 1, 0).cross(n); if (t.length() < 1e-3) t.set(1, 0, 0); t.normalize();
    F16.push(n.clone().addScaledVector(t, b[3] * 0.42).normalize().multiplyScalar(0.8));
  }
  const DL = [0, 0.5, 0.62, 0.72, 0.8], RL = [0.95, 0.76, 0.6, 0.48, 0.38];
  const CEN = [0, 1, 2, 3, 4].map(l => { const a = []; for (let g = 0; g < (1 << l); g++) { const c = V(0, 0, 0); for (let i = 0; i < 16; i++) if ((i >> (4 - l)) === g) c.add(F16[i]); if (c.length() > 1e-6) c.setLength(DL[l]); a.push(c); } return a; });
  // الخلايا الستُّ الأقرب إلى جهة الشجرة (−x) تصبح الخلايا الجذعيَّة الجنينيَّة؛ والعشر الأخرى تتَّجه إلى تكوين المشيمة
  const ord = F16.map((p, i) => [p.x, i]).sort((a, b) => a[0] - b[0]).map(a => a[1]);
  const ESC = new Set(ord.slice(0, 6));
  const ESC_T = [V(0.3, 0, 0), V(-0.3, 0, 0), V(0, 0.3, 0), V(0, -0.3, 0), V(0, 0, 0.3), V(0, 0, -0.3)];
  const PLAC_T = []; for (let k = 0; k < 10; k++) { const y = 1 - 2 * (k + 0.5) / 10, r = Math.sqrt(1 - y * y), th = k * 2.39996; PLAC_T.push(V(r * Math.cos(th), y * 0.92, r * Math.sin(th)).multiplyScalar(1.5)); }
  const EMB_T = []; (function () {                                      // تعيين الأهداف بأقرب جار
    let ei = 0; const used = new Set();
    for (let i = 0; i < 16; i++) {
      if (ESC.has(i)) { EMB_T[i] = { p: EC.clone().sub(E).add(ESC_T[ei++]), esc: true }; continue; }
      let best = -1, bd = 1e9; PLAC_T.forEach((q, k) => { if (used.has(k)) return; const d = q.distanceTo(F16[i]); if (d < bd) { bd = d; best = k; } });
      used.add(best); EMB_T[i] = { p: PLAC_T[best].clone(), esc: false };
    }
  })();

  // ── الأنسجة (أماكن وجود الخلايا الجذعيَّة لدى البالغ ص138) ──
  const ring = (n, R, a0 = 0) => { const a = [V(0, 0, 0)]; for (let k = 0; k < n; k++) { const th = a0 + k * 2 * Math.PI / n; a.push(V(R * Math.cos(th), 0, R * Math.sin(th))); } return a; };
  const PADS = [
    { k: 'skin', c: V(2.9, Y0, -2.55), R: 1.2, col: 0xE9C8A4, sh: [0.36, 0.12, 0.36], slots: ring(6, 0.7, 0.3), stem: [2, 5] },
    { k: 'gut', c: V(2.5, Y0, 2.75), R: 1.2, col: 0xF0A890, sh: [0.2, 0.44, 0.2], slots: ring(6, 0.62, 0.2), stem: [1, 4] },
    { k: 'brain', c: V(-1.0, Y0, -2.7), R: 1.2, col: 0xB7A0D8, sh: [0.22, 0.2, 0.22], slots: ring(6, 0.72, 0.5), stem: [3, 6], proc: true },
    { k: 'heart', c: V(-1.8, Y0, 2.6), R: 1.2, col: C_MUSC, sh: [0.48, 0.16, 0.16], slots: ring(6, 0.7, 0.1), stem: [2, 5], spin: true },
    { k: 'marrow', c: V(-6.1, Y0, -0.5), R: 1.75, col: 0xEBDDB0, sh: [0.3, 0.24, 0.3], slots: ring(8, 1.22, 0.2), stem: [0, 4] },
  ];
  PADS.forEach(P => { P.cc = col(P.col); });
  const MAR = PADS[4];
  const STEM_SH = [0.24, 0.22, 0.24];
  const slotPos = (P, j, sh) => P.c.clone().add(P.slots[j]).add(V(0, PH + sh[1], 0));
  const M0 = slotPos(MAR, 0, STEM_SH);                                  // الخليَّة الجذعيَّة في نخاع العظم
  const M1 = MAR.c.clone().add(V(0.66 * Math.cos(-0.9), PH + STEM_SH[1], 0.66 * Math.sin(-0.9)));   // خليَّتها البنت (مضاعفة الأعداد)
  const NEWS = [2.0, 3.3, 4.6].map(a => MAR.c.clone().add(V(0.68 * Math.cos(a), PH + STEM_SH[1], 0.68 * Math.sin(a))));  // خلايا جذعيَّة بالغة جديدة (الزراعة)
  const DMG = [1, 3, 6, 7];                                             // خلايا نخاع العظم «التالفة»

  // فروع الشجرة: من الخلايا الجذعيَّة الجنينيَّة إلى كلِّ نسيج
  const BR = PADS.map(P => { const a = EC.clone(), b = P.c.clone().add(V(0, 0.7, 0)), m = a.clone().lerp(b, 0.5).add(V(0, 2.3, 0)); return { a, m, b }; });
  const bez = (B, u) => { const p = B.a.clone().lerp(B.m, u), q = B.m.clone().lerp(B.b, u); return p.lerp(q, u); };
  const ORDER = [0, 1, 2, 3, 4];                                         // ترتيب الإنبات

  // ── الوعاء الدموي وخلايا الدم ──
  const VY = 0.5, VZ = -3.7, VX0 = -4.9, VX1 = -10.95, VE = V(-6.0, VY, VZ);
  const BT = ['R', 'R', 'R', 'M', 'R', 'R', 'N', 'R', 'R', 'L', 'R', 'R', 'N', 'R', 'M', 'R'];
  const NB = BT.length, SB = BT.map((_, i) => 0.9 * (i + 0.5) / NB);
  const BLOOD_C = { a: M0.clone().add(V(0, 0.25, 0)), m: V(-6.05, 1.8, -2.3), b: VE.clone() };
  function bloodPos(i, phi) {                                            // phi: 0 خروج من الخليَّة الجذعيَّة، 0.22 دخول الوعاء، 0.9 بداية الفقد
    if (phi < 0) return null;
    if (phi < 0.22) { const u = phi / 0.22; return { p: bez(BLOOD_C, sm(u)), s: sm(cl(u / 0.3)) }; }
    if (phi < 0.9) { const u = (phi - 0.22) / 0.68; return { p: V(lerp(VE.x, -10.2, u), VY + 0.08 * Math.sin(i * 1.7), VZ + 0.16 * Math.sin(i * 2.3)), s: 1 }; }
    const u = (phi - 0.9) / 0.1; return { p: V(lerp(-10.2, -10.7, u), VY + 0.08 * Math.sin(i * 1.7), VZ + 0.16 * Math.sin(i * 2.3)), s: 1 - sm(u) };
  }
  const bPhi = i => {
    if (S.fl > 0) { const f = SB[i] + S.fl * 1.0 + flT; return f - Math.floor(f); }
    return SB[i] - (1 - S.bl);
  };

  // ── طبق المختبر (الخطوة 9) ──
  const DISH = ring(6, 0.52, 0).concat([0, 1, 2, 3, 4].map(k => { const th = 0.52 + k * 2 * Math.PI / 6; return V(0.9 * Math.cos(th), 0, 0.9 * Math.sin(th)); }));
  const DPAR = DISH.map((p, k) => { if (k < 2) return -1; let b = 0, bd = 1e9; for (let j = 0; j < k; j++) { const d = DISH[j].distanceTo(p); if (d < bd) { bd = d; b = j; } } return b; });
  const DY = Y0 + 0.06 + 0.2;
  const DC = V(4.75, Y0, 4.05);                                          // موضع طبق المختبر

  // مواضع مساعدة للتسميات
  const embCell = i => { const q = embState(i); return q ? E.clone().add(q.p) : E.clone(); };
  function embState(i) {                                                // موضع خليَّة الجنين i (نسبةً إلى E) ونصف قطرها
    const cv = cl(S.cv, 0, 4), fl = Math.min(3, Math.floor(cv)), f = cv - fl;
    const lev = f > 0 ? fl + 1 : Math.round(cv);
    const rep = (i % (1 << (4 - lev))) === 0;
    if (!rep && S.pl <= 0) return null;
    let p, r;
    if (cv >= 4) { p = F16[i].clone(); r = RL[4]; }
    else { const a = CEN[fl][i >> (4 - fl)], b = CEN[fl + 1][i >> (4 - fl - 1)], u = sm(f); p = a.clone().lerp(b, u); r = lerp(RL[fl], RL[fl + 1], u); }
    if (S.pl > 0) { const u = sm(S.pl), T = EMB_T[i]; p.lerp(T.p, u); r = lerp(r, T.esc ? 0.32 : 0.6, u); }
    return { p, r };
  }
  const padCell = (k, j) => { const P = PADS[k]; return slotPos(P, j, P.stem.includes(j) ? STEM_SH : P.sh); };
  const TOP = (p, h) => p.clone().add(V(0, h, 0));

  window.DIORAMA = {
    id: 'stem_cells', title: 'دور الخلايا الجذعيّة',
    subtitle: 'الأحياء – الصف الحادي عشر – الوحدة الرابعة: دورة الخليّة والانقسام المتساوي',
    source: 'النص من كتاب الطالب: ٤-٥ دور الخلايا الجذعيّة (ص ١٣٨)',
    legend: [['#22A7A0', 'خليّة جذعيّة'], ['#F2C14E', 'كاملة القدرات'], ['#7BC043', 'عالية القدرات'], ['#3A86D9', 'متعدّدة القدرات'], null,
             ['#D99AA6', 'تكوين المشيمة'], ['#C8283A', 'خلايا الدم الحمراء'], ['#EFEBF4', 'خلايا دم بيضاء'], ['#A9D99A', 'التمايز', 'tube']],
    camera: { VH: 13.0, center: [-1.3, 0.6, 0.1], elevation: 36, azimuth: 16 },
    base: { L: 23, W: 11.2, x: -1.0, z: 0.35 },
    BASE: { fo: 0, zoom: 2.1, dm: 0, dz: 0, sp: 0, cv: 0, pl: 0, br: 0, dif: 0, ad: 0, bm: 0, bl: 0, fl: 0, dmg: 0, tx: 0, dish: 0, gr: 0 },
    noGeom: ['fo', 'dm', 'dz', 'sp', 'cv', 'pl', 'dif', 'ad', 'bm', 'bl', 'fl', 'dmg', 'tx', 'dish', 'gr'],
    // نقاط التركيز: 0 خليَّة المثال، 1 الجنين، 2 نخاع العظم والوعاء، 3 طبق المختبر
    focus(s) {
      S = s; const F = [DM.clone().add(V(-0.2, 0.1, 0)), E.clone().add(V(0, -0.1, 0)), V(-7.6, 0.6, -2.0), DC.clone().add(V(-0.3, 0.1, 0.45))];
      const f = cl(S.fo || 0, 0, F.length - 1), i = Math.floor(f), w = f - i;
      return i >= F.length - 1 ? F[i].clone() : F[i].clone().lerp(F[i + 1], w);
    },
    STEPS: [
      { t: 'الخليَّة الجذعيَّة',
        p: `الخليّة الجذعيّة ${L('Stem cell')}، خليّة يمكنها الانقسام لعدد غير محدود من المرات بالانقسام المتساوي. وعندما تنقسم، يكون لدى كل خليّة جديدة القدرة على أن تبقى خليّة جذعيّة أو أن تتطوّر (تتمايز) إلى خليّة متخصصة مثل خلية دم أو خليّة عضليّة.`,
        seq: [[{}, 500], [{ dm: 0.5 }, 1800], [{ dm: 1 }, 1800]],
        pills: [['تبقى خليّة جذعيّة', TEAL, () => TOP(DM.clone().add(V(0.9, 0, 0)), 0.45), 120, -110],
                ['خليّة متخصصة (خليّة عضليّة)', RED, () => TOP(DM.clone().add(V(-1.25, 0, 0)), 0.2), -110, 120],
                ['الانقسام المتساوي', PUR, () => DM.clone().add(V(-0.05, 0.1, 0)), -40, -150]] },
      { t: 'الزيجوت: كامل القدرات',
        p: `للخلايا الجذعية القدرة ${L('Potency')} على إنتاج أنواع مختلفة من الخلايا؛ فالخلايا الجذعيّة القادرة على إنتاج أي نوع من الخلايا توصف بأنها كاملة القدرات ${L('Totipotent')}. والزيجوت الذي يتكوّن من اندماج حيوان منوي مع بويضة في عمليّة الإخصاب هو كامل القدرات، كما هو الحال مع جميع الخلايا حتى مرحلة 16 خليّة أثناء التكوين الجنيني عند الإنسان.`,
        n: 'يُعرض الإخصاب ثمَّ الانقسامات 1→2→4→8→16 متتابعةً للتوضيح.',
        seq: [[{ fo: 1, zoom: 2.2, dz: 1 }, 1300], [{ sp: 1 }, 2000], [{ cv: 4 }, 3000]],
        pills: [['كاملة القدرات ' + L('Totipotent'), GLD, () => E.clone().add(V(0, 0.95, 0)), -60, -120],
                ['مرحلة 16 خليّة', ORG, () => E.clone().add(V(0.75, -0.3, 0.3)), 150, 90]] },
      { t: 'الخلايا الجذعيَّة الجنينيَّة: عالية القدرات',
        p: `بعد ذلك، تصبح مهمّة بعض الخلايا محصورة في تكوين المشيمة، في حين تفقد خلايا أخرى هذه القدرة، على الرغم من محافظتها على إنتاج جميع الخلايا التي ستؤدي إلى تكوين الجنين ثم الإنسان البالغ لاحقًا. لذلك، توصف هذه الخلايا الجذعيّة الجنينيّة بأنها عالية القدرات ${L('Pluripotent')}.`,
        n: 'موضع الخلايا (خارجيَّة وداخليَّة) تمثيل توضيحي؛ الكتاب لا يحدِّده.',
        seq: [[{ zoom: 2.0 }, 500], [{ pl: 1 }, 2600]],
        pills: [['تكوين المشيمة', PNK, () => E.clone().add(PLAC_T[1]), 140, -90],
                ['الخلايا الجذعيّة الجنينيّة: عالية القدرات ' + L('Pluripotent'), GRN, () => EC.clone(), -170, 130]] },
      { t: 'التمايز: خلايا متخصِّصة لا تنقسم',
        p: 'ومع تكوين الأنسجة والأعضاء، تزيد الخلايا من اختصاصها (تمايزها). يوجد أكثر من 200 نوع مختلف من الخلايا في جسم الإنسان البالغ. كلما أصبحت الخلايا «متخصصة» بأدوار معيّنة، فقدت قدرتها على الانقسام، لذلك معظم الخلايا في الكائن الحي البالغ لا تنقسم.',
        n: 'تُعرض خمسة أنسجة فقط للتوضيح، وأشكال خلاياها رمزيَّة.',
        seq: [[{ zoom: 1 }, 1000], [{ br: 1 }, 1600], [{ dif: 1 }, 3000]],
        pills: [['تزيد الخلايا من اختصاصها (تمايزها)', GRN, () => bez(BR[2], 0.5), -40, -90],
                ['«متخصصة» فقدت قدرتها على الانقسام', RED, () => padCell(3, 1), 150, 70],
                ['أكثر من 200 نوع مختلف من الخلايا', ORG, () => padCell(0, 1), 130, -90]] },
      { t: 'الخلايا الجذعيَّة لدى البالغ: متعدِّدة القدرات',
        p: `ومع ذلك، للنمو والإصلاح، من الضروري أن تبقى مجموعات صغيرة من الخلايا الجذعيّة القادرة على إنتاج خلايا جديدة. لقد فقدت الخلايا الجذعيّة لدى البالغ بعض قدرتها التي كانت في الخلايا الجذعيّة الجنينيّة، ولم تعد عالية القدرات. إذ هي قادرة فقط على إنتاج أنواع قليلة من الخلايا، لذا توصف بأنها متعدّدة القدرات ${L('Multipotent')}.`,
        seq: [[{ ad: 1 }, 2000]],
        pills: [['مجموعات صغيرة من الخلايا الجذعيّة', BLU, () => padCell(2, 3), 110, -90],
                ['متعدّدة القدرات ' + L('Multipotent'), BLU, () => padCell(3, 5), 140, 80]] },
      { t: 'نخاع العظم: خلايا دم فقط',
        p: 'والخلايا الجذعيّة في نخاع العظم، تتبع لهذا النوع؛ فهي قادرة على مضاعفة أعدادها مرات ومرات، لكن يمكنها إنتاج خلايا دم فقط، مثل خلايا الدم الحمراء، والخلايا وحيدة النواة والمتعادلة واللمفاويّة.',
        seq: [[{ '!fo': 2, zoom: 1.75 }, 1000], [{ bm: 1 }, 1500], [{ bl: 1 }, 3200]],
        pills: [['الخلايا الجذعيّة في نخاع العظم', BLU, () => M0.clone(), -60, 120],
                ['مضاعفة أعدادها', BLU, () => M1.clone(), 150, 80],
                ['خلايا الدم الحمراء', RED, () => bloodPos(4, SB[4]).p, 30, 110],
                ['وحيدة النواة', PUR, () => bloodPos(3, SB[3]).p, 80, -100],
                ['المتعادلة', PUR, () => bloodPos(6, SB[6]).p, 30, -110],
                ['اللمفاويّة', PUR, () => bloodPos(9, SB[9]).p, -10, 110]] },
      { t: 'تعويض خلايا الدم',
        p: 'ولأن عمر خلايا الدم الناضجة قصير نسبيًا، فمن الضروري وجود هذا النوع من الخلايا الجذعيّة. على سبيل المثال: يُفقد يوميًا 250 مليار خليّة دم حمراء تقريبًا و 20 مليار خليّة دم بيضاء، ويجب تعويضها.',
        n: 'الخلايا التي تختفي عند طرف الوعاء تمثِّل الخلايا المفقودة، والخارجة من نخاع العظم تعوِّضها.',
        seq: [[{ zoom: 1.6 }, 600], [{ fl: 1 }, 4200]],
        pills: [['يُفقد يوميًا 250 مليار خليّة دم حمراء تقريبًا', RED, () => V(-10.3, VY + 0.3, VZ), 120, -95],
                ['و 20 مليار خليّة دم بيضاء', PUR, () => V(-9.6, VY - 0.2, VZ + 0.3), 120, 95],
                ['ويجب تعويضها', BLU, () => M0.clone().add(V(0, 0.2, 0)), 120, 110]] },
      { t: 'أين توجد؟ وزراعة نخاع العظم',
        p: 'توجد الخلايا الجذعيّة عند الإنسان البالغ في جميع أجزاء الجسم؛ في نخاع العظم، والجلد، والأمعاء، والقلب، والدماغ. ويقدم الباحثون في مجال الخلايا الجذعيّة بعض التطبيقات الطبيّة المفيدة، ومنها العلاج بالخلايا الجذعيّة وذلك بإدخال خلايا جذعيّة بالغة جديدة في الأنسجة التالفة لمعالجة المرض أو الإصابة. ومن أمثلة هذا العلاج، زراعة نخاع العظم، الذي يستخدم لمعالجة أمراض الدم ونخاع العظم وسرطانات الدم (اللوكيميا).',
        n: 'تُعرض خلايا نخاع العظم «التالفة» رماديَّةً ثمَّ تُدخل خلايا جذعيَّة بالغة جديدة للتوضيح؛ الكتاب لا يصف طريقة الإدخال.',
        seq: [[{ zoom: 1 }, 1000], [{ dmg: 1 }, 1000], [{ tx: 1 }, 2600]],
        pills: [['نخاع العظم', BLU, () => MAR.c.clone().add(V(-1.6, 0.2, 0.2)), -110, -40],
                ['الجلد', ORG, () => PADS[0].c.clone().add(V(0.9, 0.3, 0)), 90, -60],
                ['الأمعاء', ORG, () => PADS[1].c.clone().add(V(1.0, 0.4, 0)), 90, 60],
                ['القلب', ORG, () => PADS[3].c.clone().add(V(0.9, 0.3, 0.4)), 110, 60],
                ['الدماغ', ORG, () => PADS[2].c.clone().add(V(0, 0.4, -0.9)), 0, -80],
                ['خلايا جذعيّة بالغة جديدة', BLU, () => NEWS[1].clone(), -40, -190]] },
      { t: 'الأمل في المستقبل: أنسجة من خلايا جذعيَّة',
        p: 'ويؤمل في المستقبل أن تكون الخلايا الجذعيّة قادرة على علاج حالات مثل مرض السكّري وتلف العضلات والأعصاب، واضطرابات الدماغ مثل أمراض باركنسون وهنتنغتون. ولهذا السبب أجريت تجارب على تنمية أنسجة وأعضاء جديدة من خلايا جذعيّة معزولة في المختبر.',
        n: 'يُرسم طبق المختبر رمزيّاً.',
        seq: [[{ '!fo': 3, zoom: 2.3 }, 1100], [{ dish: 1 }, 900], [{ gr: 1 }, 2800]],
        pills: [['خلايا جذعيّة معزولة في المختبر', TEAL, () => DC.clone().add(DISH[0]).setY(DY + 0.2), -150, -110],
                ['تنمية أنسجة جديدة', PNK, () => DC.clone().add(DISH[9]).setY(DY + 0.1), -170, 60]] },
    ],
    setup(ctx) {
      const sc = ctx.scene;
      const gCell = new THREE.SphereGeometry(1, 24, 18), gNuc = new THREE.SphereGeometry(1, 12, 10);
      const matNuc = M(0x5A4A6A, { roughness: 0.5 });
      const cell = (c, op) => { const m = trans(c, op === undefined ? 1 : op, { roughness: 0.5 }); m.depthWrite = true; const o = new THREE.Mesh(gCell, m); o.castShadow = true; o.receiveShadow = true; sc.add(o); const nu = new THREE.Mesh(gNuc, matNuc); sc.add(nu); return { o, nu, m }; };
      // خليَّة المثال وبنتاها
      O.demo = [cell(C_STEM), cell(C_STEM)];
      // البويضة/الزيجوت وخلايا الجنين (16)
      O.emb = F16.map(() => cell(C_TOTI));
      O.shell = ctx.blob(C_PLAC, 0); O.shell.position.copy(E); O.shell.scale.setScalar(1.55);
      O.escGlow = ctx.blob(C_PLURI, 0); O.escGlow.position.copy(EC); O.escGlow.scale.setScalar(0.72);
      // الحيوان المنوي: رأس وذيل
      O.sp = new THREE.Group(); sc.add(O.sp);
      const head = new THREE.Mesh(gCell, M(0x5E7FA8, { roughness: 0.4 })); head.scale.set(0.2, 0.12, 0.13); O.sp.add(head);
      const tp = []; for (let k = 0; k <= 16; k++) { const x = 0.18 + k * 0.08; tp.push(V(x, 0.07 * Math.sin(k * 0.9) * (k / 16 + 0.3), 0)); }
      O.sp.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(tp), 40, 0.028, 8, false), M(0x7A93B5, { roughness: 0.5 })));
      // قواعد الأنسجة وخلاياها
      O.pads = PADS.map(P => {
        const base = new THREE.Mesh(new THREE.CylinderGeometry(P.R, P.R, PH, 40), trans(P.col, 0)); base.position.copy(P.c).add(V(0, PH / 2, 0)); base.receiveShadow = true; sc.add(base);
        const cells = P.slots.map((s, j) => {
          const e = cell(P.stem.includes(j) ? C_PLURI : C_PLURI);
          e.halo = P.stem.includes(j) ? ctx.blob(C_MULTI, 0) : null;
          if (P.proc && !P.stem.includes(j)) { e.proc = [0, 1, 2, 3].map(q => { const r = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, 1, 6), e.m); sc.add(r); return r; }); }
          return e;
        });
        return { base, cells };
      });
      O.newS = NEWS.map(() => cell(C_MULTI));
      O.m1 = cell(C_MULTI);
      // الوعاء الدموي
      const vp = []; for (let x = VX0; x >= VX1 - 0.01; x -= 0.5) vp.push(V(x, VY + 0.05 * Math.sin(x * 0.8), VZ + 0.1 * Math.sin(x * 0.6)));
      O.vessel = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(vp), 60, 0.5, 18, false), trans(0xE58B8B, 0));
      sc.add(O.vessel);
      O.link = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([0, 0.25, 0.5, 0.75, 1].map(u => bez(BLOOD_C, u))), 24, 0.16, 10, false), trans(0xE58B8B, 0));
      sc.add(O.link);
      // خلايا الدم
      const matR = M(C_RBC, { roughness: 0.45 }), matW = M(C_WBC, { roughness: 0.5 }), matWN = M(C_WNUC, { roughness: 0.45 });
      O.blood = BT.map(t => {
        const o = new THREE.Mesh(gCell, t === 'R' ? matR : matW); o.castShadow = true; sc.add(o);
        const nu = []; if (t === 'M') nu.push(new THREE.Mesh(gNuc, matWN)); if (t === 'L') nu.push(new THREE.Mesh(gNuc, matWN)); if (t === 'N') for (let q = 0; q < 3; q++) nu.push(new THREE.Mesh(gNuc, matWN));
        nu.forEach(n => sc.add(n)); return { o, nu, t };
      });
      // طبق المختبر وخلاياه
      O.dish = new THREE.Mesh(new THREE.CylinderGeometry(1.32, 1.32, 0.22, 48, 1, true), trans(0x9CC3D8, 0.4, { side: THREE.DoubleSide }));
      O.dishB = new THREE.Mesh(new THREE.CylinderGeometry(1.32, 1.32, 0.03, 48), trans(0xBFD9E6, 0.5));
      O.dish.position.copy(DC).setY(Y0 + 0.11); O.dishB.position.copy(DC).setY(Y0 + 0.02); sc.add(O.dish); sc.add(O.dishB);
      O.lab = DISH.map(() => cell(C_STEM));
    },
    rebuild(s, ctx) {
      S = s; if (S.br <= 0) return;
      const mat = O.brMat || (O.brMat = M(0xA9D99A, { roughness: 0.45 }));
      ORDER.forEach((k, n) => {
        const g = sm(cl(S.br * 1.35 - n * 0.08)); if (g < 0.03) return;
        const pts = []; for (let q = 0; q <= 14; q++) pts.push(bez(BR[k], g * q / 14));
        ctx.tubePts(pts, 0.075, mat);
      });
    },
    place(s) {
      S = s;
      const show = (e, p, sx, sy, sz, nucS) => { e.o.visible = true; e.o.position.copy(p); e.o.scale.set(sx, sy, sz); if (e.nu) { e.nu.visible = nucS > 0; e.nu.position.copy(p).add(V(0, sy * 0.8, 0)); e.nu.scale.setScalar(nucS || 0.01); } };
      const hide = e => { e.o.visible = false; if (e.nu) e.nu.visible = false; if (e.proc) e.proc.forEach(r => r.visible = false); if (e.halo) e.halo.visible = false; };
      // ── خليَّة المثال ──
      const dz = 1 - sm(S.dz);
      if (dz <= 0.02) O.demo.forEach(hide);
      else {
        const a = sm(cl(S.dm / 0.5)), b = sm(cl((S.dm - 0.5) / 0.5)), sep = 0.9 * a, r = lerp(0.75, 0.58, a);
        show(O.demo[0], DM.clone().add(V(sep, 0, 0)), r * dz, r * dz, r * dz, 0.16 * dz);
        const pB = DM.clone().add(V(-sep - 0.35 * b, -0.18 * b, 0));
        show(O.demo[1], pB, lerp(r, 1.25, b) * dz, lerp(r, 0.36, b) * dz, lerp(r, 0.4, b) * dz, 0.13 * dz);
        O.demo[1].m.color.copy(K.stem).lerp(K.musc, b); O.demo[0].m.color.copy(K.stem);
      }
      // ── الحيوان المنوي ──
      const u = cl(S.sp / 0.7), w = cl((S.sp - 0.7) / 0.3);
      O.sp.visible = S.sp > 0 && w < 1;
      if (O.sp.visible) {
        const p = SP0.clone().lerp(SPC, sm(u)); p.y += 0.25 * Math.sin(Math.PI * u);
        const dir = SPC.clone().sub(SP0).normalize(); O.sp.position.copy(p.lerp(E, 0.3 * sm(w)));
        O.sp.quaternion.setFromUnitVectors(V(-1, 0, 0), dir); O.sp.scale.setScalar(1 - sm(w));
      }
      // ── الزيجوت والجنين ──
      const fert = sm(cl((S.sp - 0.72) / 0.28));
      F16.forEach((_, i) => {
        const e = O.emb[i], q = embState(i);
        if (!q) { hide(e); return; }
        const p = E.clone().add(q.p), pu = sm(S.pl), T = EMB_T[i];
        show(e, p, q.r, q.r * (T.esc ? 1 : lerp(1, 0.75, pu)), q.r, q.r * 0.3);
        if (S.cv <= 0) e.m.color.copy(K.egg).lerp(K.toti, fert); else e.m.color.copy(K.toti);
        if (pu > 0) e.m.color.lerp(T.esc ? K.pluri : K.plac, pu);
        const op = T.esc ? 1 : lerp(1, 0.55, pu); e.m.opacity = op; e.m.depthWrite = op > 0.99;
      });
      O.shell.material.opacity = 0.12 * sm(S.pl); O.shell.visible = S.pl > 0.02;
      O.escGlow.material.opacity = 0.22 * sm(S.pl) * (1 - 0.5 * sm(S.ad)); O.escGlow.visible = S.pl > 0.02;
      // ── التمايز إلى الأنسجة ──
      const dif = S.dif;
      PADS.forEach((P, k) => {
        const ent = O.pads[k], n = ORDER.indexOf(k);
        ent.base.material.opacity = 0.55 * sm(cl((dif - n * 0.1) / 0.5)); ent.base.visible = dif > 0;
        P.slots.forEach((s0, j) => {
          const e = ent.cells[j], isStem = P.stem.includes(j);
          const uu = sm(cl((dif * 1.75 - n * 0.11 - j * 0.035) / 0.6));
          if (uu <= 0) { hide(e); return; }
          const tgt = slotPos(P, j, isStem ? STEM_SH : P.sh), Bk = BR[k];
          let p, mo = sm(cl((uu - 0.8) / 0.2));
          if (uu < 0.8) p = bez(Bk, uu / 0.8); else p = Bk.b.clone().lerp(tgt, mo);
          const sh = isStem ? STEM_SH : P.sh;
          let sx = lerp(0.26, sh[0], mo), sy = lerp(0.26, sh[1], mo), sz = lerp(0.26, sh[2], mo);
          // بعد الدخول: الخلايا الجذعيَّة لدى البالغ أصغر قليلاً، والتالفة في نخاع العظم تنكمش
          let dm = 0; if (k === 4 && DMG.includes(j)) dm = sm(S.dmg) * (1 - sm(cl((S.tx - 0.35) / 0.65)));
          const ss = (isStem ? 1 - 0.12 * sm(S.ad) : 1) * (1 - 0.25 * dm);
          show(e, p, sx * ss, sy * ss, sz * ss, (isStem ? 0.09 : 0.08) + 0.02 * (1 - mo));
          if (P.spin) e.o.rotation.y = -(Math.atan2(P.slots[j].z, P.slots[j].x) + Math.PI / 2) * mo; else e.o.rotation.y = 0;
          if (isStem) e.m.color.copy(K.pluri).lerp(K.multi, sm(S.ad));
          else { e.m.color.copy(K.pluri).lerp(P.cc, sm(cl((uu - 0.5) / 0.5))); if (dm > 0) e.m.color.lerp(K.dmg, dm); }
          if (e.halo) { e.halo.visible = S.ad > 0.02; e.halo.position.copy(p); e.halo.scale.setScalar(0.42); e.halo.material.opacity = 0.28 * sm(S.ad); }
          if (e.proc) e.proc.forEach((r, q) => {
            const a = q * Math.PI / 2 + j, f = mo; r.visible = f > 0.05;
            const d = V(Math.cos(a), 0.15, Math.sin(a)).normalize(), L0 = 0.42 * f;
            r.position.copy(p).addScaledVector(d, 0.18 + L0 / 2); r.scale.set(1, L0, 1); r.quaternion.setFromUnitVectors(V(0, 1, 0), d);
          });
        });
      });
      // ── مضاعفة أعداد الخليَّة الجذعيَّة في نخاع العظم ──
      if (S.bm <= 0) hide(O.m1);
      else { const b = sm(S.bm), p = M0.clone().lerp(M1, b); p.y += 0.25 * Math.sin(Math.PI * b); const r = 0.24 * (0.6 + 0.4 * b) * (1 - 0.12 * sm(S.ad)); show(O.m1, p, r, r * 0.92, r, 0.09); O.m1.m.color.copy(K.multi); }
      // ── الوعاء وخلايا الدم ──
      const vop = sm(cl(S.bm * 2)); O.vessel.material.opacity = 0.32 * vop; O.link.material.opacity = 0.32 * vop; O.vessel.visible = O.link.visible = S.bm > 0;
      placeBlood();
      // ── الزراعة: خلايا جذعيَّة بالغة جديدة تنزل إلى نخاع العظم ──
      O.newS.forEach((e, i) => {
        const t = sm(cl((S.tx - i * 0.12) / 0.6)); if (S.tx <= 0 || t <= 0) { hide(e); return; }
        const p = NEWS[i].clone(); p.y += 4.2 * (1 - t); const r = 0.22; show(e, p, r, r * 0.92, r, 0.09); e.m.color.copy(K.multi);
      });
      // ── طبق المختبر ──
      const ds = sm(S.dish); O.dish.visible = O.dishB.visible = S.dish > 0.01;
      O.dish.scale.setScalar(Math.max(0.01, ds)); O.dishB.scale.setScalar(Math.max(0.01, ds));
      const ng = 2 + sm(S.gr) * (DISH.length - 2);
      O.lab.forEach((e, k) => {
        if (S.dish <= 0.6) { hide(e); return; }
        const f = k < 2 ? sm(cl((S.dish - 0.6) / 0.4)) : sm(cl(ng - k));
        if (f <= 0) { hide(e); return; }
        const tgt = DC.clone().add(DISH[k]).setY(DY), src = k < 2 ? tgt : DC.clone().add(DISH[DPAR[k]]).setY(DY);
        const p = src.clone().lerp(tgt, f), r = 0.27 * (0.6 + 0.4 * f);
        show(e, p, r, r * (k < 2 ? 0.85 : 0.6), r, 0.09);
        if (k < 2) e.m.color.copy(K.stem); else e.m.color.copy(K.stem).lerp(K.lab, f);
      });
    },
    idle(t, s, ctx, tweening) {
      S = s;
      // نبض خفيف لهالات الخلايا الجذعيَّة لدى البالغ
      if (S.ad > 0.5) O.pads.forEach(pd => pd.cells.forEach(e => { if (e.halo && e.halo.visible) e.halo.material.opacity = 0.2 + 0.12 * Math.sin(t * 2.4); }));
      // جريان مستمرٌّ لخلايا الدم بعد خطوة التعويض
      if (!tweening && S.fl >= 0.999) { flT = (t * 0.06) % 1; placeBlood(); } else if (S.fl < 0.999) flT = 0;
    },
  };
  function placeBlood() {
    O.blood.forEach((e, i) => {
      const q = (S.bl > 0 || S.fl > 0) ? bloodPos(i, bPhi(i)) : null;
      if (!q || q.s <= 0.01) { e.o.visible = false; e.nu.forEach(n => n.visible = false); return; }
      e.o.visible = true; const p = q.p, s = q.s;
      if (e.t === 'R') { e.o.position.copy(p); e.o.scale.set(0.27 * s, 0.1 * s, 0.27 * s); e.o.rotation.set(0.9 + 0.4 * Math.sin(i), i * 0.7, 0.3 * Math.cos(i)); e.nu.forEach(n => n.visible = false); return; }
      const r = (e.t === 'M' ? 0.3 : e.t === 'N' ? 0.27 : 0.21) * s;
      e.o.position.copy(p); e.o.scale.setScalar(r); e.o.rotation.set(0, 0, 0);
      e.nu.forEach((n, q2) => {
        n.visible = true;
        if (e.t === 'M') { n.position.copy(p).add(V(0, r * 0.62, 0)); n.scale.set(r * 0.62, r * 0.42, r * 0.42); }
        else if (e.t === 'L') { n.position.copy(p).add(V(0, r * 0.35, 0)); n.scale.setScalar(r * 0.78); }
        else { n.position.copy(p).add(V((q2 - 1) * r * 0.42, r * 0.72, (q2 === 1 ? -0.12 : 0.08) * r)); n.scale.setScalar(r * 0.3); }
      });
    });
  }
})();
