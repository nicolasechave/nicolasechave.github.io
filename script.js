const translations = {
  en: { navAbout:'About me', navProjects:'Projects', navContact:'Contact <span>↗</span>', heroEyebrow:'Independent engineering consultant', heroRole:'Hardware Design & Development', heroTitle:'Electronics Engineer', heroSkills:'Analog & Digital Hardware · RF & SDR · PCB Design · Embedded Systems', viewProjects:'View Projects <span>↗</span>', aboutEyebrow:'01 / About', aboutHeading:'Engineering with a product mindset.', aboutP1:'I am an Electronics Engineer with more than 18 years of experience developing commercial electronic products for professional audio, embedded systems and RF applications.', aboutP2:'I currently work as an independent engineering consultant, developing an RF front-end and a new VHF direction-finding antenna control board. My work spans system architecture, circuit design and PCB layout through embedded software and manufacturing support.', aboutP3:'Until August 2026, I led Engineering & R&D at Solidyne, combining hands-on hardware development with multidisciplinary team leadership. I bring that product development experience to RF, embedded systems and professional audio projects.', approachEyebrow:'02 / Engineering approach', approachHeading:'How I approach<br />complex products.', systemTitle:'System Thinking', systemText:'Designing complete systems instead of isolated components.', handsTitle:'Hands-on Engineering', handsText:'From architecture to implementation.', reliabilityTitle:'Long-term Reliability', reliabilityText:'Design for manufacturing, maintenance and evolution.', learningTitle:'Continuous Learning', learningText:'Always exploring new technologies and better solutions.', techEyebrow:'03 / Technologies', embedded:'Embedded Systems', hardware:'Hardware', software:'Software', tools:'Tools', contactEyebrow:'04 / Contact', contactHeading:"Let's build<br />something real.", linkedin:'LinkedIn <span>↗</span>', github:'GitHub <span>↗</span>', projectsEyebrow:'Selected work', projectsHeading:'Selected engineering<br /><em>projects.</em>', loadingProjects:'Loading projects…', projectsError:'Projects could not be loaded. Please try again later.', viewGallery:'View gallery <span>↗</span>', visitWebsite:'Visit website <span>↗</span>', gallery:'Project gallery', closeGallery:'Close gallery', backGallery:'Back to gallery', openImage:'Open image {number} in full size', imageAlt:'Image {number} from the {project} project', technicalDetails:'Technical details', technologies:'Technologies', inDevelopment:'In development', projectImage:'Project image' },
  es: { navAbout:'Sobre mí', navProjects:'Proyectos', navContact:'Contacto <span>↗</span>', heroEyebrow:'Consultor independiente de ingeniería', heroRole:'Diseño y desarrollo de hardware', heroTitle:'Ingeniero electrónico', heroSkills:'Hardware analógico y digital · RF y SDR · Diseño de PCB · Sistemas embebidos', viewProjects:'Ver proyectos <span>↗</span>', aboutEyebrow:'01 / Sobre mí', aboutHeading:'Ingeniería con visión de producto.', aboutP1:'Soy Ingeniero Electrónico con más de 18 años de experiencia desarrollando productos electrónicos comerciales para audio profesional, sistemas embebidos y aplicaciones de RF.', aboutP2:'Actualmente trabajo como consultor independiente de ingeniería, desarrollando un frontend de RF y una nueva placa de control de antena para radiogoniometría VHF. Mi trabajo abarca arquitectura de sistemas, circuitos, diseño de PCB, software embebido y soporte de fabricación.', aboutP3:'Hasta agosto de 2026 estuve a cargo de Ingeniería e I+D en Solidyne, combinando desarrollo práctico de hardware con liderazgo de equipos multidisciplinarios. Aplico esa experiencia de desarrollo de productos a proyectos de RF, sistemas embebidos y audio profesional.', approachEyebrow:'02 / Enfoque de ingeniería', approachHeading:'Cómo abordo<br />productos complejos.', systemTitle:'Pensamiento sistémico', systemText:'Diseño sistemas completos en lugar de componentes aislados.', handsTitle:'Ingeniería práctica', handsText:'Desde la arquitectura hasta la implementación.', reliabilityTitle:'Confiabilidad a largo plazo', reliabilityText:'Diseño para fabricar, mantener y evolucionar.', learningTitle:'Aprendizaje continuo', learningText:'Siempre explorando nuevas tecnologías y mejores soluciones.', techEyebrow:'03 / Tecnologías', embedded:'Sistemas embebidos', hardware:'Hardware', software:'Software', tools:'Herramientas', contactEyebrow:'04 / Contacto', contactHeading:'Construyamos<br />algo real.', linkedin:'LinkedIn <span>↗</span>', github:'GitHub <span>↗</span>', projectsEyebrow:'Proyectos seleccionados', projectsHeading:'Proyectos de<br /><em>ingeniería.</em>', loadingProjects:'Cargando proyectos…', projectsError:'No se pudieron cargar los proyectos. Intentá nuevamente más tarde.', viewGallery:'Ver galería <span>↗</span>', visitWebsite:'Visitar sitio <span>↗</span>', gallery:'Galería de proyecto', closeGallery:'Cerrar galería', backGallery:'Volver a la galería', openImage:'Abrir imagen {number} en tamaño completo', imageAlt:'Imagen {number} del proyecto {project}', technicalDetails:'Detalle técnico', technologies:'Tecnologías', inDevelopment:'En desarrollo', projectImage:'Imagen del proyecto' }
};

let language = 'en';
try { language = localStorage.getItem('portfolio-language') === 'es' ? 'es' : 'en'; } catch {}
const requestedLanguage = new URLSearchParams(window.location.search).get('lang');
if (requestedLanguage === 'en' || requestedLanguage === 'es') language = requestedLanguage;
let projectData = [];
const projectList = document.querySelector('#project-list');
const dialog = document.querySelector('.gallery');
const textElements = document.querySelectorAll('[data-i18n]');
const escapeHtml = value => String(value).replace(/[&<>'"]/g, character => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' })[character]);

function setLanguage(nextLanguage) {
  language = nextLanguage === 'es' ? 'es' : 'en';
  try { localStorage.setItem('portfolio-language', language); } catch {}
  const pageUrl = new URL(window.location.href);
  pageUrl.searchParams.set('lang', language);
  history.replaceState(null, '', pageUrl);
  document.querySelectorAll('a[href]').forEach(link => {
    const destination = new URL(link.getAttribute('href'), window.location.href);
    if (destination.origin === window.location.origin && /(?:\/|\.html)$/.test(destination.pathname)) {
      destination.searchParams.set('lang', language);
      link.setAttribute('href', `${destination.pathname}${destination.search}${destination.hash}`);
    }
  });
  const copy = translations[language];
  document.documentElement.lang = language;
  textElements.forEach(element => { if (copy[element.dataset.i18n]) element.innerHTML = copy[element.dataset.i18n]; });
  document.querySelectorAll('[data-language]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === language)));
  if (dialog) { dialog.setAttribute('aria-label', copy.gallery); document.querySelector('.gallery-close').setAttribute('aria-label', copy.closeGallery); document.querySelector('.preview-close').setAttribute('aria-label', copy.backGallery); }
  if (projectData.length) renderProjects();
}

const localized = (project, key) => language === 'es' && project[`${key}_es`] ? project[`${key}_es`] : project[key];

// Project bodies support headings and plain paragraphs; escape all source text.
function renderDetails(markdown) {
  return markdown.split(/\n\s*\n/).filter(Boolean).map(block => {
    const heading = block.match(/^## (.+)$/);
    return heading ? `<h3>${escapeHtml(heading[1])}</h3>` : `<p>${escapeHtml(block).replaceAll('\n', ' ')}</p>`;
  }).join('');
}

function renderProjects() {
  const copy = translations[language];
  projectList.innerHTML = projectData.map(project => {
    const title = localized(project, 'title');
    const tags = localized(project, 'tags').map(tag => `<li>${escapeHtml(tag)}</li>`).join('');
    const galleryButton = project.gallery.length ? `<button class="text-link open-gallery" type="button" data-project-id="${escapeHtml(project.id)}">${copy.viewGallery}</button>` : '';
    const websites = project.links.map((link, index) => {
      const label = index === 0 ? copy.visitWebsite : (new URL(link).hostname.startsWith('docs.') ? (language === 'es' ? 'Documentación ↗' : 'Documentation ↗') : `${new URL(link).hostname} ↗`);
      return `<a class="text-link" href="${escapeHtml(link)}" target="_blank" rel="noreferrer">${index === 0 ? label : escapeHtml(label)}</a>`;
    }).join('');
    const company = [localized(project, 'company'), project.country].filter(Boolean).join(' · ');
    const markdown = language === 'es' ? project.detailsMarkdownEs : project.detailsMarkdown;
    const visual = project.cover ? `<img src="${escapeHtml(project.cover)}" alt="${escapeHtml(title)}" loading="lazy">` : `<div class="project-in-progress"><span>VHF</span><p>${escapeHtml(copy.inDevelopment)}</p></div>`;
    return `<article class="project ${project.order % 2 === 0 ? 'reverse' : ''}" id="${escapeHtml(project.id)}"><div class="project-image${project.cover ? '' : ' no-cover'}">${visual}<span class="image-number">${String(project.order).padStart(2, '0')}</span></div><div class="project-info"><p class="project-type">${escapeHtml(company)}</p><h2>${escapeHtml(title)}</h2><p class="project-description">${escapeHtml(localized(project, 'summary'))}</p><p class="project-meta">${escapeHtml(localized(project, 'engagement'))}</p><ul class="tags">${tags}</ul><div class="project-actions">${galleryButton}${websites}</div><details class="project-details"><summary>${escapeHtml(copy.technicalDetails)}</summary><div class="project-details-body">${renderDetails(markdown)}<h3>${escapeHtml(copy.technologies)}</h3><p>${escapeHtml(project.technologies.join(' · '))}</p></div></details></div></article>`;
  }).join('');
}

function openGallery(project) {
  const copy = translations[language];
  const galleryContent = document.querySelector('.gallery-content');
  galleryContent.innerHTML = project.gallery.map((source, index) => {
    const caption = project.captions?.[source]?.[language] || `${localized(project, 'title')} · ${copy.projectImage} ${index + 1}`;
    return `<button class="gallery-item" type="button" data-source="${escapeHtml(source)}" data-index="${index + 1}" aria-label="${escapeHtml(copy.openImage.replace('{number}', index + 1))}: ${escapeHtml(caption)}"><img src="${escapeHtml(source)}" alt="${escapeHtml(caption)}" loading="lazy"><span class="gallery-caption">${escapeHtml(caption)}</span></button>`;
  }).join('');
  document.querySelector('.image-preview').hidden = true;
  dialog.showModal();
}

function loadProjects() {
  if (window.PORTFOLIO_PROJECTS?.projects) {
    projectData = window.PORTFOLIO_PROJECTS.projects;
    renderProjects();
    return;
  }
  projectList.innerHTML = `<p class="projects-status">${translations[language].projectsError}</p>`;
}

document.querySelectorAll('[data-language]').forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.language)));
document.getElementById('year').textContent = new Date().getFullYear();
setLanguage(language);
if (projectList) loadProjects();

if (dialog) {
  const galleryContent = document.querySelector('.gallery-content'); const preview = document.querySelector('.image-preview'); const previewImage = preview.querySelector('img'); const previewCounter = preview.querySelector('.preview-counter');
  projectList.addEventListener('click', event => { const button = event.target.closest('.open-gallery'); if (!button) return; const project = projectData.find(item => item.id === button.dataset.projectId); if (project) openGallery(project); });
  galleryContent.addEventListener('click', event => { const item = event.target.closest('.gallery-item'); if (!item) return; previewImage.src = item.dataset.source; previewImage.alt = item.querySelector('img').alt; previewCounter.textContent = `${item.dataset.index} / ${galleryContent.children.length} · ${previewImage.alt}`; preview.hidden = false; });
  document.querySelector('.preview-close').addEventListener('click', () => { preview.hidden = true; }); document.querySelector('.gallery-close').addEventListener('click', () => dialog.close()); dialog.addEventListener('cancel', event => { if (!preview.hidden) { event.preventDefault(); preview.hidden = true; } }); dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
}
