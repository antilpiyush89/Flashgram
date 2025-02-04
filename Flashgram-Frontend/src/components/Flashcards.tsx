import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRecoilValue } from "recoil";
import { flashcardAtom } from "@/atoms/dataAtoms";

export const Flashcard = () => {
  const flashcardData = useRecoilValue(flashcardAtom);
  console.log("flashcard value inside flashcard.tsx: ", flashcardData);
  flashcardData.map((element) => {
    console.log(element.Question.text);
    console.log(element.Question.hint);
  });

  return (
    <div>
      {flashcardData.map((element) => {
        return (
          <div className="flex justify-center items-center">
            <Card className="w-96 h-screen py-10">
              <CardHeader>
                <CardTitle>Question</CardTitle>
                <CardDescription>{element.Question.text}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{element.Question.hint}</p>
              </CardContent>
              <CardFooter>
                <p>Scroll Down</p>
              </CardFooter>
            </Card>
          </div>
        );
      })}
    </div>
  );
};
