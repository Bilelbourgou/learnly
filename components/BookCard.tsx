import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BookCardProps } from '@/types';


const BookCard = ({ title, author, coverURL, slug }: BookCardProps) => {
  const proxiedCoverURL = coverURL.includes('blob.vercel-storage.com') 
    ? `/api/proxy-image?url=${encodeURIComponent(coverURL)}` 
    : coverURL;

  return (
    <Link href={`/books/${slug}`} className="book-card group">
        <article className="book-card">
            <figure className="book-card-figure">
                <div className="book-card-cover-wrapper">
                    <Image className='book-card-cover' src={proxiedCoverURL} alt={title} width={133} height={200} />
                </div>
                <figcaption className="book-card-meta">
                    <h3 className="book-card-title">{title}</h3>
                    <p className="book-card-author">{author}</p>
                </figcaption>
            </figure>

        </article>
    </Link>
  );
};

export default BookCard;