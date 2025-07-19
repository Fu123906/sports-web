import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const API_URL = 'http://localhost:3001';

const ActivityDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [activity, setActivity] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [registrationId, setRegistrationId] = useState(null); // 新增
    const [comments, setComments] = useState([]);
    const [commentContent, setCommentContent] = useState('');
 useEffect(() => {
        const fetchDetails = async () => {
            setIsLoading(true);
            try {
                // 1. 获取活动详情
                const activityRes = await axios.get(`${API_URL}/activities/${id}`);
                setActivity(activityRes.data);

                // 2. 如果用户已登录，检查是否已报名
                if (user) {
                    const registrationRes = await axios.get(`${API_URL}/registrations?userId=${user.id}&activityId=${id}`);
                    if (registrationRes.data.length > 0) {
                        setIsRegistered(true);
                        setRegistrationId(registrationRes.data[0].id);
                    } else {
                        setIsRegistered(false);
                        setRegistrationId(null);
                    }
                }
            } catch (err) {
                console.error("获取详情失败: ", err);
                alert("加载活动详情失败！");
            } finally {
                setIsLoading(false);
            }
            // 获取评论
            axios.get(`${API_URL}/comments?activityId=${id}`)
                .then(res => setComments(res.data))
                .catch(err => console.error("获取评论失败:", err));
        };

        fetchDetails();
    }, [id, user]);
 
    const handleRegisterClick = async () => {
        // 如果未登录，跳转到登录页
        if (!user) {
            alert("请先登录再报名！");
            navigate('/login');
            return;
        }

        // 防止重复提交
        if (isRegistered) return;

        try {
            const registrationData = {
                userId: user.id,
                activityId: id,
                registrationDate: new Date().toISOString().split('T')[0],
            };
            const res = await axios.post(`${API_URL}/registrations`, registrationData);
            alert("报名成功!");
            setIsRegistered(true); // 更新UI状态
            setRegistrationId(res.data.id); // 关键：保存新报名记录id
        } catch (err) {
            console.error("报名失败: ", err);
            alert("报名失败，请稍后再试。");
        }
    };
// 新增取消预约功能
    const handleCancelRegistration = async () => {
    if (!registrationId) return;
    try {
        await axios.delete(`${API_URL}/registrations/${registrationId}`);
        alert("已取消报名！");
        setIsRegistered(false);
        setRegistrationId(null);
    } catch (err) {
        console.error("取消报名失败: ", err);
        alert("取消报名失败，请稍后再试。");
    }
    };
const handleAddComment = async () => {
    if (!user) {
        alert("请先登录后评论！");
        navigate('/login');
        return;
    }
    if (!commentContent.trim()) {
        alert("评论内容不能为空！");
        return;
    }
    try {
        const newComment = {
            activityId: id,
            userId: user.id,
            content: commentContent,
            date: new Date().toISOString().split('T')[0]
        };
        await axios.post(`${API_URL}/comments`, newComment);
        setCommentContent('');
        // 重新获取评论
        const res = await axios.get(`${API_URL}/comments?activityId=${id}`);
        setComments(res.data);
    } catch (err) {
        alert("评论失败，请稍后再试。");
    }
};

    if (isLoading) return <div className="page-container"><p>加载中...</p></div>;
    if (!activity) return <div className="page-container"><p>未找到该活动。</p></div>;

   return (
        <div className="page-container">
            <div className="activity-detail-card">
                <h1>{activity.name}</h1>
                
                {/* 添加价格显示 - 使用醒目的样式 */}
                <div className="price-tag">
                    {activity.price > 0 ? `${activity.price}元/次` : '免费'}
                </div>
                
                <div className="activity-meta">
                    <p><strong>📅 日期:</strong> {activity.date}</p>
                    <p><strong>📍 地点:</strong> {activity.location}</p>
                    <p><strong>👥 人数上限:</strong> {activity.maxParticipants}</p>
                </div>
                
                <p className="activity-description">{activity.description}</p>
                
                {/* 报名按钮区域 */}
                <div className="registration-section">
                    {!isRegistered ? (
                        <button 
                            onClick={handleRegisterClick} 
                            className="form-button primary"
                        >
                            立即报名
                        </button>
                    ) : (
                        <button 
                            onClick={handleCancelRegistration} 
                            className="form-button secondary"
                        >
                            取消报名
                        </button>
                    )}
                </div>

                {/* 美化后的评论区 */}
                <div className="comment-section">
                    <h3>评论区</h3>
                    <div className="comment-input-area">
                        <textarea
                            value={commentContent}
                            onChange={e => setCommentContent(e.target.value)}
                            placeholder="分享你的想法..."
                            rows={3}
                        />
                        <button 
                            onClick={handleAddComment} 
                            className="comment-submit-btn"
                        >
                            发表评论
                        </button>
                    </div>
                    
                    <div className="comment-list">
                        {comments.length === 0 ? (
                            <div className="no-comments">还没有评论，快来第一个留言吧~</div>
                        ) : (
                            comments.map(comment => (
                                <div key={comment.id} className="comment-item">
                                    <div className="comment-header">
                                        <span className="comment-user">{comment.userId}</span>
                                        <span className="comment-date">{comment.date}</span>
                                    </div>
                                    <div className="comment-content">{comment.content}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivityDetail;