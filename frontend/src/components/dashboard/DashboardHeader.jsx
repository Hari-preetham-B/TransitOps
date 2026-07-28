import { Search } from "lucide-react";
import UserMenu from "../layout/UserMenu";

function DashboardHeader() {
  return (
    <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-sm font-medium text-blue-600">
          TransitOps Dashboard
        </p>

        <h1 className="mt-2 text-4xl font-bold text-slate-800">
          Fleet Operations
        </h1>

        <p className="mt-2 text-slate-500">
          Monitor vehicles, drivers and trips in real time.
        </p>
      </div>

      <div className="flex items-center gap-5">
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />

          <input
            type="text"
            placeholder="Search vehicles..."
            className="w-80 rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 shadow-sm outline-none transition focus:border-blue-500"
          />
        </div>

        <UserMenu />
      </div>
    </div>
  );
}

export default DashboardHeader;
