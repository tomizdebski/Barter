"use client";

const categories = [
  "Python",
  "Linux",
  "JS Networks",
  "HTML",
  "Git",
  "DevOps",
  "DB",
  "CSS",
  "Cloud",
  "Agile",
  "Testing",
  "Regex",
  "Security",
  "SQL",
  "Others",
];

const trendingOffers = [
  {
    image: "https://source.unsplash.com/600x400/?python,code",
    title: "Python Debugging Masterclass",
    author: "Ola K.",
    category: "Python",
  },
  {
    image: "https://source.unsplash.com/600x400/?linux,terminal",
    title: "Linux CLI Challenge",
    author: "Bartek L.",
    category: "Linux",
  },
  {
    image: "https://source.unsplash.com/600x400/?javascript,network",
    title: "JavaScript for Real-Time Apps",
    author: "Anna M.",
    category: "JS Networks",
  },
  {
    image: "https://source.unsplash.com/600x400/?sql,database",
    title: "SQL Queries for Beginners",
    author: "Kuba D.",
    category: "SQL",
  },
];

export default function TrendingSection() {
  return (
    <section className="bg-[#f9f9f9] py-16 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-[#00262b]">Trending on Barter</h2>

        {/* Categories */}
        <div className="flex gap-2 mt-6 flex-wrap">
          {categories.map((cat, i) => (
            <button
              key={i}
              className="px-4 py-1 border border-[#00262b] text-sm rounded-full hover:bg-[#00262b] text-[#00262b] hover:text-white transition bg-[#E1DDD0]"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trendingOffers.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="w-full h-40 bg-[#E1DDD0]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-[#00262b]">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.author}</p>
              </div>
              <div className="px-4 pb-4">
                <span className="inline-block mt-2 bg-[#E1DDD0] text-xs px-3 py-1 rounded-full shadow text-gray-700">
                  {item.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <a
            href="#"
            className="text-[#00262b] underline text-sm font-medium hover:text-orange-600 transition"
          >
            View more popular barter offers
          </a>
        </div>
      </div>
    </section>
  );
}
