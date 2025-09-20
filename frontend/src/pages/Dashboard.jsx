import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function Dashboard() {
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        API.get("projects/")
        .then((res) => setProjects(res.data))
        .catch(() => alert("Failed to load projects"));
    }, []);

    return (
        <div>
        <h2>Projects</h2>
        <ul>
            {projects.map((p) => (
            <li key={p.id} onClick={() => navigate(`/projects/${p.id}/issues`)}>
                {p.name} - {p.description}
            </li>
            ))}
        </ul>
        </div>
    );
}
