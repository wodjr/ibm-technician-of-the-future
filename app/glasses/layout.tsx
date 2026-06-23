import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Technician Guidance",
  other: {
    "mrbd-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: 600,
  height: 600,
  initialScale: 1,
  userScalable: false,
};

export default function GlassesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
