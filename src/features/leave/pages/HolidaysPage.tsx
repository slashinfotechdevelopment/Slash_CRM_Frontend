import React from 'react';
import { leaveConnector } from '@/connectors/leave.connector';
import { Button } from '@/components/ui/Button';
import { HolidaysTable } from '../components/HolidaysTable';
import { WeeklyOffPoliciesTable } from '../components/WeeklyOffPoliciesTable';
import { HolidayModals } from '../components/HolidayModals';
import { useHolidays } from '../hooks/useHolidays';

export const HolidaysPage: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    selectedYear,
    setSelectedYear,
    holidays,
    loadingHolidays,
    weeklyOffs,
    loadingWeeklyOffs,
    isHolidayModalOpen,
    setIsHolidayModalOpen,
    editingHoliday,
    holidayForm,
    setHolidayForm,
    isSubmittingHoliday,
    holidayError,
    handleOpenAddHoliday,
    handleOpenEditHoliday,
    handleSaveHoliday,
    handleDeleteHoliday,
    isSyncing,
    syncMessage,
    setSyncMessage,
    handleSyncGoogle,
    isWeeklyOffModalOpen,
    setIsWeeklyOffModalOpen,
    weeklyOffForm,
    setWeeklyOffForm,
    isSubmittingWeeklyOff,
    weeklyOffError,
    handleSaveWeeklyOff,
  } = useHolidays();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Holidays & Work Calendars</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Configure gazetted public holidays, synchronize Google Calendar feeds, and manage weekly-off schedules.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {activeTab === 'HOLIDAYS' ? (
            <>
              <a
                href={leaveConnector.getHolidaysIcsUrl(selectedYear)}
                download={`holidays-${selectedYear}.ics`}
                className="inline-flex items-center text-xs font-semibold px-3 py-2 border border-neutral-300 rounded-lg bg-white text-neutral-700 hover:bg-neutral-50 shadow-xs"
              >
                <svg className="w-4 h-4 mr-1.5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export .ics
              </a>
              <Button variant="outline" onClick={handleSyncGoogle} isLoading={isSyncing} className="text-xs">
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Sync Google Calendar
              </Button>
              <Button variant="primary" onClick={handleOpenAddHoliday} className="text-xs">
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Holiday
              </Button>
            </>
          ) : (
            <Button variant="primary" onClick={() => setIsWeeklyOffModalOpen(true)} className="text-xs">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Weekly-Off Policy
            </Button>
          )}
        </div>
      </div>

      {syncMessage && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-xs flex items-center justify-between">
          <span>{syncMessage}</span>
          <button onClick={() => setSyncMessage(null)} className="text-blue-500 hover:text-blue-700">✕</button>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-neutral-200 flex gap-4 text-sm">
        <button
          onClick={() => setActiveTab('HOLIDAYS')}
          className={`pb-3 font-medium transition-colors border-b-2 ${
            activeTab === 'HOLIDAYS'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          Company Holidays
        </button>
        <button
          onClick={() => setActiveTab('WEEKLY_OFF')}
          className={`pb-3 font-medium transition-colors border-b-2 ${
            activeTab === 'WEEKLY_OFF'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          Weekly-Off Policies
        </button>
      </div>

      {activeTab === 'HOLIDAYS' ? (
        <HolidaysTable
          holidays={holidays}
          loading={loadingHolidays}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          onEdit={handleOpenEditHoliday}
          onDelete={handleDeleteHoliday}
        />
      ) : (
        <WeeklyOffPoliciesTable
          weeklyOffs={weeklyOffs}
          loading={loadingWeeklyOffs}
        />
      )}

      <HolidayModals
        isHolidayModalOpen={isHolidayModalOpen}
        onCloseHoliday={() => setIsHolidayModalOpen(false)}
        editingHoliday={editingHoliday}
        holidayForm={holidayForm}
        setHolidayForm={setHolidayForm}
        isSubmittingHoliday={isSubmittingHoliday}
        holidayError={holidayError}
        onSaveHoliday={handleSaveHoliday}
        isWeeklyOffModalOpen={isWeeklyOffModalOpen}
        onCloseWeeklyOff={() => setIsWeeklyOffModalOpen(false)}
        weeklyOffForm={weeklyOffForm}
        setWeeklyOffForm={setWeeklyOffForm}
        isSubmittingWeeklyOff={isSubmittingWeeklyOff}
        weeklyOffError={weeklyOffError}
        onSaveWeeklyOff={handleSaveWeeklyOff}
      />
    </div>
  );
};
