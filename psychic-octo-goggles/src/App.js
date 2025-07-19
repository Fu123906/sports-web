import React from 'react';
// 注意：这里不再需要导入 BrowserRouter
import { Routes, Route } from 'react-router-dom';
import Footer from './components/Footer'; // 导入 Footer
// 导入所有组件和页面...
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import ActivityList from './pages/ActivityList';
import ActivityDetail from './pages/ActivityDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

import './assets/App.css'; 

function App() {
  return (
    // 这里不再有 <BrowserRouter>
    <>
      <Header />
      <main>
        <Routes>
          {/* 所有路由规则保持不变 */}
          <Route path="/" element={<Home />} />
          <Route path="/activities" element={<ActivityList />} />
          <Route path="/activity/:id" element={<ActivityDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          <Route path="*" element={<div className="page-container"><h2>404: 页面未找到</h2></div>} /> 
        </Routes>
      </main>
      <Footer />
    </>
    // 这里不再有 </BrowserRouter>
  );
}

export default App;