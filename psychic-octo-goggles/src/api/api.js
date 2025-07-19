import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001'; // 这是 json-server 默认的地址

// 活动相关
export const getActivities = (searchTerm) => {
    // 支持搜索功能 (q=)
    const url = searchTerm ? `${API_BASE_URL}/activities?q=${searchTerm}` : `${API_BASE_URL}/activities`;
    return axios.get(url);
};
export const getActivityById = (id) => axios.get(`${API_BASE_URL}/activities/${id}`);
export const createActivity = (activityData) => axios.post(`${API_BASE_URL}/activities`, activityData);
export const updateActivity = (id, activityData) => axios.put(`${API_BASE_URL}/activities/${id}`, activityData);
export const deleteActivity = (id) => axios.delete(`${API_BASE_URL}/activities/${id}`);

// 评论相关
export const getCommentsByActivityId = (activityId) => axios.get(`${API_BASE_URL}/comments?activityId=${activityId}`);
export const postComment = (commentData) => axios.post(`${API_BASE_URL}/comments`, commentData);

// 报名(订单)相关
export const registerForActivity = (registrationData) => axios.post(`${API_BASE_URL}/registrations`, registrationData);
export const getUserRegistrations = (userId) => axios.get(`${API_BASE_URL}/registrations?userId=${userId}&_expand=activity`);

// 用户认证
export const login = (email, password) => axios.get(`${API_BASE_URL}/users?email=${email}&password=${password}`);
export const register = (userData) => axios.post(`${API_BASE_URL}/users`, userData);