import { cn } from "../lib/utils";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { IconUpload } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";

const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 20,
    y: -20,
    opacity: 0.9,
  },
};

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

const innerBorderVariant = {
  initial: {
    pathLength: 0,
    opacity: 0,
  },
  animate: {
    pathLength: [0, 1],
    opacity: [0, 1, 1, 0],
    transition: {
      pathLength: {
        duration: 4,
        repeat: Infinity,
        ease: "linear",
        delay: 0.5,
      },
      opacity: {
        duration: 4,
        times: [0, 0.2, 0.8, 1],
        repeat: Infinity,
        ease: "linear",
        delay: 0.5,
      },
    },
  },
};

const boxVariants = {
  initial: {
    transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)",
  },
  hover: {
    transform: "perspective(1000px) rotateX(5deg) rotateY(0deg) scale(1.02)",
    boxShadow: "0 30px 60px rgba(79,240,209,0.1)",
  },
};

export const FileUpload = ({
  onChange,
}: {
  onChange?: (files: File[]) => void;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const handleFileChange = (newFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    onChange && onChange(newFiles);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    onDrop: handleFileChange,
    onDropRejected: (error) => {
      console.log(error);
    },
  });

  return (
    <div className="opacity-100 w-full max-w-2xl mx-auto perspective-1000" {...getRootProps()}>
      <motion.div
        onClick={handleClick}
        initial="initial"
        animate={isHovering ? "hover" : "initial"}
        variants={boxVariants}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="p-12 group/file block rounded-2xl cursor-pointer w-full relative overflow-hidden bg-gradient-to-b from-[#1a2332]/80 to-[#1a2332]/40 backdrop-blur-sm border border-[#1a2332] hover:border-[#4ff0d1]/50 transition-all duration-500 min-h-[300px] shadow-lg hover:shadow-[#4ff0d1]/10"
      >
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
        />
        
        {/* Animated Border Ray */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full"
            fill="none"
            initial="initial"
            animate="animate"
          >
            <motion.path
              d="M 0 0 L 100 0 L 100 100 L 0 100 Z"
              stroke="url(#gradient)"
              strokeWidth="0.5"
              strokeLinecap="round"
              variants={innerBorderVariant}
              className="drop-shadow-[0_0_15px_rgba(79,240,209,0.7)]"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#4ff0d1', stopOpacity: 0 }} />
                <stop offset="50%" style={{ stopColor: '#4ff0d1', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#4ff0d1', stopOpacity: 0 }} />
              </linearGradient>
            </defs>
          </motion.svg>
        </div>
        
        {/* Content Container */}
        <div className="relative z-10 flex flex-col items-center justify-center gap-8 h-full">
          {/* Upload Icon and Text */}
          <div className="flex flex-col items-center gap-6 text-center">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              onHoverStart={() => setIsHovering(true)}
              onHoverEnd={() => setIsHovering(false)}
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#4ff0d1]/20 to-[#4ff0d1]/5 flex items-center justify-center backdrop-blur-sm border border-[#4ff0d1]/20 group-hover:border-[#4ff0d1]/40 transition-all duration-500"
            >
              <motion.div
                animate={isHovering ? { y: -5 } : { y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <IconUpload className="w-10 h-10 text-[#4ff0d1] transform group-hover:scale-110 transition-transform duration-500" />
              </motion.div>
            </motion.div>
            <motion.div 
              className="space-y-2"
              animate={isHovering ? { y: -3 } : { y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <p className="text-2xl font-medium text-gray-200 group-hover:text-white transition-colors duration-500">
                {isDragActive ? "Drop your files here" : "Upload your PDF"}
              </p>
              <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-500">
                Drag and drop or click to upload
              </p>
            </motion.div>
          </div>

          {/* File Display */}
          <motion.div 
            className="w-full max-w-md mt-6"
            animate={isHovering ? { y: 3 } : { y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            {files.length > 0 && files.map((file, idx) => (
              <motion.div
                key={"file" + idx}
                layoutId={idx === 0 ? "file-upload" : "file-upload-" + idx}
                className="relative overflow-hidden z-40 bg-[#0d1117] flex flex-col items-start justify-start p-6 rounded-xl border border-[#1a2332] hover:border-[#4ff0d1]/30 transition-colors duration-300 shadow-lg"
              >
                <div className="flex justify-between w-full items-center gap-4">
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    layout
                    className="text-base text-gray-300 truncate max-w-xs font-medium"
                  >
                    {file.name}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    layout
                    className="px-3 py-1.5 rounded-full bg-[#4ff0d1]/10 text-sm text-[#4ff0d1] flex-shrink-0 font-medium"
                  >
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </motion.div>
                </div>

                <div className="flex text-sm w-full mt-3 justify-between text-gray-400">
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    layout
                    className="px-3 py-1.5 rounded-full bg-[#1a2332] text-gray-400 text-sm"
                  >
                    {file.type || 'application/pdf'}
                  </motion.p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Add subtle lighting effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={isHovering ? {
            background: "radial-gradient(circle at var(--x) var(--y), rgba(79,240,209,0.1) 0%, transparent 100%)"
          } : {}}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        />
      </motion.div>
    </div>
  );
};

export function GridPattern() {
  const columns = 41;
  const rows = 11;
  return (
    <div className="flex bg-[#1a2332] flex-shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px scale-105">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <div
              key={`${col}-${row}`}
              className={`w-10 h-10 flex flex-shrink-0 rounded-[2px] ${
                index % 2 === 0
                  ? "bg-[#0d1117]"
                  : "bg-[#0d1117] shadow-[0px_0px_1px_3px_rgba(26,35,50,1)_inset]"
              }`}
            />
          );
        })
      )}
    </div>
  );
}
