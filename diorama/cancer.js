/* ديوراما: مراحل تطوُّر السرطان (الشكل ٤-٥) — الدرس ٤-٦ (كتاب الطالب ص ١٣٩–١٤١) */
(function () {
  const { V, sm, M, CSS } = DioramaCore;
  const { BLU, RED, GLD, TEAL, GRY, GRN, ORG, PUR } = CSS;
  let S;
  const O = {};

  // ── شبه عشوائي ثابت (حتى تتطابق اللقطات) ──
  let seed = 7;
  const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const cl = (x) => Math.min(1, Math.max(0, x));

  // ── هندسة المشهد: النسيج الأصلي يميناً (+x) و«أجزاء أخرى من الجسم» يساراً (−x) ──
  const TOP = 1.45, CY = 1.83;                                          // سطح النسيج تحت الخلايا، ومركز صفِّ الخلايا
  const PRI = { x0: -1.5, x1: 9.5 }, OTH = { x0: -9.5, x1: -5.0 };     // قطعتا النسيج
  const BV = { y: 0.98, z: 3.05, r: 0.3 }, LV = { y: 0.3, z: 2.95, r: 0.26 };   // الوعاء الدموي والوعاء اللمفاوي (على طول x)
  const CT = V(4.0, CY, 1.0);                                             // الخليَّة التي تتعرَّض للطفرة = مركز الورم
  const SEC = [V(-7.0, CY, 2.0), V(-8.0, CY, 0.0)];                   // مواضع السرطانات الثانويَّة
  const BEN = V(8.0, CY + 0.15, -1.6);                                  // الورم الحميد (للمقارنة)

  // خلايا النسيج (شبكة 1×1)
  const CELLS = [];
  for (let x = PRI.x0 + 0.5; x < PRI.x1; x += 1) for (let z = -3; z <= 3; z += 1) CELLS.push({ p: V(x, CY, z), oth: false, tgt: Math.abs(x - CT.x) < 0.01 && z === CT.z });
  for (let x = OTH.x0 + 0.5; x < OTH.x1; x += 1) for (let z = -3; z <= 3; z += 1) CELLS.push({ p: V(x, CY, z), oth: true, tgt: false });

  // خلايا الورم: مواقع داخل مجسَّم بيضوي حول CT، مرتَّبة بالبعد عن الخليَّة الأولى، ولكلٍّ «أمٌّ» أقرب منها
  const TUM = [{ p: CT.clone(), r: 0.42, par: -1, j: V(0, 0, 0) }];
  (function () {
    const cand = [], s = 0.56;
    for (let ix = -4; ix <= 4; ix++) for (let iy = -3; iy <= 3; iy++) for (let iz = -4; iz <= 4; iz++) {
      const p = V(CT.x + ix * s + (rnd() - 0.5) * 0.14, CT.y + 0.12 + iy * s * 0.9 + (rnd() - 0.5) * 0.1, CT.z + iz * s + (rnd() - 0.5) * 0.14);
      const d = Math.pow((p.x - CT.x) / 1.75, 2) + Math.pow((p.y - CT.y - 0.12) / 1.15, 2) + Math.pow((p.z - CT.z) / 1.45, 2);
      if (d <= 1 && p.y > 0.25 && p.distanceTo(CT) > 0.3) cand.push({ p, d: d + rnd() * 0.12 });
    }
    cand.sort((a, b) => a.d - b.d);
    cand.slice(0, 64).forEach(c => {
      let best = 0, bd = 1e9; TUM.forEach((t, k) => { const q = t.p.distanceTo(c.p); if (q < bd) { bd = q; best = k; } });
      TUM.push({ p: c.p, r: 0.27 + rnd() * 0.07, par: best, j: V(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5) });
    });
  })();
  const NT = TUM.length;

  // تكوين الأوعية الجديدة نحو الورم: [من الوعاء، إلى الورم، انحناء]
  const BR = [
    { a: V(5.3, BV.y, BV.z), b: V(4.5, 1.2, 1.9), k: V(0.35, 0.15, 0), lym: false },
    { a: V(2.8, BV.y, BV.z), b: V(3.4, 1.2, 1.9), k: V(-0.35, 0.15, 0), lym: false },
    { a: V(4.05, BV.y, BV.z), b: V(4.0, 1.05, 2.0), k: V(0.15, 0.1, 0), lym: false },
    { a: V(5.0, LV.y, LV.z), b: V(4.35, 0.95, 1.5), k: V(0.35, -0.1, 0.2), lym: true },
    { a: V(3.0, LV.y, LV.z), b: V(3.7, 0.95, 1.5), k: V(-0.35, -0.1, 0.2), lym: true },
  ];
  const bez = (B, u) => { const m = B.a.clone().lerp(B.b, 0.5).add(B.k); const a = B.a.clone().lerp(m, u), b = m.clone().lerp(B.b, u); return a.lerp(b, u); };

  // خلايا تنفصل من الورم: [فرع الدخول، نهاية المسار في الوعاء، الورم الثانوي]
  const MIG = [
    { br: 0, xe: -6.7, sec: 0, d0: 0.0, lym: false },
    { br: 1, xe: -7.3, sec: 0, d0: 0.25, lym: false },
    { br: 3, xe: -8.0, sec: 1, d0: 0.12, lym: true },
  ];
  // خلايا الأورام الثانويَّة والورم الحميد
  const SECC = SEC.map(c => { const a = []; for (let k = 0; k < 8; k++) { const th = k * 2.4, rr = k === 0 ? 0 : 0.32 + 0.12 * (k % 3); a.push({ p: V(c.x + rr * Math.cos(th), c.y + (k === 0 ? 0.05 : 0.18 * (k % 2)) + 0.05, c.z + rr * Math.sin(th)), r: 0.25 + rnd() * 0.06 }); } return a; });
  const BENC = []; for (let k = 0; k < 11; k++) { const th = k * 2.4, rr = k === 0 ? 0 : 0.34 + 0.12 * (k % 3); BENC.push({ p: V(BEN.x + rr * Math.cos(th), BEN.y + (k < 4 ? 0.0 : 0.3) + 0.05 * (k % 2), BEN.z + rr * Math.sin(th)), r: 0.3 }); }

  // ألوان هادئة
  const C_NORM = 0xE2CDA0, C_OTH = 0xC9D6E2, C_CAN = 0x8E73A8, C_BEN = 0x9DBB98, C_BV = 0xC46A66, C_LV = 0xE2C760;
  const matNorm = M(C_NORM, { roughness: 0.7 }), matOth = M(C_OTH, { roughness: 0.7 }), matNuc = M(0x7A5A3A, { roughness: 0.5 }), matNucO = M(0x55708C, { roughness: 0.5 });
  const matCan = [M(C_CAN, { roughness: 0.55 }), M(0x9A7FB3, { roughness: 0.55 }), M(0x7F6699, { roughness: 0.55 })], matNucC = M(0x4A3560, { roughness: 0.45 });
  const matMig = M(0x6E4E92, { roughness: 0.4, emissive: 0x2A1640 }), matBen = M(C_BEN, { roughness: 0.6 }), matNucB = M(0x55704F, { roughness: 0.5 });
  const trans = (c, op) => { const m = new THREE.MeshStandardMaterial({ color: c, transparent: true, opacity: op, roughness: 0.35, depthWrite: false }); m.color.convertSRGBToLinear(); return m; };
  const matBV = trans(C_BV, 0.42), matLV = trans(C_LV, 0.45), matBVs = M(C_BV, { roughness: 0.45 }), matLVs = M(C_LV, { roughness: 0.45 });
  const matTgt = M(C_NORM, { roughness: 0.6 }), cN = matTgt.color.clone(), cC = M(C_CAN).color.clone();
  const matFib = M(0x8A8F96, { roughness: 0.4, metalness: 0.2 });

  // الألياف (الأسبستوس) تسقط على سطح النسيج؛ الأولى تصيب الخليَّة CT
  const FY = CY + 0.43, FIB = [[CT.clone().add(V(0.05, 0.42, 0.05)), 0.6, 0], [V(2.6, FY, 2.2), -0.9, 0.08], [V(5.3, FY, 0.1), 1.1, 0.14], [V(3.2, FY, -0.8), 0.2, 0.2], [V(5.1, FY, 2.6), -0.4, 0.1]];
  const NB = [V(1, 0, 0), V(-1, 0, 0), V(0, 0, 1), V(0, 0, -1), V(1, 0, -1), V(-1, 0, 1)].map(d => CT.clone().add(d).add(V(0, 0.38, 0)));

  // ── مواضع الأجسام بحسب الحالة ──
  function tumPos(k) {                                                  // موضع خليَّة الورم k ومقياسها (null إن لم تظهر)
    if (k === 0) return S.mut > 0 || S.n >= 1 ? { p: CT.clone(), s: 1 } : null;
    const f = cl(S.n - k); if (f <= 0) return null;
    const u = sm(f), par = TUM[TUM[k].par].p;
    return { p: par.clone().lerp(TUM[k].p, u), s: 0.55 + 0.45 * u };
  }
  function migPos(i) {                                                  // الخليَّة المنفصلة i
    const m = MIG[i], B = BR[m.br], vy = m.lym ? LV.y : BV.y, vz = m.lym ? LV.z : BV.z;
    const d = cl((S.det - m.d0) / (1 - 0.25));
    if (d <= 0) return null;
    if (S.sec > 0) {                                                    // الخروج من الوعاء إلى النسيج الآخر
      const u = sm(cl(S.sec * 2.2)), A = V(m.xe, vy, vz), Bp = SECC[m.sec][m.lym ? 0 : (i === 0 ? 0 : 1)].p;
      if (u >= 1) return null;
      const p = A.clone().lerp(Bp, u); p.y += Math.sin(Math.PI * u) * 0.4; return { p, s: 0.8 + 0.2 * u };
    }
    if (S.trav > 0) { const t = sm(cl((S.trav - m.d0 * 0.4) / 0.9)); return { p: V(B.a.x + (m.xe - B.a.x) * t, vy, vz), s: 0.8 }; }
    const u = sm(d);
    if (u < 0.75) return { p: bez(B, 1 - u / 0.75), s: 1 - 0.2 * (u / 0.75) };
    return { p: B.a.clone().add(V(0, 0, 0)), s: 0.8 };
  }
  const secN = () => cl((S.sec - 0.45) / 0.55) * 8;

  window.DIORAMA = {
    id: 'cancer', title: 'مراحل تطوُّر السرطان',
    subtitle: 'الأحياء — الصف الحادي عشر — الوحدة الرابعة: دورة الخليَّة والانقسام المتساوي',
    source: 'النص من كتاب الطالب: ٤-٦ السرطانات (ص ١٣٩–١٤١) والشكل ٤-٥ مراحل تطوّر السرطان',
    legend: [['#E2CDA0', 'خلايا'], ['#8E73A8', 'خلايا سرطانيّة'], ['#9DBB98', 'ورم حميد'], null,
             ['#C46A66', 'أوعية دمويّة', 'tube'], ['#E2C760', 'أوعية لمفاويّة', 'tube'], ['#8A8F96', 'الأسبستوس', 'tube']],
    camera: { VH: 13.6, center: [0.0, 0.9, 0.4], elevation: 34, azimuth: 24 },
    base: { L: 21, W: 8.6, x: 0 },
    BASE: { el: 34, az: 24, fo: 0, fib: 0, mut: 0, sig: 0, n: 0, irr: 0, ang: 0, det: 0, trav: 0, sec: 0, ben: 0 },
    noGeom: ['el', 'az', 'fo', 'fib', 'mut', 'sig', 'n', 'irr', 'det', 'trav', 'sec', 'ben'],
    // نقطة التركيز: 0 المشهد، 1 الخليَّة/الورم، 2 دخول الخلايا الأوعية، 3 السرطانات الثانويَّة
    focus(s) {                                                          // fo كسري: تنتقل الكاميرا بسلاسة بين نقاط التركيز
      S = s; const F = [V(0.0, 0.9, 0.4), CT.clone().add(V(0, 0.3, 0)), V(4.2, 1.1, 2.5), V(-7.4, 1.3, 1.4)];
      const f = Math.min(F.length - 1, Math.max(0, S.fo || 0)), i = Math.floor(f), w = f - i;
      return i >= F.length - 1 ? F[i].clone() : F[i].clone().lerp(F[i + 1], w);
    },
    STEPS: [
      { t: 'نسيج سليم',
        p: 'السرطان هو الاسم الذي يطلق على مجموعة من الأمراض التي تنتج من الانقسام غير المنضبط للخلايا. يبدأ السرطان بطفرة جينية تصيب الجينات التي تتحكم في انقسام الخلايا.',
        seq: [[{}, 0]],
        pills: [['الخلايا', ORG, () => V(6, CY + 0.4, -2), 60, -110], ['أوعية دمويّة', RED, () => V(8.6, BV.y, BV.z), 40, 90],
                ['أوعية لمفاويّة', GLD, () => V(0.6, LV.y, LV.z + 0.2), -60, 90], ['أجزاء أخرى من الجسم', BLU, () => V(-7.25, CY + 0.4, -2.5), 0, -110]] },
      { t: 'مادة مسرطنة تُحدث طفرة',
        p: 'يمكن أن تحدث هذه الطفرات الجينية أثناء عمليّة تضاعف الكروموسومات عند التعرّض لمادة مسرطنة، أو وراثتها. يسمّى العامل الذي يسبب السرطان، مثل الأسبستوس، مادة مسرطنة <span class="ltr">Carcinogen</span>. إحداث طفرات نتيجة التعرض لمواد مسرطنة، مثل: الأشعة فوق البنفسجيّة، القطران في دخان التبغ، الأسبستوس، الأشعة السينيّة.',
        n: 'تُعرض ألياف الأسبستوس مثالاً واحداً من المواد المسرطنة الأربع في الشكل ٤-٥.',
        seq: [[{ '!fo': 1, zoom: 2.3 }, 900], [{ fib: 1 }, 1900], [{ mut: 1 }, 1600]],
        pills: [['الأسبستوس', GRY, () => FIB[2][0].clone(), 90, -90], ['تتغيّر الجينات الورميّة بفعل المواد المسرطنة', PUR, () => CT.clone().add(V(0, 0.3, 0)), -150, 110]] },
      { t: 'لا تستجيب للإشارات وتواصل الانقسام',
        p: 'لا تستجيب الخليّة السرطانيّة للإشارات من الخلايا الأخرى، بل تواصل الانقسام. يزيل جهاز المناعة في الجسم غالبًا الخلايا التي تحتوي على <span class="ltr">DNA</span> تالف، أو تصبح الخلايا الطافرة غير قادرة على البقاء على قيد الحياة. ومع ذلك، فالخلايا الطافرة يمكنها أحيانًا أن تستمر بالانقسام والنمو.',
        seq: [[{ sig: 1 }, 1600], [{ n: 2 }, 1000], [{ n: 4 }, 1400]],
        pills: [['الإشارات من الخلايا الأخرى', TEAL, () => NB[3].clone(), 150, -90], ['انقسام متساوٍ', PUR, () => CT.clone().add(V(0, 0.35, 0)), -130, 100]] },
      { t: 'كتلة من الخلايا تسمَّى الورم',
        p: 'ولأن الطفرة تصيب الجينات التي تتحكم في انقسام الخلايا، فسوف ينتج من الانقسام المتساوي اللاحق غير المنضبط كتلة من الخلايا غير المتخصصة، تسمّى الورم. وإلى حين اكتشاف وجود الورم يكون قد احتوى على مليار خليّة سرطانيّة تقريبًا. يكبر الورم، فتغيّر الخلايا خصائصها وتبدو من خلال المجهر مختلفة.',
        n: 'يُعرض بضع عشرات من الخلايا للتوضيح.',
        seq: [[{ zoom: 1.7 }, 700], [{ n: 16 }, 1600], [{ n: NT, irr: 1 }, 2400]],
        pills: [['انقسام متساوٍ سريع', PUR, () => CT.clone().add(V(0.6, 1.0, 0.4)), -170, -70], ['كتلة من الخلايا غير المتخصصة، تسمّى الورم', PUR, () => CT.clone().add(V(-0.8, 0.5, 1.0)), 120, 120]] },
      { t: 'يُزوَّد الورم بأوعية دمويَّة ولمفاويَّة',
        p: 'يزوّد الورم بأوعية دمويّة ولمفاويّة.',
        seq: [[{ zoom: 2.0, el: 9, fo: 2 }, 1300], [{ ang: 1 }, 2800]],
        pills: [['أوعية دمويّة', RED, () => bez(BR[0], 0.5), 160, 70], ['أوعية لمفاويّة', GLD, () => bez(BR[4], 0.45), -150, -60]] },
      { t: 'خلايا تنفصل وتدخل الدم واللمف',
        p: 'تنتشر الخلايا الورميّة في الدم واللمف إلى أجزاء أخرى من الجسم. إذ تنقسم بعض الخلايا بشكل غير منضبط وتشكّل أورامًا، قد تنفصل عنها خلايا تنتقل وتكوّن أورامًا في مناطق أخرى في الجسم (ورم ثانوي خبيث).',
        seq: [[{ zoom: 2.5 }, 700], [{ det: 1 }, 2800]],
        pills: [['تنفصل خلايا من الورم', PUR, () => { const q = migPos(0); return q ? q.p : BR[0].b.clone(); }, 160, 90], ['في الدم', RED, () => V(5.9, BV.y, BV.z), 120, -40], ['في اللمف', GLD, () => V(5.4, LV.y, LV.z), 120, -70]] },
      { t: 'الانتشار وتكوُّن السرطانات الثانويَّة',
        p: 'الانتشار <span class="ltr">(Metastasis)</span>. تغزو الخلايا الورميّة أنسجة أخرى، فتتكوّن السرطانات الثانوية في أجزاء مختلفة من الجسم.',
        n: 'تُعرض «الأجزاء الأخرى من الجسم» قطعةَ نسيج على طرف اللوح للتوضيح.',
        seq: [[{ zoom: 1, el: 34 }, 900], [{ trav: 1 }, 2400], [{ '!fo': 3, zoom: 1.9 }, 800], [{ sec: 1 }, 1900]],
        pills: [['السرطانات الثانوية', PUR, () => SEC[0].clone().add(V(0, 0.3, 0)), 130, -110], ['أنسجة أخرى', BLU, () => V(-5.6, CY + 0.3, 2.6), 150, 70]] },
      { t: 'الورم الحميد والورم الخبيث',
        p: 'يمكن أن تكون الأورام حميدة <span class="ltr">Benign</span> وغير سرطانيّة، أو خبيثة <span class="ltr">Malignant</span> وسرطانيّة. الأورام الحميدة أورام بطيئة النمو وذات حدود واضحة المعالم. أما الأورام الخبيثة فلها سلوك مختلف، إذ تظهر الخلايا السرطانيّة عادة تغيّرات غير طبيعيّة كما في الصورة ٤-٩، ويمكن لخلايا حواف (أطراف) الأورام الخبيثة أن تنفصل وتنتشر من مكان المنشأ إلى أجزاء أخرى في الجسم لتغزو الخلايا.',
        n: 'يُعرض ورم حميد بجانب الورم الخبيث للمقارنة فقط.',
        seq: [[{ zoom: 1 }, 900], [{ ben: 1 }, 2200]],
        pills: [['ورم حميد: حدود واضحة المعالم', GRN, () => BEN.clone().add(V(0, 0.75, 0)), 60, -120], ['ورم خبيث', PUR, () => CT.clone().add(V(0, 1.2, 0)), -60, -120],
                ['السرطانات الثانوية', PUR, () => SEC[0].clone().add(V(0, 0.3, 0)), 90, -100]] },
    ],
    setup(ctx) {
      const sc = ctx.scene, add = (g, m, p) => ctx.mesh(g, m, p);
      // ── النسيج تحت الخلايا: لوحان شبه شفَّافين ──
      const slabH = TOP + 0.3;
      [[PRI, 0xF0D2CF], [OTH, 0xE6DCEC]].forEach(([R, c]) => {
        const o = new THREE.Mesh(new THREE.BoxGeometry(R.x1 - R.x0, slabH, 7.2), trans(c, 0.42)); o.position.set((R.x0 + R.x1) / 2, slabH / 2 - 0.3, 0); o.receiveShadow = true; sc.add(o);
      });
      // ── الوعاء الدموي والوعاء اللمفاوي ──
      const vessel = (Y, Z, r, m) => { const pts = []; for (let x = 10.2; x >= -10.2; x -= 0.6) pts.push(V(x, Y + 0.04 * Math.sin(x * 0.9), Z + 0.12 * Math.sin(x * 0.55))); const o = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 80, r, 16, false), m); sc.add(o); return o; };
      vessel(BV.y, BV.z, BV.r, matBV); vessel(LV.y, LV.z, LV.r, matLV);
      // ── خلايا النسيج: «وسائد» متلاصقة ونواة ظاهرة أعلاها ──
      const gCell = new THREE.SphereGeometry(1, 22, 16), gNuc = new THREE.SphereGeometry(1, 12, 10);
      O.cells = CELLS.map(c => {
        const o = new THREE.Mesh(gCell, c.tgt ? matTgt : (c.oth ? matOth : matNorm)); o.position.copy(c.p); o.scale.set(0.49, 0.38, 0.49); o.castShadow = o.receiveShadow = true; sc.add(o);
        const nu = new THREE.Mesh(gNuc, c.oth ? matNucO : matNuc); nu.position.copy(c.p).add(V(0, 0.31, 0)); nu.scale.setScalar(0.1); sc.add(nu);
        return { o, nu, c };
      });
      O.tgt = O.cells.find(e => e.c.tgt);
      O.halo = ctx.blob(0xB89BD0, 0.0); O.halo.position.copy(CT); O.halo.scale.set(0.8, 0.62, 0.8);
      // ── خلايا الورم (الأولى هي الخليَّة الطافرة نفسها) ──
      O.tum = TUM.map((t, k) => {
        if (k === 0) return null;
        const o = new THREE.Mesh(gCell, matCan[k % 3]); o.castShadow = true; sc.add(o);
        const nu = new THREE.Mesh(gNuc, matNucC); sc.add(nu); return { o, nu };
      });
      O.mig = MIG.map((m, i) => { const o = new THREE.Mesh(gCell, matMig); sc.add(o); const nu = new THREE.Mesh(gNuc, matNucC); sc.add(nu); return { o, nu }; });
      O.sec = SECC.map(a => a.map(() => { const o = new THREE.Mesh(gCell, matCan[0]); o.castShadow = true; sc.add(o); const nu = new THREE.Mesh(gNuc, matNucC); sc.add(nu); return { o, nu }; }));
      O.ben = BENC.map(() => { const o = new THREE.Mesh(gCell, matBen); o.castShadow = true; sc.add(o); const nu = new THREE.Mesh(gNuc, matNucB); sc.add(nu); return { o, nu }; });
      O.cap = ctx.blob(0x8FB58A, 0.0); O.cap.position.copy(BEN).add(V(0, 0.12, 0)); O.cap.scale.set(1.12, 0.85, 1.12);
      // ── ألياف الأسبستوس والإشارات ──
      const gF = new THREE.CylinderGeometry(0.035, 0.035, 0.95, 8);
      O.fib = FIB.map(() => { const o = new THREE.Mesh(gF, matFib); o.castShadow = true; sc.add(o); return o; });
      O.sig = NB.map(() => add(new THREE.SphereGeometry(0.09, 12, 10), M(0x0E8C88, { roughness: 0.3 }), V(0, 0, 0)));
    },
    rebuild(s, ctx) {
      S = s; if (S.ang <= 0) return;
      BR.forEach((B, i) => {
        const g = sm(cl(S.ang * 1.3 - i * 0.07)); if (g < 0.04) return;
        const pts = []; for (let k = 0; k <= 10; k++) pts.push(bez(B, g * k / 10));
        ctx.tubePts(pts, B.lym ? 0.1 : 0.11, B.lym ? matLVs : matBVs);
        if (g > 0.85) { const e = bez(B, 1); ctx.tubePts([e, e.clone().add(V(0.25 * (i % 2 ? 1 : -1), 0.22, B.lym ? 0.12 : -0.12))], 0.06, B.lym ? matLVs : matBVs); }
      });
    },
    place(s) {
      S = s;
      const showC = (e, p, r, sx, sy, sz) => { e.o.visible = e.nu.visible = true; e.o.position.copy(p); e.o.scale.set(r * sx, r * sy, r * sz); e.nu.position.copy(p).add(V(0, r * sy * 0.78, 0)); e.nu.scale.setScalar(r * 0.36); };
      const hideC = e => { e.o.visible = e.nu.visible = false; };
      const occ = [];                                                   // مواضع الخلايا الجديدة (تزيح خلايا النسيج)
      // الخليَّة الطافرة: لونها يتغيَّر
      matTgt.color.copy(cN).lerp(cC, sm(S.mut));
      O.halo.material.opacity = 0.32 * Math.sin(Math.PI * cl(S.mut));
      O.halo.visible = S.mut > 0 && S.mut < 1;
      // خلايا الورم
      const irr = sm(S.irr);
      for (let k = 1; k < NT; k++) {
        const e = O.tum[k], q = tumPos(k);
        if (!q) { hideC(e); continue; }
        const j = TUM[k].j, r = TUM[k].r * q.s;
        showC(e, q.p, r, 1 + 0.35 * irr * j.x, 0.9 + 0.3 * irr * j.y, 1 + 0.35 * irr * j.z);
        occ.push(q.p);
      }
      // الخلايا المنفصلة
      O.mig.forEach((e, i) => { const q = migPos(i); if (!q) { hideC(e); return; } showC(e, q.p, 0.25 * q.s, 1, 1, 1); });
      // السرطانات الثانويَّة
      const sn = S.sec > 0 ? secN() : 0;
      O.sec.forEach((a, si) => a.forEach((e, k) => { const f = cl(sn - k); if (f <= 0) { hideC(e); return; } const c = SECC[si][k]; showC(e, c.p, c.r * (0.5 + 0.5 * sm(f)), 1, 0.92, 1); occ.push(c.p); }));
      // الورم الحميد
      const bn = sm(S.ben) * BENC.length;
      O.ben.forEach((e, k) => { const f = cl(bn - k); if (f <= 0) { hideC(e); return; } const c = BENC[k]; showC(e, c.p, c.r * (0.5 + 0.5 * sm(f)), 1, 0.9, 1); occ.push(c.p); });
      O.cap.visible = S.ben > 0.3; O.cap.material.opacity = 0.3 * sm((S.ben - 0.3) / 0.7);
      // خلايا النسيج: تُزاح حيث تشغل الخلايا الجديدة مكانها
      O.cells.forEach(e => {
        if (e.c.tgt) { e.o.visible = e.nu.visible = true; return; }
        let d = 9; for (const p of occ) { const q = Math.hypot(p.x - e.c.p.x, (p.y - e.c.p.y) * 1.6, p.z - e.c.p.z); if (q < d) d = q; }
        const f = cl((d - 0.25) / 0.4);
        e.o.visible = e.nu.visible = f > 0.05;
        e.o.scale.set(0.49 * f, 0.38 * (0.5 + 0.5 * f), 0.49 * f); e.nu.scale.setScalar(0.1 * f);
      });
      // ألياف الأسبستوس تسقط (وتختفي حين يبدأ الانقسام)
      O.fib.forEach((o, i) => {
        const [end, rot, d0] = FIB[i], u = sm(cl((S.fib - d0) / 0.75));
        o.visible = S.fib > 0 && S.n < 1.5 && S.sig < 0.15;
        o.position.copy(end).add(V(-1.2 * (1 - u), 5.5 * (1 - u), 0.6 * (1 - u)));
        o.rotation.set(Math.PI / 2 - 0.05, rot + 2.5 * (1 - u), 0.1 * i);
      });
      // الإشارات من الخلايا المجاورة تصل ولا تستجيب لها الخليَّة
      O.sig.forEach((o, i) => {
        const u = cl(S.sig * 1.15 - i * 0.03);
        o.visible = S.sig > 0 && S.sig < 1 && u < 0.98;
        const a = NB[i], b = CT.clone().add(V(0, 0.42, 0)), w = sm(u);
        o.position.copy(a.clone().lerp(b, 0.82 * w)); o.position.y += Math.sin(Math.PI * w) * 0.5;
        o.scale.setScalar(1 - Math.max(0, (w - 0.7) / 0.3));
      });
    },
  };
})();
