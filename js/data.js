/**
 * data.js — Central Configuration & Content Database for Athulyanath (@CipherBenz)
 */

export const profile = {
  name: 'Athulyanath',
  handle: 'CipherBenz',
  callsign: 'CB-0x7F',
  email: 'cipherbenz@proton.me',
  status: 'ONLINE // READY FOR ENGAGEMENTS',
  clearance: 'eJPT • CEH • Security+',
  focus: 'Offensive Security • Hardware / RF Pentesting • Web AppSec',
  id: 'OPERATOR-ID: #CB-7741-CHENNAI',
  location: 'Chennai, India',
  roles: [
    'Ethical Hacker',
    'Offensive Security Researcher',
    'Hardware & RF Pentester',
    'Web Application Security Analyst',
    'Red Team Explorer'
  ],
  bioQuote: 'Powered by caffeine and questionable life choices..',
  lede: 'Breaking into systems, auditing wireless/RF attack surfaces, and dissecting web application perimeters before threat actors do. Powered by caffeine and curiosity.'
};

export const socials = [
  { label: 'GitHub', handle: 'CipherBenz', href: 'https://github.com/CipherBenz' },
  { label: 'LinkedIn', handle: 'in/athulyanath', href: 'https://linkedin.com' },
  { label: 'TryHackMe', handle: 'CipherBenz', href: 'https://tryhackme.com' },
  { label: 'HackTheBox', handle: 'CipherBenz', href: 'https://hackthebox.com' },
  { label: 'Twitter / X', handle: '@CipherBenz', href: 'https://twitter.com' }
];

export const stats = [
  { value: 4, suffix: '+', label: 'Years Offensive & Security Research' },
  { value: 30, suffix: '+', label: 'Vulnerabilities Discovered & Triaged' },
  { value: 75, suffix: '+', label: 'CTF Machines Rooted (HTB / THM)' },
  { value: 100, suffix: '%', label: 'Passion for Hardware & Wireless Hacking' }
];

export const projects = [
  {
    id: 'rf-specter',
    title: 'RF-Specter & Wireless Recon Suite',
    year: '2025',
    category: 'Hardware',
    classification: 'FIELD RECON // RF AUDIT',
    summary: 'Automated 2.4GHz/5GHz packet injection, deauthentication auditing, and BLE beacon sniffing built on custom ESP32/SDR firmware.',
    detail: 'Designed for tactical wireless security audits. Intercepts WPA2/WPA3 PMKID handshakes, probes hidden SSIDs, and interfaces with Flipper Zero and ESP32 Marauder hardware.',
    stack: ['C++', 'ESP32', 'Python', 'SDR', 'Wireshark'],
    metric: 'Sub-GHz & Wi-Fi Triangulation',
    badge: 'HARDWARE',
    links: [
      { label: 'GitHub Repo', href: 'https://github.com/CipherBenz' },
      { label: 'Hardware Spec', href: '#' }
    ]
  },
  {
    id: 'valkyrie-fuzzer',
    title: 'Valkyrie: Smart WAF & Payload Fuzzer',
    year: '2025',
    category: 'AppSec',
    classification: 'OFFENSIVE // APPSEC',
    summary: 'Context-aware web application penetration testing engine inspired by PayloadsAllTheThings, automating XSS, SQLi, and SSRF detection.',
    detail: 'Evaluates response timing, dynamic reflections, and header leakage to detect zero-day injection flaws while bypassing Cloudflare and ModSecurity WAF rules.',
    stack: ['Python', 'Asyncio', 'Go', 'Burp Suite Pro', 'Regex'],
    metric: '400+ Polyglot Payload Permutations',
    badge: 'APPSEC',
    links: [
      { label: 'Source Repo', href: 'https://github.com/CipherBenz' },
      { label: 'Playbook', href: '#' }
    ]
  },
  {
    id: 'cipher-rat',
    title: 'CipherRAT: Covert Egress Conduit',
    year: '2025',
    category: 'Red Team',
    classification: 'ORDNANCE // RED TEAM',
    summary: 'Lightweight post-exploitation C2 agent leveraging DNS-over-HTTPS and Telegram Bot API as encrypted command channels.',
    detail: 'Enables authorized red teams to test egress monitoring across tightly segmented corporate VLANs without opening inbound listening firewall ports.',
    stack: ['Golang', 'Telegram API', 'AES-256-GCM', 'Bash'],
    metric: 'Zero Inbound Ports Required',
    badge: 'RED TEAM',
    links: [
      { label: 'Whitepaper', href: '#' },
      { label: 'GitHub Repo', href: 'https://github.com/CipherBenz' }
    ]
  },
  {
    id: 'ghost-badge',
    title: 'GhostBadge: RFID & NFC Forensics',
    year: '2024',
    category: 'Hardware',
    classification: 'PHYSICAL // ACCESS AUDIT',
    summary: 'Physical access control evaluation toolkit for high-frequency (13.56MHz) and low-frequency (125kHz) badge emulation.',
    detail: 'Audits weak cryptographic keys in MIFARE Classic cards, clones HID Prox credentials, and benchmarks physical facility defense postures.',
    stack: ['C', 'Python', 'NFC API', 'Proxmark3'],
    metric: 'Physical Red Team Audited',
    badge: 'PHYSICAL',
    links: [
      { label: 'Briefing Doc', href: '#' }
    ]
  },
  {
    id: 'recon-vortex',
    title: 'AutoRecon-Vortex: Attack Surface Map',
    year: '2024',
    category: 'Recon',
    classification: 'OSINT // RECON',
    summary: 'Continuous external attack surface reconnaissance pipeline discovering dangling DNS records, exposed buckets, and leaked secrets.',
    detail: 'Asynchronously monitors Certificate Transparency logs, interrogates Shodan endpoints, and performs rapid port scanning to discover exposed cloud assets.',
    stack: ['Python', 'Shodan API', 'Masscan', 'Docker', 'PostgreSQL'],
    metric: '100k+ Hosts Scanned/min',
    badge: 'OSINT',
    links: [
      { label: 'Source Code', href: 'https://github.com/CipherBenz' }
    ]
  },
  {
    id: 'aegis-kernel',
    title: 'Aegis-Kernel: Linux Hardening Suite',
    year: '2024',
    category: 'Blue Team',
    classification: 'DEFENSE // INFRA',
    summary: 'Automated CIS Benchmark hardening suite enforcing eBPF syscall auditing, AppArmor confinement, and iptables egress rules.',
    detail: 'Protects critical Linux servers against privilege escalation exploits, ptrace process hollowing, and unauthorized kernel namespace manipulation.',
    stack: ['Bash', 'eBPF', 'AppArmor', 'Sysctl', 'Linux Kernel'],
    metric: 'CIS Benchmark Level 2 Passing',
    badge: 'BLUE TEAM',
    links: [
      { label: 'Configuration Guide', href: '#' }
    ]
  }
];

export const archive = [
  { name: 'Wifi-Marauder-Scripts', note: 'ESP32 Wi-Fi deauthentication audit harness', lang: 'C++', stars: 84, href: 'https://github.com/CipherBenz' },
  { name: 'OWASP-Payload-Vault', note: 'Curated polyglot payloads for Bug Bounty hunting', lang: 'Python', stars: 126, href: 'https://github.com/CipherBenz' },
  { name: 'Subdomain-Sniper', note: 'High-speed recursive DNS bruteforcer with wildcard filtering', lang: 'Python', stars: 52, href: 'https://github.com/CipherBenz' },
  { name: 'BadUSB-Duck-Scripts', note: 'HID payload automation for authorized physical assessments', lang: 'DuckyScript', stars: 68, href: 'https://github.com/CipherBenz' },
  { name: 'Port-Striker', note: 'Ultra-lightweight asynchronous SYN port scanner', lang: 'Go', stars: 41, href: 'https://github.com/CipherBenz' },
  { name: 'PrivEsc-Linux-Audit', note: 'Automated local privilege escalation discovery script', lang: 'Bash', stars: 95, href: 'https://github.com/CipherBenz' }
];

export const capabilities = [
  {
    code: 'RF-SEC',
    title: 'Wireless & Hardware Security',
    color: 'magenta',
    level: 94,
    body: '802.11 Wi-Fi auditing, Bluetooth Low Energy (BLE) exploitation, Sub-GHz radio reverse engineering, and Flipper Zero / SDR operations.',
    tools: ['Flipper Zero', 'ESP32 Marauder', 'HackRF One', 'Wireshark', 'Proxmark3', 'Aircrack-ng']
  },
  {
    code: 'WEB-SEC',
    title: 'Web Application Penetration Testing',
    color: 'cyan',
    level: 92,
    body: 'Auditing OWASP Top 10 vulnerabilities, business logic bypasses, GraphQL/REST API flaws, SSRF, and SQL/Command Injection.',
    tools: ['Burp Suite Pro', 'OWASP ZAP', 'SQLmap', 'Postman', 'ffuf / Dirsearch', 'Caido']
  },
  {
    code: 'RED-TEAM',
    title: 'Adversary Simulation & Network Pentesting',
    color: 'green',
    level: 89,
    body: 'Active Directory domain enumeration, Kerberoasting, lateral movement, BloodHound path analysis, and privilege escalation.',
    tools: ['Nmap', 'Metasploit', 'BloodHound', 'Impacket', 'Mimikatz', 'Responder']
  },
  {
    code: 'DEV-OPS',
    title: 'Security Tooling & Exploit Dev',
    color: 'amber',
    level: 86,
    body: 'Developing custom security automations, reconnaissance harnesses, and payload steganography tools in Python and Go.',
    tools: ['Python', 'Golang', 'C / C++', 'Bash', 'Docker', 'Linux Kernel']
  },
  {
    code: 'SOC-DEF',
    title: 'Incident Analysis & System Hardening',
    color: 'cyan',
    level: 85,
    body: 'Linux kernel tuning, packet capture triage, log correlation, digital artifact analysis, and CIS Benchmark baseline hardening.',
    tools: ['Wireshark', 'Splunk', 'Volatility', 'AppArmor / SELinux', 'eBPF', 'Auditd']
  },
  {
    code: 'OSINT',
    title: 'Threat Intelligence & Reconnaissance',
    color: 'magenta',
    level: 90,
    body: 'Attack surface mapping, certificate transparency monitoring, leaked credential analysis, and target asset enumeration.',
    tools: ['Shodan', 'Maltego', 'Amass', 'Sublist3r', 'GitHub Dorks', 'theHarvester']
  }
];

export const hexSkills = [
  ['Burp Suite', 'sec'], ['Flipper Zero', 'sec'], ['ESP32', 'sec'], ['Nmap', 'sec'],
  ['Python', 'dev'], ['Golang', 'dev'], ['C / C++', 'dev'], ['Bash', 'dev'],
  ['Wireshark', 'sec'], ['Metasploit', 'sec'], ['BloodHound', 'sec'], ['OWASP ZAP', 'sec'],
  ['Linux Kernel', 'ops'], ['Docker', 'ops'], ['Active Directory', 'ops'], ['AppArmor', 'ops'],
  ['Proxmark3', 'sec'], ['HackRF One', 'sec'], ['Shodan', 'sec'], ['Impacket', 'sec'],
  ['Git', 'dev'], ['REST APIs', 'dev'], ['Networking / TCP', 'ops'], ['WireGuard', 'ops']
];

export const experience = [
  {
    when: '2024 — PRESENT',
    title: 'Independent Offensive Security Researcher & Bug Hunter',
    org: 'CipherBenz Labs // Chennai',
    level: 'ROOT',
    body: 'Conducting black-box web application assessments, wireless/RF hardware security research, and vulnerability discovery across bug bounty programs.'
  },
  {
    when: '2023 — 2024',
    title: 'Security Researcher & Penetration Testing Practitioner',
    org: 'Cybersecurity Operations',
    level: 'ADMIN',
    body: 'Audited internal network infrastructure, conducted perimeter penetration tests, and engineered automated reconnaissance tools in Python and Go.'
  },
  {
    when: '2022 — 2023',
    title: 'CTF Competitor & Security Enthusiast',
    org: 'HackTheBox / TryHackMe Community',
    level: 'FIELD',
    body: 'Rooted 75+ vulnerable targets across Linux and Windows domains, mastering privilege escalation, Active Directory attack chains, and binary exploitation.'
  },
  {
    when: 'FOUNDATION',
    title: 'Computer Science & Cybersecurity Specialization',
    org: 'Engineering Foundation // Chennai, India',
    level: 'EDU',
    body: 'Rigorous foundation in Computer Networking, Operating Systems, Cryptography, and Software Engineering.'
  }
];

export const certificates = [
  {
    short: 'eJPT',
    title: 'eLearnSecurity Junior Penetration Tester',
    issuer: 'INE Security',
    date: 'VERIFIED • 2024',
    badgeColor: '#22e6ff',
    verifyCode: 'INE-eJPT-VERIFIED',
    desc: 'Hands-on practical assessment covering network reconnaissance, vulnerability identification, web app attacks, and exploitation.'
  },
  {
    short: 'CEH',
    title: 'Certified Ethical Hacker',
    issuer: 'EC-Council',
    date: 'VERIFIED • 2023',
    badgeColor: '#3dff8a',
    verifyCode: 'ECC-CB-PASS-OK',
    desc: 'Offensive reconnaissance, network packet sniffing, wireless attack vectors, and vulnerability assessment methodologies.'
  },
  {
    short: 'Sec+',
    title: 'CompTIA Security+ ce',
    issuer: 'CompTIA',
    date: 'VERIFIED • 2023',
    badgeColor: '#ffc857',
    verifyCode: 'COMP00109054-OK',
    desc: 'Enterprise security posture, threat mitigation, cryptographic implementation, and security operations.'
  },
  {
    short: 'OWASP',
    title: 'Web Application Security Practitioner',
    issuer: 'AppSec Community',
    date: 'VERIFIED • 2024',
    badgeColor: '#ff2bd6',
    verifyCode: 'OWASP-TOP10-PRO',
    desc: 'Specialized proficiency in defending and auditing modern web APIs, OAuth flows, and injection attack vectors.'
  }
];

export const terminalScript = [
  {
    cmd: 'nmap -sV -sC -T4 10.10.14.88 -p 22,80,443,8080',
    out: [
      'Starting Nmap 7.95 ( https://nmap.org ) at Chennai Node',
      'Nmap scan report for target.internal (10.10.14.88)',
      'PORT     STATE SERVICE       VERSION',
      '22/tcp   open  ssh           OpenSSH 9.6p1 Ubuntu',
      '80/tcp   open  http          nginx 1.25 (API endpoint)',
      '443/tcp  open  ssl/https     nginx 1.25 (TLS 1.3 cert valid)',
      '<ok>[+] 3 open ports mapped. Initiating web perimeter assessment...</ok>'
    ]
  },
  {
    cmd: 'python3 ./valkyrie_fuzzer.py --target 10.10.14.88 --owasp',
    out: [
      '[*] Initializing context-aware polyglot payloads against /api/v1/auth...',
      '[!] Reflected input detected in parameter "redirect_uri"',
      '<ok>[+] Potential SSRF / Open Redirect confirmed: payload syntax verified.</ok>',
      '<warn>[!] Advisory generated. Mitigation report dispatched.</warn>'
    ]
  },
  {
    cmd: 'esp32_marauder --interface wlan0mon --audit-rf',
    out: [
      '[*] Initializing 2.4GHz / 5GHz wireless airwave monitoring...',
      '[+] Intercepted 4 Beacon Frames: [AP-Corporate-Secure, Guest-WLAN]',
      '[+] WPA2 Handshake PMKID captured for: AP-Corporate-Secure',
      '<ok>[+] Wireless telemetry logged to /root/captures/pmkid.pcap</ok>'
    ]
  },
  {
    cmd: 'ssh cipherbenz@cipherbenz.sec -p 2200',
    out: [
      '<dim>Authenticating via Ed25519 cryptographic key for Athulyanath (@CipherBenz)...</dim>',
      '<ok>[+] Welcome, Operator CipherBenz. Chennai terminal active. 0 alerts open.</ok>',
      'Type "help" below to execute manual commands.'
    ]
  }
];

export const manualHelp = `
<b style="color:var(--cyan);">AVAILABLE SYSTEM COMMANDS FOR OPERATOR CIPHERBENZ:</b>
  <c>help</c>         - Print this command manifest
  <c>whoami</c>       - Operator identity & security clearance (Athulyanath)
  <c>projects</c>     - List classified operational missions
  <c>skills</c>       - Print technical arsenal & exploit capabilities
  <c>certs</c>        - Display verified security certifications
  <c>contact</c>      - Display secure communication endpoints
  <c>github</c>       - Open GitHub profile (https://github.com/CipherBenz)
  <c>clear</c>        - Wipe terminal buffer
  <c>cve</c>          - Fetch latest vulnerability threat bulletin
  <c>scan</c> &lt;ip&gt;   - Run simulated Nmap audit on target IP
  <c>rf</c>           - Run simulated wireless airwave scan
  <c>matrix</c>       - Toggle matrix cyber rain stream
  <c>sudo</c>         - Test administrative privilege escalation
  <c>date</c>         - Current system UTC timestamp
  <c>uptime</c>       - Operational uptime telemetry
`;
