import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative w-full h-auto md:h-[600px] bg-[#00262b] overflow-hidden flex flex-col md:flex-row">
      {/* Lewa część - tekst */}
      <div className="w-full md:w-1/2 px-6 md:px-10 py-10 flex flex-col justify-center z-10 text-white text-center md:text-left">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight italic">
          Bring your <br className="sm:hidden" />
          <span className="text-pink-400 italic">goals into focus</span>
        </h1>

        <p className="mt-4 text-sm sm:text-base md:text-lg text-gray-200 font-medium">
          Barter offers online skill exchange and collaboration opportunities
          that help you grow in every project and career step.
        </p>

        {/* Searchbar */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full max-w-md">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search our 4000+ skills..."
              className="bg-white w-full py-3 px-4 rounded-md text-gray-800 focus:outline-none"
            />
            <Image
              src="/icons/search.svg"
              alt="Search icon"
              width={20}
              height={20}
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
            />
          </div>
          <button className="bg-orange-600 text-white px-6 py-3 rounded-full hover:bg-orange-700 transition w-full sm:w-auto">
            Search
          </button>
        </div>
      </div>

      {/* Prawa część – obrazek */}
      <div className="hidden md:block w-1/2 h-full relative clip-hero-image">
        <Image
          src="/images/hero_person.png"
          alt="Hero person"
          fill
          className="object-cover"
        />
      </div>
    </section>
  );
}
