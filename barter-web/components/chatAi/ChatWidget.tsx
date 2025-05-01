'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import ChatAiWithEyes from './ChatAiWithEyes';
import { useUser } from '@/contexts/UserContext';
import { motion, AnimatePresence } from 'framer-motion';

type Message = {
  role: 'user' | 'bot' | 'bot-temp';
  text: string;
};

export default function ChatWidget() {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [showBubble, setShowBubble] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  // Pokaż chmurkę po starcie
  useEffect(() => {
    const timer = setTimeout(() => setShowBubble(true), 1000);
    const hide = setTimeout(() => setShowBubble(false), 6000);
    return () => {
      clearTimeout(timer);
      clearTimeout(hide);
    };
  }, []);

  // Otwórz czat z automatyczną wiadomością
  const handleOpen = () => {
    setIsOpen(true);
    setMessages((prev) => {
      const alreadyGreeted = prev.some(
        (m) =>
          m.role === 'bot' &&
          m.text.includes("I'm here to help")
      );
      if (alreadyGreeted) return prev;
      return [
        ...prev,
        {
          role: 'bot',
          text:
            "Hi there! 👋 I'm here to help. Ask me anything about lessons, barters or quizzes!",
        },
      ];
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (!user?.id) {
      alert('Musisz być zalogowany, aby korzystać z czatu.');
      return;
    }

    const userMessage: Message = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_API_URL}/chat/stream?userId=${user.id}&prompt=${encodeURIComponent(
        input
      )}`
    );

    let botText = '';

    eventSource.onmessage = (e) => {
      botText += e.data;
      setMessages((prev) => {
        const others = prev.filter((m) => m.role !== 'bot-temp');
        return [...others, { role: 'bot-temp', text: botText }];
      });

      setTimeout(() => {
        chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
      }, 10);
    };

    eventSource.onerror = () => {
      eventSource.close();
      setMessages((prev) => {
        const temp = prev.find((m) => m.role === 'bot-temp');
        const others = prev.filter((m) => m.role !== 'bot-temp');
        return [
          ...others,
          { role: 'bot', text: temp?.text || '[Błąd odpowiedzi]' },
        ];
      });
    };
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      {/* Ikona czatu + dymek */}
      {!isOpen && (
        <div className="relative">
          <button
            onClick={handleOpen}
            className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center hover:scale-105 transition"
            aria-label="Open chat"
          >
            <ChatAiWithEyes />
          </button>

          <AnimatePresence>
            {showBubble && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
                className="absolute right-16 bottom-1 sm:bottom-2 bg-white border border-gray-300 text-sm text-[#00262b] shadow-md rounded-lg px-4 py-2 w-56 z-40"
              >
                💬 Need help? I can:
                <ul className="list-disc pl-5 mt-1 text-xs leading-tight">
                  <li>Find lessons</li>
                  <li>Start a barter</li>
                  <li>Suggest quizzes</li>
                  <li>Contact instructors</li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Okno czatu */}
      {isOpen && (
        <div className="w-[95vw] max-w-[360px] h-[85vh] max-h-[600px] bg-white rounded-xl shadow-xl flex flex-col overflow-hidden">
          {/* Pasek górny */}
          <div className="bg-[#00262b] text-white p-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ChatAiWithEyes />
              <Image
                src="/icons/logo_l.svg"
                alt="Barter Logo"
                width={60}
                height={60}
              />
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white text-2xl leading-none"
            >
              ×
            </button>
          </div>

          {/* Wiadomości */}
          <div
            ref={chatRef}
            className="p-4 flex-1 overflow-y-auto text-sm text-gray-700 border-b space-y-2"
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg max-w-[80%] whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-[#00262b] text-white ml-auto'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="p-3 border-t flex items-center"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border border-[#00262b] text-[#00262b] rounded px-3 py-2 text-sm focus:outline-none"
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



