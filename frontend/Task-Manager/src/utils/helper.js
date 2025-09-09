// validateEmail function checks if the provided string is a valid email format
export const validateEmail = (email) => {
  // Regular expression to match basic email pattern: something@something.something
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Returns true if email matches the regex, false otherwise
  return regex.test(email);
};
