import { ComingSoon } from "@/components/ComingSoon";
import { loadLatest } from "@/lib/causality-store";

export const metadata = { title: "Causality Audit Service" };

// Always show the newest answer written by the API.
export const dynamic = "force-dynamic";

export default async function CausalityPage() {
  const latest = await loadLatest();

  if (!latest) {
    return (
      <ComingSoon
        lane={4}
        title="Causality Audit"
        description="A service that tells forks from pipes from colliders, and knows when to stratify. Built after Lane 4."
      />
    );
  }

  const { probe, answer, summary } = latest;
  const context = probe.context ?? {};
  const structure = String(answer.structure ?? "unknown");
  const verdict = answer.causal ? "Causal" : "Not causal";
  const effect = Number(answer.stratifiedEffect);

  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
        Lane 4 · live decision service
      </p>
      <h1 className="mt-3 text-4xl font-bold">Causality Audit</h1>
      <p className="mt-4 max-w-prose text-muted">
        This service compares the overall relationship with the relationship
        inside levels of a third variable to distinguish confounding, mediation,
        collider bias, and a direct effect.
      </p>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">Latest audit</h2>
        <p className="mt-2 max-w-prose text-muted">
          {String(context.narrative ?? "The latest causality probe sent to the API.")}
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-line bg-surface p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">Structure</p>
            <p data-causality="structure" className="mt-2 text-xl font-bold text-accent">
              {structure}
            </p>
          </div>
          <div className="rounded-xl border border-line bg-surface p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">Verdict</p>
            <p data-causality="verdict" className="mt-2 text-xl font-bold text-accent">
              {verdict}
            </p>
          </div>
          <div className="rounded-xl border border-line bg-surface p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">Advice</p>
            <p className="mt-2 text-xl font-bold text-accent">
              {String(answer.advice ?? "—")}
            </p>
          </div>
        </div>

        <p className="mt-5 text-lg">
          Stratified effect:{" "}
          <strong data-causality="stratified-effect" className="text-accent">
            {Number.isFinite(effect) ? effect.toFixed(3) : "—"}
          </strong>
        </p>
        <p className="mt-3 max-w-prose text-muted">{String(answer.reasoning ?? "")}</p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">Group comparison</h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-line bg-surface p-4">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <thead className="text-muted">
              <tr>
                <th className="pb-2 font-medium">Group</th>
                <th className="pb-2 font-medium">n (x=0)</th>
                <th className="pb-2 font-medium">Mean (x=0)</th>
                <th className="pb-2 font-medium">n (x=1)</th>
                <th className="pb-2 font-medium">Mean (x=1)</th>
              </tr>
            </thead>
            <tbody>
              {summary.groups.map((group) => (
                <tr key={group.label} className="border-t border-line">
                  <td className="py-2 pr-4 font-medium">{group.label}</td>
                  <td className="py-2">{group.n0}</td>
                  <td className="py-2">{group.mean0.toFixed(2)}</td>
                  <td className="py-2">{group.n1}</td>
                  <td className="py-2">{group.mean1.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">The causal structures</h2>
        <img
          data-causality="dag"
          src="/images/dag.png"
          alt="Four causal diagrams showing fork, pipe, collider, and direct structures."
          className="mt-4 w-full rounded-lg border border-line bg-white p-3"
        />
        <p className="mt-4 max-w-prose text-muted">
          A fork is a common cause, a pipe is a mediator, a collider is a common
          effect, and a direct relationship has no relevant third-variable path.
        </p>
      </section>
    </main>
  );
}
