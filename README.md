# ENP Patrol

A production-ready Next.js 14 (App Router) + TypeScript application that displays ON-DUTY/OFF-DUTY status from Google Calendar and live patrol location from Traccar.

## 📁 Project Structure

This repository contains two main components:

### 1. **Next.js Patrol App** (`/src`)

- Main patrol tracking application with authentication
- Served at `/patrol` (protected, auth required)
- Features: Real-time duty status, GPS tracking, interactive map
- Tech: Next.js 14, TypeScript, Firebase Auth, SendGrid

### 2. **React Static Site** (`/static`)

- Public-facing website for all visitors
- Served at `/` (root path, no auth required)
- Features: About Us, Benefits, Contact info
- Tech: Create React App (CRA)

## Features

- **Real-time Duty Status**: Fetches officer schedule from Google Calendar API
- **Live GPS Tracking**: Shows patrol location from Traccar API
- **Interactive Map**: MapLibre-powered map with real-time location updates
- **Mobile-First Design**: Responsive layout optimized for mobile devices
- **Duty-Aware Functionality**: Only tracks location when officer is on duty

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- React 18
- MapLibre GL JS (no Mapbox token required)
- Serverless API routes
- Google Calendar REST API
- Traccar REST API

## Setup

### 1. Google Calendar Setup

1. Create a Google Calendar called "ENP Patrol Shifts"
2. Make the calendar **public**
3. Copy the Calendar ID (ends with @group.calendar.google.com)
4. Go to [Google Cloud Console](https://console.cloud.google.com/)
5. Create a new project or select existing
6. Enable the **Calendar API**
7. Create an **API Key** with Calendar API access
8. Restrict the API key to your domain

### 2. Traccar Setup (Optional - uses fake data if not configured)

1. Set up a Traccar server or use cloud instance
2. Create a device for tracking
3. Note the device ID, server URL, and credentials

### 3. Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your actual values:

```bash
NEXT_PUBLIC_GCAL_ID=your-calendar-id@group.calendar.google.com
NEXT_PUBLIC_GCAL_API_KEY=your-google-api-key-here
NEXT_PUBLIC_PATROL_PHONE=+12145551234

TRACCAR_BASE_URL=https://your-traccar-domain.com
TRACCAR_USERNAME=your-traccar-username
TRACCAR_PASSWORD=your-traccar-password
TRACCAR_DEVICE_ID=123
```

### 4. Installation & Development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to see the application.

### 5. Production Build

```bash
npm run build
npm start
```

## Environment Variables

### Public Variables (exposed to client)

- `NEXT_PUBLIC_GCAL_ID`: Google Calendar ID
- `NEXT_PUBLIC_GCAL_API_KEY`: Google Calendar API key
- `NEXT_PUBLIC_PATROL_PHONE`: Officer phone number (E.164 format)

### Server-Side Variables (private)

- `TRACCAR_BASE_URL`: Traccar server URL
- `TRACCAR_USERNAME`: Traccar username
- `TRACCAR_PASSWORD`: Traccar password
- `TRACCAR_DEVICE_ID`: Traccar device ID

## Security Notes

- Only `NEXT_PUBLIC_*` variables are exposed to the client
- Calendar API key should be restricted to your domain
- Traccar credentials are never exposed to the client
- Site will be gated by Cloudflare Access (donor-only access)

## API Endpoints

- `GET /api/status` - Returns current duty status from Google Calendar
- `GET /api/position` - Returns latest patrol position from Traccar

## Deployment

This application is designed for deployment on Vercel or similar platforms with:

- Serverless function support
- Environment variable management
- HTTPS/SSL termination
- Cloudflare Access integration

## License

MIT License
