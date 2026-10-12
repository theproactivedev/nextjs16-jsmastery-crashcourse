// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

import { InitialForm, MODE_CONFIG, OVERVIEW_MAX, TITLE_MAX } from "./constants";

const validate = (form: InitialForm) => {
  console.log('Validating form:', form);
  const errors: Record<keyof InitialForm, string> = {} as Record<keyof InitialForm, string>;
  if (!form.title.trim()) {
    errors.title = "Give the event a title.";
  } else if (form.title.length > TITLE_MAX) {
    errors.title = `Keep it under ${TITLE_MAX} characters.`;
  }

  if (!form.overview.trim()) {
    errors.overview = "Add a one-line summary.";
  } else if (form.overview.length > OVERVIEW_MAX) {
    errors.overview = `Keep it under ${OVERVIEW_MAX} characters.`;
  }

  if (!form.description.trim()) {
    errors.description = "Describe what attendees can expect.";
  }

  if(!form.image) {
    errors.image = "Add a cover image.";
  }

  if (!form.date) {
    errors.date = "Pick a date.";
  }
  if (!form.time) {
    errors.time = "Pick a start time.";
  }

  if(!form.mode) {
    errors.mode = 'Mode is required';
  }

  if (['offline', 'hybrid'].includes(form.mode) && !form.venue?.trim()) {
    errors.venue = MODE_CONFIG[form.mode].venueLabel + " is required.";
  }

  if (!form.location.trim()) {
    errors.location = MODE_CONFIG[form.mode].locationLabel + " is required.";
  }

  if (!form.audience.trim()) {
    errors.audience = "Add a target audience.";
  }

  if (!form.agenda.trim()) {
    errors.agenda = "Add at least one agenda item.";
  }

  if (!form.organizer.trim()) {
    errors.organizer = "Add an organizer name.";
  }

  if(!form.tags || form.tags.length === 0) {
    errors.tags = "Add at least one tag.";
  }

  return errors;
}

const parseLines = (text: string) => {
  if(!text) {
    return null;
  }
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export { validate, parseLines };