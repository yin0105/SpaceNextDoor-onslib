import { DAY_PER_MONTH } from '../../../configs';

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const dayJSTimezone = require('dayjs/plugin/timezone');
const advancedFormat = require('dayjs/plugin/advancedFormat');
dayjs.extend(utc);
dayjs.extend(dayJSTimezone);
dayjs.extend(advancedFormat);

export const calculatePrepayMonth = (params: {
  isPrepaid?: boolean;
  prepaidMonths?: number;
  moveInDate: Date | string;
  moveOutDate?: Date | string;
}): number => {
  const {
    isPrepaid = false,
    prepaidMonths = 1,
    moveInDate,
    moveOutDate,
  } = params;
  const parsedMoveInDate = dayjs.utc(moveInDate);
  const parsedMoveOutDate = dayjs.utc(moveOutDate);

  // Without move out date.
  if (!moveOutDate && isPrepaid) {
    return prepaidMonths > 0 ? prepaidMonths : 1;
  }

  // With move out date.
  const differenceInDays = parsedMoveOutDate.diff(parsedMoveInDate, 'day') + 1;
  const differenceInMonths = parsedMoveOutDate.diff(parsedMoveInDate, 'month');

  return differenceInDays <= DAY_PER_MONTH || !isPrepaid
    ? 1
    : prepaidMonths <= differenceInMonths
    ? prepaidMonths
    : differenceInMonths;
};
