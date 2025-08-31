# Quick Start Guide

## Prerequisites Setup

### 1. Install PostgreSQL

**Windows:**
- Download PostgreSQL from https://www.postgresql.org/download/windows/
- Install with default settings
- Remember the password you set for the `postgres` user

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Create Database and User

Open PostgreSQL command line (psql) and run:

```sql
-- Connect as postgres user
\\c postgres

-- Create database
CREATE DATABASE crm_support_db;

-- Create user
CREATE USER crm_user WITH ENCRYPTED PASSWORD 'crm_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE crm_support_db TO crm_user;

-- Exit
\\q
```

## Quick Installation

### 1. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies (if not already done)
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed database with demo data
npm run prisma:seed

# Start backend server
npm run start:dev
```

**Backend will run on: http://localhost:3000**

### 2. Frontend Setup

In a **new terminal window**:

```bash
# Navigate to client directory
cd client

# Install dependencies (you may need to install missing packages)
npm install @tanstack/react-query axios react-router-dom tailwindcss postcss autoprefixer lucide-react

# Start frontend server
npm run dev
```

**Frontend will run on: http://localhost:5173**

## Demo Login Credentials

### Administrator Account
- **Email:** admin@crm.com
- **Password:** admin123
- **Access:** Full system access, can manage users and all tickets

### Regular User Account
- **Email:** user@crm.com
- **Password:** user123
- **Access:** Can create and manage own tickets

## Testing the System

1. **Open your browser** and go to http://localhost:5173
2. **Login** with either demo account
3. **Explore features:**
   - Dashboard with statistics
   - Create and manage tickets
   - User management (admin only)
   - Profile management

## Troubleshooting

### Database Connection Issues

If you get database connection errors:

1. **Check PostgreSQL is running:**
   ```bash
   # Windows (in Command Prompt as Administrator)
   net start postgresql-x64-14
   
   # macOS
   brew services restart postgresql
   
   # Linux
   sudo systemctl status postgresql
   ```

2. **Verify database exists:**
   ```bash
   psql -U crm_user -d crm_support_db
   ```

3. **Check connection string in server/.env:**
   ```env
   DATABASE_URL=\"postgresql://crm_user:crm_password@localhost:5432/crm_support_db?schema=public\"
   ```

### Missing Dependencies

If you get module not found errors in the frontend:

```bash
cd client
npm install @tanstack/react-query axios react-router-dom @types/node tailwindcss postcss autoprefixer lucide-react react-hook-form @hookform/resolvers zod date-fns
```

### Port Conflicts

- **Backend (port 3000):** Change `PORT=3001` in `server/.env`
- **Frontend (port 5173):** Vite will automatically use next available port

## System Architecture

```
┌─────────────────┐    HTTP/API    ┌─────────────────┐
│                 │───────────────▶│                 │
│   React Frontend│                │  NestJS Backend │
│   (Port 5173)   │◀───────────────│   (Port 3000)   │
│                 │                │                 │
└─────────────────┘                └─────────────────┘
                                            │
                                            │ Prisma ORM
                                            ▼
                                   ┌─────────────────┐
                                   │                 │
                                   │   PostgreSQL    │
                                   │   Database      │
                                   │   (Port 5432)   │
                                   └─────────────────┘
```

## Next Steps

1. **Customize the UI** - Modify React components in `client/src/pages/`
2. **Add Features** - Extend the backend API in `server/src/`
3. **Database Changes** - Update `server/prisma/schema.prisma` and run migrations
4. **Deploy** - Configure for production deployment

## Need Help?

If you encounter any issues:
1. Check the browser console for frontend errors
2. Check the backend terminal for API errors
3. Verify database connection and credentials
4. Ensure all dependencies are installed

**Happy coding! 🚀**