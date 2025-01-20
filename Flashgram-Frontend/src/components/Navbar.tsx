import { Flash } from "../Icons/Flash";

export function Navbar() {
  return <div className="sticky top-0 z-50 ">
    <div className="bg-black backdrop-blur-lg bg-opacity-70 h-14 text-white flex justify-between items-center px-6 border-b border-gray-800 ">
        <div className="text-xl font-bold flex items-center gap-2 text-blue-400"><span><Flash/></span>FlashGram</div>
        <div className="hidden md:flex space-x-1">
            <button className="px-3 py-1 text-sm font-medium hover:text-blue-400 transition-colors">Services</button>
            <button className="px-3 py-1 text-sm font-medium hover:text-blue-400 transition-colors">Cards</button>
            <button className="px-3 py-1 text-sm font-medium hover:text-blue-400 transition-colors">Menu</button>
            <button className="px-3 py-1 text-sm font-medium hover:text-blue-400 transition-colors">Home</button>
            <button className="px-3 py-1 text-sm font-medium hover:text-blue-400 transition-colors">Book</button>
            <button className="px-3 py-1 text-sm font-medium hover:text-blue-400 transition-colors">About us</button>
            <button className="px-3 py-1 text-sm font-medium hover:text-blue-400 transition-colors">Mission</button>
        </div>
        <div>
            <button className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 px-4 py-1.5 text-sm font-medium rounded-full shadow-lg hover:shadow-blue-500/20">
                Sign In
            </button>
        </div>
    </div>
  </div>
}