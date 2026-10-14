import React, { useEffect, useState } from "react";
import { Skeleton } from "@heroui/react";

// What each service powers, so an outage says what the visitor loses.
const SERVICES = [
  { id: "django", name: "Django", lost: "nothing behind it can be reached" },
  { id: "express", name: "Express · MongoDB", lost: "the dealer list and reviews are unavailable" },
  { id: "flask", name: "Flask · VADER", lost: "reviews can't be labelled" },
];

const fetchJson = async (url, signal) => {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`${url} failed with ${res.status}`);
  return res.json();
};

// Live health of the four-service system, plus the dealer-network numbers when Express is up.
const useSystemStatus = () => {
  const [state, setState] = useState({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const ctrl = new AbortController();
    setState({ status: "loading" });
    (async () => {
      let health;
      try {
        health = await fetchJson("/djangoapp/status", ctrl.signal);
      } catch (err) {
        if (err.name === "AbortError") return;
        setState({ status: "ready", services: { django: { ok: false } } });
        return;
      }
      const services = { django: { ok: true }, ...health };
      let network = null;
      if (health.express?.ok) {
        try {
          const { dealers } = await fetchJson("/djangoapp/get_dealers", ctrl.signal);
          if (Array.isArray(dealers)) {
            network = { dealers: dealers.length, states: new Set(dealers.map((d) => d.state)).size };
          }
        } catch (err) {
          if (err.name === "AbortError") return;
        }
      }
      setState({ status: "ready", services, network });
    })();
    return () => ctrl.abort();
  }, [attempt]);

  return [state, () => setAttempt((n) => n + 1)];
};

const ServiceItem = ({ service, health }) => {
  const known = health !== undefined;
  const ok = known && health.ok;
  return (
    <li className="flex items-center gap-2">
      <span
        className={`size-2 shrink-0 rounded-full ${!known ? "bg-white/30" : ok ? "bg-accent" : "bg-fault"}`}
        aria-hidden="true"
      />
      <span className="text-white">{service.name}</span>
      <span className="font-mono text-xs tabular-nums text-white/60">
        {!known ? "unknown" : ok ? (health.ms != null ? `${health.ms} ms` : "up") : "offline"}
      </span>
    </li>
  );
};

const StatusStrip = () => {
  const [state, retry] = useSystemStatus();

  if (state.status === "loading") {
    return (
      <div aria-busy="true" aria-label="Checking services">
        <Skeleton className="h-4 w-72 rounded" />
        <Skeleton className="mt-3 h-4 w-48 rounded" />
      </div>
    );
  }

  const { services, network } = state;
  // Django down means the other two are unknown, not down.
  const down = services.django.ok
    ? SERVICES.filter((s) => services[s.id] && !services[s.id].ok)
    : [SERVICES[0]];

  return (
    <div className="text-sm">
      <h2 className="sr-only">Service status</h2>
      <ul className="flex flex-wrap gap-x-5 gap-y-2">
        {SERVICES.map((service) => (
          <ServiceItem key={service.id} service={service} health={services[service.id]} />
        ))}
      </ul>
      {down.length > 0 ? (
        <p className="mt-3 text-white/80">
          {down.map((s) => `${s.name.split(" ")[0]} is offline, so ${s.lost}.`).join(" ")}{" "}
          <button
            type="button"
            onClick={retry}
            className="font-medium text-white underline decoration-white/40 underline-offset-4 hover:decoration-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Check again
          </button>
        </p>
      ) : (
        network && (
          <p className="mt-3 text-white/70">
            <strong className="font-semibold tabular-nums text-white">{network.dealers}</strong> dealerships in{" "}
            <strong className="font-semibold tabular-nums text-white">{network.states}</strong> states, served live
            from MongoDB.
          </p>
        )
      )}
    </div>
  );
};

export default StatusStrip;
