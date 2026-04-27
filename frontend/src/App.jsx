import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Stores from "./pages/Stores";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import OwnerDashboard from "./pages/OwnerDashboard";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* -------- PUBLIC ROUTES -------- */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* -------- PROTECTED ROUTES -------- */}
        <Route 
          path="/stores" 
          element={
            <ProtectedRoute roles={["user", "admin", "owner"]}>
              <Stores />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/admin" 
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/admin/users" 
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminUsers />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/owner" 
          element={
            <ProtectedRoute roles={["owner"]}>
              <OwnerDashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/settings" 
          element={
            <ProtectedRoute roles={["user", "admin", "owner"]}>
              <Settings />
            </ProtectedRoute>
          } 
        />

        {/* 404 Fallback */}
        <Route path="*" element={<div className="min-h-screen flex items-center justify-center"><h1>Page not found</h1></div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;