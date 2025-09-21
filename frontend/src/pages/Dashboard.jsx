import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ name: "", description: "" });
  const navigate = useNavigate();

  const fetchProjects = () => {
    API.get("projects/")
      .then((res) => setProjects(res.data))
      .catch(() => alert("Failed to load projects"));
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
    } catch {
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

      <ul>
        {projects.map((p) => (
          <li key={p.id} onClick={() => navigate(`/projects/${p.id}/issues`)}>
            {p.name} — {p.description}
          </li>
        ))}
      </ul>
    </div>
  );
}
