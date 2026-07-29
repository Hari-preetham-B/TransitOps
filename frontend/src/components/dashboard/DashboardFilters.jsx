import { useEffect, useState } from "react";
import { getRegions } from "../../services/dashboardService";

const vehicleTypes = ["Bus", "Truck", "Van", "Car"];

function DashboardFilters({ filters, setFilters }) {
  const [regions, setRegions] = useState([]);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const data = await getRegions();
        setRegions(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRegions();
  }, []);

  return (
    <div className="mb-8 flex flex-wrap gap-4">
      <select
        value={filters.vehicleType}
        onChange={(e) =>
          setFilters((prev) => ({
            ...prev,
            vehicleType: e.target.value,
          }))
        }
        className="rounded-xl border border-slate-300 bg-white px-4 py-2"
      >
        <option value="">All Vehicle Types</option>

        {vehicleTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      <select
        value={filters.region}
        onChange={(e) =>
          setFilters((prev) => ({
            ...prev,
            region: e.target.value,
          }))
        }
        className="rounded-xl border border-slate-300 bg-white px-4 py-2"
      >
        <option value="">All Regions</option>

        {regions.map((region) => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
      </select>
    </div>
  );
}

export default DashboardFilters;
