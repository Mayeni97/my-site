
import { ComingSoon } from "@/components/ComingSoon";
import { CandidateOutcomes } from "@/components/simulator/CandidateOutcomes";
import { loadLatest } from "@/lib/simulator-store";

export const metadata = { title: "Decision Simulator" };

/**
 * ── TODO: Lane 3 — your /simulator page ──────────────────────────────────
 * Challenge 3's page check expects this page to DISPLAY the same answers
 * your /api/simulator/decide just gave, bound via data-simulator="..."
 * attributes, plus an <img data-simulator="dag"> showing your DAG. Step 6
 * of the build guide ("Build Your Decision Simulator", end of Lane 3)
 * gives you the complete page; the chart it uses already ships in
 * src/components/simulator/CandidateOutcomes.tsx.
 */

// Always load the newest game instead of showing cached results.
export const dynamic = "force-dynamic";

export default async function SimulatorPage() {
  const latest = await loadLatest();

  // Keep the original coming-soon screen until the first game is saved.
  if (!latest) {
    return (
      <ComingSoon
        lane={3}
        title="Decision Simulator"
        description="A service that simulates investment games and recommends the growth-optimal stake. Built after Lane 3."
      />
    );
  }

  const { problem, answer, candidates } = latest;
  const stakePct = Math.round(Number(answer.recommendedFraction) * 100);
  const lossPct = Math.round(Number(answer.probLoss) * 100);

  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
        Lane 3 · live decision service
      </p>

      <h1 className="mt-3 text-4xl font-bold">
        Stake {stakePct}% each year: it leaves the typical investor best off
      </h1>

      {/* TODO(yours): explain what your service does in your own words. */}
      <p className="mt-4 max-w-prose text-muted">
        My simulator tests different investment stakes by running thousands of
        possible outcomes. It recommends the stake that gives the typical
        investor the highest final balance.
      </p>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">The latest game</h2>

        <p className="mt-2 max-w-prose text-muted">
          {String(problem.scenario)}
        </p>

        <p className="mt-2 text-sm text-muted">
          Heads: the staked part grows {Number(problem.upPct)}%. Tails: it
          shrinks {Number(problem.downPct)}%.{" "}
          {Number(problem.horizonYears)} years, starting from $
          {Number(problem.buyIn).toLocaleString("en-US")}.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">The recommendation</h2>

        <ul className="mt-3 space-y-1 text-lg">
          <li>
            Recommended stake fraction:{" "}
            <strong
              data-simulator="recommended-fraction"
              className="text-accent"
            >
              {Number(answer.recommendedFraction).toFixed(2)}
            </strong>
          </li>

          <li>
            Typical (median) final balance: $
            <strong data-simulator="median-final" className="text-accent">
              {Math.round(
                Number(answer.medianFinalBalance)
              ).toLocaleString("en-US")}
            </strong>
          </li>

          <li>
            Probability of ending below the buy-in:{" "}
            <strong data-simulator="prob-loss" className="text-accent">
              {Number(answer.probLoss).toFixed(3)}
            </strong>
            <span className="text-base text-muted">
              {" "}(about {lossPct}% of simulated investors)
            </span>
          </li>
        </ul>

        <p className="mt-3 max-w-prose text-muted">
          {String(answer.reasoning)}
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">
          How every stake turned out
        </h2>

        <CandidateOutcomes
          candidates={candidates}
          buyIn={Number(problem.buyIn)}
          recommended={Number(answer.recommendedFraction)}
        />

        {/* TODO: explain why the biggest stake is not always best. */}
        <p className="mt-4 max-w-prose text-muted">
          Investing a larger percentage can produce bigger gains, but it
          also increases the risk of significant losses. Looking at the
          median helps us choose the option that works best for a typical
          investor, rather than being influenced by a few lucky outcomes.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">
          The model behind it
        </h2>

        <img
          data-simulator="dag"
          src="/images/dag.png"
          alt="DAG showing how initial wealth, stake fraction, and coin flips affect investment wealth."
          className="mt-3 w-full max-w-xl rounded-lg border border-line bg-white p-3"
        />

        {/* TODO: explain the DAG's decision and random outcome. */}
        <p className="mt-4 max-w-prose text-muted">
          The diagram shows how the investment changes each year. We
          control the stake fraction, but the coin flip is random.
          Together, these determine how much wealth the investor has
          after each year.
        </p>
      </section>
    </main>
  );
}
