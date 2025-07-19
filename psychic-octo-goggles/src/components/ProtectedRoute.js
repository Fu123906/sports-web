import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = ({ adminOnly = false }) => {
    const { user } = useContext(AuthContext);

    if (!user) {
        // 如果用户未登录，重定向到登录页面
        // 传递当前位置，以便登录后可以返回
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && user.role !== 'admin') {
        // 如果是管理员专属页面但用户不是管理员，重定向到首页
        alert('无权访问：仅限管理员！');
        return <Navigate to="/" replace />;
    }
    
    // 如果权限验证通过，渲染其子路由
    return <Outlet />;
};

export default ProtectedRoute;