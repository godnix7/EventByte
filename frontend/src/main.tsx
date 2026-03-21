import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { appConfig } from './config/app.config';
import App from './App';
import './styles/globals.css';

const renderApp = () => (
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    appConfig.googleAuthEnabled && appConfig.googleClientId ? (
        <GoogleOAuthProvider clientId={appConfig.googleClientId}>
            {renderApp()}
        </GoogleOAuthProvider>
    ) : (
        renderApp()
    )
);
