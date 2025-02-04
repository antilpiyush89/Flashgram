import { QAArray } from "@/components/Upload";
import { atom } from "recoil";

export const flashcardAtom = atom<QAArray[]>({
  key: "flashcardAtom",
  default: []
})