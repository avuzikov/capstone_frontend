import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './layouts/App.tsx';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { worker } from './services/mocks/browser.ts';

async function startMockServiceWorker() {
  if (process.env.NODE_ENV === 'development') {
    const { worker } = await import('./services/mocks/browser.ts');
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
