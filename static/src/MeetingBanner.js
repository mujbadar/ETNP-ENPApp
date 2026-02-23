import React, { useState } from "react";
import { Calendar, MapPin, Clock, ChevronDown, X } from "lucide-react";

// ── Configure meeting details here ──────────────────────────────────
const MEETING = {
  title: "West Inwood Community Meeting",
  date: "2026-03-11", // YYYY-MM-DD
  timeStart: "18:00", // 24-hr
  timeEnd: "19:00",
  displayDate: "Wednesday, March 11, 2026",
  displayTime: "6:00 PM",
  location: "Providence Christian School",
  address: "5002 W Lovers Ln, Dallas, TX 75209",
  description:
    "Join your neighbors for our upcoming West Inwood community meeting. We'll discuss ENP updates, neighborhood safety, and upcoming community events.",
  mapLat: 32.8464,
  mapLng: -96.8195,
  mapZoom: 16,
};

// Build a Google Calendar link
function getGoogleCalendarUrl() {
  const start = `${MEETING.date.replace(/-/g, "")}T${MEETING.timeStart.replace(":", "")}00`;
  const end = `${MEETING.date.replace(/-/g, "")}T${MEETING.timeEnd.replace(":", "")}00`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: MEETING.title,
    dates: `${start}/${end}`,
    details: MEETING.description,
    location: `${MEETING.location}, ${MEETING.address}`,
    ctz: "America/Chicago",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// Build an .ics file download
function downloadICS() {
  const start = `${MEETING.date.replace(/-/g, "")}T${MEETING.timeStart.replace(":", "")}00`;
  const end = `${MEETING.date.replace(/-/g, "")}T${MEETING.timeEnd.replace(":", "")}00`;
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//West Inwood//Meeting//EN",
    "BEGIN:VEVENT",
    `DTSTART;TZID=America/Chicago:${start}`,
    `DTEND;TZID=America/Chicago:${end}`,
    `SUMMARY:${MEETING.title}`,
    `DESCRIPTION:${MEETING.description}`,
    `LOCATION:${MEETING.location}\\, ${MEETING.address}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "west-inwood-meeting.ics";
  a.click();
  URL.revokeObjectURL(url);
}

export default function MeetingBanner() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`meeting-banner ${expanded ? "meeting-banner--expanded" : ""}`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* ── Collapsed strip ──────────────────────────────────── */}
      <div className="meeting-banner__strip">
        <div className="meeting-banner__strip-inner">
          <span className="meeting-banner__badge">📣 Upcoming Meeting</span>
          <span className="meeting-banner__headline">
            <strong>{MEETING.displayDate}</strong> &nbsp;·&nbsp;{" "}
            {MEETING.displayTime} &nbsp;·&nbsp; {MEETING.location}
          </span>
          <ChevronDown
            size={16}
            className={`meeting-banner__chevron ${expanded ? "meeting-banner__chevron--up" : ""}`}
          />
        </div>
      </div>

      {/* ── Expanded panel ───────────────────────────────────── */}
      <div className="meeting-banner__panel">
        <div className="meeting-banner__panel-inner">
          {/* Map */}
          <div className="meeting-banner__map">
            <iframe
              title="Meeting location map"
              width="100%"
              height="100%"
              style={{ border: 0, borderRadius: "12px" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(MEETING.address)}&zoom=${MEETING.mapZoom}`}
              allowFullScreen
            />
          </div>

          {/* Details + Actions */}
          <div className="meeting-banner__details">
            <h3 className="meeting-banner__title">{MEETING.title}</h3>

            <div className="meeting-banner__meta">
              <span className="meeting-banner__meta-item">
                <Calendar size={16} />
                {MEETING.displayDate}
              </span>
              <span className="meeting-banner__meta-item">
                <Clock size={16} />
                {MEETING.displayTime}
              </span>
              <span className="meeting-banner__meta-item">
                <MapPin size={16} />
                {MEETING.location}
              </span>
            </div>

            <p className="meeting-banner__address">{MEETING.address}</p>
            <p className="meeting-banner__desc">{MEETING.description}</p>

            <div className="meeting-banner__actions">
              <a
                href={getGoogleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="meeting-banner__btn meeting-banner__btn--google"
              >
                <Calendar size={16} />
                Add to Google Calendar
              </a>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  downloadICS();
                }}
                className="meeting-banner__btn meeting-banner__btn--ics"
              >
                <Calendar size={16} />
                Download .ics
              </button>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(MEETING.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="meeting-banner__btn meeting-banner__btn--directions"
              >
                <MapPin size={16} />
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
