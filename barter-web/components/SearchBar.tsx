import Image from "next/image";

export default function SearchBar() {
  return (
    <div className="flex-1 max-w-xl mx-6 relative min-w-[120px]">
      <input
        type="text"
        placeholder="Search for skills or users..."
        className="w-full pr-10 pl-4 py-2 border border-[#00262b] text-[#00262b] rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <Image
          src="/icons/search.svg"
          alt="Search icon"
          width={20}
          height={20}
        />
      </div>
    </div>
  );
}
