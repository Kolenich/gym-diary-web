import moment from 'moment';

export const SERVER_RESPONSES: Record<number, string> = {
  200: 'Сохранение прошло успешно!',
  201: 'Создание прошло успешно!',
  204: 'Удаление прошло успешно!',
  400: 'Некорректное тело запроса',
  401: 'Вы не авторизованы',
  403: 'У вас нет доступа',
  404: 'Запрашиваемый адрес не найден',
  405: 'Данный метод запроса не разрешен',
  413: 'Загружаемый файл не должен превышать 16 Мб',
  500: 'Внутренняя ошибка сервера',
  502: 'Время ожидания ответа от сервера истекло',
};

export const SERVER_NOT_AVAILABLE = 'Сервер не доступен, попробуйте позже';

export const TODAY = moment();

export const DJANGO_TIME_FORMAT = 'HH:mm';
export const DJANGO_DATE_FORMAT = 'yyyy-MM-DD';
export const DATE_DISPLAY_FORMAT = 'DD.MM.yyyy';
export const TIME_DISPLAY_FORMAT = 'HH:mm';

/**
 * Amount of days of week be displayed
 * @type {number}
 */
export const WORKOUT_DAYS = 6;
