'use client';

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  ImagePlus,
  X,
  CalendarDays,
  Clock,
  MapPin,
  ListChecks,
  User,
  CheckCircle2,
  AlertCircle,
  Ticket,
} from "lucide-react";
import CreatableMultiSelect from "@/components/shared/CreatableMultiSelect";
import { InitialForm, initialForm, MAX_IMAGE_MB, MODE_CONFIG, OVERVIEW_MAX, TITLE_MAX } from "./constants";
import { parseLines, validate } from "./utils";
import SectionHeading from "./SectionHeading";
import CharCount from "./CharCount";
import FieldError from "@/components/shared/FieldError";
import { Alert } from "@/components/ui/alert";
import AlertBox from "@/components/shared/Alert";


const EventForm = () => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Record<keyof InitialForm, string>>({} as Record<keyof InitialForm, string>);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<keyof InitialForm, boolean>>({} as Record<keyof InitialForm, boolean>);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const setField = (name: string, value: any) => {
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      return next;
    });
  };

  const handleBlur = (name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validate(form));
  };

  const handleChange = (name: keyof InitialForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setField(name, value);
    if (touched[name]) {
      setErrors((prev) => ({ ...validate({ ...form, [name]: value }) }));
    }
  };

  const handleTagsChange = (tags: string[]) => {
    setField("tags", tags);

    if (touched.tags) {
      setErrors(() => ({
        ...validate({
          ...form,
          tags,
        }),
      }));
    }
  };

  const handleImageFile = (file: File | null | undefined) => {
    setImageError("");
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setImageError("Please upload an image file.");
      return;
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      setImageError(`Image must be under ${MAX_IMAGE_MB}MB.`);
      return;
    }
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setField("image", file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setField("image", null);
    setImagePreview(null);
    setImageError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    handleImageFile(file);
  };

  const handleModeChange = (value: string) => {
    setField("mode", value);
    if (touched.mode) {
      setErrors((prev) => ({ ...validate({ ...form, mode: value }) }));
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setErrors({} as Record<keyof InitialForm, string>);
    setBackendError(null);
    setImageError("");
    setImagePreview(null);
    setTouched({} as Record<keyof InitialForm, boolean>);
    setSubmitted(false);
  }

  const modeCfg = MODE_CONFIG[form.mode];

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nextErrors = validate(form);
    setErrors(nextErrors);
    setTouched(
      Object.keys(initialForm)
        .filter((key) => form.mode === 'online' ? key !== "venue" : true)
        .reduce(
          (acc, key) => ({ ...acc, [key]: true }),
          {} as Record<keyof InitialForm, boolean>
        )
    );

    if (Object.keys(nextErrors).length === 0) {
      const formDataToSubmit = {
        ...form,
        agenda: parseLines(form.agenda),
      }

      const formData = new FormData();
      Object.entries(formDataToSubmit).forEach(([key, value]) => {
        if (key === 'image' && value instanceof File) {
          formData.append(key, value);
        } else if(['agenda', 'tags'].includes(key)) {
          formData.append(key, JSON.stringify(value));
        }else {
          formData.append(key, String(value));
        }
      });

      const response = await fetch("/api/events", {
        method: "POST",
        body: formData,
      });

      if(response.ok) {
        setSubmitted(true);
        window.setTimeout(() => resetForm(), 3500);
      } else {
        const backendResponse = await response.json();
        if(backendResponse?.message) {
          setBackendError(backendResponse.message);
        }
      }
    } else {
      const firstErrorField = Object.keys(nextErrors)[0];
      document.getElementById(firstErrorField)?.focus();
    }
  };

  const errorCount = Object.keys(errors).length;

  console.log('errors', errors);

  return (
    <div className="min-h-screen w-full bg-transparent px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className=" b-8">
          <p className="mb-1 text-xs font-medium uppercase tracking-widest text-terracotta">
            Events
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Create a new event
          </h1>
          <p className="mt-1.5 mb-3 text-sm text-white">
            Fill in the details below — your event ticket updates live as you go.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
            {/* ---------------------------------------------------------- */}
            {/* Form column */}
            {/* ---------------------------------------------------------- */}
            <div className="space-y-6">
              {/* Basics */}
              <Card className="border-[#5b3d2e]/12">
                <CardHeader className="pb-0">
                  <SectionHeading
                    icon={Ticket}
                    title="Basics"
                    description="What is this event, in a nutshell?"
                  />
                </CardHeader>
                <CardContent className="space-y-5">
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <Label htmlFor="title">Title</Label>
                      <CharCount value={form.title} max={TITLE_MAX} />
                    </div>
                    <Input
                      id="title"
                      placeholder="Design Systems Summit 2026"
                      value={form.title}
                      onChange={handleChange("title")}
                      onBlur={() => handleBlur("title")}
                      aria-invalid={Boolean(touched.title && errors.title)}
                      aria-describedby="title-error"
                    />
                    {touched.title && <FieldError id="title-error" message={errors.title} />}
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <Label htmlFor="overview">Short overview</Label>
                      <CharCount value={form.overview} max={OVERVIEW_MAX} />
                    </div>
                    <Input
                      id="overview"
                      placeholder="A one-day summit for product & design teams"
                      value={form.overview}
                      onChange={handleChange("overview")}
                      onBlur={() => handleBlur("overview")}
                      aria-invalid={Boolean(touched.overview && errors.overview)}
                      aria-describedby="overview-error"
                    />
                    <p className="mt-1.5 text-xs text-zinc-400">
                      Shown in listings and previews — make it count.
                    </p>
                    {touched.overview && <FieldError id="overview-error" message={errors.overview} />}
                  </div>

                  <div>
                    <Label htmlFor="description" className="mb-2">Full description</Label>
                    <Textarea
                      id="description"
                      placeholder="Tell attendees what to expect, who it's for, and why they should come."
                      className="min-h-[120px] resize-y"
                      value={form.description}
                      onChange={handleChange("description")}
                      onBlur={() => handleBlur("description")}
                      aria-invalid={Boolean(touched.description && errors.description)}
                      aria-describedby="description-error"
                    />
                    {touched.description && (
                      <FieldError id="description-error" message={errors.description} />
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Cover image */}
              <Card className="border-[#5b3d2e]/12">
                <CardHeader className="pb-0">
                  <SectionHeading
                    icon={ImagePlus}
                    title="Cover image"
                    description="Optional, but events with a cover get more clicks."
                  />
                </CardHeader>
                <CardContent>
                  {!imagePreview ? (
                    <label
                      htmlFor="image"
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragActive(true);
                      }}
                      onDragLeave={() => setDragActive(false)}
                      onDrop={handleDrop}
                      className={`flex min-h-[160px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 text-center transition-colors ${
                        dragActive
                          ? "border-terracotta bg-terracotta/5"
                          : "border-[#5b3d2e]/25 bg-white/40 hover:border-[#5b3d2e]/40 hover:bg-white/70"
                      } ${
                        touched.image && (imageError || errors.image) ? "border-red-600" : ""
                      }`}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-[#5b3d2e]/20">
                        <ImagePlus className="h-4.5 w-4.5 text-[#5b3d2e]" />
                      </div>
                      <p className="text-sm text-zinc-600">
                        <span className="font-medium text-terracotta underline decoration-terracotta/40 underline-offset-2">
                          Click to upload
                        </span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-zinc-400">PNG or JPG, up to {MAX_IMAGE_MB}MB</p>
                      <input
                        ref={fileInputRef}
                        id="image"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => handleImageFile(e.target.files?.[0])}
                      />
                    </label>
                  ) : (
                    <div className="relative overflow-hidden rounded-xl ring-1 ring-zinc-200">
                      <img
                        src={imagePreview}
                        alt="Event cover preview"
                        className="h-48 w-full object-cover"
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="secondary"
                        onClick={removeImage}
                        className="absolute right-2 top-2 h-8 w-8 shadow-md"
                        aria-label="Remove image"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  {touched.image ? <FieldError id="image-error" message={imageError || errors.image} /> : null}
                </CardContent>
              </Card>

              {/* Timing & location */}
              <Card className="border-[#5b3d2e]/12">
                <CardHeader className="pb-0">
                  <SectionHeading
                    icon={MapPin}
                    title="Timing & location"
                    description="When and where can people find you?"
                  />
                </CardHeader>
                <CardContent className="space-y-5">
                  <div>
                    <Label className="mb-2 block">Mode</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {Object.entries(MODE_CONFIG).map(([value, cfg]) => {
                        const Icon = cfg.icon;
                        const active = form.mode === value;

                        let borderStyle = '';
                        if(touched.mode && errors.mode) {
                          borderStyle = 'border-red-600 bg-rose-100 text-red-600';
                        } else if(active){
                          borderStyle = "border-[#2f4842] bg-[#2f4842]/5 text-[#2f4842]"
                        } else {
                          borderStyle = "border-[#5b3d2e]/20 text-zinc-600 hover:border-[#5b3d2e]/40 hover:bg-white"
                        }

                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => handleModeChange(value)}
                            aria-pressed={active}
                            className={`flex flex-col items-center gap-1.5 rounded-lg border px-3 py-2.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2f4842]/40 focus-visible:ring-offset-1 ${borderStyle}`}
                          >
                            <Icon className="h-4 w-4" />
                            {cfg.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <div className="relative mt-2">
                        <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                        <Input
                          id="date"
                          type="date"
                          className="pl-9"
                          value={form.date}
                          onChange={handleChange("date")}
                          onBlur={() => handleBlur("date")}
                          aria-invalid={Boolean(touched.date && errors.date)}
                          aria-describedby="date-error"
                        />
                      </div>
                      {touched.date && <FieldError id="date-error" message={errors.date} />}
                    </div>

                    <div>
                      <Label htmlFor="time">Start time</Label>
                      <div className="relative mt-2">
                        <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                        <Input
                          id="time"
                          type="time"
                          className="pl-9"
                          value={form.time}
                          onChange={handleChange("time")}
                          onBlur={() => handleBlur("time")}
                          aria-invalid={Boolean(touched.time && errors.time)}
                          aria-describedby="time-error"
                        />
                      </div>
                      {touched.time && <FieldError id="time-error" message={errors.time} />}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {(form.mode === "offline" || form.mode === "hybrid") &&
                      <div>
                        <Label htmlFor="venue">{modeCfg.venueLabel}</Label>
                        <Input
                          id="venue"
                          placeholder={modeCfg.venuePlaceholder}
                          className="mt-1.5"
                          value={form.venue}
                          onChange={handleChange("venue")}
                          onBlur={() => handleBlur("venue")}
                          aria-invalid={Boolean(touched.venue && errors.venue)}
                          aria-describedby="venue-error"
                        />
                        {touched.venue && <FieldError id="venue-error" message={errors.venue} />}
                      </div>
                    }

                    <div>
                      <Label htmlFor="location">{modeCfg.locationLabel}</Label>
                      <Input
                        id="location"
                        placeholder={modeCfg.locationPlaceholder}
                        className="mt-2"
                        value={form.location}
                        onChange={handleChange("location")}
                        onBlur={() => handleBlur("location")}
                        aria-invalid={Boolean(touched.location && errors.location)}
                        aria-describedby="location-error"
                      />
                      {touched.location && <FieldError id="location-error" message={errors.location} />}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Audience & agenda */}
              <Card className="border-[#5b3d2e]/12">
                <CardHeader className="pb-0">
                  <SectionHeading
                    icon={ListChecks}
                    title="Audience & agenda"
                    description="Optional — helps attendees know what to expect."
                  />
                </CardHeader>
                <CardContent className="space-y-5">
                  <div>
                    <Label htmlFor="audience">Who is this for?</Label>
                    <Input
                      id="audience"
                      placeholder="Product designers, PMs, and engineering leads"
                      className="mt-2"
                      value={form.audience}
                      onChange={handleChange("audience")}
                      aria-invalid={Boolean(touched.audience && errors.audience)}
                      aria-describedby="audience-error"
                    />
                    {touched.audience && <FieldError id="audience-error" message={errors.audience} />}
                  </div>

                  <div>
                    <Label htmlFor="agendaText">Agenda</Label>
                    <Textarea
                      id="agendaText"
                      placeholder={"9:00 — Doors open\n10:00 — Keynote\n12:00 — Lunch break"}
                      className="mt-2 min-h-[100px] resize-y font-mono text-sm"
                      value={form.agenda}
                      onChange={handleChange("agenda")}
                      aria-invalid={Boolean(touched.agenda && errors.agenda)}
                      aria-describedby="agenda-error"
                    />
                    <p className="mt-1.5 text-xs text-zinc-400">One agenda item per line.</p>
                    {touched.agenda && <FieldError id="agenda-error" message={errors.agenda} />}
                  </div>
                </CardContent>
              </Card>

              {/* Organizer & tags */}
              <Card className="border-[#5b3d2e]/12">
                <CardHeader className="pb-0">
                  <SectionHeading
                    icon={User}
                    title="Organizer & tags"
                    description="Who's running it, and how people will discover it."
                  />
                </CardHeader>
                <CardContent className="space-y-5">
                  <div>
                    <Label htmlFor="organizer">Organizer</Label>
                    <Input
                      id="organizer"
                      placeholder="Acme Design Guild"
                      className="mt-2"
                      value={form.organizer}
                      onChange={handleChange("organizer")}
                      onBlur={() => handleBlur("organizer")}
                      aria-invalid={Boolean(touched.organizer && errors.organizer)}
                      aria-describedby="organizer-error"
                    />
                    {touched.organizer && <FieldError id="organizer-error" message={errors.organizer} />}
                  </div>

                  <div>
                    <Label htmlFor="tagsText" className="mb-2">Tags</Label>
                    <CreatableMultiSelect
                      creatable
                      id="tagsText"
                      options={[
                        {
                          label: "React",
                          value: "react",
                        },
                        {
                          label: "Next.js",
                          value: "nextjs",
                        },
                        {
                          label: "TypeScript",
                          value: "typescript",
                        },
                      ]}
                      value={form.tags}
                      onChange={handleTagsChange}
                      placeholder="Add tags..."
                      ariaInvalid={Boolean(touched.tags && errors.tags)}
                      ariaDescribedby="tags-error"
                    />
                    {touched.tags && <FieldError id="tags-error" message={errors.tags} />}
                    {/* {tagItems.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {tagItems.map((tag, i) => (
                          <Badge
                            key={`${tag}-${i}`}
                            variant="secondary"
                            className="border-terracotta/30 bg-terracotta/10 font-normal text-terracotta"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )} */}
                  </div>
                </CardContent>
              </Card>

              {backendError &&
                <AlertBox title="Error" content={backendError} variant="destructive" className="mb-4 bg-red-100" />
              }


              {/* Submit */}
              <div className="flex items-center justify-between gap-4 pt-2">
                <div className="text-zinc-500">
                  {errorCount > 0 && Object.values(touched).some(Boolean) ? (
                    <span className="flex items-center gap-1.5 font-medium text-red-600">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errorCount} field{errorCount > 1 ? "s" : ""} need attention
                    </span>
                  ) : submitted ? (
                    <span className="flex items-center gap-1.5 font-medium text-emerald-600">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Event created
                    </span>
                  ) : null}
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" className="cursor-pointer hover:bg-terracotta/90 hover:border-terracotta/90" onClick={() => resetForm()}>
                    Reset
                  </Button>
                  <Button type="submit" className="bg-terracotta hover:bg-transparent hover:border-white cursor-pointer">
                    Create event
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EventForm;


// { "title": "Design Systems Summit 2026",
//   "overview": "A one-day summit for product & design teams",
//   "description": "Join industry leaders to explore building scalable design systems, component architecture, and cross-team workflows. Talks, hands-on workshops, and networking for practitioners.",
//   "date": "2026-11-12",
//   "time": "09:30",
//   "mode": "hybrid",
//   "venue": "Grand Ballroom, Hilton Hotel",
//   "location": "123 Main St, San Francisco, CA / https://livestream.example.com", "audience": "Product designers, PMs, and engineering leads",
//   "agenda": "09:00 — Doors open\n10:00 — Keynote: Designing for Scale\n11:30 — Workshop: Component Libraries\n13:00 — Lunch\n14:00 — Panel: Design Systems in Practice\n16:00 — Networking", 
//   "organizer": "Acme Design Guild",
//   "tags": ["design-systems", "react", "nextjs"]
// }