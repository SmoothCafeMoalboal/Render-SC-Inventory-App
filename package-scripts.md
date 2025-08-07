# Package Scripts Documentation

## Available Scripts

### Development
```bash
npm run dev
```
Starts the development server with hot reload for both frontend and backend.
- Frontend: Vite dev server with HMR
- Backend: tsx with file watching
- Serves on `http://localhost:5000`

### Database Management
```bash
npm run db:push
```
Pushes schema changes to the database using Drizzle Kit.
Use this when you modify the schema in `shared/schema.ts`.

```bash
npm run db:studio
```
Opens Drizzle Studio for visual database management.

### Build & Production
```bash
npm run build
```
Builds the application for production:
- Frontend assets compiled to `dist/`
- Backend compiled with esbuild

```bash
npm start
```
Starts the production server (after build).

## Development Workflow

1. **Start Development**: `npm run dev`
2. **Make Schema Changes**: Edit `shared/schema.ts`
3. **Push to Database**: `npm run db:push`
4. **Database Management**: `npm run db:studio` (optional)

## Environment Setup

1. Copy environment template: `cp .env.example .env`
2. Add your database URL to `.env`
3. Run `npm run db:push` to initialize the database
4. Start development with `npm run dev`

## Deployment

For deployment instructions, see `DEPLOYMENT.md`.