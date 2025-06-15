// src/pages/SingleDocument.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const SingleDocument = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const res = await api.get(`/documents/${id}`);
        setDoc(res.data);
      } catch (err) {
        setError("Failed to load document.");
      } finally {
        setLoading(false);
      }
    };
    fetchDoc();
  }, [id]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-50">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">{doc.name}</h1>
        <p className="text-gray-600 mb-2"><strong>Type:</strong> {doc.type}</p>
        <p className="text-gray-600 mb-2"><strong>Description:</strong> {doc.description}</p>
        {doc.expiryDate && (
          <p className="text-red-500 mb-2">
            <strong>Expiry:</strong> {new Date(doc.expiryDate).toLocaleDateString()}
          </p>
        )}
        {doc.fileUrl && (
          <img src={doc.fileUrl} alt={doc.name} className="w-full h-64 object-contain mb-4 border rounded" />
        )}
        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          ⬅ Back
        </button>
      </div>
    </div>
  );
};

export default SingleDocument;
