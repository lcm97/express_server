const Sequelize = require('sequelize');
const db = require('../db');
// 定义model
const Group = db.define('Group', {
    // 主键
    id: { type: Sequelize.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
    type: { type: Sequelize.INTEGER, allowNull: false, },
    num: { type: Sequelize.INTEGER, allowNull: false, },
    cap_id: { type: Sequelize.INTEGER, allowNull: false, },
    cap_name: { type: Sequelize.STRING(255), allowNull: false },
    crewlist: { type: Sequelize.STRING(255), allowNull: true },
}, {
    // 是否支持驼峰
    underscored: true,
    // MySQL数据库表名
    tableName: 'group',
});
// 导出model
module.exports = Group;