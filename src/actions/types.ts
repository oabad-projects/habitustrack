"use server";

export type ActionState = {
  success: boolean;
  message: string;
};

export const idleActionState: ActionState = {
  success: false,
  message: "",
};
