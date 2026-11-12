# Colección propia de campeones

Una ilustración original generada en estilo de animación de papel recortado South Park
por campeón, en su apariencia base. Cada pareja representa el mismo personaje:

- `portraits/<RiotID>.svg`: retrato de cuerpo completo para portada.
- `faces/<RiotID>.svg`: recorte facial cuadrado de 192 × 192 para miniaturas.
- `manifest.json`: índice de todos los nombres, IDs y archivos.
- `metadata/<RiotID>.json`: fecha, estilo y encuadre aplicado al recorte.

El repositorio se puede explorar desde `../../campeones.html`. La portada calcula
el campeón destacado usando las partidas actuales y busca su retrato por nombre.
Las tablas, el historial, los perfiles y el selector de emparejamientos utilizan
las caras de esta misma colección. Ninguna imagen de campeón necesita el CDN de Riot.

## Producción

Las ilustraciones se han generado individualmente con el generador de imágenes
integrado. No son filtros ni retoques de las miniaturas oficiales de Riot.
El catálogo de nombres e IDs procede de Riot Data Dragon 16.22.1.

Prompt base: «Un retrato de cuerpo completo de [campeón], [título], de League of
Legends en su apariencia por defecto, como personaje de South Park. Animación de
papel recortado, contornos negros gruesos, colores planos, cabeza grande y redonda,
ojos blancos ovalados, cuerpo pequeño, manos de manopla. Conservar especie,
rasgos, pelo, atuendo y colores reconocibles. Fondo azul marino liso, formato
vertical 2:3. Centrar la cabeza en x=50%, y=28% para obtener el recorte facial.
Sin texto, marcas de agua, bordes ni otros personajes».

Para exportar un nuevo original:

```sh
python tools/prepare_champion_asset.py --source /ruta/original.png --id Jinx --name Jinx
python tools/build_champion_manifest.py
```

El constructor del índice rechaza una colección incompleta. Para un campeón nuevo,
actualizar también `draft-catalog.js`, generar su retrato y reconstruir el índice.
`unknown.svg` es una reserva visible para nombres nuevos o archivos inaccesibles;
no se utiliza para suplir los campeones de la colección completa.

## Formato de distribución

Cada SVG es un archivo de imagen autónomo que contiene el WebP generado, incrustado
sin conexiones externas. No se sustituye la ilustración por un dibujo vectorial.
El original WebP se puede recuperar decodificando el atributo data:image/webp;base64.
Los WebP intermedios no se versionan porque sus bytes ya están íntegros en los SVG.
Los recortes faciales se centran en los ojos grandes de la ilustración; cuando no
se identifica una pareja fiable, se aplica el encuadre de reserva registrado en metadata.
