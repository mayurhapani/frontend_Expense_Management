import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa";

const EditBook = () => {
  const [book, setBook] = useState(null);
  const [errors, setErrors] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/books/${id}`);
        setBook(response.data.data);
      } catch (error) {
        console.error("Error fetching book:", error);
        toast.error("Failed to fetch book details");
      }
    };

    fetchBook();
  }, [id, BASE_URL]);

  const validateForm = () => {
    const newErrors = {};
    if (!book.title.trim()) newErrors.title = "Title is required";
    if (!book.author.trim()) newErrors.author = "Author is required";
    if (!book.genre.trim()) newErrors.genre = "Genre is required";
    if (!book.publicationDate) newErrors.publicationDate = "Publication Date is required";
    if (!book.description.trim()) newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      await axios.put(`${BASE_URL}/books/${id}`, book, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Book updated successfully");
      navigate(`/books/${id}`);
    } catch (error) {
      console.error("Error updating book:", error);
      toast.error("Failed to update book");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook({ ...book, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  if (!book) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-20"> 
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Edit Book</h1>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 flex items-center"
        >
          <FaArrowLeft className="mr-2" /> Back to Home
        </button>
      </div>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={book.title}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${
              errors.title ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            required
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="author" className="block text-gray-700 font-bold mb-2">
            Author
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={book.author}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${
              errors.author ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            required
          />
          {errors.author && <p className="text-red-500 text-xs mt-1">{errors.author}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="genre" className="block text-gray-700 font-bold mb-2">
            Genre
          </label>
          <input
            type="text"
            id="genre"
            name="genre"
            value={book.genre}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${
              errors.genre ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            required
          />
          {errors.genre && <p className="text-red-500 text-xs mt-1">{errors.genre}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="publicationDate" className="block text-gray-700 font-bold mb-2">
            Publication Date
          </label>
          <input
            type="date"
            id="publicationDate"
            name="publicationDate"
            value={book.publicationDate.split("T")[0]}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${
              errors.publicationDate ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            required
          />
          {errors.publicationDate && (
            <p className="text-red-500 text-xs mt-1">{errors.publicationDate}</p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 font-bold mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={book.description}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${
              errors.description ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            rows="4"
            required
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Update Book
        </button>
      </form>
    </div>
  );
};

export default EditBook;
