import React from 'react'
import LibraryHero from '@/components/LibraryHero'
import { getAllBooks } from '@/lib/actions/book.actions'
import BookCard from '@/components/BookCard'
import { auth } from "@clerk/nextjs/server";
import { SignInButton } from "@clerk/nextjs";
import SearchBar from '@/components/SearchBar';

const page = async ({ searchParams }: { searchParams: Promise<{ query?: string }> }) => {
  const { userId } = await auth();
  const { query } = await searchParams;
  
  let books: any[] = [];
  if (userId) {
    const result = await getAllBooks(userId, query);
    books = (result?.success && Array.isArray(result.data)) ? result.data : [];
  }

  return (
    <main className='wrapper container'>
      <LibraryHero />

      {userId ? (
        <div className="space-y-8 mt-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-text-primary tracking-tight">
              {query ? `Search results for "${query}"` : "Recent Books"}
            </h2>
            <SearchBar defaultValue={query} />
          </div>

          <div className='library-books-grid'>
            {
              books.length > 0 ? (
                books.map((book: any) => (
                 <BookCard key={book._id} title={book.title} author={book.author} coverURL={book.coverURL} slug={book.slug} />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center col-span-full bg-white rounded-[2.5rem] shadow-soft border border-border-subtle">
                  <p className="text-xl font-semibold text-text-secondary">
                    {query ? `No books found matching "${query}"` : "No books found in your library."}
                  </p>
                  <p className="text-text-muted mt-2">
                    {query ? "Try a different search term or check for typos." : "Upload your first book to get started!"}
                  </p>
                </div>
              )
            }
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-4">Start your learning journey</h2>
          <p className="text-text-secondary mb-8 max-w-md">
            Unlock the power of AI-driven book interaction. Sign in to access your personal library and start chatting with your books.
          </p>
          <SignInButton mode="modal">
            <button className="px-8 py-3 bg-accent-blue text-white font-bold rounded-full hover:bg-accent-blue-hover transition-all shadow-md active:scale-95">
              Sign In to Get Started
            </button>
          </SignInButton>
        </div>
      )}
    </main>
  )
}

export default page