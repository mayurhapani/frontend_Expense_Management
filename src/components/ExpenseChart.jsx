import { Pie } from "react-chartjs-2";
import { Card, CardContent, Typography } from "@mui/material";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseChart = ({ expenses = [] }) => {
  if (!Array.isArray(expenses) || expenses.length === 0) {
    return <div>No expenses data available</div>;
  }

  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
      },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-lg">
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            Expense Breakdown
          </Typography>
          <Pie data={data} />
        </CardContent>
      </Card>
    </motion.div>
  );
};

ExpenseChart.propTypes = {
  expenses: PropTypes.arrayOf(
    PropTypes.shape({
      category: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default ExpenseChart;
