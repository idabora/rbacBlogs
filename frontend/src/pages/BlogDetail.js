import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [role, setRole] = useState({ role: "" });
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ title: "", content: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/v1/blogs/${id}`, {
          credentials: "include",
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to fetch blog");
        }
        const data = await res.json();
        console.log(data);
        setBlog(data.data.blog);
        setForm({ title: data.title, content: data.content });
      } catch (err) {
        setError(err.message);
      }
    };
    fetchBlog();
  }, [id]);

  useEffect(() => {
    // Function to get the value of the "role" cookie
    const getRoleCookie = () => {
      const name = "role=";
      const decodedCookie = decodeURIComponent(document.cookie);
      const ca = decodedCookie.split(";");

      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === " ") {
          c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
          return c.substring(name.length, c.length); // Return the role value
        }
      }
      return ""; // Return empty if cookie not found
    };

    // Get the role from the cookie and set it to state
    const roleFromCookie = getRoleCookie();
    setRole(roleFromCookie);
  }, []);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/v1//blogs/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Delete failed");
      }
      navigate("/blogs");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setForm({ title: blog.title, content: blog.content });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3000/api/v1/blogs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");
      setBlog(data);
      setIsEditing(false);
      navigate(0)
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) return <div className="error">{error}</div>;
  if (!blog) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-red-300 p-8">
      <div className="max-w-3xl mx-auto mt-20 bg-white p-8 rounded-lg shadow-md relative">
        {isEditing ? (
          <form onSubmit={handleUpdate} className="space-y-4">
            <input
              type="text"
              name="title"
              defaultValue={blog.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <textarea
              name="content"
              defaultValue={blog.content}
              onChange={handleChange}
              required
              rows="6"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex justify-end space-x-4">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition duration-300"
              >
                Update
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded transition duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <h2 className="text-3xl font-bold mb-8">{blog.title}</h2>
            <p className="text-gray-700 mb-6">{blog.content}</p>

            {/* Date and Created By Section */}
            <div className="absolute top-4 right-4 text-right">
              <div className="mb-0 text-sm text-gray-500">
                {/* Created: {new Date(blog.createdAt).toLocaleString()} */}
                {new Date(blog.createdAt).toLocaleDateString()}{" "}
                {new Date(blog.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <div className="text-md text-gray-600">
                by: {blog.author?.name || "Unknown"}
              </div>
            </div>
            {role === "Admin" && (
              <div className="flex justify-end space-x-4 mt-8">
                <button
                  onClick={handleEdit}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-300"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition duration-300"
                >
                  Delete
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BlogDetail;
