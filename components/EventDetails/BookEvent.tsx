'use client';

import { useState } from "react";

const BookEvent = () => {
  const [emailAddress, setEmailAddress] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTimeout(() => {
      setIsSubmitted(true);
    }, 1000);
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

          <button type="submit">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default BookEvent;
