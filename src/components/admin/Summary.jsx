export default function Summary({ data }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      <Card title="Products" value={data?.total_products ?? 0} />
      <Card title="Items" value={data?.total_items ?? 0} />
      <Card title="Out" value={data?.out_of_stock ?? 0} />
      <Card title="Low" value={data?.low_stock ?? 0} />
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white shadow p-4 rounded">
      <p className="text-gray-500">{title}</p>
      <h2 className="text-xl font-bold">{value}</h2>
    </div>
  );
}
