import { useState, useContext, useEffect, useCallback } from "react";
import { FaCog } from "react-icons/fa";
import { AuthContext } from "../context/AuthProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import GlobalLoader from "../components/GlobalLoader";
import BookCard from "../components/BookCard";

export default function Profile() {
  const [showSettings, setShowSettings] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [returningBookId, setReturningBookId] = useState(null);

  const {
    isLoggedIn,
    user,
    logout,
    checkLoginStatus,
    loading: authLoading,
  } = useContext(AuthContext);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const navigate = useNavigate();

  const fetchUserData = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users/getUser`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setName(response?.data?.data?.name);
      setEmail(response?.data?.data?.email);
      setBorrowedBooks(response?.data?.data?.borrowedBooks || []);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to fetch user data");
    } finally {
      setIsLoading(false);
    }
  }, [BASE_URL]);

  useEffect(() => {
    const initializeProfile = async () => {
      if (!authLoading) {
        if (isLoggedIn) {
          await fetchUserData();
        } else {
          navigate("/signin");
        }
      }
    };

    initializeProfile();
  }, [isLoggedIn, navigate, fetchUserData, authLoading]);

  if (authLoading || isLoading) {
    return <GlobalLoader />;
  }

  if (!isLoggedIn || !user) {
    return null;
  }

  if (isLoading) {
    return <GlobalLoader />;
  }

  const handleDeleteAccount = () => {
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/users/delete/${user?._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Account deleted successfully");
      setShowDeleteConfirmation(false);
      setShowSettings(false);

      await logout();
      navigate("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error(error.response?.data?.message || "Error deleting account. Please try again.");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${BASE_URL}/users/update/${user?._id}`,
        { name, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Profile updated successfully");
      setShowSettings(false);
      checkLoginStatus();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Error updating profile. Please try again.");
    }
  };

  const handleReturnBook = async (bookId) => {
    setReturningBookId(bookId);
    try {
      await axios.post(
        `${BASE_URL}/books/${bookId}/return`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      toast.success("Book returned successfully");
      fetchUserData();
    } catch (error) {
      console.error("Error returning book:", error);
      toast.error("Failed to return book");
    } finally {
      setReturningBookId(null);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen pt-20">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 relative">
          <button
            onClick={() => setShowSettings(true)}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FaCog size={24} />
          </button>
          <h1 className="text-3xl font-bold mb-4">{user?.name}&apos;s Profile</h1>
          <p className="text-gray-600">Email: {user?.email}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Borrowed Books</h2>
          {borrowedBooks?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {borrowedBooks?.map((book) => (
                <div key={book._id} className="relative">
                  <BookCard
                    book={book.book}
                    isBorrowed={true}
                    onReturnBook={handleReturnBook}
                    returningBookId={returningBookId}
                    isProfilePage={true}
                  />
                  <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-md shadow-md">
                    <p className="text-xs font-semibold">
                      Return by: {new Date(book.returnDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">You haven&apos;t borrowed any books yet.</p>
          )}
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-4">Profile Settings</h2>
            <form onSubmit={handleUpdateProfile}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Update Profile
                </button>
                <button
                  type="button"
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  onClick={handleDeleteAccount}
                >
                  Delete Account
                </button>
              </div>
            </form>
            <button
              onClick={() => setShowSettings(false)}
              className="mt-4 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-4">Confirm Account Deletion</h2>
            <p className="mb-6">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            <div className="flex justify-between">
              <button
                onClick={confirmDeleteAccount}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Yes, Delete My Account
              </button>
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
