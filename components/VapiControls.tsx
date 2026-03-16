"use client";
import { Mic,MicOff } from "lucide-react";
import { IBook } from "@/types";
import useVapi from "@/hooks/useVapi";
import Image from "next/image";
import Transcript from "./Transcript";
import { Loader2, Headphones, MessageSquareQuote } from "lucide-react";

/**
 * Formats seconds into M:SS format
 */
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};


const VapiControls = ({ book }: { book: IBook }) => {
  const {
    status,
    isActive,
    messages,
    currentMessage,
    currentUserMessage,
    duration,
    start,
    stop,
    clearError,
    maxDurationSeconds,
    limitError,
  } = useVapi(book);


  const proxiedCoverURL =
    book.coverURL && book.coverURL.includes("blob.vercel-storage.com")
      ? `/api/proxy-image?url=${encodeURIComponent(book.coverURL)}`
      : book.coverURL;

  return (
    <div className="flex flex-col gap-8">
      {/* Header Section */}
      <section className="bg-white rounded-[2.5rem] p-8 shadow-soft border border-border-subtle overflow-hidden">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
          {/* Left: Book Cover & Mic Button */}
          <div className="relative group">
            <div className="relative w-40 h-60 rounded-2xl overflow-hidden shadow-soft-md group-hover:shadow-soft-lg transition-all duration-300">
              {proxiedCoverURL ? (
                <Image
                  src={proxiedCoverURL}
                  alt={book.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-bg-secondary flex items-center justify-center">
                  <span className="text-text-muted text-xs">No Cover</span>
                </div>
              )}
            </div>
            <div className="absolute -bottom-4 -right-4">
              <button 
                onClick={isActive ? stop : start} 
                disabled={status == 'connecting'} 
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-soft-lg transition-all duration-500 ease-in-out transform hover:scale-110 active:scale-90 relative overflow-hidden
                  ${isActive 
                    ? 'bg-accent-blue text-white ring-4 ring-accent-blue/20 animate-pulse' 
                    : 'bg-text-primary text-white hover:bg-text-primary/90'
                  }`}
              >
                {/* Ripple Effect for Active State */}
                {isActive && (
                  <span className="absolute inset-0 rounded-full animate-ping bg-accent-blue/30 opacity-75"></span>
                )}
                
                <div className="relative z-10 transition-all duration-300 transform">
                  {isActive ? (
                    <Mic className="w-6 h-6 animate-in zoom-in-50 duration-300" />
                  ) : (
                    <MicOff className="w-6 h-6 animate-in fade-in duration-300" />
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Right: Book Details */}
          <div className="flex-1 flex flex-col justify-center py-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight mb-2">
              {book.title}
            </h1>
            <p className="text-xl font-medium text-text-secondary mb-6">
              by {book.author}
            </p>

            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              {status === 'idle' && (
                <div className="flex items-center gap-2 px-4 py-1.5 bg-accent-blue/5 border border-accent-blue/20 rounded-full text-sm font-bold text-accent-blue tracking-tight">
                  <span className="w-2 h-2 rounded-full bg-accent-blue animate-pulse"></span>
                  Ready
                </div>
              )}

              {status === 'connecting' && (
                <div className="flex items-center gap-2 px-4 py-1.5 bg-accent-blue/5 border border-accent-blue/10 rounded-full text-sm font-bold text-accent-blue tracking-tight">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Connecting...
                </div>
              )}

              {status === 'starting' && (
                <div className="flex items-center gap-2 px-4 py-1.5 bg-accent-blue/5 border border-accent-blue/10 rounded-full text-sm font-bold text-accent-blue tracking-tight">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Starting...
                </div>
              )}

              {status === 'speaking' && (
                <div className="flex items-center gap-2 px-4 py-1.5 bg-accent-blue/5 border border-accent-blue/20 rounded-full text-sm font-bold text-accent-blue tracking-tight">
                   <Headphones className="w-3 h-3 animate-pulse" />
                  AI is speaking...
                </div>
              )}

              {status === 'listening' && (
                <div className="flex items-center gap-2 px-4 py-1.5 bg-bg-secondary border border-accent-blue/20 rounded-full text-sm font-bold text-accent-blue tracking-tight">
                   <Mic className="w-3 h-3 animate-pulse text-accent-blue" />
                   Listening...
                </div>
              )}

              {status === 'thinking' && (
                <div className="flex items-center gap-2 px-4 py-1.5 bg-accent-blue/5 border border-accent-blue/10 rounded-full text-sm font-bold text-accent-blue tracking-tight">
                   <MessageSquareQuote className="w-3 h-3 animate-bounce" />
                   AI is thinking...
                </div>
              )}


              {book.persona && (
                <div className="flex items-center gap-2 px-4 py-1.5 bg-bg-secondary border border-border-subtle rounded-full text-sm font-bold text-text-primary tracking-tight">
                  Voice: {book.persona}
                </div>
              )}

              <div className={`flex items-center gap-2 px-4 py-1.5 bg-bg-secondary border border-border-subtle rounded-full text-sm font-bold tracking-tight transition-colors ${isActive && duration > maxDurationSeconds - 60 ? 'text-red-500 border-red-200 bg-red-50' : 'text-text-secondary'}`}>
                {formatTime(duration)}/{formatTime(maxDurationSeconds)}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Transcript Area */}
      {isActive || messages.length > 0 ? (
        <div className="vapi-transcript-wrapper">
          <Transcript
            messages={messages}
            currentMessage={currentMessage}
            currentUserMessage={currentUserMessage}
            bookTitle={book.title}
          />
          {limitError && (
             <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                {limitError}
             </div>
          )}

        </div>
      ) : !isActive && !messages.length && (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-[2.5rem] shadow-soft border border-border-subtle text-center">
             <div className="w-16 h-16 rounded-full bg-bg-secondary flex items-center justify-center mb-4">
                <Mic className="w-8 h-8 text-text-muted" />
             </div>
             <h3 className="text-xl font-bold text-text-primary mb-2">Ready to Chat?</h3>
             <p className="text-text-secondary max-w-sm">
                Click the microphone button to start a voice conversation with this book's AI assistant.
             </p>
          </div>
      )}
    </div>
  );
};

export default VapiControls;
