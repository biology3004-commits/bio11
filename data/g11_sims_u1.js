// محاكيات تفاعليَّة — الوحدة 1 «تركيب الخليَّة»: g11_magnification · g11_graticule · g11_microscopes
// كلُّ نصٍّ منهجي منقول حرفيّاً من كتاب الطالب (طبعة 2026) أو كتاب التجارب العمليَّة والأنشطة، بأرقام الصفحات المطبوعة،
// بعد مطابقته على صور الصفحات. التسميات القصيرة وعناوين المراحل ورسائل التوجيه من صياغة المنصَّة.
(function(){
  const G = window.G11_DATA = window.G11_DATA || {};
  const F = 'Tajawal, Cairo, sans-serif';
  const TEAL = '#00695c', DARK = '#003d33', LIGHT = '#e0f2f1', RED = '#C8102E', GREEN = '#009A44';
  const $ = id => document.getElementById(id);
  const AR = n => String(n).replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);

  // ---------- أدوات عامَّة ----------
  function fmt(x){
    if (typeof x !== 'number' || !isFinite(x)) return '—';
    const r = Number(x.toPrecision(12));
    let s = String(r);
    if (/e/i.test(s)) {
      if (Math.abs(r) >= 1e21) return r.toExponential(3);
      const d = Math.min(20, Math.max(0, 11 - Math.floor(Math.log10(Math.abs(r)))));
      s = r.toFixed(d);
    }
    if (s.indexOf('.') >= 0) s = s.replace(/0+$/, '').replace(/\.$/, '');
    return s;
  }
  // للعرض: القيمة الدقيقة إن انتهت ضمن 4 منازل، وإلَّا تقريب (عدد صحيح فوق 10، ورقمان معنويَّان دونها) كما في أمثلة الكتاب
  function res(x){
    if (typeof x !== 'number' || !isFinite(x)) return { t:'—', approx:false, full:'—' };
    const r4 = Math.round(x * 1e4) / 1e4;
    if (Math.abs(x - r4) <= 1e-9 * Math.max(1, Math.abs(x))) return { t: fmt(r4), approx:false, full: fmt(r4) };
    const t = Math.abs(x) >= 10 ? fmt(Math.round(x)) : fmt(Number(x.toPrecision(2)));
    return { t, approx:true, full: fmt(Number(x.toPrecision(4))) };
  }
  const S = {
    wrap: `width:100%;max-width:700px;margin:0 auto;direction:rtl;font-family:${F};color:#1a1a1a;text-align:right;`,
    ctrl: `display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px;padding:8px 10px;background:${LIGHT};border-radius:10px;margin-top:6px;font-size:16px;`,
    panel: `background:#fff;border:2px solid #b2dfdb;border-radius:10px;padding:8px 12px;margin-top:6px;font-size:16px;line-height:1.9;`,
    inp: `font-family:${F};font-size:16px;width:105px;padding:4px 6px;border:2px solid #80cbc4;border-radius:6px;direction:ltr;text-align:center;background:#fff;`,
    sel: `font-family:${F};font-size:16px;padding:4px 6px;border:2px solid #80cbc4;border-radius:6px;direction:ltr;background:#fff;`,
    rng: `width:230px;accent-color:${TEAL};vertical-align:middle;`,
  };
  const btn = (on, extra) => `font-family:${F};font-size:16px;padding:5px 12px;border-radius:8px;border:2px solid ${TEAL};cursor:pointer;` +
    (on ? `background:${TEAL};color:#fff;` : `background:#fff;color:${DARK};`) + (extra || '');
  const L = s => `<span dir="ltr" style="unicode-bidi:isolate;white-space:nowrap;">${s}</span>`;
  const svgOpen = h => `<svg viewBox="0 0 700 ${h}" width="100%" style="display:block;max-width:700px;margin:0 auto;background:#fff;border-radius:10px;font-family:${F};direction:ltr;" xmlns="http://www.w3.org/2000/svg">`;
  function T(x, y, s, o){
    o = o || {};
    return `<text x="${x}" y="${y}" font-size="${o.fs || 16}" fill="${o.c || '#1a1a1a'}" text-anchor="${o.a || 'middle'}"` +
      `${o.b ? ' font-weight="700"' : ''}${o.ltr ? ' direction="ltr"' : ''}${o.it ? ' font-style="italic"' : ''}${o.x || ''}>${s}</text>`;
  }
  const src = (p, book) => `<span style="color:#546e7a;">(${book || 'كتاب الطالب'} ص ${AR(p)})</span>`;
  const q = s => `«${s}»`;
  const stepRow = (n, html) => `<div style="margin:2px 0;"><b style="color:${TEAL};">الخطوة ${AR(n)}:</b> ${html}</div>`;
  const ok = (s) => `<div style="color:${GREEN};font-weight:700;">✓ ${s}</div>`;
  const warn = (s) => `<div style="color:${RED};font-weight:700;">⚠ ${s}</div>`;

  // =====================================================================
  // 1) g11_magnification — وحدات القياس ومقدار التكبير (الدرس ١-٣)
  // =====================================================================
  const U2UM = u => u === 'mm' ? 1000 : (u === 'nm' ? 0.001 : 1);
  const toUm = (v, u) => u === 'mm' ? v * 1000 : (u === 'nm' ? v / 1000 : v);
  const UNAME = { 'mm':'مليمتر', 'µm':'ميكرومتر', 'nm':'نانومتر' };

  const M1 = window.G11SIM_magnification = {
    s: null,
    reset(){ this.s = { cv:'34', cu:'mm', unk:'M', I:'34', Iu:'mm', A:'80', Au:'µm', M:'425', cur:20, Mx:'5600' }; },
    // ---- حساب (يُختبر آليّاً) ----
    convert(v, u){ const um = toUm(v, u); return { mm: um / 1000, um: um, nm: um * 1000 }; },
    solve(unk, I, Iu, A, Au, M){
      const Ium = toUm(I, Iu), Aum = toUm(A, Au);
      if (unk === 'M') return { M: Ium / Aum, Ium, Aum };
      if (unk === 'A') return { Aum: Ium / M, Ium, M };
      return { Ium: M * Aum, Imm: M * Aum / 1000, Aum, M };
    },
    actual(Imm, M){ return Imm * 1000 / M; },

    // ---- المرحلة 0: تحويل الوحدات ----
    viewConv(){
      const s = this.s, v = parseFloat(s.cv), good = isFinite(v) && v > 0;
      const c = good ? this.convert(v, s.cu) : null;
      let o = svgOpen(330);
      o += `<defs><marker id="g11m_ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${TEAL}"/></marker></defs>`;
      // الجدول ١-١ (أعمدته من اليمين: جزء من المتر · الوحدة · الرمز)
      o += `<rect x="10" y="10" width="680" height="40" fill="#80cbc4" stroke="#004d40" stroke-width="1.5"/>`;
      o += T(680, 37, 'جزء من المتر', { a:'end', b:1, fs:17 }) + T(140, 37, 'الوحدة', { b:1, fs:17 }) + T(45, 37, 'الرمز', { b:1, fs:17 });
      const rows = [['mm','مليمتر','واحد من الألف','0.001','1000','3'],
                    ['µm','ميكرومتر','واحد من المليون','0.000001','1000000','6'],
                    ['nm','نانومتر','واحد من الألف مليون','0.000000001','1000000000','9']];
      rows.forEach((r, i) => {
        const y = 50 + i * 46, on = r[0] === s.cu;
        o += `<rect x="10" y="${y}" width="680" height="46" fill="${on ? '#fff3e0' : '#fff'}" stroke="#004d40" stroke-width="1.5"/>`;
        o += T(680, y + 29, r[2], { a:'end' });
        o += `<text x="212" y="${y + 29}" font-size="16" direction="ltr" text-anchor="start" fill="#1a1a1a">10<tspan dy="-7" font-size="12">−${r[5]}</tspan><tspan dy="7"> = 1/${r[4]} = ${r[3]} =</tspan></text>`;
        o += T(140, y + 29, r[1], { b: on ? 1 : 0 }) + T(45, y + 29, r[0], { ltr:1, b:1, c: on ? RED : '#1a1a1a' });
      });
      o += `<line x1="80" y1="10" x2="80" y2="188" stroke="#004d40" stroke-width="1.5"/><line x1="200" y1="10" x2="200" y2="188" stroke="#004d40" stroke-width="1.5"/>`;
      // سلَّم التحويل: mm ← → µm ← → nm
      const box = (x, u) => {
        const on = u === s.cu, val = good ? fmt(u === 'mm' ? c.mm : u === 'µm' ? c.um : c.nm) + ' ' + u : '—';
        const fs = val.length > 15 ? 16 : 20;
        return `<rect x="${x}" y="215" width="170" height="86" rx="10" fill="${on ? '#ffebee' : LIGHT}" stroke="${on ? RED : TEAL}" stroke-width="${on ? 3 : 2}"/>` +
          T(x + 85, 242, UNAME[u], { b:1, c: DARK }) + T(x + 85, 282, val, { ltr:1, b:1, fs, c: on ? RED : '#1a1a1a' });
      };
      o += box(505, 'mm') + box(265, 'µm') + box(25, 'nm');
      [[500, 440, 470], [260, 200, 230]].forEach(([a, b, m]) => {
        o += `<line x1="${a}" y1="240" x2="${b}" y2="240" stroke="${TEAL}" stroke-width="2.5" marker-end="url(#g11m_ar)"/>` + T(m, 232, '× 1000', { ltr:1, fs:16, c: TEAL, b:1 });
        o += `<line x1="${b}" y1="280" x2="${a}" y2="280" stroke="#8d6e63" stroke-width="2.5" marker-end="url(#g11m_ar)"/>` + T(m, 300, '÷ 1000', { ltr:1, fs:16, c:'#6d4c41', b:1 });
      });
      o += T(350, 322, 'كلَّما صغرت الوحدة كبر العدد', { fs:16, c:'#546e7a' });
      o += '</svg>';
      let h = `<div style="${S.panel}">`;
      if (good) h += `<div><b>القيمة المُدخلة:</b> ${L(fmt(v) + ' ' + s.cu)} &nbsp;⟸&nbsp; ${L(fmt(c.mm) + ' mm = ' + fmt(c.um) + ' µm = ' + fmt(c.nm) + ' nm')}</div>`;
      else h += warn('أدخل قيمة موجبة.');
      h += `<div style="color:#37474f;">${q('الجدول ١-١ وحدات القياس المرتبطة بدراسة الخلايا: 1 ميكرومتر هو جزء من ألف من المليمتر، و 1 نانومتر هو جزء من ألف من الميكرومتر')} ${src(21)}</div></div>`;
      return o + h;
    },
    setConv(){ const s = this.s; s.cv = $('g11m_cv').value; s.cu = $('g11m_cu').value; $('g11m_view').innerHTML = this.viewConv(); },
    presetConv(v, u){ $('g11m_cv').value = v; $('g11m_cu').value = u; this.setConv(); },

    // ---- المرحلة 1: M = I ÷ A ----
    viewMag(){
      const s = this.s, I = parseFloat(s.I), A = parseFloat(s.A), M = parseFloat(s.M), unk = s.unk;
      const need = { M:[I, A], A:[I, M], I:[M, A] }[unk];
      const good = need.every(x => isFinite(x) && x > 0);
      const r = good ? this.solve(unk, I, s.Iu, A, s.Au, M) : null;
      let o = svgOpen(240);
      // مثلَّث الصيغة كما في الكتاب ص ٢٨
      const reg = { I:'150,20 210,125 90,125', M:'90,125 150,125 150,230 30,230', A:'150,125 210,125 270,230 150,230' };
      o += `<polygon points="${reg[unk]}" fill="#ffcdd2"/>`;
      o += `<polygon points="150,20 270,230 30,230" fill="none" stroke="#1a1a1a" stroke-width="2.5"/><line x1="90" y1="125" x2="210" y2="125" stroke="#1a1a1a" stroke-width="2.5"/>`;
      const lc = k => k === unk ? RED : '#1a1a1a';
      o += T(150, 103, 'I', { fs:36, it:1, c: lc('I'), b: unk === 'I' ? 1 : 0 }) + T(100, 200, 'M', { fs:34, it:1, c: lc('M'), b: unk === 'M' ? 1 : 0 }) +
           T(150, 198, '×', { fs:24 }) + T(200, 200, 'A', { fs:34, it:1, c: lc('A'), b: unk === 'A' ? 1 : 0 });
      const arF = { M:'مقدار التكبير = قياس الصورة ÷ القياس الحقيقي', A:'القياس الحقيقي = قياس الصورة ÷ مقدار التكبير', I:'قياس الصورة = مقدار التكبير × القياس الحقيقي' }[unk];
      const laF = { M:'M = I ÷ A', A:'A = I ÷ M', I:'I = M × A' }[unk];
      o += T(690, 36, arF, { a:'end', b:1, fs:18, c: DARK }) + T(485, 86, laF, { ltr:1, fs:32, it:1, b:1, c: RED });
      const vbox = (x, k, name, val) => {
        const on = k === unk;
        return `<rect x="${x}" y="115" width="125" height="92" rx="10" fill="${on ? '#ffebee' : LIGHT}" stroke="${on ? RED : TEAL}" stroke-width="${on ? 3 : 2}"/>` +
          T(x + 62, 140, name, { b:1, c: DARK }) + T(x + 62, 160, k, { ltr:1, it:1, c:'#546e7a' }) + T(x + 62, 192, val, { ltr:1, b:1, fs: val.length > 11 ? 16 : 19, c: on ? RED : '#1a1a1a' });
      };
      const vI = unk === 'I' ? (good ? res(r.Imm).t + ' mm' : '?') : fmt(I) + ' ' + s.Iu;
      const vA = unk === 'A' ? (good ? res(r.Aum).t + ' µm' : '?') : fmt(A) + ' ' + s.Au;
      const vM = unk === 'M' ? (good ? '× ' + res(r.M).t : '?') : '× ' + fmt(M);
      o += vbox(560, 'I', 'قياس الصورة', vI) + vbox(420, 'A', 'القياس الحقيقي', vA) + vbox(280, 'M', 'مقدار التكبير', vM);
      o += '</svg>';
      // الخطوات
      let h = `<div style="${S.panel}">`;
      const conv = (nm, v, u) => u === 'µm' ? `${nm} = ${L(fmt(v) + ' µm')} (بالميكرومتر أصلًا)` :
        (u === 'mm' ? `${nm}: ${L(fmt(v) + ' mm × 1000 = ' + fmt(v * 1000) + ' µm')}` : `${nm}: ${L(fmt(v) + ' nm ÷ 1000 = ' + fmt(v / 1000) + ' µm')}`);
      const apx = (x) => { const R = res(x); return R.approx ? ` <span style="color:#546e7a;">(القيمة قبل التقريب ${L(R.full)})</span>` : ''; };
      if (!good) h += warn('أدخل قيمتَين موجبتَين للمعلومَين.');
      else if (unk === 'M') {
        h += stepRow(1, `قياس الصورة ${L('I = ' + fmt(I) + ' ' + s.Iu)}، والقياس الحقيقي ${L('A = ' + fmt(A) + ' ' + s.Au)}.`);
        h += stepRow(2, `حوّل القياسين إلى ميكرومتر (µm): ${conv('I', I, s.Iu)}؛ ${conv('A', A, s.Au)}.`);
        h += stepRow(3, `${L('M = I ÷ A = ' + fmt(r.Ium) + ' µm ÷ ' + fmt(r.Aum) + ' µm = × ' + res(r.M).t)}` + apx(r.M));
        h += `<div>${q('رمز مقدار التكبير (X) أمام العدد ' + L(res(r.M).t) + ' يعني «مرة». لذا يكون مقدار التكبير «' + L(res(r.M).t) + ' مرة».')} ${src(30)}</div>`;
      } else if (unk === 'A') {
        h += stepRow(1, `قياس الصورة ${L('I = ' + fmt(I) + ' ' + s.Iu)}، ومقدار التكبير ${L('M = × ' + fmt(M))}.`);
        h += stepRow(2, `حوّل قياس الصورة إلى ميكرومتر (µm): ${conv('I', I, s.Iu)}.`);
        h += stepRow(3, `${L('A = I ÷ M = ' + fmt(r.Ium) + ' µm ÷ ' + fmt(M) + ' = ' + res(r.Aum).t + ' µm')}` + apx(r.Aum) +
          (r.Aum < 1 ? ` = ${L(res(r.Aum * 1000).t + ' nm')}` : ''));
      } else {
        h += stepRow(1, `مقدار التكبير ${L('M = × ' + fmt(M))}، والقياس الحقيقي ${L('A = ' + fmt(A) + ' ' + s.Au)}.`);
        h += stepRow(2, `حوّل القياس الحقيقي إلى ميكرومتر (µm): ${conv('A', A, s.Au)}.`);
        h += stepRow(3, `${L('I = M × A = ' + fmt(M) + ' × ' + fmt(r.Aum) + ' µm = ' + res(r.Ium).t + ' µm')}` + apx(r.Ium));
        h += stepRow(4, `حوّل إلى مليمتر لتقارنه بالمسطرة: ${L(res(r.Ium).t + ' µm ÷ 1000 = ' + res(r.Imm).t + ' mm')}.`);
      }
      if (good) {
        const units = unk === 'M' ? [s.Iu, s.Au] : unk === 'A' ? [s.Iu, 'µm'] : ['µm', s.Au];
        if (units[0] !== units[1] || units.some(u => u !== 'µm')) {
          h += `<div style="color:${RED};">⚠ <b>وحِّد الوحدات قبل القسمة أو الضرب:</b> ${q('من الأسهل أن يتم تحويل جميع القياسات إلى الوحدات نفسها- وفي هذه الحال الميكرومتر، µm')} ${src(30)}</div>`;
          if (unk === 'M' && s.Iu !== s.Au) h += `<div style="color:${RED};">لو قسمتَ دون توحيد الوحدات: ${L(fmt(I) + ' ÷ ' + fmt(A) + ' = ' + res(I / A).t)} ✗</div>`;
        } else h += ok('القياسان بالوحدة نفسها (µm).');
      }
      return o + h + '</div>';
    },
    ctrlMag(){
      const s = this.s, u = s.unk;
      const opt = (arr, v) => arr.map(x => `<option${x === v ? ' selected' : ''}>${x}</option>`).join('');
      const field = (k, lab, val) => `<label>${lab} ${L(k)}: <input id="g11m_${k}" type="number" min="0" step="any" value="${u === k ? '' : val}" placeholder="?" ${u === k ? 'disabled' : ''} style="${S.inp}${u === k ? 'background:#ffebee;' : ''}" oninput="G11SIM_magnification.setMag()"></label>`;
      return `<div style="${S.ctrl}"><b>المجهول:</b>` +
        [['M','مقدار التكبير'], ['I','قياس الصورة'], ['A','القياس الحقيقي']].map(([k, n]) =>
          `<button style="${btn(u === k)}" onclick="G11SIM_magnification.setUnk('${k}')">${n} ${L(k)}</button>`).join('') + `</div>` +
        `<div style="${S.ctrl}">` +
          field('I', 'قياس الصورة', s.I) + `<select id="g11m_Iu" style="${S.sel}" onchange="G11SIM_magnification.setMag()">${opt(['mm','µm'], s.Iu)}</select>` +
          field('A', 'القياس الحقيقي', s.A) + `<select id="g11m_Au" style="${S.sel}" onchange="G11SIM_magnification.setMag()">${opt(['µm','nm','mm'], s.Au)}</select>` +
          field('M', 'مقدار التكبير ×', s.M) + `</div>` +
        `<div style="${S.ctrl}"><b>أمثلة الكتاب (ص ${AR(30)}):</b>` +
          `<button style="${btn(false)}" onclick="G11SIM_magnification.ex(2)">مثال ٢: الخليّة النباتيّة</button>` +
          `<button style="${btn(false)}" onclick="G11SIM_magnification.ex(3)">مثال ٣: الخليّة اللمفاويّة</button>` +
          `<button style="${btn(false)}" onclick="G11SIM_magnification.ex(4)">مثال ٤: البلاستيدة الخضراء</button></div>`;
    },
    setMag(){
      const s = this.s;
      ['I', 'A', 'M'].forEach(k => { const e = $('g11m_' + k); if (e && !e.disabled) s[k] = e.value; });
      s.Iu = $('g11m_Iu').value; s.Au = $('g11m_Au').value;
      $('g11m_view').innerHTML = this.viewMag();
    },
    setUnk(k){ this.setMag(); this.s.unk = k; $('g11m_ctrl').innerHTML = this.ctrlMag(); $('g11m_view').innerHTML = this.viewMag(); },
    ex(n){
      const s = this.s;
      if (n === 2) Object.assign(s, { unk:'M', I:'34', Iu:'mm', A:'80', Au:'µm' });
      if (n === 3) Object.assign(s, { unk:'M', I:'36', Iu:'mm', A:'6', Au:'µm' });
      if (n === 4) Object.assign(s, { unk:'A', I:'20', Iu:'mm', M:'5600' });
      $('g11m_ctrl').innerHTML = this.ctrlMag(); $('g11m_view').innerHTML = this.viewMag();
    },

    // ---- المرحلة 2: القياس الحقيقي من صورة (A = I ÷ M) ----
    viewAct(){
      const s = this.s, c = +s.cur, M = parseFloat(s.Mx), X0 = 150, PX = 12, cx = X0 + c * PX;
      const good = isFinite(M) && M > 0 && c > 0;
      let o = svgOpen(262);
      o += T(690, 20, 'صورة بالمجهر الإلكتروني لبلاستيدة خضراء (رسم توضيحي)', { a:'end', b:1 });
      o += T(12, 20, '× ' + (isFinite(M) ? fmt(M) : '?'), { a:'start', ltr:1, b:1, c: RED, fs:20 });
      // البلاستيدة: طولها في الصورة 20 mm (من X0 إلى X0+240)
      const ccx = X0 + 120, ccy = 108, rx = 120, ry = 42;
      o += `<ellipse cx="${ccx}" cy="${ccy}" rx="${rx}" ry="${ry}" fill="#c5e1a5" stroke="#33691e" stroke-width="3"/>`;
      o += `<ellipse cx="${ccx}" cy="${ccy}" rx="${rx - 5}" ry="${ry - 5}" fill="none" stroke="#33691e" stroke-width="1.2"/>`;
      [-24, -14, -4, 6, 16, 26].forEach(dy => { const hw = (rx - 14) * Math.sqrt(Math.max(0, 1 - (dy / (ry - 6)) ** 2));
        o += `<line x1="${(ccx - hw).toFixed(1)}" y1="${ccy + dy}" x2="${(ccx + hw).toFixed(1)}" y2="${ccy + dy}" stroke="#558b2f" stroke-width="1.3"/>`; });
      [-78, -38, 2, 42, 80].forEach((gx, i) => { const hh = i % 2 ? 40 : 30;
        o += `<rect x="${ccx + gx - 6}" y="${ccy - hh / 2}" width="12" height="${hh}" rx="2" fill="#33691e" opacity="0.85"/>`; });
      o += `<circle cx="${ccx + 60}" cy="${ccy + 22}" r="5" fill="#1b1b1b"/><circle cx="${ccx - 58}" cy="${ccy - 20}" r="4" fill="#1b1b1b"/>`;
      // القياس
      o += `<line x1="${X0}" y1="56" x2="${X0}" y2="190" stroke="#78909c" stroke-width="1.5" stroke-dasharray="5 4"/>`;
      if (c > 0) o += `<rect x="${X0}" y="160" width="${c * PX}" height="12" fill="${RED}" opacity="0.3"/>`;
      // المسطرة (mm)
      o += `<rect x="138" y="190" width="506" height="54" fill="#fffde7" stroke="#9e9e9e" stroke-width="1.5"/>`;
      for (let k = 0; k <= 40; k++) {
        const x = X0 + k * PX, hh = k % 10 === 0 ? 22 : (k % 5 === 0 ? 16 : 10);
        o += `<line x1="${x}" y1="190" x2="${x}" y2="${190 + hh}" stroke="#424242" stroke-width="${k % 5 === 0 ? 1.6 : 1}"/>`;
        if (k % 5 === 0) o += T(x, 238, String(k), { ltr:1, fs:16 });
      }
      o += T(672, 224, 'mm', { ltr:1, b:1 });
      // المؤشِّر
      o += `<line x1="${cx}" y1="58" x2="${cx}" y2="244" stroke="${RED}" stroke-width="2.5"/><polygon points="${cx - 8},47 ${cx + 8},47 ${cx},59" fill="${RED}"/>`;
      o += T(Math.min(630, Math.max(70, cx)), 42, 'I = ' + fmt(c) + ' mm', { ltr:1, b:1, c: RED, fs:17 });
      o += '</svg>';
      let h = `<div style="${S.panel}">`;
      h += stepRow(1, `${q('استخدم المسطرة لقياس الطول المشاهد لصورة البلاستيدة الخضراء (I)، بالمليمتر.')} ⟵ ${L('I = ' + fmt(c) + ' mm')}`);
      if (c <= 0) h += warn('حرِّك المؤشِّر الأحمر بالمنزلق لتقيس طول الصورة.');
      else if (Math.abs(c - 20) > 0.25) h += warn('المؤشِّر لا يقع على الطرف الأقصى لصورة البلاستيدة — حرِّكه حتى ينطبق عليه.');
      else h += ok(`${q('الطول الأقصى هو ' + L('20 mm') + '.')} ${src(30)}`);
      if (good) {
        const A = this.actual(c, M), R = res(A);
        h += stepRow(2, `${q('حوّل mm إلى µm.')} طول البلاستيدة الخضراء بالميكرومتر ${L('1000 × ' + fmt(c) + ' = ' + fmt(c * 1000) + ' µm')}`);
        h += stepRow(3, `${q('استخدم الصيغة لحساب الطول الحقيقي:')} القياس الحقيقي = قياس الصورة ÷ مقدار التكبير ⟵ ${L('A = I ÷ M = ' + fmt(c * 1000) + ' µm ÷ ' + fmt(M) + ' = ' + R.t + ' µm')}` +
          (R.approx ? ` <span style="color:#546e7a;">(القيمة قبل التقريب ${L(R.full + ' µm')})</span>` : ''));
        h += `<div style="color:#546e7a;">${src(30)}</div>`;
      } else if (!(isFinite(M) && M > 0)) h += warn('أدخل مقدار تكبير موجباً.');
      return o + h + '</div>';
    },
    setAct(){ const s = this.s; s.cur = +$('g11m_cur').value; s.Mx = $('g11m_Mx').value; $('g11m_curv').textContent = fmt(s.cur) + ' mm'; $('g11m_view').innerHTML = this.viewAct(); },
    exAct(){ $('g11m_cur').value = 20; $('g11m_Mx').value = 5600; this.setAct(); },

    build(i){
      this.reset();
      const s = this.s;
      let ctrl = '', view = '';
      if (i === 0) {
        view = this.viewConv();
        ctrl = `<div style="${S.ctrl}"><label>القيمة: <input id="g11m_cv" type="number" min="0" step="any" value="${s.cv}" style="${S.inp}" oninput="G11SIM_magnification.setConv()"></label>` +
          `<label>الوحدة: <select id="g11m_cu" style="${S.sel}" onchange="G11SIM_magnification.setConv()"><option selected>mm</option><option>µm</option><option>nm</option></select></label></div>` +
          `<div style="${S.ctrl}"><b>قيم من الكتاب:</b>` +
          `<button style="${btn(false)}" onclick="G11SIM_magnification.presetConv(1,'µm')">قطر خليّة البكتيريا (ص ${AR(22)})</button>` +
          `<button style="${btn(false)}" onclick="G11SIM_magnification.presetConv(25,'nm')">قطر الرايبوسوم (ص ${AR(22)})</button>` +
          `<button style="${btn(false)}" onclick="G11SIM_magnification.presetConv(0.25,'mm')">طول ١٠٠ وحدة عدسة عينيّة (ص ${AR(29)})</button>` +
          `<button style="${btn(false)}" onclick="G11SIM_magnification.presetConv(34,'mm')">طول الخليّة في الصورة (ص ${AR(30)})</button></div>`;
      } else if (i === 1) {
        view = this.viewMag();
        ctrl = `<div id="g11m_ctrl">${this.ctrlMag()}</div>`;
      } else {
        view = this.viewAct();
        ctrl = `<div style="${S.ctrl}"><label>حرِّك المؤشِّر على المسطرة: <input id="g11m_cur" type="range" min="0" max="40" step="0.5" value="${s.cur}" style="${S.rng}" oninput="G11SIM_magnification.setAct()"></label>` +
          `<b id="g11m_curv" dir="ltr" style="color:${RED};">${fmt(s.cur)} mm</b>` +
          `<label>مقدار التكبير ×<input id="g11m_Mx" type="number" min="1" step="any" value="${s.Mx}" style="${S.inp}" oninput="G11SIM_magnification.setAct()"></label>` +
          `<button style="${btn(false)}" onclick="G11SIM_magnification.exAct()">مثال ٤ من الكتاب (ص ${AR(30)})</button></div>`;
      }
      return `<div style="${S.wrap}"><div id="g11m_view">${view}</div>${ctrl}</div>`;
    }
  };

  // =====================================================================
  // 2) g11_graticule — معايرة شبكة العدسة العينيَّة ومقياس المنضدة (الدرس ١-٣)
  // =====================================================================
  const GX0 = 190, GU = 3.2, GCX = 350, GCY = 200, GR = 188;
  const GSTEPS = [
    { f:'a', p:'28', t:'يمكن قياس حجم الخلايا والعضيات بداخلها بمقياس شبكة العدسة العينيّة Eyepiece graticule. يتكوّن هذا المقياس الشفاف من 100 جزء كما في الشكل ١-٥أ' },
    { f:'b', p:'28', t:'وعادة يوجد هذا المقياس داخل العدسة العينية بحيث يمكن رؤيته أثناء قياس العيّنة، كما في الشكل ١-٥ب، والذي يوضح وضعية المقياس فوق خليّة من بين 6 خلايا طلائيّة من بطانة الخدّ (مثل تلك المبيّنة في الصورة ١-٣).' },
    { f:'b', p:'28–29', t:'تقع الخلية المختارة بين الرقمَين 40 و 60 على المقياس، لذا فإنه يقيس قطر 20 وحدة عدسة عينيّة (الفرق بين 60 و 40). ويجب أولًا ضبط مقياس العدسة العينيّة لمعرفة القياس الحقيقي لهذه الوحدات.' },
    { f:'c', p:'29', t:'لضبط مقياس شبكة العدسة العينيّة، توضع مسطرة شفافة صغيرة تسمى مقياس المنضدة Stage micrometer على منضدة المجهر، ويتم التركيز عليها. وقد يكون هذا المقياس محفورًا على شريحة زجاجيّة أو مطبوعًا على غشاء شفاف، وعادة ما يتضمن أجزاء فرعيّة من 0.1 و 0.01 مم.' },
    { f:'c', p:'29', t:'بعد ذلك، يمكن وضع صورة مقياس المنضدة ومقياس شبكة العدسة العينيّة الواحدة فوق الأخرى، كما في الشكل ١-٥ج.',
      x:'جِد تطابقًا (تقاربًا) جيدًا ودقيقًا لعلامتَين متباعدتَين قدر الإمكان على المقياسَين.', xp:'33' },
    { f:'c', p:'29', t:'في مقياس شبكة العدسة العينيّة المبيّن في الشكل ١-٥ يبلغ طول 100 وحدة <span dir="ltr">0.25 mm</span>، لذا تبلغ قيمة كل وحدة في العدسة العينيّة <span dir="ltr">0.25 / 100 = 0.0025 mm</span> أو بتحويل المليمتر (mm) إلى ميكرون (µm): <span dir="ltr">(1000 X 0.25) / 100 = 2.5 µm</span>' },
    { f:'b', p:'29', t:'يبلغ قطر الخليّة الذي يشاهد فوق المقياس في الشكل ١-٥ 20 وحدة عدسة عينيّة، لذا فإن قطرها الحقيقي هو: <span dir="ltr">20 X 2.5 µm = 50 µm</span> وهذا القطر أكبر من قطر خلايا كثيرة لدى الإنسان، لأن هذه الخلايا طلائيّة مسطحة.' },
    { f:'', p:'33', book:'كتاب التجارب العمليّة والأنشطة — نشاط ١-٥', h:'مهم',
      t:'من الضروري استخدام العدسة الشيئيّة نفسها تلك التي استخدمتها عند قياس الخلايا العماديّة بوحدات مقياس شبكة العدسة العينيّة. ستحتاج إلى إدارة العدسة العينيّة وتحريك الشريحة على المنضدة للحصول على تلازم جيّد للمقياسَين.' }
  ];

  const M2 = window.G11SIM_graticule = {
    s: null,
    UNIT_UM: 2.5,   // من المعايرة في الكتاب ص ٢٩
    reset(){ this.s = { off:0, L:0.25, n:'100', cl:40, cr:60, step:0 }; },
    // ---- حساب (يُختبر آليّاً) ----
    unitLen(Lmm, n){ return { mm: Lmm / n, um: Lmm * 1000 / n }; },
    expectedUnits(Lmm){ return Lmm * 400; },          // 100 وحدة = 0.25 mm
    diameter(cl, cr, unitUm){ const u = cr - cl; return { units: u, um: u * unitUm }; },

    // ---- رسم مجال الرؤية ----
    fovOpen(id){
      return `<defs><clipPath id="${id}"><circle cx="${GCX}" cy="${GCY}" r="${GR - 2}"/></clipPath></defs>` +
        `<circle cx="${GCX}" cy="${GCY}" r="${GR}" fill="#fbfcf4" stroke="#263238" stroke-width="3"/>`;
    },
    eyeScale(){
      let o = `<line x1="${GX0}" y1="170" x2="${GX0 + 100 * GU}" y2="170" stroke="#1a1a1a" stroke-width="1.2"/>`;
      for (let k = 0; k <= 100; k++) {
        const x = (GX0 + k * GU).toFixed(1), hh = k % 10 === 0 ? 26 : (k % 5 === 0 ? 18 : 11);
        o += `<line x1="${x}" y1="${170 - hh / 2}" x2="${x}" y2="${170 + hh / 2}" stroke="#1a1a1a" stroke-width="${k % 10 === 0 ? 1.6 : 1}"/>`;
        if (k % 10 === 0) o += T(x, 150, String(k), { ltr:1, fs:16 });
      }
      return o;
    },
    stageScale(off, Lsel){
      const dx = off * GU, xs = mm => GX0 + mm * 400 * GU;
      let o = `<g transform="translate(${dx.toFixed(1)},0)">`;
      o += `<rect x="${xs(-0.03).toFixed(1)}" y="200" width="${(xs(0.33) - xs(-0.03)).toFixed(1)}" height="70" fill="#e3f2fd" opacity="0.8"/>`;
      o += `<line x1="${xs(0)}" y1="234" x2="${xs(0.3).toFixed(1)}" y2="234" stroke="#0d47a1" stroke-width="1.4"/>`;
      for (let k = 0; k <= 30; k++) {
        const x = xs(k / 100).toFixed(1), hh = k % 10 === 0 ? 26 : (k % 5 === 0 ? 18 : 11);
        o += `<line x1="${x}" y1="${234 - hh}" x2="${x}" y2="234" stroke="#0d47a1" stroke-width="${k % 10 === 0 ? 1.8 : 1.1}"/>`;
        if (k % 10 === 0) o += T(x, 256, k === 0 ? '0' : '0.' + (k / 10), { ltr:1, fs:16, c:'#0d47a1', b:1 });
      }
      if (Lsel) { const x = xs(Lsel).toFixed(1);
        o += `<line x1="${x}" y1="132" x2="${x}" y2="268" stroke="${RED}" stroke-width="2.5" stroke-dasharray="6 4"/>`; }
      return o + '</g>';
    },

    // ---- المرحلة 0: المعايرة ----
    viewCal(){
      const s = this.s, n = parseFloat(s.n), exp = this.expectedUnits(s.L);
      let o = svgOpen(400) + this.fovOpen('g11g_clip');
      o += `<g clip-path="url(#g11g_clip)">${this.stageScale(s.off, s.L)}${this.eyeScale()}</g>`;
      o += T(690, 160, 'مقياس شبكة', { a:'end', b:1, c:'#1a1a1a' }) + T(690, 180, 'العدسة العينيّة', { a:'end', b:1 });
      o += T(10, 238, 'مقياس المنضدة', { a:'start', b:1, c:'#0d47a1' }) + T(10, 260, 'كلُّ جزء صغير', { a:'start', c:'#0d47a1' }) + T(10, 282, '= 0.01 mm', { a:'start', ltr:1, c:'#0d47a1', b:1 });
      o += T(10, 30, 'الخطّ الأحمر = الطول المعلوم', { a:'start', c: RED, b:1 });
      o += '</svg>';
      let h = `<div style="${S.panel}">`;
      if (s.off !== 0) h += warn('الصفران غير متطابقين: حرِّك مقياس المنضدة بالمنزلق حتى ينطبق صفره على صفر مقياس العدسة العينيّة.');
      else h += ok('صفرا المقياسَين متطابقان.');
      h += `<div>الطول المعلوم على مقياس المنضدة (حتى الخطّ الأحمر): ${L(fmt(s.L) + ' mm')} — يقابله على مقياس العدسة العينيّة: ${L(isFinite(n) && n > 0 ? fmt(n) : '؟')} وحدة.</div>`;
      if (s.off === 0 && isFinite(n) && n > 0) {
        const u = this.unitLen(s.L, n);
        if (Math.abs(n - exp) > 0.5) h += warn('راجع قراءتك: أين يقع الخطّ الأحمر على مقياس العدسة العينيّة؟');
        else h += ok('قراءة صحيحة.');
        h += `<div><b>قيمة كل وحدة في العدسة العينيّة</b> = ${L(fmt(s.L) + ' / ' + fmt(n) + ' = ' + fmt(u.mm) + ' mm')}</div>`;
        h += `<div>أو بتحويل المليمتر (mm) إلى ميكرون (µm): ${L('(1000 × ' + fmt(s.L) + ') / ' + fmt(n) + ' = ' + res(u.um).t + ' µm')}` +
          (s.L === 0.25 && n === 100 ? ` — ${q('يبلغ طول 100 وحدة ' + L('0.25 mm'))} ${src(29)}` : '') + `</div>`;
      } else if (s.off === 0) h += `<div style="color:${TEAL};">اكتب عدد وحدات العدسة العينيّة المقابلة للخطّ الأحمر.</div>`;
      return o + h + '</div>';
    },
    setCal(){ const s = this.s; s.off = +$('g11g_off').value; s.n = $('g11g_n').value; $('g11g_offv').textContent = (s.off > 0 ? '+' : '') + fmt(s.off); $('g11g_view').innerHTML = this.viewCal(); },
    setL(Lm){ this.s.L = Lm; $('g11g_n').value = ''; [0.1, 0.2, 0.25].forEach(v => { const b = $('g11g_L' + String(v).replace('.', '')); if (b) b.setAttribute('style', btn(v === Lm)); }); this.setCal(); },
    exCal(){ $('g11g_off').value = 0; this.s.L = 0.25; $('g11g_n').value = 100; [0.1, 0.2, 0.25].forEach(v => { const b = $('g11g_L' + String(v).replace('.', '')); if (b) b.setAttribute('style', btn(v === 0.25)); }); this.setCal(); },

    // ---- المرحلة 1: قياس الخليَّة ----
    viewCell(){
      const s = this.s, xL = GX0 + s.cl * GU, xR = GX0 + s.cr * GU, w = xR - xL, cx = (xL + xR) / 2, ry = Math.max(22, Math.min(80, w * 0.42));
      const d = this.diameter(s.cl, s.cr, this.UNIT_UM);
      let o = svgOpen(400) + this.fovOpen('g11g_clip2');
      o += `<g clip-path="url(#g11g_clip2)">`;
      [[245, 85, 46, 34], [470, 80, 40, 30], [240, 320, 44, 32], [465, 318, 48, 34]].forEach(([x, y, a, b]) =>
        o += `<ellipse cx="${x}" cy="${y}" rx="${a}" ry="${b}" fill="#e3f2fd" stroke="#90a4ae" stroke-width="1.5"/><ellipse cx="${x + 4}" cy="${y - 3}" rx="7" ry="5" fill="#90a4ae"/>`);
      o += `<ellipse cx="${cx.toFixed(1)}" cy="176" rx="${(w / 2).toFixed(1)}" ry="${ry.toFixed(1)}" fill="#bbdefb" fill-opacity="0.85" stroke="#1a237e" stroke-width="2.2"/>`;
      o += `<ellipse cx="${(cx + w * 0.08).toFixed(1)}" cy="168" rx="${Math.max(5, w * 0.12).toFixed(1)}" ry="${Math.max(4, w * 0.09).toFixed(1)}" fill="#1a237e"/>`;
      o += this.eyeScale();
      [xL, xR].forEach(x => o += `<line x1="${x.toFixed(1)}" y1="110" x2="${x.toFixed(1)}" y2="262" stroke="${RED}" stroke-width="2" stroke-dasharray="6 4"/>`);
      o += `</g>`;
      o += T(Math.max(40, xL - 4).toFixed(1), 286, fmt(s.cl), { ltr:1, b:1, c: RED, fs:18, a:'end' }) + T(Math.min(660, xR + 4).toFixed(1), 286, fmt(s.cr), { ltr:1, b:1, c: RED, fs:18, a:'start' });
      o += T(690, 160, 'مقياس شبكة', { a:'end', b:1 }) + T(690, 180, 'العدسة العينيّة', { a:'end', b:1 });
      o += T(10, 30, 'خليّة من بطانة الخدّ', { a:'start', b:1, c:'#1a237e' });
      o += '</svg>';
      let h = `<div style="${S.panel}">`;
      h += `<div>حافّتا الخليّة على المقياس: ${L(fmt(s.cl))} و ${L(fmt(s.cr))} ⟵ عدد الوحدات = ${L(fmt(s.cr) + ' − ' + fmt(s.cl) + ' = ' + fmt(d.units))} وحدة عدسة عينيّة.</div>`;
      h += `<div>من المعايرة: الوحدة الواحدة = ${L('2.5 µm')} ⟵ <b>القطر الحقيقي</b> = ${L(fmt(d.units) + ' X 2.5 µm = ' + res(d.um).t + ' µm')}</div>`;
      if (s.cl === 40 && s.cr === 60) h += `<div style="color:#37474f;">${q('يبلغ قطر الخليّة الذي يشاهد فوق المقياس في الشكل ١-٥ 20 وحدة عدسة عينيّة، لذا فإن قطرها الحقيقي هو: ' + L('20 X 2.5 µm = 50 µm'))} ${src(29)}</div>`;
      return o + h + '</div>';
    },
    setCell(which){
      const s = this.s; let a = +$('g11g_cl').value, b = +$('g11g_cr').value;
      if (b <= a) { if (which === 'l') b = Math.min(100, a + 1); else a = Math.max(0, b - 1); }
      $('g11g_cl').value = a; $('g11g_cr').value = b; s.cl = a; s.cr = b;
      $('g11g_clv').textContent = fmt(a); $('g11g_crv').textContent = fmt(b);
      $('g11g_view').innerHTML = this.viewCell();
    },
    cellPreset(a, b){ $('g11g_cl').value = a; $('g11g_cr').value = b; this.setCell('l'); },

    // ---- المرحلة 2: خطوات القياس (نصُّ الكتاب) ----
    miniFov(cx, label, kind, on){
      const cy = 132, r = 92, x0 = cx - 75, u = 1.5;
      let o = `<defs><clipPath id="g11g_m${kind}"><circle cx="${cx}" cy="${cy}" r="${r - 2}"/></clipPath></defs>`;
      o += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fbfcf4" stroke="${on ? RED : '#455a64'}" stroke-width="${on ? 5 : 2.5}"/>`;
      o += `<g clip-path="url(#g11g_m${kind})">`;
      if (kind === 'b') [[cx - 40, cy - 40], [cx + 35, cy - 45], [cx + 10, cy + 2], [cx - 45, cy + 40], [cx + 40, cy + 42]].forEach(([x, y]) =>
        o += `<ellipse cx="${x}" cy="${y}" rx="22" ry="18" fill="#bbdefb" stroke="#1a237e" stroke-width="1.5"/><ellipse cx="${x}" cy="${y}" rx="5" ry="4" fill="#1a237e"/>`);
      o += `<line x1="${x0}" y1="${cy}" x2="${x0 + 150}" y2="${cy}" stroke="#1a1a1a" stroke-width="1"/>`;
      for (let k = 0; k <= 100; k += 5) { const x = x0 + k * u, hh = k % 10 === 0 ? 12 : 7;
        o += `<line x1="${x}" y1="${cy - hh / 2}" x2="${x}" y2="${cy + hh / 2}" stroke="#1a1a1a" stroke-width="1"/>`; }
      [0, 50, 100].forEach(k => o += T(x0 + k * u, cy - 12, String(k), { ltr:1, fs:16 }));
      if (kind === 'c') {
        o += `<rect x="${x0 - 6}" y="${cy + 10}" width="162" height="40" fill="#e3f2fd" opacity="0.85"/>`;
        for (let k = 0; k <= 25; k++) { const x = x0 + k * 4 * u, hh = k % 10 === 0 ? 14 : (k % 5 === 0 ? 10 : 6);
          o += `<line x1="${x}" y1="${cy + 26 - hh}" x2="${x}" y2="${cy + 26}" stroke="#0d47a1" stroke-width="1"/>`; }
        [0, 0.1, 0.2].forEach(m => o += T(x0 + m * 400 * u, cy + 44, String(m), { ltr:1, fs:16, c:'#0d47a1' }));
      }
      o += `</g>` + T(cx, 22, label, { b:1, fs:18, c: on ? RED : '#1a1a1a' });
      return o;
    },
    viewSteps(){
      const s = this.s, st = GSTEPS[s.step];
      let o = svgOpen(236);
      o += this.miniFov(590, 'أ.', 'a', st.f === 'a') + this.miniFov(350, 'ب.', 'b', st.f === 'b') + this.miniFov(110, 'ج.', 'c', st.f === 'c');
      o += '</svg>';
      let h = `<div style="${S.panel}"><div style="color:${TEAL};font-weight:700;">${st.h ? '⚠ ' + st.h : 'الخطوة ' + AR(s.step + 1) + ' من ' + AR(GSTEPS.length)}</div>`;
      h += `<div style="font-size:17px;">${q(st.t)} ${src(st.p, st.book)}</div>`;
      if (st.x) h += `<div style="margin-top:4px;"><b>للتطابق الجيِّد:</b> ${q(st.x)} ${src(st.xp, 'كتاب التجارب العمليّة والأنشطة')}</div>`;
      return o + h + '</div>';
    },
    go(d){ const s = this.s; s.step = Math.max(0, Math.min(GSTEPS.length - 1, d)); $('g11g_view').innerHTML = this.viewSteps();
      for (let i = 0; i < GSTEPS.length; i++) { const b = $('g11g_sb' + i); if (b) b.setAttribute('style', btn(i === s.step, 'min-width:38px;padding:5px 8px;')); } },

    build(i){
      this.reset();
      const s = this.s;
      let view = '', ctrl = '';
      if (i === 0) {
        view = this.viewCal();
        ctrl = `<div style="${S.ctrl}"><label>حرِّك مقياس المنضدة: <input id="g11g_off" type="range" min="-25" max="25" step="0.5" value="${s.off}" style="${S.rng}" oninput="G11SIM_graticule.setCal()"></label>` +
          `<b id="g11g_offv" dir="ltr" style="color:${RED};">0</b> <span>وحدة إزاحة</span></div>` +
          `<div style="${S.ctrl}"><b>الطول المعلوم:</b>` +
          [0.1, 0.2, 0.25].map(v => `<button id="g11g_L${String(v).replace('.', '')}" style="${btn(v === s.L)}" onclick="G11SIM_graticule.setL(${v})">${L(v + ' mm')}</button>`).join('') +
          `<label>عدد وحدات العدسة المقابلة: <input id="g11g_n" type="number" min="0" step="any" value="${s.n}" style="${S.inp}" oninput="G11SIM_graticule.setCal()"></label>` +
          `<button style="${btn(false)}" onclick="G11SIM_graticule.exCal()">مثال الكتاب (ص ${AR(29)})</button></div>`;
      } else if (i === 1) {
        view = this.viewCell();
        ctrl = `<div style="${S.ctrl}"><label>الحافّة اليسرى: <input id="g11g_cl" type="range" min="0" max="100" step="1" value="${s.cl}" style="${S.rng}" oninput="G11SIM_graticule.setCell('l')"></label><b id="g11g_clv" dir="ltr" style="color:${RED};">${s.cl}</b>` +
          `<label>الحافّة اليمنى: <input id="g11g_cr" type="range" min="0" max="100" step="1" value="${s.cr}" style="${S.rng}" oninput="G11SIM_graticule.setCell('r')"></label><b id="g11g_crv" dir="ltr" style="color:${RED};">${s.cr}</b></div>` +
          `<div style="${S.ctrl}"><b>اختر خليّة:</b><button style="${btn(false)}" onclick="G11SIM_graticule.cellPreset(40,60)">خليّة الكتاب (ص ${AR(28)})</button>` +
          `<button style="${btn(false)}" onclick="G11SIM_graticule.cellPreset(8,34)">خليّة أخرى ١</button><button style="${btn(false)}" onclick="G11SIM_graticule.cellPreset(62,95)">خليّة أخرى ٢</button></div>`;
      } else {
        view = this.viewSteps();
        ctrl = `<div style="${S.ctrl}"><button style="${btn(false)}" onclick="G11SIM_graticule.go(G11SIM_graticule.s.step-1)">→ السابق</button>` +
          GSTEPS.map((x, k) => `<button id="g11g_sb${k}" style="${btn(k === s.step, 'min-width:38px;padding:5px 8px;')}" onclick="G11SIM_graticule.go(${k})">${x.h ? '!' : AR(k + 1)}</button>`).join('') +
          `<button style="${btn(false)}" onclick="G11SIM_graticule.go(G11SIM_graticule.s.step+1)">التالي ←</button></div>`;
      }
      return `<div style="${S.wrap}"><div id="g11g_view">${view}</div>${ctrl}</div>`;
    }
  };

  // =====================================================================
  // 3) g11_microscopes — ماذا ترى بكلِّ مجهر؟ (الدرسان ١-٢ و١-٤؛ الهدفان 1-5 و1-6)
  // =====================================================================
  // lm:true = ورد في الهدف 1-5 (يُرى بالمجهر الضوئي) · lm:false = ورد في الهدف 1-6 (المجهر الإلكتروني)
  // def: نصُّ الكتاب حرفيّاً · p: الصفحة · m: 'هامش' (مصطلحات علميَّة) أو 'متن'
  const ER_M = { t:'الشبكة الإندوبلازميّة Endoplasmic reticulum (ER): شبكة من أكياس مسطّحة تمتدّ عبر سيتوبلازم الخلايا حقيقيّة النواة تنتقل عبرها الجُزيئات بشكل منفصل عن باقي السيتوبلازم، وتمتدّ هذه الشبكة لتتّصل بالغشاء الخارجي للغلاف النووي.', p:36, m:'هامش' };
  const Q1 = 'أيّ من التراكيب الخلويّة الآتية يمكن رؤيته بالمجهر الضوئي؟ أ. الميتوكندريون. ب. الرايبوسوم. ج. الشبكة الإندوبلازميّة الخشنة. د. الشبكة الإندوبلازميّة الناعمة.';
  const ST = {
    mem:   { n:'غشاء سطح الخلية', en:'Cell surface membrane', lm:true, c:'ap', lb:'غشاء سطح|الخليّة',
             d:[{ t:'غشاء رقيق جدًا يحيط بجميع الخلايا يبلغ سمكه 7 نانومتر تقريبًا. وهو شبه منفذ، ويتحكّم بتبادل الموادّ بين الخليّة والبيئة المحيطة بها.', p:24, m:'هامش' }] },
    nuc:   { n:'النواة', en:'Nucleus', lm:true, c:'ap', lb:'النواة',
             d:[{ t:'(جمعها: نُوًى): وهي عضيّة كبيرة نسبيًا توجد في الخلايا حقيقيّة النواة، ولا توجد في الخلايا بدائيّة النواة. تحتوي النواة على DNA، وتتحكّم بالتالي بأنشطة الخليّة. وهي محاطة بغشاءَين يشكّلان معًا الغلاف النووي.', p:21, m:'هامش' }],
             v:{ t:'النواة تركيب كبير نسبيًا تصطبغ بشدّة فتسهل بالتالي رؤيتها بالمجهر.', p:24 } },
    golgi: { n:'جهاز جولجي', en:'Golgi apparatus', lm:true, c:'ap', lb:'جهاز جولجي',
             d:[{ t:'(أجسام جولجي Golgi bodies أو معقّد جولجي Golgi complex): عُضيّة توجد في الخلايا حقيقيّة النواة، وهي تتكوّن من كومة من الأكياس الغشائية المسطّحة، وتتشكّل باستمرار من أحد الطرفَين، ثم تنفصل لتكوّن حويصلات جولجي عند الطرف الآخر. ويعدّل جهاز جولجي التركيب الكيميائي للجُزيئات التي ينقلها، فعلى سبيل المثال: يمكنه إضافة السكّريات إلى البروتينات لتكوين البروتينات السكريّة.', p:37, m:'هامش' }],
             v:{ t:'في عام 1898م أدّى استخدام العالم كاميلو جولجي لصبغة خاصة تحتوي على الفضّة إلى اكتشاف جهاز جولجي Golgi apparatus.', p:24 } },
    mito:  { n:'الميتوكندريون', en:'Mitochondrion', lm:true, c:'ap', lb:'الميتوكندريون', q1:true,
             d:[{ t:'(جمعها ميتوكندريا): العضية في الخلايا حقيقيّة النواة حيث تجري عملية التنفّس الهوائي.', p:25, m:'هامش' }],
             v:{ t:'الميتوكندريا Mitochondria (مفردها ميتوكندريون Mitochondrion) أكثر العضيات مشاهدة بالمجهر الضوئي', p:24 } },
    cent:  { n:'السنتريول', en:'Centriole', lm:true, c:'a', lb:'السنتريولات',
             d:[{ t:'واحد من تركيبَين أسطوانيَّين صغيرَين يتكوّن من الأنيبيبات الدقيقة، في الخلايا الحيوانيّة، في منطقة قريبة من النواة تسمّى الجسم المركزي (السنتروسوم). ويوجد التركيبان أيضًا عند قاعدة الأهداب والأسواط.', p:42, m:'هامش' }],
             v:{ t:'تبدو السنتريولات Centrioles بالمجهر الضوئي كتركيب صغير بالقرب من النواة (الشكل ١-١)', p:25 },
             ve:{ t:'يبيّن المجهر الإلكتروني وجود سنتريولَين Centrioles خارج نواة الخليّة الحيوانيّة وليس سنتريولًا واحدًا كما يبدو بالمجهر الضوئي (قارن الشكلَين ١-١ و ١-٦).', p:42 } },
    chl:   { n:'البلاستيدة الخضراء', en:'Chloroplast', lm:true, c:'p', lb:'البلاستيدة|الخضراء',
             d:[{ t:'عضيّة يحيط بها غلاف (غشاءان)، وتجري فيها عمليّة التمثيل الضوئي في الخلايا حقيقيّة النواة.', p:26, m:'هامش' }],
             v:{ t:'وهي عضيات كبيرة نسبيًا، لذا تشاهد بسهولة بالمجهر الضوئي، حتى إنه يمكن بالمجهر الضوئي رؤية حُبيبات جرانا Grana (مفردها جرانوم Granum) داخل البلاستيدات الخضراء (الشكل ١-٢)', p:25 } },
    wall:  { n:'الجدار الخلوي', en:'Cell wall', lm:true, c:'p', lb:'الجدار الخلوي',
             d:[{ t:'الجدار الذي يحيط بخلايا بدائيّة النواة والنبات والفطريات. يحتوي الجدار على مادّة داعمة تحمي الخليّة من الضرر الميكانيكي، وتدعمها، وتحول دون انفجارها نتيجة الأسموزيّة إذا وجدت في محلول ذي جهد مائي مرتفع.', p:25, m:'هامش' }],
             v:{ t:'تشاهد الخلايا النباتيّة بالمجهر الضوئي بسهولة أكبر من الخلايا الحيوانيّة، ويعود ذلك لكونها أكبر حجمًا، ويحيط بها جدار خلوي Cell wall بخلاف الخلايا الحيوانيّة.', p:25 } },
    vac:   { n:'الفجوة المركزية الكبيرة الدائمة', en:'Vacuole', lm:true, c:'p', lb:'الفجوة|المركزيّة',
             d:[{ t:'الفجوة Vacuole: عضيّة موجودة في الخلايا حقيقيّة النواة. وتمثّل الفجوة المركزية الكبيرة والدائمة سمة تركيبيّة للخلايا النباتيّة، وهي تقوم بعدّة وظائف، تشمل تخزين الموادّ الكيميائيّة الحيويّة مثل الأملاح والسكّريات والفضلات. وقد تتكوّن الفجوات المؤقّتة مثل الفجوات البلعميّة في الخلايا الحيوانيّة.', p:26, m:'هامش' }] },
    tono:  { n:'غشاء الفجوة (تونوبلاست)', en:'Tonoplast', lm:true, c:'p', lb:'غشاء الفجوة|تونوبلاست',
             d:[{ t:'غشاء منفذ جزئيًّا يحيط بالفجوات المركزيّة النباتيّة.', p:26, m:'هامش' }] },
    env:   { n:'الغلاف النووي', en:'Nuclear envelope', lm:false, c:'ap', lb:'الغلاف النووي', noQuiz:true,
             d:[{ t:'الغشاءان المتجاوران اللذان يحيطان بالنواة، وبه ثقوب نوويّة.', p:35, m:'هامش' }] },
    nucl:  { n:'النويّة', en:'Nucleolus', lm:false, c:'ap', lb:'النويّة', noQuiz:true,
             d:[{ t:'تركيب صغير واحد أو أكثر يوجد داخل النواة. تشاهد النويّة عادة كجسم شديد الاصطباغ، ووظيفتها استخدام تعليمات DNA الموجود فيها لبناء الرايبوسومات.', p:35, m:'هامش' }] },
    rer:   { n:'الشبكة الإندوبلازميّة الخشنة', en:'Rough endoplasmic reticulum (RER)', lm:false, c:'ap', lb:'الشبكة الإندوبلازميّة|الخشنة', q1:true,
             d:[{ t:'تسمّى الشبكة الإندوبلازميّة الخشنة بهذا الاسم لأنها مغطّاة بكثير من العُضيّات الصغيرة المسمّاة رايبوسومات … الرايبوسومات هي مواقع بناء البروتين، ويمكن أن توجد أيضًا حرة في السيتوبلازم. وتقوم الشبكة الإندوبلازمية الخشنة بنقل البروتينات.', p:36, m:'متن' }, ER_M],
             v:{ t:'تبدو الشبكة الإندوبلازميّة Endoplasmic reticulum كثيرة التفاصيل بالمجهر الإلكتروني', p:36 } },
    ser:   { n:'الشبكة الإندوبلازميّة الناعمة', en:'Smooth endoplasmic reticulum (SER)', lm:false, c:'ap', lb:'الشبكة الإندوبلازميّة|الناعمة', q1:true,
             d:[{ t:'للشبكة الإندوبلازميّة الناعمة مظهر أملس لعدم وجود رايبوسومات عليها. وتختلف وظيفتها عن وظيفة الشبكة الإندوبلازميّة الخشنة، فهي تصنع الدهون والستيرويدات مثل الكولسترول والهرمونات الجنسيّة: الإستروجين والتستوستيرون.', p:36, m:'متن' }, ER_M],
             v:{ t:'تبدو الشبكة الإندوبلازميّة Endoplasmic reticulum كثيرة التفاصيل بالمجهر الإلكتروني', p:36 } },
    cris:  { n:'الأعراف (في الميتوكندريون)', en:'Cristae', lm:false, c:'ap', lb:'الأعراف',
             d:[{ t:'أعراف Cristae (مفردها عرف Crista): طيّات من الغشاء الداخلي لغلاف الميتوكندريا حيث توجد جُزيئات من إنزيم ATP سينثيز، وسلاسل نقل الإلكترون، المرتبطة بعملية التنفس الهوائي.', p:40, m:'هامش' },
                { t:'تحتوي الميتوكندريا على رايبوسومات <span dir="ltr">70S</span> وحمض نووي حلقي خاص بها، لتمكنها من بناء البروتينات اللازمة للتنفس.', p:40, m:'متن' }] },
    ribo:  { n:'الرايبوسوم', en:'Ribosome', lm:false, c:'ap', lb:'الرايبوسومات', q1:true,
             d:[{ t:'عُضيّة صغيرة توجد بأعداد كبيرة في جميع الخلايا. يبلغ قطر رايبوسوم الخلايا بدائيّة النواة <span dir="ltr">20 nm</span> تقريبًا، في حين يبلغ قطر رايبوسومات الخلايا حقيقيّة النواة <span dir="ltr">25 nm</span> تقريبًا.', p:37, m:'هامش' },
                { t:'تعرف رايبوسومات الخلايا حقيقيّة النواة بـ <span dir="ltr">80S</span>، أمّا رايبوسومات الخلايا بدائيّة النواة فتعرف بـ <span dir="ltr">70S</span>، وهي أصغر قليلًا من رايبوسومات حقيقيّة النواة. وتحتوي الميتوكندريا والبلاستيدات الخضراء أيضًا على رايبوسومات <span dir="ltr">70S</span>.', p:37, m:'متن' }],
             v:{ t:'الرايبوسومات Ribosomes عضيات صغيرة جدًا ولا تُرى بالمجهر الضوئي.', p:37 } },
    lyso:  { n:'الليسوسوم', en:'Lysosome', lm:false, c:'a', lb:'الليسوسوم',
             d:[{ t:'عُضيّة كرويّة الشكل توجد في الخلايا حقيقيّة النواة. وهي تحتوي على إنزيمات هاضمة (إنزيمات التحلّل المائي). وتؤدّي وظائف تفكيك وهدم متنوعة، مثل إزالة عُضيّات الخليّة القديمة.', p:38, m:'هامش' }] },
    mt:    { n:'الأنيبيبات الدقيقة', en:'Microtubules', lm:false, c:'ap', lb:'الأنيبيبات|الدقيقة',
             d:[{ t:'أُنيبيبات صغيرة تتكوّن من بروتينات تسمى تيوبيولين، وتوجد في معظم الخلايا حقيقيّة النواة. وهي تؤدّي وظائف كثيرة متنوّعة، بما في ذلك دعم الخليّة وتحديد شكلها. تتكون خيوط المغزل من أنيبيبات دقيقة تساعد في فصل الكروماتيدات أو الكروموسومات أثناء الانقسام المتساوي أو الاختزالي.', p:41, m:'هامش' }] },
    cilia: { n:'الأهداب', en:'Cilia', lm:false, c:'a', lb:'الأهداب',
             d:[{ t:'(مفردها هدب Cilium): تراكيب تشبه السوط تمتد من سطح العديد من الخلايا الحيوانيّة، والعديد من الكائنات أحاديّة الخليّة؛ تتحرّك بشكل موجي ما يؤدّي إلى التنقل أو تحرُّك السوائل حولها عبر سطح الخليّة.', p:43, m:'هامش' }] },
    mv:    { n:'الخملات الدقيقة', en:'Microvilli', lm:false, c:'a', lb:'الخملات|الدقيقة',
             d:[{ t:'(مفردها خملة دقيقة Microvillus): نتوءات على هيئة أصابع تمتدّ من سطح الخليّة فتزيد من مساحة سطح الخليّة لامتصاص أو إفراز أكثر كفاءة.', p:34, m:'هامش' }] },
    thy:   { n:'الثايلاكويدات (في البلاستيدة الخضراء)', en:'Thylakoids', lm:false, c:'p', lb:'الثايلاكويدات',
             d:[{ t:'الثايلاكويد Thylakoid: كيس مسطّح محاط بغشاء مملوء بسائل، وهو موقع التفاعلات الضوئيّة في عملية التمثيل الضوئي في البلاستيدة الخضراء.', p:45, m:'هامش' },
                { t:'ولدى البلاستيدات الخضراء كما في الميتوكندريا، آليتها في بناء ما تحتاج إليه من البروتينات، بما في ذلك رايبوسومات <span dir="ltr">70 S</span> و DNA الحلقي.', p:46, m:'متن' }] },
    plasmo:{ n:'الروابط البلازميّة', en:'Plasmodesmata', lm:false, c:'p', lb:'الروابط|البلازميّة',
             d:[{ t:'الرابطة البلازميّة Plasmodesma (الجمع: الروابط البلازمية Plasmodesmata): تركيب يشبه الثقب يوجد في جدران الخليّة النباتيّة. تنتظم الروابط البلازمية في الخلايا النباتيّة المتجاورة لتشكل مسارًا يشبه الأنبوب عبر جدران الخليّة، ما يسمح بمرور الموادّ من خليّة إلى أخرى. تحتوي الثقوب على شبكة إندوبلازميّة، وهي مبطّنة بغشاء سطح الخليّة.', p:47, m:'هامش' }] },
  };

  // نقاط الإشارة والجهة لكلِّ تركيب في كلِّ خليَّة: [مفتاح، جهة، x، y]
  const LBL = {
    a: [['cilia','L',287,84], ['mem','L',202,240], ['env','L',266,226], ['nuc','L',300,250], ['nucl','L',332,212], ['rer','L',250,205],
        ['ribo','L',262,122], ['ser','L',300,330],
        ['cent','R',398,134], ['mt','R',470,112], ['mito','R',462,147], ['cris','R',448,152], ['mv','R',520,200], ['golgi','R',448,214], ['lyso','R',398,302]],
    p: [['wall','L',172,92], ['ser','L',215,86], ['env','L',230,123], ['nucl','L',252,154], ['nuc','L',222,176], ['rer','L',282,200],
        ['golgi','L',258,246], ['mt','L',190,250], ['plasmo','L',172,292],
        ['mito','R',506,140], ['cris','R',506,118], ['ribo','R',470,92], ['thy','R',425,80], ['chl','R',445,352], ['vac','R',420,220], ['tono','R',490,262], ['mem','R',520,330]]
  };

  const M3 = window.G11SIM_microscopes = {
    ST, s: null,
    reset(){ this.s = { mode:'lm', sel:'mito', lab:true, qz:null }; },
    // يُرى في هذا الوضع؟ (الضوئي: الهدف 1-5 فقط؛ الإلكتروني: 1-5 + 1-6)
    visible(k, cell, mode){ const t = ST[k]; return t.c.indexOf(cell) >= 0 && (mode === 'em' || t.lm); },
    visibleList(cell, mode){ return Object.keys(ST).filter(k => this.visible(k, cell, mode)); },

    g(k, inner){ return `<g onclick="G11SIM_microscopes.pick('${k}')" style="cursor:pointer;">${inner}</g>`; },
    ell(cx, cy, rx, ry, rot, fill, st, sw){ return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" transform="rotate(${rot} ${cx} ${cy})" fill="${fill}" stroke="${st}" stroke-width="${sw}"/>`; },
    mito(cx, cy, rot, em){
      if (!em) return this.ell(cx, cy, 19, 8, rot, '#ffab91', '#bf360c', 1.5);
      let o = `<g transform="translate(${cx} ${cy}) rotate(${rot})">` +
        `<ellipse rx="26" ry="12" fill="#ffccbc" stroke="#bf360c" stroke-width="2"/><ellipse rx="22.5" ry="8.5" fill="none" stroke="#bf360c" stroke-width="1"/>` +
        `<path d="M-18 -7 L-14 5 L-10 -7 L-6 5 L-2 -7 L2 5 L6 -7 L10 5 L14 -7 L18 4" fill="none" stroke="#bf360c" stroke-width="1.6"/></g>`;
      return o;
    },
    golgi(cx, cy, em){
      let o = '';
      for (let i = 0; i < 4; i++) o += `<path d="M${cx - 24} ${cy - 11 + i * 7} q 24 10 48 0" fill="none" stroke="${em ? '#2e7d32' : '#66bb6a'}" stroke-width="${em ? 3 : 2.5}"/>`;
      if (em) [[cx - 30, cy - 6], [cx + 30, cy - 4], [cx + 33, cy + 8], [cx - 31, cy + 9]].forEach(([x, y]) => o += `<circle cx="${x}" cy="${y}" r="3.2" fill="#a5d6a7" stroke="#2e7d32" stroke-width="1.2"/>`);
      return o + `<rect x="${cx - 34}" y="${cy - 16}" width="68" height="34" fill="transparent"/>`;
    },
    nucleus(cx, cy, r, em, k){
      let o = '';
      o += this.g('nuc', `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${em ? '#d1c4e9' : '#b39ddb'}" stroke="${em ? 'none' : '#4527a0'}" stroke-width="1.5"/>` +
        [[-0.4, 0.3], [0.35, 0.4], [-0.2, -0.45], [0.45, -0.2], [0, 0.6]].map(([a, b]) => `<circle cx="${(cx + a * r).toFixed(1)}" cy="${(cy + b * r).toFixed(1)}" r="${(r * 0.09).toFixed(1)}" fill="${em ? '#9575cd' : '#5e35b1'}"/>`).join(''));
      if (em) {
        o += this.g('env', `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#4527a0" stroke-width="2" stroke-dasharray="26 5"/>` +
          `<circle cx="${cx}" cy="${cy}" r="${r - 4.5}" fill="none" stroke="#4527a0" stroke-width="2" stroke-dasharray="26 5"/>` +
          `<circle cx="${cx}" cy="${cy}" r="${r - 2}" fill="none" stroke="transparent" stroke-width="12"/>`);
        o += this.g('nucl', `<circle cx="${cx + r * 0.22}" cy="${cy - r * 0.15}" r="${(r * 0.27).toFixed(1)}" fill="#4a148c"/>`);
      }
      return o;
    },
    arcPath(cx, cy, r, a1, a2){ const p = a => [cx + r * Math.cos(a * Math.PI / 180), cy + r * Math.sin(a * Math.PI / 180)].map(v => v.toFixed(1));
      const [x1, y1] = p(a1), [x2, y2] = p(a2); return `M${x1} ${y1} A${r} ${r} 0 0 1 ${x2} ${y2}`; },
    rer(cx, cy, radii, a1, a2){
      let o = '';
      radii.forEach(r => { o += `<path d="${this.arcPath(cx, cy, r, a1, a2)}" fill="none" stroke="#8d6e63" stroke-width="2.6"/>`;
        for (let a = a1 + 4; a < a2; a += 9) { const x = cx + (r + 3.5) * Math.cos(a * Math.PI / 180), y = cy + (r + 3.5) * Math.sin(a * Math.PI / 180);
          o += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.9" fill="#3e2723"/>`; } });
      return o;
    },
    ser(x, y){ let o = '';
      [0, 11].forEach(dy => o += `<path d="M${x} ${y + dy} q 9 -9 18 0 t 18 0 t 18 0 t 18 0" fill="none" stroke="#a1887f" stroke-width="3"/>`);
      return o + `<rect x="${x - 2}" y="${y - 8}" width="76" height="26" fill="transparent"/>`; },
    dots(arr){ return arr.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.4" fill="#3e2723"/>`).join('') + arr.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="transparent"/>`).join(''); },
    chloro(cx, cy, rot, em){
      if (!em) return this.ell(cx, cy, 29, 13, rot, '#66bb6a', '#1b5e20', 1.6) +
        `<g transform="rotate(${rot} ${cx} ${cy})">${[-15, -5, 5, 15].map((dx, i) => `<circle cx="${cx + dx}" cy="${cy + (i % 2 ? 3 : -3)}" r="2.6" fill="#1b5e20"/>`).join('')}</g>`;
      let o = `<g transform="translate(${cx} ${cy}) rotate(${rot})"><ellipse rx="31" ry="14" fill="#a5d6a7" stroke="#1b5e20" stroke-width="2"/><ellipse rx="27.5" ry="10.5" fill="none" stroke="#1b5e20" stroke-width="0.9"/>`;
      o += `<line x1="-22" y1="0" x2="22" y2="0" stroke="#2e7d32" stroke-width="1"/>`;
      [-15, 0, 15].forEach(dx => { for (let j = -2; j <= 2; j++) o += `<line x1="${dx - 4}" y1="${j * 2.6}" x2="${dx + 4}" y2="${j * 2.6}" stroke="#1b5e20" stroke-width="1.6"/>`; });
      return o + `</g>`;
    },

    // ---- رسم الخليَّة ----
    drawAnimal(em){
      const cx = 350, cy = 215, rx = 150, ry = 145, ex = y => cx + rx * Math.sqrt(Math.max(0, 1 - ((y - cy) / ry) ** 2));
      let o = `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fff8e1" pointer-events="none"/>`;
      if (em) {
        o += this.g('mt', [[300, 95], [470, 112], [485, 190], [275, 150], [430, 60]].map(([x, y]) => `<line x1="398" y1="134" x2="${x}" y2="${y}" stroke="#78909c" stroke-width="1.4"/>`).join(''));
        let mv = ''; for (let y = 176; y <= 256; y += 13) { const x0 = ex(y) - 3; mv += `<path d="M${x0.toFixed(1)} ${y - 4} h 20 a 4 4 0 0 1 0 8 h -20" fill="#fff8e1" stroke="${TEAL}" stroke-width="2.4"/>`; }
        o += this.g('mv', mv);
        let ci = ''; [-128, -117, -106].forEach(a => { const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180);
          const x = cx + rx * c, y = cy + ry * s, x2 = x + 40 * c, y2 = y + 40 * s;
          ci += `<path d="M${x.toFixed(1)} ${y.toFixed(1)} Q ${(x + 20 * c + 7).toFixed(1)} ${(y + 20 * s - 4).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}" fill="none" stroke="#6a1b9a" stroke-width="3.6" stroke-linecap="round"/>`; });
        o += this.g('cilia', ci);
      }
      o += this.g('mem', `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${TEAL}" stroke-width="3"/><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="transparent" stroke-width="12"/>`);
      if (em) {
        o += this.g('rer', this.rer(320, 220, [66, 76], 140, 225));
        o += this.g('ser', this.ser(284, 326));
        o += this.g('ribo', this.dots([[470, 240], [480, 280], [262, 122], [292, 110], [380, 326], [418, 270], [232, 262], [360, 118], [430, 335]]));
        o += this.g('lyso', `<circle cx="398" cy="302" r="10" fill="#8d6e63" stroke="#4e342e" stroke-width="1.5"/><circle cx="371" cy="100" r="8" fill="#8d6e63" stroke="#4e342e" stroke-width="1.5"/>`);
      }
      o += this.nucleus(320, 220, 55, em);
      o += this.g('mito', this.mito(462, 147, 25, em) + this.mito(258, 308, -25, em) + this.mito(452, 290, 15, em));
      if (em) o += this.g('cris', `<ellipse cx="462" cy="147" rx="20" ry="7" transform="rotate(25 462 147)" fill="transparent"/>`);
      o += this.g('golgi', this.golgi(448, 216, em));
      o += this.g('cent', em ? `<rect x="386" y="130" width="16" height="7" rx="2" fill="#ffe082" stroke="#f57f17" stroke-width="1.3"/><rect x="403" y="122" width="7" height="16" rx="2" fill="#ffe082" stroke="#f57f17" stroke-width="1.3"/><circle cx="398" cy="134" r="12" fill="transparent"/>`
                                : `<circle cx="398" cy="134" r="4.5" fill="#4e342e"/><circle cx="398" cy="134" r="12" fill="transparent"/>`);
      return o;
    },
    drawPlant(em){
      let o = `<rect x="178" y="48" width="344" height="334" fill="#f1f8e9" pointer-events="none"/>`;
      o += this.g('wall', `<rect x="170" y="40" width="360" height="350" rx="14" fill="none" stroke="#a1887f" stroke-width="10"/><rect x="170" y="40" width="360" height="350" rx="14" fill="none" stroke="transparent" stroke-width="16"/>`);
      if (em) o += this.g('plasmo', [[165, 285, 'h'], [165, 300, 'h'], [525, 300, 'h'], [250, 35, 'v'], [265, 385, 'v']].map(([x, y, d]) => d === 'h'
          ? `<line x1="${x}" y1="${y}" x2="${x + 12}" y2="${y}" stroke="#3e2723" stroke-width="1.6"/><line x1="${x}" y1="${y + 3}" x2="${x + 12}" y2="${y + 3}" stroke="#3e2723" stroke-width="1.6"/><rect x="${x - 3}" y="${y - 5}" width="18" height="13" fill="transparent"/>`
          : `<line x1="${x}" y1="${y}" x2="${x}" y2="${y + 12}" stroke="#3e2723" stroke-width="1.6"/><line x1="${x + 3}" y1="${y}" x2="${x + 3}" y2="${y + 12}" stroke="#3e2723" stroke-width="1.6"/><rect x="${x - 5}" y="${y - 3}" width="13" height="18" fill="transparent"/>`).join(''));
      o += this.g('mem', `<rect x="180" y="50" width="340" height="330" rx="9" fill="none" stroke="${TEAL}" stroke-width="2.2"/><rect x="180" y="50" width="340" height="330" rx="9" fill="none" stroke="transparent" stroke-width="9"/>`);
      o += this.g('vac', `<rect x="300" y="105" width="190" height="220" rx="26" fill="#e3f2fd"/>`);
      o += this.g('tono', `<rect x="300" y="105" width="190" height="220" rx="26" fill="none" stroke="#1565c0" stroke-width="3"/><rect x="300" y="105" width="190" height="220" rx="26" fill="none" stroke="transparent" stroke-width="10"/>`);
      if (em) {
        o += this.g('mt', `<line x1="188" y1="205" x2="193" y2="300" stroke="#78909c" stroke-width="1.5"/><line x1="262" y1="60" x2="292" y2="98" stroke="#78909c" stroke-width="1.5"/><rect x="183" y="205" width="14" height="95" fill="transparent"/>`);
        o += this.g('ser', this.ser(196, 80));
        o += this.g('rer', this.rer(240, 160, [48, 56], 15, 85));
        o += this.g('ribo', this.dots([[200, 135], [292, 120], [286, 296], [390, 345], [470, 92], [512, 172], [236, 368], [205, 330]]));
      }
      o += this.nucleus(240, 160, 40, em);
      o += this.g('chl', [[345, 77, 0], [425, 77, 0], [355, 352, 0], [445, 352, 0], [505, 215, 90]].map(([x, y, r]) => this.chloro(x, y, r, em)).join(''));
      if (em) o += this.g('thy', `<ellipse cx="425" cy="77" rx="24" ry="9" fill="transparent"/>`);
      o += this.g('mito', this.mito(215, 268, 70, em) + this.mito(288, 352, 0, em) + this.mito(506, 128, 90, em));
      if (em) o += this.g('cris', `<ellipse cx="506" cy="128" rx="7" ry="20" fill="transparent"/>`);
      o += this.g('golgi', this.golgi(258, 246, em));
      return o;
    },
    labels(cell, mode){
      const s = this.s, vis = LBL[cell].filter(([k]) => this.visible(k, cell, mode));
      const colL = cell === 'a' ? 188 : 158, colR = cell === 'a' ? 534 : 546;
      let o = '';
      ['L', 'R'].forEach(side => {
        const arr = vis.filter(x => x[1] === side).sort((a, b) => a[3] - b[3]), n = arr.length;
        arr.forEach(([k, , ax, ay], i) => {
          const y = n === 1 ? ay : Math.round(48 + i * (340 / (n - 1)));
          const lines = ST[k].lb.split('|'), on = s.sel === k, col = ST[k].lm ? DARK : RED;
          const tx = side === 'L' ? colL : colR, lx = side === 'L' ? colL + 4 : colR - 4;
          const y0 = y - (lines.length - 1) * 9;
          let t = `<line x1="${lx}" y1="${y}" x2="${ax}" y2="${ay}" stroke="${on ? RED : '#78909c'}" stroke-width="${on ? 2 : 1.2}"/><circle cx="${ax}" cy="${ay}" r="2.6" fill="${on ? RED : '#455a64'}"/>`;
          if (on) { const wmax = Math.max(...lines.map(x => x.length)) * 6.6 + 12;
            t += `<rect x="${side === 'L' ? tx - wmax + 4 : tx - 6}" y="${y0 - 17}" width="${wmax}" height="${lines.length * 19 + 6}" rx="4" fill="#fff59d"/>`; }
          lines.forEach((ln, j) => t += T(tx, y0 + j * 19 + 5, ln, { a: side === 'L' ? 'end' : 'start', c: col, b: on ? 1 : (ST[k].lm ? 0 : 0) }));
          o += this.g(k, t);
        });
      });
      return o;
    },
    svgCell(cell){
      const s = this.s, em = s.mode === 'em';
      let o = svgOpen(420);
      o += `<defs><filter id="g11c_blur"><feGaussianBlur stdDeviation="0.7"/></filter></defs>`;
      o += `<g${em ? '' : ' filter="url(#g11c_blur)"'}>${cell === 'a' ? this.drawAnimal(em) : this.drawPlant(em)}</g>`;
      if (s.lab) o += this.labels(cell, s.mode);
      o += T(350, 412, em ? 'مجهر إلكتروني' : 'مجهر ضوئي', { b:1, c: em ? RED : TEAL, fs:17 });
      return o + '</svg>';
    },
    defHtml(cell){
      const s = this.s, k = s.sel, t = ST[k];
      if (!t) return `<div style="${S.panel}">انقر على أيِّ تركيب أو اسمه لعرض تعريفه.</div>`;
      const badge = t.lm ? `<span style="background:${LIGHT};color:${DARK};border:1.5px solid ${TEAL};border-radius:12px;padding:0 10px;">يُرى بالمجهر الضوئي — الهدف ${L('1-5')}</span>`
                         : `<span style="background:#ffebee;color:${RED};border:1.5px solid ${RED};border-radius:12px;padding:0 10px;">يظهر بالمجهر الإلكتروني — الهدف ${L('1-6')}</span>`;
      let h = `<div style="${S.panel}"><div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;"><b style="font-size:19px;color:${t.lm ? DARK : RED};">${t.n}</b> ${L(t.en)} ${badge}</div>`;
      t.d.forEach(d => h += `<div style="margin-top:4px;">${q(d.t)} ${src(d.p)} <span style="color:#90a4ae;">— ${d.m === 'هامش' ? 'مصطلحات علميّة' : 'من المتن'}</span></div>`);
      const v = (s.mode === 'em' && t.ve) ? t.ve : t.v;
      if (v) h += `<div style="margin-top:4px;color:#37474f;"><b>عن رؤيته:</b> ${q(v.t)} ${src(v.p)}</div>`;
      return h + '</div>';
    },
    legend(){
      return `<div style="${S.ctrl}justify-content:space-between;">` +
        `<span><b style="color:${DARK};">■ أسماء خضراء داكنة:</b> تراكيب الهدف ${L('1-5')} (تُرى بالمجهر الضوئي)</span>` +
        `<span><b style="color:${RED};">■ أسماء حمراء:</b> تُضاف بالمجهر الإلكتروني (الهدف ${L('1-6')})</span></div>`;
    },
    refresh(){ const cell = this.s.cell; $('g11c_svg').innerHTML = this.svgCell(cell); $('g11c_def').innerHTML = this.defHtml(cell);
      ['lm', 'em'].forEach(m => { const b = $('g11c_' + m); if (b) b.setAttribute('style', btn(this.s.mode === m, 'font-size:17px;')); });
      const lb = $('g11c_lab'); if (lb) lb.textContent = this.s.lab ? 'إخفاء الأسماء' : 'إظهار الأسماء';
      const c = $('g11c_cnt'); if (c) c.textContent = AR(this.visibleList(cell, this.s.mode).length); },
    setMode(m){ const s = this.s; s.mode = m; if (!this.visible(s.sel, s.cell, m)) s.sel = 'mito'; this.refresh(); },
    toggleLab(){ this.s.lab = !this.s.lab; this.refresh(); },
    pick(k){ this.s.sel = k; this.refresh(); },

    // ---- اختبر نفسك ----
    quizPool(){ return Object.keys(ST).filter(k => !ST[k].noQuiz); },
    newQuiz(){
      const rest = this.quizPool().filter(k => k !== 'mito');
      for (let i = rest.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [rest[i], rest[j]] = [rest[j], rest[i]]; }
      this.s.qz = { order: ['mito'].concat(rest.slice(0, 9)), i: 0, score: 0, ans: null };
    },
    check(k, saysLM){ return ST[k].lm === saysLM; },
    quizSvg(){
      const z = this.s.qz, N = z.order.length, done = z.i >= N;
      let o = svgOpen(230);
      o += `<rect x="40" y="16" width="620" height="14" rx="7" fill="#eceff1"/><rect x="40" y="16" width="${(620 * Math.min(z.i + (z.ans ? 1 : 0), N) / N).toFixed(1)}" height="14" rx="7" fill="${TEAL}"/>`;
      if (done) {
        o += `<rect x="120" y="50" width="460" height="150" rx="16" fill="${LIGHT}" stroke="${TEAL}" stroke-width="3"/>`;
        o += T(350, 105, 'انتهى الاختبار', { b:1, fs:26, c: DARK }) + T(350, 160, `النتيجة: ${AR(z.score)} من ${AR(N)}`, { b:1, fs:30, c: z.score >= 8 ? GREEN : RED });
      } else {
        const k = z.order[z.i];
        o += T(660, 58, `السؤال ${AR(z.i + 1)} من ${AR(N)}`, { a:'end', c:'#546e7a' }) + T(40, 58, `الدرجة: ${AR(z.score)}`, { a:'start', b:1, c: TEAL });
        o += `<rect x="110" y="72" width="480" height="120" rx="16" fill="${z.ans ? (z.ans.ok ? '#e8f5e9' : '#ffebee') : LIGHT}" stroke="${z.ans ? (z.ans.ok ? GREEN : RED) : TEAL}" stroke-width="3"/>`;
        o += T(350, 112, 'أين يمكن رؤية هذا التركيب؟', { c:'#546e7a' }) + T(350, 162, ST[k].n, { b:1, fs: ST[k].n.length > 26 ? 24 : 30, c: DARK });
        o += T(350, 220, ST[k].c === 'a' ? 'في الخليّة الحيوانيّة' : ST[k].c === 'p' ? 'في الخليّة النباتيّة' : 'في الخليّة الحيوانيّة والنباتيّة', { c:'#78909c' });
      }
      return o + '</svg>';
    },
    quizFb(){
      const z = this.s.qz;
      if (z.i >= z.order.length) return `<div style="${S.panel}">${z.score >= 8 ? ok('أحسنت!') : warn('راجع المرحلتين ١ و٢ ثمَّ أعد المحاولة.')}</div>`;
      if (!z.ans) return `<div style="${S.panel}color:#546e7a;">اختر إجابتك من الزرَّين أدناه.</div>`;
      const k = z.order[z.i], t = ST[k];
      let h = `<div style="${S.panel}">` + (z.ans.ok ? ok('إجابة صحيحة.') : warn('إجابة غير صحيحة.'));
      h += `<div><b>${t.n}</b> ${t.lm ? 'من تراكيب الهدف ' + L('1-5') + ': ' + q('… والتي يمكن رؤيتها بالمجهر الضوئي') : 'من تراكيب الهدف ' + L('1-6') + ': ' + q('… والتي يمكن رؤيتها تحت المجهر الإلكتروني')}.</div>`;
      if (t.v) h += `<div>${q(t.v.t)} ${src(t.v.p)}</div>`;
      if (t.q1) h += `<div style="color:#37474f;"><b>سؤال نهاية الوحدة (س١):</b> ${q(Q1)} ${src(54)} — الإجابة: أ. الميتوكندريون.</div>`;
      h += `<div style="color:#37474f;">${q(t.d[0].t)} ${src(t.d[0].p)}</div>`;
      return h + '</div>';
    },
    quizCtrl(){
      const z = this.s.qz, done = z.i >= z.order.length;
      if (done) return `<div style="${S.ctrl}justify-content:center;"><button style="${btn(true, 'font-size:17px;')}" onclick="G11SIM_microscopes.qRestart()">أعد الاختبار</button></div>`;
      if (z.ans) return `<div style="${S.ctrl}justify-content:center;"><button style="${btn(true, 'font-size:17px;')}" onclick="G11SIM_microscopes.qNext()">التالي ←</button></div>`;
      return `<div style="${S.ctrl}justify-content:center;"><button style="${btn(false, 'font-size:17px;')}" onclick="G11SIM_microscopes.qAns(true)">🔬 يُرى بالمجهر الضوئي</button>` +
        `<button style="${btn(false, 'font-size:17px;border-color:' + RED + ';color:' + RED + ';')}" onclick="G11SIM_microscopes.qAns(false)">⚡ لا يُرى إلّا بالمجهر الإلكتروني</button></div>`;
    },
    qView(){ return `<div id="g11c_qsvg">${this.quizSvg()}</div><div id="g11c_qfb">${this.quizFb()}</div><div id="g11c_qctl">${this.quizCtrl()}</div>`; },
    qRefresh(){ $('g11c_q').innerHTML = this.qView(); },
    qAns(saysLM){ const z = this.s.qz; if (z.ans || z.i >= z.order.length) return; const good = this.check(z.order[z.i], saysLM); z.ans = { ok: good }; if (good) z.score++; this.qRefresh(); },
    qNext(){ const z = this.s.qz; z.i++; z.ans = null; this.qRefresh(); },
    qRestart(){ this.newQuiz(); this.qRefresh(); },

    build(i){
      this.reset();
      const s = this.s;
      if (i === 2) { this.newQuiz(); return `<div style="${S.wrap}"><div id="g11c_q">${this.qView()}</div></div>`; }
      s.cell = i === 0 ? 'a' : 'p';
      return `<div style="${S.wrap}"><div id="g11c_svg">${this.svgCell(s.cell)}</div>` +
        `<div style="${S.ctrl}justify-content:center;"><button id="g11c_lm" style="${btn(true, 'font-size:17px;')}" onclick="G11SIM_microscopes.setMode('lm')">🔬 مجهر ضوئي</button>` +
        `<button id="g11c_em" style="${btn(false, 'font-size:17px;')}" onclick="G11SIM_microscopes.setMode('em')">⚡ مجهر إلكتروني</button>` +
        `<button id="g11c_lab" style="${btn(false)}" onclick="G11SIM_microscopes.toggleLab()">إخفاء الأسماء</button>` +
        `<span>التراكيب الظاهرة: <b id="g11c_cnt">${AR(this.visibleList(s.cell, s.mode).length)}</b></span></div>` +
        this.legend() + `<div id="g11c_def">${this.defHtml(s.cell)}</div></div>`;
    }
  };

  // =====================================================================
  G.simulations = Object.assign(G.simulations || {}, {
    g11_magnification: {
      sem:'S1', title:'وحدات القياس ومقدار التكبير',
      stages:['تحويل الوحدات', 'مقدار التكبير M = I ÷ A', 'القياس الحقيقي من صورة'],
      info:[
        'نحتاج إلى استخدام وحدات قياس صغيرة جدًا لقياس الأجسام بالمجهر. فبحسب الاتفاق الدولي، يجب استخدام النظام الدولي للوحدات <span dir="ltr">(The International System of Units-SI units)</span>. ويمثل المتر (m) وحدة الطول الأساسيّة. كما تمّ إنشاء وحدات أخرى باعتماد أطوال أطول أو أقصر من المتر بآلاف المرّات. تستخدم البادئات للوحدات، على سبيل المثال البادئة «كيلو» تعني 1000 مرّة. وبالتالي 1 كيلومتر = 1000 متر. ويبيّن الجدول ١-١ وحدات القياس المرتبطة بدراسة الخليّة. (كتاب الطالب ص ٢١)',
        'مقدار التكبير Magnification هو عدد مرّات تكبير صورة الجسم مقارنة بالقياس الحقيقي. … إذا كنت تعرف قيمتَين من القيم M، I، A يمكنك حساب القيمة الثالثة، على سبيل المثال: إذا كان قياس الصورة المشاهد ومقدار التكبير معروفَين، يمكنك حساب القياس الحقيقي للعيّنة باستخدام <span dir="ltr">A = I / M</span> وإذا كتبت الصيغة في مثلّث كما هو مبيّن أدناه، وأخفيت القيمة المراد إيجادها، يجب أن يكون واضحًا كيف تجرى العمليّة الحسابيّة الصحيحة. (كتاب الطالب ص ٢٨)',
        'لحساب القياس الحقيقي أو الفعلي لجسم، يمكن استخدام صيغة التكبير نفسها. — تبين الصورة ١-٨ أجزاء من ثلاث خلايا نباتيّة مكبرة <span dir="ltr">X 5600</span>. افترض أننا نريد معرفة الطول الحقيقي للبلاستيدة الخضراء في صورة المجهر الإلكتروني. (كتاب الطالب ص ٣٠)'
      ],
      build(i){ return M1.build(i); }
    },
    g11_graticule: {
      sem:'S1', title:'معايرة شبكة العدسة العينيّة ومقياس المنضدة',
      stages:['المعايرة', 'قياس الخليّة', 'خطوات القياس'],
      info:[
        'لضبط مقياس شبكة العدسة العينيّة، توضع مسطرة شفافة صغيرة تسمى مقياس المنضدة Stage micrometer على منضدة المجهر، ويتم التركيز عليها. وقد يكون هذا المقياس محفورًا على شريحة زجاجيّة أو مطبوعًا على غشاء شفاف، وعادة ما يتضمن أجزاء فرعيّة من 0.1 و 0.01 مم. بعد ذلك، يمكن وضع صورة مقياس المنضدة ومقياس شبكة العدسة العينيّة الواحدة فوق الأخرى، كما في الشكل ١-٥ج. (كتاب الطالب ص ٢٩)',
        'يمكن قياس حجم الخلايا والعضيات بداخلها بمقياس شبكة العدسة العينيّة Eyepiece graticule. … تقع الخلية المختارة بين الرقمَين 40 و 60 على المقياس، لذا فإنه يقيس قطر 20 وحدة عدسة عينيّة (الفرق بين 60 و 40). ويجب أولًا ضبط مقياس العدسة العينيّة لمعرفة القياس الحقيقي لهذه الوحدات. (كتاب الطالب ص ٢٨–٢٩)',
        'الشكل ١-٥ القياس المجهري. ثلاثة مجالات رؤية تُشاهد باستخدام عدسة شيئيّة بقوّة تكبير عالية <span dir="ltr">(X 40)</span>: (أ) مقياس شبكة العدسة العينيّة يتكون من 100 جزء. (ب) صور متراكبة لخلايا بطانة الخدّ الطلائيّة ومقياس شبكة العدسة العينيّة (ج) صورة متراكبة لمقياس شبكة العدسة العينيّة ومقياس المنضدة. (كتاب الطالب ص ٢٨)'
      ],
      build(i){ return M2.build(i); }
    },
    g11_microscopes: {
      sem:'S1', title:'ماذا ترى بكلِّ مجهر؟',
      stages:['خليّة حيوانيّة', 'خليّة نباتيّة', 'اختبر نفسك'],
      info:[
        'أشهرها نوعان يختلفان اختلافًا جوهريًا: المجهر الضوئي والمجهر الإلكتروني. ويستخدم كلّ منهما شكلًا من أشكال الإشعاع لمشاهدة العيّنة. إذ يستخدم المجهر الضوئي الضوء مصدرًا للإشعاع، بينما يستخدم المجهر الإلكتروني (الماسح أو النافذ) الإلكترونات لذلك. (كتاب الطالب ص ٢١)',
        'أحد التراكيب الشائعة الموجودة في الخلايا الحيوانيّة وغير موجودة في معظم الخلايا النباتيّة هو السنتريول Centriole. كما تختلف الخلايا النباتيّة عن الخلايا الحيوانيّة باحتوائها على جدران خلويّة وفجوات مركزيّة كبيرة دائمة وبلاستيدات خضراء. (كتاب الطالب ص ٢٤)',
        'لا يمكن رؤية الخلايا بوضوح إلّا بالمجهر. يستخدم المجهر الضوئي الضوء مصدرًا للإضاءة، في حين يستخدم المجهر الإلكتروني الإلكترونات. (كتاب الطالب ص ٥٤ — ملخّص)'
      ],
      build(i){ return M3.build(i); }
    }
  });
})();


// =====================================================================
// 4) g11_slide — إعداد شريحة مجهريّة مؤقّتة ورسم الخلايا (الاستقصاء العملي ١-١)
// خطوات التحضير حرفيّاً من كتاب التجارب العمليَّة والأنشطة (المطبوعة ٣٨–٤٢) وكتاب الطالب (مهارات عمليَّة ١-١ ص ٢٦، وص ٢٢)،
// ومعايير تقييم الرسم من دليل المعلِّم (الجدول ١-١ ص ٨١). أسماء الأزرار القصيرة ورسائل الرفض من صياغة المنصَّة (مع اقتباس الكتاب).
// =====================================================================
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
    rng: `width:200px;accent-color:${TEAL};vertical-align:middle;`,
  };
  const btn = (on, extra) => `font-family:${F};font-size:16px;padding:5px 12px;border-radius:8px;border:2px solid ${TEAL};cursor:pointer;` +
    (on ? `background:${TEAL};color:#fff;` : `background:#fff;color:${DARK};`) + (extra || '');
  const L = s => `<span dir="ltr" style="unicode-bidi:isolate;white-space:nowrap;">${s}</span>`;
  const svgOpen = (h, id) => `<svg ${id ? `id="${id}" ` : ''}viewBox="0 0 700 ${h}" width="100%" style="display:block;max-width:700px;margin:0 auto;background:#fff;border-radius:10px;font-family:${F};direction:ltr;" xmlns="http://www.w3.org/2000/svg">`;
  function T(x, y, s, o){
    o = o || {};
    const an = o.a || 'middle', a2 = o.ltr ? an : (an === 'end' ? 'start' : (an === 'start' ? 'end' : an));
    return `<text x="${x}" y="${y}" font-size="${o.fs || 16}" fill="${o.c || '#1a1a1a'}" text-anchor="${a2}"` +
      `${o.b ? ' font-weight="700"' : ''}${o.ltr ? ' direction="ltr"' : ' direction="rtl"'}${o.x || ''}>${s}</text>`;
  }
  const AB = 'كتاب التجارب العمليَّة والأنشطة', TG = 'دليل المعلِّم';
  const src = (p, book) => `<span style="color:#546e7a;">(${book || 'كتاب الطالب'} ص ${AR(p)})</span>`;
  const ok = s => `<div style="color:${GREEN};font-weight:700;">✓ ${s}</div>`;
  const warn = s => `<div style="color:${RED};font-weight:700;">⚠ ${s}</div>`;
  function rng(seed){ let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

  // ---------------- العيِّنات والصبغات ----------------
  const SAMPLES = { onion:'بشرة البصل (نباتيّة)', cheek:'خلايا بطانة الخدّ (حيوانيّة)' };
  const STAINS = { water:'ماء فقط (بلا صبغة)', iodine:'محلول يوديد البوتاسيوم (اليود)', mb:'محلول أزرق الميثيلين المخفّف' };
  const Q_STAIN = `«ويشيع استخدام عدد من الصبغات المؤقّتة، على سبيل المثال: محلول يوديد البوتاسيوم مفيد لعيّنات النبات، فهو يصبغ باللون الأزرق الداكن، ويلوّن النواة والجدار الخلوي باللون الأصفر الفاتح. ويستخدم محلول أزرق الميثيلين المخفّف لصبغ الخلايا الحيوانيّة، مثل خلايا باطن الخد.» ${src(26)}`;
  const Q_CLEAR = `«في الخليّة توجد مكوّنات كثيرة شفّافة وعديمة اللون، لذا يجب صبغها بصبغات ملوّنة ليمكن رؤيتها.» ${src(22)}`;
  // خطوات التحضير (نصّ الكتاب) + المتطلَّبات السابقة + سبب الرفض
  const STEPS = {
    o1: { b:'اقطع قطعة بصل (1 × 1) سم', x:'استخدم المقص أو شفرة حادّة لتحصل على قطعة من الطبقات الداخلية لبصلة بقياس (1 × 1) سم تقريبًا.', p:[39, AB], need:[] },
    o2: { b:'قطرة ماء على الشريحة', x:'استخدم القطّارة لتضع قطرة ماء على مركز شريحة مجهر نظيفة.', p:[39, AB], need:[] },
    o3: { b:'انزع القشرة وضعها على القطرة', x:'استخدم الملقط بلطف لتنزع القشرة الرقيقة عن السطح الداخلي لقطعة البصل، ثم ضعها مباشرة فوق قطرة الماء على الشريحة، معتمدًا على إبرة تثبيت أو مسبار لتمد قشرة البصل بلطف بحيث لا تنثني أو يتسرّب إليها ماء. قد تحتاج إلى إضافة قطرة ماء أخرى.', p:[39, AB], need:['o1', 'o2'],
      why:{ o1:'لا قشرة بعدُ: ابدأ بـ«قطعة من الطبقات الداخلية لبصلة».', o2:'القشرة توضع «مباشرة فوق قطرة الماء على الشريحة» — ضع القطرة أوَّلًا.' } },
    o4: { b:'أنزل غطاء الشريحة', x:'أنزل غطاء الشريحة بلطف فوق الشريحة لتغطية قشرة البصل. يمكن أن يساعدك استخدام إبرة المسبار كما في الشكل ١-٢ على منع حبس أية فقاعة هواء. وإذا تكوّنت فقاعة هواء، فعليك تجاهلها أثناء رسم العيّنة.', p:[39, AB], need:['o3'],
      why:{ o3:'الغطاء يُنزَل «لتغطية قشرة البصل» — ضع القشرة على قطرة الماء أوَّلًا.' } },
    o5: { b:'أزل الماء الزائد بورق الترشيح', x:'استخدم ورق الترشيح بلطف لإزالة أية قطرة ماء قد تتسرّب إلى سطح الشريحة.', p:[40, AB], need:['o4'],
      why:{ o4:'ورق الترشيح يزيل «أية قطرة ماء قد تتسرّب إلى سطح الشريحة» بعد إنزال الغطاء؛ و«إذا تركت الماء على سطح الشريحة، فقد يصل إلى العدسة الشيئيّة».' } },
    o6: { b:'قطرة يود عند حافة الغطاء', x:'ضع قطرة صغيرة من محلول اليود على شريحة مجهر لتلامس حافة غطاء الشريحة.', p:[42, AB], need:['o5'],
      why:{ o5:'قطرة اليود توضع «لتلامس حافة غطاء الشريحة» — أكمل إعداد الشريحة المغطّاة (الجزء ١) أوَّلًا.' } },
    o7: { b:'اسحب اليود بورقة ترشيح من الجهة المقابلة', x:'ضع بحذر شديد طرف قطعة من ورقة الترشيح بتماسّ مع الجانب المقابل من غطاء الشريحة، كما يبدو في الشكل ١-٣. ستمتصّ ورقة الترشيح الماء الموجود تحت غطاء الشريحة ما يؤدّي إلى تمرير محلول اليود إلى العيّنة.', p:[42, AB], need:['o6'],
      why:{ o6:'ورقة الترشيح «ستمتصّ الماء … ما يؤدّي إلى تمرير محلول اليود إلى العيّنة» — ضع قطرة اليود عند الحافة أوَّلًا.' } },
    c1: { b:'اكشط بطانة الخدّ', x:'العينة الحيوانيّة المناسبة: خلايا من بطانة خدّ الإنسان، تؤخذ عبر كشط بطانة الخدّ باستخدام أعواد تنظيف الأذن.', p:[26], need:[] },
    c2: { b:'ضع العيّنة على الشريحة', x:'ضع العيّنة الأحيائية على شريحة زجاجيّة نظيفة،', p:[26], need:['c1'],
      why:{ c1:'لا عيّنة بعدُ: الخلايا «تؤخذ عبر كشط بطانة الخدّ باستخدام أعواد تنظيف الأذن».' } },
    c3: { b:'أضف قطرة من الصبغة', x:'وأضف قطرة أو قطرتَين من الصبغة.', p:[26], need:['c2'],
      why:{ c2:'«ضع العيّنة الأحيائية على شريحة زجاجيّة نظيفة، وأضف قطرة أو قطرتَين من الصبغة» — العيّنة أوَّلًا.' } },
    c4: { b:'قطرة جليسرين (اختياري)', x:'كما يمكن تلافي جفاف العيّنة بإضافة قطرة من الجليسرين، ومزجها مع الصبغة.', p:[26], need:['c3'], opt:true, before:'c5',
      why:{ c3:'الجليسرين يُمزج «مع الصبغة» — أضف الصبغة أوَّلًا.', c5:'الجليسرين يُمزج «مع الصبغة» قبل تغطية العيّنة.' } },
    c5: { b:'غطِّ العيّنة', x:'غَطِّ العيّنة لحماية عدسة المجهر وتفاديًا لجفاف العيّنة.', p:[26], need:['c3'],
      why:{ c3:'غطِّ العيّنة بعد إضافة الصبغة: «وأضف قطرة أو قطرتَين من الصبغة. غَطِّ العيّنة…».' } }
  };
  const RECIPE = { 'onion-water':['o1', 'o2', 'o3', 'o4', 'o5'], 'onion-iodine':['o1', 'o2', 'o3', 'o4', 'o5', 'o6', 'o7'], 'cheek-mb':['c1', 'c2', 'c3', 'c4', 'c5'] };

  // ---------------- معايير الرسم (الجدول ١-١ في دليل المعلِّم ص ٨١) ----------------
  const CRIT = [
    { c:'يغطّي نصف المساحة المتوافرة على الأقل', r:'يجب أن يكون رسمك كبيرًا، يشغل 50 % على الأقل من المساحة المتاحة. تأكّد من ترك مساحة كافية لكتابة المسميات.', p:41 },
    { c:'مرسوم بقلم HB حاد', r:'استخدم قلم جرافيت من النوع (HB حاد).', p:41 },
    { c:'جميع الخطوط واضحة ومنفردة، من دون تداخل أو تقطع', r:'يجب رسم جميع الخطوط منفردة وواضحة، مع عدم ترك أي فراغات فيها مهما كانت صغيرة.', p:41 },
    { c:'تمّ رسم جدران الخلايا بخطَّين', r:'ارسم الجدران الخلويّة دائمًا بخطَّين، لأنّها جدران سميكة.', p:42 },
    { c:'نسب التراكيب المختلفة صحيحة', r:'احرص على الالتزام بدقة أشكال الخلايا وقياساتها.', p:41 },
    { c:'لا يوجد تظليل', r:'لا تستخدم التظليل في رسمك على الإطلاق.', p:42 },
    { c:'خطوط المسمّيات مرسومة بالمسطرة وتلمس نهاية الخط الجزء الذي يراد تسميته', r:'استخدم مسطرة لرسم خطوط المسميات، وتأكّد من أن تلمس نهاية الخط الجزء الذي تقوم بتسميته.', p:42 },
    { c:'المسميات مكتوبة بوضوح ولا تتداخل مع الرسم', r:'حافظ على خطوط المسميات منفصلة بعضها عن بعض. يمكن أن تكون خطوط المسميات بأيّ اتجاه، لكن يجب أن تكتب المسميات بشكل أفقي.', p:42 }
  ];
  // true = المعيار متحقِّق في الرسم
  const TRUTH = { a:[false, true, true, false, true, false, false, true], b:[true, false, false, true, false, true, true, false] };
  // مواضع أخطاء كلِّ رسم (لعلامات التصحيح)
  const SPOTS = { a:{ 0:[350, 268], 3:[300, 196], 5:[392, 205], 6:[258, 146] }, b:{ 1:[100, 70], 2:[330, 66], 4:[230, 200], 7:[600, 236] } };

  const M = window.G11SIM_slide = {
    s: null,
    reset(){ this.s = { sample:'', stain:'', seq:[], msg:'', view:'', obj:0, coarse:15, fine:0, fmsg:'', dr:'a', ans:{ a:new Array(8).fill(null), b:new Array(8).fill(null) }, chk:{ a:false, b:false } }; },
    // ---------- منطق (يُختبر آليّاً) ----------
    validPair(sample, stain){
      if (sample === 'onion' && stain === 'mb') return { ok:false, why:`أزرق الميثيلين المخفّف لصبغ الخلايا الحيوانيّة، أمّا عيّنات النبات فيفيدها محلول يوديد البوتاسيوم. ${Q_STAIN}` };
      if (sample === 'cheek' && stain === 'iodine') return { ok:false, why:`محلول يوديد البوتاسيوم مفيد لعيّنات النبات، أمّا خلايا باطن الخدّ فتُصبغ بأزرق الميثيلين المخفّف. ${Q_STAIN}` };
      if (sample === 'cheek' && stain === 'water') return { ok:false, why:`خلايا بطانة الخدّ تحتاج إلى صبغة: ${Q_CLEAR}` };
      return { ok:true };
    },
    recipe(){ const s = this.s; return RECIPE[s.sample + '-' + s.stain] || null; },
    tryStep(id){
      const s = this.s, st = STEPS[id];
      if (s.seq.indexOf(id) >= 0) return '';
      const miss = st.need.find(n => s.seq.indexOf(n) < 0);
      if (miss) return st.why[miss];
      if (st.before && s.seq.indexOf(st.before) >= 0) return st.why[st.before];
      s.seq.push(id); return '';
    },
    complete(){ const r = this.recipe(); return !!r && r.every(id => STEPS[id].opt || this.s.seq.indexOf(id) >= 0); },
    blur(){ const s = this.s, target = s.obj ? 64 : 60, f = s.coarse + s.fine * 0.25; return Math.min(9, Math.abs(f - target) * 0.5); },
    score(dr){ const a = this.s.ans[dr]; return a.reduce((n, v, i) => n + (v === TRUTH[dr][i] ? 1 : 0), 0); },

    // ================= المرحلة 0: حضِّر الشريحة =================
    slideSvg(){
      const s = this.s, has = id => s.seq.indexOf(id) >= 0;
      let o = svgOpen(270, 'g11s_svg') + `<rect x="100" y="80" width="500" height="120" rx="4" fill="#e3f2fd" stroke="#90a4ae" stroke-width="2"/>` + T(350, 225, 'شريحة مجهريّة', { c:'#78909c' });
      const cover = `<rect x="285" y="75" width="130" height="130" fill="#ffffff" opacity="0.5" stroke="#607d8b" stroke-width="2"/>`;
      if (s.sample === 'onion') {
        if (has('o1')) o += `<rect x="20" y="20" width="62" height="62" rx="8" fill="#f3e5f5" stroke="#ab47bc" stroke-width="2"/>` + T(51, 102, 'قطعة بصل', { fs:16 });
        if (has('o2')) o += `<ellipse cx="350" cy="140" rx="${has('o3') ? 52 : 34}" ry="${has('o3') ? 40 : 24}" fill="#bbdefb" opacity="0.8"/>`;
        if (has('o3')) o += `<path d="M318,118 L376,112 L388,150 L362,170 L318,164 L308,140 z" fill="#f8f4e3" opacity="0.85" stroke="#bdb38c" stroke-width="1.5"/>` + T(540, 40, 'قشرة البصل في قطرة ماء', { fs:16, c:'#6d4c41' });
        if (has('o4')) o += cover + T(350, 65, 'غطاء الشريحة', { fs:16, c:'#455a64' });
        if (has('o4') && !has('o5')) o += `<ellipse cx="440" cy="150" rx="14" ry="8" fill="#90caf9"/><ellipse cx="265" cy="120" rx="10" ry="6" fill="#90caf9"/>` + T(520, 120, 'ماء تسرّب', { fs:16, c:'#1565c0' });
        if (has('o6')) o += `<ellipse cx="${has('o7') ? 282 : 272}" cy="140" rx="${has('o7') ? 6 : 14}" ry="${has('o7') ? 5 : 10}" fill="#a1661b"/>` + T(220, 60, 'محلول اليود', { fs:16, c:'#8d5a14' });
        if (has('o7')) o += `<rect x="286" y="76" width="128" height="128" fill="#d9a441" opacity="0.35"/><rect x="412" y="105" width="60" height="70" fill="#fffde7" stroke="#bdbdbd" stroke-width="2"/>` + T(445, 195, 'ورقة ترشيح', { fs:16, c:'#757575' }) +
          `<line x1="300" y1="140" x2="400" y2="140" stroke="#8d5a14" stroke-width="2" marker-end="url(#g11s_ar)"/>`;
      } else if (s.sample === 'cheek') {
        if (has('c1')) o += `<line x1="30" y1="40" x2="90" y2="70" stroke="#90a4ae" stroke-width="4"/><ellipse cx="92" cy="71" rx="10" ry="7" fill="#fafafa" stroke="#bdbdbd"/>` + T(70, 102, 'عود تنظيف الأذن', { fs:16 });
        if (has('c2')) o += `<ellipse cx="350" cy="140" rx="40" ry="20" fill="#f5f5f5" stroke="#cfd8dc" stroke-dasharray="3 2"/>`;
        if (has('c3')) o += `<ellipse cx="350" cy="140" rx="46" ry="26" fill="#5c8fd6" opacity="0.55"/>` + T(540, 40, 'قطرة أزرق الميثيلين', { fs:16, c:'#1f4e9c' });
        if (has('c4')) o += `<ellipse cx="350" cy="140" rx="52" ry="30" fill="none" stroke="#9fa8da" stroke-width="2" stroke-dasharray="4 3"/>` + T(230, 60, 'جليسرين', { fs:16, c:'#5c6bc0' });
        if (has('c5')) o += cover + T(350, 65, 'غطاء الشريحة', { fs:16, c:'#455a64' });
      } else o += T(350, 145, 'اختر العيّنة والصبغة', { fs:18, c:'#90a4ae' });
      if (this.complete()) o += T(350, 258, '✓ الشريحة المؤقّتة جاهزة — انتقل إلى «تحت المجهر»', { fs:17, b:1, c:GREEN });
      o += `<defs><marker id="g11s_ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#8d5a14"/></marker></defs>`;
      return o + '</svg>';
    },
    prepView(){
      const s = this.s, pair = s.sample && s.stain ? this.validPair(s.sample, s.stain) : null, r = pair && pair.ok ? this.recipe() : null;
      let h = `<div style="${S.ctrl}"><b>١. العيّنة:</b>` + Object.keys(SAMPLES).map(k => `<button style="${btn(s.sample === k)}" onclick="G11SIM_slide.pick('sample','${k}')">${SAMPLES[k]}</button>`).join('') + '</div>';
      h += `<div style="${S.ctrl}"><b>٢. الصبغة:</b>` + Object.keys(STAINS).map(k => `<button style="${btn(s.stain === k)}" onclick="G11SIM_slide.pick('stain','${k}')">${STAINS[k]}</button>`).join('') + '</div>';
      h += `<div id="g11s_draw" style="margin-top:6px;">${this.slideSvg()}</div>`;
      if (pair && !pair.ok) return h + `<div style="${S.panel}">${warn('لا يناسب هذا الاختيار:')}<div>${pair.why}</div></div>`;
      if (!r) return h + `<div style="${S.panel}">اختر العيّنة ثمّ الصبغة؛ وتظهر بعدها خطوات التحضير لترتّبها. العيّنات النباتيّة المناسبة في الكتاب: «خلايا بشرة البصل، خلايا بشرة الخسّ، خلايا طحلب الكلوريلا، أوراق نبات حزازي» ${src(26)}</div>`;
      if (s.sample === 'onion' && s.stain === 'water') h += `<div style="${S.panel}">${ok('مناسب للجزء ١ من الاستقصاء ١-١ (قشرة البصل في قطرة ماء)؛ وفي الجزء ٣ تُضاف صبغة اليود.')}</div>`;
      // أزرار الخطوات بترتيب مخلوط ثابت
      const rr = rng(r.length * 7 + (s.sample === 'onion' ? 3 : 5)), order = r.slice();
      for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(rr() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
      h += `<div style="${S.ctrl}"><b>٣. رتّب خطوات التحضير (انقر بالترتيب):</b>` + order.map(id => {
        const d = s.seq.indexOf(id) >= 0;
        return `<button style="${btn(false, d ? `opacity:0.45;border-color:${GREEN};color:${GREEN};` : '')}" ${d ? 'disabled' : ''} onclick="G11SIM_slide.step('${id}')">${d ? '✓ ' : ''}${STEPS[id].b}</button>`;
      }).join('') + `<button style="${btn(false, 'border-color:#78909c;color:#455a64;')}" onclick="G11SIM_slide.restart()">↺ من جديد</button></div>`;
      h += `<div style="${S.panel}">` + (s.msg ? warn(s.msg) : '') + (s.seq.length ? s.seq.map((id, i) => `<div><b style="color:${TEAL};">${AR(i + 1)}.</b> «${STEPS[id].x}» ${src(STEPS[id].p[0], STEPS[id].p[1])}</div>`).join('') : '<span style="color:#78909c;">لم تنفّذ أيّ خطوة بعد.</span>');
      if (s.sample === 'cheek') h += `<div style="color:#455a64;">«تذكّر الالتزام بالمعايير الصحية عند التعامل مع العينات البيولوجية، وبخاصة العينات الحيوانية.» ${src(26)}</div>`;
      else h += `<div style="color:#455a64;">«توخَّ الحذر عند استخدام شفرة حادّة لنزع قشرة البصلة الرقيقة.» ${src(38, AB)}</div>`;
      return h + '</div>';
    },
    refreshPrep(){ const e = $('g11s_prep'); if (e) e.innerHTML = this.prepView(); },
    pick(k, v){ const s = this.s; s[k] = v; s.seq = []; s.msg = ''; this.refreshPrep(); },
    step(id){ this.s.msg = this.tryStep(id); this.refreshPrep(); },
    restart(){ this.s.seq = []; this.s.msg = ''; this.refreshPrep(); },

    // ================= المرحلة 1: تحت المجهر =================
    preset(){
      const s = this.s;
      if (s.view) return s.view;
      if (this.complete()) return s.sample === 'cheek' ? 'cheek-mb' : (s.seq.indexOf('o7') >= 0 ? 'onion-iodine' : 'onion-water');
      return 'onion-iodine';
    },
    poly(cx, cy, r, n, rr){ let d = ''; for (let i = 0; i < n; i++) { const a = i / n * 6.283 + rr() * 0.4, k = r * (0.8 + rr() * 0.35); d += (i ? 'L' : 'M') + (cx + Math.cos(a) * k).toFixed(1) + ',' + (cy + Math.sin(a) * k).toFixed(1); } return d + 'z'; },
    fieldContent(v, hi){
      const rr = rng(hi ? 91 : 17), on = v.indexOf('onion') === 0, iod = v === 'onion-iodine', mb = v === 'cheek-mb';
      let o = '';
      if (on) {
        const wall = iod ? '#d9b443' : '#b9b9a6', nuc = iod ? '#ecd06a' : '#e2e2d6', nucS = iod ? '#c9a227' : '#c4c4b4', bg = iod ? '#fbf5df' : '#f8f8f3';
        o += `<rect x="30" y="0" width="420" height="400" fill="${bg}"/>`;
        const ch = hi ? 92 : 28, cw = hi ? 270 : 82;
        for (let row = -1; row * ch < 420; row++) for (let c = -1; c * cw < 480; c++) {
          const x = 30 + c * cw + (row % 2 ? cw / 2 : 0) + (rr() - 0.5) * (hi ? 10 : 4), y = row * ch + 10, w = cw - 2, h = ch - 2;
          o += `<rect x="${x.toFixed(1)}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${wall}" stroke-width="${hi ? 2 : 1.3}"/><rect x="${(x + (hi ? 4 : 2)).toFixed(1)}" y="${y + (hi ? 4 : 2)}" width="${w - (hi ? 8 : 4)}" height="${h - (hi ? 8 : 4)}" fill="none" stroke="${wall}" stroke-width="${hi ? 1.5 : 1}"/>`;
          const nx = x + w * (0.2 + rr() * 0.6), ny = y + h * (0.35 + rr() * 0.3);
          o += `<ellipse cx="${nx.toFixed(1)}" cy="${ny.toFixed(1)}" rx="${hi ? 17 : 5}" ry="${hi ? 13 : 4}" fill="${nuc}" stroke="${nucS}" stroke-width="${hi ? 1.5 : 0.8}"/>`;
          if (hi) o += `<circle cx="${(nx + 4).toFixed(1)}" cy="${(ny - 2).toFixed(1)}" r="4" fill="${nucS}" opacity="0.7"/>` + Array.from({ length: 10 }, () => `<circle cx="${(x + 10 + rr() * (w - 20)).toFixed(1)}" cy="${(y + 10 + rr() * (h - 20)).toFixed(1)}" r="1.4" fill="${wall}" opacity="0.6"/>`).join('');
          if (iod && rr() < 0.25) for (let k = 0; k < (hi ? 4 : 2); k++) o += `<circle cx="${(x + 8 + rr() * (w - 16)).toFixed(1)}" cy="${(y + 6 + rr() * (h - 12)).toFixed(1)}" r="${hi ? 3 : 1.6}" fill="#1a237e"/>`;
        }
      } else {
        const fill = mb ? '#d4e3f6' : '#f6f6f6', st = mb ? '#7fa7d6' : '#e9e9e9', nuc = mb ? '#1f4e9c' : '#ececec', bg = mb ? '#f4f8fc' : '#fbfbfb';
        o += `<rect x="30" y="0" width="420" height="400" fill="${bg}"/>`;
        const cells = hi ? [[170, 150, 92], [330, 210, 88], [210, 320, 80], [380, 70, 70]] : Array.from({ length: 34 }, (_, i) => [50 + (i % 6) * 66 + rr() * 30, 30 + Math.floor(i / 6) * 64 + rr() * 30, 17 + rr() * 6]);
        cells.forEach(c => {
          o += `<path d="${this.poly(c[0], c[1], c[2], 9, rr)}" fill="${fill}" stroke="${st}" stroke-width="${hi ? 2 : 1}" opacity="0.92"/>`;
          o += `<circle cx="${(c[0] + (rr() - 0.5) * c[2] * 0.3).toFixed(1)}" cy="${(c[1] + (rr() - 0.5) * c[2] * 0.3).toFixed(1)}" r="${(c[2] * 0.14).toFixed(1)}" fill="${nuc}"/>`;
          if (hi && mb) for (let k = 0; k < 12; k++) { const a = rr() * 6.28, d = rr() * c[2] * 0.7; o += `<circle cx="${(c[0] + Math.cos(a) * d).toFixed(1)}" cy="${(c[1] + Math.sin(a) * d).toFixed(1)}" r="1.5" fill="#7fa7d6"/>`; }
        });
      }
      return o;
    },
    LABELS: {
      'onion-water': [['#c4c4b4', 'الجدار الخلوي'], ['#e2e2d6', 'النواة'], ['#f8f8f3', 'السيتوبلازم']],
      'onion-iodine': [['#d9b443', 'الجدار الخلوي: أصفر فاتح'], ['#ecd06a', 'النواة: أصفر فاتح'], ['#1a237e', 'حُبيبات النشا: أزرق داكن'], ['#fbf5df', 'السيتوبلازم']],
      'cheek-mb': [['#7fa7d6', 'غشاء سطح الخليّة'], ['#d4e3f6', 'السيتوبلازم'], ['#1f4e9c', 'النواة (الكروماتين مصبوغ بشدة)']],
      'cheek-none': [['#ececec', 'خلايا شفّافة بالكاد تُرى']]
    },
    scopeSvg(){
      const s = this.s, v = this.preset(), b = this.blur();
      let o = svgOpen(400, 'g11s_scope') + `<defs><clipPath id="g11s_clip"><circle cx="240" cy="200" r="180"/></clipPath><filter id="g11s_bf" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur id="g11s_gb" stdDeviation="${b.toFixed(2)}"/></filter></defs>`;
      o += `<rect x="44" y="4" width="392" height="392" rx="20" fill="#1c2529"/><g clip-path="url(#g11s_clip)"><g filter="url(#g11s_bf)">${this.fieldContent(v, s.obj)}</g></g><circle cx="240" cy="200" r="180" fill="none" stroke="#000" stroke-width="4"/>`;
      const head = { 'onion-water':'بشرة البصل — ماء', 'onion-iodine':'بشرة البصل — يود', 'cheek-mb':'بطانة الخدّ — أزرق الميثيلين', 'cheek-none':'بطانة الخدّ — بلا صبغة' }[v];
      o += T(690, 34, head, { a:'end', fs:18, b:1, c:DARK }) + T(690, 62, s.obj ? 'العدسة الشيئيّة الكبرى' : 'العدسة الشيئيّة الصغرى', { a:'end', fs:17, c:TEAL });
      o += `<g id="g11s_lab" opacity="${b < 1.5 ? 1 : 0.15}">` + T(690, 104, 'ما يظهر:', { a:'end', fs:17, b:1 });
      this.LABELS[v].forEach((l, i) => { const y = 136 + i * 34; o += `<rect x="668" y="${y - 16}" width="22" height="22" rx="4" fill="${l[0]}" stroke="#78909c"/>` + T(660, y, l[1], { a:'end', fs:16 }); });
      o += '</g>' + `<text id="g11s_fs" x="690" y="380" font-size="17" text-anchor="start" direction="rtl" font-weight="700" fill="${b < 0.6 ? GREEN : RED}">${b < 0.6 ? '✓ الصورة واضحة' : (b < 1.5 ? 'اضبط بالضابط الصغير' : 'الصورة غير واضحة')}</text>`;
      return o + '</svg>';
    },
    quoteFor(v){
      const s = this.s;
      let q = {
        'onion-water': `${Q_CLEAR} — «يجب أن تكون قادرًا على رؤية ما يماثل محتوى الصورة ١-١.» ${src(40, AB)}`,
        'onion-iodine': `«سيصبغ (يلوّن) اليود أي حُبيبات نشا في خلايا البصل باللون الأزرق الداكن.» ${src(42, AB)} ${Q_STAIN} «أحيانًا يمكن أن تحتوي خلايا البصل على حبيبات نشا، فتصطبغ عندها باللون الأزرق الداكن عند إضافة اليود؛ أمّا إذا لم تكن حبيبات النشا موجودة، فلا تصطبغ.» ${src(83, TG)}`,
        'cheek-mb': `«ويستخدم محلول أزرق الميثيلين المخفّف لصبغ الخلايا الحيوانيّة، مثل خلايا باطن الخد.» ${src(26)} «خلايا الإنسان في الصورة ١-٣ مصبوغة، والكروماتين في النواة مصبوغ بشدة.» ${src(22)}`,
        'cheek-none': Q_CLEAR
      }[v];
      if (s.obj) q += ` — «والصورة المجهرية الضوئية ١-٣ تبيّن خلايا من بطانة خد الإنسان، والصورة ١-٤ خلايا من ورقة نبات حزازي. وكلاهما مكبّرتان 400 مرة، وهو ما يعادل استخدام العدسة الشيئيّة الكبرى في المجهر الضوئي.» ${src(22)}`;
      return q;
    },
    scopeCtrl(){
      const s = this.s, v = this.preset();
      const P = [['onion-water', 'بشرة البصل — ماء'], ['onion-iodine', 'بشرة البصل — يود'], ['cheek-mb', 'بطانة الخدّ — أزرق الميثيلين'], ['cheek-none', 'بطانة الخدّ — بلا صبغة']];
      return `<div style="${S.ctrl}"><b>الشريحة:</b>${P.map(p => `<button style="${btn(v === p[0])}" onclick="G11SIM_slide.setView('${p[0]}')">${p[1]}</button>`).join('')}</div>` +
        `<div style="${S.ctrl}"><label><b>العدسة الشيئيّة:</b> الصغرى <input type="range" min="0" max="1" step="1" value="${s.obj}" style="width:70px;accent-color:${TEAL};vertical-align:middle;" oninput="G11SIM_slide.setObj(this.value)"> الكبرى</label>` +
        `<label><b>الضابط الكبير</b> <input id="g11s_c" type="range" min="0" max="100" value="${s.coarse}" style="${S.rng}" oninput="G11SIM_slide.setFocus('coarse',this.value)"></label>` +
        `<label><b>الضابط الصغير</b> <input id="g11s_f" type="range" min="-20" max="20" value="${s.fine}" style="${S.rng}" oninput="G11SIM_slide.setFocus('fine',this.value)"></label></div>` +
        `<div id="g11s_fmsg" style="${S.panel}">${this.focusMsg()}</div><div id="g11s_q" style="${S.panel}">${this.quoteFor(v)}</div>`;
    },
    focusMsg(){
      const s = this.s, b = this.blur();
      let h = s.fmsg ? warn(s.fmsg) : '';
      if (!s.obj) h += `«حرّك الضابط الكبير ببطء … توقّف عندما تشاهد القشرة. من المحتمل ألاّ تبدو واضحة. حرّك الضابط الصغير لضبط الصورة إلى أن تتمكّن من رؤية قشرة البصل بوضوح.» ${src(40, AB)}`;
      else h += `«أدِر العدسات الشيئيّة بلطف إلى أن تصل العدسة الأكبر من الصغرى مباشرة فوق الشريحة. استخدم الضابط الصغير في التركيز على الشريحة.» ${src(41, AB)}`;
      if (b < 0.6) h += ok('الصورة واضحة الآن: «ارسم ما تراه، وليس ما تعتقد أنه يجب رؤيته.» ' + src(42, AB));
      return h;
    },
    scopeView(){ return `<div id="g11s_svgw">${this.scopeSvg()}</div><div id="g11s_sc">${this.scopeCtrl()}</div>`; },
    refreshScope(full){ const a = $('g11s_svgw'); if (a) a.innerHTML = this.scopeSvg(); if (full) { const c = $('g11s_sc'); if (c) c.innerHTML = this.scopeCtrl(); } else { const m = $('g11s_fmsg'); if (m) m.innerHTML = this.focusMsg(); } },
    setView(v){ this.s.view = v; this.s.fmsg = ''; this.refreshScope(true); },
    setObj(v){
      const s = this.s, n = parseInt(v, 10) ? 1 : 0;
      s.fmsg = n && this.blur() > 1.5 ? '«ركّز على قشرة البصل باستخدام العدسة الصغرى (ذات قوة التكبير الأصغر)، كما ورد سابقًا» قبل الانتقال إلى العدسة الأكبر.' : '';
      s.obj = n; this.refreshScope(true);
    },
    setFocus(k, v){
      const s = this.s; s[k] = parseInt(v, 10) || 0;
      if (k === 'coarse' && s.obj) s.fmsg = '«مهم: قد يؤدّي تحريك العدسة الشيئيّة نحو الأسفل كثيرًا في بعض المجاهر إلى اصطدامها بالشريحة وكسرها. ويمكن تفادي ذلك عن طريق النظر إلى العدسة الشيئية من الجانب.» ' + src(41, AB) + ' — استخدم الضابط الصغير مع العدسة الكبرى.';
      else if (k === 'coarse' && s.coarse > 90) s.fmsg = 'العدسة الشيئيّة تكاد تلامس الشريحة — «انظر في العدسة العينيّة مرّة أخرى، وحرّك الضابط الكبير ببطء في الاتجاه الآخر».';
      else if (k === 'coarse') s.fmsg = '';
      const b = this.blur(), g = $('g11s_gb'); if (g) g.setAttribute('stdDeviation', b.toFixed(2));
      const lab = $('g11s_lab'); if (lab) lab.setAttribute('opacity', b < 1.5 ? 1 : 0.15);
      const fs = $('g11s_fs'); if (fs) { fs.textContent = b < 0.6 ? '✓ الصورة واضحة' : (b < 1.5 ? 'اضبط بالضابط الصغير' : 'الصورة غير واضحة'); fs.setAttribute('fill', b < 0.6 ? GREEN : RED); }
      const m = $('g11s_fmsg'); if (m) m.innerHTML = this.focusMsg();
    },

    // ================= المرحلة 2: قيِّم الرسم =================
    drawingSvg(dr){
      const s = this.s, chk = s.chk[dr];
      let o = svgOpen(400, 'g11s_dsvg') + `<rect x="8" y="8" width="684" height="384" fill="#fffef8" stroke="#90a4ae" stroke-width="2" stroke-dasharray="8 5"/>` + T(684, 28, `رسم الطالب (${dr === 'a' ? 'أ' : 'ب'}) — المساحة المتاحة للرسم`, { a:'end', fs:16, c:'#78909c' });
      o += `<defs><pattern id="g11s_hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="#555" stroke-width="1.6"/></pattern></defs>`;
      if (dr === 'a') {
        // صغير، تظليل، جدران بخطٍّ واحد، خطوط مسمَّيات باليد
        [[290, 180], [330, 180], [370, 180], [310, 210], [350, 210], [390, 210]].forEach((c, i) => {
          o += `<rect x="${c[0]}" y="${c[1]}" width="40" height="30" fill="url(#g11s_hatch)" opacity="0.55"/><rect x="${c[0]}" y="${c[1]}" width="40" height="30" fill="none" stroke="#333" stroke-width="1.3"/>`;
          o += `<ellipse cx="${c[0] + 14 + (i % 2) * 10}" cy="${c[1] + 15}" rx="5" ry="4" fill="#fff" stroke="#333" stroke-width="1.2"/>`;
        });
        o += `<path d="M205,160 q20,-14 35,4 t30,6 t22,14" fill="none" stroke="#333" stroke-width="1.3"/>` + T(200, 165, 'الجدار الخلوي', { a:'end', fs:17 });
        o += `<path d="M505,150 q-30,10 -50,0 t-40,22 t-17,9" fill="none" stroke="#333" stroke-width="1.3"/>` + T(512, 155, 'النواة', { a:'start', fs:17 });
        o += `<path d="M505,280 q-25,-6 -45,-12 t-38,-22" fill="none" stroke="#333" stroke-width="1.3"/>` + T(512, 285, 'السيتوبلازم', { a:'start', fs:17 });
      } else {
        // كبير، جدران بخطَّين، لا تظليل، مسطرة — لكن قلم غير حاد، خطوط متقطِّعة ومتداخلة، نواة كبيرة جدّاً، مسمَّيات مائلة فوق الرسم
        const cells = [[60, 50, 260, 140], [320, 50, 260, 140], [190, 190, 260, 140], [60, 190, 130, 140], [450, 190, 130, 140]];
        cells.forEach((c, i) => {
          o += `<rect x="${c[0]}" y="${c[1]}" width="${c[2]}" height="${c[3]}" fill="none" stroke="#666" stroke-width="3.6" stroke-dasharray="70 9 40 7" opacity="0.85"/>`;
          o += `<rect x="${c[0] + 2.5}" y="${c[1] - 2}" width="${c[2]}" height="${c[3]}" fill="none" stroke="#777" stroke-width="2.4" opacity="0.6" stroke-dasharray="50 12"/>`;
          o += `<rect x="${c[0] + 9}" y="${c[1] + 9}" width="${c[2] - 18}" height="${c[3] - 18}" fill="none" stroke="#666" stroke-width="3.2" opacity="0.8"/>`;
          if (c[2] > 200) o += `<ellipse cx="${c[0] + c[2] * 0.45}" cy="${c[1] + c[3] / 2}" rx="${c[3] * 0.42}" ry="${c[3] * 0.33}" fill="none" stroke="#666" stroke-width="3.2"/>`;
        });
        o += `<line x1="600" y1="80" x2="575" y2="80" stroke="#333" stroke-width="1.3"/>` + T(608, 86, 'الجدار الخلوي', { a:'start', fs:17 });
        o += `<line x1="600" y1="150" x2="440" y2="120" stroke="#333" stroke-width="1.3"/>`;
        o += `<text x="540" y="245" font-size="17" text-anchor="middle" direction="rtl" transform="rotate(-32 540 245)" fill="#333">النواة</text>`;
        o += `<line x1="610" y1="300" x2="560" y2="290" stroke="#333" stroke-width="1.3"/>` + `<text x="600" y="330" font-size="17" text-anchor="middle" direction="rtl" transform="rotate(-28 600 330)" fill="#333">السيتوبلازم</text>`;
      }
      if (chk) Object.keys(SPOTS[dr]).forEach(k => { const p = SPOTS[dr][k]; o += `<circle cx="${p[0]}" cy="${p[1]}" r="15" fill="${RED}" opacity="0.9"/>` + T(p[0], p[1] + 6, AR(+k + 1), { fs:17, b:1, c:'#fff' }); });
      return o + '</svg>';
    },
    critTable(dr){
      const s = this.s, a = s.ans[dr], chk = s.chk[dr], td = 'border:1px solid #b2dfdb;padding:4px 6px;vertical-align:top;';
      let h = `<table style="border-collapse:collapse;width:100%;font-size:16px;"><tr><th style="${td}background:#80cbc4;width:42%;">ميزات الرسم ${src(81, TG)}</th><th style="${td}background:#80cbc4;">ما مدى جودة الرسم</th></tr>`;
      CRIT.forEach((c, i) => {
        const v = a[i], t = TRUTH[dr][i], good = v === t;
        h += `<tr><td style="${td}"><b>${AR(i + 1)}.</b> ${c.c}</td><td style="${td}white-space:nowrap;">` +
          `<button style="${btn(v === true, 'padding:2px 8px;')}" onclick="G11SIM_slide.ans(${i},true)">✓ متحقّق</button> <button style="${btn(v === false, 'padding:2px 8px;' + (v === false ? `background:${RED};border-color:${RED};` : `border-color:${RED};color:${RED};`))}" onclick="G11SIM_slide.ans(${i},false)">✗ غير متحقّق</button></td>`;
        h += '</tr>';
        if (chk) h += `<tr><td colspan="2" style="${td}background:${good ? '#f1f8e9' : '#fdecea'};"><b style="color:${good ? GREEN : RED};">${v === null ? 'لم تُقيّم' : (good ? '✓ تقييم صحيح' : '✗ راجع تقييمك')}:</b> ${t ? 'المعيار متحقّق في هذا الرسم.' : 'لم يتحقّق — العلامة ' + AR(i + 1) + ' على الرسم.'} «${c.r}» ${src(c.p, AB)}</td></tr>`;
      });
      return h + '</table>';
    },
    evalView(){
      const s = this.s, dr = s.dr, chk = s.chk[dr];
      let h = `<div style="${S.ctrl}justify-content:center;"><button style="${btn(dr === 'a')}" onclick="G11SIM_slide.setDr('a')">رسم الطالب (أ)</button><button style="${btn(dr === 'b')}" onclick="G11SIM_slide.setDr('b')">رسم الطالب (ب)</button></div>`;
      h += `<div style="margin-top:6px;">${this.drawingSvg(dr)}</div><div style="${S.panel}">قيّم رسم قشرة البصل بقائمة المعايير: «بهدف تقييم رسوم الطلبة في الجزء 2، يمكنك إعداد قائمة معايير تقييمية تزودهم بها؛ ثم الطلب إليهم تبادل رسومهم بعضهم مع بعض وتقييمها في ضوء قائمة المعايير» ${src(80, TG)}</div>`;
      h += `<div style="${S.panel}overflow-x:auto;">${this.critTable(dr)}</div>`;
      const n = s.ans[dr].filter(x => x !== null).length;
      h += `<div style="${S.ctrl}"><button style="${btn(true, 'font-size:17px;')}" onclick="G11SIM_slide.check()">تحقّق من تقييمي</button><button style="${btn(false)}" onclick="G11SIM_slide.clearEval()">امسح</button><span>أجبت عن ${AR(n)} من ٨</span>` +
        (chk ? `<b style="color:${this.score(dr) === 8 ? GREEN : RED};">تقييمك صحيح في ${AR(this.score(dr))} من ٨ معايير</b>` : '') + '</div>';
      if (chk) h += `<div style="${S.panel}">«يميل الكثير من الطلبة إلى تقديم «عمل متقن»، ما يجعلهم ينفذون رسمًا تخطيطيًا مثاليًا لبشرة قشرة البصل، بدلًا من رسم ما يرونه فعلًا.» ${src(82, TG)}</div>`;
      return h;
    },
    refreshEval(){ const e = $('g11s_eval'); if (e) e.innerHTML = this.evalView(); },
    setDr(d){ this.s.dr = d; this.refreshEval(); },
    ans(i, v){ const s = this.s; s.ans[s.dr][i] = v; this.refreshEval(); },
    check(){ this.s.chk[this.s.dr] = true; this.refreshEval(); },
    clearEval(){ const s = this.s; s.ans[s.dr] = new Array(8).fill(null); s.chk[s.dr] = false; this.refreshEval(); },

    build(i){
      if (!this.s) this.reset();
      if (i === 1) return `<div style="${S.wrap}">${this.scopeView()}</div>`;
      if (i === 2) return `<div style="${S.wrap}"><div id="g11s_eval">${this.evalView()}</div></div>`;
      return `<div style="${S.wrap}"><div id="g11s_prep">${this.prepView()}</div></div>`;
    }
  };

  G.simulations = Object.assign(G.simulations || {}, {
    g11_slide: {
      sem:'S1', title:'إعداد شريحة مجهريّة مؤقّتة ورسم الخلايا',
      stages:['حضِّر الشريحة', 'تحت المجهر', 'قيِّم الرسم'],
      info:[
        'إن إعداد الشرائح المؤقّتة أسهل وأسرع من إعداد الشرائح الدائمة، وغالبًا ما تستخدم لفحص العيّنة الحيّة الطازجة التي تحتوي على خلايا حيّة، وفي كلا الحالتَين تصبغ الشرائح والعيّنات قبل وضعها على الشريحة الزجاجيّة. تذكّر الالتزام بالمعايير الصحية عند التعامل مع العينات البيولوجية، وبخاصة العينات الحيوانية. (كتاب الطالب ص ٢٦)',
        'ويشيع استخدام عدد من الصبغات المؤقّتة، على سبيل المثال: محلول يوديد البوتاسيوم مفيد لعيّنات النبات، فهو يصبغ باللون الأزرق الداكن، ويلوّن النواة والجدار الخلوي باللون الأصفر الفاتح. ويستخدم محلول أزرق الميثيلين المخفّف لصبغ الخلايا الحيوانيّة، مثل خلايا باطن الخد. (كتاب الطالب ص ٢٦)',
        'ستساعدك مشاهدة العينات بالمجهر الضوئي على فهم التراكيب وتذكّرها. يمكنك تعزيز فهمك عبر استخدام القلم الرصاص لتظهير الرسوم على ورق عادي. تذكّر دائمًا أن ترسم ما تراه، وليس ما تعتقد أنك يجب أن تراه. (كتاب الطالب ص ٢٦)'
      ],
      build(i){ return M.build(i); }
    }
  });
})();
