import '@/styles/index.scss';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './layouts/App';
import { worker } from './mocks/browser';

if (process.env.NODE_ENV === 'development') {
    worker.start({ onUnhandledRequest: 'bypass' });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
