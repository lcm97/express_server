const Common = require('./common');
const CompanyModel = require('../models/company');
const Constant = require('../constant/constant');
const dateFormat = require('dateformat');

let exportObj = {
    list,
    info,
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
            console.log(req)
                // 调用公共方法中的校验参数方法，成功继续后面操作，失败则传递错误信息到async最终方法
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
                            link_name: v.link_name,
                            imglist: v.imglist.split(' '),
                            contacts: v.contacts.split(' '),
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
            LinksModel
                .findAll({ raw: true })
                .then(function(result) {
                    console.log(result)
                    let items = [];
                    result.forEach((v, i) => {
                        let obj = {
                            id: v.id,
                            name: v.name,
                            remark: v.remark,
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



function info(req, res) {
    // 定义一个返回对象
    const resObj = Common.clone(Constant.DEFAULT_SUCCESS);
    // 定义一个async任务
    let tasks = {
        // 校验参数方法
        checkParams: (cb) => {
            // 调用公共方法中的校验参数方法，成功继续后面操作，失败则传递错误信息到async最终方法
            Common.checkParams(req.params, ['id'], cb);
        },
        // 查询方法，依赖校验参数方法
        query: ['checkParams', (results, cb) => {
            // 使用wish的model中的方法查询
            LinksModel
                .findByPk(req.params.id)
                .then(function(result) {
                    // 查询结果处理
                    // 如果查询到结果
                    if (result) {
                        // 将查询到的结果给返回对象赋值
                        resObj.data = {
                            id: result.id,
                            name: result.name,
                            content: result.content,
                            createdAt: dateFormat(result.createdAt, 'yyyy-mm-dd HH:MM:ss')
                        };
                        // 继续后续操作
                        cb(null);
                    } else {
                        // 查询失败，传递错误信息到async最终方法
                        cb(Constant.WISH_NOT_EXSIT);
                    }
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

function add(req, res) {
    const resObj = Common.clone(Constant.DEFAULT_SUCCESS);
    let tasks = {
        checkParams: (cb) => {
            Common.checkParams(req.body, ['name', 'remark', 'music'], cb);
        },
        add: cb => {
            LinksModel
                .create({
                    name: req.body.name,
                    remark: req.body.remark,
                    music: req.body.music
                })
                .then(function(result) {
                    resObj.data = {
                        item: result.dataValues
                    };
                    cb(null);
                })
                .catch(function(err) {
                    // 错误处理
                    // 打印错误日志
                    console.log(err);
                    // 传递错误信息到async最终方法
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
            Common.checkParams(req.body, ['id', 'name', 'remark', 'music'], cb);
        },
        update: cb => {
            LinksModel
                .update({
                    name: req.body.name,
                    remark: req.body.remark,
                    music: req.body.music
                }, {
                    where: {
                        id: req.body.id
                    }
                })
                .then(function(result) {
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
            Common.checkParams(req.body, ['id'], cb);
        },
        // 删除方法，依赖校验参数方法
        remove: cb => {
            // 使用wish的model中的方法更新
            LinksModel
                .destroy({
                    where: {
                        id: req.body.id
                    }
                })
                .then(function(result) {
                    // 删除结果处理
                    if (result) {
                        // 如果删除成功
                        // 继续后续操作
                        //删除该链接下的所有内容ToDo

                        cb(null);
                    } else {
                        // 删除失败，传递错误信息到async最终方法
                        cb(Constant.WISH_NOT_EXSIT);
                    }
                })
                .catch(function(err) {
                    // 错误处理
                    // 打印错误日志
                    console.log(err);
                    // 传递错误信息到async最终方法
                    cb(Constant.DEFAULT_ERROR);
                });
        }
    };
    // 执行公共方法中的autoFn方法，返回数据
    Common.autoFn(tasks, res, resObj)
}