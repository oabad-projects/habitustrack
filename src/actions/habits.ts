"use server";

import { HabitType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { ActionState } from "@/actions/types";
import { requireUser } from "@/lib/auth";
import { fromIsoDate } from "@/lib/dates";
import { decimal, normalizeHabitFormData } from "@/lib/habits";
import { prisma } from "@/lib/prisma";
import { habitEntrySchema, habitSchema } from "@/lib/validations";

function revalidateHabitViews() {
  revalidatePath("/today");
  revalidatePath("/habits");
  revalidatePath("/progress");
}

export async function saveHabitAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const parsed = habitSchema.safeParse(normalizeHabitFormData(formData));

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "No se pudo guardar el hábito",
    };
  }

  const payload = {
    userId: user.id,
    name: parsed.data.name,
    type: parsed.data.type,
    unit: parsed.data.unit || null,
    targetValue: parsed.data.targetValue ? decimal(parsed.data.targetValue) : null,
    frequencyType: parsed.data.frequencyType,
    weekDays: parsed.data.frequencyType === "DAILY" ? [] : parsed.data.weekDays,
    isActive: parsed.data.isActive,
  };

  if (parsed.data.id) {
    const existingHabit = await prisma.habit.findFirst({
      where: { id: parsed.data.id, userId: user.id },
      select: { id: true },
    });

    if (!existingHabit) {
      return {
        success: false,
        message: "No se ha encontrado el hábito",
      };
    }

    await prisma.habit.update({
      where: { id: existingHabit.id },
      data: payload,
    });
  } else {
    await prisma.habit.create({
      data: payload,
    });
  }

  revalidateHabitViews();
  redirect("/habits");
}

export async function deleteHabitAction(formData: FormData) {
  const user = await requireUser();
  const habitId = String(formData.get("habitId") ?? "");

  if (!habitId) {
    return;
  }

  await prisma.habit.deleteMany({
    where: {
      id: habitId,
      userId: user.id,
    },
  });

  revalidateHabitViews();
}

export async function toggleHabitAction(formData: FormData) {
  const user = await requireUser();
  const habitId = String(formData.get("habitId") ?? "");
  const nextValue = String(formData.get("nextValue") ?? "false") === "true";

  await prisma.habit.updateMany({
    where: {
      id: habitId,
      userId: user.id,
    },
    data: {
      isActive: nextValue,
    },
  });

  revalidateHabitViews();
}

export async function saveTodayEntryAction(formData: FormData) {
  const user = await requireUser();
  const parsed = habitEntrySchema.safeParse({
    habitId: formData.get("habitId"),
    date: formData.get("date"),
    value: formData.get("value"),
  });

  if (!parsed.success) {
    return;
  }

  const habit = await prisma.habit.findFirst({
    where: {
      id: parsed.data.habitId,
      userId: user.id,
    },
    select: {
      id: true,
      type: true,
    },
  });

  if (!habit) {
    return;
  }

  const nextValue = habit.type === HabitType.CHECK ? (parsed.data.value >= 1 ? 1 : 0) : parsed.data.value;

  await prisma.habitEntry.upsert({
    where: {
      habitId_date: {
        habitId: habit.id,
        date: fromIsoDate(parsed.data.date),
      },
    },
    update: {
      value: decimal(nextValue),
    },
    create: {
      habitId: habit.id,
      date: fromIsoDate(parsed.data.date),
      value: decimal(nextValue),
    },
  });

  revalidateHabitViews();
}
