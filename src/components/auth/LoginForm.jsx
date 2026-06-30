import { useState, useEffect } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";

import { useLogin } from "../../hooks/auth/useLogin";

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/admin/dashboard";

  const { mutate: login, isPending } = useLogin();

  const [showPassword, setShowPassword] = useState(false);
  const [showDelayMessage, setShowDelayMessage] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    let timer;

    if (isPending) {
      timer = setTimeout(() => {
        setShowDelayMessage(true);
      }, 5000);
    } else {
      setShowDelayMessage(false);
    }

    return () => clearTimeout(timer);
  }, [isPending]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { email, password } = formData;

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!password.trim()) {
      toast.error("Password is required");
      return;
    }

    login(formData, {
      onSuccess: () => {
        toast.success("Welcome back!");

        navigate(from, {
          replace: true,
        });
      },

      onError: (error) => {
        toast.error(error.response?.data?.message || "Login failed");
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="email" className="mb-2 block font-medium">
          Email
        </label>

        <input
          id="email"
          type="email"
          name="email"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block font-medium">
          Password
        </label>

        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="w-full rounded-lg border px-4 py-3 pr-12 outline-none focus:border-blue-500"
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="flex w-full items-center justify-center rounded-lg bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Signing In...
          </>
        ) : (
          "Sign In"
        )}
      </button>

      {showDelayMessage && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <p className="font-semibold">Starting the server...</p>
          <p className="mt-1">
            This application is hosted on Render's free tier. The first request
            after a period of inactivity may take up to 60 seconds while the
            server starts.
          </p>
        </div>
      )}
    </form>
  );
};

export default LoginForm;
