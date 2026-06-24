import { Redis } from "@upstash/redis";

const STATE_KEY = "glasses:state";

export type GlassesState = {
  activeIndex: number;
  escalated: boolean;
};

const DEFAULT_STATE: GlassesState = { activeIndex: 0, escalated: false };

function getClient(): Redis | null {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export async function getGlassesState(): Promise<GlassesState> {
  const redis = getClient();
  if (!redis) return DEFAULT_STATE;

  const state = await redis.get<GlassesState>(STATE_KEY);
  return state ?? DEFAULT_STATE;
}

export async function setGlassesState(state: GlassesState): Promise<void> {
  const redis = getClient();
  if (!redis) return;

  await redis.set(STATE_KEY, state);
}
