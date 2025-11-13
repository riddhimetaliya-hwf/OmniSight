# OmniSight Setup Guide

## Environment Setup

Create a `.env` file with:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_NAME=OmniSight
VITE_APP_ENV=development
```

## Architecture Improvements Made

1. **Type Safety**: Centralized types in `src/types/global.ts`
2. **Modular Routing**: Organized routes in `src/routes/index.tsx`
3. **Authentication**: Supabase integration with `AuthContext`
4. **Code Organization**: Constants and utilities separated
5. **Configuration**: Enhanced ESLint and TypeScript configs

## Next Steps

1. Configure Supabase project
2. Run database migrations
3. Fix remaining TypeScript issues
4. Test authentication flow

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Application Configuration
VITE_APP_NAME=OmniSight
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=development

# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG_MODE=true
VITE_ENABLE_MOCK_DATA=true
```

### 2. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from the project settings
3. Update your `.env` file with these values
4. Run the database migrations (see Database Setup section)

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Development Server

```bash
npm run dev
```

## 🏗️ Architecture Improvements Made

### 1. **Type Safety Enhancement**
- ✅ Created centralized types in `src/types/global.ts`
- ✅ Replaced `any` types with proper TypeScript interfaces
- ✅ Added strict ESLint rules for type safety

### 2. **Modular Routing System**
- ✅ Separated routes into `src/routes/index.tsx`
- ✅ Organized routes by feature domains
- ✅ Improved maintainability and scalability

### 3. **Authentication & State Management**
- ✅ Integrated Supabase for authentication
- ✅ Created `AuthContext` for user state management
- ✅ Added database helper functions

### 4. **Code Organization**
- ✅ Created centralized constants in `src/constants/index.ts`
- ✅ Added utility functions in `src/utils/index.ts`
- ✅ Separated non-component exports from context files

### 5. **Configuration Management**
- ✅ Enhanced ESLint configuration for better code quality
- ✅ Added proper TypeScript configuration
- ✅ Created environment variable template

## 📁 Project Structure

```
src/
├── components/          # React components organized by feature
├── contexts/           # React contexts (Auth, etc.)
├── constants/          # Application constants
├── hooks/             # Custom React hooks
├── lib/               # Library configurations (Supabase, etc.)
├── pages/             # Page components
├── routes/            # Route definitions
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
└── App.tsx           # Main application component
```

## 🔧 Database Setup

### Required Tables

The following tables should be created in your Supabase database:

1. **users** - User profiles and preferences
2. **dashboards** - User dashboards
3. **widgets** - Dashboard widgets
4. **kpis** - Key Performance Indicators
5. **alerts** - System alerts and notifications
6. **workflows** - Automation workflows

### SQL Schema

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  avatar_url TEXT,
  preferences JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dashboards table
CREATE TABLE dashboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  config JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Widgets table
CREATE TABLE widgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dashboard_id UUID REFERENCES dashboards(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  config JSONB NOT NULL,
  position JSONB NOT NULL,
  size JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- KPIs table
CREATE TABLE kpis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  value DECIMAL NOT NULL,
  target DECIMAL,
  unit TEXT NOT NULL,
  trend TEXT NOT NULL,
  change DECIMAL NOT NULL,
  period TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Alerts table
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  actions JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workflows table
CREATE TABLE workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  steps JSONB NOT NULL,
  status TEXT NOT NULL,
  triggers JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🚨 Remaining Issues to Fix

### 1. **TypeScript `any` Types**
- Replace remaining `any` types in component files
- Use proper interfaces from `src/types/global.ts`

### 2. **React Hooks Dependencies**
- Fix missing dependencies in `useEffect` and `useCallback` hooks
- Add proper dependency arrays

### 3. **Context File Exports**
- Move non-component exports to separate files
- Keep only React components in context files

### 4. **Variable Declarations**
- Use `const` instead of `let` for variables that aren't reassigned
- Fix lexical declarations in switch/case blocks

## 🧪 Testing

```bash
# Run linting
npm run lint

# Run type checking
npx tsc --noEmit

# Run tests (when implemented)
npm test
```

## 📝 Development Guidelines

### Code Style
- Use TypeScript strict mode
- Follow ESLint rules
- Use proper type annotations
- Avoid `any` types

### Component Structure
- Keep components focused and single-purpose
- Use proper prop types
- Implement proper error boundaries

### State Management
- Use React Context for global state
- Use local state for component-specific data
- Leverage Supabase for server state

### Performance
- Implement proper memoization
- Use React.memo for expensive components
- Optimize bundle size with code splitting

## 🔄 Migration Steps

1. **Update Environment Variables**
   - Copy the environment variables from above
   - Configure your Supabase project

2. **Run Database Migrations**
   - Execute the SQL schema in your Supabase SQL editor

3. **Update Component Imports**
   - Import types from `@/types/global`
   - Import utilities from `@/utils`
   - Import constants from `@/constants`

4. **Fix Type Issues**
   - Replace `any` types with proper interfaces
   - Add proper type annotations

5. **Test the Application**
   - Run the development server
   - Test authentication flow
   - Verify all features work correctly

## 🆘 Troubleshooting

### Common Issues

1. **Supabase Connection Errors**
   - Verify environment variables are set correctly
   - Check Supabase project status
   - Ensure database tables exist

2. **TypeScript Errors**
   - Run `npx tsc --noEmit` to check types
   - Fix any type mismatches
   - Update component prop types

3. **Build Errors**
   - Clear node_modules and reinstall
   - Check for missing dependencies
   - Verify import paths

### Getting Help

- Check the Supabase documentation
- Review TypeScript best practices
- Consult React documentation for hooks and context 