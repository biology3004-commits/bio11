/* ديوراما: مسار الإفراز — من الشبكة الإندوبلازميَّة الخشنة إلى جهاز جولجي إلى خارج الخليَّة — الدرس ١-٤ (كتاب الطالب ص ٣٦–٣٩) */
(function () {
  const { V, sm, M, COLORS: COL, CSS } = DioramaCore;
  const { BLU, RED, GLD, TEAL, PNK, GRY, GRN, ORG, PUR } = CSS;
  let S, ctxRef;
  const O = {};                                                        // الكائنات الدائمة

  // ── هندسة المشهد (النواة يميناً +x، غشاء سطح الخليَّة يساراً −x) ──
  const NUC = V(7.0, 2.0, -0.8), NR = 2.2;                             // النواة
  const SLABS = [                                                      // أكياس الشبكة الإندوبلازميَّة الخشنة (ألواح رأسيَّة رقيقة)
    { x: 3.9, h: 1.9, d: 4.6 }, { x: 2.7, h: 1.8, d: 4.4 }, { x: 1.5, h: 1.7, d: 4.2 }, { x: 0.3, h: 1.6, d: 4.0 }];
  const TH = 0.22;                                                     // سُمك اللوح
  const SITES = [V(0.3 + TH / 2 + 0.15, 1.25, 0.2), V(0.3 + TH / 2 + 0.15, 1.05, 1.6), V(0.3 + TH / 2 + 0.15, 1.45, -1.2)]; // رايبوسومات تبني البروتين (الوجه المرئي للوح الأخير)
  const FREE = [V(5.2, 0.15, 3.4), V(3.1, 0.15, -3.7), V(-6.2, 0.15, 3.6), V(-1.2, 0.15, -4.0), V(-7.0, 0.15, 0.6), V(6.0, 0.15, -3.4)]; // رايبوسومات حرَّة
  const GX = [-2.0, -2.55, -3.1, -3.65, -4.2, -4.75], GH = [0.9, 1.05, 1.15, 1.15, 1.05, 0.9], GD = [1.5, 1.75, 1.9, 1.9, 1.75, 1.5], GY = 1.5, GZ = 0.0; // أكياس جولجي
  const CIS = GX[0] + 0.17, TRANS = GX[5] - 0.17;                      // طرف التكوُّن (نحو الشبكة) والطرف الآخر (نحو الغشاء)
  const MX = -8.6, MH = 2.6;                                           // غشاء سطح الخليَّة
  const RV = 0.45;                                                     // نصف قطر الحويصلة
  const BUD1 = V(0.3 - TH / 2, 1.3, 1.5);                              // موضع تبرعم الحويصلة من الشبكة
  const V1_END = V(CIS + RV, GY, 1.5);                                 // وصول الحويصلة إلى طرف جولجي
  const P_CIS = V(GX[0], GY, 1.5), P_TRANS = V(GX[5], GY, 1.5);        // مسار البروتين داخل الكومة
  const BUD2 = V(TRANS, GY, 1.5), V2_END = V(MX + 0.06 + RV, GY, 1.0), P_MEM = V(MX, GY, 1.0), P_OUT = V(-10.2, 1.2, 1.6);
  const BUD3 = V(TRANS, 1.2, -1.3), V3_END = V(-6.6, 0.75, -3.4);
  const ENZ = [V(0.12, 0.1, 0.05), V(-0.1, -0.08, 0.12), V(0.05, -0.14, -0.1), V(-0.13, 0.06, -0.08), V(0.0, 0.15, -0.12)];
  const SUG = [V(0.3, 0.1, 0.05), V(-0.28, 0.14, 0.1), V(0.08, 0.3, -0.08), V(-0.1, -0.3, 0.1)];

  const arc = (A, B, u, lift) => { u = sm(u); const p = A.clone().lerp(B, u); p.y += Math.sin(Math.PI * u) * lift; return p; };
  const trans = (c, op) => { const m = new THREE.MeshStandardMaterial({ color: c, transparent: true, opacity: op, roughness: 0.3, depthWrite: false }); m.color.convertSRGBToLinear(); return m; };
  const matRib = M(0x3B4A6B, { roughness: 0.5 }), matProt = M(COL.aa, { roughness: 0.35 }), matSug = M(0xE8B923, { roughness: 0.35 }), matEnz = M(0xC8102E, { roughness: 0.4 });

  // ── مواضع الأجسام المتحرِّكة (دوالُّ في الحالة S) ──
  function ves1() {                                                    // الحويصلة الناقلة من الشبكة إلى جولجي
    if (S.bud1 <= 0) return null;
    const b = sm(S.bud1), p0 = V(BUD1.x - RV * b, BUD1.y, BUD1.z);
    let p = p0, r = RV * b, op = 0.62, sx = 1, syz = 1;
    if (S.mv1 > 0) p = arc(V(BUD1.x - RV, BUD1.y, BUD1.z), V1_END, S.mv1, 0.9);
    if (S.fu1 > 0) { const f = sm(S.fu1); p = V1_END.clone().lerp(V(CIS, GY, 1.5), f * 0.6); sx = 1 - 0.85 * f; syz = 1 + 0.5 * f; op = 0.62 * (1 - f); }
    return { p, r, op, sx, syz, on: S.fu1 < 0.98 };
  }
  function ves2() {                                                    // حويصلة جولجي الإفرازيَّة
    if (S.bud2 <= 0) return null;
    const b = sm(S.bud2);
    let p = V(BUD2.x - RV * b, BUD2.y, BUD2.z), r = RV * b, op = 0.62, sx = 1, syz = 1;
    if (S.mv2 > 0) p = arc(V(BUD2.x - RV, BUD2.y, BUD2.z), V2_END, S.mv2, 1.1);
    if (S.fu2 > 0) { const f = sm(S.fu2); p = V2_END.clone().lerp(V(MX + 0.1, GY, 1.0), f * 0.7); sx = 1 - 0.85 * f; syz = 1 + 0.6 * f; op = 0.62 * (1 - f); }
    return { p, r, op, sx, syz, on: S.fu2 < 0.98 };
  }
  function ves3() {                                                    // حويصلة جولجي التي تصير ليسوسوماً
    if (S.bud3 <= 0) return null;
    const b = sm(S.bud3);
    let p = V(BUD3.x - RV * b, BUD3.y, BUD3.z), r = RV * b, op = 0.62;
    if (S.mv3 > 0) p = arc(V(BUD3.x - RV, BUD3.y, BUD3.z), V3_END, S.mv3, 0.9);
    if (S.lys > 0) { const l = sm(S.lys); r = RV + 0.28 * l; p = V(V3_END.x, V3_END.y + 0.28 * l, V3_END.z); op = 0.62 + 0.18 * l; }
    return { p, r, op, sx: 1, syz: 1, on: true };
  }
  function prot() {                                                    // البروتين المتتبَّع: موضعه ومقياسه عبر المسار كلِّه
    if (S.rel > 0) return { p: arc(P_MEM, P_OUT, S.rel, 0.5), s: 1 };
    if (S.fu2 > 0) { const v = ves2(); return { p: v.p.clone().lerp(P_MEM, sm(S.fu2)), s: 1 }; }
    if (S.bud2 > 0) { const v = ves2(); return { p: v.p.clone(), s: 1 }; }
    if (S.gp > 0) return { p: P_CIS.clone().lerp(P_TRANS, sm(S.gp)).add(V(0, 0.12 * Math.sin(S.gp * 9), 0)), s: 1 };
    if (S.fu1 > 0) { const v = ves1(); return { p: v.p.clone().lerp(P_CIS, sm(S.fu1)), s: 1 }; }
    if (S.bud1 > 0) { const v = ves1(); return { p: v.p.clone(), s: Math.min(1, S.bud1 * 2) }; }
    if (S.pin > 0) { const u = sm(S.pin); return { p: SITES[0].clone().add(V(0.32, 0.05, 0)).lerp(V(0.3, SITES[0].y, SITES[0].z), u), s: 1 - u }; }
    return { p: SITES[0].clone().add(V(0.32, 0.05, 0)), s: sm(S.pr) };
  }
  // البروتينان الآخران اللذان يبنيان عند رايبوسومَين آخرَين (يدخلان الكيس ولا يُتتبَّعان بعد ذلك)
  function protK(k) {
    const site = SITES[k], out = site.clone().add(V(0.32, 0.05, 0));
    if (S.pin > 0) { const u = sm(S.pin); return { p: out.lerp(V(0.3, site.y, site.z), u), s: 1 - u }; }
    return { p: out, s: sm(Math.max(0, S.pr * 1.3 - 0.3 * k)) };
  }

  function ribosome(p, parent, big = 0.15, small = 0.1) {               // رايبوسوم: وحدة كبيرة ووحدة صغيرة
    ctxRef.ball(p, big, matRib, parent); ctxRef.ball(p.clone().add(V(0, big + small * 0.55, 0)), small, matRib, parent);
  }

  window.DIORAMA = {
    id: 'secretion', title: 'مسار الإفراز: من الشبكة الإندوبلازميَّة الخشنة إلى خارج الخليَّة',
    subtitle: 'الأحياء — الصف الحادي عشر — الوحدة الأولى: تركيب الخليَّة',
    source: 'النص من كتاب الطالب: ١-٤ الخلايا النباتيَّة والخلايا الحيوانيَّة كما تُرى بالمجهر الإلكتروني (ص ٣٦–٣٩) والصورة ١-١٢',
    legend: [['#9D7BD8', 'النواة'], ['#B9C7E0', 'الشبكة الإندوبلازميّة الخشنة'], ['#3B4A6B', 'رايبوسومات', 'dot'], ['#5BAE5B', 'جهاز جولجي'], ['#D9A441', 'غشاء سطح الخلية'], null,
             ['#F0A94B', 'حويصلة', 'dot'], ['#4F7FE0', 'بروتين', 'dot'], ['#E8B923', 'سكّريات', 'dot'], ['#C8102E', 'إنزيمات هاضمة', 'dot']],
    camera: { VH: 18.5, center: [-0.6, 1.0, 0] },
    base: { L: 20, W: 10, x: -0.6 },
    BASE: { fo: 0, pr: 0, pin: 0, bud1: 0, mv1: 0, fu1: 0, gp: 0, sug: 0, bud2: 0, mv2: 0, fu2: 0, rel: 0, bud3: 0, mv3: 0, lys: 0 },
    noGeom: ['fo', 'pr', 'pin', 'bud1', 'mv1', 'fu1', 'gp', 'sug', 'bud2', 'mv2', 'fu2', 'rel', 'bud3', 'mv3', 'lys'],
    // نقطة التركيز: 0 المشهد، 1 رايبوسوم البناء، 2 الحويصلة الأولى، 3 البروتين في جولجي، 4 الحويصلة الإفرازيَّة، 5 موضع الاندماج بالغشاء، 6 الليسوسوم
    focus(s) {
      S = s; const k = Math.round(S.fo || 0);
      if (k === 1) return SITES[0].clone().add(V(0.2, 0.1, 0));
      if (k === 2) { const v = ves1(); return v ? v.p.clone() : BUD1.clone(); }
      if (k === 3) return prot().p.clone();
      if (k === 4) { const v = ves2(); return v ? v.p.clone() : BUD2.clone(); }
      if (k === 5) return V(MX + 0.3, GY, 1.0);
      if (k === 6) { const v = ves3(); return v ? v.p.clone() : BUD3.clone(); }
      return V(-0.6, 1.2, 0);
    },
    STEPS: [
      { t: 'الشبكة الإندوبلازميَّة الخشنة والغلاف النووي',
        p: 'تشكّل أغشية الشبكة أكياسًا (أنبوبية الشكل) يمكن أن تنتقل عبرها الجُزيئات، بشكل منفصل عن باقي السيتوبلازم. وتمتدّ هذه الشبكة لتتّصل بالغشاء الخارجي للغلاف النووي (الشكل ١-٦ و ١-٧). تسمّى الشبكة الإندوبلازميّة الخشنة بهذا الاسم لأنها مغطّاة بكثير من العُضيّات الصغيرة المسمّاة رايبوسومات (تعرض لاحقًا).',
        seq: [[{}, 0]],
        pills: [['النواة', PUR, () => NUC.clone().add(V(0, NR * 0.7, 0)), 0, -120], ['الغلاف النووي', PUR, () => V(NUC.x - 0.3, NUC.y - 0.3, NUC.z + NR + 0.1), 130, 70],
                ['الشبكة الإندوبلازميّة الخشنة', BLU, () => V(2.7 + TH / 2, 1.5, -1.6), 120, -120], ['رايبوسومات', GRY, () => V(3.9 + TH / 2 + 0.15, 1.3, 1.2), 90, 95],
                ['جهاز جولجي', GRN, () => V(GX[2], GY + 1.0, 1.0), -40, -110], ['غشاء سطح الخلية', ORG, () => V(MX, MH * 0.8, 3.2), -130, -40]] },
      { t: 'الرايبوسومات مواقع بناء البروتين',
        p: 'وعند تكبيرها باستخدام المجهر الإلكتروني يمكن رؤيتها تتكوّن من وحدتين: وحدة كبيرة ووحدة صغيرة. الرايبوسومات هي مواقع بناء البروتين، ويمكن أن توجد أيضًا حرة في السيتوبلازم. وتقوم الشبكة الإندوبلازمية الخشنة بنقل البروتينات.',
        n: 'يُعرض ثلاثة رايبوسومات تبني بروتينات تدخل الكيس؛ ويُتتبَّع بروتين واحد منها في بقيَّة الخطوات.',
        seq: [[{ '!fo': 1, zoom: 2.6 }, 900], [{ pr: 1 }, 2000], [{ pin: 1 }, 1400], [{ zoom: 1 }, 900]],
        pills: [['وحدة كبيرة ووحدة صغيرة', GRY, () => SITES[0].clone().add(V(0, 0.1, 0)), 150, -80], ['بناء البروتين', BLU, () => SITES[0].clone().add(V(0.32, 0.05, 0)), 130, 70],
                ['رايبوسومات حرة في السيتوبلازم', GRY, () => FREE[0].clone().add(V(0, 0.2, 0)), 110, -90]] },
      { t: 'تبرعم حويصلة من الشبكة الإندوبلازميَّة الخشنة',
        p: 'تتكوّن كومة الأكياس هذه باستمرار عند أحد الأطراف من حويصلات تنتج من تبرعم أغشية الشبكة الإندوبلازميّة الخشنة، ثمّ تنفصل مرّة أخرى عند الطرف الآخر لتنشأ حويصلات جولجي <span class="ltr">Golgi vesicles</span>. وتسمّى كومة الأكياس مع الحويصلات المرتبطة فيها جهاز جولجي <span class="ltr">Golgi apparatus</span> أو معقّد جولجي <span class="ltr">Golgi complex</span>.',
        n: 'تُعرض حويصلة واحدة للتوضيح؛ وفي الخليَّة تتبرعم حويصلات كثيرة باستمرار.',
        seq: [[{ '!fo': 2, zoom: 2.4 }, 900], [{ bud1: 1 }, 1600], [{ zoom: 1.7 }, 600], [{ mv1: 1 }, 1900], [{ fu1: 1 }, 1200], [{ zoom: 1 }, 900]],
        pills: [['تبرعم أغشية الشبكة الإندوبلازميّة الخشنة', BLU, () => BUD1.clone().add(V(-0.2, 0.3, 0)), 170, -90], ['حويصلة', ORG, () => { const v = ves1(); return v ? v.p.clone() : BUD1.clone(); }, -60, 110],
                ['تتكوّن كومة الأكياس عند أحد الأطراف', GRN, () => V(CIS, GY + 0.9, 0.6), 120, -115]] },
      { t: 'جهاز جولجي يجمع البروتينات ويعالجها',
        p: 'جهاز جولجي <span class="ltr">Golgi appartus</span> كومة من الأكياس الغشائية المسطّحة <span class="ltr">Cisternae</span> (الصورة ١-١٢)، وقد نجد في الخليّة أكثر من جهاز جولجي واحد. يجمع جهاز جولجي الجُزيئات، خصوصًا البروتينات، من الشبكة الإندوبلازميّة الخشنة، ويعالجها. وهو يستخدم في ذلك مئات الإنزيمات التي يحتويها.',
        seq: [[{ '!fo': 3, zoom: 1.9 }, 900], [{ gp: 1 }, 2800]],
        pills: [['كومة من الأكياس الغشائية المسطّحة', GRN, () => V(GX[2], GY + 1.15, -0.6), 0, -100], ['يعالجها جهاز جولجي: مئات الإنزيمات', BLU, () => prot().p.clone(), -120, 90]] },
      { t: 'تُضاف السكَّريات إلى البروتين',
        p: 'تضاف السكّريات إلى البروتينات لتكوين جُزيئات البروتينات السكّريّة. البروتينات السكّرية والدهون السكّرية مكوّنات مهمّة للأغشية، وتمثّل جُزيئات مهمّة في الاتصال الخلوي.',
        n: 'المعالجة وإضافة السكّريات تحدث أثناء مرور البروتين في أكياس الكومة؛ تُعرضان متتابعتَين للتوضيح.',
        seq: [[{ zoom: 3.0 }, 900], [{ sug: 1 }, 1800], [{ zoom: 1.9 }, 800]],
        pills: [['تضاف السكّريات إلى البروتينات', GLD, () => prot().p.clone().add(V(0, 0.3, 0)), 20, -95], ['البروتينات السكّريّة', BLU, () => prot().p.clone(), -130, 80]] },
      { t: 'حويصلات جولجي تنفصل عند الطرف الآخر',
        p: 'حويصلات جولجي <span class="ltr">Golgi vesicles</span>: تحمل محتوياتها إلى أجزاء أخرى من الخلية، غالبًا ما يكون غشاء سطح الخلية، ليتمّ إفرازها. يمكن رؤية حويصلات جولجي الصغيرة تتبرعم من أكياس الكومة المركزيّة كأسية الشكل (اللون الأخضر) وتنفصل عنها.',
        seq: [[{ '!fo': 4, zoom: 2.2 }, 800], [{ bud2: 1 }, 1600], [{ zoom: 1.3 }, 600], [{ mv2: 0.7 }, 1800]],
        pills: [['حويصلات جولجي تتبرعم وتنفصل عند الطرف الآخر', GRN, () => V(TRANS, GY + 0.9, 0.6), -40, -115], ['تحمل محتوياتها إلى غشاء سطح الخلية', ORG, () => { const v = ves2(); return v ? v.p.clone() : BUD2.clone(); }, -120, 100]] },
      { t: 'الإفراز: الإخراج الخلوي عند سطح الخليَّة',
        p: 'وتنتقل الجُزيئات بعد معالجتها إلى أجزاء أخرى من الخليّة أو إلى خارجها. ويسمّى إطلاق الجُزيئات إلى خارج الخليّة إفرازًا، ويسمّى المسار الذي تسلكه الجُزيئات مسارَ الإفراز. قد تكوّن، هذه حويصلات إفرازيّة تطلق محتوياتها عند سطح الخليّة عن طريق الإخراج الخلوي.',
        seq: [[{ mv2: 1 }, 900], [{ '!fo': 5, zoom: 2.6 }, 900], [{ fu2: 1 }, 1400], [{ rel: 1 }, 1600], [{ zoom: 1 }, 1000]],
        pills: [['الإخراج الخلوي: الحويصلة تطلق محتوياتها عند سطح الخليّة', ORG, () => V(MX + 0.2, GY + 0.4, 1.0), 170, -95], ['إطلاق الجُزيئات إلى خارج الخليّة إفرازًا', BLU, () => prot().p.clone(), -20, 110],
                ['خارج الخليّة', GRY, () => V(-10.2, 0.0, 3.6), -40, -70]] },
      { t: 'حويصلات جولجي تبني الليسوسومات',
        p: 'تستخدم حويصلات جولجي في بناء الليسوسومات. الليسوسومات <span class="ltr">Lysosomes</span> حويصلات كروية بسيطة محاطة بغشاء مفرد، يبلغ قطرها في الخلايا الحيوانيّة عادة <span class="ltr">0.1 - 0.5 µm</span> (الصورة ١-١٣). تحتوي الليسوسومات على إنزيمات هاضمة، وهي تسمّى إنزيمات التحلُّل المائي <span class="ltr">Hydrolases</span> لأنها تحفّز تفاعلات التحلل المائي. تصنّع الإنزيمات على الشبكة الإندوبلازميّة الخشنة <span class="ltr">(RER)</span>، وتُرسل إلى الليسوسومات عبر جهاز جولجي.',
        n: 'يُعرض تكوُّن الليسوسوم بعد الإفراز للتوضيح؛ وفي الخليَّة تنشأ حويصلات جولجي المختلفة من الكومة نفسها.',
        seq: [[{ '!fo': 6, zoom: 2.0 }, 900], [{ bud3: 1 }, 1400], [{ mv3: 1 }, 1800], [{ lys: 1 }, 1200], [{ zoom: 1 }, 1000]],
        pills: [['حويصلة جولجي', ORG, () => { const v = ves3(); return v && S.lys < 0.5 ? v.p.clone() : BUD3.clone().add(V(-0.3, 0, 0)); }, 130, -95], ['ليسوسوم: إنزيمات هاضمة محاطة بغشاء مفرد', RED, () => V3_END.clone().add(V(0, 0.3, 0)), 20, -120]] },
    ],
    setup(ctx) {
      ctxRef = ctx; const sc = ctx.scene;
      const add = (g, m, p, parent) => ctx.mesh(g, m, p, parent);
      // ── أرضيَّة السيتوبلازم (داخل الخليَّة فقط) ──
      add(new THREE.BoxGeometry(9.4 - MX, 0.08, 9.4), M(0xFBE7CB, { roughness: 0.95 }), V((9.4 + MX) / 2, -0.26, 0));
      // ── غشاء سطح الخليَّة: طبقتان رقيقتان ──
      const matMem = trans(0xD9A441, 0.62); matMem.roughness = 0.6;
      [-0.07, 0.07].forEach(dx => { const o = add(new THREE.BoxGeometry(0.07, MH, 9.4), matMem, V(MX + dx, MH / 2 - 0.22, 0)); o.castShadow = true; });
      // ── النواة وغلافها ──
      add(new THREE.SphereGeometry(NR, 40, 28), M(0x9D7BD8, { roughness: 0.5 }), NUC);
      const env = new THREE.Mesh(new THREE.SphereGeometry(NR + 0.16, 40, 28), trans(0xC9B8F0, 0.42)); env.position.copy(NUC); sc.add(env);
      // ── الشبكة الإندوبلازميَّة الخشنة: أكياس مسطَّحة تمتدُّ من الغلاف النووي ──
      const matER = M(0xB9C7E0, { roughness: 0.55 });
      SLABS.forEach((s, i) => {
        add(new THREE.BoxGeometry(TH, s.h, s.d), matER, V(s.x, s.h / 2 - 0.22, 0));
        for (const side of [-1, 1]) {
          const fx = s.x + side * (TH / 2 + 0.15);
          for (let y = 0.35; y < s.h - 0.35; y += 0.5) for (let z = -s.d / 2 + 0.35; z < s.d / 2 - 0.2; z += 0.62) {
            const p = V(fx, y, z + (Math.round(y * 2) % 2) * 0.2);
            if (i === 3 && side === 1 && SITES.some(q => q.distanceTo(p) < 0.42)) continue;
            ribosome(p, sc, 0.13, 0.085);
          }
        }
      });
      SITES.forEach(p => ribosome(p, sc));                               // الرايبوسومات الثلاثة التي تبني البروتينات
      add(new THREE.BoxGeometry(2.1, TH, 1.0), matER, V(4.95, 1.55, 1.2));          // اتِّصال الشبكة بالغشاء الخارجي للغلاف النووي
      FREE.forEach(p => ribosome(p, sc));                                // رايبوسومات حرَّة في السيتوبلازم
      // ── جهاز جولجي: كومة أكياس غشائيَّة مسطَّحة ──
      const matG = trans(0x5BAE5B, 0.68);
      GX.forEach((x, i) => { const c = new THREE.Mesh(new THREE.SphereGeometry(1, 30, 20), matG); c.position.set(x, GY, GZ); c.scale.set(0.17, GH[i], GD[i]); c.castShadow = true; sc.add(c); });
      // ── الأجسام المتحرِّكة ──
      O.v = [ctx.blob(0xF0A94B, 0.62), ctx.blob(0xF0A94B, 0.62), ctx.blob(0xF0A94B, 0.62)];
      O.prot = add(new THREE.SphereGeometry(0.26, 18, 14), matProt, SITES[0]);
      O.protK = [1, 2].map(k => add(new THREE.SphereGeometry(0.26, 18, 14), matProt, SITES[k]));
      O.sug = SUG.map(() => add(new THREE.SphereGeometry(0.11, 12, 10), matSug, V(0, 0, 0)));
      O.enz = ENZ.map(() => add(new THREE.SphereGeometry(0.085, 12, 10), matEnz, V(0, 0, 0)));
    },
    rebuild() {},
    place(s) {
      S = s;
      const setV = (o, v) => { if (!v || !v.on || v.r < 0.01) { o.visible = false; return; } o.visible = true; o.position.copy(v.p); o.scale.set(v.r * v.sx, v.r * v.syz, v.r * v.syz); o.material.opacity = v.op; };
      setV(O.v[0], ves1()); setV(O.v[1], ves2()); setV(O.v[2], ves3());
      const P = prot(); O.prot.position.copy(P.p); O.prot.scale.setScalar(Math.max(0.001, P.s)); O.prot.visible = P.s > 0.02 && S.pr > 0.01;
      O.protK.forEach((o, i) => { const q = protK(i + 1); o.position.copy(q.p); o.scale.setScalar(Math.max(0.001, q.s)); o.visible = q.s > 0.02 && S.pr > 0.01; });
      const sg = sm(S.sug);
      O.sug.forEach((o, i) => { o.visible = sg > 0.02 && P.s > 0.02; o.position.copy(P.p).add(SUG[i].clone().multiplyScalar(0.6 + 0.4 * sg)); o.scale.setScalar(Math.max(0.001, sg)); });
      const v3 = ves3(), spread = 1 + 1.6 * sm(S.lys);
      O.enz.forEach((o, i) => { o.visible = !!v3 && v3.r > 0.2; if (v3) { o.position.copy(v3.p).add(ENZ[i].clone().multiplyScalar(spread)); o.scale.setScalar(Math.min(1, v3.r / RV)); } });
    },
    idle(t, s, ctx, tweening) {
      if (tweening) return;
      // طفو خفيف للحويصلات وللبروتين المفرَز خارج الخليَّة (يُعاد الوضع من الحالة كلَّ إطار ثمَّ تُضاف الإزاحة)
      this.place(s);
      const bob = Math.sin(t * 2.2) * 0.04;
      O.v.forEach(o => { if (o.visible) o.position.y += bob; });
      if (S.rel >= 1) O.prot.position.y += bob;
    },
  };
})();
