import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import BorrowBook from "./BorrowBook";

const BookCard = ({
  book,
  onBookDeleted,
  onBookBorrowed,
  isBorrowed,
  onReturnBook,
  returningBookId,
  isProfilePage,
}) => {
  const { userRole, isLoggedIn } = useContext(AuthContext);
  const isAdmin = userRole === "admin";
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [showBorrowModal, setShowBorrowModal] = useState(false);

  const handleEditBook = () => {
    navigate(`/edit-book/${book._id}`);
  };

  const handleDeleteBook = async () => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await axios.delete(`${BASE_URL}/books/${book._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        toast.success("Book deleted successfully");
        if (onBookDeleted) {
          onBookDeleted(book._id);
        }
      } catch (error) {
        console.error("Error deleting book:", error);
        toast.error("Failed to delete book");
      }
    }
  };

  const handleBorrowClick = () => {
    if (isLoggedIn) {
      setShowBorrowModal(true);
    } else {
      toast.error("Please log in to borrow books");
      navigate("/signin");
    }
  };

  const handleBorrowSuccess = () => {
    setShowBorrowModal(false);
    if (onBookBorrowed) {
      onBookBorrowed(book._id);
    }
  };

  const renderActionButtons = () => {
    if (isAdmin) {
      return (
        <div className="flex justify-between items-center w-full">
          <div>
            <button
              onClick={() => navigate(`/books/${book?._id}`)}
              className="inline-block bg-blue-500 text-white px-3 py-1 text-sm rounded-md hover:bg-blue-600 transition duration-300 mr-2"
            >
              View Details
            </button>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleEditBook}
              className="text-yellow-500 hover:text-yellow-600 transition duration-300"
              title="Edit book"
            >
              <FaEdit size={16} />
            </button>
            <button
              onClick={handleDeleteBook}
              className="text-red-500 hover:text-red-600 transition duration-300"
              title="Delete book"
            >
              <FaTrash size={16} />
            </button>
          </div>
        </div>
      );
    }

    if (isProfilePage && isBorrowed) {
      return (
        <div className="flex justify-between items-center w-full">
          <button
            onClick={() => onReturnBook(book._id)}
            disabled={returningBookId === book._id}
            className={`inline-block bg-green-500 text-white px-3 py-1 text-sm rounded-md hover:bg-green-600 transition duration-300 ${
              returningBookId === book._id ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {returningBookId === book._id ? "Returning..." : "Return Book"}
          </button>
          <button
            onClick={() => navigate(`/books/${book?._id}`)}
            className="inline-block bg-blue-500 text-white px-3 py-1 text-sm rounded-md hover:bg-blue-600 transition duration-300"
          >
            View Details
          </button>
        </div>
      );
    }

    if (isBorrowed) {
      return (
        <button
          onClick={() => navigate(`/books/${book?._id}`)}
          className="inline-block bg-blue-500 text-white px-3 py-1 text-sm rounded-md hover:bg-blue-600 transition duration-300"
        >
          View Details
        </button>
      );
    }

    if (isLoggedIn && !isAdmin) {
      return (
        <button
          onClick={handleBorrowClick}
          className="inline-block bg-green-500 text-white px-3 py-1 text-sm rounded-md hover:bg-green-600 transition duration-300"
        >
          Borrow
        </button>
      );
    }

    // If not logged in, don't show any button
    return null;
  };

  // Function to ensure HTTPS
  const ensureHttps = (url) => {
    if (url && url.startsWith("http://")) {
      return url.replace("http://", "https://");
    }
    return url;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
      <div className="h-80 bg-gray-100 flex items-center justify-center">
        <img
          src={ensureHttps(book?.image)}
          alt={book?.title}
          className="max-w-full max-h-full object-contain"
        />
      </div>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2 text-gray-800 truncate">{book?.title}</h2>
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-gray-600">by {book?.author}</p>
          <p className="text-xs text-gray-500">{book?.genre}</p>
        </div>
        <div className="flex justify-between items-center">{renderActionButtons()}</div>
      </div>
      {showBorrowModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <BorrowBook
              bookId={book._id}
              onSuccess={handleBorrowSuccess}
              onCancel={() => setShowBorrowModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

BookCard.propTypes = {
  book: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    image: PropTypes.string,
    title: PropTypes.string,
    author: PropTypes.string,
    genre: PropTypes.string,
  }).isRequired,
  onBookDeleted: PropTypes.func,
  onBookBorrowed: PropTypes.func,
  isBorrowed: PropTypes.bool,
  onReturnBook: PropTypes.func,
  returningBookId: PropTypes.string,
  isProfilePage: PropTypes.bool,
};

export default BookCard;
