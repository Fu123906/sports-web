import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/activities?search=${searchTerm.trim()}`);
        } else {
            navigate('/activities');
        }
    };

    return (
        <form onSubmit={handleSearch} className="search-bar-container">
            <input
                type="text"
                className="search-input"
                placeholder="搜索活动，如“篮球”或“瑜伽”..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="search-button">
                搜索
            </button>
        </form>
    );
};

export default SearchBar;