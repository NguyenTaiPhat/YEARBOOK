import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateVisitorId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  const stored = localStorage.getItem("yearbook_visitor_id");
  if (stored) return stored;
  const newId = generateVisitorId();
  localStorage.setItem("yearbook_visitor_id", newId);
  return newId;
}

export function hasCompletedOnboarding(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("yearbook_onboarded") === "true";
}

export function markOnboardingComplete(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("yearbook_onboarded", "true");
}

export function getStoredProfile() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("yearbook_profile");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function storeProfile(profile: {
  name: string;
  avatar_url: string | null;
  memory_message: string | null;
}) {
  if (typeof window === "undefined") return;
  localStorage.setItem("yearbook_profile", JSON.stringify(profile));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function randomRotation(range = 5): number {
  return randomBetween(-range, range);
}

export const SIGNATURE_COLORS = [
  "#3B3028",
  "#7B6A5A",
  "#B89367",
  "#8B6340",
  "#4A6741",
  "#4A5F7B",
  "#7B4A4A",
  "#4A4A7B",
];

export const STICKY_COLORS = [
  { bg: "#FFF9C4", border: "#F0D060" },
  { bg: "#FFE4CC", border: "#F0B070" },
  { bg: "#F8BBD0", border: "#E090A8" },
  { bg: "#E8F5E9", border: "#90C090" },
  { bg: "#E3F2FD", border: "#90B8D0" },
  { bg: "#F3E5F5", border: "#C090C0" },
  { bg: "#FFF8F1", border: "#E7D3BE" },
  { bg: "#FFE5EC", border: "#D8A2B2" },
  { bg: "#D1C4E9", border: "#A78FC1" },
  { bg: "#C8E6C9", border: "#88B37D" },
  { bg: "#FFF3E0", border: "#E1B36F" },
  { bg: "#E1F5FE", border: "#8AC2DC" },
];
