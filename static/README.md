# ENP Static Website (React App)

This directory contains the React static website that is served at the root path (`/`) of the ENP Patrol application.

## Development

### Running the static site locally

```bash
# Install dependencies
npm install

# Start development server
npm start

# The site will be available at http://localhost:3000
```

### Building for production

```bash
# Build the React app
npm run build

# The built files will be in the build/ directory
```

## Integration with ENP Patrol

The built React app is integrated into the Next.js ENP Patrol app:

1. **Build the static site** - Run `npm run build` in this directory
2. **Deploy the build** - The build script copies files to `public/static/` in the parent Next.js app
3. **Access** - The static site is served at `http://localhost:3000/`

## Project Structure

```
static/
├── src/           # React source files
├── public/        # Static assets (favicon, logo, etc.)
├── package.json   # Dependencies and scripts
└── README.md      # This file
```

## Key Files

- **App.js** - Main application component
- **AboutUs.js** - About Us page content
- **NeighborhoodMap.js** - Interactive map component
- **ContactFormModal.js** - Contact form modal

## Notes

- This React app uses Create React App (CRA)
- The build output is consumed by the Next.js parent application
- Static assets are served from the `public/` directory in the Next.js app
