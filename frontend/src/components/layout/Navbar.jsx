import Button from "../ui/Button";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
            T
          </div>

          <span
            className="text-2xl font-bold text-slate-900"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            TransitOps
          </span>
        </div>

        {/* Navigation Links */}
        <ul className="hidden gap-10 text-sm font-medium text-slate-600 lg:flex">
          <li className="cursor-pointer hover:text-blue-600">Features</li>
          <li className="cursor-pointer hover:text-blue-600">Solutions</li>
          <li className="cursor-pointer hover:text-blue-600">Resources</li>
          <li className="cursor-pointer hover:text-blue-600">Pricing</li>
          <li className="cursor-pointer hover:text-blue-600">About</li>
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="text-sm font-medium text-slate-700 hover:text-blue-600">
            Login
          </button>

          <Button>Get Started</Button>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
