import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// Global handlers to surface runtime errors in console (helps when page appears em branco)
window.addEventListener('error', (ev) => {
  // eslint-disable-next-line no-console
  console.error('[window.error] ', ev.error ?? ev.message, ev);
});
window.addEventListener('unhandledrejection', (ev) => {
  // eslint-disable-next-line no-console
  console.error('[unhandledrejection] ', ev.reason);
});

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);