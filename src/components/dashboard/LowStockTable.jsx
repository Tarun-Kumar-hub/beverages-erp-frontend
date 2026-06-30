import { AlertTriangle } from "lucide-react";

import { useLowStock } from "../../hooks/dashboard/useLowStock";

const LowStockTable = () => {
  const { data, isLoading } = useLowStock();

  const materials = data?.materials || [];
  const products = data?.products || [];

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        Loading Low Stock...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <AlertTriangle className="text-orange-500" />

        <div>
          <h2 className="text-2xl font-bold text-gray-800">Low Stock Alerts</h2>

          <p className="text-sm text-gray-500 mt-1">
            Inventory items running low
          </p>
        </div>
      </div>

      {/* Materials */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Materials</h3>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-3">Material</th>
                <th className="text-left p-3">Quantity</th>
                <th className="text-left p-3">Threshold</th>
              </tr>
            </thead>

            <tbody>
              {materials.length ? (
                materials.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="p-3">{item.name}</td>

                    <td className="p-3 text-red-500 font-semibold">
                      {item.quantity} {item.unit}
                    </td>

                    <td className="p-3">{item.min_threshold}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-gray-500">
                    No low stock materials
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Products */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Products</h3>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-3">Product</th>
                <th className="text-left p-3">Quantity</th>
                <th className="text-left p-3">Threshold</th>
              </tr>
            </thead>

            <tbody>
              {products.length ? (
                products.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="p-3">
                      {item.flavour} {item.pouch_volume}ml
                    </td>

                    <td className="p-3 text-red-500 font-semibold">
                      {item.quantity}
                    </td>

                    <td className="p-3">{item.low_stock_threshold}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-gray-500">
                    No low stock products
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LowStockTable;
