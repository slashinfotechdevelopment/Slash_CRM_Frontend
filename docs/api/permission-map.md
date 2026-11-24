# RBAC Permission & Authorization Mapping

**System Standards:**
- **Highest Administrative Role:** `SUPER_ADMIN` (bypass permission checks for system governance)
- **Role Types:** `SUPER_ADMIN`, `ADMIN`, `HR`, `DEVELOPER`, `SALES`, `PROJECT_MANAGER`, `ACCOUNTS`, `SUPPORT`
- **Route Guard Component:** `<PermissionGuard required={...} role={...}>`
- **Navigation Drawer Filter:** In `src/app/layout/Sidebar.tsx`, dynamically filters both parent categories and nested navigation routes based on authenticated user capabilities.

---

## 1. Permission Matrix by Module

### Auth & System
- `Public`: `/api/auth/send-otp`, `/api/auth/verify-otp`, `/api/auth/bootstrap-super-admin`
- `Authenticated`: `/api/auth/me`, `/api/auth/refresh`, `/api/auth/logout`, `/api/auth/logout-all`

### Roles & Security (`roles`)
- `roles.view`: View role definitions and capability rosters (`GET /api/roles`, `GET /api/roles/:id`, `GET /api/roles/:id/permissions`)
- `roles.create`: Create custom role definitions (`POST /api/roles`)
- `roles.update`: Modify role name, description, and status (`PATCH /api/roles/:id`)
- `roles.delete`: Soft-delete or restore role definitions (`DELETE /api/roles/:id`, `PATCH /api/roles/:id/restore`)
- `roles.assign`: Configure permissions on a role, assign or unassign roles to users (`PUT /api/roles/:id/permissions`, `POST /api/roles/:id/permissions`, `DELETE /api/roles/:id/permissions/:permissionId`, `PUT /api/users/:id/roles`, `POST /api/users/:id/roles`, `DELETE /api/users/:id/roles/:roleId`)

### Permissions (`permissions`)
- `permissions.view`: Inspect catalog of all registered granular permission keys and modules (`GET /api/permissions`, `GET /api/permissions/modules`, `GET /api/permissions/:id`)
- `permissions.assign`: Create, update, delete system permissions or set explicit ALLOW/DENY user overrides (`POST /api/permissions`, `PATCH /api/permissions/:id`, `DELETE /api/permissions/:id`, `PUT /api/users/:id/permissions`)

### Departments (`departments`)
- `departments.view`: View department list and details (`GET /api/departments`, `GET /api/departments/:id`)
- `departments.create`: Create organizational business unit (`POST /api/departments`)
- `departments.update`: Modify department attributes and parent hierarchy (`PATCH /api/departments/:id`, `PUT /api/users/:id/departments`)
- `departments.delete`: Deactivate department (`DELETE /api/departments/:id`)

### Users (`users`)
- `users.view`: Browse staff directory and profile summaries (`GET /api/users`, `GET /api/users/:id`, `GET /api/users/:id/permissions`)
- `users.create`: Provision new employee or client account (`POST /api/users`)
- `users.update`: Update contact info, designation, and account status (`PATCH /api/users/:id`, `PATCH /api/users/:id/status`)
- `users.delete`: Deactivate, soft-delete, or restore account (`DELETE /api/users/:id`, `PATCH /api/users/:id/restore`)

### Attendance & Shifts (`attendance`)
- `Authenticated`: Check-in, check-out, take break, view today's session status (`POST /api/attendance/check-in`, `POST /api/attendance/check-out`, `POST /api/attendance/breaks/start`, `POST /api/attendance/breaks/end`, `GET /api/attendance/today`, `GET /api/attendance/shifts/my-assignments`)
- `attendance.view`: Inspect organization attendance records, effective shift assignments (`GET /api/attendance/history`, `POST /api/attendance/records/:recordId/recalculate`, `GET /api/attendance/shifts/effective/:userId`, `GET /api/attendance/shifts/assignments/:userId`, `GET /api/attendance/reconciliation/status`)
- `attendance.manage_shifts`: Create, modify, delete shifts, assign shifts to personnel (`POST /api/attendance/shifts`, `PATCH /api/attendance/shifts/:id`, `DELETE /api/attendance/shifts/:id`, `POST /api/attendance/shifts/assign`, `PATCH /api/attendance/shifts/assignments/:assignmentId`, `DELETE /api/attendance/shifts/assignments/:assignmentId`)
- `attendance.request_wfh`: Submit and cancel personal WFH requests (`POST /api/attendance/wfh`, `GET /api/attendance/wfh/my-requests`, `POST /api/attendance/wfh/:id/cancel`)
- `attendance.view_wfh`: Inspect team WFH requests (`GET /api/attendance/wfh`)
- `attendance.approve_wfh`: Approve or reject pending WFH requests (`POST /api/attendance/wfh/:id/approve`, `POST /api/attendance/wfh/:id/reject`)
- `attendance.request_overtime`: Submit and cancel personal overtime claims (`POST /api/attendance/overtime`, `GET /api/attendance/overtime/my-requests`, `POST /api/attendance/overtime/:id/cancel`)
- `attendance.view_overtime`: Inspect team overtime claims (`GET /api/attendance/overtime`)
- `attendance.approve_overtime`: Approve or reject overtime claims (`POST /api/attendance/overtime/:id/approve`, `POST /api/attendance/overtime/:id/reject`)
- `attendance.correct_own`: Submit and cancel attendance dispute claims (`POST /api/attendance/corrections`, `GET /api/attendance/corrections/my-requests`, `POST /api/attendance/corrections/:id/cancel`)
- `attendance.review_correction`: Review team attendance corrections (`GET /api/attendance/corrections`, `GET /api/attendance/corrections/:id`)
- `attendance.approve_correction`: Approve or reject dispute claims (`POST /api/attendance/corrections/:id/approve`, `POST /api/attendance/corrections/:id/reject`)
- `attendance.reconcile`: Trigger EOD reconciliation and view runs (`POST /api/attendance/reconciliation/run`, `GET /api/attendance/reconciliation/runs`, `GET /api/attendance/reconciliation/runs/:id`)
- `attendance.view_anomalies`: Inspect quarantined attendance anomalies (`GET /api/attendance/anomalies`, `GET /api/attendance/anomalies/:recordId`)
- `attendance.resolve_incident`: Resolve or dismiss quarantined anomalies (`POST /api/attendance/anomalies/:recordId/resolve`)

### Tasks & Kanban (`tasks`, `reports`)
- `tasks.view`: Browse tasks board, inspect task details, comments, history (`GET /api/tasks`, `GET /api/tasks/:id`, `GET /api/tasks/tags`, `GET /api/tasks/:id/comments`, `GET /api/tasks/:id/history`, `GET /api/tasks/:id/attachments`, `GET /api/tasks/:id/time-entries`, `GET /api/tasks/:id/time-summary`)
- `tasks.view_own`: Access personal assigned tasks and timer (`GET /api/tasks/my-tasks`, `GET /api/tasks/my-time-summary`, `GET /api/tasks/dashboard/my`)
- `tasks.create`: Create deliverable / work item (`POST /api/tasks`)
- `tasks.update`: Edit task details, cancel task (`PATCH /api/tasks/:id`, `POST /api/tasks/:id/cancel`)
- `tasks.assign`: Assign or reassign deliverables (`PATCH /api/tasks/:id/assign`)
- `tasks.delete`: Soft-delete tasks (`DELETE /api/tasks/:id`)
- `tasks.manage_tags`: Create, assign, or delete tags (`POST /api/tasks/tags`, `DELETE /api/tasks/tags/:tagId`)
- `tasks.timer.play` / `pause` / `resume` / `stop`: Control task timer (`POST /api/tasks/:id/timer/play`, `pause`, `resume`, `stop`)
- `tasks.timer.view_active`: Poll active timer widget (`GET /api/tasks/timer/active`)
- `tasks.submit`: Submit task for manager review (`POST /api/tasks/:id/submit`)
- `tasks.approve`: Review, approve, reject, or request changes on deliverables (`POST /api/tasks/:id/approve`, `POST /api/tasks/:id/reopen`)
- `tasks.comment`: Post, edit, or delete comments (`POST /api/tasks/:id/comments`, `PATCH /api/tasks/:id/comments/:commentId`, `DELETE /api/tasks/:id/comments/:commentId`)
- `tasks.attachment`: Upload or remove attachments (`POST /api/tasks/:id/attachments`, `DELETE /api/tasks/:id/attachments/:attachmentId`)
- `reports.view`: Access team & organization dashboards and analytical reports (`GET /api/tasks/dashboard/team`, `GET /api/tasks/dashboard/organization`, `GET /api/tasks/reports/summary`, `GET /api/tasks/reports/working-hours`, `GET /api/tasks/reports/employee-performance`, `GET /api/tasks/reports/overdue`, `GET /api/tasks/reports/reviews`)

### Leads & CRM Pipeline (`leads`, `deals`)
- `Public`: Submit public inquiry form (`POST /api/leads/public/inquire`)
- `leads.view`: Browse leads, view pipeline stages, metrics, timelines (`GET /api/leads`, `GET /api/leads/:id`, `GET /api/leads/pipeline/stages`, `GET /api/leads/metrics/summary`, `GET /api/leads/metrics/pipeline`, `GET /api/leads/:id/timeline`, `GET /api/leads/follow-ups/my`)
- `leads.create`: Register new lead (`POST /api/leads`, `POST /api/leads/import`)
- `leads.update`: Update lead attributes, log activities, schedule follow-ups, qualify lead (`PUT /api/leads/:id`, `POST /api/leads/:id/status`, `POST /api/leads/:id/activities`, `POST /api/leads/:id/follow-ups`, `PUT /api/leads/follow-ups/:id`, `POST /api/leads/:id/qualify`)
- `leads.assign`: Assign sales representatives (`POST /api/leads/:id/assign`)
- `leads.delete`: Archive or soft-delete lead (`DELETE /api/leads/:id`, `POST /api/leads/:id/restore`)
- `deals.create`: Convert lead to client & deal (`POST /api/leads/:id/convert`)

### Leave & Absence (`leave`)
- `Authenticated`: Apply for leave, view personal requests and balances, cancel own request (`POST /api/leave/requests`, `GET /api/leave/requests/my`, `GET /api/leave/balances/my`, `POST /api/leave/requests/:id/cancel`)
- `leave.manage_types`: Create and modify leave types (`POST /api/leave/types`, `GET /api/leave/types`, `GET /api/leave/types/:id`, `PATCH /api/leave/types/:id`)
- `leave.manage_policies`: Version leave entitlement policies (`POST /api/leave/types/:id/versions`)
- `leave.manage_holidays`: Create, update, delete holidays, sync Google Calendar (`GET /api/leave/holidays`, `POST /api/leave/holidays`, `PATCH /api/leave/holidays/:id`, `DELETE /api/leave/holidays/:id`, `POST /api/leave/holidays/sync-google-calendar`, `GET /api/leave/holidays/calendar.ics`)
- `leave.manage_weekly_offs`: Create weekly-off schedules (`GET /api/leave/weekly-off-policies`, `POST /api/leave/weekly-off-policies`)
- `leave.view_requests`: Inspect organization leave requests and calendar (`GET /api/leave/requests`, `GET /api/leave/requests/:id`, `GET /api/leave/calendar`)
- `leave.approve`: Approve or reject leave requests and cancellations (`POST /api/leave/requests/:id/review`, `POST /api/leave/cancellations/:id/review`)
- `leave.view_balances`: Inspect organization balance roster and audit ledger (`GET /api/leave/balances`, `GET /api/leave/transactions`)
- `leave.adjust_balances`: Perform administrative 6-bucket balance adjustments (`POST /api/leave/balances/adjust`)
- `leave.view_reports`: Generate leave consumption and liability summary reports (`GET /api/leave/reports/summary`)

### Executive Dashboards (`SUPER_ADMIN`)
- `SUPER_ADMIN`: Restricted to Super Admin accounts (`@UseGuards(SuperAdminGuard)`)
  - `GET /api/admin/employees/activity`: Employee live activity and break compliance
  - `GET /api/admin/employees/:id/sessions`: Drilldown on individual employee attendance sessions
  - `GET /api/admin/employees/:id/tasks`: Drilldown on individual employee task velocity
  - `GET /api/admin/tasks/summary`: Deliverable velocity, burndown, and completion rates
  - `GET /api/admin/leads/summary`: Executive pipeline value, conversion percentage, and deal volume
  - `GET /api/admin/leads/by-employee`: Representative sales leaderboard
  - `GET /api/admin/leads/trend`: Time-series lead acquisition and conversion trend
  - `GET /api/admin/leads/by-source`: Channel acquisition ROI distribution
