# TaskFlow – To-Do List

Multi-user To-Do List web app with authentication, task CRUD, and due-date highlighting (overdue = red, due today = yellow).

## Tech Stack

- **Frontend:** Next.js 16, React 19, Tailwind CSS
- **Backend:** Next.js API Routes (Route Handlers)
- **Database:** PostgreSQL (e.g. Vercel Postgres), Prisma 7
- **Auth:** JWT in httpOnly cookie (session-style)
- **Validation:** Zod

## Project Structure (per .clinerules)

```
src/
├── app/
│   ├── api/           # Route Handlers
│   │   ├── register/
│   │   ├── login/
│   │   ├── logout/
│   │   └── tasks/     # GET, POST and /[id] PUT, DELETE
│   ├── dashboard/     # Main task list (protected)
│   ├── login/
│   ├── register/
│   ├── layout.tsx
│   └── page.tsx       # Redirects to /dashboard or /login
├── components/
│   ├── ui/            # Base UI (button, input, label, card, toast)
│   └── features/      # AuthForm, TaskItem, TaskList, TaskForm, DashboardHeader
├── lib/               # db, auth, date-utils, validations, task-utils, utils
├── types/             # task.ts (TaskDto, ApiSuccess, ApiError)
├── middleware.ts      # Protects /dashboard and /api/tasks
prisma/
├── schema.prisma      # User, Task
prisma.config.ts       # DATABASE_URL for Prisma 7
```

## Setup

1. **Environment**

   Copy `.env.example` to `.env` and set a real PostgreSQL URL (e.g. from Vercel Postgres):

   ```bash
   cp .env.example .env
   # Edit .env: set DATABASE_URL and optionally JWT_SECRET
   ```

2. **Database**

   Run migrations (creates tables):

   ```bash
   npx prisma migrate dev --name init
   ```

3. **Run**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000). You’ll be redirected to `/login`. Register, then use the dashboard to create and manage tasks.

## Features (MVP)

- Register / Login with duplicate-email and email-not-found handling
- Create, edit, delete tasks; toggle completed
- Pending vs Completed sections on one page
- Pending sorted: Overdue → Due today → Near → Later
- Completed sorted by last updated
- Overdue tasks: red; Due today: yellow
- Each user sees only their own tasks

## API Contract

See `spec_base.md` for full request/response shapes (e.g. `POST /api/register`, `POST /api/login`, `GET/POST /api/tasks`, `PUT/DELETE /api/tasks/:id`).

---

## Deploy ขึ้น Vercel

### 1. ติดตั้ง Vercel CLI

```bash
npm install -g vercel
```

หรือใช้แบบไม่ติดตั้งทั่วทั้งเครื่อง (รันในโฟลเดอร์โปรเจกต์):

```bash
npx vercel
```

### 2. Login (ครั้งแรกเท่านั้น)

```bash
vercel login
```

จะเปิดเบราว์เซอร์ให้ล็อกอินหรือใส่อีเมลเพื่อรับลิงก์

### 3. Deploy จากโฟลเดอร์โปรเจกต์

เปิด Terminal ในโฟลเดอร์โปรเจกต์ (เช่น `to-do-list`) แล้วรัน:

```bash
cd "C:\Users\KK\Documents\AI Workshop\Day2\to-do-list"
vercel
```

- ครั้งแรกจะถาม **Set up and deploy?** → กด `Y`
- **Which scope?** → เลือกบัญชีหรือทีม
- **Link to existing project?** → ถ้ายังไม่มีโปรเจกต์เลือก `N`
- **Project name?** → กด Enter ใช้ชื่อโฟลเดอร์ หรือพิมพ์ชื่อเช่น `taskflow`
- **Directory?** → กด Enter (ใช้ `.` = โฟลเดอร์ปัจจุบัน)
- ระบบจะ build และได้ URL เช่น `https://to-do-list-xxx.vercel.app`

### 4. ตั้งค่า Environment Variables บน Vercel

โปรเจกต์ใช้ **DATABASE_URL** (และถ้าต้องการ **JWT_SECRET**):

1. ไปที่ [vercel.com](https://vercel.com) → เลือกโปรเจกต์
2. **Settings** → **Environment Variables**
3. เพิ่มตัวแปร:
   - **Name:** `DATABASE_URL`  
     **Value:** connection string ของ Vercel Postgres (หรือ PostgreSQL อื่น)  
     **Environment:** Production (และ Preview ถ้าต้องการ)
   - (ถ้าต้องการ) **Name:** `JWT_SECRET`  
     **Value:** สตริงลับยาวๆ สำหรับ production  
     **Environment:** Production (และ Preview ถ้าต้องการ)

**สร้าง Vercel Postgres (ถ้ายังไม่มี):**

- ใน Vercel Dashboard: **Storage** → **Create Database** → **Postgres**  
- สร้างเสร็จแล้วไปที่แท็บ **.env** หรือ **.env.local** จะมี `POSTGRES_URL` หรือ `DATABASE_URL`  
- คัดลอกค่าไปใส่ใน **Environment Variables** ของโปรเจกต์เป็น `DATABASE_URL`

### 5. รัน Migration บนฐานข้อมูล Production

หลังตั้งค่า `DATABASE_URL` ของ production แล้ว รัน migration ครั้งเดียว (จากเครื่องคุณ):

```bash
# ใช้ค่า DATABASE_URL ของ production (จาก Vercel → Storage → .env)
set DATABASE_URL=postgresql://...   # Windows CMD
# หรือใน PowerShell:
$env:DATABASE_URL="postgresql://..."

npx prisma migrate deploy
```

หรือใน Vercel Dashboard → **Storage** → เลือก DB → **Query** หรือใช้ connection string นั้นกับเครื่องมืออื่นแล้วรัน SQL ตาม migration ก็ได้

### 6. Deploy อีกครั้งหลังเพิ่ม env

ถ้าเพิ่ม Environment Variables หลังจาก deploy ไปแล้ว ให้ deploy ใหม่เพื่อให้ build ใหม่ได้อ่านตัวแปรล่าสุด:

```bash
vercel --prod
```

`--prod` = deploy ไปที่ Production (โดเมนหลักของโปรเจกต์)

### คำสั่ง Vercel CLI ที่ใช้บ่อย

| คำสั่ง | ความหมาย |
|--------|----------|
| `vercel` | Deploy เป็น Preview (ได้ URL แยกแต่ละครั้ง) |
| `vercel --prod` | Deploy ไป Production |
| `vercel env ls` | ดูรายการ env ในโปรเจกต์ |
| `vercel logs <url>` | ดู logs ของ deployment |

เสร็จแล้วเปิด URL ที่ได้จาก Vercel (เช่น `https://your-project.vercel.app`) จะถูกส่งไป `/login` และใช้งานได้ตามปกติ
