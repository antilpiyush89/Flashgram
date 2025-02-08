//random shit


import express from "express"
import multer from "multer";
import { pdfloader,llmAnswer } from "./middlewares";
import fs from "fs"
// import { clerkMiddleware,requireAuth,getAuth } from '@clerk/express'
import cors from "cors"
import { error } from "console";

const upload = multer({ dest: "./src/pdf" });
const app = express()
app.use(express.json())
// app.use(clerkMiddleware())
app.use(cors());



// The clerkMiddleware() checks for session JWT in cookies and headers, and if found, attaches the Auth object to the request
// 2. This means when a user returns to your platform, as long as they have a valid session, Clerk will automatically handle the authentication and provide you their userId through the Auth object.



let parsedpdf: string | null = null
let pdfpath : string | undefined = undefined
app.post("/upload",upload.single('file'), async (req,res) => { //requireAuth redirect unsigned user to signup page, if they visit a protected endpoint
  try{
    // const { userId } = getAuth(req)
     console.log("file: ",req.file)
     pdfpath = req.file?.path
     console.log("pdfpath: ",pdfpath)
     parsedpdf = await pdfloader(pdfpath) //req.file contains the metadata like the file path,encoding,type and n other things, req.file?.path stores file path, where it is getting stored
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
  console.log('pdfpath: ',pdfpath)
  try{
    console.log('pdfpath: ',pdfpath)
    // const { userId } = getAuth(req)
    const rawanswer= await llmAnswer(parsedpdf) // is a json
    console.log("rawanswer: ",rawanswer)
    // Example usage:
    // const apiResponse = rawanswer; // The raw Gemini API response
    const formattedFlashcards = JSON.parse(rawanswer)
    console.log("formattedFlashcard",formattedFlashcards)
    if(formattedFlashcards){
      console.log('pdfpath: ',pdfpath)
      // Deleting the file after gen flashcards
      if(pdfpath && fs.existsSync(pdfpath)){
        fs.unlink(pdfpath,(error)=>{
          if(error){
            console.log('failed to delete the file: ',error)
          }else{
            console.log("file deleted successfully")
          }
        })
      }
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
    if(pdfpath && fs.existsSync(pdfpath)){
      fs.unlink(pdfpath,(error)=>{
        if(error){
          console.log('failed to delete the file: ',error)
        }else{
          console.log("file deleted successfully")
        }
      })
    }
    console.log("error is: ",e)
    res.status(500).json({
      error:e,
      msg:"No flashcard available"
    })
  }
})

app.listen(3000)


// function ClerkExpressWithAuth(arg0: {
//   publishableKey: string | undefined; // Use the publishable key
//   apiKey: string | undefined;
// }): any {
//   throw new Error("Function not implemented.");
// }