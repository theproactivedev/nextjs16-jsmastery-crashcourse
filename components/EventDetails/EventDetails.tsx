import EventCard from "@/components/EventCard";
import BookEvent from "@/components/EventDetails/BookEvent";
import EventAgenda from "@/components/EventDetails/EventAgenda";
import EventDetailItem from "@/components/EventDetails/EventDetailItem";
import EventTags from "@/components/EventDetails/EventTags";
import { IEvent } from "@/database/event.model";
import { getAllBookingsByEventId } from "@/lib/actions/bookings.actions";
import { getSimilarEventsBy } from "@/lib/actions/events.actions";
import Image from "next/image";
import { notFound } from "next/navigation";

const EventDetails = async ({ params } : { params: Promise<string> }) => {
  const slug = await params;

  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/events/${slug}`);
  if (!response.ok) {
      throw new Error(`Fetch failed on EventDetails: ${response.status} ${await response.text()}. URL is ${process.env.NEXT_PUBLIC_BASE_URL}/api/events/${slug}`);
  }
  const { event } = await response.json();
  if(!event) {
    return notFound();
  }

  const bookings = await getAllBookingsByEventId(event._id);

  const similarEvents = await getSimilarEventsBy(slug);

  return (
    <section id="event">
      <div className="header">
        <h1>{event.title}</h1>
        <p>{event.description}</p>
      </div>

      <div className="details">
          {/*    Left Side - Event Content */}
        <div className="content">
          <Image src={event.image} alt="Event Banner" width={800} height={800} className="banner" />

          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{event.overview}</p>
          </section>

          <section className="flex-col-gap-2">
            <h2>Event Details</h2>

            <EventDetailItem icon="/icons/calendar.svg" alt="calendar" label={event.date} />
            <EventDetailItem icon="/icons/clock.svg" alt="clock" label={event.time} />
            <EventDetailItem icon="/icons/pin.svg" alt="pin" label={event.location} />
            <EventDetailItem icon="/icons/mode.svg" alt="mode" label={event.mode} />
            <EventDetailItem icon="/icons/audience.svg" alt="audience" label={event.audience} />
          </section>

          <EventAgenda agendaItems={event.agenda} />

          <section className="flex-col-gap-2">
            <h2>About the Organizer</h2>
            <p>{event.organizer}</p>
          </section>

          <EventTags tags={event.tags} />
        </div>

        {/*    Right Side - Booking Form */}
        <aside className="booking">
          <div className="signup-card">
            <h2>Book Your Spot</h2>
            {bookings?.length > 0
              ? (
                <p className="text-sm">Join {bookings.length} {bookings.length === 1 ? 'person' : 'people'} who have already booked their spot!</p>
              ) : (
                <p className="text-sm">Be the first to book your spot!</p>
              )
            }

            <BookEvent eventId={event._id} slug={event.slug} />
          </div>
        </aside>
      </div>
      
      {similarEvents.length > 0 &&
        <div className="flex w-full flex-col gap-4 pt-20">
          <h2>Similar Events</h2>
          <div className="events">
            {similarEvents.map((similarEvent: IEvent) => (
              <EventCard key={similarEvent.title}
                title={similarEvent.title}
                image={similarEvent.image}
                slug={similarEvent.slug}
                location={similarEvent.location}
                date={similarEvent.date}
                time={similarEvent.time}
              />
            ))}
          </div>
        </div>
      }
    </section>
  );
};

export default EventDetails;
