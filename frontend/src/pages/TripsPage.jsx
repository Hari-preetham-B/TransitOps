import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { Plus, X, Check, Play, CheckCircle2, XCircle } from "lucide-react";
import {
  getTrips,
  createTrip,
  updateTrip,
  deleteTrip,
} from "../services/tripService";
import { getVehicles } from "../services/vehicleService";
import { getDrivers } from "../services/driverService";

const TRIP_STATUS = ["Draft", "Dispatched", "Completed", "Cancelled"];

const emptyForm = {
  tripCode: "",
  vehicle: "",
  driver: "",
  origin: "",
  destination: "",
  cargoWeight: "",
  startTime: "",
  endTime: "",
  distance: "",
  remarks: "",
};

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none";

function TripsPage() {
  const { user } = useContext(AuthContext);
  const canWrite = ["Fleet Manager", "Driver"].includes(user?.role);
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [statusFilter, setStatusFilter] = useState("");

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const params = { limit: 100 };
      if (statusFilter) params.status = statusFilter;
      const { data } = await getTrips(params);
      setTrips(data.trips || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load trips");
    } finally {
      setLoading(false);
    }
  };

  const fetchOptions = async () => {
    try {
      const [vehRes, drvRes] = await Promise.all([
        getVehicles({ limit: 100 }),
        getDrivers({ limit: 100 }),
      ]);
      setVehicles(vehRes.data.vehicles || []);
      setDrivers(drvRes.data.drivers || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load options");
    }
  };

  useEffect(() => {
    fetchTrips();
    fetchOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const openCreate = () => {
    setForm(emptyForm);
    setShowModal(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTrip(form);
      toast.success("Trip created successfully");
      setShowModal(false);
      fetchTrips();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create trip");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateTrip(id, { status: newStatus });
      toast.success(`Trip marked as ${newStatus}`);
      fetchTrips();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update trip");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this trip?")) return;
    try {
      await deleteTrip(id);
      toast.success("Trip deleted successfully");
      fetchTrips();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete trip");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Draft":
        return "bg-yellow-100 text-yellow-700";
      case "Dispatched":
        return "bg-green-100 text-green-700";
      case "Completed":
        return "bg-blue-100 text-blue-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const availableVehicles = vehicles.filter((v) => v.status === "Available");
  const availableDrivers = drivers.filter(
    (d) =>
      d.status === "Available" &&
      !(d.licenseExpiryDate && new Date(d.licenseExpiryDate) < new Date()),
  );

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Trips</h1>
          <p className="text-sm text-slate-500">
            Create and manage trips. Dispatch to commit vehicle & driver.
          </p>
        </div>
        {canWrite && (
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus size={16} /> Create Trip
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
          {TRIP_STATUS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="py-10 text-center text-slate-500">Loading trips...</p>
      ) : trips.length === 0 ? (
        <p className="py-10 text-center text-slate-500">No trips found.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-white shadow">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-xs uppercase text-slate-500">
                <th className="px-4 py-3">Trip Code</th>
                <th className="px-4 py-3">Route</th>
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3">Driver</th>
                <th className="px-4 py-3">Cargo (kg)</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trips.map((t) => (
                <tr key={t._id} className="border-b hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium">{t.tripCode}</td>
                  <td className="px-4 py-3">
                    {t.origin} &rarr; {t.destination}
                  </td>
                  <td className="px-4 py-3">
                    {t.vehicle?.vehicleNumber || "-"}
                  </td>
                  <td className="px-4 py-3">{t.driver?.name || "-"}</td>
                  <td className="px-4 py-3">{t.cargoWeight ?? 0}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                        t.status,
                      )}`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {t.status === "Draft" && (
                      <button
                        onClick={() => handleStatusChange(t._id, "Dispatched")}
                        disabled={!canWrite}
                        className="mr-2 inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-green-600 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Dispatch"
                      >
                        <Play size={14} /> Dispatch
                      </button>
                    )}
                    {t.status === "Dispatched" && (
                      <>
                        <button
                          onClick={() => handleStatusChange(t._id, "Completed")}
                          disabled={!canWrite}
                          className="mr-2 inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Complete"
                        >
                          <CheckCircle2 size={14} /> Complete
                        </button>
                        <button
                          onClick={() => handleStatusChange(t._id, "Cancelled")}
                          disabled={!canWrite}
                          className="mr-2 inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Cancel"
                        >
                          <XCircle size={14} /> Cancel
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(t._id)}
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
              <h2 className="text-lg font-bold">Create Trip</h2>
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
                  Trip Code *
                </label>
                <input
                  name="tripCode"
                  value={form.tripCode}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="e.g. TRP-001"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium">
                    Origin *
                  </label>
                  <input
                    name="origin"
                    value={form.origin}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">
                    Destination *
                  </label>
                  <input
                    name="destination"
                    value={form.destination}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                    {availableVehicles.map((v) => (
                      <option key={v._id} value={v._id}>
                        {v.vehicleNumber} ({v.vehicleType}) -{" "}
                        {v.maxLoadCapacity}
                        kg
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">
                    Driver *
                  </label>
                  <select
                    name="driver"
                    value={form.driver}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  >
                    <option value="">Select driver</option>
                    {availableDrivers.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium">
                    Cargo Weight (kg)
                  </label>
                  <input
                    name="cargoWeight"
                    type="number"
                    min="0"
                    value={form.cargoWeight}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">
                    Distance (km) *
                  </label>
                  <input
                    name="distance"
                    type="number"
                    min="0"
                    value={form.distance}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium">
                    Start Time *
                  </label>
                  <input
                    name="startTime"
                    type="datetime-local"
                    value={form.startTime}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">
                    End Time
                  </label>
                  <input
                    name="endTime"
                    type="datetime-local"
                    value={form.endTime}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium">
                  Remarks
                </label>
                <textarea
                  name="remarks"
                  value={form.remarks}
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
                  <Check size={16} /> Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TripsPage;
