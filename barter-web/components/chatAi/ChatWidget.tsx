"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import ChatAiWithEyes from "./ChatAiWithEyes";
import { useUser } from "@/contexts/UserContext";

type Message = {
  role: "user" | "bot" | "bot-temp";
  text: string;
};

export default function ChatWidget() {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const chatRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (!user?.id) {
      alert("Musisz być zalogowany, aby korzystać z czatu.");
      return;
    }

    const userMessage: Message = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const eventSource = new EventSource(
      `http://localhost:4000/chat/stream?userId=${user.id}&prompt=${encodeURIComponent(
        input
      )}`
    );

    let botText = "";

    eventSource.onmessage = (e) => {
      botText += e.data;
      setMessages((prev) => {
        const others = prev.filter((m) => m.role !== "bot-temp");
        return [...others, { role: "bot-temp", text: botText }];
      });

      setTimeout(() => {
        chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
      }, 10);
    };

    eventSource.onerror = () => {
      eventSource.close();
      setMessages((prev) => {
        const temp = prev.find((m) => m.role === "bot-temp");
        const others = prev.filter((m) => m.role !== "bot-temp");
        return [
          ...others,
          { role: "bot", text: temp?.text || "[Błąd odpowiedzi]" },
        ];
      });
    };
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center hover:scale-105 transition"
          aria-label="Open chat"
        >
          <ChatAiWithEyes />
        </button>
      )}

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
                  msg.role === "user"
                    ? "bg-[#00262b] text-white ml-auto"
                    : "bg-gray-100 text-gray-900"
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
              placeholder="Napisz wiadomość..."
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
