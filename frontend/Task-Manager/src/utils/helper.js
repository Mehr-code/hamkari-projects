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
