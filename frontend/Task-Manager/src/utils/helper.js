export const validateEmail = (email) => {
  const reqex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return reqex.test(email);
};
