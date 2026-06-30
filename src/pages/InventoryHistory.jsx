import { useState, useEffect } from "react";

import { useInventoryHistory } from "../hooks/materials/useInventoryHistory";

import Pagination from "../components/common/Pagination";

import { formatDateTime } from "../utils/date";

import {
  History,
  ArrowUp,
  ArrowDown,
  Search,
  Filter,
  RefreshCcw,
  Calendar,
  Loader2,
} from "lucide-react";

export default function InventoryHistory() {
  // ======================================
  // STATES
  // ======================================
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [type, setType] = useState("");

  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

  // ======================================
  // FETCH HISTORY
  // ======================================
  const { data, isLoading, error } = useInventoryHistory({
    page,
    search,
    type,
    startDate,
    endDate,
  });

  const history = data?.history || [];

  const total = data?.total || 0;

  const totalPages = data?.totalPages || 1;

  useEffect(() => {
    setPage(1);
  }, [search, type, startDate, endDate]);
  // ======================================
  // TYPE COLORS
  // ======================================

  const getTypeColor = (type) => {
    switch (type) {
      case "initial":
        return "bg-gray-100 text-gray-700";

      case "stock_add":
        return "bg-green-100 text-green-700";

      case "adjustment":
        return "bg-yellow-100 text-yellow-700";

      case "production":
        return "bg-red-100 text-red-700";

      case "restore":
        return "bg-blue-100 text-blue-700";

      case "packaging":
        return "bg-purple-100 text-purple-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // ======================================
  // FORMAT TYPE
  // ======================================

  const formatType = (type) => {
    switch (type) {
      case "stock_add":
        return "Stock Added";

      case "production":
        return "Production";

      case "restore":
        return "Restore";

      case "packaging":
        return "Packaging";

      case "adjustment":
        return "Adjustment";

      case "initial":
        return "Initial";

      default:
        return type;
    }
  };
  if (error) {
    return "<h1>error loading inventory history<h1>";
  }
  return (
    <div className="p-4 md:p-6 space-y-4 bg-gray-50 min-h-screen">
      {/* HEADER */}

      {/* FILTERS */}

      <div className="bg-white rounded-3xl shadow-sm border p-5">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* SEARCH */}

          <div className="relative">
            <Search size={18} className="absolute left-3 top-3 text-gray-400" />

            <input
              type="text"
              placeholder="Search material..."
              className="
                w-full
                border
                rounded-xl
                pl-10
                pr-3
                py-3
                outline-none
                focus:ring-2
                focus:ring-indigo-500
              "
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* TYPE */}

          <div className="relative">
            <Filter size={18} className="absolute left-3 top-3 text-gray-400" />

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="
                w-full
                border
                rounded-xl
                pl-10
                pr-3
                py-3
                appearance-none
                outline-none
                focus:ring-2
                focus:ring-indigo-500
              "
            >
              <option value="">All Types</option>

              <option value="initial">Initial</option>

              <option value="stock_add">Stock Added</option>

              <option value="adjustment">Adjustment</option>

              <option value="production">Production</option>

              <option value="restore">Restore</option>

              <option value="packaging">Packaging</option>
            </select>
          </div>

          {/* START DATE */}

          <div className="relative">
            <Calendar
              size={18}
              className="absolute left-3 top-3 text-gray-400"
            />

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="
                w-full
                border
                rounded-xl
                pl-10
                pr-3
                py-3
                outline-none
                focus:ring-2
                focus:ring-indigo-500
              "
            />
          </div>

          {/* END DATE */}

          <div className="relative">
            <Calendar
              size={18}
              className="absolute left-3 top-3 text-gray-400"
            />

            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="
                w-full
                border
                rounded-xl
                pl-10
                pr-3
                py-3
                outline-none
                focus:ring-2
                focus:ring-indigo-500
              "
            />
          </div>

          {/* TOTAL */}

          <div className="flex items-center justify-center bg-gray-100 rounded-xl font-semibold">
            Total Records: {total}
          </div>
        </div>
      </div>

      {/* DESKTOP TABLE */}

      <div className="hidden md:block bg-white rounded-3xl shadow-sm overflow-hidden border">
        <div className="max-h-162.5 overflow-y-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b sticky top-0 z-10">
              <tr>
                <th className="p-5 text-left">Material</th>

                <th className="p-5 text-left">Change</th>

                <th className="p-5 text-left">Type</th>

                <th className="p-5 text-left">Note</th>

                <th className="p-5 text-left">Date</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="p-10">
                    <div className="flex justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    </div>
                  </td>
                </tr>
              ) : history.length > 0 ? (
                history.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    {/* MATERIAL */}

                    <td className="p-5 font-semibold text-gray-800">
                      {item.material_name}
                    </td>

                    {/* CHANGE */}

                    <td className="p-5">
                      <div
                        className={`
                          flex
                          items-center
                          gap-2
                          font-bold

                          ${item.change > 0 ? "text-green-600" : "text-red-600"}
                        `}
                      >
                        {item.change > 0 ? (
                          <ArrowUp size={18} />
                        ) : (
                          <ArrowDown size={18} />
                        )}

                        {item.change > 0 ? "+" : ""}
                        {item.change}
                      </div>
                    </td>

                    {/* TYPE */}

                    <td className="p-5">
                      <span
                        className={`
                          px-3
                          py-1.5
                          rounded-full
                          text-xs
                          font-semibold
                          ${getTypeColor(item.type)}
                        `}
                      >
                        {formatType(item.type)}
                      </span>
                    </td>

                    {/* NOTE */}

                    <td className="p-5 text-gray-600">{item.note || "-"}</td>

                    {/* DATE */}

                    <td className="p-5 text-gray-500 text-sm">
                      {formatDateTime(item.created_at)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-10 text-center">
                    <div className="text-gray-400 text-lg">
                      No history found 📭
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE VIEW */}

      <div className="md:hidden space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className="
                  bg-white
                  p-4
                  rounded-2xl
                  shadow-sm
                  border
                "
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-semibold text-gray-800">
                    {item.material_name}
                  </div>

                  <div className="text-xs text-gray-400 mt-1">
                    {formatDateTime(item.created_at)}
                  </div>
                </div>

                <div
                  className={`
                      flex
                      items-center
                      gap-1
                      font-bold

                      ${item.change > 0 ? "text-green-600" : "text-red-600"}
                    `}
                >
                  {item.change > 0 ? (
                    <ArrowUp size={16} />
                  ) : (
                    <ArrowDown size={16} />
                  )}

                  {item.change > 0 ? "+" : ""}
                  {item.change}
                </div>
              </div>

              <div className="mb-2">
                <span
                  className={`
                      px-3
                      py-1
                      rounded-full
                      text-xs
                      font-semibold
                      ${getTypeColor(item.type)}
                    `}
                >
                  {formatType(item.type)}
                </span>
              </div>

              <div className="text-sm text-gray-600">{item.note || "-"}</div>
            </div>
          ))
        )}
      </div>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
