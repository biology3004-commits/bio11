/* ديوراما: عديدات التسكُّر — الأميلوز والأميلوبكتين (النشا) والجلايكوجين والسليلوز — الدرس ٢-٢ (كتاب الطالب ص ٧٢–٧٥) */
(function () {
  const { V, sm, M, CSS } = DioramaCore;
  const { BLU, RED, GLD, TEAL, PNK, GRY, GRN, ORG, PUR } = CSS;
  const L = s => `<span class="ltr">${s}</span>`;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const UP = V(0, 1, 0), XH = V(1, 0, 0);
  // ── أبعاد الحلقة المبسَّطة (سداسيَّة مسطَّحة واحدة لكلِّ جزيء جلوكوز) ──
  const R = 0.55, D = 1.5, TH = 0.22;                         // نصف قطر الحلقة، تباعد مراكز الحلقات المتتالية، سمك الحلقة
  const gHex = new THREE.CylinderGeometry(1, 1, 1, 6, 1, false, Math.PI / 2);   // رأس k عند (cos 60k, 0, −sin 60k)
  // الرؤوس: k = 0 ذرَّة الكربون 1 (+X)، 1 C2، 2 C3، 3 ذرَّة الكربون 4 (−X)، 4 C5، 5 الأكسجين في الحلقة
  const hexDir = k => { const a = k * Math.PI / 3; return V(Math.cos(a), 0, -Math.sin(a)); };
  // ── موادُّ ─────────────────────────────────────────────────────────
  const matA = M(0x5E9E6E), matB = M(0x4F7FE0), matO = M(0xC0392B, { roughness: 0.4 }), matBond = M(0xE4472E), matC6 = M(0x3A3F47), matH = M(0xF4F4F4, { roughness: 0.3 }), matHB = M(0x9CC7F5, { roughness: 0.3 });
  let S, C;                                                   // الحالة، سياق المحرِّك
  const O = {};                                               // الكائنات الدائمة
  const orth = (X, Y) => { const x = X.clone().normalize(); const y = Y.clone().addScaledVector(x, -x.dot(Y)).normalize(); return [x, y]; };
  const gs = (u, o, n) => sm(clamp(u * n - o, 0, 1));         // مقياس الوحدة ذات الترتيب o في سلسلة من n وحدة عند تقدُّم u
  const ph = (v, a, b) => clamp((v - a) / (b - a), 0, 1);     // طور فرعي من تقدُّم واحد
  // الوحدة: { c مركز، X اتجاه ذرَّة الكربون 1، Y عمودي الحلقة، s مقياس، mat }
  const vert = (u, k) => { const d = hexDir(k), Z = u.X.clone().cross(u.Y); return u.c.clone().addScaledVector(u.X, d.x * R * u.s).addScaledVector(Z, d.z * R * u.s); };
  const c6Of = u => vert(u, 4).addScaledVector(u.Y, 0.62 * u.s);          // ذرَّة الكربون 6 فوق ذرَّة الكربون 5 (خارج الحلقة)
  function ring(u) {
    const m = new THREE.Mesh(gHex, u.mat); m.position.copy(u.c); m.scale.set(R * u.s, TH * u.s, R * u.s);
    const Z = u.X.clone().cross(u.Y); m.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(u.X, u.Y, Z)); m.castShadow = true; C.dyn.add(m);
    C.ball(vert(u, 5), 0.16 * u.s, matO);
  }
  function bond(a, b, s) { if (s < 0.03) return; C.rod(a, b, 0.08 * s, matBond); C.ball(a.clone().lerp(b, 0.5), 0.15 * s, matBond); }
  // سلسلة مرتَّبة في اتجاه +X: ذرَّة الكربون 1 في الوحدة k ترتبط بذرَّة الكربون 4 في الوحدة k+1؛ tail: نقطة ترتبط بها ذرَّة الكربون 1 في الوحدة الأخيرة (رابطة 1,6)
  function drawChain(units, tail) {
    for (let k = 0; k < units.length; k++) {
      const u = units[k]; if (u.s < 0.03) continue; ring(u);
      if (k + 1 < units.length && units[k + 1].s > 0.03) bond(vert(u, 0), vert(units[k + 1], 3), Math.min(u.s, units[k + 1].s) * (u.bs === undefined ? 1 : u.bs));
    }
    const last = units[units.length - 1];
    if (tail && last.s > 0.03) bond(vert(last, 0), tail, last.s);
  }
  // ── الأميلوز: 18 حلقة؛ سلسلة مستقيمة ثمَّ تلتفُّ حلزوناً ──
  const NA = 18, AX = V(-7.5, 0, -5.0), RH = 2.0, PPT = 8, PITCH = 1.9;
  function amyUnit(i) {
    const u = sm(S.coil);
    const ps = V(-12.75 + i * D, 1.1, -4.5);
    const th = i * 2 * Math.PI / PPT;
    const pz = V(AX.x + RH * Math.cos(th), 0.9 + i * PITCH / PPT, AX.z + RH * Math.sin(th));
    const Xh = V(-Math.sin(th), PITCH / (2 * Math.PI * RH), Math.cos(th)).normalize();
    const [x, y] = orth(XH.clone().lerp(Xh, u), UP);
    return { c: ps.lerp(pz, u), X: x, Y: y, s: gs(S.g1, i, NA), mat: matA };
  }
  const amyBond = i => vert(amyUnit(i), 0).lerp(vert(amyUnit(i + 1), 3), 0.5);
  // ── الأميلوبكتين: سلسلة رئيسة من 10 حلقات وتفرُّعان 1,6 ──
  const NP = 10, PZ = -4.5, PX0 = -2.5;
  const apMain = i => ({ c: V(PX0 + i * D, 3.2 + 0.12 * Math.sin(i * 1.3), PZ), X: XH, Y: UP, s: gs(S.g2, i, NP), mat: matA });
  const UPB = V(0.3, 0.7, -0.65).normalize(), DNF = V(0.3, -0.45, 0.84).normalize();   // تفرُّع إلى الجانب الخلفي (أعلى) وإلى الجانب الأمامي (أسفل)
  const BR = [{ at: 3, dir: UPB, n: 5 }, { at: 7, dir: DNF, n: 4 }];
  function branchUnits(parent, dir, n, g, mat) {             // مرتَّبة في اتجاه +X = −dir: الوحدة 0 هي الطرف البعيد، والأخيرة ترتبط بذرَّة الكربون 6
    const P6 = c6Of(parent), [x, y] = orth(dir.clone().negate(), UP), units = [];
    for (let m = 0; m < n; m++) units.push({ c: P6.clone().addScaledVector(dir, 0.4 + R + (n - 1 - m) * D), X: x, Y: y, s: gs(g, n - 1 - m, n) * parent.s, mat });
    return units;
  }
  const apBranch = j => branchUnits(apMain(BR[j].at), BR[j].dir, BR[j].n, S.b2, matA);
  // ── الجلايكوجين: سلسلة رئيسة من 8 حلقات، 4 تفرُّعات، وتفرُّعان ثانويَّان ──
  const NG = 8, GZ = 2.6, GX0 = -13;
  const glMain = i => ({ c: V(GX0 + i * D, 3.2 + 0.12 * Math.sin(i * 1.1), GZ), X: XH, Y: UP, s: gs(ph(S.g3, 0, 0.4), i, NG), mat: matA });
  const GB = [{ at: 1, dir: UPB }, { at: 3, dir: DNF }, { at: 5, dir: UPB }, { at: 7, dir: DNF }];
  const glBranch = j => branchUnits(glMain(GB[j].at), GB[j].dir, 4, ph(S.g3, 0.35, 0.75), matA);
  const GSUB = [{ br: 0, m: 1, dir: V(0.8, 0.5, -0.3).normalize() }, { br: 2, m: 1, dir: V(-0.7, 0.5, -0.4).normalize() }];
  const glSub = j => branchUnits(glBranch(GSUB[j].br)[GSUB[j].m], GSUB[j].dir, 3, ph(S.g3, 0.7, 1), matA);
  // ── السليلوز: 5 سلاسل متوازية من 8 حلقات بيتا-جلوكوز، كلُّ حلقة مقلوبة بالنسبة لجارتها ──
  const NC = 8, CX0 = 1.0, CZ = 4.3, CY = 1.6;
  const CH = [[0, 0], [-1.5, 0], [1.5, 0], [-0.75, 1.4], [0.75, 1.4]];   // (إزاحة z، إزاحة y) لكلِّ سلسلة
  function celUnit(ch, i) {
    const [dz, dy] = CH[ch];
    let x = CX0 + i * D, s = 1, bs;
    if (ch === 0) {
      if (i === 0) { s = sm(S.c1); bs = sm(S.bd); }
      else if (i === 1) { s = sm(S.c1); x += 1.3 * (1 - sm(S.al)); }
      else s = gs(S.g4, i - 2, NC - 2);
    } else s = gs(S.ch, ch - 1, 4);
    const f = (ch === 0 && i === 1) ? Math.PI * sm(S.flip) : (i % 2 ? Math.PI : 0);
    return { c: V(x, CY + dy, CZ + dz), X: XH, Y: V(0, Math.cos(f), Math.sin(f)), s, bs, mat: matB };
  }
  const celChain = ch => Array.from({ length: NC }, (_, i) => celUnit(ch, i));
  const HBP = [[0, 1], [0, 2], [0, 3], [0, 4], [1, 3], [2, 4], [3, 4]];   // أزواج السلاسل المتجاورة (روابط هيدروجينيَّة)
  const hbMid = (p, q, i) => celUnit(p, i).c.lerp(celUnit(q, i).c, 0.5);
  const MF = V(CX0 + 3.5 * D, CY + 0.7, CZ);                 // مركز الليف الدقيق
  // مجموعتا الهيدروكسيل في الحلقتين المحوريَّتين (قبل تكوُّن الرابطة)
  function ohA() { const u = celUnit(0, 0), p = vert(u, 0); return [p, u.Y.clone().addScaledVector(XH, 0.7 * sm(S.al)).normalize()]; }
  function ohB() { const u = celUnit(0, 1), p = vert(u, 3); return [p, u.Y.clone().negate().addScaledVector(XH, -0.7 * sm(S.al)).normalize()]; }
  const ohO = f => { const [p, d] = f(); return p.clone().addScaledVector(d, 0.5); };

  window.DIORAMA = {
    id: 'polysaccharides', title: 'عديدات التسكُّر: النشا والجلايكوجين والسليلوز', subtitle: 'الأحياء — الصف الحادي عشر — الوحدة الثانية: الجُزيئات الحيويَّة',
    source: 'النص من كتاب الطالب: ٢-٢ الكربوهيدرات (ص ٧٢–٧٥) والأشكال ٢-٦ و٢-٧ و٢-٨ و٢-٩',
    legend: [['#5E9E6E', 'حلقة ألفا-جلوكوز', 'box'], ['#4F7FE0', 'حلقة بيتا-جلوكوز', 'box'], ['#C0392B', 'الأكسجين في الحلقة', 'dot'], ['#E4472E', 'رابطة جلايكوسيديّة', 'tube'], null,
             ['#3A3F47', 'ذرّة الكربون 6', 'dot'], ['#9CC7F5', 'رابطة هيدروجينيّة', 'dot'], ['#F0B860', 'حُبيبة (نشا / جلايكوجين)', 'dot'], ['#B49BE0', 'ليف دقيق', 'tube']],
    camera: { VH: 16.5, center: [-1.0, 1.8, 0.5], elevation: 42, azimuth: 30 },
    base: { L: 29, W: 15.5, x: 0 },
    BASE: { fo: 0, g1: 0, coil: 0, g2: 0, b2: 0, gr: 0, g3: 0, gr3: 0, c1: 0, flip: 0, al: 0, bd: 0, g4: 0, ch: 0, hb: 0, mf: 0 },
    noGeom: ['fo'],
    // نقطة التركيز: 0 المشهد، 1 رابطة 1,4 في الأميلوز، 2 الأميلوبكتين، 3 نقطة التفرُّع الأولى، 4 حُبيبة النشا، 5 الجلايكوجين، 6 الحلقتان المحوريَّتان في السليلوز، 7 الليف الدقيق
    focus(s) {
      S = s; const k = Math.round(S.fo || 0);
      return [V(-1.0, 1.8, 0.5), amyBond(8), V(4.5, 3.6, PZ), c6Of(apMain(3)).add(V(0.3, 0.3, 0)), V(1.5, 3.0, PZ), V(-7.5, 4.0, GZ - 0.8),
              celUnit(0, 0).c.lerp(celUnit(0, 1).c, 0.5).add(V(0, 0.3, 0)), MF.clone()][k];
    },
    STEPS: [
      { t: 'عديدات التسكُّر: بوليمرات من سكَّريات أحاديَّة',
        p: 'عديدة التسكر Polysaccharides بوليمرات مكوّنة من ارتباط العديد من جزيئات السكّريات الأحاديّة بالتكثيف. ويضاف كل سكّر أحادي عن طريق رابطة جلايكوسيديّة، كما في السكّريات الثنائيّة. وقد يتكوّن الجُزيء النهائي من عدة آلاف من السكّريات الأحادية، مُشكّلة جُزيئًا كبيرًا. وعديدة التسكّر الأكثر أهميّة هي النشا والجلايكوجين والسليلوز، وجميعها بوليمرات من الجلوكوز، ليست حلوة المذاق.',
        n: 'عديد التسكر Polysaccharides: بوليمر تكون وحداته سكريات أحاديّة مرتبطة معًا بروابط جلايكوسيديّة. (مصطلح علمي ص٧٢) — كلُّ سداسيَّة هنا حلقة جلوكوز مبسَّطة، وتُعرض 18 حلقة فقط بدل عدَّة آلاف.',
        seq: [[{ '!fo': 1, zoom: 1.6 }, 800], [{ g1: 1 }, 3200], [{ zoom: 1 }, 800]],
        pills: [['سكّر أحادي: جلوكوز', GLD, () => amyUnit(3).c, -60, 80], ['رابطة جلايكوسيديّة', RED, () => amyBond(8), 0, -80], ['عديد التسكر: بوليمر من الجلوكوز', GRN, () => amyUnit(14).c, 40, 80]] },
      { t: 'الأميلوز: سلسلة غير متفرِّعة بروابط 1,4 تلتفُّ حلزونيّاً',
        p: `النشا Starch مزيج من أميلوز وأميلوبكتين. يتكوّن الأميلوز Amylose من تفاعلات تكثيف بين جزيئات ألفا- جلوكوز (الشكل ٢-٥أ). وبذلك، يتم بناء سلسلة طويلة غير متفرّعة مكوّنة من عدة آلاف من جزيئات ${L('1, 4')} جلوكوز المرتبطة (الرابطة ${L('1,4')} تعني الترابط بين جزيئات الجلوكوز وتحديدًا بين ذرّات الكربون 1 و 4 في وحدات الجلوكوز المتتالية). تكون السلاسل منحنية وملتفّة في تراكيب حلزونيّة مثل اللوالب، لذا يكون الجُزيء النهائي متراصًا كما في الشكل ٢-٦.`,
        n: 'الشكل ٢-٦: ترتيب جزيئات ألفا-جلوكوز في الأميلوز. تؤدّي روابط 1,4 إلى دوران السلسلة والتفافها. تبدو الروابط الجلايكوسيدية بالأحمر، وقد حذفت مجموعات الهيدروكسيل.',
        seq: [[{ '!fo': 1, zoom: 2.6 }, 900], [{ zoom: 1.5 }, 900], [{ coil: 1 }, 2800], [{ zoom: 1.5 }, 700]],
        pills: [['الرابطة ' + L('1,4') + ': بين ذرّات الكربون 1 و 4', RED, () => amyBond(8), 0, 100], ['ذرّة الكربون 1', GRY, () => vert(amyUnit(8), 0), -120, -70], ['ذرّة الكربون 4', GRY, () => vert(amyUnit(9), 3), 120, -70],
                ['الأميلوز: تراكيب حلزونيّة مثل اللوالب', GRN, () => amyUnit(17).c, 0, -90]] },
      { t: 'الأميلوبكتين: روابط 1,4 وتفرُّعات بروابط 1,6',
        p: `يتكوّن الأميلوبكتين Amylopectin أيضًا من العديد من جزيئات ${L('1,4')} ألفا-جلوكوز، لكن السلاسل أقصر من تلك التي في الأميلوز، وتحتوي أيضًا على روابط ${L('1,6')} تبدأ هذه بالتفرّع من على جانبَي السلسلة (الشكل ٢-٧).`,
        n: 'الشكل ٢-٧ (أ): تشكيل رابطة 1,6 يكوّن نقطة التفرع — رابطة جلايكوسيدية بين ذرّات الكربون 1,6 من وحدات جلوكوز متجاورة (رابط 1,6).',
        seq: [[{ '!fo': 2, zoom: 1.4 }, 900], [{ g2: 1 }, 1800], [{ '!fo': 3, zoom: 2.6 }, 900], [{ b2: 1 }, 2200], [{ zoom: 1.3 }, 900]],
        pills: [['الأميلوبكتين', GRN, () => apMain(0).c, -60, 80], ['رابطة ' + L('1,6') + ': نقطة التفرع', PNK, () => c6Of(apMain(3)).lerp(vert(apBranch(0)[4], 0), 0.5), -150, -60],
                ['روابط ' + L('1,4'), RED, () => vert(apMain(4), 0).lerp(vert(apMain(5), 3), 0.5), 60, 90], ['ذرّة الكربون 6', GRY, () => c6Of(apMain(3)), 120, 60], ['سلاسل أقصر', GLD, () => apBranch(1)[1].c, 120, -40]] },
      { t: 'النشا: حُبيبات مختزنة في النبات',
        p: 'وعديدة التسكّر المختزنة تكون متوافقة ومتراصّة وغير متفاعلة وغير قابلة للذوبان. عديدة التسكّر المختزنة في النباتات هي النشا Starch، وفي الحيوانات هي الجلايكوجين Glycogen. يكوّن مزيج جزيئات الأميلوز والأميلوبكتين حُبيبات نشا كبيرة نسبيًا، وتوجد عادة في البلاستيدات الخضراء وفي أعضاء التخزين في النبات مثل درنات البطاطس وبذور الحبوب والبقوليات (الصورة ٢-٢).',
        n: 'وعند الحاجة، تؤمّن الجلوكوز سريعًا عن طريق تفاعلات التحلل المائي الإنزيميّة. (ص٧٢) — الحُبيبة هنا غلاف شفَّاف مبسَّط يضمُّ الجزيئين.',
        seq: [[{ '!fo': 4, zoom: 1.15 }, 900], [{ gr: 1 }, 2000]],
        pills: [['حُبيبة نشا', ORG, () => V(-5, 5.5, PZ + 2), -60, 60], ['أميلوز', GRN, () => amyUnit(0).c, -110, 50], ['أميلوبكتين', GRN, () => apMain(9).c, 120, 40], ['النشا: مزيج من أميلوز وأميلوبكتين', GLD, () => V(1.5, -0.3, PZ + 3.2), 0, 60]] },
      { t: 'الجلايكوجين: أكثر تفرُّعاً، مخزون في الكبد والعضلات',
        p: `لا يوجد النشا في الخلايا الحيوانيّة، التي تختزن الكربوهيدرات على شكل جلايكوجين، وتشبه جزيئاته كثيرًا تلك التي في الأميلوبكتين لأنها تتكوّن من سلاسل من ${L('1,4')} ألفا- جلوكوز مرتبطة بروابط ${L('1,6')} مكوّنة نقاط تفرع (الشكل ٢-٧). تتجمّع جزيئات الجلايكوجين معًا لتشكّل حُبيبات تشاهد في خلايا الكبد وخلايا العضلات، حيث تشكّل مخزونًا احتياطيًا للطاقة.`,
        n: 'الشكل ٢-٧: يختلف الأميلوبكتين والجلايكوجين فقط في مقدار التفرّع في سلاسل الجلوكوز المكوّنة لهما. يكون الجلايكوجين أكثر تفرعًا من الأميلوبكتين.',
        seq: [[{ '!fo': 5, zoom: 1.3 }, 900], [{ g3: 1 }, 3400], [{ gr3: 1 }, 1200]],
        pills: [['الجلايكوجين', GRN, () => glMain(0).c, -60, 80], ['روابط ' + L('1,6') + ': نقاط تفرع', PNK, () => c6Of(glMain(3)), 0, -70], ['أكثر تفرعًا من الأميلوبكتين', GLD, () => glBranch(2)[1].c, 160, 40],
                ['حُبيبات في خلايا الكبد وخلايا العضلات', ORG, () => V(-12.5, 5.2, GZ), -10, -60]] },
      { t: 'السليلوز: بوليمر من بيتا-جلوكوز',
        p: 'السليلوز Cellulose هو الجُزيء العضوي الأكثر وفرة على كوكب الأرض، وذلك لوجوده في جدران الخلايا النباتيّة، ولبطء معدّل تفكّكه في الطبيعة. وللسليلوز دور تركيبي لأنه جُزيء قوي ميكانيكيًا، على العكس من النشا والجلايكوجين، والفرق الوحيد، أن السليلوز بوليمر يتكوّن من جُزيئات بيتا-جلوكوز، في حين يتكوّن النشا والجلايكوجين من جزيئات ألفا- جلوكوز.',
        n: 'السليلوز Cellulose: عديد تسكر يتكون من وحدات بنائية من بيتا-جلوكوز، ويستخدم لتقوية جدران الخلايا النباتيّة. (مصطلحات علمية ص٧٤) — تُعرض مجموعتا الهيدروكسيل ذواتا الصلة فقط، كما في الشكل ٢-٨ (أ).',
        seq: [[{ '!fo': 6, zoom: 2.4 }, 900], [{ c1: 1 }, 1600]],
        pills: [['بيتا-جلوكوز', BLU, () => celUnit(0, 0).c, -110, 90], ['بيتا-جلوكوز', BLU, () => celUnit(0, 1).c, 110, 90],
                ['مجموعة ' + L('(–OH)') + ' على ذرّة الكربون 1 تتّجه نحو الأعلى فوق الحلقة', TEAL, () => ohO(ohA), -150, -70], ['مجموعة ' + L('–OH') + ' المتجهة نحو أسفل الحلقة', TEAL, () => ohO(ohB), 170, 60]] },
      { t: 'يستدير جُزيء الجلوكوز 180° لتتكوَّن رابطة 1,4',
        p: `تذكّر أن مجموعة ${L('(–OH)')} على ذرّة الكربون 1 تتّجه نحو الأعلى فوق الحلقة في ${L('β')}-جلوكوز (الشكل ٢-٤). ولتكوين رابطة الجلايكوسيدية مع ذرّة الكربون 4، (حيث مجموعة ${L('–OH')} المتجهة نحو أسفل الحلقة)، يجب أن ينقلب جُزيء جلوكوز واحد (يستدير ${L('180°')}) بالنسبة إلى الجُزيء الآخر، وبالتالي سترتبط وحدات الجلوكوز المتتالية عند ${L('180°')} بعضها ببعض (الشكل ٢-٨).`,
        n: 'الشكل ٢-٨ (أ): يصطفّ جُزيئان من بيتا (β)-جلوكوز أحدهما بجانب الآخر ليكوّنا رابطة 1,4. لاحظ أن جُزيء جلوكوز واحد يجب أن يستدير 180° بالنسبة إلى الجُزيء الآخر. (ب) ترتيب وحدات بيتا β-جلوكوز في السليلوز.',
        seq: [[{ flip: 1 }, 1800], [{ al: 1 }, 1100], [{ bd: 1 }, 1100], [{ zoom: 1.6 }, 700], [{ g4: 1 }, 2000]],
        pills: [['يستدير ' + L('180°'), PUR, () => celUnit(0, 1).c, 130, 90], ['تصطفّ مجموعات ' + L('(OH)') + ' بعضها بجانب بعض لتكوّن رابطة جلايكوسيديّة', TEAL, () => vert(celUnit(0, 0), 0).lerp(vert(celUnit(0, 1), 3), 0.5).add(V(0, 0.5, 0)), -60, -80],
                ['رابطة ' + L('1,4'), RED, () => vert(celUnit(0, 0), 0).lerp(vert(celUnit(0, 1), 3), 0.5), -90, 90], ['وحدات الجلوكوز المتتالية عند ' + L('180°'), BLU, () => celUnit(0, 5).c, 60, 80]] },
      { t: 'روابط هيدروجينيَّة بين الجزيئات: الألياف الدقيقة',
        p: `ينتج من هذا الترتيب لجزيئات بيتا ${L('β')}-جلوكوز جُزيء قوي، لأن ذرّات الهيدروجين من مجموعة ${L('–OH')} تنجذب بشكل ضعيف إلى ذرّات الأكسجين في جُزيء السليلوز نفسه (أكسجين في حلقة الجلوكوز)، وإلى ذرّات الأكسجين في مجموعات ${L('(–OH)')} في الجزيئات المجاورة أيضًا. ويتشابك ${L('60-70')} جُزيء سليلوز بإحكام عن طريق الروابط الهيدروجينيّة لتشكيل حزمًا تسمّى الألياف الدقيقة Microfibrils. وتتماسك الألياف الدقيقة بدورها بعضها ببعض عن طريق الروابط الهيدروجينيّة أيضًا لتشكّل حزمًا تسمّى الألياف Fibres (الشكل ٢-٩).`,
        n: 'وهذه الروابط ضعيفة في شكلها الفردي، لكن يوجد الكثير منها (بسبب العدد الكبير من مجموعات (–OH)، لتؤمّن بمجموعها قوّة هائلة. (ص٧٥) — تُعرض 5 جزيئات سليلوز بدل 60-70، والروابط الهيدروجينيّة بين الجزيئات المجاورة فقط.',
        seq: [[{ '!fo': 7, zoom: 1.5 }, 900], [{ ch: 1 }, 1600], [{ hb: 1 }, 1200], [{ mf: 1 }, 1400], [{ zoom: 1.05 }, 900]],
        pills: [['رابطة هيدروجينيّة', BLU, () => hbMid(0, 2, 2), 120, 90], ['جُزيء سليلوز', BLU, () => celUnit(2, 6).c, 110, 60], ['ليف دقيق (قطره ' + L('10 nm') + ') مكوّن من ' + L('60-70') + ' جُزيء', PUR, () => MF.clone().add(V(-3, 2.4, 0)), -60, -60],
                ['الألياف الدقيقة Microfibrils', PUR, () => MF.clone().add(V(4.5, 1.5, 0)), 60, -60]] },
    ],
    setup(ctx) {
      C = ctx;
      O.gran = ctx.blob(0xF0B860, 0.2); O.gran.scale.setScalar(0.001);                  // حُبيبة النشا
      O.gran2 = ctx.blob(0xF0B860, 0.2); O.gran2.scale.setScalar(0.001);                // حُبيبة الجلايكوجين
      O.glow = ctx.blob(0xE0407F, 0.4); O.glow.scale.setScalar(0.001);                  // توهُّج نقطة التفرُّع
      const mm = new THREE.MeshStandardMaterial({ color: 0xB49BE0, transparent: true, opacity: 0.24, roughness: 0.3, depthWrite: false, side: THREE.DoubleSide }); mm.color.convertSRGBToLinear();
      O.mf = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1, 28, 1, true), mm); O.mf.rotation.z = Math.PI / 2; O.mf.position.copy(MF); O.mf.scale.setScalar(0.001); ctx.scene.add(O.mf);
    },
    rebuild(s, ctx) {
      S = s; C = ctx;
      // الأميلوز
      drawChain(Array.from({ length: NA }, (_, i) => amyUnit(i)));
      // الأميلوبكتين: السلسلة الرئيسة + ذرَّات الكربون 6 عند نقاط التفرُّع + التفرُّعان
      const ap = Array.from({ length: NP }, (_, i) => apMain(i)); drawChain(ap);
      BR.forEach((b, j) => { const p = ap[b.at]; if (p.s > 0.03) { const p6 = c6Of(p); ctx.rod(vert(p, 4), p6, 0.07 * p.s, matC6); ctx.ball(p6, 0.17 * p.s, matC6); drawChain(apBranch(j), p6); } });
      // الجلايكوجين
      const gl = Array.from({ length: NG }, (_, i) => glMain(i)); drawChain(gl);
      const gbs = GB.map((b, j) => { const p = gl[b.at]; const units = glBranch(j); if (p.s > 0.03) { const p6 = c6Of(p); ctx.rod(vert(p, 4), p6, 0.07 * p.s, matC6); ctx.ball(p6, 0.17 * p.s, matC6); drawChain(units, p6); } return units; });
      GSUB.forEach((g, j) => { const p = gbs[g.br][g.m]; if (p.s > 0.03) { const p6 = c6Of(p); ctx.rod(vert(p, 4), p6, 0.07 * p.s, matC6); ctx.ball(p6, 0.17 * p.s, matC6); drawChain(glSub(j), p6); } });
      // السليلوز: السلاسل الخمس
      for (let ch = 0; ch < 5; ch++) drawChain(celChain(ch));
      // مجموعتا الهيدروكسيل ذواتا الصلة في الحلقتين المحوريَّتين
      const so = sm(S.c1) * (1 - sm(S.bd));
      if (so > 0.03) for (const f of [ohA, ohB]) { const [p, d] = f(); const o = p.clone().addScaledVector(d, 0.5 * so), h = o.clone().addScaledVector(d, 0.36 * so);
        ctx.rod(p, o, 0.06 * so, matC6); ctx.ball(o, 0.17 * so, matO); ctx.rod(o, h, 0.045 * so, matC6); ctx.ball(h, 0.11 * so, matH); }
      // الروابط الهيدروجينيَّة بين السلاسل المتجاورة (نقاط)
      const hb = sm(S.hb);
      if (hb > 0.03) for (const [p, q] of HBP) for (let i = 0; i < NC; i++) { const a = celUnit(p, i), b = celUnit(q, i); if (a.s < 0.5 || b.s < 0.5) continue;
        const d = b.c.clone().sub(a.c).normalize(), a1 = a.c.clone().addScaledVector(d, R), b1 = b.c.clone().addScaledVector(d, -R);
        ctx.ball(a1.clone().lerp(b1, 0.33), 0.085 * hb, matHB); ctx.ball(a1.clone().lerp(b1, 0.67), 0.085 * hb, matHB); }
    },
    place(s) {
      S = s;
      O.gran.position.set(1.5, 3.0, PZ); const g1 = sm(S.gr); O.gran.scale.set(Math.max(0.001, 11.8 * g1), Math.max(0.001, 4.4 * g1), Math.max(0.001, 3.9 * g1));
      O.gran2.position.set(-7.8, 3.2, GZ); const g2 = sm(S.gr3); O.gran2.scale.set(Math.max(0.001, 7.4 * g2), Math.max(0.001, 4.5 * g2), Math.max(0.001, 4.0 * g2));
      const gw = 0.42 * sm(S.b2) * (1 - 0.8 * sm(S.gr)); O.glow.position.copy(c6Of(apMain(3)).lerp(vert(apBranch(0)[4], 0), 0.5)); O.glow.scale.setScalar(Math.max(0.001, gw));
      const m = sm(S.mf); O.mf.scale.set(Math.max(0.001, 2.45 * m), Math.max(0.001, 12.2 * m), Math.max(0.001, 2.45 * m));
    },
    ends() {
      const out = [], k = Math.round(S.fo || 0), z = S.zoom || 1;
      const lab = (p, c, t) => out.push([p.clone().add(V((p.x - c.x) * 0.5, 0.22, (p.z - c.z) * 0.5)), t]);
      if (k === 1 && z > 1.6) { const a = amyUnit(8), b = amyUnit(9); lab(vert(a, 0), a.c, '1'); lab(vert(b, 3), b.c, '4'); lab(vert(a, 3), a.c, '4'); lab(vert(b, 0), b.c, '1'); }
      if (k === 3 && z > 1.6) { const p = apMain(3), q = apMain(4), r = apBranch(0)[4]; lab(c6Of(p), p.c, '6'); lab(vert(p, 4), p.c, '5'); lab(vert(p, 0), p.c, '1'); lab(vert(q, 3), q.c, '4'); if (r.s > 0.6) lab(vert(r, 0), r.c, '1'); }
      if (k === 6 && z > 1.4) { const a = celUnit(0, 0), b = celUnit(0, 1); if (a.s > 0.6) { lab(vert(a, 0), a.c, '1'); lab(vert(a, 3), a.c, '4'); lab(vert(b, 3), b.c, '4'); lab(vert(b, 0), b.c, '1'); } }
      return out;
    },
    idle(t, s, ctx, tweening) {
      S = s;
      if (!tweening && S.b2 > 0.5 && S.gr < 0.5) O.glow.scale.setScalar(0.42 + 0.05 * Math.sin(t * 4));
    },
  };
})();
