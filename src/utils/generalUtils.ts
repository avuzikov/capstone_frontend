// src/utils/generalUtils.ts

// Date formatting
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

// Truncate long text
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Generate a random color (could be useful for UI elements)
export const generateRandomColor = (): string => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
};

// Debounce function (useful for search inputs)
export const debounce = <F extends (...args: any[]) => any>(func: F, waitFor: number) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<F>): Promise<ReturnType<F>> => {
    return new Promise(resolve => {
      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => resolve(func(...args)), waitFor);
    });
  };
};

// Capitalize first letter of each word
export const capitalizeWords = (str: string): string => {
  return str.replace(/\b\w/g, l => l.toUpperCase());
};

// Check if an object is empty
export const isObjectEmpty = (obj: Record<string, any>): boolean => {
  return Object.keys(obj).length === 0;
};

// Deep clone an object
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};
