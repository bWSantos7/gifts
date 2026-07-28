import { cn } from "@/lib/utils";
import type { InputHTMLAttributes, TextareaHTMLAttributes, LabelHTMLAttributes } from "react";

const fieldClasses =
  "w-full rounded-lg border border-wine-100 bg-white px-4 py-2.5 text-ink placeholder:text-ink/40 focus:border-wine-500 focus:outline-none focus:ring-2 focus:ring-wine-500/20 transition-colors";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props;
  return <input className={cn(fieldClasses, className)} {...rest} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className, ...rest } = props;
  return <textarea className={cn(fieldClasses, className)} {...rest} />;
}

export function Label(props: LabelHTMLAttributes<HTMLLabelElement>) {
  const { className, ...rest } = props;
  return (
    <label
      className={cn("block text-sm font-medium text-ink/80 mb-1.5", className)}
      {...rest}
    />
  );
}
