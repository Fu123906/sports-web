import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

// 正确的包裹顺序：
// 1. BrowserRouter 在最外层，提供路由上下文
// 2. AuthProvider 在第二层，提供用户认证上下文
// 3. App 在最内层，使用以上两个上下文
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);