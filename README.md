# 深圳易高科技门票系统API模块(丽江云创科技提供)

## 安装模块
```
npm install egoal-ticket-api
```

## 参数配置

```js
var config = {
    "uname":"客户名",
    "pass":"客户密码MD5加密32位字符串",
    "url":"接口地址"
}
```

## 实例化对象

```js 
var egoal = require('egoal');

var ticket = new egoal(config);
```

## 获取产品接口

```js 
ticket.getProductId(function(err, result){
    console.log(err || result);
});
```

## 门票购买接口

```
ticket.booking({
    threeOrderId: '你的订单编号',
    playDate:     '你的游玩日期',
    mobile:       '手机号',
    pdcId:        '产品1编号|产品2编号|产品3编号',
    pdcPrice:     '产品1价格|产品2价格|产品3价格',
    pCount:       '产品1数量|产品2数量|产品3数量',
    certNo:       opt.certNo ? opt.certNo: "",
    money:        opt.money
}, function(err, result){
    console.log(err || result);
});
```

## 订单状态接口

```
ticket.getBookingStatus(threeOrderId, function(err, result){
    console.log(err || result);
});
```

## 订单退订接口

```
ticket.cancelBooking({
    orderId:        "易高系统订单编号",
    threeOrderId:   "你自己系统的订单编号",
    ticketCode:     "票号"
}, function(err, result){
    console.log(err || result);
});
```

## 消费通知接口

```
ticket.notify(req, res, function(result){
    console.log(result);
    return res.json({status:1, message:'receive success.'});
});
```

## 历史记录

2016-10-31 V1.0.0 基于V2.1文档开发
