'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Props = {
  photo: string
  video: string
  title: string
}

export default function ImageVideoCarousel({ photo, video, title }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)

  const slides = [
    { type: 'image', src: `${process.env.NEXT_PUBLIC_API_URL}/${photo}` },
    { type: 'video', src: `${process.env.NEXT_PUBLIC_API_URL}/${video}` },
  ]

  const prev = () => setActiveIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  const next = () => setActiveIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1))

  return (
    <div className="relative w-full h-72 md:h-96 bg-black rounded-lg overflow-hidden">
      {slides[activeIndex].type === 'image' ? (
        <Image src={slides[activeIndex].src} alt={title} fill className="object-cover" />
      ) : (
        <video src={slides[activeIndex].src} controls className="w-full h-full object-cover" />
      )}

      {/* Left arrow */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white/40 rounded-sm flex items-center justify-center shadow hover:bg-white/60 transition"
        aria-label="Previous"
      >
        <ChevronLeft className="text-gray-700 w-5 h-5" />
      </button>

      {/* Right arrow */}
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white/40 rounded-sm flex items-center justify-center shadow hover:bg-white/60 transition"
        aria-label="Next"
      >
        <ChevronRight className="text-gray-700 w-5 h-5" />
      </button>
    </div>
  )
}

