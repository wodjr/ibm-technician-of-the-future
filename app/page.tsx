"use client";

import { useEffect, useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import TechnicianForm from "@/components/TechnicianForm";
import WorkflowPanel from "@/components/WorkflowPanel";
import OutputScreen from "@/components/OutputScreen";
import ReportSection from "@/components/ReportSection";
import VoiceControlBar from "@/components/VoiceControlBar";
import { initialEquipment, workflowSteps } from "@/lib/mockData";
import { parseVoiceCommand } from "@/lib/voiceCommands";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import type { DiagnosisResult } from "@/types/technician";
import type { TechnicianInput } from "@/types/technician";

const DEFAULT_INPUT: TechnicianInput = {
  assetId: "BR-1001",
  symptoms: "Device shows red warning light and intermittent network loss.",
  errorCode: "ERR-402",
  photos: [],
  escalate: false,
};

export default function Home() {
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastInput, setLastInput] = useState<TechnicianInput | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [dictationMode, setDictationMode] = useState(false);
  const [dictatedSymptoms, setDictatedSymptoms] = useState<string | undefined>(undefined);
  const [escalateOverride, setEscalateOverride] = useState<boolean | undefined>(undefined);
  const [voiceFeedback, setVoiceFeedback] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  const currentStep = workflowSteps[activeStep];

  const summaryReport = useMemo(() => {
    if (!diagnosis) return null;

    return `Asset: ${initialEquipment.name} (${initialEquipment.id})\nLocation: ${initialEquipment.location}\n\nSummary:\n${diagnosis.summary}\n\nNext action:\n${diagnosis.action}\n\nCurrent workflow step:\n${currentStep.title}`;
  }, [diagnosis, currentStep.title]);

  async function handleSubmit(input: TechnicianInput) {
    setLastInput(input);
    setIsLoading(true);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Failed to generate guidance.");
      }

      setDiagnosis(result);
      setActiveStep(result.nextStepIndex);
      setStatusMessage("Guidance generated successfully.");
    } catch (error) {
      setErrorMessage("Something went wrong while generating guidance. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRetry() {
    if (lastInput) {
      await handleSubmit(lastInput);
    }
  }

  const { speak } = useSpeechSynthesis();

  function handleStart() {
    setHasStarted(true);
    // Speaking synchronously inside this click handler is what lets browsers
    // (especially iOS Safari) actually play it — audio is blocked until the
    // user's first tap, and this tap is that first interaction.
    speak("To begin, tap Tap to talk.");
  }

  function handleVoiceResult(transcript: string) {
    if (dictationMode) {
      setDictatedSymptoms(transcript);
      setDictationMode(false);
      setVoiceFeedback(`Symptoms set to: "${transcript}". Say "submit" to send it.`);
      return;
    }

    const command = parseVoiceCommand(transcript);
    switch (command.type) {
      case "next": {
        const nextIndex = Math.min(workflowSteps.length - 1, activeStep + 1);
        const nextStep = workflowSteps[nextIndex];
        setActiveStep(nextIndex);
        speak(`${nextStep.title}. ${nextStep.description}${nextStep.warning ? ` Warning: ${nextStep.warning}` : ""}`);
        setVoiceFeedback(`Heard "${transcript}" — moving to the next step.`);
        break;
      }
      case "previous": {
        const previousIndex = Math.max(0, activeStep - 1);
        const previousStep = workflowSteps[previousIndex];
        setActiveStep(previousIndex);
        speak(
          `${previousStep.title}. ${previousStep.description}${previousStep.warning ? ` Warning: ${previousStep.warning}` : ""}`
        );
        setVoiceFeedback(`Heard "${transcript}" — moving to the previous step.`);
        break;
      }
      case "repeat":
        speak(currentStep.description);
        setVoiceFeedback(`Heard "${transcript}" — repeating the current step.`);
        break;
      case "read-report":
        speak(summaryReport ?? "No report has been generated yet.");
        setVoiceFeedback(`Heard "${transcript}" — reading the report.`);
        break;
      case "escalate-on":
        setEscalateOverride(true);
        setVoiceFeedback(`Heard "${transcript}" — escalation flagged.`);
        break;
      case "escalate-off":
        setEscalateOverride(false);
        setVoiceFeedback(`Heard "${transcript}" — escalation cleared.`);
        break;
      case "start-dictation":
        setDictationMode(true);
        setVoiceFeedback(`Heard "${transcript}" — listening for symptoms next.`);
        break;
      case "submit":
        handleSubmit({
          ...(lastInput ?? DEFAULT_INPUT),
          symptoms: dictatedSymptoms ?? (lastInput ?? DEFAULT_INPUT).symptoms,
          escalate: escalateOverride ?? (lastInput ?? DEFAULT_INPUT).escalate,
        });
        setVoiceFeedback(`Heard "${transcript}" — submitting.`);
        break;
      case "unknown":
        setVoiceFeedback(`Didn't recognize "${transcript}". Try "next step", "repeat", or "escalate".`);
        break;
    }
  }

  const { isSupported: isMicSupported, isListening, error: micError, start, stop } = useSpeechRecognition({
    onResult: handleVoiceResult,
  });

  useEffect(() => {
    if (diagnosis && ttsEnabled) {
      speak(`${diagnosis.summary} Next action: ${diagnosis.action}`);
    }
  }, [diagnosis, ttsEnabled, speak]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {!hasStarted ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 p-6">
          <div className="max-w-sm space-y-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-pink-300">Technician workflow</p>
            <h1 className="text-2xl font-semibold text-white">Tap to start your session</h1>
            <button
              type="button"
              onClick={handleStart}
              className="inline-flex w-full items-center justify-center rounded-2xl bg-white px-6 py-4 text-lg font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              Start
            </button>
          </div>
        </div>
      ) : null}
      <Navigation />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <VoiceControlBar
          isSupported={isMicSupported}
          isListening={isListening}
          isDictating={dictationMode}
          micError={micError}
          voiceFeedback={voiceFeedback}
          ttsEnabled={ttsEnabled}
          onToggleListening={() => (isListening ? stop() : start())}
          onToggleTts={() => setTtsEnabled((value) => !value)}
        />

        <section className="mt-6 rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-6 py-14 text-white shadow-2xl shadow-slate-500/10 sm:px-10">
          <div className="mx-auto max-w-3xl space-y-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-pink-300">Technician workflow</p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">AI-ready field support for technicians</h1>
            <p className="mx-auto max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Capture asset status, log symptoms, and generate guided repair recommendations in a clean mobile-first UI.
            </p>
          </div>
        </section>

        <div className="mt-8 grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-8">
            <div className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200">
              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Technician input</p>
                <h2 className="text-2xl font-semibold text-slate-900">Describe the situation</h2>
                <p className="text-slate-600">Enter the asset ID, symptoms, and error code so the app can generate the next recommended step.</p>
              </div>
              {statusMessage && !isLoading ? (
                <div className="mb-4 rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {statusMessage}
                </div>
              ) : null}
              {isLoading ? (
                <div className="mb-4 flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
                  Generating guidance, please wait...
                </div>
              ) : null}
              {errorMessage ? (
                <div className="mb-4 rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  <p>{errorMessage}</p>
                  {lastInput ? (
                    <button
                      type="button"
                      onClick={handleRetry}
                      className="mt-3 inline-flex rounded-2xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
                    >
                      Retry
                    </button>
                  ) : null}
                </div>
              ) : null}
              <TechnicianForm
                onSubmit={handleSubmit}
                isLoading={isLoading}
                dictatedSymptoms={dictatedSymptoms}
                escalateOverride={escalateOverride}
              />
            </div>

            <WorkflowPanel steps={workflowSteps} activeIndex={activeStep} onSelect={setActiveStep} />
          </div>

          <div className="space-y-8">
            <OutputScreen result={diagnosis} activeStep={currentStep.title} />
            <ReportSection report={summaryReport} />
          </div>
        </div>
      </main>
    </div>
  );
}
