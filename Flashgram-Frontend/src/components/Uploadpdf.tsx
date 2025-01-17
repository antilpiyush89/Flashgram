// import { useAuth } from "@clerk/clerk-react";
import { useUpload } from "../hooks/useUpload";


export const Uploadpdf = ()=>{ 
  // const {userId} = useAuth() //extracting userId, Token from the clerk 
  // const token = useAuth().getToken() //have to await it, bcz getToken() is a Promise
  const uploadpdf = async(pdf:File | null)=>{ //the pdf type can be file or null
    if(!pdf){
      console.error("No file provided")
      return
    }
    //Pdf exist here
    try{
      
      const formData = new FormData // creating a new object of formdata, this will handle, fileuploads, we can attach pdf and userId to it, and send it to backend
      formData.append('file',pdf)
      // formData.append("userId",userId as string)
      console.log("formdata: ",formData)
      const response = useUpload(formData)
      console.log("Backend response from /upload",response) 
    }catch(error){
      console.log('error: ',error)
      console.log("Error while sending the pdf to backend")
    }
  }
  

  return(
    <div>
      <input type="file" name="file" onChange={(e)=>{ 
        const files = e.target?.files;
        if (files && files.length > 0) {
          uploadpdf(files[0]);
        }
      }} />
    </div>
  )
  
}