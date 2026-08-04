import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Droplet,
  Receipt,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { getVehicles } from "../services/vehicleService";
import {
  getFuelLogs,
  createFuelLog,
  updateFuelLog,
  deleteFuelLog,
} from "../services/fuelLogService";
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../services/expenseService";

const EXPENSE_TYPES = [
  "Insurance",
  "Tax",
  "Tolls",
  "License",
  "Repair",
  "Tyre Replacement",
  "Other",
];

const emptyForm = {
  vehicle: "",
  liters: "",
  cost: "",
  date: "",
  notes: "",
  type: EXPENSE_TYPES[0],
  amount: "",
  description: "",
};

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none";

function FuelExpensesPage() {
  const { user } = useContext(AuthContext);
  const canWrite = ["Financial Analyst"].includes(user?.role);

  const [activeTab, setActiveTab] = useState("fuel");
  const [logs, setLogs] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");

  const fetchVehicles = async () => {
    try {
      const { data } = await getVehicles({ limit: 100 });
      setVehicles(data.vehicles || data.data?.vehicles || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load vehicles");
    }
  };

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = { limit: 100 };
      if (search) params.search = search;
      const { data } = await getFuelLogs(params);
      setLogs(data.fuelLogs || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load fuel logs");
    } finally {
      setLoading(false);
    }
  };

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const params = { limit: 100 };
      if (search) params.search = search;
      const { data } = await getExpenses(params);
      setExpenses(data.expenses || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchVehicles();
    };
    load();
  }, []);

  useEffect(() => {
    const load = async () => {
      if (activeTab === "fuel") {
        await fetchLogs();
      } else {
        await fetchExpenses();
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, search]);

  const rows = activeTab === "fuel" ? logs : expenses;

  const openCreate = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      ...(activeTab === "fuel"
        ? { type: EXPENSE_TYPES[0] }
        : { type: EXPENSE_TYPES[0] }),
    });
    setShowModal(true);
  };

  const openEdit = (record) => {
    setEditingId(record._id);
    if (activeTab === "fuel") {
      setForm({
        vehicle: record.vehicle?._id || record.vehicle,
        liters: record.liters ?? "",
        cost: record.cost ?? "",
        date: record.date ? record.date.slice(0, 10) : "",
        notes: record.notes || "",
        type: EXPENSE_TYPES[0],
        amount: "",
        description: "",
      });
    } else {
      setForm({
        vehicle: record.vehicle?._id || record.vehicle,
        liters: "",
        cost: "",
        date: record.date ? record.date.slice(0, 10) : "",
        notes: "",
        type: record.type || EXPENSE_TYPES[0],
        amount: record.amount ?? "",
        description: record.description || "",
      });
    }
    setShowModal(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === "fuel") {
        if (editingId) {
          await updateFuelLog(editingId, form);
          toast.success("Fuel log updated successfully");
        } else {
          await createFuelLog(form);
          toast.success("Fuel log created successfully");
        }
      } else {
        if (editingId) {
          await updateExpense(editingId, form);
          toast.success("Expense updated successfully");
        } else {
          await createExpense(form);
          toast.success("Expense created successfully");
        }
      }
      setShowModal(false);
      if (activeTab === "fuel") fetchLogs();
      else fetchExpenses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save record");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      if (activeTab === "fuel") {
        await deleteFuelLog(id);
        toast.success("Fuel log deleted successfully");
        fetchLogs();
      } else {
        await deleteExpense(id);
        toast.success("Expense deleted successfully");
        fetchExpenses();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete record");
    }
  };

  const vehicleName = (v) =>
    v?.vehicleNumber ? `${v.vehicleNumber} (${v.vehicleType})` : "-";

  const renderFuelRows = () =>
    logs.map((l) => (
      <tr key={l._id} className="border-b hover:bg-slate-50">
        <td className="px-4 py-3 font-medium">{vehicleName(l.vehicle)}</td>
        <td className="px-4 py-3">{l.date ? l.date.slice(0, 10) : "-"}</td>
        <td className="px-4 py-3">{l.liters ?? 0}</td>
        <td className="px-4 py-3">${Number(l.cost).toLocaleString()}</td>
        <td className="px-4 py-3">{l.notes || "-"}</td>
        <td className="px-4 py-3 text-right">
          <button
            onClick={() => openEdit(l)}
            disabled={!canWrite}
            className="mr-2 rounded p-1 text-blue-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Edit"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => handleDelete(l._id)}
            disabled={!canWrite}
            className="rounded p-1 text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </td>
      </tr>
    ));

  const renderExpenseRows = () =>
    expenses.map((e) => (
      <tr key={e._id} className="border-b hover:bg-slate-50">
        <td className="px-4 py-3 font-medium">{vehicleName(e.vehicle)}</td>
        <td className="px-4 py-3">{e.type}</td>
        <td className="px-4 py-3">{e.date ? e.date.slice(0, 10) : "-"}</td>
        <td className="px-4 py-3">${Number(e.amount).toLocaleString()}</td>
        <td className="px-4 py-3">{e.description || "-"}</td>
        <td className="px-4 py-3 text-right">
          <button
            onClick={() => openEdit(e)}
            disabled={!canWrite}
            className="mr-2 rounded p-1 text-blue-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Edit"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => handleDelete(e._id)}
            disabled={!canWrite}
            className="rounded p-1 text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </td>
      </tr>
    ));

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Fuel & Expenses
          </h1>
          <p className="text-sm text-slate-500">
            Log fuel entries and fleet expenses. Read-only unless you have
            Financial Analyst access.
          </p>
        </div>
        {canWrite && (
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus size={16} />
            Add{" "}
            {activeTab === "fuel" ? "Fuel Log" : "Expense"}
          </button>
        )}
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="inline-flex rounded-lg bg-slate-100 p-1 text-sm">
          <button
            onClick={() => setActiveTab("fuel")}
            className={
              "inline-flex items-center gap-1 rounded-md px-3 py-1.5 font-medium " +
              (activeTab === "fuel"
                ? "bg-white text-blue-600 shadow"
                : "text-slate-600 hover:text-slate-800")
            }
          >
            <Droplet size={14} /> Fuel
          </button>
          <button
            onClick={() => setActiveTab("expense")}
            className={
              "inline-flex items-center gap-1 rounded-md px-3 py-1.5 font-medium " +
              (activeTab === "expense"
                ? "bg-white text-blue-600 shadow"
                : "text-slate-600 hover:text-slate-800")
            }
          >
            <Receipt size={14} /> Expenses
          </button>
        </div>

        <div className="mt-3 sm:mt-0 sm:ml-auto">
          <input
            type="text"
            placeholder={
              activeTab === "fuel"
                ? "Search notes..."
                : "Search type, description..."
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {loading ? (
        <p className="py-10 text-center text-slate-500">
          Loading {activeTab === "fuel" ? "fuel logs" : "expenses"}...
        </p>
      ) : rows.length === 0 ? (
        <p className="py-10 text-center text-slate-500">
          No {activeTab === "fuel" ? "fuel logs" : "expenses"} found.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-white shadow">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-xs uppercase text-slate-500">
                {activeTab === "fuel" ? (
                  <>
                    <th className="px-4 py-3">Vehicle</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Liters</th>
                    <th className="px-4 py-3">Cost</th>
                    <th className="px-4 py-3">Notes</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </>
                ) : (
                  <>
                    <th className="px-4 py-3">Vehicle</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {activeTab === "fuel" ? renderFuelRows() : renderExpenseRows()}
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
                {editingId
                  ? `Edit ${activeTab === "fuel" ? "Fuel Log" : "Expense"}`
                  : `Add ${activeTab === "fuel" ? "Fuel Log" : "Expense"}`}
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
                      {v.vehicleNumber} ({v.vehicleType}) - {v.region}
                    </option>
                  ))}
                </select>
              </div>

              {activeTab === "fuel" ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-medium">
                        Liters *
                      </label>
                      <input
                        name="liters"
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.liters}
                        onChange={handleChange}
                        required
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium">
                        Cost *
                      </label>
                      <input
                        name="cost"
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.cost}
                        onChange={handleChange}
                        required
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium">
                      Notes
                    </label>
                    <input
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="Optional notes"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-medium">
                        Type *
                      </label>
                      <select
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        required
                        className={inputClass}
                      >
                        {EXPENSE_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium">
                        Amount *
                      </label>
                      <input
                        name="amount"
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.amount}
                        onChange={handleChange}
                        required
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium">
                      Description
                    </label>
                    <input
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="Optional description"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="mb-1 block text-xs font-medium">
                  Date *
                </label>
                <input
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  className={inputClass}
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

export default FuelExpensesPage;
