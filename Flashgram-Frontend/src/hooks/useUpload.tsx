import axios from "axios"

export const useUpload = async (formData:FormData)=>{
  try{
    const response = await axios.post("http://localhost:3000/upload",formData)
      
      
      return response.data
  }catch(e){
    console.log(e)
    console.log("Error while sending the pdf to backend")
    return e
  }

}