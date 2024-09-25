import { useState, useContext, useEffect, useCallback } from "react";
import { FaCog } from "react-icons/fa";
import { AuthContext } from "../context/AuthProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import GlobalLoader from "../components/GlobalLoader";
import {
  Typography,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

export default function Profile() {
  const [showSettings, setShowSettings] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [expenseCategories, setExpenseCategories] = useState([]);

  const {
    isLoggedIn,
    user,
    logout,
    checkLoginStatus,
    loading: authLoading,
  } = useContext(AuthContext);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const navigate = useNavigate();

  const fetchUserData = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users/getUser`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setName(response?.data?.data?.name);
      setEmail(response?.data?.data?.email);

      // Fetch user's expense summary
      const expenseSummary = await axios.get(`${BASE_URL}/expenses/summary`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTotalExpenses(expenseSummary.data.totalExpenses);
      setExpenseCategories(expenseSummary.data.categories);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to fetch user data");
    } finally {
      setIsLoading(false);
    }
  }, [BASE_URL]);

  useEffect(() => {
    const initializeProfile = async () => {
      if (!authLoading) {
        if (isLoggedIn) {
          await fetchUserData();
        } else {
          navigate("/signin");
        }
      }
    };

    initializeProfile();
  }, [isLoggedIn, navigate, fetchUserData, authLoading]);

  if (authLoading || isLoading) {
    return <GlobalLoader />;
  }

  if (!isLoggedIn || !user) {
    return null;
  }

  const handleDeleteAccount = () => {
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/users/delete/${user?._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Account deleted successfully");
      setShowDeleteConfirmation(false);
      setShowSettings(false);

      await logout();
      navigate("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error(error.response?.data?.message || "Error deleting account. Please try again.");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${BASE_URL}/users/update/${user?._id}`,
        { name, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Profile updated successfully");
      setShowSettings(false);
      checkLoginStatus();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Error updating profile. Please try again.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen pt-20">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 relative">
          <Button
            onClick={() => setShowSettings(true)}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FaCog size={24} />
          </Button>
          <Typography variant="h4" component="h1" gutterBottom>
            {user?.name?.replace(/'/g, "&apos;")}&apos;s Profile
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Email: {user?.email}
          </Typography>
        </div>

        <div className="mb-6">
          <Typography variant="h5" component="h2" gutterBottom>
            Expense Summary
          </Typography>
          <Typography variant="body1">Total Expenses: ${totalExpenses.toFixed(2)}</Typography>
          <Typography variant="h6" component="h3" gutterBottom>
            Top Expense Categories:
          </Typography>
          <ul>
            {expenseCategories.map((category, index) => (
              <li key={index}>
                {category.name}: ${category.total.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onClose={() => setShowSettings(false)}>
        <DialogTitle>Profile Settings</DialogTitle>
        <DialogContent>
          <form onSubmit={handleUpdateProfile}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Name"
              type="text"
              fullWidth
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              margin="dense"
              id="email"
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSettings(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdateProfile} color="primary">
            Update Profile
          </Button>
          <Button onClick={handleDeleteAccount} color="secondary">
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirmation} onClose={() => setShowDeleteConfirmation(false)}>
        <DialogTitle>Confirm Account Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your account? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteConfirmation(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDeleteAccount} color="secondary">
            Delete My Account
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
