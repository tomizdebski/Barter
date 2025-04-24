"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [username, setUsername] = useState("Tomasz"); // Zaciągaj z kontekstu / sesji

  // Możesz dodać useEffect z fetch'em użytkownika, jeśli nie masz kontekstu
  // useEffect(() => {...}, []);

  return (
    <section className="p-6 lg:p-10 bg-[#f9f9f9] min-h-screen">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#00262b]">
            Welcome back, {username}! 👋
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
          <ul className="space-y-4">
            <li className="bg-white shadow-sm rounded-xl p-4 border">
              ✅ You published a new lesson: <strong>“Guitar for Beginners”</strong>
              <span className="text-gray-500 ml-2 text-sm">2 days ago</span>
            </li>
            <li className="bg-white shadow-sm rounded-xl p-4 border">
              🔁 You accepted a barter with <strong>Anna Kowalska</strong>
              <span className="text-gray-500 ml-2 text-sm">4 days ago</span>
            </li>
            <li className="bg-white shadow-sm rounded-xl p-4 border">
              📝 You updated your profile
              <span className="text-gray-500 ml-2 text-sm">Last week</span>
            </li>
          </ul>
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
      className="block bg-white rounded-xl border p-5 hover:shadow-md transition"
    >
      <h3 className="text-lg font-semibold text-[#00262b]">{title}</h3>
      <p className="text-sm text-gray-600 mt-1">{description}</p>
    </Link>
  );
}
