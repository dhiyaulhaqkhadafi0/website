"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
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
  const systemReducedMotion = useReducedMotion();
  const shouldReduceMotion = Boolean(systemReducedMotion);

  // Stop animations if document is hidden to conserve power and CPU
  useEffect(() => {
    const handleVisibilityChange = () => {
      // document.hidden handled gracefully
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  const isMotionActive = useMemo(() => {
    return !shouldReduceMotion && !isPaused;
  }, [shouldReduceMotion, isPaused]);

  const value = useMemo(
    () => ({
      isPaused,
      togglePause,
      shouldReduceMotion,
      isMotionActive,
    }),
    [isPaused, shouldReduceMotion, isMotionActive]
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
