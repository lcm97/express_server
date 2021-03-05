// 引入Sequelize模块
const Sequelize = require('sequelize');
// 引入数据库实例
const db = require('../db');
// 定义model
const Links = db.define('Links', {
    // 主键
    id: { type: Sequelize.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },

    name: { type: Sequelize.STRING(255), allowNull: false },
    remark: { type: Sequelize.STRING(255), allowNull: false },
}, {
    // 是否支持驼峰
    underscored: true,
    // MySQL数据库表名
    tableName: 'links',
});
// 导出model
module.exports = Links;