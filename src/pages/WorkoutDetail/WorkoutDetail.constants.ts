import moment from 'moment';

import { DJANGO_TIME_FORMAT } from 'constants/datetime';

export const SAVE = 'Сохранить';
export const CANCEL = 'Отмена';
export const CLEAR = 'Очистить';
export const NOW = 'Сейчас';
export const ADD_WORKOUT = 'Добавить тренировку';
export const EDIT_WORKOUT = 'Редактировать тренировку';
export const INTERVAL = 'Интервал';
export const WORKOUT_START = 'Начало тренировки';
export const WORKOUT_END = 'Конец тренировки';

export const DEFAULT_WORKOUT = {
  start: moment().format(DJANGO_TIME_FORMAT),
  end: moment().add(1, 'hours').add(30, 'minutes').format(DJANGO_TIME_FORMAT),
  exercises: [],
  date: null,
};
