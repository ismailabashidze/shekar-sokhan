import jalaali from 'jalaali-js';

/**
 * Convert Persian date and time to ISO string
 * @param persianDate Persian date in format YYYY/MM/DD (e.g. 1402/12/10)
 * @param time Time in format HH:MM (e.g. 14:30)
 * @returns ISO string (e.g. 2024-03-01T14:30:00.000Z)
 */
export function persianDateTimeToISO(persianDate: string, time: string = '00:00'): string {
  if (!persianDate) return '';

  // Parse Persian date (YYYY/MM/DD)
  const dateParts = persianDate.split('/');
  if (dateParts.length !== 3) return '';

  const persianYear = parseInt(dateParts[0]);
  const persianMonth = parseInt(dateParts[1]);
  const persianDay = parseInt(dateParts[2]);

  // Parse time (HH:MM)
  const timeParts = time.split(':');
  const hours = timeParts.length >= 1 ? parseInt(timeParts[0]) || 0 : 0;
  const minutes = timeParts.length >= 2 ? parseInt(timeParts[1]) || 0 : 0;

  // Convert Persian to Gregorian
  const { gy, gm, gd } = jalaali.toGregorian(persianYear, persianMonth, persianDay);

  // Create Date object (months are 0-based in JavaScript)
  const date = new Date(gy, gm - 1, gd, hours, minutes, 0, 0);

  return date.toISOString();
}

/**
 * Convert ISO string to Persian date and time
 * @param isoString ISO string (e.g. 2024-03-01T14:30:00.000Z)
 * @returns Object with Persian date and time
 */
export function isoToPersianDateTime(isoString: string): { persianDate: string; time: string } {
  if (!isoString) return { persianDate: '', time: '' };

  const date = new Date(isoString);

  // Convert to Persian
  const { jy, jm, jd } = jalaali.toJalaali(date.getFullYear(), date.getMonth() + 1, date.getDate());

  const persianDate = `${jy}/${jm.toString().padStart(2, '0')}/${jd.toString().padStart(2, '0')}`;
  const time = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

  return { persianDate, time };
}

/**
 * Get relative time until scheduled notification
 * @param announceTime ISO string of when notification should be announced
 * @returns Persian relative time string
 */
export function getRelativeTimeToAnnounce(announceTime: string): string {
  if (!announceTime) return '';

  const now = new Date();
  const scheduleTime = new Date(announceTime);
  const diffMs = scheduleTime.getTime() - now.getTime();

  // If time has passed
  if (diffMs <= 0) {
    return 'زمان ارسال گذشته';
  }

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) {
    return 'کمتر از ۱ دقیقه';
  }
  else if (diffMinutes < 60) {
    return `${diffMinutes.toLocaleString('fa-IR')} دقیقه تا ارسال`;
  }
  else if (diffHours < 24) {
    return `${diffHours.toLocaleString('fa-IR')} ساعت تا ارسال`;
  }
  else if (diffDays < 30) {
    return `${diffDays.toLocaleString('fa-IR')} روز تا ارسال`;
  }
  else {
    const diffMonths = Math.floor(diffDays / 30);
    return `${diffMonths.toLocaleString('fa-IR')} ماه تا ارسال`;
  }
}

/**
 * Format Persian date for display
 * @param persianDate Persian date in format YYYY/MM/DD
 * @returns Formatted Persian date with month name
 */
export function formatPersianDate(persianDate: string): string {
  if (!persianDate) return '';

  const persianMonths = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند',
  ];

  const dateParts = persianDate.split('/');
  if (dateParts.length !== 3) return persianDate;

  const year = dateParts[0];
  const month = parseInt(dateParts[1]);
  const day = parseInt(dateParts[2]);

  if (month < 1 || month > 12) return persianDate;

  return `${day.toLocaleString('fa-IR')} ${persianMonths[month - 1]} ${year.toLocaleString('fa-IR')}`;
}
