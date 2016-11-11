// file paths
import jsonData from '../assets/data.json';
import csvData from '../assets/data.csv';

// testing read file of JSON and CSV
// Also tests webpack's CSV to JSON conversion
export default (type) => {
  if (type === 'JSON') {
    return jsonData;
  }

  return csvData;
};
