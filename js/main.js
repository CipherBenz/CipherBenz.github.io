/**
 * main.js — Cybersecurity Command Center Core Controller
 */

import { startRain } from './rain.js';
import { initGlobe } from './globe.js';
import { sound } from './sound.js';
import {
  profile, socials, stats, projects, archive, capabilities, hexSkills,
  experience, certificates, terminalScript, manualHelp
} from './data.js';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const SCRAMBLE_CHARS = '!<>-_\\/[]{}=+*^?#01ABCDEF@$%&';

const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ------------------------------------------------------------------ *
 * 1. Boot Sequence
 * ------------------------------------------------------------------ */
const BOOT_LINES = [
  'CIPHERBENZ-BIOS v5.2 // KERNEL INTEGRITY OK',
  'mounting /dev/cipher-storage ... [ <span class="c">OK</span> ]',
  'loading modules: [ rf-pentest ] [ offsec ] [ appsec ] ... [ <span class="c">OK</span> ]',
  'initiating TLS 1.3 encrypted handshake ... [ <span class="c">ESTABLISHED</span> ]',
  'verifying operator keys: Athulyanath (eJPT / CEH / Sec+) ... [ <span class="c">VERIFIED</span> ]',
  'spinning up threat radar telemetry ... [ <span class="c">ONLINE</span> ]',
  'authorizing session://cipherbenz [Chennai Node] ... [ <span class="c">GRANTED</span> ]'
];

function runBootSequence() {
  const boot = $('#boot');
  const log = $('#boot-log');
  const bar = $('#boot-bar');
  if (!boot) return;

  let lineIdx = 0;
  let finished = false;

  const finish = () => {
    if (finished) return;
    finished = true;
    boot.classList.add('is-done');
    document.body.classList.remove('is-booting');
    sound.playSuccess();
    initPage();
    setTimeout(() => boot.remove(), 700);
  };

  const skipHandler = (e) => {
    finish();
    window.removeEventListener('keydown', skipHandler);
    window.removeEventListener('click', skipHandler);
  };
  window.addEventListener('keydown', skipHandler);
  window.addEventListener('click', skipHandler);

  function printLine() {
    if (finished) return;
    if (lineIdx < BOOT_LINES.length) {
      const line = document.createElement('div');
      line.innerHTML = `<span class="prompt">&gt;</span> ${BOOT_LINES[lineIdx]}`;
      log.appendChild(line);
      sound.playClick();
      lineIdx++;
      const progress = (lineIdx / BOOT_LINES.length) * 100;
      bar.style.width = `${progress}%`;
      setTimeout(printLine, 140 + Math.random() * 80);
    } else {
      setTimeout(finish, 350);
    }
  }

  printLine();
}

/* ------------------------------------------------------------------ *
 * 2. Scramble Text FX
 * ------------------------------------------------------------------ */
function scrambleText(el, targetText = null, duration = 600) {
  const original = targetText || el.dataset.scramble || el.textContent;
  let start = performance.now();
  let frame;

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const charsRevealed = Math.floor(progress * original.length);

    let output = '';
    for (let i = 0; i < original.length; i++) {
      if (i < charsRevealed) {
        output += original[i];
      } else {
        output += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }
    }
    el.textContent = output;

    if (progress < 1) {
      frame = requestAnimationFrame(update);
    } else {
      el.textContent = original;
    }
  }

  frame = requestAnimationFrame(update);
}

/* ------------------------------------------------------------------ *
 * 3. Typewriter Animation for Hero Roles
 * ------------------------------------------------------------------ */
function runTypewriter(roles) {
  const el = $('#typer');
  if (!el || !roles.length) return;

  let rIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function tick() {
    const current = roles[rIdx];
    if (isDeleting) {
      charIdx--;
      el.textContent = current.substring(0, charIdx);
      if (charIdx <= 0) {
        isDeleting = false;
        rIdx = (rIdx + 1) % roles.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, 35);
    } else {
      charIdx++;
      el.textContent = current.substring(0, charIdx);
      if (charIdx >= current.length) {
        isDeleting = true;
        setTimeout(tick, 2200);
        return;
      }
      setTimeout(tick, 65 + Math.random() * 40);
    }
  }

  tick();
}

/* ------------------------------------------------------------------ *
 * 4. Telemetry Metric Counters
 * ------------------------------------------------------------------ */
function renderCounters() {
  const container = $('#counters');
  if (!container) return;

  container.innerHTML = stats.map(s => `
    <div class="counter-card glass">
      <div class="c-val"><span class="c-num" data-val="${s.value}">${s.value}</span><span class="c-suf">${s.suffix}</span></div>
      <div class="c-label mono">${esc(s.label)}</div>
    </div>
  `).join('');

  // Animate on intersection
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        $$('.c-num', container).forEach(animateCounter);
        observer.disconnect();
      }
    });
  }, { threshold: 0.2 });

  observer.observe(container);
}

function animateCounter(el) {
  const target = parseFloat(el.dataset.val);
  const isFloat = target % 1 !== 0;
  let current = 0;
  const duration = 1200;
  const startTime = performance.now();

  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);
    current = target * easeOut;
    el.textContent = isFloat ? current.toFixed(1) : Math.floor(current);

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  }

  requestAnimationFrame(update);
}

/* ------------------------------------------------------------------ *
 * 5. Interactive Command Center Shell (Terminal)
 * ------------------------------------------------------------------ */
function setupTerminal() {
  const term = $('#terminal');
  const body = $('#term-body');
  const form = $('#term-form');
  const input = $('#term-cmd');
  const modeBadge = $('#term-mode');
  if (!term || !body || !form || !input) return;

  let scriptIdx = 0;
  let autoTimer = null;
  let isInteractive = false;

  function setMode(interactive) {
    isInteractive = interactive;
    if (modeBadge) {
      modeBadge.textContent = interactive ? 'INTERACTIVE' : 'AUTO-DEMO';
      modeBadge.className = `term-mode mono ${interactive ? 'mode-live' : 'mode-auto'}`;
    }
  }

  function appendLine(html, isCmd = false) {
    const p = document.createElement('div');
    p.className = `t-line ${isCmd ? 't-cmd' : 't-out'}`;
    p.innerHTML = html;
    body.appendChild(p);
    body.scrollTop = body.scrollHeight;
  }

  // Auto demonstration loop
  function runAutoScript() {
    if (isInteractive) return;
    const step = terminalScript[scriptIdx];
    appendLine(`<span class="ps1">cipherbenz@chennai-node:~$</span> <span class="typing">${esc(step.cmd)}</span>`, true);
    sound.playClick();

    setTimeout(() => {
      if (isInteractive) return;
      step.out.forEach(o => {
        appendLine(o
          .replace(/<ok>(.*?)<\/ok>/g, '<span class="ok">$1</span>')
          .replace(/<warn>(.*?)<\/warn>/g, '<span class="warn">$1</span>')
          .replace(/<dim>(.*?)<\/dim>/g, '<span class="dim">$1</span>')
        );
      });
      sound.playClick();

      scriptIdx = (scriptIdx + 1) % terminalScript.length;
      autoTimer = setTimeout(runAutoScript, 4200);
    }, 600);
  }

  autoTimer = setTimeout(runAutoScript, 1200);

  // Switch to manual mode on click/focus
  term.addEventListener('click', () => {
    input.focus();
    if (!isInteractive) {
      setMode(true);
      clearTimeout(autoTimer);
      appendLine('<span class="dim">// Interactive mode engaged. Type "help" for command list.</span>');
    }
  });

  // Handle User Input
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const cmd = input.value.trim();
    if (!cmd) return;

    input.value = '';
    setMode(true);
    clearTimeout(autoTimer);
    sound.playClick();

    appendLine(`<span class="ps1">cipherbenz@chennai-node:~$</span> <b>${esc(cmd)}</b>`, true);
    executeCommand(cmd.toLowerCase());
  });

  function executeCommand(raw) {
    const parts = raw.split(' ');
    const cmd = parts[0];
    const arg = parts.slice(1).join(' ');

    switch (cmd) {
      case 'help':
        appendLine(manualHelp);
        sound.playSuccess();
        break;

      case 'whoami':
        appendLine(`
          <div class="card-out">
            <b style="color:var(--cyan);">${esc(profile.name)}</b> [${esc(profile.callsign)}]
            <div>Role: ${esc(profile.roles.join(' • '))}</div>
            <div>Clearance: <span style="color:var(--green);">${esc(profile.clearance)}</span></div>
            <div>Status: <span style="color:var(--magenta);">${esc(profile.status)}</span></div>
            <div class="dim">${esc(profile.lede)}</div>
          </div>
        `);
        sound.playDecrypt();
        break;

      case 'projects':
        appendLine('<b style="color:var(--cyan);">[+] CLASSIFIED OPERATIONS ARCHIVE:</b>');
        projects.forEach(p => {
          appendLine(`  • <span style="color:var(--magenta);">${esc(p.id)}</span>: <b>${esc(p.title)}</b> [${esc(p.metric)}]`);
        });
        appendLine('<span class="dim">Run "cat &lt;id&gt;" for detailed mission spec, or view below in #projects</span>');
        break;

      case 'cat':
        if (!arg) {
          appendLine('<span class="warn">Usage: cat &lt;project-id&gt; (e.g. cat cve-sentinel)</span>');
          return;
        }
        const proj = projects.find(p => p.id === arg || p.id.includes(arg));
        if (proj) {
          appendLine(`
            <div class="card-out">
              <b style="color:var(--cyan);">${esc(proj.title)}</b> [${esc(proj.classification)}]
              <p>${esc(proj.summary)}</p>
              <div>Stack: <span style="color:var(--green);">${esc(proj.stack.join(', '))}</span></div>
              <div>Metric: <b style="color:var(--magenta);">${esc(proj.metric)}</b></div>
            </div>
          `);
          sound.playDecrypt();
        } else {
          appendLine(`<span class="warn">cat: ${esc(arg)}: No such file or directory</span>`);
        }
        break;

      case 'skills':
        appendLine('<b style="color:var(--cyan);">[+] ARSENAL SPECIFICATIONS:</b>');
        capabilities.forEach(c => {
          appendLine(`  [${esc(c.code)}] <b>${esc(c.title)}</b> (${c.level}%): ${c.tools.join(', ')}`);
        });
        break;

      case 'certs':
        appendLine('<b style="color:var(--cyan);">[+] CRYPTOGRAPHIC CLEARANCES:</b>');
        certificates.forEach(c => {
          appendLine(`  • <span style="color:${c.badgeColor};">[${esc(c.short)}]</span> <b>${esc(c.title)}</b> (${esc(c.issuer)}) - <i>${esc(c.verifyCode)}</i>`);
        });
        break;

      case 'contact':
        appendLine(`
          Secure Email: <a href="mailto:${esc(profile.email)}" style="color:var(--cyan); text-decoration:underline;">${esc(profile.email)}</a>
          PGP Key ID: 0x98A1B2C3D4E5F6
          Socials: ${socials.map(s => `<a href="${s.href}" target="_blank" style="color:var(--green); margin-right:8px;">[${s.label}]</a>`).join(' ')}
        `);
        break;

      case 'github':
        appendLine('<span class="ok">[+] Redirecting to GitHub profile: <a href="https://github.com/CipherBenz" target="_blank" style="color:var(--cyan); text-decoration:underline;">https://github.com/CipherBenz</a></span>');
        window.open('https://github.com/CipherBenz', '_blank');
        sound.playSuccess();
        break;

      case 'rf':
        appendLine('[*] Scanning Sub-GHz & 2.4GHz spectrum via ESP32 / HackRF...');
        setTimeout(() => {
          appendLine('<ok>[+] 433.92MHz signal captured: KeeLoq rolling code frame detected.</ok>');
          appendLine('<ok>[+] 2.4GHz: 12 Wi-Fi APs detected, 2 hidden SSIDs unmasked.</ok>');
          sound.playSuccess();
        }, 600);
        break;

      case 'cve':
        appendLine('<span class="warn">[!] INTERCEPTED CVE BROADCAST:</span>');
        appendLine('CVE-2025-9921: Zero-Click RCE in Kerberos Authentication Broker (CVSS 9.8 Critical)');
        appendLine('Mitigation: Patch KB894210 or enforce SMB signing & LDAP channel binding immediately.');
        break;

      case 'scan':
        const target = arg || '192.168.1.1';
        appendLine(`Starting Nmap scan on ${esc(target)}...`);
        setTimeout(() => {
          appendLine(`Host ${esc(target)} is UP (0.0034s latency).`);
          appendLine('PORT 22/tcp OPEN (OpenSSH), PORT 443/tcp OPEN (TLS 1.3), PORT 8080/tcp OPEN (Proxy).');
          sound.playSuccess();
        }, 500);
        break;

      case 'matrix':
        appendLine('<span class="ok">[+] Matrix glyph rain frequency amplified.</span>');
        sound.playDecrypt();
        break;

      case 'sudo':
        appendLine('<span class="warn">operator is in the sudoers file. Incident reported to sysadmin. Just kidding, access granted: #</span>');
        sound.playSuccess();
        break;

      case 'date':
        appendLine(new Date().toUTCString());
        break;

      case 'uptime':
        appendLine('system uptime: 420 days, 13 hours, 37 mins. 0 crashes reported.');
        break;

      case 'clear':
        body.innerHTML = '';
        break;

      default:
        appendLine(`<span class="warn">command not found: "${esc(raw)}". Type "help" for a list of available commands.</span>`);
    }
  }
}

/* ------------------------------------------------------------------ *
 * 6. Projects & Classified Files
 * ------------------------------------------------------------------ */
function renderProjects() {
  const grid = $('#project-grid');
  const filtersContainer = $('#filters');
  const archiveContainer = $('#archive');
  if (!grid) return;

  const categories = ['ALL', ...new Set(projects.map(p => p.category))];

  // Render Filters
  if (filtersContainer) {
    filtersContainer.innerHTML = categories.map((cat, idx) => `
      <button class="filter-btn ${idx === 0 ? 'is-active' : ''}" data-cat="${cat}">
        [${cat}]
      </button>
    `).join('');

    $$('.filter-btn', filtersContainer).forEach(btn => {
      btn.addEventListener('click', () => {
        sound.playClick();
        $$('.filter-btn', filtersContainer).forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const filter = btn.dataset.cat;
        filterProjects(filter);
      });
    });
  }

  function renderCards(items) {
    grid.innerHTML = items.map(p => `
      <article class="proj-card glass reveal" data-id="${p.id}">
        <div class="card-glow"></div>
        <div class="card-head">
          <span class="classification mono">${esc(p.classification)}</span>
          <span class="year mono">${esc(p.year)}</span>
        </div>
        <h3 class="proj-title" data-scramble="${esc(p.title)}">${esc(p.title)}</h3>
        <p class="proj-summary">${esc(p.summary)}</p>
        <div class="proj-meta">
          <span class="metric mono">${esc(p.metric)}</span>
        </div>
        <div class="proj-tags mono">
          ${p.stack.map(s => `<span class="tag">${esc(s)}</span>`).join('')}
        </div>
        <div class="proj-links mono">
          <button class="brief-btn" data-brief="${p.id}">[ OPEN BRIEFING ]</button>
          ${p.links.map(l => `<a href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>`).join('')}
        </div>
      </article>
    `).join('');

    // Attach scramble on hover
    $$('.proj-card', grid).forEach(card => {
      const title = $('.proj-title', card);
      card.addEventListener('mouseenter', () => {
        sound.playDecrypt();
        if (title) scrambleText(title);
      });
    });

    // Attach briefing modal
    $$('.brief-btn', grid).forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.brief;
        const project = projects.find(p => p.id === id);
        if (project) openProjectModal(project);
      });
    });
  }

  function filterProjects(cat) {
    if (cat === 'ALL') {
      renderCards(projects);
    } else {
      renderCards(projects.filter(p => p.category === cat));
    }
  }

  renderCards(projects);

  // Render Archive Listing
  if (archiveContainer) {
    archiveContainer.innerHTML = archive.map(a => `
      <li class="archive-row mono">
        <span class="a-name"><a href="${esc(a.href)}" target="_blank" rel="noopener">${esc(a.name)}</a></span>
        <span class="a-desc">${esc(a.note)}</span>
        <span class="a-lang">${esc(a.lang)}</span>
        <span class="a-stars">★ ${a.stars}</span>
      </li>
    `).join('');
  }
}

/* ------------------------------------------------------------------ *
 * 7. Project Briefing Modal
 * ------------------------------------------------------------------ */
function setupModal() {
  const modal = $('#modal');
  const closeBtn = $('#modal-close');
  if (!modal || !closeBtn) return;

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('is-open');
    sound.playClick();
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('is-open');
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      modal.classList.remove('is-open');
    }
  });
}

function openProjectModal(p) {
  const modal = $('#modal');
  const title = $('#modal-title');
  const body = $('#modal-body');
  if (!modal || !title || !body) return;

  sound.playDecrypt();
  title.textContent = p.title;
  body.innerHTML = `
    <div class="modal-class mono">${esc(p.classification)} // ${esc(p.year)}</div>
    <div class="modal-sec">
      <h4>MISSION OVERVIEW</h4>
      <p>${esc(p.summary)}</p>
    </div>
    <div class="modal-sec">
      <h4>OPERATIONAL ARCHITECTURE & IMPACT</h4>
      <p>${esc(p.detail)}</p>
    </div>
    <div class="modal-stats mono">
      <div><b>METRIC:</b> ${esc(p.metric)}</div>
      <div><b>TECH ARSENAL:</b> ${esc(p.stack.join(' • '))}</div>
    </div>
    <div class="modal-actions mono">
      ${p.links.map(l => `<a class="btn btn-primary" href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>`).join('')}
    </div>
  `;

  modal.classList.add('is-open');
}

/* ------------------------------------------------------------------ *
 * 8. Arsenal: Capabilities & Hex Matrix
 * ------------------------------------------------------------------ */
function renderArsenal() {
  const capGrid = $('#cap-grid');
  const hexGrid = $('#hex-grid');

  if (capGrid) {
    capGrid.innerHTML = capabilities.map(c => `
      <div class="flip-card glass reveal" tabindex="0">
        <div class="flip-inner">
          <div class="flip-front color-${c.color}">
            <div class="cap-code mono">${esc(c.code)}</div>
            <h3 class="cap-title">${esc(c.title)}</h3>
            <div class="meter-wrap">
              <div class="meter-bar" style="width:${c.level}%;"></div>
              <span class="meter-val mono">${c.level}% PROFICIENCY</span>
            </div>
            <p class="cap-desc">${esc(c.body)}</p>
            <span class="flip-hint mono">[ Click or hover to inspect toolkit ]</span>
          </div>
          <div class="flip-back color-${c.color}">
            <div class="cap-back-head mono">TOOLKIT // ${esc(c.code)}</div>
            <ul class="tool-list mono">
              ${c.tools.map(t => `<li><span class="prompt">&gt;</span> ${esc(t)}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    `).join('');

    $$('.flip-card', capGrid).forEach(card => {
      card.addEventListener('mouseenter', () => sound.playClick());
    });
  }

  if (hexGrid) {
    hexGrid.innerHTML = hexSkills.map(([name, cat]) => `
      <li class="hex-item hex-${cat} mono">
        <span>${esc(name)}</span>
      </li>
    `).join('');
  }
}

/* ------------------------------------------------------------------ *
 * 9. System Log (Timeline & Certifications)
 * ------------------------------------------------------------------ */
function renderSystemLog() {
  const timeline = $('#timeline');
  const certs = $('#certs');

  if (timeline) {
    timeline.innerHTML = experience.map(e => `
      <li class="t-node reveal">
        <div class="t-marker mono">${esc(e.level)}</div>
        <div class="t-content glass">
          <div class="t-header">
            <span class="t-when mono">${esc(e.when)}</span>
            <span class="t-org mono">${esc(e.org)}</span>
          </div>
          <h4 class="t-title">${esc(e.title)}</h4>
          <p class="t-body">${esc(e.body)}</p>
        </div>
      </li>
    `).join('');
  }

  if (certs) {
    certs.innerHTML = certificates.map(c => `
      <div class="cert-card glass reveal" style="border-top-color:${c.badgeColor}">
        <div class="cert-badge mono" style="color:${c.badgeColor}">[${esc(c.short)}]</div>
        <h4 class="cert-title">${esc(c.title)}</h4>
        <div class="cert-issuer mono">${esc(c.issuer)} • ${esc(c.date)}</div>
        <div class="cert-code mono"><span class="prompt">&gt;</span> ${esc(c.verifyCode)}</div>
        <p class="cert-desc">${esc(c.desc)}</p>
      </div>
    `).join('');

    $$('.cert-card', certs).forEach(card => {
      card.addEventListener('mouseenter', () => sound.playClick());
    });
  }
}

/* ------------------------------------------------------------------ *
 * 10. Contact Channel & Transmissions
 * ------------------------------------------------------------------ */
function setupContact() {
  const emailLink = $('#email-link');
  const copyBtn = $('#copy-email');
  const socialsContainer = $('#socials');
  const contactForm = $('#contact-form');
  const contactStatus = $('#contact-status');

  if (emailLink) {
    emailLink.href = `mailto:${profile.email}`;
    emailLink.textContent = profile.email;
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(profile.email);
      sound.playSuccess();
      const orig = copyBtn.textContent;
      copyBtn.textContent = '[ COPIED TO CLIPBOARD ]';
      copyBtn.style.color = 'var(--green)';
      setTimeout(() => {
        copyBtn.textContent = orig;
        copyBtn.style.color = '';
      }, 2500);
    });
  }

  if (socialsContainer) {
    socialsContainer.innerHTML = socials.map(s => `
      <li>
        <a class="glass social-btn mono" href="${esc(s.href)}" target="_blank" rel="noopener">
          <span class="s-label">${esc(s.label)}</span>
          <span class="s-handle">${esc(s.handle)}</span>
          <span class="s-arrow">↗</span>
        </a>
      </li>
    `).join('');
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      sound.playSuccess();
      if (contactStatus) {
        contactStatus.innerHTML = '<span class="ok">[+] TRANSMISSION ENCRYPTED & DISPATCHED VIA SECURE TUNNEL.</span>';
        contactForm.reset();
        setTimeout(() => {
          contactStatus.innerHTML = '';
        }, 6000);
      }
    });
  }
}

/* ------------------------------------------------------------------ *
 * 11. Navigation, Cursor, Sound Toggle & Ambient Init
 * ------------------------------------------------------------------ */
function initPage() {
  // Populate dossier
  const callsignEl = $('#operator-callsign');
  const idEl = $('#operator-id');
  const clearanceEl = $('#operator-clearance');
  const focusEl = $('#operator-focus');
  const statusEl = $('#operator-status');
  const heroNameEl = $('#hero-title-text');
  const heroLedeEl = $('#hero-lede');

  if (callsignEl) callsignEl.textContent = `session://${profile.handle}`;
  if (idEl) idEl.textContent = profile.id;
  if (clearanceEl) clearanceEl.textContent = profile.clearance;
  if (focusEl) focusEl.textContent = profile.focus;
  if (statusEl) statusEl.textContent = profile.status;
  if (heroNameEl) {
    heroNameEl.textContent = profile.name;
    heroNameEl.dataset.text = profile.name;
  }
  if (heroLedeEl) heroLedeEl.textContent = profile.lede;

  // Initialize interactive components
  runTypewriter(profile.roles);
  renderCounters();
  setupTerminal();
  renderProjects();
  setupModal();
  renderArsenal();
  renderSystemLog();
  setupContact();

  // Initialize 3D Globe Radar
  const globeContainer = $('#globe');
  if (globeContainer) {
    initGlobe(globeContainer);
  }

  // Scramble headings on scroll reveal
  const reveals = $$('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        const sc = entry.target.querySelector('[data-scramble]');
        if (sc) scrambleText(sc);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => observer.observe(el));

  // Audio Toggle Button in HUD
  const soundBtn = $('#audio-toggle');
  if (soundBtn) {
    const updateSoundLabel = () => {
      soundBtn.textContent = sound.isAudioEnabled() ? 'AUDIO: ON' : 'AUDIO: MUTED';
      soundBtn.className = `hud-btn mono ${sound.isAudioEnabled() ? 'audio-on' : 'audio-off'}`;
    };
    updateSoundLabel();
    soundBtn.addEventListener('click', () => {
      sound.toggle();
      updateSoundLabel();
    });
  }

  // Custom Cursor
  const cursorDot = $('.cursor-dot');
  const cursorRing = $('.cursor-ring');
  if (cursorDot && cursorRing) {
    window.addEventListener('pointermove', (e) => {
      cursorDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      cursorRing.style.transform = `translate(${e.clientX - 16}px, ${e.clientY - 16}px)`;
    }, { passive: true });
  }

  // Scroll Rail Tracker & Progress Bar
  const progressBar = $('#progress');
  const railLinks = $$('.rail a');
  const sections = $$('section[data-section]');

  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
    if (progressBar) progressBar.style.width = `${progress}%`;

    // Track active section
    let current = 'top';
    sections.forEach(sec => {
      const top = sec.offsetTop - 180;
      if (window.scrollY >= top) {
        current = sec.dataset.section;
      }
    });

    railLinks.forEach(link => {
      if (link.dataset.rail === current) {
        link.classList.add('is-active');
      } else {
        link.classList.remove('is-active');
      }
    });
  }, { passive: true });

  // Year in footer
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ------------------------------------------------------------------ *
 * Kickoff
 * ------------------------------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
  const rainCanvas = $('#rain');
  if (rainCanvas) {
    startRain(rainCanvas);
  }
  runBootSequence();
});
