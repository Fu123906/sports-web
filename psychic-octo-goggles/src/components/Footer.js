import React from 'react';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="footer">
            <p>&copy; {currentYear} 体育活动室 | 由 React 强力驱动</p>
            <p>一个为《Web作业》设计的演示项目</p>
        </footer>
    );
};

export default Footer;