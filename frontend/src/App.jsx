import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Stores from "./pages/Stores";
import AdminDashboard from "./pages/AdminDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* -------- PUBLIC ROUTES -------- */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* -------- USER ROUTES -------- */}
        <Route path="/stores" element={
          <ProtectedRoute roles={["user", "admin", "owner"]}>
            <Layout>
              <Stores />
            </Layout>
          </ProtectedRoute>
        } />

        {/* -------- ADMIN ROUTES -------- */}
        <Route path="/admin" element={
          <ProtectedRoute roles={["admin"]}>
            <Layout>
              <AdminDashboard />
            </Layout>
          </ProtectedRoute>
        } />

        {/* -------- OWNER ROUTES -------- */}
        <Route path="/owner" element={
          <ProtectedRoute roles={["owner"]}>
            <Layout>
              <OwnerDashboard />
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;