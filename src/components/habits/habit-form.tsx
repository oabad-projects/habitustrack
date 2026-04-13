"use client";

import { HabitFrequencyType, HabitType } from "@prisma/client";
import { useActionState, useState } from "react";

import type { ActionState } from "@/actions/types";
import { FormMessage } from "@/components/forms/form-message";
import { SubmitButton } from "@/components/forms/submit-button";
import { WEEKDAY_OPTIONS } from "@/lib/dates";

type HabitFormProps = {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  initialValues?: {
    id?: string;
    name?: string;
    type?: HabitType;
    unit?: string | null;
    targetValue?: string | null;
    frequencyType?: HabitFrequencyType;
    weekDays?: number[];
    isActive?: boolean;
  };
};

const initialState: ActionState = {
  success: false,
  message: "",
};

export function HabitForm({ action, initialValues }: HabitFormProps) {
  const [state, formAction] = useActionState(action, initialState);
  const [type, setType] = useState(initialValues?.type ?? HabitType.CHECK);
  const [frequencyType, setFrequencyType] = useState(initialValues?.frequencyType ?? HabitFrequencyType.DAILY);

  return (
    <form action={formAction} className="space-y-6 rounded-[2rem] border border-black/5 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
      {initialValues?.id ? <input type="hidden" name="id" value={initialValues.id} /> : null}

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="name" className="text-sm font-medium text-[var(--color-ink)]">
            Nombre del hábito
          </label>
          <input
            id="name"
            name="name"
            defaultValue={initialValues?.name ?? ""}
            placeholder="Ej. Leer 30 minutos"
            className="field"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="type" className="text-sm font-medium text-[var(--color-ink)]">
            Tipo
          </label>
          <select
            id="type"
            name="type"
            defaultValue={type}
            onChange={(event) => setType(event.target.value as HabitType)}
            className="field"
          >
            <option value={HabitType.CHECK}>Check</option>
            <option value={HabitType.NUMBER}>Numérico</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="frequencyType" className="text-sm font-medium text-[var(--color-ink)]">
            Frecuencia
          </label>
          <select
            id="frequencyType"
            name="frequencyType"
            defaultValue={frequencyType}
            onChange={(event) => setFrequencyType(event.target.value as HabitFrequencyType)}
            className="field"
          >
            <option value={HabitFrequencyType.DAILY}>Todos los días</option>
            <option value={HabitFrequencyType.WEEKLY_DAYS}>Días concretos</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="unit" className="text-sm font-medium text-[var(--color-ink)]">
            Unidad
          </label>
          <input id="unit" name="unit" defaultValue={initialValues?.unit ?? ""} placeholder="min, km, reps" className="field" />
        </div>

        <div className="space-y-2">
          <label htmlFor="targetValue" className="text-sm font-medium text-[var(--color-ink)]">
            Objetivo opcional
          </label>
          <input
            id="targetValue"
            name="targetValue"
            type="number"
            min="0"
            step={type === HabitType.NUMBER ? "0.01" : "1"}
            defaultValue={initialValues?.targetValue ?? ""}
            placeholder={type === HabitType.CHECK ? "1" : "30"}
            className="field"
          />
        </div>
      </div>

      {frequencyType === HabitFrequencyType.WEEKLY_DAYS ? (
        <div className="space-y-3">
          <span className="text-sm font-medium text-[var(--color-ink)]">Días de la semana</span>
          <div className="flex flex-wrap gap-2">
            {WEEKDAY_OPTIONS.map((day) => (
              <label
                key={day.value}
                className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm text-[var(--color-ink)]"
              >
                <input
                  type="checkbox"
                  name="weekDays"
                  value={day.value}
                  defaultChecked={initialValues?.weekDays?.includes(day.value)}
                  className="size-4 rounded border-black/20"
                />
                {day.label}
              </label>
            ))}
          </div>
        </div>
      ) : null}

      <label className="flex items-center gap-3 rounded-2xl bg-[var(--color-sand)] px-4 py-3 text-sm text-[var(--color-ink)]">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={initialValues?.isActive ?? true}
          className="size-4 rounded border-black/20"
        />
        Mantener el hábito activo
      </label>

      <FormMessage message={state.message} success={state.success} />

      <div className="flex flex-col gap-3 sm:flex-row">
        <SubmitButton>{initialValues?.id ? "Guardar cambios" : "Crear hábito"}</SubmitButton>
      </div>
    </form>
  );
}
