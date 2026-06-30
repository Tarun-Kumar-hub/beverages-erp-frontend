import { useState, useEffect } from "react";
import { useCustomer } from "../hooks/customers/useCustomer";
import { useCreateCustomer } from "../hooks/customers/useCreateCustomer";
import { useUpdateCustomer } from "../hooks/customers/useUpdateCustomer";

import { useNavigate, useParams } from "react-router-dom";

import {
  User,
  Phone,
  Mail,
  Building2,
  BadgeIndianRupee,
  MapPin,
  FileText,
  ArrowLeft,
} from "lucide-react";

export default function CreateCustomer() {
  const navigate = useNavigate();

  const { id } = useParams();

  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",

    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    country: "",
    postal_code: "",

    gst_number: "",

    customer_type: "retailer",

    credit_limit: "",

    notes: "",
  });

  // ======================================
  // FETCH CUSTOMER
  // ======================================
  const { data: customer, isLoading: fetching } = useCustomer(id);

  const createMutation = useCreateCustomer();

  const updateMutation = useUpdateCustomer();

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  //Populate Form
  useEffect(() => {
    if (!customer) return;

    setFormData({
      name: customer.name || "",
      phone: customer.phone || "",
      email: customer.email || "",

      address_line_1: customer.address_line_1 || "",
      address_line_2: customer.address_line_2 || "",

      city: customer.city || "",
      state: customer.state || "",
      country: customer.country || "",
      postal_code: customer.postal_code || "",

      gst_number: customer.gst_number || "",

      customer_type: customer.customer_type || "retailer",

      credit_limit: customer.credit_limit || "",

      notes: customer.notes || "",
    });
  }, [customer]);
  // ======================================
  // HANDLE INPUT
  // ======================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ======================================
  // SUBMIT FORM
  // ======================================
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      credit_limit: Number(formData.credit_limit) || 0,
    };

    if (isEditMode) {
      updateMutation.mutate(
        {
          id,
          payload,
        },
        {
          onSuccess: () => {
            navigate(`/admin/customers/${id}`);
          },
        },
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          navigate("/admin/customers");
        },
      });
    }
  };
  // ======================================
  // LOADING
  // ======================================

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {" "}
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 md:mb-8">
          {" "}
          <button
            onClick={() =>
              navigate(
                isEditMode ? `/admin/customers/${id}` : "/admin/customers",
              )
            }
            className="h-11 w-11 rounded-xl bg-white border flex items-center justify-center hover:bg-gray-100 transition"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {isEditMode ? "Edit Customer" : "Create Customer"}
            </h1>

            <p className="text-gray-500 mt-1">
              {isEditMode
                ? "Update customer information"
                : "Add a new customer to your ERP"}
            </p>
          </div>
        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="
    bg-white
    rounded-2xl
    md:rounded-3xl
    border
    shadow-sm
    p-4
    md:p-8
  "
        >
          {/* BASIC INFO */}

          <div className="mb-10">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* NAME */}

              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Customer Name *
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter customer name"
                    required
                    className="w-full border border-gray-300 rounded-2xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* PHONE */}

              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Phone *
                </label>

                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="tel"
                    inputMode="numeric"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    required
                    className="w-full border border-gray-300 rounded-2xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* EMAIL */}

              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Email
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    className="w-full border border-gray-300 rounded-2xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* GST */}

              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  GST Number
                </label>

                <div className="relative">
                  <Building2
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    name="gst_number"
                    value={formData.gst_number}
                    onChange={handleChange}
                    placeholder="Enter GST number"
                    className="w-full border border-gray-300 rounded-2xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ADDRESS */}

          <div className="mb-10">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6">
              Address Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="md:col-span-2">
                <label className="block mb-2 font-medium text-gray-700">
                  Address Line 1
                </label>

                <input
                  type="text"
                  name="address_line_1"
                  value={formData.address_line_1}
                  onChange={handleChange}
                  placeholder="Street address"
                  className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block mb-2 font-medium text-gray-700">
                  Address Line 2
                </label>

                <input
                  type="text"
                  name="address_line_2"
                  value={formData.address_line_2}
                  onChange={handleChange}
                  placeholder="Apartment, suite, etc."
                  className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  City
                </label>

                <div className="relative">
                  <MapPin
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    className="w-full border border-gray-300 rounded-2xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  State
                </label>

                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Enter state"
                  className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Country
                </label>

                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Country</option>

                  <option value="india">India</option>

                  <option value="united states">United States</option>

                  <option value="united kingdom">United Kingdom</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Postal Code
                </label>

                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleChange}
                  placeholder="Enter postal code"
                  className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Customer Type
                </label>

                <select
                  name="customer_type"
                  value={formData.customer_type}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="retailer">Retailer</option>

                  <option value="wholesaler">Wholesaler</option>

                  <option value="distributor">Distributor</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Credit Limit
                </label>

                <div className="relative">
                  <BadgeIndianRupee
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="number"
                    name="credit_limit"
                    value={formData.credit_limit}
                    onChange={handleChange}
                    placeholder="Enter credit limit"
                    className="w-full border border-gray-300 rounded-2xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* NOTES */}

          <div className="mb-8">
            <label className="block mb-2 font-medium text-gray-700">
              Notes
            </label>

            <div className="relative">
              <FileText
                size={18}
                className="absolute left-4 top-4 text-gray-400"
              />

              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="4"
                placeholder="Extra notes..."
                className="w-full border border-gray-300 rounded-2xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* BUTTONS */}

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl transition disabled:opacity-50"
            >
              {isSubmitting
                ? isEditMode
                  ? "Updating Customer..."
                  : "Creating Customer..."
                : isEditMode
                  ? "Update Customer"
                  : "Create Customer"}
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(
                  isEditMode ? `/admin/customers/${id}` : "/admin/customers",
                )
              }
              className="bg-gray-200 hover:bg-gray-300 px-8 py-3 rounded-2xl transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
