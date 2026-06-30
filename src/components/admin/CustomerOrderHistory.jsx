import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useCustomerOrderHistory } from "../../hooks/orders/useCustomerOrderHistory";
import { useUpdateOrderStatus } from "../../hooks/orders/useUpdateOrderStatus";
import { useUpdatePaymentStatus } from "../../hooks/orders/useUpdatePaymentStatus";
import { useCancelOrder } from "../../hooks/orders/useCancelOrder";

import Pagination from "../common/Pagination";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

import {
  Phone,
  Search,
  Eye,
  AlertCircle,
  XCircle,
  ArrowLeft,
} from "lucide-react";

export default function CustomerOrderHistory() {
  const { id: customerId } = useParams();
  const navigate = useNavigate();

  // ======================================
  // STATES
  // ======================================

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("");

  const [paymentStatus, setPaymentStatus] = useState("");

  // PAYMENT MODAL

  const [paymentModal, setPaymentModal] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState(null);

  const [partialAmount, setPartialAmount] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("cash");

  // ======================================
  // FETCH HISTORY
  // ======================================
  const [page, setPage] = useState(1);

  const { data, isLoading } = useCustomerOrderHistory({
    customerId,
    page,
    limit: 10,
  });

  const customer = data?.data?.customer || {};

  const summary = data?.data?.summary || {};

  const orders = data?.data?.orders || [];
  const totalPages = data?.totalPages || 1;
  const updateStatusMutation = useUpdateOrderStatus();

  const updatePaymentMutation = useUpdatePaymentStatus();

  const cancelMutation = useCancelOrder(); // ======================================
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
  // COLORS
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

      // INSTANT UI UPDATE
    } catch (err) {
      console.error(err);

      toast.error(err?.response?.data?.error || "Failed to cancel order");
    }
  };

  // ======================================
  // PARTIAL PAYMENT
  // ======================================
  const submitPartialPayment = () => {
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
        },
      },
    );
  };
  // ======================================
  // LOADING
  // ======================================

  if (isLoading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  // ======================================
  // ERROR
  // ======================================

  if (!data) {
    return (
      <div className="bg-white border rounded-3xl p-12 text-center">
        <AlertCircle size={60} className="mx-auto text-red-500 mb-4" />

        <h2 className="text-2xl font-bold text-gray-700 mb-2">
          Failed to Load History
        </h2>

        <p className="text-gray-500">Unable to fetch customer order history</p>
      </div>
    );
  }

  // ======================================
  // FILTERS
  // ======================================

  const filteredOrders = (orders || []).filter((order) => {
    const matchesSearch = order.order_code
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus = status ? order.order_status === status : true;

    const matchesPayment = paymentStatus
      ? order.payment_status === paymentStatus
      : true;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  // ======================================
  // UI
  // ======================================
  return (
    <div className="space-y-6 p-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link
            onClick={() => navigate(-1)}
            className="h-11 w-11 rounded-xl bg-white border flex items-center justify-center hover:bg-gray-100 transition"
          >
            <ArrowLeft size={20} />
          </Link>

          <div>
            <h1 className="text-3xl font-bold text-gray-800">Order History</h1>

            <p className="text-gray-500 mt-1">View customer's Order History</p>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-3xl shadow-sm overflow-hidden">
        <div className="p-6 border-b bg-linear-to-r from-indigo-50 to-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div className="flex items-center gap-5">
              <div className="h-24 w-24 rounded-3xl bg-linear-to-r from-indigo-500 to-indigo-700 text-white flex items-center justify-center text-4xl font-bold shadow-lg">
                {(customer?.name || "U")?.charAt(0).toUpperCase()}
              </div>

              <div>
                <h2 className="text-4xl font-bold text-gray-800 capitalize">
                  {customer?.name || "Unknown Customer"}
                </h2>

                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium">
                    Customer Code: {customer?.customer_code || "N/A"}
                  </span>

                  <span className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium capitalize">
                    {customer?.customer_type || "Distributor"}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border rounded-2xl px-6 py-5 min-w-37.5 shadow-sm">
                <p className="text-sm text-gray-500 mb-2">Total Orders</p>

                <h3 className="text-3xl font-bold text-indigo-600">
                  {summary?.total_orders || 0}
                </h3>
              </div>

              <div className="bg-white border rounded-2xl px-6 py-5 min-w-37.5 shadow-sm">
                <p className="text-sm text-gray-500 mb-2">Total Spent</p>

                <h3 className="text-3xl font-bold text-green-600">
                  {formatCurrency(summary?.total_spent || 0)}
                </h3>
              </div>

              <div className="bg-white border rounded-2xl px-6 py-5 min-w-37.5 shadow-sm">
                <p className="text-sm text-gray-500 mb-2">Pending Due</p>

                <h3 className="text-3xl font-bold text-red-600">
                  {formatCurrency(summary?.total_due || 0)}
                </h3>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-6">
          <div className="border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Phone size={18} className="text-indigo-600" />

              <p className="text-sm text-gray-500">Phone Number</p>
            </div>

            <h4 className="font-semibold text-2xl text-gray-800">
              {customer?.phone || "N/A"}
            </h4>
          </div>

          <div className="border rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-gray-500 mb-2">Current Balance</p>

            <h4 className="font-semibold text-2xl text-red-600">
              {formatCurrency(customer?.current_balance || 0)}
            </h4>
          </div>

          <div className="border rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-gray-500 mb-2">Last Order</p>

            <h4 className="font-semibold text-2xl text-gray-800">
              {formatDate(summary?.last_order_date)}
            </h4>
          </div>
        </div>
      </div>

      {/* KEEP YOUR EXISTING TABLE BELOW THIS */}

      {/* FILTERS */}

      <div className="bg-white border rounded-3xl p-5 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-3 text-gray-400" />

            <input
              type="text"
              placeholder="Search order..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-xl pl-10 pr-3 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
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
            <option value="cancelled">cancelled</option>

            <option value="completed">Completed</option>
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
            Total Orders: {filteredOrders.length}
          </div>
        </div>
      </div>

      {/* TABLE */}

      <div className="bg-white border rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-300">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-5">Order</th>

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
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-24">
                    <div className="flex flex-col items-center justify-center">
                      <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mb-5">
                        <AlertCircle size={42} className="text-gray-400" />
                      </div>

                      <h3 className="text-3xl font-bold text-gray-700 mb-2">
                        No Orders Found
                      </h3>

                      <p className="text-gray-500 text-lg">
                        This customer has no order history yet.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
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
                    isCancelled ? "line-through text-gray-400" : "text-gray-800"
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
                  shadow-sm
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
                            {/* PAYMENT SELECT */}

                            <select
                              value={order.payment_status || "unpaid"}
                              onChange={(e) => {
                                const value = e.target.value;

                                // ======================================
                                // PARTIAL PAYMENT
                                // ======================================

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

                                // ======================================
                                // NORMAL PAYMENT STATUS
                                // ======================================

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

                            {/* EDIT PARTIAL BUTTON */}

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
                          {/* VIEW */}

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

                          {/* CANCEL */}

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
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
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
