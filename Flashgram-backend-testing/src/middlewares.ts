import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Request,Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function pdfloader(pdf:any){
  const pdftoparse = pdf
  const loader = new PDFLoader(pdftoparse)
  const docs = await loader.load()
  console.log("docs: ",docs[0])
  return docs[0].pageContent
}

export async function llmAnswer(pdf:any){
  const genAI = new GoogleGenerativeAI("AIzaSyBxwi9eyjBKvqsasZAnCRgLSjpVCDtCFe4"); //api key given here
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash",systemInstruction: "You are a flashcard generator, I will give you a bunch of text, then you have to make flashcards out of it with question answer pairs, the flashcard may include a hint for answer and also return the whole data in a json, where it is like this -> flashcards:[{Question:{},Answer:{}},.....] and don't use any unecessary keywords like /n and ```json, bcz it will hinder the json.parse()" }); // system instructions
  const prompt = pdf
  const result = await model.generateContent(prompt);
  return result.response.text();
}