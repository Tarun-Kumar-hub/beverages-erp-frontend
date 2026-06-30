import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

import { useLogout } from "../../hooks/auth/useLogout";
import {
  LayoutDashboard,
  Package,
  FlaskConical,
  Factory,
  ShoppingCart,
  Users,
  Boxes,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  History,
  Menu,
  X,
} from "lucide-react";

const MenuItem = ({ to, icon: Icon, label, collapsed, onClick }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `
        flex
        items-center
        gap-3
        p-3
        rounded-xl
        transition-all
        relative
        group

        ${
          isActive
            ? "bg-gray-800 border-l-4 border-blue-500"
            : "hover:bg-gray-800"
        }
      `
      }
    >
      <Icon size={18} />

      {!collapsed && <span className="font-medium">{label}</span>}

      {collapsed && (
        <span
          className="
            absolute
            left-14
            bg-black
            text-white
            text-xs
            px-2
            py-1
            rounded
            opacity-0
            group-hover:opacity-100
            whitespace-nowrap
            z-50
          "
        >
          {label}
        </span>
      )}
    </NavLink>
  );
};

export default function Sidebar() {
  const location = useLocation();

  const { mutate: logout, isPending } = useLogout();

  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem("sidebar") === "true";
  });

  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("sidebar", collapsed);
  }, [collapsed]);

  // Close drawer after navigation

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const effectiveCollapsed = collapsed && window.innerWidth >= 1024;
  return (
    <>
      {/* MOBILE TOPBAR */}

      <div
        className="
          lg:hidden
          fixed
          top-0
          left-0
          right-0
          h-16
          bg-gray-900
          text-white
          flex
          items-center
          justify-between
          px-4
          z-50
          shadow-lg
        "
      >
        <h1 className="font-bold text-lg">GrabSip</h1>

        <button onClick={() => setMobileOpen(true)}>
          <Menu size={24} />
        </button>
      </div>

      {/* OVERLAY */}

      {mobileOpen && (
        <div
          className="
            lg:hidden
            fixed
            inset-0
            bg-black/50
            z-40
          "
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* SIDEBAR */}

      <div
        className={`
          fixed
          lg:sticky
          top-0
          left-0
          z-50
          h-screen

          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}

          ${collapsed ? "lg:w-16" : "lg:w-64"}

          w-64

          bg-gray-900
          text-white

          flex
          flex-col

          transition-all
          duration-300
        `}
      >
        {/* TOP */}

        <div
          className="
            p-4
            flex
            justify-between
            items-center
            border-b
            border-gray-700
          "
        >
          <span
            className={`
    font-bold
    text-xl
    ${effectiveCollapsed ? "lg:hidden" : ""}
  `}
          >
            GrabSip
          </span>

          <div className="flex items-center gap-2">
            {/* Desktop collapse */}

            <button
              onClick={() => setCollapsed((prev) => !prev)}
              className="
                hidden
                lg:block
                p-1
                hover:bg-gray-800
                rounded
              "
            >
              {collapsed ? (
                <ChevronRight size={18} />
              ) : (
                <ChevronLeft size={18} />
              )}
            </button>

            {/* Mobile close */}

            <button onClick={() => setMobileOpen(false)} className="lg:hidden">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* MENU */}

        <div className="flex-1 overflow-y-auto sidebar-scroll p-3 space-y-2">
          <MenuItem
            to="/admin/dashboard"
            icon={LayoutDashboard}
            label="Dashboard"
            collapsed={effectiveCollapsed}
            onClick={() => setMobileOpen(false)}
          />

          {!effectiveCollapsed && (
            <div className="text-xs text-gray-400 px-2 mt-4">INVENTORY</div>
          )}

          <MenuItem
            to="/admin/materials"
            icon={Package}
            label="Raw Materials"
            collapsed={effectiveCollapsed}
            onClick={() => setMobileOpen(false)}
          />

          <MenuItem
            to="/admin/recipes"
            icon={FlaskConical}
            label="Recipes"
            collapsed={effectiveCollapsed}
            onClick={() => setMobileOpen(false)}
          />

          <MenuItem
            to="/admin/containers"
            icon={Factory}
            label="Containers"
            collapsed={effectiveCollapsed}
            onClick={() => setMobileOpen(false)}
          />

          <MenuItem
            to="/admin/packaging"
            icon={Boxes}
            label="Packaging"
            collapsed={effectiveCollapsed}
            onClick={() => setMobileOpen(false)}
          />

          <MenuItem
            to="/admin/inventory-history"
            icon={History}
            label="Inventory History"
            collapsed={effectiveCollapsed}
            onClick={() => setMobileOpen(false)}
          />

          {!effectiveCollapsed && (
            <div className="text-xs text-gray-400 px-2 mt-4">SALES</div>
          )}

          <MenuItem
            to="/admin/stock"
            icon={Package}
            label="Product Stock"
            collapsed={effectiveCollapsed}
            onClick={() => setMobileOpen(false)}
          />

          <MenuItem
            to="/admin/customers"
            icon={Users}
            label="Customers"
            collapsed={effectiveCollapsed}
            onClick={() => setMobileOpen(false)}
          />

          <MenuItem
            to="/admin/orders"
            icon={ShoppingCart}
            label="Orders"
            collapsed={effectiveCollapsed}
            onClick={() => setMobileOpen(false)}
          />
        </div>

        {/* FOOTER */}

        <div className="p-3 border-t border-gray-700 space-y-2">
          {/* <button
            className="
              w-full
              flex
              items-center
              gap-3
              p-3
              rounded-xl
              hover:bg-gray-800
            "
          >
            <Settings size={18} />
            {!effectiveCollapsed && "Settings"}
          </button> */}
          <button
            onClick={() => logout()}
            disabled={isPending}
            className="
    w-full
    flex
    items-center
    gap-3
    p-3
    rounded-xl
    hover:bg-red-600
    disabled:opacity-50
    disabled:cursor-not-allowed
  "
          >
            <LogOut size={18} />
            {!effectiveCollapsed && (isPending ? "Logging out..." : "Logout")}
          </button>
        </div>
      </div>
    </>
  );
}
