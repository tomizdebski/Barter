'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import {
  BookOpenCheck,
  Repeat,
  UserCog,
  FileText,
  ChevronDown,
  ChevronUp,
  Repeat2,
  BookOpen,
} from "lucide-react";

interface Activity {
  type: string;
  description: string;
  date: string;
}

interface Lesson {
  id: number;
  name: string;
}

interface Barter {
  offeredLesson: any;
  id: number;
  lesson: {
    id: number;
    name: string;
  };
  status: "PENDING" | "ACCEPTED" | "REJECTED";
}

export default function Dashboard() {
  const { user } = useUser();
  const router = useRouter();

  const [activities, setActivities] = useState<Activity[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [barters, setBarters] = useState<Barter[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [loadingLessons, setLoadingLessons] = useState(true);
  const [loadingBarters, setLoadingBarters] = useState(true);
  const [showLessons, setShowLessons] = useState(false);
  const [showBarters, setShowBarters] = useState(false);

  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarType, setSnackbarType] = useState<"success" | "error">("success");

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
    }
  }, [user, router]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/users/${user?.id}/activities`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error("Failed to fetch activities");
        const data = await res.json();
        setActivities(data);
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoadingActivities(false);
      }
    };

    if (user?.id) {
      fetchActivities();
    }
  }, [user?.id]);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await fetch(`http://localhost:4000/lessons/my`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch lessons");
        const data = await res.json();
        setLessons(data);
      } catch (error) {
        console.error("Error fetching lessons:", error);
      } finally {
        setLoadingLessons(false);
      }
    };

    if (user?.id) {
      fetchLessons();
    }
  }, [user?.id]);

  useEffect(() => {
    const fetchBarters = async () => {
      try {
        const res = await fetch(`http://localhost:4000/barters/sent`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch barters");
        const data = await res.json();
        setBarters(data);
      } catch (error) {
        console.error("Error fetching barters:", error);
      } finally {
        setLoadingBarters(false);
      }
    };

    if (user?.id) {
      fetchBarters();
    }
  }, [user?.id]);

  const handleAcceptBarter = async (barterId: number) => {
    try {
      const res = await fetch(`http://localhost:4000/barters/${barterId}/accept`, {
        method: "PATCH",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to accept barter");

      setBarters((prev) =>
        prev.map((barter) =>
          barter.id === barterId ? { ...barter, status: "ACCEPTED" } : barter
        )
      );

      setSnackbarMessage("Barter accepted successfully!");
      setSnackbarType("success");
    } catch (error) {
      console.error("Failed to accept barter:", error);
      setSnackbarMessage("Failed to accept barter.");
      setSnackbarType("error");
    }
  };

  const handleRejectBarter = async (barterId: number) => {
    try {
      const res = await fetch(`http://localhost:4000/barters/${barterId}/reject`, {
        method: "PATCH",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to reject barter");

      setBarters((prev) =>
        prev.map((barter) =>
          barter.id === barterId ? { ...barter, status: "REJECTED" } : barter
        )
      );

      setSnackbarMessage("Barter rejected successfully!");
      setSnackbarType("success");
    } catch (error) {
      console.error("Failed to reject barter:", error);
      setSnackbarMessage("Failed to reject barter.");
      setSnackbarType("error");
    }
  };

  useEffect(() => {
    if (snackbarMessage) {
      const timer = setTimeout(() => setSnackbarMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [snackbarMessage]);

  return (
    <section className="p-6 lg:p-10 bg-[#00262b] min-h-screen">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-gray-100 mt-2">
            Here's what's happening on your account.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardToggleCard
            title="My Lessons"
            description="View and manage your lessons"
            show={showLessons}
            onToggle={() => setShowLessons(!showLessons)}
          />
          <DashboardToggleCard
            title="My Barters"
            description="Check your barter exchanges"
            show={showBarters}
            onToggle={() => setShowBarters(!showBarters)}
          />
          <DashboardCard
            title="Add Lesson"
            description="Create a new barter lesson"
            link="/lessons/create"
          />
          <DashboardCard
            title="Settings"
            description="Manage your profile & account"
            link="/settings"
          />
        </div>

        {/* My Lessons Panel */}
        {showLessons && (
          <Panel loading={loadingLessons} empty={lessons.length === 0}>
            <ul className="space-y-2">
              {lessons.map((lesson) => (
                <li key={lesson.id}>
                  <Link
                    href={`/lessons/${lesson.id}`}
                    className="flex items-center gap-2 text-sm hover:bg-gray-100"
                  >
                    <BookOpen size={18} className="text-[#00262b]" />
                    {lesson.name}
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>
        )}

        {/* My Barters Panel */}
        {showBarters && (
          <Panel loading={loadingBarters} empty={barters.length === 0}>
            <ul className="space-y-4">
              {barters.map((barter) => (
                <li key={barter.id} className="flex items-start gap-2 text-sm">
                  <Repeat2 size={20} className="text-[#00262b]" />
                  <div>
                    <p>
                      You offered{" "}
                      <Link
                        href={`/lessons/${barter.offeredLesson.id}`}
                        className="font-semibold underline text-[#00262b] hover:text-blue-600"
                      >
                        {barter.offeredLesson.name}
                      </Link>{" "}
                      for{" "}
                      <Link
                        href={`/lessons/${barter.lesson.id}`}
                        className="font-semibold underline text-[#00262b] hover:text-blue-600"
                      >
                        {barter.lesson.name}
                      </Link>{" "}
                      <span className={getStatusColor(barter.status)}>
                        ({barter.status})
                      </span>
                    </p>

                    {barter.status === "PENDING" && (
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleAcceptBarter(barter.id)}
                          className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRejectBarter(barter.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        )}

        {/* Recent Activity */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">
            Recent Activity
          </h2>

          <Panel loading={loadingActivities} empty={activities.length === 0}>
            <ul className="space-y-4">
              {activities.map((activity, index) => (
                <li
                  key={index}
                  className="bg-white/80 shadow-sm rounded-xl p-4 flex justify-between items-center text-[#00262b]"
                >
                  <div className="flex items-center gap-2">
                    {getActivityIcon(activity.type)}
                    {activity.description}
                  </div>
                  <span className="text-gray-500 ml-2 text-sm">
                    {formatTimeAgo(new Date(activity.date))}
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>

      {/* Snackbar */}
      {snackbarMessage && (
        <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-md shadow-lg z-50 transition ${
          snackbarType === "success" ? "bg-green-600" : "bg-red-600"
        } text-white`}>
          {snackbarMessage}
        </div>
      )}
    </section>
  );
}

// Pomocnicze komponenty:

function DashboardCard({ title, description, link }: { title: string; description: string; link: string; }) {
  return (
    <Link href={link} className="block bg-white rounded-xl p-5 hover:shadow-md hover:opacity-90 transition text-[#00262b]">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-600 mt-1">{description}</p>
    </Link>
  );
}

function DashboardToggleCard({ title, description, show, onToggle }: { title: string; description: string; show: boolean; onToggle: () => void; }) {
  return (
    <div onClick={onToggle} className="bg-white rounded-xl p-5 hover:shadow-md hover:opacity-90 transition text-[#00262b] cursor-pointer">
      <div className="flex items-center justify-between w-full">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
        {show ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>
    </div>
  );
}

function Panel({ children, loading, empty }: { children: React.ReactNode; loading: boolean; empty: boolean; }) {
  return (
    <div className="mt-6 bg-white rounded-xl p-6 shadow-md text-[#00262b] transition-all">
      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : empty ? (
        <p className="text-gray-500 text-sm">Nothing found.</p>
      ) : (
        children
      )}
    </div>
  );
}

function getActivityIcon(type: string) {
  const iconProps = { size: 20, color: "#00262b" };

  switch (type) {
    case "LESSON_CREATED":
      return <BookOpenCheck {...iconProps} />;
    case "BARTER_ACCEPTED":
      return <Repeat {...iconProps} />;
    case "PROFILE_UPDATED":
      return <UserCog {...iconProps} />;
    default:
      return <FileText {...iconProps} />;
  }
}

function getStatusColor(status: "PENDING" | "ACCEPTED" | "REJECTED") {
  switch (status) {
    case "ACCEPTED":
      return "text-green-600 font-semibold";
    case "REJECTED":
      return "text-red-600 font-semibold";
    case "PENDING":
      return "text-gray-600 font-semibold";
    default:
      return "text-gray-400";
  }
}

function formatTimeAgo(date: Date) {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}



