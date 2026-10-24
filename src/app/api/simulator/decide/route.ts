// import { notBuiltYet } from "@/lib/not-built-yet";
import { NextResponse } from "next/server";
import { saveLatest, type CandidateSummary } from "@/lib/simulator-store";

/**
 * ── TODO: Lane 3 — Challenge 3, "Decision Simulator" ─────────────────────
 * The platform will POST seeded investment games here; your service
 * simulates the paths and returns the growth-optimal stake fraction with
 * its statistics. Step 4 of the build guide ("Build Your Decision
 * Simulator", end of Lane 3 in the course book) gives you the complete file
 * to paste over this one and explains every line.
 * Until then it returns 501 so probes honestly fail.
 */

// Challenge 3 Step 4: The simulator's brain is now implemented.
// The original notBuiltYet import is retained but no longer used.

// How many simulated investors per candidate stake.
// Enough for stable results while staying within the 10-second limit.
const N_PATHS = 20000;

// Simulate one candidate stake across thousands of investors.
function simulateGame(
  buyIn: number,
  f: number,
  upPct: number,
  downPct: number,
  years: number,
  nPaths: number
): number[] {
  const up = 1 + (upPct / 100) * f;
  const down = 1 - (downPct / 100) * f;

  const finals: number[] = [];

  for (let i = 0; i < nPaths; i++) {
    let balance = buyIn;

    for (let t = 0; t < years; t++) {
      balance *= Math.random() < 0.5 ? up : down;
    }

    finals.push(balance);
  }

  return finals.sort((a, b) => a - b);
}

// Find a percentile from sorted simulation results.
function quantile(sorted: number[], p: number): number {
  return sorted[Math.floor(p * (sorted.length - 1))];
}

// The grader sends a game here using POST.
export async function POST(req: Request) {
  const game = await req.json().catch(() => null);

  if (
    !game ||
    !Array.isArray(game.candidateFractions) ||
    game.candidateFractions.length === 0
  ) {
    return NextResponse.json(
      { error: "expected a JSON game with a `candidateFractions` list" },
      { status: 400 }
    );
  }

  const { upPct, downPct, horizonYears, buyIn } = game;

  // Try every candidate stake fraction.
  const candidates: CandidateSummary[] = game.candidateFractions.map(
    (f: number) => {
      const finals = simulateGame(
        buyIn,
        f,
        upPct,
        downPct,
        horizonYears,
        N_PATHS
      );

      return {
        fraction: f,
        p5: quantile(finals, 0.05),
        p25: quantile(finals, 0.25),
        median: quantile(finals, 0.5),
        p75: quantile(finals, 0.75),
        p95: quantile(finals, 0.95),
        probLoss: finals.filter((x) => x < buyIn).length / finals.length,
      };
    }
  );

  // Choose the candidate whose median final balance is highest.
  // We use the median, not the mean, because we want the best
  // outcome for the typical investor.
  let best = candidates[0];

  for (const c of candidates) {
    if (c.median > best.median) {
      best = c;
    }
  }

  // Prepare the answer for the course grader.
  const answer = {
    recommendedFraction: best.fraction,
    medianFinalBalance: best.median,
    probLoss: best.probLoss,
    reasoning:
      `Of the ${candidates.length} stakes simulated, staking ${Math.round(best.fraction * 100)}% ` +
      `each year left the typical investor with the most: about ` +
      `$${Math.round(best.median).toLocaleString("en-US")} after ${horizonYears} years, ` +
      `from a $${Number(buyIn).toLocaleString("en-US")} buy-in. ` +
      `${Math.round(best.probLoss * 100)}% of simulated investors still ended below the buy-in.`,
  };

  // Save the latest game, answer, and candidate results to Supabase.
  await saveLatest(game, answer, candidates);

  // Return the answer to the course grader.
  return NextResponse.json(answer);
}
