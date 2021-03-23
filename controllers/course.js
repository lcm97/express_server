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
    info,
    draft,
    publish,
    listbyid,
    listbyname
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
                //Common.checkParams(req.query, ['page', 'limit'], cb);
        },
        query: ['checkParams', (results, cb) => {
            let whereCondition = {};
            if (req.query.company) {
                console.log(req.query.company)
                whereCondition.company = req.query.company;
            }
            CourseModel
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
            Common.checkParams(req.body, ['id', 'name', 'company', 'img', 'price', 'class', 'status'], cb);
        },
        update: cb => {
            CourseModel
                .update({
                    name: req.body.name,
                    link_id: req.body.link_id,
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
            Common.checkParams(req.body, ['id', 'img'], cb);
        },
        // 删除文件
        delete: cb => {
            let imgname = req.body.img.split('/').slice(-1)[0]
            fs.unlink(path.join(__dirname, '../public/upload/' + imgname), function(err) {
                if (err) {
                    cb(Constant.REMOVE_FILE_ERROR)
                }
            })
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

function info(req, res) {
    const resObj = Common.clone(Constant.DEFAULT_SUCCESS);
    let tasks = {
        checkParams: (cb) => {
            Common.checkParams(req.query, ['id'], cb);
        },
        query: ['checkParams', (results, cb) => {
            CourseModel
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

function draft(req, res) {
    const resObj = Common.clone(Constant.DEFAULT_SUCCESS);
    let tasks = {
        checkParams: (cb) => {
            Common.checkParams(req.query, ['id'], cb);
        },
        draft: ['checkParams', (results, cb) => {
            CourseModel
                .update({
                    status: '下架'
                }, {
                    where: {
                        id: req.query.id
                    }
                }).then(function(result) {
                    if (result[0]) {
                        console.log(result)
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

function publish(req, res) {
    const resObj = Common.clone(Constant.DEFAULT_SUCCESS);
    let tasks = {
        checkParams: (cb) => {
            Common.checkParams(req.query, ['id'], cb);
        },
        draft: ['checkParams', (results, cb) => {
            CourseModel
                .update({
                    status: '进行中'
                }, {
                    where: {
                        id: req.query.id
                    }
                }).then(function(result) {
                    if (result[0]) {
                        console.log(result)
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

function listbyid(req, res) {
    const resObj = Common.clone(Constant.DEFAULT_SUCCESS);
    let tasks = {
        checkParams: (cb) => {
            //cb(null)
            Common.checkParams(req.query, ['link_id'], cb);
        },
        query: ['checkParams', (results, cb) => {
            let whereCondition = {};
            if (req.query.link_id) {
                whereCondition.link_id = req.query.link_id;
            }
            whereCondition.status = '进行中';
            CourseModel
                .findAll({ raw: true, where: whereCondition, })
                .then(function(result) {
                    let items = [];
                    result.forEach((v, i) => {
                        let obj = {
                            id: v.id,
                            img: v.img,
                            name: v.name,
                            price: v.price,
                            ori_price: v.ori_price,
                            class: v.class
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

function listbyname(req, res) {
    const resObj = Common.clone(Constant.DEFAULT_SUCCESS);
    let tasks = {
        checkParams: (cb) => {
            //cb(null)
            Common.checkParams(req.query, ['link_id', 'company'], cb);
        },
        query: ['checkParams', (results, cb) => {
            let whereCondition = {};
            if (req.query.link_id) {
                whereCondition.link_id = req.query.link_id;
            }
            if (req.query.company) {
                whereCondition.company = req.query.company;
            }
            whereCondition.status = '进行中';
            CourseModel
                .findAll({ raw: true, where: whereCondition, })
                .then(function(result) {
                    let items = [];
                    result.forEach((v, i) => {
                        let obj = {
                            id: v.id,
                            img: v.img,
                            name: v.name,
                            price: v.price,
                            ori_price: v.ori_price,
                            class: v.class
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