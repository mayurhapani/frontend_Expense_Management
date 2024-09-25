import { useState, useCallback } from "react";
import axios from "axios";

export const useExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const fetchExpenses = useCallback(
    async (page = 1, category = "", startDate = "", endDate = "") => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/expenses`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { page, category, startDate, endDate },
        });
        setExpenses(response.data.data.expenses);
        setTotalPages(response.data.data.totalPages);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching expenses:", error);
        setLoading(false);
      }
    },
    []
  );

  const addExpense = async (newExpense) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/expenses`, newExpense, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses((prevExpenses) => [...prevExpenses, response.data.data]);
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  const editExpense = async (id, updatedExpense) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/expenses/${id}`,
        updatedExpense,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setExpenses((prevExpenses) =>
        prevExpenses.map((expense) => (expense._id === id ? response.data.data : expense))
      );
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  };

  const deleteExpense = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense._id !== id));
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  return { expenses, loading, addExpense, editExpense, deleteExpense, fetchExpenses, totalPages };
};
