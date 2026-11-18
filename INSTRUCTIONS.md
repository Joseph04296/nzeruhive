# ThanziLearn v1 setup

Folders: `server/` (Node + Express + PostgreSQL) and `client/` (React + Vite + Tailwind).

## 1. Database (Neon)
Create a Neon project and copy the connection string.

## 2. Server (PowerShell)
```
cd server
copy .env.example .env      # then edit .env: paste DATABASE_URL, set JWT_SECRET
npm install
npm run seed                # creates tables, 2 staff accounts, 1 sample course
npm start                   # http://localhost:5000
```

## 3. Client (new PowerShell window)
```
cd client
copy .env.example .env
npm install
npm run dev                 # http://localhost:5173
```

## 4. Logins (change these passwords before going live)
- Admin: admin@thanzilearn.mw / Password123
- Supervisor: supervisor@thanzilearn.mw / Password123
- Learners: register from the login page.

## 5. Adding courses
Log in as admin, open "New course", fill the form and edit the lessons and questions JSON. `answer` is the index of the correct option, starting at 0. A lesson's `video_url` must be an embed link (e.g. https://www.youtube.com/embed/VIDEO_ID).

## 6. Deploy
- Render (web service): root `server`, build `npm install`, start `npm start`. Env vars: DATABASE_URL, JWT_SECRET, CLIENT_URL (your Vercel URL).
- Vercel: root `client`, env var VITE_API_URL = your Render URL.
- Run `npm run seed` once against the production database.

## Notes
- The sample course is placeholder content. Have a qualified clinician review any medical content before real learners use it.
- Left for later versions: friendlier course editor, file uploads, user role management screen, password reset, learning paths.
