// import { useAuth } from "@clerk/clerk-react";
import { useGetflashcards } from "../hooks/useGetflashcards";
import { useUpload } from "../hooks/useUpload";
import { useEffect } from "react";
import { loaderAtom } from "@/atoms/dataAtoms";
import RotatingCardsLoader from "./loader";
import { useRecoilValue, useSetRecoilState } from "recoil";
interface uploadResponse{
  msg:string,
  parsedpdf:string
}

export const Uploadpdf = ()=>{ 
  // const {userId} = useAuth() //extracting userId, Token from the clerk 
  // const token = useAuth().getToken() //have to await it, bcz getToken() is a Promise
  const setloader = useSetRecoilState(loaderAtom)
  const loader = useRecoilValue(loaderAtom)
  useEffect(()=>{
    console.log("loader value inside useeffect: ",loader)
  },[loader])
  const uploadpdf = async(pdf:File | null)=>{ //the pdf type can be file or null
    setloader(true) //Show loader while processing
    if(!pdf){
      console.error("No file provided")
      return
    }
    //Pdf exist here
    try{
      
      console.log("loader val inside try block: ",loader)
      const formData = new FormData // creating a new object of formdata, this will handle, fileuploads, we can attach pdf and userId to it, and send it to backend
      formData.append('file',pdf)
      // formData.append("userId",userId as string)
      console.log("formdata: ",formData)
      const response = await useUpload(formData) as uploadResponse
      console.log("Backend response from /upload",response)
      // const data = await (response as Response).json() //jsonified the data
      if(response){
        const flashcards =await useGetflashcards(response?.parsedpdf)
        console.log("flashcards: ",flashcards)
      }
      setloader(false) //Hide loader after successful processing
    }catch(error){
      console.log('error: ',error)
      console.log("Error while sending the pdf to backend")
      setloader(false) //Hide loader incase of error
    }finally{
      setloader(false) //Hide loader after processing
    }
  }
  

  return(
    <div>
      <input type="file" name="file" onClick={()=>{

      }} onChange={(e)=>{
        
        const files = e.target?.files;
        if (files && files.length > 0) {
          
          uploadpdf(files[0]);
        }
      }} />
    </div>
  )
  
}