import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function round(num: number) {
  if (Number.isInteger(num)) return num
  return parseFloat(num.toFixed(2))
}
