# Sonehra Wellness - Fee Management Portal

A professional school fee management system built with Next.js, Supabase, and TypeScript.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Supabase account
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/aakash2518/portal.git
cd portal
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create `.env.local` file with:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **IMPORTANT: Run SQL in Supabase Dashboard**

⚠️ **This step is required for delete functionality to work!**

Go to Supabase Dashboard → SQL Editor and copy-paste the entire content from `RUN_THIS_SQL.sql` file.

This will:
- Add `deleted_at` column for soft delete
- Add `year` column
- Create proper RLS policies for UPDATE and DELETE operations

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## ✨ Features

- ✅ Create fee receipts with automatic GST calculation (9% CGST + 9% SGST)
- ✅ Professional PDF generation with 1cm margins (print-safe)
- ✅ Dashboard with advanced filters (Period, Year, Month)
- ✅ Soft delete (Move to Bin) functionality
- ✅ Restore from Bin
- ✅ Permanent delete option
- ✅ Fully responsive design (Mobile, Tablet, Desktop)
- ✅ Real-time statistics and analytics
- ✅ QR code on receipts for verification
- ✅ Smooth animations and transitions

## 📊 Dashboard Features

### Filters
- **Period Filters**: All Time, Today, This Week, This Month, This Year
- **Year Filter**: 2024-25, 2025-26, 2026-27, 2027-28, 2028-29
- **Month Filter**: All months + custom durations (1 Month, 3 Months, Other)

### Statistics Cards
- Total Receipts count
- Total Revenue
- GST Collected
- Total Paid Amount

### Tabs
- **Active Tab**: View all active receipts
- **Bin Tab**: View deleted receipts

## 🗑️ Delete Functionality

1. Click trash icon (🗑️) to move receipt to Bin (soft delete)
2. Go to "Bin" tab to view deleted receipts
3. Click restore icon (↻) to bring back from Bin
4. Click trash icon in Bin to permanently delete

## 🖨️ PDF Features

- A4 landscape format (297mm x 210mm)
- 1cm margins on all sides (print-safe area)
- Both receipts (Office Copy & Student Copy) side-by-side
- High quality output (scale: 2)
- QR code for verification
- Professional layout

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI)
- **PDF Generation**: jsPDF + html2canvas-pro
- **Icons**: Lucide React
- **Language**: TypeScript

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Receipt creation page
│   ├── dashboard/
│   │   └── page.tsx          # Dashboard with stats
│   ├── receipt/[id]/
│   │   └── page.tsx          # Receipt view page
│   └── layout.tsx            # Root layout
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── DashboardStats.tsx    # Dashboard component
│   ├── FeeForm.tsx           # Receipt form
│   ├── ReceiptView.tsx       # Receipt display
│   ├── Navigation.tsx        # Header navigation
│   └── Footer.tsx            # Footer component
├── integrations/
│   └── supabase/
│       ├── client.ts         # Supabase client
│       └── types.ts          # Database types
└── lib/
    ├── utils.ts              # Utility functions
    └── number-to-words.ts    # Number to words converter

supabase/
└── migrations/               # Database migrations
```

## 🔧 Configuration Files

- `RUN_THIS_SQL.sql` - **Run this first in Supabase!**
- `DATABASE_SETUP_INSTRUCTIONS.md` - Detailed setup guide
- `next.config.js` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration

## 📝 Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Deploy to Vercel
```bash
vercel
```

Make sure to add environment variables in Vercel dashboard.

## 🐛 Troubleshooting

### Delete not working?
Run the SQL from `RUN_THIS_SQL.sql` in Supabase Dashboard.

### Receipts not showing?
Check Supabase connection and environment variables.

### PDF not generating?
Check browser console for errors. Make sure images are loading.

## 📄 License

Private - Sonehra Wellness

## 📍 Location

Sonehra Wellness  
Plot No. 14, Sector 15  
Faridabad, Haryana  
Phone: 9220809902  
GST: 06APXPK5623B3ZS

## 👨‍💻 Developer

Developed for Sonehra Wellness School Portal
