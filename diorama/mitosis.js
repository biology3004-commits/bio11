/* ديوراما: الانقسام المتساوي في خليَّة حيوانيَّة — الدرس ٤-٣ (كتاب الطالب ص ١٣٠–١٣٥، الشكلان ٤-٣ و٤-٤) */
(function () {
  const { V, sm, M, CSS } = DioramaCore;
  const { BLU, RED, GLD, TEAL, PNK, GRY, GRN, ORG, PUR } = CSS;
  // خليَّة حيوانيَّة فيها أربعة كروموسومات (زوجان بلونين كما في الشكل ٤-٣)؛ محور المغزل على x (القطبان يساراً ويميناً)
  const R0 = 4.2, R1 = 3.33, D1 = 3.45;               // نصف قطر الخليَّة الأصليَّة والناتجة، وبُعد مركز الخليَّة الناتجة
  const RN0 = 2.4, RN1 = 1.45;                        // نصف قطر النواة الأصليَّة ونواة الخليَّة الناتجة
  const TR = 0.14, DA = 2.2;                          // نصف قطر الكروماتيد المتكثِّف، ومسافة سحب السنترومير نحو القطب
  const X = V(1, 0, 0);
  const matCh = [M(0xE4472E, { roughness: 0.45 }), M(0x2C7BE5, { roughness: 0.45 })];
  const matCen = M(0xF2C14E, { roughness: 0.35 }), matKin = M(0xF08A24, { roughness: 0.4 }), matSp = M(0x9FB3C8, { roughness: 0.6 }), matCs = M(0x2E9E6B);
  const matVes = new THREE.MeshStandardMaterial({ color: 0xB9A8EE, transparent: true, opacity: 0, roughness: 0.3, depthWrite: false }); matVes.color.convertSRGBToLinear();
  const lerp = (a, b, t) => a + (b - a) * t, vl = (a, b, t) => a.clone().lerp(b, t), nrm = v => v.clone().normalize();
  const orth = (w, u) => nrm(w.clone().addScaledVector(u, -w.dot(u)));
  let S, ctxRef;
  const O = {};

  // ---- الكروموسومات: 0 أحمر طويل، 1 أزرق طويل، 2 أحمر قصير، 3 أزرق قصير ----
  const CH = [
    { hom: 0, L1: 0.45, L2: 0.75, sc: [V(-0.7, 0.55, -0.3), V(0.4, 0.3, 0.85), V(-0.5, 0.7, -0.5)], zo: -0.45 },
    { hom: 1, L1: 0.45, L2: 0.75, sc: [V(0.75, -0.4, 0.45), V(0.9, 0.35, -0.25), V(-0.3, 0.8, 0.5)], zo: 0.45 },
    { hom: 0, L1: 0.3, L2: 0.52, sc: [V(0.45, 0.95, -0.55), V(-0.55, 0.5, 0.65), V(0.7, 0.3, 0.6)], zo: 0.5 },
    { hom: 1, L1: 0.3, L2: 0.52, sc: [V(-0.45, -0.85, 0.6), V(0.7, -0.4, 0.6), V(-0.5, 0.7, -0.5)], zo: -0.5 },
  ];
  // الطور الاستوائي: الكروموسومات الأربعة في صفٍّ واحد على خطِّ الاستواء (المستوى x = 0) كما في الشكل ٤-٣
  { let top = 2.3; CH.forEach(c => { c.my = top - c.L1; top -= c.L1 + c.L2 + 0.16; }); }
  CH.forEach((c, k) => { c.sc[1] = nrm(c.sc[1]); c.sc[2] = orth(c.sc[2], c.sc[1]); c.ph = k * 1.7; });

  const cy = () => lerp(R0, R1, S.cyt);                                       // ارتفاع مركز الخليَّة (تجلس على اللوح)
  const gx = () => lerp(2.1, D1, S.cyt);                                       // مركز النواة الناتجة على x
  const PX = () => lerp(3.3, D1 + RN1 + 0.45, S.cyt);                          // موضع القطب (الجسم المركزي)
  const pole = j => V(j * PX(), cy(), 0);
  const CS0 = () => V(0.3, cy() + 0.9, 2.9);                                   // الجسم المركزي الأصلي (خارج النواة)
  function csPos(j) {                                                          // الجسمان المركزيان: تضاعف ثم انتقال إلى القطبين حول النواة
    const c = CS0().add(V(j * 0.28 * sm(S.cdup), 0, 0)), Mid = V(j * 2.7, cy() + 0.7, 2.3), P = pole(j), s = sm(S.cen);
    return c.multiplyScalar((1 - s) * (1 - s)).addScaledVector(Mid, 2 * s * (1 - s)).addScaledVector(P, s * s);
  }
  const gap = () => lerp(0.12, 0.05, sm(S.cond)) + 0.12 * sm(S.vis);          // نصف المسافة بين الكروماتيدَين الشقيقَين
  const rad = () => lerp(0.075, TR, sm(S.cond));
  const lsc = () => lerp(2.6, 1, sm(S.cond));                                  // الكروماتين الممدود أطول من الكروموسوم المتكثِّف
  const amp = () => lerp(0.32, 0, sm(S.cond));                                 // تموُّج خيوط الكروماتين

  function frameOf(k) {                                                        // الإطار: C موضع السنترومير، u محور الطول، w اتجاه الكروماتيد الشقيق
    const c = CH[k], m = sm(S.mt);
    const C = vl(c.sc[0], V(0, c.my, 0), m), u = nrm(vl(c.sc[1], V(0, -1, 0), m)), w = orth(vl(c.sc[2], X, m), u);
    return { C: C.add(V(0, cy(), 0)), u, w, n: new THREE.Vector3().crossVectors(u, w), k: c };
  }
  // موضع سنترومير الكروماتيد j (−1 نحو القطب الأيسر، +1 نحو الأيمن)
  function cpos(f, j) {
    const g = gap(), base = f.C.clone().addScaledVector(f.w, j * g);
    if (S.sep <= 0 && S.tel <= 0) return base;
    const xA = g + S.sep * DA, xT = gx() + 0.3, t = sm(S.tel);
    const p = base.clone(); p.x = j * lerp(xA, xT, t);
    p.y = cy() + (base.y - cy()) * lerp(1, 0.42, t); p.z = base.z + f.k.zo * t;
    return p;
  }
  function pt(f, j, t) {                                                       // نقطة على الكروماتيد j عند المسافة t من السنترومير
    const ls = lsc(), A = amp(), C = cpos(f, j);
    const th = (55 * Math.PI / 180) * sm(Math.min(1, S.sep * 2.5));            // انثناء الذراعين خلف السنترومير: الشكل < أو >
    const along = f.u.clone().multiplyScalar(t * ls * Math.cos(th));
    const back = X.clone().multiplyScalar(-j * Math.abs(t) * ls * Math.sin(th));
    const wig = f.n.clone().multiplyScalar(A * Math.sin(t * 4.6 + f.k.ph)).addScaledVector(f.w, A * 0.7 * Math.cos(t * 3.4 + f.k.ph));
    return C.add(along).add(back).add(wig);
  }
  const samples = (P, a, b) => { const n = Math.max(4, Math.ceil((b - a) / 0.12)), pts = []; for (let q = 0; q <= n; q++) pts.push(P(a + (b - a) * q / n)); return pts; };
  const kinP = (f, j) => cpos(f, j).addScaledVector(S.mt > 0.5 || S.sep > 0 ? X : f.w, j * rad() * 1.15);
  const cenMid = k => { const f = frameOf(k); return vl(cpos(f, -1), cpos(f, 1), 0.5); };

  // اتجاهات الحويصلات (تحلُّل الغلاف النووي) والأشعَّة النجميَّة حول كل جسم مركزي
  const VES = []; for (let i = 0; i < 22; i++) { const y = 1 - 2 * (i + 0.5) / 22, r = Math.sqrt(1 - y * y), a = i * 2.39996; VES.push(V(r * Math.cos(a), y, r * Math.sin(a))); }
  const AST = []; for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2; AST.push(nrm(V(0.75, 0.75 * Math.cos(a), 0.75 * Math.sin(a)))); }
  const POLAR = [[0, 1.6, 0.2], [0, -1.5, 0.3], [0, 0.4, 1.7], [0, -0.3, -1.6], [0, 1.15, -1.1], [0, -1.1, 1.15]];
  const REM = [[0, 0.25, 0], [0, -0.3, 0.2], [0, 0.1, 0.45], [0, -0.05, -0.4], [0, 0.45, -0.2], [0, -0.45, -0.15], [0, 0.0, 0.0]];

  window.DIORAMA = {
    id: 'mitosis', title: 'الانقسام المتساوي في الخليَّة الحيوانيَّة',
    subtitle: 'الأحياء — الصف الحادي عشر — الوحدة الرابعة: دورة الخليَّة والانقسام المتساوي',
    source: 'النص من كتاب الطالب: ٤-٢ دورة الخليَّة و٤-٣ الانقسام المتساوي (ص ١٣٠–١٣٥) والشكلان ٤-٣ و٤-٤',
    legend: [['#E4472E', 'كروموسومات (اللون الأوَّل)', 'tube'], ['#2C7BE5', 'كروموسومات (اللون الثاني)', 'tube'], ['#F2C14E', 'سنترومير', 'dot'], ['#F08A24', 'حيّز حركي', 'dot'], null,
             ['#9FB3C8', 'خيوط المغزل', 'tube'], ['#2E9E6B', 'الجسم المركزي'], ['#9A86D8', 'النواة والنوية'], ['#F2C79A', 'الخلية']],
    camera: { VH: 14.5, center: [-4.2, 4.4, 0], elevation: 28, azimuth: 18 },
    base: { L: 17.5, W: 10, x: 0 },
    BASE: { zoom: 1.25, fo: 0, rep: 0, cdup: 0, cond: 0, vis: 0, env: 1, nol: 1, cen: 0, sp: 0, mt: 0, att: 0, kin: 0, cut: 0, sep: 0, tel: 0, nuc2: 0, rem: 0, cyt: 0 },
    noGeom: ['fo'],
    // نقطة التركيز: 0 مركز الخليَّة، 1 سنترومير الكروموسوم الأزرق الطويل
    focus(s) { S = s; const k = Math.round(S.fo || 0); if (k === 1) return cenMid(1); return V(-3.3, cy() + 0.4, 0); },
    STEPS: [
      { t: 'الطور البيني: تضاعف DNA والجسم المركزي',
        p: 'يشكل الطور البيني <span class="ltr">Interphase</span> <span class="ltr">90 %</span> من دورة الخلية، والذي يقسم إلى ثلاثة أطوار هي الطور <span class="ltr">G<sub>1</sub> (first gap)</span> والطور <span class="ltr">S (synthesis)</span>، والطور <span class="ltr">G<sub>2</sub> (second gap)</span>. أثناء الطور <span class="ltr">G<sub>1</sub></span> تُكوِّن الخلية <span class="ltr">RNA</span> والإنزيمات وبروتينات أخرى تحتاج إليها للنمو، وفي الطور <span class="ltr">S</span> يتضاعف <span class="ltr">DNA</span> في النواة، ليصبح كل كروموسوم مكونًا من كروماتيدَين متطابقَين.',
        n: 'تحتوي معظم النوى على العديد من الكروموسومات، لكن الرسوم التخطيطيّة في الشكل ٤-٣ تبيّن بشكل مبسّط خليّة تحتوي فقط على أربعة كروموسومات. وقد استخدمت الألوان للتمييز بين الكروموسومات من الأم أو من الأب.',
        seq: [[{}, 500], [{ rep: 1, cdup: 1 }, 3200]],
        pills: [['غشاء سطح الخلية', ORG, () => V(-R0 * 0.62, cy() + R0 * 0.7, 0.6), -120, -50], ['السيتوبلازم', ORG, () => V(-3.0, cy() - 1.2, 1.6), -120, 60],
                ['غلاف نووي كامل', PUR, () => V(-RN0 * 0.75, cy() - RN0 * 0.55, 0.9), -110, 90], ['النوية', PUR, () => O.nol.position.clone(), -150, -70],
                ['الكروماتين: يتضاعف <span class="ltr">DNA</span>', BLU, () => pt(frameOf(1), 1, 0.4), 210, 95], ['الجسم المركزي (يتضاعف أثناء الطور البيني)', GRN, () => csPos(1), 170, -80]] },
      { t: 'بداية الطور التمهيدي: تكثُّف الكروموسومات',
        p: 'وبالرغم من أن العملية متواصلة، إلّا أنها تقسم عادة إلى أربعة أطوار رئيسيّة: الطور التمهيدي <span class="ltr">Prophase</span>، والطور الاستوائي <span class="ltr">Metaphase</span>، والطور الانفصالي <span class="ltr">Anaphase</span>، والطور النهائي <span class="ltr">Telophase</span>. بداية الطور التمهيدي: يبدأ ظهور الكروموسومات على شكل لفائف من الكروماتين، وتقصر وتسمك بما يكفي لأن تشاهد عندما تصبغ، ومازال لا يشاهد بوضوح أن كل كروموسوم مكوّن من كروماتيدين.',
        seq: [[{ cond: 1 }, 3400]],
        pills: [['تقصر الكروموسومات وتسمك', RED, () => pt(frameOf(0), -1, 0.5), -170, -80], ['لفائف من الكروماتين', BLU, () => pt(frameOf(1), 1, 0.7), 190, 90],
                ['يتكوّن جسمان مركزيان', GRN, () => csPos(1), 160, -80], ['غلاف نووي كامل', PUR, () => V(-RN0 * 0.75, cy() - RN0 * 0.55, 0.9), -110, 90]] },
      { t: 'نهاية الطور التمهيدي: تحلُّل الغلاف النووي وتكوُّن المغزل',
        p: 'لاحظ أن الغلاف النووي يختفي خلال نهاية الطور التمهيدي؛ فهو يتحلّل إلى حويصلات صغيرة لا تُرى بالمجهر الضوئي، ويعاد تجميعها أثناء الطور النهائي. نهاية الطور التمهيدي: تشاهد الكروموسومات مكوّنة من كروماتيدَين متطابقَين، يحتوي كل كروماتيد على جُزيء <span class="ltr">DNA</span> واحد. تختفي النوية. يتحرك الجسمان المركزيان باتجاه الطرفَين المتقابلَين للنواة. وهذه الأجسام المركزية تشكّل خيوط المغزل المكوّن من الأنيبيبات الدقيقة، والذي هو ضروري لفصل الكروماتيدات بعضها عن بعض.',
        n: 'تُعرض هذه الأحداث متتابعةً للتوضيح، وهي تجري معاً في نهاية الطور التمهيدي.',
        seq: [[{ vis: 1, kin: 1 }, 1300], [{ env: 0, nol: 0 }, 1900], [{ cen: 0.62, sp: 0.45 }, 2200]],
        pills: [['كروماتيدَين متطابقَين', BLU, () => pt(frameOf(1), 1, 0.6), 200, 85], ['سنترومير', GLD, () => cenMid(0), -150, -95],
                ['يتفكك الغلاف النووي: حويصلات صغيرة', PUR, () => O.ves[4].position.clone(), -150, -60], ['تختفي النوية', PUR, () => V(-0.5, cy() + 1.2, 1.0), -170, 30],
                ['يتحرك الجسمان المركزيان باتجاه الطرفَين المتقابلَين للنواة', GRN, () => csPos(1), 120, -95], ['خيوط المغزل', GRY, () => csPos(-1), -130, 80]] },
      { t: 'الطور الاستوائي: الاصطفاف على خطِّ الاستواء',
        p: 'الطور الاستوائي: يصل كل جسم مركزي إلى أحد القطبَين. تساعد الأجسام المركزية في تنظيم إنتاج الأنيبيبات الدقيقة لخيوط المغزل. تصطف الكروموسومات على امتداد خط استواء الخلية، وهي ترتبط بخيوط المغزل عبر سنتروميراتها. تشاهد خيوط المغزل (الأنيبيبات الدقيقة) بوضوح الآن، ويتموضع الجسمان المركزيان على الطرفَين المتقابلين للخلية في مركز الأنيبيبات الدقيقة حيث تنتظم على شكل نجمة من الأنيبيبات الشعاعيّة.',
        seq: [[{ cen: 1, sp: 1 }, 1500], [{ mt: 1, att: 1 }, 3000]],
        pills: [['يصل كل جسم مركزي إلى أحد القطبَين', GRN, () => pole(1), 60, -110], ['نجمة من الأنيبيبات الشعاعيّة', GRY, () => pole(-1).add(V(-0.4, 0.5, 0)), -40, -110],
                ['تصطف الكروموسومات على امتداد خط استواء الخلية', RED, () => pt(frameOf(3), 1, 0.7), -60, 110], ['ترتبط بخيوط المغزل عبر سنتروميراتها', BLU, () => vl(pole(1), cenMid(1), 0.55), 150, 70]] },
      { t: 'الحيِّز الحركي: ارتباط خيوط المغزل بالسنترومير',
        p: 'يربط السنترومير الكروماتيدَين الشقيقَين. وله أيضًا دور في فصل الكروماتيدات أثناء الانقسام المتساوي، ففي الطور الاستوائي ترتبط خيوط المغزل بـحَيزَين حركيَّين <span class="ltr">Kinetochores</span> في السنترومير لكل كروماتيد من الكروموسوم الواحد. يتكون الحيز الحركي من جزيئات بروتينية تربط السنترومير بخيوط المغزل، أثناء الطور البيني قبل الانقسام المتساوي.',
        seq: [[{ '!fo': 1, zoom: 2.3 }, 1300], [{ kin: 1.6 }, 700], [{ kin: 1 }, 700]],
        pills: [['حيّز حركي', ORG, () => kinP(frameOf(1), -1), -130, -95], ['حيّز حركي', ORG, () => kinP(frameOf(1), 1), 130, -95], ['سنترومير', GLD, () => cenMid(1), 40, 120],
                ['أنيبيبات دقيقة', GRY, () => vl(kinP(frameOf(1), 1), pole(1), 0.08), 150, 60], ['كروماتيد', BLU, () => pt(frameOf(1), -1, 0.75), -150, 50]] },
      { t: 'بداية الطور الانفصالي: انشطار السنترومير',
        p: 'تتقاصر الأنيبيبات الدقيقة المرتبطة بالسنترومير، الأمر الذي يؤدّي إلى انشطار السنترومير وانفصال الكروماتيدات الشقيقة بعضها عن بعض ليصبح لكل كروماتيد سنترومير منفصل. تبدأ الكروماتيدات بالتباعد (الانفصال) بفعل تقصّر الأنيبيبات الدقيقة لخيوط المغزل.',
        seq: [[{ cut: 1 }, 1800], [{ sep: 0.09 }, 1500]],
        pills: [['ينشطر كل كروموسوم عند السنترومير', GLD, () => cpos(frameOf(1), -1), -150, -100], ['لكل كروماتيد سنترومير منفصل', GLD, () => cpos(frameOf(1), 1), 150, 100],
                ['تقصّر الأنيبيبات الدقيقة', GRY, () => vl(kinP(frameOf(1), 1), pole(1), 0.08), 140, -90]] },
      { t: 'الطور الانفصالي: الكروماتيدات نحو القطبين',
        p: 'ومع تقصّر الأنيبيبات الدقيقة يتم سحب سنترومير كل كروماتيد باتجاه أحد قطبَي الخلية، ساحبًا خلفه بقية الكروماتيد، التي تأخذ الشكل <span class="ltr">&lt;</span> أو <span class="ltr">&gt;</span> أثناء الطور الانفصالي. تتحرك الكروماتيدات باتجاه القطبَين المتقابلَين، حيث تتحرك السنتروميرات أولًا بفعل تقصّر الأنيبيبات الدقيقة لخيوط المغزل.',
        seq: [[{ '!fo': 0, zoom: 1.25 }, 1000], [{ sep: 1 }, 3400]],
        pills: [['تتحرك السنتروميرات أولًا', GLD, () => cpos(frameOf(0), 1), 150, -100], ['ساحبًا خلفه بقية الكروماتيد', BLU, () => pt(frameOf(1), -1, 0.9), -150, 100],
                ['تتحرك الكروماتيدات باتجاه القطبَين المتقابلَين', RED, () => cpos(frameOf(2), -1), -120, -110]] },
      { t: 'الطور النهائي: إعادة تكوين الغلاف النووي',
        p: 'الطور النهائي: تصل الكروماتيدات إلى قطبَي الخلية، وينفكّ التفافها مرة أخرى (يحتوي كل كروماتيد على جُزيء <span class="ltr">DNA</span> واحد، يتضاعف أثناء الطور البيني قبل الانقسام التالي).',
        seq: [[{ tel: 1, att: 0, sp: 0, rem: 1, cond: 0.55, zoom: 1.1 }, 2000], [{ nuc2: 1 }, 1500], [{ cyt: 0.35 }, 1500]],
        pills: [['إعادة تكوين الغلاف النووي', PUR, () => V(-gx(), cy() + RN1 * 0.8, 0.5), -40, -120], ['إعادة ظهور النوية', PUR, () => O.nol2[1].position.clone(), 170, -90],
                ['بقايا من خيوط المغزل المتحلل', GRY, () => V(0, cy() + 0.3, 0.3), 30, -170], ['الجسم المركزي', GRN, () => pole(1), 110, 80],
                ['ينفكّ التفافها مرة أخرى', BLU, () => pt(frameOf(1), -1, 0.6), -150, 110]] },
      { t: 'انقسام السيتوبلازم: خليَّتان متطابقتان جينيّاً',
        p: 'بعد الطور <span class="ltr">M</span> تخضع الخلية بأكملها للانقسام منتجة خليتين متطابقتين جينيًا. في الخلايا الحيوانيّة يتخصر غشاء سطح الخلية بين النواتَين الجديدتَين، مكونًا شقّ انقسام <span class="ltr">Cleavage furrow</span> في وسط الخلية؛ تسمّى هذه العملية انقسام السيتوبلازم <span class="ltr">Cytokinesis</span>. تحتوي الخليتان الناتجتان من الانقسام المتساوي على عدد الكروموسومات نفسه الذي في الخلية الأصلية؛ فهما متطابقتان جينيًا (أي أنهما مستنسختان).',
        n: 'في التمثيل: تحصل كلُّ خليَّة ناتجة على أربعة كروماتيدات (كروماتيد واحد من كلِّ كروموسوم)، فيصير فيها أربعة كروموسومات كالخليَّة الأصليَّة.',
        seq: [[{ cyt: 1, rem: 0, zoom: 1 }, 3400]],
        pills: [['شقّ انقسام', ORG, () => V(0, cy() + 0.2, 0.9), 0, -150], ['انقسام السيتوبلازم', ORG, () => V(0, cy() - 0.6, 1.0), 90, 120],
                ['4 كروموسومات', BLU, () => V(-gx(), cy() + RN1 * 0.9, 0), -110, -95], ['4 كروموسومات', BLU, () => V(gx() + RN1 * 0.6, cy(), 0.6), 150, 60],
                ['خليتين متطابقتين جينيًا', GRN, () => V(D1 * S.cyt + R1 * 0.7, cy() + R1 * 0.7, 0), 60, -120]] },
    ],
    setup(ctx) {
      ctxRef = ctx;
      O.cell = [ctx.blob(0xF2C79A, 0.34), ctx.blob(0xF2C79A, 0.34)];
      O.nuc = ctx.blob(0x9A86D8, 0.36);
      O.nuc2 = [ctx.blob(0x9A86D8, 0.36), ctx.blob(0x9A86D8, 0.36)];
      const gN = new THREE.SphereGeometry(1, 20, 14), mN = M(0x4A3F8F);
      O.nol = new THREE.Mesh(gN, mN); ctx.scene.add(O.nol);
      O.nol2 = [new THREE.Mesh(gN, mN), new THREE.Mesh(gN, mN)]; O.nol2.forEach(o => ctx.scene.add(o));
      const gV = new THREE.SphereGeometry(1, 12, 9);
      O.ves = VES.map(() => { const o = new THREE.Mesh(gV, matVes); ctx.scene.add(o); return o; });
      O.cs = [-1, 1].map(() => {
        const g = new THREE.Group();
        const a = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.42, 10), matCs); a.castShadow = true;
        const b = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.42, 10), matCs); b.rotation.z = Math.PI / 2; b.position.set(0.16, 0, 0.18); b.castShadow = true;
        g.add(a); g.add(b); ctx.scene.add(g); return g;
      });
    },
    rebuild(s, ctx) {
      S = s;
      const r = rad(), F = CH.map((_, k) => frameOf(k));
      // الكروماتيدات: الثاني يظهر بالتضاعف في الطور S (يمتدُّ على طول الأوَّل)
      F.forEach(f => {
        const mat = matCh[f.k.hom], a = -f.k.L1, b = f.k.L2;
        ctx.tubePts(samples(t => pt(f, -1, t), a, b), r, mat);
        if (S.rep > 0.02) ctx.tubePts(samples(t => pt(f, 1, t), a, a + (b - a) * S.rep), r, mat);
      });
      // السنترومير: واحد يربط الكروماتيدَين، ثمَّ ينشطر فيصير لكل كروماتيد سنترومير
      const rc = lerp(0.07, 0.2, sm(S.cond));
      F.forEach(f => {
        if (S.cut < 0.01) ctx.ball(f.C.clone(), rc, matCen);
        else for (const j of [-1, 1]) { const dw = S.mt > 0.5 || S.sep > 0 ? X : f.w; ctx.ball(vl(f.C, cpos(f, j).addScaledVector(dw, -j * 0.1), sm(S.cut)), lerp(rc, 0.16, sm(S.cut)), matCen); }
      });
      // الحيِّزان الحركيَّان على جانبَي السنترومير
      if (S.kin > 0.01) F.forEach(f => { for (const j of [-1, 1]) { const p = kinP(f, j), d = (S.mt > 0.5 || S.sep > 0 ? X : f.w).clone().multiplyScalar(j * 0.05); ctx.rod(p.clone().sub(d), p.clone().add(d), 0.12 * Math.min(1.6, S.kin) * (1 - 0.6 * sm(S.tel)), matKin); } });
      // خيوط المغزل
      const P0 = csPos(-1), P1 = csPos(1);
      if (S.sp > 0.01) {
        const mid = vl(P0, P1, 0.5), h = S.sp / 2;
        POLAR.forEach(b => {
          const M_ = mid.clone().add(V(...b)), Q = u => { const v = 1 - u; return P0.clone().multiplyScalar(v * v).addScaledVector(M_, 2 * u * v).addScaledVector(P1, u * u); };
          ctx.tubePts(samples(Q, 0, h), 0.03, matSp); ctx.tubePts(samples(Q, 1 - h, 1), 0.03, matSp);
        });
        for (const [P, j] of [[P0, -1], [P1, 1]]) AST.forEach(d => ctx.rod(P, P.clone().add(V(d.x * j, d.y, d.z).multiplyScalar(0.85 * S.sp)), 0.022, matSp));
      }
      if (S.att > 0.01) F.forEach(f => {
        for (const j of [-1, 1]) {
          const P = j < 0 ? P0 : P1, K = S.kin > 0.01 ? kinP(f, j) : cpos(f, j);
          for (const o of [-0.09, 0.09]) ctx.rod(P.clone().add(V(0, o, o)), vl(P, K.clone().add(V(0, o * 0.6, 0)), S.att), 0.026, matSp);
        }
      });
      if (S.rem > 0.01) REM.forEach(b => ctx.rod(V(-0.75, cy() + b[1], b[2]), V(0.75, cy() + b[1], b[2]), 0.024 * S.rem, matSp));
    },
    place(s) {
      S = s;
      const c = cy(), split = S.cyt > 0.001;
      O.cell.forEach((o, i) => { const j = i ? 1 : -1; o.visible = i === 0 || split; o.position.set(j * D1 * S.cyt, c, 0); o.scale.setScalar(lerp(R0, R1, S.cyt)); });
      O.nuc.visible = S.env > 0.02; O.nuc.position.set(0, c, 0); O.nuc.scale.setScalar(RN0); O.nuc.material.opacity = O.nuc.userData.op * S.env;
      O.nol.visible = S.nol > 0.02; O.nol.position.set(-0.5, c + 1.2, 1.0); O.nol.scale.setScalar(Math.max(0.001, 0.36 * S.nol));
      O.nuc2.forEach((o, i) => { const j = i ? 1 : -1; o.visible = S.nuc2 > 0.02; o.position.set(j * gx(), c, 0); o.scale.setScalar(RN1); o.material.opacity = o.userData.op * S.nuc2; });
      O.nol2.forEach((o, i) => { const j = i ? 1 : -1; o.visible = S.nuc2 > 0.02; o.position.set(j * gx() + 0.25 * j, c + 0.75, 0.75); o.scale.setScalar(Math.max(0.001, 0.24 * S.nuc2)); });
      const vv = (1 - S.env) * (1 - sm(S.mt)); matVes.opacity = 0.75 * vv;
      O.ves.forEach((o, i) => { o.visible = vv > 0.02; o.position.set(0, c, 0).addScaledVector(VES[i], RN0 * (1 + 0.18 * (1 - S.env))); o.scale.setScalar(0.17); });
      O.cs.forEach((g, i) => { const j = i ? 1 : -1; g.visible = j < 0 || S.cdup > 0.01; g.position.copy(csPos(j)); g.scale.setScalar(j > 0 ? Math.max(0.001, sm(S.cdup)) : 1); });
    },
    idle(t) { O.cs.forEach((g, i) => { g.rotation.y = t * 0.4 + i; }); },
  };
})();
