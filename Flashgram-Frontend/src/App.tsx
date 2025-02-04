import { GridBackgroundDemo } from "./components/Background"
import { Flashcard } from "./components/Flashcards";
import { Navbar } from "./components/Navbar"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { RecoilRoot} from "recoil"
// Target -> add flashcards -> Ques Ans usmein
// Make it flippable to reveal ans
// Make it scrollable -> infinite scroll and then optimise
function App() {
  return <div>
    <RecoilRoot>
    <Router>
      <Routes>
        <Route path ="/" element={< GridBackgroundDemo />} />
        <Route path ="/flashcard" element={< Flashcard />} />
      </Routes>
    </Router>
    </RecoilRoot>
    
  </div>
}

export default App
