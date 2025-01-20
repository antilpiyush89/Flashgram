"use client";
import React, { useState } from "react";
import { FileUpload } from "../ui/file-upload";
import { motion } from "framer-motion";

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

export function FileUploadDemo() {
  const [files, setFiles] = useState<File[]>([]);
  const handleFileUpload = (files: File[]) => {
    setFiles(files);
    console.log(files);
  };

  return (
    <div className="relative w-full">
      {/* Main upload container */}
      <div className="w-[50vw] max-w-xl mx-auto min-h-96 border border-dashed bg-white/5 dark:bg-black/5 border-neutral-200 dark:border-neutral-800 rounded-lg backdrop-blur-sm">
        <div className="relative">
          <FileUpload onChange={handleFileUpload} />
          
          {/* Inner Animated Border */}
          <motion.div
            initial="initial"
            animate="animate"
            className="absolute inset-0 z-0"
          >
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <motion.rect
                x="0"
                y="0"
                width="100"
                height="100"
                rx="6"
                stroke="url(#inner-blue-glow)"
                strokeWidth="1"
                variants={innerBorderVariant}
                className="w-full h-full shadow-[0_0_15px_rgba(96,165,250,0.5)]"
                style={{
                  filter: "drop-shadow(0 0 8px #60A5FA)",
                }}
              />
              <defs>
                <linearGradient
                  id="inner-blue-glow"
                  x1="0"
                  y1="0"
                  x2="100"
                  y2="100"
                >
                  <stop offset="0%" stopColor="#93C5FD" />
                  <stop offset="50%" stopColor="#60A5FA" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
