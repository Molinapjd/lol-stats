(function () {
  'use strict';
  const data = window.LOL_CHAMPION_IMAGES;
  const grid = document.getElementById('champion-gallery');
  const count = document.getElementById('gallery-count');
  if (!data) { count.textContent = 'No se ha podido cargar la colección. Recarga la página.'; return; }
  const escape = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const normalize = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '').toLowerCase();
  const search = document.getElementById('champion-search');
  const params = new URLSearchParams(location.search);
  search.value = params.get('q') || '';
  let mode = params.get('vista') === 'retratos' ? 'portrait' : 'face';
  function render() {
    const query = normalize(search.value);
    const selected = Object.entries(data.champions).filter(([name, c]) => normalize(name).includes(query) || normalize(c.id).includes(query));
    count.textContent = `${selected.length} de ${data.count} campeones · ${mode === 'face' ? 'miniaturas faciales' : 'retratos completos'}`;
    grid.className = mode;
    grid.innerHTML = selected.length ? selected.map(([name, c]) => `<article><a href="${c[mode]}" target="_blank" rel="noopener" aria-label="Abrir ${mode === 'face' ? 'miniatura' : 'retrato'} de ${escape(name)}"><img src="${c[mode]}" alt="${escape(name)}, estilo South Park" width="${mode === 'face' ? 192 : 768}" height="${mode === 'face' ? 192 : 1152}" loading="lazy" onerror="this.onerror=null;this.src='assets/champions/unknown.svg'"></a><div><h2>${escape(name)}</h2><a href="${c.face}" download="${c.id}-face.svg">Cara</a><a href="${c.portrait}" download="${c.id}-portrait.svg">Retrato</a></div></article>`).join('') : '<p class="empty">No hay campeones con ese nombre.</p>';
    document.querySelectorAll('[data-mode]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === mode)));
    const url = new URL(location.href);
    url.search = new URLSearchParams({ ...(mode === 'portrait' ? { vista: 'retratos' } : {}), ...(search.value ? { q: search.value } : {}) }).toString();
    history.replaceState(null, '', url);
  }
  search.addEventListener('input', render);
  document.querySelectorAll('[data-mode]').forEach(b => b.addEventListener('click', () => { mode = b.dataset.mode; render(); }));
  render();
})();
