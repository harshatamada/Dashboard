import React, { useState } from 'react';
import { useEffect } from 'react';
import FileUpload from './components/FileUpload';
import StudentTable from './components/StudentTable';
import AdvancedFilter from './components/AdvancedFilter';
import './Dashboard.css';
import FilteredDataExporter from './components/FilteredDataExporter';


function App() {
  const [excelData, setExcelData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('summary');
  const [exportTitle, setExportTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAllData = () => {
    fetch('http://localhost:5000/all-data')
      .then(res => res.json())
      .then(data => setExcelData(data))
      .catch(err => console.error("Failed to load:", err));
  };

  // ✅ 2. Call fetchAllData on initial load
  useEffect(() => {
    fetchAllData();
  }, []);


  const handleDataExtracted = () => {
    fetch("http://localhost:5000/all-data")
      .then((res) => res.json())
      .then((data) => {
        setExcelData(data);
        setFilteredData([]);
      })
      .catch((err) => console.error("Error fetching data after upload:", err));
  };

  const handleSearch = (e) => {
    if ((e.key === 'Enter' || e.type === 'click') && e.target?.value) {
      const term = e.target.value.toLowerCase().trim();
      if (!term || !excelData.length) return;
  
      setSearchTerm(term);
  
      const filtered = excelData.filter((row) => {
        const reg = String(row['Regd No'] || row['Student ID'] || row['RegistrationNumber'] || row['Reg No'] || '').toLowerCase();
        const name = String(row['Name'] || row['Student Name'] || row['Full Name'] || '').toLowerCase();
        return reg.includes(term) || name.includes(term);
      });
  
      setFilteredData(filtered);
  
      // ✅ Capitalize first letter of search term for filename
      const formatted = term.charAt(0).toUpperCase() + term.slice(1);
      setExportTitle(`Search_${formatted}`);
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
        setExportTitle('Male_Students');
        filtered = excelData.filter((row) => getGender(row).startsWith('m'));
        break;
      case 'female':
        setExportTitle('Female_Students');
        filtered = excelData.filter((row) => getGender(row).startsWith('f'));
        break;
      case 'distinction':
        setExportTitle('Distinction_Students');
        filtered = excelData.filter((row) => getDiv(row).includes('distinction'));
        break;
      case 'first':
        setExportTitle('First_Class_Students');
        filtered = excelData.filter((row) =>
          getDiv(row).includes('first') && !getDiv(row).includes('distinction')
        );
        break;
      case 'second':
        setExportTitle('Second_Class_Students');
        filtered = excelData.filter((row) => getDiv(row).includes('second'));
        break;
      case 'third':
        setExportTitle('Third_Class_Students');
        filtered = excelData.filter((row) => getDiv(row).includes('third'));
        break;
      case 'distWithFirst':
        setExportTitle('Distinction_and_First_Class_Students');
        filtered = excelData.filter((row) =>
          getDiv(row).includes('distinction') && getDiv(row).includes('first')
        );
        break;
      case 'year1':
        setExportTitle('1st_Year_Passed_Students');
        filtered = excelData.filter((row) => getYear(row) === '1' && getPassed(row) === 'yes');
        break;
      case 'year2':
        setExportTitle('2nd_Year_Passed_Students');
        filtered = excelData.filter((row) => getYear(row) === '2' && getPassed(row) === 'yes');
        break;
      case 'year3':
        setExportTitle('3rd_Year_Passed_Students');
        filtered = excelData.filter((row) => getYear(row) === '3' && getPassed(row) === 'yes');
        break;
      case 'year4':
        setExportTitle('4th_Year_Passed_Students');
        filtered = excelData.filter((row) => getYear(row) === '4' && getPassed(row) === 'yes');
        break;
      default:
        setExportTitle('Filtered_Students');
        filtered = [];
    }
    

    setFilteredData(filtered);
  };

  const getCounts = () => {
    let c = {
      male: 0, female: 0, distinction: 0, first: 0,
      second: 0, third: 0, distWithFirst: 0,
      year1: 0, year2: 0, year3: 0, year4: 0,
    };

    excelData.forEach((row) => {
      const gender = (row['Gender'] || row['gender'] || row['SEX'] || row['Sex'] || '').toLowerCase();
      const div = (row['Division'] || row['DIVISION'] || '').toLowerCase();
      const year = String(row['Year'] || row['YEAR'] || '');
      const passed = (row['Passed'] || row['passed'] || '').toLowerCase().trim();

      if (gender.startsWith('m')) c.male++;
      if (gender.startsWith('f')) c.female++;
      if (div.includes('distinction')) c.distinction++;
      if (div.includes('first') && !div.includes('distinction')) c.first++;
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
      onClick={() => {
        if (key) filterStudents(key);
      }}
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

      <div className="dashboard-layout">
        <div className="left-panel">
          <FileUpload onUploadSuccess={fetchAllData} />
          <AdvancedFilter 
  excelData={excelData}
  setFilteredData={setFilteredData}
  setExportTitle={setExportTitle}
/>

</div>
        <div className="right-panel">
  <div className="right-content">
    {/* ✅ Search bar */}
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search by Regd No or Name"
        onKeyDown={handleSearch}
        className="search-input"
      />
    </div>

    {/* ✅ Stats selector */}
    <div className="selector">
      <label>View Stats For: </label>
      <select value={selectedFilter} onChange={(e) => setSelectedFilter(e.target.value)}>
        <option value="summary">Summary</option>
        <option value="division">Division Summary</option>
        <option value="year">Year-wise Summary</option>
      </select>
    </div>

    {/* ✅ Stats cards */}
    <div className="dashboard">
      {selectedFilter === 'summary' && (
        <>
          <div className="dashboard-row">
            {renderCard("Male Students", "male", counts.male, "male")}
            {renderCard("Female Students", "female", counts.female, "female")}
          </div>
        </>
      )}

      {selectedFilter === 'division' && (
        <>
          {renderCard("Distinction", "distinction", counts.distinction, "dist")}
          {renderCard("First", "first", counts.first, "first")}
          {renderCard("Second", "second", counts.second, "second")}
          {renderCard("Third", "third", counts.third, "third")}
          {renderCard("Distinction + 1st Class", "distWithFirst", counts.distWithFirst, "highlight")}
        </>
      )}

      {selectedFilter === 'year' && (
        <>
          {renderCard("1st Year - Passed Students", "year1", counts.year1, "year")}
          {renderCard("2nd Year - Passed Students", "year2", counts.year2, "year")}
          {renderCard("3rd Year - Passed Students", "year3", counts.year3, "year")}
          {renderCard("4th Year - Passed Students", "year4", counts.year4, "year")}
        </>
      )}
    </div>
    {filteredData.length > 0 && (
  <>
   <FilteredDataExporter
  data={filteredData}
  filename={`${exportTitle || 'Filtered_Students'}.csv`}
/>


  </>
    )}
  </div>
</div>
</div>
</div>
  );
}

export default App;
