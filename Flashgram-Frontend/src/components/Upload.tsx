"use client";
import React, { useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { FileUpload } from "../ui/file-upload";
import { motion } from "framer-motion";
import { useUpload } from "../hooks/useUpload";
import { useGetflashcards } from "../hooks/useGetflashcards";
import { flashcardAtom } from "@/atoms/dataAtoms";
import { useSetRecoilState,useRecoilValue } from "recoil";
import { loaderAtom } from "@/atoms/dataAtoms";

interface uploadResponse{
  msg:string,
  parsedpdf:string
}


interface flashcardResponse{
    formattedFlashcards:{
      flashcards:QAArray[]
    },
    rawanswer:string
      
}

export interface QAArray{
  Question:{
    text:string,
    hint:string
  },
  Answer:{
    text:string
  }
}

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
  const setFlashcards = useSetRecoilState(flashcardAtom)
  const flashcardval = useRecoilValue(flashcardAtom)
  const setLoader = useSetRecoilState(loaderAtom)
  const navigate = useNavigate()
  // Recoil updates the atoms asynchronously, so we need to use useEffect to see the updated value

  useEffect(()=>{
    //only go to /flashcard if flashcardval is not empty
    if(flashcardval.length>0){
      console.log("flashcard val inside atom: ",flashcardval)
      setLoader(false)
      navigate("/flashcard")
    }

  },[flashcardval])


  const uploadpdf = async(pdf:File | null)=>{ //the pdf type can be file or null
    if(!pdf){
      console.error("No file provided")
      return
    }
    //Pdf exist here
    try{
      setLoader(true)
      const formData = new FormData // creating a new object of formdata, this will handle, fileuploads, we can attach pdf and userId to it, and send it to backend
      formData.append('file',pdf)
      console.log("above setflashcard")
      console.log("below setflashcard")
      // formData.append("userId",userId as string)
      // console.log("formdata: ",formData)
      const response = await useUpload(formData) as uploadResponse
      // console.log("Backend response from /upload",response)
      // const data = await (response as Response).json() //jsonified the data
      if(response){
        const flashcardsJSON =await useGetflashcards(response?.parsedpdf) as flashcardResponse
        if(flashcardsJSON){
          console.log(flashcardsJSON.formattedFlashcards.flashcards)
          setFlashcards(flashcardsJSON.formattedFlashcards.flashcards)
          
          // console.log("flashcard val inside atom: ",flashcardval)
      }}
    }catch(error){
      console.log('error: ',error)
      console.log("Error while sending the pdf to backend")
      setLoader(false)
    }
  }
  

  return (
    <div className="relative w-full">
      {/* Main upload container */}
      <div className="w-[50vw] max-w-xl mx-auto min-h-96 border border-dashed bg-white/5 dark:bg-black/5 border-neutral-200 dark:border-neutral-800 rounded-lg backdrop-blur-sm">
        <div className="relative">
          <FileUpload onChange={(files:File[])=>{
        // const files = e.target?.files;
        if (files && files.length > 0) {
          uploadpdf(files[0]);
        }
      }} />
          
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
