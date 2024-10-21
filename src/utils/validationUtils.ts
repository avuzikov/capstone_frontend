export const validateEmail = (email: string): string | null => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email) ? null : 'Invalid email address';
};

export const validateRequired = (value: string): string | null => {
  return value.trim() ? null : 'This field is required';
};

export const validatePassword = (password: string): string | null => {
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number';
  }
  return null;
};

export const validateForm = (
  formData: Record<string, string>,
  validations: Record<string, (value: string) => string | null>
): Record<string, string> => {
  const errors: Record<string, string> = {};
  Object.keys(validations).forEach(field => {
    const error = validations[field](formData[field]);
    if (error) {
      errors[field] = error;
    }
  });
  return errors;
};
