import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { useRecoilValue } from "recoil";
import { flashcardAtom } from "@/atoms/dataAtoms";
import { Heart } from "lucide-react";

export const Flashcard = () => {
  const flashcardData = useRecoilValue(flashcardAtom);
  const containerRef = useRef<HTMLDivElement>(null);
  const [revealedCards, setRevealedCards] = useState<{ [key: number]: boolean }>({});
  const [likedCards, setLikedCards] = useState<{ [key: number]: boolean }>({});
  const [showLikeAnimation, setShowLikeAnimation] = useState<{ [key: number]: boolean }>({});
  
  const { scrollYProgress } = useScroll({
    container: containerRef,
    smooth: true,
  });

  const smoothProgress = useSpring(scrollYProgress, {
    damping: 50,
    stiffness: 400,
  });

  const toggleReveal = (index: number) => {
    setRevealedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const toggleLike = (index: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setLikedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
    
    // Show like animation
    setShowLikeAnimation(prev => ({ ...prev, [index]: true }));
    
    // Hide like animation after 1.5 seconds
    setTimeout(() => {
      setShowLikeAnimation(prev => ({ ...prev, [index]: false }));
    }, 1500);
  };

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
        className="fixed right-4 top-1/2 h-1/3 w-1 bg-gray-700 rounded-full -translate-y-1/2 z-50"
        style={{ originY: 0 }}
      >
        <motion.div
          className="w-full bg-[#40e6b4] rounded-full"
          style={{ height: smoothProgress, originY: 0 }}
        />
      </motion.div>

      {flashcardData.map((element, index) => (
        <motion.div
          key={index}
          className="h-[95vh] w-full flex items-center justify-center snap-start mb-[5vh]"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-20%" }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 200,
          }}
        >
          {/* Gradient border wrapper */}
          <motion.div 
            className="relative w-[90%] max-w-3xl glow-card-wrapper rounded-xl"
            animate={{ 
              height: revealedCards[index] ? "auto" : "280px"
            }}
            transition={{
              height: { type: "spring", stiffness: 300, damping: 30 }
            }}
          >
            {/* Moving gradient border */}
            <div className="absolute inset-0 rounded-xl overflow-hidden">
              <div className="moving-border" />
            </div>
            
            {/* Main card content */}
            <div 
              className="relative w-full h-full bg-[#25262b] rounded-xl p-6 pb-8 md:p-8 cursor-pointer z-10"
              onClick={() => toggleReveal(index)}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#40e6b4]" />
                  <h2 className="text-[#40e6b4] text-lg font-mono">Question {index + 1}</h2>
                </div>
                <motion.button
                  onClick={(e) => toggleLike(index, e)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="z-10"
                >
                  <Heart
                    className={`w-6 h-6 transition-colors duration-200 ${
                      likedCards[index] ? 'fill-red-500 text-red-500' : 'text-gray-400'
                    }`}
                  />
                </motion.button>
              </div>

              {/* Question content */}
              <div className="space-y-4">
                <div className="text-white text-xl font-mono leading-relaxed">
                  {element.Question.text}
                </div>
                
                {element.Question.hint && (
                  <div className="text-gray-400 text-lg font-mono leading-relaxed">
                    Hint: {element.Question.hint}
                  </div>
                )}

                {/* Answer section */}
                <AnimatePresence mode="sync">
                  {revealedCards[index] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{
                        opacity: { duration: 0.2 },
                        height: { duration: 0.3 }
                      }}
                    >
                      <div className="mt-6 pt-6 border-t border-gray-700">
                        <h3 className="text-[#40e6b4] text-lg font-mono mb-3">Answer:</h3>
                        <div className="text-white text-xl font-mono leading-relaxed">
                          {element.Answer.text}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer with improved mobile padding */}
              <div className="text-center mt-6 mb-4 md:mb-2">
                <p className="text-gray-500 text-sm font-mono">
                  {revealedCards[index] ? "Tap to hide answer" : "Tap to reveal answer"}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Like animation overlay */}
          <AnimatePresence>
            {showLikeAnimation[index] && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <Heart className="w-24 h-24 text-red-500 fill-red-500" />
              </motion.div>
            )}
          </AnimatePresence>
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
