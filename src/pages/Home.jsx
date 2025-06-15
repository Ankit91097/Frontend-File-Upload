import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import api from "../services/api";

const Dashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchDocuments = async () => {
    try {
      const res = await api.get("/documents");
      setDocuments(res.data);
    } catch (err) {
      setError("Failed to fetch documents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const confirmDelete = (docId) => {
    setDocumentToDelete(docId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await api.delete(`/documents/${documentToDelete}`);
      setDocuments((prev) =>
        prev.filter((doc) => doc._id !== documentToDelete)
      );
    } catch (err) {
      alert("Failed to delete document.");
    } finally {
      setShowDeleteModal(false);
      setDocumentToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-bold text-gray-800">
            📁 Your Documents
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/create")}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
            >
              Create
            </button>
            <button
              onClick={() => setShowLogoutModal(true)}
              className="bg-gray-600 text-white px-5 py-2 rounded-lg shadow hover:bg-gray-700 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* State Feedback */}
        {loading && <p className="text-center text-gray-500">Loading...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}
        {!loading && !error && documents.length === 0 && (
          <p className="text-center text-gray-600">No documents found.</p>
        )}

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div
              key={doc._id}
              className="bg-white shadow-lg rounded-xl p-4 flex flex-col hover:shadow-xl transition border border-gray-200"
            >
              {doc.fileUrl && (
                <img
                  src={doc.fileUrl}
                  alt={doc.name}
                  className="w-full h-48 object-cover rounded-md mb-3"
                />
              )}
              <h2 className="text-xl font-bold text-gray-800">{doc.name}</h2>
              <p className="text-sm text-gray-500 mb-1">Type: {doc.type}</p>
              <p className="text-sm text-gray-600 mb-2">{doc.description}</p>
              {doc.expiryDate && (
                <p className="text-sm text-red-500 mb-3">
                  Expiry: {new Date(doc.expiryDate).toLocaleDateString()}
                </p>
              )}
              <button
                onClick={() => navigate(`/document/${doc._id}`)}
                className="w-full text-center bg-blue-100 text-blue-700 font-medium py-2 px-4 rounded-md hover:bg-blue-200 transition mb-4"
              >
                View Document
              </button>

              {/* Actions */}
              <div className="flex justify-between gap-2 mt-auto">
                <button
                  onClick={() => navigate(`/update/${doc._id}`)}
                  className="w-1/2 bg-yellow-400 hover:bg-yellow-500 text-white py-2 rounded-md text-sm font-medium"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => confirmDelete(doc._id)}
                  className="w-1/2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-md text-sm font-medium"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Confirm Logout
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to logout?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this document? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
