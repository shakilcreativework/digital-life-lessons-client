"use client";

/* -------------------------------------------------------------------------- */
/*                               Theme Switcher                               */
/* -------------------------------------------------------------------------- */
/*
  This component handles light and dark mode switching.

  Features:
  - Uses next-themes for theme management
  - Prevents hydration mismatch in Next.js
  - Shows Sun icon in light mode
  - Shows Moon icon in dark mode
  - Minimal clean styling without animation classes

  Beginner Note:
  Hydration mismatch happens when server-rendered HTML
  is different from client-rendered HTML. Because theme
  values are only available on the client, we wait until
  the component mounts before rendering.
*/

import { useTheme } from "next-themes";

/* -------------------------------------------------------------------------- */
/*                                  Icons                                     */
/* -------------------------------------------------------------------------- */

import { AiFillSun } from "react-icons/ai";
import { RxMoon } from "react-icons/rx";

/* -------------------------------------------------------------------------- */
/*                                Custom Hook                                 */
/* -------------------------------------------------------------------------- */
/*
  useMounted() returns true only after the component
  is mounted on the client side.
*/

import { useMounted } from "@/hooks/useMounted";

export function ThemeSwitch() {
  /* ------------------------------------------------------------------------ */
  /*                         Client Mount Protection                          */
  /* ------------------------------------------------------------------------ */
  /*
    Prevent rendering before client mount.
    This avoids hydration errors with next-themes.
  */

  const mounted = useMounted();

  /* ------------------------------------------------------------------------ */
  /*                             Theme Management                             */
  /* ------------------------------------------------------------------------ */
  /*
    resolvedTheme:
    Returns the active theme ("light" or "dark")

    setTheme():
    Updates the current theme
  */

  const { resolvedTheme, setTheme } = useTheme();

  /* ------------------------------------------------------------------------ */
  /*                         Hydration Safety Check                           */
  /* ------------------------------------------------------------------------ */

  if (!mounted) return null;

  /* ------------------------------------------------------------------------ */
  /*                              Theme State                                 */
  /* ------------------------------------------------------------------------ */

  const isDark = resolvedTheme === "dark";

  /* ------------------------------------------------------------------------ */
  /*                             Toggle Function                              */
  /* ------------------------------------------------------------------------ */
  /*
    If current theme is dark:
    -> switch to light

    Otherwise:
    -> switch to dark
  */

  const handleThemeToggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  /* ------------------------------------------------------------------------ */
  /*                                 Render                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <button
      aria-label="Toggle Theme"
      onClick={handleThemeToggle}
      className="
        flex
        items-center
        justify-center
        gap-1
        w-10
        h-10
        p-2
        rounded-full
        text-muted
        hover:bg-card
        hover:text-nav-icon-hover
      "
    >
      {isDark ? (
        <RxMoon className="text-lg" />
      ) : (
        <AiFillSun className="text-lg" />
      )}
    </button>
  );
}