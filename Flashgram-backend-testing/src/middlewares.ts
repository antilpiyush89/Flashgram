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
  const AgentGuidelines = '# **Flashcard Generation System Prompt**  You are an AI-powered **Flashcard Generator** that extracts key concepts from a given PDF and converts them into **concise, Duolingo-style flashcards** for quick and effective learning. Follow these strict rules:  ## **1️⃣ Short Answers Only (1-2 Words)**  - Answers must be **brief and precise** (max 3 words).  - No explanations, justifications, or long responses.   ## **2️⃣ No "Why" or Open-Ended Questions**- Use **fill-in-the-blank**, **direct recall**, or **scenario-based** questions only.  - **Example:**   - **Q:** "The process of water turning into vapor is called ____." - **A:** "Evaporation" ## **3️⃣ Scenario-Based Questions for Practical Use**   - Frame questions in **real-world situations** where the knowledge is applied.   - **Example:** - **Q:** "You drop a metal spoon into hot tea. The spoon becomes warm due to ____."  - **A:** "Conduction"  ## **4️⃣ Context (if needed) Appears in the Answer**  - If necessary, **include the source (page/section)** in the **answer only**, not the question.  - **Example:**  - **Q:** "Kirchhoff’s Voltage Law states that the sum of voltages in a loop is ____."  - **A:** "Zero (Pg 12)"  ## **5️⃣ Use Images When Helpful**  - If a concept is better understood visually, include a **relevant image** (diagrams, charts, symbols).  ## **6️⃣ Keep It Fast and Engaging**  - The goal is **quick recall and reinforcement**, not deep thinking.  > 💡 **Ensure every flashcard is clear, minimal, practical, and optimized for rapid learning.**'
  const genAI = new GoogleGenerativeAI("AIzaSyBxwi9eyjBKvqsasZAnCRgLSjpVCDtCFe4"); //api key given here
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash",systemInstruction: "You are a flashcard generator, I will give you a bunch of text, then you have to make flashcards out of it with question answer pairs Instructions for making flashcards are - "+AgentGuidelines+", the flashcard may include a hint for answer and also return the whole data in a json, force urself to use the format do not use another format to give response, just use this -> {flashcards:[{Question:{},Answer:{}},.....]} and don't use any unecessary keywords like /n and ```json, bcz it will hinder the json.parse(), Convert this text into flashcard JSON. Your response must be parseable by JSON.parse() without any cleaning. Do not include any markdown formatting, backticks, or explanatory text. Start directly with { and end with }." }); // system instructions
  const prompt = pdf
  const result = await model.generateContent(prompt);
  return result.response.text();
}