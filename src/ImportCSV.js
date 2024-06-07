import React, { useState } from 'react';
import axios from 'axios';

function ImportCSV() {
  const [vendorName, setVendorName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/vendors/import', { vendorName });
      alert('CSV data imported successfully');
    } catch (error) {
      console.error('Error importing CSV:', error);
      alert('Error importing CSV data');
    }
  };

  return (
    <div>
      <h1>Import CSV</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Vendor Name:
          <input
            type="text"
            value={vendorName}
            onChange={(e) => setVendorName(e.target.value)}
          />
        </label>
        <button type="submit">Import CSV</button>
      </form>
    </div>
  );
}

export default ImportCSV;
