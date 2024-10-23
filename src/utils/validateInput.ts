// src\utils\validateInput.ts

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email);
};

export const isNotEmpty = (text: string): boolean => {
  return text.trim().length > 0;
};
