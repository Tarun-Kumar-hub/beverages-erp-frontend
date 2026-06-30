import { Trophy, Package, IndianRupee, TrendingUp } from "lucide-react";

import { useTopProducts } from "../../hooks/dashboard/useTopProducts";

const rankStyles = [
  "bg-yellow-100 text-yellow-700",
  "bg-gray-200 text-gray-700",
  "bg-orange-100 text-orange-700",
];

export default function TopProducts() {
  const { data: products = [], isLoading } = useTopProducts();

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl border shadow-sm p-6">
        Loading Top Products...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Top Products</h2>

          <p className="text-sm text-gray-500 mt-1">
            Best selling products analytics
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-50 text-purple-700 text-sm font-semibold">
          <TrendingUp size={16} />
          Top Sellers
        </div>
      </div>

      {products.length > 0 ? (
        <div className="space-y-4">
          {products.map((item, index) => (
            <div
              key={item.product_id}
              className="
                flex items-center justify-between
                p-5 rounded-2xl border border-gray-100
                hover:shadow-sm hover:border-gray-200
                transition-all
              "
            >
              <div className="flex items-center gap-4">
                <div
                  className={`
                    w-12 h-12 rounded-2xl
                    flex items-center justify-center
                    font-bold text-lg
                    ${rankStyles[index] || "bg-blue-100 text-blue-700"}
                  `}
                >
                  {index === 0 ? <Trophy size={20} /> : `#${index + 1}`}
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800">
                    {item.product_name}
                  </h3>

                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                    <Package size={14} />
                    {item.total_sold} Sold
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center justify-end gap-1 text-green-600 font-bold text-lg">
                  <IndianRupee size={18} />
                  {Number(item.revenue).toLocaleString("en-IN")}
                </div>

                <p className="text-xs text-gray-500 mt-1">Revenue</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-purple-50 flex items-center justify-center mb-5">
            <Trophy size={40} className="text-purple-500" />
          </div>

          <h3 className="text-xl font-bold text-gray-700">No Product Data</h3>

          <p className="text-sm text-gray-500 mt-2">
            Product analytics will appear here
          </p>
        </div>
      )}
    </div>
  );
}
