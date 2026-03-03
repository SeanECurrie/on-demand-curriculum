import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcPath = join(__dirname, '..', '..', '2026-02-11-v1-initial-deployment.md');
const outPath = join(__dirname, 'index.html');

const md = readFileSync(srcPath, 'utf-8');
const lines = md.split('\n');

// ─── Helpers ───────────────────────────────────────────────────────────────────

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function inlineMarkdown(text) {
  // Bold
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // Italic
  text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
  // Inline code
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
  // Links
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return text;
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// ─── Parse into blocks ─────────────────────────────────────────────────────────

// Block types: heading, paragraph, code, table, list, hr, blank
function parseBlocks(lines) {
  const blocks = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Blank line
    if (line.trim() === '') {
      i++;
      continue;
    }

    // HR
    if (/^---+$/.test(line.trim())) {
      blocks.push({ type: 'hr' });
      i++;
      continue;
    }

    // Heading
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      blocks.push({ type: 'heading', level: headingMatch[1].length, text: headingMatch[2] });
      i++;
      continue;
    }

    // Code block
    if (line.trim().startsWith('```')) {
      const lang = line.trim().replace(/^```/, '').trim();
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      blocks.push({ type: 'code', lang, content: codeLines.join('\n') });
      continue;
    }

    // Table
    if (line.includes('|') && i + 1 < lines.length && /^\|[\s-:|]+\|$/.test(lines[i + 1].trim())) {
      const tableLines = [];
      while (i < lines.length && lines[i].includes('|') && lines[i].trim() !== '') {
        tableLines.push(lines[i]);
        i++;
      }
      blocks.push({ type: 'table', lines: tableLines });
      continue;
    }

    // Ordered list
    if (/^\d+\.\s/.test(line.trim())) {
      const items = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ''));
        i++;
        // Continuation lines (indented)
        while (i < lines.length && lines[i].match(/^\s+\S/) && !/^\d+\.\s/.test(lines[i].trim()) && !lines[i].trim().startsWith('- ')) {
          items[items.length - 1] += ' ' + lines[i].trim();
          i++;
        }
      }
      blocks.push({ type: 'ol', items });
      continue;
    }

    // Unordered list
    if (/^[-*]\s/.test(line.trim())) {
      const items = [];
      while (i < lines.length && /^[-*]\s/.test(lines[i].trim())) {
        const isCheckbox = /^[-*]\s+\[[ x]\]\s/.test(lines[i].trim());
        let text = lines[i].trim().replace(/^[-*]\s+/, '');
        const checked = /^\[x\]\s/i.test(text);
        if (isCheckbox) {
          text = text.replace(/^\[[ x]\]\s+/i, '');
        }
        items.push({ text, checkbox: isCheckbox, checked });
        i++;
        // Continuation lines
        while (i < lines.length && lines[i].match(/^\s+\S/) && !/^[-*]\s/.test(lines[i].trim()) && !/^\d+\.\s/.test(lines[i].trim())) {
          items[items.length - 1].text += ' ' + lines[i].trim();
          i++;
        }
      }
      blocks.push({ type: 'ul', items });
      continue;
    }

    // Paragraph (collect consecutive non-blank non-special lines)
    const paraLines = [];
    while (i < lines.length && lines[i].trim() !== '' && !/^#{1,6}\s/.test(lines[i]) && !lines[i].trim().startsWith('```') && !/^---+$/.test(lines[i].trim()) && !(lines[i].includes('|') && i + 1 < lines.length && lines[i + 1] && /^\|[\s-:|]+\|$/.test(lines[i + 1].trim())) && !/^[-*]\s/.test(lines[i].trim()) && !/^\d+\.\s/.test(lines[i].trim())) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      blocks.push({ type: 'paragraph', text: paraLines.join('\n') });
    }
  }
  return blocks;
}

// ─── Parse table ────────────────────────────────────────────────────────────────

function parseTable(tableLines) {
  const rows = tableLines.filter(l => !/^\|[\s-:|]+\|$/.test(l.trim()));
  const parsedRows = rows.map(row => {
    const cells = row.split('|').slice(1, -1).map(c => c.trim());
    return cells;
  });
  if (parsedRows.length === 0) return '';
  const header = parsedRows[0];
  const body = parsedRows.slice(1);
  let html = '<div class="table-wrapper"><table class="data-table"><thead><tr>';
  for (const cell of header) {
    html += `<th>${inlineMarkdown(escapeHtml(cell))}</th>`;
  }
  html += '</tr></thead><tbody>';
  for (const row of body) {
    html += '<tr>';
    for (const cell of row) {
      html += `<td>${inlineMarkdown(escapeHtml(cell))}</td>`;
    }
    html += '</tr>';
  }
  html += '</tbody></table></div>';
  return html;
}

// ─── Phase detection ────────────────────────────────────────────────────────────

// Detect phase headings: "## Phase 0:", "## Phase A:", etc.
// Also detect appendix and other top-level ## headings
function detectPhaseInfo(text) {
  const phaseMatch = text.match(/^Phase\s+(\w+):\s*(.+)/i);
  if (phaseMatch) {
    return { id: phaseMatch[1].toLowerCase(), number: phaseMatch[1], title: phaseMatch[2] };
  }
  return null;
}

// Time estimate extraction from paragraph
function extractTimeEstimate(text) {
  const match = text.match(/Time estimate:\s*(.+?)(?:\.|$)/i);
  return match ? match[1].trim() : null;
}

// ─── Structure into sections ────────────────────────────────────────────────────

const blocks = parseBlocks(lines);

// Group blocks into phases/sections
// Top-level structure:
// - Pre-phase content (title, intro sections)
// - Phases (## Phase X: ...)
// - Appendix sections

const phases = [];
let currentPhase = null;
let prePhaseBlocks = [];
let appendixBlocks = [];
let inAppendix = false;

// Also collect all top-level ## sections that aren't phases
const topSections = [];

for (let i = 0; i < blocks.length; i++) {
  const block = blocks[i];
  if (block.type === 'heading' && block.level === 2) {
    const phaseInfo = detectPhaseInfo(block.text);
    if (phaseInfo) {
      if (currentPhase) phases.push(currentPhase);
      currentPhase = { ...phaseInfo, blocks: [] };
      inAppendix = false;
      continue;
    } else if (block.text === 'Appendix') {
      if (currentPhase) { phases.push(currentPhase); currentPhase = null; }
      inAppendix = true;
      appendixBlocks.push(block);
      continue;
    } else if (block.text === 'After Deployment') {
      if (currentPhase) { phases.push(currentPhase); currentPhase = null; }
      inAppendix = true;
      appendixBlocks.push(block);
      continue;
    } else if (!currentPhase && !inAppendix) {
      // Pre-phase top-level section
      if (currentPhase) { phases.push(currentPhase); currentPhase = null; }
      topSections.push({ title: block.text, blocks: [] });
      continue;
    }
  }

  if (inAppendix) {
    appendixBlocks.push(block);
  } else if (currentPhase) {
    currentPhase.blocks.push(block);
  } else if (topSections.length > 0) {
    topSections[topSections.length - 1].blocks.push(block);
  } else {
    prePhaseBlocks.push(block);
  }
}
if (currentPhase) phases.push(currentPhase);

// ─── Render blocks to HTML ──────────────────────────────────────────────────────

let checkboxCounter = 0;
let codeBlockCounter = 0;

function renderBlock(block, phaseId) {
  switch (block.type) {
    case 'hr':
      return '<hr>';

    case 'heading': {
      const id = slugify(block.text);
      const level = block.level;

      // Check for "Understanding:" sections
      if (block.text.startsWith('Understanding:') || block.text.startsWith('Understanding —')) {
        const topic = block.text.replace(/^Understanding[:—]\s*/, '').trim();
        return `<div class="understanding-section" id="${id}"><div class="understanding-label">UNDERSTANDING</div><h${level} class="understanding-title">${inlineMarkdown(escapeHtml(topic))}</h${level}>`;
      }

      // Check for "Phase X — Deployment Notes"
      if (/Phase\s+\w+\s+—?\s*Deployment Notes/i.test(block.text)) {
        return `<div class="deployment-notes" id="${id}"><div class="deployment-notes-title">${inlineMarkdown(escapeHtml(block.text))}</div>`;
      }

      // Step headings (e.g., "A1:", "D3:", "0.1:")
      const stepMatch = block.text.match(/^(\w+[\d.]+):\s*(.+)/);
      if (stepMatch && level === 3) {
        return `<h3 id="${id}"><span class="step-number">${escapeHtml(stepMatch[1])}:</span> ${inlineMarkdown(escapeHtml(stepMatch[2]))}</h3>`;
      }

      return `<h${level} id="${id}">${inlineMarkdown(escapeHtml(block.text))}</h${level}>`;
    }

    case 'paragraph': {
      const text = block.text;
      // Check for CRITICAL callout
      if (text.startsWith('**CRITICAL GATE') || text.startsWith('CRITICAL GATE') || text.startsWith('**CRITICAL:') || text.startsWith('CRITICAL:')) {
        return `<div class="callout callout-critical"><span class="callout-label"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> CRITICAL</span><p>${inlineMarkdown(escapeHtml(text))}</p></div>`;
      }

      // Check for WARNING
      if (text.startsWith('**WARNING') || text.startsWith('WARNING:')) {
        return `<div class="callout callout-warning"><span class="callout-label"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> WARNING</span><p>${inlineMarkdown(escapeHtml(text))}</p></div>`;
      }

      // Tip / heads up
      if (text.startsWith('**Heads up') || text.startsWith('**Important lesson') || text.startsWith('**Tip:') || text.startsWith('**A note on')) {
        return `<div class="callout callout-tip"><span class="callout-label"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18h6M10 22h4M12 2a7 7 0 00-4 12.7V17h8v-2.3A7 7 0 0012 2z"/></svg> TIP</span><p>${inlineMarkdown(escapeHtml(text))}</p></div>`;
      }

      // Concept paragraphs
      if (text.startsWith('**Concept:**')) {
        return `<div class="callout callout-info"><span class="callout-label"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg> INFO</span><p>${inlineMarkdown(escapeHtml(text))}</p></div>`;
      }

      // "Transferable concept" paragraphs
      if (text.startsWith('**Transferable concept:') || text.startsWith('**Transferable:**')) {
        return `<div class="callout callout-info"><span class="callout-label"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg> INFO</span><p>${inlineMarkdown(escapeHtml(text))}</p></div>`;
      }

      // "If something's wrong" sections - render as expandable
      if (text.startsWith('**If something\'s wrong:') || text.startsWith('**If something\'s wrong**')) {
        return `<div class="expandable"><button class="expandable-trigger troubleshooting-trigger" aria-expanded="false"><svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 4l8 8-8 8"/></svg><span>If something's wrong</span></button><div class="expandable-content" style="display:none"><p>${inlineMarkdown(escapeHtml(text.replace(/^\*\*If something's wrong[:]*\*\*\s*/i, '')))}</p></div></div>`;
      }

      // Expected output
      if (text.startsWith('**Expected output:**')) {
        return `<div class="expandable"><button class="expandable-trigger expected-trigger" aria-expanded="false"><svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 4l8 8-8 8"/></svg><span>Expected output</span></button><div class="expandable-content" style="display:none"><p>${inlineMarkdown(escapeHtml(text.replace(/^\*\*Expected output:\*\*\s*/, '')))}</p></div></div>`;
      }

      // Security note
      if (text.startsWith('**Security note:**')) {
        return `<div class="callout callout-warning"><span class="callout-label"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> SECURITY NOTE</span><p>${inlineMarkdown(escapeHtml(text))}</p></div>`;
      }

      // "Important" callouts
      if (text.startsWith('**Important') && !text.startsWith('**Important lesson')) {
        return `<div class="callout callout-warning"><span class="callout-label"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> IMPORTANT</span><p>${inlineMarkdown(escapeHtml(text))}</p></div>`;
      }

      // Fill-in / italic intro for deployment notes
      if (text.startsWith('*Fill this in')) {
        return `<p class="deployment-notes-intro"><em>${inlineMarkdown(escapeHtml(text.replace(/^\*|\*$/g, '')))}</em></p>`;
      }

      return `<p>${inlineMarkdown(escapeHtml(text))}</p>`;
    }

    case 'code': {
      codeBlockCounter++;
      const id = `code-${codeBlockCounter}`;
      const langLabel = block.lang ? `<span class="code-lang">${escapeHtml(block.lang)}</span>` : '';
      return `<div class="code-block" id="${id}">${langLabel}<button class="copy-btn" data-target="${id}" title="Copy to clipboard"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg></button><pre><code>${escapeHtml(block.content)}</code></pre></div>`;
    }

    case 'table':
      return parseTable(block.lines);

    case 'ul': {
      const hasCheckboxes = block.items.some(it => it.checkbox);
      if (hasCheckboxes) {
        let html = '<div class="checkbox-list">';
        for (const item of block.items) {
          if (item.checkbox) {
            const cbId = `check-${phaseId || 'global'}-${checkboxCounter++}`;
            html += `<div class="checkbox-item"><input type="checkbox" class="checkbox-input" id="${cbId}" data-key="${cbId}"><label class="checkbox-label" for="${cbId}">${inlineMarkdown(escapeHtml(item.text))}</label></div>`;
          } else {
            html += `<p>${inlineMarkdown(escapeHtml(item.text))}</p>`;
          }
        }
        html += '</div>';
        return html;
      }
      let html = '<ul>';
      for (const item of block.items) {
        html += `<li>${inlineMarkdown(escapeHtml(item.text))}</li>`;
      }
      html += '</ul>';
      return html;
    }

    case 'ol': {
      let html = '<ol>';
      for (const item of block.items) {
        html += `<li>${inlineMarkdown(escapeHtml(item))}</li>`;
      }
      html += '</ol>';
      return html;
    }

    default:
      return '';
  }
}

// ─── Render phases ──────────────────────────────────────────────────────────────

// Diagram placements by phase
const diagramPlacements = {
  '0': 'diagram-machine-transformation',
  'a': 'diagram-network-topology',
  'c': 'diagram-gateway-architecture',
  'd': 'diagram-defense-in-depth',
  'e': 'diagram-model-routing',
  'g': 'diagram-skill-security',
  'h': 'diagram-validation-dashboard',
};

// Phase time estimates
const phaseTimeEstimates = {
  '0': '45-60 minutes',
  'a': '20-30 minutes',
  'b': '5 minutes',
  'c': '15-20 minutes',
  'd': '30-45 minutes',
  'e': '10 minutes',
  'f': '10-15 minutes',
  'g': '20-30 minutes',
  'h': '20-30 minutes',
  'i': '15-20 minutes',
};

// Security-critical phases
const securityCritical = ['d', 'h'];

// Phase nav groupings
const navGroups = {
  'PREPARATION': ['0', 'a', 'b'],
  'DEPLOYMENT': ['c', 'd', 'e'],
  'CONNECTION': ['f', 'g'],
  'VALIDATION': ['h', 'i'],
};

function renderPhaseBlocks(phase) {
  let html = '';
  let inUnderstanding = false;
  let inDeploymentNotes = false;

  for (let i = 0; i < phase.blocks.length; i++) {
    const block = phase.blocks[i];

    // Close understanding section before next h2/h3
    if (inUnderstanding && block.type === 'heading' && block.level <= 3 && !block.text.startsWith('Understanding')) {
      html += '</div>'; // close understanding-section
      inUnderstanding = false;
    }

    // Close deployment notes at hr or end
    if (inDeploymentNotes && block.type === 'hr') {
      html += '</div>'; // close deployment-notes
      inDeploymentNotes = false;
      continue;
    }

    const rendered = renderBlock(block, `phase-${phase.id}`);

    // Track understanding sections
    if (block.type === 'heading' && (block.text.startsWith('Understanding:') || block.text.startsWith('Understanding —') || block.text.startsWith('Understanding:'))) {
      inUnderstanding = true;
    }

    // Track deployment notes sections
    if (block.type === 'heading' && /Phase\s+\w+\s+—?\s*Deployment Notes/i.test(block.text)) {
      inDeploymentNotes = true;
    }

    html += rendered + '\n';
  }

  // Close any open sections
  if (inUnderstanding) html += '</div>';
  if (inDeploymentNotes) html += '</div>';

  return html;
}

function renderPhase(phase) {
  const isSecurity = securityCritical.includes(phase.id);
  const time = phaseTimeEstimates[phase.id] || '';
  const diagramId = diagramPlacements[phase.id];

  let html = `<section class="phase-section" id="phase-${phase.id}" data-phase="${phase.id}">
  <div class="phase-header${isSecurity ? ' security-critical' : ''}">
    <div class="phase-number">PHASE ${phase.number.toUpperCase()}</div>
    <h1 class="phase-title">${inlineMarkdown(escapeHtml(phase.title))}</h1>
    ${time ? `<span class="time-badge"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg> ${escapeHtml(time)}</span>` : ''}
  </div>
`;

  // Insert diagram placeholder at the top of the phase
  if (diagramId) {
    html += `  <div id="${diagramId}" class="diagram-container"><noscript>Diagram: ${diagramId.replace(/-/g, ' ')}</noscript></div>\n`;
  }

  html += renderPhaseBlocks(phase);
  html += '</section>\n';
  return html;
}

// ─── Render pre-phase content ───────────────────────────────────────────────────

function renderPrePhase() {
  let html = '';

  // Title from first heading block
  if (prePhaseBlocks.length > 0 && prePhaseBlocks[0].type === 'heading') {
    html += `<div class="walkthrough-header">
  <h1 class="walkthrough-title">${inlineMarkdown(escapeHtml(prePhaseBlocks[0].text))}</h1>
</div>\n`;
  }

  // Rest of pre-phase blocks
  for (let i = 1; i < prePhaseBlocks.length; i++) {
    html += renderBlock(prePhaseBlocks[i], 'intro') + '\n';
  }

  // Top-level sections (What This Walkthrough Is For, How to Use, State of Research, Pre-Flight)
  for (const section of topSections) {
    const sectionId = slugify(section.title);
    html += `<section class="intro-section" id="${sectionId}">
  <h2>${inlineMarkdown(escapeHtml(section.title))}</h2>\n`;
    for (const block of section.blocks) {
      html += renderBlock(block, sectionId) + '\n';
    }
    html += '</section>\n';
  }

  return html;
}

// ─── Render appendix ────────────────────────────────────────────────────────────

function renderAppendix() {
  let html = '<section class="appendix-section" id="appendix">\n';
  for (const block of appendixBlocks) {
    html += renderBlock(block, 'appendix') + '\n';
  }
  html += '</section>\n';
  return html;
}

// ─── Build sidebar navigation ───────────────────────────────────────────────────

function buildNav() {
  let html = `<nav class="sidebar" id="sidebar">
  <div class="sidebar-header">
    <div class="sidebar-title">OpenClaw Walkthrough</div>
    <button class="theme-toggle" id="theme-toggle" title="Toggle dark/light mode">
      <svg class="icon-sun" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
      <svg class="icon-moon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
    </button>
  </div>
`;

  // Intro link
  html += `  <a class="nav-item" href="#" data-target="top"><span class="nav-dot"></span>Introduction</a>\n`;

  // Pre-phase sections
  for (const section of topSections) {
    const id = slugify(section.title);
    html += `  <a class="nav-item" href="#${id}" data-target="${id}"><span class="nav-dot"></span>${escapeHtml(section.title)}</a>\n`;
  }

  // Phase groups
  for (const [groupLabel, phaseIds] of Object.entries(navGroups)) {
    html += `  <div class="nav-group-label">${groupLabel}</div>\n`;
    for (const pid of phaseIds) {
      const phase = phases.find(p => p.id === pid);
      if (phase) {
        html += `  <a class="nav-item" href="#phase-${pid}" data-target="phase-${pid}" data-phase="${pid}"><span class="nav-dot"></span>Phase ${phase.number.toUpperCase()}: ${escapeHtml(phase.title)}</a>\n`;
      }
    }
  }

  // Appendix
  html += `  <div class="nav-group-label">REFERENCE</div>\n`;
  html += `  <a class="nav-item" href="#appendix" data-target="appendix"><span class="nav-dot"></span>Appendix</a>\n`;

  // Progress bar
  html += `  <div class="sidebar-progress">
    <div class="progress-label" id="progress-label">Phase 0 of ${phases.length} complete</div>
    <div class="progress-bar"><div class="progress-fill" id="progress-fill" style="width:0%"></div></div>
  </div>
`;

  html += '</nav>\n';
  return html;
}

// ─── CSS ────────────────────────────────────────────────────────────────────────

function buildCSS() {
  return `
/* ─── CSS Custom Properties ─── */
:root {
  --font-body: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  --font-mono: "SF Mono", SFMono-Regular, ui-monospace, "DejaVu Sans Mono", Menlo, Consolas, monospace;

  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px;
  --space-5: 20px; --space-6: 24px; --space-8: 32px; --space-10: 40px; --space-12: 48px;

  /* Light mode colors */
  --color-blue-50: #eff6ff; --color-blue-100: #dbeafe; --color-blue-200: #bfdbfe;
  --color-blue-500: #3b82f6; --color-blue-600: #2563eb; --color-blue-700: #1d4ed8;
  --color-red-50: #fef2f2; --color-red-100: #fee2e2;
  --color-red-500: #ef4444; --color-red-600: #dc2626;
  --color-green-50: #f0fdf4; --color-green-100: #dcfce7;
  --color-green-500: #22c55e; --color-green-600: #16a34a;
  --color-amber-50: #fffbeb; --color-amber-100: #fef3c7;
  --color-amber-500: #f59e0b; --color-amber-800: #92400e;
  --color-stone-50: #fafaf9; --color-stone-100: #f5f5f4; --color-stone-200: #e7e5e4;
  --color-stone-300: #d6d3d1; --color-stone-400: #a8a29e; --color-stone-500: #78716c;
  --color-stone-700: #44403c; --color-stone-800: #292524; --color-stone-900: #1c1917;

  --bg: var(--color-stone-50);
  --surface: var(--color-stone-100);
  --code-bg: var(--color-stone-200);
  --border: var(--color-stone-200);
  --border-subtle: var(--color-stone-300);
  --text-muted: var(--color-stone-400);
  --text-secondary: var(--color-stone-500);
  --text-body: var(--color-stone-700);
  --text-heading: var(--color-stone-800);
  --text-strongest: var(--color-stone-900);
  --link: var(--color-blue-500);
  --link-hover: var(--color-blue-600);

  --callout-critical-bg: var(--color-red-50);
  --callout-critical-border: var(--color-red-500);
  --callout-critical-label: var(--color-red-600);
  --callout-warning-bg: var(--color-red-50);
  --callout-warning-border: var(--color-amber-500);
  --callout-warning-label: var(--color-red-600);
  --callout-tip-bg: var(--color-amber-50);
  --callout-tip-border: var(--color-amber-500);
  --callout-tip-label: var(--color-amber-800);
  --callout-info-bg: var(--color-blue-50);
  --callout-info-border: var(--color-blue-500);
  --callout-info-label: var(--color-blue-600);

  --understanding-bg: var(--color-amber-50);
  --understanding-border: var(--color-amber-500);
  --understanding-label: var(--color-amber-500);

  --nav-active-bg: var(--color-blue-100);
  --nav-active-color: var(--color-blue-600);
  --nav-active-border: var(--color-blue-500);

  --checkbox-bg: white;
  --checkbox-border: var(--color-stone-300);
  --checkbox-checked: var(--color-green-500);

  --time-badge-bg: var(--color-blue-200);
  --time-badge-color: var(--color-blue-600);

  --sidebar-bg: var(--color-stone-100);
  --sidebar-border: var(--color-stone-200);
}

[data-theme="dark"] {
  --bg: #1a1a1a;
  --surface: #262626;
  --code-bg: #2d2d2d;
  --border: #404040;
  --border-subtle: #333333;
  --text-muted: #737373;
  --text-secondary: #a3a3a3;
  --text-body: #d4d4d4;
  --text-heading: #e5e5e5;
  --text-strongest: #f5f5f5;
  --link: #60a5fa;
  --link-hover: #3b82f6;

  --callout-critical-bg: #450a0a;
  --callout-critical-border: #f87171;
  --callout-critical-label: #f87171;
  --callout-warning-bg: #450a0a;
  --callout-warning-border: #fbbf24;
  --callout-warning-label: #f87171;
  --callout-tip-bg: #451a03;
  --callout-tip-border: #fbbf24;
  --callout-tip-label: #fbbf24;
  --callout-info-bg: #1e3a5f;
  --callout-info-border: #60a5fa;
  --callout-info-label: #60a5fa;

  --understanding-bg: rgba(69, 26, 3, 0.3);
  --understanding-border: #fbbf24;
  --understanding-label: #fbbf24;

  --nav-active-bg: #1e3a5f;
  --nav-active-color: #60a5fa;
  --nav-active-border: #3b82f6;

  --checkbox-bg: #262626;
  --checkbox-border: #525252;

  --time-badge-bg: #1e3a5f;
  --time-badge-color: #60a5fa;

  --sidebar-bg: #1f1f1f;
  --sidebar-border: #333333;
}

/* ─── Global ─── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
* { transition: background-color 200ms ease, color 200ms ease, border-color 200ms ease; }

html {
  scroll-behavior: smooth;
  scroll-padding-top: 24px;
}

body {
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.65;
  color: var(--text-body);
  background: var(--bg);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

:focus-visible { outline: 2px solid var(--color-blue-500); outline-offset: 2px; }
:focus:not(:focus-visible) { outline: none; }

a { color: var(--link); text-decoration: none; }
a:hover { color: var(--link-hover); text-decoration: underline; }

/* ─── Layout ─── */
.sidebar {
  width: 260px;
  position: fixed;
  top: 0; left: 0;
  height: 100vh;
  overflow-y: auto;
  background: var(--sidebar-bg);
  border-right: 1px solid var(--sidebar-border);
  padding: 24px 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px 16px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 8px;
}

.sidebar-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-heading);
}

.theme-toggle {
  width: 36px; height: 36px;
  background: transparent;
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: var(--text-body);
}
.theme-toggle:hover { background: var(--code-bg); }
[data-theme="dark"] .icon-moon { display: none; }
[data-theme="dark"] .icon-sun { display: block; }
:root:not([data-theme="dark"]) .icon-sun { display: none; }
:root:not([data-theme="dark"]) .icon-moon { display: block; }
html:not([data-theme]) .icon-sun { display: none; }
html:not([data-theme]) .icon-moon { display: block; }

.nav-group-label {
  font-size: 11px; font-weight: 700;
  letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--text-muted);
  padding: 8px 20px 4px;
  margin-top: 16px;
}

.nav-item {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 20px;
  font-size: 14px; font-weight: 500;
  color: var(--text-body);
  text-decoration: none;
  border-left: 3px solid transparent;
  cursor: pointer;
}
.nav-item:hover { background: var(--code-bg); color: var(--text-heading); text-decoration: none; }
.nav-item.active {
  background: var(--nav-active-bg);
  color: var(--nav-active-color);
  border-left-color: var(--nav-active-border);
  font-weight: 600;
}
.nav-item.completed { border-left-color: var(--color-green-500); }

.nav-dot {
  width: 8px; height: 8px; min-width: 8px;
  border-radius: 50%;
  background: var(--border-subtle);
  display: inline-block;
}
.nav-item.active .nav-dot {
  background: transparent;
  border: 2px solid var(--color-blue-500);
}
.nav-item.completed .nav-dot { background: var(--color-green-500); }

.sidebar-progress {
  margin-top: auto;
  padding: 16px 20px;
}
.progress-label {
  font-size: 12px; color: var(--text-muted); margin-bottom: 6px;
}
.progress-bar {
  height: 4px; background: var(--border-subtle); border-radius: 2px; overflow: hidden;
}
.progress-fill {
  height: 100%; background: var(--color-blue-500); border-radius: 2px;
  transition: width 300ms ease;
}

.main-content {
  margin-left: 260px;
  max-width: 780px;
  padding: 48px 40px;
}

/* Hamburger */
.hamburger {
  display: none;
  position: fixed; top: 12px; left: 12px; z-index: 200;
  width: 40px; height: 40px;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 8px; cursor: pointer;
  align-items: center; justify-content: center;
}
.hamburger svg { color: var(--text-body); }
.sidebar-backdrop {
  display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 99;
}

/* ─── Typography ─── */
h1 { font-size: 28px; font-weight: 700; line-height: 1.3; letter-spacing: -0.02em; color: var(--text-strongest); margin-bottom: 8px; }
h2 { font-size: 22px; font-weight: 700; line-height: 1.35; letter-spacing: -0.01em; color: var(--text-heading); margin: 32px 0 16px; }
h3 { font-size: 18px; font-weight: 600; line-height: 1.4; color: var(--text-heading); margin: 24px 0 12px; }
h4 { font-size: 16px; font-weight: 600; color: var(--text-heading); margin: 16px 0 8px; }
p { margin: 12px 0; }
ul, ol { margin: 12px 0; padding-left: 24px; }
li { margin: 4px 0; }
hr { border: none; border-top: 1px solid var(--border); margin: 32px 0; }
strong { color: var(--text-heading); }

code:not(pre code) {
  font-family: var(--font-mono); font-size: 14px;
  background: var(--code-bg); padding: 2px 6px; border-radius: 4px;
  color: var(--text-body);
}

.step-number { color: var(--color-blue-500); font-weight: 700; }

/* ─── Phase Header ─── */
.phase-section { padding-top: 16px; }
.phase-header {
  padding: 32px 0 24px;
  margin-bottom: 24px;
  border-bottom: 2px solid var(--border);
}
.phase-header.security-critical {
  border-left: 4px solid var(--color-red-500);
  padding-left: 16px;
}
[data-theme="dark"] .phase-header.security-critical { border-left-color: #f87171; }
.phase-number {
  font-size: 13px; font-weight: 700; letter-spacing: 0.08em;
  text-transform: uppercase; color: var(--color-blue-500);
  margin-bottom: 4px;
}
[data-theme="dark"] .phase-number { color: #60a5fa; }
.phase-title { font-size: 28px; font-weight: 700; line-height: 1.3; letter-spacing: -0.02em; color: var(--text-strongest); margin-bottom: 8px; }

.time-badge {
  display: inline-flex; align-items: center; gap: 4px;
  background: var(--time-badge-bg); color: var(--time-badge-color);
  font-size: 12px; font-weight: 600;
  padding: 3px 10px; border-radius: 12px; margin-top: 8px;
}

/* ─── Code Blocks ─── */
.code-block {
  background: var(--code-bg);
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  padding: 16px 20px;
  margin: 12px 0 16px;
  overflow-x: auto;
  position: relative;
  font-family: var(--font-mono);
  font-size: 14px; line-height: 1.55;
  color: var(--text-body);
}
.code-block pre { margin: 0; }
.code-block code { background: none; padding: 0; font-size: 14px; }

.code-lang {
  position: absolute; top: 0; left: 16px;
  background: var(--border-subtle);
  padding: 2px 8px; border-radius: 0 0 4px 4px;
  font-size: 11px; font-family: var(--font-mono);
  color: var(--text-secondary);
}

.copy-btn {
  position: absolute; top: 8px; right: 8px;
  width: 32px; height: 32px;
  background: transparent; border: none; border-radius: 6px;
  cursor: pointer; color: var(--text-muted);
  display: flex; align-items: center; justify-content: center;
}
.copy-btn:hover { background: var(--surface); }
.copy-btn.copied { color: var(--color-green-500); }

/* ─── Callouts ─── */
.callout {
  border-radius: 8px; padding: 16px 20px; margin: 16px 0;
  border-left: 4px solid; font-size: 15px; line-height: 1.6;
}
.callout p { margin: 6px 0; }
.callout-label {
  display: flex; align-items: center; gap: 4px;
  font-size: 13px; font-weight: 700; letter-spacing: 0.05em;
  text-transform: uppercase; margin-bottom: 6px;
}
.callout-critical { background: var(--callout-critical-bg); border-left-color: var(--callout-critical-border); }
.callout-critical .callout-label { color: var(--callout-critical-label); }
.callout-warning { background: var(--callout-warning-bg); border-left-color: var(--callout-warning-border); }
.callout-warning .callout-label { color: var(--callout-warning-label); }
.callout-tip { background: var(--callout-tip-bg); border-left-color: var(--callout-tip-border); }
.callout-tip .callout-label { color: var(--callout-tip-label); }
.callout-info { background: var(--callout-info-bg); border-left-color: var(--callout-info-border); }
.callout-info .callout-label { color: var(--callout-info-label); }

/* ─── Understanding Sections ─── */
.understanding-section {
  border-left: 4px solid var(--understanding-border);
  background: var(--understanding-bg);
  border-radius: 0 8px 8px 0;
  padding: 20px 24px;
  margin: 16px 0;
}
.understanding-label {
  font-size: 13px; font-weight: 700; letter-spacing: 0.05em;
  text-transform: uppercase; color: var(--understanding-label);
  margin-bottom: 8px;
}
.understanding-title { margin-top: 0; }

/* ─── Expandable Sections ─── */
.expandable {
  border: 1px solid var(--border);
  border-radius: 8px; margin: 12px 0; overflow: hidden;
}
.expandable-trigger {
  display: flex; align-items: center; gap: 8px; width: 100%;
  padding: 12px 16px;
  background: var(--surface); border: none; cursor: pointer;
  font-family: var(--font-body); font-size: 15px; font-weight: 600;
  color: var(--text-body); text-align: left;
}
.expandable-trigger:hover { background: var(--code-bg); }
.expandable-trigger .chevron {
  flex-shrink: 0; color: var(--text-muted);
  transition: transform 200ms ease;
}
.expandable-trigger[aria-expanded="true"] .chevron { transform: rotate(90deg); }
.expandable-content { padding: 0 16px 16px; }
.troubleshooting-trigger .chevron, .troubleshooting-trigger span { color: var(--color-red-500); }
[data-theme="dark"] .troubleshooting-trigger .chevron, [data-theme="dark"] .troubleshooting-trigger span { color: #f87171; }
.expected-trigger .chevron, .expected-trigger span { color: var(--color-green-500); }
[data-theme="dark"] .expected-trigger .chevron, [data-theme="dark"] .expected-trigger span { color: #4ade80; }

/* ─── Tables ─── */
.table-wrapper { overflow-x: auto; -webkit-overflow-scrolling: touch; margin: 16px 0; }
.data-table { width: 100%; border-collapse: collapse; font-size: 14px; }
.data-table th {
  text-align: left; padding: 10px 12px; font-weight: 600;
  color: var(--text-body); background: var(--surface);
  border-bottom: 2px solid var(--border-subtle);
}
.data-table td {
  padding: 10px 12px; border-bottom: 1px solid var(--border);
  color: var(--text-body); vertical-align: top;
}
.data-table tr:last-child td { border-bottom: none; }
.data-table code { font-size: 13px; }

/* ─── Checkboxes ─── */
.checkbox-list { margin: 12px 0; }
.checkbox-item { display: flex; align-items: flex-start; gap: 10px; padding: 6px 0; }
.checkbox-input {
  appearance: none; width: 20px; height: 20px; min-width: 20px;
  border: 2px solid var(--checkbox-border); border-radius: 4px;
  background: var(--checkbox-bg); cursor: pointer; margin-top: 2px;
  position: relative;
}
.checkbox-input:checked { background: var(--checkbox-checked); border-color: var(--checkbox-checked); }
.checkbox-input:checked::after {
  content: ""; position: absolute; left: 5px; top: 1px;
  width: 6px; height: 11px;
  border: solid white; border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
.checkbox-input:focus-visible { outline: 2px solid var(--color-blue-500); outline-offset: 2px; }
.checkbox-input:checked + .checkbox-label {
  color: var(--text-muted);
  text-decoration: line-through;
  text-decoration-color: var(--border-subtle);
}
.checkbox-label { font-size: 15px; line-height: 1.5; color: var(--text-body); cursor: pointer; }

/* ─── Deployment Notes ─── */
.deployment-notes {
  background: var(--surface);
  border: 1px dashed var(--border-subtle);
  border-radius: 8px; padding: 20px 24px; margin: 24px 0 40px;
}
.deployment-notes-title {
  font-size: 16px; font-weight: 700;
  color: var(--text-heading); margin-bottom: 12px;
}
.deployment-notes-intro { color: var(--text-secondary); font-style: italic; margin-bottom: 12px; }

.notes-input {
  display: block; width: 100%; padding: 8px 12px; margin-top: 4px;
  font-family: var(--font-mono); font-size: 13px;
  border: 1px solid var(--border-subtle); border-radius: 6px;
  background: var(--checkbox-bg); color: var(--text-body);
  resize: vertical; min-height: 36px;
}
.notes-input:focus { outline: 2px solid var(--color-blue-500); outline-offset: 1px; border-color: var(--color-blue-500); }

/* ─── Diagrams ─── */
.diagram-container {
  margin: 24px 0; padding: 20px;
  border: 1px solid var(--border); border-radius: 8px;
  background: var(--surface); min-height: 100px;
  display: flex; align-items: center; justify-content: center;
}

/* ─── Walkthrough Header ─── */
.walkthrough-header { margin-bottom: 24px; }
.walkthrough-title { font-size: 28px; }

.intro-section { margin-bottom: 32px; }

/* ─── Print ─── */
@media print {
  .sidebar { display: none; }
  .hamburger { display: none; }
  .expandable-content { display: block !important; }
  .copy-btn { display: none; }
  .code-block { break-inside: avoid; }
  .phase-header { break-before: page; }
  .callout { break-inside: avoid; }
  .data-table { break-inside: avoid; }
  [data-theme] { color-scheme: light; }
  body { font-size: 12px; max-width: none; }
  .main-content { margin-left: 0; max-width: none; padding: 20px; }
}

/* ─── Responsive ─── */
@media (max-width: 1023px) {
  .sidebar { width: 240px; }
  .main-content { margin-left: 240px; padding: 48px 24px; }
  .phase-title { font-size: 24px; }
}

@media (max-width: 767px) {
  .sidebar {
    width: 280px;
    transform: translateX(-100%);
    transition: transform 200ms ease;
  }
  .sidebar.open { transform: translateX(0); }
  .sidebar-backdrop.open { display: block; }
  .hamburger { display: flex; }
  .main-content { margin-left: 0; padding: 60px 20px 48px; }
  .phase-title { font-size: 22px; }
}
`;
}

// ─── JavaScript ─────────────────────────────────────────────────────────────────

function buildJS() {
  return `
(function() {
  'use strict';

  // ─── Theme Toggle ───
  const html = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const THEME_KEY = 'walkthrough-theme';

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    // Dispatch event for diagram re-rendering
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
  }

  // Initialize theme
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) {
    setTheme(savedTheme);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setTheme('dark');
  } else {
    setTheme('dark'); // Default dark
  }

  themeToggle.addEventListener('click', function() {
    const current = html.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });

  // ─── Copy to Clipboard ───
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('.copy-btn');
    if (!btn) return;
    const block = btn.closest('.code-block');
    const code = block.querySelector('code');
    navigator.clipboard.writeText(code.textContent).then(function() {
      btn.classList.add('copied');
      btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20,6 9,17 4,12"/></svg>';
      setTimeout(function() {
        btn.classList.remove('copied');
        btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>';
      }, 2000);
    });
  });

  // ─── Expandable Sections ───
  document.querySelectorAll('.expandable-trigger').forEach(function(trigger) {
    trigger.addEventListener('click', function() {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !expanded);
      const content = this.nextElementSibling;
      content.style.display = expanded ? 'none' : 'block';
    });
  });

  // ─── Checkbox Persistence ───
  document.querySelectorAll('.checkbox-input').forEach(function(cb) {
    const key = cb.getAttribute('data-key');
    if (!key) return;
    // Restore
    const saved = localStorage.getItem(key);
    if (saved === 'true') cb.checked = true;
    // Save on change
    cb.addEventListener('change', function() {
      localStorage.setItem(key, this.checked);
      updateProgress();
    });
  });

  // ─── Scroll Spy ───
  const navItems = document.querySelectorAll('.nav-item[data-target]');
  const sections = [];
  navItems.forEach(function(item) {
    const target = item.getAttribute('data-target');
    if (target === 'top') return;
    const el = document.getElementById(target);
    if (el) sections.push({ el: el, navItem: item });
  });

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        navItems.forEach(function(ni) { ni.classList.remove('active'); });
        const match = sections.find(function(s) { return s.el === entry.target; });
        if (match) match.navItem.classList.add('active');
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  sections.forEach(function(s) { observer.observe(s.el); });

  // ─── Smooth scroll on nav click ───
  navItems.forEach(function(item) {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      const target = this.getAttribute('data-target');
      if (target === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const el = document.getElementById(target);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
      // Close mobile sidebar
      sidebar.classList.remove('open');
      backdrop.classList.remove('open');
    });
  });

  // ─── Mobile Hamburger ───
  const sidebar = document.getElementById('sidebar');
  const hamburger = document.getElementById('hamburger');
  const backdrop = document.getElementById('sidebar-backdrop');

  hamburger.addEventListener('click', function() {
    sidebar.classList.toggle('open');
    backdrop.classList.toggle('open');
  });
  backdrop.addEventListener('click', function() {
    sidebar.classList.remove('open');
    backdrop.classList.remove('open');
  });

  // ─── Phase Completion & Progress ───
  function updateProgress() {
    const phaseSections = document.querySelectorAll('.phase-section');
    let completedPhases = 0;

    phaseSections.forEach(function(section) {
      const phaseId = section.getAttribute('data-phase');
      const checkboxes = section.querySelectorAll('.checkbox-input');
      if (checkboxes.length === 0) return;
      const allChecked = Array.from(checkboxes).every(function(cb) { return cb.checked; });
      const navItem = document.querySelector('.nav-item[data-phase="' + phaseId + '"]');
      if (navItem) {
        if (allChecked) {
          navItem.classList.add('completed');
          completedPhases++;
        } else {
          navItem.classList.remove('completed');
        }
      }
    });

    const total = phaseSections.length;
    const fill = document.getElementById('progress-fill');
    const label = document.getElementById('progress-label');
    if (fill) fill.style.width = (completedPhases / total * 100) + '%';
    if (label) label.textContent = 'Phase ' + completedPhases + ' of ' + total + ' complete';
  }

  updateProgress();
})();
`;
}

// ─── Assemble HTML ──────────────────────────────────────────────────────────────

let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OpenClaw Deployment Walkthrough</title>
  <style>${buildCSS()}</style>
</head>
<body>

<!-- Mobile hamburger -->
<button class="hamburger" id="hamburger" aria-label="Toggle navigation">
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
</button>

<!-- Sidebar backdrop (mobile) -->
<div class="sidebar-backdrop" id="sidebar-backdrop"></div>

<!-- Overview diagram placeholder -->
<div id="diagram-phase-overview" class="diagram-container" style="display:none"><noscript>Diagram: phase overview</noscript></div>

${buildNav()}

<main class="main-content" id="main-content">
${renderPrePhase()}
`;

// Render all phases
for (const phase of phases) {
  html += renderPhase(phase);
}

// Render appendix
html += renderAppendix();

html += `</main>

<script>${buildJS()}</script>
</body>
</html>`;

writeFileSync(outPath, html, 'utf-8');

// Verification
const phaseCount = phases.length;
const phaseIds = phases.map(p => p.id);
const lineCount = html.split('\n').length;
const sizeKB = Math.round(html.length / 1024);

console.log('Generated index.html successfully');
console.log(`  Phases: ${phaseCount} (${phaseIds.join(', ')})`);
console.log(`  Lines: ${lineCount}`);
console.log(`  Size: ${sizeKB} KB`);
console.log(`  Has appendix: ${appendixBlocks.length > 0}`);
console.log(`  Pre-phase sections: ${topSections.length} (${topSections.map(s => s.title).join(', ')})`);
