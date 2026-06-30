import { useState } from "react";

import Summary from "../components/admin/Summary";
import ProductTable from "../components/admin/ProductTable";
import Pagination from "../components/common/Pagination";

import { useProducts } from "../hooks/products/useProducts";
import { useProductSummary } from "../hooks/products/useProductSummary";

import { Package } from "lucide-react";

export default function Stocks() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [status, setStatus] = useState("active");
  const [page, setPage] = useState(1);

  const { data: summary = {} } = useProductSummary();

  const { data, isLoading } = useProducts({
    page,
    limit: 10,
    search,
    filter,
    status,
  });

  const products = data?.products || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Package className="h-6 w-6" />
        <h1 className="text-xl md:text-2xl font-bold">Stock Management</h1>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <input
            type="text"
            placeholder="Search flavour..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="
              w-full
              md:flex-1
              border
              rounded-lg
              px-3
              py-2
              outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          />

          {/* Stock Filter */}
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(1);
            }}
            className="
              w-full
              md:w-44
              border
              rounded-lg
              px-3
              py-2
            "
          >
            <option value="">All Stock</option>
            <option value="low">Low Stock</option>
            <option value="out">Out Of Stock</option>
          </select>

          {/* Status Filter */}
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="
              w-full
              md:w-44
              border
              rounded-lg
              px-3
              py-2
            "
          >
            <option value="active">Active</option>
            <option value="all">All</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Summary */}
      <Summary data={summary} />

      {/* Product Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="py-10 text-center text-gray-500">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <ProductTable products={products} />
          </div>
        )}
      </div>

      {/* Pagination */}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
