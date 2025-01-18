import axios from "axios"

export const useGetflashcards = async (parsedpdf:any)=>{
  try{
    const response = await axios.get("http://localhost:3000/urFlashcards",parsedpdf)
      return response.data
  }catch(e){
    console.log(e)
    console.log("Error while sending the pdf to backend")
    return e
  }

}