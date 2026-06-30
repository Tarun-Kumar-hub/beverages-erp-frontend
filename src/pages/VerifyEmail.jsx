import { MailCheck } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const VerifyEmail = () => {
  const { state } = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg text-center">
        <div className="flex justify-center mb-5">
          <div className="rounded-full bg-blue-100 p-4">
            <MailCheck className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-800">Verify Your Email</h1>

        <p className="mt-4 text-gray-600">We've sent a verification link to</p>

        <p className="mt-2 font-semibold text-blue-600 break-all">
          {state?.email}
        </p>

        <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4 text-left text-sm text-gray-700">
          <p className="font-medium mb-2">Before you can sign in:</p>

          <ul className="list-disc pl-5 space-y-1">
            <li>Open your email inbox.</li>
            <li>Click the verification link.</li>
            <li>If you don't see the email, check your Spam or Junk folder.</li>
            <li>After verification, return here and sign in.</li>
          </ul>
        </div>

        <Link
          to="/login"
          className="mt-6 inline-block w-full rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-700"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmail;
