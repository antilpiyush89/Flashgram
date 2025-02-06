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
    <div className="relative w-full px-4">
      <div className="max-w-3xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-200 mb-2">
            Upload Your PDF
          </h2>
          <p className="text-gray-400">
            Convert your PDF into interactive flashcards in seconds
          </p>
        </div>
        
        {/* Upload Component */}
        <div className="relative">
          <FileUpload onChange={(files) => {
            if (files && files.length > 0) {
              uploadpdf(files[0]);
            }
          }} />
          
          {/* Decorative Elements */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4ff0d1]/0 via-[#4ff0d1]/10 to-[#4ff0d1]/0 blur-xl opacity-50 -z-10 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
