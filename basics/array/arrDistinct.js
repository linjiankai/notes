//数组去重

//1.定义一个新的数组，存放第一个元素，原数组再和新数组一一比较，不同存放新数组
function unique(arr) {
    var res = [arr[0]];
    for (var i = 1; i < arr.length; i++) {
        var repeat = false;
        for (var j = 0; j < res.length; j++) {
            if (arr[i] == res[j]) {
                repeat = true;
                break;
            }
        }
        if (!repeat) {
            res.push(arr[i]);
        }
    }
    return res;
}

//2.先排序在对比
function unique(arr) {
    var arr2 = arr.sort();
    var res = [arr2[0]];
    for (var i = 1; i < arr2.length; i++) {
        if (arr2[i] !== res[res.length - 1]) {
            res.push(arr2[i]);
        }
    }
    return res;
}

//3.利用对象的属性去重(推荐)
function unique(arr) {
    var res = [];
    var json = {};
    for (var i = 0; i < arr.length; i++) {
        if (!json[arr[i]]) {
            res.push(arr[i]);
            json[arr[i]] = 1;
        }
    }
    return res;
}

//4.利用下标查询
function unique(arr) {
    var newArr = [arr[0]];
    for (var i = 1; i < arr.length; i++) {
        if (newArr.indexOf(arr[i]) == -1) {
            newArr.push(arr[i]);
        }
    }
    return newArr;
}

//5.es6 Set方法
let arr = [1,2,3,3];
let resultarr = [...new Set(arr)];
console.log(resultarr);

//6.filter+indexOf,简化4方法
Array.prototype.unique = function() {
    return this.filter((item, index, arr) => arr.indexOf(item) === index);
}
[1,2,3,'4',3,4,3,1,'34',2].unique();


//上面适用于单元素，当对象数组时,只能适用于纯对象数组
Array.prototype.unique = function(key) {
    var arr = this;
    var res = [arr[0]];
    for (var i = 1; i < arr.length; i++) {
        if (key === undefined) {
            if (res.indexOf(arr[i]) == -1) {
                res.push(arr[i]);
            }
        } else {
            inner: {
                var has = false;
                for (var j = 0; j < res.length; j++) {
                    if (arr[i][key] == res[j][key]) {
                        has = true;
                        break inner;
                    }
                }
            }
            if (!has) {
                res.push(arr[i]);
            }
        }
    }
    return res;
}
[{ a: 1 }, { a: 2 }, { a: 1 }].unique('a');

//混合元素数组
var data = [1,2,1,'a','b','a',{ a: 1 }, { a: 2 }, {a: 1},[4,5], [5,6], [4,5]];