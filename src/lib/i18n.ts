import { enUS, es } from "date-fns/locale";
import type { NextRequest } from "next/server";

export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "es";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function resolveLocale(value: string | null | undefined): Locale {
  return value && isLocale(value) ? value : defaultLocale;
}

export function getPreferredLocale(request: NextRequest): Locale {
  const cookieLocale = request.cookies.get("habitustrack_locale")?.value;

  if (cookieLocale && isLocale(cookieLocale)) {
    return cookieLocale;
  }

  const header = request.headers.get("accept-language")?.toLowerCase() ?? "";
  return header.includes("en") ? "en" : defaultLocale;
}

export function localizePath(locale: Locale, path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${normalizedPath === "/" ? "" : normalizedPath}`;
}

export function stripLocaleFromPath(pathname: string) {
  const segments = pathname.split("/");
  const maybeLocale = segments[1];

  if (!isLocale(maybeLocale)) {
    return { locale: null, pathname };
  }

  const rest = `/${segments.slice(2).join("/")}`.replace(/\/+$/, "") || "/";
  return {
    locale: maybeLocale,
    pathname: rest === "" ? "/" : rest,
  };
}

export function getDateLocale(locale: Locale) {
  return locale === "en" ? enUS : es;
}

export function getNumberLocale(locale: Locale) {
  return locale === "en" ? "en-US" : "es-ES";
}

export function getLocaleFromFormData(formData: FormData): Locale {
  return resolveLocale(String(formData.get("locale") ?? defaultLocale));
}

type Dictionary = {
  meta: {
    title: string;
    description: string;
  };
  common: {
    appName: string;
    login: string;
    logout: string;
    register: string;
    getStarted: string;
    back: string;
    save: string;
    edit: string;
    delete: string;
    typeCheck: string;
    typeNumber: string;
    active: string;
    paused: string;
    noTarget: string;
    target: string;
    today: string;
    habits: string;
    progress: string;
    yourSpace: string;
    language: string;
    english: string;
    spanish: string;
  };
  home: {
    eyebrow: string;
    title: string;
    description: string;
    createAccount: string;
    alreadyHaveAccess: string;
    todayLabel: string;
    reading: string;
    readingStatus: string;
    pushups: string;
    pushupsStatus: string;
    progressTitle: string;
    progressDescription: string;
  };
  auth: {
    heroTitle: string;
    heroDescription: string;
    loginTitle: string;
    loginDescription: string;
    registerTitle: string;
    registerDescription: string;
    name: string;
    email: string;
    password: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    passwordPlaceholder: string;
    noAccount: string;
    haveAccount: string;
    signUp: string;
    signIn: string;
  };
  appShell: {
    title: string;
    description: string;
  };
  habitsPage: {
    eyebrow: string;
    title: string;
    description: string;
    newHabit: string;
    emptyTitle: string;
    emptyDescription: string;
    savedEntries: string;
    everyDay: string;
    weekdays: string[];
    deactivate: string;
    reactivate: string;
  };
  habitForm: {
    newEyebrow: string;
    newTitle: string;
    editEyebrow: string;
    name: string;
    namePlaceholder: string;
    type: string;
    frequency: string;
    everyDay: string;
    specificDays: string;
    unit: string;
    unitPlaceholder: string;
    targetOptional: string;
    keepActive: string;
    createHabit: string;
    saveChanges: string;
    weekdaysLabel: string;
  };
  todayPage: {
    eyebrow: string;
    title: string;
    descriptionPrefix: string;
    emptyTitle: string;
    emptyDescription: string;
    dueToday: string;
    markPending: string;
    markDone: string;
    noEntry: string;
    done: string;
    pending: string;
    saved: string;
    onDate: string;
  };
  progressPage: {
    eyebrow: string;
    title: string;
    description: string;
    emptyTitle: string;
    emptyDescription: string;
    completedDays: string;
    completion: string;
    streak: string;
    day: string;
    days: string;
    goal: string;
  };
  actionMessages: {
    accountCreateFailed: string;
    invalidCredentials: string;
    emailExists: string;
    habitSaveFailed: string;
    habitNotFound: string;
    authRequired: string;
    validEmail: string;
    passwordLength: string;
    passwordTooLong: string;
    habitNameRequired: string;
    weekDaysRequired: string;
    invalidWeekDays: string;
  };
};

export const dictionaries: Record<Locale, Dictionary> = {
  es: {
    meta: {
      title: "Habits App",
      description: "MVP de seguimiento de hábitos con Next.js, Prisma y PostgreSQL.",
    },
    common: {
      appName: "Habits App",
      login: "Iniciar sesión",
      logout: "Salir",
      register: "Crear cuenta",
      getStarted: "Empezar",
      back: "Volver",
      save: "Guardar",
      edit: "Editar",
      delete: "Eliminar",
      typeCheck: "Check",
      typeNumber: "Numérico",
      active: "Activo",
      paused: "Pausado",
      noTarget: "Sin objetivo",
      target: "Objetivo",
      today: "Hoy",
      habits: "Hábitos",
      progress: "Progreso",
      yourSpace: "Tu espacio",
      language: "Idioma",
      english: "English",
      spanish: "Español",
    },
    home: {
      eyebrow: "MVP de hábitos para uso diario",
      title: "Sigue tus hábitos sin convertirlo en otro gestor de tareas.",
      description: "Registra hoy, ajusta tus rutinas y mantén una visión semanal clara. Diseño simple, foco en rapidez y base preparada para SaaS.",
      createAccount: "Crear cuenta",
      alreadyHaveAccess: "Ya tengo acceso",
      todayLabel: "Hoy",
      reading: "Leer",
      readingStatus: "30 min · pendiente",
      pushups: "Flexiones",
      pushupsStatus: "50 reps · 32 registradas",
      progressTitle: "Semana al 78%",
      progressDescription: "Visualiza cumplimiento, días completados y rachas para seguir mejorando sin ruido.",
    },
    auth: {
      heroTitle: "Construye una rutina clara y sostenible.",
      heroDescription: "Un MVP centrado en lo esencial: qué toca hoy, qué has completado y cómo vas esta semana.",
      loginTitle: "Inicia sesión",
      loginDescription: "Accede a tus hábitos, registra tu día y revisa tu progreso semanal.",
      registerTitle: "Crea tu cuenta",
      registerDescription: "Empieza con una base simple: hábitos diarios, registro rápido y visibilidad de avance.",
      name: "Nombre",
      email: "Email",
      password: "Contraseña",
      namePlaceholder: "Tu nombre",
      emailPlaceholder: "tu@email.com",
      passwordPlaceholder: "••••••••",
      noAccount: "¿No tienes cuenta?",
      haveAccount: "¿Ya tienes cuenta?",
      signUp: "Regístrate",
      signIn: "Inicia sesión",
    },
    appShell: {
      title: "Tu panel de hábitos",
      description: "Gestiona tus hábitos, actualiza lo de hoy y revisa tu consistencia.",
    },
    habitsPage: {
      eyebrow: "Gestión",
      title: "Tus hábitos",
      description: "Crea, pausa, reactiva o edita tus hábitos desde un único lugar.",
      newHabit: "Nuevo hábito",
      emptyTitle: "Aún no hay hábitos creados",
      emptyDescription: "Empieza con uno sencillo para tener lista la pantalla “Hoy”.",
      savedEntries: "registros guardados",
      everyDay: "Cada día",
      weekdays: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
      deactivate: "Desactivar",
      reactivate: "Reactivar",
    },
    habitForm: {
      newEyebrow: "Nuevo hábito",
      newTitle: "Define una rutina clara",
      editEyebrow: "Editar hábito",
      name: "Nombre del hábito",
      namePlaceholder: "Ej. Leer 30 minutos",
      type: "Tipo",
      frequency: "Frecuencia",
      everyDay: "Todos los días",
      specificDays: "Días concretos",
      unit: "Unidad",
      unitPlaceholder: "min, km, reps",
      targetOptional: "Objetivo opcional",
      keepActive: "Mantener el hábito activo",
      createHabit: "Crear hábito",
      saveChanges: "Guardar cambios",
      weekdaysLabel: "Días de la semana",
    },
    todayPage: {
      eyebrow: "Pantalla principal",
      title: "Hoy toca avanzar",
      descriptionPrefix: "Registra el estado de cada hábito con el menor número de clics posible.",
      emptyTitle: "No hay hábitos para hoy",
      emptyDescription: "Crea un hábito nuevo o reactiva alguno pausado para verlo aquí.",
      dueToday: "Hoy",
      markPending: "Marcar pendiente",
      markDone: "Marcar hecho",
      noEntry: "Sin registrar",
      done: "Hecho",
      pending: "Pendiente",
      saved: "Guardar",
      onDate: "Hoy",
    },
    progressPage: {
      eyebrow: "Progreso semanal",
      title: "Consistencia visible",
      description: "Un resumen limpio por hábito con cumplimiento, días completados y racha actual.",
      emptyTitle: "Aún no hay progreso que mostrar",
      emptyDescription: "Empieza creando hábitos y registrando tu día para ver el resumen semanal.",
      completedDays: "días completados",
      completion: "cumplimiento",
      streak: "Racha actual",
      day: "día",
      days: "días",
      goal: "Objetivo",
    },
    actionMessages: {
      accountCreateFailed: "No se pudo crear la cuenta",
      invalidCredentials: "Credenciales inválidas",
      emailExists: "Ya existe una cuenta con ese email",
      habitSaveFailed: "No se pudo guardar el hábito",
      habitNotFound: "No se ha encontrado el hábito",
      authRequired: "Debes iniciar sesión",
      validEmail: "Introduce un email válido",
      passwordLength: "La contraseña debe tener al menos 8 caracteres",
      passwordTooLong: "La contraseña es demasiado larga",
      habitNameRequired: "El nombre es obligatorio",
      weekDaysRequired: "Selecciona al menos un día de la semana",
      invalidWeekDays: "Los días seleccionados no son válidos",
    },
  },
  en: {
    meta: {
      title: "Habits App",
      description: "Habit tracking MVP built with Next.js, Prisma, and PostgreSQL.",
    },
    common: {
      appName: "Habits App",
      login: "Log in",
      logout: "Log out",
      register: "Create account",
      getStarted: "Get started",
      back: "Back",
      save: "Save",
      edit: "Edit",
      delete: "Delete",
      typeCheck: "Check",
      typeNumber: "Numeric",
      active: "Active",
      paused: "Paused",
      noTarget: "No goal",
      target: "Goal",
      today: "Today",
      habits: "Habits",
      progress: "Progress",
      yourSpace: "Your space",
      language: "Language",
      english: "English",
      spanish: "Español",
    },
    home: {
      eyebrow: "Daily habits MVP",
      title: "Track your habits without turning it into another task manager.",
      description: "Log today, adjust your routines, and keep a clear weekly view. Simple design, fast interaction, SaaS-ready base.",
      createAccount: "Create account",
      alreadyHaveAccess: "I already have access",
      todayLabel: "Today",
      reading: "Reading",
      readingStatus: "30 min · pending",
      pushups: "Push-ups",
      pushupsStatus: "50 reps · 32 logged",
      progressTitle: "Week at 78%",
      progressDescription: "See completion, finished days, and streaks without extra noise.",
    },
    auth: {
      heroTitle: "Build a clear and sustainable routine.",
      heroDescription: "An MVP focused on essentials: what matters today, what you completed, and how your week is going.",
      loginTitle: "Log in",
      loginDescription: "Access your habits, log your day, and review weekly progress.",
      registerTitle: "Create your account",
      registerDescription: "Start simple: daily habits, quick logging, and clear visibility of progress.",
      name: "Name",
      email: "Email",
      password: "Password",
      namePlaceholder: "Your name",
      emailPlaceholder: "you@email.com",
      passwordPlaceholder: "••••••••",
      noAccount: "Don't have an account?",
      haveAccount: "Already have an account?",
      signUp: "Sign up",
      signIn: "Log in",
    },
    appShell: {
      title: "Your habits dashboard",
      description: "Manage your habits, update today, and review consistency.",
    },
    habitsPage: {
      eyebrow: "Management",
      title: "Your habits",
      description: "Create, pause, reactivate, or edit your habits from one place.",
      newHabit: "New habit",
      emptyTitle: "No habits created yet",
      emptyDescription: "Start with a simple one to make the Today screen useful.",
      savedEntries: "saved entries",
      everyDay: "Every day",
      weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      deactivate: "Deactivate",
      reactivate: "Reactivate",
    },
    habitForm: {
      newEyebrow: "New habit",
      newTitle: "Define a clear routine",
      editEyebrow: "Edit habit",
      name: "Habit name",
      namePlaceholder: "e.g. Read 30 minutes",
      type: "Type",
      frequency: "Frequency",
      everyDay: "Every day",
      specificDays: "Specific days",
      unit: "Unit",
      unitPlaceholder: "min, km, reps",
      targetOptional: "Optional goal",
      keepActive: "Keep this habit active",
      createHabit: "Create habit",
      saveChanges: "Save changes",
      weekdaysLabel: "Weekdays",
    },
    todayPage: {
      eyebrow: "Main screen",
      title: "Today is for making progress",
      descriptionPrefix: "Log each habit with as few clicks as possible.",
      emptyTitle: "No habits scheduled for today",
      emptyDescription: "Create a new habit or reactivate a paused one to see it here.",
      dueToday: "Today",
      markPending: "Mark as pending",
      markDone: "Mark as done",
      noEntry: "Not logged",
      done: "Done",
      pending: "Pending",
      saved: "Save",
      onDate: "Today",
    },
    progressPage: {
      eyebrow: "Weekly progress",
      title: "Visible consistency",
      description: "A clean summary per habit with completion, finished days, and current streak.",
      emptyTitle: "No progress to show yet",
      emptyDescription: "Start by creating habits and logging your day to see the weekly summary.",
      completedDays: "completed days",
      completion: "completion",
      streak: "Current streak",
      day: "day",
      days: "days",
      goal: "Goal",
    },
    actionMessages: {
      accountCreateFailed: "Could not create the account",
      invalidCredentials: "Invalid credentials",
      emailExists: "An account with that email already exists",
      habitSaveFailed: "Could not save the habit",
      habitNotFound: "Habit not found",
      authRequired: "You must log in",
      validEmail: "Enter a valid email",
      passwordLength: "Password must be at least 8 characters",
      passwordTooLong: "Password is too long",
      habitNameRequired: "Name is required",
      weekDaysRequired: "Select at least one weekday",
      invalidWeekDays: "Selected weekdays are invalid",
    },
  },
};

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
