"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { clearSession, createSession, hashPassword, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { authSchema } from "@/lib/validations";

import type { ActionState } from "@/actions/types";

export async function registerAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = authSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "No se pudo crear la cuenta",
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    select: { id: true },
  });

  if (existingUser) {
    return {
      success: false,
      message: "Ya existe una cuenta con ese email",
    };
  }

  const user = await prisma.user.create({
    data: {
      name: parsed.data.name || null,
      email: parsed.data.email,
      passwordHash: await hashPassword(parsed.data.password),
    },
  });

  await createSession(user.id, user.email);
  revalidatePath("/");
  redirect("/today");
}

export async function loginAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = authSchema.omit({ name: true }).safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Credenciales inválidas",
    };
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (!user) {
    return {
      success: false,
      message: "Credenciales inválidas",
    };
  }

  const isValid = await verifyPassword(parsed.data.password, user.passwordHash);

  if (!isValid) {
    return {
      success: false,
      message: "Credenciales inválidas",
    };
  }

  await createSession(user.id, user.email);
  revalidatePath("/");
  redirect("/today");
}

export async function logoutAction() {
  await clearSession();
  redirect("/login");
}
