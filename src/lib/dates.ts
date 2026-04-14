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

export const WEEKDAY_OPTIONS = [
  { value: 1, label: "Lun" },
  { value: 2, label: "Mar" },
  { value: 3, label: "Mié" },
  { value: 4, label: "Jue" },
  { value: 5, label: "Vie" },
  { value: 6, label: "Sáb" },
  { value: 0, label: "Dom" },
] as const;

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

export function getWeekRange(baseDate = new Date()) {
  const start = startOfWeek(baseDate, { weekStartsOn: 1 });
  const end = endOfWeek(baseDate, { weekStartsOn: 1 });

  return {
    start,
    end,
    days: eachDayOfInterval({ start, end }),
  };
}

export function getMonthRange(baseDate = new Date()) {
  const monthStart = startOfMonth(baseDate);
  const monthEnd = endOfMonth(baseDate);
  const start = startOfWeek(monthStart, { weekStartsOn: 1 });
  const end = endOfWeek(monthEnd, { weekStartsOn: 1 });

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
