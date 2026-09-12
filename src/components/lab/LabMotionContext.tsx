"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { useReducedMotion } from "framer-motion";

interface LabMotionContextValue {
  isPaused: boolean;
  togglePause: () => void;
  shouldReduceMotion: boolean;
  isMotionActive: boolean;
}

const LabMotionContext = createContext<LabMotionContextValue>({
  isPaused: false,
  togglePause: () => {},
  shouldReduceMotion: false,
  isMotionActive: true,
});

export function LabMotionProvider({ children }: { children: React.ReactNode }) {
  const [isPaused, setIsPaused] = useState<boolean>(false);
  // Track whether document is hidden (user switched tab/window)
  const [isDocumentHidden, setIsDocumentHidden] = useState<boolean>(false);
  const systemReducedMotion = useReducedMotion();
  const shouldReduceMotion = Boolean(systemReducedMotion);

  // Stop animations when document is hidden to conserve power and CPU.
  // We track it separately from isPaused so the user's manual pause state
  // is preserved and restored when they return to the tab.
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsDocumentHidden(document.hidden);
    };
    // Sync initial state (in case component mounts while already hidden)
    setIsDocumentHidden(document.hidden);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  const isMotionActive = useMemo(() => {
    return !shouldReduceMotion && !isPaused && !isDocumentHidden;
  }, [shouldReduceMotion, isPaused, isDocumentHidden]);

  const value = useMemo(
    () => ({
      isPaused,
      togglePause,
      shouldReduceMotion,
      isMotionActive,
    }),
    [isPaused, togglePause, shouldReduceMotion, isMotionActive]
  );

  return <LabMotionContext.Provider value={value}>{children}</LabMotionContext.Provider>;
}

export function useLabMotion() {
  const context = useContext(LabMotionContext);
  if (!context) {
    throw new Error("useLabMotion must be used within a LabMotionProvider");
  }
  return context;
}
