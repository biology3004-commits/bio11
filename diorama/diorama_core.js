/* ديوراما تعليميَّة — المحرِّك المشترك
 * مشهد three.js بمنظور أيزومتري (ارتفاع 45° وسمت 45°)، وآلة خطوات تُحرِّك حالةً عدديَّة S بالنقر،
 * وتسميات (pills) تتبع نقاطاً في المشهد، ولوحة نصٍّ لكل خطوة.
 *
 * تعريف الديوراما (window.DIORAMA):
 *   id, title, subtitle, source          نصوص الترويسة والمصدر
 *   legend: [[لون, نص, 'box'|'tube'|'dot'], ...]   مفتاح الألوان (صفوف تُفصل بـ null)
 *   camera: { VH, center:[x,y,z], elevation:45, azimuth:45 }  ارتفاع مجال الرؤية ومركز النظر وزاويتا الكاميرا بالدرجات (اختياري)
 *   المفتاحان المحجوزان S.el و S.az (بالدرجات) يغيِّران الزاوية مع الخطوة إن وُجدا في الحالة: [{ el: 25 }, 1200]
 *   base: { L, W } أو false              قاعدة الديوراما الخشبيَّة (اختياري)
 *   BASE: {...}                          الحالة الابتدائيَّة (مفاتيح عدديَّة فقط)
 *   noGeom: [...]                        مفاتيح لا تستدعي إعادة بناء الهندسة عند تغيُّرها
 *   STEPS: [{ t, p, n?, seq: [[delta, ms], ...], pills: [[نص, لون, S=>Vector3, dx, dy], ...] }]
 *          delta: { key: value } ؛ المفتاح المسبوق بـ "!" يُضبط فوراً دون تحريك
 *   setup(ctx)                           إنشاء الكائنات الدائمة (مرَّة واحدة)
 *   rebuild(S, ctx)                      بناء الهندسة المتغيِّرة داخل ctx.dyn (تُفرَّغ قبل النداء)
 *   place(S, ctx)                        تحريك الكائنات الدائمة بحسب S
 *   ends(S, ctx) => [[Vector3, نص], ...] علامات الأطراف (5′/3′) (اختياري)
 *   idle(t, S, ctx)                      حركة خفيفة مستمرَّة (اختياري)
 *   focus(S, ctx) => Vector3             نقطة التركيز التي تقترب منها الكاميرا حين S.zoom > 1 (اختياري)
 *   المفتاح المحجوز S.zoom (الافتراضي 1): معامل تقريب الكاميرا؛ يُحرَّك في seq مثل أيِّ مفتاح: [{ zoom: 2.4 }, 900] ثم [{ zoom: 1 }, 800]
 *
 * التشغيل التلقائي (زرُّ «▶ تلقائي» أو مفتاح P أو الرسالة dioramaCmd:'auto'): يعرض الخطوات تباعاً بمهلة تُحسب من طول نصِّ كل خطوة
 *   (6–18 ثانية × ?pace=) ثم يعود إلى البداية؛ أيُّ تنقُّل يدوي يعيد العدَّ دون إيقافه. ?auto=1 يبدأه مع التحميل.
 */
window.DioramaCore = (function () {
  const W = 1600, H = 900;
  const Q = new URLSearchParams(location.search);
  const isPhone = () => Q.has('m') ? Q.get('m') === '1' : (matchMedia('(max-width: 700px)').matches && !Q.has('shot'));
  let PHONE = isPhone();
  const SHOT = Q.has('shot');
  const LOW = !SHOT && (PHONE || matchMedia('(pointer: coarse)').matches);   // الهواتف والأجهزة اللوحيَّة: أخفُّ رسم وأقلُّ إطارات
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  const sm = t => { t = Math.min(1, Math.max(0, t)); return t * t * (3 - 2 * t); };
  const ease = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const M = (c, o = {}) => { const m = new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.55, metalness: 0.04 }, o)); m.color.convertSRGBToLinear(); return m; };
  const gCyl = new THREE.CylinderGeometry(1, 1, 1, 12), gSph = new THREE.SphereGeometry(1, 16, 12), UP = V(0, 1, 0);

  let ctx, D, S, step = 0, busy = false, queue = [], tw = null, pills = [], renderer, cam, scene;
  let CAM0 = { VH: 22.5, C: null }, camZ = -1, camC = null;
  let dEl = 0, dAz = 0;                                                // تدوير يدوي أثناء العرض (بالراديان)
  let auto = false, autoT0 = null, autoMs = 0;                         // التشغيل التلقائي: مؤقِّت الانتظار بعد كل خطوة
  const PACE = Q.has('pace') ? Math.min(4, Math.max(0.3, +Q.get('pace') || 1)) : 1;
  // الرسم عند الحاجة: لا يُعاد رسم المشهد إلَّا إذا تغيَّر شيء (حركة، كاميرا، خطوة، حجم)
  let dirty = true, shadowDirty = true, onScreen = true, lastFrame = 0, lastIdle = 0, lastRender = 0, lastShadow = 0, curRatio = 0;
  const IDLE_MS = LOW ? 50 : 33, TWEEN_MS = LOW ? 30 : 0, BEAT_MS = 2000, SHADOW_IDLE_MS = 500;

  function rod(a, b, r, mat, parent) {
    const d = new THREE.Vector3().subVectors(b, a), L = d.length(); if (L < 1e-4) return null;
    const o = new THREE.Mesh(gCyl, mat); o.scale.set(r, L, r); o.position.copy(a).addScaledVector(d, 0.5);
    o.quaternion.setFromUnitVectors(UP, d.normalize()); o.castShadow = true; (parent || ctx.dyn).add(o); return o;
  }
  function ball(p, r, mat, parent) { const o = new THREE.Mesh(gSph, mat); o.scale.setScalar(r); o.position.copy(p); o.castShadow = true; (parent || ctx.dyn).add(o); return o; }
  function tubePts(pts, r, mat, parent) {
    if (pts.length < 2) return null;
    const o = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), Math.max(4, pts.length * 3), r, 10, false), mat);
    o.castShadow = true; o.userData.own = true; (parent || ctx.dyn).add(o); return o;
  }
  function tube(f, x0, x1, r, mat, parent) {       // أنبوب على طول دالَّة f(x) بين x0 و x1
    if (x1 - x0 < 0.12) return null;
    const n = Math.max(2, Math.ceil((x1 - x0) / 0.14)), pts = [];
    for (let k = 0; k <= n; k++) pts.push(f(x0 + (x1 - x0) * k / n));
    return tubePts(pts, r, mat, parent);
  }
  function blob(col, op, parent) {
    const m = new THREE.MeshStandardMaterial({ color: col, transparent: true, opacity: op, roughness: 0.25, depthWrite: false }); m.color.convertSRGBToLinear();
    const o = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 22), m); o.userData.op = op; (parent || scene).add(o); return o;
  }
  // زوج قواعد: نصف من p ونصف من q مع روابط هيدروجينيَّة (2 لـ A–T/A–U، 3 لـ G–C) حين partner=true
  function pair(p, q, matP, matQ, nH, partner, parent) {
    const mid = p.clone().lerp(q, 0.5), d = new THREE.Vector3().subVectors(q, p).normalize(), gap = 0.07;
    rod(p, mid.clone().addScaledVector(d, -gap), 0.115, matP, parent);
    if (!partner) return;
    rod(mid.clone().addScaledVector(d, gap), q, 0.115, matQ, parent);
    const side = Math.abs(d.x) > 0.7 ? V(0, 0, 1) : V(1, 0, 0);
    for (let k = 0; k < nH; k++) ball(mid.clone().addScaledVector(side, (k - (nH - 1) / 2) * 0.115), 0.05, ctx.matH, parent);
  }

  function setupScene() {
    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gl'), antialias: !LOW, alpha: true, preserveDrawingBuffer: SHOT });
    applyRes(); if (!curRatio) { curRatio = LOW ? 1 : Math.min(devicePixelRatio, 2); renderer.setPixelRatio(curRatio); }
    renderer.setSize(W, H, false);
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = LOW ? THREE.PCFShadowMap : THREE.PCFSoftShadowMap; renderer.shadowMap.autoUpdate = false;
    renderer.outputEncoding = THREE.sRGBEncoding;
    scene = new THREE.Scene();
    const c = Object.assign({}, D.camera || {}); if (Q.has('el')) c.elevation = +Q.get('el'); if (Q.has('az')) c.azimuth = +Q.get('az');
    const VH = c.VH || 22.5, VW = VH * W / H, C = V(...(c.center || [-0.6, 0.2, 0]));
    cam = new THREE.OrthographicCamera(-VW / 2, VW / 2, VH / 2, -VH / 2, 0.1, 200);
    const Dist = 40, EL = (c.elevation ?? 45) * Math.PI / 180, AZ = (c.azimuth ?? 45) * Math.PI / 180;
    cam.position.set(C.x + Dist * Math.cos(EL) * Math.sin(AZ), C.y + Dist * Math.sin(EL), C.z + Dist * Math.cos(EL) * Math.cos(AZ));
    cam.lookAt(C); cam.updateProjectionMatrix(); cam.updateMatrixWorld(true);
    CAM0 = { VH, C: C.clone(), Dist, EL, AZ };
    scene.add(new THREE.HemisphereLight(0xffffff, 0xaab6c4, 0.95));
    const sun = new THREE.DirectionalLight(0xffffff, 1.05); sun.position.set(-6, 22, 12); sun.castShadow = true;
    sun.shadow.mapSize.set(LOW ? 1024 : 2048, LOW ? 1024 : 2048); Object.assign(sun.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 1, far: 60 });
    sun.shadow.radius = 5; sun.shadow.bias = -0.0004; scene.add(sun);
    const fill = new THREE.DirectionalLight(0xffffff, 0.22); fill.position.set(14, 8, -6); scene.add(fill);
    if (D.base !== false) {
      const b = D.base || {}, BL = b.L || 21.5, BW = b.W || 11.5, bx = b.x || -0.6, bz = b.z || 0;
      const base = new THREE.Mesh(new THREE.BoxGeometry(BL, 0.7, BW), M(0xC9A27A, { roughness: 0.8 })); base.position.set(bx, -0.75, bz); base.receiveShadow = base.castShadow = true; scene.add(base);
      const top = new THREE.Mesh(new THREE.BoxGeometry(BL - 0.5, 0.12, BW - 0.5), M(0xF4F1EA, { roughness: 0.95 })); top.position.set(bx, -0.36, bz); top.receiveShadow = true; scene.add(top);
    }
    const dyn = new THREE.Group(); scene.add(dyn);
    ctx = { scene, dyn, cam, renderer, V, M, sm, ease, rod, ball, tube, tubePts, blob, pair, matH: M(0xffffff, { roughness: 0.3 }), Q,
            mesh: (g, m, p, parent) => { const o = new THREE.Mesh(g, m); if (p) o.position.copy(p); o.castShadow = o.receiveShadow = true; (parent || scene).add(o); return o; } };
  }

  // دقَّة لوحة الرسم بحسب حجمها الفعلي على الشاشة (المسرح 1600×900 يُصغَّر بـ transform، فلا فائدة من بكسلات لا تُرى)
  function applyRes() {
    if (!renderer) return;
    const shown = document.getElementById('gl').getBoundingClientRect().width; if (!SHOT && shown < 10) return;
    const dpr = Math.min(devicePixelRatio || 1, 2), r = SHOT ? 2 : Math.min(LOW ? 1.25 : 2, Math.max(0.6, shown * dpr / W));
    if (Math.abs(r - curRatio) < 0.05) return;
    curRatio = r; renderer.setPixelRatio(r); dirty = true;
  }

  // الكاميرا: التقريب نحو نقطة التركيز (مع تتبُّعها كل إطار) والعودة إلى الإطار الكامل
  function applyCamera() {
    const z = Math.max(0.5, S.zoom || 1);
    const w = Math.min(1, Math.max(0, (z - 1) / 0.5));                    // وزن الانتقال إلى نقطة التركيز
    const F = (w > 0 && D.focus) ? D.focus(S, ctx) : CAM0.C;
    const C = CAM0.C.clone().lerp(F, w);
    const EL = Math.min(1.45, Math.max(0.12, (S.el !== undefined ? S.el * Math.PI / 180 : CAM0.EL) + dEl)), AZ = (S.az !== undefined ? S.az * Math.PI / 180 : CAM0.AZ) + dAz;
    const key = z * 1e6 + EL * 1e3 + AZ;
    if (camC && camZ === key && camC.distanceToSquared(C) < 1e-8) return;
    camZ = key; camC = C.clone(); dirty = true;
    const VH = CAM0.VH / (z * (PHONE ? 1.35 : 1)), VW = VH * W / H;
    cam.left = -VW / 2; cam.right = VW / 2; cam.top = VH / 2; cam.bottom = -VH / 2;
    const { Dist } = CAM0;
    cam.position.set(C.x + Dist * Math.cos(EL) * Math.sin(AZ), C.y + Dist * Math.sin(EL), C.z + Dist * Math.cos(EL) * Math.cos(AZ));
    cam.lookAt(C); cam.updateProjectionMatrix(); cam.updateMatrixWorld(true);
    const lg = document.getElementById('legend'); if (lg) lg.style.opacity = z > 1.35 ? 0.18 : 1;
  }
  const proj = v => { const p = v.clone().project(cam); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H]; };
  function rebuild() { ctx.dyn.children.forEach(o => { if (o.userData.own) o.geometry.dispose(); }); ctx.dyn.clear(); D.rebuild(S, ctx); dirty = shadowDirty = true; }
  function setPills(k) {
    const box = document.getElementById('labels'); box.innerHTML = '';
    pills = (D.STEPS[k].pills || []).map(([txt, c, f, dx, dy]) => { const e = document.createElement('div'); e.className = 'pill'; e.style.setProperty('--c', c); e.innerHTML = txt; e.style.opacity = 0; box.appendChild(e); return { e, c, f, dx: dx || 0, dy: dy || 0 }; });
  }
  function drawOverlay(show) {
    let s = '';
    for (const p of pills) {
      const [ax, ay] = proj(p.f(S, ctx)); const px = Math.min(W - 150, Math.max(150, ax + p.dx)), py = Math.min(H - 30, Math.max(30, ay + p.dy));
      p.e.style.left = px + 'px'; p.e.style.top = py + 'px'; p.e.style.opacity = show ? 1 : 0;
      if (show) s += `<line x1="${px}" y1="${py}" x2="${ax}" y2="${ay}" stroke="${p.c}" stroke-width="2.6" stroke-linecap="round"/><circle cx="${ax}" cy="${ay}" r="6" fill="#fff" stroke="${p.c}" stroke-width="3"/>`;
    }
    for (const [v, t] of (D.ends ? D.ends(S, ctx) : [])) { const [x, y] = proj(v); s += `<circle cx="${x}" cy="${y}" r="15" fill="#1F2937"/><text x="${x}" y="${y + 6}" text-anchor="middle" font-family="Arial" font-weight="700" font-size="16" fill="#fff" direction="ltr">${t}</text>`; }
    document.getElementById('lines').innerHTML = s;
  }

  let END = [];
  function ui() {
    const st = D.STEPS[step];
    for (const pre of ['cap', 'mcap']) { document.getElementById(pre + 'K').textContent = `الخطوة ${step + 1} من ${D.STEPS.length}`; document.getElementById(pre + 'T').textContent = st.t; document.getElementById(pre + 'P').innerHTML = st.p; document.getElementById(pre + 'N').textContent = st.n || ''; }
    for (const id of ['dots', 'mdots']) [...document.getElementById(id).children].forEach((d, i) => d.className = i === step ? 'on' : (i < step ? 'done' : ''));
    for (const [n, p2] of [['bNext', 'bPrev'], ['mNext', 'mPrev']]) { document.getElementById(n).disabled = step >= D.STEPS.length - 1; document.getElementById(p2).disabled = step <= 0; }
    try { parent && parent !== window && parent.postMessage({ diorama: D.id, step: step }, '*'); } catch (e) {}
  }
  function settle() { S = Object.assign({}, END[step]); rebuild(); D.place(S, ctx); applyCamera(); drawOverlay(true); dirty = shadowDirty = true; }
  function go(k, animate) {
    if (k < 0 || k >= D.STEPS.length || busy) return;
    step = k; ui(); setPills(k); autoT0 = null; setBars(0);
    if (!animate) { settle(); return; }
    S = Object.assign({}, k ? END[k - 1] : D.BASE); queue = D.STEPS[k].seq.map(([d, ms]) => [d, ms]); busy = true; nextTween(performance.now());
  }
  function nextTween(now) {
    if (!queue.length) { busy = false; tw = null; settle(); return; }
    const [d, ms] = queue.shift(); const from = {}, to = {}; let hasGeom = false;
    for (const key in d) {
      if (key[0] === '!') { S[key.slice(1)] = d[key]; continue; }        // ضبط فوري
      from[key] = S[key]; to[key] = d[key]; if (!(D.noGeom || []).includes(key)) hasGeom = true;
    }
    tw = { to, from, ms: Math.max(1, ms), t0: now, hasGeom };
  }
  function frame(now) {
    requestAnimationFrame(frame);
    if (!onScreen || (TWEEN_MS && now - lastFrame < TWEEN_MS)) return;
    lastFrame = now;
    if (tw) {
      const u = Math.min(1, (now - tw.t0) / tw.ms), e = ease(u);
      for (const key in tw.to) S[key] = tw.from[key] + (tw.to[key] - tw.from[key]) * e;
      if (tw.hasGeom) rebuild(); D.place(S, ctx); applyCamera(); drawOverlay(false);
      dirty = shadowDirty = true;
      if (u >= 1) nextTween(now);
    }
    if (D.idle && !SHOT && (tw || now - lastIdle >= IDLE_MS)) { lastIdle = now; D.idle(now / 1000, S, ctx, !!tw); dirty = true; }
    if (!tw && D.focus && (S.zoom || 1) > 1) applyCamera();              // تتبُّع نقطة التركيز المتحرِّكة بالحركة الخفيفة
    if (auto && !tw) {                                                   // التشغيل التلقائي: انتظار يتناسب مع طول النص ثم الخطوة التالية (في التبويب المخفي يتوقَّف rAF فيتوقَّف العدُّ تلقائيّاً)
      if (autoT0 === null) { autoT0 = now; autoMs = autoDelay(step); }
      const u = (now - autoT0) / autoMs; setBars(Math.min(1, u));
      if (u >= 1) { autoT0 = null; if (step < D.STEPS.length - 1) go(step + 1, true); else go(0, false); }
    }
    if (!SHOT && !dirty && now - lastRender < BEAT_MS) return;
    if (SHOT || shadowDirty || (D.idle && now - lastShadow > SHADOW_IDLE_MS)) { renderer.shadowMap.needsUpdate = true; lastShadow = now; }
    renderer.render(scene, cam); dirty = shadowDirty = false; lastRender = now;
  }

  function autoDelay(k) {
    const st = D.STEPS[k], txt = (st.t + ' ' + st.p + ' ' + (st.n || '')).replace(/<[^>]+>/g, '');
    const ms = Math.min(18000, Math.max(6000, 3500 + txt.length * 70)) * PACE;
    return k === D.STEPS.length - 1 ? ms * 1.4 : ms;                     // الخطوة الأخيرة تبقى أطول قبل الإعادة
  }
  function setBars(u) { for (const id of ['abar', 'mabar']) { const b = document.getElementById(id); if (b) b.style.width = (u * 100) + '%'; } }
  function setAuto(on) {
    auto = !!on; autoT0 = null; setBars(0); document.body.classList.toggle('auto', auto);
    for (const id of ['bAuto', 'mAuto']) { const b = document.getElementById(id); if (b) { b.textContent = auto ? '⏸ إيقاف التلقائي' : '▶ تلقائي'; b.classList.toggle('on', auto); } }
    try { parent && parent !== window && parent.postMessage({ dioramaAuto: auto }, '*'); } catch (e) {}
  }
  function start(def) {
    D = def;
    if (Q.has('shot')) document.body.classList.add('shot');
    document.title = def.title; document.getElementById('tTitle').textContent = def.title; document.getElementById('tSub').textContent = def.subtitle || '';
    document.getElementById('src').textContent = def.source || '';
    const lg = document.getElementById('legendRows'); let row = null;
    (def.legend || []).forEach(it => {
      if (!it || !row) { row = document.createElement('div'); row.className = 'row'; lg.appendChild(row); if (!it) return; }
      const [col, txt, kind] = it; const sp = document.createElement('span');
      sp.innerHTML = `<i class="${kind || ''}" style="background:${col}"></i>${txt}`; row.appendChild(sp);
    });
    const stage = document.getElementById('stage');
    const setPhone = () => { PHONE = isPhone(); document.body.classList.toggle('phone', PHONE); document.documentElement.classList.toggle('phone', PHONE); };
    setPhone();
    const fit = () => {
      setPhone();
      if (PHONE) { const s = innerWidth / W; stage.style.transform = `scale(${s})`; const wrap = document.getElementById('wrap'); wrap.style.height = (H * s) + 'px'; wrap.style.overflow = 'hidden'; applyRes(); return; }
      const wrap = document.getElementById('wrap'); wrap.style.height = ''; wrap.style.overflow = '';
      const s = Math.min(innerWidth / W, innerHeight / H); stage.style.transform = `scale(${s})`;
      camZ = -1; if (S) { applyCamera(); drawOverlay(!tw); }
      applyRes();
    }; addEventListener('resize', fit); fit();
    // خارج الشاشة لا رسم ولا عدَّ للتشغيل التلقائي؛ وعند العودة يُعاد الرسم
    const wake = () => { dirty = shadowDirty = true; autoT0 = null; };
    if (!SHOT && 'IntersectionObserver' in window) new IntersectionObserver(es => { onScreen = es[es.length - 1].isIntersecting; if (onScreen) { applyRes(); wake(); } }).observe(document.documentElement);
    document.addEventListener('visibilitychange', wake); addEventListener('pageshow', wake);
    if (D.BASE.zoom === undefined) D.BASE.zoom = 1;
    D.noGeom = (D.noGeom || []).concat(['zoom', 'el', 'az']);
    setupScene(); D.setup(ctx);
    let cur = Object.assign({}, D.BASE); END = D.STEPS.map(st => { st.seq.forEach(([d]) => { for (const k in d) cur[k[0] === '!' ? k.slice(1) : k] = d[k]; }); return Object.assign({}, cur); });
    for (const id of ['dots', 'mdots']) { const dd = document.getElementById(id); D.STEPS.forEach(() => dd.appendChild(document.createElement('i'))); }
    document.getElementById('mNext').onclick = e => { e.stopPropagation(); go(step + 1, true); };
    document.getElementById('mPrev').onclick = e => { e.stopPropagation(); go(step - 1, false); };
    document.getElementById('bNext').onclick = e => { e.stopPropagation(); go(step + 1, true); };
    document.getElementById('bPrev').onclick = e => { e.stopPropagation(); go(step - 1, false); };
    document.getElementById('bReset').onclick = e => { e.stopPropagation(); go(0, false); };
    for (const id of ['bAuto', 'mAuto']) document.getElementById(id).onclick = e => { e.stopPropagation(); setAuto(!auto); };
    // السحب يدير المشهد (فأرة أو إصبع)؛ النقر دون سحب يتقدَّم؛ النقر المزدوج يعيد الزاوية الأصليَّة
    const gl = document.getElementById('gl'); let drag = null, moved = false;
    const redraw = () => { camZ = -1; applyCamera(); drawOverlay(!tw); };
    gl.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY, el: dEl, az: dAz }; moved = false; gl.setPointerCapture(e.pointerId); });
    gl.addEventListener('pointermove', e => {
      if (!drag) return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (Math.abs(dx) + Math.abs(dy) > 6) moved = true;
      if (moved) { dAz = drag.az - dx * 0.006; dEl = drag.el + dy * 0.006; redraw(); }
    });
    gl.addEventListener('pointerup', e => { if (drag && !moved) go(step + 1, true); drag = null; });
    gl.addEventListener('pointercancel', () => { drag = null; });
    gl.addEventListener('dblclick', e => { e.preventDefault(); dEl = 0; dAz = 0; redraw(); });
    gl.style.touchAction = 'none';
    // ملء الشاشة: داخل المنصَّة نطلب من الصفحة الأمِّ فتح «عرض في الصف» (طلب ملء الشاشة من داخل iframe يُرفض غالباً)؛ وفي نافذة مستقلَّة نطلبه مباشرة
    const inFrame = (() => { try { return window.parent && window.parent !== window; } catch (e) { return true; } })();
    const bFull = document.getElementById('bFull');
    bFull.onclick = e => {
      e.stopPropagation();
      if (inFrame) { try { parent.postMessage({ dioramaCmd: 'toggleFull' }, '*'); } catch (err) {} return; }
      const el = document.documentElement;
      const req = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen;
      if (document.fullscreenElement || document.webkitFullscreenElement) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      else if (req) { try { const r = req.call(el); if (r && r.catch) r.catch(() => {}); } catch (err) {} }
    };
    const syncFull = on => { bFull.textContent = on ? '✕ إغلاق ملء الشاشة' : '⛶ ملء الشاشة'; };
    ['fullscreenchange', 'webkitfullscreenchange'].forEach(ev => document.addEventListener(ev, () => syncFull(!!(document.fullscreenElement || document.webkitFullscreenElement))));
    addEventListener('keydown', e => {
      if (e.shiftKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) { e.preventDefault(); dAz += (e.key === 'ArrowLeft' ? -1 : 1) * 0.09; camZ = -1; applyCamera(); drawOverlay(!tw); }
      else if ([' ', 'ArrowLeft', 'Enter', 'PageDown'].includes(e.key)) { e.preventDefault(); go(step + 1, true); }
      else if (['ArrowRight', 'PageUp', 'Backspace'].includes(e.key)) { e.preventDefault(); go(step - 1, false); }
      else if (e.key === 'Home') go(0, false);
      else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { e.preventDefault(); dEl += (e.key === 'ArrowUp' ? 1 : -1) * 0.07; camZ = -1; applyCamera(); drawOverlay(!tw); }
      else if (e.key === '0') { dEl = 0; dAz = 0; camZ = -1; applyCamera(); drawOverlay(!tw); }
      else if (e.code === 'KeyP') { e.preventDefault(); setAuto(!auto); }
      else if (e.key === 'Escape' && auto) setAuto(false);
    });
    addEventListener('message', e => { const m = e.data || {}; if (m.dioramaFull !== undefined) { syncFull(!!m.dioramaFull); return; } if (m.dioramaCmd === 'next') go(step + 1, true); else if (m.dioramaCmd === 'prev') go(step - 1, false); else if (m.dioramaCmd === 'reset') go(0, false); else if (m.dioramaCmd === 'auto') setAuto(!auto); else if (m.dioramaCmd === 'autoOff') setAuto(false); });
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => {
      const k0 = Math.min(D.STEPS.length - 1, Math.max(0, Q.has('step') ? +Q.get('step') : 0));
      if (Q.has('anim') && k0 > 0) { go(k0 - 1, false); go(k0, true); } else go(k0, false);
      requestAnimationFrame(frame); document.body.dataset.ready = '1';
      if (Q.get('auto') === '1') setAuto(true);
    });
  }
  return { start, V, sm, ease, M, COLORS: { A: 0x2FA866, T: 0xE4472E, G: 0x2C7BE5, C: 0x8E5BD9, U: 0xF08C2E, old: 0x5B6B8C, neu: 0xE8B923, mrna: 0xE0407F, rib: 0xF0874F, aa: 0x4F7FE0 },
           CSS: { BLU: '#1B6FD0', RED: '#C8102E', GLD: '#B8860B', TEAL: '#0E8C88', PNK: '#C2327A', GRY: '#44546A', GRN: '#0A7A3D', ORG: '#D9641E', PUR: '#6A1B9A' } };
})();
