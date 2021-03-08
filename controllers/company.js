const Common = require('./common');
const CompanyModel = require('../models/company');
const Constant = require('../constant/constant');
const dateFormat = require('dateformat');
const fs = require('fs');
const path = require('path');
let exportObj = {
    list,
    add,
    update,
    remove,
    findall,
}

module.exports = exportObj;

//根据条件获取相应list
function list(req, res) {
    const resObj = Common.clone(Constant.DEFAULT_SUCCESS);
    let tasks = {
        // 校验参数方法
        checkParams: (cb) => {
            Common.checkParams(req.query, ['page', 'limit'], cb);
        },
        // 查询方法，依赖校验参数方法
        query: ['checkParams', (results, cb) => {
            // 根据前端提交参数计算SQL语句中需要的offset，即从多少条开始查询
            let offset = req.query.limit * (req.query.page - 1) || 0;
            // 根据前端提交参数计算SQL语句中需要的limit，即查询多少条
            let limit = parseInt(req.query.limit) || 20;

            // 设定一个查询条件对象
            let whereCondition = {};
            // 如果查询姓名存在，查询对象增加姓名
            if (req.query.name) {
                whereCondition.name = req.query.name;
            }
            if (req.query.link_id) {
                whereCondition.link_id = req.query.link_id;
            }
            // 通过offset和limit使用model去数据库中查询，并按照创建时间排序
            CompanyModel
                .findAndCountAll({
                    where: whereCondition,
                    offset: offset,
                    limit: limit,
                    order: [
                        ['created_at', 'DESC']
                    ],
                })
                .then(function(result) {
                    // 查询结果处理
                    // 定义一个空数组list，用来存放最终结果
                    let items = [];
                    // 遍历SQL查询出来的结果，处理后装入list
                    result.rows.forEach((v, i) => {
                        let obj = {
                            id: v.id,
                            name: v.name,
                            link_id: v.link_id,
                            link_name: v.link_name,
                            imglist: v.imglist.split(' '),
                            contacts: v.contacts.split(' '),
                            describe: v.describe,
                            address: v.address,
                            phone: v.phone
                        };
                        items.push(obj);
                    });
                    // 给返回结果赋值，包括列表和总条数
                    resObj.data = {
                        items,
                        total: result.count
                    };
                    // 继续后续操作
                    cb(null);
                })
                .catch(function(err) {
                    // 错误处理
                    // 打印错误日志
                    console.log(err);
                    // 传递错误信息到async最终方法
                    cb(Constant.DEFAULT_ERROR);
                });

        }]
    };
    // 执行公共方法中的autoFn方法，返回数据
    Common.autoFn(tasks, res, resObj)

}


function findall(req, res) {
    const resObj = Common.clone(Constant.DEFAULT_SUCCESS);
    let tasks = {
        checkParams: (cb) => {
            cb(null)
                //Common.checkParams(req.query, ['page', 'limit'], cb);
        },
        query: ['checkParams', (results, cb) => {
            let whereCondition = {};
            if (req.query.link_id) {
                whereCondition.link_id = req.query.link_id;
            }
            CompanyModel
                .findAll({ raw: true, where: whereCondition, })
                .then(function(result) {
                    let items = [];
                    result.forEach((v, i) => {
                        let obj = {
                            id: v.id,
                            name: v.name,
                        };
                        items.push(obj);
                    });
                    resObj.data = { items };
                    cb(null);
                })
                .catch(function(err) {
                    console.log(err);
                    cb(Constant.DEFAULT_ERROR);
                });

        }]
    };
    // 执行公共方法中的autoFn方法，返回数据
    Common.autoFn(tasks, res, resObj)
}

function add(req, res) {
    const resObj = Common.clone(Constant.DEFAULT_SUCCESS);
    let tasks = {
        checkParams: (cb) => {
            Common.checkParams(req.body, ['name', 'link_id', 'link_name', 'imglist', 'contacts', 'address', 'phone'], cb);
        },
        add: cb => {
            CompanyModel
                .create({
                    name: req.body.name,
                    link_id: req.body.link_id,
                    link_name: req.body.link_name,
                    imglist: req.body.imglist,
                    contacts: req.body.contacts,
                    describe: req.body.describe,
                    address: req.body.address,
                    phone: req.body.phone
                })
                .then(function(result) {
                    let item = {
                        id: result.dataValues.id,
                        name: result.dataValues.name,
                        link_id: result.dataValues.link_id,
                        link_name: result.dataValues.link_name,
                        imglist: result.dataValues.imglist.split(' '),
                        contacts: result.dataValues.contacts.split(' '),
                        describe: result.dataValues.describe,
                        address: result.dataValues.address,
                        phone: result.dataValues.phone
                    }
                    resObj.data = {
                        item
                    };
                    cb(null);
                })
                .catch(function(err) {
                    console.log(err);
                    cb(Constant.DEFAULT_ERROR);
                });
        }
    };
    // 执行公共方法中的autoFn方法，返回数据
    Common.autoFn(tasks, res, resObj)
}

function update(req, res) {
    const resObj = Common.clone(Constant.DEFAULT_SUCCESS);
    let tasks = {
        checkParams: (cb) => {
            Common.checkParams(req.body, ['id', 'name', 'link_id', 'link_name', 'imglist', 'contacts', 'address', 'phone'], cb);
        },
        update: cb => {
            CompanyModel
                .update({
                    name: req.body.name,
                    link_id: req.body.link_id,
                    link_name: req.body.link_name,
                    imglist: req.body.imglist,
                    contacts: req.body.contacts,
                    address: req.body.address,
                    phone: req.body.phone,
                    describe: req.body.describe,
                }, {
                    where: {
                        id: req.body.id
                    }
                })
                .then(function(result) {
                    //console.log(result)
                    if (result[0]) {
                        cb(null);
                    } else {
                        cb(Constant.WISH_NOT_EXSIT);
                    }
                })
                .catch(function(err) {
                    console.log(err);
                    cb(Constant.DEFAULT_ERROR);
                });
        }
    };
    Common.autoFn(tasks, res, resObj)
}

function remove(req, res) {
    const resObj = Common.clone(Constant.DEFAULT_SUCCESS);
    let tasks = {
        checkParams: (cb) => {
            Common.checkParams(req.body, ['id', 'imglist', 'contacts'], cb);
        },
        // 删除文件
        delete: cb => {
            //获取文件列表
            let imglist = req.body.imglist.split(' ')
            let contacts = req.body.contacts.split(' ')
            let filelist = imglist.concat(contacts)
            filelist.forEach(fileName => {
                var filename = fileName.split('/').slice(-1)[0]
                fs.unlink(path.join(__dirname, '../public/upload/' + filename), function(err) {
                    if (err) {
                        cb(Constant.REMOVE_FILE_ERROR)
                    }
                })
            });
            cb(null)
        },
        // 删除方法，依赖校验参数方法
        remove: cb => {
            CompanyModel
                .destroy({
                    where: {
                        id: req.body.id
                    }
                })
                .then(function(result) {
                    if (result) {
                        cb(null);
                    } else {
                        cb(Constant.WISH_NOT_EXSIT);
                    }
                })
                .catch(function(err) {
                    console.log(err);
                    cb(Constant.DEFAULT_ERROR);
                });
        }
    };
    // 执行公共方法中的autoFn方法，返回数据
    Common.autoFn(tasks, res, resObj)
}

function findbylink(req, res) {
    const resObj = Common.clone(Constant.DEFAULT_SUCCESS);
    let tasks = {
        checkParams: (cb) => {
            Common.checkParams(req.query, ['link_id'], cb);
        },
        query: ['checkParams', (results, cb) => {
            CompanyModel
                .findAll({
                    raw: true,
                    where: {
                        link_id: req.query.link_id
                    }
                })
                .then(function(result) {
                    let items = [];
                    result.forEach((v, i) => {
                        let obj = {
                            id: v.id,
                            name: v.name,
                        };
                        items.push(obj);
                    });
                    resObj.data = { items };
                    cb(null);
                })
                .catch(function(err) {
                    console.log(err);
                    cb(Constant.DEFAULT_ERROR);
                });

        }]
    };
    // 执行公共方法中的autoFn方法，返回数据
    Common.autoFn(tasks, res, resObj)
}