<div align="center">

# Prisma Connect

**מערכת ניהול חוקרים ואירועים — מרכז החדשנות פריזמה נגב**

Researcher & Event Management System for Prisma Negev Innovation Center, Ben-Gurion University

[![Built with React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green?logo=supabase)](https://supabase.com)
[![Based on Atomic CRM](https://img.shields.io/badge/Based%20on-Atomic%20CRM-orange)](https://marmelab.com/atomic-crm/)

</div>

---

## About

Prisma Connect is a CRM system tailored for managing researchers and academic events at Prisma Negev Innovation Center (BGU). Built on [Atomic CRM](https://github.com/marmelab/atomic-crm) by Marmelab.

### Key Features
- 🔬 **Researcher Management** — Track academics with CRIS profiles, priority ratings, and research focus areas
- 📅 **Event Pipeline** — Kanban board for managing researcher engagement (contacted → confirmed → attended)
- 🇮🇱 **Hebrew & RTL** — Full Hebrew localization with right-to-left layout
- 🏫 **BGU Integration** — Pre-configured BGU departments, CRIS profile links
- 📊 **Analytics Dashboard** — Real-time overview of researcher engagement
- 📋 **Task Management** — Follow-up reminders, email tracking, meeting scheduling
- 📥 **CSV Import** — Bulk import researchers from spreadsheets
- 🔐 **Secure** — Row Level Security, SSO support (Google, Microsoft)

## Documentation
- [מדריך פריסה (Deploy Guide)](docs/DEPLOY.md)
- [מדריך שימוש (User Guide)](docs/USER-GUIDE.md)

## Quick Start

```bash
git clone https://github.com/Prisma-Negev/prisma-crm.git
cd prisma-crm
make install
make start
```

## Tech Stack
React 19 · TypeScript · Vite 7 · Supabase · react-admin 5 · shadcn/ui · Tailwind CSS 4

## License
MIT — Based on [Atomic CRM](https://github.com/marmelab/atomic-crm) by Marmelab.
