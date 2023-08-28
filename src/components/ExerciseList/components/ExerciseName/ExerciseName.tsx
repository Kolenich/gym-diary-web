import type { FC } from 'react';

import { Tooltip, useMediaQuery, useTheme } from '@mui/material';

import type { IExerciseNameProps } from './ExerciseName.types';

const ExerciseName: FC<IExerciseNameProps> = ({ name }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const isMobileRenderNeeded = isMobile && name.length > 8;

  if (isMobileRenderNeeded) {
    return (
      <Tooltip title={name}>
        <>{name.substring(0, 8)}...</>
      </Tooltip>
    );
  }

  return <>{name}</>;
};

export default ExerciseName;
