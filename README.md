# IBM Technician of the Future

IBM Technician of the Future is a mobile-first Next.js application that helps technicians inspect, troubleshoot, and repair equipment using guided workflows, voice-friendly interactions, and a wearable preview mode.

The MVP is built as a browser-first demo that simulates wearable instructions and focuses on clear technician workflows, responsive design, and deployment readiness.

## Tech stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Vercel

## What this project is for

- Validate the technician workflow from asset identification to repair report
- Build a polished MVP without backend persistence
- Keep scope small and testable before adding hardware or AI integrations

## What to build first

- Project scaffold and page layout
- Equipment identification and symptom input flows
- Guided step-by-step troubleshooting UI
- Report summary and wearable preview

## What not to build yet

- Authentication and user accounts
- Database persistence
- Hardware SDK or real wearable integration
- Payment, export, or collaboration features
- Advanced AI automation before the UX is stable

## Local setup

```bash
git clone <your-repo-url>
cd ibm-technician-of-the-future
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

## Commands

```bash
npm run dev       # Start development server
npm run build     # Production build
npm run lint      # ESLint check
npx tsc --noEmit  # TypeScript type check
```

## Deployment

1. Push the repository to GitHub.
2. Import the project into Vercel.
3. Add required environment variables in Vercel if used.
4. Deploy and verify the production URL.

## Project structure

See `ARCHITECTURE.md` for the recommended folder layout and data flow.

## MVP scope

- Core technician workflow
- Mobile-first responsive UI
- Simulated AI/guidance and preview mode
- Report summary screen
- Vercel-ready deployment

## Future phases

After MVP, add persistent storage, real AI integrations, export capabilities, and hardware preview support.

## License

MIT

