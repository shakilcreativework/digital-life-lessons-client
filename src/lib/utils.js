
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

// utility function for conditional and merged Tailwind classes
export const cn = (...inputs) => {
    return twMerge(clsx(inputs));
};