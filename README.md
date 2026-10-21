# Portfolio — Nicolás Echave

Sitio estático preparado para GitHub Pages.

## Publicarlo en GitHub Pages

1. Creá en GitHub un repositorio llamado `portfolio` (o `tu-usuario.github.io` si querés que sea tu página principal).
2. Subí el contenido de esta carpeta al repositorio.
3. En GitHub, entrá a **Settings → Pages**.
4. En **Build and deployment**, elegí **Deploy from a branch**, seleccioná `main` y la carpeta `/(root)`.
5. Guardá. GitHub te mostrará la dirección pública al terminar el despliegue.

Antes de publicar, verificá que los enlaces de LinkedIn y GitHub en `index.html` apunten a tus perfiles reales.

## Datos de proyectos

Los proyectos fuente están en `projects/<carpeta>/description.md`. Cada archivo usa YAML front matter para los datos estructurados y Markdown para el texto del caso de estudio. El orden se define en `projects/projects.yaml`.

Después de editar un proyecto, regenerá los datos que consumirá el sitio (`projects.json` y `projects-data.js`):

```powershell
node scripts/build-projects-data.mjs
```

## Contenido bilingüe y galerías

Los campos `title_es`, `summary_es`, `engagement_es` y, cuando corresponda, `company_es` y `tags_es` contienen las traducciones. El cuerpo comienza en inglés; `<!-- lang:es -->` separa el detalle en español. El detalle técnico admite títulos `##` y párrafos de texto, y se muestra en un desplegable por proyecto.

Los epígrafes se definen en `captions.json` dentro de cada proyecto: cada ruta relativa a la galería contiene un objeto con `en` y `es`. Los proyectos en desarrollo pueden omitir `cover` y `gallery`; se presentan sin imágenes. La selección de idioma se conserva en los enlaces internos y, si está disponible, en el almacenamiento local del navegador.
