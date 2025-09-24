import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get("projects/");
      // support both plain-array and paginated response
      const data = Array.isArray(res.data) ? res.data : (res.data.results ?? []);
      setProjects(data);
    } catch (err) {
      console.error("fetchProjects error:", err);
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await API.post("projects/", newProject);
      setNewProject({ name: "", description: "" });
      fetchProjects();
    } catch (err) {
      console.error("create project error:", err);
      alert("Failed to create project");
    }
  };

  return (
    <div>
      <Navbar />
      <h2>Projects</h2>

      <form onSubmit={handleCreateProject}>
        <input
          type="text"
          placeholder="Project name"
          value={newProject.name}
          onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newProject.description}
          onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
        />
        <button type="submit">Create Project</button>
      </form>

      {loading ? (
        <p>Loading projects...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <ul>
          {projects.map((p) => (
            <li key={p.id} onClick={() => navigate(`/projects/${p.id}/issues`)}>
              {p.name} — {p.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
