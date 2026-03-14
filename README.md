# Learnly - Your AI-Powered Interactive Library

**Learnly** is a state-of-the-art SaaS platform designed to transform static books into interactive, AI-driven learning experiences. By leveraging advanced voice AI and intelligent content processing, Learnly allows users to engage with their reading material in a completely new way.

## 🚀 Core Features

- **AI-Powered Voice Sessions**: Engage in real-time, interactive voice conversations about your books using [Vapi](https://vapi.ai/).
- **Intelligent Library Management**: Seamlessly upload and manage your PDF library with [Vercel Blob](https://vercel.com/blob).
- **Smart Content Segmentation**: Automatic processing of large documents into searchable, context-aware segments.
- **Contextual Search**: High-performance text search across your library to find specific information instantly.
- **Secure Authentication**: Robust user management and personalization powered by [Clerk](https://clerk.com/).
- **Premium Design**: A beautiful, responsive interface built with Tailwind CSS and Radix UI primitives.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Voice AI**: [Vapi](https://vapi.ai/)
- **Storage**: [Vercel Blob](https://vercel.com/blob)
- **Validation**: [Zod](https://zod.dev/) & [React Hook Form](https://react-hook-form.com/)

## 🏁 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance
- Clerk account
- Vapi account
- Vercel Blob configuration

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd learnly
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory and add your credentials:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
   CLERK_SECRET_KEY=...
   MONGODB_URI=...
   BLOB_READ_WRITE_TOKEN=...
   VAPI_API_KEY=...
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

- `app/`: Next.js App Router pages and API routes.
- `components/`: Reusable UI components and layout elements.
- `database/`: Mongoose models and database connection logic.
- `lib/`: Utility functions, server actions, and shared logic.
- `public/`: Static assets.
- `types.ts`: Shared TypeScript interfaces and types.

## 🌐 Deployment

The easiest way to deploy Learnly is via the [Vercel Platform](https://vercel.com/new). Make sure to configure all environment variables in your Vercel project settings.
