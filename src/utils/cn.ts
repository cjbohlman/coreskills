import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for merging tailwind classes and handling conditional classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}