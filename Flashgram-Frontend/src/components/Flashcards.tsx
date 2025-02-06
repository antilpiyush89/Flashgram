import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { useRecoilValue } from "recoil";
import { flashcardAtom } from "@/atoms/dataAtoms";
import { Heart, Menu } from "lucide-react";
import { Dashboard } from "./Dashboard";
import { UploadArea } from "./UploadArea";

interface FlashcardElement {
  Question: {
    text: string;
    hint?: string;
  };
  Answer: {
    text: string;
  };
}

// Add this CSS to your index.css
// const styles = `

// `;

export const Flashcard = () => {
  const flashcardData = useRecoilValue(flashcardAtom);
  const containerRef = useRef<HTMLDivElement>(null);
  const [revealedCards, setRevealedCards] = useState<{ [key: number]: boolean }>({});
  const [likedCards, setLikedCards] = useState<{ [key: number]: boolean }>({});
  const [showLikeAnimation, setShowLikeAnimation] = useState<{ [key: number]: boolean }>({});
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [flashcardTitle, setFlashcardTitle] = useState("Untitled Flashcard");
  const [showUpload, setShowUpload] = useState(false);
  
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

  const handleCreateNew = () => {
    setIsDashboardOpen(false);
    setShowUpload(true);
  };

  if (showUpload) {
    return <UploadArea onUploadComplete={() => setShowUpload(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#1a1b1e] relative">
      <style>{styles}</style>
      
      {/* Menu Button */}
      <button
        onClick={() => setIsDashboardOpen(true)}
        className="fixed left-4 top-4 z-50 bg-[#25262b] text-white p-2 rounded-lg hover:bg-[#2c2d31] transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Flashcards Container */}
      <div className="h-screen overflow-y-scroll snap-y snap-mandatory hide-scrollbar">
        {flashcardData.map((element: FlashcardElement, index) => (
          <motion.div
            key={index}
            className="h-screen w-full flex items-center justify-center snap-start"
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

                {/* Footer */}
                <div className="text-center mt-6">
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

      {/* Footer credit */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center items-center gap-2 z-50">
        <div className="credit-text">
          made by <span className="credit-highlight">Bijlee vibhag</span>
        </div>
      </div>

      {/* Dashboard */}
      <Dashboard
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        onCreateNew={handleCreateNew}
        flashcardTitle={flashcardTitle}
        onTitleChange={setFlashcardTitle}
      />
    </div>
  );
};

// Add this CSS to your global styles or index.css
const styles = `
  .gradient-border {
    position: relative;
    background: #1a1b1e;
    border-radius: 30px;
  }

  .gradient-border::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 30px;
    padding: 1px;
    background: linear-gradient(45deg, #40e6b4, #30cfd0);
    -webkit-mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }

  .credit-text {
    font-family: 'SF Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
  }

  .credit-highlight {
    color: #40e6b4;
    font-weight: 500;
  }

  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .moving-border {
    --border-size: 2px;
    --border-angle: 0turn;
    background-image: conic-gradient(
      from var(--border-angle),
      #40e6b4,
      #30cfd0 50%,
      #40e6b4
    );
    background-size: calc(100% + var(--border-size) * 2) calc(100% + var(--border-size) * 2);
    animation: bg-spin 3s linear infinite;
  }

  @keyframes bg-spin {
    to {
      --border-angle: 1turn;
    }
  }
`;