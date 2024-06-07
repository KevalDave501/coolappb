import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState('');

  useEffect(() => {
    async function fetchVendors() {
      try {
        const response = await axios.get('http://localhost:8000/api/vendors');
        setVendors(response.data);
      } catch (error) {
        console.error('Error fetching vendors:', error);
      }
    }

    fetchVendors();
  }, []);

  const handleChange = (event) => {
    setSelectedVendor(event.target.value);
  };

  return (
    <div>
      <h1>Vendors</h1>
      <div className="form-group">
        <label htmlFor="vendorSelect">Select Vendor:</label>
        <select
          className="form-control"
          id="vendorSelect"
          value={selectedVendor}
          onChange={handleChange}
        >
          <option value="">Select a vendor</option>
          {vendors.map((vendor, index) => (
            <option key={index} value={vendor.folderName}>
              {vendor.vendorName}
            </option>
          ))}
        </select>
      </div>
      {selectedVendor && (
        <div>
          <h2>Selected Vendor: {selectedVendor}</h2>
        </div>
      )}
    </div>
  );
}

export default Vendors;
