export const toIsoString = (date: Date | string): string => {
  const dateObject = new Date(date);

  const tzo = -dateObject.getTimezoneOffset();
  const dif = tzo >= 0 ? '+' : '-';
  const pad = (num: number): string => (num < 10 ? '0' : '') + num;

  return (
    dateObject.getFullYear() +
    '-' +
    pad(dateObject.getMonth() + 1) +
    '-' +
    pad(dateObject.getDate()) +
    'T' +
    pad(dateObject.getHours()) +
    ':' +
    pad(dateObject.getMinutes()) +
    ':' +
    pad(dateObject.getSeconds()) +
    dif +
    pad(Math.floor(Math.abs(tzo) / 60)) +
    ':' +
    pad(Math.abs(tzo) % 60)
  );
};
