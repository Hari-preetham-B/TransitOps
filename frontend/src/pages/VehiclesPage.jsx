import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import {
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "../services/vehicleService";

const VEHICLE_TYPES = ["Bus", "Truck", "Van", "Car"];
const VEHICLE_STATUS = ["Available", "On Trip", "In Shop", "Retired"];
const FUEL_TYPES = ["Diesel", "Petrol", "Electric", "CNG"];

const emptyForm = {
  vehicleNumber: "",
  name: "",
  model: "",
  vehicleType: "Truck",
  maxLoadCapacity: "",
  odometer: "",
  acquisitionCost: "",
  status: "Available",
  region: "",
  fuelType: "Diesel",
};

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none";

function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const params = { limit: 100 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const { data } = await getVehicles(params);
      setVehicles(data.vehicles || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load vehicles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (vehicle) => {
    setEditingId(vehicle._id);
    setForm({
      vehicleNumber: vehicle.vehicleNumber,
      name: vehicle.name || "",
      model: vehicle.model || "",
      vehicleType: vehicle.vehicleType,
      maxLoadCapacity: vehicle.maxLoadCapacity,
      odometer: vehicle.odometer || "",
      acquisitionCost: vehicle.acquisitionCost || "",
      status: vehicle.status,
      region: vehicle.region,
      fuelType: vehicle.fuelType,
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
        await updateVehicle(editingId, form);
        toast.success("Vehicle updated successfully");
      } else {
        await createVehicle(form);
        toast.success("Vehicle created successfully");
      }
      setShowModal(false);
      fetchVehicles();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save vehicle");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?"))
      return;
    try {
      await deleteVehicle(id);
      toast.success("Vehicle deleted successfully");
      fetchVehicles();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete vehicle");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-700";
      case "On Trip":
        return "bg-blue-100 text-blue-700";
      case "In Shop":
        return "bg-orange-100 text-orange-700";
      case "Retired":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Vehicles</h1>
          <p className="text-sm text-slate-500">Manage your fleet vehicles</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus size={16} /> Add Vehicle
        </button>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          placeholder="Search by number, region..."
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
          {VEHICLE_STATUS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="py-10 text-center text-slate-500">Loading vehicles...</p>
      ) : vehicles.length === 0 ? (
        <p className="py-10 text-center text-slate-500">No vehicles found.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-white shadow">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-xs uppercase text-slate-500">
                <th className="px-4 py-3">Number</th>
                <th className="px-4 py-3">Name / Model</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Max Load (kg)</th>
                <th className="px-4 py-3">Odometer</th>
                <th className="px-4 py-3">Region</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v._id} className="border-b hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium">{v.vehicleNumber}</td>
                  <td className="px-4 py-3">
                    {v.name || "-"} {v.model ? `(${v.model})` : ""}
                  </td>
                  <td className="px-4 py-3">{v.vehicleType}</td>
                  <td className="px-4 py-3">{v.maxLoadCapacity}</td>
                  <td className="px-4 py-3">{v.odometer ?? "-"}</td>
                  <td className="px-4 py-3">{v.region}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                        v.status,
                      )}`}
                    >
                      {v.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openEdit(v)}
                      className="mr-2 rounded p-1 text-blue-600 hover:bg-blue-50"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(v._id)}
                      className="rounded p-1 text-red-600 hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 size={16} />
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
                {editingId ? "Edit Vehicle" : "Add Vehicle"}
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
                  Vehicle Number *
                </label>
                <input
                  name="vehicleNumber"
                  value={form.vehicleNumber}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="e.g. KA-01-AB-1234"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium">Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="e.g. Ashok Leyland"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">
                    Model
                  </label>
                  <input
                    name="model"
                    value={form.model}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="e.g. 3015"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium">
                    Type *
                  </label>
                  <select
                    name="vehicleType"
                    value={form.vehicleType}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    {VEHICLE_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">
                    Fuel Type
                  </label>
                  <select
                    name="fuelType"
                    value={form.fuelType}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    {FUEL_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium">
                    Max Load Capacity (kg) *
                  </label>
                  <input
                    name="maxLoadCapacity"
                    type="number"
                    min="1"
                    value={form.maxLoadCapacity}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">
                    Odometer (km)
                  </label>
                  <input
                    name="odometer"
                    type="number"
                    min="0"
                    value={form.odometer}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium">
                    Acquisition Cost
                  </label>
                  <input
                    name="acquisitionCost"
                    type="number"
                    min="0"
                    value={form.acquisitionCost}
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
                  {VEHICLE_STATUS.map((s) => (
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

export default VehiclesPage;
