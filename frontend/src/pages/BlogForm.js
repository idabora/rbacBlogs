import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const BlogForm = () => {
  const { id } = useParams();
  const [form, setForm] = useState({ title: "", content: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      const fetchBlog = async () => {
        try {
          const res = await fetch(`/blogs/${id}`, { credentials: "include" });
          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message || "Failed to fetch blog");
          }
          const data = await res.json();
          setForm({ title: data.title, content: data.content });
        } catch (err) {
          setError(err.message);
        }
      };
      fetchBlog();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(
        isEdit
          ? `http://localhost:3000/api/v1/blogs/${id}`
          : "http://localhost:3000/api/v1//blogs",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
          credentials: "include",
        }
      );
      const data = await res.json();
      console.log(data);
      if (!res.ok)
        throw new Error(
          data.message || (isEdit ? "Update failed" : "Create failed")
        );

      navigate(isEdit ? `/blogs/${id}` : "/blogs");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-red-300 p-8 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-center">
          {isEdit ? "Edit Blog" : "Create Blog"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <textarea
            name="content"
            placeholder="Content"
            value={form.content}
            onChange={handleChange}
            required
            rows="6"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          />

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-300"
          >
            {isEdit ? "Update" : "Create"}
          </button>

          {error && (
            <div className="text-red-500 text-center mt-2">{error}</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default BlogForm;
