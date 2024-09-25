import { useState } from "react";
import PropTypes from 'prop-types';
import axios from "axios";
import { toast } from "react-toastify";

const BorrowBook = ({ bookId, onSuccess, onCancel }) => {
  const [returnDate, setReturnDate] = useState("");
  const [loading, setLoading] = useState(false);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const handleBorrow = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${BASE_URL}/books/${bookId}/borrow`, 
        { returnDate },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      toast.success("Book borrowed successfully");
      onSuccess();
    } catch (error) {
      console.error("Error borrowing book:", error);
      toast.error(error.response?.data?.message || "Failed to borrow book");
    } finally {
      setLoading(false);
    }
  };

  const maxReturnDate = new Date();
  maxReturnDate.setDate(maxReturnDate.getDate() + 7);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Borrow this Book</h2>
      <form onSubmit={handleBorrow} className="space-y-4">
        <div>
          <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700">
            Return Date (Max 7 days)
          </label>
          <input
            type="date"
            id="returnDate"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            max={maxReturnDate.toISOString().split('T')[0]}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div className="flex justify-between">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300 disabled:opacity-50"
          >
            {loading ? "Borrowing..." : "Borrow Book"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

BorrowBook.propTypes = {
  bookId: PropTypes.string.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default BorrowBook;
