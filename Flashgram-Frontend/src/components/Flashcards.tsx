import { useRef, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useRecoilValue } from "recoil";
import { flashcardAtom } from "@/atoms/dataAtoms";

export const Flashcard = () => {
  const flashcardData = useRecoilValue(flashcardAtom);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    container: containerRef,
    smooth: true,
  });

  const smoothProgress = useSpring(scrollYProgress, {
    damping: 50,
    stiffness: 400,
  });

  return (
    <div 
      ref={containerRef}
      className="h-screen overflow-y-scroll snap-y snap-mandatory hide-scrollbar bg-[#1a1b1e]"
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      {/* Progress bar */}
      <motion.div
        className="fixed right-4 top-1/2 h-1/3 w-1 bg-gray-700 rounded-full -translate-y-1/2"
        style={{ originY: 0 }}
      >
        <motion.div
          className="w-full bg-[#40e6b4] rounded-full"
          style={{ 
            height: smoothProgress,
            originY: 0 
          }}
        />
      </motion.div>

      {flashcardData.map((element, index) => (
        <motion.div
          key={index}
          className="min-h-[95vh] w-full flex items-center justify-center snap-start mb-8"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-20%" }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 200,
          }}
        >
          <div className="w-[90%] max-w-4xl bg-[#25262b] rounded-lg p-8 border border-gray-800">
            {/* Blue dot and title section */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 rounded-full bg-[#40e6b4]" />
              <h2 className="text-[#40e6b4] text-lg font-mono">Question {index + 1}</h2>
            </div>

            {/* Main content */}
            <div className="space-y-6">
              <div className="text-white text-xl font-mono leading-relaxed">
                {element.Question.text}
              </div>
              
              {element.Question.hint && (
                <div className="text-gray-400 text-lg font-mono mt-4 leading-relaxed">
                  Hint: {element.Question.hint}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-gray-500 text-sm font-mono">
                Scroll Down for Answer
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Add this CSS to your global styles or index.css
const styles = `
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;
