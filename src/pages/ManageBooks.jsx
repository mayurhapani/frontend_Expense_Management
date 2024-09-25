import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa";

const ManageBooks = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [publicationDate, setPublicationDate] = useState("");
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const uploadImage = async () => {
    const dataImage = new FormData();
    dataImage.append("file", image);
    dataImage.append("upload_preset", "instaClone");
    dataImage.append("cloud_name", "mayurcloud21");
    dataImage.append("folder", "e-library");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/mayurcloud21/upload",
        dataImage,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: false,
        }
      );
      return response.data.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!author.trim()) newErrors.author = "Author is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!genre.trim()) newErrors.genre = "Genre is required";
    if (!publicationDate) newErrors.publicationDate = "Publication Date is required";
    if (!image) newErrors.image = "Book Cover Image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      let imageUrl = "";
      if (image) {
        imageUrl = await uploadImage();
      }

      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/books`,
        {
          title,
          author,
          description,
          genre,
          publicationDate,
          image: imageUrl,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Book added successfully!");

      // Clear form fields
      setTitle("");
      setAuthor("");
      setDescription("");
      setGenre("");
      setPublicationDate("");
      setImage(null);
      setErrors({});

      // Navigate
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add book");
    }
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Books</h1>
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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full px-3 py-2 border ${
              errors.title ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className={`w-full px-3 py-2 border ${
              errors.author ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.author && <p className="text-red-500 text-xs mt-1">{errors.author}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 font-bold mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`w-full px-3 py-2 border ${
              errors.description ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            rows="4"
          ></textarea>
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="genre" className="block text-gray-700 font-bold mb-2">
            Genre
          </label>
          <input
            type="text"
            id="genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className={`w-full px-3 py-2 border ${
              errors.genre ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
            value={publicationDate}
            onChange={(e) => setPublicationDate(e.target.value)}
            className={`w-full px-3 py-2 border ${
              errors.publicationDate ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.publicationDate && (
            <p className="text-red-500 text-xs mt-1">{errors.publicationDate}</p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="image" className="block text-gray-700 font-bold mb-2">
            Book Cover Image
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className={`w-full px-3 py-2 border ${
              errors.image ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Add Book
        </button>
      </form>
    </div>
  );
};

export default ManageBooks;
