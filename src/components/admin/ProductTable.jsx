import { useState } from "react";
import { Pencil, History } from "lucide-react";

import { useAdjustProduct } from "../../hooks/products/useAdjustProduct";
import { useToggleProduct } from "../../hooks/products/useToggleProduct";

import HistoryModal from "./HistoryModal";

export default function ProductTable({ products }) {
  const [selected, setSelected] = useState(null);

  const adjustMutation = useAdjustProduct();
  const toggleMutation = useToggleProduct();

  const adjustStock = (id) => {
    const change = Number(prompt("Enter stock change (+/-):"));

    if (!change) return;

    adjustMutation.mutate({
      id,
      payload: { change },
    });
  };

  const toggle = (id, isActive) => {
    const message = isActive
      ? "⚠️ Are you sure you want to disable this product?"
      : "✅ Do you want to restore this product?";

    if (!window.confirm(message)) return;

    toggleMutation.mutate(id);
  };

  const getStatus = (p) => {
    if (!p.is_active) {
      return (
        <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-200 text-gray-600">
          Inactive
        </span>
      );
    }

    if (p.is_out_of_stock) {
      return (
        <span className="px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-700">
          Out
        </span>
      );
    }

    if (p.is_low_stock) {
      return (
        <span className="px-2 py-1 rounded text-xs font-semibold bg-yellow-100 text-yellow-700">
          Low
        </span>
      );
    }

    return (
      <span className="px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-700">
        Active
      </span>
    );
  };

  return (
    <>
      {/* MOBILE VIEW */}
      <div className="md:hidden space-y-4">
        {products.map((p) => (
          <div
            key={p.id}
            className={`border rounded-xl p-4 shadow-sm ${
              !p.is_active ? "bg-gray-50 opacity-70" : "bg-white"
            }`}
          >
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-gray-800">{p.flavour}</h3>

              {getStatus(p)}
            </div>

            <div className="mt-3 space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Volume</span>
                <span>{p.pouch_volume} ml</span>
              </div>

              <div className="flex justify-between">
                <span>Quantity</span>
                <span>{p.quantity}</span>
              </div>

              <div className="flex justify-between">
                <span>Liters</span>
                <span>{Number(p.total_liters).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {p.is_active ? (
                <>
                  <button
                    onClick={() => adjustStock(p.id)}
                    disabled={
                      adjustMutation.isPending || toggleMutation.isPending
                    }
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-xs"
                  >
                    Adjust
                  </button>

                  <button
                    onClick={() => toggle(p.id, p.is_active)}
                    disabled={
                      adjustMutation.isPending || toggleMutation.isPending
                    }
                    className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-xs"
                  >
                    Disable
                  </button>
                </>
              ) : (
                <button
                  onClick={() => toggle(p.id, p.is_active)}
                  disabled={
                    adjustMutation.isPending || toggleMutation.isPending
                  }
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-xs"
                >
                  Restore
                </button>
              )}

              <button
                onClick={() => setSelected(p.id)}
                className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-lg text-xs"
              >
                History
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">Flavour</th>
              <th className="p-3 text-left">Volume</th>
              <th className="p-3 text-left">Qty</th>
              <th className="p-3 text-left">Liters</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr
                key={p.id}
                className={`border-t ${
                  !p.is_active ? "bg-gray-50 opacity-60" : "hover:bg-gray-50"
                }`}
              >
                <td className="p-3 font-medium whitespace-nowrap">
                  {p.flavour}
                </td>

                <td className="p-3 whitespace-nowrap">{p.pouch_volume} ml</td>

                <td className="p-3">{p.quantity}</td>

                <td className="p-3">{Number(p.total_liters).toFixed(2)}</td>

                <td className="p-3">{getStatus(p)}</td>

                <td className="p-3">
                  <div className="flex flex-wrap gap-2">
                    {p.is_active ? (
                      <>
                        <button
                          onClick={() => adjustStock(p.id)}
                          disabled={
                            adjustMutation.isPending || toggleMutation.isPending
                          }
                          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                        >
                          <Pencil size={14} />
                        </button>

                        <button
                          onClick={() => toggle(p.id, p.is_active)}
                          disabled={
                            adjustMutation.isPending || toggleMutation.isPending
                          }
                          className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs"
                        >
                          Disable
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => toggle(p.id, p.is_active)}
                        disabled={
                          adjustMutation.isPending || toggleMutation.isPending
                        }
                        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs"
                      >
                        Restore
                      </button>
                    )}

                    <button
                      onClick={() => setSelected(p.id)}
                      className="bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 rounded text-xs"
                    >
                      <History size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <HistoryModal productId={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
