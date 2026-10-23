/* ديوراما: الخليَّة بدائيَّة النواة — بكتيريوم نموذجي يُبنى تركيباً تركيباً ثمَّ يُقارَن بالخليَّة حقيقيَّة النواة — الدرس ١-٥ (كتاب الطالب ص ٤٩–٥٢، الشكل ١-١٦ والجدول ١-٢) */
(function () {
  const { V, sm, M, CSS } = DioramaCore;
  const { BLU, RED, GLD, TEAL, PNK, GRY, GRN, ORG, PUR } = CSS;
  let S, ctxRef;
  const O = {};                                                        // الكائنات الدائمة

  // ── هندسة المشهد: خليَّة عصويَّة محورها على x مقطوعة طوليّاً (النصف العلوي محذوف) ──
  const CX = 0.6, CY = 1.05, HL = 2.6;                                 // مركز الخليَّة وارتفاع محورها ونصف طول الجزء الأسطواني
  const RW = 1.35, TW = 0.17, RM = RW - TW - 0.02, TM = 0.07, RC = RM - TM - 0.03, RK = RW + 0.3; // أنصاف أقطار: الجدار، الغشاء، السيتوبلازم، الكبسولة
  const XMIN = CX - HL - RK - 0.15, XMAX = CX + HL + RK + 0.15;        // مدى المسح الطولي عند البناء
  const NUC = V(CX - 0.2, CY - 0.42, 0);                               // مركز نظير النواة
  const POLE = V(CX + HL + RW, CY, 0);                                 // قطب الخليَّة (قاعدة السوط)
  const FL = 3.3, FR = 0.26, FK = 2 * Math.PI / 1.15;                  // طول السوط ونصف قطر موجته وعدد موجاته
  const EX = -6.6, ER = 2.9, EY = ER - 0.3;                            // الخليَّة حقيقيَّة النواة (نصف كرة مقطوعة) ومركزها
  const E_NUC = V(EX - 0.8, EY - 1.25, 0.2), E_NR = 0.95;
  const rnd = (() => { let s = 1234567; return () => (s = (s * 48271) % 2147483647) / 2147483647; })();

  // مواضع الرايبوسومات داخل التجويف (النصف السفلي فقط)
  const RIB = [];
  while (RIB.length < 64) {
    const x = CX + (rnd() * 2 - 1) * (HL + 0.6), a = Math.PI * (0.12 + 0.76 * rnd()), r = RC - 0.22 - rnd() * 0.45;
    const p = V(x, CY - r * Math.sin(a), r * Math.cos(a));
    const dx = Math.max(0, Math.abs(x - CX) - HL), rr = Math.hypot(dx, p.y - CY, p.z);
    if (rr > RC - 0.2) continue;
    if (p.distanceTo(NUC) < 1.25 && rnd() < 0.8) continue;             // منطقة نظير النواة أقلُّ ازدحاماً
    RIB.push(p);
  }
  const PLA = [V(CX + 1.75, CY - 0.5, 0.45), V(CX - 1.85, CY - 0.55, -0.35), V(CX + 1.2, CY - 0.8, -0.55)]; // البلازميدات
  const PIL = [];                                                      // الشُّعيرات: نقطة على الجدار واتِّجاه شعاعي
  for (let i = 0; i < 14; i++) {
    const x = CX + (rnd() * 2 - 1) * (HL - 0.2), side = i % 2 ? 1 : -1, a = (0.1 + 0.42 * rnd()) * side * (rnd() < 0.5 ? 1 : -1);
    const d = V(0, -Math.sin(Math.abs(a)) * 0.6, Math.cos(a) * side); d.normalize();
    PIL.push({ p: V(x, CY, 0).addScaledVector(d, RW - 0.05), d, L: 0.55 + rnd() * 0.45 });
  }
  const E_RIB = [];
  while (E_RIB.length < 26) {
    const p = V(EX + (rnd() * 2 - 1) * ER, EY - rnd() * ER, (rnd() * 2 - 1) * ER);
    if (p.distanceTo(V(EX, EY, 0)) > ER - 0.45 || p.distanceTo(E_NUC) < E_NR + 0.25 || p.y > EY - 0.15) continue;
    E_RIB.push(p);
  }
  const E_MIT = [{ p: V(EX + 1.3, EY - 0.9, -0.9), ry: 0.5 }, { p: V(EX + 0.6, EY - 1.5, 1.1), ry: -0.7 }];

  // ── DNA الحلقي الملتف: حلقة مغلقة مجعَّدة داخل نظير النواة ──
  const DNA_PTS = [], ND = 150;
  for (let k = 0; k < ND; k++) {
    const t = k / ND, th = 2 * Math.PI * t;
    DNA_PTS.push(V(NUC.x + 1.15 * Math.cos(th) + 0.3 * Math.cos(5 * th + 1.0) + 0.12 * Math.sin(9 * th),
                   NUC.y + 0.27 * Math.sin(7 * th + 0.4) + 0.08 * Math.cos(3 * th),
                   NUC.z + 0.5 * Math.sin(th) + 0.28 * Math.sin(4 * th + 2.1) + 0.1 * Math.cos(8 * th)));
  }
  const trans = (c, op, extra) => { const m = new THREE.MeshStandardMaterial(Object.assign({ color: c, transparent: true, opacity: op, roughness: 0.35, depthWrite: false }, extra || {})); m.color.convertSRGBToLinear(); return m; };
  const matRib = M(0x3B4A6B, { roughness: 0.5 }), matDNA = M(0xD23C8C, { roughness: 0.4 }), matPla = M(0x7B1FA2, { roughness: 0.4 });
  const matFla = M(0xF28C28, { roughness: 0.45 }), matPil = M(0x3F6B4F, { roughness: 0.5 });
  const ribosome = (p, big, small, parent) => { ctxRef.ball(p, big, matRib, parent); ctxRef.ball(p.clone().add(V(0, big + small * 0.55, 0)), small, matRib, parent); };

  // مقطع نصف كبسولة بسُمك: lathe لحلقة مغلقة (خارجي ثمَّ داخلي) حول المحور ثمَّ تدوير المحور إلى x؛ النصف السفلي فقط (φ من 0 إلى 180°: three.js يستعمل x·sinφ)
  function halfShell(r1, r2, h, mat, parent) {
    const pts = [], n = 10, arc = (r, cy, sgn, from, to) => { for (let k = 0; k <= n; k++) { const t = from + (to - from) * k / n; pts.push(new THREE.Vector2(r * Math.sin(t), cy + sgn * r * Math.cos(t))); } };
    arc(r2, -h, -1, 0, Math.PI / 2); pts.push(new THREE.Vector2(r2, h)); arc(r2, h, 1, Math.PI / 2, 0);
    arc(r1, h, 1, 0, Math.PI / 2); pts.push(new THREE.Vector2(r1, -h)); arc(r1, -h, -1, Math.PI / 2, 0); pts.push(pts[0].clone());
    const g = new THREE.Group(); g.position.set(CX, CY, 0); g.rotation.z = -Math.PI / 2;
    const body = new THREE.Mesh(new THREE.LatheGeometry(pts, 56, 0, Math.PI), mat); body.castShadow = body.receiveShadow = true; g.add(body);
    const shape = new THREE.Shape(pts);                                                  // وجها القطع (الحلقة بين السطحين) في المستوى المحلِّي X=0 أي مستوى القطع الأفقي
    for (const s of [1, -1]) { const c = new THREE.Mesh(new THREE.ShapeGeometry(shape), mat); c.rotation.y = s * Math.PI / 2; g.add(c); }
    (parent || ctxRef.scene).add(g); return g;
  }
  const bowl = (r, h, mat, parent) => {                                // تجويف السيتوبلازم: سطح نصف كبسولة مصمت (نصف سفلي)
    const pts = [], n = 12; for (let k = 0; k <= n; k++) { const t = Math.PI / 2 * k / n; pts.push(new THREE.Vector2(r * Math.sin(t), -h - r * Math.cos(t))); }
    for (let k = 0; k <= n; k++) { const t = Math.PI / 2 * k / n; pts.push(new THREE.Vector2(r * Math.cos(t), h + r * Math.sin(t))); }
    const g = new THREE.Group(); g.position.set(CX, CY, 0); g.rotation.z = -Math.PI / 2;
    const m = new THREE.Mesh(new THREE.LatheGeometry(pts, 56, 0, Math.PI), mat); m.receiveShadow = true; g.add(m); (parent || ctxRef.scene).add(g); return g;
  };
  const hemi = (r, mat, parent, lower = true) => { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 48, 24, 0, Math.PI * 2, lower ? Math.PI / 2 : 0, lower ? Math.PI / 2 : Math.PI), mat); m.castShadow = m.receiveShadow = true; (parent || ctxRef.scene).add(m); return m; };
  let flaPhase = 0;
  function setFlagellum(u, phase) {                                    // السوط: أسطوانة بشكل موجة تنمو من القطب وتدور حول محورها
    if (O.fla.geometry) O.fla.geometry.dispose();
    const len = FL * sm(u); if (len < 0.15) { O.fla.visible = false; return; }
    const pts = [], n = Math.max(6, Math.ceil(len / 0.08));
    for (let k = 0; k <= n; k++) { const s = len * k / n, amp = FR * Math.min(1, s / 0.9); pts.push(V(POLE.x + s, POLE.y + amp * Math.sin(FK * s + phase), amp * Math.cos(FK * s + phase))); }
    O.fla.geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), n * 2, 0.055, 8, false); O.fla.visible = true;
  }

  window.DIORAMA = {
    id: 'bacterium', title: 'الخليَّة بدائيَّة النواة: تركيب البكتيريا تركيباً تركيباً',
    subtitle: 'الأحياء — الصف الحادي عشر — الوحدة الأولى: تركيب الخليَّة',
    source: 'النص من كتاب الطالب: ١-٥ البكتيريا (ص ٤٩–٥٢)، الشكل ١-١٦ والجدول ١-٢',
    legend: [['#6C7A89', 'جدار خلوي (ببتيدوجلايكان)'], ['#D9A441', 'غشاء سطح الخلية'], ['#E9D6B0', 'سيتوبلازم'], ['#3B4A6B', 'رايبوسومات', 'dot'], ['#D23C8C', 'DNA حلقي ملتف', 'tube'], null,
             ['#7B1FA2', 'بلازميد', 'tube'], ['#A8D08D', 'كبسولة أو طبقة غرويّة'], ['#F28C28', 'سوط', 'tube'], ['#3F6B4F', 'شُعيرات', 'tube'], ['#9D7BD8', 'نواة (حقيقيّة النواة)']],
    camera: { VH: 12.5, center: [0.3, 0.9, 0], elevation: 56, azimuth: 22 },
    base: { L: 19, W: 10, x: -0.8 },
    BASE: { fo: 0, wall: 0, mem: 0, cyt: 0, rib: 0, dna: 0, pla: 0, cap: 0, fla: 0, pil: 0, euk: 0 },
    noGeom: ['fo', 'wall', 'mem', 'cyt', 'rib', 'pla', 'cap', 'pil', 'euk'],
    // نقطة التركيز: 0 مركز الخليَّة، 1 حافَّة الجدار القريبة، 2 نظير النواة، 3 بلازميد، 4 قاعدة السوط، 5 رايبوسوم
    focus(s) {
      S = s; const k = Math.round(S.fo || 0);
      if (k === 1) return V(CX + 0.9, CY, RW - 0.1);
      if (k === 2) return NUC.clone();
      if (k === 3) return PLA[0].clone();
      if (k === 4) return V(POLE.x + 0.9, CY, 0);
      if (k === 5) return RIB[3].clone();
      return V(CX, CY - 0.2, 0);
    },
    STEPS: [
      { t: 'الخليَّة بدائيَّة النواة: بكتيريوم نموذجي',
        p: 'تذكّر أن هناك نوعَين رئيسيَين من الخلايا: حقيقية النواة مثل الخلايا الحيوانية والنباتية التي درستها، وبدائية النواة كالبكتيريا والتي خلاياها أبسط بكثير من تلك الموجودة في حقيقيّة النواة. فبدائية النواة أصغر حجمًا بنحو 1000 مرّة من حقيقية النواة، وتفتقر إلى النواة المحاطة بغشاء مزدوج. يبيّن الشكل ١-١٦ تركيب خليّة بكتيريوم <span class="ltr">Bacterium</span> (جمعها: بكتيريا <span class="ltr">Bacteria</span>) نموذجية. يبلغ قطر الخلايا بشكل عام <span class="ltr">1-5 µm</span> تقريبًا.',
        n: 'الخليَّة مقطوعة طوليّاً (نصفها العلوي محذوف) لرؤية ما بداخلها؛ وتُبنى تراكيبها في الخطوات التالية.',
        seq: [[{}, 0]],
        pills: [['خليّة بكتيريوم نموذجية', GRY, () => V(CX, CY + 0.1, 0), 0, -110], ['قطر الخلايا <span class="ltr">1-5 µm</span> تقريبًا', BLU, () => V(CX - HL - 0.3, CY, RW * 0.5), -150, 60]] },
      { t: 'جدار الخليَّة: ببتيدوجلايكان',
        p: 'يحتوي جدار خليّة البكتيريا على مادّة قوية (صلبة) تسمّى ببتيدوجلايكان <span class="ltr">Peptidoglycan</span>. وبالتالي يؤمّن لها الحماية وهو ضروري لبقائها على قيد الحياة، كما يمنع انتفاخ الخليّة وانفجارها إذا دخل الماء إليها بالإسموزيّة.',
        seq: [[{ wall: 1 }, 2600], [{ '!fo': 1, zoom: 2.6 }, 1000], [{ zoom: 1 }, 900]],
        pills: [['جدار خلوي يحتوي ببتيدوجلايكان', GRY, () => V(CX + 0.9, CY, RW - TW / 2), 150, -90], ['مادّة قوية (صلبة)', RED, () => V(CX - 1.6, CY, -(RW - TW / 2)), -120, -70]] },
      { t: 'غشاء سطح الخليَّة',
        p: 'تحاط الخلايا البكتيريّة بغشاء سطح الخلية مثل كل الخلايا.',
        seq: [[{ '!fo': 1, zoom: 2.3 }, 900], [{ mem: 1 }, 2400], [{ zoom: 1 }, 900]],
        pills: [['غشاء سطح الخلية', ORG, () => V(CX + 0.9, CY, RM - TM / 2), 150, 80], ['جدار خلوي', GRY, () => V(CX - 1.4, CY, RW - TW / 2), -130, -70]] },
      { t: 'السيتوبلازم والرايبوسومات 70 S',
        p: 'لا يحتوي السيتوبلازم على أيّة عُضيّة محاطة بغشاء. رايبوسومات البكتيريا هي رايبوسومات <span class="ltr">70 S</span>، أصغر قليلًا من رايبوسومات <span class="ltr">80 S</span> في حقيقيّة النواة.',
        seq: [[{ cyt: 1 }, 1800], [{ '!fo': 5, rib: 1 }, 1800], [{ zoom: 2.6 }, 900], [{ zoom: 1 }, 900]],
        pills: [['سيتوبلازم', GLD, () => V(CX - 1.2, CY - 0.4, 0.5), -140, -80], ['رايبوسومات <span class="ltr">70 S</span>', GRY, () => RIB[3].clone().add(V(0, 0.1, 0)), 140, 70]] },
      { t: 'DNA الحلقي الملتف: نظير النواة',
        p: 'جُزيء <span class="ltr">DNA</span> في البكتيريا حلقي، يوجد في منطقة نووية تسمّى نظير النواة <span class="ltr">Nucleoid</span>، والتي تحتوي أيضًا على بروتينات وكمّيات صغيرة من <span class="ltr">RNA</span>. وهي، بخلاف نواة حقيقيّة النواة، ليست محاطة بغشاء مزدوج. قد يوجد أكثر من نسخة واحدة من جُزيء <span class="ltr">DNA</span> في الخليّة.',
        n: 'تُعرض نسخة واحدة من جُزيء DNA للتوضيح.',
        seq: [[{ '!fo': 2, zoom: 1.9 }, 900], [{ dna: 1 }, 2800], [{ zoom: 1 }, 900]],
        pills: [['<span class="ltr">DNA</span> حلقي ملتف', PNK, () => NUC.clone().add(V(0.6, 0.25, 0.4)), 130, -85], ['نظير النواة: ليست محاطة بغشاء مزدوج', PUR, () => NUC.clone().add(V(-0.9, -0.1, -0.3)), -150, 85]] },
      { t: 'البلازميدات: حلقات صغيرة من DNA',
        p: 'البلازميد <span class="ltr">Plasmid</span> حلقة من <span class="ltr">DNA</span> منفصلة عن <span class="ltr">DNA</span> الرئيسي في الخليّة، وهو يحتوي على جينات قليلة، كما قد تحتوي الخليّة على عدة بلازميدات. ولجينات البلازميدات وظائف كثيرة مفيدة، إذ تحتوي البلازميدات عادة على الجينات التي تؤمّن مقاومة لمضادات حيويّة معيّنة مثل البنسلين. ويمكن للبلازميدات أن تتضاعف بشكل مستقل عن <span class="ltr">DNA</span> الكروموسومي، كما يمكن أن تنتقل بسرعة من خليّة إلى أخرى.',
        seq: [[{ '!fo': 3, zoom: 2.2 }, 900], [{ pla: 1 }, 1800], [{ zoom: 1 }, 900]],
        pills: [['بلازميد، حلقة صغيرة من <span class="ltr">DNA</span>، قد يوجد العديد منها', PUR, () => PLA[0].clone().add(V(0, 0.2, 0)), 150, -80], ['<span class="ltr">DNA</span> الرئيسي في الخليّة', PNK, () => NUC.clone().add(V(0, 0.2, 0)), -140, -90]] },
      { t: 'تراكيب توجد أحياناً: الكبسولة والسوط والشُّعيرات',
        p: 'يحاط الجدار الخلوي لبعض البكتيريا بطبقة إضافيّة، تأخذ شكل كبسولة <span class="ltr">Capsule</span> أو طبقة غرويّة <span class="ltr">Slime layer</span>. تستطيع بعض البكتيريا السباحة لوجود سوط أو سوطَين فيها. أسواط البكتيريا أبسط تركيبًا بكثير من أسواط حقيقيّة النواة. وله شكل موجة، ويعمل عبر دوران قاعدته كالمروحة ليدفع البكتيريا في بيئتها السائلة، وبالتالي تتحرّك البكتيريا إلى الأمام. الشُّعيرات <span class="ltr">Pili</span> (مفردها: شُعيرة <span class="ltr">Pilus</span>) وهي عصي بروتينيّةٍ دقيقة، تختلف في طولها وصلابتها، وقد نجد العديد منها على سطح الخليّة يصل أحيانًا إلى عدّة مئات. هذه الشُّعيرات تُستخدم للالتصاق والتفاعل مع خلايا أو سطوح أخرى.',
        n: 'تُعرض كبسولة وسوط واحد وبضع شُعيرات للتوضيح؛ وهي تراكيب لا توجد في كلِّ البكتيريا.',
        seq: [[{ cap: 1 }, 1600], [{ '!fo': 4, zoom: 1.8 }, 800], [{ fla: 1 }, 2000], [{ zoom: 1, pil: 1 }, 1500]],
        pills: [['كبسولة أو طبقة غرويّة لحماية إضافيّة', GRN, () => V(CX - 1.2, CY + 0.05, -(RK - 0.12)), -60, -95], ['سوط للحركة، تركيب بسيط جدًا', ORG, () => V(POLE.x + FL * 0.55, CY + 0.2, 0), 120, -90],
                ['شُعيرات للالتصاق بخلايا أو بأسطح أخرى', TEAL, () => PIL[1].p.clone().addScaledVector(PIL[1].d, PIL[1].L * 0.8), 20, 100]] },
      { t: 'مقارنة الخلايا بدائيَّة النواة بالخلايا حقيقيَّة النواة',
        p: 'بدائيّة النواة: قطرها النموذجي <span class="ltr">1 - 5 µm</span>. <span class="ltr">DNA</span> حلقي حرّ في السيتوبلازم، وغير محاط بغشاء مزدوج. يوجد رايبوسومات <span class="ltr">70S</span> (أصغر من تلك في حقيقيّة النواة). أنواع العُضيّات قليلة جدًا. ولا توجد عُضيّات محاطة بغشاء. — حقيقيّة النواة: يصل قطر الخلايا إلى <span class="ltr">40 µm</span>، وحجمها أكبر بـ 1000 مرّة من حجم بدائيّة النواة. <span class="ltr">DNA</span> خطي يوجد داخل النواة المحاطة بغلاف نووي (غشاءان). يوجد رايبوسومات <span class="ltr">80 S</span> (أكبر من تلك في بدائيّة النواة). أنواع العُضيّات كثيرة.',
        n: 'المقياس تقريبي: الخليّة حقيقيّة النواة مرسومة أصغر من نسبتها الحقيقيّة (قطرها يصل إلى 40 µm مقابل 1 - 5 µm للبكتيريا).',
        seq: [[{ '!fo': 0, zoom: 0.82 }, 900], [{ euk: 1 }, 1800]],
        pills: [['بدائيّة النواة: قطرها النموذجي <span class="ltr">1 - 5 µm</span>', GRY, () => V(CX + 0.5, CY + 0.1, -RK * 0.6), 60, -105], ['حقيقيّة النواة: يصل قطر الخلايا إلى <span class="ltr">40 µm</span>', BLU, () => V(EX - ER * 0.55, EY, ER * 0.45), -70, 100],
                ['النواة المحاطة بغلاف نووي (غشاءان)', PUR, () => E_NUC.clone().add(V(-0.3, E_NR * 0.5, 0.3)), -150, -40], ['رايبوسومات <span class="ltr">80 S</span>', GRY, () => E_RIB[2].clone().add(V(0, 0.15, 0)), 140, -70],
                ['<span class="ltr">DNA</span> خطي يوجد داخل النواة', PNK, () => E_NUC.clone().add(V(0.3, -0.3, 0.5)), 150, 40]] },
    ],
    setup(ctx) {
      ctxRef = ctx; const sc = ctx.scene; ctx.renderer.localClippingEnabled = true;
      const sweep = () => new THREE.Plane(V(-1, 0, 0), XMIN), level = () => new THREE.Plane(V(0, -1, 0), CY - RC - 0.1);
      O.pw = sweep(); O.pm = sweep(); O.pk = sweep(); O.pc = level();
      const DS = THREE.DoubleSide;
      // ── الخليَّة البكتيريَّة: طبقات نصف كبسولة من الخارج إلى الداخل ──
      O.ghost = halfShell(RW - 0.02, RW, HL, trans(0x9AA5B1, 0.22, { side: DS }));             // ظلُّ الخليَّة قبل بنائها
      O.wall = halfShell(RW - TW, RW, HL, M(0x6C7A89, { side: DS, clippingPlanes: [O.pw], clipShadows: true }));
      O.mem = halfShell(RM - TM, RM, HL, M(0xD9A441, { side: DS, clippingPlanes: [O.pm], clipShadows: true, roughness: 0.4 }));
      O.cyt = bowl(RC, HL, M(0xE9D6B0, { side: DS, clippingPlanes: [O.pc], roughness: 0.9 }));
      O.cap = halfShell(RW + 0.02, RK, HL, trans(0xA8D08D, 0.42, { side: DS, clippingPlanes: [O.pk], roughness: 0.6 }));
      // ── الرايبوسومات والبلازميدات والشُّعيرات (كائنات دائمة تُقاس) ──
      O.rib = RIB.map(p => { const g = new THREE.Group(); g.position.copy(p); sc.add(g); ribosome(V(0, 0, 0), 0.11, 0.075, g); return g; });
      O.pla = PLA.map((p, i) => { const m = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.045, 10, 36), matPla); m.position.copy(p); m.rotation.set(1.2 + i * 0.5, 0.4 * i, 0.3); m.castShadow = true; sc.add(m); return m; });
      O.pil = PIL.map(q => { const g = new THREE.Group(); g.position.copy(q.p); sc.add(g); ctx.rod(V(0, 0, 0), q.d.clone().multiplyScalar(q.L), 0.028, matPil, g); return g; });
      O.fla = new THREE.Mesh(new THREE.BufferGeometry(), matFla); O.fla.castShadow = true; O.fla.visible = false; sc.add(O.fla);
      // ── الخليَّة حقيقيَّة النواة للمقارنة: نصف كرة مقطوعة فيها نواة بغلاف من غشاءين وميتوكندريا ورايبوسومات أكبر ──
      const E = O.euk = new THREE.Group(); E.position.set(EX, EY, 0); sc.add(E);
      const eAdd = (o, p) => { o.position.copy(p).sub(V(EX, EY, 0)); E.add(o); return o; };
      hemi(ER, M(0xD9A441, { side: DS, roughness: 0.4 }), E); hemi(ER - 0.14, M(0xD9A441, { side: DS, roughness: 0.4 }), E);
      const ring = new THREE.Mesh(new THREE.RingGeometry(ER - 0.14, ER, 64), M(0xD9A441, { side: DS })); ring.rotation.x = -Math.PI / 2; E.add(ring);
      hemi(ER - 0.17, M(0xE9D6B0, { side: DS, roughness: 0.9 }), E);
      eAdd(new THREE.Mesh(new THREE.SphereGeometry(E_NR, 36, 24), trans(0x9D7BD8, 0.5, { roughness: 0.5 })), E_NUC);
      eAdd(new THREE.Mesh(new THREE.SphereGeometry(E_NR + 0.1, 36, 24), trans(0xC9B8F0, 0.4)), E_NUC);
      eAdd(new THREE.Mesh(new THREE.SphereGeometry(E_NR + 0.22, 36, 24), trans(0xC9B8F0, 0.3)), E_NUC);
      for (let k = 0; k < 3; k++) {                                     // DNA خطي داخل النواة
        const pts = []; for (let j = 0; j <= 24; j++) { const t = j / 24; pts.push(V(-0.55 + 1.1 * t, 0.35 - 0.3 * k + 0.12 * Math.sin(9 * t + k), 0.12 * Math.cos(7 * t + 2 * k))); }
        eAdd(ctx.tubePts(pts, 0.04, M(0x5B6B8C), E), E_NUC);
      }
      E_MIT.forEach(m => { const o = eAdd(new THREE.Mesh(new THREE.SphereGeometry(1, 28, 18), M(0xE07A5F, { roughness: 0.5 })), m.p); o.scale.set(0.62, 0.3, 0.32); o.rotation.y = m.ry; o.castShadow = true;
        const e = eAdd(new THREE.Mesh(new THREE.SphereGeometry(1, 28, 18), trans(0xF4B9A6, 0.4)), m.p); e.scale.set(0.74, 0.4, 0.42); e.rotation.y = m.ry; });
      E_RIB.forEach(p => { const g = new THREE.Group(); g.position.copy(p).sub(V(EX, EY, 0)); E.add(g); ribosome(V(0, 0, 0), 0.16, 0.105, g); });
    },
    rebuild(s, ctx) {
      S = s;
      // DNA الحلقي: يُرسم تدريجيّاً ثمَّ يُغلق
      const u = sm(S.dna), n = Math.floor(ND * u);
      if (n >= 3) { const pts = DNA_PTS.slice(0, n), closed = u >= 0.999;
        const m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, closed), closed ? ND * 2 : n * 2, 0.07, 8, closed), matDNA); m.castShadow = true; m.userData.own = true; ctx.dyn.add(m); }
      setFlagellum(S.fla, flaPhase);
    },
    place(s) {
      S = s;
      O.ghost.visible = S.wall < 0.98; O.ghost.traverse(o => { if (o.material) o.material.opacity = 0.22 * (1 - sm(S.wall)); });
      const sw = (plane, u) => { plane.constant = XMIN + (XMAX - XMIN) * sm(u); };
      sw(O.pw, S.wall); sw(O.pm, S.mem); sw(O.pk, S.cap);
      O.pc.constant = CY - RC - 0.1 + (RC + 0.15) * sm(S.cyt);
      O.wall.visible = S.wall > 0.005; O.mem.visible = S.mem > 0.005; O.cyt.visible = S.cyt > 0.005; O.cap.visible = S.cap > 0.005;
      const stag = (u, i, n) => Math.max(0.001, sm(Math.min(1, Math.max(0, (u * (n + 6) - i) / 6))));
      O.rib.forEach((g, i) => { const k = stag(S.rib, i, O.rib.length); g.visible = k > 0.01; g.scale.setScalar(k); });
      O.pla.forEach((m, i) => { const k = stag(S.pla, i * 4, 12); m.visible = k > 0.01; m.scale.setScalar(k); });
      O.pil.forEach((g, i) => { const k = stag(S.pil, i, O.pil.length); g.visible = k > 0.01; g.scale.setScalar(k); });
      const e = sm(S.euk); O.euk.visible = e > 0.01; O.euk.scale.setScalar(Math.max(0.001, e));
    },
    idle(t, s) {
      S = s;
      if (S.fla > 0.02) { flaPhase = t * 5.0; setFlagellum(S.fla, flaPhase); } // دوران السوط كالمروحة
    },
  };
})();
