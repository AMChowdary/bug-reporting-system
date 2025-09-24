import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProjectIssues from "./pages/ProjectIssues";
import IssueDetail from "./pages/IssueDetail";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("access");
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/projects/:id/issues"
          element={
            <PrivateRoute>
              <ProjectIssues />
            </PrivateRoute>
          }
        />
        <Route
          path="/issues/:id"
          element={
            <PrivateRoute>
              <IssueDetail />
            </PrivateRoute>
          }
        />
        {/* Optional: Redirect root `/` to login */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
