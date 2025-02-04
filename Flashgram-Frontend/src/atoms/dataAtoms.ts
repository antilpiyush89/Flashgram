import { QAArray } from "@/components/Upload";
import { atom } from "recoil";

export const flashcardAtom = atom<QAArray[]>({
  key: "flashcardAtom",
  default: []
})
export const loaderAtom = atom<boolean>({
  key: "loader",
  default: false
})