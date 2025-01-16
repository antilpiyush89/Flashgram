import axios from "axios"

export const useUpload = async (formData:FormData,token:string | null)=>{
  try{
    const response = await axios.post("http://localhost:3000/upload",formData, // Payload containing the file and userId
      {
        headers:{
          authorization:`Bearer ${token}`
        }
      })
      
      
      return response.data
  }catch(e){
    console.log(e)
    console.log("Error while sending the pdf to backend")
    return e
  }

}