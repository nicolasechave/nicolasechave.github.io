import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const projectsRoot = path.join(root, 'projects');
const imageExtensions = new Set(['.avif', '.jpeg', '.jpg', '.png', '.webp']);

function parseValue(value) {
  const trimmed = value.trim();
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    return trimmed.slice(1, -1).split(',').map(item => item.trim()).filter(Boolean);
  }
  return trimmed.replace(/^['"]|['"]$/g, '');
}

function parseProject(markdown) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) throw new Error('A description.md file is missing YAML front matter.');
  const metadata = Object.fromEntries(match[1].split(/\r?\n/).filter(Boolean).map(line => {
    const delimiter = line.indexOf(':');
    return [line.slice(0, delimiter).trim(), parseValue(line.slice(delimiter + 1))];
  }));
  return { ...metadata, detailsMarkdown: match[2].trim() };
}

async function collectImages(directory, relativeDirectory = '') {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async entry => {
    const relativePath = path.join(relativeDirectory, entry.name);
    if (entry.isDirectory()) return collectImages(path.join(directory, entry.name), relativePath);
    return imageExtensions.has(path.extname(entry.name).toLowerCase()) ? [relativePath.replaceAll('\\', '/')] : [];
  }));
  return files.flat().sort();
}

const manifest = await readFile(path.join(projectsRoot, 'projects.yaml'), 'utf8');
const projectPaths = [...manifest.matchAll(/^\s*- path:\s*(.+)$/gm)].map(match => match[1].trim());
const projects = await Promise.all(projectPaths.map(async (projectPath, index) => {
  const directory = path.join(projectsRoot, projectPath);
  const project = parseProject(await readFile(path.join(directory, 'description.md'), 'utf8'));
  const galleryPath = path.join(directory, project.gallery);
  return {
    ...project,
    order: index + 1,
    path: projectPath,
    cover: `projects/${projectPath}/${project.cover}`,
    gallery: (await collectImages(galleryPath)).map(image => `projects/${projectPath}/${project.gallery}/${image}`)
  };
}));

const data = { projects };
await writeFile(path.join(projectsRoot, 'projects.json'), `${JSON.stringify(data, null, 2)}\n`);
await writeFile(path.join(projectsRoot, 'projects-data.js'), `window.PORTFOLIO_PROJECTS = ${JSON.stringify(data, null, 2)};\n`);
console.log(`Generated projects/projects.json and projects/projects-data.js with ${projects.length} projects.`);
