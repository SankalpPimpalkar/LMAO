# LMAO - The Ultimate Meme Battleground 🎭

LMAO is a real-time, community-driven platform where users compete to generate the funniest captions for viral meme templates.

## 🚀 Key Features

- **🔥 Real-time Caption Battles**: Participate in live meme contests with dynamic countdown timers.
- **🗳️ Atomic Voting System**: Upvote captions with real-time feedback, ensuring data consistency via Firestore Transactions.
- **👤 Unique Username System**:
    - Automated unique handle generation on first sign-in.
    - Real-time "Username Taken" validation in settings.
    - Direct `u/[username]` routing for profile discovery.
- **📊 Rich Profiles & History**: Track your Wins, Points, and view a history of all your submitted battles.
- **✨ Premium UI/UX**:
    - Sleek dark-mode aesthetic with glassmorphism.
    - Responsive mobile-first design.
    - Sticky navigation and settings sidebar.
    - Intelligent Avatar fallbacks and placeholder profiles.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
- **Database**: [Firebase Cloud Firestore](https://firebase.google.com/products/firestore)
- **Authentication**: [Firebase Auth](https://firebase.google.com/products/auth) (Google Sign-In)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Types**: [TypeScript](https://www.typescriptlang.org/)

## 🚦 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Firebase Configuration
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Run Development Server
```bash
npm run dev
```

## 📂 Project Structure

- `src/app`: Next.js 14 App Router routes and layouts.
- `src/services/firebase`: Centralized logic for Firestore and Auth operations.
- `src/components/ui`: Reusable, low-level UI components (Buttons, Inputs, etc.).
- `src/contexts`: Global state management for Authentication.
- `src/types`: Structured TypeScript interfaces for Battles, Captions, and Users.

---
Built with ❤️ for meme lovers everywhere.
