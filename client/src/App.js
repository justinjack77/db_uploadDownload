import React, { useState, useEffect } from 'react';
import api from './api/api'
import axios from 'axios';

const App = () => {
  const [users, setUsers] = useState({});

  useEffect(() => {
    // Fetch data from the API endpoint
    api.get('/api')
      .then(response => {
        setUsers(response.data.users);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []); // Empty dependency array ensures useEffect runs once after initial render

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {Object.keys(users).map(userKey => (
          <li key={userKey}>
            <strong>Username:</strong> {users[userKey].username}, <strong>Password:</strong> {users[userKey].password}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;