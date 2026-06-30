import { RefreshCcw, X, Clock, Package } from "lucide-react";

import Pagination from "../common/Pagination";
import { useProductHistory } from "../../hooks/products/useProductHistory";

import { formatDateTime } from "../../utils/date";

import { useState } from "react";
export default function HistoryModal({ productId, onClose }) {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useProductHistory({
    id: productId,
    page,
    limit: 5,
  });

  const history = data?.history || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
      onClick={onClose}
    >
      {/* Modal */}
      <div
        className="bg-white w-105 max-h-[80vh] rounded-xl shadow-lg flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center gap-2">
            <Package className="text-blue-500" />
            <h2 className="font-semibold text-lg">Product History</h2>
          </div>

          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto space-y-3">
          {/* Loading */}
          {isLoading && (
            <div className="flex justify-center items-center gap-2 py-6">
              <RefreshCcw className="animate-spin" />
              <span>Loading...</span>
            </div>
          )}

          {/* Empty */}
          {!isLoading && history.length === 0 && (
            <p className="text-center text-gray-500">No history available</p>
          )}

          {/* Timeline */}
          {history.map((h) => (
            <div key={h.id} className="border rounded-lg p-3 flex gap-3">
              <Clock className="text-gray-400" size={18} />

              <div className="flex-1">
                <p className="font-medium">
                  {h.change > 0 ? "+" : ""}
                  {h.change} ({h.type})
                </p>

                <p className="text-sm text-gray-500">
                  Container: {h.container_code || "-"}
                </p>

                <p className="text-xs text-gray-400">
                  {formatDateTime(h.created_at)}{" "}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}

        <div className="border-t p-3 space-y-3">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />

          <button
            onClick={onClose}
            className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
