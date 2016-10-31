/**
 * Created by mengkeys on 2016-10-31.
 */


/**
 * Copyright(c) yuncreate
 * Email: <yuncreate@163.com> (https://www.yuncreate.con)
 *
 * MIT Licensed
 *
 * Authors:
 *   mengkeys <mengkeys@hotmail.com>
 *
 *   易高售票系统API接口调用工具
 */

var md5    = require('md5');
var qs     = require('querystring');
var request = require('request');
var validator = require('validator');

/*
 * args options sort (参数对象排序)
 * 参数排序
 * 英文升序排列
 * 返回排序后的对象
 */

function objectSort(Obj){
    var result = {};
    var items = Object.keys(Obj).sort();
    for(var item in items){
        result[items[item]] = Obj[items[item]];
    }
    return result;
}

/* Create Object　*/
function Ticket(opt){
    if(arguments.length < 1 || typeof opt !== 'object'){
        throw new Error('options required');
    }

    // verify uname（检测账号）
    if(!opt.hasOwnProperty('uname')){
        throw new Error('uname required.');
    }

    // verify pass（检测密码）
    if(!opt.hasOwnProperty('pass')){
        throw new Error('pass required.');
    }

    if(!opt.hasOwnProperty('url')){
        throw new Error('api url required.');
    }

    // 设置全局对象属性
    this.uname = opt.uname;
    this.pass  = opt.pass;
    this.url = opt.url;  // api remote address.
}

/*
 * 接口请求参数处理
 * @param <Object> opt (请求参数对象)
 * @return <String> (签名)
 */

Ticket.prototype.signature = function(opt){
    console.log(objectSort(opt));
    return md5((md5(qs.stringify(objectSort(opt)))+this.pass)).toUpperCase();
};

/*
 * 发起接口调用
 */

Ticket.prototype.request = function(opt, callback){
    console.log(this.url);
    console.log(opt);
    request.post(this.url, {form:opt}, function (err, res, body) {
        if(err) return callback(err);
        return callback(null, JSON.parse(body));
    });
};

/*
 *  获取产品ID接口
 *  @param callback [Function]
 */
Ticket.prototype.getProductId = function (callback) {
    if(arguments.length < 1 || typeof callback != 'function'){
        throw new Error('please provide callback function');
    }
    var opt = {
        method: 'order_getpdcId',
        uname: this.uname
    };
    opt.sign = this.signature(opt);
    this.request(opt, callback);
};


/*
 *  下单接口
 *  @param opt      [Object]
 *  @param callback [Function]
 */
Ticket.prototype.booking = function(opt, callback){
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

    if(!opt.hasOwnProperty('threeOrderId')){
        return callback(new Error('options.threeOrderId required.'));
    }

    if(!opt.hasOwnProperty('playDate')){
        return callback(new Error('options.playDate required.'));
    }

    if(!opt.hasOwnProperty('mobile')){
        return callback(new Error('options.mobile required.'));
    }

    if(!opt.hasOwnProperty('pdcId')){
        return callback(new Error('options.pdcId required.'));
    }

    if(!opt.hasOwnProperty('pdcPrice')){
        return callback(new Error('options.pdcPrice required.'));
    }

    if(!opt.hasOwnProperty('pCount')){
        return callback(new Error('options.pCount required.'));
    }

    if(!opt.hasOwnProperty('checkNum')){
        return callback(new Error('options.checkNum required.'));
    }

    if(!opt.hasOwnProperty('money')){
        return callback(new Error('options.money required.'));
    }

    if(!opt.hasOwnProperty('localPay')){
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
    if(pdcId.split('|').length != pdcPrice.split('|').length != pCount.split('|')){
        return callback(new Error('pdcId, pdcPrice, pCount not match'));
    }

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

/*
 *  订单退订接口
 *  第三方平台通知本票务系统退票
 */

Ticket.prototype.cancelBooking = function (opt, callback) {
    if(arguments.length < 1 || typeof opt !== 'object'){
        // 错误
        throw new Error('Params Invalid.');
    }

    if(!opt.hasOwnProperty('orderId')){
        return callback(new Error('orderId required'));
    }

    if(!opt.hasOwnProperty('threeOrderId')){
        return callback(new Error('threeOrderId required'));
    }

    if(!opt.hasOwnProperty('ticketCode')){
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

/*
 *  获取订单状态
 */
Ticket.prototype.getBookingStatus = function (threeOrderId, callback) {
    if(typeof threeOrderId == 'function'){
        //threeOrderId = threeOrderId.threeOrderId;
        return threeOrderId(new Error('threeOrderId param required.'));
    }

    if(typeof threeOrderId == 'object'){
        threeOrderId = threeOrderId.threeOrderId;
    }

    if(!threeOrderId){
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

//
/*
 *  消费通知接口
 *  @param req      [Object]
 *  @param res      [Object]
 *  @param callback [Function]
 */
Ticket.prototype.notify = function (req, res, callback) {
    var self = this;
    try{
        var data = req.body;
        if(!data.hasOwnProperty('method')){
            return res.json({status:0, message:'method param not provide.'});
        }

        if(!data.hasOwnProperty('sign')){
            return res.json({status:0, message:'sign param not provide'});
        }

        if(!data.hasOwnProperty('uname')){
            return res.json({status:0, message:'uname param not provide'});
        }

        if(!data.hasOwnProperty('orderId')){
            return res.json({status:0, message:'orderId param not provide'});
        }

        if(!data.hasOwnProperty('threeOrderId')){
            return res.json({status:0, message:'threeOrderId param not provide'})
        }

        if(!data.hasOwnProperty('ticketCode')){
            return res.json({status:0, message:''})
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