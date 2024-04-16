import { type IExercise } from 'api/workouts';

import { type EExercisesAction } from './ExerciseList.constants';

export interface IExerciseListProps {
  exercises: IExercise[];
  onExerciseChange: (exercise: IExercise, action: EExercisesAction) => void;
}
