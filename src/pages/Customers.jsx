import { useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "../components/common/Pagination";

import { useCustomers } from "../hooks/customers/useCustomers";
import { useSearchCustomers } from "../hooks/customers/useSearchCustomers";
import { useDeleteCustomer } from "../hooks/customers/useDeleteCustomer";

import {
  Users,
  Search,
  Trash2,
  Eye,
  Plus,
  BadgeIndianRupee,
  X,
} from "lucide-react";

export default function Customers() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  // =====================================
  // FETCH CUSTOMERS
  // =====================================

  const { data, isLoading } = useCustomers({
    page,
    limit: 10,
  });
  // =====================================
  // SEARCH CUSTOMERS
  // =====================================
  const { data: searchData, isLoading: searchLoading } = useSearchCustomers({
    q: search,
    page,
    limit: 10,
  });

  // =====================================
  // DELETE CUSTOMER
  // =====================================
  const deleteMutation = useDeleteCustomer();
  const handleDelete = (id) => {
    if (!window.confirm("Delete this customer?")) {
      return;
    }

    deleteMutation.mutate(id);
  };
  // =====================================
  // TOTALS
  // =====================================

  const customers = search
    ? searchData?.customers || []
    : data?.customers || [];

  const totalPages = search
    ? searchData?.totalPages || 1
    : data?.totalPages || 1;

  const totalCustomers = search ? searchData?.total || 0 : data?.total || 0;

  const totalCredit = customers.reduce(
    (acc, item) => acc + Number(item.credit_limit || 0),
    0,
  );

  const loading = search ? searchLoading : isLoading;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Customers
          </h1>

          <p className="text-sm md:text-base text-gray-500 mt-1">
            Manage your customer database
          </p>
        </div>

        <Link
          to="/admin/customers/create"
          className="
      w-full
      sm:w-auto
      flex
      items-center
      justify-center
      gap-2
      bg-blue-600
      hover:bg-blue-700
      text-white
      px-5
      py-3
      rounded-2xl
      shadow-sm
      transition
    "
        >
          <Plus size={18} />
          Add Customer
        </Link>
      </div>
      {/* STATS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* TOTAL CUSTOMERS */}

        <div className="bg-white rounded-2xl md:rounded-3xl border shadow-sm p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-500">
                Total Customers
              </p>

              <h2 className="text-2xl md:text-4xl font-bold mt-1 md:mt-2 text-gray-800">
                {totalCustomers}
              </h2>
            </div>

            <div
              className="
          h-12
          w-12
          md:h-16
          md:w-16
          rounded-xl
          md:rounded-2xl
          bg-blue-100
          flex
          items-center
          justify-center
        "
            >
              <Users size={22} className="text-blue-600 md:w-7 md:h-7" />
            </div>
          </div>
        </div>

        {/* TOTAL CREDIT */}

        <div className="bg-white rounded-2xl md:rounded-3xl border shadow-sm p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs md:text-sm text-gray-500">
                Total Credit Limit
              </p>

              <h2 className="text-2xl md:text-4xl font-bold mt-1 md:mt-2 text-gray-800 truncate">
                ₹{totalCredit.toLocaleString()}
              </h2>
            </div>

            <div
              className="
          h-12
          w-12
          md:h-16
          md:w-16
          rounded-xl
          md:rounded-2xl
          bg-green-100
          flex
          items-center
          justify-center
          shrink-0
        "
            >
              <BadgeIndianRupee
                size={22}
                className="text-green-600 md:w-7 md:h-7"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH */}

      <div className="bg-white rounded-2xl md:rounded-3xl border shadow-sm p-4 md:p-5 mb-6 md:mb-8">
        <div className="relative">
          {/* SEARCH ICON */}

          <Search
            size={18}
            className="
        absolute
        left-4
        top-1/2
        -translate-y-1/2
        text-gray-400
      "
          />

          {/* INPUT */}

          <input
            type="text"
            placeholder="Search customer..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="
        w-full
        border
        border-gray-300
        rounded-xl
        md:rounded-2xl
        pl-11
        pr-14
        md:pr-20
        py-3
        md:py-4
        text-sm
        md:text-base
        outline-none
        focus:ring-2
        focus:ring-blue-500
        focus:border-blue-500
        transition
      "
          />

          {/* RIGHT SIDE */}

          <div
            className="
        absolute
        right-3
        top-1/2
        -translate-y-1/2
        flex
        items-center
        gap-2
      "
          >
            {searchLoading && (
              <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            )}

            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  setPage(1);
                }}
                className="
            text-gray-500
            hover:text-red-500
            transition
          "
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* SEARCH LABEL */}

        {search && (
          <p className="text-xs md:text-sm text-gray-500 mt-3 wrap-break-word">
            Searching for:
            <span className="font-semibold ml-1 text-gray-700">"{search}"</span>
          </p>
        )}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading customers...</p>
          </div>
        ) : customers.length === 0 ? (
          <div className="p-12 text-center">
            <Users size={60} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-700">
              No Customers Found
            </h2>
            <p className="text-gray-500 mt-2">
              Try changing your search or create a customer.
            </p>
          </div>
        ) : (
          <>
            {/* MOBILE CARDS */}

            <div className="md:hidden p-4 space-y-4">
              {customers.map((customer) => (
                <div
                  key={customer.id}
                  className="border rounded-2xl p-4 bg-white shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-linear-to-r from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold">
                      {customer.name?.charAt(0)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 truncate">
                        {customer.name}
                      </h3>

                      <p className="text-xs text-gray-500">
                        {customer.customer_code}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="font-medium text-sm">{customer.phone}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Type</p>
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs capitalize">
                        {customer.customer_type}
                      </span>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Balance</p>
                      <p className="font-semibold">
                        ₹{customer.current_balance || 0}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Credit</p>
                      <p className="font-semibold">
                        ₹{customer.credit_limit || 0}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Link
                      to={`/admin/customers/${customer.id}`}
                      className="flex-1 flex justify-center items-center bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl"
                    >
                      <Eye size={16} />
                    </Link>

                    <button
                      disabled={deleteMutation.isPending}
                      onClick={() => handleDelete(customer.id)}
                      className="flex-1 flex justify-center items-center bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* DESKTOP TABLE */}

            <div className="hidden md:block overflow-x-auto">
              {/* your existing table code here unchanged */}
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-5 font-semibold text-gray-700">
                      Customer
                    </th>

                    <th className="text-left p-5 font-semibold text-gray-700">
                      Phone
                    </th>

                    <th className="text-left p-5 font-semibold text-gray-700">
                      Type
                    </th>

                    <th className="text-left p-5 font-semibold text-gray-700">
                      Balance
                    </th>

                    <th className="text-left p-5 font-semibold text-gray-700">
                      Credit
                    </th>

                    <th className="text-left p-5 font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {customers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      {/* CUSTOMER */}

                      <td className="p-5">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-linear-to-r from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold shadow">
                            {customer.name?.charAt(0)}
                          </div>

                          <div>
                            <h3 className="font-semibold text-gray-800">
                              {customer.name}
                            </h3>

                            <p className="text-sm text-gray-500">
                              {customer.customer_code}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* PHONE */}

                      <td className="p-5 text-gray-700">{customer.phone}</td>

                      {/* TYPE */}

                      <td className="p-5">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm capitalize">
                          {customer.customer_type}
                        </span>
                      </td>

                      {/* BALANCE */}

                      <td className="p-5 font-semibold text-gray-700">
                        ₹{customer.current_balance || 0}
                      </td>

                      {/* CREDIT */}

                      <td className="p-5 text-gray-700">
                        ₹{customer.credit_limit || 0}
                      </td>

                      {/* ACTIONS */}

                      <td className="p-5">
                        <div className="flex gap-2">
                          <Link
                            to={`/admin/customers/${customer.id}`}
                            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm transition"
                          >
                            <Eye size={16} />
                          </Link>
                          <button
                            disabled={deleteMutation.isPending}
                            onClick={() => handleDelete(customer.id)}
                            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm transition disabled:opacity-50"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
