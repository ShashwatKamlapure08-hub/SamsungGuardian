# 🛡️ Samsung Guardian

> **AI for Living** — An intelligent relationship health layer for Samsung Messages, built for Samsung ennovateX AX Hackathon 2026.

![Samsung Guardian](https://img.shields.io/badge/Samsung-ennovateX%202026-1428A0?style=for-the-badge&logo=samsung&logoColor=white)
![Built With](https://img.shields.io/badge/Built%20With-NLP%20%2B%20LLM-6C3FC5?style=for-the-badge)
![Stack](https://img.shields.io/badge/Stack-React%20%2B%20Node.js-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Status](https://img.shields.io/badge/Status-In%20Development-orange?style=for-the-badge)

---

## 🧠 What is Samsung Guardian?

Most people don't realize they're being manipulated in a conversation — until it's too late. Gaslighting, guilt-tripping, love bombing, and stonewalling are patterns that erode mental health silently, one message at a time.

**Samsung Guardian** is an AI-powered relationship health analyzer that integrates with Samsung Messages. You paste a conversation, and the system uses Natural Language Processing and a Large Language Model to:

- **Detect manipulation patterns** — gaslighting, DARVO, guilt-tripping, silent treatment, love bombing
- **Explain what's happening** in plain, human language — not clinical jargon
- **Track emotional drift** across conversations over time — "Your responses show increasing self-doubt over 2 weeks"
- **Coach your reply** — type your raw response and get a version that protects you without losing your voice

This is not a chatbot. This is a mirror that shows you what's really happening in your conversations.

---

## 🎯 Problem Statement

| Reality | What exists today |
|---|---|
| 1 in 3 people experience psychological manipulation in relationships | No tool detects it in real conversations |
| People can't name what's happening to them | WebMD-style symptom lists don't apply to conversations |
| Samsung Messages is on 300M+ devices | No AI layer for emotional safety exists in it |
| Mental health is reactive, not preventive | Guardian is proactive — it catches patterns before damage compounds |

---

## ✨ Core Features

### 1. 🔍 Manipulation Pattern Detector
Paste any conversation — WhatsApp export, SMS, email thread — and the LLM identifies:

| Pattern | What it looks like |
|---|---|
| **Gaslighting** | "That never happened", "You're imagining things" |
| **DARVO** | Deny, Attack, Reverse Victim and Offender |
| **Guilt-tripping** | Making you responsible for their emotions |
| **Love bombing** | Excessive affection used as control |
| **Stonewalling** | Deliberate emotional withdrawal |
| **Minimizing** | Dismissing your feelings as overreaction |

Each pattern is flagged with a **plain-language explanation** and a **severity score**.

### 2. 📈 Longitudinal Emotional Drift Tracker
Guardian doesn't just analyze one conversation — it tracks how *your* language changes over multiple conversations with the same person. Signs like increasing self-blame, hedging language ("maybe I was wrong"), and apology frequency are measured and surfaced.

### 3. 💬 Reply Coach
Type your raw, unfiltered reply. Guardian:
- Flags if you're responding from a triggered emotional state
- Offers 3 rewrite options: **assertive**, **diplomatic**, **firm boundary**
- Keeps your intent — changes your delivery

### 4. 🔗 Samsung Messages Integration *(Roadmap)*
Native integration with Samsung Messages API to analyze conversations directly from the app — no copy-pasting needed.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│              Samsung Guardian               │
├─────────────────┬───────────────────────────┤
│   Frontend      │        Backend            │
│   React + Vite  │        Node.js            │
│   localhost:5173│        localhost:8787      │
├─────────────────┴───────────────────────────┤
│              LLM Layer                      │
│   Claude / GPT-4 via API                    │
│   Prompt Engineering + NLP Classification   │
├─────────────────────────────────────────────┤
│           Samsung Ecosystem                 │
│   Samsung Messages · Samsung Health SDK     │
│   Galaxy Tab UI · SmartThings (Phase 3)     │
└─────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React + Vite | Fast, responsive UI on Galaxy Tab |
| **Backend** | Node.js + Express | API server, LLM orchestration |
| **LLM** | Claude API / GPT-4 | Manipulation detection, reply coaching |
| **NLP** | Custom prompt chains | Pattern classification, sentiment scoring |
| **Styling** | CSS / Tailwind | Clean Samsung-native UI feel |
| **Samsung** | Samsung Health SDK | Stress correlation (Phase 2) |

---

## 📁 Project Structure

```
SamsungGuardian/
├── src/
│   ├── main.jsx          # React entry point
│   └── Phase2.jsx        # Phase 2 feature components
├── Phase1/               # Phase 1 deliverables & docs
├── Phase2/               # Phase 2 deliverables & docs
├── server.js             # Node.js API backend
├── index.html            # Root HTML
├── vite.config.js        # Vite configuration
├── package.json          # Dependencies
├── .env.example          # Environment variable template
└── README.md             # This file
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm
- An LLM API key (Claude or OpenAI)

### Installation

```bash
# Clone the repository
git clone https://github.com/ShashwatKamlapure08-hub/SamsungGuardian.git
cd SamsungGuardian

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your API key to .env

# Run both frontend and backend together
npm run dev
```

The app runs at:
- **Frontend** → http://localhost:5173
- **API Server** → http://localhost:8787

### Environment Variables

Create a `.env` file in the root (never commit this):

```
LLM_API_KEY=your_api_key_here
LLM_MODEL=claude-sonnet-4-20250514
PORT=8787
```

---

## 🗺️ Roadmap

| Phase | Features | Status |
|---|---|---|
| **Phase 1** | Manipulation pattern detector, plain-language explanation, severity score | ✅ In Progress |
| **Phase 2** | Longitudinal drift tracking, reply coach, conversation history | 🔄 Planned |
| **Phase 3** | Samsung Messages native integration, Samsung Health stress correlation | 📋 Roadmap |
| **Grand Finale** | Full Samsung ecosystem demo on Galaxy Tab | 🎯 July 30, 2026 |

---

## 🏆 Hackathon Context

This project is built for the **Samsung ennovateX AX Hackathon 2026** under the theme **"AI for Living"**.

- **Event:** Samsung ennovateX 2026
- **Organizer:** Samsung R&D Institute India – Bangalore (SRI-B)
- **Theme:** AI for Living
- **Grand Finale:** July 30, 2026 — Taj Yeshwanthpur, Bengaluru
- **Team:** VIT Vellore

---

## 👥 Team

| Name | Role | GitHub |
|---|---|---|
| Shashwat Vijaykumar Kamlapure | Full Stack + LLM Integration | [@ShashwatKamlapure08-hub](https://github.com/ShashwatKamlapure08-hub) |
| *(Teammate)* | *(Role)* | *(GitHub)* |

---

## 🤝 Contributing

This is a hackathon project with a closed team. If you're a collaborator:

```bash
# Never push directly to main
git checkout -b feature/your-feature-name

# Make your changes, then
git add .
git commit -m "feat: describe your change"
git push origin feature/your-feature-name

# Open a Pull Request on GitHub
```

---

## ⚠️ Disclaimer

Samsung Guardian is a supportive tool, not a clinical diagnostic instrument. It is not a substitute for professional mental health advice. If you are experiencing abuse, please reach out to a qualified professional or helpline.

---

## 📄 License

This project is built for educational and hackathon purposes.

---

<p align="center">Built with ❤️ for Samsung ennovateX AX Hackathon 2026 · AI for Living</p>
