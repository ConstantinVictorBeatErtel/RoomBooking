# AGENTS.md - Room Booking Application

## Commands

- Build: `npm run build`
- Start dev server: `npm start` (localhost:3000)
- Test: `npm test`
- Run single test: `npm test -- --testNamePattern="test name"`

## Architecture

- **Frontend**: React 19.1 SPA with Create React App
- **Database**: Supabase (PostgreSQL with real-time subscriptions)
- **UI / Styling**: Tailwind CSS is the primary styling engine. It is supplemented by:
    - **[Flowbite React](https://www.flowbite-react.com/)**: Used for complex, pre-built components like `Tooltip` to accelerate development.
    - **[Lucide React](https://lucide.dev/)**: Used for the icon set.
- **Date handling**: date-fns library
- **Environment**: `.env` file for Supabase credentials (REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_ANON_KEY)

## Code Style

- **Components**: Functional components with hooks, PascalCase naming.
- **Props**: Destructured with defaults, spread remaining props.
- **Imports**: React first, external libraries, internal modules (relative paths).
- **Styling**:
    - A utility-first approach with Tailwind CSS is preferred for all custom components.
    - The custom theme is defined in `tailwind.config.js` (e.g., `brand-blue`, `neutral-dark`).
    - `clsx` is used for conditionally applying classes.
- **Component Library**: 
    - Components from `flowbite-react` are