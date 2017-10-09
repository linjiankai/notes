//js的浅拷贝和深拷贝

//适用于对象Object,数组Array等引用类型
// 浅拷贝只是单纯的拷贝，2个对象还是指向同一个引用地址，修改一个对象属性，其他对象也会跟着改变
// 深拷贝拷贝并开启一个新的栈，2个对象对应不同的引用地址，修改一个对象属性，其他对象不会改变

/* 浅拷贝 */
var dog = {name: 'tom', sex: 'male'};
var newdog = dog;
newdog.sex = 'female';
console.log(newdog)//{name: "tom", sex: "female"}
console.log(dog)//{name: "tom", sex: "female"} 改变了


/* 深拷贝 */
var cat = {name: 'jerry', sex: 'male'};
//es5 手动复制，或者循环变量复制
var newcat1 = {name: cat.name, sex: cat.sex};
newcat1.name =  "jerry2";

//es6 Object.assign
var newcat2 = Object.assign({}, cat);
newcat2.sex = 'female';
console.log(newcat1)//{name: "jerry2", sex: "male"}
console.log(newcat2)//{name: "jerry", sex: "female"}
console.log(cat)//{name: "jerry", sex: "male"} 没有改变

//注意：上述es6方法只能对一层对象有效，并不能完全深拷贝，比如：
var obj = {'10001': {id: '1', name: 'joke'}};
var newobj = Object.assign({}, obj)
newobj['10001'].id = '2';
console.log(newobj); 
console.log(obj); //{'10001': {id: '2', name: 'joke'}} id改变了

//递归深拷贝(对象和数组都可以通用哦)
function deepClone(obj){    
    if(!obj && typeof obj !== 'object'){      
      return;    
    }    
    var newObj= obj.constructor === Array ? [] : {};    
    for(var key in obj){       
      if(obj[key]){          
        if(obj[key] && typeof obj[key] === 'object'){  
          newObj[key] = obj[key].constructor === Array ? [] : {}; 
          //递归
          newObj[key] = deepClone(obj[key]);          
        }else{            
          newObj[key] = obj[key];         
        }       
      }    
    }    
    return newObj; 
}

var obj = {'10001': {id: '1', name: 'joke'}};
var newobj = deepClone(obj)
newobj['10001'].id = '2';
console.log(newobj); //{'10001': {id: '2', name: 'joke'}} 
console.log(obj); //{'10001': {id: '1', name: 'joke'}}

//JSON 方法
var data = {info: {a: 10}};
var data2 = JSON.parse(JSON.stringify(data));
data2.info.a = 20;
console.log(data) //{info: {a: 10}}; a没有改变
console.log(data2) //{info: {a: 20}};
//缺点： function无法转JSON(与疑问，待探索)

//jquery 方法
var jqData = {a: {b: {c: 'd'}}}
var jqData2 = $.extend(true, {}, jqData);
jqData2.a.b.c = 'e'
console.log(jqData) //{a: {b: {c: 'd'}}}
console.log(jqData2) //{a: {b: {c: 'e'}}} 