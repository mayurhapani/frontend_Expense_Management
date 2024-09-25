import { useState } from "react";
import { TextField, Button, MenuItem, Paper } from "@mui/material";
import { motion } from "framer-motion";
import PropTypes from 'prop-types';

const ExpenseForm = ({ onSubmit }) => {
  const [expense, setExpense] = useState({
    amount: "",
    description: "",
    date: "",
    category: "",
    paymentMethod: "",
  });

  const handleChange = (e) => {
    setExpense({ ...expense, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(expense);
    setExpense({ amount: "", description: "", date: "", category: "", paymentMethod: "" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper className="p-6 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            fullWidth
            label="Amount"
            name="amount"
            type="number"
            value={expense.amount}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={expense.description}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Date"
            name="date"
            type="date"
            value={expense.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            fullWidth
            select
            label="Category"
            name="category"
            value={expense.category}
            onChange={handleChange}
            required
          >
            <MenuItem value="Food">Food</MenuItem>
            <MenuItem value="Transport">Transport</MenuItem>
            <MenuItem value="Entertainment">Entertainment</MenuItem>
            <MenuItem value="Utilities">Utilities</MenuItem>
          </TextField>
          <TextField
            fullWidth
            select
            label="Payment Method"
            name="paymentMethod"
            value={expense.paymentMethod}
            onChange={handleChange}
            required
          >
            <MenuItem value="Cash">Cash</MenuItem>
            <MenuItem value="Credit Card">Credit Card</MenuItem>
          </TextField>
          <Button type="submit" variant="contained" color="primary" className="w-full">
            Add Expense
          </Button>
        </form>
      </Paper>
    </motion.div>
  );
};

ExpenseForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default ExpenseForm;
