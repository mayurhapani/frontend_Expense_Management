import { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthContext } from "./context/AuthProvider.jsx";
import Header from "./components/Header.jsx";
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import Signin from "./pages/Signin.jsx";
import GlobalLoader from "./components/GlobalLoader.jsx";
import Signup from "./pages/Signup.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ManageBooks from "./pages/ManageBooks.jsx";
import BookDetails from "./components/BookDetails";
import EditBook from "./pages/EditBook";

function App() {
  const { loading } = useContext(AuthContext);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          {loading ? (
            <GlobalLoader />
          ) : (
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/books" element={<ManageBooks />} />
              <Route path="/books/:id" element={<BookDetails />} />
              <Route path="/edit-book/:id" element={<EditBook />} />
            </Routes>
          )}
        </main>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;
