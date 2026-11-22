import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const localeDir = (locale: string) => (locale === "ar" ? "rtl" : "ltr");

export const formatNumber = (value: number, locale: string) =>
  new Intl.NumberFormat(locale === "ar" ? "ar-u-nu-latn" : "en-US").format(value);