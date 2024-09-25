import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import PropTypes from "prop-types";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MonthlyComparisonChart = ({ expenses }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const monthlyData = expenses.reduce((acc, expense) => {
      const date = new Date(expense.date);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      if (!acc[monthYear]) {
        acc[monthYear] = {};
      }
      if (!acc[monthYear][expense.category]) {
        acc[monthYear][expense.category] = 0;
      }
      acc[monthYear][expense.category] += expense.amount;
      return acc;
    }, {});

    const labels = Object.keys(monthlyData).sort();
    const categories = [...new Set(expenses.map((expense) => expense.category))];
    const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"];

    const datasets = categories.map((category, index) => ({
      label: category,
      data: labels.map((month) => monthlyData[month][category] || 0),
      backgroundColor: colors[index % colors.length],
    }));

    setChartData({ labels, datasets });
  }, [expenses]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Expense Comparison by Category",
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
    barThickness: 20, // This makes the bars thinner
    maxBarThickness: 30, // This sets a maximum thickness for the bars
  };

  return <Bar options={options} data={chartData} />;
};

MonthlyComparisonChart.propTypes = {
  expenses: PropTypes.array.isRequired,
};

export default MonthlyComparisonChart;
