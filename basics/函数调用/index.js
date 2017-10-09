//函数调用的方法

//1.作为一个函数调用
function a() {
    var name = "Tom"
    console.log(name);
}
a();

//2.在对象中，函数作为方法调用
//简单的调用
var a = {
    name: "Tom",
    fn: function () {
        console.log(this.name);
    }
}
a.fn()
//作为函数, 方法调用函数
var name = "Tom";
function fn() {
    var name = 'Jerry';
    innerFunction(); //作为一个函数调用（它就是作为一个函数调用的，没有挂载在任何对象上，所以对于没有挂载在任何对象上的函数，在非严格模式下 this 就是指向 window 的）
    function innerFunction() {
        console.log(this.name);      // Tom
    }
}
fn();

//经典面试题
var length = 10;
function fn() {
    console.log( this.length ); // 10
}
var obj = {
    length: 5,
    method: function ( fn ) {
        fn();   // 10 前面没有引导对象，是函数调用模式
        arguments[ 0 ](); // 2
        // arguments是一个伪数组对象, 这里调用相当于通过数组的索引来调用.
        // 这里 this 就是 指的这个伪数组， 所以 this.length 为 2
    }
};
obj.method( fn, 1 );    // 打印 10 和 2
//obj.method( fn, 1， 2， 3 );    // 打印 10 和 4

//3.使用构造函数调用函数
function Character() {
    this.name = 'Tom',
    this.age = 5;
    this.kind = 'dog';
}
var p = new Character();
console.log(p)

//经典面试题
function Foo(){
    getName = function(){ console.log(1); };
    return this;
}
Foo.getName = function(){ console.log(2); };
Foo.prototype.getName = function(){ console.log(3); };
var getName = function(){ console.log(4); };
function getName(){ console.log(5); }  //被覆盖，无法运行; 可以删除 

Foo.getName();  // ------- 输出 2 -------
// 调用 Foo函数 作为 对象 动态添加的属性方法 getName
// Foo.getName = function () { console.log(2); };

getName();      // ------- 输出 4 -------
// 这里 Foo函数 还没有执行，getName还没有被覆盖
// 所以 这里还是 最上面的 getName = function () { console.log(4); };

Foo().getName();    // ------- 输出 1 -------
// Foo()执行，先覆盖全局的 getName 再返回 this，
// this 是 window, Foo().getName() 就是调用 window.getName
// 此时 全局的 getName已被覆盖成 function () { console.log(1); };
// 所以 输出 1
/* 从这里开始 window.getName 已被覆盖 console.log 1 */

getName();  // -------- 输出 1 --------
// window.getName console.log(1);

new Foo.getName();     // ------- 输出 2 -------
// new 就是 找 构造函数()，由构造函数结合性，这里即使 Foo无参，也不能省略 (),所以不是 Foo().getName()
// 所以 Foo.getName 为一个整体，等价于 new (Foo.getName)();
// 而 Foo.getName 其实就是函数 function () { console.log(2); } 的引用
// 那 new ( Foo.getName )(), 就是在以 Foo.getName 为构造函数 实例化对象。
// 就 类似于 new Person(); Person 是一个构造函数

// 总结来看 new ( Foo.getName )(); 就是在以 function () { console.log(2); } 为构造函数来构造对象
// 构造过程中 console.log（ 2 ），输出 2

new Foo().getName();    // ------- 输出 3 -------
// new 就是 找 构造函数(),等价于 ( new Foo() ).getName();
// 执行 new Foo() => 以 Foo 为构造函数，实例化一个对象
// ( new Foo() ).getName; 访问这个实例化对象的 getName 属性
// 实例对象自己并没有 getName 属性，构造的时候也没有 添加，找不到，就到原型中找
// 发现 Foo.prototype.getName = function () { console.log(3); };
// 原型中有，找到了，所以 ( new Foo() ).getName(); 执行，console.log（3）

var p = new new Foo().getName();     // ------- 输出 3 -------
// new 就是 找 构造函数(),等价于 new ( ( new Foo() ).getName )() 输出 3

// 先看里面的 ( new Foo() ).getName
// new Foo() 以Foo为构造函数，实例化对象
// new Foo().getName 找 实例对象的 getName属性，自己没有，去原型中找，
// 发现 Foo.prototype.getName = function () { console.log(3); }; 找到了

// 所以里层 ( new Foo() ).getName 就是 以Foo为构造函数实例出的对象的 一个原型属性
// 属性值为一个函数 function () { console.log(3); } 的引用

// 所以外层 new ( (new Foo()).getName )()在以该函数 function () { console.log(3); } 为构造函数，构造实例
// 构造过程中 执行了 console.log(3)， 输出 3

//4.上下文调用模式,call, apply
//存在上下文调用的目的就是为了实现方法借用，且不会污染对象。
//apply和call第一个参数一样：表示使用那个对象来调用函数；apply第二个参数是：是一个数组或伪数组，数组的值做为函数的参数被传入；call第二个参数是：是基本数据类型（number string boolean);
var color = "red";
var o = { color: "blue" };
 function sayColor() {
   console.info(this,this.color);
}
sayColor(); //window "red"
sayColor.call(this); //window "red"
sayColor.call(window); //window "red"
sayColor.call(o); //Object "blue"

//
function add(c,d){
    return this.a + this.b + c + d;
  }
  var o = {
    a: 1,
    b: 2        
  }
  add.call(o,3,4)  // 10
  add.apply(o,[3,4])  // 10
