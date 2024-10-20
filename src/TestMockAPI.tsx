import React, { useState } from 'react';

interface LoginResponse {
  message: string;
  token?: string;
  role?: string;
}

function TestMockAPI() {
  const [result, setResult] = useState<string>('');

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

      const data: LoginResponse = await response.json();
      
      if (response.ok) {
        const authToken = response.headers.get('Authorization');
        setResult(`Login successful. Token: ${authToken || 'Not provided'}`);
      } else {
        setResult(`Login failed: ${data.message}`);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setResult(`Error: ${error.message}`);
      } else {
        setResult('An unknown error occurred');
      }
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