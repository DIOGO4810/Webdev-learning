import React from 'react';
import ReactDOM from 'react-dom';
import './basic.css';
import App from './App';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Element with id 'root' not found in the DOM.");
}
