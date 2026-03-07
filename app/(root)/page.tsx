import React from 'react'
import LibraryHero from '@/components/LibraryHero'
import { sampleBooks } from '@/lib/constants'
import Image from 'next/image'
import BookCard from '@/components/BookCard'

const page = () => {
  return (
    <main className='wrapper container'>
      <LibraryHero />

      <div className='library-books-grid'>
        {
          sampleBooks.map((book) => (
           <BookCard key={book._id} title={book.title} author={book.author} coverURL={book.coverURL} slug={book.slug} />
          ))
        }
      </div>
    </main>
  )
} 

export default page