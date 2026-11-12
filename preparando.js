(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', () => {
    const api = window.LOL_STATS, E = window.LOL_DRAFT_ENGINE, C = window.LOL_DRAFT_CATALOG;
    const app = document.getElementById('app');
    if (!api || !E || !C) { app.textContent = 'No se ha podido cargar la preparación. Recarga la página.'; return; }
    const catalog = C.champions;
    const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const image = name => 'https://ddragon.leagueoflegends.com/cdn/' + C.version + '/img/champion/' + catalog[name].id + '.png';
    const icon = (name, cls = '') => `<img class="draft-icon ${cls}" src="${image(name)}" alt="" loading="lazy">`;
    const labels = { Top: 'Superior', Jungla: 'Jungla', Mid: 'Medio', ADC: 'ADC', Support: 'Support' };
    const roleIds = { Top: 'top', Jungla: 'jungla', Mid: 'mid', ADC: 'adc', Support: 'support' };
    const tierLabels = { S: 'Tus apuestas más sólidas', A: 'Experiencia que puedes aprovechar', B: 'Opciones para practicar' };
    const players = window.LOL_PAGES.map(pg => {
      const ds = pg.ids.map(id => (window.LOL_DATA || {})[id]).filter(Boolean);
      if (!ds.length) return null;
      const games = api.prepare(ds).valid;
      const art = api.portraits[pg.page];
      return { id: pg.page.replace(/\.html$/, ''), name: pg.name || ds[0].name, page: pg.page, ds, games, art };
    }).filter(Boolean);
    if (!players.length) { app.textContent = 'No hay invocadores con datos guardados.'; return; }
    let player, role, enemy;
    function readState() {
      const q = new URLSearchParams(location.search);
      player = players.find(p => p.id === q.get('invocador')) || players[0];
      const preferred = E.ROLES.slice().sort((a, b) => player.games.filter(g => g.role === b).length - player.games.filter(g => g.role === a).length)[0];
      role = E.ROLES.find(r => roleIds[r] === q.get('rol')) || preferred;
      enemy = E.resolveChampion(q.get('rival') || '', catalog);
    }
    function saveState() {
      const url = new URL(location.href);
      url.search = new URLSearchParams({ invocador: player.id, rol: roleIds[role], ...(enemy ? { rival: enemy } : {}) }).toString();
      history.replaceState(null, '', url);
    }
    function record(s) { return s.n ? `${s.w}V · ${s.n - s.w}D · ${Math.round(s.w / s.n * 100)}%` : 'Sin partidas en este rol'; }
    function championMeta(c) {
      return c.personal.n ? `${c.personal.n} en el rol · ${record(c.personal)}` : c.overall.n ? `${c.overall.n} en otros roles · por probar aquí` : 'Por aprender · sin partidas guardadas';
    }
    function render() {
      document.title = `${player.name} · Preparando la pelada de lomo`;
      document.body.style.setProperty('--draft-accent', player.art.color);
      app.innerHTML = `
        <a class="back draft-back" href="index.html">← Volver a los invocadores</a>
        <header class="draft-hero">
          <div><p class="draft-eyebrow">LOL STATS / SALA DE PREPARACIÓN</p><h1>Preparando la<br><span>pelada de lomo.</span></h1><p class="draft-intro">Primero el plan. Después, la Grieta.<br>Elige tu campeón con tu historial y el rival en mente.</p></div>
          <div class="draft-seal"><span class="draft-live"></span> DRAFT LAB <small>Hecho para los de siempre</small></div>
        </header>
        <section class="draft-player-section" aria-labelledby="players-title">
          <h2 id="players-title" class="step-title"><span>01</span> Elige a tu invocador</h2>
          <nav class="draft-players" aria-label="Invocadores">${players.map(p => `<button type="button" data-player="${p.id}" aria-pressed="${p === player}">${icon(p.art.champion)}<span>${esc(p.name)}<small>${esc(p.art.nickname)}</small></span><span class="player-selected" aria-hidden="true">↗</span></button>`).join('')}</nav>
        </section>
        <section class="draft-person"><div><p class="draft-eyebrow">EL PLAN DE ${esc(player.name).toUpperCase()}</p><h2>${esc(player.art.nickname)}</h2><p>${player.games.length} partidas guardadas · ${player.ds.length} ${player.ds.length === 1 ? 'cuenta' : 'cuentas'} · <a href="${player.page}">Ver estadísticas ↗</a></p></div><div class="draft-person-note">Tu experiencia cuenta.<br><b>El rival decide el siguiente paso.</b></div></section>
        <div class="draft-role-heading"><h2 class="step-title"><span>02</span> ¿Dónde vas a jugar?</h2><span>Cambia la posición para ver su tier list</span></div>
        <nav class="draft-roles" aria-label="Tu posición">${E.ROLES.map((r, i) => { const n = player.games.filter(g => g.role === r).length; return `<button type="button" data-role="${r}" aria-pressed="${r === role}"><span class="role-mark" aria-hidden="true">0${i + 1}</span>${labels[r]}<small>${n} ${n === 1 ? 'partida' : 'partidas'}</small></button>`; }).join('')}</nav>
        <div class="draft-workspace">
          <section class="draft-panel tier-panel" aria-labelledby="tier-title"><div class="draft-panel-heading"><div><p class="draft-eyebrow">TU REPERTORIO</p><h2 id="tier-title">Tier list · ${labels[role]}</h2></div><span class="draft-pill">PERSONAL</span></div><p class="panel-description">8 opciones ordenadas para ${esc(player.name)}. La experiencia en esta posición pesa más que una victoria aislada.</p><div id="tier-list"></div><p class="tier-footnote">S: al menos 5 partidas en el rol y resultados sólidos. A: experiencia previa. B: práctica recomendada. Las letras describen tu preparación, no el meta global.</p></section>
          <section class="draft-panel matchup-panel" aria-labelledby="matchup-title"><div class="draft-panel-heading"><div><p class="draft-eyebrow">LEE AL RIVAL</p><h2 id="matchup-title">Encuentra tu pick</h2></div><span class="draft-pill accent">03 / DRAFT</span></div><p class="panel-description" id="enemy-help">${role === 'Support' ? 'Introduce el support enemigo. El ADC y el resto de la composición también importan.' : role === 'Jungla' ? 'Introduce el jungla enemigo. Se compara el estilo de ambos junglas, no un duelo de línea.' : 'Introduce el campeón enemigo de tu posición.'}</p>
          <form id="matchup-form"><label for="enemy">Campeón enemigo · ${labels[role]}</label><div class="enemy-input-wrap"><span aria-hidden="true">⌕</span><input id="enemy" name="enemy" list="champion-options" autocomplete="off" placeholder="Busca: Yasuo, Lux, Jinx…" value="${esc(enemy || '')}" aria-describedby="enemy-help enemy-error" required><button type="button" id="clear-enemy" aria-label="Limpiar campeón enemigo">×</button></div><datalist id="champion-options">${Object.keys(catalog).sort((a, b) => a.localeCompare(b)).map(n => `<option value="${esc(n)}"></option>`).join('')}</datalist><p id="enemy-error" class="enemy-error" role="alert"></p><button class="draft-submit" type="submit">Encontrar mi pick <span aria-hidden="true">↗</span></button></form>
          <div id="matchup-result" aria-live="polite" aria-atomic="true"></div></section>
        </div>
        <details class="draft-method"><summary>Cómo se prepara esta recomendación <span>Fuentes y límites ↗</span></summary><div><p><b>Tier list personal.</b> Sale de las últimas 100 partidas de esta persona, agrupando sus cuentas y excluyendo ARAM y remakes. Combina experiencia en el rol, experiencia total, resultados moderados con 10 partidas virtuales al 50% y dificultad de Riot. Si faltan partidas, completa con una selección de aprendizaje por posición. No se ajusta por elo ni por parche de cada partida.</p><p><b>Encaje del emparejamiento.</b> Ordena solo los campeones de esta tier list: 40% preparación personal, 50% reglas de kit y 10% resultados personales contra ese rival en esa posición. Los resultados del duelo también se moderan con 10 partidas virtuales al 50%. El índice de 0 a 100 sirve para comparar opciones, <b>no es una probabilidad de victoria</b>.</p><p><b>Orientación, no estadísticas globales de counters.</b> Las reglas de kit son una interpretación de habilidades (alcance, iniciación, defensa, desplazamientos). No cubren todas las interacciones ni usan datos en directo de Blitz. Los roles del historial están deducidos del orden en el equipo; revisa con especial cuidado los duelos de bot y jungla. No se tiene en cuenta el segundo campeón de bot, los bans ni la composición completa.</p><p>Catálogo e imágenes: <a href="https://developer.riotgames.com/docs/lol#data-dragon" target="_blank" rel="noopener">Riot Data Dragon ${esc(C.version)}</a> · consultado el 12/11/2026. Habilidades: <a href="https://www.leagueoflegends.com/es-es/champions/" target="_blank" rel="noopener">campeones oficiales de Riot</a>. Datos personales: OP.GG, última actualización ${esc(player.ds.map(d => d.updated).sort()[0])}. La selección se recalcula al cambiar los archivos de partidas; el catálogo y las reglas necesitan revisión tras cambios de parche.</p></div></details>
        <footer class="draft-footer">Una buena selección ayuda. Las buenas decisiones hacen el resto.<a href="index.html">LoL Stats ↗</a></footer>`;
      renderTiers();
      renderMatchup();
      app.querySelectorAll('[data-player]').forEach(b => b.addEventListener('click', () => {
        player = players.find(p => p.id === b.dataset.player);
        saveState(); render();
        app.querySelector(`[data-player="${player.id}"]`).focus();
      }));
      app.querySelectorAll('[data-role]').forEach(b => b.addEventListener('click', () => {
        role = b.dataset.role; saveState(); render();
        app.querySelector(`[data-role="${role}"]`).focus();
      }));
      const input = document.getElementById('enemy');
      input.addEventListener('input', () => {
        enemy = null; saveState();
        input.removeAttribute('aria-invalid');
        document.getElementById('enemy-error').textContent = '';
        renderMatchup();
      });
      document.getElementById('clear-enemy').onclick = () => {
        enemy = null; saveState(); input.value = ''; input.removeAttribute('aria-invalid');
        document.getElementById('enemy-error').textContent = ''; renderMatchup(); input.focus();
      };
      document.getElementById('matchup-form').addEventListener('submit', event => {
        event.preventDefault();
        enemy = E.resolveChampion(input.value, catalog);
        if (!enemy) {
          document.getElementById('enemy-error').textContent = 'Elige un campeón del catálogo. Puedes escribir su nombre sin tildes ni apóstrofos.';
          input.setAttribute('aria-invalid', 'true'); input.focus();
        } else {
          input.value = enemy; input.removeAttribute('aria-invalid');
          document.getElementById('enemy-error').textContent = '';
        }
        saveState(); renderMatchup();
      });
    }
    function renderTiers() {
      const rows = E.tierList(player.games, role, catalog);
      document.getElementById('tier-list').innerHTML = ['S', 'A', 'B'].map(tier => {
        const group = rows.filter(c => c.tier === tier);
        return `<section class="tier-group tier-${tier.toLowerCase()}"><div class="tier-label"><b>${tier}</b><span>${tierLabels[tier]}</span></div><div class="tier-champions">${group.length ? group.map(c => `<article class="tier-champion">${icon(c.name)}<div><h3>${esc(c.name)}</h3><p>${esc(championMeta(c))}</p></div><span class="tier-sample ${c.personal.n >= 5 ? 'sample-known' : ''}">${c.personal.n >= 5 ? 'Con rodaje' : c.personal.n ? 'Muestra corta' : 'Por probar'}</span></article>`).join('') : `<p class="tier-empty">${tier === 'S' ? 'Todavía faltan partidas en este rol para destacar una apuesta sólida.' : tier === 'A' ? 'Sin experiencia suficiente en esta muestra.' : 'Las opciones seleccionadas ya tienen experiencia previa.'}</p>`}</div></section>`;
      }).join('');
    }
    function renderMatchup() {
      const target = document.getElementById('matchup-result');
      if (!enemy) {
        target.innerHTML = '<div class="matchup-empty"><span aria-hidden="true">VS</span><h3>El rival pone la pregunta.<br>Tu repertorio tiene la respuesta.</h3><p>Selecciona un campeón para comparar tus opciones, ver el pick recomendado y preparar el duelo.</p></div>';
        return;
      }
      const ranked = E.recommend(player.games, role, enemy, catalog);
      if (!ranked.length) { target.innerHTML = '<p class="empty">No quedan opciones para este emparejamiento.</p>'; return; }
      const best = ranked[0];
      const trusted = best.personal.n >= 5;
      const history = best.head.n ? `${best.head.w}V · ${best.head.n - best.head.w}D en ${best.head.n} ${best.head.n === 1 ? 'duelo guardado' : 'duelos guardados'} con este campeón contra ${enemy}.` : 'Sin duelos guardados con este campeón contra este rival en la posición elegida.';
      const explanation = best.personal.n ? `${best.personal.n} partidas en ${labels[role]} con ${best.name}: ${record(best.personal)}. Su experiencia y resultados cuentan más que un counter teórico.` : best.overall.n ? `Tienes ${best.overall.n} partidas con ${best.name} en otras posiciones. No hay resultados personales en ${labels[role]}: pruébalo primero en normales.` : `No hay partidas guardadas con ${best.name}. Es una propuesta de aprendizaje, basada en su kit y facilidad de uso; practícalo en normales.`;
      target.innerHTML = `
        <div class="draft-versus">${icon(enemy)}<div><small>EL RIVAL · ${labels[role]}</small><b>${esc(enemy)}</b></div><span>VS</span></div>
        <article class="recommended-pick">
          <p class="draft-eyebrow">${trusted ? 'TU PRIMERA OPCIÓN' : 'OPCIÓN PARA PRACTICAR'}</p>
          <div class="pick-title">${icon(best.name, 'winner-icon')}<div><span class="pick-tier">TIER ${best.tier} PERSONAL</span><h3>${esc(best.name)}</h3><p>Para ${esc(player.name)} · ${labels[role]}</p></div><div class="pick-score"><b>${Math.round(best.score)}</b><span>/ 100<br>encaje</span></div></div>
          <p class="confidence-note">${best.head.n >= 10 && trusted ? 'Con historial personal del duelo; sigue siendo orientativo.' : 'Confianza limitada · muestra de duelos escasa o inexistente.'}</p>
          <p class="pick-experience">${esc(explanation)}</p>
          <h4>Por qué encaja</h4><ul class="pick-reasons">${best.kit.reasons.map(r => `<li>${esc(r)}</li>`).join('')}</ul>
          <h4>Lo que debes vigilar</h4><p class="pick-warning">${esc(best.kit.warnings.join(' ') || (role === 'Jungla' ? 'La recomendación no garantiza ganar los duelos de jungla. Respeta la prioridad de las líneas, prepara visión y evita invadir sin información.' : 'La recomendación no garantiza ganar la línea. Respeta los enfriamientos, prepara visión y adapta los intercambios a tu oleada.'))}</p>
          <p class="head-to-head">${esc(history)} ${best.head.n && best.head.n < 10 ? 'La muestra es demasiado pequeña para concluir una ventaja.' : ''}</p>
          <div class="score-breakdown"><span>Preparación <b>${Math.round(best.base)}</b><small>40% del índice</small></span><span>Kit frente al rival <b>${Math.round(best.kit.score)}</b><small>50% del índice</small></span><span>Historial del duelo <b>${best.head.n ? Math.round(50 + ((best.head.w + 5) / (best.head.n + 10) - 0.5) * 100) : '50 · neutro'}</b><small>10% del índice</small></span></div>
        </article>
        <div class="alternatives"><h3>Otras cartas sobre la mesa</h3>${ranked.slice(1, 4).map((c, i) => `<article>${icon(c.name)}<div><h4>${esc(c.name)} <small>Tier ${c.tier}</small></h4><p>${esc(championMeta(c))}</p><p class="alternative-reason">${esc(c.kit.reasons[0])}</p></div><span class="alternative-score">${Math.round(c.score)}<small>encaje</small></span></article>`).join('')}</div>
        <p class="result-footnote">Índice orientativo, no porcentaje de victoria. Se comparan únicamente los 8 campeones de tu tier list de ${labels[role]}. El campeón enemigo queda excluido.</p>`;
    }
    window.addEventListener('popstate', () => { readState(); render(); });
    readState(); saveState(); render();
  });
})();
