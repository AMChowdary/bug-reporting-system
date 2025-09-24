import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";

export default function ProjectIssues() {
  const { id } = useParams();
  const [issues, setIssues] = useState([]);
  const [newIssue, setNewIssue] = useState({ title: "", description: "", priority: "MEDIUM" });
  const navigate = useNavigate();

  const fetchIssues = () => {
    API.get(`projects/${id}/issues/`)
      .then((res) => setIssues(res.data))
      .catch(() => alert("Failed to load issues"));
  };

  useEffect(() => {
  const fetchIssues = async () => {
  try {
    const res = await API.get(`projects/${id}/issues/`);
    const data = Array.isArray(res.data)
      ? res.data
      : (res.data.results ?? []);  // handles paginated response
    setIssues(data);
  } catch (err) {
    console.error("fetch issues error:", err.response?.data || err);
    alert("Failed to load issues");
  }
};

  fetchIssues();
}, [id]);


  const handleAddIssue = async (e) => {
  e.preventDefault();
  try {
    await API.post(`projects/${id}/issues/`, {
      title: newIssue.title,
      description: newIssue.description,
      priority: newIssue.priority || "Low",
      status: "Open"
    });
    setNewIssue({ title: "", description: "", priority: "Low" });
    fetchIssues();
  } catch (err) {
    console.error("create issue error:", err.response?.data || err);
    alert("Failed to create issue");
  }
};


  return (
    <div>
      <Navbar />
      <h2>Issues</h2>

      <form onSubmit={handleAddIssue}>
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
        <select value={newIssue.priority} onChange={(e) => setNewIssue({ ...newIssue, priority: e.target.value })}>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
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
