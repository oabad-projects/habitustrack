"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { clearSession, createSession, hashPassword, verifyPassword } from "@/lib/auth";
import { getDictionary, getLocaleFromFormData, localizePath } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import { createAuthSchema } from "@/lib/validations";

import type { ActionState } from "@/actions/types";

export async function registerAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const locale = getLocaleFromFormData(formData);
  const dictionary = getDictionary(locale);
  const parsed = createAuthSchema(locale).safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? dictionary.actionMessages.accountCreateFailed,
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    select: { id: true },
  });

  if (existingUser) {
    return {
      success: false,
      message: dictionary.actionMessages.emailExists,
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
  revalidatePath(localizePath(locale, "/"));
  redirect(localizePath(locale, "/today"));
}

export async function loginAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const locale = getLocaleFromFormData(formData);
  const dictionary = getDictionary(locale);
  const parsed = createAuthSchema(locale).omit({ name: true }).safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? dictionary.actionMessages.invalidCredentials,
    };
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (!user) {
    return {
      success: false,
      message: dictionary.actionMessages.invalidCredentials,
    };
  }

  const isValid = await verifyPassword(parsed.data.password, user.passwordHash);

  if (!isValid) {
    return {
      success: false,
      message: dictionary.actionMessages.invalidCredentials,
    };
  }

  await createSession(user.id, user.email);
  revalidatePath(localizePath(locale, "/"));
  redirect(localizePath(locale, "/today"));
}

export async function logoutAction(formData: FormData) {
  const locale = getLocaleFromFormData(formData);
  await clearSession();
  redirect(localizePath(locale, "/login"));
}
