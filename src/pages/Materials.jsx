// 🔑 Key Idea:
// ERP-level Materials UI with:
// - low stock alerts
// - threshold display
// - better UX
import { useState } from "react";
import { useMaterials } from "../hooks/materials/useMaterials";
import { useDeleteMaterial } from "../hooks/materials/useDeleteMaterial";
import { useAddStock } from "../hooks/materials/useAddStock";

import Pagination from "../components/common/Pagination";
import MaterialForm from "../components/admin/MaterialForm";
import toast from "react-hot-toast";

import { Plus, Pencil, Trash2, Package } from "lucide-react";

export default function Materials() {
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [addQty, setAddQty] = useState({});
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");

  const { data, isLoading, error } = useMaterials({
    page,
    search,
  });

  const materials = data?.materials || [];

  const totalPages = data?.totalPages || 1;

  const deleteMutation = useDeleteMaterial();
  const addStockMutation = useAddStock();

  const handleEdit = (item) => {
    setEditData(item);
    setShowForm(true);
  };

  const handleAddStock = async (id) => {
    const qty = Number(addQty[id]);

    if (!qty || qty <= 0) {
      toast.error("Enter valid quantity");
      return;
    }

    try {
      await addStockMutation.mutateAsync({
        id,
        quantity: qty,
      });

      toast.success("Stock added");

      setAddQty((prev) => ({
        ...prev,
        [id]: "",
      }));
    } catch {
      toast.error("Failed to add stock");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this material?")) return;

    try {
      await deleteMutation.mutateAsync(id);

      toast.success("Material deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  if (error) {
    return <div className="p-6 text-red-500">Failed to load materials</div>;
  }

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Package size={24} /> Materials
        </h1>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Search material..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // reset pagination
            }}
            className="border rounded-lg px-3 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={() => {
              setEditData(null);
              setShowForm(true);
            }}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
          >
            <Plus size={18} /> Add Material
          </button>
        </div>
      </div>

      {isLoading && <p className="mb-3">Loading...</p>}

      {/* DESKTOP */}
      <div className="hidden md:block bg-white rounded shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Qty</th>
              <th className="p-3 text-left">Min</th> {/* ✅ NEW */}
              <th className="p-3 text-left">Unit</th>
              <th className="p-3 text-left">Add Stock</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {materials.length > 0
              ? materials.map((m) => (
                  <tr key={m.id} className="border-t hover:bg-gray-50">
                    <td className="p-3 font-medium">{m.name}</td>
                    <td className="p-3">{m.type}</td>

                    {/* 🔥 Quantity + Low Stock */}
                    <td
                      className={`p-3 ${
                        m.is_low_stock ? "text-red-600 font-semibold" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {m.quantity}

                        {m.is_low_stock && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">
                            Low
                          </span>
                        )}
                      </div>
                    </td>

                    {/* ✅ Threshold */}
                    <td className="p-3 text-gray-500">{m.min_threshold}</td>

                    <td className="p-3">{m.unit}</td>

                    {/* Add Stock */}
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          placeholder="+Qty"
                          value={addQty[m.id] || ""}
                          onChange={(e) =>
                            setAddQty((prev) => ({
                              ...prev,
                              [m.id]: e.target.value,
                            }))
                          }
                          className="w-16 border px-2 py-1 rounded"
                        />

                        <button
                          disabled={!addQty[m.id]}
                          onClick={() => handleAddStock(m.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs disabled:opacity-50"
                        >
                          Add
                        </button>
                      </div>
                    </td>

                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => handleEdit(m)}
                        className="bg-yellow-400 px-2 py-1 rounded"
                      >
                        <Pencil size={14} />
                      </button>

                      <button
                        onClick={() => handleDelete(m.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              : !isLoading && (
                  <tr>
                    <td colSpan="7" className="p-4 text-center text-gray-500">
                      <Package
                        size={40}
                        className="mx-auto text-gray-300 mb-3"
                      />

                      <h3 className="font-medium text-gray-700">
                        No materials found
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        Try a different search term
                      </p>
                    </td>
                  </tr>
                )}
          </tbody>
        </table>
      </div>

      {/* MOBILE */}
      {/* MOBILE */}
      <div className="md:hidden space-y-3">
        {materials.length > 0
          ? materials.map((m) => (
              <div key={m.id} className="bg-white p-4 rounded-xl shadow border">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-semibold">{m.name}</div>

                  <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {m.type}
                  </div>
                </div>

                {m.is_low_stock && (
                  <div className="text-red-600 text-xs mb-2 font-medium">
                    ⚠ Low Stock
                  </div>
                )}

                <div className="text-sm mb-2">
                  {m.quantity} {m.unit}
                </div>

                <div className="text-xs text-gray-500 mb-3">
                  Min: {m.min_threshold}
                </div>

                <div className="flex gap-2 mb-3">
                  <input
                    type="number"
                    placeholder="+Qty"
                    value={addQty[m.id] || ""}
                    onChange={(e) =>
                      setAddQty((prev) => ({
                        ...prev,
                        [m.id]: e.target.value,
                      }))
                    }
                    className="flex-1 border px-3 py-2 rounded"
                  />

                  <button
                    onClick={() => handleAddStock(m.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Add
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(m)}
                    className="flex-1 bg-yellow-400 py-2 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(m.id)}
                    className="flex-1 bg-red-500 text-white py-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          : !isLoading && (
              <div className="bg-white rounded-xl shadow border p-8 text-center">
                <Package size={40} className="mx-auto text-gray-300 mb-3" />

                <h3 className="font-medium text-gray-700">
                  No materials found
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Try a different search term
                </p>
              </div>
            )}
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      {/* Modal */}
      {showForm && (
        <MaterialForm close={() => setShowForm(false)} editData={editData} />
      )}
    </div>
  );
}
