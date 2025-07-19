import React from 'react';
import { Link } from 'react-router-dom';

const ActivityCard = ({ activity }) => {
    return (
        <div className="activity-card">
            <Link to={`/activity/${activity.id}`}>
                <h3>{activity.name}</h3>
                <p className="card-info">📅 日期: {activity.date}</p>
                <p className="card-info">📍 地点: {activity.location}</p>
                <span className="card-link">查看详情 &rarr;</span>
            </Link>
        </div>
    );
};

export default ActivityCard;