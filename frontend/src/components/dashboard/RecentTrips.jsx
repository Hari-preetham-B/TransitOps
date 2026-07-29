import { useEffect, useState } from "react";
import { getRecentTrips } from "../../services/tripService";

function RecentTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const data = await getRecentTrips();
        setTrips(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Completed":
        return "bg-blue-100 text-blue-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg">
      <h2 className="mb-6 text-xl font-semibold text-slate-800">
        Recent Trips
      </h2>

      {loading ? (
        <p className="text-slate-500">Loading trips...</p>
      ) : trips.length === 0 ? (
        <p className="text-slate-500">No recent trips found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-sm text-slate-500">
                <th className="pb-3">Trip</th>
                <th className="pb-3">Driver</th>
                <th className="pb-3">Route</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {trips.map((trip) => (
                <tr
                  key={trip._id}
                  className="border-b last:border-none hover:bg-slate-50"
                >
                  <td className="py-4 font-medium">{trip.tripCode}</td>

                  <td>{trip.driver?.name || "-"}</td>

                  <td>
                    {trip.origin} → {trip.destination}
                  </td>

                  <td>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                        trip.status,
                      )}`}
                    >
                      {trip.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default RecentTrips;
