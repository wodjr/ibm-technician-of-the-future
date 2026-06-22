"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import type { TechnicianInput } from "@/types/technician";

type Props = {
  onSubmit: (data: TechnicianInput) => void;
  isLoading?: boolean;
};

export default function TechnicianForm({ onSubmit, isLoading = false }: Props) {
  const [input, setInput] = useState<TechnicianInput>({
    assetId: "BR-1001",
    symptoms: "Device shows red warning light and intermittent network loss.",
    errorCode: "ERR-402",
    photos: [],
    escalate: false,
  });

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = event.target;
    const checked = event.target instanceof HTMLInputElement ? event.target.checked : false;

    setInput((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(input);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl bg-white p-6 shadow-sm shadow-slate-200">
      <div className="space-y-2">
        <label htmlFor="assetId" className="block text-sm font-medium text-slate-700">
          Asset tag / ID
        </label>
        <input
          id="assetId"
          name="assetId"
          value={input.assetId}
          onChange={handleChange}
          disabled={isLoading}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100 disabled:cursor-not-allowed disabled:bg-slate-100"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="symptoms" className="block text-sm font-medium text-slate-700">
          Symptoms and observations
        </label>
        <textarea
          id="symptoms"
          name="symptoms"
          rows={4}
          value={input.symptoms}
          onChange={handleChange}
          disabled={isLoading}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100 disabled:cursor-not-allowed disabled:bg-slate-100"
        />
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="errorCode" className="block text-sm font-medium text-slate-700">
            Error code
          </label>
          <input
            id="errorCode"
            name="errorCode"
            value={input.errorCode}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100 disabled:cursor-not-allowed disabled:bg-slate-100"
          />
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
          <input
            id="escalate"
            name="escalate"
            type="checkbox"
            checked={input.escalate}
            onChange={handleChange}
            disabled={isLoading}
            className="h-5 w-5 rounded border-slate-300 text-pink-600 focus:ring-pink-500 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <label htmlFor="escalate" className="text-sm font-medium text-slate-700">
            Escalation requested
          </label>
        </div>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Generating...
          </span>
        ) : (
          "Generate guidance"
        )}
      </button>
    </form>
  );
}
