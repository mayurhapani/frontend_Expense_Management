import { useEffect, useState } from "react";
import { Container, Grid, Typography, CircularProgress, TextField, MenuItem, Button, Pagination } from "@mui/material";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import ExpenseChart from "../components/ExpenseChart";
import MonthlyComparisonChart from "../components/MonthlyComparisonChart";
import { motion } from "framer-motion";
import { useExpenses } from "../hooks/useExpenses.js";

const Dashboard = () => {
  const { expenses, loading, addExpense, editExpense, deleteExpense, fetchExpenses, totalPages } = useExpenses();
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'descending' });
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchExpenses(page, filterCategory, filterDateFrom, filterDateTo);
  }, [fetchExpenses, page, filterCategory, filterDateFrom, filterDateTo]);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const clearFilters = () => {
    setFilterCategory('');
    setFilterDateFrom('');
    setFilterDateTo('');
    setPage(1);
  };

  const categories = [...new Set(expenses.map(expense => expense.category))];

  const sortedExpenses = [...expenses].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  return (
    <Container maxWidth="lg" className="py-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <Typography variant="h3" component="h1" gutterBottom className="text-center text-indigo-600">
          Expense Dashboard
        </Typography>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <CircularProgress />
          </div>
        ) : (
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <ExpenseForm onSubmit={addExpense} />
            </Grid>
            <Grid item xs={12} md={6}>
              <ExpenseChart expenses={sortedExpenses} />
            </Grid>
            <Grid item xs={12}>
              <MonthlyComparisonChart expenses={expenses} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>Filters</Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={3}>
                  <TextField
                    select
                    fullWidth
                    label="Category"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                  >
                    <MenuItem value="">All Categories</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>{category}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    type="date"
                    fullWidth
                    label="From Date"
                    InputLabelProps={{ shrink: true }}
                    value={filterDateFrom}
                    onChange={(e) => setFilterDateFrom(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    type="date"
                    fullWidth
                    label="To Date"
                    InputLabelProps={{ shrink: true }}
                    value={filterDateTo}
                    onChange={(e) => setFilterDateTo(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={clearFilters}
                    fullWidth
                  >
                    Clear Filters
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <ExpenseList
                expenses={sortedExpenses}
                onEdit={editExpense}
                onDelete={deleteExpense}
                onSort={handleSort}
                sortConfig={sortConfig}
              />
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="center">
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Grid>
          </Grid>
        )}
      </motion.div>
    </Container>
  );
};

export default Dashboard;
