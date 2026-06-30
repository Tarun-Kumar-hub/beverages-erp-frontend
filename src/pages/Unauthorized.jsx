import { ShieldX } from "lucide-react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
        <ShieldX className="mx-auto mb-4 h-16 w-16 text-red-500" />

        <h1 className="mb-2 text-3xl font-bold text-gray-800">
          403 - Unauthorized
        </h1>

        <p className="mb-6 text-gray-600">
          You don't have permission to access this page.
        </p>

        <Link
          to="/admin/dashboard"
          className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
