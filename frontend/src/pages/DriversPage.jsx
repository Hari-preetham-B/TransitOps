import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import {
  getDrivers,
  createDriver,
  updateDriver,
  deleteDriver,
} from "../services/driverService";

const DRIVER_STATUS = ["Available", "On Trip", "Off Duty", "Suspended"];

const emptyForm = {
  name: "",
  licenseNumber: "",
  licenseCategory: "",
  licenseExpiryDate: "",
  safetyScore: "",
  phone: "",
  email: "",
  experience: "",
  region: "",
  status: "Available",
};

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none";

function DriversPage() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const params = { limit: 100 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const { data } = await getDrivers(params);
      setDrivers(data.drivers || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load drivers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (driver) => {
    setEditingId(driver._id);
    setForm({
      name: driver.name,
      licenseNumber: driver.licenseNumber,
      licenseCategory: driver.licenseCategory || "",
      licenseExpiryDate: driver.licenseExpiryDate
        ? driver.licenseExpiryDate.slice(0, 10)
        : "",
      safetyScore: driver.safetyScore || "",
      phone: driver.phone,
      email: driver.email || "",
      experience: driver.experience || "",
      region: driver.region,
      status: driver.status,
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDriver(editingId, form);
        toast.success("Driver updated successfully");
      } else {
        await createDriver(form);
        toast.success("Driver created successfully");
      }
      setShowModal(false);
      fetchDrivers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save driver");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this driver?")) return;
    try {
      await deleteDriver(id);
      toast.success("Driver deleted successfully");
      fetchDrivers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete driver");
    }
  };

  const isLicenseExpired = (date) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-700";
      case "On Trip":
        return "bg-blue-100 text-blue-700";
      case "Off Duty":
        return "bg-slate-100 text-slate-700";
      case "Suspended":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Drivers</h1>
          <p className="text-sm text-slate-500">Manage your drivers</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus size={16} /> Add Driver
        </button>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          placeholder="Search by name, license, phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={inputClass + " sm:w-64"}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={inputClass + " sm:w-48"}
        >
          <option value="">All Statuses</option>
          {DRIVER_STATUS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="py-10 text-center text-slate-500">Loading drivers...</p>
      ) : drivers.length === 0 ? (
        <p className="py-10 text-center text-slate-500">No drivers found.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-white shadow">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-xs uppercase text-slate-500">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">License</th>
                <th className="px-4 py-3">Expiry</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Safety</th>
                <th className="px-4 py-3">Region</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((d) => {
                const expired = isLicenseExpired(d.licenseExpiryDate);
                return (
                  <tr key={d._id} className="border-b hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium">{d.name}</td>
                    <td className="px-4 py-3">
                      {d.licenseNumber}
                      {d.licenseCategory ? ` (${d.licenseCategory})` : ""}
                    </td>
                    <td className="px-4 py-3">
                      {d.licenseExpiryDate
                        ? d.licenseExpiryDate.slice(0, 10)
                        : "-"}
                      {expired && (
                        <span className="ml-2 rounded bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                          Expired
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">{d.phone}</td>
                    <td className="px-4 py-3">{d.safetyScore ?? "-"}</td>
                    <td className="px-4 py-3">{d.region}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                          d.status,
                        )}`}
                      >
                        {d.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => openEdit(d)}
                        className="mr-2 rounded p-1 text-blue-600 hover:bg-blue-50"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(d._id)}
                        className="rounded p-1 text-red-600 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">
                {editingId ? "Edit Driver" : "Add Driver"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="rounded p-1 text-slate-500 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium">Name *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="Driver full name"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium">
                    License Number *
                  </label>
                  <input
                    name="licenseNumber"
                    value={form.licenseNumber}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    placeholder="e.g. DL-123456"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">
                    License Category
                  </label>
                  <input
                    name="licenseCategory"
                    value={form.licenseCategory}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="e.g. HMV"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium">
                    License Expiry *
                  </label>
                  <input
                    name="licenseExpiryDate"
                    type="date"
                    value={form.licenseExpiryDate}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">
                    Safety Score (0-100)
                  </label>
                  <input
                    name="safetyScore"
                    type="number"
                    min="0"
                    max="100"
                    value={form.safetyScore}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium">
                    Phone *
                  </label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    placeholder="Contact number"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium">
                    Experience (years)
                  </label>
                  <input
                    name="experience"
                    type="number"
                    min="0"
                    value={form.experience}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">
                    Region *
                  </label>
                  <input
                    name="region"
                    value={form.region}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    placeholder="e.g. North"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className={inputClass}
                >
                  {DRIVER_STATUS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  <Check size={16} />
                  {editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DriversPage;
