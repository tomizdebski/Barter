"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@/contexts/UserContext";

// 🔥 Import ikon z lucide-react
import { BookOpenCheck, Repeat, UserCog, FileText } from "lucide-react";

interface Activity {
  type: string;
  description: string;
  date: string; // ISO string
}

export default function Dashboard() {
  const { user } = useUser();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch(`http://localhost:4000/users/${user?.id}/activities`, {
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch activities");
        }
        const data = await res.json();
        setActivities(data);
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchActivities();
    }
  }, [user?.id]); 

  return (
    <section className="p-6 lg:p-10 bg-[#e3e2e2] min-h-screen">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#00262b]">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-gray-600 mt-2">Here's what's happening on your account.</p>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            title="My Lessons"
            description="View and manage your lessons"
            link="/lessons/my"
          />
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
            link="/dashboard/settings"
          />
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-2xl font-semibold text-[#00262b] mb-4">Recent Activity</h2>

          {loading ? (
            <p>Loading activities...</p>
          ) : activities.length === 0 ? (
            <p className="text-gray-500">No recent activities yet.</p>
          ) : (
            <ul className="space-y-4">
              {activities.map((activity, index) => (
                <li
                  key={index}
                  className="bg-white shadow-sm rounded-xl p-4 border flex justify-between items-center text-[#00262b]"
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
      className="block bg-white rounded-xl border p-5 hover:shadow-md transition text-[#00262b]"
    >
      <h3 className="text-lg font-semibold text-[#00262b]">{title}</h3>
      <p className="text-sm text-gray-600 mt-1">{description}</p>
    </Link>
  );
}

// 🔥 Używamy ikonek z lucide-react
function getActivityIcon(type: string) {
  const iconProps = { size: 20, color: "#00262b" }; // ustawiony rozmiar i kolor

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

// Funkcja pomocnicza: formatowanie daty "time ago"
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


