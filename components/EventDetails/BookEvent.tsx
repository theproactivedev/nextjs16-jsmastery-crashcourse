'use client';

import { bookEvent } from "@/lib/actions/bookings.actions";
import { useState } from "react";
import AlertBox from "../shared/Alert";
import posthog from "posthog-js";

const BookEvent = ({ eventId, slug } : { eventId: string; slug: string }) => {
  const [errorMessage, setShowErrorMessage] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { success, error } = await bookEvent(eventId, emailAddress);
    if(success) {
      setIsSubmitted(true);
      posthog.capture('event_booked', {
        eventId,
        slug,
        emailAddress,
      });
    } else {
      setIsSubmitted(false);
      setShowErrorMessage(error || 'Failed to book the event. Please try again later.');
      posthog.captureException(new Error(`Booking failed for eventId: ${eventId}, email: ${emailAddress}. Error: ${error}`), {
        extra: {
          eventId,
          slug,
          emailAddress
        }
      });
    }
  };

  return (
    <div id="book-event">
      {isSubmitted ? (
        <p className="text-sm">Thank you for booking your spot!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"  
              required
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
            />
          </div>

          {errorMessage && (
            <AlertBox title="Error" content={errorMessage} variant="destructive" />
          )}

          <button type="submit">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default BookEvent;
