import { Loader2 } from "lucide-react";

const SplashScreen = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />

        <h2 className="text-xl font-semibold text-gray-800">Loading...</h2>

        <p className="text-gray-500">
          Please wait while we prepare your workspace.
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
