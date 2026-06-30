// 🔑 Key Idea:
// Material Form using TanStack Query Mutations
// - Create Material
// - Update Material
// - Validation
// - Loading states from TanStack

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { X } from "lucide-react";

import { useCreateMaterial } from "../../hooks/materials/useCreateMaterial";
import { useUpdateMaterial } from "../../hooks/materials/useUpdateMaterial";

export default function MaterialForm({ close, editData }) {
  const [form, setForm] = useState({
    name: "",
    type: "",
    quantity: "",
    unit: "",
    min_threshold: "",
  });

  const createMutation = useCreateMaterial();
  const updateMutation = useUpdateMaterial();

  const loading = createMutation.isPending || updateMutation.isPending;

  // ===============================
  // Fill Form (Edit Mode)
  // ===============================
  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name || "",
        type: editData.type || "",
        quantity: editData.quantity || "",
        unit: editData.unit || "",
        min_threshold: editData.min_threshold || "",
      });
    }
  }, [editData]);

  // ===============================
  // Validation
  // ===============================
  const validate = () => {
    if (!form.name.trim()) return "Name required";

    if (!form.type) return "Select type";

    if (!form.unit) return "Select unit";

    if (!form.quantity || Number(form.quantity) <= 0) {
      return "Quantity must be > 0";
    }

    if (Number(form.min_threshold) < 0) {
      return "Min threshold must be >= 0";
    }

    return null;
  };

  // ===============================
  // Submit
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validate();

    if (error) {
      return toast.error(error);
    }

    try {
      const payload = {
        ...form,
        quantity: Number(form.quantity),
        min_threshold: Number(form.min_threshold || 0),
      };

      if (editData) {
        await updateMutation.mutateAsync({
          id: editData.id,
          data: payload,
        });

        toast.success("Material updated");
      } else {
        await createMutation.mutateAsync(payload);

        toast.success("Material added");
      }

      close();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-2"
      onClick={close}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-md rounded-xl shadow-xl p-5 relative"
      >
        {/* Close */}
        <button
          type="button"
          onClick={close}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X size={18} />
        </button>

        {/* Title */}
        <h2 className="text-lg md:text-xl font-semibold mb-4">
          {editData ? "Edit Material" : "Add Material"}
        </h2>

        {/* Name */}
        <input
          placeholder="Material Name"
          className="border p-2 w-full mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
        />

        {/* Type */}
        <select
          className="border p-2 w-full mb-3 rounded focus:ring-2 focus:ring-blue-500"
          value={form.type}
          onChange={(e) =>
            setForm({
              ...form,
              type: e.target.value,
            })
          }
        >
          <option value="">Select Type</option>
          <option value="premix">Premix</option>
          <option value="chemical">Chemical</option>
          <option value="packaging">Packaging</option>
        </select>

        {/* Quantity */}
        <input
          type="number"
          placeholder="Quantity"
          className="border p-2 w-full mb-3 rounded focus:ring-2 focus:ring-blue-500"
          value={form.quantity}
          onChange={(e) =>
            setForm({
              ...form,
              quantity: e.target.value,
            })
          }
        />

        {/* Threshold */}
        <input
          type="number"
          placeholder="Low Stock Threshold"
          className="border p-2 w-full mb-3 rounded focus:ring-2 focus:ring-blue-500"
          value={form.min_threshold}
          onChange={(e) =>
            setForm({
              ...form,
              min_threshold: e.target.value,
            })
          }
        />

        {/* Unit */}
        <select
          className="border p-2 w-full mb-4 rounded focus:ring-2 focus:ring-blue-500"
          value={form.unit}
          onChange={(e) =>
            setForm({
              ...form,
              unit: e.target.value,
            })
          }
        >
          <option value="">Select Unit</option>
          <option value="ml">ml</option>
          <option value="l">l</option>
          <option value="g">g</option>
          <option value="kg">kg</option>
          <option value="pcs">pcs</option>
        </select>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>

          <button
            type="button"
            onClick={close}
            disabled={loading}
            className="bg-gray-400 hover:bg-gray-500 px-4 py-2 rounded w-full disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
