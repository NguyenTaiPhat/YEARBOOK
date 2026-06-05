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
  { bg: "#E8F5E9", border: "#90C090" },
  { bg: "#E3F2FD", border: "#90B8D0" },
  { bg: "#F3E5F5", border: "#C090C0" },
  { bg: "#FFF8F1", border: "#E7D3BE" },
];

// Placeholder images from Unsplash for demo
export const PLACEHOLDER_PHOTOS = [
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80",
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&q=80",
  "https://images.unsplash.com/photo-1627556704302-624286467c65?w=600&q=80",
  "https://images.unsplash.com/photo-1582561424760-0321d75e81fa?w=600&q=80",
  "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80",
  "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=600&q=80",
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80",
  "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&q=80",
  "https://images.unsplash.com/photo-1588072432904-823af1e7ac1f?w=600&q=80",
  "https://images.unsplash.com/photo-1491841573634-28140fc7ced7?w=600&q=80",
  "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80",
];
