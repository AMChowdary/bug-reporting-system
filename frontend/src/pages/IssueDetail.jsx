import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";

export default function IssueDetail() {
  const { id } = useParams(); // issue ID
  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    API.get(`issues/${id}/`)
      .then((res) => setIssue(res.data))
      .catch(() => alert("Failed to load issue"));

    API.get(`issues/${id}/comments/`)
      .then((res) => setComments(res.data))
      .catch(() => alert("Failed to load comments"));
  }, [id]);

  const handleAddComment = async () => {
    try {
      const res = await API.post(`issues/${id}/comments/`, { content: newComment });
      setComments([...comments, res.data]);
      setNewComment("");
    } catch (err) {
      alert("Failed to add comment");
    }
  };

  if (!issue) return <p>Loading...</p>;

  return (
    <div>
      <Navbar />
      <h2>{issue.title}</h2>
      <p>{issue.description}</p>
      <p>Status: {issue.status} | Priority: {issue.priority}</p>

      <h3>Comments</h3>
      <ul>
        {comments.map((c) => (
          <li key={c.id}>{c.content} — by {c.author}</li>
        ))}
      </ul>

      <input
        type="text"
        placeholder="Add comment"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      />
      <button onClick={handleAddComment}>Add</button>
    </div>
  );
}
