import { type FC } from 'react';

import { CircularProgress, Typography } from '@mui/material';

const Loading: FC = () => (
  <Typography
    component='div'
    sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      bgcolor: 'grey.500',
      opacity: 0.6,
    }}
  >
    <CircularProgress
      sx={{
        position: 'absolute',
        top: 'calc(45% - 10px)',
        left: 'calc(50% - 10px)',
      }}
      size={50}
    />
  </Typography>
);

export default Loading;
