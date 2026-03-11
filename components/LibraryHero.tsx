'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const LibraryHero = () => {
  return (
    <section className="library-hero-card">
      <div className="library-hero-content">
        <div className="library-hero-text">
          <h1 className="library-hero-title">Your Library</h1>
          <p className="library-hero-description">
            Experience your books in a whole new way. High-fidelity AI narration and interactive conversations, all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-2 w-full lg:w-fit">
            <Link href="/books/new" className="library-cta-primary">
              <span className="text-xl mr-1">+</span> Add Book
            </Link>
            <Link href="/subscriptions" className="library-cta-secondary">
              Upgrade Plan
            </Link>
          </div>
        </div>

        <div className="library-hero-illustration-desktop">
          <Image 
            src="/hero-illustration.png" 
            alt="Library Illustration" 
            width={400} 
            height={300}
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>
        
        <div className="library-hero-illustration">
          <Image 
            src="/hero-illustration.png" 
            alt="Library Illustration" 
            width={280} 
            height={210}
            className="object-contain drop-shadow-xl"
          />
        </div>

        {/* Apple-style feature badges instead of steps */}
        <div className="hidden xl:flex flex-col gap-4 min-w-[240px]">
          <div className="bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-white/20 shadow-sm flex items-center gap-3">
             <div className="size-8 rounded-full bg-accent-blue/10 flex items-center justify-center text-accent-blue font-bold">1</div>
             <div>
                <p className="text-sm font-bold text-text-primary">Upload PDF</p>
                <p className="text-xs text-text-secondary">Instant processing</p>
             </div>
          </div>
          <div className="bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-white/20 shadow-sm flex items-center gap-3">
             <div className="size-8 rounded-full bg-accent-blue/10 flex items-center justify-center text-accent-blue font-bold">2</div>
             <div>
                <p className="text-sm font-bold text-text-primary">AI Analysis</p>
                <p className="text-xs text-text-secondary">Deep understanding</p>
             </div>
          </div>
          <div className="bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-white/20 shadow-sm flex items-center gap-3">
             <div className="size-8 rounded-full bg-accent-blue/10 flex items-center justify-center text-accent-blue font-bold">3</div>
             <div>
                <p className="text-sm font-bold text-text-primary">Voice Interaction</p>
                <p className="text-xs text-text-secondary">Natural dialogue</p>
             </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LibraryHero
