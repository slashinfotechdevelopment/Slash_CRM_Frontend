/**
 * Standard formatters for dates, currencies, and numbers
 */

function formatWithIntl(dateString: string | null | undefined, options: Intl.DateTimeFormatOptions): string {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', options).format(d);
  } catch {
    return dateString;
  }
}

export function formatDate(dateString?: string | null): string {
  return formatWithIntl(dateString, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(dateString?: string | null): string {
  return formatWithIntl(dateString, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatTime(timeString?: string | null): string {
  if (!timeString) return '-';
  try {
    // If it's already HH:mm or HH:mm:ss
    if (/^\d{2}:\d{2}(:\d{2})?$/.test(timeString)) {
      const [h, m] = timeString.split(':');
      const hour = parseInt(h, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${m} ${ampm}`;
    }
    const d = new Date(timeString);
    if (!isNaN(d.getTime())) {
      return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }).format(d);
    }
    return timeString;
  } catch {
    return timeString;
  }
}

export function formatMinutes(minutes?: number | null): string {
  if (minutes == null || isNaN(minutes)) return '0m';
  const hrs = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (hrs > 0 && mins > 0) return `${hrs}h ${mins}m`;
  if (hrs > 0) return `${hrs}h`;
  return `${mins}m`;
}

export function formatDurationSeconds(seconds?: number | null): string {
  if (seconds == null || isNaN(seconds) || seconds < 0) return '00:00:00';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
}

export function formatCurrency(amount?: number | null, currency: string = 'INR'): string {
  if (amount == null || isNaN(amount)) return '-';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num?: number | null): string {
  if (num == null || isNaN(num)) return '0';
  return new Intl.NumberFormat('en-US').format(num);
}
