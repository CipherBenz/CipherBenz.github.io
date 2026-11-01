# 🛡️ Athulyanath (@CipherBenz) — Cybersecurity Command Center

A high-performance, military-grade cybersecurity portfolio and interactive command center custom-built for **Athulyanath ([@CipherBenz](https://github.com/CipherBenz))**, inspired by `navin-hariharan.com`.

Built with modern semantic HTML5, CSS3 tokens, and ES6 modules with **zero build steps or external bundlers required**.

---

## ⚡ Key Highlights for Athulyanath (@CipherBenz)

- **Operator Tactical Dossier**: Integrated with your actual GitHub avatar, HUD corner targeting brackets, scanline sweep animations, and clearance level (`eJPT • CEH • Security+`).
- **Interactive Command Center (`/ops`)**:
  - Live shell branded for `cipherbenz@chennai-node:~$`.
  - **Auto-Demo Loop**: Real-world operations including Nmap service detection, OWASP polyglot fuzzing, and ESP32 Marauder wireless airwave captures.
  - **Manual Shell Commands**: Type `help`, `whoami`, `projects`, `skills`, `certs`, `github`, `rf`, `scan`, `cve`, `matrix`, `sudo`, `contact`, `date`, `uptime`, or `clear`.
- **Classified Files (`/projects`)**:
  - **RF-Specter & Wireless Recon Suite**: Sub-GHz and 2.4/5GHz airwave analysis with ESP32/SDR.
  - **Valkyrie Payload Fuzzer**: Context-aware WAF bypass and OWASP injection discovery.
  - **CipherRAT**: Covert C2 channel over Telegram API and DNS-over-HTTPS.
  - **GhostBadge**: 13.56MHz and 125kHz RFID badge auditing.
  - **AutoRecon-Vortex**: Attack surface discovery with Certificate Transparency & Shodan.
  - **Aegis-Kernel**: Linux eBPF telemetry and CIS Benchmark hardening.
- **Arsenal (`/arsenal`)**: 3D perspective flip cards with proficiency meters for Hardware & RF Security, Web AppSec (OWASP), Adversary Simulation, and Linux Tooling.
- **System Log (`/log`)**: Chennai node career audit timeline and cryptographic clearance keys (`$ gpg --list-keys`).
- **Secure Transmission Channel (`/contact`)**: Handshake telemetry, one-click copy email button, and encrypted transmission form directly connected to your GitHub and contact endpoints.

---

## 🚀 How to Run Locally

### 1. Windows 1-Click
Double-click **`start.bat`**.

### 2. Python (Any OS)
```bash
python serve.py
```
*Opens `http://localhost:8080` automatically in your default browser.*

---

## 🌐 Deploy to GitHub Pages (Live at `https://CipherBenz.github.io`)

To deploy this portfolio live on your GitHub under `https://CipherBenz.github.io`:

1. On GitHub, create a repository named **`CipherBenz.github.io`** (or any repo name like `portfolio`).
2. In your local terminal, navigate to this folder and run:
   ```bash
   git init
   git add .
   git commit -m "Initial launch of CipherBenz Cybersecurity Command Center"
   git branch -M main
   git remote add origin https://github.com/CipherBenz/CipherBenz.github.io.git
   git push -u origin main
   ```
3. In GitHub, go to **Settings** → **Pages** → under **Build and deployment**, set Source to **Deploy from a branch** (`main` / root).
4. Your cybersecurity portfolio is now live for the world to see!

---

## 📁 File Structure

```
cybersecurity-portfolio/
├── index.html          # Main HTML structure & HUD layout
├── serve.py            # Zero-config local Python launcher
├── start.bat           # 1-click Windows starter
├── README.md           # Documentation & deployment guide
├── css/
│   └── styles.css      # Dark military-cyberpunk design system & animations
├── js/
│   ├── main.js         # Core orchestrator (terminal, typewriter, modals, sound)
│   ├── data.js         # Single source of truth for Athulyanath (@CipherBenz)
│   ├── globe.js        # 3D Particle Globe & Canvas 2D Cyber Radar engine
│   ├── rain.js         # Ambient interactive matrix threat rain
│   └── sound.js        # Web Audio API synthetic telemetry sound FX
└── assets/
    ├── avatar.jpg      # Official GitHub profile photo of Athulyanath
    ├── favicon.svg     # Cyber command center icon
    └── certs/          # Certification badges and icons
```
