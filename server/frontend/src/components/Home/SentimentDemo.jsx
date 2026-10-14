import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@heroui/react";

const MAX_CHARS = 500;
const TIMEOUT_MS = 15000;

// Short labels so the chips fit one row on a phone. "Sarcastic" is there to watch the model fail.
const EXAMPLES = [
  { label: "Happy", text: "Best buying experience I've ever had. Friendly, fast, and honest about the car's history." },
  { label: "Mixed", text: "The finance guy was pushy, but the service team was great." },
  { label: "Angry", text: "They sold me a car with a cracked windshield and stopped answering my calls." },
  { label: "Sarcastic", text: "Oh great, they 'fixed' the AC and now it blows hot air. Fantastic work, really impressive." },
];

// The three hops a demo request makes. Express/MongoDB isn't involved here:
// Django forwards the text straight to the Flask analyzer.
const HOPS = [
  { id: "browser", name: "Your browser", detail: "React" },
  { id: "django", name: "Django", detail: "/djangoapp/analyze" },
  { id: "flask", name: "Flask · VADER", detail: "/analyze" },
];

// Light tints of the success / neutral / danger hues, legible on the dark hero.
const TONE = {
  positive: { text: "text-reading-positive", fill: "bg-reading-positive", label: "Positive" },
  neutral: { text: "text-reading-neutral", fill: "bg-reading-neutral", label: "Neutral" },
  negative: { text: "text-reading-negative", fill: "bg-reading-negative", label: "Negative" },
};

const signed = (n) => (n > 0 ? "+" : n < 0 ? "−" : "") + Math.abs(n).toFixed(2);

// VADER's pos/neu/neg are shares of the text's lexicon weight. Round them so they always total
// 100 (largest remainder), instead of the 99 or 101 that independent rounding gives.
const shares = ({ pos, neu, neg }) => {
  const raw = [pos, neu, neg];
  const total = raw.reduce((a, b) => a + b, 0) || 1;
  const scaled = raw.map((v) => (v / total) * 100);
  const out = scaled.map(Math.floor);
  const order = scaled.map((v, i) => [v - Math.floor(v), i]).sort((a, b) => b[0] - a[0]);
  const missing = 100 - out.reduce((a, b) => a + b, 0);
  for (let k = 0; k < missing; k += 1) out[order[k][1]] += 1;
  return out;
};

// Which hop is in which state, derived from the request phase.
const hopStates = (state) => {
  switch (state.phase) {
    case "pending":
      return { browser: "done", django: "active", flask: "active" };
    case "done":
      return { browser: "done", django: "done", flask: "done" };
    case "invalid":
      return { browser: "done", django: "done", flask: "idle" };
    case "analyzer-down":
      return { browser: "done", django: "done", flask: "failed" };
    case "api-down":
      return { browser: "done", django: "failed", flask: "idle" };
    default:
      return { browser: "idle", django: "idle", flask: "idle" };
  }
};

const useAnalyzer = () => {
  const [state, setState] = useState({ phase: "idle" });
  const controller = useRef(null);
  // Consecutive failures, so a retry that fails the same way still reads as a new outcome.
  const failures = useRef(0);

  useEffect(() => () => controller.current?.abort(), []);

  // `sample` marks the run made on page load, so the first reading is labelled as an example.
  const analyze = useCallback(async (text, { sample = false } = {}) => {
    const failed = (phase, extra = {}) => {
      failures.current += 1;
      return { phase, attempts: failures.current, ...extra };
    };
    controller.current?.abort();
    const ctrl = new AbortController();
    controller.current = ctrl;
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      ctrl.abort();
    }, TIMEOUT_MS);
    // Keep the previous result on screen (dimmed) while the new one is computed.
    setState((prev) => ({ phase: "pending", result: prev.result }));
    const started = performance.now();

    let res;
    let body;
    try {
      res = await fetch("/djangoapp/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
        signal: ctrl.signal,
      });
      body = await res.json();
    } catch (err) {
      if (err.name === "AbortError" && !timedOut) return;
      // No response, a timeout, or a non-JSON reply: Django itself never answered.
      setState(failed("api-down", { timedOut }));
      return;
    } finally {
      clearTimeout(timer);
    }
    const roundTripMs = Math.round(performance.now() - started);

    if (res.ok && body.sentiment) {
      failures.current = 0;
      setState({ phase: "done", result: { ...body, text, roundTripMs, sample } });
    } else if (res.status === 400) {
      setState({ phase: "invalid", message: body.error });
    } else if (body.error === "analyzer_unreachable") {
      setState(failed("analyzer-down"));
    } else {
      setState(failed("api-down"));
    }
  }, []);

  return [state, analyze];
};

const HopDot = ({ status }) => {
  const base = "relative z-10 block size-3 shrink-0 rounded-full transition-colors duration-300";
  if (status === "done") return <span className={`${base} bg-accent`} />;
  if (status === "failed") return <span className={`${base} bg-fault`} />;
  if (status === "active")
    return (
      <span className={`${base} bg-bay-panel ring-2 ring-accent`}>
        <span className="absolute inset-0 rounded-full bg-accent/60 motion-safe:animate-ping" />
      </span>
    );
  return <span className={`${base} bg-white/25`} />;
};

const HopLine = ({ from, to, delay }) => {
  const travelling = to === "active";
  const failed = to === "failed";
  const reached = from === "done" && (to === "done" || to === "failed" || to === "active");
  return (
    <span className="relative mx-1 h-px flex-1 overflow-hidden bg-white/15">
      {reached && !travelling && (
        <span
          className={`absolute inset-0 ${failed ? "bg-[repeating-linear-gradient(90deg,var(--color-fault)_0_4px,transparent_4px_8px)]" : "bg-accent/70"}`}
        />
      )}
      {travelling && (
        <span
          className="absolute inset-y-0 left-0 w-1/4 bg-accent motion-safe:animate-hop motion-reduce:w-full motion-reduce:bg-accent/50"
          style={{ animationDelay: delay }}
        />
      )}
    </span>
  );
};

const Pipeline = ({ state }) => {
  const s = hopStates(state);
  return (
    <figure className="mt-4 sm:mt-6">
      <figcaption className="sr-only">Request path for this analysis</figcaption>
      <div className="flex items-center" aria-hidden="true">
        <HopDot status={s.browser} />
        <HopLine from={s.browser} to={s.django} delay="0ms" />
        <HopDot status={s.django} />
        <HopLine from={s.django} to={s.flask} delay="550ms" />
        <HopDot status={s.flask} />
      </div>
      <ol className="mt-3 grid grid-cols-3 gap-2 text-xs">
        {HOPS.map((hop, i) => (
          <li
            key={hop.id}
            className={i === 0 ? "text-left" : i === 1 ? "text-center" : "text-right"}
          >
            <span className={`block font-medium ${s[hop.id] === "failed" ? "text-fault-ink" : "text-white"}`}>
              {hop.name}
              <span className="sr-only">: {s[hop.id] === "idle" ? "not reached" : s[hop.id] === "active" ? "working" : s[hop.id]}</span>
            </span>
            <span className="mt-0.5 hidden font-mono text-white/60 sm:block">{hop.detail}</span>
          </li>
        ))}
      </ol>
    </figure>
  );
};

const PolarityMeter = ({ compound, tone }) => {
  // Map -1..1 onto 0..100% of the track.
  const at = ((compound + 1) / 2) * 100;
  return (
    <div className="mt-5" aria-hidden="true">
      <div className="relative h-2 rounded-full bg-white/10">
        {/* VADER's neutral band: compound between -0.05 and +0.05 */}
        <span className="absolute inset-y-0 left-[47.5%] w-[5%] bg-white/20" />
        <span className="absolute inset-y-[-3px] left-1/2 w-px bg-white/40" />
        <span
          className={`absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4 ring-bay-panel transition-[left] duration-700 ease-out ${tone.fill}`}
          style={{ left: `${at}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between font-mono text-[11px] text-white/60">
        <span>−1 negative</span>
        <span>neutral</span>
        <span>positive +1</span>
      </div>
    </div>
  );
};

const LexiconWeight = ({ scores }) => {
  const [pos, neu, neg] = shares(scores);
  return (
    <p className="mt-3 font-mono text-xs tabular-nums text-white/60">
      lexicon weight: {pos}% positive · {neu}% neutral · {neg}% negative
    </p>
  );
};

const failureText = (state) =>
  state.phase === "analyzer-down"
    ? "Django answered, but the Flask sentiment service didn't respond."
    : state.timedOut
      ? "The request timed out. Django took more than 15 seconds to answer."
      : "Couldn't reach the Django API. The backend may be offline.";

const Result = ({ state, stale, onRetry }) => {
  if (state.phase === "pending" && !state.result) {
    return <p className="text-sm text-white/70">Analyzing…</p>;
  }
  if (state.phase === "done" || state.phase === "pending") {
    const { sentiment, scores, analyzer_ms: analyzerMs, roundTripMs } = state.result;
    const tone = TONE[sentiment] ?? TONE.neutral;
    const dimmed = stale || state.phase === "pending";
    return (
      <div>
        <div
          key={`${sentiment}-${roundTripMs}`}
          className={`transition-opacity duration-300 motion-safe:animate-reveal ${dimmed ? "opacity-40" : ""}`}
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <p className={`text-3xl font-semibold tracking-tight ${tone.text}`}>{tone.label}</p>
            {scores && (
              <p className="font-mono text-sm tabular-nums text-white/80">
                {state.result.sample && <span className="text-xs text-white/60">sample text · </span>}
                score {signed(scores.compound)}
              </p>
            )}
          </div>
          {scores && (
            <>
              <PolarityMeter compound={scores.compound} tone={tone} />
              <LexiconWeight scores={scores} />
            </>
          )}
          <p className="mt-1 font-mono text-xs tabular-nums text-white/60">
            Django → Flask {analyzerMs} ms · round trip {roundTripMs} ms
          </p>
        </div>
        {state.phase === "pending" ? (
          <p className="mt-2 text-xs text-white">Analyzing…</p>
        ) : stale ? (
          <p className="mt-2 text-xs text-white">Text edited. Press Analyze to update.</p>
        ) : (
          // The model's limits stay stated under every reading, not only when it slips.
          <p className="mt-3 border-l border-white/25 pl-3 text-xs leading-relaxed text-white/75">
            {/\bbut\b/i.test(state.result.text)
              ? `VADER weighs the clause after “but” more heavily, so mixed reviews often read ${
                  sentiment === "negative" ? "negative" : "positive"
                }.`
              : "VADER scores words, not intent. Sarcasm and irony read as what the words literally say."}
          </p>
        )}
      </div>
    );
  }
  if (state.phase === "analyzer-down" || state.phase === "api-down") {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-sm text-sm text-fault-ink">
          {failureText(state)}
          {state.attempts > 1 && (
            <span className="ml-1 font-mono text-xs tabular-nums text-white/60">· {state.attempts} tries</span>
          )}
        </p>
        <Button
          size="sm"
          variant="outline"
          onPress={onRetry}
          className="border-white/40 text-white hover:bg-white/10 pointer-coarse:h-11"
        >
          Try again
        </Button>
      </div>
    );
  }
  return null;
};

// One short sentence for screen readers per outcome, instead of re-reading the whole panel.
const announce = (state) => {
  if (state.phase === "done") {
    const { sentiment, scores } = state.result;
    const score = scores ? `, score ${signed(scores.compound)} on a scale of minus 1 to plus 1` : "";
    return `${TONE[sentiment]?.label ?? sentiment}${score}.`;
  }
  if (state.phase === "analyzer-down" || state.phase === "api-down") {
    const tries = state.attempts > 1 ? ` ${state.attempts} tries so far.` : "";
    return `Analysis failed. ${failureText(state)}${tries}`;
  }
  // Validation messages are announced by their own role="alert" under the field.
  return "";
};

const SentimentDemo = () => {
  const [text, setText] = useState(EXAMPLES[1].text);
  const [inputError, setInputError] = useState(null);
  const [state, analyze] = useAnalyzer();
  const textRef = useRef(text);
  const resultRef = useRef(null);
  textRef.current = text;

  const trimmed = text.trim();
  const tooLong = trimmed.length > MAX_CHARS;
  const pending = state.phase === "pending";
  const stale = state.result != null && state.result.text !== trimmed;
  const message = inputError ?? (state.phase === "invalid" ? state.message : null);

  // Run the prefilled example once so the first view already shows a result.
  useEffect(() => {
    analyze(textRef.current.trim(), { sample: true });
  }, [analyze]);

  // Validate on submit and say why, rather than silently disabling the button.
  const submit = (e) => {
    e.preventDefault();
    if (pending) return;
    if (!trimmed) {
      setInputError("Type a sentence to analyze.");
      return;
    }
    if (tooLong) {
      setInputError(`Keep it to ${MAX_CHARS} characters or fewer. You're at ${trimmed.length}.`);
      return;
    }
    setInputError(null);
    analyze(trimmed);
  };

  const pickExample = (example) => {
    setText(example.text);
    setInputError(null);
    analyze(example.text);
  };

  const retry = () => {
    analyze(trimmed);
    // The retry button unmounts; keep keyboard focus on the result area.
    resultRef.current?.focus();
  };

  return (
    <section
      aria-labelledby="sentiment-demo-title"
      className="rounded-2xl border border-white/12 bg-bay-panel p-5 shadow-[0_30px_60px_-24px_oklch(0.08_0.03_220/0.9)] sm:p-7"
    >
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="sentiment-demo-title" className="text-lg font-semibold tracking-tight text-white">
          Sentiment analyzer
        </h2>
        <span className="font-mono text-xs text-white/60">NLTK VADER</span>
      </div>
      <p className="mt-1 hidden text-sm text-white/70 sm:block">
        The same model that labels every review on this site. Write one and see what it hears.
      </p>

      <form onSubmit={submit} className="mt-4 sm:mt-5" noValidate>
        <label htmlFor="sentiment-demo-text" className="sr-only">
          Review text to analyze
        </label>
        <textarea
          id="sentiment-demo-text"
          rows={3}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (inputError) setInputError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit(e);
          }}
          aria-invalid={Boolean(message) || tooLong}
          aria-describedby={message ? "sentiment-demo-count sentiment-demo-error" : "sentiment-demo-count"}
          placeholder="Write a sentence about a dealership…"
          className="block h-[4.75rem] w-full resize-none rounded-xl sm:h-auto border border-white/15 bg-bay-well px-4 py-3 text-[15px] leading-relaxed text-white caret-accent [scrollbar-color:oklch(1_0_0/0.25)_transparent] [scrollbar-width:thin] placeholder:text-white/55 focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 aria-invalid:border-fault aria-invalid:focus-visible:ring-fault/50"
        />
        {/* Always mounted so screen readers pick up the alert when its text appears. */}
        <p id="sentiment-demo-error" role="alert" className="mt-2 text-sm text-fault-ink empty:hidden">
          {message}
        </p>
        {/* One row of chips at every width; it scrolls sideways rather than wrapping on narrow phones. */}
        <div
          role="group"
          aria-label="Example reviews"
          className="-mx-1 mt-2 flex items-center gap-2 overflow-x-auto px-1 py-1 [scrollbar-width:none]"
        >
          <span className="mr-1 hidden text-xs text-white/60 sm:inline" aria-hidden="true">
            Try
          </span>
          {EXAMPLES.map((example) => (
            <button
              key={example.label}
              type="button"
              onClick={() => pickExample(example)}
              aria-pressed={text === example.text}
              className="shrink-0 rounded-full border border-white/15 px-3 py-1 text-xs pointer-coarse:min-h-11 pointer-coarse:text-sm text-white/85 transition-colors hover:border-white/35 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white aria-pressed:border-accent aria-pressed:bg-accent/15 aria-pressed:text-white"
            >
              {example.label}
            </button>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-3 sm:mt-4">
          <span
            id="sentiment-demo-count"
            className={`font-mono text-xs tabular-nums ${tooLong ? "text-fault-ink" : "text-white/60"}`}
          >
            <span className="sr-only">Characters used: </span>
            {trimmed.length}/{MAX_CHARS}
          </span>
          <span className="hidden font-mono text-xs text-white/60 sm:inline" aria-hidden="true">
            · Ctrl ↵ to run
          </span>
          {/* aria-disabled rather than disabled: a disabled button drops keyboard focus mid-request.
              Outline style: the hero's one filled action is "Browse dealerships". */}
          <Button
            type="submit"
            variant="outline"
            aria-disabled={pending}
            className={`ml-auto border-white/40 text-white hover:bg-white/10 pointer-coarse:h-11 ${pending ? "cursor-progress opacity-70" : ""}`}
          >
            {pending ? "Analyzing…" : "Analyze"}
          </Button>
        </div>
      </form>

      <Pipeline state={state} />

      <div
        ref={resultRef}
        tabIndex={-1}
        role="region"
        aria-label="Analysis result"
        className="mt-4 min-h-[11.5rem] border-t border-white/10 pt-4 focus:outline-none sm:mt-6 sm:pt-5"
      >
        <Result state={state} stale={stale} onRetry={retry} />
      </div>
      <p className="sr-only" aria-live="polite">
        {announce(state)}
      </p>
    </section>
  );
};

export default SentimentDemo;
