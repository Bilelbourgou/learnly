import React from 'react'
import LibraryHero from '@/components/LibraryHero'
import { getAllBooks } from '@/lib/actions/book.actions'
import BookCard from '@/components/BookCard'

const page = async () => {
  const result = await getAllBooks();
  const books = (result?.success && Array.isArray(result.data)) ? result.data : [];

  return (
    <main className='wrapper container'>
      <LibraryHero />

      <div className='library-books-grid'>
        {
          books.length > 0 ? (
            books.map((book: any) => (
             <BookCard key={book._id} title={book.title} author={book.author} coverURL={book.coverURL} slug={book.slug} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center col-span-full">
              <p className="text-xl font-semibold text-[var(--text-secondary)]">No books found in the library.</p>
              <p className="text-[var(--text-muted)]">Upload your first book to get started!</p>
            </div>
          )
        }
      </div>
    </main>
  )
}

export default page