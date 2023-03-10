import Navbar from "./components/Navbar";
import MintToken from "./pages/MintToken";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import EnterLottery from "./pages/EnterLottery";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<MintToken />} />
        <Route path="/enter-lottery" element={<EnterLottery />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
