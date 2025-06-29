# PINTUMAS News Website

A modern news website built with Next.js, featuring a comprehensive admin panel for content management.

## Features

### Public Features
- 🏠 Homepage with featured articles and categories
- 📰 News listing with filtering and search
- 📱 Responsive design for all devices
- 🔍 Advanced search functionality
- 👤 User authentication and profiles
- 💬 Comment system
- 📑 Legal pages (Privacy Policy, Terms of Service, Cookie Policy)

### Admin Features
- 📊 Comprehensive dashboard with analytics
- ✍️ Post management (Create, Edit, Delete, Publish)
- 💬 Comment moderation
- 🏷️ Category and tag management
- 👥 User management
- 🔐 Role-based access control (Admin, Moderator)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based auth with HTTP-only cookies
- **Styling**: Tailwind CSS + shadcn/ui components
- **Validation**: Zod for type-safe validation
- **Language**: TypeScript

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pintumas-news
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your database and JWT secret:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/pintumas_db"
   JWT_SECRET="your-super-secret-jwt-key"
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Push database schema
   npm run db:push
   
   # Seed the database with initial data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

### Admin Access

After seeding the database, you can access the admin panel at `/admin/login` with:

**Admin User:**
- Email: `admin@pintumas.com`
- Password: `admin123`

**Moderator User:**
- Email: `moderator@pintumas.com`  
- Password: `mod123`

## Project Structure

```
├── app/
│   ├── (admin)/           # Admin panel pages
│   │   ├── layout.tsx     # Admin layout with sidebar
│   │   ├── page.tsx       # Admin dashboard
│   │   ├── posts/         # Post management
│   │   ├── comments/      # Comment moderation
│   │   ├── categories/    # Category management
│   │   └── login/         # Admin login
│   ├── (main)/            # Public pages
│   │   ├── layout.tsx     # Main layout with header/footer
│   │   ├── page.tsx       # Homepage
│   │   ├── news/          # News listing
│   │   ├── post/[slug]/   # Individual post pages
│   │   └── ...            # Other public pages
│   └── api/               # API routes
│       ├── auth/          # Authentication endpoints
│       └── admin/         # Admin API endpoints
├── components/
│   ├── admin/             # Admin-specific components
│   ├── ui/                # Reusable UI components
│   └── ...                # Other components
├── lib/
│   ├── auth.ts            # Authentication utilities
│   ├── prisma.ts          # Database client
│   ├── validations.ts     # Zod schemas
│   └── utils.ts           # Utility functions
└── prisma/
    ├── schema.prisma      # Database schema
    └── seed.ts            # Database seeding script
```

## Database Schema

The application uses the following main entities:

- **User**: User accounts with role-based permissions
- **Category**: Content categories for organizing posts
- **Post**: Articles/news posts with status management
- **Comment**: User comments with moderation
- **Tag**: Post tags for better categorization

## API Routes

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Logout

### Admin API
- `GET /api/admin/posts` - List all posts
- `POST /api/admin/posts` - Create new post
- `PUT /api/admin/posts/[id]` - Update post
- `DELETE /api/admin/posts/[id]` - Delete post
- `PUT /api/admin/comments/[id]` - Update comment status
- `DELETE /api/admin/comments/[id]` - Delete comment

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database commands
npm run db:push      # Push schema changes
npm run db:migrate   # Create and run migrations
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database with sample data

# Linting
npm run lint
```

## Deployment

### Environment Variables

Ensure the following environment variables are set in production:

```env
DATABASE_URL="your-production-database-url"
JWT_SECRET="your-production-jwt-secret"
NEXTAUTH_SECRET="your-production-nextauth-secret"
NEXTAUTH_URL="https://your-domain.com"
```

### Build and Deploy

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to your hosting platform**
   - Vercel: Connect your Git repository
   - Railway: Deploy with PostgreSQL addon
   - Docker: Use the included Dockerfile

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please:

1. Check the existing GitHub issues
2. Create a new issue with detailed information
3. Contact the development team

---

Built with ❤️ using Next.js and modern web technologies.
