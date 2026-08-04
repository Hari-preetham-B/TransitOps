import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FileDown, RefreshCw } from "lucide-react";
import { getReport, exportReportCsv } from "../services/reportService";

const REPORT_TYPES = [
  { value: "fuelEfficiency", label: "Fuel Efficiency" },
  { value: "fleetUtilization", label: "Fleet Utilization" },
  { value: "operationalCost", label: "Operational Cost" },
  { value: "vehicleRoi", label: "Estimated ROI" },
];

const CURRENCY_FIELDS = new Set([
  "cost",
  "amount",
  "fuelCost",
  "maintenanceCost",
  "operationalCost",
  "acquisitionCost",
  "estimatedRevenue",
  "otherExpenseCost",
  "totalFuelCost",
  "totalMaintenanceCost",
  "totalOperationalCost",
  "totalOtherExpense",
  "totalExpenses",
  "totalAcquisitionCost",
  "totalEstimatedRevenue",
]);

const formatValue = (value, key) => {
  if (value == null || value === "") return "-";
  if (typeof value === "object") return JSON.stringify(value);
  if (
    typeof value === "number" ||
    (typeof value === "string" && value.trim() !== "" && !isNaN(Number(value)))
  ) {
    const num = Number(value);
    const formatted = num.toLocaleString(undefined, {
      maximumFractionDigits: 2,
    });
    return CURRENCY_FIELDS.has(key) ? `$${formatted}` : formatted;
  }
  return value;
};

function ReportsPage() {
  const [reportType, setReportType] = useState("fuelEfficiency");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    if (!reportType) return;
    try {
      setLoading(true);
      const { data } = await getReport(reportType);
      setReport(data.data);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to load report",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchReport();
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleViewReport = () => {
    setReport(null);
    fetchReport();
  };

  const handleExportCsv = async () => {
    try {
      const response = await exportReportCsv(reportType);
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${reportType}-report.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("CSV exported successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to export CSV");
    }
  };

  const rows = report?.rows || [];
  const summary = report?.summary;

  const columns = rows.length ? Object.keys(rows[0]) : [];

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Reports</h1>
          <p className="text-sm text-slate-500">
            Operational analytics and cost reports for your fleet.
          </p>
          {reportType === "vehicleRoi" && (
            <p className="mt-1 text-xs text-slate-400">
              Estimated ROI uses cargo weight × distance as a revenue proxy
              (actual trip revenue is not tracked).
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-56 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            {REPORT_TYPES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
          <button
            onClick={handleViewReport}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            title="Generate report"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={handleExportCsv}
            disabled={!report || loading}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-60"
            title="Export CSV"
          >
            <FileDown size={16} /> CSV
          </button>
        </div>
      </div>

      {loading ? (
        <p className="py-10 text-center text-slate-500">Loading report...</p>
      ) : !report ? (
        <p className="py-10 text-center text-slate-500">
          Select a report type and generate.
        </p>
      ) : (
        <div className="space-y-6">
          {summary && (
            <div className="grid grid-cols-2 gap-2 rounded-2xl bg-white p-4 shadow sm:grid-cols-3 md:grid-cols-4">
              {Object.entries(summary).map(([key, value]) => (
                <div key={key} className="rounded-lg bg-slate-50 px-3 py-2">
                  <p className="text-xs uppercase text-slate-500">{key}</p>
                  <p className="text-sm font-semibold text-slate-800">
                    {formatValue(value, key)}
                  </p>
                </div>
              ))}
            </div>
          )}

          {rows.length === 0 ? (
            <p className="py-6 text-center text-slate-500">
              No data for this report.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-2xl bg-white shadow">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-xs uppercase text-slate-500">
                    {columns.map((col) => (
                      <th
                        key={col}
                        className={
                          col === "vehicle" ||
                          col === "vehicleNumber" ||
                          col === "vehicleType" ||
                          col === "region" ||
                          col === "status" ||
                          col === "type"
                            ? "px-4 py-3"
                            : "px-4 py-3 text-right"
                        }
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr
                      key={row.vehicle || row.vehicleNumber || i}
                      className="border-b hover:bg-slate-50"
                    >
                      {columns.map((col) => (
                        <td
                          key={col}
                          className={
                            col === "vehicle" ||
                            col === "vehicleNumber" ||
                            col === "vehicleType" ||
                            col === "region" ||
                            col === "status" ||
                            col === "type"
                              ? "px-4 py-3"
                              : "px-4 py-3 text-right"
                          }
                        >
                          {formatValue(row[col], col)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ReportsPage;
