import React from 'react';
import { sortStudentsByJoiningYear } from '../utils/sortUtils';

const FilteredDataExporter = ({ data, filename }) => {
  const handleDownload = () => {
    if (!data || data.length === 0) {
      alert('No data to download');
      return;
    }

    // ✅ Sort the data before exporting
    const sortedData = sortStudentsByJoiningYear(data);

    // Convert data to CSV
    const headers = Object.keys(sortedData[0]);
    const csvRows = [
      headers.join(','), // header row
      ...sortedData.map(row =>
        headers.map(h => `"${(row[h] ?? '').toString().replace(/"/g, '""')}"`).join(',')
      )
    ];
    const csvContent = csvRows.join('\n');

    // Trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = filename || 'students.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button onClick={handleDownload} className="download-btn">
      Download CSV
    </button>
  );
};

export default FilteredDataExporter;
