import { type FC } from 'react';

import { useNavigate } from 'react-router-dom';

import { useGetWorkouts } from 'api/workouts';

const WeeksSchedule: FC = () => {
  const { data: workouts = [] } = useGetWorkouts({});

  const navigate = useNavigate();

  return (
    <div>
      Тренировки:
      {workouts.map(workout => {
        const goToWorkout = (): void => {
          navigate(workout.id);
        };

        return (
          <div key={workout.id}>
            <pre onClick={goToWorkout}>{JSON.stringify(workout, null, 2)}</pre>
          </div>
        );
      })}
    </div>
  );
};

export default WeeksSchedule;
