import { ComingSoon } from "@/components/ComingSoon";
import { loadLatest } from "@/lib/reasoning-store";
import { TwoWayTable } from "@/components/reasoning/TwoWayTable";
import { BernoulliFourViews } from "@/components/reasoning/BernoulliFourViews";

export const metadata = { title: "Reasoning & Uncertainty Service" };

/**
 * ── Challenge 2, step 5: the face ─────────────────────────────────────────
 * Why this page exists: an API decides, a page justifies. The grader reads
 * the three data-reasoning="..." numbers below and checks each one matches
 * the answer your API gave moments earlier. Everything else on the page is
 * for humans: the tables and views that show WHY each number is right.
 *
 * The wiring ships with the template. Your job when you take on Challenge 2:
 * run supabase/reasoning.sql, build the decide route, then make this page
 * yours. The TODO(yours) comments mark the sentences to rewrite in your own
 * words; the build guide (course book, end of Lane 2) explains every part.
 */

// Freshness contract: without this line, Next.js may serve a cached copy of
// this page, and the grader would see stale numbers seconds after your API
// answered. force-dynamic re-renders the page on every request.
export const dynamic = "force-dynamic";

export default async function ReasoningPage() {
  // The same rows your /api/reasoning/decide wrote via saveLatest().
  const { syllogism, plausibility, bernoulli } = await loadLatest();

  // Until the first probe arrives (or before Supabase is wired up), the
  // portfolio card keeps its honest placeholder.
  if (!syllogism && !plausibility && !bernoulli) {
    return (
      <ComingSoon
        lane={2}
        title="Reasoning & Uncertainty"
        description="A service that audits syllogisms, updates beliefs on base rates, and reads Bernoulli businesses. Built after Lane 2."
      />
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
        Lane 2 · live decision service
      </p>
      <h1 className="mt-3 text-4xl font-bold">My Reasoning &amp; Uncertainty Service</h1>
      {/* TODO(yours): one sentence, your words, on what this service does. */}
      <p className="mt-4 max-w-prose text-muted">
      I built this reasoning service to help evaluate logical arguments, calculate probabilities, and understand expected
      outcomes. It uses real-time results from my API to show how each answer is calculated.
      </p>

      {/* ── Latest syllogism audit ─────────────────────────────────────── */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold">Latest syllogism audit</h2>
        {syllogism ? (
          <div className="mt-3 max-w-prose">
            <p className="text-muted">
              Rule: if {String(syllogism.problem.rule?.if)}, then{" "}
              {String(syllogism.problem.rule?.then)}.
            </p>
            <p className="mt-1 text-muted">
              {String(syllogism.problem.observation?.statement)}{" "}
              {String(syllogism.problem.conclusion?.statement)}
            </p>
            <p className="mt-3 text-lg">
              Verdict:{" "}
              <strong data-reasoning="verdict" className="text-accent">
                {String(syllogism.answer.verdict)}
              </strong>
              {typeof syllogism.answer.fallacy === "string" && (
                <span className="text-muted"> ({syllogism.answer.fallacy})</span>
              )}
            </p>
            {/* TODO(yours): rewrite this explanation so it sounds like you (Station 2.1). */}
            <p className="mt-2 max-w-prose text-sm text-muted">
            The service checks whether the conclusion logically follows from the information given. It focuses on the structure of
            the argument rather than whether the situation sounds believable. It also identifies common reasoning mistakes.
            </p>
          </div>
        ) : (
          <p className="mt-3 text-muted">No syllogism probe yet.</p>
        )}
      </section>

      {/* ── Latest plausibility update ─────────────────────────────────── */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold">Latest plausibility update</h2>
        {plausibility ? (
          <div className="mt-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">
              The problem, exactly as the grader sent it
            </p>
            <p className="mt-1 max-w-prose text-muted">{String(plausibility.problem.scenario)}</p>
            <TwoWayTable
              baseRate={Number(plausibility.problem.baseRate)}
              hitRate={Number(plausibility.problem.hitRate)}
              falseAlarmRate={Number(plausibility.problem.falseAlarmRate)}
            />
            <p className="mt-3 text-lg">
              Posterior:{" "}
              <strong data-reasoning="posterior" className="text-accent">
                {Number(plausibility.answer.posterior).toFixed(3)}
              </strong>
            </p>
            {/* TODO(yours): one sentence a manager could read, e.g. what this
                posterior means for the flagged case (Station 2.3). */}
          </div>
        ) : (
          <p className="mt-3 text-muted">
          This updated probability shows how likely a flagged case
          is to have the condition after considering the original
          likelihood and the system's accuracy. It helps managers
          make better decisions using evidence instead of assumptions.
        </p>
        )}
      </section>

      {/* ── Latest Bernoulli read ──────────────────────────────────────── */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold">Latest Bernoulli read: four views</h2>
        {bernoulli ? (
          <div className="mt-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">
              The problem, exactly as the grader sent it
            </p>
            <p className="mt-1 max-w-prose text-muted">{String(bernoulli.problem.scenario)}</p>
            <BernoulliFourViews
              theta={Number(bernoulli.problem.theta)}
              onSuccess={Number(bernoulli.problem.payoffs?.onSuccess)}
              onFailure={Number(bernoulli.problem.payoffs?.onFailure)}
            />
            <p className="mt-4 text-lg">
              Expected payoff:{" "}
              <strong data-reasoning="expected-value" className="text-accent">
                {Number(bernoulli.answer.expectedValue).toFixed(2)}
              </strong>
              <span className="ml-3 text-base text-muted">
                P(X = {String(bernoulli.problem.probabilityOf)}) ={" "}
                {Number(bernoulli.answer.probabilityStatement).toFixed(2)}
              </span>
            </p>
            {/* TODO(yours): one sentence on what the expected payoff does and
                does not promise (Station 2.4). */}
          </div>
        ) : (
          <p className="mt-3 text-muted">
          The expected payoff represents the average outcome we
          would anticipate over many similar situations. It helps
          evaluate decisions involving uncertainty, but it does
          not guarantee that any individual outcome will match
          that average.
          </p>
        )}
      </section>
    </main>
  );
}
