import { useState, Fragment } from "react";
import { useRecipes } from "../hooks/recipes/useRecipes";
import { useDeleteRecipe } from "../hooks/recipes/useDeleteRecipe";
import RecipeForm from "../components/admin/RecipeForm.jsx";
import { Pencil, Trash2, ChevronDown, ChevronUp, Plus } from "lucide-react";
import toast from "react-hot-toast";

export default function RecipeList() {
  const [expanded, setExpanded] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [search, setSearch] = useState("");

  // ===============================
  // 📡 FETCH RECIPES
  // ===============================
  const { data: recipes = [], isLoading, error } = useRecipes(search);

  const deleteMutation = useDeleteRecipe();
  // ===============================
  // 🔽 TOGGLE EXPAND
  // ===============================
  const toggleExpand = (id) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  // ===============================
  // ✏️ EDIT
  // ===============================
  const handleEdit = (recipe) => {
    setEditData(recipe);
    setShowForm(true);
  };

  // ===============================
  // ➕ ADD
  // ===============================
  const handleAdd = () => {
    setEditData(null);
    setShowForm(true);
  };

  // ===============================
  // ❌ DELETE
  // ===============================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this recipe?");
    if (!confirmDelete) return;

    try {
      await deleteMutation.mutateAsync(id);

      toast.success("Recipe deleted");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };
  if (error) {
    return <div className="p-5 text-red-500">Failed to load recipes</div>;
  }
  return (
    <div className="p-3 sm:p-5">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
        <h2 className="text-lg sm:text-xl font-semibold">Recipes per 50L</h2>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search recipe..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-3 py-2"
          />

          <button
            onClick={handleAdd}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
      </div>
      {/* ===============================
          LOADING
      =============================== */}
      {isLoading && (
        <div className="text-center py-6 text-gray-500">Loading recipes...</div>
      )}

      {/* ===============================
          EMPTY STATE
      =============================== */}
      {!isLoading && recipes.length === 0 && (
        <div className="text-center py-6 text-gray-500">No recipes found</div>
      )}

      {/* ===============================
          TABLE
      =============================== */}
      {!isLoading && recipes.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-sm">
                <th className="p-3 text-left">Flavour</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {recipes.map((r) => (
                <Fragment key={r.id}>
                  <tr className="border-t hover:bg-gray-50">
                    <td className="p-3 font-medium">{r.flavour}</td>

                    <td className="p-3 flex gap-2 justify-center">
                      {/* ✏️ EDIT */}
                      <button
                        onClick={() => handleEdit(r)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded"
                      >
                        <Pencil size={16} />
                      </button>

                      {/* ❌ DELETE */}
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                      >
                        <Trash2 size={16} />
                      </button>

                      {/* 🔽 EXPAND */}
                      <button
                        onClick={() => toggleExpand(r.id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
                      >
                        {expanded === r.id ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </button>
                    </td>
                  </tr>

                  {/* ===============================
                      EXPANDED MATERIALS
                  =============================== */}
                  {expanded === r.id && (
                    <tr>
                      <td colSpan="2" className="bg-gray-50 p-3">
                        {r.materials.length === 0 ? (
                          <div className="text-sm text-gray-400">
                            No materials
                          </div>
                        ) : (
                          r.materials.map((m, i) => (
                            <div
                              key={i}
                              className="flex justify-between border-b py-1 text-sm"
                            >
                              <span>{m.material_name}</span>
                              <span>
                                {m.quantity} {m.unit}
                              </span>
                            </div>
                          ))
                        )}
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ===============================
          MODAL
      =============================== */}
      {showForm && (
        <RecipeForm close={() => setShowForm(false)} editData={editData} />
      )}
    </div>
  );
}
