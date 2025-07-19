import React from 'react';
import { Link } from 'react-router-dom';
import './../assets/App.css'; // 确保引入CSS

const Home = () => {
    return (
        <div className="hero-container">
            <div className="hero-content">
                <h1 className="hero-title">发现生活的热情</h1>
                <p className="hero-subtitle">从篮球到瑜伽，加入我们，开启你的运动之旅。</p>
                <Link to="/activities" className="hero-button">
                    探索所有活动
                </Link>
            </div>
        </div>
    );
};

export default Home;