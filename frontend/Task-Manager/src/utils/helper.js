// helpers/dateHelpers.js
import moment from "moment-jalaali";

import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

// validateEmail function for common real-world email addresses
export const validateEmail = (email) => {
  // Basic pattern: something@something.something (letters, numbers, dots, dashes allowed)
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};

/**
 * Format a number with thousands separators (commas).
 * Example: 1234567.89 => "1,234,567.89"
 *
 * @param {number} num - The number to format
 * @returns {string} - Formatted number with commas, or empty string if input is invalid
 */
export const addThousandsSeparator = (num) => {
  // Check if input is null, undefined, or not a number
  if (num == null || isNaN(num)) return "";

  // Split the number into integer and fractional parts
  const [integerPart, fractionalPart] = num.toString().split(".");

  // Add commas to the integer part using regex
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Combine integer and fractional parts if fractional exists
  return fractionalPart
    ? `${formattedInteger}.${fractionalPart}`
    : formattedInteger;
};

/**
 * Convert English numbers to Persian numbers
 * Example: 1234 -> ۱۲۳۴
 */
export const toPersianDigits = (num) => {
  if (num == null) return "";
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
  return num.toString().replace(/\d/g, (d) => persianDigits[d]);
};

/**
 * Convert Persian/Jalali date (from react-multi-date-picker DateObject or 'jYYYY/jMM/jDD' string)
 * into a *date-only* Gregorian string "YYYY-MM-DD".
 * Recommended: send this to backend for dueDate.
 */
export function jalaliToDateOnlyISO(value) {
  if (!value) return null;

  // Normalize Persian digits to english digits (if needed)
  const persianToEnglishDigits = (s) => {
    if (!s) return s;
    const persian = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    const arabic = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return s.replace(/[۰-۹٠-٩]/g, (ch) => {
      const p = persian.indexOf(ch);
      if (p !== -1) return String(p);
      const a = arabic.indexOf(ch);
      if (a !== -1) return String(a);
      return ch;
    });
  };

  // 1) If value is DateObject from react-multi-date-picker (has .format)
  if (typeof value === "object" && typeof value.format === "function") {
    // format in its calendar (persian), e.g. "1404/06/20"
    const jalaliStr = value.format("YYYY/MM/DD");
    const normalized = persianToEnglishDigits(jalaliStr);
    const m = moment(normalized, "jYYYY/jMM/jDD");
    if (!m.isValid()) return null;
    return m.format("YYYY-MM-DD"); // date-only (no time)
  }

  // 2) If it's a string like "1404/06/20" (possibly with persian digits)
  if (typeof value === "string") {
    const normalized = persianToEnglishDigits(value);
    const m = moment(normalized, "jYYYY/jMM/jDD");
    if (!m.isValid()) return null;
    return m.format("YYYY-MM-DD");
  }

  // 3) If it's already a JS Date -> convert to YYYY-MM-DD (local)
  if (value instanceof Date) {
    return moment(value).format("YYYY-MM-DD");
  }

  return null;
}

/**
 * Convert backend Gregorian date (either "YYYY-MM-DD" or ISO datetime)
 * into Persian display string like "۲۰ شهریور ۱۴۰۴" (with locale fa & jalaali).
 *
 * - If backend sends "YYYY-MM-DD" (recommended for date-only), it will be parsed as a plain date (no timezone shift).
 * - If backend sends ISO datetime, we parse as UTC then convert to local to avoid day shift.
 */
export function gregorianToJalaliDisplay(
  dateFromBackend,
  { withWeekday = false } = {}
) {
  if (!dateFromBackend) return "بدون تاریخ";

  // detect date-only "YYYY-MM-DD"
  const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(dateFromBackend);

  let m;
  if (isDateOnly) {
    // parse as local date-only (no timezone conversion)
    m = moment(dateFromBackend, "YYYY-MM-DD");
  } else {
    // parse ISO datetime as UTC then convert to local
    m = moment.utc(dateFromBackend).local();
  }

  if (!m.isValid()) return "بدون تاریخ";

  // format in jalali with persian locale - ensure you've called:
  // moment.loadPersian({ dialect: "persian-modern", usePersianDigits: true });
  const fmt = withWeekday ? "dddd، jD jMMMM jYYYY" : "jD jMMMM jYYYY";
  return m.locale("fa").format(fmt);
}

export function convertFaMiladiToJalali(faMiladiStr, asObject = false) {
  if (!faMiladiStr) return null;

  // تبدیل اعداد فارسی به انگلیسی
  const map = {
    "۰": "0",
    "۱": "1",
    "۲": "2",
    "۳": "3",
    "۴": "4",
    "۵": "5",
    "۶": "6",
    "۷": "7",
    "۸": "8",
    "۹": "9",
  };
  const englishStr = faMiladiStr.replace(/[۰-۹]/g, (w) => map[w]);

  // ساخت شیء Date واقعی از رشته میلادی
  const date = new Date(englishStr);

  // ساخت DateObject جلالی واقعی
  const jalaliDate = new DateObject({
    date,
    calendar: persian,
    locale: persian_fa,
  });

  // خروجی
  return asObject ? jalaliDate : jalaliDate.format("YYYY/MM/DD");
}
