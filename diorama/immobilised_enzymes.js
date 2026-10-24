/* ديوراما: الإنزيمات المثبتة — تثبيت اللاكتيز في حبيبات الألجينات وتعديل الحليب — الدرس ٣-٧ (كتاب الطالب ص ١١٧–١١٨، مهارات عمليَّة ٣-٢، الشكلان ٣-١٥ و٣-١٦) */
(function () {
  const { V, sm, M, CSS } = DioramaCore;
  const { BLU, RED, GLD, TEAL, PNK, GRY, GRN, ORG, PUR } = CSS;
  const L = s => `<span class="ltr">${s}</span>`;
  const cl = (u, a = 0, b = 1) => Math.min(b, Math.max(a, u));
  let S;
  const O = {};                                                        // الكائنات الدائمة

  // ── أبعاد المشهد (منضدة المختبر: المزج يميناً +x، الأسطوانة في الوسط، المقارنة يساراً) ──
  const Y0 = -0.3;                                                     // سطح اللوح
  const MX = 5.1, MZ = 0.5, MR = 0.72, MH = 1.45;                      // كأس محلول ألجينات الصوديوم (المزج)
  const BX = 2.75, BZ = 0.45, BR = 0.95, BH = 1.7, BL = 0.62;            // كأس محلول كلوريد الكالسيوم ومستوى سائله
  const BSURF = Y0 + 0.02 + BL * BH;                                   // سطح محلول كلوريد الكالسيوم
  const CX = 0.0, CZ = 0.0, RC = 0.7, YB = 1.95, YT = 5.3;             // الأسطوانة (عمود زجاجي)
  const KR = 0.62, KH = 1.25;                                          // كأس الجمع تحت الأسطوانة
  const OUT = V(CX, 1.18, CZ);                                         // فوهة الخروج من قاع الأسطوانة
  const JR = 0.6, JH = 1.5;                                            // وعاء الحليب
  const J_REST = V(1.5 + JR, Y0 + JH, -2.3), J_POUR = V(CX - 0.22, YT + 0.7, CZ + 0.05);   // موضع حافَّة الصبِّ: راحة / صبّ
  const FX = -2.9, FZ = -2.2, FR = 0.66, FH = 1.35;                    // كأس المقارنة: لاكتيز غير مثبت مع الحليب
  const RB = 0.19;                                                     // نصف قطر الحبيبة
  const ND = 10;                                                       // عدد القطرات المعروضة
  const TIP_M = V(MX - 0.12, 0.2, MZ), TIP_B = V(BX - 0.05, 2.35, BZ); // طرف الإبرة: مغموساً في المزيج / فوق محلول كلوريد الكالسيوم
  const TILT = -0.4, SYS = 0.9;                                       // ميل المحقنة ومقياسها
  const V_REST = V(MX + 1.1, Y0 + 0.33, MZ + 0.75), V_POUR = V(MX + 0.95, 2.3, MZ);   // قنِّينة الإنزيم: على اللوح / تصبُّ
  const AXIS = V(-Math.sin(TILT), Math.cos(TILT), 0);                  // محور المحقنة (من الطرف إلى المكبس)

  // كومة الحبيبات في قاع كأس كلوريد الكالسيوم (الحبيبة 0 هي الأمامية: الحبيبة المكبَّرة)
  const PILE = (() => {
    const out = [], yb = Y0 + 0.04 + RB;
    const fr = Math.atan2(0.91, 0.42);                                 // جهة الكاميرا في المستوى الأفقي
    for (let k = 0; k < 6; k++) { const a = fr + k * Math.PI / 3; out.push(V(BX + 0.44 * Math.cos(a) * 1, yb, BZ + 0.44 * Math.sin(a))); }
    out.push(V(BX, yb, BZ));
    for (let k = 0; k < 3; k++) { const a = fr + Math.PI * (0.75 + 0.25 * k); out.push(V(BX + 0.78 * Math.cos(a) * 0.95, yb, BZ + 0.78 * Math.sin(a) * 0.95)); }
    return out;
  })();
  // حبيبات الأسطوانة: طبقات سداسيَّة من الأسفل إلى الأعلى
  const COLB = (() => {
    const out = []; let layer = 0;
    for (let y = YB + RB + 0.02; y < YT - 0.45; y += 0.33, layer++) {
      const off = layer % 2 ? 0.19 : 0;
      for (let i = -3; i <= 3; i++) for (let j = -3; j <= 3; j++) {
        const x = (i + (j % 2 ? 0.5 : 0)) * 0.38 + off * 0.5, z = j * 0.33 + off * 0.4;
        if (Math.hypot(x, z) > RC - RB - 0.03) continue;
        out.push(V(CX + x + Math.sin(i * 7.1 + j * 3.3 + layer) * 0.02, y + Math.cos(i * 2.7 + j * 5.9 + layer) * 0.03, CZ + z));
      }
    }
    return out;
  })();
  const YP = COLB[COLB.length - 1].y + RB;                             // سطح الحبيبات المعبَّأة
  const H2 = (() => {                                                  // الحبيبة المكبَّرة في الأسطوانة: في الطبقة العليا وأقربها إلى الكاميرا
    const top = COLB[COLB.length - 1].y; let best = -1, bs = -1e9;
    COLB.forEach((p, i) => { if (p.y > top - 0.05) { const s = (p.x - CX) * 0.42 + (p.z - CZ) * 0.91; if (s > bs) { bs = s; best = i; } } });
    return best;
  })();
  const C2 = COLB[H2].clone(), R2 = RB * 1.12;
  const COLTOP = V(CX, YT + 0.2, CZ);

  // داخل الحبيبة المكبَّرة (إحداثيَّات وحدة): جُزيئات الإنزيم وخيوط الهلام
  const NRM = [V(0.55, 0.62, 0.95), V(-0.25, 0.95, 0.6), V(0.95, 0.35, 0.55)].map(v => v.normalize());   // مواضع التلامس على سطح الحبيبة (نحو الكاميرا)
  const ENZ_IN = [V(0.2, -0.3, 0.3), V(-0.45, 0.1, 0.2), V(0.1, 0.25, -0.4), V(-0.2, -0.45, -0.2), V(0.45, -0.1, -0.25), V(-0.1, -0.05, 0.62), V(0.55, 0.3, 0.05), V(-0.5, 0.42, -0.15), V(0.05, -0.6, 0.2)];
  const ENZ = NRM.map(n => n.clone().multiplyScalar(0.78)).concat(ENZ_IN);
  const STR = [[V(-0.8, 0.2, 0.3), V(0.7, -0.1, 0.4)], [V(0.1, 0.85, -0.2), V(-0.2, -0.8, 0.3)], [V(-0.4, -0.5, 0.6), V(0.5, 0.5, -0.5)], [V(0.6, -0.55, 0.2), V(-0.6, 0.5, 0.35)],
               [V(0.0, 0.3, 0.88), V(0.1, -0.2, -0.9)], [V(-0.85, -0.2, -0.3), V(0.8, 0.25, -0.2)], [V(0.3, 0.75, 0.45), V(-0.3, -0.3, -0.85)]];
  // بنك المواد
  const cAlg = new THREE.Color(0xE6DDB0).convertSRGBToLinear(), cMix = new THREE.Color(0xC3BCE8).convertSRGBToLinear();
  const glass = op => { const m = new THREE.MeshStandardMaterial({ color: 0xDCEBF2, transparent: true, opacity: op, roughness: 0.08, metalness: 0.0, depthWrite: false, side: THREE.DoubleSide }); m.color.convertSRGBToLinear(); return m; };
  const liq = (c, op) => { const m = new THREE.MeshStandardMaterial({ color: c, transparent: true, opacity: op, roughness: 0.2, depthWrite: false }); m.color.convertSRGBToLinear(); return m; };
  const matBead = M(0xB7AEE6, { roughness: 0.32, transparent: true }), matEnz = M(0xC8102E, { roughness: 0.4 }), matGlc = M(0xE8B923, { roughness: 0.35 }), matGal = M(0x2FA866, { roughness: 0.35 });
  const matBond = M(0x5B6B8C), matStr = M(0x7F72C2, { roughness: 0.5 }), matMetal = M(0x9AA4B1, { roughness: 0.3, metalness: 0.5 }), matStand = M(0x4A5568, { roughness: 0.5 });
  const gCylU = new THREE.CylinderGeometry(1, 1, 1, 14), gSphU = new THREE.SphereGeometry(1, 18, 14), gHex = new THREE.CylinderGeometry(1, 1, 0.45, 6);
  const UP = V(0, 1, 0);
  function setRod(o, a, b, r) {
    const d = b.clone().sub(a), l = d.length(); if (l < 1e-4) { o.visible = false; return; }
    o.visible = true; o.scale.set(r, l, r); o.position.copy(a).addScaledVector(d, 0.5); o.quaternion.setFromUnitVectors(UP, d.normalize());
  }
  const arc = (A, B, u, lift) => { const p = A.clone().lerp(B, u); p.y += Math.sin(Math.PI * u) * lift; return p; };

  // ── دوالُّ الحالة ──
  function tipPos() {                                                  // طرف إبرة المحقنة
    const u = sm(S.mv);
    return arc(TIP_M, TIP_B, u, 2.0);
  }
  function dropState(k) {                                              // القطرة k: موضعها ونصف قطرها (أو null)
    const T = S.drop * ((ND - 1) * 0.55 + 1.3), u = cl((T - k * 0.55) / 1.3);
    if (u <= 0) return null;
    const P = PILE[k], tip = TIP_B.clone().add(V(0, -0.08, 0));
    if (u < 0.45) { const v = u / 0.45; return { p: V(tip.x + (P.x - tip.x) * v * 0.6, tip.y + (BSURF - tip.y) * v * v, tip.z + (P.z - tip.z) * v * 0.6), r: 0.1, drop: true }; }
    const v = sm((u - 0.45) / 0.55), s0 = V(tip.x + (P.x - tip.x) * 0.6, BSURF, tip.z + (P.z - tip.z) * 0.6);
    return { p: s0.lerp(P, v), r: 0.1 + (RB - 0.1) * v, drop: v < 0.3 };
  }
  function pileState(k) {                                              // الحبيبة k من الكومة (بعد التكوُّن) مع نقلها إلى الأسطوانة
    const d = dropState(k); if (!d) return null;
    const v = cl(S.pack * 2.0 - k * 0.09);
    if (v <= 0) return d;
    if (v >= 1) return null;
    return { p: arc(PILE[k], COLTOP, sm(v), 2.6), r: RB * (v > 0.8 ? (1 - v) / 0.2 : 1), drop: false };
  }
  const colVis = i => cl(S.fill * (COLB.length + 4) - i);             // ظهور حبيبات الأسطوانة من الأسفل إلى الأعلى
  function jugPose() {
    const u = sm(S.pour);
    return { p: arc(J_REST, J_POUR, u, 1.2), a: -1.95 * u };
  }
  const milkFront = () => YT - 0.1 - sm(S.milk) * (YT - 0.1 - (YB - 0.25));
  // جزيئات اللاكتوز عند الحبيبة المكبَّرة: الاقتراب ← التلامس ← التحلُّل إلى جلوكوز وجالاكتوز
  function lacState(k) {
    const n = NRM[k], side = new THREE.Vector3().crossVectors(n, UP); if (side.lengthSq() < 1e-3) side.set(1, 0, 0); side.normalize();
    const start = C2.clone().addScaledVector(n, R2 + 0.42).add(V(0.05 * k, 0.12, 0)), touch = C2.clone().addScaledVector(n, R2 + 0.065);
    const u = cl(S.lac * 1.7 - k * 0.6);                              // الجزيء الثالث يبقى ملامساً للسطح عند نهاية الخطوة
    const sep = 0.06;
    if (u < 0.5) { const c = start.clone().lerp(touch, sm(u / 0.5)); return { c, a: c.clone().addScaledVector(side, sep), b: c.clone().addScaledVector(side, -sep), bond: true, hit: 0 }; }
    if (u < 0.62) return { c: touch, a: touch.clone().addScaledVector(side, sep), b: touch.clone().addScaledVector(side, -sep), bond: true, hit: (u - 0.5) / 0.12 };
    const w = sm((u - 0.62) / 0.38), out = n.clone().multiplyScalar(0.06 * w);
    return { c: touch, a: touch.clone().addScaledVector(side, sep + 0.17 * w).add(out).add(V(0, -0.05 * w, 0)), b: touch.clone().addScaledVector(side, -sep - 0.17 * w).add(out).add(V(0, -0.08 * w, 0)), bond: false, hit: 1 - w };
  }
  const enzW = (C, R, i) => C.clone().addScaledVector(ENZ[i], R);    // موضع إنزيم داخل حبيبة مكبَّرة
  const lvlColl = () => 0.04 + 0.62 * KH * sm(S.coll);

  function hero(parent) {                                              // حبيبة مكبَّرة: غلاف هلام شفَّاف + جُزيئات الإنزيم + خيوط الهلام (إحداثيَّات وحدة)
    const g = new THREE.Group();
    const shell = new THREE.Mesh(gSphU, liq(0xB7AEE6, 0.42)); g.add(shell);
    g.userData.enz = ENZ.map(p => { const o = new THREE.Mesh(gSphU, matEnz); o.scale.setScalar(0.15); o.position.copy(p); g.add(o); return o; });
    STR.forEach(([a, b]) => { const o = new THREE.Mesh(gCylU, matStr); setRod(o, a, b, 0.022); g.add(o); });
    (parent).add(g); return g;
  }
  function beaker(x, z, r, h, parent) {                                // كأس زجاجيَّة: جدار وقاع وحافَّة
    const g = new THREE.Group(); g.position.set(x, Y0, z);
    const wall = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 40, 1, true), glass(0.22)); wall.position.y = h / 2; g.add(wall);
    const bot = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.04, 40), glass(0.3)); bot.position.y = 0.02; g.add(bot);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(r, 0.03, 8, 48), glass(0.55)); rim.rotation.x = Math.PI / 2; rim.position.y = h; g.add(rim);
    parent.add(g); return g;
  }
  function liquid(x, z, r, c, op, parent) {
    const o = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 1, 40), liq(c, op)); o.position.set(x, 0, z); o.renderOrder = 1; (parent).add(o); return o;
  }
  const setLvl = (o, h, y0 = Y0) => { o.visible = h > 0.005; o.scale.y = Math.max(0.001, h); o.position.y = y0 + 0.04 + h / 2; };

  window.DIORAMA = {
    id: 'immobilised_enzymes', title: 'الإنزيمات المثبتة: اللاكتيز في حبيبات الألجينات',
    subtitle: 'الأحياء — الصف الحادي عشر — الوحدة الثالثة: الإنزيمات',
    source: 'النص من كتاب الطالب: ٣-٧ الإنزيمات المثبتة ومهارات عمليَّة ٣-٢ (ص ١١٧–١١٨) والشكلان ٣-١٥ و٣-١٦',
    legend: [['#E6DDB0', 'محلول ألجينات الصوديوم'], ['#A9D8EE', 'محلول كلوريد الكالسيوم'], ['#B7AEE6', 'حبيبات ألجينات'], ['#F5F1E6', 'حليب'], null,
             ['#C8102E', 'إنزيم اللاكتيز', 'dot'], ['#E8B923', 'الجلوكوز', 'dot'], ['#2FA866', 'الجالاكتوز', 'dot'], ['#5B6B8C', 'اللاكتوز (سكّر ثنائي)', 'tube']],
    camera: { VH: 9.8, center: [-0.2, 3.0, 0], elevation: 24, azimuth: 24 },
    base: { L: 13.5, W: 6.4, x: 1.1, z: -0.3 },
    BASE: { fo: 0, el: 24, az: 24, enz: 0, load: 0, mv: 0, drop: 0, pack: 0, fill: 0, pour: 0, milk: 0, lac: 0, coll: 0, drip: 0, cmp: 0 },
    noGeom: ['fo', 'enz', 'load', 'mv', 'drop', 'pack', 'fill', 'pour', 'milk', 'lac', 'coll', 'drip', 'cmp'],
    // نقطة التركيز: 0 المشهد، 1 الحبيبة المكبَّرة في كأس كلوريد الكالسيوم، 2 الحبيبة المكبَّرة في الأسطوانة، 3 طرف المحقنة
    focus(s) {
      S = s; const k = Math.round(S.fo || 0);
      if (k === 1) { const d = pileState(0); return (d ? d.p.clone() : PILE[0].clone()).add(V(-0.13, 0.03, 0.06)); }
      if (k === 2) return C2.clone().add(V(-0.14, 0.06, 0.06));
      if (k === 3) return V(BX, 1.4, BZ);
      return V(-0.2, 3.0, 0);
    },
    STEPS: [
      { t: 'لماذا نثبِّت الإنزيمات؟',
        p: 'للإنزيمات مجموعة هائلة من التطبيقات التجاريّة، على سبيل المثال: في الطب وتكنولوجيا الغذاء والعمليات الصناعيّة. والإنزيمات مرتفعة الثمن، لذلك لا ترغب أيّة شركة في معاودة شرائها إذا كان بإمكانها إعادة تدويرها بطريقة أو بأخرى. وإحدى أفضل الطرائق المتّبعة في خفض التكاليف هي استخدام الإنزيمات المثبتة ' + L('Immobilised enzymes') + '، بحيث يتمّ تثبيت هذه الإنزيمات بطريقة ما لمنعها من الانتشار بحريّة في المحلول.',
        seq: [[{}, 0]],
        pills: [['محلول ألجينات الصوديوم', ORG, () => V(MX + MR * 0.5, Y0 + 0.5 * MH, MZ + MR * 0.8), 90, 20], ['إنزيم اللاكتيز', RED, () => V_REST.clone().add(V(0, 0.2, 0)), 110, -130],
                ['محلول كلوريد الكالسيوم', TEAL, () => V(BX, Y0 + 0.5, BZ + BR), 30, 50], ['أسطوانة', GRY, () => V(CX + RC, 4.2, CZ), 130, -20],
                ['حليب', BLU, () => J_REST.clone().add(V(-JR, -0.4, 0)), -70, -80]] },
      { t: 'من قطرات المزيج إلى حبيبات',
        p: 'يبيّن الشكل ٣-١٥ إحدى الطرائق التي يمكن فيها تثبيت الإنزيمات. يمزج الإنزيم مع محلول ألجينات الصوديوم، ثم تضاف قطرات صغيرة من هذا المزيج إلى محلول كلوريد الكالسيوم. تتفاعل ألجينات الصوديوم وكلوريد الكالسيوم على الفور، مكوّنة هلامًا يحوّل كل قطرة إلى حبيبة صغيرة.',
        n: 'ملء المحقنة بالمزيج ونقلها فوق كأس كلوريد الكالسيوم مبسَّطان للتوضيح؛ وتُعرض عشر قطرات فقط.',
        seq: [[{ enz: 1 }, 1700], [{ load: 1 }, 700], [{ mv: 1 }, 1000], [{ '!fo': 3, zoom: 1.6 }, 500], [{ drop: 1 }, 2600], [{ zoom: 1 }, 600]],
        pills: [['مزيج محلول ألجينات الصوديوم وإنزيم اللاكتيز', PUR, () => TIP_B.clone().addScaledVector(AXIS, 1.25 * SYS), 150, -60], ['محلول كلوريد الكالسيوم', TEAL, () => V(BX + BR * 0.6, Y0 + 0.9, BZ + BR * 0.7), 150, -150],
                ['حبيبة صغيرة', PUR, () => PILE[0].clone(), -150, 50]] },
      { t: 'الإنزيم محبوس في حبيبة الهلام',
        p: 'تحتوي حبيبات الهلام على الإنزيم، الذي يحفظ فيها أو يثبت. تحمل الألجينات جُزيئات الإنزيم في الحبيبات.',
        n: 'الحبيبة مكبَّرة كثيراً، وجُزيئات الإنزيم ليست بمقياس حقيقي.',
        seq: [[{ '!fo': 1, zoom: 6.5, el: 34 }, 1800]],
        pills: [['حبيبات الهلام', PUR, () => PILE[0].clone().add(V(-RB * 0.7, RB * 0.55, 0)), -150, -80], ['جُزيئات الإنزيم', RED, () => enzW(PILE[0], RB, 0), 160, -70],
                ['تحمل الألجينات جُزيئات الإنزيم في الحبيبات', PUR, () => PILE[0].clone().add(V(0, -RB * 0.5, RB * 0.6)), 60, 120]] },
      { t: 'تعبئة الحبيبات في أسطوانة وتمرير الحليب',
        p: 'يمكن تعبئة هذه الحبيبات برفق في أسطوانة، والسماح للسائل الذي يحتوي على المادة المتفاعلة بالتقطر بانتظام فوقها كما هو مبين في الشكل ٣-١٦. فالمادة المتفاعلة للاكتيز هي السكّر الثنائي اللاكتوز. يمرر الحليب داخل عمود (أسطوانة) يحتوي على كريات (حبيبات) محتوية على اللاكتيز كما في الشكل ٣-١٦.',
        n: 'نقل الحبيبات من الكأس إلى الأسطوانة مبسَّط للتوضيح.',
        seq: [[{ zoom: 1, el: 24 }, 1000], [{ pack: 1, fill: 1, mv: 0 }, 2800], [{ pour: 1 }, 1300], [{ milk: 1 }, 2200]],
        pills: [['حبيبات ألجينات تحتوي على لاكتيز مثبت', PUR, () => V(CX + RC * 0.9, 3.4, CZ + 0.3), 170, 40], ['حليب', BLU, () => jugPose().p.clone().add(V(-0.7, 0.9, 0)), -110, -10]] },
      { t: 'اللاكتيز يحلِّل اللاكتوز عند سطح الحبيبة',
        p: 'وحالما تلامس المادة المتفاعلة سطح الحبيبات، تحفز الإنزيمات في الحبيبات تفاعلًا يحوّل المادة المتفاعلة إلى مادة ناتجة. فيقوم اللاكتيز بتحليل اللاكتوز في الحليب إلى الجلوكوز والجالاكتوز، فيصبح الحليب خاليًا من اللاكتوز، حيث يستخدم في صنع ألبان مخصّصة للأشخاص الذين لا يستطيعون هضم اللاكتوز.',
        n: 'يحدث هذا عند حبيبات الأسطوانة كلِّها في وقت واحد؛ تُعرض حبيبة واحدة مكبَّرة وثلاثة جزيئات لاكتوز.',
        seq: [[{ '!fo': 2, zoom: 7, el: 36 }, 1300], [{ lac: 1 }, 3800]],
        pills: [['اللاكتوز', GRY, () => { const q = lacState(2); return q.c.clone(); }, 170, -60], ['الجلوكوز', GLD, () => lacState(0).a.clone(), 60, -170], ['الجالاكتوز', GRN, () => lacState(0).b.clone(), -170, -100],
                ['الإنزيمات في الحبيبات', RED, () => enzW(C2, R2, 3), 170, 90]] },
      { t: 'حليب خالٍ من اللاكتوز ومن الإنزيم',
        p: 'ثم يهبط الناتج إلى أسفل الأسطوانة، ويتقطّر إلى الخارج من قاع الأسطوانة حيث يمكن جمعه وتنقيته.',
        seq: [[{ zoom: 1, el: 24 }, 1300], [{ '!drip': 1, coll: 0.6, pour: 0 }, 2800]],
        pills: [['حليب خالٍ من سكّر اللاكتوز وإنزيم اللاكتيز', BLU, () => V(CX + KR, Y0 + lvlColl() * 0.6, CZ), 160, 60], ['يتقطّر إلى الخارج من قاع الأسطوانة', GRY, () => OUT.clone(), 170, -40]] },
      { t: 'مزايا الإنزيمات المثبتة',
        p: 'للإنزيمات المثبتة ميزات عديدة وواضحة مقارنة بالإنزيمات غير المثبتة. فعند مزج اللاكتيز (غير المثبت) مع الحليب، سيصعب الحصول على اللاكتيز مرة أخرى (لغرض استخدامه)، وسيكون الحليب ملوثًا بالإنزيمات؛ بينما يؤمّن استخدام الإنزيمات المثبتة الحفاظ على الإنزيمات وإعادة استخدامها، والحصول على منتج خالٍ من الإنزيمات (غير ملوّث بها).',
        n: 'إعادة صبِّ الحليب على الحبيبات نفسها تمثيلٌ لإعادة استخدامها.',
        seq: [[{ cmp: 1 }, 1500], [{ pour: 1 }, 1200], [{ coll: 1 }, 2000], [{ pour: 0 }, 1000]],
        pills: [['اللاكتيز (غير المثبت) مع الحليب', RED, () => V(FX, Y0 + FH + 0.1, FZ), -40, -95], ['سيكون الحليب ملوثًا بالإنزيمات', RED, () => V(FX - FR * 0.8, Y0 + FH * 0.4, FZ + 0.3), -160, -70],
                ['الحفاظ على الإنزيمات وإعادة استخدامها', PUR, () => V(CX + RC * 0.9, 3.6, CZ + 0.3), 180, -10], ['منتج خالٍ من الإنزيمات (غير ملوّث بها)', BLU, () => V(CX + KR, Y0 + 0.4, CZ), 170, 75]] },
      { t: 'أكثر تحمُّلًا للحرارة وللرقم الهيدروجيني',
        p: 'ميزة أخرى للإنزيمات المثبتة تتمثّل في أنها أكثر تحمّلًا لتقلّب درجات الحرارة، ولتغيّر الرقم الهيدروجيني ' + L('pH') + ' مقارنة بالإنزيمات في محاليل (غير المثبتة). وربّما يعود هذا إلى أن جزيئاتها مترسّخة بقوة عبر الألجينات المثبتة فيها، وبالتالي فإن طبيعتها لا تتغير بسهولة. وقد يكون السبب أيضًا أنّ الجزيئات الموجودة في الكريات (الحبيبات) ليست مكشوفة بالكامل لتقلّبات الحرارة والرقم الهيدروجيني ' + L('pH') + '.',
        seq: [[{ '!fo': 2, zoom: 6.5, el: 38 }, 1800]],
        pills: [['جزيئاتها مترسّخة بقوة عبر الألجينات', RED, () => enzW(C2, R2, 5), 170, 60], ['ليست مكشوفة بالكامل لتقلّبات الحرارة والرقم الهيدروجيني ' + L('pH'), PUR, () => C2.clone().addScaledVector(NRM[1], R2), -60, -120]] },
    ],
    setup(ctx) {
      const sc = ctx.scene;
      const add = (g, m, p, parent) => ctx.mesh(g, m, p, parent);
      // ── كأس المزج (محلول ألجينات الصوديوم) وقنِّينة الإنزيم ──
      beaker(MX, MZ, MR, MH, sc);
      O.mixLiq = liquid(MX, MZ, MR * 0.95, 0xE6DDB0, 0.78, sc);
      const vial = new THREE.Group(); sc.add(vial); O.vial = vial;
      const vb = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.62, 24), glass(0.35)); vial.add(vb);
      const vl = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.3, 24), liq(0xE57A8A, 0.8)); vl.position.y = 0.12; vial.add(vl);
      const vn = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.12, 0.2, 16), glass(0.45)); vn.position.y = -0.41; vial.add(vn);
      O.enzMix = Array.from({ length: 9 }, (_, i) => add(gSphU, matEnz, V(0, 0, 0)));
      O.enzMixEnd = Array.from({ length: 9 }, (_, i) => V(MX + 0.5 * Math.cos(i * 2.4), Y0 + 0.2 + 0.08 * (i % 4) * 1.6, MZ + 0.5 * Math.sin(i * 2.4)));
      // ── كأس محلول كلوريد الكالسيوم ──
      beaker(BX, BZ, BR, BH, sc);
      O.cab = liquid(BX, BZ, BR * 0.96, 0xA9D8EE, 0.42, sc); setLvl(O.cab, BL * BH);
      // ── المحقنة (طرف الإبرة عند أصل المجموعة، والمحور على +y المحلِّي) ──
      const syr = new THREE.Group(); syr.rotation.z = TILT; syr.scale.setScalar(SYS); sc.add(syr); O.syr = syr;
      add(new THREE.CylinderGeometry(0.025, 0.025, 0.55, 8), matMetal, V(0, 0.275, 0), syr);
      add(new THREE.CylinderGeometry(0.17, 0.06, 0.18, 20), glass(0.5), V(0, 0.64, 0), syr);
      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2.0, 28, 1, true), glass(0.3)); barrel.position.y = 1.73; syr.add(barrel);
      add(new THREE.BoxGeometry(0.75, 0.06, 0.32), glass(0.6), V(0, 2.73, 0), syr);
      for (let k = 1; k <= 6; k++) add(new THREE.BoxGeometry(0.02, 0.012, 0.4), M(0x5B6B8C), V(0.0, 0.8 + k * 0.28, 0), syr).scale.set(1, 1, 1);
      O.syrFill = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 1, 24), liq(0xC3BCE8, 0.85)); O.syrFill.renderOrder = 1; syr.add(O.syrFill);
      O.stop = add(new THREE.CylinderGeometry(0.185, 0.185, 0.09, 24), M(0x2B2F36), V(0, 0.8, 0), syr);
      O.rod = add(new THREE.CylinderGeometry(0.05, 0.05, 2.2, 10), M(0xE8ECF1), V(0, 1.9, 0), syr);
      O.thumb = add(new THREE.CylinderGeometry(0.26, 0.26, 0.05, 24), M(0xE8ECF1), V(0, 3.0, 0), syr);
      // ── القطرات وحبيبات الكأس (الحبيبة 0 مكبَّرة شفَّافة تُظهر الإنزيم بداخلها) ──
      O.pile = PILE.map((p, k) => k ? add(gSphU, matBead, p) : null);
      O.h1 = hero(sc);
      // ── الأسطوانة وحاملها ──
      const colW = new THREE.Mesh(new THREE.CylinderGeometry(RC + 0.04, RC + 0.04, YT - YB, 40, 1, true), glass(0.2)); colW.position.set(CX, (YT + YB) / 2, CZ); sc.add(colW);
      const rimT = new THREE.Mesh(new THREE.TorusGeometry(RC + 0.08, 0.06, 8, 48), glass(0.6)); rimT.rotation.x = Math.PI / 2; rimT.position.set(CX, YT, CZ); sc.add(rimT); O.rimT = rimT;
      const fun = new THREE.Mesh(new THREE.CylinderGeometry(RC + 0.04, 0.1, 0.42, 40, 1, true), glass(0.35)); fun.position.set(CX, YB - 0.21, CZ); sc.add(fun);
      add(new THREE.CylinderGeometry(0.07, 0.07, YB - 0.42 - OUT.y, 12), glass(0.5), V(CX, (YB - 0.42 + OUT.y) / 2, CZ));
      add(new THREE.BoxGeometry(0.34, 0.12, 0.12), M(0x2F80ED), V(CX + 0.06, 1.42, CZ + 0.02));                  // الصنبور
      add(new THREE.BoxGeometry(0.06, 0.3, 0.06), M(0x2F80ED), V(CX + 0.22, 1.5, CZ + 0.02));
      const SX = CX - 1.15, SZ = CZ - 1.0;
      O.stand = [add(new THREE.BoxGeometry(1.1, 0.1, 1.1), matStand, V(SX, Y0 + 0.05, SZ)), add(new THREE.CylinderGeometry(0.06, 0.06, 6.9, 12), matMetal, V(SX, Y0 + 3.45, SZ))];
      [2.6, 4.4].forEach(y => {
        const arm = add(gCylU, matMetal, V(0, 0, 0)); setRod(arm, V(SX, y, SZ), V(CX - (RC + 0.1) * 0.75, y, CZ - (RC + 0.1) * 0.66), 0.05);
        const ring = add(new THREE.TorusGeometry(RC + 0.1, 0.05, 8, 40), matMetal, V(CX, y, CZ)); ring.rotation.x = Math.PI / 2;
        O.stand.push(arm, ring);
      });
      O.col = COLB.map((p, i) => i === H2 ? null : add(gSphU, matBead, p));
      O.h2 = hero(sc); O.h2.position.copy(C2);
      O.milkCol = new THREE.Mesh(new THREE.CylinderGeometry(RC - 0.03, RC - 0.03, 1, 40), liq(0xFFFFFF, 0.4)); O.milkCol.position.set(CX, 0, CZ); O.milkCol.renderOrder = 2; sc.add(O.milkCol);
      O.stream = add(gCylU, liq(0xFAF7F0, 0.92), V(0, 0, 0)); O.stream.castShadow = false;
      // ── كأس الجمع وقطرات الحليب الخارج ──
      beaker(CX, CZ, KR, KH, sc);
      O.coll = liquid(CX, CZ, KR * 0.95, 0xF5F1E6, 0.85, sc);
      O.drips = [0, 1, 2].map(() => add(gSphU, liq(0xF5F1E6, 0.95), V(0, 0, 0)));
      // ── وعاء الحليب (أصل المجموعة عند حافَّة الصبِّ) ──
      const jug = new THREE.Group(); sc.add(jug); O.jug = jug;
      const jb = beaker(-JR, -JH - Y0, JR, JH, jug); jb.position.set(-JR, -JH, 0);
      O.jugLiq = new THREE.Mesh(new THREE.CylinderGeometry(JR * 0.94, JR * 0.94, 1, 32), liq(0xF5F1E6, 0.92)); O.jugLiq.position.set(-JR, 0, 0); jug.add(O.jugLiq);
      // ── كأس المقارنة: لاكتيز غير مثبت ممزوج بالحليب ──
      const cmp = new THREE.Group(); cmp.position.set(FX, 0, FZ); sc.add(cmp); O.cmp = cmp;
      const cb = beaker(0, 0, FR, FH, cmp);
      const cl2 = new THREE.Mesh(new THREE.CylinderGeometry(FR * 0.95, FR * 0.95, FH * 0.7, 32), liq(0xF5F1E6, 0.55)); cl2.position.set(0, Y0 + 0.04 + FH * 0.35, 0); cl2.renderOrder = 1; cmp.add(cl2);
      O.free = Array.from({ length: 10 }, (_, i) => { const o = add(gSphU, matEnz, V(0.42 * Math.cos(i * 2.1), Y0 + 0.25 + 0.085 * i, 0.42 * Math.sin(i * 2.1)), cmp); o.scale.setScalar(0.07); return o; });
      // ── جزيئات اللاكتوز عند الحبيبة المكبَّرة في الأسطوانة ──
      O.lac = NRM.map(() => ({ a: add(gHex, matGlc, V(0, 0, 0)), b: add(gHex, matGal, V(0, 0, 0)), bond: add(gCylU, matBond, V(0, 0, 0)) }));
    },
    rebuild() {},
    place(s) {
      S = s;
      // الإنزيم يُضاف إلى محلول الألجينات ثمَّ ينتشر فيه
      const e = S.enz, va = sm(cl(e / 0.3)) * (1 - sm(cl((e - 0.85) / 0.15)));
      O.vial.position.copy(V_REST).lerp(V_POUR, va); O.vial.rotation.z = -Math.PI + (Math.PI - 0.9) * va;
      O.vialMouth = O.vial.position.clone().add(V(0, -0.5, 0).applyAxisAngle(V(0, 0, 1), O.vial.rotation.z));
      O.enzMix.forEach((o, i) => {
        const u = cl(((e - 0.3) / 0.55) * 1.6 - i * 0.07);
        o.visible = u > 0 && S.load < 0.98; o.scale.setScalar(0.06);
        if (u < 0.5) { const v = u / 0.5; o.position.copy(O.vialMouth).lerp(V(MX + 0.3, Y0 + 0.04 + MH * 0.55, MZ), v); o.position.y = O.vialMouth.y + (Y0 + 0.04 + MH * 0.55 - O.vialMouth.y) * v * v; }
        else o.position.copy(V(MX + 0.3, Y0 + 0.04 + MH * 0.55, MZ)).lerp(O.enzMixEnd[i], sm((u - 0.5) / 0.5));
      });
      O.mixLiq.material.color.copy(cAlg).lerp(cMix, sm(e));
      setLvl(O.mixLiq, MH * (0.56 - 0.2 * sm(S.load)));
      // المحقنة: الملء (المكبس يرتفع) ثمَّ النقل ثمَّ إسقاط القطرات (المكبس ينخفض)
      const fill = sm(S.load) * (1 - 0.8 * sm(S.drop)), len = 0.06 + 1.7 * fill;
      O.syr.position.copy(tipPos());
      O.syrFill.scale.y = len; O.syrFill.position.y = 0.75 + len / 2; O.syrFill.visible = fill > 0.01;
      const st = 0.75 + len + 0.05; O.stop.position.y = st; O.rod.position.y = st + 1.1; O.thumb.position.y = st + 2.2;
      // القطرات والحبيبات في كأس كلوريد الكالسيوم
      for (let k = 0; k < ND; k++) {
        const d = pileState(k);
        const o = k ? O.pile[k] : O.h1;
        if (!d || d.r < 0.005) { o.visible = false; continue; }
        o.visible = true; o.position.copy(d.p); o.scale.set(d.r, d.r * (d.drop ? 1.25 : 1), d.r);
      }
      // الأسطوانة: الحبيبات تظهر من الأسفل
      COLB.forEach((p, i) => {
        const v = colVis(i), o = i === H2 ? O.h2 : O.col[i];
        o.visible = v > 0.01; o.scale.setScalar(Math.max(0.001, v) * (i === H2 ? R2 : RB));
      });
      // الحليب: الوعاء يصبُّ، والحليب ينزل في الأسطوانة
      const jp = jugPose(); O.jug.position.copy(jp.p); O.jug.rotation.z = jp.a;
      setLvl(O.jugLiq, JH * 0.7 * (1 - 0.55 * sm(S.pour)), -JH);
      const pouring = S.pour > 0.92;
      if (pouring) setRod(O.stream, jp.p.clone().add(V(0.02, -0.02, 0)), V(jp.p.x + 0.05, Math.max(YP - 0.05, milkFront()) , jp.p.z), 0.05); else O.stream.visible = false;
      const zf = cl(((S.zoom || 1) - 1.4) / 1.6);
      const mf = milkFront(), mt = YT - 0.1;
      const hideC = zf > 0.5 && Math.round(S.fo) === 2; O.stand.forEach(o => { o.visible = !hideC; }); O.rimT.visible = !hideC; if (hideC) O.stream.visible = false;
      const zb = cl(((S.zoom || 1) - 2) / 2.5); matBead.opacity = 1 - 0.62 * zb; matBead.depthWrite = zb < 0.02;
      O.milkCol.visible = S.milk > 0.01; O.milkCol.scale.y = Math.max(0.001, mt - mf); O.milkCol.position.y = (mt + mf) / 2; O.milkCol.material.opacity = 0.42 * (1 - zf);
      // كأس الجمع
      setLvl(O.coll, S.coll > 0.001 ? lvlColl() : 0);
      this.drips(0);
      // كأس المقارنة
      const c = sm(S.cmp); O.cmp.visible = c > 0.01; O.cmp.scale.setScalar(Math.max(0.001, c));
      // جزيئات اللاكتوز عند الحبيبة المكبَّرة
      O.lac.forEach((m, k) => {
        const q = lacState(k), vis = S.milk > 0.6;
        [m.a, m.b].forEach((o, j) => { o.visible = vis; o.position.copy(j ? q.b : q.a); o.scale.setScalar(0.048); o.lookAt(o.position.clone().add(V(0.32, 0.64, 0.69))); o.rotateX(Math.PI / 2); });
        if (vis && q.bond) setRod(m.bond, q.a, q.b, 0.012); else m.bond.visible = false;
        const en = O.h2.userData.enz[k]; en.scale.setScalar(0.15 * (1 + 0.45 * Math.sin(Math.PI * cl(q.hit))));
      });
    },
    drips(t) {                                                          // قطرات الحليب من فوهة الأسطوانة إلى كأس الجمع
      const on = S.drip > 0.5, top = OUT.y - 0.05, bot = Y0 + lvlColl() + 0.05;
      O.drips.forEach((o, k) => {
        o.visible = on; if (!on) return;
        const ph = (t * 0.9 + S.coll * 6 + k / 3) % 1;
        o.position.set(OUT.x, top - (top - bot) * ph * ph, OUT.z); o.scale.set(0.045, 0.06, 0.045);
      });
    },
    idle(t, s, ctx, tweening) {
      if (tweening) return;
      S = s; this.drips(t);
      if (S.cmp > 0.5) O.free.forEach((o, i) => { o.position.x = 0.42 * Math.cos(i * 2.1 + t * 0.5); o.position.z = 0.42 * Math.sin(i * 2.1 + t * 0.5); });
    },
  };
})();
