# CRM Support System ✅ WORKING

A complete CRM system for technical support with user management, ticket tracking, and role-based access control.

**🎉 STATUS: FULLY FUNCTIONAL**
- ✅ Backend running on http://localhost:3001
- ✅ Frontend running on http://localhost:5173
- ✅ API Documentation at http://localhost:3001/api/docs
- ✅ Database seeded with demo accounts

## Quick Start (Already Working!)

### Demo Accounts
- **Admin**: admin@crm.com / admin123 (full access)
- **User**: user@crm.com / user123 (own tickets only)

### Access Points
1. **Frontend**: http://localhost:5173 (Click preview button above)
2. **API Docs**: http://localhost:3001/api/docs (Swagger documentation)
3. **Backend API**: http://localhost:3001

## Technology Stack

### Backend
- **NestJS** - Node.js framework ✅
- **SQLite** - Database (development) ✅
- **Prisma** - Database ORM ✅
- **JWT** - Authentication ✅
- **bcryptjs** - Password hashing ✅
- **Swagger** - API documentation ✅

### Frontend
- **React 19** - Frontend framework ✅
- **TypeScript** - Type safety ✅
- **CSS** - Custom styling (simplified) ✅
- **Vite** - Build tool ✅

## Features

### User Management
- ✅ User registration and login
- ✅ Role-based access control (Admin, User)
- ✅ JWT authentication
- ✅ Profile management

### Ticket Management
- ✅ Create, read, update tickets
- ✅ Ticket priorities (Low, Medium, High, Urgent)
- ✅ Ticket statuses (Open, In Progress, Resolved, Closed)
- ✅ Comments system
- ✅ File attachments support

### Admin Features
- ✅ User management (CRUD operations)
- ✅ Assign tickets to users
- ✅ View all tickets across the system
- ✅ Internal comments (admin only)

### Dashboard
- ✅ Ticket statistics
- ✅ Recent tickets overview
- ✅ Quick actions

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE crm_support_db;
CREATE USER crm_user WITH ENCRYPTED PASSWORD 'crm_password';
GRANT ALL PRIVILEGES ON DATABASE crm_support_db TO crm_user;
```

2. Update the database connection string in `server/.env`:
```env
DATABASE_URL=\"postgresql://crm_user:crm_password@localhost:5432/crm_support_db?schema=public\"
```

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Generate Prisma client:
```bash
npx prisma generate
```

4. Run database migrations:
```bash
npx prisma migrate dev --name init
```

5. Seed the database with sample data:
```bash
npm run prisma:seed
```

6. Start the development server:
```bash
npm run start:dev
```

The backend will be running at `http://localhost:3000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be running at `http://localhost:5173`

## Demo Accounts

After running the seed script, you can log in with:

### Administrator Account
- **Email:** admin@crm.com
- **Password:** admin123
- **Permissions:** Full access to all features

### Regular User Account
- **Email:** user@crm.com
- **Password:** user123
- **Permissions:** Can create and manage own tickets

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Users (Admin only)
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Deactivate user

### Tickets
- `GET /tickets` - Get tickets (filtered by role)
- `GET /tickets/:id` - Get ticket details
- `POST /tickets` - Create new ticket
- `PATCH /tickets/:id` - Update ticket
- `POST /tickets/:id/comments` - Add comment to ticket
- `GET /tickets/statistics` - Get ticket statistics

## Project Structure

```
/
├── server/                 # Backend (NestJS)
│   ├── src/
│   │   ├── auth/          # Authentication module
│   │   ├── users/         # User management
│   │   ├── tickets/       # Ticket management
│   │   ├── prisma/        # Database service
│   │   └── main.ts        # Application entry point
│   ├── prisma/
│   │   ├── schema.prisma  # Database schema
│   │   └── seed.ts        # Database seeding
│   └── .env               # Environment variables
│
├── client/                # Frontend (React)
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── App.tsx        # Main app component
│   └── .env               # Environment variables
│
README.md                  # This file
```

## Environment Variables

### Backend (.env)
```env
DATABASE_URL=\"postgresql://crm_user:crm_password@localhost:5432/crm_support_db?schema=public\"
JWT_SECRET=\"your-super-secret-jwt-key-here-change-in-production\"
JWT_EXPIRES_IN=\"24h\"
PORT=3000
NODE_ENV=\"development\"
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
```

## Development Commands

### Backend
- `npm run start:dev` - Start development server
- `npm run build` - Build for production
- `npx prisma studio` - Open database viewer
- `npx prisma migrate dev` - Run database migrations
- `npm run prisma:seed` - Seed database

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Security Features

- 🔒 JWT-based authentication
- 🔒 Password hashing with bcrypt
- 🔒 Role-based access control
- 🔒 API route protection
- 🔒 Input validation
- 🔒 CORS configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please create a ticket in the system or contact the development team.

---

**Built with ❤️ using NestJS and React**