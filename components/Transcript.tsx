"use client";

import React, { useEffect, useRef } from "react";
import { Mic } from "lucide-react";
import { Messages } from "@/types";

interface TranscriptProps {
  messages: Messages[];
  currentMessage?: string;
  currentUserMessage?: string;
  bookTitle?: string;
}

const Transcript = ({
  messages,
  currentMessage,
  currentUserMessage,
  bookTitle,
}: TranscriptProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, currentMessage, currentUserMessage]);

  const isEmpty =
    messages.length === 0 && !currentMessage && !currentUserMessage;

  if (isEmpty) {
    return (
      <div className="transcript-container">
        <div className="transcript-empty">
          <div className="size-16 rounded-full bg-bg-secondary flex items-center justify-center mx-auto mb-6">
            <Mic className="w-8 h-8 text-text-muted" />
          </div>
          <h3 className="transcript-empty-text">No conversation yet</h3>
          <p className="transcript-empty-hint">
            Click the mic button to start your interactive learning journey with{" "}
            {bookTitle || "this book"}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="transcript-container">
      <div className="transcript-messages" ref={scrollRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`transcript-message ${
              msg.role === "user"
                ? "transcript-message-user"
                : "transcript-message-assistant"
            }`}
          >
            <div
              className={`transcript-bubble ${
                msg.role === "user"
                  ? "transcript-bubble-user"
                  : "transcript-bubble-assistant"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* Streaming User Message */}
        {currentUserMessage && (
          <div className="transcript-message transcript-message-user">
            <div className="transcript-bubble transcript-bubble-user">
              {currentUserMessage}
              <span className="transcript-cursor" />
            </div>
          </div>
        )}

        {/* Streaming Assistant Message */}
        {currentMessage && (
          <div className="transcript-message transcript-message-assistant">
            <div className="transcript-bubble transcript-bubble-assistant">
              {currentMessage}
              <span className="transcript-cursor" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transcript;
