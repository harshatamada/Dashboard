import React, { useState, useEffect } from 'react';
import './AdvancedFilter.css';

const AdvancedFilter = ({ excelData, setFilteredData, setExportTitle }) => {

  const [filters, setFilters] = useState({
    year: '', branch: '', caste: '', gender: '', cgpaValue: ''
  });
  const [uniqueYears, setUniqueYears] = useState([]);
  const [uniqueBranches, setUniqueBranches] = useState([]);
  const [uniqueCastes, setUniqueCastes] = useState([]);

  useEffect(() => {
    if (!excelData.length) return;
    const yearsSet = new Set();
    const branchesSet = new Set();
    const castesSet = new Set();
    excelData.forEach((row) => {
      const yearVal = String(row['Year'] || row['YEAR'] || '').trim();
      const branchVal = (row['Branch'] || row['Department'] || row['BRANCH'] || row['DEPT'] || '').trim().toUpperCase();
      const casteVal = (row['Caste'] || row['caste'] || '').trim();
      if (yearVal) yearsSet.add(yearVal);
      if (branchVal) branchesSet.add(branchVal);
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
    const { year, branch, caste, gender, cgpaValue } = filters;
    const filtered = excelData.filter((row) => {
      const rowYear = String(row['Year'] || row['YEAR'] || '').trim();
      const rowBranch = (row['Branch'] || row['Department'] || row['BRANCH'] || row['DEPT'] || '').trim().toUpperCase();
      const rowCaste = (row['Caste'] || row['caste'] || '').trim().toLowerCase();
      const rowGender = (row['Gender'] || row['gender'] || row['SEX'] || row['Sex'] || '').toLowerCase();
      const rowCGPA = parseFloat(row['CGPA'] || row['cgpa'] || row['Grade Point Average'] || '');
      if (year && rowYear !== year) return false;
      if (branch && rowBranch !== branch) return false;
      if (caste && rowCaste !== caste.toLowerCase()) return false;
      if (gender && !rowGender.startsWith(gender.charAt(0).toLowerCase())) return false;
      if (cgpaValue !== '') {
        const targetCGPA = parseFloat(cgpaValue);
        if (isNaN(rowCGPA) || rowCGPA !== targetCGPA) return false;
      }
      return true;
    });
    setFilteredData(filtered);
    // Generate dynamic filename based on filters
let nameParts = [];

if (year) nameParts.push(`${year}Year`);
if (branch) nameParts.push(branch);
if (caste) nameParts.push(caste);
if (gender) nameParts.push(gender.charAt(0).toUpperCase() + gender.slice(1));
if (cgpaValue !== '') nameParts.push(`CGPA_${cgpaValue}`);

const title = nameParts.length > 0 ? nameParts.join('_') + '_Students' : 'Filtered_Students';

setExportTitle(title);

  };

  const clearFilters = () => {
    setFilters({ year: '', branch: '', caste: '', gender: '', cgpaValue: '' });
    setFilteredData([]);
  };

  return (
    <div className="advanced-filter-container">
      <h3>Advanced Multi-Filter</h3>
      <div className="filters-row">
        <div className="filter-group">
          <label>Year:</label>
          <select name="year" value={filters.year} onChange={handleInputChange}>
            <option value="">-- All --</option>
            {uniqueYears.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Branch:</label>
          <select name="branch" value={filters.branch} onChange={handleInputChange}>
            <option value="">-- All --</option>
            {uniqueBranches.map((branch) => (
              <option key={branch} value={branch}>{branch}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Caste:</label>
          <select name="caste" value={filters.caste} onChange={handleInputChange}>
            <option value="">-- All --</option>
            {uniqueCastes.map((caste) => (
              <option key={caste} value={caste}>{caste}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Gender:</label>
          <select name="gender" value={filters.gender} onChange={handleInputChange}>
            <option value="">-- All --</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className="cgpa-filter">
          <label>CGPA (equals):</label>
          <input
            type="number"
            name="cgpaValue"
            value={filters.cgpaValue}
            min="0"
            max="10"
            step="0.01"
            onChange={handleInputChange}
            placeholder="e.g. 8.75"
          />
        </div>
        <div className="buttons-group">
          <button className="apply-filters-btn" type="button" onClick={applyFilters}>Apply Filters</button>
          <button className="clear-filters-btn" type="button" onClick={clearFilters}>Clear Filters</button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilter;
