// validateEmail function checks if the provided string is a valid email format
export const validateEmail = (email) => {
  // Regular expression to match basic email pattern: something@something.something
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Returns true if email matches the regex, false otherwise
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
