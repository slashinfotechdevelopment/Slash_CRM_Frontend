# Slash CRM Frontend

Modern Enterprise CRM and Workforce Management Frontend application built with React, TypeScript, Tailwind CSS, and Vite. Connects all 177 backend APIs across authentication, role-based access control, departments, users, attendance tracking, shift scheduling, deliverables & Kanban boards, lead CRM pipelines, leave management, and executive analytics.

## Tech Stack
- **Framework:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + Design Tokens (Slash Infotech brand gradient)
- **Routing:** React Router v6
- **Architecture:** Layered Architecture (`UI Pages -> Hooks -> Connectors -> HTTP Client`)
- **HTTP Client:** Single unified Axios client with request queuing and automatic token rotation
- **Icons:** Lucide React

## Modules & Capabilities
1. **Authentication & Profile:** OTP sign-in, token rotation, Super Admin bootstrap (`/login`, `/setup`, `/api/auth/*`).
2. **Roles, Permissions & Departments:** Granular RBAC, bulk permission assignment, departments management (`/roles`, `/permissions`, `/departments`).
3. **Users & Organization:** Staff roster, user detail, designation, role assignment, active workspace (`/users`, `/users/:id`).
4. **Attendance & Shifts:** Authoritative check-in/out, live timer continuation, team attendance oversight, shifts management, WFH, overtime, corrections, anomaly resolution (`/attendance/*`).
5. **Tasks & Deliverables:** Kanban board, personal timer with pause/resume, review approval workflows, audit history, task reports (`/tasks/*`).
6. **Leads & Pipeline CRM:** Multi-stage CRM pipeline, conversion yield, activity timeline, scheduled follow-ups, CSV lead import, public lead portal (`/leads/*`, `/inquire`).
7. **Leave & Holidays:** Annual leave balances, live working days calculator, manager review queue, 6-bucket audit ledger, interactive month calendar, public holidays, Google Calendar sync, iCal feed, policy versions (`/leave/*`).
8. **Executive Dashboards & Reports:** Personnel online activity audit, session footprints, deliverable throughput velocity, CRM conversion leaderboard, acquisition trend time-series (`/admin/*`).

## Verification & Auditing
- **API Inventory:** `docs/api/inventory.md` (177 / 177 endpoints completed)
- **Multi-Role RBAC:** `node scripts/test_part_d_multi_role.mjs`
- **Request Hygiene Audit (30 routes):** `node scripts/request_hygiene_check.js`
- **Database Safety Audit:** `node scripts/verify_db_safety.mjs`
- **Build Check:** `npm run build` (0 TypeScript compilation errors)
- **Duplication Audit:** `npx jscpd src --threshold 10` (5.00% duplication)
