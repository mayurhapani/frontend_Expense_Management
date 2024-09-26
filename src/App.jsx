import { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthContext } from "./context/AuthProvider.jsx";
import { ExpenseProvider } from "./context/ExpenseContext"; // Add this import
import Header from "./components/Header.jsx";
import GlobalLoader from "./components/GlobalLoader.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Profile from "./pages/Profile.jsx";
import Signin from "./pages/Signin.jsx";
import Signup from "./pages/Signup.jsx";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useContext(AuthContext);

  if (loading) return <GlobalLoader />;
  if (!isLoggedIn) return <Navigate to="/signin" />;

  return children;
};  

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

function App() {
  const { loading } = useContext(AuthContext);

  return (
    <ExpenseProvider>
      {" "}
      {/* Add this wrapper */}
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            {loading ? (
              <GlobalLoader />
            ) : (
              <Routes>
                <Route path="/signin" element={<Signin />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            )}
          </main>
          <ToastContainer />
        </div>
      </Router>
    </ExpenseProvider>
  );
}

export default App;
