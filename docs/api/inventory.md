# API Inventory - Slash CRM Frontend

**Total API Endpoints Registered:** 177
**Source of Truth:** docs/api/Slash_CRM_Apis.xlsx (Exported from Google Sheets)
**Base URL:** http://localhost:5000/api

| Sl | Method | Path | API Name | Module | Permission | DTO Name | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | POST | /api/auth/send-otp | LOGIN / SEND OTP | **Auth** | Public / Authenticated | SendOtpDto | Completed |
| 2 | POST | /api/auth/verify-otp | VERIFY OTP (LOGIN) | **Auth** | Public / Authenticated | VerifyOtpDto | Completed |
| 3 | GET | /api/auth/me | PROFILE / GET ME | **Auth** | Public / Authenticated | None | Completed |
| 4 | POST | /api/auth/refresh | REFRESH TOKEN ROTATION | **Auth** | Public / Authenticated | RefreshTokenDto | Completed |
| 5 | POST | /api/auth/logout | LOGOUT CURRENT SESSION | **Auth** | Public / Authenticated | Inline/Params | Completed |
| 6 | POST | /api/auth/logout-all | LOGOUT ALL SESSIONS | **Auth** | Public / Authenticated | Inline/Params | Completed |
| 7 | POST | /api/auth/bootstrap-super-admin | BOOTSTRAP SUPER ADMIN | **Auth** | Public / Authenticated | BootstrapSuperAdminDto | Completed |
| 8 | POST | /api/roles | CREATE ROLE | **Roles** | Public / Authenticated | CreateRoleDto | Completed |
| 9 | GET | /api/roles | LIST ROLES | **Roles** | Public / Authenticated | None | Completed |
| 10 | GET | /api/roles/:id | GET ROLE BY ID | **Roles** | Public / Authenticated | None | Completed |
| 11 | PATCH | /api/roles/:id | UPDATE ROLE | **Roles** | Public / Authenticated | UpdateRoleDto | Completed |
| 12 | DELETE | /api/roles/:id | DELETE ROLE (SOFT) | **Roles** | Public / Authenticated | Inline/Params | Completed |
| 13 | GET | /api/roles/:id/permissions | GET ROLE PERMISSIONS | **Roles** | Public / Authenticated | None | Completed |
| 14 | PUT | /api/roles/:id/permissions | REPLACE ROLE PERMISSIONS | **Roles** | Public / Authenticated | AssignRolePermissionsDto | Completed |
| 15 | POST | /api/roles/:id/permissions | ADD PERMISSION TO ROLE | **Roles** | Public / Authenticated | AddPermissionToRoleDto | Completed |
| 16 | DELETE | /api/roles/:id/permissions/:permissionId | REMOVE PERMISSION FROM ROLE | **Roles** | Public / Authenticated | Inline/Params | Completed |
| 17 | POST | /api/permissions | CREATE PERMISSION | **Permissions** | Public / Authenticated | CreatePermissionDto | Completed |
| 18 | GET | /api/permissions | LIST PERMISSIONS | **Permissions** | Public / Authenticated | None | Completed |
| 19 | GET | /api/permissions/modules | GET PERMISSIONS BY MODULE | **Permissions** | Public / Authenticated | None | Completed |
| 20 | GET | /api/permissions/:id | GET PERMISSION BY ID | **Permissions** | Public / Authenticated | None | Completed |
| 21 | PATCH | /api/permissions/:id | UPDATE PERMISSION | **Permissions** | Public / Authenticated | UpdatePermissionDto | Completed |
| 22 | DELETE | /api/permissions/:id | DELETE PERMISSION | **Permissions** | Public / Authenticated | Inline/Params | Completed |
| 23 | PATCH | /api/roles/:id/restore | RESTORE ROLE | **Roles** | Public / Authenticated | Inline/Params | Completed |
| 24 | POST | /api/users | CREATE USER | **Users** | Public / Authenticated | CreateUserDto | Completed |
| 25 | GET | /api/users | LIST USERS | **Users** | Public / Authenticated | None | Completed |
| 26 | GET | /api/users/:id | GET USER BY ID | **Users** | Public / Authenticated | None | Completed |
| 27 | PATCH | /api/users/:id | UPDATE USER | **Users** | Public / Authenticated | UpdateUserDto | Completed |
| 28 | PATCH | /api/users/:id/status | CHANGE USER STATUS | **Users** | Public / Authenticated | UpdateUserStatusDto | Completed |
| 29 | DELETE | /api/users/:id | SOFT DELETE USER | **Users** | Public / Authenticated | Inline/Params | Completed |
| 30 | PATCH | /api/users/:id/restore | RESTORE USER | **Users** | Public / Authenticated | Inline/Params | Completed |
| 31 | PUT | /api/users/:id/roles | REPLACE USER ROLES | **Roles** | Public / Authenticated | AssignUserRolesDto | Completed |
| 32 | POST | /api/users/:id/roles | ADD USER ROLES | **Roles** | Public / Authenticated | AddUserRolesDto | Completed |
| 33 | DELETE | /api/users/:id/roles/:roleId | REMOVE USER ROLE | **Roles** | Public / Authenticated | Inline/Params | Completed |
| 34 | PUT | /api/users/:id/departments | REPLACE USER DEPARTMENTS | **Users** | Public / Authenticated | AssignUserDepartmentsDto | Completed |
| 35 | PUT | /api/users/:id/permissions | REPLACE USER PERMISSION OVERRIDES | **Permissions** | Public / Authenticated | AssignUserPermissionsDto | Completed |
| 36 | GET | /api/users/:id/permissions | GET EFFECTIVE USER PERMISSIONS | **Permissions** | Public / Authenticated | None | Completed |
| 37 | POST | /api/attendance/check-in | ATTENDANCE CHECK-IN | **Attendance** | None | CheckInDto | Completed |
| 38 | POST | /api/attendance/check-out | ATTENDANCE CHECK-OUT | **Attendance** | None | CheckOutDto | Completed |
| 39 | POST | /api/attendance/breaks/start | START BREAK | **Attendance** | None | StartBreakDto | Completed |
| 40 | POST | /api/attendance/breaks/end | END BREAK | **Attendance** | None | Inline/Params | Completed |
| 41 | GET | /api/attendance/today | GET TODAY ATTENDANCE | **Attendance** | None | None | Completed |
| 42 | GET | /api/attendance/history | GET ATTENDANCE HISTORY | **Attendance** | None | None | Completed |
| 43 | POST | /api/attendance/records/:recordId/recalculate | RECALCULATE ATTENDANCE RECORD | **Attendance** | None | RecalculateAttendanceDto | Completed |
| 44 | POST | /api/attendance/shifts | CREATE SHIFT DEFINITION | **Attendance** | None | CreateShiftDefinitionDto | Completed |
| 45 | GET | /api/attendance/shifts | LIST SHIFT DEFINITIONS | **Attendance** | None | None | Completed |
| 46 | GET | /api/attendance/shifts/my-assignments | GET OWN SHIFT ASSIGNMENTS | **Attendance** | None | None | Completed |
| 47 | GET | /api/attendance/shifts/effective/:userId | GET EFFECTIVE SHIFT FOR DATE | **Attendance** | None | None | Completed |
| 48 | GET | /api/attendance/shifts/assignments/:userId | GET EMPLOYEE SHIFT ASSIGNMENTS | **Attendance** | None | None | Completed |
| 49 | POST | /api/attendance/shifts/assign | ASSIGN SHIFT TO EMPLOYEE | **Attendance** | None | AssignShiftDto | Completed |
| 50 | PATCH | /api/attendance/shifts/assignments/:assignmentId | UPDATE SHIFT ASSIGNMENT | **Attendance** | None | UpdateShiftAssignmentDto | Completed |
| 51 | DELETE | /api/attendance/shifts/assignments/:assignmentId | DELETE SHIFT ASSIGNMENT | **Attendance** | None | Inline/Params | Completed |
| 52 | GET | /api/attendance/shifts/:id | GET SHIFT DEFINITION BY ID | **Attendance** | None | None | Completed |
| 53 | PATCH | /api/attendance/shifts/:id | UPDATE SHIFT DEFINITION | **Attendance** | None | UpdateShiftDefinitionDto | Completed |
| 54 | DELETE | /api/attendance/shifts/:id | DELETE SHIFT DEFINITION | **Attendance** | None | Inline/Params | Completed |
| 55 | POST | /api/attendance/overtime | SUBMIT OVERTIME REQUEST | **Attendance** | None | CreateOvertimeRequestDto | Completed |
| 56 | GET | /api/attendance/overtime/my-requests | LIST OWN OVERTIME REQUESTS | **Attendance** | None | None | Completed |
| 57 | GET | /api/attendance/overtime | LIST OVERTIME REQUESTS (MANAGER VIEW) | **Attendance** | None | None | Completed |
| 58 | POST | /api/attendance/overtime/:id/approve | APPROVE OVERTIME REQUEST | **Attendance** | None | ApproveOvertimeRequestDto | Completed |
| 59 | POST | /api/attendance/overtime/:id/reject | REJECT OVERTIME REQUEST | **Attendance** | None | RejectOvertimeRequestDto | Completed |
| 60 | POST | /api/attendance/overtime/:id/cancel | CANCEL OWN OVERTIME REQUEST | **Attendance** | None | Inline/Params | Completed |
| 61 | POST | /api/attendance/wfh | SUBMIT WFH REQUEST | **Attendance** | None | CreateWfhRequestDto | Completed |
| 62 | GET | /api/attendance/wfh/my-requests | LIST OWN WFH REQUESTS | **Attendance** | None | None | Completed |
| 63 | GET | /api/attendance/wfh | LIST WFH REQUESTS (MANAGER VIEW) | **Attendance** | None | None | Completed |
| 64 | POST | /api/attendance/wfh/:id/approve | APPROVE WFH REQUEST | **Attendance** | None | ApproveWfhRequestDto | Completed |
| 65 | POST | /api/attendance/wfh/:id/reject | REJECT WFH REQUEST | **Attendance** | None | RejectWfhRequestDto | Completed |
| 66 | POST | /api/attendance/wfh/:id/cancel | CANCEL OWN WFH REQUEST | **Attendance** | None | Inline/Params | Completed |
| 67 | POST | /api/attendance/corrections | SUBMIT CORRECTION REQUEST | **Attendance** | None | CreateCorrectionRequestDto | Completed |
| 68 | GET | /api/attendance/corrections/my-requests | LIST OWN CORRECTION REQUESTS | **Attendance** | None | None | Completed |
| 69 | GET | /api/attendance/corrections | LIST CORRECTION REQUESTS (MANAGER VIEW) | **Attendance** | None | None | Completed |
| 70 | GET | /api/attendance/corrections/:id | GET CORRECTION REQUEST DETAILS | **Attendance** | None | None | Completed |
| 71 | POST | /api/attendance/corrections/:id/cancel | CANCEL OWN CORRECTION REQUEST | **Attendance** | None | Inline/Params | Completed |
| 72 | POST | /api/attendance/corrections/:id/approve | APPROVE CORRECTION REQUEST | **Attendance** | None | ApproveCorrectionRequestDto | Completed |
| 73 | POST | /api/attendance/corrections/:id/reject | REJECT CORRECTION REQUEST | **Attendance** | None | RejectCorrectionRequestDto | Completed |
| 74 | POST | /api/attendance/reconciliation/run | TRIGGER EOD RECONCILIATION | **Attendance** | None | TriggerReconciliationDto | Completed |
| 75 | GET | /api/attendance/reconciliation/runs | LIST RECONCILIATION RUNS | **Attendance** | None | None | Completed |
| 76 | GET | /api/attendance/reconciliation/runs/:id | GET RECONCILIATION RUN DETAILS | **Attendance** | None | None | Completed |
| 77 | GET | /api/attendance/reconciliation/status | GET RECONCILIATION STATUS | **Attendance** | None | None | Completed |
| 78 | GET | /api/attendance/anomalies | LIST QUARANTINED ANOMALIES | **Attendance** | None | None | Completed |
| 79 | GET | /api/attendance/anomalies/:recordId | GET RECORD ANOMALY DETAILS | **Attendance** | None | None | Completed |
| 80 | POST | /api/attendance/anomalies/:recordId/resolve | RESOLVE OR DISMISS ANOMALY | **Attendance** | None | ResolveAnomalyDto | Completed |
| 81 | POST | /api/tasks | CREATE TASK | **Tasks** | None | CreateTaskDto | Completed |
| 82 | GET | /api/tasks | LIST TASKS | **Tasks** | None | None | Completed |
| 83 | GET | /api/tasks/:id | GET TASK DETAILS | **Tasks** | None | None | Completed |
| 84 | PATCH | /api/tasks/:id | UPDATE TASK | **Tasks** | None | UpdateTaskDto | Completed |
| 85 | PATCH | /api/tasks/:id/assign | ASSIGN TASK | **Tasks** | None | AssignTaskDto | Completed |
| 86 | POST | /api/tasks/:id/cancel | CANCEL TASK | **Tasks** | None | Inline/Params | Completed |
| 87 | DELETE | /api/tasks/:id | SOFT DELETE TASK | **Tasks** | None | Inline/Params | Completed |
| 88 | POST | /api/tasks/:id/reopen | REOPEN TASK | **Tasks** | None | Inline/Params | Completed |
| 89 | GET | /api/tasks/tags | LIST TASK TAGS | **Tasks** | None | None | Completed |
| 90 | POST | /api/tasks/tags | CREATE TASK TAG | **Tasks** | None | CreateTaskTagDto | Completed |
| 91 | POST | /api/tasks/:id/timer/play | START TASK TIMER | **Tasks** | None | PlayTaskTimerDto | Completed |
| 92 | POST | /api/tasks/:id/timer/pause | PAUSE TASK TIMER | **Tasks** | None | PauseTaskTimerDto | Completed |
| 93 | POST | /api/tasks/:id/timer/resume | RESUME TASK TIMER | **Tasks** | None | ResumeTaskTimerDto | Completed |
| 94 | POST | /api/tasks/:id/timer/stop | STOP TASK TIMER | **Tasks** | None | StopTaskTimerDto | Completed |
| 95 | GET | /api/tasks/timer/active | GET LIVE TIMER STATUS | **Tasks** | None | None | Completed |
| 96 | GET | /api/tasks/:id/time-entries | LIST TASK TIME ENTRIES | **Tasks** | None | None | Completed |
| 97 | GET | /api/tasks/my-tasks | LIST MY PERSONAL TASKS | **Tasks** | None | CreateTimeCorrectionDto | Completed |
| 98 | GET | /api/tasks/my-time-summary | GET PERSONAL WORKING TIME SUMMARY | **Tasks** | None | None | Completed |
| 99 | GET | /api/tasks/:id/time-summary | GET TASK TIME SUMMARY | **Tasks** | None | ReviewTimeCorrectionDto | Completed |
| 100 | POST | /api/tasks/:id/submit | SUBMIT TASK FOR REVIEW | **Tasks** | None | TransitionTaskStatusDto | Completed |
| 101 | POST | /api/tasks/:id/approve | APPROVE TASK REVIEW | **Tasks** | None | ReviewTaskDto | Completed |
| 102 | POST | /api/tasks/:id/comments | ADD TASK COMMENT | **Tasks** | None | CreateTaskCommentDto | Completed |
| 103 | GET | /api/tasks/:id/comments | LIST TASK COMMENTS | **Tasks** | None | None | Completed |
| 104 | GET | /api/tasks/:id/history | GET TASK AUDIT HISTORY | **Tasks** | None | None | Completed |
| 105 | GET | /api/tasks/dashboard/my | EMPLOYEE PERSONAL DASHBOARD | **Tasks** | None | None | Completed |
| 106 | GET | /api/tasks/dashboard/team | MANAGER TEAM DASHBOARD | **Tasks** | None | None | Completed |
| 107 | GET | /api/tasks/dashboard/organization | ORGANIZATION TASK DASHBOARD | **Tasks** | None | None | Completed |
| 108 | GET | /api/tasks/reports/summary | TASK SUMMARY REPORT | **Tasks** | None | None | Completed |
| 109 | GET | /api/tasks/reports/working-hours | EMPLOYEE WORKING HOURS REPORT | **Tasks** | None | None | Completed |
| 110 | GET | /api/tasks/reports/employee-performance | EMPLOYEE TASK PERFORMANCE REPORT | **Tasks** | None | None | Completed |
| 111 | GET | /api/tasks/reports/overdue | OVERDUE TASKS REPORT | **Tasks** | None | None | Completed |
| 112 | GET | /api/tasks/reports/reviews | REVIEW SUMMARY REPORT | **Tasks** | None | None | Completed |
| 113 | POST | /api/tasks/:id/attachments | UPLOAD TASK ATTACHMENT | **Tasks** | None | Inline/Params | Completed |
| 114 | GET | /api/tasks/:id/attachments | LIST TASK ATTACHMENTS | **Tasks** | None | None | Completed |
| 115 | GET | /api/tasks/:id/attachments/:attachmentId/download | DOWNLOAD ATTACHMENT | **Tasks** | None | None | Completed |
| 116 | GET | /api/tasks/:id/attachments/:attachmentId/preview | PREVIEW ATTACHMENT | **Tasks** | None | None | Completed |
| 117 | POST | /api/tasks/:id/attachments/:attachmentId/rescan | RESCAN ATTACHMENT | **Tasks** | None | Inline/Params | Completed |
| 118 | DELETE | /api/tasks/:id/attachments/:attachmentId | DELETE ATTACHMENT | **Tasks** | None | Inline/Params | Completed |
| 119 | POST | /api/leads/public/inquire | PUBLIC WEBSITE INQUIRY | **Leads** | Public / Authenticated | PublicInquiryDto | Completed |
| 120 | POST | /api/leads | CREATE LEAD | **Leads** | None | CreateLeadDto | Completed |
| 121 | GET | /api/leads | LIST LEADS | **Leads** | None | None | Completed |
| 122 | GET | /api/leads/:id | GET LEAD DETAILS | **Leads** | None | None | Completed |
| 123 | PUT | /api/leads/:id | UPDATE LEAD | **Leads** | None | UpdateLeadDto | Completed |
| 124 | DELETE | /api/leads/:id | SOFT DELETE LEAD | **Leads** | None | Inline/Params | Completed |
| 125 | POST | /api/leads/:id/restore | RESTORE LEAD | **Leads** | None | Inline/Params | Completed |
| 126 | POST | /api/leads/:id/assign | ASSIGN LEAD | **Leads** | None | AssignLeadDto | Completed |
| 127 | POST | /api/leads/:id/qualify | QUALIFY LEAD | **Leads** | None | LeadQualificationDto | Completed |
| 128 | POST | /api/leads/:id/status | UPDATE LEAD STATUS & STAGE | **Leads** | None | UpdateLeadStatusDto | Completed |
| 129 | POST | /api/leads/:id/convert | CONVERT LEAD | **Leads** | None | ConvertLeadDto | Completed |
| 130 | POST | /api/leads/:id/activities | LOG LEAD ACTIVITY | **Leads** | None | CreateLeadActivityDto | Completed |
| 131 | GET | /api/leads/:id/timeline | GET LEAD TIMELINE | **Leads** | None | None | Completed |
| 132 | POST | /api/leads/:id/follow-ups | SCHEDULE FOLLOW-UP | **Leads** | None | CreateLeadFollowupDto | Completed |
133 | GET | /api/leads/follow-ups/my | GET MY FOLLOW-UPS | **Leads** | None | None | Completed |
| 134 | PUT | /api/leads/follow-ups/:id | UPDATE FOLLOW-UP STATUS | **Leads** | None | UpdateFollowupStatusDto | Completed |
| 135 | GET | /api/leads/pipeline/stages | GET PIPELINE STAGES | **Leads** | None | None | Completed |
| 136 | GET | /api/leads/metrics/summary | GET LEAD METRICS SUMMARY | **Leads** | None | None | Completed |
| 137 | GET | /api/leads/metrics/pipeline | GET PIPELINE BREAKDOWN METRICS | **Leads** | None | None | Completed |
| 138 | POST | /api/leads/import | BATCH SPREADSHEET LEAD IMPORT | **Leads** | None | ImportLeadsDto | Completed |
| 140 | GET | /api/admin/employees/activity | SUPER ADMIN - EMPLOYEES ACTIVITY DASHBOARD | **Admin Dashboard** | Public / Authenticated | QueryEmployeeActivityDto | Completed |
| 141 | GET | /api/admin/employees/:id/sessions | SUPER ADMIN - EMPLOYEE SESSIONS HISTORY | **Admin Dashboard** | Public / Authenticated | QueryEmployeeSessionsDto | Completed |
| 142 | GET | /api/admin/employees/:id/tasks | SUPER ADMIN - EMPLOYEE TASKS REVIEW | **Tasks** | Public / Authenticated | QueryEmployeeTasksDto | Completed |
| 143 | GET | /api/admin/tasks/summary | SUPER ADMIN - TASKS OVERALL SUMMARY | **Tasks** | Public / Authenticated | QueryDateRangeDto | Completed |
| 144 | GET | /api/admin/leads/summary | SUPER ADMIN - LEADS EXECUTIVE SUMMARY | **Leads** | Public / Authenticated | QueryDateRangeDto | Completed |
| 145 | GET | /api/admin/leads/by-employee | SUPER ADMIN - LEADS BY EMPLOYEE PERFORMANCE | **Leads** | Public / Authenticated | QueryDateRangeDto | Completed |
| 146 | GET | /api/admin/leads/trend | SUPER ADMIN - LEADS CREATION & CONVERSION TREND | **Leads** | Public / Authenticated | QueryLeadTrendDto | Completed |
| 147 | GET | /api/admin/leads/by-source | SUPER ADMIN - LEADS BY SOURCE BREAKDOWN | **Leads** | Public / Authenticated | QueryDateRangeDto | Completed |
| 148 | GET | /api/leave/types | LEAVE - GET ALL LEAVE TYPES | **Leave** | Public / Authenticated | None | Completed |
| 149 | POST | /api/leave/types | LEAVE - CREATE LEAVE TYPE & POLICY | **Leave** | Public / Authenticated | CreateLeaveTypeDto | Completed |
| 150 | GET | /api/leave/types/:id | LEAVE - GET LEAVE TYPE BY ID | **Leave** | Public / Authenticated | None | Completed |
| 151 | PATCH | /api/leave/types/:id | LEAVE - UPDATE LEAVE TYPE METADATA | **Leave** | Public / Authenticated | UpdateLeaveTypeDto | Completed |
| 152 | POST | /api/leave/types/:id/versions | LEAVE - CREATE POLICY VERSION | **Leave** | Public / Authenticated | CreatePolicyVersionDto | Completed |
| 153 | GET | /api/leave/holidays | LEAVE - GET HOLIDAYS | **Leave** | Public / Authenticated | None | Completed |
| 154 | POST | /api/leave/holidays | LEAVE - CREATE HOLIDAY | **Leave** | Public / Authenticated | CreateHolidayDto | Completed |
| 155 | DELETE | /api/leave/holidays/:id | LEAVE - DELETE HOLIDAY | **Leave** | Public / Authenticated | Inline/Params | Completed |
| 156 | GET | /api/leave/weekly-off-policies | LEAVE - GET WEEKLY OFF POLICIES | **Leave** | Public / Authenticated | None | Completed |
| 157 | POST | /api/leave/weekly-off-policies | LEAVE - CREATE WEEKLY OFF POLICY | **Leave** | Public / Authenticated | CreateWeeklyOffPolicyDto | Completed |
| 158 | POST | /api/leave/requests | LEAVE - APPLY FOR LEAVE REQUEST | **Leave** | Public / Authenticated | ApplyLeaveRequestDto | Completed |
| 159 | GET | /api/leave/requests/my | LEAVE - GET MY LEAVE REQUESTS | **Leave** | Public / Authenticated | None | Completed |
| 160 | GET | /api/leave/requests | LEAVE - GET ALL LEAVE REQUESTS (HR / MANAGER) | **Leave** | Public / Authenticated | None | Completed |
| 161 | GET | /api/leave/requests/:id | LEAVE - GET LEAVE REQUEST BY ID | **Leave** | Public / Authenticated | None | Completed |
| 162 | POST | /api/leave/requests/:id/review | LEAVE - APPROVE / REJECT LEAVE REQUEST | **Leave** | Public / Authenticated | ReviewLeaveRequestDto | Completed |
| 163 | POST | /api/leave/requests/:id/cancel | LEAVE - CANCEL LEAVE REQUEST | **Leave** | Public / Authenticated | CreateCancellationRequestDto | Completed |
| 164 | POST | /api/leave/cancellations/:id/review | LEAVE - REVIEW CANCELLATION REQUEST | **Leave** | Public / Authenticated | ReviewCancellationRequestDto | Completed |
| 165 | GET | /api/leave/balances/my | LEAVE - GET MY LEAVE BALANCES | **Leave** | Public / Authenticated | None | Completed |
| 166 | GET | /api/leave/balances | LEAVE - GET EMPLOYEE BALANCES (HR / MANAGER) | **Leave** | Public / Authenticated | None | Completed |
| 167 | POST | /api/leave/balances/adjust | LEAVE - MANUAL BALANCE ADJUSTMENT | **Leave** | Public / Authenticated | AdjustLeaveBalanceDto | Completed |
| 168 | GET | /api/leave/transactions | LEAVE - GET TRANSACTION AUDIT LEDGER | **Leave** | Public / Authenticated | None | Completed |
| 169 | GET | /api/leave/calendar | LEAVE - GET CALENDAR FEED | **Leave** | Public / Authenticated | None | Completed |
| 170 | GET | /api/leave/reports/summary | LEAVE - GET SUMMARY REPORTS | **Leave** | Public / Authenticated | None | Completed |
| 171 | GET | /api/departments | DEPARTMENTS - LIST DEPARTMENTS | **Departments** | Public / Authenticated | QueryDepartmentsDto | Completed |
| 172 | POST | /api/departments | DEPARTMENTS - CREATE DEPARTMENT | **Departments** | Public / Authenticated | CreateDepartmentDto | Completed |
| 173 | GET | /api/departments/:id | DEPARTMENTS - GET DEPARTMENT DETAILS | **Departments** | Public / Authenticated | None | Completed |
| 174 | PATCH | /api/departments/:id | DEPARTMENTS - UPDATE DEPARTMENT | **Departments** | Public / Authenticated | UpdateDepartmentDto | Completed |
| 175 | DELETE | /api/departments/:id | DEPARTMENTS - DELETE DEPARTMENT | **Departments** | Public / Authenticated | Inline/Params | Completed |
| 176 | PATCH | /api/leave/holidays/:id | LEAVE - CUSTOMIZE / UPDATE HOLIDAY | **Leave** | Public / Authenticated | UpdateHolidayDto | Completed |
| 177 | POST | /api/leave/holidays/sync-google-calendar | LEAVE - SYNC GOOGLE CALENDAR HOLIDAYS | **Leave** | Public / Authenticated | SyncGoogleHolidaysDto | Completed |
| 178 | GET | /api/leave/holidays/calendar.ics?year=2026 | LEAVE - EXPORT HOLIDAYS ICALENDAR (.ICS) | **Leave** | Public / Authenticated | Inline/Params | Completed |