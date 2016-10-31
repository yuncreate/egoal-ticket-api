# 深圳易高科技票务系统API模块

## 安装模块

```js
npm install egoal-ticket-api
```

## 参数配置

```js
var config = {
    "uname":"客户名",
    "pass": "客户密码MD5加密32位字符串",
    "url":  "接口地址"
}
```

## 实例化对象

```js 
var egoal = require('egoal-ticket-api');

var ticket = new egoal(config);
```

## 获取产品接口

```js 
ticket.getProductId(function(err, result){
    console.log(err || result);
});
```

## 门票购买接口

```js
ticket.booking({
    threeOrderId: '你的订单编号',
    playDate:     '你的游玩日期',
    mobile:       '手机号',
    pdcId:        '产品1编号|产品2编号|产品3编号',
    pdcPrice:     '产品1价格|产品2价格|产品3价格',
    pCount:       '产品1数量|产品2数量|产品3数量',
    certNo:       '客户1身份证号码|客户2身份证号码|客户3身份证号码',
    money:        '订单总金额，分为单位'
}, function(err, result){
    console.log(err || result);
});
```

## 订单状态接口

```js
ticket.getBookingStatus('你自己系统的订单编号', function(err, result){
    console.log(err || result);
});

ticket.getBookingStatus({threeOrderId:"你自己系统的订单编号"}, function(err, result){
    console.log(err || result);
});
```

## 订单退订接口

```js
ticket.cancelBooking({
    orderId:        "易高系统订单编号",
    threeOrderId:   "你自己系统的订单编号",
    ticketCode:     "票号"
}, function(err, result){
    console.log(err || result);
});
```

## 消费通知接口

```js
ticket.notify(req, res, function(result){
    console.log(result);
    return res.json({status:1, message:'receive success.'});
});
```


## 相关链接

##### [易高官方文档](https://github.com/yuncreate/egoal-ticket-api/blob/master/%E6%98%93%E9%AB%98%E7%BD%91%E4%B8%8A%E8%B4%AD%E7%A5%A8%E7%B3%BB%E7%BB%9F%E6%8E%A5%E5%8F%A3%E8%AF%B4%E6%98%8E(V2.1).pdf)（官方V2.1PDF手册）
##### [Issues列表](https://github.com/yuncreate/egoal-ticket-api/issues)


##### 版权声明：本模块由[丽江云创信息技术有限公司](http://www.yuncreate.com)提供，并由[Mengkeys](http://www.mengkeys.com)负责维护。
