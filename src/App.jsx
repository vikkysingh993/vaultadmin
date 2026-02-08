import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UserList from "./pages/UserList";
import TokenList from "./pages/TokenList";
import PlanList from "./pages/PlanList";
import PageList from "./pages/PageList";
import AddPage from "./pages/AddPage";
import EditPage from "./pages/EditPage";
import AdminProfile from "./pages/AdminProfile";
import ChangePassword from "./pages/ChangePassword";
import AdminSettings from "./pages/AdminSettings";
import AdminLayout from "./components/AdminLayout";
import { useAuth } from "./context/AuthContext";
import FaqList from "./pages/FaqList";

function App() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <BrowserRouter basename="/">
      <Routes>
        {/* LOGIN */}
        <Route path="/" element={<Login />} />

        {/* ADMIN */}
        <Route
          path="/"
          element={user ? <AdminLayout /> : <Navigate to="/login" replace />}
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<UserList />} />
          <Route path="tokens" element={<TokenList />} />
          <Route path="plans" element={<PlanList />} />
          <Route path="pages" element={<PageList />} />
          <Route path="pages/add" element={<AddPage />} />
          <Route path="pages/edit/:id" element={<EditPage />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="faqs" element={<FaqList />} />

        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
