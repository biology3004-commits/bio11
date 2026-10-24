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

// ═══════════════════════════════════════════════════════════════════════════════════════════════
// محاكيات دروس الوحدة 4 (أدوات يتصرَّف فيها الطالب ويتلقَّى تغذية راجعة؛ لا تكرِّر ديوراما chromosome_cycle / mitosis / cancer):
//   g11_cell_cycle (٤-١/٤-٢) · g11_mitosis_order (٤-٣) · g11_telomeres (٤-٤/٤-٥)
// الاقتباسات «…» حرفيّاً من كتاب الطالب (المطبوعة ١٢٨–١٤١، طوبقت على صور الصفحات) ومن دليل المعلِّم ج2 (ص ٢١٠–٢١١).
// التسميات القصيرة ورسائل التوجيه من صياغة المنصَّة؛ وما وُسم «توضيحي» (منحنى كمِّيَّة DNA، أطوال التيلومير) ليس في الكتاب.
// ═══════════════════════════════════════════════════════════════════════════════════════════════
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
    rng: `width:260px;accent-color:${TEAL};vertical-align:middle;`,
    num: `font-family:${F};font-size:16px;width:90px;padding:3px 6px;border:2px solid #80cbc4;border-radius:6px;direction:ltr;text-align:center;background:#fff;`,
    sel: `font-family:${F};font-size:16px;padding:4px 6px;border:2px solid #80cbc4;border-radius:6px;background:#fff;max-width:100%;`,
  };
  const btn = (on, extra) => `font-family:${F};font-size:16px;padding:5px 12px;border-radius:8px;border:2px solid ${TEAL};cursor:pointer;` +
    (on ? `background:${TEAL};color:#fff;` : `background:#fff;color:${DARK};`) + (extra || '');
  const L = s => `<span dir="ltr" style="unicode-bidi:isolate;white-space:nowrap;">${s}</span>`;
  const svgOpen = (h, id, extra) => `<svg ${id ? `id="${id}" ` : ''}viewBox="0 0 700 ${h}" width="100%" style="display:block;max-width:700px;margin:0 auto;background:#fff;border-radius:10px;font-family:${F};direction:ltr;${extra || ''}" xmlns="http://www.w3.org/2000/svg">`;
  function T(x, y, s, o){
    o = o || {};
    const an = o.a || 'middle', a2 = o.ltr ? an : (an === 'end' ? 'start' : (an === 'start' ? 'end' : an));
    return `<text x="${x}" y="${y}" font-size="${o.fs || 16}" fill="${o.c || '#1a1a1a'}" text-anchor="${a2}"` +
      `${o.b ? ' font-weight="700"' : ''}${o.ltr ? ' direction="ltr"' : ' direction="rtl"'}${o.x || ''}>${s}</text>`;
  }
  const src = (p, book) => `<span style="color:#546e7a;">(${book || 'كتاب الطالب'} ص ${AR(p)})</span>`;
  const GD = 'دليل المعلِّم ج2';
  const ok = s => `<div style="color:${GREEN};font-weight:700;">✓ ${s}</div>`;
  const warn = s => `<div style="color:${RED};font-weight:700;">✗ ${s}</div>`;
  const ILL = `<span style="display:inline-block;background:#fff3e0;color:#e65100;border:1px solid #ffb74d;border-radius:6px;padding:0 6px;font-size:16px;font-weight:700;">توضيحي</span>`;
  const pt = (cx, cy, r, b) => [cx + r * Math.sin(b * Math.PI / 180), cy - r * Math.cos(b * Math.PI / 180)];
  const f = (x, d) => Number(x.toFixed(d == null ? 1 : d));
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  // ════════════════════════ رسم كروموسوم بأسلوب الشكل ٤-١ (أشرطة جينات + تيلوميرات) ════════════════════════
  const BANDS = ['#f9a825', '#7cb342', '#e57373', '#4fc3f7', '#ba68c8', '#ffb74d', '#4db6ac', '#f06292', '#9575cd', '#aed581'];
  const PINK = '#ec407a';
  function chromatidV(x, yc, up, dn, w, op){
    const arm = (y0, len, off) => {
      let s = `<rect x="${f(x - w / 2)}" y="${f(y0)}" width="${w}" height="${f(len)}" rx="${w / 2}" fill="#eceff1" stroke="#37474f" stroke-width="1.5"/>`;
      const n = Math.max(0, Math.floor((len - 15) / 7) + 1);
      for (let i = 0; i < n; i++) s += `<rect x="${f(x - w / 2 + 2)}" y="${f(y0 + 7 + i * 7)}" width="${w - 4}" height="4" fill="${BANDS[(i + off) % BANDS.length]}"/>`;
      return s;
    };
    let g = arm(yc - up - 2, up, 0) + arm(yc + 2, dn, 5);
    g += `<rect x="${f(x - w / 2 + 1.5)}" y="${f(yc - up - 1)}" width="${w - 3}" height="5" rx="2.5" fill="${PINK}"/>`;
    g += `<rect x="${f(x - w / 2 + 1.5)}" y="${f(yc + dn - 4)}" width="${w - 3}" height="5" rx="2.5" fill="${PINK}"/>`;
    return `<g${op != null ? ` opacity="${op}"` : ''}>${g}</g>`;
  }
  const centro = (x, y, rx) => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${rx}" ry="5" fill="#b0bec5" stroke="#37474f" stroke-width="1.5"/>`;
  function sisterPair(x, yc, up, dn, w){
    return chromatidV(x - w / 2 - 1, yc, up, dn, w) + chromatidV(x + w / 2 + 1, yc, up, dn, w) + centro(x, yc, w);
  }

  // ════════════════════════ ١) دورة الخليَّة — g11_cell_cycle ════════════════════════
  // نسب القطاعات مقيسة من الشكل ٤-٢ (ص ١٣٠) بالدرجات، مع عقارب الساعة بدءاً من بداية G1:
  // G1 ≈ 210° · S ≈ 13° · G2 ≈ 59° · M ≈ 69° · انقسام السيتوبلازم ≈ 9°  (يبدأ G1 عند 78° من الأعلى)
  const A0 = 78;
  const SEG = [
    { k:'G1', deg:210, col:'#f8c6c6', name:`الطور ${L('G<sub>1</sub>')}`, grp:'الطور البيني' },
    { k:'S',  deg:13,  col:'#ef9a9a', name:'الطور S', grp:'الطور البيني' },
    { k:'G2', deg:59,  col:'#f8c6c6', name:`الطور ${L('G<sub>2</sub>')}`, grp:'الطور البيني' },
    { k:'M',  deg:69,  col:'#c6e5f7', name:'الطور M (الانقسام المتساوي)', grp:'' },
    { k:'C',  deg:9,   col:'#fff176', name:'انقسام السيتوبلازم', grp:'' },
  ];
  (function(){ let a = 0; SEG.forEach(s => { s.t0 = a / 360; a += s.deg; s.t1 = a / 360; }); })();
  const CC_DESC = {
    G1: `«أثناء الطور ${L('G<sub>1</sub>')} تُكوِّن الخلية RNA والإنزيمات وبروتينات أخرى تحتاج إليها للنمو» ${src(130)}`,
    S:  `«وفي الطور S يتضاعف DNA في النواة، ليصبح كل كروموسوم مكونًا من كروماتيدَين متطابقَين.» ${src(130)}`,
    G2: `«وأثناء الطور ${L('G<sub>2</sub>')} تستمر الخليّة في النمو، ويجري تدقيق تركيب DNA الذي تكوّن أثناء طور S، وإصلاح أي خطأ فيه. كما تجري الاستعدادات للبدء بعمليّة الانقسام، على سبيل المثال: تحدث زيادة كبيرة في إنتاج بروتين تيوبيولين Tubulin اللازم لتكوين الأنيبيبات الدقيقة المكوّنة لخيوط المغزل.» ${src(130)}`,
    M:  `«يحدث بعد الطور البيني الانقسام المتساوي، والذي يسمّى الطور M (تعود M إلى Mitosis)، الذي به تنقسم المادة الوراثية لينتج نواتَين متطابقتَين جينيًا.» ${src(130)}`,
    C:  `«بعد الطور M تخضع الخلية بأكملها للانقسام منتجة خليتين متطابقتين جينيًا. في الخلايا الحيوانيّة يتخصر غشاء سطح الخلية بين النواتَين الجديدتَين، مكونًا شقّ انقسام Cleavage furrow في وسط الخلية؛ تسمّى هذه العملية انقسام السيتوبلازم Cytokinesis. أمّا في الخلايا النباتيّة، فتتكوّن جُدُر خلويّة جديدة بين النواتَين الجديدتَين.» ${src('130–131')}`,
  };
  // عبارات «أين يحدث هذا؟» — مقتطفات حرفيَّة من ص ١٣٠–١٣٢
  const CC_QZ = [
    { k:'G1', q:`تُكوِّن الخلية RNA والإنزيمات وبروتينات أخرى تحتاج إليها للنمو`, p:130 },
    { k:'S',  q:`يتضاعف DNA في النواة، ليصبح كل كروموسوم مكونًا من كروماتيدَين متطابقَين`, p:130 },
    { k:'G2', q:`يجري تدقيق تركيب DNA الذي تكوّن أثناء طور S، وإصلاح أي خطأ فيه`, p:130 },
    { k:'G2', q:`تحدث زيادة كبيرة في إنتاج بروتين تيوبيولين Tubulin اللازم لتكوين الأنيبيبات الدقيقة المكوّنة لخيوط المغزل`, p:130 },
    { k:'M',  q:`تنقسم المادة الوراثية لينتج نواتَين متطابقتَين جينيًا`, p:130 },
    { k:'C',  q:`يتخصر غشاء سطح الخلية بين النواتَين الجديدتَين، مكونًا شقّ انقسام Cleavage furrow في وسط الخلية`, p:130 },
    { k:'C',  q:`(في الخلايا النباتيّة) تتكوّن جُدُر خلويّة جديدة بين النواتَين الجديدتَين`, p:131 },
    { k:'S',  q:`يتكوّن جسمان مركزيان (بتضاعف الجسم المركزي الأصلي أثناء طور S من دورة الخليّة)`, p:132 },
  ];
  const CX = 520, CY = 185, R = 115;

  window.G11SIM_cc = {
    t: 0.25, drag: false, qi: 0, qorder: null, qans: null, score: 0, tries: 0,
    seg(t){ t = ((t % 1) + 1) % 1; for (const s of SEG) if (t < s.t1 - 1e-9) return { s, p: (t - s.t0) / (s.t1 - s.t0) }; return { s: SEG[4], p: 0.999 }; },
    dna(t){ const { s, p } = this.seg(t); return s.k === 'G1' ? 1 : s.k === 'S' ? 1 + p : (s.k === 'C' && p >= 0.5) ? 1 : 2; },

    // ---------- الحلقة ----------
    pie(clickable, hi){
      let g = '';
      SEG.forEach(s => {
        const b0 = A0 + s.t0 * 360, b1 = A0 + s.t1 * 360;
        const [x0, y0] = pt(CX, CY, R, b0), [x1, y1] = pt(CX, CY, R, b1);
        const big = s.deg > 180 ? 1 : 0;
        const on = hi && hi === s.k;
        g += `<path d="M${CX},${CY} L${f(x0)},${f(y0)} A${R},${R} 0 ${big} 1 ${f(x1)},${f(y1)} Z" fill="${s.col}" stroke="${on ? RED : '#455a64'}" stroke-width="${on ? 4 : 1.5}"` +
          (s.k === 'S' ? ` stroke-dasharray="${on ? '' : '6 4'}"` : '') +
          (clickable ? ` style="cursor:pointer;" onclick="G11SIM_cc.answer('${s.k}')"` : '') + `/>`;
      });
      // تسميات القطاعات
      const lab = (k, b, r, txt, o) => { const [x, y] = pt(CX, CY, r, b); return T(f(x), f(y + 6), txt, Object.assign({ ltr:true, b:true, fs:20, x:' pointer-events="none"' }, o || {})); };
      g += lab('G1', A0 + 105, 72, 'G₁') + lab('G2', A0 + 252, 72, 'G₂') + lab('M', 34, 72, 'M');
      g += T(CX, CY + 48, 'الطور البيني', { c:'#6d4c41', x:' pointer-events="none"' });
      // S بخطِّ دلالة
      const [sx, sy] = pt(CX, CY, R - 4, A0 + 216.5);
      g += `<line x1="${f(sx)}" y1="${f(sy)}" x2="440" y2="64" stroke="#455a64" stroke-width="1.5"/>` + T(404, 58, 'طور S: تضاعف DNA', { a:'start', fs:16 });
      // انقسام السيتوبلازم بخطِّ دلالة
      const [cx2, cy2] = pt(CX, CY, R - 3, 73.5);
      g += `<line x1="${f(cx2)}" y1="${f(cy2)}" x2="650" y2="112" stroke="#455a64" stroke-width="1.5"/>` + T(698, 92, 'انقسام', { a:'end' }) + T(698, 110, 'السيتوبلازم', { a:'end' });
      const [mx, my] = pt(CX, CY, R - 10, 20);
      g += `<line x1="${f(mx)}" y1="${f(my)}" x2="588" y2="44" stroke="#455a64" stroke-width="1.5"/>` + T(600, 38, 'الانقسام المتساوي', { a:'middle' });
      // سهم اتِّجاه الدورة (مع عقارب الساعة)
      const [ax, ay] = pt(CX, CY, R + 14, 150), [bx, by] = pt(CX, CY, R + 14, 175);
      g += `<path d="M${f(ax)},${f(ay)} A${R + 14},${R + 14} 0 0 1 ${f(bx)},${f(by)}" fill="#455a64" fill-opacity="0" stroke="#455a64" stroke-width="2"/>`;
      const [hx, hy] = pt(CX, CY, R + 14, 178);
      g += `<polygon points="${f(hx)},${f(hy)} ${f(bx + 8)},${f(by - 6)} ${f(bx + 6)},${f(by + 8)}" fill="#455a64"/>`;
      return g;
    },

    // ---------- الكروموسوم ----------
    chrom(t){
      const { s, p } = this.seg(t);
      const X = 200, Y = 92;
      let g = '', cap = '';
      if (s.k === 'G1') {
        g = chromatidV(X, Y, 45, 62, 18) + centro(X, Y, 9);
        cap = 'كروموسوم من جزيء DNA واحد (كروماتيد واحد)';
      } else if (s.k === 'S') {
        g = chromatidV(X - 10, Y, 45, 62, 18) + chromatidV(X + 10, Y, 45, 62, 18, f(0.15 + 0.85 * p, 2)) + centro(X, Y, 18);
        cap = 'يتضاعف DNA: يتكوَّن الكروماتيد الشقيق';
      } else if (s.k === 'G2') {
        g = sisterPair(X, Y, 45, 62, 18);
        g += `<line x1="${X - 20}" y1="${Y - 44}" x2="${X - 62}" y2="${Y - 44}" stroke="#455a64" stroke-width="1.2"/>` + T(X - 66, Y - 39, 'تيلومير', { a:'end' });
        g += `<line x1="${X + 20}" y1="${Y}" x2="${X + 62}" y2="${Y}" stroke="#455a64" stroke-width="1.2"/>` + T(X + 66, Y + 5, 'سنترومير', { a:'start' });
        g += `<line x1="${X - 20}" y1="${Y + 35}" x2="${X - 62}" y2="${Y + 35}" stroke="#455a64" stroke-width="1.2"/>` + T(X - 66, Y + 40, 'كروماتيدان شقيقان', { a:'end' });
        cap = 'كروموسوم من كروماتيدَين متطابقَين';
      } else if (s.k === 'M') {
        if (p < 0.55) { g = sisterPair(X, Y, 32, 44, 22); cap = 'تقصر الكروموسومات وتسمك — كروماتيدان'; }
        else {
          const d = 18 + 95 * (p - 0.55) / 0.45;
          g = chromatidV(X - d, Y, 32, 44, 22) + centro(X - d, Y, 9) + chromatidV(X + d, Y, 32, 44, 22) + centro(X + d, Y, 9);
          g += `<line x1="${f(X - d - 14)}" y1="${Y}" x2="${f(X - d - 52)}" y2="${Y}" stroke="${TEAL}" stroke-width="2.5"/><polygon points="${f(X - d - 62)},${Y} ${f(X - d - 50)},${Y - 6} ${f(X - d - 50)},${Y + 6}" fill="${TEAL}"/>`;
          g += `<line x1="${f(X + d + 14)}" y1="${Y}" x2="${f(X + d + 52)}" y2="${Y}" stroke="${TEAL}" stroke-width="2.5"/><polygon points="${f(X + d + 62)},${Y} ${f(X + d + 50)},${Y - 6} ${f(X + d + 50)},${Y + 6}" fill="${TEAL}"/>`;
          cap = 'انفصل الكروماتيدان: ينتقل كلٌّ منهما إلى نواة ناتجة';
        }
      } else {
        if (p < 0.5) {
          g = `<path d="M${X - 150},${Y} C${X - 150},${Y - 70} ${X - 20},${Y - 70} ${X},${Y - 24} C${X + 20},${Y - 70} ${X + 150},${Y - 70} ${X + 150},${Y} C${X + 150},${Y + 70} ${X + 20},${Y + 70} ${X},${Y + 24} C${X - 20},${Y + 70} ${X - 150},${Y + 70} ${X - 150},${Y} Z" fill="#fff8e1" stroke="#8d6e63" stroke-width="2"/>`;
          cap = 'يتخصَّر غشاء سطح الخليَّة بين النواتَين';
        } else {
          g = `<ellipse cx="${X - 80}" cy="${Y}" rx="68" ry="62" fill="#fff8e1" stroke="#8d6e63" stroke-width="2"/><ellipse cx="${X + 80}" cy="${Y}" rx="68" ry="62" fill="#fff8e1" stroke="#8d6e63" stroke-width="2"/>`;
          cap = 'خليَّتان متطابقتان — في كلٍّ منهما كروماتيد واحد';
        }
        const dx = 80;
        g += chromatidV(X - dx, Y, 22, 30, 14) + centro(X - dx, Y, 7) + chromatidV(X + dx, Y, 22, 30, 14) + centro(X + dx, Y, 7);
      }
      return { g, cap };
    },

    // ---------- منحنى DNA (توضيحي) ----------
    gx(t){ return 70 + 305 * t; },
    gy(v){ return 345 - 55 * v; },
    dnaPath(t1){
      const pts = [];
      const add = (t, v) => pts.push(`${f(this.gx(t))},${f(this.gy(v))}`);
      const sS = SEG[1], sC = SEG[4];
      const steps = [[0, 1], [sS.t0, 1], [sS.t1, 2], [sC.t0 + (sC.t1 - sC.t0) * 0.5, 2], [sC.t0 + (sC.t1 - sC.t0) * 0.5, 1], [1, 1]];
      for (let i = 0; i < steps.length; i++) {
        const [t, v] = steps[i];
        if (t <= t1) { add(t, v); continue; }
        const [tp, vp] = steps[i - 1];
        const v1 = tp === t ? vp : vp + (v - vp) * (t1 - tp) / (t - tp);
        add(t1, v1); break;
      }
      return pts.join(' ');
    },
    graph(){
      let g = `<rect x="10" y="190" width="385" height="185" rx="6" fill="#fafafa" stroke="#cfd8dc"/>`;
      g += T(385, 212, 'كمِّيَّة DNA في الخليَّة', { a:'end', b:true }) + `<rect x="112" y="197" width="66" height="22" rx="5" fill="#fff3e0" stroke="#ffb74d"/>` + T(145, 214, 'توضيحي', { c:'#e65100', b:true });
      SEG.forEach(s => { g += `<rect x="${f(this.gx(s.t0))}" y="228" width="${f(305 * (s.t1 - s.t0))}" height="117" fill="${s.col}" fill-opacity="0.45"/>`; });
      g += `<line x1="70" y1="345" x2="378" y2="345" stroke="#37474f" stroke-width="2"/><line x1="70" y1="345" x2="70" y2="226" stroke="#37474f" stroke-width="2"/>`;
      [[1, '1'], [2, '2']].forEach(([v, s]) => { g += `<line x1="64" y1="${this.gy(v)}" x2="70" y2="${this.gy(v)}" stroke="#37474f" stroke-width="2"/>` + T(56, this.gy(v) + 6, s, { ltr:true, a:'end' }); });
      g += T(30, 300, 'نسبيَّة', { fs:16, x:` transform="rotate(-90 30 300)"` });
      [['G₁', SEG[0]], ['S', SEG[1]], ['G₂', SEG[2]], ['M', SEG[3]]].forEach(([s, sg]) => { g += T(f(this.gx((sg.t0 + sg.t1) / 2)), 366, s, { ltr:true, fs:16, b:true }); });
      g += `<polyline points="${this.dnaPath(1)}" fill="none" stroke="#b0bec5" stroke-width="3" stroke-dasharray="5 4"/>`;
      g += `<polyline id="g11cc_dnaP" points="${this.dnaPath(this.t)}" fill="none" stroke="${TEAL}" stroke-width="4" stroke-linejoin="round"/>`;
      g += `<line id="g11cc_dnaL" x1="${f(this.gx(this.t))}" y1="228" x2="${f(this.gx(this.t))}" y2="345" stroke="${RED}" stroke-width="1.5" stroke-dasharray="4 3"/>`;
      g += `<circle id="g11cc_dnaD" cx="${f(this.gx(this.t))}" cy="${f(this.gy(this.dna(this.t)))}" r="7" fill="${RED}" stroke="#fff" stroke-width="2"/>`;
      return g;
    },
    dnaTxt(t){ const v = this.dna(t), { s, p } = this.seg(t);
      if (s.k === 'S') return `تزداد من ${L('×1')} إلى ${L('×2')}`;
      if (s.k === 'C') return p < 0.5 ? `${L('×2')} في الخليَّة التي تنقسم` : `${L('×1')} في كلِّ خليَّة ناتجة`;
      return v === 2 ? `${L('×2')} (تضاعف DNA)` : `${L('×1')}`; },

    view0(){
      const t = this.t, c = this.chrom(t), b = A0 + t * 360;
      let h = svgOpen(380, 'g11cc_svg');
      h += `<rect x="10" y="8" width="385" height="172" rx="6" fill="#fafafa" stroke="#cfd8dc"/>` + T(385, 30, 'كروموسوم واحد في الخليَّة', { a:'end', b:true });
      h += `<g id="g11cc_chr">${c.g}</g>` + `<text id="g11cc_cap" x="200" y="172" font-size="16" fill="${DARK}" text-anchor="middle" direction="rtl" font-weight="700">${c.cap}</text>`;
      h += this.graph();
      h += this.pie(false);
      h += `<g id="g11cc_ptr" transform="rotate(${f(b)} ${CX} ${CY})"><line x1="${CX}" y1="${CY}" x2="${CX}" y2="${CY - R + 12}" stroke="${RED}" stroke-width="4" stroke-linecap="round"/><circle cx="${CX}" cy="${CY - R}" r="13" fill="${RED}" stroke="#fff" stroke-width="3"/></g><circle cx="${CX}" cy="${CY}" r="6" fill="${RED}"/>`;
      h += `<circle cx="${CX}" cy="${CY}" r="${R + 18}" fill="#fff" fill-opacity="0" style="cursor:grab;touch-action:none;" onpointerdown="G11SIM_cc.pd(event)" onpointermove="G11SIM_cc.pm(event)" onpointerup="G11SIM_cc.pu(event)" onpointercancel="G11SIM_cc.pu(event)"/>`;
      h += T(CX, 370, 'اسحب الإبرة الحمراء حول الدائرة', { c:'#546e7a' });
      return h + `</svg>`;
    },
    descHtml(){
      const { s } = this.seg(this.t);
      return `<div style="font-weight:700;color:${DARK};font-size:18px;">${s.name}${s.grp ? ` <span style="color:#6d4c41;font-weight:400;">— من ${s.grp}</span>` : ''}</div>` +
        `<div>${CC_DESC[s.k]}</div>` +
        `<div style="color:#37474f;">كمِّيَّة DNA في الخليَّة: <b id="g11cc_dnaT">${this.dnaTxt(this.t)}</b> ${ILL}</div>`;
    },
    build0(){
      return `<div style="${S.wrap}">${this.view0()}` +
        `<div style="${S.ctrl}"><label for="g11cc_rng">موضع المؤشِّر في الدورة:</label>` +
        `<input id="g11cc_rng" type="range" min="0" max="1000" step="1" value="${Math.round(this.t * 1000)}" style="${S.rng}" oninput="G11SIM_cc.set(this.value/1000)">` +
        `<button style="${btn(false)}" onclick="G11SIM_cc.jump(-1)">◀ الطور السابق</button><button style="${btn(true)}" onclick="G11SIM_cc.jump(1)">الطور التالي ▶</button></div>` +
        `<div id="g11cc_desc" style="${S.panel}">${this.descHtml()}</div>` +
        `<div style="${S.panel}color:#455a64;font-size:16px;">الدائرة مرسومة بنسب الشكل ٤-٢ ${src(130)} وتدور مع عقارب الساعة كما في سهمَيه. والنصُّ يذكر أنَّ «يشكل الطور البيني ${L('Interphase 90 %')} من دورة الخلية» ${src(130)}، أمَّا الرسم فتخطيطي. منحنى كمِّيَّة DNA ${ILL}: ليس في الكتاب رسم بياني لها، ورُسم ممَّا ينصُّ عليه (تضاعف DNA في الطور S، وانقسام الخليَّة إلى خليَّتين متطابقتين).</div></div>`;
    },
    set(t){
      t = Math.max(0, Math.min(0.9995, t)); const prev = this.seg(this.t).s.k; this.t = t;
      const b = A0 + t * 360, p = $('g11cc_ptr'); if (!p) return;
      p.setAttribute('transform', `rotate(${f(b)} ${CX} ${CY})`);
      const c = this.chrom(t); $('g11cc_chr').innerHTML = c.g; $('g11cc_cap').textContent = c.cap;
      $('g11cc_dnaP').setAttribute('points', this.dnaPath(t));
      const x = f(this.gx(t)); ['x1', 'x2'].forEach(a => $('g11cc_dnaL').setAttribute(a, x));
      $('g11cc_dnaD').setAttribute('cx', x); $('g11cc_dnaD').setAttribute('cy', f(this.gy(this.dna(t))));
      const r = $('g11cc_rng'); if (r && Math.abs(r.value / 1000 - t) > 0.0011) r.value = Math.round(t * 1000);
      if (this.seg(t).s.k !== prev) $('g11cc_desc').innerHTML = this.descHtml(); else $('g11cc_dnaT').innerHTML = this.dnaTxt(t);
    },
    jump(d){ const i = SEG.indexOf(this.seg(this.t).s); const j = (i + d + SEG.length) % SEG.length; this.set((SEG[j].t0 + SEG[j].t1) / 2); },
    evT(e){
      const svg = $('g11cc_svg'); const P = svg.createSVGPoint(); P.x = e.clientX; P.y = e.clientY;
      const q = P.matrixTransform(svg.getScreenCTM().inverse());
      let b = Math.atan2(q.x - CX, -(q.y - CY)) * 180 / Math.PI; b = (b + 360) % 360;
      return ((b - A0 + 360) % 360) / 360;
    },
    pd(e){ this.drag = true; try { e.target.setPointerCapture(e.pointerId); } catch(_) {} e.preventDefault(); this.set(this.evT(e)); },
    pm(e){ if (!this.drag) return; e.preventDefault(); this.set(this.evT(e)); },
    pu(){ this.drag = false; },

    // ---------- المرحلة 2: أين يحدث هذا؟ ----------
    build1(){
      if (!this.qorder) this.qorder = shuffle(CC_QZ.map((_, i) => i));
      const it = CC_QZ[this.qorder[this.qi % CC_QZ.length]];
      let h = svgOpen(330, 'g11cc_qsvg');
      h += `<rect x="10" y="10" width="385" height="310" rx="7" fill="#fafafa" stroke="#cfd8dc"/>`;
      h += T(385, 40, 'في أيِّ طور يحدث هذا؟', { a:'end', b:true, fs:18 });
      h += T(385, 70, 'انقر القطاع المناسب على الدائرة', { a:'end', c:'#546e7a' });
      h += T(385, 96, 'أو اختر من الأزرار تحت الرسم.', { a:'end', c:'#546e7a' });
      h += T(385, 140, `النتيجة: ${AR(this.score)} من ${AR(this.tries)}`, { a:'end', b:true, c:TEAL, fs:18 });
      h += this.pie(true, this.qans ? this.qans.pick : null);
      h += `</svg>`;
      const fb = this.qans ? this.qans.html : `<span style="color:#546e7a;">اختر الطور ثمَّ اقرأ التغذية الراجعة.</span>`;
      return `<div style="${S.wrap}"><div style="${S.panel}border-color:${TEAL};font-size:18px;"><b>العبارة:</b> «${it.q}» ${src(it.p)}</div>${h}` +
        `<div style="${S.ctrl}">${SEG.map(s => `<button style="${btn(false)}" onclick="G11SIM_cc.answer('${s.k}')">${s.name}</button>`).join('')}` +
        `<button style="${btn(true)}" onclick="G11SIM_cc.nextQ()">عبارة أخرى ▶</button></div>` +
        `<div id="g11cc_fb" style="${S.panel}">${fb}</div></div>`;
    },
    answer(k){
      if (this.qans && this.qans.done) return;
      const it = CC_QZ[this.qorder[this.qi % CC_QZ.length]], sg = SEG.find(s => s.k === it.k), pick = SEG.find(s => s.k === k);
      this.tries++;
      let html;
      if (k === it.k) { this.score++; html = ok(`صحيح: ${sg.name}${sg.grp ? ' — من ' + sg.grp : ''}.`) + `<div>${CC_DESC[it.k]}</div>`; }
      else html = warn(`ليس ${pick.name}. الصحيح: ${sg.name}${sg.grp ? ' — من ' + sg.grp : ''}.`) + `<div>${CC_DESC[it.k]}</div>`;
      if (it.k === 'S' && it.p === 132) html += `<div>${'«يتكوّن جسمان مركزيان (بتضاعف الجسم المركزي الأصلي أثناء طور S من دورة الخليّة)» — من الشكل ٤-٣ ' + src(132)}</div>`;
      this.qans = { pick: it.k, html, done: true };
      this.rerender(1);
    },
    nextQ(){ this.qi++; this.qans = null; if (this.qi % CC_QZ.length === 0) this.qorder = shuffle(CC_QZ.map((_, i) => i)); this.rerender(1); },

    // ---------- المرحلة 3: مؤشِّر الانقسام ومدَّة الدورة ----------
    N: 25000, n: 4, dur: 30, unit: 'min',
    calc(){
      const N = this.N, n = this.n, hrs = this.unit === 'min' ? this.dur / 60 : this.dur;
      if (!(N > 0) || !(n > 0) || n > N || !(hrs > 0)) return null;
      const idx = n / N, cyc = hrs / idx;
      return { idx, hrs, cyc, days: cyc / 24 };
    },
    fmt(x){ if (x >= 1) return String(Number(x.toFixed(2))); return String(Number(x.toPrecision(3))); },
    calcHtml(){
      const c = this.calc();
      if (!c) return warn('أدخل أعداداً موجبة، وعدد الخلايا المنقسمة لا يزيد على العدد الكلِّي.');
      const row = (a, b) => `<div style="margin:2px 0;">${a} ${b}</div>`;
      let h = row('مؤشِّر الانقسام المتساوي =', `${L(`${this.n} ÷ ${this.N} = ${this.fmt(c.idx)}`)}`);
      h += row('مدَّة الدورة الكلِّيَّة للخليَّة = مدَّة الانقسام المتساوي ÷ مؤشِّر الانقسام =', `${L(`${this.fmt(c.hrs)} ÷ ${this.fmt(c.idx)}`)} = <b>${L(this.fmt(c.cyc))} ساعة</b>`);
      h += row('بالأيَّام: بالقسمة على 24 =', `<b>${L(this.fmt(c.days))} يومًا</b>`);
      if (this.N === 25000 && this.n === 4 && this.unit === 'min' && this.dur === 30) h += ok(`تطابق مثال الكتاب: ${L('0.00016')} و${L('3125')} ساعة و${L('130.21')} يومًا ${src(131)}`);
      if (this.N === 75000 && this.n === 9 && ((this.unit === 'h' && this.dur === 1) || (this.unit === 'min' && this.dur === 60)))
        h += ok(`إجابة الدليل للسؤال ٥: «${L('75000 / 9')} … = ${L('8333')} ساعة … = ${L('347')} يومًا» ${src(211, GD)} (الدليل قرَّب الناتج إلى أعداد صحيحة)`);
      return h;
    },
    build2(){
      const inp = (id, v, fn) => `<input id="${id}" type="number" min="0" step="any" value="${v}" style="${S.num}" oninput="G11SIM_cc.inp('${fn}', this.value)">`;
      return `<div style="${S.wrap}">` +
        `<div style="${S.panel}border-color:${TEAL};"><b>مثال الكتاب:</b> «إذا توافرت عيّنة مكوّنة من 25000 خليّة لوحظ منها أربع خلايا فقط تمر في عمليّة انقسام متساوٍ. ما متوسط دورة الخليّة في الكائن الحي الذي أخذت منه هذه العيّنة، إذا استغرق الانقسام المتساوي 30 دقيقة؟» ${src(131)}</div>` +
        `<div style="${S.ctrl}"><label>العدد الكلِّي للخلايا: ${inp('g11cc_N', this.N, 'N')}</label>` +
        `<label>الخلايا التي تمرُّ في الانقسام المتساوي: ${inp('g11cc_n', this.n, 'n')}</label>` +
        `<label>مدَّة الانقسام المتساوي: ${inp('g11cc_d', this.dur, 'dur')}</label>` +
        `<select style="${S.sel}" onchange="G11SIM_cc.inp('unit', this.value)"><option value="min"${this.unit === 'min' ? ' selected' : ''}>دقيقة</option><option value="h"${this.unit === 'h' ? ' selected' : ''}>ساعة</option></select></div>` +
        `<div style="${S.ctrl}"><button style="${btn(false)}" onclick="G11SIM_cc.preset(0)">مثال الكتاب (ص ${AR(131)})</button>` +
        `<button style="${btn(false)}" onclick="G11SIM_cc.preset(1)">السؤال ٥: خلايا كبد الفأر (ص ${AR(136)})</button></div>` +
        `<div id="g11cc_calc" style="${S.panel}font-size:17px;">${this.calcHtml()}</div>` +
        `<div style="${S.panel}color:#455a64;">«مؤشر الانقسام المتساوي = عدد الخلايا التي تمر في عملية الانقسام المتساوي ÷ العدد الكلي للخلايا» و«مدة الدورة الكليّة للخليّة = مدة الانقسام المتساوي ÷ مؤشر الانقسام» ${src(131)}. السؤال ٥: «وأثناء فحص عينة من 75000 خليّة، وجدت 9 خلايا في حالة الانقسام المتساوي. احسب طول دورة الخليّة بالأيام في خلايا كبد الفأر، بافتراض أن الانقسام يستغرق ساعة واحدة.» ${src(136)}</div></div>`;
    },
    inp(k, v){ if (k === 'unit') this.unit = v; else this[k] = Number(v); const el = $('g11cc_calc'); if (el) el.innerHTML = this.calcHtml(); },
    preset(i){ if (i === 0) Object.assign(this, { N:25000, n:4, dur:30, unit:'min' }); else Object.assign(this, { N:75000, n:9, dur:1, unit:'h' }); this.rerender(2); },

    rerender(i){ const st = $('simStage'); if (st) st.innerHTML = this.build(i); },
    build(i){ return i === 1 ? this.build1() : i === 2 ? this.build2() : this.build0(); }
  };

  // ════════════════════════ ٢) ترتيب أطوار الانقسام المتساوي — g11_mitosis_order ════════════════════════
  const MO_ORDER = ['P', 'M', 'A', 'T', 'C'];
  const MO_NAME = { P:'الطور التمهيدي', M:'الطور الاستوائي', A:'الطور الانفصالي', T:'الطور النهائي', C:'انقسام السيتوبلازم' };
  const MO_COL = { P:'#1e88e5', M:'#009A44', A:'#C8102E', T:'#ef6c00', C:'#6d4c41' };
  // من تسميات الشكل ٤-٣ (ص ١٣٢) حرفيّاً
  const MO_DESC = {
    P1: `بداية الطور التمهيدي: «يبدأ ظهور الكروموسومات على شكل لفائف من الكروماتين، وتقصر وتسمك بما يكفي لأن تشاهد عندما تصبغ، ومازال لا يشاهد بوضوح أن كل كروموسوم مكوّن من كروماتيدين.» · «يتكوّن جسمان مركزيان (بتضاعف الجسم المركزي الأصلي أثناء طور S من دورة الخليّة)»`,
    P2: `نهاية الطور التمهيدي: «يتفكك الغلاف النووي (يتفكك ويشكّل حويصلات صغيرة لا تشاهد بالمجهر الضوئي)» · «تختفي النوية» · «تشاهد الكروموسومات مكوّنة من كروماتيدَين متطابقَين، يحتوي كل كروماتيد على جُزيء DNA واحد» · «يتحرك الجسمان المركزيان باتجاه الطرفَين المتقابلَين للنواة»`,
    M: `الطور الاستوائي: «يصل كل جسم مركزي إلى أحد القطبَين. تساعد الأجسام المركزية في تنظيم إنتاج الأنيبيبات الدقيقة لخيوط المغزل» · «خيوط المغزل (مكونة من أنيبيبات دقيقة)» · «تصطف الكروموسومات على امتداد خط استواء الخلية، وهي ترتبط بخيوط المغزل عبر سنتروميراتها»`,
    A: `انفصال الكروماتيدات: «ينشطر كل كروموسوم عند السنترومير» · «تبدأ الكروماتيدات بالتباعد (الانفصال) بفعل تقصّر الأنيبيبات الدقيقة لخيوط المغزل» — الطور الانفصالي: «تتحرك الكروماتيدات باتجاه القطبَين المتقابلَين، حيث تتحرك السنتروميرات أولًا بفعل تقصّر الأنيبيبات الدقيقة لخيوط المغزل»`,
    T: `الطور النهائي: «تصل الكروماتيدات إلى قطبَي الخلية، وينفكّ التفافها مرة أخرى (يحتوي كل كروماتيد على جُزيء DNA واحد، يتضاعف أثناء الطور البيني قبل الانقسام التالي)» · «إعادة تكوين الغلاف النووي» · «إعادة ظهور النوية» · «بقايا من خيوط المغزل المتحلل»`,
    C: `«انقسام السيتوبلازم (انقسام السيتوبلازم والخليّة إلى خليتَين عن طريق حدوث التخصر أو شق انقسام)» ${src(132)} · «ومع اكتمال الطور النهائي، تنقسم الخليّة عن طريق تخصُّر السيتوبلازم، في عمليّة تسمّى انقسام السيتوبلازم.» ${src(131)}`,
  };
  const descOf = d => (d === 'C' ? MO_DESC.C : MO_DESC[d] + ' ' + src(132));
  const phaseOf = d => (d === 'P1' || d === 'P2') ? 'P' : d;
  // عدَّاد الخليَّة المثال في الشكل ٤-٣: «خليّة تحتوي فقط على أربعة كروموسومات» (ص ١٣١)
  const MO_COUNT = {
    P: [['الكروموسومات', '4'], ['الكروماتيدات', '8'], ['جزيئات DNA', '8']],
    M: [['الكروموسومات', '4'], ['الكروماتيدات', '8'], ['جزيئات DNA', '8']],
    A: [['الكروموسومات', 'انشطر كلٌّ منها عند السنترومير'], ['الكروماتيدات المنفصلة', '8 (4 نحو كلِّ قطب)'], ['جزيئات DNA', '8']],
    T: [['الكروماتيدات', '4 عند كلِّ قطب'], ['جزيئات DNA في الخليَّة', '8 (4 في كلِّ نواة)']],
    C: [['في كلِّ خليَّة ناتجة: الكروموسومات', '4'], ['الكروماتيدات', 'كروماتيد واحد لكلِّ كروموسوم'], ['جزيئات DNA', '4']],
  };
  const countHtml = ph => MO_COUNT[ph].map(([a, b]) => `<span style="display:inline-block;margin:2px 4px;padding:1px 8px;border-radius:6px;background:#eceff1;">${a}: <b>${b.replace(/\d+/g, m => L(m))}</b></span>`).join('');

  // ---------- رسم خليَّة حيوانيَّة بأسلوب الشكل ٤-٣ (نصف قطر 100 وحدة) ----------
  const CR = '#e53935', CB = '#3d8bd4', CELLF = '#f9d9a8', CELLS = '#c98a3a', NUCF = '#b9b0e0', NUCS = '#5e4fa2';
  const sg = (x1, y1, x2, y2, c, w) => `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="#263238" stroke-width="${w + 2}" stroke-linecap="round"/><line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
  const cdot = (x, y) => `<circle cx="${f(x)}" cy="${f(y)}" r="3.4" fill="#fff" stroke="#263238" stroke-width="1.3"/>`;
  const pole = (x, y) => `<circle cx="${f(x)}" cy="${f(y)}" r="3.6" fill="#1565c0"/>`;
  function dupChr(x, y, len, ang, c, cp){
    const a = ang * Math.PI / 180, ux = Math.cos(a), uy = Math.sin(a), px = -uy * 3.6, py = ux * 3.6;
    const x1 = x - ux * len * cp, y1 = y - uy * len * cp, x2 = x + ux * len * (1 - cp), y2 = y + uy * len * (1 - cp);
    return sg(x1 + px, y1 + py, x2 + px, y2 + py, c, 5) + sg(x1 - px, y1 - py, x2 - px, y2 - py, c, 5) + cdot(x, y);
  }
  function vChr(x, y, len, dir, c, cp){ // كروماتيد في الطور الانفصالي: السنترومير يتقدَّم نحو القطب (dir=-1 للأعلى)
    const s = Math.sin(0.42), co = Math.cos(0.42), a1 = len * cp, a2 = len * (1 - cp);
    return sg(x, y, x - a1 * s, y - dir * a1 * co, c, 5) + sg(x, y, x + a2 * s, y - dir * a2 * co, c, 5) + cdot(x, y);
  }
  function wavy(x1, y1, x2, y2, amp, n, c, w){
    const dx = x2 - x1, dy = y2 - y1, Ln = Math.hypot(dx, dy), nx = -dy / Ln, ny = dx / Ln, pts = [];
    for (let i = 0; i <= 24; i++) { const t = i / 24, o = amp * Math.sin(t * n * Math.PI * 2); pts.push(`${f(x1 + dx * t + nx * o)},${f(y1 + dy * t + ny * o)}`); }
    const P = pts.join(' ');
    return `<polyline points="${P}" fill="none" stroke="#263238" stroke-width="${w + 2}" stroke-linecap="round"/><polyline points="${P}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
  }
  const CHR = [[CR, 44, 0.4], [CB, 44, 0.4], [CR, 28, 0.45], [CB, 28, 0.45]]; // كروموسومان طويلان وقصيران؛ الأحمر والأزرق للأم والأب
  function eqX(){ const gap = 7, tot = CHR.reduce((s, c) => s + c[1], 0) + gap * 3; let x = -tot / 2; return CHR.map(c => { const cx = x + c[1] / 2; x += c[1] + gap; return cx; }); }
  function cellBody(ph){
    let g = '';
    if (ph === 'P1') {
      g += `<circle r="100" fill="${CELLF}" stroke="${CELLS}" stroke-width="3"/><circle r="60" fill="${NUCF}" stroke="${NUCS}" stroke-width="3"/><circle cx="-38" cy="14" r="8" fill="#3f2d8c"/>`;
      g += wavy(-30, -32, 28, 18, 6, 2.2, CR, 4) + wavy(-22, 30, 30, -30, 6, 2.5, CB, 4) + wavy(-8, -40, -4, 12, 5, 1.6, CB, 4) + wavy(4, 40, 40, 4, 5, 1.6, CR, 4);
      g += pole(76, -6) + pole(76, 6);
    } else if (ph === 'P2') {
      g += `<circle r="100" fill="${CELLF}" stroke="${CELLS}" stroke-width="3"/><circle r="60" fill="${NUCF}" stroke="${NUCS}" stroke-width="3" stroke-dasharray="8 6"/>`;
      g += dupChr(-20, -22, 44, 70, CR, 0.4) + dupChr(14, -10, 44, -20, CB, 0.4) + dupChr(-26, 22, 28, 20, CR, 0.45) + dupChr(16, 26, 28, 100, CB, 0.45);
      g += pole(70, -50) + pole(70, 50) + `<path d="M70,-50 Q84,0 70,50 M70,-50 Q76,0 70,50 M70,-50 Q92,0 70,50" fill="none" stroke="#8d6e63" style="stroke-width:1"/>`;
    } else if (ph === 'M') {
      g += `<circle r="100" fill="${CELLF}" stroke="${CELLS}" stroke-width="3"/>`;
      const xs = eqX();
      [-1, 1].forEach(s => { xs.forEach(x => { g += `<line x1="0" y1="${s * 88}" x2="${f(x)}" y2="0" stroke="#8d6e63" stroke-width="1"/>`; }); [-80, -50, 50, 80].forEach(x => { g += `<path d="M0,${s * 88} Q${x},0 0,${-s * 88}" fill="none" stroke="#bcaaa4" style="stroke-width:0.8"/>`; }); });
      CHR.forEach((c, i) => { g += dupChr(xs[i], 0, c[1], 0, c[0], 0.5); });
      g += pole(0, -88) + pole(0, 88);
    } else if (ph === 'A') {
      g += `<circle r="100" fill="${CELLF}" stroke="${CELLS}" stroke-width="3"/>`;
      const xs = eqX();
      [-80, -50, 50, 80].forEach(x => { g += `<path d="M0,-88 Q${x},0 0,88" fill="none" stroke="#bcaaa4" style="stroke-width:0.8"/>`; });
      CHR.forEach((c, i) => {
        g += `<line x1="0" y1="-88" x2="${f(xs[i])}" y2="-46" stroke="#8d6e63" stroke-width="1"/><line x1="0" y1="88" x2="${f(xs[i])}" y2="46" stroke="#8d6e63" stroke-width="1"/>`;
        g += vChr(xs[i], -46, c[1] * 0.9, -1, c[0], 0.45) + vChr(xs[i], 46, c[1] * 0.9, 1, c[0], 0.45);
      });
      g += pole(0, -88) + pole(0, 88);
    } else if (ph === 'T') {
      g += `<ellipse rx="82" ry="118" fill="${CELLF}" stroke="${CELLS}" stroke-width="3"/>`;
      for (let x = -16; x <= 16; x += 8) g += `<line x1="${x}" y1="-12" x2="${x}" y2="12" stroke="#8d6e63" stroke-width="1.2"/>`;
      [-1, 1].forEach(s => {
        const y = s * 58;
        g += `<circle cy="${y}" r="36" fill="${NUCF}" stroke="${NUCS}" stroke-width="3" stroke-dasharray="7 5"/><circle cx="12" cy="${y - s * 12}" r="5" fill="#3f2d8c" opacity="0.7"/>`;
        g += wavy(-22, y - 14, -6, y + 18, 3, 1.2, CR, 3.5) + wavy(-8, y - 22, 6, y + 14, 3, 1.2, CB, 3.5) + wavy(10, y + 2, 24, y + 20, 3, 1, CR, 3.5) + wavy(-26, y + 6, -14, y + 24, 3, 1, CB, 3.5);
        g += pole(0, s * 104);
      });
    } else { // C
      [-1, 1].forEach(s => { g += `<circle cy="${s * 60}" r="62" fill="${CELLF}" stroke="${CELLS}" stroke-width="5"/>`; });
      [-1, 1].forEach(s => { g += `<circle cy="${s * 60}" r="60" fill="${CELLF}"/>`; });
      [-1, 1].forEach(s => {
        const y = s * 60;
        g += `<circle cy="${y}" r="33" fill="${NUCF}" stroke="${NUCS}" stroke-width="3"/><circle cx="14" cy="${y - 10}" r="6" fill="#3f2d8c"/>`;
        g += wavy(-20, y - 14, -4, y + 18, 3, 1.2, CR, 3.5) + wavy(-6, y - 22, 8, y + 14, 3, 1.2, CB, 3.5) + wavy(8, y + 4, 22, y + 20, 3, 1, CR, 3.5) + wavy(-24, y + 6, -12, y + 22, 3, 1, CB, 3.5);
        g += pole(0, y + s * 46);
      });
    }
    return g;
  }
  const cellG = (cx, cy, k, ph) => `<g transform="translate(${cx} ${cy}) scale(${k})">${cellBody(ph)}</g>`;
  const miniSVG = (ph, w) => `<svg viewBox="-125 -125 250 250" width="100%" style="display:block;margin:0 auto;min-width:0;max-width:${w}px;" xmlns="http://www.w3.org/2000/svg">${cellBody(ph)}</svg>`;
  const CARD_DRAW = { P:'P2', M:'M', A:'A', T:'T', C:'C' };
  const LET = ['أ', 'ب', 'ج', 'د', 'هـ'];

  window.G11SIM_mo = {
    pool: null, slots: [null, null, null, null, null], letters: {}, checked: null,
    reset0(){ const o = shuffle(MO_ORDER); this.pool = o.slice(); this.letters = {}; o.forEach((k, i) => this.letters[k] = LET[i]); this.slots = [null, null, null, null, null]; this.checked = null; },
    card(k, inSlot, i){
      const st = this.checked && inSlot ? (this.checked[i] ? `border-color:${GREEN};background:#e8f5e9;` : `border-color:${RED};background:#ffebee;`) : '';
      const lab = this.checked && inSlot && this.checked[i] ? `<div style="font-weight:700;color:${MO_COL[k]};font-size:16px;">${MO_NAME[k]}</div>` : `<div style="font-weight:700;color:#455a64;">الخليَّة (${this.letters[k]})</div>`;
      return `<button style="font-family:${F};width:min(124px,27vw);padding:4px;border:3px solid #80cbc4;border-radius:10px;background:#fff;cursor:pointer;${st}" ` +
        `onclick="G11SIM_mo.${inSlot ? `unpick(${i})` : `pick('${k}')`}" title="${inSlot ? 'أعِدها إلى البطاقات' : 'ضعها في أوَّل خانة فارغة'}">${miniSVG(CARD_DRAW[k], 108)}${lab}</button>`;
    },
    view0(){
      const slotH = this.slots.map((k, i) => `<div style="display:flex;flex-direction:column;align-items:center;gap:2px;"><div style="font-weight:700;color:${TEAL};">${AR(i + 1)}</div>` +
        (k ? this.card(k, true, i) : `<div style="width:min(124px,27vw);height:calc(min(124px,27vw) + 26px);border:3px dashed #b0bec5;border-radius:10px;display:flex;align-items:center;justify-content:center;color:#90a4ae;">خانة فارغة</div>`) + `</div>`).join('');
      const poolH = this.pool.length ? this.pool.map(k => this.card(k, false)).join('') : `<span style="color:#546e7a;">وُضعت البطاقات كلُّها — اضغط «تحقَّق».</span>`;
      let fb = `<span style="color:#546e7a;">انقر البطاقة لتضعها في أوَّل خانة فارغة (الخانة ١ أوَّل طور)، وانقر بطاقة في خانة لتعيدها.</span>`;
      if (this.err) fb = warn('ضع البطاقات الخمس في الخانات أوَّلاً.');
      if (this.checked) {
        const n = this.checked.filter(Boolean).length;
        if (n === 5) {
          fb = ok('أحسنت! الترتيب صحيح: الطور التمهيدي ← الطور الاستوائي ← الطور الانفصالي ← الطور النهائي ← انقسام السيتوبلازم.') +
            MO_ORDER.map((k, i) => `<div style="border-top:1px solid #e0e0e0;padding-top:4px;margin-top:4px;"><b style="color:${MO_COL[k]};">${AR(i + 1)}. ${MO_NAME[k]}</b><br>${k === 'P' ? MO_DESC.P1 + ' — ' + MO_DESC.P2 + ' ' + src(132) : descOf(k)}<br><span style="color:#37474f;">في الخليَّة المثال (4 كروموسومات):</span> ${countHtml(k)}</div>`).join('');
        } else {
          const w = this.checked.indexOf(false), need = MO_ORDER[w];
          fb = warn(`${AR(n)} من ٥ في مكانها الصحيح. البطاقات الحمراء في غير موضعها.`) +
            `<div>تلميح للخانة ${AR(w + 1)}: ابحث عن الخليَّة التي ينطبق عليها: ${need === 'P' ? MO_DESC.P2 + ' ' + src(132) : descOf(need)}</div>`;
        }
      }
      return `<div style="${S.wrap}"><div style="${S.panel}border-color:${TEAL};font-weight:700;">رتِّب الخلايا الخمس بحسب تسلسل أحداث الانقسام المتساوي وانقسام السيتوبلازم (الخليَّة المثال تحتوي على أربعة كروموسومات كما في الشكل ٤-٣).</div>` +
        `<div style="display:flex;flex-direction:row;gap:6px;justify-content:center;flex-wrap:wrap;margin-top:6px;">${slotH}</div>` +
        `<div style="${S.ctrl}justify-content:center;">${poolH}</div>` +
        `<div style="${S.ctrl}"><button style="${btn(true)}" onclick="G11SIM_mo.check()">تحقَّق ✓</button><button style="${btn(false)}" onclick="G11SIM_mo.clear()">إفراغ الخانات</button><button style="${btn(false)}" onclick="G11SIM_mo.reset0();G11SIM_mo.rr(0)">خلط جديد</button>` +
        `<a href="book_assets_s1/p131.jpg" target="_blank" rel="noopener" style="color:${TEAL};font-weight:700;">📖 الشكل ٤-٣ — ص ${AR(132)}</a></div>` +
        `<div style="${S.panel}">${fb}</div></div>`;
    },
    pick(k){ const i = this.slots.indexOf(null); if (i < 0) return; this.slots[i] = k; this.pool = this.pool.filter(x => x !== k); this.checked = null; this.rr(0); },
    unpick(i){ const k = this.slots[i]; if (!k) return; this.slots[i] = null; this.pool.push(k); this.checked = null; this.rr(0); },
    clear(){ this.slots.forEach(k => { if (k) this.pool.push(k); }); this.slots = [null, null, null, null, null]; this.checked = null; this.rr(0); },
    check(){
      if (this.slots.includes(null)) { this.checked = null; this.err = true; this.rr(0); this.err = false; return; }
      this.checked = this.slots.map((k, i) => k === MO_ORDER[i]); this.rr(0);
    },

    // ---------- المرحلة 2: حدِّد الطور ----------
    cur: null, ans: null, score: 0, tries: 0, last: null,
    newCell(){ const opts = ['P1', 'P2', 'M', 'A', 'T', 'C'].filter(x => x !== this.last); this.cur = opts[Math.floor(Math.random() * opts.length)]; this.last = this.cur; this.ans = null; },
    view1(){
      if (!this.cur) this.newCell();
      let h = svgOpen(320);
      h += `<rect x="6" y="6" width="688" height="308" rx="7" fill="#fafafa" stroke="#cfd8dc"/>`;
      h += cellG(520, 168, this.cur === 'T' || this.cur === 'C' ? 1.16 : 1.3, this.cur);
      h += T(310, 40, 'ما الطور الذي تمرُّ به', { a:'end', b:true, fs:18 }) + T(310, 64, 'هذه الخليَّة؟', { a:'end', b:true, fs:18 });
      ['انظر إلى:', '• الغلاف النووي والنوية', '• شكل الكروموسومات وموضعها', '• خيوط المغزل والأجسام المركزية', '• شكل غشاء سطح الخليَّة'].forEach((t, i) => { h += T(310, 108 + i * 28, t, { a:'end', c:'#455a64', b: i === 0 }); });
      h += T(310, 300, `النتيجة: ${AR(this.score)} من ${AR(this.tries)}`, { a:'end', b:true, c:TEAL, fs:18 });
      h += T(310, 262, 'رسم تخطيطي بأسلوب الشكل ٤-٣', { a:'end', c:'#78909c' });
      h += `</svg>`;
      let fb = `<span style="color:#546e7a;">انظر إلى الغلاف النووي والنوية وموضع الكروموسومات وخيوط المغزل، ثمَّ اختر.</span>`;
      if (this.ans) {
        const ph = phaseOf(this.cur);
        fb = (this.ans === ph ? ok(`صحيح: ${MO_NAME[ph]}${this.cur === 'P1' ? ' (بدايته)' : this.cur === 'P2' ? ' (نهايته)' : ''}.`) : warn(`ليس ${MO_NAME[this.ans]}. الصحيح: ${MO_NAME[ph]}${this.cur === 'P1' ? ' (بدايته)' : this.cur === 'P2' ? ' (نهايته)' : ''}.`)) +
          `<div>${descOf(this.cur)}</div><div style="color:#37474f;">عدَّاد الخليَّة (4 كروموسومات): ${countHtml(ph)}</div>`;
      }
      return `<div style="${S.wrap}">${h}<div style="${S.ctrl}">${MO_ORDER.map(k => `<button style="${btn(false, `border-color:${MO_COL[k]};`)}" onclick="G11SIM_mo.answer('${k}')">${MO_NAME[k]}</button>`).join('')}` +
        `<button style="${btn(true)}" onclick="G11SIM_mo.newCell();G11SIM_mo.rr(1)">خليَّة أخرى ▶</button><b style="color:${TEAL};">النتيجة: ${AR(this.score)} من ${AR(this.tries)}</b></div><div style="${S.panel}">${fb}</div></div>`;
    },
    answer(k){ if (this.ans) return; this.ans = k; this.tries++; if (k === phaseOf(this.cur)) this.score++; this.rr(1); },

    // ---------- المرحلة 3: السنترومير والحيِّز الحركي والأنيبيبات الدقيقة (الشكل ٤-٤) ----------
    s: 0, part: null, n: 4,
    PART: {
      cen: { n:'السنترومير', t:`«يربط السنترومير الكروماتيدَين الشقيقَين انظر الصورة ٤-٢، والشكل ٤-٤. وله أيضًا دور في فصل الكروماتيدات أثناء الانقسام المتساوي، ففي الطور الاستوائي ترتبط خيوط المغزل بحيزَين حركيَّين Kinetochores في السنترومير لكل كروماتيد من الكروموسوم الواحد كما هو موضّح في الشكل ٤-٤.» ${src(134)} · «السنترومير (يربط الكروماتيدين معًا. لا توجد جينات في هذه المنطقة).» ${src(129)}` },
      kin: { n:'الحيِّز الحركي', t:`«الحيز الحركي Kinetochores: تركيب بروتيني يوجد في سنترومير الكروماتيد ترتبط به خيوط المغزل أثناء الانقسام المتساوي.» · «يتكون الحيز الحركي من جزيئات بروتينية تربط السنترومير بخيوط المغزل، أثناء الطور البيني قبل الانقسام المتساوي.» ${src(134)}` },
      mt:  { n:'الأنيبيبات الدقيقة', t:`«خيوط المغزل (مكونة من أنيبيبات دقيقة)» ${src(132)} · «تتقاصر الأنيبيبات الدقيقة المرتبطة بالسنترومير، الأمر الذي يؤدّي إلى انشطار السنترومير وانفصال الكروماتيدات الشقيقة بعضها عن بعض ليصبح لكل كروماتيد سنترومير منفصل.» ${src(134)}` },
      chr: { n:'الكروماتيد', t:`«الكروماتيد Chromatid: أحد جُزأي الكروموسوم المتطابقين والمرتبطين معًا عبر السنترومير، يتكوّن أثناء الطور البيني عن طريق تضاعف جزيء DNA.» ${src(129)} · «ومع تقصّر الأنيبيبات الدقيقة يتم سحب سنترومير كل كروماتيد باتجاه أحد قطبَي الخلية، ساحبًا خلفه بقية الكروماتيد، التي تأخذ الشكل &lt; أو &gt; أثناء الطور الانفصالي» ${src(134)}` },
    },
    fig44(){
      const s = this.s, split = s >= 20, dx = split ? (s - 20) / 80 * 210 : 0, phi = split ? Math.min(0.75, dx / 210 * 0.75) : 0;
      const Y = 165, A = 92, W = 22, hi = k => this.part === k;
      const glow = k => hi(k) ? ` stroke="${RED}" stroke-width="4"` : ` stroke="#37474f" stroke-width="1.5"`;
      let g = '';
      // الأنيبيبات الدقيقة من القطبين إلى الحيِّزين الحركيَّين
      const kL = 350 - W - 7 - dx, kR = 350 + W + 7 + dx;
      for (let j = -2; j <= 2; j++) {
        g += `<line x1="18" y1="${Y + j * 16}" x2="${f(kL)}" y2="${Y + j * 3}" stroke="${hi('mt') ? RED : '#4fc3f7'}" stroke-width="${hi('mt') ? 4 : 3}"/>`;
        g += `<line x1="682" y1="${Y + j * 16}" x2="${f(kR)}" y2="${Y + j * 3}" stroke="${hi('mt') ? RED : '#4fc3f7'}" stroke-width="${hi('mt') ? 4 : 3}"/>`;
      }
      g += `<g style="cursor:pointer;" onclick="G11SIM_mo.pick3('mt')"><rect x="10" y="${Y - 40}" width="${f(Math.max(20, kL - 30))}" height="80" fill="#fff" fill-opacity="0"/><rect x="${f(kR + 20)}" y="${Y - 40}" width="${f(Math.max(20, 682 - kR - 20))}" height="80" fill="#fff" fill-opacity="0"/></g>`;
      // الكروماتيدان
      const chromatid = (side) => {
        const cx = 350 + side * (W / 2 + 1 + dx);
        const ex = cx - side * A * Math.sin(phi), ey = A * Math.cos(phi);
        const P = `${f(ex)},${f(Y - ey)} ${f(cx)},${f(Y)} ${f(ex)},${f(Y + ey)}`;
        return `<g style="cursor:pointer;" onclick="G11SIM_mo.pick3('chr')"><polyline points="${P}" fill="none" stroke="${hi('chr') ? RED : '#37474f'}" stroke-width="${W + 4}" stroke-linecap="round" stroke-linejoin="round"/><polyline points="${P}" fill="none" stroke="#cfd8dc" stroke-width="${W}" stroke-linecap="round" stroke-linejoin="round"/></g>`;
      };
      g += chromatid(-1) + chromatid(1);
      // الحيِّزان الحركيَّان والسنترومير
      g += `<g style="cursor:pointer;" onclick="G11SIM_mo.pick3('kin')"><rect x="${f(kL - 3)}" y="${Y - 13}" width="10" height="26" rx="3" fill="#ff7043"${glow('kin')}/><rect x="${f(kR - 7)}" y="${Y - 13}" width="10" height="26" rx="3" fill="#ff7043"${glow('kin')}/></g>`;
      g += `<g style="cursor:pointer;" onclick="G11SIM_mo.pick3('cen')">` + (split
        ? `<circle cx="${f(350 - W / 2 - 1 - dx)}" cy="${Y}" r="9" fill="#fdd835"${glow('cen')}/><circle cx="${f(350 + W / 2 + 1 + dx)}" cy="${Y}" r="9" fill="#fdd835"${glow('cen')}/>`
        : `<ellipse cx="350" cy="${Y}" rx="${W + 3}" ry="10" fill="#fdd835"${glow('cen')}/>`) + `</g>`;
      // تسميات بأسلوب الشكل ٤-٤
      g += T(24, 262, 'أنيبيبات دقيقة', { a:'start', c:'#0277bd', b:true });
      g += `<line x1="${f(kL + 2)}" y1="${Y - 14}" x2="${f(kL - 30)}" y2="62" stroke="#455a64"/>` + T(f(kL - 34), 58, 'حيِّز حركي', { a:'end' });
      g += `<line x1="${f(kR - 2)}" y1="${Y - 14}" x2="${f(kR + 30)}" y2="62" stroke="#455a64"/>` + T(f(kR + 34), 58, 'حيِّز حركي', { a:'start' });
      if (split) g += [-1, 1].map(sd => `<line x1="${350 + sd * 20}" y1="288" x2="${f(350 + sd * (W / 2 + 1 + dx))}" y2="${Y + 10}" stroke="#455a64"/>`).join('') + T(350, 306, 'لكلِّ كروماتيد سنترومير منفصل');
      else g += `<line x1="350" y1="${Y + 10}" x2="400" y2="292" stroke="#455a64"/>` + T(404, 306, 'سنترومير', { a:'start' });
      if (split) {
        g += `<line x1="${f(kL - 50)}" y1="${Y + 48}" x2="${f(kL - 110)}" y2="${Y + 48}" stroke="${TEAL}" stroke-width="2.5"/><polygon points="${f(kL - 116)},${Y + 48} ${f(kL - 104)},${Y + 42} ${f(kL - 104)},${Y + 54}" fill="${TEAL}"/>`;
        g += `<line x1="${f(kR + 50)}" y1="${Y + 48}" x2="${f(kR + 110)}" y2="${Y + 48}" stroke="${TEAL}" stroke-width="2.5"/><polygon points="${f(kR + 116)},${Y + 48} ${f(kR + 104)},${Y + 42} ${f(kR + 104)},${Y + 54}" fill="${TEAL}"/>`;
      }
      const stat = s < 20 ? 'الطور الاستوائي: كروموسوم من كروماتيدَين مرتبطَين عبر السنترومير' : s < 85 ? 'انشطر السنترومير وانفصل الكروماتيدان الشقيقان' : 'الطور الانفصالي: يُسحب كلُّ كروماتيد نحو قطب على شكل < أو >';
      g += T(690, 28, stat, { a:'end', b:true, c:DARK, fs:17 });
      return svgOpen(320, 'g11mo_svg') + g + `</svg>`;
    },
    cnt(){
      const n = this.n;
      if (!(n >= 1 && n <= 200 && Number.isInteger(n))) return warn('أدخل عدداً صحيحاً من 1 إلى 200.');
      const row = (a, b) => `<span style="display:inline-block;margin:2px 4px;padding:1px 8px;border-radius:6px;background:#eceff1;">${a}: <b>${L(b)}</b></span>`;
      let h = `<div>عند بدء الانقسام المتساوي (بعد تضاعف DNA): ${row('الكروماتيدات', 2 * n)}${row('جزيئات DNA', 2 * n)}${row('الحيِّزات الحركيَّة', 2 * n)}</div>` +
        `<div>في نواة كلِّ خليَّة ناتجة: ${row('الكروموسومات', n)}</div>`;
      if (n === 46) h += ok(`تطابق إجابات الدليل للسؤال ٢: 92 كروماتيدًا، 92 جزيء DNA، 92 حيزًا حركيًا، 46 كروموسومًا ${src(210, GD)}`);
      return h + `<div style="color:#546e7a;">القاعدة من الكتاب: «يحتوي كل كروماتيد على جُزيء DNA واحد» ${src(129)}، و«حيزَين حركيَّين … لكل كروماتيد من الكروموسوم الواحد» ${src(134)}.</div>`;
    },
    view2(){
      const pb = Object.keys(this.PART).map(k => `<button style="${btn(this.part === k)}" onclick="G11SIM_mo.pick3('${k}')">${this.PART[k].n}</button>`).join('');
      return `<div style="${S.wrap}"><div id="g11mo_fig">${this.fig44()}</div>` +
        `<div style="${S.ctrl}"><label for="g11mo_s">تقصُّر الأنيبيبات الدقيقة:</label><input id="g11mo_s" type="range" min="0" max="100" value="${this.s}" style="${S.rng}" oninput="G11SIM_mo.setS(this.value)"><span id="g11mo_sv" dir="ltr">${this.s}%</span></div>` +
        `<div style="${S.ctrl}"><span>ما دور…؟ انقر جزءاً في الرسم أو زرّاً:</span>${pb}</div>` +
        `<div id="g11mo_part" style="${S.panel}">${this.part ? `<b style="color:${TEAL};">${this.PART[this.part].n}:</b> ${this.PART[this.part].t}` : '<span style="color:#546e7a;">حرِّك المنزلق لتقصير الأنيبيبات الدقيقة، وانقر أيَّ جزء لتقرأ دوره من الكتاب.</span>'}</div>` +
        `<div style="${S.ctrl}"><label>عدد الكروموسومات في الخليَّة: <input type="number" min="1" max="200" step="1" value="${this.n}" style="${S.num}" oninput="G11SIM_mo.setN(this.value)"></label>` +
        `<button style="${btn(false)}" onclick="G11SIM_mo.setN(4,1)">الخليَّة المثال: 4</button><button style="${btn(false)}" onclick="G11SIM_mo.setN(8,1)">ذبابة الفاكهة: 8</button><button style="${btn(false)}" onclick="G11SIM_mo.setN(46,1)">الإنسان: 46</button></div>` +
        `<div id="g11mo_cnt" style="${S.panel}">${this.cnt()}</div></div>`;
    },
    setS(v){ this.s = Number(v); const a = $('g11mo_fig'); if (a) a.innerHTML = this.fig44(); const b = $('g11mo_sv'); if (b) b.textContent = this.s + '%'; },
    pick3(k){ this.part = k; this.rr(2); },
    setN(v, re){ this.n = Number(v); if (re) this.rr(2); else { const c = $('g11mo_cnt'); if (c) c.innerHTML = this.cnt(); } },

    rr(i){ const st = $('simStage'); if (st) st.innerHTML = this.build(i); },
    build(i){
      if (i === 1) return this.view1();
      if (i === 2) return this.view2();
      if (!this.pool) this.reset0();
      return this.view0();
    }
  };

  // ════════════════════════ ٣) التيلوميرات — g11_telomeres ════════════════════════
  // الأطوال «توضيحيَّة»: 5 وحدات تيلومير عند كلِّ طرف، ويُفقد من كلِّ طرف وحدة في كلِّ انقسام (الكتاب لا يعطي أرقاماً).
  const TL_MAX = 5, TL_GENES = 10;
  const TLQ = {
    t1: `«فإنزيم النسخ لا يستطيع أن يعمل حتى نهاية شريط جزيء DNA ويكمل التضاعف، لأنه يتوقف قبل النهاية بقليل، وإذا لم يتم نسخ جزء من DNA، يضيع ذلك الجزء من المعلومات» ${src(137)}`,
    t2: `«وطالما تضاف قواعد جديدة إلى التيلومير في كل دورة خلية لتحل محل تلك التي لم يتمّ نسخها، لا تفقد أيّة معلومات حيويّة من DNA (أي DNA بدون التيلومير)، وبالتالي تكون الخليّة قادرة على مواصلة الانقسام بنجاح. يسمّى الإنزيم الذي يؤدي دور إضافة قواعد إلى التيلومير، إنزيم تيلوميريز.» ${src(137)}`,
    t3: `«كما يضيع جزء آخر من المعلومات من نهاية جزيء DNA أثناء كل انقسام لاحق خلال الانقسامات المتتالية للخلية، وفي النهاية، يؤدي فقدان جينات حيويّة إلى موت الخليّة.» ${src(137)}`,
    t4: `«تتمثل مهمة التيلوميرات في إطالة جزيء DNA، وهي لا تحتوي على جينات، لكنها تتيح لإنزيم النسخ إتمام نسخ جميع DNA الذي يحتوي على الجينات.» ${src(137)}`,
  };
  const TYPES = [
    { k:'D',  n:'خليَّة متمايزة تمامًا', tel:false, rule:'لا تعوِّض النقص في التيلوميرات',
      q:`«بعض الخلايا لا تعوّض النقص في التيلوميرات عند كل انقسام، إذ تميل إلى أن تكون خلايا «متمايزة» تمامًا. وتصبح تيلوميراتها أقصر فأقصر مع كل انقسام، بحيث لا يعود DNA الحيوي محميًا، فتموت الخليّة.» ${src(137)}` },
    { k:'SC', n:'خليَّة جذعيَّة', tel:true, rule:'لا تقصر تيلوميراتها',
      q:`«ومع تضاعف الخلايا، وتقدّمها في العمر، تقصر التيلوميرات تدريجيًا، لكن هذا الأمر لا ينطبق على الخلايا الجذعيّة.» ${src(137)} · «الخليّة الجذعيّة Stem cell، خليّة يمكنها الانقسام لعدد غير محدود من المرات بالانقسام المتساوي.» ${src(138)}` },
    { k:'CA', n:'خليَّة سرطانيَّة', tel:true, rule:'تجدِّد تيلوميراتها عن طريق التيلوميريز',
      q:`«يجري البحث عن طرائق تثبّط عمل إنزيم تيلوميريز في الخلايا السرطانيّة.» ${src(141)} · إجابة الدليل: «الخلايا السرطانيّة لا تصاب بالشيخوخة، وهي تحقق ذلك بتجديد تيلوميراتها بعد كل انقسام غير منتظم، عن طريق التيلوميريز (تستخدم الخليّة الطبيعيّة في النهاية تيلوميراتها وتموت إذا انقسمت بشكل متكرر).» ${src(211, GD)}` },
  ];
  // كروموسوم أفقي: جينات في الوسط وتيلوميرات عند الطرفين؛ lost = عدد أشرطة الجينات المفقودة من كلِّ طرف
  function tlChrom(cx, cy, len, lost, k, dead){
    const bw = 26 * k, uw = 14 * k, h = 30 * k, gx0 = cx - TL_GENES * bw / 2, gx1 = cx + TL_GENES * bw / 2;
    let g = '';
    // أشباح ما فُقد (خطٌّ متقطِّع)
    const ghostL = gx0 - TL_MAX * uw, ghostR = gx1 + TL_MAX * uw;
    g += `<rect x="${f(ghostL)}" y="${f(cy - h / 2)}" width="${f(ghostR - ghostL)}" height="${f(h)}" rx="${f(h / 2 - 1)}" fill="none" stroke="#b0bec5" stroke-width="1.5" stroke-dasharray="5 4"/>`;
    for (let i = 0; i < TL_GENES; i++) {
      const gone = i < lost || i >= TL_GENES - lost;
      g += `<rect x="${f(gx0 + i * bw + 1)}" y="${f(cy - h / 2)}" width="${f(bw - 2)}" height="${f(h)}" fill="${gone ? '#fff' : BANDS[i]}" stroke="${gone ? RED : '#37474f'}" stroke-width="${gone ? 1.5 : 1}"${gone ? ' stroke-dasharray="3 3"' : ''}${dead && !gone ? ' opacity="0.45"' : ''}/>`;
      if (gone) g += T(f(gx0 + i * bw + bw / 2), f(cy + 6 * k), '✗', { ltr:true, c:RED, fs:Math.max(16, Math.round(18 * k)) });
    }
    for (let u = 0; u < len; u++) {
      g += `<rect x="${f(gx0 - (u + 1) * uw)}" y="${f(cy - h / 2 + 3 * k)}" width="${f(uw - 1.5)}" height="${f(h - 6 * k)}" fill="${PINK}"/>`;
      g += `<rect x="${f(gx1 + u * uw + 1.5)}" y="${f(cy - h / 2 + 3 * k)}" width="${f(uw - 1.5)}" height="${f(h - 6 * k)}" fill="${PINK}"/>`;
    }
    return g;
  }

  window.G11SIM_tl = {
    // المرحلة 1: تجربة حرَّة
    len: TL_MAX, tel: false, div: 0, lost: 0, dead: false, hist: [TL_MAX], msg: null,
    reset0(){ Object.assign(this, { len: TL_MAX, div: 0, lost: 0, dead: false, hist: [TL_MAX], msg: null }); },
    divide(times){
      for (let r = 0; r < (times || 1); r++) {
        if (this.dead) break;
        this.div++;
        if (this.tel) { this.msg = 'tel'; }
        else if (this.len > 0) { this.len--; this.msg = this.len === 0 ? 'zero' : 'short'; }
        else { this.lost++; this.msg = 'genes'; if (this.lost >= 2) { this.dead = true; this.msg = 'dead'; } }
        this.hist.push(this.len);
      }
      this.rr(0);
    },
    toggle(){ if (this.dead) return; this.tel = !this.tel; this.rr(0); },
    graph(x0, y0, w, h){
      const n0 = Math.max(0, this.hist.length - 13), H = this.hist.slice(n0);
      const X = i => x0 + 40 + (w - 55) * i / 12, Y = v => y0 + h - 50 - (h - 96) * v / TL_MAX;
      let g = `<rect x="${x0}" y="${y0}" width="${w}" height="${h}" rx="6" fill="#fafafa" stroke="#cfd8dc"/>`;
      g += T(x0 + w - 10, y0 + 22, 'طول التيلومير بعد كلِّ انقسام', { a:'end', b:true });
      g += `<rect x="${x0 + 10}" y="${y0 + 8}" width="66" height="22" rx="5" fill="#fff3e0" stroke="#ffb74d"/>` + T(x0 + 43, y0 + 25, 'توضيحي', { c:'#e65100', b:true });
      g += `<line x1="${X(0)}" y1="${Y(0)}" x2="${X(12) + 6}" y2="${Y(0)}" stroke="#37474f" stroke-width="2"/><line x1="${X(0)}" y1="${Y(0)}" x2="${X(0)}" y2="${Y(TL_MAX) - 6}" stroke="#37474f" stroke-width="2"/>`;
      for (let v = 0; v <= TL_MAX; v++) g += T(X(0) - 8, f(Y(v) + 5), String(v), { ltr:true, a:'end', fs:16 });
      for (let i = 0; i <= 12; i += 2) g += T(f(X(i)), Y(0) + 19, String(n0 + i), { ltr:true, fs:16 });
      g += T(f(X(6)), y0 + h - 7, 'عدد الانقسامات', { fs:16, c:'#455a64' });
      g += `<polyline points="${H.map((v, i) => `${f(X(i))},${f(Y(v))}`).join(' ')}" fill="none" stroke="${PINK}" stroke-width="3"/>`;
      H.forEach((v, i) => { g += `<circle cx="${f(X(i))}" cy="${f(Y(v))}" r="4.5" fill="${PINK}" stroke="#fff" stroke-width="1.5"/>`; });
      if (this.dead) g += T(f(X(H.length - 1)), f(Y(0) - 12), '✗', { ltr:true, c:RED, fs:22, b:true });
      return g;
    },
    view0(){
      let h = svgOpen(360);
      h += `<rect x="6" y="6" width="688" height="150" rx="7" fill="#fafafa" stroke="#cfd8dc"/>`;
      h += T(684, 30, 'كروموسوم في الخليَّة', { a:'end', b:true });
      h += tlChrom(350, 82, this.len, this.lost, 1, this.dead);
      h += (this.len > 0 ? T(350 - 130 - 35, 120, 'تيلومير', { c:PINK, b:true }) + T(350 + 130 + 35, 120, 'تيلومير', { c:PINK, b:true }) : '') + T(350, 120, 'جينات', { c:'#37474f', b:true });
      h += T(350, 146, this.dead ? 'ماتت الخليَّة' : `الانقسام رقم ${AR(this.div)} — طول التيلومير: ${AR(this.len)} من ${AR(TL_MAX)} وحدات`, { b:true, c: this.dead ? RED : DARK });
      h += this.graph(6, 166, 400, 188);
      // نافذة: نهاية جزيء DNA عند التضاعف
      h += `<rect x="414" y="166" width="280" height="188" rx="6" fill="#fafafa" stroke="#cfd8dc"/>` + T(686, 188, 'نهاية جزيء DNA عند تضاعفه', { a:'end', b:true });
      h += `<line x1="430" y1="226" x2="680" y2="226" stroke="#37474f" stroke-width="6" stroke-linecap="round"/>` + T(686, 252, 'الشريط الأصلي', { a:'end', fs:16 });
      h += `<line x1="430" y1="280" x2="630" y2="280" stroke="${TEAL}" stroke-width="6" stroke-linecap="round"/><line x1="636" y1="280" x2="680" y2="280" stroke="${RED}" stroke-width="3" stroke-dasharray="4 4"/>`;
      h += T(686, 306, 'النسخة: يتوقف إنزيم النسخ', { a:'end', fs:16 }) + T(686, 326, 'قبل النهاية بقليل', { a:'end', fs:16 });
      h += T(500, 344, this.tel ? 'تيلوميريز يضيف قواعد ✓' : 'جزء لم يُنسخ ✗', { c: this.tel ? GREEN : RED, b:true });
      h += `</svg>`;
      let m = `<span style="color:#546e7a;">اضغط «انقسام» وراقب طرفَي الكروموسوم. ثمَّ أعد التجربة وإنزيم تيلوميريز يعمل.</span> ${TLQ.t4}`;
      if (this.msg === 'short') m = `<b>قصر التيلومير وحدة عند كلِّ طرف.</b> ${TLQ.t1}`;
      else if (this.msg === 'zero') m = warn('لم يبقَ تيلومير: الانقسام التالي يمسُّ الجينات.') + TLQ.t1;
      else if (this.msg === 'genes') m = warn('فُقد جين من كلِّ طرف.') + TLQ.t3;
      else if (this.msg === 'dead') m = warn('ماتت الخليَّة بعد فقدان جينات حيويَّة.') + TLQ.t3;
      else if (this.msg === 'tel') m = ok('لم يقصر التيلومير: أضاف إنزيم تيلوميريز قواعد بدل التي لم تُنسخ.') + TLQ.t2;
      return `<div style="${S.wrap}">${h}<div style="${S.ctrl}">` +
        `<button style="${btn(true, this.dead ? 'opacity:.5;cursor:not-allowed;' : '')}" onclick="G11SIM_tl.divide(1)"${this.dead ? ' disabled' : ''}>🔬 انقسام</button>` +
        `<button style="${btn(false)}" onclick="G11SIM_tl.divide(5)"${this.dead ? ' disabled' : ''}>٥ انقسامات</button>` +
        `<button style="${btn(this.tel, 'min-width:220px;')}" onclick="G11SIM_tl.toggle()">إنزيم تيلوميريز: ${this.tel ? 'يعمل ✓' : 'لا يعمل ✗'}</button>` +
        `<button style="${btn(false)}" onclick="G11SIM_tl.reset0();G11SIM_tl.rr(0)">↺ خليَّة جديدة</button></div>` +
        `<div style="${S.panel}">${m}</div>` +
        `<div style="${S.panel}color:#455a64;">${ILL} الكتاب لا يحدِّد طول التيلومير ولا مقدار ما يُفقد في كلِّ انقسام؛ الوحدات هنا للتوضيح فقط، والقاعدة وحدها من الكتاب.</div></div>`;
    },

    // المرحلة 2: ثلاثة أنواع من الخلايا — توقَّع ثمَّ تحقَّق
    rows: null, d2: 0, pred: {}, shown: false,
    reset1(){ this.rows = TYPES.map(t => ({ len: TL_MAX, lost: 0, dead: false, divs: 0 })); this.d2 = 0; this.pred = {}; this.shown = false; },
    divide2(times){
      if (!this.rows) this.reset1();
      for (let r = 0; r < times; r++) {
        this.d2++;
        TYPES.forEach((t, i) => { const w = this.rows[i]; if (w.dead) return; w.divs++; if (t.tel) return; if (w.len > 0) w.len--; else { w.lost++; if (w.lost >= 2) w.dead = true; } });
      }
      this.rr(1);
    },
    view1(){
      if (!this.rows) this.reset1();
      let h = svgOpen(330);
      TYPES.forEach((t, i) => {
        const y = 12 + i * 106, w = this.rows[i];
        h += `<rect x="6" y="${y}" width="688" height="98" rx="7" fill="${w.dead ? '#ffebee' : '#fafafa'}" stroke="#cfd8dc"/>`;
        h += T(684, y + 30, t.n, { a:'end', b:true, fs:18 });
        h += T(684, y + 56, `الانقسامات: ${AR(w.divs)}`, { a:'end', c:'#455a64' });
        h += T(684, y + 82, this.shown ? t.rule : 'التيلوميريز: ؟', { a:'end', c: this.shown ? TEAL : '#90a4ae', fs:16 });
        h += tlChrom(290, y + 50, w.len, w.lost, 0.78, w.dead);
        h += T(70, y + 56, w.dead ? 'ماتت ✗' : 'تنقسم ✓', { c: w.dead ? RED : GREEN, b:true, fs:18 });
      });
      h += `</svg>`;
      const lock = this.d2 > 0;
      const sel = (t) => `<label style="display:block;margin:3px 0;"><b>${t.n}:</b> <select style="${S.sel}" ${lock ? 'disabled ' : ''}onchange="G11SIM_tl.pred['${t.k}']=this.value">` +
        `<option value="">— توقَّع قبل الانقسام —</option><option value="short"${this.pred[t.k] === 'short' ? ' selected' : ''}>تقصر تيلوميراتها مع كلِّ انقسام حتى تموت</option>` +
        `<option value="keep"${this.pred[t.k] === 'keep' ? ' selected' : ''}>يبقى طول تيلوميراتها وتواصل الانقسام</option></select></label>`;
      let fb = `<span style="color:#546e7a;">اختر توقُّعك لكلِّ خليَّة، ثمَّ اضغط «انقسام» عدَّة مرَّات (تُقفل التوقُّعات بعد أوَّل انقسام)، ثمَّ «تحقَّق».</span>`;
      if (this.shown) {
        fb = TYPES.map(t => {
          const right = t.tel ? 'keep' : 'short', p = this.pred[t.k];
          const head = !p ? `<span style="color:#ef6c00;font-weight:700;">• ${t.n}: لم تتوقَّع.</span>` : p === right ? ok(`${t.n}: توقُّعك صحيح.`) : warn(`${t.n}: توقُّعك غير صحيح.`);
          return `<div style="border-top:1px solid #e0e0e0;margin-top:4px;padding-top:4px;">${head}<div>${t.q}</div></div>`;
        }).join('') + (TYPES[1].tel ? `<div style="color:#546e7a;margin-top:4px;">ملاحظة: الكتاب ينصُّ على أنَّ قِصَر التيلوميرات «لا ينطبق على الخلايا الجذعيّة» ولا يسمِّي الآليَّة فيها؛ رسمُ تيلوميراتها ثابتةً ممَّا ينصُّ عليه.</div>` : '');
      }
      return `<div style="${S.wrap}">${h}<div style="${S.panel}">${TYPES.map(sel).join('')}</div>` +
        `<div style="${S.ctrl}"><button style="${btn(true)}" onclick="G11SIM_tl.divide2(1)">🔬 انقسام (للخلايا الثلاث)</button><button style="${btn(false)}" onclick="G11SIM_tl.divide2(5)">٥ انقسامات</button>` +
        `<button style="${btn(true, `background:${GREEN};border-color:${GREEN};`)}" onclick="G11SIM_tl.shown=true;G11SIM_tl.rr(1)">تحقَّق من توقُّعاتي</button><button style="${btn(false)}" onclick="G11SIM_tl.reset1();G11SIM_tl.rr(1)">↺ إعادة</button></div>` +
        `<div style="${S.panel}">${fb}</div></div>`;
    },
    rr(i){ const st = $('simStage'); if (st) st.innerHTML = this.build(i); },
    build(i){ return i === 1 ? this.view1() : this.view0(); }
  };

  G.simulations = Object.assign(G.simulations || {}, {
    g11_cell_cycle: {
      sem:'S1', title:'دورة الخليَّة ومؤشِّر الانقسام',
      stages:['مؤشِّر دورة الخليَّة', 'في أيِّ طور يحدث هذا؟', 'مؤشِّر الانقسام ومدَّة الدورة'],
      info:[
        `دورة الخليّة Cell cycle، عمليّة منضبطة بدقّة تحدث في جميع الخلايا، وتتضمّن: الطور البيني، والطور M، وانقسام السيتوبلازم. الطور M، الذي سيتم تناوله في هذه الوحدة هو طور الانقسام المتساوي Mitosis، يبين الشكل ٤-٢ دورة الخلية. (كتاب الطالب ص ١٣٠)`,
        `يشكل الطور البيني <span dir="ltr">Interphase 90 %</span> من دورة الخلية، والذي يقسم إلى ثلاثة أطوار هي الطور G<sub>1</sub> (first gap) والطور S (synthesis)، والطور G<sub>2</sub> (second gap). (كتاب الطالب ص ١٣٠)`,
        `يكون طول مدّة دورة الخليّة متغيّرًا كثيرًا، اعتمادًا على الظروف البيئيّة ونوع الخليّة. وفي المتوسط، تنقسم خلايا قمة جذر البصل مرة كل 20 ساعة، وتنقسم الخلايا الطلائيّة في أمعاء الإنسان مرة كل 10 ساعات تقريبًا. (كتاب الطالب ص ١٣١)`
      ],
      build(i){ return window.G11SIM_cc.build(i); }
    },
    g11_mitosis_order: {
      sem:'S1', title:'أطوار الانقسام المتساوي: رتِّب وحدِّد',
      stages:['رتِّب الأطوار', 'حدِّد الطور', 'السنترومير والحيِّز الحركي'],
      info:[
        `إحدى أفضل الطرائق لوصف أحداث الانقسام المتساوي هي من خلال ملاحظة الرسوم التخطيطية كما يوضح في الشكل ٤-٣. وبالرغم من أن العملية متواصلة، إلّا أنها تقسم عادة إلى أربعة أطوار رئيسيّة: الطور التمهيدي Prophase، والطور الاستوائي Metaphase، والطور الانفصالي Anaphase، والطور النهائي Telophase. (كتاب الطالب ص ١٣١)`,
        `تحتوي معظم النوى على العديد من الكروموسومات، لكن الرسوم التخطيطيّة في الشكل ٤-٣ تبيّن بشكل مبسّط خليّة تحتوي فقط على أربعة كروموسومات. وقد استخدمت الألوان للتمييز بين الكروموسومات من الأم أو من الأب، بحيث تمت التجربة على خليّة حيوانيّة كمثال. لاحظ أن الغلاف النووي يختفي خلال نهاية الطور التمهيدي؛ فهو يتحلّل إلى حويصلات صغيرة لا تُرى بالمجهر الضوئي، ويعاد تجميعها أثناء الطور النهائي، كما في الشكل ٤-٣. ولذلك، لا تبيّن الرسوم التخطيطيّة للطور الاستوائي والطور الانفصالي الغلاف النووي. (كتاب الطالب ص ١٣١)`,
        `يتكون الحيز الحركي من جزيئات بروتينية تربط السنترومير بخيوط المغزل، أثناء الطور البيني قبل الانقسام المتساوي. تتقاصر الأنيبيبات الدقيقة المرتبطة بالسنترومير، الأمر الذي يؤدّي إلى انشطار السنترومير وانفصال الكروماتيدات الشقيقة بعضها عن بعض ليصبح لكل كروماتيد سنترومير منفصل. ومع تقصّر الأنيبيبات الدقيقة يتم سحب سنترومير كل كروماتيد باتجاه أحد قطبَي الخلية، ساحبًا خلفه بقية الكروماتيد، التي تأخذ الشكل &lt; أو &gt; أثناء الطور الانفصالي كما هو موضّح في الشكل ٤-٣ والصورتين ٤-٤ و ٤-٥. (كتاب الطالب ص ١٣٤)`
      ],
      build(i){ return window.G11SIM_mo.build(i); }
    },
    g11_telomeres: {
      sem:'S1', title:'التيلوميرات والانقسام',
      stages:['انقسم وراقب التيلومير', 'ثلاث خلايا: توقَّع ثمَّ تحقَّق'],
      info:[
        `لقد درست سابقًا أن DNA يتضاعف أثناء طور S من دورة الخليّة. فإنزيم النسخ لا يستطيع أن يعمل حتى نهاية شريط جزيء DNA ويكمل التضاعف، لأنه يتوقف قبل النهاية بقليل، وإذا لم يتم نسخ جزء من DNA، يضيع ذلك الجزء من المعلومات، كما يضيع جزء آخر من المعلومات من نهاية جزيء DNA أثناء كل انقسام لاحق خلال الانقسامات المتتالية للخلية، وفي النهاية، يؤدي فقدان جينات حيويّة إلى موت الخليّة. (كتاب الطالب ص ١٣٧)`,
        `تتمثل الوظيفة الرئيسيّة للتيلوميرات Telomeres في التأكد من شمول نهايات جزيء DNA في عمليّة تضاعفه، ومن دون أن تهمل. توجد التيلوميرات عند نهايات الكروموسومات انظر الصورة ٤-٧، وأيضًا الصورة ٤-٢، وقد تمّ تشبيهها بالأطراف البلاستيكيّة في نهايات رباط الحذاء. إذ تتكوّن التيلوميرات من سلسلة قصيرة متكررة من قواعد نيتروجينية على جزيء DNA في نهاية الكروموسوم. (كتاب الطالب ص ١٣٧)`
      ],
      build(i){ return window.G11SIM_tl.build(i); }
    }
  });
})();
