import { type FC } from 'react';

import { useParams } from 'react-router-dom';

import { type IExercise, useGetExercises, useGetWorkout } from 'api/workouts';

const WorkoutModal: FC = () => {
  const { workoutId = '' } = useParams();

  const { data: workout } = useGetWorkout(+workoutId, {
    skip: !workoutId,
  });

  const { data: exercises = [] } = useGetExercises(
    { workout_id: workout?.id as IExercise['workout_id'] },
    { skip: !workout },
  );

  return (
    <div>
      Тренировка: <pre>{JSON.stringify(workout, null, 2)}</pre>
      Упражнения:
      {exercises.map(exercise => (
        <div key={exercise.id}>
          <pre>{JSON.stringify(exercise, null, 2)}</pre>
        </div>
      ))}
    </div>
  );
};

export default WorkoutModal;
