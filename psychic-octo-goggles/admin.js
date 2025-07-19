const express = require('express');
const router = express.Router();
const db = require('../db'); // 假设 lowdb 实例

// 管理员获取所有活动及其预约用户
router.get('/activities/registrations', (req, res) => {
  const activities = db.get('activities').value();
  const registrations = db.get('registrations').value();
  const users = db.get('users').value();

  const result = activities.map(activity => {
    // 用 String() 保证 id 类型一致
    const regs = registrations.filter(r => String(r.activityId) === String(activity.id));
    const regUsers = regs.map(r => users.find(u => String(u.id) === String(r.userId)));
    return {
      ...activity,
      registeredUsers: regUsers.filter(Boolean)
    };
  });

  res.json(result);
});

module.exports = router;