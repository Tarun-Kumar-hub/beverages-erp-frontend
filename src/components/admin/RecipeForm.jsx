import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { X, Plus } from "lucide-react";

import { useCreateRecipe } from "../../hooks/recipes/useCreateRecipe";
import { useUpdateRecipe } from "../../hooks/recipes/useUpdateRecipe";
import { useMaterials } from "../../hooks/materials/useMaterials";

export default function RecipeForm({ close, editData }) {
  const [flavour, setFlavour] = useState("");
  const [items, setItems] = useState([{ material_id: "", quantity: "" }]);

  const createMutation = useCreateRecipe();
  const updateMutation = useUpdateRecipe();

  const { data } = useMaterials({
    page: 1,
    search: "",
  });

  const materials =
    data?.materials?.filter((m) => m.type !== "packaging") || [];

  const loading = createMutation.isPending || updateMutation.isPending;

  // ===============================
  // ✏️ EDIT MODE
  // ===============================
  useEffect(() => {
    if (editData) {
      setFlavour(editData.flavour);

      setItems(
        editData.materials.map((m) => ({
          material_id: m.material_id,
          quantity: m.quantity,
        })),
      );
    }
  }, [editData]);

  // ===============================
  // ➕ ADD ITEM
  // ===============================
  const addItem = () => {
    setItems((prev) => [...prev, { material_id: "", quantity: "" }]);
  };

  // ===============================
  // ❌ REMOVE ITEM (safe)
  // ===============================
  const removeItem = (index) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // ===============================
  // 🔄 UPDATE ITEM
  // ===============================
  const updateItem = (index, field, value) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  // ===============================
  // 📏 GET UNIT
  // ===============================
  const getUnit = (id) => {
    if (!id) return "";
    const mat = materials.find((m) => m.id === id);
    return mat?.unit || "";
  };

  // ===============================
  // ✅ VALIDATION
  // ===============================
  const validate = () => {
    if (!flavour.trim()) return "Flavour required";

    if (items.some((i) => !i.material_id)) return "Select all materials";

    if (items.some((i) => !i.quantity || i.quantity <= 0))
      return "Invalid quantity";

    const ids = items.map((i) => i.material_id);
    if (new Set(ids).size !== ids.length)
      return "Duplicate materials not allowed";

    return null;
  };

  // ===============================
  // 🚀 SUBMIT
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validate();

    if (error) {
      toast.error(error);
      return;
    }

    const payload = {
      flavour,
      items: items.map((i) => ({
        material_id: i.material_id,
        quantity: Number(i.quantity),
        unit: getUnit(i.material_id),
      })),
    };

    try {
      if (editData) {
        await updateMutation.mutateAsync({
          id: editData.id,
          data: payload,
        });

        toast.success("Recipe updated");
      } else {
        await createMutation.mutateAsync(payload);

        toast.success("Recipe created");
      }

      close();
    } catch (err) {
      console.error(err);

      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const isInvalid = !!validate();

  // ===============================
  // 🎨 UI
  // ===============================
  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-start px-2 z-50 overflow-y-auto"
      onClick={close}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl my-10 max-h-[90vh] flex flex-col"
      >
        {/* 🔥 HEADER */}
        <div className="sticky top-0 bg-white z-10 px-5 pt-5 pb-3 border-b flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-semibold">
            {editData ? "Edit Recipe" : "Create Recipe"}
          </h2>

          <button type="button" onClick={close}>
            <X size={18} />
          </button>
        </div>

        {/* 🔽 BODY */}
        <div className="overflow-y-auto px-5 py-4 space-y-4">
          {/* Flavour */}
          <input
            placeholder="Enter flavour (e.g Mango)"
            className="border p-2.5 w-full rounded-lg"
            value={flavour}
            onChange={(e) => setFlavour(e.target.value)}
          />

          {/* Items */}
          {items.map((item, index) => (
            <div key={index} className="border rounded-xl p-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">
                  Material {index + 1}
                </span>

                <button type="button" onClick={() => removeItem(index)}>
                  <X size={16} />
                </button>
              </div>

              <select
                className="border p-2.5 w-full mb-3 rounded-lg"
                value={item.material_id}
                onChange={(e) =>
                  updateItem(index, "material_id", e.target.value)
                }
              >
                <option value="">Select Material</option>

                {materials.map((m) => {
                  const selected = items.some(
                    (i, idx) => i.material_id === m.id && idx !== index,
                  );

                  return (
                    <option key={m.id} value={m.id} disabled={selected}>
                      {m.name} ({m.unit})
                    </option>
                  );
                })}
              </select>

              <div className="flex border rounded-lg overflow-hidden">
                <input
                  type="number"
                  placeholder="Enter quantity"
                  className="p-2.5 w-full"
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(index, "quantity", e.target.value)
                  }
                />

                <span className="bg-gray-100 px-3 flex items-center text-sm">
                  {getUnit(item.material_id)}
                </span>
              </div>
            </div>
          ))}

          {/* Add */}
          <button
            type="button"
            onClick={addItem}
            className="bg-yellow-500 text-white px-3 py-2 rounded-lg w-full flex justify-center gap-2"
          >
            <Plus size={16} />
            Add Material
          </button>
        </div>

        {/* 🔥 FOOTER */}
        <div className="sticky bottom-0 bg-white px-5 py-4 border-t">
          <button
            disabled={loading || isInvalid}
            className="bg-green-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg w-full"
          >
            {loading ? "Saving..." : "Save Recipe"}
          </button>
        </div>
      </form>
    </div>
  );
}
