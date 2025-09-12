import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/router";

const Login = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const email = formData.get("email")?.trim();
    const password = formData.get("password")?.trim();

    const newErrors = {};
    if (!email) newErrors.email = "Email is required.";
    if (!password) newErrors.password = "Password is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ general: data.message || "Invalid email or password" });
        setLoading(false);
        return;
      }

      sessionStorage.setItem("token", data.token);

      setTimeout(() => {
        setLoading(false);
        router.push("/dashboard/new");
      }, 1500);
    } catch (err) {
      console.error("Login failed:", err);
      setErrors({ general: err.message || "Something went wrong" });
      setLoading(false);
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-blue-900 to-blue-600">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-sm md:max-w-[420px]">
        <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">
          Mirror
        </h2>
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 ${errors.email
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
                }`}
              disabled={loading}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-gray-700 font-semibold mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 pr-10 ${errors.password
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
                }`}
              disabled={loading}
            />
            <button
              type="button"
              className="absolute top-8 right-3 text-gray-600 hover:text-gray-800"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">{errors.password}</p>
            )}
          </div>

          {/* General Error */}
          {errors.general && (
            <div className="p-2 text-sm bg-red-100 text-red-600 rounded-md">
              {errors.general}
            </div>
          )}

          {/* Submit */}
          <div className="pt-2"> {/* adds some space above the button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 text-sm"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

Login.noLayout = true;
export default Login;
