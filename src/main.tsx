import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const isElectron = import.meta.env.VITE_APP_ENV === 'electron';

const App = lazy(() => isElectron ? import('./App') : import('./AppHTTP'));

root.render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <App />
    </Suspense>
  </React.StrictMode>
);