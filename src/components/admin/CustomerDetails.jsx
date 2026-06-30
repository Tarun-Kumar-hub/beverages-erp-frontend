import { useParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useCustomer } from "../../hooks/customers/useCustomer";
import { useDeleteCustomer } from "../../hooks/customers/useDeleteCustomer";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Building2,
  BadgeIndianRupee,
  FileText,
  User,
  Edit,
  Trash2,
  Globe,
  MapPinned,
  History,
} from "lucide-react";

export default function CustomerDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { data: customer, isLoading, isError } = useCustomer(id);

  const deleteMutation = useDeleteCustomer();

  // =====================================
  // FORMAT TEXT
  // =====================================

  const capitalizeWords = (text) => {
    if (!text) return "";

    return text
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // =====================================
  // FORMAT CURRENCY
  // =====================================

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(Number(amount || 0));
  };

  // =====================================
  // FETCH CUSTOMER
  // =====================================

  // =====================================
  // DELETE CUSTOMER
  // =====================================
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Delete this customer?");

    if (!confirmDelete) return;

    try {
      await deleteMutation.mutateAsync(id);

      toast.success("Customer deleted");

      navigate("/admin/customers");
    } catch (err) {
      console.log(err);
      toast.error("Delete failed");
    }
  };

  if (isError) {
    return <div className="text-center p-10">Failed to load customer</div>;
  }
  // =====================================
  // LOADING
  // =====================================

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />

          <p className="text-gray-500">Loading customer details...</p>
        </div>
      </div>
    );
  }

  // =====================================
  // NOT FOUND
  // =====================================

  if (!customer) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold text-gray-700">Customer Not Found</h2>

        <Link
          to="/admin/customers"
          className="inline-block mt-4 bg-blue-600 text-white px-5 py-2 rounded-xl"
        >
          Back to Customers
        </Link>
      </div>
    );
  }

  // =====================================
  // UI
  // =====================================

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* HEADER */}

      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 mb-8">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          {/* LEFT */}
          <div className="flex items-center gap-4">
            <Link
              to="/admin/customers"
              className="
          h-12 w-12
          shrink-0
          rounded-2xl
          border border-gray-200
          bg-gray-50
          flex items-center justify-center
          hover:bg-gray-100
          hover:scale-105
          transition-all
        "
            >
              <ArrowLeft size={20} />
            </Link>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900">
                  Customer Details
                </h1>

                <span
                  className="
              px-3 py-1
              rounded-full
              text-xs font-semibold
              bg-green-100
              text-green-700
            "
                >
                  Active
                </span>
              </div>

              <p className="text-gray-500 mt-1">
                View customer profile, orders and account activity
              </p>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
            <button
              onClick={() => navigate(`/admin/customers/${id}/history`)}
              className="
          w-full sm:w-auto
          flex items-center justify-center gap-2

          bg-indigo-600
          hover:bg-indigo-700

          text-white
          font-medium

          px-5 py-3
          rounded-2xl

          shadow-sm
          hover:shadow-md

          transition-all
        "
            >
              <History size={18} />
              Order History
            </button>

            <button
              onClick={() => navigate(`/admin/customers/edit/${id}`)}
              className="
          w-full sm:w-auto
          flex items-center justify-center gap-2

          bg-white
          border border-gray-300

          text-gray-700
          font-medium

          px-5 py-3
          rounded-2xl

          hover:bg-gray-50
          hover:border-gray-400

          transition-all
        "
            >
              <Edit size={18} />
              Edit
            </button>

            <button
              onClick={handleDelete}
              className="
          w-full sm:w-auto
          flex items-center justify-center gap-2

          bg-red-50
          border border-red-200

          text-red-600
          font-medium

          px-5 py-3
          rounded-2xl

          hover:bg-red-100

          transition-all
        "
            >
              <Trash2 size={18} />
              Delete
            </button>
          </div>
        </div>
      </div>
      {/* PROFILE CARD */}

      <div className="bg-white rounded-3xl border shadow-sm p-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* AVATAR */}

          <div className="h-24 w-24 rounded-full bg-linear-to-r from-blue-500 to-blue-700 text-white flex items-center justify-center text-4xl font-bold shadow-lg">
            {customer.name?.charAt(0).toUpperCase()}
          </div>

          {/* INFO */}

          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              {capitalizeWords(customer.name)}
            </h2>

            <p className="text-gray-500 mt-2">
              Customer Code:
              <span className="font-semibold ml-2 text-gray-700">
                {customer.customer_code}
              </span>
            </p>

            <div className="mt-4">
              <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm capitalize">
                {customer.customer_type}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK STATS */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {/* BALANCE */}

        <div className="bg-white border rounded-3xl p-6 shadow-sm">
          <p className="text-sm text-gray-500 mb-2">Current Due</p>

          <h3 className="text-3xl font-bold text-red-600">
            {formatCurrency(customer.current_balance)}
          </h3>
        </div>

        {/* CREDIT */}

        <div className="bg-white border rounded-3xl p-6 shadow-sm">
          <p className="text-sm text-gray-500 mb-2">Credit Limit</p>

          <h3 className="text-3xl font-bold text-green-600">
            {formatCurrency(customer.credit_limit)}
          </h3>
        </div>
      </div>

      {/* DETAILS GRID */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CONTACT INFO */}

        <div className="bg-white rounded-3xl border shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            Contact Information
          </h3>

          <div className="space-y-5">
            {/* PHONE */}

            <div className="flex items-start gap-4">
              <div className="h-11 w-11 rounded-xl bg-blue-100 flex items-center justify-center">
                <Phone className="text-blue-600" />
              </div>

              <div>
                <p className="text-sm text-gray-500">Phone</p>

                <h4 className="font-semibold text-gray-800">
                  {customer.phone || "N/A"}
                </h4>
              </div>
            </div>

            {/* EMAIL */}

            <div className="flex items-start gap-4">
              <div className="h-11 w-11 rounded-xl bg-green-100 flex items-center justify-center">
                <Mail className="text-green-600" />
              </div>

              <div>
                <p className="text-sm text-gray-500">Email</p>

                <h4 className="font-semibold text-gray-800">
                  {customer.email || "N/A"}
                </h4>
              </div>
            </div>

            {/* ADDRESS */}

            <div className="flex items-start gap-4">
              <div className="h-11 w-11 rounded-xl bg-orange-100 flex items-center justify-center">
                <MapPin className="text-orange-600" />
              </div>

              <div>
                <p className="text-sm text-gray-500">Address</p>

                <div className="font-semibold text-gray-800 space-y-1">
                  <p>{capitalizeWords(customer.address_line_1) || "N/A"}</p>

                  {customer.address_line_2 && (
                    <p>{capitalizeWords(customer.address_line_2)}</p>
                  )}

                  <p>
                    {capitalizeWords(customer.city)},{" "}
                    {capitalizeWords(customer.state)}
                  </p>

                  <p>
                    {capitalizeWords(customer.country)}
                    {" - "}
                    {customer.postal_code}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BUSINESS INFO */}

        <div className="bg-white rounded-3xl border shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            Business Information
          </h3>

          <div className="space-y-5">
            {/* GST */}

            <div className="flex items-start gap-4">
              <div className="h-11 w-11 rounded-xl bg-purple-100 flex items-center justify-center">
                <Building2 className="text-purple-600" />
              </div>

              <div>
                <p className="text-sm text-gray-500">GST Number</p>

                <h4 className="font-semibold text-gray-800">
                  {customer.gst_number || "N/A"}
                </h4>
              </div>
            </div>

            {/* CREDIT */}

            <div className="flex items-start gap-4">
              <div className="h-11 w-11 rounded-xl bg-green-100 flex items-center justify-center">
                <BadgeIndianRupee className="text-green-600" />
              </div>

              <div>
                <p className="text-sm text-gray-500">Credit Limit</p>

                <h4 className="font-semibold text-gray-800">
                  {formatCurrency(customer.credit_limit)}
                </h4>
              </div>
            </div>

            {/* BALANCE */}

            <div className="flex items-start gap-4">
              <div className="h-11 w-11 rounded-xl bg-blue-100 flex items-center justify-center">
                <User className="text-blue-600" />
              </div>

              <div>
                <p className="text-sm text-gray-500">Current Balance</p>

                <h4 className="font-semibold text-gray-800">
                  {formatCurrency(customer.current_balance)}
                </h4>
              </div>
            </div>

            {/* COUNTRY */}

            <div className="flex items-start gap-4">
              <div className="h-11 w-11 rounded-xl bg-cyan-100 flex items-center justify-center">
                <Globe className="text-cyan-600" />
              </div>

              <div>
                <p className="text-sm text-gray-500">Country</p>

                <h4 className="font-semibold text-gray-800 capitalize">
                  {customer.country || "N/A"}
                </h4>
              </div>
            </div>

            {/* PINCODE */}

            <div className="flex items-start gap-4">
              <div className="h-11 w-11 rounded-xl bg-pink-100 flex items-center justify-center">
                <MapPinned className="text-pink-600" />
              </div>

              <div>
                <p className="text-sm text-gray-500">Postal Code</p>

                <h4 className="font-semibold text-gray-800">
                  {customer.postal_code || "N/A"}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NOTES */}

      <div className="bg-white rounded-3xl border shadow-sm p-6 mt-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-11 w-11 rounded-xl bg-gray-100 flex items-center justify-center">
            <FileText className="text-gray-600" />
          </div>

          <h3 className="text-xl font-bold text-gray-800">Notes</h3>
        </div>

        <div className="bg-gray-50 rounded-2xl p-5 border">
          {customer.notes ? (
            <p className="text-gray-700 leading-relaxed">
              {capitalizeWords(customer.notes)}
            </p>
          ) : (
            <p className="text-gray-400">No notes available</p>
          )}
        </div>
      </div>
    </div>
  );
}
