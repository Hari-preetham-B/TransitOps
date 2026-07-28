function StatCard({
  title,
  value,
  trend,
  color,
  icon: Icon,
  bg = "bg-slate-100",
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div className={`rounded-xl ${bg} p-2`}>
          <Icon className={`h-5 w-5 ${color}`} />
        </div>

        <span className={`text-xs font-semibold ${color}`}>{trend}</span>
      </div>

      <p className="mt-4 text-xs text-slate-500">{title}</p>

      <h3 className={`mt-1 text-2xl font-bold ${color}`}>{value}</h3>
    </div>
  );
}

export default StatCard;
