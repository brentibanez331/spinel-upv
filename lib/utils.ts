import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export function formattedSourceText(inputText: string){
  return inputText
    .replace(/\n+/g, " ") // replace multiple consecutive new lines with single space
    .replace(/(\w) - (\w)/g, "$1$2") // join hyphenated words together
    .replace(/\s+/g, " ") //replace multiple consecutive spaces
}

export function delay(seconds: number) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}