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
  const load = async () => {
    try {
      const issueRes = await API.get(`issues/${id}/`);
      setIssue(issueRes.data);
    } catch (err) {
      console.error("load issue:", err);
    }

    try {
      const commentsRes = await API.get(`issues/${id}/comments/`);
      const commentData = Array.isArray(commentsRes.data)
        ? commentsRes.data
        : (commentsRes.data.results ?? []);
      setComments(commentData);
    } catch (err) {
      console.error("load comments:", err);
    }
  };
  load();
}, [id]);

const handleAddComment = async () => {
  try {
    const res = await API.post(`issues/${id}/comments/`, { content: newComment });
    // If backend returns single created comment object:
    if (res.data && res.data.id) {
      setComments((prev) => [...prev, res.data]);
    } else {
      // fallback: re-fetch comments (safe)
      const r = await API.get(`issues/${id}/comments/`);
      setComments(Array.isArray(r.data) ? r.data : (r.data.results ?? []));
    }
    setNewComment("");
  } catch (err) {
    console.error("add comment:", err);
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
        {comments.map(c => (
            <li key={c.id}>{c.content} — by {c.author?.username ?? c.author}</li>
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
