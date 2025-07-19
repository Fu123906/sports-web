import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useContext(AuthContext); // 现在可以正确获取 register 函数了

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('两次输入的密码不一致！');
            return;
        }
        setLoading(true);
        await register(email, password);
        setLoading(false);
    };

    return (
        <div className="form-page-container">
            <div className="form-container">
                <h2>创建您的账户</h2>
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
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">密码 (至少6位)</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength="6"
                            className="form-input"
                        />
                    </div>
                     <div className="form-group">
                        <label htmlFor="confirmPassword">确认密码</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="form-input"
                        />
                    </div>
                    <button type="submit" className="form-button" disabled={loading}>
                        {loading ? '注册中...' : '注册'}
                    </button>
                </form>
                <p className="form-switch">
                    已有账户？ <Link to="/login">直接登录</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;