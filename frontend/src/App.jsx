import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProjectIssues from "./pages/ProjectIssues";
import IssueDetail from "./pages/IssueDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects/:id/issues" element={<ProjectIssues />} />
        <Route path="/issues/:id" element={<IssueDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
