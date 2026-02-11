import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getMDQSeverity(responses: any): string {
  if (!responses || !responses.mdq) return "Negative";

  const mdq = responses.mdq;

  // Part 1: Symptoms count
  let symptomCount = 0;
  for (let i = 1; i <= 13; i++) {
    if (mdq[`mdq${i}`] === "yes") {
      symptomCount++;
    }
  }

  // Part 2: Co-occurrence
  const coOccurrence = mdq.cooccurrence === "yes";

  // Part 3: Impact (Moderate or Serious)
  // "2" = Moderate Problem, "3" = Serious Problem
  const impact = mdq.impact === "2" || mdq.impact === "3";

  // Positive Screen: 7+ symptoms AND Co-occurrence AND Moderate/Serious Impact
  if (symptomCount >= 7 && coOccurrence && impact) {
    return "Positive";
  }

  return "Negative";
}
