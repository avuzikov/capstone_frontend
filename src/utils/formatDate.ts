// src\utils\formatDate.ts
const INITIAL_OPTIONS: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
};

export const format = (
  dateString: string,
  locale: string = "en-GB",
  options: Intl.DateTimeFormatOptions = INITIAL_OPTIONS
) => {
  const date = new Date(dateString);

  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};
