import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FileUpload from './components/FileUpload';
import StudentTable from './components/StudentTable';
import AdvancedFilter from './components/AdvancedFilter';
import './Dashboard.css';

function App() {
  const [excelData, setExcelData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('summary');
  const [filteredData, setFilteredData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [studentData, setStudentData] = useState([]);


  

  const handleDataExtracted = (data) => {
    setExcelData(data);
    setFilteredData([]);
  };
  
  

  const handleSearch = (e) => {
    if ((e.key === 'Enter' || e.type === 'click') && e.target?.value) {
      const searchTerm = e.target.value.toLowerCase().trim();
      if (!searchTerm || !excelData.length) return;

      const filtered = excelData.filter((row) => {
        const reg = String(row['Regd No'] || row['Student ID'] || row['RegistrationNumber'] || row['Reg No'] || '').toLowerCase();
        const name = String(row['Name'] || row['Student Name'] || row['Full Name'] || '').toLowerCase();
        return reg.includes(searchTerm) || name.includes(searchTerm);
      });

      setFilteredData(filtered);
      setSelectedYear(null);
      setSelectedBranch(null);
    }
  };

  const filterStudents = (key) => {
    if (!excelData.length) return;

    const getDiv = (row) => (row['Division'] || row['DIVISION'] || '').toLowerCase();
    const getGender = (row) => (row['Gender'] || row['gender'] || row['SEX'] || row['Sex'] || '').toLowerCase();
    const getYear = (row) => String(row['Year'] || row['YEAR'] || '');
    const getPassed = (row) => (row['Passed'] || row['passed'] || '').toLowerCase().trim();

    let filtered = [];

    switch (key) {
      case 'male':
        filtered = excelData.filter((row) => getGender(row).startsWith('m'));
        break;
      case 'female':
        filtered = excelData.filter((row) => getGender(row).startsWith('f'));
        break;
      case 'distinction':
        filtered = excelData.filter((row) => getDiv(row).includes('distinction'));
        break;
      case 'first':
        filtered = excelData.filter((row) => getDiv(row).includes('first'));
        break;
      case 'second':
        filtered = excelData.filter((row) => getDiv(row).includes('second'));
        break;
      case 'third':
        filtered = excelData.filter((row) => getDiv(row).includes('third'));
        break;
      case 'distWithFirst':
        filtered = excelData.filter((row) =>
          getDiv(row).includes('distinction') && getDiv(row).includes('first')
        );
        break;
      case 'year1':
        filtered = excelData.filter(
          (row) => getYear(row) === '1' && getPassed(row) === 'yes'
        );
        break;
      case 'year2':
        filtered = excelData.filter(
          (row) => getYear(row) === '2' && getPassed(row) === 'yes'
        );
        break;
      case 'year3':
        filtered = excelData.filter(
          (row) => getYear(row) === '3' && getPassed(row) === 'yes'
        );
        break;
      case 'year4':
        filtered = excelData.filter(
          (row) => getYear(row) === '4' && getPassed(row) === 'yes'
        );
        break;
      default:
        filtered = [];
    }

    setFilteredData(filtered);
  };

  const getCounts = () => {
    let c = {
      male: 0,
      female: 0,
      distinction: 0,
      first: 0,
      second: 0,
      third: 0,
      distWithFirst: 0,
      year1: 0,
      year2: 0,
      year3: 0,
      year4: 0,
    };

    excelData.forEach((row) => {
      const gender = (row['Gender'] || row['gender'] || row['SEX'] || row['Sex'] || '').toLowerCase();
      const div = (row['Division'] || row['DIVISION'] || '').toLowerCase();
      const year = String(row['Year'] || row['YEAR'] || '');
      const passed = (row['Passed'] || row['passed'] || '').toLowerCase().trim();

      if (gender.startsWith('m')) c.male++;
      if (gender.startsWith('f')) c.female++;
      if (div.includes('distinction')) c.distinction++;
      if (div.includes('first')) c.first++;
      if (div.includes('second')) c.second++;
      if (div.includes('third')) c.third++;
      if (div.includes('distinction') && div.includes('first')) c.distWithFirst++;

      if (year === '1' && passed === 'yes') c.year1++;
      if (year === '2' && passed === 'yes') c.year2++;
      if (year === '3' && passed === 'yes') c.year3++;
      if (year === '4' && passed === 'yes') c.year4++;
    });

    return c;
  };

  const counts = getCounts();

  const renderCard = (title, key, value, color) => (
    <div
      className={`card ${color}`}
      onClick={() => key && filterStudents(key)}
      style={{ cursor: key ? 'pointer' : 'default' }}
      key={title}
    >
      <h3>{title}</h3>
      <div className="value">{value}</div>
    </div>
  );

  return (
    <div className="main-container">
      <h1 className="title">Student Dashboard</h1>
      <FileUpload onDataExtracted={handleDataExtracted} />
      <AdvancedFilter excelData={excelData} />
      {/* 🔍 Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by Regd No or Name"
          onKeyDown={handleSearch}
          className="search-input"
        />
      </div>

      {excelData.length > 0 && (
        <>
          <div className="selector">
            <label>View Stats For: </label>
            <select value={selectedFilter} onChange={(e) => setSelectedFilter(e.target.value)}>
              <option value="summary">Summary</option>
              <option value="division">Division Summary</option>
              <option value="year">Year-wise Summary</option>
            </select>
          </div>

          <div className="dashboard">
            {selectedFilter === 'summary' && (
              <>
                <div className="dashboard-row">
                  <h3>Gender Summary</h3>
                  <div className="dashboard">
                    {renderCard('Male Students', 'male', counts.male, 'male')}
                    {renderCard('Female Students', 'female', counts.female, 'female')}
                  </div>
                </div>
              </>
            )}

            {selectedFilter === 'division' && (
              <>
                {renderCard('Distinction', 'distinction', counts.distinction, 'dist')}
                {renderCard('First Class', 'first', counts.first, 'first')}
                {renderCard('Second Class', 'second', counts.second, 'second')}
                {renderCard('Third Class', 'third', counts.third, 'third')}
                {renderCard('Distinction + 1st Class', 'distWithFirst', counts.distWithFirst, 'highlight')}
              </>
            )}

            {selectedFilter === 'year' && (
              <>
                {renderCard('1st Year - Passed Students', 'year1', counts.year1, 'year')}
                {renderCard('2nd Year - Passed Students', 'year2', counts.year2, 'year')}
                {renderCard('3rd Year - Passed Students', 'year3', counts.year3, 'year')}
                {renderCard('4th Year - Passed Students', 'year4', counts.year4, 'year')}
              </>
            )}
          </div>

          {filteredData.length > 0 && (
            <>
              <button
                onClick={() => {
                  setFilteredData([]);
                  setSelectedYear(null);
                  setSelectedBranch(null);
                }}
                className="clear-btn"
              >
                Clear Filter
              </button>
              <h3>Search Result</h3>
              <StudentTable data={filteredData} />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
