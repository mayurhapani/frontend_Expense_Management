# Expense Management Frontend

This is the frontend application for an Expense Management system, built with React and Vite.

## Live Demo

You can access the live application here: https://frontend-expense-management.vercel.app

## Features

- User authentication (login/signup)
- Dashboard with expense overview
- Add, edit, and delete expenses
- Categorize expenses
- Visualize expenses with charts
- CSV import/export functionality
- Responsive design for mobile and desktop

## Technologies Used

- React 18
- Vite
- Material-UI
- Axios for API requests
- Chart.js for data visualization
- React Router for navigation
- React Toastify for notifications
- Tailwind CSS for styling

## Getting Started

### Prerequisites

- Node.js (v14 or later recommended)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/mayurhapani/frontend_Expense_Management.git
   ```

2. Navigate to the project directory:

   ```bash
   cd frontend_Expense_Management
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

   or if you're using yarn:

   ```bash
   yarn
   ```

4. Create a `.env` file in the root directory and add the following:
   ```bash
   VITE_BASE_URL=http://localhost:8001
   ```
   Replace the URL with your backend API URL if different.

### Running the Application

To start the development server:

```
npm run dev
```

or with yarn:

```
yarn dev
```

The application will be available at `http://localhost:5173` (or the next available port).

## Building for Production

To create a production build:

```
npm run build
```

or with yarn:

```
yarn build
```

## Deployment

This project is set up for easy deployment on Vercel. Connect your GitHub repository to Vercel for automatic deployments on every push to the main branch.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

Project Link: https://github.com/mayurhapani/frontend_Expense_Management

## Acknowledgements

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Material-UI](https://mui.com/)
- [Chart.js](https://www.chartjs.org/)
- [Vercel](https://vercel.com/)
