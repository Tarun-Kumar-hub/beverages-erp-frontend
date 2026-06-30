import { FlaskConical, Droplets, PackageCheck } from "lucide-react";
import { useContainerStatus } from "../../hooks/dashboard/useContainerStatus";

const ContainerStatus = () => {
  const { data: containers = [], isLoading } = useContainerStatus();

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        Loading Containers...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 md:p-6">
      {/* Header */}

      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg md:text-2xl font-bold text-gray-900">
            Container Status
          </h2>

          <p className="text-xs md:text-sm text-gray-500">
            Active production containers
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-cyan-50 text-cyan-700 text-xs md:text-sm font-semibold">
          {containers.length}
        </div>
      </div>

      {containers.length > 0 ? (
        <div className="space-y-4">
          {containers.map((item) => (
            <div
              key={item.id}
              className="
                border
                border-gray-100
                rounded-2xl
                p-4
                bg-white
                shadow-sm
              "
            >
              {/* Top Section */}

              <div className="flex items-start gap-3">
                <div
                  className="
                    w-10
                    h-10
                    rounded-xl
                    bg-cyan-50
                    flex
                    items-center
                    justify-center
                    shrink-0
                  "
                >
                  <FlaskConical size={18} className="text-cyan-600" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-gray-900 truncate">
                    {item.container_code}
                  </h3>

                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {item.flavour}
                  </p>

                  <div className="mt-2">
                    <span
                      className="
                        inline-flex
                        px-2.5
                        py-1
                        rounded-full
                        bg-green-100
                        text-green-700
                        text-[11px]
                        font-medium
                        capitalize
                      "
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats */}

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center gap-1 mb-1">
                    <Droplets size={14} className="text-cyan-600" />
                    <span className="text-[11px] text-gray-500">Capacity</span>
                  </div>

                  <p className="text-base font-bold text-gray-900">
                    {item.size}L
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center gap-1 mb-1">
                    <PackageCheck size={14} className="text-green-600" />
                    <span className="text-[11px] text-gray-500">Remaining</span>
                  </div>

                  <p className="text-base font-bold text-gray-900">
                    {(item.remaining_volume / 1000).toFixed(1)}L
                  </p>
                </div>
              </div>

              {/* Progress */}

              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-500">
                    Remaining Volume
                  </span>

                  <span className="text-xs font-semibold text-gray-900">
                    {item.remaining_percentage}%
                  </span>
                </div>

                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="
                      h-full
                      rounded-full
                      bg-linear-to-r
                      from-cyan-500
                      to-blue-500
                    "
                    style={{
                      width: `${item.remaining_percentage}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-cyan-50 flex items-center justify-center mb-4">
            <FlaskConical size={28} className="text-cyan-500" />
          </div>

          <h3 className="font-semibold text-gray-700">No Active Containers</h3>

          <p className="text-sm text-gray-500 mt-1">
            Active production containers will appear here
          </p>
        </div>
      )}
    </div>
  );
};

export default ContainerStatus;
