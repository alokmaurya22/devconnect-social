import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { GuestTimerProvider } from './context/GuestTimerContext';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <ThemeProvider>
                <GuestTimerProvider>
                    <App />
                </GuestTimerProvider>
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>
);