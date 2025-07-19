import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ActivityCard from '../components/ActivityCard';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const ActivityList = () => {
    const [allActivities, setAllActivities] = useState([]); // 存储所有活动的“主列表”
    const [filteredActivities, setFilteredActivities] = useState([]); // 存储过滤后要显示的列表
    const [loading, setLoading] = useState(true);
    const query = useQuery();
    const searchTerm = query.get('search');

    // 效果1：仅在组件首次加载时获取一次所有活动
    useEffect(() => {
        setLoading(true);
        axios.get('http://localhost:3001/activities')
            .then(response => {
                setAllActivities(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("获取活动列表失败:", error);
                setLoading(false);
            });
    }, []);

    // 效果2：当“主列表”或“搜索词”变化时，执行过滤
    useEffect(() => {
        if (!searchTerm) {
            setFilteredActivities(allActivities); // 没有搜索词，显示全部
        } else {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            const filtered = allActivities.filter(activity => 
                activity.name.toLowerCase().includes(lowerCaseSearchTerm) ||
                activity.description.toLowerCase().includes(lowerCaseSearchTerm) ||
                activity.location.toLowerCase().includes(lowerCaseSearchTerm)
            );
            setFilteredActivities(filtered);
        }
    }, [searchTerm, allActivities]); // 依赖于搜索词和主列表

    if (loading) {
         return <div className="loader-container"><div className="loader"></div></div>;
    }

    return (
        <div className="page-container">
            <h2>{searchTerm ? `搜索 "${searchTerm}" 的结果` : "所有活动"}</h2>
            
            <div className="activity-grid">
                {filteredActivities.length > 0 ? (
                    filteredActivities.map(activity => (
                        <ActivityCard key={activity.id} activity={activity} />
                    ))
                ) : (
                    <div className="empty-state">
                      <p>没有找到与“{searchTerm}”相关的活动。</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivityList;