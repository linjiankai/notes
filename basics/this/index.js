//this引发的思考

//ES5, this永远指向最后调用它的那个对象(看懂这句话就行了)
//案例1
var name = "Tom";
function fun() {
    var name = "Jerry";
    console.log(this.name);    // Tom
    console.log("inner:" + this);    // inner: Window
}
fun(); //函数fun前面没有调用对象那就是全局对象
console.log("outer:" + this)   // outer: Window

//注： 在严格模式下，全局对象就是 undefine，会报错

//案例2
var name = "Tom";
var a = {
    name: "Jerry",
    fn : function () {
        console.log(this.name);      // Jerry
    }
}
a.fn();//函数fn是对象 a调用的
window.a.fn();  //还是a调用的
var f = a.fn;
f() //window调用

//改变this的指向
//1.使用 ES6 的箭头函数
//2.在函数内部使用 _this = this
//3.使用 apply、call、bind
//4. new 实例化一个对象

//案例3
var name = "Tom";
var a = {
    name : "Jerry",
    fun: function () {
        setTimeout(function () {
            console.log(this.name)
        },100);
    }
};
a.fun() //Tom, 调用 setTimeout 的对象是 window;,setTimeout相当于匿名函数的 this 永远指向 window


//解决方法
//箭头函数
var name = "Tom";
var a = {
    name : "Jerry",
    fun1: function () {
        setTimeout (() => {
            console.log(this.name)
        }, 1000);
    }
};
a.fun1() //Jerry

//_this
var name = "Tom";
var a = {
    name : "Jerry",
    fun2: function () {
        var _this = this;
        setTimeout(function () {
            console.log(_this.name)
        },100);
    }
};
a.fun2() 

//apply、call、bind
var name = "Tom";
var a = {
    name : "Jerry",
    fun3: function () {
        setTimeout(function () {
            console.log(this.name)
        }.apply(a),100);
        setTimeout(function () {
            console.log(this.name)
        }.call(a),100);
        setTimeout(function () {
            console.log(this.name)
        }.bind(a)(),100);
    },
};
a.fun3();

//new 
function fn(id){
    this.id = id;
    this.num = 1;
}
var a = new fn(10001);
console.log(a.num, a.id); //1， 10001
//为什么this.指向a
//==> 首先new关键字会创建一个空的对象，然后会自动调用一个函数apply方法，将this指向这个空对象，这样的话函数内部的this就会被这个空的对象替代。

//经典的面试题， new的过程
var a = new fn(10001);
new fn
{
    var obj = {};
    obj.__proto__ = fn.prototype;
    var result = fn.call(obj,10001);
    return typeof result === 'obj'? result : obj;
}
// 1.创建一个空对象 obj;
// 2.将新创建的空对象的隐式原型指向其构造函数的显式原型。
// 3.使用 call 改变 this 的指向
// 4.如果无返回值或者返回一个非对象值，则将 obj 返回作为新对象；如果返回值是一个新对象的话那么直接直接返回该对象。

//当this遇到return时
function fn()  
{  
    this.num = 1;  
    return {};   //undefined
    // return function(){};   //undefined
    // return 1; //1
    // return undefined; //1
    // return null; //1
}
var a = new fn;  
console.log(a.user);
//　如果返回值是一个对象，那么this指向的就是那个返回的对象，如果返回值不是一个对象那么this还是指向函数的实例。(上述第4步)


//补充:
var name = "Tom";
function fn() {
    var name = 'Jerry';
    innerFunction();
    function innerFunction() {
        console.log(this.name);      // Tom
    }
}
fn();
//见函数调用page
