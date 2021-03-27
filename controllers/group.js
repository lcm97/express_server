const Common = require('./common');
const GroupModel = require('../models/group');
const UserModel = require('../models/user')
const CourseModel = require('../models/course')

const Constant = require('../constant/constant');
const dateFormat = require('dateformat');
const fs = require('fs');
const path = require('path');
const { doUntil } = require('async');
const { getNextType } = require('./common');
let exportObj = {
    list,
    add,
    update,
    remove,
    info,
    iscap,
    listbyid,
    joingroup,
    opengroup
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
            if (req.query.cap_name) {
                whereCondition.cap_name = req.query.cap_name;
            }
            if (req.query.cap_id) {
                whereCondition.cap_id = req.query.cap_id;
            }
            if (req.query.link_id) {
                whereCondition.link_id = req.query.link_id;
            }
            if (req.query.id) {
                whereCondition.id = req.query.id;
            }

            GroupModel
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
                        let next_info = Common.getNextType(v.num)
                        let obj = {
                            id: v.id,
                            avatar: v.avatar,
                            type: v.type,
                            num: v.num,
                            diff_num: next_info[0],
                            next_type: next_info[1],
                            cap_id: v.cap_id,
                            cap_name: v.cap_name,
                            created_at: dateFormat(v.created_at, 'yyyy-mm-dd')
                        };
                        obj.crewlist = v.crewlist === null ? [] : v.crewlist.split(' ')
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
            Common.checkParams(req.body, ['link_id', 'name', 'id'], cb);
        },
        add: cb => {
            GroupModel
                .create({
                    type: 3, //新建团默认为3人团
                    num: 1, //只有团长一人
                    link_id: req.body.link_id,
                    cap_name: req.body.name,
                    cap_id: req.body.id,
                    crewlist: '',
                })
                .then(function(result) {
                    let item = {
                        id: result.dataValues.id, //新增的团号
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
            GroupModel
                .update({
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
            GroupModel
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

function iscap(req, res) {
    const resObj = Common.clone(Constant.DEFAULT_SUCCESS);
    let tasks = {
        checkParams: (cb) => {
            Common.checkParams(req.query, ['id'], cb);
        },
        query: ['checkParams', (results, cb) => {
            let whereCondition = {};
            if (req.query.id) {
                whereCondition.cap_id = req.query.id;
            }
            GroupModel
                .findAll({ raw: true, where: whereCondition, })
                .then(function(result) {
                    let items = [];
                    result.forEach((v, i) => {
                        let obj = {
                            id: v.id,
                            name: v.cap_name,
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
                            type: result.type,
                            avatar: result.avatar,
                            num: result.num,
                            link_id: result.link_id,
                            cap_name: result.cap_name,
                            cap_id: result.cap_id,
                            crewlist: result.crewlist,
                            created_at: dateFormat(result.created_at, 'yyyy-mm-dd')
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
            GroupModel
                .findAll({ raw: true, where: whereCondition, })
                .then(function(result) {
                    let items = [];
                    result.forEach((v, i) => {
                        let obj = {
                            id: v.id,
                            name: v.cap_name,
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

//for app
//参团事务
function joingroup(req, res) {
    const resObj = Common.clone(Constant.DEFAULT_SUCCESS);
    let tasks = {
        checkParams: (cb) => {
            //cb(null)
            Common.checkParams(req.body, ['group_id'], cb);
        },
        updateGroup: ['checkParams', (results, cb) => {
            //console.log(req.body)
            //更新团成员
            GroupModel.findByPk(req.body.group_id).then(function(result) {
                //console.log(result.dataValues)
                let num = result.dataValues.num + 1
                let crewlist = result.dataValues.crewlist === null ? req.body.name : result.dataValues.crewlist + ' ' + req.body.name
                let type = Common.getGroupType(num)
                GroupModel
                    .update({
                        type: type,
                        num: num,
                        crewlist: crewlist
                    }, {
                        where: {
                            id: req.body.group_id
                        }
                    })
                    .then(function(result) {
                        console.log(result)
                        if (result[0]) {
                            console.log(result[0])
                            let item = result[0]
                            resObj.data = {
                                item
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
            })
        }],
        updateUser: ['updateGroup', (results, cb) => {
            UserModel
                .update({
                    name: req.body.name,
                    phone: req.body.phone,
                    age: req.body.age,
                    identity: req.body.identity,
                    company: req.body.company,
                    course: req.body.course,
                    group_id: req.body.group_id,
                    status: req.body.status
                }, {
                    where: {
                        id: req.body.user_id
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

            //cb(null)
        }],
        updateCourse: ['updateUser', (results, cb) => {
            CourseModel.findOne({ where: { name: req.body.course } }).then(function(result) {
                let all = result.dataValues.all + 1
                let _new = result.dataValues.new
                let old = result.dataValues.old
                let payed = result.dataValues.payed
                let unpayed = result.dataValues.unpayed
                if (req.body.identity == '新生') {
                    _new = _new + 1
                } else {
                    old = old + 1
                }
                if (req.body.status == '已付款') {
                    payed = payed + 1
                } else {
                    unpayed = unpayed + 1
                }
                CourseModel
                    .update({
                        all: all,
                        new: _new,
                        old: old,
                        payed: payed,
                        unpayed: unpayed,
                    }, {
                        where: {
                            name: req.body.course
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

            })
        }],
    };
    // 执行公共方法中的autoFn方法，返回数据
    Common.autoFn(tasks, res, resObj)
}

//开团
function opengroup(req, res) {
    const resObj = Common.clone(Constant.DEFAULT_SUCCESS);
    let tasks = {
        checkParams: (cb) => {
            //cb(null)
            Common.checkParams(req.body, ['user_id'], cb);
        },
        openGroup: ['checkParams', (results, cb) => {
            //console.log(req.body)
            //新建团
            GroupModel
                .create({
                    type: 3, //新建团默认为3人团
                    num: 1, //只有团长一人
                    avatar: req.body.avatar,
                    link_id: req.body.link_id,
                    cap_name: req.body.name,
                    cap_id: req.body.user_id,
                    crewlist: '',
                })
                .then(function(result) {
                    //console.log(result.dataValues.id)
                    let item = result.dataValues
                    resObj.data = {
                        item
                    };
                    cb(null);
                })
                .catch(function(err) {
                    console.log(err);
                    cb(Constant.DEFAULT_ERROR);
                });
        }],
        updateUser: ['openGroup', (results, cb) => {
            UserModel
                .update({
                    name: req.body.name,
                    phone: req.body.phone,
                    age: req.body.age,
                    identity: req.body.identity,
                    company: req.body.company,
                    course: req.body.course,
                    group_id: resObj.data.item.id,
                    status: req.body.status
                }, {
                    where: {
                        id: req.body.user_id
                    }
                })
                .then(function(result) {
                    if (result[0]) {
                        //console.log(result[0])
                        cb(null);
                    } else {
                        cb(Constant.WISH_NOT_EXSIT);
                    }
                })
                .catch(function(err) {
                    console.log(err);
                    cb(Constant.DEFAULT_ERROR);
                });
        }],
        updateCourse: ['updateUser', (results, cb) => {
            CourseModel.findOne({ where: { name: req.body.course } }).then(function(result) {
                console.log(result.dataValues)
                let all = result.dataValues.all + 1
                let _new = result.dataValues.new
                let old = result.dataValues.old
                let payed = result.dataValues.payed
                let unpayed = result.dataValues.unpayed
                if (req.body.identity == '新生') {
                    _new = _new + 1
                } else {
                    old = old + 1
                }
                if (req.body.status == '已付款') {
                    payed = payed + 1
                } else {
                    unpayed = unpayed + 1
                }
                CourseModel
                    .update({
                        all: all,
                        new: _new,
                        old: old,
                        payed: payed,
                        unpayed: unpayed,
                    }, {
                        where: {
                            name: req.body.course
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

            })
        }],
    };
    // 执行公共方法中的autoFn方法，返回数据
    Common.autoFn(tasks, res, resObj)
}