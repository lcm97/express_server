const Sequelize = require('sequelize');
const db = require('../db');
// 定义model
const Company = db.define('Company', {
    // 主键
    id: { type: Sequelize.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
    link_id: { type: Sequelize.INTEGER, allowNull: false },
    name: { type: Sequelize.STRING(255), allowNull: false },
    link_name: { type: Sequelize.STRING(255), allowNull: false },

    imglist: { type: Sequelize.STRING, allowNull: false },
    contacts: { type: Sequelize.STRING, allowNull: false },
    address: { type: Sequelize.STRING(255), allowNull: false },
    phone: { type: Sequelize.STRING(12), allowNull: false },
}, {
    // 是否支持驼峰
    underscored: true,
    // MySQL数据库表名
    tableName: 'company',
});
// 导出model
module.exports = Company;