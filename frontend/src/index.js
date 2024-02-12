import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import { FavoritesProvider } from './context/FavoritesContext';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for react-toastify globally

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <FavoritesProvider>
        <App />
      </FavoritesProvider>
      <ToastContainer /> {/* Add ToastContainer at the top level */}
    </AuthProvider>
  </React.StrictMode>
);
