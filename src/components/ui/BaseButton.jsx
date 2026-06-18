"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";

const BaseButton = ({
  children,
  text,
  className,

  onClick,
  disabled = false,
  loading = false,
  type = "button",

  as = "button",
  href,

  variant = "primary",
  size = "md",

  leftIcon,
  rightIcon,

  animated = false,
  animatedSpanOne,
  animatedSpanTwo,
}) => {
  const variants = {
    primary:
      "bg-linear-to-r from-orange-400 to-red-500 text-white",

    outline:
      "border border-orange-400 text-orange-500 hover:bg-orange-50",

    ghost:
      "text-gray-700 hover:bg-gray-100",

    danger:
      "bg-red-500 text-white hover:bg-red-600",

    custom: "",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm rounded-full",
    md: "px-5 py-2.5 text-base rounded-full",
    lg: "px-6 py-3 text-lg rounded-full",
  };

  const baseStyles = cn(
    "relative inline-flex items-center justify-center",
    "font-medium whitespace-nowrap overflow-hidden",
    "transition-all duration-300 ease-in-out",
    "hover:scale-105 active:scale-95",
    "gap-2.5 cursor-pointer",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    variants[variant],
    sizes[size],
    className
  );

  const animationLayer = animated && (
    <>
      <span
        className={cn(
          "absolute inset-0 rounded-full bg-orange-300 opacity-30 animate-bounce",
          animatedSpanOne
        )}
      />
      <span
        className={cn(
          "absolute inset-0 rounded-full bg-orange-400 opacity-20 blur-lg scale-110",
          animatedSpanTwo
        )}
      />
    </>
  );

  const content = (
    <>
      {animationLayer}

      <span className="relative z-10 flex items-center gap-2">
        {loading ? (
          <span className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          leftIcon
        )}

        {children || text}

        {!loading && rightIcon}
      </span>
    </>
  );

  if (as === "link" && href) {
    return (
      <Link href={href} className={baseStyles} onClick={onClick}>
        {content}
      </Link>
    );
  }

  if (as === "a" && href) {
    return (
      <a
        href={href}
        className={baseStyles}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={disabled || loading ? undefined : onClick}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      className={baseStyles}
    >
      {content}
    </button>
  );
};

export default BaseButton;