import Button from "../ui/Button";
import Container from "../ui/Container";
import Logo from "../ui/Logo";
import { Link } from "react-router-dom";
function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <Container>
        <nav className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <Logo size="md" />
          </Link>

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
            <Link
              to="/login"
              className="text-sm font-medium text-slate-700 hover:text-blue-600"
            >
              Login
            </Link>

            <Link to="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>
      </Container>
    </header>
  );
}

export default Navbar;
