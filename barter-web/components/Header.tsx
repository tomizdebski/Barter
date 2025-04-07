import React from "react";
import Image from "next/image";
import Link from "next/link";
import SearchBar from "./SearchBar";



const Header: React.FC = () => {
  return (
    <header className="bg-white shadow px-6 py-4 flex items-center justify-between">
      {/* Logo */}
    <div className="flex items-center">
      <Image src="/logo/logo.svg" alt="Barter Logo" width={175} height={175} />
      
    </div>

      {/* Search bar */}
      <SearchBar />



      {/* Buttons */}
      <div className="flex space-x-4">
        <button className="px-4 py-2  text-[#00262b] rounded-full hover:bg-blue-50 transition">
          Sign In
        </button>
        <button className="px-4 py-2 bg-[#d64000] text-white rounded-full hover:bg-white hover:border hover:text-[#d64000] transition">
          Register
        </button>
      </div>
    </header>
  );
};

export default Header;

