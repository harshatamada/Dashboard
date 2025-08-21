// utils/sortUtils.js

/**
 * Convert Excel serial date OR string date into a JavaScript Date
 */
function parseMonthYear(value) {
    if (!value) return null;
  
    // ✅ If value is numeric (Excel serial number like 44409, 44696, etc.)
    if (!isNaN(value)) {
      const excelEpoch = new Date(1899, 11, 30); // Excel starts from 1900-01-01
      return new Date(excelEpoch.getTime() + value * 86400000);
    }
  
    // ✅ If value is a string (like "2024-05" or "May 2024")
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? null : parsed;
  }
  
  /**
   * Sort students by joining Year (descending = latest year first).
   * If two students have same year, month decides order.
   */
  export function sortStudentsByJoiningYear(data) {
    return [...data].sort((a, b) => {
      const dateA = parseMonthYear(a['Month-Year']);
      const dateB = parseMonthYear(b['Month-Year']);
  
      if (!dateA && !dateB) return 0;   // both missing
      if (!dateA) return 1;             // push nulls to end
      if (!dateB) return -1;
  
      return dateB - dateA;             // latest first
    });
  }
  