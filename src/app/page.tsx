import Link from "next/link";
import { profile } from "@/profile";
import { Guestbook } from "@/components/Guestbook";

/**
 * Your home page. It's already personalized: everything here reads from
 * src/profile.ts. The "portfolio of decision services" section below is the
 * scaffold the course expects: each lane's challenge fills in one slot.
 */

const SERVICES = [
  {
    lane: 2,
    title: "Reasoning & Uncertainty",
    href: "/reasoning",
    blurb: "Audits syllogisms, updates on base rates, reads Bernoulli businesses.",
  },
  {
    lane: 3,
    title: "Decision Simulator",
    href: "/simulator",
    blurb: "Simulates investment games and recommends the growth-optimal stake.",
  },
  {
    lane: 4,
    title: "Causality Audit",
    href: "/causality",
    blurb: "Tells forks from pipes from colliders, and when to stratify.",
  },
  {
    lane: 5,
    title: "Capstone: Live Decision Service",
    href: "/capstone",
    blurb: "A full advocacy report on a real decision domain, backed by data.",
  },
];

export default function HomePage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-14 sm:py-20">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-2xl border border-line bg-surface px-6 py-10 sm:px-10 sm:py-14">
        <div aria-hidden className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-accent opacity-10" />
        <div className="relative max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            {profile.tagline}
          </p>
          <h1 className="mt-4 text-5xl font-bold tracking-tight sm:text-6xl">{profile.displayName}</h1>
          <p className="mt-6 max-w-prose text-lg text-muted">{profile.bio}</p>
          <div className="mt-8 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-widest text-muted">
            <span className="rounded-full border border-line px-3 py-2">Nurse</span>
            <span className="rounded-full border border-line px-3 py-2">Business analytics</span>
            <span className="rounded-full border border-line px-3 py-2">Live portfolio</span>
          </div>
        </div>
      </section>

      {/* ── Portfolio of decision services ───────────────────────────── */}
      <section className="mt-16">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">The studio</p>
            <h2 className="mt-2 text-3xl font-bold">A portfolio of decision services</h2>
          </div>
          <p className="max-w-xs text-sm text-muted">One live service per lane, built to make uncertainty easier to act on.</p>
        </div>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {SERVICES.map((s) => (
            <li key={s.lane} className="group rounded-2xl border border-line bg-surface p-6 hover:-translate-y-1 hover:border-accent hover:shadow-lg hover:shadow-accent/10">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-widest text-accent">Lane {s.lane}</p>
                <span aria-hidden className="text-xl text-accent transition group-hover:translate-x-1">↗</span>
              </div>
              <h3 className="mt-6 text-xl font-bold">
                <Link href={s.href} className="transition group-hover:text-accent">
                  {s.title}
                </Link>
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted">{s.blurb}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Guestbook: the live database round-trip ──────────────────── */}
      <section className="mt-16">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Leave a mark</p>
        <h2 className="mt-2 text-3xl font-bold">Guestbook</h2>
        <p className="mt-2 max-w-prose text-muted">
          Signed entries live in my own database: proof this site does a real round-trip.
        </p>
        <Guestbook />
      </section>
    </main>
  );
}
