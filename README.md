# OddJobz - Service Professional Job Board

A modern, user-friendly platform connecting service professionals with customers in South Africa.

## Features

✨ **For Service Professionals:**
- Create professional profiles with service type, hourly rates, and bio
- Browse and connect with customers
- Send and receive messages
- Create and manage quotes
- Receive customer reviews and ratings

✨ **For Customers:**
- Browse service professionals by type and location
- Filter by South African areas and provinces
- Send messages to professionals
- Request quotes
- Leave reviews and ratings

## Technology Stack

- **Frontend**: Next.js 15.5.3, React, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL
- **Authentication**: Custom auth with bcrypt
- **Deployment**: Vercel

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Stranch/oddjobz.git
cd oddjobz
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your database connection:
```
DATABASE_URL=postgresql://user:password@localhost:5432/oddjobz
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Setup

Initialize the database with:
```bash
npm run init-db
```

## Features

### Browse Professionals
- Filter by service type (Gardener, Maid, Handyman, etc.)
- Filter by South African area or province
- View professional profiles with ratings and reviews

### Messaging
- Real-time messaging between professionals and customers
- Message history and conversation tracking

### Quotes
- Request quotes from professionals
- Track quote status (Pending, Accepted, Rejected)
- Manage multiple quotes

### Reviews
- Leave reviews and ratings for professionals
- Build professional reputation

## South African Coverage

Supports all major South African cities and provinces:
- Gauteng, Western Cape, KwaZulu-Natal, Eastern Cape
- Limpopo, Mpumalanga, North West, Free State, Northern Cape
- Major cities: Johannesburg, Cape Town, Durban, Pretoria, and more

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please contact: tybusiness1970@gmail.com

---

**OddJobz** - Connecting skilled professionals with customers across South Africa.
