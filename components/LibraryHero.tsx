'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const LibraryHero = () => {
  return (
    <div className="library-hero-card mb-10 md:mb-16">
      <div className="library-hero-content">
        {/* Left Section */}
        <div className="library-hero-text">
          <h1 className="library-hero-title">Your Library</h1>
          <p className="library-hero-description">
            Convert your books into interactive AI conversations.
            Listen, learn, and discuss your favorite reads.
          </p>
          <Link href="/docs/new" className="library-cta-primary">
            + Add new book
          </Link>
        </div>

        {/* Center Section - Illustration */}
        <div className="library-hero-illustration-desktop">
          <Image 
            src="/hero-illustration.png" 
            alt="Library Illustration" 
            width={400} 
            height={300}
            className="object-contain"
            priority
          />
        </div>
        
        {/* Mobile Illustration (visible only on mobile via existing CSS) */}
        <div className="library-hero-illustration">
          <Image 
            src="/hero-illustration.png" 
            alt="Library Illustration" 
            width={280} 
            height={210}
            className="object-contain"
          />
        </div>

        {/* Right Section - Steps */}
        <div className="hidden xl:block min-w-[280px]">
          <div className="library-steps-card space-y-4">
            <div className="library-step-item">
              <span className="library-step-number">1</span>
              <div>
                <h3 className="library-step-title">Upload PDF</h3>
                <p className="library-step-description">Add your book file</p>
              </div>
            </div>
            <div className="library-step-item">
              <span className="library-step-number">2</span>
              <div>
                <h3 className="library-step-title">AI Processing</h3>
                <p className="library-step-description">We analyze the content</p>
              </div>
            </div>
            <div className="library-step-item">
              <span className="library-step-number">3</span>
              <div>
                <h3 className="library-step-title">Voice Chat</h3>
                <p className="library-step-description">Discuss with AI</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LibraryHero
