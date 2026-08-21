import EventCard from "@/components/EventCard";
import { IEvent } from "@/database";
import { getAllEvents } from "@/lib/actions/events.actions";

export default async function Home() {
    const events = await getAllEvents();
    return (
        <section>
            <h1 className="text-center">The Hub for Every Dev<br />Event You Can't Miss</h1>
            <p className="text-center mt-5">Hackathons, Meetups and Conferences, All in One Place</p>

            <div className="mt-15 mb-10 space-y-7">
                <ul className="events">
                    {events && events.length > 0 && events.map((event: IEvent) => {
                        const { _id, ...eventFields } = event;
                        return (
                        <li key={event.title} className="list-none">
                            <EventCard {...eventFields} />
                        </li>
                    )
                    })}
                </ul>
            </div>
        </section>
  );
}
