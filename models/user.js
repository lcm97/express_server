const Sequelize = require('sequelize');
const db = require('../db');

const User = db.define('User', {
    // 主键
    id: { type: Sequelize.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
    openid: { type: Sequelize.INTEGER, allowNull: false, },
    avatar: { type: Sequelize.STRING(255), allowNull: false },
    name: { type: Sequelize.STRING(15), allowNull: true },
    phone: { type: Sequelize.STRING(15), allowNull: true },
    age: { type: Sequelize.INTEGER, allowNull: true },
    link_id: { type: Sequelize.INTEGER, allowNull: true, },
    course: { type: Sequelize.STRING(255), allowNull: true },
    company: { type: Sequelize.STRING(255), allowNull: true },
    group_id: { type: Sequelize.INTEGER, allowNull: true, },
    identity: { type: Sequelize.STRING(15), allowNull: true },
    status: { type: Sequelize.STRING(15), allowNull: true },
}, {
    // 是否支持驼峰
    underscored: true,
    // MySQL数据库表名
    tableName: 'user',
});
// 导出model
module.exports = User;