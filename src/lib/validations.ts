import { HabitFrequencyType, HabitType } from "@prisma/client";
import { z } from "zod";

import { WEEKDAY_VALUES } from "@/lib/dates";
import { getDictionary, type Locale } from "@/lib/i18n";

const weekdayValues = [...WEEKDAY_VALUES];

export function createAuthSchema(locale: Locale) {
  const dictionary = getDictionary(locale);

  return z.object({
    name: z.string().trim().max(80).optional().or(z.literal("")),
    email: z.email(dictionary.actionMessages.validEmail).trim().toLowerCase(),
    password: z
      .string()
      .min(8, dictionary.actionMessages.passwordLength)
      .max(128, dictionary.actionMessages.passwordTooLong),
  });
}

export function createHabitSchema(locale: Locale) {
  const dictionary = getDictionary(locale);

  return z
    .object({
      id: z.string().optional(),
      name: z.string().trim().min(2, dictionary.actionMessages.habitNameRequired).max(80),
      type: z.enum(HabitType),
      unit: z.string().trim().max(16).optional().or(z.literal("")),
      targetValue: z.coerce.number().positive().max(100000).optional(),
      frequencyType: z.enum(HabitFrequencyType),
      weekDays: z.array(z.coerce.number().int()).default([]),
      isActive: z.boolean().default(true),
    })
    .superRefine((value, ctx) => {
      if (value.frequencyType === HabitFrequencyType.WEEKLY_DAYS) {
        if (value.weekDays.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["weekDays"],
            message: dictionary.actionMessages.weekDaysRequired,
          });
        }

        if (!value.weekDays.every((day) => weekdayValues.some((weekday) => weekday === day))) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["weekDays"],
            message: dictionary.actionMessages.invalidWeekDays,
          });
        }
      }
    });
}

export const habitEntrySchema = z.object({
  habitId: z.string().min(1),
  date: z.string().min(1),
  value: z.coerce.number().min(0).max(100000),
});

export type HabitFormValues = z.infer<ReturnType<typeof createHabitSchema>>;
export type AuthFormValues = z.infer<ReturnType<typeof createAuthSchema>>;
