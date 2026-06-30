import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Printer, Trash2 } from "lucide-react";

import { useOrder } from "../hooks/orders/useOrder";
import { useDeleteOrder } from "../hooks/orders/useDeleteOrder";
import { useCustomer } from "../hooks/customers/useCustomer";
import "./invoice.css";

export default function OrderDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: order, isLoading, isError } = useOrder(id);

  const { data: customer } = useCustomer(order?.customer_id);

  const deleteOrderMutation = useDeleteOrder();

  const handleDelete = () => {
    const confirmDelete = window.confirm("Delete this invoice?");

    if (!confirmDelete) return;

    deleteOrderMutation.mutate(id, {
      onSuccess: () => {
        navigate("/admin/orders");
      },
    });
  };
  // =========================================
  // PRINT
  // =========================================

  const printInvoice = () => {
    window.print();
  };

  // =========================================
  // LOADING
  // =========================================

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }
  if (isError) {
    return <div className="p-6">Failed to load invoice</div>;
  }
  if (!order) {
    return <div className="p-6">Invoice not found</div>;
  }

  // =========================================
  // TOTALS
  // =========================================

  const subtotal = Number(order.subtotal || 0);

  const discountAmount = Number(order.discount_amount || 0);

  const gstAmount = Number(order.gst_amount || 0);

  const total = Number(order.total || 0);

  const paidAmount = Number(order.paid_amount || 0);

  const dueAmount = Number(order.due_amount || 0);

  // =========================================
  // UI
  // =========================================

  return (
    <div className="bg-slate-200 min-h-screen p-3 print:bg-white print:p-0">
      {/* ACTIONS */}

      <div className="max-w-[210mm] mx-auto flex justify-between items-center mb-3 print:hidden">
        <div>
          <h1 className="text-xl font-bold">Invoice</h1>

          <p className="text-xs text-gray-600">{order.order_code}</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => navigate("/admin/orders")}
            className="bg-white px-3 py-2 rounded border"
          >
            <ArrowLeft size={16} />
          </button>

          <button
            onClick={printInvoice}
            className="bg-black text-white px-4 py-2 rounded text-sm"
          >
            <Printer size={16} />
          </button>

          <button
            onClick={handleDelete}
            disabled={deleteOrderMutation.isPending}
            className="bg-red-600 text-white px-4 py-2 rounded text-sm"
          >
            {deleteOrderMutation.isPending ? (
              "Deleting..."
            ) : (
              <Trash2 size={16} />
            )}
          </button>
        </div>
      </div>

      {/* INVOICE */}

      <div
        id="invoice"
        className="
          w-[210mm]
          min-h-[297mm]
          mx-auto
          bg-white
          text-black
          shadow-xl

          print:w-full
          print:min-h-0
          print:shadow-none
        "
      >
        {/* HEADER */}

        <div className="px-6 pt-5 pb-4 border-b border-gray-300">
          <div className="flex justify-between items-start">
            {/* LEFT */}

            <div>
              <p className="uppercase text-[9px] tracking-[4px] text-gray-500 mb-1">
                Tax Invoice
              </p>

              <h1 className="text-[28px] font-bold leading-none">
                Parveen & Co.
              </h1>
            </div>

            {/* RIGHT */}

            <div className="text-right text-[11px] leading-5">
              <p>
                <span className="font-semibold">Invoice:</span>{" "}
                {order.order_code}
              </p>

              <p>
                <span className="font-semibold">Date:</span>{" "}
                {new Date(order.created_at).toLocaleDateString()}
              </p>

              <p className="capitalize">
                <span className="font-semibold">Payment:</span>{" "}
                {order.payment_status}
              </p>
            </div>
          </div>
        </div>

        {/* BILL TO + FROM */}

        <div className="px-6 py-3 border-b border-gray-300">
          <div className="grid grid-cols-2 gap-6">
            {/* BILL TO */}

            <div>
              <h3 className="uppercase text-[9px] tracking-[2px] text-gray-500 mb-1">
                Bill To
              </h3>

              <h2 className="font-bold text-[15px] uppercase leading-tight">
                {customer?.name || order.customer_name}
              </h2>

              <div className="mt-1 text-[10px] leading-4 text-gray-700">
                <p>{customer?.phone || "-"}</p>

                <p>{customer?.address_line_1 || "Customer Address"}</p>

                {customer?.address_line_2 && <p>{customer.address_line_2}</p>}

                <p>
                  {customer?.city}, {customer?.state}
                </p>

                <p>{customer?.country || "India"}</p>

                <p className="mt-0.5">GST: {customer?.gst_number || "-"}</p>
              </div>
            </div>

            {/* FROM */}

            <div className="text-right">
              <h3 className="uppercase text-[9px] tracking-[2px] text-gray-500 mb-1">
                From
              </h3>

              <h2 className="font-bold text-[15px] uppercase leading-tight">
                Parveen & Co.
              </h2>

              <div className="mt-1 text-[10px] leading-4 text-gray-700">
                <p className="font-semibold uppercase">
                  Beverage Manufacturing
                </p>

                <p>Shamli, Uttar Pradesh</p>

                <p>India</p>

                <p>GSTIN: 09ABCDE1234F1Z5</p>

                <p>+91 90342 51034</p>
              </div>
            </div>
          </div>
        </div>

        {/* PRODUCTS */}

        <div className="px-6 py-3">
          <table className="w-full border-collapse text-[11px]">
            <thead>
              <tr className="bg-gray-100 border border-gray-300 uppercase">
                <th className="text-left px-2 py-2">Product</th>

                <th className="text-center px-2 py-2 w-17.5">Qty</th>

                <th className="text-right px-2 py-2 w-25">Price</th>

                <th className="text-right px-2 py-2 w-27.5">Total</th>
              </tr>
            </thead>

            <tbody>
              {order.items?.map((item) => (
                <tr key={item.id} className="border-b border-gray-200">
                  <td className="px-2 py-1.5">
                    <p className="font-semibold leading-4">
                      {item.product_name}
                    </p>

                    <p className="text-[9px] text-gray-500">
                      {item.quantity / 13} bundle • {item.quantity} pcs
                    </p>
                  </td>

                  <td className="text-center px-2 py-1.5">{item.quantity}</td>

                  <td className="text-right px-2 py-1.5">
                    ₹{Number(item.unit_price).toFixed(2)}
                  </td>

                  <td className="text-right px-2 py-1.5 font-semibold">
                    ₹{Number(item.total_price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* TOTALS */}

        <div className="px-6 pb-3 flex justify-end">
          <div className="w-55 text-[10px]">
            <div className="flex justify-between py-0.5">
              <span className="text-gray-600">Subtotal</span>

              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between py-0.5">
              <span className="text-gray-600">GST</span>

              <span>₹{gstAmount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between py-0.5">
              <span className="text-gray-600">Discount</span>

              <span>- ₹{discountAmount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between py-0.5">
              <span className="text-gray-600">Paid</span>

              <span>₹{paidAmount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between py-0.5 text-red-600">
              <span>Due</span>

              <span className="font-semibold">₹{dueAmount.toFixed(2)}</span>
            </div>

            {/* FINAL TOTAL */}

            <div className="border-t border-gray-400 mt-1 pt-1 flex justify-between items-center">
              <span className="font-bold text-[13px]">TOTAL</span>

              <span className="font-bold text-[15px]">₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* SIGN */}

        <div className="px-6 pb-4">
          <div className="flex justify-end">
            <div className="w-40 text-center">
              <br />
              <div className="border-t border-black pt-1 text-[10px]">
                Authorized Signature
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}

        <div className="border-t border-gray-300 text-center text-[9px] py-2 text-gray-600">
          Powered by <span className="font-semibold">Parveen ERP</span>
        </div>
      </div>
    </div>
  );
}
