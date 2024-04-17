import { type FC } from 'react';

import { useGetWorkouts } from 'api/workouts';
import { useWebsocket } from 'hooks/use-websocket';
import { useAppSelector } from 'store/hooks';
import { selectWeekWorkoutsParams } from 'store/week';

import { EWorkoutActions } from './WorkoutWebsocketHandler.constants';
import { type IWorkoutWebsocketMessage } from './WorkoutWebsocketHandler.types';

const WorkoutWebsocketHandler: FC = () => {
  const weekWorkoutsParams = useAppSelector(selectWeekWorkoutsParams);

  const { refetch } = useGetWorkouts(weekWorkoutsParams);

  useWebsocket('workout', data => {
    const { action } = JSON.parse(data.data) as IWorkoutWebsocketMessage;

    switch (action) {
      case EWorkoutActions.RefetchList:
        refetch();
        break;
      default:
        break;
    }
  });

  return null;
};

export default WorkoutWebsocketHandler;
