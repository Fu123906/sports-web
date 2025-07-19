import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3001';

const AdminDashboard = () => {
    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingActivity, setEditingActivity] = useState(null); 
    const [activeTab, setActiveTab] = useState('activities'); // 新增：当前激活的标签页

    // 添加价格字段
    const initialFormState = { 
        name: '', 
        description: '', 
        date: '', 
        location: '', 
        maxParticipants: '',
        price: ''  // 新增价格字段
    };
    const [formData, setFormData] = useState(initialFormState);
    
    const [registrations, setRegistrations] = useState([]);
    const [users, setUsers] = useState([]); // 新增：存储所有用户信息
    const [registrationsWithDetails, setRegistrationsWithDetails] = useState([]); // 新增：包含详细信息的报名记录

    // 获取所有活动
    const fetchActivities = () => {
        setIsLoading(true);
        axios.get(`${API_URL}/activities`)
            .then(res => {
                setActivities(res.data.sort((a, b) => new Date(b.date) - new Date(a.date)));
                setIsLoading(false);
            })
            .catch(err => {
                console.error("获取活动失败:", err);
                setIsLoading(false);
            });
    };
    
    // 获取所有报名数据
    const fetchRegistrations = () => {
        axios.get(`${API_URL}/registrations`)
            .then(res => setRegistrations(res.data))
            .catch(err => console.error("获取报名数据失败:", err));
    };
    
    // 新增：获取所有用户信息
    const fetchUsers = () => {
        axios.get(`${API_URL}/users`)
            .then(res => setUsers(res.data))
            .catch(err => console.error("获取用户数据失败:", err));
    };

    // 新增：合并报名信息和用户信息
    const combineRegistrationDetails = () => {
        const combined = registrations.map(reg => {
            const activity = activities.find(a => a.id === reg.activityId);
            const user = users.find(u => u.id === reg.userId);
            return {
                ...reg,
                activityName: activity ? activity.name : "未知活动",
                userEmail: user ? user.email : "未知邮箱",
                activityDate: activity ? activity.date : "未知日期"
            };
        });
        setRegistrationsWithDetails(combined);
    };

    useEffect(() => {
        fetchActivities();
        fetchRegistrations();
        fetchUsers();
    }, []);

    useEffect(() => {
        if (activities.length > 0 && registrations.length > 0 && users.length > 0) {
            combineRegistrationDetails();
        }
    }, [activities, registrations, users]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // 点击"编辑"按钮时，用活动数据填充表单
    const handleEditClick = (activity) => {
        setEditingActivity(activity);
        setFormData(activity);
        window.scrollTo(0, 0); // 滚动到页面顶部以编辑
    };

    // 点击"取消"按钮
    const handleCancelEdit = () => {
        setEditingActivity(null);
        setFormData(initialFormState);
    };

    // 点击"删除"按钮
    const handleDelete = (id) => {
        if (window.confirm('您确定要删除这个活动吗？此操作无法撤销。')) {
            axios.delete(`${API_URL}/activities/${id}`)
                .then(() => {
                    alert('删除成功！');
                    fetchActivities(); // 重新加载列表
                })
                .catch(err => {
                    console.error("删除失败:", err);
                    alert('删除失败！');
                });
        }
    };
    
    // 新增：删除报名记录
    const handleDeleteRegistration = (id) => {
        if (window.confirm('确定要删除此报名记录吗？')) {
            axios.delete(`${API_URL}/registrations/${id}`)
                .then(() => {
                    alert('报名记录删除成功！');
                    fetchRegistrations(); // 重新加载报名数据
                })
                .catch(err => {
                    console.error("删除报名记录失败:", err);
                    alert('删除报名记录失败！');
                });
        }
    };

    // 提交表单（创建或更新）
    const handleSubmit = (e) => {
        e.preventDefault();
        // 添加价格字段转换
        const activityData = { 
            ...formData, 
            maxParticipants: parseInt(formData.maxParticipants) || 0,
            price: parseFloat(formData.price) || 0 // 转换为浮点数
        };

        const apiCall = editingActivity
            ? axios.put(`${API_URL}/activities/${editingActivity.id}`, activityData)
            : axios.post(`${API_URL}/activities`, activityData);

        apiCall.then(() => {
            alert(editingActivity ? '更新成功！' : '创建成功！');
            handleCancelEdit(); // 清空表单并重置状态
            fetchActivities();  // 重新加载列表
        }).catch(err => {
            console.error("操作失败:", err);
            alert("操作失败！");
        });
    };

    return (
        <div className="page-container admin-dashboard">
            <h1>活动管理面板</h1>
            
            {/* 标签页导航 */}
            <div className="admin-tabs">
                <button 
                    className={activeTab === 'activities' ? 'active' : ''}
                    onClick={() => setActiveTab('activities')}
                >
                    活动管理
                </button>
                <button 
                    className={activeTab === 'registrations' ? 'active' : ''}
                    onClick={() => setActiveTab('registrations')}
                >
                    活动订单管理
                </button>
            </div>

            {/* 活动管理标签页 */}
            {activeTab === 'activities' && (
                <>
                    {/* 表单容器 */}
                    <div className="admin-form-container">
                        <h2>{editingActivity ? `编辑活动：${editingActivity.name}` : '添加新活动'}</h2>
                        <form onSubmit={handleSubmit} className="admin-form">
                            <div className="form-group span-2">
                                <label>活动名称</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>活动地点</label>
                                <input type="text" name="location" value={formData.location} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>活动日期</label>
                                <input type="date" name="date" value={formData.date} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>价格（元）</label>
                                <input 
                                    type="number" 
                                    name="price" 
                                    value={formData.price} 
                                    onChange={handleInputChange} 
                                    required 
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                            <div className="form-group">
                                <label>人数上限</label>
                                <input type="number" name="maxParticipants" value={formData.maxParticipants} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group span-2">
                                <label>活动描述</label>
                                <textarea name="description" value={formData.description} onChange={handleInputChange} required rows="4"></textarea>
                            </div>
                            <div className="form-actions span-2">
                                <button type="submit" className="btn btn-primary">{editingActivity ? '保存更新' : '创建活动'}</button>
                                {editingActivity && <button type="button" onClick={handleCancelEdit} className="btn btn-secondary">取消编辑</button>}
                            </div>
                        </form>
                    </div>

                    {/* 列表容器 */}
                    <div className="admin-list-container">
                        <h2>活动列表</h2>

                        {isLoading ? <div className="loader-container"><div className="loader"></div></div> : (
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>名称</th>
                                        <th>日期</th>
                                        <th>地点</th>
                                        <th>价格</th>
                                        <th>已报名人数</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {activities.map(activity => {
                    // 统计当前活动的报名人数
                    const count = registrations.filter(r => String(r.activityId) === String(activity.id)).length;
                    return (
                        <tr key={activity.id}>
                            <td data-label="名称">{activity.name}</td>
                            <td data-label="日期">{activity.date}</td>
                            <td data-label="地点">{activity.location}</td>
                            <td data-label="价格">
                                {activity.price > 0 ? `¥${activity.price}` : '免费'}
                            </td>
                            <td data-label="已报名人数">
                                {count === 0 ? (
                                    <span style={{color:'#888'}}>暂无</span>
                                ) : (
                                    <span>{count} 人</span>
                                )}
                            </td>
                            <td data-label="操作" className="actions-cell">
                                <button onClick={() => handleEditClick(activity)} className="btn btn-edit">编辑</button>
                                <button onClick={() => handleDelete(activity.id)} className="btn btn-delete">删除</button>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
                        )}
                    </div>
                </>
            )}

            {/* 活动订单管理标签页 */}
            {activeTab === 'registrations' && (
                <div className="admin-list-container">
                    <h2>活动报名记录</h2>
                    
                    {registrationsWithDetails.length === 0 ? (
                        <div className="empty-state">暂无报名记录</div>
                    ) : (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>活动名称</th>
                                    <th>活动日期</th>
                                    <th>用户邮箱</th>
                                    <th>报名日期</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {registrationsWithDetails.map(reg => (
                                    <tr key={reg.id}>
                                        <td>{reg.activityName}</td>
                                        <td>{reg.activityDate}</td>
                                        <td>{reg.userEmail}</td>
                                        <td>{reg.registrationDate}</td>
                                        <td>
                                            <button 
                                                className="btn btn-delete"
                                                onClick={() => handleDeleteRegistration(reg.id)}
                                            >
                                                删除
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;