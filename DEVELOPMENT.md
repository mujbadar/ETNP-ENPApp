# Development Guide

## Project Structure

This repo contains two integrated apps:

1. **Next.js App** (at root): ENP Patrol dashboard

   - Protected route at `/`
   - Login at `/login`
   - API routes at `/api/*`

2. **React Marketing Site** (source in `../ETNP/etnp/`)
   - Static site served at `/static/`
   - Accessible at `https://your-domain.com/static/`

## Development Workflow

### Making Changes to the Next.js App

Just edit files in `src/` and run:

```bash
npm run dev
```

### Making Changes to the React Marketing Site

1. Edit files in `../ETNP/etnp/src/`
2. Rebuild and copy to Next.js:
   ```bash
   npm run build:react
   ```
3. Or build everything:
   ```bash
   npm run build
   ```

## Building for Production

```bash
npm run build
```

This will:

1. Build the React app from `../ETNP/etnp/`
2. Copy built files to `public/static/`
3. Build the Next.js app

## Deployment

The build process automatically includes the React app. No separate deployment needed.

## Important Notes

- The React source code is **not** copied into this repo
- Built files in `public/static/` are gitignored (regenerated on each build)
- Keep both repos (`ETNP/etnp` and `enp-patrol`) in sync for changes
- The `/login` link in the React app points to the Next.js login at `/login`
