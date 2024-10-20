import React, { useState } from 'react';

function TestMockAPI() {
  const [result, setResult] = useState('');

  const testLogin = async () => {
    try {
      const response = await fetch('/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'john@example.com',
          password: 'password'
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        const authToken = response.headers.get('Authorization');
        setResult(`Login successful. Token: ${authToken}`);
      } else {
        setResult(`Login failed: ${data.message}`);
      }
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <button onClick={testLogin}>Test Login</button>
      <p>{result}</p>
    </div>
  );
}

export default TestMockAPI;