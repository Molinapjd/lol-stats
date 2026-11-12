# Preparando la pelada de lomo

Acceso desde la portada: `preparando.html`. Cada invocador tiene una URL propia:
`preparando.html?invocador=josiso&rol=jungla&rival=Master+Yi`.
El estado se puede compartir y se conserva al recargar. Funciona en GitHub Pages y
abriendo los HTML locales, igual que el resto del proyecto.

## Datos y ordenación

- Reutiliza `LOL_STATS.prepare`: 100 partidas válidas por persona, todas sus
  cuentas, alias agrupados, sin ARAM ni remakes. No mezcla el historial de personas.
- Cada posición combina sus campeones jugados con un repertorio de aprendizaje
  seleccionado manualmente; muestra las ocho opciones con mayor preparación.
- Preparación: base 48, experiencia en el rol hasta 18, experiencia con el campeón
  hasta 9, resultados moderados con diez partidas virtuales al 50%, dificultad de
  Riot y una pequeña prioridad de aprendizaje por posición. La experiencia tiene
  rendimiento decreciente para que un campeón muy jugado no monopolice el draft.
- S: cinco o más partidas en el rol, tasa moderada de al menos 50% y preparación
  de al menos 62. A: tres partidas en el rol o cinco en total. B: práctica pendiente.
- Emparejamiento: 40% preparación, 50% reglas de kit y 10% historial personal del
  duelo (también moderado). Solo considera opciones de esa tier list y excluye al
  campeón enemigo. El índice es comparativo y nunca una probabilidad de victoria.
- Los duelos personales exigen el mismo campeón, rol y rival directo inferido.
  Los roles vienen del orden del equipo en los datos existentes; no son una
  clasificación oficial verificada. Jungla y bot requieren especial cautela.

## Archivos y actualización

- `draft-engine.js`: funciones puras, repertorios y reglas de kit. Sin red ni DOM.
- `draft-catalog.js`: catálogo de 173 campeones de Riot Data Dragon 16.22.1,
  consultado el 12/11/2026. Nombres, IDs, clases, alcance y dificultad; sin winrates.
- `preparando.js`, `preparando.css`, `preparando.html`: interfaz y estado en URL.
- `tests/draft.test.cjs`: cobertura de cinco perfiles, cinco roles, muestras cortas,
  espejos, historial de duelos y validación del catálogo.

Los datos personales se recalculan al actualizar los archivos de `data/`.
El catálogo y las reglas de kit necesitan revisión manual al cambiar de parche.
No hay conexión con Blitz ni una fuente de counters globales en directo.
Las ventajas de kit son heurísticas propias; no demuestran una ventaja estadística.

Fuentes de las características de campeón:

- https://developer.riotgames.com/docs/lol#data-dragon
- https://ddragon.leagueoflegends.com/cdn/16.22.1/data/en_US/champion.json
- https://ddragon.leagueoflegends.com/cdn/16.22.1/data/en_US/champion/Poppy.json
- https://ddragon.leagueoflegends.com/cdn/16.22.1/data/en_US/champion/Vex.json
- https://ddragon.leagueoflegends.com/cdn/16.22.1/data/en_US/champion/Morgana.json
- https://ddragon.leagueoflegends.com/cdn/16.22.1/data/en_US/champion/Rammus.json
- https://www.leagueoflegends.com/es-es/champions/

Comprobación: `node --test tests/*.test.cjs`.

## Feedback de emparejamientos

`matchup-abilities.js` contiene nombres en español y etiquetas mecánicas de las
692 habilidades Q/W/E/R del catálogo de 173 campeones. Proceden de Riot Data
Dragon; se actualizan con `python tools/update_matchup_abilities.py`.
El actualizador distingue inalcanzabilidad e inmunidad al daño. Las etiquetas
son una ayuda de clasificación, no una simulación completa del combate.

`matchup-coach.js` separa interacciones revisadas entre parejas concretas de
planes orientativos por habilidades. Los planes mencionan recursos propios,
amenazas rivales y ventanas de actuación. Para parejas sin revisión específica,
la interfaz lo indica y no las presenta como counters confirmados.

El historial del duelo exige misma persona, posición, campeón propio y rival
directo. Incluye V/D de la partida, KDA agregado, medias K/D/A, participación y
las últimas cinco partidas. Los resultados contra ese rival con otros campeones
aparecen separados. La interfaz avisa de muestras cortas y de los roles inferidos.
Los botones de alternativas permiten consultar su plan sin presentarlas como
la primera recomendación del motor.
