import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import Button from "../ui/Button";

function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/login", { replace: true });
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium">{user?.name}</span>

      <Button variant="danger" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
}

export default UserMenu;
