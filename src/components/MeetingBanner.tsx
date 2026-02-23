'use client'

import { useState } from 'react'

// ── Configure meeting details here ──────────────────────────────────
const MEETING = {
    title: 'West Inwood Community Meeting',
    date: '2026-03-11', // YYYY-MM-DD
    timeStart: '18:00', // 24-hr
    timeEnd: '19:00',
    displayDate: 'Wednesday, March 11, 2026',
    displayTime: '6:00 PM',
    location: 'Providence Christian School',
    address: '5002 W Lovers Ln, Dallas, TX 75209',
    description:
        'Join your neighbors for our upcoming West Inwood community meeting. We\'ll discuss ENP updates, neighborhood safety, and upcoming community events.',
    mapZoom: 16,
}

function getGoogleCalendarUrl(): string {
    const start = `${MEETING.date.replace(/-/g, '')}T${MEETING.timeStart.replace(':', '')}00`
    const end = `${MEETING.date.replace(/-/g, '')}T${MEETING.timeEnd.replace(':', '')}00`
    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: MEETING.title,
        dates: `${start}/${end}`,
        details: MEETING.description,
        location: `${MEETING.location}, ${MEETING.address}`,
        ctz: 'America/Chicago',
    })
    return `https://calendar.google.com/calendar/render?${params.toString()}`
}

function downloadICS(): void {
    const start = `${MEETING.date.replace(/-/g, '')}T${MEETING.timeStart.replace(':', '')}00`
    const end = `${MEETING.date.replace(/-/g, '')}T${MEETING.timeEnd.replace(':', '')}00`
    const ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//West Inwood//Meeting//EN',
        'BEGIN:VEVENT',
        `DTSTART;TZID=America/Chicago:${start}`,
        `DTEND;TZID=America/Chicago:${end}`,
        `SUMMARY:${MEETING.title}`,
        `DESCRIPTION:${MEETING.description}`,
        `LOCATION:${MEETING.location}\\, ${MEETING.address}`,
        'END:VEVENT',
        'END:VCALENDAR',
    ].join('\r\n')
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'west-inwood-meeting.ics'
    a.click()
    URL.revokeObjectURL(url)
}

export default function MeetingBanner() {
    const [expanded, setExpanded] = useState(false)

    return (
        <div
            className={`mtg-banner ${expanded ? 'mtg-banner--expanded' : ''}`}
            onMouseEnter={() => setExpanded(true)}
            onMouseLeave={() => setExpanded(false)}
        >
            {/* Collapsed strip */}
            <div className="mtg-banner__strip" onClick={() => setExpanded(!expanded)}>
                <span className="mtg-banner__badge">📣 Upcoming Meeting</span>
                <span className="mtg-banner__headline">
                    <strong>{MEETING.displayDate}</strong> &nbsp;·&nbsp; {MEETING.displayTime} &nbsp;·&nbsp; {MEETING.location}
                </span>
                <svg
                    className={`mtg-banner__chevron ${expanded ? 'mtg-banner__chevron--up' : ''}`}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </div>

            {/* Expanded panel */}
            <div className="mtg-banner__panel">
                <div className="mtg-banner__panel-inner">
                    {/* Map */}
                    <div className="mtg-banner__map">
                        {expanded && (
                            <iframe
                                title="Meeting location map"
                                width="100%"
                                height="100%"
                                style={{ border: 0, borderRadius: '12px' }}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(MEETING.address)}&zoom=${MEETING.mapZoom}`}
                                allowFullScreen
                            />
                        )}
                    </div>

                    {/* Details + Actions */}
                    <div className="mtg-banner__details">
                        <h3 className="mtg-banner__title">{MEETING.title}</h3>

                        <div className="mtg-banner__meta">
                            <span className="mtg-banner__meta-item">
                                📅 {MEETING.displayDate}
                            </span>
                            <span className="mtg-banner__meta-item">
                                🕕 {MEETING.displayTime}
                            </span>
                            <span className="mtg-banner__meta-item">
                                📍 {MEETING.location}
                            </span>
                        </div>

                        <p className="mtg-banner__address">{MEETING.address}</p>
                        <p className="mtg-banner__desc">{MEETING.description}</p>

                        <div className="mtg-banner__actions">
                            <a
                                href={getGoogleCalendarUrl()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mtg-banner__btn mtg-banner__btn--google"
                            >
                                📅 Add to Google Calendar
                            </a>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    downloadICS()
                                }}
                                className="mtg-banner__btn mtg-banner__btn--ics"
                            >
                                📅 Download .ics
                            </button>
                            <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(MEETING.address)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mtg-banner__btn mtg-banner__btn--directions"
                            >
                                📍 Get Directions
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
