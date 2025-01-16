
import './App.css'
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { Uploadpdf } from './components/Uploadpdf';



export default function App() {
  return (
    <header>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
        <Uploadpdf/>
      </SignedIn>
    </header>
  );
}