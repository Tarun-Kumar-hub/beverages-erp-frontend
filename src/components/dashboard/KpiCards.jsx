import React from "react";
import {
  IndianRupee,
  Receipt,
  CreditCard,
  Package,
  AlertTriangle,
  FlaskConical,
  Warehouse,
} from "lucide-react";
// =========================================
// SINGLE CARD
// =========================================

const Card = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-5 flex items-center justify-between hover:shadow-md transition-all">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h2 className="text-3xl font-bold mt-2 text-gray-800">{value}</h2>
      </div>

      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color}`}
      >
        {icon}
      </div>
    </div>
  );
};

// =========================================
// KPI CARDS
// =========================================

const KpiCards = ({ kpis }) => {
  return (
    <div
      className="
    grid
    grid-cols-1
    sm:grid-cols-2
    lg:grid-cols-3
    xl:grid-cols-4
    gap-6
  "
    >
      <Card
        title="Today Revenue"
        value={`₹${kpis?.today_revenue ?? 0}`}
        icon={<IndianRupee size={28} className="text-green-600" />}
        color="bg-green-100"
      />

      <Card
        title="Today Orders"
        value={kpis?.today_orders ?? 0}
        icon={<Receipt size={28} className="text-blue-600" />}
        color="bg-blue-100"
      />

      <Card
        title="Pending Payments"
        value={`₹${kpis?.pending_payments ?? 0}`}
        icon={<CreditCard size={28} className="text-yellow-600" />}
        color="bg-yellow-100"
      />

      <Card
        title="Low Stock Products"
        value={kpis?.low_stock_products ?? 0}
        icon={<Package size={28} className="text-red-600" />}
        color="bg-red-100"
      />

      <Card
        title="Low Stock Materials"
        value={kpis?.low_stock_materials ?? 0}
        icon={<AlertTriangle size={28} className="text-orange-600" />}
        color="bg-orange-100"
      />

      <Card
        title="Active Containers"
        value={kpis?.active_containers ?? 0}
        icon={<FlaskConical size={28} className="text-cyan-600" />}
        color="bg-cyan-100"
      />

      <Card
        title="Total Product Stock"
        value={kpis?.total_products_stock ?? 0}
        icon={<Warehouse size={28} className="text-purple-600" />}
        color="bg-purple-100"
      />
    </div>
  );
};

export default KpiCards;
