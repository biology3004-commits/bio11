/* ديوراما: كيف يعمل الإنزيم — الموقع النشط، القفل والمفتاح، التلاؤم المستحث، طاقة التنشيط — الدرسان ٣-١ و٣-٢ (كتاب الطالب ص ١٠٥–١٠٩) */
(function () {
  const { V, sm, M, CSS } = DioramaCore;
  const { BLU, RED, GLD, TEAL, PNK, GRY, GRN, ORG, PUR } = CSS;
  const L = s => `<span class="ltr">${s}</span>`;
  const lerp = (a, b, u) => a + (b - a) * u;
  const cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  // ── الإنزيم: مقطع (شريحة) بسماكة DE في مستوى x-y، مركزه (0, EC) ─────────────────────
  const EA = 4.4, EB = 3.3, EC = 3.35, DE = 3.0, ZF = DE / 2;
  // ── المادة المتفاعلة (كالشكل ٣-١): قضيب + إسفين ملتحمان؛ إحداثيَّات محلِّيَّة أصلها قاع الموقع النشط ──
  const SUB = [[-1.1, 0], [-0.4, 0], [-0.4, 1.72], [0.55, 0.2], [1.5, 2.2], [1.5, 2.6], [-1.1, 2.6]];
  const PR1 = [[-1.1, 0], [-0.4, 0], [-0.4, 2.6], [-1.1, 2.6]];                       // الناتج الأوَّل (قضيب)
  const PR2 = [[-0.4, 1.72], [0.55, 0.2], [1.5, 2.2], [1.5, 2.6], [-0.4, 2.6]];       // الناتج الثاني (إسفين)
  const TOP = 2.2, C0 = [0.2, 1.3], DS = 2.4, ZS = 0.3;          // سطح الإنزيم عند الموقع النشط، مركز المادة، سماكتها وإزاحتها في z
  const NX = -0.2, NY = 6.31 - TOP;                                // أصل الموقع النشط في المشهد
  const W = (x, y, z = 0) => V(NX + x, NY + y, z);                 // محلِّي ← المشهد
  const SEAT = W(C0[0], C0[1], ZS);                                // مركز المادة المتفاعلة وهي في الموقع النشط
  const ENTR = SEAT.clone().add(V(0, 2.0, 0));                      // عند مدخل الموقع النشط
  const START = V(-4.8, 9.5, 1.2), ROT0 = [0.55, 0.9, 0.85];        // موضع جزيء المادة المتفاعلة الذي سيرتبط وهو حرٌّ
  // جزيئات مادة متفاعلة أخرى تتحرَّك عشوائيّاً (الأوَّل منها يتقدَّم إلى الموقع النشط في الخطوة 7)
  const FL = [{ p: V(-9.6, 5.2, 1.8), r: [0.3, -0.6, 2.2] }, { p: V(10.5, 3.6, -4.6), r: [-0.4, 0.7, -0.6] },
              { p: V(-11.2, 3.4, -3.0), r: [0.2, 0.4, 0.5] }, { p: V(-6.4, 1.3, -4.0), r: [-0.3, -0.8, 1.4] }];
  // ── لوحة طاقة التنشيط (الشكل ٣-٤) ───────────────────────────────────────
  const PW = 8.6, PH = 6.4, PX = 12.6, PB = -0.3, PZ = -2.2;        // عرض اللوحة وارتفاعها، مركزها في x، قاعدتها، موضعها في z
  const YR = 2.7, YP = 1.0, PKA = 5.6, PKB = 3.65, XPK = 3.9;       // مستوى المادة المتفاعلة، مستوى النواتج، قمَّتا المنحنيين
  // ── الموادُّ ─────────────────────────────────────────────────────────────
  const matCut = M(0x8DB3E8, { roughness: 0.7 }), matSide = M(0x3C6DB4, { roughness: 0.5 }), matChain = M(0x24477F, { roughness: 0.45 });
  const matSub = M(0xF4A261, { roughness: 0.45 }), matP1 = M(0xF4A261, { roughness: 0.45 }), matP2 = M(0xF4A261, { roughness: 0.45 });
  const matRo = M(0xD45AA0, { roughness: 0.4 }), matRa = M(0x12A5A0, { roughness: 0.35 }), matTB = M(0xF2C94C, { roughness: 0.3, emissive: 0x6b5200 });
  const matPlate = M(0xFFFFFF, { roughness: 0.9 }), matAx = M(0x1F2937), matDash = M(0x8A94A3), matA = M(0xC8102E, { roughness: 0.4 }), matB = M(0x009A44, { roughness: 0.4 });
  const cSub = new THREE.Color(0xF4A261).convertSRGBToLinear(), cP1 = new THREE.Color(0xB39DDB).convertSRGBToLinear(), cP2 = new THREE.Color(0x7FA650).convertSRGBToLinear();
  const gCone = new THREE.ConeGeometry(1, 1, 16);
  const EL0 = 22 * Math.PI / 180, AZ0 = 22 * Math.PI / 180, RIGHT = V(Math.cos(AZ0), 0, -Math.sin(AZ0)), UPV = V(-Math.sin(EL0) * Math.sin(AZ0), Math.cos(EL0), -Math.sin(EL0) * Math.cos(AZ0));
  let S, ctx_, EG, enz = null, lastF = -1, glow, BM, mWhole, mP1, mP2, PG, TT = 0;
  const floaters = [], rOut = [];

  // ── حدود الإنزيم: قطع ناقص بنتوءات خفيفة + الموقع النشط (يتغيَّر قليلاً مع f: التلاؤم المستحث) ──
  function outer(th) {
    const d = Math.abs(Math.atan2(Math.sin(th - Math.PI / 2), Math.cos(th - Math.PI / 2))), w = Math.min(1, d / 0.9) ** 2;
    const k = 1 + w * (0.04 * Math.sin(5 * th + 0.4) + 0.028 * Math.sin(9 * th + 1.3));
    return [EA * k * Math.cos(th), Math.max(-0.28, EC + EB * k * Math.sin(th))];
  }
  const fitG = f => 0.1 + 0.18 * (1 - f), fitO = f => 0.42 * (1 - f), fitH = f => 0.32 * f;   // الخلوص، اتِّساع الفوَّهة، ارتفاع الحافَّتين
  function notch(f) {                                               // مسار الموقع النشط (محلِّي) من الحافَّة اليسرى إلى اليمنى
    const g = fitG(f), op = fitO(f), h = fitH(f), xl = -1.1 - g, xr = 1.5 + g;
    const vy = TOP - 0.45, vx = 0.55 + 0.95 * ((vy - 0.2) / 2.0);
    return [[xl - op - 0.06, TOP + h], [xl - op * 0.5, TOP - 0.3], [xl, TOP - 0.9], [xl, -g], [-0.4 + g, -g], [-0.4 + g, 1.72 - 2.4 * g],
            [0.55, 0.2 - 1.9 * g], [vx + 0.903 * g + op * 0.3, vy - 0.429 * g], [xr + op * 0.5, TOP - 0.15], [xr + op + 0.06, TOP + h]];
  }
  function enzymeShape(f) {
    const n = notch(f), s = new THREE.Shape();
    const thR = Math.acos(cl((NX + n[n.length - 1][0] + 0.5) / EA, -1, 1)), thL = Math.acos(cl((NX + n[0][0] - 0.5) / EA, -1, 1));
    const pts = [];
    for (let k = 0, N = 70; k <= N; k++) { const th = thR - (thR - (thL - 2 * Math.PI)) * k / N; pts.push(outer(th)); }   // مع عقارب الساعة حول القاع
    n.forEach(([x, y]) => pts.push([NX + x, NY + y]));
    s.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) s.lineTo(pts[i][0], pts[i][1]);
    return s;
  }
  function extrude(shape, depth, bev) {
    const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: bev, bevelSize: bev * 0.8, bevelSegments: 2, steps: 1 });
    g.translate(0, 0, -depth / 2); return g;
  }
  const polyShape = P => { const s = new THREE.Shape(); s.moveTo(P[0][0] - C0[0], P[0][1] - C0[1]); P.slice(1).forEach(([x, y]) => s.lineTo(x - C0[0], y - C0[1])); return s; };
  // مجموعات R في الموقع النشط: [نقطة على الجدار (محلِّي عند f)، العمود نحو المادة المتفاعلة]
  function siteR(f) {
    const g = fitG(f), vxm = 0.55 + 0.95 * 0.45, vym = 0.2 + 2.0 * 0.45;
    return [[[-1.1 - g, 0.7], [1, 0]], [[-1.1 - g, 1.75], [1, 0]], [[-0.75, -g], [0, 1]], [[-0.4 + g, 0.75], [-1, 0]],
            [[0.1 + 0.85 * g, 0.92 + 0.5 * g], [-0.85, -0.53]], [[vxm + 0.9 * g, vym - 0.43 * g], [-0.9, 0.43]]];
  }
  // ── مواضع المادة المتفاعلة والنواتج ───────────────────────────────────────
  const wob = (i, t, a = 0.35) => V(a * Math.sin(t * 0.7 + i * 1.9), a * 0.8 * Math.sin(t * 0.9 + i * 2.7), a * 0.6 * Math.cos(t * 0.6 + i));
  function boundPose() {
    const a = sm(S.app), pos = START.clone().lerp(ENTR, a).add(V(0, 1.6 * Math.sin(Math.PI * a), 0)).add(V(0, -2.0 * sm(S.sink), 0));
    if (a < 0.02) pos.add(wob(7, TT));
    return { pos, rot: ROT0.map(r => r * (1 - a)) };
  }
  const OUT1 = V(-4.3, 2.4, 2.0), OUT2 = V(4.5, 1.5, 2.2);
  function prodPose(k) {
    const o = sm(S.out), sp = sm(S.sp), d = k === 1 ? OUT1 : OUT2, p = SEAT.clone().addScaledVector(d, o).add(V((k === 1 ? -0.07 : 0.07) * sp, 0.05 * sp * (k - 1), 0));
    if (o > 0.98) p.add(wob(k + 10, TT, 0.25));
    return { pos: p, rz: (k === 1 ? 0.7 : -0.6) * o };
  }
  function floatPos(i) {
    const f = FL[i], p = f.p.clone().add(wob(i, TT));
    if (i === 0 && S.nx > 0) { const u = sm(S.nx); return { pos: p.lerp(ENTR.clone().add(V(0, 0.7, 0)), u), rot: f.r.map(r => r * (1 - u)) }; }
    return { pos: p, rot: f.r.map((r, k) => r + 0.25 * Math.sin(TT * 0.5 + i + k)) };
  }
  // ── منحنيات طاقة التنشيط ─────────────────────────────────────────────────
  const curveY = (x, pk) => { const s = sm((x - XPK + 0.4) / 1.7); return YR * (1 - s) + YP * s + (pk - YR) * Math.exp(-(((x - XPK) / 0.72) ** 2)); };
  const PL = (x, y, dz = 0) => V(PX - PW / 2 + x, PB + (0.35 + y) * Math.max(0.001, sm(S.ae)), PZ + 0.12 + dz);   // نقطة على وجه اللوحة
  function curvePts(pk, u, dz) { const pts = [], x0 = 0.7, x1 = 8.0; for (let k = 0; k <= 60 * u; k++) { const x = x0 + (x1 - x0) * k / 60; pts.push(PL(x, curveY(x, pk), dz)); } return pts; }

  const R = (f, k) => { const [p] = siteR(f)[k]; return W(p[0], p[1], ZF + 0.16); };
  window.DIORAMA = {
    id: 'enzyme_action', title: 'كيف يعمل الإنزيم؟', subtitle: 'الأحياء – الصف الحادي عشر – الوحدة الثالثة: الإنزيمات',
    source: 'النص من كتاب الطالب: ٣-١ ما هو الإنزيم؟ و٣-٢ طريقة عمل الإنزيمات (ص ١٠٥–١٠٩) والأشكال ٣-١ و٣-٢ و٣-٤',
    legend: [['#3C6DB4', 'الإنزيم (مقطوعاً)', 'box'], ['#F4A261', 'المادة المتفاعلة', 'box'], ['#B39DDB', 'ناتج', 'box'], ['#7FA650', 'ناتج', 'box'], null,
             ['#D45AA0', 'مجموعات R المحبة للماء', 'dot'], ['#12A5A0', 'مجموعات R في الموقع النشط', 'dot'], ['#F2C94C', 'روابط مؤقتة', 'dot'], ['#24477F', 'سلسلة عديد الببتيد الملتفة', 'tube']],
    camera: { VH: 17.5, center: [-1.9, 2.4, -1.1], elevation: 22, azimuth: 22 },
    base: { L: 30, W: 11, x: 2.4, z: 0 },
    BASE: { fo: 0, zoom: 1, en: 0, rg: 0, as: 0, app: 0, sink: 0, f: 0, tb: 0, sp: 0, out: 0, nx: 0, ae: 0, c1: 0, c2: 0 },
    noGeom: ['fo', 'en', 'rg', 'as', 'app', 'sink', 'out', 'nx'],
    // التركيز: 0 المشهد، 1 الموقع النشط، 2 المادة المتفاعلة المقتربة، 3 النواتج الخارجة، 4 لوحة طاقة التنشيط
    focus(s) {
      S = s; const k = Math.round(S.fo || 0);
      // الهدف يُعرض يمين مركز الإطار وأعلاه قليلاً حتى لا تغطِّيه لوحة النص (أسفل اليسار)
      const u = 17.5 / (900 * Math.max(1, S.zoom)), sh = RIGHT.clone().multiplyScalar(190 * u).addScaledVector(UPV, 70 * u);
      let p;
      if (k === 1) p = W(0.25, 1.4, 0.8);
      else if (k === 2) p = boundPose().pos.lerp(W(0.25, 1.6, 0.8), 0.25 + 0.75 * sm(S.app));
      else if (k === 3) p = SEAT.clone().add(V(0, 1.6, 0.6));
      else if (k === 4) p = V(PX - 0.2, PB + 3.5, PZ);
      else return V(-1.9, 2.4, -1.1);
      return p.sub(sh);
    },
    STEPS: [
      { t: 'الإنزيم: عامل حفّاز حيوي',
        p: `الإنزيم ${L('Enzyme')} عامل حفّاز حيوي. هو عامل حفّاز لأنه يسرع التفاعل الكيميائي من دون أن يتغير في نهاية التفاعل، ويُعدّ حيويًّا لأن كل الإنزيمات تتكون من جزيئات حيوية، ومعظمها بروتينات. الإنزيمات البروتينية كرويّة، تنطوي على هيئة أشكال محددة.`,
        n: 'يُعرض الإنزيم هنا مقطوعاً (شريحة منه) لرؤية ما بداخله.',
        seq: [[{ en: 1 }, 2200]],
        pills: [['الإنزيم', BLU, () => V(-3.3, 5.6, ZF), -80, -70], ['المادة المتفاعلة', ORG, () => boundPose().pos, 120, -40]] },
      { t: 'شكل ثلاثي الأبعاد وموقع نشط',
        p: `تكون جزيئات الإنزيمات ملتفة في أشكال دقيقة ثلاثيّة الأبعاد، كما هو الحال في جميع البروتينات الكرويّة. ومجموعات ${L('R')} المحبة للماء، وهي السلاسل الجانبيّة الموجودة على السطح الخارجي للجزيء، تجعل هذه الجزيئات قابلة للذوبان في الماء في السيتوبلازم.`,
        n: 'الموقع النشط Active site: منطقة على جُزيء الإنزيم ترتبط فيها المادة المتفاعلة (مصطلحات علمية ص ١٠٦).',
        seq: [[{ rg: 1 }, 1600], [{ as: 1 }, 1400]],
        pills: [['مجموعات R المحبة للماء على السطح الخارجي', PNK, () => rOut[7] ? rOut[7].getWorldPosition(V(0, 0, 0)) : V(4, 2, 1), 150, 60],
                ['الموقع النشط', TEAL, () => W(0.25, 1.2, ZF), 150, -95], ['أشكال دقيقة ثلاثيّة الأبعاد', BLU, () => V(-2.2, 2.4, ZF + 0.1), -150, 40]] },
      { t: 'فرضيّة القفل والمفتاح',
        p: `لقد درست في الصف التاسع فرضية القفل والمفتاح ${L('Lock-and-key hypothesis')} التي تصف كيفية تفاعل الإنزيم مع المادة المتفاعلة. ووفقًا لهذه النظرية، فإن الموقع النشط ${L('Active site')} للإنزيم له شكل محدد، يتناسب تمامًا مع المادة المتفاعلة ليسمح بارتباطها، وهذا يعني أن الإنزيم يتّصف بالتخصصيّة.`,
        seq: [[{ '!fo': 2, zoom: 1.5 }, 900], [{ app: 1 }, 2800], [{ zoom: 2.1, sink: 0.72 }, 1500]],
        pills: [['المادة المتفاعلة (تدخل الإنزيم عند الموقع النشط للارتباط به)', ORG, () => boundPose().pos.add(V(0, 1.3, 0)), -60, -70],
                ['الموقع النشط له شكل محدد', TEAL, () => W(1.0, 0.6, ZF), 190, 60]] },
      { t: 'فرضيّة التلاؤم المستحث',
        p: `في عام ${L('1959')} م، عُدّلت فرضية القفل والمفتاح في ضوء الدليل على أن جزيئات الإنزيم أكثر مرونة ممّا تقترحه فرضيّة القفل والمفتاح. تُعرف الفرضيّة الحديثة لطريقة عمل الإنزيم باسم فرضيّة التلاؤم المستحث ${L('Induced-fit hypothesis')}، والتي تفترض أنه يمكن للإنزيم، وأحيانًا للمادة المتفاعلة، أن يغيّر شكله تغييرًا طفيفًا، عند دخول المادة المتفاعلة إلى الإنزيم، لضمان التلاؤم المثالي؛ الأمر الذي يجعل نشاطه أكثر كفاءة.`,
        n: 'لاحظ حافَّتَي الموقع النشط: تقتربان وترتفعان قليلاً لتحيطا بالمادة المتفاعلة.',
        seq: [[{ '!fo': 1, zoom: 2.5 }, 800], [{ sink: 1, f: 1 }, 2600]],
        pills: [['يتغير شكل الموقع النشط لضمان التلاؤم المثالي', TEAL, () => W(1.5 + fitG(S.f) + fitO(S.f) + 0.06, TOP + fitH(S.f), ZF), 170, 30],
                ['المادة المتفاعلة', ORG, () => boundPose().pos.add(V(-0.8, 1.1, 0.9)), -140, -60]] },
      { t: 'معقد الإنزيم–المادة المتفاعلة',
        p: `وفي الموقع النشط، عندما يرتبط الإنزيم بالمادة المتفاعلة، تتكوّن روابط مؤقتة بين المادة المتفاعلة وبعض مجموعات ${L('R')} من الأحماض الأمينيّة في الإنزيم، فينتج معقد الإنزيم-المادة المتفاعلة.`,
        n: 'الشكل ٣-١: مع ارتباط المادة المتفاعلة بالإنزيم، يتغير شكل الموقع النشط لضمان التلاؤم المثالي اللازم للارتباط، فيتكون معقد الإنزيم–المادة المتفاعلة.',
        seq: [[{ '!fo': 1, zoom: 2.5 }, 300], [{ tb: 1 }, 2000]],
        pills: [['روابط مؤقتة', GLD, () => R(S.f, 1).add(V(0.06, 0, 0)), -150, -40], ['بعض مجموعات R من الأحماض الأمينيّة في الإنزيم', TEAL, () => R(S.f, 5), 170, 40],
                ['معقد الإنزيم–المادة المتفاعلة', BLU, () => W(0.2, 2.6, ZF), 60, -110]] },
      { t: 'تحوُّل المادة المتفاعلة إلى نواتج',
        p: 'يمكن أن يحفز الإنزيم تفاعلًا يتفكك فيه جُزيء المادة المتفاعلة إلى جزيئين أو أكثر حسب فرضية التلاؤم المستحث، كما يبيّن الشكل ٣-١. تتحوّل المادة المتفاعلة إلى نواتج.',
        n: 'الشكل ٣-٢ يبيّن أيضًا معقد الإنزيم-الناتج الذي يتكوّن لمدّة قصيرة قبل تحرّر الناتج.',
        seq: [[{ '!fo': 1, zoom: 2.5 }, 300], [{ sp: 1 }, 2400]],
        pills: [['معقد الإنزيم–النواتج', BLU, () => W(0.2, 2.6, ZF), 60, -110], ['ناتج', PUR, () => prodPose(1).pos.add(V(-0.4, -0.3, ZF - ZS)), -150, 20], ['ناتج', GRN, () => prodPose(2).pos.add(V(0.5, 0.1, ZF - ZS)), 150, 20]] },
      { t: 'خروج النواتج وبقاء الإنزيم دون تغيير',
        p: 'وعندما يكتمل التفاعل، يترك الناتج الموقع النشط، من دون أن يحدث أي تغيّر في الإنزيم، بحيث يصبح متاحًا الآن ليرتبط فيه أي جُزيء آخر من مادة متفاعلة. يمكن أن يكون معدل التفاعل الكلي مرتفعًا جدًا.',
        n: 'الشكل ٣-٢: لاحظ أن الإنزيم قد تغير شكله قليلًا عند ارتباطه بالمادة المتفاعلة، ولكنه يعود إلى شكله السابق بعد تحفيز التفاعل.',
        seq: [[{ '!fo': 3, zoom: 1.7, tb: 0 }, 900], [{ out: 1, f: 0 }, 2600], [{ zoom: 1 }, 1000], [{ '!fo': 0, nx: 1 }, 2400]],
        pills: [['نواتج (تترك الموقع النشط)', GRN, () => prodPose(2).pos.add(V(0.4, 0.6, ZF - ZS)), 170, 70], ['ناتج', PUR, () => prodPose(1).pos.add(V(-0.5, 0.4, ZF - ZS)), -90, -60],
                ['الإنزيم (يتحرر دون أي تغيير ليرتبط فيه جزيء آخر من مادة متفاعلة)', BLU, () => V(2.6, 1.0, ZF), 120, 95],
                ['جزيء آخر من مادة متفاعلة', ORG, () => floatPos(0).pos, -170, -20]] },
      { t: 'الإنزيمات تخفض طاقة التنشيط',
        p: `لا تتحول المادة المتفاعلة في كثير من التفاعلات إلى نواتج قبل تزويدها ببعض الطاقة. تسمّى هذه الطاقة طاقة التنشيط ${L('Activation Energy')} الشكل ٣-٤أ. تتجاوز الإنزيمات هذا الأمر لأنها تخفض طاقة تنشيط التفاعلات التي تحفزها، كما هو مبين في الشكل ٣-٤ب. وهي تقوم بذلك باحتواء المادة أو المواد المتفاعلة بطريقة يمكن لجزيئاتها أن تتفاعل بسهولة.`,
        n: 'رُسم المنحنيان (أ) بدون الإنزيم و(ب) بوجود الإنزيم على لوحة واحدة للمقارنة.',
        seq: [[{ '!fo': 4, zoom: 1.6, ae: 1 }, 1700], [{ c1: 1 }, 2000], [{ c2: 1 }, 2000]],
        pills: [['طاقة التنشيط (بدون الإنزيم)', RED, () => PL(XPK - 0.5, (YR + PKA) / 2 + 0.4), -190, -40], ['طاقة التنشيط (بوجود الإنزيم)', GRN, () => PL(XPK + 0.5, (YR + PKB) / 2), 210, -60],
                ['مادة متفاعلة', GRY, () => PL(1.4, YR), -110, -45], ['نواتج', GRY, () => PL(7.2, YP), 60, -45], ['سير التفاعل', GRY, () => PL(6.6, 0.0), 30, 50], ['طاقة', GRY, () => PL(0.3, 5.4), -70, 0]] },
    ],
    setup(ctx) {
      ctx_ = ctx;
      EG = new THREE.Group(); ctx.scene.add(EG);
      // سلسلة ملتفَّة على وجه المقطع (تبسيط: الإنزيم بروتين كروي ملتفٌّ في شكل ثلاثي الأبعاد)
      const CP = [], hel = (a, b, turns) => {                     // لولب على وجه المقطع (نصفه داخل الوجه)
        const A = V(a[0], a[1], 0), B = V(b[0], b[1], 0), d = B.clone().sub(A), len = d.length(); d.normalize(); const nn = V(-d.y, d.x, 0);
        for (let k = 0, N = turns * 16; k <= N; k++) { const ph = 2 * Math.PI * turns * k / N; CP.push(A.clone().addScaledVector(d, len * k / N).addScaledVector(nn, 0.34 * Math.cos(ph)).add(V(0, 0, ZF + 0.12 + 0.34 * Math.sin(ph)))); }
      }, lp = (...pts) => pts.forEach(([x, y]) => CP.push(V(x, y, ZF + 0.16)));
      lp([-2.0, 5.2], [-2.9, 4.9]); hel([-3.5, 4.1], [-3.3, 1.6], 7); lp([-2.6, 0.9], [-1.8, 1.4]); hel([-1.6, 2.2], [-0.2, 3.4], 6);
      lp([0.6, 3.0], [0.2, 2.0]); hel([-0.6, 0.9], [1.9, 0.9], 7); lp([2.7, 1.3], [2.3, 2.3]); hel([2.0, 3.0], [3.5, 4.0], 6); lp([3.6, 3.0], [3.4, 1.9]);
      const tube = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(CP), 900, 0.075, 8, false), matChain);
      tube.castShadow = true; EG.add(tube);
      // مجموعات R المحبَّة للماء على السطح الخارجي
      for (let i = 0, k = 0; i < 26; i++) {
        const th = Math.PI / 2 + 0.62 + i * (2 * Math.PI - 1.24) / 25; if (Math.sin(th) < -0.93) continue;
        const [x, y] = outer(th), nrm = V(Math.cos(th) / EA, Math.sin(th) / EB, 0).normalize();
        for (const z of (k++ % 2 ? [0.8, -0.7] : [0.05])) {
          const b = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), matRo); b.position.set(x + nrm.x * 0.12, y + nrm.y * 0.12, z); b.castShadow = true; EG.add(b); rOut.push(b);
        }
      }
      glow = ctx.blob(0x2FD5C8, 0.0, EG); glow.position.copy(W(0.2, 1.25, 0)); glow.scale.set(1.75, 1.45, 1.9);
      // جزيء المادة المتفاعلة الذي سيرتبط: كاملاً، ثمَّ قطعتان (ناتجان)
      BM = new THREE.Group(); ctx.scene.add(BM);
      mWhole = ctx.mesh(extrude(polyShape(SUB), DS, 0.08), matSub, null, BM);
      mP1 = ctx.mesh(extrude(polyShape(PR1), DS, 0.08), matP1, null, ctx.scene);
      mP2 = ctx.mesh(extrude(polyShape(PR2), DS, 0.08), matP2, null, ctx.scene);
      const gSub = extrude(polyShape(SUB), DS, 0.08);
      FL.forEach(() => floaters.push(ctx.mesh(gSub, matSub)));
      // لوحة طاقة التنشيط
      PG = new THREE.Group(); ctx.scene.add(PG); PG.position.set(PX, PB, PZ);
      ctx.mesh(new THREE.BoxGeometry(PW, PH, 0.16), matPlate, V(0, PH / 2, 0), PG);
      ctx.mesh(new THREE.BoxGeometry(PW + 0.3, 0.3, 1.2), matSide, V(0, 0.15, 0.2), PG);
      const ax = (a, b) => { const d = b.clone().sub(a), o = ctx.mesh(new THREE.CylinderGeometry(0.045, 0.045, d.length(), 8), matAx, a.clone().lerp(b, 0.5), PG); o.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize()); };
      const lx = x => x - PW / 2, ly = y => 0.35 + y;
      ax(V(lx(0.45), ly(0), 0.12), V(lx(0.45), ly(5.8), 0.12)); ax(V(lx(0.45), ly(0), 0.12), V(lx(8.25), ly(0), 0.12));
      const tip1 = ctx.mesh(gCone, matAx, V(lx(0.45), ly(5.9), 0.12), PG); tip1.scale.set(0.14, 0.32, 0.14);
      const tip2 = ctx.mesh(gCone, matAx, V(lx(8.35), ly(0), 0.12), PG); tip2.scale.set(0.14, 0.32, 0.14); tip2.rotation.z = -Math.PI / 2;
      for (const [y, x0, x1] of [[YR, 0.6, 7.9], [YP, 0.6, 7.9]]) for (let x = x0; x < x1; x += 0.36) ctx.mesh(new THREE.BoxGeometry(0.2, 0.035, 0.03), matDash, V(lx(x), ly(y), 0.1), PG);
    },
    rebuild(s, ctx) {
      S = s; ctx_ = ctx;
      // مجموعات R في الموقع النشط والروابط المؤقتة (على وجه المقطع)
      if (S.en > 0.98) {
        siteR(S.f).forEach(([p, nv], k) => {
          const a = W(p[0], p[1], ZF + 0.16), b = W(p[0] + nv[0] * (fitG(S.f) + 0.3), p[1] + nv[1] * (fitG(S.f) + 0.3), ZF + 0.16);
          ctx.ball(a, 0.15 * Math.max(0.001, sm(S.as)), matRa);
          if (S.tb > 0.02 && S.sp < 0.5) { const u = sm(S.tb); for (let q = 1; q <= 3; q++) ctx.ball(a.clone().lerp(b, q / 3), 0.075 * u, matTB); ctx.rod(a, a.clone().lerp(b, u), 0.03, matTB); }
        });
      }
      // منحنيا طاقة التنشيط وسهماها
      if (S.ae > 0.02) {
        const arrow = (pk, mat, u) => { if (u < 0.05) return; const xa = XPK + (pk > 4 ? -0.16 : 0.16), dz = pk > 4 ? 0 : 0.2, a = PL(xa, YR, dz), b = PL(xa, YR + (curveY(xa, pk) - 0.28 - YR) * u, dz); ctx.rod(a, b, 0.07, mat); const t = new THREE.Mesh(gCone, mat); t.scale.set(0.17, 0.32, 0.17); t.position.copy(b).add(V(0, 0.14, 0)); ctx.dyn.add(t); };
        if (S.c1 > 0.01) { ctx.tubePts(curvePts(PKA, S.c1, 0), 0.075, matA); arrow(PKA, matA, cl((S.c1 - 0.5) / 0.5)); }
        if (S.c2 > 0.01) { ctx.tubePts(curvePts(PKB, S.c2, 0.2), 0.075, matB); arrow(PKB, matB, cl((S.c2 - 0.5) / 0.5)); }
      }
    },
    place(s) {
      S = s;
      const e = Math.max(0.001, sm(S.en)); EG.scale.set(e, e, e); EG.position.set(0, 0, 0);
      if (Math.abs(S.f - lastF) > 1e-4 || !enz) {
        const g = extrude(enzymeShape(S.f), DE, 0.12);
        if (!enz) { enz = new THREE.Mesh(g, [matCut, matSide]); enz.castShadow = enz.receiveShadow = true; EG.add(enz); } else { enz.geometry.dispose(); enz.geometry = g; }
        lastF = S.f;
      }
      const rg = Math.max(0.001, sm(S.rg)) * 0.2; rOut.forEach(b => b.scale.setScalar(rg));
      glow.visible = S.as > 0.01 && S.app < 0.98; glow.material.opacity = 0.32 * sm(S.as) * (1 - sm(S.app));
      // المادة المتفاعلة المرتبطة (كاملة حتى التحوُّل، ثمَّ ناتجان)
      const bp = boundPose(); BM.position.copy(bp.pos); BM.rotation.set(...bp.rot); BM.visible = S.sp < 0.02;
      const sp = sm(S.sp);
      [mP1, mP2].forEach((m, i) => { const pp = prodPose(i + 1); m.visible = S.sp >= 0.02; m.position.copy(pp.pos); m.rotation.set(0, 0, pp.rz); });
      matP1.color.copy(cSub).lerp(cP1, sp); matP2.color.copy(cSub).lerp(cP2, sp);
      floaters.forEach((m, i) => { const fp = floatPos(i); m.position.copy(fp.pos); m.rotation.set(...fp.rot); });
      PG.visible = S.ae > 0.005; PG.scale.set(1, Math.max(0.001, sm(S.ae)), 1);
    },
    idle(t, s, ctx, tweening) {
      TT = t; S = s; this.place(s);
      if (glow.visible) { const k = 1 + 0.05 * Math.sin(t * 3); glow.scale.set(1.75 * k, 1.45 * k, 1.9 * k); }
    },
  };
})();
