import { RUNS, draw, seededRandom, type CapstoneProbe } from "@/lib/capstone-helpers";

/**
 * Challenge 5: the simulation behind your decision service and your report.
 * Step 4 of the build guide ("Build Your Capstone", end of Lane 5 in the
 * course book) explains every line.
 */

// Step 4b of the build guide. Run the problem's recipe
// (probe.dag) once and return both options' results for that run, keyed by
// option id.
//   - Draw every "once" node one time.
//   - Draw every "weekly" node once per week of the period
//     (probe.scenario.params.periodLength), using the "once" value it is
//     centered on.
//   - Work out each "result" node as its `compute` text says.
// draw(probe, rand, id, center) does one draw for you.

export function simulateRun(
  probe: CapstoneProbe,
  rand: () => number
): Record<string, number> | null {
  const weeks = Number(probe.scenario.params.periodLength);
  const extraBudget = Number(probe.scenario.params.extraBudget);

  const results: Record<string, number> = {};

  for (const candidate of probe.candidates) {
    const channel = candidate.id.replace("channel-", "");

    // Draw the average extra revenue once per quarter.
    const average = draw(probe, rand, `avg-extra-${channel}`);

    let totalRevenue = 0;

    // Draw extra revenue for each week of the quarter.
    for (let w = 0; w < weeks; w++) {
      totalRevenue += draw(
        probe,
        rand,
        `extra-${channel}`,
        average
      );
    }

    // Calculate net gain after subtracting the extra spending.
    results[candidate.id] = totalRevenue - weeks * extraBudget;
  }

  return results;
}

/**
 * Runs the recipe RUNS times and returns every option's list of results.
 * Seeded with the probe id, so the same problem always gives the same lists
 * (your report and your decide route see identical numbers).
 */
export function simulateAll(
  probe: CapstoneProbe
): Record<string, number[]> | null {
  const rand = seededRandom(probe.probeId);
  const results: Record<string, number[]> = {};

  for (const c of probe.candidates) results[c.id] = [];

  for (let i = 0; i < RUNS; i++) {
    const run = simulateRun(probe, rand);

    if (run === null) return null;

    for (const c of probe.candidates) {
      const v = run[c.id];

      if (typeof v !== "number" || !Number.isFinite(v)) {
        throw new Error(
          `simulateRun() gave no number for ${c.id} (Step 4b of the build guide)`
        );
      }

      results[c.id].push(v);
    }
  }

  return results;
}