export type VoiceCommand =
  | { type: "next" }
  | { type: "previous" }
  | { type: "repeat" }
  | { type: "read-report" }
  | { type: "escalate-on" }
  | { type: "escalate-off" }
  | { type: "start-dictation" }
  | { type: "submit" }
  | { type: "unknown" };

const PHRASES: Array<{ type: VoiceCommand["type"]; phrases: string[] }> = [
  { type: "next", phrases: ["next step", "next"] },
  { type: "previous", phrases: ["previous step", "back"] },
  { type: "repeat", phrases: ["repeat"] },
  { type: "read-report", phrases: ["read report", "read summary"] },
  { type: "escalate-off", phrases: ["cancel escalate"] },
  { type: "escalate-on", phrases: ["escalate"] },
  { type: "start-dictation", phrases: ["start listening for symptoms"] },
  { type: "submit", phrases: ["submit"] },
];

export function parseVoiceCommand(transcript: string): VoiceCommand {
  const normalized = transcript.trim().toLowerCase();

  for (const { type, phrases } of PHRASES) {
    if (phrases.some((phrase) => normalized.includes(phrase))) {
      return { type };
    }
  }

  return { type: "unknown" };
}
