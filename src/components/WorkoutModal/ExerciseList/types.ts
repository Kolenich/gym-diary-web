import { Exercise } from 'context/types';

export interface Props {
  exercises: Exercise[];
  onExerciseChange: (exercise: Exercise, action: 'add' | 'delete' | 'update') => void;
}
