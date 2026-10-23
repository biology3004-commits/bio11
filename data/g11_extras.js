// إضافات منصَّة الحادي عشر (تُحمَّل بعد المحرِّك) — فارغة حاليّاً

// عدَّاد الأسئلة في شارة المولِّد (أسئلة الكتاب داخل الدروس + بنك MCQ المنسَّق)
(function () {
  try {
    const D = window.G11_DATA || {}; let n = 0;
    ((D.curriculumDataS1 || {}).units || []).forEach(u => u.lessons.forEach(l => { n += (l.questions || []).length; }));
    Object.values(D.extendedQuestions || {}).forEach(a => { n += a.length; });
    const b = document.getElementById('g11QCountBadge'); if (b) b.textContent = String(n);
  } catch (e) {}
})();

// عدَّاد بطاقات الديوراما في مقدِّمة التبويب
(function () { try { const b = document.getElementById('g11DioCount'); const D = (window.G11_DATA || {}).DIORAMAS || []; if (b) b.textContent = String(D.length); } catch (e) {} })();

// ── زرُّ «تنزيل التطبيق» ظاهر دائماً (g11Install) ──
// Chrome على Android لا يُطلق beforeinstallprompt في أوَّل زيارة غالباً، ومتصفِّحات واتساب/تويتر الداخليَّة لا تثبِّت التطبيقات أصلاً؛
// لذا يظهر الزرُّ لكلِّ زائر غير مثبِّت، وعند غياب نافذة التثبيت الأصليَّة تُعرض تعليمات تناسب جهازه.
(function g11Install() {
  try {
    const ua = navigator.userAgent || '';
    const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
    if (standalone) return;
    const ios = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const android = /Android/i.test(ua);
    const inApp = /FBAN|FBAV|Instagram|WhatsApp|Line\/|Twitter|Snapchat|TikTok|; wv\)/i.test(ua);
    const btn = document.getElementById('btnAppInstall');
    if (btn) btn.style.display = 'inline-flex';
    const card = document.querySelector('#iosInstallModal .ios-card');
    if (card) {
      const close = '<button class="ios-close" onclick="document.getElementById(\'iosInstallModal\').classList.remove(\'visible\')">حسناً، فهمت</button>';
      const warn = '<div style="background:#fff3e0;border-right:4px solid #e65100;border-radius:10px;padding:10px 12px;margin:0 0 12px;line-height:1.8;"><strong>فتحت الرابط من داخل واتساب أو تويتر؟</strong> هذه النوافذ لا تثبِّت التطبيقات. افتح الرابط أوَّلاً في ' + (ios ? '<strong>Safari</strong> (زرُّ البوصلة أو «فتح في Safari»)' : '<strong>Chrome</strong> (القائمة ⋮ ← «فتح في Chrome» أو «فتح في المتصفِّح»)') + '، ثمَّ اتبع الخطوات.</div>';
      let title, steps;
      if (ios) {
        title = '📲 تثبيت المنصَّة على iPhone / iPad';
        steps = ['افتح المنصَّة في متصفِّح <strong>Safari</strong>.', 'اضغط زرَّ المشاركة <span class="ios-icon">⬆️</span> في أسفل الشاشة.', 'مرِّر واختر <span class="ios-icon">إضافة إلى الشاشة الرئيسيَّة</span> (Add to Home Screen) ثمَّ <strong>إضافة</strong>.', 'افتحها من الأيقونة «أحياء ١١» — تعمل كتطبيق كامل الشاشة ودون إنترنت.'];
      } else if (android) {
        title = '📲 تثبيت المنصَّة على هاتف Android';
        steps = ['افتح المنصَّة في متصفِّح <strong>Chrome</strong>.', 'اضغط القائمة <span class="ios-icon">⋮</span> أعلى الشاشة.', 'اختر <span class="ios-icon">تثبيت التطبيق</span> أو <span class="ios-icon">إضافة إلى الشاشة الرئيسيَّة</span> ثمَّ <strong>تثبيت</strong>.', 'افتحها من الأيقونة «أحياء ١١» — تعمل كتطبيق ودون إنترنت.'];
      } else {
        title = '💻 تثبيت المنصَّة على الحاسوب';
        steps = ['افتح المنصَّة في <strong>Chrome</strong> أو <strong>Edge</strong>.', 'اضغط أيقونة التثبيت <span class="ios-icon">⊕</span> في نهاية شريط العنوان، أو القائمة ⋮ ← «حفظ ومشاركة» ← «تثبيت الصفحة كتطبيق».', 'تفتح المنصَّة في نافذة مستقلَّة وتعمل دون إنترنت.'];
      }
      card.innerHTML = '<h3>' + title + '</h3>' + ((inApp || ios || android) ? warn : '') + '<ol>' + steps.map(s => '<li>' + s + '</li>').join('') + '</ol>' + close;
    }
    // Android: بانر التثبيت يظهر أيضاً حين لا يُطلق Chrome الحدث (يفتح التعليمات بدل النافذة الأصليَّة)
    if (android && typeof showInstallBanner === 'function') setTimeout(() => { try { showInstallBanner(); } catch (e) {} }, 2500);
  } catch (e) {}
})();
