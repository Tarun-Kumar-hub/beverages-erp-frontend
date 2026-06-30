import KpiCards from "../components/dashboard/KpiCards";
import OrderStatusChart from "../components/dashboard/OrderStatusChart";
import LowStockTable from "../components/dashboard/LowStockTable";
import ContainerStatus from "../components/dashboard/ContainerStatus";
import TopProducts from "../components/dashboard/TopProducts";

import { useDashboardKpis } from "../hooks/dashboard/useDashboardKpis";

const Dashboard = () => {
  const { data: kpis, isLoading } = useDashboardKpis();

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500">ERP Analytics Overview</p>
      </div>

      {/* KPI CARDS */}
      <KpiCards kpis={kpis} />

      <div>
        <OrderStatusChart />
      </div>

      <LowStockTable />
      <ContainerStatus />
      <TopProducts />
    </div>
  );
};

export default Dashboard;
