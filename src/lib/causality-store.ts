import { createClient } from "@supabase/supabase-js";

/**
 * Challenge 4: Causality Auditor Memory
 *
 * This file saves and retrieves the latest causality audit.
 * saveLatest() writes results to Supabase.
 * loadLatest() retrieves the results for the website.
 */

export interface GroupMeans {
  label: string;
  n0: number;
  mean0: number;
  n1: number;
  mean1: number;
}

export interface CausalitySummary {
  naive: number;
  stratified: number;
  groups: GroupMeans[];
}

export interface CausalityLatest {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  probe: Record<string, any>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  answer: Record<string, any>;

  summary: CausalitySummary;
}

// Connect to Supabase using existing environment variables.
function supabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  return createClient(url, key);
}

// Save the most recent causality audit.
export async function saveLatest(
  probe: CausalityLatest["probe"],
  answer: CausalityLatest["answer"],
  summary: CausalitySummary
): Promise<void> {
  const client = supabase();

  if (!client) {
    throw new Error(
      "Supabase env vars not set. See .env.example and the README."
    );
  }

  const { error } = await client.from("causality_latest").upsert({
    key: "latest",
    probe,
    answer,
    summary,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    throw new Error(
      `Could not save the latest audit: ${error.message}`
    );
  }
}

// Retrieve the most recent causality audit.
export async function loadLatest(): Promise<CausalityLatest | null> {
  const client = supabase();

  if (!client) return null;

  const { data, error } = await client
    .from("causality_latest")
    .select("probe, answer, summary")
    .eq("key", "latest")
    .maybeSingle();

  if (error || !data) return null;

  return data as CausalityLatest;
}
