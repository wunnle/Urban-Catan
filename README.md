# Urban Roastery - Catan Tournament Signup

A simple tournament registration page for the Catan Tournament at Urban Roastery, Moda Istanbul.

## Features

- Clean signup form with name and phone number
- Duplicate registration prevention (checks by phone number)
- Data stored in Google Sheets
- Mobile-friendly design

## Setup

### 1. Google Cloud Setup

1. Create a Google Cloud project at [console.cloud.google.com](https://console.cloud.google.com)
2. Enable the Google Sheets API
3. Create a service account and download the JSON credentials
4. Create a Google Sheet with columns: `Name | Phone | Registered At`
5. Share the sheet with your service account email (Editor access)

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

Required variables:
- `GOOGLE_SERVICE_ACCOUNT_EMAIL` - Service account email from JSON
- `GOOGLE_PRIVATE_KEY` - Private key from JSON (keep the quotes and \n)
- `GOOGLE_SHEET_ID` - The ID from your Google Sheet URL

### 3. Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Google Sheets API
