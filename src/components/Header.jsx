import { Link } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthProvider";
import { FaUser, FaSignOutAlt, FaChartPie, FaWallet, FaCog } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const { isLoggedIn, userName, logout } = useContext(AuthContext);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-gradient-to-r from-green-400 to-blue-500 shadow-lg z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link
            to="/"
            className="text-2xl md:text-3xl font-bold text-white hover:text-green-100 transition duration-300 flex items-center"
          >
            <FaWallet className="mr-2" />
            ExpenseTracker
          </Link>
          <nav>
            <ul className="flex items-center space-x-6">
              {isLoggedIn ? (
                <>
                  <li>
                    <Link
                      to="/"
                      className="text-white hover:text-green-100 transition duration-300 flex items-center"
                    >
                      <FaChartPie className="mr-2" />
                      Dashboard
                    </Link>
                  </li>
                  <li className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-2 text-white hover:text-green-100 transition duration-300 bg-white bg-opacity-20 rounded-full px-4 py-2"
                    >
                      <FaUser />
                      <span className="font-semibold">{userName}</span>
                    </button>
                    <AnimatePresence>
                      {showUserMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-50"
                        >
                          <Link
                            to="/profile"
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-green-500 hover:text-white transition duration-300 flex items-center"
                          >
                            <FaCog className="mr-2" />
                            Profile
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-green-500 hover:text-white w-full text-left transition duration-300 flex items-center"
                          >
                            <FaSignOutAlt className="mr-2" />
                            Logout
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to="/signin"
                      className="text-white hover:text-green-100 transition duration-300 bg-white bg-opacity-20 rounded-full px-4 py-2"
                    >
                      Sign In
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/signup"
                      className="text-white hover:text-green-100 transition duration-300 bg-green-500 rounded-full px-4 py-2"
                    >
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
