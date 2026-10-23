// محاكيات تفاعليَّة — الوحدة 4 (استقصاءات المختبر): g11_mitosis_lab
// الاستقصاءان العمليَّان ٤-١ (إعداد مهروس قمة الجذر) و٤-٢ (استقصاء الانقسام المتساوي باستخدام شرائح جاهزة).
// نصوص الخطوات والجدول ٤-١ حرفيّاً من كتاب التجارب العمليَّة والأنشطة (المطبوعة ١٢٦–١٣٣)، ونتائج العيِّنة وطريقة الحساب
// من دليل المعلِّم ج2 (ص ٢٢٢–٢٢٣)، وتعريفات الأطوار من كتاب الطالب (ص ١٣٠–١٣٢). التسميات القصيرة ورسائل التوجيه من صياغة المنصَّة.
(function(){
  const G = window.G11_DATA = window.G11_DATA || {};
  const F = 'Tajawal, Cairo, sans-serif';
  const TEAL = '#00695c', DARK = '#003d33', LIGHT = '#e0f2f1', RED = '#C8102E', GREEN = '#009A44';
  const $ = id => document.getElementById(id);
  const AR = n => String(n).replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
  const S = {
    wrap: `width:100%;max-width:700px;margin:0 auto;direction:rtl;font-family:${F};color:#1a1a1a;text-align:right;`,
    ctrl: `display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px;padding:8px 10px;background:${LIGHT};border-radius:10px;margin-top:6px;font-size:16px;`,
    panel: `background:#fff;border:2px solid #b2dfdb;border-radius:10px;padding:8px 12px;margin-top:6px;font-size:16px;line-height:1.9;`,
    rng: `width:220px;accent-color:${TEAL};vertical-align:middle;`,
    num: `font-family:${F};font-size:16px;width:70px;padding:3px 6px;border:2px solid #80cbc4;border-radius:6px;direction:ltr;text-align:center;background:#fff;`,
    sel: `font-family:${F};font-size:16px;padding:4px 6px;border:2px solid #80cbc4;border-radius:6px;background:#fff;max-width:100%;`,
  };
  const btn = (on, extra) => `font-family:${F};font-size:16px;padding:5px 12px;border-radius:8px;border:2px solid ${TEAL};cursor:pointer;` +
    (on ? `background:${TEAL};color:#fff;` : `background:#fff;color:${DARK};`) + (extra || '');
  const L = s => `<span dir="ltr" style="unicode-bidi:isolate;white-space:nowrap;">${s}</span>`;
  const svgOpen = (h, id) => `<svg ${id ? `id="${id}" ` : ''}viewBox="0 0 700 ${h}" width="100%" style="display:block;max-width:700px;margin:0 auto;background:#fff;border-radius:10px;font-family:${F};direction:ltr;" xmlns="http://www.w3.org/2000/svg">`;
  function T(x, y, s, o){
    o = o || {};
    // في النصِّ العربي (direction=rtl) ينقلب معنى start/end؛ نحوِّلهما ليبقى 'end' = محاذاة الطرف الأيمن عند x
    const an = o.a || 'middle', a2 = o.ltr ? an : (an === 'end' ? 'start' : (an === 'start' ? 'end' : an));
    return `<text x="${x}" y="${y}" font-size="${o.fs || 16}" fill="${o.c || '#1a1a1a'}" text-anchor="${a2}"` +
      `${o.b ? ' font-weight="700"' : ''}${o.ltr ? ' direction="ltr"' : ' direction="rtl"'}${o.x || ''}>${s}</text>`;
  }
  const src = (p, book) => `<span style="color:#546e7a;">(${book || 'كتاب الطالب'} ص ${AR(p)})</span>`;
  const AB = 'كتاب التجارب العمليَّة والأنشطة';
  const ok = s => `<div style="color:${GREEN};font-weight:700;">✓ ${s}</div>`;
  const warn = s => `<div style="color:${RED};font-weight:700;">⚠ ${s}</div>`;
  function rng(seed){ let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const f1 = x => Math.round(x * 10) / 10;

  // ---------------- الأطوار: تعريفات كتاب الطالب ----------------
  const PH = ['I', 'P', 'M', 'A', 'T'];
  const PNAME = { I:'البيني', P:'التمهيدي', M:'الاستوائي', A:'الانفصالي', T:'النهائي' };
  const PCOL = { I:'#78909c', P:'#1e88e5', M:'#009A44', A:'#C8102E', T:'#ef6c00' };
  const PDEF = {
    I: `«يشكل الطور البيني <span dir="ltr">Interphase 90 %</span> من دورة الخلية، والذي يقسم إلى ثلاثة أطوار هي الطور ${L('G<sub>1</sub> (first gap)')}، والطور ${L('S (synthesis)')}، والطور ${L('G<sub>2</sub> (second gap)')}. أثناء الطور ${L('G<sub>1</sub>')} تُكوِّن الخلية RNA والإنزيمات وبروتينات أخرى تحتاج إليها للنمو، وفي الطور S يتضاعف DNA في النواة، ليصبح كل كروموسوم مكونًا من كروماتيدَين متطابقَين.» ${src(130)}`,
    P: `بداية الطور التمهيدي: «يبدأ ظهور الكروموسومات على شكل لفائف من الكروماتين، وتقصر وتسمك بما يكفي لأن تشاهد عندما تصبغ، ومازال لا يشاهد بوضوح أن كل كروموسوم مكوّن من كروماتيدين.» — نهاية الطور التمهيدي: «يتفكك الغلاف النووي (يتفكك ويشكّل حويصلات صغيرة لا تشاهد بالمجهر الضوئي)» · «تختفي النوية» · «تشاهد الكروموسومات مكوّنة من كروماتيدَين متطابقَين، يحتوي كل كروماتيد على جُزيء DNA واحد» ${src(132)} — من تسميات الشكل ٤-٣`,
    M: `الطور الاستوائي: «تصطف الكروموسومات على امتداد خط استواء الخلية، وهي ترتبط بخيوط المغزل عبر سنتروميراتها» · «خيوط المغزل (مكونة من أنيبيبات دقيقة)» ${src(132)} — من تسميات الشكل ٤-٣`,
    A: `الطور الانفصالي: «تتحرك الكروماتيدات باتجاه القطبَين المتقابلَين، حيث تتحرك السنتروميرات أولًا بفعل تقصّر الأنيبيبات الدقيقة لخيوط المغزل» ${src(132)}. «غالبًا ما يسهل تمييز الطور الانفصالي، حيث تبدو الكروموسومات فيه شبيهة بأرجل العنكبوت المتشابكة» ${src(130, AB)}`,
    T: `الطور النهائي: «تصل الكروماتيدات إلى قطبَي الخلية، وينفكّ التفافها مرة أخرى» · «إعادة تكوين الغلاف النووي» · «إعادة ظهور النوية» ${src(132)}. وفي الخلايا النباتيَّة: «يجب أن يتكوّن جدار خلوي جديد بين النواتين الناتجتين، بعد الانقسام المتساوي.» ${src(131)}`
  };
  // صور صفحات الكتاب (الملف p(P−1) للمطبوعة P)
  const PFIG = { I:['p129.jpg', 'الشكل ٤-٢ دورة الخليَّة — ص ١٣٠'], P:['p131.jpg', 'الشكل ٤-٣ — ص ١٣٢'], M:['p131.jpg', 'الشكل ٤-٣ — ص ١٣٢'], A:['p131.jpg', 'الشكل ٤-٣ — ص ١٣٢'], T:['p131.jpg', 'الشكل ٤-٣ — ص ١٣٢'] };
  const figLink = ph => `<a href="book_assets_s1/${PFIG[ph][0]}" target="_blank" rel="noopener" style="color:${TEAL};font-weight:700;">📖 ${PFIG[ph][1]}</a> · <a href="book_assets_s1/p133.jpg" target="_blank" rel="noopener" style="color:${TEAL};font-weight:700;">📖 الصورة ٤-٥ قمة جذر البصل — ص ١٣٤</a>`;

  // ---------------- رسم خليَّة مربَّعة من قمة الجذر في طور ما ----------------
  // pale: لم تُصبغ الكروموسومات بما يكفي
  function cellSVG(x, y, w, h, ph, seed, o){
    o = o || {};
    const r = rng(seed), cx = x + w / 2, cy = y + h / 2, k = Math.min(w, h);
    const chrom = o.pale ? '#d7c4dc' : '#4a148c', nucF = o.pale ? '#f1e9f2' : '#d9c6e2', nucS = o.pale ? '#e0d4e3' : '#7b1fa2';
    let g = `<rect x="${x + 1.5}" y="${y + 1.5}" width="${w - 3}" height="${h - 3}" rx="4" fill="${o.bg || '#f4f1e6'}" stroke="#8d9b74" stroke-width="2"/>`;
    const sq = (x0, y0, len, ang) => { // خيط كروموسوم ملتفّ
      let d = `M${x0.toFixed(1)},${y0.toFixed(1)}`; let px = x0, py = y0, a = ang;
      for (let i = 0; i < 4; i++) { a += (r() - 0.5) * 1.6; const nx = px + Math.cos(a) * len / 4, ny = py + Math.sin(a) * len / 4; d += ` Q${(px + nx) / 2 + (r() - 0.5) * 5},${(py + ny) / 2 + (r() - 0.5) * 5} ${nx.toFixed(1)},${ny.toFixed(1)}`; px = nx; py = ny; }
      return `<path d="${d}" fill="none" stroke="${chrom}" stroke-width="${o.thin ? 1.6 : 2.4}" stroke-linecap="round"/>`;
    };
    if (ph === 'I') {
      const R = k * 0.22;
      g += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="${nucF}" stroke="${nucS}" stroke-width="1.5"/>`;
      for (let i = 0; i < 9; i++) { const a = r() * 6.28, d = r() * R * 0.8; g += `<circle cx="${(cx + Math.cos(a) * d).toFixed(1)}" cy="${(cy + Math.sin(a) * d).toFixed(1)}" r="${(k * 0.018).toFixed(1)}" fill="${chrom}" opacity="0.55"/>`; }
      g += `<circle cx="${cx + R * 0.25}" cy="${cy - R * 0.2}" r="${k * 0.06}" fill="${chrom}" opacity="0.85"/>`;
    } else if (ph === 'P') {
      const R = k * 0.27;
      g += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="${nucF}" stroke="${nucS}" stroke-width="1.3" stroke-dasharray="${r() < 0.5 ? '0' : '4 3'}"/>`;
      for (let i = 0; i < 6; i++) { const a = r() * 6.28, d = r() * R * 0.5; g += sq(cx + Math.cos(a) * d - R * 0.3, cy + Math.sin(a) * d, R * 1.1, r() * 6.28); }
    } else if (ph === 'M') {
      const span = w * 0.5, n = 7;
      g += [-1, 1].map(sg => [-0.35, -0.12, 0.12, 0.35].map(dx => `<line x1="${cx}" y1="${cy + sg * h * 0.38}" x2="${cx + dx * span * 1.6}" y2="${cy}" stroke="#b39ddb" stroke-width="1"/>`).join('')).join('');
      for (let i = 0; i < n; i++) { const xx = cx - span / 2 + span * i / (n - 1) + (r() - 0.5) * 3; g += `<line x1="${xx.toFixed(1)}" y1="${(cy - k * 0.09 + (r() - 0.5) * 3).toFixed(1)}" x2="${xx.toFixed(1)}" y2="${(cy + k * 0.09).toFixed(1)}" stroke="${chrom}" stroke-width="${o.thin ? 2.4 : 4}" stroke-linecap="round"/>`; }
    } else if (ph === 'A') {
      const off = h * (0.16 + r() * 0.08), span = w * 0.46, n = 5;
      [-1, 1].forEach(sg => {
        for (let i = 0; i < n; i++) {
          const xx = cx - span / 2 + span * i / (n - 1), yy = cy + sg * off, arm = k * 0.14;
          g += `<path d="M${(xx - 4).toFixed(1)},${(yy - sg * arm).toFixed(1)} L${xx.toFixed(1)},${yy.toFixed(1)} L${(xx + 4).toFixed(1)},${(yy - sg * arm).toFixed(1)}" fill="none" stroke="${chrom}" stroke-width="${o.thin ? 1.8 : 3}" stroke-linecap="round" stroke-linejoin="round"/>`;
        }
        g += `<line x1="${cx}" y1="${cy + sg * h * 0.42}" x2="${cx}" y2="${cy + sg * off}" stroke="#b39ddb" stroke-width="1"/>`;
      });
    } else if (ph === 'T') {
      const off = h * 0.27;
      [-1, 1].forEach(sg => {
        const yy = cy + sg * off;
        g += `<ellipse cx="${cx}" cy="${yy}" rx="${w * 0.24}" ry="${h * 0.11}" fill="${nucF}" stroke="${nucS}" stroke-width="1" stroke-dasharray="3 2"/>`;
        for (let i = 0; i < 4; i++) g += sq(cx - w * 0.16 + r() * w * 0.12, yy + (r() - 0.5) * h * 0.08, w * 0.22, (r() - 0.5) * 1.2);
      });
      g += `<line x1="${x + w * 0.18}" y1="${cy}" x2="${x + w * 0.82}" y2="${cy}" stroke="#8d9b74" stroke-width="2" stroke-dasharray="5 3"/>`;
    }
    return g;
  }

  // ---------------- المرحلة 0: الاستقصاء ٤-١ ----------------
  const STEPS = [
    { t:'اقطع قمة الجذر', p:127, x:`ضع البادرة أو فص الثوم على البلاطة البيضاء، واقطع الجذر على مسافة ${L('1 cm')} من أسفل القمة (الشكل ٤-٢).` },
    { t:'الصبغة والحمض', p:128, x:'استخدم قطّارة ماصّة لوضع 20 قطرة تقريبًا من صبغة حمض الأورسين، وقطرتَين من حمض هيدروكلوريك في زجاجة الساعة. تحتاج إلى كمية كافية من الصبغة لتغطي قمة الجذر، فإذا لم تكن هذه المقادير كافية، فأضف المزيد من الصبغة مع الحفاظ على النسبة بين الصبغة والحمض بحدود 10 : 1. انقل قمة الجذر إلى الصبغة، وتأكّد من أنها مغطاة بالكامل.' },
    { t:'التسخين', p:128, x:'سخّن قمة الجذر وهي في الصبغة على نار خفيفة جدًّا. عملية التسخين عملية معقّدة، فإذا لم تسخن بدرجة كافية، فلن تدخل الصبغة إلى الخلايا وتصبغ الكروموسومات، وإذا سخنت أكثر من اللازم، فستُصاب الخلايا والكروموسومات بتلف كبير بحيث لن تكون قادرًا على مشاهدتها عندما تفحص الشريحة بالمجهر. جرّب إحدى هاتَين الطريقتَين: • امسك زجاجة الساعة بأصابعك، محرّكًا إياها، من اليمين إلى اليسار، فوق لهب بنزن خفيف. سيساعدك الإمساك بها في تحسّس حرارتها تجنّبًا لارتفاعها كثيرًا. • ضع زجاجة الساعة على السخّان الكهربائي، واتركها لمدة 5 دقائق، مراقبًا إيّاها بحرص لتتأكّد من عدم وجود دلائل على ارتفاع درجة حرارتها كثيرًا.' },
    { t:'انقل إلى الشريحة', p:128, x:'أزل قمة الجذر المصبوغة من زجاجة الساعة، وضعها على شريحة مجهريّة، مضيفًا إليها قطرتَين من الصبغة.' },
    { t:'مزِّق طوليًّا', p:128, x:'مزّق قمة الجذر طوليًّا باستخدام إبرة التثبيت، بهدف فصل الخلايا جزئيًّا بعضها عن بعض مع إبقائها في مواقعها النسبية نفسها.' },
    { t:'غطِّ العيِّنة', p:128, x:'غطِّ العيّنة بغطاء شريحة، مع محاولة تجنّب تكوّن فقاعات هواء؛ وإذا لم يكن هناك ما يكفي من السائل بين الشريحة وغطائها، يمكن إضافة المزيد من الصبغة.' },
    { t:'الهرس', p:128, x:'لُفّ قطعة من ورق الترشيح حول الشريحة وغطائها لتكون مثل بِطانة (مسهلة للحركة)، ثم استخدم الطرف غير الحاد من القلم للنقر بلطف، وبشكل متكرّر، على ورق الترشيح، لهرس قمة الجذر تدريجيًّا. يمكنك رفع ورقة الترشيح من وقت إلى آخر للتحقّق من مدى درجة الهرس. كن صبورًا، لأنه من الأفضل لك المحافظة على غطاء الشريحة سليمًا ولو احتجت إلى وقت طويل، وإلاّ فستضطر إلى إعادة التجربة من جديد.' },
    { t:'سخِّن الشريحة', p:128, x:'سخّن الشريحة بلطف، كما في الخطوة ٣، لكن لمدّة قصيرة جدًّا (مثلًا بتمريرها 10 ثواني تقريبًا على السخّان الكهربائي، أو لمرّات قليلة فوق اللهب).' },
    { t:'افحص بالمجهر', p:129, x:'افحص الشريحة مجهريًّا باستخدام العدسة الشيئيّة الصغرى، وابحث عن الجزء من قمة الجذر المهروسة الذي يمكن أن توجد فيه خلايا في حالة انقسام. ثم انتقل إلى العدسة الشيئيّة الكبرى، لتتحقّق من إمكانية مشاهدة الكروموسومات. إذا لم تتمكن من مشاهدة الكروموسومات، فحدّد في الجدول الآتي السبب المحتمل، وتصرّف وفقًا للتوجيهات.' }
  ];
  // الجدول ٤-١ دليل إصلاح الأخطاء (كتاب الأنشطة ص ١٢٩)
  const TROUBLE = [
    { pr:0, c:'ربما تكون قد أتلفت قمة الجذر؛ على سبيل المثال: قد تكون تركتها لمدّة طويلة في حمض الهيدروكلوريك، أو هرستها كثيرًا بحيث دفعت الخلايا من تحت غطاء الشريحة إلى الخارج.', d:['ابدأ مرة أخرى، وتعامل مع قمة الجذر برفق أكثر مما سبق، وقلل من وقت بقائها في المزيج الحمضي.'] },
    { pr:1, c:'لم تحرّر فقاعات الهواء عندما وضعت غطاء الشريحة.', d:['ارفع الشريحة من على منضدة المجهر.', 'استخدم قطّارة ماصّة لتضيف برفق كميّة قليلة من الصبغة عند إحدى حافتَي غطاء الشريحة، واتركها لتنساب تحتها.', 'نظّف الشريحة قبل إعادتها إلى منضدة المجهر.'] },
    { pr:2, c:'لم تهرس قمة الجذر بشكل كاف.', d:['ارفع الشريحة من على منضدة المجهر.', 'أضف المزيد من السائل إن لزم، ثم لفّ الشريحة بورقة ترشيح، ناقرًا عليها أكثر من ذي قبل ولمدّة أطول ممّا سبق.'] },
    { pr:3, c:'ربما لا تكون خلايا الجذر في حالة انقسام، لذا لا تكون الكروموسومات في حالتها المتكثفة.', d:['اسأل ما إذا كان أيّ من زملائك قد شاهد الخلايا.', 'إذا وجد من استطاع ذلك، فجرّب قمة جذر أخرى.', 'إن لم يستطع أحد ذلك، فحاول مرة أخرى في وقت لاحق (يحدث الانقسام المتساوي في بعض النباتات في أوقات معينة من اليوم).'] },
    { pr:3, c:'ربما لا تكون الكروموسومات قد صبغت بما يكفي لتشاهد.', d:['ارفع الشريحة من على منضدة المجهر', 'ارفع غطاء الشريحة.', 'أضف المزيد من الصبغة واتركها لدقيقتَين إضافيتَين.', 'أعد غطاء الشريحة وافحص الشريحة مرّة أخرى بالمجهر.', 'إن لم تنجح التجربة، فأعد المحاولة، واترك العيّنة في الصبغة مدّة أطول.'] },
    { pr:3, c:'قد تكون الشريحة صبغت بشكل زائد.', d:['أعد المحاولة مرة أخرى باستخدام محلول صبغة مخفّف أكثر.'] }
  ];
  const PROBS = ['لا يمكنك مشاهدة أيّة خليّة.', 'يوجد فقاعات هواء كثيرة في الشريحة، بحيث تصعب مشاهدة الخلايا.', 'الخلايا متراكمة فوق بعضها، لذا لا تشاهد بوضوح.', 'يمكن مشاهدة الخلايا، لكن لا يشاهد أي كروموسوم.'];
  const HEAT = ['', 'غير كافٍ', 'نار خفيفة جدًّا (مناسب)', 'أكثر من اللازم'];
  const TAP_MIN = 10, TAP_MAX = 30;

  const M = window.G11SIM_mitosis = {
    a: null, b: null,
    // ---------- حساب الاستقصاء ٤-٢ (يُختبر آليّاً) ----------
    // النسبة المئويَّة لأقرب منزلة عشريَّة، ثمَّ الزمن = النسبة × 540 دقيقة مقرَّباً لأقرب دقيقة (كما في إجابات الدليل)
    calc(cnt, hours){
      const H = hours || 9, minutes = H * 60;
      const total = PH.reduce((s, p) => s + (cnt[p] || 0), 0);
      const pct = {}, min = {};
      PH.forEach(p => { pct[p] = total ? f1((cnt[p] || 0) / total * 100) : 0; min[p] = Math.round(pct[p] / 100 * minutes); });
      const mit = (cnt.P || 0) + (cnt.M || 0) + (cnt.A || 0) + (cnt.T || 0);
      const index = cnt.I ? Math.round(mit / cnt.I * 100) / 100 : null;
      return { total, pct, min, minutes, mit, index };
    },
    outcome(a){
      if (a.heat === 3) return { row:0, why:'heat' };
      if (a.taps > TAP_MAX) return { row:0, why:'taps' };
      if (a.cover === 'fast') return { row:1, why:'cover' };
      if (a.taps < TAP_MIN) return { row:2, why:'taps' };
      if (a.heat === 1) return { row:4, why:'heat' };
      return { row:-1 };
    },
    resetA(keep){
      const o = this.a || {};
      this.a = { done:0, view:1, stain:20, acid:2, method: keep ? o.method : '', heat: keep ? o.heat : 0, cover: keep ? o.cover : '', taps: keep ? o.taps : 0, lift:false, obj:'low', prob: -1, msg:'' };
    },

    // ---------- رسوم خطوات ٤-١ ----------
    drawStep(k){
      const a = this.a, done = a.done;
      let o = svgOpen(340, 'g11x_svg');
      o += `<defs><marker id="g11x_ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${RED}"/></marker>` +
        `<clipPath id="g11x_fov"><circle cx="350" cy="170" r="150"/></clipPath></defs>`;
      const stained = done >= 3 && a.heat >= 2, tipCol = done >= 3 ? (a.heat === 1 ? '#c9a7cf' : '#6a1b9a') : (done >= 2 ? '#d7b3dc' : '#f0e6c8');
      const glass = (lq, tip) => `<ellipse cx="350" cy="215" rx="170" ry="48" fill="#eceff1" stroke="#90a4ae" stroke-width="2"/>` +
        (lq ? `<ellipse cx="350" cy="212" rx="120" ry="28" fill="#8e24aa" opacity="0.75"/>` : '') +
        (tip ? `<rect x="330" y="204" width="40" height="12" rx="6" fill="${tipCol}" stroke="#4a148c" stroke-width="1"/>` : '');
      const slide = (yy) => `<rect x="110" y="${yy}" width="480" height="110" rx="4" fill="#e3f2fd" stroke="#90a4ae" stroke-width="2"/>`;
      if (k === 1) {
        o += `<rect x="40" y="30" width="620" height="270" rx="6" fill="#fafafa" stroke="#cfd8dc" stroke-width="2"/>` + T(350, 290, 'بلاطة بيضاء', { c:'#78909c' });
        o += `<ellipse cx="170" cy="160" rx="70" ry="48" fill="#d7b98e" stroke="#8d6e63" stroke-width="2"/>` + T(170, 166, 'بادرة فول', { fs:16 });
        o += `<path d="M235,170 C320,175 400,160 ${done >= 1 ? 505 : 560},172" fill="none" stroke="#e8dcc0" stroke-width="12" stroke-linecap="round"/>`;
        for (let i = 0; i < 9; i++) o += `<line x1="${280 + i * 22}" y1="${166 - (i % 2) * 2}" x2="${284 + i * 22}" y2="${150 - (i % 3) * 3}" stroke="#d7ccc8" stroke-width="1.5"/>`;
        o += T(300, 135, 'شعيرات جذريّة', { fs:16, c:'#6d4c41' });
        if (done >= 1) {
          o += `<rect x="535" y="165" width="56" height="14" rx="7" fill="#f0e6c8" stroke="#8d6e63" stroke-width="1.5"/>`;
          o += `<line x1="535" y1="205" x2="591" y2="205" stroke="${TEAL}" stroke-width="2"/><line x1="535" y1="198" x2="535" y2="212" stroke="${TEAL}" stroke-width="2"/><line x1="591" y1="198" x2="591" y2="212" stroke="${TEAL}" stroke-width="2"/>`;
          o += T(563, 230, '1 cm', { ltr:1, b:1, c:TEAL }) + T(563, 150, 'قمة الجذر', { b:1, c:DARK });
          o += T(470, 255, 'منطقة الانقسام المتساوي (النسيج الموّلد) خلف القمة مباشرة', { fs:16, c:'#4e342e' });
        } else {
          o += `<line x1="510" y1="140" x2="510" y2="205" stroke="${RED}" stroke-width="2.5" stroke-dasharray="6 4"/>` + T(510, 128, '✂ اقطع هنا', { c:RED, b:1 });
          o += `<line x1="510" y1="215" x2="560" y2="215" stroke="${TEAL}" stroke-width="2"/>` + T(535, 236, '1 cm', { ltr:1, c:TEAL });
        }
      } else if (k === 2) {
        o += glass(done >= 2, done >= 2) + T(350, 290, 'زجاجة ساعة', { c:'#546e7a' });
        o += `<rect x="190" y="40" width="22" height="80" rx="4" fill="#ce93d8" stroke="#6a1b9a"/><rect x="488" y="40" width="22" height="80" rx="4" fill="#fff9c4" stroke="#9e9d24"/>`;
        o += T(201, 30, `صبغة حمض الأورسين: ${a.stain} قطرة`, { fs:16, c:'#4a148c', b:1 }) + T(499, 30, `حمض هيدروكلوريك: ${a.acid} قطرة`, { fs:16, c:'#827717', b:1 });
        const ratio = a.acid ? f1(a.stain / a.acid) : 0;
        o += T(350, 120, `النسبة = ${a.stain} : ${a.acid} ≈ ${ratio} : 1`, { fs:18, ltr:1, b:1, c: Math.abs(ratio - 10) <= 1.5 ? GREEN : RED });
        if (done >= 2) o += T(350, 160, 'قمة الجذر مغطاة بالكامل بالصبغة', { c:'#4a148c' });
      } else if (k === 3) {
        o += glass(true, true);
        if (a.method === 'bunsen') {
          o += `<rect x="320" y="285" width="60" height="40" fill="#90a4ae"/><path d="M350,282 C335,262 345,250 350,236 C355,250 365,262 350,282 z" fill="#64b5f6" opacity="0.85"/>`;
          o += `<line x1="230" y1="160" x2="470" y2="160" stroke="${RED}" stroke-width="2" marker-end="url(#g11x_ar)"/>` + T(350, 148, 'حرِّك الزجاجة يمينًا ويسارًا فوق لهب خفيف', { fs:16 });
        } else {
          o += `<rect x="190" y="262" width="320" height="40" rx="6" fill="#455a64"/><rect x="230" y="268" width="240" height="8" fill="${a.heat === 3 ? '#ff5722' : '#ff8a65'}"/>` + T(350, 296, 'سخّان كهربائي', { fill:'#fff', c:'#fff' });
        }
        const hc = a.heat === 0 ? '#9e9e9e' : (a.heat === 2 ? GREEN : RED);
        o += `<rect x="560" y="40" width="26" height="200" rx="13" fill="#eceff1" stroke="#90a4ae" stroke-width="2"/><rect x="564" y="${240 - a.heat * 62}" width="18" height="${a.heat * 62}" rx="9" fill="${hc}"/>`;
        o += T(573, 262, a.heat ? HEAT[a.heat] : 'اختر', { fs:16, c:hc, b:1 });
        if (done >= 3) o += T(350, 60, a.heat === 1 ? 'لم تدخل الصبغة إلى الخلايا جيّدًا' : (a.heat === 3 ? '⚠ تلف في الخلايا والكروموسومات' : '✓ قمة الجذر مصبوغة'), { fs:18, b:1, c: a.heat === 2 ? GREEN : RED });
      } else if (k >= 4 && k <= 8) {
        o += slide(110) + T(350, 250, 'شريحة مجهريّة', { c:'#546e7a' });
        const split = done >= 5, sq = (done >= 7 || k === 7) ? Math.min(a.taps, 40) : 0;
        if (k === 7 || k === 8 || done >= 7) {
          const R = 14 + sq * 2.2;
          o += `<ellipse cx="350" cy="165" rx="${R * 1.4}" ry="${R}" fill="${tipCol}" opacity="${a.taps > TAP_MAX ? 0.25 : 0.55}"/>`;
          if (a.taps > TAP_MAX && (done >= 7 || k === 7)) o += `<ellipse cx="350" cy="165" rx="110" ry="58" fill="none" stroke="${RED}" stroke-dasharray="4 3" stroke-width="1.5"/>` + T(350, 100, 'دُفعت الخلايا من تحت الغطاء', { c:RED, b:1 });
        } else {
          if (split) for (let i = 0; i < 3; i++) o += `<rect x="${318 + i * 3}" y="${150 + i * 12}" width="64" height="9" rx="4" fill="${tipCol}" stroke="#4a148c" stroke-width="0.8" transform="rotate(${(i - 1) * 6} 350 165)"/>`;
          else o += `<rect x="318" y="158" width="64" height="16" rx="8" fill="${tipCol}" stroke="#4a148c" stroke-width="1"/>`;
          o += `<circle cx="300" cy="166" r="8" fill="#8e24aa" opacity="0.6"/><circle cx="400" cy="166" r="8" fill="#8e24aa" opacity="0.6"/>`;
        }
        if (k === 5) o += `<line x1="440" y1="60" x2="365" y2="160" stroke="#616161" stroke-width="3"/><circle cx="440" cy="60" r="8" fill="#9e9e9e"/>` + T(470, 50, 'إبرة التثبيت', { fs:16 });
        if (done >= 6 || k === 6) {
          if (done >= 6) {
            o += `<rect x="280" y="112" width="140" height="106" fill="#ffffff" opacity="0.45" stroke="#78909c" stroke-width="2"/>` + T(350, 105, 'غطاء الشريحة', { fs:16, c:'#455a64' });
            if (a.cover === 'fast') [[305, 135, 10], [390, 140, 13], [330, 195, 9], [395, 195, 8], [355, 128, 6]].forEach(c => o += `<circle cx="${c[0]}" cy="${c[1]}" r="${c[2]}" fill="#fff" stroke="#546e7a" stroke-width="2"/>`);
          } else o += `<rect x="300" y="40" width="140" height="10" fill="#fff" stroke="#78909c" stroke-width="2" transform="rotate(-20 300 50)"/>` + T(420, 30, 'أنزل الغطاء…', { fs:16 });
        }
        if (k === 7) {
          o += `<rect x="250" y="95" width="200" height="140" fill="#fffde7" opacity="${a.lift ? 0.15 : 0.85}" stroke="#bdbdbd" stroke-width="2" stroke-dasharray="6 3"/>`;
          if (!a.lift) o += T(350, 230, 'ورق ترشيح', { c:'#757575' });
          o += `<polygon points="470,30 486,38 400,150 392,146" fill="#ffca28" stroke="#6d4c41" stroke-width="1.5"/>` + T(560, 60, `نقرات: ${a.taps}`, { fs:18, b:1, c:DARK });
        }
        if (k === 8) {
          o += `<rect x="150" y="262" width="400" height="40" rx="6" fill="#455a64"/><rect x="190" y="268" width="320" height="8" fill="#ff8a65"/>` + T(350, 296, 'سخّان كهربائي — 10 ثواني تقريبًا', { c:'#fff' });
          if (done >= 8) o += T(350, 60, '✓ سُخِّنت الشريحة بلطف لمدّة قصيرة جدًّا', { c:GREEN, b:1 });
        }
      } else if (k === 9) {
        o += this.fieldResult();
      }
      o += T(690, 330, `الخطوة ${AR(k)}`, { a:'end', fs:16, c:'#90a4ae' });
      return o + '</svg>';
    },
    // منظر مجال الرؤية بعد الخطوة ٩ بحسب ما فعله الطالب
    fieldResult(){
      const a = this.a, out = this.outcome(a), hi = a.obj === 'high';
      let o = `<circle cx="350" cy="170" r="152" fill="#263238"/><g clip-path="url(#g11x_fov)"><rect x="190" y="10" width="320" height="320" fill="#f5f5f0"/>`;
      if (a.done < 9) { o += '</g>' + T(350, 176, 'نفِّذ الخطوة ٩', { fs:18, c:'#90a4ae' }); return o; }
      const cw = hi ? 92 : 40, ch = hi ? 88 : 38, cols = Math.ceil(320 / cw) + 1, rows = Math.ceil(320 / ch) + 1;
      const r = rng(41 + (hi ? 7 : 0));
      if (out.row === 0) {
        for (let i = 0; i < 14; i++) o += `<circle cx="${200 + r() * 300}" cy="${30 + r() * 280}" r="${2 + r() * 5}" fill="#b0a7b3" opacity="0.6"/>`;
        o += '</g>' + T(350, 176, 'لا خلايا في المجال', { fs:18, c:RED, b:1 });
        return o;
      }
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
        const x = 190 + i * cw - (j % 2) * cw * 0.15, y = 10 + j * ch;
        let ph = 'I'; const q = r();
        if (out.row === -1 || out.row === 1) ph = q < 0.62 ? 'I' : (q < 0.75 ? 'P' : (q < 0.83 ? 'M' : (q < 0.88 ? 'A' : 'T')));
        if (out.row === 2) {
          o += `<g opacity="0.55" transform="translate(${(r() - 0.5) * 18},${(r() - 0.5) * 18})">${cellSVG(x, y, cw, ch, ph, 300 + j * 31 + i, { thin: !hi, bg:'#d8cfe0' })}</g>`;
          o += `<g opacity="0.45" transform="translate(${cw * 0.4},${ch * 0.35})">${cellSVG(x, y, cw, ch, 'I', 900 + j * 17 + i, { thin: !hi, bg:'#cdbfd8' })}</g>`;
        } else o += cellSVG(x, y, cw, ch, ph, 300 + j * 31 + i, { thin: !hi, pale: out.row === 4 });
      }
      if (out.row === 1) [[265, 110, 46], [420, 220, 58], [330, 260, 30], [440, 90, 26]].forEach(c => o += `<circle cx="${c[0]}" cy="${c[1]}" r="${c[2]}" fill="#fafafa" stroke="#37474f" stroke-width="4"/>`);
      o += '</g>';
      return o;
    },
    stepCtrl(k){
      const a = this.a;
      if (k === 2) return `<label>قطرات الصبغة <input type="number" min="5" max="60" value="${a.stain}" style="${S.num}" oninput="G11SIM_mitosis.setNum('stain',this.value)"></label>` +
        `<label>قطرات الحمض <input type="number" min="1" max="10" value="${a.acid}" style="${S.num}" oninput="G11SIM_mitosis.setNum('acid',this.value)"></label>`;
      if (k === 3) return `<span>الطريقة:</span><button style="${btn(a.method === 'bunsen')}" onclick="G11SIM_mitosis.set('method','bunsen')">لهب بنزن خفيف</button>` +
        `<button style="${btn(a.method === 'heater')}" onclick="G11SIM_mitosis.set('method','heater')">السخّان الكهربائي</button>` +
        `<span style="flex-basis:100%;"></span><span>درجة التسخين:</span>` + [1, 2, 3].map(h => `<button style="${btn(a.heat === h)}" onclick="G11SIM_mitosis.set('heat',${h})">${HEAT[h]}</button>`).join('');
      if (k === 6) return `<button style="${btn(a.cover === 'gentle')}" onclick="G11SIM_mitosis.set('cover','gentle')">أنزل الغطاء بلطف من طرفه</button>` +
        `<button style="${btn(a.cover === 'fast')}" onclick="G11SIM_mitosis.set('cover','fast')">أسقط الغطاء دفعة واحدة</button>`;
      if (k === 7) return `<label>عدد النقرات <input type="range" min="0" max="40" value="${a.taps}" style="${S.rng}" oninput="G11SIM_mitosis.setTaps(this.value)"> <b id="g11x_tp">${AR(a.taps)}</b></label>` +
        `<button style="${btn(a.lift)}" onclick="G11SIM_mitosis.set('lift',${!a.lift})">${a.lift ? 'أعد ورقة الترشيح' : 'ارفع ورقة الترشيح للتحقُّق'}</button>`;
      if (k === 9) return `<button style="${btn(a.obj === 'low')}" onclick="G11SIM_mitosis.set('obj','low')">العدسة الشيئيّة الصغرى</button>` +
        `<button style="${btn(a.obj === 'high')}" onclick="G11SIM_mitosis.set('obj','high')">العدسة الشيئيّة الكبرى</button>`;
      return '';
    },
    check(k){
      const a = this.a;
      if (k === 2) {
        if (a.stain < 20) return `«تحتاج إلى كمية كافية من الصبغة لتغطي قمة الجذر» — استخدم 20 قطرة تقريبًا أو أكثر ${src(128, AB)}`;
        const ratio = a.stain / a.acid;
        if (Math.abs(ratio - 10) > 1.5) return `«مع الحفاظ على النسبة بين الصبغة والحمض بحدود 10 : 1» — نسبتك الآن ${L(f1(ratio) + ' : 1')} ${src(128, AB)}`;
      }
      if (k === 3 && (!a.method || !a.heat)) return 'اختر طريقة التسخين ودرجته أوَّلًا.';
      if (k === 6 && !a.cover) return 'اختر كيف ستضع غطاء الشريحة.';
      if (k === 7 && a.taps < 1) return 'حرِّك منزلق النقرات لتهرس قمة الجذر تدريجيًّا.';
      return '';
    },
    stepPanel(){
      const a = this.a, k = a.view, st = STEPS[k - 1], isNext = k === a.done + 1;
      let h = `<div style="${S.panel}"><b style="color:${TEAL};">الخطوة ${AR(k)} — ${st.t}:</b> «${st.x}» ${src(st.p, AB)}`;
      if (k === 3 && a.done >= 3) h += a.heat === 2 ? ok('سخّنتَ على نار خفيفة جدًّا.') : warn(a.heat === 1 ? '«فإذا لم تسخن بدرجة كافية، فلن تدخل الصبغة إلى الخلايا وتصبغ الكروموسومات»' : '«وإذا سخنت أكثر من اللازم، فستُصاب الخلايا والكروموسومات بتلف كبير»');
      if (k === 7 && (a.lift || a.done >= 7)) h += a.taps > TAP_MAX ? warn('هرس زائد: «كن صبورًا، لأنه من الأفضل لك المحافظة على غطاء الشريحة سليمًا»') : (a.taps < TAP_MIN ? warn('الهرس غير كافٍ بعدُ — الخلايا ما زالت متراكمة.') : ok('درجة الهرس مناسبة: انتشرت الخلايا في طبقة رقيقة.'));
      if (a.msg) h += warn(a.msg);
      h += '</div>';
      const c = isNext ? this.stepCtrl(k) : (k === 9 ? this.stepCtrl(9) : '');
      h += `<div style="${S.ctrl}">${c}${isNext ? `<button style="${btn(true, 'margin-inline-start:auto;font-size:17px;')}" onclick="G11SIM_mitosis.doStep()">✔ نفِّذ الخطوة ${AR(k)}</button>` : ''}` +
        `${!isNext && k <= a.done && k < a.done + 1 && a.done < 9 ? `<button style="${btn(true, 'margin-inline-start:auto;')}" onclick="G11SIM_mitosis.go(${a.done + 1})">← إلى الخطوة ${AR(a.done + 1)}</button>` : ''}</div>`;
      if (k === 9 && a.done >= 9) h += this.troublePanel();
      return h;
    },
    troublePanel(){
      const a = this.a, out = this.outcome(a);
      let h = `<div style="${S.panel}">`;
      if (out.row === -1) h += ok('تشاهد خلايا مربعة الشكل في أطوار مختلفة، والكروموسومات مصبوغة وواضحة بالعدسة الكبرى.') + `<div>«غالبًا ما يسهل تمييز الطور الانفصالي، حيث تبدو الكروموسومات فيه شبيهة بأرجل العنكبوت المتشابكة» ${src(130, AB)} — انتقل إلى المرحلة ٢ لعدّ الخلايا في شريحة جاهزة.</div>`;
      else {
        const t = TROUBLE[out.row];
        h += warn('المشكلة: «' + PROBS[t.pr] + '»') + `<div><b>السبب المحتمل:</b> «${t.c}»</div><div><b>توجيهات للمحاولة:</b></div><ul style="margin:0 22px 0 0;padding:0;">${t.d.map(x => `<li>${x}</li>`).join('')}</ul><div>${src(129, AB)} — الجدول ٤-١ دليل إصلاح الأخطاء</div>`;
      }
      h += `<div style="margin-top:4px;"><button style="${btn(false)}" onclick="G11SIM_mitosis.retry()">↺ أعد المحاولة (بالاختيارات نفسها لتعدِّلها)</button> <button style="${btn(false)}" onclick="G11SIM_mitosis.fresh()">ابدأ من جديد</button></div></div>`;
      // مستكشف الجدول ٤-١
      h += `<div style="${S.panel}"><b style="color:${TEAL};">حلُّ المشكلات — الجدول ٤-١:</b> <select style="${S.sel}" onchange="G11SIM_mitosis.pickProb(this.value)"><option value="-1">اختر مشكلة…</option>${PROBS.map((p, i) => `<option value="${i}"${a.prob === i ? ' selected' : ''}>${p}</option>`).join('')}</select>` +
        `<div id="g11x_prob">${this.probHtml()}</div><div style="color:#455a64;">مهم: «الخلايا المطلوب البحث عنها هنا هي مربعة الشكل.» ${src(129, AB)}</div></div>`;
      return h;
    },
    probHtml(){
      const p = this.a.prob; if (p < 0) return '';
      return TROUBLE.filter(t => t.pr === p).map(t => `<div style="border-top:1px dashed #b2dfdb;margin-top:4px;padding-top:4px;"><b>السبب المحتمل:</b> «${t.c}»<br><b>توجيهات للمحاولة:</b> ${t.d.map(x => '• ' + x).join(' ')}</div>`).join('');
    },
    chips(){
      const a = this.a;
      return `<div style="${S.ctrl}justify-content:center;gap:4px;">` + STEPS.map((st, i) => {
        const k = i + 1, d = k <= a.done, cur = k === a.view;
        const st2 = `font-family:${F};font-size:16px;padding:3px 8px;border-radius:14px;cursor:pointer;border:2px solid ${d ? GREEN : (k === a.done + 1 ? TEAL : '#b0bec5')};` +
          (cur ? `background:${d ? GREEN : TEAL};color:#fff;` : `background:#fff;color:${d ? GREEN : (k === a.done + 1 ? DARK : '#90a4ae')};`);
        return `<button style="${st2}" onclick="G11SIM_mitosis.go(${k})">${d ? '✓' : AR(k)} ${st.t}</button>`;
      }).join('') + '</div>';
    },
    viewA(){ return this.chips() + `<div id="g11x_draw">${this.drawStep(this.a.view)}</div><div id="g11x_panel">${this.stepPanel()}</div>`; },
    refreshA(){ const e = $('g11x_a'); if (e) e.innerHTML = this.viewA(); },
    go(k){
      const a = this.a; a.msg = '';
      if (k > a.done + 1) { a.msg = `نفِّذ الخطوات بترتيبها: الخطوة التالية هي الخطوة ${AR(a.done + 1)} «${STEPS[a.done].t}».`; a.view = a.done + 1; }
      else a.view = k;
      this.refreshA();
    },
    set(key, v){ this.a[key] = v; this.a.msg = ''; this.refreshA(); },
    setNum(key, v){ const n = parseInt(v, 10); this.a[key] = isFinite(n) && n > 0 ? n : 1; this.a.msg = ''; const d = $('g11x_draw'); if (d) d.innerHTML = this.drawStep(this.a.view); },
    setTaps(v){ this.a.taps = parseInt(v, 10) || 0; const t = $('g11x_tp'); if (t) t.textContent = AR(this.a.taps); const d = $('g11x_draw'); if (d) d.innerHTML = this.drawStep(7); if (this.a.lift) { const p = $('g11x_panel'); if (p) p.innerHTML = this.stepPanel(); } },
    doStep(){
      const a = this.a, k = a.view; if (k !== a.done + 1) return;
      const e = this.check(k); a.msg = e;
      if (!e) { a.done = k; if (k < 9) a.view = k; }
      this.refreshA();
    },
    retry(){ this.resetA(true); this.refreshA(); },
    fresh(){ this.resetA(false); this.refreshA(); },
    pickProb(v){ this.a.prob = parseInt(v, 10); const e = $('g11x_prob'); if (e) e.innerHTML = this.probHtml(); },

    // ---------------- المرحلة 1: الاستقصاء ٤-٢ — عدّ الخلايا ----------------
    SAMPLE: { I:54, P:11, M:6, A:3, T:9 },   // نتائج عيِّنة الدليل (الجدول ٤-٢)
    makeSlide(cnt, seed){
      const list = []; PH.forEach(p => { for (let i = 0; i < cnt[p]; i++) list.push(p); });
      const r = rng(seed); for (let i = list.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [list[i], list[j]] = [list[j], list[i]]; }
      const per = Math.ceil(list.length / 3);
      return { truth: list, fields: [0, 1, 2].map(f => ({ from: f * per, to: Math.min(list.length, (f + 1) * per) })), seed };
    },
    resetB(cnt, seed){
      const sl = this.makeSlide(cnt || this.SAMPLE, seed || 2026);
      this.b = { sl, cls: new Array(sl.truth.length).fill(null), field: 0, pick: 'I', checked: false, last: null, sample: !cnt || cnt === this.SAMPLE };
    },
    counts(){ const c = { I:0, P:0, M:0, A:0, T:0 }; this.b.cls.forEach(p => { if (p) c[p]++; }); return c; },
    fieldSvg(){
      const b = this.b, f = b.sl.fields[b.field], n = f.to - f.from, cols = 7, cw = 96, ch = 86, x0 = 14, y0 = 14;
      let o = svgOpen(380, 'g11y_svg') + `<rect x="2" y="2" width="696" height="376" rx="18" fill="#263238"/><rect x="10" y="10" width="680" height="360" rx="14" fill="#eef2e6"/>`;
      for (let i = 0; i < 28; i++) {
        const gi = f.from + i, x = x0 + (i % cols) * cw, y = y0 + Math.floor(i / cols) * ch;
        if (i >= n) { o += `<rect x="${x + 1.5}" y="${y + 1.5}" width="${cw - 3}" height="${ch - 3}" rx="4" fill="#e3e8d8" stroke="#a5b08f" stroke-width="2" stroke-dasharray="5 4"/>`; continue; }
        const tr = b.sl.truth[gi], me = b.cls[gi];
        o += `<g style="cursor:pointer;" onclick="G11SIM_mitosis.tap(${gi})">${cellSVG(x, y, cw, ch, tr, b.sl.seed + gi * 13)}`;
        if (me) {
          const bad = b.checked && me !== tr;
          o += `<rect x="${x + 3}" y="${y + 3}" width="${cw - 6}" height="${ch - 6}" rx="4" fill="none" stroke="${bad ? RED : PCOL[me]}" stroke-width="4"/>`;
          o += `<rect x="${x + cw / 2 - 36}" y="${y + ch - 25}" width="72" height="22" rx="4" fill="${bad ? RED : PCOL[me]}"/>` + T(x + cw / 2, y + ch - 8, (bad ? '✗ ' : '') + PNAME[me], { fs:16, c:'#fff', b:1 });
        }
        o += '</g>';
      }
      return o + '</svg>';
    },
    tally(n){ let s = ''; for (let i = 0; i < Math.floor(n / 5); i++) s += '<span style="text-decoration:line-through;letter-spacing:1px;">||||</span> '; return s + '|'.repeat(n % 5); },
    tableHtml(){
      const c = this.counts(), R = this.calc(c), b = this.b, td = 'border:1px solid #b2dfdb;padding:3px 5px;text-align:center;';
      const left = b.cls.filter(x => !x).length;
      let h = `<div style="${S.panel}overflow-x:auto;"><b style="color:${TEAL};">الجدول ٤-٢: جدول مجموعات الأعداد</b> <span style="color:#546e7a;">(يُبنى من تصنيفك)</span>` +
        `<table style="border-collapse:collapse;width:100%;margin-top:4px;font-size:16px;"><tr><th style="${td}background:#80cbc4;">الأطوار</th>${PH.map(p => `<th style="${td}background:#80cbc4;">${PNAME[p]}</th>`).join('')}</tr>` +
        `<tr><td style="${td}">مجموعات الأعداد</td>${PH.map(p => `<td style="${td}direction:ltr;font-family:monospace;">${this.tally(c[p])}</td>`).join('')}</tr>` +
        `<tr><td style="${td}">العدد</td>${PH.map(p => `<td style="${td}font-weight:700;">${c[p]}</td>`).join('')}</tr>` +
        `<tr><td style="${td}">النسبة المئويَّة</td>${PH.map(p => `<td style="${td}">${R.total ? L(R.pct[p] + ' %') : '—'}</td>`).join('')}</tr>` +
        `<tr><td style="${td}">الزمن (دقيقة)</td>${PH.map(p => `<td style="${td}">${R.total ? R.min[p] : '—'}</td>`).join('')}</tr></table>`;
      h += `<div>صنَّفتَ <b>${R.total}</b> خليّة من ${b.sl.truth.length}${left ? ` — بقي ${left}` : ' ✓'}. «كرّر مع مجالات رؤية مختلفة، لتتمكّن من إحصاء حتى 50 خليّة على الأقل. وكلّما ازداد العدد ازدادت دقة نتائجك.» ${src(131, AB)}</div>`;
      if (b.checked) { const right = b.cls.filter((x, i) => x && x === b.sl.truth[i]).length; h += `<div style="color:${right === R.total ? GREEN : RED};font-weight:700;">مطابقة تصنيفك لتصنيف المنصَّة: ${right} من ${R.total} (الخطأ بإطار أحمر)</div>`; }
      return h + '</div>';
    },
    calcHtml(){
      const c = this.counts(), R = this.calc(c);
      if (!R.total) return `<div style="${S.panel}">صنِّف الخلايا لتظهر الحسابات والتمثيل الدائري — أو اضغط «املأ بنتائج عيِّنة الدليل».</div>`;
      let h = `<div style="${S.panel}"><b style="color:${TEAL};">التحليل (أسئلة ١–٤ ${src(131, AB)}):</b>`;
      h += `<div><b>١.</b> أطوار الانقسام المتساوي: الطور التمهيدي، الطور الاستوائي، الطور الانفصالي، الطور النهائي.</div>`;
      h += `<div><b>٢.</b> مؤشّر الانقسام المتساوي = نسبة عدد الخلايا في أطوار الانقسام المتساوي إلى عدد الخلايا في الطور البيني = ${L(`(${c.P} + ${c.M} + ${c.A} + ${c.T}) ÷ ${c.I} = ${R.index === null ? '—' : R.index.toFixed(2)}`)}</div>`;
      h += `<div><b>٣.</b> العدد الكلي للخلايا التي جرى عدّها = ${R.total}: ` + PH.map(p => `${PNAME[p]} ${L(`${c[p]}/${R.total} × 100 = ${R.pct[p]} %`)}`).join('؛ ') + '</div>';
      h += `<div><b>٤.</b> الوقت الإجمالي لمدة دورة خليّة واحدة = 9 ساعات = ${L(R.minutes)} دقيقة: ` + PH.map(p => `${PNAME[p]} ${L(`${R.pct[p]}%`)} من ${L(R.minutes)} = <b>${R.min[p]}</b> دقيقة`).join('؛ ') + '</div>';
      if (this.b.sample && this.b.cls.every((x, i) => x === this.b.sl.truth[i])) h += ok('النتائج مطابقة لعيِّنة نتائج دليل المعلِّم (ص ٢٢٣): 65.1% ← 352 دقيقة، 13.3% ← 72، 7.2% ← 39، 3.6% ← 19، 10.8% ← 58، والمؤشِّر 0.54.');
      return h + '</div>' + this.pieSvg(c, R);
    },
    pieSvg(c, R){
      let o = svgOpen(270) + T(350, 26, '٥. تمثيل بياني دائري للزمن الذي تستغرقه الخليّة في كل طور (9 ساعات)', { fs:17, b:1, c:DARK });
      const cx = 180, cy = 148, rr = 108; let a0 = -Math.PI / 2;
      PH.forEach(p => {
        const fr = c[p] / R.total; if (!fr) return;
        const a1 = a0 + fr * 2 * Math.PI, big = fr > 0.5 ? 1 : 0;
        const x0 = cx + rr * Math.cos(a0), y0 = cy + rr * Math.sin(a0), x1 = cx + rr * Math.cos(a1), y1 = cy + rr * Math.sin(a1);
        o += fr >= 0.9999 ? `<circle cx="${cx}" cy="${cy}" r="${rr}" fill="${PCOL[p]}"/>` : `<path d="M${cx},${cy} L${x0.toFixed(1)},${y0.toFixed(1)} A${rr},${rr} 0 ${big} 1 ${x1.toFixed(1)},${y1.toFixed(1)} z" fill="${PCOL[p]}" stroke="#fff" stroke-width="2"/>`;
        a0 = a1;
      });
      PH.forEach((p, i) => {
        const y = 66 + i * 40;
        o += `<rect x="640" y="${y - 16}" width="22" height="22" rx="4" fill="${PCOL[p]}"/>` + T(630, y, `الطور ${PNAME[p]}`, { a:'end', fs:17, b:1 });
        o += T(470, y, `${R.pct[p]}% · ${R.min[p]} دقيقة`, { a:'end', fs:17, c:'#37474f' });
      });
      return o + '</svg>';
    },
    palette(){
      const b = this.b;
      return `<div style="${S.ctrl}"><span>صنِّف كطور:</span>` + PH.map(p => `<button style="font-family:${F};font-size:16px;padding:4px 10px;border-radius:8px;cursor:pointer;border:2px solid ${PCOL[p]};${b.pick === p ? `background:${PCOL[p]};color:#fff;` : `background:#fff;color:${PCOL[p]};`}" onclick="G11SIM_mitosis.setPick('${p}')">${PNAME[p]}</button>`).join('') +
        `<button style="${btn(b.pick === 'X', 'border-color:#78909c;')}" onclick="G11SIM_mitosis.setPick('X')">ممحاة</button></div>`;
    },
    defHtml(){
      const b = this.b, p = b.last || (b.pick !== 'X' ? b.pick : 'I');
      let h = `<div style="${S.panel}border-color:${PCOL[p]};"><b style="color:${PCOL[p]};">الطور ${PNAME[p]}:</b> ${PDEF[p]}<div>${figLink(p)}</div>`;
      if (b.checked && b.lastTruth && b.lastTruth !== b.lastMine) h += warn(`هذه الخليّة في الطور ${PNAME[b.lastTruth]} لا ${PNAME[b.lastMine]}.`);
      return h + '</div>';
    },
    fieldNav(){
      const b = this.b;
      return `<div style="${S.ctrl}justify-content:center;">` + [0, 1, 2].map(f => { const fr = b.sl.fields[f], left = b.cls.slice(fr.from, fr.to).filter(x => !x).length;
        return `<button style="${btn(b.field === f)}" onclick="G11SIM_mitosis.setField(${f})">مجال الرؤية ${AR(f + 1)}${left ? '' : ' ✓'}</button>`; }).join('') +
        `<button style="${btn(false)}" onclick="G11SIM_mitosis.checkB()">تحقَّق من تصنيفي</button>` +
        `<button style="${btn(false)}" onclick="G11SIM_mitosis.fillSample()">املأ بنتائج عيِّنة الدليل</button>` +
        `<button style="${btn(false)}" onclick="G11SIM_mitosis.clearB()">امسح</button>` +
        `<button style="${btn(false)}" onclick="G11SIM_mitosis.newSlide()">شريحة أخرى</button></div>`;
    },
    refreshB(part){
      const set = (id, h) => { const e = $(id); if (e) e.innerHTML = h; };
      set('g11y_field', this.fieldSvg()); set('g11y_nav', this.fieldNav()); set('g11y_pal', this.palette());
      set('g11y_def', this.defHtml()); set('g11y_tab', this.tableHtml()); set('g11y_calc', this.calcHtml());
    },
    tap(gi){
      const b = this.b;
      if (b.pick === 'X') { b.cls[gi] = null; b.last = null; b.lastTruth = null; }
      else { b.cls[gi] = b.pick; b.last = b.pick; b.lastMine = b.pick; b.lastTruth = b.sl.truth[gi]; }
      this.refreshB();
    },
    setPick(p){ this.b.pick = p; this.b.last = p === 'X' ? null : p; this.b.lastTruth = null; this.refreshB(); },
    setField(f){ this.b.field = f; this.refreshB(); },
    checkB(){ this.b.checked = true; this.refreshB(); },
    fillSample(){ this.resetB(); this.b.cls = this.b.sl.truth.slice(); this.refreshB(); },
    clearB(){ this.b.cls = this.b.cls.map(() => null); this.b.checked = false; this.refreshB(); },
    newSlide(){
      const r = rng(Date.now() & 0xffff), cnt = { I: 48 + Math.floor(r() * 14), P: 8 + Math.floor(r() * 6), M: 4 + Math.floor(r() * 4), A: 2 + Math.floor(r() * 3), T: 6 + Math.floor(r() * 5) };
      let tot = PH.reduce((s, p) => s + cnt[p], 0); while (tot > 84) { cnt.I--; tot--; }
      this.resetB(cnt, 1 + Math.floor(r() * 9999)); this.refreshB();
    },
    viewB(){
      return `<div style="${S.panel}margin-top:0;">«حدّد مجال رؤية التي تريد ملاحظتها، واحسب عدد الخلايا التي تمرّ في كل طور، وسجّل الأعداد بطريقة Tally الواردة في الجدول ٤-٢.» ${src(131, AB)} — اختر طورًا ثمّ انقر الخليّة لتصنيفها.</div>` +
        `<div id="g11y_pal">${this.palette()}</div><div id="g11y_field" style="margin-top:6px;">${this.fieldSvg()}</div><div id="g11y_nav">${this.fieldNav()}</div>` +
        `<div id="g11y_def">${this.defHtml()}</div><div id="g11y_tab">${this.tableHtml()}</div><div id="g11y_calc">${this.calcHtml()}</div>` +
        `<div style="${S.panel}color:#455a64;">مهم: «تأكّد من تحريك الشريحة بما يكفي في كل مرّة، بحيث لا تعدّ الخلايا نفسها مرّة أخرى.» ${src(131, AB)}</div>`;
    },

    build(i){
      if (i === 1) { if (!this.b) this.resetB(); return `<div style="${S.wrap}"><div id="g11y_b">${this.viewB()}</div></div>`; }
      if (!this.a) this.resetA(false);
      return `<div style="${S.wrap}"><div id="g11x_a">${this.viewA()}</div></div>`;
    }
  };

  G.simulations = Object.assign(G.simulations || {}, {
    g11_mitosis_lab: {
      sem:'S1', title:'مختبر الانقسام المتساوي',
      stages:['مهروس قمة الجذر (٤-١)', 'عدّ الخلايا في شريحة جاهزة (٤-٢)'],
      info:[
        'يحدث الانقسام المتساوي في النبات في أجزاء محدّدة منه فقط، تسمّى الأنسجة الموّلدة. يوجد نسيج موّلد خلف قمة الجذر مباشرة. ستستخدم في هذا الاستقصاء جذورًا فتية نشطة النمو لكي تصبغها باستخدام صِبغ مناسب، وتشاهد الكروموسومات داخل الخليّة في أطوار مختلفة من دورة انقسام الخليّة. إجراء الاستقصاء ليس صعبًا، لكن يصعب ضمان نجاحه. وإذا لم تتمكّن من مشاهدة خلايا في حالة انقسام من محاولتك الأولى، فاستفد من الجدول ٤-١ الوارد في الصفحة 129 للمساعدة. (كتاب التجارب العمليّة والأنشطة ص ١٢٦)',
        'تكون الأعداد النسبيّة للخلايا، في كل طور من دورة الخلية، مؤشّرًا جيّدًا على الزمن النسبي الذي يستغرقه كل طور. على سبيل المثال: إذا شوهد الطور الاستوائي في 80% تقريبًا من الخلايا، فهذا يدل على أن الطور المذكور يستغرق 80% تقريبًا من الزمن لكل دورة خليّة. افترض أن دورة الخليّة الكليّة في هذا النبات تستغرق 9 ساعات. (كتاب التجارب العمليّة والأنشطة ص ١٣٢)'
      ],
      build(i){ return M.build(i); }
    }
  });
})();
