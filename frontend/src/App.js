import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [backendStatus, setBackendStatus] = useState('Checking...');
  const [backendMessage, setBackendMessage] = useState('');

  useEffect(() => {
    // Test connection to backend
    const testConnection = async () => {
      try {
        const response = await axios.get('http://localhost:5000');
        setBackendStatus('✅ Connected');
        setBackendMessage(response.data.message);
      } catch (error) {
        setBackendStatus('❌ Not Connected');
        setBackendMessage('Make sure backend is running on port 5000');
      }
    };

    testConnection();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>🏫 School Management System</h1>
        <p>Government School Management Portal</p>
        <div className="info-box">
          <h3>Welcome!</h3>
          <p>Frontend is running on: http://localhost:3000</p>
          <p>Backend API: http://localhost:5000</p>
          <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}>
            <p><strong>Backend Status:</strong> {backendStatus}</p>
            {backendMessage && <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>{backendMessage}</p>}
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;