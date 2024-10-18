import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

async function startMockServiceWorker() {
  if (process.env.NODE_ENV === 'development') {
    const { worker } = await import('./mocks/browser.ts');
    return worker.start({
      onUnhandledRequest: 'bypass',
    });
  }
  return Promise.resolve();
}

startMockServiceWorker().then(() => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );

  reportWebVitals();
}).catch(console.error);