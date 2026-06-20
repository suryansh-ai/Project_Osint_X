<p align="center">
  <img src="https://img.shields.io/badge/OsintX-Cyber%20Intelligence-00f2fe?style=for-the-badge&logo=hackthebox&logoColor=white" alt="OsintX"/>
</p>

<h1 align="center">
  🕵️ OsintX — Open Source Intelligence Platform
</h1>

<p align="center">
  <strong>The Ultimate OSINT Toolkit for Cybersecurity Professionals, Researchers & Investigators</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-5.4-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="TailwindCSS"/>
  <img src="https://img.shields.io/badge/Framer_Motion-11-FF0055?style=flat-square&logo=framer&logoColor=white" alt="Framer Motion"/>
  <img src="https://img.shields.io/badge/Firebase-Auth-FFCA28?style=flat-square&logo=firebase&logoColor=black" alt="Firebase"/>
  <img src="https://img.shields.io/badge/License-Proprietary-red?style=flat-square" alt="License"/>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#%EF%B8%8F-tool-arsenal">Tools</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-case-management">Case Mgmt</a> •
  <a href="#-contributing">Contributing</a>
</p>

---

## 🔍 What is OsintX?

**OsintX** is a modern, full-featured OSINT (Open Source Intelligence) investigation platform that brings together **40+ intelligence tools** in one sleek, dark-themed interface. Built for cybersecurity analysts, penetration testers, digital forensic investigators, and OSINT researchers — it streamlines the intelligence-gathering workflow from reconnaissance to report generation.

> Think of it as your **cyber investigation command center** — search, analyze, correlate, and report, all without leaving the platform.

---

## ✨ Features

### 🎯 Core Capabilities

| Feature                       | Description                                                                |
| ----------------------------- | -------------------------------------------------------------------------- |
| **40+ OSINT Tools**     | Comprehensive toolset covering network, social, crypto, dark web, and more |
| **Evidence Manager**    | Tag, annotate, and link evidence items with full chain-of-custody          |
| **Investigation Graph** | Visual relationship mapping between entities (*people, IPs, domains*)      |
| **Global Threat Map**   | Real-time cyber attack visualization on an interactive world map           |
| **Report Generator**    | Export professional PDF/Word investigation reports                         |
| **Advanced Timeline**   | Chronological event reconstruction for investigations                      |
| **Terminal Interface**  | Built-in investigation terminal for power users                            |
| **Collaboration**       | Real-time multi-analyst collaboration on cases                             |

### 🛡️ Security & Access

| Feature                      | Description                                       |
| ---------------------------- | ------------------------------------------------- |
| **Role-Based Access**  | Student & User roles with scoped tool permissions |
| **Firebase Auth**      | Secure authentication with email verification     |
| **Session Management** | Auto-timeout warnings and session tracking        |
| **Credit System**      | Usage-based credits to manage API consumption     |
| **Rate Limiting**      | Built-in rate limit banners to prevent API abuse  |
| **Input Sanitization** | XSS protection and CSRF tokens on all mutations   |

### 🎨 User Experience

| Feature                       | Description                                               |
| ----------------------------- | --------------------------------------------------------- |
| **Dark Cyber Theme**    | Stunning dark UI with cyan/purple neon accents            |
| **Framer Motion**       | Smooth animations and page transitions                    |
| **Keyboard Shortcuts**  | Power-user shortcuts for rapid navigation                 |
| **Search History**      | Persistent search history across sessions                 |
| **PWA Support**         | Install as a desktop/mobile app with offline capabilities |
| **Toast Notifications** | Real-time feedback for all operations                     |

---

## 🛠️ Tool Arsenal

OsintX packs **40+ specialized OSINT tools** organized by category:

### 🌐 Network & Infrastructure

| Tool                   | Purpose                                           |
| ---------------------- | ------------------------------------------------- |
| `IP Intelligence`    | Comprehensive IP geolocation, ASN, threat scoring |
| `DNS Records`        | Full DNS enumeration (A, MX, NS, TXT, CNAME)      |
| `Domain Analysis`    | WHOIS, SSL certs, subdomain discovery             |
| `Port Scanner`       | TCP/UDP port scanning and service detection       |
| `Subdomain Finder`   | Brute-force and passive subdomain enumeration     |
| `Certificate Search` | SSL/TLS certificate transparency log lookup       |
| `WHOIS Lookup`       | Domain registration and ownership details         |
| `Tech Detector`      | Identify frameworks, CMS, servers behind websites |
| `MAC Lookup`         | Vendor lookup for MAC addresses                   |
| `WiFi Geolocation`   | Locate WiFi access points geographically          |

### 👤 Social & People

| Tool                 | Purpose                                     |
| -------------------- | ------------------------------------------- |
| `Social Profiler`  | Cross-platform username search (100+ sites) |
| `Sherlock`         | Advanced username enumeration engine        |
| `Social Analyzer`  | Deep social media profile analysis          |
| `GHunt`            | Google account intelligence gathering       |
| `Face Recognition` | Facial recognition and reverse image search |
| `WhatsApp Trace`   | WhatsApp number verification and info       |

### 📧 Email & Communication

| Tool                | Purpose                                              |
| ------------------- | ---------------------------------------------------- |
| `Email Intel`     | Header analysis, SPF/DKIM verification, breach check |
| `Breach Database` | Check emails/passwords in known data breaches        |
| `Phone Lookup`    | Carrier detection, validation, caller ID             |

### 🔐 Threat Intelligence

| Tool                 | Purpose                                      |
| -------------------- | -------------------------------------------- |
| `Threat Intel`     | IOC lookup across multiple threat feeds      |
| `Malware Check`    | File hash reputation via VirusTotal & others |
| `Hash Analyzer`    | MD5/SHA1/SHA256 malware hash detection       |
| `CVE Lookup`       | Search CVE vulnerability database            |
| `URL Scanner`      | Phishing/malware URL threat analysis         |
| `IP Quality Score` | Fraud scoring and proxy/VPN detection        |
| `Sanctions Search` | Global sanctions and PEP database search     |
| `Interpol Notices` | Interpol red/yellow notice lookup            |

### 🕸️ Dark Web & Data

| Tool                | Purpose                                     |
| ------------------- | ------------------------------------------- |
| `Dark Web Search` | .onion and dark web intelligence gathering  |
| `Paste Search`    | Search Pastebin and paste sites for leaks   |
| `Data Mining`     | Extract patterns and entities from datasets |
| `Wayback Machine` | Historical website snapshot retrieval       |

### 💰 Financial & Tracking

| Tool               | Purpose                                   |
| ------------------ | ----------------------------------------- |
| `Crypto Tracer`  | Blockchain transaction tracking (BTC/ETH) |
| `UPI Info`       | UPI payment ID intelligence               |
| `Vehicle Info`   | Vehicle registration and owner lookup     |
| `Flight Tracker` | Real-time flight tracking and history     |

### 🔧 Utility

| Tool                | Purpose                                     |
| ------------------- | ------------------------------------------- |
| `Encoder/Decoder` | Base64, URL, HTML, hex encoding/decoding    |
| `Link Preview`    | Safe URL preview and metadata extraction    |
| `URL Expander`    | Unshorten and trace redirect chains         |
| `Web Profiler`    | Website technology and performance analysis |
| `Web Carbon`      | Website carbon footprint estimation         |
| `Geolocation`     | IP/phone/coordinate geolocation mapping     |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+
- **npm** or **yarn**
- **Git**

### Installation

```bash
# Clone the repository
git clone https://github.com/suryansh-ai/OsintX.git
cd OsintX

# Install frontend dependencies
cd frontend
npm install

# Create environment config
cp .env.example .env
```

### Configuration

Create a `.env` file in `frontend/`:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_WS_URL=ws://localhost:5000/ws

# Development Mode (uses mock data)
VITE_ENABLE_MOCK_MODE=true
```

### Run Development Server

```bash
npm run dev
```

The app will launch at `http://localhost:5173` 🎉

### Build for Production

```bash
npm run build    # Output in dist/
npm run preview  # Preview production build
```

---

## 🗺️ Global Threat Map

Real-time cyber attack visualization powered by **React Simple Maps** and **Leaflet**:

- 🔴 Live attack origin/destination plotting
- 📍 Interactive markers with attack metadata
- 🌍 Pan, zoom, and filter by attack type
- 📈 Attack frequency heatmaps
- 🔔 Alert integration for monitored regions

---

## 🌐 Browser Support

| Browser       | Version |
| ------------- | ------- |
| Chrome / Edge | 90+     |
| Firefox       | 88+     |
| Safari        | 14+     |

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-tool`
3. **Commit** changes: `git commit -m 'Add amazing new tool'`
4. **Push** to branch: `git push origin feature/amazing-tool`
5. **Open** a Pull Request

### Development Tips

- Enable **mock mode** (`VITE_ENABLE_MOCK_MODE=true`) for frontend-only development
- All tools follow the same component pattern — check any existing tool for reference
- Validators go in `utils/validators.js`
- New services go in `services/tools/`

---

## 📜 License

This project is **proprietary**. All rights reserved.
Unauthorized copying, modification, or distribution is strictly prohibited.

---

<p align="center">
  <img src="https://img.shields.io/badge/Made%20with-React%20%2B%20Vite-blue?style=for-the-badge" alt="Made with React"/>
  <img src="https://img.shields.io/badge/Styled%20with-TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Styled with Tailwind"/>
</p>

<p align="center">
  <strong>⭐ Star this repo if you find it useful!</strong>
</p>

<p align="center">
  Built with ❤️ by the <strong>OsintX Team</strong>
</p>
