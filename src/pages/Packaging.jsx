import { useState } from "react";
import { Package, History, Calendar, Box } from "lucide-react";

import toast, { Toaster } from "react-hot-toast";

import Pagination from "../components/common/Pagination";
import { formatDateTime } from "../utils/date";

import { usePackagingContainers } from "../hooks/packaging/usePackagingContainers";
import { usePackagingMaterials } from "../hooks/packaging/usePackagingMaterials";
import { usePackagingLogs } from "../hooks/packaging/usePackagingLogs";
import { usePackContainer } from "../hooks/packaging/usePackContainer";
export default function Packaging() {
  const [form, setForm] = useState({
    container_id: "",
    pouch_volume: "",
    pouch_count: "",
    pouch_material_id: "",
    pouch_qty_per_unit: "",
    bundle_material_id: "",
    bundle_material_used: "",
    bundles_created: "",
  });

  const [selectedContainer, setSelectedContainer] = useState(null);

  const [page, setPage] = useState(1);

  const { data: containers = [] } = usePackagingContainers();

  const { data: materials = [] } = usePackagingMaterials();

  const { data: logsData } = usePackagingLogs({
    page,
    limit: 5,
  });

  const logs = logsData?.logs || [];
  const totalPages = logsData?.totalPages || 1;

  const packMutation = usePackContainer();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "container_id") {
      const container = containers.find((c) => c.id === value);
      setSelectedContainer(container || null);
    }

    setForm({ ...form, [name]: value });
  };

  // ===============================
  // 📊 CALCULATIONS
  // ===============================
  const pouch_volume = Number(form.pouch_volume) || 0;
  const pouch_count = Number(form.pouch_count) || 0;

  const totalVolume = pouch_volume * pouch_count;

  const remainingCapacity = selectedContainer
    ? selectedContainer.size * 1000 - (selectedContainer.used_volume || 0)
    : 0;

  const isOverCapacity = totalVolume > remainingCapacity;

  // ===============================
  // SUBMIT
  // ===============================
  const handleSubmit = () => {
    if (!form.container_id || !form.pouch_volume || !form.pouch_count) {
      return toast.error("Fill all required fields");
    }

    if (form.pouch_material_id === form.bundle_material_id) {
      return toast.error("Materials cannot be same");
    }

    if (isOverCapacity) {
      return toast.error("Exceeds container capacity ❌");
    }

    const payload = {
      ...form,
      pouch_volume: Number(form.pouch_volume),
      pouch_count: Number(form.pouch_count),
      pouch_qty_per_unit: Number(form.pouch_qty_per_unit),
      bundle_material_used: Number(form.bundle_material_used),
      bundles_created: Number(form.bundles_created),
    };

    packMutation.mutate(payload, {
      onSuccess: () => {
        setForm({
          container_id: "",
          pouch_volume: "",
          pouch_count: "",
          pouch_material_id: "",
          pouch_qty_per_unit: "",
          bundle_material_id: "",
          bundle_material_used: "",
          bundles_created: "",
        });

        setSelectedContainer(null);
      },
    });
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      <Toaster position="top-right" />
      {/* FORM */}
      <div className="bg-white shadow rounded-2xl p-4 sm:p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Package className="text-blue-600" />
          <h2 className="text-xl font-bold">Packaging</h2>
        </div>

        {/* Container */}
        <select
          name="container_id"
          value={form.container_id}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg"
        >
          <option value="">Select Container</option>
          {containers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.container_code} - {c.flavour}
            </option>
          ))}
        </select>

        {selectedContainer && (
          <div className="text-sm text-gray-600">
            <p>Flavour: {selectedContainer.flavour}</p>
            <p>Remaining: {remainingCapacity} ml</p>
          </div>
        )}

        {/* Inputs */}
        <div className="grid sm:grid-cols-2 gap-3">
          <input
            name="pouch_volume"
            placeholder="Pouch Volume (ml)"
            value={form.pouch_volume}
            onChange={handleChange}
            className="border p-2 rounded-lg"
          />
          <input
            name="pouch_count"
            placeholder="Pouch Count"
            value={form.pouch_count}
            onChange={handleChange}
            className="border p-2 rounded-lg"
          />
        </div>

        {/* Materials */}
        <select
          name="pouch_material_id"
          value={form.pouch_material_id}
          onChange={handleChange}
          className="border p-2 rounded-lg w-full"
        >
          <option value="">Select Pouch Material</option>
          {materials.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} ({m.quantity})
            </option>
          ))}
        </select>

        <input
          name="pouch_qty_per_unit"
          value={form.pouch_qty_per_unit}
          placeholder="Pouch Qty per unit"
          onChange={handleChange}
          className="border p-2 rounded-lg w-full"
        />

        <select
          name="bundle_material_id"
          value={form.bundle_material_id}
          onChange={handleChange}
          className="border p-2 rounded-lg w-full"
        >
          <option value="">Select Bundle Material</option>
          {materials.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} ({m.quantity})
            </option>
          ))}
        </select>

        <div className="grid sm:grid-cols-2 gap-3">
          <input
            name="bundle_material_used"
            value={form.bundle_material_used}
            placeholder="Bundle material used"
            onChange={handleChange}
            className="border p-2 rounded-lg"
          />
          <input
            name="bundles_created"
            value={form.bundles_created}
            placeholder="Bundles created"
            onChange={handleChange}
            className="border p-2 rounded-lg"
          />
        </div>

        {/* Preview */}
        <div className="bg-gray-100 p-3 rounded text-sm">
          Total Volume: {totalVolume} ml
        </div>

        {isOverCapacity && (
          <p className="text-red-500 text-sm">Exceeds container capacity ❌</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={packMutation.isPending}
          className="w-full bg-blue-600 text-white py-2 rounded-lg disabled:opacity-50"
        >
          {packMutation.isPending ? "Processing..." : "Pack"}{" "}
        </button>
      </div>
      {/* LOGS */}
      <div className="bg-white rounded-xl shadow p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2 text-gray-800">
            <History size={18} /> History
          </h3>

          <span className="text-xs text-gray-400">{logs.length} records</span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 sticky top-0">
              <tr>
                <th className="p-3 text-left">Container</th>
                <th className="p-3 text-left">Pouches</th>
                <th className="p-3 text-left">Bundles</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>

            <tbody>
              {logs.length > 0 ? (
                logs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    {/* Container */}
                    <td className="p-3 flex items-center gap-2 font-medium">
                      <Box size={16} className="text-gray-400" />
                      {log.container_code || "-"}
                    </td>

                    {/* Pouches */}
                    <td className="p-3">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                        {log.pouch_count}
                      </span>
                    </td>

                    {/* Bundles */}
                    <td className="p-3">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                        {log.bundles_created}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="p-3 text-gray-500 flex items-center gap-2">
                      <Calendar size={14} />
                      {formatDateTime(log.created_at)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-6 text-center text-gray-400">
                    No history found 📭
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>{" "}
    </div>
  );
}
