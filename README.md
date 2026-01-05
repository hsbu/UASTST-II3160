# Library Super App

A Next.js + React web service that consumes the Cataloging and Circulation APIs.

## Features

- **Book Management** - Browse, search, create, update, and delete books
- **Loan Management** - Create loans for borrowing books  
- **Fines Tracking** - View loan history and fines
- **Authentication** - JWT-based authentication with role-based access
- **Role-Based Access** - Member and Librarian roles with different permissions

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Running backend services:
  - Cataloging Service (default: http://18223014.tesatepadang.space)
  - Circulation Service (default: http://18223096.tesatepadang.space)

## Installation

1. Install dependencies:
```bash
cd library-frontend
npm install
```

2. Configure environment variables:
```bash
# Copy the example env file
cp .env.example .env.local

# Edit .env.local with your API URLs
NEXT_PUBLIC_CATALOGING_API_URL=http://localhost:3000
NEXT_PUBLIC_CIRCULATION_API_URL=http://localhost:3002
```

3. Start the development server:
```bash
npm run dev
```

4. Open http://localhost:3001 in your browser

## Project Structure

```
library-frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── books/              # Book management pages
│   │   ├── loans/              # Loan creation page
│   │   ├── fines/              # Fines viewing page
│   │   ├── returns/            # Book returns (librarian)
│   │   ├── stats/              # Statistics page
│   │   └── login/              # Login page
│   ├── components/             # React components
│   │   ├── ui/                 # Base UI components
│   │   ├── layout/             # Layout components
│   │   ├── auth/               # Auth components
│   │   ├── books/              # Book-related components
│   │   └── loans/              # Loan-related components
│   ├── context/                # React Context providers
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utilities and API clients
│   │   ├── api/                # API service layer
│   │   └── auth/               # Auth utilities
│   └── types/                  # TypeScript types
├── .env.local                  # Environment variables
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## API Integration

### Cataloging Service (Books)
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get book by ID
- `GET /api/books/genres/:genre` - Search by genre
- `GET /api/books/year/:year` - Search by year
- `GET /api/books/author/:author` - Search by author
- `POST /api/books` - Create book (librarian only)
- `PUT /api/books/:id` - Update book (librarian only)
- `DELETE /api/books/:id` - Delete book (librarian only)
- `GET /api/stats` - Get statistics

### Circulation Service (Loans)
- `POST /auth/login` - Login and get JWT token
- `POST /loan/create` - Create a loan
- `GET /loan/fines/:userId` - Get user's fines
- `POST /loan/return` - Return a book (librarian only)

## User Roles

### Member
- Browse and search books
- View book details
- Create loans for themselves
- View their own fines

### Librarian
- All member permissions
- Add, edit, and delete books
- Process book returns
- View fines for any user

## Technologies

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **TanStack Query** - Server state management
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **jwt-decode** - JWT token parsing

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```
