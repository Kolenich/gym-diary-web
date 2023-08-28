export const getCurrentHost = (): string => {
  const url = window.location.href;
  const arr = url.split('/');
  return `${arr[0]}//${arr[2]}`;
};
