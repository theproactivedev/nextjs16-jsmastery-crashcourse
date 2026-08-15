import EventDetails from "@/components/EventDetails/EventDetails";
import { Suspense } from "react";

const EventDetailPage = async ({ params } : { params: Promise<{ slug: string }> }) => {
  const slug = params.then((p) => p.slug);

  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <EventDetails params={slug} />
      </Suspense>
    </main>
  );
};

export default EventDetailPage;
