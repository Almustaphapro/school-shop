import { useDispatch } from "react-redux";
import { login } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Login = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Dummy users (for now)
  const users = [
    { username: "superadmin", password: "1234", role: "superadmin" },
    { username: "admin", password: "1234", role: "admin" },
    { username: "salesrep", password: "1234", role: "salesrep" },
  ];

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = () => {
    const user = users.find(
      (u) =>
        u.username === form.username &&
        u.password === form.password
    );

    if (!user) {
      alert("Invalid username or password");
      return;
    }

    dispatch(login({ role: user.role, username: user.username }));

    // Role-based navigation
    if (user.role === "superadmin") navigate("/super-dashboard");
    if (user.role === "admin") navigate("/admin-dashboard");
    if (user.role === "salesrep") navigate("/sales/shop");
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-lg w-80">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          className="border p-2 w-full mb-4 rounded"
          value={form.username}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border p-2 w-full mb-4 rounded"
          value={form.password}
          onChange={handleChange}
        />

        <button
          onClick={handleLogin}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 w-full rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;