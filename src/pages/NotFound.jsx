import { FileQuestion } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
        <FileQuestion className="mx-auto mb-4 h-16 w-16 text-blue-500" />

        <h1 className="mb-2 text-4xl font-bold text-gray-800">404</h1>

        <p className="mb-6 text-gray-600">
          The page you are looking for doesn't exist.
        </p>

        <Link
          to="/admin/dashboard"
          className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
