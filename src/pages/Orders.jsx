import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
import toast from "react-hot-toast";

import { Eye, Plus, Search, AlertCircle, XCircle } from "lucide-react";
import { useOrders } from "../hooks/orders/useOrders";
import { useUpdateOrderStatus } from "../hooks/orders/useUpdateOrderStatus";
import { useUpdatePaymentStatus } from "../hooks/orders/useUpdatePaymentStatus";
import { useCancelOrder } from "../hooks/orders/useCancelOrder";
import Pagination from "../components/common/Pagination";
export default function Orders() {
  const navigate = useNavigate();

  // ======================================
  // STATES
  // ======================================

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("");

  const [paymentStatus, setPaymentStatus] = useState("");

  // ======================================
  // PAYMENT MODAL
  // ======================================

  const [paymentModal, setPaymentModal] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState(null);

  const [partialAmount, setPartialAmount] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("cash");

  // ======================================
  // FETCH ORDERS
  // ======================================

  const [page, setPage] = useState(1);

  const { data, isLoading } = useOrders({
    page,
    limit: 10,
    search,
    status,
    payment_status: paymentStatus,
  });

  const orders = data?.data || [];

  const totalPages = data?.totalPages || 1;

  const updateStatusMutation = useUpdateOrderStatus();

  const updatePaymentMutation = useUpdatePaymentStatus();

  const cancelMutation = useCancelOrder();
  // ======================================
  // FORMATTERS
  // ======================================

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(Number(amount || 0));
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ======================================
  // STATUS COLORS
  // ======================================

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";

      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";

      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";

      case "processing":
        return "bg-blue-100 text-blue-700 border-blue-200";

      case "confirmed":
        return "bg-indigo-100 text-indigo-700 border-indigo-200";

      case "shipped":
        return "bg-purple-100 text-purple-700 border-purple-200";

      case "delivered":
        return "bg-cyan-100 text-cyan-700 border-cyan-200";

      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getPaymentColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700 border-green-200";

      case "partial":
        return "bg-orange-100 text-orange-700 border-orange-200";

      case "unpaid":
        return "bg-red-100 text-red-700 border-red-200";

      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // ======================================
  // UPDATE STATUS
  // ======================================

  const updateOrderStatus = (id, field, value) => {
    if (field === "order_status") {
      updateStatusMutation.mutate({
        id,
        payload: {
          order_status: value,
        },
      });
    }

    if (field === "payment_status") {
      updatePaymentMutation.mutate({
        id,
        payload: {
          payment_status: value,
        },
      });
    }
  };
  // ======================================
  // CANCEL ORDER
  // ======================================

  const cancelOrder = async (order) => {
    try {
      const result = await Swal.fire({
        title: "Cancel Order?",
        text: "Stock will be restored automatically.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        confirmButtonText: "Yes, Cancel",
      });

      if (!result.isConfirmed) return;

      cancelMutation.mutate(order.id);

      toast.success("Order cancelled successfully");
    } catch (err) {
      console.error(err);

      toast.error(err?.response?.data?.error || "Failed to cancel order");
    }
  };

  // ======================================
  // PARTIAL PAYMENT
  // ======================================

  const submitPartialPayment = async () => {
    try {
      if (!partialAmount) {
        return toast.error("Enter paid amount");
      }

      const amount = Number(partialAmount);

      if (amount <= 0) {
        return toast.error("Invalid amount");
      }

      if (amount >= Number(selectedOrder?.total)) {
        return toast.error("Partial amount must be less than total");
      }
      updatePaymentMutation.mutate(
        {
          id: selectedOrder.id,
          payload: {
            payment_status: "partial",
            paid_amount: amount,
            payment_method: paymentMethod,
          },
        },
        {
          onSuccess: () => {
            setPaymentModal(false);

            setSelectedOrder(null);

            setPartialAmount("");

            setPaymentMethod("cash");

            toast.success("Payment updated");
          },
        },
      );
    } catch (err) {
      console.error(err);

      toast.error(err?.response?.data?.error || "Payment update failed");
    }
  };

  useEffect(() => {
    setPage(1);
  }, [search, status, paymentStatus]);
  // ======================================
  // UI
  // ======================================

  return (
    <div className="w-full max-w-full space-y-6 p-4 md:p-6 overflow-x-hidden">
      {" "}
      {/* HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Orders</h1>

          <p className="text-gray-500 mt-1">Manage all customer orders</p>
        </div>

        <button
          onClick={() => navigate("/admin/orders/create")}
          className="
            flex
            items-center
            gap-2
            bg-indigo-600
            hover:bg-indigo-700
            text-white
            px-6
            py-3
            rounded-2xl
            shadow-sm
            transition
          "
        >
          <Plus size={18} />
          Create Order
        </button>
      </div>
      {/* FILTERS */}
      <div className="bg-white border rounded-3xl p-5 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {" "}
          <div className="relative">
            <Search size={18} className="absolute left-3 top-3 text-gray-400" />

            <input
              type="text"
              placeholder="Search order..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full
                border
                rounded-xl
                pl-10
                pr-3
                py-3
                outline-none
                focus:ring-2
                focus:ring-indigo-500
              "
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded-xl px-3 py-3"
          >
            <option value="">All Status</option>

            <option value="pending">Pending</option>

            <option value="confirmed">Confirmed</option>

            <option value="processing">Processing</option>

            <option value="shipped">Shipped</option>

            <option value="delivered">Delivered</option>

            <option value="completed">Completed</option>

            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            className="border rounded-xl px-3 py-3"
          >
            <option value="">All Payments</option>

            <option value="paid">Paid</option>

            <option value="partial">Partial</option>

            <option value="unpaid">Unpaid</option>
          </select>
          <div className="flex items-center justify-center bg-gray-100 rounded-xl font-semibold">
            Total Orders: {data?.total || 0}
          </div>
        </div>
      </div>
      {/* TABLE */}
      <div className="bg-white border rounded-3xl shadow-sm">
        <div className="w-full overflow-x-auto">
          <table className="min-w-300 w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-5">Order</th>

                <th className="text-left p-5">Customer</th>

                <th className="text-left p-5">Status</th>

                <th className="text-left p-5">Payment</th>

                <th className="text-left p-5">Total</th>

                <th className="text-left p-5">Paid</th>

                <th className="text-left p-5">Due</th>

                <th className="text-left p-5">Date</th>

                <th className="text-center p-5">Action</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="py-24 text-center">
                    Loading...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-24">
                    <div className="flex flex-col items-center justify-center">
                      <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mb-5">
                        <AlertCircle size={42} className="text-gray-400" />
                      </div>

                      <h3 className="text-3xl font-bold text-gray-700 mb-2">
                        No Orders Found
                      </h3>

                      <p className="text-gray-500 text-lg">
                        No orders available.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const isCancelled = order.order_status === "cancelled";

                  return (
                    <tr
                      key={order.id}
                      className={`
                        border-t
                        transition-all
                        duration-200

                        ${
                          isCancelled
                            ? "bg-linear-to-r from-red-50 to-white opacity-80"
                            : "hover:bg-indigo-50/40"
                        }
                      `}
                    >
                      {/* ORDER */}

                      <td className="p-5">
                        <div className="flex flex-col">
                          <span
                            className={`
                              text-base
                              font-bold
                              tracking-wide

                              ${
                                isCancelled
                                  ? "line-through text-gray-400"
                                  : "text-gray-800"
                              }
                            `}
                          >
                            {order.order_code || "N/A"}
                          </span>

                          <span className="text-xs text-gray-400 mt-1">
                            #{order.id?.slice(0, 8)}
                          </span>
                        </div>
                      </td>

                      {/* CUSTOMER */}

                      <td className="p-5">
                        <div className="flex flex-col">
                          <span className="font-semibold capitalize text-gray-800">
                            {order.customer_name}
                          </span>

                          <span className="text-xs text-gray-500 mt-1">
                            {order.customer_phone}
                          </span>
                        </div>
                      </td>

                      {/* STATUS */}

                      <td className="p-5">
                        {isCancelled ? (
                          <div
                            className="
                              inline-flex
                              items-center
                              gap-2
                              px-4
                              py-2
                              rounded-2xl
                              bg-red-100
                              text-red-700
                              border
                              border-red-200
                              text-xs
                              font-bold
                            "
                          >
                            <XCircle size={14} />
                            Cancelled
                          </div>
                        ) : (
                          <select
                            value={order.order_status || "pending"}
                            onChange={(e) =>
                              updateOrderStatus(
                                order.id,
                                "order_status",
                                e.target.value,
                              )
                            }
                            className={`
                              px-4
                              py-2
                              rounded-2xl
                              text-xs
                              font-bold
                              border-0
                              outline-none
                              capitalize
                              shadow-sm
                              cursor-pointer
                              transition
                              ${getStatusColor(order.order_status)}
                            `}
                          >
                            <option value="pending">Pending</option>

                            <option value="confirmed">Confirmed</option>

                            <option value="processing">Processing</option>

                            <option value="shipped">Shipped</option>

                            <option value="delivered">Delivered</option>

                            <option value="completed">Completed</option>
                          </select>
                        )}
                      </td>

                      {/* PAYMENT */}

                      <td className="p-5">
                        {isCancelled ? (
                          <div
                            className="
                              inline-flex
                              items-center
                              gap-2
                              px-4
                              py-2
                              rounded-2xl
                              bg-gray-100
                              text-gray-500
                              border
                              text-xs
                              font-bold
                            "
                          >
                            Locked
                          </div>
                        ) : (
                          <div className="flex flex-col gap-2">
                            <select
                              value={order.payment_status || "unpaid"}
                              onChange={(e) => {
                                const value = e.target.value;

                                if (value === "partial") {
                                  setSelectedOrder(order);

                                  setPartialAmount(
                                    Number(order.paid_amount || 0),
                                  );

                                  setPaymentMethod(
                                    order.payment_method || "cash",
                                  );

                                  setPaymentModal(true);

                                  return;
                                }

                                updateOrderStatus(
                                  order.id,
                                  "payment_status",
                                  value,
                                );
                              }}
                              className={`
                                px-4
                                py-2
                                rounded-2xl
                                text-xs
                                font-bold
                                border-0
                                outline-none
                                capitalize
                                shadow-sm
                                cursor-pointer
                                transition
                                ${getPaymentColor(order.payment_status)}
                              `}
                            >
                              <option value="unpaid">Unpaid</option>

                              <option value="partial">Partial</option>

                              <option value="paid">Paid</option>
                            </select>

                            {order.payment_status === "partial" && (
                              <button
                                onClick={() => {
                                  setSelectedOrder(order);

                                  setPartialAmount(
                                    Number(order.paid_amount || 0),
                                  );

                                  setPaymentMethod(
                                    order.payment_method || "cash",
                                  );

                                  setPaymentModal(true);
                                }}
                                className="
                                  text-xs
                                  font-semibold
                                  text-indigo-600
                                  hover:text-indigo-800
                                  transition
                                  text-left
                                  pl-1
                                "
                              >
                                Edit Partial Payment
                              </button>
                            )}
                          </div>
                        )}
                      </td>

                      {/* TOTAL */}

                      <td className="p-5">
                        <div className="font-bold text-gray-800 text-base">
                          {formatCurrency(order.total)}
                        </div>
                      </td>

                      {/* PAID */}

                      <td className="p-5">
                        <div className="font-bold text-green-600 text-base">
                          {formatCurrency(order.paid_amount)}
                        </div>
                      </td>

                      {/* DUE */}

                      <td className="p-5">
                        <div
                          className={`
                            font-bold
                            text-base

                            ${
                              Number(order.due_amount) > 0
                                ? "text-red-600"
                                : "text-gray-400"
                            }
                          `}
                        >
                          {formatCurrency(order.due_amount)}
                        </div>
                      </td>

                      {/* DATE */}

                      <td className="p-5">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-700">
                            {formatDate(order.created_at)}
                          </span>

                          <span className="text-xs text-gray-400 mt-1">
                            {new Date(order.created_at).toLocaleTimeString(
                              "en-IN",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </span>
                        </div>
                      </td>

                      {/* ACTION */}

                      <td className="p-5">
                        <div className="flex items-center justify-center gap-3">
                          <Link
                            to={`/admin/orders/${order.id}`}
                            className="
                              h-11
                              w-11
                              rounded-2xl
                              bg-indigo-100
                              text-indigo-600
                              flex
                              items-center
                              justify-center
                              hover:bg-indigo-600
                              hover:text-white
                              transition-all
                              duration-200
                              shadow-sm
                            "
                          >
                            <Eye size={18} />
                          </Link>

                          {!isCancelled && (
                            <button
                              onClick={() => cancelOrder(order)}
                              className="
                                h-11
                                px-4
                                rounded-2xl
                                bg-red-100
                                text-red-600
                                hover:bg-red-600
                                hover:text-white
                                transition-all
                                duration-200
                                flex
                                items-center
                                gap-2
                                text-sm
                                font-bold
                                shadow-sm
                              "
                            >
                              <XCircle size={16} />
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* PAYMENT MODAL */}
      {paymentModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-2xl font-bold mb-1">Partial Payment</h2>

            <p className="text-sm text-gray-500 mb-6">
              {selectedOrder?.order_code}
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Total Amount
              </label>

              <div className="border rounded-lg px-3 py-2 bg-gray-50 font-semibold">
                ₹{Number(selectedOrder?.total || 0).toFixed(2)}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Paid Amount
              </label>

              <input
                type="number"
                value={partialAmount}
                onChange={(e) => setPartialAmount(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">
                Payment Method
              </label>

              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="cash">Cash</option>

                <option value="upi">UPI</option>

                <option value="bank_transfer">Bank Transfer</option>

                <option value="card">Card</option>
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setPaymentModal(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={submitPartialPayment}
                className="
                  bg-indigo-600
                  hover:bg-indigo-700
                  text-white
                  px-4
                  py-2
                  rounded-lg
                "
              >
                Save Payment
              </button>
            </div>
          </div>
        </div>
      )}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
