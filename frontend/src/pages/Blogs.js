import React, { useEffect, useState } from "react";
import { data, useNavigate } from "react-router-dom";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState("");
  const [role, setRole] = useState({ role: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/v1/blogs", {
          credentials: "include",
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to fetch blogs");
        }
        const data = await res.json();
        setBlogs(data.data.blogs);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchBlogs();
  }, []);

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

  const handleView = (id) => {
    navigate(`/blogs/${id}`);
  };

  const handleCreate = () => {
    navigate("/blogs/new");
  };

  const handleLogout = async () => {
    const res = await fetch(`http://localhost:3000/api/v1/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-red-300 p-8 relative">
      {/* Logout Button at Top Right */}
      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded transition duration-300"
      >
        Logout
      </button>

      <div className="max-w-4xl mx-auto mt-20 bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-center">All Blogs</h2>

        {role === "Admin" && (
          <div className="flex justify-end mb-6">
            <button
              onClick={handleCreate}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-300"
            >
              Create New Blog
            </button>
          </div>
        )}
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <div className="max-h-[380px] overflow-y-auto scrollbar-hide">
          <ul className="space-y-4">
            {blogs.map((blog) => (
              <li
                key={blog.id}
                className="p-4 border rounded hover:bg-gray-50 transition"
              >
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">{blog.title}</span>
                  <button
                    onClick={() => handleView(blog.id)}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-3 rounded transition duration-300"
                  >
                    View
                  </button>
                </div>

                <p className="text-gray-700 mt-2">
                  {blog.content.length > 80
                    ? `${blog.content.slice(0, 80)}...`
                    : blog.content}
                  {blog.content.length > 80 && (
                    <button
                      onClick={() => handleView(blog.id)}
                      className="text-blue-500 ml-2 underline"
                    >
                      See More
                    </button>
                  )}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Blogs;
