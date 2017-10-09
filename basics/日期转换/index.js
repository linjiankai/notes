//日期，时间戳转换

//获取当前时间, 注意这个时间是电脑系统自身时间，非服务器时间。
var data = new Date(); //Mon Sep 18 2017 16:31:35 GMT+0800 (中国标准时间)

//返回自 1970-1-1 00:00:00  UTC (世界标准时间)至今所经过的毫秒数。
var timestamp1 = Date.now(); 

//解析一个表示日期的字符串，并返回从 1970-1-1 00:00:00 所经过的毫秒数。
//Date对象转时间戳的方法
var timestamp2 = Date.parse(new Date());
var differ = timestamp1/1000-timestamp2/1000 //<1, 说明上面2个时间戳相差不超过1秒，原因是获取的时间戳是把毫秒改成000显示了

var timestamp3 = (new Date()).valueOf();

var timestamp4 = new Date().getTime();

console.log(timestamp1,timestamp2,timestamp3,timestamp4)

//获取时间的各个部分
data.getYear();        //获取当前年份(2位)
data.getFullYear();    //获取完整的年份(4位,1970-????)
data.getMonth();       //获取当前月份(0-11,0代表1月), 所以获取正确的月份是data.getMonth() + 1;
data.getDate();        //获取当前日(1-31)
data.getDay();         //获取当前星期X(0-6,0代表星期天),同月份;
data.getTime();        //获取当前时间(从1970.1.1开始的毫秒数)
data.getHours();       //获取当前小时数(0-23)
data.getMinutes();     //获取当前分钟数(0-59)
data.getSeconds();     //获取当前秒数(0-59)
data.getMilliseconds();    //获取当前毫秒数(0-999)
data.toLocaleDateString();     //获取当前日期  //"2017/9/18"
data.toLocaleTimeString();     //获取当前时间  //"下午4:45:19"
data.toLocaleString( );        //获取日期与时间 //"2017/9/18 下午4:45:19"

//计算两个时间差
// 使用 Date 对象
var start = Date.now();
var end = Date.now() + 10;
var elapsed = end - start; // 运行时间的毫秒值

// 使用内建的创建方法
var start = new Date();
var end = new Date() + 11;
var elapsed = end.getTime() - start.getTime(); // 运行时间的毫秒值

//日期格式化  
//1. yyyy-MM-dd HH:mm:ss格式

//2.

// 判断闰年  
Date.prototype.isLeapYear = function(){   
    return (0 == this.getYear() % 4 && ((this.getYear() % 100 != 0) || (this.getYear() % 400 == 0)));   
}
new Date.isLeapYear();

//

