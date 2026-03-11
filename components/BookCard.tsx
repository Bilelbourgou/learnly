import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BookCardProps } from '@/types';


const BookCard = ({ title, author, coverURL, slug }: BookCardProps) => {
  const proxiedCoverURL = coverURL.includes('blob.vercel-storage.com') 
    ? `/api/proxy-image?url=${encodeURIComponent(coverURL)}` 
    : coverURL;

  return (
    <Link href={`/books/${slug}`} className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue rounded-2xl transition-all duration-300">
        <article className="flex flex-col gap-3">
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl bg-bg-secondary shadow-soft group-hover:shadow-soft-md transition-all duration-300 group-hover:-translate-y-1">
                <Image 
                    className='object-cover w-full h-full' 
                    src={proxiedCoverURL} 
                    alt={title} 
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                />
            </div>
            <div className="flex flex-col gap-0.5">
                <h3 className="text-base font-bold text-text-primary line-clamp-1 tracking-tight group-hover:text-accent-blue transition-colors">{title}</h3>
                <p className="text-sm font-medium text-text-secondary line-clamp-1">{author}</p>
            </div>
        </article>
    </Link>
  );
};

export default BookCard;