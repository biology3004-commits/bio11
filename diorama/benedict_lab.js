/* ديوراما: اختبار بندكت شبه الكمِّي — الاستقصاء العملي ٢-١ (كتاب التجارب العمليَّة والأنشطة ص ٧٠–٧٣)؛ الألوان من دليل المعلِّم الجدول ٢-٢ (ص ١٢٤) */
(function () {
  const { V, sm, M, CSS } = DioramaCore;
  const { BLU, RED, GLD, TEAL, GRY, GRN, ORG, PUR } = CSS;
  const L = s => `<span class="ltr">${s}</span>`;

  // ── هندسة الطاولة (وحدات المشهد) ─────────────────────────────────────────
  const TUBE_H = 1.9, TUBE_R = 0.3;                      // ارتفاع الأنبوبة ونصف قطرها
  const RACK_Y = 0.5;                                     // سطح الحامل
  const HOME_Y = RACK_Y + TUBE_H / 2;                     // مركز الأنبوبة وهي في الحامل
  const HOME_X = i => 5.5 - (i - 1) * 1.1;                // الأنبوبة 1 في أقصى اليمين (ترتيب الشكل ٢-١)
  const BATH = V(-6.5, 0, 0.4);                           // مركز كأس الحمَّام المائي 500 mL
  const BATH_R = 1.35, BATH_H = 3.4, WATER_H = 2.4;       // الكأس والماء
  const BATH_SLOT = i => { const a = (i - 1) / 7 * 2 * Math.PI; return [BATH.x + 0.78 * Math.cos(a), BATH.z + 0.78 * Math.sin(a)]; };
  const BATH_Y = 0.4 + TUBE_H / 2 - HOME_Y;               // إزاحة y للأنبوبة داخل الكأس (قاعها فوق قاع الكأس بـ 0.4)
  const BEN = V(-2.6, 0, 2.3), WASH = V(-2.6, 0, -1.6);   // كأس بندكت 50 mL وكأس الغسل
  const PIP_Y = HOME_Y + TUBE_H / 2 + 1.0;                // ارتفاع رأس الماصَّة فوق الأنابيب
  const PIP_FILL_Y = 2.2;                                 // ارتفاع الماصَّة وهي تسحب من كأس
  const HOLDER_REST = V(-3.2, 0.15, -3.6);                 // الماسك على الطاولة
  const STD = { conc: ['10%', '1%', '0.1%', '0.01%', '0.001%', '0.0001%', 'مجهول'],
                name: ['أحمر بنّي', 'برتقالي', 'أصفر', 'أخضر', 'أخضر فاتح', 'أزرق', 'أخضر أو أصفر'] };
  let S;

  // ── نموذج الألوان والسوائل (دوال نقيَّة؛ الألوان sRGB كما في لوحة المنصَّة) ────────
  const LADDER = ['#2b9fd8', '#4e9a3c', '#f2c414', '#ec7a12', '#8e2b17'];   // كتاب الطالب ص ٧١: أزرق ← أخضر ← أصفر ← برتقالي ← بنّي محمر
  const FINAL = ['#8e2b17', '#ec7a12', '#f2c414', '#4e9a3c', '#a2cf63', '#2b9fd8', null];   // دليل المعلِّم الجدول ٢-٢ (المجهول يُحسب مزيجاً)
  const MAXSTEP = [4, 3, 2, 1, 0.5, 0, 1.5];                                  // أقصى موضع على السلَّم لكلِّ أنبوبة
  const GLUCOSE = '#e6f4fb', BENEDICT = '#2b9fd8';
  const model = {
    LADDER, FINAL, MAXSTEP, TUBE_H,
    colorFor(i, c, b) {
      if (b <= 0) return new THREE.Color(GLUCOSE);
      let col;
      if (c >= 1) col = i === 7 ? new THREE.Color('#f2c414').lerp(new THREE.Color('#4e9a3c'), 0.5) : new THREE.Color(FINAL[i - 1]);
      else {
        const pos = Math.max(0, c) * MAXSTEP[i - 1], k = Math.min(LADDER.length - 2, Math.floor(pos)), u = pos - k;
        col = new THREE.Color(LADDER[k]).lerp(new THREE.Color(LADDER[k + 1]), u);
      }
      return b >= 1 ? col : new THREE.Color(GLUCOSE).lerp(col, b);
    },
    levelH: v => 0.72 * TUBE_H * (v / 14),
    turbidity: c => 0.55 + 0.35 * Math.min(1, Math.max(0, c)),
  };

  // ── مقاطع الحركة المتكرِّرة ───────────────────────────────────────────────
  const tubeKeys = (k, val) => { const o = {}; for (let i = 1; i <= 7; i++) o[k + i] = val; return o; };
  // الخطوة 2: الماصَّة تنقل 9 mL إلى كلِّ أنبوبة وتُغسل بين كلِّ نقلين
  const seqGlucose = () => {
    const q = [[{ '!ph': 1, '!px': WASH.x, '!py': PIP_Y, '!pz': WASH.z, '!pf': 0 }, 0]];
    for (let i = 1; i <= 7; i++) {
      q.push([{ pf: 1 }, 250], [{ px: HOME_X(i), pz: 0 }, 350], [{ ['v' + i]: 9, pf: 0 }, 600]);
      if (i < 7) q.push([{ px: WASH.x, pz: WASH.z }, 350], [{ py: PIP_FILL_Y, pf: 0.4 }, 180], [{ py: PIP_Y, pf: 0 }, 180]);
    }
    return q;
  };
  // الخطوة 3: 5 mL من محلول بندكت إلى كلِّ أنبوبة
  const seqBenedict = () => {
    const q = [];
    for (let i = 1; i <= 7; i++) q.push([{ px: BEN.x, pz: BEN.z, py: PIP_FILL_Y }, 350], [{ pf: 1 }, 200], [{ py: PIP_Y }, 150], [{ px: HOME_X(i), pz: 0 }, 350], [{ ['v' + i]: 14, ['b' + i]: 1, pf: 0 }, 550]);
    q.push([{ px: WASH.x, pz: WASH.z }, 300], [{ '!ph': 0 }, 0]);
    return q;
  };
  // الخطوة 4: الأنابيب إلى الحمَّام ثمَّ خمس دقائق تسخين
  const seqHeat = () => {
    const to = {}; for (let i = 1; i <= 7; i++) { const [bx, bz] = BATH_SLOT(i); to['x' + i] = bx - HOME_X(i); to['z' + i] = bz; to['y' + i] = BATH_Y + 1.2; }
    const down = {}; for (let i = 1; i <= 7; i++) down['y' + i] = BATH_Y;
    return [[to, 1400], [down, 700], [Object.assign({ t: 5 }, tubeKeys('c', 1)), 4500]];
  };
  // الخطوة 5: إطفاء الموقد وإخراج الأنابيب بالماسك إلى الحامل بالترتيب
  const seqOut = () => {
    const q = [[{ flame: 0, bubbles: 0 }, 600]];
    for (let i = 1; i <= 7; i++) {
      const [bx, bz] = BATH_SLOT(i);
      q.push([{ hx: bx, hz: bz, hy: HOME_Y + BATH_Y + 0.5, hg: 0 }, 260], [{ hg: 1 }, 100],
             [{ ['y' + i]: BATH_Y + 1.4, hy: HOME_Y + BATH_Y + 1.9 }, 260],
             [{ ['x' + i]: 0, ['z' + i]: 0, hx: HOME_X(i), hz: 0 }, 380],
             [{ ['y' + i]: 0, hy: HOME_Y + 0.5 }, 220], [{ hg: 0 }, 80]);
    }
    q.push([{ hx: HOLDER_REST.x, hy: HOLDER_REST.y, hz: HOLDER_REST.z }, 400]);
    return q;
  };

  const BASE = Object.assign(
    { flame: 0, bubbles: 0, t: 0, u: 0, fo: 0, zoom: 1, ph: 0, px: WASH.x, py: PIP_Y, pz: WASH.z, pf: 0, hx: HOLDER_REST.x, hy: HOLDER_REST.y, hz: HOLDER_REST.z, hg: 0 },
    tubeKeys('v', 0), tubeKeys('b', 0), tubeKeys('c', 0), tubeKeys('y', 0), tubeKeys('x', 0), tubeKeys('z', 0));

  window.DIORAMA = {
    id: 'benedict_lab',
    title: 'اختبار بندكت شبه الكمِّي: الاستقصاء العملي ٢-١ خطوةً خطوة',
    subtitle: 'الأحياء — الصف الحادي عشر — الوحدة الثانية: الجزيئات الحيويَّة — كتاب التجارب العمليَّة والأنشطة ص ٧٠–٧٣',
    source: 'النص من كتاب التجارب العمليَّة والأنشطة: الاستقصاء العملي ٢-١ (ص ٧٠–٧٣)؛ الألوان من دليل المعلِّم الجدول ٢-٢ (ص ١٢٤)',
    legend: [],
    camera: { VH: 20, center: [-0.5, 1.2, 0], elevation: 25, azimuth: 35 },
    base: { L: 26, W: 12, x: -0.5 },
    BASE,
    noGeom: Object.keys(BASE),
    model,
    STEPS: [
      { t: 'إعداد الحمَّام المائي',
        p: 'اعمل على إعداد حمّام مائي بدرجة الغليان. (كتاب الأنشطة ص ٧٢)',
        seq: [[{ flame: 1 }, 700], [{ bubbles: 1 }, 1500]] },
      { t: 'وسم الأنابيب وإضافة 9 mL من كلِّ محلول',
        p: 'اكتب المسميات على أنابيب الاختبار السبع بالتراكيز المختلفة لمحلول الجلوكوز 10%، 1%، 0.1%، 0.01%، 0.001%، 0.0001%، والمحلول المجهول. استخدم الماصّة لإضافة 9 mL من كل محلول جلوكوز إلى أنبوبة الاختبار المطابقة. تذكّر أن تغسل الماصّة بين كل عمليتَي نقل. (كتاب الأنشطة ص ٧٢)',
        seq: seqGlucose() },
      { t: 'إضافة 5 mL من محلول بندكت',
        p: 'أضف 5 mL من محلول بندكت إلى كل من الأنابيب السبع. (كتاب الأنشطة ص ٧٢)',
        seq: seqBenedict() },
      { t: 'التسخين في الحمَّام المائي 5 دقائق بالضبط',
        p: 'ضع الأنابيب بحرص في الحمّام المائي الذي يغلي لمدّة 5 دقائق بالضبط. (كتاب الأنشطة ص ٧٢)',
        n: 'الألوان تتغيَّر خلال الدقائق الخمس؛ تُعرض هنا مسرَّعة.',
        seq: seqHeat() },
      { t: 'إطفاء الموقد وإخراج الأنابيب إلى الحامل بالترتيب',
        p: 'أطفئ موقد اللهب واستخدم ماسك أنبوبة الاختبار لتُخرج الأنابيب بحرص، ثم ضعها في حامل الأنابيب بالترتيب المبيّن في الشكل ٢-١. (كتاب الأنشطة ص ٧٣)',
        seq: seqOut() },
      { t: 'تسجيل الألوان',
        p: 'سجّل ألوان أنابيب الاختبار إمّا عبر التقاط صورة لحامل أنابيب الاختبار، أو عبر تلوين الأنابيب بالألوان المناسبة. (كتاب الأنشطة ص ٧٣)',
        seq: [[{ '!fo': 1, zoom: 2.2 }, 900]] },
      { t: 'مقارنة المحلول المجهول بالألوان المعياريَّة',
        p: 'قارن لون المحلول المجهول بألوان معياريّة معروفة، محدّدًا تركيز اللون المعياري الأكثر تشابهًا مع لون المحلول. إذا لم يكن اللون مطابقًا تمامًا، فابحث عن ألوان المحاليل ذات التركيز الأعلى والأدنى لاقتراح النطاق الذي يقع فيه التركيز. (كتاب الأنشطة ص ٧٣)',
        seq: [[{ u: 1 }, 1400], [{ zoom: 1.6 }, 700]] },
    ],
    setup(ctx) {},
    rebuild(s, ctx) {},
    place(s, ctx) { S = s; },
  };
})();
