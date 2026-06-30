import { Building2, Mail, Lock, Sparkles } from "lucide-react";
import LoginForm from "../components/auth/LoginForm";

const Login = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-indigo-600 to-blue-600 px-8 py-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur">
            <Building2 className="h-8 w-8 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-white">Grap Sip ERP</h1>

          <p className="mt-2 text-blue-100">Manufacturing Management System</p>
        </div>

        <div className="p-8">
          {/* Demo Credentials */}
          <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-600" />
              <h2 className="font-semibold text-amber-800">
                Recruiter Demo Access
              </h2>
            </div>

            <p className="mt-2 text-sm text-gray-600">
              Use the demo account below to explore the ERP system.
            </p>

            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm">
                <Mail className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <code className="font-medium">ctarun301@gmail.com</code>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm">
                <Lock className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-xs text-gray-500">Password</p>
                  <code className="font-medium">tarun123</code>
                </div>
              </div>
            </div>
          </div>

          <LoginForm />

          <p className="mt-8 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} Grap Sip ERP. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
