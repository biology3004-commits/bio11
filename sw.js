/* منصَّة الأحياء ١١ — Service Worker (نسخة المحرِّك من منصَّة الثاني عشر)
 * ارفع CACHE_VERSION عند كلِّ تعديل على index.html أو data/*.js */
const CACHE_VERSION = 'bio11-v13';
const APP_SHELL = [
  './', './index.html', './data/g11_data.js', './data/g11_questions.js', './data/g11_unit2.js', './data/g11_unit3.js', './data/g11_unit4.js', './data/g11_mcq.js', './data/g11_exams.js', './data/g11_exams_q.js', './data/g11_visuals.js', './data/g11_sims_u1.js', './data/g11_sims_u2.js', './data/g11_sims_u3.js', './data/g11_sims_u4.js', './data/g11_diagrams.js', './data/g11_content.js', './data/g11_labs.js', './data/g11_games.js', './data/g11_assistant.js', './data/g11_extras.js', './diorama/cell_tour.js', './diorama/thumbs/cell_tour.jpg', './diorama/stem_cells.js', './diorama/thumbs/stem_cells.jpg', './diorama/enzyme_factors.js', './diorama/thumbs/enzyme_factors.jpg', './diorama/virus.js', './diorama/thumbs/virus.jpg', './diorama/enzyme_inhibitors.js', './diorama/thumbs/enzyme_inhibitors.jpg', './diorama/chromosome_cycle.js', './diorama/thumbs/chromosome_cycle.jpg', './diorama/cancer.js', './diorama/thumbs/cancer.jpg', './diorama/enzyme_action.js', './diorama/thumbs/enzyme_action.jpg', './diorama/immobilised_enzymes.js', './diorama/thumbs/immobilised_enzymes.jpg', './diorama/mitosis.js', './diorama/thumbs/mitosis.jpg', './diorama/polysaccharides.js', './diorama/thumbs/polysaccharides.jpg', './diorama/bacterium.js', './diorama/thumbs/bacterium.jpg', './diorama/lipids.js', './diorama/thumbs/lipids.jpg', './diorama/hb_collagen.js', './diorama/thumbs/hb_collagen.jpg', './diorama/protein_levels.js', './diorama/thumbs/protein_levels.jpg', './diorama/water.js', './diorama/thumbs/water.jpg', './diorama/secretion.js', './diorama/thumbs/secretion.jpg', './diorama/glycosidic.js', './diorama/thumbs/glycosidic.jpg', './diorama/view.html', './diorama/diorama_core.js', './diorama/diorama.css', './diorama/three.min.js', './diorama/Tajawal-Bold.ttf', './diorama/Tajawal-Medium.ttf',
  './manifest.json', './icon-192.png', './icon-512.png', './icon-512-maskable.png', './icon-192.svg', './icon-512.svg', './icon-512-maskable.svg', './school-logo.png'
];
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) =>
      // Use { cache: 'reload' } so install never reuses a stale browser cache.
      Promise.all(
        APP_SHELL.map((url) =>
          cache.add(new Request(url, { cache: 'reload' })).catch((err) => console.warn('[sw] precache failed:', url, err))
        )
      )
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k.startsWith('bio11-') && k !== CACHE_VERSION).map((k) => caches.delete(k)) // لا تحذف كاش منصَّة الثاني عشر على نطاق github.io المشترك
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Navigation requests: try network first (to get updates) then fall back to
  // the cached app shell so the app still opens offline.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match('./index.html').then((m) => m || caches.match('./')))
    );
    return;
  }

  // Static assets: cache-first, update cache in background on hit.
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req).then((res) => {
        if (res && res.status === 200 && (url.origin === location.origin || req.destination === 'font' || req.destination === 'style')) {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
