"use client";

import { useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import TechnicianForm from "@/components/TechnicianForm";
import WorkflowPanel from "@/components/WorkflowPanel";
import OutputScreen from "@/components/OutputScreen";
import ReportSection from "@/components/ReportSection";
import { initialEquipment, workflowSteps } from "@/lib/mockData";
import type { DiagnosisResult } from "@/types/technician";
import type { TechnicianInput } from "@/types/technician";

const createDiagnosis = (input: TechnicianInput): DiagnosisResult => {
  const summary = input.escalate
    ? "Escalation requested. Review the asset and provide on-site support guidance."
    : "Review the observed warning indicators and confirm the device power and cabling.";

  const action = input.errorCode
    ? `Inspect the error code ${input.errorCode} and verify the component connections.`
    : "Inspect the asset and confirm the visible status lights.";

  return {
    summary,
    action,
    nextStepIndex: input.escalate ? workflowSteps.length - 1 : 0,
  };
};

export default function Home() {
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  const currentStep = workflowSteps[activeStep];

  const summaryReport = useMemo(() => {
    if (!diagnosis) return null;

    return `Asset: ${initialEquipment.name} (${initialEquipment.id})\nLocation: ${initialEquipment.location}\n\nSummary:\n${diagnosis.summary}\n\nNext action:\n${diagnosis.action}\n\nCurrent workflow step:\n${currentStep.title}`;
  }, [diagnosis, currentStep.title]);

  function handleSubmit(input: TechnicianInput) {
    const result = createDiagnosis(input);
    setDiagnosis(result);
    setActiveStep(result.nextStepIndex);
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Navigation />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-6 py-14 text-white shadow-2xl shadow-slate-500/10 sm:px-10">
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
              <TechnicianForm onSubmit={handleSubmit} />
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
