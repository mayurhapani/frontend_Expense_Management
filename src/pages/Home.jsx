import { useEffect, useContext, useState, useCallback } from "react";
import { AuthContext } from "../context/AuthProvider";
import axios from "axios";
import { toast } from "react-toastify";
import BookCard from "../components/BookCard";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [borrowedBookIds, setBorrowedBookIds] = useState([]);

  const { isLoggedIn, user, loading } = useContext(AuthContext);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const fetchBorrowedBooks = useCallback(async () => {
    if (isLoggedIn && user) {
      try {
        const response = await axios.get(`${BASE_URL}/users/getUser`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const borrowedBooks = response.data.data.borrowedBooks || [];
        setBorrowedBookIds(borrowedBooks.map((book) => book.book._id));
      } catch (error) {
        console.error("Error fetching borrowed books:", error);
      }
    }
  }, [BASE_URL, isLoggedIn, user]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/books`);
        const fetchedBooks = response.data.data;
        setBooks(fetchedBooks);

        const uniqueGenres = [...new Set(fetchedBooks.map((book) => book.genre).filter(Boolean))];
        setGenres(uniqueGenres);
      } catch (error) {
        toast.error("Failed to fetch books");
      }
    };

    fetchBooks();
    if (isLoggedIn && user) {
      fetchBorrowedBooks();
    }
  }, [BASE_URL, isLoggedIn, user, fetchBorrowedBooks]);

  const handleBookBorrowed = useCallback((borrowedBookId) => {
    setBorrowedBookIds((prevIds) => [...prevIds, borrowedBookId]);
  }, []);

  const filteredBooks = books.filter((book) => {
    const genreMatch = book?.genre && book?.genre.toLowerCase().includes(searchTerm.toLowerCase());
    const titleMatch = book?.title && book?.title.toLowerCase().includes(searchTerm.toLowerCase());
    const authorMatch =
      book?.author && book?.author.toLowerCase().includes(searchTerm.toLowerCase());
    return genreMatch || titleMatch || authorMatch;
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleBookDeleted = (deletedBookId) => {
    setBooks((prevBooks) => prevBooks?.filter((book) => book._id !== deletedBookId));
  };

  return (
    <div className="bg-gradient-to-r from-blue-100 to-indigo-100 min-h-screen">
      <div className="container mx-auto px-4 pt-20 pb-8">
        <h1 className="text-4xl font-bold text-center text-indigo-800 mb-8">
          E-Library Management System
        </h1>

        {isLoggedIn ? (
          <p className="text-center mb-8">Welcome back, {user?.name}!</p>
        ) : (
          <p className="text-center mb-8">Please sign in to borrow books.</p>
        )}

        {/* Search input */}
        <div className="mb-8">
          <div className="max-w-md mx-auto">
            <div className="relative flex items-center w-full h-12 rounded-lg focus-within:shadow-lg bg-white overflow-hidden">
              <div className="grid place-items-center h-full w-12 text-gray-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                className="peer h-full w-full outline-none text-sm text-gray-700 pr-2"
                type="text"
                id="search"
                placeholder="Search books by title, author, or genre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Genre tags */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {genres?.map((genre) => (
            <button
              key={genre}
              onClick={() => setSearchTerm(genre)}
              className="px-4 py-2 text-sm font-medium bg-white text-indigo-700 hover:bg-indigo-50 border border-indigo-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Book grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBooks?.length > 0 ? (
            filteredBooks?.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                onBookDeleted={handleBookDeleted}
                onBookBorrowed={handleBookBorrowed}
                isBorrowed={borrowedBookIds.includes(book._id)}
              />
            ))
          ) : (
            <p className="text-center col-span-full text-gray-600">
              No books found for &ldquo;{searchTerm}&rdquo;.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
