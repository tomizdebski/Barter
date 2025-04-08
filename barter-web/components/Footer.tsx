import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-white px-6 py-6 ">
      {/* Górna część stopki */}
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Image src="/logo/logo.svg" alt="Barter Logo" width={80} height={80} />

        {/* Ikonki social media */}
        <div className="flex space-x-4">
          <a href="#" aria-label="Facebook">
            <Image src="/icons/social/facebook.svg" alt="Facebook" width={20} height={20} />
          </a>
        
          <a href="#" aria-label="Instagram">
            <Image src="/icons/social/instagram.svg" alt="Instagram" width={20} height={20} />
          </a>
          <a href="#" aria-label="LinkedIn">
            <Image src="/icons/social/linkedin.svg" alt="LinkedIn" width={20} height={20} />
          </a>
        </div>
      </div>

      {/* Linia oddzielająca */}
      <hr className="my-6 border-t border-gray-200" />

      {/* Dolna część z copyrightem */}
      <div className="text-sm text-gray-500 text-center">
        © 2025 Barter. All rights reserved.
      </div>
    </footer>
  );
}
