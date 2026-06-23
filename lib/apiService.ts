import type { TechnicianInput, DiagnosisResult } from "@/types/technician";
import { getRagContext } from "@/lib/ragService";

const OPENAI_BASE_URL = "https://api.openai.com/v1/chat/completions";

export async function generateTechnicianGuidance(input: TechnicianInput): Promise<DiagnosisResult> {
  const openAiKey = process.env.OPENAI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  if (openAiKey) {
    return callOpenAi(input, openAiKey);
  }

  if (anthropicKey) {
    return callAnthropic(input, anthropicKey);
  }

  return getMockDiagnosis(input);
}

async function callOpenAi(input: TechnicianInput, apiKey: string): Promise<DiagnosisResult> {
  const context = await getRagContext(input.symptoms || input.assetId || input.errorCode);
  const prompt = buildPrompt(input, context);

  const response = await fetch(OPENAI_BASE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a technician assistance generator. Use the provided manual context to give precise, safe repair guidance. Return only valid JSON with keys summary, action, and nextStepIndex.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 250,
    }),
  });

  if (!response.ok) {
    throw new Error("OpenAI API request failed.");
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI returned an unexpected response.");
  }

  try {
    const parsed = JSON.parse(content);
    return {
      summary: String(parsed.summary ?? "No summary returned."),
      action: String(parsed.action ?? "No action returned."),
      nextStepIndex: Number(parsed.nextStepIndex ?? 0),
    };
  } catch (error) {
    throw new Error("Failed to parse OpenAI response as JSON.");
  }
}

async function callAnthropic(input: TechnicianInput, apiKey: string): Promise<DiagnosisResult> {
  const context = await getRagContext(input.symptoms || input.assetId || input.errorCode);
  const prompt = buildPrompt(input, context);
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-5",
      max_tokens: 250,
      temperature: 0.7,
      system:
        "You are a technician assistance generator. Use the provided manual context to give precise, safe repair guidance. Return only valid JSON with keys summary, action, and nextStepIndex.",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error("Anthropic API request failed.");
  }

  const data = await response.json();
  const text = data?.content?.[0]?.text;
  if (!text) {
    throw new Error("Anthropic returned an unexpected response.");
  }

  try {
    const parsed = JSON.parse(text);
    return {
      summary: String(parsed.summary ?? "No summary returned."),
      action: String(parsed.action ?? "No action returned."),
      nextStepIndex: Number(parsed.nextStepIndex ?? 0),
    };
  } catch (error) {
    throw new Error("Failed to parse Anthropic response as JSON.");
  }
}

function buildPrompt(input: TechnicianInput, context?: string): string {
  const contextSection = context
    ? `Manual context:\n${context}\n\nUse the above manual reference when generating your guidance.\n\n`
    : "";

  return `${contextSection}Asset ID: ${input.assetId}\nSymptoms: ${input.symptoms}\nError code: ${input.errorCode || "None"}\nEscalation requested: ${input.escalate ? "Yes" : "No"}\nPlease provide a JSON object with keys summary, action, and nextStepIndex. Use the first troubleshooting step unless escalation is requested, then use the final step.`;
}

function getMockDiagnosis(input: TechnicianInput): DiagnosisResult {
  return {
    summary: input.escalate
      ? "Escalation requested. Review the issue with a senior technician."
      : "Review the observed warning indicators and confirm the device power and cabling.",
    action: input.errorCode
      ? `Inspect the error code ${input.errorCode} and verify the component connections.`
      : "Inspect the asset and confirm the visible status lights.",
    nextStepIndex: input.escalate ? 3 : 0,
  };
}
