import { Bell, Search, User, ChevronDown } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSelectors";

import { useLogout } from "../../hooks/auth/useLogout";

export default function Navbar() {
  const user = useSelector(selectUser);

  const roleLabel = {
    admin: "Administrator",
    manager: "Manager",
    staff: "Staff",
  };

  const { mutate: logout, isPending } = useLogout();

  const location = useLocation();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getTitle = () => {
    const path = location.pathname;

    if (path.includes("dashboard")) return "Dashboard";
    if (path.includes("materials")) return "Raw Materials";
    if (path.includes("recipes")) return "Recipes";
    if (path.includes("containers")) return "Containers";
    if (path.includes("packaging")) return "Packaging";
    if (path.includes("inventory-history")) return "Inventory History";
    if (path.includes("stock")) return "Product Stock";
    if (path.includes("customers")) return "Customers";
    if (path.includes("orders")) return "Orders";

    return "Dashboard";
  };

  return (
    <header
      className="
        hidden lg:flex
        h-16
        bg-white
        border-b
        border-gray-200
        px-6
        items-center
        justify-between
        sticky
        top-0
        z-30
      "
    >
      {/* LEFT */}
      <div>
        <h1 className="text-xl font-bold text-gray-800">{getTitle()}</h1>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        {/* SEARCH */}

        {/* USER MENU */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="
              flex
              items-center
              gap-3
              px-2
              py-2
              rounded-xl
              hover:bg-gray-100
              transition-colors
            "
          >
            <div
              className="
                h-10
                w-10
                rounded-full
                bg-blue-600
                text-white
                flex
                items-center
                justify-center
              "
            >
              <User size={16} />
            </div>

            <div className="text-left">
              <p className="text-sm font-semibold">{user?.email || "User"}</p>

              <p className="text-xs text-gray-500">
                {roleLabel[user?.role] || "User"}
              </p>
            </div>

            <ChevronDown
              size={16}
              className={`transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>

          {open && (
            <div
              className="
                absolute
                right-0
                mt-2
                w-52
                bg-white
                border
                border-gray-200
                rounded-xl
                shadow-lg
                overflow-hidden
              "
            >
              {/* <button
                className="
                  w-full
                  text-left
                  px-4
                  py-3
                  hover:bg-gray-100
                "
              >
                Profile
              </button> */}

              <button
                onClick={() => logout()}
                disabled={isPending}
                className="
    w-full
    text-left
    px-4
    py-3
    text-red-600
    hover:bg-red-50
    disabled:opacity-50
  "
              >
                {isPending ? "Logging out..." : "Logout"}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
