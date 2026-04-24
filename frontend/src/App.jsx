import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Auth Pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

// Main Pages with Layout
import Layout from "./components/Layout/Layout";
import Main from "./pages/Main/Main";
import CategoryManage from "./pages/Main/CategoryManage";
import CategoryAddForm from "./pages/Main/CategoryAddForm";
import CategoryEditForm from "./pages/Main/CategoryEditForm";

// Saving Pages
import SavingMain from "./pages/Saving/SavingMain";
import SavingAddForm from "./pages/Saving/SavingAddForm";
import SavingDetail from "./pages/Saving/SavingDetail";

// Report Pages
import Report from "./pages/Report/Report";
import DetailCategory from "./pages/Report/DetailCategory";

// Setting Pages
import Settings from "./pages/Setting/Settings";
import CustomStartDay from "./pages/Setting/CustomStartDay";

// Admin Pages
import UserManagement from "./pages/Admin/UserManagement";
import UserDetail from "./pages/Admin/UserDetail";

// Protected Route Component
import ProtectedRoute from "./components/ProtectedRoute";

// Scroll to Top Component
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes with Layout */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Main/Input Routes */}
          <Route path="/main" element={<Main />} />
          <Route path="/category/manage" element={<CategoryManage />} />
          <Route path="/category/add" element={<CategoryAddForm />} />
          <Route path="/category/edit/:id" element={<CategoryEditForm />} />

          {/* Saving Routes */}
          <Route path="/saving" element={<SavingMain />} />
          <Route path="/saving/add" element={<SavingAddForm />} />
          <Route path="/saving/detail/:id" element={<SavingDetail />} />

          {/* Report Routes */}
          <Route path="/report" element={<Report />} />
          <Route
            path="/report/category/:categoryId"
            element={<DetailCategory />}
          />

          {/* Setting Routes */}
          <Route path="/settings" element={<Settings />} />
          <Route
            path="/settings/custom-start-day"
            element={<CustomStartDay />}
          />

          {/* Admin Routes */}
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/users/:userId" element={<UserDetail />} />
        </Route>

        {/* Redirect root to main */}
        <Route path="/" element={<Navigate to="/main" replace />} />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/main" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
