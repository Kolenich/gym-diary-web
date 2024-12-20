export const isoToDatetimeLocal = (isoDateString: string): string => {
  const dateObject = new Date(isoDateString);

  return `${dateObject.getFullYear()}-${dateObject.getMonth() + 1}-${dateObject.getDate()}T${dateObject.getHours()}:${('0' + dateObject.getMinutes()).slice(-2)}`;
};
