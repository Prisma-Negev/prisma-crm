# Prisma Connect — מדריך פריסה (Deploy)

## דרישות מקדימות
- Node.js 22 LTS
- Git
- Docker (לסביבה מקומית בלבד)
- חשבון [Supabase](https://supabase.com) (חינמי)
- חשבון [Netlify](https://netlify.com) (חינמי)

---

## התקנה מקומית

```bash
git clone https://github.com/Prisma-Negev/prisma-crm.git
cd prisma-crm
make install
make start
```

- אפליקציה: http://localhost:5173/
- Supabase Dashboard: http://localhost:54323/
- REST API: http://127.0.0.1:54321
- בדיקת מיילים (Inbucket): http://localhost:54324/

---

## הגדרת Supabase לפרודקשן

### יצירת פרויקט
1. היכנס ל-[supabase.com](https://supabase.com) → **New Project**
2. בחר שם (למשל `prisma-connect`), סיסמת DB, ואזור (`eu-central-1` מומלץ לישראל)
3. המתן ליצירת הפרויקט (~1 דקה)

### שמירת פרטי גישה
ב-**Project Settings → API** תמצא:
- **Project URL** — כתובת כמו `https://xxxxx.supabase.co`
- **anon public key** — מפתח ארוך שמתחיל ב-`eyJ...`

### הרצת מיגרציות (יצירת הטבלאות)
1. לך ל-**SQL Editor** בדשבורד של Supabase
2. העתק והרץ את קבצי ה-SQL מתיקיית `supabase/migrations/` — **לפי הסדר הכרונולוגי** (מהישן לחדש)
3. הקובץ האחרון שצריך להריץ: `20260315120000_prisma_negev_customization.sql`

### הגדרת Authentication
ב-**Authentication → Providers**:
- Email/Password: מופעל כברירת מחדל
- Google SSO (אופציונלי): הוסף Client ID ו-Client Secret מ-Google Cloud Console

---

## פריסה ל-Netlify

### שלב 1: חיבור
1. היכנס ל-[netlify.com](https://netlify.com) → **Sign up with GitHub**
2. לחץ **Add new site** → **Import from Git**
3. בחר את `Prisma-Negev/prisma-crm`

### שלב 2: הגדרות Build
| הגדרה | ערך |
|--------|------|
| Build command | `npm run build` |
| Publish directory | `dist` |
| Node version | `22` |

### שלב 3: Environment Variables
ב-**Site settings → Environment variables** הוסף:

| משתנה | ערך |
|--------|------|
| `VITE_SUPABASE_URL` | כתובת הפרויקט שלך ב-Supabase |
| `VITE_SUPABASE_ANON_KEY` | ה-anon key |

### שלב 4: Deploy
- לחץ **Deploy site**
- הפריסה תארך ~1-2 דקות
- שנה שם אתר ב-**Site settings → Change site name** → למשל `prisma-connect`
- הכתובת תהיה: **https://prisma-connect.netlify.app**

### שלב 5: הגדרת Supabase Redirect
חזור ל-Supabase → **Authentication → URL Configuration**:
- Site URL: `https://prisma-connect.netlify.app`
- Redirect URLs: `https://prisma-connect.netlify.app/**`

---

## עדכונים שוטפים
- כל `git push` ל-main → פריסה אוטומטית ב-Netlify
- שינוי Environment Variables → **Deploys → Trigger deploy**
- מיגרציות חדשות → הריצו ידנית ב-SQL Editor של Supabase

---

## מבנה תיקיות חשוב

```
prisma-crm/
├── src/
│   ├── App.tsx                          # נקודת כניסה — כאן מגדירים את ה-CRM
│   ├── components/atomic-crm/
│   │   ├── contacts/                    # חוקרים — רשימה, טופס, כרטיס
│   │   ├── companies/                   # מחלקות/מרכזי מחקר
│   │   ├── deals/                       # אירועים + Kanban
│   │   ├── tasks/                       # משימות
│   │   ├── notes/                       # הערות
│   │   ├── dashboard/                   # דשבורד ראשי
│   │   ├── settings/                    # הגדרות מערכת
│   │   ├── providers/commons/
│   │   │   ├── hebrewCrmMessages.ts     # תרגום עברי
│   │   │   ├── hebrewRaMessages.ts      # הודעות מערכת בעברית
│   │   │   └── i18nProvider.ts          # ניהול שפות
│   │   ├── root/
│   │   │   ├── CRM.tsx                  # קומפוננטת שורש
│   │   │   └── defaultConfiguration.ts  # הגדרות ברירת מחדל
│   │   └── types.ts                     # טיפוסים (Contact, Deal, etc.)
│   └── components/ui/                   # רכיבי shadcn/ui
├── supabase/
│   ├── migrations/                      # מיגרציות DB
│   └── seed.sql                         # נתוני דוגמה
└── index.html                           # RTL + Heebo font
```
