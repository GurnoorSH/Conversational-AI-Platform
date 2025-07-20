import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// The "!" tells TypeScript that we are sure this element exists.
ReactDOM.createRoot(document.getElementById('custom-chat-widget')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);