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
