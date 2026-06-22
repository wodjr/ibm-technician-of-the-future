# ARCHITECTURE.md — IBM Technician of the Future

## Technology stack

| Layer          | Choice                          |
|----------------|---------------------------------|
| Framework      | Next.js App Router              |
| Language       | TypeScript                      |
| Styling        | Tailwind CSS                    |
| State          | React `useState` / local state  |
| Deployment     | Vercel                          |
| Database       | None for MVP                    |
| Authentication | None for MVP                    |

## Recommended project structure

```
/
├── app/
│   ├── api/
│   │   └── generate/route.ts       # Optional AI integration route
│   ├── layout.tsx                 # Root layout and metadata
│   ├── page.tsx                   # Landing / app home page
│   ├── globals.css                # Global Tailwind base styles
│   └── favicon.ico                # App icon
├── components/                    # Reusable UI components
│   ├── form/
│   ├── workflow/
│   ├── preview/
│   └── ui/
├── data/                          # Static example data and mock assets
├── lib/                           # Utility and helper functions
│   ├── ai.ts
│   ├── capture.ts
│   └── report.ts
├── hooks/                         # Custom React hooks
├── types/                         # Shared TypeScript types
│   └── technician.ts
├── public/                        # Static images and public assets
├── styles/                        # Global and component-level styles
├── .env.example
├── README.md
└── CHANGELOG.md
```

## Data flow

1. User arrives on the home screen and selects equipment or enters an asset tag.
2. The app collects symptom input, warning codes, and optional photos.
3. A guided troubleshooting workflow is generated or selected.
4. The user advances through steps, confirms actions, and records progress.
5. A repair report is assembled for review or escalation.

## State management

- Local React state handles current step, form values, and temporary session data.
- No global state library is necessary for MVP.
- If needed, context can be introduced later for cross-page workflow state.

## Security and environment handling

- No production secrets are required for MVP.
- `.env.example` documents placeholder values only.
- `.env.local` must remain gitignored.
- Any future AI keys should be stored server-side in environment variables.

## Integration points

- `app/api/generate/route.ts`: optional backend route for AI generation or lookup calls
- `lib/ai.ts`: helper functions for model prompts or response formatting
- `components/preview/`: wearable preview and report summary UI

## What to build first

- App scaffold, home page, and base navigation
- Asset identification and input forms
- Guided workflow step component
- Report summary and preview screen

## What not to build yet

- Persistent backend storage
- User authentication or accounts
- Real wearable SDK integrations
- Production AI pipelines before the UX is stable

