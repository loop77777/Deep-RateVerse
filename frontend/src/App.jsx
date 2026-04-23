import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Stores from "./pages/Stores";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/stores" element={<Stores />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;