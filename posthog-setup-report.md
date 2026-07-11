# PostHog post-wizard report

The wizard has completed a PostHog integration for the DevEvent Next.js App Router application. PostHog is initialized via `instrumentation-client.ts` (the recommended Next.js 15.3+ pattern), with a reverse proxy configured in `next.config.ts` to route events through `/ingest` and avoid ad blockers. Two client-side events are now captured: one when users click "Explore Events" on the homepage hero, and one when users click on an event card. Event card clicks include the event title, slug, location, and date as properties for rich segmentation.

| Event name | Description | File |
|---|---|---|
| `explore_events_clicked` | User clicks the 'Explore Events' button on the homepage hero section. | `components/ExploreBtn.tsx` |
| `event_card_clicked` | User clicks on an event card to view more details about a specific event. | `components/EventCard.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/507513/dashboard/1832445)
- [Explore Events clicks over time (wizard)](https://us.posthog.com/project/507513/insights/d14G6rkg)
- [Event card clicks over time (wizard)](https://us.posthog.com/project/507513/insights/zWICIpsQ)
- [Event card clicks by event title (wizard)](https://us.posthog.com/project/507513/insights/goIu2OJj)
- [Explore to event click funnel (wizard)](https://us.posthog.com/project/507513/insights/pkQ7gv0u)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
