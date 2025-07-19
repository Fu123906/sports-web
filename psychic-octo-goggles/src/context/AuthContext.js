import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext(null);
const API_URL = 'http://localhost:3001';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.get(`${API_URL}/users?email=${email}&password=${password}`);
            if (response.data.length > 0) {
                const loggedInUser = response.data[0];
                localStorage.setItem('user', JSON.stringify(loggedInUser));
                setUser(loggedInUser);
                navigate(loggedInUser.role === 'admin' ? '/admin' : '/profile');
                return true;
            } else {
                alert('邮箱或密码错误！');
                return false;
            }
        } catch (error) {
            console.error('登录失败:', error);
            alert('登录时发生错误，请稍后再试。');
            return false;
        }
    };

    const register = async (email, password) => {
        try {
            // 1. 检查用户是否已存在
            const existingUsers = await axios.get(`${API_URL}/users?email=${email}`);
            if (existingUsers.data.length > 0) {
                alert('该邮箱已被注册！');
                return false;
            }
            // 2. 创建新用户，默认角色为 'user'
            const newUser = { email, password, role: 'user' };
            await axios.post(`${API_URL}/users`, newUser);
            alert('注册成功，请登录！');
            navigate('/login');
            return true;
        } catch (error) {
            console.error('注册失败:', error);
            alert('注册时发生错误，请稍后再试。');
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        navigate('/');
    };

    // 关键修复：在这里把 register 函数添加到 value 对象中！
    const authValue = { user, login, logout, register };

    return (
        <AuthContext.Provider value={authValue}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;