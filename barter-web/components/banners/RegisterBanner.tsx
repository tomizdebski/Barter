import Link from "next/link";

export default function RegisterBanner() {
    return (
        <section className="relative w-full bg-gradient-to-br from-[#00262b] to-[#003b40] overflow-hidden py-20 text-center">
      {/* Ukośny rozmyty tekst w tle */}
      <div className="absolute inset-0 -rotate-12 scale-150 blur-[2px] opacity-20 z-0 flex items-center justify-center pointer-events-none">
        <p className="text-white text-[8vw] font-extrabold whitespace-nowrap leading-none">
          register register register
        </p>
      </div>

      {/* Treść */}
      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <h1 className="text-white text-4xl sm:text-6xl font-black mb-4 italic">
          Register for a free account
        </h1>
        <p className="text-white text-lg sm:text-xl mb-8">Sign up now.</p>
        <Link href="/auth/register">
        <button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-full transition duration-300">
          Get started
        </button>
        </Link>
      </div>
    </section>
      );
    }
  
  