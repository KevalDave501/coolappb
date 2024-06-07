import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import styled from 'styled-components';

const LogContainer = styled.div`
  max-width: 600px;
  height: 300px;
  overflow-y: scroll;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
`;

const Log = styled.div`
  padding: 10px;
  margin: 5px 0;
  border-radius: 3px;
  color: white;
  &.insert { background-color: #28a745; }
  &.skip { background-color: #ffc107; }
  &.fail { background-color: #dc3545; }
  &.error { background-color: #6c757d; }
`;

const Button = styled.button`
  padding: 10px 20px;
  margin: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

function VendorImport() {
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState('');
  const [logs, setLogs] = useState([]);
  const [showDetails, setShowDetails] = useState(false);

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

    const socket = io('http://localhost:8000');

    socket.on('log', (log) => {
      setLogs((prevLogs) => [...prevLogs, log]);
    });

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleChange = (event) => {
    setSelectedVendor(event.target.value);
  };

  const handleImport = async () => {
    if (selectedVendor) {
      try {
        await axios.post('http://localhost:8000/api/vendors/import', { vendorName: selectedVendor });
        alert('CSV data imported successfully');
      } catch (error) {
        console.error('Error importing CSV:', error);
        alert('Error importing CSV data');
      }
    } else {
      alert('Please select a vendor');
    }
  };

  const handleShowDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div>
      <h1>Vendor Import</h1>
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
      <Button onClick={handleImport} disabled={!selectedVendor}>
        Import CSV
      </Button>
      {selectedVendor && (
        <div>
          <h2>Selected Vendor: {selectedVendor}</h2>
        </div>
      )}
      <Button onClick={handleShowDetails}>
        {showDetails ? 'Hide' : 'Show'} Ongoing Process Log
      </Button>
      <LogContainer>
        <h2>Logs</h2>
        {logs.map((log, index) => (
          <Log key={index} className={log.status}>
            {log.message}
            {showDetails && log.status === 'insert' && (
              <div>
                <p>Product Name: {log.productName}</p>
                <p>Product Price: {log.productPrice}</p>
                <p>Product Quantity: {log.productQuantity}</p>
              </div>
            )}
          </Log>
        ))}
      </LogContainer>
    </div>
  );
}

export default VendorImport;
