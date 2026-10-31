/* ديوراما: اختبار بندكت شبه الكمِّي — الاستقصاء العملي ٢-١ (كتاب التجارب العمليَّة والأنشطة ص ٧٠–٧٣)؛ الألوان من دليل المعلِّم الجدول ٢-٢ (ص ١٢٤) */
(function () {
  const { V, sm, M, CSS } = DioramaCore;
  const { BLU, RED, GLD, TEAL, GRY, GRN, ORG, PUR } = CSS;
  const L = s => `<span class="ltr">${s}</span>`;

  // ── هندسة الطاولة (وحدات المشهد) ─────────────────────────────────────────
  const TABLE_Y = -0.3;                                   // سطح الطاولة (لوح القاعدة في المحرِّك)
  const TUBE_H = 1.9, TUBE_R = 0.3;                      // ارتفاع الأنبوبة ونصف قطرها
  const TUBE_BOTTOM_Y = -0.15;                            // قاع الأنبوبة وهي في الحامل (اللوح السفلي)
  const HOME_Y = TUBE_BOTTOM_Y + TUBE_H / 2;              // مركز الأنبوبة وهي في الحامل
  const HOME_X = i => 5.5 - (i - 1) * 1.1;                // الأنبوبة 1 في أقصى اليمين (ترتيب الشكل ٢-١)
  const TRIPOD_H = 2.3;                                   // ارتفاع الحامل الثلاثي فوق الطاولة
  const BATH = V(-6.5, TABLE_Y + TRIPOD_H + 0.05, 0.4);   // مركز قاع كأس الحمَّام المائي 500 mL (على الشبكة)
  const BATH_R = 1.35, BATH_H = 3.4, WATER_H = 2.4;       // الكأس والماء
  const BATH_SLOT = i => { const a = (i - 1) / 7 * 2 * Math.PI; return [BATH.x + 0.78 * Math.cos(a), BATH.z + 0.78 * Math.sin(a)]; };
  const BATH_Y = (BATH.y + 0.4 + TUBE_H / 2) - HOME_Y;    // إزاحة y للأنبوبة داخل الكأس (قاعها فوق قاع الكأس بـ 0.4)
  const BATH_TOP = BATH.y + BATH_H;                        // حافَّة الكأس
  const LIFT_Y = BATH_TOP - HOME_Y + TUBE_H / 2 + 0.15;   // إزاحة y التي يكون عندها قاع الأنبوبة فوق الحافَّة (للدخول والخروج من الفوَّهة)
  const STOCK = i => V(HOME_X(i), TABLE_Y, -2.4);         // أوعية محاليل الجلوكوز السبعة خلف الحامل
  const STOCK_R = 0.3, STOCK_H = 1.0;
  const BEN = V(-2.6, TABLE_Y, 2.3), WASH = V(-2.6, TABLE_Y, -1.6);   // قاعدتا كأس بندكت 50 mL وكأس الغسل
  const BEN_R = 0.55, BEN_H = 1.2, WASH_R = 0.6, WASH_H = 1.3;
  const PIP_Y = HOME_Y + TUBE_H / 2 + 0.55;               // ارتفاع طرف الماصَّة فوق الأنابيب
  const PIP_FILL_Y = TABLE_Y + 0.35;                      // طرف الماصَّة داخل سائل الكأس
  const PIP_LEN = 2.4;                                    // طول أنبوب الماصَّة
  const HOLDER_REST = V(-3.2, TABLE_Y + 0.1, -3.6);        // الماسك على الطاولة
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
      const fin = i === 7 ? new THREE.Color('#f2c414').lerp(new THREE.Color('#4e9a3c'), 0.5) : new THREE.Color(FINAL[i - 1]);
      let col;
      if (c >= 1) col = fin;
      else {
        const pos = Math.max(0, c) * MAXSTEP[i - 1], k = Math.min(LADDER.length - 2, Math.floor(pos)), u = pos - k;
        col = new THREE.Color(LADDER[k]).lerp(new THREE.Color(LADDER[k + 1]), u);
        const w = Math.min(1, Math.max(0, (c - 0.7) / 0.3));          // الثلث الأخير: مزج متَّصل نحو لون الجدول ٢-٢ (لا قفزة)
        col.lerp(fin, w);
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
    const q = [[{ '!ph': 1, '!pc': 0, '!px': WASH.x, '!py': PIP_Y, '!pz': WASH.z, '!pf': 0 }, 0]];
    for (let i = 1; i <= 7; i++) {
      const st = STOCK(i);
      q.push([{ px: st.x, pz: st.z }, 350], [{ py: TABLE_Y + 0.45 }, 150], [{ pf: 1 }, 220], [{ py: PIP_Y }, 150], [{ px: HOME_X(i), pz: 0 }, 350], [{ ['v' + i]: 9, pf: 0 }, 600]);
      if (i < 7) q.push([{ px: WASH.x, pz: WASH.z }, 350], [{ py: PIP_FILL_Y, pf: 0.4 }, 180], [{ py: PIP_Y, pf: 0 }, 180]);
    }
    return q;
  };
  // الخطوة 3: 5 mL من محلول بندكت إلى كلِّ أنبوبة
  const seqBenedict = () => {
    const q = [[{ '!pc': 1 }, 0]];
    for (let i = 1; i <= 7; i++) q.push([{ px: BEN.x, pz: BEN.z, py: PIP_FILL_Y }, 350], [{ pf: 1 }, 200], [{ py: PIP_Y }, 150], [{ px: HOME_X(i), pz: 0 }, 350], [{ ['v' + i]: 14, ['b' + i]: 1, pf: 0 }, 550]);
    q.push([{ px: WASH.x, pz: WASH.z }, 300], [{ '!ph': 0 }, 0]);
    return q;
  };
  // الخطوة 4: الأنابيب إلى الحمَّام ثمَّ خمس دقائق تسخين
  const seqHeat = () => {
    const to = {}; for (let i = 1; i <= 7; i++) { const [bx, bz] = BATH_SLOT(i); to['x' + i] = bx - HOME_X(i); to['z' + i] = bz; }
    return [[tubeKeys('y', LIFT_Y), 900], [to, 1200], [tubeKeys('y', BATH_Y), 800], [Object.assign({ t: 5 }, tubeKeys('c', 1)), 4500]];
  };
  // الخطوة 5: إطفاء الموقد وإخراج الأنابيب بالماسك إلى الحامل بالترتيب
  const seqOut = () => {
    const q = [[{ flame: 0, bubbles: 0 }, 600]];
    for (let i = 1; i <= 7; i++) {
      const [bx, bz] = BATH_SLOT(i);
      q.push([{ hx: bx, hz: bz, hy: HOME_Y + BATH_Y + 0.5, hg: 0 }, 260], [{ hg: 1 }, 100],
             [{ ['y' + i]: LIFT_Y, hy: HOME_Y + LIFT_Y + 0.5 }, 320],
             [{ ['x' + i]: 0, ['z' + i]: 0, hx: HOME_X(i), hz: 0 }, 380],
             [{ ['y' + i]: 0, hy: HOME_Y + 0.5 }, 260], [{ hg: 0 }, 80]);
    }
    q.push([{ hx: HOLDER_REST.x, hy: HOLDER_REST.y, hz: HOLDER_REST.z }, 400]);
    return q;
  };

  const BASE = Object.assign(
    { flame: 0, bubbles: 0, t: 0, u: 0, fo: 0, zoom: 1, ph: 0, pc: 0, px: WASH.x, py: PIP_Y, pz: WASH.z, pf: 0, hx: HOLDER_REST.x, hy: HOLDER_REST.y, hz: HOLDER_REST.z, hg: 0 },
    tubeKeys('v', 0), tubeKeys('b', 0), tubeKeys('c', 0), tubeKeys('y', 0), tubeKeys('x', 0), tubeKeys('z', 0));

  // ── الخامات والأدوات ─────────────────────────────────────────────────────
  const isLow = () => (typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches) || /[?&]m=1(&|$)/.test(location.search);
  function glassMat(low) {
    if (low) { const m = new THREE.MeshStandardMaterial({ color: 0xdfeefa, transparent: true, opacity: 0.35, roughness: 0.1, metalness: 0, depthWrite: false }); m.color.convertSRGBToLinear(); return m; }
    const m = new THREE.MeshPhysicalMaterial({ color: 0xd6eaf7, transmission: 0.75, roughness: 0.06, ior: 1.5, transparent: true, opacity: 0.8, metalness: 0, depthWrite: false, side: THREE.DoubleSide }); m.color.convertSRGBToLinear(); return m;
  }
  const matWood = M(0x9c6b3c, { roughness: 0.75 }), matMetal = M(0x7d8790, { roughness: 0.35, metalness: 0.7 }), matDark = M(0x2b3138, { roughness: 0.5, metalness: 0.5 });
  const matTile = M(0xf4f4f0, { roughness: 0.9 }), matBulb = M(0x1f5fbf, { roughness: 0.4 }), matLabel = M(0xffffff, { roughness: 0.95 });
  const matWater = (() => { const m = new THREE.MeshStandardMaterial({ color: 0xbfe3f5, transparent: true, opacity: 0.5, roughness: 0.15, depthWrite: false }); m.color.convertSRGBToLinear(); return m; })();
  const matBenedict = (() => { const m = new THREE.MeshStandardMaterial({ color: BENEDICT, transparent: true, opacity: 0.85, roughness: 0.2, depthWrite: false }); m.color.convertSRGBToLinear(); return m; })();
  const matBubble = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.55, roughness: 0.1, depthWrite: false });
  const matSteam = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.18, roughness: 1, depthWrite: false });
  const matFlameIn = new THREE.MeshStandardMaterial({ color: 0x3b82f6, emissive: 0x2563eb, emissiveIntensity: 1.2, transparent: true, opacity: 0.9, depthWrite: false });
  const matFlameOut = new THREE.MeshStandardMaterial({ color: 0xffb347, emissive: 0xff8c1a, emissiveIntensity: 1.4, transparent: true, opacity: 0.6, depthWrite: false });
  const matPpt = M('#8e2b17', { roughness: 0.6 });
  const parts = {};
  let matGlass;
  const put = (m, p, r) => { m.position.set(p[0], p[1], p[2]); if (r) m.rotation.set(r[0], r[1], r[2]); return m; };

  // كأس مفتوح: جدار أسطواني + قاع + فوَّهة صغيرة؛ أصله عند مركز القاع
  function beaker(r, h, parent) {
    const g = new THREE.Group();
    const wall = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 0.96, h, 28, 1, true), matGlass); wall.position.y = h / 2; g.add(wall);
    const bottom = new THREE.Mesh(new THREE.CircleGeometry(r * 0.96, 28), matGlass); bottom.rotation.x = -Math.PI / 2; bottom.position.y = 0.02; g.add(bottom);
    const spout = new THREE.Mesh(new THREE.TorusGeometry(r, 0.03, 8, 28), matGlass); spout.rotation.x = Math.PI / 2; spout.position.y = h; g.add(spout);
    parent.add(g); return g;
  }
  // أنبوبة اختبار: جدار + قاع نصف كروي + حافَّة؛ أصلها عند مركزها
  function testTube(parent) {
    const g = new THREE.Group();
    const wall = new THREE.Mesh(new THREE.CylinderGeometry(TUBE_R, TUBE_R, TUBE_H - TUBE_R, 24, 1, true), matGlass); wall.position.y = TUBE_R / 2; g.add(wall);
    const bottom = new THREE.Mesh(new THREE.SphereGeometry(TUBE_R, 24, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), matGlass); bottom.position.y = -TUBE_H / 2 + TUBE_R; g.add(bottom);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(TUBE_R, 0.035, 8, 24), matGlass); rim.rotation.x = Math.PI / 2; rim.position.y = TUBE_H / 2; g.add(rim);
    parent.add(g); return g;
  }
  function envMapFor(renderer) {
    const pm = new THREE.PMREMGenerator(renderer), sc = new THREE.Scene();
    sc.add(new THREE.Mesh(new THREE.SphereGeometry(50, 16, 12), new THREE.MeshBasicMaterial({ color: 0xdfe8f0, side: THREE.BackSide })));
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshBasicMaterial({ color: 0x9aa3ad })); floor.rotation.x = -Math.PI / 2; floor.position.y = -2; sc.add(floor);
    const win = new THREE.Mesh(new THREE.PlaneGeometry(4, 3), new THREE.MeshBasicMaterial({ color: 0xffffff })); win.position.set(0, 6, -10); win.lookAt(0, 0, 0); sc.add(win);
    const tex = pm.fromScene(sc, 0.04).texture; pm.dispose(); return tex;
  }

  function setup(ctx) {
    const low = isLow(), scene = ctx.scene;
    matGlass = glassMat(low);
    if (ctx.renderer && !low) { matGlass.envMap = envMapFor(ctx.renderer); matGlass.envMapIntensity = 1.0; }
    // الحمَّام المائي: بلاط، موقد، حامل ثلاثي، شبكة، كأس 500 mL، ماء، فقاعات، بخار
    const tile = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.1, 3.6), matTile); tile.position.set(BATH.x, TABLE_Y + 0.05, BATH.z); scene.add(tile);
    const burner = {};
    burner.body = new THREE.Group();
    burner.body.add(put(new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.65, 0.12, 20), matDark), [0, 0.06, 0]));
    burner.body.add(put(new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 1.25, 14), matMetal), [0, 0.75, 0]));
    burner.body.add(put(new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.18, 14), matDark), [0, 0.45, 0]));
    burner.body.position.set(BATH.x, TABLE_Y + 0.1, BATH.z); scene.add(burner.body);
    burner.flameIn = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.6, 12), matFlameIn); burner.flameIn.geometry.translate(0, 0.3, 0);
    burner.flameOut = new THREE.Mesh(new THREE.ConeGeometry(0.27, 0.95, 12), matFlameOut); burner.flameOut.geometry.translate(0, 0.475, 0);
    for (const f of [burner.flameIn, burner.flameOut]) { f.position.set(BATH.x, TABLE_Y + 1.47, BATH.z); f.scale.y = 0; scene.add(f); }
    burner.light = new THREE.PointLight(0xffa040, 0, 6); burner.light.position.set(BATH.x, TABLE_Y + 1.85, BATH.z); scene.add(burner.light);
    parts.burner = burner;
    const tripod = new THREE.Group();
    for (let k = 0; k < 3; k++) { const a = k / 3 * 2 * Math.PI + 0.5; const leg = ctx.rod(V(BATH.x + 1.35 * Math.cos(a), TABLE_Y, BATH.z + 1.35 * Math.sin(a)), V(BATH.x + 1.1 * Math.cos(a), TABLE_Y + TRIPOD_H, BATH.z + 1.1 * Math.sin(a)), 0.05, matMetal, tripod); }
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.05, 8, 32), matMetal); ring.rotation.x = Math.PI / 2; ring.position.set(BATH.x, TABLE_Y + TRIPOD_H, BATH.z); tripod.add(ring);
    scene.add(tripod); parts.tripod = tripod;
    const gauze = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.03, 2.4), M(0x9aa4ad, { roughness: 0.5, metalness: 0.6, transparent: true, opacity: 0.85 })); gauze.position.set(BATH.x, TABLE_Y + TRIPOD_H + 0.03, BATH.z); scene.add(gauze); parts.gauze = gauze; parts.tile = tile;
    const bath = {};
    bath.beaker = beaker(BATH_R, BATH_H, scene); bath.beaker.position.copy(BATH);
    bath.water = new THREE.Mesh(new THREE.CylinderGeometry(BATH_R * 0.95, BATH_R * 0.92, WATER_H, 28), matWater); bath.water.position.set(BATH.x, BATH.y + 0.03 + WATER_H / 2, BATH.z); scene.add(bath.water);
    bath.bubbles = [];
    const nB = low ? 15 : 30, gB = new THREE.SphereGeometry(1, 8, 6);
    for (let k = 0; k < nB; k++) {
      const b = new THREE.Mesh(gB, matBubble); const a = k * 2.399, rr = 0.15 + 0.75 * ((k * 0.618) % 1);
      b.userData = { ox: BATH.x + rr * Math.cos(a), oz: BATH.z + rr * Math.sin(a), phase: (k * 0.37) % 1, speed: 0.35 + 0.45 * ((k * 0.29) % 1), r: 0.035 + 0.03 * ((k * 0.71) % 1) };
      b.scale.setScalar(b.userData.r); b.position.set(b.userData.ox, BATH.y + 0.1, b.userData.oz); b.visible = false; scene.add(b); bath.bubbles.push(b);
    }
    bath.steam = [0, 1].map(k => { const s = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), matSteam); s.scale.set(0.55, 0.35, 0.55); s.position.set(BATH.x + (k ? 0.4 : -0.3), BATH.y + BATH_H + 0.3, BATH.z); s.visible = false; scene.add(s); return s; });
    parts.bath = bath;
    // كأس بندكت 50 mL (أزرق) وكأس الغسل (ماء)
    parts.benedictBeaker = beaker(BEN_R, BEN_H, scene); parts.benedictBeaker.position.copy(BEN);
    const benLiq = new THREE.Mesh(new THREE.CylinderGeometry(BEN_R * 0.94, BEN_R * 0.9, BEN_H * 0.7, 24), matBenedict); benLiq.position.set(BEN.x, BEN.y + 0.03 + BEN_H * 0.35, BEN.z); scene.add(benLiq);
    parts.washBeaker = beaker(WASH_R, WASH_H, scene); parts.washBeaker.position.copy(WASH);
    const washLiq = new THREE.Mesh(new THREE.CylinderGeometry(WASH_R * 0.94, WASH_R * 0.9, WASH_H * 0.65, 24), matWater); washLiq.position.set(WASH.x, WASH.y + 0.03 + WASH_H * 0.325, WASH.z); scene.add(washLiq);
    // أوعية محاليل الجلوكوز السبعة (من قائمة المواد) خلف الحامل: كأس صغير لكلِّ تركيز بسائل شفَّاف
    parts.stock = [];
    for (let i = 1; i <= 7; i++) {
      const st = STOCK(i), g = beaker(STOCK_R, STOCK_H, scene); g.position.copy(st);
      const liqM = new THREE.MeshStandardMaterial({ color: GLUCOSE, transparent: true, opacity: 0.5, roughness: 0.2, depthWrite: false }); liqM.color.convertSRGBToLinear();
      const liq = new THREE.Mesh(new THREE.CylinderGeometry(STOCK_R * 0.94, STOCK_R * 0.9, STOCK_H * 0.6, 20), liqM); liq.position.set(st.x, st.y + 0.03 + STOCK_H * 0.3, st.z); scene.add(liq);
      parts.stock.push(g);
    }
    // حامل الأنابيب: لوحان خشبيَّان وقوائم وحلقات الثقوب
    const rack = new THREE.Group();
    const top = new THREE.Mesh(new THREE.BoxGeometry(8.4, 0.12, 1.1), matWood); top.position.set(HOME_X(4), 0.55, 0); rack.add(top);
    const bot = new THREE.Mesh(new THREE.BoxGeometry(8.4, 0.12, 1.1), matWood); bot.position.set(HOME_X(4), TUBE_BOTTOM_Y - 0.06, 0); rack.add(bot);
    for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) rack.add(put(new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.55 - TABLE_Y, 0.14), matWood), [HOME_X(4) + sx * 4.1, (0.55 + TABLE_Y) / 2, sz * 0.45]));
    for (let i = 1; i <= 7; i++) { const h = new THREE.Mesh(new THREE.TorusGeometry(TUBE_R + 0.06, 0.05, 8, 24), matWood); h.rotation.x = Math.PI / 2; h.position.set(HOME_X(i), 0.62, 0); rack.add(h); }
    scene.add(rack); parts.rack = rack;
    // الأنابيب السبع: زجاج، سائل، منسك، راسب (للأنبوبتين 1 و2)
    parts.tubes = [];
    for (let i = 1; i <= 7; i++) {
      const home = V(HOME_X(i), HOME_Y, 0);
      const glass = testTube(scene); glass.position.copy(home);
      const liqM = new THREE.MeshStandardMaterial({ color: GLUCOSE, transparent: true, opacity: 0.55, roughness: 0.2, depthWrite: false }); liqM.color.convertSRGBToLinear();
      const liquid = new THREE.Mesh(new THREE.CylinderGeometry(TUBE_R * 0.9, TUBE_R * 0.9, 1, 20), liqM); liquid.geometry.translate(0, 0.5, 0); liquid.visible = false; glass.add(liquid);
      const menM = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.35, roughness: 0.1, depthWrite: false });
      const meniscus = new THREE.Mesh(new THREE.CylinderGeometry(TUBE_R * 0.9, TUBE_R * 0.9, 0.02, 20), menM); meniscus.visible = false; glass.add(meniscus);
      const ppt = [];
      if (i <= 2) for (let k = 0; k < 20; k++) { const p = new THREE.Mesh(gB, matPpt); p.scale.setScalar(0.035); p.userData = { a: k * 2.399, r: TUBE_R * 0.7 * ((k * 0.618) % 1), h: (k * 0.37) % 1 }; p.visible = false; glass.add(p); ppt.push(p); }
      parts.tubes.push({ glass, liquid, meniscus, ppt, home });
    }
    // الماصَّة 10 mL مع محقن الماصَّة: أصلها عند الطرف
    const pip = new THREE.Group();
    pip.add(put(new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, PIP_LEN, 12, 1, true), matGlass), [0, PIP_LEN / 2 + 0.15, 0]));
    pip.add(put(new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.15, 12), matGlass), [0, 0.075, 0], [Math.PI, 0, 0]));
    pip.add(put(new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 12), matBulb), [0, PIP_LEN + 0.35, 0]));
    const colM = new THREE.MeshStandardMaterial({ color: GLUCOSE, transparent: true, opacity: 0.85, roughness: 0.2, depthWrite: false }); colM.color.convertSRGBToLinear();
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1, 10), colM); col.geometry.translate(0, 0.5, 0); col.position.y = 0.15; col.scale.y = 0.001; pip.add(col);
    pip.userData.column = col; pip.visible = false; scene.add(pip); parts.pipette = pip;
    // ماسك أنبوبة الاختبار: قضيب أفقي وفكَّان؛ أصله عند الفكَّين
    const holder = new THREE.Group();
    holder.add(put(new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.6, 10), matMetal), [0, 0, 1.0], [Math.PI / 2, 0, 0]));
    holder.add(put(new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.3, 0.5), matWood), [0, 0, 1.75]));
    const jawL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.28, 0.34), matMetal), jawR = jawL.clone(); jawL.position.x = -TUBE_R - 0.06; jawR.position.x = TUBE_R + 0.06; holder.add(jawL, jawR);
    holder.userData.jaws = [jawL, jawR]; holder.position.copy(HOLDER_REST); scene.add(holder); parts.holder = holder;
  }

  // ── الوضع من الحالة وحدها (يصلح للقفز إلى أيِّ خطوة وللعودة) ──────────────
  const LIQ_BASE = -TUBE_H / 2 + 0.06;                    // قاع السائل داخل الأنبوبة (محلِّي)
  const RACK_MID = V(HOME_X(4), HOME_Y, 0);
  const clamp01 = x => Math.min(1, Math.max(0, x));
  function place(s, ctx) {
    S = s;
    const midX = (HOME_X(3) + HOME_X(4)) / 2;
    parts.tubes.forEach((t, k) => {
      const i = k + 1, v = s['v' + i], b = s['b' + i], c = s['c' + i];
      const ux = i === 7 ? s.u * (midX - t.home.x) : 0, uz = i === 7 ? s.u * 0.9 : 0;
      t.glass.position.set(t.home.x + s['x' + i] + ux, t.home.y + s['y' + i], s['z' + i] + uz);
      const h = model.levelH(v);
      t.liquid.visible = v > 0; t.liquid.scale.y = Math.max(0.001, h); t.liquid.position.y = LIQ_BASE;
      t.liquid.material.color.copy(model.colorFor(i, c, b)).convertSRGBToLinear();
      t.liquid.material.opacity = b > 0 ? model.turbidity(c) : 0.45;
      t.meniscus.visible = v > 0; t.meniscus.position.y = LIQ_BASE + h;
      const fall = clamp01((c - 0.3) / 0.7);
      t.ppt.forEach(p => { p.visible = c > 0.3; const { a, r, h: hh } = p.userData; p.position.set(r * Math.cos(a), LIQ_BASE + 0.04 + h * (0.5 * (1 - fall) + 0.06 * hh), r * Math.sin(a)); });
    });
    parts.pipette.visible = s.ph > 0; parts.pipette.position.set(s.px, s.py, s.pz); parts.pipette.userData.column.scale.y = Math.max(0.001, s.pf * 1.8);
    parts.pipette.userData.column.material.color.set(s.pc >= 0.5 ? BENEDICT : GLUCOSE).convertSRGBToLinear();
    parts.holder.position.set(s.hx, s.hy, s.hz);
    const gap = s.hg >= 0.5 ? TUBE_R + 0.06 : TUBE_R + 0.3; parts.holder.userData.jaws[0].position.x = -gap; parts.holder.userData.jaws[1].position.x = gap;
    parts.burner.flameIn.scale.y = s.flame; parts.burner.flameOut.scale.y = s.flame; parts.burner.light.intensity = 0.6 * s.flame;
    parts.bath.bubbles.forEach(bb => { bb.visible = s.bubbles > 0; });
    parts.bath.steam.forEach(st => { st.visible = s.bubbles > 0; st.material.opacity = 0.18 * s.bubbles; });
  }
  const focus = s => (s.fo || 0) >= 0.5 ? RACK_MID.clone() : V(-0.5, 1.2, 0);

  // ── الحركة الحيَّة: فقاعات الغليان والبخار وارتجاف اللهب (فقط ما دام الموقد مشتعلاً) ──
  function idle(t, s, ctx, tweening) {
    if (s.flame === 0 && s.bubbles === 0 && !tweening) return;
    if (s.bubbles > 0) {
      parts.bath.bubbles.forEach(b => {
        const { ox, oz, phase, speed, r } = b.userData, u = (t * speed + phase) % 1;
        b.position.set(ox + 0.06 * Math.sin(t * 3 + phase * 9), BATH.y + 0.12 + u * (WATER_H - 0.25), oz + 0.06 * Math.cos(t * 2.3 + phase * 7));
        b.scale.setScalar(r * (0.6 + 0.4 * u) * (u > 0.92 ? (1 - u) / 0.08 : 1) * s.bubbles);
      });
      parts.bath.steam.forEach((st, k) => { st.position.y = BATH.y + BATH_H + 0.25 + 0.25 * Math.sin(t * 0.9 + k * 2.1); st.scale.x = st.scale.z = 0.55 + 0.12 * Math.sin(t * 1.3 + k); st.material.opacity = 0.18 * s.bubbles * (0.7 + 0.3 * Math.sin(t * 1.7 + k * 3)); });
    }
    if (s.flame > 0) {
      const f = s.flame * (1 + 0.08 * Math.sin(t * 13 + 0.7)), g = s.flame * (1 + 0.08 * Math.sin(t * 11 + 2.1));
      parts.burner.flameIn.scale.y = f; parts.burner.flameOut.scale.y = g; parts.burner.light.intensity = 0.6 * s.flame * (1 + 0.15 * Math.sin(t * 9));
    }
  }


  // ── التسميات (نقطة الإرساء دالَّة في الحالة) ───────────────────────────────
  const tubeTop = i => s => V(HOME_X(i) + s['x' + i] + (i === 7 ? s.u * ((HOME_X(3) + HOME_X(4)) / 2 - HOME_X(7)) : 0), HOME_Y + s['y' + i] + TUBE_H / 2, s['z' + i] + (i === 7 ? s.u * 0.9 : 0));
  const concPills = STD.conc.map((c, k) => [L(c), k === 6 ? PUR : GRY, tubeTop(k + 1), (k % 2 ? -1 : 1) * 10, k % 2 ? -62 : -110]);
  const colourPills = STD.name.map((n, k) => [n, k === 6 ? PUR : GRY, tubeTop(k + 1), 0, k % 2 ? -60 : -112]);
  const bathPill = ['كأس ' + L('500 mL') + ' (حمَّام مائي)', BLU, () => V(BATH.x, BATH.y + BATH_H, BATH.z), -40, -70];
  const burnerPill = ['موقد لهب', ORG, () => V(BATH.x, TABLE_Y + 0.9, BATH.z + 0.5), 180, 40];
  const timerPill = ['⏱ الزمن: ' + L('5') + ' دقائق بالضبط', RED, () => V(BATH.x + BATH_R, BATH.y + BATH_H * 0.75, BATH.z), 230, -10];

  window.DIORAMA = {
    id: 'benedict_lab',
    title: 'اختبار بندكت شبه الكمِّي: الاستقصاء العملي ٢-١ خطوةً خطوة',
    subtitle: 'الأحياء — الصف الحادي عشر — الوحدة الثانية: الجزيئات الحيويَّة — كتاب التجارب العمليَّة والأنشطة ص ٧٠–٧٣ (الطريقة ص ٧١)',
    source: 'النص من كتاب التجارب العمليَّة والأنشطة: الاستقصاء العملي ٢-١، الطريقة (ص ٧١)؛ الألوان من دليل المعلِّم الجدول ٢-٢ (ص ١٢٤)',
    legend: [['#2b9fd8', 'محلول بندكت', 'dot'], ['#e6f4fb;border:1px solid #9aa7b4', 'محلول جلوكوز', 'dot'], ['#8e2b17', 'الراسب', 'dot']],
    camera: { VH: 14.5, center: [-0.6, 1.7, 0], elevation: 25, azimuth: 35 },
    base: { L: 17, W: 9, x: -0.5 },
    BASE,
    noGeom: Object.keys(BASE),
    model,
    STEPS: [
      { t: 'إعداد الحمَّام المائي',
        p: 'اعمل على إعداد حمّام مائي بدرجة الغليان (انظر إلى رسم الحمّام المائي في الاستقصاء العملي ٢-٢، الجزء ٤). (كتاب الأنشطة ص ٧١)',
        seq: [[{ flame: 1 }, 700], [{ bubbles: 1 }, 1500]],
        pills: [burnerPill, bathPill] },
      { t: 'وسم الأنابيب وإضافة 9 mL من كلِّ محلول',
        p: 'اكتب المسميات على أنابيب الاختبار السبع بالتراكيز المختلفة لمحلول الجلوكوز 10%، 1%، 0.1%، 0.01%، 0.001%، 0.0001%، والمحلول المجهول. استخدم الماصّة لإضافة 9 mL من كل محلول جلوكوز إلى أنبوبة الاختبار المطابقة. تذكّر أن تغسل الماصّة بين كل عمليتَي نقل. (كتاب الأنشطة ص ٧١)',
        seq: seqGlucose(),
        pills: concPills.concat([['ماصَّة ' + L('10 mL'), TEAL, s => V(s.px, s.py + PIP_LEN + 0.5, s.pz), -150, -30], ['كأس الغسل', BLU, () => V(WASH.x, WASH.y + WASH_H, WASH.z), -120, -40], ['محاليل الجلوكوز', GRY, () => V(HOME_X(4), TABLE_Y + STOCK_H, -2.4), 0, -70]]) },
      { t: 'إضافة 5 mL من محلول بندكت',
        p: 'أضف 5 mL من محلول بندكت إلى كل من الأنابيب السبع. (كتاب الأنشطة ص ٧١)',
        seq: seqBenedict(),
        pills: [['محلول بندكت ' + L('5 mL') + ' لكلِّ أنبوبة', BLU, () => V(BEN.x, BEN.y + BEN_H, BEN.z), 160, -50]] },
      { t: 'التسخين في الحمَّام المائي 5 دقائق بالضبط',
        p: 'ضع الأنابيب بحرص في الحمّام المائي الذي يغلي لمدّة ٥ دقائق بالضبط. (كتاب الأنشطة ص ٧١)',
        n: 'الألوان تتغيَّر خلال الدقائق الخمس؛ تُعرض هنا مسرَّعة.',
        seq: seqHeat(),
        pills: [timerPill, ['يغلي', BLU, () => V(BATH.x - BATH_R, BATH.y + WATER_H, BATH.z), -90, 20]] },
      { t: 'إطفاء الموقد وإخراج الأنابيب إلى الحامل بالترتيب',
        p: 'أطفئ موقد لهب واستخدم ماسك أنبوبة الاختبار لتُخرج الأنابيب بحرص، ثم ضعها في حامل الأنابيب بالترتيب المبيّن في الشكل ٢-١ أدناه. (كتاب الأنشطة ص ٧١)',
        seq: seqOut(),
        pills: [['ماسك أنبوبة الاختبار', GRY, s => V(s.hx, s.hy, s.hz + 1.0), 150, -40], ['حامل الأنابيب', GLD, () => V(HOME_X(7) - 0.8, 0.55, 0), -110, 50]] },
      { t: 'تسجيل الألوان',
        p: 'سجّل ألوان أنابيب الاختبار إمّا عبر التقاط صورة لحامل أنابيب الاختبار ولصقها في كتاب النشاط، أو عبر تلوين الأنابيب، كما في الشكل ٢-١ الوارد في قسم النتائج أدناه، بالألوان المناسبة. (كتاب الأنشطة ص ٧١)',
        seq: [[{ '!fo': 1, zoom: 2.2 }, 900]],
        pills: colourPills },
      { t: 'مقارنة المحلول المجهول بالألوان المعياريَّة',
        p: 'قارن لون المحلول المجهول بألوان معياريّة معروفة، محدّدًا تركيز اللون المعياري الأكثر تشابهًا مع لون المحلول. إذا لم يكن اللون مطابقًا تمامًا، فابحث عن ألوان المحاليل ذات التركيز الأعلى والأدنى، الأمر الذي يساعد على اقتراح النطاق الذي يقع فيه التركيز. (كتاب الأنشطة ص ٧١)',
        seq: [[{ u: 1 }, 1400], [{ zoom: 1.6 }, 700]],
        pills: [['المحلول المجهول: بين ' + L('0.1%') + ' و' + L('0.01%'), PUR, tubeTop(7), 0, -165], [L('0.1%'), GRY, tubeTop(3), 110, -50], [L('0.01%'), GRY, tubeTop(4), -110, -50]] },
    ],
    parts, glassMat, isLow, geom: { HOME_Y, TUBE_H, BATH_TOP, LIFT_Y },
    setup,
    rebuild(s, ctx) {},
    place, focus, idle,
  };
})();
