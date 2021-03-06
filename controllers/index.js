// 引入公共方法
const Common = require('./common');
// 引入常量
const Constant = require('../constant/constant');
// 引入dateformat包
const dateFormat = require('dateformat');
// 引入fs模块，用于操作文件
const fs = require('fs');
// 引入path模块，用于操作文件路径
const path = require('path');


// 配置对象
let exportObj = {
    upload,
};
// 导出对象，供其它模块调用
module.exports = exportObj;

// 上传文件方法
function upload(req, res) {
    // 定义一个返回对象
    const resObj = Common.clone(Constant.DEFAULT_SUCCESS);
    // 定义一个async任务
    let tasks = {
        // 校验参数方法
        checkParams: (cb) => {
            // 调用公共方法中的校验参数方法，成功继续后面操作，失败则传递错误信息到async最终方法
            Common.checkParams(req.file, ['originalname'], cb);
        },
        // 查询方法，依赖校验参数方法
        save: ['checkParams', (results, cb) => {
            // 获取上传文件的扩展名
            let lastIndex = req.file.originalname.lastIndexOf('.');
            let extension = req.file.originalname.substr(lastIndex - 1);
            // 使用时间戳作为新文件名
            let fileName = new Date().getTime() + extension;
            // 保存文件，用新文件名写入
            // 三个参数
            // 1.图片的绝对路径
            // 2.写入的内容
            // 3.回调函数
            fs.writeFile(path.join(__dirname, '../public/upload/' + fileName), req.file.buffer, (err) => {
                // 保存文件出错
                if (err) {
                    cb(Constant.SAVE_FILE_ERROR)
                } else {
                    resObj.data = {
                        // 返回文件名
                        fileName: fileName,
                        // 通过公共方法getFileUrl拼接图片路径
                        path: Common.getFileUrl(req, fileName)
                    };
                    cb(null)
                }
            })

        }]

    };
    // 执行公共方法中的autoFn方法，返回数据
    Common.autoFn(tasks, res, resObj)

}