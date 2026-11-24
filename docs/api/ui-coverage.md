# Frontend UI Coverage & API Mapping (177 Endpoints)

**Total Backend APIs:** 177  
**Frontend UI Coverage:** 100% (All 177 endpoints wired to connectors, hooks, components, or user actions)  
**Authentication Standard:** Bearer JWT with silent token refresh interceptor  
**Authorization Standard:** RBAC Route Guards (`PermissionGuard`), filtered Navigation Drawer, and capability-checked action buttons  

---

## 1. Authentication & Security (Endpoints 1–7)

| Sl | Method | Endpoint Path | Connector Method | Triggering UI Screen | Action / User Trigger | Permission Guard |
| :---: | :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | `POST` | `/api/auth/send-otp` | `authConnector.requestOtp` | `LoginPage.tsx` | Enter email & click "Send Verification Code" | Public |
| 2 | `POST` | `/api/auth/verify-otp` | `authConnector.verifyOtp` | `LoginPage.tsx` | Enter 6-digit code & click "Verify & Sign In" | Public |
| 3 | `GET` | `/api/auth/me` | `authConnector.getMe` | Global `AuthProvider` (`useAuth.tsx`) | Session bootstrap on app mount / page refresh | Authenticated |
| 4 | `POST` | `/api/auth/refresh` | `authConnector.refreshToken` | Axios Interceptor (`httpClient.ts`) | Automatic on HTTP 401 response | Authenticated |
| 5 | `POST` | `/api/auth/logout` | `authConnector.logout` | `Sidebar.tsx` / `Header.tsx` | Click "Sign Out" icon button | Authenticated |
| 6 | `POST` | `/api/auth/logout-all` | `authConnector.logoutAll` | `UserDetailPage.tsx` | Click "Revoke All Active Sessions" | Authenticated |
| 7 | `POST` | `/api/auth/bootstrap-super-admin` | `authConnector.bootstrapSuperAdmin` | `SetupPage.tsx` | Submit initial system setup form | Public (First Run) |

---

## 2. Roles, Permissions & Security (Endpoints 8–23, 31–33, 35–36)

| Sl | Method | Endpoint Path | Connector Method | Triggering UI Screen | Action / User Trigger | Permission Guard |
| :---: | :---: | :--- | :--- | :--- | :--- | :---: |
| 8 | `POST` | `/api/roles` | `rolesConnector.createRole` | `RolesListPage.tsx` | Submit "Create Role" modal | `roles.create` |
| 9 | `GET` | `/api/roles` | `rolesConnector.getRoles` | `RolesListPage.tsx` | Page mount, search filter, pagination | `roles.view` |
| 10 | `GET` | `/api/roles/:id` | `rolesConnector.getRole` | `RoleDetailPage.tsx` | Page mount on navigating to `/roles/:id` | `roles.view` |
| 11 | `PATCH` | `/api/roles/:id` | `rolesConnector.updateRole` | `RolesListPage.tsx`, `RoleDetailPage.tsx` | Submit "Edit Role Details" modal | `roles.update` |
| 12 | `DELETE` | `/api/roles/:id` | `rolesConnector.deleteRole` | `RolesListPage.tsx`, `RoleDetailPage.tsx` | Confirm "Deactivate Role" danger dialog | `roles.delete` |
| 13 | `GET` | `/api/roles/:id/permissions` | `rolesConnector.getRolePermissions` | `RoleDetailPage.tsx` | Load assigned permissions table on mount | `roles.view` |
| 14 | `PUT` | `/api/roles/:id/permissions` | `rolesConnector.replaceRolePermissions` | `RoleDetailPage.tsx` | Bulk save in "Configure All Permissions" modal | `roles.assign` |
| 15 | `POST` | `/api/roles/:id/permissions` | `rolesConnector.addPermissionToRole` | `RoleDetailPage.tsx` | Submit "Assign Single Permission" modal | `roles.assign` |
| 16 | `DELETE` | `/api/roles/:id/permissions/:permissionId` | `rolesConnector.removePermissionFromRole` | `RoleDetailPage.tsx` | Confirm "Remove Permission" action | `roles.assign` |
| 17 | `POST` | `/api/permissions` | `permissionsConnector.createPermission` | `PermissionsListPage.tsx` | Submit "Create Permission" modal | `permissions.assign` |
| 18 | `GET` | `/api/permissions` | `permissionsConnector.getPermissions` | `PermissionsListPage.tsx` | Page mount, module filter, search | `permissions.view` |
| 19 | `GET` | `/api/permissions/modules` | `permissionsConnector.getModules` | `PermissionsListPage.tsx` | Module selector tabs on page mount | `permissions.view` |
| 20 | `GET` | `/api/permissions/:id` | `permissionsConnector.getPermission` | `PermissionsListPage.tsx` | Click row to inspect permission details | `permissions.view` |
| 21 | `PATCH` | `/api/permissions/:id` | `permissionsConnector.updatePermission` | `PermissionsListPage.tsx` | Submit "Edit Permission" modal | `permissions.assign` |
| 22 | `DELETE` | `/api/permissions/:id` | `permissionsConnector.deletePermission` | `PermissionsListPage.tsx` | Confirm "Delete Permission" danger dialog | `permissions.assign` |
| 23 | `PATCH` | `/api/roles/:id/restore` | `rolesConnector.restoreRole` | `RolesListPage.tsx` | Click "Restore" on archived role | `roles.delete` |
| 31 | `PUT` | `/api/users/:id/roles` | `rolesConnector.replaceUserRoles` | `UserDetailPage.tsx` | Submit "Manage Assigned Roles" modal | `roles.assign` |
| 32 | `POST` | `/api/users/:id/roles` | `rolesConnector.assignUserRole` | `UserDetailPage.tsx` | Quick-add role pill to user | `roles.assign` |
| 33 | `DELETE` | `/api/users/:id/roles/:roleId` | `rolesConnector.removeUserRole` | `UserDetailPage.tsx` | Click "x" on assigned role pill | `roles.assign` |
| 35 | `PUT` | `/api/users/:id/permissions` | `permissionsConnector.replaceUserPermissions` | `UserDetailPage.tsx` | Submit "Permission Overrides" modal | `permissions.assign` |
| 36 | `GET` | `/api/users/:id/permissions` | `permissionsConnector.getUserPermissions` | `UserDetailPage.tsx` | Mount "Effective Permissions" tab | `users.view` |

---

## 3. Users & Organizational Departments (Endpoints 24–30, 34, 171–175)

| Sl | Method | Endpoint Path | Connector Method | Triggering UI Screen | Action / User Trigger | Permission Guard |
| :---: | :---: | :--- | :--- | :--- | :--- | :---: |
| 24 | `POST` | `/api/users` | `usersConnector.createUser` | `UsersListPage.tsx` | Submit "Add User Account" modal | `users.create` |
| 25 | `GET` | `/api/users` | `usersConnector.getUsers` | `UsersListPage.tsx` | Page mount, department / role filter | `users.view` |
| 26 | `GET` | `/api/users/:id` | `usersConnector.getUser` | `UserDetailPage.tsx` | Mount user detail page | `users.view` |
| 27 | `PATCH` | `/api/users/:id` | `usersConnector.updateUser` | `UserDetailPage.tsx` | Submit "Edit Profile Details" modal | `users.update` |
| 28 | `PATCH` | `/api/users/:id/status` | `usersConnector.updateUserStatus` | `UsersListPage.tsx`, `UserDetailPage.tsx` | Confirm account activation / deactivation | `users.update` |
| 29 | `DELETE` | `/api/users/:id` | `usersConnector.deleteUser` | `UsersListPage.tsx`, `UserDetailPage.tsx` | Confirm "Soft Delete User" dialog | `users.delete` |
| 30 | `PATCH` | `/api/users/:id/restore` | `usersConnector.restoreUser` | `UsersListPage.tsx` | Click "Restore" on archived user row | `users.delete` |
| 34 | `PUT` | `/api/users/:id/departments` | `rolesConnector.assignUserDepartments` | `UserDetailPage.tsx` | Submit "Department Allocations" modal | `departments.update` |
| 171 | `GET` | `/api/departments` | `rolesConnector.getDepartments` | `DepartmentsListPage.tsx` | Page mount, search filter, status filter | `departments.view` |
| 172 | `POST` | `/api/departments` | `rolesConnector.createDepartment` | `DepartmentsListPage.tsx` | Submit "Create Department" modal | `departments.create` |
| 173 | `GET` | `/api/departments/:id` | `rolesConnector.getDepartment` | `DepartmentsListPage.tsx` | Click "Details" modal on department row | `departments.view` |
| 174 | `PATCH` | `/api/departments/:id` | `rolesConnector.updateDepartment` | `DepartmentsListPage.tsx` | Submit "Edit Department" modal | `departments.update` |
| 175 | `DELETE` | `/api/departments/:id` | `rolesConnector.deleteDepartment` | `DepartmentsListPage.tsx` | Confirm "Deactivate Department" dialog | `departments.delete` |

---

## 4. Attendance & Shift Lifecycle (Endpoints 37–80)

| Sl | Method | Endpoint Path | Connector Method | Triggering UI Screen | Action / User Trigger | Permission Guard |
| :---: | :---: | :--- | :--- | :--- | :--- | :---: |
| 37 | `POST` | `/api/attendance/check-in` | `attendanceConnector.checkIn` | `MyAttendancePage.tsx` | Submit "Confirm Check In" modal | Authenticated |
| 38 | `POST` | `/api/attendance/check-out` | `attendanceConnector.checkOut` | `MyAttendancePage.tsx` | Submit "Confirm Check Out" modal | Authenticated |
| 39 | `POST` | `/api/attendance/breaks/start` | `attendanceConnector.startBreak` | `MyAttendancePage.tsx` | Submit "Start Break" modal (Lunch/Tea/Personal) | Authenticated |
| 40 | `POST` | `/api/attendance/breaks/end` | `attendanceConnector.endBreak` | `MyAttendancePage.tsx` | Click "End Break" button on hero card | Authenticated |
| 41 | `GET` | `/api/attendance/today` | `attendanceConnector.getTodayAttendance` | `MyAttendancePage.tsx` | Page mount and post-punch refetch | Authenticated |
| 42 | `GET` | `/api/attendance/history` | `attendanceConnector.getAttendanceHistory` | `MyAttendancePage.tsx`, `TeamAttendancePage.tsx` | Mount history list & infinite scroll | `attendance.view` |
| 43 | `POST` | `/api/attendance/records/:recordId/recalculate` | `attendanceConnector.recalculateAttendance` | `TeamAttendancePage.tsx` | Click "Recalculate Day" action button | `attendance.view` |
| 44 | `POST` | `/api/attendance/shifts` | `attendanceConnector.createShiftDefinition` | `ShiftsPage.tsx` | Submit "Add Shift Definition" modal | `attendance.manage_shifts` |
| 45 | `GET` | `/api/attendance/shifts` | `attendanceConnector.listShiftDefinitions` | `ShiftsPage.tsx` | Mount "Shift Definitions" tab | `attendance.view` |
| 46 | `GET` | `/api/attendance/shifts/my-assignments` | `attendanceConnector.getMyShiftAssignments` | `MyAttendancePage.tsx` | Load assigned shifts on hero card mount | Authenticated |
| 47 | `GET` | `/api/attendance/shifts/effective/:userId` | `attendanceConnector.getEffectiveShift` | `TeamAttendancePage.tsx` | Click "Effective Shift" modal on employee row | `attendance.view` |
| 48 | `GET` | `/api/attendance/shifts/assignments/:userId` | `attendanceConnector.getEmployeeShiftAssignments` | `ShiftsPage.tsx` | Select employee in "Assignments" tab | `attendance.view` |
| 49 | `POST` | `/api/attendance/shifts/assign` | `attendanceConnector.assignShift` | `ShiftsPage.tsx` | Submit "Assign Shift" modal | `attendance.manage_shifts` |
| 50 | `PATCH` | `/api/attendance/shifts/assignments/:assignmentId` | `attendanceConnector.updateShiftAssignment` | `ShiftsPage.tsx` | Submit "Edit Shift Assignment" modal | `attendance.manage_shifts` |
| 51 | `DELETE` | `/api/attendance/shifts/assignments/:assignmentId` | `attendanceConnector.deleteShiftAssignment` | `ShiftsPage.tsx` | Confirm "Remove Assignment" dialog | `attendance.manage_shifts` |
| 52 | `GET` | `/api/attendance/shifts/:id` | `attendanceConnector.getShiftDefinitionById` | `ShiftsPage.tsx` | Click "Edit Shift" to prefill form | `attendance.view` |
| 53 | `PATCH` | `/api/attendance/shifts/:id` | `attendanceConnector.updateShiftDefinition` | `ShiftsPage.tsx` | Submit "Edit Shift" modal | `attendance.manage_shifts` |
| 54 | `DELETE` | `/api/attendance/shifts/:id` | `attendanceConnector.deleteShiftDefinition` | `ShiftsPage.tsx` | Confirm "Delete Shift" dialog | `attendance.manage_shifts` |
| 55 | `POST` | `/api/attendance/overtime` | `attendanceConnector.requestOvertime` | `OvertimeRequestsPage.tsx` | Submit "Request Overtime" modal | `attendance.request_overtime` |
| 56 | `GET` | `/api/attendance/overtime/my-requests` | `attendanceConnector.getMyOvertimeRequests` | `OvertimeRequestsPage.tsx` | Mount "My Requests" tab | `attendance.request_overtime` |
| 57 | `GET` | `/api/attendance/overtime` | `attendanceConnector.listOvertimeRequests` | `OvertimeRequestsPage.tsx` | Mount "Team Overtime" review tab | `attendance.view_overtime` |
| 58 | `POST` | `/api/attendance/overtime/:id/approve` | `attendanceConnector.approveOvertime` | `OvertimeRequestsPage.tsx` | Submit "Approve Overtime" modal | `attendance.approve_overtime` |
| 59 | `POST` | `/api/attendance/overtime/:id/reject` | `attendanceConnector.rejectOvertime` | `OvertimeRequestsPage.tsx` | Submit "Reject Overtime" modal | `attendance.approve_overtime` |
| 60 | `POST` | `/api/attendance/overtime/:id/cancel` | `attendanceConnector.cancelOvertime` | `OvertimeRequestsPage.tsx` | Confirm "Cancel Overtime" dialog | `attendance.request_overtime` |
| 61 | `POST` | `/api/attendance/wfh` | `attendanceConnector.requestWfh` | `WfhRequestsPage.tsx` | Submit "Submit WFH Request" modal | `attendance.request_wfh` |
| 62 | `GET` | `/api/attendance/wfh/my-requests` | `attendanceConnector.getMyWfhRequests` | `WfhRequestsPage.tsx` | Mount "My WFH" tab | `attendance.view_wfh` |
| 63 | `GET` | `/api/attendance/wfh` | `attendanceConnector.listWfhRequests` | `WfhRequestsPage.tsx` | Mount "Team WFH" review tab | `attendance.view_wfh` |
| 64 | `POST` | `/api/attendance/wfh/:id/approve` | `attendanceConnector.approveWfh` | `WfhRequestsPage.tsx` | Submit "Approve WFH" modal | `attendance.approve_wfh` |
| 65 | `POST` | `/api/attendance/wfh/:id/reject` | `attendanceConnector.rejectWfh` | `WfhRequestsPage.tsx` | Submit "Reject WFH" modal | `attendance.approve_wfh` |
| 66 | `POST` | `/api/attendance/wfh/:id/cancel` | `attendanceConnector.cancelWfh` | `WfhRequestsPage.tsx` | Confirm "Cancel WFH Request" dialog | `attendance.request_wfh` |
| 67 | `POST` | `/api/attendance/corrections` | `attendanceConnector.createCorrectionRequest` | `CorrectionsPage.tsx` | Submit "Submit Correction" modal | `attendance.correct_own` |
| 68 | `GET` | `/api/attendance/corrections/my-requests` | `attendanceConnector.getMyCorrectionRequests` | `CorrectionsPage.tsx` | Mount "My Corrections" tab | `attendance.correct_own` |
| 69 | `GET` | `/api/attendance/corrections` | `attendanceConnector.listCorrectionRequests` | `CorrectionsPage.tsx` | Mount "Team Corrections" review tab | `attendance.review_correction` |
| 70 | `GET` | `/api/attendance/corrections/:id` | `attendanceConnector.getCorrectionRequestById` | `CorrectionsPage.tsx` | Click "Details" modal on correction row | `attendance.review_correction` |
| 71 | `POST` | `/api/attendance/corrections/:id/cancel` | `attendanceConnector.cancelCorrectionRequest` | `CorrectionsPage.tsx` | Confirm "Cancel Request" dialog | `attendance.correct_own` |
| 72 | `POST` | `/api/attendance/corrections/:id/approve` | `attendanceConnector.approveCorrectionRequest` | `CorrectionsPage.tsx` | Submit "Approve Correction" modal | `attendance.approve_correction` |
| 73 | `POST` | `/api/attendance/corrections/:id/reject` | `attendanceConnector.rejectCorrectionRequest` | `CorrectionsPage.tsx` | Submit "Reject Correction" modal | `attendance.approve_correction` |
| 74 | `POST` | `/api/attendance/reconciliation/run` | `attendanceConnector.runReconciliation` | `ReconciliationPage.tsx` | Submit "Run EOD Reconciliation" modal | `attendance.reconcile` |
| 75 | `GET` | `/api/attendance/reconciliation/runs` | `attendanceConnector.listReconciliationRuns` | `ReconciliationPage.tsx` | Mount "Runs History" ledger | `attendance.view` |
| 76 | `GET` | `/api/attendance/reconciliation/runs/:id` | `attendanceConnector.getReconciliationRunDetails` | `ReconciliationPage.tsx` | Click "Run Details" modal | `attendance.view` |
| 77 | `GET` | `/api/attendance/reconciliation/status` | `attendanceConnector.getReconciliationStatus` | `ReconciliationPage.tsx` | Date picker change in reconciliation status widget | `attendance.view` |
| 78 | `GET` | `/api/attendance/anomalies` | `attendanceConnector.listAnomalies` | `AnomaliesPage.tsx` | Mount quarantined anomalies table | `attendance.view_anomalies` |
| 79 | `GET` | `/api/attendance/anomalies/:recordId` | `attendanceConnector.getAnomalyDetails` | `AnomaliesPage.tsx` | Click "Inspect Anomaly" modal | `attendance.view_anomalies` |
| 80 | `POST` | `/api/attendance/anomalies/:recordId/resolve` | `attendanceConnector.resolveAnomaly` | `AnomaliesPage.tsx` | Submit "Resolve / Dismiss Anomaly" modal | `attendance.resolve_incident` |

---

## 5. Tasks & Deliverables Management (Endpoints 81–118, 142–143)

| Sl | Method | Endpoint Path | Connector Method | Triggering UI Screen | Action / User Trigger | Permission Guard |
| :---: | :---: | :--- | :--- | :--- | :--- | :---: |
| 81 | `POST` | `/api/tasks` | `tasksConnector.createTask` | `TasksListPage.tsx`, `MyTasksPage.tsx` | Submit "Create Task" modal | `tasks.create` |
| 82 | `GET` | `/api/tasks` | `tasksConnector.getTasks` | `TasksListPage.tsx` | Mount all tasks table & Kanban board | `tasks.view` |
| 83 | `GET` | `/api/tasks/:id` | `tasksConnector.getTask` | `TaskDetailPage.tsx` | Mount task detail view `/tasks/:id` | `tasks.view` |
| 84 | `PATCH` | `/api/tasks/:id` | `tasksConnector.updateTask` | `TaskDetailPage.tsx`, `TasksListPage.tsx` | Submit "Edit Task Details" modal | `tasks.update` |
| 85 | `PATCH` | `/api/tasks/:id/assign` | `tasksConnector.assignTask` | `TaskDetailPage.tsx` | Submit "Assign / Reassign" modal | `tasks.assign` |
| 86 | `POST` | `/api/tasks/:id/cancel` | `tasksConnector.cancelTask` | `TaskDetailPage.tsx` | Confirm "Cancel Task" warning dialog | `tasks.update` |
| 87 | `DELETE` | `/api/tasks/:id` | `tasksConnector.deleteTask` | `TaskDetailPage.tsx`, `TasksListPage.tsx` | Confirm "Delete Task" danger dialog | `tasks.delete` |
| 88 | `POST` | `/api/tasks/:id/reopen` | `tasksConnector.reopenTask` | `TaskDetailPage.tsx` | Click "Reopen Task" button | `tasks.approve` |
| 89 | `GET` | `/api/tasks/tags` | `tasksConnector.getTags` | `TasksListPage.tsx`, `TaskDetailPage.tsx` | Tag filter dropdown & task tag selector | `tasks.view` |
| 90 | `POST` | `/api/tasks/tags` | `tasksConnector.createTag` | `TaskDetailPage.tsx` | Add new custom tag to task | `tasks.manage_tags` |
| 91 | `POST` | `/api/tasks/:id/timer/play` | `tasksConnector.playTimer` | `MyTasksPage.tsx`, `TaskDetailPage.tsx` | Click "Play / Start Timer" button | `tasks.timer.play` |
| 92 | `POST` | `/api/tasks/:id/timer/pause` | `tasksConnector.pauseTimer` | `MyTasksPage.tsx`, `TaskDetailPage.tsx` | Click "Pause Timer" modal (with reason) | `tasks.timer.pause` |
| 93 | `POST` | `/api/tasks/:id/timer/resume` | `tasksConnector.resumeTimer` | `MyTasksPage.tsx`, `TaskDetailPage.tsx` | Click "Resume Timer" button | `tasks.timer.resume` |
| 94 | `POST` | `/api/tasks/:id/timer/stop` | `tasksConnector.stopTimer` | `MyTasksPage.tsx`, `TaskDetailPage.tsx` | Click "Stop Timer" button | `tasks.timer.stop` |
| 95 | `GET` | `/api/tasks/timer/active` | `tasksConnector.getActiveTimer` | `Header.tsx`, `MyTasksPage.tsx` | Global active timer banner & ticker mount | `tasks.timer.view_active` |
| 96 | `GET` | `/api/tasks/:id/time-entries` | `tasksConnector.getTimeEntries` | `TaskDetailPage.tsx` | Mount "Time Ledger" tab | `tasks.view` |
| 97 | `GET` | `/api/tasks/my-tasks` | `tasksConnector.getMyTasks` | `MyTasksPage.tsx` | Mount "My Tasks" view | `tasks.view_own` |
| 98 | `GET` | `/api/tasks/my-time-summary` | `tasksConnector.getMyTimeSummary` | `MyTasksPage.tsx` | Mount personal time summary KPI cards | `tasks.time.view_summary` |
| 99 | `GET` | `/api/tasks/:id/time-summary` | `tasksConnector.getTimeSummary` | `TaskDetailPage.tsx` | Task header time duration overview | `tasks.view` |
| 100 | `POST` | `/api/tasks/:id/submit` | `tasksConnector.submitTaskForReview` | `TaskDetailPage.tsx` | Click "Submit for QA / Review" modal | `tasks.submit` |
| 101 | `POST` | `/api/tasks/:id/approve` | `tasksConnector.approveTask` | `TaskDetailPage.tsx` | Click "Approve Task" decision button | `tasks.approve` |
| 102 | `POST` | `/api/tasks/:id/comments` | `tasksConnector.createComment` | `TaskDetailPage.tsx` | Type comment text and click "Post Comment" | `tasks.comment` |
| 103 | `GET` | `/api/tasks/:id/comments` | `tasksConnector.getComments` | `TaskDetailPage.tsx` | Mount threaded comments stream | `tasks.view` |
| 104 | `GET` | `/api/tasks/:id/history` | `tasksConnector.getHistory` | `TaskDetailPage.tsx` | Mount immutable task audit timeline | `tasks.view` |
| 105 | `GET` | `/api/tasks/dashboard/my` | `tasksConnector.getPersonalDashboard` | `TaskDashboardsPage.tsx` | Select "Personal Workspace" tab | `tasks.view_own` |
| 106 | `GET` | `/api/tasks/dashboard/team` | `tasksConnector.getTeamDashboard` | `TaskDashboardsPage.tsx` | Select "Team Management" tab | `reports.view` |
| 107 | `GET` | `/api/tasks/dashboard/organization` | `tasksConnector.getOrganizationDashboard` | `TaskDashboardsPage.tsx` | Select "Organization Overview" tab | `reports.view` |
| 108 | `GET` | `/api/tasks/reports/summary` | `tasksConnector.getSummaryReport` | `TaskReportsPage.tsx` | Mount "Volume & Summary" tab | `reports.view` |
| 109 | `GET` | `/api/tasks/reports/working-hours` | `tasksConnector.getWorkingHoursReport` | `TaskReportsPage.tsx` | Mount "Working Hours & Pauses" tab | `reports.view` |
| 110 | `GET` | `/api/tasks/reports/employee-performance` | `tasksConnector.getPerformanceReport` | `TaskReportsPage.tsx` | Mount "Employee Performance" tab | `reports.view` |
| 111 | `GET` | `/api/tasks/reports/overdue` | `tasksConnector.getOverdueReport` | `TaskReportsPage.tsx` | Mount "Overdue SLA Audit" tab | `reports.view` |
| 112 | `GET` | `/api/tasks/reports/reviews` | `tasksConnector.getReviewsReport` | `TaskReportsPage.tsx` | Mount "Review Turnaround" tab | `reports.view` |
| 113 | `POST` | `/api/tasks/:id/attachments` | `tasksConnector.uploadAttachment` | `TaskDetailPage.tsx` | File upload drag-and-drop / selector | `tasks.attachment` |
| 114 | `GET` | `/api/tasks/:id/attachments` | `tasksConnector.getAttachments` | `TaskDetailPage.tsx` | Mount attachments gallery | `tasks.view` |
| 115 | `GET` | `/api/tasks/:id/attachments/:attachmentId/download` | `tasksConnector.getAttachmentDownloadUrl` | `TaskDetailPage.tsx` | Click "Download Attachment" button | `tasks.view` |
| 116 | `GET` | `/api/tasks/:id/attachments/:attachmentId/preview` | `tasksConnector.getAttachmentPreviewUrl` | `TaskDetailPage.tsx` | Click "Preview" thumbnail | `tasks.view` |
| 117 | `POST` | `/api/tasks/:id/attachments/:attachmentId/rescan` | `tasksConnector.rescanAttachment` | `TaskDetailPage.tsx` | Click "Re-scan File" security audit button | `tasks.approve` |
| 118 | `DELETE` | `/api/tasks/:id/attachments/:attachmentId` | `tasksConnector.deleteAttachment` | `TaskDetailPage.tsx` | Click "Delete Attachment" trash icon | `tasks.attachment` |
| 142 | `GET` | `/api/admin/employees/:id/tasks` | `adminConnector.getEmployeeTasks` | `AdminActivityPage.tsx` | Drilldown on employee task assignments | `SUPER_ADMIN` |
| 143 | `GET` | `/api/admin/tasks/summary` | `adminConnector.getTasksSummary` | `AdminTasksSummaryPage.tsx` | Mount deliverable velocity burndown cards | `SUPER_ADMIN` |

---

## 6. Leads & Pipeline Intelligence (Endpoints 119–138, 144–147)

| Sl | Method | Endpoint Path | Connector Method | Triggering UI Screen | Action / User Trigger | Permission Guard |
| :---: | :---: | :--- | :--- | :--- | :--- | :---: |
| 119 | `POST` | `/api/leads/public/inquire` | `leadsConnector.publicInquire` | `PublicInquiryPage.tsx` | Submit public lead inquiry form | Public |
| 120 | `POST` | `/api/leads` | `leadsConnector.createLead` | `LeadsListPage.tsx` | Submit "New Lead Registration" modal | `leads.create` |
| 121 | `GET` | `/api/leads` | `leadsConnector.getLeads` | `LeadsListPage.tsx` | Page mount, search, status, stage filter | `leads.view` |
| 122 | `GET` | `/api/leads/:id` | `leadsConnector.getLead` | `LeadDetailPage.tsx` | Mount lead overview `/leads/:id` | `leads.view` |
| 123 | `PUT` | `/api/leads/:id` | `leadsConnector.updateLead` | `LeadDetailPage.tsx` | Submit "Edit Lead Attributes" modal | `leads.update` |
| 124 | `DELETE` | `/api/leads/:id` | `leadsConnector.deleteLead` | `LeadDetailPage.tsx`, `LeadsListPage.tsx` | Confirm "Archive / Delete Lead" dialog | `leads.delete` |
| 125 | `POST` | `/api/leads/:id/restore` | `leadsConnector.restoreLead` | `LeadsListPage.tsx` | Click "Restore" on archived lead row | `leads.delete` |
| 126 | `POST` | `/api/leads/:id/assign` | `leadsConnector.assignLead` | `LeadDetailPage.tsx` | Submit "Assign Sales Executive" modal | `leads.assign` |
| 127 | `POST` | `/api/leads/:id/qualify` | `leadsConnector.qualifyLead` | `LeadDetailPage.tsx` | Submit "BANT Qualification" modal | `leads.update` |
| 128 | `POST` | `/api/leads/:id/status` | `leadsConnector.updateLeadStatus` | `LeadDetailPage.tsx`, `LeadPipelinePage.tsx` | Kanban card drag or status dropdown change | `leads.update` |
| 129 | `POST` | `/api/leads/:id/convert` | `leadsConnector.convertLead` | `LeadDetailPage.tsx` | Submit "Convert Lead to Deal & Client" modal | `deals.create` |
| 130 | `POST` | `/api/leads/:id/activities` | `leadsConnector.logActivity` | `LeadDetailPage.tsx` | Submit "Log Client Interaction" modal | `leads.update` |
| 131 | `GET` | `/api/leads/:id/timeline` | `leadsConnector.getTimeline` | `LeadDetailPage.tsx` | Mount interactive activity timeline | `leads.view` |
| 132 | `POST` | `/api/leads/:id/follow-ups` | `leadsConnector.scheduleFollowUp` | `LeadDetailPage.tsx` | Submit "Schedule Follow-Up Reminder" modal | `leads.update` |
| 133 | `GET` | `/api/leads/follow-ups/my` | `leadsConnector.getMyFollowUps` | `LeadFollowUpsPage.tsx` | Mount "My Scheduled Follow-Ups" roster | `leads.view` |
| 134 | `PUT` | `/api/leads/follow-ups/:id` | `leadsConnector.updateFollowUpStatus` | `LeadFollowUpsPage.tsx` | Mark follow-up completed / dismissed | `leads.update` |
| 135 | `GET` | `/api/leads/pipeline/stages` | `leadsConnector.getPipelineStages` | `LeadPipelinePage.tsx` | Mount Kanban pipeline stage columns | `leads.view` |
| 136 | `GET` | `/api/leads/metrics/summary` | `leadsConnector.getPipelineSummary` | `LeadPipelinePage.tsx` | Mount pipeline conversion KPI metrics | `leads.view` |
| 137 | `GET` | `/api/leads/metrics/pipeline` | `leadsConnector.getPipelineStages` | `LeadPipelinePage.tsx` | Stage volume & total pipeline valuation | `leads.view` |
| 138 | `POST` | `/api/leads/import` | `leadsConnector.importLeads` | `LeadsListPage.tsx` | Upload spreadsheet batch lead import | `leads.create` |
| 144 | `GET` | `/api/admin/leads/summary` | `adminConnector.getLeadsSummary` | `AdminLeadsExecutivePage.tsx` | Mount executive lead acquisition metrics | `SUPER_ADMIN` |
| 145 | `GET` | `/api/admin/leads/by-employee` | `adminConnector.getLeadsByEmployee` | `AdminLeadsExecutivePage.tsx` | Mount representative conversion leaderboard | `SUPER_ADMIN` |
| 146 | `GET` | `/api/admin/leads/trend` | `adminConnector.getLeadsTrend` | `AdminLeadsExecutivePage.tsx` | Mount acquisition and conversion chart | `SUPER_ADMIN` |
| 147 | `GET` | `/api/admin/leads/by-source` | `adminConnector.getLeadsBySource` | `AdminLeadsExecutivePage.tsx` | Mount lead channel ROI distribution chart | `SUPER_ADMIN` |

---

## 7. Leave & Absence Management (Endpoints 148–170, 176–178)

| Sl | Method | Endpoint Path | Connector Method | Triggering UI Screen | Action / User Trigger | Permission Guard |
| :---: | :---: | :--- | :--- | :--- | :--- | :---: |
| 148 | `GET` | `/api/leave/types` | `leaveConnector.getLeaveTypes` | `LeaveSetupPage.tsx` | Mount configured leave types roster | `leave.manage_types` |
| 149 | `POST` | `/api/leave/types` | `leaveConnector.createLeaveType` | `LeaveSetupPage.tsx` | Submit "Create Leave Type" modal | `leave.manage_types` |
| 150 | `GET` | `/api/leave/types/:id` | `leaveConnector.getLeaveType` | `LeaveSetupPage.tsx` | Click leave type card to view versions | `leave.manage_types` |
| 151 | `PATCH` | `/api/leave/types/:id` | `leaveConnector.updateLeaveType` | `LeaveSetupPage.tsx` | Submit "Edit Leave Type" modal | `leave.manage_types` |
| 152 | `POST` | `/api/leave/types/:id/versions` | `leaveConnector.createPolicyVersion` | `LeaveSetupPage.tsx` | Submit "New Policy Version" modal | `leave.manage_policies` |
| 153 | `GET` | `/api/leave/holidays` | `leaveConnector.getHolidays` | `HolidaysPage.tsx` | Mount holidays roster by year selector | `leave.manage_holidays` |
| 154 | `POST` | `/api/leave/holidays` | `leaveConnector.createHoliday` | `HolidaysPage.tsx` | Submit "Add Holiday" modal | `leave.manage_holidays` |
| 155 | `DELETE` | `/api/leave/holidays/:id` | `leaveConnector.deleteHoliday` | `HolidaysPage.tsx` | Confirm "Delete Holiday" dialog | `leave.manage_holidays` |
| 156 | `GET` | `/api/leave/weekly-off-policies` | `leaveConnector.getWeeklyOffPolicies` | `HolidaysPage.tsx` | Mount "Weekly-Off Policies" tab | `leave.manage_weekly_offs` |
| 157 | `POST` | `/api/leave/weekly-off-policies` | `leaveConnector.createWeeklyOffPolicy` | `HolidaysPage.tsx` | Submit "Create Workweek Schedule" modal | `leave.manage_weekly_offs` |
| 158 | `POST` | `/api/leave/requests` | `leaveConnector.applyLeave` | `MyLeavePage.tsx` | Submit "Apply for Leave" modal | Authenticated |
| 159 | `GET` | `/api/leave/requests/my` | `leaveConnector.getMyLeaveRequests` | `MyLeavePage.tsx` | Mount personal leave history table | Authenticated |
| 160 | `GET` | `/api/leave/requests` | `leaveConnector.getLeaveRequests` | `LeaveApprovalsPage.tsx` | Mount manager review inbox | `leave.view_requests` |
| 161 | `GET` | `/api/leave/requests/:id` | `leaveConnector.getLeaveRequest` | `MyLeavePage.tsx`, `LeaveApprovalsPage.tsx` | Click "Details" modal on leave row | `leave.view_requests` |
| 162 | `POST` | `/api/leave/requests/:id/review` | `leaveConnector.reviewLeaveRequest` | `LeaveApprovalsPage.tsx` | Submit "Approve / Reject Request" decision | `leave.approve` |
| 163 | `POST` | `/api/leave/requests/:id/cancel` | `leaveConnector.cancelLeaveRequest` | `MyLeavePage.tsx` | Confirm "Cancel Leave Request" dialog | Authenticated |
| 164 | `POST` | `/api/leave/cancellations/:id/review` | `leaveConnector.reviewCancellation` | `LeaveApprovalsPage.tsx` | Submit "Review Cancellation" decision | `leave.approve` |
| 165 | `GET` | `/api/leave/balances/my` | `leaveConnector.getMyBalances` | `MyLeavePage.tsx` | Mount personal leave balance cards | Authenticated |
| 166 | `GET` | `/api/leave/balances` | `leaveConnector.getEmployeeBalances` | `LeaveBalancesPage.tsx` | Mount "Employee Balance Roster" table | `leave.view_balances` |
| 167 | `POST` | `/api/leave/balances/adjust` | `leaveConnector.adjustBalance` | `LeaveBalancesPage.tsx` | Submit "Adjust Leave Balance" modal | `leave.adjust_balances` |
| 168 | `GET` | `/api/leave/transactions` | `leaveConnector.getTransactions` | `LeaveBalancesPage.tsx` | Mount "Audit Transaction Ledger" table | `leave.view_balances` |
| 169 | `GET` | `/api/leave/calendar` | `leaveConnector.getCalendarFeed` | `LeaveCalendarPage.tsx` | Date range selector change on calendar | `leave.view_requests` |
| 170 | `GET` | `/api/leave/reports/summary` | `leaveConnector.getSummaryReport` | `LeaveReportsPage.tsx` | Year selector change on reports view | `leave.view_reports` |
| 176 | `PATCH` | `/api/leave/holidays/:id` | `leaveConnector.updateHoliday` | `HolidaysPage.tsx` | Submit "Edit Holiday" modal | `leave.manage_holidays` |
| 177 | `POST` | `/api/leave/holidays/sync-google-calendar` | `leaveConnector.syncGoogleHolidays` | `HolidaysPage.tsx` | Click "Sync Government Holidays" button | `leave.manage_holidays` |
| 178 | `GET` | `/api/leave/holidays/calendar.ics` | Direct download URL | `HolidaysPage.tsx` | Click "Export iCalendar (.ics)" button | `leave.manage_holidays` |

---

## 8. Executive Administration (Endpoints 140–141)

| Sl | Method | Endpoint Path | Connector Method | Triggering UI Screen | Action / User Trigger | Permission Guard |
| :---: | :---: | :--- | :--- | :--- | :--- | :---: |
| 140 | `GET` | `/api/admin/employees/activity` | `adminConnector.getEmployeeActivity` | `AdminActivityPage.tsx` | Mount real-time employee activity monitor | `SUPER_ADMIN` |
| 141 | `GET` | `/api/admin/employees/:id/sessions` | `adminConnector.getEmployeeSessions` | `AdminActivityPage.tsx` | Drilldown on specific employee sessions | `SUPER_ADMIN` |
