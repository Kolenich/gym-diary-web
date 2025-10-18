import { type IWorkout } from 'store/api';

export type TFormValues = Omit<IWorkout, 'id'>;
