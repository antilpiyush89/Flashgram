import React from "react";
import { FlipWords } from "../ui/flip-words";

export function FlipWordsDemo() {
  const words = ["Efficiently", "Uniquely", "Better", "Easily"];

  return (
    <div className="h-[28rem] flex justify-center items-center px-4">
      <div className="text-4xl md:text-5xl mx-auto font-bold text-gray-700 dark:text-gray-200 text-center">
        Learn
        <FlipWords words={words} /> <br />
        While Scrolling Flashcards
      </div>
    </div>
  );
}
