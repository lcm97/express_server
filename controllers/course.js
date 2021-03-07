const Common = require('./common');
const CourseModel = require('../models/course');

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

function list(req, res) {
    const resObj = Common.clone(Constant.DEFAULT_SUCCESS);
    let tasks = {
        checkParams: (cb) => {
            Common.checkParams(req.query, ['page', 'limit'], cb);
        },
        query: ['checkParams', (results, cb) => {
            let offset = req.query.limit * (req.query.page - 1) || 0;
            let limit = parseInt(req.query.limit) || 20;

            let whereCondition = {};
            if (req.query.name) {
                whereCondition.name = req.query.name;
            }
            if (req.query.company) {
                whereCondition.company = req.query.company;
            }
            CourseModel
                .findAndCountAll({
                    where: whereCondition,
                    offset: offset,
                    limit: limit,
                    order: [
                        ['created_at', 'DESC']
                    ],
                })
                .then(function(result) {
                    let items = [];
                    result.rows.forEach((v, i) => {
                        let obj = {
                            id: v.id,
                            name: v.name,
                            company: v.company,
                            img: v.img,
                            ori_price: v.ori_price,
                            price: v.price,
                            class: v.class,
                            status: v.status,
                            all: v.all,
                            new: v.new,
                            old: v.old,
                            payed: v.payed,
                            unpayed: v.unpayed,
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
    Common.autoFn(tasks, res, resObj)
}

function add(req, res) {
    const resObj = Common.clone(Constant.DEFAULT_SUCCESS);
    let tasks = {
        checkParams: (cb) => {
            Common.checkParams(req.body, ['name', 'company', 'img', 'price', 'class', 'status'], cb);
        },
        add: cb => {
            CourseModel
                .create({
                    name: req.body.name,
                    company: req.body.company,
                    img: req.body.img,
                    ori_price: parseFloat(req.body.ori_price.toFixed(2)),
                    price: parseFloat(req.body.price.toFixed(2)),
                    class: req.body.class,
                    status: req.body.status,
                    all: req.body.all,
                    new: req.body.new,
                    old: req.body.old,
                    payed: req.body.payed,
                    unpayed: req.body.unpayed
                })
                .then(function(result) {
                    let item = {
                        id: result.dataValues.id,
                        name: result.dataValues.name,
                        company: result.dataValues.company,
                        img: result.dataValues.img,
                        ori_price: result.dataValues.ori_price,
                        price: result.dataValues.price,
                        class: result.dataValues.class,
                        status: result.dataValues.status,
                        all: result.dataValues.all,
                        new: result.dataValues.new,
                        old: result.dataValues.old,
                        payed: result.dataValues.payed,
                        unpayed: result.dataValues.unpayed
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
            CourseModel
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
            CourseModel
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