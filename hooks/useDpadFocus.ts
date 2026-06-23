"use client";

import { useEffect } from "react";

const FOCUSABLE_SELECTOR = ".focusable:not(.hidden *)";

function getVisibleFocusables(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => el.offsetParent !== null && !el.hasAttribute("disabled")
  );
}

export function useDpadFocus() {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const focusables = getVisibleFocusables();
      if (focusables.length === 0) return;

      const current = document.activeElement as HTMLElement | null;
      const currentIndex = current ? focusables.indexOf(current) : -1;

      let nextIndex: number | null = null;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % focusables.length;
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        nextIndex = currentIndex < 0 ? 0 : (currentIndex - 1 + focusables.length) % focusables.length;
      }

      if (nextIndex !== null) {
        event.preventDefault();
        focusables[nextIndex].focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);
}
