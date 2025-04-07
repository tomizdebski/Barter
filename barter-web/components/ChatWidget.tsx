"use client";

import { useState } from "react";
import Image from "next/image";
import ChatAiWithEyes from "./ChatAiWithEyes"; // Twój czatbot z oczami

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Ikona czatu */}
      {!isOpen && (
        <button
        onClick={() => setIsOpen(true)}
        className="w-16 h-16   flex items-center justify-center hover:scale-105 transition"
        aria-label="Open chat"
      >
        <ChatAiWithEyes />
      </button>
      
      )}

      {/* Panel czatu */}
      {isOpen && (
        <div className="w-[320px] h-[500px] bg-white rounded-xl shadow-xl flex flex-col overflow-hidden">
          {/* Główny pasek (top) */}
          <div className="bg-[#00262b] text-white p-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ChatAiWithEyes />
              <Image src="/icons/logo_l.svg" alt="Barter Logo" width={80} height={80} />
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white text-lg">
              ×
            </button>
          </div>

          {/* Treść / wiadomość powitalna */}
          <div className="p-4 flex-1 overflow-y-auto text-sm text-gray-700 border-b">
            <p>
              Before we get started; just a reminder that this chat is AI generated,
              mistakes are possible. By using it you agree that Barter may create a record of this chat.
              Your personal data will be used as described in our{" "}
              <a href="#" className="underline">
                privacy policy
              </a>.
            </p>
          </div>

          {/* Input */}
          <form className="p-3 border-t flex items-center">
            <input
              type="text"
              placeholder="Write a message"
              className="flex-1 border border-[#00262b] text-[#00262b] rounded px-4 py-2 text-sm focus:outline-none"
            />
            <button type="submit" className="ml-2 text-[#00262b]">
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
