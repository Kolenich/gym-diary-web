import { Set } from 'context/types';

export interface Props {
  sets: Set[];
  onSetChange: (set: Set, action: 'add' | 'delete' | 'update') => void;
}
