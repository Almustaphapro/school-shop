import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Login = () => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  // Redirect after login
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     if (role === "superadmin") navigate("/super-dashboard", { replace: true });
  //     else if (role === "admin") navigate("/admin", { replace: true }); 
  //     else if (role === "salesrep") navigate("/sales/shop", { replace: true });
  //   }
  // }, [isAuthenticated, role, navigate]);

  const users = [
    { username: "superadmin", password: "1234", role: "superadmin" },
    { username: "admin", password: "1234", role: "admin" },
    { username: "salesrep", password: "1234", role: "salesrep" },
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = (e) => {
  e.preventDefault();

  const user = users.find(
    (u) =>
      u.username === form.username.trim() &&
      u.password === form.password.trim()
  );

  if (!user) {
    setError("Invalid username or password");
    return;
  }

  dispatch(login({ role: user.role, username: user.username }));

  // ✅ MANUAL NAVIGATION HERE
  if (user.role === "superadmin") navigate("/super-dashboard");
  else if (user.role === "admin") navigate("/admin");
  else if (user.role === "salesrep") navigate("/sales");
};
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 shadow-lg rounded-lg w-80"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-2 mb-4 rounded">
            {error}
          </div>
        )}

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
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 w-full rounded transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;