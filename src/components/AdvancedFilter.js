import React, { useState, useEffect } from 'react';
import StudentTable from './StudentTable'; // Reuse existing StudentTable component
import './AdvancedFilter.css'; // Optional CSS for styling

const AdvancedFilter = ({ excelData }) => {
  const [filteredData, setFilteredData] = useState([]);

  // Filters state
  const [filters, setFilters] = useState({
    year: '',
    branch: '',
    caste: '',
    gender: '',
    cgpaCondition: '>',
    cgpaValue: '',
  });

  // Dropdown options extracted from excelData
  const [uniqueYears, setUniqueYears] = useState([]);
  const [uniqueBranches, setUniqueBranches] = useState([]);
  const [uniqueCastes, setUniqueCastes] = useState([]);

  useEffect(() => {
    if (!excelData.length) return;

    // Extract unique Years, Branches, Castes for dropdown options
    const yearsSet = new Set();
    const branchesSet = new Set();
    const castesSet = new Set();

    excelData.forEach((row) => {
      let yearVal = String(row['Year'] || row['YEAR'] || '').trim();
      if (yearVal) yearsSet.add(yearVal);

      let branchVal = (row['Branch'] || row['Department'] || row['BRANCH'] || row['DEPT'] || '').trim().toUpperCase();
      if (branchVal) branchesSet.add(branchVal);

      let casteVal = (row['Caste'] || row['caste'] || '').trim();
      if (casteVal) castesSet.add(casteVal);
    });

    setUniqueYears(Array.from(yearsSet).sort());
    setUniqueBranches(Array.from(branchesSet).sort());
    setUniqueCastes(Array.from(castesSet).sort());
  }, [excelData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    if (!excelData.length) return;

    const {
      year,
      branch,
      caste,
      gender,
      cgpaCondition,
      cgpaValue,
    } = filters;

    const filtered = excelData.filter((row) => {
      const rowYear = String(row['Year'] || row['YEAR'] || '').trim();
      const rowBranch = (row['Branch'] || row['Department'] || row['BRANCH'] || row['DEPT'] || '').trim().toUpperCase();
      const rowCaste = (row['Caste'] || row['caste'] || '').trim().toLowerCase();
      const rowGender = (row['Gender'] || row['gender'] || row['SEX'] || row['Sex'] || '').toLowerCase();
      const cgpaRaw = row['CGPA'] || row['cgpa'] || row['Grade Point Average'] || '';
      const rowCGPA = parseFloat(cgpaRaw);

      if (year && rowYear !== year) return false;
      if (branch && rowBranch !== branch) return false;
      if (caste && rowCaste !== caste.toLowerCase()) return false;
      if (gender && !rowGender.startsWith(gender.charAt(0).toLowerCase())) return false;

      if (cgpaValue !== '') {
        if (isNaN(rowCGPA)) return false;
        const targetCGPA = parseFloat(cgpaValue);
        if (cgpaCondition === '>' && !(rowCGPA > targetCGPA)) return false;
        if (cgpaCondition === '<' && !(rowCGPA < targetCGPA)) return false;
      }

      return true;
    });

    setFilteredData(filtered);
  };

  const clearFilters = () => {
    setFilters({
      year: '',
      branch: '',
      caste: '',
      gender: '',
      cgpaCondition: '>',
      cgpaValue: '',
    });
    setFilteredData([]);
  };

  return (
    <div className="advanced-filter-container">
      <h2>Advanced Multi-Filter</h2>

      <div className="filters-row">
        {/* Year */}
        <div className="filter-group">
          <label htmlFor="year-select">Year:</label>
          <select
            id="year-select"
            name="year"
            value={filters.year}
            onChange={handleInputChange}
          >
            <option value="">-- All --</option>
            {uniqueYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Branch */}
        <div className="filter-group">
          <label htmlFor="branch-select">Branch:</label>
          <select
            id="branch-select"
            name="branch"
            value={filters.branch}
            onChange={handleInputChange}
          >
            <option value="">-- All --</option>
            {uniqueBranches.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* CGPA with condition */}
        <div className="filter-group cgpa-filter">
          <label htmlFor="cgpa-condition-select">CGPA:</label>
          <select
            id="cgpa-condition-select"
            name="cgpaCondition"
            value={filters.cgpaCondition}
            onChange={handleInputChange}
          >
            <option value=">">{'>'}</option>
            <option value="<">{'<'}</option>
          </select>
          <input
            type="number"
            step="0.01"
            min="0"
            max="10"
            name="cgpaValue"
            value={filters.cgpaValue}
            onChange={handleInputChange}
            placeholder="Enter CGPA"
          />
        </div>

        {/* Caste */}
        <div className="filter-group">
          <label htmlFor="caste-select">Caste:</label>
          <select
            id="caste-select"
            name="caste"
            value={filters.caste}
            onChange={handleInputChange}
          >
            <option value="">-- All --</option>
            {uniqueCastes.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Gender */}
        <div className="filter-group">
          <label htmlFor="gender-select">Gender:</label>
          <select
            id="gender-select"
            name="gender"
            value={filters.gender}
            onChange={handleInputChange}
          >
            <option value="">-- All --</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="filter-group buttons-group">
          <button onClick={applyFilters} className="apply-filters-btn">
            Apply Filters
          </button>
          <button onClick={clearFilters} className="clear-filters-btn">
            Clear Filters
          </button>
        </div>
      </div>

      {filteredData.length > 0 ? (
        <>
          <h3>Filtered Students</h3>
          <StudentTable data={filteredData} />
        </>
      ) : (
        excelData.length > 0 && <p>No students match the current filters.</p>
      )}
    </div>
  );
};

export default AdvancedFilter;
