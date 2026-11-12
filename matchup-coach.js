/* Tactical plans grounded in named abilities. Reviewed interactions are distinct from general preparation. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./matchup-abilities.js'));
  else root.LOL_MATCHUP_COACH = factory(root.LOL_MATCHUP_ABILITIES);
})(typeof window !== 'undefined' ? window : globalThis, function (data) {
  'use strict';
  const OWN = {
    Thresh: ['E', 'Mantén E para separar al rival de tu tirador. Después de acertar Q, decide si necesitas la segunda activación: acercarte también puede regalar una iniciación sobre ti. Coloca W hacia la retirada de tu compañero, no encima del enemigo.'],
    Senna: ['W', 'Busca Q desde un ángulo que permita golpear y curar. La inmovilización de W llega con retraso: úsala para preparar la siguiente acción, no como si frenara una entrada al instante.'],
    Galio: ['W', 'Mantenla para cuando el rival te lance su combo: reduce el daño mágico que recibes y, al soltarla, provoca a quien tengas cerca. E te lanza hacia delante, así que úsala solo cuando el rival haya gastado su forma de escapar. R viaja hasta un aliado: sirve para ayudar en otra línea, no para huir.'],
    Jhin: ['W', 'Prepara la cuarta bala antes de intercambiar y aprovecha el movimiento posterior para salir. Para inmovilizar con W, primero tiene que existir la marca de daño de un aliado, una trampa o tu propio daño; W a un objetivo sin marcar no lo enraíza.'],
    Wukong: ['W', 'Reserva W para cambiar de posición después de tu primera entrada. Si gastas E y W solo para acercarte, te quedas sin una salida propia; usa la definitiva cuando tu equipo pueda aprovechar el derribo.'],
    Vi: ['Q', 'Carga Q desde fuera de la visión rival cuando puedas. Si Q falla, no conviertas automáticamente el intento en una entrada con R: comprueba antes dónde terminarás y qué aliado podrá seguirte.'],
    "Vel'Koz": ['E', 'Busca primero ralentizar con Q y coloca E sobre la ruta de salida. R te deja canalizando en el mismo lugar: empieza el rayo después de que el rival gaste la habilidad que puede alcanzarte o interrumpirte.'],
    Malphite: ['E', 'Usa Q para ajustar la distancia y E cuando el rival vaya a intercambiar ataques a tu lado. R es tu compromiso fuerte: comprueba primero si el rival conserva una defensa capaz de negarla.'],
    Jinx: ['E', 'Pon E entre el iniciador y tu ruta de retirada antes de que te alcance. Alterna el alcance de los cohetes con la minigun cuando puedas pegar sin exponerte; no avances para rematar sin revisar qué entrada le queda al rival.'],
    Diana: ['R', 'Prepara la marca de Q antes de utilizar E para conservar su reinicio. R requiere enemigos cerca: entra cuando exista una continuación de tu equipo y evita gastar el desplazamiento solo para perseguir un rival con salida disponible.'],
    Rammus: ['W', 'Activa W cuando el enemigo vaya a pegarte y combina la provocación con esa defensa. No gastes la postura antes de estar a distancia útil: un rival que se retire puede esperar a que termine.'],
    Morgana: ['E', 'Asigna E al aliado que va a recibir el control, antes del impacto. El escudo absorbe daño mágico y protege del control mientras permanece; no sirve como resistencia general frente a ataques físicos.'],
    Leona: ['E', 'La segunda parte de E te lleva hasta el campeón alcanzado. Antes de lanzarla, comprueba si tu tirador puede seguir; una E acertada sin continuación puede dejarte sola. Encadena Q al llegar, en lugar de gastar todo sobre el primer objetivo resistente.'],
    Nautilus: ['Q', 'Busca una línea de Q sin esbirros delante y decide antes dónde te dejará el desplazamiento. Guarda el ataque que inmoviliza para cuando el enemigo alcance tu zona; no gastes toda la cadena de control sin que tu tirador esté a distancia.'],
    Braum: ['E', 'Orienta E hacia el origen de los proyectiles que amenazan a tu tirador. Coordina Q y los ataques aliados para completar la pasiva; una sola marca no es un aturdimiento inmediato.'],
    Amumu: ['Q', 'Si entras con Q, calcula si R alcanzará al objetivo importante y si tus aliados pueden llegar. Evita gastar tu entrada sobre el tanque que esté separado del resto de su equipo.'],
    Warwick: ['E', 'Activa E antes de recibir el intercambio fuerte y decide cuándo liberar el miedo. No saltes con R a un objetivo que te deje fuera del alcance de tus compañeros.'],
    Nocturne: ['W', 'Guarda W para la habilidad que puede frenar tu entrada. Al elegir el objetivo de R, revisa también el camino de retirada: llegar a un carry no implica poder salir después.'],
    Annie: ['R', 'Comprueba las cargas de la pasiva antes de iniciar con R. Después de una primera rotación, no sigas avanzando como si todavía tuvieras disponible el mismo aturdimiento.'],
    Vex: ['W', 'Comprueba que el miedo de la pasiva esté preparado antes de recibir una entrada con W. Acertar R no obliga a reactivarla: mira la posición del resto del equipo enemigo antes de desplazarte.'],
    Ahri: ['E', 'Busca E desde un lateral de la oleada y conserva un desplazamiento de R para reposicionarte. Si gastas el encanto sin acertar, reduce la exposición hasta que vuelva tu herramienta de control.'],
    Malzahar: ['R', 'Reserva R para un objetivo al que tus aliados puedan dañar durante la supresión. La canalización te mantiene quieto: comprueba si un segundo rival puede interrumpirte antes de comprometerla.'],
    Lux: ['Q', 'Q puede alcanzar dos objetivos: aprovecha esa trayectoria, pero no la gastes por daño si es tu única herramienta para detener una entrada. Usa E para condicionar el espacio antes de buscar el combo.'],
    Ashe: ['R', 'Elige R cuando exista continuación de tu equipo o necesites frenar a quien se acerca. El control no elimina la necesidad de mantener la distancia: evita caminar hacia el rival solo porque esté ralentizado.'],
    'Miss Fortune': ['R', 'Antes de canalizar R, comprueba qué desplazamiento o control sigue disponible en el rival. Busca una posición lateral protegida; entrar en alcance de sus controles para conseguir un mejor ángulo suele cancelar tu daño.'],
    Sivir: ['E', 'Reserva E para una habilidad relevante y no para el primer daño pequeño que recibas. La protección bloquea una habilidad: no supone inmunidad frente a toda la cadena que venga después.'],
    Varus: ['R', 'Distingue entre preparar daño y gastar tu defensa: R puede ser tu única forma de frenar una entrada. Busca consumir las acumulaciones de W con una habilidad cuando puedas hacerlo sin perder la distancia.'],
    Tristana: ['W', 'Antes de saltar con W, identifica de dónde saldrá el reinicio o cómo sobrevivirás sin él. Si no existe una baja probable y segura, conserva el salto como salida.'],
    Caitlyn: ['E', 'Coloca las trampas de W en el recorrido que el rival necesita usar y conserva E si aún puede alcanzarte. Castiga desde el alcance de tus ataques; no reduzcas esa ventaja caminando hacia una amenaza.'],
    Ezreal: ['E', 'Separa el uso ofensivo y defensivo de E: usarla para pegar una Q te deja sin ese reposicionamiento para la siguiente entrada. Busca Q desde un ángulo limpio de esbirros.'],
    Xayah: ['R', 'Prepara plumas antes de buscar la raíz de E. Conserva R para evitar la amenaza principal y cuenta con el punto donde volverás a caer, no solo con el momento de invulnerabilidad al objetivo.'],
    "Kai'Sa": ['R', 'R necesita una marca de plasma y cambia tu posición. No saltes hacia el lado sin aliados de un objetivo solo por tener disponible la activación; decide antes dónde quedará tu siguiente salida.'],
    Vayne: ['E', 'Comprueba el ángulo de pared antes de usar E para buscar un aturdimiento. Si ese ángulo no existe, su empuje sigue siendo una herramienta para mantener la distancia.'],
    Zyra: ['E', 'Coloca las semillas antes de la habilidad que debe activarlas y reserva E si el rival puede entrar. Las plantas ayudan a controlar un paso, pero no convierten una posición sin salida en una posición segura.'],
    Janna: ['Q', 'Guarda una Q de respuesta cuando el rival pueda entrar; no hace falta cargarla al máximo para desplazar a una amenaza cercana. Utiliza R para separar al iniciador, teniendo en cuenta hacia dónde lo empujarás.'],
    Lulu: ['W', 'Decide si W debe acelerar a tu aliado o polimorfar al rival que se acerque. Contra una entrada, gastar W para moverte puede quitarte la respuesta que necesitaba tu carry.'],
    Milio: ['Q', 'Reserva Q para apartar a quien llegue a corta distancia. No gastes toda la protección en daño menor si el enemigo todavía conserva la habilidad que abre su combo.'],
    Soraka: ['E', 'Coloca E sobre el lugar donde el enemigo quiere continuar el combo. El silencio se aplica en la zona, pero la inmovilización requiere que permanezca allí; no cuentes con una raíz inmediata.'],
    Brand: ['Q', 'Prepara la pasiva con otra habilidad antes de buscar el aturdimiento con Q. Una Q sobre un objetivo que todavía no arde no ofrece el mismo control para protegerte de una entrada.'],
    Rakan: ['W', 'Comprueba dónde está el aliado al que puedes volver con E antes de entrar con W. Acertar el derribo no compensa quedarte fuera del alcance de tu salida.'],
    'Renata Glasc': ['Q', 'Conserva Q si necesitas apartar a quien entre. El segundo lanzamiento cambia la posición del enemigo: elige la dirección antes de usarlo y evita acercar una amenaza a tu carry.'],
    Karma: ['E', 'Decide qué versión de Mantra necesita la jugada antes de comprometer R. Si el rival conserva una entrada fuerte, guardar el escudo y la velocidad puede valer más que gastar Mantra en daño.'],
    Nami: ['Q', 'Busca Q sobre un objetivo ya ralentizado o en una trayectoria de llegada previsible. No uses la burbuja solo por daño si es la herramienta que necesitas para frenar al rival.'],
    Seraphine: ['E', 'Comprueba el estado del enemigo antes de E: el efecto de control depende de si ya estaba ralentizado o inmovilizado. Usa el eco y el control aliado para preparar el seguimiento.'],
    Jax: ['E', 'Conserva E para los ataques relevantes del intercambio y elige cuándo liberar el aturdimiento. Si Q te lleva hacia delante sin una unidad de salida preparada, tu retirada dependerá de ganar el intercambio.'],
    Poppy: ['W', 'Reserva W para el desplazamiento que quieres cortar y comprueba que el rival esté entrando en tu zona. No es una respuesta universal a teletransportes ni a desplazamientos imparables.'],
    Garen: ['W', 'Usa W para la parte fuerte del intercambio, no solo al empezar a acercarte. Aprovecha el silencio de Q para una acción corta y retírate si seguir pegando te deja sin recursos defensivos.'],
    Darius: ['E', 'Busca el filo exterior de Q para aprovechar la curación. Guarda E para acercar al objetivo cuando no pueda abandonar fácilmente el intercambio; gastarla antes de llegar puede dejarte sin continuación.'],
    Mordekaiser: ['E', 'Apunta E a la ruta de salida del rival y comprueba qué defensa conserva antes de usar R. Aislar a un objetivo no garantiza ganarle si empiezas sin recursos o con poca vida.'],
    Shen: ['W', 'Coloca la espada para poder proteger con W el lugar donde se está intercambiando. E es entrada y salida: si la gastas hacia delante, comprueba que tu aliado pueda aprovechar la provocación.'],
    Ornn: ['R', 'Prepara el espacio para la segunda activación de R. Si el enemigo conserva un control que te impida reactivarla, no inicies desde una posición donde pueda alcanzarte fácilmente.'],
    Sett: ['E', 'Busca colocar enemigos a ambos lados para el aturdimiento de E. El escudo de W depende del daño acumulado: si lo gastas demasiado pronto, tu respuesta al intercambio será menor.'],
    Teemo: ['Q', 'Guarda Q para los ataques que quieres negar y utiliza el movimiento para salir del intercambio. La ceguera no te protege de las habilidades que el rival todavía pueda acertarte.'],
    Trundle: ['R', 'Utiliza R sobre el rival cuyas resistencias necesites reducir y E para cerrar su ruta de salida. No pongas el pilar de forma que facilite que se aleje de tus aliados.'],
    Lissandra: ['R', 'Decide antes si necesitas R sobre el enemigo para controlarlo o sobre ti para sobrevivir. Entrar con E sin esa decisión puede dejarte dentro del equipo rival sin una continuación útil.'],
    Orianna: ['R', 'Comprueba la posición real de la bola antes de R. Colócala con Q o E para que el rival tenga que pasar cerca, en lugar de perseguir una definitiva desde fuera de alcance.'],
    Viktor: ['W', 'Coloca W en la ruta por la que el rival necesita seguirte. El aturdimiento requiere permanecer en la zona; úsala para limitar el recorrido, no como un control instantáneo.']
  };
  // [key, concrete risk, action window]. These describe abilities, not global counter win rates.
  const THREATS = {
    Garen: ['Q', 'Su Q le acelera y te silencia: si te alcanza con ella no podrás usar habilidades durante un momento y después te hará girar con E. Con poca vida, su R te remata.', 'Cuando gaste Q para acercarse, aléjate antes de que llegue: sin ella le cuesta mucho alcanzarte.'],
    Veigar: ['E', 'Su E crea una jaula: si tocas el borde quedas aturdido y te puede rematar con su R, que hace más daño cuanta menos vida te quede.', 'Cuando gaste E tienes unos segundos sin jaula: es el momento de acercarte e intercambiar.'],
    Morgana: ['E', 'El escudo negro impide el control mientras permanece. No comprometas tu cadena de control sobre el objetivo que lo conserva.', 'Busca tu acción cuando E haya expirado o se haya roto antes de que impacte tu control.'],
    Leona: ['E', 'Su E atraviesa esbirros y la desplaza hasta el último campeón alcanzado. La oleada no es una barrera contra esta entrada.', 'Cuando falle o gaste E, puedes disputar espacio sin su misma entrada directa; vuelve a respetarla al recuperarla.'],
    Blitzcrank: ['Q', 'Su Q te acerca al equipo enemigo. Mantén una unidad de la oleada entre ambos y no abras el ángulo solo para golpear una vez.', 'Después de una Q fallada, cambia de posición y busca tu intercambio antes de que vuelva a disponer del agarre.'],
    Thresh: ['Q', 'Su Q se detiene en la primera unidad. Si alcanza a un campeón puede reactivarla para acercarse, así que separa al objetivo enganchado de tu tirador.', 'Busca un ángulo distinto tras una Q fallada; no confundas el gancho gastado con tener también gastada su E.'],
    Nautilus: ['Q', 'Su Q abre una entrada y su primer ataque sobre un objetivo puede inmovilizarlo. No te quedes a distancia de ataque después de esquivar el gancho.', 'Castiga el gancho fallado desde fuera del alcance de sus ataques, en vez de caminar hasta su siguiente control.'],
    Pyke: ['Q', 'Una Q cargada puede atraerte. Su E le permite salir dejando una trayectoria que puede aturdirte: no lo sigas en línea recta.', 'Busca el castigo después de que gaste E y no tenga una salida inmediata disponible.'],
    Lux: ['Q', 'Su Q puede alcanzar dos unidades. Estar detrás de un único esbirro no garantiza quedar protegido de la raíz.', 'Cuando falle Q, puedes avanzar para una acción corta; evita regalarle una nueva línea de tiro al retroceder.'],
    Zyra: ['E', 'Su E atraviesa unidades y puede inmovilizarte. Además, sus plantas pueden interponerse en habilidades que chocan con la primera unidad.', 'Busca el intercambio tras una E fallada y desde un ángulo que no tenga plantas bloqueando tu habilidad.'],
    Brand: ['Q', 'Su Q puede aturdir si ya te ha aplicado su pasiva. Recibir E o W cambia el riesgo de quedarte delante de su Q.', 'Tras fallar Q pierde esa amenaza de aturdimiento; no prolongues el intercambio dentro de su W.'],
    Rakan: ['W', 'Su W lo desplaza hasta una zona y levanta a los enemigos allí. No te agrupes con tu tirador en el mismo punto de llegada.', 'Si W falla, busca daño sin perseguir su regreso con E hasta una zona sin aliados.'],
    Alistar: ['W', 'Su W lo lleva hasta el objetivo y puede encadenarla con Q. Acercarte por un ataque puede abrirle el combo que antes no tenía.', 'Cuando gaste W o Q, busca una acción corta; si utiliza R, no des por hecho que mantendrás la misma cadena de control.'],
    Braum: ['E', 'Su E intercepta proyectiles y la pasiva acumula marcas antes del aturdimiento. Evita seguir intercambiando cuando estés cerca de completar esas marcas.', 'Cambia el ángulo o espera a que termine E antes de comprometer un proyectil importante sobre el carry.'],
    Janna: ['Q', 'Su tornado puede levantar e interrumpir una entrada; después de entrar también puede separarte con R.', 'Busca tu compromiso cuando Q esté gastada, conservando una forma de responder al empuje de R.'],
    Lulu: ['W', 'Su W sobre un enemigo aplica polimorfia. Entrar a corta distancia con todo disponible puede dejarte sin poder completar tu combo.', 'Espera a que W se utilice antes de una entrada que dependa de ejecutar varias acciones seguidas.'],
    Senna: ['W', 'Su W inmoviliza con retraso y su Q puede darle un intercambio largo de daño y curación. No te quedes junto a un aliado que va a activar la raíz.', 'Busca una acción corta cuando W esté gastada; evita alargar el desgaste si no puedes responder a su curación con Q.'],
    'Renata Glasc': ['W', 'Su W puede prolongar la actividad de un enemigo que parecía rematado. No gastes toda tu salida suponiendo que esa baja cerrará la pelea.', 'Identifica al objetivo que recibe W y conserva espacio para retirarte si continúa golpeando después de caer.'],
    'Master Yi': ['Q', 'Durante Q no puedes seleccionarlo. Su R le da inmunidad a ralentizaciones: una ralentización aislada no basta para frenarlo.', 'Espera su reaparición tras Q para aplicar control; si empieza W, un control que interrumpa la canalización puede cortar su defensa.'],
    Yasuo: ['W', 'Su muro bloquea proyectiles enemigos. Lanzar tu proyectil de control contra el muro puede dejarte sin defensa frente a su siguiente desplazamiento.', 'Cambia de ángulo o espera a que el muro desaparezca antes de gastar el proyectil principal.'],
    Fizz: ['E', 'Su E lo vuelve inalcanzable durante parte de la acción. Gastar tu habilidad decisiva antes de que la utilice facilita que la esquive.', 'Busca tu control cuando termine de caer de E; comprueba también si su Q sigue disponible para salir.'],
    Zed: ['W', 'Su sombra de W le permite amenazar desde otro ángulo y cambiar de posición. No centres todas tus habilidades en su primera ubicación.', 'Cuando gaste el intercambio de W, revisa la posición de la sombra antes de comprometer tu control o una canalización.'],
    Samira: ['W', 'Su W destruye proyectiles cercanos. Un proyectil importante gastado durante ese giro puede desaparecer sin ofrecerte la respuesta esperada.', 'Espera a que termine W antes de comprometer el proyectil que necesitas para controlar el intercambio.'],
    Caitlyn: ['E', 'Puede retroceder con E y dejarte en una posición expuesta. Sus trampas de W condicionan los pasos por los que te acercas.', 'Busca tu acción cuando haya gastado E y desde una ruta sin trampas; no persigas solo por haber empezado el intercambio.'],
    Jinx: ['E', 'Sus trampas de E pueden cerrar tu recorrido de entrada o retirada. Si obtiene una baja o asistencia relevante, la velocidad de su pasiva cambia la distancia del intercambio.', 'Oblígala a elegir una ruta antes de gastar tu habilidad principal, y no persigas por encima de unas trampas ya preparadas.'],
    Rammus: ['W', 'Con W activa devuelve daño al recibir ataques. Golpearlo continuamente durante esa postura puede perjudicarte más que cambiar de objetivo.', 'Reduce los ataques sobre él durante W cuando puedas y reanuda el daño continuo al terminar la postura.'],
    Fiora: ['W', 'Su W puede negar una habilidad importante y responder con aturdimiento si bloquea un efecto de inmovilización.', 'Fuerza o espera su W antes de comprometer la parte decisiva de tu control; no lances todo sobre la parada activa.'],
    Jax: ['E', 'Su E evita ataques básicos y termina con un aturdimiento. Un intercambio de ataques mientras la mantiene activa puede favorecerlo.', 'Sepárate durante E y busca tu siguiente acción después de que libere el aturdimiento.'],
    Malphite: ['R', 'Su R es una entrada imparable durante el desplazamiento. No planees detenerla con un simple empuje o derribo cuando ya está en marcha.', 'Mantén separación entre carries antes de su R y prepara tu respuesta para cuando aterrice, no para cortar el viaje.'],
    Olaf: ['R', 'Con R activa es inmune al control. Tu habilidad de inmovilización puede hacer daño sin mantenerlo en el sitio.', 'Conserva distancia y una ruta de salida mientras dure R; no bases tu defensa en que tu control lo detendrá.'],
    Sivir: ['E', 'Su E bloquea una habilidad. Gastar tu control principal contra el escudo puede dejarte sin continuación.', 'Busca gastar el escudo con una acción menor o espera a que expire antes de la habilidad que necesitas acertar.'],
    Ezreal: ['E', 'Su E cambia rápidamente su posición. No es una carrera lineal que puedas tratar como cualquier desplazamiento para interrumpirla.', 'Amenaza desde un ángulo que le obligue a gastar E y apunta la siguiente acción al lugar donde aparezca.'],
    Sylas: ['E', 'La segunda parte de E puede llevarlo hasta ti y levantar al objetivo. También puede robar tu definitiva: comprueba qué herramienta le estás ofreciendo.', 'Busca la respuesta después de que gaste E y evita recibir toda su rotación mientras conserva la curación de W.'],
    Darius: ['E', 'Su E puede impedir que cierres un intercambio corto retirándote. Si sigues a su alcance, acumula la pasiva y aumenta el peligro de su R.', 'Busca salir antes de acumular demasiadas marcas y evita el filo exterior de Q cuando intente recuperar vida.']
  };
  const PAIRS = {};
  const pair = (you, enemy, reason, warning, window) => { PAIRS[you + '|' + enemy] = { reason, warning, window }; };
  pair('Thresh','Leona','Tu E puede cortar la entrada de su E si la alcanzas durante el desplazamiento. Así puedes guardar Q para castigarla después, en lugar de usar ambas habilidades a la vez.','Su E atraviesa esbirros. Si gastas E por daño antes de que entre, pierdes esa respuesta; tu W tampoco limpia el aturdimiento de su Q.','Ponte a distancia de tu tirador sin superponerte con él. Responde con E a la entrada y coloca W hacia una retirada segura si la cadena de control continúa.');
  pair('Thresh','Morgana','Q amenaza a cualquiera de los dos enemigos, pero el objetivo cubierto por su E no recibirá tu control mientras el escudo se mantenga. Puedes cambiar de objetivo para obligarla a decidir a quién protege.','No confundas acertar Q con poder controlar al objetivo escudado. Tu W no elimina la inmovilización de su Q y un aliado inmovilizado no puede usarla para salir durante ese control.','Espera a que su E termine o se rompa antes del impacto de Q. Busca después un ángulo sin esbirros y guarda E para impedir que su R mantenga al equipo cerca.');
  pair('Thresh','Blitzcrank','Si tu compañero es atraído, E puede separar a Blitzcrank de él después de la llegada y W prepara una salida cuando pueda activar la linterna. No necesitas acertar otro gancho para ayudar.','No permanezcas junto a tu tirador: una Q sobre ti puede abrir la continuación sobre ambos. La linterna no se puede activar durante una inmovilización o silencio.','Quédate a un lado de la línea de Q. Tras una Q fallada de Blitzcrank, busca tu propio gancho; si ya ha atrapado al aliado, prioriza separar y recolocar antes que entrar con la segunda Q.');
  pair('Thresh','Nautilus','Tu E permite separar a Nautilus del objetivo tras su llegada y tu W puede ofrecer una retirada después del control. Tu utilidad aquí está en la respuesta al engage, no en entrar primero a cualquier coste.','Su R sigue a un objetivo y no se evita colocando un esbirro delante. No apiles tu posición con el aliado marcado ni cuentes con que W limpie el derribo.','Guarda E para la llegada de Nautilus. Coloca W fuera de su recorrido de seguimiento y busca Q sobre su tirador cuando haya gastado la entrada, si no abandonas al tuyo.');
  pair('Thresh','Rakan','E puede desplazar a Rakan durante su entrada de W si aciertas el momento, antes de que complete el derribo. Mantener esa amenaza puede proteger al tirador sin lanzarte con Q.','Si persigues la segunda Q mientras conserva E, puede regresar a su aliado y dejarte mal colocado. Su R puede encadenar encanto si ambos estáis juntos.','Reserva E para su llegada y deja una ruta de W hacia atrás. Cuando W falle, busca un castigo corto en vez de seguir su retirada hasta el equipo enemigo.');
  pair('Thresh','Alistar','E puede cortar la aproximación de su W si lo desplazas durante la entrada. Guardarla cambia tu función: de buscar un gancho a proteger a quien Alistar intenta alcanzar.','Q todavía puede levantar a los enemigos cercanos si ya ha llegado. Su R puede liberarlo del control: acertarle Q no obliga a reactivarla hacia él.','Mantente al alcance de respuesta de tu tirador, con E disponible. Si Alistar gasta W y Q, busca castigar a su carry sin entrar por inercia en la zona de su R.');
  pair('Thresh','Pyke','E puede apartar a Pyke cuando busque continuar a corta distancia y Q amenaza su salida si esperas a que gaste E. Tu control ayuda a proteger al objetivo que intenta rematar.','No sigas su E en la misma línea: la trayectoria puede aturdirte. Usar W solo por el escudo es menos útil que colocarla donde permita abandonar la zona de su R.','Busca Q después de su E, desde un ángulo distinto a su trayectoria. Coloca la linterna hacia atrás para el aliado al que Pyke está presionando.');
  pair('Thresh','Zyra','Tu Q puede castigar su escasa movilidad cuando su E esté gastada. La oportunidad depende también de que la línea de tiro esté libre de plantas.','Las plantas pueden comerse el gancho y su E atraviesa unidades. Entrar con la segunda Q sobre Zyra dentro de plantas y R puede dejarte expuesto al seguimiento.','Retira las plantas que bloqueen el ángulo sin regalar vida y amenaza Q tras una E fallada. Mantén W para sacar al aliado de la zona cuando termine el control.');
  pair('Thresh','Lux','Q puede alcanzar a Lux cuando gaste su propia Q; E te permite separar una amenaza cercana sin tener que reactivar el gancho hacia ella.','La Q de Lux alcanza dos unidades: un único esbirro delante de ti no basta. Si quedas inmovilizado, no puedes contar con activar una linterna para limpiar ese control.','Espera su Q o muévete fuera de su línea de tiro antes de buscar la tuya. No uses la segunda Q para entrar en su E si tu tirador no puede seguir.');
  pair('Thresh','Braum','Puedes buscar Q desde un lateral para que el escudo E de Braum no se interponga entre tu gancho y el carry. Tu E sirve para crear distancia cuando el enemigo acumula marcas sobre tu aliado.','Si el gancho choca con Braum, la segunda Q puede llevarte justo al campeón que quiere un intercambio cercano. No prolongues el duelo de ataques cuando estés cerca de completar su pasiva.','Cambia de ángulo o espera a que termine E. Si Braum ya ha marcado a tu tirador, prioriza separar y ofrecer W antes de buscar una iniciación propia.');
  pair('Thresh','Janna','Q puede forzar una respuesta de Janna, pero no necesitas reactivarla para que el gancho tenga valor. Guardar E te deja una segunda herramienta si ella entra a proteger a su carry.','Su Q puede cortar tu aproximación y su R puede separarte después de la segunda Q. No gastes todas tus opciones suponiendo que el primer gancho garantiza quedarte junto al objetivo.','Amenaza desde un ángulo donde el tornado esté gastado. Si aún conserva R, evita reactivar Q cuando el empuje te dejaría aislado del equipo.');
  pair('Thresh','Senna','Tu Q puede castigar a Senna cuando se detenga para atacar o usar Q, especialmente si ya ha gastado W. E permite mantenerla cerca después de un gancho sin reactivarlo de inmediato.','Un intercambio largo permite que repita Q y aproveche su alcance. Si tu aliado recibe W, no te pegues a él antes de que se active la inmovilización.','Busca una captura corta con continuación de tu tirador. Cuando falle Q, sal del alcance de sus ataques en vez de compensarlo caminando hacia ella.');
  pair('Vi','Master Yi','Tu R ofrece control sobre un objetivo seleccionable y puede frenar su acceso al carry tras reaparecer de Q. La Q de Vi también puede interrumpir su canalización de W si aciertas.','Yi no se puede seleccionar durante Q y su R ignora ralentizaciones. Entrar sin un aliado listo para dañarlo puede permitir que sobreviva y continúe el combate.','Espera la reaparición de Q y utiliza R cuando tu carry pueda pegar. Si empieza W, guarda o prepara Q para cortar esa canalización, en lugar de gastar todo durante su defensa.');
  pair('Rammus','Master Yi','La combinación de provocación E y defensa W obliga a Yi a intercambiar ataques sobre tu postura defensiva. Es una herramienta de protección cuando está a distancia, no una persecución garantizada.','Su E añade daño verdadero y su Q puede evitar el momento en que quieres seleccionarlo. La armadura por sí sola no elimina su daño.','Espera a que termine Q y coordina E con W activa y daño aliado. Si Yi se retira, evita perseguirlo gastando la postura antes de llegar.');
  pair('Morgana','Leona','Tu E protege del control de la entrada de Leona mientras el escudo permanece. Eso puede permitir que tu carry mantenga su posición y responda mientras tú reservas Q para Leona o su tirador.','Escudarte a ti cuando el objetivo real es tu carry deja libre su combo. E no es una limpieza después de recibir el aturdimiento y puede romperse con daño mágico.','Asigna el escudo antes del impacto de la entrada. Cuando Leona haya gastado E, busca Q sobre el objetivo que tu tirador pueda dañar sin exponerse a su seguimiento.');
  pair('Senna','Blitzcrank','Puedes utilizar el alcance de tus ataques y Q para castigarlo después de una Q fallada. W prepara una raíz con retraso si ya no puede retirarse fácilmente.','Tu E no bloquea el gancho. Si te atrapa cuando W aún no ha activado su raíz, esa habilidad no te va a detener el combo de forma instantánea.','Mantén la oleada entre ambos hasta ver Q gastada. Después busca daño desde fuera de su alcance cercano, sin perseguirlo hasta una nueva línea de gancho.');
  pair('Galio','Zed','W puede amenazar con provocación cuando Zed se acerque y E ofrece un derribo si aciertas su posición tras el desplazamiento. Tu papel es preparar una respuesta a su entrada.','El escudo mágico no absorbe su daño físico de Q y E. Tampoco conviene gastar E sobre la primera posición si todavía puede cambiarse con la sombra.','Revisa dónde queda la sombra de W. Conserva control para después de su cambio de posición y no te bases en la protección mágica para aceptar su combo físico.');
  pair('Galio','Fizz','W y E permiten responder a corta distancia después de que Fizz termine su E. Esperar esa caída te da un momento más claro para buscar el control.','Su E lo vuelve inalcanzable: comprometer E o soltar la provocación mientras está arriba puede gastar tu respuesta sin tocarlo.','Juega una primera acción corta y espera su E. Al caer, comprueba si conserva Q antes de gastar tu desplazamiento hacia delante.');
  pair('Malphite','Jax','Tu E reduce la velocidad de ataque de un rival cercano y Q ayuda a ajustar la distancia. Puedes preparar intercambios cortos sin tener que entrar en la ventana de ataques de Jax.','Su E evita ataques básicos y termina con aturdimiento. No gastes toda tu continuación de ataques durante esa defensa ni permanezcas a su lado al terminar.','Recorta el intercambio durante su E y vuelve a buscar Q o E cuando libere el aturdimiento, en lugar de alargar una pelea de ataques.');
  pair('Malphite','Fiora','Q permite presionar sin comprometer la definitiva. Esa amenaza puede ayudarte a conservar R hasta que Fiora haya gastado su parada.','Fiora puede negar tu R con W. Que tu viaje sea imparable no significa que el impacto vaya a atravesar su parada.','Busca que utilice W antes de comprometer R. Si la conserva, mantén una acción corta y evita entregar de golpe toda tu iniciación.');
  pair('Jhin','Caitlyn','W puede prolongar un control aliado sin tener que caminar al alcance de sus ataques. Una cuarta bala preparada ayuda a hacer un intercambio corto y retirarte.','Caitlyn tiene más alcance de ataque y puede retroceder con E. Perseguir tu cuarta bala por una ruta con trampas te puede costar el intercambio.','Busca W sobre una marca preparada después de que gaste E. Usa la cuarta bala cuando ya exista un acceso seguro; no camines hasta ella solo para gastarla.');
  pair('Jhin','Samira','W puede inmovilizarla si ya está marcada y su W ha terminado. Esa preparación te permite responder sin acercarte durante el giro defensivo.','Su W puede destruir los proyectiles que necesitas para completar tu daño y control. Gastar W o un disparo de R dentro de esa defensa puede dejarte sin continuación.','Espera el final de su W y prepara la marca antes de tu W. Evita canalizar R a una distancia desde la que todavía pueda alcanzarte con su entrada.');
  pair("Vel'Koz",'Fizz','Q y E pueden preparar el rayo cuando Fizz ya ha gastado su E y no dispone del mismo momento de inalcanzabilidad para evitar tu respuesta.','Si empieza su E o se acerca con Q mientras canalizas R, puedes perder el rayo y quedar a corta distancia. No uses E por daño antes de que se comprometa.','Mantén E para su caída y empieza R solo desde una posición donde no conserve una entrada clara sobre ti.');
  pair("Vel'Koz",'Yasuo','El rayo de R no es un proyectil como tu Q: su muro no lo bloquea de la misma forma. Aun así, necesitas una posición donde no pueda alcanzarte durante la canalización.','Su W puede negar tu Q y sus desplazamientos a través de la oleada cambian el ángulo del duelo. El rayo atravesando el muro no te protege de que Yasuo llegue hasta ti.','Espera a que gaste muro para buscar Q y prepara una posición alejada de las unidades por las que puede desplazarse antes de R.');

  pair('Thresh','Brand','Q puede castigar a Brand cuando gaste su Q y no tenga esbirros que intercepten tu gancho. Tu W ayuda a preparar una salida del área de daño sin comprometer la segunda Q.','Si recibes E o W de Brand, su Q puede aturdirte. Reactivar tu gancho dentro de su W o junto a tu tirador puede facilitar la continuación de su daño en área.','Busca Q después de que falle su aturdimiento. Si no hay captura clara, retrocede en vez de entrar a recibir su siguiente rotación.');
  pair('Thresh','Lulu','Acertar Q permite forzar protección sobre el objetivo sin tener que acercarte de inmediato. Puedes mantener E para el enemigo que intente aprovechar que tu gancho está gastado.','La segunda Q te lleva al alcance de la polimorfia de W y del derribo de R de Lulu. No cuentes con completar todas tus habilidades después de entrar si conserva ambas.','Espera a que gaste W para una entrada que necesite tu combo completo. Si aciertas Q antes, valora quedarte fuera y permitir que el equipo haga daño sin reactivarla.');
  pair('Thresh','Milio','Q puede forzar a Milio a decidir dónde gasta su defensa y tu E permite separar una amenaza cercana sin depender de la segunda activación del gancho.','Su Q puede apartarte cuando te acerques y R puede limpiar control sobre aliados. Una captura inicial no garantiza mantener al carry inmovilizado durante todo tu combo.','Comprueba que su Q esté gastada antes de la segunda Q. Si conserva R, busca forzar esa respuesta sin gastar también todas las herramientas de tu equipo.');
  pair('Thresh','Seraphine','Q puede castigar su falta de un desplazamiento propio cuando encuentres una trayectoria limpia. E te permite responder si un enemigo intenta seguir el control de Seraphine sobre tu tirador.','La R de Seraphine puede atravesar campeones y extender su recorrido. Estar alineado con tu carry facilita que os alcance a ambos; W no limpia el encanto.','Busca el gancho desde un lateral, sin formar una fila con tus aliados. Si el control ya ha empezado, prepara W hacia una salida para cuando el compañero pueda utilizarla.');
  pair('Thresh',"Vel'Koz",'Q puede castigar a Vel\'Koz mientras canaliza R si tienes una línea de tiro y estás a distancia. No necesitas gastar la segunda Q para intentar cortar esa canalización.','Su E puede levantarte y preparar su combo si reactivas el gancho sobre él. La Q que se divide puede amenazar un ángulo distinto al del proyectil inicial.','Busca Q cuando E esté gastada, desde un ángulo sin esbirros. Si empieza R, decide si puedes interrumpirlo sin caminar por todo el rayo para entrar en alcance.');
  pair('Wukong','Lee Sin','Tu W cambia tu posición y deja un señuelo, lo que permite variar el ángulo tras una primera entrada de E. R puede preparar un derribo cuando tu equipo ya esté a distancia para seguir.','Si Lee Sin ya ha conectado Q, usar W no elimina esa marca. No bases toda tu retirada en desaparecer después de haber recibido el primer impacto.','Busca evitar la primera Q con el cambio de posición y conserva W si E te lleva hacia delante. Si ya estás marcado, prioriza volver hacia aliados antes que alargar el intercambio.');
  pair('Jhin','Jinx','W puede inmovilizar a Jinx sobre una marca previa y preparar una cuarta bala sin caminar hasta ella. Su ausencia de un salto propio hace valiosa una captura con continuación aliada.','Durante tu recarga, Jinx puede continuar atacando. Sus trampas de E pueden cerrar la ruta por la que intentas conseguir la cuarta bala y su pasiva acelera la persecución tras una baja.','Prepara una acción corta con marca y W. Retírate para recargar en vez de convertir la ventaja de una cuarta bala en un duelo prolongado de ataques.');
  pair('Senna','Leona','Puedes presionar con Q cuando Leona haya gastado E y mantener una distancia desde la que tu W prepare una raíz para el siguiente intercambio.','Tu W inmoviliza con retraso: no detiene al instante una entrada de E. Tu camuflaje tampoco sustituye a salir de la trayectoria de su habilidad.','Espera una E fallada para disputar espacio con ataques y Q. Si entra, busca recolocarte con tu compañero antes de intentar alargar el intercambio para curarte.');
  pair('Senna','Morgana','Q permite buscar desgaste y curación mientras amenazas con la raíz retrasada de W sobre un objetivo sin escudo. Puedes obligar a Morgana a elegir a quién protege.','Morgana puede lanzar E después del impacto de tu W y antes de que se active su raíz. No des por garantizado el control solo porque hayas acertado el proyectil.','Busca que su E esté gastada o expire antes de la raíz de W. Mantén un ángulo protegido de su Q y evita juntarte con el compañero sobre el que ya se va a activar una inmovilización.');

  // Cómo se le gana a cada campeón: su debilidad y su momento fuerte. Conocimiento general del juego.
  const COUNTERPLAY = {
    Aatrox: 'Su curación depende de acertar el borde de sus Q: sal del filo exterior y compra antivenenos si se cura demasiado.',
    Ahri: 'Sin su E (Hechizar) es mucho menos peligrosa: cuando la falle, castígala antes de que vuelva.',
    Akali: 'Es débil antes del nivel 6 y depende de su humo: compra un objeto con daño en área o un control que la saque de él.',
    Akshan: 'Es frágil: si le inmovilizas mientras se balancea con su E, cae rápido.',
    Alistar: 'Su combo W+Q necesita llegar hasta ti: mantén distancia y él no tiene daño para presionar solo.',
    Ambessa: 'Encadena desplazamientos con cada habilidad: espera a que los gaste antes de devolverle el golpe.',
    Amumu: 'Su R es su pelea entera: separaos para que no os atrape a varios y castígale cuando la gaste.',
    Anivia: 'Es muy lenta y depende de su huevo: presiónala pronto, antes de que tenga maná y objetos.',
    Annie: 'Avisa cuando tiene el aturdimiento listo (la pasiva brilla): no te acerques con 4 cargas acumuladas.',
    Aphelios: 'No tiene desplazamientos: un control sobre él suele ser una baja.',
    Ashe: 'No tiene escape propio: si llegas hasta ella, no puede huir.',
    'Aurelion Sol': 'Es débil al principio y escala con el tiempo: presiónale pronto y no le dejes farmear tranquilo.',
    Aurora: 'Se mueve mucho con sus habilidades: no la persigas dentro de su R, sal de la zona.',
    Azir: 'Sus soldados son su daño: atácale cuando estén lejos de él o cuando gaste su E para escapar.',
    Bard: 'Su R deja en estasis todo lo que toca, aliados incluidos: no te juntes con tu equipo cuando la vaya a lanzar.',
    "Bel'Veth": 'Escala con los objetivos: no le regales dragones ni heraldos y llévala a peleas cortas.',
    Blitzcrank: 'Sin su gancho no hace nada: mantén un súbdito entre ambos y castígale cuando lo falle.',
    Brand: 'Su daño necesita tiempo: no te quedes dentro de su W y sal en cuanto te queme.',
    Braum: 'Su escudo E solo bloquea por delante: ataca desde un lateral.',
    Briar: 'Con su W no puede parar de atacar: aléjala hacia tu equipo o usa un control para frenarla.',
    Caitlyn: 'Domina la línea con su alcance: juega cerca de tu torre y busca a tu jungla, sola en el cuerpo a cuerpo es débil.',
    Camille: 'Su E necesita una pared: aléjate de ellas y su entrada pierde fuerza.',
    Cassiopeia: 'Su R solo aturde si la miras: date la vuelta cuando la lance.',
    "Cho'Gath": 'Su Q tarda en caer: muévete sin parar y no te quedes quieto farmeando.',
    Corki: 'Su poder llega con el paquete especial: aprovecha mientras no lo tiene.',
    Darius: 'Sin quedarte cerca, no acumula las 5 marcas: intercambia corto y sal.',
    Diana: 'Su entrada depende de acertar la Q: esquívala y su E no se reinicia.',
    Draven: 'Necesita recoger sus hachas: colócate donde caen para que no pueda recogerlas.',
    'Dr. Mundo': 'Se cura muchísimo: compra antivenenos y no le persigas cuando active su R.',
    Ekko: 'Su R le devuelve atrás: guarda tu remate para después de que la use.',
    Elise: 'Es muy fuerte al principio y se apaga luego: aguanta los primeros niveles y la partida será tuya.',
    Evelynn: 'Invisible hasta el nivel 6: compra guardianes de control y no vayas solo.',
    Ezreal: 'Su E es su único escape: cuando la gaste, es vulnerable.',
    Fiddlesticks: 'Su R entra desde la niebla: coloca guardianes en los arbustos cercanos a las peleas.',
    Fiora: 'Su W bloquea tu control: guárdalo hasta que la gaste.',
    Fizz: 'Su E le hace inalcanzable: espera a que caiga antes de usar tus habilidades.',
    Galio: 'Su W le protege del daño mágico: atácale cuando esté en recarga.',
    Gangplank: 'Rompe sus barriles antes que él: así no puede usarlos contra ti.',
    Garen: 'No tiene alcance: si le mantienes lejos, no puede hacerte daño.',
    Gnar: 'Cuando se transforma en Mega Gnar es peligroso: aléjate de las paredes y respeta esa forma.',
    Gragas: 'Su E le lanza hacia ti: guarda tu escape para después de esa entrada.',
    Graves: 'Su daño es a corta distancia: mantenle lejos y su escopeta pierde fuerza.',
    Gwen: 'Su W la protege de quien esté fuera: entra en la niebla para golpearla.',
    Hecarim: 'Su fuerza es la velocidad: un control que le frene antes de llegar arruina su entrada.',
    Heimerdinger: 'Sus torretas son su poder: atácalas desde fuera de su alcance o pide ayuda a tu jungla.',
    Hwei: 'Tiene muchas habilidades pero poca movilidad: si llegas hasta él, le cuesta escapar.',
    Illaoi: 'Su E (Prueba de espíritu) es su pelea: si te saca el espíritu, aléjate de ese cuerpo.',
    Irelia: 'Necesita acumular su pasiva: no le dejes golpear súbditos marcados para entrar.',
    Ivern: 'No tiene daño propio: presiona a su equipo, no a él.',
    'Janna': 'Su Q tarda en cargarse: entra cuando la haya gastado.',
    'Jarvan IV': 'Su combo E+Q le lleva hasta donde clava la bandera: apártate de ella en cuanto la lance.',
    Jax: 'Su E esquiva tus ataques básicos: aléjate durante ella y vuelve después del aturdimiento.',
    Jayce: 'Es fuerte en el desgaste temprano: si aguantas la línea, después se queda atrás.',
    Jhin: 'Tras la cuarta bala recarga: ese es tu momento para intercambiar.',
    Jinx: 'Sin su pasiva no tiene escape: entra antes de que consiga una baja.',
    "Kai'Sa": 'Su R necesita una marca de plasma: evita recibir su daño antes de que pueda saltar.',
    Kalista: 'Cuando bloquea su lanza en ti queda muy expuesta: castígala tras su salto.',
    Karma: 'Es fuerte en el desgaste temprano: no te quedes delante de sus súbditos para que no te alcance.',
    Karthus: 'Su R llega a todo el mapa: no te quedes con poca vida esperando la pelea.',
    Kassadin: 'Es muy débil antes del nivel 6: presiónale en los primeros niveles y no le dejes farmear.',
    Katarina: 'Su R se corta con cualquier control: guárdalo para cuando la lance.',
    Kayle: 'Es muy débil hasta el nivel 11: presiónala todo lo que puedas al principio.',
    Kayn: 'Su transformación cambia la partida: no le regales peleas antes de que la tenga.',
    Kennen: 'Su R necesita entrar en tu equipo: separaos para que no aturda a varios.',
    "Kha'Zix": 'Es muy fuerte con objetivos aislados: quédate cerca de tu equipo.',
    Kindred: 'Escala con las marcas: no le regales los campamentos marcados.',
    Kled: 'Sin su montura es débil: aprovecha cuando la pierda.',
    "Kog'Maw": 'No tiene escape: si llegas hasta él, cae rápido.',
    "K'Sante": 'Su R le hace mucho más peligroso: no luches cerca de paredes cuando la tenga.',
    LeBlanc: 'Su W la lleva y la trae: espera a que vuelva para golpearla.',
    'Lee Sin': 'Es fuerte al principio y se apaga: aguanta los primeros niveles y la partida será tuya.',
    Leona: 'Sin su E no puede entrar: castígala cuando la falle.',
    Lillia: 'Su R duerme a quien tenga marca: no recibas sus habilidades antes de la pelea.',
    Lissandra: 'Su R puede salvarla: no gastes todo tu daño mientras esté congelada.',
    Lucian: 'Es fuerte en la línea pero se apaga después: aguanta y escala.',
    Lulu: 'Su R protege al aliado que quiere salvar: espera a que la gaste para rematar.',
    Lux: 'Su Q es su control: muévete de lado y no te quedes detrás de un solo súbdito.',
    Malphite: 'Su R es imparable: separa a tus aliados para que no atrape a varios.',
    Malzahar: 'Su pasiva le protege del primer golpe: rómpela con una habilidad pequeña antes de tu combo.',
    Maokai: 'Sus brotes castigan a quien entra en los arbustos: no te escondas en ellos.',
    'Master Yi': 'Su Q le hace inalcanzable: guarda tu control para cuando reaparezca.',
    Mel: 'Su W devuelve tus proyectiles: no lances tus habilidades principales cuando la tenga disponible.',
    Milio: 'Su R limpia el control de su equipo: lánzalo después de que la use.',
    'Miss Fortune': 'Su R es canalizada: córtala con un control y su daño desaparece.',
    Mordekaiser: 'Su R te aísla con él: guarda tu escape y tu curación para ese momento.',
    Morgana: 'Su escudo negro bloquea el control: lánzalo cuando lo haya gastado.',
    Naafiri: 'Sus perros son parte de su daño: lucha con súbditos de por medio.',
    Nami: 'Su Q es su control: esquívala y su línea pierde presión.',
    Nasus: 'Escala con su Q: niégale súbditos y presiónale pronto.',
    Nautilus: 'Sin su gancho tiene poca entrada: castígale cuando lo falle.',
    Neeko: 'Puede disfrazarse de un aliado: no te fíes de un súbdito o un compañero raro.',
    Nidalee: 'Sus lanzas hacen más daño cuanto más lejos: acércate o ponte detrás de súbditos.',
    Nilah: 'Necesita estar cerca: mantenla lejos y sufre.',
    Nocturne: 'Su R apaga la visión de tu equipo: agrupaos cuando la use.',
    'Nunu & Willump': 'Su R necesita canalizarse: sal de la zona o córtala.',
    Olaf: 'Con su R activa no le puedes controlar: aléjate y no le pelees de frente.',
    Orianna: 'Su daño sale de la bola: no te acerques a ella.',
    Ornn: 'Su R necesita una segunda activación: sal del camino del carnero.',
    Pantheon: 'Es muy fuerte al principio y se apaga: aguanta los primeros niveles.',
    Poppy: 'Su W corta tus desplazamientos: no saltes hacia ella cuando la tenga.',
    Pyke: 'Se cura al esconderse: termina el intercambio antes de que pueda hacerlo.',
    Qiyana: 'Su R necesita una pared: no luches junto a paredes ni ríos.',
    Quinn: 'Es muy frágil: si la atrapas, cae rápido.',
    Rakan: 'Su entrada depende de su W: esquívala y queda expuesto.',
    Rammus: 'Su W devuelve el daño de tus ataques: espera a que termine.',
    "Rek'Sai": 'Su entrada sale de los túneles: destrúyelos cuando los veas.',
    Rell: 'Su entrada es muy predecible: sepárate de tus aliados cuando se acerque.',
    'Renata Glasc': 'Su W revive a su aliado unos segundos: no gastes tu escape hasta que caiga del todo.',
    Renekton: 'Es muy fuerte al principio: aguanta los primeros niveles y después se queda atrás.',
    Rengar: 'Salta desde los arbustos: no te quedes cerca de ellos.',
    Riven: 'Encadena sus Q: espera a que las gaste antes de intercambiar.',
    Rumble: 'Su calor le hace más fuerte: castígale cuando se sobrecaliente.',
    Ryze: 'Es débil al principio y escala: presiónale pronto.',
    Samira: 'Su W destruye proyectiles: espera a que termine.',
    Sejuani: 'Su entrada necesita llegar: sepárate cuando se acerque.',
    Senna: 'Es frágil y lenta: si llegas hasta ella, cae rápido.',
    Seraphine: 'Su R crece con cada campeón que alcanza: sepárate de tu equipo.',
    Sett: 'Su W acumula daño recibido: no le golpees justo antes de que lo suelte.',
    Shaco: 'Sus cajas castigan a quien entra en los arbustos: compra guardianes de control.',
    Shen: 'Su R viaja hasta un aliado: avisa a tu equipo cuando la lance.',
    Shyvana: 'Escala con el tiempo: presiónala pronto en la jungla.',
    Singed: 'No le persigas: es lo que quiere.',
    Sion: 'Su R es imparable pero lenta: apártate de su camino.',
    Sivir: 'Su E bloquea una habilidad: lánzale primero una pequeña.',
    Skarner: 'Su R te arrastra: no estés solo cerca de él.',
    Smolder: 'Es débil al principio y escala: presiónale pronto.',
    Sona: 'Es muy frágil: si la atrapas, cae rápido.',
    Soraka: 'Su curación depende de ella: si la presionas, su equipo se queda sin curaciones.',
    Swain: 'Su R le cura mientras está cerca: aléjate de él.',
    Sylas: 'Roba tu definitiva: piensa en qué le estás dando.',
    Syndra: 'Su R hace más daño con más esferas: no luches cerca de sus esferas.',
    'Tahm Kench': 'Su W puede salvar a un aliado: espera a que la use.',
    Taliyah: 'Su E castiga a quien se desplaza por encima: no saltes sobre ella.',
    Talon: 'Es muy fuerte desde el nivel 6: no te quedes solo con poca vida.',
    Taric: 'Su R hace invulnerable a su equipo: espera a que termine.',
    Teemo: 'Su ceguera bloquea tus ataques básicos: usa habilidades contra él.',
    Thresh: 'Sin su gancho tiene poca amenaza: castígale cuando lo falle.',
    Tristana: 'Su W es su escape: cuando la gaste, es vulnerable.',
    Trundle: 'Su R te roba resistencias: no le pelees largo.',
    Tryndamere: 'Su R le hace inmortal unos segundos: aléjate y vuelve después.',
    'Twisted Fate': 'Su R le permite llegar a cualquier línea: avisa a tu equipo cuando desaparezca.',
    Twitch: 'Entra invisible: coloca guardianes de control cerca de su ruta.',
    Udyr: 'Es muy fuerte en peleas largas: mantén distancia.',
    Urgot: 'Su R remata a quien tenga poca vida: no te quedes con menos del 25%.',
    Varus: 'Sus marcas hacen daño al acumularse: no te quedes recibiendo su desgaste.',
    Vayne: 'Es débil al principio y escala: presiónala pronto.',
    Veigar: 'Escala sin límite acumulando poder con su Q: niégale súbditos golpeándole cuando vaya a usarla y cierra la partida pronto.',
    "Vel'Koz": 'Es muy frágil y lento: si llegas hasta él, cae rápido.',
    Vex: 'Castiga los desplazamientos: no saltes hacia ella cuando tenga su pasiva lista.',
    Vi: 'Su R te elige y no la puedes esquivar: guarda tu escape para después.',
    Viego: 'Se apodera de los campeones caídos: no le regales bajas en peleas.',
    Viktor: 'Escala con sus mejoras: presiónale pronto.',
    Vladimir: 'Su W le hace inalcanzable: espera a que termine.',
    Volibear: 'Su R desactiva torres: no te sientas seguro bajo la tuya.',
    Warwick: 'Se cura cuando tienes poca vida: no te quedes cerca de él herido.',
    Wukong: 'Su W deja un clon: no gastes tus habilidades en él.',
    Xayah: 'Sus plumas vuelven hacia ella: no te quedes en su camino.',
    Xerath: 'Es muy frágil y lento: si llegas hasta él, cae rápido.',
    'Xin Zhao': 'Su R bloquea el daño desde fuera: entra en el círculo o espera.',
    Yasuo: 'Su muro bloquea proyectiles: lanza tus habilidades cuando lo haya gastado.',
    Yone: 'Su E le devuelve atrás: no le persigas cuando vuelva.',
    Yorick: 'Sus tumbas y la doncella presionan sin él: limpia a sus esbirros.',
    Yuumi: 'Se esconde en su aliado: presiona a quien la lleva.',
    Zac: 'Su E le lanza desde lejos: aléjate de los arbustos y vigila su salto.',
    Zed: 'Sus sombras cambian su posición: espera a que las gaste antes de tu control.',
    Zeri: 'Es débil al principio: presiónala antes de que tenga objetos.',
    Ziggs: 'Su desgaste es muy largo: no te quedes recibiendo sus bombas.',
    Zilean: 'Su R revive a un aliado: no gastes todo en el que la tiene.',
    Zoe: 'Su E duerme: no te quedes detrás de un súbdito sin moverte.',
    Zyra: 'Sus plantas son su daño: no luches donde ha sembrado.'
  };
  function spell(name, key) { return data && data.champions[name] && data.champions[name].spells.find(s => s.key === key); }
  function ability(name, key) { const s = spell(name,key); return s ? `${key} (${s.name})` : key; }
  // Perfil básico del catálogo de Riot: clase principal y si ataca a distancia.
  function profile(catalog, name) {
    const c = catalog && catalog[name];
    return c ? { cls: c.tags[0], tags: c.tags, ranged: c.range >= 300 } : null;
  }
  function laneDynamic(name, enemy, P, F, key, role) {
    if (!P || !F || role === 'Jungla') return null; // en jungla no hay duelo de línea
    if (role === 'Support') return P.ranged === F.ranged
      ? `En bot, el duelo de supports lo decide quién controla el espacio delante de su tirador. Ocupa ese espacio cuando ${enemy} gaste ${key}.`
      : P.ranged ? `Tienes más alcance que ${enemy}: hostígale cada vez que se acerque y protege a tu tirador cuando intente entrar.`
      : `${enemy} tiene más alcance que tú: no os expongáis a su desgaste. Espera a que falle o gaste ${key} para entrar con tu tirador.`;
    if (!P.ranged && F.ranged) return `${enemy} te supera en alcance y te hará daño desde lejos. No intentes ganarle a base de intercambios largos: farmea con seguridad y acércate solo cuando falle o gaste ${key}.`;
    if (P.ranged && !F.ranged) return `Tienes ventaja de alcance: ${enemy} necesita acercarse para hacerte daño. Castígale cada vez que vaya a farmear y retrocede cuando intente entrar.`;
    if (P.ranged && F.ranged) return `Duelo a distancia: suele ganarlo quien acierta antes sus habilidades. Usa tus súbditos para bloquear sus proyectiles y responde justo cuando falle una.`;
    return `Duelo cuerpo a cuerpo: los intercambios los gana quien usa mejor sus habilidades. Entra cuando ${enemy} acabe de gastar ${key} y sal antes de quedarte sin las tuyas.`;
  }
  function earlyPlan(enemy, P, F, role) {
    if (!P || !F || role === 'Jungla') return null;
    if (role === 'Support') return `Niveles 1 a 3: colócate a la altura de tu tirador, nunca por delante de los súbditos, y coordina el primer intercambio con él cuando ${enemy} se adelante.`;
    if (!P.ranged && F.ranged) return 'Niveles 1 a 3: prioriza farmear sin perder vida. Si te castiga demasiado, deja que la oleada se acerque a tu torre para jugar donde él no puede presionarte.';
    if (P.ranged && !F.ranged) return `Niveles 1 a 3: golpea a ${enemy} con ataques básicos cada vez que se acerque a un súbdito y mantén la distancia; no le dejes llegar a ti gratis.`;
    if (P.ranged && F.ranged) return 'Niveles 1 a 3: colócate detrás de tus súbditos para que bloqueen sus habilidades y castígale justo después de que falle una.';
    return `Niveles 1 a 3: intercambia cuando ${enemy} vaya a golpear a un súbdito y retírate antes de que pueda devolverte el golpe completo.`;
  }

  function explain(name, enemy, role, catalog) {
    const you = data && data.champions[name], foe = data && data.champions[enemy];
    if (!you || !foe) return { reviewed: false, reasons: ['No hay habilidades verificadas para este emparejamiento.'], warnings: ['Consulta las habilidades de ambos campeones antes de basar una decisión en este plan.'], plan: [], sources: [] };
    const own = OWN[name];
    const control = you.spells.find(s => s.types.includes('control'));
    const ownKey = own ? own[0] : control ? control.key : 'Q';
    const threat = THREATS[enemy];
    const keySpell = foe.spells.find(s => s.types.includes('untargetable')) || foe.spells.find(s => s.types.includes('invulnerable')) || foe.spells.find(s => s.types.includes('control')) || foe.spells.find(s => s.types.includes('movement')) || foe.spells[3];
    const enemyKey = threat ? threat[0] : keySpell.key;
    const reviewed = PAIRS[name+'|'+enemy];
    const mine = ability(name, ownKey), key = ability(enemy, enemyKey);
    const ownPlan = own ? own[1] : `Guárdala para responder a ${enemy} en lugar de gastarla solo para hacer daño: si la usas mal, te quedas sin defensa durante su recarga.`;
    const tool = `Tu herramienta clave es ${mine}. ${ownPlan}`;
    const types = (threat ? (foe.spells.find(s => s.key === enemyKey) || keySpell) : keySpell).types;
    const risk = threat ? threat[1]
      : types.includes('untargetable') ? `Durante ${key} no puedes alcanzar a ${enemy}. No lances tu habilidad clave mientras la esté usando: espera a que termine.`
      : types.includes('invulnerable') ? `${key} le hace inmune al daño durante un momento. Aprovecha ese tiempo para colocarte, no para gastar habilidades.`
      : types.includes('control') ? `${key} puede inmovilizarte o frenarte, y desde ahí ${enemy} encadena todo su daño. Mientras la tenga disponible, no te quedes a su alcance.`
      : types.includes('movement') ? `${key} le permite entrar o escapar rápidamente. No le persigas ni te acerques demasiado mientras la tenga disponible.`
      : `Vigila ${key}: es la habilidad con la que ${enemy} decide sus intercambios.`;
    const P = profile(catalog, name), F = profile(catalog, enemy);
    const extra = !F ? null
      : F.cls === 'Assassin' ? `${enemy} es un asesino: desde el nivel 6 puede matarte con una sola rotación si te encuentra con poca vida. Respeta su ${ability(enemy, 'R')} y no te quedes aislado.`
      : F.cls === 'Tank' ? `${enemy} es muy resistente: no esperes ganarle un intercambio largo solo con daño. Juega por el farmeo y por los objetivos del mapa.`
      : F.cls === 'Mage' && F.ranged && P && !P.ranged ? `${enemy} hace daño mágico desde lejos: si pierdes mucha vida en línea, compra resistencia mágica pronto.`
      : null;
    // Para qué sirve tu definitiva, según lo que hace de verdad.
    const ultSpell = you.spells.find(s => s.key === 'R'), ult = ability(name, 'R'), ut = ultSpell ? ultSpell.types : [];
    const ultLine = ut.includes('control') ? `${ult} es tu mejor control: guárdala para cuando ${enemy} gaste ${key} y no pueda responder.`
      : ut.includes('movement') ? `${ult} te da movilidad: úsala para entrar cuando ${enemy} no tenga ${key}, o guárdala como escape.`
      : ut.includes('heal') || ut.includes('shield') ? `${ult} te mantiene con vida: actívala cuando ${enemy} se comprometa con todo su daño, no antes.`
      : ut.includes('stealth') || ut.includes('untargetable') || ut.includes('invulnerable') ? `${ult} te saca del combate un momento: úsala para esquivar el golpe fuerte de ${enemy}.`
      : `${ult} es daño puro: úsala para rematar a ${enemy} cuando ya le hayas bajado la vida, no para empezar el intercambio.`;
    const howToBeat = COUNTERPLAY[enemy] || null; // la sección ya se titula «Lo que debes vigilar de X»
    const generic = {
      reasons: [laneDynamic(name, enemy, P, F, key, role), tool].filter(Boolean),
      warnings: [risk, howToBeat, extra].filter(Boolean),
      plan: [earlyPlan(enemy, P, F, role),
        threat ? threat[2] : types.length
          ? `Tu momento: cuando ${enemy} gaste ${key}, tienes unos segundos sin esa amenaza. Aprovéchalos para acercarte y hacer tu intercambio.`
          : `Cuenta sus tiempos de recarga: intercambia justo después de que ${enemy} use sus habilidades y retírate cuando las recupere.`,
        `Desde el nivel 6: ${ultLine}`].filter(Boolean)
    };
    return {
      reviewed: !!reviewed,
      reasons: reviewed ? [reviewed.reason] : generic.reasons,
      warnings: reviewed ? [reviewed.warning, howToBeat].filter(Boolean) : generic.warnings,
      plan: reviewed ? [reviewed.window, ownPlan] : generic.plan,
      skills: [{ champion: name, key: ownKey, name: ability(name,ownKey) }, { champion: enemy, key: enemyKey, name: ability(enemy,enemyKey) }],
      sources: [{ name, url: you.source }, { name: enemy, url: foe.source }],
      checked: data.checked, version: data.version
    };
  }
  return { explain, ability, reviewedPairs: Object.keys(PAIRS).length };
});
