import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import SearchBar from './SearchBar'; // 引入搜索栏

const Header = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <header className="header">
            <div className="header-left">
                <Link to="/" className="logo">体育活动室</Link>
                <nav>
                    {/* 使用 NavLink 可以根据当前路由添加 active 样式 */}
                    <NavLink to="/activities" className={({isActive}) => isActive ? 'active' : ''}>所有活动</NavLink>
                </nav>
            </div>
            
            <div className="header-center">
                 <SearchBar />
            </div>

            <div className="header-right">
                {user ? (
                    <>
                        <NavLink to="/profile" className={({isActive}) => isActive ? 'active' : ''}>个人中心</NavLink>
                        {user.role === 'admin' && <NavLink to="/admin" className={({isActive}) => isActive ? 'active' : ''}>管理面板</NavLink>}
                        {/* 退出是一个按钮，调用 logout 函数，而不是一个链接 */}
                        <button onClick={logout} className="header-logout-btn">退出</button>
                    </>
                ) : (
                    <>
                        <NavLink to="/login" className={({isActive}) => isActive ? 'active' : ''}>登录</NavLink>
                        <NavLink to="/register" className={({isActive}) => isActive ? 'active' : ''}>注册</NavLink>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;