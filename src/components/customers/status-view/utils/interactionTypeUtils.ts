import type { InteractionType } from "../../types";

export function isValidInteractionType(type: string): type is InteractionType {
  return ["call", "email", "meeting", "other"].includes(type.toLowerCase());
}

export function getValidInteractionType(type: string): InteractionType {
  const normalizedType = type.toLowerCase();
  if (isValidInteractionType(normalizedType)) {
    return normalizedType as InteractionType;
  }
  return "other";
}