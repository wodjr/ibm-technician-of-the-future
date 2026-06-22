# PROJECT_BRIEF.md — IBM Technician of the Future

## Project summary

IBM Technician of the Future is a mobile-first Next.js application that guides technicians through equipment inspection, troubleshooting, and repair workflows using AI-assisted guidance and wearable preview simulation.

The app is designed as a browser-based demo and focuses on delivering a structured technician experience for asset identification, symptom capture, step-by-step remediation, and repair report generation.

## Problem statement

Technicians often spend too much time searching manuals, interpreting warning codes, and confirming procedures while under pressure. That slows repairs, increases human error, and leads to unnecessary escalations.

## Target users

- Field technicians and maintenance specialists
- Junior operators needing guided troubleshooting
- Senior engineers reviewing incident reports
- Support staff working in manufacturing, data centers, workshops, and field operations

## Core features

- Equipment identification via asset tag or QR code input
- Fault diagnosis from symptoms, warning lights, and error codes
- Guided troubleshooting workflow with clear step controls
- Voice-friendly input and guidance support
- Photo capture for incident documentation
- Safety warnings before sensitive actions
- Wearable preview mode for simplified wearable-style instructions
- Repair report and escalation summary generation

## Technology stack

- Framework: Next.js App Router
- Language: TypeScript
- Styling: Tailwind CSS
- Deployment: Vercel

## MVP scope

- Build a polished front-end workflow with responsive mobile support
- Keep the MVP serverless or lightweight
- Use simulated AI guidance and static example content as needed
- Avoid login, database, and hardware SDK integration for launch

## Risks and assumptions

- Risk: scope creep from advanced AI and wearable hardware features
  - Assumption: MVP will remain a web-first demo with simulated guidance
- Risk: mobile UI becomes too dense
  - Assumption: mobile-first Tailwind layout will keep screens usable
- Risk: sensitive keys get exposed
  - Assumption: .env.local stays out of source control and no keys are shipped in frontend code
- Risk: feature expectations exceed initial timeline
  - Assumption: stakeholders accept a small, testable first version

## Success criteria

- npm run build passes with no TypeScript or ESLint errors
- Core technician workflow functions end to end
- App is responsive and usable on mobile and desktop
- Documentation explains setup, MVP scope, and next phases
