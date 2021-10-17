import { PartialBy, Workout } from 'context/types';
import { RouteComponentProps } from 'react-router-dom';

export type Props = RouteComponentProps<{ id: string }>;

export interface State {
  workout: PartialBy<Workout, 'date'>;
  errors: FormErrors;
  loading: boolean;
}

export interface FormErrors {
  date: string | null;
  start: string | null;
  end: string | null;
}
