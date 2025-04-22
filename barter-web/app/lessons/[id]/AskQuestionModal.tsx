'use client'

import { useState } from 'react'
import AskForm from '../../../components/AskForm'

export default function AskQuestionModal({
  lessonId,
  instructorEmail,
}: {
  lessonId: number
  instructorEmail: string
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="border border-[#00262b] text-[#00262b] px-6 py-2 rounded-md hover:bg-gray-100 transition"
      >
        Ask a question
      </button>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/10" onClick={() => setIsOpen(false)}>
          {/* Modal */}
          <div
            className="fixed bottom-4 right-4 z-50 w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="text-sm font-semibold text-gray-800">Send a question</div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-black text-xl"
              >
                &times;
              </button>
            </div>

            {/* Form */}
            <div className="p-4">
              <AskForm
                lessonId={lessonId}
                instructorEmail={instructorEmail}
                onSent={() => setIsOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
