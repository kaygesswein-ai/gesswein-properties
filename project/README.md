# Gesswein Properties - Real Estate Website

A modern, production-ready real estate website built with Next.js 14, TypeScript, TailwindCSS, and Supabase for the Chilean market.

## 🚀 Features

- **Property Listings**: Advanced search and filtering system
- **Property Details**: Comprehensive property pages with galleries
- **Contact Forms**: Lead generation and referral system
- **Team Profiles**: Professional team showcase
- **Services Pages**: Corretaje, architectural consulting, and regulatory advice
- **Chilean Localization**: CLP/UF currency support, Chilean communes
- **Analytics**: GA4 and Meta Pixel integration
- **SEO Optimized**: JSON-LD structured data and metadata
- **Responsive Design**: Mobile-first approach
- **Supabase Integration**: Full-stack data management

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS
- **UI Components**: shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Styling**: TailwindCSS + Custom Design System
- **Analytics**: Google Analytics 4, Meta Pixel
- **Icons**: Lucide React

## 📋 Setup Instructions

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new account
2. Create a new project
3. Wait for the project to be fully initialized
4. Go to Project Settings → API to get your credentials

### 2. Set Up Database Schema

1. In your Supabase dashboard, go to the SQL Editor
2. Copy the contents of `supabase.sql` and execute it
3. Optionally, run `supabase_seed.sql` to add sample properties

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=your_google_analytics_id
NEXT_PUBLIC_META_PIXEL_ID=your_meta_pixel_id

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the website.

## 🏗️ Project Structure

```
├── app/
│   ├── api/                 # API routes
│   │   ├── propiedades/     # Properties API
│   │   ├── leads/           # Leads API
│   │   └── referidos/       # Referrals API
│   ├── propiedades/         # Properties pages
│   ├── servicios/           # Services page
│   ├── equipo/              # Team page
│   ├── contacto/            # Contact page
│   └── (legal)/             # Legal pages
├── components/              # Reusable components
│   ├── ui/                  # shadcn/ui components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── PropertyCard.tsx
│   ├── PropertyFilters.tsx
│   ├── LeadForm.tsx
│   └── ReferralForm.tsx
├── lib/                     # Utility functions
│   ├── supabase.ts          # Supabase client
│   ├── analytics.ts         # Analytics functions
│   └── utils/
│       └── currency.ts      # Chilean currency formatting
├── supabase.sql             # Database schema
└── supabase_seed.sql        # Sample data
```

## 🔧 Configuration

### Database Tables

- **propiedades**: Property listings with Chilean-specific fields (UF/CLP pricing, communes)
- **leads**: Contact form submissions and property inquiries
- **referidos**: Referral program entries

### Row Level Security (RLS)

- Public read access for properties
- Insert-only access for leads and referrals
- Full access for service role (admin operations)

### Currency Support

- **UF (Unidad de Fomento)**: Chilean inflation-indexed unit
- **CLP (Chilean Peso)**: Local currency
- Automatic formatting based on Chilean locale

## 📊 Testing Forms and Data

### Testing Property Listings

1. Ensure the development server is running
2. Visit `/propiedades` to see the listings
3. Use filters to test search functionality
4. Click on properties to view details

### Testing Contact Forms

1. Fill out any contact form on the website
2. Check your Supabase dashboard → Table Editor → `leads`
3. Verify the submission appears in the database

### Testing Referral Program

1. Go to the homepage and scroll to the referral form
2. Fill out all required fields
3. Check the `referidos` table in Supabase

## 🚀 Deployment

### Environment Variables for Production

Make sure to set all environment variables in your hosting platform:

```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_supabase_service_role_key
NEXT_PUBLIC_GA_ID=your_google_analytics_id
NEXT_PUBLIC_META_PIXEL_ID=your_meta_pixel_id
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Build Command

```bash
npm run build
```

## 📱 Features Overview

### Property Management
- Advanced filtering by operation type, property type, location, price, and size
- Property detail pages with image galleries
- WhatsApp integration for direct contact
- Visit request forms

### Lead Generation
- Contact forms on multiple pages
- Referral program with detailed tracking
- WhatsApp click tracking
- Analytics integration for conversion tracking

### Chilean Market Specific
- UF and CLP currency support
- Santiago commune listings
- Chilean phone number formatting
- Local business structured data

### SEO & Analytics
- JSON-LD structured data for properties and business
- Google Analytics 4 integration
- Meta Pixel for social media advertising
- Optimized meta tags and descriptions

## 🔒 Legal Compliance

The website includes pages for:
- Privacy Policy (Ley 19.628 compliant)
- Cookie Policy
- Terms of Service for Referral Program

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is private and proprietary to Gesswein Properties.

## 🆘 Support

For technical issues or questions:
- Email: desarrollo@gessweinproperties.cl
- Check the Supabase documentation for database issues
- Review Next.js documentation for frontend issues

## 🔄 Updates

Regular updates include:
- Security patches
- New features based on user feedback
- Performance optimizations
- SEO improvements

---

Built with ❤️ for the Chilean real estate market.