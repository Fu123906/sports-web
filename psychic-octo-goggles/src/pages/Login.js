import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await login(email, password);
        setLoading(false);
    };

    return (
        <div className="form-page-container">
            <div className="form-container">
                <h2>用户登录</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">邮箱</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="form-input"
                            autoComplete="email"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">密码</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="form-input"
                            autoComplete="current-password"
                        />
                    </div>
                    <button type="submit" className="form-button" disabled={loading}>
                        {loading ? '登录中...' : '登录'}
                    </button>
                </form>
                <p className="form-switch">
                    还没有账户？ <Link to="/register">立即注册</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;