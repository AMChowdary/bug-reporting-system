import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProjectIssues from "./pages/ProjectIssues";
import IssueDetail from "./pages/IssueDetail";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("access");
  return token ? children : <Navigate to="/" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/projects/:id/issues" element={<PrivateRoute><ProjectIssues /></PrivateRoute>} />
        <Route path="/issues/:id" element={<PrivateRoute><IssueDetail /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
