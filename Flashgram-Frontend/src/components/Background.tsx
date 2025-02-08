import { FlipWordsDemo } from "./Flipwords";
import { Navbar } from "./Navbar";
import { FileUploadDemo } from "./Upload";
import { InfiniteMovingCardsDemo } from "./Infinitemovingcards";
import { Footer } from "./Footer";
import { HoverBorderGradient } from "../ui/hover-border-gradient";
import RotatingCardsLoader from "./loader";
import { useRecoilValue } from "recoil";
import { loaderAtom } from "@/atoms/dataAtoms";

export function GridBackgroundDemo() {
  const loader = useRecoilValue(loaderAtom);
  
  return (
    <div className="bg-[#0d1117] min-h-screen w-full overflow-x-hidden">
      <div className={`relative ${loader ? 'blur-sm opacity-80' : ''} transition-all duration-300`}>
        <Navbar />
        <div className="w-full bg-[#0d1117] relative">
          {/* Grid pattern overlay with fade effect */}
          <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none">
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#0d1117] to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0d1117] to-transparent" />
            <div className="absolute top-0 left-0 bottom-0 w-32 bg-gradient-to-r from-[#0d1117] to-transparent" />
            <div className="absolute top-0 right-0 bottom-0 w-32 bg-gradient-to-l from-[#0d1117] to-transparent" />
          </div>
          
          {/* Radial gradient overlay */}
          <div className="absolute pointer-events-none inset-0 flex items-center justify-center [mask-image:radial-gradient(ellipse_at_center,transparent_25%,black)]">
            <div className="absolute inset-0 bg-gradient-to-b from-[#1a2332]/20 via-transparent to-[#0d1117]"></div>
          </div>

          {/* Main content container */}
          <div className="relative flex flex-col items-center justify-start pt-12 px-4 md:px-6 lg:px-8 space-y-8 max-w-[100vw]">
            <div className="w-full max-w-2xl">
              <FlipWordsDemo />
            </div>

            <div className="text-center space-y-0 px-4">
              <p className="text-base md:text-lg lg:text-xl text-gray-400 font-medium">
                Learn Effortlessly: Convert PDFs into Scrollable Flashcards!
              </p>
              {/* <p className="text-base md:text-lg lg:text-xl text-gray-400 font-medium">
                Now learning is just a scroll away!
              </p> */}
            </div>

            {/* <HoverBorderGradient
              containerClassName="rounded"
              as="button"
              className="bg-[#0d1117] text-[#4ff0d1] hover:text-white flex items-center space-x-2 px-4 py-2"
            >
              <span>Get started Now</span> 
            </HoverBorderGradient> */}

            <div className="w-full max-w-2xl">
              <FileUploadDemo />
            </div>
            
            <div className="w-full overflow-hidden">
              <InfiniteMovingCardsDemo />
            </div>
            
            <div className="w-full">
              <Footer />
            </div>
          </div>
        </div>
      </div>
      
      {loader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d1117]/50">
          <RotatingCardsLoader />
        </div>
      )}
    </div>
  );
}
