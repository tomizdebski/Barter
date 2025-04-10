"use client";

import Image from "next/image";

const testimonials = [
  {
    quote: (
      <>
        <strong>"Barter helped me find a mentor"</strong>. I exchanged design help
        for career advice and it was one of the most rewarding experiences I've had online.
      </>
    ),
    name: "Anna K.",
    title: "Frontend Developer, Kraków",
  },
  {
    quote: (
      <>
        I joined Barter to improve my soft skills. <strong>After just 3 weeks I had
        multiple collaborations and grew my confidence.</strong>
      </>
    ),
    name: "Michał T.",
    title: "Student UX/UI, Wrocław",
  },
  {
    quote: (
      <>
        <strong>Finally a platform where I can learn and give back at the same time!</strong> 
        I taught JavaScript and received English coaching in return.
      </>
    ),
    name: "Eliza P.",
    title: "Junior JS Developer, Poznań",
  },
];

export default function TestimonialsBarter() {
  return (
    <section className="bg-white py-20 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-[#00262b]">Feedback from our users</h2>
        <p className="text-4xl font-black italic mt-2 text-[#00262b]">
          What Barter users are saying
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-[#f9f9f9] p-6 rounded shadow-sm border border-gray-100 text-left"
            >
              <p className="text-gray-700 text-[17px] leading-relaxed">{t.quote}</p>
              <hr className="my-4 border-gray-200" />
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#00262b] text-white flex items-center justify-center rounded-full">
                  <span className="text-lg font-bold">💬</span>
                </div>
                <div>
                  <p className="font-semibold text-[#00262b]">{t.name}</p>
                  <p className="text-sm text-gray-500">{t.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
