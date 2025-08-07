# Restaurant Inventory Management System

## Overview

This is a full-stack restaurant inventory management system designed to track stock levels, manage deliveries, and handle inventory movements across multiple departments (kitchen, bar, coffee, commissary). The application provides real-time monitoring of critical items, department-wise inventory organization, and comprehensive tracking of all inventory activities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation
- **Mobile-First Design**: Responsive layout with dedicated mobile navigation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Schema Validation**: Zod schemas shared between frontend and backend
- **Session Management**: Basic in-memory authentication (production-ready session management needed)
- **API Design**: RESTful endpoints with standardized error handling

### Database Design
- **Database**: PostgreSQL with Neon Database as the provider
- **Schema Structure**:
  - **Users**: Role-based access control (admin, manager, department staff)
  - **Products**: Comprehensive product catalog with SKU, departments, and units
  - **Inventory**: Real-time stock tracking per department
  - **Suppliers**: Vendor management system
  - **Deliveries**: Delivery tracking with line items
  - **Inventory Movements**: Complete audit trail of all stock changes
  - **Recipes**: Recipe management with ingredient tracking
- **Key Features**: 
  - Enum-based type safety for departments, roles, and movement types
  - UUID primary keys for scalability
  - Automatic timestamp tracking

### Authentication & Authorization
- **Role-Based Access**: Admin, manager, and department-specific staff roles
- **Department Isolation**: Staff can only access their assigned department data
- **Session Storage**: Browser localStorage for session persistence
- **Security**: Password-based authentication (hashing needed for production)

### Development Environment
- **Development Server**: Vite with HMR for frontend, tsx for backend hot reload
- **Build Process**: Vite for frontend bundling, esbuild for backend compilation
- **Database Management**: Drizzle Kit for migrations and schema management
- **Type Safety**: Shared TypeScript types between frontend and backend

## External Dependencies

### Database Services
- **Neon Database**: PostgreSQL hosting with serverless architecture
- **Drizzle ORM**: Type-safe database operations and migrations

### UI and Styling
- **Radix UI**: Headless component primitives for accessibility
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide Icons**: Icon library (with FontAwesome fallback in components)

### Form and Validation
- **React Hook Form**: Form state management and validation
- **Zod**: Schema validation shared across frontend and backend
- **@hookform/resolvers**: Integration between React Hook Form and Zod

### Development Tools
- **Vite**: Frontend build tool and development server
- **ESBuild**: Backend bundling for production
- **TypeScript**: Type safety across the entire stack
- **Replit Integration**: Development environment plugins for Replit

### Utilities
- **Date-fns**: Date manipulation and formatting
- **Class Variance Authority**: Component variant management
- **clsx & tailwind-merge**: Conditional CSS class handling
- **TanStack Query**: Server state management and caching
- **Wouter**: Lightweight routing solution

### Production Dependencies
- **Express.js**: Web application framework
- **connect-pg-simple**: PostgreSQL session store (configured but not actively used)
- **nanoid**: Unique ID generation