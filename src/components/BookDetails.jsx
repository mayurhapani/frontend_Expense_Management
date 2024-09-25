import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";

const BookDetails = () => {
  const [book, setBook] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/books/${id}`);
        setBook(response.data.data);
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };

    fetchBookDetails();
  }, [id, BASE_URL]);

  if (!book) return <div className="container mx-auto px-4 py-20">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-20 relative">
      <button
        onClick={() => navigate("/")}
        className="absolute top-24 right-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 flex items-center"
      >
        <FaArrowLeft className="mr-2" /> Back
      </button>
      <h1 className="text-3xl font-bold mb-6">{book.title}</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <img src={book.image} alt={book.title} className="w-full rounded-lg shadow-lg" />
        </div>
        <div className="md:w-2/3">
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <div className="flex flex-wrap justify-between items-center mb-2">
              <p className="text-lg font-semibold text-indigo-600">By {book.author}</p>
              <p className="text-sm font-medium text-gray-600">
                Genre: <span className="text-gray-800">{book.genre}</span>
              </p>
              <p className="text-sm font-medium text-gray-600">
                Published:{" "}
                <span className="text-gray-800">
                  {new Date(book.publicationDate).toLocaleDateString()}
                </span>
              </p>
            </div>
            <hr className="border-t border-gray-300 my-2" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Description</h2>
          <div className="prose max-w-none overflow-y-auto h-[calc(100vh-400px)] pr-4 custom-scrollbar">
            <p>{book.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
