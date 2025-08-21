import React, { useState } from 'react';
import './FileUpload.css';

const FileUpload = ({ onUploadSuccess }) => {
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const [message, setMessage] = useState('');

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setError('Please select a file.');
      return;
    }

    // ✅ Check valid types
    const isAcceptedType =
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel' ||
      file.type === 'text/csv';

    if (!isAcceptedType) {
      setError('Invalid file type. Please upload .xlsx, .xls, or .csv');
      return;
    }

    setError('');
    setFileName(file.name);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData,
      });
      

      if (!res.ok) throw new Error('Upload failed');
      const result = await res.json();

      setMessage(result.message || 'File uploaded successfully ✅');

      if (onUploadSuccess) {
        onUploadSuccess(); // 🔄 refresh data in parent (App.js)
      }
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Upload failed. Please try again.');
    }
  };

  return (
    <div className="file-upload">
      <label className="upload-label">Upload Excel/CSV File:</label>

      <input
        type="file"
        accept=".xlsx, .xls, .csv"
        onChange={handleFileUpload}
        id="fileInput"
        hidden
      />

      <button
        className="upload-button"
        onClick={() => document.getElementById('fileInput').click()}
      >
        Choose File
      </button>

      {fileName && <p className="file-name">Selected: {fileName}</p>}
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default FileUpload;
