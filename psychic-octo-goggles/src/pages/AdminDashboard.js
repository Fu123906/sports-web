import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css'; // 引入独立样式文件（需创建）

const API_URL = 'http://localhost:3001';

const AdminDashboard = () => {
  // 状态管理
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingActivity, setEditingActivity] = useState(null);
  const [activeTab, setActiveTab] = useState('activities');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    location: '',
    maxParticipants: '',
    price: ''
  });
  const [registrations, setRegistrations] = useState([]);
  const [users, setUsers] = useState([]);
  const [registrationsWithDetails, setRegistrationsWithDetails] = useState([]);

  // 数据获取逻辑
  const fetchData = async (endpoint, setState) => {
    try {
      const res = await axios.get(`${API_URL}/${endpoint}`);
      setState(res.data);
    } catch (err) {
      console.error(`获取${endpoint}失败:`, err);
    }
  };

  useEffect(() => {
    const init = async () => {
      await Promise.all([
        fetchData('activities', setActivities),
        fetchData('registrations', setRegistrations),
        fetchData('users', setUsers)
      ]);
      setIsLoading(false);
    };
    init();
  }, []);

  // 报名信息合并逻辑
  useEffect(() => {
    if (activities.length && registrations.length && users.length) {
      setRegistrationsWithDetails(registrations.map(reg => ({
        ...reg,
        activityName: activities.find(a => a.id === reg.activityId)?.name || '未知活动',
        userEmail: users.find(u => u.id === reg.userId)?.email || '未知用户',
        activityDate: activities.find(a => a.id === reg.activityId)?.date || '未知日期'
      })));
    }
  }, [activities, registrations, users]);

  // 交互处理
  const handleInput = (e) => 
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const enterEditMode = (activity) => {
    setEditingActivity(activity);
    setFormData(activity);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteResource = async (endpoint, id, successMsg) => {
    if (window.confirm('确认删除？此操作不可恢复')) {
      try {
        await axios.delete(`${API_URL}/${endpoint}/${id}`);
        alert(successMsg);
        await fetchData(endpoint, endpoint === 'activities' ? setActivities : setRegistrations);
      } catch (err) {
        alert('删除失败，请重试');
        console.error('删除失败:', err);
      }
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      maxParticipants: Number(formData.maxParticipants) || 0,
      price: Number(formData.price) || 0
    };

    try {
      if (editingActivity) {
        await axios.put(`${API_URL}/activities/${editingActivity.id}`, payload);
        alert('活动更新成功');
      } else {
        await axios.post(`${API_URL}/activities`, payload);
        alert('活动创建成功');
      }
      setEditingActivity(null);
      setFormData({ ...formData, name: '', description: '' }); // 保留部分状态优化体验
      await fetchData('activities', setActivities);
    } catch (err) {
      alert('操作失败，请检查输入');
      console.error('提交失败:', err);
    }
  };

  return (
    <div className="admin-container">
      <h1 className="page-title">活动管理面板</h1>

      {/* 标签切换栏 */}
      <div className="tab-nav">
        <button 
          className={`tab-item ${activeTab === 'activities' ? 'active' : ''}`}
          onClick={() => setActiveTab('activities')}
        >
          活动管理
        </button>
        <button 
          className={`tab-item ${activeTab === 'registrations' ? 'active' : ''}`}
          onClick={() => setActiveTab('registrations')}
        >
          活动订单管理
        </button>
      </div>

      {/* 活动管理标签页 */}
      {activeTab === 'activities' && (
        <div className="panel-card">
          {/* 编辑/创建表单 */}
          <div className="form-section">
            <h2 className="section-title">
              {editingActivity ? `编辑活动：${editingActivity.name}` : '创建新活动'}
            </h2>
            <form onSubmit={submitForm} className="admin-form">
              <div className="form-row">
                <div className="form-group">
                  <label>活动名称</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInput} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>活动地点</label>
                  <input 
                    type="text" 
                    name="location" 
                    value={formData.location} 
                    onChange={handleInput} 
                    required 
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>活动日期</label>
                  <input 
                    type="date" 
                    name="date" 
                    value={formData.date} 
                    onChange={handleInput} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>价格（元）</label>
                  <input 
                    type="number" 
                    name="price" 
                    value={formData.price} 
                    onChange={handleInput} 
                    min="0" 
                    step="0.01" 
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>人数上限</label>
                  <input 
                    type="number" 
                    name="maxParticipants" 
                    value={formData.maxParticipants} 
                    onChange={handleInput} 
                    min="0" 
                  />
                </div>
                <div className="form-group">
                  <label>活动描述</label>
                  <textarea 
                    name="description" 
                    value={formData.description} 
                    onChange={handleInput} 
                    rows="4" 
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn primary">
                  {editingActivity ? '保存更改' : '创建活动'}
                </button>
                {editingActivity && (
                  <button 
                    type="button" 
                    onClick={() => setEditingActivity(null)} 
                    className="btn secondary"
                  >
                    取消编辑
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* 活动列表 */}
          <div className="list-section">
            <h2 className="section-title">活动列表</h2>
            {isLoading ? (
              <div className="loading-spinner"></div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>活动名称</th>
                    <th>日期</th>
                    <th>地点</th>
                    <th>价格</th>
                    <th>报名人数</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map(activity => {
                    const registrantCount = registrations.filter(
                      r => r.activityId === activity.id
                    ).length;
                    
                    return (
                      <tr key={activity.id}>
                        <td>{activity.name}</td>
                        <td>{activity.date}</td>
                        <td>{activity.location}</td>
                        <td>
                          {activity.price > 0 
                            ? `¥${activity.price.toFixed(2)}` 
                            : '免费'
                          }
                        </td>
                        <td>
                          {registrantCount === 0 
                            ? <span className="empty-tag">暂无</span> 
                            : registrantCount
                          }
                        </td>
                        <td className="action-cell">
                          <button 
                            className="btn tiny secondary"
                            onClick={() => enterEditMode(activity)}
                          >
                            编辑
                          </button>
                          <button 
                            className="btn tiny danger"
                            onClick={() => deleteResource('activities', activity.id, '活动删除成功')}
                          >
                            删除
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* 活动订单管理标签页 */}
      {activeTab === 'registrations' && (
        <div className="panel-card">
          <h2 className="section-title">活动报名记录</h2>
          {registrationsWithDetails.length === 0 ? (
            <div className="empty-state">暂无报名记录</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>活动名称</th>
                  <th>活动日期</th>
                  <th>用户邮箱</th>
                  <th>报名时间</th>
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
                    <td className="action-cell">
                      <button 
                        className="btn tiny danger"
                        onClick={() => deleteResource('registrations', reg.id, '报名记录删除成功')}
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