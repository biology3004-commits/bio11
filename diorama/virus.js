/* ديوراما: الفيروسات — فيروس كورونا (سارس-كوفيد-2) يُبنى طبقةً طبقة ثمَّ يُقارَن حجمه بالبكتيريوم ويُعرض تطفُّله — الدرس ١-٦ (كتاب الطالب ص ٥٣–٥٤، الشكل ١-١٧ والصورة ١-٢١) */
(function () {
  const { V, sm, M, CSS } = DioramaCore;
  const { BLU, RED, GLD, TEAL, PNK, GRY, GRN, ORG, PUR } = CSS;
  let S;
  const O = {};                                                        // الكائنات الدائمة
  const TAU = Math.PI * 2;

  // ── هندسة المشهد ──
  const AZ = 35, EL = 28;                                              // زاويتا الكاميرا (بالدرجات)
  const az = AZ * Math.PI / 180;
  const RIGHT = V(Math.cos(az), 0, -Math.sin(az));                     // يمين الشاشة على اللوح
  const VC = V(0, 3.0, 0);                                             // مركز الفيروس
  const RO = 2.4, RI = 2.14;                                           // نصفا قطر الغلاف (طبقة مزدوجة من الدهون المفسفرة؛ السُّمك مُبالَغ فيه)
  const PHI_C = Math.atan2(Math.cos(az), -Math.sin(az));               // اتجاه الكاميرا بإحداثيِّ φ في SphereGeometry
  const W0 = 1.75;                                                      // عرض الشقِّ المقطوع من الغلاف (راديان)
  const dirPhi = (phi) => V(-Math.cos(phi), 0, Math.sin(phi));
  // البكتيريوم (للمقارنة: قطره 1 µm وطوله 2.5 µm تقريباً) والفيروس المصغَّر (80 nm)
  const BW = 3.2, BL = 8.0, BC = V(-4.4, -0.3 + BW / 2, 1.4);
  const SV = 0.08 * BW / (2 * RO);                                      // 80 nm بالمقياس نفسه (1 µm = BW وحدة)
  const VS = BC.clone().addScaledVector(RIGHT, BL / 2 + 0.9); VS.y = -0.3 + 0.08 * BW / 2 * 1.25;
  // الخليَّة المضيفة (قبَّة مقطوعة)
  const HC = V(-0.2, -0.3, -1.8), RD = 3.4;
  const rnd = (() => { let s = 7654321; return () => (s = (s * 48271) % 2147483647) / 2147483647; })();

  // ── RNA: سلسلة ملتفَّة داخل الفيروس (تشبه الشكل ١-١٧ أ) ──
  const RNA_RAW = [];
  for (let k = 0; k <= 70; k++) {
    const t = k / 70, a = TAU * 1.65 * t + 0.6, r = 1.28 * (1 - 0.22 * t);
    RNA_RAW.push(V(r * Math.cos(a) + 0.12 * Math.sin(5 * a), 1.1 - 2.25 * t + 0.22 * Math.sin(3 * a), r * Math.sin(a) + 0.1 * Math.cos(4 * a)));
  }
  const RNA_CURVE = new THREE.CatmullRomCurve3(RNA_RAW);
  const NB = 88, FR = RNA_CURVE.computeFrenetFrames(NB, false);
  const BEADS = [];                                                    // الكابسوميرات ملتفَّة حول RNA
  for (let i = 0; i < NB; i++) {
    const u = (i + 0.5) / NB, p = RNA_CURVE.getPointAt(u), a = i * 1.15;
    const n = FR.normals[i], b = FR.binormals[i];
    BEADS.push(p.clone().addScaledVector(n, 0.15 * Math.cos(a)).addScaledVector(b, 0.15 * Math.sin(a)));
  }
  // بروتينات الغلاف: توزيع فيبوناتشي على الكرة
  const SPK = [];
  const NS = 58;
  for (let i = 0; i < NS; i++) {
    const y = 1 - 2 * (i + 0.5) / NS, r = Math.sqrt(1 - y * y), th = i * 2.399963;
    const d = V(r * Math.cos(th), y, r * Math.sin(th));
    const phi = Math.atan2(d.z, -d.x);                                 // φ بحسب اصطلاح SphereGeometry
    SPK.push({ d, phi });
  }
  const angDist = (a, b) => { let x = (a - b) % TAU; if (x < -Math.PI) x += TAU; if (x > Math.PI) x -= TAU; return Math.abs(x); };

  const trans = (c, op, extra) => { const m = new THREE.MeshStandardMaterial(Object.assign({ color: c, transparent: true, opacity: op, roughness: 0.35, depthWrite: false }, extra || {})); m.color.convertSRGBToLinear(); return m; };
  const DS = THREE.DoubleSide;

  // وجه مقطع: قطاع حلقي في المستوى الرأسي عند الزاوية φ (θ من th0 إلى th1)
  function faceGeom(ri, ro, phi, th0, th1, n) {
    const d = dirPhi(phi), pos = [], idx = [];
    for (let k = 0; k <= n; k++) {
      const th = th0 + (th1 - th0) * k / n, s = Math.sin(th), c = Math.cos(th);
      for (const r of [ri, ro]) pos.push(r * s * d.x, r * c, r * s * d.z);
      if (k < n) { const a = 2 * k; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); return g;
  }
  // كرة (أو قبَّة) مقطوع منها شقٌّ عرضه w يواجه الكاميرا: السطحان والوجهان
  function cutShell(g, ri, ro, w, thMax, mats) {
    for (const o of g.children.slice()) { g.remove(o); o.geometry.dispose(); }
    const ps = PHI_C + w / 2, pl = TAU - w;
    for (const r of [ro, ri]) { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 72, 40, ps, pl, 0, thMax), mats.surf); m.castShadow = m.receiveShadow = true; g.add(m); }
    if (w > 0.01) for (const phi of [ps, ps + pl]) { const m = new THREE.Mesh(faceGeom(ri, ro, phi, 0, thMax, 48), mats.face); m.receiveShadow = true; g.add(m); }
  }
  // فيروس مصغَّر (للخليَّة المضيفة): غلاف ونتوءات بروتينيَّة
  function miniVirion(parent, r, matEnv, matSpk) {
    const g = new THREE.Group(); parent.add(g);
    const s = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 14), matEnv); s.castShadow = true; g.add(s);
    for (let i = 0; i < 14; i++) {
      const y = 1 - 2 * (i + 0.5) / 14, q = Math.sqrt(1 - y * y), th = i * 2.399963;
      const b = new THREE.Mesh(new THREE.SphereGeometry(r * 0.27, 10, 8), matSpk); b.position.set(q * Math.cos(th), y, q * Math.sin(th)).multiplyScalar(r * 1.25); g.add(b);
    }
    return g;
  }

  let lastShut = -1, lastRna = -1;
  window.DIORAMA = {
    id: 'virus', title: 'الفيروسات: تركيب فيروس كورونا طبقةً طبقة',
    subtitle: 'الأحياء — الصف الحادي عشر — الوحدة الأولى: تركيب الخليَّة',
    source: 'النص من كتاب الطالب: ١-٦ الفيروسات (ص ٥٣–٥٤)، الشكل ١-١٧ والصورة ١-٢١',
    legend: [['#D23C8C', 'RNA (الجينوم)', 'tube'], ['#B5443A', 'كابسومير (المحفظة)', 'dot'], ['#7FB6E6', 'غلاف (دهون مفسفرة)'], ['#F28C28', 'بروتين الغلاف'], null,
             ['#6C7A89', 'بكتيريوم'], ['#D9A441', 'الخليّة المضيفة'], ['#9D7BD8', 'نواة'], ['#9ED3A8', 'حويصلات جولجي']],
    camera: { VH: 10.8, center: [VC.x - 1.7 * RIGHT.x, VC.y + 0.9, VC.z - 1.7 * RIGHT.z], elevation: EL, azimuth: AZ },
    base: { L: 20, W: 12, x: -1.2, z: 0.2 },
    BASE: { fo: 0, el: EL, rna: 0, cap: 0, env: 0, spk: 0, shut: 0, shr: 0, bac: 0, hid: 0, host: 0, inf: 0, rep: 0 },
    noGeom: ['fo', 'rna', 'cap', 'env', 'spk', 'shut', 'shr', 'bac', 'hid', 'host', 'inf', 'rep'],
    // نقطة التركيز: 0 مركز الفيروس، 1 كابسومير، 2 حافَّة مقطع الغلاف، 3 الفيروس المصغَّر
    focus(s) {
      S = s; const k = Math.round(S.fo || 0);
      if (k === 1) return O.VG.localToWorld(BEADS[30].clone());
      if (k === 2) return O.VG.localToWorld(dirPhi(PHI_C + W0 / 2).multiplyScalar(RO * Math.sin(0.9)).add(V(0, RO * Math.cos(0.9), 0)));
      if (k === 3) return O.VG.position.clone();
      return VC.clone();
    },
    STEPS: [
      { t: 'الفيروسات: «جُسيمات» أصغر بكثير من البكتيريا',
        p: 'عام 1892 م، اكتشف العالم الروسي دمتري إيفانوفسكي <span class="ltr">Dmitry Ivanovsky</span> وجود بعض العوامل التي تؤدّي إلى انتقال أمراض محدّدة. وهي، خلافًا للبكتيريا، يمكن أن تمرّ عبر مرشّحات دقيقة جدًا. كان هذا أول دليل على وجود الفيروسات. الفيروسات <span class="ltr">Viruses</span> «جُسيمات» أصغر بكثير من البكتيريا، وتقع على الحدّ الفاصل بين ما نعتقد أنه حيّ وغير حيّ.',
        n: 'يُبنى في الخطوات التالية فيروس كورونا (سارس-كوفيد-2) كما في الشكل ١-١٧، ونصفه الأمامي مقطوع لرؤية ما بداخله.',
        seq: [[{}, 0]],
        pills: [['«جُسيمات» أصغر بكثير من البكتيريا', GRY, () => VC.clone().add(V(0, RO * 0.7, 0)), -200, -40],
                ['على الحدّ الفاصل بين ما نعتقد أنه حيّ وغير حيّ', BLU, () => VC.clone().addScaledVector(RIGHT, RO * 0.9), 150, 120]] },
      { t: 'ليس للفيروسات تركيب خلوي: الجينوم',
        p: 'ليس للفيروسات تركيب خلوي، على العكس من بدائيّة النواة وحقيقيّة النواة. أي أنها غير محاطة بغشاء منفذ جزئيًا ولا تحتوي على سيتوبلازم ورايبوسومات. وهي بسيطة جدًا في تركيبها، إذ تتكوّن فقط من: جُزيء ذاتي التكاثر من <span class="ltr">DNA</span> أو <span class="ltr">RNA</span> (الجينوم أو التعليمات الجينيّة الكاملة).',
        n: 'الفيروس المعروض فيروس RNA كما في الشكل ١-١٧؛ ولفيروسات أخرى جينوم من DNA.',
        seq: [[{ rna: 1 }, 3200]],
        pills: [['<span class="ltr">RNA</span>', PNK, () => O.VG.localToWorld(RNA_CURVE.getPointAt(0.12)), 120, -110],
                ['جُزيء ذاتي التكاثر من <span class="ltr">DNA</span> أو <span class="ltr">RNA</span>', PUR, () => O.VG.localToWorld(RNA_CURVE.getPointAt(0.8)), -40, 150],
                ['لا تحتوي على سيتوبلازم ورايبوسومات', GRY, () => VC.clone().addScaledVector(RIGHT, -RO * 0.85).add(V(0, 0.6, 0)), -120, -150]] },
      { t: 'المحفظة: جُزيئات بروتين تُسمّى كابسوميرات',
        p: 'غلاف واقٍ من جُزيئات البروتين يسمّى المحفظة <span class="ltr">Capsid</span>. يبين الشكل ١-١٧ أ المحفظة التي تتكون من جُزيئات بروتين منفصلة، يسمّى كلّ منها كابسومير <span class="ltr">Capsomere</span>. الفيروس هو فيروس <span class="ltr">RNA</span>. المحفظة تحيط <span style="white-space:nowrap">بـ&nbsp;<span class="ltr">RNA</span>.</span>',
        seq: [[{ '!fo': 1, zoom: 2.0 }, 900], [{ cap: 1 }, 3200], [{ zoom: 1 }, 900]],
        pills: [['كابسومير', RED, () => O.VG.localToWorld(BEADS[30].clone()), 210, -40],
                ['محفظة', ORG, () => O.VG.localToWorld(BEADS[62].clone()), -130, 110],
                ['المحفظة تحيط بـ <span class="ltr">RNA</span>', PNK, () => O.VG.localToWorld(BEADS[8].clone()), -240, -70]] },
      { t: 'الغلاف: دهون مفسفرة تبرز منها البروتينات',
        p: 'لبعض الفيروسات طبقة خارجيّة شبيهة بغشاء تسمّى الغلاف <span class="ltr">Envelope</span>، تتكوّن من دهون مفسفرة <span class="ltr">Phospholipids</span> وقد تبرز البروتينات من الغلاف. تشكل طبقة مزدوجة من الدهون المفسفرة التركيب الأساسي لجميع أغشية الخلايا.',
        n: 'سُمك الغلاف مُكبَّر في الرسم لتظهر الطبقة المزدوجة.',
        seq: [[{ env: 1 }, 2600], [{ '!fo': 2, zoom: 2.3 }, 900], [{ zoom: 1 }, 800], [{ spk: 1 }, 2000]],
        pills: [['غلاف', BLU, () => O.VG.localToWorld(dirPhi(PHI_C - 0.9).multiplyScalar(RO).add(V(0, 0.9, 0)).normalize().multiplyScalar(RO)), -150, -60],
                ['طبقة مزدوجة من الدهون المفسفرة', TEAL, () => O.VG.localToWorld(dirPhi(PHI_C + W0 / 2).multiplyScalar((RO + RI) / 2 * Math.sin(1.05)).add(V(0, (RO + RI) / 2 * Math.cos(1.05), 0))), 170, -40],
                ['بروتين الغلاف', ORG, () => { const s = SPK[6]; return O.VG.localToWorld(s.d.clone().multiplyScalar(RO + 0.47)); }, 120, -60]] },
      { t: 'فيروس كورونا (سارس-كوفيد-2) كاملاً',
        p: 'الشكل١-١٧ والصورة ١-٢١ يبيّنان تركيب فيروس كورونا سارس-كوفيد-2 له غلاف. عادة ما يكون للفيروسات شكل متماثل جدًا. قطر جُسيم الفيروس <span class="ltr">80 nm</span> تقريبًا.',
        n: 'يُغلق المقطع ليظهر الجُسيم كاملاً كما في الشكل ١-١٧ ب.',
        seq: [[{ shut: 1 }, 2600]],
        pills: [['قطر جُسيم الفيروس <span class="ltr">80 nm</span> تقريبًا', BLU, () => VC.clone().addScaledVector(RIGHT, -RO), -130, 90],
                ['شكل متماثل جدًا', GRY, () => VC.clone().add(V(0, RO, 0)), 120, -60],
                ['بروتين الغلاف', ORG, () => { const s = SPK[6]; return O.VG.localToWorld(s.d.clone().multiplyScalar(RO + 0.47)); }, 140, 40]] },
      { t: 'الحجم: الفيروس مقارنةً بالبكتيريوم',
        p: 'يتراوح حجم الفيروسات بين <span class="ltr">20 nm</span> و <span class="ltr">300 nm</span> (أصغر 50 مرّة تقريبًا في المتوسط من البكتيريا).',
        n: 'الرسم بمقياس واحد تقريبًا: جُسيم قطره 80 nm بجوار بكتيريوم قطره 1 µm (قطر البكتيريا 1-5 µm تقريبًا، الشكل ١-١٦ ص ٥٠).',
        seq: [[{ zoom: 0.8, shr: 1 }, 2600], [{ bac: 1 }, 1800]],
        pills: [['فيروس: <span class="ltr">80 nm</span> تقريبًا', RED, () => O.VG.position.clone().add(V(0, 0.32, 0)), 110, -110],
                ['بكتيريوم: قطر الخلايا <span class="ltr">1-5 µm</span> تقريبًا', GRY, () => BC.clone().add(V(0, BW / 2, 0)), -60, -120],
                ['حجم الفيروسات بين <span class="ltr">20 nm</span> و <span class="ltr">300 nm</span>', BLU, () => O.VG.position.clone().addScaledVector(RIGHT, 0.32), 170, 90]] },
      { t: 'متطفِّلة: تتكاثر فقط داخل الخلايا المضيفة',
        p: 'جميع الفيروسات متطفّلة لأنها تتكاثر فقط عبر إصابة الخلايا (الدخول إلى خلايا مضيفة) والاستيلاء عليها (استخدام عُضيّاتها وإنزيماتها لبناء بروتينات فيروسية وإنتاج فيروسات جديدة). يتولّى <span class="ltr">DNA</span> أو <span class="ltr">RNA</span> الفيروس آليّة بناء البروتين في الخليّة المضيفة، والتي تساعد بعد ذلك على تكوين جُزيئات فيروس جديدة.',
        n: 'تبسيط: الكتاب لا يفصّل مراحل التكاثر؛ يُعرض الدخول ثم ظهور جُسيمات جديدة ضمن حويصلات جولجي كما في الصورة ١-٢١. المقياس غير حقيقي: الفيروسات مكبَّرة كثيرًا بالنسبة إلى الخليّة.',
        seq: [[{ bac: 0, hid: 1, el: 46, zoom: 0.95 }, 1600], [{ host: 1 }, 1600], [{ inf: 1 }, 2600], [{ rep: 1 }, 3000]],
        pills: [['الخليّة المضيفة', GLD, () => HC.clone().addScaledVector(RIGHT, -RD * 0.92).add(V(0, 0.8, 0)), -110, -90],
                ['الدخول إلى خلايا مضيفة', ORG, () => O.HG.localToWorld(O.entPos[0].clone()), 160, -60],
                ['جُسيمات فيروس كورونا ضمن حويصلات جولجي', GRN, () => O.HG.localToWorld(O.vesPos[0].clone()), 170, 70],
                ['إنتاج فيروسات جديدة', RED, () => O.HG.localToWorld(O.vesPos[1].clone()), -60, -190]] },
      { t: 'الخلاصة: تركيب الفيروس',
        p: 'ليس للفيروسات تركيب خلوي، وهي صغيرة وبسيطة جدًا، وتتكوّن من جُزيء <span class="ltr">DNA</span> أو <span class="ltr">RNA</span>، ومن محفظة، وأحيانًا من غلاف خارجي.',
        seq: [[{ host: 0, el: EL, zoom: 1 }, 1500], [{ hid: 0, shr: 0 }, 2200], [{ shut: 0 }, 1800]],
        pills: [['<span class="ltr">RNA</span>', PNK, () => O.VG.localToWorld(RNA_CURVE.getPointAt(0.12)), 120, -120],
                ['محفظة', RED, () => O.VG.localToWorld(BEADS[62].clone()), -130, 110],
                ['غلاف', BLU, () => O.VG.localToWorld(dirPhi(PHI_C - 0.9).multiplyScalar(RO).add(V(0, 0.9, 0)).normalize().multiplyScalar(RO)), -150, -60],
                ['بروتين الغلاف', ORG, () => { const s = SPK[6]; return O.VG.localToWorld(s.d.clone().multiplyScalar(RO + 0.47)); }, 120, -60]] },
    ],
    setup(ctx) {
      const sc = ctx.scene; ctx.renderer.localClippingEnabled = true;
      O.pe = new THREE.Plane(V(0, -1, 0), 0);                          // مسح تكوُّن الغلاف من الأسفل إلى الأعلى
      const VG = O.VG = new THREE.Group(); VG.position.copy(VC); sc.add(VG);
      // ظلُّ الفيروس قبل بنائه
      O.ghost = new THREE.Mesh(new THREE.SphereGeometry(RO, 48, 32), trans(0x9AA5B1, 0.2, { side: DS })); VG.add(O.ghost);
      // RNA
      O.matRna = M(0xD23C8C, { roughness: 0.4 });
      O.rna = new THREE.Mesh(new THREE.BufferGeometry(), O.matRna); O.rna.castShadow = true; O.rna.visible = false; VG.add(O.rna);
      // الكابسوميرات
      const matCap = M(0xB5443A, { roughness: 0.45 }), gB = new THREE.SphereGeometry(0.115, 14, 10);
      O.beads = BEADS.map(p => { const m = new THREE.Mesh(gB, matCap); m.position.copy(p); m.castShadow = true; VG.add(m); return m; });
      // الغلاف: سطحان + وجها المقطع + رؤوس الدهون المفسفرة على حافَّتي المقطع
      O.envMats = { surf: M(0x7FB6E6, { side: DS, roughness: 0.45, clippingPlanes: [O.pe], clipShadows: true }),
                    face: M(0xF2E3B3, { side: DS, roughness: 0.8, clippingPlanes: [O.pe], clipShadows: true }) };
      O.env = new THREE.Group(); VG.add(O.env);
      const NH = 54;
      O.heads = new THREE.InstancedMesh(new THREE.SphereGeometry(0.062, 10, 8), M(0x2F6DB5, { roughness: 0.4, clippingPlanes: [O.pe] }), NH * 4);
      O.heads.castShadow = true; VG.add(O.heads); O.NH = NH;
      // بروتينات الغلاف (ساق وقبعة)
      const matS = M(0xF28C28, { roughness: 0.45 }), gStalk = new THREE.CylinderGeometry(0.045, 0.05, 0.36, 8), gCap = new THREE.CylinderGeometry(0.15, 0.12, 0.1, 14);
      O.spk = SPK.map(s => {
        const g = new THREE.Group(); g.position.copy(s.d).multiplyScalar(RO - 0.02); g.quaternion.setFromUnitVectors(V(0, 1, 0), s.d);
        const a = new THREE.Mesh(gStalk, matS); a.position.y = 0.18; a.castShadow = true; g.add(a);
        const b = new THREE.Mesh(gCap, matS); b.position.y = 0.4; b.castShadow = true; g.add(b);
        VG.add(g); return g;
      });
      // البكتيريوم للمقارنة: عصوي مغلق
      const prof = [], hl = (BL - BW) / 2, rr = BW / 2;
      for (let k = 0; k <= 12; k++) { const t = Math.PI / 2 * k / 12; prof.push(new THREE.Vector2(rr * Math.sin(t), -hl - rr * Math.cos(t))); }
      for (let k = 0; k <= 12; k++) { const t = Math.PI / 2 * k / 12; prof.push(new THREE.Vector2(rr * Math.cos(t), hl + rr * Math.sin(t))); }
      O.bac = new THREE.Group(); O.bac.position.copy(BC); sc.add(O.bac);
      const bm = new THREE.Mesh(new THREE.LatheGeometry(prof, 48), M(0x6C7A89, { roughness: 0.5 })); bm.castShadow = bm.receiveShadow = true;
      bm.quaternion.setFromUnitVectors(V(0, 1, 0), RIGHT); O.bac.add(bm);
      // الخليَّة المضيفة: قبَّة مقطوعة فيها نواة وحويصلات جولجي
      const HG = O.HG = new THREE.Group(); HG.position.copy(HC); sc.add(HG);
      const dome = new THREE.Group(); HG.add(dome);
      cutShell(dome, RD - 0.12, RD, 1.9, Math.PI / 2, { surf: M(0xD9A441, { side: DS, roughness: 0.45 }), face: M(0xC48A2C, { side: DS, roughness: 0.6 }) });
      const floor = new THREE.Mesh(new THREE.CircleGeometry(RD - 0.12, 64), M(0xE9D6B0, { roughness: 0.9 })); floor.rotation.x = -Math.PI / 2; floor.position.y = 0.02; floor.receiveShadow = true; HG.add(floor);
      const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.95, 32, 22), M(0x9D7BD8, { roughness: 0.5 })); nuc.position.copy(dirPhi(PHI_C + Math.PI).multiplyScalar(1.3)).add(V(0, 0.95, 0)); nuc.castShadow = true; HG.add(nuc);
      const matVes = trans(0x9ED3A8, 0.42, { side: DS }), matEnvS = M(0x7FB6E6, { roughness: 0.45 }), matSpkS = M(0xF28C28, { roughness: 0.45 });
      O.vesPos = [dirPhi(PHI_C + 0.55).multiplyScalar(1.55).add(V(0, 0.95, 0)), dirPhi(PHI_C - 0.65).multiplyScalar(1.45).add(V(0, 0.85, 0))];
      O.newV = [];
      O.vesPos.forEach((vp, j) => {
        const v = new THREE.Mesh(new THREE.SphereGeometry(0.78, 28, 20), matVes); v.position.copy(vp); HG.add(v);
        for (let i = 0; i < 9; i++) {                                   // جُسيمات تبطِّن الحويصلة كما في الصورة ١-٢١
          const y = 1 - 2 * (i + 0.5) / 9, q = Math.sqrt(1 - y * y), th = i * 2.399963 + j;
          const m = miniVirion(HG, 0.15, matEnvS, matSpkS); m.position.copy(vp).add(V(q * Math.cos(th), y * 0.8, q * Math.sin(th)).multiplyScalar(0.52)); O.newV.push(m);
        }
      });
      O.entDir = [[PHI_C + 1.2, 0.75], [PHI_C + Math.PI, 1.2], [PHI_C - 1.2, 0.7]].map(([p, e]) => dirPhi(p).multiplyScalar(Math.cos(e)).add(V(0, Math.sin(e), 0)));
      O.entPos = O.entDir.map(d => d.clone().multiplyScalar(RD));
      O.ent = O.entDir.map(() => miniVirion(HG, 0.3, matEnvS, matSpkS));
    },
    rebuild() {},
    place(s) {
      S = s;
      const VG = O.VG;
      // تصغير الفيروس وانتقاله إلى جوار البكتيريوم ثمَّ إخفاؤه
      const u = sm(S.shr), sc = Math.exp(Math.log(SV) * u) * (1 - sm(S.hid)) + 1e-4;
      VG.position.copy(VC).lerp(VS, u); VG.scale.setScalar(sc); VG.visible = sc > 0.002; VG.updateMatrixWorld(true);
      O.ghost.visible = S.env < 0.98; O.ghost.material.opacity = 0.2 * (1 - sm(S.env));
      // RNA ينمو تدريجيّاً
      if (S.rna !== lastRna) {
        lastRna = S.rna; const r = sm(S.rna);
        if (O.rna.geometry) O.rna.geometry.dispose();
        if (r < 0.01) { O.rna.visible = false; O.rna.geometry = new THREE.BufferGeometry(); }
        else { const n = Math.max(4, Math.ceil(90 * r)), pts = []; for (let k = 0; k <= n; k++) pts.push(RNA_CURVE.getPointAt(r * k / n));
          O.rna.geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), n * 2, 0.055, 8, false); O.rna.visible = true; }
      }
      const stag = (v, i, n, w = 6) => Math.max(0.001, sm(Math.min(1, Math.max(0, (v * (n + w) - i) / w))));
      O.beads.forEach((m, i) => { const k = stag(S.cap, i, NB, 10); m.visible = k > 0.01; m.scale.setScalar(k); });
      // الغلاف: مسح من الأسفل إلى الأعلى (بإحداثيَّات العالم)
      const e = sm(S.env), bot = VC.y - RO - 0.1;
      O.pe.constant = e >= 0.999 ? 1e3 : bot + (2 * RO + 0.2) * e;
      O.env.visible = O.heads.visible = e > 0.005;
      const w = W0 * (1 - sm(S.shut));
      if (S.shut !== lastShut) {
        lastShut = S.shut;
        cutShell(O.env, RI, RO, w, Math.PI, O.envMats);
        const mtx = new THREE.Matrix4(); let k = 0;
        if (w > 0.02) for (const phi of [PHI_C + w / 2, PHI_C - w / 2]) for (const r of [RO - 0.055, RI + 0.055]) {
          const d = dirPhi(phi);
          for (let i = 0; i < O.NH; i++) { const th = Math.PI * (i + 0.5) / O.NH; mtx.makeTranslation(r * Math.sin(th) * d.x, r * Math.cos(th), r * Math.sin(th) * d.z); O.heads.setMatrixAt(k++, mtx); }
        }
        O.heads.count = k; O.heads.instanceMatrix.needsUpdate = true;
      }
      O.spk.forEach((g, i) => {
        const grow = stag(S.spk, i, NS, 8), open = sm((angDist(SPK[i].phi, PHI_C) - w / 2 - 0.05) / 0.2);
        const k = Math.max(0.001, grow * open); g.visible = k > 0.01; g.scale.setScalar(k);
      });
      // البكتيريوم
      const b = sm(S.bac); O.bac.visible = b > 0.01; O.bac.scale.setScalar(Math.max(0.001, b));
      // الخليَّة المضيفة: الدخول ثمَّ إنتاج جُسيمات جديدة
      const h = sm(S.host); O.HG.visible = h > 0.01; O.HG.scale.setScalar(Math.max(0.001, h)); O.HG.updateMatrixWorld(true);
      const f = sm(S.inf);
      O.ent.forEach((m, i) => {
        const t = sm(Math.min(1, Math.max(0, f * 1.3 - i * 0.15)));
        m.position.copy(O.entDir[i]).multiplyScalar(RD + 2.0 - 2.02 * t);
        const k = S.inf > 0.001 ? 1 : 0.001;
        m.visible = k > 0.01; m.scale.setScalar(k);
      });
      O.newV.forEach((m, i) => { const k = stag(Math.max(0, S.rep * 1.25 - 0.2), i, O.newV.length, 5); m.visible = k > 0.01; m.scale.setScalar(k); });
    },
  };
})();
