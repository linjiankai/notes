//arguments详解

//定义：arguments 是一个类似数组的对象, 对应于传递给函数的参数。

//1.arguments转数组
function fun(a,b){
    console.log(arguments)
    console.log(typeof arguments) //object
    console.log(arguments instanceof Array) //false
    var args3 = Array.prototype.slice.call(arguments); 
    var args4 = [].slice.call(arguments);
    var args1 = Array.from(arguments)
    var args2 = [...arguments];
    console.log(args1,args2,args3, args4) //[1,2]
}
fun(1,2)


//2.用arguments.length可以来查看实参和形参的个数是否一致：
function fun(a,b){
    console.log(arguments.length);
    console.log(add.length)
}
fun(1,2,3)

//3.用arguments.callee来让匿名函数实现递归(ES5严格模式已删除)
function create(n) {
    if (n <= 1){
        return 1;
    }else{
        return n * arguments.callee(n - 1);
    }
 }
 console.log(create(5)) // 120 (5 * 4 * 3 * 2 * 1)

//求传入的若干个数字（不能用数组显示传入）的和
//用arguments.length属性来实现
function add() {  
    //console.log("length", arguments.length);  
    var len = arguments.length;  
    var sum = 0;  
    for (var i = 0; i < len; ++i) {  
        sum += arguments[i];  
    }  
    return sum;  
};  
add(1,2,3,6,8);  

//用prototype属性来实现：
function add() {  
    return Array.prototype.reduce.call(arguments, function(n1, n2) {  
        return n1 + n2;  
    });     
  };  
add(1,2,3,6,8);  