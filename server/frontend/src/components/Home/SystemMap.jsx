import React from "react";

const LANES = [
  { id: "browser", name: "Browser", tech: "React", role: "This page, with routes loaded on demand." },
  { id: "django", name: "Django", tech: "Python", role: "Serves the app, signs you in, and proxies every data call." },
  { id: "express", name: "Express", tech: "Node · MongoDB", role: "Stores the dealerships and their reviews." },
  { id: "flask", name: "Flask", tech: "NLTK VADER", role: "Scores review text as positive, neutral, or negative." },
];

const lane = Object.fromEntries(LANES.map((l, i) => [l.id, i]));

// The request path in djangoapp/views.py get_dealer_reviews, in order.
const STEPS = [
  { from: "browser", to: "django", call: "GET /djangoapp/reviews/dealer/15" },
  { from: "django", to: "express", call: "GET /fetchReviews/dealer/15" },
  { from: "express", to: "django", call: "reviews from MongoDB", reply: true },
  { from: "django", to: "flask", call: "POST /analyze, once per review" },
  { from: "flask", to: "django", call: "{ sentiment, scores }", reply: true },
  { from: "django", to: "browser", call: "reviews with sentiment labels", reply: true },
];

// Each lane is two grid tracks wide; its lifeline sits on the line between them.
const center = (id) => 2 * lane[id] + 2;

const Arrow = ({ step }) => {
  const leftToRight = lane[step.to] > lane[step.from];
  const start = Math.min(center(step.from), center(step.to));
  const end = Math.max(center(step.from), center(step.to));
  return (
    <div className="relative hidden h-14 md:block" style={{ gridColumn: `${start} / ${end}`, gridRow: 1 }} aria-hidden="true">
      <span
        className={`absolute inset-x-0 bottom-4 border-t ${step.reply ? "border-dashed border-muted/70" : "border-accent"}`}
      />
      <svg
        viewBox="0 0 8 8"
        className={`absolute bottom-[12px] size-2 ${leftToRight ? "-right-px" : "-left-px rotate-180"} ${step.reply ? "fill-muted" : "fill-accent"}`}
      >
        <path d="M0 0 8 4 0 8z" />
      </svg>
    </div>
  );
};

const SystemMap = () => (
  <section id="how-it-works" className="scroll-mt-16 border-y border-separator bg-background-secondary">
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
      <div className="max-w-2xl">
        <h2 className="text-3xl font-semibold font-stretch-semi-expanded tracking-tight text-balance sm:text-4xl">What happens when you open a dealer's reviews</h2>
        <p className="mt-4 text-lg text-foreground/75">
          Four services take part every time. This is the real request path for one dealer (number 15), in the order the
          code runs it.
        </p>
      </div>

      <div className="relative mt-12">
        {/* Lifelines, one per lane, behind the arrows (desktop only). */}
        <div className="pointer-events-none absolute inset-0 hidden grid-cols-8 md:grid" aria-hidden="true">
          {LANES.map((l) => (
            <span key={l.id} className="col-span-2 mx-auto mt-28 w-px bg-separator" />
          ))}
        </div>

        {/* No column gap on desktop: each header must share its lane's centre with the lifeline grid. */}
        <ul className="relative grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-4 md:gap-x-0 md:gap-y-0">
          {LANES.map((l) => (
            <li key={l.id} className="md:px-3 md:text-center">
              <p className="text-lg font-semibold tracking-tight">{l.name}</p>
              <p className="font-mono text-xs text-foreground/70">{l.tech}</p>
              <p className="mt-2 text-sm text-foreground/75 md:mx-auto md:h-10 md:max-w-[15rem]">{l.role}</p>
            </li>
          ))}
        </ul>

        <ol className="relative mt-10 space-y-5 md:mt-6 md:space-y-0">
          {STEPS.map((step, i) => (
            <li key={step.call} className="md:grid md:grid-cols-8 md:items-end">
              {/* Mobile: a numbered line with the hop spelled out. */}
              <div className="flex gap-3 md:hidden">
                <span className="mt-0.5 font-mono text-xs tabular-nums text-foreground/70">{i + 1}</span>
                <div>
                  <p className="text-sm font-medium">
                    {LANES[lane[step.from]].name} → {LANES[lane[step.to]].name}
                    {/* Spelled out so request vs reply doesn't rely on colour alone. */}
                    <span className="ml-2 font-mono text-xs font-normal text-foreground/70">
                      {step.reply ? "reply" : "request"}
                    </span>
                  </p>
                  <p className={`mt-0.5 font-mono text-xs ${step.reply ? "text-foreground/70" : "text-accent-ink"}`}>
                    {step.call}
                  </p>
                </div>
              </div>

              {/* Desktop: an arrow between lifelines, labelled above. */}
              <p
                className="hidden self-end pb-7 text-center font-mono text-xs md:block"
                style={{
                  gridColumn: `${Math.min(center(step.from), center(step.to))} / ${Math.max(center(step.from), center(step.to))}`,
                  gridRow: 1,
                }}
              >
                <span className="sr-only">
                  Step {i + 1}, {LANES[lane[step.from]].name} to {LANES[lane[step.to]].name}:{" "}
                </span>
                <span aria-hidden="true" className="mr-2 tabular-nums text-foreground/70">{i + 1}</span>
                <span className={step.reply ? "text-foreground/70" : "text-accent-ink"}>{step.call}</span>
              </p>
              <Arrow step={step} />
            </li>
          ))}
        </ol>
      </div>

      <p className="mt-12 max-w-[65ch] text-sm text-foreground/75">
        Posting a review runs the same path the other way: Django checks your session, then Express writes the review to
        MongoDB. The Flask scores are worked out each time reviews are read, never stored.
      </p>
    </div>
  </section>
);

export default SystemMap;
