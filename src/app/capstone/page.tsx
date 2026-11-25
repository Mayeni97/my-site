import { loadLatest } from "@/lib/capstone-store";
import { simulateAll } from "@/lib/capstone-simulate";

export const metadata = {
  title: "Capstone — Marketing Budget Allocation",
};

// Always retrieve the latest saved results.
export const dynamic = "force-dynamic";

/**
 * Lane 5 — Challenge 5: Capstone Report
 * Compares marketing channels and recommends an allocation
 * based on the marketing team's acceptable risk.
 */
export default async function CapstonePage() {
  const latest = await loadLatest();

  if (!latest) {
    return (
      <main className="mx-auto max-w-5xl p-8">
        <h1>Marketing Budget Allocation</h1>
        <p>No results available. Run npm run try-capstone first.</p>
      </main>
    );
  }

  const { probe, answer } = latest;
  const results = simulateAll(probe);

  // Prepare simulated outcomes for the comparison chart.
  const allValues = Object.values(results ?? {}).flat();

  const min = Math.min(...allValues, probe.limit.atLeast);
  const max = Math.max(...allValues, probe.limit.atLeast);

  const binCount = 40;
  const binWidth = (max - min) / binCount || 1;

  // Create histogram bins for each marketing channel.
  const histograms = probe.candidates.map((c) => {
    const bins = Array(binCount).fill(0);

    for (const value of results?.[c.id] ?? []) {
      const index = Math.min(
        binCount - 1,
        Math.floor((value - min) / binWidth)
      );

      bins[index]++;
    }

    return {
      id: c.id,
      label: c.label,
      bins,
    };
  });

  // Use the same vertical scale for both charts.
  const maxCount = Math.max(
    1,
    ...histograms.flatMap((h) => h.bins)
  );

  // Calculate the position of the break-even threshold.
  const thresholdX =
    60 +
    ((probe.limit.atLeast - min) / (max - min || 1)) * 700;

  // Retrieve the recommended channel and its results.
  const recommended = answer.outcomes[answer.action];

  const candidate = probe.candidates.find(
    (c) => c.id === answer.action
  );

  return (
    <main className="mx-auto max-w-5xl space-y-10 p-8">

      {/* Report header */}
      <header>
        <h1 className="text-3xl font-bold">
          Marketing Budget Allocation
        </h1>

        <p className="mt-2 text-lg">
          Events vs. Search
        </p>
      </header>

      {/* Section 1: Recommendation */}
      <section>
        <h2 className="text-2xl font-bold">
          Recommendation
        </h2>

        <p className="mt-3" data-capstone="recommendation">
          I recommend that the marketing team allocate the additional
$490 per week to Search. Search provides a typical quarterly
net gain of $5,111 with only a 4% chance of losing money.
This is below the team's acceptable risk limit of 10%.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">

          {/* Recommended marketing channel */}
          <div className="rounded-lg border p-5">
            <p>Recommended channel</p>

            <strong className="text-2xl capitalize">
              {candidate?.label ?? answer.action}
            </strong>

            <p
              className="mt-1 text-sm"
              data-capstone="action"
            >
              {answer.action}
            </p>
          </div>

          {/* Typical quarterly net gain */}
          <div className="rounded-lg border p-5">
            <p>Typical net gain ($)</p>

            <strong
              className="text-2xl"
              data-capstone="typical-result"
            >
              {Math.round(recommended.typical)}
            </strong>
          </div>

          {/* Probability of losing money */}
          <div className="rounded-lg border p-5">
            <p>Risk of losing money</p>

            <strong
              className="text-2xl"
              data-capstone="chance-short"
            >
              {Math.round(recommended.chanceShort * 100)}%
            </strong>
          </div>

        </div>
      </section>

      {/* Section 2: Outcome comparison */}
      <section>
        <h2 className="text-2xl font-bold">
          Why not the other channel?
        </h2>

        <p className="mt-3">
          Although Events provides a higher typical net gain of
$5,970, it has a 15% chance of losing money. This exceeds
the team's acceptable risk limit of 10%. Search offers
a better balance between potential earnings and financial risk.
        </p>

        <div
          data-capstone="outcome-chart"
          className="mt-6 space-y-6"
        >
          {histograms.map((h) => (
            <div
              key={h.id}
              className="rounded-lg border p-5"
            >
              <h3 className="text-lg font-semibold capitalize">
                {h.label}
              </h3>

              <svg
                viewBox="0 0 800 240"
                width="100%"
                role="img"
                aria-label={`${h.label} simulated outcomes`}
              >

                {/* Histogram bars */}
                {h.bins.map((count, i) => {
                  const height = (count / maxCount) * 160;

                  return (
                    <rect
                      key={i}
                      x={60 + i * (700 / binCount)}
                      y={190 - height}
                      width={700 / binCount - 1}
                      height={height}
                      fill={
                        h.id === answer.action
                          ? "#2563eb"
                          : "#f59e0b"
                      }
                      opacity={0.85}
                    />
                  );
                })}

                {/* Horizontal axis */}
                <line
                  x1={60}
                  y1={190}
                  x2={760}
                  y2={190}
                  stroke="currentColor"
                />

                {/* Vertical axis */}
                <line
                  x1={60}
                  y1={30}
                  x2={60}
                  y2={190}
                  stroke="currentColor"
                />

                {/* Shared vertical scale */}
                {Array.from({ length: 5 }, (_, i) => {
                  const count = (maxCount * i) / 4;

                  return (
                    <text
                      key={i}
                      x={50}
                      y={194 - (160 * i) / 4}
                      textAnchor="end"
                      fill="currentColor"
                      fontSize={11}
                    >
                      {Math.round(count)}
                    </text>
                  );
                })}

                {/* Vertical axis label */}
                <text
                  x={15}
                  y={110}
                  transform="rotate(-90 15 110)"
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize={12}
                >
                  Number of runs
                </text>

                {/* Break-even threshold */}
                <line
                  x1={thresholdX}
                  x2={thresholdX}
                  y1={20}
                  y2={190}
                  stroke="#dc2626"
                  strokeWidth={2}
                  strokeDasharray="6 4"
                />

                {/* Break-even label */}
                <text
                  x={thresholdX}
                  y={15}
                  textAnchor="middle"
                  fill="#dc2626"
                  fontSize={12}
                >
                  Break-even (${probe.limit.atLeast})
                </text>

                {/* Shared horizontal scale */}
                {Array.from({ length: 5 }, (_, i) => {
                  const value = min + ((max - min) * i) / 4;

                  return (
                    <text
                      key={i}
                      x={60 + (700 * i) / 4}
                      y={210}
                      textAnchor="middle"
                      fill="currentColor"
                      fontSize={12}
                    >
                      ${Math.round(value).toLocaleString("en-US")}
                    </text>
                  );
                })}

                {/* Horizontal axis label */}
                <text
                  x={410}
                  y={235}
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize={13}
                >
                  Quarterly net gain ($)
                </text>

              </svg>
            </div>
          ))}
        </div>

        {/* Chart legend */}
        <div className="mt-4 flex flex-wrap gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded bg-blue-600" />
            Recommended channel
          </div>

          <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded bg-amber-500" />
            Alternative channel
          </div>

          <div className="flex items-center gap-2">
            <span className="w-6 border-t-2 border-dashed border-red-600" />
            Break-even threshold
          </div>
        </div>
      </section>

      {/* Section 3: Uncertainty */}
      <section>
        <h2 className="text-2xl font-bold">
          How sure can we be?
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
  {probe.candidates.map((c) => {
    const outcome = answer.outcomes[c.id];

    return (
      <div key={c.id} className="rounded-lg border p-5">
        <h3 className="text-xl font-semibold capitalize">
          {c.label}
        </h3>

        <p className="mt-3">Typical net gain</p>
        <strong>
          ${Math.round(outcome.typical).toLocaleString("en-US")}
        </strong>

        <p className="mt-3">90% interval</p>
        <strong>
          ${Math.round(outcome.low).toLocaleString("en-US")}
          {" to "}
          ${Math.round(outcome.high).toLocaleString("en-US")}
        </strong>

        <p className="mt-3">Risk of losing money</p>
        <strong>
          {Math.round(outcome.chanceShort * 100)}%
        </strong>
      </div>
    );
  })}
</div>

<div className="mt-4 rounded-lg border p-5">
  <p>Chance the recommended channel outperforms the alternative</p>

  <strong className="text-2xl">
    {Math.round(answer.chanceActionBeatsOther * 100)}%
  </strong>
</div>

<p data-capstone="uncertainty" className="mt-4">
  Search has a 90% interval of $430 to $9,815, while Events
has a wider interval of -$3,825 to $15,903. Events has only
3 high-spend observations compared to 11 for Search.
This makes the estimated average for Events less reliable.
Collecting more historical data could improve the reliability
of these estimates and reduce uncertainty.
</p>
      </section>

      {/* Section 4: History and recipe */}
      <section>
        <h2 className="text-2xl font-bold">
          Where do these numbers come from?
        </h2>

        {/* Historical data chart */}
<div
  data-capstone="all-data-chart"
  data-points={probe.history.length}
  className="mt-6 rounded-lg border p-5"
>
  <h3 className="text-xl font-semibold">
    Historical Weekly Revenue
  </h3>

  <p className="mt-2 text-sm">
    Total observations: {probe.history.length}
  </p>

  <svg
    viewBox="0 0 800 360"
    width="100%"
    role="img"
    aria-label="Historical weekly revenue by channel and spending level"
  >
    {/* Horizontal grid lines and revenue labels */}
    {Array.from({ length: 7 }, (_, i) => {
      const revenue = 4000 + i * 1000;
      const y = 280 - (i / 6) * 240;

      return (
        <g key={i}>
          <line
            x1={80}
            x2={760}
            y1={y}
            y2={y}
            stroke="currentColor"
            opacity={0.15}
          />

          <text
            x={70}
            y={y + 4}
            textAnchor="end"
            fill="currentColor"
            fontSize={12}
          >
            ${revenue.toLocaleString("en-US")}
          </text>
        </g>
      );
    })}

    {/* Draw exactly one dot for each historical observation */}
    {probe.history.map((row, i) => {
      const channel = String(row.channel);
      const spend = String(row.spend);
      const revenue = Number(row.revenue);

      const group =
        channel === "events"
          ? spend === "low" ? 0 : 1
          : spend === "low" ? 2 : 3;

      // Separate overlapping observations horizontally.
      const jitter = ((i * 37) % 61) - 30;

      const x = 165 + group * 170 + jitter;
      const y = 280 - ((revenue - 4000) / 6000) * 240;

      return (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={5}
          fill={channel === "events" ? "#f59e0b" : "#2563eb"}
          opacity={0.85}
        >
          <title>
            {`${channel}, ${spend} spend: $${revenue}`}
          </title>
        </circle>
      );
    })}

    {/* Chart axes */}
    <line
      x1={80}
      y1={40}
      x2={80}
      y2={280}
      stroke="currentColor"
    />

    <line
      x1={80}
      y1={280}
      x2={760}
      y2={280}
      stroke="currentColor"
    />

    {/* Spending level labels */}
    {["Low spend", "High spend", "Low spend", "High spend"].map(
      (label, i) => (
        <text
          key={i}
          x={165 + i * 170}
          y={305}
          textAnchor="middle"
          fill="currentColor"
          fontSize={13}
        >
          {label}
        </text>
      )
    )}

    {/* Marketing channel labels */}
    <text
      x={250}
      y={335}
      textAnchor="middle"
      fill="#f59e0b"
      fontSize={16}
      fontWeight="bold"
    >
      Events
    </text>

    <text
      x={590}
      y={335}
      textAnchor="middle"
      fill="#2563eb"
      fontSize={16}
      fontWeight="bold"
    >
      Search
    </text>

    {/* Vertical axis label */}
    <text
      x={15}
      y={160}
      transform="rotate(-90 15 160)"
      textAnchor="middle"
      fill="currentColor"
      fontSize={13}
    >
      Weekly revenue ($)
    </text>
  </svg>
</div>

        {/* DAG diagram */}
<div
  data-capstone="dag"
  data-nodes={probe.dag.nodes.length}
  className="mt-6 rounded-lg border p-5"
>
  <h3 className="text-xl font-semibold">
    How the Simulation Works
  </h3>

  <svg
    viewBox="0 0 800 390"
    width="100%"
    role="img"
    aria-label="Marketing channel simulation diagram"
  >
    {/* Arrow definition */}
    <defs>
      <marker
        id="dag-arrow"
        markerWidth={10}
        markerHeight={10}
        refX={9}
        refY={3}
        orient="auto"
      >
        <path
          d="M0,0 L0,6 L9,3 Z"
          fill="currentColor"
        />
      </marker>
    </defs>

    {/* Channel headings */}
    <text
      x={200}
      y={25}
      textAnchor="middle"
      fontSize={18}
      fontWeight="bold"
      fill="#f59e0b"
    >
      Events
    </text>

    <text
      x={600}
      y={25}
      textAnchor="middle"
      fontSize={18}
      fontWeight="bold"
      fill="#2563eb"
    >
      Search
    </text>

    {/* Draw one arrow for each relationship */}
    {probe.dag.edges.map(([from, to], i) => {
      const fromIndex = probe.dag.nodes.findIndex(
        (node) => node.id === from
      );

      const toIndex = probe.dag.nodes.findIndex(
        (node) => node.id === to
      );

      const x1 = fromIndex < 3 ? 200 : 600;
      const x2 = toIndex < 3 ? 200 : 600;

      const y1 = 45 + (fromIndex % 3) * 120 + 75;
      const y2 = 45 + (toIndex % 3) * 120;

      return (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2 - 5}
          stroke="currentColor"
          strokeWidth={2}
          markerEnd="url(#dag-arrow)"
        />
      );
    })}

    {/* Draw one box for each simulation node */}
    {probe.dag.nodes.map((node, i) => {
      const x = i < 3 ? 200 : 600;
      const y = 45 + (i % 3) * 120;

      const labels = [
        "Average extra revenue",
        "Weekly extra revenue",
        "Quarterly net gain",
      ];

      const repeatLabels = [
        "Once per quarter",
        "Every week",
        "Final result",
      ];

      const color = i < 3 ? "#f59e0b" : "#2563eb";

      return (
        <g key={node.id}>
          <rect
            x={x - 165}
            y={y}
            width={330}
            height={75}
            rx={10}
            fill={color}
            fillOpacity={0.12}
            stroke={color}
            strokeWidth={2}
          />

          <text
            x={x}
            y={y + 28}
            textAnchor="middle"
            fill="currentColor"
            fontSize={16}
            fontWeight="bold"
          >
            {i + 1}. {labels[i % 3]}
          </text>

          <text
            x={x}
            y={y + 53}
            textAnchor="middle"
            fill="currentColor"
            fontSize={13}
          >
            {repeatLabels[i % 3]}
          </text>
        </g>
      );
    })}
  </svg>

  {/* Numbered explanations for each simulation node */}
  <ol className="mt-6 list-decimal space-y-3 pl-6">
    {probe.dag.nodes.map((node) => (
      <li key={node.id}>
        {node.plain}
      </li>
    ))}
  </ol>
</div>
      </section>

    </main>
  );
}