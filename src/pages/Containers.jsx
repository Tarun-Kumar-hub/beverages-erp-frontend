import { useState } from "react";
import { useRecipes } from "../hooks/recipes/useRecipes";

import { useContainers } from "../hooks/containers/useContainers";
import { usePreviewContainer } from "../hooks/containers/usePreviewContainer";
import { useCreateContainer } from "../hooks/containers/useCreateContainer";
import { useDeleteContainer } from "../hooks/containers/useDeleteContainer";
import { useMarkContainerUsed } from "../hooks/containers/useMarkContainerUsed";

import Pagination from "../components/common/Pagination";
import toast from "react-hot-toast";
import {
  Factory,
  Trash2,
  Package,
  FlaskConical,
  AlertTriangle,
} from "lucide-react";
import { formatDateTime, timeAgo } from "../utils/date";

export default function Containers() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState("");
  const [size, setSize] = useState("");

  const { data: recipes = [] } = useRecipes();

  const { data, isLoading } = useContainers({
    page,
    limit: 10,
    status,
  });

  const containers = data?.containers || [];
  const totalPages = data?.totalPages || 1;
  // ===============================
  // CLOSE CONTAINER
  // ===============================

  const markUsedMutation = useMarkContainerUsed();

  const markAsUsed = (id) => {
    if (!window.confirm("Close this container?")) {
      return;
    }

    markUsedMutation.mutate(id);
  };

  // ===============================
  // PREVIEW
  // ===============================
  const { data: preview = [] } = usePreviewContainer(
    selectedRecipe,
    size,
    true,
  );

  // ===============================
  // CREATE
  // ===============================
  const createMutation = useCreateContainer();
  const loading = createMutation.isPending;

  const handleCreate = () => {
    if (!selectedRecipe || !size) {
      toast("Select flavour and size ⚠️");
      return;
    }

    createMutation.mutate({
      recipe_id: selectedRecipe,
      size: Number(size),
    });
  };
  // ===============================
  // DELETE
  // ===============================
  const deleteMutation = useDeleteContainer();

  const handleDelete = (id) => {
    if (!window.confirm("Delete container?\nStock will be restored.")) {
      return;
    }

    deleteMutation.mutate(id);
  };
  const hasLowStock = preview.some((item) => item.stock < item.required);

  if (isLoading) {
    return (
      <p className="p-6 text-center text-gray-500">Loading production...</p>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-6 flex items-center gap-3">
        <Factory className="text-blue-600" />
        <h1 className="text-2xl font-bold">Production Dashboard</h1>
      </div>

      <div className="max-w-6xl mx-auto grid gap-6">
        {/* FORM */}
        <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
          <h2 className="flex items-center gap-2 font-semibold text-lg">
            <FlaskConical className="text-green-600" />
            Create Container
          </h2>

          <select
            disabled={loading}
            className="w-full border rounded-xl p-3"
            value={selectedRecipe}
            onChange={(e) => setSelectedRecipe(e.target.value)}
          >
            <option value="">Select Flavour</option>
            {recipes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.flavour}
              </option>
            ))}
          </select>

          <input
            type="number"
            disabled={loading}
            placeholder="Enter size (Liters)"
            className="w-full border rounded-xl p-3"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          />

          {preview.length > 0 && (
            <div className="bg-green-50 border rounded-xl p-4 space-y-2">
              <h3 className="font-semibold text-green-700">
                Material Consumption
              </h3>

              {preview.map((item, i) => (
                <div key={i} className="bg-white p-3 rounded border">
                  <div className="flex justify-between">
                    <span>{item.name}</span>
                    <span className="font-semibold">
                      {item.required.toFixed(2)} {item.unit}
                    </span>
                  </div>

                  {item.stock < item.required && (
                    <div className="text-xs text-red-500 flex gap-1">
                      <AlertTriangle size={14} /> Low Stock
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleCreate}
            disabled={!preview.length || loading || hasLowStock}
            className={`w-full p-3 rounded-xl text-white ${
              hasLowStock ? "bg-red-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Processing..." : "Create Container"}
          </button>
        </div>
        {/* HISTORY */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <div className="mb-4 flex gap-2">
            <button
              onClick={() => {
                setStatus("");
                setPage(1);
              }}
              className={`px-3 py-2 rounded-lg ${
                status === "" ? "bg-blue-600 text-white" : "bg-gray-100"
              }`}
            >
              All
            </button>

            <button
              onClick={() => {
                setStatus("active");
                setPage(1);
              }}
              className={`px-3 py-2 rounded-lg ${
                status === "active" ? "bg-green-600 text-white" : "bg-gray-100"
              }`}
            >
              Active
            </button>

            <button
              onClick={() => {
                setStatus("used");
                setPage(1);
              }}
              className={`px-3 py-2 rounded-lg ${
                status === "used" ? "bg-gray-700 text-white" : "bg-gray-100"
              }`}
            >
              Closed
            </button>
          </div>
          <h2 className="flex items-center gap-2 font-semibold text-lg mb-4">
            <Package className="text-purple-600" />
            Production History
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {containers.map((c) => {
              const total = c.size * 1000;
              const used = c.used_volume || 0;
              const remaining = c.remaining_ml;

              const percent = (used / total) * 100;
              const remainingPercent = 100 - percent;

              const isLow = remainingPercent < 20;
              const isCritical = remainingPercent < 5;

              // 🎯 STATUS STYLE
              const statusStyle =
                c.status === "used"
                  ? "bg-gray-100 text-gray-600"
                  : isLow
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700";

              const statusText =
                c.status === "used"
                  ? "Closed"
                  : isLow
                    ? "Almost Full"
                    : "Active";

              // 🎯 PROGRESS COLOR
              const progressColor =
                c.status === "used"
                  ? "bg-gray-400"
                  : isCritical
                    ? "bg-red-500"
                    : isLow
                      ? "bg-yellow-500"
                      : "bg-green-500";

              return (
                <div
                  key={c.id}
                  className="border rounded-xl p-4 space-y-3 hover:shadow-md transition bg-white"
                >
                  {/* HEADER */}
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex gap-2 flex-wrap items-center">
                        <span className="bg-blue-100 text-xs px-2 py-1 rounded font-medium">
                          {c.container_code}
                        </span>

                        <span className="font-semibold">{c.flavour}</span>

                        {/* STATUS */}
                        <span
                          className={`text-xs px-2 py-1 rounded font-medium ${statusStyle}`}
                        >
                          {statusText}
                        </span>
                      </div>

                      <div className="text-sm text-gray-500 mt-1">
                        {c.size} L
                      </div>

                      <div className="text-xs text-green-600 font-medium mt-1">
                        {(remaining / 1000).toFixed(2)} L left
                      </div>
                    </div>

                    {/* ACTIONS  */}
                    <div className="flex items-center gap-2">
                      {c.status === "active" && (
                        <button
                          onClick={() => markAsUsed(c.id)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium 
                             bg-yellow-300 hover:bg-yellow-500 text-white 
                             rounded-lg transition"
                        >
                          Close
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-2 rounded-lg text-red-500 hover:text-red-600 
                           hover:bg-red-50 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* PROGRESS BAR */}
                  <div className="w-full bg-gray-200 h-2 rounded overflow-hidden">
                    <div
                      className={`${progressColor} h-2 transition-all`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  {/* META */}
                  <div className="text-xs text-gray-400">
                    {formatDateTime(c.created_at)}
                  </div>

                  <div className="text-xs text-blue-500">
                    {timeAgo(c.created_at)}
                  </div>
                </div>
              );
            })}
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>{" "}
      </div>
    </div>
  );
}
