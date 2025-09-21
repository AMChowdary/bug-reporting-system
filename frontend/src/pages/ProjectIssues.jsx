import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";

export default function ProjectIssues() {
  const { id } = useParams();
  const [issues, setIssues] = useState([]);
  const [newIssue, setNewIssue] = useState({ title: "", description: "", priority: "Medium" });
  const navigate = useNavigate();

  const fetchIssues = () => {
    API.get(`projects/${id}/issues/`)
      .then((res) => setIssues(res.data))
      .catch(() => alert("Failed to load issues"));
  };

  useEffect(() => {
    fetchIssues();
  }, [id]);

  const handleCreateIssue = async (e) => {
    e.preventDefault();
    try {
      await API.post(`projects/${id}/issues/`, newIssue);
      setNewIssue({ title: "", description: "", priority: "Medium" });
      fetchIssues();
    } catch {
      alert("Failed to create issue");
    }
  };

  return (
    <div>
      <Navbar />
      <h2>Issues</h2>

      <form onSubmit={handleCreateIssue}>
        <input
          type="text"
          placeholder="Issue title"
          value={newIssue.title}
          onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newIssue.description}
          onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
        />
        <select
          value={newIssue.priority}
          onChange={(e) => setNewIssue({ ...newIssue, priority: e.target.value })}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <button type="submit">Create Issue</button>
      </form>

      <ul>
        {issues.map((issue) => (
          <li key={issue.id} onClick={() => navigate(`/issues/${issue.id}`)}>
            <strong>{issue.title}</strong> — {issue.status} ({issue.priority})
          </li>
        ))}
      </ul>
    </div>
  );
}
