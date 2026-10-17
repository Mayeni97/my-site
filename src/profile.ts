/**
 * ═══════════════════════════════════════════════════════════════════════
 *  YOUR PROFILE — this is the main file you edit. (The other one is
 *  src/theme.ts, where you pick your look.)
 * ═══════════════════════════════════════════════════════════════════════
 *
 * Everything here flows automatically to:
 *   - /api/whoami and /api/profile  (what the course platform reads)
 *   - your home page and /about     (what humans read)
 *
 * Because both pages and APIs read from THIS one object, they can never
 * disagree, and "pages match the API" is one of the graded checks.
 *
 * Fill in every field, replace the placeholder photo, and you're done.
 */

export const profile = {
  /** Your name as you want it to appear everywhere. */
  displayName: "Mayowa Ayeni",

  /** Your UD email — must match the one you signed into the course with. */
  email: "Mayeni@udel.edu",

  /** Where you're from. Shows on your roster card and /about. */
  hometown: "Newark, Delaware",

  /**
   * 2 to 4 fun facts (the grader checks the count!). Real ones: they're
   * how classmates find something to say hello about.
   */
  funFacts: [
    "I lived in 3 countries.",
    "I am a nurse.",
  ],

  /** One decision you're proud of, in a sentence. */
  decisionImProudOf:
    "I was working full time hours and still managed to graduate a year early.",

  /**
   * Your photo. Replace public/photo.svg with a real photo of you
   * (e.g. put photo.jpg in the public/ folder and change this to "/photo.jpg").
   * It must be a real image file: the grader fetches it and checks.
   */
  photoPath: "/image.jpeg",

  /**
   * Who can see your roster card:
   *   "class"          — your classmates and the professor (recommended)
   *   "professor-only" — just the professor
   */
  rosterVisibility: "class" as "class" | "professor-only",

  /** A one-line tagline for your home page. Make it yours. */
  tagline: "Nursing by trade, data Engineer by choice.",

  /**
   * A short bio for your home page: two or three sentences, written like
   * a person, not a resume. What are you studying? What do you care about?
   */
  bio: "I'm a licensed practical nurse and a University of Delaware grad student in business analytics. I like turning messy real world data into decisions people can act on. This site is where my course projects go live.",

  /**
   * Your GitHub repo URL. The course platform reads this from /api/health to
   * verify you have ≥ 5 commits spread over days (not one bulk dump)
   * Example: "https://github.com/your-username/your-repo"
   */
  repoUrl: "https://github.com/Mayeni97/my-site",
};
