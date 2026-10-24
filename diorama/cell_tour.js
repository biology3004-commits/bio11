/* ديوراما: جولة في الخليَّة كما تُرى بالمجهر الإلكتروني — خليَّة حيوانيَّة وخليَّة نباتيَّة مقطوعتان، تُكشف عُضيَّاتهما واحدةً في كلِّ خطوة — الدرس ١-٤ (كتاب الطالب ص ٣١–٤٨، الشكلان ١-٦ و ١-٧، وملخَّص الوحدة ص ٥٤) */
(function () {
  const { V, sm, M, CSS } = DioramaCore;
  const { BLU, RED, GLD, TEAL, PNK, GRY, GRN, ORG, PUR } = CSS;
  let S, ctxRef;
  const O = {};                                                        // الكائنات الدائمة
  const POP = [];                                                      // [مجموعة، مفتاح الظهور] تكبر من الصفر حين يظهر المفتاح

  // ── اتِّجاهات الشاشة على اللوح (الكاميرا بسمت 45°): يمين الشاشة وأعلاها (العمق) ──
  const RT = V(0.7071, 0, -0.7071), UPd = V(-0.7071, 0, -0.7071);
  const at = (c, sx, sy, y) => V(c.x + sx * RT.x + sy * UPd.x, y, c.z + sx * RT.z + sy * UPd.z);
  const thetaOf = d => Math.atan2(d.x, d.z);
  const polar = (c, deg, r, y) => { const a = deg * Math.PI / 180; return at(c, r * Math.cos(a), r * Math.sin(a), y); };                           // زاوية CylinderGeometry: x = r sinθ ، z = r cosθ

  // ── الخليَّتان: حيوانيَّة (يمين الشاشة/أسفل) ونباتيَّة سداسيَّة (يسار/أعلى) ──
  const A = V(4.7, 0, 0.1), RA = 4.2;                                  // مركز الخليَّة الحيوانيَّة ونصف قطرها
  const P = V(-5.0, 0, -0.1), RP = 4.3, AP = RP * Math.cos(Math.PI / 6); // الخليَّة النباتيَّة: نصف القطر إلى الرأس وإلى منتصف الضلع
  const FL0 = -0.06, WH = 1.15;                                        // سطح أرضيَّة السيتوبلازم وارتفاع جدار الغشاء

  // عُضيَّات الخليَّة الحيوانيَّة (إحداثيَّات شاشة نسبةً إلى المركز)
  const NA = at(A, -0.2, -0.2, 0), NRA = 1.3, NYA = 0.68;              // النواة
  const NP = at(P, 0.9, -2.55, 0), NRP = 0.85, NYP = 0.5;              // نواة الخليَّة النباتيَّة (مدفوعة إلى الطرف)
  const CEN = at(A, 1.75, -0.15, 0.55);                                // الجسم المركزي
  const GOL_A = at(A, 2.15, 2.05, 0), GOL_P = polar(P, 230, 2.75, 0);    // جهاز جولجي
  const MITO_F = { p: at(A, 0.95, -2.55, 0.42), ry: Math.atan2(-RT.z, RT.x) }; // الميتوكندريون المعروض مقطوعاً (محوره مع يمين الشاشة)
  const MITO_A = [[-3.05, 0.35, 0.6], [2.95, -1.25, -0.4], [0.25, 3.25, 0.3], [-1.35, 3.0, 1.1]];
  const MITO_P = [[55, 2.75, 0.1], [173, 2.75, 1.4]];               // زاوية الشاشة، البعد، الدوران
  const OLD = at(A, -2.75, -1.55, 0.36), LYS0 = at(A, -1.25, -3.05, 0.34), LYS2 = at(A, 2.95, 0.75, 0.3);
  const CHL = [];                                                      // البلاستيدات الخضراء على محيط الخليَّة النباتيَّة (زوايا شاشة)
  [[25, true], [85, false], [145, false], [200, false], [330, false]].forEach(([deg, f]) => {
    const a = deg * Math.PI / 180, r = 2.95, t = RT.clone().multiplyScalar(-Math.sin(a)).addScaledVector(UPd, Math.cos(a));
    CHL.push({ p: at(P, r * Math.cos(a), r * Math.sin(a), 0.33), ry: Math.atan2(-t.z, t.x), feat: f });
  });
  const CHL_F = CHL[0];
  const VAC = at(P, -0.1, 0.25, 0.5), VRX = 2.0, VRY = 0.5, VRZ = 1.8;   // الفجوة المركزيَّة
  const rnd = (() => { let s = 97531; return () => (s = (s * 48271) % 2147483647) / 2147483647; })();

  const trans = (c, op, extra) => { const m = new THREE.MeshStandardMaterial(Object.assign({ color: c, transparent: true, opacity: op, roughness: 0.35, depthWrite: false, side: THREE.DoubleSide }, extra || {})); m.color.convertSRGBToLinear(); return m; };
  const matRib = M(0x3B4A6B, { roughness: 0.5 }), matMem = trans(0xD9A441, 0.5), matRim = M(0xC98A2E, { roughness: 0.5 });
  const matCyto = M(0xEAD3A6, { roughness: 0.95 }), matNucIn = M(0xEBC3F0, { roughness: 0.8 }), matChrom = M(0x9C3FA8, { roughness: 0.45 }), matNo = M(0x4A1259, { roughness: 0.4 });
  const matEnvL = trans(0xB57BD0, 0.55), matEnvLi = trans(0xCDA5E0, 0.45), matEnvRim = M(0x8E4FB0, { roughness: 0.45 }), matPore = M(0x3E1650, { roughness: 0.5 });
  const matER = M(0x8FA8D6, { roughness: 0.55, side: THREE.DoubleSide }), matSER = M(0x6FBDB8, { roughness: 0.45 }), matGol = M(0x5BAE5B, { roughness: 0.45 });
  const matMito = M(0xC0392B, { roughness: 0.45 }), matMitoIn = M(0xF3B6AE, { roughness: 0.8 }), matCris = M(0xB03028, { roughness: 0.45 }), matMitoL = trans(0xC0392B, 0.45);
  const matLys = trans(0xF2D04B, 0.78, { side: THREE.FrontSide }), matEnz = M(0xC8102E, { roughness: 0.4 }), matOld = M(0x8E8378, { roughness: 0.6 });
  const matMT = M(0x4F7FE0, { roughness: 0.4 }), matCen = M(0x7A5230, { roughness: 0.45 }), matCenZ = trans(0xF6E7C8, 0.35);
  const matMV = M(0xD9A441, { roughness: 0.5 }), matCil = M(0xC77D2E, { roughness: 0.45 });
  const matChlS = trans(0x43A047, 0.42), matStroma = M(0xB9E0B0, { roughness: 0.8 }), matGrana = M(0x1B6B35, { roughness: 0.45 }), matChlRim = M(0x2E7D32, { roughness: 0.45 });
  const matWall = M(0x95A38E, { roughness: 0.75 }), matCell = M(0xE7EDE0, { roughness: 0.6 }), matVac = trans(0x9FD3F0, 0.5), matTono = M(0x3F86C0, { roughness: 0.4 }), matWat = M(0x2C7BE5, { roughness: 0.3 });
  const matATP = M(0xF28C28, { roughness: 0.35 }), matRNA = M(0xE0407F, { roughness: 0.35 });

  // ── أدوات بناء ──
  const grp = (p, parent) => { const g = new THREE.Group(); if (p) g.position.copy(p); (parent || ctxRef.scene).add(g); return g; };
  const mesh = (g, m, p, parent) => ctxRef.mesh(g, m, p, parent);
  function halfShell(rx, ry, rz, mat, upper, parent) {                 // نصف قشرة بيضاويَّة (علوي أو سفلي)
    const o = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 14, 0, Math.PI * 2, upper ? 0 : Math.PI / 2, Math.PI / 2), mat);
    o.scale.set(rx, ry, rz); o.castShadow = true; parent.add(o); return o;
  }
  function disc(rx, rz, y, mat, parent) { const o = new THREE.Mesh(new THREE.CircleGeometry(1, 40), mat); o.rotation.x = -Math.PI / 2; o.scale.set(rx, rz, 1); o.position.y = y; o.receiveShadow = true; parent.add(o); return o; }
  function ring(rx, rz, y, r, mat, parent) { const pts = []; for (let k = 0; k <= 48; k++) { const t = 2 * Math.PI * k / 48; pts.push(V(rx * Math.cos(t), y, rz * Math.sin(t))); } return ctxRef.tubePts(pts, r, mat, parent); }
  function ribosome(p, parent, big = 0.07, small = 0.05) { const g = grp(p, parent); ctxRef.ball(V(0, 0, 0), big, matRib, g); ctxRef.ball(V(0, big + small * 0.5, 0), small, matRib, g); return g; }

  // النواة المقطوعة: نصف سفلي (غشاءان) وقرص النواة الداخلي والكروماتين والنويَّة، وغطاء علوي يرتفع عند الفتح
  function nucleus(c, R, RY, withPores) {
    const g = grp(V(c.x, RY, c.z)); POP.push([g, 'nuc']);
    halfShell(R, RY, R, matEnvL, false, g); halfShell(R - 0.1, RY - 0.07, R - 0.1, matEnvLi, false, g);
    disc(R - 0.12, R - 0.12, 0.0, matNucIn, g);
    ring(R, R, 0.0, 0.035, matEnvRim, g); ring(R - 0.1, R - 0.1, 0.0, 0.03, matEnvRim, g);   // حافَّتا الغشاءين عند مستوى القطع
    const pores = [];
    if (withPores) for (let k = 0; k < 10; k++) {                       // ثقوب نوويَّة على النصف السفلي (تحت مستوى القطع)
      const lam = (k / 10) * 2 * Math.PI + 0.3, lat = -0.32, p = V(R * Math.cos(lat) * Math.cos(lam), RY * Math.sin(lat), R * Math.cos(lat) * Math.sin(lam));
      const n = V(p.x / (R * R), p.y / (RY * RY), p.z / (R * R)).normalize();
      const t = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.03, 8, 18), matPore); t.position.copy(p).addScaledVector(n, 0.01); t.quaternion.setFromUnitVectors(V(0, 0, 1), n); g.add(t); pores.push({ p, n });
    }
    for (let j = 0; j < 7; j++) {                                      // الكروماتين: خيوط متعرِّجة على مقطع النواة
      const pts = []; let a = rnd() * 6.28, r0 = 0.25 + rnd() * (R - 0.55), x = r0 * Math.cos(a), z = r0 * Math.sin(a), h = rnd() * 6.28;
      for (let k = 0; k < 9; k++) { h += (rnd() - 0.5) * 1.6; x += 0.17 * Math.cos(h); z += 0.17 * Math.sin(h); const rr = Math.hypot(x, z); if (rr > R - 0.3) { x *= (R - 0.3) / rr; z *= (R - 0.3) / rr; h += 2; } pts.push(V(x, 0.04 + 0.03 * Math.sin(k), z)); }
      ctxRef.tubePts(pts, R > 1 ? 0.045 : 0.035, matChrom, g);
    }
    const no = mesh(new THREE.SphereGeometry(1, 20, 14), matNo, V(R * 0.22, 0.02, -R * 0.12), g); no.scale.set(R * 0.27, R * 0.2, R * 0.27);
    const cap = grp(V(0, 0, 0), g); const capM = trans(0xB57BD0, 0.88); const capPore = trans(0x3E1650, 0.9);
    halfShell(R, RY, R, capM, true, cap);
    if (withPores) for (let k = 0; k < 7; k++) {
      const lam = (k / 7) * 2 * Math.PI, lat = 0.55, p = V(R * Math.cos(lat) * Math.cos(lam), RY * Math.sin(lat), R * Math.cos(lat) * Math.sin(lam));
      const n = V(p.x / (R * R), p.y / (RY * RY), p.z / (R * R)).normalize();
      const t = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.03, 8, 18), capPore); t.position.copy(p).addScaledVector(n, 0.01); t.quaternion.setFromUnitVectors(V(0, 0, 1), n); cap.add(t);
    }
    return { g, cap, capM, capPore, pores, no, R, RY };
  }

  // الميتوكندريون: مقطوع (نصف سفلي + حشوة + أعراف + غطاء) أو مغلق
  function mito(p, ry, sc, cut, key) {
    const g = grp(p); g.rotation.y = ry; POP.push([g, key || 'mito']);
    const rx = 1.0 * sc, ryy = 0.4 * sc, rz = 0.46 * sc;
    if (!cut) { const o = mesh(new THREE.SphereGeometry(1, 28, 16), matMito, V(0, 0, 0), g); o.scale.set(rx, ryy, rz); for (const s of [-1, 1]) { const st = mesh(new THREE.BoxGeometry(rx * 0.9, 0.02, 0.03), matCris, V(0, ryy * 0.86, s * rz * 0.25), g); st.visible = sc > 0.75; } return { g }; }
    halfShell(rx, ryy, rz, matMitoL, false, g);
    ring(rx, rz, 0, 0.035, matMito, g); ring(rx - 0.09, rz - 0.08, 0, 0.03, matCris, g);           // غشاءان: الخارجي والداخلي
    disc(rx - 0.1, rz - 0.09, 0.0, matMitoIn, g);                                                     // الحشوة
    for (let i = 0; i < 7; i++) {                                                                     // الأعراف: انثناءات الغشاء الداخلي نحو الداخل بالتناوب
      const x = -rx * 0.72 + i * rx * 0.24, side = i % 2 ? 1 : -1, zr = (rz - 0.08) * Math.sqrt(Math.max(0, 1 - (x / (rx - 0.09)) ** 2)), L = zr * 0.68;
      mesh(new THREE.BoxGeometry(0.06, 0.2, L), matCris, V(x, 0.1, side * (zr - L / 2)), g);
    }
    const cap = grp(V(0, 0, 0), g), capM = trans(0xC0392B, 0.92); halfShell(rx, ryy, rz, capM, true, cap);
    return { g, cap, capM, rx, ryy, rz };
  }

  // البلاستيدة الخضراء: غلاف شفَّاف وجرانا (أكوام ثايلاكويدات) وصفائح بينها؛ المعروضة مقطوعة لها غطاء يرتفع
  function chloroplast(p, ry, feat) {
    const g = grp(p); g.rotation.y = ry; POP.push([g, 'chl']);
    const rx = feat ? 0.95 : 0.78, ryy = 0.33, rz = feat ? 0.5 : 0.42;
    const y0 = feat ? 0.02 : -0.1, nD = feat ? 5 : 4;
    if (feat) { halfShell(rx, ryy, rz, matChlS, false, g); disc(rx - 0.06, rz - 0.05, 0, matStroma, g); ring(rx, rz, 0, 0.03, matChlRim, g); ring(rx - 0.07, rz - 0.06, 0, 0.025, matChlRim, g); }
    const xs = feat ? [-0.55, -0.18, 0.18, 0.55] : [-0.4, 0, 0.4];
    xs.forEach((x, i) => {
      const zz = (i % 2 ? 0.1 : -0.08) * (feat ? 1 : 0.8);
      for (let k = 0; k < nD; k++) mesh(new THREE.CylinderGeometry(feat ? 0.15 : 0.13, feat ? 0.15 : 0.13, 0.035, 18), matGrana, V(x, y0 + 0.03 + k * 0.05, zz), g);
    });
    for (let k = 0; k < xs.length - 1; k++) mesh(new THREE.BoxGeometry(xs[k + 1] - xs[k], 0.015, 0.06), matGrana, V((xs[k] + xs[k + 1]) / 2, y0 + 0.08, 0.01), g);
    let cap = null, capM = null;
    if (feat) { cap = grp(V(0, 0, 0), g); capM = trans(0x43A047, 0.55); halfShell(rx, ryy, rz, capM, true, cap); }
    else { const o = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 16), matChlS); o.scale.set(rx, ryy, rz); g.add(o); }
    return { g, cap, capM };
  }

  // ── المواضع المتحرِّكة ──
  const lysPos = () => { const e = sm(S.eat); return LYS0.clone().lerp(OLD.clone().add(V(0, 0.02, 0)), e).add(V(0, Math.sin(Math.PI * e) * 0.5, 0)); };
  const lysR = () => 0.3 + 0.32 * sm(Math.min(1, S.eat * 3 - 2)) - 0.17 * sm(S.dig);
  function atpPos(i) { const a = i * 1.05 + 0.4, d = V(Math.cos(a), 0, Math.sin(a)); return MITO_F.p.clone().add(V(0, 0.15, 0)).addScaledVector(d, 0.25 + 1.55 * sm(S.atp)).add(V(0, Math.sin(Math.PI * sm(S.atp)) * 0.35 + 0.1 * (i % 2), 0)); }
  function rnaPos(i) {                                                 // جزيء يخرج من النواة عبر ثقب نووي قريب من الكاميرا
    const pr = O.nucA.pores[1], pore = V(NA.x + pr.p.x, NYA + pr.p.y, NA.z + pr.p.z), inn = V(NA.x + pr.p.x * 0.45, NYA + 0.05, NA.z + pr.p.z * 0.45);
    const out = pore.clone().add(V(pr.n.x * 1.3, -0.15, pr.n.z * 1.3)), u = Math.min(1, Math.max(0, S.exp * 1.6 - i * 0.3));
    return u < 0.5 ? inn.lerp(pore, sm(u * 2)) : pore.lerp(out, sm(u * 2 - 1));
  }
  function watPos(i) {
    const a = i * 0.63 + 0.2, start = V(P.x + (AP - 0.5) * Math.sin(a), 0.35 + 0.15 * (i % 3), P.z + (AP - 0.5) * Math.cos(a)), end = VAC.clone().add(V(Math.sin(a) * 0.6, 0.1, Math.cos(a) * 0.55));
    const u = Math.min(1, Math.max(0, S.wat * 1.5 - (i % 5) * 0.1)); return start.lerp(end, sm(u));
  }

  window.DIORAMA = {
    id: 'cell_tour', title: 'جولة في الخليّة كما تُرى بالمجهر الإلكتروني',
    subtitle: 'الأحياء — الصف الحادي عشر — الوحدة الأولى: تركيب الخليَّة',
    source: 'النص من كتاب الطالب: ١-٤ الخلايا النباتيّة والخلايا الحيوانيّة كما تُرى بالمجهر الإلكتروني (ص ٣١–٤٨)، الشكلان ١-٦ و ١-٧، وملخَّص الوحدة (ص ٥٤)',
    legend: [['#D9A441', 'غشاء سطح الخلية'], ['#B57BD0', 'النواة'], ['#C0392B', 'ميتوكندريون'], ['#5BAE5B', 'جهاز جولجي'], null,
             ['#8FA8D6', 'شبكة إندوبلازميّة خشنة'], ['#F2D04B', 'ليسوسوم', 'dot'], ['#4F7FE0', 'أُنيبيبات دقيقة', 'tube'], null,
             ['#43A047', 'بلاستيدة خضراء'], ['#95A38E', 'جدار خلوي'], ['#9FD3F0', 'فجوة مركزية']],
    camera: { VH: 16.0, center: [-0.2, 0.2, -0.6], elevation: 50, azimuth: 45 },
    base: { L: 20.8, W: 11.4, x: -0.1, z: -0.4 },
    BASE: { fo: 0, lid: 0, nuc: 0, nop: 0, exp: 0, er: 0, rib: 0, ser: 0, gol: 0, lys: 0, eat: 0, dig: 0, mito: 0, mop: 0, atp: 0, cen: 0, mt: 0, mv: 0, cil: 0, chl: 0, cop: 0, wall: 0, vac: 0, wat: 0 },
    noGeom: ['fo', 'lid', 'nuc', 'nop', 'exp', 'er', 'rib', 'ser', 'gol', 'lys', 'eat', 'dig', 'mito', 'mop', 'atp', 'cen', 'mv', 'cil', 'chl', 'cop', 'wall', 'vac', 'wat'],
    // نقطة التركيز: 2 النواة، 3 الشبكة الإندوبلازميَّة، 4 الليسوسوم، 5 الميتوكندريون، 6 الجسم المركزي، 7 الخملات والأهداب، 8 البلاستيدة، 9 الخليَّة النباتيَّة
    focus(s) {
      S = s; const k = Math.round(S.fo || 0), z = Math.max(1, S.zoom || 1);
      const t = this._target(k); return t.addScaledVector(RT, -3.6 / z).addScaledVector(UPd, -0.4 / z);   // الهدف يمين المركز بعيداً عن لوحة النص
    },
    _target(k) {
      if (k === 2) return V(NA.x, 0.6, NA.z);
      if (k === 3) return at(A, -0.55, 0.9, 0.4);
      if (k === 4) return at(A, -2.0, -0.9, 0.4);
      if (k === 5) return MITO_F.p.clone();
      if (k === 6) return CEN.clone();
      if (k === 7) return at(A, 2.7, 2.5, 0.6);
      if (k === 8) return CHL_F.p.clone();
      if (k === 9) return at(P, 0, -0.2, 0.4);
      return V(-0.2, 0.2, -0.6);
    },
    STEPS: [
      { t: 'خليّتان مقطوعتان: حيوانيّة ونباتيّة',
        p: 'يبيّن الشكلان ١-٦ و١-٧ والصورتان من ١-٧ و ١-٨ التركيب الدقيق (التفصيلي) للخليّة. غشاء سطح الخلية رقيق جدًا (<span class="ltr">7 nm</span> تقريبًا). الغشاء مُنفِذ جُزئيًا ويتحكّم في تبادل الموادّ بين الخليّة وبيئتها المحيطة.',
        n: 'تُرفع القمَّة عن الخليَّتين لتظهر محتوياتهما؛ ثمَّ تُكشف العُضيّات واحدةً في كلِّ خطوة.',
        seq: [[{}, 500], [{ lid: 1 }, 2400]],
        pills: [['خليّة حيوانيّة (الشكل ١-٦)', RED, () => at(A, 0.6, 3.6, 1.2), 0, -95], ['خليّة نباتيّة (الشكل ١-٧)', GRN, () => at(P, 0.4, 3.4, 1.2), 0, -95],
                ['غشاء سطح الخلية', ORG, () => at(A, RA, -0.4, 0.9), 120, 60], ['سيتوبلازم', GLD, () => at(A, -1.2, -1.5, 0.0), -110, 90], ['غشاء سطح الخلية', ORG, () => at(P, 0.0, -AP, 0.9), -110, 75]] },
      { t: 'النواة: الغلاف النووي والثقوب والكروماتين والنويّة',
        p: 'النواة هي العُضيّة الأكبر في الخليّة كما هو مبين في (الصورة ١-١٠). تُحاط النواة بغشاءَين يشكّلان معًا الغلاف النووي <span class="ltr">Nuclear envelope</span>. يحتوي الغلاف النووي على ثقوب صغيرة كثيرة تسمّى الثقوب النووية <span class="ltr">Nuclear pores</span>، تسمح بتبادل الموادّ بين النواة والسيتوبلازم وتتحكّم فيها. إنّ مجموعة <span class="ltr">DNA</span> مع البروتين تسمّى الكروماتين. الوظيفة الرئيسية للنويّة صنع الرايبوسومات، باستخدام المعلومات في <span class="ltr">DNA</span> الموجود فيها.',
        n: 'يُرفع النصف العلوي من الغلاف النووي ليظهر الكروماتين والنويّة.',
        seq: [[{ nuc: 1 }, 1500], [{ '!fo': 2, zoom: 2.5 }, 1000], [{ nop: 1 }, 1800], [{ exp: 1 }, 2200]],
        pills: [['غلاف نووي (غشاءان)', PUR, () => V(NA.x - NRA * 0.71, NYA, NA.z - NRA * 0.71), -40, -110], ['ثقب نووي', GRY, () => { const q = O.nucA.pores[2]; return V(NA.x + q.p.x, NYA + q.p.y, NA.z + q.p.z); }, -150, 60],
                ['كروماتين', PNK, () => V(NA.x - 0.35, NYA + 0.05, NA.z + 0.45), -150, -40], ['نويّة', PUR, () => O.nucA.no.getWorldPosition(V(0, 0, 0)).add(V(0, 0.2, 0)), 120, -100],
                ['تبادل الموادّ بين النواة والسيتوبلازم', RED, () => rnaPos(0), 150, 60]] },
      { t: 'الشبكة الإندوبلازميّة الخشنة والناعمة والرايبوسومات',
        p: 'يوجد نوعان من الشبكة الإندوبلازميّة <span class="ltr">(ER)</span>: الشبكة الإندوبلازميّة الخشنة <span class="ltr">(Rough endoplasmic Reticulum: RER)</span> والشبكة الإندوبلازميّة الناعمة <span class="ltr">(Smooth Endoplasmic Reticulum: SER)</span>. تسمّى الشبكة الإندوبلازميّة الخشنة بهذا الاسم لأنها مغطّاة بكثير من العُضيّات الصغيرة المسمّاة رايبوسومات. الرايبوسومات هي مواقع بناء البروتين، ويمكن أن توجد أيضًا حرة في السيتوبلازم. للشبكة الإندوبلازميّة الناعمة مظهر أملس لعدم وجود رايبوسومات عليها.',
        seq: [[{ zoom: 1 }, 900], [{ '!fo': 3, zoom: 1.9 }, 1000], [{ er: 1 }, 1800], [{ rib: 1 }, 1500], [{ ser: 1 }, 1400]],
        pills: [['شبكة إندوبلازميّة خشنة', BLU, () => at(A, -0.2, 2.05, 0.75), 60, -100], ['رايبوسومات', GRY, () => at(A, -1.35, 1.75, 0.5), -150, -40],
                ['شبكة إندوبلازميّة ناعمة', TEAL, () => at(A, -2.45, 1.75, 0.3), -120, 80], ['رايبوسومات حرة: وحدة كبيرة ووحدة صغيرة', GRY, () => O.freeA[3].position.clone().add(V(0, 0.1, 0)), 170, 70],
                ['تتّصل بالغشاء الخارجي للغلاف النووي', PUR, () => at(A, -0.2, 1.3, 0.35), 160, -60]] },
      { t: 'الليسوسومات تهضم العُضيّات القديمة',
        p: 'الليسوسومات <span class="ltr">Lysosomes</span> حويصلات كروية بسيطة محاطة بغشاء مفرد، يبلغ قطرها في الخلايا الحيوانيّة عادة <span class="ltr">0.1 - 0.5 µm</span> (الصورة ١-١٣). تحتوي الليسوسومات على إنزيمات هاضمة، وهي تسمّى إنزيمات التحلُّل المائي <span class="ltr">Hydrolases</span>، لأنها تحفّز تفاعلات التحلل المائي. يجب أن تبقى الإنزيمات منفصلة عن بقيّة مكوّنات الخليّة لتجنّب حدوث ضرر، إذ تقوم الليسوسومات بتحطيم (هضم) الموادّ والتراكيب غير المرغوب فيها مثل العُضيّات القديمة أو حتى الخلايا الكاملة.',
        n: 'تصل إنزيمات الليسوسومات من الشبكة الإندوبلازميّة الخشنة عبر جهاز جولجي (انظر ديوراما «مسار الإفراز»). العُضيّة القديمة رماديّة للتمييز.',
        seq: [[{ zoom: 1 }, 900], [{ gol: 1, lys: 1 }, 1400], [{ '!fo': 4, zoom: 2.1 }, 1000], [{ eat: 1 }, 2600], [{ dig: 1 }, 1800]],
        pills: [['ليسوسوم: إنزيمات هاضمة داخل غشاء مفرد', GLD, () => lysPos().add(V(0, lysR(), 0)), 120, -110], ['عُضيّة قديمة تُهضم', GRY, () => OLD.clone(), -150, 70],
                ['جهاز جولجي', GRN, () => GOL_A.clone().add(V(0, 0.45, 0)), 120, 70]] },
      { t: 'الميتوكندريون: غشاءان وأعراف وحشوة',
        p: 'وتحاط الميتوكندريا بغشاءَين (الغلاف)، ويكون الغشاء الداخلي منثنيًا مُكوّنًا بروزات (على شكل أصابع) تسمّى الأعراف <span class="ltr">Cristae</span> (مفردها عرف <span class="ltr">Crista</span>)، تمتدّ إلى داخل الميتوكندريا المسمّى الحشوة <span class="ltr">Matrix</span>، والمساحة بين الغشاءَين تُسمى الحيّز بين غشاءَين كما في الشكل ١-٩. الوظيفة الرئيسية للميتوكندريا هي القيام بعمليّة التنفّس الهوائي، على الرغم من قيامها بوظائف أخرى من بينها تشكيل الدهون. وبعد أن يتكوّن <span class="ltr">ATP</span> يغادر الميتوكندريون.',
        seq: [[{ zoom: 1 }, 900], [{ mito: 1 }, 1400], [{ '!fo': 5, zoom: 2.7 }, 1000], [{ mop: 1 }, 1700], [{ atp: 1 }, 2000]],
        pills: [['غلاف الميتوكندريون (غشاءان)', RED, () => MITO_F.p.clone().add(V(0, 0.0, 0)).addScaledVector(UPd, 0.45), 120, -110], ['أعراف', PNK, () => MITO_F.p.clone().addScaledVector(RT, -0.35).add(V(0, 0.05, 0)), -140, -60],
                ['حشوة', GLD, () => MITO_F.p.clone().addScaledVector(RT, 0.6).add(V(0, -0.15, 0)), 150, 40], ['<span class="ltr">ATP</span> يغادر الميتوكندريون', ORG, () => atpPos(1), 120, 80]] },
      { t: 'الأُنيبيبات الدقيقة والجسم المركزي (سنتريولان)',
        p: 'الأُنيبيبات الدقيقة <span class="ltr">Microtubules</span> أنابيب طويلة نسبيًا صلبة مجوّفة توجد في السيتوبلازم. يبين المجهر الإلكتروني وجود سنتريولين <span class="ltr">Centrioles</span> خارج نواة الخليّة الحيوانيّة وليس سنتريولا واحدًا كما يبدو بالمجهر الضوئي (قارن الشكلَين ١-١ و ١-٦). وهما متقاربان، ويشكّل أحدهما زاوية قائمة بالنسبة إلى الآخر، في منطقة تسمّى الجسم المركزي (السنتروسوم) <span class="ltr">Centrosome</span>. يحتوي كلّ سنتريول على 9 ثلاثيات من الأُنيبيبات الدقيقة (الشكل ١-١١ والصورة ١-١٦).',
        seq: [[{ zoom: 1 }, 900], [{ '!fo': 6, zoom: 1.4 }, 900], [{ cen: 1 }, 900], [{ mt: 1 }, 2200], [{ zoom: 3.6 }, 1300]],
        pills: [['سنتريولان متعامدان', PUR, () => CEN.clone().add(V(0, 0.35, 0)), 140, -100], ['9 ثلاثيات من الأُنيبيبات الدقيقة', GRY, () => CEN.clone().add(V(-0.3, 0.05, 0.2)), -150, 70],
                ['الجسم المركزي (السنتروسوم)', ORG, () => CEN.clone().add(V(0.25, -0.3, 0.3)), 150, 80], ['أُنيبيبات دقيقة', BLU, () => O.mtTip ? O.mtTip.clone() : CEN.clone(), -130, -90]] },
      { t: 'الخملات الدقيقة والأهداب: امتدادات من غشاء سطح الخلية',
        p: 'الخملات الدقيقة <span class="ltr">Microvilli</span> (مفردها خملة دقيقة <span class="ltr">Microvillus</span>): نتوءات على هيئة أصابع تمتدّ من سطح الخليّة فتزيد من مساحة سطح الخليّة لامتصاص أو إفراز أكثر كفاءة. الأهداب <span class="ltr">Cilia</span> (مفردها هُدْب <span class="ltr">Cilium</span>) والأسواط <span class="ltr">Flagella</span> (مفردها سوط <span class="ltr">Flagellum</span>) لها تراكيب متماثلة، فهي امتدادات من غشاء سطح الخلية في العديد من الخلايا حقيقية النواة وتُحدث حركة موجية. الأسواط طويلة ويوجد منها عادة واحد أو اثنان لكل خلية، في حين أن الأهداب قصيرة وغالبًا ما تكون عديدة.',
        n: 'تُعرض الخملات الدقيقة والأهداب على الخليّة نفسها للتوضيح؛ وهي توجد في بعض الخلايا الحيوانيّة فقط.',
        seq: [[{ zoom: 1 }, 900], [{ '!fo': 7, zoom: 1.7 }, 1000], [{ mv: 1 }, 1700], [{ cil: 1 }, 1900]],
        pills: [['خملات دقيقة', ORG, () => V(A.x, 0.9, A.z).addScaledVector(RT, RA + 0.6), 120, -80], ['أهداب', RED, () => V(A.x, 1.2, A.z).addScaledVector(UPd, RA + 1.2), -60, -80],
                ['امتداد لغشاء سطح الخلية', GLD, () => V(A.x, 0.6, A.z).addScaledVector(RT, RA * 0.92).addScaledVector(UPd, RA * 0.38), 150, 70]] },
      { t: 'البلاستيدة الخضراء: الغلاف والثايلاكويدات والجرانا',
        p: 'تميل البلاستيدات الخضراء إلى أخذ شكل متطاول بقطر <span class="ltr">3-10 µm</span> تقريبًا (مقارنة مع قطر <span class="ltr">1 µm</span> للميتوكندريا)، وهي محاطة بغشاءَين، مثل الميتوكندريا، يشكّلان غلاف البلاستيدة. تتكوّن البلاستيدة الخضراء من نظام هو بمثابة أكياس غشائية مسطّحة مليئة بسائل تسمّى الثايلاكويدات <span class="ltr">Thylakoids</span>، تنبسط لتأخذ شكل صفائح ثلاثيّة الأبعاد. وتشكّل الثايلاكويدات تراكيب دائرية الشكل يتراكم بعضها فوق بعض على شكل كومة من قطع معدنية، مشكّلة تراكيب تسمّى جرانا <span class="ltr">Grana</span> (جرانا تعني حُبيبات).',
        seq: [[{ zoom: 1 }, 900], [{ '!fo': 9, zoom: 1.45 }, 1000], [{ chl: 1 }, 1500], [{ zoom: 1 }, 700], [{ '!fo': 8, zoom: 2.9 }, 1100], [{ cop: 1 }, 1700]],
        pills: [['غلاف البلاستيدة (غشاءان)', GRN, () => CHL_F.p.clone().addScaledVector(UPd, 0.5), 110, -110], ['جرانا: ثايلاكويدات متراكمة', GRN, () => CHL_F.p.clone().add(V(0, 0.2, 0)).addScaledVector(RT, 0.2), 150, 80],
                ['الستروما', TEAL, () => CHL_F.p.clone().addScaledVector(RT, -0.6).add(V(0, -0.2, 0)), -140, 60], ['بلاستيدة خضراء', GRN, () => CHL[1].p.clone().add(V(0, 0.3, 0)), -120, -80]] },
      { t: 'الجدار الخلوي والفجوة المركزيّة الكبيرة',
        p: 'الجدران الأولى التي تتكوّن في الخلايا النباتيّة تسمّى الجدران الأوليّة <span class="ltr">Primary walls</span>، وهي صلبة نسبيًا. يتكوّن الجدار الأولي من ألياف متوازية من عديد التسكر، السليلوز، تمتدّ عبر حشوة من عديد التسكر أخرى مثل البكتين والهيميسليلوز كما في الشكل ١-١٤ والصورة ١-١٩. امتصاص الماء إلى داخل الفجوة المركزية بالإسموزيّة مسؤول عن معظم الزيادة في حجم الخلايا النباتيّة أثناء النموّ.',
        n: 'يُعرض انتفاخ الفجوة بدخول الماء دون نموِّ الخليّة نفسها للتبسيط.',
        seq: [[{ zoom: 1 }, 900], [{ '!fo': 9, zoom: 1.5 }, 1000], [{ wall: 1 }, 2000], [{ vac: 1 }, 1400], [{ wat: 1 }, 2400]],
        pills: [['جدار أولي: ألياف متوازية من السليلوز', GRY, () => at(P, AP + 0.2, -0.4, 1.0).add(V(0.1, 0, 0.1)), 130, 80], ['غشاء سطح الخلية (مضغوط على الجدار الخلوي)', ORG, () => at(P, -0.9, -AP + 0.05, 0.8), 130, 115],
                ['فجوة مركزية', BLU, () => VAC.clone().add(V(0, 0.45, 0)), 0, -110], ['غشاء الفجوة', TEAL, () => VAC.clone().addScaledVector(RT, -VRX * 0.95), -140, -60], ['الماء يدخل بالإسموزيّة', BLU, () => watPos(3), 150, -50]] },
      { t: 'مقارنة: الخليّة الحيوانيّة والخليّة النباتيّة',
        p: 'تشمل عُضيّات الخلايا حقيقيّة النواة الشبكة الإندوبلازميّة، ورايبوسومات <span class="ltr">80 S</span>، والميتوكندريا، وتحتوي الخلايا الحيوانيّة أيضًا على جسم مركزي وسنتريولات، وقد تحتوي على أهداب. تحتوي الخلايا النباتيّة على جدار خلوي يحتوي على سليلوز، وقد تحتوي على بلاستيدات خضراء، وغالبًا ما تحتوي على فجوة مركزيّة كبيرة.',
        n: 'النصُّ من ملخَّص الوحدة الأولى (ص ٥٤).',
        seq: [[{ zoom: 1, '!fo': 0 }, 1300]],
        pills: [['جسم مركزي وسنتريولات', PUR, () => CEN.clone(), 150, 70], ['أهداب', RED, () => V(A.x, 1.2, A.z).addScaledVector(UPd, RA + 1.0), 40, -70],
                ['جدار خلوي يحتوي على سليلوز', GRY, () => at(P, -0.6, AP + 0.2, 1.0), -60, -90], ['بلاستيدات خضراء', GRN, () => CHL[3].p.clone().add(V(0, 0.3, 0)), -130, 40],
                ['فجوة مركزيّة كبيرة', BLU, () => VAC.clone().add(V(0, 0.5, 0)), 40, -80], ['الميتوكندريا والشبكة الإندوبلازميّة في الخليّتين', RED, () => MITO_F.p.clone(), 120, 95]] },
    ],
    setup(ctx) {
      ctxRef = ctx; const sc = ctx.scene;
      // ── الخليَّة الحيوانيَّة: أرضيَّة السيتوبلازم وجدار الغشاء وحافَّته وغطاء يُرفع ──
      const fa = new THREE.Mesh(new THREE.CylinderGeometry(RA, RA, 0.24, 72), matCyto); fa.position.set(A.x, -0.18, A.z); fa.receiveShadow = true; sc.add(fa);
      const wa = new THREE.Mesh(new THREE.CylinderGeometry(RA, RA, WH, 72, 1, true), matMem); wa.position.set(A.x, FL0 + WH / 2, A.z); sc.add(wa);
      const ta = new THREE.Mesh(new THREE.TorusGeometry(RA, 0.06, 8, 96), matRim); ta.rotation.x = Math.PI / 2; ta.position.set(A.x, FL0 + WH, A.z); sc.add(ta);
      O.lidA = new THREE.Mesh(new THREE.SphereGeometry(RA, 48, 16, 0, Math.PI * 2, 0, Math.PI / 2), trans(0xD9A441, 0.6)); O.lidA.scale.y = 0.42; O.lidA.position.set(A.x, FL0 + WH, A.z); sc.add(O.lidA);
      // ── الخليَّة النباتيَّة: موشور سداسي ──
      const fp = new THREE.Mesh(new THREE.CylinderGeometry(RP, RP, 0.24, 6), matCyto); fp.position.set(P.x, -0.18, P.z); fp.receiveShadow = true; sc.add(fp);
      const wp = new THREE.Mesh(new THREE.CylinderGeometry(RP, RP, WH, 6, 1, true), matMem); wp.position.set(P.x, FL0 + WH / 2, P.z); sc.add(wp);
      for (let k = 0; k < 6; k++) { const a1 = k * Math.PI / 3, a2 = a1 + Math.PI / 3; ctx.rod(V(P.x + RP * Math.sin(a1), FL0 + WH, P.z + RP * Math.cos(a1)), V(P.x + RP * Math.sin(a2), FL0 + WH, P.z + RP * Math.cos(a2)), 0.06, matRim, sc); }
      O.lidP = new THREE.Mesh(new THREE.CylinderGeometry(RP * 0.62, RP, 1.1, 6), trans(0xD9A441, 0.6)); O.lidP.position.set(P.x, FL0 + WH + 0.55, P.z); sc.add(O.lidP);
      // ── الجدار الخلوي: ستَّة ألواح حول الغشاء + ألياف سليلوز متوازية على سطحها ──
      O.wall = [];
      const TW = 0.34, WR = AP + 0.04 + TW / 2;
      for (let k = 0; k < 6; k++) {
        const th = Math.PI / 6 + k * Math.PI / 3, g = grp(V(P.x + WR * Math.sin(th), FL0, P.z + WR * Math.cos(th))); g.rotation.y = th;
        mesh(new THREE.BoxGeometry(RP + 0.42, WH + 0.1, TW), matWall, V(0, (WH + 0.1) / 2, 0), g);
        for (let f = 0; f < 3; f++) { const o = mesh(new THREE.CylinderGeometry(0.025, 0.025, RP + 0.3, 6), matCell, V(0, 0.25 + f * 0.33, TW / 2 + 0.01), g); o.rotation.z = Math.PI / 2; }
        O.wall.push(g);
      }
      // ── النواتان ──
      O.nucA = nucleus(NA, NRA, NYA, true); O.nucP = nucleus(NP, NRP, NYP, true);
      // ── الشبكة الإندوبلازميَّة الخشنة: أكياس منحنية رأسيَّة حول النواة (من الجهة البعيدة) تتَّصل بالغلاف النووي ──
      const erSet = (c, th0, span, radii, hs, key) => {
        const g = grp(V(c.x, FL0, c.z)); POP.push([g, key]); const ribs = [];
        radii.forEach((r, i) => {
          const o = new THREE.Mesh(new THREE.CylinderGeometry(r, r, hs[i], 36, 1, true, th0 - span / 2, span), matER); o.position.y = hs[i] / 2 + 0.02; o.castShadow = true; g.add(o);
          for (let th = th0 - span / 2 + 0.12; th < th0 + span / 2 - 0.05; th += 0.3 / r) for (const y of [hs[i] * 0.3, hs[i] * 0.72]) {
            const b = ctx.ball(V((r + 0.07) * Math.sin(th + (y > 0.4 ? 0.06 : 0)), y, (r + 0.07) * Math.cos(th + (y > 0.4 ? 0.06 : 0))), 0.06, matRib, g); ribs.push(b);
          }
        });
        const Rn = radii[0] > 1.5 ? NRA : NRP, mid = (Rn + radii[0]) / 2; mesh(new THREE.BoxGeometry(0.12, 0.3, radii[0] - Rn + 0.12), matER, V(mid * Math.sin(th0), hs[0] * 0.55, mid * Math.cos(th0)), g).rotation.y = th0;
        return { g, ribs };
      };
      O.erA = erSet(NA, thetaOf(UPd), 2.1, [1.68, 2.0, 2.32], [0.78, 0.7, 0.62], 'er');
      O.erP = erSet(NP, thetaOf(RT.clone().multiplyScalar(-1)), 1.4, [1.12, 1.38], [0.55, 0.5], 'er');
      // ── رايبوسومات حرَّة ──
      O.freeA = []; O.freeP = [];
      const freeIn = (c, rMax, list, n, avoid) => { let tries = 0; while (list.length < n && tries++ < 4000) {
        const a = rnd() * 6.283, r = Math.sqrt(rnd()) * rMax, p = V(c.x + r * Math.sin(a), 0.1, c.z + r * Math.cos(a));
        if (avoid.some(([q, d]) => Math.hypot(p.x - q.x, p.z - q.z) < d)) continue; list.push(ribosome(p, sc)); } };
      freeIn(A, RA - 0.35, O.freeA, 26, [[NA, NRA + 1.2], [CEN, 0.5], [MITO_F.p, 1.1], [OLD, 0.6], [LYS0, 0.5], [GOL_A, 0.8]]);
      freeIn(P, AP - 0.35, O.freeP, 12, [[VAC, 2.15], [NP, NRP + 0.2], ...CHL.map(c => [c.p, 0.75])]);
      // ── الشبكة الإندوبلازميَّة الناعمة: أنابيب متعرِّجة ملساء ──
      const serSet = (c, n, len, rot) => { const g = grp(c); g.rotation.y = rot; POP.push([g, 'ser']);
        for (let j = 0; j < n; j++) { const pts = []; for (let k = 0; k <= 12; k++) { const x = -len / 2 + len * k / 12; pts.push(V(x, 0.18 + 0.06 * j, (j - (n - 1) / 2) * 0.3 + 0.12 * Math.sin(k * 0.9 + j))); } ctx.tubePts(pts, 0.085, matSER, g); }
        return g; };
      serSet(at(A, -2.45, 1.7, 0), 4, 1.8, 0.4); serSet(polar(P, 115, 2.85, 0), 2, 1.1, 1.2);
      // ── جهاز جولجي (مختصر): أكياس مسطَّحة متراكمة وحويصلات ──
      const golgi = (c, s) => { const g = grp(c); POP.push([g, 'gol']); g.rotation.y = 0.9;
        [0.62, 0.7, 0.66, 0.55].forEach((w, i) => { const o = mesh(new THREE.SphereGeometry(1, 24, 12), matGol, V(0, 0.12 + i * 0.11, 0.05 * Math.sin(i * 1.3)), g); o.scale.set(w * s, 0.045, 0.24 * s); });
        [[0.8, 0.3, 0.25], [-0.75, 0.25, -0.2], [0.7, 0.45, -0.3]].forEach(([x, y, z]) => ctx.ball(V(x * s, y, z * s), 0.09, matGol, g)); return g; };
      golgi(GOL_A, 1.0); golgi(GOL_P, 0.8);
      // ── الليسوسومات والعُضيَّة القديمة ──
      O.lys = mesh(new THREE.SphereGeometry(1, 28, 18), matLys, LYS0); POP.push([O.lysG = O.lys, 'lys']);
      O.enz = [V(0.3, 0.1, 0.1), V(-0.25, -0.1, 0.15), V(0.05, 0.25, -0.2), V(-0.1, -0.2, -0.25), V(0.2, -0.15, -0.1)].map(d => ({ d, o: mesh(new THREE.SphereGeometry(0.055, 10, 8), matEnz, LYS0) }));
      O.lys2 = mesh(new THREE.SphereGeometry(0.28, 24, 16), matLys, LYS2); POP.push([O.lys2, 'lys']);
      O.old = mesh(new THREE.SphereGeometry(1, 24, 14), matOld, OLD); O.old.scale.set(0.5, 0.28, 0.3); O.old.rotation.y = 0.7;
      // ── الميتوكندريا ──
      O.mitoF = mito(MITO_F.p, MITO_F.ry, 1.0, true);
      MITO_A.forEach(([sx, sy, r]) => mito(at(A, sx, sy, 0.3), r, 0.72, false));
      MITO_P.forEach(([deg, r, ry]) => mito(polar(P, deg, r, 0.28), ry, 0.62, false));
      O.atp = [0, 1, 2, 3, 4, 5].map(() => mesh(new THREE.SphereGeometry(0.1, 12, 10), matATP, MITO_F.p));
      O.rna = [0, 1, 2].map(() => mesh(new THREE.SphereGeometry(0.08, 12, 10), matRNA, NA));
      // ── الجسم المركزي: سنتريولان متعامدان، كلٌّ منهما 9 ثلاثيات من الأُنيبيبات الدقيقة ──
      O.cen = grp(CEN); POP.push([O.cen, 'cen']);
      mesh(new THREE.SphereGeometry(0.48, 24, 16), matCenZ, V(0, 0, 0), O.cen);
      const centriole = (q) => { const g = grp(V(0, 0, 0), O.cen); g.quaternion.copy(q);
        for (let k = 0; k < 9; k++) { const a = k * 2 * Math.PI / 9; for (let j = 0; j < 3; j++) {
          const r = 0.17 - j * 0.035, aa = a + j * 0.23; ctx.rod(V(r * Math.cos(aa), -0.24, r * Math.sin(aa)), V(r * Math.cos(aa), 0.24, r * Math.sin(aa)), 0.02, matCen, g); } }
        return g; };
      const c1 = centriole(new THREE.Quaternion()); c1.position.set(-0.18, 0.05, 0.12);
      const c2 = centriole(new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), RT.clone())); c2.position.set(0.2, -0.18, -0.1);
      // ── الخملات الدقيقة على جدار الغشاء (يمين الشاشة) والأهداب (أعلاها) ──
      const out = (phi) => V(Math.sin(phi), 0, Math.cos(phi));
      O.mv = []; const phR = thetaOf(RT);
      for (let i = 0; i < 9; i++) for (const y of [0.3, 0.78]) {
        const ph = phR - 0.42 + i * 0.105 + (y > 0.5 ? 0.05 : 0), d = out(ph), g = grp(V(A.x + RA * d.x, y, A.z + RA * d.z)); g.quaternion.setFromUnitVectors(V(0, 1, 0), d);
        mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.6, 10), matMV, V(0, 0.3, 0), g); mesh(new THREE.SphereGeometry(0.075, 10, 8), matMV, V(0, 0.6, 0), g); O.mv.push(g);
      }
      O.cil = []; const phU = thetaOf(UPd);
      for (let i = 0; i < 7; i++) {
        const ph = phU - 0.33 + i * 0.11, d = out(ph), g = grp(V(A.x + RA * d.x, 0.62, A.z + RA * d.z)); g.quaternion.setFromUnitVectors(V(0, 1, 0), d);
        const inner = grp(V(0, 0, 0), g); const pts = []; for (let k = 0; k <= 10; k++) { const s = 1.75 * k / 10; pts.push(V(0.18 * Math.sin(s * 1.6), s, 0)); } ctx.tubePts(pts, 0.055, matCil, inner);
        O.cil.push({ g, inner, ph: i * 0.6 });
      }
      // ── البلاستيدات الخضراء والفجوة ──
      O.chl = CHL.map(c => chloroplast(c.p, c.ry, c.feat)); O.chlF = O.chl[0];
      O.vac = grp(VAC); POP.push([O.vac, 'vac']);
      const vs = mesh(new THREE.SphereGeometry(1, 40, 24), matVac, V(0, 0, 0), O.vac); vs.scale.set(VRX, VRY, VRZ); vs.castShadow = false;
      O.tono = ring(VRX, VRZ, 0, 0.04, matTono, O.vac);
      O.wat = [...Array(10).keys()].map(() => mesh(new THREE.SphereGeometry(0.075, 10, 8), matWat, VAC));
      O.mtA = []; O.mtP = [];
      for (let i = 0; i < 11; i++) {                                     // مسارات الأُنيبيبات الدقيقة المتفرِّعة من الجسم المركزي نحو المحيط
        const a = i * 2 * Math.PI / 11 + 0.25, d = V(Math.sin(a), 0, Math.cos(a)), pts = [];
        for (let k = 0; k <= 14; k++) { const t = k / 14, r = 0.35 + t * 3.6; let p = V(CEN.x + r * d.x + 0.35 * Math.sin(t * 3 + i) * d.z, 0.12 + 0.35 * (1 - t), CEN.z + r * d.z - 0.35 * Math.sin(t * 3 + i) * d.x);
          const dx = p.x - A.x, dz = p.z - A.z, rr = Math.hypot(dx, dz); if (rr > RA - 0.25) { p.x = A.x + dx * (RA - 0.25) / rr; p.z = A.z + dz * (RA - 0.25) / rr; }
          const dn = Math.hypot(p.x - NA.x, p.z - NA.z); if (dn < NRA + 0.12) { p.x = NA.x + (p.x - NA.x) * (NRA + 0.12) / dn; p.z = NA.z + (p.z - NA.z) * (NRA + 0.12) / dn; }
          pts.push(p); }
        O.mtA.push(pts);
      }
      for (let i = 0; i < 5; i++) { const a0 = 0.5 + i * 1.2, pts = []; for (let k = 0; k <= 8; k++) { const a = a0 + k * 0.09; pts.push(V(P.x + (AP - 0.3) * Math.sin(a), 0.12, P.z + (AP - 0.3) * Math.cos(a))); } O.mtP.push(pts); }
    },
    rebuild(s, ctx) {
      S = s; O.mtTip = null; if (S.mt <= 0.01) return;
      const f = sm(S.mt);
      O.mtA.forEach((pts, i) => { const n = Math.max(2, Math.round(pts.length * f)); const sub = pts.slice(0, n); ctx.tubePts(sub, 0.035, matMT); if (i === 8) O.mtTip = sub[Math.max(0, n - 4)].clone(); });
      O.mtP.forEach(pts => { const n = Math.max(2, Math.round(pts.length * f)); ctx.tubePts(pts.slice(0, n), 0.035, matMT); });
    },
    place(s) {
      S = s;
      for (const [g, k] of POP) { const v = sm(S[k]); g.visible = v > 0.01; g.scale.setScalar(Math.max(0.001, v)); }
      // الأغطية تُرفع
      const l = sm(S.lid);
      O.lidA.position.y = FL0 + WH + 2.4 * l; O.lidA.material.opacity = 0.6 * (1 - l); O.lidA.visible = l < 0.99;
      O.lidP.position.y = FL0 + WH + 0.55 + 2.4 * l; O.lidP.material.opacity = 0.6 * (1 - l); O.lidP.visible = l < 0.99;
      // فتح النواة
      const no = sm(S.nop);
      for (const N of [O.nucA, O.nucP]) { N.cap.position.y = 1.9 * no; N.capM.opacity = 0.88 * (1 - no); N.capPore.opacity = 0.9 * (1 - no); N.cap.visible = no < 0.99; }
      O.rna.forEach((o, i) => { o.position.copy(rnaPos(i)); o.visible = S.exp > 0.01; });
      // الشبكة الإندوبلازميَّة: تنمو من الأرضيَّة ثمَّ تظهر الرايبوسومات
      const e = sm(S.er), r = sm(S.rib);
      for (const E of [O.erA, O.erP]) { E.g.scale.set(1, Math.max(0.001, e), 1); E.ribs.forEach(b => { b.visible = r > 0.02; b.scale.setScalar(0.06 * Math.max(0.001, r)); }); }
      for (const f of O.freeA.concat(O.freeP)) { f.visible = r > 0.02; f.scale.setScalar(Math.max(0.001, r)); }
      // الليسوسوم يبتلع العُضيَّة القديمة ثمَّ يهضمها
      const lp = lysPos(), lr = lysR(); O.lys.position.copy(lp); O.lys.scale.setScalar(Math.max(0.001, lr * sm(S.lys)));
      O.enz.forEach(({ d, o }) => { o.visible = S.lys > 0.5; o.position.copy(lp).addScaledVector(d, lr / 0.3 * 0.8); });
      const dg = sm(S.dig), ol = sm(S.lys) * (1 - dg); O.old.scale.set(0.5 * ol + 0.001, 0.28 * ol + 0.001, 0.3 * ol + 0.001); O.old.visible = S.lys > 0.01 && dg < 0.98;
      // الميتوكندريون المقطوع و ATP
      const mo = sm(S.mop); O.mitoF.cap.position.y = 1.4 * mo; O.mitoF.capM.opacity = 0.92 * (1 - mo); O.mitoF.cap.visible = mo < 0.99;
      O.atp.forEach((o, i) => { o.visible = S.atp > 0.02; o.position.copy(atpPos(i)); });
      // الخملات والأهداب تنمو للخارج
      const mv = sm(S.mv), cl = sm(S.cil);
      O.mv.forEach(g => { g.visible = mv > 0.01; g.scale.set(1, Math.max(0.001, mv), 1); });
      O.cil.forEach(c => { c.g.visible = cl > 0.01; c.inner.scale.set(1, Math.max(0.001, cl), 1); c.inner.rotation.z = 0.25 * Math.sin(c.ph); });
      // البلاستيدة المقطوعة
      const co = sm(S.cop); O.chlF.cap.position.y = 1.3 * co; O.chlF.capM.opacity = 0.55 * (1 - co); O.chlF.cap.visible = co < 0.99;
      // الجدار الخلوي ينمو، والفجوة تنتفخ بدخول الماء
      const w = sm(S.wall); O.wall.forEach(g => { g.visible = w > 0.01; g.scale.set(1, Math.max(0.001, w), 1); });
      const wt = sm(S.wat); O.vac.scale.set(sm(S.vac) * (0.82 + 0.18 * wt), sm(S.vac) * (0.8 + 0.2 * wt), sm(S.vac) * (0.82 + 0.18 * wt));
      O.wat.forEach((o, i) => { const u = Math.min(1, Math.max(0, S.wat * 1.5 - (i % 5) * 0.1)); o.visible = S.wat > 0.01 && u < 0.97; o.position.copy(watPos(i)); });
    },
    idle(t, s, ctx, tweening) {
      if (tweening || !O.cil) return;
      if (s.cil > 0.99) O.cil.forEach(c => { c.inner.rotation.z = 0.35 * Math.sin(t * 5 + c.ph); });  // ضربات الأهداب
      if (s.atp >= 1) O.atp.forEach((o, i) => { o.position.y = atpPos(i).y + Math.sin(t * 2 + i) * 0.04; });
    },
  };
})();
