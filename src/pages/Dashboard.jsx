import { useState, useEffect } from "react";
import { Container, Grid, Typography } from "@mui/material";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import ExpenseChart from "../components/ExpenseChart";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/expenses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(Array.isArray(response.data.data) ? response.data.data : []);
      console.log("Fetched expenses:", response.data.data); // For debugging
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setExpenses([]);
    }
  };

  const handleAddExpense = async (newExpense) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/expenses`, newExpense, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setExpenses([...expenses, response.data.data]);
      toast.success("Expense added successfully!");
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Failed to add expense. Please try again.");
    }
  };

  const handleEditExpense = async (id, updatedExpense) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/expenses/${id}`,
        updatedExpense,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setExpenses(expenses.map((expense) => (expense._id === id ? response.data.data : expense)));
      toast.success("Expense updated successfully!");
    } catch (error) {
      console.error("Error updating expense:", error);
      toast.error("Failed to update expense. Please try again.");
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/expenses/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setExpenses(expenses.filter((expense) => expense._id !== id));
      toast.success("Expense deleted successfully!");
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense. Please try again.");
    }
  };

  return (
    <Container maxWidth="lg" className="py-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          className="text-center text-indigo-600"
        >
          Expense Dashboard
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <ExpenseForm onSubmit={handleAddExpense} />
          </Grid>
          <Grid item xs={12} md={6}>
            <ExpenseChart expenses={expenses} />
          </Grid>
          <Grid item xs={12}>
            <ExpenseList
              expenses={expenses}
              onEdit={handleEditExpense}
              onDelete={handleDeleteExpense}
              loading={loading}
            />
          </Grid>
        </Grid>
      </motion.div>
    </Container>
  );
};

export default Dashboard;
