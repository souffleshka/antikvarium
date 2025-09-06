import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import LotDetails from "./pages/LotDetails";
import AdminPanel from "./pages/AdminPanel";
import CreateLot from "./pages/CreateLot";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/lot/:lotId" element={<LotDetails />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/create-lot" element={<CreateLot />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
