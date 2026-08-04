import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { Plus, X, Check, Wrench } from "lucide-react";
import {
  getMaintenance,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
} from "../services/maintenanceService";
import { getVehicles } from "../services/vehicleService";

const MAINTENANCE_TYPES = [
  "Oil Change",
  "Engine Repair",
  "Tyre Replacement",
  "Brake Service",
  "General Service",
  "Other",
];
const MAINTENANCE_STATUS = ["Scheduled", "In Progress", "Completed"];

const emptyForm = {
  vehicle: "",
  maintenanceType: "General Service",
  description: "",
  scheduledDate: "",
  completedDate: "",
  status: "In Progress",
  cost: "",
};

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none";

function MaintenancePage() {
  const { user } = useContext(AuthContext);
  const canWrite = ["Fleet Manager"].includes(user?.role);
  const [records, setRecords] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [statusFilter, setStatusFilter] = useState("");

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const params = { limit: 100 };
      if (statusFilter) params.status = statusFilter;
      const { data } = await getMaintenance(params);
      setRecords(data.maintenance || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load maintenance");
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicles = async () => {
    try {
      const { data } = await getVehicles({ limit: 100 });
      setVehicles(data.vehicles || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load vehicles");
    }
  };

  useEffect(() => {
    fetchRecords();
    fetchVehicles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (rec) => {
    setEditingId(rec._id);
    setForm({
      vehicle: rec.vehicle?._id || "",
      maintenanceType: rec.maintenanceType,
      description: rec.description || "",
      scheduledDate: rec.scheduledDate ? rec.scheduledDate.slice(0, 10) : "",
      completedDate: rec.completedDate ? rec.completedDate.slice(0, 10) : "",
      status: rec.status,
      cost: rec.cost || "",
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
        await updateMaintenance(editingId, form);
        toast.success("Maintenance updated successfully");
      } else {
        await createMaintenance(form);
        toast.success("Maintenance created successfully");
      }
      setShowModal(false);
      fetchRecords();
      fetchVehicles();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save maintenance");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await deleteMaintenance(id);
      toast.success("Maintenance record deleted");
      fetchRecords();
      fetchVehicles();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete record");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "In Progress":
        return "bg-orange-100 text-orange-700";
      case "Completed":
        return "bg-green-100 text-green-700";
      case "Scheduled":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Maintenance</h1>
          <p className="text-sm text-slate-500">
            Track vehicle maintenance. Active records auto-set vehicle to In
            Shop.
          </p>
        </div>
        {canWrite && (
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus size={16} /> Add Maintenance
          </button>
        )}
      </div>

      <div className="mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={inputClass + " sm:w-48"}
        >
          <option value="">All Statuses</option>
          {MAINTENANCE_STATUS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="py-10 text-center text-slate-500">
          Loading maintenance records...
        </p>
      ) : records.length === 0 ? (
        <p className="py-10 text-center text-slate-500">
          No maintenance records found.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-white shadow">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-xs uppercase text-slate-500">
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Scheduled</th>
                <th className="px-4 py-3">Cost</th>
                <th className="px-4 py-3">Vehicle Status</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r._id} className="border-b hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium">
                    {r.vehicle?.vehicleNumber || "-"}
                  </td>
                  <td className="px-4 py-3">{r.maintenanceType}</td>
                  <td className="px-4 py-3">
                    {r.scheduledDate ? r.scheduledDate.slice(0, 10) : "-"}
                  </td>
                  <td className="px-4 py-3">
                    {r.cost ? `$${r.cost.toLocaleString()}` : "-"}
                  </td>
                  <td className="px-4 py-3">{r.vehicle?.status || "-"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                        r.status,
                      )}`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openEdit(r)}
                      disabled={!canWrite}
                      className="mr-2 rounded p-1 text-blue-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Edit"
                    >
                      <Wrench size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(r._id)}
                      disabled={!canWrite}
                      className="rounded p-1 text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete"
                    >
                      <X size={16} />
                    </button>
                  </td>
                </tr>
              ))}
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
                {editingId ? "Edit Maintenance" : "Add Maintenance"}
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
                <label className="mb-1 block text-xs font-medium">
                  Vehicle *
                </label>
                <select
                  name="vehicle"
                  value={form.vehicle}
                  onChange={handleChange}
                  required
                  className={inputClass}
                >
                  <option value="">Select vehicle</option>
                  {vehicles.map((v) => (
                    <option key={v._id} value={v._id}>
                      {v.vehicleNumber} ({v.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium">
                    Type *
                  </label>
                  <select
                    name="maintenanceType"
                    value={form.maintenanceType}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    {MAINTENANCE_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">Cost</label>
                  <input
                    name="cost"
                    type="number"
                    min="0"
                    value={form.cost}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium">
                    Scheduled Date *
                  </label>
                  <input
                    name="scheduledDate"
                    type="date"
                    value={form.scheduledDate}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">
                    Completed Date
                  </label>
                  <input
                    name="completedDate"
                    type="date"
                    value={form.completedDate}
                    onChange={handleChange}
                    className={inputClass}
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
                  {MAINTENANCE_STATUS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-slate-400">
                  Setting status to "In Progress" auto-switches the vehicle to
                  In Shop. Setting to "Completed" restores it to Available.
                </p>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className={inputClass}
                  rows="2"
                />
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

export default MaintenancePage;
