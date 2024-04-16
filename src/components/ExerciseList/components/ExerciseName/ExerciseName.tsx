import { type FC } from 'react';

import { Tooltip } from '@mui/material';

import { useMobile } from 'hooks/use-mobile';

import { type IExerciseNameProps } from './ExerciseName.types';

const ExerciseName: FC<IExerciseNameProps> = ({ name }) => {
  const isMobile = useMobile();

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
