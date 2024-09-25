import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

export const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/expenses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(Array.isArray(response.data.data.expenses) ? response.data.data.expenses : []);
      console.log("Fetched expenses:", response.data.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const addExpense = async (newExpense) => {
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

  const editExpense = async (id, updatedExpense) => {
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

  const deleteExpense = async (id) => {
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
    <ExpenseContext.Provider
      value={{ expenses, loading, addExpense, editExpense, deleteExpense, fetchExpenses }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

ExpenseProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
