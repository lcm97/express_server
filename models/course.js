const Sequelize = require('sequelize');
const db = require('../db');
// 定义model
const Course = db.define('Course', {
    // 主键
    id: { type: Sequelize.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
    name: { type: Sequelize.STRING(255), allowNull: false },
    company: { type: Sequelize.STRING(255), allowNull: false },
    img: { type: Sequelize.STRING(255), allowNull: false },

    ori_price: { type: Sequelize.FLOAT(11, 2), allowNull: true },
    price: { type: Sequelize.FLOAT(11, 2), allowNull: false },
    class: { type: Sequelize.STRING(255), allowNull: false },
    status: { type: Sequelize.STRING(5), allowNull: false },

    all: { type: Sequelize.INTEGER, allowNull: false, },
    new: { type: Sequelize.INTEGER, allowNull: false, },
    old: { type: Sequelize.INTEGER, allowNull: false, },
    payed: { type: Sequelize.INTEGER, allowNull: false, },
    unpayed: { type: Sequelize.INTEGER, allowNull: false, },
}, {
    // 是否支持驼峰
    underscored: true,
    // MySQL数据库表名
    tableName: 'course',
});
// 导出model
module.exports = Course;