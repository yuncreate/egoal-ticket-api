/**
 * Copyright(c) 丽江云创信息技术有限公司
 *
 * Authors: mengkeys <mengkeys@hotmail.com>
 *
 * Website: https://www.yuncreate.con
 *
 * Version: 2.0
 *
 * License: MIT Licensed
 */

var md5    = require('md5');
var qs     = require('querystring');
var request = require('request');
var validator = require('validator');

/**
 * 对象属性排序
 * @name   objectSort
 * @param  {Object} obj    (待处理对象)
 * @return {Object} result (处理后的对象)
 */

function objectSort(obj){
    var result = {};
    var items = Object.keys(obj).sort();
    for(var item in items){
        result[items[item]] = obj[items[item]];
    }
    return result;
}


/**
 * 去空操作
 * @name trim
 * @param  {String} str (待操作字符串)
 * @return {String} str (处理结果)
 */
function trim(str) {
      return str.replace(/(^\s*)|(\s*$)/g, ""); 
}

/**
 * 构造对象
 * @name   Ticket
 * @param  {Object} opt    ({url, uname, pass})
 * @return {Object} object (可操作对象)
 *
 */
function Ticket(opt){
    if(arguments.length < 1 || typeof opt !== 'object'){
        throw new Error('options required');
    }

    // verify uname（检测账号）
    if(!opt.hasOwnProperty('uname') || trim(opt.uname) == ""){
        throw new Error('uname required.');
    }

    // verify pass（检测密码）
    if(!opt.hasOwnProperty('pass') || trim(opt.pass) == ""){
        throw new Error('pass required.');
    }

    if(!opt.hasOwnProperty('url') || trim(opt.url) == ""){
        throw new Error('api url required.');
    }

    // 设置全局对象属性
    this.uname = opt.uname;
    this.pass  = opt.pass;
    this.url = opt.url;  // api remote address.
}

/**
 * 签名处理
 * @name   signature
 * @param  {Object} opt  (请求参数对象)
 * @return {String} sign (签名)
 */


Ticket.prototype.signature = function(opt){
    return md5((md5(qs.stringify(objectSort(opt)))+this.pass)).toUpperCase();
};

/**
 * 发起接口调用
 * @name  request
 * @param {Object}   opt
 * @param {Function} callback
 */

Ticket.prototype.request = function(opt, callback){
    request.post(this.url, {form:opt}, function (err, res, body) {
        if(err) return callback(err);
        return callback(null, JSON.parse(body));
    });
};

/**
 * 门票列表接口
 * Examples:
 * ```
 * ticket.orderCreate(callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * Fail:
 * ```
 * {
 *   code:"0",
 *   message:"错误信息"
 * }
 *
 * ```
 * Success:
 * ```
 * {
 *   status: '1',
 *   message: '查询成功',
 *   pdcIds: [{
 *      pdcId: '1',
 *      pdcName: '成人票',
 *      pdcPrice: '1',
 *      days: '20'
 *   }]
 * }
 * ```
  *
 * @name  orderGetPdcId
 * @param {Function} callback (回调函数)
 */
Ticket.prototype.orderGetPdcId = function (callback) {
    if(arguments.length < 1 || typeof callback != 'function'){
        throw new Error('callback function required.');
    }
    var opt = {
        method: 'order_getpdcId',
        uname: this.uname
    };
    opt.sign = this.signature(opt);
    this.request(opt, callback);
};

/**
 * 购买接口
 * Example
 * ```
 * ticket.orderCreate({
 *   threeOrderId: '第三方系统订单编号',
 *   playDate:     '2016-11-08',
 *   mobile:       '手机号',
 *   pdcId:        '1',
 *   pdcPrice:     '100',
 *   checkNum:     '1',
 *   pCount:       '1',
 *   certNo:       '客户身份证号',
 *   money:        '100',
 *   localPay:     '0'
 * }, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * Fail:
 * ```
 * {
 *   code:"0",
 *   message:"错误信息"
 * }
 *
 * ```
 * Success:
 * ```
 *{"status":"0",
 *   "orderId":"T15090600000001",
 *   "message":"查询成功",
 *   "ticketCodes":[
 *       {"pdcId":"1","ticketCode":"010000016813"},
 *       {"pdcId":"2","ticketCode":"010000016814"}]
 *}
 * ```


 *  @name  orderCreate          (购票接口)
 *  @param opt      {Object}    (订单数据对象)
 *  @param callback {Function}  (回调函数)
 */
Ticket.prototype.orderCreate = function(opt, callback){
    if(arguments.length < 1){
        throw  new Error('please provide options and callback');
    }

    if(typeof opt != 'object'){
        throw new Error('booking options object required.');
    }

    if(typeof opt == 'function'){
        // 错误
        return opt(new Error('booking options object required.'));
    }

    if(!opt.hasOwnProperty('threeOrderId') || trim(opt.threeOrderId) == ""){
        return callback(new Error('options.threeOrderId required.'));
    }

    if(!opt.hasOwnProperty('playDate') || trim(opt.playDate) == ""){
        return callback(new Error('options.playDate required.'));
    }

    if(!opt.hasOwnProperty('mobile') || trim(opt.mobile) == ""){
        return callback(new Error('options.mobile required.'));
    }

    if(!opt.hasOwnProperty('pdcId') || trim(opt.pdcId) == ""){
        return callback(new Error('options.pdcId required.'));
    }

    if(!opt.hasOwnProperty('pdcPrice') || trim(opt.pdcPrice) == ""){
        return callback(new Error('options.pdcPrice required.'));
    }

    if(!opt.hasOwnProperty('pCount') || trim(opt.pCount) == ""){
        return callback(new Error('options.pCount required.'));
    }

    if(!opt.hasOwnProperty('checkNum') || trim(opt.checkNum) == ""){
        return callback(new Error('options.checkNum required.'));
    }

    if(!opt.hasOwnProperty('money') || trim(opt.money) == ""){
        return callback(new Error('options.money required.'));
    }

    if(!opt.hasOwnProperty('localPay') || trim(opt.localPay) == ""){
        return callback(new Error('options.localPay required.'));
    }

    var threeOrderId    = opt.threeOrderId,
        playDate        = opt.playDate,
        mobile          = opt.mobile,
        pdcId           = opt.pdcId,
        pdcPrice        = opt.pdcPrice,
        pCount          = opt.pCount,
        certNo          = opt.certNo ? opt.certNo: "",
        money           = opt.money;


    // 时间验证
    if(!validator.isDate(playDate)){
        return callback(new Error('playDate invalid.'));
    }
    // 手机号验证
    if(!validator.isMobilePhone(mobile, 'zh-CN')){
        return callback(new Error('mobile invalid.'));
    }
    // pdcId, pdcPrice, pCount 联合校验
    if(pdcId.split('|').length != pdcPrice.split('|').length || pdcId.split('|').length != pCount.split('|').length || pdcPrice.split('|').length != pCount.split('|').length){
        return callback(new Error('pdcId, pdcPrice, pCount not match'));
    }

    // 匹配问题

    var args = {
        method: 'order_create',
        uname:  this.uname,
        threeOrderId: threeOrderId,
        playDate:     playDate,
        pdcId:        pdcId,
        pdcPrice:     pdcPrice,
        pCount:       pCount,
        certNo:       certNo,
        money:        money
    };
    args.sign = this.signature(args);
    this.request(args, callback);
};

/**
 *  退票接口
 *  Example
 *  ```
 *  ticket.orderCancel({
 *      threeOrderId: '第三方系统订单编号',
 *      orderId:      '易高系统订单编号',
 *      ticketCode:   '票号'
 *  }, function(err, result){
 *      console.log(err || result);
 *  })
 *  ```
 *  Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * Fail:
 * ```
 * {
 *   code:"0",
 *   message:"错误信息"
 * }
 * ```
 * Success:
 * ```
 * {
 *   code:"0",
 *   message:"申请退票成功"
 * }
 * ```
 *  @name  orderCancel         (订单退订接口)
 *  @param {Object}   opt      (参数对象)    {Object{orderId:"", threeOrderId:"",ticketCode:""}}
 *  @param {Function} callback (回调函数)
 */
Ticket.prototype.orderCancel = function (opt, callback) {
    if(arguments.length < 1 || typeof opt !== 'object'){
        // 错误
        throw new Error('Params Invalid.');
    }

    if(!opt.hasOwnProperty('orderId') || trim(opt.orderId) == ""){
        return callback(new Error('orderId required'));
    }

    if(!opt.hasOwnProperty('threeOrderId') || trim(opt.threeOrderId) == ""){
        return callback(new Error('threeOrderId required'));
    }

    if(!opt.hasOwnProperty('ticketCode') || trim(opt.ticketCode) == ""){
        return callback(new Error('ticketCode required'));
    }

    var args = {
        method: 'order_cancel',
        uname: this.uname,
        orderId: opt.orderId,
        threeOrderId: opt.threeOrderId,
        ticketCode: opt.ticketCode
    };

    args.sign = this.signature(args);
    this.request(args, callback);
};

/**
 *  订单信息接口
 *  Example
 *  ```
 *  ticket.orderCancel({
 *      threeOrderId: '第三方系统订单编号',
 *      orderId:      '易高系统订单编号',
 *      ticketCode:   '票号'
 *  }, function(err, result){
 *      console.log(err || result);
 *  })
 *  ```
 *  Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * Fail:
 * ```
 * {
 *   code:"0",
 *   message:"错误信息"
 * }
 * ```
 * Success:
 * ```
 * {"status":"1",
 *      "message":"订单详情",
 *      "orderId":"T15090600000001",
 *      "orderStatus ":[
 *          {"pdcId":"1","ticketCode":"010000016813","orderStatus ":"1"},
 *          {"pdcId":"2","ticketCode":"010000016814","orderStatus ": "1"}]
 * }
 * ```
 *  @name  orderGetInfo              (获取订单状态)
 *  @param {String}   threeOrderId   (第三方系统订单编号)
 *  @param {Function} callback       (回调函数)
 *
 */
Ticket.prototype.orderGetInfo = function (threeOrderId, callback) {
    if(typeof threeOrderId == 'function'){
        //threeOrderId = threeOrderId.threeOrderId;
        return threeOrderId(new Error('threeOrderId param required.'));
    }

    if(typeof threeOrderId == 'object'){
        threeOrderId = threeOrderId.threeOrderId;
    }

    if(!threeOrderId || trim(threeOrderId) == ""){
        return callback(new Error('threeOrderId param required.'));
    }
    // 逻辑校验
    // 必须要有一个参数（字符串直接就是threeOrderId,如果是对象，则获取其中的threeOrderId)
    // 如果不符合条件就报错
    var args = {
        method: 'order_getinfo',
        uname: this.uname,
        threeOrderId: threeOrderId,
        orderId : threeOrderId.orderId?threeOrderId.orderId:'',
        ticketCode : threeOrderId.ticketCode?threeOrderId.ticketCode:''
    };
    args.sign = this.signature(args);
    this.request(args, callback);
};

/**
 *  消费通知接口
 *  Example
 *  ```
 *  ticket.ticketNotice(req, res, function(err, result){
 *      console.log(err || result);
 *  });
 *  ```
 *  Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * Fail:
 * ```
 * {
 *   code:"0",
 *   message:"错误信息"
 * }
 * ```
 * Success:
 * ```
 * {
 *  "status":"1",
 *  "message":"订单详情",
 *  "sign":"",
 *  "uname":"",
 *  "orderId":"T15090600000001",
 *  "threeOrderId":"",
 *  "ticketCode":"010000016813",
 * }
 * ```
 *  @name  ticketNotice          (消费通知接口)
 *  @param req      {Object}     (request对象)
 *  @param res      {Object}     (response对象)
 *  @param callback {Function}   (回调函数)
 */
Ticket.prototype.ticketNotice = function (req, res, callback) {
    var self = this;
    try{
        var data = req.body;
        if(!data.hasOwnProperty('method') || trim(data.method) == ""){
            throw new Error('method param not provide.');
            //return res.json({status:0, message:'method param not provide.'});
        }

        if(!data.hasOwnProperty('sign') || trim(data.sign) == ""){
            throw new Error('sign param not provide');
            //return res.json({status:0, message:'sign param not provide'});
        }

        if(!data.hasOwnProperty('uname') || trim(data.uname) == ""){
            throw new Error('uname param not provide');
            //return res.json({status:0, message:'uname param not provide'});
        }

        if(!data.hasOwnProperty('orderId') || trim(data.orderId) == ""){
            throw new Error('orderId param not provide');
            //return res.json({status:0, message:'orderId param not provide'});
        }

        if(!data.hasOwnProperty('threeOrderId') || trim(data.threeOrderId) == ""){
            throw new Error('threeOrderId param not provide');
            //return res.json({status:0, message:'threeOrderId param not provide'})
        }

        if(!data.hasOwnProperty('ticketCode') || trim(data.ticketCode) == ""){
            throw new Error('ticketCode param not provide.');
            //return res.json({status:0, message:''})
        }
    } catch (e){
        return res.json({status:0,message:e.message});
    }

    var method = data.method;
    var sign = data.sign;
    var uname = data.uname;
    var orderId = data.orderId;
    var threeOrderId = data.threeOrderId;
    var ticketCode = data.ticketCode;

    if(method != 'order_check'){
        return res.json({status:0, message:'method invalid'});
    }

    if(uname != self.uname){
        return res.json({status:0, message:'uname invalid'});
    }
    var params = {
        method: method,
        uname: uname,
        orderId: orderId,
        threeOrderId:threeOrderId,
        ticketCode:ticketCode
    };

    try{
        var check = self.signature(params);
    } catch (e){
        return res.json({status:0, message:'sign error'});
    }

    if(check != sign){
        return res.json({status:0, message:'sign invalid'});
    }

    // 验证通过
    return callback({
        orderId: orderId,
        threeOrderId:threeOrderId,
        ticketCode:ticketCode
    });
};

module.exports = Ticket;