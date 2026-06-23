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

export function useSpeechRecognition({ onResult }: Options) {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isSupported = useSyncExternalStore(subscribeNoop, getSupportSnapshot, getServerSupportSnapshot);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const onResultRef = useRef(onResult);

  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  useEffect(() => {
    const Recognition = getSpeechRecognitionConstructor();
    if (!Recognition) return;

    const recognition = new Recognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      onResultRef.current(transcript);
    };
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setError(describeError(event.error));
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    return () => recognition.abort();
  }, []);

  const start = useCallback(() => {
    if (!recognitionRef.current) return;
    setError(null);
    setIsListening(true);
    recognitionRef.current.start();
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  return { isSupported, isListening, error, start, stop };
}
