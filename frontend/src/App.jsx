import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Stores from "./pages/Stores";
import AdminDashboard from "./pages/AdminDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/stores" element={
          <ProtectedRoute roles={["user", "admin", "owner"]}>
            <Stores />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute roles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        <Route path="/owner" element={
          <ProtectedRoute roles={["owner"]}>
            <OwnerDashboard />
          </ProtectedRoute>
        } />

      </Routes>
    </BrowserRouter>
  );
}

export default App;