'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProposeBarterModal from "./ProposeBarterModal";
import AskQuestionModal from "./AskQuestionModal";

export default function LessonActions({ lesson }: { lesson: any }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!user) return null;

  const isOwner = user.id === lesson.instructor.id;

  const handleEdit = () => {
    router.push(`/lessons/edit/${lesson.id}`);
  };

  const handleDeleteConfirmed = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lessons/${lesson.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setSnackbarMessage("Lesson deleted successfully!");
        setTimeout(() => {
            router.push("/dashboard");
        }, 1500);
      } else {
        console.error("Failed to delete lesson");
        setSnackbarMessage("Failed to delete lesson.");
      }
    } catch (error) {
      console.error("Error deleting lesson:", error);
      setSnackbarMessage("An error occurred.");
    }
    setShowConfirmModal(false);
  };

  return (
    <div className="relative bg-white p-6 rounded-md shadow-sm flex flex-col gap-3">
      {isOwner ? (
        <>
          <button
            onClick={handleEdit}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Edit Lesson
          </button>
          <button
            onClick={() => setShowConfirmModal(true)}
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
          >
            Delete Lesson
          </button>

          {/* Modal do potwierdzenia */}
          {showConfirmModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center gap-4 max-w-sm">
                <h2 className="text-xl font-semibold">Confirm Deletion</h2>
                <p className="text-gray-600 text-center">
                  Are you sure you want to delete this lesson?
                </p>
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={handleDeleteConfirmed}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Yes, delete
                  </button>
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <ProposeBarterModal lessonId={lesson.id} />
          <AskQuestionModal
            lessonId={lesson.id}
            instructorEmail={lesson.instructor.email}
          />
        </>
      )}

      {/* Snackbar/toast */}
      {snackbarMessage && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-md shadow-md z-50">
          {snackbarMessage}
        </div>
      )}
    </div>
  );
}
