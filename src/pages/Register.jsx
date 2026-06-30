import RegisterForm from "../components/auth/RegisterForm";

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Juice ERP</h1>

          <p className="mt-2 text-gray-500">Create your account</p>
        </div>

        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
