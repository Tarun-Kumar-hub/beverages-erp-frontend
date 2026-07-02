import { useEffect, useState } from "react";
import axios from "axios";
import { Building2, Mail, Lock, Loader2, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";

const Login = () => {
  const [serverReady, setServerReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const wakeServer = async () => {
      try {
        await axios.get(`${import.meta.env.VITE_API_URL}/keep-aliv`);

        if (mounted) {
          setServerReady(true);
        }
      } catch {
        if (mounted) {
          setTimeout(wakeServer, 5000);
        }
      }
    };

    wakeServer();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-slate-50 to-blue-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/15">
            <Building2 className="h-8 w-8 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-white">Grap Sip ERP</h1>

          <p className="mt-2 text-sm text-blue-100">
            Enterprise Resource Planning
          </p>
        </div>

        <div className="p-8">
          {/* Demo Credentials */}
          <div className="mb-8 rounded-xl border border-gray-200 bg-gray-50 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-indigo-600" />

                <h2 className="font-semibold text-gray-800">
                  Demo Credentials
                </h2>
              </div>

              <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
                Recruiter
              </span>
            </div>

            <p className="mt-2 text-sm text-gray-500">
              Use the credentials below to explore the ERP system.
            </p>

            <div className="mt-5 space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />

                <div>
                  <p className="text-xs text-gray-500">Email</p>

                  <code className="text-sm font-semibold text-gray-800">
                    demo@gmail.com
                  </code>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-gray-400" />

                <div>
                  <p className="text-xs text-gray-500">Password</p>

                  <code className="text-sm font-semibold text-gray-800">
                    demo123
                  </code>
                </div>
              </div>
            </div>

            {!serverReady && (
              <div className="mt-5 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />

                  <span className="font-medium text-blue-900">
                    Preparing demo environment...
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-blue-100">
                  <div className="h-full w-1/2 animate-pulse rounded-full bg-blue-600" />
                </div>

                <p className="mt-3 text-sm text-blue-700">
                  This demo is hosted on Render's free tier. The first visit may
                  take up to 60 seconds.
                </p>
              </div>
            )}
          </div>

          <LoginForm disabled={!serverReady} />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-indigo-600 transition hover:text-indigo-700 hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>

          <p className="mt-8 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} Grap Sip ERP. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
