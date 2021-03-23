// 引入Sequelize模块
const Sequelize = require('sequelize');
// 引入数据库实例
const db = require('../db');
// 定义model
const Welfare = db.define('Welfare', {
    // 主键
    id: { type: Sequelize.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },

    title: { type: Sequelize.STRING(255), allowNull: false },
    describe: { type: Sequelize.STRING, allowNull: true },
    imglist: { type: Sequelize.STRING, allowNull: false },
}, {
    // 是否支持驼峰
    underscored: true,
    // MySQL数据库表名
    tableName: 'welfare',
});
// 导出model
module.exports = Welfare;