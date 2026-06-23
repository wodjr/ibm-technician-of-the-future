"use client";

import { useCallback, useState, useSyncExternalStore } from "react";

function subscribeNoop() {
  return () => {};
}

function getSupportSnapshot(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function getServerSupportSnapshot(): boolean {
  return false;
}

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isSupported = useSyncExternalStore(subscribeNoop, getSupportSnapshot, getServerSupportSnapshot);

  const speak = useCallback(
    (text: string) => {
      if (!isSupported || !text) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    },
    [isSupported]
  );

  const cancel = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [isSupported]);

  return { isSupported, isSpeaking, speak, cancel };
}
