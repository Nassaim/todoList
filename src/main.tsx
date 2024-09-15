import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import AppPrac from './AppPrac.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    {/* <AppPrac /> */}
  </StrictMode>
);
