import {
  Clock3,
  PackageCheck,
  Truck,
  XCircle,
  ShoppingBag,
} from "lucide-react";

import { useOrderStatus } from "../../hooks/dashboard/useOrderStatus";

const statusConfig = {
  pending: {
    icon: Clock3,
    color: "text-yellow-600",
    bg: "bg-yellow-100",
  },

  processing: {
    icon: PackageCheck,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },

  shipped: {
    icon: Truck,
    color: "text-cyan-600",
    bg: "bg-cyan-100",
  },

  completed: {
    icon: ShoppingBag,
    color: "text-green-600",
    bg: "bg-green-100",
  },

  cancelled: {
    icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-100",
  },
};

export default function OrderStatusChart() {
  const { data: statuses = [], isLoading } = useOrderStatus();

  const totalOrders = statuses.reduce((sum, item) => sum + item.count, 0);

  if (isLoading) {
    return <div className="bg-white rounded-2xl border p-6">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Order Status</h2>

        <p className="text-sm text-gray-500">Order workflow analytics</p>
      </div>

      <div className="space-y-4">
        {statuses.map((item) => {
          const config = statusConfig[item.status] || {};

          const Icon = config.icon || ShoppingBag;

          const percentage =
            totalOrders > 0 ? (item.count / totalOrders) * 100 : 0;

          return (
            <div key={item.status}>
              {/* Row */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${config.bg}`}>
                    <Icon size={18} className={config.color} />
                  </div>

                  <div>
                    <p className="font-medium capitalize">{item.status}</p>

                    <p className="text-xs text-gray-500">{item.count} Orders</p>
                  </div>
                </div>

                <span className="font-bold">{percentage.toFixed(0)}%</span>
              </div>

              {/* Progress */}
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Total Orders</span>

          <span className="font-bold">{totalOrders}</span>
        </div>
      </div>
    </div>
  );
}
