import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";

export const WEEKDAY_VALUES = [1, 2, 3, 4, 5, 6, 0] as const;

type RangeOptions = {
  weekStartsOn?: 0 | 1;
};

export function toDateOnly(date: Date) {
  return startOfDay(date);
}

export function toIsoDate(date: Date) {
  return format(date, "yyyy-MM-dd");
}

export function fromIsoDate(date: string) {
  return startOfDay(parseISO(`${date}T00:00:00`));
}

export function getToday() {
  return startOfDay(new Date());
}

export function getWeekRange(baseDate = new Date(), options: RangeOptions = {}) {
  const weekStartsOn = options.weekStartsOn ?? 1;
  const start = startOfWeek(baseDate, { weekStartsOn });
  const end = endOfWeek(baseDate, { weekStartsOn });

  return {
    start,
    end,
    days: eachDayOfInterval({ start, end }),
  };
}

export function getMonthRange(baseDate = new Date(), options: RangeOptions = {}) {
  const weekStartsOn = options.weekStartsOn ?? 1;
  const monthStart = startOfMonth(baseDate);
  const monthEnd = endOfMonth(baseDate);
  const start = startOfWeek(monthStart, { weekStartsOn });
  const end = endOfWeek(monthEnd, { weekStartsOn });

  return {
    monthStart,
    monthEnd,
    start,
    end,
    days: eachDayOfInterval({ start, end }),
  };
}

export function shiftMonth(baseDate: Date, amount: number) {
  return addMonths(baseDate, amount);
}

export function getWeekday(date: Date) {
  return date.getDay();
}

export function isToday(date: Date) {
  return isSameDay(date, new Date());
}

export function nextSevenDays() {
  const today = getToday();
  return eachDayOfInterval({ start: today, end: addDays(today, 6) });
}
