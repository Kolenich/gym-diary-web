import { ContextValue, Workout } from 'context/types';

export interface Props {
  context?: ContextValue;
}

export interface State {
  workout: Workout
  errors: FormErrors;
}

export interface FormErrors {
  date: string | null;
  start: string | null;
  end: string | null;
}
