# cec_api

社区引擎活动API支持


## todo

- [x] 梳理整体API路由
- [x] 对接mongodb
- [x] Remote methods 测试
- [x] 完成用户登录逻辑
- [x] 基础测试数据导入
- [x] 前端接口开发
- [x] 前端接口权限控制

###test

activityId
583558bbdd516b9582543948

cid
5836d39a323ad5c038949c9e


###接口
####获取用户是否关注公共号
接口调用请求说明
> http请求方式: GET https://xxxx.xx.com?openid=OPENID

参数说明

参数|是否必须|说明
:----------- | :----------- | :-----------:
openid|是|普通用户的标识，对当前公众号唯一
返回说明
正常情况下，返回下述JSON数据包：
```
{
   "subscribe": 1
}
```
参数说明

| 参数 |说明 |
| --- | --- |
|subscribe |用户是否订阅该公众号标识，值为0时，代表此用户没有关注该公众号  |  
