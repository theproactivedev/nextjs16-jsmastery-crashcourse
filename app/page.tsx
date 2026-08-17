import ExploreBtn from "@/components/ExploreBtn";
import EventCard from "@/components/EventCard";
import { IEvent } from "@/database";
import { getAllEvents } from "@/lib/actions/events.actions";

export default async function Home() {
    const events = await getAllEvents();
    return (
        <section>
            <h1 className="t  ext-center">The Hub for Every Dev<br />Event You Can't Miss</h1>
            <p className="text-center mt-5">Hackathons, Meetups and Conferences, All in One Place</p>
            <ExploreBtn />

            <div className="mt-20 space-y-7">
                <h3>Featured Events</h3>

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
