# AGENTS.md - Room Booking Application

## Commands

- Build: `npm run build`
- Start dev server: `npm start` (localhost:3000)
- Test: `npm test`
- Run single test: `npm test -- --testNamePattern="test name"`

## Architecture

- **Frontend**: React 19.1 SPA with Create React App
- **Database**: Supabase (PostgreSQL with real-time subscriptions)
- **Styling**: Tailwind CSS with Lucide React icons
- **Date handling**: date-fns library
- **Environment**: `.env` file for Supabase credentials (REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_ANON_KEY)

## Code Style

- **Components**: Functional components with hooks, PascalCase naming
- **Props**: Destructured with defaults, spread remaining props
- **Imports**: React first, external libraries, internal modules (relative paths)
- **Styling**: Tailwind classes, utility-first approach
- **Error handling**: Console logging, try-catch blocks
- **State**: useState for local state, useEffect for side effects
- **Database**: Supabase client in `src/lib/supabaseClient.js`
- **File structure**: Components in `src/components/`, utilities in `src/lib/`

## Dependencies

- Always use context7 when I need code generation, setup or configuration steps, or
  library/API documentation. This means you should automatically use the Context7 MCP
  tools to resolve library id and get library docs without me having to explicitly ask.
