"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@/contexts/UserContext";
import { BookOpenCheck, Repeat, UserCog, FileText, ChevronDown, ChevronUp } from "lucide-react";

interface Activity {
  type: string;
  description: string;
  date: string;
}

interface Lesson {
  id: number;
  name: string;
}

export default function Dashboard() {
  const { user } = useUser();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [loadingLessons, setLoadingLessons] = useState(true);
  const [showLessons, setShowLessons] = useState(false);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch(`http://localhost:4000/users/${user?.id}/activities`, {
          credentials: "include",
        });
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

  return (
    <section className="p-6 lg:p-10 bg-[#00262b] min-h-screen">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-gray-100 mt-2">Here's what's happening on your account.</p>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* My Lessons (tylko przycisk) */}
          <div
            onClick={() => setShowLessons(!showLessons)}
            className="bg-white rounded-xl  p-5 hover:shadow-md hover:opacity-90 shadow-white transition text-[#00262b] cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <div>
                <h3 className="text-lg font-semibold text-[#00262b]">My Lessons</h3>
                <p className="text-sm text-gray-600 mt-1">View and manage your lessons</p>
              </div>
              {showLessons ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </div>

          {/* Pozostałe karty */}
          <DashboardCard
            title="Add Lesson"
            description="Create a new barter lesson"
            link="/lessons/create"
          />
          <DashboardCard
            title="My Barters"
            description="Check your barter exchanges"
            link="/barters"
          />
          <DashboardCard
            title="Settings"
            description="Manage your profile & account"
            link="/settings"
          />
        </div>

        {/* Rozwijany panel z lekcjami */}
        {showLessons && (
          <div className="mt-6 bg-white rounded-xl p-6 shadow-md text-[#00262b] transition-all">
            {loadingLessons ? (
              <p className="text-gray-500 text-sm">Loading lessons...</p>
            ) : lessons.length === 0 ? (
              <p className="text-gray-500 text-sm">You have no lessons yet.</p>
            ) : (
              <ul className="space-y-2">
                {lessons.map((lesson) => (
                  <li key={lesson.id}>
                    <Link
                      href={`/lessons/${lesson.id}`}
                      className="flex items-center gap-2 text-sm text-[#00262b] hover:underline"
                    >
                      📚 {lesson.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4 text-right">
              <Link
                href="/lessons/my"
                className="text-sm text-[#00262b] underline hover:text-blue-600"
              >
                View all lessons ➔
              </Link>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div>
          <h2 className="text-2xl font-semibold text-[#00262b] mb-4">Recent Activity</h2>

          {loadingActivities ? (
            <p>Loading activities...</p>
          ) : activities.length === 0 ? (
            <p className="text-gray-500">No recent activities yet.</p>
          ) : (
            <ul className="space-y-4">
              {activities.map((activity, index) => (
                <li
                  key={index}
                  className="bg-white/80 shadow-sm rounded-xl p-4  flex justify-between items-center text-[#00262b]"
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
          )}
        </div>
      </div>
    </section>
  );
}

function DashboardCard({
  title,
  description,
  link,
}: {
  title: string;
  description: string;
  link: string;
}) {
  return (
    <Link
      href={link}
      className="block bg-white rounded-xl  p-5 hover:shadow-md hover:opacity-90 shadow-white transition text-[#00262b]"
    >
      <h3 className="text-lg font-semibold text-[#00262b]">{title}</h3>
      <p className="text-sm text-gray-600 mt-1">{description}</p>
    </Link>
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
