// diagrams.js — 8 diagram rendering functions for the interactive walkthrough
// Dependencies: Rough.js (window.rough) and Mermaid (window.mermaid) loaded via CDN

// ─── Theme helper ───────────────────────────────────────────────────────────

function getThemeColors() {
  var isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  return {
    isDark: isDark,
    bg: isDark ? '#1a1a2e' : '#fafaf9',
    surface: isDark ? '#16213e' : '#f5f5f4',
    surfaceRaised: isDark ? '#1f2b47' : '#e7e5e4',
    border: isDark ? '#2a3a5c' : '#d6d3d1',
    textPrimary: isDark ? '#e2e8f0' : '#292524',
    textSecondary: isDark ? '#94a3b8' : '#a8a29e',
    blue: isDark ? '#60a5fa' : '#3b82f6',
    blueFill: isDark ? '#1e3a5f' : '#dbeafe',
    red: isDark ? '#f87171' : '#ef4444',
    redFill: isDark ? '#5f1e1e' : '#fee2e2',
    green: isDark ? '#4ade80' : '#22c55e',
    greenFill: isDark ? '#1e3f2a' : '#dcfce7',
    neutral: isDark ? '#94a3b8' : '#a8a29e',
    neutralFill: isDark ? '#1f2b47' : '#f5f5f4',
    amber: isDark ? '#fbbf24' : '#f59e0b',
    amberFill: isDark ? '#3f3520' : '#fef3c7',
  };
}

var roughDefaults = {
  roughness: 1.8,
  strokeWidth: 2,
  bowing: 1,
  fillStyle: 'hachure',
  fillWeight: 1.5,
  hachureGap: 6,
  hachureAngle: -41,
};

// ─── Shared utilities ───────────────────────────────────────────────────────

var _resizeTimers = {};

function debounceResize(id, fn) {
  window.addEventListener('resize', function () {
    clearTimeout(_resizeTimers[id]);
    _resizeTimers[id] = setTimeout(fn, 250);
  });
}

function clearContainer(id) {
  var el = document.getElementById(id);
  if (el) el.innerHTML = '';
  return el;
}

function createCanvas(container) {
  var canvas = document.createElement('canvas');
  var w = Math.max(container.clientWidth, 300);
  var dpr = window.devicePixelRatio || 1;
  canvas.style.width = w + 'px';
  canvas.width = w * dpr;
  canvas.style.display = 'block';
  container.appendChild(canvas);
  return { canvas: canvas, width: w, dpr: dpr };
}

function setCanvasHeight(canvas, h, dpr) {
  canvas.height = h * dpr;
  canvas.style.height = h + 'px';
}

function drawLabel(ctx, text, x, y, opts) {
  opts = opts || {};
  var size = opts.size || 13;
  var weight = opts.weight || '600';
  var color = opts.color || getThemeColors().textPrimary;
  var align = opts.align || 'center';
  var baseline = opts.baseline || 'middle';
  ctx.save();
  ctx.font = weight + ' ' + size + 'px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;
  ctx.fillText(text, x, y);
  ctx.restore();
}

function roughRect(rc, x, y, w, h, stroke, fill) {
  return rc.rectangle(x, y, w, h, Object.assign({}, roughDefaults, {
    stroke: stroke,
    fill: fill,
    fillStyle: 'hachure',
  }));
}

function roughEllipse(rc, cx, cy, w, h, stroke, fill) {
  return rc.ellipse(cx, cy, w, h, Object.assign({}, roughDefaults, {
    stroke: stroke,
    fill: fill,
    fillStyle: 'hachure',
  }));
}

// ─── 1. Phase Overview (Mermaid) ────────────────────────────────────────────

window.renderPhaseOverview = function (containerId, currentPhase) {
  var container = clearContainer(containerId);
  if (!container) return;

  var c = getThemeColors();

  var div = document.createElement('div');
  div.className = 'mermaid';
  container.appendChild(div);

  var highlight = currentPhase || '';

  // Color classes by type
  // blue = infrastructure (0, B, C), red = security (A, D, H), green = config (E, F, G), gray = ops (I)
  var def = 'graph TD\n';
  def += '  PF["Pre-Flight Checklist"]:::gray\n';
  def += '  P0["Phase 0: Machine Prep<br/>45-60 min"]:::blue\n';
  def += '  PA["Phase A: macOS Hardening<br/>30 min"]:::red\n';
  def += '  PB["Phase B: Runtime Setup<br/>10 min"]:::blue\n';
  def += '  PC["Phase C: OpenClaw Install<br/>15 min"]:::blue\n';
  def += '  PD["Phase D: Security Hardening<br/>30-45 min"]:::red\n';
  def += '  PE["Phase E: Model Routing<br/>10 min"]:::green\n';
  def += '  PF2["Phase F: Channel Setup<br/>15 min"]:::green\n';
  def += '  PG["Phase G: Skills<br/>15 min"]:::green\n';
  def += '  PH["Phase H: Validation<br/>20 min"]:::red\n';
  def += '  PI["Phase I: Operations<br/>15 min"]:::gray\n';
  def += '  PF --> P0 --> PA --> PB --> PC --> PD --> PE --> PF2 --> PG --> PH --> PI\n';

  // Highlight current phase
  var phaseMap = {
    'pre-flight': 'PF', '0': 'P0', 'A': 'PA', 'B': 'PB', 'C': 'PC',
    'D': 'PD', 'E': 'PE', 'F': 'PF2', 'G': 'PG', 'H': 'PH', 'I': 'PI'
  };
  if (highlight && phaseMap[highlight]) {
    def += '  ' + phaseMap[highlight] + ':::current\n';
  }

  def += '  classDef blue fill:' + c.blueFill + ',stroke:' + c.blue + ',color:' + c.textPrimary + ',stroke-width:2px\n';
  def += '  classDef red fill:' + c.redFill + ',stroke:' + c.red + ',color:' + c.textPrimary + ',stroke-width:2px\n';
  def += '  classDef green fill:' + c.greenFill + ',stroke:' + c.green + ',color:' + c.textPrimary + ',stroke-width:2px\n';
  def += '  classDef gray fill:' + c.neutralFill + ',stroke:' + c.neutral + ',color:' + c.textPrimary + ',stroke-width:2px\n';
  def += '  classDef current fill:' + c.amberFill + ',stroke:' + c.amber + ',color:' + c.textPrimary + ',stroke-width:3px\n';

  div.textContent = def;

  mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    themeVariables: {
      primaryColor: c.blueFill,
      primaryTextColor: c.textPrimary,
      primaryBorderColor: c.blue,
      lineColor: c.neutral,
      secondaryColor: c.surfaceRaised,
      tertiaryColor: c.border,
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      fontSize: '13px',
    },
  });

  mermaid.run({ nodes: [div] });

  debounceResize('phaseOverview', function () {
    window.renderPhaseOverview(containerId, currentPhase);
  });
};

// ─── 2. Machine Transformation (Rough.js) ──────────────────────────────────

window.renderMachineTransformation = function (containerId) {
  var container = clearContainer(containerId);
  if (!container) return;

  var c = getThemeColors();
  var info = createCanvas(container);
  var w = info.width;
  var dpr = info.dpr;
  var h = Math.max(400, w * 0.55);
  setCanvasHeight(info.canvas, h, dpr);

  var ctx = info.canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  var rc = rough.canvas(info.canvas);

  var midX = w / 2;
  var colW = (w - 60) / 2;
  var boxW = Math.min(140, colW * 0.7);
  var boxH = 40;
  var gap = 12;
  var leftX = 20;
  var rightX = midX + 10;
  var startY = 60;

  // Title labels
  drawLabel(ctx, 'Before: Personal Dev Node', leftX + colW / 2, 25,
    { size: 14, weight: '700', color: c.neutral });
  drawLabel(ctx, 'After: Dedicated DevHub', rightX + colW / 2, 25,
    { size: 14, weight: '700', color: c.blue });

  // Divider line
  rc.line(midX, 10, midX, h - 10, Object.assign({}, roughDefaults, {
    stroke: c.border, strokeWidth: 2
  }));

  // Left side items (neutral/gray)
  var leftItems = ['iCloud Sync', 'Google Sessions', 'Ollama LLM', 'Docker: Glances', 'Docker: Dozzle', 'Docker: Portainer', 'FastAPI Projects', 'Scattered Repos'];
  var lBoxX = leftX + (colW - boxW) / 2;
  leftItems.forEach(function (label, i) {
    var y = startY + i * (boxH + gap);
    roughRect(rc, lBoxX, y, boxW, boxH, c.neutral, c.neutralFill);
    drawLabel(ctx, label, lBoxX + boxW / 2, y + boxH / 2,
      { size: 12, color: c.textSecondary });
  });

  // Right side items (blue/secured)
  var rightItems = ['OpenClaw Gateway', 'Docker Sandbox', 'Tailscale Only', 'Homebrew + Node.js', 'Git Configs Only'];
  var rBoxX = rightX + (colW - boxW) / 2;
  rightItems.forEach(function (label, i) {
    var y = startY + i * (boxH + gap);
    roughRect(rc, rBoxX, y, boxW, boxH, c.blue, c.blueFill);
    drawLabel(ctx, label, rBoxX + boxW / 2, y + boxH / 2,
      { size: 12, color: c.textPrimary });
  });

  // Arrow from left to right
  var arrowY = startY + 3.5 * (boxH + gap);
  rc.line(midX - 20, arrowY, midX + 20, arrowY, Object.assign({}, roughDefaults, {
    stroke: c.amber, strokeWidth: 3
  }));
  // Arrowhead
  rc.line(midX + 12, arrowY - 8, midX + 20, arrowY, Object.assign({}, roughDefaults, {
    stroke: c.amber, strokeWidth: 3
  }));
  rc.line(midX + 12, arrowY + 8, midX + 20, arrowY, Object.assign({}, roughDefaults, {
    stroke: c.amber, strokeWidth: 3
  }));

  debounceResize('machineTransform', function () {
    window.renderMachineTransformation(containerId);
  });
};

// ─── 3. Network Topology (Rough.js) ────────────────────────────────────────

window.renderNetworkTopology = function (containerId) {
  var container = clearContainer(containerId);
  if (!container) return;

  var c = getThemeColors();
  var info = createCanvas(container);
  var w = info.width;
  var dpr = info.dpr;
  var h = Math.max(380, w * 0.5);
  setCanvasHeight(info.canvas, h, dpr);

  var ctx = info.canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  var rc = rough.canvas(info.canvas);

  var centerX = w / 2;
  var nodeW = Math.min(160, w * 0.22);
  var nodeH = 50;

  // Three nodes: triangle layout
  var workX = w * 0.2;
  var workY = 50;
  var devX = w * 0.5;
  var devY = 50;
  var mobileX = w * 0.8;
  var mobileY = 50;

  // Draw WorkHub
  roughRect(rc, workX - nodeW / 2, workY, nodeW, nodeH, c.neutral, c.neutralFill);
  drawLabel(ctx, 'WorkHub', workX, workY + nodeH / 2, { size: 13, color: c.textPrimary });
  drawLabel(ctx, '(Primary Mac)', workX, workY + nodeH + 14, { size: 11, weight: '400', color: c.textSecondary });

  // Draw DevHub (center, main focus)
  roughRect(rc, devX - nodeW / 2, devY, nodeW, nodeH, c.blue, c.blueFill);
  drawLabel(ctx, 'DevHub', devX, devY + nodeH / 2, { size: 13, weight: '700', color: c.textPrimary });
  drawLabel(ctx, '(Mac Mini)', devX, devY + nodeH + 14, { size: 11, weight: '400', color: c.textSecondary });

  // Draw MobileHub
  roughRect(rc, mobileX - nodeW / 2, workY, nodeW, nodeH, c.neutral, c.neutralFill);
  drawLabel(ctx, 'MobileHub', mobileX, workY + nodeH / 2, { size: 13, color: c.textPrimary });
  drawLabel(ctx, '(Phone)', mobileX, workY + nodeH + 14, { size: 11, weight: '400', color: c.textSecondary });

  // Tailscale mesh lines (dashed)
  var dashOpts = Object.assign({}, roughDefaults, {
    stroke: c.blue, strokeWidth: 1.5, strokeLineDash: [6, 4]
  });
  rc.line(workX + nodeW / 2 + 4, workY + nodeH / 2, devX - nodeW / 2 - 4, devY + nodeH / 2, dashOpts);
  rc.line(devX + nodeW / 2 + 4, devY + nodeH / 2, mobileX - nodeW / 2 - 4, workY + nodeH / 2, dashOpts);
  rc.line(workX + nodeW / 2 + 4, workY + nodeH + 4, mobileX - nodeW / 2 - 4, workY + nodeH + 4, dashOpts);

  drawLabel(ctx, 'Tailscale Mesh (WireGuard)', centerX, workY + nodeH + 35, { size: 11, weight: '400', color: c.blue });

  // DevHub detail area below
  var detailY = 160;
  var layerH = 44;
  var layerW = Math.min(w - 60, 400);
  var layerX = centerX - layerW / 2;

  drawLabel(ctx, 'DevHub Security Layers', centerX, detailY - 10, { size: 14, weight: '700', color: c.blue });

  // macOS firewall layer
  roughRect(rc, layerX, detailY, layerW, layerH, c.red, c.redFill);
  drawLabel(ctx, 'macOS Firewall (pf) — blocks port 18789 on en0', centerX, detailY + layerH / 2, { size: 12, color: c.textPrimary });

  // Tailscale ACL layer
  roughRect(rc, layerX + 16, detailY + layerH + 8, layerW - 32, layerH, c.red, c.redFill);
  drawLabel(ctx, 'Tailscale ACLs — identity-based access control', centerX, detailY + layerH + 8 + layerH / 2, { size: 12, color: c.textPrimary });

  // Loopback binding
  roughRect(rc, layerX + 32, detailY + 2 * (layerH + 8), layerW - 64, layerH, c.blue, c.blueFill);
  drawLabel(ctx, 'Loopback Bind — 127.0.0.1:18789 only', centerX, detailY + 2 * (layerH + 8) + layerH / 2, { size: 12, color: c.textPrimary });

  // Access labels
  var bottomY = detailY + 3 * (layerH + 8) + 10;
  drawLabel(ctx, 'SSH: Tailscale only', centerX - w * 0.2, bottomY, { size: 11, weight: '400', color: c.neutral });
  drawLabel(ctx, 'Gateway UI: Tailscale Serve (HTTPS)', centerX, bottomY, { size: 11, weight: '400', color: c.blue });
  drawLabel(ctx, 'Telegram: External channel', centerX + w * 0.2, bottomY, { size: 11, weight: '400', color: c.amber });

  debounceResize('networkTopology', function () {
    window.renderNetworkTopology(containerId);
  });
};

// ─── 4. Gateway Architecture (Mermaid) ──────────────────────────────────────

window.renderGatewayArchitecture = function (containerId) {
  var container = clearContainer(containerId);
  if (!container) return;

  var c = getThemeColors();
  var div = document.createElement('div');
  div.className = 'mermaid';
  container.appendChild(div);

  var def = 'graph LR\n';
  def += '  U["User Message"]:::neutral\n';
  def += '  TG["Telegram Channel"]:::neutral\n';
  def += '  GW["Gateway<br/>Auth + Rate Limit"]:::blue\n';
  def += '  AG["Agent<br/>System Prompt"]:::blue\n';
  def += '  TC["Tool Calls"]:::green\n';
  def += '  SB["Docker Sandbox"]:::red\n';
  def += '  TR["Tool Results"]:::green\n';
  def += '  LLM["LLM API<br/>(Claude)"]:::blue\n';
  def += '  R["Response"]:::neutral\n';
  def += '  U --> TG --> GW --> AG --> TC --> SB --> TR --> LLM --> R --> U\n';
  def += '  classDef blue fill:' + c.blueFill + ',stroke:' + c.blue + ',color:' + c.textPrimary + ',stroke-width:2px\n';
  def += '  classDef red fill:' + c.redFill + ',stroke:' + c.red + ',color:' + c.textPrimary + ',stroke-width:2px\n';
  def += '  classDef green fill:' + c.greenFill + ',stroke:' + c.green + ',color:' + c.textPrimary + ',stroke-width:2px\n';
  def += '  classDef neutral fill:' + c.neutralFill + ',stroke:' + c.neutral + ',color:' + c.textPrimary + ',stroke-width:2px\n';

  div.textContent = def;

  mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    themeVariables: {
      primaryColor: c.blueFill,
      primaryTextColor: c.textPrimary,
      primaryBorderColor: c.blue,
      lineColor: c.neutral,
      secondaryColor: c.surfaceRaised,
      tertiaryColor: c.border,
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      fontSize: '13px',
    },
  });

  mermaid.run({ nodes: [div] });

  debounceResize('gatewayArch', function () {
    window.renderGatewayArchitecture(containerId);
  });
};

// ─── 5. Defense In Depth (Rough.js concentric rings) ────────────────────────

window.renderDefenseInDepth = function (containerId) {
  var container = clearContainer(containerId);
  if (!container) return;

  var c = getThemeColors();
  var info = createCanvas(container);
  var w = info.width;
  var dpr = info.dpr;
  var size = Math.min(w, 500);
  var h = size + 40;
  setCanvasHeight(info.canvas, h, dpr);

  var ctx = info.canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  var rc = rough.canvas(info.canvas);

  var cx = w / 2;
  var cy = h / 2;
  var maxR = (size - 40) / 2;

  var rings = [
    { label: 'Network', sub: 'Tailscale + pf firewall', stroke: c.red, fill: c.redFill },
    { label: 'Authentication', sub: 'Gateway token + pairing', stroke: c.red, fill: c.redFill },
    { label: 'Sandbox', sub: 'Docker isolation', stroke: c.amber, fill: c.amberFill },
    { label: 'Approvals', sub: 'exec-approvals.json', stroke: c.amber, fill: c.amberFill },
    { label: 'Policy', sub: 'Tool allow/deny, no ClawHub', stroke: c.blue, fill: c.blueFill },
    { label: 'Agent', sub: '', stroke: c.green, fill: c.greenFill },
  ];

  // Draw rings from outermost to innermost
  for (var i = 0; i < rings.length; i++) {
    var ring = rings[i];
    var rr = maxR * (1 - i * 0.15);
    roughEllipse(rc, cx, cy, rr * 2, rr * 2, ring.stroke, ring.fill);
  }

  // Labels — position along right side of each ring
  for (var j = 0; j < rings.length; j++) {
    var r2 = rings[j];
    var ringR = maxR * (1 - j * 0.15);
    var labelY = cy - ringR + 18;

    drawLabel(ctx, r2.label, cx, labelY,
      { size: 12, weight: '700', color: r2.stroke });
    if (r2.sub) {
      drawLabel(ctx, r2.sub, cx, labelY + 14,
        { size: 10, weight: '400', color: c.textSecondary });
    }
  }

  // Center label
  drawLabel(ctx, 'Agent', cx, cy, { size: 14, weight: '700', color: c.green });
  drawLabel(ctx, '(Protected Core)', cx, cy + 16, { size: 10, weight: '400', color: c.textSecondary });

  debounceResize('defenseDepth', function () {
    window.renderDefenseInDepth(containerId);
  });
};

// ─── 6. Model Routing (Mermaid sequence diagram) ────────────────────────────

window.renderModelRouting = function (containerId) {
  var container = clearContainer(containerId);
  if (!container) return;

  var c = getThemeColors();
  var div = document.createElement('div');
  div.className = 'mermaid';
  container.appendChild(div);

  var def = 'sequenceDiagram\n';
  def += '  participant U as User\n';
  def += '  participant GW as Gateway\n';
  def += '  participant R as Router\n';
  def += '  participant CO as Claude Opus\n';
  def += '  participant FB as Fallback Model\n';
  def += '  U->>GW: Send message\n';
  def += '  GW->>GW: Authenticate\n';
  def += '  GW->>R: Route request\n';
  def += '  R->>R: Check agent config\n';
  def += '  R->>CO: Forward to primary (Opus)\n';
  def += '  alt Opus responds\n';
  def += '    CO-->>GW: Response\n';
  def += '  else Opus fails\n';
  def += '    CO--xR: Error/timeout\n';
  def += '    R->>FB: Forward to fallback\n';
  def += '    FB-->>GW: Response\n';
  def += '  end\n';
  def += '  GW-->>U: Deliver response\n';
  def += '  Note over R,FB: Day 1: Everything goes to Opus.<br/>Fallback routing is future optimization.\n';

  div.textContent = def;

  mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    themeVariables: {
      primaryColor: c.blueFill,
      primaryTextColor: c.textPrimary,
      primaryBorderColor: c.blue,
      lineColor: c.neutral,
      secondaryColor: c.surfaceRaised,
      tertiaryColor: c.border,
      noteBkgColor: c.amberFill,
      noteTextColor: c.textPrimary,
      noteBorderColor: c.amber,
      actorBkg: c.blueFill,
      actorBorder: c.blue,
      actorTextColor: c.textPrimary,
      signalColor: c.textPrimary,
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      fontSize: '13px',
    },
  });

  mermaid.run({ nodes: [div] });

  debounceResize('modelRouting', function () {
    window.renderModelRouting(containerId);
  });
};

// ─── 7. Skill Security (Rough.js comparison) ───────────────────────────────

window.renderSkillSecurity = function (containerId) {
  var container = clearContainer(containerId);
  if (!container) return;

  var c = getThemeColors();
  var info = createCanvas(container);
  var w = info.width;
  var dpr = info.dpr;
  var h = Math.max(360, w * 0.5);
  setCanvasHeight(info.canvas, h, dpr);

  var ctx = info.canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  var rc = rough.canvas(info.canvas);

  var midX = w / 2;
  var colW = (w - 60) / 2;
  var boxW = Math.min(150, colW * 0.8);
  var boxH = 42;
  var gap = 12;
  var leftX = 15;
  var rightX = midX + 15;

  // Titles
  drawLabel(ctx, 'Custom Markdown Skills', leftX + colW / 2, 25,
    { size: 14, weight: '700', color: c.green });
  drawLabel(ctx, 'ClawHub Marketplace', rightX + colW / 2, 25,
    { size: 14, weight: '700', color: c.red });

  // Subtitles
  drawLabel(ctx, 'You wrote it, you trust it', leftX + colW / 2, 44,
    { size: 11, weight: '400', color: c.textSecondary });

  // Wall between them
  var wallX = midX;
  rc.rectangle(wallX - 4, 10, 8, h - 20, Object.assign({}, roughDefaults, {
    stroke: c.red, fill: c.redFill, fillStyle: 'cross-hatch',
  }));

  var startY = 70;

  // Left side — safe skills (green)
  var safeSkills = ['Heartbeat', 'Status Check', 'Custom Skill 1', 'Custom Skill 2'];
  var lBoxX = leftX + (colW - boxW) / 2;
  safeSkills.forEach(function (label, i) {
    var y = startY + i * (boxH + gap);
    roughRect(rc, lBoxX, y, boxW, boxH, c.green, c.greenFill);
    // Checkmark icon
    drawLabel(ctx, '\u2713 ' + label, lBoxX + boxW / 2, y + boxH / 2,
      { size: 12, color: c.textPrimary });
  });

  // Right side — dangerous ClawHub (red)
  var dangerSkills = ['824+ Malicious Skills', 'ClawHavoc Campaign', 'Atomic macOS Stealer'];
  var rBoxX = rightX + (colW - boxW) / 2;
  dangerSkills.forEach(function (label, i) {
    var y = startY + i * (boxH + gap);
    roughRect(rc, rBoxX, y, boxW, boxH, c.red, c.redFill);
    drawLabel(ctx, '\u26A0 ' + label, rBoxX + boxW / 2, y + boxH / 2,
      { size: 12, color: c.textPrimary });
  });

  // Big X over ClawHub side
  var xTop = startY - 10;
  var xBot = startY + 3 * (boxH + gap) + boxH + 10;
  rc.line(rBoxX - 10, xTop, rBoxX + boxW + 10, xBot, Object.assign({}, roughDefaults, {
    stroke: c.red, strokeWidth: 4
  }));
  rc.line(rBoxX + boxW + 10, xTop, rBoxX - 10, xBot, Object.assign({}, roughDefaults, {
    stroke: c.red, strokeWidth: 4
  }));

  // Bottom label
  var ruleY = h - 30;
  drawLabel(ctx, 'Day 1 Rule: Zero ClawHub Skills', midX, ruleY,
    { size: 15, weight: '700', color: c.red });

  debounceResize('skillSecurity', function () {
    window.renderSkillSecurity(containerId);
  });
};

// ─── 8. Validation Dashboard (interactive HTML) ─────────────────────────────

window.renderValidationDashboard = function (containerId) {
  var container = clearContainer(containerId);
  if (!container) return;

  var c = getThemeColors();

  var STORAGE_KEY = 'walkthrough-validation';

  var conditions = [
    'Gateway version >= 2026.2.19',
    'Loopback bind confirmed (127.0.0.1 only)',
    'No ClawHub skills installed',
    'Docker sandbox enabled and running',
    'exec-approvals.json blocks dangerous commands',
    'Elevated mode disabled',
    'DM policy is "pairing"',
    'Tailscale is running and connected',
    'macOS firewall (pf) enabled',
    'File permissions locked down',
  ];

  // Load saved state
  var saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch (e) {
    saved = {};
  }

  // Wrapper
  var wrapper = document.createElement('div');
  wrapper.style.cssText = 'font-family:-apple-system,BlinkMacSystemFont,sans-serif;';

  // Summary bar
  var summary = document.createElement('div');
  summary.style.cssText = 'padding:12px 16px;margin-bottom:16px;border-radius:8px;' +
    'background:' + c.surfaceRaised + ';border:1px solid ' + c.border + ';' +
    'display:flex;align-items:center;gap:12px;';
  wrapper.appendChild(summary);

  var summaryText = document.createElement('span');
  summaryText.style.cssText = 'font-size:15px;font-weight:700;color:' + c.textPrimary + ';flex:1;';
  summary.appendChild(summaryText);

  var summaryBar = document.createElement('div');
  summaryBar.style.cssText = 'width:120px;height:6px;border-radius:3px;background:' + c.border + ';overflow:hidden;';
  summary.appendChild(summaryBar);

  var summaryFill = document.createElement('div');
  summaryFill.style.cssText = 'height:100%;border-radius:3px;transition:width 200ms ease;';
  summaryBar.appendChild(summaryFill);

  function updateSummary() {
    var passed = 0;
    conditions.forEach(function (_, i) {
      if (saved[i] === 'pass') passed++;
    });
    summaryText.textContent = passed + '/10 conditions passed';
    summaryFill.style.width = (passed / 10 * 100) + '%';
    summaryFill.style.background = passed === 10 ? c.green : c.blue;
  }

  // List
  var list = document.createElement('div');
  list.style.cssText = 'display:flex;flex-direction:column;gap:6px;';
  wrapper.appendChild(list);

  conditions.forEach(function (label, idx) {
    var state = saved[idx] || 'untested';

    var row = document.createElement('div');
    row.style.cssText = 'display:flex;align-items:center;gap:10px;padding:10px 14px;' +
      'border-radius:8px;border:1px solid ' + c.border + ';background:' + c.surface + ';';

    var indicator = document.createElement('span');
    indicator.style.cssText = 'width:10px;height:10px;border-radius:50%;flex-shrink:0;';

    function setIndicator(s) {
      if (s === 'pass') {
        indicator.style.background = c.green;
      } else if (s === 'fail') {
        indicator.style.background = c.red;
      } else {
        indicator.style.background = c.neutral;
      }
    }
    setIndicator(state);

    var text = document.createElement('span');
    text.style.cssText = 'flex:1;font-size:14px;color:' + c.textPrimary + ';';
    text.textContent = label;

    var btn = document.createElement('button');
    btn.style.cssText = 'padding:4px 10px;border-radius:4px;border:1px solid ' + c.border + ';' +
      'background:transparent;color:' + c.textSecondary + ';cursor:pointer;font-size:11px;' +
      'font-family:-apple-system,sans-serif;font-weight:600;';

    function setBtn(s) {
      if (s === 'pass') {
        btn.textContent = 'Pass';
        btn.style.color = c.green;
        btn.style.borderColor = c.green;
      } else if (s === 'fail') {
        btn.textContent = 'Fail';
        btn.style.color = c.red;
        btn.style.borderColor = c.red;
      } else {
        btn.textContent = 'Untested';
        btn.style.color = c.textSecondary;
        btn.style.borderColor = c.border;
      }
    }
    setBtn(state);

    btn.addEventListener('click', (function (index) {
      return function () {
        var cur = saved[index] || 'untested';
        var next = cur === 'untested' ? 'pass' : cur === 'pass' ? 'fail' : 'untested';
        saved[index] = next;
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
        } catch (e) { /* ignore */ }
        setIndicator(next);
        setBtn(next);
        updateSummary();
      };
    })(idx));

    row.appendChild(indicator);
    row.appendChild(text);
    row.appendChild(btn);
    list.appendChild(row);
  });

  container.appendChild(wrapper);
  updateSummary();

  // No resize needed for DOM-based component, but register anyway for consistency
  debounceResize('validationDash', function () {
    // DOM-based, no re-render needed — colors may change on theme switch though
    window.renderValidationDashboard(containerId);
  });
};
