"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { hasCompletedOnboarding, getStoredProfile } from "@/lib/utils";

import { OnboardingScreen } from "@/components/sections/OnboardingScreen";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { LetterSection } from "@/components/sections/LetterSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { MemoryWall } from "@/components/sections/MemoryWall";
import { SignatureWall } from "@/components/sections/SignatureWall";
import { ContributorsSection } from "@/components/sections/ContributorsSection";
import { FinalSection } from "@/components/sections/FinalSection";

export default function Home() {
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [profile, setProfile] = useState<{
    name: string;
    avatar_url: string | null;
    memory_message: string | null;
  } | null>(null);

  useEffect(() => {
    // Check if user has completed onboarding
    const done = hasCompletedOnboarding();
    if (done) {
      const stored = getStoredProfile();
      setProfile(stored);
    }
    setShowOnboarding(!done);
  }, []);

  const handleOnboardingComplete = (p: {
    name: string;
    avatar_url: string | null;
    memory_message: string | null;
  }) => {
    setProfile(p);
    setShowOnboarding(false);
  };

  const handleProfileEditorOpen = () => setShowProfileEditor(true);
  const handleProfileEditorClose = () => setShowProfileEditor(false);
  const handleProfileUpdated = (p: {
    name: string;
    avatar_url: string | null;
    memory_message: string | null;
  }) => {
    setProfile(p);
    setShowProfileEditor(false);
  };

  // Don't render until we know onboarding status (prevents flash)
  if (showOnboarding === null) {
    return (
      <div className="fixed inset-0 bg-[#1B1815] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--soft-gold)] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <main>
      {/* Onboarding overlay */}
      <AnimatePresence>
        {showOnboarding && (
          <OnboardingScreen onComplete={handleOnboardingComplete} />
        )}
        {showProfileEditor && (
          <OnboardingScreen
            onComplete={handleProfileUpdated}
            initialProfile={profile ?? undefined}
            mode="edit"
          />
        )}
      </AnimatePresence>

      {/* Main website (always mounted, shown after onboarding) */}
      {!showOnboarding && (
        <>
          <Navbar onEditProfile={handleProfileEditorOpen} />

          {/* 1. Hero */}
          <HeroSection />

          {/* 2. About */}
          <AboutSection />

          {/* 3. Letter */}
          <LetterSection />

          {/* 4. Gallery */}
          <GallerySection />

          {/* 5. Memory Wall */}
          <MemoryWall profile={profile} />

          {/* 6. Signature Wall */}
          <SignatureWall />

          {/* 7. Contributors */}
          <ContributorsSection />

          {/* 9. Final */}
          <FinalSection />

          {/* Footer */}
          <footer className="py-8 text-center bg-[#0D0B09] border-t border-[#2A2521]">
            <p
              className="text-[#4A3F38] text-sm"
              style={{ fontFamily: "var(--font-handwriting), cursive", fontSize: "16px" }}
            >
              MY YEARBOOK - NƠI LƯU KỶ NIỆM
            </p>
          </footer>
        </>
      )}
    </main>
  );
}
