import Sidebar from "../components/admin/Siderbar";
import Navbar from "../components/admin/Navbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col lg:ml-16">
        <Navbar />

        <main
          className="
            flex-1
            p-4
            mt-16
            lg:mt-0
          "
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
