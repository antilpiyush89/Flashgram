//random shit


import express from "express"
import multer from "multer";
import { pdfloader,llmAnswer } from "./middlewares";
// import { clerkMiddleware,requireAuth,getAuth } from '@clerk/express'
import cors from "cors"

const upload = multer({ dest: "./src/pdf" });
const app = express()
app.use(express.json())
// app.use(clerkMiddleware())
app.use(cors());



// The clerkMiddleware() checks for session JWT in cookies and headers, and if found, attaches the Auth object to the request
// 2. This means when a user returns to your platform, as long as they have a valid session, Clerk will automatically handle the authentication and provide you their userId through the Auth object.



let parsedpdf: string | null = null
app.post("/upload",upload.single('file'), async (req,res) => { //requireAuth redirect unsigned user to signup page, if they visit a protected endpoint
  try{
    // const { userId } = getAuth(req)
    console.log("file: ",req.file)
     parsedpdf = await pdfloader(req.file?.path)
     console.log("parsed pdf: ",parsedpdf)
    if(parsedpdf){
      res.status(200).json({
        msg:"file parsing done",
        parsedpdf:parsedpdf,
        // userId:userId
      })
    }else{
      res.status(405).json({
        msg:"Parsing failed",
        // userId:userId
      })
    }
  }catch(e){
    res.status(500).json({
      error:e,
      msg:"No file uploaded"
    })
  }

});


app.get("/urFlashcards",async(req,res)=>{
  try{
    // const { userId } = getAuth(req)
    const rawanswer= await llmAnswer(parsedpdf) // is a json
    // Example usage:
    // const apiResponse = rawanswer; // The raw Gemini API response
    const formattedFlashcards = JSON.parse(rawanswer)
    console.log("formattedFlashcard",formattedFlashcards)
    if(formattedFlashcards){
      res.status(200).json({
        rawanswer:rawanswer,
        formattedFlashcards:formattedFlashcards
      })
    }else{
      res.status(405).json({
        msg:"Could not generated flashcards, parsing failed"
      })
    }
  }catch(e){
    res.status(500).json({
      error:e,
      msg:"No flashcard available"
    })
  }
})

app.listen(3000)


function ClerkExpressWithAuth(arg0: {
  publishableKey: string | undefined; // Use the publishable key
  apiKey: string | undefined;
}): any {
  throw new Error("Function not implemented.");
}

