import { useState, useContext, useEffect, useCallback } from "react";
import { FaCog, FaUpload, FaTrash, FaDownload } from "react-icons/fa";
import { AuthContext } from "../context/AuthProvider";
import { useExpenses } from "../hooks/useExpenses.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import GlobalLoader from "../components/GlobalLoader";
import {
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Input,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Paper,
  Divider,
  Chip,
  Box,
  Pagination,
} from "@mui/material";
import { PieChart } from "react-minimal-pie-chart";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Profile() {
  const [showSettings, setShowSettings] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedExpenses, setSelectedExpenses] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const {
    isLoggedIn,
    user,
    logout,
    checkLoginStatus,
    loading: authLoading,
  } = useContext(AuthContext);
  const { expenses, fetchExpenses } = useExpenses();
  const navigate = useNavigate();

  const fetchUserData = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users/getUser`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setName(response?.data?.data?.name);
      setEmail(response?.data?.data?.email);
      await fetchExpenses();
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to fetch user data");
    } finally {
      setIsLoading(false);
    }
  }, [BASE_URL, fetchExpenses]);

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

  // Calculate totalExpenses and expenseCategories from the expenses array
  const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);
  const expenseCategories = expenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = { name: expense.category, total: 0 };
    }
    acc[expense.category].total += expense.amount;
    return acc;
  }, {});

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

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleBulkUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a CSV file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${BASE_URL}/expenses/bulk-upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response:", response.data);

      if (response.data.statusCode === 201) {
        toast.success(response.data.message);
        fetchExpenses();
      } else if (response.data.statusCode === 400) {
        const errorMessages = response.data.data.errors.join("\n");
        const validCount = response.data.data.validCount;

        toast.error(
          <div>
            <p>Validation errors in CSV:</p>
            <pre style={{ maxHeight: "200px", overflowY: "auto" }}>{errorMessages}</pre>
            <p>{`${validCount} valid expenses found.`}</p>
            <p>Please correct the errors and try again.</p>
          </div>,
          { autoClose: false }
        );
      }
    } catch (error) {
      console.error("Error uploading expenses:", error);
      console.error("Error response:", error.response?.data);
      if (error.response?.data?.statusCode === 400) {
        const errorMessages = error.response.data.data.errors.join("\n");
        const validCount = error.response.data.data.validCount;

        toast.error(
          <div>
            <p>Validation errors in CSV:</p>
            <pre style={{ maxHeight: "200px", overflowY: "auto" }}>{errorMessages}</pre>
            <p>{`${validCount} valid expenses found.`}</p>
            <p>Please correct the errors and try again.</p>
          </div>,
          { autoClose: false }
        );
      } else {
        toast.error(error.response?.data?.message || "Error uploading expenses. Please try again.");
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedExpenses.length === 0) {
      toast.error("Please select expenses to delete");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${BASE_URL}/expenses/bulk-delete`,
        { ids: selectedExpenses },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Selected expenses deleted successfully");
      setSelectedExpenses([]);
      fetchExpenses();
    } catch (error) {
      console.error("Error deleting expenses:", error);
      toast.error(error.response?.data?.message || "Error deleting expenses. Please try again.");
    }
  };

  const toggleExpenseSelection = (expenseId) => {
    setSelectedExpenses((prevSelected) =>
      prevSelected.includes(expenseId)
        ? prevSelected.filter((id) => id !== expenseId)
        : [...prevSelected, expenseId]
    );
  };

  const handleExport = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/expenses/export`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob", // Important for handling file downloads
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expenses.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Expenses exported successfully");
    } catch (error) {
      console.error("Error exporting expenses:", error);
      toast.error("Error exporting expenses. Please try again.");
    }
  };

  // useEffect(() => {
  //   const fetchExpensesData = async () => {
  //     try {
  //       const expensesData = await fetchExpenses(currentPage, itemsPerPage); // Use current page and items per page
  //       setExpenses(expensesData);
  //     } catch (error) {
  //       toast.error("Failed to fetch expenses");
  //     }
  //   };

  //   fetchExpensesData();
  // }, [currentPage, fetchExpenses, itemsPerPage]);

  // Add parameters for pagination in the fetchExpenses function
  // const fetchExpenses = async (page = 1, limit = 5) => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     const response = await axios.get(`${BASE_URL}/expenses`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //       params: { page, limit },
  //     });
  //     return response.data.expenses; // assuming the expenses are in response.data.expenses
  //   } catch (error) {
  //     console.error("Error fetching expenses:", error);
  //     throw error;
  //   }
  // };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-gray-100 min-h-screen pt-20">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 relative">
          <button
            onClick={() => setShowSettings(true)}
            className="absolute top-4 right-4 text-blue-800 hover:text-gray-800 focus:outline-none"
            aria-label="Open settings"
          >
            <FaCog size={24} />
          </button>
          <Typography variant="h4" component="h1" gutterBottom>
            {user?.name?.replace(/'/g, "&apos;")}&apos;s Profile
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Email: {user?.email}
          </Typography>
        </div>

        <div className="mb-6">
          <Typography variant="h5" component="h2" gutterBottom>
            Bulk Actions
          </Typography>
          <div className="flex space-x-4">
            <div>
              <Input
                type="file"
                onChange={handleFileChange}
                style={{ display: "none" }}
                id="csv-upload"
              />
              <label htmlFor="csv-upload">
                <Button variant="contained" component="span" startIcon={<FaUpload />}>
                  Select CSV
                </Button>
              </label>
              <Button
                variant="contained"
                color="primary"
                onClick={handleBulkUpload}
                disabled={!selectedFile}
                className="ml-2"
              >
                Upload Expenses
              </Button>
            </div>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<FaTrash />}
              onClick={handleBulkDelete}
              disabled={selectedExpenses.length === 0}
            >
              Delete Selected
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<FaDownload />}
              onClick={handleExport}
            >
              Export Expenses
            </Button>
          </div>
        </div>

        <div className="mb-4">
          <Typography variant="h6" component="h3" gutterBottom>
            CSV Upload Instructions
          </Typography>
          <ul className="list-disc pl-5">
            <li>
              The CSV file should have the following columns: amount, description, date, category,
              paymentMethod
            </li>
            <li>Amount should be a number (e.g., 10.99)</li>
            <li>Date should be in M/D/YYYY format (e.g., 5/15/2023)</li>
            <li>All fields are required</li>
            <li>Remove any empty rows at the end of your CSV file</li>
          </ul>
        </div>

        <Box className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Expense List */}
          <Paper elevation={3} className="p-4">
            <Typography variant="h5" component="h2" gutterBottom>
              Expense List
            </Typography>
            <List dense>
              {expenses.map((expense) => (
                <ListItem
                  key={expense._id}
                  secondaryAction={
                    <Checkbox
                      edge="end"
                      onChange={() => toggleExpenseSelection(expense._id)}
                      checked={selectedExpenses.includes(expense._id)}
                    />
                  }
                  disablePadding
                >
                  <ListItemText
                    primary={expense.description}
                    secondary={`$${expense.amount.toFixed(2)} - ${new Date(
                      expense.date
                    ).toLocaleDateString()}`}
                  />
                </ListItem>
              ))}
            </List>
            {/* Pagination Component */}
            <Box display="flex" justifyContent="center" marginTop={2}>
              <Pagination
                count={Math.ceil(expenses.length / itemsPerPage)} // Total number of pages
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          </Paper>

          {/* Expense Summary and Top Categories */}
          <Paper elevation={3} className="p-4">
            <Typography variant="h5" component="h2" gutterBottom>
              Expense Summary
            </Typography>
            <Typography variant="h4" className="mb-4">
              Total: ${totalExpenses.toFixed(2)}
            </Typography>

            <Divider className="my-4" />

            <Typography variant="h6" component="h3" gutterBottom>
              Top Expense Categories
            </Typography>
            <Box className="flex justify-between items-center mb-4">
              <Box className="w-1/2">
                <PieChart
                  data={Object.values(expenseCategories).map((category, index) => ({
                    title: category.name,
                    value: category.total,
                    color: `hsl(${index * 137.5}, 70%, 50%)`,
                  }))}
                  lineWidth={20}
                  paddingAngle={5}
                  labelStyle={{
                    fontSize: "5px",
                    fontFamily: "sans-serif",
                  }}
                  label={({ dataEntry }) => `${dataEntry.title}`}
                />
              </Box>
              <Box className="w-1/2">
                {Object.values(expenseCategories).map((category, index) => (
                  <Chip
                    key={index}
                    label={`${category.name}: $${category.total.toFixed(2)}`}
                    style={{
                      backgroundColor: `hsl(${index * 137.5}, 70%, 50%)`,
                      color: "white",
                      margin: "4px",
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Paper>
        </Box>
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
