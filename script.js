const translations = {
  en: { navAbout:'About me', navProjects:'Projects', navContact:'Contact <span>↗</span>', heroEyebrow:'Research & development', heroRole:'Research & Development ', heroTitle:'Electronics Engineer', heroSkills:'Embedded Systems · Hardware Architecture · DSP · Professional Audio', viewProjects:'View Projects <span>↗</span>', aboutEyebrow:'01 / About', aboutHeading:'Engineering with a product mindset.', aboutP1:'I am an Electronics Engineer with more than 18 years of experience developing commercial electronic products for professional audio, embedded systems and RF applications.', aboutP2:'My work spans the complete product lifecycle, from system architecture and hardware design to embedded software, Linux applications and manufacturing support.', aboutP3:'I enjoy solving complex engineering problems by combining different disciplines into reliable, maintainable and production-ready solutions.', approachEyebrow:'02 / Engineering approach', approachHeading:'How I approach<br />complex products.', systemTitle:'System Thinking', systemText:'Designing complete systems instead of isolated components.', handsTitle:'Hands-on Engineering', handsText:'From architecture to implementation.', reliabilityTitle:'Long-term Reliability', reliabilityText:'Design for manufacturing, maintenance and evolution.', learningTitle:'Continuous Learning', learningText:'Always exploring new technologies and better solutions.', techEyebrow:'03 / Technologies', embedded:'Embedded Systems', hardware:'Hardware', software:'Software', tools:'Tools', contactEyebrow:'04 / Contact', contactHeading:"Let's build<br />something real.", linkedin:'LinkedIn <span>↗</span>', github:'GitHub <span>↗</span>', projectsEyebrow:'Selected work', projectsHeading:'Products that<br /><em>come to life.</em>', loadingProjects:'Loading projects…', projectsError:'Projects could not be loaded. Please try again later.', viewGallery:'View gallery <span>↗</span>', visitWebsite:'Visit website <span>↗</span>', gallery:'Project gallery', closeGallery:'Close gallery', backGallery:'Back to gallery', openImage:'Open image {number} in full size', imageAlt:'Image {number} from the {project} project' },
  es: { navAbout:'Sobre mí', navProjects:'Proyectos', navContact:'Contacto <span>↗</span>', heroEyebrow:'Investigación y desarrollo', heroRole:'Investigacion y Desarrollo ', heroTitle:'Ingeniero electrónico', heroSkills:'Sistemas embebidos · Arquitectura de hardware · DSP · Audio profesional', viewProjects:'Ver proyectos <span>↗</span>', aboutEyebrow:'01 / Sobre mí', aboutHeading:'Ingeniería con visión de producto.', aboutP1:'Soy Ingeniero Electrónico con más de 18 años de experiencia desarrollando productos electrónicos comerciales para audio profesional, sistemas embebidos y aplicaciones de RF.', aboutP2:'Mi trabajo abarca el ciclo completo de un producto: desde la arquitectura de sistemas y el diseño de hardware hasta el software embebido, aplicaciones Linux y soporte de manufactura.', aboutP3:'Disfruto resolver problemas de ingeniería complejos combinando disciplinas en soluciones confiables, mantenibles y listas para producción.', approachEyebrow:'02 / Enfoque de ingeniería', approachHeading:'Cómo abordo<br />productos complejos.', systemTitle:'Pensamiento sistémico', systemText:'Diseño sistemas completos en lugar de componentes aislados.', handsTitle:'Ingeniería práctica', handsText:'Desde la arquitectura hasta la implementación.', reliabilityTitle:'Confiabilidad a largo plazo', reliabilityText:'Diseño para fabricar, mantener y evolucionar.', learningTitle:'Aprendizaje continuo', learningText:'Siempre explorando nuevas tecnologías y mejores soluciones.', techEyebrow:'03 / Tecnologías', embedded:'Sistemas embebidos', hardware:'Hardware', software:'Software', tools:'Herramientas', contactEyebrow:'04 / Contacto', contactHeading:'Construyamos<br />algo real.', linkedin:'LinkedIn <span>↗</span>', github:'GitHub <span>↗</span>', projectsEyebrow:'Proyectos seleccionados', projectsHeading:'Productos que<br /><em>llegan a existir.</em>', loadingProjects:'Cargando proyectos…', projectsError:'No se pudieron cargar los proyectos. Intentá nuevamente más tarde.', viewGallery:'Ver galería <span>↗</span>', visitWebsite:'Visitar sitio <span>↗</span>', gallery:'Galería de proyecto', closeGallery:'Cerrar galería', backGallery:'Volver a la galería', openImage:'Abrir imagen {number} en tamaño completo', imageAlt:'Imagen {number} del proyecto {project}' }
};

let language = 'en';
let projectData = [];
const projectList = document.querySelector('#project-list');
const dialog = document.querySelector('.gallery');
const textElements = document.querySelectorAll('[data-i18n]');
const escapeHtml = value => String(value).replace(/[&<>'"]/g, character => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' })[character]);

function setLanguage(nextLanguage) {
  language = nextLanguage;
  const copy = translations[language];
  document.documentElement.lang = language;
  textElements.forEach(element => { if (copy[element.dataset.i18n]) element.innerHTML = copy[element.dataset.i18n]; });
  document.querySelectorAll('[data-language]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === language)));
  if (dialog) { dialog.setAttribute('aria-label', copy.gallery); document.querySelector('.gallery-close').setAttribute('aria-label', copy.closeGallery); document.querySelector('.preview-close').setAttribute('aria-label', copy.backGallery); }
  if (projectData.length) renderProjects();
}

function renderProjects() {
  const copy = translations[language];
  projectList.innerHTML = projectData.map(project => {
    const tags = project.tags.map(tag => `<li>${escapeHtml(tag)}</li>`).join('');
    const galleryButton = project.gallery.length ? `<button class="text-link open-gallery" type="button" data-project-id="${escapeHtml(project.id)}">${copy.viewGallery}</button>` : '';
    const website = project.links[0] ? `<a class="text-link" href="${escapeHtml(project.links[0])}" target="_blank" rel="noreferrer">${copy.visitWebsite}</a>` : '';
    return `<article class="project ${project.order % 2 === 0 ? 'reverse' : ''}"><div class="project-image"><img src="${escapeHtml(project.cover)}" alt="${escapeHtml(project.title)}" loading="lazy"><span class="image-number">${String(project.order).padStart(2, '0')}</span></div><div class="project-info"><p class="project-type">${escapeHtml(project.company)} · ${escapeHtml(project.country)}</p><h2>${escapeHtml(project.title)}</h2><p class="project-description">${escapeHtml(project.summary)}</p><p class="project-meta">${escapeHtml(project.engagement)}</p><ul class="tags">${tags}</ul><div class="project-actions">${galleryButton}${website}</div></div></article>`;
  }).join('');
}

function openGallery(project) {
  const copy = translations[language];
  const galleryContent = document.querySelector('.gallery-content');
  galleryContent.innerHTML = project.gallery.map((source, index) => `<button class="gallery-item" type="button" data-source="${escapeHtml(source)}" data-index="${index + 1}" aria-label="${escapeHtml(copy.openImage.replace('{number}', index + 1))}"><img src="${escapeHtml(source)}" alt="${escapeHtml(copy.imageAlt.replace('{number}', index + 1).replace('{project}', project.title))}" loading="lazy"></button>`).join('');
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
setLanguage('en');
if (projectList) loadProjects();

if (dialog) {
  const galleryContent = document.querySelector('.gallery-content'); const preview = document.querySelector('.image-preview'); const previewImage = preview.querySelector('img'); const previewCounter = preview.querySelector('.preview-counter');
  projectList.addEventListener('click', event => { const button = event.target.closest('.open-gallery'); if (!button) return; const project = projectData.find(item => item.id === button.dataset.projectId); if (project) openGallery(project); });
  galleryContent.addEventListener('click', event => { const item = event.target.closest('.gallery-item'); if (!item) return; previewImage.src = item.dataset.source; previewImage.alt = item.querySelector('img').alt; previewCounter.textContent = `${item.dataset.index} / ${galleryContent.children.length}`; preview.hidden = false; });
  document.querySelector('.preview-close').addEventListener('click', () => { preview.hidden = true; }); document.querySelector('.gallery-close').addEventListener('click', () => dialog.close()); dialog.addEventListener('cancel', event => { if (!preview.hidden) { event.preventDefault(); preview.hidden = true; } }); dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
}
