import { useState } from "react";
import PropTypes from 'prop-types';

const ReturnBook = ({ bookId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleReturn = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`/api/v1/books/${bookId}/return`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to return book");
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Return this Book</h2>
      {success ? (
        <p className="text-green-500">Book returned successfully!</p>
      ) : (
        <div>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <button
            onClick={handleReturn}
            disabled={loading}
            className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300 disabled:opacity-50"
          >
            {loading ? "Returning..." : "Return Book"}
          </button>
        </div>
      )}
    </div>
  );
};

ReturnBook.propTypes = {
  bookId: PropTypes.string.isRequired,
};

export default ReturnBook;
