import React, { useEffect } from "react";
import { buttonVariants } from "@heroui/react";
import { Footer, SiteNav, SOURCE_URL, readUsername } from "../Home/SiteChrome";
import "@fontsource-variable/archivo/wdth.css";
import "@fontsource-variable/martian-mono/wdth.css";
import "../../styles/home.generated.css";

// Every fact here mirrors the repo (README, settings, seed data). Keep it in step when they change.

const SERVICES = [
  {
    name: "React frontend",
    stack: "React 19 · React Router · HeroUI · Tailwind v4",
    job: "The pages you're reading, built to static files that Django serves. Each route loads on demand.",
  },
  {
    name: "Django",
    stack: "Python · SQLite · gunicorn",
    job: "Signs people in with sessions, stores car makes and models, and proxies every data call to the services behind it.",
  },
  {
    name: "Express",
    stack: "Node · Mongoose · MongoDB",
    job: "Stores the dealerships and their reviews. It reseeds MongoDB from JSON files each time it starts.",
  },
  {
    name: "Flask",
    stack: "NLTK VADER",
    job: "Scores review text from −1 to +1 and labels it positive, neutral or negative. Scores are computed on every read, never stored.",
  },
];

const FICTIONAL = [
  "The 50 dealerships, their names and addresses",
  "The reviewers and the 50 seed reviews",
  "The cars in each review",
];

const REAL = [
  "The dealer and state counts, read live from MongoDB",
  "Every sentiment label and score, computed by the Flask service",
  "Accounts and sign-in, as Django sessions",
  "Reviews you post, written to MongoDB through Express",
];

const LIMITS = [
  {
    title: "It reads words, not intent.",
    body: "VADER adds up the feeling of each word it knows. Sarcasm and irony read as what the words literally say, so “fantastic work, really impressive” scores as praise.",
  },
  {
    title: "“But” tips the balance.",
    body: "The clause after “but” counts for more than the one before it, so mixed reviews usually land on whichever side comes last.",
  },
  {
    title: "Neutral is a narrow band.",
    body: "Anything scoring between −0.05 and +0.05 reads as neutral. A review that mentions a problem and a fix can cancel out to neutral even when the writer was annoyed.",
  },
  {
    title: "It's built for English.",
    body: "The lexicon is English, so reviews in other languages mostly score as neutral.",
  },
];

const Section = ({ id, title, children }) => (
  <section aria-labelledby={id} className="grid gap-6 border-t border-separator py-14 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-16">
    <h2 id={id} className="text-2xl font-semibold font-stretch-semi-expanded tracking-tight text-balance">
      {title}
    </h2>
    <div className="max-w-[65ch]">{children}</div>
  </section>
);

const Bullet = ({ tone, children }) => (
  <li className="flex gap-3">
    <span
      className={`mt-2.5 size-1.5 shrink-0 rounded-full ${tone === "real" ? "bg-accent" : "bg-muted/60"}`}
      aria-hidden="true"
    />
    <span>{children}</span>
  </li>
);

const About = () => {
  const username = readUsername();

  useEffect(() => {
    document.title = "About this project | Dealerships";
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent/25">
      <SiteNav username={username} current="/about" />
      <main className="mx-auto max-w-6xl px-4 sm:px-6">
        <header className="max-w-3xl py-16 sm:py-24">
          <h1 className="text-[2rem] font-semibold font-stretch-semi-expanded leading-[1.1] tracking-tight text-balance sm:text-5xl">
            A dealer review site that shows its working parts.
          </h1>
          <p className="mt-6 max-w-[65ch] text-lg leading-relaxed text-foreground/80">
            Dealerships is a full-stack portfolio project. It lists a fictional national network of car dealerships and
            their customer reviews. Instead of star ratings, a sentiment model labels every review from its text. It runs
            as four separate services, so how they talk to each other is part of what you're looking at.
          </p>
        </header>

        <Section id="about-truth" title="What's made up, and what isn't">
          <p className="leading-relaxed text-foreground/80">
            The data is fiction, and it's labelled that way. Everything the system does with it is real. There are no
            star ratings, testimonials or sales figures anywhere on the site.
          </p>
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold tracking-tight">Fictional</h3>
              <ul className="mt-3 space-y-2 leading-relaxed text-foreground/80">
                {FICTIONAL.map((item) => (
                  <Bullet key={item}>{item}</Bullet>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold tracking-tight">Real</h3>
              <ul className="mt-3 space-y-2 leading-relaxed text-foreground/80">
                {REAL.map((item) => (
                  <Bullet key={item} tone="real">
                    {item}
                  </Bullet>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        <Section id="about-services" title="Four services">
          <dl className="divide-y divide-separator border-y border-separator">
            {SERVICES.map((service) => (
              <div key={service.name} className="grid gap-1 py-5 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-6">
                <dt>
                  <span className="block font-semibold tracking-tight">{service.name}</span>
                  <span className="mt-1 block font-mono text-xs leading-relaxed text-foreground/70">{service.stack}</span>
                </dt>
                <dd className="leading-relaxed text-foreground/80">{service.job}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 leading-relaxed text-foreground/80">
            The home page traces{" "}
            <a
              href="/#how-it-works"
              className="font-medium text-accent-ink underline decoration-accent-ink/35 underline-offset-4 hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-ink"
            >
              one real request through all four
            </a>
            , step by step.
          </p>
        </Section>

        <Section id="about-limits" title="What the model gets wrong">
          <p className="leading-relaxed text-foreground/80">
            VADER is a rule-based model with a fixed word list. It's fast and needs no training, and it's wrong in ways
            you can predict.
          </p>
          <ul className="mt-8 space-y-6">
            {LIMITS.map((limit) => (
              <li key={limit.title}>
                <h3 className="font-semibold tracking-tight">{limit.title}</h3>
                <p className="mt-1 leading-relaxed text-foreground/80">{limit.body}</p>
              </li>
            ))}
          </ul>
          <p className="mt-8 leading-relaxed text-foreground/80">
            You can watch each of these happen with the{" "}
            <a
              href="/"
              className="font-medium text-accent-ink underline decoration-accent-ink/35 underline-offset-4 hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-ink"
            >
              analyzer on the home page
            </a>
            . Try the “Sarcastic” example.
          </p>
        </Section>

        <Section id="about-shipping" title="How it ships">
          <ul className="space-y-3 leading-relaxed text-foreground/80">
            <li>
              One Docker image for Django. On start it runs migrations and <code className="font-mono text-sm">collectstatic</code>,
              then serves the app through gunicorn.
            </li>
            <li>A Kubernetes Deployment runs that image.</li>
            <li>CI runs flake8 on the Python and JSHint on the Express service for every push and pull request to main.</li>
          </ul>
        </Section>

        <Section id="about-progress" title="Still being rebuilt">
          <p className="leading-relaxed text-foreground/80">
            This page and the home page use the new design. The dealer list, dealer pages, review form and sign-in still
            run on the original Bootstrap screens. They work, and they're next in line to be rebuilt.
          </p>
        </Section>

        <section className="flex flex-col items-start justify-between gap-6 border-t border-separator py-14 sm:flex-row sm:items-center">
          <p className="max-w-xl text-lg leading-relaxed">
            Built by Felipe Viana. Questions, bugs or ideas are welcome as issues on GitHub.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href={SOURCE_URL} className={buttonVariants({ size: "lg" })}>
              Read the source
            </a>
            <a href="/dealers" className={buttonVariants({ size: "lg", variant: "outline" })}>
              Browse dealerships
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
