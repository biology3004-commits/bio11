/* ديوراما: الماء — ثنائيَّات القطب والروابط الهيدروجينيَّة وخصائص الماء — الدرس ٢-٥ (كتاب الطالب أحياء ١١ ف١ ص ٩٠–٩٢) */
(function () {
  const { V, sm, M, CSS } = DioramaCore;
  const { BLU, RED, GLD, TEAL, PNK, GRY, GRN, ORG, PUR } = CSS;
  const L = s => `<span class="ltr">${s}</span>`;
  // ── ثوابت الجزيء ───────────────────────────────────────────────────
  const A = 52.25 * Math.PI / 180;                       // نصف زاوية H–O–H (104.5°)
  const RO = 0.42, RH = 0.26, LOH = 0.62, BL = 1.78;     // أنصاف أقطار الذرَّات، طول الرابطة التساهميَّة، مسافة O···O في الرابطة الهيدروجينيَّة
  const H1 = V(Math.cos(A), 0, Math.sin(A)), H2 = V(Math.cos(A), 0, -Math.sin(A));   // اتجاها الهيدروجين في إطار الجزيء (المنصِّف +x)
  const UP = V(0, 1, 0);
  const basisQ = (b, n) => { const X = b.clone().normalize(); const Z = new THREE.Vector3().crossVectors(X, n).normalize(); const Y = new THREE.Vector3().crossVectors(Z, X); return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(X, Y, Z)); };
  const rotY = (v, a) => v.clone().applyAxisAngle(UP, a);
  // ── المشهد: حوض الماء (يسار) ومحطَّة الأيونات (يمين) ومقياسا الحرارة ومصدر الحرارة ──
  const POOL = { c: V(-3.6, 0.85, 0.3), sx: 10.0, sy: 1.7, sz: 7.4 };
  const TH_W = V(-9.6, 0, -1.6), TH_A = V(-9.6, 0, 2.6);            // مقياس الماء ومقياس الهواء
  const FLAME = V(-3.4, 0.05, 4.5);
  const NA_T = V(5.7, 0.95, -0.1), CL_T = V(7.4, 0.95, 0.5);        // الأيونان متجاوران
  const NA_S = V(3.9, 0.95, -1.3), CL_S = V(8.3, 0.95, 1.1);        // الأيونان منفصلان
  const R_NA = 0.75, R_CL = 0.95;
  const jit = i => V(Math.sin(i * 7.3), Math.cos(i * 5.1) * 0.5, Math.sin(i * 3.7));
  // ── شبكة الروابط الهيدروجينيَّة: 9 جزيئات تُبنى هندسيّاً حول جزيء مركزي (كلُّ رابطة من هيدروجين مانح إلى أكسجين مستقبِل) ──
  const MOL = [], BONDS = [];                             // MOL: {B, QB, F, QF, hw, out}؛ BONDS: {d: المانح, h: أيُّ هيدروجين, a: المستقبِل, m: الجزيء الطرفي}
  function addMol(pos, q) { MOL.push({ B: pos, QB: q, hw: [H1.clone().applyQuaternion(q), H2.clone().applyQuaternion(q)] }); return MOL.length - 1; }
  const donateTo = (i, k, b, n) => { const m = MOL[i]; const j = addMol(m.B.clone().addScaledVector(m.hw[k], BL), basisQ(b, n)); BONDS.push({ d: i, h: k, a: j, m: j }); return j; };   // الجزيء الجديد يستقبل من هيدروجين k للجزيء i
  const acceptFrom = (i, k, b, n) => { const q = basisQ(b, n), h = (k ? H2 : H1).clone().applyQuaternion(q); const j = addMol(MOL[i].B.clone().addScaledVector(h, -BL), q); BONDS.push({ d: j, h: k, a: i, m: j }); return j; };   // الجزيء الجديد يمنح من هيدروجينه k إلى أكسجين i
  const tiltN = (a, b) => V(a, 1, b).normalize();
  const r0 = addMol(V(-3.4, 0.95, 0.3), basisQ(V(1, 0, 0.05), tiltN(0.1, 0.1)));
  const c1 = donateTo(r0, 0, V(1, 0.1, 0.05), tiltN(-0.15, 0.1)), c2 = donateTo(r0, 1, V(1, -0.08, -0.05), tiltN(0.12, -0.1));
  const c3 = acceptFrom(r0, 1, V(1, 0.08, 0.1), tiltN(0.1, -0.15)), c4 = acceptFrom(r0, 0, V(1, -0.1, -0.1), tiltN(-0.1, 0.15));
  donateTo(c1, 0, V(1, 0.12, 0.3), tiltN(0.1, 0.1)); donateTo(c2, 1, V(1, -0.1, -0.3), tiltN(-0.1, -0.1));
  acceptFrom(c3, 1, V(1, 0.1, 0.2), tiltN(0.15, 0)); acceptFrom(c4, 0, V(1, -0.1, -0.2), tiltN(-0.15, 0));
  const N = MOL.length;                                   // 9 جزيئات، 8 روابط هيدروجينيَّة
  const CC = MOL.reduce((a, m) => a.add(m.B), V(0, 0, 0)).multiplyScalar(1 / N);
  MOL.forEach((m, i) => {
    m.out = V(m.B.x - CC.x, 0, m.B.z - CC.z).normalize();
    m.F = i === 0 ? m.B.clone() : CC.clone().add(m.B.clone().sub(CC).multiplyScalar(1.45)).add(jit(i).multiplyScalar(0.3));
    m.F.y = 0.95 + 0.25 * Math.sin(i * 2.3);
    m.QF = i === 0 ? m.QB.clone() : new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.sin(i * 2.1) * 1.2, i * 1.7, Math.cos(i * 1.3) * 0.9));
  });
  const EV = [5, 7, 8];                                   // الجزيئات التي تتبخَّر (روابطها مكسورة في الخطوة ٦)
  const brkOf = (S, i) => i >= 5 ? sm(Math.min(1, Math.max(0, S.brk * 4 - (8 - i)))) : 0;    // كسر روابط الجزيئات 8→5 بالتتابع
  const evOf = (S, i) => { const k = EV.indexOf(i); return k < 0 ? 0 : sm(Math.min(1, Math.max(0, S.ev * 1.6 - k * 0.3))); };
  // موضع واتجاه الجزيء i في الحالة S
  function molPose(S, i) {
    const m = MOL[i], a = i === 0 ? 1 : i === 1 ? sm(S.a1) : sm(S.a);
    const p = m.F.clone().lerp(m.B, a), q = m.QF.clone().slerp(m.QB, a);
    const br = brkOf(S, i); if (br > 0) { p.addScaledVector(m.out, 0.5 * br); p.y += 0.15 * br; }
    const e = evOf(S, i); if (e > 0) { p.y += 4.2 * e; p.x += 0.7 * Math.sin(e * 3.1) * (i % 2 ? 1 : -1); p.z += 0.4 * Math.sin(e * 2.3); q.multiply(new THREE.Quaternion().setFromAxisAngle(UP, e * 2.5)); }
    return { p, q };
  }
  const atomH = (pose, k) => pose.p.clone().addScaledVector((k ? H2 : H1).clone().applyQuaternion(pose.q), LOH);
  // ظهور رابطة الجزيء الطرفي i (الرابطة الأولى تخصُّ الجزيء 1)
  function bondVis(S, i) { const b = i === 1 ? S.b1 : S.hb; return Math.max(0, Math.min(1, b) - brkOf(S, i) - evOf(S, i)); }
  // ── محطَّة الإذابة: 5 جزيئات حول كلِّ أيون ──
  const NH = 5;
  const ring = (c, r, k, sign) => { const a = k * 2 * Math.PI / NH + 0.35 * sign; return { p: c.clone().add(V(r * Math.cos(a), (k % 2 ? 0.45 : -0.15), r * Math.sin(a))), rad: V(Math.cos(a), 0, Math.sin(a)) }; };
  const HYD = Array.from({ length: 2 * NH }, (_, j) => ({ st: V(2.0, 1.0, -2.9 + 0.75 * j), QF: new THREE.Quaternion().setFromEuler(new THREE.Euler(j * 1.1, j * 0.7, j * 1.9)) }));
  const ionPos = (S, which) => which ? CL_T.clone().lerp(CL_S, sm(S.sep)) : NA_T.clone().lerp(NA_S, sm(S.sep));
  function hydPose(S, j) {
    const which = j < NH ? 0 : 1, k = j % NH, c = ionPos(S, which), g = ring(c, which ? R_CL + 1.05 : R_NA + 1.0, k, which ? 1 : -1);
    const u = sm(Math.min(1, Math.max(0, S.sol * 1.5 - k * 0.1 - which * 0.05)));
    const p = HYD[j].st.clone().lerp(g.p, u); p.y += 1.2 * Math.sin(Math.PI * u);
    // حول الأيون الموجب يواجهه الأكسجين (المنصِّف نحو الخارج)، وحول الأيون السالب يواجهه الهيدروجين (المنصِّف نحو الأيون)
    const b = which ? g.rad.clone().negate() : g.rad.clone(); b.y = 0.15 * (k % 2 ? 1 : -1);
    const q = HYD[j].QF.clone().slerp(basisQ(b, V(0.2 * Math.sin(k), 1, 0.2 * Math.cos(k))), u);
    return { p, q, s: Math.min(1, S.sol * 5) };
  }
  // ── موادُّ ─────────────────────────────────────────────────────────
  const matO = M(0xE53935, { roughness: 0.35 }), matHy = M(0xF2F2F2, { roughness: 0.5 }), matBond = M(0x546E7A), matDot = M(0x1E88E5, { roughness: 0.3 });
  const matNa = M(0x9B8BC4, { roughness: 0.4 }), matCl = M(0x6CBF6C, { roughness: 0.4 });
  const matGlass = M(0xF7F7F2, { roughness: 0.9 }), matHg = M(0xC62828, { roughness: 0.4 }), matBurner = M(0x455A64);
  let S;
  const O = {};
  // بناء جزيء ماء دائم (مجموعة: أكسجين + هيدروجينان + رابطتان تساهميَّتان)
  function buildMol(ctx, halos) {
    const g = new THREE.Group(); ctx.scene.add(g);
    ctx.ball(V(0, 0, 0), RO, matO, g);
    [H1, H2].forEach(h => { ctx.ball(h.clone().multiplyScalar(LOH), RH, matHy, g); ctx.rod(V(0, 0, 0), h.clone().multiplyScalar(LOH), 0.09, matBond, g); });
    if (halos) { g.userData.halo = [ctx.blob(0x42A5F5, 0.32, g)]; g.userData.halo[0].scale.setScalar(0.72); [H1, H2].forEach(h => { const b = ctx.blob(0xF06292, 0.34, g); b.scale.setScalar(0.48); b.position.copy(h).multiplyScalar(LOH); g.userData.halo.push(b); }); }
    return g;
  }
  function thermo(ctx, at) {
    const g = new THREE.Group(); g.position.copy(at); ctx.scene.add(g);
    ctx.mesh(new THREE.CylinderGeometry(0.2, 0.2, 3.6, 16), matGlass, V(0, 2.1, 0), g);
    ctx.mesh(new THREE.SphereGeometry(0.4, 18, 14), matHg, V(0, 0.45, 0), g);
    const col = ctx.mesh(new THREE.CylinderGeometry(0.11, 0.11, 1, 12), matHg, V(0, 1, 0), g);
    for (let k = 0; k < 6; k++) ctx.mesh(new THREE.BoxGeometry(0.5, 0.05, 0.08), matBurner, V(0, 0.9 + 0.55 * k, 0.2), g);
    return { g, col };
  }
  const setCol = (t, v) => { const h = 0.1 + 2.9 * v; t.col.scale.y = h; t.col.position.y = 0.75 + h / 2; };

  window.DIORAMA = {
    id: 'water', title: 'الماء: ثنائيَّات القطب والروابط الهيدروجينيَّة', subtitle: 'الأحياء — الصف الحادي عشر — الوحدة الثانية: الجُزيئات الحيويَّة',
    source: 'النص من كتاب الطالب: ٢-٥ الماء (ص ٩٠–٩٢) والشكل ٢-٢٤',
    legend: [['#E53935', 'ذرّة أكسجين', 'dot'], ['#F2F2F2', 'ذرّة هيدروجين', 'dot'], ['#546E7A', 'رابطة تساهميّة', 'tube'], ['#1E88E5', 'رابطة هيدروجينيّة (منقّطة)', 'dot'], null,
             ['#9B8BC4', 'أيون موجب الشحنة (Na⁺)', 'dot'], ['#6CBF6C', 'أيون سالب الشحنة (Cl⁻)', 'dot'], ['#FB8C00', 'مصدر حرارة'], ['#C62828', 'مقياس درجة الحرارة', 'tube']],
    camera: { VH: 19, center: [-0.3, 1.7, 0.3] },
    base: { L: 21.5, W: 11.5, x: -0.3, z: 0.4 },
    BASE: { fo: 0, ch: 0, a1: 0, b1: 0, a: 0, hb: 0, ion: 0, sol: 0, sep: 0, heat: 0, tw: 0, brk: 0, air: 0, ta: 0, ev: 0 },
    noGeom: ['fo', 'ch', 'ion', 'sol', 'sep', 'heat', 'tw', 'air', 'ta'],
    // نقطة التركيز: 0 المشهد، 1 الجزيء الأوَّل، 2 هيدروجين الجزيء الأوَّل (موضع الرابطة)، 3 مركز الشبكة، 4 الأيونان، 5 الحوض والمقياس، 6 سطح الماء (التبخُّر)
    focus(s) {
      S = s; const k = Math.round(S.fo || 0);
      if (k === 1) return MOL[0].B.clone().add(V(0.3, 0.3, 0));
      if (k === 2) return atomH({ p: MOL[0].B, q: MOL[0].QB }, 0).add(V(0.5, 0.2, 0));
      if (k === 3) return CC.clone().add(V(0, 0.4, 0));
      if (k === 4) return NA_S.clone().lerp(CL_S, 0.5).add(V(0, 0.6, 0));
      if (k === 5) return V(-6.4, 1.6, 0.6);
      if (k === 6) return CC.clone().add(V(0.5, 2.6, 0));
      return V(-0.3, 1.7, 0.3);
    },
    STEPS: [
      { t: 'جُزيء الماء: ذرّة أكسجين وذرّتا هيدروجين بروابط تساهميّة',
        p: `عندما تتماسك الذرّات في الجزيئات معًا بواسطة الروابط التساهمية، فإن الإلكترونات تتشارك بعضها مع بعض. وكل زوج من الإلكترونات يشكل رابطة تساهمية واحدة. على سبيل المثال: تتشارك كل من ذرّتي الهيدروجين في جُزيء الماء بزوج من الإلكترونات مع ذرّة أكسجين، مُشكّلة جزيئًا بالصيغة ${L('H₂O')}.`,
        seq: [[{ '!fo': 1, zoom: 2.6 }, 1200]],
        pills: [['ذرّة أكسجين', RED, () => MOL[0].B, -120, -90], ['ذرّة هيدروجين', GRY, () => atomH({ p: MOL[0].B, q: MOL[0].QB }, 0), 150, 60], ['ذرّة هيدروجين', GRY, () => atomH({ p: MOL[0].B, q: MOL[0].QB }, 1), 60, -110],
                ['رابطة تساهميّة', TEAL, () => MOL[0].B.clone().lerp(atomH({ p: MOL[0].B, q: MOL[0].QB }, 0), 0.5), 40, 120]] },
      { t: 'ثنائي القطب: شحنة سالبة جزئية على الأكسجين وموجبة جزئية على الهيدروجين',
        p: `إلّا أنّه، لا يتم تقاسم الإلكترونات بشكل متساوٍ تمامًا. ففي الماء، تحصل ذرّة الأكسجين على مقدار أكبر بقليل من حصّتها العادلة، وبذلك تمتلك شحنة سالبة جزئية، تكتب ${L('δ−')} (دلتا سالب). وتحصل ذرّات الهيدروجين على مقدار أقلّ بقليل من حصّتها العادلة، لذا تكون شحنتها موجبة جزئية تكتب ${L('δ+')} (دلتا موجب). ويسمّى هذا التوزيع غير المتكافئ للشحنة ثنائي القطب.`,
        seq: [[{ ch: 1 }, 1600]],
        pills: [[`شحنة سالبة جزئية، تكتب ${L('δ−')} (دلتا سالب)`, BLU, () => MOL[0].B, -140, -95], [`شحنة موجبة جزئية تكتب ${L('δ+')} (دلتا موجب)`, PNK, () => atomH({ p: MOL[0].B, q: MOL[0].QB }, 0), 170, 70],
                [L('δ+'), PNK, () => atomH({ p: MOL[0].B, q: MOL[0].QB }, 1), 60, -70], ['التوزيع غير المتكافئ للشحنة: ثنائي القطب', GRN, () => MOL[0].B.clone().add(V(0, -0.5, 0)), 0, 125]] },
      { t: 'تكوُّن رابطة هيدروجينيّة بين جُزيئَين',
        p: `في الماء، ينجذب الأكسجين سالب الشحنة في جُزيء إلى الهيدروجين موجب الشحنة في الجُزيء الآخر. ويسمّى هذا التجاذب أو الاستقطاب رابطة هيدروجينيّة ${L('Hydrogen bond')}. وتظهر الرابطة الهيدروجينيّة في الرسم التخطيطي تقليديًا على شكل منقّط أو خطّ متقطّع.`,
        n: 'الرابطة الهيدروجينية أضعف بكثير من الرابطة التساهمية، إلّا أن تأثيرها مهم جدًا.',
        seq: [[{ '!fo': 2, zoom: 2.3, ch: 0.45 }, 900], [{ a1: 1 }, 2200], [{ b1: 1 }, 1400]],
        pills: [[`رابطة هيدروجينيّة ${L('Hydrogen bond')}: على شكل منقّط`, BLU, (s) => atomH({ p: MOL[0].B, q: MOL[0].QB }, 0).lerp(molPose(s, 1).p, 0.5), 0, -100],
                ['الهيدروجين موجب الشحنة', PNK, () => atomH({ p: MOL[0].B, q: MOL[0].QB }, 0), -170, 60], ['الأكسجين سالب الشحنة في الجُزيء الآخر', RED, (s) => molPose(s, 1).p, 150, 80]] },
      { t: 'شبكة من الروابط الهيدروجينيّة بين جزيئات الماء',
        p: 'الرابطة الهيدروجينيّة لجزيئات الماء تجعل من الصعب فصل جزيئاته، الأمر الذي يؤثّر على خصائصه الفيزيائيّة. على سبيل المثال: الطاقة اللازمة لكسر الروابط الهيدروجينيّة تجعل من الصعب نسبيًا تحويل الماء من سائل إلى غاز.',
        n: 'يمكن لجزئ الماء أن يوجد في حالة غازية في درجات حرارة الأرض بسبب ارتباطه مع جزئيات ماء أخرى بروابط هيدروجينية. (في المجسَّم 9 جزيئات و8 روابط للتوضيح فقط.)',
        seq: [[{ '!fo': 3, zoom: 1.5, ch: 0 }, 900], [{ a: 1 }, 2600], [{ hb: 1 }, 1600], [{ zoom: 1.25 }, 900]],
        pills: [['روابط هيدروجينيّة تجعل من الصعب فصل جزيئاته', BLU, () => CC.clone().add(V(0, 0.6, 0)), 0, -110], ['جزيئات الماء', GRY, (s) => molPose(s, 4).p, 150, 80]] },
      { t: 'الماء كمذيب: جزيئات الماء تتجمّع حول الأيونات وتفصلها',
        p: 'الماء مذيب ممتاز للأيونات والجزيئات القطبيّة (الجزيئات ذات التوزيع غير المتكافئ للشحنة، مثل السكّريات والجليسرول)، وذلك لأن جزيئات الماء تنجذب إلى الأيونات والجزيئات القطبيّة، فتتجمّع حولها وتفصلها عن بعضها (الشكل ٢-٢٤). وهذا ما يحصل عندما تذوب مادة كيميائيّة في الماء.',
        n: 'تحدث معظم العمليات في الكائنات الحيّة في المحلول بهذه الطريقة. وحقيقة أن الجزيئات والأيونات تذوب في الماء، تجعله مثاليًا كوسط ناقل، كما، في الجهاز الدوري والجهاز اللمفاوي في الحيوانات، وفي أوعية الخشب واللحاء في النباتات.',
        seq: [[{ '!fo': 4, zoom: 1.6 }, 900], [{ ion: 1 }, 900], [{ sol: 1 }, 2800], [{ sep: 1 }, 1600], [{ zoom: 1.45 }, 800]],
        pills: [[`أيون موجب الشحنة، مثل ${L('Na⁺')}`, PUR, (s) => ionPos(s, 0), -150, -140], [`أيون سالب الشحنة، مثل ${L('Cl⁻')}`, GRN, (s) => ionPos(s, 1), 170, -120],
                [`أكسجين ${L('(2δ−)')} يواجه الأيون الموجب`, RED, (s) => hydPose(s, 3).p, -210, 60], [`هيدروجين ${L('(2δ+)')} يواجه الأيون السالب`, PNK, (s) => hydPose(s, NH + 3).p, 190, 90],
                ['جُزيء ماء', GRY, (s) => hydPose(s, 1).p, 230, -60]] },
      { t: 'السعة الحراريّة النوعية العالية: يجب كسر الروابط الهيدروجينيّة لرفع درجة الحرارة',
        p: `للماء سعة حرارية نوعيّة ${L('Specific heat capacity')} عالية نسبيًا، ولرفع درجة حرارة السائل، يجب أن تكتسب الجزيئات طاقة، وأن تتحرّك بالتالي بسرعة كبيرة. لكن الروابط الهيدروجينيّة التي تميل إلى جعل جزيئات الماء تلتصق بعضها ببعض، تجعل من الصعب على الجزيئات التحرّك بحرّية. لذلك يجب كسر هذه الروابط للسماح بحرّية الحركة.`,
        n: 'وهذا يفسّر سبب الحاجة إلى المزيد من الطاقة لرفع درجة حرارة الماء أكثر ممّا لو لم توجد روابط هيدروجينيّة. فالرابطة الهيدروجينيّة تسمح للماء بتخزين المزيد من الطاقة لتحقيق ارتفاع معيّن في درجة الحرارة.',
        seq: [[{ '!fo': 5, zoom: 1.35 }, 900], [{ heat: 1 }, 800], [{ tw: 0.4, brk: 1 }, 3400]],
        pills: [['الطاقة اللازمة لكسر الروابط الهيدروجينيّة', ORG, () => FLAME.clone().add(V(0, 1.2, 0)), 150, 60], ['يجب كسر هذه الروابط للسماح بحرّية الحركة', BLU, (s) => molPose(s, 7).p, 160, -60],
                ['درجة حرارة الماء', RED, (s) => TH_W.clone().add(V(0, 0.85 + 2.9 * s.tw, 0)), -40, -80]] },
      { t: 'الماء أكثر مقاومة للتغيّرات في درجة الحرارة من الهواء',
        p: 'للسعة الحرارية ذات النوعيّة العالية تأثيرات حيويّة ومهمّة للماء، لأنها تجعل الماء أكثر مقاومة للتغيّرات في درجة الحرارة. وهذا يعني أن درجة الحرارة داخل الخلايا والأجسام تكون أكثر ثباتًا ممّا هي في الهواء المحيط. وهذا يعني أيضًا أن درجة حرارة المسطّحات المائيّة الكبيرة، مثل البحيرات والمحيطات، تكون بطيئة التغيّر مقارنة مع التغيّرات في درجة حرارة الهواء، وتوفر بالتالي مواطن بيئيّة مستقرّة للكائنات الحيّة المائيّة.',
        n: 'ونتيجة لذلك، تعمل التفاعلات الحيويّة بمعدّلات ثابتة نسبيًا، وتكون أقلّ عرضة للتأثر سلبًا بدرجات الحرارة القصوى.',
        seq: [[{ air: 1 }, 700], [{ ta: 0.95 }, 2600], [{ zoom: 1 }, 900]],
        pills: [['درجة حرارة الهواء', ORG, (s) => TH_A.clone().add(V(0, 0.85 + 2.9 * s.ta, 0)), -160, -30], ['درجة حرارة الماء: بطيئة التغيّر', RED, (s) => TH_W.clone().add(V(0, 0.85 + 2.9 * s.tw, 0)), 190, -30],
                ['مواطن بيئيّة مستقرّة للكائنات الحيّة المائيّة', GRN, () => POOL.c.clone().add(V(3.6, 0.9, -1.0)), 140, 70]] },
      { t: 'الحرارة الكامنة العالية للتبخّر: التبخّر آليّة تبريد',
        p: 'للماء حرارة تبخّر كامنة عالية نسبيًا، وهذا نتيجة لسعته الحراريّة النوعيّة العالية. وحقيقة أن جزيئات الماء تميل إلى الالتصاق ببعضها بواسطة روابط هيدروجينيّة، يعني أن كمّيات كبيرة نسبيًا من الطاقة لازمة لحدوث التبخّر، لأنه يجب تفكيك الروابط الهيدروجينيّة لتتمكن الجزيئات من الانتشار على شكل غاز. وتسبّب الطاقة التي تنتقل إلى جزيئات الماء أثناء عملية التبخر بخسارة طاقة مماثلة من محيطها تتدنّى معها الحرارة، فتحصل بالتالي عملية التبريد.',
        n: 'وهذا مهمّ وحيويّ إذ يعني أنه يمكن للكائنات الحيّة استخدام التبخر كآليّة تبريد، كما في التعرّق أو اللهاث عند بعض الحيوانات. ويمكن أن يكون مهمًا أيضًا في تبريد أوراق النبات أثناء النتح.',
        seq: [[{ '!fo': 6, zoom: 1.45 }, 900], [{ ev: 1, tw: 0.22 }, 3400], [{ zoom: 1 }, 900]],
        pills: [['الجزيئات تنتشر على شكل غاز: من ماء سائل إلى بخار ماء', BLU, (s) => molPose(s, 8).p, -60, 75], ['تفكيك الروابط الهيدروجينيّة', GRY, (s) => molPose(s, 5).p, 160, 70],
                ['تتدنّى معها الحرارة، فتحصل بالتالي عملية التبريد', GRN, (s) => TH_W.clone().add(V(0, 0.85 + 2.9 * s.tw, 0)), -40, 100]] },
    ],
    setup(ctx) {
      const sc = ctx.scene;
      const trans = (c, op) => { const m = new THREE.MeshStandardMaterial({ color: c, transparent: true, opacity: op, roughness: 0.2, depthWrite: false }); m.color.convertSRGBToLinear(); return m; };
      // حوض الماء الشفَّاف
      const pool = new THREE.Mesh(new THREE.BoxGeometry(POOL.sx, POOL.sy, POOL.sz), trans(0x4FC3F7, 0.13)); pool.position.copy(POOL.c); sc.add(pool);
      const rim = new THREE.Mesh(new THREE.BoxGeometry(POOL.sx + 0.3, 0.1, POOL.sz + 0.3), M(0x90A4AE)); rim.position.set(POOL.c.x, -0.28, POOL.c.z); sc.add(rim);
      // الجزيئات
      O.mol = Array.from({ length: N }, (_, i) => buildMol(ctx, i === 0));
      O.hyd = Array.from({ length: 2 * NH }, () => buildMol(ctx, false));
      // الأيونان
      O.na = ctx.mesh(new THREE.SphereGeometry(R_NA, 24, 18), matNa, NA_T); O.cl = ctx.mesh(new THREE.SphereGeometry(R_CL, 24, 18), matCl, CL_T);
      // مصدر الحرارة
      O.burn = new THREE.Group(); O.burn.position.copy(FLAME); sc.add(O.burn);
      ctx.mesh(new THREE.CylinderGeometry(0.55, 0.65, 0.35, 20), matBurner, V(0, 0.17, 0), O.burn);
      O.flame = ctx.mesh(new THREE.ConeGeometry(0.42, 1.3, 16), M(0xFB8C00, { roughness: 0.3, emissive: 0xFF6D00, emissiveIntensity: 0.6 }), V(0, 0.95, 0), O.burn);
      O.flame2 = ctx.mesh(new THREE.ConeGeometry(0.2, 0.8, 12), M(0xFFEE58, { roughness: 0.3, emissive: 0xFFD600, emissiveIntensity: 0.8 }), V(0, 0.75, 0), O.burn);
      // مقياسا الحرارة
      O.thW = thermo(ctx, TH_W); O.thA = thermo(ctx, TH_A);
    },
    rebuild(s, ctx) {
      S = s;
      // الروابط الهيدروجينيَّة المنقَّطة: من هيدروجين المانح إلى أكسجين المستقبِل
      BONDS.forEach(bd => {
        const v = bondVis(S, bd.m); if (v <= 0.01) return;
        const a = atomH(molPose(S, bd.d), bd.h), b = molPose(S, bd.a).p, d = b.clone().sub(a), Lb = d.length(); d.normalize();
        const n = 5, vis = Math.ceil(v * n);
        for (let j = 0; j < vis; j++) ctx.ball(a.clone().addScaledVector(d, RH + 0.06 + (Lb - RH - RO - 0.12) * (j + 0.5) / n), 0.085 * Math.min(1, v * n - j), matDot);
      });
    },
    place(s) {
      S = s;
      O.mol.forEach((g, i) => { const { p, q } = molPose(S, i); g.position.copy(p); g.quaternion.copy(q); g.scale.setScalar(1 - 0.3 * evOf(S, i)); if (g.userData.halo) g.userData.halo.forEach(h => { h.material.opacity = h.userData.op * S.ch; h.visible = S.ch > 0.01; }); });
      O.hyd.forEach((g, j) => { const { p, q, s: sc } = hydPose(S, j); g.position.copy(p); g.quaternion.copy(q); g.scale.setScalar(Math.max(0.001, sc)); g.visible = sc > 0.01; });
      O.na.position.copy(ionPos(S, 0)); O.cl.position.copy(ionPos(S, 1)); O.na.scale.setScalar(Math.max(0.001, S.ion)); O.cl.scale.setScalar(Math.max(0.001, S.ion));
      O.burn.scale.setScalar(Math.max(0.001, S.heat)); O.burn.visible = S.heat > 0.01;
      O.thW.g.scale.setScalar(Math.max(0.001, S.heat)); O.thW.g.visible = S.heat > 0.01; setCol(O.thW, S.tw);
      O.thA.g.scale.setScalar(Math.max(0.001, S.air)); O.thA.g.visible = S.air > 0.01; setCol(O.thA, S.ta);
    },
    idle(t, s) {
      S = s;
      const amp = 0.03 + 0.12 * S.tw;                    // اهتزاز الجزيئات يزداد مع الحرارة
      O.mol.forEach((g, i) => { if (evOf(S, i) > 0.02) return; const { p } = molPose(S, i); g.position.copy(p); g.position.y += Math.sin(t * (3 + S.tw * 4) + i * 1.7) * amp * 0.5; g.position.x += Math.cos(t * 2.6 + i) * amp * 0.3; });
      if (S.heat > 0.5) { O.flame.scale.y = 1 + 0.15 * Math.sin(t * 9); O.flame2.scale.y = 1 + 0.2 * Math.sin(t * 11 + 1); }
    },
  };
})();
