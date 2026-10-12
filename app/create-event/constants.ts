// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

import { Building2, LucideIcon, Radio, Wifi } from "lucide-react";

type ModeConfig = {
  label: string;
  icon: LucideIcon;
  venueLabel?: string;
  venuePlaceholder?: string;
  locationLabel: string;
  locationPlaceholder: string;
};

const MODE_CONFIG: Record<string, ModeConfig> = {
  online: {
    label: "Online",
    icon: Wifi,
    locationLabel: "Link",
    locationPlaceholder: "https://example.com",
  },
  offline: {
    label: "In person",
    icon: Building2,
    venueLabel: "Venue",
    venuePlaceholder: "Grand Ballroom, Hilton Hotel",
    locationLabel: "Address",
    locationPlaceholder: "123 Main St, San Francisco, CA",
  },
  hybrid: {
    label: "Hybrid",
    icon: Radio,
    venueLabel: "Venue",
    venuePlaceholder: "Grand Ballroom + livestream",
    locationLabel: "Address / Link",
    locationPlaceholder: "123 Main St, or https://...",
  },
};

const MAX_IMAGE_MB = 5;
const TITLE_MAX = 80;
const OVERVIEW_MAX = 160;

type InitialForm = {
  title: string;
  description: string;
  overview: string;
  image: string;
  venue?: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string;
  organizer: string;
  tags: string[] | null;
};

const initialForm: InitialForm = {
  title: "",
  description: "",
  overview: "",
  image: "",
  venue: "",
  location: "",
  date: "",
  time: "",
  mode: "online",
  audience: "",
  agenda: "",
  organizer: "",
  tags: [],
};

export type { InitialForm, ModeConfig };
export {
  MODE_CONFIG,
  MAX_IMAGE_MB,
  TITLE_MAX,
  OVERVIEW_MAX,
  initialForm,
}