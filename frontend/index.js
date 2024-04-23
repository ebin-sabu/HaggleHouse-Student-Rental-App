import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Auth0Provider } from '@auth0/auth0-react'
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Auth0Provider
      domain="hagglehouse.uk.auth0.com"
      clientId="4VNQQjGQoYkT06f0y4KWbeklPgo9faHd"
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
      audience="https://hagglehouse.fly.dev"
      scope=" openid profile email"
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>

)