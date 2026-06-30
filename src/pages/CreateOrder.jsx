import { useEffect, useMemo, useState } from "react";
import { Trash2, PackageOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCreateOrder } from "../hooks/orders/useCreateOrder";
import { useSearchCustomers } from "../hooks/customers/useSearchCustomers";
import { useProducts } from "../hooks/products/useProducts";

export default function CreateOrder() {
  const navigate = useNavigate();

  // ======================================
  // STATES
  // ======================================

  const [customer, setCustomer] = useState(null);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [quantity, setQuantity] = useState(1);

  const [customPrice, setCustomPrice] = useState("");

  const [items, setItems] = useState([]);

  const [discountPercentage, setDiscountPercentage] = useState("");

  const [gstPercentage, setGstPercentage] = useState(18);

  const [paidAmount, setPaidAmount] = useState("");

  const [notes, setNotes] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("");

  const [paymentStatus, setPaymentStatus] = useState("unpaid");

  const [orderStatus, setOrderStatus] = useState("pending");

  // ======================================
  // SEARCH CUSTOMERS
  // ======================================
  const [customerSearch, setCustomerSearch] = useState("");

  const { data: customerData } = useSearchCustomers({
    q: customerSearch,
    page: 1,
    limit: 20,
  });
  // ======================================
  // SEARCH PRODUCTS
  // ======================================

  const [productSearch, setProductSearch] = useState("");

  const { data: productData } = useProducts({
    page: 1,
    limit: 20,
    search: productSearch,
  });

  // ======================================
  // ADD ITEM
  // ======================================

  const addItem = () => {
    if (!selectedProduct) {
      return alert("Select product");
    }

    if (quantity <= 0) {
      return alert("Invalid bundles");
    }

    const product = selectedProduct.product;

    // 1 bundle = 13 pieces

    const actualPieces = quantity * 13;

    // stock check

    if (actualPieces > product.quantity) {
      return alert(
        `Only ${Math.floor(product.quantity / 12)} bundles available`,
      );
    }

    // duplicate check

    const existing = items.find((item) => item.product_id === product.id);

    if (existing) {
      return alert("Product already added");
    }

    const price = Number(customPrice || product.price);

    const item = {
      product_id: product.id,

      product_name: product.flavour,

      pouch_volume: product.pouch_volume,

      bundles: quantity,

      actual_quantity: actualPieces,

      unit_price: price,

      total_price: price * quantity,
    };

    setItems((prev) => [...prev, item]);

    setSelectedProduct(null);

    setQuantity(1);

    setCustomPrice("");
  };

  // ======================================
  // REMOVE ITEM
  // ======================================

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((item) => item.product_id !== productId));
  };

  // ======================================
  // TOTALS
  // ======================================

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.total_price, 0);
  }, [items]);

  const discountAmount = useMemo(() => {
    return (subtotal * Number(discountPercentage || 0)) / 100;
  }, [subtotal, discountPercentage]);

  const taxableAmount = subtotal - discountAmount;

  const gstAmount = useMemo(() => {
    return (taxableAmount * Number(gstPercentage || 0)) / 100;
  }, [taxableAmount, gstPercentage]);

  const total = taxableAmount + gstAmount;

  const dueAmount = Math.max(total - paidAmount, 0);

  // ======================================
  // AUTO PAYMENT STATUS
  // ======================================

  useEffect(() => {
    if (paidAmount <= 0) {
      setPaymentStatus("unpaid");
    } else if (paidAmount < total) {
      setPaymentStatus("partial");
    } else {
      setPaymentStatus("paid");
    }
  }, [paidAmount, total]);

  // ======================================
  // CREATE ORDER
  // ======================================
  const createOrderMutation = useCreateOrder();
  const handleCreateOrder = async () => {
    if (!customer) {
      return alert("Select customer");
    }

    if (!items.length) {
      return alert("Add products");
    }

    const payload = {
      customer_id: customer.value,

      payment_status: paymentStatus,

      order_status: orderStatus,

      payment_method: paymentMethod || null,

      discount_percentage: Number(discountPercentage || 0),

      gst_percentage: Number(gstPercentage || 0),

      paid_amount: Number(paidAmount || 0),

      notes,

      items: items.map((item) => ({
        product_id: item.product_id,
        quantity: item.bundles,
        unit_price: item.unit_price,
      })),
    };

    createOrderMutation.mutate(payload, {
      onSuccess: (res) => {
        navigate(`/admin/orders/${res.data.data.id}`);
      },
    });
  };
  // ======================================
  // UI
  // ======================================

  return (
    <div className="p-3 md:p-6">
      <div className="bg-white border rounded-xl shadow-sm p-3 md:p-6">
        <h1 className="text-xl md:text-2xl font-bold mb-6">Create Order</h1>

        {/* TOP */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* CUSTOMER */}

          <div>
            <label className="block mb-2 text-sm font-medium">Customer</label>

            <input
              type="text"
              value={customerSearch}
              onChange={(e) => {
                setCustomerSearch(e.target.value);
                setCustomer(null);
              }}
              placeholder="Search customer..."
              className="
w-full
border
rounded-lg
px-3
py-2
transition
focus:outline-none
focus:ring-2
focus:ring-indigo-500
focus:border-indigo-500
"
            />
            {customerSearch.trim() && !customer && (
              <div className="border rounded-lg mt-2 max-h-48 overflow-y-auto">
                {customerData?.customers?.length ? (
                  customerData?.customers?.map((customer) => (
                    <div
                      key={customer.id}
                      onClick={() => {
                        setCustomer({
                          value: customer.id,
                          customer,
                        });

                        setCustomerSearch(customer.name);
                      }}
                      className="p-2 cursor-pointer hover:bg-gray-100"
                    >
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-gray-500">{customer.phone}</p>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-gray-500">
                    👤 No customer found
                  </div>
                )}
              </div>
            )}
            {customer && (
              <p className="mt-2 text-sm text-green-600 wrap-break-word">
                Selected: {customer.customer.name}
              </p>
            )}
          </div>

          {/* ORDER STATUS */}

          <div>
            <label className="block mb-2 text-sm font-medium">
              Order Status
            </label>

            <select
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value)}
              className="
w-full
border
rounded-lg
px-3
py-2
transition
focus:outline-none
focus:ring-2
focus:ring-indigo-500
focus:border-indigo-500
"
            >
              <option value="pending">Pending</option>

              <option value="confirmed">Confirmed</option>

              <option value="processing">Processing</option>

              <option value="completed">Completed</option>

              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* PAYMENT METHOD */}

          <div>
            <label className="block mb-2 text-sm font-medium">
              Payment Method
            </label>

            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="
w-full
border
rounded-lg
px-3
py-2
transition
focus:outline-none
focus:ring-2
focus:ring-indigo-500
focus:border-indigo-500
"
            >
              <option value="">Select</option>

              <option value="cash">Cash</option>

              <option value="upi">UPI</option>

              <option value="bank_transfer">Bank Transfer</option>

              <option value="card">Card</option>
            </select>
          </div>

          {/* PAYMENT STATUS */}

          <div>
            <label className="block mb-2 text-sm font-medium">
              Payment Status
            </label>

            <input
              disabled
              value={paymentStatus}
              className="
w-full
border
rounded-lg
px-3
py-2
transition
focus:outline-none
focus:ring-2
focus:ring-indigo-500
focus:border-indigo-500
"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {/* PRODUCT */}
          <div className="lg:col-span-2 relative">
            <label className="block mb-2 text-sm font-medium">Product</label>

            <input
              type="text"
              value={productSearch}
              onChange={(e) => {
                setProductSearch(e.target.value);
                setSelectedProduct(null);
              }}
              placeholder="Search product..."
              className="
        w-full
        border
        rounded-lg
        px-3
        py-2
        transition
        focus:outline-none
        focus:ring-2
        focus:ring-indigo-500
        focus:border-indigo-500
      "
            />

            {productSearch.trim() && !selectedProduct && (
              <div
                className="
          absolute
          z-20
          mt-2
          w-full
          max-h-60
          overflow-y-auto
          rounded-xl
          border
          border-gray-200
          bg-white
          shadow-lg
        "
              >
                {productData?.products?.length ? (
                  productData.products.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        setSelectedProduct({
                          value: product.id,
                          product,
                        });

                        setProductSearch(
                          `${product.flavour} - ${product.pouch_volume}ml`,
                        );
                      }}
                      className="
                cursor-pointer
                p-3
                border-b
                last:border-b-0
                hover:bg-indigo-50
                transition
              "
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-800">
                            {product.flavour}
                          </p>

                          <p className="text-sm text-gray-500">
                            {product.pouch_volume} ml
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-xs text-gray-500">
                            Stock: {Math.floor(product.quantity / 13)} Bundles
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center">
                    <p className="mt-2 font-medium text-gray-700">
                      No Products Found
                    </p>

                    <p className="text-sm text-gray-500">
                      Try another product name.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* BUNDLES */}
          <div>
            <label className="block mb-2 text-sm font-medium">
              Bundles{" "}
              <span className="text-gray-500 font-normal">
                (1 Bundle = 13 Pieces)
              </span>
            </label>

            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="
        w-full
        border
        rounded-lg
        px-3
        py-2
        transition
        focus:outline-none
        focus:ring-2
        focus:ring-indigo-500
        focus:border-indigo-500
      "
            />
          </div>

          {/* PRICE */}
          <div>
            <label className="block mb-2 text-sm font-medium">
              Bundle Price
            </label>

            <input
              type="number"
              value={customPrice || selectedProduct?.product?.price || ""}
              onChange={(e) => setCustomPrice(e.target.value)}
              className="
        w-full
        border
        rounded-lg
        px-3
        py-2
        transition
        focus:outline-none
        focus:ring-2
        focus:ring-indigo-500
        focus:border-indigo-500
      "
            />
          </div>

          {/* BUTTON */}
          <div className="flex items-end">
            <button
              onClick={addItem}
              disabled={!selectedProduct}
              className="
        w-full
        rounded-lg
        bg-indigo-600
        px-4
        py-2.5
        font-medium
        text-white
        transition
        hover:bg-indigo-700
        disabled:bg-gray-300
        disabled:cursor-not-allowed
      "
            >
              Add Item
            </button>
          </div>
        </div>

        {/* TABLE */}

        <div className="overflow-x-auto border rounded-xl mb-6">
          <table className="min-w-175 w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">Product</th>

                <th className="text-left p-3">Size</th>

                <th className="text-left p-3">Bundles</th>

                <th className="text-left p-3">Pieces</th>

                <th className="text-left p-3">Bundle Price</th>

                <th className="text-left p-3">Total</th>

                <th className="text-center p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {!items.length && (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-gray-500">
                    No products added
                  </td>
                </tr>
              )}

              {items.map((item) => (
                <tr key={item.product_id} className="border-t">
                  <td className="p-3">{item.product_name}</td>

                  <td className="p-3">
                    {item.pouch_volume}
                    ml
                  </td>

                  <td className="p-2 md:p-3 text-sm">{item.bundles}</td>

                  <td className="p-2 md:p-3 text-sm">{item.actual_quantity}</td>

                  <td className="p-2 md:p-3 text-sm">₹{item.unit_price}</td>

                  <td className="p-2 md:p-3 text-sm">₹{item.total_price}</td>

                  <td className="p-3 text-center">
                    <button
                      onClick={() => removeItem(item.product_id)}
                      className="text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* BOTTOM */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* NOTES */}

          <div>
            <label className="block mb-2 text-sm font-medium">Notes</label>

            <textarea
              rows="4"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          {/* TOTALS */}

          <div className="border rounded-xl p-4 md:p-5 sticky top-4">
            {" "}
            <div className="flex justify-between mb-3">
              <span>Subtotal</span>

              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span>Discount %</span>

              <input
                type="number"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(Number(e.target.value))}
                className="w-20 md:w-24 border rounded px-2 py-1 text-sm"
              />
            </div>
            <div className="flex justify-between mb-3 text-red-600">
              <span>Discount Amount</span>

              <span>- ₹{discountAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-3">
              <span>Taxable Amount</span>

              <span>₹{taxableAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span>GST %</span>

              <input
                type="number"
                value={gstPercentage}
                onChange={(e) => setGstPercentage(Number(e.target.value))}
                className="w-20 md:w-24 border rounded px-2 py-1 text-sm"
              />
            </div>
            <div className="flex justify-between mb-3 text-green-600">
              <span>GST Amount</span>

              <span>+ ₹{gstAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span>Paid Amount</span>

              <input
                type="number"
                value={paidAmount}
                onChange={(e) => setPaidAmount(Number(e.target.value))}
                className="w-20 md:w-24 border rounded px-2 py-1 text-sm"
              />
            </div>
            <div className="flex justify-between mb-3 text-orange-600">
              <span>Due Amount</span>

              <span>₹{dueAmount.toFixed(2)}</span>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between font-bold text-2xl">
              <span>Grand Total</span>

              <span className="text-indigo-600">₹{total.toFixed(2)}</span>
            </div>
            {/* BUTTONS */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => navigate("/orders")}
                className="border px-5 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                disabled={createOrderMutation.isPending}
                onClick={handleCreateOrder}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg"
              >
                {createOrderMutation.isPending
                  ? "Creating..."
                  : "Place Order"}{" "}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
