# Restaurant Inventory Management System

A comprehensive multi-department restaurant inventory management system designed for Smooth Cafe Moalboal. Features real-time stock tracking, low stock alerts, delivery management, and recipe tracking across Kitchen, Bar, Coffee, and Commissary departments.

## Features

### 📊 Dashboard & Analytics
- Real-time inventory overview across all departments
- Low stock alerts with critical/warning levels
- Department-wise statistics and metrics
- Recent inventory movement tracking

### 🏪 Multi-Department Management
- **Kitchen**: Food items, ingredients, cooking supplies
- **Bar**: Alcoholic beverages, mixers, bar supplies
- **Coffee**: Coffee beans, syrups, brewing equipment
- **Commissary**: Bulk items, shared supplies

### 📦 Inventory Tracking
- Real-time stock level monitoring
- Automatic low stock alerts
- Min/max level management
- SKU-based product identification
- Unit cost tracking and COGS calculation

### 🚚 Delivery Management
- Supplier management and tracking
- Delivery receipt processing
- Line item verification
- Automatic stock updates upon delivery

### 👥 User Management
- Role-based access control (Admin, Manager, Department Staff)
- Department-specific data access
- User activity tracking

### 🧾 Recipe Management
- Recipe creation and ingredient tracking
- Theoretical usage calculations
- Cost analysis per recipe

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling and HMR
- **Tailwind CSS** for styling
- **Radix UI** component library
- **TanStack Query** for state management
- **React Hook Form** with Zod validation
- **Wouter** for routing

### Backend
- **Node.js** with Express.js
- **TypeScript** with ES modules
- **Drizzle ORM** for database operations
- **PostgreSQL** database (Supabase)
- **Zod** for schema validation

### Development
- **Hot Module Replacement** for both frontend and backend
- **Type-safe** API contracts
- **Mobile-responsive** design
- **Session-based** authentication

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (Supabase recommended)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd restaurant-inventory-system
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy the example file
cp .env.example .env

# Add your database URL
DATABASE_URL=postgresql://username:password@host:port/database
```

4. Set up the database:
```bash
# Push the schema to your database
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Database Setup

### Using Supabase (Recommended)

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings → Database
3. Copy the "Direct connection" URL (not the pooler URL)
4. Add it to your environment variables as `DATABASE_URL`

### Local PostgreSQL

1. Install PostgreSQL locally
2. Create a new database
3. Update the `DATABASE_URL` with your local connection string

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio for database management

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and configurations
├── server/                # Backend Express application
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API route definitions
│   ├── storage.ts        # Database storage implementation
│   └── db.ts             # Database connection
├── shared/               # Shared types and schemas
│   └── schema.ts         # Drizzle schema definitions
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Products
- `GET /api/products` - Get all products
- `GET /api/products?department=kitchen` - Get products by department
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product

### Inventory
- `GET /api/inventory` - Get all inventory
- `GET /api/inventory/low-stock` - Get low stock items
- `PUT /api/inventory/:productId/:department` - Update stock levels

### Deliveries
- `GET /api/deliveries` - Get all deliveries
- `POST /api/deliveries` - Create new delivery
- `POST /api/delivery-items` - Add items to delivery

### Reports
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/inventory-movements/recent` - Get recent movements

## Configuration

### Environment Variables

```env
DATABASE_URL=postgresql://username:password@host:port/database
NODE_ENV=development
```

### Database Schema

The system uses a comprehensive PostgreSQL schema with:
- Users with role-based access
- Products with department categorization
- Inventory tracking per department
- Suppliers and delivery management
- Recipe and ingredient relationships
- Complete audit trail for all movements

## Deployment

### Replit Deployment

1. Connect your GitHub repository to Replit
2. Set the `DATABASE_URL` environment variable in Replit Secrets
3. Run `npm install` and `npm run db:push`
4. Start with `npm run dev`

### Other Platforms

The application can be deployed to any Node.js hosting platform:
- Vercel
- Netlify
- Railway
- Heroku
- DigitalOcean App Platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is proprietary software developed for Smooth Cafe Moalboal.

## Support

For technical support or feature requests, please contact the development team.

---

Built with ❤️ for Smooth Cafe Moalboal