import React, { useEffect } from "react";
import { buttonVariants } from "@heroui/react";
import SampleReviews from "./SampleReviews";
import SentimentDemo from "./SentimentDemo";
import StatusStrip from "./StatusStrip";
import SystemMap from "./SystemMap";
import { Footer, SiteNav, SOURCE_URL, readUsername } from "./SiteChrome";
import "@fontsource-variable/archivo/wdth.css";
import "@fontsource-variable/martian-mono/wdth.css";
import "../../styles/home.generated.css";

const Hero = ({ username }) => (
  <section className="bay relative isolate overflow-hidden bg-bay selection:bg-accent/40 selection:text-white">
    {/* Three children: copy, instrument, status. Desktop pins copy to the panel's top and status to its
        bottom; mobile reads copy → instrument → status so the live result comes sooner. */}
    <div className="mx-auto grid max-w-6xl gap-x-16 gap-y-6 px-4 pb-8 pt-6 sm:gap-y-10 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:grid-rows-[1fr_auto] lg:py-24">
      <div className="max-w-xl lg:col-start-1 lg:row-start-1 lg:self-center">
        <h1 className="text-[2rem] font-semibold font-stretch-semi-expanded leading-[1.1] tracking-tight text-balance text-white sm:text-5xl">
          Dealer reviews, scored by what owners actually wrote.
        </h1>
        <p className="mt-4 text-base text-white/80 sm:mt-6 sm:text-lg">
          Browse dealerships by state and read what owners say about them. There are no star ratings: a sentiment
          model, running as its own service, labels every review from its text. Try it yourself.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
          <a href="/dealers" className={buttonVariants({ size: "lg" })}>
            Browse dealerships
          </a>
          {!username && (
            <a
              href="/register"
              className={`${buttonVariants({ size: "lg", variant: "outline" })} border-white/40 text-white hover:bg-white/10`}
            >
              Sign up to review
            </a>
          )}
        </div>
      </div>
      <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
        <SentimentDemo />
      </div>
      <div className="max-w-xl border-t border-white/15 pt-5 lg:col-start-1 lg:row-start-2 lg:self-end">
        <StatusStrip />
      </div>
    </div>
  </section>
);

const ClosingCta = () => (
  <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
    <div className="flex flex-col items-start justify-between gap-8 rounded-3xl bg-accent px-8 py-12 text-accent-foreground md:flex-row md:items-center">
      <div className="max-w-xl">
        <h2 className="text-2xl font-semibold font-stretch-semi-expanded tracking-tight text-balance sm:text-3xl">
          Every label here was computed, not chosen.
        </h2>
        <p className="mt-3">
          Open any dealership to read its reviews and see what the model made of them, or read the source to see how the four
          services fit together.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <a
          href="/dealers"
          className={`${buttonVariants({ size: "lg", variant: "secondary" })} bg-white text-[oklch(0.25_0.05_200)]`}
        >
          Browse dealerships
        </a>
        <a
          href={SOURCE_URL}
          className={`${buttonVariants({ size: "lg", variant: "outline" })} border-white/60 text-white hover:bg-white/10`}
        >
          Read the source
        </a>
      </div>
    </div>
  </section>
);

const Home = () => {
  const username = readUsername();

  useEffect(() => {
    document.title = "Dealerships | Dealer reviews, scored by what owners wrote";
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav username={username} current="/" />
      <main>
        <Hero username={username} />
        <SampleReviews />
        <SystemMap />
        <ClosingCta />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
