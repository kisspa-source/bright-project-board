import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
