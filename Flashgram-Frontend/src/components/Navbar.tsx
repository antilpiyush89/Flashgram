import { Flash } from "../Icons/Flash";

export function Navbar() {
  return <div className="fixed top-0 z-50 w-full">
    <div className="bg-[#0d1117] backdrop-blur-lg bg-opacity-70 h-14 text-white flex justify-between items-center px-4 border-b border-[#1a2332]">
        <div className="text-lg font-bold flex items-center gap-1 text-[#4ff0d1]">
          <span><Flash/></span>FlashGram
        </div>
        <div className="hidden md:flex space-x-2">
            <button className="px-6 py-1 text-sm font-medium text-gray-300 hover:text-[#4ff0d1] transition-colors">Home</button>
            <button className="px-6 py-1 text-sm font-medium text-gray-300 hover:text-[#4ff0d1] transition-colors">My Cards</button>
            <button className="px-6 py-1 text-sm font-medium text-gray-300 hover:text-[#4ff0d1] transition-colors">About Us</button>
            <button className="px-6 py-1 text-sm font-medium text-gray-300 hover:text-[#4ff0d1] transition-colors">Upload</button>
        </div>
        <div>
            <button className="bg-[#4ff0d1] hover:bg-[#3ad1b3] transition-all duration-300 px-3 py-1 text-sm font-medium rounded-full shadow-lg hover:shadow-[#4ff0d1]/20 text-[#0d1117]">
                Sign In
            </button>
        </div>
    </div>
  </div>
}