import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "outline" | "ghost";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-wine-500 text-white hover:bg-wine-700 border border-transparent shadow-sm hover:shadow-md",
  outline:
    "bg-transparent text-wine-500 border border-wine-500 hover:bg-wine-50",
  ghost: "bg-transparent text-wine-500 border border-transparent hover:bg-wine-50",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium tracking-wide transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none";

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button className={cn(baseClasses, variantClasses[variant], className)} {...props} />
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  className,
  children,
  target,
}: {
  href: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
  target?: string;
}) {
  return (
    <Link
      href={href}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      className={cn(baseClasses, variantClasses[variant], className)}
    >
      {children}
    </Link>
  );
}
