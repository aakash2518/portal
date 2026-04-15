# Sonehra Wellness - Fee Management System

A Next.js application for managing school fee receipts with Supabase backend.

## Features

- Create and manage fee receipts
- Dashboard with analytics
- PDF receipt generation
- GST calculation (CGST 9% + SGST 9%)
- Receipt viewing and tracking

## Tech Stack

- **Framework**: Next.js 15
- **Database**: Supabase
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **PDF Generation**: jsPDF + html2canvas

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env.local` file with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page (receipt creation)
│   ├── dashboard/         # Dashboard page
│   └── receipt/[id]/      # Dynamic receipt view
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── DashboardStats.tsx
│   ├── FeeForm.tsx
│   └── ReceiptView.tsx
├── integrations/         # External integrations
│   └── supabase/        # Supabase client
└── lib/                 # Utility functions
```

## Database Setup

Run the Supabase migration located in `supabase/migrations/` to set up the database schema.

## Build for Production

```bash
npm run build
npm start
```

## License

Private - Sonehra Wellness
