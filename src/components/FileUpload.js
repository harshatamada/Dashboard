import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import './FileUpload.css';

const FileUpload = ({ onDataExtracted }) => {
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setError('Please select a file.');
      return;
    }

    const isExcel =
      file.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel';

    if (!isExcel) {
      setError('Invalid file type. Please upload an Excel file (.xlsx or .xls).');
      return;
    }

    setError('');
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      onDataExtracted(jsonData);
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="file-upload">
      <label className="upload-label">Upload Excel File:</label>

      <input
        type="file"
        accept=".xlsx, .xls"
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
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default FileUpload;
