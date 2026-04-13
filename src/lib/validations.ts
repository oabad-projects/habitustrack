import { HabitFrequencyType, HabitType } from "@prisma/client";
import { z } from "zod";

import { WEEKDAY_OPTIONS } from "@/lib/dates";

const weekdayValues = WEEKDAY_OPTIONS.map((option) => option.value);

export const authSchema = z.object({
  name: z.string().trim().max(80).optional().or(z.literal("")),
  email: z.email("Introduce un email válido").trim().toLowerCase(),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(128, "La contraseña es demasiado larga"),
});

export const habitSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().trim().min(2, "El nombre es obligatorio").max(80),
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
          message: "Selecciona al menos un día de la semana",
        });
      }

      if (!value.weekDays.every((day) => weekdayValues.some((weekday) => weekday === day))) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["weekDays"],
          message: "Los días seleccionados no son válidos",
        });
      }
    }
  });

export const habitEntrySchema = z.object({
  habitId: z.string().min(1),
  date: z.string().min(1),
  value: z.coerce.number().min(0).max(100000),
});

export type HabitFormValues = z.infer<typeof habitSchema>;
export type AuthFormValues = z.infer<typeof authSchema>;
