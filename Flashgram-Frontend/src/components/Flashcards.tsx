import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { useRecoilValue } from "recoil";
import { flashcardAtom } from "@/atoms/dataAtoms";
import { Heart, Menu, RotateCcw } from "lucide-react";
import { Dashboard } from "./Dashboard";
import { UploadArea } from "./UploadArea";

interface FlashcardElement {
  Question: {
    text: string;
    hint: string;
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
  const [testMode, setTestMode] = useState<{ [key: number]: boolean }>({});
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [scores, setScores] = useState<{ [key: number]: number }>({});
  const [attemptedQuestions, setAttemptedQuestions] = useState(0);
  const [showComparison, setShowComparison] = useState<{ [key: number]: boolean }>({});
  const correctSound = useRef(typeof Audio !== 'undefined' ? new Audio('/correct.mp3') : null);
  const wrongSound = useRef(typeof Audio !== 'undefined' ? new Audio('/wrong.mp3') : null);
  const [showResult, setShowResult] = useState(false);
  const [lastScore, setLastScore] = useState(0);
  const [showLikedQuestions, setShowLikedQuestions] = useState(false);
  
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

  const toggleLike = (index: number, event?: React.MouseEvent) => {
    if (event) event.stopPropagation();
    
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

  const playSound = (isCorrect: boolean) => {
    try {
      if (isCorrect && correctSound.current) {
        correctSound.current.currentTime = 0;
        correctSound.current.play();
      } else if (!isCorrect && wrongSound.current) {
        wrongSound.current.currentTime = 0;
        wrongSound.current.play();
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const handleAnswerSubmit = (index: number, answer: string) => {
    const score = Math.floor(Math.random() * 101);
    const isCorrect = score >= 70;
    
    playSound(isCorrect);
    setLastScore(score);
    setShowResult(true);
    
    // Hide result after 1.5s
    setTimeout(() => setShowResult(false), 1500);
    
    setScores(prev => ({
      ...prev,
      [index]: score
    }));
    
    setUserAnswers(prev => ({
      ...prev,
      [index]: answer
    }));
    
    setAttemptedQuestions(prev => 
      scores[index] === undefined ? prev + 1 : prev
    );
    
    setTestMode(prev => ({
      ...prev,
      [index]: false
    }));

    showResultIndicator(isCorrect, index);
  };

  const showResultIndicator = (isCorrect: boolean, index: number) => {
    const indicator = document.createElement('div');
    indicator.className = `fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
      text-6xl z-[100] ${isCorrect ? 'text-green-500' : 'text-red-500'}`;
    indicator.innerHTML = isCorrect ? '✓' : '✗';
    
    document.body.appendChild(indicator);

    // Add animation classes
    indicator.animate([
      { opacity: 0, transform: 'translate(-50%, -50%) scale(0.5)' },
      { opacity: 1, transform: 'translate(-50%, -50%) scale(1.2)' },
      { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
      { opacity: 0, transform: 'translate(-50%, -50%) scale(1.2)' }
    ], {
      duration: 1500,
      easing: 'ease-out'
    });

    // Remove the indicator after animation
    setTimeout(() => {
      document.body.removeChild(indicator);
      setShowComparison(prev => ({
        ...prev,
        [index]: true
      }));
    }, 1500);
  };

  const closeTestMode = (index: number) => {
    setTestMode(prev => ({
      ...prev,
      [index]: false
    }));
  };

  // Add this function to handle restart
  const handleRestart = () => {
    setRevealedCards({});
    setTestMode({});
    setUserAnswers({});
    setScores({});
    setAttemptedQuestions(0);
    setShowComparison({});
    setLikedCards({});
    setShowLikeAnimation({});
    
    // Automatically scroll to top
    const container = document.querySelector('.scroll-container');
    if (container) {
      container.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  if (showUpload) {
    return <UploadArea onUploadComplete={() => setShowUpload(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#1a1b1e] relative overflow-hidden">
      <style>{styles}</style>
      
      {/* Menu Button */}
      <button
        onClick={() => setIsDashboardOpen(true)}
        className="fixed left-4 top-4 z-50 bg-[#25262b] text-white p-2 rounded-lg hover:bg-[#2c2d31] transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Progress and Likes Bar */}
      <div className="fixed top-4 right-4 z-50 flex items-start gap-4">
        {/* Progress */}
        <div className="bg-[#25262b] p-4 rounded-lg">
          <div className="text-[#40e6b4] text-sm font-mono mb-2">
            Progress: {attemptedQuestions}/{flashcardData.length}
          </div>
          <div className="w-48 h-2 bg-[#1a1b1e] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#40e6b4] transition-all duration-300"
              style={{ 
                width: `${(attemptedQuestions / flashcardData.length) * 100}%` 
              }}
            />
          </div>
        </div>

        {/* Liked Flashcards */}
        {/* <button 
          onClick={() => setShowLikedQuestions(!showLikedQuestions)}
          className="bg-[#25262b] p-4 rounded-lg"
        >
          <div className="text-[#40e6b4] text-sm font-mono mb-2 flex items-center gap-2">
            <Heart className="w-4 h-4" />
            <span>Liked</span>
          </div>
          <div className="w-48 h-2 bg-[#1a1b1e] rounded-full"></div>
        </button> */}
      </div>

      {/* Return to Original Deck Button - Only shown when viewing liked cards */}
      {/* {showLikedQuestions && (
        <button
          onClick={() => setShowLikedQuestions(false)}
          className="fixed top-20 right-4 z-50 bg-[#25262b] px-4 py-2 rounded-lg text-[#40e6b4] font-mono text-sm hover:bg-[#2c2d31] transition-colors"
        >
          View Original Deck */}
        {/* </button> */}
      {/* )} */}

      {/* Flashcards Container */}
      <div className="h-[100dvh] overflow-y-scroll snap-y snap-mandatory hide-scrollbar scroll-container">
        {/* Filter flashcards based on showLikedQuestions state */}
        {flashcardData
          .filter((_, index) => !showLikedQuestions || likedCards[index])
          .map((element: FlashcardElement, index) => {
            // Get the original index from the full deck
            const originalIndex = showLikedQuestions 
              ? flashcardData.findIndex((_, i) => likedCards[i] && !flashcardData.slice(0, i).some((_, j) => likedCards[j]))
              : index;

            return (
              <motion.div
                key={originalIndex}
                data-card-index={originalIndex}
                className="h-[100dvh] w-full flex items-center justify-center snap-start relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-20%" }}
                onDoubleClick={() => toggleLike(originalIndex)}
              >
                {/* Like Animation Overlay */}
                <AnimatePresence>
                  {showLikeAnimation[originalIndex] && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1.2 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute z-50 pointer-events-none"
                    >
                      <Heart className="w-24 h-24 text-[#40e6b4] fill-current" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Card Container */}
                <div className="w-[90%] max-w-md px-4">
                  <motion.div 
                    className="relative w-full bg-[#25262b] rounded-xl overflow-hidden"
                  >
                    <div className="p-6 space-y-6">
                      {/* Question Header with Like Button */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#40e6b4]" />
                          <h2 className="text-[#40e6b4] text-lg font-mono">Question {originalIndex + 1}</h2>
                        </div>
                        <button
                          onClick={(e) => toggleLike(originalIndex, e)}
                          className="text-gray-400 hover:text-[#40e6b4] transition-colors"
                        >
                          <Heart 
                            className={`w-6 h-6 ${likedCards[originalIndex] ? 'fill-[#40e6b4] text-[#40e6b4]' : ''}`} 
                          />
                        </button>
                      </div>

                      {/* Question Text */}
                      <div className="text-white text-xl font-mono leading-relaxed">
                        {element.Question.text}
                      </div>

                      {/* Test Yourself Button */}
                      {!scores[originalIndex] && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setTestMode(prev => ({ ...prev, [originalIndex]: true }));
                          }}
                          className="mt-8 text-[#40e6b4] hover:text-[#30cfd0] transition-colors font-mono"
                        >
                          Test yourself →
                        </button>
                      )}

                      {/* Tap to Reveal Answer Button */}
                      {scores[originalIndex] && !revealedCards[originalIndex] && (
                        <button
                          onClick={() => toggleReveal(originalIndex)}
                          className="mt-8 text-[#40e6b4] hover:text-[#30cfd0] transition-colors font-mono"
                        >
                          Tap to reveal answer →
                        </button>
                      )}
                    </div>
                  </motion.div>
                </div>

                {/* Answer Comparison Modal */}
                {revealedCards[originalIndex] && scores[originalIndex] && (
                  <div 
                    className="fixed inset-0 z-40 flex items-center justify-center bg-[#1a1b1e]/80 backdrop-blur-sm"
                    onClick={() => toggleReveal(originalIndex)}
                  >
                    <motion.div 
                      className="w-[90%] max-w-md bg-[#25262b] rounded-xl p-6 space-y-6"
                      onClick={(e) => e.stopPropagation()}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <div className="text-center mb-6">
                        <div className="inline-block bg-[#1a1b1e] rounded-lg px-4 py-2">
                          <span className="text-[#40e6b4] font-mono">Match Score: {scores[originalIndex]}%</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="bg-[#1a1b1e] rounded-xl p-4 border border-[#2c2d31]">
                          <div className="text-[#40e6b4] font-mono mb-2">Your Answer</div>
                          <div className="text-white font-mono leading-relaxed">{userAnswers[originalIndex]}</div>
                        </div>
                        <div className="bg-[#1a1b1e] rounded-xl p-4 border border-[#2c2d31]">
                          <div className="text-[#40e6b4] font-mono mb-2">Correct Answer</div>
                          <div className="text-white font-mono leading-relaxed">{element.Answer.text}</div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            );
          })}

        {/* Show message if no liked cards */}
        {showLikedQuestions && Object.values(likedCards).filter(Boolean).length === 0 && (
          <div className="h-[100dvh] w-full flex items-center justify-center">
            <div className="text-[#40e6b4] font-mono text-lg text-center">
              No liked flashcards yet
            </div>
          </div>
        )}

        {/* Restart Session at Bottom */}
        <div className="h-[100dvh] w-full flex flex-col items-center justify-center snap-start relative space-y-12">
          <div className="flex flex-col items-center gap-4">
            <span className="text-[#40e6b4] font-mono text-lg">Session Complete</span>
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-6 py-3 bg-[#40e6b4] text-[#1a1b1e] rounded-lg font-mono hover:bg-[#30cfd0] transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Restart</span>
            </button>
          </div>

          {/* Credit Badge */}
          <div className="bg-[#25262b] px-4 py-2 rounded-full border border-[#2c2d31] backdrop-blur-sm">
            <span className="font-mono text-sm text-gray-400">
              made by <span className="text-[#40e6b4]">Bijlee Vibhag</span>
            </span>
          </div>
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

      {/* Test Modal Overlay */}
      {Object.entries(testMode).map(([index, isActive]) => 
        isActive && (
          <div 
            key={`test-modal-${index}`}
            className="fixed inset-0 z-50 overflow-hidden bg-[#1a1b1e]/90 backdrop-blur-sm"
          >
            <div className="min-h-screen flex items-center justify-center p-4">
              <div 
                className="relative w-full max-w-2xl bg-[#25262b] rounded-xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Gradient border effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#40e6b4] to-[#30cfd0] opacity-20" />
                
                {/* Content container */}
                <div className="relative p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[#40e6b4] text-xl font-mono">Test Your Knowledge</h3>
                    <button 
                      onClick={() => setTestMode(prev => ({ ...prev, [index]: false }))}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="text-white text-lg font-mono mb-6">
                    {flashcardData[Number(index)].Question.text}
                  </div>

                  <textarea
                    className="w-full bg-[#1a1b1e] border border-[#40e6b4] rounded-lg p-4 
                             text-white font-mono focus:outline-none focus:ring-2 
                             focus:ring-[#40e6b4] resize-none min-h-[150px]"
                    placeholder="Enter your answer..."
                    value={userAnswers[Number(index)] || ''}
                    onChange={(e) => setUserAnswers(prev => ({
                      ...prev,
                      [index]: e.target.value
                    }))}
                    autoFocus
                  />

                  <div className="flex justify-end mt-6 gap-4">
                    <button
                      onClick={() => setTestMode(prev => ({ ...prev, [index]: false }))}
                      className="px-4 py-2 text-gray-400 hover:text-white transition-colors font-mono"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleAnswerSubmit(Number(index), userAnswers[Number(index)] || '')}
                      className="px-6 py-2 bg-[#40e6b4] text-[#1a1b1e] rounded-lg font-mono 
                               hover:bg-[#30cfd0] transition-colors"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      )}

      {/* Result Indicator */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-[#1a1b1e]/80"
          >
            <div className="bg-[#25262b] rounded-xl p-8 shadow-xl">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className={`text-8xl ${lastScore >= 70 ? 'text-[#40e6b4]' : 'text-red-500'}`}
              >
                {lastScore >= 70 ? '✓' : '✗'}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


// Add this CSS to your global styles or index.css
const styles = `
  /* Ensure the modal background stays dark */
  body.modal-open {
    overflow: hidden;
    background-color: #1a1b1e;
  }

  /* Prevent any white backgrounds from showing */
  #__next, 
  body, 
  html {
    background-color: #1a1b1e;
  }
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

  .backdrop-blur-sm {
    backdrop-filter: blur(8px);
  }

  @keyframes popIn {
    0% { transform: scale(0.5); opacity: 0; }
    50% { transform: scale(1.2); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
  }

  @keyframes popOut {
    0% { transform: scale(1); opacity: 1; }
    100% { transform: scale(1.2); opacity: 0; }
  }

  .result-indicator {
    animation: popIn 0.5s ease-out forwards;
  }

  .result-indicator.hide {
    animation: popOut 0.5s ease-out forwards;
  }
`;

/* Add to your global CSS */
