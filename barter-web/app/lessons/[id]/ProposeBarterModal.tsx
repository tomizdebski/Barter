'use client';

import { useState, useEffect } from "react";

interface ProposeBarterModalProps {
  lessonId: number;
}

interface Lesson {
  id: number;
  name: string;
}

export default function ProposeBarterModal({ lessonId }: ProposeBarterModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [offeredLessonId, setOfferedLessonId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await fetch("http://localhost:4000/lessons/my", { credentials: "include" });
        const data = await res.json();
        setLessons(data);
      } catch (err) {
        console.error("Failed to fetch your lessons", err);
      }
    };

    fetchLessons();
  }, []);

  const handleSubmit = async () => {
    if (!offeredLessonId) return;
  
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/barters/propose-lessons", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId,
          offeredLessonId,
          message,
        }),
      });
  
      if (!res.ok) throw new Error("Failed to propose barter");
  
      setSnackbarMessage("Barter proposed successfully!");
      setIsOpen(false);
    } catch (err) {
      console.error(err);
      setSnackbarMessage("Failed to propose barter.");
    } finally {
      setLoading(false);
    }
  };

  // Automatyczne ukrywanie snackbar po 3 sekundach
  useEffect(() => {
    if (snackbarMessage) {
      const timer = setTimeout(() => setSnackbarMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [snackbarMessage]);

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-[#00262b] text-white px-6 py-2 rounded-md hover:bg-[#00404d] transition"
      >
        Propose barter
      </button>

      {/* Overlay and Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/10" onClick={() => setIsOpen(false)}>
          <div
            className="fixed bottom-4 right-4 z-50 w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="text-sm font-semibold text-gray-800">Propose a barter</div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-black text-xl"
              >
                &times;
              </button>
            </div>

            {/* Modal content */}
            <div className="p-4 space-y-4">
              {/* Choose lesson */}
              <div>
                <label className="text-sm font-semibold text-gray-700">Your Lesson</label>
                <select
                  className="w-full mt-1 p-2 border rounded-md"
                  value={offeredLessonId ?? ""}
                  onChange={(e) => setOfferedLessonId(Number(e.target.value))}
                >
                  <option value="" disabled>Select a lesson...</option>
                  {lessons.map((lesson) => (
                    <option key={lesson.id} value={lesson.id}>
                      {lesson.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Optional message */}
              <div>
                <label className="text-sm font-semibold text-gray-700">Message (optional)</label>
                <textarea
                  className="w-full mt-1 p-2 border rounded-md"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write a short message..."
                />
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={loading || !offeredLessonId}
                className="w-full bg-[#00262b] text-white py-2 rounded-md hover:bg-[#00404d] transition"
              >
                {loading ? "Submitting..." : "Propose Barter"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Snackbar */}
      {snackbarMessage && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-md shadow-lg z-50 transition">
          {snackbarMessage}
        </div>
      )}
    </>
  );
}
