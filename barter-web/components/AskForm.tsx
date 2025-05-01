'use client'

import { useState } from 'react'

export default function AskForm({
  lessonId,
  instructorEmail,
  onSent,
}: {
  lessonId: number
  instructorEmail: string
  onSent: () => void
}) {
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const send = async () => {
    setStatus('sending')
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: instructorEmail, message, lessonId }),
    })

    if (res.ok) {
      setStatus('sent')
      onSent()
    } else {
      setStatus('error')
    }
  }

  return (
    <div className="space-y-3">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write your question..."
        rows={4}
        className="w-full border border-gray-300 p-2 rounded text-sm"
      />
      <button
        onClick={send}
        disabled={status === 'sending'}
        className="bg-[#00262b] text-white px-4 py-2 rounded hover:bg-[#00323c]"
      >
        {status === 'sending' ? 'Sending...' : 'Send'}
      </button>
      {status === 'error' && <p className="text-red-500 text-sm">Something went wrong.</p>}
    </div>
  )
}

