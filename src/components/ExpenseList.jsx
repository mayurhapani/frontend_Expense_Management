import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

const ExpenseList = ({ expenses, onEdit, onDelete, onSort, sortConfig }) => {
  const [editingExpense, setEditingExpense] = useState(null);
  const [editedExpense, setEditedExpense] = useState({});
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  if (!Array.isArray(expenses) || expenses.length === 0) {
    return <div>No expenses to display</div>;
  }

  const handleEditClick = (expense) => {
    setEditingExpense(expense);
    setEditedExpense({ ...expense });
  };

  const handleEditChange = (e) => {
    setEditedExpense({ ...editedExpense, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = () => {
    onEdit(editingExpense._id, editedExpense);
    setEditingExpense(null);
  };

  const handleDeleteClick = (expense) => {
    setDeleteConfirmation(expense);
  };

  const handleDeleteConfirm = () => {
    onDelete(deleteConfirmation._id);
    setDeleteConfirmation(null);
  };

  const categoryOptions = ["Food", "Transportation", "Entertainment", "Utilities", "Other", "Transport"];

  const renderSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? '▲' : '▼';
    }
    return null;
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell onClick={() => onSort('date')}>
              Date {renderSortIcon('date')}
            </TableCell>
            <TableCell onClick={() => onSort('description')}>
              Description {renderSortIcon('description')}
            </TableCell>
            <TableCell onClick={() => onSort('category')}>
              Category {renderSortIcon('category')}
            </TableCell>
            <TableCell onClick={() => onSort('amount')}>
              Amount {renderSortIcon('amount')}
            </TableCell>
            <TableCell onClick={() => onSort('paymentMethod')}>
              Payment Method {renderSortIcon('paymentMethod')}
            </TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {expenses.map((expense, index) => (
            <motion.tr
              key={expense._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
              <TableCell>{expense.description}</TableCell>
              <TableCell>{expense.category}</TableCell>
              <TableCell>${expense.amount.toFixed(2)}</TableCell>
              <TableCell>{expense.paymentMethod}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleEditClick(expense)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDeleteClick(expense)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>

      {/* Edit Expense Dialog */}
      <Dialog open={!!editingExpense} onClose={() => setEditingExpense(null)}>
        <DialogTitle>Edit Expense</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            value={editedExpense.description || ""}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            name="amount"
            label="Amount"
            type="number"
            fullWidth
            value={editedExpense.amount || ""}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            name="date"
            label="Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={editedExpense.date ? editedExpense.date.split("T")[0] : ""}
            onChange={handleEditChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={editedExpense.category || ""}
              onChange={handleEditChange}
            >
              {categoryOptions.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Payment Method</InputLabel>
            <Select
              name="paymentMethod"
              value={editedExpense.paymentMethod || ""}
              onChange={handleEditChange}
            >
              <MenuItem value="Cash">Cash</MenuItem>
              <MenuItem value="Credit Card">Credit Card</MenuItem>
              <MenuItem value="Debit Card">Debit Card</MenuItem>
              <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingExpense(null)}>Cancel</Button>
          <Button onClick={handleEditSubmit}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmation} onClose={() => setDeleteConfirmation(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this expense?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmation(null)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
};

ExpenseList.propTypes = {
  expenses: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onSort: PropTypes.func.isRequired,
  sortConfig: PropTypes.object.isRequired,
};

export default ExpenseList;
