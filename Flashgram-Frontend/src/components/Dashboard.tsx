import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";
import { useState, useRef, KeyboardEvent } from "react";

interface DashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateNew: () => void;
  flashcardTitle: string;
  onTitleChange: (title: string) => void;
}

export const Dashboard = ({ 
  isOpen, 
  onClose, 
  onCreateNew, 
  flashcardTitle, 
  onTitleChange 
}: DashboardProps) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const handleTitleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditingTitle(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="fixed inset-y-0 left-0 w-[320px] md:w-[400px] bg-[#25262b] z-50 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <h2 className="text-[#40e6b4] text-xl sf-pro">Dashboard</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Title Input
          <div className="p-6 border-b border-gray-700">
            {isEditingTitle ? (
              <input
                ref={titleInputRef}
                value={flashcardTitle}
                onChange={(e) => onTitleChange(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={handleTitleKeyDown}
                className="w-full bg-transparent text-[#40e6b4] sf-pro text-lg focus:outline-none border-b border-[#40e6b4]"
                autoFocus
              />
            ) : (
              <div 
                onClick={() => setIsEditingTitle(true)}
                className="text-[#40e6b4] sf-pro text-lg cursor-pointer hover:opacity-80"
              >
                {flashcardTitle}
              </div>
            )}
          </div> */}

          <div className="p-6 space-y-6">
            {/* Create New Button */}
            <button 
              onClick={onCreateNew}
              className="w-full bg-[#1a1b1e] rounded-lg p-4 flex items-center justify-center gap-2 hover:bg-[#2c2d31] transition-colors"
            >
              <Plus className="w-5 h-5 text-[#40e6b4]" />
              <span className="text-[#40e6b4] sf-pro">Create New</span>
            </button>

            {/* Flashcards List */}
            <div>
              <h3 className="text-white sf-pro mb-4 uppercase tracking-wider text-sm">
                Your Flashcards
              </h3>
              <div className="space-y-3">
                {[1, 2].map((item) => (
                  <div 
                    key={item}
                    className="bg-[#1a1b1e] rounded-lg p-4 cursor-pointer hover:bg-[#2c2d31] transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#40e6b4]" />
                      <h4 className="text-[#40e6b4] sf-pro">Flashcard 1</h4>
                    </div>
                    <p className="text-gray-400 text-sm sf-pro ml-3.5">
                      Last edited 2 days ago
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 