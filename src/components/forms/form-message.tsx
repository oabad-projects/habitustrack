import { cn } from "@/lib/utils";

type FormMessageProps = {
  message?: string;
  success?: boolean;
};

export function FormMessage({ message, success = false }: FormMessageProps) {
  if (!message) {
    return null;
  }

  return (
    <p
      className={cn(
        "rounded-2xl border px-4 py-3 text-sm",
        success
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-rose-200 bg-rose-50 text-rose-700",
      )}
    >
      {message}
    </p>
  );
}
