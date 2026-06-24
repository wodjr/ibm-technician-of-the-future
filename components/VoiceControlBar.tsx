"use client";

import { useState } from "react";

type Props = {
  isSupported: boolean;
  isListening: boolean;
  isDictating: boolean;
  micError: string | null;
  voiceFeedback: string | null;
  ttsEnabled: boolean;
  onToggleListening: () => void;
  onToggleTts: () => void;
};

export default function VoiceControlBar({
  isSupported,
  isListening,
  isDictating,
  micError,
  voiceFeedback,
  ttsEnabled,
  onToggleListening,
  onToggleTts,
}: Props) {
  const [showExplainer, setShowExplainer] = useState(true);

  if (!isSupported) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        Voice control isn&apos;t supported in this browser. Try Chrome or Safari.
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-3xl bg-white p-4 shadow-sm shadow-slate-200">
      {!isListening && !voiceFeedback ? (
        <p className="text-base font-semibold text-slate-900">
          To begin, tap &quot;Tap to talk&quot; below.
        </p>
      ) : null}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleListening}
          className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition ${
            isListening
              ? "bg-pink-600 text-white"
              : "bg-slate-950 text-white hover:bg-slate-800"
          }`}
        >
          {isListening ? "Listening..." : "Tap to talk"}
        </button>
        <button
          type="button"
          onClick={onToggleTts}
          className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
            ttsEnabled
              ? "border-emerald-300 bg-emerald-50 text-emerald-700"
              : "border-slate-200 bg-slate-50 text-slate-600"
          }`}
        >
          {ttsEnabled ? "Spoken guidance: on" : "Spoken guidance: off"}
        </button>
        {isDictating ? (
          <span className="text-sm font-medium text-pink-600">Dictating symptoms, say &quot;submit&quot; when done</span>
        ) : null}
      </div>
      {micError ? <p className="text-sm text-rose-600">{micError}</p> : null}
      {voiceFeedback ? <p className="text-sm font-medium text-slate-700">{voiceFeedback}</p> : null}
      {showExplainer ? (
        <div className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          <p>
            Say &quot;next step&quot;, &quot;previous step&quot;, &quot;repeat&quot;, &quot;read report&quot;,
            &quot;escalate&quot;, or &quot;start listening for symptoms&quot; to dictate, then &quot;submit&quot;.
          </p>
          <button type="button" onClick={() => setShowExplainer(false)} className="shrink-0 text-slate-400 hover:text-slate-600">
            Dismiss
          </button>
        </div>
      ) : null}
    </div>
  );
}
