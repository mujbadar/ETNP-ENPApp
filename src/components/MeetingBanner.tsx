'use client'

import { useState } from 'react'

const BLOCK_PARTY = {
    title: 'West Inwood Community Block Party',
    date: '2026-05-17',
    timeStart: '16:00',
    timeEnd: '18:00',
    displayDate: 'Sunday, May 17, 2026',
    displayTime: '4:00 PM – 6:00 PM',
    location: 'TBA',
    address: '',
    description:
        'Save the date! Join your neighbors for our upcoming West Inwood community block party. Address details coming soon!',
}

function getGoogleCalendarUrl(): string {
    const start = `${BLOCK_PARTY.date.replace(/-/g, '')}T${BLOCK_PARTY.timeStart.replace(':', '')}00`
    const end = `${BLOCK_PARTY.date.replace(/-/g, '')}T${BLOCK_PARTY.timeEnd.replace(':', '')}00`
    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: BLOCK_PARTY.title,
        dates: `${start}/${end}`,
        details: BLOCK_PARTY.description,
        location: BLOCK_PARTY.location,
        ctz: 'America/Chicago',
    })
    return `https://calendar.google.com/calendar/render?${params.toString()}`
}

function downloadICS(): void {
    const start = `${BLOCK_PARTY.date.replace(/-/g, '')}T${BLOCK_PARTY.timeStart.replace(':', '')}00`
    const end = `${BLOCK_PARTY.date.replace(/-/g, '')}T${BLOCK_PARTY.timeEnd.replace(':', '')}00`
    const ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//West Inwood//Block Party//EN',
        'BEGIN:VEVENT',
        `DTSTART;TZID=America/Chicago:${start}`,
        `DTEND;TZID=America/Chicago:${end}`,
        `SUMMARY:${BLOCK_PARTY.title}`,
        `DESCRIPTION:${BLOCK_PARTY.description}`,
        `LOCATION:${BLOCK_PARTY.location}`,
        'END:VEVENT',
        'END:VCALENDAR',
    ].join('\r\n')
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'west-inwood-block-party.ics'
    a.click()
    URL.revokeObjectURL(url)
}

const VOLUNTEER_FORM_URL =
    'https://docs.google.com/forms/d/e/1FAIpQLSdScb7fM-PAHvnfpTTykWByjE_X-EiK9hjieX4icXBxCYsGtA/viewform?usp=sharing&ouid=109631430131525759517'

export default function MeetingBanner() {
    const [expanded, setExpanded] = useState(false)

    return (
        <>
            {/* ── Volunteer Interest Banner ── */}
            <a
                href={VOLUNTEER_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="vol-banner"
            >
                <span className="vol-banner__icon">🤝</span>
                <span className="vol-banner__text">
                    <strong>Interested in volunteering?</strong> Board &amp; volunteer roles are open — sign up by March 31!
                </span>
                <span className="vol-banner__cta">Fill Out Interest Form →</span>
            </a>

            {/* ── Block Party Banner ── */}
            <div
                className={`mtg-banner mtg-banner--party ${expanded ? 'mtg-banner--expanded' : ''}`}
                onMouseEnter={() => setExpanded(true)}
                onMouseLeave={() => setExpanded(false)}
            >
                <div className="mtg-banner__strip" onClick={() => setExpanded(!expanded)}>
                    <span className="mtg-banner__badge">🎉 Block Party</span>
                    <span className="mtg-banner__headline">
                        <strong>{BLOCK_PARTY.displayDate}</strong> &nbsp;·&nbsp; {BLOCK_PARTY.displayTime} &nbsp;·&nbsp; Location TBA
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

                <div className="mtg-banner__panel">
                    <div className="mtg-banner__panel-inner mtg-banner__panel-inner--centered">
                        <div className="mtg-banner__details">
                            <h3 className="mtg-banner__title">{BLOCK_PARTY.title}</h3>

                            <div className="mtg-banner__meta">
                                <span className="mtg-banner__meta-item">
                                    📅 {BLOCK_PARTY.displayDate}
                                </span>
                                <span className="mtg-banner__meta-item">
                                    🕓 {BLOCK_PARTY.displayTime}
                                </span>
                                <span className="mtg-banner__meta-item">
                                    📍 Address details coming soon!
                                </span>
                            </div>

                            <p className="mtg-banner__desc">{BLOCK_PARTY.description}</p>

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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
