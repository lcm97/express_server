const Common = require('./common');
const UserModel = require('../models/user');

const Constant = require('../constant/constant');
const dateFormat = require('dateformat');
const fs = require('fs');
const path = require('path');
const { Op } = require("sequelize");
let exportObj = {
    list,
    add,
    update,
    remove,
    info,
    findorcreate,
    count
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
            if (req.query.status) {
                whereCondition.status = req.query.status;
            }
            if (req.query.link_id) {
                whereCondition.link_id = req.query.link_id;
            }
            if (req.query.company) {
                whereCondition.company = req.query.company;
            }
            if (req.query.course) {
                whereCondition.course = req.query.course;
            }

            UserModel
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
                            openid: v.openid,
                            avatar: v.avatar,
                        };
                        obj.name = v.name === null ? '' : v.name
                        obj.phone = v.phone === null ? '' : v.phone
                        obj.link_id = v.link_id === null ? undefined : v.link_id
                        obj.course = v.course === null ? '' : v.course
                        obj.company = v.company === null ? '' : v.company
                        obj.group_id = v.group_id === null ? undefined : v.group_id
                        obj.identity = v.identity === null ? '' : v.identity
                        obj.status = v.status === null ? '未报名' : v.status

                        //obj.crewlist = v.crewlist === null ? [] : v.crewlist.split(' ')
                        items.push(obj);
                    });
                    resObj.data = {
                        items,
                        total: result.count
                    };
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
            Common.checkParams(req.body, ['name', 'company', 'img', 'price', 'class', 'status'], cb);
        },
        add: cb => {
            GroupModel
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
            Common.checkParams(req.body, ['id'], cb);
        },
        update: cb => {
            UserModel
                .update({
                    name: req.body.name,
                    phone: req.body.phone,
                    link_id: req.body.link_id,
                    company: req.body.company,
                    course: req.body.course,
                    identity: req.body.identity
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
            Common.checkParams(req.body, ['id'], cb);
        },
        remove: cb => {
            UserModel
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
    Common.autoFn(tasks, res, resObj)
}

function info(req, res) {
    const resObj = Common.clone(Constant.DEFAULT_SUCCESS);
    let tasks = {
        checkParams: (cb) => {
            Common.checkParams(req.query, ['id'], cb);
        },
        query: ['checkParams', (results, cb) => {
            GroupModel
                .findByPk(req.query.id)
                .then(function(result) {
                    if (result) {
                        resObj.data = {
                            id: result.id,
                            name: result.name,
                            company: result.company,
                            img: result.img,
                            ori_price: result.ori_price,
                            price: result.price,
                            class: result.class,
                            status: result.status,
                            all: result.all,
                            new: result.new,
                            old: result.old,
                            payed: result.payed,
                            unpayed: result.unpayed
                        };
                        cb(null);
                    } else {
                        cb(Constant.WISH_NOT_EXSIT);
                    }
                })
                .catch(function(err) {
                    console.log(err);
                    cb(Constant.DEFAULT_ERROR);
                });

        }]
    };
    Common.autoFn(tasks, res, resObj)

}

function findorcreate(req, res) {
    const resObj = Common.clone(Constant.DEFAULT_SUCCESS);
    let tasks = {
        checkParams: (cb) => {
            Common.checkParams(req.query, ['openid', 'avatar'], cb);
        },
        query: ['checkParams', (results, cb) => {
            let whereCondition = {};
            if (req.query.openid) {
                whereCondition.openid = req.query.openid;
            }
            if (req.query.avatar) {
                whereCondition.avatar = req.query.avatar;
            }
            if (req.query.link_id) {
                whereCondition.link_id = req.query.link_id;
            }
            UserModel
                .findOrCreate({
                    where: whereCondition,
                    raw: true,
                })
                .then(function(result) {
                    resObj.data = result;
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

function count(req, res) {
    const resObj = Common.clone(Constant.DEFAULT_SUCCESS);
    let tasks = {
        checkParams: (cb) => {
            Common.checkParams(req.query, ['link_id'], cb);
        },
        query: ['checkParams', (results, cb) => {

            UserModel
                .findAndCountAll({
                    where: {
                        link_id: req.query.link_id,
                        group_id: {
                            [Op.ne]: null
                        }
                    }
                })
                .then(function(result) {
                    resObj.data = {
                        total: result.count
                    };
                    cb(null)
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