function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-linear-to-br from-sky-50 via-white to-blue-100">
      <div className="mx-auto max-w-7xl px-8 py-8">{children}</div>
    </div>
  );
}

export default DashboardLayout;
