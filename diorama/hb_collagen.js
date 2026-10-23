/* ديوراما: بروتين كروي مقابل بروتين ليفي — الهيموجلوبين والكولاجين — الدرس ٢-٤ (كتاب الطالب ص ٨٥–٨٩) */
(function () {
  const { V, sm, M, CSS } = DioramaCore;
  const { BLU, RED, GLD, TEAL, PNK, GRY, GRN, ORG, PUR } = CSS;
  const L = s => `<span class="ltr">${s}</span>`;
  const cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const mid = (a, b) => a.clone().lerp(b, 0.5);
  // ── المواد ────────────────────────────────────────────────────────────────
  const matA = M(0x8E6BBF, { roughness: 0.45 }), matB = M(0xE8873A, { roughness: 0.45 });          // سلسلتا ألفا (أرجواني) وسلسلتا بيتا (برتقالي)
  const matHeme = M(0xD9893B, { roughness: 0.4 }), matFe = M(0xF5D76E, { roughness: 0.3 }), matN = M(0x2C7BE5), matO = M(0xE4472E), matH = M(0xF5F5F5, { roughness: 0.35 });
  const matRp = M(0x12A5A0, { roughness: 0.4 }), matRh = M(0xF08C2E, { roughness: 0.4 }), matBond = M(0x1F2937), matHb = M(0xffffff, { roughness: 0.3 });
  const matC = [M(0x2F5F9E, { roughness: 0.45 }), M(0x4F98D0, { roughness: 0.45 }), M(0x8CCBEA, { roughness: 0.45 })];   // سلاسل الكولاجين الثلاث
  const matGly = M(0xC8E06B, { roughness: 0.35 });
  let S, ctx_;
  // ── الهيموجلوبين: أربع وحدات (سلسلتا α وسلسلتا β) حول مركز HBC ─────────────────
  const HBC = V(-5.7, 1.95, 0.4);
  const SUB = [                                     // الإزاحة من المركز، المادَّة، اتِّجاه مجموعة الهيم (نحو الأعلى والخارج)، دوران المسار
    { o: V(-1.15, 0.78, -0.95), m: matA, rot: [0.3, 0.9, 0.2], name: 'α' },
    { o: V(1.15, 0.78, 0.95), m: matA, rot: [1.1, -0.6, 0.8], name: 'α' },
    { o: V(1.05, -0.28, -1.05), m: matB, rot: [-0.7, 0.3, 1.4], name: 'β' },
    { o: V(-1.05, -0.28, 1.05), m: matB, rot: [0.9, 1.6, -0.4], name: 'β' },
  ];
  const ENTER = [V(-4.5, 4.5, -5.5), V(4.5, 4.5, 5.5), V(5.5, 3.5, -5.5), V(-5.5, 3.5, 5.5)];   // جهة دخول كل سلسلة
  for (const s of SUB) { s.nrm = V(s.o.x * 0.55, 1.0, s.o.z * 0.55).normalize(); s.E = new THREE.Euler(...s.rot); }
  // مسار «جلوبين» مضغوط: عقدة ملتفَّة داخل كرة نصف قطرها ≈ 1.05
  const COIL = []; for (let k = 0; k <= 44; k++) { const t = k / 44 * 2 * Math.PI, R = 0.66, r = 0.4; COIL.push(V((R + r * Math.cos(3 * t)) * Math.cos(2 * t), r * Math.sin(3 * t), (R + r * Math.cos(3 * t)) * Math.sin(2 * t))); }
  const arrive = (key, j) => sm(cl(S[key] - j));                  // تقدُّم وصول الوحدة j (0..1)
  function subCenter(k) {
    const s = SUB[k], ar = k < 2 ? arrive('al', k) : arrive('be', k - 2);
    const c = HBC.clone().addScaledVector(s.o, 1 + 0.55 * S.g);            // تباعد قبل التراصّ
    return c.addScaledVector(ENTER[k], 1 - ar);
  }
  const subVis = k => k < 2 ? S.al > k + 0.02 : S.be > k - 2 + 0.02;
  function hemePos(k) { return subCenter(k).clone().addScaledVector(SUB[k].nrm, 1.12); }
  function fePos(k) { return hemePos(k).clone().addScaledVector(SUB[k].nrm, 0.14); }
  function oxyPos(k) {                                                      // مركز جزيء الأكسجين k
    const u = sm(cl(S.ox - k)), far = fePos(k).clone().addScaledVector(SUB[k].nrm, 4.2).add(V(0, 1.2, 0));
    return far.lerp(fePos(k).clone().addScaledVector(SUB[k].nrm, 0.42), u);
  }
  // نقاط على سطح الجزيء (مجموعات R المحبَّة للماء) وجزيئات ماء حولها — ثابتة اتجاهاً
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const SURF = [], WAT = [], CORE = [];
  for (let i = 0; i < 70 && SURF.length < 34; i++) { const th = rnd() * 2 * Math.PI, y = rnd() * 2 - 1, r = Math.sqrt(1 - y * y); const d = V(r * Math.cos(th), y, r * Math.sin(th)); if (d.y > -0.45) SURF.push(d); }
  for (let i = 0; i < 12; i++) { const th = rnd() * 2 * Math.PI, y = rnd() * 1.2 - 0.2, r = Math.sqrt(1 - y * y); WAT.push({ d: V(r * Math.cos(th), y, r * Math.sin(th)), a: rnd() * 6.28 }); }
  for (let i = 0; i < 6; i++) CORE.push(V((rnd() - 0.5) * 0.9, 0.95 + rnd() * 0.5, (rnd() - 0.5) * 0.9));
  const surfPt = i => HBC.clone().addScaledVector(SURF[i], 2.5);
  const waterPt = i => HBC.clone().addScaledVector(WAT[i].d, 5.4 - 2.3 * sm(S.wt));
  // ── الكولاجين: ثلاث سلاسل لولبيَّة تلتفُّ حبلاً ثلاثيّاً ثمَّ لييف من جزيئات متوازية ─────────
  const X0 = 0.6, NRES = 28, DX = 0.3, LEN = (NRES - 1) * DX, CY = 1.95, CZ = -0.1, PSUP = 5.2;
  const MOL = [{ dy: 0, dz: 0, sx: 0 }, { dy: 0, dz: 1.3, sx: 0.9 }, { dy: 0, dz: -1.3, sx: -0.9 }, { dy: 1.1, dz: 0.68, sx: -0.45 }, { dy: 1.1, dz: -0.68, sx: 0.45 }];
  const ENTC = V(0, 2.6, 3.8);
  // محور السلسلة j عند x لجزيء m (tw: درجة الالتفاف الثلاثي)
  function axisPt(m, j, x, tw) {
    const mo = MOL[m], rho = 0.95 * (1 - tw) + 0.4 * tw, th = j * 2 * Math.PI / 3 + tw * 2 * Math.PI * (x - X0) / PSUP;
    return V(x + mo.sx, CY + mo.dy + rho * Math.cos(th), CZ + mo.dz + rho * Math.sin(th));
  }
  function bead(m, j, i, tw) {                                              // الحمض الأميني i على اللولب الصغير (ثلاثة لكلِّ لفَّة)
    const x = X0 + i * DX, psi = i * 2 * Math.PI / 3 + j * 2.1;
    return axisPt(m, j, x, tw).add(V(0, 0.17 * Math.cos(psi), 0.17 * Math.sin(psi)));
  }
  function chainPts(m, j, tw, shift) { const pts = []; for (let i = 0; i < NRES; i++) pts.push(bead(m, j, i, tw).add(shift)); return pts; }
  const chainShift = j => ENTC.clone().multiplyScalar(1 - arrive('ca', j));
  const molShift = () => V(0, 3.6, 0).multiplyScalar(1 - sm(S.fb));
  // روابط بين سلاسل الجزيء الأوَّل: هيدروجينيَّة (نقاط) على طول المحور و«بعض» التساهميَّة (قضبان داكنة)
  const HBX = []; for (let x = X0 + 0.75; x < X0 + LEN - 0.3; x += 0.9) HBX.push(x);
  const COVX = [X0 + 2.4, X0 + 6.3];
  // روابط تساهميَّة بين الجزيئات المتجاورة في اللييف — قرب الأطراف وغير متوافقة
  const XL = [[0, 1, X0 + LEN - 0.5], [0, 2, X0 + 0.5], [0, 3, X0 + LEN - 1.3], [0, 4, X0 + 1.2], [1, 3, X0 + 0.9 + 0.6], [2, 4, X0 - 0.9 + LEN - 0.6]];
  function molAxisMid(m, x) { const a = axisPt(m, 0, x, 1), b = axisPt(m, 1, x, 1), c = axisPt(m, 2, x, 1); return a.add(b).add(c).multiplyScalar(1 / 3); }

  window.DIORAMA = {
    id: 'hb_collagen', title: 'بروتين كروي وبروتين ليفي: الهيموجلوبين والكولاجين', subtitle: 'الأحياء — الصف الحادي عشر — الوحدة الثانية: الجُزيئات الحيويَّة',
    source: 'النص من كتاب الطالب: ٢-٤ البروتينات (ص ٨٥–٨٩) والشكلان ٢-٢١ و ٢-٢٣',
    legend: [['#8E6BBF', 'سلسلة α', 'tube'], ['#E8873A', 'سلسلة β', 'tube'], ['#D9893B', 'مجموعة هيم', 'box'], ['#F5D76E', 'ذرّة حديد', 'dot'], ['#E4472E', 'أكسجين', 'dot'], null,
             ['#12A5A0', 'مجموعة R محبّة للماء', 'dot'], ['#F08C2E', 'مجموعة R كارهة للماء', 'dot'], ['#2F5F9E', 'سلاسل الكولاجين الثلاث', 'tube'], ['#C8E06B', 'جلايسين', 'dot'], ['#1F2937', 'رابطة تساهمية', 'tube']],
    camera: { VH: 22.5, center: [-0.6, 1.6, 0], elevation: 40, azimuth: 45 },
    base: { L: 21.5, W: 11.5, x: -0.6 },
    BASE: { fo: 1, zoom: 1.7, al: 0, be: 0, g: 1, hm: 0, ox: 0, rg: 0, wt: 0, ca: 0, tw: 0, hb: 0, fb: 0, xl: 0 },
    noGeom: ['fo'],
    // نقطة التركيز: 0 المشهد، 1 الهيموجلوبين، 2 مجموعة الهيم الأولى، 3 جُزيء الكولاجين، 4 روابط اللييف
    focus(s) {
      S = s; const k = Math.round(S.fo || 0);
      if (k === 1) return HBC.clone().add(V(0, 0.2, 0));
      if (k === 2) return fePos(1);
      if (k === 3) return V(X0 + LEN / 2, CY, CZ);
      if (k === 4) return V(X0 + LEN - 0.8, CY + 0.4, CZ);
      return V(-0.6, 1.6, 0);
    },
    STEPS: [
      { t: 'الهيموجلوبين بروتين كروي: سلسلتا ألفا',
        p: 'الهيموجلوبين هو الصبغة الحاملة للأكسجين الموجودة في خلايا الدم الحمراء، وهو بروتين كروي. ولقد عرفت سابقًا أنه مكوّن من أربع سلاسل عديد ببتيد، لذا يتّصف بتركيب رابعي. وتسمّى كل سلسلة بروتين بالجلوبين. تتكوّن سلسلتا هيموجلوبين من ألفا-جلوبين وتُسمّيان سلسلتَي ألفا، والسلسلتان الأخريان تُسمّيان سلسلتَي بيتا مكوّنتَين من بيتا-جلوبين.',
        n: 'يسمّى البروتين الذي تلتف جزيئاته لتكون على شكل كرة، مثل الهيموجلوبين أو الميوجلوبين، بروتينًا كرويًا.',
        seq: [[{ '!fo': 1, zoom: 1.7 }, 700], [{ al: 1 }, 1500], [{ al: 2 }, 1500]],
        pills: [[`سلسلة ${L('α')} (يوجد سلسلتان)`, PUR, () => subCenter(0), -150, -90], ['ألفا-جلوبين', PUR, () => subCenter(1), 170, 70]] },
      { t: 'سلسلتا بيتا: أربع سلاسل في كتلة متماسكة',
        p: 'لجُزيء الهيموجلوبين شكل كروي تقريبًا (الشكل ٢-٢١)، تتراصّ فيه سلاسل عديدة الببتيد الأربع في كتلة متماسكة.',
        seq: [[{ be: 1 }, 1400], [{ be: 2 }, 1400], [{ g: 0 }, 1500]],
        pills: [[`سلسلة ${L('β')} (يوجد سلسلتان)`, ORG, () => subCenter(2), 190, -40], ['بيتا-جلوبين', ORG, () => subCenter(3), -170, 80], ['جُزيء الهيموجلوبين الكامل شبه كروي', GRY, () => HBC.clone().add(V(0, 2.3, 0)), 0, -70]] },
      { t: 'مجموعة الهيم في كل سلسلة: مجموعة مساعدة',
        p: `تحتوي كل من سلاسل عديدة الببتيد الأربع للهيموجلوبين على مجموعة هيم (الشكل ٢-٢١ب). تُعدّ مجموعة الهيم جزءًا أساسيًا ومهمًا في تركيب البروتين على الرغم من أنها ليست مكوّنة من أحماض أمينيّة، وتسمّى مجموعة مساعدة ${L('Prosthetic group')}.`,
        seq: [[{ '!fo': 2, zoom: 2.4 }, 900], [{ hm: 1 }, 1200], [{ zoom: 1.8 }, 800], [{ hm: 4 }, 1800]],
        pills: [['مجموعة هيم', GLD, () => hemePos(1), 150, -80], ['ذرّة حديد', ORG, () => fePos(1), 170, 30], ['أربع سلاسل: أربع مجموعات هيم', GRY, () => hemePos(0), -160, -70]] },
      { t: 'ارتباط الأكسجين بذرّات الحديد',
        p: 'تحتوي كل مجموعة هيم على ذرّة حديد. يمكن أن يرتبط جُزيء أكسجين واحد مع كل ذرّة حديد، لذا يمكن لجُزيء هيموجلوبين كامل، مع أربعة جزيئات هيم، حمل أربعة جزيئات أكسجين (ثماني ذرّات أكسجين) في الوقت نفسه.',
        n: 'تحتوي مجموعة الهيم على ذرّة حديد، والتي يمكن أن ترتبط بشكل عكسي مع جُزيء الأكسجين (الشكل ٢-٢١ب).',
        seq: [[{ '!fo': 2, zoom: 2.5 }, 900], [{ ox: 1 }, 1600], [{ zoom: 1.8 }, 800], [{ ox: 4 }, 2200]],
        pills: [['يمكن أن يرتبط جُزيء الأكسجين مع ذرّة حديد', RED, () => oxyPos(1), 160, -80], ['أربعة جزيئات أكسجين (ثماني ذرّات أكسجين)', RED, () => oxyPos(0), -170, -70]] },
      { t: 'مجموعات R والذوبان في الماء',
        p: `ومجموعات ${L('R')} الكارهة للماء تتجه نحو مركز الجُزيء، بينما تتجه مجموعات ${L('R')} المحبّة للماء نحو الخارج. التفاعلات بين مجموعات ${L('R')} الكارهة للماء داخل الجُزيء مهمّة في الحفاظ على شكله الصحيح الثلاثي الأبعاد. ومجموعات ${L('R')} المحبّة للماء المتجهة نحو الخارج على سطح الجُزيء مهمّة في الحفاظ على قابليته للذوبان.`,
        n: 'لذلك، تكون البروتينات الكرويّة عادة قابلة للذوبان في الماء، لأن جزيئات الماء تتجمّع حول مجموعات R المحبّة للماء المتجهة إلى الخارج.',
        seq: [[{ '!fo': 1, zoom: 1.6 }, 800], [{ rg: 1 }, 1500], [{ wt: 1 }, 2000]],
        pills: [['مجموعات R المحبّة للماء نحو الخارج', TEAL, () => surfPt(3), 160, -80], ['مجموعات R الكارهة للماء نحو مركز الجُزيء', ORG, () => HBC.clone().add(CORE[0]), -40, -120], ['جزيئات الماء تتجمّع حول مجموعات R المحبّة للماء', BLU, () => waterPt(2), 150, 70]] },
      { t: 'الكولاجين بروتين ليفي: ثلاث سلاسل عديد ببتيد',
        p: `الكولاجين ${L('Collagen')} هو البروتين الأكثر توافرًا في الإنسان والحيوانات. وهو بروتين ليفي ${L('Fibrous protein')} غير قابل للذوبان (الشكل ٢-٢٣ والصورتان ٢-٥ و ٢-٦)، يوجد في الجلد، والأوتار، والغضاريف، والعظام، والأسنان، وجدران الأوعية الدمويّة. يتكوّن جُزيء الكولاجين من ثلاث سلاسل عديد ببتيد.`,
        n: 'الكثير من جزيئات البروتين لا تلتف على شكل كرة، بل يكوّن خيوطًا طويلة، وهذه تسمّى البروتينات الليفيّة.',
        seq: [[{ '!fo': 3, zoom: 1.5 }, 900], [{ ca: 1 }, 1100], [{ ca: 2 }, 1100], [{ ca: 3 }, 1100]],
        pills: [['تبدو عديدة الببتيد التي تكوّن جُزيء الكولاجين على شكل لولبي ممتد', BLU, () => bead(0, 0, 4, S.tw).add(chainShift(0)), -120, -110], ['كل ثالث حمض أميني هو جلايسين', GRN, () => bead(0, 2, 15, S.tw).add(chainShift(2)), 60, 110], ['لولب مع ثلاثة أحماض أمينية لكل لفة', GRY, () => bead(0, 1, 23, S.tw).add(chainShift(1)), 150, -80]] },
      { t: 'ثلاثة لوالب ملتفة معًا: جُزيء الكولاجين',
        p: 'ترتبط السلاسل الثلاث معًا بروابط هيدروجينيّة وبعض الروابط التساهمية (الشكل ٢-٢٣أ و ب). ثلاثة لوالب ملتفة مرتبطة معًا مكوّنة جُزيء كولاجين. ترتبط هذه الخيوط معًا بروابط هيدروجينيّة وبعض الروابط التساهمية.',
        seq: [[{ '!fo': 3, zoom: 1.6 }, 600], [{ tw: 1 }, 2600], [{ zoom: 2.4 }, 900], [{ hb: 1 }, 1500]],
        pills: [['روابط هيدروجينيّة', GRY, () => mid(axisPt(0, 0, HBX[4], 1), axisPt(0, 1, HBX[4], 1)), -150, -90], ['بعض الروابط التساهمية', GRY, () => mid(axisPt(0, 2, COVX[1], 1), axisPt(0, 0, COVX[1], 1)), 150, 80], ['جُزيء كولاجين: ثلاثة لوالب ملتفة مرتبطة معًا', BLU, () => molAxisMid(0, X0 + 1.2), -120, 100]] },
      { t: 'جزيئات متوازية مرتبطة تساهميًّا: اللييف',
        p: 'ويتفاعل كل جُزيء كولاجين ثلاثي السلاسل عديدة الببتيد مع جزيئات الكولاجين المجاورة والممتدة بشكل موازٍ له (الشكل ٢-٢٣ج). تربط الروابط التساهمية الجزيئات المتجاورة هذه مكوّنة لييفات. وتشكل العديد من اللييفات معًا ألياف الكولاجين.',
        n: 'لاحظ أن هذه الروابط غير متوافقة مع بعضها، الأمر الذي يعطي الكولاجين قوّة أكبر.',
        seq: [[{ '!fo': 3, zoom: 1.4 }, 800], [{ fb: 1 }, 2400], [{ '!fo': 4, zoom: 2.2 }, 900], [{ xl: 1 }, 1400], [{ zoom: 1.5 }, 800]],
        pills: [['جزيئات الكولاجين المجاورة والممتدة بشكل موازٍ له', BLU, () => molAxisMid(1, X0 + 0.9 + 3.5), 120, 110], ['روابط تساهمية بين السلاسل الجانبيّة بالقرب من أطراف عديدة الببتيد', GRY, () => mid(molAxisMid(0, XL[0][2]), molAxisMid(1, XL[0][2])), 170, -90], ['لييف', GRY, () => molAxisMid(3, X0 - 0.45 + LEN / 2).add(V(0, 0.8, 0)), -130, -70]] },
      { t: 'الوظيفة: النقل مقابل قوّة الشدّ',
        p: 'ميزة الكولاجين أنه مرن، لكنه في الوقت نفسه يتّصف بقوّة شدّ هائلة. أيّ أنه قادر على تحمّل قوى سحب كبيرة من دون أن يتمدَّد أو ينكسر. تصطف الألياف في الأوتار في حزم متوازية على طول الوتر، في اتجاه قوة الشد (التوتر).',
        n: 'البروتينات الليفية عادة ليست قابلة للذوبان في الماء، ومعظمها له أدوار تركيبيّة.',
        seq: [[{ '!fo': 0, zoom: 1 }, 1500]],
        pills: [['الهيموجلوبين: الصبغة الحاملة للأكسجين — بروتين كروي قابل للذوبان في الماء', PUR, () => HBC.clone().add(V(0, 2.4, 0)), -140, -70], ['الكولاجين: بروتين ليفي غير قابل للذوبان — في الجلد والأوتار والغضاريف والعظام', BLU, () => molAxisMid(3, X0 + 3.5).add(V(0, 0.6, 0)), 60, -90]] },
    ],
    setup(ctx) { ctx_ = ctx; },
    rebuild(s, ctx) {
      ctx_ = ctx; S = s;
      // ── الهيموجلوبين ──
      for (let k = 0; k < 4; k++) {
        if (!subVis(k)) continue;
        const c = subCenter(k), sub = SUB[k], pts = COIL.map(p => p.clone().applyEuler(sub.E).add(c));
        ctx.tubePts(pts, 0.3, sub.m); ctx.ball(pts[0], 0.3, sub.m); ctx.ball(pts[pts.length - 1], 0.3, sub.m);
        const h = sm(cl(S.hm - k));
        if (h > 0.01) {
          const hp = hemePos(k), n = sub.nrm, fe = fePos(k);
          ctx.rod(hp.clone().addScaledVector(n, -0.05 * h), hp.clone().addScaledVector(n, 0.05 * h), 0.46 * h, matHeme);
          ctx.ball(fe, 0.17 * h, matFe);
          const t1 = Math.abs(n.x) < 0.9 ? V(1, 0, 0) : V(0, 0, 1), u = t1.clone().cross(n).normalize(), v = n.clone().cross(u).normalize();
          for (let q = 0; q < 4; q++) { const a = q * Math.PI / 2 + 0.4; ctx.ball(fe.clone().addScaledVector(u, 0.27 * Math.cos(a) * h).addScaledVector(v, 0.27 * Math.sin(a) * h).addScaledVector(n, -0.04), 0.085 * h, matN); }
        }
        const o = cl(S.ox - k);
        if (o > 0.01) {
          const n = sub.nrm, p = oxyPos(k), side = (Math.abs(n.x) < 0.9 ? V(1, 0, 0) : V(0, 0, 1)).cross(n).normalize();
          const a = p.clone().addScaledVector(side, 0.17), b = p.clone().addScaledVector(side, -0.17);
          ctx.ball(a, 0.15, matO); ctx.ball(b, 0.15, matO); ctx.rod(a, b, 0.07, matO);
          if (o > 0.97) ctx.rod(fePos(k), p, 0.05, matBond);
        }
      }
      if (S.rg > 0.01) {
        const k = sm(S.rg);
        for (let i = 0; i < SURF.length; i++) ctx.ball(surfPt(i), 0.17 * k, matRp);
        for (const c of CORE) ctx.ball(HBC.clone().add(c), 0.16 * k, matRh);
      }
      if (S.wt > 0.01) {
        const k = sm(S.wt);
        for (let i = 0; i < WAT.length; i++) {
          const p = waterPt(i), a = WAT[i].a, h1 = p.clone().add(V(0.2 * Math.cos(a), 0.14, 0.2 * Math.sin(a))), h2 = p.clone().add(V(-0.2 * Math.cos(a), 0.14, -0.2 * Math.sin(a)));
          ctx.ball(p, 0.17 * k, matO); ctx.ball(h1, 0.1 * k, matH); ctx.ball(h2, 0.1 * k, matH);
        }
      }
      // ── الكولاجين: الجزيء الأوَّل (خرز الأحماض الأمينيَّة + أنبوب) ──
      const tw = sm(S.tw);
      for (let j = 0; j < 3; j++) {
        if (S.ca <= j + 0.02) continue;
        const sh = chainShift(j), pts = chainPts(0, j, tw, sh);
        ctx.tubePts(pts, 0.1, matC[j]);
        for (let i = 0; i < NRES; i++) ctx.ball(pts[i], i % 3 === 0 ? 0.15 : 0.12, i % 3 === 0 ? matGly : matC[j]);
      }
      if (S.hb > 0.01) {
        const k = sm(S.hb);
        HBX.forEach((x, q) => { const j = q % 3, a = axisPt(0, j, x, tw), b = axisPt(0, (j + 1) % 3, x, tw); for (let d = 0; d < 3; d++) ctx.ball(a.clone().lerp(b, (d + 0.5) / 3), 0.07 * k, matHb); });
        COVX.forEach((x, q) => { const a = axisPt(0, (q * 2) % 3, x, tw), b = axisPt(0, (q * 2 + 1) % 3, x, tw); ctx.rod(a, a.clone().lerp(b, k), 0.07, matBond); });
      }
      // ── اللييف: جزيئات مجاورة متوازية (أنابيب فقط) وروابط تساهميَّة بينها ──
      if (S.fb > 0.01) {
        const sh = molShift();
        for (let m = 1; m < MOL.length; m++) for (let j = 0; j < 3; j++) { const pts = []; for (let i = 0; i < NRES; i++) pts.push(axisPt(m, j, X0 + i * DX, 1).add(sh)); ctx.tubePts(pts, 0.16, matC[j]); }
      }
      if (S.xl > 0.01) {
        const k = sm(S.xl);
        for (const [a, b, x] of XL) { const p = molAxisMid(a, x), q = molAxisMid(b, x); ctx.rod(p, p.clone().lerp(q, k), 0.075, matBond); }
      }
    },
    place(s) { S = s; },
  };
})();
