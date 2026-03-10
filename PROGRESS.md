# BuatPerjanjian Backend — Progress Tracking

## Architecture
- **Framework:** NestJS + TypeScript
- **ORM:** Prisma + PostgreSQL (Supabase)
- **Auth:** JWT + Passport
- **Queue:** Redis + BullMQ
- **API Prefix:** `/api/v1`
- **Repo:** `/home/deska/Desktop/buatperjanjian-backend`

---

## Phase 1: Backend Core — COMPLETED ✅

### [x] Task 1: Init NestJS + Prisma Schema
- NestJS project initialized, Prisma schema: 13 tables, 6 enums
- PrismaModule + PrismaService (global), ConfigModule (global)

### [x] Task 2: Auth Module
- POST `/auth/register`, POST `/auth/login`, GET `/auth/me`
- JWT strategy, bcrypt, JwtAuthGuard, RolesGuard, @CurrentUser(), @Roles()

### [x] Task 3: Users + Companies Modules
- GET/PUT `/users/profile`, POST `/companies`, GET `/companies`

### [x] Task 4: Templates + Clauses + Seed Data
- GET `/templates`, GET `/templates/:id`, GET `/clauses`
- Seed: 4 templates (PKWT, PKWTT, Freelance, NDA) + 8 clause library entries

### [x] Task 5: Documents Module
- POST `/documents`, POST `/documents/:id/draft`, POST `/documents/:id/generate`
- GET `/documents/:id`, GET `/documents`, DELETE `/documents/:id`
- GET `/documents/:id/versions`, POST restore version, POST `/documents/:id/clauses`

### [x] Task 6: Payments, Uploads, AI, PDF Download
- POST `/payments`, POST `/payments/webhook` (mock Midtrans)
- POST `/uploads` (local multer), AI mock endpoints (rewrite, explain, analyze, rebuild)
- GET `/documents/:id/download`, GET `/activity`

### [x] Task 7: Admin + Analytics
- GET `/admin/users`, POST/PUT/DELETE `/admin/templates`, GET `/admin/analytics`

### [x] Task 8: Middleware, Swagger, Docker, Queue
- Helmet, rate limiting, CORS, request logger
- Swagger at `/api/docs`
- Dockerfile + docker-compose.yml (app + postgres + redis)
- BullMQ queues: ai, pdf, email + mock processors

---

## Modules (14 total)
auth, users, companies, templates, clauses, documents, payments, uploads, ai, activity, admin, analytics, prisma, queue

## API Endpoints (~33 total)

| Module | Endpoints | Status |
|--------|-----------|--------|
| Auth | 3 (register, login, me) | ✅ Done |
| Users | 2 (get, update profile) | ✅ Done |
| Companies | 2 (create, list) | ✅ Done |
| Documents | 9 (create, draft, generate, get, list, delete, versions, restore, add clause) | ✅ Done |
| Templates | 2 (list, detail) | ✅ Done |
| Clauses | 1 (list) | ✅ Done |
| Uploads | 1 (upload file) | ✅ Done |
| AI | 4 (rewrite, explain, analyze, rebuild) | ✅ Done |
| Payments | 2 (create, webhook) | ✅ Done |
| Download | 2 (pdf, docx) | ✅ Done |
| Activity | 1 (list logs) | ✅ Done |
| Admin | 4 (users, templates CRUD) | ✅ Done |
| Analytics | 1 (dashboard stats) | ✅ Done |

## Git History
```
b77f38c Add middleware, Swagger docs, Docker setup, and BullMQ queue system
7500ca5 Add Admin and Analytics modules with admin-only endpoints
55ab53c Add Payments, Uploads, AI, Activity modules and document download endpoints
d31d52c Add Documents module with CRUD, versioning, clauses, and Handlebars contract generation
8142588 Add Templates and Clauses modules with seed data for contract templates
eaa8637 Add Users and Companies modules with profile and company CRUD endpoints
c192682 Add auth module with register, login, and JWT authentication
3fd1fbf Initial commit: NestJS project with Prisma schema (13 tables)
```

---

## Next: Phase 2 — Frontend (`buatperjanjian-frontend`)
- Next.js 14 + TypeScript + TailwindCSS + shadcn/ui
- Feature-based architecture
- Repo: `/home/deska/Desktop/buatperjanjian-frontend`
