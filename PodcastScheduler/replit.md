# Calendario Semanal Escolar con Post-it

## Overview

This is a full-stack React application for managing a weekly school calendar with post-it style notes. The application allows users to create, organize, and manage educational activities across weekdays with optional weekend support. It features a modern drag-and-drop interface, note categorization, image attachments, and export/sharing capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a full-stack TypeScript architecture with a React frontend and Express backend:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight routing
- **State Management**: React Context API for global state, TanStack Query for server state
- **UI Library**: Radix UI components with shadcn/ui styling
- **Styling**: Tailwind CSS with custom theme support
- **Build Tool**: Vite for development and production builds
- **Drag & Drop**: react-beautiful-dnd for note reordering

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **API**: RESTful endpoints for CRUD operations
- **File Handling**: Multer for image uploads (stored as base64)

## Key Components

### Database Schema (shared/schema.ts)
- **Users Table**: Basic user authentication (id, username, password)
- **Notes Table**: Core note entity with fields for title, content, day, category, image, position, color, repeat settings, and week offset
- **Constants**: Predefined days, categories, and color options

### Frontend Components
- **CalendarPage**: Main calendar interface with drag-and-drop functionality
- **WeeklyCalendar**: Grid layout displaying days of the week
- **DayColumn**: Individual day containers with note display
- **NoteComponent**: Individual note cards with edit/delete actions
- **NoteForm**: Form for creating/editing notes with image upload
- **Modal System**: Note editing, image viewing, export, and sharing modals

### Backend Services
- **Storage Layer**: Abstract storage interface with in-memory implementation
- **Routes**: RESTful API endpoints for notes CRUD operations
- **Database Connection**: Neon PostgreSQL with connection pooling

## Data Flow

1. **Note Creation**: User creates note via modal form → API POST → Database insert → UI update
2. **Note Management**: Drag-and-drop updates positions → API PUT → Database update → State refresh
3. **Week Navigation**: Week offset changes → API GET with offset parameter → Notes filtered by week
4. **Export/Share**: Calendar rendered → HTML2Canvas → PDF/Image generation → Download/Share link

## External Dependencies

### Core Framework Dependencies
- React ecosystem (React, React DOM, React Query)
- Express.js with TypeScript support
- Drizzle ORM with PostgreSQL driver

### UI and Styling
- Radix UI components for accessible primitives
- Tailwind CSS for utility-first styling
- Lucide React for icons
- react-beautiful-dnd for drag-and-drop

### Database and Storage
- @neondatabase/serverless for PostgreSQL connection
- Drizzle Kit for database migrations
- WebSocket support for real-time connections

### Utilities and Tools
- Zod for runtime type validation
- html2canvas and jsPDF for export functionality
- date-fns for date manipulation
- Multer for file upload handling

## Deployment Strategy

### Development Environment
- Vite dev server for frontend with HMR
- tsx for TypeScript execution in development
- Concurrent frontend and backend development

### Production Build
- Vite builds frontend to static assets
- esbuild bundles backend into single executable
- Static file serving from Express server

### Database Setup
- Drizzle migrations handle schema changes
- Environment variable for DATABASE_URL configuration
- Connection pooling for production scalability

### Key Features
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Accessibility**: Keyboard navigation and screen reader support
- **Internationalization**: Spanish language interface
- **Performance**: Optimized queries and lazy loading
- **Security**: Input validation and sanitization

The application is designed to be deployed on platforms like Replit, with automatic database provisioning and environment configuration.