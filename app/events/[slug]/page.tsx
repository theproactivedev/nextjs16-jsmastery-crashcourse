import EventDetails from "@/components/EventDetails/EventDetails";
import { Suspense } from "react";

const EventDetailPage = async ({ params } : { params: Promise<{ slug: string }> }) => {
  const slug = params.then((p) => p.slug);

  return (
    <main>
      <Suspense fallback={<EventDetailsFallback />}>
        <EventDetails params={slug} />
      </Suspense>
    </main>
  );
};

export default EventDetailPage;

const EventDetailsFallback = () => (
  <section
    aria-busy="true"
    aria-live="polite"
    className="mx-auto w-full max-w-5xl py-8"
  >
    <div className="mb-10 text-center">
      <p className="mb-4 font-martian-mono text-sm uppercase tracking-[0.2em] text-primary">
        VIRTUAL EVENT
      </p>
      <h1>Get ready for what&apos;s next</h1>
      <p className="mt-5 text-light-100">
        We&apos;re gathering the event details for you. This won&apos;t take long.
      </p>
    </div>

    <div className="grid gap-8 rounded-2xl border border-border-dark bg-dark-100/80 p-5 sm:p-8 md:grid-cols-2">
      <div className="min-h-64 animate-pulse rounded-xl bg-dark-200 sm:min-h-80" />
      <div className="flex flex-col justify-center gap-6 py-2">
        <div className="h-4 w-28 animate-pulse rounded-full bg-dark-200" />
        <div className="space-y-3">
          <div className="h-8 w-full animate-pulse rounded bg-dark-200" />
          <div className="h-8 w-3/4 animate-pulse rounded bg-dark-200" />
        </div>
        <div className="space-y-3">
          <div className="h-4 w-full animate-pulse rounded bg-dark-200" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-dark-200" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-dark-200" />
        </div>
        <div className="h-12 w-40 animate-pulse rounded-full bg-dark-200" />
      </div>
    </div>

    <p className="mt-6 text-center font-martian-mono text-xs text-light-200">
      LOADING EVENT
    </p>
  </section>
);
