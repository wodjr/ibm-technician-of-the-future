"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

function getSpeechRecognitionConstructor(): SpeechRecognitionConstructor | undefined {
  if (typeof window === "undefined") return undefined;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition;
}

function subscribeNoop() {
  return () => {};
}

function getSupportSnapshot(): boolean {
  return getSpeechRecognitionConstructor() !== undefined;
}

function getServerSupportSnapshot(): boolean {
  return false;
}

function describeError(code: string): string {
  switch (code) {
    case "not-allowed":
    case "permission-denied":
      return "Microphone permission was denied.";
    case "no-speech":
      return "No speech was detected. Try again.";
    case "network":
      return "A network error interrupted speech recognition.";
    default:
      return "Speech recognition failed. Try again.";
  }
}

type Options = {
  onResult: (transcript: string) => void;
};

const LISTENING_TIMEOUT_MS = 8000;

export function useSpeechRecognition({ onResult }: Options) {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isSupported = useSyncExternalStore(subscribeNoop, getSupportSnapshot, getServerSupportSnapshot);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const onResultRef = useRef(onResult);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const outcomeHandledRef = useRef(false);

  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  const clearListeningTimeout = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    const Recognition = getSpeechRecognitionConstructor();
    if (!Recognition) return;

    const recognition = new Recognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      outcomeHandledRef.current = true;
      clearListeningTimeout();
      const transcript = event.results[event.results.length - 1][0].transcript;
      onResultRef.current(transcript);
    };
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      outcomeHandledRef.current = true;
      clearListeningTimeout();
      setError(describeError(event.error));
      setIsListening(false);
    };
    recognition.onend = () => {
      clearListeningTimeout();
      setIsListening(false);
      if (!outcomeHandledRef.current) {
        setError("Didn't catch that — no speech reached the microphone. Try again.");
      }
    };

    recognitionRef.current = recognition;
    return () => {
      clearListeningTimeout();
      recognition.abort();
    };
  }, [clearListeningTimeout]);

  const start = useCallback(() => {
    if (!recognitionRef.current) return;
    setError(null);
    setIsListening(true);
    outcomeHandledRef.current = false;
    recognitionRef.current.start();

    clearListeningTimeout();
    timeoutRef.current = setTimeout(() => {
      outcomeHandledRef.current = true;
      recognitionRef.current?.abort();
      setIsListening(false);
      setError("Didn't hear anything in time. Try again.");
    }, LISTENING_TIMEOUT_MS);
  }, [clearListeningTimeout]);

  const stop = useCallback(() => {
    clearListeningTimeout();
    recognitionRef.current?.stop();
    setIsListening(false);
  }, [clearListeningTimeout]);

  return { isSupported, isListening, error, start, stop };
}
