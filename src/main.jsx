import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import '/style.css'; // Use absolute path for Vite
import './candy.css'; // Custom candy styling
import './candy-theme.css'; // Candy Crush theme overrides

createRoot(document.getElementById('root')).render(<App />);
