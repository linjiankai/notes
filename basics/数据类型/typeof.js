//判断类型

var str = 'abc';
var num = 123;
var bol = true;
var arr = [1, 2, 3];
var obj = {a: 'b'};
var s1 = null;
var s2 = undefined;
var fun = function(){};

//typeof 
typeof str; //"string"
typeof num; //"number"
typeof bol;//"boolean"
typeof arr; //"object"
typeof obj; //"object"
typeof s1; //"object"
typeof s2; //"undefined"
typeof fun; //function
//typeof 基本可以判断数据类型，但是null特殊，被认为一个空的对象引用

//附加：基础类型和引用类型的区别
//1.操作和内存在栈区；基础类型的拷贝：第2个值改变不会影响第1个值。
//2.引用在栈区，实际对象保存在堆区；引用类型的拷贝： 2个对象指向同一个引用地址，一个改变，其他也会改变。


//下面就是引用类型的判断方法(比如:object array)
//1.判断是否是数组
toString.call(arr) //"[object Array]" 
Object.prototype.toString.call(arr) //上面方法是这个的简写
arr instanceof Array //true
arr.constructor == Array; //true
Array.isArray(arr) //true

//2.判断是否为对象
obj instanceof Object //true
obj.constructor == Object // true
//判断是否为空对象
var emptyobj = {};
JSON.stringify(emptyobj) //"{}"
function isEmptyObj(obj){
    for(var key in obj){
        return true;
    }
    return false;
}
isEmptyObj(emptyobj) //false
isEmptyObj(obj) //true
//jq方法
$.isEmptyObject({}) //true