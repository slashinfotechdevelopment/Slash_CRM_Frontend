import fs from 'fs';

let content = fs.readFileSync('src/features/tasks/pages/TaskReportsPage.tsx', 'utf8');

// Replace activeTab === 'hours' section
const oldHoursRegex = /\{activeTab === 'hours'[\s\S]*?\{activeTab === 'performance'/;
const newHours = `{activeTab === 'hours' && (
            <div className="space-y-6">
              {hoursReport && (() => {
                const hoursReportObj = hoursReport as unknown as {
                  data?: EmployeeHoursRow[];
                  employees?: EmployeeHoursRow[];
                  summary?: { totalWorkingHours?: number; totalPausedHours?: number; uniqueEmployeesCount?: number };
                };
                const hoursList: EmployeeHoursRow[] = Array.isArray(hoursReport)
                  ? (hoursReport as unknown as EmployeeHoursRow[])
                  : hoursReportObj?.data ?? hoursReportObj?.employees ?? [];
                const totWorking = Array.isArray(hoursReport)
                  ? Math.round((hoursReport as unknown as EmployeeHoursRow[]).reduce((acc, h) => acc + (h.totalWorkingHours || 0), 0) * 10) / 10
                  : hoursReportObj?.summary?.totalWorkingHours ?? 0;
                const totPaused = Array.isArray(hoursReport)
                  ? Math.round((hoursReport as unknown as EmployeeHoursRow[]).reduce((acc, h) => acc + (h.totalPausedHours || 0), 0) * 10) / 10
                  : hoursReportObj?.summary?.totalPausedHours ?? 0;
                const activeEmployees = Array.isArray(hoursReport)
                  ? new Set((hoursReport as unknown as EmployeeHoursRow[]).map((h) => h.employee?.id).filter(Boolean)).size
                  : hoursReportObj?.summary?.uniqueEmployeesCount ?? 0;

                return (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
                        <div className="text-xs font-semibold text-slate-500 uppercase">Total Working Hours</div>
                        <div className="text-3xl font-bold text-slate-900 mt-1">{totWorking} hrs</div>
                      </div>
                      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
                        <div className="text-xs font-semibold text-slate-500 uppercase">Total Paused Hours</div>
                        <div className="text-3xl font-bold text-amber-600 mt-1">{totPaused} hrs</div>
                      </div>
                      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
                        <div className="text-xs font-semibold text-slate-500 uppercase">Active Employees</div>
                        <div className="text-3xl font-bold text-brand-primary mt-1">{activeEmployees}</div>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                      {hoursList.length === 0 ? (
                        <div className="p-8 text-center text-xs text-slate-400 italic">
                          No working hours logged for the selected period.
                        </div>
                      ) : (
                        <table className="w-full text-xs text-left">
                          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                            <tr>
                              <th className="p-3">Employee</th>
                              <th className="p-3">Working Hours</th>
                              <th className="p-3">Pause Hours</th>
                              <th className="p-3">Productivity Ratio</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {hoursList.map((emp: EmployeeHoursRow, idx: number) => {
                              const empName = emp.employee?.name || emp.employeeName || 'Unknown';
                              const empCode = emp.employee?.userCode || emp.userCode || '';
                              const empId = emp.employee?.id || emp.employeeId || \`emp-\${idx}\`;
                              const wHours = emp.totalWorkingHours || 0;
                              const pHours = emp.totalPausedHours || 0;
                              const totalTime = wHours + pHours;
                              const ratio = totalTime > 0 ? Math.round((wHours / totalTime) * 100) : 100;
                              return (
                                <tr key={empId} className="hover:bg-slate-50/50">
                                  <td className="p-3 font-semibold text-slate-800">
                                    {empName} {empCode && <span className="font-mono text-slate-400 font-normal">({empCode})</span>}
                                  </td>
                                  <td className="p-3 font-semibold text-slate-900">{wHours} hrs</td>
                                  <td className="p-3 text-amber-600">{pHours} hrs</td>
                                  <td className="p-3">{ratio}% active</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          {activeTab === 'performance'`;

if (oldHoursRegex.test(content)) {
  content = content.replace(oldHoursRegex, newHours);
  fs.writeFileSync('src/features/tasks/pages/TaskReportsPage.tsx', content, 'utf8');
  console.log('Successfully updated hours tab in TaskReportsPage.tsx');
} else {
  console.error('Regex did not match in TaskReportsPage.tsx');
  process.exit(1);
}
