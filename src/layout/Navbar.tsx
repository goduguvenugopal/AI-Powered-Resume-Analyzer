import  { useState, useRef, useEffect } from "react";
import { Menu, LogOut, User, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import ButtonLoader from "../components/loaders/ButtonLoader";

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
      toast.success("Logged out successfully");
    } catch {
      toast.error("Logout failed. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="h-14 bg-zinc-950 border-b border-zinc-800/60 flex items-center justify-between px-4 shrink-0 z-10">
      {/* Left: hamburger */}
      <button
        onClick={onMenuClick}
        className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
        aria-label="Toggle sidebar"
      >
        <Menu size={18} />
      </button>

      {/* Right: user dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((p) => !p)}
          className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-zinc-800 transition-colors"
        >
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-zinc-700"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-semibold text-white">
              {user?.displayName?.[0]?.toUpperCase() ?? "U"}
            </div>
          )}
          <span className="text-sm text-zinc-300 font-medium max-w-[120px] truncate hidden sm:block">
            {user?.displayName}
          </span>
          <ChevronDown
            size={14}
            className={`text-zinc-500 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* Dropdown */}
        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-52 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl shadow-black/40 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            {/* User info */}
            <div className="px-4 py-3 border-b border-zinc-800">
              <p className="text-sm font-medium text-zinc-100 truncate">
                {user?.displayName}
              </p>
              <p className="text-xs text-zinc-500 truncate mt-0.5">
                {user?.email}
              </p>
            </div>

            {/* Profile */}
            <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-colors">
              <User size={15} className="text-zinc-500" />
              Profile
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-60"
            >
              {loggingOut ? <ButtonLoader size={15} /> : <LogOut size={15} />}
              {loggingOut ? "Logging out…" : "Log out"}
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
