import { useMediaQuery, useTheme } from '@mui/material';

export const useMobile = (): boolean => {
  const theme = useTheme();

  return useMediaQuery(theme.breakpoints.down('md'));
};
