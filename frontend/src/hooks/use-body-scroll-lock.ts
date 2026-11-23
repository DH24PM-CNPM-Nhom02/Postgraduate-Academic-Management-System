"use client";

import { useEffect } from "react";

let activeLocks = 0;
let originalOverflow = "";

export function useBodyScrollLock(enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const { style } = document.body;
    if (activeLocks === 0) {
      originalOverflow = style.overflow;
      style.overflow = "hidden";
    }
    activeLocks += 1;

    return () => {
      activeLocks -= 1;
      if (activeLocks === 0) style.overflow = originalOverflow;
    };
  }, [enabled]);
}
