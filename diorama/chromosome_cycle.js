/* ديوراما: الكروموسوم ودورة الخليَّة — الدرسان ٤-١ و٤-٢ (كتاب الطالب ص ١٢٨–١٣٠، والتيلوميرات ص ١٣٧) */
(function () {
  const { V, sm, M, CSS } = DioramaCore;
  const { BLU, RED, GLD, TEAL, PNK, GRY, GRN, ORG, PUR } = CSS;
  const L = s => `<span class="ltr">${s}</span>`;
  const G1 = L('G<sub>1</sub>'), G2 = L('G<sub>2</sub>');
  const cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const D2R = Math.PI / 180;
  let S;
  // ── التخطيط: الخليَّة والكروموسوم يساراً، حلقة دورة الخليَّة يميناً ─────────────────
  const CX = -5.0, CZ = -0.6;                       // مركز الخليَّة
  const YB = 1.35, YT = 6.25, UC = 0.6;             // طرفا الكروموسوم وموضع السنترومير (من الأسفل)
  const RX = 6.3, RZ = -0.1, R = 3.7, YR = -0.3, TH = 0.35;   // حلقة دورة الخليَّة
  // زوايا الأطوار (بالدرجات، باتجاه عقارب الساعة من الأعلى) بنسب الشكل ٤-٢
  const PH = { m: [0, 70], c: [70, 79], g1: [79, 281], s: [281, 301], g2: [301, 360] };
  const RCOL = { g1: 0xF2A3AE, s: 0xD9536F, g2: 0xF7C9D0, m: 0x9CCFF0, c: 0xF5D547 };
  const DIVX = 2.6;                                  // بُعد الخليَّتين الناتجتَين عن المركز
  // ── أشرطة الكروموسوم: تيلومير، جينات، سنترومير، جينات، تيلومير (متطابقة في الكروماتيدَين) ──────
  const TELC = 0xE0409A, CENC = 0x6B7684;
  const GENEC = [0xF2C94C, 0x2FA866, 0x8E5BD9, 0xE4572E, 0x2C7BE5, 0x12A5A0, 0xF08C2E];
  const matGene = GENEC.map(c => M(c, { roughness: 0.5 })), matTel = M(TELC, { roughness: 0.4 }), matCen = M(CENC, { roughness: 0.5 });
  const BANDS = []; (function () {
    let u = 0; BANDS.push([0, 0.035, matTel]); u = 0.035;
    [0.07, 0.05, 0.06, 0.04, 0.07, 0.05, 0.06, 0.05, 0.07].forEach((w, i) => { BANDS.push([u, u + w, matGene[i % 7]]); u += w; });
    BANDS.push([u, u + 0.09, matCen, 'cen']); u += 0.09;
    [0.06, 0.05, 0.07, 0.04, 0.05, 0.05].forEach((w, i) => { BANDS.push([u, u + w, matGene[(i + 3) % 7]]); u += w; });
    BANDS.push([u, 1, matTel]);
  })();
  const matDNA = M(0x33456B, { roughness: 0.4 }), matHis = M(0xB07AA1, { roughness: 0.45 });
  const W0 = 0, W1 = 1;                              // مدى عرض الهستونات على الخيط (الخيط كلُّه)
  // ── مسار الكروموسوم: خيط كروماتين متعرِّج (الطور البيني) ⇄ عمود مكثَّف (قبل الانقسام) ─────────
  function base(u) {
    const amp = 0.3 + 1.0 * Math.sin(Math.PI * u);
    const pi = V(CX + amp * Math.sin(2 * Math.PI * 3.1 * u + 0.4), YB + (YT - YB) * u + 0.3 * Math.sin(2 * Math.PI * 4.5 * u), CZ + amp * 0.85 * Math.cos(2 * Math.PI * 2.5 * u));
    const pc = V(CX, YB + (YT - YB) * u, CZ);
    return pi.lerp(pc, sm(S.cd));
  }
  const tang = u => base(Math.min(1, u + 0.004)).sub(base(Math.max(0, u - 0.004))).normalize();
  const Q = V(1, 0, -0.36).normalize();             // اتجاه الفصل بين الكروماتيدَين (نحو يمين الشاشة)
  const sepMax = () => lerp(0.36, 1.02, sm(S.cd));
  const reach = () => Math.min(1, S.rep * 1.12);    // مدى ما نُسخ من الخيط
  const sepLoc = u => sepMax() * sm(cl((S.rep * 1.12 - u) / 0.1));
  const pinch = u => 1 - 0.72 * Math.exp(-Math.pow((u - UC) / 0.05, 2));
  function P(u, s) {                                 // s = −1 الكروماتيد الأصلي، +1 النسخة
    const b = base(u), T = tang(u), d = Q.clone().sub(T.clone().multiplyScalar(T.dot(Q)));
    if (d.length() < 0.2) d.set(0, 0, 1); d.normalize();
    const o = d.multiplyScalar(s * 0.5 * sepLoc(u) * pinch(u)).lerp(V(s * DIVX, 0, 0), sm(S.sp));
    return b.add(o);
  }
  const rad = () => lerp(0.1, 0.4, sm(S.cd));
  let ctx_, HEL = [], BEAD = [];
  // أنبوب الكروماتيد: هندسة واحدة بألوان الرؤوس (أشرطة حادَّة الحدود) ونصف قطر متغيِّر (تضيُّق السنترومير)
  const matVC = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.5, metalness: 0.04 });
  const rAt = u => rad() * (1 - sm(S.hz)) * (1 - 0.42 * sm(S.cd) * Math.exp(-Math.pow((u - UC) / 0.045, 2)));
  function vtube(sm_) {                              // sm_: [{u, col}] بالترتيب
    const n = sm_.length; if (n < 2) return;
    const RS = 14, pos = [], nor = [], col = [], idx = [], P_ = sm_.map(q => P(q.u, q.s));
    let N0 = null;
    for (let i = 0; i < n; i++) {
      const T = P_[Math.min(n - 1, i + 1)].clone().sub(P_[Math.max(0, i - 1)]); if (T.length() < 1e-6) T.set(0, 1, 0); T.normalize();
      if (!N0) { N0 = Math.abs(T.y) < 0.9 ? V(0, 1, 0) : V(1, 0, 0); }
      const Nn = N0.clone().sub(T.clone().multiplyScalar(T.dot(N0))); if (Nn.length() < 1e-4) Nn.set(1, 0, 0); Nn.normalize(); N0 = Nn;
      const B = T.clone().cross(Nn), r = rAt(sm_[i].u), c = sm_[i].col;
      for (let j = 0; j <= RS; j++) {
        const th = j / RS * Math.PI * 2, d = Nn.clone().multiplyScalar(Math.cos(th)).addScaledVector(B, Math.sin(th));
        pos.push(P_[i].x + d.x * r, P_[i].y + d.y * r, P_[i].z + d.z * r); nor.push(d.x, d.y, d.z); col.push(c.r, c.g, c.b);
      }
    }
    for (let i = 0; i < n - 1; i++) for (let j = 0; j < RS; j++) { const a = i * (RS + 1) + j, b = a + RS + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.setIndex(idx);
    const o = new THREE.Mesh(g, matVC); o.castShadow = true; o.userData.own = true; ctx_.dyn.add(o);
    const m0 = BANDS.find(B => sm_[0].u >= B[0] - 1e-9 && sm_[0].u <= B[1] + 1e-9)[2], m1 = BANDS.slice().reverse().find(B => sm_[n - 1].u >= B[0] - 1e-9 && sm_[n - 1].u <= B[1] + 1e-9)[2];
    ctx_.ball(P_[0], rAt(sm_[0].u) * 0.99, m0); ctx_.ball(P_[n - 1], rAt(sm_[n - 1].u) * 0.99, m1);   // إغلاق الطرفين
  }
  function chromatid(s, u1, skip) {
    const parts = skip ? [[0, W0], [W1, u1]] : [[0, u1]];
    for (const [pa, pb] of parts) {
      const smp = [];
      for (const [a, b, mat] of BANDS) {
        const lo = Math.max(a, pa), hi = Math.min(b, pb); if (hi - lo < 1e-4) continue;
        const k = Math.max(1, Math.ceil((hi - lo) / 0.006));
        for (let q = 0; q <= k; q++) smp.push({ u: lo + (hi - lo) * q / k, s, col: mat.color });
      }
      vtube(smp);
    }
  }
  // الكروماتين مكبَّراً: كرات هستون يلتفُّ حولها خيط DNA
  function chromatin(k) {
    const N = 160, pts = [], acc = [0];
    for (let i = 0; i <= N; i++) { pts.push(P(W0 + (W1 - W0) * i / N, -1)); if (i) acc.push(acc[i - 1] + pts[i].distanceTo(pts[i - 1])); }
    const len = acc[N], at = s => { let i = 1; while (i < N && acc[i] < s) i++; const f = (s - acc[i - 1]) / Math.max(1e-6, acc[i] - acc[i - 1]); return [pts[i - 1].clone().lerp(pts[i], f), pts[i].clone().sub(pts[i - 1]).normalize()]; };
    BEAD = []; HEL = [];
    const SP = 0.6, RH = 0.25;                        // تباعد الهستونات، نصف قطر التفاف DNA حولها
    for (let s = SP / 2; s < len; s += SP) { const [p] = at(s); BEAD.push(p); ctx_.ball(p, 0.2 * k, matHis); }
    let Nv = V(0, 1, 0);
    for (let s = 0; s <= len; s += 0.035) {
      const [p, T] = at(s); let n = Nv.clone().sub(T.clone().multiplyScalar(T.dot(Nv))); if (n.length() < 0.1) n = V(1, 0, 0).sub(T.clone().multiplyScalar(T.x)); n.normalize(); Nv = n;
      const f = (s / SP) % 1, w = cl((f - 0.15) / 0.7), rr = RH * k * sm(cl((f - 0.04) / 0.14)) * sm(cl((0.96 - f) / 0.14));   // التفاف حول الهستون ثمَّ وصلة قصيرة
      const B = T.clone().cross(n), th = (Math.floor(s / SP) + w) * 2 * Math.PI * 1.7;
      HEL.push(p.clone().addScaledVector(n, Math.cos(th) * rr).addScaledVector(B, Math.sin(th) * rr));
    }
    ctx_.tubePts(HEL, 0.045 * Math.max(0.05, k), matDNA);
  }
  // ── الحلقة ────────────────────────────────────────────────────────────────
  const SEC = {}; let ptr, ptrTip, cell, d1, d2, nuc, n1, n2;
  const ringPt = (phi, rf, k) => { const h = k ? 0.55 * S[k] : 0; return V(RX + R * rf * Math.sin(phi * D2R), YR + TH + h + 0.02, RZ - R * rf * Math.cos(phi * D2R)); };
  const midPh = k => (PH[k][0] + PH[k][1]) / 2;
  function letterTex(main, sub) {
    const c = document.createElement('canvas'); c.width = 256; c.height = 256; const g = c.getContext('2d');
    g.fillStyle = '#1F2937'; g.textBaseline = 'middle'; g.font = 'bold 170px Arial';
    const w1 = g.measureText(main).width; g.font = 'bold 96px Arial'; const w2 = sub ? g.measureText(sub).width : 0;
    const x0 = 128 - (w1 + w2) / 2; g.font = 'bold 170px Arial'; g.fillText(main, x0, 120); if (sub) { g.font = 'bold 96px Arial'; g.fillText(sub, x0 + w1 + 4, 175); }
    const t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; t.anisotropy = 4; return t;
  }
  // ── جُزيئات السيتوبلازم: RNA وإنزيمات وبروتينات (G1)، تيوبيولين (G2) ───────────────────
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const CELL = { y: 3.45, sx: 4.6, sy: 4.15, sz: 4.0 }, NUC = { y: 3.8, sx: 2.35, sy: 3.05, sz: 2.2 };
  const GP = [], TB = [];
  function spot() {
    for (;;) {
      const u = V(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1); if (u.length() > 1 || u.length() < 0.2) continue; u.normalize();
      const r = 0.6 + 0.26 * rnd(), p = V(u.x * CELL.sx * r, u.y * CELL.sy * r, u.z * CELL.sz * r);
      if (CELL.y + p.y * 0.84 < 0.45) continue;
      const q = V(p.x * 0.84, CELL.y + p.y * 0.84 - NUC.y, p.z * 0.84);
      if ((q.x / NUC.sx) ** 2 + (q.y / NUC.sy) ** 2 + (q.z / NUC.sz) ** 2 < 1.25) continue;
      return p;
    }
  }
  const cellK = () => 0.84 + 0.16 * S.gr;
  const cellPos = p => V(CX + p.x * cellK(), CELL.y + p.y * cellK(), CZ + p.z * cellK());
  const mid = (a, b) => a.clone().lerp(b, 0.5);

  window.DIORAMA = {
    id: 'chromosome_cycle', title: 'الكروموسوم ودورة الخليَّة', subtitle: 'الأحياء — الصف الحادي عشر — الوحدة الرابعة: دورة الخليَّة والانقسام المتساوي',
    source: 'النص من كتاب الطالب: ٤-١ النمو والتكاثر ودور الكروموسومات (ص ١٢٨–١٢٩)، ٤-٢ دورة الخليّة (ص ١٣٠–١٣١)، ٤-٤ دور التيلوميرات (ص ١٣٧)، والشكلان ٤-١ و٤-٢',
    legend: [['#33456B', 'DNA', 'tube'], ['#B07AA1', 'هستونات', 'dot'], ['linear-gradient(90deg,#F2C94C,#2FA866,#8E5BD9,#E4572E,#2C7BE5)', 'جينات', 'tube'], ['#6B7684', 'سنترومير', 'dot'], ['#E0409A', 'تيلومير', 'dot'], null,
             ['#F08C2E', 'RNA', 'tube'], ['#12A5A0', 'إنزيمات', 'dot'], ['#8E6BBF', 'بروتينات أخرى', 'dot'], ['#6DBE6F', 'تيوبيولين', 'dot'], null,
             ['#F2A3AE', 'الطور البيني'], ['#9CCFF0', 'الانقسام المتساوي (M)'], ['#F5D547', 'انقسام السيتوبلازم']],
    camera: { VH: 16, center: [1.0, 2.2, 0], elevation: 34, azimuth: 14 },
    base: { L: 22.5, W: 11, x: 0.6 },
    BASE: { fo: 2, zoom: 1.6, ph: 79, g1: 0, s: 0, g2: 0, m: 0, c: 0, hz: 1, cd: 0, rep: 0, sp: 0, cy: 0, gr: 0, gp: 0, tb: 0 },
    noGeom: ['fo', 'ph', 'g1', 's', 'g2', 'm', 'c', 'cy', 'gr', 'gp', 'tb'],
    // نقطة التركيز: 0 المشهد، 1 الكروموسوم، 2 الكروماتين، 3 الحلقة، 4 الخليَّة والحلقة معاً
    focus(s) {
      S = s; const k = Math.round(S.fo || 0);
      if (k === 1) return V(CX - 1.4, 3.6, CZ);
      if (k === 2) return V(CX - 1.6, 3.7, CZ);
      if (k === 3) return V(RX, 0.6, RZ);
      if (k === 4) return V(0.0, 2.9, -0.3);
      return V(1.0, 2.2, 0);
    },
    STEPS: [
      { t: 'DNA والهستونات: الكروماتين',
        p: `تخزن معلومات كثيرة في ${L('DNA')}، لذا يجب أن يكون جُزيئًا طويلًا يرتكز على دعامات مكونة من جزيئات بروتين تسمى الهستونات ${L('Histones')}، والتي تمنع تشابك خيوط ${L('DNA')}. ويسمى التركيب من ${L('DNA')} والبروتينات الكروماتين، والذي تتكون منه الكروموسومات.`,
        n: 'للتوضيح يُرسم خيط DNA ملتفّاً حول الهستونات، ويُعرض كروموسوم واحد مكبَّراً داخل النواة.',
        seq: [[{ hz: 1 }, 600]],
        pills: [['DNA', BLU, () => HEL[Math.floor(HEL.length * 0.8)] || P(0.8, -1), 170, -40], ['الهستونات', PUR, () => BEAD[Math.floor(BEAD.length * 0.62)] || P(0.6, -1), 200, 40], ['الكروماتين', GLD, () => BEAD[Math.floor(BEAD.length * 0.93)] || P(0.95, -1), -150, -40]] },
      { t: 'دورة الخليَّة',
        p: `دورة الخليّة ${L('Cell cycle')}، عمليّة منضبطة بدقّة تحدث في جميع الخلايا، وتتضمّن: الطور البيني، والطور ${L('M')}، وانقسام السيتوبلازم. يشكل الطور البيني ${L('Interphase')} ${L('90 %')} من دورة الخلية، والذي يقسم إلى ثلاثة أطوار هي الطور ${G1} ${L('(first gap)')} والطور ${L('S (synthesis)')}، والطور ${G2} ${L('(second gap)')}.`,
        seq: [[{ '!fo': 0, zoom: 1, hz: 0 }, 1700], [{ g1: 1, s: 1, g2: 1 }, 900], [{ m: 1 }, 700], [{ c: 1 }, 600], [{ g1: 0, s: 0, g2: 0, m: 0, c: 0 }, 800]],
        pills: [['الطور البيني', PNK, () => ringPt(180, 0.9), -40, 95], ['الانقسام المتساوي', BLU, () => ringPt(30, 0.85), 60, -90], ['انقسام السيتوبلازم', GLD, () => ringPt(75, 1.0), 150, -20], [`طور ${L('S')}: تضاعف ${L('DNA')}`, RED, () => ringPt(291, 0.95), -150, -70], ['الكروماتين', GRY, () => P(0.5, -1), -150, -40]] },
      { t: 'الطور G1: الخليَّة تنمو',
        p: `أثناء الطور ${G1} تُكوِّن الخلية ${L('RNA')} والإنزيمات وبروتينات أخرى تحتاج إليها للنمو.`,
        seq: [[{ g1: 1 }, 600], [{ ph: 281, gr: 0.6, gp: 1 }, 3800]],
        pills: [[`الطور ${G1}`, PNK, () => ringPt(180, 0.62, 'g1'), 30, 100], [`${L('RNA')} والإنزيمات وبروتينات أخرى`, ORG, () => GP[3] ? GP[3].position.clone() : V(CX, 3, 0), -60, -110], ['الخليّة', GRY, () => cellPos(V(-0.72, 0.45, 0.5)), -110, 40]] },
      { t: 'الطور S: تضاعف DNA وتكوُّن كروماتيدَين',
        p: `وفي الطور ${L('S')} يتضاعف ${L('DNA')} في النواة، ليصبح كل كروموسوم مكونًا من كروماتيدَين متطابقَين. ويعود وجود كروماتيدَين في الكروموسوم إلى أن كل جُزيء ${L('DNA')} في النواة يكوّن نسخة مطابقة له أثناء الطور البيني، وهو المدّة المستغرقة بين انقسامَين متساويَين. ويُطلق على الكروماتيدَين المتطابقَين في كل كروموسوم اسم الكروماتيدَين الشقيقَين ${L('Sister chromatids')}.`,
        seq: [[{ g1: 0, s: 1 }, 600], [{ '!fo': 1, zoom: 1.45 }, 900], [{ rep: 1, ph: 301 }, 3400], [{ '!fo': 4, zoom: 1 }, 10], [{ zoom: 1.2 }, 900]],
        pills: [[`طور ${L('S')}: تضاعف ${L('DNA')}`, RED, () => ringPt(291, 0.8, 's'), 40, -95], ['كروماتيدان متطابقان', GLD, () => mid(P(0.3, -1), P(0.3, 1)), 190, 60]] },
      { t: 'الطور G2: الاستعداد للانقسام',
        p: `وأثناء الطور ${G2} تستمر الخليّة في النمو، ويجري تدقيق تركيب ${L('DNA')} الذي تكوّن أثناء طور ${L('S')}، وإصلاح أي خطأ فيه. كما تجري الاستعدادات للبدء بعمليّة الانقسام، على سبيل المثال: تحدث زيادة كبيرة في إنتاج بروتين تيوبيولين ${L('Tubulin')} اللازم لتكوين الأنيبيبات الدقيقة المكوّنة لخيوط المغزل.`,
        seq: [[{ s: 0, g2: 1 }, 800], [{ ph: 360, gr: 1, tb: 1 }, 3200]],
        pills: [[`الطور ${G2}`, PNK, () => ringPt(330, 0.7, 'g2'), -30, -100], [`تيوبيولين ${L('Tubulin')}`, GRN, () => TB[2] ? TB[2].position.clone() : V(CX, 3, 0), 60, -150], ['تستمر الخليّة في النمو', GRY, () => cellPos(V(-0.95, 0.05, 0.25)), -60, -70]] },
      { t: 'قبل الانقسام: الكروموسوم المزدوج والسنترومير',
        p: `قبل انقسام الخليّة حقيقيّة النواة، يصبح عددٌ من التراكيب الخيطيّة مرئيًا بشكل تدريجي في النواة، إذ تصطبغ بشدة بصبغات معيّنة. يكون الكروموسوم على هيئة تركيب مزدوج، ويتكوّن من تركيبَين متطابقَين مرتبطَين معًا هما الكروماتيدان ${L('Chromatids')}. وترتبط الكروماتيدات الشقيقة معًا في منطقة ضيقة تسمّى سنترومير، لتشكّل كروموسومًا واحدًا. ويمكن أن يوجد السنترومير في أيّة منطقة على امتداد الكروموسوم، وموقع السنترومير يميّز كل كروموسوم.`,
        n: 'عدد الكروموسومات سمة مميزة لنوع الكائن الحي. على سبيل المثال، يوجد في خلايا الإنسان 46 كروموسومًا (ص ١٢٨). للتوضيح يُعرض كروموسوم واحد كما في الشكل ٤-١.',
        seq: [[{ g2: 0, m: 1, ph: 363 }, 900], [{ zoom: 1 }, 600], [{ '!fo': 1, zoom: 1.5 }, 900], [{ cd: 1 }, 3400]],
        pills: [['السنترومير (يربط الكروماتيدَين معًا)', GRY, () => P(UC, 1), 230, -20], ['كروماتيدان متطابقان يكوّنان كروموسومًا واحدًا', GLD, () => P(0.22, 1), 250, 50], ['كروماتيد', GLD, () => P(0.85, -1), -150, -20], ['كروماتيد', GLD, () => P(0.85, 1), 150, -20]] },
      { t: 'الجينات والتيلوميرات',
        p: `${L('DNA')} هو جُزيء الوراثة، وهو يتكوّن من سلسلة من الجينات، بحيث كل جين يمثل وحدة وراثة واحدة. ويكون جُزيئا ${L('DNA')} في الكروماتيدَين الشقيقَين متطابقَين، الأمر الذي يعني أن الجينات على الكروماتيدين متطابقة أيضًا. تتمثل الوظيفة الرئيسيّة للتيلوميرات ${L('Telomeres')} في التأكد من شمول نهايات جزيء ${L('DNA')} في عمليّة تضاعفه، ومن دون أن تهمل. توجد التيلوميرات عند نهايات الكروموسومات، وقد تمّ تشبيهها بالأطراف البلاستيكيّة في نهايات رباط الحذاء.`,
        n: 'جينات لصفات مختلفة (في الواقع يتكوّن كل كروموسوم من عدة آلاف من الجينات). — الشكل ٤-١',
        seq: [[{ zoom: 1.75 }, 1000]],
        pills: [['جينات لصفات مختلفة', ORG, () => P(0.33, 1), 200, 20], ['تيلوميرات', PNK, () => P(1, -1).add(V(0, 0.35, 0)), -150, -30], ['تيلوميرات', PNK, () => P(0, 1).add(V(0, -0.3, 0)), 150, 30], ['السنترومير: لا توجد جينات في هذه المنطقة', GRY, () => P(UC, -1), -230, -40]] },
      { t: 'الطور M ثمَّ انقسام السيتوبلازم',
        p: `يحدث بعد الطور البيني الانقسام المتساوي، والذي يسمّى الطور ${L('M')} (تعود ${L('M')} إلى ${L('Mitosis')})، الذي به تنقسم المادة الوراثية لينتج نواتَين متطابقتَين جينيًا. بعد الطور ${L('M')} تخضع الخلية بأكملها للانقسام منتجة خليتين متطابقتين جينيًا. في الخلايا الحيوانيّة يتخصر غشاء سطح الخلية بين النواتَين الجديدتَين، مكونًا شقّ انقسام ${L('Cleavage furrow')} في وسط الخلية؛ تسمّى هذه العملية انقسام السيتوبلازم ${L('Cytokinesis')}.`,
        n: 'وعندما تنقسم الخليّة، ينتقل كروماتيد واحد إلى خليّة ناتجة، في حين ينتقل الكروماتيد الآخر إلى الخليّة الناتجة الأخرى، لتكون الخليّتان الناتجتان متطابقتَين (ص ١٢٩). تفاصيل أطوار الانقسام المتساوي في ديوراما مستقلَّة.',
        seq: [[{ '!fo': 0, zoom: 1 }, 1000], [{ ph: 430, sp: 1, gp: 0, tb: 0 }, 2800], [{ m: 0, c: 1 }, 500], [{ ph: 439, cy: 1 }, 2400]],
        pills: [['الانقسام المتساوي', BLU, () => ringPt(35, 0.8), 70, -95], ['انقسام السيتوبلازم', GLD, () => ringPt(75, 0.95, 'c'), 150, -10], ['شقّ انقسام', RED, () => V(CX, 6.6, CZ + 0.3), 0, -60], ['خليّة ناتجة', GRY, () => V(CX - DIVX - 1.8, 4.6, CZ + 1.2), -60, -80], ['خليّة ناتجة', GRY, () => V(CX + DIVX + 1.6, 4.6, CZ + 1.2), 60, -80]] },
    ],
    setup(ctx) {
      ctx_ = ctx; const scene = ctx.scene;
      // الحلقة: قطاعات بنسب الشكل ٤-٢، كلُّ قطاع في مجموعة تُرفع عند تمييزه
      for (const k in PH) {
        const [p0, p1] = PH[k], g = new THREE.Group(); g.position.set(RX, YR, RZ); scene.add(g);
        const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.absarc(0, 0, R, (90 - p1 + 0.4) * D2R, (90 - p0 - 0.4) * D2R, false); sh.lineTo(0, 0);
        const geo = new THREE.ExtrudeGeometry(sh, { depth: TH, bevelEnabled: false, curveSegments: 72 }); geo.rotateX(-Math.PI / 2);
        ctx.mesh(geo, M(RCOL[k], { roughness: 0.6 }), null, g);
        const lab = { g1: ['G', '1', 1.7, 0.6], s: ['S', '', 0.85, 0.8], g2: ['G', '2', 1.25, 0.66], m: ['M', '', 1.35, 0.62] }[k];
        if (lab) {
          const pl = new THREE.Mesh(new THREE.PlaneGeometry(lab[2], lab[2]), new THREE.MeshBasicMaterial({ map: letterTex(lab[0], lab[1]), transparent: true, depthWrite: false }));
          pl.geometry.rotateX(-Math.PI / 2); const ph = (p0 + p1) / 2 * D2R; pl.position.set(R * lab[3] * Math.sin(ph), TH + 0.012, -R * lab[3] * Math.cos(ph)); g.add(pl);
        }
        SEC[k] = g;
      }
      // المؤشِّر: عقرب يدور فوق الحلقة
      ptr = new THREE.Group(); ptr.position.set(RX, YR + TH + 0.85, RZ); scene.add(ptr);
      const mPtr = M(0x1F2937, { roughness: 0.4 }), mTip = M(0xC8102E, { roughness: 0.35 });
      const rodG = new THREE.CylinderGeometry(0.09, 0.09, R * 0.9, 12); rodG.rotateX(Math.PI / 2); ctx.mesh(rodG, mPtr, V(0, 0, -R * 0.45), ptr);
      const cone = new THREE.ConeGeometry(0.26, 0.6, 20); cone.rotateX(-Math.PI / 2); ctx.mesh(cone, mTip, V(0, 0, -R * 0.93), ptr);
      ctx.mesh(new THREE.SphereGeometry(0.28, 20, 14), mPtr, V(0, 0, 0), ptr);
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.9, 10), mPtr); post.position.set(RX, YR + TH + 0.4, RZ); scene.add(post);
      ptrTip = new THREE.Object3D(); ptrTip.position.set(0, 0, -R * 0.95); ptr.add(ptrTip);
      // الخليَّة والنواة (وخليَّتان ونواتان ناتجتان)
      cell = ctx.blob(0xF2DCC8, 0.17); d1 = ctx.blob(0xF2DCC8, 0.17); d2 = ctx.blob(0xF2DCC8, 0.17);
      nuc = ctx.blob(0xA9C4F0, 0.15); n1 = ctx.blob(0xA9C4F0, 0.22); n2 = ctx.blob(0xA9C4F0, 0.22);
      // جُزيئات G1: RNA (عصيّ برتقاليّة)، إنزيمات (تركوازي)، بروتينات أخرى (بنفسجي)
      const mR = M(0xF08C2E, { roughness: 0.45 }), mE = M(0x12A5A0, { roughness: 0.4 }), mP = M(0x8E6BBF, { roughness: 0.45 });
      const gR = new THREE.CylinderGeometry(0.07, 0.07, 0.6, 8), gE = new THREE.SphereGeometry(0.17, 14, 10), gP = new THREE.SphereGeometry(0.14, 14, 10);
      for (let i = 0; i < 30; i++) {
        const t = i % 3, o = new THREE.Mesh(t === 0 ? gR : t === 1 ? gE : gP, t === 0 ? mR : t === 1 ? mE : mP);
        o.castShadow = true; o.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3); o.userData.p = spot(); o.userData.ph = rnd() * 6; scene.add(o); GP.push(o);
      }
      // ثنائيَّات التيوبيولين
      const mT1 = M(0x6DBE6F, { roughness: 0.4 }), mT2 = M(0x2E8B57, { roughness: 0.4 }), gT = new THREE.SphereGeometry(0.13, 12, 9);
      for (let i = 0; i < 20; i++) {
        const g = new THREE.Group(); const a = new THREE.Mesh(gT, mT1), b = new THREE.Mesh(gT, mT2); a.position.x = -0.12; b.position.x = 0.12; a.castShadow = b.castShadow = true; g.add(a, b);
        g.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3); g.userData.p = spot(); g.userData.ph = rnd() * 6; scene.add(g); TB.push(g);
      }
    },
    rebuild(s, ctx) {
      S = s; ctx_ = ctx;
      if (S.hz < 0.97) chromatid(-1, 1, false);
      if (S.hz > 0.02 && S.rep <= 0) chromatin(sm(S.hz)); else { HEL = []; BEAD = []; }
      if (S.rep > 0.001) chromatid(1, reach(), false);
    },
    place(s) {
      S = s;
      for (const k in SEC) { const h = S[k] || 0, g = SEC[k]; g.position.y = YR + 0.55 * h; g.scale.set(1 + 0.05 * h, 1, 1 + 0.05 * h); }
      ptr.rotation.y = -S.ph * D2R;
      // الخليَّة: تنمو في G1 وG2، ثمَّ تنقسم إلى خليَّتين (انقسام السيتوبلازم)
      const k = cellK(), cy = sm(S.cy), sp = sm(S.sp);
      const one = (o, vis, p, sx, sy, sz) => { o.visible = vis > 0.02; o.material.opacity = o.userData.op * vis; o.position.copy(p); o.scale.set(sx, sy, sz); };
      one(cell, 1 - sm(cy / 0.3), V(CX, CELL.y, CZ), CELL.sx * k, CELL.sy * k, CELL.sz * k);
      const dx = lerp(1.0, DIVX, cy), dsx = lerp(3.7, 2.75, cy), dsy = lerp(4.15, 3.85, cy), dsz = lerp(4.0, 3.45, cy), dv = sm(cy / 0.3);
      one(d1, dv, V(CX - dx, CELL.y, CZ), dsx, dsy, dsz); one(d2, dv, V(CX + dx, CELL.y, CZ), dsx, dsy, dsz);
      // النواة الأمُّ تختفي أثناء الطور M، وتظهر نواتان حول الكروماتيدَين المنفصلَين
      one(nuc, 1 - sm(S.sp / 0.4), V(CX, NUC.y, CZ), NUC.sx, NUC.sy, NUC.sz);
      const nv = sm((S.sp - 0.6) / 0.4);
      one(n1, nv, V(CX - DIVX, NUC.y, CZ), 1.35, 3.0, 1.4); one(n2, nv, V(CX + DIVX, NUC.y, CZ), 1.35, 3.0, 1.4);
      GP.forEach((o, i) => { const v = cl(S.gp * 1.6 - (i % 10) * 0.06); o.visible = v > 0.02; o.position.copy(cellPos(o.userData.p)); o.scale.setScalar(Math.max(0.001, sm(v))); });
      TB.forEach((o, i) => { const v = cl(S.tb * 1.6 - (i % 10) * 0.06); o.visible = v > 0.02; o.position.copy(cellPos(o.userData.p)); o.scale.setScalar(Math.max(0.001, sm(v))); });
    },
    idle(t, s) {
      GP.forEach(o => { if (o.visible) { o.position.y = cellPos(o.userData.p).y + Math.sin(t * 1.4 + o.userData.ph) * 0.08; o.rotation.y += 0.006; } });
      TB.forEach(o => { if (o.visible) { o.position.y = cellPos(o.userData.p).y + Math.sin(t * 1.2 + o.userData.ph) * 0.08; o.rotation.x += 0.008; } });
    },
  };
})();
