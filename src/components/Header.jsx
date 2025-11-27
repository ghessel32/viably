import React from "react";
import { User, LogOut } from "lucide-react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import ideaStore from "../store/store";

function Header() {
  const navigate = useNavigate();
  const { isLoggedIn } = ideaStore();
  const [openMenu, setOpenMenu] = React.useState(false);
  const { logout } = ideaStore();

  const handleLogOut = () => {
    logout();
    setOpenMenu(false);
    navigate("/auth/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 relative">
          {/* Logo */}
          <div className="flex items-center gap-1">
            <img
              src="/Logo.png"
              alt="Viably Logo"
              className="h-8 w-8 object-contain"
            />
            <span className="text-2xl font-bold text-teal-400">Viably</span>
          </div>

          {/* Navigation (only when logged in) */}
          {isLoggedIn && (
            <nav className="hidden md:flex">
              <ul className="flex items-center gap-8 font-medium">
                <li>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `nav-underline transition-colors ${
                        isActive
                          ? "nav-underline-active text-teal-400"
                          : "text-gray-700 hover:text-gray-600"
                      }`
                    }
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/validate"
                    className={({ isActive }) =>
                      `nav-underline transition-colors ${
                        isActive
                          ? "nav-underline-active text-teal-400"
                          : "text-gray-700 hover:text-gray-600"
                      }`
                    }
                  >
                    Validate
                  </NavLink>
                </li>
              </ul>
            </nav>
          )}

          {/* User Icon */}
          {isLoggedIn && (
            <button
              onClick={() => setOpenMenu(!openMenu)}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:opacity-80 transition-opacity bg-teal-400 cursor-pointer"
            >
              <User className="w-5 h-5 text-white" />
            </button>
          )}

          {/* Dropdown */}
          {openMenu && (
            <div className="absolute right-0 top-16 bg-white shadow-md rounded-md p-3 w-36 transition-opacity duration-300 opacity-100 ">
              <ul>
                <Link to="/profile">
                  <li className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer">
                    <User className="w-4 h-4" />
                    Profile
                  </li>
                </Link>
                <li
                  onClick={handleLogOut}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
