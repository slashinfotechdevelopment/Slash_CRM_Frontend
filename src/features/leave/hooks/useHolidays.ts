import { getErrorMessage } from '@/api/client/errorMapper';
import { useState, useCallback, useEffect } from 'react';
import { leaveConnector } from '@/connectors/leave.connector';
import { Holiday, WeeklyOffPolicy, WorkCalendarScope } from '@/api/types/leave.types';
import { useConfirm } from '@/hooks/useConfirm';

export const useHolidays = () => {
  const confirm = useConfirm();
  const currentYear = new Date().getFullYear();
  const [activeTab, setActiveTab] = useState<'HOLIDAYS' | 'WEEKLY_OFF'>('HOLIDAYS');
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loadingHolidays, setLoadingHolidays] = useState(true);

  const [weeklyOffs, setWeeklyOffs] = useState<WeeklyOffPolicy[]>([]);
  const [loadingWeeklyOffs, setLoadingWeeklyOffs] = useState(false);

  const [isHolidayModalOpen, setIsHolidayModalOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  const [holidayForm, setHolidayForm] = useState<{
    name: string;
    date: string;
    description: string;
    isOptional: boolean;
    scopeType: WorkCalendarScope;
  }>({
    name: '',
    date: `${currentYear}-01-01`,
    description: '',
    isOptional: false,
    scopeType: 'GLOBAL',
  });
  const [isSubmittingHoliday, setIsSubmittingHoliday] = useState(false);
  const [holidayError, setHolidayError] = useState<string | null>(null);

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const [isWeeklyOffModalOpen, setIsWeeklyOffModalOpen] = useState(false);
  const [weeklyOffForm, setWeeklyOffForm] = useState<{
    name: string;
    description: string;
    daysOfWeek: number[];
    pattern: string;
    effectiveFrom: string;
  }>({
    name: 'Standard Weekend Off',
    description: 'Saturday and Sunday off',
    daysOfWeek: [0, 6],
    pattern: 'ALL',
    effectiveFrom: `${currentYear}-01-01`,
  });
  const [isSubmittingWeeklyOff, setIsSubmittingWeeklyOff] = useState(false);
  const [weeklyOffError, setWeeklyOffError] = useState<string | null>(null);

  const loadHolidays = useCallback(async () => {
    setLoadingHolidays(true);
    try {
      const res = await leaveConnector.getHolidays({ year: selectedYear });
      setHolidays(res);
    } catch (err) {
      console.error('Failed to load holidays:', err);
    } finally {
      setLoadingHolidays(false);
    }
  }, [selectedYear]);

  const loadWeeklyOffs = useCallback(async () => {
    setLoadingWeeklyOffs(true);
    try {
      const res = await leaveConnector.getWeeklyOffPolicies();
      setWeeklyOffs(res);
    } catch (err) {
      console.error('Failed to load weekly off policies:', err);
    } finally {
      setLoadingWeeklyOffs(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'HOLIDAYS') {
      loadHolidays();
    } else {
      loadWeeklyOffs();
    }
  }, [activeTab, loadHolidays, loadWeeklyOffs]);

  const handleOpenAddHoliday = () => {
    setEditingHoliday(null);
    setHolidayForm({
      name: '',
      date: `${selectedYear}-01-01`,
      description: '',
      isOptional: false,
      scopeType: 'GLOBAL',
    });
    setHolidayError(null);
    setIsHolidayModalOpen(true);
  };

  const handleOpenEditHoliday = (h: Holiday) => {
    setEditingHoliday(h);
    setHolidayForm({
      name: h.name,
      date: h.date,
      description: h.description || '',
      isOptional: h.isOptional,
      scopeType: h.scopeType,
    });
    setHolidayError(null);
    setIsHolidayModalOpen(true);
  };

  const handleSaveHoliday = async () => {
    if (!holidayForm.name.trim()) {
      setHolidayError('Holiday name is required.');
      return;
    }
    if (!holidayForm.date) {
      setHolidayError('Holiday date is required.');
      return;
    }

    setHolidayError(null);
    setIsSubmittingHoliday(true);
    try {
      if (editingHoliday) {
        await leaveConnector.updateHoliday(editingHoliday.id, {
          name: holidayForm.name.trim(),
          date: holidayForm.date,
          description: holidayForm.description.trim() || undefined,
          isOptional: holidayForm.isOptional,
          scopeType: holidayForm.scopeType,
        });
      } else {
        await leaveConnector.createHoliday({
          name: holidayForm.name.trim(),
          date: holidayForm.date,
          year: new Date(holidayForm.date).getFullYear(),
          description: holidayForm.description.trim() || undefined,
          isOptional: holidayForm.isOptional,
          scopeType: holidayForm.scopeType,
        });
      }
      setIsHolidayModalOpen(false);
      await loadHolidays();
    } catch (err) {
      const msg = err instanceof Error ? getErrorMessage(err) : 'Failed to save holiday.';
      setHolidayError(msg);
    } finally {
      setIsSubmittingHoliday(false);
    }
  };

  const handleDeleteHoliday = async (h: Holiday) => {
    const res = await confirm({
      tone: 'danger',
      title: `Delete Holiday "${h.name}"?`,
      message: `Are you sure you want to delete the holiday "${h.name}" (${h.date})? This action cannot be undone.`,
      confirmLabel: 'Delete Holiday',
    });

    if (res.confirmed) {
      try {
        await leaveConnector.deleteHoliday(h.id);
        await loadHolidays();
      } catch (err) {
        console.error('Failed to delete holiday:', err);
      }
    }
  };

  const handleSyncGoogle = async () => {
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      const res = await leaveConnector.syncGoogleHolidays({ year: selectedYear, countryCode: 'IN' });
      setSyncMessage(res.message || 'Holidays synchronized successfully!');
      await loadHolidays();
    } catch (err) {
      const msg = err instanceof Error ? getErrorMessage(err) : 'Failed to synchronize with Google Calendar.';
      setSyncMessage(msg);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSaveWeeklyOff = async () => {
    if (!weeklyOffForm.name.trim()) {
      setWeeklyOffError('Policy name is required.');
      return;
    }
    if (weeklyOffForm.daysOfWeek.length === 0) {
      setWeeklyOffError('Select at least one day of week.');
      return;
    }
    if (!weeklyOffForm.effectiveFrom) {
      setWeeklyOffError('Effective from date is required.');
      return;
    }

    setWeeklyOffError(null);
    setIsSubmittingWeeklyOff(true);
    try {
      await leaveConnector.createWeeklyOffPolicy({
        name: weeklyOffForm.name.trim(),
        description: weeklyOffForm.description.trim() || undefined,
        daysOfWeek: weeklyOffForm.daysOfWeek,
        pattern: weeklyOffForm.pattern,
        effectiveFrom: weeklyOffForm.effectiveFrom,
        scopeType: 'GLOBAL',
      });
      setIsWeeklyOffModalOpen(false);
      await loadWeeklyOffs();
    } catch (err) {
      const msg = err instanceof Error ? getErrorMessage(err) : 'Failed to create weekly off policy.';
      setWeeklyOffError(msg);
    } finally {
      setIsSubmittingWeeklyOff(false);
    }
  };

  return {
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
  };
};
