import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import ActivityCard from '../components/ActivityCard';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:3001';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [myActivities, setMyActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                const [registrationsRes, activitiesRes] = await Promise.all([
                    axios.get(`${API_URL}/registrations`),
                    axios.get(`${API_URL}/activities`)
                ]);

                const allRegistrations = registrationsRes.data;
                const allActivities = activitiesRes.data;

                const myRegistrations = allRegistrations.filter(reg => reg.userId == user.id);
                
                const activitiesMap = new Map(allActivities.map(activity => [activity.id, activity]));

                const combinedActivities = myRegistrations
                    // 👇 **最终修复：在查找地图前，将 reg.activityId 转换为字符串**
                    .map(reg => activitiesMap.get(String(reg.activityId)))
                    .filter(activity => activity !== undefined);

                setMyActivities(combinedActivities);

            } catch (error) {
                console.error("获取个人数据失败:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    if (loading) {
        return <div className="loader-container"><div className="loader"></div></div>;
    }

    if (!user) {
        return <div className="page-container"><p>请先 <Link to="/login">登录</Link> 查看个人中心。</p></div>;
    }

    return (
        <div className="page-container">
            <div className="profile-card">
                <h2>{user.email} 的个人中心</h2>
                <p><strong>角色:</strong> {user.role === 'admin' ? '管理员' : '普通用户'}</p>
            </div>
            
            <h3>我报名的活动</h3>
            {myActivities.length > 0 ? (
                <div className="activity-grid">
                    {myActivities.map(activity => (
                        <ActivityCard key={activity.id} activity={activity} />
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <p>您还没有报名任何活动。</p>
                    <Link to="/activities" className="hero-button">去逛逛</Link>
                </div>
            )}
        </div>
    );
};

export default Profile;