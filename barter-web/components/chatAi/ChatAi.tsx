import React from 'react'
import Image from 'next/image'

const ChatAi = () => {
  return (
    <div>
        <Image
        src="/icons/chat-ai.svg"
        alt="Chat AI"
        width={40}
        height={40}
        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
        />
        <div className="flex-1 max-w-xl mx-6 relative">
        <input
            type="text"
            placeholder="Chat with AI"
            className="w-full pr-10 pl-4 py-2 border border-[#00262b] text-[#00262b] rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        </div>
    </div>
  )
}

export default ChatAi