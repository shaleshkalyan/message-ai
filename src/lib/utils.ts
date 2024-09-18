import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const status = {
  'primary': '#1E90FF',
  'secondary': '#FF6347',
  'success': '#28a745',
  'danger': '#dc3545',
  'warning': '#ffc107',
}
