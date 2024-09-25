import { Card, CardContent, Typography } from "@mui/material";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

const ExpenseDetails = ({ expense }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="shadow-lg">
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            Expense Details
          </Typography>
          <Typography variant="body1">Amount: ${expense.amount}</Typography>
          <Typography variant="body1">Description: {expense.description}</Typography>
          <Typography variant="body1">Date: {expense.date}</Typography>
          <Typography variant="body1">Category: {expense.category}</Typography>
          <Typography variant="body1">Payment Method: {expense.paymentMethod}</Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
};

ExpenseDetails.propTypes = {
  expense: PropTypes.shape({
    amount: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    paymentMethod: PropTypes.string.isRequired,
  }).isRequired,
};

export default ExpenseDetails;
