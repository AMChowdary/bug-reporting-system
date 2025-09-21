import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/");
  };

  return (
    <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
      <button onClick={() => navigate("/dashboard")}>Dashboard</button>
      <button onClick={handleLogout} style={{ marginLeft: "10px" }}>Logout</button>
    </nav>
  );
}
