import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();

// Below code with Mock API

/*
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { worker } from './mocks/browser.ts';

async function startMockServiceWorker() {
  // Only start MSW if we're in development AND REACT_APP_ENABLE_MOCKS is true
  if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_ENABLE_MOCKS === 'true') {
    const { worker } = await import('./mocks/browser.ts');
    return worker.start({
      onUnhandledRequest: 'bypass',
    });
  }
  return Promise.resolve();
}

startMockServiceWorker()
  .then(() => {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    );

    reportWebVitals();
  })
  .catch(console.error);

// At the end of the file
if (process.env.NODE_ENV === 'development') {
  worker
    .start({
      onUnhandledRequest: 'bypass',
    })
    .catch(console.error);
}

*/