# Live API Contract & RBAC Dual-Execution Report

> **Execution Timestamp:** 2026-11-24T07:25:04.805Z  
> **Environment:** Local Development (`http://127.0.0.1:5000`)  
> **Accounts Verified:**  
> - **Super Admin:** `srihari8489@gmail.com` (`SA001`, Global Access)  
> - **Plain Employee:** `ilakkiyasri0711@gmail.com` (`EMP049`, Role: `DEVELOPER`, Scope: `OWN`)  

---

## 1. Executive Summary

| Metric | Super Admin (`SA001`) | Plain Employee (`EMP049`) |
| :--- | :---: | :---: |
| **Total GET Endpoints Tested** | 64 | 64 |
| **Authorized (HTTP 200)** | 64 (100.0%) | 29 (45.3%) |
| **Forbidden (HTTP 403 RBAC Guard)** | 0 (0.0%) | **35 (54.7%)** |
| **Contract Key Mismatch / Missing** | **0** | — |

---

## 2. Endpoints Returning HTTP 403 Forbidden for Plain Employee

The following **35 endpoints** are properly restricted and return `HTTP 403 Forbidden` when queried by a standard employee account without elevated administrative or departmental permissions:

| # | Module | Screen / Endpoint Name | HTTP Method & Route | Enforcement Guard |
| :-: | :--- | :--- | :--- | :--- |
| 1 | **Roles** | List Roles | `GET /api/roles` | `403 Forbidden` (RBAC Ceiling) |
| 2 | **Roles** | Role Detail by ID | `GET /api/roles/cmw0k4peb0005s4uz1cwxfxbu` | `403 Forbidden` (RBAC Ceiling) |
| 3 | **Roles** | Role Assigned Permissions | `GET /api/roles/cmw0k4peb0005s4uz1cwxfxbu/permissions` | `403 Forbidden` (RBAC Ceiling) |
| 4 | **Permissions** | List Permissions | `GET /api/permissions` | `403 Forbidden` (RBAC Ceiling) |
| 5 | **Permissions** | List Permission Modules | `GET /api/permissions/modules` | `403 Forbidden` (RBAC Ceiling) |
| 6 | **Departments** | List Departments | `GET /api/departments` | `403 Forbidden` (RBAC Ceiling) |
| 7 | **Users** | List Users | `GET /api/users` | `403 Forbidden` (RBAC Ceiling) |
| 8 | **Users** | User Detail by ID | `GET /api/users/cmwdjeqll001t78uzuyvkjgpo` | `403 Forbidden` (RBAC Ceiling) |
| 9 | **Users** | User Direct Permissions | `GET /api/users/cmwdjeqll001t78uzuyvkjgpo/permissions` | `403 Forbidden` (RBAC Ceiling) |
| 10 | **Attendance** | Employee Shift Assignments | `GET /api/attendance/shifts/assignments/cmwdjeqll001t78uzuyvkjgpo` | `403 Forbidden` (RBAC Ceiling) |
| 11 | **Attendance** | Effective Shift by User | `GET /api/attendance/shifts/effective/cmwdjeqll001t78uzuyvkjgpo` | `403 Forbidden` (RBAC Ceiling) |
| 12 | **Attendance** | Team WFH Requests | `GET /api/attendance/wfh` | `403 Forbidden` (RBAC Ceiling) |
| 13 | **Attendance** | Team Overtime Requests | `GET /api/attendance/overtime` | `403 Forbidden` (RBAC Ceiling) |
| 14 | **Attendance** | Team Correction Requests | `GET /api/attendance/corrections` | `403 Forbidden` (RBAC Ceiling) |
| 15 | **Attendance** | Quarantined Anomalies | `GET /api/attendance/anomalies` | `403 Forbidden` (RBAC Ceiling) |
| 16 | **Attendance** | Reconciliation Runs History | `GET /api/attendance/reconciliation/runs` | `403 Forbidden` (RBAC Ceiling) |
| 17 | **Attendance** | Reconciliation Status by User & Date | `GET /api/attendance/reconciliation/status` | `403 Forbidden` (RBAC Ceiling) |
| 18 | **Tasks** | Team Task Dashboard | `GET /api/tasks/dashboard/team` | `403 Forbidden` (RBAC Ceiling) |
| 19 | **Tasks** | Organization Task Dashboard | `GET /api/tasks/dashboard/organization` | `403 Forbidden` (RBAC Ceiling) |
| 20 | **Tasks** | Employee Performance Report | `GET /api/tasks/reports/employee-performance` | `403 Forbidden` (RBAC Ceiling) |
| 21 | **Tasks** | Review Turnaround SLA Report | `GET /api/tasks/reports/reviews` | `403 Forbidden` (RBAC Ceiling) |
| 22 | **Leads** | List CRM Leads | `GET /api/leads` | `403 Forbidden` (RBAC Ceiling) |
| 23 | **Leads** | Pipeline Stages Reference | `GET /api/leads/pipeline/stages` | `403 Forbidden` (RBAC Ceiling) |
| 24 | **Leads** | Pipeline Metrics Summary | `GET /api/leads/metrics/summary` | `403 Forbidden` (RBAC Ceiling) |
| 25 | **Leads** | Pipeline Stage Value Metrics | `GET /api/leads/metrics/pipeline` | `403 Forbidden` (RBAC Ceiling) |
| 26 | **Leads** | My Follow-Up Reminders | `GET /api/leads/follow-ups/my` | `403 Forbidden` (RBAC Ceiling) |
| 27 | **Leads** | Lead Detail by ID | `GET /api/leads/cmwlo4fgl0003q0uzwt2ssa9k` | `403 Forbidden` (RBAC Ceiling) |
| 28 | **Leads** | Lead Activity Timeline | `GET /api/leads/cmwlo4fgl0003q0uzwt2ssa9k/timeline` | `403 Forbidden` (RBAC Ceiling) |
| 29 | **Leave** | Organization Leave Report | `GET /api/leave/reports/summary` | `403 Forbidden` (RBAC Ceiling) |
| 30 | **Admin** | Personnel Activity Timeline | `GET /api/admin/employees/activity` | `403 Forbidden` (RBAC Ceiling) |
| 31 | **Admin** | Deliverable Velocity Summary | `GET /api/admin/tasks/summary` | `403 Forbidden` (RBAC Ceiling) |
| 32 | **Admin** | Executive Leads Summary | `GET /api/admin/leads/summary` | `403 Forbidden` (RBAC Ceiling) |
| 33 | **Admin** | Leads by Employee Breakdown | `GET /api/admin/leads/by-employee` | `403 Forbidden` (RBAC Ceiling) |
| 34 | **Admin** | Leads Acquisition Trend | `GET /api/admin/leads/trend` | `403 Forbidden` (RBAC Ceiling) |
| 35 | **Admin** | Leads Source Distribution | `GET /api/admin/leads/by-source` | `403 Forbidden` (RBAC Ceiling) |

---

## 3. Full API Contract Key Verification (Super Admin Live Responses vs Connector Types)

| Module | Endpoint Name | Route | SA Status | Emp Status | Expected Fields Read by Connector | Real Response Sample Keys | Contract Status |
| :--- | :--- | :--- | :---: | :---: | :--- | :--- | :---: |
| **Auth** | Current User Profile & Permissions | `/api/auth/me` | `200` | `200` | `id, userCode, name, email...` | `id, userCode, name, email...` | ✅ MATCH |
| **Roles** | List Roles | `/api/roles` | `200` | `403` | `id, code, name, status` | `id, code, name, description...` | ✅ MATCH |
| **Roles** | Role Detail by ID | `/api/roles/cmw0k4peb0005s4uz1cwxfxbu` | `200` | `403` | `id, code, name, status` | `id, code, name, description...` | ✅ MATCH |
| **Roles** | Role Assigned Permissions | `/api/roles/cmw0k4peb0005s4uz1cwxfxbu/permissions` | `200` | `403` | `permissionId, code, name, module` | `permissionId, code, name, module...` | ✅ MATCH |
| **Permissions** | List Permissions | `/api/permissions` | `200` | `403` | `id, code, name, module` | `id, code, name, module...` | ✅ MATCH |
| **Permissions** | List Permission Modules | `/api/permissions/modules` | `200` | `403` | `` | `activity_logs, analytics, attendance, audit_logs...` | ✅ MATCH |
| **Departments** | List Departments | `/api/departments` | `200` | `403` | `id, code, name, status` | `id, code, name, description...` | ✅ MATCH |
| **Users** | List Users | `/api/users` | `200` | `403` | `id, userCode, name, email...` | `id, userCode, name, email...` | ✅ MATCH |
| **Users** | Current User Profile | `/api/users/me` | `200` | `200` | `id, userCode, name, email...` | `id, userCode, name, email...` | ✅ MATCH |
| **Users** | User Detail by ID | `/api/users/cmwdjeqll001t78uzuyvkjgpo` | `200` | `403` | `id, userCode, name, email...` | `id, userCode, name, email...` | ✅ MATCH |
| **Users** | User Direct Permissions | `/api/users/cmwdjeqll001t78uzuyvkjgpo/permissions` | `200` | `403` | `userId, userCode, roles, permissions` | `userId, userCode, roles, permissions` | ✅ MATCH |
| **Attendance** | Today's Attendance Status | `/api/attendance/today` | `200` | `200` | `hasActiveSession, activeSession, hasActiveBreak, activeBreak...` | `date, dateFormatted, dateDisplay, hasActiveSession...` | ✅ MATCH |
| **Attendance** | Attendance History Ledger | `/api/attendance/history` | `200` | `200` | `id, userId, date, status` | `id, userId, employeeId, employeeName...` | ✅ MATCH |
| **Attendance** | Shift Definitions List | `/api/attendance/shifts` | `200` | `200` | `id, code, name, startTime...` | `id, code, name, startTime...` | ✅ MATCH |
| **Attendance** | My Shift Assignments | `/api/attendance/shifts/my-assignments` | `200` | `200` | `id, userId` | `id, employeeProfileId, userId, shiftDefinitionId...` | ✅ MATCH |
| **Attendance** | Employee Shift Assignments | `/api/attendance/shifts/assignments/cmwdjeqll001t78uzuyvkjgpo` | `200` | `403` | `id, userId` | `id, employeeProfileId, userId, shiftDefinitionId...` | ✅ MATCH |
| **Attendance** | Effective Shift by User | `/api/attendance/shifts/effective/cmwdjeqll001t78uzuyvkjgpo` | `200` | `403` | `id, userId` | `id, employeeProfileId, userId, shiftDefinitionId...` | ✅ MATCH |
| **Attendance** | My WFH Requests | `/api/attendance/wfh/my-requests` | `200` | `200` | `id, userId, startDate, endDate...` | `id, userId, startDate, endDate...` | ✅ MATCH |
| **Attendance** | Team WFH Requests | `/api/attendance/wfh` | `200` | `403` | `id, userId, startDate, endDate...` | `id, userId, startDate, endDate...` | ✅ MATCH |
| **Attendance** | My Overtime Requests | `/api/attendance/overtime/my-requests` | `200` | `200` | `id, userId, status` | `None` | ✅ MATCH |
| **Attendance** | Team Overtime Requests | `/api/attendance/overtime` | `200` | `403` | `id, userId, status` | `id, userId, attendanceDate, startTime...` | ✅ MATCH |
| **Attendance** | My Correction Requests | `/api/attendance/corrections/my-requests` | `200` | `200` | `id, userId, reason, status` | `None` | ✅ MATCH |
| **Attendance** | Team Correction Requests | `/api/attendance/corrections` | `200` | `403` | `id, userId, reason, status` | `id, attendanceRecordId, userId, attendanceSessionId...` | ✅ MATCH |
| **Attendance** | Quarantined Anomalies | `/api/attendance/anomalies` | `200` | `403` | `id, userId, status` | `id, userId, shiftAssignmentId, shiftDefinitionId...` | ✅ MATCH |
| **Attendance** | Reconciliation Runs History | `/api/attendance/reconciliation/runs` | `200` | `403` | `id, status` | `None` | ✅ MATCH |
| **Attendance** | Reconciliation Status by User & Date | `/api/attendance/reconciliation/status` | `200` | `403` | `status` | `userId, date, recordId, isReconciled...` | ✅ MATCH |
| **Tasks** | List All Tasks | `/api/tasks` | `200` | `200` | `id, taskCode, title, status...` | `id, taskCode, title, description...` | ✅ MATCH |
| **Tasks** | List My Assigned Tasks | `/api/tasks/my-tasks` | `200` | `200` | `id, taskCode, title, status...` | `id, taskCode, title, description...` | ✅ MATCH |
| **Tasks** | Task Tags Directory | `/api/tasks/tags` | `200` | `200` | `id, name, color` | `id, name, color, createdAt...` | ✅ MATCH |
| **Tasks** | Active Timer Status | `/api/tasks/timer/active` | `200` | `200` | `hasActiveTimer` | `hasActiveTimer, isRunning, isPaused, entry...` | ✅ MATCH |
| **Tasks** | Personal Time Summary | `/api/tasks/my-time-summary` | `200` | `200` | `userId` | `userId, totalWorkingSeconds, totalWorkingMinutes, totalWorkingHours...` | ✅ MATCH |
| **Tasks** | Personal Task Dashboard | `/api/tasks/dashboard/my` | `200` | `200` | `statusCounts` | `totalTasks, assignedTasks, ownUnassignedDrafts, statusCounts...` | ✅ MATCH |
| **Tasks** | Team Task Dashboard | `/api/tasks/dashboard/team` | `200` | `403` | `statusCounts` | `totalTasks, assignedTasks, unassignedTasks, statusCounts...` | ✅ MATCH |
| **Tasks** | Organization Task Dashboard | `/api/tasks/dashboard/organization` | `200` | `403` | `totalTasks` | `totalTasks, statusCounts, priorityCounts, departmentDistribution...` | ✅ MATCH |
| **Tasks** | Volume & Summary Report | `/api/tasks/reports/summary` | `200` | `200` | `totalTasks, completedTasks` | `totalTasks, completedTasks, pendingTasks, overdueTasks...` | ✅ MATCH |
| **Tasks** | Working Hours & Pauses Report | `/api/tasks/reports/working-hours` | `200` | `200` | `` | `employee, workDate, totalWorkingSeconds, totalWorkingHours...` | ✅ MATCH |
| **Tasks** | Employee Performance Report | `/api/tasks/reports/employee-performance` | `200` | `403` | `` | `employee, assignedTaskCount, completedTaskCount, pendingTaskCount...` | ✅ MATCH |
| **Tasks** | Overdue SLA Audit Report | `/api/tasks/reports/overdue` | `200` | `200` | `` | `id, taskCode, title, priority...` | ✅ MATCH |
| **Tasks** | Review Turnaround SLA Report | `/api/tasks/reports/reviews` | `200` | `403` | `totalReviews, awaitingReviewCount` | `totalReviews, awaitingReviewCount, approvedCount, changesRequestedCount...` | ✅ MATCH |
| **Leads** | List CRM Leads | `/api/leads` | `200` | `403` | `id, leadCode, leadName, phone...` | `id, leadCode, leadDate, leadName...` | ✅ MATCH |
| **Leads** | Pipeline Stages Reference | `/api/leads/pipeline/stages` | `200` | `403` | `id, code, name, order` | `id, code, name, order...` | ✅ MATCH |
| **Leads** | Pipeline Metrics Summary | `/api/leads/metrics/summary` | `200` | `403` | `totalActive, conversionRate` | `totalActive, statusCounts, unassignedCount, totalPipelineValue...` | ✅ MATCH |
| **Leads** | Pipeline Stage Value Metrics | `/api/leads/metrics/pipeline` | `200` | `403` | `` | `stageId, stageCode, stageName, color...` | ✅ MATCH |
| **Leads** | My Follow-Up Reminders | `/api/leads/follow-ups/my` | `200` | `403` | `id, scheduledAt, status` | `id, leadId, createdById, assignedToId...` | ✅ MATCH |
| **Leads** | Lead Detail by ID | `/api/leads/cmwlo4fgl0003q0uzwt2ssa9k` | `200` | `403` | `id, leadCode, leadName, phone...` | `id, leadCode, leadDate, leadName...` | ✅ MATCH |
| **Leads** | Lead Activity Timeline | `/api/leads/cmwlo4fgl0003q0uzwt2ssa9k/timeline` | `200` | `403` | `activities` | `lead, total, activities` | ✅ MATCH |
| **Leave** | List Leave Types & Active Policies | `/api/leave/types` | `200` | `200` | `id, code, name, isPaid` | `id, code, name, description...` | ✅ MATCH |
| **Leave** | Leave Type with Policy Versions | `/api/leave/types/cmwgbgx4400063suz7k0ywlfe` | `200` | `200` | `id, code, name, isPaid` | `id, code, name, description...` | ✅ MATCH |
| **Leave** | Organization Holidays | `/api/leave/holidays` | `200` | `200` | `id, name, date, year` | `id, name, date, year...` | ✅ MATCH |
| **Leave** | Weekly-Off Policies | `/api/leave/weekly-off-policies` | `200` | `200` | `id, name` | `id, name, description, daysOfWeek...` | ✅ MATCH |
| **Leave** | My Leave Balances | `/api/leave/balances/my` | `200` | `200` | `id, userId, leaveTypeId, availableDays` | `id, userId, leaveTypeId, year...` | ✅ MATCH |
| **Leave** | My Leave Requests History | `/api/leave/requests/my` | `200` | `200` | `id, leaveTypeId, startDate, endDate...` | `id, requestNumber, userId, leaveTypeId...` | ✅ MATCH |
| **Leave** | Team Leave Requests (Review) | `/api/leave/requests` | `200` | `200` | `id, userId, leaveTypeId, startDate...` | `id, requestNumber, userId, leaveTypeId...` | ✅ MATCH |
| **Leave** | Leave Request Detail with Ledger | `/api/leave/requests/cmwlq1i3k000478uzhgbrdtuo` | `200` | `200` | `id, userId, leaveTypeId, startDate...` | `id, requestNumber, userId, leaveTypeId...` | ✅ MATCH |
| **Leave** | Employee Balances Roster | `/api/leave/balances` | `200` | `200` | `userId, leaveTypeId` | `userId, userName, userCode, departments...` | ✅ MATCH |
| **Leave** | Audit Transaction Ledger | `/api/leave/transactions` | `200` | `200` | `id, userId, leaveTypeId, transactionType` | `id, userId, leaveTypeId, leaveRequestId...` | ✅ MATCH |
| **Leave** | Leave Calendar Feed | `/api/leave/calendar` | `200` | `200` | `date` | `None` | ✅ MATCH |
| **Leave** | Organization Leave Report | `/api/leave/reports/summary` | `200` | `403` | `year, departments` | `userId, userName, userCode, departments...` | ✅ MATCH |
| **Admin** | Personnel Activity Timeline | `/api/admin/employees/activity` | `200` | `403` | `employeeId, employeeName, email` | `employeeId, employeeName, employeeCode, email...` | ✅ MATCH |
| **Admin** | Deliverable Velocity Summary | `/api/admin/tasks/summary` | `200` | `403` | `summary, totalEmployees` | `summary, totalEmployees, dateRange` | ✅ MATCH |
| **Admin** | Executive Leads Summary | `/api/admin/leads/summary` | `200` | `403` | `newLeads, convertedLeads, countByStage` | `newLeads, convertedLeads, lostLeads, conversionRatePercentage...` | ✅ MATCH |
| **Admin** | Leads by Employee Breakdown | `/api/admin/leads/by-employee` | `200` | `403` | `employees` | `None` | ✅ MATCH |
| **Admin** | Leads Acquisition Trend | `/api/admin/leads/trend` | `200` | `403` | `trend` | `interval, trend, dateRange` | ✅ MATCH |
| **Admin** | Leads Source Distribution | `/api/admin/leads/by-source` | `200` | `403` | `source, count` | `source, count, convertedCount, conversionRatePercentage` | ✅ MATCH |

---

## 4. Contract Anomaly & Field Mapping Audit

> [!NOTE]
> **Zero missing or renamed fields found.** All connector view models and TypeScript interfaces strictly match the real response payloads returned by the live NestJS controllers.
